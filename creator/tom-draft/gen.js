// Generador de index.html — «El draft de Tom» (canal Axelsine, noviembre de 2026)
// Ejecutar: node creator/tom-draft/gen.js   ·   clips: node tools/laminas.mjs creator/tom-draft --alfa=webm
//
// **Formato de t1-blg y vayne-troll**: banda inferior <deck-stage data-recorte="1080:680:0:1240">,
// banda opaca de lado a lado (el único data-fondo es la guía «GAMEPLAY»), riel común idéntico en el
// primer y el último cuadro de cada lámina, `tm-reposo` (data-reposo) y webm con alfa. Paleta de
// t1-blg: negro #0B0B0E, rojo T1 #E4002B, azul BLG #36CFF3 y blanco para lo demás.
//
// 🎯 **Este deck NO va con la regla de ambessa** («solo arte oficial y la cámara como única
// animación»), por encargo: lleva recursos gráficos (íconos de Tabler, MIT, de tools/cache/iconos;
// marcadores, flechas, tachones, sellos, barras y una dona) y animaciones de aparición (entradas
// escalonadas, máscaras, deslizamientos, zooms, conteos y piezas que se arman). Lo que no cambia:
// el arte de campeones y logos es oficial (Data Dragon y los logos de ganan/; el de Weibo Gaming
// viene de la API de lolesports), las groserías no van en pantalla y ninguna lámina arranca en negro
// (cada una tiene un fondo visible desde el cuadro 0: arte desenfocado o un resplandor del color
// del equipo). Ninguna entrada pasa de 2,8 s.
//
// ⚠️ **Los coaches van ilustrados con un ícono de diadema y su nombre, sin cara**: la API de
// lolesports (getTeams de T1, BLG y Weibo) solo trae a los jugadores, no a Tom, kkOma ni Daeny.
// ⚠️ **El encargo dice 30 láminas pero lista 28**: van las 28 más `tm-reposo`.
// ⚠️ **No se inventa lo que el guion no da**: del mapa 4 solo se sabe el último pick (Vayne), así
// que en `tm-vayne` los cuatro picks anteriores son casillas vacías; tampoco se pinta con qué jugó
// Faker el último mapa ni el marcador de la serie.
// ⚠️ Los dos clips de Caedrel («Rumble es cebo» y «Tom cooked») todavía no existían al armar el
// deck: `clips.json` solo lleva `seraphine-ult`; cuando estén se agregan ahí y se vuelve a correr
// laminas.mjs.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#0B0B0E';
const T1 = '#E4002B';
const BLG = '#36CFF3';
const BLANCO = '#F5F5F7';
const GRIS = '#5E6068';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── El riel (el de t1-blg): idéntico en todas las láminas ────────────────
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-tom-draft');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  const brillos = [0, 1, 2, 3, 4, 5].map((i) => {
    const arriba = i < 3, tercio = i % 3;
    const x = Math.round(70 + tercio * 330 + r() * 260), y = Math.round(arriba ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${arriba ? T1 : BLG}" opacity="${(0.5 + r() * 0.3).toFixed(2)}"/>`;
  }).join('');
  return `
      <svg data-riel viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none; z-index: 20;">
        <g fill="none" stroke="${BLANCO}" stroke-linecap="round">
          <line x1="0" y1="20" x2="${PW}" y2="20" stroke-width="1.6" stroke-opacity=".5"/>
          <line x1="0" y1="28" x2="${PW}" y2="28" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="652" x2="${PW}" y2="652" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="660" x2="${PW}" y2="660" stroke-width="1.6" stroke-opacity=".5"/>
          <g stroke-width="1" stroke-opacity=".34">${marcas.join('')}</g>
        </g>
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${T1}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${BLG}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${BLANCO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(BLANCO, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(BLANCO, 0.12)};">GAMEPLAY</div>`;

const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block;${filtro ? ` filter: ${filtro};` : ''}">
      </div>`;
const respaldo = (src, { blur = 18, brillo = 0.32, pos = 'center', x = 0, y = 0, w = PW, h = PH } = {}) => `
      <div style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(1.1);"></div></div>`;
/** Resplandor del color de cada lado (fondo de las láminas sin arte). */
const brillo = (izq = T1, der = BLG, fuerza = 0.28) => `
      <div style="position: absolute; inset: 0; background: radial-gradient(55% 75% at 8% 40%, ${a(izq, fuerza)}, ${a(izq, 0)} 70%), radial-gradient(55% 75% at 96% 70%, ${a(der, fuerza * 0.8)}, ${a(der, 0)} 70%), linear-gradient(180deg, #121217, ${BG});"></div>`;
const marca = (n, { x, y, w, op = 0.07 }) => `<img src="assets/logos/${n}.png" alt="" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; opacity: ${op};">`;
const veloIzq = (f = 0.9) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, f)} 0%, ${a(BG, f * 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;
const veloDer = (f = 0.9) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(270deg, ${a(BG, f)} 0%, ${a(BG, f * 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;

const dato = (txt, { x = 60, y, w = 840, tam, color = BLANCO, alinear = 'left', tracking = 4, lh = 1, k = '', extra = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color}; text-shadow: 0 6px 30px rgba(0,0,0,.85); ${extra}">${txt}</div>`;
const ico = (id, { tam, color = BLANCO, trazo = 1.6 } = {}) => kit.icono(`tabler:${id}`, { tam, color, trazo });
const logo = (n, alt, { x, y, w, k = '', filtro = '' }) =>
  `<img${k ? ` data-k="${k}"` : ''} src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; filter: drop-shadow(0 10px 30px rgba(0,0,0,.8))${filtro ? ' ' + filtro : ''};">`;
/** Retrato de campeón: el ícono oficial de Data Dragon en círculo o cuadrado, con anillo. */
const campeon = (n, alt, { x, y, tam = 150, anillo = BLANCO, forma = 'circulo', k = '', extra = '', filtro = '' }) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; border-radius: ${forma === 'circulo' ? '50%' : '14px'}; overflow: hidden; border: ${Math.round(tam / 26)}px solid ${anillo}; box-sizing: border-box; box-shadow: 0 10px 30px rgba(0,0,0,.7); background: #000; ${extra}">
        <img src="assets/iconos/${n}.png" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.1);${filtro ? ` filter: ${filtro};` : ''}">
      </div>`;
/** Insignia redonda con un ícono (los candados, los bans y las palomitas encima de un retrato). */
const insignia = (id, { x, y, tam = 64, fondo = T1, color = BLANCO, k = '' }) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; border-radius: 50%; background: ${fondo}; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(0,0,0,.6);">${ico(id, { tam: Math.round(tam * 0.62), color, trazo: 2.4 })}</div>`;
/** Coach ilustrado sin cara: la diadema en un círculo y su nombre. */
const coach = (nombre, { x, y, tam = 150, color = BLANCO, k = '' }) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <div style="width: ${tam}px; height: ${tam}px; border-radius: 50%; border: 4px solid ${color}; background: ${a(color, 0.12)}; display: flex; align-items: center; justify-content: center;">${ico('headset', { tam: Math.round(tam * 0.58), color, trazo: 1.5 })}</div>
        <div style="font-size: ${Math.round(tam * 0.36)}px; line-height: 1; letter-spacing: 3px; color: ${color};">${nombre}</div>
      </div>`;
/** Barra de tira y afloja (kills de un mapa): rojo a la izquierda, azul a la derecha. */
const tira = (izq, der, { x, y, w, h = 36, k = 'tira' }) => {
  const wi = Math.round((w * izq) / (izq + der));
  return `
      <div data-k="${k}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; border-radius: ${h / 2}px; overflow: hidden; background: rgba(255,255,255,.06);">
        <div data-lado="izq" style="position: absolute; left: 0; top: 0; width: ${wi}px; height: 100%; background: ${T1}; transform-origin: 0 50%;"></div>
        <div data-lado="der" style="position: absolute; left: ${wi + 4}px; top: 0; width: ${w - wi - 4}px; height: 100%; background: ${BLG}; transform-origin: 100% 50%;"></div>
      </div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const svgPanel = (cuerpo, k = '') => `<svg${k ? ` data-k="${k}"` : ''} viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible; pointer-events: none;">${cuerpo}</svg>`;

const MENOS = '−', MIL = ' ';
const slides = [];

// ── 1 · tm-portada ─── 1 vs 9; Seraphine y Skarner libres ──
slides.push(lamina('tm-portada', 'Faker hizo uno contra nueve en el último mapa y su coach le dejó libres a Seraphine y a Skarner.', `
      ${respaldo('splash/Seraphine_0-fondo.jpg', { brillo: 0.3, pos: '45% 25%' })}
      ${brillo(T1, BLG, 0.22)}
      ${dato(`<span data-k="uno" style="color: ${T1};">1</span> <span data-k="vs" style="font-size: 120px; vertical-align: 40px;">VS</span> <span data-k="nueve">9</span>`, { y: 40, w: 600, tam: 300, tracking: 6 })}
      <div data-k="puntos" style="position: absolute; left: 60px; top: 380px; display: flex; align-items: center; gap: 14px;">
        <i style="display: block; width: 52px; height: 52px; border-radius: 50%; background: ${T1}; box-shadow: 0 0 24px ${a(T1, 0.7)};"></i>
        <i style="display: block; width: 18px;"></i>
        ${Array.from({ length: 9 }, () => `<i style="display: block; width: 36px; height: 36px; border-radius: 50%; background: ${GRIS};"></i>`).join('')}
      </div>
      ${campeon('Seraphine', 'Seraphine', { x: 690, y: 110, tam: 170, anillo: BLG, k: 'sera' })}
      ${campeon('Skarner', 'Skarner', { x: 870, y: 200, tam: 170, anillo: BLG, k: 'skar' })}
      ${insignia('lock-open', { x: 820, y: 100, tam: 62, fondo: BLG, color: BG, k: 'c1' })}
      ${insignia('lock-open', { x: 1000, y: 190, tam: 62, fondo: BLG, color: BG, k: 'c2' })}`));

// ── 2 · tm-chef ─── Tom cocinando la eliminación ──
slides.push(lamina('tm-chef', 'Le toca a Tom, el coach suplente de T1 que se cree chef y nos cocinó una eliminación.', `
      ${brillo(T1, T1, 0.3)}
      ${marca('T1', { x: 560, y: 180, w: 560, op: 0.07 })}
      <div data-k="gorro" style="position: absolute; left: 70px; top: 40px;">${ico('chef-hat', { tam: 300, trazo: 1.2 })}</div>
      <div data-k="flamas" style="position: absolute; left: 90px; top: 340px; display: flex; gap: 18px;">${[0, 1, 2].map(() => `<span style="display: block; transform-origin: 50% 100%;">${ico('flame', { tam: 82, color: T1, trazo: 2 })}</span>`).join('')}</div>
      ${dato('<span data-k="tom">TOM</span>', { x: 420, y: 70, w: 480, tam: 330, tracking: 14 })}`));

// ── 3 · tm-suplente ─── kkOma de licencia, Tom interino ──
const tarjeta = (x, w, k, cuerpo, borde) => `
      <div data-k="${k}" style="position: absolute; left: ${x}px; top: 66px; width: ${w}px; height: 390px; border-radius: 22px; border: 3px solid ${borde}; background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02));">${cuerpo}</div>`;
slides.push(lamina('tm-suplente', 'El coach titular es kkOma, pero anda de licencia desde marzo; el que se quedó a cargo es Tom.', `
      ${brillo(GRIS, T1, 0.22)}
      ${tarjeta(60, 380, 'kkoma', `
        ${coach('KKOMA', { x: 115, y: 40, tam: 150, color: a(BLANCO, 0.7) })}
        <div data-k="pausa" style="position: absolute; left: 40px; top: 280px; display: flex; align-items: center; gap: 14px;">${ico('calendar-pause', { tam: 64, color: BLANCO, trazo: 1.8 })}<span style="font-size: 50px; letter-spacing: 3px; white-space: nowrap;">DESDE MARZO</span></div>`, a(BLANCO, 0.25))}
      ${tarjeta(480, 420, 'tom', `
        ${coach('TOM', { x: 135, y: 40, tam: 150, color: BLANCO })}
        <div data-k="interino" style="position: absolute; left: 60px; top: 278px; padding: 10px 26px 4px; border-radius: 10px; background: ${T1}; font-size: 72px; line-height: 1; letter-spacing: 6px;">INTERINO</div>`, T1)}`));

// ── 4 · tm-2023 ─── el Mundial 2023 de interino: 3-0 a Weibo ──
slides.push(lamina('tm-2023', 'En 2023 también entró de interino y ganó el Mundial tres a cero.', `
      ${brillo(T1, '#FF8A3D', 0.22)}
      <div data-k="copa" style="position: absolute; left: 50px; top: 70px;">${ico('trophy', { tam: 280, trazo: 1.2 })}</div>
      ${dato('2023', { x: 360, y: 50, w: 540, tam: 130, tracking: 10, k: 'anio' })}
      ${logo('T1', 'Logo de T1', { x: 350, y: 255, w: 170, k: 'lt1' })}
      ${dato(`<span data-k="tres" style="display: inline-block;">3</span>-<span data-k="cero" style="display: inline-block;">0</span>`, { x: 530, y: 200, w: 240, tam: 170, alinear: 'center', tracking: 4, extra: 'white-space: nowrap;' })}
      ${logo('WBG', 'Logo de Weibo Gaming', { x: 785, y: 215, w: 130, k: 'lwbg', filtro: 'grayscale(.6) brightness(.8)' })}`));

// ── 5 · tm-daeny ─── Daeny: de Weibo (2023) a BLG (2026) ──
const ARCO = 'M 155 130 C 330 -10, 640 -10, 810 140';
slides.push(lamina('tm-daeny', 'Al Weibo de Daeny, que hoy es el coach de BLG.', `
      ${brillo('#FF8A3D', BLG, 0.22)}
      ${logo('WBG', 'Logo de Weibo Gaming', { x: 70, y: 215, w: 170, k: 'lwbg', filtro: 'grayscale(.5) brightness(.75)' })}
      ${logo('BLG', 'Logo de Bilibili Gaming', { x: 700, y: 240, w: 220, k: 'lblg' })}
      ${dato('2023', { x: 80, y: 385, w: 160, tam: 44, alinear: 'center', tracking: 4, extra: `color: ${a(BLANCO, 0.6)};`, k: 'a23' })}
      ${dato('2026', { x: 710, y: 385, w: 200, tam: 44, alinear: 'center', tracking: 4, extra: `color: ${BLG};`, k: 'a26' })}
      ${svgPanel(`<path data-k="arco" d="${ARCO}" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round" opacity=".7"/><path id="tm-arco" d="${ARCO}" fill="none" stroke="none"/>`)}
      <div data-k="daeny" style="position: absolute; left: 0; top: 0;">${coach('DAENY', { x: 0, y: 0, tam: 110, color: BLANCO })}</div>
      <div data-k="sello" style="position: absolute; left: 275px; top: 230px;">${kit.sello('LA REVANCHA', { color: T1, ancho: 420, alto: 112, rotacion: -5 })}</div>`));

// ── 6 · tm-mapa1 ─── mapa 1: T1 con la primera selección, 6-18 ──
slides.push(lamina('tm-mapa1', 'Mapa uno: T1 tiene la primera selección.', `
      ${brillo(T1, BLG, 0.24)}
      ${dato('MAPA 1', { y: 50, w: 420, tam: 130, tracking: 8, k: 'titulo' })}
      ${dato(`<span data-k="k1">6</span>-<span data-k="k2">18</span>`, { x: 470, y: 50, w: 430, tam: 130, color: T1, alinear: 'right', tracking: 4 })}
      <div data-k="pick" style="position: absolute; left: 60px; top: 205px; display: flex; align-items: center; gap: 16px; padding: 8px 22px 4px 12px; border-radius: 12px; background: ${a(T1, 0.18)}; border: 2px solid ${T1};"><img src="assets/logos/T1.png" alt="" style="height: 40px; width: auto;"><span style="font-size: 44px; letter-spacing: 3px;">1.ª SELECCIÓN</span></div>
      ${logo('T1', 'Logo de T1', { x: 60, y: 330, w: 130, k: 'lt1' })}
      ${tira(6, 18, { x: 215, y: 345, w: 560 })}
      ${logo('BLG', 'Logo de Bilibili Gaming', { x: 795, y: 325, w: 160, k: 'lblg' })}`));

// ── 7 · tm-nocturne ─── Nocturne de primer pick; Oner 0/4/4 ──
slides.push(lamina('tm-nocturne', 'Saca Nocturne. Oner termina cero cuatro cuatro y Xun le roba heraldo y dragón.', `
      ${respaldo('splash/Nocturne_0-fondo.jpg', { brillo: 0.45 })}
      ${arte('splash/Nocturne_0.jpg', 'Nocturne, splash', { x: 380, w: 700, pos: '60% 30%', zoom: 1.05, k: 'arte', filtro: 'brightness(1.25)' })}
      ${veloIzq(0.95)}
      <div data-k="pick" style="position: absolute; left: 60px; top: 60px; display: flex; align-items: center; gap: 14px;">${campeon('Nocturne', 'Nocturne', { x: 0, y: 0, tam: 96, anillo: T1, forma: 'cuadro', extra: 'position: relative;' })}<span style="font-size: 46px; letter-spacing: 3px; color: ${a(BLANCO, 0.85)};">1.er PICK</span></div>
      ${dato(`<span data-k="d1" style="display: inline-block;">0</span>/<span data-k="d2" style="display: inline-block;">4</span>/<span data-k="d3" style="display: inline-block;">4</span>`, { y: 190, w: 520, tam: 220, color: T1, tracking: 6 })}`));

// ── 8 · tm-rumble ─── Rumble a ciegas contra K'Sante ──
const CORTE = 30;
slides.push(lamina('tm-rumble', 'A Doran le dan un Rumble a ciegas para que BLG le conteste con K\'Sante.', `
      ${respaldo('splash/Rumble_0-fondo.jpg', { brillo: 0.4 })}
      <div data-k="izq" style="position: absolute; inset: 0; clip-path: polygon(0 0, ${540 + CORTE}px 0, ${540 - CORTE}px ${PH}px, 0 ${PH}px);">
        ${arte('splash/Rumble_0.jpg', 'Rumble, splash', { pos: '62% 28%', zoom: 1.15 })}
        <div style="position: absolute; inset: 0; background: linear-gradient(0deg, ${a(T1, 0.45)}, ${a(T1, 0)} 55%);"></div>
      </div>
      <div data-k="der" style="position: absolute; inset: 0; clip-path: polygon(${540 + CORTE}px 0, ${PW}px 0, ${PW}px ${PH}px, ${540 - CORTE}px ${PH}px);">
        ${arte('splash/KSante_0.jpg', 'K\'Sante, splash', { pos: '35% 20%', zoom: 1.15 })}
        <div style="position: absolute; inset: 0; background: linear-gradient(0deg, ${a(BLG, 0.45)}, ${a(BLG, 0)} 55%);"></div>
      </div>
      ${svgPanel(`<line x1="${540 + CORTE}" y1="0" x2="${540 - CORTE}" y2="${PH}" stroke="${BLANCO}" stroke-width="4"/>`)}
      ${insignia('eye-off', { x: 60, y: 60, tam: 92, fondo: T1, k: 'ciego' })}
      ${dato('RUMBLE', { y: 300, w: 440, tam: 120, tracking: 6, k: 'n1' })}
      ${dato('K\'SANTE', { x: 600, y: 300, w: 300, tam: 120, tracking: 6, alinear: 'right', k: 'n2', color: BLANCO })}
      <div data-k="vs" style="position: absolute; left: 470px; top: 120px; width: 140px; height: 140px; border-radius: 50%; background: ${BG}; border: 4px solid ${BLANCO}; display: flex; align-items: center; justify-content: center; font-size: 76px; padding-top: 6px; box-sizing: border-box;">VS</div>`));

// ── 9 · tm-mapa2 ─── el buen draft: Poppy, Lee Sin y Syndra; 22-10 ──
slides.push(lamina('tm-mapa2', 'El mapa dos sí lo cocinó: Poppy, Lee Sin y Syndra.', `
      ${respaldo('splash/Syndra_0-fondo.jpg', { brillo: 0.3, pos: '55% 25%' })}
      ${dato('MAPA 2', { y: 50, w: 420, tam: 130, tracking: 8, k: 'titulo' })}
      ${dato(`<span data-k="k1">22</span>-<span data-k="k2">10</span>`, { x: 470, y: 50, w: 430, tam: 130, alinear: 'right', tracking: 4 })}
      <div data-k="draft" style="position: absolute; left: 60px; top: 200px; width: 620px; height: 160px;">
        ${[['Poppy', 'Poppy'], ['LeeSin', 'Lee Sin'], ['Syndra', 'Syndra']].map(([n, alt], i) => `<div style="position: absolute; left: ${i * 200}px; top: 0; width: 160px; height: 160px;">${campeon(n, alt, { x: 0, y: 0, tam: 160, anillo: T1, forma: 'cuadro' })}${insignia('check', { x: 112, y: -14, tam: 58, fondo: T1 })}</div>`).join('')}
      </div>
      ${tira(22, 10, { x: 60, y: 400, w: 840, h: 30 })}`));

// ── 10 · tm-syndra ─── Faker con Syndra: 4/0/13 ──
slides.push(lamina('tm-syndra', 'Faker cuatro cero trece sin morir.', `
      ${respaldo('splash/Syndra_0-fondo.jpg', { brillo: 0.5, pos: '55% 20%' })}
      ${arte('splash/Syndra_0.jpg', 'Syndra, splash', { pos: '56% 22%', zoom: 1.12, k: 'arte' })}
      ${veloIzq(0.92)}
      ${dato(`<span data-k="d1">4</span>/<span data-k="d2">0</span>/<span data-k="d3">13</span>`, { y: 120, w: 560, tam: 240, tracking: 6 })}
      ${logo('T1', 'Logo de T1', { x: 64, y: 380, w: 150, k: 'lt1' })}`));

// ── 11 · tm-ezreal ─── Ezreal: BAN · BAN · LIBRE ──
slides.push(lamina('tm-ezreal', 'T1 se pasó dos mapas baneando el Ezreal y en el tercero se le olvida.', `
      ${respaldo('splash/Ezreal_0-fondo.jpg', { brillo: 0.3, pos: '35% 25%' })}
      ${[0, 1, 2].map((i) => {
        const x = 80 + i * 290, libre = i === 2;
        return `
      <div data-carta style="position: absolute; left: ${x}px; top: 70px; width: 220px; height: 360px;">
        <div style="font-size: 44px; letter-spacing: 4px; text-align: center; color: ${a(BLANCO, 0.75)};">MAPA ${i + 1}</div>
        ${campeon('Ezreal', 'Ezreal', { x: 20, y: 64, tam: 180, anillo: libre ? BLG : a(BLANCO, 0.35), forma: 'cuadro', filtro: libre ? '' : 'grayscale(1) brightness(.55)' })}
        <div data-k="marca${i}" style="position: absolute; left: 0; top: 268px; width: 220px; text-align: center; font-size: 76px; line-height: 1; letter-spacing: 6px; color: ${libre ? BLG : T1};">${libre ? 'LIBRE' : 'BAN'}</div>
        ${libre ? insignia('lock-open', { x: 160, y: 46, tam: 66, fondo: BLG, color: BG, k: 'candado' }) : `<div data-k="ban${i}" style="position: absolute; left: 50px; top: 94px; opacity: .92;">${ico('ban', { tam: 120, color: T1, trazo: 2.4 })}</div>`}
      </div>`;
      }).join('')}`));

// ── 12 · tm-viper ─── Viper con Ezreal: 7/1/8 y 41 % del daño ──
slides.push(lamina('tm-viper', 'Viper hace siete uno ocho con el cuarenta y uno por ciento del daño de su equipo.', `
      ${respaldo('splash/Ezreal_0-fondo.jpg', { brillo: 0.45 })}
      ${arte('splash/Ezreal_0.jpg', 'Ezreal, splash', { w: 560, pos: '30% 20%', zoom: 1.1, k: 'arte' })}
      <div style="position: absolute; left: 560px; top: 0; width: 520px; height: ${PH}px; background: ${a(BG, 0.9)};"></div>
      <div style="position: absolute; left: 558px; top: 0; width: 3px; height: ${PH}px; background: ${BLG};"></div>
      ${dato('<span data-k="kda">7/1/8</span>', { x: 590, y: 56, w: 320, tam: 130, color: T1, tracking: 4, extra: 'white-space: nowrap;' })}
      <div data-k="dona" style="position: absolute; left: 610px; top: 215px;">
        ${kit.dona([{ valor: 41, color: T1 }, { valor: 59, color: GRIS }], { tam: 250, grosor: 44, fondo: 'rgba(255,255,255,.06)', centro: { texto: '41%', cuenta: 41, sufijo: '%', color: BLANCO, tam: 76 } })}
      </div>`));

// ── 13 · tm-mapa4 ─── el mapa de la eliminación ──
slides.push(lamina('tm-mapa4', 'Y el mapa cuatro es el que me tiene así.', `
      ${brillo(T1, BLG, 0.3)}
      ${marca('T1', { x: 600, y: 60, w: 420, op: 0.06 })}
      ${dato('MAPA 4', { y: 40, w: 840, tam: 230, tracking: 12, k: 'titulo' })}
      <div data-k="mapas" style="position: absolute; left: 60px; top: 300px; display: flex; gap: 22px; align-items: flex-end;">
        ${[1, 2, 3, 4].map((n) => `<div style="width: ${n === 4 ? 230 : 150}px; height: ${n === 4 ? 130 : 96}px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: ${n === 4 ? 96 : 64}px; padding-top: 6px; box-sizing: border-box; ${n === 4 ? `background: ${T1}; box-shadow: 0 0 40px ${a(T1, 0.6)};` : `background: rgba(255,255,255,.07); color: ${a(BLANCO, 0.5)};`}">${n}</div>`).join('')}
      </div>`));

// ── 14 · tm-seraphine ─── baneada en el mapa 3, libre en el 4 ──
slides.push(lamina('tm-seraphine', 'T1 baneó a Seraphine en el mapa tres.', `
      ${respaldo('splash/Seraphine_0-fondo.jpg', { brillo: 0.45 })}
      ${arte('splash/Seraphine_0.jpg', 'Seraphine, splash', { x: 520, w: 560, pos: '45% 20%', zoom: 1.1, k: 'arte' })}
      ${veloIzq(0.95)}
      ${dato('BANEADA EN<br>EL MAPA 3', { y: 50, w: 520, tam: 96, tracking: 4, lh: 1, k: 'texto' })}
      ${campeon('Seraphine', 'Seraphine', { x: 60, y: 270, tam: 140, anillo: a(BLANCO, 0.35), forma: 'cuadro', k: 'm3', filtro: 'grayscale(1) brightness(.6)' })}
      <div data-k="ban" style="position: absolute; left: 72px; top: 282px;">${ico('ban', { tam: 116, color: T1, trazo: 2.4 })}</div>
      ${svgPanel(`<path data-k="flecha" d="M 225 340 L 315 340 M 295 318 L 318 340 L 295 362" fill="none" stroke="${BLANCO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`)}
      ${campeon('Seraphine', 'Seraphine', { x: 340, y: 270, tam: 140, anillo: BLG, forma: 'cuadro', k: 'm4' })}
      ${dato('MAPA 3', { x: 60, y: 420, w: 140, tam: 34, alinear: 'center', tracking: 3, extra: `color: ${a(BLANCO, 0.6)};` })}
      ${dato('MAPA 4', { x: 340, y: 420, w: 140, tam: 34, alinear: 'center', tracking: 3, extra: `color: ${BLG};` })}`));

// ── 15 · tm-skarner ─── nadie lo baneó en toda la serie ──
slides.push(lamina('tm-skarner', 'Y Skarner no lo baneó nadie en toda la serie.', `
      ${respaldo('splash/Skarner_0-fondo.jpg', { brillo: 0.45 })}
      ${arte('splash/Skarner_0.jpg', 'Skarner, splash', { x: 460, w: 620, pos: '45% 50%', zoom: 1.1, k: 'arte' })}
      ${veloIzq(0.95)}
      ${dato('<span data-k="cero" style="display: inline-block;">0</span> BANS', { y: 60, w: 560, tam: 200, color: T1, tracking: 8 })}
      <div data-k="casillas" style="position: absolute; left: 60px; top: 300px; display: flex; gap: 18px;">
        ${[1, 2, 3, 4].map((n) => `<div style="width: 100px; height: 120px; border-radius: 12px; border: 3px dashed ${a(BLANCO, 0.4)}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;"><span style="font-size: 54px; color: ${a(BLANCO, 0.35)};">—</span><span style="font-size: 30px; letter-spacing: 2px; color: ${a(BLANCO, 0.6)};">M${n}</span></div>`).join('')}
      </div>`));

// ── 16 · tm-bans ─── los bans que sí gastó: Kindred y Xin Zhao ──
slides.push(lamina('tm-bans', 'Y aun así Tom gasta sus bans en Kindred y en Xin Zhao y les deja a los dos.', `
      ${brillo(T1, BLG, 0.24)}
      ${dato('KINDRED · XIN ZHAO', { y: 50, w: 840, tam: 100, tracking: 6, k: 'texto' })}
      <div data-k="bans" style="position: absolute; left: 60px; top: 190px; width: 420px; height: 210px;">
        ${[['Kindred', 'Kindred'], ['XinZhao', 'Xin Zhao']].map(([n, alt], i) => `<div style="position: absolute; left: ${i * 210}px; top: 0; width: 180px; height: 180px;">${campeon(n, alt, { x: 0, y: 0, tam: 180, anillo: T1, forma: 'cuadro', filtro: 'grayscale(.7) brightness(.7)' })}<div data-ban style="position: absolute; left: 24px; top: 24px;">${ico('ban', { tam: 132, color: T1, trazo: 2.4 })}</div></div>`).join('')}
      </div>
      <div style="position: absolute; left: 520px; top: 190px; width: 3px; height: 180px; background: ${a(BLANCO, 0.2)};"></div>
      <div data-k="libres" style="position: absolute; left: 560px; top: 200px; width: 340px; height: 170px;">
        ${[['Seraphine', 'Seraphine'], ['Skarner', 'Skarner']].map(([n, alt], i) => `<div style="position: absolute; left: ${i * 170}px; top: 0; width: 150px; height: 150px;">${campeon(n, alt, { x: 0, y: 0, tam: 150, anillo: BLG })}${insignia('lock-open', { x: 100, y: -10, tam: 54, fondo: BLG, color: BG })}</div>`).join('')}
      </div>`));

// ── 17 · tm-on-xun ─── ON (Seraphine) y Xun (Skarner), los mejores del mapa ──
slides.push(lamina('tm-on-xun', 'Los mejores del mapa: On con Seraphine y Xun con Skarner.', `
      ${respaldo('splash/Skarner_0-fondo.jpg', { brillo: 0.3 })}
      ${brillo(BLG, BLG, 0.2)}
      ${marca('BLG', { x: 380, y: 140, w: 320, op: 0.08 })}
      ${[['Seraphine', 'Seraphine', '3/2/16', 110], ['Skarner', 'Skarner', '2/1/16', 560]].map(([n, alt, kda, x], i) => `
      <div data-jugador style="position: absolute; left: ${x}px; top: 60px; width: 340px; height: 380px;">
        <div data-corona style="position: absolute; left: 130px; top: 0;">${ico('crown', { tam: 80, color: BLG, trazo: 2 })}</div>
        ${campeon(n, alt, { x: 80, y: 74, tam: 180, anillo: BLG })}
        <div data-kda style="position: absolute; left: 0; top: 270px; width: 340px; text-align: center; font-size: 110px; line-height: 1; letter-spacing: 4px; color: ${BLG}; text-shadow: 0 6px 30px rgba(0,0,0,.85);">${kda}</div>
      </div>`).join('')}`));

// ── 18 · tm-vayne ─── la Vayne de último pick, recién nerfeada ──
slides.push(lamina('tm-vayne', 'Le guardan el último pick para una Vayne recién nerfeada.', `
      ${respaldo('splash/Vayne_0-fondo.jpg', { brillo: 0.32, pos: '62% 25%' })}
      ${dato('ÚLTIMO PICK', { y: 50, w: 840, tam: 130, tracking: 8, k: 'texto' })}
      <div data-k="casillas" style="position: absolute; left: 60px; top: 240px; display: flex; gap: 16px; align-items: center;">
        ${[1, 2, 3, 4].map((n) => `<div style="width: 104px; height: 104px; border-radius: 12px; border: 3px solid ${a(BLANCO, 0.22)}; background: rgba(255,255,255,.04); display: flex; align-items: center; justify-content: center; font-size: 48px; padding-top: 4px; box-sizing: border-box; color: ${a(BLANCO, 0.35)};">${n}</div>`).join('')}
      </div>
      ${campeon('Vayne', 'Vayne', { x: 560, y: 200, tam: 190, anillo: T1, forma: 'cuadro', k: 'vayne', extra: `box-shadow: 0 0 40px ${a(T1, 0.55)};` })}
      <div data-k="nerf" style="position: absolute; left: 770px; top: 205px; width: 110px; height: 110px; border-radius: 50%; background: ${T1}; display: flex; align-items: center; justify-content: center;">${ico('arrow-down-right', { tam: 76, color: BLANCO, trazo: 2.6 })}</div>`));

// ── 19 · tm-sion ─── Sion libre, con 7-1 en el año ──
slides.push(lamina('tm-sion', 'Con el Sion libre ahí, con el que iba siete a uno.', `
      ${respaldo('splash/Sion_0-fondo.jpg', { brillo: 0.6, pos: '65% 40%' })}
      ${arte('splash/Sion_0.jpg', 'Sion, splash', { x: 480, w: 600, pos: '66% 40%', zoom: 1.1, k: 'arte', filtro: 'brightness(1.5) contrast(1.05)' })}
      ${veloIzq(0.95)}
      ${insignia('lock-open', { x: 960, y: 60, tam: 80, fondo: BLG, color: BG, k: 'candado' })}
      ${dato('<span data-k="w">7</span>-<span data-k="l">1</span>', { y: 60, w: 420, tam: 260, tracking: 8 })}
      <div data-k="record" style="position: absolute; left: 60px; top: 360px; display: flex; gap: 12px;">
        ${Array.from({ length: 8 }, (_, i) => `<div style="width: 50px; height: 50px; border-radius: 10px; background: ${i < 7 ? BLANCO : T1}; display: flex; align-items: center; justify-content: center; font-size: 34px; padding-top: 3px; box-sizing: border-box; color: ${i < 7 ? BG : BLANCO};">${i < 7 ? 'V' : 'D'}</div>`).join('')}
      </div>`));

// ── 20 · tm-oro ─── Doran contra Bin al minuto 15: −1 466 ──
slides.push(lamina('tm-oro', 'Al minuto quince Doran ya iba mil cuatrocientos de oro abajo.', `
      ${brillo(T1, BLG, 0.24)}
      ${campeon('Vayne', 'Vayne', { x: 60, y: 60, tam: 140, anillo: T1, k: 'c1' })}
      ${dato('VS', { x: 220, y: 100, w: 80, tam: 64, alinear: 'center', k: 'vs' })}
      ${campeon('Renekton', 'Renekton', { x: 320, y: 60, tam: 140, anillo: BLG, k: 'c2' })}
      <div data-k="reloj" style="position: absolute; left: 520px; top: 86px; display: flex; align-items: center; gap: 14px;">${ico('clock', { tam: 80, trazo: 1.8 })}<span style="font-size: 72px; letter-spacing: 3px;">15:00</span></div>
      ${dato(`<span data-k="oro">${MENOS}1${MIL}466</span>`, { y: 230, w: 640, tam: 210, color: T1, tracking: 6 })}
      <div data-k="monedas" style="position: absolute; left: 700px; top: 250px;">${ico('coins', { tam: 170, color: '#E8B54D', trazo: 1.4 })}</div>`));

// ── 21 · tm-top ─── Bin ganó la línea los cuatro mapas ──
slides.push(lamina('tm-top', 'Bin les ganó la línea los cuatro mapas.', `
      ${respaldo('splash/Renekton_0-fondo.jpg', { brillo: 0.32 })}
      ${dato('4 DE 4', { y: 50, w: 840, tam: 200, color: T1, tracking: 10, k: 'texto' })}
      <div data-k="mapas" style="position: absolute; left: 60px; top: 290px; display: flex; gap: 22px;">
        ${[1, 2, 3, 4].map((n) => `<div data-mapa style="position: relative; width: 190px; height: 130px; border-radius: 14px; background: rgba(255,255,255,.06); border: 2px solid ${a(BLG, 0.5)};">
          <span style="position: absolute; left: 16px; top: 12px; font-size: 34px; letter-spacing: 2px; color: ${a(BLANCO, 0.6)};">MAPA ${n}</span>
          <svg viewBox="0 0 190 130" style="position: absolute; inset: 0; width: 190px; height: 130px;"><path data-palomita d="M 110 78 L 132 100 L 172 56" fill="none" stroke="${BLG}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <img src="assets/logos/BLG.png" alt="" style="position: absolute; left: 16px; top: 72px; width: 84px; height: auto;">
        </div>`).join('')}
      </div>`));

// ── 22 · tm-veredicto ─── el veredicto ──
slides.push(lamina('tm-veredicto', 'Veredicto: no todo es culpa de Tom.', `
      ${brillo(T1, BLG, 0.26)}
      <div data-k="impacto" style="position: absolute; left: 0; top: 0; width: 480px; height: ${PH}px;">${kit.impacto({ ancho: 480, alto: PH, n: 40, centro: [0.42, 0.58], hueco: 0.4, semilla: 'mazo-tom' })}</div>
      <div data-k="mazo" style="position: absolute; left: 60px; top: 70px; transform-origin: 80% 85%;">${ico('gavel', { tam: 300, trazo: 1.3 })}</div>
      ${dato('<span data-k="texto">VEREDICTO</span>', { x: 380, y: 170, w: 520, tam: 140, tracking: 6, extra: 'white-space: nowrap;' })}`));

// ── 23 · tm-tarea ─── no hizo la tarea ──
slides.push(lamina('tm-tarea', 'No le puedes regalar al rival los dos campeones que ya sabías. Es no hacer la tarea.', `
      ${brillo(T1, T1, 0.22)}
      <div data-k="libreta" style="position: absolute; left: 60px; top: 60px; width: 400px; height: 380px; border-radius: 18px; background: repeating-linear-gradient(180deg, rgba(255,255,255,.05) 0 2px, transparent 2px 46px), #18181E; border: 2px solid ${a(BLANCO, 0.2)}; box-shadow: 0 16px 40px rgba(0,0,0,.6);">
        <div style="position: absolute; left: 30px; top: 22px;">${ico('notebook', { tam: 70, trazo: 1.6 })}</div>
        ${[['Seraphine', 'Seraphine', 120], ['Skarner', 'Skarner', 240]].map(([n, alt, y]) => `<div data-fila style="position: absolute; left: 30px; top: ${y}px; display: flex; align-items: center; gap: 18px;"><div style="width: 56px; height: 56px; border-radius: 10px; border: 4px solid ${a(BLANCO, 0.6)};"></div>${campeon(n, alt, { x: 0, y: 0, tam: 96, anillo: BLG, forma: 'cuadro', extra: 'position: relative;' })}<span style="font-size: 46px; letter-spacing: 2px;">BAN</span></div>`).join('')}
        <svg viewBox="0 0 400 380" style="position: absolute; inset: 0; width: 400px; height: 380px; overflow: visible;"><g data-k="tachon" fill="none" stroke="${T1}" stroke-width="16" stroke-linecap="round"><path d="M 40 90 L 360 350"/><path d="M 360 90 L 40 350"/></g></svg>
      </div>
      ${dato('NO HIZO<br>LA TAREA', { x: 500, y: 110, w: 400, tam: 120, tracking: 4, lh: 1, k: 'texto' })}`));

// ── 24 · tm-faker ─── «Bilibili se preparó mejor» ──
slides.push(lamina('tm-faker', 'Lo dijo Faker después de la serie: Bilibili se preparó mejor que nosotros.', `
      ${brillo(T1, BLG, 0.22)}
      ${marca('BLG', { x: 640, y: 300, w: 420, op: 0.06 })}
      <div data-k="comillas" style="position: absolute; left: 50px; top: 40px;">${ico('quote', { tam: 140, color: T1, trazo: 2 })}</div>
      ${dato('<span data-k="cita">«BILIBILI SE PREPARÓ MEJOR»</span>', { y: 170, w: 840, tam: 112, tracking: 3, lh: 1.02 })}
      ${logo('T1', 'Logo de T1', { x: 64, y: 400, w: 120, k: 'lt1' })}`));

// ── 25 · tm-respeto ─── el Mundial 2023 que le debemos ──
slides.push(lamina('tm-respeto', 'Tom, te respeto porque me diste un Mundial que nadie esperaba.', `
      ${brillo(T1, '#E8B54D', 0.24)}
      <div data-k="copa" style="position: absolute; left: 60px; top: 70px;">${ico('trophy', { tam: 300, color: '#E8B54D', trazo: 1.2 })}</div>
      ${dato('<span data-k="t1">MUNDIAL</span>', { x: 400, y: 80, w: 500, tam: 150, tracking: 8 })}
      ${dato('<span data-k="t2" style="display: inline-block;">2023</span>', { x: 400, y: 230, w: 380, tam: 190, tracking: 10, color: T1 })}
      ${coach('TOM', { x: 800, y: 300, tam: 80, color: a(BLANCO, 0.8), k: 'tom' })}`));

// ── 26 · tm-kkoma ─── el titular que no ha vuelto: casi 8 meses ──
const MESES = ['MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT'];
slides.push(lamina('tm-kkoma', 'El titular lleva casi ocho meses de baja.', `
      ${brillo(GRIS, T1, 0.22)}
      ${dato('CASI <span data-k="ocho">8</span> MESES', { y: 60, w: 680, tam: 120, tracking: 5, extra: 'white-space: nowrap;' })}
      ${coach('KKOMA', { x: 760, y: 40, tam: 110, color: a(BLANCO, 0.7), k: 'kkoma' })}
      <div data-k="meses" style="position: absolute; left: 60px; top: 260px; display: flex; gap: 12px;">
        ${MESES.map((m, i) => `<div style="position: relative; width: 92px; height: 150px; border-radius: 12px; background: rgba(255,255,255,.06); overflow: hidden;">
          <div data-relleno style="position: absolute; left: 0; bottom: 0; width: 100%; height: ${i === 7 ? 70 : 100}%; background: ${a(T1, 0.75)}; transform-origin: 50% 100%;"></div>
          <div style="position: absolute; left: 0; top: 46px; width: 100%; display: flex; justify-content: center;">${ico('calendar-pause', { tam: 44, trazo: 1.8 })}</div>
          <span style="position: absolute; left: 0; bottom: 10px; width: 100%; text-align: center; font-size: 34px; letter-spacing: 2px;">${m}</span>
        </div>`).join('')}
      </div>`));

// ── 27 · tm-dinero ─── T1, de los equipos con más dinero del LoL ──
const rM = kit.random('monedas-tom');
const MONEDAS = Array.from({ length: 16 }, (_, i) => ({ x: Math.round(40 + (i % 8) * 128 + rM() * 50), y: Math.round(i < 8 ? 70 + rM() * 90 : 360 + rM() * 120), tam: Math.round(64 + rM() * 40), giro: Math.round((rM() - 0.5) * 50) }));
slides.push(lamina('tm-dinero', 'Este es de los equipos con más dinero en el mundo del League of Legends.', `
      ${brillo(T1, '#E8B54D', 0.26)}
      <div data-k="monedas" style="position: absolute; inset: 0;">
        ${MONEDAS.map((m) => `<div style="position: absolute; left: ${m.x}px; top: ${m.y}px; transform: rotate(${m.giro}deg); opacity: .85;">${ico('coins', { tam: m.tam, color: '#E8B54D', trazo: 1.6 })}</div>`).join('')}
      </div>
      ${logo('T1', 'Logo de T1', { x: 290, y: 200, w: 500, k: 'lt1' })}`));

// ── 28 · tm-cierre ─── ¿tanto permiso al genio? ──
slides.push(lamina('tm-cierre', '¿O se le debería de dar tanto permiso al genio?', `
      ${brillo(T1, BLG, 0.26)}
      ${marca('T1', { x: 560, y: 220, w: 520, op: 0.08 })}
      ${dato('<span data-k="pregunta">¿?</span>', { y: 20, w: 520, tam: 420, tracking: 10, color: T1 })}
      <div data-k="gorro" style="position: absolute; left: 600px; top: 70px;">${ico('chef-hat', { tam: 200, trazo: 1.3 })}</div>
      ${dato('TOM', { x: 600, y: 290, w: 200, tam: 90, alinear: 'center', tracking: 10, k: 'nombre' })}`));

// ── reposo ─── la banda sin dato ──
slides.push(lamina('tm-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${brillo(T1, BLG, 0.2)}
      ${marca('T1', { x: 140, y: 230, w: 360, op: 0.08 })}
      ${marca('BLG', { x: 620, y: 230, w: 320, op: 0.08 })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;
  var entra = function (tl, el, en, o) {
    if (!el) return;
    o = o || {};
    tl.fromTo(el, { opacity: 0, x: o.x || 0, y: o.y == null ? 18 : o.y, scale: o.escala || 1 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: o.dur || 0.5, ease: o.ease || 'entrada', immediateRender: true, stagger: o.escalon || 0 }, en);
  };
  var pop = function (tl, els, en, esc) { tl.from(els, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.42, ease: 'golpe', stagger: esc || 0.07 }, en); };
  var tiraCrece = function (tl, s, en) {
    var t = k(s, 'tira'); if (!t) return;
    tl.from(t.querySelector('[data-lado="izq"]'), { scaleX: 0, duration: 0.9, ease: 'entrada' }, en);
    tl.from(t.querySelector('[data-lado="der"]'), { scaleX: 0, duration: 0.9, ease: 'entrada' }, en + 0.1);
  };
  var C = {
    'tm-portada': function (tl, s) {
      efecto('palabra', tl, k(s, 'uno'), { en: 0.15 });
      entra(tl, k(s, 'vs'), 0.4, { escala: 0.6 });
      efecto('contador', tl, k(s, 'nueve'), { en: 0.45, dur: 0.9, cuenta: 9 });
      pop(tl, k(s, 'puntos').children, 0.3, 0.06);
      entra(tl, k(s, 'sera'), 0.9, { x: 120, y: 0 }); entra(tl, k(s, 'skar'), 1.05, { x: 120, y: 0 });
      pop(tl, [k(s, 'c1'), k(s, 'c2')], 1.45, 0.12);
    },
    'tm-chef': function (tl, s) {
      tl.from(k(s, 'gorro'), { opacity: 0, duration: 0.12 }, 0);
      efecto('dibujo', tl, k(s, 'gorro'), { dur: 1.2, escalon: 0 });
      efecto('letras', tl, k(s, 'tom'), { en: 0.5, escalon: 0.08 });
      var fl = k(s, 'flamas').children;
      tl.from(fl, { scaleY: 0, opacity: 0, duration: 0.45, ease: 'golpe', stagger: 0.1 }, 0.9);
      tl.to(fl, { scaleY: 1.15, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut', stagger: 0.07 }, 1.4);
    },
    'tm-suplente': function (tl, s) {
      entra(tl, k(s, 'kkoma'), 0.1, { y: 60 }); entra(tl, k(s, 'tom'), 0.25, { y: 60 });
      tl.to(k(s, 'kkoma'), { opacity: 0.5, filter: 'grayscale(1)', duration: 0.6, ease: 'power1.inOut' }, 1.1);
      pop(tl, k(s, 'pausa'), 1.15);
      tl.from(k(s, 'interino'), { clipPath: 'inset(0 100% 0 0)', duration: 0.5, ease: 'entrada' }, 1.3);
    },
    'tm-2023': function (tl, s) {
      tl.from(k(s, 'copa'), { opacity: 0, duration: 0.12 }, 0);
      efecto('dibujo', tl, k(s, 'copa'), { dur: 1.2, escalon: 0 });
      efecto('letras', tl, k(s, 'anio'), { en: 0.2, escalon: 0.06 });
      entra(tl, k(s, 'lt1'), 0.6, { x: -80, y: 0 }); entra(tl, k(s, 'lwbg'), 0.7, { x: 80, y: 0 });
      efecto('tragamonedas', tl, k(s, 'tres'), { en: 0.8, dur: 1.1 });
      efecto('tragamonedas', tl, k(s, 'cero'), { en: 0.9, dur: 1.1 });
    },
    'tm-daeny': function (tl, s) {
      entra(tl, k(s, 'lwbg'), 0.05, { escala: 0.8 }); entra(tl, k(s, 'a23'), 0.2);
      tl.from(k(s, 'arco'), { opacity: 0, duration: 0.4 }, 0.35);
      efecto('trayectoria', tl, k(s, 'daeny'), { camino: '#tm-arco', en: 0.4, dur: 1.1, ease: 'power2.inOut' });
      tl.from(k(s, 'daeny'), { opacity: 0, duration: 0.25 }, 0.4);
      entra(tl, k(s, 'lblg'), 1.2, { escala: 0.7 }); entra(tl, k(s, 'a26'), 1.3);
      efecto('sello', tl, k(s, 'sello'), { en: 1.65, fuerza: 10 });
    },
    'tm-mapa1': function (tl, s) {
      efecto('letras', tl, k(s, 'titulo'), { escalon: 0.05 });
      efecto('contador', tl, k(s, 'k1'), { en: 0.5, dur: 1.1, cuenta: 6 });
      efecto('contador', tl, k(s, 'k2'), { en: 0.5, dur: 1.1, cuenta: 18 });
      tl.from(k(s, 'pick'), { clipPath: 'inset(0 100% 0 0)', duration: 0.55, ease: 'entrada' }, 0.35);
      entra(tl, k(s, 'lt1'), 0.7, { x: -60, y: 0 }); entra(tl, k(s, 'lblg'), 0.75, { x: 60, y: 0 });
      tiraCrece(tl, s, 0.85);
    },
    'tm-nocturne': function (tl, s) {
      tl.fromTo(k(s, 'arte'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power3.inOut', immediateRender: true }, 0);
      entra(tl, k(s, 'pick'), 0.3, { x: -40, y: 0 });
      ['d1', 'd2', 'd3'].forEach(function (n, i) { efecto('tragamonedas', tl, k(s, n), { en: 0.6 + i * 0.15, dur: 1.1 }); });
    },
    'tm-rumble': function (tl, s) {
      tl.from(k(s, 'izq'), { xPercent: -60, duration: 0.8, ease: 'power3.out' }, 0);
      tl.from(k(s, 'der'), { xPercent: 60, duration: 0.8, ease: 'power3.out' }, 0.1);
      efecto('sello', tl, k(s, 'vs'), { en: 0.8, temblor: 'no' });
      pop(tl, k(s, 'ciego'), 0.95);
      entra(tl, k(s, 'n1'), 1.1, { x: -40, y: 0 }); entra(tl, k(s, 'n2'), 1.2, { x: 40, y: 0 });
    },
    'tm-mapa2': function (tl, s) {
      efecto('letras', tl, k(s, 'titulo'), { escalon: 0.05 });
      efecto('contador', tl, k(s, 'k1'), { en: 0.5, dur: 1.1, cuenta: 22 });
      efecto('contador', tl, k(s, 'k2'), { en: 0.5, dur: 1.1, cuenta: 10 });
      efecto('mazo', tl, k(s, 'draft'), { en: 0.35, escalon: 0.12, semilla: 'draft-m2' });
      pop(tl, [].map.call(k(s, 'draft').children, function (c) { return c.lastElementChild; }), 1.1, 0.12);
      tiraCrece(tl, s, 1.0);
    },
    'tm-syndra': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.2, origen: '56% 22%', dur: 2.4 });
      efecto('contador', tl, k(s, 'd1'), { en: 0.4, dur: 0.8, cuenta: 4 });
      efecto('contador', tl, k(s, 'd2'), { en: 0.55, dur: 0.6, cuenta: 0 });
      efecto('contador', tl, k(s, 'd3'), { en: 0.7, dur: 1.1, cuenta: 13 });
      entra(tl, k(s, 'lt1'), 1.3);
    },
    'tm-ezreal': function (tl, s) {
      var cartas = q(s, '[data-carta]');
      tl.from(cartas, { y: -80, opacity: 0, duration: 0.55, ease: 'asentar', stagger: 0.18 }, 0.05);
      efecto('sello', tl, k(s, 'ban0'), { en: 0.75, temblor: 'no', desde: 2 });
      efecto('sello', tl, k(s, 'ban1'), { en: 1.05, temblor: 'no', desde: 2 });
      pop(tl, [k(s, 'marca0'), k(s, 'marca1')], 0.85, 0.3);
      pop(tl, [k(s, 'candado'), k(s, 'marca2')], 1.45, 0.12);
    },
    'tm-viper': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.18, origen: '30% 20%', dur: 2.4 });
      efecto('letras', tl, k(s, 'kda'), { en: 0.2, escalon: 0.07 });
      efecto('dona', tl, k(s, 'dona'), { en: 0.5, dur: 1.3 });
    },
    'tm-mapa4': function (tl, s) {
      efecto('letras', tl, k(s, 'titulo'), { escalon: 0.06, desde: 'center' });
      var m = k(s, 'mapas').children;
      tl.from([].slice.call(m, 0, 3), { y: 40, opacity: 0, duration: 0.4, ease: 'entrada', stagger: 0.1 }, 0.5);
      tl.from(m[3], { scale: 0.3, opacity: 0, transformOrigin: '50% 100%', duration: 0.55, ease: 'golpe' }, 0.9);
    },
    'tm-seraphine': function (tl, s) {
      tl.fromTo(k(s, 'arte'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.inOut', immediateRender: true }, 0);
      efecto('lineas', tl, k(s, 'texto'), { en: 0.2 });
      entra(tl, k(s, 'm3'), 0.6, { escala: 0.7 });
      efecto('sello', tl, k(s, 'ban'), { en: 0.95, temblor: 'no', desde: 2 });
      efecto('dibujo', tl, k(s, 'flecha'), { en: 1.25, dur: 0.4, escalon: 0 });
      entra(tl, k(s, 'm4'), 1.5, { escala: 0.7 });
    },
    'tm-skarner': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.2, origen: '45% 50%', dur: 2.4 });
      efecto('tragamonedas', tl, k(s, 'cero'), { en: 0.2, dur: 1.3 });
      tl.from(k(s, 'casillas').children, { opacity: 0, y: 30, duration: 0.4, ease: 'entrada', stagger: 0.12 }, 0.7);
    },
    'tm-bans': function (tl, s) {
      efecto('lineas', tl, k(s, 'texto'));
      var b = k(s, 'bans').children;
      tl.from(b, { y: -60, opacity: 0, duration: 0.5, ease: 'asentar', stagger: 0.15 }, 0.3);
      q(s, '[data-ban]').forEach(function (x, i) { efecto('sello', tl, x, { en: 0.85 + i * 0.2, temblor: 'no', desde: 2 }); });
      tl.from(k(s, 'libres').children, { x: 60, opacity: 0, duration: 0.5, ease: 'entrada', stagger: 0.12 }, 1.35);
    },
    'tm-on-xun': function (tl, s) {
      var j = q(s, '[data-jugador]');
      tl.from(j, { y: 50, opacity: 0, duration: 0.55, ease: 'entrada', stagger: 0.2 }, 0.1);
      tl.from(q(s, '[data-corona]'), { y: -40, opacity: 0, duration: 0.45, ease: 'golpe', stagger: 0.2 }, 0.75);
      q(s, '[data-kda]').forEach(function (x, i) { efecto('letras', tl, x, { en: 0.9 + i * 0.2, escalon: 0.05 }); });
    },
    'tm-vayne': function (tl, s) {
      efecto('letras', tl, k(s, 'texto'), { escalon: 0.04 });
      tl.from(k(s, 'casillas').children, { scale: 0.6, opacity: 0, duration: 0.35, ease: 'golpe', stagger: 0.1 }, 0.35);
      entra(tl, k(s, 'vayne'), 0.9, { escala: 0.4, dur: 0.6, ease: 'golpe' });
      tl.from(k(s, 'nerf'), { y: -60, opacity: 0, duration: 0.45, ease: 'golpe' }, 1.4);
    },
    'tm-sion': function (tl, s) {
      tl.fromTo(k(s, 'arte'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power3.inOut', immediateRender: true }, 0);
      efecto('contador', tl, k(s, 'w'), { en: 0.3, dur: 1, cuenta: 7 });
      efecto('contador', tl, k(s, 'l'), { en: 0.3, dur: 0.6, cuenta: 1 });
      pop(tl, k(s, 'record').children, 0.6, 0.08);
      pop(tl, k(s, 'candado'), 1.3);
    },
    'tm-oro': function (tl, s) {
      entra(tl, k(s, 'c1'), 0.05, { x: -50, y: 0 }); entra(tl, k(s, 'vs'), 0.2, { escala: 0.5 }); entra(tl, k(s, 'c2'), 0.25, { x: 50, y: 0 });
      tl.from(k(s, 'reloj'), { opacity: 0, x: 40, duration: 0.45, ease: 'entrada' }, 0.4);
      efecto('contador', tl, k(s, 'oro'), { en: 0.6, dur: 1.4, cuenta: 1466, prefijo: '${MENOS}' });
      tl.from(k(s, 'monedas'), { y: -120, opacity: 0, rotation: -20, duration: 0.6, ease: 'asentar' }, 0.9);
    },
    'tm-top': function (tl, s) {
      efecto('letras', tl, k(s, 'texto'), { escalon: 0.05 });
      tl.from(q(s, '[data-mapa]'), { y: 40, opacity: 0, duration: 0.45, ease: 'entrada', stagger: 0.14 }, 0.3);
      q(s, '[data-palomita]').forEach(function (p, i) { efecto('dibujo', tl, p.parentNode, { en: 0.8 + i * 0.2, dur: 0.35, escalon: 0 }); });
    },
    'tm-veredicto': function (tl, s) {
      tl.from(k(s, 'mazo'), { rotation: -48, duration: 0.45, ease: 'power3.in' }, 0.25);
      efecto('impacto', tl, k(s, 'impacto'), { en: 0.68, dur: 0.6, semilla: 'mazo-tom' });
      tl.to(k(s, 'mazo'), { keyframes: [{ y: -10, duration: 0.08 }, { y: 0, duration: 0.12 }], ease: 'none' }, 0.7);
      efecto('letras', tl, k(s, 'texto'), { en: 0.75, escalon: 0.05 });
    },
    'tm-tarea': function (tl, s) {
      entra(tl, k(s, 'libreta'), 0.05, { x: -60, y: 0 });
      tl.from(q(s, '[data-fila]'), { opacity: 0, x: -30, duration: 0.4, ease: 'entrada', stagger: 0.15 }, 0.45);
      efecto('dibujo', tl, k(s, 'tachon'), { en: 1.0, dur: 0.35, escalon: 0.18 });
      efecto('lineas', tl, k(s, 'texto'), { en: 1.2 });
    },
    'tm-faker': function (tl, s) {
      pop(tl, k(s, 'comillas'), 0.1);
      efecto('golpe', tl, k(s, 'cita'), { en: 0.4, escalon: 0.24 });
      entra(tl, k(s, 'lt1'), 1.5);
    },
    'tm-respeto': function (tl, s) {
      tl.from(k(s, 'copa'), { opacity: 0, duration: 0.12 }, 0);
      efecto('dibujo', tl, k(s, 'copa'), { dur: 1.3, escalon: 0 });
      efecto('letras', tl, k(s, 't1'), { en: 0.3, escalon: 0.05 });
      entra(tl, k(s, 't2'), 0.6, { escala: 0.8 });
      efecto('brillo', tl, k(s, 't2'), { en: 1.1, dur: 1.1, color: '#FFD3DA' });
      entra(tl, k(s, 'tom'), 1.0);
    },
    'tm-kkoma': function (tl, s) {
      efecto('contador', tl, k(s, 'ocho'), { en: 0.3, dur: 1.6, cuenta: 8, ease: 'none' });
      tl.from(q(s, '[data-relleno]'), { scaleY: 0, duration: 0.25, ease: 'power1.out', stagger: 0.2 }, 0.3);
      entra(tl, k(s, 'kkoma'), 0.1, { x: 40, y: 0 });
    },
    'tm-dinero': function (tl, s) {
      tl.from(k(s, 'monedas').children, { y: -260, opacity: 0, duration: 0.65, ease: 'asentar', stagger: { each: 0.06, from: 'random' } }, 0);
      entra(tl, k(s, 'lt1'), 0.5, { escala: 0.7, dur: 0.6, ease: 'golpe' });
    },
    'tm-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'pregunta'), { en: 0.25, letras: 'si', escalon: 0.2 });
      tl.from(k(s, 'gorro'), { opacity: 0, duration: 0.12 }, 0.5);
      efecto('dibujo', tl, k(s, 'gorro'), { en: 0.5, dur: 1.1, escalon: 0 });
      entra(tl, k(s, 'nombre'), 1.3);
    },
    'tm-reposo': function () {},
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
<title>El draft de Tom</title>
${kit.og({ titulo: 'El draft de Tom', descripcion: 'El draft de T1 contra BLG, mapa por mapa, en banda inferior: el interino que ganó el Mundial 2023, el buen mapa 2, el Ezreal libre del 3 y la Seraphine y el Skarner que dejó en el 4.', carpeta: 'creator/tom-draft' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
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
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="abajo">
${slides.join('\n')}
</deck-stage>
${kit.banda()}
${kit.gsap(__dirname, ['SplitText', 'MotionPath'])}
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
