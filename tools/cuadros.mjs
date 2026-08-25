// Renderiza las animaciones GSAP de un deck cuadro a cuadro y las encoda
// en un clip MP4 por diapositiva. Uso: node tools/cuadros.mjs <carpeta> [fps]
//
// Cómo: activa cada slide, pausa su timeline (section.__tl, la deja el
// pegamento kit.animador()) y la recorre con tl.time(t) a 30 fps, tomando un
// screenshot por cuadro. Es render determinista: cada cuadro es un seek
// exacto, no una grabación en tiempo real, así que no hay frames perdidos y
// el resultado sincroniza al milisegundo con la narración de video.mjs.
// Las slides sin timeline se saltan (video.mjs usa su PNG estático).
//
// Salida: <carpeta>/video-out/anim/anim-NN.mp4 + anim.json (duraciones).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const deck = (process.argv[2] || '').replace(/[\\/]/g, '');
const FPS = Math.max(1, parseInt(process.argv[3] || '30', 10));
if (!deck || !fs.existsSync(path.join(raiz, deck, 'index.html'))) {
  console.error('Uso: node tools/cuadros.mjs <carpeta> [fps]   (debe existir <carpeta>/index.html)');
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
const puerto = servidor.address().port;

// ── Página ───────────────────────────────────────────────────────────────
const dirAnim = path.join(raiz, deck, 'video-out', 'anim');
fs.mkdirSync(dirAnim, { recursive: true });

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
const pagina = await navegador.newPage();
await pagina.goto(`http://127.0.0.1:${puerto}/${deck}/`, { waitUntil: 'networkidle0' });

const { w, h, n, hayGsap } = await pagina.evaluate(() => {
  const ds = document.querySelector('deck-stage');
  return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height'),
           n: ds.querySelectorAll('section').length, hayGsap: !!window.gsap };
});
if (!hayGsap) {
  console.log(`${deck}: no carga GSAP; no hay nada que renderizar cuadro a cuadro.`);
  await navegador.close(); servidor.close(); process.exit(0);
}
console.log(`${deck}: ${n} diapositivas a ${w}×${h} · ${FPS} fps`);

await pagina.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
await pagina.addStyleTag({ content: '#modo-presentacion{display:none!important}' });
await pagina.evaluate(() => document.fonts.ready);

const ff = args => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
const meta = [];

for (let i = 0; i < n; i++) {
  // activar la slide y esperar a que el pegamento cree su timeline
  await pagina.evaluate(idx => {
    const ds = document.querySelector('deck-stage');
    if (typeof ds._go === 'function') ds._go(idx);
    else location.hash = '#' + (idx + 1);
  }, i);
  const dur = await pagina.evaluate(async idx => {
    const s = document.querySelectorAll('deck-stage section')[idx];
    for (let esperas = 0; esperas < 20 && !s.__tl; esperas++) await new Promise(r => setTimeout(r, 25));
    if (!s.__tl) return 0;
    s.__tl.pause(0);           // desde aquí solo avanzamos con seeks explícitos
    return s.__tl.duration();
  }, i);
  const num = String(i + 1).padStart(2, '0');
  if (!dur) { console.log(`  – slide ${num}: sin timeline, queda estática`); continue; }

  const dirFrames = path.join(dirAnim, `frames-${num}`);
  fs.mkdirSync(dirFrames, { recursive: true });
  const cuadros = Math.ceil(dur * FPS) + 1; // el último cuadro cae exacto en t = dur
  for (let f = 0; f < cuadros; f++) {
    const t = Math.min(f / FPS, dur);
    await pagina.evaluate((idx, t) => {
      document.querySelectorAll('deck-stage section')[idx].__tl.time(t, false);
    }, i, t);
    await pagina.screenshot({ path: path.join(dirFrames, `frame-${String(f).padStart(4, '0')}.png`) });
  }
  const clip = path.join(dirAnim, `anim-${num}.mp4`);
  ff(['-framerate', String(FPS), '-i', path.join(dirFrames, 'frame-%04d.png'),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', clip]);
  fs.rmSync(dirFrames, { recursive: true, force: true }); // los frames pesan; el clip basta
  meta.push({ slide: i + 1, dur: +dur.toFixed(3), cuadros });
  console.log(`  ✓ slide ${num}: ${cuadros} cuadros · ${dur.toFixed(2)}s → ${path.basename(clip)}`);
}

fs.writeFileSync(path.join(dirAnim, 'anim.json'), JSON.stringify({ fps: FPS, clips: meta }, null, 2));
await navegador.close();
servidor.close();
console.log(`\nListo: ${meta.length} clips en ${path.relative(raiz, dirAnim)}`);
