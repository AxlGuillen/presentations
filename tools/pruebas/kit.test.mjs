// Pruebas mínimas del kit (build-time y el PRNG del runtime).
// Correr: node --test tools/
//
// Sin dependencias: node:test y node:assert. Lo que se prueba es lo que, si se
// rompe, ensucia los diffs de todos los decks o rompe el render cuadro a cuadro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const kit = require('../kit.cjs');
const raiz = path.resolve(import.meta.dirname, '..', '..');
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

const TIPOS = ['puntos', 'confeti', 'flujo', 'curvas', 'facetas', 'medio-tono', 'ondas', 'trazo', 'marco', 'hilos', 'horizonte', 'guilloche'];
// Tope de peso por patrón inline (los más pesados, flujo y medio-tono, rondan 90 KB)
const TOPE = 120 * 1024;

test('kit.patron: la misma semilla da el mismo SVG y una distinta lo cambia', () => {
  for (const t of TIPOS) {
    const a = kit.patron(t, { semilla: 'prueba', paleta: ['#123456', '#ABCDEF'] });
    const b = kit.patron(t, { semilla: 'prueba', paleta: ['#123456', '#ABCDEF'] });
    const c = kit.patron(t, { semilla: 'otra', paleta: ['#123456', '#ABCDEF'] });
    assert.equal(md5(a), md5(b), `${t} no es determinista`);
    if (!['trazo', 'marco', 'horizonte'].includes(t)) assert.notEqual(md5(a), md5(c), `${t} ignora la semilla`);
  }
});

test('kit.patron: cada patrón queda bajo su tope de peso', () => {
  for (const t of TIPOS) {
    const s = kit.patron(t, { semilla: 'prueba', paleta: ['#123456', '#ABCDEF'] });
    assert.ok(s.length < TOPE, `${t} pesa ${(s.length / 1024).toFixed(0)} KB`);
  }
});

test('kit.random: secuencia fija para una semilla dada', () => {
  const r = kit.random('confeti');
  assert.deepEqual([r(), r(), r()].map((x) => x.toFixed(6)), ['0.117366', '0.995767', '0.504471']);
  const n = kit.random(42);
  const m = kit.random(42);
  for (let i = 0; i < 50; i++) assert.equal(n(), m());
});

test('kit.random y random() del runtime dan la misma secuencia', () => {
  // El runtime vive como texto dentro de kit-efectos.cjs: se extraen sus
  // funciones semilla() y prng() y se evalúan aquí mismo.
  const fuente = fs.readFileSync(path.join(raiz, 'tools', 'kit-efectos.cjs'), 'utf8');
  const linea = (nombre) => fuente.split('\n').find((l) => l.trim().startsWith(`function ${nombre}(`));
  const runtime = new Function(`${linea('semilla')}\n${linea('prng')}\nreturn prng;`)();
  for (const s of ['confeti', 'piñata', 'mazo', 42, '🎉 fiesta']) {
    const a = kit.random(s), b = runtime(s);
    for (let i = 0; i < 20; i++) assert.equal(a(), b(), `la semilla ${s} diverge en el paso ${i}`);
  }
});

test('kit.lineas: una caja isométrica deja ver 9 aristas', () => {
  const L = kit.lineas;
  const svg = String(L.dibujar([L.caja([0, 0, 0], [1, 1, 1])], { camara: { iso: true, giro: 45, altura: 30 }, ancho: 400, alto: 400 }));
  const tramos = (svg.match(/d="([^"]+)"/g) || []).reduce((n, d) => n + (d.match(/L/g) || []).length, 0);
  assert.equal(tramos, 9);
  assert.match(svg, /data-capa="silueta"/);
});

test('kit.diferir: deja intacta la primera lámina y es idempotente', () => {
  const sec = (n) => `<section data-label="L${n}" style="background-image: url('assets/fondo${n}.jpg');"><img src="assets/foto${n}.jpg" alt=""><div style="background-image: url('assets/capa${n}.jpg')"></div></section>`;
  const html = `<deck-stage>${sec(1)}${sec(2)}</deck-stage>`;
  const una = kit.diferir(html);
  assert.ok(una.includes(sec(1)), 'la primera lámina cambió');
  assert.ok(una.includes('data-src="assets/foto2.jpg"'), 'la imagen de la segunda no se difirió');
  assert.doesNotMatch(una, /[^-]src="assets\/foto2\.jpg"/, 'quedó un src en la segunda');
  assert.ok(una.includes('data-bg'), 'los fondos no se difirieron');
  assert.equal(kit.diferir(una), una, 'no es idempotente');
});
