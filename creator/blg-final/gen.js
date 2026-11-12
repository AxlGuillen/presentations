// Generador de index.html — «BLG: de romperme el corazón a mi equipo» (canal Axelsine, 12/11/2026)
// Ejecutar: node creator/blg-final/gen.js   ·   clips: node tools/laminas.mjs creator/blg-final
//
// Sigue al pie de la letra el paquete `2026-11-12_blg-de-romperme-el-corazon--paquete.md` (PKB de Axl):
//   · **Banda inferior** (formato 4 del CLAUDE.md, copiado del index.html real de jhin-build y t1-blg):
//     <deck-stage data-recorte="1080:680:0:1240" data-banda="abajo">, kit.banda() y el riel con data-riel,
//     banda opaca con el fondo en el div[data-panel] (mp4 H.264 sin alfa), `bf-reposo` con data-reposo y
//     sin data-continua.
//   · **Solo arte oficial**: logos de lolesports (los de ganan/assets/logos) y el de DAMWON Gaming de
//     Wikimedia Commons, splash arts de Data Dragon (Seraphine, Akali, Fiora) y las fotos oficiales de la
//     liga (getTeams de lolesports). Lo dibujado es dato: tachones, la línea de tiempo y las barras.
//   · **Cada jugador y el coach tienen el mismo molde** (`perfil()`): foto oficial, nombre, rol y un dato
//     grande. Se repite el molde, no la receta: Viper entra con un fundido lento, Knight en rebanadas,
//     Bin con un tajo, Xun a pincel, ON con un destello y Daeny con el nombre revuelto.
//   · **Daeny no tiene foto oficial** (getTeams solo trae a los jugadores): va su nombre en grande con el
//     logo de BLG en el lugar de la foto. No se inventa ni se ilustra ninguna cara.
//   · **bf-viper y bf-viper-cita son el único momento serio**: fondo liso, la foto y un fundido lento, sin
//     golpes, conteos, sacudidas ni efectos. Por eso son las dos únicas láminas seguidas con la misma
//     receta principal (el fundido): lo pide el paquete y manda sobre la regla de no repetir.
//   · Groserías solo en la voz. Ningún texto se burla de China ni de Corea: el 10 contra 3 es una gráfica.
//   · Ninguna lámina arranca en negro (resplandor del color del equipo o arte desenfocado desde el cuadro 0)
//     ni tarda más de 2,8 s en entrar.
//
// ⚠️ El paquete dice «29 láminas + reposo», pero su guion y su tabla traen 27 marcas: van las 27 y el
//    reposo, sin inventar dos.
// ⚠️ bf-mids-coreanos lleva los logos de IG y FPX (de ganan/assets/logos) además del de EDG: son los
//    equipos de Rookie, Doinb y Scout, y no hay foto oficial vigente de los tres.
// ⚠️ El logo de DAMWON de Commons trae el texto en gris oscuro: se aclaró a hueso para que se lea sobre el
//    negro (la versión «sobre oscuro»). El marcador de corchetes conserva su degradado.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (del paquete) ─────────────────────────────────────────────────
const BG = '#0B0B0E';
const AZUL = '#36CFF3';    // lo que va a favor de BLG
const ROJO = '#E4002B';    // solo el dolor de T1: el 13-0, el 3-1 y la eliminación
const ORO = '#AA8B56';     // Gen.G y Canyon
const LUZ = '#F3EFE2';     // cifras
const GRIS = '#6B6E78';    // lo que ya pasó

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const TEXTO = `'Archivo', system-ui, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// Fotos oficiales (lolesports, recortadas a su contenido): ancho × alto para que las recetas de imagen
// (rebanadas, pincel) copien la foto sin deformarla.
const FOTOS = { viper: [666, 621], knight: [712, 621], bin: [723, 614], xun: [650, 619], on: [695, 613], canyon: [665, 577] };
const LOGOS = { BLG: [332, 149], T1: [520, 207], GEN: [520, 440], DK: [520, 224], HLE: [519, 288], EDG: [600, 600], IG: [300, 300], FPX: [600, 200], DWG: [720, 337] };
const NOMBRE_EQ = { BLG: 'Bilibili Gaming', T1: 'T1', GEN: 'Gen.G', DK: 'Dplus KIA', HLE: 'Hanwha Life Esports', EDG: 'EDward Gaming', IG: 'Invictus Gaming', FPX: 'FunPlus Phoenix', DWG: 'DAMWON Gaming' };

// ── El riel: idéntico en todas las láminas ────────────────────────────────
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-blg-final');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  // Cinco destellos, uno por jugador de BLG: del lado del gameplay en azul; del otro, blancos.
  const brillos = [0, 1, 2, 3, 4].map((i) => {
    const lado = i < 3, x = Math.round(70 + (lado ? i : i - 3) * (lado ? 330 : 500) + r() * 220), y = Math.round(lado ? 52 + r() * 28 : 600 + r() * 28), s = Math.round(6 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${lado ? AZUL : LUZ}" opacity="${(0.45 + r() * 0.3).toFixed(2)}"/>`;
  }).join('');
  return `
      <svg data-riel viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none; z-index: 20;">
        <g fill="none" stroke="${LUZ}" stroke-linecap="round">
          <line x1="0" y1="20" x2="${PW}" y2="20" stroke-width="1.6" stroke-opacity=".5"/>
          <line x1="0" y1="28" x2="${PW}" y2="28" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="652" x2="${PW}" y2="652" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="660" x2="${PW}" y2="660" stroke-width="1.6" stroke-opacity=".5"/>
          <g stroke-width="1" stroke-opacity=".34">${marcas.join('')}</g>
        </g>
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${AZUL}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${AZUL}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

/** Arte a sangre o en una caja: <img> con object-fit cover, foco en `pos` y zoom fijo. */
const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block; ${filtro ? `filter: ${filtro};` : ''}">
      </div>`;
/** Copia desenfocada y opaca del splash (no es data-fondo: la banda es opaca y se ve desde el cuadro 0). */
const respaldo = (src, { blur = 18, brillo = 0.3, pos = 'center' } = {}) => `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(1.1);"></div></div>`;
/** Resplandor del color del equipo: el fondo visible desde el cuadro 0 de las láminas sin splash. */
const brillo = (color, { x = 78, y = 45, r = 70, fuerza = 0.26 } = {}) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(${r}% ${Math.round(r * 1.25)}% at ${x}% ${y}%, ${a(color, fuerza)} 0%, ${a(color, fuerza * 0.35)} 45%, ${a(color, 0)} 100%);"></div>`;
const veloIzq = (fuerza = 0.88) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.6)} 42%, ${a(BG, 0)} 72%);"></div>`;
/** Marca de agua: el logo grande y muy tenue (parte del fondo). */
const marca = (eq, { x, y, w, op = 0.06 } = {}) => `
      <img src="assets/logos/${eq}.png" alt="" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; opacity: ${op}; filter: grayscale(1) brightness(1.6); pointer-events: none;">`;

/** Logo oficial en una caja (object-fit contain). */
const logo = (eq, { x, y, w, h = null, k = '', estilo = '', filtro = '' } = {}) => {
  const [lw, lh] = LOGOS[eq], alto = h == null ? Math.round((w * lh) / lw) : h;
  return `<div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${alto}px; ${estilo}"><img src="assets/logos/${eq}.png" alt="Logo de ${NOMBRE_EQ[eq]}" style="width: 100%; height: 100%; object-fit: contain; display: block; ${filtro ? `filter: ${filtro};` : ''}"></div>`;
};
/** Foto oficial en una caja de su tamaño exacto (las recetas de imagen la copian sin deformarla). */
const foto = (n, { x = null, derecha = 20, y = 80, h = 600, k = 'foto', mascara = true, filtro = '', estilo = '', pincel = false } = {}) => {
  const [fw, fh] = FOTOS[n], w = Math.round((h * fw) / fh), left = x == null ? PW - derecha - w : x;
  const alt = `Foto oficial de ${n === 'on' ? 'ON' : n.charAt(0).toUpperCase() + n.slice(1)}`;
  const masc = mascara ? '-webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 22%); mask-image: linear-gradient(90deg, transparent 0%, #000 22%);' : '';
  const dentro = pincel
    ? kit.pincel(`assets/fotos/${n}.webp`, alt, { ancho: w, alto: h, trazos: 6, semilla: `blg-${n}` })
    : `<img src="assets/fotos/${n}.webp" alt="${alt}" style="width: 100%; height: 100%; object-fit: contain; display: block; ${filtro ? `filter: ${filtro};` : ''}">`;
  return `<div data-k="${k}" style="position: absolute; left: ${left}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${masc} ${estilo}">${dentro}</div>`;
};

/** Texto: solo el dato. Entre x 60 y 960, y entre 60 y 620 (lejos del riel). */
const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true, fuente = DISPLAY } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-family: ${fuente}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.85);` : ''}">${txt}</div>`;

/** El molde de presentación: foto oficial (o el logo del equipo si no hay), nombre, rol y un dato grande. */
const perfil = ({ foto: f = null, logoEq = null, nombre, rol, dato: d, color = AZUL, tamDato = 92, fondo = '', pincel = false, sereno = false }) => `
      ${fondo || `${brillo(color, { x: 80, y: 50, r: 62, fuerza: sereno ? 0.12 : 0.24 })}${marca('BLG', { x: 40, y: 460, w: 520, op: sereno ? 0.03 : 0.05 })}`}
      ${f ? foto(f, { pincel }) : logo(logoEq, { x: 590, y: 200, w: 430, k: 'foto', estilo: `filter: drop-shadow(0 0 40px ${a(color, 0.35)});` })}
      ${dato(`<span data-k="nombre" style="display: inline-block;">${nombre}</span>`, { x: 60, y: 70, w: 560, tam: 190, lh: 0.9, tracking: 6 })}
      ${dato(rol, { x: 64, y: 252, w: 520, tam: 62, tracking: 10, color, k: 'rol' })}
      <div data-k="regla" style="position: absolute; left: 64px; top: 330px; width: 120px; height: 5px; background: ${color};"></div>
      ${dato(d, { x: 60, y: 360, w: 560, tam: tamDato, lh: 0.95, tracking: 3, k: 'dato' })}`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
/** Tachón a mano (pathLength 1: se dibuja con strokeDashoffset). */
const tachon = (k, color, { x, y, w, h = 60, grosor = 10 } = {}) => `
      <svg viewBox="0 0 ${w} ${h}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: visible; pointer-events: none;"><path data-k="${k}" d="M4 ${h * 0.62} C ${w * 0.3} ${h * 0.45}, ${w * 0.7} ${h * 0.6}, ${w - 4} ${h * 0.36}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;
const equis = (k, color, { x, y, w, h }) => `
      <svg viewBox="0 0 ${w} ${h}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: visible; pointer-events: none; z-index: 2;"><g fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"><path data-x="${k}" d="M${w * 0.12} ${h * 0.14} L${w * 0.88} ${h * 0.86}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/><path data-x="${k}" d="M${w * 0.88} ${h * 0.14} L${w * 0.12} ${h * 0.86}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></g></svg>`;

/** Ordinal con la letra volada y subrayada: Bebas Neue no trae ª ni º. */
const ord = (n, l) => `${n}.<span style="display: inline-block; font-size: .5em; line-height: 1; vertical-align: .82em; border-bottom: .09em solid currentColor; margin-left: .03em;">${l}</span>`;

const slides = [];

// ── 1 · bf-portada ─── el logo de T1 se parte y el de BLG entra en la grieta ── (lineas)
const GRIETA_IZQ = 'polygon(0% 0%, 53% 0%, 47% 28%, 56% 50%, 45% 74%, 51% 100%, 0% 100%)';
const GRIETA_DER = 'polygon(53% 0%, 100% 0%, 100% 100%, 51% 100%, 45% 74%, 56% 50%, 47% 28%)';
const T1P = { x: 230, y: 56, w: 620 }, T1P_H = Math.round((T1P.w * LOGOS.T1[1]) / LOGOS.T1[0]);
slides.push(lamina('bf-portada', 'BLG me rompió el corazón el domingo y el sábado le voy a ir a BLG.', `
      ${brillo(ROJO, { x: 25, y: 30, r: 60, fuerza: 0.22 })}${brillo(AZUL, { x: 80, y: 40, r: 60, fuerza: 0.2 })}
      ${logo('T1', { ...T1P, k: 't1-izq', estilo: `clip-path: ${GRIETA_IZQ};` })}
      ${logo('T1', { ...T1P, k: 't1-der', estilo: `clip-path: ${GRIETA_DER};` })}
      ${logo('BLG', { x: 540 - 170, y: T1P.y + (T1P_H - 153) / 2, w: 340, k: 'blg', estilo: `filter: drop-shadow(0 0 30px ${a(AZUL, 0.5)});` })}
      <div data-k="titulo" style="position: absolute; left: 60px; top: 360px; width: 960px; text-align: center; font-size: 100px; line-height: 1.02; letter-spacing: 4px; text-shadow: 0 6px 30px rgba(0,0,0,.85);">DE ROMPERME EL <span style="color: ${ROJO};">CORAZÓN</span>…<br><span style="color: ${AZUL}; font-size: 140px;">A MI EQUIPO</span></div>`));

// ── 2 · bf-fandom ─── fan de T1: la tarjeta voltea al logo de BLG ── (voltea)
slides.push(lamina('bf-fandom', 'Déjenme explicarles antes de que me corran del fandom de T1.', `
      ${brillo(ROJO, { x: 20, y: 40, r: 55, fuerza: 0.16 })}${brillo(AZUL, { x: 82, y: 45, r: 50, fuerza: 0.2 })}
      ${dato('<span style="white-space: nowrap;">FAN DE T1</span>', { x: 60, y: 150, w: 540, tam: 150, tracking: 6, k: 'fan' })}
      ${dato('<span data-k="ahora">¿Y AHORA?</span>', { x: 64, y: 340, w: 520, tam: 130, tracking: 6, color: AZUL })}
      <div style="position: absolute; left: 620px; top: 100px; width: 380px; height: 460px;">
        <div data-k="voltea" style="position: absolute; inset: 0; display: grid;">
          <div data-cara="frente" style="grid-area: 1 / 1; box-sizing: border-box; border: 3px solid ${a(LUZ, 0.25)}; border-radius: 18px; background: #15151A; display: flex; align-items: center; justify-content: center;"><img src="assets/logos/T1.png" alt="Logo de T1" style="width: 300px; height: auto; display: block;"></div>
          <div data-cara="dorso" style="grid-area: 1 / 1; box-sizing: border-box; border: 3px solid ${AZUL}; border-radius: 18px; background: #0F1A20; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px ${a(AZUL, 0.35)};"><img src="assets/logos/BLG.png" alt="Logo de Bilibili Gaming" style="width: 300px; height: auto; display: block;"></div>
        </div>
      </div>`));

// ── 3 · bf-13-0 ─── la racha de T1 contra la LPL en Bo5 de Mundiales ── (contador)
slides.push(lamina('bf-13-0', 'Faker iba trece a cero contra equipos chinos en series a cinco de Mundiales. Trece a cero desde dos mil trece.', `
      ${brillo(ROJO, { x: 30, y: 55, r: 70, fuerza: 0.24 })}${marca('T1', { x: 560, y: 140, w: 560, op: 0.07 })}
      ${logo('T1', { x: 64, y: 70, w: 200, k: 'logo' })}
      <div style="position: absolute; left: 56px; top: 170px; font-size: 330px; line-height: 1; letter-spacing: 4px; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.8); white-space: nowrap;"><span data-k="trece" style="display: inline-block; min-width: 1.02em; text-align: right;">13</span>-0</div>
      ${dato('DESDE', { x: 700, y: 250, w: 300, tam: 90, tracking: 8, color: a(LUZ, 0.75), k: 'desde' })}
      ${dato('2013', { x: 700, y: 340, w: 300, tam: 170, tracking: 4, k: 'anio' })}`));

// ── 4 · bf-3-1 ─── el 13-0 tachado; BLG 3-1 T1 · primera vez ── (sello)
slides.push(lamina('bf-3-1', 'Y BLG se lo rompió tres a uno.', `
      ${brillo(AZUL, { x: 25, y: 50, r: 60, fuerza: 0.22 })}${brillo(ROJO, { x: 90, y: 50, r: 40, fuerza: 0.12 })}
      ${dato('13-0', { x: 60, y: 60, w: 300, tam: 120, tracking: 4, color: GRIS })}
      ${tachon('tachon', ROJO, { x: 50, y: 82, w: 210, h: 70, grosor: 11 })}
      ${logo('BLG', { x: 60, y: 250, w: 300, k: 'blg' })}
      ${dato('<span data-k="marcador">3-1</span>', { x: 380, y: 200, w: 320, tam: 250, tracking: 6, color: AZUL, alinear: 'center' })}
      ${logo('T1', { x: 720, y: 262, w: 270, k: 't1', filtro: 'grayscale(.6) brightness(.75)' })}
      <div style="position: absolute; left: 470px; top: 460px; width: 460px;"><div data-k="sello">${kit.sello('PRIMERA VEZ', { color: AZUL, ancho: 460, alto: 150, rotacion: -6, semilla: 7 })}</div></div>`));

// ── 5 · bf-ace ─── Akali: el ace de Faker en la partida 4 ── (empuje)
slides.push(lamina('bf-ace', 'Faker hizo un ace él solito en la cuarta partida y ni así alcanzó. Me dolió mucho pero hay que aceptarlo: nos sacaron jugando mejor.', `
      ${respaldo('splash/Akali_0-fondo.jpg', { blur: 12, brillo: 0.45 })}
      ${arte('splash/Akali_0.jpg', 'Akali, splash oficial', { pos: '62% 22%', zoom: 1.08, k: 'arte', filtro: 'brightness(.75)' })}
      ${veloIzq(0.9)}
      ${dato('ACE DE', { x: 60, y: 150, w: 600, tam: 120, tracking: 6, k: 'ace' })}
      ${dato('FAKER', { x: 56, y: 260, w: 600, tam: 200, tracking: 8, k: 'faker' })}
      ${dato('Y NI ASÍ', { x: 62, y: 470, w: 600, tam: 110, tracking: 8, color: ROJO, k: 'niasi' })}`));

// ── 6 · bf-investigar ─── las cinco fotos oficiales de BLG, una por una ── (bento)
const CINCO = ['bin', 'xun', 'knight', 'viper', 'on'];
const C5 = { w: 184, h: 300, sep: 16, y: 56 }, C5X = (PW - (5 * C5.w + 4 * C5.sep)) / 2;
slides.push(lamina('bf-investigar', 'Y luego me puse a investigar a estos weyes y ya no los pude odiar.', `
      ${brillo(AZUL, { x: 50, y: 40, r: 80, fuerza: 0.22 })}
      <div data-k="cinco" style="position: absolute; left: ${C5X}px; top: ${C5.y}px; width: ${5 * C5.w + 4 * C5.sep}px; height: ${C5.h}px; display: flex; gap: ${C5.sep}px;">
        ${CINCO.map((n) => `<div style="position: relative; width: ${C5.w}px; height: ${C5.h}px; border-radius: 14px; overflow: hidden; background: linear-gradient(180deg, ${a(AZUL, 0.18)}, ${a(AZUL, 0.04)}); border: 2px solid ${a(AZUL, 0.45)}; box-sizing: border-box;"><img src="assets/fotos/${n}.webp" alt="Foto oficial de ${n === 'on' ? 'ON' : n.charAt(0).toUpperCase() + n.slice(1)}" style="position: absolute; left: 50%; bottom: 0; height: 270px; width: auto; transform: translateX(-50%); display: block;"></div>`).join('')}
      </div>
      ${dato('BILIBILI GAMING', { x: 60, y: 400, w: 960, tam: 150, tracking: 10, alinear: 'center', k: 'nombre' })}`));

// ── 7 · bf-viper ─── presentación de Viper (tono serio) ── (fundido lento)
slides.push(lamina('bf-viper', 'Viper, el ADC. Después de eliminar a Hanwha, que era su exequipo, se le quebró la voz en la entrevista y dijo esto.', `
      ${perfil({ foto: 'viper', nombre: 'VIPER', rol: 'ADC', dato: 'ELIMINÓ A<br>SU EXEQUIPO', sereno: true })}`));

// ── 8 · bf-viper-cita ─── su frase, fondo liso ── (fundido lento; el único momento serio)
slides.push(lamina('bf-viper-cita', '«Mi mamá está luchando contra el cáncer. Ojalá viéndome jugar recupere la salud.»', `
      <div style="position: absolute; inset: 0; background: #111116;"></div>
      ${foto('viper', { y: 100, h: 580, derecha: 10, k: 'foto' })}
      <div data-k="cita" style="position: absolute; left: 60px; top: 140px; width: 600px; font-family: ${TEXTO}; font-weight: 600; font-size: 48px; line-height: 1.22; letter-spacing: 0; color: ${LUZ};">«Mi mamá está luchando contra el cáncer. Ojalá viéndome jugar recupere la salud.»</div>
      <div data-k="fuente" style="position: absolute; left: 60px; top: 500px; width: 600px; font-family: ${TEXTO}; font-weight: 400; font-size: 24px; line-height: 1.3; color: ${a(LUZ, 0.6)};">Viper, entrevista tras BLG 2-0 HLE · Mundial 2026</div>`));

// ── 9 · bf-maldicion ─── 0-3 → 3-1 contra T1 en Mundiales ── (tragamonedas)
slides.push(lamina('bf-maldicion', 'Antes de la semifinal dijo que esta vez sí quería romper la maldición contra T1. Y la rompió.', `
      ${brillo(AZUL, { x: 78, y: 55, r: 55, fuerza: 0.24 })}
      <div data-k="cabeza" style="position: absolute; left: 60px; top: 70px; display: flex; align-items: center; gap: 22px;">
        <img src="assets/logos/BLG.png" alt="Logo de Bilibili Gaming" style="height: 70px; width: auto; display: block;">
        <span style="font-size: 54px; line-height: 1; color: ${a(LUZ, 0.6)}; letter-spacing: 4px;">VS</span>
        <img src="assets/logos/T1.png" alt="Logo de T1" style="height: 64px; width: auto; display: block;">
      </div>
      ${dato('0-3', { x: 60, y: 210, w: 360, tam: 240, tracking: 6, color: GRIS, k: 'antes' })}
      <svg data-k="flecha" viewBox="0 0 140 80" style="position: absolute; left: 400px; top: 300px; width: 140px; height: 80px; overflow: visible;"><path d="M6 40 H120 M92 12 L124 40 L92 68" fill="none" stroke="${AZUL}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${dato('<span data-k="ahora">3-1</span>', { x: 580, y: 170, w: 420, tam: 320, tracking: 6, color: AZUL })}`));

// ── 10 · bf-viper-2021 ─── campeón con EDG en 2021, va por el segundo ── (cortinilla iris)
slides.push(lamina('bf-viper-2021', 'Va por su segundo Mundial; el primero lo ganó con EDG en dos mil veintiuno.', `
      ${brillo(LUZ, { x: 25, y: 50, r: 45, fuerza: 0.1 })}${brillo(AZUL, { x: 85, y: 55, r: 50, fuerza: 0.18 })}
      <div data-k="edg" style="position: absolute; left: 60px; top: 130px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, ${a(LUZ, 0.12)}, ${a(LUZ, 0)} 70%);">${logo('EDG', { x: 30, y: 30, w: 340 })}</div>
      ${dato('2021', { x: 500, y: 90, w: 460, tam: 220, tracking: 6, k: 'anio' })}
      ${dato('EDG', { x: 506, y: 300, w: 460, tam: 90, tracking: 10, color: a(LUZ, 0.7), k: 'eq' })}
      ${dato(`<span style="white-space: nowrap;">VA POR EL ${ord(2, 'O')}</span>`, { x: 502, y: 410, w: 500, tam: 100, tracking: 4, color: AZUL, k: 'va' })}`));

// ── 11 · bf-knight ─── presentación de Knight ── (rebanadas)
slides.push(lamina('bf-knight', 'Knight, el mid. En dos mil veintitrés ganó todo en China y T1 lo sacó en semis.', `
      ${perfil({ foto: 'knight', nombre: 'KNIGHT', rol: 'MID', dato: '2023: GANÓ<br>TODO EN CHINA' })}`));

// ── 12 · bf-knight-2024 ─── sus dos caídas contra T1 ── (maquina)
const fila = (n, anio, txt, y) => `
      ${dato(`<span data-k="anio-${n}">${anio}</span>`, { x: 60, y, w: 260, tam: 150, tracking: 4 })}
      ${dato(`<span data-k="txt-${n}">${txt}</span>`, { x: 330, y: y + 28, w: 420, tam: 110, tracking: 4, color: a(LUZ, 0.82) })}
      ${logo('T1', { x: 770, y: y + 34, w: 210, k: `t1-${n}` })}`;
slides.push(lamina('bf-knight-2024', 'En dos mil veinticuatro perdió la final contra T1 tres a dos.', `
      ${brillo(AZUL, { x: 20, y: 50, r: 50, fuerza: 0.16 })}${marca('BLG', { x: 520, y: 380, w: 560, op: 0.05 })}
      ${fila(1, '2023', 'SEMIS', 110)}
      <div style="position: absolute; left: 60px; top: 318px; width: 920px; height: 2px; background: ${a(LUZ, 0.14)};"></div>
      ${fila(2, '2024', 'FINAL 2-3', 350)}`));

// ── 13 · bf-primer-mid ─── el dato grande del video ── (golpe)
slides.push(lamina('bf-primer-mid', 'Y el sábado puede ser algo que nadie ha sido nunca: el primer mid chino campeón del mundo.', `
      ${brillo(AZUL, { x: 80, y: 45, r: 60, fuerza: 0.26 })}
      ${foto('knight', { y: 70, h: 610, derecha: 0, filtro: 'brightness(.7)' })}
      ${veloIzq(0.82)}
      <div data-k="frase" style="position: absolute; left: 60px; top: 110px; width: 900px; font-size: 130px; line-height: 0.98; letter-spacing: 5px; text-shadow: 0 8px 34px rgba(0,0,0,.9);">PRIMER MID CHINO<br><span style="color: ${AZUL}; font-size: 190px;">CAMPEÓN</span><br><span style="color: ${AZUL};">DEL MUNDO</span></div>`));

// ── 14 · bf-mids-coreanos ─── los mids de los tres títulos de China ── (mazo)
const MIDS = [['IG', 'ROOKIE', '2018'], ['FPX', 'DOINB', '2019'], ['EDG', 'SCOUT', '2021']];
slides.push(lamina('bf-mids-coreanos', 'Los tres Mundiales que ha ganado China fueron con mid coreano: Rookie, Doinb y Scout.', `
      ${brillo(LUZ, { x: 50, y: 40, r: 80, fuerza: 0.07 })}
      <div data-k="mazo" style="position: absolute; left: 60px; top: 80px; width: 960px; height: 500px; display: flex; gap: 30px;">
        ${MIDS.map(([eq, nom, anio]) => `<div style="position: relative; flex: 1; height: 500px; border-radius: 18px; background: #17171D; border: 2px solid ${a(LUZ, 0.16)}; box-shadow: 0 18px 40px rgba(0,0,0,.6);">
          <div style="position: absolute; left: 40px; right: 40px; top: 40px; height: 190px;"><img src="assets/logos/${eq}.png" alt="Logo de ${NOMBRE_EQ[eq]}" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>
          <div style="position: absolute; left: 0; right: 0; top: 270px; text-align: center; font-size: 104px; line-height: 1; letter-spacing: 5px; color: ${LUZ};">${nom}</div>
          <div style="position: absolute; left: 0; right: 0; top: 390px; text-align: center; font-size: 76px; line-height: 1; letter-spacing: 6px; color: ${a(LUZ, 0.6)};">${anio}</div>
        </div>`).join('')}
      </div>`));

// ── 15 · bf-bin ─── presentación de Bin ── (cortinilla tajo)
slides.push(lamina('bf-bin', 'Bin, el top. Es su tercera final, el primer chino en llegar a tres.', `
      ${perfil({ foto: 'bin', nombre: 'BIN', rol: 'TOP', dato: `<span style="color: ${AZUL}; font-size: 150px;">${ord(3, 'A')}</span> FINAL`, tamDato: 110 })}`));

// ── 16 · bf-penta ─── Fiora: primer penta en una final, perdió 1-3 contra DAMWON ── (multikill)
slides.push(lamina('bf-penta', 'En dos mil veinte hizo el primer pentakill en una final de Mundial y aun así la perdió contra DAMWON, con Canyon de MVP.', `
      ${respaldo('splash/Fiora_0-fondo.jpg', { blur: 12, brillo: 0.45 })}
      ${arte('splash/Fiora_0.jpg', 'Fiora, splash oficial', { pos: '70% 30%', k: 'arte', filtro: 'brightness(.72)' })}
      ${veloIzq(0.9)}
      <div style="position: absolute; left: 60px; top: 110px; width: 640px;"><div data-k="penta">${kit.multikill('PRIMER PENTA', { ancho: 640, alto: 170, oro: ['#E4FAFF', AZUL, '#1B7E98'], filo: '#04161C', rotacion: -4, fuente: DISPLAY })}</div></div>
      ${dato('EN UNA FINAL', { x: 64, y: 310, w: 640, tam: 110, tracking: 6, k: 'final' })}
      ${logo('DWG', { x: 64, y: 470, w: 230, k: 'dwg' })}
      ${dato('PERDIÓ 1-3', { x: 320, y: 470, w: 400, tam: 100, tracking: 5, color: a(LUZ, 0.75), k: 'perdio' })}`));

// ── 17 · bf-canyon ─── Canyon: MVP 2020 con DAMWON, hoy en Gen.G ── (voltea)
slides.push(lamina('bf-canyon', 'Adivinen quién es el jungla de Gen.G el sábado. Canyon. Simplemente cine.', `
      ${brillo(ORO, { x: 80, y: 50, r: 60, fuerza: 0.28 })}${marca('GEN', { x: 40, y: 330, w: 420, op: 0.05 })}
      ${foto('canyon', { y: 160, h: 520, derecha: -40 })}
      ${dato('CANYON', { x: 60, y: 60, w: 600, tam: 190, tracking: 6, color: ORO, k: 'nombre' })}
      ${dato('MVP 2020', { x: 64, y: 250, w: 500, tam: 90, tracking: 6, k: 'mvp' })}
      <div style="position: absolute; left: 64px; top: 370px; width: 260px; height: 200px;">
        <div data-k="voltea" style="position: absolute; inset: 0; display: grid;">
          <div data-cara="frente" style="grid-area: 1 / 1; box-sizing: border-box; border: 2px solid ${a(LUZ, 0.25)}; border-radius: 16px; background: #15151A; display: flex; align-items: center; justify-content: center;"><img src="assets/logos/DWG.png" alt="Logo de DAMWON Gaming" style="width: 220px; height: auto; display: block;"></div>
          <div data-cara="dorso" style="grid-area: 1 / 1; box-sizing: border-box; border: 2px solid ${ORO}; border-radius: 16px; background: #1A1610; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px ${a(ORO, 0.4)};"><img src="assets/logos/GEN.png" alt="Logo de Gen.G" style="height: 150px; width: auto; display: block;"></div>
        </div>
      </div>
      ${dato('→ GEN.G<br>2026', { x: 350, y: 390, w: 300, tam: 96, lh: 0.95, tracking: 4, color: ORO, k: 'gen' })}`));

// ── 18 · bf-pausa ─── julio de 2026: la pausa de Bin ── (letras)
slides.push(lamina('bf-pausa', 'Y en julio de este año Bin se tomó una pausa porque, palabras suyas, no había estado en buen estado.', `
      ${brillo(LUZ, { x: 80, y: 50, r: 55, fuerza: 0.1 })}
      ${foto('bin', { y: 100, h: 580, derecha: 20, k: 'foto' })}
      ${dato('JULIO 2026', { x: 60, y: 130, w: 560, tam: 100, tracking: 8, color: a(LUZ, 0.7), k: 'fecha' })}
      ${dato('<span data-k="pausa">PAUSA</span>', { x: 52, y: 250, w: 600, tam: 270, tracking: 14 })}`));

// ── 19 · bf-bo5 ─── de la pausa a la final ── (dibujo)
const L = { y: 330, x: [180, 540, 880] };
const HITOS = [['JULIO', 'PAUSA', GRIS], ['AGOSTO', 'REGRESA', LUZ], ['NOVIEMBRE', 'FINAL', AZUL]];
slides.push(lamina('bf-bo5', 'Regresó en agosto y ahora está a un Bo5 de ser campeón.', `
      ${brillo(AZUL, { x: 86, y: 50, r: 45, fuerza: 0.22 })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <g data-k="linea"><path d="M${L.x[0]} ${L.y} H${L.x[2]}" fill="none" stroke="${a(LUZ, 0.55)}" stroke-width="6" stroke-linecap="round"/></g>
        ${HITOS.map(([, , c], i) => `<circle data-punto cx="${L.x[i]}" cy="${L.y}" r="${i === 2 ? 26 : 18}" fill="${c}" stroke="${BG}" stroke-width="6"/>`).join('')}
      </svg>
      ${HITOS.map(([mes, txt, c], i) => `
      <div data-hito style="position: absolute; left: ${L.x[i] - 170}px; top: ${L.y - 190}px; width: 340px; text-align: center; font-size: ${i === 2 ? 64 : 56}px; line-height: 1; letter-spacing: 6px; color: ${a(c === GRIS ? LUZ : c, c === GRIS ? 0.5 : 0.8)};">${mes}</div>
      <div data-hito style="position: absolute; left: ${L.x[i] - 190}px; top: ${L.y + 60}px; width: 380px; text-align: center; font-size: ${i === 2 ? 150 : 104}px; line-height: 1; letter-spacing: 5px; color: ${c}; text-shadow: 0 6px 26px rgba(0,0,0,.8);">${txt}</div>`).join('')}`));

// ── 20 · bf-xun ─── presentación de Xun ── (pincel)
slides.push(lamina('bf-xun', 'Xun perdió la final de dos mil veinticuatro, se fue un año a JDG y regresó a BLG por la revancha.', `
      ${perfil({ foto: 'xun', nombre: 'XUN', rol: 'JUNGLA', dato: 'SE FUE<br>Y VOLVIÓ', tamDato: 110, pincel: true })}`));

// ── 21 · bf-on ─── Seraphine: la ulti de la serie ── (destello)
slides.push(lamina('bf-on', 'La ulti de Seraphine de ON fue la jugada de la serie contra T1.', `
      ${perfil({ foto: 'on', nombre: 'ON', rol: 'SUPPORT', dato: 'LA ULTI<br>DE LA SERIE', tamDato: 104, fondo: `
      ${respaldo('splash/Seraphine_0-fondo.jpg', { blur: 10, brillo: 0.42, pos: '40% 30%' })}
      ${arte('splash/Seraphine_0.jpg', 'Seraphine, splash oficial', { pos: '38% 25%', k: 'arte', filtro: 'brightness(.42) saturate(1.1)' })}
      ${veloIzq(0.78)}
      <div data-k="destello" style="position: absolute; left: ${790 - 300}px; top: ${330 - 300}px;">${kit.destello({ tam: 600, rayos: 18, color: AZUL, brillo: '#FFFFFF', semilla: 'on-seraphine' })}</div>` })}`));

// ── 22 · bf-daeny ─── el coach: sin foto oficial, nombre y logo de BLG ── (revuelto)
slides.push(lamina('bf-daeny', 'Y su coach Daeny: a ese T1 lo corrió a mitad de dos mil veintiuno. Cinco años después su equipo elimina a T1.', `
      ${perfil({ logoEq: 'BLG', nombre: 'DAENY', rol: 'COACH', dato: `T1 LO DESPIDIÓ<br>EN 2021`, tamDato: 92 })}`));

// ── 23 · bf-lck ─── HLE, DK y T1 tachados; falta Gen.G ── (bento)
const LCK = [['HLE', AZUL], ['DK', AZUL], ['T1', ROJO], ['GEN', null]];
const LK = { w: 210, h: 150, sep: 26, y: 70 }, LKX = (PW - (4 * LK.w + 3 * LK.sep)) / 2;
slides.push(lamina('bf-lck', 'Ya eliminaron a Hanwha, a DK y a T1. Solo les falta Gen.G, el cuarto equipo coreano.', `
      ${brillo(AZUL, { x: 25, y: 70, r: 50, fuerza: 0.18 })}${brillo(ORO, { x: 88, y: 30, r: 35, fuerza: 0.2 })}
      <div data-k="logos" style="position: absolute; left: ${LKX}px; top: ${LK.y}px; width: ${4 * LK.w + 3 * LK.sep}px; height: ${LK.h}px; display: flex; gap: ${LK.sep}px;">
        ${LCK.map(([eq, c]) => `<div ${c ? '' : 'data-k="gen" '}style="position: relative; width: ${LK.w}px; height: ${LK.h}px; box-sizing: border-box; border-radius: 14px; border: 2px solid ${c ? a(LUZ, 0.14) : ORO}; background: ${c ? '#141419' : '#1A1610'}; padding: 18px; ${c ? '' : `box-shadow: 0 0 30px ${a(ORO, 0.35)};`}"><img src="assets/logos/${eq}.png" alt="Logo de ${NOMBRE_EQ[eq]}" style="width: 100%; height: 100%; object-fit: contain; display: block; ${c ? 'filter: grayscale(.55) brightness(.7);' : ''}"></div>`).join('')}
      </div>
      ${LCK.slice(0, 3).map(([, c], i) => equis(i, c, { x: LKX + i * (LK.w + LK.sep) + 30, y: LK.y + 10, w: LK.w - 60, h: LK.h - 20 })).join('')}
      ${dato('<span style="white-space: nowrap;">3 DE 4</span>', { x: 60, y: 300, w: 480, tam: 210, tracking: 6, color: AZUL, k: 'tres' })}
      ${dato('FALTA<br>GEN.G', { x: 560, y: 330, w: 420, tam: 120, lh: 0.95, tracking: 6, color: ORO, k: 'falta' })}`));

// ── 24 · bf-orilla ─── el año de casi ── (marcatextos)
const MARCA = a(AZUL, 0.42);
slides.push(lamina('bf-orilla', 'Este año perdieron la final del MSI en Corea yendo dos a uno arriba y entraron a cuartos en la última ronda de la fase suiza. Es un equipo que se ha quedado en la orilla toda su vida.', `
      ${brillo(AZUL, { x: 80, y: 50, r: 55, fuerza: 0.16 })}${marca('BLG', { x: 600, y: 60, w: 440, op: 0.05 })}
      ${dato('MSI: PERDIÓ 2-3', { x: 60, y: 70, w: 900, tam: 120, tracking: 5, k: 'l1' })}
      ${dato(`<span data-k="m1" style="display: inline-block;">YENDO 2-1</span>`, { x: 60, y: 190, w: 900, tam: 120, tracking: 5, color: LUZ, k: 'l2', sombra: false })}
      ${dato('CUARTOS EN LA', { x: 60, y: 360, w: 900, tam: 96, tracking: 5, color: a(LUZ, 0.8), k: 'l3' })}
      ${dato(`<span data-k="m2" style="display: inline-block;">ÚLTIMA RONDA</span>`, { x: 60, y: 456, w: 900, tam: 130, tracking: 5, k: 'l4', sombra: false })}`));

// ── 25 · bf-cierre ─── el logo de BLG en grande ── (cortinilla iris)
slides.push(lamina('bf-cierre', 'Así que sí: si nos iban a sacar, que fuera un equipo así.', `
      ${brillo(AZUL, { x: 50, y: 38, r: 65, fuerza: 0.3 })}
      ${logo('BLG', { x: 540 - 280, y: 56, w: 560, k: 'logo', estilo: `filter: drop-shadow(0 0 50px ${a(AZUL, 0.45)});` })}
      ${dato('<span data-k="frase">SI NOS IBAN<br>A SACAR…</span>', { x: 60, y: 340, w: 960, tam: 130, lh: 0.98, tracking: 6, alinear: 'center' })}`));

// ── 26 · bf-10-3 ─── Corea contra China en Mundiales ── (contador)
const B = { x: 280, max: 620, alto: 96, y1: 160, y2: 380 };
slides.push(lamina('bf-10-3', 'Y si cae T1 no quiero que brille nadie más de Corea. Corea ya tiene diez Mundiales y China tres, mínimo que se repartan otro.', `
      ${brillo(LUZ, { x: 30, y: 40, r: 55, fuerza: 0.08 })}${brillo(AZUL, { x: 30, y: 80, r: 45, fuerza: 0.16 })}
      ${dato('MUNDIALES', { x: 60, y: 60, w: 600, tam: 56, tracking: 10, color: a(LUZ, 0.6), k: 'titulo' })}
      ${dato('COREA', { x: 60, y: B.y1 + 6, w: 220, tam: 90, tracking: 5 })}
      <div data-barra style="position: absolute; left: ${B.x}px; top: ${B.y1}px; width: ${B.max}px; height: ${B.alto}px; background: ${a(LUZ, 0.85)}; border-radius: 0 8px 8px 0; transform-origin: 0 50%;"></div>
      <div style="position: absolute; left: ${B.x + B.max + 18}px; top: ${B.y1 - 20}px; font-size: 130px; line-height: 1; color: ${LUZ};"><span data-k="v1">10</span></div>
      ${dato('CHINA', { x: 60, y: B.y2 + 6, w: 220, tam: 90, tracking: 5, color: AZUL })}
      <div data-barra style="position: absolute; left: ${B.x}px; top: ${B.y2}px; width: ${Math.round((B.max * 3) / 10)}px; height: ${B.alto}px; background: ${AZUL}; border-radius: 0 8px 8px 0; transform-origin: 0 50%;"></div>
      <div style="position: absolute; left: ${B.x + Math.round((B.max * 3) / 10) + 18}px; top: ${B.y2 - 20}px; font-size: 130px; line-height: 1; color: ${AZUL};"><span data-k="v2">3</span></div>`));

// ── 27 · bf-pregunta ─── BLG contra Gen.G: ¿por quién van? ── (palabra)
slides.push(lamina('bf-pregunta', 'El sábado le voy a BLG. Y si gana Chovy también me alegro, porque tampoco ha ganado nunca un Mundial. ¿Ustedes por quién van?', `
      ${brillo(AZUL, { x: 22, y: 35, r: 45, fuerza: 0.26 })}${brillo(ORO, { x: 80, y: 35, r: 45, fuerza: 0.26 })}
      ${logo('BLG', { x: 80, y: 110, w: 360, k: 'blg' })}
      ${dato('VS', { x: 470, y: 120, w: 140, tam: 110, tracking: 4, alinear: 'center', color: a(LUZ, 0.55), k: 'vs' })}
      ${logo('GEN', { x: 690, y: 60, w: 300, h: 250, k: 'gen' })}
      ${dato('<span data-k="pregunta" style="display: inline-block;">¿POR QUIÉN VAN?</span>', { x: 60, y: 340, w: 960, tam: 160, tracking: 6, alinear: 'center' })}
      ${dato('SÁBADO 14/11', { x: 60, y: 510, w: 960, tam: 76, tracking: 10, alinear: 'center', color: a(LUZ, 0.75), k: 'fecha' })}`));

// ── reposo ─── los logos de BLG y Gen.G, sin texto ──
slides.push(lamina('bf-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${brillo(AZUL, { x: 25, y: 50, r: 50, fuerza: 0.22 })}${brillo(ORO, { x: 78, y: 50, r: 50, fuerza: 0.22 })}
      ${logo('BLG', { x: 90, y: 250, w: 380, estilo: 'opacity: .5;' })}
      ${logo('GEN', { x: 690, y: 190, w: 300, h: 300, estilo: 'opacity: .5;' })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  // Fundido lento y nada más (Viper): sin desplazamiento, sin escala, sin rebote.
  var funde = function (tl, el, en, d, desde) { if (el) tl.fromTo(el, { opacity: desde || 0 }, { opacity: 1, duration: d, ease: 'sine.inOut', immediateRender: true }, en); };
  var traza = function (tl, el, en, d) { if (el) tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 0.4, ease: 'entrada', immediateRender: true }, en); };
  // El resto del molde (rol, regla y dato) entra igual en todos; lo que cambia es la receta de la foto y el nombre.
  var molde = function (tl, s, en) {
    aparece(tl, k(s, 'rol'), en, 0.4);
    tl.from(k(s, 'regla'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'entrada' }, en + 0.15);
    aparece(tl, k(s, 'dato'), en + 0.35, 0.5);
  };
  var C = {
    'bf-portada': function (tl, s) {
      tl.to(k(s, 't1-izq'), { x: -190, y: 10, rotation: -7, duration: 0.6, ease: 'golpe' }, 0.3);
      tl.to(k(s, 't1-der'), { x: 190, y: -6, rotation: 6, duration: 0.6, ease: 'golpe' }, 0.3);
      tl.to([k(s, 't1-izq'), k(s, 't1-der')], { opacity: 0.55, duration: 0.5 }, 0.7);
      tl.from(k(s, 'blg'), { y: -90, opacity: 0, scale: 1.2, duration: 0.6, ease: 'asentar' }, 0.75);
      efecto('lineas', tl, k(s, 'titulo'), { en: 1.15, dur: 0.8, escalon: 0.18 });
    },
    'bf-fandom': function (tl, s) {
      aparece(tl, k(s, 'fan'), 0.05, 0.45);
      efecto('voltea', tl, k(s, 'voltea'), { en: 0.6, dur: 1.1 });
      efecto('maquina', tl, k(s, 'ahora'), { en: 1.3, ritmo: 0.05, cursor: 'no' });
    },
    'bf-13-0': function (tl, s) {
      aparece(tl, k(s, 'logo'), 0, 0.4);
      efecto('contador', tl, k(s, 'trece'), { en: 0.2, dur: 1.6, cuenta: 13 });
      aparece(tl, k(s, 'desde'), 1.0); aparece(tl, k(s, 'anio'), 1.3);
    },
    'bf-3-1': function (tl, s) {
      traza(tl, k(s, 'tachon'), 0.15, 0.4);
      tl.from(k(s, 'blg'), { x: -50, opacity: 0, duration: 0.5, ease: 'entrada' }, 0.45);
      aparece(tl, k(s, 'marcador'), 0.65, 0.45);
      tl.from(k(s, 't1'), { x: 50, opacity: 0, duration: 0.5, ease: 'entrada' }, 0.8);
      efecto('sello', tl, k(s, 'sello'), { en: 1.35, fuerza: 10 });
    },
    'bf-ace': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.3, origen: '62% 22%', dur: 2.6 });
      aparece(tl, k(s, 'ace'), 0.35); aparece(tl, k(s, 'faker'), 0.6, 0.5);
      aparece(tl, k(s, 'niasi'), 1.3, 0.5);
    },
    'bf-investigar': function (tl, s) {
      efecto('bento', tl, k(s, 'cinco'), { desde: 'start', escalon: 0.2, dur: 0.55, en: 0.1 });
      aparece(tl, k(s, 'nombre'), 1.35, 0.5);
    },
    'bf-viper': function (tl, s) {
      funde(tl, k(s, 'foto'), 0, 2.0, 0.25);
      funde(tl, k(s, 'nombre'), 0.4, 1.0);
      funde(tl, k(s, 'rol'), 0.9, 0.9); funde(tl, k(s, 'regla'), 0.9, 0.9);
      funde(tl, k(s, 'dato'), 1.4, 1.0);
    },
    'bf-viper-cita': function (tl, s) {
      funde(tl, k(s, 'foto'), 0, 2.0, 0.3);
      funde(tl, k(s, 'cita'), 0.5, 1.4);
      funde(tl, k(s, 'fuente'), 1.5, 1.0);
    },
    'bf-maldicion': function (tl, s) {
      aparece(tl, k(s, 'cabeza'), 0, 0.4);
      aparece(tl, k(s, 'antes'), 0.15, 0.45);
      tl.from(k(s, 'flecha'), { opacity: 0, x: -24, duration: 0.35, ease: 'entrada' }, 0.55);
      tl.fromTo(k(s, 'ahora'), { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 0.65);
      efecto('tragamonedas', tl, k(s, 'ahora'), { en: 0.7, dur: 1.4 });
    },
    'bf-viper-2021': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'edg'), { forma: 'iris', origen: '50% 50%', en: 0.1, dur: 1.0 });
      aparece(tl, k(s, 'anio'), 0.55, 0.5); aparece(tl, k(s, 'eq'), 0.9); aparece(tl, k(s, 'va'), 1.25, 0.5);
    },
    'bf-knight': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'foto'), { n: 6, en: 0.05, dur: 0.9 });
      efecto('letras', tl, k(s, 'nombre'), { en: 0.45, dur: 0.6 });
      molde(tl, s, 0.95);
    },
    'bf-knight-2024': function (tl, s) {
      [1, 2].forEach(function (n, i) {
        var t = 0.05 + i * 0.9;
        efecto('maquina', tl, k(s, 'anio-' + n), { en: t, ritmo: 0.06, cursor: 'no' });
        efecto('maquina', tl, k(s, 'txt-' + n), { en: t + 0.3, ritmo: 0.045, cursor: 'no' });
        aparece(tl, k(s, 't1-' + n), t + 0.55, 0.4);
      });
    },
    'bf-primer-mid': function (tl, s) {
      efecto('golpe', tl, k(s, 'frase'), { en: 0.2, escalon: 0.24 });
    },
    'bf-mids-coreanos': function (tl, s) {
      efecto('mazo', tl, k(s, 'mazo'), { en: 0.15, dur: 0.8, escalon: 0.14, semilla: 'mids-china' });
    },
    'bf-bin': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'foto'), { forma: 'tajo', en: 0.05, dur: 0.9 });
      aparece(tl, k(s, 'nombre'), 0.4, 0.5);
      molde(tl, s, 0.85);
    },
    'bf-penta': function (tl, s) {
      efecto('multikill', tl, k(s, 'penta'), { en: 0.4, fuerza: 8 });
      aparece(tl, k(s, 'final'), 1.15, 0.45);
      aparece(tl, k(s, 'dwg'), 1.5, 0.4); aparece(tl, k(s, 'perdio'), 1.65, 0.45);
    },
    'bf-canyon': function (tl, s) {
      tl.from(k(s, 'foto'), { x: 40, opacity: 0, duration: 0.6, ease: 'entrada' }, 0);
      aparece(tl, k(s, 'nombre'), 0.2, 0.5); aparece(tl, k(s, 'mvp'), 0.55);
      efecto('voltea', tl, k(s, 'voltea'), { en: 0.9, dur: 1.1 });
      aparece(tl, k(s, 'gen'), 1.75, 0.45);
    },
    'bf-pausa': function (tl, s) {
      aparece(tl, k(s, 'fecha'), 0.05, 0.45);
      efecto('letras', tl, k(s, 'pausa'), { en: 0.4, dur: 0.7, desde: 'center', escalon: 0.06 });
      tl.fromTo(k(s, 'foto'), { filter: 'grayscale(0) brightness(1)' }, { filter: 'grayscale(1) brightness(.55)', duration: 1.4, ease: 'sine.inOut', immediateRender: true }, 0.6);
    },
    'bf-bo5': function (tl, s) {
      efecto('dibujo', tl, k(s, 'linea'), { en: 0.1, dur: 1.6, escalon: 0 });
      q(s, '[data-punto]').forEach(function (el, i) { tl.from(el, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'golpe' }, 0.15 + i * 0.75); });
      q(s, '[data-hito]').forEach(function (el, i) { aparece(tl, el, 0.25 + Math.floor(i / 2) * 0.75 + (i % 2) * 0.12, 0.4); });
    },
    'bf-xun': function (tl, s) {
      efecto('pincel', tl, k(s, 'foto'), { en: 0.05, dur: 1.1, escalon: 0.1 });
      aparece(tl, k(s, 'nombre'), 0.35, 0.5);
      molde(tl, s, 0.85);
    },
    'bf-on': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.15, origen: '38% 25%', dur: 2.6 });
      efecto('destello', tl, k(s, 'destello'), { en: 0.3, dur: 1.6, semilla: 'on-seraphine' });
      tl.from(k(s, 'foto'), { x: 60, opacity: 0, duration: 0.6, ease: 'entrada' }, 0.15);
      aparece(tl, k(s, 'nombre'), 0.5, 0.5);
      molde(tl, s, 0.9);
    },
    'bf-daeny': function (tl, s) {
      tl.from(k(s, 'foto'), { scale: 0.85, opacity: 0, duration: 0.6, ease: 'entrada' }, 0.05);
      efecto('revuelto', tl, k(s, 'nombre'), { en: 0.2, dur: 1.2, glifos: 'DAENYBLGT1COACH' });
      molde(tl, s, 0.9);
    },
    'bf-lck': function (tl, s) {
      efecto('bento', tl, k(s, 'logos'), { desde: 'start', escalon: 0.12, dur: 0.5, en: 0.05 });
      [0, 1, 2].forEach(function (i) { q(s, '[data-x="' + i + '"]').forEach(function (p, j) { traza(tl, p, 0.75 + i * 0.22 + j * 0.08, 0.22); }); });
      aparece(tl, k(s, 'tres'), 1.0, 0.5);
      tl.to(k(s, 'gen'), { scale: 1.08, duration: 0.25, ease: 'golpe', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 1.5);
      aparece(tl, k(s, 'falta'), 1.6, 0.5);
    },
    'bf-orilla': function (tl, s) {
      aparece(tl, k(s, 'l1'), 0.05); aparece(tl, k(s, 'l2'), 0.25);
      efecto('marcatextos', tl, k(s, 'm1'), { en: 0.65, color: '${MARCA}', alto: 'completo' });
      aparece(tl, k(s, 'l3'), 1.0); aparece(tl, k(s, 'l4'), 1.2);
      efecto('marcatextos', tl, k(s, 'm2'), { en: 1.6, color: '${MARCA}', alto: 'completo' });
    },
    'bf-cierre': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'logo'), { forma: 'iris', origen: '50% 50%', en: 0.1, dur: 1.1 });
      efecto('lineas', tl, k(s, 'frase'), { en: 0.95, dur: 0.8 });
    },
    'bf-10-3': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      tl.from(q(s, '[data-barra]'), { scaleX: 0, duration: 1.2, ease: 'entrada', stagger: 0.15 }, 0.3);
      tl.fromTo([k(s, 'v1'), k(s, 'v2')], { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: true }, 0.3);
      efecto('contador', tl, k(s, 'v1'), { en: 0.3, dur: 1.2, cuenta: 10 });
      efecto('contador', tl, k(s, 'v2'), { en: 0.45, dur: 1.0, cuenta: 3 });
    },
    'bf-pregunta': function (tl, s) {
      tl.from(k(s, 'blg'), { x: -80, opacity: 0, duration: 0.55, ease: 'entrada' }, 0.05);
      tl.from(k(s, 'gen'), { x: 80, opacity: 0, duration: 0.55, ease: 'entrada' }, 0.1);
      aparece(tl, k(s, 'vs'), 0.4, 0.35);
      efecto('palabra', tl, k(s, 'pregunta'), { en: 0.75, color: '${LUZ}', color2: '${AZUL}' });
      aparece(tl, k(s, 'fecha'), 1.3, 0.45);
    },
    'bf-reposo': function () {},
  };
  Object.keys(C).forEach(function (id) {
    animar(id, function (tl, s) {
      C[id](tl, s);
      if (tl.duration() < DUR) tl.set({}, {}, DUR);
    });
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BLG: de romperme el corazón a mi equipo</title>
${kit.og({ titulo: 'BLG: de romperme el corazón a mi equipo', descripcion: 'Previa de la final del Mundial 2026 (Gen.G contra BLG) en banda inferior: el 13-0 que se rompió, Viper, Knight, Bin, Xun, ON y Daeny. Solo arte oficial.', carpeta: 'creator/blg-final' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(11,11,14,0.85); color: ${LUZ}; cursor: pointer;
    font: 600 13px/1 system-ui, sans-serif; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="abajo">
${slides.join('\n')}
</deck-stage>
${kit.banda()}
${kit.gsap(__dirname, ['SplitText'])}
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

fs.writeFileSync(path.join(__dirname, 'index.html'), kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
