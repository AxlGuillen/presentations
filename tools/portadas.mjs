// Captura SOLO la primera diapositiva de cada deck y la deja en /portadas/
// como JPG optimizado para la pantalla de proyección de la galería.
// Uso: node tools/portadas.mjs [deck ...]   (sin args: todos los decks)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const TODOS = ['tabletas', 'estancia', 'soloq', 'lowelo', 'ornn', 'urgot', 'talon', 'blitzcrank', 'malphite', 'skins', 'caras', 'semana34', 'semana35'];
const decks = process.argv.slice(2).length ? process.argv.slice(2) : TODOS;

const CHROME = [
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('Sin Chrome.'); process.exit(1); }

// En Windows el intérprete es `python`; en macOS/Linux es `python3`.
const PY = process.platform === 'win32' ? 'python' : 'python3';

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.join(raiz, rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

fs.mkdirSync(path.join(raiz, 'portadas'), { recursive: true });
const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });

for (const deck of decks) {
  const pagina = await navegador.newPage();
  await pagina.goto(`http://127.0.0.1:${puerto}/${deck}/`, { waitUntil: 'networkidle0' });
  const { w, h } = await pagina.evaluate(() => {
    const ds = document.querySelector('deck-stage');
    return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height') };
  });
  await pagina.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video{display:none!important}' });
  await pagina.evaluate(() => document.fonts.ready);
  // GSAP y animaciones de entrada: esperar al estado final (ver CLAUDE.md)
  await new Promise(r => setTimeout(r, 2200));
  const tmp = path.join(raiz, 'portadas', `${deck}.tmp.png`);
  await pagina.screenshot({ path: tmp });
  await pagina.close();
  // reescalar a ancho máx 900 y comprimir a JPG con Pillow
  const destino = path.join(raiz, 'portadas', `${deck}.jpg`);
  execFileSync(PY, ['-c', `
from PIL import Image
im = Image.open(r'''${tmp}''').convert('RGB')
im.thumbnail((900, 900), Image.LANCZOS)
im.save(r'''${destino}''', quality=82, optimize=True)
`]);
  fs.unlinkSync(tmp);
  const kb = Math.round(fs.statSync(destino).size / 1024);
  console.log(`  ✓ portadas/${deck}.jpg (${w}×${h} → ${kb} KB)`);
}

await navegador.close();
servidor.close();
console.log('Listo.');
