// Exporta las láminas de un deck a un PDF: una lámina por página, en su estado final.
// Uso: node tools/pdf.mjs <carpeta> [--banda=abajo|arriba] [--completa] [--con-reposo] [--calidad=90]
//
// Sirve para cualquier deck del repo:
//   · Decks de banda (data-recorte en el <deck-stage>: jhin-letalidad, zed, soloq-val-previa…): cada página
//     es SOLO la banda (el recorte, p. ej. 1080×680), sin la guía de GAMEPLAY. Con --completa sale el lienzo
//     entero. La lámina de reposo (data-reposo) se salta salvo --con-reposo. --banda=arriba|abajo fuerza la
//     variante (por omisión, la que declara el deck en data-banda), igual que en laminas.mjs.
//   · Decks 16:9, 9:16 y de panel: cada página es la diapositiva completa, al tamaño de diseño.
// Las animaciones se saltan a su final (las timelines son deterministas) y los pasos (data-step) se revelan,
// como en capturar.mjs. Cada página va como JPEG (--calidad, 90 por omisión) para que el PDF no pese de más.
//
// Salida: <carpeta>/video-out/laminas[-arriba].pdf en los decks de banda y <carpeta>/video-out/slides.pdf en
// los demás (video-out/ está ignorado: el PDF no se sube). Usa el Chrome del sistema vía puppeteer-core.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer-core';
import { medidasDeck, recorteDe, bandaDe, leerSecciones, tituloDe, buscarChrome } from './laminas-lib.mjs';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const opcion = (n, def) => { const a = args.find((x) => x === `--${n}` || x.startsWith(`--${n}=`)); return a === undefined ? def : a.includes('=') ? a.slice(a.indexOf('=') + 1) : true; };
const deck = (args.find((a) => !a.startsWith('--')) || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
if (!deck || !fs.existsSync(path.join(raiz, deck, 'index.html'))) {
  console.error('Uso: node tools/pdf.mjs <carpeta> [--banda=abajo|arriba] [--completa] [--con-reposo] [--calidad=90]   (debe existir <carpeta>/index.html)');
  process.exit(1);
}
const COMPLETA = !!opcion('completa', false), CON_REPOSO = !!opcion('con-reposo', false);
const CALIDAD = Number(opcion('calidad', 90));
if (!(CALIDAD >= 1 && CALIDAD <= 100)) { console.error('--calidad va de 1 a 100.'); process.exit(1); }

const html = fs.readFileSync(path.join(raiz, deck, 'index.html'), 'utf8');
const { ancho, alto } = medidasDeck(html);
const deckStage = (html.match(/<deck-stage\b[^>]*>/) || [''])[0];
const DE_BANDA = /\bdata-recorte=/.test(deckStage);
let BANDA, RECORTE;
try {
  BANDA = bandaDe(html, opcion('banda', ''));
  // Solo los decks que declaran data-recorte se recortan: en los de panel el recorte por omisión es del montaje.
  RECORTE = DE_BANDA && !COMPLETA ? recorteDe(html).split(':').map(Number) : [ancho, alto, 0, 0];
} catch (e) { console.error(e.message); process.exit(1); }
const [W, H, X, Y] = RECORTE;
const secciones = leerSecciones(html);
const elegidas = secciones.filter((s) => CON_REPOSO || !s.reposo);
if (!elegidas.length) { console.error('El deck no tiene láminas que exportar.'); process.exit(1); }

const CHROME = buscarChrome();
if (!CHROME) { console.error('No encontré Chrome ni Edge instalados.'); process.exit(1); }

// ── Servidor estático mínimo (como capturar.mjs) ─────────────────────────
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.join(raiz, rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end('no'); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars',
  '--disable-gpu-vsync', '--disable-frame-rate-limit', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
try {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: ancho, height: alto, deviceScaleFactor: 1 });
  await pagina.goto(`http://127.0.0.1:${puerto}/${deck}/${BANDA ? `?banda=${BANDA}` : ''}`, { waitUntil: 'networkidle0' });
  // Modo presentación (sin miniaturas ni pie) y fuera toda interfaz que no sea la lámina.
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video,#capa-video{display:none!important}' });
  await pagina.evaluate(() => document.fonts.ready);
  const cdp = await pagina.createCDPSession();

  console.log(`${deck}: ${elegidas.length} de ${secciones.length} láminas a ${W}×${H}${DE_BANDA && !COMPLETA ? ` (recorte ${RECORTE.join(':')}${BANDA ? `, banda de ${BANDA}` : ''})` : ''}`);
  const paginas = [];
  for (const s of elegidas) {
    const i = s.n - 1;
    await pagina.evaluate((idx) => {
      const ds = document.querySelector('deck-stage');
      if (typeof ds._go === 'function') ds._go(idx); else location.hash = '#' + (idx + 1);
      ds.querySelectorAll('section')[idx].querySelectorAll('[data-step-hidden]').forEach((el) => el.removeAttribute('data-step-hidden'));
    }, i);
    // Los assets van diferidos: la lámina se hidrata al activarse.
    await pagina.waitForFunction((idx) => {
      const sec = document.querySelectorAll('deck-stage section')[idx];
      return sec && [...sec.querySelectorAll('img')].every((im) => im.complete);
    }, { timeout: 20000 }, i).catch(() => {});
    // Estado final sin esperar: la timeline salta a su final y las animaciones CSS se terminan.
    await pagina.evaluate(async (idx) => {
      const sec = document.querySelectorAll('deck-stage section')[idx];
      const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (window.gsap && window.animar) for (let k = 0; k < 40 && !sec.__tl; k++) await new Promise((r) => setTimeout(r, 25));
      await cuadro();
      if (sec.__tl) { sec.__tl.pause(); sec.__tl.progress(1); }
      for (const a of document.getAnimations()) { try { a.finish(); } catch { a.currentTime = 2600; a.pause(); } }
      await cuadro();
    }, i);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: CALIDAD, clip: { x: X, y: Y, width: W, height: H, scale: 1 } });
    paginas.push(data);
    process.stdout.write(`  ✓ ${s.id || `lámina ${s.n}`}\n`);
  }

  // ── El PDF: una imagen por página, al tamaño exacto de la lámina ─────────
  const titulo = (tituloDe(html) || deck).replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;'));
  const doc = await navegador.newPage();
  await doc.setContent(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>
<style>@page { size: ${W}px ${H}px; margin: 0; } html, body { margin: 0; padding: 0; background: #000; }
img { display: block; width: ${W}px; height: ${H}px; break-after: page; } img:last-child { break-after: auto; }</style></head>
<body>${paginas.map((d) => `<img src="data:image/jpeg;base64,${d}" alt="">`).join('')}</body></html>`, { waitUntil: 'load' });
  const salida = path.join(raiz, deck, 'video-out', DE_BANDA && !COMPLETA ? `laminas${BANDA === 'arriba' ? '-arriba' : ''}.pdf` : 'slides.pdf');
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  await doc.pdf({ path: salida, width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log(`\nListo: ${paginas.length} páginas en ${path.relative(raiz, salida)} (${(fs.statSync(salida).size / 1024).toFixed(0)} KB)`);
} finally {
  await navegador.close();
  servidor.close();
}
