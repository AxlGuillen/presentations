// Generador de index.html — «Mañana alguien gana su primer Mundial sí o sí» (pronóstico de la final
// Gen.G contra BLG, canal Axelsine, viernes 13/11/2026)
// Ejecutar: node creator/final-pronostico/gen.js   ·   clips: node tools/laminas.mjs creator/final-pronostico --banda=arriba
//
// Sigue al pie de la letra el paquete `2026-11-13_pronostico-final-gen-vs-blg--paquete.md` (PKB de Axl):
//   · **Formato de zed / jhin-letalidad** (banda ARRIBA): el riel, el panel, `arte`, `respaldo`, `dato`,
//     `ord`, el layout B (`L_B`), el D (`mitad`/`costura`/`imgMitad`) y el tachón están copiados de
//     creator/zed/gen.js; `logo()` y `foto()` (cajas del tamaño exacto del asset) de creator/blg-final/gen.js.
//   · **Que se entienda contra quién le ganó cada equipo**: todo equipo que nombra la voz sale con su logo
//     oficial y su resultado escrito al lado (3-0, 2-1, DERROTA). Gen.G en dorado y BLG en azul en todo el deck.
//   · **Zona segura de la banda arriba**: nada de texto ni cifras en los primeros 180 px; el texto va de
//     y 180 a 640, entre x 60 y 960. El arte sí va a sangre.
//   · Arte oficial: logos (blg-final y ganan, de lolesports), fotos de lolesports, la copa (ganan) y los splash
//     de la ceremonia (Data Dragon). Lo dibujado es dato: la dona, los tachones, las tarjetas del camino y el
//     sello. Sin íconos genéricos ni dinero; los resultados van con palabras.
//   · El texto en pantalla es solo el dato: los chistes van en la voz (ni en pantalla ni en las notas).
//   · Ninguna lámina arranca en negro (cada una lleva el resplandor de su equipo o su arte desde el cuadro 0) ni
//     tarda más de 2,8 s en entrar.
//
// ⚠️ Recetas que el paquete pide y se cambiaron (anotadas también en el paquete):
//   · La tabla repite `cortina` tres veces (fp-camino-blg, fp-bin-canyon, fp-pronostico) y `revuelto` en dos
//     láminas seguidas (fp-t1 y fp-cuarto); su regla dice que nada salvo contador y empuje pasa de dos ni se
//     repite en dos seguidas. Por eso:
//       - fp-camino-blg: las tarjetas se reparten con `mazo` (salen apiladas y se abren), no con `cortina`;
//       - fp-cuarto: los tres tachones se trazan con `dibujo`, uno tras otro, no con `revuelto`.
//   · fp-favorito: la dona es la de `kit.dona` con su receta `dona` (traza cada arco en orden), que es el
//     «trazada con dibujo» del paquete hecho con la pieza del kit.
//   · `crece` del kit es el FLIP de una celda que llena su contenedor: en fp-un-coreano la tarjeta de HLE crece a
//     mano (escala con la curva `asentar`) y las demás bajan a gris.
//   · `cortina` (cada mitad entra desde su lado) va a mano en fp-bin-canyon y fp-pronostico; `iris` va a mano sobre
//     el arte en fp-league-next (los del kit recortan la <section> entera).
//   · «Cae con la curva golpe» (los logos de la portada) es la curva del kit; el 3-0 de fp-dk entra con la
//     receta `golpe`. `pulso` no existe: latido de escala con la curva golpe (nota de jhin-build).
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (sección 1.5) ─────────────────────────────────────────────────
const BG = '#0A0E17';      // azul noche
const ORO = '#C9A45C';     // Gen.G
const AZUL = '#4FB3FF';    // BLG
const LUZ = '#F3EFE2';     // cifras y texto
const GRIS = '#5B6461';    // lo eliminado y lo que se compara
const ROJO = '#D2443C';    // solo DERROTA y ELIMINADO
const TARJ = '#121826';    // tarjetas del camino

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── Assets: tamaños reales (las cajas copian la proporción y las recetas no deforman nada) ──
const FOTOS = { chovy: [637, 570], ruler: [625, 567], knight: [712, 621], bin: [723, 614], canyon: [665, 577] };
const LOGOS = { GEN: [520, 440], BLG: [332, 149], T1: [520, 207], DK: [520, 224], HLE: [519, 288], IG: [300, 300],
  LYON: [450, 520], MKOI: [319, 520], TL: [520, 519], KC: [520, 492], TES: [372, 510], G2: [399, 462] };
const NOMBRE_EQ = { GEN: 'Gen.G', BLG: 'Bilibili Gaming', T1: 'T1', DK: 'Dplus KIA', HLE: 'Hanwha Life Esports', IG: 'Invictus Gaming',
  LYON: 'LYON', MKOI: 'Movistar KOI', TL: 'Team Liquid', KC: 'Karmine Corp', TES: 'Top Esports', G2: 'G2 Esports' };

// ── Datos (sección 5) ────────────────────────────────────────────────────
const PRONOSTICO = { gen: 63, blg: 37 };
// El camino en el Mundial: [equipo, fase, resultado, ¿derrota?]
const CAMINO_GEN = [['IG', 'SUIZA R1', 'GANÓ'], ['HLE', 'SUIZA R2', 'GANÓ'], ['LYON', 'SUIZA R3', '2-1'], ['LYON', 'CUARTOS', '3-0'], ['IG', 'SEMIS', '3-0']];
const CAMINO_BLG = [['MKOI', 'SUIZA R1', 'DERROTA', true], ['TL', 'SUIZA R2', 'GANÓ'], ['KC', 'SUIZA R3', 'GANÓ'], ['TES', 'SUIZA R4', 'DERROTA 1-2', true], ['HLE', 'SUIZA R5', '2-0']];

// ── El riel (el de zed con otra semilla: dos destellos del lado del gameplay, uno dorado y uno azul) ──
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-final-pronostico');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  const brillos = [0, 1, 2].map((i) => {
    const lado = i < 2;
    const x = Math.round(lado ? 80 + i * 480 + r() * 380 : 300 + r() * 480), y = Math.round(lado ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${i === 0 ? ORO : i === 1 ? AZUL : LUZ}" opacity="${(0.55 + r() * 0.3).toFixed(2)}"/>`;
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
        <path d="M534 20 L540 14 L546 20Z" fill="${ORO}"/><path d="M534 20 L540 26 L546 20Z" fill="${AZUL}"/>
        <path d="M534 660 L540 654 L546 660Z" fill="${ORO}"/><path d="M534 660 L540 666 L546 660Z" fill="${AZUL}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas (de zed y blg-final) ──────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '', ajuste = 'cover' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: ${ajuste}; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block; ${filtro ? `filter: ${filtro};` : ''}">
      </div>`;
const respaldo = (src, { blur = 18, brillo = 0.3, pos = 'center', x = 0, y = 0, w = PW, h = PH, k = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(1.1);"></div></div>`;
/** Resplandor radial del color del equipo: el fondo de las láminas sin arte (se ve desde el cuadro 0). */
const brillo = (color, { x = 50, y = 50, r = 70, fuerza = 0.28 } = {}) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(${r}% ${Math.round(r * 1.25)}% at ${x}% ${y}%, ${a(color, fuerza)} 0%, ${a(color, fuerza * 0.35)} 45%, ${a(color, 0)} 100%);"></div>`;
const veloIzq = (fuerza = 0.88) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.55)} 40%, ${a(BG, 0)} 68%);"></div>`;
const veloAbajo = (fuerza = 0.9) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(0deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.6)} 30%, ${a(BG, 0)} 58%);"></div>`;

const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true, nowrap = false } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.85);` : ''}${nowrap ? ' white-space: nowrap;' : ''}">${txt}</div>`;
const ord = (n, l) => `${n}.<span style="display: inline-block; font-size: .5em; line-height: 1; vertical-align: .82em; border-bottom: .09em solid currentColor; margin-left: .03em;">${l}</span>`;

/** Logo oficial en una caja de su proporción (object-fit contain). */
const logo = (eq, { x = null, y = null, w, k = '', estilo = '', filtro = '' } = {}) => {
  const [lw, lh] = LOGOS[eq], h = Math.round((w * lh) / lw);
  const pos = x == null ? 'position: relative;' : `position: absolute; left: ${x}px; top: ${y}px;`;
  return `<div${k ? ` data-k="${k}"` : ''} style="${pos} width: ${w}px; height: ${h}px; ${estilo}"><img src="assets/logos/${eq}.png" alt="Logo de ${NOMBRE_EQ[eq]}" style="width: 100%; height: 100%; object-fit: contain; display: block; ${filtro ? `filter: ${filtro};` : ''}"></div>`;
};
/** Logo centrado en una caja de w×h (para los logos de proporciones muy distintas). */
const logoEn = (eq, w, h, { estilo = '', filtro = '' } = {}) => {
  const [lw, lh] = LOGOS[eq], esc = Math.min(w / lw, h / lh);
  return `<div style="width: ${w}px; height: ${h}px; display: flex; align-items: center; justify-content: center; ${estilo}"><img src="assets/logos/${eq}.png" alt="Logo de ${NOMBRE_EQ[eq]}" style="width: ${Math.round(lw * esc)}px; height: ${Math.round(lh * esc)}px; display: block; ${filtro ? `filter: ${filtro};` : ''}"></div>`;
};
/** Foto oficial en una caja de su tamaño exacto, apoyada abajo. */
const foto = (n, { x, h = 560, k = 'foto', filtro = '' } = {}) => {
  const [fw, fh] = FOTOS[n], w = Math.round((h * fw) / fh);
  const alt = `Foto oficial de ${n.charAt(0).toUpperCase() + n.slice(1)}`;
  return `<div data-k="${k}" style="position: absolute; left: ${x == null ? Math.round((648 - w) / 2) : x}px; top: ${PH - h}px; width: ${w}px; height: ${h}px; overflow: hidden;"><img src="assets/fotos/${n}.webp" alt="${alt}" style="width: 100%; height: 100%; object-fit: contain; display: block; ${filtro ? `filter: ${filtro};` : ''}"></div>`;
};

/** Layout B: imagen a la izquierda (648×680) y panel de dato a la derecha (432×680, fondo al 92 %),
 *  separados por una línea de 2 px del color del equipo. El texto del panel va de x 676 a 960. */
const L_B = (izquierda, derecha, color) => `
      <div data-k="izq" style="position: absolute; left: 0; top: 0; width: 648px; height: ${PH}px; overflow: hidden;">${izquierda}
      </div>
      <div data-k="panel" style="position: absolute; left: 648px; top: 0; width: 432px; height: ${PH}px; background: ${a(BG, 0.92)};"></div>
      <div style="position: absolute; left: 647px; top: 0; width: 2px; height: ${PH}px; background: ${color};"></div>${derecha}`;
const BX = 676, BW = 284;

/** Layout D: dos mitades de 540×680 con un corte diagonal de 6° (Gen.G a la izquierda, BLG a la derecha). */
const T6 = Math.tan((6 * Math.PI) / 180) * (PH / 2);
const CLIP_IZQ = `polygon(0 0, ${(540 + T6).toFixed(1)}px 0, ${(540 - T6).toFixed(1)}px ${PH}px, 0 ${PH}px)`;
const CLIP_DER = `polygon(${(540 + T6).toFixed(1)}px 0, ${PW}px 0, ${PW}px ${PH}px, ${(540 - T6).toFixed(1)}px ${PH}px)`;
const mitad = (lado, contenido, k = lado) => `
      <div data-k="${k}" style="position: absolute; inset: 0; clip-path: ${lado === 'izq' ? CLIP_IZQ : CLIP_DER};">${contenido}
      </div>`;
const costura = (color = LUZ) => `
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="${(540 + T6).toFixed(1)}" y1="0" x2="${(540 - T6).toFixed(1)}" y2="${PH}" stroke="${color}" stroke-width="3"/></svg>`;
const fondoMitad = (lado, color) => `<div style="position: absolute; inset: 0; background: ${BG};"></div>${brillo(color, { x: lado === 'izq' ? 28 : 72, y: 45, r: 55, fuerza: 0.34 })}`;
const MW = Math.ceil(540 + T6);
const imgMitad = (lado, src, alt, pos, { k = '', filtro = 'brightness(.85)', zoom = 1 } = {}) => arte(src, alt, { x: lado === 'izq' ? 0 : PW - MW, w: MW, h: PH, pos, zoom, k, estilo: `filter: ${filtro};` });

/** Tachón a mano (pathLength 1: se dibuja con strokeDashoffset). */
const tachon = (k, { x, y, w, h = 60, grosor = 10, color = GRIS } = {}) => `
      <svg viewBox="0 0 ${w} ${h}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: visible; pointer-events: none; z-index: 3;"><path data-k="${k}" d="M4 ${h * 0.62} C ${w * 0.3} ${h * 0.45}, ${w * 0.7} ${h * 0.6}, ${w - 4} ${h * 0.36}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;

/** Layout E: fila de cinco tarjetas de 168×300 (x 60–960): logo del rival, fase y resultado. */
const TJ = { w: 168, h: 300, sep: 15, y: 250 };
const tarjetas = (camino, color, k) => `
      <div data-k="${k}" style="position: absolute; left: 60px; top: ${TJ.y}px; width: ${5 * TJ.w + 4 * TJ.sep}px; height: ${TJ.h}px; display: flex; gap: ${TJ.sep}px;">
        ${camino.map(([eq, fase, res, derrota], i) => `<div data-tarjeta data-eq="${eq}" data-i="${i}" style="position: relative; width: ${TJ.w}px; height: ${TJ.h}px; box-sizing: border-box; background: ${TARJ}; border: 1px solid ${a(LUZ, 0.12)}; border-top: 4px solid ${derrota ? ROJO : color}; border-radius: 6px; box-shadow: 0 14px 34px rgba(0,0,0,.5); text-align: center;">
          <div style="margin: 20px auto 0; width: 128px;">${logoEn(eq, 128, 112)}</div>
          <div style="margin-top: 22px; font-size: 38px; line-height: 1; letter-spacing: 3px; color: ${a(LUZ, 0.7)}; white-space: nowrap;">${fase}</div>
          <div style="margin-top: 14px; font-size: ${res.length > 7 ? 40 : res.length > 5 ? 48 : 66}px; line-height: ${res.length > 7 ? 1.05 : 1}; letter-spacing: 2px; color: ${derrota ? ROJO : color};">${res.replace('DERROTA ', 'DERROTA<br>')}</div>
        </div>`).join('')}
      </div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const DOBLE = `${brillo(ORO, { x: 18, y: 45, r: 50, fuerza: 0.22 })}${brillo(AZUL, { x: 82, y: 45, r: 50, fuerza: 0.22 })}`;

const slides = [];

// ── 1 · fp-portada · A ─── la copa con Gen.G y BLG a los lados ── (parallax; los logos caen con la curva golpe)
slides.push(lamina('fp-portada', 'Mañana alguien gana su primer Mundial sí o sí.', `
      <div data-k="capas" style="position: absolute; inset: 0;">
        <div data-capa="0.3" style="position: absolute; inset: 0;">${DOBLE}</div>
        <div data-capa="1" style="position: absolute; inset: 0;">${arte('copa.jpg', 'La copa del Mundial', { x: 270, w: 540, h: PH, pos: '50% 40%', ajuste: 'contain', filtro: 'brightness(.95)', estilo: '-webkit-mask-image: radial-gradient(closest-side, #000 72%, transparent 100%); mask-image: radial-gradient(closest-side, #000 72%, transparent 100%);' })}</div>
      </div>
      ${veloAbajo(0.88)}
      ${logo('GEN', { x: 90, y: 214, w: 200, k: 'gen', estilo: `filter: drop-shadow(0 0 30px ${a(ORO, 0.4)});` })}
      ${logo('BLG', { x: 760, y: 252, w: 240, k: 'blg', estilo: `filter: drop-shadow(0 0 30px ${a(AZUL, 0.4)});` })}
      ${dato('FINAL · SÁBADO 14/11', { x: 60, y: 452, w: 960, tam: 60, tracking: 8, alinear: 'center', k: 'final', nowrap: true })}
      ${dato('UN CAMPEÓN NUEVO', { x: 60, y: 520, w: 960, tam: 112, tracking: 8, alinear: 'center', k: 'nuevo', nowrap: true })}`));

// ── 2 · fp-chovy · B ─── Chovy: 0 Mundiales, su primera final ── (cortinilla del panel + contador)
slides.push(lamina('fp-chovy', 'Chovy, que nunca lo ha ganado y llega a su primera final.', L_B(`
        ${brillo(ORO, { x: 50, y: 55, r: 60, fuerza: 0.3 })}
        ${logo('GEN', { x: 24, y: 300, w: 420, estilo: 'opacity: .07; filter: grayscale(1) brightness(1.8);' })}
        ${foto('chovy')}`, `
      <div data-k="txt" style="position: absolute; inset: 0;">
        ${dato('CHOVY', { x: BX, y: 190, w: BW, tam: 124, tracking: 6, k: 'nombre' })}
        ${dato('GEN.G', { x: BX, y: 318, w: BW, tam: 58, tracking: 10, color: ORO, k: 'equipo' })}
        <div style="position: absolute; left: ${BX}px; top: 392px; display: flex; align-items: baseline; gap: 16px; white-space: nowrap;"><span data-k="cero" style="font-size: 170px; line-height: .9; color: ${LUZ}; text-shadow: 0 6px 30px rgba(0,0,0,.85);">0</span><span data-k="mundiales" style="font-size: 54px; line-height: 1; letter-spacing: 4px;">MUNDIALES</span></div>
        ${dato('SU PRIMERA FINAL', { x: BX, y: 566, w: BW, tam: 46, tracking: 3, color: ORO, k: 'primera', nowrap: true })}
      </div>`, ORO)));

// ── 3 · fp-knight · B ─── Knight: el primer mid chino campeón ── (maquina)
slides.push(lamina('fp-knight', 'Knight, que sería el primer mid chino campeón del mundo.', L_B(`
        ${brillo(AZUL, { x: 50, y: 55, r: 60, fuerza: 0.3 })}
        ${logo('BLG', { x: 24, y: 360, w: 560, estilo: 'opacity: .07; filter: grayscale(1) brightness(1.8);' })}
        ${foto('knight')}`, `
      ${dato('<span data-k="l1">KNIGHT</span>', { x: BX, y: 190, w: BW, tam: 124, tracking: 6, nowrap: true })}
      ${dato('<span data-k="l2">BLG</span>', { x: BX, y: 318, w: BW, tam: 58, tracking: 10, color: AZUL })}
      ${dato('<span data-k="l3">PRIMER MID<br>CHINO<br>CAMPEÓN</span>', { x: BX, y: 404, w: BW, tam: 72, lh: 1.0, tracking: 4, nowrap: true })}`, AZUL)));

// ── 4 · fp-favorito · C ─── gráfica 1: la dona 63 / 37 ── (dona del kit + contador)
slides.push(lamina('fp-favorito', 'El favorito es Gen.G: los pronósticos le dan sesenta y tres por ciento.', `
      ${respaldo('copa-fondo.jpg', { blur: 18, brillo: 0.3 })}
      ${DOBLE}
      ${dato('FAVORITO', { x: 60, y: 188, w: 960, tam: 64, tracking: 12, alinear: 'center', k: 'titulo' })}
      <div data-k="dona" style="position: absolute; left: 120px; top: 262px;">${kit.dona([{ valor: PRONOSTICO.gen, color: ORO }, { valor: PRONOSTICO.blg, color: AZUL }], { tam: 360, grosor: 62, fondo: a(LUZ, 0.08) })}</div>
      <div style="position: absolute; left: 560px; top: 282px; display: flex; align-items: center; gap: 26px;">
        ${logoEn('GEN', 120, 110)}
        <div style="font-size: 140px; line-height: 1; letter-spacing: 2px; color: ${ORO}; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.85);"><span data-k="p-gen">${PRONOSTICO.gen}</span>&nbsp;%</div>
      </div>
      <div style="position: absolute; left: 560px; top: 452px; display: flex; align-items: center; gap: 26px;">
        ${logoEn('BLG', 120, 110)}
        <div style="font-size: 140px; line-height: 1; letter-spacing: 2px; color: ${AZUL}; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.85);"><span data-k="p-blg">${PRONOSTICO.blg}</span>&nbsp;%</div>
      </div>`));

// ── 5 · fp-diezuno · A ─── Gen.G 10–1 en partidas ── (tragamonedas)
slides.push(lamina('fp-diezuno', 'Lleva diez partidas ganadas y una perdida en todo el Mundial.', `
      ${brillo(ORO, { x: 72, y: 50, r: 60, fuerza: 0.32 })}
      ${logo('GEN', { x: 540, y: 150, w: 500, estilo: 'filter: brightness(.4);' })}
      ${veloIzq(0.7)}
      ${dato('<span data-k="marcador" style="display: inline-block;">10–1</span>', { x: 52, y: 176, w: 700, tam: 320, lh: 0.95, tracking: 6, color: ORO, nowrap: true })}
      ${dato('PARTIDAS EN EL MUNDIAL', { x: 60, y: 528, w: 900, tam: 72, tracking: 6, k: 'etq', nowrap: true })}`));

// ── 6 · fp-camino-gen · E ─── IG, HLE, LYON, LYON e IG ── (bento + latido en los repetidos)
slides.push(lamina('fp-camino-gen', 'Gen.G le ganó dos veces a IG, dos veces a LYON y a Hanwha en una partida a una sola.', `
      ${brillo(ORO, { x: 50, y: 30, r: 70, fuerza: 0.2 })}
      ${dato('EL CAMINO DE GEN.G', { x: 60, y: 186, w: 960, tam: 54, tracking: 8, alinear: 'center', color: ORO, k: 'titulo' })}
      ${tarjetas(CAMINO_GEN, ORO, 'fila')}`));

// ── 7 · fp-un-coreano · E ─── todas a gris menos HLE ── (HLE crece a mano)
slides.push(lamina('fp-un-coreano', 'En todo el torneo solo le tocó un equipo coreano.', `
      ${brillo(ORO, { x: 50, y: 30, r: 70, fuerza: 0.2 })}
      ${dato('EL CAMINO DE GEN.G', { x: 60, y: 186, w: 960, tam: 54, tracking: 8, alinear: 'center', color: ORO })}
      ${tarjetas(CAMINO_GEN, ORO, 'fila')}
      ${dato(`EQUIPOS COREANOS: <span style="color: ${ORO};">1</span>`, { x: 60, y: 566, w: 960, tam: 72, tracking: 6, alinear: 'center', k: 'coreanos', nowrap: true })}`));

// ── 8 · fp-camino-blg · E ─── KOI, TL, KC, TES y HLE ── (mazo)
slides.push(lamina('fp-camino-blg', 'BLG arrancó perdiendo contra Movistar KOI, perdió contra Top Esports y pasó en la última ronda de la suiza.', `
      ${brillo(AZUL, { x: 50, y: 30, r: 70, fuerza: 0.2 })}
      ${dato('EL CAMINO DE BLG', { x: 60, y: 186, w: 960, tam: 54, tracking: 8, alinear: 'center', color: AZUL, k: 'titulo' })}
      ${tarjetas(CAMINO_BLG, AZUL, 'fila')}`));

// ── 9 · fp-hle · B ─── Hanwha, campeón del MSI, eliminado 2-0 ── (sello rojo)
const panelLogo = (eq, color, { w = 440, y = null, gris = false } = {}) => {
  const [lw, lh] = LOGOS[eq], h = Math.round((w * lh) / lw);
  return `
        ${brillo(color, { x: 50, y: 50, r: 62, fuerza: 0.26 })}
        ${logo(eq, { x: Math.round((648 - w) / 2), y: y == null ? Math.round((PH - h) / 2 + 30) : y, w, k: 'logo', filtro: gris ? 'grayscale(1) brightness(.8)' : '', estilo: 'filter: drop-shadow(0 18px 40px rgba(0,0,0,.6));' })}`;
};
slides.push(lamina('fp-hle', 'Eliminó a Hanwha, que era el campeón del MSI.', L_B(panelLogo('HLE', AZUL), `
      ${dato('CAMPEÓN<br>DEL MSI', { x: BX, y: 192, w: BW, tam: 84, lh: 1, tracking: 4, k: 'msi' })}
      <div style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;"><div data-k="sello" style="position: absolute; left: ${BX}px; top: 384px; padding: 10px 18px 4px; border: 6px solid ${ROJO}; border-radius: 8px; font-size: 76px; line-height: 1; letter-spacing: 5px; color: ${ROJO}; transform: rotate(-6deg); white-space: nowrap;">ELIMINADO</div></div>
      ${dato('2-0', { x: BX, y: 494, w: BW, tam: 130, tracking: 6, color: AZUL, k: 'resultado' })}`, AZUL)));

// ── 10 · fp-dk · B ─── DK venía invicto: 3-0 ── (golpe)
slides.push(lamina('fp-dk', 'Le pasó por encima a DK tres a cero cuando DK venía invicto.', L_B(panelLogo('DK', AZUL, { w: 480 }), `
      ${dato('VENÍA<br>INVICTO', { x: BX, y: 192, w: BW, tam: 96, lh: 1, tracking: 4, k: 'invicto' })}
      ${dato('<span data-k="resultado">3-0</span>', { x: BX, y: 400, w: BW, tam: 220, lh: 0.95, tracking: 6, color: AZUL, nowrap: true })}`, AZUL)));

// ── 11 · fp-t1 · B ─── T1 tricampeón: 3-1 ── (revuelto + tachón)
slides.push(lamina('fp-t1', 'Sacó a T1 tres a uno, que llevaba tres Mundiales seguidos.', L_B(panelLogo('T1', AZUL, { w: 480 }), `
      ${dato('<span data-k="tri">TRICAMPEÓN</span>', { x: BX, y: 196, w: BW, tam: 86, tracking: 3, k: 'tri-linea', nowrap: true })}
      ${tachon('tachon', { x: BX - 10, y: 210, w: 300, h: 70, grosor: 12, color: GRIS })}
      ${dato('2023 · 2024 · 2025', { x: BX, y: 300, w: BW, tam: 44, tracking: 3, color: a(LUZ, 0.75), k: 'anios', nowrap: true })}
      ${dato('<span data-k="resultado" style="display: inline-block;">3-1</span>', { x: BX, y: 396, w: BW, tam: 220, lh: 0.95, tracking: 6, color: AZUL, nowrap: true })}`, AZUL)));

// ── 12 · fp-cuarto · G ─── HLE, DK y T1 tachados; Gen.G con ? ── (dibujo + latido)
const RG = { tam: 200, sep: 33, y: 214 };
const ranuraG = (eq, i, { gris = false } = {}) => {
  const x = 60 + i * (RG.tam + RG.sep);
  return `<div data-ranura="${eq}" style="position: absolute; left: ${x}px; top: ${RG.y}px; width: ${RG.tam}px; height: ${RG.tam}px; box-sizing: border-box; background: ${TARJ}; border: 2px solid ${gris ? a(LUZ, 0.14) : ORO}; border-radius: 8px; ${gris ? '' : `box-shadow: 0 0 40px ${a(ORO, 0.35)};`} display: flex; align-items: center; justify-content: center;">${logoEn(eq, 160, 140, { filtro: gris ? 'grayscale(1) brightness(1.5)' : '', estilo: gris ? 'opacity: .55;' : '' })}</div>`;
};
slides.push(lamina('fp-cuarto', 'BLG ya se echó a tres equipos coreanos y mañana va por el cuarto.', `
      ${brillo(AZUL, { x: 30, y: 40, r: 60, fuerza: 0.2 })}${brillo(ORO, { x: 86, y: 40, r: 40, fuerza: 0.2 })}
      ${['HLE', 'DK', 'T1'].map((eq, i) => ranuraG(eq, i, { gris: true })).join('')}
      <div data-k="gen" style="position: absolute; left: ${60 + 3 * (RG.tam + RG.sep)}px; top: ${RG.y}px; width: ${RG.tam}px; height: ${RG.tam}px;">
        <div style="position: absolute; inset: 0;">${ranuraG('GEN', 0).replace(`left: 60px; top: ${RG.y}px;`, 'left: 0; top: 0;')}</div>
        <div style="position: absolute; right: -14px; top: -22px; font-size: 110px; line-height: 1; color: ${ORO}; text-shadow: 0 6px 24px rgba(0,0,0,.9);">?</div>
      </div>
      <svg data-k="tachones" viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible; pointer-events: none;">
        <g fill="none" stroke="${LUZ}" stroke-width="12" stroke-linecap="round">${[0, 1, 2].map((i) => { const x = 60 + i * (RG.tam + RG.sep); return `<path d="M${x + 22} ${RG.y + RG.tam - 30} L${x + RG.tam - 22} ${RG.y + 30}"/>`; }).join('')}</g>
      </svg>
      ${dato(`VAN <span style="color: ${AZUL};">3</span> · FALTA <span style="color: ${ORO};">1</span>`, { x: 60, y: 472, w: 960, tam: 110, tracking: 8, alinear: 'center', k: 'cuenta', nowrap: true })}`));

// ── 13 · fp-anio · D ─── el año 2026: Gen.G y BLG ── (rebanadas)
slides.push(lamina('fp-anio', 'Si vemos todo el año, está más parejo de lo que parece.', `
      ${mitad('izq', `${fondoMitad('izq', ORO)}
        <div data-k="reb-gen" style="position: absolute; left: ${270 - 160}px; top: 200px; width: 320px; height: ${Math.round((320 * 440) / 520)}px; overflow: hidden;"><img src="assets/logos/GEN.png" alt="Logo de Gen.G" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>`)}
      ${mitad('der', `${fondoMitad('der', AZUL)}
        <div data-k="reb-blg" style="position: absolute; left: ${810 - 190}px; top: 250px; width: 380px; height: ${Math.round((380 * 149) / 332)}px; overflow: hidden;"><img src="assets/logos/BLG.png" alt="Logo de Bilibili Gaming" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>`)}
      ${costura()}
      ${veloAbajo(0.6)}
      ${dato('EL AÑO 2026', { x: 60, y: 520, w: 960, tam: 104, tracking: 10, alinear: 'center', k: 'titulo', nowrap: true })}`));

// ── 14 · fp-gen-anio · B ─── el año de Gen.G ── (maquina; las tres malas en gris)
const listaAnio = (filas) => filas.map(([ev, res, malo], i) => `
      <div data-fila style="position: absolute; left: ${BX}px; top: ${192 + i * (filas.length > 3 ? 108 : 156)}px; width: ${BW}px; white-space: nowrap;">
        <div style="font-size: 34px; line-height: 1; letter-spacing: 4px; color: ${a(LUZ, 0.6)};">${ev}</div>
        <div data-res style="margin-top: 6px; font-size: ${filas.length > 3 ? 46 : 54}px; line-height: 1; letter-spacing: 2px; color: ${malo ? GRIS : LUZ};">${res}</div>
      </div>`).join('');
slides.push(lamina('fp-gen-anio', 'Gen.G ganó la LCK, pero G2 lo barrió en el First Stand, no fue al MSI y DK lo eliminó en la Esports World Cup.', L_B(panelLogo('GEN', ORO, { w: 400 }), listaAnio([
  ['LCK', 'CAMPEÓN'], ['FIRST STAND', 'BARRIDO POR G2', true], ['MSI', 'NO FUE', true], ['EWC', 'ELIMINADO POR DK', true]]), ORO)));

// ── 15 · fp-blg-anio · B ─── el año de BLG ── (letras)
slides.push(lamina('fp-blg-anio', 'BLG ganó el First Stand y perdió el MSI yendo dos a uno arriba.', L_B(panelLogo('BLG', AZUL, { w: 480 }), listaAnio([
  ['FIRST STAND', 'CAMPEÓN'], ['MSI', `${ord(2, 'O')} (2-3,<br>IBA 2-1)`], ['LPL', '2 SPLITS']]), AZUL)));

// ── 16 · fp-revancha · A ─── la copa con otro recorte ── (empuje)
slides.push(lamina('fp-revancha', 'Y hay revanchas por todos lados.', `
      ${DOBLE}
      ${arte('copa.jpg', 'La copa del Mundial', { pos: '50% 22%', zoom: 1, k: 'arte', filtro: 'brightness(.8)' })}
      ${veloIzq(0.85)}
      ${dato('REVANCHAS', { x: 56, y: 430, w: 900, tam: 180, tracking: 10, k: 'titulo', nowrap: true })}`));

// ── 17 · fp-bin-canyon · D ─── Bin contra Canyon, final 2020 ── (cortina a mano + destello)
slides.push(lamina('fp-bin-canyon', 'Bin perdió la final de 2020 contra Canyon, que mañana está enfrente.', `
      ${DOBLE}
      ${mitad('izq', `${fondoMitad('izq', AZUL)}
        <div style="position: absolute; left: ${270 - 306}px; top: ${PH - 520}px; width: 612px; height: 520px;"><img src="assets/fotos/bin.webp" alt="Foto oficial de Bin" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>
        ${veloAbajo(0.85)}
        ${dato('BIN · BLG', { x: 60, y: 560, w: 420, tam: 60, tracking: 6, color: AZUL })}`)}
      ${mitad('der', `${fondoMitad('der', ORO)}
        <div style="position: absolute; left: ${810 - 300}px; top: ${PH - 520}px; width: 599px; height: 520px;"><img src="assets/fotos/canyon.webp" alt="Foto oficial de Canyon" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>
        ${veloAbajo(0.85)}
        ${dato('CANYON · GEN.G', { x: 560, y: 560, w: 400, tam: 60, tracking: 6, color: ORO, alinear: 'right', nowrap: true })}`)}
      ${costura()}
      <div data-k="destello" style="position: absolute; left: ${540 - 240}px; top: ${330 - 240}px; pointer-events: none;">${kit.destello({ tam: 480, rayos: 18, color: '#FFE9B8', semilla: 'bin-canyon' })}</div>
      ${dato(`FINAL 2020 · <span style="color: ${ORO};">CANYON MVP</span>`, { x: 60, y: 190, w: 960, tam: 70, tracking: 6, alinear: 'center', k: 'titulo', nowrap: true })}`));

// ── 18 · fp-ruler · B ─── Ruler, campeón 2017 ── (brillo)
slides.push(lamina('fp-ruler', 'Ruler ya sabe lo que es ganar: fue campeón en 2017.', L_B(`
        ${brillo(ORO, { x: 50, y: 55, r: 60, fuerza: 0.3 })}
        ${logo('GEN', { x: 24, y: 300, w: 420, estilo: 'opacity: .07; filter: grayscale(1) brightness(1.8);' })}
        ${foto('ruler')}`, `
      ${dato('RULER', { x: BX, y: 190, w: BW, tam: 124, tracking: 6, k: 'nombre' })}
      ${dato('GEN.G', { x: BX, y: 318, w: BW, tam: 58, tracking: 10, color: ORO, k: 'equipo' })}
      ${dato('<span data-k="campeon" style="display: inline-block;">CAMPEÓN</span>', { x: BX, y: 396, w: BW, tam: 92, tracking: 4, color: ORO, nowrap: true })}
      ${dato('2017', { x: BX, y: 494, w: BW, tam: 130, tracking: 6, k: 'anio' })}`, ORO)));

// ── 19 · fp-hora · A ─── sábado 14/11, 1:00 PM CDMX, Brooklyn ── (palabra)
slides.push(lamina('fp-hora', 'La final es mañana sábado en Brooklyn, a la una de la tarde hora de México.', `
      ${respaldo('copa-fondo.jpg', { blur: 14, brillo: 0.36 })}
      ${DOBLE}
      ${dato('SÁBADO 14/11', { x: 60, y: 194, w: 900, tam: 84, tracking: 8, k: 'dia', nowrap: true })}
      ${dato(`<span data-k="hora" style="display: inline-block;">1:00 PM</span> <span data-k="cdmx" style="display: inline-block; font-size: .5em; letter-spacing: 6px; color: ${a(LUZ, 0.8)};">CDMX</span>`, { x: 56, y: 288, w: 960, tam: 200, lh: 0.95, tracking: 4, nowrap: true })}
      ${dato('BROOKLYN', { x: 60, y: 510, w: 900, tam: 96, tracking: 14, k: 'lugar', nowrap: true })}`));

// ── 20 · fp-ceremonia · D ─── K/DA y True Damage ── (cortinilla de cada mitad)
slides.push(lamina('fp-ceremonia', 'Antes de la primera partida va a estar la ceremonia con K/DA y True Damage, que van a cantar Know My Name.', `
      ${respaldo('splash/Akali_103-fondo.jpg', { blur: 18, brillo: 0.4 })}
      ${mitad('izq', `${imgMitad('izq', 'splash/Ahri_97.jpg', 'Ahri K/DA FIRESTARTER, splash', '45% 35%', { k: 'a-izq', filtro: 'brightness(.8)' })}
        ${veloAbajo(0.85)}
        ${dato('K/DA', { x: 60, y: 536, w: 420, tam: 84, tracking: 8, k: 'kda' })}`)}
      ${mitad('der', `${imgMitad('der', 'splash/Akali_103.jpg', 'Akali True Damage Know My Name, splash', '45% 30%', { k: 'a-der', filtro: 'brightness(.8)' })}
        ${veloAbajo(0.85)}
        ${dato('TRUE DAMAGE', { x: 560, y: 536, w: 400, tam: 84, tracking: 4, alinear: 'right', k: 'td', nowrap: true })}`)}
      ${costura()}
      ${dato('KNOW MY NAME', { x: 60, y: 192, w: 960, tam: 76, tracking: 10, alinear: 'center', k: 'himno', nowrap: true })}`));

// ── 21 · fp-league-next · A ─── Ekko Know My Name desenfocado ── (iris a mano)
slides.push(lamina('fp-league-next', 'Riot va a enseñar un avance de League Next, pero no la presentación completa.', `
      ${respaldo('splash/Ekko_59-fondo.jpg', { blur: 18, brillo: 0.3 })}
      <div data-k="arte" style="position: absolute; inset: 0; overflow: hidden;"><div style="position: absolute; inset: -40px; background-image: url('assets/splash/Ekko_59.jpg'); background-size: cover; background-position: 55% 30%; filter: blur(7px) brightness(.55);"></div></div>
      ${veloIzq(0.75)}
      ${dato('LEAGUE NEXT', { x: 56, y: 300, w: 960, tam: 190, tracking: 8, k: 'titulo', nowrap: true })}
      ${dato('AVANCE · NO LA PRESENTACIÓN COMPLETA', { x: 62, y: 500, w: 900, tam: 54, tracking: 4, color: a(LUZ, 0.85), k: 'avance', nowrap: true })}`));

// ── 22 · fp-pronostico · D ─── cabeza: Gen.G, corazón: BLG ── (cortina a mano; BLG queda más grande)
slides.push(lamina('fp-pronostico', 'La cabeza me dice Gen.G, pero le voy a BLG.', `
      ${DOBLE}
      ${mitad('izq', `${fondoMitad('izq', ORO)}
        ${logo('GEN', { x: 270 - 120, y: 210, w: 240, k: 'l-gen' })}
        ${dato(`CABEZA: <span style="color: ${ORO};">GEN.G</span>`, { x: 60, y: 520, w: 440, tam: 76, tracking: 5, nowrap: true })}`)}
      ${mitad('der', `${fondoMitad('der', AZUL)}
        ${logo('BLG', { x: 810 - 180, y: 250, w: 360, k: 'l-blg', estilo: `filter: drop-shadow(0 0 40px ${a(AZUL, 0.5)});` })}
        ${dato(`CORAZÓN: <span style="color: ${AZUL};">BLG</span>`, { x: 560, y: 520, w: 400, tam: 76, tracking: 5, alinear: 'right', nowrap: true })}`)}
      ${costura()}`));

// ── 23 · fp-marcador · A ─── BLG 3–2 ── (tragamonedas + chispas azules)
slides.push(lamina('fp-marcador', 'BLG tres dos y que Knight haga historia.', `
      ${brillo(AZUL, { x: 74, y: 55, r: 60, fuerza: 0.34 })}
      <div style="position: absolute; left: 560px; top: ${PH - 600}px; width: ${Math.round((600 * 712) / 621)}px; height: 600px;"><img src="assets/fotos/knight.webp" alt="Foto oficial de Knight" style="width: 100%; height: 100%; object-fit: contain; display: block;"></div>
      ${veloIzq(0.8)}
      <div data-k="chispas" style="position: absolute; left: 0; top: 200px; width: 700px; height: 300px;"></div>
      <div style="position: absolute; left: 56px; top: 210px; display: flex; align-items: baseline; gap: 30px; white-space: nowrap; text-shadow: 0 10px 40px rgba(0,0,0,.85);">
        <span data-k="blg" style="font-size: 170px; line-height: 1; letter-spacing: 8px; color: ${AZUL};">BLG</span><span data-k="marcador" style="display: inline-block; font-size: 270px; line-height: .95; letter-spacing: 6px;">3–2</span>
      </div>`));

// ── 24 · fp-cierre · A ─── la copa: ¿a quién le vas? ── (palabra)
slides.push(lamina('fp-cierre', 'Y ustedes, ¿a quién le van?', `
      ${DOBLE}
      ${arte('copa.jpg', 'La copa del Mundial', { x: 600, w: 480, h: PH, pos: '50% 40%', ajuste: 'contain', filtro: 'brightness(.9)', estilo: '-webkit-mask-image: radial-gradient(closest-side, #000 72%, transparent 100%); mask-image: radial-gradient(closest-side, #000 72%, transparent 100%);' })}
      ${veloIzq(0.8)}
      ${dato('<span data-k="pregunta" style="display: inline-block;">¿A QUIÉN<br>LE VAS?</span>', { x: 56, y: 196, w: 700, tam: 190, lh: 0.95, tracking: 6, nowrap: true })}
      <div data-k="logos" style="position: absolute; left: 64px; top: 560px; display: flex; align-items: center; gap: 30px;">${logoEn('GEN', 80, 68)}${logoEn('BLG', 140, 64)}</div>`));

// ── reposo · A ─── la copa desenfocada al 45 % ──
slides.push(lamina('fp-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${respaldo('copa-fondo.jpg', { blur: 16, brillo: 0.45 })}
      ${DOBLE}
      ${dato(`<span style="color: ${ORO};">GEN.G</span> VS <span style="color: ${AZUL};">BLG</span>`, { x: 60, y: 190, w: 500, tam: 48, tracking: 6 })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  var muestra = function (tl, el, en) { if (el) tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, en); };
  var cae = function (tl, el, en) { if (el) tl.from(el, { y: -70, scale: 1.25, opacity: 0, duration: 0.5, ease: 'golpe' }, en); };
  // «pulso» no existe en el kit: latido de escala con la curva golpe (nota de jhin-build).
  var pulso = function (tl, el, en) { if (el) tl.to(el, { scale: 1.08, duration: 0.2, ease: 'golpe', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, en); };
  var traza = function (tl, el, en, d) { if (el) tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 0.4, ease: 'entrada', immediateRender: true }, en); };
  // La «cortina» del paquete: cada mitad entra desde su lado (a mano, como en zed).
  var cortina = function (tl, s, en) {
    tl.from(k(s, 'izq'), { x: -580, duration: 0.8, ease: 'power3.out' }, en);
    tl.from(k(s, 'der'), { x: 580, duration: 0.8, ease: 'power3.out' }, en + 0.2);
  };
  var C = {
    'fp-portada': function (tl, s) {
      efecto('parallax', tl, k(s, 'capas'), { dur: 2.2, distancia: 40 });
      cae(tl, k(s, 'gen'), 0.5); cae(tl, k(s, 'blg'), 0.75);
      aparece(tl, k(s, 'final'), 1.05, 0.4); aparece(tl, k(s, 'nuevo'), 1.3, 0.5);
    },
    'fp-chovy': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'panel'), { forma: 'persiana', direccion: 'izquierda', dur: 0.6 });
      tl.from(k(s, 'foto'), { opacity: 0, x: -30, duration: 0.6, ease: 'entrada' }, 0);
      aparece(tl, k(s, 'nombre'), 0.45); aparece(tl, k(s, 'equipo'), 0.65);
      muestra(tl, k(s, 'cero'), 0.85);
      efecto('contador', tl, k(s, 'cero'), { en: 0.85, dur: 0.9, desde: 9, cuenta: 0, ease: 'power1.out' });
      aparece(tl, k(s, 'mundiales'), 0.85, 0.4); aparece(tl, k(s, 'primera'), 1.5, 0.4);
    },
    'fp-knight': function (tl, s) {
      tl.from(k(s, 'foto'), { opacity: 0, x: -30, duration: 0.6, ease: 'entrada' }, 0);
      efecto('maquina', tl, k(s, 'l1'), { en: 0.2, ritmo: 0.05, cursor: 'no' });
      efecto('maquina', tl, k(s, 'l2'), { en: 0.6, ritmo: 0.05, cursor: 'no' });
      efecto('maquina', tl, k(s, 'l3'), { en: 0.9, ritmo: 0.04, cursor: 'no' });
    },
    'fp-favorito': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      // La dona del kit traza cada arco en orden (el «trazada con dibujo» del paquete).
      efecto('dona', tl, k(s, 'dona'), { en: 0.25, dur: 1.2 });
      muestra(tl, k(s, 'p-gen').parentNode, 0.3); muestra(tl, k(s, 'p-blg').parentNode, 0.9);
      efecto('contador', tl, k(s, 'p-gen'), { en: 0.3, dur: 1.2, cuenta: ${PRONOSTICO.gen} });
      efecto('contador', tl, k(s, 'p-blg'), { en: 0.9, dur: 0.9, cuenta: ${PRONOSTICO.blg} });
    },
    'fp-diezuno': function (tl, s) {
      muestra(tl, k(s, 'marcador'), 0.15);
      efecto('tragamonedas', tl, k(s, 'marcador'), { en: 0.15, dur: 1.5 });
      aparece(tl, k(s, 'etq'), 1.1, 0.45);
    },
    'fp-camino-gen': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      efecto('bento', tl, k(s, 'fila'), { desde: 'start', escalon: 0.28, dur: 0.5, en: 0.15 });
      // IG y LYON repetidos laten cuando aparece su segunda tarjeta.
      var t = q(s, '[data-tarjeta]');
      pulso(tl, t[3], 0.15 + 3 * 0.28 + 0.45); pulso(tl, t[2], 0.15 + 3 * 0.28 + 0.45);
      pulso(tl, t[4], 0.15 + 4 * 0.28 + 0.45); pulso(tl, t[0], 0.15 + 4 * 0.28 + 0.45);
    },
    'fp-un-coreano': function (tl, s) {
      // La «crece» del paquete, a mano: HLE crece con borde dorado y las demás bajan a gris.
      q(s, '[data-tarjeta]').forEach(function (el) {
        if (el.getAttribute('data-eq') === 'HLE') tl.to(el, { scale: 1.12, borderColor: '${ORO}', boxShadow: '0 0 40px ${a(ORO, 0.55)}', zIndex: 2, duration: 0.6, ease: 'asentar' }, 0.3);
        else tl.to(el, { filter: 'grayscale(1) brightness(.45)', duration: 0.5, ease: 'entrada' }, 0.15);
      });
      aparece(tl, k(s, 'coreanos'), 0.9, 0.45);
    },
    'fp-camino-blg': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      efecto('mazo', tl, k(s, 'fila'), { en: 0.1, dur: 1.0, semilla: 'camino-blg' });
    },
    'fp-hle': function (tl, s) {
      tl.from(k(s, 'logo'), { opacity: 0, scale: 0.9, duration: 0.5, ease: 'asentar' }, 0);
      aparece(tl, k(s, 'msi'), 0.3, 0.4);
      efecto('sello', tl, k(s, 'sello'), { en: 0.9, fuerza: 10 });
      aparece(tl, k(s, 'resultado'), 1.5, 0.4);
    },
    'fp-dk': function (tl, s) {
      tl.from(k(s, 'logo'), { opacity: 0, scale: 0.9, duration: 0.5, ease: 'asentar' }, 0);
      aparece(tl, k(s, 'invicto'), 0.3, 0.4);
      efecto('golpe', tl, k(s, 'resultado'), { en: 1.0 });
    },
    'fp-t1': function (tl, s) {
      tl.from(k(s, 'logo'), { opacity: 0, scale: 0.9, duration: 0.5, ease: 'asentar' }, 0);
      muestra(tl, k(s, 'tri'), 0.1);
      efecto('revuelto', tl, k(s, 'tri'), { en: 0.1, dur: 0.7 });
      traza(tl, k(s, 'tachon'), 0.9, 0.4);
      tl.to(k(s, 'tri-linea'), { color: '${GRIS}', duration: 0.35 }, 0.95);
      aparece(tl, k(s, 'anios'), 0.6, 0.4);
      muestra(tl, k(s, 'resultado'), 1.35);
      tl.from(k(s, 'resultado'), { scale: 1.2, transformOrigin: '0% 60%', duration: 0.35, ease: 'golpe' }, 1.35);
    },
    'fp-cuarto': function (tl, s) {
      tl.from(q(s, '[data-ranura]'), { opacity: 0, y: 20, duration: 0.4, ease: 'entrada', stagger: 0.1 }, 0);
      // Los tres tachones, uno tras otro (dibujo).
      efecto('dibujo', tl, k(s, 'tachones'), { en: 0.5, dur: 0.35, escalon: 0.35 });
      pulso(tl, k(s, 'gen'), 1.75);
      aparece(tl, k(s, 'cuenta'), 1.4, 0.45);
    },
    'fp-anio': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-gen'), { n: 5, en: 0.1, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-blg'), { n: 5, en: 0.35, dur: 0.8 });
      aparece(tl, k(s, 'titulo'), 1.0, 0.5);
    },
    'fp-gen-anio': function (tl, s) {
      tl.from(k(s, 'logo'), { opacity: 0, scale: 0.9, duration: 0.5, ease: 'asentar' }, 0);
      q(s, '[data-res]').forEach(function (el, i) { aparece(tl, el.previousElementSibling, 0.2 + i * 0.4, 0.3); muestra(tl, el, 0.3 + i * 0.4); efecto('maquina', tl, el, { en: 0.3 + i * 0.4, ritmo: 0.025, cursor: 'no' }); });
    },
    'fp-blg-anio': function (tl, s) {
      tl.from(k(s, 'logo'), { opacity: 0, scale: 0.9, duration: 0.5, ease: 'asentar' }, 0);
      q(s, '[data-res]').forEach(function (el, i) { aparece(tl, el.previousElementSibling, 0.2 + i * 0.45, 0.3); muestra(tl, el, 0.3 + i * 0.45); efecto('letras', tl, el, { en: 0.3 + i * 0.45, dur: 0.5, escalon: 0.03 }); });
    },
    'fp-revancha': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.25, origen: '50% 22%', dur: 2.5 });
      aparece(tl, k(s, 'titulo'), 0.5, 0.6);
    },
    'fp-bin-canyon': function (tl, s) {
      cortina(tl, s, 0.05);
      efecto('destello', tl, k(s, 'destello'), { en: 0.95, dur: 1.4, semilla: 'bin-canyon' });
      aparece(tl, k(s, 'titulo'), 1.1, 0.45);
    },
    'fp-ruler': function (tl, s) {
      tl.from(k(s, 'foto'), { opacity: 0, x: -30, duration: 0.6, ease: 'entrada' }, 0);
      aparece(tl, k(s, 'nombre'), 0.2); aparece(tl, k(s, 'equipo'), 0.4);
      aparece(tl, k(s, 'campeon'), 0.65, 0.4);
      efecto('brillo', tl, k(s, 'campeon'), { en: 1.0, dur: 1.1, color: '#FFF1C8' });
      aparece(tl, k(s, 'anio'), 0.9, 0.4);
    },
    'fp-hora': function (tl, s) {
      aparece(tl, k(s, 'dia'), 0.05, 0.4);
      efecto('palabra', tl, k(s, 'hora'), { en: 0.5 });
      aparece(tl, k(s, 'cdmx'), 0.65, 0.35);
      aparece(tl, k(s, 'lugar'), 1.0, 0.45);
    },
    'fp-ceremonia': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'a-izq'), { direccion: 'derecha', dur: 0.8, en: 0.05 });
      efecto('cortinilla', tl, k(s, 'a-der'), { direccion: 'izquierda', dur: 0.8, en: 0.3 });
      aparece(tl, k(s, 'kda'), 0.8, 0.4); aparece(tl, k(s, 'td'), 1.0, 0.4);
      aparece(tl, k(s, 'himno'), 1.3, 0.45);
    },
    'fp-league-next': function (tl, s) {
      // El iris del paquete, a mano sobre el arte (el del kit recorta la sección entera).
      tl.fromTo(k(s, 'arte'), { clipPath: 'circle(0% at 60% 45%)' }, { clipPath: 'circle(120% at 60% 45%)', duration: 1.1, ease: 'power3.inOut', immediateRender: true }, 0.05);
      aparece(tl, k(s, 'titulo'), 0.6, 0.5); aparece(tl, k(s, 'avance'), 1.1, 0.45);
    },
    'fp-pronostico': function (tl, s) {
      cortina(tl, s, 0.05);
      // La de BLG queda un poco más grande.
      tl.to(k(s, 'l-blg'), { scale: 1.1, duration: 0.6, ease: 'asentar', transformOrigin: '50% 50%' }, 1.3);
    },
    'fp-marcador': function (tl, s) {
      aparece(tl, k(s, 'blg'), 0.05, 0.4);
      muestra(tl, k(s, 'marcador'), 0.3);
      efecto('tragamonedas', tl, k(s, 'marcador'), { en: 0.3, dur: 1.4 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 1.4, dur: 1.3, color: '${AZUL},#BFE4FF,#FFFFFF', origen: '55 40', semilla: 'blg-32' });
    },
    'fp-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'pregunta'), { en: 0.3 });
      tl.from(k(s, 'logos').children, { opacity: 0, y: 16, duration: 0.4, ease: 'entrada', stagger: 0.15 }, 0.9);
    },
    'fp-reposo': function () {},
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
<title>Gen.G vs BLG · Pronóstico</title>
${kit.og({ titulo: 'Gen.G vs BLG · Pronóstico', descripcion: 'Mañana alguien gana su primer Mundial sí o sí: el favorito, contra quién le ganó cada uno, el año de los dos, las revanchas, la hora y el pronóstico, en banda superior.', carpeta: 'creator/final-pronostico' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(10,14,23,0.85); color: ${LUZ}; cursor: pointer;
    font: 600 13px/1 system-ui, sans-serif; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="arriba">
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
