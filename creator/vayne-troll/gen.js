// Generador de index.html — «¿La Vayne de Doran fue troll?» (canal Axelsine, 9/11/2026)
// Ejecutar: node creator/vayne-troll/gen.js   ·   clips: node tools/laminas.mjs creator/vayne-troll
//
// 22 láminas para el montaje automático con el formato de la primera versión de t1-blg (commit
// 1a86ba7) y de ambessa (e438ec3), que es lo que pidió Axl el 9/11: panel de 1080×1370
// (`crop=1080:1370:0:275`) que el montaje reduce a 706×896 debajo del gameplay, y la regla de
// ambessa:
//   · **solo arte oficial**: splashes, pantallas de carga y tiles de Data Dragon, logos de
//     lolesports; la imagen es la protagonista, a pantalla completa o casi;
//   · **la única animación es de cámara** (empuje, paneo o fundido corto, 2,8 s como máximo);
//     nada entra por piezas, ni la cuadrícula de los siete tops;
//   · **no se dibuja nada** (ni SVG, ni partículas, ni barras, ni chips, ni tachones, ni marcos);
//   · **el único texto es el dato de la tabla**; las groserías, las citas y los nombres de
//     jugadores no van en pantalla.
// Ninguna lámina arranca en negro: el fondo (la copia desenfocada del arte) se ve desde el cuadro 0.
//
// Paleta: negro `#0B0B0E`; **las cifras malas para Doran o T1 en el rojo de T1 `#E4002B`**
// (6 DE 7, 0-2, −607 · −681 · −938, −1 466, −3 692) y **todo lo demás en blanco** (lo que
// favorece el pick —48, 4-1, 6-1, 7-1— y lo neutro: VAYNE TOP, ADC, 26.17 · 26.20, 0, 2,
// NO FUE TROLL, 16/11, 30, CHAO).
//
// **Los clips** del guion ({clip:…}) no son láminas: están en `clips.json` y `laminas.mjs` los
// copia a video-out/laminas/ y los pone en el manifest tras su lámina, con tipo "clip".
//
// ⚠️ **Los siete tops de `vt-fearless` van con los tiles de Data Dragon** (380 px,
// `img/champion/tiles/<Campeón>_0.jpg`) y no con los íconos de 120 px, que a 230 px se verían
// blandos: es el mismo recorte cuadrado y oficial (el mismo cambio que en t1-blg).
// ⚠️ **Vayne_5 es «Vayne SKT T1»** y Vayne_3 «Vayne Matadragones» en es_MX (Data Dragon).
// ⚠️ Cuando una imagen se repite, va con otro recorte: Vayne_5 (portada, entera; cierre, cerrado),
// Vayne_0 (vt-48 entera; vt-oro en el rostro), Vayne_3 (desenfocada detrás de GEN; nítida en el
// veredicto), Renekton_0 (entero; su cabeza en la mitad de arriba; desenfocado detrás de TES), la
// pantalla de carga de Vayne_5 (entera; el rostro), Sion_14 (splash y pantalla de carga), los
// logos de T1 y BLG (lado a lado; uno arriba y otro abajo) y Ahri_86 (desenfocado; a sangre).
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#0B0B0E';
const ROJO = '#E4002B';
const BLANCO = '#F5F5F7';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 1370, PANEL_TOP = 275;

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${BLANCO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Copia desenfocada a sangre (fondo de la lámina; data-fondo para sacarla con alfa).
const borroso = (src, brillo = 0.4, pos = 'center') => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(46px) saturate(1.1) brightness(${brillo});"></div>
    </div>`;
// Una viñeta: el fondo nunca es plano.
const VINETA = `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(6,6,8,0.75) 100%);"></div>`;
const tinte = (color, fuerza = 0.16, donde = '50% 30%') => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(80% 45% at ${donde}, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px;">${contenido}
    </div>`;

function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return { x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0), y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0), z };
}

// Visor con una imagen oficial y la cámara en `cam`: [cx0, cy0, z0, cx1, cy1, z1] (centro 0–1 y zoom sobre `cover`).
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', attrs = '' }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Velo para que el dato se lea sobre el arte (sube desde abajo; no es un marco).
const velo = (alto = 620, fuerza = 0.92) => `
      <div style="position: absolute; left: 0; bottom: 0; width: ${PW}px; height: ${alto}px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, fuerza)} 72%); pointer-events: none;"></div>`;

const lamina = (id, notasOrador, cuerpo) => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}" style="${SECCION}">${cuerpo}
  </section>`;

// Texto: solo el dato. `rojo` para lo malo para Doran o T1; si no, blanco.
const dato = (txt, { tam, rojo = false, top, bottom, tracking = 8 }) => `
      <div data-dato style="position: absolute; left: 0; right: 0; ${top !== undefined ? `top: ${top}px;` : ''} ${bottom !== undefined ? `bottom: ${bottom}px;` : ''} text-align: center; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;"><span class="${rojo ? 'rojo' : 'blanco'}">${txt}</span></div>`;

const logo = (n, alt, { x, y, w }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; filter: drop-shadow(0 12px 40px rgba(0,0,0,0.85));">`;

const SP = { iw: 1215, ih: 717 };
const CARGA = { x: 163, w: 754, h: PH, iw: 308, ih: 560 };   // pantalla de carga vertical, centrada
const splash = (n) => `splash/${n}.jpg`;
const MENOS = '−';                 // el signo menos tipográfico, no el guion
const MIL = ' ';              // el espacio de miles sin corte de línea

const slides = [];

// ── 1 · vt-portada ─── Vayne SKT T1 entera ──
slides.push(lamina('vt-portada', 'Doran sacó Vayne top en la partida que eliminó al tricampeón.', `
    ${borroso('splash/Vayne_5-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash', { ...SP, cam: [0.66, 0.6, 1, 0.7, 0.56, 1.08] })}
      ${velo(600)}
      ${dato('VAYNE TOP', { tam: 260, bottom: 60, tracking: 14 })}`)}`));

// ── 2 · vt-urgot ─── Urgot Don Plomerone, paneo ──
slides.push(lamina('vt-urgot', 'Un pick troll: algo que eligen sin razón, como un Urgot ADC en rankeds.', `
    ${borroso('splash/Urgot_32-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Urgot_32'), 'Urgot Don Plomerone, splash', { ...SP, cam: [0.3, 0.45, 1, 0.62, 0.42, 1.02] })}
      ${velo(560)}
      ${dato('ADC', { tam: 420, bottom: 40, tracking: 16 })}`)}`));

// ── 3 · vt-48 ─── Vayne base entera ──
slides.push(lamina('vt-48', 'Se jugó cuarenta y ocho veces este año entre la LCK y la LPL.', `
    ${borroso('splash/Vayne_0-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Vayne_0'), 'Vayne, splash base', { ...SP, cam: [0.55, 0.45, 1, 0.6, 0.42, 1.06] })}
      ${velo(700)}
      ${dato('48', { tam: 460, bottom: 230, tracking: 10 })}
      ${dato('LCK + LPL', { tam: 160, bottom: 60, tracking: 12 })}`)}`));

// ── 4 · vt-renekton ─── Renekton entero ──
slides.push(lamina('vt-renekton', 'Contra Renekton, antes del Mundial, iba cuatro a uno.', `
    ${borroso('splash/Renekton_0-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Renekton_0'), 'Renekton, splash base', { ...SP, cam: [0.5, 0.5, 1, 0.52, 0.42, 1.08] })}
      ${velo(600)}
      ${dato('4-1', { tam: 460, bottom: 50, tracking: 12 })}`)}`));

// ── 5 · vt-kiin ─── el logo de GEN sobre Vayne Matadragones desenfocada ──
slides.push(lamina('vt-kiin', 'El top laner de Gen.G lleva seis a uno con ese pick.', `
    ${borroso('splash/Vayne_3-fondo.jpg', 0.35)}
    ${VINETA}
    ${panel(`
      ${vista(splash('Vayne_3'), 'Vayne Matadragones, splash desenfocado', { ...SP, cam: [0.7, 0.4, 1.05, 0.72, 0.42, 1.12], filtro: 'filter: blur(16px) brightness(0.42) saturate(1.15);' })}
      <div data-logo style="position: absolute; inset: 0;">${logo('GEN', 'Logo de Gen.G', { x: 260, y: 200, w: 560 })}</div>
      ${dato('6-1', { tam: 440, top: 860, tracking: 12 })}`)}`));

// ── 6 · vt-fearless ─── los siete picks más jugados de Doran, 4 + 3, sin tachar ──
const TOPS = [['Jayce', 'Jayce'], ['Ambessa', 'Ambessa'], ['Rumble', 'Rumble'], ['Gnar', 'Gnar'], ['Sion', 'Sion'], ['KSante', "K'Sante"], ['Olaf', 'Olaf']];
const tile = ([n, alt], x, y) => `<img src="assets/tiles/${n}_0.jpg" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: 250px; height: 250px; display: block; box-shadow: 0 12px 34px rgba(0,0,0,0.7);">`;
slides.push(lamina('vt-fearless', 'En el cuarto mapa del Fearless, Doran no tenía seis de sus siete picks más jugados.', `
    ${borroso('splash/Vayne_0-fondo.jpg', 0.24, '30% 50%')}
    ${tinte(ROJO, 0.12, '50% 15%')}
    ${VINETA}
    ${panel(`
      <div data-rejilla style="position: absolute; left: 0; top: 230px; width: ${PW}px; height: 540px;">
        ${TOPS.slice(0, 4).map((t, i) => tile(t, 17 + i * 265, 0)).join('')}
        ${TOPS.slice(4).map((t, i) => tile(t, 150 + i * 265, 275)).join('')}
      </div>
      ${dato('6 DE 7', { tam: 320, rojo: true, top: 900, tracking: 12 })}`)}`));

// ── 7 · vt-renek-skarner ─── Renekton arriba (su cabeza) y Skarner abajo ──
slides.push(lamina('vt-renek-skarner', 'Contra un Renekton y un Skarner.', `
    ${borroso('splash/Skarner_0-fondo.jpg', 0.3)}
    ${panel(`
      <div data-mitades style="position: absolute; inset: 0;">
        ${vista(splash('Renekton_0'), 'Renekton, splash base: la cabeza', { x: 0, y: 0, w: PW, h: 680, ...SP, cam: [0.55, 0.32, 1.18, 0.56, 0.3, 1.26] })}
        ${vista(splash('Skarner_0'), 'Skarner, splash base', { x: 0, y: 690, w: PW, h: 680, ...SP, cam: [0.5, 0.55, 1.02, 0.5, 0.52, 1.1] })}
      </div>`)}`));

// ── 8 · vt-nerf ─── PROYECTO: Vayne ──
slides.push(lamina('vt-nerf', 'La Vayne top fue nerfeada, y su ítem principal también.', `
    ${borroso('splash/Vayne_11-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Vayne_11'), 'PROYECTO: Vayne, splash', { ...SP, cam: [0.42, 0.42, 1, 0.45, 0.4, 1.06] })}
      ${velo(560)}
      ${dato(`26.17 · 26.20`, { tam: 180, bottom: 80, tracking: 10 })}`)}`));

// ── 9 · vt-cero ─── Vayne Flor Espiritual ──
slides.push(lamina('vt-cero', 'Nadie la tocaba desde septiembre, ni en Corea ni en China.', `
    ${borroso('splash/Vayne_14-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Vayne_14'), 'Vayne Flor Espiritual, splash', { ...SP, cam: [0.55, 0.4, 1, 0.56, 0.36, 1.08] })}
      ${velo(600)}
      ${dato('0', { tam: 520, bottom: 40, tracking: 0 })}`)}`));

// ── 10 · vt-369 ─── el logo de TES grande con IG chico, sobre Renekton desenfocado ──
slides.push(lamina('vt-369', 'Ya habíamos visto lo que le hizo 369 con Renekton a la Vayne.', `
    ${borroso('splash/Renekton_0-fondo.jpg', 0.3, '70% 50%')}
    ${VINETA}
    ${panel(`
      ${vista(splash('Renekton_0'), 'Renekton, splash desenfocado', { ...SP, cam: [0.62, 0.55, 1.1, 0.6, 0.5, 1.16], filtro: 'filter: blur(16px) brightness(0.4) saturate(1.1);' })}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('TES', 'Logo de Top Esports', { x: 330, y: 120, w: 420 })}
        ${logo('IG', 'Logo de Invictus Gaming', { x: 450, y: 720, w: 180 })}
      </div>
      ${dato('0-2', { tam: 340, rojo: true, top: 950, tracking: 12 })}`)}`));

// ── 11 · vt-diff ─── los logos de T1 y BLG lado a lado; las tres líneas perdidas ──
slides.push(lamina('vt-diff', 'Doran venía de perder línea las tres partidas anteriores.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.22, '20% 70%')}
    ${tinte(ROJO, 0.12, '50% 70%')}
    ${VINETA}
    ${panel(`
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: 520px;">
        ${logo('T1', 'Logo de T1', { x: 80, y: 220, w: 420 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 590, y: 210, w: 420 })}
      </div>
      ${dato(`${MENOS}607`, { tam: 230, rojo: true, top: 560, tracking: 10 })}
      ${dato(`${MENOS}681`, { tam: 230, rojo: true, top: 800, tracking: 10 })}
      ${dato(`${MENOS}938`, { tam: 230, rojo: true, top: 1040, tracking: 10 })}`)}`));

// ── 12 · vt-caedrel ─── la pantalla de carga de Vayne SKT T1 entera, empuje muy lento ──
slides.push(lamina('vt-caedrel', 'Caedrel lo dijo antes de empezar: si la Vayne se quedaba atrás, los pasaban por encima.', `
    ${borroso('carga/Vayne_5-fondo.jpg', 0.45)}
    ${panel(`
      ${vista('carga/Vayne_5.jpg', 'Vayne SKT T1, pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.05, 0.5, 0.47, 1.1] })}`)}`));

// ── 13 · vt-oro ─── Vayne base cerrada en el rostro (otro recorte que vt-48) ──
slides.push(lamina('vt-oro', 'Minuto quince: mil cuatrocientos sesenta y seis de oro abajo.', `
    ${borroso('splash/Vayne_0-fondo.jpg', 0.4, '70% 30%')}
    ${panel(`
      ${vista(splash('Vayne_0'), 'Vayne, splash base: el rostro', { ...SP, cam: [0.68, 0.3, 1.28, 0.67, 0.26, 1.4] })}
      ${velo(600)}
      ${dato(`${MENOS}1${MIL}466`, { tam: 330, rojo: true, bottom: 60, tracking: 8 })}`)}`));

// ── 14 · vt-t1 ─── el logo de T1 sobre Ahri desenfocada ──
slides.push(lamina('vt-t1', 'Estás en el mejor equipo de la historia del videojuego.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.4)}
    ${VINETA}
    ${panel(`
      ${vista(splash('Ahri_86'), 'Ahri Leyenda Inmortalizada, splash desenfocado', { ...SP, cam: [0.5, 0.42, 1.05, 0.5, 0.4, 1.12], filtro: 'filter: blur(14px) brightness(0.42) saturate(1.15);' })}
      <div data-logo style="position: absolute; inset: 0;">${logo('T1', 'Logo de T1', { x: 190, y: 555, w: 700 })}</div>`)}`));

// ── 15 · vt-sion ─── Sion Rompemundos ──
slides.push(lamina('vt-sion', 'Podía sacar el Sion, con el que llevaba siete victorias de ocho.', `
    ${borroso('splash/Sion_14-fondo.jpg', 0.7)}
    ${panel(`
      ${vista(splash('Sion_14'), 'Sion Rompemundos, splash', { ...SP, cam: [0.45, 0.38, 1, 0.46, 0.32, 1.08], filtro: 'filter: brightness(1.55) contrast(1.05);' })}
      ${velo(600)}
      ${dato('7-1', { tam: 460, bottom: 50, tracking: 12 })}`)}`));

// ── 16 · vt-ace ─── la pantalla de carga de Vayne SKT T1 cerrada en el rostro ──
slides.push(lamina('vt-ace', 'En la pelea del ace mató a dos.', `
    ${borroso('carga/Vayne_5-fondo.jpg', 0.42, '50% 25%')}
    ${panel(`
      ${vista('carga/Vayne_5.jpg', 'Vayne SKT T1, pantalla de carga: el rostro', { ...CARGA, cam: [0.5, 0.3, 1.3, 0.5, 0.27, 1.4] })}
      ${velo(560)}
      ${dato('2', { tam: 480, bottom: 40, tracking: 0 })}`)}`));

// ── 17 · vt-veredicto ─── Vayne Matadragones nítida ──
slides.push(lamina('vt-veredicto', 'Veredicto: tenían argumentos de sobra para sacarla.', `
    ${borroso('splash/Vayne_3-fondo.jpg', 0.45, '80% 40%')}
    ${panel(`
      ${vista(splash('Vayne_3'), 'Vayne Matadragones, splash', { ...SP, cam: [0.8, 0.45, 1, 0.78, 0.42, 1.08] })}
      ${velo(560)}
      ${dato('NO FUE TROLL', { tam: 180, bottom: 70, tracking: 10 })}`)}`));

// ── 18 · vt-topdiff ─── T1 arriba y BLG abajo (otro recorte que vt-diff), y el −3 692 ──
slides.push(lamina('vt-topdiff', 'No apuesten el mapa con el top laner al que le están haciendo top diff toda la serie.', `
    ${borroso('splash/Vayne_14-fondo.jpg', 0.22)}
    ${tinte(ROJO, 0.14, '50% 50%')}
    ${VINETA}
    ${panel(`
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('T1', 'Logo de T1', { x: 260, y: 110, w: 560 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 300, y: 1020, w: 480 })}
      </div>
      ${dato(`${MENOS}3${MIL}692`, { tam: 340, rojo: true, top: 500, tracking: 8 })}`)}`));

// ── 19 · vt-tanque ─── la pantalla de carga de Sion Rompemundos, paneo vertical ──
slides.push(lamina('vt-tanque', 'Un tanque sirve para lo que es: que le peguen hasta cansarse.', `
    ${borroso('carga/Sion_14-fondo.jpg', 0.7)}
    ${panel(`
      ${vista('carga/Sion_14.jpg', 'Sion Rompemundos, pantalla de carga', { ...CARGA, cam: [0.5, 0.2, 1.14, 0.5, 0.75, 1.14], filtro: 'filter: brightness(1.7) contrast(1.05);' })}`)}`));

// ── 20 · vt-contrato ─── el logo de T1 arriba y la fecha ──
slides.push(lamina('vt-contrato', 'En una semana se te acaba el contrato.', `
    ${borroso('splash/Vayne_11-fondo.jpg', 0.26)}
    ${tinte(ROJO, 0.12, '50% 20%')}
    ${VINETA}
    ${panel(`
      <div data-logo style="position: absolute; inset: 0;">${logo('T1', 'Logo de T1', { x: 250, y: 200, w: 580 })}</div>
      ${dato('16/11', { tam: 440, top: 620, tracking: 12 })}`)}`));

// ── 21 · vt-faker ─── Ahri Leyenda Inmortalizada a sangre, paneo lento ──
slides.push(lamina('vt-faker', 'Faker, el mejor jugador de la historia, dio la talla a sus treinta años.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.45)}
    ${panel(`
      ${vista(splash('Ahri_86'), 'Ahri Leyenda Inmortalizada, splash', { ...SP, cam: [0.36, 0.45, 1, 0.58, 0.42, 1.04] })}
      ${velo(560)}
      ${dato('30', { tam: 480, bottom: 40, tracking: 10 })}`)}`));

// ── 22 · vt-cierre ─── Vayne SKT T1 cerrada (otro recorte que la portada) ──
slides.push(lamina('vt-cierre', 'En mi opinión, díganle chao.', `
    ${borroso('splash/Vayne_5-fondo.jpg', 0.4, '45% 60%')}
    ${panel(`
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash: de cerca', { ...SP, cam: [0.75, 0.64, 1.4, 0.75, 0.6, 1.52] })}
      ${velo(560)}
      ${dato('CHAO', { tam: 440, bottom: 40, tracking: 14 })}`)}`));

// ── Coreografías GSAP: cámara y fundidos cortos ──────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  var DUR = 2.8;   // ninguna animación pasa de aquí

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo: cada imagen pasa de su encuadre inicial al final.
  function camara(tl, s) {
    q(s, '[data-cam]').forEach(function (img) {
      var v = img.parentNode, vw = +v.dataset.vw, vh = +v.dataset.vh, cw = +img.dataset.cw, ch = +img.dataset.ch;
      var c = img.dataset.cam.split(',').map(Number);
      var ini = encuadre(vw, vh, cw, ch, c[0], c[1], c[2]), fin = encuadre(vw, vh, cw, ch, c[3], c[4], c[5]);
      ini.transformOrigin = '0 0'; fin.transformOrigin = '0 0';
      fin.duration = DUR; fin.ease = 'power1.out'; fin.immediateRender = true;
      tl.fromTo(img, ini, fin, 0);
    });
  }
  // Empuje leve de un logo o grupo sobre sí mismo.
  function empuje(tl, el, hasta, origen) {
    if (el) tl.fromTo(el, { scale: 1 }, { scale: hasta || 1.06, transformOrigin: origen || '50% 45%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  }
  function fundido(tl, el, desde, dur, en) {
    if (el) tl.fromTo(el, { opacity: desde }, { opacity: 1, duration: dur || 0.6, ease: 'power1.out', immediateRender: true }, en || 0);
  }
  // Los datos de la lámina entran con un fundido corto, juntos.
  function datos(tl, s, en) { q(s, '[data-dato]').forEach(function (d) { fundido(tl, d, 0, 0.6, en); }); }
  function lamina(id, extra) {
    animar(id, function (tl, s) { camara(tl, s); if (extra) extra(tl, s); });
  }
  var conDato = function (en) { return function (tl, s) { datos(tl, s, en); }; };

  lamina('vt-portada', conDato(0.7));
  lamina('vt-urgot', conDato(0.8));
  lamina('vt-48', conDato(0.7));
  lamina('vt-renekton', conDato(0.7));
  lamina('vt-kiin', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '50% 30%'); datos(tl, s, 0.6); });
  // La cuadrícula completa entra con un fundido; los siete no entran uno por uno.
  lamina('vt-fearless', function (tl, s) { var r = uno(s, '[data-rejilla]'); fundido(tl, r, 0.2, 0.7, 0); empuje(tl, r, 1.04, '50% 50%'); datos(tl, s, 0.6); });
  lamina('vt-renek-skarner', function (tl, s) { fundido(tl, uno(s, '[data-mitades]'), 0.3, 0.6, 0); });
  lamina('vt-nerf', conDato(0.8));
  lamina('vt-cero', conDato(0.7));
  lamina('vt-369', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.2, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.05, '50% 30%'); datos(tl, s, 0.8); });
  lamina('vt-diff', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.2, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.05, '50% 45%'); datos(tl, s, 0.8); });
  lamina('vt-caedrel');
  lamina('vt-oro', conDato(0.7));
  lamina('vt-t1', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.05, '50% 50%'); });
  lamina('vt-sion', conDato(0.7));
  lamina('vt-ace', conDato(0.7));
  lamina('vt-veredicto', conDato(0.8));
  lamina('vt-topdiff', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.2, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.04, '50% 50%'); datos(tl, s, 0.8); });
  lamina('vt-tanque');
  lamina('vt-contrato', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '50% 25%'); datos(tl, s, 0.6); });
  lamina('vt-faker', conDato(0.8));
  lamina('vt-cierre', conDato(0.7));
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>¿La Vayne de Doran fue troll?</title>
${kit.og({ titulo: '¿La Vayne de Doran fue troll?', descripcion: 'El pick del cuarto mapa contra BLG, con los números: 48 partidas en LCK y LPL, el Fearless, los nerfeos y el oro perdido en la línea. Solo arte oficial.', carpeta: 'creator/vayne-troll' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .rojo { color: ${ROJO}; text-shadow: 0 6px 30px rgba(0,0,0,0.85), 0 0 60px ${a(ROJO, 0.35)}; }
  .blanco { color: ${BLANCO}; text-shadow: 0 6px 30px rgba(0,0,0,0.9); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(BLANCO, 0.4)}; border-radius: 999px;
    background: rgba(11,11,14,0.85); color: ${BLANCO}; cursor: pointer;
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
${kit.gsap(__dirname)}
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
