// Lo que comparten laminas.mjs y la API: el recorte del deck y la lámina de reposo.
// Uso: node --test tools/pruebas/laminas-lib.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { leerSecciones, recorteDe, validarRecorte, cajaDe, CROP_DEFECTO } from '../laminas-lib.mjs';

const deck = (attrs = '', secciones = '<section data-lamina="a">x</section>') =>
  `<!doctype html><deck-stage width="1080" height="1920"${attrs}>${secciones}</deck-stage>`;

test('recorteDe: el data-recorte del <deck-stage>, y sin él el de siempre', () => {
  assert.equal(recorteDe(deck()), CROP_DEFECTO);
  assert.equal(CROP_DEFECTO, '1080:1370:0:275');
  assert.equal(recorteDe(deck(' data-recorte="1080:680:0:1240"')), '1080:680:0:1240');
  assert.equal(recorteDe(deck(' data-recorte=" 1080:680:0:1240 "')), '1080:680:0:1240', 'tolera espacios');
  // Un data-recorte en una <section> no es el del deck.
  assert.equal(recorteDe(deck('', '<section data-lamina="a" data-recorte="10:10:0:0">x</section>')), CROP_DEFECTO);
});

test('recorteDe: falla con un recorte mal formado o que se sale del lienzo', () => {
  assert.throws(() => recorteDe(deck(' data-recorte="1080x680"')), /Recorte inválido/);
  assert.throws(() => recorteDe(deck(' data-recorte=""')), /Recorte inválido/);
  assert.throws(() => recorteDe(deck(' data-recorte="0:680:0:1240"')), /mayores que 0/);
  assert.throws(() => recorteDe(deck(' data-recorte="1080:680:0:1241"')), /se sale del lienzo de 1080×1920/);
  assert.throws(() => recorteDe(deck(' data-recorte="1081:680:0:0"')), /se sale del lienzo/);
  assert.equal(validarRecorte('1080:1920:0:0', { ancho: 1080, alto: 1920 }), '1080:1920:0:0', 'el lienzo entero cabe');
});

test('cajaDe: la banda inferior llega al borde de abajo; el panel de siempre queda a 275', () => {
  assert.deepEqual(cajaDe('1080:680:0:1240', 1920), { width: 1080, x: 'center', bottom: 0 });
  assert.deepEqual(cajaDe(CROP_DEFECTO, 1920), { width: 1080, x: 'center', bottom: 275 });
});

test('leerSecciones: data-reposo marca la lámina de reposo (y nada más la marca)', () => {
  const s = leerSecciones(deck('', [
    '<section data-lamina="a" data-palabras="x">a</section>',
    '<section data-lamina="am-reposo" data-reposo>b</section>',
    '<section data-lamina="c" data-reposo="">c</section>',
    '<section data-lamina="d" data-reposos="no">d</section>',
  ].join('')));
  assert.deepEqual(s.map(x => [x.id, x.reposo]), [['a', false], ['am-reposo', true], ['c', true], ['d', false]]);
});
