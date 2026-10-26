// Generador de index.html — «Video at UrVenue»: el primer video promocional
// que pidieron (UWS-10821, el anuncio de Stripe) y los otros formatos que se
// pueden hacer con las mismas herramientas.
// Ejecutar: node work/urvenue-video/gen.js   (los clips salen de urvenue-video/assets.sh)
//
// 16:9, EN INGLÉS y sin video narrado. Va para Joseph, que pidió y vivió la
// tarea: por eso es corta (4 láminas) y no cuenta el proceso. El mensaje es
// uno: se pueden hacer más videos, de cualquier formato, y rápido. La
// primera versión (10 láminas con el pedido, el feedback y el timeline) se
// recortó por encargo de Axl.
//
// ⚠️ PUBLICADA SIN LISTAR (decisión de Axl, 26/oct): no está en el array
// DECKS de la galería y lleva noindex; se comparte solo por enlace. Al
// publicarla quedaban abiertos estos cuidados:
//   - el video de Stripe sigue en revisión de Stripe (26/oct): no se publica
//     hasta que lo aprueben;
//   - los nombres de compañeros (Joseph, Emily, Tracee, Aldo) y los de
//     clientes en los tours (Caesars, Sunset Shores, Fairmont, LIV);
//   - los clips de Pexels y la música de Mixkit van dentro del video
//     terminado, que sí se puede publicar; los clips sueltos no.
//
// Los datos salen de UWS-10821 (descripción, comentarios y adjuntos, leídos el
// 26/oct/2026), de UWS-10776 y UWS-10576, y de los renders de walkthrough en
// ~/Movies/walkthrough. Las horas del timeline son las de Jira (hora del
// Pacífico) y por eso no se dicen: solo los días.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Identidad: la del logo de UrVenue y la del propio A3 ─────────────────
// Noche violácea como el video, y el degradado de los corchetes del logo
// (morado #9646D8 → azul #2CBBFF) como único acento.
const BG = '#0A0918';
const NOCHE = '#12102A';
const INK = '#F5F3FF';
const MUTED = '#A7A3C8';
const DIM = '#6F6B93';
const LINE = 'rgba(255,255,255,0.10)';
const PURPLE = '#9646D8';
const BLUE = '#2CBBFF';
const OK = '#3DDC97';
const GRAD = `linear-gradient(110deg, ${PURPLE} 0%, ${BLUE} 100%)`;
const FONT = `'Inter', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`;

const FONDO = kit.fondo(BG,
  kit.grano({ opacidad: 0.035 }),
  kit.lavado({ color: PURPLE, en: '12% 8%', ancho: 62, alto: 58, fuerza: 0.22, alcance: 66 }),
  kit.lavado({ color: BLUE, en: '96% 100%', ancho: 56, alto: 52, fuerza: 0.15, alcance: 62 }));
const textoGrad = `background: ${GRAD}; -webkit-background-clip: text; background-clip: text; color: transparent;`;
const CARD = `background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025)); border: 1px solid ${LINE}; border-radius: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.35);`;

// ── El logo, dibujado ────────────────────────────────────────────────────
// Del SVG oficial (uvcore, urvenuelogo-light.svg). Los corchetes se vuelven
// trazos sobre su línea central (cada brazo arranca en la esquina) y la palabra
// va dos veces: sus contornos sueltos, que se trazan de izquierda a derecha, y
// la ruta compuesta original, que se rellena encima y conserva los huecos de
// las letras. El ® es el de la versión registrada que pidió Joseph.
const LOGO_D = fs.readFileSync(__dirname + '/assets/urvenue-logo.svg', 'utf8').match(/<path d="([^"]+)"/)[1].replace(/\s+/g, ' ');
const SUBRUTAS = LOGO_D.split(/(?=M)/).map((d) => d.trim()).filter(Boolean)
  .map((d) => ({ d, x: parseFloat(d.slice(1)) })).sort((a, b) => a.x - b.x);
let logos = 0;
const logoDibujo = (ancho = 900) => {
  const id = `uvl${++logos}`;
  return `<svg data-logo viewBox="-3 -3 150 48" role="img" aria-label="UrVenue" style="display: block; width: ${ancho}px; height: auto; overflow: visible;">
    <defs>
      <linearGradient id="${id}-a" gradientUnits="userSpaceOnUse" x1="0" y1="20.7" x2="20.7" y2="0"><stop offset="0" stop-color="${PURPLE}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient>
      <linearGradient id="${id}-b" gradientUnits="userSpaceOnUse" x1="141.8" y1="20.7" x2="121.1" y2="41.5"><stop offset="0" stop-color="${PURPLE}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient>
      <filter id="${id}-g" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>
    </defs>
    <g data-brillo-logo opacity="0.55" filter="url(#${id}-g)">
      <path d="M0 1.633H20.6875M1.629 0V20.742" stroke="url(#${id}-a)" stroke-width="3.3" fill="none"/>
      <path d="M141.83 39.851H121.1425M140.2 41.4836V20.7418" stroke="url(#${id}-b)" stroke-width="3.3" fill="none"/>
    </g>
    <g fill="none">
      <path data-brazo d="M0 1.633H20.6875" stroke="url(#${id}-a)" stroke-width="3.266"/>
      <path data-brazo d="M1.629 0V20.742" stroke="url(#${id}-a)" stroke-width="3.2575"/>
      <path data-brazo d="M141.83 39.851H121.1425" stroke="url(#${id}-b)" stroke-width="3.266"/>
      <path data-brazo d="M140.2 41.4836V20.7418" stroke="url(#${id}-b)" stroke-width="3.2575"/>
    </g>
    <g data-trazos fill="none" stroke="${INK}" stroke-width="0.45" stroke-linejoin="round" opacity="0">
      ${SUBRUTAS.map((s) => `<path data-trazo d="${s.d}"/>`).join('')}
    </g>
    <path data-palabra d="${LOGO_D}" fill="${INK}" fill-opacity="1" fill-rule="nonzero"/>
    <text data-registro x="131.3" y="13.6" font-family="Inter, sans-serif" font-size="5.4" font-weight="600" fill="${INK}">®</text>
  </svg>`;
};
const logoChico = (alto = 26) => `<img src="assets/urvenue-logo.svg" alt="UrVenue" style="height: ${alto}px; width: auto; display: block;">`;

// ── Helpers ──────────────────────────────────────────────────────────────
const header = (etiqueta) => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 100px; display: flex; align-items: center; justify-content: space-between; padding: 0 96px; border-bottom: 1px solid ${LINE};">
      <div style="display: flex; align-items: center; gap: 18px;">
        ${logoChico(26)}
        <span style="width: 1px; height: 24px; background: ${LINE};"></span>
        <span style="font: 500 17px/1 ${MONO}; color: ${MUTED};">Video at UrVenue</span>
      </div>
      <span style="font-size: 15px; font-weight: 700; letter-spacing: 2.6px; text-transform: uppercase; ${textoGrad}">${etiqueta}</span>
    </header>`;
const seccion = (extra = '') => `${FONDO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 150px 96px 64px; box-sizing: border-box; overflow: hidden; ${extra}`;
const h2 = (txt, size = 64) => `<h2 data-efecto="lineas" style="margin: 0; font-size: ${size}px; font-weight: 800; letter-spacing: -2px; line-height: 1.05;">${txt}</h2>`;
const bajada = (txt, max = 1300) => `<p data-a="up2" style="margin: 18px 0 0; font-size: 25px; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;
const ceja = (t) => `<span style="font-size: 14px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; ${textoGrad}">${t}</span>`;
const clave = (k) => `<span style="font: 600 15px/1 ${MONO}; color: ${INK}; background: rgba(255,255,255,0.07); border: 1px solid ${LINE}; border-radius: 8px; padding: 7px 10px; white-space: nowrap;">${k}</span>`;
const icono = (id, color = INK, tam = 30) => kit.icono(`tabler:${id}`, { tam, color, trazo: 1.8 });

// Un clip: se hidrata y suena en loop solo en la lámina activa (script al final).
const video = (clip, estilo = '') => `<video data-clip src="assets/clips/${clip}.mp4" poster="assets/clips/${clip}.jpg" muted loop playsinline preload="none" style="display: block; width: 100%; height: 100%; object-fit: cover; ${estilo}"></video>`;
const telefono = (clip, { w = 300, h = 533, extra = '', attrs = '' } = {}) => `
      <div data-tel ${attrs} style="position: relative; width: ${w}px; height: ${h}px; border-radius: 42px; padding: 10px; background: linear-gradient(160deg, #2D2A58, #141230); box-shadow: 0 30px 70px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.10); box-sizing: border-box; flex: none;">
        <div style="position: relative; width: 100%; height: 100%; border-radius: 33px; overflow: hidden; background: #000;">${clip ? video(clip) : ''}${extra}</div>
      </div>`;

const slides = [];

// ── 1 · Portada: el logo se dibuja ───────────────────────────────────────
slides.push(`
  <section data-label="Cover" data-screen-label="01 Cover" style="${seccion('padding: 0; align-items: center; justify-content: center; text-align: center;')}">
    <div data-efecto="brasas" data-en="0.4" data-dur="7" data-n="34" data-color="${PURPLE},${BLUE},#C9B8FF" data-tam="7" data-semilla="uv" style="position: absolute; inset: 0;"></div>
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${logoDibujo(880)}
      <h1 data-portada-titulo style="margin: 76px 0 0; font-size: 92px; font-weight: 800; letter-spacing: -3px; line-height: 1;">More videos, <span style="${textoGrad}">made fast</span></h1>
      <p data-portada-sub style="margin: 26px 0 0; font-size: 28px; color: ${MUTED}; line-height: 1.45;">What the Stripe promo showed, and what we can make next.</p>
    </div>
  </section>`);

// ── 2 · La prueba: el promo de Stripe ────────────────────────────────────
// Joseph vivió la tarea: aquí no se cuenta el proceso, solo lo rápido que fue.
// Las cifras salen de las horas de los comentarios de UWS-10821: brief
// confirmado el 21 en la mañana y las tres direcciones esa tarde; las notas
// regresaron como corte nuevo en 2 h, 1 h y 55 min; aprobado el 26.
const DATOS = [
  ['Same day', 'Three creative directions, the day the brief was confirmed'],
  ['Under 2 h', 'Every round of notes, back as a new cut'],
  ['5 days', 'From confirmed brief to approval'],
];
const MINI = [['sizzle-a', 'A'], ['sizzle-b', 'B'], ['sizzle-c', 'C']];
slides.push(`
  <section data-label="Proof" data-screen-label="02 The Stripe promo" style="${seccion()}">
    ${header('UWS-10821')}
    <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 64px; align-items: center; flex: 1;">
      <div>
        ${ceja('The Stripe promo')}
        <div style="height: 16px;"></div>
        ${h2('Fast, from first draft to approval', 66)}
        <div data-efecto="bento" data-en="0.5" data-desde="start" style="display: flex; flex-direction: column; gap: 16px; margin-top: 40px;">
          ${DATOS.map(([n, t]) => `<div style="${CARD} border-radius: 18px; padding: 20px 26px; display: flex; align-items: center; gap: 26px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: -1.5px; white-space: nowrap; min-width: 190px; ${textoGrad}">${n}</span>
            <span style="font-size: 21px; color: #DAD6F3; line-height: 1.4;">${t}</span></div>`).join('')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div data-tel style="position: relative; width: 384px; height: 682px; border-radius: 48px; padding: 12px; background: linear-gradient(160deg, #2D2A58, #141230); box-shadow: 0 40px 90px rgba(0,0,0,0.6), 0 0 120px ${kit.alpha(PURPLE, 0.35)}, inset 0 0 0 1px rgba(255,255,255,0.10); box-sizing: border-box;">
          <div style="width: 100%; height: 100%; border-radius: 37px; overflow: hidden; background: #000;">
            <video data-final src="assets/a3-final.mp4" poster="assets/a3-final.jpg" controls playsinline preload="none" style="display: block; width: 100%; height: 100%; object-fit: cover;"></video>
          </div>
        </div>
        <span data-a="up3" style="font-size: 17px; color: ${DIM};">The final cut · click to play with sound</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
        <span data-a="up2" style="font-size: 14px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: ${MUTED};">First drafts</span>
        ${MINI.map(([c, l]) => `<div data-mini style="display: flex; align-items: center; gap: 12px;">${telefono(c, { w: 118, h: 210 })}<span style="font: 700 20px/1 ${MONO}; color: ${MUTED}; width: 18px;">${l}</span></div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 3 · Ejemplos de otros formatos ───────────────────────────────────────
const FORMATOS = [
  ['promo-loop', true, 'Promo', 'A launch, in under 30 seconds', 'UWS-10821'],
  ['instructivo', false, 'Instructional', 'A branded how-to for guests', 'UWS-10776'],
  ['explicativo', false, 'Product explainer', 'What a product is, narrated', 'UWS-10576'],
  ['tour', false, 'Site tour', 'A guided walk through a site', 'Sunset Shores'],
  ['antes-despues', false, 'Before & after', 'The old next to the new', 'Guest Portal'],
  ['mapa-3d', false, 'Feature demo', 'One feature, up close', 'UWS-10771'],
];
slides.push(`
  <section data-label="Formats" data-screen-label="03 Formats" style="${seccion('padding-bottom: 56px;')}">
    ${header('Examples')}
    ${h2('Same speed, any format')}
    ${bajada('Real pieces we already made with the same tools.')}
    <div data-efecto="bento" data-en="0.4" data-desde="start" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; margin-top: 34px;">
      ${FORMATOS.map(([c, vertical, t, s, k]) => `<div style="${CARD} overflow: hidden; padding: 0;">
        <div style="position: relative; height: 236px; background: ${NOCHE}; overflow: hidden;">
          ${vertical ? `<div style="position: absolute; inset: 0; filter: blur(22px) brightness(0.55); transform: scale(1.2);">${video(c)}</div><div style="position: relative; height: 100%; display: flex; justify-content: center;"><div style="height: 100%; aspect-ratio: 9 / 16;">${video(c)}</div></div>` : video(c)}
        </div>
        <div style="padding: 20px 26px 22px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
          <div><div style="font-size: 25px; font-weight: 700;">${t}</div><div style="font-size: 18px; color: ${MUTED}; margin-top: 6px;">${s}</div></div>
          ${clave(k)}
        </div></div>`).join('')}
    </div>
  </section>`);

// ── 4 · Cierre ───────────────────────────────────────────────────────────
const PEDIR = [
  ['target-arrow', 'The goal', 'Announce, teach, show or compare'],
  ['users', 'Who it’s for', 'Social, clients, guests or the team'],
  ['calendar-event', 'The date', 'When it has to be approved'],
];
slides.push(`
  <section data-label="Close" data-screen-label="04 Close" style="${seccion()}">
    ${header("What's next")}
    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 90px; align-items: center; flex: 1;">
      <div>
        <div data-a="up" style="margin-bottom: 48px;">${logoDibujo(520)}</div>
        ${h2('What should we<br>make next?', 86)}
        ${bajada('Send me three things and I’ll come back with first options.', 700)}
      </div>
      <div data-efecto="bento" data-en="0.6" data-desde="start" style="display: flex; flex-direction: column; gap: 18px;">
        ${PEDIR.map(([ic, t, s], i) => `<div style="${CARD} border-radius: 20px; padding: 26px 30px; display: flex; align-items: center; gap: 24px;">
          <span style="font: 700 20px/1 ${MONO}; color: ${DIM}; width: 24px;">${i + 1}</span>
          <span style="width: 60px; height: 60px; border-radius: 16px; background: ${kit.alpha(BLUE, 0.15)}; display: flex; align-items: center; justify-content: center; flex: none;">${icono(ic, '#A6E3FF', 30)}</span>
          <div><div style="font-size: 27px; font-weight: 700;">${t}</div><div style="font-size: 20px; color: ${MUTED}; margin-top: 5px;">${s}</div></div></div>`).join('')}
        <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px; font-size: 19px; color: ${MUTED};">${clave('Jira')}<span>New request with the <strong style="color: ${INK};">Video</strong> label</span></div>
      </div>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Video at UrVenue</title>
<meta name="robots" content="noindex, nofollow">
${kit.og({ titulo: 'Video at UrVenue', descripcion: 'More videos, made fast: the Stripe promo and the other formats we can make next.', carpeta: 'work/urvenue-video' })}
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${kit.alpha(BLUE, 0.45)}; border-radius: 999px;
    background: rgba(10,9,24,0.85); color: ${INK}; cursor: pointer;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px; opacity: 0.55; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1920" height="1080">
${slides.join('\n')}
</deck-stage>
${kit.gsap(__dirname, ['SplitText', 'DrawSVG', 'CustomEase'])}
${kit.efectos()}
${kit.animador()}
<script>
// ── Clips: solo suenan en la lámina activa ───────────────────────────────
// deck-stage solo hidrata <img>; los <video> diferidos (data-src) se hidratan
// aquí al llegar a su lámina, y los de las demás se pausan.
(function () {
  var ds = document.querySelector('deck-stage');
  function sync() {
    var activa = document.querySelector('deck-stage > section[data-deck-active]');
    document.querySelectorAll('deck-stage > section video').forEach(function (v) {
      if (v.closest('section') === activa) {
        if (v.dataset.src && !v.getAttribute('src')) v.src = v.dataset.src;
        if (v.hasAttribute('data-clip')) v.play().catch(function () {});
      } else if (!v.paused) v.pause();
    });
  }
  ds.addEventListener('slidechange', function () { setTimeout(sync, 0); });
  window.addEventListener('load', function () { setTimeout(sync, 200); });
})();
</script>
<script>
// ── Coreografía ──────────────────────────────────────────────────────────
// Todo con from() o con estados finales iguales al HTML: sin JS el deck se ve
// completo. La pieza es el logo de la portada, que se dibuja.
(function () {
  if (!window.animar || !window.gsap) return;
  function cabecera(tl, s) { var h = s.querySelector('header'); if (h) tl.from(h, { y: -20, opacity: 0, duration: 0.6, ease: 'entrada' }, 0); }
  function logo(tl, svg, en) {
    var brazos = svg.querySelectorAll('[data-brazo]'), trazos = svg.querySelectorAll('[data-trazo]');
    tl.from(brazos, { drawSVG: '0%', duration: 0.8, ease: 'entrada', stagger: 0.12 }, en);
    tl.from(svg.querySelector('[data-brillo-logo]'), { opacity: 0, duration: 1.2, ease: 'deriva' }, en + 0.3);
    tl.fromTo(svg.querySelector('[data-trazos]'), { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'salida', immediateRender: true }, en + 2.4);
    tl.from(trazos, { drawSVG: '0%', duration: 0.9, ease: 'power1.inOut', stagger: 0.11 }, en + 0.45);
    tl.from(svg.querySelector('[data-palabra]'), { attr: { 'fill-opacity': 0 }, duration: 0.7, ease: 'deriva' }, en + 1.9);
    tl.from(svg.querySelector('[data-registro]'), { opacity: 0, scale: 2.2, transformOrigin: '50% 50%', duration: 0.45, ease: 'golpe' }, en + 2.5);
  }
  animar('Cover', function (tl, s) {
    logo(tl, s.querySelector('[data-logo]'), 0.15);
    efecto('lineas', tl, s.querySelector('[data-portada-titulo]'), { en: 2.5 });
    tl.from(s.querySelector('[data-portada-sub]'), { y: 24, opacity: 0, duration: 0.7, ease: 'entrada' }, 2.9);
    tl.from(s.querySelector('[data-portada-pie]'), { opacity: 0, duration: 0.8 }, 3.2);
    efectosDeclarados(tl, s);
  });
  animar('Proof', function (tl, s) {
    cabecera(tl, s);
    efectosDeclarados(tl, s);
    tl.from(s.querySelector('[data-tel]'), { y: 80, rotation: -4, opacity: 0, duration: 1, ease: 'asentar' }, 0.35);
    tl.from(s.querySelectorAll('[data-mini]'), { x: 60, opacity: 0, duration: 0.6, ease: 'entrada', stagger: 0.12 }, 0.7);
  });
  animar('Close', function (tl, s) {
    cabecera(tl, s);
    efectosDeclarados(tl, s);
    logo(tl, s.querySelector('[data-logo]'), 0.2);
  });
})();
</script>
<script>
(function () {
  var on = false, btn = document.createElement('button');
  btn.id = 'modo-presentacion'; btn.type = 'button';
  function pinta() { btn.textContent = on ? 'Exit · Esc' : 'Present · P'; if (on) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on'); }
  function poner(v) {
    if (v === on) return; on = v;
    window.postMessage({ __omelette_presenting: v }, '*');
    if (v) { if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); }
    else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    pinta();
  }
  btn.addEventListener('click', function () { poner(!on); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') { poner(!on); e.preventDefault(); }
    else if (e.key === 'Escape' && on && !document.fullscreenElement) poner(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && on) poner(false); });
  pinta(); document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
