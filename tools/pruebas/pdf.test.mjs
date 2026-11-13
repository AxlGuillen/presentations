// pdf.mjs de punta a punta: un deck de banda sale con una página por lámina, recortada a la banda y sin el
// reposo; --con-reposo lo suma y --completa da el lienzo entero.
// Uso: node --test tools/pruebas/pdf.test.mjs   (se salta si no hay Chrome)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { CHROME, raiz } from './ayudas.mjs';

/** Páginas y tamaños (en puntos: 1 px = 0,75 pt) de un PDF de Chrome, que deja los /Page sin comprimir. */
function leerPdf(archivo) {
  const b = fs.readFileSync(archivo).toString('latin1');
  return { paginas: (b.match(/\/Type\s*\/Page[^s]/g) || []).length, cajas: [...new Set(b.match(/\/MediaBox\s*\[[^\]]*\]/g) || [])] };
}

test('pdf.mjs: una página por lámina, recortada a la banda; --con-reposo y --completa', { skip: !CHROME ? 'no hay Chrome' : false, timeout: 180000 }, () => {
  const rel = 'tools/pruebas/salida/pdf-banda';
  const dir = path.join(raiz, rel);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(raiz, 'creator/leblanc/deck-stage.js'), path.join(dir, 'deck-stage.js'));
  const lamina = (id, extra = '') => `<section data-lamina="${id}" data-label="${id}"${extra} style="background:#111;position:relative;overflow:hidden">
  <div data-fondo style="position:absolute;left:0;top:297px;width:1080px;height:943px">GAMEPLAY</div>
  <div data-panel style="position:absolute;left:0;top:1240px;width:1080px;height:680px;background:#c00"></div></section>`;
  fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>PDF de prueba</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#000}</style></head>
<body><deck-stage width="1080" height="1920" data-recorte="1080:680:0:1240" data-banda="abajo">
${lamina('p-uno')}
${lamina('p-dos')}
${lamina('p-reposo', ' data-reposo')}
</deck-stage></body></html>`);

  const pdf = (...a) => {
    const r = spawnSync(process.execPath, [path.join('tools', 'pdf.mjs'), rel, ...a], { cwd: raiz, encoding: 'utf8' });
    assert.equal(r.status, 0, `pdf.mjs ${a.join(' ')} falló:\n${r.stdout}\n${r.stderr}`);
  };
  const archivo = path.join(dir, 'video-out', 'laminas.pdf');

  pdf();
  assert.deepEqual(leerPdf(archivo), { paginas: 2, cajas: ['/MediaBox [0 0 810 510]'] });

  pdf('--con-reposo');
  assert.equal(leerPdf(archivo).paginas, 3);

  pdf('--completa');
  assert.deepEqual(leerPdf(path.join(dir, 'video-out', 'slides.pdf')), { paginas: 2, cajas: ['/MediaBox [0 0 810 1440]'] });
});

// El botón «Descargar PDF» de deck-stage.js y la impresión del navegador: en un deck de banda cada página es la
// banda (el [data-panel] a y = 0), sin el reposo y sin página en blanco al final aunque el contenido desborde, y
// las coreografías salen en su estado final.
test('deck-stage.js: botón «Descargar PDF» junto a «Presentar» e impresión de la banda', { skip: !CHROME ? 'no hay Chrome' : false, timeout: 120000 }, async () => {
  const { lanzar, servir } = await import('./ayudas.mjs');
  const rel = 'tools/pruebas/salida/pdf-boton';
  const dir = path.join(raiz, rel);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(raiz, 'creator/leblanc/deck-stage.js'), path.join(dir, 'deck-stage.js'));
  const { createRequire } = await import('node:module');
  const kit = createRequire(import.meta.url)('../kit.cjs');
  // La caja verde arranca oculta (tl.from opacity 0): en el PDF tiene que salir visible. El fondo con inset negativo
  // desborda el panel, que es lo que antes daba una página en blanco al final.
  const lamina = (id, extra = '') => `<section data-lamina="${id}" data-label="${id}"${extra} style="background:#111;position:relative;overflow:hidden">
  <div data-fondo style="position:absolute;left:0;top:297px;width:1080px;height:943px;background:#00f">GAMEPLAY</div>
  <div data-panel style="position:absolute;left:0;top:1240px;width:1080px;height:680px;overflow:hidden;background:#c00">
    <div style="position:absolute;inset:-40px;background:#a00"></div><div data-caja style="position:absolute;left:100px;top:100px;width:200px;height:200px;background:#0f0"></div>
  </div></section>`;
  fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Botón PDF</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#000}#modo-presentacion{position:fixed;top:16px;right:16px;padding:9px 18px}</style></head>
<body><deck-stage width="1080" height="1920" data-recorte="1080:680:0:1240" data-banda="abajo">
${lamina('b-uno')}
${lamina('b-dos')}
${lamina('b-reposo', ' data-reposo')}
</deck-stage>
${kit.gsap(dir)}
${kit.animador()}
<script>['b-uno', 'b-dos'].forEach(function (n) { animar(n, function (tl, s) { tl.from(s.querySelector('[data-caja]'), { opacity: 0, duration: 2 }); }); });</script>
<button id="modo-presentacion" type="button">Presentar · P</button>
</body></html>`);
  const { origen, cerrar } = await servir();
  const nav = await lanzar();
  try {
    const p = await nav.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    await p.goto(`${origen}/${rel}/`, { waitUntil: 'networkidle0' });
    await p.waitForFunction(() => document.getElementById('descargar-pdf'));
    await new Promise((r) => setTimeout(r, 300));
    const cajas = await p.evaluate(() => [document.getElementById('descargar-pdf'), document.getElementById('modo-presentacion')].map((e) => e.getBoundingClientRect().toJSON()));
    assert.ok(cajas[0].right <= cajas[1].left, `el botón PDF se enciman con «Presentar»: ${JSON.stringify(cajas)}`);
    // El clic carga todo y llama window.print: se intercepta y el PDF sale con la emulación de impresión.
    await p.evaluate(() => { window.print = () => { window.__imprimio = true; }; });
    await p.click('#descargar-pdf');
    await p.waitForFunction(() => window.__imprimio, { timeout: 20000 });
    const archivo = path.join(dir, 'boton.pdf');
    await p.pdf({ path: archivo, preferCSSPageSize: true, printBackground: true });
    assert.deepEqual(leerPdf(archivo), { paginas: 2, cajas: ['/MediaBox [0 0 810 510]'] });
  } finally { await nav.close(); cerrar(); }
});
