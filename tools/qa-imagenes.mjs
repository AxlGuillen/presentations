// Inventario de imágenes de un deck: tamaño real del archivo contra el tamaño
// al que se muestra. Sirve para decidir a cuánto se puede reducir cada asset
// sin que pierda nitidez.
//
// Mide en píxeles de DISEÑO (offsetWidth/offsetHeight), que es el sistema en
// el que se exporta: capturar.mjs pone el viewport al tamaño de diseño con
// deviceScaleFactor 1, así que 1 px de diseño = 1 px de PNG.
//
// Con object-fit: cover la imagen se recorta, así que el lado que manda es el
// que necesita más escala — de ahí el max() en vez de un promedio.
//
// Uso: node tools/qa-imagenes.mjs <carpeta> [carpeta2 …]
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

const informe = {};

for (const carpeta of process.argv.slice(2)) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1400, height: 900 });
  await pagina.goto(`http://127.0.0.1:${puerto}/${carpeta}/`, { waitUntil: 'networkidle0' });
  await pagina.evaluate(async () => {
    const ds = document.querySelector('deck-stage');
    if (ds && ds.cargarTodo) await ds.cargarTodo();
  });
  await new Promise(r => setTimeout(r, 1500));

  const usos = await pagina.evaluate(() => {
    const salida = {};
    const anota = (archivo, necesW, necesH, natW, natH) => {
      const k = archivo.split('/').slice(-2).join('/');
      const p = salida[k] || (salida[k] = { necesW: 0, necesH: 0, natW, natH, usos: 0 });
      p.necesW = Math.max(p.necesW, Math.ceil(necesW));
      p.necesH = Math.max(p.necesH, Math.ceil(necesH));
      p.usos++;
    };
    document.querySelectorAll('deck-stage section img').forEach((img) => {
      const natW = img.naturalWidth, natH = img.naturalHeight;
      if (!natW) return;
      const cajaW = img.offsetWidth, cajaH = img.offsetHeight;
      const ajuste = getComputedStyle(img).objectFit;
      // cover recorta: manda el lado que exige más escala. contain/fill caben
      // dentro de la caja, así que basta con el tamaño de la caja.
      const escala = ajuste === 'cover'
        ? Math.max(cajaW / natW, cajaH / natH)
        : Math.min(1, Math.max(cajaW / natW, cajaH / natH));
      anota(img.currentSrc || img.src, natW * escala, natH * escala, natW, natH);
    });
    // Fondos de <section>: cubren la diapositiva entera.
    document.querySelectorAll('deck-stage > section').forEach((s) => {
      const bg = s.style.backgroundImage || '';
      (bg.match(/url\([^)]+\)/g) || []).forEach((t) => {
        const u = t.slice(4, -1).replace(/^['"]|['"]$/g, '').trim();
        if (!u || u.slice(0, 5) === 'data:') return;
        salida['__bg__' + u.split('/').slice(-1)[0]] = {
          necesW: s.offsetWidth, necesH: s.offsetHeight, natW: 0, natH: 0, usos: 1, fondo: true,
        };
      });
    });
    return salida;
  });

  informe[carpeta] = usos;
  await pagina.close();
}

await navegador.close();
servidor.close();

// ── Reporte ─────────────────────────────────────────────────────────────
const kb = b => (b / 1024).toFixed(0);
let totalActual = 0, totalSobra = 0;

for (const [carpeta, usos] of Object.entries(informe)) {
  console.log(`\n── ${carpeta} ─────────────────────────────`);
  const filas = [];
  for (const [clave, u] of Object.entries(usos)) {
    const nombre = clave.startsWith('__bg__') ? clave.slice(6) : clave.split('/').slice(-1)[0];
    const abs = path.join(raiz, carpeta, 'assets', nombre);
    if (!fs.existsSync(abs)) continue;
    const bytes = fs.statSync(abs).size;
    totalActual += bytes;
    // Cuánto sobra en área: si la imagen es 4× el área que se ve, sobra mucho.
    const sobra = u.natW ? (u.natW * u.natH) / Math.max(1, u.necesW * u.necesH) : 1;
    if (sobra > 1.6) totalSobra += bytes;
    filas.push({ nombre, bytes, nat: u.natW ? `${u.natW}×${u.natH}` : '(fondo)',
                 nec: `${u.necesW}×${u.necesH}`, sobra: u.natW ? sobra.toFixed(1) + '×' : '—', usos: u.usos });
  }
  filas.sort((a, b) => b.bytes - a.bytes);
  filas.forEach(f => console.log(
    `  ${f.nombre.padEnd(26)} ${String(kb(f.bytes)).padStart(4)} KB  archivo ${f.nat.padEnd(9)} → se ve a ${f.nec.padEnd(9)} sobra ${f.sobra}`));
}
console.log(`\nTotal medido: ${kb(totalActual)} KB · en imágenes sobredimensionadas (>1,6× de área): ${kb(totalSobra)} KB`);
