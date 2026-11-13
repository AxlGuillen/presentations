// Generador de index.html — «Zed cumple 14 años» (Cumplelolero, viernes 13/11/2026)
// Ejecutar: node creator/zed/gen.js   ·   clips: node tools/laminas.mjs creator/zed --banda=arriba
//
// Sigue al pie de la letra el paquete `2026-11-13_zed-cumple-14-anos--paquete.md` (PKB de Axl):
//   · **Formato de jhin-letalidad** (banda ARRIBA): el riel, el panel, `arte`, `respaldo`, `dato`,
//     `mitad`/`costura` y la ranura con marco del HUD están copiados de creator/jhin-letalidad/gen.js.
//     El riel lleva otra semilla y tres destellos (Zed y sus dos sombras).
//   · **Estilo de la serie de senna y ambessa**: Bebas Neue, layouts A–F y el OTP con el `letrero` del
//     kit y el emblema detrás al 40 %.
//   · **Zona segura de la banda arriba**: nada de texto ni cifras en los primeros 180 px; el texto va de
//     y 180 a 640, entre x 60 y 960. El arte sí va a sangre.
//   · Solo arte oficial: Data Dragon (splash, pantallas de carga, centrada, habilidades e items), las
//     cartas de Legends of Runeterra, el emblema de Platino (CommunityDragon, copiado de senna), los
//     logos de blg-final y la copa de ganan. Lo dibujado es dato: las gráficas, las tarjetas de fecha,
//     los tachones, el sello, el rayo, las chispas y el destello.
//   · El texto en pantalla es solo el dato. Las citas y las groserías van en la voz (ni en pantalla ni
//     en las notas). El nombre del OTP no sale: «#1 DEL MUNDO · VIETNAM».
//   · Ninguna lámina arranca en negro ni tarda más de 2,8 s en entrar. Sin dinero en pantalla.
//
// ⚠️ Recetas que el paquete pide y se cambiaron (anotadas también en el paquete):
//   · La tabla del paquete repite `cortina`, `maquina`, `revuelto` y `crece` tres veces, y su propia
//     regla dice que nada salvo `contador` y `empuje` pasa de dos. Para cumplirla:
//       - zd-ryu: las mitades entran con `empuje` (que sí puede repetirse) y el `destello` en la
//         diagonal es la receta principal, en vez de `cortina`;
//       - zd-yasuo: las dos líneas entran con `lineas`, no con `maquina`;
//       - zd-sinfaker: el tachón de T1 se traza a mano, sin `revuelto`;
//       - zd-partidas: las barras crecen desde 0 con la curva `entrada` (la regla de las gráficas),
//         no con `crece`, que en el kit es el FLIP de una celda. `crece` va en zd-kinkou y zd-ultima.
//   · `cortina` no existe en el kit como «cada mitad entra desde su lado»: va a mano (zd-martes13 y
//     zd-shen), como en jhin-letalidad y senna. `iris` va a mano sobre el arte (zd-yasuo y
//     zd-galactico): el del kit recorta la <section> entera y la banda quedaría vacía en el cuadro 0.
//   · `brillo` del kit es para texto: en zd-caja es un barrido de luz a mano sobre la carta.
//   · `pulso` no existe (nota de jhin-build): no se usa.
//   · «Cae con la curva golpe» (zd-final, zd-combo y zd-qss) es la curva del kit, no una receta.
//   · `data-paso`: no hay voz alineada y las láminas duran 2,5 s, así que los pasos van escalonados en
//     el orden del guion; cada pieza lleva su data-paso para cuando el montaje los sincronice.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (sección 1.5) ─────────────────────────────────────────────────
const BG = '#0B0A10';      // negro sombra
const ROJO = '#E03A3E';    // lo de Zed: cifras clave, acentos, la barra protagonista
const LUZ = '#F3EFE2';     // cifras y texto
const ORO = '#C9A45C';     // solo Faker y SKT
const GRIS = '#5B6461';    // lo malo y lo que se compara
const TIP = '#010A13';     // marco de ranura del HUD (de jhin-letalidad)
const BORDE = '#785A28';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── Datos (sección 5, de zed-data-presentacion, actualizada el 12/11) ────
const OTP = { region: 'VIETNAM', puntos: 10874348, rango: 'PLATINO 1', p2025: 2190, p2026: 16 };
const SKINS = [1, 2, 3, 10, 11, 13, 15, 30, 31, 38, 49, 58, 68, 69];
const REMONTADA = [['0–1', -1], ['0–2', -2], ['1–2', -1], ['2–2', 0], ['3–2', 1]]; // [marcador, ventaja de SKT]

// ── El riel (el de jhin-letalidad con otra semilla; kit.banda() lo invierte con la banda arriba) ──
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-zed');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  // Tres destellos: Zed y sus dos sombras. Dos del lado del gameplay en rojo; el otro, blanco.
  const brillos = [0, 1, 2].map((i) => {
    const lado = i < 2;
    const x = Math.round(lado ? 80 + i * 480 + r() * 380 : 300 + r() * 480), y = Math.round(lado ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${lado ? ROJO : LUZ}" opacity="${(0.5 + r() * 0.3).toFixed(2)}"/>`;
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
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${ROJO}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${ROJO}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas (de jhin-letalidad) ───────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

/** Arte a sangre o en una caja: <img> con object-fit cover, foco en `pos` y zoom fijo. */
const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block; ${filtro ? `filter: ${filtro};` : ''}">
      </div>`;
/** Copia desenfocada y opaca (no es data-fondo: la banda es opaca y se ve desde el cuadro 0). */
const respaldo = (src, { blur = 18, brillo = 0.3, pos = 'center', x = 0, y = 0, w = PW, h = PH, k = '', gris = false } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(${gris ? 0 : 1.1});"></div></div>`;
const veloIzq = (fuerza = 0.88) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.55)} 40%, ${a(BG, 0)} 68%);"></div>`;
const veloAbajo = (fuerza = 0.9) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(0deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.6)} 30%, ${a(BG, 0)} 58%);"></div>`;
const veloAbajoIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(95% 90% at 0% 85%, ${a(BG, 0.9)} 0%, ${a(BG, 0.45)} 45%, ${a(BG, 0)} 75%);"></div>`;

/** Texto: solo el dato. Siempre entre y 180 y 640, x 60 y 960 (zona segura de la banda arriba). */
const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true, nowrap = false } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.85);` : ''}${nowrap ? ' white-space: nowrap;' : ''}">${txt}</div>`;
/** Ordinal dibujado: Bebas no trae ª ni º (de blg-final). */
const ord = (n, l) => `${n}.<span style="display: inline-block; font-size: .5em; line-height: 1; vertical-align: .82em; border-bottom: .09em solid currentColor; margin-left: .03em;">${l}</span>`;

/** Ícono oficial (habilidad, item o campeón) con el marco del HUD de jhin-letalidad. */
const ranura = (src, alt, tam, { k = '', x = null, y = null, borde = '#C8AA6E', estilo = '', paso = null } = {}) => {
  const pos = x == null ? 'position: relative;' : `position: absolute; left: ${x}px; top: ${y}px;`;
  return `<div${k ? ` data-k="${k}"` : ''}${paso != null ? ` data-paso="${paso}"` : ''} style="${pos} width: ${tam}px; height: ${tam}px; box-sizing: border-box; border: ${Math.max(3, Math.round(tam / 40))}px solid ${borde}; background: ${TIP}; box-shadow: 0 10px 28px rgba(0,0,0,.65); ${estilo}"><img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; display: block;"></div>`;
};

/** Layout B: imagen a la izquierda (648×680) y panel de dato a la derecha (432×680, fondo al 92 %),
 *  separados por una línea de 2 px en rojo Zed. El texto del panel va de x 676 a 960. */
const L_B = (izquierda, derecha) => `
      <div data-k="izq" style="position: absolute; left: 0; top: 0; width: 648px; height: ${PH}px; overflow: hidden;">${izquierda}
      </div>
      <div data-k="panel" style="position: absolute; left: 648px; top: 0; width: 432px; height: ${PH}px; background: ${a(BG, 0.92)};"></div>
      <div style="position: absolute; left: 647px; top: 0; width: 2px; height: ${PH}px; background: ${ROJO};"></div>${derecha}`;
const BX = 676, BW = 284;

/** Layout D: dos mitades de 540×680 con un corte diagonal de 6° al centro. */
const T6 = Math.tan((6 * Math.PI) / 180) * (PH / 2);
const CLIP_IZQ = `polygon(0 0, ${(540 + T6).toFixed(1)}px 0, ${(540 - T6).toFixed(1)}px ${PH}px, 0 ${PH}px)`;
const CLIP_DER = `polygon(${(540 + T6).toFixed(1)}px 0, ${PW}px 0, ${PW}px ${PH}px, ${(540 - T6).toFixed(1)}px ${PH}px)`;
const mitad = (lado, contenido, k = lado) => `
      <div data-k="${k}" style="position: absolute; inset: 0; clip-path: ${lado === 'izq' ? CLIP_IZQ : CLIP_DER};">${contenido}
      </div>`;
const costura = (color = ROJO) => `
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="${(540 + T6).toFixed(1)}" y1="0" x2="${(540 - T6).toFixed(1)}" y2="${PH}" stroke="${color}" stroke-width="3"/></svg>`;
/** La imagen de una mitad, del ancho de la mitad más la diagonal (para que rebanadas la parta). */
const MW = Math.ceil(540 + T6);
// El filtro va en la caja y no en el <img>: rebanadas copia el <img> en tiras y la copia no lleva su filtro.
const imgMitad = (lado, src, alt, pos, { k = '', filtro = 'brightness(.85)', zoom = 1 } = {}) => arte(src, alt, { x: lado === 'izq' ? 0 : PW - MW, w: MW, h: PH, pos, zoom, k, estilo: `filter: ${filtro};` });

/** Tachón a mano (pathLength 1: se dibuja con strokeDashoffset). */
const tachon = (k, { x, y, w, h = 60, grosor = 10, color = LUZ } = {}) => `
      <svg viewBox="0 0 ${w} ${h}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: visible; pointer-events: none; z-index: 3;"><path data-k="${k}" d="M4 ${h * 0.62} C ${w * 0.3} ${h * 0.45}, ${w * 0.7} ${h * 0.6}, ${w - 4} ${h * 0.36}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const slides = [];

// ── 1 · zd-portada · A ─── Zed base en tres capas; el 14 con tragamonedas ── (parallax)
slides.push(lamina('zd-portada', 'Hoy viernes 13 cumple catorce años Zed.', `
      <div data-k="capas" style="position: absolute; inset: 0;">
        <div data-capa="0.4" style="position: absolute; inset: 0;">${respaldo('splash/Zed_0-fondo.jpg', { blur: 14, brillo: 0.55, pos: '60% 40%' })}</div>
        <div data-capa="1" style="position: absolute; left: 330px; top: 0; width: 750px; height: ${PH}px; -webkit-mask-image: radial-gradient(62% 78% at 56% 42%, #000 55%, transparent 100%); mask-image: radial-gradient(62% 78% at 56% 42%, #000 55%, transparent 100%);">
          <img src="assets/centered/Zed_0.jpg" alt="Zed, arte base" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: 46% 30%; display: block;">
        </div>
        ${veloIzq(0.72)}
        <div data-capa="1.8" style="position: absolute; inset: 0;">
          ${dato('<span data-k="catorce" style="display: inline-block;">14</span>', { x: 52, y: 172, w: 420, tam: 400, lh: 0.9, tracking: 0, color: ROJO, nowrap: true })}
          ${dato('AÑOS', { x: 64, y: 486, w: 400, tam: 128, tracking: 12, k: 'anios' })}
        </div>
      </div>`));

// ── 2 · zd-martes13 · D ─── dos tarjetas de fecha sobre Zed_15 desenfocado ── (cortina a mano + brillo)
const tarjetaFecha = (dia, anio, x) => `
        <div data-tarjeta style="position: absolute; left: ${x}px; top: 214px; width: 380px; height: 396px; box-sizing: border-box; border: 2px solid ${a(LUZ, 0.28)}; border-top: 8px solid ${ROJO}; background: ${a(BG, 0.84)}; box-shadow: 0 18px 44px rgba(0,0,0,.65); text-align: center;">
          <div style="margin-top: 26px; font-size: 64px; line-height: 1; letter-spacing: 8px;">${dia}</div>
          <div style="margin-top: 6px; font-size: 200px; line-height: 1; letter-spacing: 2px;"><span data-trece style="color: ${ROJO};">13</span></div>
          <div style="margin-top: 4px; font-size: 64px; line-height: 1; letter-spacing: 6px; color: ${a(LUZ, 0.85)};">NOV ${anio}</div>
        </div>`;
slides.push(lamina('zd-martes13', 'Salió un martes 13 de noviembre de 2012.', `
      ${respaldo('splash/Zed_15-fondo.jpg', { blur: 18, brillo: 0.32 })}
      ${mitad('izq', `
        ${respaldo('splash/Zed_15-fondo.jpg', { blur: 12, brillo: 0.4, pos: '25% 40%' })}
        ${tarjetaFecha('MARTES', 2012, 72)}`)}
      ${mitad('der', `
        ${respaldo('splash/Zed_15-fondo.jpg', { blur: 12, brillo: 0.5, pos: '75% 40%' })}
        ${tarjetaFecha('VIERNES', 2026, 590)}`)}
      ${costura()}`));

// ── 3 · zd-final · B ─── la copa y Gen.G contra BLG ── (los logos caen con la curva golpe)
slides.push(lamina('zd-final', 'Cumple justo un día antes de la final del Mundial.', L_B(`
        ${respaldo('copa.jpg', { blur: 16, brillo: 0.4, w: 648 })}
        ${arte('copa.jpg', 'La copa del Mundial', { w: 648, h: PH, pos: '50% 40%', filtro: 'brightness(.9)', k: 'copa' })}`, `
      ${dato('FINAL', { x: BX, y: 190, w: BW, tam: 130, tracking: 6, k: 'final' })}
      ${dato('SÁBADO 14/11', { x: BX, y: 330, w: BW, tam: 62, tracking: 3, color: ROJO, k: 'fecha', nowrap: true })}
      <img data-logo src="assets/logos/GEN.png" alt="Gen.G" style="position: absolute; left: ${BX}px; top: 440px; width: 124px; height: auto; filter: drop-shadow(0 8px 20px rgba(0,0,0,.7));">
      <img data-logo src="assets/logos/BLG.png" alt="Bilibili Gaming" style="position: absolute; left: ${BX + 140}px; top: 466px; width: 144px; height: auto; filter: drop-shadow(0 8px 20px rgba(0,0,0,.7));">`)));

// ── 4 · zd-asco · A ─── Exterminador Galáctico, sin texto ── (empuje lento)
slides.push(lamina('zd-asco', 'Como adecarry llorón, Zed me da asco.', `
      ${respaldo('splash/Zed_13-fondo.jpg', { blur: 12, brillo: 0.5 })}
      ${arte('splash/Zed_13.jpg', 'Zed Exterminador Galáctico, splash', { pos: '40% 45%', k: 'arte', filtro: 'brightness(.92)' })}`));

// ── 5 · zd-combo · E ─── W → R → E → Q → Prender ── (cae con golpe por data-paso + rayo)
const COMBO = [['habilidades/ZedW.png', 'Sombra Viviente (W)', 'W'], ['habilidades/ZedR.png', 'Marca de la Muerte (R)', 'R'],
  ['habilidades/ZedE.png', 'Corte Sombrío (E)', 'E'], ['habilidades/ZedQ.png', 'Shuriken Navaja (Q)', 'Q'], ['habilidades/SummonerDot.png', 'Prender', 'IGNITE']];
const CB = { tam: 160, sep: 36, y: 228 }, CBX = (PW - (5 * CB.tam + 4 * CB.sep)) / 2;
slides.push(lamina('zd-combo', 'Entra con la sombra, te tira la ulti, te pega el combo con ignite y se va.', `
      ${respaldo('splash/Zed_0-fondo.jpg', { blur: 18, brillo: 0.32, pos: '40% 60%' })}
      <div style="position: absolute; left: ${CBX}px; top: ${CB.y + CB.tam / 2 - 1}px; width: ${5 * CB.tam + 4 * CB.sep}px; height: 2px; background: ${a(ROJO, 0.5)};"></div>
      ${COMBO.map(([src, alt, etq], i) => {
        const x = CBX + i * (CB.tam + CB.sep);
        return `${ranura(src, alt, CB.tam, { x, y: CB.y, paso: i + 1, k: `h${i}`, borde: i === 4 ? '#C8AA6E' : ROJO })}
      <div data-etq style="position: absolute; left: ${x - 30}px; top: ${CB.y + CB.tam + 22}px; width: ${CB.tam + 60}px; text-align: center; font-size: 72px; line-height: 1; letter-spacing: 3px; color: ${i === 4 ? LUZ : ROJO}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${etq}</div>`;
      }).join('')}
      <div data-k="rayo" style="position: absolute; inset: 0;">${kit.rayo(['M-120 330 C 260 290, 720 370, 1200 300', 'M-120 352 C 320 320, 760 400, 1200 330'], { ancho: PW, alto: PH, color: ROJO, grosor: 10 })}</div>`));

// ── 6 · zd-zhonya · D ─── antes: Cronómetro → Ángel; ahora: Zhonya, sin Cronómetro ── (revuelto + tachón gris)
const flecha = (x, y, w = 60) => `<svg viewBox="0 0 ${w} 40" style="position: absolute; left: ${x}px; top: ${y - 20}px; width: ${w}px; height: 40px; overflow: visible;"><path d="M4 20 H${w - 8} M${w - 22} 6 L${w - 6} 20 L${w - 22} 34" fill="none" stroke="${a(LUZ, 0.7)}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
slides.push(lamina('zd-zhonya', 'Me armo Zhonyas antes. Mínimo el Ángel guardián te daba Cronómetro, pero ahorita no.', `
      ${respaldo('splash/Zed_13-fondo.jpg', { blur: 18, brillo: 0.3 })}
      ${mitad('izq', `
        ${respaldo('splash/Zed_13-fondo.jpg', { blur: 14, brillo: 0.36, pos: '20% 50%', gris: true })}
        ${dato('ANTES', { x: 60, y: 192, w: 420, tam: 60, tracking: 10, alinear: 'center', color: a(LUZ, 0.8), k: 'antes' })}
        ${ranura('items/2420.png', 'Cronómetro', 130, { x: 100, y: 272, k: 'cronometro' })}
        ${flecha(244, 337)}
        ${ranura('items/3026.png', 'Ángel guardián', 130, { x: 318, y: 272, k: 'angel' })}
        ${dato('<span data-k="txt-crono">CRONÓMETRO</span>', { x: 50, y: 438, w: 440, tam: 84, tracking: 4, alinear: 'center', k: 'crono-linea' })}
        ${tachon('tachon', { x: 92, y: 450, w: 356, h: 70, grosor: 12, color: GRIS })}
        ${dato('QUITADO EN 14.1', { x: 50, y: 544, w: 440, tam: 58, tracking: 4, alinear: 'center', color: GRIS, k: 'quitado' })}`)}
      ${mitad('der', `
        ${respaldo('splash/Zed_13-fondo.jpg', { blur: 14, brillo: 0.46, pos: '75% 40%' })}
        ${dato('AHORA', { x: 600, y: 192, w: 380, tam: 60, tracking: 10, alinear: 'center', k: 'ahora' })}
        <div data-k="vacia" style="position: absolute; left: 640px; top: 272px; width: 130px; height: 130px; box-sizing: border-box; border: 3px dashed ${a(GRIS, 0.9)}; background: ${a(TIP, 0.6)};"></div>
        ${flecha(784, 337)}
        ${ranura('items/3157.png', 'Reloj de arena de Zhonya', 130, { x: 858, y: 272, k: 'zhonya' })}`)}
      ${costura()}`));

// ── 7 · zd-faker · B ─── Zed SKT T1 ── (cortinilla del panel + maquina)
slides.push(lamina('zd-faker', 'Su skin de SKT fue la primera skin de campeón del mundo de Faker; Riot le sacó un croma en el parche de este Mundial.', L_B(`
        ${respaldo('splash/Zed_2-fondo.jpg', { blur: 14, brillo: 0.45, w: 648 })}
        ${arte('splash/Zed_2.jpg', 'Zed SKT T1, splash', { w: 648, h: PH, pos: '57% 35%', zoom: 1.05, filtro: 'brightness(.9)' })}`, `
      <div data-k="txt" style="position: absolute; inset: 0;">
        ${dato('<span data-k="l1">SKT T1</span>', { x: BX, y: 190, w: BW, tam: 104, tracking: 4, color: ORO, nowrap: true })}
        ${dato('<span data-k="l2">2014</span>', { x: BX, y: 296, w: BW, tam: 74, tracking: 6 })}
        ${dato(`<span data-k="l3">${ord(1, 'A')} SKIN DE<br>CAMPEÓN<br>DE FAKER</span>`, { x: BX, y: 388, w: BW, tam: 52, lh: 1.02, tracking: 2, nowrap: true })}
        ${dato('<span data-k="l4">CROMA ÉLITE<br>PARCHE 26.20</span>', { x: BX, y: 552, w: BW, tam: 40, lh: 1.04, tracking: 2, color: ORO, nowrap: true })}
      </div>`)));

// ── 8 · zd-cero · C ─── Mundial 2026: 0 picks · 0 bans ── (contador de 9 a 0 + sello gris)
slides.push(lamina('zd-cero', 'Cero picks y cero bans en todo el torneo.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 18, brillo: 0.3, gris: true })}
      <div data-k="sello" style="position: absolute; left: 300px; top: 184px; width: 480px;">${kit.sello('MUNDIAL 2026', { color: GRIS, ancho: 480, alto: 130, rotacion: -4, semilla: 13 })}</div>
      <div style="position: absolute; left: 60px; top: 330px; width: 900px; display: flex; justify-content: center; gap: 90px; text-shadow: 0 8px 34px rgba(0,0,0,.85);">
        <div style="display: flex; align-items: baseline; gap: 22px;"><span data-k="c1" style="font-size: 250px; line-height: .9; color: ${LUZ}; display: inline-block; min-width: .45em; text-align: right;">0</span><span style="font-size: 90px; line-height: 1; letter-spacing: 4px;">PICKS</span></div>
        <div style="display: flex; align-items: baseline; gap: 22px;"><span data-k="c2" style="font-size: 250px; line-height: .9; color: ${LUZ}; display: inline-block; min-width: .45em; text-align: right;">0</span><span style="font-size: 90px; line-height: 1; letter-spacing: 4px;">BANS</span></div>
      </div>`));

// ── 9 · zd-sinfaker · D ─── T1 en gris y tachado; Gen.G contra BLG ── (rebanadas + tachón a mano)
slides.push(lamina('zd-sinfaker', 'Faker ni siquiera llegó a la final porque BLG lo sacó.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 16, brillo: 0.48, gris: true })}
      ${mitad('izq', `
        ${imgMitad('izq', 'splash/Zed_2.jpg', 'Zed SKT T1, splash', '40% 35%', { k: 'reb-izq', filtro: 'grayscale(1) brightness(.32)' })}
        <img data-k="t1" src="assets/logos/T1.png" alt="T1" style="position: absolute; left: ${270 - 160}px; top: 268px; width: 320px; height: auto; filter: grayscale(1) brightness(1.7); opacity: .85;">
        ${tachon('tachon', { x: 88, y: 290, w: 364, h: 80, grosor: 14, color: LUZ })}`)}
      ${mitad('der', `
        ${imgMitad('der', 'copa.jpg', 'La copa del Mundial', '50% 35%', { k: 'reb-der', filtro: 'brightness(.36)' })}
        <img data-k="gen" src="assets/logos/GEN.png" alt="Gen.G" style="position: absolute; left: 618px; top: 252px; width: 150px; height: auto;">
        <img data-k="blg" src="assets/logos/BLG.png" alt="Bilibili Gaming" style="position: absolute; left: 790px; top: 284px; width: 170px; height: auto;">`)}
      ${costura()}
      ${veloAbajo(0.8)}
      ${dato('FINAL SIN FAKER', { x: 60, y: 500, w: 900, tam: 116, tracking: 8, alinear: 'center', k: 'frase' })}`));

// ── 10 · zd-otp · F ─── el letrero del OTP con el emblema de Platino detrás ── (letrero + contador)
slides.push(lamina('zd-otp', 'El otepé con más puntos del mundo es de Vietnam: diez punto ocho millones de puntos, en Platino 1.', `
      ${respaldo('splash/Zed_0-fondo.jpg', { blur: 16, brillo: 0.32, pos: '60% 30%' })}
      <img data-k="emblema" src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="position: absolute; left: 560px; top: 170px; width: 480px; height: auto; opacity: .4;">
      <div data-k="letrero" style="position: absolute; left: 60px; top: 186px;">
        ${kit.letrero({ nombre: '#1 DEL MUNDO', retrato: 'assets/carga/Zed_0.jpg', color: ROJO, tinta: LUZ, tam: 100, fuente: DISPLAY })}
      </div>
      ${dato(OTP.region, { x: 205, y: 318, w: 500, tam: 58, tracking: 8, color: ROJO, k: 'region' })}
      ${dato(`<span data-k="puntos">${num(OTP.puntos)}</span>`, { x: 56, y: 398, w: 900, tam: 150, tracking: 4, color: ROJO, nowrap: true })}
      ${dato(OTP.rango, { x: 62, y: 548, w: 600, tam: 74, tracking: 8, k: 'rango' })}`));

// ── 11 · zd-partidas · C ─── gráfica 1: partidas del #1 con Zed ── (barras desde 0 + contador)
const PB = { x: 230, ancho: 730, alto: 112 };
const barraP = (anio, valor, color, y, k) => {
  const w = Math.max(12, Math.round((PB.ancho * valor) / OTP.p2025)), dentro = w > 300;
  return `
      <div style="position: absolute; left: 60px; top: ${y}px; height: ${PB.alto}px; display: flex; align-items: center; font-size: 84px; line-height: 1; letter-spacing: 2px; color: ${color === ROJO ? LUZ : GRIS}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${anio}</div>
      <div data-barra data-k="${k}" style="position: absolute; left: ${PB.x}px; top: ${y}px; width: ${w}px; height: ${PB.alto}px; background: ${color}; border-radius: 0 6px 6px 0; transform-origin: 0 50%; display: flex; align-items: center; padding-left: 22px; box-sizing: border-box; font-size: 88px; line-height: 1; letter-spacing: 2px; color: ${LUZ};">${dentro ? `<span data-valor data-cuenta="${valor}">${num(valor)}</span><span style="margin-left: 18px; font-size: 48px; letter-spacing: 4px;">PARTIDAS</span>` : ''}</div>
      ${dentro ? '' : `<div style="position: absolute; left: ${PB.x + w + 20}px; top: ${y}px; height: ${PB.alto}px; display: flex; align-items: center; font-size: 88px; line-height: 1; letter-spacing: 2px; color: ${LUZ}; text-shadow: 0 4px 18px rgba(0,0,0,.9);"><span data-valor data-fuera data-cuenta="${valor}">${valor}</span></div>`}`;
};
slides.push(lamina('zd-partidas', 'Este año solo lo jugó dieciséis veces; el año pasado fueron más de dos mil.', `
      ${respaldo('splash/Zed_10-fondo.jpg', { blur: 18, brillo: 0.5 })}
      ${dato('PARTIDAS DEL #1 CON ZED', { x: 60, y: 190, w: 900, tam: 60, tracking: 6, alinear: 'center', k: 'titulo' })}
      ${barraP(2025, OTP.p2025, ROJO, 300, 'b25')}
      ${barraP(2026, OTP.p2026, GRIS, 470, 'b26')}`));

// ── 12 · zd-yasuo · D ─── Zed a la izquierda, Yasuo a la derecha ── (iris a mano + lineas)
slides.push(lamina('zd-yasuo', 'Su segundo campeón es Yasuo, y el número dos del mundo también tiene a Yasuo de segundo.', `
      ${respaldo('splash/Yasuo_0-fondo.jpg', { blur: 18, brillo: 0.34 })}
      <div data-k="escena" style="position: absolute; inset: 0;">
        ${mitad('izq', `
          ${respaldo('splash/Zed_0-fondo.jpg', { blur: 12, brillo: 0.42, pos: '45% 40%' })}
          ${ranura('campeones/Zed.png', 'Zed', 210, { x: 165, y: 196, borde: ROJO, estilo: `box-shadow: 0 0 40px ${a(ROJO, 0.45)};` })}`)}
        ${mitad('der', `
          ${imgMitad('der', 'splash/Yasuo_0.jpg', 'Yasuo, splash', '62% 35%', { filtro: 'brightness(.85)' })}`)}
        ${costura()}
      </div>
      ${veloAbajo(0.92)}
      ${dato(`<span data-k="lineas" style="display: block;">#1 DEL MUNDO: <span style="color: ${ROJO};">${ord(2, 'O')} YASUO</span><br>#2 DEL MUNDO: <span style="color: ${ROJO};">${ord(2, 'O')} YASUO</span></span>`, { x: 60, y: 446, w: 900, tam: 78, lh: 1.08, tracking: 4, nowrap: true })}`));

// ── 13 · zd-lore · A ─── la carta de LoR de Zed sobre el splash base ── (destello)
slides.push(lamina('zd-lore', 'Pasemos con su lore.', `
      ${respaldo('splash/Zed_0-fondo.jpg', { blur: 10, brillo: 0.5 })}
      ${arte('splash/Zed_0.jpg', 'Zed, splash', { pos: '50% 30%', filtro: 'brightness(.55)' })}
      ${veloIzq(0.7)}
      <div data-k="destello" style="position: absolute; left: ${330 - 300}px; top: ${340 - 300}px; pointer-events: none;">${kit.destello({ tam: 600, rayos: 18, color: ROJO, semilla: 'lore-zed' })}</div>
      <div data-k="carta" style="position: absolute; left: 60px; top: 200px; width: 540px; height: 280px; box-sizing: border-box; border: 3px solid ${ROJO}; overflow: hidden; box-shadow: 0 18px 44px rgba(0,0,0,.7);"><img src="assets/cartas/01IO009.jpg" alt="Zed (Legends of Runeterra)" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; display: block;"></div>
      ${dato('<span data-k="lore">LORE</span>', { x: 640, y: 236, w: 320, tam: 210, tracking: 8, color: ROJO })}`));

// ── 14 · zd-kinkou · B ─── el Espadachín Kinkou de LoR crece ── (crece)
slides.push(lamina('zd-kinkou', 'Llegó de niño al templo de la Orden Kinkou y lo crió el gran maestro Kusho.', L_B(`
        ${respaldo('cartas/01IO040-fondo.jpg', { blur: 16, brillo: 0.42, w: 648 })}
        <div data-k="crece" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
          <div data-elegida style="width: 280px; height: 300px; overflow: hidden; border-radius: 8px; box-shadow: 0 18px 44px rgba(0,0,0,.7);">
            <img src="assets/cartas/01IO040.jpg" alt="Espadachín Kinkou (Legends of Runeterra)" style="width: 100%; height: 100%; object-fit: cover; object-position: 48% 35%; display: block;">
          </div>
        </div>`, `
      ${dato('ORDEN<br>KINKOU', { x: BX, y: 192, w: BW, tam: 104, lh: 0.96, tracking: 4, k: 'orden' })}
      <div style="position: absolute; left: ${BX}px; top: 420px; width: 120px; height: 4px; background: ${ROJO};"></div>
      ${dato('MAESTRO', { x: BX, y: 446, w: BW, tam: 62, tracking: 6, color: a(LUZ, 0.8), k: 'maestro' })}
      ${dato('KUSHO', { x: BX, y: 510, w: BW, tam: 112, tracking: 6, color: ROJO, k: 'kusho' })}`)));

// ── 15 · zd-shen · D ─── Zed y Shen ── (cortina a mano)
slides.push(lamina('zd-shen', 'Junto a su hijo Shen, como si fueran hermanos.', `
      ${respaldo('splash/Shen_0-fondo.jpg', { blur: 18, brillo: 0.5 })}
      ${mitad('izq', `
        ${imgMitad('izq', 'splash/Zed_0.jpg', 'Zed, splash', '52% 30%', { zoom: 1.1 })}
        ${veloAbajo(0.85)}
        ${dato('ZED', { x: 60, y: 486, w: 420, tam: 140, tracking: 12, color: ROJO, k: 'zed' })}`)}
      ${mitad('der', `
        ${imgMitad('der', 'splash/Shen_0.jpg', 'Shen, splash', '50% 30%', { zoom: 1.1 })}
        ${veloAbajo(0.85)}
        ${dato('SHEN', { x: 600, y: 486, w: 360, tam: 140, tracking: 12, alinear: 'right', k: 'shen' })}`)}
      ${costura()}`));

// ── 16 · zd-jhin · A ─── Jhin base ── (empuje)
slides.push(lamina('zd-jhin', 'Un asesino que resultó ser Jhin, el de los dos videos de esta semana.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { blur: 12, brillo: 0.5 })}
      ${arte('splash/Jhin_0.jpg', 'Jhin, splash', { pos: '55% 30%', k: 'arte', filtro: 'brightness(.85)' })}
      ${veloAbajoIzq}
      ${dato('EL DEMONIO<br>DORADO', { x: 60, y: 400, w: 700, tam: 118, lh: 0.95, tracking: 6, k: 'texto' })}`));

// ── 17 · zd-rencor · A ─── Luna de Sangre, recorte cerrado ── (palabra)
slides.push(lamina('zd-rencor', 'Kusho le perdonó la vida a Jhin, y ahí nació todo su rencor.', `
      ${respaldo('splash/Zed_58-fondo.jpg', { blur: 12, brillo: 0.5 })}
      ${arte('splash/Zed_58.jpg', 'Zed Luna de Sangre, splash', { pos: '50% 34%', zoom: 1.55, filtro: 'brightness(.62)' })}
      ${veloAbajoIzq}
      ${dato('<span data-k="frase" style="display: inline-block;">EL DÍA QUE<br>PERDONARON A JHIN</span>', { x: 60, y: 404, w: 900, tam: 104, lh: 0.98, tracking: 4 })}`));

// ── 18 · zd-caja · B ─── la carta de LoR de la caja ── (barrido de luz a mano sobre la carta)
slides.push(lamina('zd-caja', 'Bajó a las catacumbas y abrió una caja negra que tenía prohibida.', L_B(`
        ${respaldo('splash/Zed_15-fondo.jpg', { blur: 16, brillo: 0.38, w: 648 })}
        <div data-k="carta" style="position: absolute; left: ${324 - 230}px; top: ${340 - 230}px; width: 460px; height: 460px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 60px ${a('#8A3CFF', 0.35)}, 0 18px 44px rgba(0,0,0,.7);">
          <img src="assets/cartas/01IO009T3.webp" alt="Zed, carta de hechizo (Legends of Runeterra)" style="width: 100%; height: 100%; display: block;">
          <div data-k="barrido" style="position: absolute; inset: 0; background: linear-gradient(110deg, transparent 38%, rgba(255,240,255,.55) 50%, transparent 62%); background-size: 260% 100%; background-position: 120% 0; mix-blend-mode: screen;"></div>
        </div>`, `
      ${dato('LA CAJA', { x: BX, y: 222, w: BW, tam: 104, tracking: 3, k: 'caja', nowrap: true })}
      ${dato('PROHIBIDA', { x: BX, y: 336, w: BW, tam: 86, tracking: 2, color: ROJO, k: 'prohibida', nowrap: true })}`)));

// ── 19 · zd-sangre · A ─── Zed base, otro recorte ── (letras)
slides.push(lamina('zd-sangre', 'Salió del templo con la caja en una mano y su espada con sangre fresca en la otra.', `
      ${respaldo('splash/Zed_0-fondo.jpg', { blur: 12, brillo: 0.5, pos: '70% 60%' })}
      ${arte('splash/Zed_0.jpg', 'Zed, splash', { pos: '72% 62%', zoom: 1.45, filtro: 'brightness(.6) saturate(.9)' })}
      ${veloIzq(0.85)}
      ${dato('<span data-k="l1" style="display: block;">LA ORDEN DE</span>', { x: 60, y: 300, w: 900, tam: 130, tracking: 6 })}
      ${dato('<span data-k="l2" style="display: block;">LA SOMBRA</span>', { x: 60, y: 430, w: 900, tam: 130, tracking: 6, color: ROJO })}`));

// ── 20 · zd-comic · B ─── la carta de LoR Marca de la Muerte ── (cortinilla diagonal)
slides.push(lamina('zd-comic', 'En el cómic, Kusho fingió su muerte; años después Zed descubre que Kusho liberó a Jhin y lo mató de verdad.', L_B(`
        ${respaldo('splash/Zed_58-fondo.jpg', { blur: 16, brillo: 0.36, w: 648 })}
        <div data-k="carta" style="position: absolute; left: ${324 - 230}px; top: ${340 - 230}px; width: 460px; height: 460px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 60px ${a(ROJO, 0.35)}, 0 18px 44px rgba(0,0,0,.7);">
          <img src="assets/cartas/01IO003.webp" alt="Marca de la Muerte (Legends of Runeterra)" style="width: 100%; height: 100%; display: block;">
        </div>`, `
      ${dato('CÓMIC', { x: BX, y: 214, w: BW, tam: 120, tracking: 8, k: 'comic' })}
      ${dato('«ZED»', { x: BX, y: 336, w: BW, tam: 110, tracking: 6, color: ROJO, k: 'titulo' })}
      ${dato('2019–2020', { x: BX, y: 474, w: BW, tam: 76, tracking: 4, k: 'anios', nowrap: true })}`)));

// ── 21 · zd-dosveces · C ─── Maestro Kusho: 2 veces ── (sello en rojo)
slides.push(lamina('zd-dosveces', 'O sea, mató a su maestro dos veces.', `
      ${respaldo('splash/Zed_58-fondo.jpg', { blur: 18, brillo: 0.32 })}
      ${dato('MAESTRO KUSHO', { x: 60, y: 194, w: 900, tam: 84, tracking: 8, alinear: 'center', k: 'titulo' })}
      <div style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;"><div data-k="dos" style="position: absolute; left: 300px; top: 266px; width: 200px; text-align: right; font-size: 360px; line-height: .9; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.85);">2</div></div>
      ${dato('VECES', { x: 528, y: 420, w: 400, tam: 140, tracking: 10, k: 'veces' })}`));

// ── 22 · zd-beso · D ─── Zed y Shen, otros recortes ── (rebanadas)
slides.push(lamina('zd-beso', 'De pilón le robó un beso a la prometida de Shen.', `
      ${respaldo('splash/Shen_0-fondo.jpg', { blur: 18, brillo: 0.5 })}
      ${mitad('izq', `${imgMitad('izq', 'splash/Zed_0.jpg', 'Zed, splash', '62% 45%', { k: 'reb-izq', zoom: 1.25, filtro: 'brightness(.8)' })}`)}
      ${mitad('der', `${imgMitad('der', 'splash/Shen_0.jpg', 'Shen, splash', '45% 40%', { k: 'reb-der', zoom: 1.25, filtro: 'brightness(.8)' })}`)}
      ${costura()}
      ${veloAbajo(0.9)}
      ${dato('LA PROMETIDA DE SHEN', { x: 60, y: 510, w: 900, tam: 100, tracking: 6, alinear: 'center', k: 'frase', nowrap: true })}`));

// ── 23 · zd-huerfano · A ─── Shen, recorte cerrado, sin texto ── (empuje hacia Shen)
slides.push(lamina('zd-huerfano', 'Lo que le dice a Shen cuando se topan en la partida (la frase va en la voz).', `
      ${respaldo('splash/Shen_0-fondo.jpg', { blur: 12, brillo: 0.5, pos: '50% 30%' })}
      ${arte('splash/Shen_0.jpg', 'Shen, splash', { pos: '52% 28%', zoom: 1.5, k: 'arte', filtro: 'brightness(.9)' })}`));

// ── 24 · zd-sombra · A ─── Zed_15: piedra, papel o tijera ── (maquina)
slides.push(lamina('zd-sombra', 'Juega piedra, papel o tijera con su sombra, y si pierde la mata.', `
      ${respaldo('splash/Zed_15-fondo.jpg', { blur: 12, brillo: 0.5 })}
      ${arte('splash/Zed_15.jpg', 'Zed, splash', { pos: '60% 35%', filtro: 'brightness(.7)' })}
      ${veloIzq(0.88)}
      ${['PIEDRA', 'PAPEL', 'TIJERA'].map((p, i) => dato(`<span data-palabra>${p}</span>`, { x: 60, y: 196 + i * 136, w: 600, tam: 132, tracking: 10, color: i === 2 ? ROJO : LUZ })).join('')}`));

// ── 25 · zd-skins · E ─── rejilla 7×2 con las 14 pantallas de carga ── (bento)
const RJ = { w: 138, h: 255, sep: 8, y: 26 }, RJX = (PW - (7 * RJ.w + 6 * RJ.sep)) / 2;
slides.push(lamina('zd-skins', 'De skins tiene catorce y ninguna de este año.', `
      ${respaldo('splash/Zed_69-fondo.jpg', { blur: 18, brillo: 0.38 })}
      <div data-k="rejilla" style="position: absolute; left: ${RJX}px; top: ${RJ.y}px; width: ${7 * RJ.w + 6 * RJ.sep}px; display: grid; grid-template-columns: repeat(7, ${RJ.w}px); gap: ${RJ.sep}px;">
        ${SKINS.map((n) => `<div data-skin="${n}" style="width: ${RJ.w}px; height: ${RJ.h}px; overflow: hidden; border-radius: 5px; box-shadow: 0 10px 26px rgba(0,0,0,.6);"><img src="assets/carga/Zed_${n}.jpg" alt="Zed, skin ${n}" style="width: 100%; height: 100%; object-fit: cover; display: block;"></div>`).join('')}
      </div>
      ${dato(`14 SKINS <span style="color: ${a(LUZ, 0.45)};">·</span> <span style="color: ${GRIS};">0 EN 2026</span>`, { x: 60, y: 558, w: 900, tam: 76, tracking: 6, alinear: 'center', k: 'cifra', nowrap: true })}`));

// ── 26 · zd-ultima · B ─── pantalla de carga Luna de Sangre ── (crece)
slides.push(lamina('zd-ultima', 'La última que puedes comprar salió en abril de 2024.', L_B(`
        ${respaldo('splash/Zed_58-fondo.jpg', { blur: 16, brillo: 0.42, w: 648 })}
        <div data-k="crece" style="position: absolute; left: ${(648 - 374) / 2}px; top: 0; width: 374px; height: ${PH}px; display: flex; align-items: center; justify-content: center;">
          <div data-elegida style="width: 176px; height: 320px; overflow: hidden; border-radius: 6px; box-shadow: 0 0 60px rgba(0,0,0,.7);">
            <img src="assets/carga/Zed_58.jpg" alt="Zed Luna de Sangre, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
          </div>
        </div>`, `
      ${dato('ÚLTIMA EN<br>LA TIENDA', { x: BX, y: 194, w: BW, tam: 74, lh: 1, tracking: 4, k: 'ultima' })}
      ${dato('ABRIL', { x: BX, y: 372, w: BW, tam: 110, tracking: 8, color: ROJO, k: 'abril' })}
      ${dato('2024', { x: BX, y: 486, w: BW, tam: 130, tracking: 6, k: 'anio' })}`)));

// ── 27 · zd-ryu · D ─── Faker (SKT) contra Ryu (KT) ── (empuje en las mitades + destello en la diagonal)
slides.push(lamina('zd-ryu', 'En 2013, en el quinto mapa de una final de Corea, Faker y Ryu escogieron Zed los dos.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 18, brillo: 0.32 })}
      ${mitad('izq', `
        ${imgMitad('izq', 'splash/Zed_2.jpg', 'Zed SKT T1, splash', '58% 35%', { k: 'a-izq', filtro: 'brightness(.8)' })}
        ${veloAbajo(0.88)}
        ${dato('FAKER', { x: 60, y: 452, w: 420, tam: 130, tracking: 8, color: ORO, k: 'faker' })}
        ${dato('SKT', { x: 64, y: 576, w: 300, tam: 56, tracking: 10, color: ORO, k: 'skt' })}`)}
      ${mitad('der', `
        ${imgMitad('der', 'splash/Zed_0.jpg', 'Zed, splash', '50% 30%', { k: 'a-der', filtro: 'brightness(.8)' })}
        ${veloAbajo(0.88)}
        ${dato('RYU', { x: 600, y: 452, w: 360, tam: 130, tracking: 8, alinear: 'right', k: 'ryu' })}
        ${dato('KT', { x: 660, y: 576, w: 300, tam: 56, tracking: 10, alinear: 'right', k: 'kt' })}`)}
      ${costura(LUZ)}
      <div data-k="destello" style="position: absolute; left: ${540 - 260}px; top: ${330 - 260}px; pointer-events: none;">${kit.destello({ tam: 520, rayos: 18, color: '#FFE3A8', semilla: 'faker-ryu' })}</div>
      ${dato('FINAL 2013 · MAPA 5', { x: 60, y: 190, w: 900, tam: 66, tracking: 8, alinear: 'center', k: 'titulo' })}`));

// ── 28 · zd-qss · E ─── la R de Zed se tacha; el QSS cae ── (revuelto + la curva golpe)
slides.push(lamina('zd-qss', 'Ryu le tiró la ulti y Faker se la quitó con el QSS y le ganó el duelo.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 18, brillo: 0.34 })}
      ${ranura('habilidades/ZedR.png', 'Marca de la Muerte (R)', 190, { x: 170, y: 214, k: 'r', borde: GRIS })}
      <div style="position: absolute; left: 130px; top: 424px; width: 270px; text-align: center; font-size: 96px; line-height: 1; letter-spacing: 4px; color: ${a(LUZ, 0.75)}; text-shadow: 0 4px 18px rgba(0,0,0,.9);"><span data-k="tecla">R</span></div>
      <svg viewBox="0 0 190 190" style="position: absolute; left: 170px; top: 214px; width: 190px; height: 190px; overflow: visible; pointer-events: none; z-index: 3;">
        <path data-k="x1" d="M14 14 L176 176" fill="none" stroke="${LUZ}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/>
        <path data-k="x2" d="M176 14 L14 176" fill="none" stroke="${LUZ}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/>
      </svg>
      ${flecha(420, 309, 140)}
      ${ranura('items/3140.png', 'Fajín de mercurio', 190, { x: 630, y: 214, k: 'qss', borde: ORO, estilo: `box-shadow: 0 0 40px ${a(ORO, 0.55)};` })}
      ${dato('QSS', { x: 590, y: 420, w: 270, tam: 124, tracking: 8, alinear: 'center', color: ORO, k: 'txt-qss' })}`));

// ── 29 · zd-remontada · C ─── gráfica 2: el marcador por escalones ── (dibujo)
const RM = { x0: 115, paso: 170, cero: 425, alto: 82 };
const ry = (v) => RM.cero - v * RM.alto;
const tramos = REMONTADA.map(([, v], i) => {
  const prev = i ? REMONTADA[i - 1][1] : 0, x = RM.x0 + i * RM.paso;
  return `<path d="M${x} ${ry(prev)} V${ry(v)} H${x + RM.paso}" stroke="${i < 2 ? GRIS : ORO}"/>`;
}).join('');
slides.push(lamina('zd-remontada', 'SKT remontó la final de cero dos a tres dos.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 18, brillo: 0.3 })}
      ${dato('FINAL 2013 · SKT CONTRA KT', { x: 60, y: 188, w: 900, tam: 56, tracking: 6, alinear: 'center', color: a(LUZ, 0.85), k: 'titulo' })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <line x1="${RM.x0}" y1="${RM.cero}" x2="${RM.x0 + 5 * RM.paso}" y2="${RM.cero}" stroke="${a(LUZ, 0.18)}" stroke-width="2" stroke-dasharray="8 10"/>
        <g data-k="escalones" fill="none" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">${tramos}</g>
      </svg>
      ${REMONTADA.map(([m, v], i) => `<div data-marcador style="position: absolute; left: ${RM.x0 + i * RM.paso}px; top: ${ry(v) - 84}px; width: ${RM.paso}px; text-align: center; font-size: ${i === 4 ? 84 : 66}px; line-height: 1; letter-spacing: 2px; color: ${i < 2 ? GRIS : ORO}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${m}</div>`).join('')}`));

// ── 30 · zd-galactico · A ─── Exterminador Galáctico, otro recorte ── (iris a mano)
slides.push(lamina('zd-galactico', 'Riot metió esa narración en el juego: Zed Exterminador Galáctico la grita cuando mata a otro Zed.', `
      ${respaldo('splash/Zed_13-fondo.jpg', { blur: 12, brillo: 0.5, pos: '30% 40%' })}
      ${arte('splash/Zed_13.jpg', 'Zed Exterminador Galáctico, splash', { pos: '62% 30%', zoom: 1.4, k: 'arte', filtro: 'brightness(.75)' })}
      ${veloAbajoIzq}
      ${dato('ZED EXTERMINADOR<br><span style="color: #FFD98A;">GALÁCTICO</span>', { x: 60, y: 404, w: 900, tam: 104, lh: 0.98, tracking: 5, k: 'nombre', nowrap: true })}`));

// ── 31 · zd-cierre · A ─── Zed SKT: 14 años, 0 picks ── (palabra + chispas rojas)
slides.push(lamina('zd-cierre', 'El campeón con el que Faker se volvió leyenda cumple catorce años y no apareció ni una vez en este Mundial.', `
      ${respaldo('splash/Zed_2-fondo.jpg', { blur: 12, brillo: 0.5, pos: '58% 35%' })}
      ${arte('splash/Zed_2.jpg', 'Zed SKT T1, splash', { pos: '62% 30%', zoom: 1.15, filtro: 'brightness(.7)' })}
      ${veloIzq(0.88)}
      <div data-k="chispas" style="position: absolute; left: 0; top: 190px; width: 700px; height: 260px;"></div>
      ${dato('<span data-k="anios" style="display: inline-block;">14 AÑOS</span>', { x: 56, y: 196, w: 900, tam: 210, tracking: 6, color: ROJO, nowrap: true })}
      ${dato(`<span style="color: ${GRIS};">0</span> PICKS EN EL MUNDIAL`, { x: 62, y: 430, w: 900, tam: 84, tracking: 5, k: 'picks', nowrap: true })}`));

// ── 32 · zd-gg · A ─── Flor Espiritual Prestigioso ── (empuje)
slides.push(lamina('zd-gg', 'Solo queda decir GG easy. Tírenme un follow.', `
      ${respaldo('splash/Zed_69-fondo.jpg', { blur: 12, brillo: 0.5 })}
      ${arte('splash/Zed_69.jpg', 'Zed Flor Espiritual Prestigioso, splash', { pos: '50% 30%', k: 'arte', filtro: 'brightness(.82)' })}
      ${veloAbajoIzq}
      ${dato(`<span style="color: ${ROJO};">#</span>CUMPLELOLERO`, { x: 60, y: 486, w: 900, tam: 132, tracking: 6, k: 'tag', nowrap: true })}`));

// ── reposo · A ─── Zed base desenfocado al 45 % ──
slides.push(lamina('zd-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${respaldo('splash/Zed_0-fondo.jpg', { blur: 16, brillo: 0.45, pos: '55% 35%' })}
      ${dato(`ZED · <span style="color: ${ROJO};">14 AÑOS</span>`, { x: 60, y: 190, w: 500, tam: 48, tracking: 6, color: a(LUZ, 0.85) })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  // «Cae con la curva golpe» (de jhin-build): la curva del kit, no la receta golpe, que es para texto.
  var cae = function (tl, el, en) { if (el) tl.from(el, { y: -70, scale: 1.25, opacity: 0, duration: 0.5, ease: 'golpe' }, en); };
  var traza = function (tl, el, en, d) { if (el) tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 0.4, ease: 'entrada', immediateRender: true }, en); };
  // La «cortina» del paquete: cada mitad entra desde su lado (a mano, como en jhin-letalidad).
  var cortina = function (tl, s, en) {
    tl.from(k(s, 'izq'), { x: -580, duration: 0.8, ease: 'power3.out' }, en);
    tl.from(k(s, 'der'), { x: 580, duration: 0.8, ease: 'power3.out' }, en + 0.2);
  };
  // El «iris» del paquete, a mano sobre el arte (el del kit recorta la sección entera).
  var iris = function (tl, el, en, at) { tl.fromTo(el, { clipPath: 'circle(0% at ' + at + ')' }, { clipPath: 'circle(120% at ' + at + ')', duration: 1.1, ease: 'power3.inOut', immediateRender: true }, en); };
  var C = {
    'zd-portada': function (tl, s) {
      efecto('parallax', tl, k(s, 'capas'), { dur: 2.2, distancia: 50 });
      efecto('tragamonedas', tl, k(s, 'catorce'), { en: 0.2, dur: 1.6 });
      aparece(tl, k(s, 'anios'), 1.1, 0.5);
    },
    'zd-martes13': function (tl, s) {
      cortina(tl, s, 0.05);
      q(s, '[data-trece]').forEach(function (el, i) { efecto('brillo', tl, el, { en: 1.15 + i * 0.25, dur: 1.0, color: '#FFE1DC' }); });
    },
    'zd-final': function (tl, s) {
      efecto('empuje', tl, k(s, 'copa'), { desde: 1.12, dur: 2.5 });
      aparece(tl, k(s, 'final'), 0.1, 0.4); aparece(tl, k(s, 'fecha'), 0.4, 0.4);
      q(s, '[data-logo]').forEach(function (el, i) { cae(tl, el, 0.9 + i * 0.35); });
    },
    'zd-asco': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.3, origen: '40% 40%', dur: 2.7 });
    },
    'zd-combo': function (tl, s) {
      // data-paso: W, R, E, Q e ignite, en el orden de la voz.
      [0, 1, 2, 3, 4].forEach(function (i) { cae(tl, k(s, 'h' + i), 0.1 + i * 0.3); });
      tl.from(q(s, '[data-etq]'), { opacity: 0, y: 12, duration: 0.3, stagger: 0.3, ease: 'entrada' }, 0.3);
      efecto('rayo', tl, k(s, 'rayo'), { en: 1.75, dur: 0.6, escalon: 0.08 });
    },
    'zd-zhonya': function (tl, s) {
      aparece(tl, k(s, 'antes'), 0, 0.35); aparece(tl, k(s, 'ahora'), 0.15, 0.35);
      efecto('revuelto', tl, k(s, 'txt-crono'), { en: 0.1, dur: 0.8, glifos: 'CRONÓMETRAQUIS' });
      traza(tl, k(s, 'tachon'), 0.95, 0.4);
      tl.to(k(s, 'crono-linea'), { color: '${GRIS}', duration: 0.35 }, 1.0);
      tl.to(k(s, 'cronometro'), { filter: 'grayscale(1) brightness(.5)', duration: 0.35 }, 1.0);
      aparece(tl, k(s, 'quitado'), 1.3, 0.4);
      tl.from(k(s, 'zhonya'), { scale: 1.2, opacity: 0, duration: 0.45, ease: 'asentar' }, 1.55);
    },
    'zd-faker': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'panel'), { forma: 'persiana', direccion: 'izquierda', dur: 0.6, en: 0 });
      ['l1', 'l2', 'l3', 'l4'].forEach(function (n, i) { efecto('maquina', tl, k(s, n), { en: 0.45 + i * 0.4, ritmo: i > 1 ? 0.018 : 0.05, cursor: 'no' }); });
    },
    'zd-cero': function (tl, s) {
      efecto('contador', tl, k(s, 'c1'), { en: 0.1, dur: 1.1, desde: 9, cuenta: 0, ease: 'power1.out' });
      efecto('contador', tl, k(s, 'c2'), { en: 0.3, dur: 1.1, desde: 9, cuenta: 0, ease: 'power1.out' });
      efecto('sello', tl, k(s, 'sello'), { en: 1.5, fuerza: 10 });
    },
    'zd-sinfaker': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-izq'), { n: 5, en: 0.05, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-der'), { n: 5, en: 0.3, dur: 0.8 });
      aparece(tl, k(s, 't1'), 0.6, 0.4);
      traza(tl, k(s, 'tachon'), 1.05, 0.4);
      cae(tl, k(s, 'gen'), 0.9); cae(tl, k(s, 'blg'), 1.15);
      aparece(tl, k(s, 'frase'), 1.6, 0.45);
    },
    'zd-otp': function (tl, s) {
      tl.fromTo(k(s, 'emblema'), { opacity: 0, scale: 0.85 }, { opacity: 0.4, scale: 1, duration: 1, ease: 'entrada', immediateRender: true }, 0);
      efecto('letrero', tl, k(s, 'letrero').firstElementChild, { en: 0.15 });
      tl.fromTo(k(s, 'puntos'), { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 0.75);
      efecto('contador', tl, k(s, 'puntos'), { en: 0.8, dur: 1.3, cuenta: ${OTP.puntos}, separador: '.' });
      aparece(tl, k(s, 'region'), 0.6, 0.4);
      aparece(tl, k(s, 'rango'), 1.55, 0.4);
    },
    'zd-partidas': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      // Barras desde 0 con la curva entrada (regla de las gráficas).
      tl.from(q(s, '[data-barra]'), { scaleX: 0, duration: 1.1, ease: 'entrada', stagger: 0.25 }, 0.3);
      q(s, '[data-valor]').forEach(function (el, i) { efecto('contador', tl, el, { en: 0.3 + i * 0.25, dur: 1.1, cuenta: +el.getAttribute('data-cuenta'), separador: '.' }); });
      q(s, '[data-fuera]').forEach(function (el) { tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: true }, 0.55); });
    },
    'zd-yasuo': function (tl, s) {
      iris(tl, k(s, 'escena'), 0.05, '50% 45%');
      efecto('lineas', tl, k(s, 'lineas'), { en: 0.9, dur: 0.8, escalon: 0.3 });
    },
    'zd-lore': function (tl, s) {
      efecto('destello', tl, k(s, 'destello'), { en: 0.1, dur: 1.6, semilla: 'lore-zed' });
      tl.from(k(s, 'carta'), { opacity: 0, scale: 0.92, duration: 0.6, ease: 'asentar' }, 0.2);
      efecto('palabra', tl, k(s, 'lore'), { en: 0.75, fogonazo: 'no' });
    },
    'zd-kinkou': function (tl, s) {
      efecto('crece', tl, k(s, 'crece'), { en: 0.15, dur: 1.0 });
      aparece(tl, k(s, 'orden'), 0.7); aparece(tl, k(s, 'maestro'), 1.2); aparece(tl, k(s, 'kusho'), 1.4);
    },
    'zd-shen': function (tl, s) {
      cortina(tl, s, 0.05);
      aparece(tl, k(s, 'zed'), 0.75, 0.4); aparece(tl, k(s, 'shen'), 0.95, 0.4);
    },
    'zd-jhin': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.22, origen: '55% 30%', dur: 2.5 });
      aparece(tl, k(s, 'texto'), 0.6, 0.6);
    },
    'zd-rencor': function (tl, s) {
      efecto('palabra', tl, k(s, 'frase'), { en: 0.5 });
    },
    'zd-caja': function (tl, s) {
      tl.from(k(s, 'carta'), { opacity: 0, scale: 0.9, duration: 0.6, ease: 'asentar' }, 0.05);
      // El «brillo» del paquete sobre la carta: un barrido de luz a mano (el del kit es para texto).
      tl.fromTo(k(s, 'barrido'), { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', duration: 1.2, ease: 'power2.inOut', immediateRender: true }, 0.6);
      aparece(tl, k(s, 'caja'), 0.4); aparece(tl, k(s, 'prohibida'), 0.75);
    },
    'zd-sangre': function (tl, s) {
      efecto('letras', tl, k(s, 'l1'), { en: 0.2, dur: 0.6 });
      efecto('letras', tl, k(s, 'l2'), { en: 0.7, dur: 0.6 });
    },
    'zd-comic': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'carta'), { forma: 'diagonal', dur: 0.9, en: 0.05 });
      aparece(tl, k(s, 'comic'), 0.5); aparece(tl, k(s, 'titulo'), 0.8); aparece(tl, k(s, 'anios'), 1.1);
    },
    'zd-dosveces': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0.05, 0.4);
      efecto('sello', tl, k(s, 'dos'), { en: 0.6, fuerza: 12 });
      aparece(tl, k(s, 'veces'), 1.2, 0.4);
    },
    'zd-beso': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-izq'), { n: 6, en: 0.05, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-der'), { n: 6, en: 0.3, dur: 0.8 });
      aparece(tl, k(s, 'frase'), 1.1, 0.45);
    },
    'zd-huerfano': function (tl, s) {
      // El arte va con zoom 1,5 en CSS: el empuje parte de 1 y se cierra hacia la cara de Shen.
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.0, origen: '52% 28%', dur: 2.6 });
    },
    'zd-sombra': function (tl, s) {
      q(s, '[data-palabra]').forEach(function (el, i) { efecto('maquina', tl, el, { en: 0.2 + i * 0.55, ritmo: 0.06, cursor: 'no' }); });
    },
    'zd-skins': function (tl, s) {
      efecto('bento', tl, k(s, 'rejilla'), { desde: 'start', escalon: 0.07, dur: 0.5 });
      aparece(tl, k(s, 'cifra'), 1.35, 0.45);
    },
    'zd-ultima': function (tl, s) {
      efecto('crece', tl, k(s, 'crece'), { en: 0.15, dur: 1.0 });
      aparece(tl, k(s, 'ultima'), 0.6); aparece(tl, k(s, 'abril'), 1.0); aparece(tl, k(s, 'anio'), 1.25);
    },
    'zd-ryu': function (tl, s) {
      efecto('empuje', tl, k(s, 'a-izq'), { desde: 1.2, origen: '58% 35%', dur: 2.5 });
      efecto('empuje', tl, k(s, 'a-der'), { desde: 1.2, origen: '50% 30%', dur: 2.5 });
      aparece(tl, k(s, 'titulo'), 0.1, 0.4);
      aparece(tl, k(s, 'faker'), 0.4); aparece(tl, k(s, 'skt'), 0.55);
      aparece(tl, k(s, 'ryu'), 0.7); aparece(tl, k(s, 'kt'), 0.85);
      efecto('destello', tl, k(s, 'destello'), { en: 1.0, dur: 1.4, semilla: 'faker-ryu' });
    },
    'zd-qss': function (tl, s) {
      efecto('revuelto', tl, k(s, 'tecla'), { en: 0.05, dur: 0.6, glifos: 'QWER' });
      traza(tl, k(s, 'x1'), 0.7, 0.25); traza(tl, k(s, 'x2'), 0.9, 0.25);
      tl.to(k(s, 'r'), { filter: 'grayscale(1) brightness(.55)', duration: 0.3 }, 0.8);
      cae(tl, k(s, 'qss'), 1.25);
      aparece(tl, k(s, 'txt-qss'), 1.55, 0.4);
    },
    'zd-remontada': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      efecto('dibujo', tl, k(s, 'escalones'), { en: 0.25, dur: 0.38, escalon: 0.38 });
      q(s, '[data-marcador]').forEach(function (el, i) { aparece(tl, el, 0.45 + i * 0.38, 0.3); });
    },
    'zd-galactico': function (tl, s) {
      iris(tl, k(s, 'arte'), 0.05, '62% 35%');
      aparece(tl, k(s, 'nombre'), 0.8, 0.5);
    },
    'zd-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'anios'), { en: 0.3 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 0.35, dur: 1.4, color: '${ROJO},#FF8A7A,#FFFFFF', origen: '30 45', semilla: 'gg-zed' });
      aparece(tl, k(s, 'picks'), 1.0, 0.45);
    },
    'zd-gg': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.2, origen: '50% 30%', dur: 2.5 });
      aparece(tl, k(s, 'tag'), 0.6, 0.5);
    },
    'zd-reposo': function () {},
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
<title>Zed cumple 14 años</title>
${kit.og({ titulo: 'Zed cumple 14 años', descripcion: 'Cumplelolero: Zed cumple 14 años el viernes 13, un día antes de la final del Mundial. Su combo, Faker y SKT, el OTP número uno, su lore turbio y sus 14 skins, en banda superior y con solo arte oficial.', carpeta: 'creator/zed' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(11,10,16,0.85); color: ${LUZ}; cursor: pointer;
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
