// tools/kit-recursos.cjs — Íconos e ilustraciones SVG, incrustados en build-time.
//
//   kit.icono('tabler:sword', { tam, color, trazo })
//   kit.ilustracion('doodle:Reading', { tinta, acento })
//   kit.ilustracion('ruta/a/undraw.svg', { acento })      ← unDraw bajado a mano
//
// Todo sale de una caché commiteada en tools/cache/: si falta algo, se baja una
// vez (tools/iconos.mjs, tools/ilustraciones.mjs) y desde ahí el deck se
// regenera sin red. El SVG va inline en el HTML: cero dependencias en runtime
// y los trazos se pueden dibujar con efecto('dibujo').
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CACHE = path.join(__dirname, 'cache');
const avisados = new Set();

/** Ícono de Iconify (Tabler, Lucide, Phosphor, game-icons… cualquier colección)
 *  como <svg> inline. Hereda el color con currentColor; `trazo` cambia el
 *  grosor de los íconos de línea (Tabler y Lucide vienen a 2). */
const icono = (id, { tam = 64, color = null, trazo = null, estilo = '', titulo = null } = {}) => {
  const [pref, nombre] = id.split(':');
  const archivo = path.join(CACHE, 'iconos', pref, `${nombre}.svg`);
  if (!fs.existsSync(archivo)) {
    execFileSync(process.execPath, [path.join(__dirname, 'iconos.mjs'), id], { stdio: 'inherit' });
  }
  let svg = fs.readFileSync(archivo, 'utf8');
  if (trazo) svg = svg.replace(/stroke-width="[\d.]+"/g, `stroke-width="${trazo}"`);
  const accesible = titulo ? `role="img" aria-label="${titulo}"` : 'aria-hidden="true"';
  svg = svg.replace(/ width="1em" height="1em"/, ` width="${tam}" height="${tam}" data-icono="${id}" ${accesible} style="display:inline-block;vertical-align:middle;flex:none;${color ? `color:${color};` : ''}${estilo}"`);

  // Las colecciones CC BY obligan a dar crédito (game-icons): se avisa una vez.
  const lic = JSON.parse(fs.readFileSync(path.join(CACHE, 'iconos', 'LICENCIAS.json'), 'utf8'))[pref];
  if (lic && /^CC-BY/.test(lic.spdx || '') && !avisados.has(pref)) {
    avisados.add(pref);
    console.warn(`⚠️  ${lic.nombre} es ${lic.licencia}: hay que dar crédito («${lic.nombre} por ${lic.autor}») en el CREDITOS.md del deck.`);
  }
  return svg;
};

/** Ilustración SVG inline, recoloreada con la paleta del deck.
 *   · 'doodle:<Nombre>' → Open Doodles (CC0), de la caché; `tinta` y `acento`.
 *   · cualquier otra cosa es una ruta a un .svg (p. ej. un unDraw bajado a mano
 *     a la carpeta del deck); `acento` reemplaza el morado de unDraw (#6C63FF)
 *     y `colores` es un mapa { '#viejo': '#nuevo' } para lo demás. */
const ilustracion = (fuente, { tinta = '#111111', acento = '#FF5678', colores = {}, estilo = '', titulo = '' } = {}) => {
  let svg;
  if (fuente.startsWith('doodle:')) {
    const nombre = fuente.slice(7);
    const archivo = path.join(CACHE, 'ilustraciones', 'open-doodles', `${nombre}.svg`);
    if (!fs.existsSync(archivo)) execFileSync(process.execPath, [path.join(__dirname, 'ilustraciones.mjs'), nombre], { stdio: 'inherit' });
    svg = fs.readFileSync(archivo, 'utf8').replace(/#010101/g, tinta).replace(/#FF00FE/g, acento);
  } else {
    svg = fs.readFileSync(fuente, 'utf8').replace(/#6c63ff/gi, acento);
  }
  for (const [viejo, nuevo] of Object.entries(colores)) svg = svg.replace(new RegExp(viejo, 'gi'), nuevo);
  const accesible = titulo ? `role="img" aria-label="${titulo}"` : 'aria-hidden="true"';
  // Fuera width/height de la etiqueta raíz: la ilustración llena su contenedor.
  svg = svg.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, ''));
  return svg.replace(/<svg\b/, `<svg data-ilustracion="${fuente}" ${accesible} style="display:block;width:100%;height:auto;${estilo}"`);
};

module.exports = { icono, ilustracion };
