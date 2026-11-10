// Generador de index.html — Previa T1 vs BLG (semifinal del Mundial 2026), formato «banda inferior»
// Ejecutar: node creator/t1-blg/gen.js   ·   clips: node tools/laminas.mjs creator/t1-blg --alfa=webm
//
// Video del canal Axelsine del domingo 8/11/2026, antes del partido de las 16:00 CDMX.
// Sigue el paquete de Axl `2026-11-08_previa-t1-vs-blg-paquete-presentacion.md`
// (PKB/redes-sociales/creador-de-contenido-axelsine/worlds-2026/semifinales/): 24 láminas
// con su palabra de entrada en `video-out/laminas/guion-marcado.txt`, más `tb-reposo`.
//
// 🎯 **Formato «banda inferior», el mismo de ambessa** (pedido de Axl del 8/11; la primera
// versión, en el panel de 1080×1370, quedó en el commit 1a86ba7):
//   · el prereel deja libre una franja de 1080×680 desde y = 1240 y el deck la declara en
//     <deck-stage data-recorte="1080:680:0:1240">: laminas.mjs y la API del estudio cortan con
//     ese recorte y la caja sale {width: 1080, x: center, bottom: 0};
//   · la banda es OPACA de borde a borde: dentro del panel nada lleva data-fondo (el único es
//     la guía «GAMEPLAY» de arriba, que nunca sale en un clip);
//   · **un riel común** (líneas finas en blanco, marcas y seis destellos, tres en el rojo de T1
//     arriba y tres en el azul de BLG abajo) que es el mismo markup en todas las láminas y queda
//     **idéntico en el primer y el último cuadro**: el fundido de 0,25 s de ReelForge no lo corta;
//   · **cada lámina entra con su propia transición** (tabla TRANSICION), que mueve el
//     [data-contenido] entero; el riel va encima, quieto. En el cuadro 0 se ve solo la banda
//     vacía con el riel, igual en todas;
//   · `tb-reposo` (data-reposo): la banda sin dato para los huecos entre láminas.
// Lo que NO se trajo de ambessa, por las reglas de este paquete: ni chispas, ni destellos al
// llegar el dato, ni sellos, ni impacto, ni confeti. Dentro de cada lámina solo hay arte
// oficial (splashes, pantallas de carga, tiles de Data Dragon y logos de lolesports), la cámara
// y el dato, que entra con un fundido corto. Todo dura 2,5 s como máximo y es determinista.
//
// Paleta: negro `#0B0B0E`; **las cifras de T1 en su rojo `#E4002B` y las de BLG en su azul
// celeste `#36CFF3`**, muestreados de los logos; lo neutro en blanco. Sin dinero.
//
// Decisiones de Axl del 8/11 (las fotos se preguntaron antes de bajar nada):
//   · plan B en las cuatro láminas con foto: `tb-gen` lleva el logo de GEN sobre el splash de
//     Ahri desenfocado; `tb-once`, T1 Galio; `tb-2024`, los logos de T1 y BLG;
//   · `tb-copas` lleva las seis skins de campeón del mundo de Faker, una por copa.
// ⚠️ Las skins de Faker se confirmaron por nombre: el `champion.json` de Data Dragon da el
// nombre y el número (Zed 2, Ryze 10, Syndra 5, Orianna 38, Yone 74, Galio 47) y la descripción
// oficial de CommunityDragon (`v1/skins.json`) dice «Honoring Faker's winning performance…».
// ⚠️ `tb-nueve` va con los tiles de Data Dragon (380 px), no con los íconos de 120 px.
// ⚠️ El logo de BLG solo existe a 332 px: va a 460 px como máximo.
// ⚠️ `Ahri_86` sale siete veces, cada una con otro recorte, y el logo de BLG grande cuatro,
// cada una en otra composición. ⚠️ Peyz es de T1 y Viper de BLG (cada cifra en su color).
// ⚠️ `tb-portada` dice «HOY 16:00»: el video se publica el 8/11 antes del partido.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#0B0B0E';
const T1 = '#E4002B';
const BLG = '#36CFF3';
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
  const r = kit.random('riel-t1-blg');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  // Seis destellos fijos: los de arriba en el rojo de T1 y los de abajo en el azul de BLG.
  const brillos = [0, 1, 2, 3, 4, 5].map((i) => {
    const arriba = i < 3, tercio = i % 3;
    const x = Math.round(70 + tercio * 330 + r() * 260), y = Math.round(arriba ? 52 + r() * 34 : 594 + r() * 34), s = Math.round(8 + r() * 8);
    return `<path d="${estrella(x, y, s)}" fill="${arriba ? T1 : BLG}" opacity="${(0.55 + r() * 0.3).toFixed(2)}"/>`;
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
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${T1}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${BLG}"/>
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
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', attrs = '', sombra = false }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;${sombra ? ' box-shadow: 0 16px 50px rgba(0,0,0,0.75);' : ''}">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Imagen que llena su caja (object-fit: cover): la usa el pixelado.
const foto = (src, alt, { pos = '50% 50%', filtro = '' } = {}) =>
  `<img src="assets/${src}" alt="${alt}" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: ${pos}; ${filtro}">`;

// Fondo opaco con la copia de 360 px desenfocada (NO es data-fondo: la banda es opaca).
const respaldo = (src, brillo = 0.4, pos = 'center') => `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(40px) saturate(1.1) brightness(${brillo});"></div></div>`;
// Un lavado tenue del color de un equipo.
const lavado = (color, fuerza = 0.18, donde = '50% 50%') => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 80% at ${donde}, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>`;
const veloIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;
const veloDer = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(270deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;

// Texto: solo el dato. `clase`: t1 (rojo), blg (azul) o blanco.
const dato = (txt, { x = 0, y, w = PW, tam, clase = 'blanco', tracking = 8, alinear = 'center' }) => `
      <div data-dato style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; box-sizing: border-box; text-align: ${alinear}; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;"><span class="${clase}">${txt}</span></div>`;

// Un logo oficial, con sombra.
const logo = (n, alt, { x, y, w, filtro = '' }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; filter: drop-shadow(0 12px 36px rgba(0,0,0,0.85)) ${filtro};">`;
// Un logo dentro de una celda cuadrada (object-fit: contain).
const celdaLogo = (n, alt, { x, y, t }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; object-fit: contain; filter: drop-shadow(0 12px 36px rgba(0,0,0,0.85));">`;

/** El panel: [data-contenido] (lo que entra con la transición) → riel encima, quieto. */
const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;

const lamina = (id, notasOrador, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;

const SP = { iw: 1215, ih: 717 };
const COL = { w: 400, h: PH, iw: 308, ih: 560, sombra: true };
const AHRI = 'splash/Ahri_86.jpg';

const slides = [];

// ── 1 · tb-portada ─── los dos logos sobre el splash de Ahri apagado ──
slides.push(lamina('tb-portada', 'Hoy es domingo de semifinal: T1 contra Bilibili a las cuatro de la tarde.', `
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash apagado', { ...SP, cam: [0.5, 0.42, 1.04, 0.5, 0.4, 1.1], filtro: 'filter: blur(4px) brightness(0.32) saturate(1.1);' })}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('T1', 'Logo de T1', { x: 70, y: 110, w: 330 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 690, y: 100, w: 320 })}
      </div>
      <div data-dato style="position: absolute; left: 0; right: 0; top: 290px; text-align: center; font-size: 170px; line-height: 1; letter-spacing: 10px; padding-left: 10px; white-space: nowrap;"><span class="t1">T1</span> <span class="blanco">VS</span> <span class="blg">BLG</span></div>
      ${dato('HOY 16:00', { y: 480, tam: 120, tracking: 10 })}`));

// ── 2 · tb-gen ─── plan B: el logo de GEN sobre el splash de Ahri desenfocado ──
slides.push(lamina('tb-gen', 'Gen.G ya está en la final esperando al ganador.', `
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash desenfocado', { ...SP, cam: [0.78, 0.4, 1.1, 0.74, 0.42, 1.16], filtro: 'filter: blur(16px) brightness(0.38) saturate(1.2);' })}
      <div data-logo style="position: absolute; inset: 0;">${logo('GEN', 'Logo de Gen.G', { x: 110, y: 150, w: 440 })}</div>
      ${dato('FINAL', { x: 560, w: 480, y: 230, tam: 240, tracking: 14 })}`));

// ── 3 · tb-faker ─── el splash a sangre, con paneo ──
slides.push(lamina('tb-faker', 'Para los que dicen que ahora sí les toca a los chinos, un dato.', `
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash', { ...SP, cam: [0.32, 0.45, 1.02, 0.56, 0.42, 1.08] })}`));

// ── 4 · tb-racha ─── la pantalla de carga en columna y el 13-0 al otro lado ──
slides.push(lamina('tb-racha', 'Faker va trece a cero en series a cinco mapas contra equipos chinos en Mundiales.', `
      ${respaldo('carga/Ahri_86-fondo.jpg', 0.38)}
      ${lavado(T1, 0.16, '72% 50%')}
      ${vista('carga/Ahri_86.jpg', 'Ahri Leyenda Inmortalizada, pantalla de carga', { ...COL, x: 80, cam: [0.5, 0.48, 1.06, 0.5, 0.42, 1.14] })}
      ${dato('13-0', { x: 480, w: 600, y: 190, tam: 310, clase: 't1', tracking: 12 })}`));

// ── 5 · tb-catorce ─── el logo de BLG a la izquierda y el 14 ──
slides.push(lamina('tb-catorce', 'Hoy Bilibili se apuntó para ser el número catorce.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.26, '20% 60%')}
      ${lavado(BLG, 0.2, '30% 50%')}
      <div data-logo style="position: absolute; inset: 0;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 70, y: 237, w: 460 })}</div>
      ${dato('14', { x: 560, w: 480, y: 130, tam: 420, clase: 'blg', tracking: 10 })}`));

// ── 6 · tb-once ─── plan B: T1 Galio (2025) en columna a la derecha ──
slides.push(lamina('tb-once', 'Es el Mundial número once de Faker y en los once llegó a semifinales.', `
      ${respaldo('carga/Galio_47-fondo.jpg', 0.38)}
      ${lavado(T1, 0.14, '28% 50%')}
      ${vista('carga/Galio_47.jpg', 'T1 Galio, skin de campeón del mundo de Faker (2025), pantalla de carga', { ...COL, x: 600, cam: [0.5, 0.48, 1.06, 0.5, 0.4, 1.14] })}
      ${dato('11', { x: 40, w: 520, y: 80, tam: 340, clase: 't1', tracking: 10 })}
      ${dato('SEMIFINALES', { x: 40, w: 520, y: 450, tam: 104, tracking: 8 })}`));

// ── 7 · tb-copas ─── las seis skins de campeón del mundo de Faker, en fila ──
const SKINS = [['Zed_2', 'SKT T1 Zed (2013)'], ['Ryze_10', 'SKT T1 Ryze (2015)'], ['Syndra_5', 'SKT T1 Syndra (2016)'],
  ['Orianna_38', 'T1 Orianna (2023)'], ['Yone_74', 'T1 Yone (2024)'], ['Galio_47', 'T1 Galio (2025)']];
slides.push(lamina('tb-copas', 'Ocho finales, seis copas.', `
      ${respaldo('splash/Galio_47-fondo.jpg', 0.3)}
      <div data-dato style="position: absolute; left: 0; right: 0; top: 70px; text-align: center; font-size: 130px; line-height: 1; letter-spacing: 8px; padding-left: 8px; white-space: nowrap;"><span class="blanco">8 FINALES</span>  <span class="t1">6 COPAS</span></div>
      <div data-fila style="position: absolute; left: 0; top: 260px; width: ${PW}px; height: 340px;">
        ${SKINS.map(([n, alt], i) => vista(`carga/${n}.jpg`, `${alt}, skin de campeón del mundo de Faker`, { x: 30 + i * 172, y: 0, w: 160, h: 330, iw: 308, ih: 560, sombra: true, cam: [0.5, 0.42, 1.04, 0.5, 0.42, 1.04] })).join('')}
      </div>`));

// ── 8 · tb-g2dk ─── los dos logos y el 2 ──
slides.push(lamina('tb-g2dk', 'Las únicas dos semis que perdió fueron contra G2 y contra DK.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.22, '50% 80%')}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('G2', 'Logo de G2 Esports', { x: 80, y: 170, w: 290 })}
        ${logo('DK', 'Logo de Dplus KIA', { x: 410, y: 270, w: 330 })}
      </div>
      ${dato('2', { x: 760, w: 280, y: 110, tam: 460, tracking: 0 })}`));

// ── 9 · tb-2024 ─── plan B: los logos arriba y el 2-1 → 3-2 ──
slides.push(lamina('tb-2024', 'En la final de 2024 Bilibili iba dos a uno arriba y T1 se las volteó tres a dos.', `
      ${respaldo('centered/Ahri_86-fondo.jpg', 0.28)}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 110, y: 80, w: 300 })}
        ${logo('T1', 'Logo de T1', { x: 680, y: 90, w: 300 })}
      </div>
      <div data-dato style="position: absolute; left: 0; right: 0; top: 300px; text-align: center; font-size: 220px; line-height: 1; letter-spacing: 6px; padding-left: 6px; white-space: nowrap;"><span class="blg">2-1</span> <span class="blanco">→</span> <span class="t1">3-2</span></div>`));

// ── 10 · tb-msi ─── el logo a la izquierda; MSI 2026 y el 3-2 a la derecha ──
slides.push(lamina('tb-msi', 'En el MSI de este año le ganaron tres a dos.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', 0.26)}
      ${lavado(BLG, 0.18, '28% 50%')}
      <div data-logo style="position: absolute; inset: 0;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 70, y: 250, w: 420 })}</div>
      ${dato('MSI 2026', { x: 520, w: 520, y: 120, tam: 120, tracking: 10 })}
      ${dato('3-2', { x: 520, w: 520, y: 270, tam: 300, clase: 'blg', tracking: 12 })}`));

// ── 11 · tb-cerotres ─── el logo de BLG grande y cortado por el borde, y el 0-3 ──
slides.push(lamina('tb-cerotres', 'En Mundiales Bilibili va cero a tres en series contra T1.', `
      ${respaldo('centered/Ahri_86-fondo.jpg', 0.24, '30% 50%')}
      ${lavado(BLG, 0.16, '15% 50%')}
      <div data-logo style="position: absolute; inset: 0;">${logo('BLG', 'Logo de Bilibili Gaming', { x: -170, y: 170, w: 640 })}</div>
      ${dato('0-3', { x: 520, w: 540, y: 140, tam: 400, clase: 'blg', tracking: 12 })}`));

// ── 12 · tb-camino-t1 ─── los cuatro que le ganó T1, en fila sobre el logo de T1 desenfocado ──
slides.push(lamina('tb-camino-t1', 'T1 le ganó a LOS, a CFO, a Movistar Koi y a Karmine.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.2)}
      ${lavado(T1, 0.16, '50% 50%')}
      <img src="assets/logos/T1.png" alt="" aria-hidden="true" style="position: absolute; left: 90px; top: 160px; width: 900px; height: auto; filter: blur(20px) brightness(0.55); opacity: 0.55;">
      <div data-logos style="position: absolute; inset: 0;">
        ${celdaLogo('LOS', 'Logo de Los Grandes', { x: 50, y: 230, t: 220 })}
        ${celdaLogo('CFO', 'Logo de CTBC Flying Oyster', { x: 310, y: 230, t: 220 })}
        ${celdaLogo('MKOI', 'Logo de Movistar KOI', { x: 570, y: 230, t: 220 })}
        ${celdaLogo('KC', 'Logo de Karmine Corp', { x: 830, y: 230, t: 220 })}
      </div>`));

// ── 13 · tb-camino-blg ─── los cuatro que le ganó BLG, y el 3-0 debajo de DK ──
slides.push(lamina('tb-camino-blg', 'Bilibili le ganó a Liquid, a Karmine, a Hanwha y le metió tres a cero a DK.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', 0.2)}
      ${lavado(BLG, 0.16, '50% 50%')}
      <img src="assets/logos/BLG.png" alt="" aria-hidden="true" style="position: absolute; left: 190px; top: 140px; width: 700px; height: auto; filter: blur(20px) brightness(0.55); opacity: 0.55;">
      <div data-logos style="position: absolute; inset: 0;">
        ${celdaLogo('TL', 'Logo de Team Liquid', { x: 50, y: 160, t: 220 })}
        ${celdaLogo('KC', 'Logo de Karmine Corp', { x: 310, y: 160, t: 220 })}
        ${celdaLogo('HLE', 'Logo de Hanwha Life Esports', { x: 570, y: 160, t: 220 })}
        ${celdaLogo('DK', 'Logo de Dplus KIA', { x: 830, y: 160, t: 220 })}
      </div>
      ${dato('3-0', { x: 820, w: 240, y: 420, tam: 140, clase: 'blg', tracking: 8 })}`));

// ── 14 · tb-koi ─── el logo de KOI y el T1 2-0 ──
slides.push(lamina('tb-koi', 'Perdió con Movistar Koi, el mismo equipo que T1 barrió dos a cero.', `
      ${respaldo('carga/Ahri_86-fondo.jpg', 0.24)}
      ${lavado(T1, 0.14, '72% 50%')}
      <div data-logo style="position: absolute; inset: 0;">${logo('MKOI', 'Logo de Movistar KOI', { x: 150, y: 110, w: 282 })}</div>
      ${dato('T1 2-0', { x: 460, w: 600, y: 220, tam: 230, clase: 't1', tracking: 12 })}`));

// ── 15 · tb-orianna ─── el splash a sangre y el 5-0 de Knight ──
slides.push(lamina('tb-orianna', 'En mid Knight trae una Orianna que va cinco a cero.', `
      ${kit.tinta('tinta-orianna', { ancho: PW, alto: PH, origen: [0.62, 0.45], semilla: 6 })}
      ${vista('splash/Orianna_0.jpg', 'Orianna, splash base', { ...SP, cam: [0.55, 0.45, 1.04, 0.6, 0.42, 1.12] })}
      ${veloIzq}
      ${dato('5-0', { x: 40, w: 480, y: 170, tam: 360, clase: 'blg', tracking: 12 })}`));

// ── 16 · tb-nueve ─── los nueve mid de Faker en 3×3 y el 9 ──
const MIDS = [['Leblanc', 'LeBlanc'], ['Galio', 'Galio'], ['Syndra', 'Syndra'], ['Orianna', 'Orianna'], ['Viktor', 'Viktor'],
  ['Cassiopeia', 'Cassiopeia'], ['Annie', 'Annie'], ['Anivia', 'Anivia'], ['Taliyah', 'Taliyah']];
slides.push(lamina('tb-nueve', 'Faker lleva nueve campeones distintos en nueve mapas.', `
      ${respaldo('carga/Ahri_86-fondo.jpg', 0.22, '50% 20%')}
      ${lavado(T1, 0.14, '78% 50%')}
      <div data-rejilla style="position: absolute; left: 70px; top: 70px; width: 540px; height: 540px;">
        ${MIDS.map(([n, alt], i) => `<img src="assets/tiles/${n}_0.jpg" alt="${alt}" style="position: absolute; left: ${(i % 3) * 184}px; top: ${Math.floor(i / 3) * 184}px; width: 172px; height: 172px; display: block; box-shadow: 0 10px 28px rgba(0,0,0,0.7);">`).join('')}
      </div>
      ${dato('9', { x: 640, w: 400, y: 110, tam: 460, clase: 't1', tracking: 0 })}`));

// ── 17 · tb-peyz ─── Jhin a sangre y los dos números de Peyz ──
slides.push(lamina('tb-peyz', 'Peyz lleva cincuenta y tres kills y solo diez muertes en todo el Mundial.', `
      ${kit.quemado('quemado-peyz', { brasa: '#FF4A3D', semilla: 13 })}
      ${vista('splash/Jhin_0.jpg', 'Jhin, splash base', { ...SP, cam: [0.55, 0.42, 1.04, 0.6, 0.4, 1.12] })}
      ${veloIzq}
      ${dato('53', { x: 40, w: 440, y: 90, tam: 320, clase: 't1', tracking: 10 })}
      ${dato('10', { x: 40, w: 440, y: 420, tam: 180, clase: 't1', tracking: 10 })}`));

// ── 18 · tb-viper ─── Ezreal a la izquierda y Ashe a la derecha, cada uno con su marca ──
slides.push(lamina('tb-viper', 'Más le vale a Viper sacar su Ezreal, porque con la Ashe va cero a dos.', `
      <div data-mitad="izq" style="position: absolute; left: 0; top: 0; width: 536px; height: ${PH}px; overflow: hidden;">
        ${vista('splash/Ezreal_0.jpg', 'Ezreal, splash base', { x: 0, y: 0, w: 536, h: PH, ...SP, cam: [0.5, 0.45, 1.04, 0.55, 0.42, 1.1] })}
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, ${a(BG, 0.85)} 0%, ${a(BG, 0)} 50%);"></div>
        ${dato('3-0', { x: 0, w: 536, y: 410, tam: 210, clase: 'blg', tracking: 10 })}
      </div>
      <div data-mitad="der" style="position: absolute; left: 544px; top: 0; width: 536px; height: ${PH}px; overflow: hidden;">
        ${vista('splash/Ashe_0.jpg', 'Ashe, splash base', { x: 0, y: 0, w: 536, h: PH, ...SP, cam: [0.5, 0.45, 1.04, 0.45, 0.42, 1.1] })}
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, ${a(BG, 0.85)} 0%, ${a(BG, 0)} 50%);"></div>
        ${dato('0-2', { x: 0, w: 536, y: 410, tam: 210, clase: 'blg', tracking: 10 })}
      </div>`));

// ── 19 · tb-casas ─── el 56 % y el logo de BLG ──
slides.push(lamina('tb-casas', 'Por primera vez en el Mundial las casas de apuestas no tienen a T1 de favorito: cincuenta y seis por ciento a Bilibili.', `
      ${respaldo('splash/Orianna_0-fondo.jpg', 0.24)}
      ${lavado(BLG, 0.16, '30% 50%')}
      ${dato('56%', { x: 30, w: 640, y: 150, tam: 400, clase: 'blg', tracking: 10 })}
      <div data-logo style="position: absolute; inset: 0;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 690, y: 260, w: 340 })}</div>`));

// ── 20 · tb-gente ─── el logo de T1 y el 73 % ──
slides.push(lamina('tb-gente', 'La gente que sí sabe vota setenta y tres por ciento por T1.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.26, '60% 30%')}
      ${lavado(T1, 0.16, '70% 50%')}
      <div data-logo style="position: absolute; inset: 0;">${logo('T1', 'Logo de T1', { x: 60, y: 265, w: 380 })}</div>
      ${dato('73%', { x: 420, w: 640, y: 150, tam: 400, clase: 't1', tracking: 10 })}`));

// ── 21 · tb-citas ─── el lado derecho del splash: la corona y los zorros ──
slides.push(lamina('tb-citas', 'Faker ya lo dijo, y Viper quiere romper la maldición.', `
      <div data-escala style="position: absolute; inset: 0;"><div style="position: absolute; inset: 0; transform: scale(2.2); transform-origin: 100% 16%;"><div data-pixelado style="position: absolute; inset: 0;">${foto(AHRI, 'Ahri Leyenda Inmortalizada, splash: la corona', { pos: '50% 50%' })}</div></div></div>`));

// ── 22 · tb-maldicion ─── la imagen centrada; el 13 AÑOS es la ventana ──
slides.push(lamina('tb-maldicion', 'Esa maldición tiene trece años y cara de rey demonio.', `
      ${kit.ventana('13 AÑOS', { id: 'ventana-maldicion', ancho: PW, alto: PH, origen: [0.5, 0.5], tam: 380 })}
      ${vista('centered/Ahri_86.jpg', 'Ahri Leyenda Inmortalizada, imagen centrada', { iw: 1280, ih: 720, cam: [0.5, 0.42, 1.12, 0.5, 0.36, 1.22] })}
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, ${a(BG, 0.9)} 0%, ${a(BG, 0.4)} 30%, ${a(BG, 0)} 55%);"></div>
      ${dato('13 AÑOS', { x: 40, w: 600, y: 470, tam: 170, tracking: 12, alinear: 'left' })}`));

// ── 23 · tb-final ─── los logos de T1 y GEN, el T1 3-1 y BROOKLYN ──
slides.push(lamina('tb-final', 'Yo digo T1 tres a uno y nos vemos en Brooklyn contra Gen.G.', `
      ${respaldo('splash/Ahri_86-fondo.jpg', 0.24, '30% 70%')}
      ${lavado(T1, 0.12, '30% 30%')}
      <div data-logos style="position: absolute; inset: 0;">
        ${logo('T1', 'Logo de T1', { x: 80, y: 110, w: 320 })}
        ${logo('GEN', 'Logo de Gen.G', { x: 760, y: 70, w: 240 })}
      </div>
      ${dato('T1 3-1', { y: 280, tam: 210, clase: 't1', tracking: 12 })}
      ${dato('BROOKLYN', { y: 490, tam: 110, tracking: 16 })}`));

// ── 24 · tb-cierre ─── el splash cerrado en el rostro y GG EZ ──
slides.push(lamina('tb-cierre', 'Ni pedo, solo queda decir gigi easy.', `
      ${kit.glitch('glitch-cierre')}
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash: el rostro', { ...SP, cam: [0.54, 0.24, 1.6, 0.54, 0.2, 1.78] })}
      ${veloIzq}
      ${dato('GG EZ', { x: 30, w: 560, y: 210, tam: 280, tracking: 8, alinear: 'left' })}`));

// ── 25 · tb-reposo ─── la banda sin dato: el splash en penumbra ──
slides.push(lamina('tb-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash en penumbra', { ...SP, cam: [0.45, 0.6, 1.04, 0.47, 0.58, 1.08], filtro: 'filter: brightness(0.3) saturate(0.85);' })}`, ' data-reposo'));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  var PW = ${PW}, PH = ${PH};
  var DUR = 2.5;                    // ninguna lámina pasa de aquí

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo de cada [data-cam] (salvo los de encuadre fijo) y de los [data-escala].
  function camara(tl, s) {
    q(s, '[data-cam]').forEach(function (img) {
      var v = img.parentNode, vw = +v.dataset.vw, vh = +v.dataset.vh, cw = +img.dataset.cw, ch = +img.dataset.ch;
      var c = img.dataset.cam.split(',').map(Number);
      if (c[0] === c[3] && c[1] === c[4] && c[2] === c[5]) return;
      var ini = encuadre(vw, vh, cw, ch, c[0], c[1], c[2]), fin = encuadre(vw, vh, cw, ch, c[3], c[4], c[5]);
      ini.transformOrigin = '0 0'; fin.transformOrigin = '0 0';
      fin.duration = DUR; fin.ease = 'power1.out'; fin.immediateRender = true;
      tl.fromTo(img, ini, fin, 0);
    });
    q(s, '[data-escala]').forEach(function (el) {
      tl.fromTo(el, { scale: 1.08 }, { scale: 1, transformOrigin: '50% 50%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
    });
  }
  // Empuje leve de un logo o grupo sobre sí mismo.
  function empuje(tl, el, hasta, origen) {
    if (el) tl.fromTo(el, { scale: 1 }, { scale: hasta || 1.05, transformOrigin: origen || '50% 50%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  }

  // Las transiciones son las de ambessa (el mismo formato), copiadas tal cual.
  // Una transición hecha con un valor p de 0 a 1 que se pinta en cada cuadro (clip-path o máscara).
  // Al terminar se limpia el estilo: el estado final es el contenido tal cual.
  function porProgreso(tl, el, dur, ease, pinta, prop) {
    var est = { p: 0 }, f = function () { pinta(est.p); };
    tl.fromTo(est, { p: 0 }, { p: 1, duration: dur, ease: ease, immediateRender: true, onUpdate: f, onReverseComplete: f }, 0);
    f();
    tl.set(el, prop, dur);
    return dur;
  }
  var r1 = function (v) { return v.toFixed(1); };
  var clip = function (el, v) { el.style.clipPath = v; };
  var mascara = function (el, v) { el.style.webkitMaskImage = v; el.style.maskImage = v; };

  // Las transiciones. Cada una devuelve cuándo termina (el contenido ya está completo).
  var T = {
    // Círculo que se abre desde un punto (la vela, la esquina…).
    iris: function (tl, c, o) {
      var R = Math.hypot(PW, PH);
      return porProgreso(tl, c, o.dur || 0.85, 'power2.inOut', function (p) { clip(c, 'circle(' + r1(p * R) + 'px at ' + o.origen + ')'); }, { clipPath: 'none' });
    },
    // Persianas: franjas que se abren a la vez (verticales u horizontales).
    persianas: function (tl, c, o) {
      var paso = o.paso || 120, ang = o.vertical ? 90 : 180;
      return porProgreso(tl, c, o.dur || 0.8, 'power2.inOut', function (p) {
        var w = r1(p * paso);
        mascara(c, 'repeating-linear-gradient(' + ang + 'deg, #000 0px, #000 ' + w + 'px, transparent ' + w + 'px, transparent ' + paso + 'px)');
      }, { maskImage: 'none', webkitMaskImage: 'none' });
    },
    // Barrido en diagonal, de izquierda a derecha.
    diagonal: function (tl, c, o) {
      var k = 300;
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) {
        var x = p * (PW + k);
        clip(c, 'polygon(0 0, ' + r1(x) + 'px 0, ' + r1(x - k) + 'px 100%, 0 100%)');
      }, { clipPath: 'none' });
    },
    // La lámina entra empujada desde la derecha.
    empuje: function (tl, c, o) {
      tl.fromTo(c, { x: PW }, { x: 0, duration: o.dur || 0.7, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.7;
    },
    // Dos puertas que se abren desde el centro.
    puertas: function (tl, c, o) {
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) { var m = r1((1 - p) * 50); clip(c, 'inset(0 ' + m + '% 0 ' + m + '%)'); }, { clipPath: 'none' });
    },
    // Mosaico: celdas de 135 × 136 que crecen desde su centro, en un orden de la semilla.
    mosaico: function (tl, c, o) {
      var cols = 8, filas = 5, cw = PW / cols, ch = PH / filas, celdas = [], r = random(o.semilla || 'mosaico');
      for (var i = 0; i < cols * filas; i++) celdas.push({ x: (i % cols) * cw, y: Math.floor(i / cols) * ch, t: r() * 0.55 });
      return porProgreso(tl, c, o.dur || 0.95, 'none', function (p) {
        var pts = ['0px 0px'];
        celdas.forEach(function (k) {
          var e = Math.min(1, Math.max(0, (p - k.t) / 0.45)); e = 1 - Math.pow(1 - e, 3);
          if (!e) return;
          var hw = cw * e / 2 + 0.5, hh = ch * e / 2 + 0.5, cx = k.x + cw / 2, cy = k.y + ch / 2;
          pts.push(r1(cx - hw) + 'px ' + r1(cy - hh) + 'px', r1(cx + hw) + 'px ' + r1(cy - hh) + 'px', r1(cx + hw) + 'px ' + r1(cy + hh) + 'px',
            r1(cx - hw) + 'px ' + r1(cy + hh) + 'px', r1(cx - hw) + 'px ' + r1(cy - hh) + 'px', '0px 0px');
        });
        clip(c, pts.length > 1 ? 'polygon(' + pts.join(', ') + ')' : 'polygon(0 0, 0 0, 0 0)');
      }, { clipPath: 'none' });
    },
    // Reloj: una manecilla barre la lámina desde las 12.
    reloj: function (tl, c, o) {
      var cx = PW / 2, cy = PH / 2, R = 1400;
      return porProgreso(tl, c, o.dur || 0.9, 'power2.inOut', function (p) {
        var pts = [cx + 'px ' + cy + 'px'], fin = p * 360;
        for (var a = 0; a <= fin; a += 6) pts.push(r1(cx + R * Math.sin(a * Math.PI / 180)) + 'px ' + r1(cy - R * Math.cos(a * Math.PI / 180)) + 'px');
        pts.push(r1(cx + R * Math.sin(fin * Math.PI / 180)) + 'px ' + r1(cy - R * Math.cos(fin * Math.PI / 180)) + 'px');
        clip(c, 'polygon(' + pts.join(', ') + ')');
      }, { clipPath: 'none' });
    },
    // Acercamiento desde lejos, desenfocado.
    acerca: function (tl, c, o) {
      tl.fromTo(c, { scale: 0.62, opacity: 0, filter: 'blur(18px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', transformOrigin: '50% 50%', duration: o.dur || 0.8, ease: 'entrada', immediateRender: true }, 0);
      tl.set(c, { filter: 'none' }, o.dur || 0.8);
      return o.dur || 0.8;
    },
    // Se aleja desde muy cerca mientras aparece (lento: es la muerte).
    aleja: function (tl, c, o) {
      tl.fromTo(c, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 45%', duration: o.dur || 1.1, ease: 'power2.out', immediateRender: true }, 0);
      return o.dur || 1.1;
    },
    // Las recetas del kit sobre la lámina entera.
    tinta: function (tl, c, o) { efecto('tinta', tl, c, { mascara: o.mascara, dur: o.dur || 1.05, en: 0, ease: 'power2.inOut' }); return o.dur || 1.05; },
    tajo: function (tl, c, o) { efecto('cortinilla', tl, c, { forma: 'tajo', dur: o.dur || 0.8, en: 0 }); return o.dur || 0.8; },
    quemado: function (tl, c, o) {
      efecto('quemado', tl, c, { filtro: o.filtro, dur: o.dur || 1.2, en: 0 });
      tl.set(c, { filter: 'none' }, o.dur || 1.2);   // con el umbral al tope todavía deja motas de brasa
      return o.dur || 1.2;
    },
    ventana: function (tl, c, o) {
      efecto('ventana', tl, c, { mascara: o.mascara, en: 0.15, dur: o.dur || 1.2, zoom: 12 });
      tl.set(c, { maskImage: 'none', webkitMaskImage: 'none' }, 0.15 + (o.dur || 1.2));
      return 0.15 + (o.dur || 1.2);
    },
    glitch: function (tl, c, o) {
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'steps(3)', immediateRender: true }, 0);
      efecto('glitch', tl, c, { filtro: o.filtro, dur: o.dur || 0.9, fuerza: 170, pasos: 12, en: 0 });
      tl.set(c, { filter: 'none' }, o.dur || 0.9);
      return o.dur || 0.9;
    },
    // Volteo en 3D: la lámina gira sobre su eje vertical.
    voltea: function (tl, c, o) {
      tl.fromTo(c, { rotationY: -88, opacity: 0.2 }, { rotationY: 0, opacity: 1, transformPerspective: 1500, transformOrigin: '0% 50%', duration: o.dur || 0.85, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.85;
    },
    // Cortina: se destapa desde un borde.
    cortina: function (tl, c, o) {
      var desde = { abajo: 'inset(100% 0 0 0)', arriba: 'inset(0 0 100% 0)' }[o.desde];
      tl.fromTo(c, { clipPath: desde }, { clipPath: 'inset(0% 0% 0% 0%)', duration: o.dur || 0.75, ease: 'power3.inOut', immediateRender: true }, 0);
      tl.set(c, { clipPath: 'none' }, o.dur || 0.75);
      return o.dur || 0.75;
    },
    // Caja que crece desde el centro.
    caja: function (tl, c, o) {
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) { var y = r1((1 - p) * 50), x = r1((1 - p) * 50); clip(c, 'inset(' + y + '% ' + x + '% ' + y + '% ' + x + '%)'); }, { clipPath: 'none' });
    },
    // La lámina sube desde abajo, como una carta que se desliza.
    sube: function (tl, c, o) {
      tl.fromTo(c, { y: PH }, { y: 0, duration: o.dur || 0.7, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.7;
    },
    // La lámina cae girando y se asienta.
    giro: function (tl, c, o) {
      tl.fromTo(c, { rotation: -14, scale: 0.55, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, transformOrigin: '50% 60%', duration: o.dur || 0.8, ease: 'asentar', immediateRender: true }, 0);
      return o.dur || 0.8;
    },
    // Lo único que hace el arte de la lámina: pixelado a nítido.
    pixelado: function (tl, c, o) { efecto('pixelado', tl, uno(c, '[data-pixelado]'), { desde: 96, pasos: 7, dur: o.dur || 1.2, en: 0 }); return o.dur || 1.2; },
    fundido: function (tl, c, o) {
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: o.dur || 1, ease: 'power1.inOut', immediateRender: true }, 0);
      return o.dur || 1;
    },
  };

  // Una transición distinta por lámina (25, ninguna repetida).
  var TRANSICION = {
    'tb-portada': { tipo: 'iris', origen: '50% 50%' },
    'tb-gen': { tipo: 'caja' },
    'tb-faker': { tipo: 'persianas', vertical: true, paso: 135 },
    'tb-racha': { tipo: 'empuje' },
    'tb-catorce': { tipo: 'puertas' },
    'tb-once': { tipo: 'cortina', desde: 'abajo' },
    'tb-copas': { tipo: 'mosaico', semilla: 'tb-copas' },
    'tb-g2dk': { tipo: 'reloj' },
    'tb-2024': { tipo: 'diagonal' },
    'tb-msi': { tipo: 'cortina', desde: 'arriba' },
    'tb-cerotres': { tipo: 'tajo' },
    'tb-camino-t1': { tipo: 'persianas', vertical: false, paso: 85 },
    'tb-camino-blg': { tipo: 'sube' },
    'tb-koi': { tipo: 'acerca' },
    'tb-orianna': { tipo: 'tinta', mascara: 'tinta-orianna' },
    'tb-nueve': { tipo: 'voltea' },
    'tb-peyz': { tipo: 'quemado', filtro: 'quemado-peyz' },
    'tb-viper': { tipo: 'mitades' },
    'tb-casas': { tipo: 'aleja', dur: 0.9 },
    'tb-gente': { tipo: 'giro' },
    'tb-citas': { tipo: 'pixelado' },
    'tb-maldicion': { tipo: 'ventana', mascara: 'ventana-maldicion' },
    'tb-final': { tipo: 'iris', origen: '100% 100%', dur: 0.9 },
    'tb-cierre': { tipo: 'glitch', filtro: 'glitch-cierre' },
    'tb-reposo': { tipo: 'fundido' },
  };
  // Las dos mitades de tb-viper: Ezreal baja y Ashe sube, a la vez.
  T.mitades = function (tl, c) {
    var s = c.closest('section');
    tl.fromTo(uno(s, '[data-mitad="izq"]'), { yPercent: -100 }, { yPercent: 0, duration: 0.75, ease: 'entrada', immediateRender: true }, 0);
    tl.fromTo(uno(s, '[data-mitad="der"]'), { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'entrada', immediateRender: true }, 0);
    return 0.75;
  };

  // Lo propio de cada lámina, a partir de t (la transición ya destapó casi todo): cámara y nada más.
  var PROPIO = {
    'tb-portada': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.06); },
    'tb-gen': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '30% 50%'); },
    'tb-catorce': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '28% 50%'); },
    'tb-copas': function (tl, s) { tl.fromTo(uno(s, '[data-fila]'), { x: 40 }, { x: 0, duration: DUR, ease: 'power1.out', immediateRender: true }, 0); },
    'tb-g2dk': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.05, '35% 50%'); },
    'tb-2024': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.04, '50% 25%'); },
    'tb-msi': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '26% 50%'); },
    'tb-cerotres': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '0% 50%'); },
    'tb-camino-t1': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.04); },
    'tb-camino-blg': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.04, '50% 40%'); },
    'tb-koi': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '27% 50%'); },
    'tb-nueve': function (tl, s) { empuje(tl, uno(s, '[data-rejilla]'), 1.04); },
    'tb-casas': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '80% 50%'); },
    'tb-gente': function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '23% 50%'); },
    'tb-final': function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.05, '50% 30%'); },
  };

  Object.keys(TRANSICION).forEach(function (id) {
    animar(id, function (tl, s) {
      camara(tl, s);
      var tr = TRANSICION[id];
      var fin = T[tr.tipo](tl, uno(s, '[data-contenido]'), tr);
      var t = Math.max(0.35, fin - 0.15);          // el dato entra cuando la lámina ya está casi completa
      q(s, '[data-dato]').forEach(function (d, i) {
        tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', immediateRender: true }, t + i * 0.08);
      });
      if (PROPIO[id]) PROPIO[id](tl, s, t);
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
<title>T1 vs BLG · Semifinal</title>
${kit.og({ titulo: 'T1 vs BLG · Semifinal del Mundial 2026', descripcion: 'La previa del domingo 8 de noviembre en banda inferior: el 13-0 de Faker contra la LPL en Bo5 de Mundiales, sus 11 semifinales, el 0-3 de BLG contra T1 y los números de la serie. Solo arte oficial.', carpeta: 'creator/t1-blg' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .t1 { color: ${T1}; text-shadow: 0 6px 30px rgba(0,0,0,0.85), 0 0 60px ${a(T1, 0.35)}; }
  .blg { color: ${BLG}; text-shadow: 0 6px 30px rgba(0,0,0,0.85), 0 0 60px ${a(BLG, 0.3)}; }
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
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="abajo">
${slides.join('\n')}
</deck-stage>
${kit.banda()}
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
