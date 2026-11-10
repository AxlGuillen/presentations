// Los decks de banda con laminas.mjs, de punta a punta: salen opacos en mp4 (H.264, yuv420p) con alfa: false
// aunque se pida --alfa, y con --banda=arriba el riel ([data-riel]) sale invertido y todo va a laminas-arriba/.
// Uso: node --test tools/pruebas/banda.test.mjs   (se salta si no hay Chrome o ffmpeg)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import AjvModulo from 'ajv/dist/2020.js';
import { CHROME, raiz } from './ayudas.mjs';

const Ajv2020 = AjvModulo.default || AjvModulo;
const validarManifest = new Ajv2020({ allErrors: true, strict: true }).compile(JSON.parse(fs.readFileSync(path.join(raiz, 'tools', 'manifest.schema.json'), 'utf8')));
const hayFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;

/** El color de un píxel de un video o PNG (r, g, b, a). */
function pixel(archivo, x, y, { ultimo = false } = {}) {
  const r = spawnSync('ffmpeg', ['-v', 'error', ...(ultimo ? ['-sseof', '-0.1'] : []), '-i', archivo, '-vf', `format=rgba,crop=1:1:${x}:${y}`, '-frames:v', '1', '-f', 'rawvideo', '-']);
  assert.equal(r.stdout.length, 4, `ffmpeg no devolvió el píxel de ${archivo}: ${r.stderr}`);
  return [...r.stdout];
}
const rojo = ([r, g, b]) => r > 200 && g < 60 && b < 60;
const azul = ([r, g, b]) => b > 200 && r < 60 && g < 60;

test('laminas.mjs: un deck de banda sale en mp4 opaco y la variante de arriba invierte solo el riel', { skip: !CHROME ? 'no hay Chrome' : !hayFfmpeg ? 'no hay ffmpeg' : false, timeout: 300000 }, () => {
  const kit = createRequire(import.meta.url)('../kit.cjs');
  const rel = 'tools/pruebas/salida/banda-real';
  const dir = path.join(raiz, rel);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(raiz, 'creator/leblanc/deck-stage.js'), path.join(dir, 'deck-stage.js'));
  // El riel: una franja roja arriba del panel y una azul abajo. El contenido: un cuadro blanco que se mueve
  // y un bloque verde fijo arriba a la izquierda, que la variante de arriba NO debe mover.
  const riel = `<svg data-riel viewBox="0 0 1080 680" style="position:absolute;inset:0;width:1080px;height:680px"><rect x="0" y="0" width="1080" height="20" fill="#f00"/><rect x="0" y="660" width="1080" height="20" fill="#00f"/></svg>`;
  const lamina = (id, extra = '') => `<section data-lamina="${id}" data-label="${id}"${extra} style="background:#111;position:relative;overflow:hidden">
  <div data-fondo style="position:absolute;left:0;top:297px;width:1080px;height:943px">GAMEPLAY</div>
  <div data-panel style="position:absolute;left:0;top:1240px;width:1080px;height:680px;overflow:hidden;background:#222">
    <div data-contenido style="position:absolute;inset:0"><div data-verde style="position:absolute;left:40px;top:60px;width:100px;height:100px;background:#0f0"></div>
    <div data-caja style="position:absolute;left:300px;top:300px;width:100px;height:100px;background:#fff"></div></div>${riel}
  </div></section>`;
  fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Banda real</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#000}</style></head>
<body><deck-stage width="1080" height="1920" data-recorte="1080:680:0:1240" data-banda="abajo">
${lamina('b-uno')}
${lamina('b-reposo', ' data-reposo')}
</deck-stage>
${kit.banda()}
${kit.gsap(dir)}
${kit.animador()}
<script>['b-uno', 'b-reposo'].forEach(function (n) { animar(n, function (tl, s) { tl.fromTo(s.querySelector('[data-caja]'), { x: 0 }, { x: 400, duration: 0.4, ease: 'none' }); }); });</script>
</body></html>`);
  fs.writeFileSync(path.join(dir, 'guion-marcado.txt'), '⟦lamina:b-uno⟧ Hola.\n');

  const laminas = (...a) => {
    const r = spawnSync(process.execPath, [path.join('tools', 'laminas.mjs'), rel, '--fps=10', ...a], { cwd: raiz, encoding: 'utf8' });
    assert.equal(r.status, 0, `laminas.mjs ${a.join(' ')} falló:\n${r.stdout}\n${r.stderr}`);
    return r;
  };

  // 1. Banda de abajo, pidiendo --alfa=webm como antes: avisa, lo ignora y sale en mp4.
  const r1 = laminas('--alfa=webm');
  assert.match(r1.stderr, /banda opaca: --alfa=webm se ignora/);
  const abajo = path.join(dir, 'video-out', 'laminas');
  const m1 = JSON.parse(fs.readFileSync(path.join(abajo, 'manifest.json'), 'utf8'));
  assert.ok(validarManifest(m1), JSON.stringify(validarManifest.errors));
  assert.deepEqual(m1.map(l => [l.id, l.archivo, l.alfa, l.banda, l.recorte, !!l.reposo]),
    [['b-uno', 'b-uno.mp4', false, 'abajo', '1080:680:0:1240', false], ['b-reposo', 'b-reposo.mp4', false, 'abajo', '1080:680:0:1240', true]]);
  assert.deepEqual(m1[0].caja, { width: 1080, x: 'center', bottom: 0 });
  assert.ok(m1.every(l => Math.abs(l.dur - (l.dur_anim + 1)) < 1e-6 && l.dur_anim > 0.35), 'animación más 1 s quieto');
  assert.ok(fs.existsSync(path.join(abajo, 'guion-marcado.txt')), 'el guion marcado va junto al manifest');
  const sonda = JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,pix_fmt,width,height:format=duration', '-of', 'json', path.join(abajo, 'b-uno.mp4')], { encoding: 'utf8' }).stdout);
  assert.deepEqual(sonda.streams[0], { codec_name: 'h264', width: 1080, height: 680, pix_fmt: 'yuv420p' });
  assert.ok(Math.abs(+sonda.format.duration - m1[0].dur) < 0.15, `la duración del mp4 (${sonda.format.duration}) es la del manifest (${m1[0].dur})`);
  assert.ok(rojo(pixel(path.join(abajo, 'b-uno.mp4'), 540, 8)), 'abajo: el rojo del riel va arriba');
  assert.ok(azul(pixel(path.join(abajo, 'b-uno.mp4'), 540, 671)), 'abajo: el azul del riel va abajo');
  assert.ok(rojo(pixel(path.join(abajo, 'b-uno.png'), 540, 8)), 'el PNG final es de la misma banda');
  assert.equal(pixel(path.join(abajo, 'b-uno.png'), 540, 340)[3], 255, 'el PNG final es opaco');

  // 2. La variante de arriba: el riel invertido, el contenido igual, y en su propia carpeta.
  laminas('--banda=arriba');
  const arriba = path.join(dir, 'video-out', 'laminas-arriba');
  const m2 = JSON.parse(fs.readFileSync(path.join(arriba, 'manifest.json'), 'utf8'));
  assert.ok(validarManifest(m2), JSON.stringify(validarManifest.errors));
  assert.deepEqual(m2.map(l => [l.id, l.archivo, l.alfa, l.banda]), [['b-uno', 'b-uno.mp4', false, 'arriba'], ['b-reposo', 'b-reposo.mp4', false, 'arriba']]);
  assert.deepEqual(m2.map(l => [l.recorte, l.caja, l.dur]), m1.map(l => [l.recorte, l.caja, l.dur]), 'mismo recorte, caja y duración');
  assert.ok(fs.existsSync(path.join(arriba, 'guion-marcado.txt')));
  for (const f of ['b-uno.mp4', 'b-uno.png']) {
    assert.ok(azul(pixel(path.join(arriba, f), 540, 8)), `arriba (${f}): el azul del riel sube`);
    assert.ok(rojo(pixel(path.join(arriba, f), 540, 671)), `arriba (${f}): el rojo baja, del lado del gameplay`);
  }
  const verde = ([r, g, b]) => g > 200 && r < 60 && b < 60;
  assert.ok(verde(pixel(path.join(arriba, 'b-uno.png'), 90, 110)), 'el contenido no se invierte: el bloque verde sigue arriba a la izquierda');
  assert.deepEqual(pixel(path.join(arriba, 'b-uno.png'), 750, 350), pixel(path.join(abajo, 'b-uno.png'), 750, 350), 'el cuadro que se mueve llega al mismo sitio');
  // La de abajo sigue intacta.
  assert.ok(rojo(pixel(path.join(abajo, 'b-uno.mp4'), 540, 8)));

  // 3. Un deck de banda que declara transparencia conserva el webm.
  const h = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(dir, 'index.html'), h.replace('data-banda="abajo"', 'data-banda="abajo" data-alfa="webm"'));
  laminas();
  const m3 = JSON.parse(fs.readFileSync(path.join(abajo, 'manifest.json'), 'utf8'));
  assert.ok(validarManifest(m3), JSON.stringify(validarManifest.errors));
  assert.deepEqual(m3.map(l => [l.archivo, l.alfa, l.banda]), [['b-uno.webm', true, 'abajo'], ['b-reposo.webm', true, 'abajo']]);

  // 4. Sin la variante, --banda=arriba falla antes de renderizar.
  fs.writeFileSync(path.join(dir, 'index.html'), h.replace(' data-banda="abajo"', ''));
  const r4 = spawnSync(process.execPath, [path.join('tools', 'laminas.mjs'), rel, '--banda=arriba', '--sin-render'], { cwd: raiz, encoding: 'utf8' });
  assert.notEqual(r4.status, 0);
  assert.match(r4.stderr, /no tiene variante de banda/);

  fs.rmSync(dir, { recursive: true, force: true });
});
