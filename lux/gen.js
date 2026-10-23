// Generador de index.html — Lux cumple 16 años (láminas para el montaje automático)
// Ejecutar: node lux/gen.js
//
// Serie «Cumplelolero» #25 y el **primer episodio del montaje automático**:
// cada lámina se vuelve un miniclip que va abajo del gameplay del prereel, así
// que se diseña para el **panel de 1080×1370** que recorta
// `crop=1080:1370:0:275` (el encuadre de los flyers de suiza). Todo lo
// importante vive dentro de ese panel (`PANEL` abajo); fuera solo hay fondo.
// `tools/laminas.mjs lux` corta los clips, el último cuadro y el manifest.
//
// Criterio de jinx, solo assets visuales: **el único texto es el que es el
// dato** — la edad, los puntos, el nombre del OTP, los rangos de la gráfica, el
// conteo de skins y «GG EZ». Sin dinero, como desde nasus.
//
// ⚠️ **Ningún clip arranca en negro**: los fondos (copias desenfocadas, rayos,
// lavados) se ven desde el cuadro 0 y lo que entra es el primer plano; en el
// video de suiza el arranque en negro se veía como un destello.
// ⚠️ Los dos «crece» del bento (Elementalista en las skins y Pandástica en la
// suya) dejan como **estado final en CSS la skin ya expandida**: el PNG del
// último cuadro y la vista sin JS son esa skin, y la timeline arranca desde la
// casilla del bento con from().
// ⚠️ No hay arte oficial de los lobos sable: la lámina de los lobos es la luz
// (Chispa Final, 01DE042T3). El nombre del OTP de LAN no va en pantalla.
//
// Datos: el paquete de Axl del 19/10/2026 (ChampionMastery.GG, op.gg, wiki y
// bio oficial es-MX). Arte: Data Dragon (pantallas de carga y splashes),
// Legends of Runeterra es_mx (cartas, a 1600 px en JPEG con su copia de 360 px
// para el fondo borroso) y emblemas de rango de CommunityDragon recortados a
// su contenido (el de Diamante solo existe a 320 px de contenido).
const fs = require('fs');
const kit = require('../tools/kit.cjs');
// Los fondos (copia desenfocada, lavados, rayos o humo) llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta: la luz de Lux sobre azul demaciano ───────────────────────────
const BG = '#0B1530';        // azul de Demacia
const LUZ = '#FFE9A8';       // acento: su luz
const PRISMA = '#8FD3FF';    // la Barrera Prismática — estructura y datos
const ORO = '#E5C36A';       // dorado pálido: prestigio y marcos
const HUESO = '#F6F1E4';
const MUTED = '#8A97B8';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const a = kit.alpha;

// El panel que se recorta para el video: 1080×1370 a partir de y = 275.
const PANEL = { top: 275, w: 1080, h: 1370 };

// ── Piezas comunes ───────────────────────────────────────────────────────
// PRNG con semilla: las motas y los destellos salen siempre en el mismo sitio.
function prng(semilla) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const SECCION = `background: ${BG}; color: ${HUESO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Copia desenfocada del arte a todo el lienzo (archivo propio de 360 px).
const borroso = (src, brillo = 0.5) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(48px) saturate(1.15) brightness(${brillo});"></div>
    </div>`;

// Lavado de luz desde arriba y viñeta: el fondo nunca es plano ni negro.
const ambiente = (x = 50, y = 18) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(70% 45% at ${x}% ${y}%, ${a(LUZ, 0.22)}, ${a(LUZ, 0)} 70%), radial-gradient(120% 80% at 50% 110%, ${a(PRISMA, 0.16)}, ${a(PRISMA, 0)} 60%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,8,20,0.65) 100%);"></div>`;

// Rayos de luz en abanico desde un punto (coordenadas del lienzo).
const rayos = (x, y, fuerza = 0.16, tam = 2400) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;"><div data-rayos style="position: absolute; left: ${x - tam / 2}px; top: ${y - tam / 2}px; width: ${tam}px; height: ${tam}px; pointer-events: none; mix-blend-mode: screen; opacity: 0.9;
      background: repeating-conic-gradient(from 0deg at 50% 50%, ${a(LUZ, fuerza)} 0deg 3deg, ${a(LUZ, 0)} 6deg 15deg);
      -webkit-mask-image: radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.5) 35%, transparent 75%); mask-image: radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.5) 35%, transparent 75%);"></div></div>`;

// Motas de luz flotando dentro del panel.
const motas = (semilla, n = 22) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 1020), y = Math.round(PANEL.top + 40 + r() * (PANEL.h - 80));
    const t = (3 + r() * 9).toFixed(1), col = r() < 0.7 ? LUZ : PRISMA, op = (0.35 + r() * 0.55).toFixed(2);
    h += `<span data-mota style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; border-radius: 50%; background: ${col}; opacity: ${op}; box-shadow: 0 0 ${t * 3}px ${col}; pointer-events: none;"></span>`;
  }
  return `<div style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

// El panel: todo lo importante va aquí dentro.
const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

// Carta de LoR o splash entera, de borde a borde, centrada en el panel.
const arteAncho = (src, alt, { y = null, alto = 540, extra = '' } = {}) => {
  const top = y == null ? (PANEL.h - alto) / 2 : y;
  return `
      <div data-arte style="position: absolute; left: 0; top: ${top}px; width: 1080px; height: ${alto}px; overflow: hidden; box-shadow: 0 40px 100px rgba(2,6,18,0.7), 0 0 0 1px ${a(LUZ, 0.18)};">
        <img data-img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; display: block;">${extra}
      </div>`;
};

const lamina = (id, notas, cuerpo) => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION}">${cuerpo}
  </section>`;

const slides = [];

// ── lux-portada ──────────────────────────────────────────────────────────
// La pantalla de carga como carta enmarcada, el 16 gigante detrás.
slides.push(lamina('lux-portada', 'Buen lunes. Hoy cumple anos la campeona que te encuentras en todas las partidas de bronce: la support que nunca te pone un escudo pero eso si te roba todas las kills con la Ultimate. Lux cumple dieciseis anos.', `
    ${borroso('Lux_0-fondo.jpg', 0.55)}
    ${ambiente(50, 30)}
    ${rayos(540, PANEL.top + 520, 0.14)}
    ${motas(25)}
    ${panel(`
      <div data-dieciseis class="luz" style="position: absolute; left: 0; right: 0; top: -40px; text-align: center; font-size: 920px; line-height: 1; opacity: 0.92;">16</div>
      <div data-carta style="position: absolute; left: ${540 - 190}px; top: 450px; width: 380px; height: 691px; border-radius: 22px; overflow: hidden; border: 3px solid ${ORO}; box-shadow: 0 0 0 10px ${a(BG, 0.55)}, 0 0 90px ${a(LUZ, 0.45)}, 0 40px 90px rgba(2,6,18,0.7);">
        <img data-img src="assets/skins/Lux_0.jpg" alt="Lux, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
        <div data-brillo style="position: absolute; top: -20%; bottom: -20%; left: -60%; width: 40%; background: linear-gradient(100deg, rgba(255,255,255,0), ${a(LUZ, 0.55)}, rgba(255,255,255,0)); transform: rotate(12deg);"></div>
      </div>
      <div data-nombre style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font-size: 230px; line-height: 0.9; letter-spacing: 18px; padding-left: 18px;">${'LUX'.split('').map(c => `<span data-letra class="luz" style="display: inline-block;">${c}</span>`).join('')}</div>`)}`));

// ── lux-otp ──────────────────────────────────────────────────────────────
// El emblema de Diamante con rebote, los puntos que cuentan y la línea de
// rango 2020–2026 con los emblemas de cada liga como eje.
const HIST = [['2020', 8], ['2021', 8], ['2022', 3], ['2023', 8], ['2023', 6], ['2024', 7], ['2024', 10], ['2024', 7], ['2025', 7], ['2026', 9]];
// valor = base de la liga + (4 − división): Platino 0, Esmeralda 4, Diamante 8 → P1 = 3, D3 = 9, D1 = 11.
const PICO = 11;
const GW = 960, GH = 680, ML = 118, MR = 46, MT = 40, MB = 74;
const VMIN = 2.3, VMAX = 11.9;
const gx = (i) => ML + 24 + i * ((GW - ML - MR - 48) / (HIST.length - 1));
const gy = (v) => MT + ((VMAX - v) / (VMAX - VMIN)) * (GH - MT - MB);
// Curva monótona (Fritsch–Carlson): suave pero sin pasarse de los valores reales.
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
const puntos = HIST.map(([, v], i) => [gx(i), gy(v)]);
const linea = monotona(puntos);
const area = `${linea} L${gx(HIST.length - 1).toFixed(1)} ${GH - MB} L${gx(0).toFixed(1)} ${GH - MB} Z`;
const LIGAS = [['platinum', 'Platino', 0, 4, '#3FC1B0', 74], ['emerald', 'Esmeralda', 4, 8, '#36D486', 80], ['diamond', 'Diamante', 8, 12, '#9DB8FF', 92]];
const bandas = LIGAS.map(([img, nombre, lo, hi, col, w], k) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN));
  return `<g data-banda>
        <rect x="${ML}" y="${y1.toFixed(1)}" width="${GW - ML - MR + 20}" height="${(y2 - y1).toFixed(1)}" rx="14" fill="${col}" fill-opacity="${0.07 + k * 0.03}"/>
        <line x1="${ML}" x2="${GW - MR + 20}" y1="${y1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${col}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 8"/>
        <image data-emblema-eje href="assets/emblemas/${img}.png" x="${ML - w - 14}" y="${((y1 + y2) / 2 - w * 0.36).toFixed(1)}" width="${w}" height="${(w * 0.72).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/>
      </g>`;
}).join('');
const años = [...new Set(HIST.map(h => h[0]))].map(y => {
  const idx = HIST.map((h, i) => (h[0] === y ? i : -1)).filter(i => i >= 0);
  const x = idx.reduce((s, i) => s + gx(i), 0) / idx.length;
  return `<text data-anio x="${x.toFixed(1)}" y="${GH - 26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="23" font-weight="600" fill="${MUTED}">${y}</text>`;
}).join('');
const ultimo = puntos[puntos.length - 1];
const grafica = `
      <svg data-grafica viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" style="position: absolute; left: 60px; top: 610px; overflow: visible;">
        <defs>
          <linearGradient id="trazo-rango" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${PRISMA}"/><stop offset="1" stop-color="${LUZ}"/></linearGradient>
          <linearGradient id="area-rango" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${LUZ}" stop-opacity="0.32"/><stop offset="1" stop-color="${LUZ}" stop-opacity="0"/></linearGradient>
          <filter id="brillo-rango" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        ${bandas}
        ${años}
        <path data-area d="${area}" fill="url(#area-rango)"/>
        <path data-linea d="${linea}" fill="none" stroke="url(#trazo-rango)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#brillo-rango)"/>
        ${puntos.map(([x, y], i) => `<circle data-punto data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === puntos.length - 1 ? 13 : 9}" fill="${BG}" stroke="${i === puntos.length - 1 ? LUZ : PRISMA}" stroke-width="${i === puntos.length - 1 ? 6 : 4}"/>`).join('')}
        <circle data-pulso cx="${ultimo[0].toFixed(1)}" cy="${ultimo[1].toFixed(1)}" r="13" fill="none" stroke="${LUZ}" stroke-width="3" opacity="0"/>
        <g data-pico>
          <line x1="${ultimo[0].toFixed(1)}" x2="${ultimo[0].toFixed(1)}" y1="${(ultimo[1] - 18).toFixed(1)}" y2="${(gy(PICO) + 16).toFixed(1)}" stroke="${LUZ}" stroke-width="3" stroke-dasharray="6 7"/>
          <circle cx="${ultimo[0].toFixed(1)}" cy="${gy(PICO).toFixed(1)}" r="11" fill="${LUZ}"/>
          <text x="${(ultimo[0] - 26).toFixed(1)}" y="${(gy(PICO) + 14).toFixed(1)}" text-anchor="end" font-family="Bebas Neue, Impact" font-size="46" fill="${LUZ}">D1</text>
        </g>
        <text data-etiqueta x="${(ultimo[0] - 28).toFixed(1)}" y="${(ultimo[1] + 46).toFixed(1)}" text-anchor="end" font-family="Bebas Neue, Impact" font-size="46" fill="${HUESO}">D3</text>
      </svg>`;
slides.push(lamina('lux-otp', 'Vamos a empezar por el one trick pony con mas puntos del mundo. Es un europeo con dieciocho millones seiscientos mil puntos, ahorita en Diamante tres y esta temporada llego hasta Diamante uno. Lleva desde dos mil veinte entre Platino y Diamante.', `
    ${ambiente(50, 12)}
    ${rayos(540, PANEL.top + 160, 0.12)}
    ${motas(118, 16)}
    ${panel(`
      <div data-halo style="position: absolute; left: 340px; top: -40px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(closest-side, ${a(PRISMA, 0.5)}, ${a(PRISMA, 0)});"></div>
      <img data-continua="emblema" data-emblema src="assets/emblemas/diamond.png" alt="Emblema de Diamante" style="position: absolute; left: ${540 - 190}px; top: 40px; width: 380px; height: auto; filter: drop-shadow(0 0 30px ${a(PRISMA, 0.6)});">
      <div data-puntos class="luz" style="position: absolute; left: 0; right: 0; top: 285px; text-align: center; font-size: 200px; line-height: 1;">18.608.676</div>
      <div data-otp style="position: absolute; left: 0; right: 0; top: 488px; text-align: center; font-size: 74px; line-height: 1; letter-spacing: 14px; padding-left: 14px; color: ${PRISMA};">44MLT44</div>
      ${grafica}`)}`));

// ── lux-lan ──────────────────────────────────────────────────────────────
// El emblema viaja desde la lámina anterior y se encoge junto al #2.
slides.push(lamina('lux-lan', 'Y el numero dos del mundo es de los nuestros, del servidor del norte, con dieciseis millones y medio de puntos y en Diamante dos. Pilas con eso, que tambien hay latinos que saben jugar.', `
    ${ambiente(50, 40)}
    ${rayos(540, PANEL.top + 560, 0.13)}
    ${motas(203, 18)}
    ${panel(`
      <div data-halo style="position: absolute; left: 70px; top: 300px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(closest-side, ${a(PRISMA, 0.45)}, ${a(PRISMA, 0)});"></div>
      <img data-continua="emblema" data-emblema src="assets/emblemas/diamond.png" alt="Emblema de Diamante" style="position: absolute; left: 110px; top: 420px; width: 340px; height: auto; filter: drop-shadow(0 0 30px ${a(PRISMA, 0.6)});">
      <div data-numero class="luz" style="position: absolute; left: 470px; top: 210px; width: 560px; text-align: center; font-size: 600px; line-height: 1;">#2</div>
      <div data-lan style="position: absolute; left: 0; right: 0; top: 820px; text-align: center; font-size: 230px; line-height: 1; letter-spacing: 40px; padding-left: 40px; color: ${PRISMA}; text-shadow: 0 0 40px ${a(PRISMA, 0.5)};">LAN</div>
      <div data-puntos style="position: absolute; left: 0; right: 0; top: 1060px; text-align: center; font-size: 180px; line-height: 1; color: ${HUESO};">16.557.803</div>`)}`));

// ── lux-luz ──────────────────────────────────────────────────────────────
// La carta de Lux, con la luz que le crece desde la mano.
// La carta se ve a 720 de alto (cover): 1440 de ancho recortado a 1080.
const ALTO_LUZ = 720, MANO = { x: 0.545 * 2 * ALTO_LUZ - (2 * ALTO_LUZ - 1080) / 2, y: 0.2 * ALTO_LUZ };
slides.push(lamina('lux-luz', 'Ahora si, el lore. Lux nacio en Lago Plateado, en Demacia, en la familia Guardia de la Corona, que lleva generaciones protegiendo a los reyes.', `
    ${borroso('cartas/01DE042-fondo.jpg', 0.6)}
    ${ambiente(55, 30)}
    ${motas(310, 20)}
    ${panel(`
      ${rayos(MANO.x, (PANEL.h - ALTO_LUZ) / 2 + MANO.y, 0.18, 1800).replace('position: absolute;', 'position: absolute; z-index: 2;')}
      ${arteAncho('cartas/01DE042.jpg', 'Lux, carta de Legends of Runeterra', {
        alto: ALTO_LUZ,
        extra: `
        <div data-destello style="position: absolute; left: ${MANO.x - 260}px; top: ${MANO.y - 260}px; width: 520px; height: 520px; border-radius: 50%; mix-blend-mode: screen; background: radial-gradient(closest-side, rgba(255,255,255,0.95), ${a(LUZ, 0.6)} 30%, ${a(LUZ, 0)} 100%);"></div>`,
      })}`)}`));

// ── lux-familia ──────────────────────────────────────────────────────────
// Tianna y Garen caen como cartas sobre la mesa.
const cartaMesa = (src, alt, top, giro) => `
      <div data-carta style="position: absolute; left: 50px; top: ${top}px; width: 980px; height: 490px; border-radius: 20px; overflow: hidden; border: 6px solid ${ORO}; transform: rotate(${giro}deg); box-shadow: 0 0 0 2px ${a(BG, 0.8)}, 0 40px 90px rgba(2,6,18,0.75), 0 0 60px ${a(LUZ, 0.25)};">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>`;
slides.push(lamina('lux-familia', 'Su abuelo le salvo la vida al rey en una batalla y su tia Tianna comandaba la Vanguardia Valerosa. Y su hermano mayor es Garen.', `
    ${borroso('cartas/01DE012-fondo.jpg', 0.45)}
    ${ambiente(50, 20)}
    ${motas(415, 18)}
    ${panel(`
      ${cartaMesa('cartas/01DE002.jpg', 'Tianna Guardia de la Corona, carta de Legends of Runeterra', 150, -3)}
      ${cartaMesa('cartas/01DE012.jpg', 'Garen, carta de Legends of Runeterra', 730, 2.5)}`)}`));

// ── lux-prohibido ────────────────────────────────────────────────────────
// El buscamagos a la puerta, que se apaga a un duotono frío.
slides.push(lamina('lux-prohibido', 'El problema es que en Demacia la magia esta prohibida. A los magos los encarcelan o los exilian, y a su propio tio lo habia matado un mago unos anos antes.', `
    ${borroso('cartas/01DE023-fondo.jpg', 0.4)}
    <div data-fondo data-frio style="position: absolute; inset: 0; background: ${a('#0A1F4A', 0.35)}; mix-blend-mode: multiply; pointer-events: none;"></div>
    ${panel(`
      ${arteAncho('cartas/01DE023.jpg', 'Investigador buscamagos, carta de Legends of Runeterra', {
        alto: 720,
        extra: `
        <div data-tinte style="position: absolute; inset: 0; background: linear-gradient(180deg, #4A6FC0, #1A2E66); mix-blend-mode: color; opacity: 0.7;"></div>
        <div style="position: absolute; inset: 0; background: radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(3,8,22,0.55) 100%);"></div>`,
      }).replace('<img data-img', '<img data-img data-gris').replace('display: block;">', 'display: block; filter: grayscale(1) brightness(1.05) contrast(1.1);">')}
      <div data-barras style="position: absolute; left: 0; right: 0; top: ${(PANEL.h - 720) / 2}px; height: 720px; pointer-events: none; background: repeating-linear-gradient(90deg, rgba(3,8,22,0.5) 0 10px, rgba(3,8,22,0) 10px 154px);"></div>`)}`));

// ── lux-lobos ────────────────────────────────────────────────────────────
// Un punto de luz que estalla en blanco y deja la Chispa Final.
slides.push(lamina('lux-lobos', 'Una noche, regresando a casa, la atacaron unos lobos sable y del puro miedo solto un torrente de luz que acabo con todos. Asi se entero de que ella era justo lo que su reino mas odiaba.', `
    ${borroso('cartas/01DE042T3-fondo.jpg', 0.45)}
    ${ambiente(50, 50)}
    ${rayos(540, PANEL.top + 685, 0.2, 2600)}
    ${motas(512, 26)}
    ${panel(`
      <div data-chispa style="position: absolute; left: ${540 - 470}px; top: ${685 - 470}px; width: 940px; height: 940px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 120px ${a(LUZ, 0.55)}, 0 0 0 4px ${a(LUZ, 0.5)};">
        <img data-img src="assets/cartas/01DE042T3.webp" alt="Chispa Final, carta de Legends of Runeterra" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
      <div data-estallido style="position: absolute; left: ${540 - 700}px; top: ${685 - 700}px; width: 1400px; height: 1400px; border-radius: 50%; background: radial-gradient(closest-side, #FFFFFF 0%, #FFFFFF 40%, ${a(LUZ, 0.9)} 62%, ${a(LUZ, 0)} 100%); opacity: 0; pointer-events: none;"></div>
      <div data-nucleo style="position: absolute; left: ${540 - 90}px; top: ${685 - 90}px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(closest-side, #FFFFFF, ${a(LUZ, 0.8)} 40%, ${a(LUZ, 0)}); opacity: 0; pointer-events: none;"></div>`)}`));

// ── lux-16 ───────────────────────────────────────────────────────────────
// La Lux de nivel 2 se vuelve la Lux Iluminada en un fogonazo; el 16 abajo.
const ALTO_16 = 620, RAYO = { x: 0.46 * 2 * ALTO_16 - (2 * ALTO_16 - 1080) / 2, y: 0.38 * ALTO_16 };
slides.push(lamina('lux-16', 'Y a los dieciseis anos, la misma edad que cumple hoy, viajo a la capital para ver a Garen entrar a la Vanguardia. Ahi entendio que el mundo era mucho mas grande que Demacia, y hoy ama a su tierra pero quiere que sea mas justa con los magos como ella.', `
    ${borroso('cartas/09DE034-fondo.jpg', 0.5)}
    ${ambiente(50, 25)}
    ${motas(616, 20)}
    ${panel(`
      <div data-arte style="position: absolute; left: 0; top: 90px; width: 1080px; height: ${ALTO_16}px; overflow: hidden; box-shadow: 0 40px 100px rgba(2,6,18,0.7), 0 0 0 1px ${a(LUZ, 0.18)};">
        <img data-antes src="assets/cartas/01DE042T2.jpg" alt="Lux nivel 2, carta de Legends of Runeterra" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;">
        <img data-despues src="assets/cartas/09DE034.jpg" alt="Lux Iluminada, carta de Legends of Runeterra" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; clip-path: circle(150% at ${RAYO.x}px ${RAYO.y}px);">
        <div data-fogonazo style="position: absolute; left: ${RAYO.x - 600}px; top: ${RAYO.y - 600}px; width: 1200px; height: 1200px; border-radius: 50%; background: radial-gradient(closest-side, #FFFFFF 0%, ${a(LUZ, 0.95)} 35%, ${a(LUZ, 0)} 100%); opacity: 0; mix-blend-mode: screen;"></div>
      </div>
      <div data-dieciseis class="luz" style="position: absolute; left: 0; right: 0; top: 735px; text-align: center; font-size: 600px; line-height: 0.95;">16</div>`)}`));

// ── lux-skins ────────────────────────────────────────────────────────────
// Bento de las 22: 7×4 casillas, Elementalista y Pandástica en 2×2. Las de
// bóveda en gris con candado y las de prestigio con borde dorado.
const SKINS = [1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 29, 39, 40, 42, 38, 61, 70, 72];
const BOVEDA = new Set([4, 8]), PRESTIGIO = new Set([16, 39, 40, 70]);
const GRANDES = { 7: [2, 0], 72: [4, 2] }; // num → [columna, fila] de la esquina de su 2×2
const B = { x: 40, y: 262, cols: 7, filas: 4, gap: 8 };
B.cw = (1000 - (B.cols - 1) * B.gap) / B.cols; B.ch = 248;
const celdas = (() => {
  const ocupada = Array.from({ length: B.filas }, () => Array(B.cols).fill(false)), pos = {};
  for (const [n, [c, f]] of Object.entries(GRANDES)) { pos[n] = [c, f, 2]; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) ocupada[f + j][c + i] = true; }
  const resto = SKINS.filter(n => !GRANDES[n]);
  let k = 0;
  for (let f = 0; f < B.filas; f++) for (let c = 0; c < B.cols; c++) if (!ocupada[f][c]) pos[resto[k++]] = [c, f, 1];
  return pos;
})();
const rectDe = (n) => {
  const [c, f, t] = celdas[n];
  return { x: B.x + c * (B.cw + B.gap), y: B.y + f * (B.ch + B.gap), w: t * B.cw + (t - 1) * B.gap, h: t * B.ch + (t - 1) * B.gap };
};
const candado = kit.icono('tabler:lock', { tam: 46, color: HUESO, trazo: 2 });
function bento(expandida, splash, alt) {
  const piezas = { casillas: [], elegida: '' };
  SKINS.forEach(n => {
    const r = rectDe(n);
    const borde = n === 7 ? `3px solid ${LUZ}` : PRESTIGIO.has(n) ? `3px solid ${ORO}` : `1px solid ${a(HUESO, 0.2)}`;
    const brillo = n === 7 ? `box-shadow: 0 0 40px ${a(LUZ, 0.55)};` : PRESTIGIO.has(n) ? `box-shadow: 0 0 22px ${a(ORO, 0.4)};` : 'box-shadow: 0 12px 30px rgba(2,6,18,0.5);';
    const gris = BOVEDA.has(n) ? 'filter: grayscale(1) brightness(0.55);' : '';
    const sello = BOVEDA.has(n) ? `<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: ${a(BG, 0.25)};">${candado}</div>` : '';
    if (n !== expandida) {
      piezas.casillas.push(`<div data-casilla data-num="${n}" style="position: absolute; left: ${r.x}px; top: ${r.y}px; width: ${r.w}px; height: ${r.h}px; border-radius: 14px; overflow: hidden; border: ${borde}; box-sizing: border-box; ${brillo}">
          <img src="assets/skins/Lux_${n}.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block; ${gris}">${sello}
        </div>`);
      return;
    }
    // La elegida: su estado final es el panel entero con el splash.
    piezas.elegida = `<div data-elegida data-x="${r.x}" data-y="${r.y}" data-w="${r.w}" data-h="${r.h}" style="position: absolute; left: 0; top: 0; width: ${PANEL.w}px; height: ${PANEL.h}px; border-radius: 0; overflow: hidden; border: ${borde}; box-sizing: border-box; z-index: 5; ${brillo}">
          <img data-carga src="assets/skins/Lux_${n}.jpg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0;">
          <div data-splash style="position: absolute; inset: 0;">
            <div data-fondo style="position: absolute; inset: -80px; background-image: url('assets/${splash.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; filter: blur(46px) brightness(0.55) saturate(1.2);"></div>
            <img data-splash-img src="assets/${splash}" alt="${alt}" style="position: absolute; left: 0; top: ${(PANEL.h - 637) / 2}px; width: 1080px; height: 637px; object-fit: cover; display: block; box-shadow: 0 40px 100px rgba(2,6,18,0.7);">
          </div>
          <div data-barrido style="position: absolute; top: -10%; bottom: -10%; left: -70%; width: 45%; background: linear-gradient(100deg, rgba(255,255,255,0), ${a(LUZ, 0.6)}, rgba(255,255,255,0)); transform: rotate(10deg);"></div>
        </div>`;
  });
  piezas.todo = piezas.casillas.join('') + piezas.elegida;
  return piezas;
}
slides.push(lamina('lux-skins', 'Y de skins tiene veintidos. Es la campeona con mas skins que todavia puedes comprar, con dieciseis. Entre ellas la Elementalista, que es una definitiva con diez formas distintas, y si eres main Lux y no la tienes no eres main, eres un pobre.', `
    ${ambiente(50, 8)}
    ${rayos(540, PANEL.top + 120, 0.1)}
    ${panel(`
      <div data-veintidos class="luz" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 250px; line-height: 0.9;">22</div>
      ${bento(7, 'Lux_7.jpg', 'Lux Elementalista, splash').todo}`)}`));

// ── lux-pandastica ───────────────────────────────────────────────────────
// El mismo bento, apagado, y la Pandástica crece desde su casilla.
slides.push(lamina('lux-pandastica', 'Y la mas nueva es la Pandastica, donde la vistieron de panda. Riot ya no sabe que inventarle a esta morra.', `
    ${ambiente(50, 8)}
    ${rayos(540, PANEL.top + 120, 0.1)}
    ${panel(`
      <div data-veintidos class="luz" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 250px; line-height: 0.9; opacity: 0.35;">22</div>
      ${(b => `<div data-fantasmas style="position: absolute; inset: 0; opacity: 0.35;">${b.casillas.join('')}</div>${b.elegida}`)(bento(72, 'Lux_72.jpg', 'Lux Pandástica, splash'))}`)}`));

// ── cierre ───────────────────────────────────────────────────────────────
// Lux Academia de Combate y Graves Profesor de Combate, que salieron el mismo
// día de 2019 y cumplen el mismo día, en pantalla partida en diagonal.
slides.push(lamina('cierre', 'Y hoy tambien cumple Graves, pero ese wey se gano su propio video. Ni pedo, solo queda decir gigi easy. Tirenme un follow o les voy a meter la cuarta. Chao.', `
    ${borroso('Lux_0-fondo.jpg', 0.3)}
    ${ambiente(50, 50)}
    ${panel(`
      <div data-mitad="lux" style="position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 100% 560px, 0 760px);">
        <img data-img src="assets/Lux_15.jpg" alt="Lux Academia de Combate, splash" style="position: absolute; left: -60px; top: -10px; width: 1300px; height: 780px; object-fit: cover; object-position: 70% 20%;">
      </div>
      <div data-mitad="graves" style="position: absolute; inset: 0; clip-path: polygon(0 830px, 100% 630px, 100% 100%, 0 100%);">
        <img data-img src="assets/Graves_25.jpg" alt="Graves Profesor de Combate, splash" style="position: absolute; left: -110px; top: 600px; width: 1300px; height: 780px; object-fit: cover; object-position: 60% 20%;">
      </div>
      <div data-filo style="position: absolute; left: -100px; top: 694px; width: 1280px; height: 4px; background: ${LUZ}; transform: rotate(-10.5deg); box-shadow: 0 0 30px ${LUZ};"></div>
      <div data-ggez class="luz" style="position: absolute; left: 0; right: 0; top: 590px; text-align: center; font-size: 230px; line-height: 1; transform: rotate(-10.5deg); filter: drop-shadow(0 6px 30px rgba(2,6,18,0.9));">GG EZ</div>`)}`));

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Regla del montaje: el fondo ya está desde el cuadro 0; entra el primer plano.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Lo que acompaña a todas: rayos que giran despacio y motas que suben.
  function ambiente(tl, s, dur) {
    q(s, '[data-rayos]').forEach(function (r) { tl.fromTo(r, { rotation: -6 }, { rotation: 4, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-mota]').forEach(function (m, i) {
      tl.fromTo(m, { y: 30 + (i % 5) * 12, opacity: 0 }, { y: -40 - (i % 7) * 10, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
    q(s, '[data-borroso]').forEach(function (b) { tl.fromTo(b, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'power1.out' }, 0); });
  }

  animar('lux-portada', function (tl, s) {
    ambiente(tl, s, 3.2);
    efecto('contador', tl, uno(s, '[data-dieciseis]'), { cuenta: 16, dur: 1.4, en: 0.1 });
    tl.from(uno(s, '[data-dieciseis]'), { scale: 0.82, opacity: 0.25, duration: 1.4, ease: 'power3.out' }, 0.1)
      .from(uno(s, '[data-carta]'), { y: 120, opacity: 0, scale: 0.92, duration: 1.0 }, 0.35)
      .from(uno(s, '[data-carta] [data-img]'), { scale: 1.18, duration: 2.8, ease: 'power2.out' }, 0.35)
      .fromTo(uno(s, '[data-brillo]'), { xPercent: 0 }, { xPercent: 520, duration: 1.1, ease: 'power2.inOut' }, 1.5)
      .from(q(s, '[data-letra]'), { yPercent: 110, opacity: 0, duration: 0.6, stagger: 0.09, ease: 'back.out(1.6)' }, 1.0);
  });

  animar('lux-otp', function (tl, s) {
    ambiente(tl, s, 3.8);
    var ultimo = q(s, '[data-punto]').length - 1;
    tl.from(uno(s, '[data-halo]'), { scale: 0.4, opacity: 0, duration: 1.0 }, 0)
      .from(uno(s, '[data-emblema]'), { y: -260, scale: 0.5, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 0);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 18608676, separador: '.', dur: 1.6, en: 0.35 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 0.35)
      .from(uno(s, '[data-otp]'), { letterSpacing: '40px', opacity: 0, duration: 0.8 }, 0.7)
      .from(q(s, '[data-banda] rect'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.1, ease: 'power3.inOut' }, 0.8)
      .from(q(s, '[data-emblema-eje]'), { scale: 0, transformOrigin: '50% 50%', opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2.2)' }, 1.0)
      .from(q(s, '[data-anio]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, 1.1)
      .from(uno(s, '[data-linea]'), { drawSVG: '0%', duration: 1.5, ease: 'power1.inOut' }, 1.3)
      .from(q(s, '[data-punto]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)', stagger: 1.5 / ultimo }, 1.3)
      .from(uno(s, '[data-area]'), { opacity: 0, duration: 0.8 }, 2.4)
      .fromTo(uno(s, '[data-pulso]'), { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, 2.85)
      .from(uno(s, '[data-etiqueta]'), { opacity: 0, x: 16, duration: 0.4 }, 2.85)
      .from(uno(s, '[data-pico] line'), { drawSVG: '0%', duration: 0.5 }, 3.05)
      .from(q(s, '[data-pico] circle, [data-pico] text'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2.5)' }, 3.35);
  });

  animar('lux-lan', function (tl, s) {
    ambiente(tl, s, 3);
    if (window.continua) continua(tl, s);
    tl.from(uno(s, '[data-halo]'), { scale: 0.4, opacity: 0, duration: 1.0 }, 0.3)
      .from(uno(s, '[data-numero]'), { scale: 1.9, opacity: 0, duration: 0.55, ease: 'power4.in' }, 0.55)
      .from(uno(s, '[data-lan]'), { letterSpacing: '120px', opacity: 0, duration: 0.9, ease: 'power3.out' }, 1.0);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 16557803, separador: '.', dur: 1.4, en: 1.2 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 1.2);
  });

  animar('lux-luz', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.9 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '55% 25%', duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-destello]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 1.6, ease: 'power2.out' }, 0.6)
      .from(q(s, '[data-panel] [data-rayos]'), { scale: 0.2, opacity: 0, transformOrigin: '50% 50%', duration: 1.8, ease: 'power2.out' }, 0.7);
  });

  animar('lux-familia', function (tl, s) {
    ambiente(tl, s, 2.8);
    var cartas = q(s, '[data-carta]');
    tl.from(cartas[0], { y: -900, rotation: -14, opacity: 0, duration: 0.8, ease: 'power3.in' }, 0.1)
      .to(cartas[0], { y: -14, duration: 0.12, ease: 'power1.out', yoyo: true, repeat: 1 }, 0.9)
      .from(cartas[1], { y: -1300, rotation: 16, opacity: 0, duration: 0.85, ease: 'power3.in' }, 0.75)
      .to(cartas[1], { y: -14, duration: 0.12, ease: 'power1.out', yoyo: true, repeat: 1 }, 1.6);
  });

  animar('lux-prohibido', function (tl, s) {
    ambiente(tl, s, 3);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-gris]'), { filter: 'grayscale(0) brightness(1) contrast(1)', duration: 1.6, ease: 'power2.inOut' }, 0.7)
      .from(uno(s, '[data-tinte]'), { opacity: 0, duration: 1.6, ease: 'power2.inOut' }, 0.7)
      .from(uno(s, '[data-frio]'), { opacity: 0, duration: 1.6 }, 0.7)
      .from(uno(s, '[data-barras]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.9, ease: 'power3.inOut' }, 1.6)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.12, duration: 3, ease: 'power2.out' }, 0);
  });

  animar('lux-lobos', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.fromTo(uno(s, '[data-nucleo]'), { opacity: 0.9, scale: 0.4 }, { opacity: 1, scale: 1.4, duration: 0.6, ease: 'power2.in' }, 0)
      .fromTo(uno(s, '[data-estallido]'), { opacity: 0, scale: 0.05 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' }, 0.55)
      .to(uno(s, '[data-nucleo]'), { opacity: 0, duration: 0.3 }, 0.9)
      .to(uno(s, '[data-estallido]'), { opacity: 0, scale: 1.25, duration: 1.1, ease: 'power2.out' }, 1.0)
      .fromTo(uno(s, '[data-chispa]'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', duration: 0.9, ease: 'expo.out', immediateRender: true }, 0.75)
      .from(uno(s, '[data-chispa] [data-img]'), { scale: 1.3, rotation: -8, duration: 2.4, ease: 'power2.out' }, 0.75);
  });

  animar('lux-16', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-antes]'), { scale: 1.12, duration: 1.6, ease: 'power2.out' }, 0)
      .fromTo(uno(s, '[data-fogonazo]'), { opacity: 0, scale: 0.1 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.in' }, 1.0)
      .from(uno(s, '[data-despues]'), { clipPath: 'circle(0% at ${RAYO.x}px ${RAYO.y}px)', duration: 0.9, ease: 'power3.out' }, 1.4)
      .to(uno(s, '[data-fogonazo]'), { opacity: 0, scale: 1.4, duration: 0.9, ease: 'power2.out' }, 1.5)
      .from(uno(s, '[data-despues]'), { scale: 1.1, duration: 2, ease: 'power2.out' }, 1.4)
      .from(uno(s, '[data-dieciseis]'), { y: 120, opacity: 0, scale: 0.9, duration: 0.9, ease: 'back.out(1.6)' }, 1.7);
  });

  // El bento entra desde el centro, cuenta 22 y la elegida crece hasta llenar el panel.
  function crece(tl, s, en) {
    var el = uno(s, '[data-elegida]');
    var d = el.dataset;
    tl.from(el, { left: +d.x, top: +d.y, width: +d.w, height: +d.h, borderRadius: 14, duration: 1.0, ease: 'power3.inOut' }, en)
      .from(uno(s, '[data-carga]'), { opacity: 1, duration: 0.5, ease: 'none' }, en + 0.55)
      .from(uno(s, '[data-splash]'), { opacity: 0, duration: 0.5, ease: 'none' }, en + 0.55)
      .from(uno(s, '[data-splash-img]'), { scale: 1.15, duration: 1.6, ease: 'power2.out' }, en + 0.55);
  }
  animar('lux-skins', function (tl, s) {
    ambiente(tl, s, 4);
    var casillas = [].slice.call(q(s, '[data-casilla], [data-elegida]'));
    efecto('contador', tl, uno(s, '[data-veintidos]'), { cuenta: 22, dur: 1.2, en: 0.1 });
    tl.from(uno(s, '[data-veintidos]'), { scale: 0.7, opacity: 0.2, duration: 0.9, ease: 'back.out(1.8)' }, 0.1)
      .fromTo(casillas, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: { each: 0.045, from: 'center' } }, 0.25)
      .fromTo(uno(s, '[data-barrido]'), { xPercent: 0 }, { xPercent: 420, duration: 0.8, ease: 'power2.inOut' }, 1.6)
      .to(q(s, '[data-casilla]'), { opacity: 0.35, duration: 0.6 }, 2.3);
    crece(tl, s, 2.3);
  });

  animar('lux-pandastica', function (tl, s) {
    ambiente(tl, s, 3);
    tl.fromTo(uno(s, '[data-barrido]'), { xPercent: 0 }, { xPercent: 420, duration: 0.7, ease: 'power2.inOut' }, 0.1);
    crece(tl, s, 0.5);
  });

  animar('cierre', function (tl, s) {
    tl.from(uno(s, '[data-mitad="lux"]'), { xPercent: -100, duration: 0.8, ease: 'power3.out' }, 0)
      .from(uno(s, '[data-mitad="graves"]'), { xPercent: 100, duration: 0.8, ease: 'power3.out' }, 0.15)
      .from(q(s, '[data-mitad] [data-img]'), { scale: 1.15, duration: 2.6, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-filo]'), { scaleX: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'power3.out' }, 0.8)
      .from(uno(s, '[data-ggez]'), { scale: 2.2, opacity: 0, duration: 0.45, ease: 'power4.in' }, 1.0);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lux cumple 16 años</title>
${kit.og({ titulo: 'Lux cumple 16 años', descripcion: 'Cumplelolero #25: el OTP europeo que sí sabe jugar, el número dos de LAN, el lore de la Dama Luminosa y sus 22 skins. Láminas para el montaje automático.', carpeta: 'lux' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .luz {
    background: linear-gradient(180deg, #FFFDF4 0%, ${LUZ} 45%, #E8C46A 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 28px ${a(LUZ, 0.45)});
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.45)}; border-radius: 999px;
    background: rgba(11,21,48,0.85); color: ${LUZ}; cursor: pointer;
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
