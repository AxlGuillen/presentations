// Pruebas del sonido del video (tools/audio.mjs) con señales sintéticas.
// Correr: node --test "tools/**/*.test.mjs"   (necesita ffmpeg)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SR, bus, sintetizar, escribirWav, mezclar, leerPCM, loudness, efectosDisponibles } from '../audio.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audio-prueba-'));
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a]);
const db = x => 20 * Math.log10(x);
const rms = (x, a, b) => { let s = 0; const i0 = Math.round(a * SR), i1 = Math.round(b * SR); for (let i = i0; i < i1; i++) s += x[i] * x[i]; return Math.sqrt(s / (i1 - i0)); };

// Voz de prueba: un tono de 220 Hz con armónicos que habla de 2 a 4 s y de 6 a 7 s.
const voz = path.join(tmp, 'voz.wav');
ff('-f', 'lavfi', '-i', "aevalsrc=exprs='0.25*(sin(2*PI*220*t)+0.5*sin(2*PI*440*t)+0.3*sin(2*PI*660*t))*(between(t,2,4)+between(t,6,7))':s=48000:d=9", '-ac', '2', voz);
// Cama: ruido rosa constante.
const musica = path.join(tmp, 'cama.wav');
ff('-f', 'lavfi', '-i', 'anoisesrc=color=pink:seed=7:amplitude=0.3:d=12:r=48000', '-ac', '2', musica);

test('audio: cada efecto arranca en su muestra y se sintetiza igual dos veces', () => {
  for (const e of efectosDisponibles) {
    const a = sintetizar(e), b = sintetizar(e);
    assert.deepEqual(Buffer.from(a.buffer), Buffer.from(b.buffer), `${e} no es determinista`);
  }
  const y = bus([{ efecto: 'golpe', t: 1.25 }, { efecto: 'pop', t: 3.5 }], 5);
  const umbral = 1e-4;
  const primero = (desde) => { for (let i = Math.round(desde * SR); i < y.length; i++) if (Math.abs(y[i]) > umbral) return i / SR; return null; };
  // A menos de un cuadro (33 ms a 30 fps), y en la práctica en la muestra.
  assert.ok(Math.abs(primero(0) - 1.25) < 1 / 30, `el golpe arrancó en ${primero(0)}`);
  assert.ok(Math.abs(primero(3) - 3.5) < 1 / 30, `el pop arrancó en ${primero(3)}`);
  assert.ok(Math.abs(primero(0) - 1.25) < 2 / SR);
});

test('audio: la cama baja al menos 8 dB mientras suena la voz', () => {
  const cama = path.join(tmp, 'solo-cama.wav');
  mezclar({ voz, dur: 9, musica: { archivo: musica, fadeIn: 0.01, fadeOut: 0.01 }, salida: cama, soloCama: true, tmp });
  const x = leerPCM(cama);
  const sinVoz = rms(x, 0.5, 1.8), conVoz = rms(x, 2.6, 3.8);
  assert.ok(db(sinVoz) - db(conVoz) >= 8, `solo bajó ${(db(sinVoz) - db(conVoz)).toFixed(1)} dB`);
  // y se recupera cuando la voz calla
  assert.ok(db(sinVoz) - db(rms(x, 5, 5.8)) < 3, 'la cama no volvió a su nivel');
});

test('audio: la mezcla queda a ±1 LU del objetivo, bajo −1 dBTP y del largo pedido', () => {
  const fx = path.join(tmp, 'fx.wav');
  escribirWav(fx, bus([{ efecto: 'whoosh', t: 1 }, { efecto: 'golpe', t: 4.5 }, { efecto: 'ticks', t: 6 }], 9));
  for (const objetivo of [-16, -14]) {
    const salida = path.join(tmp, `mezcla${objetivo}.wav`);
    const r = mezclar({ voz, dur: 9, musica: { archivo: musica }, efectos: fx, salida, objetivo, tmp });
    assert.ok(Math.abs(r.I - objetivo) <= 1, `integrado ${r.I} LUFS con objetivo ${objetivo}`);
    assert.ok(r.TP < -1, `pico real ${r.TP} dBTP`);
    assert.ok(Math.abs(leerPCM(salida).length / SR - 9) < 0.01, 'la mezcla no dura lo que el video');
  }
  // sin música ni efectos también normaliza
  const sola = path.join(tmp, 'sola.wav');
  const r = mezclar({ voz, dur: 9, salida: sola, tmp });
  assert.ok(Math.abs(r.I - -16) <= 1 && r.TP < -1, JSON.stringify(r));
  assert.ok(Math.abs(loudness(sola).I - r.I) < 0.1);
});
