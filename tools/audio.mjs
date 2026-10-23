// Sonido del video: efectos sintetizados, música con ducking y loudness.
// Lo usa video.mjs al final del montaje; las pruebas están en
// tools/pruebas/audio.test.mjs.
//
// · Efectos SIN archivos: se sintetizan aquí como muestras (ruido con semilla
//   del kit y senos), así no hay licencias que cuidar en un repo público y el
//   mismo guion da el mismo audio. El bus de efectos se arma entero en un WAV
//   del largo del video, con cada efecto puesto en su muestra exacta: nada de
//   adelay (en ffmpeg 8.1 su relleno sale sin marcas de tiempo y adelanta lo
//   que viene después).
// · Música: se recorta al largo del video, se nivela contra la voz (la cama
//   queda `cama` LU por debajo; −12 por defecto) y baja sola mientras se habla
//   con sidechaincompress, con la voz de llave.
// · Loudness en dos pasadas: la primera mide el integrado de la mezcla y la
//   segunda aplica la ganancia que falta, lineal, más un alimiter bajo −1 dBTP.
//   No se usa loudnorm para aplicar: con linear=true se pasa solo a modo
//   dinámico cuando el pico no le cabe, y entonces deshace la bajada de la
//   música; una ganancia fija con limitador es lineal siempre.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { prng } = require('./kit-patrones.cjs');

export const SR = 48000;

// Qué suena con cada receta del kit (las etiquetas sfx:<receta> de la timeline).
export const EFECTO_DE = { cortinilla: 'whoosh', lineas: 'whoosh', sello: 'golpe', contador: 'ticks', bento: 'pop', piezas: 'pop',
  palabra: 'golpe', multikill: 'golpe', impacto: 'golpe', rayo: 'whoosh', letrero: 'whoosh' };

// ── Síntesis ──────────────────────────────────────────────────────────────
// Cada efecto arranca en su muestra 0: lo que se ve y lo que suena empiezan
// juntos. Amplitudes de pico entre 0,2 y 0,6 antes del volumen del bus.

/** Filtro pasabanda de estado variable (Chamberlin), con la frecuencia
 *  pudiendo cambiar muestra a muestra. */
function pasabanda(x, frec, q = 1.2) {
  const y = new Float32Array(x.length);
  let lp = 0, bp = 0;
  for (let i = 0; i < x.length; i++) {
    const f = 2 * Math.sin(Math.PI * Math.min(frec(i), SR / 6) / SR);
    const hp = x[i] - lp - bp / q;
    bp += f * hp; lp += f * bp;
    y[i] = bp;
  }
  return y;
}

const ruido = (n, semilla) => { const r = prng(semilla); return Float32Array.from({ length: n }, () => r() * 2 - 1); };

const SINTE = {
  // Aire que pasa: ruido con un pasabanda que sube y baja, envolvente en campana.
  whoosh(semilla) {
    const n = Math.round(0.5 * SR), x = ruido(n, semilla + ':whoosh');
    const y = pasabanda(x, i => { const p = i / n; return 350 + 2600 * Math.sin(Math.PI * Math.min(1, p * 1.15)); }, 1.4);
    let max = 0;
    for (let i = 0; i < n; i++) { const p = i / n; y[i] *= Math.sin(Math.PI * Math.min(1, p / 0.9)) ** 2 * (p < 0.004 ? p / 0.004 : 1); max = Math.max(max, Math.abs(y[i])); }
    for (let i = 0; i < n; i++) y[i] *= 0.32 / max;
    return y;
  },
  // Golpe seco: un seno grave que se hunde (120 → 48 Hz) con un chasquido encima.
  golpe(semilla) {
    const n = Math.round(0.38 * SR), y = new Float32Array(n), x = ruido(n, semilla + ':golpe');
    let fase = 0, lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, f = 48 + 72 * Math.exp(-t * 18);
      fase += 2 * Math.PI * f / SR;
      lp += 0.25 * (x[i] - lp);
      y[i] = 0.6 * Math.sin(fase) * Math.exp(-t * 11) + 0.35 * lp * Math.exp(-t * 160);
    }
    return y;
  },
  // Ticks de contador: clics agudos que se espacian como un power2.out (el
  // ease del contador), catorce en un segundo.
  ticks(semilla) {
    const dur = 1.05, n = Math.round(dur * SR), y = new Float32Array(n), N = 14, r = prng(semilla + ':ticks');
    for (let k = 0; k < N; k++) {
      const ini = Math.round((1 - Math.sqrt(1 - k / N)) * (dur - 0.03) * SR), f = 2400 + 500 * r(), g = 0.2 * (1 - 0.35 * k / N);
      for (let j = 0; j < 0.014 * SR && ini + j < n; j++) y[ini + j] += g * Math.sin(2 * Math.PI * f * j / SR) * Math.exp(-j / SR * 380);
    }
    return y;
  },
  // Pop: un blip que sube de 300 a 900 Hz y se apaga rápido.
  pop() {
    const n = Math.round(0.13 * SR), y = new Float32Array(n);
    let fase = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      fase += 2 * Math.PI * (300 + 600 * Math.min(1, t / 0.05)) / SR;
      y[i] = 0.32 * Math.sin(fase) * Math.exp(-t * 34) * Math.min(1, i / 24);
    }
    return y;
  },
};

export const efectosDisponibles = Object.keys(SINTE);

export function sintetizar(nombre, semilla = 'sfx') {
  if (!SINTE[nombre]) throw new Error(`Efecto de sonido desconocido: ${nombre} (hay ${efectosDisponibles.join(', ')})`);
  return SINTE[nombre](String(semilla));
}

/** Bus de efectos: un canal del largo del video con cada efecto en su
 *  muestra. eventos = [{ efecto, t }], con t en segundos. */
export function bus(eventos, dur, { volumen = 1 } = {}) {
  const y = new Float32Array(Math.ceil(dur * SR));
  eventos.forEach((e, k) => {
    const x = sintetizar(e.efecto, `${e.efecto}:${k}`), ini = Math.round(e.t * SR);
    for (let i = 0; i < x.length && ini + i < y.length; i++) if (ini + i >= 0) y[ini + i] += x[i] * volumen;
  });
  return y;
}

/** WAV mono en float de 32 bits (formato 3). */
export function escribirWav(ruta, muestras) {
  const datos = Buffer.from(muestras.buffer, muestras.byteOffset, muestras.byteLength);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + datos.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(32, 34);
  h.write('data', 36); h.writeUInt32LE(datos.length, 40);
  fs.writeFileSync(ruta, Buffer.concat([h, datos]));
}

// ── Medición ──────────────────────────────────────────────────────────────

/** Integrado (LUFS) y pico real (dBTP) con ebur128. */
export function loudness(archivo) {
  const log = spawnSync('ffmpeg', ['-nostats', '-v', 'info', '-i', archivo, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const resumen = log.slice(log.lastIndexOf('Summary:'));
  const I = parseFloat((resumen.match(/I:\s+(-?[\d.]+|-inf) LUFS/) || [])[1]);
  const TP = parseFloat((resumen.match(/Peak:\s+(-?[\d.]+|-inf) dBFS/) || [])[1]);
  return { I: Number.isFinite(I) ? I : -70, TP: Number.isFinite(TP) ? TP : -70 };
}

/** Muestras mono en float (para medir en las pruebas). */
export function leerPCM(archivo) {
  const b = execFileSync('ffmpeg', ['-v', 'error', '-i', archivo, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
}

// ── Mezcla ────────────────────────────────────────────────────────────────

/** Dónde vive la pista: ruta absoluta, o relativa a MUSICA_DIR (variable de
 *  entorno o .env), a tools/audio/ (las CC0 del repo) o a la carpeta del deck. */
export function resolverPista(pista, { musicaDir, dirDeck } = {}) {
  const candidatos = path.isAbsolute(pista) ? [pista]
    : [musicaDir && path.join(musicaDir, pista), path.join(import.meta.dirname, 'audio', pista), dirDeck && path.join(dirDeck, pista)].filter(Boolean);
  const hallada = candidatos.find(c => fs.existsSync(c));
  if (!hallada) throw new Error(`No encontré la pista de música «${pista}» (busqué en: ${candidatos.join(', ')})`);
  return hallada;
}

/**
 * Mezcla voz + música con ducking + efectos y normaliza el loudness.
 *  voz      archivo con la voz (el audio del video ya montado)
 *  dur      largo del video en segundos: la salida dura exactamente eso
 *  musica   { archivo, volumen?, cama = -12, desde = 0, fadeIn = 1.5, fadeOut = 2, ducking? } o null
 *  efectos  WAV del bus de efectos (o null); entra DESPUÉS del ducking, así
 *           que no agacha la música
 *  objetivo LUFS integrados (−16 narrado, −14 reel corto) · pico en dBTP
 *  soloCama solo para las pruebas: devuelve la música ya agachada, sin voz
 * Devuelve { I, TP, ganancia } medidos sobre la salida (WAV float).
 */
export function mezclar({ voz, dur, musica = null, efectos = null, salida, objetivo = -16, pico = -1, soloCama = false, tmp }) {
  const D = dur.toFixed(3);
  const dirTmp = tmp || path.dirname(salida);
  const entradas = ['-i', voz];
  const fmt = `aresample=${SR},aformat=sample_fmts=fltp:channel_layouts=stereo`;
  const cadenas = [`[0:a]${fmt},apad,atrim=0:${D},asetpts=N/SR/TB,asplit=2[v][llave]`];
  const aMezclar = ['[v]'];
  if (musica) {
    let g = musica.volumen;
    if (g == null) {
      // Nivel de la cama contra la voz: se mide un tramo de la pista igual de largo.
      const Lv = loudness(voz).I;
      const muestra = path.join(dirTmp, 'musica-medida.wav');
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-stream_loop', '-1', '-ss', String(musica.desde || 0), '-i', musica.archivo, '-t', D, '-ac', '2', '-ar', String(SR), muestra]);
      const Lm = loudness(muestra).I;
      fs.rmSync(muestra, { force: true });
      g = 10 ** ((Lv + (musica.cama ?? -12) - Lm) / 20);
    }
    entradas.push('-stream_loop', '-1', '-ss', String(musica.desde || 0), '-i', musica.archivo);
    const fi = musica.fadeIn ?? 1.5, fo = musica.fadeOut ?? 2;
    const duck = musica.ducking || 'threshold=0.03:ratio=8:attack=20:release=400';
    cadenas.push(`[1:a]${fmt},atrim=0:${D},asetpts=N/SR/TB,volume=${g.toFixed(5)},afade=t=in:d=${fi},afade=t=out:st=${Math.max(0, dur - fo).toFixed(3)}:d=${fo}[m]`);
    cadenas.push(`[m][llave]sidechaincompress=${duck}[cama]`);
    aMezclar.push('[cama]');
  } else {
    cadenas.push('[llave]anullsink');
  }
  if (efectos && !soloCama) {
    entradas.push('-i', efectos);
    cadenas.push(`[${entradas.filter(a => a === '-i').length - 1}:a]${fmt},apad,atrim=0:${D},asetpts=N/SR/TB[fx]`);
    aMezclar.push('[fx]');
  }
  if (soloCama) {
    if (!musica) throw new Error('soloCama necesita música');
    cadenas[0] = cadenas[0].replace('asplit=2[v][llave]', 'asplit=2[vnada][llave]');
    cadenas.push('[vnada]anullsink', '[cama]anull[out]');
  } else {
    cadenas.push(`${aMezclar.join('')}amix=inputs=${aMezclar.length}:normalize=0:duration=first[out]`);
  }
  // Primera pasada: la mezcla cruda, medida. Segunda: ganancia lineal y limitador.
  const crudo = path.join(dirTmp, 'mezcla-cruda.wav');
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...entradas, '-filter_complex', cadenas.join(';'), '-map', '[out]', '-t', D, '-c:a', 'pcm_f32le', crudo]);
  if (soloCama) { fs.renameSync(crudo, salida); return { ...loudness(salida), ganancia: 0 }; }
  const ganancia = objetivo - loudness(crudo).I;
  // El limitador trabaja por muestra: 0,8 (−1,9 dBFS) deja margen para el
  // pico real entre muestras y para el AAC.
  const limite = Math.min(0.8, 10 ** ((pico - 0.9) / 20));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', crudo, '-af', `volume=${ganancia.toFixed(2)}dB,alimiter=limit=${limite.toFixed(3)}:attack=1:release=60:level=false`, '-t', D, '-c:a', 'pcm_f32le', salida]);
  fs.rmSync(crudo, { force: true });
  return { ...loudness(salida), ganancia: +ganancia.toFixed(2) };
}
