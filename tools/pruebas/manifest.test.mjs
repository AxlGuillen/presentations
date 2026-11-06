// tools/manifest.schema.json valida los manifest.json que escribe laminas.mjs.
// Uso: node --test tools/pruebas/manifest.test.mjs
//
// Los manifest.json reales viven en <deck>/video-out/laminas/, que git ignora: se validan los que haya en
// esta máquina (si no hay ninguno, esa prueba se salta) y, siempre, los fixtures versionados de ./fixtures.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import AjvModulo from 'ajv/dist/2020.js';
import { raiz } from './ayudas.mjs';

const Ajv2020 = AjvModulo.default || AjvModulo;
const esquema = JSON.parse(fs.readFileSync(path.join(raiz, 'tools', 'manifest.schema.json'), 'utf8'));
const validar = new Ajv2020({ allErrors: true, strict: true }).compile(esquema);
const errores = () => (validar.errors || []).map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ');
const leer = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const fixture = (n) => leer(path.join(import.meta.dirname, 'fixtures', n));

/** Lo que el JSON Schema no expresa: relaciones entre campos. */
function coherente(manifest) {
  const vistos = new Set();
  for (const l of manifest) {
    assert.ok(!vistos.has(l.id), `id repetido: ${l.id}`);
    vistos.add(l.id);
    assert.equal(path.parse(l.archivo).name, l.id, `${l.id}: archivo debe ser <id>.<ext>`);
    assert.equal(l.png, `${l.id}.png`, `${l.id}: png debe ser <id>.png`);
    assert.ok(l.dur >= l.dur_anim, `${l.id}: dur (${l.dur}) menor que dur_anim (${l.dur_anim})`);
  }
}

/** Todos los manifest.json reales de esta máquina. */
function reales() {
  const out = [];
  for (const esc of ['work', 'personal', 'creator']) {
    const base = path.join(raiz, esc);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      const f = path.join(base, d, 'video-out', 'laminas', 'manifest.json');
      if (fs.existsSync(f)) out.push(f);
    }
  }
  return out;
}

test('esquema: los fixtures versionados son válidos (mp4, mov, webm y la respuesta de la API)', () => {
  for (const n of ['manifest-mp4.json', 'manifest-alfa-mov.json', 'manifest-alfa-webm.json', 'manifest-api.json']) {
    const m = fixture(n);
    assert.ok(validar(m), `${n}: ${errores()}`);
    coherente(m);
  }
});

const hayReales = reales();
test('esquema: los manifest.json reales de esta máquina son válidos', { skip: hayReales.length ? false : 'no hay ningún video-out/laminas/manifest.json' }, () => {
  for (const f of hayReales) {
    const m = leer(f);
    assert.ok(validar(m), `${path.relative(raiz, f)}: ${errores()}`);
    coherente(m);
  }
});

test('esquema: rechaza lo que no debe', () => {
  const base = fixture('manifest-mp4.json');
  const malo = (nombre, cambio) => {
    const m = structuredClone(base);
    cambio(m[0]);
    assert.ok(!validar(m), `${nombre}: debería ser inválido`);
  };
  malo('falta id', (l) => { delete l.id; });
  malo('falta caja', (l) => { delete l.caja; });
  malo('campo desconocido', (l) => { l.extra = 1; });
  malo('id con barra', (l) => { l.id = 'a/b'; });
  malo('archivo con otra extensión', (l) => { l.archivo = 'lb-portada.gif'; });
  malo('alfa true con mp4', (l) => { l.alfa = true; });
  malo('alfa false con mov', (l) => { l.archivo = 'lb-portada.mov'; });
  malo('png que no es png', (l) => { l.png = 'lb-portada.jpg'; });
  malo('dur_anim negativo', (l) => { l.dur_anim = -1; });
  malo('caja.x desconocido', (l) => { l.caja.x = 'middle'; });
  malo('caja.width como texto', (l) => { l.caja.width = '1080'; });
  malo('caja con campo extra', (l) => { l.caja.top = 3; });
  malo('palabras que no es lista', (l) => { l.palabras = 'kda'; });
  malo('palabra vacía', (l) => { l.palabras = ['']; });
  assert.ok(!validar({}), 'el manifest es una lista, no un objeto');
});

test('coherente(): detecta ids repetidos y archivos que no son <id>', () => {
  const base = fixture('manifest-mp4.json');
  assert.throws(() => coherente([base[0], base[0]]), /repetido/);
  assert.throws(() => coherente([{ ...base[0], archivo: 'otro.mp4' }]), /archivo debe ser/);
  assert.throws(() => coherente([{ ...base[0], dur: 1, dur_anim: 2 }]), /menor que dur_anim/);
});
