// Generador de index.html — Azir cumple 12 años (screenshots para TikTok)
// Ejecutar: node azir/gen.js
//
// Serie «Cumplelolero» #14, animado. **Corte pedido: cuatro láminas y nada de
// lore** — portada, el one trick con sus puntos y su historial de rangos, las
// skins en un bento de máximo tres por fila, y la felicitación. El lore del
// guion (Xerath, el nombre, la Ascensión) se narra encima de la portada.
//
// Fecha: el parche 4.16 salió el 10 de septiembre de 2014 pero Azir se pudo
// jugar hasta el 16, y así lo dan Riot y Liquipedia: **hoy sí es su cumpleaños**.
//
// Piezas de diseño:
//  · El 98,8% del one trick va como **rejilla de cien casillas con una sola
//    apagada**: de cada cien partidas, noventa y nueve son Azir. La casilla gris
//    es el dato — las doce partidas que le quedaron en el año para todo lo demás.
//  · El historial es una **línea que baja** de Master (2023) a Esmeralda 1. Los
//    puntos intermedios van con su rango pero **sin etiqueta de temporada**: la
//    investigación da la secuencia (D2 → D4 → D4 → E3 → E1) pero no a qué split
//    corresponde cada uno, y no se inventa. El último tramo sube un poco (E3 →
//    E1) y se dibuja así: el guion dice «va de bajada» por el total, no por el
//    último escalón.
//  · El bento de skins pone **la de SKT T1 en grande** porque es la historia de
//    la lámina: no es de Faker, la eligió Easyhoon. Lleva de testigo el Ryze de
//    SKT, que es el que sí eligió Faker.
//  · El motivo es **el disco solar de Shurima** (`disco()`), dibujado.
//
// ⚠️ El guion dice «dos días y medio de salario mínimo» y la investigación
// calcula **2,4**: en pantalla va el 2,4, la voz redondea (igual que en riven).
//
// Paleta muestreada del splash: todo es arena y oro (hue 20–40) con óxido. El
// lapislázuli no está en el splash: es el azul de Shurima, y es lo que separa
// este oro del de caras, talon y lowelo — ninguno lo empareja con azul real.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Azir: el disco solar, el lapislázuli y la caída ───────────────
const BG = '#0F0B06';        // la tumba bajo la arena
const SOL = '#EFAE3A';       // el disco solar — acento
const LAPIS = '#5B8DEF';     // lapislázuli de Shurima — datos y estructura
const OCASO = '#C8683F';     // óxido del splash — la caída y la bóveda
const BONE = '#F3EDE2';      // texto principal
const MUTED = '#948773';     // texto secundario
const PANEL = '#1A140C';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = SOL, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash
// (helper de missfortune). La capa borrosa sangra fuera del marco, de ahí el
// contenedor con overflow oculto: si no, infla scrollHeight.
const portada = (src, alt, posNitida = 'center 24%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 800px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,6,0.14) 0%, rgba(15,11,6,0.38) 34%, rgba(15,11,6,0.92) 64%, rgba(15,11,6,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = SOL) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(15,11,6,0.9);">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// ── El disco solar: el motivo del deck ───────────────────────────────────
// Doce rayos alternos largos y cortos, un anillo y el disco. Los rayos llevan
// data-rayo para que la coreografía los encienda desde el centro.
const disco = (tam = 120, color = SOL) => {
  const rayos = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    const largo = i % 2 === 0 ? 48 : 41;
    const ancho = 6.2 * Math.PI / 180;
    const p = (r, d) => `${(50 + r * Math.cos(a + d)).toFixed(2)} ${(50 + r * Math.sin(a + d)).toFixed(2)}`;
    return `<path data-rayo d="M${p(31, -ancho)} L${p(largo, 0)} L${p(31, ancho)} Z" fill="${color}"/>`;
  }).join('');
  return `<svg data-disco viewBox="0 0 100 100" width="${tam}" height="${tam}" style="flex: none; display: block; overflow: visible; filter: drop-shadow(0 0 ${Math.round(tam * 0.22)}px ${color}80);" aria-hidden="true">
      ${rayos}
      <circle cx="50" cy="50" r="27" fill="none" stroke="${color}" stroke-width="3.2"/>
      <circle data-nucleo cx="50" cy="50" r="18" fill="${color}"/>
    </svg>`;
};

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy cumple doce anos Azir y este cabron es un pick favorito en el competitivo, pero en rankeds al chile es raro ver uno bueno, asi que si eres plata mejor ni lo juegues. (Aqui corre el lore narrado: el nombre de Xerath, la promesa y la Ascension.)" style="${seccion()}">
    ${portada('Azir_0.jpg', 'Azir, el Emperador de las Arenas', 'center 18%')}
    ${glow(SOL, '44% 24%', '120% 44%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · 16 sep 2014 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 204px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(15,11,6,0.85);"><span data-linea style="display: block;">AZIR</span><span data-linea style="display: block; color: ${SOL};">12 AÑOS</span></h1>
      <p data-sub style="margin: 30px 0 0; font-size: 38px; font-weight: 500; color: ${LAPIS}; line-height: 1.3;">El Emperador de las Arenas</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Favorito del competitivo, <strong style="color: ${BONE};">rarísimo ver uno bueno en ranked</strong></p>
      <div data-sub style="margin-top: 36px; display: flex; align-items: center; gap: 22px;">
        ${disco(92)}
        <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Mid · Shurima · nunca ha tenido rework</span>
      </div>
    </div>
  </section>`);

// ── 2 · El one trick: los puntos, el 98,8% y la caída ────────────────────
// Rejilla de cien casillas con una sola apagada, y la línea del historial.
// Escala de LP: cada división vale 100 (Esmeralda 4 = 2000 … Master = 2800).
const historial = [
  ['Master', 2800, '2023'],
  ['Diamante 2', 2600, ''],
  ['Diamante 4', 2400, ''],
  ['Diamante 4', 2400, ''],
  ['Esmeralda 3', 2100, ''],
  ['Esmeralda 1', 2300, 'HOY'],
];
// SVG en píxeles reales: con un viewBox normalizado y preserveAspectRatio=none
// el trazo sale con huecos (ver «Trazos SVG» en CLAUDE.md).
const GW = 912, GH = 250, PADX = 64, PADY = 34;
const MIN_LP = 2000, MAX_LP = 2850;
const gx = i => PADX + i * (GW - 2 * PADX) / (historial.length - 1);
const gy = lp => PADY + (MAX_LP - lp) * (GH - 2 * PADY) / (MAX_LP - MIN_LP);
const puntosLinea = historial.map(([, lp], i) => `${gx(i).toFixed(1)},${gy(lp).toFixed(1)}`).join(' ');

slides.push(`
  <section data-label="El one trick" data-screen-label="02 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos y aqui les compruebo lo que les dije al principio. Es un europeo con once millones de puntos y de sus mil once partidas de esta temporada novecientas noventa y nueve son con Azir. El noventa y ocho punto ocho por ciento. Le quedaron doce partidas en todo el ano para todo lo demas. Y con todo y eso llego a Master en dos mil veintitres y hoy anda en Esmeralda uno. Va de bajada con once millones de puntos encima." style="${seccion()}">
    ${glow(SOL, '50% 30%', '118% 50%')}
    <div style="position: relative;">
      ${eyebrow('El one trick más puro de la serie')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 18px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 84px; line-height: 0.95; color: ${BONE};">XKILLERAZIR</span>
        <span style="font-family: ${DISPLAY}; font-size: 84px; line-height: 0.95; color: ${SOL};">#9980</span>
      </div>
      <p data-nombre style="margin: 8px 0 0; font-size: 26px; font-weight: 500; color: ${MUTED};">Europa Oeste · nivel de invocador 1 054 · 99% mago</p>

      <div data-cifra style="margin-top: 20px;">
        <div data-cuenta="11215245" style="font-family: ${DISPLAY}; font-size: 128px; line-height: 0.86; color: ${SOL};">11 215 245</div>
        <div style="margin-top: 2px; font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div style="margin-top: 26px; display: flex; align-items: center; gap: 30px;">
        <div data-waffle style="flex: none; display: grid; grid-template-columns: repeat(10, 22px); gap: 5px;">
          ${Array.from({ length: 100 }, (_, i) => `<span data-casilla${i === 99 ? '="otra"' : ''} style="display: block; width: 22px; height: 22px; border-radius: 4px; ${i === 99 ? `background: transparent; box-shadow: inset 0 0 0 3px ${LAPIS};` : `background: ${SOL};`}"></span>`).join('')}
        </div>
        <div data-pct style="flex: 1; min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${SOL};">98,8 %</div>
          <div style="margin-top: 4px; font-size: 26px; font-weight: 500; color: ${BONE}; line-height: 1.3;">999 de 1 011 partidas<br>de la temporada</div>
          <div style="margin-top: 10px; font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">La casilla vacía: <strong style="color: ${LAPIS};">12 partidas en todo el año</strong> para todo lo demás.</div>
        </div>
      </div>

      <div data-caida style="margin-top: 26px; padding: 20px 0 6px; border-top: 1px solid rgba(255,255,255,0.08);">
        <div style="display: flex; align-items: baseline; justify-content: space-between;">
          <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${OCASO};">Y va de bajada</span>
          <span style="font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">con 11 millones encima</span>
        </div>
        <svg data-grafica viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" style="display: block; width: 100%; height: auto; margin-top: 4px; overflow: visible;" aria-hidden="true">
          <polyline data-linea-caida points="${puntosLinea}" fill="none" stroke="${OCASO}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
          ${historial.map(([nombre, lp, etiqueta], i) => {
            const x = gx(i), y = gy(lp), extremo = i === 0 || i === historial.length - 1;
            return `<g data-nodo>
              <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${extremo ? 11 : 8}" fill="${i === 0 ? SOL : extremo ? OCASO : BG}" stroke="${i === 0 ? SOL : OCASO}" stroke-width="4"/>
              <text x="${x.toFixed(1)}" y="${(i > 0 && i < historial.length - 1 && lp < historial[i - 1][1] && lp < historial[i + 1][1] ? y + 34 : y - 20).toFixed(1)}" text-anchor="middle" font-family="Barlow, sans-serif" font-size="19" font-weight="700" fill="${extremo ? BONE : MUTED}">${nombre}</text>
              ${etiqueta ? `<text x="${x.toFixed(1)}" y="${GH - 2}" text-anchor="middle" font-family="Barlow, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="${i === 0 ? SOL : OCASO}">${etiqueta}</text>` : ''}
            </g>`;
          }).join('')}
        </svg>
      </div>
    </div>
  </section>`);

// ── 3 · Las skins, en bento ──────────────────────────────────────────────
// Rejilla de tres columnas. La de SKT T1 ocupa dos porque es la historia:
// no es de Faker, la eligió Easyhoon. Las de bóveda llevan su sello.
const tile = (img, nombre, pie, { span = 1, alto = 200, boveda = false, pos = 'center 22%', extra = '' } = {}) => `
        <div data-tile style="grid-column: span ${span}; position: relative; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${boveda ? OCASO + '80' : 'rgba(239,174,58,0.30)'};">
          <img src="assets/${img}" alt="Azir ${nombre}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block; ${boveda ? 'filter: saturate(0.55) brightness(0.8);' : ''}">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,6,0) 42%, rgba(15,11,6,0.92) 100%);"></div>
          ${boveda ? `<span style="position: absolute; top: 12px; right: 12px; background: ${OCASO}; color: ${BG}; font-size: 15px; font-weight: 800; letter-spacing: 1.5px; border-radius: 6px; padding: 5px 10px;">BÓVEDA</span>` : ''}
          ${extra}
          <div style="position: absolute; left: 16px; right: 16px; bottom: 12px;">
            <div style="font-family: ${DISPLAY}; font-size: ${span > 1 ? 50 : 32}px; line-height: 1; color: ${BONE};">${nombre}</div>
            <div style="margin-top: 3px; font-size: ${span > 1 ? 21 : 17}px; font-weight: 600; color: ${boveda ? OCASO : SOL};">${pie}</div>
          </div>
        </div>`;

const rivalFaker = `
          <div data-testigo style="position: absolute; top: 14px; left: 14px; width: 230px; border-radius: 12px; overflow: hidden; border: 2px solid ${LAPIS}; box-shadow: 0 8px 26px rgba(0,0,0,0.6);">
            <img src="assets/Ryze_10.jpg" alt="Ryze SKT T1" style="width: 100%; height: 112px; object-fit: cover; object-position: center 20%; display: block;">
            <div style="padding: 7px 12px; background: ${BG}E6; font-size: 20px; font-weight: 700; color: ${LAPIS}; line-height: 1.2;">Faker escogió Ryze</div>
          </div>`;

slides.push(`
  <section data-label="Las skins" data-screen-label="03 · Las skins" data-speaker-notes="Y de skins tiene ocho pero nada mas cuatro puedes comprar y son unos treinta y nueve dolares o dos dias y medio de salario minimo. Las otras tres estan encerradas en la boveda. Y entre esas esta la de SKT T1 que todo mundo cree que es de Faker. No lo es. La eligio Easyhoon, que era el suplente que entraba justo a jugar Azir porque Faker todavia no lo jugaba en profesional. Faker escogio Ryze." style="${seccion()}">
    ${glow(SOL, '50% 32%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('8 skins, y solo <span style="color: ' + SOL + ';">4 a la venta</span>', 86)}

      <div data-bento style="margin-top: 26px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        ${tile('Azir_3.jpg', 'SKT T1', 'No es de Faker: la eligió Easyhoon', { span: 2, alto: 310, boveda: true, pos: 'center 30%', extra: rivalFaker })}
        ${tile('Azir_19.jpg', 'Licenciado Aguilar', '1350 RP · la más nueva', { alto: 310, pos: '62% 22%' })}
        ${tile('Azir_1.jpg', 'Galáctico', '975 RP · 2014')}
        ${tile('Azir_2.jpg', 'Señor de la Muerte', '1350 RP · 2015')}
        ${tile('Azir_5.jpg', 'Bosqueviejo', '1350 RP · 2020')}
        ${tile('Azir_4.jpg', 'Reinos en Guerra', 'fuera de tienda', { boveda: true })}
        ${tile('Azir_14.jpg', 'Worlds 2022', 'fuera de tienda', { boveda: true })}
        <div data-tile style="height: 200px; border-radius: 16px; border: 1px dashed ${OCASO}80; display: flex; flex-direction: column; justify-content: center; padding: 18px;">
          <div style="font-family: ${DISPLAY}; font-size: 58px; line-height: 0.92; color: ${OCASO};">3 en<br>bóveda</div>
          <div style="margin-top: 6px; font-size: 18px; font-weight: 600; color: ${MUTED}; line-height: 1.25;">Casi la mitad de su colección</div>
        </div>
      </div>

      <div data-precio style="margin-top: 26px; display: flex; align-items: center; gap: 28px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 100px; line-height: 0.86; color: ${SOL};">~<span data-cuenta="39">39</span> <span style="font-size: 52px;">USD</span></div>
          <div style="font-size: 20px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las cuatro · 5 025 RP · 2,4 días de salario</div>
        </div>
        <div style="width: 2px; height: 76px; background: ${SOL}4D;"></div>
        <div style="flex: 1; font-size: 24px; font-weight: 400; color: ${MUTED}; line-height: 1.4;"><strong style="color: ${BONE};">La segunda más barata de la serie</strong>, solo detrás de Briar.</div>
      </div>
    </div>
  </section>`);

// ── 4 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="04 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('Azir_19.jpg', 'Azir Licenciado Aguilar', '60% 18%')}
    ${glow(SOL, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Doce años del Emperador de las Arenas')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${SOL};">Azir</span></h2>
      <div style="margin-top: 38px;">${disco(130)}</div>
      <div data-gigi style="margin-top: 42px; font-family: ${DISPLAY}; font-size: 106px; line-height: 1.0; color: ${LAPIS};">GIGI EASY</div>
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
    tl.to(o, { v: fin, duration: dur || 1.0, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  // El disco siempre sale igual: el núcleo aparece y los rayos se encienden
  // alrededor, como un amanecer. Es el motivo del deck.
  function amanecer(tl, s, pos) {
    var d = s.querySelector('[data-disco]');
    if (!d) return;
    tl.from(d.querySelector('[data-nucleo]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, pos)
      .from(d.querySelectorAll('[data-rayo]'), { opacity: 0, scale: 0.4, transformOrigin: '50px 50px', duration: 0.32, stagger: 0.03 }, pos + 0.12)
      .from(d, { rotation: -40, duration: 0.8, ease: 'power2.out' }, pos);
  }

  function trazo(tl, el, pos, dur) {
    if (!el || !el.getTotalLength) return;
    var L = el.getTotalLength();
    gsap.set(el, { strokeDasharray: L });
    tl.from(el, { strokeDashoffset: L, duration: dur || 0.9, ease: 'power1.inOut' }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.64);
    amanecer(tl, s, 0.92);
  });

  // Las cien casillas se llenan en barrido y la gris se queda sola al final:
  // primero se ve la rejilla llena, luego la casilla que falta.
  // Después baja la línea del historial, nodo por nodo.
  animar('El one trick', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.45 }, 0)
      .from(q(s, '[data-nombre]'), { y: 22, opacity: 0, duration: 0.45, stagger: 0.07 }, 0.06)
      .from(s.querySelector('[data-cifra]'), { y: 22, opacity: 0, duration: 0.45 }, 0.2)
      .from(q(s, '[data-casilla=""]'), { scale: 0, opacity: 0, duration: 0.22, stagger: 0.0045 }, 0.34)
      .from(s.querySelector('[data-casilla="otra"]'), { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(3)' }, 0.86)
      .from(s.querySelector('[data-pct]'), { x: 26, opacity: 0, duration: 0.45 }, 0.5)
      .from(s.querySelector('[data-caida]'), { y: 20, opacity: 0, duration: 0.4 }, 0.98)
      .from(q(s, '[data-nodo]'), { opacity: 0, duration: 0.2, stagger: 0.09 }, 1.1);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.24, 0.9);
    trazo(tl, s.querySelector('[data-linea-caida]'), 1.12, 0.6);
  });

  // El bento entra en el orden de lectura; el testigo de Faker cae al final
  // sobre la tarjeta de SKT, cuando ya se leyó de quién no es.
  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-tile]'), { y: 26, scale: 0.95, opacity: 0, duration: 0.45, stagger: 0.07 }, 0.26)
      .from(s.querySelector('[data-testigo]'), { y: -24, rotation: -6, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.96)
      .from(s.querySelector('[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 1.12);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.12, 0.6);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 1.1);
    amanecer(tl, s, 0.62);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Azir cumple 12 años</title>
${kit.og({ titulo: "Azir cumple 12 años", descripcion: "Doce años del Emperador de las Arenas: el one trick más puro de la serie juega Azir en 999 de 1011 partidas, y la skin de SKT T1 no es de Faker. Apoyo visual para TikTok.", carpeta: "azir" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(239,174,58,0.45); border-radius: 999px;
    background: rgba(15,11,6,0.85); color: ${SOL}; cursor: pointer;
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
