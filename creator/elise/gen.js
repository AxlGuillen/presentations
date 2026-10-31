// Generador de index.html — Elise cumple 14 años (láminas para el montaje automático)
// Ejecutar: node creator/elise/gen.js   ·   clips: node tools/laminas.mjs elise
//
// Serie «Cumplelolero» #27, mismo formato que lux y graves: cada lámina es un
// miniclip para el **panel de 1080×1370** (`crop=1080:1370:0:275`) que va abajo
// del gameplay del prereel. Todo lo importante vive dentro de `PANEL`.
//
// Criterio de jinx: el único texto es el que es el dato — 14, ELISE, 2015,
// ELISE JUNGLE · #KR1 · 10.067.782, 1.639, el 9 de skins con 2023 y GG EZ.
// Sin dinero.
//
// Sigue el guion de Axl del 26/10/2026 (versión «comas»): la intro cita a T1 y
// a Bengi antes del OTP, así que la skin SKT T1 va ahí (lámina 2) y no en el
// bloque de skins; la lámina del 93 % salió (Axl pidió quitarlo) y entró la
// pared de 1.639 partidas; entró `elise-rappel` por lo intargeteable.
//
// ⚠️ **Ningún clip arranca en negro**: copia desenfocada, seda y motas se ven
// desde el cuadro 0; lo que entra es el primer plano.
// ⚠️ **No hay arte oficial** de la cena, de lo intargeteable ni del tamborileo:
// la cena es la carta de Elise en duotono con un tajo; lo intargeteable es una
// araña dibujada a líneas con una mira que la atraviesa; el tamborileo es una
// mano de líneas que se vuelve araña y camina. Todo dibujado, nada inventado
// como «arte oficial».
// ⚠️ **La viuda negra es de la Elise base, no de la skin SKT T1** (wiki,
// Elise/Cosmetics): la lámina de la viuda lleva el splash base.
// ⚠️ Los emblemas de CommunityDragon salen a 300–500 px de contenido: el de
// Maestro se usa a ≤ 400 px, el de Diamante a ≤ 320.
// ⚠️ `01SI053T1` es redondo (1024×1024): se recorta con border-radius 50%.
// ⚠️ La carta de LeBlanc (`04NX004`) ya salió en swain: aquí va con otro
// recorte y la rosa negra que abre como máscara.
//
// Datos: el paquete de Axl del 26/10/2026 (ChampionMastery.GG, op.gg, wiki,
// bio oficial es-MX, Data Dragon y Legends of Runeterra).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Los fondos (copia desenfocada, lavados, seda) llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta: la cueva de Elise ────────────────────────────────────────────
const BG = '#0B0709';        // negro de telaraña
const CARMESI = '#C8243A';   // carmesí de araña — acento
const ROSA = '#F0606F';      // carmesí claro para los brillos
const HUESO = '#E8DCCB';     // hueso pálido — cifras y trazos
const MUTED = '#8E8478';
const VERDE = '#4FE3C1';     // verde espectral — solo las Islas y lo intargeteable
const T1 = '#E4002B';        // rojo de T1 — solo la lámina 2
const CUERPO = '#140709';    // relleno de las siluetas

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
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

// Lavado carmesí y viñeta: nunca un fondo plano.
const ambiente = (x = 50, y = 30, color = CARMESI) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(75% 45% at ${x}% ${y}%, ${a(color, 0.22)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(5,3,4,0.72) 100%);"></div>`;

// Seda: líneas de flujo en hueso y carmesí, desenfocadas, que derivan.
const seda = (semilla, opacidad = 0.4) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-humo style="position: absolute; inset: -60px; filter: blur(6px); mix-blend-mode: screen; opacity: ${opacidad};">
        ${kit.patron('flujo', { ancho: 1200, alto: 2040, paleta: [HUESO, CARMESI, '#5A6A72'], semilla, lineas: 56, pasos: 80, paso: 10, grosor: 5, escala: 0.0011, opacidad: 0.5, estilo: 'width:100%;height:100%' })}
      </div>
    </div>`;

// Motas que suben (esporas de la cueva): hueso, carmesí y un poco de verde.
const motas = (semilla, n = 22) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 1020), y = Math.round(PANEL.top + 60 + r() * (PANEL.h - 120));
    const t = (3 + r() * 6).toFixed(1), q = r(), col = q < 0.45 ? HUESO : q < 0.85 ? CARMESI : VERDE, op = (0.3 + r() * 0.5).toFixed(2);
    h += `<span data-brasa style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; border-radius: 50%; background: ${col}; opacity: ${op}; box-shadow: 0 0 ${t * 3}px ${col}; pointer-events: none;"></span>`;
  }
  return `<div style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

// Arte apaisado de borde a borde dentro del panel (cover, con el foco en `pos`).
const arte = (src, alt, { y, alto, pos = 'center', extra = '', attrs = '', marco = true, estilo = '' } = {}) => `
      <div data-arte ${attrs} style="position: absolute; left: 0; top: ${y}px; width: 1080px; height: ${alto}px; overflow: hidden; ${marco ? `box-shadow: 0 40px 100px rgba(3,2,3,0.8), 0 0 0 1px ${a(HUESO, 0.16)};` : ''} ${estilo}">
        <img data-img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">${extra}
      </div>`;

const lamina = (id, notas, cuerpo, extraSeccion = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION} ${extraSeccion}">${cuerpo}
  </section>`;

// Telaraña: radios desde (cx, cy) y anillos que se cuelgan entre ellos. Cada
// trazo lleva data-hilo para dibujarlo con DrawSVG.
function tela({ cx, cy, desde, hasta, rmax, radios = 9, anillos = 8, semilla = 1, grosor = 2.4, color = HUESO, op = 0.6 }) {
  const r = prng(semilla), rad = (d) => d * Math.PI / 180;
  const pol = (R, d) => [cx + R * Math.cos(rad(d)), cy + R * Math.sin(rad(d))];
  const angs = Array.from({ length: radios }, (_, i) => desde + (hasta - desde) * i / (radios - 1));
  const f = (n) => n.toFixed(1);
  let h = '';
  angs.forEach((d) => { const [x, y] = pol(rmax * (0.94 + r() * 0.08), d); h += `<path data-hilo d="M${f(cx)} ${f(cy)} L${f(x)} ${f(y)}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${grosor}" stroke-linecap="round"/>`; });
  for (let k = 1; k <= anillos; k++) {
    const R = rmax * Math.pow(k / anillos, 1.15) * 0.94;
    let d = '';
    for (let i = 0; i < radios; i++) {
      const [x, y] = pol(R * (0.96 + r() * 0.08), angs[i]);
      if (i === 0) d += `M${f(x)} ${f(y)}`;
      else { const [qx, qy] = pol(R * 0.87, (angs[i - 1] + angs[i]) / 2); d += ` Q${f(qx)} ${f(qy)} ${f(x)} ${f(y)}`; }
    }
    h += `<path data-hilo d="${d}" fill="none" stroke="${color}" stroke-opacity="${op * 0.85}" stroke-width="${(grosor * 0.8).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return h;
}
// Telaraña completa alrededor de un punto (para la lámina del círculo).
function telaCirculo({ cx, cy, r0, r1, radios = 14, anillos = 3, semilla = 7, grosor = 2.4, color = HUESO, op = 0.6 }) {
  const r = prng(semilla), rad = (d) => d * Math.PI / 180, f = (n) => n.toFixed(1);
  const pol = (R, d) => [cx + R * Math.cos(rad(d)), cy + R * Math.sin(rad(d))];
  let h = '';
  for (let i = 0; i < radios; i++) { const d = i * 360 / radios + 8; const [x0, y0] = pol(r0, d), [x1, y1] = pol(r1 * (0.97 + r() * 0.06), d); h += `<path data-hilo d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${grosor}" stroke-linecap="round"/>`; }
  for (let k = 1; k <= anillos; k++) {
    const R = r0 + (r1 - r0) * (k / anillos); let d = '';
    for (let i = 0; i <= radios; i++) {
      const ang = i * 360 / radios + 8, [x, y] = pol(R * (0.97 + r() * 0.06), ang);
      if (i === 0) d += `M${f(x)} ${f(y)}`;
      else { const [qx, qy] = pol(R * 0.9, ang - 180 / radios); d += ` Q${f(qx)} ${f(qy)} ${f(x)} ${f(y)}`; }
    }
    h += `<path data-hilo d="${d}" fill="none" stroke="${color}" stroke-opacity="${op * 0.85}" stroke-width="${(grosor * 0.8).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return h;
}
const telaSvg = (contenido, { fondo = true, extra = '' } = {}) => `
      <svg ${fondo ? 'data-fondo' : ''} data-tela viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; ${extra}">${contenido}</svg>`;

// La araña, dibujada a líneas: cuerpo con el reloj de arena de la viuda negra y
// cuatro patas por lado. `pose` B mueve las patas alternas para el paso.
const PATAS = [
  [[30, -78], [125, -195], [212, -128]],
  [[36, -62], [172, -132], [252, -22]],
  [[38, -44], [178, -34], [238, 94]],
  [[34, -26], [142, 52], [182, 176]],
];
function arana({ trazo = HUESO, sw = 7, relleno = CUERPO, rojo = CARMESI, pose = 'A', cuerpo = true, patas = true } = {}) {
  const lado = (s) => PATAS.map(([o, k, f], i) => {
    const d = pose === 'B' ? (((i + (s > 0 ? 0 : 1)) % 2) ? 1 : -1) : 0;
    const fx = f[0] + d * 16, fy = f[1] - d * 14, kx = k[0] + d * 8, ky = k[1] - d * 8;
    return `<g data-pata><path d="M${s * o[0]} ${o[1]} L${s * kx} ${ky} L${s * fx} ${fy}" fill="none" stroke="${trazo}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${s * kx}" cy="${ky}" r="${(sw * 0.95).toFixed(1)}" fill="${relleno}" stroke="${trazo}" stroke-width="3"/></g>`;
  }).join('');
  const cuerpoSvg = `
      <ellipse cx="0" cy="72" rx="78" ry="104" fill="${relleno}" stroke="${trazo}" stroke-width="${sw}"/>
      <path d="M-27 34 L27 34 L0 74 Z M-27 118 L27 118 L0 74 Z" fill="${rojo}"/>
      <ellipse cx="0" cy="-52" rx="46" ry="40" fill="${relleno}" stroke="${trazo}" stroke-width="${sw}"/>
      <circle cx="-15" cy="-66" r="6" fill="${rojo}"/><circle cx="15" cy="-66" r="6" fill="${rojo}"/>
      <circle cx="-28" cy="-54" r="4" fill="${rojo}"/><circle cx="28" cy="-54" r="4" fill="${rojo}"/>
      <path d="M-10 -22 L-14 -4 M10 -22 L14 -4" stroke="${trazo}" stroke-width="4" stroke-linecap="round"/>`;
  return `${patas ? lado(1) + lado(-1) : ''}${cuerpo ? cuerpoSvg : ''}`;
}

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

// ── elise-portada ────────────────────────────────────────────────────────
slides.push(lamina('elise-portada', 'Elise cumple catorce años desde que entró al juego de mierda.', `
    ${borroso('Elise_0-fondo.jpg', 0.5)}
    ${ambiente(50, 35)}
    ${seda('portada', 0.42)}
    ${motas(26)}
    ${panel(`
      <div data-catorce class="carmesi" style="position: absolute; left: 0; right: 0; top: -10px; text-align: center; font-size: 920px; line-height: 1; opacity: 0.95;">14</div>
      ${telaSvg(tela({ cx: 1080, cy: 0, desde: 95, hasta: 175, rmax: 1250, radios: 9, anillos: 8, semilla: 3 }) + tela({ cx: 0, cy: 1370, desde: -85, hasta: -5, rmax: 900, radios: 7, anillos: 6, semilla: 5, op: 0.4 }), { fondo: false })}
      <div data-pulso style="position: absolute; left: ${540 - 520}px; top: ${780 - 520}px; width: 1040px; height: 1040px; border-radius: 50%; background: radial-gradient(closest-side, #FFE3E0, ${a(ROSA, 0.9)} 25%, ${a(CARMESI, 0.6)} 50%, ${a(CARMESI, 0)} 100%); mix-blend-mode: screen; opacity: 0;"></div>
      <div data-carta style="position: absolute; left: ${540 - 190}px; top: 450px; width: 380px; height: 691px; border-radius: 22px; overflow: hidden; border: 3px solid ${HUESO}; box-shadow: 0 0 0 10px ${a(BG, 0.55)}, 0 0 90px ${a(CARMESI, 0.5)}, 0 40px 90px rgba(3,2,3,0.8);">
        <img data-img src="assets/skins/Elise_0.jpg" alt="Elise, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
      <div data-nombre style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font-size: 210px; line-height: 0.9; letter-spacing: 14px; padding-left: 14px;">${'ELISE'.split('').map(c => `<span data-letra class="carmesi" style="display: inline-block;">${c}</span>`).join('')}</div>`)}`));

// ── elise-skin-t1 ────────────────────────────────────────────────────────
// La skin del mejor equipo del mundo, la que escogió Bengi. Foco en Elise.
slides.push(lamina('elise-skin-t1', 'Y mañana juega T1, que recordemos que esta arañita tiene skin del mejor equipo del mundo, que la escogió Bengi.', `
    ${borroso('Elise_4-fondo.jpg', 0.5)}
    ${ambiente(50, 25, '#2A8FFF')}
    ${motas(127, 16)}
    ${panel(`
      ${arte('Elise_4.jpg', 'Elise SKT T1, splash del equipo de 2015', { y: 40, alto: 900, pos: '85% 40%' })}
      <div data-anio class="hueso" style="position: absolute; left: 50px; top: 960px; font-size: 360px; line-height: 0.95; letter-spacing: 2px;">2015</div>
      <div data-t1 style="position: absolute; left: 600px; top: 1010px; width: 420px; height: 171px; filter: drop-shadow(0 0 34px ${a(T1, 0.55)}) drop-shadow(0 18px 30px rgba(0,0,0,0.6));">
        <img src="assets/t1.png" alt="Logo de T1" style="width: 100%; height: 100%; object-fit: contain; display: block;">
      </div>`)}`));

// ── elise-rappel ─────────────────────────────────────────────────────────
// Intargeteable: una araña dibujada cuelga de su hilo, la mira se le clava y la
// atraviesa porque ella se vuelve espectro.
const RAP = { x: 540, y: 800, esc: 1.7 };
const mira = `
        <g data-mira>
          <circle cx="${RAP.x}" cy="${RAP.y}" r="330" fill="none" stroke="${CARMESI}" stroke-width="5" stroke-dasharray="18 14"/>
          <circle cx="${RAP.x}" cy="${RAP.y}" r="236" fill="none" stroke="${ROSA}" stroke-width="4"/>
          <path d="M${RAP.x} ${RAP.y - 380} V${RAP.y - 200} M${RAP.x} ${RAP.y + 200} V${RAP.y + 380} M${RAP.x - 380} ${RAP.y} H${RAP.x - 200} M${RAP.x + 200} ${RAP.y} H${RAP.x + 380}" stroke="${CARMESI}" stroke-width="7" stroke-linecap="round"/>
          <path d="M${RAP.x - 250} ${RAP.y - 210} V${RAP.y - 250} H${RAP.x - 210} M${RAP.x + 250} ${RAP.y - 210} V${RAP.y - 250} H${RAP.x + 210} M${RAP.x - 250} ${RAP.y + 210} V${RAP.y + 250} H${RAP.x - 210} M${RAP.x + 250} ${RAP.y + 210} V${RAP.y + 250} H${RAP.x + 210}" fill="none" stroke="${ROSA}" stroke-width="6" stroke-linecap="round"/>
          <circle cx="${RAP.x}" cy="${RAP.y}" r="8" fill="${ROSA}"/>
        </g>`;
slides.push(lamina('elise-rappel', 'Y la mecánica de volverse intargeteable para hacer diveos me da un perro asco porque como soy main adecarry siempre me hacen esos abusos.', `
    ${ambiente(50, 55, VERDE)}
    ${seda('rappel', 0.3)}
    ${motas(228, 14)}
    ${panel(`
      ${telaSvg(tela({ cx: 0, cy: 0, desde: 5, hasta: 85, rmax: 760, radios: 7, anillos: 6, semilla: 11, op: 0.28 }), { fondo: true })}
      <div data-halo-espectro data-fondo style="position: absolute; left: ${RAP.x - 420}px; top: ${RAP.y - 420}px; width: 840px; height: 840px; border-radius: 50%; background: radial-gradient(closest-side, ${a(VERDE, 0.3)}, ${a(VERDE, 0)}); opacity: 0;"></div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <g data-baja>
          <line data-hilo-colgar x1="${RAP.x}" y1="-1700" x2="${RAP.x}" y2="${RAP.y - 176 * RAP.esc}" stroke="${HUESO}" stroke-opacity="0.8" stroke-width="4"/>
          <g data-solida transform="translate(${RAP.x} ${RAP.y}) rotate(180) scale(${RAP.esc})">${arana({ sw: 6 })}</g>
          <g data-espectro opacity="0" transform="translate(${RAP.x} ${RAP.y}) rotate(180) scale(${RAP.esc})" style="filter: drop-shadow(0 0 22px ${VERDE});">${arana({ trazo: VERDE, relleno: a(VERDE, 0.08), rojo: a(VERDE, 0.7), sw: 6 })}</g>
        </g>
        <circle data-ping cx="${RAP.x}" cy="${RAP.y}" r="120" fill="none" stroke="${VERDE}" stroke-width="5" opacity="0"/>
        ${mira}
      </svg>`)}`));

// ── elise-otp ────────────────────────────────────────────────────────────
slides.push(lamina('elise-otp', 'Pero sin tanto detalle, que no es cumpleaños el one trick pony con más puntos de esta chavalona, se llama Elise jungle con el hashtag de ka erre uno, que significa que es el ranking número uno en Corea con este campeón, y eso es farmear aura antes de entrar a partida, tiene más de diez millones de puntos y está en Diamante dos, pero ha llegado a Maestro.', `
    ${borroso('Elise_0-fondo.jpg', 0.34)}
    ${ambiente(50, 28)}
    ${seda('otp', 0.32)}
    ${motas(329, 16)}
    ${panel(`
      ${arte('Elise_0.jpg', 'Elise, splash', { y: 30, alto: 520, pos: '78% 28%' })}
      <div data-pastilla style="position: absolute; left: 40px; top: 505px; width: 1000px; height: 150px; border-radius: 75px; box-sizing: border-box; background: ${a(BG, 0.92)}; border: 3px solid ${CARMESI}; box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 50px ${a(CARMESI, 0.35)}; display: flex; align-items: center; justify-content: space-between; padding: 0 56px 0 64px;">
        <span data-nombre-otp style="font-size: 120px; line-height: 1; letter-spacing: 4px; color: ${HUESO};">ELISE JUNGLE</span>
        <span data-kr class="carmesi" style="font-size: 112px; line-height: 1; letter-spacing: 2px;">#KR1</span>
      </div>
      <div data-puntos class="carmesi" style="position: absolute; left: 0; right: 0; top: 680px; text-align: center; font-size: 244px; line-height: 1;">10.067.782</div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <path data-flecha d="M410 1150 C470 1050 520 1050 586 1096" fill="none" stroke="${CARMESI}" stroke-width="9" stroke-linecap="round" style="filter: drop-shadow(0 0 12px ${a(CARMESI, 0.7)});"/>
        <path data-punta d="M560 1058 L594 1100 L546 1112" fill="none" stroke="${CARMESI}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 12px ${a(CARMESI, 0.7)});"/>
      </svg>
      <img data-diamante src="assets/emblemas/diamond.png" alt="Emblema de Diamante" style="position: absolute; left: 90px; top: 1060px; width: 300px; height: auto; filter: drop-shadow(0 0 28px ${a('#5AA7FF', 0.5)}) drop-shadow(0 16px 26px rgba(0,0,0,0.6));">
      <div data-halo style="position: absolute; left: 570px; top: 940px; width: 460px; height: 460px; border-radius: 50%; background: radial-gradient(closest-side, ${a('#B05CFF', 0.5)}, ${a('#B05CFF', 0)});"></div>
      <img data-continua="maestro" data-emblema src="assets/emblemas/master.png" alt="Emblema de Maestro" style="position: absolute; left: 620px; top: 1010px; width: 360px; height: auto; filter: drop-shadow(0 0 30px ${a('#B05CFF', 0.65)}) drop-shadow(0 18px 30px rgba(0,0,0,0.6));">`)}`));

// ── elise-platino ────────────────────────────────────────────────────────
// Cuatro temporadas planas en Platino 4, la subida a Diamante, el pico en
// Maestro y la caída a Diamante 2. La línea va en dos tramos: el plano, lento,
// y la subida, rápida.
const LIGAS = [
  ['platinum', 0.5, 4.5, '#3FC1B0', 88],
  ['diamond', 4.5, 8.5, '#5AA7FF', 96],
  ['master', 8.5, 10.4, '#B05CFF', 110],
];
const HIST = [['2020', 1], ['2021', 1], ['2022', 1], ['2023', 1], ['2023', 5], ['2024', 6], ['2024', 5], ['2024', 6], ['2025', 5], ['2026', 9.4], ['2026', 7]];
const PICO = 9, PLANO = 3; // índice del pico (Maestro) y del último punto plano
const GW = 960, GH = 1140, ML = 150, MR = 40, MT = 40, MB = 80, VMIN = 0.2, VMAX = 10.4;
const GL = 60, GT = 150; // posición del SVG dentro del panel
const gx = (i) => ML + 24 + i * ((GW - ML - MR - 48) / (HIST.length - 1));
const gy = (v) => MT + ((VMAX - v) / (VMAX - VMIN)) * (GH - MT - MB);
const pts = HIST.map(([, v], i) => [gx(i), gy(v)]);
const lineaPlana = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} L${pts[PLANO][0].toFixed(1)} ${pts[PLANO][1].toFixed(1)}`;
const lineaSube = monotona(pts.slice(PLANO));
const bandas = LIGAS.map(([img, lo, hi, col], k) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN));
  return `<g data-banda>
        <rect x="${ML}" y="${y1.toFixed(1)}" width="${GW - ML - MR + 24}" height="${(y2 - y1).toFixed(1)}" rx="16" fill="${col}" fill-opacity="${0.07 + k * 0.03}"/>
        <line x1="${ML}" x2="${GW - MR + 24}" y1="${y1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${col}" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="4 8"/>
      </g>`;
}).join('');
const ejes = LIGAS.map(([img, lo, hi, col, w]) => {
  const y1 = gy(Math.min(hi, VMAX)), y2 = gy(Math.max(lo, VMIN)), yc = (y1 + y2) / 2;
  const h = img === 'master' ? w * 0.74 : img === 'diamond' ? w * 0.6 : w * 0.86;
  const cont = img === 'master' ? 'data-continua="maestro" ' : '';
  return `<img ${cont}data-emblema-eje src="assets/emblemas/${img}.png" alt="Emblema de ${img}" style="position: absolute; left: ${GL + ML - w - 12}px; top: ${(GT + yc - h / 2).toFixed(1)}px; width: ${w}px; height: auto; filter: drop-shadow(0 0 18px ${a(col, 0.55)});">`;
}).join('\n      ');
const anios = [...new Set(HIST.map(h => h[0]))].map(y => {
  const idx = HIST.map((h, i) => (h[0] === y ? i : -1)).filter(i => i >= 0);
  const x = idx.reduce((s, i) => s + gx(i), 0) / idx.length;
  return `<text data-anio x="${x.toFixed(1)}" y="${GH - 28}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="22" font-weight="600" fill="${MUTED}">${y}</text>`;
}).join('');
const [px, py] = pts[PICO], [ux, uy] = pts[pts.length - 1];
const graficaRango = `
      <svg data-grafica viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}" style="position: absolute; left: ${GL}px; top: ${GT}px; overflow: visible;">
        <defs>
          <linearGradient id="trazo-e" x1="0" x2="1"><stop offset="0" stop-color="${HUESO}"/><stop offset="1" stop-color="${ROSA}"/></linearGradient>
          <filter id="brillo-e" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        ${bandas}
        ${anios}
        <path data-linea-plana d="${lineaPlana}" fill="none" stroke="${HUESO}" stroke-width="8" stroke-linecap="round" style="filter: drop-shadow(0 0 8px ${a(HUESO, 0.6)});"/>
        <path data-linea-sube d="${lineaSube}" fill="none" stroke="url(#trazo-e)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#brillo-e)"/>
        ${pts.map(([x, y], i) => `<circle data-punto cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i <= PLANO ? 15 : i === PICO ? 15 : i === pts.length - 1 ? 14 : 9}" fill="${BG}" stroke="${i <= PLANO ? '#3FC1B0' : i === PICO ? '#B05CFF' : i === pts.length - 1 ? ROSA : '#5AA7FF'}" stroke-width="${i <= PLANO || i === PICO || i === pts.length - 1 ? 6 : 4}"/>`).join('')}
        <image data-cae href="assets/emblemas/master.png" x="${(px - 52).toFixed(1)}" y="${(py - 150).toFixed(1)}" width="104" height="77" opacity="0"/>
        <circle data-pulso cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="14" fill="none" stroke="${ROSA}" stroke-width="3" opacity="0"/>
        <text data-etiqueta x="${(ux - 4).toFixed(1)}" y="${(uy + 66).toFixed(1)}" text-anchor="middle" font-family="Bebas Neue, Impact" font-size="62" fill="${HUESO}">D2</text>
      </svg>`;
slides.push(lamina('elise-platino', 'Y lo mejor es que este mismo cabrón estuvo cuatro temporadas seguidas clavado en Platino cuatro, cuatro temporadas, así que hay esperanza para todos.', `
    ${ambiente(50, 10)}
    ${seda('platino', 0.26)}
    ${motas(430, 12)}
    ${panel(`
      ${ejes}
      ${graficaRango}`)}`));

// ── elise-partidas ───────────────────────────────────────────────────────
// 1.639 partidas esta temporada: una casilla por partida, 41 por 40 menos una.
const COLS = 41, FILAS = 40, TOTAL = 1639, PASO = 1000 / COLS, LADO = PASO - 3.6;
const rp = prng(1639);
const celdas = Array.from({ length: TOTAL }, (_, i) => {
  const c = i % COLS, f = Math.floor(i / COLS);
  const op = (0.55 + rp() * 0.45).toFixed(2), tono = rp();
  return `<rect data-celda x="${(40 + c * PASO).toFixed(1)}" y="${(330 + f * PASO).toFixed(1)}" width="${LADO.toFixed(1)}" height="${LADO.toFixed(1)}" rx="4" fill="${tono < 0.1 ? ROSA : tono < 0.2 ? '#8E1A2B' : CARMESI}" fill-opacity="${op}"/>`;
}).join('');
slides.push(lamina('elise-partidas', 'Pero este cabrón no tiene trabajo porque lleva mil seiscientas treinta y nueve partidas esta temporada, lo cual demuestra que chambea menos que yo.', `
    ${ambiente(50, 8)}
    ${seda('partidas', 0.22)}
    ${panel(`
      <div data-total class="carmesi" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 270px; line-height: 0.95;">1.639</div>
      <svg data-pared viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">${celdas}</svg>`)}`));

// ── elise-noble ──────────────────────────────────────────────────────────
slides.push(lamina('elise-noble', 'Y el lore del personaje está turbio wachen. Elise nació hace siglos en la casa Kythera, una familia noble de Noxus, y desde chiquita aprendió que la belleza sirve para manipular mentes débiles.', `
    ${borroso('cartas/01SI053-fondo.jpg', 0.5)}
    ${ambiente(40, 35)}
    ${seda('noble', 0.3)}
    ${motas(531, 18)}
    ${panel(`
      ${arte('cartas/01SI053.jpg', 'Elise, carta de Legends of Runeterra', { y: 235, alto: 900, pos: '22% 40%' })}
      ${telaSvg(tela({ cx: 1080, cy: 0, desde: 100, hasta: 170, rmax: 760, radios: 7, anillos: 6, semilla: 17, op: 0.32 }))}`)}`));

// ── elise-cena ───────────────────────────────────────────────────────────
// Sin arte oficial: la misma carta en duotono rojo y un tajo que la parte.
const AY = 275; // el arte de la cena y de la rosa va centrado en el panel (alto 820)
const CY1 = AY + 0.30 * 820, CY2 = AY + 0.70 * 820; // el tajo cruza el arte
const mitadCena = (nombre, clip) => `
      <div data-mitad="${nombre}" style="position: absolute; left: 0; top: ${AY}px; width: 1080px; height: 820px; clip-path: ${clip}; box-shadow: 0 40px 100px rgba(3,2,3,0.8);">
        <img data-img src="assets/cartas/01SI053.jpg" alt="Elise, carta de Legends of Runeterra, en duotono rojo" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 22% 40%; display: block; filter: grayscale(1) contrast(1.15) brightness(0.9);">
        <div style="position: absolute; inset: 0; background: ${CARMESI}; mix-blend-mode: multiply;"></div>
        <div style="position: absolute; inset: 0; background: ${a('#FF5A6E', 0.22)}; mix-blend-mode: screen;"></div>
      </div>`;
slides.push(lamina('elise-cena', 'Hasta que una noche en la cena, Berholdt le dijo que le había envenenado el vino y que le dejara el poder, Elise fingió arrepentirse, lloró y le suplicó, y cuando se acercó le clavó un cuchillo en el corazón.', `
    ${borroso('cartas/01SI053-fondo.jpg', 0.34)}
    <div data-fondo style="position: absolute; inset: 0; background: ${a(CARMESI, 0.25)}; mix-blend-mode: multiply; pointer-events: none;"></div>
    ${ambiente(50, 50)}
    ${motas(632, 14)}
    ${panel(`
      <div data-grieta style="position: absolute; left: -40px; top: ${AY}px; width: 1160px; height: 820px; background: linear-gradient(to bottom right, transparent calc(50% - 70px), ${a(ROSA, 0.95)} 50%, transparent calc(50% + 70px)); clip-path: polygon(0% ${0.30 * 100}%, 100% ${0.70 * 100}%, 100% ${0.70 * 100 + 4}%, 0% ${0.30 * 100 + 4}%); opacity: 0; filter: blur(8px);"></div>
      ${mitadCena('arriba', `polygon(0% 0%, 100% 0%, 100% 70%, 0% 30%)`)}
      ${mitadCena('abajo', `polygon(0% 30%, 100% 70%, 100% 100%, 0% 100%)`)}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <line data-tajo x1="-60" y1="${CY1 - 24}" x2="1140" y2="${CY2 + 24}" stroke="#FFF3EE" stroke-width="8" stroke-linecap="round" style="filter: drop-shadow(0 0 18px ${ROSA}) drop-shadow(0 0 46px ${CARMESI});"/>
      </svg>
      <div data-flash style="position: absolute; left: 0; top: ${AY}px; width: 1080px; height: 820px; background: #FFE3E0; mix-blend-mode: screen; opacity: 0; pointer-events: none;"></div>`)}`));

// ── elise-rosa ───────────────────────────────────────────────────────────
// La Mujer Pálida de la Rosa Negra: el arte se abre como una rosa.
const ROSA_C = { x: 540, y: AY + 410 }; // centro del arte
const petalos = Array.from({ length: 10 }, (_, k) => `<ellipse cx="${ROSA_C.x}" cy="${ROSA_C.y - 150}" rx="112" ry="176" transform="rotate(${k * 36} ${ROSA_C.x} ${ROSA_C.y})" fill="none" stroke="${ROSA}" stroke-width="5"/>`).join('');
const pet = prng(88);
const caida = Array.from({ length: 14 }, () => {
  const x = Math.round(40 + pet() * 1000), y = Math.round(150 + pet() * 900), s = (14 + pet() * 18).toFixed(0), rot = Math.round(pet() * 360);
  return `<span data-petalo style="position: absolute; left: ${x}px; top: ${y}px; width: ${s}px; height: ${Math.round(s * 1.5)}px; border-radius: 60% 0 60% 0; background: linear-gradient(135deg, #2A0A12, ${CARMESI}); transform: rotate(${rot}deg); opacity: ${(0.55 + pet() * 0.4).toFixed(2)}; box-shadow: 0 0 14px ${a(CARMESI, 0.4)}; pointer-events: none;"></span>`;
}).join('');
slides.push(lamina('elise-rosa', 'Pero el veneno la dejó postrada semanas, y ahí se le acercó la Mujer Pálida de la Rosa Negra, que en el resto del lore es LeBlanc, para ofrecerle un lugar en su sociedad secreta.', `
    ${borroso('cartas/04NX004-fondo.jpg', 0.42)}
    ${ambiente(50, 40, '#C99A4A')}
    ${motas(733, 12)}
    ${panel(`
      ${arte('cartas/04NX004.jpg', 'La mesa de la Rosa Negra, carta de Legends of Runeterra', { y: AY, alto: 820, pos: '50% 40%' })}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g data-flor style="filter: drop-shadow(0 0 22px ${a(CARMESI, 0.8)});">${petalos}</g>
      </svg>
      ${caida}`)}`));

// ── elise-helia ──────────────────────────────────────────────────────────
// Del barco entrando por la niebla blanca a la Niebla Negra, con el verde
// espectral entrando con ella.
slides.push(lamina('elise-helia', 'Y para ganarse su favor, Elise fue a buscar la calavera de un señor de la guerra a Helia, en las Islas de la Sombra, sí, la misma Helia de La Ruina de Helia, se fue con un capitán endeudado y un grupo de devotos.', `
    ${borroso('niebla-negra.jpg', 0.28)}
    ${ambiente(50, 50, VERDE)}
    ${motas(834, 14)}
    ${panel(`
      <div data-arte style="position: absolute; left: 0; top: 110px; width: 1080px; height: 1130px; overflow: hidden; box-shadow: 0 40px 100px rgba(3,2,3,0.8), 0 0 0 1px ${a(HUESO, 0.16)};">
        <img data-img src="assets/niebla-blanca.jpg" alt="Un barco entrando a Helia por la niebla" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 62% 60%; display: block;">
        <div data-negra style="position: absolute; inset: 0;">
          <img data-img-negra src="assets/niebla-negra.jpg" alt="La Niebla Negra sobre el mar" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 62% 60%; display: block;">
          <div style="position: absolute; inset: 0; background: ${a(VERDE, 0.12)}; mix-blend-mode: screen;"></div>
        </div>
        <div data-umbral style="position: absolute; left: 50%; top: 52%; width: 360px; height: 360px; margin: -180px 0 0 -180px; border-radius: 50%; border: 4px solid ${VERDE}; box-shadow: 0 0 60px ${VERDE}, inset 0 0 60px ${a(VERDE, 0.6)}; opacity: 0;"></div>
      </div>`)}`));

// ── elise-arana ──────────────────────────────────────────────────────────
slides.push(lamina('elise-arana', 'Y no encontró la calavera, encontró a Vilemaw, el dios araña que se comió a todos los intrusos, y a ella le clavó los colmillos en el hombro, del veneno le brotaron patas de araña de la espalda.', `
    ${kit.glitch()}
    ${borroso('cartas/01SI053T2-fondo.jpg', 0.5)}
    ${ambiente(35, 45, VERDE)}
    ${seda('arana', 0.3)}
    ${motas(935, 16)}
    ${panel(`
      ${arte('cartas/01SI053T2.jpg', 'Elise en su forma de araña, carta de Legends of Runeterra', { y: 285, alto: 800, pos: '40% 50%' })}
      <div data-garra data-fondo style="position: absolute; left: 0; top: 285px; width: 1080px; height: 800px; background: radial-gradient(40% 40% at 38% 40%, ${a(CARMESI, 0.55)}, ${a(CARMESI, 0)}); mix-blend-mode: screen; opacity: 0; pointer-events: none;"></div>
      ${telaSvg(tela({ cx: 1080, cy: 0, desde: 105, hasta: 170, rmax: 900, radios: 8, anillos: 7, semilla: 23, op: 0.34 }))}`)}`));

// ── elise-pretendientes ──────────────────────────────────────────────────
const CP = { x: 540, y: 685, r: 430 };
slides.push(lamina('elise-pretendientes', 'Hizo un pacto con la Rosa Negra, y hoy sigue viviendo en la casa Zaavan, y cada vez que su dios la llama regresa a las Islas con uno o dos pretendientes, y ninguno de sus acompañantes regresa nunca.', `
    ${borroso('cartas/01SI053T1-fondo.jpg', 0.42)}
    ${ambiente(50, 50)}
    ${motas(1036, 16)}
    ${panel(`
      <div data-halo-patas style="position: absolute; left: ${CP.x - 600}px; top: ${CP.y - 600}px; width: 1200px; height: 1200px; border-radius: 50%; background: radial-gradient(closest-side, ${a(CARMESI, 0.55)}, ${a(CARMESI, 0)} 70%);"></div>
      ${telaSvg(telaCirculo({ cx: CP.x, cy: CP.y, r0: CP.r - 4, r1: CP.r + 250, radios: 16, anillos: 3, semilla: 41 }), { fondo: false })}
      <div data-circulo style="position: absolute; left: ${CP.x - CP.r}px; top: ${CP.y - CP.r}px; width: ${CP.r * 2}px; height: ${CP.r * 2}px; border-radius: 50%; overflow: hidden; border: 5px solid ${HUESO}; box-shadow: 0 0 0 12px ${a(BG, 0.55)}, 0 0 90px ${a(CARMESI, 0.6)}, 0 40px 90px rgba(3,2,3,0.8);">
        <img data-img src="assets/cartas/01SI053T1.jpg" alt="El hechizo de Elise, carta de Legends of Runeterra" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>`)}`));

// ── elise-skins ──────────────────────────────────────────────────────────
// Las 9 pantallas de carga; la SKT T1 en 2×2 de guiño a la lámina 2. Aquelarre
// es la última comprable (octubre de 2023) y Baile de la Rosa Negra la más
// nueva, de pase de batalla.
const GX = 40, GY = 290, CW2 = 235, CH2 = 318, GAP = 20;
const celda = (c, f, cw = 1, ch = 1) => ({ x: GX + c * (CW2 + GAP), y: GY + f * (CH2 + GAP), w: cw * CW2 + (cw - 1) * GAP, h: ch * CH2 + (ch - 1) * GAP });
const SKINS = [
  [4, celda(0, 0, 2, 2), 'skt'], [1, celda(2, 0)], [2, celda(3, 0)], [3, celda(2, 1)], [5, celda(3, 1)],
  [6, celda(0, 2), 'boveda'], [15, celda(1, 2)], [24, celda(2, 2), 'ultima'], [34, celda(3, 2), 'nueva'],
];
const candado = kit.icono('tabler:lock', { tam: 52, color: HUESO, trazo: 2 });
const casillas = SKINS.map(([n, r, tipo]) => {
  const borde = tipo === 'ultima' ? `3px solid ${CARMESI}` : tipo === 'nueva' ? `3px solid ${HUESO}` : tipo === 'skt' ? `3px solid ${T1}` : `1px solid ${a(HUESO, 0.2)}`;
  const brillo = tipo === 'ultima' ? `box-shadow: 0 0 44px ${a(CARMESI, 0.7)};` : tipo === 'nueva' ? `box-shadow: 0 0 34px ${a(HUESO, 0.4)};` : tipo === 'skt' ? `box-shadow: 0 0 40px ${a(T1, 0.45)};` : 'box-shadow: 0 12px 30px rgba(0,0,0,0.55);';
  const gris = tipo === 'boveda' ? 'filter: grayscale(1) brightness(0.55);' : '';
  const sello = tipo === 'boveda' ? `<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: ${a(BG, 0.25)};">${candado}</div>` : '';
  const anio = tipo === 'ultima' ? `<div data-anio-skin class="hueso" style="position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font-size: 96px; line-height: 1; text-shadow: 0 4px 24px rgba(0,0,0,0.95);">2023</div>` : '';
  return `<div data-casilla ${tipo ? `data-${tipo}` : ''} style="position: absolute; left: ${r.x}px; top: ${r.y}px; width: ${r.w}px; height: ${r.h}px; border-radius: 14px; overflow: hidden; border: ${borde}; box-sizing: border-box; ${brillo}">
        <img src="assets/skins/Elise_${n}.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block; ${gris}">${sello}${anio}
      </div>`;
}).join('\n      ');
slides.push(lamina('elise-skins', 'Y de skins tiene nueve, y la última que se puede comprar salió en octubre de dos mil veintitrés, hace tres años, la más nueva es de pase de batalla, así que si no te la compraste ya mamaste.', `
    ${ambiente(50, 8)}
    ${seda('skins', 0.24)}
    ${motas(1137, 12)}
    ${panel(`
      <div data-nueve class="carmesi" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 240px; line-height: 0.9;">9</div>
      ${casillas}`)}`));

// ── elise-viuda ──────────────────────────────────────────────────────────
// El tamborileo: una mano de líneas golpea la mesa, se vuelve la viuda negra y
// camina. Arriba, el splash base (la viuda es de la Elise base, no de la skin).
const MESA = 1175;
const dedo = (x, largo, i) => {
  const dx = (i - 1.5) * 6;
  return `<g data-dedo><path d="M${x} 190 L${x + dx} ${190 + largo * 0.5} L${x + dx * 1.6} ${190 + largo}" fill="none" stroke="${HUESO}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} 190 L${x + dx} ${190 + largo * 0.5} L${x + dx * 1.6} ${190 + largo}" fill="none" stroke="${CUERPO}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></g>`;
};
const LARGOS = [205, 228, 214, 172];
const mano = `
        <g data-mano transform="translate(540 ${MESA - 190 - 228 - 24})">
          <path d="M-136 40 Q-160 150 -126 200 L126 200 Q160 150 136 40 Q0 -14 -136 40 Z" fill="${CUERPO}" stroke="${HUESO}" stroke-width="7" stroke-linejoin="round"/>
          <path d="M-126 98 L-188 150 L-204 214" fill="none" stroke="${HUESO}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M-126 98 L-188 150 L-204 214" fill="none" stroke="${CUERPO}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
          ${[-96, -32, 32, 96].map((x, i) => dedo(x, LARGOS[i], i)).join('')}
        </g>`;
const araniaCamina = (pose) => `<g data-pose="${pose}" ${pose === 'B' ? 'opacity="0"' : ''} transform="translate(540 ${MESA - 188}) rotate(90) scale(0.9)">${arana({ pose, sw: 9 })}</g>`;
slides.push(lamina('elise-viuda', 'Y el dato más pendejo, Elise está basada en la viuda negra, y en el juego cuando tamborilea los dedos, la mano parece una araña caminando.', `
    ${borroso('Elise_0-fondo.jpg', 0.4)}
    ${ambiente(60, 20)}
    ${motas(1238, 12)}
    ${panel(`
      ${arte('Elise_0.jpg', 'Elise, splash base', { y: 30, alto: 640, pos: '80% 30%' })}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <line data-mesa x1="60" y1="${MESA}" x2="1020" y2="${MESA}" stroke="${CARMESI}" stroke-width="6" stroke-linecap="round" style="filter: drop-shadow(0 0 16px ${CARMESI});"/>
        ${mano}
        <g data-arana-grupo opacity="0">${araniaCamina('A')}${araniaCamina('B')}</g>
      </svg>`)}`));

// ── elise-cierre ─────────────────────────────────────────────────────────
slides.push(lamina('elise-cierre', 'Ni pedo solo queda decir gigi easy tírenme un follow o les voy a meter la cuarta chao.', `
    ${borroso('Elise_34-fondo.jpg', 0.32)}
    ${ambiente(50, 45)}
    ${motas(1339, 14)}
    ${panel(`
      ${arte('Elise_34.jpg', 'Elise Baile de la Rosa Negra, splash', { y: 0, alto: 1200, pos: '47% 30%', marco: false })}
      <div data-velo style="position: absolute; left: 0; top: 700px; width: 1080px; height: 670px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, 0.88)} 70%); pointer-events: none;"></div>
      ${telaSvg(tela({ cx: 0, cy: 0, desde: 5, hasta: 85, rmax: 620, radios: 7, anillos: 6, semilla: 51, op: 0.28 }) + tela({ cx: 1080, cy: 0, desde: 95, hasta: 175, rmax: 620, radios: 7, anillos: 6, semilla: 53, op: 0.28 }) + tela({ cx: 0, cy: 1370, desde: -85, hasta: -5, rmax: 620, radios: 7, anillos: 6, semilla: 57, op: 0.28 }) + tela({ cx: 1080, cy: 1370, desde: 185, hasta: 265, rmax: 620, radios: 7, anillos: 6, semilla: 59, op: 0.28 }), { fondo: false })}
      <div data-ggez style="position: absolute; left: 0; right: 0; top: 950px; text-align: center; font-size: 330px; line-height: 1; transform: rotate(-4deg);"><span class="cierre-ros">GG EZ</span></div>`)}`));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Seda que deriva, motas que suben y el fondo que respira.
  function ambiente(tl, s, dur) {
    q(s, '[data-humo]').forEach(function (h) { tl.fromTo(h, { x: -30, y: 20 }, { x: 40, y: -50, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-brasa]').forEach(function (m, i) {
      tl.fromTo(m, { y: 40 + (i % 5) * 14, opacity: 0 }, { y: -60 - (i % 7) * 14, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
    q(s, '[data-borroso]').forEach(function (b) { tl.fromTo(b, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'power1.out' }, 0); });
  }
  // La telaraña se dibuja trazo a trazo.
  function teje(tl, s, en, dur, escalon) {
    var h = q(s, '[data-hilo]');
    if (h.length) tl.from(h, { drawSVG: '0%', duration: dur || 1.2, stagger: escalon == null ? 0.04 : escalon, ease: 'power1.out' }, en || 0);
  }

  animar('elise-portada', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.fromTo(uno(s, '[data-pulso]'), { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power4.out' }, 0.15)
      .to(uno(s, '[data-pulso]'), { opacity: 0, scale: 1.3, duration: 0.9, ease: 'power2.out' }, 0.33);
    efecto('contador', tl, uno(s, '[data-catorce]'), { cuenta: 14, dur: 1.2, en: 0.2 });
    tl.from(uno(s, '[data-catorce]'), { scale: 0.82, opacity: 0.25, duration: 1.3, ease: 'power3.out' }, 0.2)
      .from(uno(s, '[data-carta]'), { y: 120, opacity: 0, scale: 0.9, duration: 0.9 }, 0.3)
      .from(uno(s, '[data-carta] [data-img]'), { scale: 1.18, duration: 2.8, ease: 'power2.out' }, 0.3)
      .from(q(s, '[data-letra]'), { yPercent: 110, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(1.6)' }, 1.0);
    teje(tl, s, 0.2, 1.4, 0.05);
  });

  animar('elise-skin-t1', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.8 }, 0);
    efecto('camara', tl, uno(s, '[data-arte]'), { focos: '50 50 1; 86 12 2.3', en: 0.6, dur: 1.2, pausa: 0.2 });
    efecto('contador', tl, uno(s, '[data-anio]'), { cuenta: 2015, desde: 1995, separador: '', dur: 1.1, en: 1.2 });
    tl.from(uno(s, '[data-anio]'), { x: -60, opacity: 0, duration: 0.6 }, 1.2);
    efecto('sello', tl, uno(s, '[data-t1]'), { en: 1.9, desde: 2.4, fuerza: 14 });
  });

  animar('elise-rappel', function (tl, s) {
    ambiente(tl, s, 3.6);
    teje(tl, s, 0, 1.2, 0.04);
    // Baja colgada de su hilo y rebota.
    tl.from(uno(s, '[data-baja]'), { y: -900, duration: 0.85, ease: 'bounce.out' }, 0.1);
    tl.fromTo(uno(s, '[data-mira]'), { opacity: 0, scale: 2.6, rotation: 120, svgOrigin: '${RAP.x} ${RAP.y}' }, { opacity: 1, scale: 1, rotation: 0, svgOrigin: '${RAP.x} ${RAP.y}', duration: 0.7, ease: 'power3.out', immediateRender: true }, 0.9);
    tl.to(uno(s, '[data-mira]'), { scale: 0.9, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.inOut', svgOrigin: '${RAP.x} ${RAP.y}' }, 1.6);
    // Se vuelve espectro: la sólida se apaga, el espectro y su halo encienden.
    tl.to(uno(s, '[data-solida]'), { opacity: 0.1, duration: 0.45, ease: 'power2.out' }, 2.0)
      .to(uno(s, '[data-espectro]'), { opacity: 1, duration: 0.45, ease: 'power2.out' }, 2.0)
      .to(uno(s, '[data-halo-espectro]'), { opacity: 1, duration: 0.6 }, 2.0)
      .fromTo(uno(s, '[data-ping]'), { opacity: 1, scale: 1, svgOrigin: '${RAP.x} ${RAP.y}' }, { opacity: 0, scale: 3.4, svgOrigin: '${RAP.x} ${RAP.y}', duration: 0.9, ease: 'power2.out', immediateRender: false }, 2.0)
      // La mira la atraviesa y se cae.
      .to(uno(s, '[data-mira]'), { y: 520, x: 120, rotation: 38, opacity: 0, duration: 0.8, ease: 'power2.in', svgOrigin: '${RAP.x} ${RAP.y}' }, 2.3);
  });

  animar('elise-otp', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .fromTo(uno(s, '[data-arte] [data-img]'), { scale: 1 }, { scale: 1.32, transformOrigin: '80% 30%', duration: 3.4, ease: 'power2.out', immediateRender: true }, 0)
      .from(uno(s, '[data-pastilla]'), { xPercent: -110, duration: 0.7, ease: 'power3.out' }, 0.45)
      .from(uno(s, '[data-nombre-otp]'), { opacity: 0, x: -30, duration: 0.5 }, 0.8)
      .from(uno(s, '[data-kr]'), { scale: 2.4, opacity: 0, duration: 0.4, ease: 'power4.in' }, 1.0);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 10067782, separador: '.', dur: 1.5, en: 1.2 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 1.2)
      .from(uno(s, '[data-diamante]'), { y: 90, opacity: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.7)' }, 2.0)
      .from(uno(s, '[data-flecha]'), { drawSVG: '0%', duration: 0.6, ease: 'power2.inOut' }, 2.4)
      .from(uno(s, '[data-punta]'), { opacity: 0, duration: 0.2 }, 2.95)
      .from(uno(s, '[data-halo]'), { scale: 0.3, opacity: 0, duration: 0.9 }, 2.9)
      .from(uno(s, '[data-emblema]'), { y: -260, rotation: -30, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 2.9);
  });

  animar('elise-platino', function (tl, s) {
    if (window.continua) continua(tl, s);
    ambiente(tl, s, 5.4);
    tl.from(q(s, '[data-banda] rect'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.08, ease: 'power3.inOut' }, 0.1)
      .from(q(s, '[data-emblema-eje]:not([data-continua])'), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2.2)' }, 0.25)
      .from(q(s, '[data-anio]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, 0.3);
    var pts = q(s, '[data-punto]');
    // Tramo plano, lento: las cuatro temporadas en Platino 4.
    tl.from(uno(s, '[data-linea-plana]'), { drawSVG: '0%', duration: 2.0, ease: 'none' }, 0.6);
    for (var i = 0; i <= ${PLANO}; i++) tl.from(pts[i], { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 0.6 + 2.0 * i / ${PLANO});
    // Subida, rápida.
    tl.from(uno(s, '[data-linea-sube]'), { drawSVG: '0%', duration: 1.5, ease: 'power1.inOut' }, 2.7);
    for (var j = ${PLANO} + 1; j < pts.length; j++) tl.from(pts[j], { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' }, 2.7 + 1.5 * (j - ${PLANO}) / (pts.length - 1 - ${PLANO}));
    var tPico = 2.7 + 1.5 * (${PICO} - ${PLANO}) / (pts.length - 1 - ${PLANO});
    tl.fromTo(uno(s, '[data-cae]'), { opacity: 1, y: 0 }, { opacity: 0, y: 190, rotation: 25, transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.in', immediateRender: false }, tPico + 0.1)
      .fromTo(uno(s, '[data-pulso]'), { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, 4.3)
      .from(uno(s, '[data-etiqueta]'), { opacity: 0, y: 14, duration: 0.4 }, 4.3);
  });

  animar('elise-partidas', function (tl, s) {
    ambiente(tl, s, 3.6);
    efecto('contador', tl, uno(s, '[data-total]'), { cuenta: 1639, separador: '.', dur: 2.0, en: 0.2 });
    tl.from(uno(s, '[data-total]'), { scale: 0.8, opacity: 0.2, duration: 0.8, ease: 'back.out(1.6)' }, 0.2)
      .from(q(s, '[data-celda]'), { opacity: 0, scale: 0.2, transformOrigin: '50% 50%', duration: 0.18, stagger: { each: 2.0 / ${TOTAL}, from: 'start' }, ease: 'power2.out' }, 0.2);
  });

  animar('elise-noble', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.9 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.2, transformOrigin: '35% 40%', duration: 3.4, ease: 'power2.out' }, 0);
    teje(tl, s, 0.5, 1.4, 0.05);
  });

  animar('elise-cena', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(q(s, '[data-mitad]'), { opacity: 0, y: 30, duration: 0.7 }, 0)
      .from(q(s, '[data-mitad] [data-img]'), { scale: 1.16, transformOrigin: '35% 40%', duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-tajo]'), { drawSVG: '0%', duration: 0.22, ease: 'power4.in' }, 1.15)
      .fromTo(uno(s, '[data-flash]'), { opacity: 0 }, { opacity: 0.85, duration: 0.06 }, 1.36)
      .to(uno(s, '[data-flash]'), { opacity: 0, duration: 0.5, ease: 'power2.out' }, 1.42)
      .fromTo(uno(s, '[data-grieta]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.36)
      .to(uno(s, '[data-mitad="arriba"]'), { y: -22, x: -6, rotation: -0.8, transformOrigin: '50% 100%', duration: 0.5, ease: 'power3.out' }, 1.36)
      .to(uno(s, '[data-mitad="abajo"]'), { y: 22, x: 6, rotation: 0.8, transformOrigin: '50% 0%', duration: 0.5, ease: 'power3.out' }, 1.36)
      .to(uno(s, '[data-tajo]'), { opacity: 0.0, duration: 0.5 }, 1.6);
  });

  animar('elise-rosa', function (tl, s) {
    ambiente(tl, s, 3.6);
    // El arte se abre como una rosa: el iris crece y los pétalos van en su borde.
    efecto('cortinilla', tl, uno(s, '[data-arte]'), { forma: 'iris', origen: '50% 50%', en: 0.15, dur: 1.5, ease: 'power2.inOut' });
    tl.fromTo(uno(s, '[data-flor]'), { scale: 0.05, rotation: -40, opacity: 1, svgOrigin: '${ROSA_C.x} ${ROSA_C.y}' }, { scale: 4.4, rotation: 40, svgOrigin: '${ROSA_C.x} ${ROSA_C.y}', duration: 1.5, ease: 'power2.inOut', immediateRender: true }, 0.15)
      .to(uno(s, '[data-flor]'), { opacity: 0, duration: 0.45, ease: 'power1.in' }, 1.2)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.25, transformOrigin: '50% 40%', duration: 3.2, ease: 'power2.out' }, 0.1);
    q(s, '[data-petalo]').forEach(function (p, i) {
      tl.fromTo(p, { y: -120 - (i % 4) * 40, opacity: 0 }, { y: 420 + (i % 5) * 60, opacity: parseFloat(p.style.opacity), rotation: '+=' + (120 + i * 18), duration: 3.2 + (i % 4) * 0.2, ease: 'none' }, 0.3 + (i % 6) * 0.15);
    });
  });

  animar('elise-helia', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.12, transformOrigin: '62% 60%', duration: 3.6, ease: 'power2.out' }, 0);
    efecto('cortinilla', tl, uno(s, '[data-negra]'), { forma: 'iris', origen: '50% 52%', en: 1.4, dur: 1.4, ease: 'power2.inOut' });
    tl.fromTo(uno(s, '[data-umbral]'), { opacity: 0, scale: 0.2 }, { opacity: 0.9, scale: 1.8, duration: 1.3, ease: 'power2.out', immediateRender: true }, 1.4)
      .to(uno(s, '[data-umbral]'), { opacity: 0, duration: 0.4 }, 2.6);
  });

  animar('elise-arana', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.from(uno(s, '[data-arte]'), { opacity: 0, duration: 0.2 }, 0);
    efecto('glitch', tl, uno(s, '[data-arte]'), { en: 0, dur: 1.1, fuerza: 150 });
    tl.from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '38% 50%', duration: 3, ease: 'power2.out' }, 0)
      .to(uno(s, '[data-panel]'), { keyframes: [{ x: -12, y: 6, duration: 0.05 }, { x: 10, y: -5, duration: 0.05 }, { x: -6, y: 3, duration: 0.05 }, { x: 0, y: 0, duration: 0.06 }], ease: 'none' }, 1.1)
      .fromTo(uno(s, '[data-garra]'), { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 3 }, 1.1);
    teje(tl, s, 0.4, 1.4, 0.05);
  });

  animar('elise-pretendientes', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-circulo]'), { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' }, 0)
      .from(uno(s, '[data-circulo] [data-img]'), { scale: 1.25, duration: 3.2, ease: 'power2.out' }, 0)
      .fromTo(uno(s, '[data-halo-patas]'), { opacity: 0.4 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0.4);
    teje(tl, s, 0.6, 1.6, 0.04);
  });

  animar('elise-skins', function (tl, s) {
    ambiente(tl, s, 4);
    efecto('contador', tl, uno(s, '[data-nueve]'), { cuenta: 9, dur: 0.9, en: 0.1 });
    tl.from(uno(s, '[data-nueve]'), { scale: 0.7, opacity: 0.2, duration: 0.8, ease: 'back.out(1.8)' }, 0.1)
      .fromTo(q(s, '[data-casilla]'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.09 }, 0.25)
      .to(uno(s, '[data-ultima]'), { y: -16, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.5)
      .from(uno(s, '[data-anio-skin]'), { opacity: 0, y: 24, scale: 1.4, duration: 0.45, ease: 'power3.out' }, 1.55)
      .to(uno(s, '[data-nueva]'), { y: -16, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, 2.4);
  });

  animar('elise-viuda', function (tl, s) {
    ambiente(tl, s, 5);
    tl.from(uno(s, '[data-arte]'), { y: 40, opacity: 0, duration: 0.7 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.12, transformOrigin: '80% 30%', duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-mesa]'), { drawSVG: '0%', duration: 0.6, ease: 'power2.out' }, 0.5)
      .from(uno(s, '[data-mano]'), { y: '-=170', opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.7);
    // Tamborilea: cada dedo baja y sube, del índice al meñique, tres vueltas.
    var dedos = q(s, '[data-dedo]');
    for (var v = 0; v < 3; v++) dedos.forEach(function (d, i) {
      tl.to(d, { scaleY: 0.78, transformOrigin: '50% 0%', duration: 0.1, ease: 'power1.in' }, 1.4 + v * 0.5 + i * 0.09)
        .to(d, { scaleY: 1, transformOrigin: '50% 0%', duration: 0.1, ease: 'power1.out' }, 1.5 + v * 0.5 + i * 0.09);
    });
    // La mano se encoge y deja su lugar a la viuda, que camina por la mesa.
    tl.to(uno(s, '[data-mano]'), { opacity: 0, y: '+=60', duration: 0.45, ease: 'power2.in' }, 3.0)
      .to(uno(s, '[data-arana-grupo]'), { opacity: 1, duration: 0.45 }, 3.1)
      .fromTo(uno(s, '[data-arana-grupo]'), { x: -340 }, { x: 0, duration: 2.0, ease: 'none', immediateRender: false }, 3.1);
    // Paso a paso: dos poses que se alternan.
    for (var k = 0; k < 10; k++) {
      tl.set(uno(s, '[data-pose="A"]'), { opacity: k % 2 ? 0 : 1 }, 3.1 + k * 0.2)
        .set(uno(s, '[data-pose="B"]'), { opacity: k % 2 ? 1 : 0 }, 3.1 + k * 0.2);
    }
  });

  animar('elise-cierre', function (tl, s) {
    ambiente(tl, s, 3.2);
    tl.from(uno(s, '[data-arte]'), { y: 40, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '47% 30%', duration: 3.2, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-velo]'), { opacity: 0, duration: 0.6 }, 0.4)
      .from(uno(s, '[data-ggez]'), { scale: 2.4, opacity: 0, duration: 0.45, ease: 'power4.in' }, 1.5);
    teje(tl, s, 0.2, 1.6, 0.03);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Elise cumple 14 años</title>
${kit.og({ titulo: 'Elise cumple 14 años', descripcion: 'Cumplelolero #27: el OTP coreano que se llama ELISE JUNGLE, cuatro temporadas en Platino 4, el lore de la araña y la skin SKT T1 que escogió Bengi.', carpeta: 'creator/elise' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .carmesi { background: linear-gradient(180deg, #FFE0DC 0%, ${ROSA} 38%, ${CARMESI} 68%, #7E1224 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(CARMESI, 0.5)}); }
  .hueso { background: linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 55%, #9C8F7E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 28px rgba(3,2,3,0.9)); }
  .cierre-ros { background: linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 40%, ${ROSA} 75%, ${CARMESI} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 30px rgba(3,2,3,0.95)); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(CARMESI, 0.5)}; border-radius: 999px;
    background: rgba(11,7,9,0.85); color: ${ROSA}; cursor: pointer;
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
