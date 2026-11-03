// Generador de index.html — Seraphine cumple 6 años (láminas para el montaje automático)
// Ejecutar: node creator/seraphine/gen.js   ·   clips: node tools/laminas.mjs creator/seraphine
//
// Serie «Cumplelolero» #28, mismo formato que lux, graves y elise: cada lámina
// es un miniclip para el **panel de 1080×1370** (`crop=1080:1370:0:275`) que va
// abajo del gameplay del prereel. Todo lo importante vive dentro de `PANEL`.
//
// Criterio de jinx: el único texto es el que es el dato — el 6, SERAFINUM,
// 9.087.627, el conteo de skins (11), KERIA 2025 y GG EZ; en las tarjetas del
// top 2, #1/#2, los nombres y los puntos. Sin dinero.
//
// Sigue el guion de Axl del 2/11/2026 (orden: intro y jugabilidad → lore → OTP
// → skins → cierre). Las 20 láminas y la palabra del guion que dispara cada una
// están en el paquete de la entrega; cada <section> lleva su `data-lamina`.
//
// ⚠️ **Ningún clip arranca en negro**: copia desenfocada, ondas y notas se ven
// desde el cuadro 0; lo que entra es el primer plano.
// ⚠️ **No hay arte oficial** de los skill shots ni de la ulti que se extiende:
// los íconos de Data Dragon son de 64 px (se ampliaron 4× con Lanczos) y las
// formas de cada habilidad (zona, línea, línea ancha) están dibujadas.
// ⚠️ **El rango extendido es de la R, no de la pasiva** (Data Dragon): la
// lámina de la ulti lleva el ícono de la R.
// ⚠️ **El conteo de skins es 11** (K/DA ALL OUT cuenta como una, con la Océano
// Prestigiosa): la ficha dice 14 pero su tabla y Data Dragon no suman eso.
// ⚠️ La carta `06PZ021T1` es redonda (1024×1024): se recorta con border-radius.
// ⚠️ Las cartas de LoR están en `set6cde`, no en `set6`.
//
// Datos: la ficha de Seraphine de Axl (ChampionMastery.GG, op.gg, wiki, bio
// oficial es-MX, Data Dragon 16.21.1 y Legends of Runeterra).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Los fondos (copia desenfocada, lavados, ondas) llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta: el escenario de Seraphine ────────────────────────────────────
const BG = '#0A0B1E';        // azul noche de escenario
const ROSA = '#FF7EB6';      // rosa de su pelo — acento
const ROSA_CL = '#FFC4DE';
const CIAN = '#5FE3F0';      // cian hextech — cristal y datos
const VERDE = '#7BD86A';     // verde químico — solo el bloque de Zaun
const T1 = '#E4002B';        // rojo T1 — solo la lámina de Keria
const BLANCO = '#F7F1FA';
const MUTED = '#8A88B0';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };

// ── Piezas comunes ───────────────────────────────────────────────────────
function prng(semilla) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SECCION = `background: ${BG}; color: ${BLANCO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

const borroso = (src, brillo = 0.45, extra = '') => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(46px) saturate(1.2) brightness(${brillo}); ${extra}"></div>
    </div>`;

// Lavado de color y viñeta: nunca un fondo plano.
const ambiente = (x = 50, y = 30, color = ROSA, fuerza = 0.24) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(75% 45% at ${x}% ${y}%, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(4,4,16,0.72) 100%);"></div>`;

// Ondas de sonido: senoides a todo lo ancho que derivan hacia un lado. El
// trazo mide dos paneles y cada línea da un número entero de ciclos por panel,
// así que al correr 1080 px el bucle cierra sin saltos.
function ondas(semilla, { lineas = 7, op = 0.4, amp = 70, y0 = PANEL.top + 130, y1 = PANEL.top + 1240, c1 = ROSA, c2 = CIAN } = {}) {
  const r = prng(semilla);
  let paths = '';
  for (let k = 0; k < lineas; k++) {
    const y = y0 + (y1 - y0) * k / (lineas - 1), ciclos = 2 + Math.floor(r() * 3), A = amp * (0.35 + r() * 0.9), fase = r() * 6.28;
    let d = '';
    for (let x = 0; x <= 2160; x += 12) d += `${x ? 'L' : 'M'}${x} ${(y + A * Math.sin(x / 1080 * ciclos * 2 * Math.PI + fase)).toFixed(1)}`;
    paths += `<path d="${d}" fill="none" stroke="${k % 2 ? c2 : c1}" stroke-opacity="${(op * (0.55 + r() * 0.45)).toFixed(2)}" stroke-width="${(2 + r() * 3.5).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <svg data-ondas viewBox="0 0 2160 1920" width="2160" height="1920" style="position: absolute; left: 0; top: 0; filter: drop-shadow(0 0 10px ${a(c1, 0.45)});">${paths}</svg>
    </div>`;
}

// Una corchea dibujada (cabeza, plica y bandera).
const notaSvg = (col, tam) => `<svg viewBox="0 0 44 64" width="${tam}" height="${Math.round(tam * 64 / 44)}" style="display: block; overflow: visible;"><ellipse cx="13" cy="52" rx="12" ry="9" transform="rotate(-22 13 52)" fill="${col}"/><path d="M23 50 V7" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/><path d="M23 7 C27 21 41 22 39 38 C37 27 30 25 23 24 Z" fill="${col}"/></svg>`;
// Notas que suben (posiciones fijas por semilla), mitad rosa y mitad cian.
const notas = (semilla, n = 16) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 980), y = Math.round(PANEL.top + 80 + r() * (PANEL.h - 160));
    const t = Math.round(26 + r() * 30), q = r(), col = q < 0.5 ? ROSA : q < 0.88 ? CIAN : BLANCO, op = (0.35 + r() * 0.5).toFixed(2);
    h += `<span data-brasa style="position: absolute; left: ${x}px; top: ${y}px; opacity: ${op}; transform: rotate(${Math.round(-18 + r() * 36)}deg); filter: drop-shadow(0 0 ${Math.round(t / 2)}px ${col}); pointer-events: none;">${notaSvg(col, t)}</span>`;
  }
  return `<div style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

// Arte apaisado de borde a borde dentro del panel (cover, foco en `pos`).
const arte = (src, alt, { y, alto, pos = 'center', extra = '', attrs = '', marco = true, estilo = '', ancho = 1080, x = 0 } = {}) => `
      <div data-arte ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${ancho}px; height: ${alto}px; overflow: hidden; ${marco ? `box-shadow: 0 40px 100px rgba(2,2,12,0.8), 0 0 0 1px ${a(BLANCO, 0.18)};` : ''} ${estilo}">
        <img data-img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">${extra}
      </div>`;

const lamina = (id, notasOrador, cuerpo, extraSeccion = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}" style="${SECCION} ${extraSeccion}">${cuerpo}
  </section>`;

// Anillos de sonido que salen de (cx, cy): cada uno lleva data-anillo.
const anillos = (cx, cy, r, n = 4, col = ROSA, grosor = 5) => Array.from({ length: n }, () => `<circle data-anillo cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${grosor}" opacity="0"/>`).join('');

// Estrella de cinco puntas (las tres formas de K/DA: 1, 2 y 3 estrellas).
const estrella = (cx, cy, R, col, op = 1, extra = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.46 : R; d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(ang)).toFixed(1)} ${(cy + rr * Math.sin(ang)).toFixed(1)}`; }
  return `<path ${extra} d="${d}Z" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
};

// Silueta de aliado: cabeza y hombros.
const aliado = (x, y, col = BLANCO, esc = 1) => `<g transform="translate(${x} ${y}) scale(${esc})"><circle cx="0" cy="-14" r="22" fill="${a(col, 0.18)}" stroke="${col}" stroke-width="5"/><path d="M-40 40 Q-40 8 0 8 Q40 8 40 40" fill="${a(col, 0.18)}" stroke="${col}" stroke-width="5" stroke-linecap="round"/></g>`;

// Marco con un ícono de habilidad (Data Dragon, ampliado 4×).
const icono = (archivo, x, y, tam, col = CIAN, attrs = '') => `
      <div ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; border-radius: ${Math.round(tam * 0.14)}px; overflow: hidden; border: 5px solid ${col}; box-sizing: border-box; box-shadow: 0 0 46px ${a(col, 0.55)}, 0 22px 50px rgba(2,2,12,0.7);">
        <img src="assets/iconos/${archivo}.png" alt="Ícono de habilidad" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>`;

// Curva monótona (Fritsch–Carlson) para la gráfica de rango: no se pasa de los
// valores reales.
function monotona(p) {
  const n = p.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const al = m[i] / d[i], be = m[i + 1] / d[i], s = al * al + be * be;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * al * d[i]; m[i + 1] = t * be * d[i]; }
  }
  let s = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = p[i + 1][0] - p[i][0];
    s += ` C${(p[i][0] + h / 3).toFixed(1)} ${(p[i][1] + m[i] * h / 3).toFixed(1)}, ${(p[i + 1][0] - h / 3).toFixed(1)} ${(p[i + 1][1] - m[i + 1] * h / 3).toFixed(1)}, ${p[i + 1][0].toFixed(1)} ${p[i + 1][1].toFixed(1)}`;
  }
  return s;
}

const slides = [];

// ── 1 · sera-portada ─────────────────────────────────────────────────────
// Un 6 gigante detrás, ondas que salen de ella y su recorte del splash.
slides.push(lamina('sera-portada', 'Seraphine cumplió seis años desde que entró al juego.', `
    ${borroso('splash/Seraphine_0-fondo.jpg', 0.5)}
    ${ambiente(50, 38)}
    ${ondas(11, { op: 0.34 })}
    ${notas(101, 22)}
    ${panel(`
      <div data-seis class="rosa" style="position: absolute; left: 560px; top: 400px; font-size: 1000px; line-height: 1; z-index: 3;">6</div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">${anillos(410, 480, 330, 4, ROSA, 6)}${anillos(410, 480, 330, 3, CIAN, 4)}</svg>
      <div data-carta style="position: absolute; left: 50px; top: 60px; width: 720px; height: 860px; border-radius: 26px; overflow: hidden; border: 4px solid ${BLANCO}; box-shadow: 0 0 0 12px ${a(BG, 0.55)}, 0 0 110px ${a(ROSA, 0.55)}, 0 40px 90px rgba(2,2,12,0.8);">
        <img data-img src="assets/splash/Seraphine_0.jpg" alt="Seraphine, splash base" style="width: 100%; height: 100%; object-fit: cover; object-position: 38% 30%; display: block;">
      </div>`)}`));

// ── 2 · sera-kda ─────────────────────────────────────────────────────────
// Las tres formas de K/DA ALL OUT, de la del cuarto a la del estadio, con una
// estrella más en cada una.
const FORMAS = [
  [1, 40, '50% 22%', 1], [2, 490, '50% 38%', 2], [3, 940, '50% 24%', 3],
];
slides.push(lamina('sera-kda', 'Seraphine entró al juego con skin definitiva: K/DA ALL OUT, con sus tres formas, de Indie a Superestrella.', `
    ${borroso('splash/Seraphine_3-fondo.jpg', 0.42)}
    ${ambiente(50, 55, CIAN, 0.2)}
    ${ondas(22, { op: 0.28 })}
    ${notas(202, 14)}
    ${panel(FORMAS.map(([n, y, pos, k]) => `
      <div data-forma style="position: absolute; left: 40px; top: ${y}px; width: 1000px; height: 390px;">
        ${arte(`splash/Seraphine_${n}.jpg`, `K/DA ALL OUT, forma ${k}`, { y: 0, alto: 390, pos, ancho: 1000, attrs: 'data-arte-forma' })}
        <svg viewBox="0 0 1000 390" width="1000" height="390" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
          <rect x="0" y="290" width="1000" height="100" fill="url(#vel-kda)" opacity="0.9"/>
          ${[0, 1, 2].map((i) => estrella(830 + i * 62, 340, 26, i < k ? ROSA_CL : BLANCO, i < k ? 1 : 0.18, i < k ? 'data-estrella-on' : 'data-estrella-off')).join('')}
        </svg>
      </div>`).join('') + `
      <svg width="0" height="0" style="position: absolute;"><defs><linearGradient id="vel-kda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BG}" stop-opacity="0"/><stop offset="1" stop-color="${BG}" stop-opacity="0.85"/></linearGradient></defs></svg>`)}`));

// ── 3 · sera-skillshots ──────────────────────────────────────────────────
// Q (zona), E y R (líneas) se lanzan al suelo; la pasiva las lanza dos veces.
const COLS = [190, 540, 890];
const formaQ = `<g data-forma-q><circle cx="190" cy="610" r="150" fill="${a(CIAN, 0.1)}" stroke="${CIAN}" stroke-width="6"/><circle cx="190" cy="610" r="96" fill="none" stroke="${CIAN}" stroke-width="3" stroke-dasharray="6 14"/><path d="M190 548 V672 M128 610 H252" stroke="${CIAN}" stroke-width="5" stroke-linecap="round"/></g>`;
const formaE = `<g data-forma-e><rect x="502" y="370" width="76" height="560" rx="38" fill="${a(CIAN, 0.1)}" stroke="${CIAN}" stroke-width="6"/><path d="M540 400 V880" stroke="${CIAN}" stroke-width="3" stroke-dasharray="6 14"/><path d="M510 870 L540 932 L570 870" fill="none" stroke="${CIAN}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const formaR = `<g data-forma-r><rect x="830" y="370" width="120" height="620" rx="30" fill="${a(CIAN, 0.1)}" stroke="${CIAN}" stroke-width="6"/><path d="M890 400 V940" stroke="${CIAN}" stroke-width="3" stroke-dasharray="6 14"/><path d="M850 928 L890 1000 L930 928" fill="none" stroke="${CIAN}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const eco = (g, dx, dy, s = 1) => `<g data-eco transform="translate(${dx} ${dy})" style="filter: drop-shadow(0 0 14px ${a(ROSA, 0.6)});">${g.replace(/<g data-forma-[qer]>/, '<g>').replace(new RegExp(CIAN, 'g'), ROSA)}</g>`;
slides.push(lamina('sera-skillshots', 'Tres de sus habilidades son skill shots con una evolución: la Q, la E y la R se lanzan al suelo, y su pasiva las lanza dos veces.', `
    ${borroso('splash/Seraphine_3-fondo.jpg', 0.3)}
    ${ambiente(50, 40, CIAN, 0.2)}
    ${ondas(33, { op: 0.26 })}
    ${notas(303, 12)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <path data-guia d="M190 320 V440 M540 320 V370 M890 320 V370" stroke="${CIAN}" stroke-opacity="0.5" stroke-width="3" stroke-dasharray="4 12" fill="none"/>
        ${formaQ}${formaE}${formaR}
        ${eco(formaQ, 0, 90)}${eco(formaE, 0, 90)}${eco(formaR, 0, 90)}
        <path data-hilo-pasiva d="M540 1060 C540 1010 190 1020 190 900 M540 1060 V1000 M540 1060 C540 1010 890 1020 890 1000" fill="none" stroke="${ROSA}" stroke-opacity="0.7" stroke-width="4" stroke-dasharray="6 12" stroke-linecap="round"/>
        ${anillos(540, 1170, 120, 3, ROSA, 6)}
      </svg>
      ${icono('SeraphineQ', COLS[0] - 110, 80, 220, CIAN, 'data-icono-q')}
      ${icono('SeraphineE', COLS[1] - 110, 80, 220, CIAN, 'data-icono-e')}
      ${icono('SeraphineR', COLS[2] - 110, 80, 220, CIAN, 'data-icono-r')}
      ${icono('Seraphine_Passive', 540 - 100, 1070, 200, ROSA, 'data-icono-pasiva')}`)}`));

// ── 4 · sera-w ───────────────────────────────────────────────────────────
// La W escuda y acelera a los aliados cercanos.
const CARRILES = [900, 1010, 1120, 1230];
slides.push(lamina('sera-w', 'Aceleras a los aliados con la W, que además los protege con un escudo.', `
    ${borroso('splash/Seraphine_2-fondo.jpg', 0.36)}
    ${ambiente(50, 28, CIAN, 0.26)}
    ${ondas(44, { op: 0.3 })}
    ${notas(404, 12)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${anillos(540, 430, 250, 4, CIAN, 6)}
        <circle data-escudo cx="540" cy="430" r="270" fill="${a(CIAN, 0.08)}" stroke="${CIAN}" stroke-width="5" stroke-dasharray="14 12"/>
        ${CARRILES.map((y, i) => `
        <line x1="60" y1="${y + 36}" x2="1020" y2="${y + 36}" stroke="${BLANCO}" stroke-opacity="0.14" stroke-width="3" stroke-dasharray="4 14"/>
        <g data-corre transform="translate(${80 + i * 40} ${y})">
          <rect data-estela x="-420" y="-16" width="420" height="32" rx="16" fill="url(#estela-w)"/>
          <circle data-aura cx="0" cy="0" r="62" fill="${a(CIAN, 0.12)}" stroke="${CIAN}" stroke-width="5"/>
          <circle cx="0" cy="-8" r="22" fill="${a(ROSA, 0.9)}"/><path d="M-34 36 Q-34 10 0 10 Q34 10 34 36" fill="${a(ROSA, 0.9)}"/>
        </g>`).join('')}
        <defs><linearGradient id="estela-w" x1="0" x2="1"><stop offset="0" stop-color="${CIAN}" stop-opacity="0"/><stop offset="1" stop-color="${CIAN}" stop-opacity="0.85"/></linearGradient></defs>
      </svg>
      ${icono('SeraphineW', 540 - 190, 240, 380, CIAN, 'data-icono-w')}`)}`));

// ── 5 · sera-ulti ────────────────────────────────────────────────────────
// La R se extiende al pasar por un aliado: cada tramo del haz es más largo que
// el anterior.
const NODOS = [[540, 960], [380, 780], [700, 540], [420, 280]];
const tramos = NODOS.slice(1).map((n, i) => `M${NODOS[i][0]} ${NODOS[i][1]} L${n[0]} ${n[1]}`);
slides.push(lamina('sera-ulti', 'Su ulti es la R: al pasar por un aliado extiende su rango, y cada vez llega más lejos.', `
    ${borroso('splash/Seraphine_3-fondo.jpg', 0.34)}
    ${ambiente(50, 70, ROSA, 0.26)}
    ${ondas(55, { op: 0.3 })}
    ${notas(505, 14)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <defs><linearGradient id="haz-r" gradientUnits="userSpaceOnUse" x1="540" y1="960" x2="420" y2="280"><stop offset="0" stop-color="${ROSA}"/><stop offset="1" stop-color="${CIAN}"/></linearGradient></defs>
        ${tramos.map((d, i) => `<path data-tramo d="${d}" fill="none" stroke="url(#haz-r)" stroke-width="${22 + i * 8}" stroke-linecap="round" style="filter: drop-shadow(0 0 20px ${a(ROSA, 0.7)}) drop-shadow(0 0 40px ${a(CIAN, 0.4)});"/>`).join('')}
        ${NODOS.slice(1).map(([x, y], i) => `<g data-aliado>${aliado(x, y, BLANCO, 1.3)}<circle data-ping cx="${x}" cy="${y}" r="70" fill="none" stroke="${CIAN}" stroke-width="6" opacity="0"/></g>`).join('')}
      </svg>
      ${icono('SeraphineR', 540 - 150, 950, 300, ROSA, 'data-icono-r')}`)}`));

// ── 6 · sera-sona ────────────────────────────────────────────────────────
// Una Sona dos punto cero: Sona arriba, Seraphine sube sobre ella.
slides.push(lamina('sera-sona', 'Es básicamente una Sona dos punto cero, pero bien hecha.', `
    ${borroso('splash/Seraphine_0-fondo.jpg', 0.38)}
    ${ambiente(50, 50, CIAN, 0.2)}
    ${ondas(66, { op: 0.28 })}
    ${notas(606, 12)}
    ${panel(`
      ${arte('splash/Sona_0.jpg', 'Sona, splash base', { y: 40, alto: 600, pos: '62% 40%', attrs: 'data-sona', estilo: 'filter: saturate(0.8) brightness(0.9);' })}
      ${arte('splash/Seraphine_0.jpg', 'Seraphine, splash base', { y: 730, alto: 600, pos: '50% 28%', attrs: 'data-sera', estilo: `box-shadow: 0 0 90px ${a(ROSA, 0.5)}, 0 40px 100px rgba(2,2,12,0.8), 0 0 0 3px ${ROSA};` })}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g data-flechas fill="none" stroke="${ROSA}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 16px ${a(ROSA, 0.8)});">
          <path data-flecha d="M440 700 L540 630 L640 700"/><path data-flecha d="M440 650 L540 580 L640 650"/>
        </g>
      </svg>`)}`));

// ── 7–10 · el lore con la carta de la niña ───────────────────────────────
// La misma carta (`06PZ021`) cuatro veces seguidas, siempre en el mismo sitio y
// con `data-continua`: lo que cambia es lo que le pasa alrededor.
const CARTA = (attrs, estilo = '') => arte('cartas/06PZ021.jpg', 'Seraphine de niña en el taller, carta de Legends of Runeterra', { y: 185, alto: 1000, pos: '22% 50%', attrs: `data-continua="cuarto" ${attrs}`, estilo });
slides.push(lamina('sera-cuarto', 'Seraphine nació en Piltóver, hija de zaunitas con un taller de aparatos de sonido, y de niña cantaba con la ciudad desde la ventana.', `
    ${borroso('cartas/06PZ021-fondo.jpg', 0.5)}
    ${ambiente(40, 45)}
    ${ondas(77, { op: 0.34, amp: 60 })}
    ${notas(707, 18)}
    ${panel(CARTA(''))}`));

slides.push(lamina('sera-ruido', 'El problema es que desde chiquita podía oír el alma de cada persona, y las calles se le volvieron un ruido insoportable.', `
    ${borroso('cartas/06PZ021-fondo.jpg', 0.45)}
    ${ambiente(40, 45, ROSA, 0.34)}
    ${ondas(88, { lineas: 13, op: 0.5, amp: 150, y0: PANEL.top + 40, y1: PANEL.top + 1330 })}
    ${panel(`
      ${CARTA('data-carta-ruido')}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${anillos(300, 480, 140, 5, ROSA, 6)}${anillos(780, 700, 140, 5, CIAN, 5)}${anillos(540, 1000, 140, 5, ROSA, 5)}
      </svg>`)}`));

slides.push(lamina('sera-silencio', 'Sus papás le armaron un aparato que le apagaba el don, y por primera vez en años hubo silencio.', `
    ${borroso('cartas/06PZ021-fondo.jpg', 0.3)}
    ${ambiente(40, 45, CIAN, 0.18)}
    ${ondas(99, { lineas: 9, op: 0.4, amp: 60 })}
    ${panel(`
      ${CARTA('data-carta-silencio')}
      <div data-brillo-cristal style="position: absolute; left: 330px; top: 560px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(closest-side, ${a(CIAN, 0.65)}, ${a(CIAN, 0)}); mix-blend-mode: screen; opacity: 0;"></div>`)}`));

// El cristal: una gema dibujada que late, y Skarner, de la misma raza.
const GEMA = { x: 540, y: 560 };
const gema = `
        <g data-gema transform="translate(${GEMA.x} ${GEMA.y})" style="filter: drop-shadow(0 0 30px ${a(CIAN, 0.8)}) drop-shadow(0 0 70px ${a(CIAN, 0.5)});">
          <path d="M0 -250 L150 -110 L110 150 L0 260 L-110 150 L-150 -110 Z" fill="${a(CIAN, 0.14)}" stroke="${CIAN}" stroke-width="7" stroke-linejoin="round"/>
          <path d="M-150 -110 L0 -40 L150 -110 M0 -40 L110 150 M0 -40 L-110 150 M0 -250 L0 -40 M0 -40 L0 260" fill="none" stroke="${CIAN}" stroke-width="4" stroke-opacity="0.85" stroke-linejoin="round"/>
          <path d="M-60 -150 L0 -200 L60 -150 L0 -90 Z" fill="${a(BLANCO, 0.5)}"/>
        </g>`;
slides.push(lamina('sera-cristal', 'En ese silencio le habló el cristal: tenía conciencia y era de sangre brackern, la misma raza de Skarner.', `
    ${borroso('splash/Skarner_0.jpg', 0.28)}
    ${ambiente(50, 38, CIAN, 0.3)}
    ${ondas(110, { op: 0.28, c1: CIAN, c2: CIAN })}
    ${notas(1010, 10)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${anillos(GEMA.x, GEMA.y, 260, 5, CIAN, 5)}
        ${gema}
      </svg>
      <div data-skarner style="position: absolute; left: ${540 - 230}px; top: 880px; width: 460px; height: 460px; border-radius: 50%; overflow: hidden; border: 6px solid ${CIAN}; box-shadow: 0 0 0 12px ${a(BG, 0.55)}, 0 0 90px ${a(CIAN, 0.6)}, 0 40px 90px rgba(2,2,12,0.8);">
        <img data-img src="assets/splash/Skarner_0.jpg" alt="Skarner, splash base" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; display: block;">
      </div>`)}`));

// ── 11 · sera-estrella ───────────────────────────────────────────────────
slides.push(lamina('sera-estrella', 'Aprendió a controlar el ruido y se volvió una estrella que llenó los estadios más grandes de Piltóver.', `
    ${borroso('cartas/06PZ021T2-fondo.jpg', 0.5)}
    ${ambiente(65, 35)}
    ${ondas(121, { op: 0.34 })}
    ${notas(1111, 24)}
    ${panel(`
      ${arte('cartas/06PZ021T2.jpg', 'Seraphine cantando ante la multitud, carta de Legends of Runeterra', { y: 185, alto: 1000, pos: '80% 50%' })}
      <div data-haz style="position: absolute; left: 520px; top: 185px; width: 520px; height: 1000px; background: linear-gradient(to bottom, ${a(BLANCO, 0.5)}, ${a(ROSA, 0.12)} 55%, ${a(ROSA, 0)}); clip-path: polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%); mix-blend-mode: screen; opacity: 0; pointer-events: none;"></div>`)}`));

// ── 12 · sera-zaun ───────────────────────────────────────────────────────
// Baja a Zaun: la cámara cae desde Piltóver hacia la multitud, y el fondo vira
// al verde químico (apagado: solo en este bloque).
slides.push(lamina('sera-zaun', 'Le faltaba algo, así que bajó a Zaun, la ciudad que sus papás quisieron olvidar.', `
    ${borroso('splash/Seraphine_0-fondo.jpg', 0.3, `filter: blur(46px) saturate(0.7) hue-rotate(60deg) brightness(0.32);`)}
    ${ambiente(50, 55, VERDE, 0.3)}
    ${ondas(132, { op: 0.28, c1: VERDE, c2: VERDE })}
    ${panel(`
      ${arte('splash/Seraphine_0.jpg', 'Seraphine canta en el Entresuelo, splash base', { y: 140, alto: 1090, pos: '45% 50%', extra: `<div style="position: absolute; inset: 0; background: ${a(VERDE, 0.42)}; mix-blend-mode: color;"></div><div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(20,40,20,0.35), rgba(10,30,15,0));"></div>`, estilo: `box-shadow: 0 40px 100px rgba(2,2,12,0.8), 0 0 0 2px ${a(VERDE, 0.45)};` })}`)}`));

// ── 13 · sera-entresuelo ─────────────────────────────────────────────────
// La plataforma que amplifica su don: la carta del hechizo, en círculo, con
// ondas que salen hacia las dos ciudades (verde a la izquierda, rosa a la
// derecha).
slides.push(lamina('sera-entresuelo', 'Desarmó el aparato y lo convirtió en lo contrario: una plataforma que amplifica su don, y cantó en el Entresuelo para la gente de las dos ciudades.', `
    ${borroso('cartas/06PZ021T1-fondo.jpg', 0.42)}
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(VERDE, 0.3)} 0%, ${a(VERDE, 0)} 45%, ${a(ROSA, 0)} 55%, ${a(ROSA, 0.32)} 100%);"></div>
    ${ambiente(50, 45, ROSA, 0.16)}
    ${ondas(143, { op: 0.42, amp: 100, c1: ROSA, c2: CIAN })}
    ${notas(1313, 22)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${anillos(540, 690, 400, 5, ROSA, 7)}${anillos(540, 690, 400, 4, CIAN, 5)}${anillos(540, 690, 400, 3, VERDE, 5)}
      </svg>
      <div data-circulo style="position: absolute; left: ${540 - 400}px; top: ${690 - 400}px; width: 800px; height: 800px; border-radius: 50%; overflow: hidden; border: 6px solid ${BLANCO}; box-shadow: 0 0 0 14px ${a(BG, 0.55)}, 0 0 120px ${a(ROSA, 0.6)}, 0 40px 90px rgba(2,2,12,0.8);">
        <img data-img src="assets/cartas/06PZ021T1.jpg" alt="El hechizo de Seraphine, carta de Legends of Runeterra" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>`)}`));

// ── 14 · sera-otp ────────────────────────────────────────────────────────
slides.push(lamina('sera-otp', 'El OTP con más puntos de Seraphine se llama Serafinum, llegó a Challenger y tiene más de nueve millones de puntos.', `
    ${borroso('splash/Seraphine_3-fondo.jpg', 0.34)}
    ${ambiente(50, 30)}
    ${ondas(154, { op: 0.28 })}
    ${notas(1414, 16)}
    ${panel(`
      ${arte('splash/Seraphine_3.jpg', 'Seraphine K/DA ALL OUT Superestrella, splash', { y: 30, alto: 480, pos: '50% 22%' })}
      <div data-pastilla style="position: absolute; left: 40px; top: 470px; width: 1000px; height: 150px; border-radius: 75px; box-sizing: border-box; background: ${a(BG, 0.92)}; border: 3px solid ${ROSA}; box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 50px ${a(ROSA, 0.4)}; display: flex; align-items: center; justify-content: center;">
        <span data-nombre-otp style="font-size: 132px; line-height: 1; letter-spacing: 12px; padding-left: 12px; color: ${BLANCO};">SERAFINUM</span>
      </div>
      <div data-puntos class="cian" style="position: absolute; left: 0; right: 0; top: 640px; text-align: center; font-size: 250px; line-height: 1;">9.087.627</div>
      <div data-halo style="position: absolute; left: ${540 - 330}px; top: 900px; width: 660px; height: 480px; border-radius: 50%; background: radial-gradient(closest-side, ${a('#FF8A3D', 0.5)}, ${a('#FF8A3D', 0)});"></div>
      <img data-continua="retador" data-emblema src="assets/emblemas/challenger.png" alt="Emblema de Retador" style="position: absolute; left: ${540 - 270}px; top: 960px; width: 540px; height: auto; filter: drop-shadow(0 0 40px ${a('#FFB45A', 0.6)}) drop-shadow(0 20px 34px rgba(0,0,0,0.6));">`)}`));

// ── 15 · sera-historial ──────────────────────────────────────────────────
// Cinco veces Retador: 2022, 2023 (split 1) y 2024 (los tres splits). Cae a
// Diamante 2 en 2025 y hoy es Gran Maestro, con pico de Retador.
const LIGAS = [
  ['diamond', 2.2, 4.6, '#5AA7FF', 124],
  ['master', 4.6, 5.9, '#B05CFF', 112],
  ['grandmaster', 5.9, 7.3, '#FF6A5C', 124],
  ['challenger', 7.3, 9.8, '#FFB45A', 128],
];
const HIST = [['2021', 5.2], ['2022', 8.5], ['2023', 8.5], ['2023', 6.5], ['2024', 8.5], ['2024', 8.5], ['2024', 8.5], ['2025', 3.2], ['2026', 6.5]];
const RET = [1, 2, 4, 5, 6]; // los cinco Retador
const GW = 960, GH = 1160, ML = 170, MR = 40, MT = 30, MB = 80, VMIN = 2.0, VMAX = 9.9;
const GL = 60, GT = 120;
const gx = (i) => ML + 26 + i * ((GW - ML - MR - 52) / (HIST.length - 1));
const gy = (v) => MT + ((VMAX - v) / (VMAX - VMIN)) * (GH - MT - MB);
const pts = HIST.map(([, v], i) => [gx(i), gy(v)]);
const bandas = LIGAS.map(([, lo, hi, col], k) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN));
  return `<g data-banda>
        <rect x="${ML}" y="${y1.toFixed(1)}" width="${GW - ML - MR + 26}" height="${(y2 - y1).toFixed(1)}" rx="16" fill="${col}" fill-opacity="${0.07 + k * 0.025}"/>
        <line x1="${ML}" x2="${GW - MR + 26}" y1="${y1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${col}" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="4 8"/>
      </g>`;
}).join('');
const ejes = LIGAS.map(([img, lo, hi, col, w]) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN)), yc = (y1 + y2) / 2;
  const asp = { diamond: 314 / 189, master: 300 / 221, grandmaster: 311 / 224, challenger: 322 / 243 }[img];
  const h = w / asp;
  const cont = img === 'challenger' ? 'data-continua="retador" ' : '';
  return `<img ${cont}data-emblema-eje src="assets/emblemas/${img}.png" alt="Emblema de ${img}" style="position: absolute; left: ${GL + ML - w - 14}px; top: ${(GT + yc - h / 2).toFixed(1)}px; width: ${w}px; height: auto; filter: drop-shadow(0 0 18px ${a(col, 0.55)});">`;
}).join('\n      ');
const anios = [...new Set(HIST.map((h) => h[0]))].map((y) => {
  const idx = HIST.map((h, i) => (h[0] === y ? i : -1)).filter((i) => i >= 0);
  const x = idx.reduce((s, i) => s + gx(i), 0) / idx.length;
  return `<text data-anio x="${x.toFixed(1)}" y="${GH - 26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="22" font-weight="600" fill="${MUTED}">${y}</text>`;
}).join('');
const tramoA = monotona(pts.slice(0, 7));          // hasta el último Retador de 2024
const tramoB = `M${pts[6][0].toFixed(1)} ${pts[6][1].toFixed(1)} L${pts[7][0].toFixed(1)} ${pts[7][1].toFixed(1)}`; // la caída: de golpe
const tramoC = monotona(pts.slice(7));             // y la vuelta
const [ux, uy] = pts[8];
const picoY = gy(8.9);
const graficaRango = `
      <svg data-grafica viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" style="position: absolute; left: ${GL}px; top: ${GT}px; overflow: visible;">
        <defs>
          <linearGradient id="trazo-s" x1="0" x2="1"><stop offset="0" stop-color="${BLANCO}"/><stop offset="1" stop-color="${ROSA}"/></linearGradient>
          <filter id="brillo-s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        ${bandas}
        ${anios}
        <path data-linea-a d="${tramoA}" fill="none" stroke="url(#trazo-s)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#brillo-s)"/>
        <path data-linea-b d="${tramoB}" fill="none" stroke="${ROSA}" stroke-width="8" stroke-linecap="round" filter="url(#brillo-s)"/>
        <path data-linea-c d="${tramoC}" fill="none" stroke="${ROSA}" stroke-width="8" stroke-linecap="round" filter="url(#brillo-s)"/>
        <path data-pico d="M${ux.toFixed(1)} ${uy.toFixed(1)} L${ux.toFixed(1)} ${picoY.toFixed(1)}" fill="none" stroke="${LIGAS[3][3]}" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/>
        <circle data-pico-punto cx="${ux.toFixed(1)}" cy="${picoY.toFixed(1)}" r="11" fill="${BG}" stroke="${LIGAS[3][3]}" stroke-width="5" stroke-dasharray="4 6"/>
        ${pts.map(([x, y], i) => `<circle data-punto ${RET.includes(i) ? 'data-retador' : ''} cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${RET.includes(i) ? 16 : i === 8 ? 15 : 10}" fill="${BG}" stroke="${RET.includes(i) ? LIGAS[3][3] : i === 8 ? ROSA : '#5AA7FF'}" stroke-width="${RET.includes(i) || i === 8 ? 6 : 4}"/>`).join('')}
        <circle data-pulso cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="15" fill="none" stroke="${ROSA}" stroke-width="3" opacity="0"/>
      </svg>`;
slides.push(lamina('sera-historial', 'Llegó a Challenger cinco veces, cayó a Diamante 2 en 2025, y hoy anda en Gran Maestro con pico de Challenger.', `
    ${borroso('splash/Seraphine_3-fondo.jpg', 0.34)}
    ${ambiente(50, 12, '#FFB45A', 0.2)}
    ${ondas(165, { op: 0.22 })}
    ${notas(1515, 12)}
    ${panel(`
      ${ejes}
      ${graficaRango}`)}`));

// ── 16 · sera-latam ──────────────────────────────────────────────────────
// El top 2 del mundo es latino: dos tarjetas con sus puntos y una barra.
const TARJ = [
  ['1', 'SERAFINUM', '9.087.627', 9087627, ROSA, 'splash/Seraphine_0.jpg', '58% 30%', 60],
  ['2', 'CATITABELL', '8.157.505', 8157505, CIAN, 'splash/Seraphine_1.jpg', '70% 18%', 720],
];
slides.push(lamina('sera-latam', 'El número dos del mundo también es latino: CatitaBell, con más de ocho millones de puntos.', `
    ${borroso('splash/Seraphine_1-fondo.jpg', 0.34)}
    ${ambiente(50, 40, CIAN, 0.18)}
    ${ondas(176, { op: 0.26 })}
    ${notas(1616, 14)}
    ${panel(TARJ.map(([pos, nombre, puntos, , col, src, op, y]) => `
      <div data-tarjeta style="position: absolute; left: 40px; top: ${y}px; width: 1000px; height: 590px; border-radius: 34px; overflow: hidden; box-sizing: border-box; background: ${a(BG, 0.9)}; border: 5px solid ${col}; box-shadow: 0 0 70px ${a(col, 0.4)}, 0 30px 80px rgba(2,2,12,0.75);">
        <img src="assets/${src}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${op}; opacity: 0.4; display: block;">
        <div style="position: absolute; inset: 0; background: linear-gradient(90deg, ${a(BG, 0.95)} 30%, ${a(BG, 0.55)});"></div>
        <div data-rango style="position: absolute; left: 50px; top: 70px; font-size: 270px; line-height: 1; color: ${col}; text-shadow: 0 0 50px ${a(col, 0.6)};">#${pos}</div>
        <div style="position: absolute; left: 330px; top: 60px; font-size: 118px; line-height: 1; letter-spacing: 6px; color: ${BLANCO};">${nombre}</div>
        <div data-puntos-tarj style="position: absolute; left: 330px; top: 190px; font-size: 168px; line-height: 1; color: ${col}; text-shadow: 0 0 40px ${a(col, 0.5)};" data-valor="${pos === '1' ? 9087627 : 8157505}">${puntos}</div>
        <div style="position: absolute; left: 60px; right: 60px; top: 480px; height: 34px; border-radius: 17px; background: ${a(BLANCO, 0.12)};"><div data-barra style="width: ${pos === '1' ? 100 : 89.8}%; height: 100%; border-radius: 17px; background: linear-gradient(90deg, ${a(col, 0.55)}, ${col}); box-shadow: 0 0 30px ${a(col, 0.6)};"></div></div>
      </div>`).join(''))}`));

// ── 17 · sera-skins ──────────────────────────────────────────────────────
// 11 skins (K/DA ALL OUT cuenta como una). Bento de pantallas de carga: K/DA y
// T1 en 2×2 y, en la casilla sobrante, el conteo.
const GX = 20, GY = 165, CWB = 165, CHB = 340, GAPB = 10;
const celda = (c, f, cw = 1, ch = 1) => ({ x: GX + c * (CWB + GAPB), y: GY + f * (CHB + GAPB), w: cw * CWB + (cw - 1) * GAPB, h: ch * CHB + (ch - 1) * GAPB });
const SKINS = [
  [1, celda(0, 0, 2, 2), 'kda'], [4, celda(2, 0)], [14, celda(3, 0)], [15, celda(4, 0)], [24, celda(5, 0)],
  [34, celda(2, 1)], [43, celda(3, 1)], [50, celda(0, 2)], [59, celda(1, 2)], [69, celda(2, 2)],
  [68, celda(4, 1, 2, 2), 't1'],
];
const CONTEO = celda(3, 2);
const casillasBento = SKINS.map(([n, r, tipo]) => {
  const borde = tipo === 't1' ? `3px solid ${T1}` : tipo === 'kda' ? `3px solid ${ROSA}` : `1px solid ${a(BLANCO, 0.22)}`;
  const brillo = tipo === 't1' ? `box-shadow: 0 0 44px ${a(T1, 0.55)};` : tipo === 'kda' ? `box-shadow: 0 0 40px ${a(ROSA, 0.5)};` : 'box-shadow: 0 12px 30px rgba(0,0,0,0.55);';
  return `<div data-casilla ${tipo ? `data-${tipo}` : ''} style="position: absolute; left: ${r.x}px; top: ${r.y}px; width: ${r.w}px; height: ${r.h}px; border-radius: 14px; overflow: hidden; border: ${borde}; box-sizing: border-box; ${brillo}">
        <img src="assets/skins/Seraphine_${n}.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 25%; display: block;">
      </div>`;
}).join('\n      ');
slides.push(lamina('sera-skins', 'Sus skins: nomás wachenlas, pura calidad.', `
    ${borroso('splash/Seraphine_69-fondo.jpg', 0.36)}
    ${ambiente(50, 8, ROSA, 0.2)}
    ${ondas(187, { op: 0.24 })}
    ${notas(1717, 12)}
    ${panel(`
      <div data-conteo class="rosa" style="position: absolute; left: ${CONTEO.x}px; top: ${CONTEO.y}px; width: ${CONTEO.w}px; height: ${CONTEO.h}px; display: flex; align-items: center; justify-content: center; font-size: 190px; line-height: 1;">11</div>
      <div data-titulo-skins style="position: absolute; left: 0; right: 0; top: 10px; height: 215px;"></div>
      ${casillasBento}`)}`));

// ── 18 · sera-t1 ─────────────────────────────────────────────────────────
// La de Keria, la única que no se puede comprar: el splash de grupo, la cámara
// cae sobre Seraphine y el rojo de T1 entra solo aquí.
slides.push(lamina('sera-t1', 'La única que no puedes comprar es la de Keria: la skin T1 del campeón del mundo de 2025.', `
    ${borroso('splash/Seraphine_68-fondo.jpg', 0.46)}
    ${ambiente(50, 28, T1, 0.32)}
    ${ondas(198, { op: 0.26, c1: T1, c2: ROSA })}
    ${notas(1818, 12)}
    ${panel(`
      ${arte('splash/Seraphine_68.jpg', 'Seraphine T1, splash de grupo del equipo campeón', { y: 20, alto: 790, pos: '60% 50%' })}
      <div data-keria class="t1txt" style="position: absolute; left: 0; right: 0; top: 800px; text-align: center; font-size: 340px; line-height: 0.95; letter-spacing: 10px; padding-left: 10px;">KERIA</div>
      <div data-anio class="t1txt" style="position: absolute; left: 70px; top: 1090px; font-size: 270px; line-height: 0.95; letter-spacing: 4px;">2025</div>
      <div data-t1 style="position: absolute; left: 600px; top: 1130px; width: 410px; height: 163px; filter: drop-shadow(0 0 34px ${a(T1, 0.6)}) drop-shadow(0 18px 30px rgba(0,0,0,0.6));">
        <img src="assets/t1.png" alt="Logo de T1" style="width: 100%; height: 100%; object-fit: contain; display: block;">
      </div>`)}`));

// ── 19 · sera-pincel ─────────────────────────────────────────────────────
// Pasadas de pincel: tres splashes que se pintan con una diagonal, y las
// pinceladas de color que los cruzan.
const PINCELES = [
  [14, 'Canción del Océano', 30, '50% 30%', CIAN],
  [34, 'Guardiana Estelar', 470, '50% 30%', ROSA],
  [4, 'Fénix Etéreo', 910, '50% 32%', ROSA_CL],
];
slides.push(lamina('sera-pincel', 'Todas están pasadas de pincel, no como la cagada a la que nos tienen acostumbrados: cuando un campeón es favorito de Riot se nota.', `
    ${borroso('splash/Seraphine_34-fondo.jpg', 0.4)}
    ${ambiente(50, 50, ROSA, 0.22)}
    ${ondas(209, { op: 0.26 })}
    ${notas(1919, 14)}
    ${panel(PINCELES.map(([n, nombre, y, pos]) => arte(`splash/Seraphine_${n}.jpg`, `Seraphine ${nombre}, splash`, { y, alto: 410, pos, ancho: 1000, x: 40, attrs: 'data-lienzo' })).join('') + `
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${PINCELES.map(([, , y, , col], i) => `<path data-pincelada d="M-40 ${y + 380 - i * 30} C 220 ${y + 120 + i * 40}, 520 ${y + 480}, 780 ${y + 200 - i * 20} S 1100 ${y + 260}, 1140 ${y + 140}" fill="none" stroke="${col}" stroke-width="${46 - i * 6}" stroke-linecap="round" stroke-opacity="0.85" style="filter: drop-shadow(0 0 22px ${a(col, 0.7)});"/>`).join('')}
      </svg>`)}`));

// ── 20 · sera-cierre ─────────────────────────────────────────────────────
slides.push(lamina('sera-cierre', 'Ni pedo, solo queda decir gigi easy. Tírenme un follow.', `
    ${borroso('splash/Seraphine_69-fondo.jpg', 0.4)}
    ${ambiente(50, 45, ROSA, 0.26)}
    ${ondas(220, { op: 0.34 })}
    ${notas(2020, 18)}
    ${panel(`
      ${arte('splash/Seraphine_69.jpg', 'Seraphine Canción del Corazón, splash', { y: 0, alto: 1240, pos: '52% 30%', marco: false })}
      <div data-velo style="position: absolute; left: 0; top: 720px; width: 1080px; height: 650px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, 0.9)} 70%); pointer-events: none;"></div>
      <div data-ggez style="position: absolute; left: 0; right: 0; top: 940px; text-align: center; font-size: 340px; line-height: 1; transform: rotate(-4deg);"><span class="cierre-ros">GG EZ</span></div>`)}`));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Las ondas derivan, las notas suben y el fondo respira.
  function ambiente(tl, s, dur) {
    q(s, '[data-ondas]').forEach(function (o) { tl.fromTo(o, { x: 0 }, { x: -1080, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-brasa]').forEach(function (m, i) {
      tl.fromTo(m, { y: 40 + (i % 5) * 14, opacity: 0 }, { y: -80 - (i % 7) * 16, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
    q(s, '[data-borroso]').forEach(function (b) { tl.fromTo(b, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'power1.out' }, 0); });
  }
  // Anillos de sonido que salen de su centro, uno tras otro.
  function pulsos(tl, s, sel, en, cada, dur, hasta) {
    var el = typeof sel === 'string' ? q(s, sel) : sel;
    Array.prototype.forEach.call(el, function (r, i) {
      tl.fromTo(r, { scale: 0.35, opacity: 0.9, transformOrigin: '50% 50%', svgOrigin: r.getAttribute('cx') + ' ' + r.getAttribute('cy') }, { scale: hasta || 1.7, opacity: 0, svgOrigin: r.getAttribute('cx') + ' ' + r.getAttribute('cy'), duration: dur || 1.3, ease: 'power2.out', immediateRender: false }, en + i * (cada || 0.4));
    });
  }

  animar('sera-portada', function (tl, s) {
    ambiente(tl, s, 3.4);
    efecto('contador', tl, uno(s, '[data-seis]'), { cuenta: 6, dur: 1.0, en: 0.2 });
    tl.from(uno(s, '[data-seis]'), { scale: 0.8, opacity: 0.25, duration: 1.3, ease: 'power3.out' }, 0.2)
      .from(uno(s, '[data-carta]'), { y: 130, opacity: 0, scale: 0.9, duration: 0.9 }, 0.3)
      .from(uno(s, '[data-carta] [data-img]'), { scale: 1.2, duration: 3, ease: 'power2.out' }, 0.3);
    pulsos(tl, s, '[data-anillo]', 0.6, 0.28, 1.6, 1.9);
  });

  animar('sera-kda', function (tl, s) {
    ambiente(tl, s, 3.8);
    q(s, '[data-forma]').forEach(function (f, i) {
      tl.from(f, { x: i % 2 ? 140 : -140, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.15 + i * 0.7)
        .from(f.querySelector('[data-img]'), { scale: 1.25, duration: 1.6, ease: 'power2.out' }, 0.15 + i * 0.7);
      var on = f.querySelectorAll('[data-estrella-on]');
      tl.from(on, { scale: 0, transformOrigin: '50% 50%', svgOrigin: undefined, duration: 0.4, stagger: 0.14, ease: 'back.out(2.6)' }, 0.55 + i * 0.7);
    });
  });

  animar('sera-skillshots', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(q(s, '[data-icono-q], [data-icono-e], [data-icono-r]'), { y: -80, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.12, ease: 'back.out(1.6)' }, 0.1)
      .from(uno(s, '[data-guia]'), { opacity: 0, duration: 0.5 }, 0.5)
      .from(uno(s, '[data-forma-q]'), { opacity: 0, scale: 0.4, transformOrigin: '190px 610px', svgOrigin: '190 610', duration: 0.55, ease: 'back.out(1.7)' }, 0.8)
      .from(uno(s, '[data-forma-e]'), { opacity: 0, scaleY: 0, svgOrigin: '540 370', duration: 0.55, ease: 'power3.out' }, 1.0)
      .from(uno(s, '[data-forma-r]'), { opacity: 0, scaleY: 0, svgOrigin: '890 370', duration: 0.55, ease: 'power3.out' }, 1.2)
      .from(uno(s, '[data-icono-pasiva]'), { y: 90, opacity: 0, scale: 0.8, duration: 0.6, ease: 'back.out(1.8)' }, 1.8)
      .from(uno(s, '[data-hilo-pasiva]'), { opacity: 0, duration: 0.7 }, 2.2);
    pulsos(tl, s, q(s, '[data-anillo]'), 2.2, 0.3, 1.0, 1.6);
    tl.from(q(s, '[data-eco]'), { opacity: 0, y: -30, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 2.8);
  });

  animar('sera-w', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-icono-w]'), { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.1)
      .fromTo(uno(s, '[data-escudo]'), { scale: 0.3, opacity: 0, svgOrigin: '540 430' }, { scale: 1, opacity: 1, svgOrigin: '540 430', duration: 0.8, ease: 'power3.out', immediateRender: true }, 0.4);
    pulsos(tl, s, '[data-anillo]', 0.6, 0.35, 1.4, 1.9);
    // Aceleran: arrancan lento y se van, con la estela creciendo.
    q(s, '[data-corre]').forEach(function (c, i) {
      tl.from(c, { opacity: 0, duration: 0.3 }, 0.9 + i * 0.1)
        .fromTo(c, { x: 80 + i * 40 }, { x: 760 + i * 20, duration: 2.6, ease: 'power3.in', immediateRender: false }, 1.2 + i * 0.1)
        .fromTo(c.querySelector('[data-estela]'), { scaleX: 0.2, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 2.6, ease: 'power3.in', immediateRender: false }, 1.2 + i * 0.1);
    });
  });

  animar('sera-ulti', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-icono-r]'), { y: 120, opacity: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.7)' }, 0.1);
    var tramos = q(s, '[data-tramo]'), al = q(s, '[data-aliado]');
    for (var i = 0; i < tramos.length; i++) {
      var t = 0.7 + i * 0.95;
      tl.from(tramos[i], { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, t)
        .from(al[i], { scale: 0, opacity: 0, svgOrigin: undefined, duration: 0.4, ease: 'back.out(2.4)' }, t + 0.45)
        .fromTo(al[i].querySelector('[data-ping]'), { opacity: 1, scale: 0.4, svgOrigin: al[i].querySelector('[data-ping]').getAttribute('cx') + ' ' + al[i].querySelector('[data-ping]').getAttribute('cy') }, { opacity: 0, scale: 2.2, svgOrigin: al[i].querySelector('[data-ping]').getAttribute('cx') + ' ' + al[i].querySelector('[data-ping]').getAttribute('cy'), duration: 0.8, ease: 'power2.out', immediateRender: false }, t + 0.5);
    }
  });

  animar('sera-sona', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-sona]'), { y: -80, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-sona] [data-img]'), { scale: 1.16, duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-sera]'), { y: 360, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.5)
      .from(uno(s, '[data-sera] [data-img]'), { scale: 1.2, duration: 3, ease: 'power2.out' }, 0.5)
      .from(q(s, '[data-flecha]'), { drawSVG: '0%', opacity: 0, duration: 0.5, stagger: 0.18, ease: 'power2.out' }, 1.4);
  });

  animar('sera-cuarto', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '30% 50%', duration: 3.6, ease: 'power2.out' }, 0);
  });

  // El ruido: las ondas se amontonan, la carta tiembla y los anillos aprietan.
  animar('sera-ruido', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.fromTo(q(s, '[data-ondas] path'), { scaleY: 0.35, transformOrigin: '50% 50%' }, { scaleY: 1.5, duration: 1.4, ease: 'power2.in', stagger: 0.04 }, 0);
    var c = uno(s, '[data-arte]');
    for (var k = 0; k < 14; k++) tl.to(c, { x: (k % 2 ? 7 : -7), y: (k % 3 - 1) * 4, duration: 0.07, ease: 'none' }, 0.5 + k * 0.1);
    tl.to(c, { x: 0, y: 0, duration: 0.1 }, 1.95);
    pulsos(tl, s, '[data-anillo]', 0.2, 0.12, 1.1, 2.1);
  });

  // El silencio: las ondas se congelan y se apagan, la carta se va a duotono y
  // el cristal late.
  animar('sera-silencio', function (tl, s) {
    ambiente(tl, s, 1.0);
    tl.fromTo(q(s, '[data-ondas] path'), { scaleY: 1.2, transformOrigin: '50% 50%' }, { scaleY: 0.04, duration: 0.5, ease: 'power4.out', stagger: 0.02 }, 0)
      .to(uno(s, '[data-ondas]'), { opacity: 0.25, duration: 0.8 }, 0.4)
      .to(uno(s, '[data-img]'), { filter: 'grayscale(1) brightness(0.55) contrast(1.1) sepia(0.2) hue-rotate(170deg)', duration: 0.7 }, 0.1)
      .fromTo(uno(s, '[data-brillo-cristal]'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, 0.9)
      .to(uno(s, '[data-brillo-cristal]'), { opacity: 0.45, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 1.6);
  });

  animar('sera-cristal', function (tl, s) {
    ambiente(tl, s, 4.6);
    tl.from(uno(s, '[data-gema]'), { scale: 0.2, opacity: 0, rotation: -25, svgOrigin: '${GEMA.x} ${GEMA.y}', duration: 0.9, ease: 'back.out(1.6)' }, 0.1)
      .to(uno(s, '[data-gema]'), { scale: 1.06, svgOrigin: '${GEMA.x} ${GEMA.y}', duration: 0.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 1.0);
    pulsos(tl, s, '[data-anillo]', 0.9, 0.5, 1.6, 1.8);
    tl.from(uno(s, '[data-skarner]'), { y: 200, opacity: 0, scale: 0.7, duration: 0.8, ease: 'back.out(1.5)' }, 2.6)
      .from(uno(s, '[data-skarner] [data-img]'), { scale: 1.3, duration: 2.2, ease: 'power2.out' }, 2.6);
  });

  animar('sera-estrella', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.9 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.2, transformOrigin: '80% 50%', duration: 3.6, ease: 'power2.out' }, 0)
      .fromTo(uno(s, '[data-haz]'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7)
      .to(uno(s, '[data-haz]'), { opacity: 0.35, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.2);
  });

  animar('sera-zaun', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0);
    efecto('camara', tl, uno(s, '[data-arte]'), { focos: '55 20 1.5; 48 50 1.15', en: 0.5, dur: 2.2, pausa: 0.3 });
  });

  animar('sera-entresuelo', function (tl, s) {
    ambiente(tl, s, 4.2);
    tl.from(uno(s, '[data-circulo]'), { scale: 0.55, opacity: 0, duration: 0.9, ease: 'back.out(1.5)' }, 0)
      .from(uno(s, '[data-circulo] [data-img]'), { scale: 1.25, duration: 3.4, ease: 'power2.out' }, 0);
    pulsos(tl, s, '[data-anillo]', 0.5, 0.3, 1.8, 1.8);
  });

  animar('sera-otp', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .fromTo(uno(s, '[data-arte] [data-img]'), { scale: 1 }, { scale: 1.25, transformOrigin: '50% 22%', duration: 3.6, ease: 'power2.out', immediateRender: true }, 0)
      .from(uno(s, '[data-pastilla]'), { xPercent: -110, duration: 0.7, ease: 'power3.out' }, 0.45)
      .from(uno(s, '[data-nombre-otp]'), { opacity: 0, letterSpacing: '60px', duration: 0.8, ease: 'power3.out' }, 0.8);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 9087627, separador: '.', dur: 1.6, en: 1.2 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 1.2)
      .from(uno(s, '[data-halo]'), { scale: 0.3, opacity: 0, duration: 0.9 }, 2.4)
      .from(uno(s, '[data-emblema]'), { y: -300, rotation: -25, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 2.4);
  });

  animar('sera-historial', function (tl, s) {
    if (window.continua) continua(tl, s);
    ambiente(tl, s, 5.6);
    tl.from(q(s, '[data-banda] rect'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.08, ease: 'power3.inOut' }, 0.1)
      .from(q(s, '[data-emblema-eje]:not([data-continua])'), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2.2)' }, 0.25)
      .from(q(s, '[data-anio]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, 0.3);
    var pts = q(s, '[data-punto]');
    // Del 2021 a los Retador de 2024: cada punto aparece cuando la línea lo alcanza.
    tl.from(uno(s, '[data-linea-a]'), { drawSVG: '0%', duration: 2.4, ease: 'none' }, 0.6);
    for (var i = 0; i <= 6; i++) tl.from(pts[i], { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 0.6 + 2.4 * i / 6);
    // La caída de 2025 se dibuja de golpe; la vuelta sube con rebote.
    tl.from(uno(s, '[data-linea-b]'), { drawSVG: '0%', duration: 0.22, ease: 'power4.in' }, 3.1)
      .from(pts[7], { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' }, 3.3)
      .from(uno(s, '[data-linea-c]'), { drawSVG: '0%', duration: 0.9, ease: 'back.out(1.4)' }, 3.55)
      .from(pts[8], { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)' }, 4.3)
      .from(uno(s, '[data-pico]'), { drawSVG: '0%', duration: 0.5 }, 4.5)
      .from(uno(s, '[data-pico-punto]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 4.9)
      .fromTo(uno(s, '[data-pulso]'), { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, 4.4);
  });

  animar('sera-latam', function (tl, s) {
    ambiente(tl, s, 3.8);
    // Caen una tras otra, como el mazo.
    q(s, '[data-tarjeta]').forEach(function (t, i) {
      tl.from(t, { y: -900, rotation: i ? 4 : -4, opacity: 0, duration: 0.8, ease: 'bounce.out' }, 0.1 + i * 0.7)
        .from(t.querySelector('[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.0, ease: 'power2.out' }, 0.7 + i * 0.7);
      efecto('contador', tl, t.querySelector('[data-puntos-tarj]'), { cuenta: parseInt(t.querySelector('[data-puntos-tarj]').getAttribute('data-valor'), 10), separador: '.', dur: 1.3, en: 0.4 + i * 0.7 });
    });
  });

  animar('sera-skins', function (tl, s) {
    ambiente(tl, s, 4.2);
    efecto('contador', tl, uno(s, '[data-conteo]'), { cuenta: 11, dur: 0.9, en: 0.1 });
    tl.from(uno(s, '[data-conteo]'), { scale: 0.5, opacity: 0.2, duration: 0.8, ease: 'back.out(1.8)' }, 0.1)
      .fromTo(q(s, '[data-casilla]'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.09 }, 0.25)
      .to(uno(s, '[data-t1]'), { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.7);
  });

  animar('sera-t1', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.8 }, 0);
    efecto('camara', tl, uno(s, '[data-arte]'), { focos: '50 50 1; 61 42 2.0', en: 0.6, dur: 1.3, pausa: 0.2 });
    tl.from(uno(s, '[data-keria]'), { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power4.in' }, 1.0);
    efecto('contador', tl, uno(s, '[data-anio]'), { cuenta: 2025, desde: 2005, separador: '', dur: 1.1, en: 1.5 });
    tl.from(uno(s, '[data-anio]'), { x: -60, opacity: 0, duration: 0.6 }, 1.5);
    efecto('sello', tl, uno(s, '[data-t1]'), { en: 2.1, desde: 2.4, fuerza: 14, temblor: 'no' });
  });

  animar('sera-pincel', function (tl, s) {
    ambiente(tl, s, 3.6);
    var lienzos = q(s, '[data-lienzo]'), trazos = q(s, '[data-pincelada]');
    for (var i = 0; i < lienzos.length; i++) {
      efecto('cortinilla', tl, lienzos[i], { forma: 'diagonal', en: 0.15 + i * 0.5, dur: 0.9, ease: 'power2.inOut' });
      tl.from(lienzos[i].querySelector('[data-img]'), { scale: 1.2, duration: 2.4, ease: 'power2.out' }, 0.15 + i * 0.5)
        .from(trazos[i], { drawSVG: '0%', duration: 1.0, ease: 'power2.inOut' }, 0.15 + i * 0.5)
        .to(trazos[i], { opacity: 0.4, duration: 0.7, ease: 'power1.in' }, 1.5 + i * 0.5);
    }
  });

  animar('sera-cierre', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 40, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '52% 30%', duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-velo]'), { opacity: 0, duration: 0.6 }, 0.4)
      .from(uno(s, '[data-ggez]'), { scale: 2.4, opacity: 0, duration: 0.45, ease: 'power4.in' }, 1.5);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Seraphine cumple 6 años</title>
${kit.og({ titulo: 'Seraphine cumple 6 años', descripcion: 'Cumplelolero #28: salió con skin definitiva, el OTP número uno es de LAN y cinco veces Retador, el top 2 del mundo es latino y la skin T1 es la de Keria.', carpeta: 'creator/seraphine' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .rosa { background: linear-gradient(180deg, #FFFFFF 0%, ${ROSA_CL} 34%, ${ROSA} 68%, #C23A7A 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 28px ${a(ROSA, 0.5)}); }
  .cian { background: linear-gradient(180deg, #FFFFFF 0%, #C6F6FB 36%, ${CIAN} 70%, #2A9BB0 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(CIAN, 0.5)}); }
  .t1txt { background: linear-gradient(180deg, #FFFFFF 0%, #FFC8CF 32%, ${T1} 70%, #7A0018 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 30px rgba(2,2,12,0.9)); }
  .cierre-ros { background: linear-gradient(180deg, #FFFFFF 0%, ${BLANCO} 38%, ${ROSA} 75%, #C23A7A 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 30px rgba(2,2,12,0.95)); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(ROSA, 0.5)}; border-radius: 999px;
    background: rgba(10,11,30,0.85); color: ${ROSA_CL}; cursor: pointer;
    font: 600 13px/1 system-ui, sans-serif; letter-spacing: 0.6px;
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
${kit.gsap(__dirname, ['DrawSVG'])}
${kit.efectos()}
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
