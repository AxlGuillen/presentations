// Prueba de P11 · Three.js: 10 s de una estrella extruida que gira, llevada
// por la receta 'tres' (renderer.render() en cada seek, sin
// requestAnimationFrame). Se genera en tools/pruebas/salida/prueba-three/ (ignorada en git).
//   node tools/pruebas/deck-three.cjs && node tools/cuadros.mjs tools/pruebas/salida/prueba-three
// Resultado del 22/oct: ~27 ms por cuadro con la GPU (ANGLE Metal, M2) y dos
// renders idénticos.
const fs = require('fs');
const path = require('path');
const kit = require('../kit.cjs');

const raiz = path.resolve(__dirname, '..', '..');
const dir = path.join(raiz, 'tools', 'pruebas', 'salida', 'prueba-three');
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(raiz, 'personal', 'lab', 'deck-stage.js'), path.join(dir, 'deck-stage.js'));

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Prueba de Three.js</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#0E0E12}</style></head>
<body><deck-stage width="1080" height="1920">
<section data-label="portada" style="background:#0E0E12"></section>
<section data-label="three" style="background:#0E0E12;display:flex;align-items:center;justify-content:center">
  <canvas data-efecto="tres" data-escena="estrella" data-dur="10" width="1080" height="1080" style="width:1080px;height:1080px"></canvas></section>
</deck-stage>
${kit.gsap(dir)}
${kit.efectos()}
${kit.animador()}
${kit.threeScript(dir)}
<script>
// La escena se registra con tres(): la receta la arma una vez y la mueve en cada seek.
${require('./tres-ejemplo.cjs')}</script></body></html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log('prueba-three/index.html: 2 láminas');
