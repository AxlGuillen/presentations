// Corta las láminas de un deck en miniclips para el montaje automático.
// Uso: node tools/laminas.mjs <carpeta> [--crop=1080:1370:0:275] [--quieto=1] [--fps=30]
//                                       [--alfa | --alfa=webm] [--sin-render] [--solo=id,id]
//
// Cada <section data-lamina="id"> del index.html sale como:
//   <carpeta>/video-out/laminas/<id>.mp4  la animación completa + `quieto` s del último cuadro
//   <carpeta>/video-out/laminas/<id>.png  el último cuadro (el estado final de la lámina)
//   <carpeta>/video-out/laminas/manifest.json
//     [{ id, archivo, png, dur_anim, dur, alfa, caja, palabras }]
//
// Con --alfa las láminas salen con TRANSPARENCIA para ir encima del gameplay:
// <id>.mov en ProRes 4444 (o <id>.webm en VP9 con --alfa=webm) y el PNG final
// con alfa, sacado del último cuadro del clip. Los fondos que el gen.js marca
// con data-fondo se apagan (ver cuadros.mjs). Sin la marca, la lámina sale tal
// cual y solo se vacían los fondos de página.
//
// El manifest crece sin romper lo que ya lee ReelForge (id y archivo):
//   alfa      true si el clip trae transparencia
//   caja      la caja del panel con las claves del montaje de ReelForge
//             ({ width, x: 'center', bottom }), calculada del recorte
//   palabras  las palabras del guion que disparan la lámina, de un
//             data-palabras="k/da, kda" opcional en la <section>
//
// Con --solo=<id>,<id> solo se renderizan y recortan esas láminas, y el manifest.json se
// MEZCLA: conserva las demás si son del mismo formato y sus archivos siguen ahí. Así la API
// local (api-montaje.mjs) rehace solo lo que cambió.
//
// Todo sale recortado al panel del montaje (por defecto 1080×1370 desde
// y = 275, el encuadre de los flyers de suiza).
//
// Primero corre capturar.mjs (PNG finales) y cuadros.mjs (animaciones cuadro a
// cuadro); con --sin-render reutiliza lo que ya haya en video-out/.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { leerSecciones, medidasDeck, cajaDe, CROP_DEFECTO, QUIETO_DEFECTO } from './laminas-lib.mjs';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const deck = (args.find(a => !a.startsWith('--')) || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
const opcion = (n, def) => { const a = args.find(x => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : def; };
const CROP = opcion('crop', CROP_DEFECTO);
const QUIETO = parseFloat(opcion('quieto', String(QUIETO_DEFECTO)));
const SOLO = opcion('solo', '').split(',').map(s => s.trim()).filter(Boolean);
const FPS = parseInt(opcion('fps', '30'), 10);
const pideAlfa = args.find(a => a === '--alfa' || a.startsWith('--alfa='));
const ALFA = pideAlfa ? (pideAlfa === '--alfa=webm' ? 'webm' : 'mov') : null;
const EXT = ALFA || 'mp4';
const CODEC = ALFA === 'mov' ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', '-qscale:v', '9']
  : ALFA === 'webm' ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4']
  : ['-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const dir = path.join(raiz, deck);
if (!deck || !fs.existsSync(path.join(dir, 'index.html'))) {
  console.error('Uso: node tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=s] [--fps=30] [--alfa | --alfa=webm] [--sin-render] [--solo=id,id]');
  process.exit(1);
}
if (SOLO.length) {
  const ids = leerSecciones(fs.readFileSync(path.join(dir, 'index.html'), 'utf8')).map(s => s.id);
  const falta = SOLO.filter(id => !ids.includes(id));
  if (falta.length) { console.error(`El deck no tiene las láminas: ${falta.join(', ')}`); process.exit(1); }
}

const correr = (cmd, a) => {
  const r = spawnSync(cmd, a, { stdio: 'inherit', cwd: raiz });
  if (r.status !== 0) { console.error(`Falló: ${cmd} ${a.join(' ')}`); process.exit(r.status || 1); }
};
if (!args.includes('--sin-render')) {
  // En modo alfa el PNG final sale del propio clip (capturar.mjs da PNG opacos).
  if (!ALFA) correr(process.execPath, [path.join('tools', 'capturar.mjs'), deck]);
  correr(process.execPath, [path.join('tools', 'cuadros.mjs'), deck, String(FPS), ...(ALFA ? [pideAlfa] : []), ...(SOLO.length ? [`--solo=${SOLO.join(',')}`] : [])]);
}

// Las láminas, en el orden del deck: el índice de la <section> es el NN de los archivos.
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const secciones = leerSecciones(html);
// La caja del panel en las claves del montaje de ReelForge: el recorte va
// centrado a lo ancho y se mide desde abajo del lienzo del deck.
const CAJA = cajaDe(CROP, medidasDeck(html).alto);
const laminas = secciones.filter(s => s.id);
if (!laminas.length) { console.error('El deck no tiene ninguna <section data-lamina="…">.'); process.exit(1); }

const out = path.join(dir, 'video-out');
const dirClips = path.join(out, ALFA ? 'anim-alfa' : 'anim');
const anim = JSON.parse(fs.readFileSync(path.join(dirClips, 'anim.json'), 'utf8'));
if (!!anim.alfa !== !!ALFA) { console.error(`Los clips de ${path.relative(raiz, dirClips)} no son ${ALFA ? 'con alfa' : 'opacos'}: córrelo sin --sin-render.`); process.exit(1); }
const destino = path.join(out, 'laminas');
fs.mkdirSync(destino, { recursive: true });

const manifest = [];
for (const { n, id, palabras } of SOLO.length ? laminas.filter(s => SOLO.includes(s.id)) : laminas) {
  const nn = String(n).padStart(2, '0');
  const clip = path.join(dirClips, `anim-${nn}.${EXT}`), png = path.join(out, 'slides', `slide-${nn}.png`);
  const durAnim = (anim.clips.find(c => c.slide === n) || {}).dur || 0;
  const salida = path.join(destino, `${id}.${EXT}`), pngFinal = path.join(destino, `${id}.png`);
  if (fs.existsSync(clip)) {
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-i', clip, '-vf', `crop=${CROP},tpad=stop_mode=clone:stop_duration=${QUIETO}`,
      ...CODEC, '-an', salida]);
  } else if (!ALFA) {
    // Lámina sin timeline: el PNG quieto la misma duración que el respiro.
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', png, '-t', String(QUIETO), '-vf', `crop=${CROP},fps=${FPS}`,
      ...CODEC, salida]);
  } else { console.error(`Falta ${path.relative(raiz, clip)}: córrelo sin --sin-render.`); process.exit(1); }
  if (ALFA) {
    // El último cuadro del clip, con su transparencia (-update 1 deja el último).
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-0.2', '-i', clip, '-vf', `crop=${CROP}`, '-update', '1', '-pix_fmt', 'rgba', pngFinal]);
  } else {
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `crop=${CROP}`, '-frames:v', '1', pngFinal]);
  }
  manifest.push({ id, archivo: `${id}.${EXT}`, png: `${id}.png`, dur_anim: +durAnim.toFixed(3), dur: +(durAnim + QUIETO).toFixed(3),
    alfa: !!ALFA, caja: CAJA, palabras });
  console.log(`  ✓ ${id}  ${durAnim.toFixed(2)} s + ${QUIETO} s`);
}
// Con --solo se mezcla con lo que ya hubiera: las demás láminas del mismo formato, con sus archivos todavía ahí.
let salida = manifest;
if (SOLO.length) {
  const previo = (() => { try { return JSON.parse(fs.readFileSync(path.join(destino, 'manifest.json'), 'utf8')); } catch { return []; } })();
  const orden = laminas.map(s => s.id);
  const nuevas = new Set(manifest.map(l => l.id));
  const conservadas = (Array.isArray(previo) ? previo : []).filter(l => !nuevas.has(l.id) && orden.includes(l.id)
    && l.archivo === `${l.id}.${EXT}` && !!l.alfa === !!ALFA && fs.existsSync(path.join(destino, l.archivo)));
  salida = [...conservadas, ...manifest].sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));
}
fs.writeFileSync(path.join(destino, 'manifest.json'), JSON.stringify(salida, null, 2) + '\n', 'utf8');
console.log(`\nListo: ${manifest.length} láminas en ${path.relative(raiz, destino)} (recorte ${CROP}${ALFA ? `, con alfa en .${EXT}` : ''})`);
