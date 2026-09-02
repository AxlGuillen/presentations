// Captura cada diapositiva de un deck a PNG, a tamaño de diseño real.
// Uso: node tools/capturar.mjs <carpeta>        (p. ej. ornn)
//
// Usa el Chrome instalado del sistema vía puppeteer-core: no descarga navegador.
// Sirve el repo con un servidor estático propio para no depender de nada externo.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const deck = (process.argv[2] || '').replace(/[\\/]/g, '');
if (!deck || !fs.existsSync(path.join(raiz, deck, 'index.html'))) {
  console.error('Uso: node tools/capturar.mjs <carpeta>   (debe existir <carpeta>/index.html)');
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

// ── Servidor estático mínimo ─────────────────────────────────────────────
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

// ── Captura ──────────────────────────────────────────────────────────────
const salida = path.join(raiz, deck, 'video-out', 'slides');
fs.mkdirSync(salida, { recursive: true });

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
const pagina = await navegador.newPage();
await pagina.goto(`http://127.0.0.1:${puerto}/${deck}/`, { waitUntil: 'networkidle0' });

// Tamaño de diseño del propio deck
const { w, h, n } = await pagina.evaluate(() => {
  const ds = document.querySelector('deck-stage');
  return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height'),
           n: ds.querySelectorAll('section').length };
});
console.log(`${deck}: ${n} diapositivas a ${w}×${h}`);

await pagina.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
// Modo presentación: quita miniaturas y pie de navegación
await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
// Fuera cualquier interfaz que no sea la diapositiva (botón «Presentar», overlays)
await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video{display:none!important}' });
await pagina.evaluate(() => document.fonts.ready);

const rutas = [];
for (let i = 0; i < n; i++) {
  await pagina.evaluate(idx => {
    const ds = document.querySelector('deck-stage');
    if (typeof ds._go === 'function') ds._go(idx);
    else location.hash = '#' + (idx + 1);
    // la captura muestra la slide completa: todos los pasos revelados
    const s = ds.querySelectorAll('section')[idx];
    s.querySelectorAll('[data-step-hidden]').forEach(el => el.removeAttribute('data-step-hidden'));
  }, i);
  // dejar correr las animaciones de entrada (las timelines GSAP llegan a ~1.8s)
  await new Promise(r => setTimeout(r, 2600)); // margen para las timelines GSAP (la más larga hoy: ~1,8 s)
  const archivo = path.join(salida, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await pagina.screenshot({ path: archivo });
  rutas.push(archivo);
  process.stdout.write(`  ✓ ${path.basename(archivo)}\n`);
}

await navegador.close();
servidor.close();

const kb = rutas.reduce((a, f) => a + fs.statSync(f).size, 0) / 1024;
console.log(`\nListo: ${rutas.length} PNG en ${path.relative(raiz, salida)} (${kb.toFixed(0)} KB)`);
