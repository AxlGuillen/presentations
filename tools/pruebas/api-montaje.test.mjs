// API local del estudio de montaje (tools/api-montaje.mjs). Uso: node --test tools/pruebas/api-montaje.test.mjs
//
// La lógica (rutas, validación, seguridad, caché de renders) se prueba con un deck de mentira en una carpeta
// temporal y un renderizador falso. Aparte, con Chrome y ffmpeg de verdad (se saltan si no están):
//   · la duración de las timelines de leblanc contra la que midió cuadros.mjs,
//   · un render real de un deck mínimo: segunda vez no rehace nada, y cambiar una lámina rehace solo esa.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import AjvModulo from 'ajv/dist/2020.js';
import { crearApi, medirConChrome, ORIGENES_REELFORGE } from '../api-montaje.mjs';
import { CHROME, raiz } from './ayudas.mjs';

const Ajv2020 = AjvModulo.default || AjvModulo;
const validarManifest = new Ajv2020({ allErrors: true, strict: true }).compile(JSON.parse(fs.readFileSync(path.join(raiz, 'tools', 'manifest.schema.json'), 'utf8')));
const REELFORGE = ORIGENES_REELFORGE[0];
const hayFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;

// ── Un entorno de mentira: carpeta temporal + API + servidor HTTP + renderizador falso ──

const deckHtml = ({ t1 = 'Uno', t2 = 'Dos', t3 = 'Tres', css = '' } = {}) => `<!doctype html><html><head><meta charset="utf-8"><title>Demo &amp; Co</title>
<style>body{margin:0}${css}</style></head><body>
<deck-stage width="1080" height="1920">
<section data-lamina="d-uno" data-palabras="uno, 1"><img src="assets/a.png"><h1>${t1}</h1></section>
<section data-lamina="d-dos"><div style="background:url('assets/b.png')">${t2}</div></section>
<section data-lamina="d-tres" data-palabras="tres"><p>${t3}</p></section>
<section><p>esta no es una lámina (sin data-lamina)</p></section>
</deck-stage><script src="deck-stage.js"></script></body></html>`;

async function entorno(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-montaje-'));
  const w = (rel, contenido) => { const f = path.join(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, contenido); };
  w('creator/demo/index.html', deckHtml());
  w('creator/demo/deck-stage.js', '// runtime de mentira');
  w('creator/demo/assets/a.png', 'aaaa');
  w('creator/demo/assets/b.png', 'bbbb');
  w('work/vacio/index.html', '<!doctype html><title>Sin láminas</title><deck-stage width="1080" height="1920"><section>x</section></deck-stage>');
  w('personal/otro/index.html', '<!doctype html><title>Otro</title><deck-stage width="1080" height="1920"><section data-lamina="o-1">x</section></deck-stage>');
  w('tools/cuadros.mjs', '// v1');
  w('tools/laminas.mjs', '// v1');
  w('tools/laminas-lib.mjs', '// v1');

  const e = {
    dir, medidas: 0, llamadas: [], falla: false, puerta: null,
    editar: (rel, fn) => { const f = path.join(dir, rel); fs.writeFileSync(f, fn(fs.readFileSync(f, 'utf8'))); },
    deck: (opts) => fs.writeFileSync(path.join(dir, 'creator/demo/index.html'), deckHtml(opts)),
  };
  // El renderizador falso hace lo que laminas.mjs --solo: escribe los archivos y MEZCLA el manifest.
  const ejecutarRender = async ({ rel, formato, fps, ids, alLista }) => {
    e.llamadas.push({ rel, formato, fps, ids: [...ids] });
    if (e.puerta) await e.puerta;
    if (e.falla) throw new Error('ffmpeg salió con 1');
    const salida = path.join(dir, rel, 'video-out', 'laminas');
    fs.mkdirSync(salida, { recursive: true });
    let manifest = [];
    try { manifest = JSON.parse(fs.readFileSync(path.join(salida, 'manifest.json'), 'utf8')); } catch { /* nuevo */ }
    for (const id of ids) {
      fs.writeFileSync(path.join(salida, `${id}.${formato}`), `clip ${id} ${fps} ${Math.random()}`);
      fs.writeFileSync(path.join(salida, `${id}.png`), 'png');
      manifest = manifest.filter(l => l.id !== id).concat([{ id, archivo: `${id}.${formato}`, png: `${id}.png`, dur_anim: 1, dur: 2, alfa: true, caja: { width: 1080, x: 'center', bottom: 275 }, palabras: [] }]);
      alLista(id);
    }
    fs.writeFileSync(path.join(salida, 'manifest.json'), JSON.stringify(manifest));
  };
  const medirDuraciones = async ({ ids }) => { e.medidas++; return Object.fromEntries(ids.map((id, i) => [id, [2.5, 0, 1.25][i] ?? 0])); };
  const api = crearApi({ raiz: dir, medirDuraciones, ejecutarRender });
  const servidor = http.createServer((req, res) => {
    api.manejar(req, res, new URL(req.url, 'http://localhost')).then((hecho) => { if (!hecho) { res.writeHead(404); res.end(); } });
  });
  await new Promise(r => servidor.listen(0, '127.0.0.1', r));
  e.base = `http://127.0.0.1:${servidor.address().port}`;
  e.api = api;
  t.after(() => { servidor.closeAllConnections(); servidor.close(); fs.rmSync(dir, { recursive: true, force: true }); });

  e.pedir = async (ruta, { metodo = 'GET', cuerpo, cabeceras = {} } = {}) => {
    const r = await fetch(e.base + ruta, { method: metodo, headers: cabeceras, body: cuerpo });
    const texto = await r.text();
    let json = null;
    try { json = JSON.parse(texto); } catch { /* no es JSON */ }
    return { status: r.status, headers: r.headers, json, texto };
  };
  e.render = async (params, cabeceras = {}) => {
    const r = await e.pedir('/api/render', { metodo: 'POST', cuerpo: JSON.stringify({ desk: 'creator', deck: 'demo', ...params }), cabeceras: { 'Content-Type': 'application/json', ...cabeceras } });
    return r;
  };
  e.esperar = async (jobId) => {
    for (let n = 0; n < 400; n++) {
      const { json } = await e.pedir(`/api/render/${jobId}`);
      if (json.estado === 'listo' || json.estado === 'error') return json;
      await new Promise(r => setTimeout(r, 15));
    }
    throw new Error('el trabajo no terminó');
  };
  e.correr = async (params) => { const r = await e.render(params); assert.equal(r.status, 202, r.texto); return e.esperar(r.json.job_id); };
  return e;
}

const estados = (job) => Object.fromEntries(job.laminas.map(l => [l.id, l.estado]));

// ── GET /api/decks ──

test('GET /api/decks: solo los decks con data-lamina, con título, cuántas láminas y su url', async (t) => {
  const e = await entorno(t);
  const { status, json } = await e.pedir('/api/decks');
  assert.equal(status, 200);
  assert.deepEqual(json, [
    { desk: 'creator', deck: 'demo', titulo: 'Demo & Co', laminas: 3, url: '/creator/demo/' },
    { desk: 'personal', deck: 'otro', titulo: 'Otro', laminas: 1, url: '/personal/otro/' },
  ]);
  assert.deepEqual((await e.pedir('/api/decks?desk=creator')).json.map(d => d.deck), ['demo']);
  assert.deepEqual((await e.pedir('/api/decks?desk=work')).json, []);
  assert.equal((await e.pedir('/api/decks?desk=nada')).status, 400);
});

// ── GET /api/decks/<desk>/<deck>/laminas ──

test('GET laminas: lo mismo que manifest.json (+ ancho y alto) sin renderizar, y cacheado por hash del index.html', async (t) => {
  const e = await entorno(t);
  const { status, json } = await e.pedir('/api/decks/creator/demo/laminas');
  assert.equal(status, 200);
  assert.ok(validarManifest(json), JSON.stringify(validarManifest.errors));
  assert.deepEqual(json.map(l => l.id), ['d-uno', 'd-dos', 'd-tres']);
  assert.deepEqual(json[0], { id: 'd-uno', archivo: 'd-uno.mov', png: 'd-uno.png', dur_anim: 2.5, dur: 3.5, alfa: true,
    caja: { width: 1080, x: 'center', bottom: 275 }, palabras: ['uno', '1'], ancho: 1080, alto: 1920 });
  assert.equal(json[1].dur_anim, 0, 'una lámina sin timeline mide 0');
  assert.equal(json[1].dur, 1);
  assert.deepEqual(json[2].palabras, ['tres']);
  assert.equal(e.llamadas.length, 0, 'no renderiza nada');
  assert.equal(e.medidas, 1);

  await e.pedir('/api/decks/creator/demo/laminas');
  assert.equal(e.medidas, 1, 'sin cambios en el index.html no vuelve a medir');
  assert.ok(fs.existsSync(path.join(e.dir, 'creator/demo/video-out/.laminas-meta.json')));

  e.deck({ t1: 'Cambio' });
  await e.pedir('/api/decks/creator/demo/laminas');
  assert.equal(e.medidas, 2, 'si cambia el index.html, vuelve a medir');

  e.editar('creator/demo/deck-stage.js', () => '// otro runtime');      // el runtime lo carga un <script src>: también cuenta
  await e.pedir('/api/decks/creator/demo/laminas');
  assert.equal(e.medidas, 3, 'si cambia un script que carga la página, vuelve a medir');

  assert.equal((await e.pedir('/api/decks/creator/demo/laminas?alfa=webm')).json[0].archivo, 'd-uno.webm');
  assert.equal((await e.pedir('/api/decks/creator/demo/laminas?alfa=gif')).status, 400);
});

test('GET laminas: dos pedidos a la vez comparten una sola medición', async (t) => {
  const e = await entorno(t);
  const [a, b] = await Promise.all([e.pedir('/api/decks/creator/demo/laminas'), e.pedir('/api/decks/creator/demo/laminas')]);
  assert.equal(a.status, 200);
  assert.deepEqual(a.json, b.json);
  assert.equal(e.medidas, 1);
});

test('GET laminas: errores claros (deck inexistente, sin láminas, nombres con ../)', async (t) => {
  const e = await entorno(t);
  assert.equal((await e.pedir('/api/decks/creator/no-existe/laminas')).status, 404);
  const sin = await e.pedir('/api/decks/work/vacio/laminas');
  assert.equal(sin.status, 404);
  assert.match(sin.json.error, /no tiene láminas/);
  assert.equal((await e.pedir('/api/decks/creator/..%2F..%2Fetc/laminas')).status, 400);
  assert.equal((await e.pedir('/api/decks/..%2Fcreator/demo/laminas')).status, 400);
  assert.equal((await e.pedir('/api/decks/otro-escritorio/demo/laminas')).status, 400);
  assert.equal((await e.pedir('/api/decks/creator/%E0%A4%A/laminas')).status, 400, 'un % mal formado no es un 500');
});

// ── POST /api/render ──

test('render: una lámina sin cambios no se vuelve a renderizar; solo lo que cambió', async (t) => {
  const e = await entorno(t);
  const TODAS = ['d-uno', 'd-dos', 'd-tres'];

  // 1. La primera vez renderiza las tres.
  const j1 = await e.correr({});
  assert.equal(j1.estado, 'listo');
  assert.deepEqual(estados(j1), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
  assert.deepEqual(e.llamadas.map(c => c.ids), [TODAS]);
  assert.equal(j1.carpeta, path.join(e.dir, 'creator/demo/video-out/laminas'));
  assert.equal(j1.manifest, path.join(e.dir, 'creator/demo/video-out/laminas/manifest.json'));
  assert.equal(j1.anim, path.join(e.dir, 'creator/demo/video-out/anim-alfa'));
  assert.equal(j1.progreso, 100);
  assert.ok(fs.existsSync(j1.manifest));

  // 2. Idéntico: no renderiza nada.
  const j2 = await e.correr({});
  assert.deepEqual(estados(j2), { 'd-uno': 'cacheada', 'd-dos': 'cacheada', 'd-tres': 'cacheada' });
  assert.equal(e.llamadas.length, 1, 'no se llamó al renderizador');
  assert.equal(j2.progreso, 100);
  assert.equal(j2.manifest, j1.manifest);

  // 3. Cambia el texto de UNA lámina → solo esa.
  e.deck({ t2: 'Dos cambiado' });
  const j3 = await e.correr({});
  assert.deepEqual(estados(j3), { 'd-uno': 'cacheada', 'd-dos': 'lista', 'd-tres': 'cacheada' });
  assert.deepEqual(e.llamadas.at(-1).ids, ['d-dos']);

  // 4. Cambia el contenido de una imagen que solo usa una lámina → solo esa (por contenido, no por nombre).
  fs.writeFileSync(path.join(e.dir, 'creator/demo/assets/a.png'), 'a distinta y más larga');
  const j4 = await e.correr({});
  assert.deepEqual(estados(j4), { 'd-uno': 'lista', 'd-dos': 'cacheada', 'd-tres': 'cacheada' });
  assert.deepEqual(e.llamadas.at(-1).ids, ['d-uno']);
  // …y tocar un archivo sin cambiarle el contenido no cuenta.
  const futuro = new Date(Date.now() + 60000);
  fs.utimesSync(path.join(e.dir, 'creator/demo/assets/b.png'), futuro, futuro);
  assert.deepEqual(estados(await e.correr({})), { 'd-uno': 'cacheada', 'd-dos': 'cacheada', 'd-tres': 'cacheada' });

  // 5. Algo compartido (estilos, scripts) invalida todas; es lo conservador y lo correcto.
  e.deck({ t2: 'Dos cambiado', css: 'h1{color:red}' });
  assert.deepEqual(estados(await e.correr({})), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
  assert.deepEqual(e.llamadas.at(-1).ids, TODAS);
  e.editar('creator/demo/deck-stage.js', () => '// runtime nuevo');
  assert.deepEqual(estados(await e.correr({})), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' }, 'el runtime que carga la página es parte de la clave');

  // 6. Cambiar el renderizador (cuadros.mjs / laminas.mjs) lo invalida todo.
  e.editar('tools/laminas.mjs', () => '// v2');
  assert.deepEqual(estados(await e.correr({})), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });

  // 7. Otros fps: todas; y volver a los de antes también (el archivo que hay es el último que se renderizó).
  const antes = e.llamadas.length;
  assert.deepEqual(estados(await e.correr({ fps: 60 })), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
  assert.equal(e.llamadas.at(-1).fps, 60);
  assert.deepEqual(estados(await e.correr({ fps: 60 })), { 'd-uno': 'cacheada', 'd-dos': 'cacheada', 'd-tres': 'cacheada' });
  assert.deepEqual(estados(await e.correr({ fps: 30 })), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
  assert.equal(e.llamadas.length, antes + 2);

  // 8. Otro formato (webm) se renderiza aparte. El manifest.json es uno solo, así que al volver a mov hay que rehacerlo.
  assert.deepEqual(estados(await e.correr({ alfa: 'webm' })), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
  assert.equal(e.llamadas.at(-1).formato, 'webm');
  assert.deepEqual(estados(await e.correr({ alfa: 'mov' })), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' },
    'el manifest.json es uno solo: tras webm ya no lista los .mov, así que hay que volver a escribirlo');

  // 9. Si falta un archivo de salida, esa lámina se rehace.
  fs.rmSync(path.join(e.dir, 'creator/demo/video-out/laminas/d-tres.png'));
  assert.deepEqual(estados(await e.correr({ alfa: 'mov' })), { 'd-uno': 'cacheada', 'd-dos': 'cacheada', 'd-tres': 'lista' });
  assert.deepEqual(e.llamadas.at(-1).ids, ['d-tres']);
});

test('render: un subconjunto de láminas; las demás ni se miran', async (t) => {
  const e = await entorno(t);
  const j = await e.correr({ laminas: ['d-tres', 'd-uno'] });
  assert.deepEqual(j.laminas.map(l => l.id), ['d-uno', 'd-tres'], 'en el orden del deck');
  assert.deepEqual(e.llamadas[0].ids, ['d-uno', 'd-tres']);
  const todas = await e.correr({});
  assert.deepEqual(estados(todas), { 'd-uno': 'cacheada', 'd-dos': 'lista', 'd-tres': 'cacheada' });
  assert.deepEqual(e.llamadas.at(-1).ids, ['d-dos']);
});

test('render: si el renderizador falla, el trabajo termina en error y no se da nada por cacheado', async (t) => {
  const e = await entorno(t);
  e.falla = true;
  const malo = await e.correr({});
  assert.equal(malo.estado, 'error');
  assert.match(malo.error, /ffmpeg salió con 1/);
  assert.ok(Object.values(estados(malo)).every(s => s === 'error'));
  assert.ok(!('carpeta' in malo));
  e.falla = false;
  const bueno = await e.correr({});
  assert.equal(bueno.estado, 'listo');
  assert.deepEqual(estados(bueno), { 'd-uno': 'lista', 'd-dos': 'lista', 'd-tres': 'lista' });
});

test('render: un solo render a la vez, en orden; un pedido idéntico a uno en curso es el mismo trabajo', async (t) => {
  const e = await entorno(t);
  let soltar;
  e.puerta = new Promise(r => { soltar = r; });
  const a = (await e.render({})).json.job_id;
  const a2 = (await e.render({})).json.job_id;
  const b = (await e.render({ laminas: ['d-uno'] })).json.job_id;
  assert.equal(a2, a, 'mismo pedido, mismo trabajo');
  assert.notEqual(b, a);
  await new Promise(r => setTimeout(r, 50));
  assert.equal((await e.pedir(`/api/render/${a}`)).json.estado, 'renderizando');
  assert.equal((await e.pedir(`/api/render/${b}`)).json.estado, 'en_cola', 'el segundo espera su turno');
  assert.equal(e.llamadas.length, 1);
  soltar();
  assert.equal((await e.esperar(a)).estado, 'listo');
  const jb = await e.esperar(b);
  assert.equal(jb.estado, 'listo');
  assert.deepEqual(estados(jb), { 'd-uno': 'cacheada' }, 'lo que el primero ya renderizó no se rehace');
  assert.equal(e.llamadas.length, 1);
});

test('render: valida el pedido', async (t) => {
  const e = await entorno(t);
  const malo = async (params, estado, texto) => {
    const r = await e.render(params);
    assert.equal(r.status, estado, JSON.stringify(params));
    if (texto) assert.match(r.json.error, texto);
  };
  await malo({ desk: 'nada' }, 400, /Escritorio desconocido/);
  await malo({ desk: 'creator', deck: '../work/vacio' }, 400, /inválido/);
  await malo({ deck: 'no-existe' }, 404, /No existe el deck/);
  await malo({ desk: 'work', deck: 'vacio' }, 404, /no tiene láminas/);
  await malo({ alfa: 'gif' }, 400, /mov o webm/);
  await malo({ alfa: true }, 400);
  await malo({ fps: 0 }, 400, /entre 1 y 60/);
  await malo({ fps: 61 }, 400);
  await malo({ fps: 29.5 }, 400);
  await malo({ fps: '30' }, 400);
  await malo({ laminas: [] }, 400, /lista de ids/);
  await malo({ laminas: 'd-uno' }, 400);
  await malo({ laminas: [1] }, 400);
  await malo({ laminas: ['d-uno', 'fantasma'] }, 400, /fantasma/);
  await malo({ desk: 5, deck: 'demo' }, 400, /Faltan desk y deck/);
  for (const c of ['[]', 'null', '"x"', '3']) {
    const r = await e.pedir('/api/render', { metodo: 'POST', cuerpo: c, cabeceras: { 'Content-Type': 'application/json' } });
    assert.equal(r.status, 400, c);
  }
  assert.equal(e.llamadas.length, 0);
  assert.equal(e.api.trabajos.size, 0, 'un pedido inválido no crea ningún trabajo');
  assert.equal((await e.pedir('/api/render/no-existe')).status, 404);
});

// ── Seguridad y CORS ──

test('CORS: solo los orígenes de ReelForge, también en los errores; el preflight responde', async (t) => {
  const e = await entorno(t);
  for (const origen of ORIGENES_REELFORGE) {
    const ok = await e.pedir('/api/decks', { cabeceras: { Origin: origen } });
    assert.equal(ok.status, 200);
    assert.equal(ok.headers.get('access-control-allow-origin'), origen);
    assert.match(ok.headers.get('vary'), /Origin/);
    const err = await e.pedir('/api/render/nada', { cabeceras: { Origin: origen } });
    assert.equal(err.status, 404);
    assert.equal(err.headers.get('access-control-allow-origin'), origen, 'los errores también llevan CORS, o ReelForge no podría leerlos');
    const pre = await e.pedir('/api/render', { metodo: 'OPTIONS', cabeceras: { Origin: origen, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } });
    assert.equal(pre.status, 204);
    assert.equal(pre.headers.get('access-control-allow-origin'), origen);
    assert.match(pre.headers.get('access-control-allow-methods'), /POST/);
    assert.match(pre.headers.get('access-control-allow-headers'), /Content-Type/i);
  }
  // Otro origen: el navegador no puede leer la respuesta (sin Allow-Origin) y el preflight se niega.
  for (const ajeno of ['http://evil.example', 'http://localhost:3125', 'http://localhost:5002', 'null']) {
    const r = await e.pedir('/api/decks', { cabeceras: { Origin: ajeno } });
    assert.equal(r.headers.get('access-control-allow-origin'), null, ajeno);
    const pre = await e.pedir('/api/render', { metodo: 'OPTIONS', cabeceras: { Origin: ajeno, 'Access-Control-Request-Method': 'POST' } });
    assert.equal(pre.status, 403, ajeno);
    assert.equal(pre.headers.get('access-control-allow-origin'), null);
  }
});

test('seguridad: un POST desde otra página, sin JSON o demasiado grande, no hace nada', async (t) => {
  const e = await entorno(t);
  const cuerpo = JSON.stringify({ desk: 'creator', deck: 'demo' });
  // Una página cualquiera puede mandar un POST «simple» sin preflight: se rechaza por su Origin.
  const ajeno = await e.pedir('/api/render', { metodo: 'POST', cuerpo, cabeceras: { 'Content-Type': 'application/json', Origin: 'http://evil.example' } });
  assert.equal(ajeno.status, 403);
  const simple = await e.pedir('/api/render', { metodo: 'POST', cuerpo, cabeceras: { 'Content-Type': 'text/plain', Origin: 'http://evil.example' } });
  assert.equal(simple.status, 403);
  // Sin JSON declarado: 415 (un formulario HTML no puede mandar application/json).
  assert.equal((await e.pedir('/api/render', { metodo: 'POST', cuerpo, cabeceras: { 'Content-Type': 'application/x-www-form-urlencoded' } })).status, 415);
  assert.equal((await e.pedir('/api/render', { metodo: 'POST', cuerpo })).status, 415);
  assert.equal((await e.pedir('/api/render', { metodo: 'POST', cuerpo: '{no es json', cabeceras: { 'Content-Type': 'application/json' } })).status, 400);
  assert.equal((await e.pedir('/api/render', { metodo: 'POST', cuerpo: JSON.stringify({ x: 'a'.repeat(70 * 1024) }), cabeceras: { 'Content-Type': 'application/json' } })).status, 413);
  assert.equal(e.api.trabajos.size, 0);
  assert.equal(e.llamadas.length, 0);
  // Sin Origin (curl, scripts) sí se atiende.
  assert.equal((await e.pedir('/api/render', { metodo: 'POST', cuerpo, cabeceras: { 'Content-Type': 'application/json' } })).status, 202);
});

test('seguridad: un Host que no es localhost (DNS rebinding) se rechaza', async (t) => {
  const e = await entorno(t);
  const pedirConHost = (host) => new Promise((ok, mal) => {
    const u = new URL(e.base);
    http.get({ host: u.hostname, port: u.port, path: '/api/decks', headers: { Host: host } }, (res) => { res.resume(); res.on('end', () => ok(res.statusCode)); }).on('error', mal);
  });
  assert.equal(await pedirConHost('evil.example:3125'), 403);
  assert.equal(await pedirConHost('evil.example'), 403);
  assert.equal(await pedirConHost('localhost:3125'), 200);
  assert.equal(await pedirConHost('127.0.0.1'), 200);
  assert.equal(await pedirConHost('[::1]:3125'), 200);
});

test('rutas: lo que no existe es 404 en JSON, el método equivocado 405, y nada de /api/ cae al sitio estático', async (t) => {
  const e = await entorno(t);
  for (const r of ['/api/', '/api/nada', '/api/decks/creator', '/api/decks/creator/demo', '/api/render/a/b']) {
    const res = await e.pedir(r);
    assert.equal(res.status, 404, r);
    assert.ok(res.json && res.json.error, `${r}: respuesta en JSON`);
  }
  assert.equal((await e.pedir('/api/decks', { metodo: 'POST', cuerpo: '{}', cabeceras: { 'Content-Type': 'application/json' } })).status, 405);
  assert.equal((await e.pedir('/api/render', { metodo: 'GET' })).status, 405);
  assert.equal((await e.pedir('/api/render/x', { metodo: 'POST', cuerpo: '{}', cabeceras: { 'Content-Type': 'application/json' } })).status, 405);
  assert.equal((await e.pedir('/no-es-api')).status, 404);       // el servidor de la prueba responde 404 vacío: la API no lo reclama
});

// ── Con el servidor real: sin contraseña, con los redirects y el middleware intactos ──

test('servidor-local.mjs: /api/* responde sin la contraseña de la galería y sin romper lo demás', { timeout: 60000 }, async (t) => {
  const libre = await new Promise((ok) => { const s = http.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); });
  const hijo = spawn(process.execPath, [path.join(raiz, 'tools', 'servidor-local.mjs'), String(libre)], {
    cwd: raiz, env: { ...process.env, GALERIA_CLAVE: 'clave-de-prueba' }, stdio: 'ignore' });
  t.after(() => hijo.kill());
  const base = `http://127.0.0.1:${libre}`;
  for (let n = 0; n < 100; n++) { try { await fetch(base + '/api/decks'); break; } catch { await new Promise(r => setTimeout(r, 100)); } }

  const decks = await fetch(base + '/api/decks', { headers: { Origin: REELFORGE } });
  assert.equal(decks.status, 200, 'sin cookie ni clave');
  assert.match(decks.headers.get('content-type'), /application\/json/);
  assert.equal(decks.headers.get('access-control-allow-origin'), REELFORGE);
  const lista = await decks.json();
  assert.ok(lista.some(d => d.desk === 'creator' && d.deck === 'leblanc') || lista.length > 0, 'lista los decks reales con data-lamina');
  assert.ok(lista.every(d => d.laminas > 0));
  // La galería sigue pidiendo contraseña: el middleware no se tocó.
  const galeria = await fetch(base + '/', { redirect: 'manual' });
  assert.equal(galeria.status, 401);
  // Los decks siguen abiertos y los redirects de vercel.json siguen aplicándose.
  assert.equal((await fetch(base + '/creator/leblanc/')).status, 200);
  const redir = await fetch(base + '/seating3dmap/', { redirect: 'manual' });
  assert.equal(redir.status, 308);
  assert.match(redir.headers.get('location'), /^\/work\/seating3dmap\//);
  // Un POST desde otra página no pasa.
  const csrf = await fetch(base + '/api/render', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://evil.example' }, body: '{}' });
  assert.equal(csrf.status, 403);
});

// ── Con Chrome de verdad ──

const hayLeblanc = fs.existsSync(path.join(raiz, 'creator/leblanc/index.html'));
test('medirConChrome: la duración de las timelines coincide con la que midió cuadros.mjs (manifest de leblanc)', { skip: !CHROME ? 'no hay Chrome' : !hayLeblanc ? 'no hay creator/leblanc' : false, timeout: 120000 }, async () => {
  const html = fs.readFileSync(path.join(raiz, 'creator/leblanc/index.html'), 'utf8');
  const ids = [...html.matchAll(/data-lamina="([^"]+)"/g)].map(m => m[1]);
  const dur = await medirConChrome({ raiz, rel: 'creator/leblanc', ids });
  assert.deepEqual(Object.keys(dur), ids);
  assert.ok(dur['lb-portada'] > 0, 'lb-portada tiene timeline');
  const manifest = path.join(raiz, 'creator/leblanc/video-out/laminas/manifest.json');
  if (!fs.existsSync(manifest)) return;                    // video-out está ignorado: sin render previo no hay con qué comparar
  for (const l of JSON.parse(fs.readFileSync(manifest, 'utf8'))) {
    assert.ok(Math.abs(+dur[l.id].toFixed(3) - l.dur_anim) <= 0.001, `${l.id}: Chrome midió ${dur[l.id]} y cuadros.mjs ${l.dur_anim}`);
  }
});

// ── Un render real, de punta a punta: Chrome + ffmpeg + --solo ──

test('render real: un deck mínimo; la segunda vez no rehace nada y cambiar una lámina rehace solo esa (--solo)', { skip: !CHROME ? 'no hay Chrome' : !hayFfmpeg ? 'no hay ffmpeg' : false, timeout: 300000 }, async (t) => {
  const kit = createRequire(import.meta.url)('../kit.cjs');
  const salida = path.join(raiz, 'tools', 'pruebas', 'salida');
  const dir = path.join(salida, 'api-render');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(raiz, 'creator/leblanc/deck-stage.js'), path.join(dir, 'deck-stage.js'));
  const html = (texto2) => `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Render real</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#000}</style></head>
<body><deck-stage width="1080" height="1920">
<section data-lamina="r-uno" data-label="r-uno" style="background:#123;position:relative"><div data-caja style="position:absolute;left:100px;top:500px;width:200px;height:200px;background:#fff"></div></section>
<section data-lamina="r-dos" data-label="r-dos" style="background:#321;position:relative"><div data-caja style="position:absolute;left:100px;top:500px;width:200px;height:200px;background:#0f0"></div><p>${texto2}</p></section>
</deck-stage>
${kit.gsap(dir)}
${kit.animador()}
<script>
['r-uno', 'r-dos'].forEach(function (n) {
  animar(n, function (tl, s) { tl.fromTo(s.querySelector('[data-caja]'), { x: 0 }, { x: 600, duration: 0.5, ease: 'none' }, 0.1); });
});
</script></body></html>`;
  const escribir = (t2) => fs.writeFileSync(path.join(dir, 'index.html'), html(t2));
  escribir('uno');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const api = crearApi({ raiz, escritorios: { prueba: 'tools/pruebas/salida' } });
  const servidor = http.createServer((req, res) => { api.manejar(req, res, new URL(req.url, 'http://localhost')); });
  await new Promise(r => servidor.listen(0, '127.0.0.1', r));
  t.after(() => { servidor.closeAllConnections(); servidor.close(); });
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const pedir = async (ruta, opciones) => (await fetch(base + ruta, opciones)).json();
  const correr = async (params = {}) => {
    const { job_id } = await pedir('/api/render', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ desk: 'prueba', deck: 'api-render', alfa: 'mov', fps: 10, ...params }) });
    for (let n = 0; n < 1200; n++) {
      const j = await pedir(`/api/render/${job_id}`);
      if (j.estado === 'listo' || j.estado === 'error') return j;
      await new Promise(r => setTimeout(r, 250));
    }
    throw new Error('el render no terminó');
  };
  const salidaLam = path.join(dir, 'video-out', 'laminas');
  const mtime = (f) => fs.statSync(path.join(salidaLam, f)).mtimeMs;

  // La API de láminas ve el deck sin renderizar y lo mide con Chrome.
  const sinRender = await pedir('/api/decks/prueba/api-render/laminas?alfa=mov');
  assert.ok(validarManifest(sinRender), JSON.stringify(validarManifest.errors));
  assert.deepEqual(sinRender.map(l => [l.id, l.dur_anim]), [['r-uno', 0.6], ['r-dos', 0.6]]);
  assert.ok(!fs.existsSync(salidaLam), 'medir no renderiza');

  const j1 = await correr();
  assert.equal(j1.estado, 'listo', j1.error);
  assert.deepEqual(estados(j1), { 'r-uno': 'lista', 'r-dos': 'lista' });
  const manifest1 = JSON.parse(fs.readFileSync(j1.manifest, 'utf8'));
  assert.ok(validarManifest(manifest1), JSON.stringify(validarManifest.errors));
  assert.deepEqual(manifest1.map(l => [l.id, l.archivo, l.alfa, l.dur_anim]), [['r-uno', 'r-uno.mov', true, 0.6], ['r-dos', 'r-dos.mov', true, 0.6]]);
  for (const f of ['r-uno.mov', 'r-uno.png', 'r-dos.mov', 'r-dos.png']) assert.ok(fs.statSync(path.join(salidaLam, f)).size > 0, f);
  const antes = { uno: mtime('r-uno.mov'), dos: mtime('r-dos.mov') };

  // Sin cambios: no rehace nada.
  await new Promise(r => setTimeout(r, 30));
  const j2 = await correr();
  assert.deepEqual(estados(j2), { 'r-uno': 'cacheada', 'r-dos': 'cacheada' });
  assert.equal(mtime('r-uno.mov'), antes.uno);
  assert.equal(mtime('r-dos.mov'), antes.dos);

  // Cambia solo la lámina 2: se rehace solo ella, la 1 queda como estaba y el manifest conserva las dos.
  escribir('dos cambiado');
  const j3 = await correr();
  assert.deepEqual(estados(j3), { 'r-uno': 'cacheada', 'r-dos': 'lista' });
  assert.equal(mtime('r-uno.mov'), antes.uno, 'la lámina sin cambios no se tocó');
  assert.ok(mtime('r-dos.mov') > antes.dos, 'la que cambió se rehízo');
  const manifest3 = JSON.parse(fs.readFileSync(j3.manifest, 'utf8'));
  assert.deepEqual(manifest3.map(l => l.id), ['r-uno', 'r-dos'], 'el manifest.json se mezcla, no se pisa');
  const anim = JSON.parse(fs.readFileSync(path.join(dir, 'video-out', 'anim-alfa', 'anim.json'), 'utf8'));
  assert.deepEqual(anim.clips.map(c => c.slide), [1, 2], 'anim.json conserva la lámina que no se rehízo');

  // En webm el recorte del panel conserva la transparencia: el decodificador VP9 propio de
  // ffmpeg la descartaba y lo transparente salía negro y opaco (visto en Ambessa, 6/nov).
  const j4 = await correr({ alfa: 'webm' });
  assert.equal(j4.estado, 'listo', j4.error);
  const alfaEn = (args) => {
    const r = spawnSync('ffmpeg', ['-v', 'error', ...args, '-vf', 'format=rgba,crop=1:1:20:20', '-frames:v', '1', '-f', 'rawvideo', '-']);
    assert.equal(r.stdout.length, 4, `ffmpeg no devolvió el píxel: ${r.stderr}`);
    return r.stdout[3];
  };
  assert.equal(alfaEn(['-c:v', 'libvpx-vp9', '-i', path.join(salidaLam, 'r-uno.webm')]), 0, 'el clip webm recortado conserva el alfa');
  assert.equal(alfaEn(['-i', path.join(salidaLam, 'r-uno.png')]), 0, 'el PNG final también');
});
