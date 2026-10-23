// Pruebas de kit.ritmo con un beatmap escrito a mano (120 bpm: un beat cada
// medio segundo desde 0,5 s, compases de cuatro).
// Correr: node --test "tools/**/*.test.mjs"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const kit = require('../kit.cjs');
const mapa = require('./beatmap.json');

test('kit.ritmo: b() cuenta desde la lámina e interpola entre beats', () => {
  const r = kit.ritmo(mapa, { desde: 3.2 });
  assert.equal(r.b(0), 0.3);        // el primer beat después de 3,2 es el de 3,5
  assert.equal(r.b(1), 0.8);
  assert.equal(r.b(-1), -0.2);      // el de antes de la lámina
  assert.equal(r.b(2.5), 1.55);     // a la mitad entre 4,5 y 5,0
  assert.equal(r.b(0.25), 0.425);
  assert.deepEqual(r.beats(0, 3), [0.3, 0.8, 1.3]);
  assert.equal(kit.ritmo(mapa, { desde: 3.5 }).b(0), 0, 'un beat que cae justo en desde es el 0');
  assert.equal(r.bpm, 120);
});

test('kit.ritmo: compas() cae en los downbeats', () => {
  const r = kit.ritmo(mapa, { desde: 3.2 });
  // downbeats: 0,5 · 2,5 · 4,5 · 6,5 …
  assert.equal(r.compas(0), 1.3);
  assert.equal(r.compas(1), 3.3);
  for (let k = 0; k < 4; k++) assert.ok(mapa.downbeats.includes(+(r.compas(k) + 3.2).toFixed(3)), `compas(${k}) no es un downbeat`);
});

test('kit.ritmo: drop, palabra y sección relativos a desde', () => {
  const r = kit.ritmo(mapa, { desde: 4 });
  assert.equal(r.drop, 4.5);
  assert.equal(r.palabra('survive'), 1.5);
  assert.equal(r.palabra('SURVIVE', 2), 5, 'sin distinguir mayúsculas ni signos');
  assert.equal(r.palabra('cancion'), 8, 'sin distinguir acentos');
  assert.deepEqual(r.seccion('chorus'), { inicio: 4.5, fin: 10.5, energia: 0.95 });
  assert.equal(kit.ritmo({ beats: [0, 0.5, 1] }).drop, null);
});

test('kit.ritmo: los errores se leen', () => {
  assert.throws(() => kit.ritmo(mapa, { desde: 40 }), /desde=40 s cae fuera de la canción \(va de 0 a 16\.80 s\)/);
  assert.throws(() => kit.ritmo(mapa, { desde: -1 }), /fuera de la canción/);
  assert.throws(() => kit.ritmo({ bpm: 120 }), /no trae «beats»/);
  const r = kit.ritmo(mapa, { desde: 10 });
  assert.throws(() => r.palabra('strong'), /no se canta después de desde=10 s/);
  assert.throws(() => r.palabra('dragón'), /no está en la letra/);
  assert.throws(() => r.b(40), /después del final de la canción/);
  assert.throws(() => r.seccion('bridge'), /no hay sección «bridge»/);
});

test('kit.golpe: empareja el texto con las palabras de la voz', () => {
  const voz = [{ t: 'Once', ini: 0.4 }, { t: 'horas', ini: 0.8 }, { t: 'con', ini: 1.3 }, { t: 'cuarenta', ini: 1.5 }, { t: 'y', ini: 2 }, { t: 'nueve', ini: 2.2 }];
  // La puntuación y las mayúsculas no estorban; la «y» que no está en el texto se salta.
  assert.equal(kit.golpe('Once horas, con cuarenta nueve', voz), '0.4,0.8,1.3,1.5,2.2');
  // Una palabra que la voz no dijo cae 0,25 s después de la anterior.
  assert.equal(kit.golpe('Once horas largas con', voz), '0.4,0.8,1.05,1.3');
  assert.equal(kit.golpe('Once horas', voz, { desfase: 0.1 }), '0.5,0.9');
  assert.equal(kit.golpe('lo que sea', null), '');
});

test('kit.voz: lee los tiempos que deja video.mjs, o null si no hay voz', async () => {
  const fs = await import('node:fs'), os = await import('node:os'), path = await import('node:path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'voz-'));
  assert.equal(kit.voz(dir, 1), null);
  fs.mkdirSync(path.join(dir, 'video-out'));
  fs.writeFileSync(path.join(dir, 'video-out', 'palabras.json'), JSON.stringify([{ slide: 2, palabras: [{ t: 'hola', ini: 0.35, fin: 0.6 }] }]));
  assert.deepEqual(kit.voz(dir, 2), [{ t: 'hola', ini: 0.35, fin: 0.6 }]);
  assert.equal(kit.voz(dir, 1), null);
});
