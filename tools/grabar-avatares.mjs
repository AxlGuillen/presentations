// Graba a mp4 un deck con avatares (personal/avatares y los que usen avatares.js), cuadro por cuadro.
// Uso: node tools/grabar-avatares.mjs <carpeta> [--fps=30] [--ancho=1920] [--quieto=1.6] [--salida=archivo.mp4]
//
// Abre el deck con ?reloj=1: GSAP y los clips de los avatares solo avanzan cuando esta grabadora
// llama window.__avanzar(1/fps), así que no se pierden cuadros aunque la PC vaya lenta.
// Secuencia: cada lámina se queda «quieto» segundos y luego se presiona →; se graba mientras window.__ocupado()
// diga que hay animaciones corriendo (incluye la cámara lenta). La última lámina se queda 1.8 veces más.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const deck = (process.argv.slice(2).find((a) => !a.startsWith('--')) || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
if (!deck || !fs.existsSync(path.join(raiz, deck, 'index.html'))) { console.error('Uso: node tools/grabar-avatares.mjs <carpeta>'); process.exit(1); }
const FPS = +arg('fps', 30), ANCHO = +arg('ancho', 1920), QUIETO = +arg('quieto', 1.6);
const salida = path.resolve(arg('salida', path.join(raiz, deck, 'video-out', 'avatares.mp4')));

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => fs.existsSync(p));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webm': 'video/webm', '.mp4': 'video/mp4' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]); if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.join(raiz, rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end('no'); }
  const tam = fs.statSync(abs).size, tipo = TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  const rango = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
  if (rango) {   // los <video> piden por rangos para poder buscar cuadros
    const a = +rango[1], b = rango[2] ? +rango[2] : tam - 1;
    res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${a}-${b}/${tam}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 });
    return fs.createReadStream(abs, { start: a, end: b }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': tam, 'Accept-Ranges': 'bytes' }); fs.createReadStream(abs).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));

const tmp = path.join(raiz, deck, 'video-out', 'grabacion'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
const nav = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1920, height: 1080, deviceScaleFactor: ANCHO / 1920 });
await pag.goto(`http://127.0.0.1:${servidor.address().port}/${deck}/?reloj=1`, { waitUntil: 'networkidle0' });
await pag.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
await pag.addStyleTag({ content: '#modo-presentacion{display:none!important}' });
await pag.evaluate(() => document.fonts.ready);
// espera a que todos los clips tengan datos
await pag.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => v.readyState >= 2 ? 1 : new Promise((ok) => { v.addEventListener('loadeddata', ok, { once: true }); setTimeout(ok, 5000); }))));
await new Promise((r) => setTimeout(r, 800));   // la cortina de carga se va sola

const info = await pag.evaluate(() => ({ n: document.querySelector('deck-stage').querySelectorAll(':scope > section').length,
  laminas: window.AVATARES.laminas, fichas: window.AVATARES.fichas }));
let cuadro = 0;
async function grabar(seg) {
  const n = Math.round(seg * FPS);
  for (let i = 0; i < n; i++) {
    await pag.evaluate((dt) => window.__avanzar(dt), 1 / FPS);
    await pag.screenshot({ path: path.join(tmp, String(cuadro++).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
}
await grabar(QUIETO);
// graba mientras el deck tenga animaciones corriendo (la cámara lenta alarga la transición), y luego «quieto»
async function grabarTransicion(max = 15) {
  let t = 0;
  do { await grabar(1 / FPS); t += 1 / FPS; } while (t < max && (t < 0.5 || await pag.evaluate(() => window.__ocupado ? window.__ocupado() : false)));
}
for (let i = 0; i < info.n - 1; i++) {
  await pag.keyboard.press('ArrowRight');
  await grabarTransicion();
  await grabar(i === info.n - 2 ? QUIETO * 1.8 : QUIETO);
  console.log(`lámina ${i + 2}/${info.n}`);
}
await nav.close(); servidor.close();
fs.mkdirSync(path.dirname(salida), { recursive: true });
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, '%05d.jpg'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', salida]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${salida}  (${cuadro} cuadros, ${(cuadro / FPS).toFixed(1)} s)`);
