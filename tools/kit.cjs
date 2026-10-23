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
//
// Animación y recursos (ver docs/animaciones-y-assets.md):
//   gsap(dir, plugins)    → copia GSAP 3.15 + plugins al deck y devuelve los <script>
//   efectos()             → catálogo de recetas: efecto(nombre, tl, el, o) y data-efecto="…"
//   pincel/duotono/glitch → piezas de HTML que necesitan esas recetas
//   patron(tipo, o)       → patrón generativo con semilla, SVG inline animable
//   patronFondo(tipo, o)  → el mismo patrón como capa para fondo()
//   icono(id, o)          → ícono de Iconify inline (caché en tools/cache/iconos)
//   ilustracion(f, o)     → Open Doodles o un SVG de unDraw, recoloreado

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
  // Comillas SIMPLES a propósito: los gen.js pintan esto dentro de style="…",
  // y unas dobles cerraban el atributo antes de tiempo (se perdía todo el
  // estilo de la sección y el CSS salía como texto). Las simples del SVG ya
  // van codificadas como %27, así que no chocan.
  return capa(`url('data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/'/g, '%27')}')`, `${tam}px ${tam}px`);
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

/** Dominio de producción — única fuente para URLs absolutas (OG las exige). */
const PROD = 'https://presentations-three-phi.vercel.app';

/** Bloque de metas Open Graph / Twitter para el <head> de un deck, para que
 *  el enlace se comparta con card y preview (WhatsApp, Slack, X…). La imagen
 *  es `assets/og.png` (1200×630), generada con `node tools/og.mjs <carpeta>`.
 *  Sin `carpeta` produce las metas de la galería raíz (imagen /og.png). */
const og = ({ titulo, descripcion, carpeta = '' }) => {
  const url = `${PROD}/${carpeta ? carpeta + '/' : ''}`;
  const img = carpeta ? `${url}assets/og.png` : `${PROD}/og.png`;
  return [
    `<meta name="description" content="${descripcion}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${titulo}">`,
    `<meta property="og:description" content="${descripcion}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ].join('\n');
};

/** Diagrama Mermaid → SVG inline, renderizado en build-time (tools/diagrama.mjs
 *  con el Chrome del sistema). El SVG se incrusta en el HTML generado: el deck
 *  no carga Mermaid en runtime. `config` es el objeto de mermaid.initialize()
 *  — pasa ahí el tema del deck, p. ej.:
 *    kit.diagrama(`flowchart LR\n  A --> B`, {
 *      theme: 'base',
 *      themeVariables: { primaryColor: '#DEEBFF', primaryTextColor: '#172B4D',
 *                        primaryBorderColor: '#0052CC', lineColor: '#5E6C84',
 *                        fontFamily: 'Figtree, sans-serif' },
 *    })
 *  Tarda ~2 s por diagrama (levanta Chrome); solo se paga al correr gen.js. */
const diagrama = (codigo, config = {}) => {
  const { execFileSync } = require('child_process');
  const path = require('path');
  return execFileSync(process.execPath,
    [path.join(__dirname, 'diagrama.mjs'), JSON.stringify(config)],
    { input: codigo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
};

/** Botón «Reproducir» + reproductor para los decks que tengan video.
 *
 *  Emite un <script> que monta, junto al botón «Presentar · P», otro botón que
 *  abre el MP4 en una capa sobre el propio deck — sin salir de la página, que
 *  es lo que se espera al pulsar «reproducir».
 *
 *  Detalles deliberados:
 *   - El botón es `#ver-video` y la capa `#capa-video`: los cuatro scripts de
 *     `tools/` ocultan esos dos ids antes de capturar, así que no se cuelan en
 *     los PNG, ni en la portada, ni en los clips del propio video.
 *   - Con la capa abierta, las flechas y el espacio controlan el video y no la
 *     navegación del deck: se interceptan en fase de captura, antes de que
 *     deck-stage las vea.
 *   - En modo presentación ambos desaparecen, igual que el botón de presentar.
 *   - Si el MP4 no estuviera, el botón no se monta: se comprueba con un HEAD.
 */
const reproductor = ({ src = 'video.mp4', etiqueta = 'Reproducir', tecla = 'v',
                       acento = '#0052CC', duracion = '' } = {}) => `<script>
(function () {
  var SRC = ${JSON.stringify(src)}, TECLA = ${JSON.stringify(tecla)}.toLowerCase();
  var abierto = false, btn, capa, video;

  function montar() {
    btn = document.createElement('button');
    btn.id = 'ver-video';
    btn.type = 'button';
    btn.textContent = '▶ ${etiqueta} · ' + TECLA.toUpperCase();
    btn.style.cssText = 'position:fixed;top:16px;right:150px;z-index:2147483000;' +
      'padding:9px 18px;border:1px solid ${acento};border-radius:999px;' +
      'background:${acento};color:#FFFFFF;cursor:pointer;' +
      'font:600 13px/1 inherit;letter-spacing:.6px;opacity:.85;transition:opacity 160ms ease';
    btn.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
    btn.addEventListener('mouseleave', function () { btn.style.opacity = abierto ? '1' : '.85'; });
    btn.addEventListener('click', function () { alternar(); btn.blur(); });
    document.body.appendChild(btn);

    capa = document.createElement('div');
    capa.id = 'capa-video';
    // OJO: la capa se oculta con display:none, no con el atributo hidden. hidden
    // pone display:none desde la hoja del navegador, y el display:flex en línea
    // le ganaba: la capa salía abierta al cargar y tapaba el deck entero.
    capa.style.cssText = 'position:fixed;inset:0;z-index:2147483100;background:rgba(9,13,24,.92);' +
      'display:none;align-items:center;justify-content:center;padding:3vh 3vw';
    video = document.createElement('video');
    // Sin src hasta que se abre: con src y preload el navegador bajaba ~10 s de
    // video al entrar al deck aunque nadie le diera play.
    video.preload = 'none';
    video.controls = true;
    video.playsInline = true;
    video.style.cssText = 'max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 24px 70px rgba(0,0,0,.55)';
    var cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.setAttribute('aria-label', 'Cerrar el video');
    cerrar.textContent = '✕ Cerrar · Esc';
    cerrar.style.cssText = 'position:absolute;top:18px;right:18px;padding:9px 18px;' +
      'border:1px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(0,0,0,.45);' +
      'color:#FFF;cursor:pointer;font:600 13px/1 inherit;letter-spacing:.6px;z-index:2';
    cerrar.addEventListener('click', function (e) { e.stopPropagation(); alternar(false); });
    capa.addEventListener('click', function (e) { if (e.target === capa) alternar(false); });
    capa.appendChild(video);
    capa.appendChild(cerrar);
    document.body.appendChild(capa);
    colocar();
    window.addEventListener('resize', colocar);
    if (document.fonts) document.fonts.ready.then(colocar);
  }

  // El botón va a la izquierda de «Presentar · P», midiendo su ancho real: con
  // un right fijo de 150px los dos se enciman en cuanto el texto mide más.
  function colocar() {
    var p = document.getElementById('modo-presentacion');
    var r = p && p.getBoundingClientRect();
    btn.style.right = (r && r.width ? Math.round(window.innerWidth - r.left + 10) : 150) + 'px';
  }

  function alternar(forzar) {
    if (!btn) return;
    abierto = forzar === undefined ? !abierto : forzar;
    capa.style.display = abierto ? 'flex' : 'none';
    btn.style.opacity = abierto ? '1' : '.85';
    if (abierto && !video.getAttribute('src')) video.src = SRC;
    if (abierto) video.play().catch(function () {});   // si el navegador lo bloquea, quedan los controles
    else {
      video.pause();
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    }
  }

  // El botón nativo de pantalla completa pone en fullscreen el <video>, y
  // entonces el navegador solo pinta ese elemento: el botón «Cerrar», que vive
  // en la capa, desaparece y el video se queda sin salida. Se reconduce el
  // fullscreen a la capa, que sí lo lleva dentro.
  document.addEventListener('fullscreenchange', function () {
    if (!video || document.fullscreenElement !== video) return;
    document.exitFullscreen()
      .then(function () { return capa.requestFullscreen(); })
      .catch(function () {});
  });

  // Con la capa abierta, el teclado es del video: se corta antes de deck-stage.
  window.addEventListener('keydown', function (e) {
    if (!btn) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (abierto) {
      if (e.key === 'Escape' || e.key.toLowerCase() === TECLA) { alternar(false); e.preventDefault(); e.stopPropagation(); return; }
      if (['ArrowLeft', 'ArrowRight', ' ', 'Spacebar', 'PageUp', 'PageDown', 'Home', 'End'].indexOf(e.key) >= 0) e.stopPropagation();
      return;
    }
    if (e.key.toLowerCase() === TECLA) { alternar(true); e.preventDefault(); e.stopPropagation(); }
  }, true);

  // En modo presentación desaparecen los dos, como el botón de presentar.
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!btn || !d || typeof d.__omelette_presenting !== 'boolean') return;
    btn.style.display = d.__omelette_presenting ? 'none' : '';
    setTimeout(colocar, 0);   // «Presentar · P» cambia de texto y de ancho
    if (d.__omelette_presenting) alternar(false);
  });

  // Sin archivo, no hay botón: mejor eso que un botón que abre una capa vacía.
  fetch(SRC, { method: 'HEAD' })
    .then(function (r) { if (r.ok) montar(); })
    .catch(function () {});
})();
</${'script'}>`;

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
    // Suena como la receta contador (ticks en el video), en el arranque real
    // del tween: pos puede ser relativa ('<', '+=0.2'). Sin kit.efectos() no
    // hay window.sfx y la etiqueta se pone aquí mismo.
    var en = tl.recent().startTime();
    if (window.sfx) window.sfx(tl, 'contador', en);
    else if (tl.labels['sfx:contador'] == null) tl.addLabel('sfx:contador', en);
  };
  function porDefecto(tl, s) {
    ['ghost', 'up', 'up2', 'up3'].forEach(function (n, i) {
      var els = s.querySelectorAll('[data-a="' + n + '"]');
      if (!els.length) return;
      if (n === 'ghost') tl.from(els, { scale: 0.88, opacity: 0, duration: 1 }, 0);
      else tl.from(els, { y: 26, opacity: 0, duration: 0.65 }, (i - 1) * 0.13);
    });
    // Recetas declaradas en el HTML (data-efecto), si el deck carga kit.efectos().
    if (window.efectosDeclarados) window.efectosDeclarados(tl, s);
  }
  function lanzar(s) {
    if (s.__tl) s.__tl.revert();
    // Lo que las recetas cambiaron del DOM (SplitText, cortinas, rebanadas…)
    // se deshace antes de reconstruir; si no, se partiría el texto dos veces.
    (s.__deshacer || []).reverse().forEach(function (f) { try { f(); } catch (e) {} });
    s.__deshacer = [];
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
    // La primera lámina espera a las fuentes: SplitText mide las líneas, y con
    // la tipografía de respaldo saldrían cortes de línea distintos.
    var activa = ds.querySelector('section[data-deck-active]');
    if (activa) (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      if (activa.hasAttribute('data-deck-active') && !activa.__tl) lanzar(activa);
    });
  }
  // Pasos (data-step de deck-stage): al revelar un paso hacia adelante, los
  // elementos recién visibles entran animados; ocultar o revelar de golpe
  // (llegar en reversa) no anima nada.
  document.addEventListener('stepchange', function (e) {
    var d = e.detail;
    if (reducido || !d || d.step !== d.previousStep + 1) return;
    var els = d.slide.querySelectorAll('[data-step="' + d.step + '"]');
    if (els.length) gsap.from(els, { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', clearProps: 'opacity,transform' });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
</${'script'}>`;


/** Difiere los assets de un deck para que el navegador solo descargue de
 *  entrada lo que se ve.
 *
 *  Deja intactas las primeras `eager` diapositivas (por defecto 1: la portada,
 *  que además es lo que capturan portadas.mjs y og.mjs) y en el resto convierte
 *  `src="assets/…"` en `data-src` y el `background-image` en línea de la
 *  <section> en un atributo `data-bg`. deck-stage.js los hidrata al activar la
 *  diapositiva y sus vecinas, al materializar su miniatura en el rail, y todos
 *  de golpe al imprimir o vía `cargarTodo()`.
 *
 *  Va en build-time a propósito: el preload scanner del navegador dispara las
 *  peticiones de <img src> antes de que corra cualquier JS, así que interceptar
 *  en runtime no evita la descarga — hay que no emitir el src.
 *
 *  Uso al final del gen.js:  fs.writeFileSync(dest, kit.diferir(html), 'utf8')
 */
const diferir = (html, { eager = 1 } = {}) => {
  // Se delimita por las propias <section> y no por el contenedor: los decks
  // generados usan <deck-stage>, pero tabletas viene de Claude Design y las
  // envuelve en <x-import>. Ninguna slide anida <section>, así que partir por
  // la etiqueta de apertura da exactamente una diapositiva por trozo.
  const abre = html.indexOf('<section');
  const fin = html.lastIndexOf('</section>');
  if (abre < 0 || fin < 0) return html;
  const cierra = fin + '</section>'.length;

  const trozos = html.slice(abre, cierra).split(/(?=<section)/);
  const diferidos = trozos.map((trozo, i) => {
    if (i < eager) return trozo;

    // El background-image vive dentro del style= de la <section>: se saca del
    // estilo y se guarda entero (degradado incluido) en data-bg.
    const corte = trozo.indexOf('>') + 1;
    let tag = trozo.slice(0, corte);
    const resto = trozo.slice(corte);
    const m = tag.match(/background-image:\s*([^;]+);\s*/);
    if (m && m[1].includes('assets/')) {
      tag = tag.replace(m[0], '').replace(/^<section/, `<section data-bg="${m[1].trim().replace(/"/g, '&quot;')}"`);
    }
    // Y los fondos ANIDADOS: el helper portada() de la serie Cumplelolero pinta
    // el splash en dos <div> dentro de la <section>, no en la <section> misma.
    // Sin esto la portada del cierre se bajaba al entrar y el diferido perdía
    // justo la imagen más pesada del deck.
    const conFondos = resto.replace(/<([a-zA-Z][\w-]*)([^>]*)>/g, (todo, nombre, attrs) => {
      const b = attrs.match(/background-image:\s*(url\((?:'[^']*'|"[^"]*"|[^)]*)\))\s*;?\s*/);
      if (!b || !b[1].includes('assets/')) return todo;
      return `<${nombre} data-bg="${b[1].replace(/"/g, '&quot;')}"${attrs.replace(b[0], '')}>`;
    });
    // El espacio previo es obligatorio para no volver a marcar un data-src
    // si el generador se corre dos veces sobre el mismo HTML.
    return (tag + conFondos).replace(/(\s)src="(assets\/[^"]+)"/g, '$1data-src="$2"');
  });

  return html.slice(0, abre) + diferidos.join('') + html.slice(cierra);
};

/** GSAP + los plugins que pida el deck, vendorizados en su carpeta.
 *
 *  Copia `tools/vendor/gsap.min.js` (3.15) y los plugins a la carpeta del deck
 *  —cada deck sigue siendo autocontenido— y devuelve los <script> más el
 *  registerPlugin. Uso en gen.js, al final del <body>:
 *
 *    ${kit.gsap(__dirname, ['SplitText', 'DrawSVG', 'Flip'])}
 *    ${kit.efectos()}
 *    ${kit.animador()}
 *
 *  Plugins: SplitText, DrawSVG, MorphSVG, Flip, ScrambleText, CustomEase,
 *  CustomWiggle (trae CustomEase), MotionPath, Text, Physics2D, EasePack.
 *  Desde la 3.13 todos son gratis (licencia «Standard no charge» de GSAP).
 *  Los decks viejos traen su propia 3.12.5 y no se tocan. */
const PLUGINS = {
  SplitText: ['SplitText', ['SplitText']], DrawSVG: ['DrawSVGPlugin', ['DrawSVGPlugin']],
  MorphSVG: ['MorphSVGPlugin', ['MorphSVGPlugin']], Flip: ['Flip', ['Flip']],
  ScrambleText: ['ScrambleTextPlugin', ['ScrambleTextPlugin']], CustomEase: ['CustomEase', ['CustomEase']],
  CustomWiggle: ['CustomWiggle', ['CustomWiggle']], MotionPath: ['MotionPathPlugin', ['MotionPathPlugin']],
  Text: ['TextPlugin', ['TextPlugin']], Physics2D: ['Physics2DPlugin', ['Physics2DPlugin']],
  EasePack: ['EasePack', ['ExpoScaleEase', 'RoughEase', 'SlowMo']],
};
const gsap = (dir, plugins = []) => {
  const fs = require('fs');
  const path = require('path');
  const vendor = path.join(__dirname, 'vendor');
  const pedidos = [...new Set(plugins.flatMap((p) => (p === 'CustomWiggle' ? ['CustomEase', p] : [p])))];
  for (const p of pedidos) if (!PLUGINS[p]) throw new Error(`kit.gsap: plugin desconocido «${p}». Hay: ${Object.keys(PLUGINS).join(', ')}`);
  const archivos = ['gsap', ...pedidos.map((p) => PLUGINS[p][0])];
  for (const a of archivos) fs.copyFileSync(path.join(vendor, `${a}.min.js`), path.join(dir, `${a}.min.js`));
  const globales = pedidos.flatMap((p) => PLUGINS[p][1]);
  return archivos.map((a) => `<script src="./${a}.min.js"></script>`).join('\n') +
    (globales.length ? `\n<script>gsap.registerPlugin(${globales.join(', ')});</${'script'}>` : '');
};

const { efectos, pincel, duotono, glitch, quemado, tinta, ventana, sello, grafica, contorno, destello, impacto, rayo, multikill, letrero, dona, radar } = require('./kit-efectos.cjs');
const { patron, patronFondo, prng } = require('./kit-patrones.cjs');
const { icono, ilustracion } = require('./kit-recursos.cjs');
const lineas = require('./kit-lineas.cjs');
const { ritmo, voz, golpe } = require('./kit-ritmo.cjs');

/** PRNG con semilla (mulberry32), el mismo que usan kit.patron y las recetas
 *  del runtime: kit.random('confeti')() da la misma secuencia que
 *  random('confeti')() dentro de la página. La semilla puede ser número o texto. */
module.exports = { alpha, capa, fondo, puntos, lavado, grano, malla, sombra, diagrama, animador, reproductor, diferir, og, PROD,
  gsap, efectos, pincel, duotono, glitch, quemado, tinta, ventana, sello, grafica, contorno, destello, impacto, rayo, multikill, letrero, dona, radar, patron, patronFondo, icono, ilustracion, lineas, ritmo, voz, golpe, random: prng };
