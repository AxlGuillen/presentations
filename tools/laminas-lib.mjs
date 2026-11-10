// Lo que comparten laminas.mjs y la API local del estudio de montaje (api-montaje.mjs):
// leer las láminas de un index.html y calcular la clave de caché de cada una.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

/** El recorte del panel del montaje: 1080×1370 desde y = 275 (el encuadre de los flyers de suiza). */
export const CROP_DEFECTO = '1080:1370:0:275';
/** Segundos del último cuadro que se dejan al final de cada lámina. */
export const QUIETO_DEFECTO = 1;
/** Lo que vale como id de lámina, de deck y de escritorio (también es parte de una ruta). */
export const ID_VALIDO = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

/** Las <section> de un index.html, en orden: `n` es su posición (1-based) y el NN de los archivos de salida.
 *  `reposo` es la banda decorada sin dato (data-reposo) con la que ReelForge llena los huecos entre láminas. */
export function leerSecciones(html) {
  return [...html.matchAll(/<section\b([^>]*)>/g)].map((m, i) => ({
    n: i + 1,
    id: (m[1].match(/data-lamina="([^"]+)"/) || [])[1],
    palabras: ((m[1].match(/data-palabras="([^"]+)"/) || [])[1] || '').split(',').map(p => p.trim()).filter(Boolean),
    reposo: /\sdata-reposo(?=[\s=>]|$)/.test(m[1]),
  }));
}

/** El tamaño de diseño del <deck-stage> (los decks verticales son 1080×1920). */
export function medidasDeck(html) {
  const ds = (html.match(/<deck-stage\b[^>]*>/) || [''])[0];
  return { ancho: +((ds.match(/\bwidth="(\d+)"/) || [])[1] || 1080), alto: +((ds.match(/\bheight="(\d+)"/) || [])[1] || 1920) };
}

/** Lo que vale como recorte: W:H:X:Y en píxeles enteros, como el `crop` de FFmpeg. */
export const RECORTE_VALIDO = /^\d+:\d+:\d+:\d+$/;

/** Falla si el recorte no es W:H:X:Y o no cabe en el lienzo del deck. */
export function validarRecorte(recorte, { ancho, alto }) {
  if (!RECORTE_VALIDO.test(recorte)) throw new Error(`Recorte inválido: «${recorte}» (debe ser W:H:X:Y, como 1080:680:0:1240).`);
  const [w, h, x, y] = recorte.split(':').map(Number);
  if (!w || !h) throw new Error(`Recorte inválido: «${recorte}» (ancho y alto deben ser mayores que 0).`);
  if (x + w > ancho || y + h > alto) throw new Error(`El recorte ${recorte} se sale del lienzo de ${ancho}×${alto}.`);
  return recorte;
}

/**
 * El recorte del panel que declara el deck (<deck-stage data-recorte="1080:680:0:1240">), validado contra su
 * lienzo; sin el atributo, CROP_DEFECTO.
 */
export function recorteDe(html) {
  const ds = (html.match(/<deck-stage\b[^>]*>/) || [''])[0];
  const r = (ds.match(/\bdata-recorte="([^"]*)"/) || [])[1];
  return r === undefined ? CROP_DEFECTO : validarRecorte(r.trim(), medidasDeck(html));
}

/** La caja del panel en las claves del montaje de ReelForge: el recorte va centrado a lo ancho y se mide desde abajo del lienzo. */
export function cajaDe(crop, altoDeck) {
  const [cw, ch, , cy] = crop.split(':').map(Number);
  return { width: cw, x: 'center', bottom: altoDeck - (cy + ch) };
}

export function tituloDe(html) {
  const t = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1];
  return t ? t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : '';
}

/** Chrome o Edge instalados (el mismo orden que cuadros.mjs), o null. */
export const buscarChrome = () => [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p)) || null;

// ── Claves de caché ──────────────────────────────────────────────────────

const sha = (...partes) => { const h = crypto.createHash('sha256'); for (const p of partes) h.update(p); return h.digest('hex'); };

// Hash de archivos ya leídos, por ruta + fecha + tamaño: un asset que no cambió no se vuelve a leer.
const memoArchivos = new Map();
export function huellaArchivo(abs) {
  let st;
  try { st = fs.statSync(abs); } catch { return null; }
  if (!st.isFile()) return null;
  const k = `${abs}|${st.mtimeMs}|${st.size}`;
  let h = memoArchivos.get(k);
  if (!h) { h = sha(fs.readFileSync(abs)); memoArchivos.set(k, h); }
  return h;
}

/** Rutas locales a las que apunta un trozo de HTML: src, href, data-src, poster y url(...). */
export function referencias(trozo) {
  const out = new Set();
  for (const m of trozo.matchAll(/\b(?:src|href|data-src|poster)\s*=\s*"([^"]+)"/g)) out.add(m[1]);
  for (const m of trozo.matchAll(/url\(\s*(?:&quot;|["'])?([^"')&\s]+)/g)) out.add(m[1]);
  return [...out]
    .filter(r => r && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(r))   // http:, data:, mailto:, //cdn…, #ancla
    .map(r => { const s = r.split(/[?#]/)[0]; try { return decodeURIComponent(s); } catch { return s; } })
    .sort();
}

/** sha256 de lo que un trozo de HTML carga de disco (los que no existen cuentan como «faltante»). */
function huellaDeReferencias(trozo, dir, raiz) {
  return referencias(trozo).map(r => {
    const abs = path.resolve(dir, r);
    const dentro = abs === raiz || abs.startsWith(raiz + path.sep);
    return `${r}:${dentro ? huellaArchivo(abs) || '-' : 'fuera'}`;
  }).join('\n');
}

/**
 * La clave de caché de cada lámina de un deck: cambia si cambia SU markup, sus imágenes (por contenido), el
 * resto de la página (estilos, scripts y los archivos que cargan: ahí viven las animaciones y deck-stage.js) o
 * lo que se pida (`extra`: formato, fps, versión del renderizador…). Así, editar el texto de una lámina solo
 * invalida esa lámina; tocar algo compartido las invalida todas, que es lo correcto.
 * Devuelve Map id → clave.
 */
export function clavesDeLaminas({ raiz, dir, html, extra = {} }) {
  const trozos = [];
  const cascaron = html.replace(/<section\b[\s\S]*?<\/section>/g, (s) => { trozos.push(s); return '<section/>'; });
  const secciones = leerSecciones(html);
  // Si hubiera <section> anidadas la partición no sirve: toda la página cuenta como compartida.
  const anidadas = trozos.length !== secciones.length;
  const base = sha(JSON.stringify(extra), anidadas ? html : cascaron, huellaDeReferencias(anidadas ? html : cascaron, dir, raiz));
  const claves = new Map();
  secciones.forEach((s, i) => {
    if (!s.id) return;
    claves.set(s.id, anidadas ? base : sha(base, trozos[i], huellaDeReferencias(trozos[i], dir, raiz)));
  });
  return claves;
}

/** sha256 de varios archivos (el renderizador: si cambia cuadros.mjs o laminas.mjs, lo cacheado ya no vale). */
export function huellaDeCodigo(archivos) {
  return sha(...archivos.map(f => huellaArchivo(f) || '-'));
}

// ── Clips en el manifest ─────────────────────────────────────────────────
// Un deck puede pedir clips de video ya cortados (material del canal: un gank, un draft…) en su
// manifest, para que el montaje los ponga encima en su sitio. Se declaran en `<deck>/clips.json`:
//   [{ "id": "gank-min2", "origen": "C:/…/Gank minuto 2.mp4", "despues": "vt-caedrel", "palabras": ["minuto dos"] }]
// `despues` es la lámina tras la que va en el manifest (el orden del guion); `palabras`, opcional.
// No se dibujan ni se renderizan: se copian tal cual a video-out/laminas/<id>.<ext>, con un <id>.png
// (su último cuadro), y entran en el manifest como { tipo: "clip", id, archivo, png, dur, ancho, alto, … }.

const EXT_CLIP = ['mp4', 'mov', 'webm'];

/** Los clips de `<dir>/clips.json`, validados ([] si no hay archivo). */
export function leerClips(dir, idsLaminas = []) {
  const f = path.join(dir, 'clips.json');
  if (!fs.existsSync(f)) return [];
  let lista;
  try { lista = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { throw new Error(`clips.json no es JSON válido: ${e.message}`); }
  if (!Array.isArray(lista)) throw new Error('clips.json debe ser una lista.');
  const vistos = new Set();
  return lista.map((c, i) => {
    const donde = `clips.json[${i}]`;
    if (!c || typeof c !== 'object' || !ID_VALIDO.test(c.id || '')) throw new Error(`${donde}: id inválido.`);
    if (vistos.has(c.id) || idsLaminas.includes(c.id)) throw new Error(`${donde}: el id «${c.id}» ya existe (los clips no pueden repetir id ni chocar con una lámina).`);
    vistos.add(c.id);
    if (typeof c.origen !== 'string' || !c.origen) throw new Error(`${donde}: falta «origen» (la ruta del video).`);
    const origen = path.resolve(dir, c.origen);
    const ext = path.extname(origen).slice(1).toLowerCase();
    if (!EXT_CLIP.includes(ext)) throw new Error(`${donde}: «${path.basename(origen)}» no es ${EXT_CLIP.join(', ')}.`);
    if (c.despues !== undefined && c.despues !== null && !idsLaminas.includes(c.despues)) throw new Error(`${donde}: la lámina «${c.despues}» no existe.`);
    const palabras = c.palabras === undefined ? [] : c.palabras;
    if (!Array.isArray(palabras) || palabras.some(p => typeof p !== 'string' || !p.trim())) throw new Error(`${donde}: «palabras» debe ser una lista de textos.`);
    return { id: c.id, origen, ext, despues: c.despues ?? null, palabras: palabras.map(p => p.trim()) };
  });
}

/** Ancho, alto y duración de un video, con ffprobe. */
export function sondearClip(archivo) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', archivo], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffprobe no pudo leer ${archivo}: ${(r.stderr || '').trim()}`);
  const j = JSON.parse(r.stdout), s = (j.streams || [])[0] || {};
  return { ancho: s.width, alto: s.height, dur: +(+j.format.duration).toFixed(3) };
}

/** La entrada del manifest de un clip (sin tocar disco más que para medirlo). */
export function entradaClip(c, medidas) {
  return { id: c.id, tipo: 'clip', archivo: `${c.id}.${c.ext}`, png: `${c.id}.png`, dur: medidas.dur, ancho: medidas.ancho, alto: medidas.alto,
    ...(c.despues ? { despues: c.despues } : {}), palabras: c.palabras };
}

/** Quita los clips del manifest y los vuelve a meter, cada uno tras su lámina (o al final), en el orden de clips.json. */
export function insertarClips(manifest, entradas) {
  const salida = manifest.filter(l => l.tipo !== 'clip');
  for (const e of entradas) {
    let i = salida.length;
    if (e.despues) {
      const k = salida.findIndex(l => l.id === e.despues);
      if (k >= 0) { i = k + 1; while (i < salida.length && salida[i].tipo === 'clip') i++; }
    }
    salida.splice(i, 0, e);
  }
  return salida;
}

/**
 * Copia los clips de clips.json a `destino` (solo si cambiaron), saca su PNG final y reescribe el manifest.json
 * de `destino` con los clips en su sitio. Lo usan laminas.mjs y la API del estudio. Devuelve las entradas.
 */
export function ponerClips({ dir, destino, idsLaminas }) {
  const clips = leerClips(dir, idsLaminas);
  const fManifest = path.join(destino, 'manifest.json');
  let manifest = [];
  try { manifest = JSON.parse(fs.readFileSync(fManifest, 'utf8')); } catch { /* sin manifest */ }
  if (!clips.length && !manifest.some(l => l.tipo === 'clip')) return [];
  fs.mkdirSync(destino, { recursive: true });
  const entradas = clips.map((c) => {
    if (!fs.existsSync(c.origen)) throw new Error(`No existe el clip «${c.id}»: ${c.origen}`);
    const copia = path.join(destino, `${c.id}.${c.ext}`), png = path.join(destino, `${c.id}.png`);
    const so = fs.statSync(c.origen), sc = fs.existsSync(copia) ? fs.statSync(copia) : null;
    if (!sc || sc.size !== so.size || sc.mtimeMs < so.mtimeMs) fs.copyFileSync(c.origen, copia);
    if (!fs.existsSync(png) || fs.statSync(png).mtimeMs < fs.statSync(copia).mtimeMs) {
      const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-0.2', '-i', copia, '-update', '1', png]);
      if (r.status !== 0) throw new Error(`ffmpeg no pudo sacar el último cuadro de ${copia}`);
    }
    return entradaClip(c, sondearClip(copia));
  });
  fs.writeFileSync(fManifest, JSON.stringify(insertarClips(manifest, entradas), null, 2) + '\n', 'utf8');
  return entradas;
}
