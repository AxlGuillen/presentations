// Transiciones entre láminas para los videos de video.mjs, con xfade de ffmpeg.
//
// En guion.json:
//   "transicion": "smoothleft"                       ← todas las láminas
//   "transicion": { "tipo": "circleopen", "dur": 0.4 }
//   y por lámina, en slides[i].transicion, la que ENTRA a esa lámina
//   ("corte" o "ninguna" = corte seco).
//
// Cómo no se desfasa la voz: cada segmento se alarga (congelando su último
// cuadro) lo que dura la transición que lo sigue, y el xfade empieza justo
// cuando arranca la narración de la lámina siguiente. El video final dura lo
// mismo que la suma de las láminas, así que tiempos.json y los subtítulos
// siguen valiendo tal cual. El audio no pasa por xfade: se concatena aparte.
import { execFileSync } from 'node:child_process';

// Las que trae xfade (ffmpeg 8). `ffmpeg -h filter=xfade` las lista.
export const TRANSICIONES = ['fade', 'wipeleft', 'wiperight', 'wipeup', 'wipedown', 'slideleft', 'slideright',
  'slideup', 'slidedown', 'circlecrop', 'rectcrop', 'distance', 'fadeblack', 'fadewhite', 'radial', 'smoothleft',
  'smoothright', 'smoothup', 'smoothdown', 'circleopen', 'circleclose', 'vertopen', 'vertclose', 'horzopen',
  'horzclose', 'dissolve', 'pixelize', 'diagtl', 'diagtr', 'diagbl', 'diagbr', 'hlslice', 'hrslice', 'vuslice',
  'vdslice', 'hblur', 'fadegrays', 'wipetl', 'wipetr', 'wipebl', 'wipebr', 'squeezeh', 'squeezev', 'zoomin',
  'fadefast', 'fadeslow', 'hlwind', 'hrwind', 'vuwind', 'vdwind', 'coverleft', 'coverright', 'coverup',
  'coverdown', 'revealleft', 'revealright', 'revealup', 'revealdown'];

const CORTE = 1 / 30;   // un cuadro: un xfade de un cuadro se ve como corte seco

/** Normaliza lo que viene del guion → { tipo, dur } (o corte seco). */
export function leerTransicion(valor, porDefecto = null) {
  const v = valor ?? porDefecto;
  if (!v || v === 'corte' || v === 'ninguna') return { tipo: 'fade', dur: CORTE, corte: true };
  const tipo = typeof v === 'string' ? v : v.tipo;
  const dur = Math.min(1.2, Math.max(0.1, (typeof v === 'object' && v.dur) || 0.35));
  if (!TRANSICIONES.includes(tipo)) throw new Error(`Transición desconocida «${tipo}». Hay: ${TRANSICIONES.join(', ')}`);
  return { tipo, dur };
}

/** ¿El guion pide alguna transición? */
export function hayTransiciones(guion) {
  return !!guion.transicion || guion.slides.some((s, i) => i > 0 && s.transicion && s.transicion !== 'corte' && s.transicion !== 'ninguna');
}

/** Une los segmentos con xfade. segmentos[i] = ruta de un mp4 con audio que
 *  dura totales[i] segundos; trans[i] = { tipo, dur } de la transición que
 *  ENTRA a la lámina i (trans[0] se ignora). Escribe `salida`. */
export function unir({ segmentos, totales, trans, salida, fps = 30 }) {
  const n = segmentos.length;
  if (n === 1) {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', segmentos[0], '-c', 'copy', salida]);
    return;
  }
  const filtros = [];
  for (let i = 0; i < n; i++) {
    const extra = i < n - 1 ? trans[i + 1].dur : 0;   // se congela lo que dura la transición que sigue
    filtros.push(`[${i}:v]settb=AVTB,fps=${fps},format=yuv420p${extra ? `,tpad=stop_mode=clone:stop_duration=${extra.toFixed(3)}` : ''}[v${i}]`);
  }
  let previo = 'v0', acumulado = 0;
  for (let i = 1; i < n; i++) {
    acumulado += totales[i - 1];
    const sale = i === n - 1 ? 'vout' : `x${i}`;
    filtros.push(`[${previo}][v${i}]xfade=transition=${trans[i].tipo}:duration=${trans[i].dur.toFixed(3)}:offset=${acumulado.toFixed(3)}[${sale}]`);
    previo = sale;
  }
  filtros.push(`${segmentos.map((_, i) => `[${i}:a]`).join('')}concat=n=${n}:v=0:a=1[aout]`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...segmentos.flatMap((s) => ['-i', s]),
    '-filter_complex', filtros.join(';'), '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', salida], { stdio: ['ignore', 'inherit', 'inherit'] });
}
