// Renderiza las animaciones GSAP de un deck cuadro a cuadro y las encoda
// en un clip MP4 por diapositiva.
// Uso: node tools/cuadros.mjs <carpeta> [fps] [--paralelo=N]
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
// Salida: <carpeta>/video-out/anim/anim-NN.mp4 + anim.json (duraciones).
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

const dirAnim = path.join(raiz, deck, 'video-out', 'anim');
fs.mkdirSync(dirAnim, { recursive: true });
const t0 = performance.now();

// ── Un trabajador = un Chrome con el deck abierto ────────────────────────
async function abrir() {
  const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars', ...SIN_FRENO] });
  const pagina = await navegador.newPage();
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  const info = await pagina.evaluate(() => {
    const ds = document.querySelector('deck-stage');
    return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height'),
             n: ds.querySelectorAll('section').length, hayGsap: !!window.gsap };
  });
  await pagina.setViewport({ width: info.w, height: info.h, deviceScaleFactor: 1 });
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video,#capa-video{display:none!important}' });
  await pagina.evaluate(() => document.fonts.ready);
  return { navegador, pagina, cdp: await pagina.createCDPSession(), info };
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
  const dur = await pagina.evaluate(async idx => {
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
    if (!s.__tl) return 0;
    s.__tl.pause(0);           // desde aquí solo avanzamos con seeks explícitos
    return s.__tl.duration();
  }, i);
  const num = String(i + 1).padStart(2, '0');
  if (!dur) return { i, num, estatica: true };

  const tPrep = performance.now() - tIni;
  const clip = path.join(dirAnim, `anim-${num}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', clip], { stdio: ['pipe', 'ignore', 'inherit'] });
  ff.stdin.on('error', () => {});   // si ffmpeg muere, el error real llega por 'close'
  const terminado = new Promise((ok, mal) => ff.on('close', c => (c === 0 ? ok() : mal(new Error(`ffmpeg salió con ${c} en la slide ${num}`)))));
  const cuadros = Math.ceil(dur * FPS) + 1; // el último cuadro cae exacto en t = dur
  for (let f = 0; f < cuadros; f++) {
    const tt = Math.min(f / FPS, dur);
    // cuerpo con llaves a propósito: si la flecha devolviera la timeline,
    // puppeteer la serializaría entera (cuesta ~0,8 s por cuadro)
    await pagina.evaluate((idx, x) => { document.querySelectorAll('deck-stage section')[idx].__tl.time(x, false); }, i, tt);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
    await escribir(ff.stdin, Buffer.from(data, 'base64'));
  }
  ff.stdin.end();
  await terminado;
  return { i, num, dur: +dur.toFixed(3), cuadros, prep: tPrep, total: performance.now() - tIni };
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
    else console.log(`  ✓ slide ${r.num}: ${r.cuadros} cuadros · ${r.dur.toFixed(2)}s → anim-${r.num}.mp4  (${(r.total / 1000).toFixed(1)} s, preparar ${(r.prep / 1000).toFixed(1)} s)`);
  }
}));
await Promise.all(trabajadores.map(t => t.navegador.close()));
servidor.close();

const meta = resultados.filter(r => !r.estatica).sort((a, b) => a.i - b.i)
  .map(r => ({ slide: r.i + 1, dur: r.dur, cuadros: r.cuadros }));
fs.writeFileSync(path.join(dirAnim, 'anim.json'), JSON.stringify({ fps: FPS, clips: meta }, null, 2));
const total = meta.reduce((a, c) => a + c.cuadros, 0);
console.log(`\nListo: ${meta.length} clips (${total} cuadros) en ${path.relative(raiz, dirAnim)} · ${((performance.now() - t0) / 1000).toFixed(1)} s`);
