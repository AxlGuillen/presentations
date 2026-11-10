// API local del estudio de montaje (la vista «Estudio» de ReelForge, puerto 5001, habla con este servidor).
// La monta servidor-local.mjs; solo existe en local: vercel.json no la publica, y NO debe haber una carpeta
// api/ en la raíz del repo (Vercel la desplegaría como funciones).
//
//   GET  /api/decks[?desk=creator]          [{desk, deck, titulo, laminas, url}] — solo los decks con data-lamina
//   GET  /api/decks/<desk>/<deck>/laminas   lo mismo que manifest.json (+ ancho y alto), SIN renderizar; el
//                                           recorte y la caja salen del data-recorte del <deck-stage>, y
//                                           los clips de clips.json van tras su lámina (tipo: "clip")
//                                           (?alfa=mov|webm elige la extensión de `archivo`; mov por omisión)
//   POST /api/render {desk, deck, laminas?, alfa:'mov'|'webm', fps}   → 202 {job_id}
//   GET  /api/render/<job>                  progreso por lámina y, al terminar, las rutas absolutas
//
// Seguridad: solo atiende conexiones desde esta computadora (loopback y Host localhost, contra DNS rebinding);
// CORS solo para los orígenes de ReelForge; un POST con otro Origin (otra página del navegador) se rechaza, y
// exige JSON. No pasa por la contraseña de la galería: el middleware solo cubre «/».
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import {
  ID_VALIDO, CROP_DEFECTO, QUIETO_DEFECTO, leerSecciones, medidasDeck, cajaDe, recorteDe, tituloDe, buscarChrome,
  clavesDeLaminas, referencias, huellaArchivo, huellaDeCodigo, leerClips, sondearClip, entradaClip, insertarClips, ponerClips,
} from './laminas-lib.mjs';

/** Los orígenes de ReelForge: los mismos que acepta el modo capa de deck-stage.js. */
export const ORIGENES_REELFORGE = ['http://localhost:5001', 'http://127.0.0.1:5001'];
/** Escritorio → carpeta (relativa a la raíz del repo). */
export const ESCRITORIOS = { work: 'work', personal: 'personal', creator: 'creator' };
const FORMATOS = ['mov', 'webm'];
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
const HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const MAX_CUERPO = 64 * 1024;
const MAX_TRABAJOS = 50;

class ErrorHttp extends Error {
  constructor(status, mensaje) { super(mensaje); this.status = status; }
}
const decodificar = (s) => { try { return decodeURIComponent(s); } catch { throw new ErrorHttp(400, 'Ruta mal formada.'); } };

// ── Medir la duración de las timelines con un Chrome headless ──────────────

/**
 * `dur_anim` de cada lámina: abre el deck, activa cada lámina y le pregunta a su timeline (section.__tl), como
 * cuadros.mjs antes de renderizar. Devuelve { id: segundos }; sin GSAP o sin timeline, 0.
 */
export async function medirConChrome({ raiz, rel, ids }) {
  const chrome = buscarChrome();
  if (!chrome) throw new ErrorHttp(503, 'No encontré Chrome ni Edge instalados para medir las animaciones.');
  const { default: puppeteer } = await import('puppeteer-core');
  const servidor = http.createServer((req, res) => {
    let r = decodeURIComponent(req.url.split('?')[0]);
    if (r.endsWith('/')) r += 'index.html';
    const abs = path.join(raiz, r);
    if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end('no'); }
    const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'Content-Type': tipos[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise(r => servidor.listen(0, '127.0.0.1', r));
  const navegador = await puppeteer.launch({ executablePath: chrome, headless: 'new',
    args: ['--force-device-scale-factor=1', '--hide-scrollbars', '--disable-gpu-vsync', '--disable-frame-rate-limit',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  try {
    const pagina = await navegador.newPage();
    await pagina.goto(`http://127.0.0.1:${servidor.address().port}/${rel}/`, { waitUntil: 'networkidle0' });
    const info = await pagina.evaluate(() => { const ds = document.querySelector('deck-stage'); return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height'), gsap: !!window.gsap }; });
    const salida = Object.fromEntries(ids.map(id => [id, 0]));
    if (!info.gsap) return salida;
    await pagina.setViewport({ width: info.w, height: info.h, deviceScaleFactor: 1 });
    await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
    await pagina.evaluate(() => document.fonts.ready);
    const posiciones = await pagina.evaluate(() => [...document.querySelectorAll('deck-stage section')].map(s => s.getAttribute('data-lamina')));
    for (const id of ids) {
      const idx = posiciones.indexOf(id);
      salida[id] = await pagina.evaluate(async (i) => {
        const ds = document.querySelector('deck-stage');
        if (typeof ds._go === 'function') ds._go(i); else location.hash = '#' + (i + 1);
        const s = document.querySelectorAll('deck-stage section')[i];
        for (let e = 0; e < 40 && !s.__tl; e++) await new Promise(r => setTimeout(r, 25));
        return s.__tl ? s.__tl.duration() : 0;
      }, idx);
    }
    return salida;
  } finally {
    await navegador.close();
    servidor.closeAllConnections();
    servidor.close();
  }
}

// ── Renderizar con laminas.mjs ─────────────────────────────────────────────

/** Corre `node tools/laminas.mjs <deck> --alfa=<formato> --fps=N --solo=…` y avisa cada lámina que termina. */
export function renderConProceso({ raiz, rel, formato, fps, ids, alLista }) {
  return new Promise((ok, mal) => {
    const hijo = spawn(process.execPath, [path.join('tools', 'laminas.mjs'), rel, `--alfa=${formato}`, `--fps=${fps}`, `--solo=${ids.join(',')}`],
      { cwd: raiz, stdio: ['ignore', 'pipe', 'pipe'] });
    const cola = [];
    const recordar = (l) => { cola.push(l); if (cola.length > 15) cola.shift(); };
    let resto = '';
    const linea = (l) => { recordar(l); const m = /^\s*✓ (\S+)\s+[\d.]+ s \+/.exec(l); if (m && alLista) alLista(m[1]); };
    hijo.stdout.setEncoding('utf8').on('data', (d) => { resto += d; const ls = resto.split(/\r?\n/); resto = ls.pop(); ls.forEach(linea); });
    hijo.stderr.setEncoding('utf8').on('data', (d) => d.split(/\r?\n/).filter(Boolean).forEach(recordar));
    hijo.on('error', mal);
    hijo.on('close', (codigo) => {
      if (resto) linea(resto);
      if (codigo === 0) ok();
      else mal(new Error(`El render salió con código ${codigo}:\n${cola.join('\n')}`));
    });
  });
}

// ── La API ─────────────────────────────────────────────────────────────────

/**
 * @param {object} o
 * @param {string} o.raiz              raíz del repo (donde viven work/, personal/, creator/ y tools/)
 * @param {object} [o.escritorios]     escritorio → carpeta relativa a la raíz
 * @param {string[]} [o.origenes]      orígenes con CORS
 * @param {Function} [o.medirDuraciones]  ({raiz, rel, ids}) → { id: segundos }   (para pruebas)
 * @param {Function} [o.ejecutarRender]   ({raiz, rel, formato, fps, ids, alLista}) → Promise   (para pruebas)
 */
export function crearApi({ raiz, escritorios = ESCRITORIOS, origenes = ORIGENES_REELFORGE, medirDuraciones = medirConChrome, ejecutarRender = renderConProceso } = {}) {
  raiz = path.resolve(raiz);
  const trabajos = new Map();
  const midiendo = new Map();          // dir → promesa de la medición en curso (un solo Chrome por deck)
  let cola = Promise.resolve();        // un render a la vez: dos pisarían el mismo manifest.json

  const json = (res, estado, cuerpo, extra = {}) => {
    const t = JSON.stringify(cuerpo);
    res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(t), 'Cache-Control': 'no-store', ...extra });
    res.end(t);
  };

  // ── el deck ──
  function resolverDeck(desk, deck) {
    if (!Object.hasOwn(escritorios, desk)) throw new ErrorHttp(400, `Escritorio desconocido: ${desk}. Los hay: ${Object.keys(escritorios).join(', ')}.`);
    if (!ID_VALIDO.test(deck)) throw new ErrorHttp(400, `Nombre de deck inválido: ${deck}`);
    const rel = `${escritorios[desk]}/${deck}`;
    const dir = path.resolve(raiz, rel);
    if (!dir.startsWith(raiz + path.sep)) throw new ErrorHttp(400, 'Ruta inválida.');
    const index = path.join(dir, 'index.html');
    if (!fs.existsSync(index)) throw new ErrorHttp(404, `No existe el deck ${desk}/${deck}.`);
    const html = fs.readFileSync(index, 'utf8');
    const secciones = leerSecciones(html).filter(s => s.id);
    if (!secciones.length) throw new ErrorHttp(404, `El deck ${desk}/${deck} no tiene láminas (<section data-lamina="…">).`);
    let recorte;
    try { recorte = recorteDe(html); } catch (e) { throw new ErrorHttp(422, `${desk}/${deck}: ${e.message}`); }
    return { desk, deck, rel, dir, html, secciones, recorte, ...medidasDeck(html) };
  }

  const memoDecks = new Map();   // index.html → { mtimeMs, size, info }
  function resumenDeck(desk, deck) {
    const index = path.join(raiz, escritorios[desk], deck, 'index.html');
    let st;
    try { st = fs.statSync(index); } catch { return null; }
    const previo = memoDecks.get(index);
    if (previo && previo.mtimeMs === st.mtimeMs && previo.size === st.size) return previo.info;
    const html = fs.readFileSync(index, 'utf8');
    const n = leerSecciones(html).filter(s => s.id).length;
    const info = n ? { desk, deck, titulo: tituloDe(html) || deck, laminas: n, url: `/${escritorios[desk]}/${deck}/` } : null;
    memoDecks.set(index, { mtimeMs: st.mtimeMs, size: st.size, info });
    return info;
  }

  // ── GET /api/decks ──
  function listarDecks(url) {
    const pedido = url.searchParams.get('desk');
    if (pedido && !Object.hasOwn(escritorios, pedido)) throw new ErrorHttp(400, `Escritorio desconocido: ${pedido}.`);
    const out = [];
    for (const desk of pedido ? [pedido] : Object.keys(escritorios)) {
      const base = path.join(raiz, escritorios[desk]);
      if (!fs.existsSync(base)) continue;
      for (const d of fs.readdirSync(base, { withFileTypes: true })) {
        if (!d.isDirectory() || !ID_VALIDO.test(d.name)) continue;
        const info = resumenDeck(desk, d.name);
        if (info) out.push(info);
      }
    }
    return out.sort((a, b) => a.desk.localeCompare(b.desk) || a.deck.localeCompare(b.deck));
  }

  // ── GET /api/decks/<desk>/<deck>/laminas ──
  const archivoMeta = (dir) => path.join(dir, 'video-out', '.laminas-meta.json');
  async function duraciones(info) {
    // Se cachea por hash del index.html y de lo que carga (scripts, estilos: ahí viven las animaciones).
    const cascaron = info.html.replace(/<section\b[\s\S]*?<\/section>/g, '<section/>');
    const huella = crypto.createHash('sha256').update(info.html)
      .update(referencias(cascaron).map(r => `${r}:${huellaArchivo(path.resolve(info.dir, r)) || '-'}`).join('\n')).digest('hex');
    const ids = info.secciones.map(s => s.id);
    try {
      const guardado = JSON.parse(fs.readFileSync(archivoMeta(info.dir), 'utf8'));
      if (guardado.huella === huella && ids.every(id => typeof guardado.dur_anim[id] === 'number')) return guardado.dur_anim;
    } catch { /* sin caché */ }
    const clave = `${info.dir}|${huella}`;
    if (!midiendo.has(clave)) {
      midiendo.set(clave, (async () => {
        const dur = await medirDuraciones({ raiz, rel: info.rel, ids });
        fs.mkdirSync(path.dirname(archivoMeta(info.dir)), { recursive: true });
        fs.writeFileSync(archivoMeta(info.dir), JSON.stringify({ huella, dur_anim: dur }, null, 2));
        return dur;
      })().finally(() => midiendo.delete(clave)));
    }
    return midiendo.get(clave);
  }

  async function laminasDe(desk, deck, url) {
    const formato = url.searchParams.get('alfa') || 'mov';
    if (!FORMATOS.includes(formato)) throw new ErrorHttp(400, `alfa debe ser ${FORMATOS.join(' o ')}.`);
    const info = resolverDeck(desk, deck);
    const dur = await duraciones(info);
    const caja = cajaDe(info.recorte, info.alto);
    // Los clips de clips.json van tras su lámina, medidos en su origen (se copian al renderizar).
    let clips;
    try {
      clips = leerClips(info.dir, info.secciones.map(s => s.id)).map((c) => {
        if (!fs.existsSync(c.origen)) throw new Error(`no existe el clip «${c.id}» (${c.origen})`);
        return entradaClip(c, sondearClip(c.origen));
      });
    } catch (e) { throw new ErrorHttp(422, `${info.desk}/${info.deck}: ${e.message}`); }
    return insertarClips(info.secciones.map(s => {
      const d = Number.isFinite(dur[s.id]) ? Math.max(dur[s.id], 0) : 0;
      return { id: s.id, archivo: `${s.id}.${formato}`, png: `${s.id}.png`,
        dur_anim: +d.toFixed(3), dur: +(d + QUIETO_DEFECTO).toFixed(3),
        alfa: true, caja: { ...caja }, palabras: s.palabras, recorte: info.recorte, ...(s.reposo ? { reposo: true } : {}),
        ancho: info.ancho, alto: info.alto };
    }), clips);
  }

  // ── POST /api/render ──
  const archivoIndice = (dir) => path.join(dir, 'video-out', 'laminas-cache.json');
  const leerIndice = (dir) => { try { const j = JSON.parse(fs.readFileSync(archivoIndice(dir), 'utf8')); return j && j.claves ? j : { version: 1, claves: {} }; } catch { return { version: 1, claves: {} }; } };
  const carpetaSalida = (dir) => path.join(dir, 'video-out', 'laminas');
  const renderizador = () => huellaDeCodigo(['cuadros.mjs', 'laminas.mjs', 'laminas-lib.mjs'].map(f => path.join(raiz, 'tools', f)));

  function validarRender(b) {
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw new ErrorHttp(400, 'El cuerpo debe ser un objeto JSON.');
    if (typeof b.desk !== 'string' || typeof b.deck !== 'string') throw new ErrorHttp(400, 'Faltan desk y deck.');
    const formato = b.alfa === undefined ? 'mov' : b.alfa;
    if (!FORMATOS.includes(formato)) throw new ErrorHttp(400, `alfa debe ser ${FORMATOS.join(' o ')}.`);
    const fps = b.fps === undefined ? 30 : b.fps;
    if (!Number.isInteger(fps) || fps < 1 || fps > 60) throw new ErrorHttp(400, 'fps debe ser un entero entre 1 y 60.');
    const info = resolverDeck(b.desk, b.deck);
    let ids = info.secciones.map(s => s.id);
    if (b.laminas !== undefined) {
      if (!Array.isArray(b.laminas) || !b.laminas.length || b.laminas.some(x => typeof x !== 'string')) throw new ErrorHttp(400, 'laminas debe ser una lista de ids no vacía.');
      const falta = b.laminas.filter(x => !ids.includes(x));
      if (falta.length) throw new ErrorHttp(400, `El deck no tiene las láminas: ${falta.join(', ')}.`);
      ids = ids.filter(x => b.laminas.includes(x));       // en el orden del deck, sin repetidas
    }
    return { info, formato, fps, ids };
  }

  const vistaTrabajo = (j) => ({
    job_id: j.id, estado: j.estado, progreso: j.progreso, desk: j.desk, deck: j.deck, formato: j.formato, fps: j.fps,
    laminas: j.laminas.map(l => ({ ...l })),
    ...(j.error ? { error: j.error } : {}),
    ...(j.estado === 'listo' ? { carpeta: j.carpeta, manifest: j.manifest, anim: j.anim } : {}),
  });

  function actualizarProgreso(j) {
    const hechas = j.laminas.filter(l => l.estado === 'cacheada' || l.estado === 'lista').length;
    j.progreso = j.laminas.length ? Math.round(100 * hechas / j.laminas.length) : 100;
  }

  async function correrTrabajo(j) {
    try {
      j.estado = 'renderizando';
      const info = resolverDeck(j.desk, j.deck);
      const claves = clavesDeLaminas({ raiz, dir: info.dir, html: info.html,
        extra: { formato: j.formato, fps: j.fps, crop: info.recorte, quieto: QUIETO_DEFECTO, renderizador: renderizador() } });
      const indice = leerIndice(info.dir);
      const guardadas = indice.claves[j.formato] || (indice.claves[j.formato] = {});
      // El manifest.json es uno solo para todos los formatos: una lámina solo vale si su entrada es del formato pedido
      // (tras renderizar en webm, el manifest ya no describe los .mov aunque sus archivos sigan ahí).
      let enManifest = new Set();
      try {
        enManifest = new Set(JSON.parse(fs.readFileSync(path.join(carpetaSalida(info.dir), 'manifest.json'), 'utf8'))
          .filter(l => !l.tipo && l.alfa === true && l.archivo === `${l.id}.${j.formato}` && (l.recorte || CROP_DEFECTO) === info.recorte).map(l => l.id));
      } catch { /* sin manifest */ }
      const vale = (id) => guardadas[id] === claves.get(id) && enManifest.has(id)
        && fs.existsSync(path.join(carpetaSalida(info.dir), `${id}.${j.formato}`)) && fs.existsSync(path.join(carpetaSalida(info.dir), `${id}.png`));
      for (const l of j.laminas) l.estado = vale(l.id) ? 'cacheada' : 'pendiente';
      const pendientes = j.laminas.filter(l => l.estado === 'pendiente').map(l => l.id);
      actualizarProgreso(j);
      if (pendientes.length) {
        for (const l of j.laminas) if (l.estado === 'pendiente') l.estado = 'renderizando';
        await ejecutarRender({ raiz, rel: info.rel, formato: j.formato, fps: j.fps, ids: pendientes,
          alLista: (id) => { const l = j.laminas.find(x => x.id === id); if (l) { l.estado = 'lista'; actualizarProgreso(j); } } });
        for (const id of pendientes) guardadas[id] = claves.get(id);
        fs.mkdirSync(path.dirname(archivoIndice(info.dir)), { recursive: true });
        fs.writeFileSync(archivoIndice(info.dir), JSON.stringify(indice, null, 2));
        for (const l of j.laminas) if (l.estado === 'renderizando') l.estado = 'lista';
      }
      actualizarProgreso(j);
      // Los clips se reponen siempre, aunque todo saliera de la caché: clips.json no es parte de la clave.
      ponerClips({ dir: info.dir, destino: carpetaSalida(info.dir), idsLaminas: info.secciones.map(s => s.id) });
      j.carpeta = carpetaSalida(info.dir);
      j.manifest = path.join(carpetaSalida(info.dir), 'manifest.json');
      j.anim = path.join(info.dir, 'video-out', 'anim-alfa');
      j.estado = 'listo';
    } catch (e) {
      j.estado = 'error';
      j.error = e && e.message ? e.message : String(e);
      for (const l of j.laminas) if (l.estado === 'renderizando' || l.estado === 'pendiente') l.estado = 'error';
    }
  }

  function pedirRender(cuerpo) {
    const { info, formato, fps, ids } = validarRender(cuerpo);
    // Un pedido idéntico a uno que sigue en curso es el mismo trabajo (un doble clic no rinde dos veces).
    const firma = JSON.stringify([info.desk, info.deck, formato, fps, ids]);
    for (const j of trabajos.values()) if (j.firma === firma && (j.estado === 'en_cola' || j.estado === 'renderizando')) return j;
    const j = { id: crypto.randomBytes(6).toString('hex'), firma, estado: 'en_cola', progreso: 0, desk: info.desk, deck: info.deck, formato, fps,
      laminas: ids.map(id => ({ id, estado: 'pendiente' })) };
    trabajos.set(j.id, j);
    while (trabajos.size > MAX_TRABAJOS) trabajos.delete(trabajos.keys().next().value);
    cola = cola.then(() => correrTrabajo(j));
    return j;
  }

  // ── HTTP ──
  async function leerJson(req) {
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw new ErrorHttp(415, 'El cuerpo debe ser application/json.');
    const partes = [];
    let tam = 0;
    for await (const c of req) {
      tam += c.length;
      if (tam > MAX_CUERPO) throw new ErrorHttp(413, 'El cuerpo es demasiado grande.');
      partes.push(c);
    }
    try { return JSON.parse(Buffer.concat(partes).toString('utf8')); } catch { throw new ErrorHttp(400, 'El cuerpo no es JSON válido.'); }
  }

  /** Atiende las rutas /api/*. Devuelve true si la petición era suya (siempre que empiece por /api/). */
  async function manejar(req, res, url) {
    if (!url.pathname.startsWith('/api/')) return false;
    // CORS va en TODAS las respuestas (también en los errores), o ReelForge no podría leer el mensaje.
    const origen = req.headers.origin;
    const permitido = !!origen && origenes.includes(origen);
    const cors = permitido ? { 'Access-Control-Allow-Origin': origen, Vary: 'Origin' } : { Vary: 'Origin' };
    try {
      const host = (req.headers.host || '').replace(/:\d+$/, '');
      if (!LOOPBACK.has(req.socket.remoteAddress) || !HOSTS.has(host)) throw new ErrorHttp(403, 'Esta API solo responde desde esta computadora.');
      if (req.method === 'OPTIONS') {
        if (origen && !permitido) throw new ErrorHttp(403, 'Origen no permitido.');
        res.writeHead(204, { ...cors, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' });
        res.end();
        return true;
      }
      // Una página cualquiera del navegador puede mandar un POST «simple» sin pasar por el preflight: no se acepta.
      if (req.method === 'POST' && origen && !permitido) throw new ErrorHttp(403, 'Origen no permitido.');
      const responder = (estado, cuerpo, extra) => json(res, estado, cuerpo, { ...cors, ...extra });

      const ruta = url.pathname.replace(/\/+$/, '');
      let m;
      if (ruta === '/api/decks') {
        if (req.method !== 'GET') throw new ErrorHttp(405, 'Método no permitido.');
        responder(200, listarDecks(url));
      } else if ((m = /^\/api\/decks\/([^/]+)\/([^/]+)\/laminas$/.exec(ruta))) {
        if (req.method !== 'GET') throw new ErrorHttp(405, 'Método no permitido.');
        responder(200, await laminasDe(decodificar(m[1]), decodificar(m[2]), url));
      } else if (ruta === '/api/render') {
        if (req.method !== 'POST') throw new ErrorHttp(405, 'Método no permitido.');
        const j = pedirRender(await leerJson(req));
        responder(202, { job_id: j.id });
      } else if ((m = /^\/api\/render\/([^/]+)$/.exec(ruta))) {
        if (req.method !== 'GET') throw new ErrorHttp(405, 'Método no permitido.');
        const j = trabajos.get(decodificar(m[1]));
        if (!j) throw new ErrorHttp(404, 'No existe ese trabajo.');
        responder(200, vistaTrabajo(j));
      } else {
        throw new ErrorHttp(404, 'No existe esa ruta de la API.');
      }
    } catch (e) {
      const estado = e instanceof ErrorHttp ? e.status : 500;
      if (estado === 500) console.error('[api]', e);
      if (!res.headersSent) json(res, estado, { error: estado === 500 ? 'Error interno de la API local.' : e.message }, cors);
      else res.end();
    }
    return true;
  }

  return { manejar, trabajos };
}
