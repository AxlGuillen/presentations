// Renderiza las animaciones GSAP de un deck cuadro a cuadro y las encoda
// en un clip MP4 por diapositiva.
// Uso: node tools/cuadros.mjs <carpeta> [fps] [--paralelo=N] [--alfa | --alfa=webm]
//
// Cómo: activa cada slide, pausa su timeline (section.__tl, la deja el
// pegamento kit.animador()) y la recorre con tl.time(t) a 30 fps, tomando una
// captura por cuadro. Es render determinista: cada cuadro es un seek exacto,
// no una grabación en tiempo real, así que no hay frames perdidos y el
// resultado sincroniza al milisegundo con la narración de video.mjs.
// Las slides sin timeline se saltan (video.mjs usa su PNG estático).
//
// Velocidad (medido en jinx, 17 láminas, 862 cuadros: 248 s antes):
//  · Varios Chrome en paralelo, uno por trabajador, que se reparten las
//    láminas. Varias PESTAÑAS del mismo Chrome no escalan (comparten el proceso
//    de GPU); varios navegadores sí, casi en línea recta.
//  · Captura directa por CDP con optimizeForSpeed: los mismos píxeles que
//    page.screenshot() en ~100 ms en vez de ~250.
//  · Los cuadros van por tubería a ffmpeg (image2pipe): nada de PNG a disco.
//
// Determinismo: cada cuadro cae exacto en su tiempo de timeline. A nivel de
// píxel, dos corridas pueden diferir un poco (41–60 dB de PSNR, invisible):
// Chrome elige a qué resolución rasterizar lo que se anima según el ritmo real
// entre cuadros. Ya pasaba con el script anterior (medido: 4 corridas de riven
// daban de 2 a 4 clips idénticos de 4); no lo introduce el paralelo.
//
// Modo --alfa: los clips salen con TRANSPARENCIA para montarlos encima de otro
// video. Se vacían los fondos de la página (html, body, deck-stage, las
// <section> y los dos del shadow DOM de deck-stage: :host y .canvas), se apagan
// los elementos marcados con data-fondo (copias desenfocadas, rayos, lavados:
// lo pone el gen.js, no es una heurística) y Chrome pinta con fondo de alfa 0.
// Se codifica en ProRes 4444 (.mov, yuva444p10le) o, con --alfa=webm, en VP9
// con alfa (yuva420p, más liviano y más lento de codificar). En modo alfa
// también salen las láminas sin timeline, como un clip de un solo cuadro, para
// que laminas.mjs tenga de dónde sacar su PNG con transparencia.
//
// Salida: <carpeta>/video-out/anim/anim-NN.mp4 + anim.json (duraciones y, por
// lámina, las etiquetas sfx:<receta> de su timeline con su segundo); en modo
// alfa, video-out/anim-alfa/anim-NN.mov (o .webm) + su propio anim.json.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const deck = (args.find(a => !a.startsWith('--') && !/^\d+$/.test(a)) || '').replace(/[\\/]/g, '');
const FPS = Math.max(1, parseInt(args.find(a => /^\d+$/.test(a)) || '30', 10));
const pedido = args.find(a => a.startsWith('--paralelo='));
const PARALELO = Math.max(1, pedido ? parseInt(pedido.split('=')[1], 10) : Math.min(6, Math.floor(os.cpus().length / 2)));
const pideAlfa = args.find(a => a === '--alfa' || a.startsWith('--alfa='));
const ALFA = pideAlfa ? (pideAlfa === '--alfa=webm' ? 'webm' : 'mov') : null;
const EXT = ALFA || 'mp4';
// ProRes 4444 es lo que ya lee ReelForge; VP9 con alfa pesa menos. Nada de qtrle:
// pesa demasiado para pasarlo entre herramientas.
// qscale 9: medido en lux, 49 dB contra la calidad por defecto con un 25 % menos de peso.
const CODEC = ALFA === 'mov' ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', '-qscale:v', '9']
  : ALFA === 'webm' ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4']
  : ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p'];
// Con la pantalla apagada o bloqueada Chrome baja a ~1 cuadro por segundo: un
// render de 15 s tardaba más de 3 minutos. Estos flags lo desligan del monitor.
const SIN_FRENO = ['--disable-gpu-vsync', '--disable-frame-rate-limit', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];
if (!deck || !fs.existsSync(path.join(raiz, deck, 'index.html'))) {
  console.error('Uso: node tools/cuadros.mjs <carpeta> [fps] [--paralelo=N]   (debe existir <carpeta>/index.html)');
  process.exit(1);
}

const CHROME = [
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('No encontré Chrome ni Edge instalados.'); process.exit(1); }

// ── Servidor estático mínimo (igual que capturar.mjs) ────────────────────
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.join(raiz, rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    res.writeHead(404); return res.end('no');
  }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${servidor.address().port}/${deck}/`;

// En modo alfa los clips van a su propia carpeta: video.mjs lee anim/ y espera mp4 opacos.
const dirAnim = path.join(raiz, deck, 'video-out', ALFA ? 'anim-alfa' : 'anim');
fs.mkdirSync(dirAnim, { recursive: true });
const t0 = performance.now();

// ── Un trabajador = un Chrome con el deck abierto ────────────────────────
async function abrir() {
  const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars', ...SIN_FRENO] });
  const pagina = await navegador.newPage();
  const cdp = await pagina.createCDPSession();
  // Fondo de página con alfa 0: si no, Chrome rellena de blanco lo que nadie pinta.
  if (ALFA) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  const info = await pagina.evaluate(() => {
    const ds = document.querySelector('deck-stage');
    return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height'),
             n: ds.querySelectorAll('section').length, hayGsap: !!window.gsap };
  });
  await pagina.setViewport({ width: info.w, height: info.h, deviceScaleFactor: 1 });
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video,#capa-video{display:none!important}' });
  if (ALFA) {
    await pagina.addStyleTag({ content: 'html,body,deck-stage,deck-stage>section{background:transparent!important;background-image:none!important}[data-fondo]{display:none!important}' });
    // Una hoja de afuera no entra al shadow DOM (salvo :host desde el documento):
    // los fondos de :host y del lienzo de deck-stage se vacían desde adentro.
    await pagina.evaluate(() => {
      const raizSombra = document.querySelector('deck-stage').shadowRoot;
      const st = document.createElement('style');
      st.textContent = ':host{background:transparent!important}.canvas{background:transparent!important}';
      raizSombra.appendChild(st);
    });
  }
  await pagina.evaluate(() => document.fonts.ready);
  return { navegador, pagina, cdp, info };
}

/** Escribe en el stdin de ffmpeg respetando la contrapresión. (Los errores
 *  de la tubería se escuchan una sola vez al abrirla, no en cada espera.) */
const escribir = (flujo, buf) => (flujo.write(buf) ? Promise.resolve() : new Promise(ok => flujo.once('drain', ok)));

async function renderizar(t, i) {
  const { pagina, cdp } = t;
  const tIni = performance.now();
  // activar la slide y esperar a que el pegamento cree su timeline
  await pagina.evaluate(idx => {
    const ds = document.querySelector('deck-stage');
    if (typeof ds._go === 'function') ds._go(idx);
    else location.hash = '#' + (idx + 1);
  }, i);
  const { dur, sfx } = await pagina.evaluate(async idx => {
    const s = document.querySelectorAll('deck-stage section')[idx];
    // el video muestra la slide completa: todos los pasos revelados
    s.querySelectorAll('[data-step-hidden]').forEach(el => el.removeAttribute('data-step-hidden'));
    for (let esperas = 0; esperas < 40 && !s.__tl; esperas++) await new Promise(r => setTimeout(r, 25));
    // Assets diferidos: la slide se hidrata al activarse; sin esto el primer
    // cuadro saldría sin imágenes.
    await new Promise(r => {
      const listo = () => [...s.querySelectorAll('img')].every(i => i.complete);
      if (listo()) return r();
      const t = setInterval(() => { if (listo()) { clearInterval(t); r(); } }, 50);
      setTimeout(() => { clearInterval(t); r(); }, 15000);
    });
    // Y también los fondos (data-bg se hidrata aparte, como background-image) y
    // la decodificación: sin esto unos cuadros salían con la imagen y otros sin
    // ella, según el azar de la red, y dos renders no daban el mismo video.
    const urls = new Set();
    for (const el of [s, ...s.querySelectorAll('*')]) {
      for (const m of getComputedStyle(el).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
    }
    await Promise.all([...urls].map(u => new Promise(r => { const im = new Image(); im.onload = () => im.decode().then(r, r); im.onerror = r; im.src = u; })));
    await Promise.all([...s.querySelectorAll('img')].map(i => (i.decode ? i.decode().catch(() => {}) : null)));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!s.__tl) return { dur: -1, sfx: [] };
    s.__tl.pause(0);           // desde aquí solo avanzamos con seeks explícitos
    // Etiquetas sfx:<receta> (también las de timelines anidadas, sumando su
    // arranque): video.mjs pone ahí los efectos de sonido.
    const sfx = [];
    (function juntar(tl, base) {
      for (const [k, v] of Object.entries(tl.labels)) if (k.startsWith('sfx:')) sfx.push({ receta: k.slice(4).split('#')[0], t: +(base + v).toFixed(3) });
      for (const h of tl.getChildren(false, false, true)) juntar(h, base + h.startTime());
    })(s.__tl, 0);
    sfx.sort((a, b) => a.t - b.t);
    return { dur: s.__tl.duration(), sfx };
  }, i);
  const num = String(i + 1).padStart(2, '0');
  // Sin timeline: en modo normal se salta (video.mjs usa su PNG); en modo alfa
  // sale un clip de un solo cuadro, porque el PNG de capturar.mjs es opaco.
  const sinTimeline = dur <= 0;
  if (sinTimeline && !ALFA) return { i, num, estatica: true, sfx };

  const tPrep = performance.now() - tIni;
  const clip = path.join(dirAnim, `anim-${num}.${EXT}`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    ...CODEC, clip], { stdio: ['pipe', 'ignore', 'inherit'] });
  ff.stdin.on('error', () => {});   // si ffmpeg muere, el error real llega por 'close'
  const terminado = new Promise((ok, mal) => ff.on('close', c => (c === 0 ? ok() : mal(new Error(`ffmpeg salió con ${c} en la slide ${num}`)))));
  const cuadros = sinTimeline ? 1 : Math.ceil(dur * FPS) + 1; // el último cuadro cae exacto en t = dur
  for (let f = 0; f < cuadros; f++) {
    const tt = Math.min(f / FPS, Math.max(dur, 0));
    // cuerpo con llaves a propósito: si la flecha devolviera la timeline,
    // puppeteer la serializaría entera (cuesta ~0,8 s por cuadro)
    if (!sinTimeline) await pagina.evaluate((idx, x) => { document.querySelectorAll('deck-stage section')[idx].__tl.time(x, false); }, i, tt);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
    await escribir(ff.stdin, Buffer.from(data, 'base64'));
  }
  ff.stdin.end();
  await terminado;
  return { i, num, dur: +Math.max(dur, 0).toFixed(3), cuadros, sinTimeline, sfx, prep: tPrep, total: performance.now() - tIni };
}

// ── Reparto: cada trabajador toma la siguiente lámina libre ──────────────
const primero = await abrir();
const { w, h, n, hayGsap } = primero.info;
if (!hayGsap) {
  console.log(`${deck}: no carga GSAP; no hay nada que renderizar cuadro a cuadro.`);
  await primero.navegador.close(); servidor.close(); process.exit(0);
}
const nTrab = Math.min(PARALELO, n);
console.log(`${deck}: ${n} diapositivas a ${w}×${h} · ${FPS} fps · ${nTrab} en paralelo`);
const trabajadores = [primero, ...(await Promise.all(Array.from({ length: nTrab - 1 }, abrir)))];

let siguiente = 0;
const resultados = [];
await Promise.all(trabajadores.map(async (t) => {
  while (siguiente < n) {
    const r = await renderizar(t, siguiente++);
    resultados.push(r);
    if (r.estatica) console.log(`  – slide ${r.num}: sin timeline, queda estática`);
    else console.log(`  ✓ slide ${r.num}: ${r.cuadros} cuadro${r.cuadros === 1 ? '' : 's'} · ${r.dur.toFixed(2)}s → anim-${r.num}.${EXT}${r.sinTimeline ? '  (sin timeline, un cuadro)' : ''}  (${(r.total / 1000).toFixed(1)} s, preparar ${(r.prep / 1000).toFixed(1)} s)`);
  }
}));
await Promise.all(trabajadores.map(t => t.navegador.close()));
// Las conexiones keep-alive de Chrome dejaban vivo el servidor y el proceso no
// salía al terminar (laminas.mjs se quedaba esperando).
servidor.closeAllConnections();
servidor.close();

const meta = resultados.filter(r => !r.estatica).sort((a, b) => a.i - b.i)
  .map(r => ({ slide: r.i + 1, dur: r.dur, cuadros: r.cuadros, ...(r.sinTimeline ? { sinTimeline: true } : {}), ...(r.sfx.length ? { sfx: r.sfx } : {}) }));
fs.writeFileSync(path.join(dirAnim, 'anim.json'), JSON.stringify({ fps: FPS, alfa: ALFA || false, ext: EXT, clips: meta }, null, 2));
const total = meta.reduce((a, c) => a + c.cuadros, 0);
console.log(`\nListo: ${meta.length} clips (${total} cuadros) en ${path.relative(raiz, dirAnim)} · ${((performance.now() - t0) / 1000).toFixed(1)} s`);
process.exit(0);
