// Generador de index.html — «¿La Vayne de Doran fue troll?» (canal Axelsine, 9/11/2026), formato «banda inferior»
// Ejecutar: node creator/vayne-troll/gen.js   ·   clips: node tools/laminas.mjs creator/vayne-troll --alfa=webm
//
// 22 láminas y una de reposo en **banda inferior, como t1-blg y ambessa** (pedido de Axl del 9/11:
// el panel de 1080×1370 de la primera versión, commit 00a9570, fue un error de su paquete):
//   · <deck-stage data-recorte="1080:680:0:1240">: la banda opaca de 1080×680 de lado a lado que
//     deja libre el prereel (caja {width: 1080, x: center, bottom: 0}); se exporta en webm con alfa;
//   · dentro del panel nada lleva data-fondo (el único es la guía «GAMEPLAY» de arriba);
//   · **un riel común** (líneas finas en blanco, marcas y seis destellos: los de arriba en el rojo
//     de T1 y los de abajo en blanco) que es el mismo markup en todas las láminas y queda idéntico en
//     el primer y el último cuadro, para que el fundido de 0,25 s de ReelForge no lo corte;
//   · `vt-reposo` (data-reposo): la banda con su fondo y su riel, sin dato, para los huecos.
// Se quedan igual los ids, las imágenes oficiales, los textos del dato, la paleta, guion-marcado.txt
// y clips.json; solo cambia el encuadre, que ahora es horizontal.
//
// 🎯 **Las reglas del paquete no cambian**: la cámara es la única animación (2,5 s, menos de 2,8),
// no se dibuja nada y el único texto es el dato. Por eso **las entradas son de cámara**, no las
// transiciones de t1-blg (iris, persianas, quemado, glitch…): la lámina entra con un fundido, se
// desliza desde un lado o desde arriba o abajo, o se acerca o se aleja, y cada lámina vecina entra
// distinto (tabla ENTRADA). En el cuadro 0 se ve solo la banda vacía con el riel, igual en todas.
//
// Paleta: negro `#0B0B0E`; **las cifras malas para Doran o T1 en el rojo de T1 `#E4002B`**
// (6 DE 7, 0-2, −607 · −681 · −938, −1 466, −3 692) y **todo lo demás en blanco**.
//
// ⚠️ **Donde la primera versión llevaba pantalla de carga (vt-caedrel, vt-ace, vt-tanque) ahora va
// el splash**, porque la banda es horizontal: Vayne_5 entero en vt-caedrel y su ballesta en vt-ace,
// y Sion_14 con un paneo vertical en vt-tanque, cada uno con otro recorte que el resto.
// ⚠️ **Vayne_5 es «Vayne SKT T1»** y su splash es grupal: Vayne es la de audífonos y lentes, a la
// derecha (0,74 · 0,56). ⚠️ Los siete tops de `vt-fearless` van con los tiles de Data Dragon
// (380 px) y no con los íconos de 120 px. ⚠️ Sion_14 es oscuro: va con brightness.
// **Los clips** del guion ({clip:…}) siguen en `clips.json` y entran en el manifest tras su lámina.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#0B0B0E';
const ROJO = '#E4002B';
const BLANCO = '#F5F5F7';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── El riel: idéntico en todas las láminas ───────────────────────────────
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-vayne-troll');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  // Seis destellos fijos: los de arriba en el rojo de T1 y los de abajo en blanco.
  const brillos = [0, 1, 2, 3, 4, 5].map((i) => {
    const arriba = i < 3, tercio = i % 3;
    const x = Math.round(70 + tercio * 330 + r() * 260), y = Math.round(arriba ? 52 + r() * 34 : 594 + r() * 34), s = Math.round(8 + r() * 8);
    return `<path d="${estrella(x, y, s)}" fill="${arriba ? ROJO : BLANCO}" opacity="${(0.55 + r() * 0.3).toFixed(2)}"/>`;
  }).join('');
  return `
      <div data-riel style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to bottom, ${a(BG, 0.62)} 0, ${a(BG, 0)} 96px, ${a(BG, 0)} 584px, ${a(BG, 0.62)} 100%);"></div>
      <svg data-riel viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;">
        <g fill="none" stroke="${BLANCO}" stroke-linecap="round">
          <line x1="0" y1="20" x2="${PW}" y2="20" stroke-width="1.6" stroke-opacity=".55"/>
          <line x1="0" y1="28" x2="${PW}" y2="28" stroke-width=".8" stroke-opacity=".25"/>
          <line x1="0" y1="652" x2="${PW}" y2="652" stroke-width=".8" stroke-opacity=".25"/>
          <line x1="0" y1="660" x2="${PW}" y2="660" stroke-width="1.6" stroke-opacity=".55"/>
          <g stroke-width="1" stroke-opacity=".38">${marcas.join('')}</g>
        </g>
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${ROJO}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${BLANCO}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${BLANCO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Guía de dónde va el gameplay del prereel: solo para ver el deck en el navegador.
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(BLANCO, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(BLANCO, 0.12)};">GAMEPLAY</div>`;

function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return { x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0), y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0), z };
}

// Visor con la cámara declarada en `cam`: [cx0, cy0, z0, cx1, cy1, z1] (centro 0–1 y zoom sobre `cover`).
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', attrs = '' }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Fondo opaco con la copia de 360 px desenfocada (NO es data-fondo: la banda es opaca).
const respaldo = (src, brillo = 0.4, pos = 'center') => `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(40px) saturate(1.1) brightness(${brillo});"></div></div>`;
// Un tinte rojo tenue donde la cifra es mala.
const tinte = (fuerza = 0.16, donde = '50% 50%') => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 80% at ${donde}, ${a(ROJO, fuerza)}, ${a(ROJO, 0)} 70%);"></div>`;
const veloIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;
const veloDer = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(270deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;
const veloAbajo = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, ${a(BG, 0.9)} 0%, ${a(BG, 0.5)} 32%, ${a(BG, 0)} 60%);"></div>`;

// Texto: solo el dato. `rojo` para lo malo para Doran o T1; si no, blanco.
const dato = (txt, { x = 0, y, w = PW, tam, rojo = false, tracking = 8, alinear = 'center' }) => `
      <div data-dato style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; box-sizing: border-box; text-align: ${alinear}; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;"><span class="${rojo ? 'rojo' : 'blanco'}">${txt}</span></div>`;

const logo = (n, alt, { x, y, w }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; filter: drop-shadow(0 12px 36px rgba(0,0,0,0.85));">`;

/** El panel: [data-contenido] (lo que entra con la cámara) → riel encima, quieto. */
const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;

const lamina = (id, notasOrador, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;

const SP = { iw: 1215, ih: 717 };
const splash = (n) => `splash/${n}.jpg`;
const MENOS = '−';                 // el signo menos tipográfico, no el guion
const MIL = ' ';              // el espacio de miles sin corte de línea
// Los datos a la izquierda, sobre el velo, cuando el personaje queda a la derecha del splash.
const IZQ = { x: 30, w: 600 };

const slides = [];

// ── 1 · vt-portada ─── Vayne SKT T1: ella, a la derecha ──
slides.push(lamina('vt-portada', 'Doran sacó Vayne top en la partida que eliminó al tricampeón.', `
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash', { ...SP, cam: [0.7, 0.55, 1.12, 0.73, 0.54, 1.22] })}
      ${veloIzq}
      ${dato('VAYNE TOP', { ...IZQ, y: 250, tam: 190, tracking: 12 })}`));

// ── 2 · vt-urgot ─── Urgot Don Plomerone, paneo ──
slides.push(lamina('vt-urgot', 'Un pick troll: algo que eligen sin razón, como un Urgot ADC en rankeds.', `
      ${vista(splash('Urgot_32'), 'Urgot Don Plomerone, splash', { ...SP, cam: [0.42, 0.45, 1.04, 0.6, 0.42, 1.08] })}
      ${veloIzq}
      ${dato('ADC', { x: 30, w: 420, y: 180, tam: 320, tracking: 14 })}`));

// ── 3 · vt-48 ─── Vayne base: el 48 y LCK + LPL a la izquierda ──
slides.push(lamina('vt-48', 'Se jugó cuarenta y ocho veces este año entre la LCK y la LPL.', `
      ${vista(splash('Vayne_0'), 'Vayne, splash base', { ...SP, cam: [0.6, 0.45, 1, 0.64, 0.42, 1.08] })}
      ${veloIzq}
      ${dato('48', { ...IZQ, w: 480, y: 70, tam: 360, tracking: 10 })}
      ${dato('LCK + LPL', { ...IZQ, w: 480, y: 460, tam: 120, tracking: 10 })}`));

// ── 4 · vt-renekton ─── Renekton entero ──
slides.push(lamina('vt-renekton', 'Contra Renekton, antes del Mundial, iba cuatro a uno.', `
      ${vista(splash('Renekton_0'), 'Renekton, splash base', { ...SP, cam: [0.56, 0.45, 1, 0.6, 0.4, 1.08] })}
      ${veloIzq}
      ${dato('4-1', { x: 30, w: 460, y: 150, tam: 380, tracking: 12 })}`));

// ── 5 · vt-kiin ─── el logo de GEN sobre Vayne Matadragones desenfocada, y el 6-1 ──
slides.push(lamina('vt-kiin', 'El top laner de Gen.G lleva seis a uno con ese pick.', `
      ${vista(splash('Vayne_3'), 'Vayne Matadragones, splash desenfocado', { ...SP, cam: [0.7, 0.4, 1.05, 0.72, 0.42, 1.12], filtro: 'filter: blur(16px) brightness(0.4) saturate(1.15);' })}
      <div data-logo style="position: absolute; inset: 0;">${logo('GEN', 'Logo de Gen.G', { x: 100, y: 150, w: 440 })}</div>
      ${dato('6-1', { x: 560, w: 480, y: 150, tam: 380, tracking: 12 })}`));

// ── 6 · vt-fearless ─── los siete picks más jugados de Doran, 4 + 3, sin tachar ──
const TOPS = [['Jayce', 'Jayce'], ['Ambessa', 'Ambessa'], ['Rumble', 'Rumble'], ['Gnar', 'Gnar'], ['Sion', 'Sion'], ['KSante', "K'Sante"], ['Olaf', 'Olaf']];
const tile = ([n, alt], x, y) => `<img src="assets/tiles/${n}_0.jpg" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: 160px; height: 160px; display: block; box-shadow: 0 10px 28px rgba(0,0,0,0.7);">`;
slides.push(lamina('vt-fearless', 'En el cuarto mapa del Fearless, Doran no tenía seis de sus siete picks más jugados.', `
      ${respaldo('splash/Vayne_0-fondo.jpg', 0.24, '30% 50%')}
      ${tinte(0.16, '78% 50%')}
      <div data-rejilla style="position: absolute; left: 30px; top: 150px; width: 676px; height: 340px;">
        ${TOPS.slice(0, 4).map((t, i) => tile(t, i * 172, 0)).join('')}
        ${TOPS.slice(4).map((t, i) => tile(t, 86 + i * 172, 180)).join('')}
      </div>
      ${dato('6 DE 7', { x: 700, w: 360, y: 250, tam: 150, rojo: true, tracking: 8 })}`));

// ── 7 · vt-renek-skarner ─── Renekton (su cabeza) a la izquierda y Skarner a la derecha ──
slides.push(lamina('vt-renek-skarner', 'Contra un Renekton y un Skarner.', `
      ${vista(splash('Renekton_0'), 'Renekton, splash base: la cabeza', { x: 0, y: 0, w: 536, h: PH, ...SP, cam: [0.55, 0.32, 1.1, 0.56, 0.3, 1.18] })}
      ${vista(splash('Skarner_0'), 'Skarner, splash base', { x: 544, y: 0, w: 536, h: PH, ...SP, cam: [0.5, 0.55, 1.02, 0.5, 0.52, 1.1] })}`));

// ── 8 · vt-nerf ─── PROYECTO: Vayne, con los dos parches abajo ──
slides.push(lamina('vt-nerf', 'La Vayne top fue nerfeada, y su ítem principal también.', `
      ${vista(splash('Vayne_11'), 'PROYECTO: Vayne, splash', { ...SP, cam: [0.45, 0.4, 1, 0.46, 0.36, 1.08] })}
      ${veloAbajo}
      ${dato('26.17 · 26.20', { y: 470, tam: 150, tracking: 10 })}`));

// ── 9 · vt-cero ─── Vayne Flor Espiritual ──
slides.push(lamina('vt-cero', 'Nadie la tocaba desde septiembre, ni en Corea ni en China.', `
      ${vista(splash('Vayne_14'), 'Vayne Flor Espiritual, splash', { ...SP, cam: [0.6, 0.38, 1.02, 0.62, 0.34, 1.1] })}
      ${veloIzq}
      ${dato('0', { x: 30, w: 400, y: 120, tam: 440, tracking: 0 })}`));

// ── 10 · vt-369 ─── el logo de TES grande con IG chico, sobre Renekton desenfocado; el 0-2 ──
slides.push(lamina('vt-369', 'Ya habíamos visto lo que le hizo 369 con Renekton a la Vayne.', `
      ${vista(splash('Renekton_0'), 'Renekton, splash desenfocado', { ...SP, cam: [0.62, 0.55, 1.1, 0.6, 0.5, 1.16], filtro: 'filter: blur(16px) brightness(0.38) saturate(1.1);' })}
      ${tinte(0.14, '75% 50%')}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('TES', 'Logo de Top Esports', { x: 110, y: 120, w: 300 })}
        ${logo('IG', 'Logo de Invictus Gaming', { x: 420, y: 400, w: 140 })}
      </div>
      ${dato('0-2', { x: 600, w: 440, y: 170, tam: 340, rojo: true, tracking: 12 })}`));

// ── 11 · vt-diff ─── los logos de T1 y BLG uno sobre otro, y las tres líneas perdidas ──
slides.push(lamina('vt-diff', 'Doran venía de perder línea las tres partidas anteriores.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.22, '20% 70%')}
      ${tinte(0.14, '70% 50%')}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('T1', 'Logo de T1', { x: 50, y: 160, w: 330 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 60, y: 380, w: 310 })}
      </div>
      ${dato(`${MENOS}607`, { x: 430, w: 620, y: 60, tam: 175, rojo: true, tracking: 8 })}
      ${dato(`${MENOS}681`, { x: 430, w: 620, y: 252, tam: 175, rojo: true, tracking: 8 })}
      ${dato(`${MENOS}938`, { x: 430, w: 620, y: 444, tam: 175, rojo: true, tracking: 8 })}`));

// ── 12 · vt-caedrel ─── Vayne SKT T1 entera (el splash grupal), empuje muy lento ──
slides.push(lamina('vt-caedrel', 'Caedrel lo dijo antes de empezar: si la Vayne se quedaba atrás, los pasaban por encima.', `
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash entero', { ...SP, cam: [0.55, 0.5, 1, 0.56, 0.49, 1.05] })}`));

// ── 13 · vt-oro ─── Vayne base cerrada en el rostro ──
slides.push(lamina('vt-oro', 'Minuto quince: mil cuatrocientos sesenta y seis de oro abajo.', `
      ${vista(splash('Vayne_0'), 'Vayne, splash base: el rostro', { ...SP, cam: [0.7, 0.3, 1.3, 0.69, 0.27, 1.42] })}
      ${veloIzq}
      ${dato(`${MENOS}1${MIL}466`, { x: 20, w: 560, y: 230, tam: 220, rojo: true, tracking: 8 })}`));

// ── 14 · vt-t1 ─── el logo de T1 sobre Ahri desenfocada ──
slides.push(lamina('vt-t1', 'Estás en el mejor equipo de la historia del videojuego.', `
      ${vista(splash('Ahri_86'), 'Ahri Leyenda Inmortalizada, splash desenfocado', { ...SP, cam: [0.5, 0.42, 1.05, 0.5, 0.4, 1.12], filtro: 'filter: blur(14px) brightness(0.42) saturate(1.15);' })}
      <div data-logo style="position: absolute; inset: 0;">${logo('T1', 'Logo de T1', { x: 240, y: 230, w: 600 })}</div>`));

// ── 15 · vt-sion ─── Sion Rompemundos ──
slides.push(lamina('vt-sion', 'Podía sacar el Sion, con el que llevaba siete victorias de ocho.', `
      ${vista(splash('Sion_14'), 'Sion Rompemundos, splash', { ...SP, cam: [0.62, 0.4, 1.25, 0.6, 0.36, 1.32], filtro: 'filter: brightness(1.55) contrast(1.05);' })}
      ${veloDer}
      ${dato('7-1', { x: 610, w: 440, y: 150, tam: 380, tracking: 12 })}`));

// ── 16 · vt-ace ─── Vayne SKT T1: el virote dorado (otro recorte que la portada y el cierre) ──
slides.push(lamina('vt-ace', 'En la pelea del ace mató a dos.', `
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash: el virote', { ...SP, cam: [0.6, 0.74, 1.9, 0.65, 0.7, 2.05] })}
      ${veloIzq}
      ${dato('2', { x: 30, w: 400, y: 120, tam: 440, tracking: 0 })}`));

// ── 17 · vt-veredicto ─── Vayne Matadragones nítida ──
slides.push(lamina('vt-veredicto', 'Veredicto: tenían argumentos de sobra para sacarla.', `
      ${vista(splash('Vayne_3'), 'Vayne Matadragones, splash', { ...SP, cam: [0.74, 0.45, 1, 0.76, 0.42, 1.08] })}
      ${veloIzq}
      ${dato('NO FUE TROLL', { ...IZQ, w: 620, y: 280, tam: 120, tracking: 8 })}`));

// ── 18 · vt-topdiff ─── el −3 692 a la izquierda y los logos a la derecha (otra composición que vt-diff) ──
slides.push(lamina('vt-topdiff', 'No apuesten el mapa con el top laner al que le están haciendo top diff toda la serie.', `
      ${respaldo('splash/Vayne_14-fondo.jpg', 0.22)}
      ${tinte(0.16, '30% 50%')}
      ${dato(`${MENOS}3${MIL}692`, { x: 20, w: 640, y: 210, tam: 260, rojo: true, tracking: 8 })}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('T1', 'Logo de T1', { x: 700, y: 150, w: 330 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 710, y: 380, w: 310 })}
      </div>`));

// ── 19 · vt-tanque ─── Sion Rompemundos de cerca: paneo del pecho a los ojos (otro recorte que vt-sion) ──
slides.push(lamina('vt-tanque', 'Un tanque sirve para lo que es: que le peguen hasta cansarse.', `
      ${vista(splash('Sion_14'), 'Sion Rompemundos, splash: de cerca', { ...SP, cam: [0.45, 0.62, 1.5, 0.45, 0.28, 1.6], filtro: 'filter: brightness(1.8) contrast(1.08);' })}`));

// ── 20 · vt-contrato ─── el logo de T1 y la fecha ──
slides.push(lamina('vt-contrato', 'En una semana se te acaba el contrato.', `
      ${respaldo('splash/Vayne_11-fondo.jpg', 0.26)}
      <div data-logo style="position: absolute; inset: 0;">${logo('T1', 'Logo de T1', { x: 60, y: 255, w: 420 })}</div>
      ${dato('16/11', { x: 490, w: 580, y: 210, tam: 260, tracking: 10 })}`));

// ── 21 · vt-faker ─── Ahri Leyenda Inmortalizada a sangre, paneo lento ──
slides.push(lamina('vt-faker', 'Faker, el mejor jugador de la historia, dio la talla a sus treinta años.', `
      ${vista(splash('Ahri_86'), 'Ahri Leyenda Inmortalizada, splash', { ...SP, cam: [0.5, 0.45, 1.02, 0.58, 0.42, 1.08] })}
      ${veloIzq}
      ${dato('30', { x: 30, w: 400, y: 120, tam: 440, tracking: 10 })}`));

// ── 22 · vt-cierre ─── Vayne SKT T1 cerrada en el rostro ──
slides.push(lamina('vt-cierre', 'En mi opinión, díganle chao.', `
      ${vista(splash('Vayne_5'), 'Vayne SKT T1, splash: el rostro', { ...SP, cam: [0.66, 0.52, 1.9, 0.64, 0.5, 2.1] })}
      ${veloIzq}
      ${dato('CHAO', { x: 30, w: 520, y: 170, tam: 340, tracking: 14 })}`));

// ── 23 · vt-reposo ─── la banda sin dato: Vayne Matadragones en penumbra ──
slides.push(lamina('vt-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${vista(splash('Vayne_3'), 'Vayne Matadragones, splash en penumbra', { ...SP, cam: [0.55, 0.4, 1.04, 0.58, 0.38, 1.08], filtro: 'filter: brightness(0.3) saturate(0.85);' })}`, ' data-reposo'));

// ── Coreografías GSAP: entradas de cámara y la cámara dentro ─────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  var PW = ${PW}, PH = ${PH};
  var DUR = 2.5;                    // ninguna lámina pasa de aquí (el tope es 2,8)

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo de cada imagen, en toda la lámina.
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
  function empuje(tl, el, hasta, origen) {
    if (el) tl.fromTo(el, { scale: 1 }, { scale: hasta || 1.05, transformOrigin: origen || '50% 50%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  }

  // Las entradas de la lámina: solo cámara (fundido, deslizamiento, acercamiento, alejamiento).
  // Mueven el [data-contenido] entero; el riel va encima y no se mueve. Devuelven cuándo terminan.
  var E = {
    fundido: function (tl, c) { tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.inOut', immediateRender: true }, 0); return 0.6; },
    izquierda: function (tl, c) { tl.fromTo(c, { x: -PW }, { x: 0, duration: 0.7, ease: 'power3.out', immediateRender: true }, 0); return 0.7; },
    derecha: function (tl, c) { tl.fromTo(c, { x: PW }, { x: 0, duration: 0.7, ease: 'power3.out', immediateRender: true }, 0); return 0.7; },
    abajo: function (tl, c) { tl.fromTo(c, { y: PH }, { y: 0, duration: 0.7, ease: 'power3.out', immediateRender: true }, 0); return 0.7; },
    arriba: function (tl, c) { tl.fromTo(c, { y: -PH }, { y: 0, duration: 0.7, ease: 'power3.out', immediateRender: true }, 0); return 0.7; },
    acerca: function (tl, c) { tl.fromTo(c, { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', duration: 0.75, ease: 'power2.out', immediateRender: true }, 0); return 0.75; },
    aleja: function (tl, c) { tl.fromTo(c, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', duration: 0.8, ease: 'power2.out', immediateRender: true }, 0); return 0.8; },
  };
  // Cada lámina vecina entra distinto.
  var ENTRADA = {
    'vt-portada': 'aleja', 'vt-urgot': 'derecha', 'vt-48': 'fundido', 'vt-renekton': 'izquierda', 'vt-kiin': 'acerca',
    'vt-fearless': 'abajo', 'vt-renek-skarner': 'fundido', 'vt-nerf': 'arriba', 'vt-cero': 'aleja', 'vt-369': 'derecha',
    'vt-diff': 'abajo', 'vt-caedrel': 'fundido', 'vt-oro': 'acerca', 'vt-t1': 'aleja', 'vt-sion': 'izquierda',
    'vt-ace': 'arriba', 'vt-veredicto': 'fundido', 'vt-topdiff': 'derecha', 'vt-tanque': 'abajo', 'vt-contrato': 'acerca',
    'vt-faker': 'izquierda', 'vt-cierre': 'aleja', 'vt-reposo': 'fundido',
  };
  // La cámara sobre los logos y la rejilla (además de la de las imágenes).
  var PROPIO = {
    'vt-kiin': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '30% 50%'); },
    'vt-fearless': function (tl, s) { empuje(tl, uno(s, '[data-rejilla]'), 1.04, '40% 50%'); },
    'vt-369': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.05, '25% 50%'); },
    'vt-diff': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.04, '20% 50%'); },
    'vt-t1': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.05); },
    'vt-topdiff': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.04, '80% 50%'); },
    'vt-contrato': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '25% 50%'); },
  };

  Object.keys(ENTRADA).forEach(function (id) {
    animar(id, function (tl, s) {
      camara(tl, s);
      var fin = E[ENTRADA[id]](tl, uno(s, '[data-contenido]'));
      var t = Math.max(0.35, fin - 0.15);          // el dato entra cuando la lámina ya llegó
      q(s, '[data-dato]').forEach(function (d, i) {
        tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', immediateRender: true }, t + i * 0.08);
      });
      if (PROPIO[id]) PROPIO[id](tl, s);
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
<title>¿La Vayne de Doran fue troll?</title>
${kit.og({ titulo: '¿La Vayne de Doran fue troll?', descripcion: 'El pick del cuarto mapa contra BLG en banda inferior, con los números: 48 partidas en LCK y LPL, el Fearless, los nerfeos y el oro perdido en la línea. Solo arte oficial.', carpeta: 'creator/vayne-troll' })}
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
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}">
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
