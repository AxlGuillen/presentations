// Lo que comparten laminas.mjs y la API: el recorte del deck y la lámina de reposo.
// Uso: node --test tools/pruebas/laminas-lib.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { leerSecciones, recorteDe, validarRecorte, cajaDe, CROP_DEFECTO, leerClips, insertarClips, ponerClips } from '../laminas-lib.mjs';

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

// ── Clips en el manifest (clips.json) ──

const carpeta = (clips) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clips-'));
  if (clips !== undefined) fs.writeFileSync(path.join(dir, 'clips.json'), JSON.stringify(clips));
  return dir;
};

test('leerClips: sin clips.json no hay clips; valida id, origen, extensión y la lámina de despues', () => {
  assert.deepEqual(leerClips(carpeta(), ['a']), []);
  const ok = leerClips(carpeta([{ id: 'gank', origen: 'gank.mp4', despues: 'a', palabras: [' minuto dos '] }]), ['a', 'b']);
  assert.equal(ok.length, 1);
  assert.equal(ok[0].ext, 'mp4');
  assert.equal(ok[0].despues, 'a');
  assert.deepEqual(ok[0].palabras, ['minuto dos']);
  assert.ok(path.isAbsolute(ok[0].origen), 'el origen se resuelve contra la carpeta del deck');
  assert.throws(() => leerClips(carpeta({ id: 'x' }), []), /debe ser una lista/);
  assert.throws(() => leerClips(carpeta([{ id: 'a b', origen: 'x.mp4' }]), []), /id inválido/);
  assert.throws(() => leerClips(carpeta([{ id: 'a', origen: 'x.mp4' }]), ['a']), /ya existe/);
  assert.throws(() => leerClips(carpeta([{ id: 'c', origen: 'x.mp4' }, { id: 'c', origen: 'y.mp4' }]), []), /ya existe/);
  assert.throws(() => leerClips(carpeta([{ id: 'c' }]), []), /falta «origen»/);
  assert.throws(() => leerClips(carpeta([{ id: 'c', origen: 'x.gif' }]), []), /no es mp4/);
  assert.throws(() => leerClips(carpeta([{ id: 'c', origen: 'x.mp4', despues: 'nada' }]), ['a']), /no existe/);
});

test('insertarClips: cada clip va tras su lámina, en el orden de clips.json; sin lámina, al final; no se duplican', () => {
  const lam = (id) => ({ id });
  const clip = (id, despues) => ({ id, tipo: 'clip', ...(despues ? { despues } : {}) });
  const m = [lam('a'), lam('b'), lam('c')];
  const r = insertarClips(m, [clip('x', 'b'), clip('y', 'b'), clip('z'), clip('w', 'a')]);
  assert.deepEqual(r.map(l => l.id), ['a', 'w', 'b', 'x', 'y', 'c', 'z']);
  // Volver a insertar sobre un manifest que ya los trae no los duplica.
  assert.deepEqual(insertarClips(r, [clip('x', 'c')]).map(l => l.id), ['a', 'b', 'c', 'x']);
});

const hayFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
test('ponerClips: copia el clip, saca su PNG, lo mide y lo mete en el manifest tras su lámina', { skip: hayFfmpeg ? false : 'no hay ffmpeg' }, () => {
  const fuente = fs.mkdtempSync(path.join(os.tmpdir(), 'clip-fuente-'));
  const video = path.join(fuente, 'gank.mp4');
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=red:s=320x240:d=1.5:r=30', '-pix_fmt', 'yuv420p', video]);
  assert.equal(r.status, 0, String(r.stderr));
  const dir = carpeta([{ id: 'gank', origen: video, despues: 'a' }]);
  const destino = path.join(dir, 'video-out', 'laminas');
  fs.mkdirSync(destino, { recursive: true });
  fs.writeFileSync(path.join(destino, 'manifest.json'), JSON.stringify([{ id: 'a' }, { id: 'b' }]));
  const [e] = ponerClips({ dir, destino, idsLaminas: ['a', 'b'] });
  assert.deepEqual({ ...e, dur: Math.round(e.dur * 10) / 10 }, { id: 'gank', tipo: 'clip', archivo: 'gank.mp4', png: 'gank.png', dur: 1.5, ancho: 320, alto: 240, despues: 'a', palabras: [] });
  assert.ok(fs.statSync(path.join(destino, 'gank.mp4')).size > 0);
  assert.ok(fs.statSync(path.join(destino, 'gank.png')).size > 0);
  const m = JSON.parse(fs.readFileSync(path.join(destino, 'manifest.json'), 'utf8'));
  assert.deepEqual(m.map(l => l.id), ['a', 'gank', 'b']);
  // Si se quita de clips.json, sale del manifest.
  fs.writeFileSync(path.join(dir, 'clips.json'), '[]');
  ponerClips({ dir, destino, idsLaminas: ['a', 'b'] });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(destino, 'manifest.json'), 'utf8')).map(l => l.id), ['a', 'b']);
});
