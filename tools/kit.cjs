// tools/kit.cjs — Kit de diseño en tiempo de generación.
//
// Se usa desde los gen.js de cada deck:
//   const kit = require('../tools/kit.cjs');
//
// Todo devuelve strings de CSS o data-URIs que se incrustan en el HTML
// generado: el deck sigue siendo autocontenido y sin dependencias en runtime.
// El kit solo existe en build-time, igual que los propios gen.js.
//
// Piezas:
//   alpha(hex, a)      → 'rgba(r,g,b,a)' a partir de un hex
//   capa(imagen, tam)  → una capa cruda de background-image (tam por defecto '100% 100%')
//   fondo(color, ...capas) → 'background: …; background-image: …; background-size: …;'
//   puntos({...})      → capa de retícula de puntitos
//   lavado({...})      → capa de resplandor radial en una esquina
//   grano({...})       → capa de ruido tipo grano de película (SVG feTurbulence en data-URI)
//   malla(colores)     → capas de malla de gradientes (una por color, posiciones fijas)
//   sombra({...})      → 'box-shadow: …;' en capas: contacto + elevación + halo opcional

/** 'rgba(…)' a partir de '#RRGGBB' y una opacidad 0–1. */
const alpha = (hex, a) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Capa cruda para fondo(): cualquier valor válido de background-image. */
const capa = (imagen, tam = '100% 100%') => ({ imagen, tam });

/** Compone color de base + capas en un solo string de estilos.
 *  Las capas se pintan en orden: la primera queda encima. */
const fondo = (color, ...capas) =>
  `background: ${color}; ` +
  `background-image: ${capas.map(c => c.imagen).join(', ')}; ` +
  `background-size: ${capas.map(c => c.tam).join(', ')};`;

/** Retícula de puntitos. `color` ya debe traer su opacidad (usa alpha()). */
const puntos = ({ color, radio = 1.9, paso = 26 } = {}) =>
  capa(`radial-gradient(${color} ${radio}px, transparent ${radio}px)`, `${paso}px ${paso}px`);

/** Resplandor radial suave anclado a una esquina, para que el fondo no sea plano.
 *  `en` es la posición CSS del centro ('100% 0%' = esquina superior derecha). */
const lavado = ({ color, en = '100% 0%', ancho = 72, alto = 56, fuerza = 0.6, alcance = 62 } = {}) =>
  capa(`radial-gradient(${ancho}% ${alto}% at ${en}, ${alpha(color, fuerza)} 0%, ${alpha(color, 0)} ${alcance}%)`);

/** Grano de película: ruido SVG (feTurbulence) incrustado como data-URI.
 *  Sutil por diseño; subir `opacidad` con cuidado. Sobre fondos claros el
 *  grano es oscuro; para fondos oscuros conviene bajar la opacidad aún más. */
const grano = ({ opacidad = 0.05, frecuencia = 0.8, tam = 280 } = {}) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${tam}' height='${tam}'>` +
    `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='${frecuencia}' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacidad} 0'/></filter>` +
    `<rect width='100%' height='100%' filter='url(%23g)'/></svg>`;
  return capa(`url("data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/'/g, '%27')}")`, `${tam}px ${tam}px`);
};

/** Malla de gradientes: un resplandor por color, en posiciones fijas y
 *  deterministas (importa para el módulo de video). Hasta 5 colores. */
const POSICIONES_MALLA = ['85% 10%', '8% 92%', '96% 70%', '18% 22%', '55% 100%'];
const malla = (colores, fuerza = 0.4) =>
  colores.slice(0, POSICIONES_MALLA.length).map((c, i) =>
    lavado({ color: c, en: POSICIONES_MALLA[i], ancho: 70, alto: 60, fuerza, alcance: 60 }));

/** Sombra en capas: contacto (pegada), elevación (difusa) y un halo de color
 *  opcional que "tiñe" la luz. `nivel` escala la profundidad (1 = tarjeta). */
const sombra = ({ tinta = '#172B4D', halo = null, nivel = 1 } = {}) => {
  const capas = [
    `0 1px 2px ${alpha(tinta, 0.07)}`,
    `0 ${10 * nivel}px ${24 * nivel}px ${alpha(tinta, 0.08)}`,
  ];
  if (halo) capas.push(`0 ${26 * nivel}px ${52 * nivel}px ${alpha(halo, 0.07)}`);
  return `box-shadow: ${capas.join(', ')};`;
};

/** Pegamento de animación para GSAP (opcional). Devuelve un <script> inline.
 *
 *  Requisitos en el deck: copiar `tools/vendor/gsap.min.js` a la carpeta del
 *  deck (vendorizado, como deck-stage.js) y en el HTML generado incluir
 *  `<script src="./gsap.min.js"></script>` seguido de `kit.animador()`.
 *
 *  Qué hace: cuando deck-stage activa una diapositiva (data-deck-active),
 *  construye y lanza una timeline GSAP fresca para esa slide. Sin registro
 *  explícito aplica una entrada por defecto sobre los grupos data-a
 *  ("up"/"up2"/"up3"/"ghost"), así que basta incluirlo para tener animación.
 *  Para coreografías propias, después de este script se registra:
 *
 *    animar('Etiqueta de la slide', (tl, s) => { tl.from(...); ... });
 *
 *  donde la etiqueta es el data-label de la <section> y `s` es la sección.
 *  También expone `cuenta(tl, el, pos)`: contador numérico para elementos
 *  con data-cuenta="37" (y data-sufijo="%" opcional).
 *
 *  Detalles deliberados: los estados iniciales se ponen con tl.from(), nunca
 *  con CSS — si GSAP no carga, el deck se ve completo y estático (y la
 *  impresión a PDF no se rompe). Con prefers-reduced-motion la timeline
 *  salta directo al final. Las timelines quedan en section.__tl, seekeables
 *  para el futuro render de video cuadro a cuadro. */
const animador = () => `<script>
(function () {
  if (!window.gsap) return;
  var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var registro = {};
  window.animar = function (etiqueta, fn) { registro[etiqueta] = fn; };
  window.cuenta = function (tl, el, pos) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), suf = el.dataset.sufijo || '';
    var o = { v: 0 };
    tl.to(o, { v: fin, duration: 1, ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(o.v) + suf; } }, pos || 0);
  };
  function porDefecto(tl, s) {
    ['ghost', 'up', 'up2', 'up3'].forEach(function (n, i) {
      var els = s.querySelectorAll('[data-a="' + n + '"]');
      if (!els.length) return;
      if (n === 'ghost') tl.from(els, { scale: 0.88, opacity: 0, duration: 1 }, 0);
      else tl.from(els, { y: 26, opacity: 0, duration: 0.65 }, (i - 1) * 0.13);
    });
  }
  function lanzar(s) {
    if (s.__tl) s.__tl.revert();
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    (registro[s.dataset.label] || porDefecto)(tl, s);
    if (reducido) tl.progress(1);
    s.__tl = tl;
  }
  function arrancar() {
    var ds = document.querySelector('deck-stage');
    if (!ds) return;
    var obs = new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.target.hasAttribute('data-deck-active')) lanzar(m.target);
      });
    });
    ds.querySelectorAll(':scope > section').forEach(function (s) {
      obs.observe(s, { attributes: true, attributeFilter: ['data-deck-active'] });
    });
    var activa = ds.querySelector('section[data-deck-active]');
    if (activa) lanzar(activa);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
</${'script'}>`;

module.exports = { alpha, capa, fondo, puntos, lavado, grano, malla, sombra, animador };
