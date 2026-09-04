// Generador de index.html — Ivern cumple 10 años (screenshots para TikTok)
// Ejecutar: node ivern/gen.js
//
// Serie «Cumplelolero» #8. Formato de siempre (1080×1920, banda central
// 300/350, Bebas Neue) pero con tres variaciones deliberadas de diseño:
//
//  1. La portada es CENTRADA, con el «10» gigante de fondo, en vez del bloque
//     abajo a la izquierda que usan los otros siete decks.
//  2. El bloque del lore arranca en paleta FRÍA del Freljord (Ivern el Cruel)
//     y vira a verde al transformarse. Ningún otro deck cambia de paleta a
//     media presentación; aquí el color cuenta la historia.
//     El pasado se pinta con el MISMO splash en escala de grises — es el mismo
//     personaje, así que no hacía falta otro asset.
//  3. El remate es una GRÁFICA DE DISPERSIÓN (puntos de maestría contra rango)
//     con los ocho one tricks de la serie, en vez de barras. Es el único
//     formato que deja ver de un golpe que las dos cosas no se correlacionan.
//
// Animado con GSAP: estados iniciales solo con tl.from(), ninguna timeline
// pasa de ~1,8 s (lo que espera tools/capturar.mjs).
//
// Paleta muestreada del splash: oro-oliva (hue 45–60) del Sauce Dios.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Ivern: bosque, savia, oro del Sauce Dios y escarcha ───────────
const BG = '#08110D';        // bosque de noche
const SAP = '#7DD66B';       // verde savia — el Padre Verde, acento principal
const GOLD = '#E0B94A';      // oro del Sauce Dios — cifras, dinero y logros
const FROST = '#7FA8C9';     // acero frío del Freljord — todo Ivern el Cruel
const BONE = '#EDF3EA';      // texto principal
const MUTED = '#8A9A8E';     // texto secundario
const PANEL = '#101C15';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = SAP, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = SAP) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// `frio` pinta el splash en escala de grises: es el mismo Ivern, antes.
const arte = (src, alt, alto, pos = 'center 25%', extra = '', frio = false) => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid ${frio ? 'rgba(127,168,201,0.30)' : 'rgba(125,214,107,0.26)'}; box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};${frio ? ' filter: grayscale(0.92) contrast(1.12) brightness(0.82);' : ''}">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,17,13,0) 40%, rgba(8,17,13,0.85) 100%);"></div>
      </div>`;

const pasos = (lista, color = SAP) => `
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 17px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span data-paso-num style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${color}; width: 46px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = SAP) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada (composición centrada, variación de la serie) ────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy es cumpleanos de Ivern, que lleva diez anos desde que llego a la Grieta del Invocador, y toca darle sus tres minutos de atencion." style="${seccion('align-items: center; text-align: center;')} background-image: linear-gradient(180deg, rgba(8,17,13,0.55) 0%, rgba(8,17,13,0.82) 55%, rgba(8,17,13,0.96) 100%), url('assets/Ivern_0.jpg'); background-size: cover; background-position: center 28%;">
    ${glow(SAP, '50% 44%', '120% 55%')}
    <div data-fantasma style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-family: ${DISPLAY}; font-size: 900px; line-height: 0.75; color: ${SAP}; opacity: 0.07; pointer-events: none; white-space: nowrap;">10</div>
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div data-a="up" style="display: flex; align-items: center; gap: 16px; margin-bottom: 30px;">
        <span style="width: 40px; height: 4px; background: ${SAP};"></span>
        <span style="font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${SAP};">Cumplelolero · 5 sep 2016</span>
        <span style="width: 40px; height: 4px; background: ${SAP};"></span>
      </div>
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 208px; font-weight: 400; line-height: 0.8; letter-spacing: 3px; color: ${BONE}; text-shadow: 0 0 90px rgba(125,214,107,0.4);"><span data-linea style="display: block;">IVERN</span><span data-linea style="display: block; color: ${SAP};">10 AÑOS</span></h1>
      <p data-sub style="margin: 36px 0 0; font-size: 40px; font-weight: 500; color: ${GOLD};">El Padre Verde</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Jungla · Espíritu · Ionia</p>
    </div>
  </section>`);

// ── 2 · Diez contra diez mil ─────────────────────────────────────────────
slides.push(`
  <section data-label="Diez contra diez mil" data-screen-label="02 · 10 vs 10 000" data-speaker-notes="Y arrancamos con el dato mas chistoso de todos. Ivern cumple diez anos en el juego, y en el lore tiene casi diez mil. Diez contra diez mil." style="${seccion()}">
    ${glow(GOLD, '50% 44%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('El dato más chistoso', GOLD)}
      ${titulo('Los números<br><span style="color: ' + GOLD + ';">se alinean solos</span>', 96)}

      <div style="margin-top: 58px; display: flex; flex-direction: column;">
        <div data-duelo style="padding: 40px 44px; border-radius: 22px 22px 0 0; background: ${SAP}14; border: 1px solid ${SAP}59; border-bottom: none;">
          <div style="font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">En el juego</div>
          <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 22px;">
            <span style="font-family: ${DISPLAY}; font-size: 170px; line-height: 0.86; color: ${SAP};">10</span>
            <span style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${BONE};">AÑOS</span>
          </div>
        </div>
        <div data-vs style="position: relative; height: 2px; background: ${GOLD}66;">
          <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: ${BG}; padding: 0 22px; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${GOLD};">CONTRA</span>
        </div>
        <div data-duelo style="padding: 40px 44px; border-radius: 0 0 22px 22px; background: ${GOLD}14; border: 1px solid ${GOLD}59; border-top: none;">
          <div style="font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">En el lore</div>
          <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 22px;">
            <span data-cuenta="10000" style="font-family: ${DISPLAY}; font-size: 170px; line-height: 0.86; color: ${GOLD};">10 000</span>
            <span style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${BONE};">AÑOS</span>
          </div>
        </div>
      </div>

      ${remate('Cumple <strong style="color: ' + SAP + ';">diez años</strong> en la Grieta y tiene <strong style="color: ' + GOLD + ';">casi diez mil</strong> en su historia.', GOLD)}
    </div>
  </section>`);

// ── 3 · Lore I · Ivern el Cruel (paleta fría) ────────────────────────────
slides.push(`
  <section data-label="Ivern el Cruel" data-screen-label="03 · El Cruel" data-speaker-notes="Su lore es el mas oscuro que he contado en esta serie, porque el arbolito amigable que platica con los animales antes se llamaba Ivern el Cruel, y era un senor de la guerra del Freljord." style="${seccion()}">
    ${glow(FROST, '50% 32%', '110% 48%')}
    <div style="position: relative;">
      ${eyebrow('El lore más oscuro de la serie', FROST)}
      ${arte('Ivern_0.jpg', 'Ivern, antes de la transformación', 330, 'center 24%', '', true)}
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">Antes se llamaba<br><span style="color: ${FROST};">Ivern el Cruel</span></h2>
      ${pasos([
        'Era <strong style="color:' + BONE + ';">un señor de la guerra del Freljord</strong>',
        'Navegó al este con su clan buscando <strong style="color:' + BONE + ';">la tierra de donde fluye toda la magia</strong>, para quedarse con ese poder',
        'Llegó a Ionia y <strong style="color:' + BONE + ';">arrasó una docena de asentamientos</strong> costeros',
        '<strong style="color:' + BONE + ';">Mató a todo el que se le puso enfrente</strong>',
      ], FROST)}
    </div>
  </section>`);

// ── 4 · Lore II · El hachazo al Sauce Dios ───────────────────────────────
slides.push(`
  <section data-label="El Sauce Dios" data-screen-label="04 · El hachazo" data-speaker-notes="Hasta que llego al bosque sagrado de Omikayalan, al que tambien le dicen el Corazon del Mundo, y ahi encontro al Sauce Dios, un arbol enorme de hojas doradas. Y se dio cuenta de que los vastayas se dejarian matar por ese arbol, asi que para romperles la moral lo talo a hachazos hasta tirarlo." style="${seccion()}">
    ${glow(FROST, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Omikayalan · el Corazón del Mundo', FROST)}
      ${titulo('Encontró un árbol<br><span style="color: ' + GOLD + ';">de hojas doradas</span>', 92)}

      <p data-a="up2" style="margin: 32px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Se dio cuenta de que <strong style="color: ${BONE};">los vastayas se dejarían matar por ese árbol</strong>. Así que para romperles la moral…</p>

      <div data-tala style="margin-top: 44px; padding: 44px 46px; border-radius: 22px; background: ${PANEL}D9; border: 1px solid ${FROST}4D; text-align: center;">
        <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.94; color: ${BONE};">Lo taló <span style="color: ${FROST};">a hachazos</span><br>hasta tirarlo</div>
      </div>

      <div data-caida style="margin-top: 40px; display: flex; align-items: center; gap: 30px;">
        <div style="flex: none; font-family: ${DISPLAY}; font-size: 76px; line-height: 0.9; color: ${GOLD};">Y cayó</div>
        <div style="width: 2px; height: 78px; background: ${GOLD}59;"></div>
        <div style="flex: 1; font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Cuando el árbol cayó, <strong style="color: ${BONE};">Ivern el Cruel cayó con él</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 5 · Lore III · La transformación (frío → verde) ──────────────────────
slides.push(`
  <section data-label="La transformación" data-screen-label="05 · El Padre Verde" data-speaker-notes="Su cuerpo se empezo a convertir en corteza y hojas y empezo a oir llorar a la tierra. Ahi entendio lo que habia hecho y se quedo pidiendo perdon durante eones, hasta que la violencia que traia dentro se le acabo. De ahi salio Ivern el Padre Verde. Y el detalle es que quedo a cargo del legado del arbol que el mismo mato." style="${seccion()}">
    ${glow(SAP, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Lo que salió de ahí')}

      <div style="margin-top: 8px; display: flex; align-items: stretch; gap: 0;">
        <div data-mitad="antes" style="flex: 1; min-width: 0;">
          <div style="position: relative; height: 300px; border-radius: 18px 0 0 18px; overflow: hidden; border: 1px solid ${FROST}4D; border-right: none;">
            <img src="assets/Ivern_0.jpg" alt="Ivern el Cruel" style="width: 100%; height: 100%; object-fit: cover; object-position: center 24%; filter: grayscale(0.95) contrast(1.15) brightness(0.72);">
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${FROST};">Ivern el Cruel</div>
            <div style="margin-top: 4px; font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">señor de la guerra</div>
          </div>
        </div>
        <div data-flecha style="flex: none; width: 92px; display: flex; align-items: flex-start; justify-content: center; padding-top: 118px;">
          <span style="font-family: ${DISPLAY}; font-size: 68px; line-height: 1; color: ${GOLD};">→</span>
        </div>
        <div data-mitad="despues" style="flex: 1; min-width: 0;">
          <div style="position: relative; height: 300px; border-radius: 0 18px 18px 0; overflow: hidden; border: 1px solid ${SAP}59; border-left: none;">
            <img src="assets/Ivern_0.jpg" alt="Ivern, el Padre Verde" style="width: 100%; height: 100%; object-fit: cover; object-position: center 24%;">
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${SAP};">El Padre Verde</div>
            <div style="margin-top: 4px; font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">platica con el bosque</div>
          </div>
        </div>
      </div>

      ${pasos([
        'Su cuerpo se volvió <strong style="color:' + BONE + ';">corteza y hojas</strong>, y empezó a <strong style="color:' + BONE + ';">oír llorar a la tierra</strong>',
        'Entendió lo que había hecho y <strong style="color:' + BONE + ';">se quedó pidiendo perdón durante eones</strong>',
        'Lo único que le queda de su vida pasada son <strong style="color:' + BONE + ';">los cuernos</strong>, que parecen un casco viejo del Freljord',
      ])}

      ${remate('Quedó a cargo del legado del árbol que él mismo mató: <strong style="color: ' + SAP + ';">ahora su trabajo es cuidar justo lo que fue a destruir</strong>.')}
    </div>
  </section>`);

// ── 6 · El one trick pony ────────────────────────────────────────────────
const rangos = [
  ['S2026', 'Grandmaster', 'grandmaster.png', false],
  ['S2025', 'Grandmaster', 'grandmaster.png', false],
  ['S2024 S3', 'Challenger', 'challenger.png', true],
  ['S2024 S2', 'Grandmaster', 'grandmaster.png', false],
  ['S2024 S1', 'Challenger', 'challenger.png', true],
  ['S2023 S2', 'Challenger', 'challenger.png', true],
];

const panel = (etiqueta, contenido, marca) => `
        <div data-panel="${marca}" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(125,214,107,0.26); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img data-retrato src="assets/icon-Ivern.png" alt="Ivern" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${SAP}; box-shadow: 0 0 46px rgba(125,214,107,0.42);">
                <span data-insignia style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${SAP}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">634</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span data-cuenta="6945273" style="font-family: ${DISPLAY}; font-size: 78px; line-height: 0.9; color: ${SAP}; margin-top: 20px;">6 945 273</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Ivern</span>
              <div data-medalla style="margin-top: 26px; padding: 10px 22px; border-radius: 999px; background: ${GOLD}1F; border: 1px solid ${GOLD};">
                <span style="font-size: 22px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD};">60% de winrate · 556 partidas</span>
              </div>`, 'maestria');

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, top]) => `
                <div data-rango style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${top ? `background: ${GOLD}1F; border: 1px solid ${GOLD}66;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 25px; font-weight: ${top ? '700' : '500'}; color: ${top ? GOLD : BONE};">${nombre}${top ? '  ◄' : ''}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Cinco temporadas <strong style="color: ${SAP};">sin bajar de Grandmaster</strong></span>`, 'rangos');

slides.push(`
  <section data-label="El one trick #1" data-screen-label="06 · El OTP" data-speaker-notes="Es un norteamericano con seis millones novecientos mil puntos, o sea el que menos tiene de todos los que hemos visto. Y este wey es Grandmaster, con pico de Challenger esta temporada, puesto trescientos treinta y tres de Norteamerica, y sesenta por ciento de winrate con Ivern en mas de quinientas partidas." style="${seccion()}">
    ${glow(SAP, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 84px; line-height: 0.95; color: ${BONE};">JAMICAN BANANA</span>
        <span style="font-family: ${DISPLAY}; font-size: 84px; line-height: 0.95; color: ${SAP};">#NA1</span>
      </div>
      <p data-nombre style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Norteamérica · nivel de invocador 1 640 · 81% jungla</p>

      <div style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-cierre style="margin-top: 28px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${GOLD};">#333</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">de Norteamérica</div>
        </div>
        <div style="width: 2px; height: 88px; background: ${GOLD}4D;"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Pico de <strong style="color: ${GOLD};">Challenger</strong> esta temporada. El <strong style="color: ${BONE};">top 0,02%</strong> del servidor.</div>
      </div>
    </div>
  </section>`);

// ── 7 · La gráfica: los puntos no miden nada ─────────────────────────────
// Eje X: millones de puntos (6 → 18,5). Eje Y: escalón del rango (1 = Hierro,
// 10 = Challenger). Janna no juega ranked, así que va aparte y en gris.
const XMIN = 6, XMAX = 18.5;
const px = m => ((m - XMIN) / (XMAX - XMIN) * 100).toFixed(1);
const py = e => ((e - 1) / 9 * 100).toFixed(1);

const otps = [
  ['Ivern', 'icon-Ivern.png', 6.95, 9, 'Grandmaster', true],
  ['Ornn', 'icon-Ornn.png', 7.1, 6, 'Esmeralda', false],
  ['Blitzcrank', 'icon-Blitzcrank.png', 8.4, 7, 'Diamante', false],
  ['Malphite', 'icon-Malphite.png', 11.2, 2, 'Bronce', false],
  ['Talon', 'icon-Talon.png', 12.4, 7, 'Diamante', false],
  ['Urgot', 'icon-Urgot.png', 13.7, 3, 'Plata', false],
  ['Dr. Mundo', 'icon-DrMundo.png', 17.96, 3, 'Plata', false],
];

const escalaY = [[9, 'Challenger'], [7, 'Diamante'], [6, 'Esmeralda'], [3, 'Plata'], [2, 'Bronce']];

slides.push(`
  <section data-label="Los puntos no miden nada" data-screen-label="07 · La gráfica" data-speaker-notes="Y aqui se nos cayo todo lo que llevabamos diciendo en esta serie: el que menos puntos tiene de todos los que hemos visto es el unico Challenger, y el que mas tiene esta en Plata." style="${seccion()}">
    ${glow(GOLD, '50% 42%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Los one tricks de la serie', GOLD)}
      ${titulo('Los puntos de maestría<br><span style="color: ' + GOLD + ';">no miden nada</span>', 84)}

      <div style="margin-top: 44px; position: relative; height: 560px; padding: 0 0 44px 168px; box-sizing: border-box;">
        <!-- ejes -->
        <div data-eje-y style="position: absolute; left: 168px; top: 0; bottom: 44px; width: 2px; background: rgba(255,255,255,0.14);"></div>
        <div data-eje-x style="position: absolute; left: 168px; right: 70px; bottom: 44px; height: 2px; background: rgba(255,255,255,0.14);"></div>

        <!-- escalón de rangos -->
        ${escalaY.map(([e, nombre]) => `
        <div data-guia style="position: absolute; left: 0; right: 0; bottom: calc(44px + ${py(e)}% * 0.92); height: 1px; background: rgba(255,255,255,0.05);">
          <span style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); font-size: 21px; font-weight: 600; letter-spacing: 1px; color: ${MUTED};">${nombre}</span>
        </div>`).join('')}

        <!-- puntos -->
        <div style="position: absolute; left: 168px; right: 70px; top: 0; bottom: 44px;">
          ${otps.map(([nombre, icono, m, e, rango, top]) => `
          <div data-punto style="position: absolute; left: ${px(m)}%; bottom: calc(${py(e)}% * 0.92); transform: translate(-50%, 50%); display: flex; flex-direction: column; align-items: center; gap: 6px; ${top ? 'z-index: 3;' : 'z-index: 2;'}">
            <img src="assets/${icono}" alt="${nombre}" style="width: ${top ? 84 : 60}px; height: ${top ? 84 : 60}px; border-radius: 50%; border: ${top ? `4px solid ${SAP}` : '2px solid rgba(255,255,255,0.18)'}; ${top ? `box-shadow: 0 0 34px ${SAP}80;` : 'filter: grayscale(0.55); opacity: 0.85;'}">
            <span style="font-size: ${top ? 21 : 18}px; font-weight: ${top ? 700 : 500}; color: ${top ? SAP : MUTED}; white-space: nowrap;">${nombre}</span>
          </div>`).join('')}
        </div>

        <!-- etiqueta del eje X -->
        <div style="position: absolute; left: 168px; right: 70px; bottom: 0; display: flex; justify-content: space-between; font-size: 21px; font-weight: 600; letter-spacing: 1px; color: ${MUTED};">
          <span>7 M de puntos</span><span>18 M</span>
        </div>
      </div>

      <div data-nota-janna style="margin-top: 6px; font-size: 23px; font-weight: 500; color: ${MUTED};">La de Janna no aparece: <strong style="color: ${BONE};">no juega ranked</strong>, así que no hay dónde ponerla.</div>

      ${remate('El que <strong style="color: ' + SAP + ';">menos puntos tiene</strong> es el único Challenger. Y el de <strong style="color: ' + GOLD + ';">casi dieciocho millones</strong> está en Plata.', GOLD)}
    </div>
  </section>`);

// ── 8 · El bloque latino ─────────────────────────────────────────────────
const latinos = [
  ['5', 'UnArbolitoAzul #Daisy', 'LAS', '6 050 592', true],
  ['6', 'Prometheus009', 'LAN', '5 670 850', false],
];

slides.push(`
  <section data-label="El bloque latino" data-screen-label="08 · LATAM" data-speaker-notes="Y el dato que nos toca a nosotros, porque dos de los seis mejores Ivern del mundo son latinos, uno del servidor del sur y otro del norte. Y el quinto mejor del planeta se llama Un Arbolito Azul, asi en espanol. Un respeto para ese cabron." style="${seccion()}">
    ${glow(GOLD, '50% 40%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El dato que nos toca', GOLD)}
      ${titulo('Dos de los seis mejores<br><span style="color: ' + GOLD + ';">son latinos</span>', 88)}

      <div style="margin-top: 46px; display: flex; flex-direction: column; gap: 20px;">
        ${latinos.map(([puesto, nombre, region, puntos, top]) => `
        <div data-latino style="display: flex; align-items: center; gap: 20px; padding: 26px 30px; border-radius: 18px; background: ${GOLD}14; border: 1px solid ${GOLD}4D;">
          <span style="flex: none; width: 88px; font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${GOLD};">#${puesto}</span>
          <span style="flex: 1; font-size: ${top ? 32 : 29}px; font-weight: ${top ? 700 : 600}; color: ${BONE}; min-width: 0;">${nombre}</span>
          <span style="flex: none; background: ${GOLD}; color: ${BG}; font-size: 21px; font-weight: 800; border-radius: 8px; padding: 5px 14px; letter-spacing: 1px;">${region}</span>
          <span style="flex: none; width: 190px; text-align: right; font-size: 24px; font-weight: 500; color: ${MUTED};">${puntos}</span>
        </div>`).join('')}
      </div>

      <div data-arbolito style="margin-top: 40px; padding: 34px 38px; border-radius: 20px; background: ${SAP}1A; border: 1px solid ${SAP}73;">
        <div style="font-family: ${DISPLAY}; font-size: 72px; line-height: 1.0; color: ${SAP};">«Un Arbolito Azul»</div>
        <div style="margin-top: 14px; font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">El quinto mejor Ivern del planeta se llama así, <strong style="color: ${BONE};">en español</strong>. Un respeto para ese cabrón.</div>
      </div>
    </div>
  </section>`);

// ── 9 · Las skins ────────────────────────────────────────────────────────
const skins = [
  ['Ivern_1.jpg', 'Rey de las Golosinas', '2016'],
  ['Ivern_2.jpg', 'Rey de las Clavadas', '2019'],
  ['Ivern_11.jpg', 'Dios Antiguo', '2020'],
  ['Ivern_20.jpg', 'AstroIvern', '2023'],
  ['Ivern_31.jpg', 'Pastor de Lluvias', '2026'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="09 · Las skins" data-speaker-notes="Y las skins, donde Riot se lucio de nuevo. En diez anos Ivern tiene seis, y las cinco que puedes comprar valen exactamente lo mismo. Ni una legendaria, ni una definitiva, ni una prestigio. Nada. El mismo pedo que Ornn, que fue el primer video de esta serie. Las cinco te saldrian en unos cincuenta y dos dolares, tres dias de salario minimo." style="${seccion()}">
    ${glow(GOLD, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Diez años de skins', GOLD)}
      ${titulo('Seis skins,<br><span style="color: ' + GOLD + ';">y todas al mismo precio</span>', 84)}

      <div style="margin-top: 32px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
        ${skins.map(([img, nombre, anio]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 7px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 112px; object-fit: cover; object-position: center 24%; border-radius: 10px; border: 1px solid rgba(224,185,74,0.28);">
            <span style="font-size: 17px; font-weight: 600; color: ${BONE}; line-height: 1.15;">${nombre}</span>
            <span data-precio-chip style="font-size: 18px; font-weight: 700; letter-spacing: 1px; color: ${GOLD};">1350 RP</span>
          </div>`).join('')}
      </div>

      <div data-nada style="margin-top: 34px; display: flex; gap: 14px;">
        ${['Cero legendarias', 'Cero definitivas', 'Cero prestigio'].map(t => `
        <div style="flex: 1; padding: 22px 16px; border-radius: 16px; border: 2px dashed rgba(138,154,142,0.4); text-align: center;">
          <span style="font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${MUTED};">${t}</span>
        </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 34px; display: flex; align-items: flex-end; gap: 36px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 116px; line-height: 0.86; color: ${GOLD};">~<span data-cuenta="52">52</span> <span style="font-size: 62px;">USD</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las cinco · 6 750 RP · 3,2 días de salario</div>
        </div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">El mismo pedo que <strong style="color: ${BONE};">Ornn</strong>, que fue el primer video de esta serie.</div>
      </div>
    </div>
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="10 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')} background-image: linear-gradient(180deg, rgba(8,17,13,0.62) 0%, rgba(8,17,13,0.88) 60%, rgba(8,17,13,0.97) 100%), url('assets/Ivern_30.jpg'); background-size: cover; background-position: center 26%;">
    ${glow(SAP, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Diez años del Padre Verde')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 132px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${SAP};">arbolito</span></h2>
      <div data-gigi style="margin-top: 54px; font-family: ${DISPLAY}; font-size: 108px; line-height: 1.0; color: ${GOLD};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
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

  // Portada centrada: el «10» fantasma crece por detrás mientras entra el
  // titular, así el número que da el gancho ya está en pantalla desde el inicio.
  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fantasma]'), { scale: 0.7, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 26, opacity: 0, duration: 0.55 }, 0.1)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.24)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.68);
  });

  // El duelo de números: entran desde lados opuestos y el «CONTRA» aparece en
  // medio cuando ya chocaron.
  animar('Diez contra diez mil', function (tl, s) {
    var d = q(s, '[data-duelo]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(d[0], { x: -60, opacity: 0, duration: 0.65 }, 0.34)
      .from(d[1], { x: 60, opacity: 0, duration: 0.65 }, 0.46)
      .from(s.querySelector('[data-vs]'), { scaleX: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0.72)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.15);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.5, 0.9);
  });

  animar('Ivern el Cruel', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="img"]'), { scale: 1.05, opacity: 0, duration: 0.85 }, 0.15)
      .from(s.querySelector('h2'), { y: 30, opacity: 0, duration: 0.6 }, 0.34)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.5)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2.2)' }, 0.53);
  });

  // El hachazo: el bloque de «lo taló a hachazos» entra de golpe y con rebote
  // corto, y la caída del árbol llega después, más pesada y desde arriba.
  animar('El Sauce Dios', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('p[data-a="up2"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.3)
      .from(s.querySelector('[data-tala]'), { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.9)' }, 0.55)
      .from(s.querySelector('[data-caida]'), { y: -34, opacity: 0, duration: 0.6, ease: 'power3.in' }, 1.0);
  });

  // La transformación: el antes entra desde la izquierda, la flecha marca el
  // paso y el después aterriza al final — el orden ES la historia.
  animar('La transformación', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-mitad="antes"]'), { x: -46, opacity: 0, duration: 0.65 }, 0.14)
      .from(s.querySelector('[data-flecha]'), { scale: 0, opacity: 0, duration: 0.45, ease: 'back.out(2.4)' }, 0.44)
      .from(s.querySelector('[data-mitad="despues"]'), { x: 46, opacity: 0, duration: 0.65 }, 0.58)
      .from(q(s, '[data-paso]'), { x: 24, opacity: 0, duration: 0.42, stagger: 0.1 }, 0.9)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.24);
  });

  animar('El one trick #1', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.08)
      .from(s.querySelector('[data-panel="maestria"]'), { x: -54, opacity: 0, duration: 0.7 }, 0.22)
      .from(s.querySelector('[data-panel="rangos"]'), { x: 54, opacity: 0, duration: 0.7 }, 0.28)
      .from(s.querySelector('[data-retrato]'), { scale: 0.7, duration: 0.6, ease: 'back.out(2)' }, 0.42)
      .from(s.querySelector('[data-insignia]'), { scale: 0, duration: 0.45, ease: 'back.out(2.6)' }, 0.64)
      .from(s.querySelector('[data-medalla]'), { scale: 0.82, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.8)
      .from(q(s, '[data-rango]'), { x: 26, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.5)
      .from(s.querySelector('[data-cierre]'), { y: 24, opacity: 0, duration: 0.6 }, 1.05);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.5, 0.9);
  });

  // La gráfica es la pieza: se dibujan los ejes, entran los siete puntos en
  // orden de puntos de maestría (de menos a más) y el de Ivern es el primero,
  // así queda claro que el que llega primero es el que menos tiene.
  animar('Los puntos no miden nada', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-eje-y]'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.55, ease: 'power2.inOut' }, 0.28)
      .from(s.querySelector('[data-eje-x]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.inOut' }, 0.34)
      .from(q(s, '[data-guia]'), { opacity: 0, duration: 0.4, stagger: 0.05 }, 0.5)
      .from(q(s, '[data-punto]'), { scale: 0, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'back.out(2)' }, 0.62)
      .from(s.querySelector('[data-nota-janna]'), { opacity: 0, duration: 0.45 }, 1.12)
      .from(s.querySelector('[data-remate]'), { y: 26, opacity: 0, duration: 0.6 }, 1.18);
  });

  animar('El bloque latino', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-latino]'), { x: -34, opacity: 0, duration: 0.55, stagger: 0.14 }, 0.3)
      .from(s.querySelector('[data-arbolito]'), { y: 30, opacity: 0, duration: 0.65 }, 0.86);
  });

  // Las skins: la rejilla entra en cascada y los tres «cero» caen después,
  // porque el chiste es la ausencia, no las skins.
  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 28, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.07 }, 0.26)
      .from(q(s, '[data-precio-chip]'), { scale: 0.6, opacity: 0, duration: 0.35, stagger: 0.07, ease: 'back.out(2.2)' }, 0.44)
      .from(q(s, '[data-nada] > div'), { y: 22, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.82)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.6 }, 1.16);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 1.16, 0.6);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.2)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.7);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ivern cumple 10 años</title>
${kit.og({ titulo: "Ivern cumple 10 años", descripcion: "Diez años del Padre Verde y casi diez mil en el lore: el señor de la guerra que taló el Sauce Dios, y el one trick que menos puntos tiene de toda la serie y es el único Challenger. Apoyo visual para TikTok.", carpeta: "ivern" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(125,214,107,0.45); border-radius: 999px;
    background: rgba(8,17,13,0.85); color: ${SAP}; cursor: pointer;
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
