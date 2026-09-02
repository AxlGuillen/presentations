// QA de un deck: desborde de altura, imágenes rotas y fuentes cargadas.
// Uso: node tools/qa-deck.mjs <carpeta> [altoDiseño]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const carpeta = process.argv[2];
if (!carpeta) { console.error('uso: node tools/qa-deck.mjs <carpeta> [alto]'); process.exit(1); }

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
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1400, height: 1000 });
const fallos = [];
pagina.on('console', m => { if (m.type() === 'error') fallos.push(m.text()); });
pagina.on('pageerror', e => fallos.push(String(e)));

await pagina.goto(`http://127.0.0.1:${puerto}/${carpeta}/`, { waitUntil: 'networkidle0' });
await pagina.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 1200));

const alto = Number(process.argv[3]) || await pagina.evaluate(() =>
  Number(document.querySelector('deck-stage')?.getAttribute('height')) || 1080);

// Los assets van diferidos (kit.diferir): sin hidratar, toda imagen sin src se
// contaría como rota. Se fuerza la carga completa y se espera a que aterrice.
await pagina.evaluate(async () => {
  const ds = document.querySelector('deck-stage');
  if (ds && ds.cargarTodo) await ds.cargarTodo();
});
await new Promise(r => setTimeout(r, 900));

const r = await pagina.evaluate((ALTO) => {
  const secs = [...document.querySelectorAll('deck-stage section')];
  return {
    titulo: document.title,
    slides: secs.length,
    alto: ALTO,
    desborde: secs.map((s, i) => ({ i: i + 1, label: s.dataset.label, over: s.scrollHeight - ALTO }))
                  .filter(x => x.over > 2),
    imagenesRotas: [...document.images].filter(i => !i.complete || i.naturalWidth === 0)
                                       .map(i => i.getAttribute('src')),
    sinLabel: secs.filter(s => !s.dataset.label || !s.dataset.speakerNotes).length,
  };
}, alto);

console.log(JSON.stringify({ ...r, erroresConsola: fallos }, null, 1));
await navegador.close();
servidor.close();
process.exit(r.desborde.length || r.imagenesRotas.length || fallos.length ? 1 : 0);
