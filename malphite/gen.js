// Generador de index.html — Malphite cumple 17 años (screenshots para TikTok)
// Ejecutar: node malphite/gen.js
//
// Serie «Cumplelolero» #5 (mismo formato que /ornn/, /urgot/, /talon/ y /blitzcrank/):
// 1080×1920 con el contenido en banda central (padding 300/350) para la interfaz de TikTok.
// Es el SEGUNDO bloque del mismo video que /blitzcrank/ — por eso la portada dice
// «segundo cumpleañero» y el cierre anuncia a Dr. Mundo y Janna.
//
// Paleta muestreada del splash original: el cuerpo es terracota de arenisca (hue 0–15)
// y lo único vivo de la lámina es el verde de su mirada — de ahí los dos acentos.
//
// Del guion se respeta todo; de la investigación quedan fuera a propósito los datos
// que el guion no narra: el puente de edades con Blitzcrank, la skin FPX de campeón
// del mundo, la sequía de skins y el «it/its» del lore.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG (y demás helpers de build-time)

// ── Paleta Malphite: arenisca, basalto y el verde de su mirada ───────────
const BG = '#120D12';        // basalto con tinte malva del cielo de Ixtal
const STONE = '#E08A72';     // terracota de arenisca — el acento principal
const MOSS = '#B5CE45';      // el verde que le sale de la cara — lore y remates
const SAND = '#EBC27C';      // arena — dinero
const RUST = '#C4564E';      // óxido — el elo del one trick
const TEXT = '#F4ECE9';      // texto principal
const MUTED = '#A3908D';     // texto secundario
const PANEL = '#1C1419';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${TEXT}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = STONE, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = STONE) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">${txt}</h2>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(224,138,114,0.28); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(18,13,18,0) 40%, rgba(18,13,18,0.85) 100%);"></div>
      </div>`;

const slides = [];

// ── 1 · Portada: 17 años ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada · 17 años" data-screen-label="01 · Portada" data-speaker-notes="Segundo cumpleanero, y es nada mas y nada menos lo que alejo a mi padre de mi. La piedra, que hoy cumple diecisiete anos en el juegito." style="${seccion()} background-image: linear-gradient(180deg, rgba(18,13,18,0.25) 0%, rgba(18,13,18,0.95) 78%), url('assets/Malphite_0.jpg'); background-size: cover; background-position: 60% 50%;">
    ${glow(STONE, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · segundo cumpleañero')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 196px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${TEXT}; text-shadow: 0 0 90px rgba(224,138,114,0.45);">MALPHITE<br><span style="color: ${STONE};">17 AÑOS</span></h1>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${STONE}; line-height: 1.3;">Fragmento del Monolito</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Toplane · Tanque · Ixtal</p>
    </div>
  </section>`);

// ── 2 · La piedra: máquina de memes ──────────────────────────────────────
slides.push(`
  <section data-label="Máquina de memes" data-screen-label="02 · La piedra" data-speaker-notes="Un toplaner que a mi me gusta muchisimo y una maquina de memes cuando va full AP y te explota a los adc de una ulti." style="${seccion()}">
    ${glow(STONE, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('La piedra')}
      ${titulo('Lo que alejó<br><span style="color: ' + STONE + ';">a mi padre de mí</span>', 100)}

      ${arte('Malphite_0.jpg', 'Malphite original', 380, 'center 76%', 'margin-top: 38px;')}

      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 22px;">
        <div style="display: flex; align-items: center; gap: 26px; padding: 28px 32px; border-radius: 18px; background: ${STONE}14; border: 1px solid ${STONE}59;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${STONE};">TOP</span>
          <span style="font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">Un toplaner que <strong style="color: ${TEXT};">me gusta muchísimo</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 26px; padding: 28px 32px; border-radius: 18px; background: ${MOSS}14; border: 1px solid ${MOSS}59;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${MOSS};">AP</span>
          <span style="font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">Máquina de memes en full AP: <strong style="color: ${TEXT};">te explota al ADC de una ulti</strong></span>
        </div>
      </div>
    </div>
  </section>`);

// ── 3 · El one trick pony #1 del mundo ───────────────────────────────────
const rangos = [
  ['S2026', 'Bronce 3', 'bronze.png', false],
  ['S2025', 'Bronce 4', 'bronze.png', false],
  ['S2024 S3', 'Hierro 2', 'iron.png', true],
  ['S2024 S2', 'Bronce 4', 'bronze.png', false],
  ['S2024 S1', 'Hierro 2', 'iron.png', true],
  ['S2023 S2', 'Bronce 2', 'bronze.png', false],
];

const panel = (etiqueta, contenido) => `
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(224,138,114,0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img src="assets/icon-Malphite.png" alt="Malphite" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${STONE}; box-shadow: 0 0 46px rgba(224,138,114,0.45);">
                <span style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${STONE}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">868</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span style="font-family: ${DISPLAY}; font-size: 80px; line-height: 0.9; color: ${STONE}; margin-top: 20px;">11 219 433</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Malphite</span>
              <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 0.9; color: ${TEXT}; margin-top: 20px;">9,2×</span>
              <span style="font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; text-align: center;">más que su 2º campeón<br>(Amumu · 1 225 226)</span>`);

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, malo]) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${malo ? `background: ${RUST}1F; border: 1px solid ${RUST}66;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 26px; font-weight: ${malo ? '700' : '500'}; color: ${malo ? RUST : TEXT};">${nombre}${malo ? '  ◄' : ''}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Cinco temporadas <strong style="color: ${RUST};">sin salir de Hierro y Bronce</strong></span>`);

slides.push(`
  <section data-label="El one trick #1" data-screen-label="03 · El OTP" data-speaker-notes="El one trick con mas puntos es un norteamericano con once millones doscientos mil puntos, nivel de maestria ochocientos sesenta y ocho, pero que es un malo con avaricia. Su pico esta temporada fue Plata tres y actualmente esta en Bronce tres, y en cinco temporadas jamas ha salido de Hierro y Bronce." style="${seccion()}">
    ${glow(RUST, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-a="up2" style="display: flex; align-items: baseline; gap: 22px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${TEXT};">BCBG</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${STONE};">#NA1</span>
      </div>
      <p data-a="up2" style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Norteamérica · nivel de invocador 1 240 · 98% toplane · 96% tanque</p>

      <div data-a="img" style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-a="up3" style="margin-top: 28px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${RUST};">BRONCE 3</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">su pico fue Plata 3</div>
        </div>
        <div style="width: 2px; height: 88px; background: rgba(196,86,78,0.35);"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Puesto <strong style="color: ${TEXT};">1 329 120</strong> del servidor: tiene al <strong style="color: ${TEXT};">90,3% de la gente por encima</strong>.</div>
      </div>

      <div data-a="up3" style="margin-top: 24px; font-size: 25px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Once millones de puntos en un campeón simple. Es <strong style="color: ${RUST};">el one trick de rango más bajo de toda la serie</strong>.</div>
    </div>
  </section>`);

// ── 4 · Las skins y el precio ────────────────────────────────────────────
const skins = [
  ['Malphite_5.jpg', 'Glacial', '1350 RP'],
  ['Malphite_6.jpg', 'Mecha', '1350 RP'],
  ['Malphite_7.jpg', 'Coraza de Hierro', '975 RP'],
  ['Malphite_16.jpg', 'Odisea', '1350 RP'],
  ['Malphite_23.jpg', 'Estrella Oscura', '1350 RP'],
  ['Malphite_27.jpg', 'Dios Antiguo', '1350 RP'],
  ['Malphite_37.jpg', 'Guardián Lunar', '1350 RP'],
  ['Malphite_48.jpg', 'Veraniego', '1350 RP'],
];

slides.push(`
  <section data-label="Las skins y el precio" data-screen-label="04 · Skins y precio" data-speaker-notes="La piedrita tiene catorce skins de las cuales puedes comprar ocho, y solo necesitarias ochenta dolares para pillartelas. En lo personal mi favorita es la de Malphite WhatsApp, una joya, su chroma verde parece cagada de perro." style="${seccion()}">
    ${glow(SAND, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('14 skins, pero solo<br><span style="color: ' + SAND + ';">8 a la venta</span>', 88)}

      <div data-a="img" style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        ${skins.map(([img, nombre, rp]) => `
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 132px; object-fit: cover; object-position: center 26%; border-radius: 10px; border: 1px solid rgba(224,138,114,0.25);">
            <span style="font-size: 20px; font-weight: 600; color: ${TEXT}; line-height: 1.15;">${nombre}</span>
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 1px; color: ${SAND};">${rp}</span>
          </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 36px; display: flex; align-items: flex-end; gap: 40px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 120px; line-height: 0.86; color: ${SAND};">~80 <span style="font-size: 64px;">USD</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las ocho · 10 425 RP · ~1 565 MXN</div>
        </div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Cinco días de salario mínimo. <strong style="color: ${TEXT};">Blitzcrank salió más caro</strong>: 101 dólares.</div>
      </div>

      <div data-a="up3" style="margin-top: 34px; display: flex; align-items: center; gap: 26px; padding: 22px 28px; border-radius: 18px; background: ${MOSS}14; border: 1px solid ${MOSS}59;">
        <img src="assets/Malphite_1.jpg" alt="Malphite Trébol" style="width: 168px; height: 96px; object-fit: cover; object-position: center 30%; border-radius: 12px; flex: none;">
        <div style="min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 1; color: ${MOSS};">Malphite WhatsApp</div>
          <div style="margin-top: 6px; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">En la tienda se llama <strong style="color: ${TEXT};">Malphite Trébol</strong> — y ya está en la bóveda</div>
        </div>
      </div>
    </div>
  </section>`);

// ── 5 · El lore: el arma que falló ───────────────────────────────────────
slides.push(`
  <section data-label="Lore · El Monolito" data-screen-label="05 · El lore" data-speaker-notes="Un mago ixtali llamado Ne'Zuk construyo el Monolito, que no era un edificio sino un ser vivo hecho de piedra y magia, y lo construyo para acabar con el Vacio. Pero el plan fallo, el Vacio pudo con el y el Monolito quedo hecho pedazos. Y Malphite es el unico fragmento que sobrevivio." style="${seccion()}">
    ${glow(MOSS, '50% 32%', '110% 45%')}
    <div style="position: relative;">
      ${eyebrow('El lore', MOSS)}
      ${arte('Malphite_23.jpg', 'Malphite Estrella Oscura', 340, 'center 26%')}
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">El arma que falló<br><span style="color: ${MOSS};">contra el Vacío</span></h2>
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 16px;">
        ${[
          'El mago ixtali <strong style="color:' + TEXT + ';">Ne’Zuk</strong> construyó el Monolito: no un edificio, <strong style="color:' + TEXT + ';">un ser vivo</strong> de piedra y magia',
          'Lo construyó <strong style="color:' + TEXT + ';">para acabar con el Vacío</strong>',
          'El plan falló: el Vacío pudo con él y <strong style="color:' + TEXT + ';">el Monolito quedó hecho pedazos</strong>',
          'Malphite es <strong style="color:' + TEXT + ';">el único fragmento que sobrevivió</strong>',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${MOSS}; width: 44px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; padding: 24px 30px; border-radius: 16px; background: rgba(181,206,69,0.12); border: 1px solid rgba(181,206,69,0.45); font-size: 29px; font-weight: 500; color: ${TEXT}; line-height: 1.35;">
        Estuvo <strong style="color: ${MOSS};">siglos dormido y despedazado</strong>, hasta que sus propios pedazos se reconectaron solos y despertó.
      </div>
    </div>
  </section>`);

// ── 6 · 17 años aquí, tres mil allá ──────────────────────────────────────
slides.push(`
  <section data-label="17 años aquí, 3 000 allá" data-screen-label="06 · La edad" data-speaker-notes="Para que dimensionen: en el juego cumple diecisiete anos, pero en su historia tiene alrededor de tres mil. Es el ultimo de su especie, no hay nadie mas como el, y el lore dice que carga la duda de si todavia se puede hacer algo contra el Vacio o si ya es demasiado tarde." style="${seccion()}">
    ${glow(STONE, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Para que dimensionen')}

      <div data-a="up2" style="margin-top: 12px; display: flex; flex-direction: column; gap: 26px;">
        <div style="padding: 34px 38px; border-radius: 20px; background: ${PANEL}D9; border: 1px solid rgba(224,138,114,0.3);">
          <div style="font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">En el juego</div>
          <div style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 128px; line-height: 0.88; color: ${STONE};">17 AÑOS</div>
        </div>
        <div style="padding: 34px 38px; border-radius: 20px; background: ${MOSS}14; border: 1px solid ${MOSS}59;">
          <div style="font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">En su historia</div>
          <div style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 128px; line-height: 0.88; color: ${MOSS};">~3 000 AÑOS</div>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 40px; font-family: ${DISPLAY}; font-size: 72px; line-height: 1.0; color: ${TEXT};">Es el último de su especie.<br><span style="color: ${STONE};">No hay nadie más como él.</span></div>

      <div data-a="up3" style="margin-top: 30px; padding: 26px 32px; border-radius: 16px; border-left: 5px solid ${MOSS}; background: rgba(255,255,255,0.03); font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">
        Carga la duda de si <strong style="color: ${TEXT};">todavía se puede hacer algo contra el Vacío</strong> o si ya es demasiado tarde.
      </div>
    </div>
  </section>`);

// ── 7 · Piedra, papel o tijera ───────────────────────────────────────────
const jugadas = [
  ['Piedra', true],
  ['Papel', false],
  ['Tijera', false],
];

slides.push(`
  <section data-label="Piedra, papel o tijera" data-screen-label="07 · El remate" data-speaker-notes="Pero para que no se me pongan tristes les dejo el mejor dato que encontre y esta en el lore oficial. Malphite y Taliyah son amigos y juegan piedra papel o tijera. Y Malphite siempre pierde, porque siempre escoge piedra." style="${seccion()}">
    ${glow(MOSS, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El mejor dato, y está en el lore oficial', MOSS)}
      ${titulo('Juega piedra, papel o tijera<br><span style="color: ' + MOSS + ';">con Taliyah</span>', 84)}

      ${arte('Taliyah_0.jpg', 'Taliyah', 340, 'center 22%', 'margin-top: 34px;')}

      <div data-a="up3" style="margin-top: 38px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
        ${jugadas.map(([nombre, siempre]) => `
        <div style="padding: 28px 20px; border-radius: 18px; text-align: center; ${siempre ? `background: ${STONE}1F; border: 2px solid ${STONE};` : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);'}">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${siempre ? STONE : MUTED};">${nombre}</div>
          <div style="margin-top: 8px; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${siempre ? STONE : 'rgba(163,144,141,0.5)'};">${siempre ? 'siempre' : 'nunca'}</div>
        </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 36px; font-family: ${DISPLAY}; font-size: 76px; line-height: 1.0; color: ${TEXT};">Y siempre pierde.<br><span style="color: ${MOSS};">Porque siempre escoge piedra.</span></div>
    </div>
  </section>`);

// ── 8 · Cierre del video ─────────────────────────────────────────────────
const manana = [
  ['Dr. Mundo', 'icon-DrMundo.png'],
  ['Janna', 'icon-Janna.png'],
];

slides.push(`
  <section data-label="Cierre · mañana" data-screen-label="08 · Cierre" data-speaker-notes="Y esos son los cumpleaneros de hoy. Manana les traigo a los otros dos que son el Dr. Mundo y Janna, asi que ahi nos vemos. Gigi easy, tirenme un follow." style="${seccion()}">
    ${glow(STONE, '50% 36%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y esos son los cumpleañeros de hoy')}
      ${titulo('Mañana les traigo<br><span style="color: ' + STONE + ';">a los otros dos</span>', 100)}

      <div data-a="img" style="margin-top: 46px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px;">
        ${manana.map(([nombre, icono]) => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 34px 26px; border-radius: 20px; background: ${PANEL}D9; border: 1px solid rgba(224,138,114,0.3);">
          <img src="assets/${icono}" alt="${nombre}" style="width: 168px; height: 168px; border-radius: 24px; border: 3px solid ${STONE};">
          <div style="font-family: ${DISPLAY}; font-size: 58px; line-height: 0.95; color: ${TEXT}; text-align: center;">${nombre}</div>
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${STONE};">17 años</div>
        </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 46px; font-family: ${DISPLAY}; font-size: 92px; line-height: 1.0; color: ${MOSS};">GIGI EASY</div>
      <div data-a="up3" style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o me va a entrar la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Malphite cumple 17 años</title>
${kit.og({ titulo: "Malphite cumple 17 años", descripcion: "Diecisiete años del Fragmento del Monolito: el one trick de 11 millones de puntos atorado en Bronce, el arma que falló contra el Vacío y la partida de piedra, papel o tijera que siempre pierde. Apoyo visual para TikTok.", carpeta: "malphite" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
  @keyframes dsImg { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: none; } }
  @keyframes dsGhost { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.65s 0.12s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.75s 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="img"] { animation: dsImg 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="ghost"] { animation: dsGhost 1.2s both; }
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(224,138,114,0.45); border-radius: 999px;
    background: rgba(18,13,18,0.85); color: ${STONE}; cursor: pointer;
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
