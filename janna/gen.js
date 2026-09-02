// Generador de index.html — Janna cumple 17 años (screenshots para TikTok)
// Ejecutar: node janna/gen.js
//
// Serie «Cumplelolero» #7 y **cierre de la tanda de cuatro cumpleañeros del
// 2 de septiembre** (blitzcrank, malphite, mundo, janna): por eso hay una
// lámina que compara a los cuatro one tricks y otra que compara sus edades
// en el lore. Formato TikTok de siempre: 1080×1920, banda central 300/350.
//
// Animado con GSAP, como /mundo/: cada lámina registra su coreografía con
// animar() y los estados iniciales van con tl.from(), nunca ocultando en CSS.
// La pieza del deck es la lámina del one trick: se construyen las cifras
// enormes y al final caen las dos colas en gris — el chiste es que después de
// tres videos burlándose del elo, este ni rango tiene.
//
// Paleta muestreada: el splash es aguamarina (hue 165–210) y su icono aporta
// el rosa (hue 330–345). El gris pizarra es el «sin clasificar».
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Janna: tormenta, viento y diosa ───────────────────────────────
const BG = '#060F14';        // azul de tormenta casi negro
const WIND = '#69E8C8';      // aguamarina del viento — acento principal
const ROSE = '#F2799E';      // el rosa de su icono — la diosa, lore y remates
const SLATE = '#6E7A8A';     // gris pizarra — el «sin clasificar»
const TEXT = '#EAF4F2';      // texto principal
const MUTED = '#8798A0';     // texto secundario
const PANEL = '#0E1A20';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${TEXT}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = WIND, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = WIND) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">${txt}</h2>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(105,232,200,0.26); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,15,20,0) 40%, rgba(6,15,20,0.85) 100%);"></div>
      </div>`;

const pasos = (lista, color = WIND) => `
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 17px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span data-paso-num style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${color}; width: 46px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = WIND) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${TEXT}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Y llegamos a la ultima cumpleanera de los cuatro. Janna, que tambien cumple diecisiete anos." style="${seccion()} background-image: linear-gradient(180deg, rgba(6,15,20,0.25) 0%, rgba(6,15,20,0.95) 78%), url('assets/Janna_0.jpg'); background-size: cover; background-position: center 18%;">
    ${glow(WIND, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · la última de los cuatro')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 210px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${TEXT}; text-shadow: 0 0 90px rgba(105,232,200,0.4);"><span data-linea style="display: block;">JANNA</span><span data-linea style="display: block; color: ${WIND};">17 AÑOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${WIND}; line-height: 1.3;">La Furia de la Tormenta</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Support · Zaun</p>
    </div>
  </section>`);

// ── 2 · Viento a favor o en contra ───────────────────────────────────────
const vientos = [
  [WIND, '↑', 'Si te toca uno bueno', 'La partida <strong style="color:' + TEXT + ';">se siente distinta</strong>'],
  [SLATE, '↓', 'Si te toca uno malo', '<strong style="color:' + TEXT + ';">Mejor ni jugaste</strong>'],
];

slides.push(`
  <section data-label="Viento a favor o en contra" data-screen-label="02 · El viento" data-speaker-notes="Es de esos personajes que si te toca uno bueno la partida se siente distinta y si te toca uno malo mejor ni jugaste." style="${seccion()}">
    ${glow(WIND, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Que te toque una en el equipo')}
      ${titulo('O el viento va<br><span style="color: ' + WIND + ';">a tu favor</span>', 104)}

      ${arte('Janna_0.jpg', 'Janna original', 380, 'center 22%', 'margin-top: 38px;')}

      <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 22px;">
        ${vientos.map(([color, flecha, cabeza, texto]) => `
        <div data-viento style="display: flex; align-items: center; gap: 26px; padding: 28px 32px; border-radius: 18px; background: ${color}14; border: 1px solid ${color}59;">
          <span style="flex: none; width: 74px; height: 74px; border-radius: 50%; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; font-size: 40px; line-height: 1; color: ${color};">${flecha}</span>
          <div style="min-width: 0;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${color};">${cabeza}</div>
            <div style="margin-top: 6px; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">${texto}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 3 · El one trick que rompió el molde ─────────────────────────────────
const colas = [
  ['Solo / Dúo', 'Sin clasificar'],
  ['Flexible', 'Sin clasificar'],
];

const panel = (etiqueta, contenido, marca) => `
        <div data-panel="${marca}" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(105,232,200,0.26); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img data-retrato src="assets/icon-Janna.png" alt="Janna" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${WIND}; box-shadow: 0 0 46px rgba(105,232,200,0.42);">
                <span data-insignia style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${WIND}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">841</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span data-cuenta="11378258" style="font-family: ${DISPLAY}; font-size: 78px; line-height: 0.9; color: ${WIND}; margin-top: 20px;">11 378 258</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Janna</span>
              <div data-medalla style="margin-top: 24px; padding: 10px 22px; border-radius: 999px; background: ${ROSE}1F; border: 1px solid ${ROSE}; text-align: center;">
                <span style="font-size: 22px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${ROSE};">Mejor Janna del mundo</span>
              </div>
              <span style="margin-top: 12px; font-size: 21px; font-weight: 500; color: ${MUTED}; text-align: center;">insignia oficial · 8× más que su 2ª<br>(Nami · 1 422 731)</span>`, 'maestria');

const panelColas = panel('Sus dos colas de ranked', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 18px;">
                ${colas.map(([cola, estado]) => `
                <div data-cola style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 30px 18px; border-radius: 16px; background: rgba(110,122,138,0.10); border: 1px dashed ${SLATE}99;">
                  <span style="width: 92px; height: 92px; border-radius: 50%; border: 3px solid ${SLATE}66; display: flex; align-items: center; justify-content: center; font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${SLATE};">—</span>
                  <span style="font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">${cola}</span>
                  <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${SLATE};">${estado}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 18px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">No entra <strong style="color: ${SLATE};">a ninguna de las dos</strong></span>`, 'colas');

slides.push(`
  <section data-label="El one trick #1" data-screen-label="03 · El OTP" data-speaker-notes="Es un europeo con once millones cuatrocientos mil puntos de maestria y nivel ochocientos cuarenta y uno, y hasta le pusieron una insignia oficial de mejor Janna del mundo. Pero este cabron no juega ranked. Ni Solo Duo ni Flex, esta sin clasificar en las dos." style="${seccion()}">
    ${glow(WIND, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${TEXT};">JANNA</span>
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${WIND};">#ラフレシア</span>
      </div>
      <p data-nombre style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Europa Oeste · nivel de invocador 1 748 · sus cuatro más jugadas son support</p>

      <div style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelColas}
      </div>

      ${remate('Después de tres videos burlándome del elo de los otepés, viene este y <strong style="color: ' + SLATE + ';">ni rango tiene que enseñar</strong>. No es que sea malo: le vale competir. Nomás quiere jugar Janna.', WIND)}
    </div>
  </section>`);

// ── 4 · Cómo quedaron los cuatro ─────────────────────────────────────────
const tanda = [
  ['Blitzcrank', 'icon-Blitzcrank.png', 'rokinas', '8,40', 47, 'Llegó a Master', WIND],
  ['Malphite', 'icon-Malphite.png', 'BCBG', '11,20', 62, 'Cinco temporadas en Bronce', ROSE],
  ['Dr. Mundo', 'icon-DrMundo.png', 'EVANPORADA', '17,96', 100, 'Nunca pasó de Plata', ROSE],
  ['Janna', 'icon-Janna.png', 'Janna #ラフレシア', '11,38', 63, 'Ni entra a la cola', SLATE],
];

slides.push(`
  <section data-label="Los cuatro one tricks" data-screen-label="04 · Los cuatro" data-speaker-notes="Wachen como quedaron los cuatro. El de Blitzcrank llego a Master, el de Malphite lleva cinco temporadas en Bronce, el de Mundo nunca ha pasado de Plata, y esta ni siquiera entra a la cola. Cuatro cumpleaneros el mismo dia y cuatro formas distintas de estar enfermo." style="${seccion()}">
    ${glow(ROSE, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Los cuatro del 2 de septiembre', ROSE)}
      ${titulo('Cuatro formas distintas<br><span style="color: ' + ROSE + ';">de estar enfermo</span>', 84)}

      <div style="margin-top: 42px; display: flex; flex-direction: column; gap: 20px;">
        ${tanda.map(([campeon, icono, otp, millones, pct, veredicto, color]) => `
        <div data-fila style="display: flex; align-items: center; gap: 20px;">
          <img src="assets/${icono}" alt="${campeon}" style="width: 84px; height: 84px; border-radius: 14px; flex: none; border: 2px solid ${color}73;">
          <div style="flex: none; width: 210px; min-width: 0;">
            <div style="font-size: 27px; font-weight: 700; color: ${TEXT}; line-height: 1.1;">${campeon}</div>
            <div style="font-size: 20px; font-weight: 500; color: ${MUTED}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otp}</div>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0;">
            <div style="height: 34px; border-radius: 8px; background: rgba(255,255,255,0.06); overflow: hidden;">
              <div data-barra style="width: ${pct}%; height: 100%; background: ${color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; box-sizing: border-box;">
                <span style="font-family: ${DISPLAY}; font-size: 24px; color: ${BG};">${millones} M</span>
              </div>
            </div>
            <span data-veredicto style="font-size: 23px; font-weight: 600; color: ${color};">${veredicto}</span>
          </div>
        </div>`).join('')}
      </div>

      ${remate('Mismo cumpleaños, mismos diecisiete años… y <strong style="color: ' + ROSE + ';">cada uno enfermo a su manera</strong>.', ROSE)}
    </div>
  </section>`);

// ── 5 · Las skins, el precio y el chiste de la Victoriosa ────────────────
const skins = [
  ['Janna_3.jpg', 'Reina de Hielo', '975 RP'],
  ['Janna_5.jpg', 'Reportera del Clima', '1820 RP'],
  ['Janna_7.jpg', 'Guardiana Estelar', '1350 RP'],
  ['Janna_8.jpg', 'Espada Sagrada', '1350 RP'],
  ['Janna_20.jpg', 'Guardiana de las Arenas', '1350 RP'],
  ['Janna_27.jpg', 'Reina Guerrera', '1350 RP'],
  ['Janna_36.jpg', 'Rosa de Cristal', '1350 RP'],
  ['Janna_45.jpg', 'Halo Cibernético', '1350 RP'],
];

slides.push(`
  <section data-label="Las skins y el precio" data-screen-label="05 · Skins y precio" data-speaker-notes="Janna tiene dieciseis en total y solo ocho las puedes comprar, que te saldrian en unos ochenta y cuatro dolares." style="${seccion()}">
    ${glow(WIND, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('16 skins, pero solo<br><span style="color: ' + WIND + ';">8 a la venta</span>', 88)}

      <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        ${skins.map(([img, nombre, rp]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 7px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 132px; object-fit: cover; object-position: center 22%; border-radius: 10px; border: 1px solid rgba(105,232,200,0.22);">
            <span style="font-size: 19px; font-weight: 600; color: ${TEXT}; line-height: 1.15;">${nombre}</span>
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 1px; color: ${WIND};">${rp}</span>
          </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 34px;">
        <div style="font-family: ${DISPLAY}; font-size: 116px; line-height: 0.86; color: ${WIND};">~<span data-cuenta="84">84</span> <span style="font-size: 62px;">USD</span></div>
        <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las ocho · 10 895 RP · ~1 635 MXN</div>
      </div>
    </div>
  </section>`);

// ── 6 · El chiste de la Victoriosa ───────────────────────────────────────
slides.push(`
  <section data-label="La Victoriosa" data-screen-label="06 · La Victoriosa" data-speaker-notes="Y aqui esta lo chistoso, porque una de las que no puedes comprar es la Victorious, que es una skin que no se vende, se gana subiendo de rango en una temporada. O sea que la unica skin de Janna que ese wey seguramente nunca va a tener es justamente la que se gana jugando en serio." style="${seccion()}">
    ${glow(ROSE, '50% 36%', '112% 52%')}
    <div style="position: relative;">
      ${eyebrow('Y aquí está lo chistoso', ROSE)}
      ${arte('Janna_4.jpg', 'Janna Victoriosa', 360, 'center 20%')}
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 84px; line-height: 0.94; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">Hay una skin<br><span style="color: ${ROSE};">que no se compra</span></h2>

      <p data-a="up3" style="margin: 30px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">La <strong style="color: ${TEXT};">Janna Victoriosa</strong> no está en la tienda: <strong style="color: ${ROSE};">se gana subiendo de rango</strong> en una temporada de ranked.</p>

      ${remate('O sea que la única skin de Janna que el mejor Janna del mundo <strong style="color: ' + ROSE + ';">seguramente nunca va a tener</strong> es justamente la que se gana jugando en serio.', ROSE)}
    </div>
  </section>`);

// ── 7 · El lore: no es maga, es diosa ────────────────────────────────────
const edades = [
  ['Blitzcrank', '6 a 11 años', 'icon-Blitzcrank.png', false],
  ['Dr. Mundo', '20 a 30 años', 'icon-DrMundo.png', false],
  ['Malphite', '~3 000 años', 'icon-Malphite.png', false],
  ['Janna', '~6 000 años', 'icon-Janna.png', true],
];

slides.push(`
  <section data-label="No es maga, es diosa" data-screen-label="07 · La diosa" data-speaker-notes="Y su lore es el mejor de los cuatro. Janna no es una maga, es una diosa. Y no una diosa cualquiera, tiene por lo menos seis mil anos, o sea que es la mas vieja de los cuatro cumpleaneros por muchisimo." style="${seccion()}">
    ${glow(ROSE, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El lore', ROSE)}
      ${titulo('Janna no es una maga.<br><span style="color: ' + ROSE + ';">Es una diosa.</span>', 88)}

      <p data-a="up3" style="margin: 30px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Y no una diosa cualquiera: <strong style="color: ${TEXT};">tiene por lo menos seis mil años</strong>. En el lore es la más vieja de los cuatro por muchísimo.</p>

      <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 16px;">
        ${edades.map(([nombre, edad, icono, top]) => `
        <div data-edad style="display: flex; align-items: center; gap: 22px; padding: 20px 26px; border-radius: 16px; background: ${top ? ROSE + '1A' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${top ? ROSE + '73' : 'rgba(255,255,255,0.07)'};">
          <img src="assets/${icono}" alt="${nombre}" style="width: 72px; height: 72px; border-radius: 12px; flex: none; ${top ? `border: 2px solid ${ROSE};` : 'filter: grayscale(0.7); opacity: 0.7;'}">
          <span style="flex: 1; font-size: 28px; font-weight: ${top ? '700' : '500'}; color: ${top ? TEXT : MUTED};">${nombre}</span>
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 52px; line-height: 1; color: ${top ? ROSE : MUTED};">${edad}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 8 · El pájaro azul y Jan'ahrem ───────────────────────────────────────
slides.push(`
  <section data-label="El pájaro azul" data-screen-label="08 · Jan'ahrem" data-speaker-notes="Empezo como una historia de marineros. Decian que veian un pajaro azul brillante justo antes de que llegara el viento fuerte, y que oian un silbido en el aire antes de la tormenta, como si algo los estuviera advirtiendo. Le pusieron Jan'ahrem, que en shurimano antiguo quiere decir guardiana. Y con el tiempo eso se acorto a Janna." style="${seccion()}">
    ${glow(WIND, '50% 34%', '110% 48%')}
    <div style="position: relative;">
      ${eyebrow('Cómo empezó')}
      ${titulo('Una historia<br><span style="color: ' + WIND + ';">de marineros</span>', 100)}
      ${pasos([
        'Veían <strong style="color:' + TEXT + ';">un pájaro azul brillante</strong> justo antes de que llegara el viento fuerte',
        'Oían <strong style="color:' + TEXT + ';">un silbido en el aire</strong> antes de la tormenta, como si algo los advirtiera',
        'Sus creyentes más fieles estaban en <strong style="color:' + TEXT + ';">lo que hoy es Zaun</strong>: necesitaban el mar tranquilo para su puerto',
        'Le hacían estatuas y usaban <strong style="color:' + TEXT + ';">amuletos con forma de pájaro azul</strong>',
      ])}

      <div data-nombre-lore style="margin-top: 36px; padding: 30px 34px; border-radius: 18px; background: ${PANEL}D9; border-left: 6px solid ${WIND};">
        <div style="font-family: ${DISPLAY}; font-size: 74px; line-height: 1; color: ${WIND};">JAN’AHREM</div>
        <div style="margin-top: 10px; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">«<strong style="color: ${TEXT};">Guardiana</strong>» en shurimano antiguo, porque siempre aparecía cuando más la necesitaban. Con el tiempo se acortó a <strong style="color: ${TEXT};">Janna</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 9 · La olvidaron y volvió igual ──────────────────────────────────────
slides.push(`
  <section data-label="La olvidaron" data-screen-label="09 · El regreso" data-speaker-notes="Con el tiempo la gente de Zaun dejo de rezarle. Se clavaron con las maquinas y simplemente la olvidaron. Hasta que un dia distritos enteros se hundieron por debajo del nivel del mar y miles de personas quedaron peleando contra la corriente. Y en la desesperacion le volvieron a rezar. Y ella fue." style="${seccion()}">
    ${glow(ROSE, '50% 36%', '112% 52%')}
    <div style="position: relative;">
      ${eyebrow('Y luego la olvidaron', ROSE)}
      ${titulo('Dejaron de rezarle…<br><span style="color: ' + ROSE + ';">y ella fue igual</span>', 88)}
      ${pasos([
        'Zaun <strong style="color:' + TEXT + ';">se clavó con las máquinas</strong> y simplemente la olvidó',
        'Un día <strong style="color:' + TEXT + ';">distritos enteros se hundieron</strong> bajo el nivel del mar',
        'Miles de personas quedaron <strong style="color:' + TEXT + ';">peleando contra la corriente</strong> del río',
        'En la desesperación <strong style="color:' + TEXT + ';">le volvieron a rezar. Y ella fue.</strong>',
      ], ROSE)}
      ${remate('Frenó el agua para que pudieran salir y <strong style="color: ' + ROSE + ';">disipó el humo de los incendios</strong> para que pudieran ver y respirar mientras corrían. Murieron muchos, pero los que sobrevivieron volvieron a creer.', ROSE)}
    </div>
  </section>`);

// ── 10 · El remate de diseño ─────────────────────────────────────────────
slides.push(`
  <section data-label="La support perfecta" data-screen-label="10 · El remate" data-speaker-notes="Y hay un detalle de diseno que me parece perfecto. El lore dice que el poder de Janna depende literalmente de cuanta gente crea en ella. O sea que Riot hizo a la support perfecta, un personaje cuya fuerza entera depende de que los demas la volteen a ver." style="${seccion()}">
    ${glow(WIND, '50% 36%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El detalle de diseño')}
      ${titulo('Su poder depende de<br><span style="color: ' + WIND + ';">cuánta gente crea en ella</span>', 76)}

      <p data-a="up3" style="margin: 34px 0 0; font-size: 32px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Está literal en el lore: a Janna <strong style="color: ${TEXT};">la moldea la fe de sus seguidores</strong>. Mientras más gente crea, más fuerte es.</p>

      <div data-cita style="margin-top: 46px; padding: 44px 46px; border-radius: 22px; background: ${PANEL}D9; border-left: 6px solid ${WIND};">
        <div style="font-family: ${DISPLAY}; font-size: 76px; line-height: 1.02; color: ${TEXT};">Riot hizo a la<br><span style="color: ${WIND};">support perfecta</span></div>
        <div style="margin-top: 20px; font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Un personaje cuya fuerza entera depende de <strong style="color: ${TEXT};">que los demás la volteen a ver</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 11 · Cierre de la tanda ──────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="11 · Cierre" data-speaker-notes="Y con esa cerramos los cuatro cumpleaneros. Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${glow(WIND, '50% 34%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y con esa')}
      ${titulo('Cerramos los cuatro<br><span style="color: ' + WIND + ';">cumpleañeros</span>', 96)}

      <div style="margin-top: 46px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;">
        ${['icon-Blitzcrank.png', 'icon-Malphite.png', 'icon-DrMundo.png', 'icon-Janna.png'].map((icono, i) => `
        <div data-cierre-icono style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <img src="assets/${icono}" alt="Cumpleañero ${i + 1}" style="width: 100%; height: auto; border-radius: 18px; border: 2px solid ${WIND}73;">
          <span style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">17 años</span>
        </div>`).join('')}
      </div>

      <div data-gigi style="margin-top: 54px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${ROSE};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Todo con tl.from(): sin JS el deck se ve completo. Ninguna timeline pasa de
// ~1,8 s, que es lo que espera tools/capturar.mjs antes de disparar el PNG.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  function cuentaMil(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.05, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.05)
      .from(q(s, '[data-linea]'), { y: 56, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.18)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.62);
  });

  // El viento entra desde los lados opuestos según a dónde sopla: la buena
  // desde la izquierda, la mala desde la derecha.
  animar('Viento a favor o en contra', function (tl, s) {
    var v = q(s, '[data-viento]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.62 }, 0.1)
      .from(s.querySelector('[data-a="img"]'), { scale: 1.05, opacity: 0, duration: 0.85 }, 0.24)
      .from(v[0], { x: -50, opacity: 0, duration: 0.6 }, 0.62)
      .from(v[1], { x: 50, opacity: 0, duration: 0.6 }, 0.78);
  });

  // La pieza del deck: primero se construyen las cifras enormes y la medalla
  // de «mejor del mundo», y HASTA EL FINAL caen las dos colas en gris. El
  // orden es el chiste: se sube al pedestal y luego se ve que no compite.
  animar('El one trick #1', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.08)
      .from(s.querySelector('[data-panel="maestria"]'), { x: -54, opacity: 0, duration: 0.7 }, 0.22)
      .from(s.querySelector('[data-retrato]'), { scale: 0.7, duration: 0.6, ease: 'back.out(2)' }, 0.4)
      .from(s.querySelector('[data-insignia]'), { scale: 0, duration: 0.45, ease: 'back.out(2.6)' }, 0.62)
      .from(s.querySelector('[data-medalla]'), { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.8)
      .from(s.querySelector('[data-panel="colas"]'), { opacity: 0, duration: 0.5 }, 0.95)
      .from(q(s, '[data-cola]'), { y: -26, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)' }, 1.0)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.25);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.45, 0.9);
  });

  // Los cuatro: las barras crecen y el veredicto de cada uno aparece detrás,
  // para que se lea primero el tamaño de la obsesión y luego a dónde lo llevó.
  animar('Los cuatro one tricks', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-fila]'), { x: -30, opacity: 0, duration: 0.5, stagger: 0.11 }, 0.24)
      .from(q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.8, ease: 'power2.inOut', stagger: 0.11 }, 0.36)
      .from(q(s, '[data-veredicto]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.11 }, 0.72)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.2);
  });

  animar('Las skins y el precio', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 30, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.07 }, 0.24)
      .from(s.querySelector('[data-precio]'), { y: 28, opacity: 0, duration: 0.6 }, 0.86);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.86, 0.8);
  });

  animar('La Victoriosa', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="img"]'), { scale: 1.05, opacity: 0, duration: 0.85 }, 0.15)
      .from(s.querySelector('h2'), { y: 30, opacity: 0, duration: 0.6 }, 0.34)
      .from(s.querySelector('p[data-a="up3"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.55)
      .from(s.querySelector('[data-remate]'), { y: 26, opacity: 0, duration: 0.6 }, 0.85);
  });

  // Las edades entran de menor a mayor y la de Janna aterriza al final: la
  // cascada es la que hace el chiste de los seis mil años.
  animar('No es maga, es diosa', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.62 }, 0.1)
      .from(s.querySelector('p[data-a="up3"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.32)
      .from(q(s, '[data-edad]'), { x: 30, opacity: 0, duration: 0.5, stagger: 0.14 }, 0.5);
  });

  ["El pájaro azul", "La olvidaron"].forEach(function (etiqueta) {
    animar(etiqueta, function (tl, s) {
      tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
        .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
        .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.62 }, 0.14)
        .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.38)
        .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2.2)' }, 0.41)
        .from(s.querySelector('[data-nombre-lore]') || s.querySelector('[data-remate]'), { y: 26, opacity: 0, duration: 0.6 }, 1.0);
    });
  });

  animar('La support perfecta', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.65 }, 0.15)
      .from(s.querySelector('p[data-a="up3"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.4)
      .from(s.querySelector('[data-cita]'), { y: 40, opacity: 0, duration: 0.75 }, 0.6);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="up2"]'), { y: 40, opacity: 0, duration: 0.7 }, 0.18)
      .from(q(s, '[data-cierre-icono]'), { y: 34, opacity: 0, scale: 0.9, duration: 0.55, stagger: 0.09, ease: 'back.out(1.7)' }, 0.5)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.95);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Janna cumple 17 años</title>
${kit.og({ titulo: "Janna cumple 17 años", descripcion: "Diecisiete años de la Furia de la Tormenta: el mejor Janna del mundo que no juega ranked, la skin que solo se gana compitiendo, y la diosa a la que dejaron de rezarle y volvió igual. Apoyo visual para TikTok.", carpeta: "janna" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(105,232,200,0.45); border-radius: 999px;
    background: rgba(6,15,20,0.85); color: ${WIND}; cursor: pointer;
    font: 600 13px/1 ${BODY}; letter-spacing: 0.6px;
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
<script src="./gsap.min.js"></script>
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

// kit.diferir: todo lo que no sea la portada sale con data-src/data-bg, para
// que al entrar el navegador solo descargue los assets de la primera lámina.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
