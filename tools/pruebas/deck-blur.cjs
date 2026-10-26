// Deck de prueba del desenfoque de movimiento (data-blur en cuadros.mjs): un
// bloque blanco cruza a velocidad fija, con y sin desenfoque. Se genera en
// prueba-blur/ (ignorada en git).
//   node tools/pruebas/deck-blur.cjs && node tools/cuadros.mjs tools/pruebas/salida/prueba-blur
// La estela debe medir velocidad × obturador / fps a cada lado del bloque
// (2400 px/s × 0,5 / 30 = 40 px) y el último cuadro, quieto, debe quedar nítido.
const fs = require('fs');
const path = require('path');
const kit = require('../kit.cjs');

const raiz = path.resolve(__dirname, '..', '..');
const dir = path.join(raiz, 'tools', 'pruebas', 'salida', 'prueba-blur');
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(raiz, 'personal', 'lab', 'deck-stage.js'), path.join(dir, 'deck-stage.js'));

const lamina = (id, blur) => `<section data-label="${id}" ${blur ? `data-blur="${blur}"` : ''} style="background:#000;position:relative;overflow:hidden">
  <div data-bloque style="position:absolute;left:0;top:900px;width:120px;height:120px;background:#FFF"></div></section>`;
const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Prueba de desenfoque</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#000}</style></head>
<body><deck-stage width="1080" height="1920">
${lamina('nitido', 0)}
${lamina('blur', 8)}
</deck-stage>
${kit.gsap(dir)}
${kit.animador()}
<script>
['nitido', 'blur'].forEach(function (n) {
  animar(n, function (tl, s) {
    // 960 px en 0,4 s = 2400 px/s, y luego quieto hasta 1 s
    tl.fromTo(s.querySelector('[data-bloque]'), { x: 0 }, { x: 960, duration: 0.4, ease: 'none' }, 0.2);
    tl.to({}, { duration: 0.4 }, 0.6);
  });
});
</script></body></html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log('prueba-blur/index.html: 2 láminas');
