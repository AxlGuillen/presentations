// Pruebas de la contraseña de la galería (middleware.ts, en la raíz).
// Correr: node --test "tools/**/*.test.mjs"   (Node 24 importa el .ts tal cual)
import { test } from 'node:test';
import assert from 'node:assert/strict';

const { default: middleware, config } = await import('../../middleware.ts');
const URL_ = 'https://ejemplo.vercel.app/';
const post = (clave, cookie = '') => new Request(URL_, { method: 'POST', body: new URLSearchParams({ clave }), headers: cookie ? { cookie } : {} });
const conClave = async (clave, fn) => { const antes = process.env.GALERIA_CLAVE; process.env.GALERIA_CLAVE = clave; try { await fn(); } finally { if (antes == null) delete process.env.GALERIA_CLAVE; else process.env.GALERIA_CLAVE = antes; } };

test('middleware: solo protege la galería, no los decks', () => {
  assert.deepEqual(config.matcher, ['/', '/index.html']);
});

test('middleware: sin sesión enseña la puerta y no la galería', () => conClave('cartelera', async () => {
  const r = await middleware(new Request(URL_));
  assert.equal(r.status, 401);
  assert.match(r.headers.get('cache-control'), /no-store/);
  assert.match(await r.text(), /name="clave"/);
}));

test('middleware: clave equivocada no entra; la correcta deja una cookie que abre la galería', () => conClave('cartelera', async () => {
  const mala = await middleware(post('otra'));
  assert.equal(mala.status, 401);
  assert.match(await mala.text(), /Esa no es la contraseña/);

  const buena = await middleware(post('cartelera'));
  assert.equal(buena.status, 303);
  assert.equal(buena.headers.get('location'), '/');
  const cookie = buena.headers.get('set-cookie');
  assert.match(cookie, /^galeria=[0-9a-f]{64}; Path=\/; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure$/);
  assert.ok(!cookie.includes('cartelera'), 'la cookie no lleva la clave en claro');

  // con la cookie, el middleware no responde: sigue al index.html estático
  const sesion = cookie.split(';')[0];
  assert.equal(await middleware(new Request(URL_, { headers: { cookie: 'otra=1; ' + sesion } })), undefined);
  // una cookie inventada no sirve
  assert.equal((await middleware(new Request(URL_, { headers: { cookie: 'galeria=' + 'a'.repeat(64) } }))).status, 401);
  // cambiar la clave cierra las sesiones viejas
  process.env.GALERIA_CLAVE = 'nueva';
  assert.equal((await middleware(new Request(URL_, { headers: { cookie: sesion } }))).status, 401);
}));

test('middleware: ?salir borra la cookie', () => conClave('cartelera', async () => {
  const r = await middleware(new Request(URL_ + '?salir'));
  assert.equal(r.status, 303);
  assert.match(r.headers.get('set-cookie'), /^galeria=; Path=\/; Max-Age=0/);
}));

test('middleware: sin GALERIA_CLAVE la galería queda cerrada', () => conClave('', async () => {
  const r = await middleware(new Request(URL_));
  assert.equal(r.status, 503);
  assert.match(await r.text(), /todavía no tiene contraseña/);
  assert.equal((await middleware(post(''))).status, 401);
  assert.equal((await middleware(new Request(URL_, { headers: { cookie: 'galeria=' } }))).status, 503);
}));
