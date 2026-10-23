// Prueba de P11 · Lottie: 10 s de una animación hecha a mano (sin assets de
// terceros) llevada por la receta 'lottie' (goToAndStop por cuadro, sin
// requestAnimationFrame). Se genera en prueba-lottie/ (ignorada en git).
//   node tools/pruebas/deck-lottie.cjs && node tools/cuadros.mjs prueba-lottie
// Resultado del 22/oct: ~28 ms por cuadro y dos renders idénticos.
const fs = require('fs');
const path = require('path');
const kit = require('../kit.cjs');
const animacion = require('./lottie-ejemplo.cjs');

const raiz = path.resolve(__dirname, '..', '..');
const dir = path.join(raiz, 'prueba-lottie');
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(raiz, 'lab', 'deck-stage.js'), path.join(dir, 'deck-stage.js'));

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Prueba de Lottie</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#0E0E12}</style></head>
<body><deck-stage width="1080" height="1920">
<section data-label="lottie" style="background:#0E0E12;display:flex;align-items:center;justify-content:center">
  <div data-efecto="lottie">${kit.lottie(animacion, { ancho: 1080, alto: 1080 })}</div></section>
</deck-stage>
${kit.gsap(dir)}
${kit.lottieScript(dir)}
${kit.efectos()}
${kit.animador()}
</body></html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log(`prueba-lottie/index.html · animación de ${(JSON.stringify(animacion).length / 1024).toFixed(1)} KB`);
