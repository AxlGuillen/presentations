// Corta las láminas de un deck en miniclips para el montaje automático.
// Uso: node tools/laminas.mjs <carpeta> [--crop=1080:1370:0:275] [--quieto=1] [--fps=30]
//                                       [--alfa | --alfa=webm] [--sin-render]
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
// Todo sale recortado al panel del montaje (por defecto 1080×1370 desde
// y = 275, el encuadre de los flyers de suiza).
//
// Primero corre capturar.mjs (PNG finales) y cuadros.mjs (animaciones cuadro a
// cuadro); con --sin-render reutiliza lo que ya haya en video-out/.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const deck = (args.find(a => !a.startsWith('--')) || '').replace(/[\\/]/g, '');
const opcion = (n, def) => { const a = args.find(x => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : def; };
const CROP = opcion('crop', '1080:1370:0:275');
const QUIETO = parseFloat(opcion('quieto', '1'));
const FPS = parseInt(opcion('fps', '30'), 10);
const pideAlfa = args.find(a => a === '--alfa' || a.startsWith('--alfa='));
const ALFA = pideAlfa ? (pideAlfa === '--alfa=webm' ? 'webm' : 'mov') : null;
const EXT = ALFA || 'mp4';
const CODEC = ALFA === 'mov' ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', '-qscale:v', '9']
  : ALFA === 'webm' ? ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4']
  : ['-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const dir = path.join(raiz, deck);
if (!deck || !fs.existsSync(path.join(dir, 'index.html'))) {
  console.error('Uso: node tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=s] [--fps=30] [--alfa | --alfa=webm] [--sin-render]');
  process.exit(1);
}

const correr = (cmd, a) => {
  const r = spawnSync(cmd, a, { stdio: 'inherit', cwd: raiz });
  if (r.status !== 0) { console.error(`Falló: ${cmd} ${a.join(' ')}`); process.exit(r.status || 1); }
};
if (!args.includes('--sin-render')) {
  // En modo alfa el PNG final sale del propio clip (capturar.mjs da PNG opacos).
  if (!ALFA) correr(process.execPath, [path.join('tools', 'capturar.mjs'), deck]);
  correr(process.execPath, [path.join('tools', 'cuadros.mjs'), deck, String(FPS), ...(ALFA ? [pideAlfa] : [])]);
}

// Las láminas, en el orden del deck: el índice de la <section> es el NN de los archivos.
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const secciones = [...html.matchAll(/<section\b([^>]*)>/g)].map((m, i) => ({
  n: i + 1,
  id: (m[1].match(/data-lamina="([^"]+)"/) || [])[1],
  palabras: ((m[1].match(/data-palabras="([^"]+)"/) || [])[1] || '').split(',').map(p => p.trim()).filter(Boolean),
}));
// La caja del panel en las claves del montaje de ReelForge: el recorte va
// centrado a lo ancho y se mide desde abajo del lienzo del deck.
const [cw, ch, , cy] = CROP.split(':').map(Number);
const altoDeck = +((html.match(/<deck-stage[^>]*\bheight="(\d+)"/) || [])[1] || 1920);
const CAJA = { width: cw, x: 'center', bottom: altoDeck - (cy + ch) };
const laminas = secciones.filter(s => s.id);
if (!laminas.length) { console.error('El deck no tiene ninguna <section data-lamina="…">.'); process.exit(1); }

const out = path.join(dir, 'video-out');
const dirClips = path.join(out, ALFA ? 'anim-alfa' : 'anim');
const anim = JSON.parse(fs.readFileSync(path.join(dirClips, 'anim.json'), 'utf8'));
if (!!anim.alfa !== !!ALFA) { console.error(`Los clips de ${path.relative(raiz, dirClips)} no son ${ALFA ? 'con alfa' : 'opacos'}: córrelo sin --sin-render.`); process.exit(1); }
const destino = path.join(out, 'laminas');
fs.mkdirSync(destino, { recursive: true });

const manifest = [];
for (const { n, id, palabras } of laminas) {
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
fs.writeFileSync(path.join(destino, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`\nListo: ${manifest.length} láminas en ${path.relative(raiz, destino)} (recorte ${CROP}${ALFA ? `, con alfa en .${EXT}` : ''})`);
