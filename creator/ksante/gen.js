// Generador de index.html — K'Sante cumple 4 años (láminas para el montaje automático)
// Ejecutar: node creator/ksante/gen.js   ·   clips: node tools/laminas.mjs creator/ksante
//
// Serie «Cumplelolero» #29, mismo formato que lux, graves, elise y seraphine:
// cada lámina es un miniclip para el **panel de 1080×1370** (`crop=1080:1370:0:275`)
// que en el video final se escala a 706×896 abajo del gameplay. Todo lo
// importante vive dentro de `PANEL`, con margen, porque al reducirse el texto
// chico se pierde.
//
// Criterio de jinx: el único texto es el dato — K'SANTE y 4, 19, 0-5, 6-8, 6-13,
// AATREUS y 4.863.453, 1.885 LP, el 4 de skins, 26.20 y 7 OCT, GG EZ. Sin dinero.
//
// Sigue el guion de Axl del 3/11/2026 (paquete `ksante-paquete-presentacion.md`).
// Las 18 láminas y la palabra del guion que dispara cada una están en
// `video-out/laminas/guion-marcado.txt`; cada <section> lleva su `data-lamina`.
//
// ⚠️ **Ningún clip arranca en negro**: copia desenfocada, dunas y granos de
// arena se ven desde el cuadro 0; lo que entra es el primer plano.
// ⚠️ **No existe arte oficial de Tope, la cobra león, Nazumah (la ciudad), el
// diario ni la cascada**: son dibujo a líneas, nada se presenta como arte
// oficial. Los renglones del diario son garabatos, no texto.
// ⚠️ **La rejilla de 19 casillas** de ksante-19, ksante-playin y ksante-suiza va
// con `data-continua="rejilla"` (son consecutivas). `ksante-orgullo` NO puede
// continuar de ksante-suiza: la pareja de `continua` es la lámina anterior del
// deck y entre las dos hay siete láminas de lore. Esa vuelve a armar la misma
// rejilla ya pintada, en cascada rápida.
// ⚠️ Orden exacto de la fase suiza (picks 6 a 19, Leaguepedia): D D D V V V V D
// D D D V V D → 6 victorias y 8 derrotas. Los 5 picks del Play-In son derrotas.
// El récord llega hasta el 31/10: si juega en cuartos, cambian `RESULTADOS`.
// ⚠️ Azir y Xerath van con los **splashes** de `azir/` y `xerath/` (1215×717),
// recortados en vertical: son más nítidos que sus pantallas de carga (308×560).
// ⚠️ Los íconos de Data Dragon son de 64 px (ampliados 4× con Lanczos). La
// pasiva se llama `Icons_KSante_P.png`.
//
// Datos: la ficha de K'Sante de Axl (Leaguepedia, ChampionMastery.GG, op.gg,
// wiki oficial, bio oficial es-MX y Data Dragon 16.21.1).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Los fondos (copia desenfocada, lavados, dunas) llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta: el desierto de Nazumah ───────────────────────────────────────
const BG = '#0F0A18';        // negro violáceo
const ARENA = '#D9A441';     // arena de Shurima — cifras y desierto
const ARENA_CL = '#F2CC77';
const CREMA = '#FFF3D6';
const VERDE = '#7CFF4F';     // verde neón — victoria y Empíreo / HEARTSTEEL
const MAGENTA = '#C23CFF';   // magenta — solo Empíreo / HEARTSTEEL
const ROJO = '#E5484D';      // derrota
const AGUA = '#5AB4FF';      // la cascada
const GRIS = '#2A2338';
const MUTED = '#8B7FA3';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };

// ── Piezas comunes ───────────────────────────────────────────────────────
function prng(semilla) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SECCION = `background: ${BG}; color: ${CREMA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

const borroso = (src, brillo = 0.45, extra = '') => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(46px) saturate(1.15) brightness(${brillo}); ${extra}"></div>
    </div>`;

// Lavado de color y viñeta: nunca un fondo plano.
const ambiente = (x = 50, y = 30, color = ARENA, fuerza = 0.22) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(75% 45% at ${x}% ${y}%, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(8,4,14,0.74) 100%);"></div>`;

// Dunas: senoides lentas a todo lo ancho que derivan. El trazo mide dos paneles
// y cada línea da un número entero de ciclos por panel, así que al correr 1080 px
// el bucle cierra sin saltos.
function dunas(semilla, { lineas = 6, op = 0.3, amp = 46, y0 = PANEL.top + 150, y1 = PANEL.top + 1220, c1 = ARENA, c2 = ARENA_CL } = {}) {
  const r = prng(semilla);
  let paths = '';
  for (let k = 0; k < lineas; k++) {
    const y = y0 + (y1 - y0) * k / (lineas - 1), ciclos = 1 + Math.floor(r() * 3), A = amp * (0.4 + r() * 0.9), fase = r() * 6.28;
    let d = '';
    for (let x = 0; x <= 2160; x += 12) d += `${x ? 'L' : 'M'}${x} ${(y + A * Math.sin(x / 1080 * ciclos * 2 * Math.PI + fase)).toFixed(1)}`;
    paths += `<path d="${d}" fill="none" stroke="${k % 2 ? c2 : c1}" stroke-opacity="${(op * (0.55 + r() * 0.45)).toFixed(2)}" stroke-width="${(2 + r() * 3).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <svg data-dunas viewBox="0 0 2160 1920" width="2160" height="1920" style="position: absolute; left: 0; top: 0; filter: drop-shadow(0 0 10px ${a(c1, 0.35)});">${paths}</svg>
    </div>`;
}

// Granos de arena que suben, posiciones fijas por semilla.
const granos = (semilla, n = 26, col = ARENA_CL) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 1020), y = Math.round(PANEL.top + 80 + r() * (PANEL.h - 160));
    const t = (3 + r() * 6).toFixed(1), op = (0.3 + r() * 0.5).toFixed(2);
    h += `<span data-brasa style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; border-radius: 50%; background: ${i % 4 ? col : CREMA}; opacity: ${op}; box-shadow: 0 0 ${Math.round(t * 3)}px ${col}; pointer-events: none;"></span>`;
  }
  return `<div style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

// Arte apaisado dentro del panel (cover, foco en `pos`).
const arte = (src, alt, { y, alto, pos = 'center', extra = '', attrs = '', marco = true, estilo = '', ancho = 1080, x = 0 } = {}) => `
      <div data-arte ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${ancho}px; height: ${alto}px; overflow: hidden; ${marco ? `box-shadow: 0 40px 100px rgba(4,2,10,0.8), 0 0 0 1px ${a(CREMA, 0.18)};` : ''} ${estilo}">
        <img data-img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">${extra}
      </div>`;

const lamina = (id, notasOrador, cuerpo, extraSeccion = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}" style="${SECCION} ${extraSeccion}">${cuerpo}
  </section>`;

// Trazo de línea gruesa con brillo (para los dibujos a líneas).
const trazo = (d, { col = ARENA_CL, w = 9, extra = '', op = 1, attrs = 'data-hilo' } = {}) => `<path ${attrs} d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${op}" ${extra} style="filter: drop-shadow(0 0 12px ${a(col, 0.55)});"/>`;

// Hexágono de punta arriba centrado en (cx, cy) con radio r.
const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => { const t = -Math.PI / 2 + i * Math.PI / 3; return `${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`; }).join(' ');

// Coraza de placas hexagonales dentro de una elipse (la cobra león).
function coraza({ cx, cy, rx, ry, r = 58, semilla = 5 }) {
  const rnd = prng(semilla), ancho = Math.sqrt(3) * r, alto = 1.5 * r;
  let h = '', k = 0;
  for (let f = -9; f <= 9; f++) for (let c = -9; c <= 9; c++) {
    const x = cx + c * ancho + (f % 2 ? ancho / 2 : 0), y = cy + f * alto;
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1) continue;
    h += `<polygon data-placa data-k="${k++}" points="${hex(x, y, r - 5)}" fill="${a(ARENA, 0.1 + rnd() * 0.12)}" stroke="${ARENA_CL}" stroke-width="5" stroke-linejoin="round" stroke-opacity="${(0.65 + rnd() * 0.3).toFixed(2)}"/>`;
  }
  return h;
}
// Melena: rayos alrededor de la elipse, para que lea cobra león y no un panal.
function melena({ cx, cy, rx, ry, n = 26 }) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const t = Math.PI + (i / (n - 1)) * Math.PI * 1.0 - Math.PI * 0.0, ca = Math.cos(t), sa = Math.sin(t);
    const x0 = cx + (rx + 14) * ca, y0 = cy + (ry + 14) * sa, x1 = cx + (rx + 70 + (i % 2) * 40) * ca, y1 = cy + (ry + 70 + (i % 2) * 40) * sa;
    h += trazo(`M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)}`, { col: ARENA, w: 7, op: 0.8, attrs: 'data-melena' });
  }
  return h;
}

// ── La rejilla de los 19 picks ───────────────────────────────────────────
// Resultados en orden: los 5 del Play-In (derrotas) y los 14 de la fase suiza.
const RESULTADOS = 'DDDDD' + 'DDDVVVVDDDDVVD';
const FILAS = [4, 4, 4, 4, 3];
const estiloCelda = (e) => e === 'V'
  ? `background: linear-gradient(160deg, ${a(VERDE, 0.5)}, ${a(VERDE, 0.2)}); border: 4px solid ${VERDE}; box-shadow: 0 0 34px ${a(VERDE, 0.6)};`
  : e === 'D'
    ? `background: linear-gradient(160deg, ${a(ROJO, 0.42)}, ${a(ROJO, 0.16)}); border: 4px solid ${ROJO}; box-shadow: 0 0 22px ${a(ROJO, 0.35)};`
    : `background: linear-gradient(160deg, ${a(MUTED, 0.3)}, ${a(MUTED, 0.12)}); border: 4px solid ${a(MUTED, 0.55)}; box-shadow: none;`;
// `estado(i)` devuelve 'G' (gris), 'V' o 'D'; `atenuado(i)` apaga la casilla.
function rejilla({ x, y, lado, hueco, estado, atenuado = () => false }) {
  const w = 4 * lado + 3 * hueco, h = 5 * lado + 4 * hueco;
  let i = 0, cel = '';
  FILAS.forEach((n, f) => {
    const x0 = (4 - n) * (lado + hueco) / 2;
    for (let c = 0; c < n; c++, i++) {
      cel += `<div data-celda data-i="${i}" style="position: absolute; left: ${x0 + c * (lado + hueco)}px; top: ${f * (lado + hueco)}px; width: ${lado}px; height: ${lado}px; border-radius: ${Math.round(lado * 0.16)}px; box-sizing: border-box; ${estiloCelda(estado(i))} opacity: ${atenuado(i) ? 0.3 : 1};"></div>`;
    }
  });
  return `<div data-rejilla data-continua="rejilla" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px;">${cel}</div>`;
}
const REJ_A = { x: 164, y: 345, lado: 170, hueco: 24 };     // 752×946
const REJ_B = { x: 130, y: 300, lado: 190, hueco: 20 };     // 820×1030, la misma proporción

const slides = [];

// ── 1 · ksante-portada ───────────────────────────────────────────────────
slides.push(lamina('ksante-portada', 'K\'Sante cumplió cuatro años.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.5)}
    ${ambiente(50, 40)}
    ${dunas(11)}
    ${granos(101, 28)}
    ${panel(`
      <div data-cuatro class="arena" style="position: absolute; left: 520px; top: 240px; font-size: 1000px; line-height: 1; z-index: 3;">4</div>
      <div data-carta style="position: absolute; left: 40px; top: 110px; width: 510px; height: 927px; border-radius: 26px; overflow: hidden; border: 4px solid ${CREMA}; box-shadow: 0 0 0 12px ${a(BG, 0.55)}, 0 0 110px ${a(ARENA, 0.5)}, 0 40px 90px rgba(4,2,10,0.85);">
        <img data-img src="assets/skins/KSante_0.jpg" alt="K'Sante, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
      <div data-nombre style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font-size: 200px; line-height: 0.95; letter-spacing: 12px; padding-left: 12px;">${"K'SANTE".split('').map((c) => `<span data-letra class="arena" style="display: inline-block;">${c}</span>`).join('')}</div>`)}`));

// ── 2 · ksante-kit ───────────────────────────────────────────────────────
// La pasiva y las cuatro habilidades se encienden una por una.
const ICONOS = [['KSanteQ'], ['KSanteW'], ['KSanteE'], ['KSanteR']];
const ICON = 225, ICONGAP = 30, ICONX0 = (1080 - (4 * ICON + 3 * ICONGAP)) / 2, ICONY = 790;
const iconoK = (archivo, x, y, tam, attrs = '') => `
      <div data-icono ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; border-radius: ${Math.round(tam * 0.14)}px; overflow: hidden; border: 5px solid ${ARENA_CL}; box-sizing: border-box; box-shadow: 0 0 46px ${a(ARENA, 0.5)}, 0 22px 50px rgba(4,2,10,0.7);">
        <img src="assets/iconos/${archivo}.png" alt="Ícono de habilidad" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>`;
slides.push(lamina('ksante-kit', 'Tiene mucho kit: una pasiva y cuatro habilidades.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.38)}
    ${ambiente(50, 45)}
    ${dunas(22)}
    ${granos(202, 20)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        ${anillosIcon()}
        ${ICONOS.map((_, i) => trazo(`M540 590 C540 680 ${ICONX0 + i * (ICON + ICONGAP) + ICON / 2} 700 ${ICONX0 + i * (ICON + ICONGAP) + ICON / 2} ${ICONY}`, { col: ARENA, w: 5, op: 0.55, attrs: 'data-linea-icono' })).join('')}
      </svg>
      ${iconoK('KSante_P', 540 - 150, 290, 300, 'data-icono-p')}
      ${ICONOS.map(([f], i) => iconoK(f, ICONX0 + i * (ICON + ICONGAP), ICONY, ICON, `data-icono-h`)).join('')}`)}`));
function anillosIcon() { return Array.from({ length: 3 }, () => `<circle data-anillo cx="540" cy="440" r="150" fill="none" stroke="${ARENA_CL}" stroke-width="5" opacity="0"/>`).join(''); }

// ── 3 · ksante-19 ────────────────────────────────────────────────────────
slides.push(lamina('ksante-19', 'En el Mundial K\'Sante ha sido pickeado diecinueve veces.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.3)}
    ${ambiente(50, 20)}
    ${dunas(33, { op: 0.22 })}
    ${granos(303, 14)}
    ${panel(`
      <div data-numero class="arena" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 300px; line-height: 1;">19</div>
      ${rejilla({ ...REJ_A, estado: () => 'G' })}`)}`));

// ── 4 · ksante-playin ────────────────────────────────────────────────────
slides.push(lamina('ksante-playin', 'En el Play-In se jugó cinco veces y perdió las cinco.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.3)}
    ${ambiente(50, 20, ROJO, 0.2)}
    ${dunas(44, { op: 0.22 })}
    ${granos(404, 12)}
    ${panel(`
      <div data-numero class="derrota" style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 300px; line-height: 1;">0-5</div>
      ${rejilla({ ...REJ_A, estado: (i) => (i < 5 ? 'D' : 'G'), atenuado: (i) => i >= 5 })}`)}`));

// ── 5 · ksante-suiza ─────────────────────────────────────────────────────
slides.push(lamina('ksante-suiza', 'En la fase suiza lleva catorce apariciones y perdió ocho.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.3)}
    ${ambiente(50, 20)}
    ${dunas(55, { op: 0.22 })}
    ${granos(505, 12)}
    ${panel(`
      <div data-numero style="position: absolute; left: 0; right: 0; top: 20px; text-align: center; font-size: 300px; line-height: 1;"><span class="victoria">6</span><span class="arena">-</span><span class="derrota">8</span></div>
      ${rejilla({ ...REJ_A, estado: (i) => RESULTADOS[i] })}`)}`));

// ── 6 · ksante-otp ───────────────────────────────────────────────────────
slides.push(lamina('ksante-otp', 'El OTP con más puntos de K\'Sante se llama Aatreus, juega en Norteamérica y tiene más de cuatro millones ochocientos mil puntos.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.34)}
    ${ambiente(50, 30)}
    ${dunas(66)}
    ${granos(606, 16)}
    ${panel(`
      ${arte('splash/KSante_0.jpg', "K'Sante, splash base", { y: 30, alto: 480, pos: '60% 40%' })}
      <div data-pastilla data-continua="pastilla" style="position: absolute; left: 40px; top: 470px; width: 1000px; height: 150px; border-radius: 75px; box-sizing: border-box; background: ${a(BG, 0.92)}; border: 3px solid ${ARENA}; box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 50px ${a(ARENA, 0.4)}; display: flex; align-items: center; justify-content: center;">
        <span data-nombre-otp style="font-size: 132px; line-height: 1; letter-spacing: 12px; padding-left: 12px; color: ${CREMA};">AATREUS</span>
      </div>
      <div data-puntos class="arena" style="position: absolute; left: 0; right: 0; top: 640px; text-align: center; font-size: 250px; line-height: 1;">4.863.453</div>
      <div data-halo style="position: absolute; left: ${540 - 330}px; top: 900px; width: 660px; height: 480px; border-radius: 50%; background: radial-gradient(closest-side, ${a('#FF5A7A', 0.5)}, ${a('#FF5A7A', 0)});"></div>
      <img data-continua="emblema" data-emblema src="assets/emblemas/grandmaster.png" alt="Emblema de Gran Maestro" style="position: absolute; left: ${540 - 270}px; top: 965px; width: 540px; height: auto; filter: drop-shadow(0 0 40px ${a('#FF6A5C', 0.6)}) drop-shadow(0 20px 34px rgba(0,0,0,0.6));">`)}`));

// ── 7 · ksante-challenger ────────────────────────────────────────────────
// El emblema de Gran Maestro sube y se vuelve el de Challenger; la pastilla se
// queda donde estaba.
slides.push(lamina('ksante-challenger', 'Está en Gran Maestro y este año llegó a Challenger, con un pico de mil ochocientos ochenta y cinco puntos de liga.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.34)}
    ${ambiente(50, 30, '#FFB45A', 0.2)}
    ${dunas(77)}
    ${granos(707, 16)}
    ${panel(`
      ${arte('splash/KSante_0.jpg', "K'Sante, splash base", { y: 30, alto: 480, pos: '60% 40%' })}
      <div data-pastilla data-continua="pastilla" style="position: absolute; left: 40px; top: 470px; width: 1000px; height: 150px; border-radius: 75px; box-sizing: border-box; background: ${a(BG, 0.92)}; border: 3px solid ${ARENA}; box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 50px ${a(ARENA, 0.4)}; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 132px; line-height: 1; letter-spacing: 12px; padding-left: 12px; color: ${CREMA};">AATREUS</span>
      </div>
      <div data-lp class="arena" style="position: absolute; left: 0; right: 0; top: 640px; text-align: center; font-size: 250px; line-height: 1;">1.885 LP</div>
      <div data-halo style="position: absolute; left: ${540 - 330}px; top: 880px; width: 660px; height: 480px; border-radius: 50%; background: radial-gradient(closest-side, ${a('#FFB45A', 0.55)}, ${a('#FFB45A', 0)});"></div>
      <img data-continua="emblema" data-emblema-gm src="assets/emblemas/grandmaster.png" alt="Emblema de Gran Maestro" style="position: absolute; left: ${540 - 270}px; top: 965px; width: 540px; height: auto; filter: drop-shadow(0 0 40px ${a('#FF6A5C', 0.6)}) drop-shadow(0 20px 34px rgba(0,0,0,0.6));">
      <img data-emblema-ch src="assets/emblemas/challenger.png" alt="Emblema de Challenger" style="position: absolute; left: ${540 - 285}px; top: 945px; width: 570px; height: auto; filter: drop-shadow(0 0 46px ${a('#FFB45A', 0.7)}) drop-shadow(0 20px 34px rgba(0,0,0,0.6));">`)}`));

// ── 8 · ksante-youtube ───────────────────────────────────────────────────
// La captura del canal de Aatreus, en un marco de ventana de navegador. La
// pone Axl en assets/aatreus-youtube.png; si falta, queda un marcador.
const HAY_YT = fs.existsSync(__dirname + '/assets/aatreus-youtube.png');
const VW = 960, VH = Math.round(960 * 885 / 1383); // 960×614
slides.push(lamina('ksante-youtube', 'Aquí dejo captura del canal de YouTube del OTP, por si quieren aprender a jugarlo.', `
    ${borroso('splash/KSante_18-fondo.jpg', 0.32)}
    ${ambiente(50, 40)}
    ${dunas(88)}
    ${granos(808, 12)}
    ${panel(`
      <div data-ventana style="position: absolute; left: ${(1080 - VW) / 2}px; top: ${(1370 - VH - 70) / 2}px; width: ${VW}px; border-radius: 22px; overflow: hidden; background: #181320; border: 2px solid ${a(CREMA, 0.28)}; box-shadow: 0 50px 120px rgba(2,0,6,0.85), 0 0 80px ${a(ARENA, 0.25)};">
        <div style="height: 70px; background: #231C30; display: flex; align-items: center; gap: 14px; padding: 0 26px; box-sizing: border-box;">
          <span style="width: 18px; height: 18px; border-radius: 50%; background: #FF5F57;"></span><span style="width: 18px; height: 18px; border-radius: 50%; background: #FEBC2E;"></span><span style="width: 18px; height: 18px; border-radius: 50%; background: #28C840;"></span>
          <span style="margin-left: 22px; flex: 1; height: 36px; border-radius: 18px; background: #14101C;"></span>
        </div>
        <div data-captura style="position: relative; width: ${VW}px; height: ${VH}px; overflow: hidden; background: ${GRIS};">
          ${HAY_YT
    ? `<img data-img src="assets/aatreus-youtube.png" alt="Captura del canal de YouTube de Aatreus" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; display: block;">`
    : `<div style="position: absolute; inset: 0; background: repeating-linear-gradient(45deg, ${GRIS}, ${GRIS} 40px, #332B45 40px, #332B45 80px);"></div>`}
        </div>
      </div>`)}`));

// ── 9 · ksante-nazumah ───────────────────────────────────────────────────
// El splash base entero, con una panorámica lenta de K'Sante a las torres.
slides.push(lamina('ksante-nazumah', 'El lore de K\'Sante es de telenovela: Nazumah es una ciudad libre al sur de Shurima.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.4)}
    ${ambiente(30, 40)}
    ${dunas(99, { op: 0.26 })}
    ${granos(909, 16)}
    ${panel(arte('splash/KSante_0.jpg', "K'Sante y las torres de Nazumah, splash base", { y: 280, alto: 810, pos: '45% 50%' }))}`));

// ── 10 · ksante-tope ─────────────────────────────────────────────────────
// No hay arte oficial de Tope: dos siluetas de línea, espalda con espalda
// (K'Sante a los golpes y Tope a distancia), y al final todo se cierra en un
// corazón. Plan B: el splash HEARTSTEEL (`KSante_8.jpg`).
const figKS = [
  `M395 440 m-44 0 a44 44 0 1 0 88 0 a44 44 0 1 0 -88 0`,           // cabeza
  `M395 484 L395 720`,                                              // torso
  `M395 720 L335 920`, `M395 720 L458 920`,                         // piernas
  `M395 540 L300 600 L250 620`,                                     // brazo del golpe
  `M395 540 L470 600 L440 670`,                                     // brazo atrás
  `M250 620 m-78 0 a78 78 0 1 0 156 0 a78 78 0 1 0 -156 0`,         // ntofo (el puño enorme)
];
const figTP = [
  `M690 450 m-38 0 a38 38 0 1 0 76 0 a38 38 0 1 0 -76 0`,           // cabeza
  `M690 488 L690 712`,                                              // torso
  `M690 712 L638 910`, `M690 712 L745 910`,                         // piernas
  `M690 540 L790 585 L840 585`,                                     // brazo que sostiene el arco
  `M690 540 L740 600 L715 610`,                                     // brazo que jala la cuerda
  `M850 380 C1010 480 1010 690 850 790`,                            // el arco
  `M850 380 L720 585 L850 790`,                                     // la cuerda
];
const CORAZON = 'M540 880 C250 650 330 390 540 530 C750 390 830 650 540 880 Z';
slides.push(lamina('ksante-tope', 'Su mejor amigo era Tope: K\'Sante a los golpes y Tope a distancia, hasta que se dieron su primer beso.', `
    ${borroso('splash/KSante_8-fondo.jpg', 0.32)}
    ${ambiente(50, 45, ARENA, 0.2)}
    ${dunas(110, { op: 0.24 })}
    ${granos(1010, 12)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g data-figuras>
          <g data-ks>${figKS.map((d) => trazo(d, { w: 10 })).join('')}</g>
          <g data-tp>${figTP.map((d) => trazo(d, { w: 10, col: ARENA })).join('')}</g>
        </g>
        ${trazo(CORAZON, { col: '#FF8FB0', w: 14, attrs: 'data-corazon' })}
      </svg>`)}`));

// ── 11 · ksante-reyes ────────────────────────────────────────────────────
// Azir y Xerath arrasan Shurima: cada uno entra desde su lado y un tajo de
// arena los separa.
slides.push(lamina('ksante-reyes', 'Pero Azir y Xerath arrasaron Shurima.', `
    ${borroso('splash/Azir_0-fondo.jpg', 0.36)}
    ${ambiente(50, 45)}
    ${dunas(121, { op: 0.28 })}
    ${granos(1111, 20)}
    ${panel(`
      <div data-rey="azir" style="position: absolute; left: 40px; top: 160px; width: 490px; height: 1040px; border-radius: 24px; overflow: hidden; border: 3px solid ${ARENA_CL}; box-shadow: 0 0 80px ${a(ARENA, 0.4)}, 0 40px 90px rgba(4,2,10,0.8);">
        <img data-img src="assets/splash/Azir_0.jpg" alt="Azir, splash base" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block;">
      </div>
      <div data-rey="xerath" style="position: absolute; left: 550px; top: 160px; width: 490px; height: 1040px; border-radius: 24px; overflow: hidden; border: 3px solid #58B9FF; box-shadow: 0 0 80px ${a('#58B9FF', 0.4)}, 0 40px 90px rgba(4,2,10,0.8);">
        <img data-img src="assets/splash/Xerath_0.jpg" alt="Xerath, splash base" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block;">
      </div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <path data-tajo d="M640 90 L440 1280" fill="none" stroke="${ARENA_CL}" stroke-width="26" stroke-linecap="round" style="filter: drop-shadow(0 0 22px ${ARENA}) drop-shadow(0 0 60px ${ARENA});"/>
      </svg>
      <div data-flash style="position: absolute; inset: 0; background: ${CREMA}; mix-blend-mode: screen; opacity: 0; pointer-events: none;"></div>`)}`));

// ── 12 · ksante-bestia ───────────────────────────────────────────────────
// La cobra león: una coraza de placas que se rompen y se regeneran, con dos
// siluetas que huyen. Plan B: el splash Empíreo con las llamas de neón.
const CZ = { cx: 540, cy: 560, rx: 440, ry: 340 };
const huyen = (x, y, esc, atrasada) => `<g data-huye transform="translate(${x} ${y}) scale(${esc})">${[
  `M0 -80 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0`, `M0 -58 L-20 30`, `M-20 30 L-60 100`, `M-20 30 L20 100`, `M-8 -34 L-50 -4`, `M-8 -34 L36 -10`,
].map((d) => trazo(d, { w: 9 / esc, col: atrasada ? ARENA : ARENA_CL, attrs: '' })).join('')}</g>`;
slides.push(lamina('ksante-bestia', 'Soltaron una cobra león gigante con una coraza que se regeneraba, y K\'Sante y Tope intentaron matarla una y otra vez, y no pudieron.', `
    ${borroso('splash/KSante_1-fondo.jpg', 0.34)}
    ${ambiente(50, 40, MAGENTA, 0.12)}
    ${dunas(132, { op: 0.24 })}
    ${granos(1212, 14)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g data-melenas>${melena(CZ)}</g>
        <g data-coraza>${coraza({ ...CZ, semilla: 7 })}</g>
        <g data-huyen>${huyen(300, 1150, 0.9, false)}${huyen(470, 1165, 0.8, true)}
          ${trazo('M60 1230 L200 1230', { w: 6, op: 0.5, attrs: 'data-polvo' })}${trazo('M90 1180 L210 1180', { w: 5, op: 0.4, attrs: 'data-polvo' })}</g>
      </svg>`)}`));

// ── 13 · ksante-diario ───────────────────────────────────────────────────
// Un cuaderno abierto a líneas: las hojas se llenan de garabatos y tachaduras
// (nada legible) y en una página aparece el símbolo de la cobra león.
function garabatos({ x, y, w, filas, paso, semilla, tachar = [] }) {
  const r = prng(semilla);
  let h = '';
  for (let f = 0; f < filas; f++) {
    const yy = y + f * paso, largo = w * (0.55 + r() * 0.45);
    let d = `M${x} ${yy}`;
    for (let px = x; px < x + largo; px += 18) d += ` Q${px + 9} ${(yy - 12 - r() * 12).toFixed(1)} ${px + 18} ${(yy + (r() - 0.5) * 8).toFixed(1)}`;
    h += trazo(d, { col: CREMA, w: 4, op: 0.7, attrs: 'data-garabato' });
    if (tachar.includes(f)) h += trazo(`M${x - 8} ${yy - 8} L${x + largo + 8} ${yy - 14}`, { col: ROJO, w: 7, attrs: 'data-tacha' });
  }
  return h;
}
function simbolo(cx, cy) {
  let rayos = '';
  for (let i = 0; i < 14; i++) { const t = Math.PI * 2 * i / 14, r0 = 96, r1 = i % 2 ? 140 : 168; rayos += `M${(cx + r0 * Math.cos(t)).toFixed(1)} ${(cy + r0 * Math.sin(t)).toFixed(1)} L${(cx + r1 * Math.cos(t)).toFixed(1)} ${(cy + r1 * Math.sin(t)).toFixed(1)} `; }
  return [
    trazo(rayos.trim(), { col: ARENA, w: 7, attrs: 'data-simbolo' }),
    trazo(`M${cx - 96} ${cy} a96 96 0 1 0 192 0 a96 96 0 1 0 -192 0`, { col: ARENA_CL, w: 8, attrs: 'data-simbolo' }),
    trazo(`M${cx - 50} ${cy - 24} l24 -10 M${cx + 50} ${cy - 24} l-24 -10`, { col: ARENA_CL, w: 8, attrs: 'data-simbolo' }),
    trazo(`M${cx} ${cy - 6} L${cx} ${cy + 36} M${cx - 28} ${cy + 52} Q${cx} ${cy + 78} ${cx + 28} ${cy + 52}`, { col: ARENA_CL, w: 8, attrs: 'data-simbolo' }),
  ].join('');
}
const pagina = (x) => `<rect x="${x}" y="200" width="440" height="1010" rx="20" fill="${a('#1A1426', 0.96)}" stroke="${ARENA_CL}" stroke-width="6" stroke-opacity="0.8"/>`;
slides.push(lamina('ksante-diario', 'Su tía le dio el diario de Tope, donde había anotado los errores de K\'Sante.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.26)}
    ${ambiente(50, 45)}
    ${dunas(143, { op: 0.2 })}
    ${granos(1313, 12)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; filter: drop-shadow(0 40px 60px rgba(2,0,6,0.8));">
        <g data-cuaderno>${pagina(80)}${pagina(560)}${trazo('M540 200 L540 1210', { w: 5, op: 0.6, attrs: '' })}</g>
        <g data-izq>${garabatos({ x: 125, y: 290, w: 350, filas: 15, paso: 62, semilla: 4 })}</g>
        <g data-pag-b>
          <rect x="560" y="200" width="440" height="1010" rx="20" fill="${a('#1A1426', 0.98)}"/>
          ${simbolo(780, 560)}
          ${garabatos({ x: 605, y: 860, w: 350, filas: 5, paso: 62, semilla: 12 })}
        </g>
        <g data-pag-a style="transform-box: fill-box; transform-origin: 0% 50%;">
          <rect x="560" y="200" width="440" height="1010" rx="20" fill="${a('#1A1426', 1)}" stroke="${ARENA_CL}" stroke-width="6" stroke-opacity="0.8"/>
          ${garabatos({ x: 605, y: 290, w: 350, filas: 15, paso: 62, semilla: 9, tachar: [2, 5, 8, 11, 13] })}
        </g>
      </svg>`)}`));

// ── 14 · ksante-cascada ──────────────────────────────────────────────────
// Una cascada de trazos azules cae sobre la coraza de la bestia y la agrieta.
// Plan B (no hizo falta): la coraza agrietándose sin cascada.
const CZ2 = { cx: 540, cy: 930, rx: 440, ry: 300 };
const rn = prng(77);
const grietas = Array.from({ length: 9 }, (_, i) => {
  const t = Math.PI * (1.05 + i * 0.113), x1 = CZ2.cx + 400 * Math.cos(t), y1 = CZ2.cy + 280 * Math.sin(t);
  let d = `M540 700`, px = 540, py = 700;
  for (let k = 1; k <= 5; k++) { px += (x1 - 540) / 5 + (rn() - 0.5) * 60; py += (y1 - 700) / 5 + (rn() - 0.3) * 40; d += ` L${px.toFixed(1)} ${py.toFixed(1)}`; }
  return trazo(d, { col: '#FFFFFF', w: 7, attrs: 'data-grieta' });
}).join('');
const agua = Array.from({ length: 11 }, (_, i) => {
  const x = 440 + i * 20, ondu = (i % 2 ? 14 : -14);
  return trazo(`M${x} -10 C${x + ondu} 160 ${x - ondu} 340 ${x + ondu / 2} 700`, { col: AGUA, w: 12 - (i % 3) * 2, attrs: 'data-agua' });
}).join('');
slides.push(lamina('ksante-cascada', 'Mató a la bestia contra una cascada, y con pedazos de su coraza reforjó sus armas.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.3)}
    ${ambiente(50, 20, AGUA, 0.18)}
    ${dunas(154, { op: 0.2 })}
    ${granos(1414, 10)}
    ${panel(`
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g data-melenas>${melena(CZ2)}</g>
        <g data-coraza>${coraza({ ...CZ2, r: 58, semilla: 7 })}</g>
        ${grietas}
        ${agua}
        ${Array.from({ length: 12 }, (_, i) => `<circle data-gota cx="${470 + (i * 53) % 220}" cy="${690 + (i % 3) * 14}" r="${6 + (i % 4) * 2}" fill="${AGUA}" opacity="0"/>`).join('')}
      </svg>`)}`));

// ── 15 · ksante-orgullo ──────────────────────────────────────────────────
slides.push(lamina('ksante-orgullo', 'No hay monstruo más grande que el orgullo, y aquí los equipos del Mundial lo siguen sacando bien orgullosos.', `
    ${borroso('splash/KSante_0-fondo.jpg', 0.3)}
    ${ambiente(50, 15)}
    ${dunas(165, { op: 0.22 })}
    ${granos(1515, 12)}
    ${panel(`
      <div data-numero style="position: absolute; left: 0; right: 0; top: 10px; text-align: center; font-size: 270px; line-height: 1;"><span class="victoria">6</span><span class="arena">-</span><span class="derrota">13</span></div>
      ${rejilla({ ...REJ_B, estado: (i) => RESULTADOS[i] })}`)}`));

// ── 16 · ksante-skins ────────────────────────────────────────────────────
// Bento de las 4 pantallas de carga; HEARTSTEEL Live My Life va grande y crece
// al final.
const TILES = [
  [18, { x: 30, y: 270, w: 520, h: 945 }, 'grande'],
  [1, { x: 570, y: 270, w: 480, h: 305 }],
  [2, { x: 570, y: 595, w: 480, h: 305 }],
  [8, { x: 570, y: 920, w: 480, h: 295 }],
];
slides.push(lamina('ksante-skins', 'Y de skins tiene cuatro.', `
    ${borroso('splash/KSante_1-fondo.jpg', 0.36)}
    ${ambiente(50, 10, MAGENTA, 0.18)}
    ${dunas(176, { op: 0.22, c1: MAGENTA, c2: VERDE })}
    ${granos(1616, 12, VERDE)}
    ${panel(`
      <div data-cuatro-skins class="arena" style="position: absolute; left: 0; right: 0; top: 10px; text-align: center; font-size: 250px; line-height: 1;">4</div>
      ${TILES.map(([n, r, tipo]) => `<div data-casilla ${tipo ? 'data-grande' : ''} style="position: absolute; left: ${r.x}px; top: ${r.y}px; width: ${r.w}px; height: ${r.h}px; border-radius: 16px; overflow: hidden; border: 3px solid ${tipo ? VERDE : a(CREMA, 0.3)}; box-sizing: border-box; box-shadow: ${tipo ? `0 0 50px ${a(VERDE, 0.55)}` : '0 12px 30px rgba(0,0,0,0.55)'};">
        <img src="assets/skins/KSante_${n}.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% ${tipo ? 14 : 10}%; display: block;">
      </div>`).join('\n      ')}`)}`));

// ── 17 · ksante-nerf ─────────────────────────────────────────────────────
// El mismo día: la skin Live My Life y un calendario que marca el 7 de octubre
// con el parche.
slides.push(lamina('ksante-nerf', 'La más nueva salió el siete de octubre, el mismo día que Riot lo nerfeó para el Mundial.', `
    ${borroso('splash/KSante_18-fondo.jpg', 0.42)}
    ${ambiente(50, 30, '#FFC93C', 0.2)}
    ${dunas(187, { op: 0.22 })}
    ${granos(1717, 14)}
    ${panel(`
      ${arte('splash/KSante_18.jpg', "K'Sante HEARTSTEEL Live My Life, splash", { y: 30, alto: 670, pos: '34% 40%' })}
      <div data-calendario style="position: absolute; left: 90px; top: 740px; width: 470px; height: 540px; border-radius: 30px; overflow: hidden; background: ${CREMA}; box-shadow: 0 40px 90px rgba(2,0,6,0.85), 0 0 60px ${a(ARENA, 0.35)};">
        <div style="height: 150px; background: linear-gradient(180deg, ${ROJO}, #B02A33); display: flex; align-items: center; justify-content: center; font-size: 120px; letter-spacing: 8px; color: ${CREMA}; padding-left: 8px;">OCT</div>
        <div style="height: 390px; display: flex; align-items: center; justify-content: center; font-size: 360px; line-height: 1; color: #1A1426;">7</div>
        <span style="position: absolute; left: 80px; top: -26px; width: 26px; height: 70px; border-radius: 13px; background: #2A2338; box-shadow: 0 0 0 4px ${CREMA};"></span>
        <span style="position: absolute; right: 80px; top: -26px; width: 26px; height: 70px; border-radius: 13px; background: #2A2338; box-shadow: 0 0 0 4px ${CREMA};"></span>
      </div>
      <div data-parche style="position: absolute; left: 600px; top: 860px; width: 400px; height: 300px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 400 300" width="400" height="300" style="position: absolute; inset: 0; overflow: visible;"><polygon points="${hex(200, 150, 142)}" fill="${a(BG, 0.92)}" stroke="${VERDE}" stroke-width="7" stroke-linejoin="round" style="filter: drop-shadow(0 0 30px ${a(VERDE, 0.7)});"/></svg>
        <span class="victoria" style="position: relative; font-size: 150px; line-height: 1; letter-spacing: 3px;">26.20</span>
      </div>`)}`));

// ── 18 · ksante-cierre ───────────────────────────────────────────────────
slides.push(lamina('ksante-cierre', 'Ni pedo, solo queda decir gigi easy. Tírenme un follow.', `
    ${borroso('splash/KSante_1-fondo.jpg', 0.4)}
    ${ambiente(50, 45, MAGENTA, 0.22)}
    ${dunas(198, { op: 0.3, c1: MAGENTA, c2: VERDE })}
    ${granos(1818, 16, VERDE)}
    ${panel(`
      ${arte('splash/KSante_1.jpg', "K'Sante Empíreo, splash", { y: 0, alto: 1240, pos: '50% 30%', marco: false })}
      <div data-velo style="position: absolute; left: 0; top: 720px; width: 1080px; height: 650px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, 0.9)} 70%); pointer-events: none;"></div>
      <div data-ggez style="position: absolute; left: 0; right: 0; top: 940px; text-align: center; font-size: 340px; line-height: 1; transform: rotate(-4deg);"><span class="cierre">GG EZ</span></div>`)}`));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Las dunas derivan, los granos suben y el fondo respira.
  function ambiente(tl, s, dur) {
    q(s, '[data-dunas]').forEach(function (o) { tl.fromTo(o, { x: 0 }, { x: -1080, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-brasa]').forEach(function (m, i) {
      tl.fromTo(m, { y: 40 + (i % 5) * 14, opacity: 0 }, { y: -80 - (i % 7) * 16, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
    q(s, '[data-borroso]').forEach(function (b) { tl.fromTo(b, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'power1.out' }, 0); });
  }
  function entra(tl, s, dur, origen) {
    tl.from(uno(s, '[data-arte]'), { y: 60, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.18, transformOrigin: origen || '50% 40%', duration: dur || 3.4, ease: 'power2.out' }, 0);
  }
  var GRIS = 'rgba(139,127,163,0.3)', GRIS_B = 'rgba(139,127,163,0.55)';

  animar('ksante-portada', function (tl, s) {
    ambiente(tl, s, 3.4);
    efecto('contador', tl, uno(s, '[data-cuatro]'), { cuenta: 4, dur: 1.0, en: 0.2 });
    tl.from(uno(s, '[data-cuatro]'), { scale: 0.8, opacity: 0.25, duration: 1.3, ease: 'power3.out' }, 0.2)
      .from(uno(s, '[data-carta]'), { y: 130, opacity: 0, scale: 0.9, duration: 0.9 }, 0.3)
      .from(uno(s, '[data-carta] [data-img]'), { scale: 1.2, duration: 3, ease: 'power2.out' }, 0.3)
      .from(q(s, '[data-letra]'), { yPercent: 110, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'back.out(1.6)' }, 1.0);
  });

  // La pasiva y las cuatro habilidades se encienden una por una.
  animar('ksante-kit', function (tl, s) {
    ambiente(tl, s, 4.2);
    var todos = [uno(s, '[data-icono-p]')].concat(Array.prototype.slice.call(q(s, '[data-icono-h]')));
    var lineas = q(s, '[data-linea-icono]');
    todos.forEach(function (ic, i) {
      var t = 0.2 + i * 0.6;
      tl.from(ic, { scale: 0.3, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, t)
        .fromTo(ic, { boxShadow: '0 0 0px rgba(217,164,65,0)' }, { boxShadow: '0 0 90px rgba(242,204,119,0.95)', duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, t + 0.3);
      if (i > 0) tl.from(lineas[i - 1], { drawSVG: '0%', duration: 0.5 }, t - 0.1);
    });
    q(s, '[data-anillo]').forEach(function (r, i) {
      tl.fromTo(r, { scale: 0.4, opacity: 0.9, svgOrigin: '540 440' }, { scale: 1.9, opacity: 0, svgOrigin: '540 440', duration: 1.3, ease: 'power2.out', immediateRender: false }, 0.2 + i * 0.4);
    });
  });

  // La rejilla es la misma en 19, playin y suiza (data-continua).
  animar('ksante-19', function (tl, s) {
    ambiente(tl, s, 3.8);
    efecto('contador', tl, uno(s, '[data-numero]'), { cuenta: 19, dur: 1.4, en: 0.2 });
    tl.from(uno(s, '[data-numero]'), { scale: 0.7, opacity: 0.2, duration: 0.8, ease: 'back.out(1.6)' }, 0.2)
      .from(q(s, '[data-celda]'), { y: -260, opacity: 0, scale: 0.7, duration: 0.45, stagger: 0.07, ease: 'power3.out' }, 0.2);
  });

  animar('ksante-playin', function (tl, s) {
    if (window.continua) continua(tl, s);
    ambiente(tl, s, 3.4);
    var c = q(s, '[data-celda]');
    tl.from(uno(s, '[data-numero]'), { scale: 1.8, opacity: 0, duration: 0.5, ease: 'power4.in' }, 1.7);
    for (var i = 0; i < 5; i++) {
      tl.from(c[i], { backgroundImage: 'none', backgroundColor: GRIS, borderColor: GRIS_B, boxShadow: 'none', duration: 0.1 }, 0.3 + i * 0.28)
        .fromTo(c[i], { scale: 1.45 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)', immediateRender: false }, 0.3 + i * 0.28);
    }
    for (var j = 5; j < c.length; j++) tl.from(c[j], { opacity: 1, duration: 0.5 }, 1.6);
  });

  animar('ksante-suiza', function (tl, s) {
    if (window.continua) continua(tl, s);
    ambiente(tl, s, 4.4);
    var c = q(s, '[data-celda]');
    for (var i = 5; i < c.length; i++) {
      var t = 0.2 + (i - 5) * 0.2, win = c[i].style.borderColor.indexOf('124') >= 0;
      tl.from(c[i], { opacity: 0.3, backgroundImage: 'none', backgroundColor: GRIS, borderColor: GRIS_B, boxShadow: 'none', duration: 0.12 }, t)
        .fromTo(c[i], { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(2.2)', immediateRender: false }, t);
    }
    tl.from(uno(s, '[data-numero]'), { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power4.in' }, 3.0);
  });

  animar('ksante-otp', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0)
      .fromTo(uno(s, '[data-arte] [data-img]'), { scale: 1 }, { scale: 1.25, transformOrigin: '60% 40%', duration: 3.6, ease: 'power2.out', immediateRender: true }, 0)
      .from(uno(s, '[data-pastilla]'), { xPercent: -110, duration: 0.7, ease: 'power3.out' }, 0.45)
      .from(uno(s, '[data-nombre-otp]'), { opacity: 0, letterSpacing: '60px', duration: 0.8, ease: 'power3.out' }, 0.8);
    efecto('contador', tl, uno(s, '[data-puntos]'), { cuenta: 4863453, separador: '.', dur: 1.6, en: 1.2 });
    tl.from(uno(s, '[data-puntos]'), { y: 30, opacity: 0, duration: 0.5 }, 1.2)
      .from(uno(s, '[data-halo]'), { scale: 0.3, opacity: 0, duration: 0.9 }, 2.4)
      .from(uno(s, '[data-emblema]'), { y: -300, rotation: -25, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 2.4);
  });

  // El emblema de Gran Maestro viaja arriba (continua) y se vuelve Challenger.
  animar('ksante-challenger', function (tl, s) {
    if (window.continua) continua(tl, s);
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-arte]'), { opacity: 0.0, duration: 0.2 }, 0);
    efecto('contador', tl, uno(s, '[data-lp]'), { cuenta: 1885, desde: 1638, separador: '.', sufijo: ' LP', dur: 1.8, en: 0.8 });
    tl.from(uno(s, '[data-lp]'), { opacity: 0, y: 24, duration: 0.5 }, 0.8)
      .from(uno(s, '[data-halo]'), { opacity: 0, scale: 0.4, duration: 0.8 }, 1.8)
      .fromTo(uno(s, '[data-emblema-ch]'), { opacity: 0, scale: 0.7, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2)', immediateRender: true }, 1.9)
      .to(uno(s, '[data-emblema-gm]'), { opacity: 0, scale: 1.2, duration: 0.5 }, 1.9)
      .fromTo(uno(s, '[data-emblema-ch]'), { filter: 'brightness(2.6) drop-shadow(0 0 80px #FFB45A)' }, { filter: 'brightness(1) drop-shadow(0 0 46px rgba(255,180,90,0.7)) drop-shadow(0 20px 34px rgba(0,0,0,0.6))', duration: 0.9, immediateRender: false }, 1.9);
  });

  animar('ksante-youtube', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-ventana]'), { y: 700, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1);
    var im = uno(s, '[data-captura] [data-img]');
    if (im) tl.fromTo(im, { scale: 1, transformOrigin: '10% 22%' }, { scale: 1.9, transformOrigin: '10% 22%', duration: 2.4, ease: 'power2.inOut', immediateRender: true }, 1.4);
  });

  animar('ksante-nazumah', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-arte]'), { y: 50, opacity: 0, duration: 0.8 }, 0);
    efecto('camara', tl, uno(s, '[data-arte]'), { focos: '55 45 1.05; 12 30 1.8', en: 0.7, dur: 2.8, pausa: 0.2 });
  });

  // Tope: dos siluetas de línea que pelean espalda con espalda y se vuelven un corazón.
  animar('ksante-tope', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(q(s, '[data-ks] [data-hilo]'), { drawSVG: '0%', duration: 0.9, stagger: 0.1, ease: 'power1.out' }, 0.2)
      .from(q(s, '[data-tp] [data-hilo]'), { drawSVG: '0%', duration: 0.9, stagger: 0.1, ease: 'power1.out' }, 0.4)
      .to(uno(s, '[data-ks]'), { x: -16, duration: 0.18, yoyo: true, repeat: 3, ease: 'power2.inOut' }, 1.6)
      .to(uno(s, '[data-tp]'), { x: 16, duration: 0.18, yoyo: true, repeat: 3, ease: 'power2.inOut' }, 1.6)
      .to(uno(s, '[data-figuras]'), { opacity: 0.12, duration: 0.8, ease: 'power1.in' }, 2.5)
      .from(uno(s, '[data-corazon]'), { drawSVG: '0%', duration: 1.2, ease: 'power2.inOut' }, 2.5)
      .fromTo(uno(s, '[data-corazon]'), { scale: 1, svgOrigin: '540 660' }, { scale: 1.07, svgOrigin: '540 660', duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, 3.7);
  });

  animar('ksante-reyes', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-rey="azir"]'), { x: -620, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
      .from(uno(s, '[data-rey="xerath"]'), { x: 620, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
      .from(q(s, '[data-rey] [data-img]'), { scale: 1.25, duration: 3.2, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-tajo]'), { drawSVG: '0%', duration: 0.25, ease: 'power4.in' }, 1.1)
      .fromTo(uno(s, '[data-flash]'), { opacity: 0 }, { opacity: 0.8, duration: 0.06 }, 1.33)
      .to(uno(s, '[data-flash]'), { opacity: 0, duration: 0.5 }, 1.4)
      .to(uno(s, '[data-rey="azir"]'), { x: -26, rotation: -1.2, duration: 0.4, ease: 'power3.out' }, 1.33)
      .to(uno(s, '[data-rey="xerath"]'), { x: 26, rotation: 1.2, duration: 0.4, ease: 'power3.out' }, 1.33);
  });

  // La coraza se arma, se rompen placas y se regeneran; dos siluetas huyen.
  animar('ksante-bestia', function (tl, s) {
    ambiente(tl, s, 4.6);
    var p = q(s, '[data-placa]');
    tl.from(q(s, '[data-melena]'), { drawSVG: '0%', duration: 0.5, stagger: 0.02 }, 0.2)
      .from(p, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: { each: 0.012, from: 'center' }, ease: 'back.out(1.8)' }, 0.2);
    var rotas = [3, 9, 14, 20, 26, 31, 37, 42];
    rotas.forEach(function (k, i) {
      var pl = p[k % p.length], t = 1.5 + i * 0.28;
      tl.to(pl, { y: 260, rotation: 40 + i * 12, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.in' }, t)
        .fromTo(pl, { y: 0, rotation: 0, scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.4)', transformOrigin: '50% 50%', immediateRender: false }, t + 0.7);
    });
    tl.from(uno(s, '[data-huyen]'), { x: -140, opacity: 0, duration: 0.8 }, 0.6)
      .to(uno(s, '[data-huyen]'), { x: 540, duration: 3.6, ease: 'power1.in' }, 1.2)
      .fromTo(q(s, '[data-polvo]'), { opacity: 0 }, { opacity: 0.6, duration: 0.3, stagger: 0.2 }, 1.2);
  });

  // El diario: la hoja izquierda se llena de garabatos, la derecha de tachaduras
  // y, al pasar la hoja, aparece el símbolo de la cobra león.
  animar('ksante-diario', function (tl, s) {
    ambiente(tl, s, 5.0);
    tl.from(uno(s, '[data-cuaderno]'), { opacity: 0, y: 60, duration: 0.7 }, 0)
      .from(q(s, '[data-izq] [data-garabato]'), { drawSVG: '0%', duration: 0.35, stagger: 0.07 }, 0.5)
      .from(q(s, '[data-pag-a] [data-garabato]'), { drawSVG: '0%', duration: 0.35, stagger: 0.07 }, 1.0)
      .from(q(s, '[data-pag-a] [data-tacha]'), { drawSVG: '0%', duration: 0.25, stagger: 0.2, ease: 'power3.in' }, 2.1)
      .to(uno(s, '[data-pag-a]'), { scaleX: 0, duration: 0.7, ease: 'power2.inOut', svgOrigin: '560 700' }, 3.2)
      .from(q(s, '[data-pag-b] [data-simbolo]'), { drawSVG: '0%', duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 3.8)
      .from(q(s, '[data-pag-b] [data-garabato]'), { drawSVG: '0%', duration: 0.3, stagger: 0.08 }, 4.2);
  });

  // La cascada cae sobre la coraza y la agrieta hasta que se rompe.
  animar('ksante-cascada', function (tl, s) {
    ambiente(tl, s, 4.4);
    var p = q(s, '[data-placa]');
    tl.from(q(s, '[data-melena]'), { drawSVG: '0%', duration: 0.4, stagger: 0.02 }, 0)
      .from(p, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: { each: 0.01, from: 'center' }, ease: 'back.out(1.6)' }, 0)
      .from(q(s, '[data-agua]'), { drawSVG: '0%', duration: 0.9, stagger: 0.05, ease: 'power1.in' }, 0.8)
      .fromTo(q(s, '[data-gota]'), { opacity: 1, y: 0 }, { opacity: 0, y: -120, duration: 0.6, stagger: 0.05, ease: 'power2.out', immediateRender: false }, 1.6)
      .from(q(s, '[data-grieta]'), { drawSVG: '0%', duration: 0.5, stagger: 0.12, ease: 'power3.out' }, 1.8);
    q(s, '[data-placa]').forEach(function (pl, i) {
      if (i % 4 === 0) tl.to(pl, { y: 180 + (i % 7) * 30, rotation: 30 + (i % 5) * 14, opacity: 0.15, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.in' }, 2.9 + (i % 9) * 0.1);
    });
  });

  // La rejilla vuelve ya pintada (no puede continuar de suiza: hay lore en medio).
  animar('ksante-orgullo', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.from(q(s, '[data-celda]'), { scale: 0.2, opacity: 0, duration: 0.3, stagger: 0.06, ease: 'back.out(2)' }, 0.15)
      .from(uno(s, '[data-numero]'), { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.9);
  });

  animar('ksante-skins', function (tl, s) {
    ambiente(tl, s, 3.8);
    efecto('contador', tl, uno(s, '[data-cuatro-skins]'), { cuenta: 4, dur: 0.7, en: 0.1 });
    tl.from(uno(s, '[data-cuatro-skins]'), { scale: 0.5, opacity: 0.2, duration: 0.7, ease: 'back.out(1.8)' }, 0.1)
      .fromTo(q(s, '[data-casilla]'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.12 }, 0.2)
      .to(uno(s, '[data-grande]'), { scale: 1.04, duration: 0.5, ease: 'power2.inOut' }, 2.2);
  });

  animar('ksante-nerf', function (tl, s) {
    ambiente(tl, s, 3.6);
    entra(tl, s, 3.4, '34% 40%');
    tl.from(uno(s, '[data-calendario]'), { y: -800, rotation: -8, opacity: 0, duration: 0.7, ease: 'bounce.out' }, 0.9)
      ;
    efecto('sello', tl, uno(s, '[data-parche]'), { en: 1.6, desde: 2.4, fuerza: 12, temblor: 'no' });
  });

  animar('ksante-cierre', function (tl, s) {
    ambiente(tl, s, 3.4);
    tl.from(uno(s, '[data-arte]'), { y: 40, opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-arte] [data-img]'), { scale: 1.16, transformOrigin: '50% 30%', duration: 3.2, ease: 'power2.out' }, 0)
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
<title>K'Sante cumple 4 años</title>
${kit.og({ titulo: "K'Sante cumple 4 años", descripcion: "Cumplelolero #29: el pick maldito del Mundial (6-13 en 19 picks), el OTP número uno de Norteamérica, el lore de telenovela y la skin que salió el día del nerf.", carpeta: 'creator/ksante' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .arena { background: linear-gradient(180deg, #FFF8E4 0%, ${ARENA_CL} 36%, ${ARENA} 68%, #8A5F18 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 28px ${a(ARENA, 0.45)}); }
  .victoria { background: linear-gradient(180deg, #F2FFE8 0%, ${VERDE} 55%, #2FA82A 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(VERDE, 0.5)}); }
  .derrota { background: linear-gradient(180deg, #FFE3E4 0%, ${ROJO} 55%, #8A1D24 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(ROJO, 0.45)}); }
  .cierre { background: linear-gradient(180deg, #FFFFFF 0%, ${CREMA} 36%, ${VERDE} 74%, ${MAGENTA} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 30px rgba(4,2,10,0.95)); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(ARENA, 0.5)}; border-radius: 999px;
    background: rgba(15,10,24,0.85); color: ${ARENA_CL}; cursor: pointer;
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
console.log(`index.html generado: ${slides.length} diapositivas${HAY_YT ? '' : ' (sin captura de YouTube: marcador)'}`);
