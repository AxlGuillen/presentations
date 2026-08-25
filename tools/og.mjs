// Genera la imagen Open Graph (1200×630) de un deck o de la galería raíz.
// Uso: node tools/og.mjs <carpeta> [<carpeta> …]   ·   node tools/og.mjs raiz
//
// Decks: captura la primera diapositiva a tamaño de diseño y la compone a
// 1200×630 — los horizontales con recorte centrado, los verticales (TikTok)
// con fondo desenfocado de la propia portada. Sale a <carpeta>/assets/og.png
// (SÍ se commitea: la URL absoluta de las metas de kit.og() la necesita en
// producción). La raíz se captura directa a 1200×630 → /og.png.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const objetivos = process.argv.slice(2).map(a => a.replace(/[\\/]/g, ''));
if (!objetivos.length) {
  console.error('Uso: node tools/og.mjs <carpeta|raiz> [<carpeta> …]');
  process.exit(1);
}

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('No encontré Chrome ni Edge instalados.'); process.exit(1); }

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

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
const pagina = await navegador.newPage();
const ff = args => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
const tmp = path.join(raiz, '.og-tmp.png');

for (const deck of objetivos) {
  if (deck === 'raiz') {
    await pagina.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await pagina.goto(`http://127.0.0.1:${puerto}/`, { waitUntil: 'networkidle0' });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.screenshot({ path: path.join(raiz, 'og.png') });
    console.log('✓ raíz → og.png');
    continue;
  }
  if (!fs.existsSync(path.join(raiz, deck, 'index.html'))) { console.error(`– ${deck}: no existe`); continue; }
  await pagina.goto(`http://127.0.0.1:${puerto}/${deck}/`, { waitUntil: 'networkidle0' });
  const { w, h } = await pagina.evaluate(() => {
    const ds = document.querySelector('deck-stage');
    return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height') };
  });
  await pagina.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video{display:none!important}' });
  await pagina.evaluate(() => {
    const s = document.querySelector('deck-stage section');
    s.querySelectorAll('[data-step-hidden]').forEach(el => el.removeAttribute('data-step-hidden'));
  });
  await pagina.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000)); // entradas GSAP en estado final
  await pagina.screenshot({ path: tmp });

  fs.mkdirSync(path.join(raiz, deck, 'assets'), { recursive: true });
  const salida = path.join(raiz, deck, 'assets', 'og.png');
  if (w >= h) {
    // horizontal: recorte centrado a 1200×630
    ff(['-i', tmp, '-vf', 'scale=1200:-1,crop=1200:630', salida]);
  } else {
    // vertical: la portada contenida sobre sí misma desenfocada
    ff(['-i', tmp, '-filter_complex',
        '[0]scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630,boxblur=28[bg];' +
        '[0]scale=-1:630[fg];[bg][fg]overlay=(W-w)/2:0', salida]);
  }
  console.log(`✓ ${deck} → ${path.relative(raiz, salida)}`);
}

fs.rmSync(tmp, { force: true });
await navegador.close();
servidor.close();
