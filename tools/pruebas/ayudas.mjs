// Ayudas compartidas por las pruebas que abren Chrome (capa.test.mjs, api-montaje.test.mjs).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

export const raiz = path.resolve(import.meta.dirname, '..', '..');

/** El mismo orden de búsqueda que cuadros.mjs; null si no hay navegador (la prueba se salta). */
export const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p)) || null;

/** Los mismos flags que cuadros.mjs: Chrome no baja de ritmo con la pantalla apagada. */
export const SIN_FRENO = ['--disable-gpu-vsync', '--disable-frame-rate-limit', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.json': 'application/json' };

/** Servidor estático mínimo sobre `base` (puerto libre, 127.0.0.1). */
export async function servir(base = raiz) {
  const srv = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    const abs = path.join(base, rel);
    if (!abs.startsWith(base) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end('no'); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const origen = `http://127.0.0.1:${srv.address().port}`;
  return { srv, origen, cerrar: () => { srv.closeAllConnections(); srv.close(); } };
}

/** PSNR entre dos PNG con ffmpeg: Infinity si son idénticos píxel a píxel. */
export function psnr(a, b) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'psnr-'));
  try {
    fs.writeFileSync(path.join(dir, 'a.png'), a);
    fs.writeFileSync(path.join(dir, 'b.png'), b);
    const r = spawnSync('ffmpeg', ['-v', 'info', '-i', path.join(dir, 'a.png'), '-i', path.join(dir, 'b.png'), '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
    const m = /average:(inf|[\d.]+)/.exec(r.stderr || '');
    if (!m) throw new Error('ffmpeg no devolvió el PSNR:\n' + r.stderr);
    return m[1] === 'inf' ? Infinity : parseFloat(m[1]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

/** Las <section data-lamina> de un index.html, en orden, con su posición (0-based) entre TODAS las <section>. */
export function laminasDe(carpeta) {
  const html = fs.readFileSync(path.join(raiz, carpeta, 'index.html'), 'utf8');
  return [...html.matchAll(/<section\b([^>]*)>/g)].map((m, i) => ({ i, id: (m[1].match(/data-lamina="([^"]+)"/) || [])[1] })).filter((s) => s.id);
}

// ── Un cuadro de una lámina: por la ruta de cuadros.mjs y por el modo capa ─────────────

export const lanzar = () => puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=1', '--hide-scrollbars', ...SIN_FRENO] });
/** El estado visual de una lámina, exacto: de cada elemento, su caja y lo que el seek mueve (transform, opacidad,
 *  color, filtro…). Si dos rutas dan el mismo seek, esto es IDÉNTICO aunque Chrome rasterice con ruido. */
const INSTANTANEA = function (s) {
  const props = ['transform', 'opacity', 'color', 'backgroundColor', 'filter', 'clipPath', 'visibility', 'display', 'backgroundPosition', 'letterSpacing', 'strokeDashoffset'];
  return JSON.stringify([s, ...s.querySelectorAll('*')].map((el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return [el.tagName, el.className && el.className.baseVal === undefined ? el.className : '', [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(3)),
      props.map((p) => cs[p]), (el.childElementCount ? '' : el.textContent)];
  }));
}.toString();
const png = async (cdp) => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true })).data, 'base64');

/** Lo que hace cuadros.mjs con la lámina `idx` del deck, hasta el seek a `t` y la captura. Devuelve {png, estado}. */
export async function referencia(navegador, url, idx, t, alfa) {
  const pagina = await navegador.newPage();
  const cdp = await pagina.createCDPSession();
  if (alfa) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  const info = await pagina.evaluate(() => { const ds = document.querySelector('deck-stage'); return { w: +ds.getAttribute('width'), h: +ds.getAttribute('height') }; });
  await pagina.setViewport({ width: info.w, height: info.h, deviceScaleFactor: 1 });
  await pagina.evaluate(() => window.postMessage({ __omelette_presenting: true }, '*'));
  await pagina.addStyleTag({ content: '#modo-presentacion,#ver-video,#capa-video{display:none!important}' });
  if (alfa) {
    await pagina.addStyleTag({ content: 'html,body,deck-stage,deck-stage>section{background:transparent!important;background-image:none!important}[data-fondo]{display:none!important}' });
    await pagina.evaluate(() => {
      const st = document.createElement('style');
      st.textContent = ':host{background:transparent!important}.canvas{background:transparent!important}';
      document.querySelector('deck-stage').shadowRoot.appendChild(st);
    });
  }
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.evaluate((i) => { const ds = document.querySelector('deck-stage'); if (typeof ds._go === 'function') ds._go(i); else location.hash = '#' + (i + 1); }, idx);
  await pagina.evaluate(async (i) => {
    const s = document.querySelectorAll('deck-stage section')[i];
    s.querySelectorAll('[data-step-hidden]').forEach((el) => el.removeAttribute('data-step-hidden'));
    for (let e = 0; e < 40 && !s.__tl; e++) await new Promise((r) => setTimeout(r, 25));
    await new Promise((r) => { const listo = () => [...s.querySelectorAll('img')].every((im) => im.complete); if (listo()) return r(); const x = setInterval(() => { if (listo()) { clearInterval(x); r(); } }, 50); setTimeout(() => { clearInterval(x); r(); }, 15000); });
    const urls = new Set();
    for (const el of [s, ...s.querySelectorAll('*')]) for (const m of getComputedStyle(el).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
    await Promise.all([...urls].map((u) => new Promise((r) => { const im = new Image(); im.onload = () => im.decode().then(r, r); im.onerror = r; im.src = u; })));
    await Promise.all([...s.querySelectorAll('img')].map((im) => (im.decode ? im.decode().catch(() => {}) : null)));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    s.__tl.pause(0, false);
  }, idx);
  await pagina.evaluate((i, x) => { document.querySelectorAll('deck-stage section')[i].__tl.time(x, false); }, idx, t);
  const estado = await pagina.evaluate(`(${INSTANTANEA})(document.querySelectorAll('deck-stage section')[${idx}])`);
  const buf = await png(cdp);
  await pagina.close();
  return { png: buf, estado };
}

/** El mismo cuadro por el modo capa: la página se abre con ?capa=<id>, se espera el 'listo' y se manda el seek. Devuelve {png, estado}. */
export async function porCapa(navegador, url, id, t, alfa) {
  const pagina = await navegador.newPage();
  const cdp = await pagina.createCDPSession();
  if (alfa) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  // Arriba de todo, el «padre» es la propia ventana: su origen es el que se autoriza.
  await pagina.evaluateOnNewDocument(() => {
    window.CAPA_ORIGENES = [location.origin];
    window.__msgs = [];
    window.addEventListener('message', (e) => { if (e.data && e.data.tipo) window.__msgs.push(e.data); });
  });
  await pagina.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await pagina.goto(`${url}?capa=${id}${alfa ? '&alfa=1' : ''}`, { waitUntil: 'networkidle0' });
  await pagina.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'listo'), { timeout: 30000 });
  await pagina.evaluate((x) => window.postMessage({ tipo: 'seek', t: x }, '*'), t);
  await pagina.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const estado = await pagina.evaluate(`(${INSTANTANEA})(document.querySelector('deck-stage section[data-deck-active]'))`);
  const buf = await png(cdp);
  await pagina.close();
  return { png: buf, estado };
}

