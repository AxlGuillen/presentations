// Prueba de P6: un objeto a líneas que GIRA, proyectado en cada cuadro en la
// página (kit.lineasRuntime) en vez de quedar resuelto en build-time. Lámina 1:
// el trofeo con sombra quieto (la referencia del costo de captura); lámina 2:
// el mismo trofeo dando una vuelta en 3 s. Se genera en tools/pruebas/salida/prueba-gira/ (ignorada).
//   node tools/pruebas/deck-gira.cjs && node tools/cuadros.mjs tools/pruebas/salida/prueba-gira
// Criterio de la fase 5: menos de ~100 ms por cuadro en Chrome.
const fs = require('fs');
const path = require('path');
const kit = require('../kit.cjs');

const raiz = path.resolve(__dirname, '..', '..');
const dir = path.join(raiz, 'tools', 'pruebas', 'salida', 'prueba-gira');
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(raiz, 'personal', 'lab', 'deck-stage.js'), path.join(dir, 'deck-stage.js'));

const LN = kit.lineas;
const copa = LN.revolucion([[0, 40], [10, 40], [10, 52], [6, 60], [6, 78], [22, 92], [34, 120], [38, 150], [36, 150], [32, 122], [20, 98], [0, 96]], { segmentos: 56 });
const pedestal = LN.caja([0, 18, 0], [64, 36, 64]);
pedestal.frente.detalles.push(LN.rect(pedestal.frente, 0.15, 0.3, 0.85, 0.7));
const OPC = { ancho: 912, alto: 1100, tinta: '#F2EFE8', grosor: 3, fino: 1.6, sombra: { luz: [-0.6, 0.7, 0.6], paso: 7, umbrales: [0.5, 0.85] }, escala: 560 };
const CAM = { centro: [0, 80, 0], radio: Math.hypot(180, 420), altura: 180, angulo: Math.atan2(180, 420), fov: 24 };
const ojo = (a) => [Math.sin(CAM.angulo + a) * CAM.radio, CAM.centro[1] + CAM.altura, Math.cos(CAM.angulo + a) * CAM.radio];
const modelo = JSON.stringify({ objetos: [copa, pedestal], opciones: OPC, cam: CAM });

const estatico = LN.dibujar([copa, pedestal], { ...OPC, camara: { ojo: ojo(0), centro: CAM.centro, fov: CAM.fov } });
const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Prueba de giro</title>
<script src="./deck-stage.js"></script><style>html,body{margin:0;background:#0E0E12}</style></head>
<body><deck-stage width="1080" height="1920">
<section data-label="quieto" style="background:#0E0E12;display:flex;align-items:center;justify-content:center">
  <div data-quieto style="width:912px;height:1100px">${estatico}</div></section>
<section data-label="gira" style="background:#0E0E12;display:flex;align-items:center;justify-content:center">
  <div data-gira data-modelo='${modelo}' style="width:912px;height:1100px">${estatico}</div></section>
</deck-stage>
${kit.gsap(dir)}
${kit.lineasRuntime()}
${kit.animador()}
<script>
window.__costo = [];
animar('quieto', function (tl, s) { tl.to({}, { duration: 3 }, 0); });
animar('gira', function (tl, s) {
  var caja = s.querySelector('[data-gira]'), m = JSON.parse(caja.getAttribute('data-modelo')), c = m.cam, est = { a: 0 };
  var pinta = function () {
    var t0 = performance.now(), a = c.angulo + est.a * Math.PI * 2;
    var cam = { ojo: [Math.sin(a) * c.radio, c.centro[1] + c.altura, Math.cos(a) * c.radio], centro: c.centro, fov: c.fov };
    caja.innerHTML = lineas.dibujar(m.objetos, Object.assign({}, m.opciones, { camara: cam }));
    window.__costo.push(performance.now() - t0);
  };
  tl.fromTo(est, { a: 0 }, { a: 1, duration: 3, ease: 'none', immediateRender: true, onUpdate: pinta }, 0);
});
</script></body></html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log(`prueba-gira/index.html · modelo ${(modelo.length / 1024).toFixed(0)} KB`);
