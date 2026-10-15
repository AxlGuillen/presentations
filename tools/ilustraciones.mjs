// Descarga ilustraciones de Open Doodles (CC0, Pablo Stanley) a la caché del
// repo (tools/cache/ilustraciones/open-doodles/) como SVG puro.
// Uso: node tools/ilustraciones.mjs Reading Coffee …     (o --todas)
//
// La fuente es el paquete react-open-doodles (MIT), que trae los 33 doodles
// como componentes con el SVG dentro y dos colores como parámetro: tinta y
// acento. Aquí se sacan a SVG y esos dos colores quedan como centinelas
// (#010101 tinta, #FF00FE acento) que kit.ilustracion() cambia por la paleta
// del deck.
//
// unDraw NO se descarga así: su licencia prohíbe el acceso automatizado. Sus
// SVG se bajan a mano de undraw.co y se pasan a kit.ilustracion() por ruta;
// su color de acento por defecto es #6C63FF.
import fs from 'node:fs';
import path from 'node:path';

const CACHE = path.join(import.meta.dirname, 'cache', 'ilustraciones', 'open-doodles');
const BASE = 'https://raw.githubusercontent.com/lunahq/react-open-doodles/master/src/components';
const TODAS = ['Ballet', 'Bikini', 'Chilling', 'Clumsy', 'Coffee', 'Dancing', 'DogJump', 'Doggie', 'Float', 'Groovy',
  'IceCream', 'Jumping', 'Laying', 'Levitate', 'Loving', 'Meditating', 'Moshing', 'Petting', 'Plant', 'Reading',
  'ReadingSide', 'RollerSkating', 'Rolling', 'Running', 'Selfie', 'Sitting', 'SittingReading', 'Sleek', 'Sprinting',
  'Strolling', 'Swinging', 'Unboxing', 'Zombieing'];

const pedidos = process.argv.includes('--todas') ? TODAS : process.argv.slice(2);
if (!pedidos.length) { console.error(`Uso: node tools/ilustraciones.mjs <Nombre> …  (o --todas)\nHay: ${TODAS.join(', ')}`); process.exit(1); }

// JSX → atributos SVG
const ATRIBUTOS = { fillRule: 'fill-rule', clipRule: 'clip-rule', strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin', strokeMiterlimit: 'stroke-miterlimit', fillOpacity: 'fill-opacity',
  strokeOpacity: 'stroke-opacity', clipPath: 'clip-path', xlinkHref: 'href', stopColor: 'stop-color' };

fs.mkdirSync(CACHE, { recursive: true });
let fallos = 0;
for (const nombre of pedidos) {
  const res = await fetch(`${BASE}/${nombre}Doodle.tsx`);
  if (!res.ok) { console.error(`  ✗ ${nombre}: no existe (hay: ${TODAS.join(', ')})`); fallos++; continue; }
  const tsx = await res.text();
  let svg = tsx.slice(tsx.indexOf('<svg'), tsx.lastIndexOf('</svg>') + 6);
  svg = svg.replace(/=\{accent\}/g, '="#FF00FE"').replace(/=\{ink\}/g, '="#010101"');
  for (const [jsx, attr] of Object.entries(ATRIBUTOS)) svg = svg.replace(new RegExp(`\\b${jsx}=`, 'g'), `${attr}=`);
  svg = svg.replace(/\s+/g, ' ').replace(/> </g, '><');
  if (/[{}]/.test(svg)) { console.error(`  ✗ ${nombre}: quedó JSX sin convertir`); fallos++; continue; }
  fs.writeFileSync(path.join(CACHE, `${nombre}.svg`), svg);
  console.log(`  ✓ ${nombre}`);
}
fs.writeFileSync(path.join(CACHE, 'LICENCIA.md'),
  '# Open Doodles\n\nIlustraciones de Pablo Stanley (opendoodles.com), **CC0** (dominio público).\n' +
  'Extraídas del paquete react-open-doodles (MIT) con `node tools/ilustraciones.mjs`.\n' +
  'Colores centinela: `#010101` tinta, `#FF00FE` acento (los cambia `kit.ilustracion()`).\n');
// exitCode y no process.exit(): en Windows, salir justo después de un fetch
// revienta libuv (Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)).
process.exitCode = fallos ? 1 : 0;
