// Descarga íconos de Iconify a la caché del repo (tools/cache/iconos/).
// Uso: node tools/iconos.mjs tabler:sword ph:sword-duotone game-icons:crossed-swords …
//
// kit.icono() lo llama solo cuando un ícono no está en la caché, así que
// normalmente no hace falta correrlo a mano. La caché se commitea: los decks
// se regeneran sin red y siempre con el mismo SVG.
//
// Junto a cada colección guarda su licencia (de la API de Iconify) en
// LICENCIAS.json, para que kit.icono() avise cuando una pide crédito
// (game-icons es CC BY 3.0).
import fs from 'node:fs';
import path from 'node:path';

const CACHE = path.join(import.meta.dirname, 'cache', 'iconos');
const ids = process.argv.slice(2);
if (!ids.length) { console.error('Uso: node tools/iconos.mjs <coleccion:nombre> …'); process.exit(1); }

const rutaLic = path.join(CACHE, 'LICENCIAS.json');
const licencias = fs.existsSync(rutaLic) ? JSON.parse(fs.readFileSync(rutaLic, 'utf8')) : {};
let fallos = 0;

for (const id of ids) {
  const [pref, nombre] = id.split(':');
  if (!pref || !nombre) { console.error(`  ✗ ${id}: el formato es coleccion:nombre`); fallos++; continue; }
  const res = await fetch(`https://api.iconify.design/${pref}/${nombre}.svg`);
  const svg = await res.text();
  if (!res.ok || !svg.startsWith('<svg')) { console.error(`  ✗ ${id}: no existe en Iconify`); fallos++; continue; }
  fs.mkdirSync(path.join(CACHE, pref), { recursive: true });
  fs.writeFileSync(path.join(CACHE, pref, `${nombre}.svg`), svg);
  if (!licencias[pref]) {
    const info = await (await fetch(`https://api.iconify.design/collections?prefixes=${pref}`)).json();
    const c = info[pref] || {};
    licencias[pref] = { nombre: c.name, autor: c.author?.name, licencia: c.license?.title, spdx: c.license?.spdx, url: c.license?.url };
  }
  console.log(`  ✓ ${id}`);
}
fs.mkdirSync(CACHE, { recursive: true });
fs.writeFileSync(rutaLic, JSON.stringify(licencias, null, 2) + '\n');
// exitCode y no process.exit(): en Windows, salir justo después de un fetch
// revienta libuv (Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)).
process.exitCode = fallos ? 1 : 0;
