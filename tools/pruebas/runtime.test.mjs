// El runtime deck-stage.js se copia en cada deck y todas las copias son idénticas a propósito
// (ver la skill nuevo-deck): un solo hash. Uso: node --test tools/pruebas/runtime.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { raiz } from './ayudas.mjs';

const copias = ['work', 'personal', 'creator'].flatMap((escritorio) => {
  const base = path.join(raiz, escritorio);
  return fs.existsSync(base) ? fs.readdirSync(base).map((d) => path.join(base, d, 'deck-stage.js')).filter((f) => fs.existsSync(f)) : [];
});
const md5 = (f) => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');

test('deck-stage.js: todas las copias tienen el mismo hash', () => {
  assert.ok(copias.length > 0, 'no se encontró ninguna copia');
  const porHash = new Map();
  for (const f of copias) porHash.set(md5(f), [...(porHash.get(md5(f)) || []), path.relative(raiz, f)]);
  assert.equal(porHash.size, 1, `hay ${porHash.size} versiones distintas:\n` + [...porHash].map(([h, fs_]) => `  ${h.slice(0, 8)}  ${fs_.length} copias, p. ej. ${fs_[0]}`).join('\n'));
});

test('deck-stage.js: trae el modo capa', () => {
  const src = fs.readFileSync(copias[0], 'utf8');
  for (const marca of ["CAPA_PARAMS.get('capa')", "CAPA_PARAMS.get('alfa') === '1'", 'CAPA_ORIGENES_BASE', "tl.time(Math.max(0, Math.min(t, tl.duration())), false)"]) {
    assert.ok(src.includes(marca), `falta en el runtime: ${marca}`);
  }
  // Por omisión solo ReelForge.
  assert.match(src, /CAPA_ORIGENES_BASE = \['http:\/\/localhost:5001', 'http:\/\/127\.0\.0\.1:5001'\]/);
  // Nunca se responde con '*'.
  assert.ok(!/_capa\w*\([^)]*\)[^;]*postMessage\([^)]*'\*'\)/.test(src), "el modo capa no debe postMessage a '*'");
});
