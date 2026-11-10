// Corta las láminas de un deck en miniclips para el montaje automático.
// Uso: node tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=1] [--fps=30]
//                                       [--alfa | --alfa=webm] [--banda=abajo|arriba] [--sin-render] [--solo=id,id]
//
// Cada <section data-lamina="id"> del index.html sale como:
//   <carpeta>/video-out/laminas/<id>.mp4  la animación completa + `quieto` s del último cuadro
//   <carpeta>/video-out/laminas/<id>.png  el último cuadro (el estado final de la lámina)
//   <carpeta>/video-out/laminas/manifest.json
//     [{ id, archivo, png, dur_anim, dur, alfa, caja, palabras, recorte, banda?, reposo? }]
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
//   recorte   el recorte del panel (W:H:X:Y) con el que se cortó
//   banda     en los decks de banda, el lado para el que se exportó: 'abajo' o 'arriba'
//   reposo    true en la lámina de reposo (data-reposo en la <section>): la
//             banda decorada sin dato con la que ReelForge llena los huecos
//
// DECKS DE BANDA (data-recorte o data-banda en el <deck-stage>: t1-blg, vayne-troll, tom-draft…): la
// banda es opaca de borde a borde, así que salen SIEMPRE en <id>.mp4 (H.264, yuv420p) con alfa: false,
// aunque se pida --alfa (avisa y lo ignora). Si un deck de banda sí necesita transparencia, lo declara
// con <deck-stage data-alfa="webm"> (o "mov") y sale con alfa como antes.
// Con --banda=arriba sale la variante para la banda superior: el deck se abre con ?banda=arriba, que
// invierte el riel y los adornos de orientación ([data-riel], ver kit.banda()) sin tocar el contenido,
// y todo va a video-out/laminas-arriba/ (la de abajo sigue en video-out/laminas/). Solo vale en los decks
// que declaran data-banda; sin --banda, el lado es el de su data-banda (abajo por omisión).
//
// Si el deck trae clips.json, sus clips (video del canal ya cortado) se copian a
// video-out/laminas/<id>.<ext> con su <id>.png y entran en el manifest tras su
// lámina como { tipo: "clip", id, archivo, png, dur, ancho, alto, despues?, palabras }.
// No se renderizan ni se recortan (ver ponerClips en laminas-lib.mjs).
//
// Con --solo=<id>,<id> solo se renderizan y recortan esas láminas, y el manifest.json se
// MEZCLA: conserva las demás si son del mismo formato y recorte y sus archivos siguen ahí. Así la API
// local (api-montaje.mjs) rehace solo lo que cambió.
//
// Todo sale recortado al panel del montaje: el que declare el deck en
// <deck-stage data-recorte="1080:680:0:1240"> (la banda inferior) o, sin el
// atributo, 1080×1370 desde y = 275 (el encuadre de los flyers de suiza).
// --crop gana a los dos.
//
// Primero corre capturar.mjs (PNG finales) y cuadros.mjs (animaciones cuadro a
// cuadro); con --sin-render reutiliza lo que ya haya en video-out/.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { leerSecciones, medidasDeck, cajaDe, recorteDe, validarRecorte, leerClips, ponerClips, formatoDe, bandaDe, carpetaLaminas, carpetaAnim, carpetaSlides,
  CROP_DEFECTO, QUIETO_DEFECTO } from './laminas-lib.mjs';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const deck = (args.find(a => !a.startsWith('--')) || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
const opcion = (n, def) => { const a = args.find(x => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : def; };
const CROP_PEDIDO = opcion('crop', '');
const QUIETO = parseFloat(opcion('quieto', String(QUIETO_DEFECTO)));
const SOLO = opcion('solo', '').split(',').map(s => s.trim()).filter(Boolean);
const FPS = parseInt(opcion('fps', '30'), 10);
const pideAlfa = args.find(a => a === '--alfa' || a.startsWith('--alfa='));
const ALFA_PEDIDO = pideAlfa ? (pideAlfa === '--alfa=webm' ? 'webm' : 'mov') : null;
const BANDA_PEDIDA = opcion('banda', '');
const dir = path.join(raiz, deck);
if (!deck || !fs.existsSync(path.join(dir, 'index.html'))) {
  console.error('Uso: node tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=s] [--fps=30] [--alfa | --alfa=webm] [--banda=abajo|arriba] [--sin-render] [--solo=id,id]');
  process.exit(1);
}
// El formato y el lado salen del deck: un deck de banda es opaco (mp4) salvo que declare data-alfa.
let ALFA, BANDA;
try {
  const h = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const f = formatoDe(h, ALFA_PEDIDO);
  if (f.ignorado) console.warn(`  ⚠ ${deck} es un deck de banda opaca: ${pideAlfa} se ignora y sale en mp4 (si necesita transparencia, declara data-alfa="webm" en su <deck-stage>).`);
  ALFA = f.formato === 'mp4' ? null : f.formato;
  BANDA = bandaDe(h, BANDA_PEDIDA);
} catch (e) { console.error(e.message); process.exit(1); }
const EXT = ALFA || 'mp4';
const CODEC = ALFA === 'mov' ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', '-qscale:v', '9']
  : ALFA === 'webm' ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4']
  : ['-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
if (SOLO.length) {
  const ids = leerSecciones(fs.readFileSync(path.join(dir, 'index.html'), 'utf8')).map(s => s.id);
  const falta = SOLO.filter(id => !ids.includes(id));
  if (falta.length) { console.error(`El deck no tiene las láminas: ${falta.join(', ')}`); process.exit(1); }
}

// El recorte y los clips se validan antes de renderizar: un error falla ya, no al final.
let CROP;
try {
  const h0 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  CROP = CROP_PEDIDO ? validarRecorte(CROP_PEDIDO, medidasDeck(h0)) : recorteDe(h0);
  for (const c of leerClips(dir, leerSecciones(h0).map(s => s.id).filter(Boolean))) {
    if (!fs.existsSync(c.origen)) throw new Error(`No existe el clip «${c.id}»: ${c.origen}`);
  }
} catch (e) { console.error(e.message); process.exit(1); }

const correr = (cmd, a) => {
  const r = spawnSync(cmd, a, { stdio: 'inherit', cwd: raiz });
  if (r.status !== 0) { console.error(`Falló: ${cmd} ${a.join(' ')}`); process.exit(r.status || 1); }
};
if (!args.includes('--sin-render')) {
  // En modo alfa el PNG final sale del propio clip (capturar.mjs da PNG opacos).
  const lado = BANDA ? [`--banda=${BANDA}`] : [];
  if (!ALFA) correr(process.execPath, [path.join('tools', 'capturar.mjs'), deck, ...lado]);
  correr(process.execPath, [path.join('tools', 'cuadros.mjs'), deck, String(FPS), ...(ALFA ? [`--alfa=${ALFA}`] : []), ...(SOLO.length ? [`--solo=${SOLO.join(',')}`] : []), ...lado]);
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
const dirClips = path.join(out, carpetaAnim(ALFA, BANDA));
const anim = JSON.parse(fs.readFileSync(path.join(dirClips, 'anim.json'), 'utf8'));
if (!!anim.alfa !== !!ALFA) { console.error(`Los clips de ${path.relative(raiz, dirClips)} no son ${ALFA ? 'con alfa' : 'opacos'}: córrelo sin --sin-render.`); process.exit(1); }
if (BANDA && (anim.banda || 'abajo') !== BANDA) { console.error(`Los clips de ${path.relative(raiz, dirClips)} no son de la banda de ${BANDA}: córrelo sin --sin-render.`); process.exit(1); }
const destino = path.join(out, carpetaLaminas(BANDA));
// El decodificador VP9 propio de FFmpeg descarta el alfa de un .webm (sale yuv420p: lo
// transparente queda negro y opaco); libvpx lo lee (yuva420p). ProRes no tiene ese problema.
const LEER = EXT === 'webm' ? ['-c:v', 'libvpx-vp9'] : [];
fs.mkdirSync(destino, { recursive: true });

const manifest = [];
for (const { n, id, palabras, reposo } of SOLO.length ? laminas.filter(s => SOLO.includes(s.id)) : laminas) {
  const nn = String(n).padStart(2, '0');
  const clip = path.join(dirClips, `anim-${nn}.${EXT}`), png = path.join(out, carpetaSlides(BANDA), `slide-${nn}.png`);
  const durAnim = (anim.clips.find(c => c.slide === n) || {}).dur || 0;
  const salida = path.join(destino, `${id}.${EXT}`), pngFinal = path.join(destino, `${id}.png`);
  if (fs.existsSync(clip)) {
    correr('ffmpeg', ['-y', '-loglevel', 'error', ...LEER, '-i', clip, '-vf', `crop=${CROP},tpad=stop_mode=clone:stop_duration=${QUIETO}`,
      ...CODEC, '-an', salida]);
  } else if (!ALFA) {
    // Lámina sin timeline: el PNG quieto la misma duración que el respiro.
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', png, '-t', String(QUIETO), '-vf', `crop=${CROP},fps=${FPS}`,
      ...CODEC, salida]);
  } else { console.error(`Falta ${path.relative(raiz, clip)}: córrelo sin --sin-render.`); process.exit(1); }
  if (ALFA) {
    // El último cuadro del clip, con su transparencia (-update 1 deja el último).
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-0.2', ...LEER, '-i', clip, '-vf', `crop=${CROP}`, '-update', '1', '-pix_fmt', 'rgba', pngFinal]);
  } else {
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `crop=${CROP}`, '-frames:v', '1', pngFinal]);
  }
  manifest.push({ id, archivo: `${id}.${EXT}`, png: `${id}.png`, dur_anim: +durAnim.toFixed(3), dur: +(durAnim + QUIETO).toFixed(3),
    alfa: !!ALFA, caja: CAJA, palabras, recorte: CROP, ...(BANDA ? { banda: BANDA } : {}), ...(reposo ? { reposo: true } : {}) });
  console.log(`  ✓ ${id}  ${durAnim.toFixed(2)} s + ${QUIETO} s`);
}
// Con --solo se mezcla con lo que ya hubiera: las demás láminas del mismo formato, con sus archivos todavía ahí.
let salida = manifest;
if (SOLO.length) {
  const previo = (() => { try { return JSON.parse(fs.readFileSync(path.join(destino, 'manifest.json'), 'utf8')); } catch { return []; } })();
  const orden = laminas.map(s => s.id);
  const nuevas = new Set(manifest.map(l => l.id));
  const conservadas = (Array.isArray(previo) ? previo : []).filter(l => !l.tipo && !nuevas.has(l.id) && orden.includes(l.id)
    && l.archivo === `${l.id}.${EXT}` && !!l.alfa === !!ALFA && (l.recorte || CROP_DEFECTO) === CROP && (l.banda || null) === BANDA
    && fs.existsSync(path.join(destino, l.archivo)));
  salida = [...conservadas, ...manifest].sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));
}
fs.writeFileSync(path.join(destino, 'manifest.json'), JSON.stringify(salida, null, 2) + '\n', 'utf8');
// El guion marcado va junto al manifest: el de la carpeta del deck si lo trae y, si no, el que ya esté en
// video-out/laminas/ (así la variante de arriba lleva el mismo).
const guion = [path.join(dir, 'guion-marcado.txt'), path.join(out, 'laminas', 'guion-marcado.txt')].find(f => fs.existsSync(f));
if (guion && path.resolve(guion) !== path.resolve(destino, 'guion-marcado.txt')) fs.copyFileSync(guion, path.join(destino, 'guion-marcado.txt'));
// Los clips de clips.json (si el deck trae) se copian y entran en el manifest tras su lámina.
let clips = [];
try { clips = ponerClips({ dir, destino, idsLaminas: laminas.map(s => s.id) }); }
catch (e) { console.error(e.message); process.exit(1); }
for (const c of clips) console.log(`  ✓ clip ${c.id}  ${c.dur} s  ${c.ancho}×${c.alto}${c.despues ? `  tras ${c.despues}` : ''}`);
console.log(`\nListo: ${manifest.length} láminas${clips.length ? ` y ${clips.length} clips` : ''} en ${path.relative(raiz, destino)} (recorte ${CROP}${BANDA ? `, banda de ${BANDA}` : ''}${ALFA ? `, con alfa en .${EXT}` : ', opacas en .mp4'})`);
