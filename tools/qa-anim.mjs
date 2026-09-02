// Prueba de coreografías: seekea la timeline de una slide a varios tiempos y
// guarda un cuadro por cada uno, para ver que la animación existe y es
// determinista (que es lo que necesita cuadros.mjs para el video).
// Uso: node tools/qa-anim.mjs <carpeta> <nSlide> [t1,t2,t3...]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const carpeta = process.argv[2];
const nSlide = Number(process.argv[3] || 1);
const tiempos = (process.argv[4] || '0.2,0.6,1.0,1.4').split(',').map(Number);
if (!carpeta) { console.error('uso: node tools/qa-anim.mjs <carpeta> <nSlide> [t1,t2,...]'); process.exit(1); }

const raiz = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const CHROME = process.platform === 'win32'
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.resolve(raiz, '.' + rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 0.5 });
await pagina.goto(`http://127.0.0.1:${puerto}/${carpeta}/?p=${nSlide}#${nSlide}`, { waitUntil: 'networkidle0' });
await pagina.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 1500));

// deck-stage expone goTo(i); hay que dejar que active la slide antes de leer
// section.__tl, que solo existe una vez que el animador la lanzó.
await pagina.evaluate((n) => {
  const ds = document.querySelector('deck-stage');
  if (ds.goTo) ds.goTo(n - 1);
}, nSlide);
await new Promise(r => setTimeout(r, 700));

const info = await pagina.evaluate((n) => {
  const secs = [...document.querySelectorAll('deck-stage > section')];
  const s = secs[n - 1];
  return { label: s?.dataset.label, activa: s?.hasAttribute('data-deck-active'),
           tieneTl: !!s?.__tl, duracion: s?.__tl ? +s.__tl.duration().toFixed(2) : null,
           total: secs.length };
}, nSlide);
console.log(JSON.stringify(info));
if (!info.tieneTl) { console.error('sin timeline en esa slide'); await navegador.close(); servidor.close(); process.exit(1); }

const salida = path.join(raiz, carpeta, 'video-out', 'anim-qa');
fs.rmSync(salida, { recursive: true, force: true });   // sin cuadros viejos mezclados
fs.mkdirSync(salida, { recursive: true });
for (const t of tiempos) {
  await pagina.evaluate((n, tt) => {
    const s = document.querySelectorAll('deck-stage > section')[n - 1];
    if (s && s.__tl) s.__tl.pause().time(tt);
  }, nSlide, t);
  await new Promise(r => setTimeout(r, 120));
  const f = path.join(salida, `t-${String(t).replace('.', '_')}.png`);
  await pagina.screenshot({ path: f });
  console.log('  ✓', path.basename(f));
}

await navegador.close();
servidor.close();
