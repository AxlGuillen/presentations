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
    // Las miniaturas del rail se hidratan en tiempo ocioso, así que alguna
    // puede seguir con data-src cuando se mide: sin src no hay fuente rota que
    // reportar, y contarla daba un falso positivo intermitente.
    imagenesRotas: [...document.images].filter(i => !i.dataset.src && i.getAttribute('src'))
                                       .filter(i => !i.complete || i.naturalWidth === 0)
                                       .map(i => i.getAttribute('src')),
    // Desborde a lo ANCHO. No se puede medir con scrollWidth porque la
    // <section> lleva overflow:hidden: lo que sobra se corta en silencio (así
    // se coló una fila de trofeos recortada en caps). Se compara la caja de
    // cada elemento del contenido contra la banda segura; lo posicionado en
    // absoluto se salta, que es como se pintan fondos y halos a sangre.
    desbordeAncho: secs.map((s, i) => {
      const caja = s.getBoundingClientRect();
      const pad = getComputedStyle(s);
      // deck-stage escala el lienzo con transform, así que getBoundingClientRect
      // devuelve píxeles de pantalla y el padding calculado viene sin escalar:
      // hay que normalizar o todas las láminas «desbordan» lo mismo.
      const escala = caja.width / s.offsetWidth || 1;
      const izq = caja.left + parseFloat(pad.paddingLeft) * escala;
      const der = caja.right - parseFloat(pad.paddingRight) * escala;
      let peor = 0;
      const mirar = (el) => {
        for (const h of el.children) {
          const pos = getComputedStyle(h).position;
          if (pos === 'absolute' || pos === 'fixed') continue;
          const r = h.getBoundingClientRect();
          if (r.width) peor = Math.max(peor, (izq - r.left) / escala, (r.right - der) / escala);
          mirar(h);
        }
      };
      mirar(s);
      return { i: i + 1, label: s.dataset.label, over: Math.round(peor) };
    }).filter(x => x.over > 2),
    sinLabel: secs.filter(s => !s.dataset.label || !s.dataset.speakerNotes).length,
  };
}, alto);

console.log(JSON.stringify({ ...r, erroresConsola: fallos }, null, 1));
await navegador.close();
servidor.close();
// El ancho NO tumba el exit code: mide contra la banda segura, y entrar unos
// píxeles en el margen es cosmético (una sombra girada, un glow). Lo que sí
// importa —contenido cortado por el marco— sale con decenas de píxeles.
process.exit(r.desborde.length || r.imagenesRotas.length || fallos.length ? 1 : 0);
