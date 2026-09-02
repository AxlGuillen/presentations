// Reduce el peso de los assets de un deck SIN perder nitidez: mide a qué
// tamaño se muestra realmente cada imagen y la reescala a ese tamaño (por una
// holgura), en vez de tirar calidad de compresión a ciegas.
//
// Por qué hace falta: los splash de Data Dragon vienen a 1215×717 y la rejilla
// de skins los pinta a ~228×134. Eso es 28 veces el área que se ve. El peso no
// está en la compresión, está en los píxeles que nadie mira.
//
// Reglas:
//  · El tamaño objetivo sale del uso MÁS GRANDE del archivo en el deck — un
//    mismo splash puede ser miniatura en una lámina y fondo a sangre en otra.
//  · Con object-fit/background cover la imagen se recorta, así que manda el
//    lado que exige más escala.
//  · Nunca se amplía. Si el objetivo sale mayor que el original, se deja igual.
//  · La holgura (2× por defecto) cubre pantallas hi-DPI, donde deck-stage
//    escala el lienzo por encima de su tamaño de diseño.
//  · Si el reencode no ahorra al menos un 8%, se deja el archivo original.
//
// Uso:  node tools/optimizar-imagenes.mjs <carpeta…> [--aplicar] [--holgura=2]
// Sin --aplicar solo reporta el plan.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const aplicar = args.includes('--aplicar');
const holgura = Number((args.find(a => a.startsWith('--holgura=')) || '--holgura=2').split('=')[1]);
const carpetas = args.filter(a => !a.startsWith('--'));
if (!carpetas.length) { console.error('uso: node tools/optimizar-imagenes.mjs <carpeta…> [--aplicar] [--holgura=2]'); process.exit(1); }

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

const kb = b => (b / 1024).toFixed(0);
const plan = [];

for (const carpeta of carpetas) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1400, height: 900 });
  await pagina.goto(`http://127.0.0.1:${puerto}/${carpeta}/`, { waitUntil: 'networkidle0' });
  await pagina.evaluate(async () => {
    const ds = document.querySelector('deck-stage');
    if (ds && ds.cargarTodo) await ds.cargarTodo();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Para cada archivo: la escala máxima que se le exige respecto a su tamaño
  // natural. 1 = se ve a tamaño completo; 0,2 = se ve al 20%.
  const escalas = await pagina.evaluate(async () => {
    const max = {};
    // La clave es la ruta RELATIVA a assets/, no el nombre suelto: hay decks
    // que guardan en subcarpetas (soloq/assets/avatars, */assets/emblems) y
    // con solo el basename se quedaban fuera del plan.
    const anota = (url, escala) => {
      const m = url.split('?')[0].match(/\/assets\/(.+)$/);
      if (!m || url.slice(0, 5) === 'data:') return;
      max[m[1]] = Math.max(max[m[1]] || 0, escala);
    };
    document.querySelectorAll('deck-stage section img').forEach((img) => {
      if (!img.naturalWidth) return;
      const ajuste = getComputedStyle(img).objectFit;
      const sx = img.offsetWidth / img.naturalWidth, sy = img.offsetHeight / img.naturalHeight;
      anota(img.currentSrc || img.src, ajuste === 'cover' ? Math.max(sx, sy) : Math.min(1, Math.max(sx, sy)));
    });
    // Fondos de <section>: son cover sobre la diapositiva completa, así que
    // hay que medirlos contra el tamaño natural de la propia imagen.
    const secciones = [...document.querySelectorAll('deck-stage > section')];
    for (const s of secciones) {
      const bg = s.style.backgroundImage || '';
      for (const t of (bg.match(/url\([^)]+\)/g) || [])) {
        const u = t.slice(4, -1).replace(/^['"]|['"]$/g, '').trim();
        if (!u || u.slice(0, 5) === 'data:') continue;
        const dims = await new Promise((r) => {
          const im = new Image();
          im.onload = () => r([im.naturalWidth, im.naturalHeight]);
          im.onerror = () => r(null);
          im.src = u;
        });
        if (!dims) continue;
        anota(u, Math.max(s.offsetWidth / dims[0], s.offsetHeight / dims[1]));
      }
    }
    return max;
  });

  const dir = path.join(raiz, carpeta, 'assets');
  for (const [nombre, escala] of Object.entries(escalas)) {
    // og.png la regenera tools/og.mjs y tiene que seguir siendo PNG de 1200×630.
    if (nombre === 'og.png') continue;
    const abs = path.join(dir, nombre);
    if (!fs.existsSync(abs)) continue;
    plan.push({ carpeta, nombre, abs, escala: Math.min(1, escala * holgura), bytes: fs.statSync(abs).size });
  }
  await pagina.close();
}

await navegador.close();
servidor.close();

// ── Reescalado + reencode con Pillow (misma dependencia que portadas.mjs) ──
const script = `
import sys, json, io, os
from PIL import Image
# Las tareas llegan por archivo y no por argv: con mas de cien imagenes el
# JSON rebasa el limite de linea de comandos de Windows y el spawn falla.
with open(sys.argv[1], encoding='utf-8') as fh:
    tareas = json.load(fh)
salida = []
for t in tareas:
    ruta, escala = t['abs'], t['escala']
    im = Image.open(ruta)
    formato = im.format
    w, h = im.size
    nw, nh = max(1, round(w * escala)), max(1, round(h * escala))
    if (nw, nh) != (w, h):
        im = im.resize((nw, nh), Image.LANCZOS)
    buf = io.BytesIO()
    if formato == 'PNG':
        # Los PNG del proyecto son iconos con transparencia: se conserva el
        # canal alfa y se cuantiza solo si eso no rompe los bordes.
        im.save(buf, 'PNG', optimize=True)
    else:
        # 4:4:4 (subsampling=0) a proposito: no se toca el detalle de color,
        # el ahorro tiene que venir de los pixeles que sobran, no del croma.
        im.convert('RGB').save(buf, 'JPEG', quality=88, optimize=True,
                               progressive=True, subsampling=0)
    salida.append({'abs': ruta, 'w': nw, 'h': nh, 'bytes': buf.tell(),
                   'datos': None if not t.get('escribir') else None})
    if t.get('escribir') and buf.tell() < os.path.getsize(ruta) * 0.92:
        with open(ruta, 'wb') as f:
            f.write(buf.getvalue())
        salida[-1]['escrito'] = True
    else:
        salida[-1]['escrito'] = False
print(json.dumps(salida))
`;

const tareas = plan.map(p => ({ abs: p.abs, escala: p.escala, escribir: aplicar }));
const tmp = path.join(os.tmpdir(), `optimizar-${process.pid}.json`);
fs.writeFileSync(tmp, JSON.stringify(tareas), 'utf8');
let bruto;
try {
  bruto = execFileSync('python', ['-c', script, tmp], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} finally {
  fs.rmSync(tmp, { force: true });
}
const res = JSON.parse(bruto.trim().split('\n').pop());

let antes = 0, despues = 0, escritos = 0;
let carpetaActual = '';
plan.forEach((p, i) => {
  const r = res[i];
  antes += p.bytes;
  const nuevo = r.escrito ? r.bytes : (aplicar ? p.bytes : Math.min(r.bytes, p.bytes));
  despues += nuevo;
  if (r.escrito) escritos++;
  if (p.carpeta !== carpetaActual) { carpetaActual = p.carpeta; console.log(`\n── ${p.carpeta} ─────────────────────`); }
  // Un archivo que ya se ve a tamaño completo puede salir MÁS pesado al
  // reencodear: esos se dejan tal cual y se marcan como «se queda».
  const vale = r.bytes < p.bytes * 0.92;
  const marca = aplicar ? (r.escrito ? '✓' : '·') : (vale ? '→' : '·');
  const destino = vale ? `${String(kb(r.bytes)).padStart(4)} KB   ${r.w}×${r.h}` : '     se queda igual';
  console.log(`  ${marca} ${p.nombre.padEnd(26)} ${String(kb(p.bytes)).padStart(4)} → ${destino}`);
});

console.log(`\n${aplicar ? 'Aplicado' : 'Plan (sin aplicar)'}: ${plan.length} imágenes · ${kb(antes)} KB → ${kb(despues)} KB (${(100 - despues / antes * 100).toFixed(0)}% menos)`);
if (aplicar) console.log(`Reescritos: ${escritos} · sin cambios (ahorro < 8%): ${plan.length - escritos}`);
