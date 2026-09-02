// Mide lo que un deck descarga al entrar: peticiones, bytes y cuánto de eso son
// imágenes que no se ven en la primera diapositiva.
// Uso: node tools/qa-peso.mjs <carpeta> [carpeta2 ...]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const CHROME = process.platform === 'win32'
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

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

const kb = b => (b / 1024).toFixed(0).padStart(5) + ' KB';

for (const carpeta of process.argv.slice(2)) {
  const pagina = await navegador.newPage();
  await pagina.setCacheEnabled(false);
  await pagina.setViewport({ width: 1400, height: 900 });
  const req = [];
  pagina.on('response', async r => {
    const url = r.url();
    if (!url.startsWith('http://127.0.0.1')) return;   // fuera Google Fonts
    let len = Number(r.headers()['content-length'] || 0);
    if (!len) { try { len = (await r.buffer()).length; } catch { len = 0; } }
    req.push({ url: url.replace(`http://127.0.0.1:${puerto}/`, ''), len, tipo: r.request().resourceType() });
  });

  // Lo que importa al entrar no es el total eventual, sino cuánto hay que bajar
  // antes de ver la primera diapositiva: se corta la cuenta cuando la cortina
  // de carga se levanta (o, en su defecto, al cargar la primera lámina).
  await pagina.goto(`http://127.0.0.1:${puerto}/${carpeta}/`, { waitUntil: 'domcontentloaded' });
  await pagina.waitForFunction(() => {
    const ds = document.querySelector('deck-stage') || document.querySelector('[width]');
    const cortina = ds && ds.shadowRoot && ds.shadowRoot.querySelector('.cortina');
    if (cortina) return cortina.hasAttribute('data-listo');
    const s = document.querySelectorAll('section')[0];
    return s && [...s.querySelectorAll('img')].every(i => i.complete);
  }, { timeout: 15000 }).catch(() => {});
  const primeras = req.length, bytesPrimeras = req.reduce((a, r) => a + r.len, 0);

  // …y después se deja que el rail termine de traer lo suyo en tiempo ocioso.
  await pagina.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 3500));

  const total = req.reduce((a, r) => a + r.len, 0);
  const slides = await pagina.evaluate(() => document.querySelectorAll('section').length);
  console.log(`${carpeta.padEnd(12)} ${String(slides).padStart(2)} slides · primera lámina: ${String(primeras).padStart(3)} pet ${kb(bytesPrimeras)} · reposo: ${String(req.length).padStart(3)} pet ${kb(total)}`);
  await pagina.close();
}

await navegador.close();
servidor.close();
