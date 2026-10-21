// Recortes de páginas de Riot (notas de parche, /dev) para los decks de parches.
// Uso: node tools/recortes.mjs <carpeta> [--solo=id,id] [--listar]
//
// Lee <carpeta>/recortes.json:
//   { "url": "https://…/{lang}/…", "lang": "en-us", "ancho": 600, "escala": 2,
//     "recortes": [ { "id": "jinx", "bloque": "Jinx", "marcar": ["similarly dominant", "59 + 3/Level"] }, … ] }
// Tipos de recorte (uno por entrada):
//   bloque:   nombre del campeón u objeto (h3.change-title) → su .patch-change-block.
//             "partes": ["W - Safeguard", …] deja solo esos h4 (y la cabecera);
//             "sinCita": true quita el blockquote de Riot.
//   seccion:  texto de un h2 → el header y los .content-border que lo siguen hasta el próximo h2.
//   parrafo:  texto que contiene un <p> (o blockquote) → ese elemento.
//   cabecera: true → el arte principal, el título y el subtítulo del artículo.
// Cada entrada puede traer su propia "url".
//
// Sale en <carpeta>/assets/recortes/:
//   <id>.png          el recorte limpio, tal cual la página
//   <id>-m<k>.png     el mismo trozo con el resaltado amarillo, uno por renglón resaltado
//   recortes.json     { id: { w, h, marcas: [{ x, y, w, h, archivo }] } } en píxeles del PNG
// El resaltado no mueve el texto (fondo y sombra, sin padding), así que cada
// pedazo cae exacto sobre el recorte limpio y el deck lo puede destapar como
// un marcatextos. La frase se busca DESDE EL FINAL del bloque: en las notas el
// valor nuevo va después de la flecha y el viejo suele contener el mismo texto.
// Con --listar imprime los <strong> de cada bloque para escoger qué marcar.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const deck = (args.find(a => !a.startsWith('--')) || '').replace(/[\\/]/g, '');
const solo = (args.find(a => a.startsWith('--solo=')) || '').slice(7).split(',').filter(Boolean);
const listar = args.includes('--listar');
const specPath = path.join(raiz, deck, 'recortes.json');
if (!deck || !fs.existsSync(specPath)) { console.error('Uso: node tools/recortes.mjs <carpeta>  (debe existir <carpeta>/recortes.json)'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const ANCHO = spec.ancho || 600, ESCALA = spec.escala || 2, MARCA = spec.color || '#FFD640';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p));
const destino = path.join(raiz, deck, 'assets', 'recortes');
fs.mkdirSync(destino, { recursive: true });
const datosPath = path.join(destino, 'recortes.json');
const datos = fs.existsSync(datosPath) ? JSON.parse(fs.readFileSync(datosPath, 'utf8')) : {};

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 240000 });
const paginas = new Map();
// Captura sin redimensionar la página: con captureBeyondViewport puppeteer
// estira el viewport a la página entera y el texto se reacomoda (en las
// repeticiones «10 per hour» cambiaba de renglón entre el limpio y la marca).
async function foto(p, archivo, clip) {
  await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 20)), clip.y);
  await p.screenshot({ path: archivo, clip, captureBeyondViewport: false });
}
async function pagina(url) {
  if (paginas.has(url)) return paginas.get(url);
  const p = await navegador.newPage();
  await p.setViewport({ width: ANCHO, height: 2600, deviceScaleFactor: ESCALA });
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  // Fuera lo que flota (cookies, barra de navegación) y lo que entra con scroll.
  // text-wrap normal: con «pretty» o «balance» los cortes de renglón cambian al
  // envolver la frase resaltada en un <span>.
  await p.evaluate(() => {
    document.querySelectorAll('*').forEach(e => { const pos = getComputedStyle(e).position; if (pos === 'fixed' || pos === 'sticky') e.style.setProperty('display', 'none', 'important'); });
    const css = document.createElement('style');
    css.textContent = '*{animation:none!important;transition:none!important;text-wrap:wrap!important} .recorte-marca{background:' + '__MARCA__' + '!important;color:#0A1428!important;border-radius:3px;box-shadow:0 0 0 3px ' + '__MARCA__' + ';-webkit-box-decoration-break:clone;box-decoration-break:clone}';
    document.head.appendChild(css);
  });
  await p.evaluate((m) => { const s = [...document.querySelectorAll('style')].pop(); s.textContent = s.textContent.replaceAll('__MARCA__', m); }, MARCA);
  // Fuerza la carga de las imágenes perezosas de toda la página.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
    const espera = Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; })));
    await Promise.race([espera, new Promise(r => setTimeout(r, 6000))]);
  });
  paginas.set(url, p);
  return p;
}

for (const r of spec.recortes) {
  if (solo.length && !solo.includes(r.id)) continue;
  const url = (r.url || spec.url).replace('{lang}', spec.lang || 'en-us');
  const p = await pagina(url);
  // Elige y prepara el elemento; devuelve su caja (unión con todos sus descendientes).
  const res = await p.evaluate((r, listar) => {
    document.querySelectorAll('[data-recorte-oculto]').forEach(e => { e.style.display = e.dataset.recorteOculto; e.removeAttribute('data-recorte-oculto'); });
    const ocultar = (e) => { if (!e.hasAttribute('data-recorte-oculto')) e.setAttribute('data-recorte-oculto', e.style.display || ''); e.style.display = 'none'; };
    let els = [];
    if (r.bloque) {
      const h = [...document.querySelectorAll('h3.change-title')].find(x => x.textContent.trim() === r.bloque);
      if (!h) return { error: 'no encontré el bloque ' + r.bloque };
      const b = h.closest('.patch-change-block');
      // Varios h3 en el mismo bloque (los objetos): se queda solo el tramo de este,
      // desde su ícono hasta el ícono del siguiente.
      const hermanos = [...h.parentElement.children];
      if (hermanos.filter(c => c.matches('h3.change-title')).length > 1) {
        const i = hermanos.indexOf(h);
        const ini = i > 0 && hermanos[i - 1].tagName === 'P' && hermanos[i - 1].querySelector('img') ? i - 1 : i;
        let fin = hermanos.length;
        for (let k = i + 1; k < hermanos.length; k++) if (hermanos[k].matches('h3.change-title')) { fin = hermanos[k - 1].tagName === 'P' && hermanos[k - 1].querySelector('img') ? k - 1 : k; break; }
        hermanos.forEach((c, k) => { if (k < ini || k >= fin) ocultar(c); });
      }
      if (r.sinCita) b.querySelectorAll('blockquote').forEach(ocultar);
      if (r.partes) {
        // Recorre los hijos del bloque: lo de antes del primer h4 es la cabecera; cada h4 abre una parte.
        const cont = h.parentElement; let parte = null;
        [...cont.children].forEach(c => {
          if (c.tagName === 'H4') parte = c.textContent.trim();
          if (parte && !r.partes.includes(parte)) ocultar(c);
        });
      }
      els = [b];
    } else if (r.seccion) {
      const h2 = [...document.querySelectorAll('h2')].find(x => x.textContent.trim() === r.seccion);
      if (!h2) return { error: 'no encontré la sección ' + r.seccion };
      const hdr = h2.closest('header'); els = [hdr];
      let s = hdr.nextElementSibling;
      while (s && !s.matches('header.header-primary')) { if (s.matches('.content-border')) els.push(s); s = s.nextElementSibling; }
    } else if (r.parrafo) {
      const e = [...document.querySelectorAll('p')].find(x => x.textContent.includes(r.parrafo));
      if (!e) return { error: 'no encontré el párrafo con ' + r.parrafo };
      els = [r.conCita ? (e.closest('blockquote') || e) : e];
    } else if (r.cabecera) {
      const h1 = document.querySelector('h1');
      const sec = h1.closest('section');
      els = [sec];
    }
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const suma = (rc) => { if (!rc.width || !rc.height) return; x0 = Math.min(x0, rc.left); y0 = Math.min(y0, rc.top + scrollY); x1 = Math.max(x1, rc.right); y1 = Math.max(y1, rc.bottom + scrollY); };
    els.forEach(e => { suma(e.getBoundingClientRect()); e.querySelectorAll('*').forEach(d => { if (getComputedStyle(d).display !== 'none') suma(d.getBoundingClientRect()); }); });
    if (r.recorteAlto) y1 = Math.min(y1, y0 + r.recorteAlto);
    const pad = r.margen == null ? 14 : r.margen;
    const caja = { x: Math.max(0, x0 - pad), y: y0 - pad, width: Math.min(document.documentElement.clientWidth, x1 + pad) - Math.max(0, x0 - pad), height: y1 - y0 + 2 * pad };
    window.__recorte = els;
    const fuertes = listar ? els.flatMap(e => [...e.querySelectorAll('strong')].map(s => s.textContent.trim())) : [];
    return { caja, fuertes };
  }, r, listar);
  if (res.error) { console.error(`  ✗ ${r.id}: ${res.error}`); continue; }
  if (listar) console.log(`  · ${r.id}: ${res.fuertes.join(' | ')}`);
  const { caja } = res;
  await foto(p, path.join(destino, `${r.id}.png`), caja);

  // Resaltados: envuelve cada frase (la última aparición) y mide sus renglones.
  const marcas = await p.evaluate((frases, caja) => {
    const out = [], faltan = [];
    for (const frase of frases || []) {
      let hecho = false;
      const nodos = [];
      window.__recorte.forEach(e => { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.parentElement && !n.parentElement.closest('.recorte-marca') && getComputedStyle(n.parentElement).display !== 'none' && n.parentElement.offsetParent !== null) nodos.push(n); });
      // Primero dentro de un solo nodo, desde el final.
      for (let i = nodos.length - 1; i >= 0 && !hecho; i--) {
        const n = nodos[i], k = n.data.lastIndexOf(frase);
        if (k < 0) continue;
        const rango = document.createRange(); rango.setStart(n, k); rango.setEnd(n, k + frase.length);
        const span = document.createElement('span'); span.className = 'recorte-marca'; rango.surroundContents(span);
        [...span.getClientRects()].forEach(rc => out.push({ x: rc.left - caja.x - 3, y: rc.top + scrollY - caja.y - 3, w: rc.width + 6, h: rc.height + 6 }));
        hecho = true;
      }
      // Si la frase cruza etiquetas (p. ej. <strong>), se marca el elemento más chico que la contiene.
      if (!hecho) {
        const cands = window.__recorte.flatMap(e => [e, ...e.querySelectorAll('*')]).filter(e => e.textContent.replace(/\s+/g, ' ').includes(frase) && getComputedStyle(e).display !== 'none');
        const el = cands.sort((a, b) => a.textContent.length - b.textContent.length)[0];
        if (el) {
          el.classList.add('recorte-marca');
          [...el.getClientRects()].forEach(rc => out.push({ x: rc.left - caja.x - 3, y: rc.top + scrollY - caja.y - 3, w: rc.width + 6, h: rc.height + 6 }));
          hecho = true;
        }
      }
      if (!hecho) faltan.push(frase);
    }
    return { out, faltan };
  }, r.marcar, caja);
  const lista = [];
  for (const [k, m] of marcas.out.entries()) {
    const archivo = `${r.id}-m${k}.png`;
    await foto(p, path.join(destino, archivo), { x: caja.x + m.x, y: caja.y + m.y, width: m.w, height: m.h });
    lista.push({ x: Math.round(m.x * ESCALA), y: Math.round(m.y * ESCALA), w: Math.round(m.w * ESCALA), h: Math.round(m.h * ESCALA), archivo });
  }
  // Deshace el resaltado para el siguiente recorte de la misma página.
  await p.evaluate(() => {
    document.querySelectorAll('span.recorte-marca').forEach(s => s.replaceWith(...s.childNodes));
    document.querySelectorAll('.recorte-marca').forEach(e => e.classList.remove('recorte-marca'));
  });
  datos[r.id] = { w: Math.round(caja.width * ESCALA), h: Math.round(caja.height * ESCALA), marcas: lista, url };
  console.log(`  ✓ ${r.id}  ${datos[r.id].w}×${datos[r.id].h}  ${lista.length} marcas${marcas.faltan.length ? '  ⚠️ sin encontrar: ' + marcas.faltan.join(' · ') : ''}`);
}
fs.writeFileSync(datosPath, JSON.stringify(datos, null, 1) + '\n', 'utf8');
await navegador.close();
