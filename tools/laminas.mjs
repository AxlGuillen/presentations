// Corta las láminas de un deck en miniclips para el montaje automático.
// Uso: node tools/laminas.mjs <carpeta> [--crop=1080:1370:0:275] [--quieto=1] [--sin-render]
//
// Cada <section data-lamina="id"> del index.html sale como:
//   <carpeta>/video-out/laminas/<id>.mp4  la animación completa + `quieto` s del último cuadro
//   <carpeta>/video-out/laminas/<id>.png  el último cuadro (el estado final de la lámina)
//   <carpeta>/video-out/laminas/manifest.json  [{ id, archivo, png, dur_anim, dur }]
// recortados al panel del montaje (por defecto 1080×1370 desde y = 275, el
// encuadre de los flyers de suiza).
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
const dir = path.join(raiz, deck);
if (!deck || !fs.existsSync(path.join(dir, 'index.html'))) {
  console.error('Uso: node tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=s] [--sin-render]');
  process.exit(1);
}

const correr = (cmd, a) => {
  const r = spawnSync(cmd, a, { stdio: 'inherit', cwd: raiz });
  if (r.status !== 0) { console.error(`Falló: ${cmd} ${a.join(' ')}`); process.exit(r.status || 1); }
};
if (!args.includes('--sin-render')) {
  correr(process.execPath, [path.join('tools', 'capturar.mjs'), deck]);
  correr(process.execPath, [path.join('tools', 'cuadros.mjs'), deck, '30']);
}

// Las láminas, en el orden del deck: el índice de la <section> es el NN de los archivos.
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const secciones = [...html.matchAll(/<section\b([^>]*)>/g)].map((m, i) => ({ n: i + 1, id: (m[1].match(/data-lamina="([^"]+)"/) || [])[1] }));
const laminas = secciones.filter(s => s.id);
if (!laminas.length) { console.error('El deck no tiene ninguna <section data-lamina="…">.'); process.exit(1); }

const out = path.join(dir, 'video-out');
const anim = JSON.parse(fs.readFileSync(path.join(out, 'anim', 'anim.json'), 'utf8'));
const destino = path.join(out, 'laminas');
fs.mkdirSync(destino, { recursive: true });

const manifest = [];
for (const { n, id } of laminas) {
  const nn = String(n).padStart(2, '0');
  const clip = path.join(out, 'anim', `anim-${nn}.mp4`), png = path.join(out, 'slides', `slide-${nn}.png`);
  const durAnim = (anim.clips.find(c => c.slide === n) || {}).dur || 0;
  if (fs.existsSync(clip)) {
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-i', clip, '-vf', `crop=${CROP},tpad=stop_mode=clone:stop_duration=${QUIETO}`,
      '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(destino, `${id}.mp4`)]);
  } else {
    // Lámina sin timeline: el PNG quieto la misma duración que el respiro.
    correr('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', png, '-t', String(QUIETO), '-vf', `crop=${CROP},fps=30`,
      '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(destino, `${id}.mp4`)]);
  }
  correr('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `crop=${CROP}`, '-frames:v', '1', path.join(destino, `${id}.png`)]);
  manifest.push({ id, archivo: `${id}.mp4`, png: `${id}.png`, dur_anim: +durAnim.toFixed(3), dur: +(durAnim + QUIETO).toFixed(3) });
  console.log(`  ✓ ${id}  ${durAnim.toFixed(2)} s + ${QUIETO} s`);
}
fs.writeFileSync(path.join(destino, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`\nListo: ${manifest.length} láminas en ${path.relative(raiz, destino)} (recorte ${CROP})`);
