// Generador de index.html — Graves cumple 15 años (láminas para el montaje automático)
// Ejecutar: node creator/graves/gen.js   ·   clips: node tools/laminas.mjs graves
//
// Serie «Cumplelolero» #26, mismo formato que lux: cada lámina es un miniclip
// para el **panel de 1080×1370** (`crop=1080:1370:0:275`) que va abajo del
// gameplay del prereel. Todo lo importante vive dentro de `PANEL`.
//
// Criterio de jinx: el único texto es el que es el dato — 15, GRAVES, TOP 1
// GRAVES, los puntos, el récord, el 13 de skins, FEB 2024 / OCT 2026 de la
// sequía, EDG · 2021 · FLANDRE y GG EZ. Sin dinero.
//
// ⚠️ **Ningún clip arranca en negro**: copia desenfocada, humo y brasas se ven
// desde el cuadro 0; lo que entra es el primer plano.
// ⚠️ **El puro está verificado**: el splash base de Data Dragon y el de
// CommunityDragon son la versión censurada. La versión con puro es
// `Graves_OriginalSkin_HD.jpg` del wiki de Fandom (7000 px) y la censurada,
// `Graves_OriginalSkin_Censored_HD.jpg`: son idénticas salvo el puro, así que
// `puro-si.jpg` y `puro-no.jpg` salen del **mismo recorte** y la cortinilla que
// pasa de una a otra borra solo el puro. El wiki oficial devuelve 403 a curl.
// ⚠️ En Día Nevado el splash le pone un **bastón de caramelo**; la zanahoria
// del guion es de la animación de regreso a base, que no hay en imagen.
// ⚠️ Graves no tiene carta en LoR: Twisted Fate (`02BW026`, en una mesa de
// cartas de Aguasturbias, con Graves a la derecha) es la carta de socios,
// traición y reencuentro. Del universo: `u2` es Fate en la Bóveda del Reloj
// (golpes) y `u3` es Gangplank (la guerra del reencuentro). Fugitivo va en su
// versión HD del wiki (4800 px). No hay arte de Graves en el Cajón.
//
// Datos: el paquete de Axl del 19/10/2026 (ChampionMastery.GG, op.gg, wiki,
// bio oficial es-MX, Inven Global para Flandre).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Los fondos (copia desenfocada, lavados, rayos o humo) llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta: Aguasturbias de noche ────────────────────────────────────────
const BG = '#0E0D0C';        // humo
const COBRE = '#D9773B';     // pólvora y cobre — acento
const LATON = '#B89A62';     // latón viejo — estructura
const HUESO = '#F2EBDD';
const MUTED = '#9A8F80';
const LUZ = '#FFE9A8';       // solo el cierre: la luz de Lux

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const OESTE = `'Rye', 'Bebas Neue', serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };

// ── Piezas comunes ───────────────────────────────────────────────────────
function prng(semilla) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SECCION = `background: ${BG}; color: ${HUESO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

const borroso = (src, brillo = 0.45, extra = '') => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(48px) saturate(1.1) brightness(${brillo}); ${extra}"></div>
    </div>`;

// Lavado de pólvora y viñeta: nunca un fondo plano.
const ambiente = (x = 50, y = 30, color = COBRE) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(75% 45% at ${x}% ${y}%, ${a(color, 0.2)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(6,5,4,0.7) 100%);"></div>`;

// Humo de pólvora: líneas de flujo en cobre, desenfocadas, que derivan.
const humo = (semilla, opacidad = 0.5) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-humo style="position: absolute; inset: -60px; filter: blur(7px); mix-blend-mode: screen; opacity: ${opacidad};">
        ${kit.patron('flujo', { ancho: 1200, alto: 2040, paleta: [COBRE, LATON, '#7A6A58'], semilla, lineas: 70, pasos: 90, paso: 10, grosor: 7, escala: 0.0011, opacidad: 0.55, estilo: 'width:100%;height:100%' })}
      </div>
    </div>`;

// Brasas que suben.
const brasas = (semilla, n = 22) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 1020), y = Math.round(PANEL.top + 60 + r() * (PANEL.h - 120));
    const t = (3 + r() * 7).toFixed(1), col = r() < 0.7 ? COBRE : '#FFB066', op = (0.4 + r() * 0.55).toFixed(2);
    h += `<span data-brasa style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; border-radius: 50%; background: ${col}; opacity: ${op}; box-shadow: 0 0 ${t * 3}px ${col}; pointer-events: none;"></span>`;
  }
  return `<div style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

// Arte apaisado de borde a borde dentro del panel (cover, con el foco en `pos`).
const arte = (src, alt, { y, alto, pos = 'center', extra = '', attrs = '', marco = true } = {}) => `
      <div data-arte ${attrs} style="position: absolute; left: 0; top: ${y}px; width: 1080px; height: ${alto}px; overflow: hidden; ${marco ? `box-shadow: 0 40px 100px rgba(4,3,2,0.75), 0 0 0 1px ${a(LATON, 0.25)};` : ''}">
        <img data-img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">${extra}
      </div>`;

const lamina = (id, notas, cuerpo, extraSeccion = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION} ${extraSeccion}">${cuerpo}
  </section>`;

// Gráfica de rango con los emblemas de cada liga como eje (curva monótona: no
// se pasa de los valores reales).
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

// ── graves-portada ───────────────────────────────────────────────────────
slides.push(lamina('graves-portada', 'Buen dia mis estimados profugos del acido folico. El lunes fue cumpleanos de Graves, este personaje que si va feedeado te revienta de dos basicos. Graves cumplio quince anos.', `
    ${borroso('Graves_0-fondo.jpg', 0.5)}
    ${ambiente(50, 35)}
    ${humo('portada', 0.55)}
    ${brasas(26)}
    ${panel(`
      <div data-quince class="cobre" style="position: absolute; left: 0; right: 0; top: -10px; text-align: center; font-size: 920px; line-height: 1; opacity: 0.95;">15</div>
      <div data-fogonazo style="position: absolute; left: ${540 - 520}px; top: ${780 - 520}px; width: 1040px; height: 1040px; border-radius: 50%; background: radial-gradient(closest-side, #FFF4DC, ${a('#FFB066', 0.95)} 25%, ${a(COBRE, 0.6)} 50%, ${a(COBRE, 0)} 100%); mix-blend-mode: screen; opacity: 0;"></div>
      <div data-carta style="position: absolute; left: ${540 - 190}px; top: 450px; width: 380px; height: 691px; border-radius: 22px; overflow: hidden; border: 3px solid ${LATON}; box-shadow: 0 0 0 10px ${a(BG, 0.55)}, 0 0 90px ${a(COBRE, 0.45)}, 0 40px 90px rgba(4,3,2,0.75);">
        <img data-img src="assets/skins/Graves_0.jpg" alt="Graves, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
      <div data-nombre style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font-size: 210px; line-height: 0.9; letter-spacing: 14px; padding-left: 14px;">${'GRAVES'.split('').map(c => `<span data-letra class="cobre" style="display: inline-block;">${c}</span>`).join('')}</div>`)}`));

// ── graves-otp ───────────────────────────────────────────────────────────
// Cartel de «se busca» con su nombre: el chiste es el nombre.
slides.push(lamina('graves-otp', 'Arrancamos por el one trick pony con mas puntos del mundo. Es un vietnamita con catorce millones seiscientos mil puntos, le saca mas de cinco millones al segundo lugar, y su cuenta se llama literalmente Top One Graves. Y esta en Oro dos.', `
    ${borroso('Graves_0-fondo.jpg', 0.32)}
    ${ambiente(50, 30)}
    ${humo('otp', 0.4)}
    ${brasas(127, 16)}
    ${panel(`
      <div data-cartel style="position: absolute; left: ${540 - 320}px; top: 40px; width: 640px; height: 900px; transform: rotate(-2.5deg); border-radius: 6px;
        background: radial-gradient(120% 90% at 50% 40%, #EEDDB6 0%, #DCC394 55%, #B38E58 100%); box-shadow: inset 0 0 80px rgba(84,46,14,0.75), 0 40px 90px rgba(0,0,0,0.7);">
        <div style="position: absolute; inset: 0; ${kit.fondo('transparent', kit.grano({ opacidad: 0.35, frecuencia: 0.9 }))} mix-blend-mode: multiply; border-radius: 6px;"></div>
        <span style="position: absolute; left: 26px; top: 22px; width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #9A8F80, #3A2E22);"></span>
        <span style="position: absolute; right: 26px; top: 22px; width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #9A8F80, #3A2E22);"></span>
        <div style="position: absolute; left: 60px; top: 70px; width: 520px; height: 470px; border: 5px solid #3A2312; overflow: hidden; box-shadow: inset 0 0 40px rgba(58,35,18,0.6);">
          <img src="assets/skins/Graves_0.jpg" alt="Graves" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 14%; display: block; filter: sepia(0.85) contrast(1.15) brightness(0.95);">
        </div>
        <div style="position: absolute; left: 0; right: 0; top: 575px; text-align: center; font-family: ${OESTE}; font-size: 128px; line-height: 1; color: #3A2312;">TOP 1</div>
        <div style="position: absolute; left: 0; right: 0; top: 720px; text-align: center; font-family: ${OESTE}; font-size: 104px; line-height: 1; color: #3A2312;">GRAVES</div>
      </div>
      <div data-halo style="position: absolute; left: 680px; top: 760px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(closest-side, ${a('#E8C46A', 0.5)}, ${a('#E8C46A', 0)});"></div>
      <img data-emblema src="assets/emblemas/gold.png" alt="Emblema de Oro" style="position: absolute; left: 770px; top: 840px; width: 240px; height: auto; transform: rotate(8deg); filter: drop-shadow(0 0 26px ${a('#E8C46A', 0.7)}) drop-shadow(0 18px 30px rgba(0,0,0,0.6));">
      <div data-puntos class="cobre" style="position: absolute; left: 0; right: 0; top: 1110px; text-align: center; font-size: 200px; line-height: 1;">14.606.506</div>`)}`));

// ── graves-record ────────────────────────────────────────────────────────
const LIGAS = [['silver', 0, 4, '#9AA7B5', 84], ['gold', 4, 8, '#D8B25A', 80], ['platinum', 8, 12, '#3FC1B0', 84], ['emerald', 12, 16, '#36D486', 88]];
const HIST = [['2023', 5], ['2023', 8], ['2024', 4], ['2024', 2], ['2024', 2], ['2025', 6], ['2026', 14], ['2026', 6]];
const PICO = 6; // índice del punto de Esmeralda 2
const GW = 960, GH = 830, ML = 120, MR = 50, MT = 30, MB = 74, VMIN = 1.2, VMAX = 15.7;
const gx = (i) => ML + 30 + i * ((GW - ML - MR - 60) / (HIST.length - 1));
const gy = (v) => MT + ((VMAX - v) / (VMAX - VMIN)) * (GH - MT - MB);
const pts = HIST.map(([, v], i) => [gx(i), gy(v)]);
const lineaRango = monotona(pts);
const bandas = LIGAS.map(([img, lo, hi, col, w], k) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN));
  return `<g data-banda>
        <rect x="${ML}" y="${y1.toFixed(1)}" width="${GW - ML - MR + 24}" height="${(y2 - y1).toFixed(1)}" rx="14" fill="${col}" fill-opacity="${0.06 + k * 0.025}"/>
        <line x1="${ML}" x2="${GW - MR + 24}" y1="${y1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${col}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 8"/>
        <image data-emblema-eje href="assets/emblemas/${img}.png" x="${ML - w - 14}" y="${((y1 + y2) / 2 - w * 0.4).toFixed(1)}" width="${w}" height="${(w * 0.8).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/>
      </g>`;
}).join('');
const anios = [...new Set(HIST.map(h => h[0]))].map(y => {
  const idx = HIST.map((h, i) => (h[0] === y ? i : -1)).filter(i => i >= 0);
  const x = idx.reduce((s, i) => s + gx(i), 0) / idx.length;
  return `<text data-anio x="${x.toFixed(1)}" y="${GH - 26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="24" font-weight="600" fill="${MUTED}">${y}</text>`;
}).join('');
const [px, py] = pts[PICO], [ux, uy] = pts[pts.length - 1];
const graficaRango = `
      <svg data-grafica viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" style="position: absolute; left: 60px; top: 440px; overflow: visible;">
        <defs>
          <linearGradient id="trazo-g" x1="0" x2="1"><stop offset="0" stop-color="${LATON}"/><stop offset="1" stop-color="${COBRE}"/></linearGradient>
          <filter id="brillo-g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        ${bandas}
        ${anios}
        <path data-linea d="${lineaRango}" fill="none" stroke="url(#trazo-g)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#brillo-g)"/>
        ${pts.map(([x, y], i) => `<circle data-punto cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === PICO ? 14 : i === pts.length - 1 ? 13 : 9}" fill="${BG}" stroke="${i === PICO ? '#36D486' : i === pts.length - 1 ? COBRE : LATON}" stroke-width="${i === PICO || i === pts.length - 1 ? 6 : 4}"/>`).join('')}
        <g data-pico><text x="${px.toFixed(1)}" y="${(py - 34).toFixed(1)}" text-anchor="middle" font-family="Bebas Neue, Impact" font-size="54" fill="#36D486">E2</text></g>
        <image data-cae href="assets/emblemas/emerald.png" x="${(px - 40).toFixed(1)}" y="${(py - 150).toFixed(1)}" width="80" height="58" opacity="0"/>
        <circle data-pulso cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="13" fill="none" stroke="${COBRE}" stroke-width="3" opacity="0"/>
        <text data-etiqueta x="${(ux + 30).toFixed(1)}" y="${(uy + 16).toFixed(1)}" font-family="Bebas Neue, Impact" font-size="50" fill="${HUESO}">O2</text>
      </svg>`;
slides.push(lamina('graves-record', 'Esta temporada lleva tres mil setecientas treinta y tres partidas, como trece al dia. Mil ochocientas sesenta y seis ganadas y mil ochocientas sesenta y siete perdidas. Termino la temporada pasada en Oro dos, ahorita esta en Oro dos, y llego a Esmeralda dos nomas para volver a caerse.', `
    ${ambiente(50, 12)}
    ${humo('record', 0.3)}
    ${brasas(228, 14)}
    ${panel(`
      <div data-marcador style="position: absolute; left: 0; right: 0; top: 30px; text-align: center; font-size: 190px; line-height: 1; color: ${HUESO}; text-shadow: 0 0 40px ${a(COBRE, 0.5)};">1.866 – 1.867</div>
      <div data-partidas class="laton" style="position: absolute; left: 0; right: 0; top: 245px; text-align: center; font-size: 130px; line-height: 1;">3.733</div>
      ${graficaRango}`)}`));

// ── graves-forajido ──────────────────────────────────────────────────────
slides.push(lamina('graves-forajido', 'Ahora si el lore. Malcolm Graves crecio en los muelles de Aguasturbias peleando, robando y cargando contrabando. De joven se robo un trabuco y se subio de polizon a un barco rumbo a Shurima.', `
    ${borroso('Graves_0-fondo.jpg', 0.5)}
    ${ambiente(70, 30)}
    ${panel(`
      ${arte('Graves_0.jpg', 'Graves, splash', { y: 285, alto: 800, pos: '80% 30%' })}
      ${humo('forajido', 0.55).replace('position: absolute; inset: 0;', 'position: absolute; inset: 0; z-index: 2;')}`)}
    ${brasas(329, 24)}`));

// ── graves-socios ────────────────────────────────────────────────────────
// Robavidas (él y Fate de jóvenes) y la carta de Twisted Fate que gira encima.
const dorso = `<div data-cara="frente" style="grid-area: 1 / 1; border-radius: 22px; border: 6px solid ${LATON}; box-sizing: border-box;
  background: repeating-linear-gradient(45deg, #5A1E16 0 18px, #4A1812 18px 36px), #4A1812; box-shadow: inset 0 0 0 14px #2B0E0A, inset 0 0 0 18px ${a(LATON, 0.7)};
  display: flex; align-items: center; justify-content: center; font-family: ${OESTE}; font-size: 120px; color: ${LATON};">♠</div>`;
slides.push(lamina('graves-socios', 'En Pueblo de Barro, en una mesa de cartas ilegal, conocio a Twisted Fate. Graves ponia la fuerza bruta y Fate la labia, y juntos armaron una sociedad de ladrones como no habia otra.', `
    ${borroso('Graves_6-fondo.jpg', 0.45)}
    ${ambiente(50, 30)}
    ${brasas(430, 18)}
    ${panel(`
      ${arte('Graves_6.jpg', 'Graves Robavidas, splash', { y: 60, alto: 700, pos: '50% 30%' })}
      <div style="position: absolute; left: ${540 - 380}px; top: 740px; width: 760px; height: 380px; transform: rotate(-6deg);">
        <div data-voltea style="display: grid; width: 760px; height: 380px;">
          ${dorso}
          <div data-cara="dorso" style="grid-area: 1 / 1; border-radius: 22px; overflow: hidden; border: 6px solid ${LATON}; box-sizing: border-box; box-shadow: 0 40px 90px rgba(0,0,0,0.75), 0 0 50px ${a(COBRE, 0.35)};">
            <img src="assets/cartas/02BW026.jpg" alt="Twisted Fate, carta de Legends of Runeterra" style="width: 100%; height: 100%; object-fit: cover; display: block;">
          </div>
        </div>
      </div>`)}`));

// ── graves-golpes ────────────────────────────────────────────────────────
slides.push(lamina('graves-golpes', 'Hicieron que dos casas nobles de Noxus se pelearan para cobrar el rescate de un heredero secuestrado, y luego vendieron al heredero. Y en Piltover son los unicos que han robado la Boveda del Reloj, y encima los guardias les cargaron el botin hasta su barco.', `
    ${borroso('Graves_3-fondo.jpg', 0.45)}
    ${ambiente(50, 50)}
    ${brasas(531, 16)}
    ${panel(`
      ${arte('Graves_3.jpg', 'Graves Ciudad del Crimen, splash', { y: 50, alto: 610, pos: '50% 30%', attrs: 'data-golpe="1"' })}
      ${arte('universo/u2.jpg', 'Twisted Fate en la Bóveda del Reloj, arte oficial', { y: 700, alto: 610, pos: '70% 40%', attrs: 'data-golpe="2"' })}`)}`));

// ── graves-traicion ──────────────────────────────────────────────────────
// La carta de Fate se quema; el fondo se apaga a gris frío y caen los barrotes.
slides.push(lamina('graves-traicion', 'Pero un dia un golpe salio mal. Atraparon a Graves y Twisted Fate huyo y lo dejo atras. Graves paso anos encerrado en una prision llamada el Cajon, alimentando el rencor contra su companero.', `
    ${kit.quemado('efx-quemado', { brasa: COBRE })}
    ${borroso('cartas/02BW026-fondo.jpg', 0.5)}
    <div data-fondo data-frio style="position: absolute; inset: 0; background: #1A1D22; mix-blend-mode: color; pointer-events: none;"></div>
    <div data-fondo data-sombra style="position: absolute; inset: 0; background: rgba(8,9,11,0.55); pointer-events: none;"></div>
    ${ambiente(50, 50, '#5A6270')}
    ${panel(`
      <div data-quema style="position: absolute; left: 0; top: 380px; width: 1080px; height: 610px;">
        ${arte('cartas/02BW026.jpg', 'Twisted Fate, carta de Legends of Runeterra', { y: 0, alto: 610, pos: '50% 40%' })}
      </div>
      <div data-barrotes style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none; background: repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 96px, #1B1E23 96px 118px, #3A3F47 118px 122px, #15171B 122px 140px);"></div>`)}`));

// ── graves-escape ────────────────────────────────────────────────────────
slides.push(lamina('graves-escape', 'Hasta que rompio sus cadenas y se escapo con la escopeta del guardian al hombro para ir a cazar a Twisted Fate.', `
    ${kit.glitch()}
    ${borroso('fugitivo-fondo.jpg', 0.55)}
    ${ambiente(70, 40, '#9A6BFF')}
    ${brasas(632, 18)}
    ${panel(`
      ${arte('fugitivo.jpg', 'Graves Fugitivo, splash', { y: 280, alto: 810, pos: '88% 40%' })}`)}`));

// ── graves-reencuentro ───────────────────────────────────────────────────
// Parejos: Graves arriba y Fate abajo, con la guerra de Gangplank de fondo.
slides.push(lamina('graves-reencuentro', 'Lo encontro en Aguasturbias, pero justo estallo la guerra entre Gangplank y sus capitanes rivales, y para no morir tuvieron que volver a trabajar juntos. Hoy son socios otra vez, aunque Graves todavia no le perdona.', `
    ${borroso('universo/u3-fondo.jpg', 0.5)}
    ${ambiente(50, 50)}
    ${humo('reencuentro', 0.4)}
    ${brasas(733, 20)}
    ${panel(`
      ${arte('Graves_0.jpg', 'Graves, splash', { y: 110, alto: 560, pos: '85% 22%', attrs: 'data-par="graves"' })}
      ${arte('cartas/02BW026.jpg', 'Twisted Fate, carta de Legends of Runeterra', { y: 700, alto: 560, pos: '50% 30%', attrs: 'data-par="fate"' })}
      <div data-costura style="position: absolute; left: 60px; right: 60px; top: 683px; height: 4px; background: linear-gradient(90deg, ${a(COBRE, 0)}, ${COBRE}, ${a(COBRE, 0)}); box-shadow: 0 0 20px ${COBRE};"></div>`)}`));

// ── graves-skins ─────────────────────────────────────────────────────────
// Las 13 en dos filas (7 y 6); abajo, la barra de la sequía que se llena de vacío.
const SKINS = [1, 2, 3, 4, 5, 6, 7, 14, 18, 25, 35, 42, 45];
const BOVEDA = new Set([2, 4, 7, 42]);
const CW = (1000 - 6 * 8) / 7, CH = 248;
const rect = (i) => i < 7 ? { x: 40 + i * (CW + 8), y: 270 } : { x: 40 + CW / 2 + 4 + (i - 7) * (CW + 8), y: 270 + CH + 8 };
const candado = kit.icono('tabler:lock', { tam: 44, color: HUESO, trazo: 2 });
const casillas = SKINS.map((n, i) => {
  const r = rect(i);
  const borde = n === 45 ? `3px solid ${COBRE}` : n === 14 ? `3px solid ${LATON}` : `1px solid ${a(HUESO, 0.2)}`;
  const brillo = n === 45 ? `box-shadow: 0 0 40px ${a(COBRE, 0.6)};` : n === 14 ? `box-shadow: 0 0 22px ${a(LATON, 0.45)};` : 'box-shadow: 0 12px 30px rgba(0,0,0,0.55);';
  const gris = BOVEDA.has(n) ? 'filter: grayscale(1) brightness(0.55);' : '';
  const sello = BOVEDA.has(n) ? `<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: ${a(BG, 0.25)};">${candado}</div>` : '';
  return `<div data-casilla ${n === 45 ? 'data-ultima' : ''} style="position: absolute; left: ${r.x.toFixed(1)}px; top: ${r.y}px; width: ${CW.toFixed(1)}px; height: ${CH}px; border-radius: 14px; overflow: hidden; border: ${borde}; box-sizing: border-box; ${brillo}">
        <img src="assets/skins/Graves_${n}.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block; ${gris}">${sello}
      </div>`;
}).join('\n      ');
const ult = rect(SKINS.length - 1);
const BARRA = { x: 70, y: 980, w: 940, h: 64 };
const MESES = 32; // feb 2024 → oct 2026
const marcas = Array.from({ length: MESES + 1 }, (_, k) => `<span style="position: absolute; left: ${(k / MESES * 100).toFixed(2)}%; top: ${k % 12 === 11 ? -14 : -8}px; width: 2px; height: ${k % 12 === 11 ? 92 : 80}px; background: ${a(HUESO, k % 12 === 11 ? 0.45 : 0.18)};"></span>`).join('');
slides.push(lamina('graves-skins', 'Y de skins tiene trece, y la ultima salio en febrero de dos mil veinticuatro. Dos anos y ocho meses sin una skin nueva, mientras a Lux le sacan una cada que a Riot se le antoja.', `
    ${ambiente(50, 8)}
    ${humo('skins', 0.25)}
    ${panel(`
      <div data-trece class="cobre" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 240px; line-height: 0.9;">13</div>
      ${casillas}
      <svg style="position: absolute; left: 0; top: 0; width: 1080px; height: 1370px; overflow: visible; pointer-events: none;" viewBox="0 0 1080 1370">
        <path data-hilo d="M${(ult.x + CW / 2).toFixed(1)} ${ult.y + CH + 6} L${(ult.x + CW / 2).toFixed(1)} ${BARRA.y - 70} L${BARRA.x + 4} ${BARRA.y - 70} L${BARRA.x + 4} ${BARRA.y - 6}" fill="none" stroke="${COBRE}" stroke-width="3" stroke-dasharray="8 8"/>
      </svg>
      <div style="position: absolute; left: ${BARRA.x}px; top: ${BARRA.y}px; width: ${BARRA.w}px; height: ${BARRA.h}px;">
        <div style="position: absolute; inset: 0; border-radius: ${BARRA.h / 2}px; background: ${a(HUESO, 0.06)}; border: 2px solid ${a(LATON, 0.5)}; box-sizing: border-box;"></div>
        <div data-vacio style="position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: ${BARRA.h / 2}px; transform-origin: 0% 50%; box-sizing: border-box; border: 2px solid ${COBRE};
          background: repeating-linear-gradient(-45deg, #1E1A16 0 12px, #2A241E 12px 24px); box-shadow: 0 0 30px ${a(COBRE, 0.35)}, inset 0 0 20px rgba(0,0,0,0.6);"></div>
        ${marcas}
      </div>
      <div data-fecha style="position: absolute; left: ${BARRA.x}px; top: ${BARRA.y + 100}px; font-size: 76px; line-height: 1; color: ${COBRE};">FEB 2024</div>
      <div data-fecha style="position: absolute; right: ${1080 - BARRA.x - BARRA.w}px; top: ${BARRA.y + 100}px; font-size: 76px; line-height: 1; color: ${HUESO};">OCT 2026</div>`)}`));

// ── graves-edg ───────────────────────────────────────────────────────────
slides.push(lamina('graves-edg', 'Pero tiene una que viene a cuento con el mundial. La skin de Edward Gaming por el campeonato de dos mil veintiuno la eligio Flandre, el top de ese equipo, porque fue el campeon que mas jugo en ese mundial. Y Flandre esta en este mundial como suplente de Bilibili.', `
    ${borroso('Graves_42-fondo.jpg', 0.5)}
    ${ambiente(50, 30, '#E8C46A')}
    ${brasas(834, 16)}
    ${panel(`
      ${arte('Graves_42.jpg', 'Graves EDG, splash de Edward Gaming', { y: 110, alto: 637, pos: '50% 30%' })}
      <div data-edg class="oro" style="position: absolute; left: 70px; top: 800px; font-size: 300px; line-height: 0.9;">EDG</div>
      <div data-anio class="laton" style="position: absolute; left: 76px; top: 1080px; font-size: 160px; line-height: 0.9;">2021</div>
      <div data-flandre style="position: absolute; left: 650px; top: 800px; width: 360px; height: 360px; border-radius: 24px; overflow: hidden; border: 4px solid ${LATON}; background: radial-gradient(circle at 50% 30%, ${a('#E8C46A', 0.45)}, #15120E 75%); box-shadow: 0 30px 70px rgba(0,0,0,0.6), 0 0 40px ${a('#E8C46A', 0.3)};">
        <img src="assets/flandre.webp" alt="Flandre, foto oficial de lolesports" style="position: absolute; left: 50%; bottom: 0; height: 100%; transform: translateX(-50%);">
      </div>
      <div data-nombre-f style="position: absolute; left: 650px; width: 360px; top: 1180px; text-align: center; font-size: 84px; line-height: 1; letter-spacing: 6px; color: ${HUESO};">FLANDRE</div>`)}`));

// ── graves-puro ──────────────────────────────────────────────────────────
// El mismo recorte con y sin puro: la cortinilla lo borra. Abajo, Día Nevado.
const PURO = { x: 0.35, y: 0.41 }; // dónde cae el puro en el recorte
const ALTO_PURO = Math.round(1080 * 1032 / 1400);
slides.push(lamina('graves-puro', 'Y el dato mas pendejo. A Graves le quitaron el puro de su splash por censura y la comunidad lo volvio meme. Y en la skin de Dia Nevado, cuando regresa a base, en vez de puro le ponen una zanahoria en la boca.', `
    ${borroso('Graves_7-fondo.jpg', 0.45)}
    ${ambiente(30, 30)}
    ${brasas(935, 14)}
    ${panel(`
      <div data-cara style="position: absolute; left: 0; top: 40px; width: 1080px; height: ${ALTO_PURO}px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.75);">
        <img data-con src="assets/puro-si.jpg" alt="Graves con su puro, splash original" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;">
        <img data-sin src="assets/puro-no.jpg" alt="Graves sin el puro, splash censurado" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; clip-path: inset(0% 0% 0% 0%);">
        <div data-borrador style="position: absolute; top: 0; bottom: 0; left: 100%; width: 6px; margin-left: -3px; background: ${COBRE}; box-shadow: 0 0 30px ${COBRE}, 0 0 80px ${a(COBRE, 0.6)};"></div>
        <div data-aro style="position: absolute; left: ${PURO.x * 1080 - 90}px; top: ${PURO.y * ALTO_PURO - 90}px; width: 180px; height: 180px; border-radius: 50%; border: 5px solid ${COBRE}; box-shadow: 0 0 30px ${COBRE}; opacity: 0;"></div>
      </div>
      ${arte('Graves_7.jpg', 'Graves Día Nevado, splash', { y: 40 + ALTO_PURO + 30, alto: 1370 - (40 + ALTO_PURO + 30) - 40, pos: '78% 18%', attrs: 'data-nevado' })}`)}`));

// ── cierre ───────────────────────────────────────────────────────────────
// Graves Profesor de Combate y Lux Academia de Combate: salieron el mismo día
// de 2019 y los dos cumplen el 19 de octubre. El cierre trae la luz de Lux.
slides.push(lamina('cierre', 'Ni pedo, solo queda decir gigi easy. Tirenme un follow o les voy a meter la cuarta. Chao.', `
    ${borroso('Graves_0-fondo.jpg', 0.3)}
    ${ambiente(50, 50, LUZ)}
    ${panel(`
      <div data-mitad="graves" style="position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 100% 560px, 0 760px);">
        <img data-img src="assets/Graves_25.jpg" alt="Graves Profesor de Combate, splash" style="position: absolute; left: -110px; top: -10px; width: 1300px; height: 780px; object-fit: cover; object-position: 60% 20%;">
      </div>
      <div data-mitad="lux" style="position: absolute; inset: 0; clip-path: polygon(0 830px, 100% 630px, 100% 100%, 0 100%);">
        <img data-img src="assets/Lux_15.jpg" alt="Lux Academia de Combate, splash" style="position: absolute; left: -60px; top: 600px; width: 1300px; height: 780px; object-fit: cover; object-position: 70% 20%;">
      </div>
      <div data-filo style="position: absolute; left: -100px; top: 694px; width: 1280px; height: 4px; background: linear-gradient(90deg, ${COBRE}, ${LUZ}); transform: rotate(-10.5deg); box-shadow: 0 0 30px ${LUZ};"></div>
      <div data-ggez style="position: absolute; left: 0; right: 0; top: 590px; text-align: center; font-size: 230px; line-height: 1; transform: rotate(-10.5deg);"><span class="cierre-luz">GG EZ</span></div>`)}`));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Humo que deriva, brasas que suben y el fondo que respira.
  function ambiente(tl, s, dur) {
    q(s, '[data-humo]').forEach(function (h, i) { tl.fromTo(h, { x: -30, y: 20 }, { x: 40, y: -50, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-brasa]').forEach(function (m, i) {
      tl.fromTo(m, { y: 40 + (i % 5) * 14, opacity: 0 }, { y: -60 - (i % 7) * 14, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
    q(s, '[data-borroso]').forEach(function (b) { tl.fromTo(b, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'power1.out' }, 0); });
  }

  animar('graves-portada', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.fromTo(uno(s, '[data-fogonazo]'), { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power4.out' }, 0.15)
      .to(uno(s, '[data-fogonazo]'), { opacity: 0, scale: 1.3, duration: 0.9, ease: 'power2.out' }, 0.33);
    efecto('contador', tl, uno(s, '[data-quince]'), { cuenta: 15, dur: 1.3, en: 0.2 });
    tl.from(uno(s, '[data-quince]'), { scale: 0.82, opacity: 0.25, duration: 1.3, ease: 'power3.out' }, 0.2)
      .from(uno(s, '[data-carta]'), { y: 120, opacity: 0, scale: 0.9, duration: 0.9 }, 0.3)
      .from(uno(s, '[data-carta] [data-img]'), { scale: 1.18, duration: 2.8, ease: 'power2.out' }, 0.3)
      .from(q(s, '[data-letra]'), { yPercent: 110, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.6)' }, 1.0);
  });

  animar('graves-otp', function (tl, s) {
    ambiente(tl, s, 3.2);
    efecto('sello', tl, uno(s, '[data-cartel]'), { en: 0.25, desde: 2.2, fuerza: 18 });
    tl.from(uno(s, '[data-halo]'), { scale: 0.3, opacity: 0, duration: 0.9 }, 0.8)
      .from(uno(s, '[data-emblema]'), { y: -240, rotation: -30, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 0.8);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 14606506, separador: '.', dur: 1.5, en: 1.1 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 1.1);
  });

  animar('graves-record', function (tl, s) {
    ambiente(tl, s, 4);
    efecto('tragamonedas', tl, uno(s, '[data-marcador]'), { en: 0.15 });
    efecto('contador', tl, uno(s, '[data-partidas]'), { cuenta: 3733, separador: '.', dur: 1.2, en: 0.5 });
    tl.from(uno(s, '[data-partidas]'), { y: 20, opacity: 0, duration: 0.5 }, 0.5)
      .from(q(s, '[data-banda] rect'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.08, ease: 'power3.inOut' }, 0.9)
      .from(q(s, '[data-emblema-eje]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.08, ease: 'back.out(2.2)' }, 1.05)
      .from(q(s, '[data-anio]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, 1.1)
      .from(uno(s, '[data-linea]'), { drawSVG: '0%', duration: 1.8, ease: 'none' }, 1.35);
    var puntos = q(s, '[data-punto]'), n = puntos.length;
    puntos.forEach(function (p, i) { tl.from(p, { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' }, 1.35 + 1.8 * i / (n - 1)); });
    var tPico = 1.35 + 1.8 * ${PICO} / (n - 1);
    tl.from(uno(s, '[data-pico]'), { opacity: 0, y: 20, duration: 0.3 }, tPico)
      .fromTo(uno(s, '[data-cae]'), { opacity: 1, y: 0 }, { opacity: 0, y: 180, rotation: 25, transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.in', immediateRender: false }, tPico + 0.15)
      .fromTo(uno(s, '[data-pulso]'), { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, 3.2)
      .from(uno(s, '[data-etiqueta]'), { opacity: 0, x: -14, duration: 0.4 }, 3.2);
  });

  animar('graves-forajido', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.9 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.18, transformOrigin: '80% 30%', duration: 3.3, ease: 'power2.out' }, 0);
  });

  animar('graves-socios', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.14, duration: 3, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-voltea]').parentElement, { y: 500, rotation: 18, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.5);
    efecto('voltea', tl, uno(s, '[data-voltea]'), { en: 1.2, dur: 1.0 });
  });

  animar('graves-golpes', function (tl, s) {
    ambiente(tl, s, 3.2);
    efecto('cortinilla', tl, uno(s, '[data-golpe="1"]'), { forma: 'persiana', direccion: 'derecha', en: 0.1, dur: 0.9 });
    tl.from(uno(s, '[data-golpe="1"] [data-img]'), { scale: 1.15, duration: 2.6, ease: 'power2.out' }, 0.1);
    efecto('cortinilla', tl, uno(s, '[data-golpe="2"]'), { forma: 'persiana', direccion: 'izquierda', en: 0.9, dur: 0.9 });
    tl.from(uno(s, '[data-golpe="2"] [data-img]'), { scale: 1.15, duration: 2.3, ease: 'power2.out' }, 0.9);
  });

  animar('graves-traicion', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-quema] [data-img]'), { scale: 1.08, duration: 1.2, ease: 'power2.out' }, 0);
    efecto('quemado', tl, uno(s, '[data-quema]'), { hacia: 'deshace', en: 0.6, dur: 1.7 });
    tl.from(uno(s, '[data-frio]'), { opacity: 0, duration: 1.4 }, 1.4)
      .from(uno(s, '[data-sombra]'), { opacity: 0, duration: 1.4 }, 1.4)
      .from(uno(s, '[data-barrotes]'), { yPercent: -100, duration: 0.7, ease: 'bounce.out' }, 2.6);
  });

  animar('graves-escape', function (tl, s) {
    ambiente(tl, s, 3);
    tl.from(uno(s, '[data-arte]'), { opacity: 0, duration: 0.2 }, 0);
    efecto('glitch', tl, uno(s, '[data-arte]'), { en: 0, dur: 1.2, fuerza: 160 });
    tl.from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '88% 40%', duration: 2.8, ease: 'power2.out' }, 0);
  });

  animar('graves-reencuentro', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.from(uno(s, '[data-par="graves"]'), { xPercent: -105, duration: 0.9, ease: 'power3.out' }, 0.1)
      .from(uno(s, '[data-par="fate"]'), { xPercent: 105, duration: 0.9, ease: 'power3.out' }, 0.1)
      .from(q(s, '[data-par] [data-img]'), { scale: 1.15, duration: 2.8, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-costura]'), { scaleX: 0, duration: 0.7, ease: 'power3.out' }, 0.9);
  });

  animar('graves-skins', function (tl, s) {
    ambiente(tl, s, 4);
    efecto('contador', tl, uno(s, '[data-trece]'), { cuenta: 13, dur: 1.0, en: 0.1 });
    tl.from(uno(s, '[data-trece]'), { scale: 0.7, opacity: 0.2, duration: 0.8, ease: 'back.out(1.8)' }, 0.1)
      .fromTo(q(s, '[data-casilla]'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.07 }, 0.25)
      .to(uno(s, '[data-ultima]'), { y: -14, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.3)
      .from(uno(s, '[data-hilo]'), { drawSVG: '0%', duration: 0.6, ease: 'power2.inOut' }, 1.5)
      .from(q(s, '[data-fecha]')[0], { opacity: 0, y: 20, duration: 0.4 }, 1.9)
      .from(uno(s, '[data-vacio]'), { scaleX: 0, duration: 1.6, ease: 'none' }, 2.0)
      .from(q(s, '[data-fecha]')[1], { opacity: 0, y: 20, duration: 0.4 }, 3.4);
  });

  animar('graves-edg', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.15, duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-edg]'), { x: -60, opacity: 0, duration: 0.6 }, 0.5)
      .from(uno(s, '[data-anio]'), { x: -60, opacity: 0, duration: 0.6 }, 0.65)
      .fromTo(uno(s, '[data-flandre]'), { clipPath: 'inset(50% 50% 50% 50% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 0.8, ease: 'power3.out' }, 0.9)
      .from(uno(s, '[data-flandre] img'), { scale: 1.3, duration: 1.4, ease: 'power2.out' }, 0.9)
      .from(uno(s, '[data-nombre-f]'), { y: 20, opacity: 0, duration: 0.45 }, 1.4);
    efecto('brillo', tl, uno(s, '[data-edg]'), { color: '#FFF1C8', en: 1.6, dur: 1.2 });
  });

  animar('graves-puro', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(uno(s, '[data-cara]'), { y: 40, opacity: 0, duration: 0.7 }, 0)
      .from(q(s, '[data-cara] img'), { scale: 1.1, transformOrigin: '35% 41%', duration: 3, ease: 'power2.out' }, 0)
      .fromTo(uno(s, '[data-aro]'), { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: true }, 0.5)
      .to(uno(s, '[data-aro]'), { opacity: 0, duration: 0.3 }, 1.6)
      .fromTo(uno(s, '[data-sin]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' }, 1.3)
      .fromTo(uno(s, '[data-borrador]'), { left: '0%' }, { left: '100%', duration: 0.9, ease: 'power2.inOut' }, 1.3)
      .from(uno(s, '[data-nevado]'), { y: 120, opacity: 0, duration: 0.8 }, 2.3)
      .from(uno(s, '[data-nevado] [data-img]'), { scale: 1.2, duration: 1.7, ease: 'power2.out' }, 2.3);
  });

  animar('cierre', function (tl, s) {
    tl.from(uno(s, '[data-mitad="graves"]'), { xPercent: -100, duration: 0.8, ease: 'power3.out' }, 0)
      .from(uno(s, '[data-mitad="lux"]'), { xPercent: 100, duration: 0.8, ease: 'power3.out' }, 0.15)
      .from(q(s, '[data-mitad] [data-img]'), { scale: 1.15, duration: 2.6, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-filo]'), { scaleX: 0, duration: 0.5, ease: 'power3.out' }, 0.8)
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
<title>Graves cumple 15 años</title>
${kit.og({ titulo: 'Graves cumple 15 años', descripcion: 'Cumplelolero #26: el OTP vietnamita que se llama TOP 1 GRAVES y está en Oro, la sociedad con Twisted Fate, la sequía de skins y el puro censurado.', carpeta: 'creator/graves' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rye&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .cobre { background: linear-gradient(180deg, #FFE7C9 0%, #F0A866 40%, ${COBRE} 70%, #9C4A1E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(COBRE, 0.5)}); }
  .laton { background: linear-gradient(180deg, #F2E3BE 0%, ${LATON} 60%, #7E6638 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .oro { color: #E8C46A; text-shadow: 0 0 30px ${a('#E8C46A', 0.5)}; }
  .cierre-luz { background: linear-gradient(180deg, #FFFDF4 0%, ${LUZ} 45%, ${COBRE} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 30px rgba(6,5,4,0.9)); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(COBRE, 0.45)}; border-radius: 999px;
    background: rgba(14,13,12,0.85); color: ${COBRE}; cursor: pointer;
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
