// Generador de index.html — Previa T1 vs BLG (semifinal del Mundial 2026)
// Ejecutar: node creator/t1-blg/gen.js   ·   clips: node tools/laminas.mjs creator/t1-blg
//
// Video del canal Axelsine del domingo 8/11/2026, antes del partido de las 16:00 CDMX.
// Sigue el paquete de Axl `2026-11-08_previa-t1-vs-blg-paquete-presentacion.md`
// (PKB/redes-sociales/creador-de-contenido-axelsine/worlds-2026/semifinales/): 24 láminas
// con su palabra de entrada en `video-out/laminas/guion-marcado.txt`.
//
// 🎯 **El formato de la primera versión de ambessa** (commit e438ec3), que es el que pide el
// paquete: panel de 1080×1370 (`crop=1080:1370:0:275`) que el montaje reduce a 706×896
// debajo del gameplay, y la misma regla de leblanc y ambessa:
//   · **solo arte oficial**: splashes, pantallas de carga, tiles de Data Dragon y logos de
//     lolesports, a pantalla completa o casi;
//   · **la única animación es de cámara** (empuje, paneo o fundido corto, 2,8 s como máximo);
//     nada entra por piezas, ni la cuadrícula de los nueve mid ni las seis skins;
//   · **no se dibuja nada** (ni SVG, ni partículas, ni barras, ni chips, ni marcos);
//   · **el único texto es el dato**; las citas de Faker y de Viper no van en pantalla.
// Ninguna lámina arranca en negro: el fondo (la copia desenfocada) se ve desde el cuadro 0.
//
// Paleta: negro `#0B0B0E`; **las cifras de T1 en su rojo `#E4002B` y las de BLG en su azul
// celeste `#36CFF3`**, los dos muestreados de los logos; lo neutro (FINAL, SEMIFINALES,
// 8 FINALES, BROOKLYN, 13 AÑOS, GG EZ) en blanco. Sin dinero: el 56 % de Polymarket va como
// porcentaje, sin cuotas.
//
// Decisiones de Axl del 8/11 (las fotos se preguntaron antes de bajar nada):
//   · **Plan B en las cuatro láminas con foto oficial**: `tb-gen` lleva el logo de GEN sobre el
//     splash de Ahri desenfocado; `tb-once`, T1 Galio; `tb-2024`, los logos de T1 y BLG.
//   · **`tb-copas` (sin plan B en el paquete) lleva las seis skins de campeón del mundo de
//     Faker**, una por copa: SKT T1 Zed (2013), SKT T1 Ryze (2015), SKT T1 Syndra (2016),
//     T1 Orianna (2023), T1 Yone (2024) y T1 Galio (2025).
// ⚠️ **Las skins de Faker se confirmaron por nombre**: el `champion.json` de Data Dragon da el
// nombre y el número (Zed 2, Ryze 10, Syndra 5, Orianna 38, Yone 74, Galio 47), pero no dice
// de quién es; eso lo dice la descripción oficial de cada skin en CommunityDragon
// (`v1/skins.json`): «Honoring Faker's winning performance as … during the 20xx World
// Championship». Ninguna se adivinó.
// ⚠️ **Los nueve mid de `tb-nueve` van con los tiles de Data Dragon** (380×380,
// `img/champion/tiles/<Campeón>_0.jpg`) y no con los íconos de 120 px: a 300 px los íconos se
// ven blandos, y los tiles son el mismo recorte cuadrado y oficial.
// ⚠️ **El logo de BLG solo existe a 332 px** (también en la API de lolesports): va a 600 px
// como máximo, que en el video final son ~390 px.
// ⚠️ `Ahri_86` (Leyenda Inmortalizada) sale siete veces, cada una con otro recorte: el splash en
// la portada (apagado), en tb-gen (desenfocado), en tb-faker (entero y en horizontal), en tb-citas
// (la corona y los zorros) y en tb-cierre (el rostro); la pantalla de carga en tb-racha y la
// centrada en tb-maldicion.
// El logo de BLG grande sale cuatro veces, cada una en otra composición.
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
const PW = 1080, PH = 1370, PANEL_TOP = 275;

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${BLANCO}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Copia desenfocada a sangre (fondo de la lámina; data-fondo para sacarla con alfa).
const borroso = (src, brillo = 0.4, pos = 'center') => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(46px) saturate(1.1) brightness(${brillo});"></div>
    </div>`;

// Un lavado del color de un equipo y una viñeta: el fondo nunca es plano.
const ambiente = (color = null, fuerza = 0.18, donde = '50% 20%') => `${color ? `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(80% 45% at ${donde}, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>` : ''}
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(6,6,8,0.75) 100%);"></div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px;">${contenido}
    </div>`;

// Encuadre → traslación, sin pasarse de los bordes de la imagen.
function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return { x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0), y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0), z };
}

// Visor con una imagen oficial adentro y la cámara declarada en `cam`:
// [cx0, cy0, z0, cx1, cy1, z1] — centro normalizado (0–1) y zoom sobre `cover`.
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

// Texto: solo el dato, grande. `clase`: t1 (rojo), blg (azul) o blanco.
const dato = (txt, { tam, clase = 'blanco', top, bottom, tracking = 8, attrs = 'data-dato' }) => `
      <div ${attrs} style="position: absolute; left: 0; right: 0; ${top !== undefined ? `top: ${top}px;` : ''} ${bottom !== undefined ? `bottom: ${bottom}px;` : ''} text-align: center; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;"><span class="${clase}">${txt}</span></div>`;

// Un logo oficial, posicionado y con sombra para que despegue del fondo.
const logo = (n, alt, { x, y, w, filtro = '' }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; filter: drop-shadow(0 12px 40px rgba(0,0,0,0.85)) ${filtro};">`;

// Un logo dentro de una celda cuadrada (object-fit: contain), para las rejillas de 2×2.
const celdaLogo = (n, alt, { x, y, t }) =>
  `<img src="assets/logos/${n}.png" alt="${alt}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; object-fit: contain; filter: drop-shadow(0 12px 40px rgba(0,0,0,0.85));">`;

const SP = { iw: 1215, ih: 717 };
const CARGA = { x: 163, w: 754, h: PH, iw: 308, ih: 560 };   // pantalla de carga vertical, centrada
const AHRI = 'splash/Ahri_86.jpg';

const slides = [];

// ── 1 · tb-portada ───────────────────────────────────────────────────────
// Los dos logos sobre el splash de Ahri apagado: entran juntos con fundido y luego empuje.
slides.push(lamina('tb-portada', 'Hoy es domingo de semifinal: T1 contra Bilibili a las cuatro de la tarde.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.42)}
    ${ambiente(T1, 0.14, '25% 30%')}
    ${panel(`
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash apagado', { ...SP, cam: [0.5, 0.45, 1, 0.52, 0.42, 1.06], filtro: 'filter: blur(5px) brightness(0.34) saturate(1.1);' })}
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: 560px;">
        ${logo('T1', 'Logo de T1', { x: 70, y: 250, w: 430 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 590, y: 240, w: 420 })}
      </div>
      <div data-dato style="position: absolute; left: 0; right: 0; top: 620px; text-align: center; font-size: 220px; line-height: 1; letter-spacing: 10px; padding-left: 10px; white-space: nowrap;"><span class="t1">T1</span> <span class="blanco">VS</span> <span class="blg">BLG</span></div>
      ${dato('HOY 16:00', { tam: 190, top: 900, tracking: 10 })}`)}`));

// ── 2 · tb-gen ───────────────────────────────────────────────────────────
// Plan B (decisión de Axl): el logo de GEN sobre el splash de Ahri muy desenfocado.
slides.push(lamina('tb-gen', 'Gen.G ya está en la final esperando al ganador.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.36, '80% 40%')}
    ${ambiente(null)}
    ${panel(`
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash desenfocado', { ...SP, cam: [0.78, 0.4, 1.1, 0.74, 0.42, 1.16], filtro: 'filter: blur(18px) brightness(0.4) saturate(1.2);' })}
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('GEN', 'Logo de Gen.G', { x: 230, y: 230, w: 620 })}</div>
      ${dato('FINAL', { tam: 320, top: 880, tracking: 16 })}`)}`));

// ── 3 · tb-faker ─────────────────────────────────────────────────────────
// El splash entero, en horizontal sobre su copia desenfocada (la única lámina apaisada de
// Ahri); la cámara se desliza despacio hacia ella.
slides.push(lamina('tb-faker', 'Para los que dicen que ahora sí les toca a los chinos, un dato.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.5)}
    ${panel(`
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash entero', { ...SP, y: 366, h: 638, cam: [0.42, 0.5, 1.02, 0.52, 0.44, 1.1], attrs: 'data-marco' })}`)}`));

// ── 4 · tb-racha ─────────────────────────────────────────────────────────
// La pantalla de carga entera; el 13-0 entra con fundido.
slides.push(lamina('tb-racha', 'Faker va trece a cero en series a cinco mapas contra equipos chinos en Mundiales.', `
    ${borroso('carga/Ahri_86-fondo.jpg', 0.45)}
    ${ambiente(T1, 0.16)}
    ${panel(`
      ${vista('carga/Ahri_86.jpg', 'Ahri Leyenda Inmortalizada, pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.45, 1.14] })}
      ${velo(640)}
      ${dato('13-0', { tam: 470, clase: 't1', bottom: 50, tracking: 12 })}`)}`));

// ── 5 · tb-catorce ───────────────────────────────────────────────────────
// El logo de BLG al centro y el 14 debajo.
slides.push(lamina('tb-catorce', 'Hoy Bilibili se apuntó para ser el número catorce.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.3, '20% 60%')}
    ${ambiente(BLG, 0.2, '50% 30%')}
    ${panel(`
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 240, y: 300, w: 600 })}</div>
      ${dato('14', { tam: 560, clase: 'blg', top: 660, tracking: 10 })}`)}`));

// ── 6 · tb-once ──────────────────────────────────────────────────────────
// Plan B (decisión de Axl): T1 Galio, su skin de campeón del mundo de 2025.
slides.push(lamina('tb-once', 'Es el Mundial número once de Faker y en los once llegó a semifinales.', `
    ${borroso('carga/Galio_47-fondo.jpg', 0.45)}
    ${ambiente(T1, 0.14)}
    ${panel(`
      ${vista('carga/Galio_47.jpg', 'T1 Galio, skin de campeón del mundo de Faker (2025), pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.42, 1.14] })}
      ${velo(660)}
      ${dato('11', { tam: 440, clase: 't1', bottom: 220, tracking: 10 })}
      ${dato('SEMIFINALES', { tam: 150, bottom: 60, tracking: 10 })}`)}`));

// ── 7 · tb-copas ─────────────────────────────────────────────────────────
// Decisión de Axl: las seis skins de campeón del mundo de Faker, una por copa, en 3×2.
// Entran juntas con un fundido y la rejilla se desliza despacio (paneo).
const SKINS = [['Zed_2', 'SKT T1 Zed (2013)'], ['Ryze_10', 'SKT T1 Ryze (2015)'], ['Syndra_5', 'SKT T1 Syndra (2016)'],
  ['Orianna_38', 'T1 Orianna (2023)'], ['Yone_74', 'T1 Yone (2024)'], ['Galio_47', 'T1 Galio (2025)']];
slides.push(lamina('tb-copas', 'Ocho finales, seis copas.', `
    ${borroso('splash/Galio_47-fondo.jpg', 0.32)}
    ${ambiente(T1, 0.12)}
    ${panel(`
      ${dato('8 FINALES', { tam: 150, top: 40, tracking: 10 })}
      ${dato('6 COPAS', { tam: 220, clase: 't1', top: 190, tracking: 12 })}
      <div data-rejilla style="position: absolute; left: 0; top: 450px; width: ${PW}px; height: 900px;">
        ${SKINS.map(([n, alt], i) => vista(`carga/${n}.jpg`, `${alt}, skin de campeón del mundo de Faker, pantalla de carga`,
          { x: 40 + (i % 3) * 340, y: Math.floor(i / 3) * 460, w: 320, h: 440, iw: 308, ih: 560, cam: [0.5, 0.42, 1.04, 0.5, 0.42, 1.04] })).join('')}
      </div>`)}`));

// ── 8 · tb-g2dk ──────────────────────────────────────────────────────────
slides.push(lamina('tb-g2dk', 'Las únicas dos semis que perdió fueron contra G2 y contra DK.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.26, '50% 80%')}
    ${ambiente(null)}
    ${panel(`
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: 760px;">
        ${logo('G2', 'Logo de G2 Esports', { x: 120, y: 260, w: 360 })}
        ${logo('DK', 'Logo de Dplus KIA', { x: 560, y: 380, w: 440 })}
      </div>
      ${dato('2', { tam: 560, top: 760, tracking: 0 })}`)}`));

// ── 9 · tb-2024 ──────────────────────────────────────────────────────────
// Plan B (decisión de Axl): los logos, uno arriba y otro abajo (otra composición que la portada).
slides.push(lamina('tb-2024', 'En la final de 2024 Bilibili iba dos a uno arriba y T1 se las volteó tres a dos.', `
    ${borroso('centered/Ahri_86-fondo.jpg', 0.3)}
    ${ambiente(BLG, 0.12, '50% 85%')}
    ${panel(`
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">
        ${logo('T1', 'Logo de T1', { x: 270, y: 110, w: 540 })}
        ${logo('BLG', 'Logo de Bilibili Gaming', { x: 300, y: 1000, w: 480 })}
      </div>
      <div data-dato style="position: absolute; left: 0; right: 0; top: 470px; text-align: center; font-size: 240px; line-height: 1; letter-spacing: 6px; padding-left: 6px; white-space: nowrap;"><span class="blg">2-1</span> <span class="blanco">→</span> <span class="t1">3-2</span></div>`)}`));

// ── 10 · tb-msi ──────────────────────────────────────────────────────────
slides.push(lamina('tb-msi', 'En el MSI de este año le ganaron tres a dos.', `
    ${borroso('splash/Jhin_0-fondo.jpg', 0.3)}
    ${ambiente(BLG, 0.2, '50% 18%')}
    ${panel(`
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 280, y: 130, w: 520 })}</div>
      ${dato('MSI 2026', { tam: 170, top: 500, tracking: 12 })}
      ${dato('3-2', { tam: 460, clase: 'blg', top: 700, tracking: 12 })}`)}`));

// ── 11 · tb-cerotres ─────────────────────────────────────────────────────
// Otro recorte del logo de BLG: grande y cortado por el borde izquierdo, y el 0-3 a la derecha.
slides.push(lamina('tb-cerotres', 'En Mundiales Bilibili va cero a tres en series contra T1.', `
    ${borroso('centered/Ahri_86-fondo.jpg', 0.26, '30% 50%')}
    ${ambiente(BLG, 0.16, '20% 40%')}
    ${panel(`
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('BLG', 'Logo de Bilibili Gaming', { x: -170, y: 200, w: 660, filtro: 'brightness(0.95)' })}</div>
      ${dato('0-3', { tam: 520, clase: 'blg', top: 700, tracking: 12 })}`)}`));

// ── 12 · tb-camino-t1 ────────────────────────────────────────────────────
// Los cuatro que le ganó T1, en 2×2, sobre el logo de T1 desenfocado.
slides.push(lamina('tb-camino-t1', 'T1 le ganó a LOS, a CFO, a Movistar Koi y a Karmine.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.22)}
    ${ambiente(T1, 0.16, '50% 50%')}
    ${panel(`
      <img src="assets/logos/T1.png" alt="" aria-hidden="true" style="position: absolute; left: 40px; top: 470px; width: 1000px; height: auto; filter: blur(22px) brightness(0.55); opacity: 0.55;">
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">
        ${celdaLogo('LOS', 'Logo de Los Grandes', { x: 110, y: 230, t: 380 })}
        ${celdaLogo('CFO', 'Logo de CTBC Flying Oyster', { x: 590, y: 230, t: 380 })}
        ${celdaLogo('MKOI', 'Logo de Movistar KOI', { x: 110, y: 740, t: 380 })}
        ${celdaLogo('KC', 'Logo de Karmine Corp', { x: 590, y: 740, t: 380 })}
      </div>`)}`));

// ── 13 · tb-camino-blg ───────────────────────────────────────────────────
slides.push(lamina('tb-camino-blg', 'Bilibili le ganó a Liquid, a Karmine, a Hanwha y le metió tres a cero a DK.', `
    ${borroso('splash/Jhin_0-fondo.jpg', 0.22)}
    ${ambiente(BLG, 0.16, '50% 50%')}
    ${panel(`
      <img src="assets/logos/BLG.png" alt="" aria-hidden="true" style="position: absolute; left: 140px; top: 470px; width: 800px; height: auto; filter: blur(20px) brightness(0.55); opacity: 0.55;">
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">
        ${celdaLogo('TL', 'Logo de Team Liquid', { x: 110, y: 150, t: 380 })}
        ${celdaLogo('KC', 'Logo de Karmine Corp', { x: 590, y: 150, t: 380 })}
        ${celdaLogo('HLE', 'Logo de Hanwha Life Esports', { x: 110, y: 640, t: 380 })}
        ${celdaLogo('DK', 'Logo de Dplus KIA', { x: 590, y: 640, t: 380 })}
      </div>
      <div data-dato style="position: absolute; left: 590px; width: 380px; top: 1060px; text-align: center; font-size: 200px; line-height: 1; letter-spacing: 8px; padding-left: 8px; white-space: nowrap;"><span class="blg">3-0</span></div>`)}`));

// ── 14 · tb-koi ──────────────────────────────────────────────────────────
slides.push(lamina('tb-koi', 'Perdió con Movistar Koi, el mismo equipo que T1 barrió dos a cero.', `
    ${borroso('carga/Ahri_86-fondo.jpg', 0.26)}
    ${ambiente(T1, 0.12, '50% 80%')}
    ${panel(`
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('MKOI', 'Logo de Movistar KOI', { x: 345, y: 150, w: 390 })}</div>
      ${dato('T1 2-0', { tam: 320, clase: 't1', top: 880, tracking: 12 })}`)}`));

// ── 15 · tb-orianna ──────────────────────────────────────────────────────
slides.push(lamina('tb-orianna', 'En mid Knight trae una Orianna que va cinco a cero.', `
    ${borroso('splash/Orianna_0-fondo.jpg', 0.45)}
    ${panel(`
      ${vista('splash/Orianna_0.jpg', 'Orianna, splash base', { ...SP, cam: [0.42, 0.45, 1, 0.48, 0.42, 1.1] })}
      ${velo(600)}
      ${dato('5-0', { tam: 470, clase: 'blg', bottom: 50, tracking: 12 })}`)}`));

// ── 16 · tb-nueve ────────────────────────────────────────────────────────
// Los nueve mid de Faker (tiles oficiales) en 3×3: la cuadrícula entra entera, no por piezas.
const MIDS = [['Leblanc', 'LeBlanc'], ['Galio', 'Galio'], ['Syndra', 'Syndra'], ['Orianna', 'Orianna'], ['Viktor', 'Viktor'],
  ['Cassiopeia', 'Cassiopeia'], ['Annie', 'Annie'], ['Anivia', 'Anivia'], ['Taliyah', 'Taliyah']];
slides.push(lamina('tb-nueve', 'Faker lleva nueve campeones distintos en nueve mapas.', `
    ${borroso('carga/Ahri_86-fondo.jpg', 0.24, '50% 20%')}
    ${ambiente(T1, 0.12, '50% 90%')}
    ${panel(`
      <div data-rejilla style="position: absolute; left: 75px; top: 90px; width: 930px; height: 930px;">
        ${MIDS.map(([n, alt], i) => `<img src="assets/tiles/${n}_0.jpg" alt="${alt}" style="position: absolute; left: ${(i % 3) * 315}px; top: ${Math.floor(i / 3) * 315}px; width: 300px; height: 300px; display: block; box-shadow: 0 12px 34px rgba(0,0,0,0.7);">`).join('')}
      </div>
      ${dato('9', { tam: 300, clase: 't1', top: 1050, tracking: 0 })}`)}`));

// ── 17 · tb-peyz ─────────────────────────────────────────────────────────
slides.push(lamina('tb-peyz', 'Peyz lleva cincuenta y tres kills y solo diez muertes en todo el Mundial.', `
    ${borroso('splash/Jhin_0-fondo.jpg', 0.45)}
    ${panel(`
      ${vista('splash/Jhin_0.jpg', 'Jhin, splash base', { ...SP, cam: [0.5, 0.42, 1, 0.55, 0.4, 1.1] })}
      ${velo(720)}
      ${dato('53', { tam: 460, clase: 't1', bottom: 250, tracking: 10, attrs: 'data-dato' })}
      ${dato('10', { tam: 260, clase: 't1', bottom: 40, tracking: 10, attrs: 'data-dato' })}`)}`));

// ── 18 · tb-viper ────────────────────────────────────────────────────────
// Ezreal arriba y Ashe abajo, cada uno con su marca de Viper; entran juntos con fundido.
slides.push(lamina('tb-viper', 'Más le vale a Viper sacar su Ezreal, porque con la Ashe va cero a dos.', `
    ${borroso('splash/Jhin_0-fondo.jpg', 0.2)}
    ${panel(`
      <div data-mitades style="position: absolute; inset: 0;">
        ${vista('splash/Ezreal_0.jpg', 'Ezreal, splash base', { x: 0, y: 0, w: PW, h: 680, ...SP, cam: [0.5, 0.45, 1, 0.55, 0.42, 1.08] })}
        ${vista('splash/Ashe_0.jpg', 'Ashe, splash base', { x: 0, y: 690, w: PW, h: 680, ...SP, cam: [0.5, 0.45, 1, 0.45, 0.42, 1.08] })}
        <div style="position: absolute; left: 0; top: 0; width: 560px; height: ${PH}px; background: linear-gradient(90deg, ${a(BG, 0.85)}, ${a(BG, 0)});"></div>
      </div>
      <div data-dato style="position: absolute; left: 40px; top: 210px; font-size: 300px; line-height: 1; letter-spacing: 10px; white-space: nowrap;"><span class="blg">3-0</span></div>
      <div data-dato style="position: absolute; left: 40px; top: 900px; font-size: 300px; line-height: 1; letter-spacing: 10px; white-space: nowrap;"><span class="blg">0-2</span></div>`)}`));

// ── 19 · tb-casas ────────────────────────────────────────────────────────
// La cifra arriba y el logo de BLG abajo (otra composición que catorce, msi y cerotres).
slides.push(lamina('tb-casas', 'Por primera vez en el Mundial las casas de apuestas no tienen a T1 de favorito: cincuenta y seis por ciento a Bilibili.', `
    ${borroso('splash/Orianna_0-fondo.jpg', 0.26)}
    ${ambiente(BLG, 0.16, '50% 30%')}
    ${panel(`
      ${dato('56%', { tam: 520, clase: 'blg', top: 260, tracking: 10 })}
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('BLG', 'Logo de Bilibili Gaming', { x: 300, y: 920, w: 480 })}</div>`)}`));

// ── 20 · tb-gente ────────────────────────────────────────────────────────
slides.push(lamina('tb-gente', 'La gente que sí sabe vota setenta y tres por ciento por T1.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.28, '60% 30%')}
    ${ambiente(T1, 0.16, '50% 30%')}
    ${panel(`
      ${dato('73%', { tam: 520, clase: 't1', top: 260, tracking: 10 })}
      <div data-logo style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">${logo('T1', 'Logo de T1', { x: 250, y: 950, w: 580 })}</div>`)}`));

// ── 21 · tb-citas ────────────────────────────────────────────────────────
// El lado derecho del splash: la corona en su mano y las estatuas de los zorros; empuje muy lento.
slides.push(lamina('tb-citas', 'Faker ya lo dijo, y Viper quiere romper la maldición.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.4, '85% 30%')}
    ${panel(`
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash: la corona', { ...SP, cam: [0.8, 0.32, 1.12, 0.79, 0.3, 1.18] })}`)}`));

// ── 22 · tb-maldicion ────────────────────────────────────────────────────
slides.push(lamina('tb-maldicion', 'Esa maldición tiene trece años y cara de rey demonio.', `
    ${borroso('centered/Ahri_86-fondo.jpg', 0.42)}
    ${panel(`
      ${vista('centered/Ahri_86.jpg', 'Ahri Leyenda Inmortalizada, imagen centrada', { iw: 1280, ih: 720, cam: [0.5, 0.5, 1.12, 0.5, 0.44, 1.2] })}
      ${velo(560)}
      ${dato('13 AÑOS', { tam: 290, bottom: 50, tracking: 14 })}`)}`));

// ── 23 · tb-final ────────────────────────────────────────────────────────
slides.push(lamina('tb-final', 'Yo digo T1 tres a uno y nos vemos en Brooklyn contra Gen.G.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.26, '30% 70%')}
    ${ambiente(T1, 0.12, '25% 25%')}
    ${panel(`
      <div data-logos style="position: absolute; left: 0; top: 0; width: ${PW}px; height: 640px;">
        ${logo('T1', 'Logo de T1', { x: 60, y: 260, w: 440 })}
        ${logo('GEN', 'Logo de Gen.G', { x: 610, y: 180, w: 400 })}
      </div>
      ${dato('T1 3-1', { tam: 320, clase: 't1', top: 640, tracking: 12 })}
      ${dato('BROOKLYN', { tam: 200, top: 990, tracking: 16 })}`)}`));

// ── 24 · tb-cierre ───────────────────────────────────────────────────────
// El splash cerrado en el rostro (otro recorte que tb-faker).
slides.push(lamina('tb-cierre', 'Ni pedo, solo queda decir gigi easy.', `
    ${borroso('splash/Ahri_86-fondo.jpg', 0.45, '75% 30%')}
    ${panel(`
      ${vista(AHRI, 'Ahri Leyenda Inmortalizada, splash: el rostro', { ...SP, cam: [0.52, 0.26, 1.22, 0.53, 0.21, 1.36] })}
      ${velo(560)}
      ${dato('GG EZ', { tam: 440, bottom: 30, tracking: 10 })}`)}`));

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
      if (c[0] === c[3] && c[1] === c[4] && c[2] === c[5]) return;     // encuadre fijo (las seis skins)
      var ini = encuadre(vw, vh, cw, ch, c[0], c[1], c[2]), fin = encuadre(vw, vh, cw, ch, c[3], c[4], c[5]);
      ini.transformOrigin = '0 0'; fin.transformOrigin = '0 0';
      fin.duration = DUR; fin.ease = 'power1.out'; fin.immediateRender = true;
      tl.fromTo(img, ini, fin, 0);
    });
  }
  // Empuje leve de un elemento sobre sí mismo (logos, rejillas).
  function empuje(tl, el, hasta, origen) {
    if (el) tl.fromTo(el, { scale: 1 }, { scale: hasta || 1.06, transformOrigin: origen || '50% 40%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  }
  function fundido(tl, el, desde, dur, en) {
    if (el) tl.fromTo(el, { opacity: desde }, { opacity: 1, duration: dur || 0.6, ease: 'power1.out', immediateRender: true }, en || 0);
  }
  // Los datos de la lámina entran con fundido, juntos.
  function datos(tl, s, en) { q(s, '[data-dato]').forEach(function (d) { fundido(tl, d, 0, 0.6, en); }); }
  function lamina(id, extra) {
    animar(id, function (tl, s) { camara(tl, s); if (extra) extra(tl, s); });
  }

  // Los dos logos juntos con fundido, luego empuje lento; los datos detrás.
  lamina('tb-portada', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.15, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.06); datos(tl, s, 0.8); });
  lamina('tb-gen', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.07); datos(tl, s, 0.7); });
  lamina('tb-faker');
  lamina('tb-racha', function (tl, s) { datos(tl, s, 0.7); });
  lamina('tb-catorce', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.07); datos(tl, s, 0.6); });
  lamina('tb-once', function (tl, s) { datos(tl, s, 0.7); });
  // Las seis skins entran juntas y la rejilla se desliza (paneo), sin armarse por piezas.
  lamina('tb-copas', function (tl, s) {
    var r = uno(s, '[data-rejilla]');
    fundido(tl, r, 0.2, 0.6, 0);
    tl.fromTo(r, { x: 46 }, { x: 0, duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
    datos(tl, s, 0.5);
  });
  lamina('tb-g2dk', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.15, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.05); datos(tl, s, 0.8); });
  lamina('tb-2024', function (tl, s) { empuje(tl, uno(s, '[data-logos]'), 1.05, '50% 50%'); datos(tl, s, 0.7); });
  lamina('tb-msi', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.07, '50% 20%'); datos(tl, s, 0.6); });
  lamina('tb-cerotres', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.07, '0% 30%'); datos(tl, s, 0.6); });
  lamina('tb-camino-t1', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.15, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.04, '50% 50%'); });
  lamina('tb-camino-blg', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.15, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.04, '50% 50%'); datos(tl, s, 0.8); });
  lamina('tb-koi', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.07, '50% 30%'); datos(tl, s, 0.6); });
  lamina('tb-orianna', function (tl, s) { datos(tl, s, 0.7); });
  // La cuadrícula completa entra con fundido y luego empuje; los íconos no entran uno por uno.
  lamina('tb-nueve', function (tl, s) { var r = uno(s, '[data-rejilla]'); fundido(tl, r, 0.2, 0.7, 0); empuje(tl, r, 1.04, '50% 50%'); datos(tl, s, 0.8); });
  lamina('tb-peyz', function (tl, s) { datos(tl, s, 0.7); });
  lamina('tb-viper', function (tl, s) { fundido(tl, uno(s, '[data-mitades]'), 0.3, 0.6, 0); datos(tl, s, 0.6); });
  lamina('tb-casas', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '50% 75%'); datos(tl, s, 0.5); });
  lamina('tb-gente', function (tl, s) { empuje(tl, uno(s, '[data-logo]'), 1.06, '50% 75%'); datos(tl, s, 0.5); });
  lamina('tb-citas');
  lamina('tb-maldicion', function (tl, s) { datos(tl, s, 0.8); });
  lamina('tb-final', function (tl, s) { fundido(tl, uno(s, '[data-logos]'), 0.15, 0.7, 0); empuje(tl, uno(s, '[data-logos]'), 1.05); datos(tl, s, 0.8); });
  lamina('tb-cierre', function (tl, s) { datos(tl, s, 0.6); });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>T1 vs BLG · Semifinal</title>
${kit.og({ titulo: 'T1 vs BLG · Semifinal del Mundial 2026', descripcion: 'La previa del domingo 8 de noviembre: el 13-0 de Faker contra la LPL en Bo5 de Mundiales, sus 11 semifinales, el 0-3 de BLG contra T1 y los números de la serie. Solo arte oficial.', carpeta: 'creator/t1-blg' })}
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
