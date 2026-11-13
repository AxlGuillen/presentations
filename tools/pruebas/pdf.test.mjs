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
