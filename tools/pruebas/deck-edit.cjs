// Deck de prueba del kit de edit: tres láminas para montar encima de un clip
// (partículas, palabra y letrero), en el panel de 1080×1370 del montaje.
// No es un deck del sitio: se genera en tools/pruebas/salida/prueba-edit/ (ignorada en git) y sirve
// para comprobar que las capas salen con alfa y sin rectángulos.
//   node tools/pruebas/deck-edit.cjs
//   node tools/laminas.mjs tools/pruebas/salida/prueba-edit --alfa
const fs = require('fs');
const path = require('path');
const kit = require('../kit.cjs');

const raiz = path.resolve(__dirname, '..', '..');
const dir = path.join(raiz, 'tools', 'pruebas', 'salida', 'prueba-edit');
fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
fs.copyFileSync(path.join(raiz, 'personal', 'lab', 'deck-stage.js'), path.join(dir, 'deck-stage.js'));
fs.copyFileSync(path.join(raiz, 'personal', 'lab', 'assets', 'Jinx_0.jpg'), path.join(dir, 'assets', 'Jinx_0.jpg'));

const r = kit.ritmo(require('./beatmap.json'), { desde: 4 });
const ANTON = `'Anton', Impact, sans-serif`;
// Lo importante va dentro del panel (y de 275 a 1645); el resto es fondo.
const panel = (cuerpo) => `<div style="position:absolute;left:0;top:275px;width:1080px;height:1370px;display:flex;align-items:center;justify-content:center">${cuerpo}</div>`;
const seccion = (id, cuerpo) => `<section data-lamina="${id}" data-label="${id}" style="background:#0B0B10;overflow:hidden;position:relative">
  <div data-fondo style="position:absolute;inset:0;background:radial-gradient(80% 50% at 50% 50%, #26213A, #0B0B10)"></div>${panel(cuerpo)}</section>`;

const slides = [
  seccion('particulas', `<div style="position:relative;width:1080px;height:1370px">
    <div data-efecto="destello" data-en="0.2" style="position:absolute;left:190px;top:325px;width:700px;height:700px">${kit.destello({ tam: 700, rayos: 22, color: '#FFD36B', semilla: 'prueba' })}</div>
    <div data-efecto="multikill" data-en="0.25" style="position:absolute;left:90px;top:575px;width:900px">${kit.multikill('QUADRA KILL', { ancho: 900, alto: 230 })}</div>
    <div data-efecto="chispas" data-en="0.67" data-origen="50 50" data-n="60" data-semilla="prueba" style="position:absolute;inset:0"></div>
    <div data-efecto="brasas" data-en="0" data-dur="3" data-semilla="prueba" style="position:absolute;inset:0"></div></div>`),
  seccion('palabra', `<div style="position:relative;width:1080px;height:1370px;display:flex;align-items:center;justify-content:center">
    <div data-efecto="impacto" data-en="${r.b(0)}" data-dur="0.7" style="position:absolute;inset:0">${kit.impacto({ ancho: 1080, alto: 1370, n: 72, hueco: 0.5, color: '#FFFFFF' })}</div>
    <div data-efecto="palabra" data-tiempos="${r.beats(0, 7).join(',')}" data-color="#FFFFFF" data-color2="#FF4FA8" style="position:relative;font:400 230px/1 ${ANTON};text-shadow:none">SURVIVE</div></div>`),
  seccion('letrero', `<div style="position:relative;width:1080px;height:1370px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:160px;box-sizing:border-box">
    <div data-efecto="rayo" data-en="0" data-dur="0.5" style="position:absolute;inset:0">${kit.rayo(['M-80 980 C 300 900, 700 700, 1180 420'], { ancho: 1080, alto: 1370, color: '#FF4FA8', grosor: 11 })}</div>
    <div data-efecto="letrero" data-en="0.35">${kit.letrero({ nombre: 'POWDER', campeon: 'JINX · PENTAKILL', retrato: 'assets/Jinx_0.jpg', color: '#FF4FA8', tam: 140 })}</div></div>`),
];

const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Prueba del kit de edit</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>html,body{margin:0;background:#0B0B10}</style></head>
<body><deck-stage width="1080" height="1920">
${slides.join('\n')}
</deck-stage>
${kit.gsap(dir, ['DrawSVG'])}
${kit.efectos()}
${kit.animador()}
</body></html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), kit.diferir(html), 'utf8');
console.log(`prueba-edit/index.html: ${slides.length} láminas`);
