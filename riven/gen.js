// Generador de index.html — Riven cumple 15 años (screenshots para TikTok)
// Ejecutar: node riven/gen.js
//
// Serie «Cumplelolero» #11, animado. **Corte pedido: cuatro láminas.** El guion
// tiene un bloque de lore largo (la traición de Emystan, las armas químicas, la
// adopción en Ionia) y otro de datos sueltos, pero este deck se queda solo con
// portada, el one trick, las skins y la felicitación: el lore va narrado sobre
// la portada y no necesita apoyo visual propio.
//
// Piezas de diseño:
//  · La lámina del OTP es la del video. Rompe dos récords de la serie —puntos y
//    nivel de maestría— y aun así está en Platino, así que la estructura sube y
//    baja: los dos récords arriba, el rango debajo en gris, y de remate la barra
//    de 997 victorias contra 998 derrotas creciendo desde la costura central.
//    Las dos mitades son visualmente idénticas a propósito: ese es el chiste.
//  · La rejilla de skins marca la última (Emboscada Primigenia, enero 2024) con
//    el acento, porque de ahí arranca la sequía que sigue corriendo.
//  · Motivo recurrente: las esquirlas de la Espada Rúnica (`esquirlas()`), que
//    entran girando y se acomodan. Rota es lo que la define.
//
// ⚠️ El guion narra «siete días y medio de salario mínimo» y la investigación
// calcula 7,4. En pantalla va el 7,4 (el número de la tabla); la voz redondea.
//
// Paleta muestreada del splash original: el fondo son ruinas cálidas (hue 15–30,
// arenisca) y el único color frío de la imagen es el verde rúnico de la espada.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Riven: ruinas cálidas y el verde de la espada ─────────────────
const BG = '#0D0A08';        // polvo de Noxus al anochecer
const RUNA = '#3FDE6A';      // verde rúnico de la Espada Rúnica — acento
const ARENA = '#D9B489';     // arenisca de las ruinas — estructura y dinero
const NOXUS = '#C43A4A';     // carmesí — las derrotas y la sequía
const BONE = '#F1ECE4';      // texto principal
const MUTED = '#9A8E82';     // texto secundario
const PANEL = '#191310';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = RUNA, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash
// (helper estrenado en missfortune). La capa borrosa sangra fuera del marco, de
// ahí el contenedor con overflow oculto: si no, infla scrollHeight y el QA
// marca un desborde falso.
const portada = (src, alt, posNitida = 'center 30%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(46px) saturate(0.85) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 760px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,10,8,0.18) 0%, rgba(13,10,8,0.42) 34%, rgba(13,10,8,0.92) 66%, rgba(13,10,8,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = RUNA) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// Las esquirlas de la Espada Rúnica: el motivo del personaje.
// [ancho relativo, alto relativo, recorte, giro] — tres trozos distintos, no
// tres copias: una hoja no se parte en piezas iguales.
const CORTES = [
  [0.46, 1.00, 'polygon(54% 0%, 100% 36%, 60% 100%, 0% 56%)', -15],
  [0.60, 1.52, 'polygon(30% 0%, 100% 20%, 76% 100%, 10% 64%, 0% 26%)', 7],
  [0.38, 0.76, 'polygon(68% 0%, 100% 60%, 32% 100%, 0% 24%)', 21],
];

const esquirlas = (tam = 62, gap = 26) => `
      <div data-esquirlas style="display: flex; align-items: center; gap: ${gap}px;">
        ${CORTES.map(([w, h, corte, giro]) => `
        <span data-esquirla style="display: block; width: ${Math.round(tam * w)}px; height: ${Math.round(tam * h)}px; transform: rotate(${giro}deg); clip-path: ${corte}; background: linear-gradient(150deg, #FFFFFF 0%, ${RUNA} 44%, #10693D 100%); filter: drop-shadow(0 0 ${Math.round(tam * 0.55)}px ${RUNA}A6);"></span>`).join('')}
      </div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Y ahi les va algo que no deberian de saber. Hoy es cumpleanos de Riven, que lleva quince anos desde que llego a la Grieta del Invocador, y toca darle sus tres minutos de atencion para que los otepes de esta mierda me den su apoyo incondicional." style="${seccion()}">
    ${portada('Riven_0.jpg', 'Riven, la Exiliada')}
    ${glow(ARENA, '46% 26%', '120% 42%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · 11 sep 2011 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 196px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 0 90px rgba(63,222,106,0.35);"><span data-linea style="display: block;">RIVEN</span><span data-linea style="display: block; color: ${RUNA};">15 AÑOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${RUNA}; line-height: 1.3;">La Exiliada</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Toplane · Luchadora · Noxus · <strong style="color: ${ARENA};">nunca ha tenido rework</strong></p>
      <div data-sub style="margin-top: 40px;">${esquirlas(96, 34)}</div>
    </div>
  </section>`);

// ── 2 · El one trick que rompió dos récords de la serie ──────────────────
// La lámina del video: dos récords arriba, el rango debajo en gris, y la barra
// de 997–998 de remate. Las dos mitades salen idénticas a propósito.
slides.push(`
  <section data-label="El one trick" data-screen-label="02 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos, y este rompio todos los records que llevabamos. Es un norteamericano con dieciocho millones doscientos mil puntos y nivel de maestria mil quinientos cuarenta y cinco. Los dos son lo mas alto de toda la serie. Y esta en Platino tres. Pero eso no es lo bueno. Lo bueno es que este cabron lleva novecientas noventa y siete victorias y novecientas noventa y ocho derrotas esta temporada. Casi dos mil partidas para quedar con una derrota mas que victorias. Cincuenta por ciento exacto. Ah, y nomas en los ultimos siete dias se echo setenta y dos partidas de Riven. Mas de diez diarias." style="${seccion()}">
    ${glow(RUNA, '50% 34%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y este rompió todos los récords')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${BONE};">SECILLIA</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${RUNA};">#SECI</span>
      </div>
      <p data-nombre style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Norteamérica · nivel de invocador 1 740 · 91% toplane · 86% luchador</p>

      <div style="margin-top: 32px; display: flex; gap: 20px;">
        ${[['Puntos de maestría', '18240460', '18 240 460'], ['Nivel de maestría', '1545', '1 545']].map(([que, valor, texto]) => `
        <div data-record style="flex: 1; min-width: 0; padding: 26px 26px 24px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid ${RUNA}47;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">${que}</span>
            <span style="flex: none; background: ${RUNA}; color: ${BG}; font-size: 16px; font-weight: 800; border-radius: 6px; padding: 4px 9px; letter-spacing: 1px;">RÉCORD</span>
          </div>
          <div data-cuenta="${valor}" style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 76px; line-height: 0.95; color: ${RUNA};">${texto}</div>
          <div style="margin-top: 2px; font-size: 21px; font-weight: 600; color: ${MUTED};">lo más alto de toda la serie</div>
        </div>`).join('')}
      </div>

      <div data-rango style="margin-top: 20px; display: flex; align-items: center; gap: 22px; padding: 20px 26px; border-radius: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09);">
        <img src="assets/emblems/platinum.png" alt="Platino" style="width: 76px; height: 76px; object-fit: contain; flex: none;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${NOXUS};">PLATINO 3 · 50 LP</div>
          <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">rango actual · top 25% de Norteamérica</div>
        </div>
        <div style="width: 2px; height: 62px; background: rgba(255,255,255,0.12); margin-left: auto;"></div>
        <div style="flex: none; text-align: right;">
          <div style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1.05; color: ${MUTED};">Esmeralda 4</div>
          <div style="font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">su pico de temporada</div>
        </div>
      </div>

      <div data-wr style="margin-top: 26px; padding: 30px 32px 28px; border-radius: 22px; background: ${RUNA}12; border: 1px solid ${RUNA}59;">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
          <div>
            <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.9; color: ${RUNA};">997</div>
            <div style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">victorias</div>
          </div>
          <div style="text-align: center; padding-bottom: 6px;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${BONE};">50 % exacto</div>
            <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">1 989 partidas</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.9; color: ${NOXUS};">998</div>
            <div style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">derrotas</div>
          </div>
        </div>
        <div style="margin-top: 18px; display: flex; height: 32px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.05);">
          <div data-barra-v style="flex: 997 0 0; background: ${RUNA};"></div>
          <div style="flex: none; width: 4px; background: ${BONE};"></div>
          <div data-barra-d style="flex: 998 0 0; background: ${NOXUS};"></div>
        </div>
        <div data-wr-nota style="margin-top: 18px; font-size: 27px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Casi dos mil partidas esta temporada para quedar con <strong style="color: ${BONE};">una derrota más que victorias</strong>.</div>
      </div>

      <div data-ritmo style="margin-top: 22px; display: flex; align-items: center; gap: 26px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 74px; line-height: 0.9; color: ${ARENA};">72 partidas</div>
          <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">en los últimos 7 días</div>
        </div>
        <div style="width: 2px; height: 64px; background: ${ARENA}4D;"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Más de <strong style="color: ${BONE};">diez diarias</strong>, solo de Riven.</div>
      </div>
    </div>
  </section>`);

// ── 3 · Las skins y la sequía que sigue corriendo ────────────────────────
// La última (Emboscada Primigenia) va marcada con el acento: de ahí arranca el
// hueco que el video cuenta como abierto.
const skins = [
  ['Riven_1.jpg', 'Redimida', false],
  ['Riven_2.jpg', 'Élite Carmesí', false],
  ['Riven_3.jpg', 'Conejita Guerrera', false],
  ['Riven_6.jpg', 'de Arcadia', false],
  ['Riven_16.jpg', 'Portadora del Amanecer', false],
  ['Riven_18.jpg', 'Pulso de Fuego', false],
  ['Riven_20.jpg', 'Espada Valiente', false],
  ['Riven_23.jpg', 'Flor Espiritual', false],
  ['Riven_34.jpg', 'Centinela', false],
  ['Riven_44.jpg', 'Conejita Suprema', false],
  ['Riven_55.jpg', 'Pacto Quebrantado', false],
  ['Riven_63.jpg', 'Emboscada Primigenia', true],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="03 · Las skins" data-speaker-notes="Y de skins tiene diecisiete y doce que puedes comprar, que te saldrian en unos ciento veinte dolares, siete dias y medio de salario minimo. La segunda mas cara de la serie. Pero wachen el detalle. Su ultima skin salio en enero de dos mil veinticuatro. Van dos anos y ocho meses sin que Riot le saque nada, y esa sequia sigue corriendo ahorita mismo." style="${seccion()}">
    ${glow(ARENA, '50% 34%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('17 skins, y <span style="color: ' + RUNA + ';">12 a la venta</span>', 90)}

      <div style="margin-top: 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;">
        ${skins.map(([img, nombre, ultima]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 7px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 120px; object-fit: cover; object-position: center 22%; border-radius: 10px; border: 1px solid ${ultima ? RUNA + 'CC' : 'rgba(217,180,137,0.24)'};">
            <span style="font-size: 18px; font-weight: 600; color: ${ultima ? RUNA : MUTED}; line-height: 1.15;">${nombre}</span>
          </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 28px; display: flex; align-items: center; gap: 30px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 96px; line-height: 0.86; color: ${ARENA};">~<span data-cuenta="120">120</span> <span style="font-size: 52px;">USD</span></div>
          <div style="font-size: 21px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las doce · 15 560 RP · 7,4 días de salario</div>
        </div>
        <div style="width: 2px; height: 76px; background: ${ARENA}4D;"></div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;"><strong style="color: ${BONE};">La segunda más cara de la serie</strong>, solo detrás de Miss Fortune con 8,9.</div>
      </div>

      <div data-sequia style="margin-top: 26px; display: flex; align-items: center; gap: 28px; padding: 26px 30px; border-radius: 20px; background: ${NOXUS}1A; border: 1px solid ${NOXUS}80;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 72px; line-height: 0.92; color: ${NOXUS};">2 años<br>8 meses</div>
        </div>
        <div style="width: 2px; height: 92px; background: ${NOXUS}59;"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Su última skin salió en <strong style="color: ${BONE};">enero de 2024</strong>. Y esta sequía <strong style="color: ${NOXUS};">sigue corriendo ahorita mismo</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 4 · Cierre ───────────────────────────────────────────────────────────
// Se cierra con Emboscada Primigenia: es justo la última que Riot le dio, la
// que abre la sequía de la lámina anterior.
slides.push(`
  <section data-label="Cierre" data-screen-label="04 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('Riven_63.jpg', 'Riven Emboscada Primigenia', 'center 22%')}
    ${glow(ARENA, '50% 40%', '120% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Quince años de la Exiliada')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${RUNA};">Riven</span></h2>
      <div style="margin-top: 40px;">${esquirlas(100, 38)}</div>
      <div data-gigi style="margin-top: 46px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${NOXUS};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  function cuentaMil(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.05, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  // Las esquirlas siempre entran igual: llegan girando desde fuera y se
  // acomodan. Es el motivo del personaje, conviene que se reconozca.
  function filos(tl, s, pos) {
    var e = q(s, '[data-esquirla]');
    if (e.length) tl.from(e, { y: 34, rotation: -46, scale: 0.4, opacity: 0, duration: 0.62, stagger: 0.1, ease: 'back.out(2.2)' }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.66);
    filos(tl, s, 0.94);
  });

  // El OTP: los dos récords primero con sus contadores, el rango cae en gris
  // después (el anticlímax necesita su propio tiempo), y al final las dos
  // barras crecen desde la costura central a la vez — idénticas, que es el
  // dato. La nota llega cuando ya se vio que miden lo mismo.
  animar('El one trick', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.08)
      .from(q(s, '[data-record]'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.14 }, 0.26)
      .from(s.querySelector('[data-rango]'), { x: -30, opacity: 0, duration: 0.52 }, 0.66)
      .from(s.querySelector('[data-wr]'), { y: 28, opacity: 0, duration: 0.52 }, 0.86)
      .from(s.querySelector('[data-barra-v]'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.55, ease: 'power2.inOut' }, 1.02)
      .from(s.querySelector('[data-barra-d]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.55, ease: 'power2.inOut' }, 1.02)
      .from(s.querySelector('[data-wr-nota]'), { y: 18, opacity: 0, duration: 0.44 }, 1.32)
      .from(s.querySelector('[data-ritmo]'), { y: 24, opacity: 0, duration: 0.46 }, 1.34);
    var c = q(s, '[data-cuenta]');
    cuentaMil(tl, c[0], 0.4, 0.95);
    cuentaMil(tl, c[1], 0.54, 0.8);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 24, opacity: 0, scale: 0.94, duration: 0.44, stagger: 0.05 }, 0.24)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.55 }, 0.96)
      .from(s.querySelector('[data-sequia]'), { x: 30, opacity: 0, duration: 0.6 }, 1.18);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.96, 0.7);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.24)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.9);
    filos(tl, s, 0.7);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Riven cumple 15 años</title>
${kit.og({ titulo: "Riven cumple 15 años", descripcion: "Quince años de la Exiliada: el one trick con más puntos de toda la serie está en Platino con 997 victorias y 998 derrotas, y Riot lleva dos años y ocho meses sin sacarle skin. Apoyo visual para TikTok.", carpeta: "riven" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(63,222,106,0.45); border-radius: 999px;
    background: rgba(13,10,8,0.85); color: ${RUNA}; cursor: pointer;
    font: 600 13px/1 ${BODY}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides.join('\n')}
</deck-stage>
<script src="./gsap.min.js"></script>
${kit.animador()}
${coreografias}
<script>
(function () {
  var presenting = false;
  var btn = document.createElement('button');
  btn.id = 'modo-presentacion';
  btn.type = 'button';
  function render() {
    btn.textContent = presenting ? 'Salir · Esc' : 'Presentar · P';
    if (presenting) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on');
  }
  function setPresenting(on) {
    if (on === presenting) return;
    presenting = on;
    window.postMessage({ __omelette_presenting: on }, '*');
    if (on) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    render();
  }
  btn.addEventListener('click', function () { setPresenting(!presenting); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') { setPresenting(!presenting); e.preventDefault(); }
    else if (e.key === 'Escape' && presenting && !document.fullscreenElement) setPresenting(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && presenting) setPresenting(false); });
  render();
  document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

// kit.diferir: todo lo que no sea la portada sale con data-src/data-bg, para
// que al entrar el navegador solo descargue los assets de la primera lámina.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
