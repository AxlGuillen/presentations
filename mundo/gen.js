// Generador de index.html — Dr. Mundo cumple 17 años (screenshots para TikTok)
// Ejecutar: node mundo/gen.js
//
// Serie «Cumplelolero» #6. Mismo formato TikTok que el resto (1080×1920, banda
// central 300/350), pero es el PRIMER deck de la serie **animado con GSAP**:
// cada lámina registra su propia coreografía con animar(), igual que semana34.
// Los estados iniciales van siempre con tl.from() — sin JS el deck se ve completo
// y la impresión a PDF no se rompe.
//
// La lámina de la sequía es la pieza de animación del deck: la línea de tiempo se
// dibuja, las once skins entran en cascada, la banda de la sequía crece y encima
// cae la marca del rework de 2021.
//
// Es el primero de los dos videos del 03/09; el otro es Janna, de ahí el cierre.
// Paleta muestreada del splash: piel morada (hue 255–285) y el cian de su lengua
// y los frascos (hue 195).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG y el pegamento de animación

// ── Paleta Dr. Mundo: suero morado, lengua azul y alerta médica ──────────
const BG = '#140A17';        // morado casi negro del laboratorio
const SERUM = '#C455E0';     // el morado magenta de su piel — acento principal
const TONGUE = '#4FC9D8';    // el cian de su lengua y los frascos — cifras y datos
const ALERT = '#E0483F';     // rojo de alerta médica — la sequía y el elo
const BONE = '#F2EAF4';      // texto principal
const MUTED = '#9C8AA3';     // texto secundario
const PANEL = '#1F1424';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = SERUM, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = SERUM) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span data-regla style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(196,85,224,0.28); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,10,23,0) 40%, rgba(20,10,23,0.85) 100%);"></div>
      </div>`;

// Pasos numerados del lore: comparten marcado para que la coreografía los agarre
// con un solo selector ([data-paso]).
const pasos = (lista, color = SERUM) => `
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 18px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span data-paso-num style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${color}; width: 46px;">${i + 1}</span>
          <span style="font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = SERUM) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Ayer les subi a dos cumpleaneros y hoy van los otros dos que faltaban. Empezamos con el Dr. Mundo, que cumple diecisiete anos en el juegito." style="${seccion()} background-image: linear-gradient(180deg, rgba(20,10,23,0.25) 0%, rgba(20,10,23,0.95) 78%), url('assets/DrMundo_0.jpg'); background-size: cover; background-position: center 20%;">
    ${glow(SERUM, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · 2 sep 2009 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 0 90px rgba(196,85,224,0.45);"><span data-linea style="display: block;">DR. MUNDO</span><span data-linea style="display: block; color: ${SERUM};">17 AÑOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${SERUM}; line-height: 1.3;">El Loco de Zaun</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Toplane · Jungla · Tanque</p>
    </div>
  </section>`);

// ── 2 · El one trick pony #1 del mundo ───────────────────────────────────
const rangos = [
  ['S2026', 'Plata 3', 'silver.png', true],
  ['S2025', 'Bronce 3', 'bronze.png', false],
  ['S2024 S3', 'Bronce 4', 'bronze.png', false],
  ['S2024 S2', 'Bronce 4', 'bronze.png', false],
  ['S2024 S1', 'Bronce 4', 'bronze.png', false],
  ['S2023 S2', 'Plata 4', 'silver.png', true],
];

const panel = (etiqueta, contenido, marca) => `
        <div data-panel="${marca}" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(196,85,224,0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img data-retrato src="assets/icon-DrMundo.png" alt="Dr. Mundo" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${SERUM}; box-shadow: 0 0 46px rgba(196,85,224,0.45);">
                <span data-insignia style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${SERUM}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">1504</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span data-cuenta="17962834" style="font-family: ${DISPLAY}; font-size: 76px; line-height: 0.9; color: ${SERUM}; margin-top: 20px;">17 962 834</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Dr. Mundo</span>
              <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 0.9; color: ${BONE}; margin-top: 20px;">30×</span>
              <span style="font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; text-align: center;">más que su 2º campeón<br>(Singed · 596 600)</span>`, 'maestria');

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, plata]) => `
                <div data-rango style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${plata ? `background: ${ALERT}1A; border: 1px solid ${ALERT}59;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 26px; font-weight: ${plata ? '700' : '500'}; color: ${plata ? ALERT : BONE};">${nombre}${plata ? '  ◄' : ''}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Seis temporadas <strong style="color: ${ALERT};">sin pasar de Plata</strong></span>`, 'rangos');

slides.push(`
  <section data-label="El one trick #1" data-screen-label="02 · El OTP" data-speaker-notes="Este wey rompio todos los records de la serie. Un norteamericano con diecisiete millones novecientos mil puntos de maestria y nivel de maestria mil quinientos cuatro. Le saca casi seis millones al segundo mejor Mundo del planeta. Y con todo eso esta en Plata tres." style="${seccion()}">
    ${glow(SERUM, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 22px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${BONE};">EVANPORADA</span>
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${SERUM};">#NA11</span>
      </div>
      <p data-nombre style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Norteamérica · nivel de invocador 1 563 · 70% toplane · 95% tanque</p>

      <div style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-cierre style="margin-top: 28px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${TONGUE};">+6 M</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">sobre el 2º del planeta</div>
        </div>
        <div style="width: 2px; height: 88px; background: rgba(79,201,216,0.3);"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">El segundo mejor Dr. Mundo del mundo tiene <strong style="color: ${BONE};">12,23 millones</strong>. La ventaja más grande de toda la serie.</div>
      </div>
    </div>
  </section>`);

// ── 3 · Rompió todos los récords de la serie ─────────────────────────────
const otps = [
  ['Dr. Mundo', 'EVANPORADA', '17,96', 'Plata 3', 100, true],
  ['Urgot', 'Voja Maher', '13,70', 'Plata 2', 76, false],
  ['Talon', 'Masieh', '12,40', 'Diamante 2', 69, false],
  ['Malphite', 'BCBG', '11,20', 'Bronce 3', 62, false],
  ['Blitzcrank', 'rokinas', '8,40', 'Diamante 4', 47, false],
  ['Ornn', '쾌활한', '7,10', 'Esmeralda 4', 40, false],
];

slides.push(`
  <section data-label="Los récords de la serie" data-screen-label="03 · Los récords" data-speaker-notes="Y no es que se le haya caido la temporada, es que en seis temporadas jamas ha pasado de Plata. O sea que ya tenemos confirmado que masterizar un campeon no te hace bueno, nomas te hace insistente." style="${seccion()}">
    ${glow(TONGUE, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Rompió todos los récords', TONGUE)}
      ${titulo('Nunca habíamos visto<br><span style="color: ' + TONGUE + ';">tantos puntos</span>', 90)}

      <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 14px;">
        ${otps.map(([campeon, otp, millones, rango, pct, top]) => `
        <div data-fila style="display: flex; align-items: center; gap: 18px;">
          <span style="flex: none; width: 216px; font-size: 25px; font-weight: ${top ? '700' : '500'}; color: ${top ? BONE : MUTED}; line-height: 1.15;">${campeon}<br><span style="font-size: 20px; font-weight: 500; color: ${MUTED};">${otp}</span></span>
          <div style="flex: 1; height: 52px; border-radius: 10px; background: rgba(255,255,255,0.06); overflow: hidden;">
            <div data-barra style="width: ${pct}%; height: 100%; background: ${top ? SERUM : 'rgba(255,255,255,0.16)'}; display: flex; align-items: center; justify-content: flex-end; padding-right: 16px; box-sizing: border-box;">
              <span style="font-family: ${DISPLAY}; font-size: 32px; color: ${top ? BG : BONE};">${millones} M</span>
            </div>
          </div>
          <span style="flex: none; width: 168px; text-align: right; font-size: 23px; font-weight: ${top ? '700' : '500'}; color: ${top ? ALERT : MUTED};">${rango}</span>
        </div>`).join('')}
      </div>

      ${remate('Masterizar un campeón <strong style="color: ' + TONGUE + ';">no te hace bueno</strong>. Nomás te hace <strong style="color: ' + TONGUE + ';">insistente</strong>.', TONGUE)}
    </div>
  </section>`);

// ── 4 · Las skins y el precio ────────────────────────────────────────────
const skins = [
  ['DrMundo_3.jpg', 'Ejecutivo', '1820 RP'],
  ['DrMundo_6.jpg', 'Nacido de la Ira', '975 RP'],
  ['DrMundo_8.jpg', 'Veraniego', '975 RP'],
  ['DrMundo_9.jpg', 'El Macho', '1350 RP'],
  ['DrMundo_21.jpg', 'Demonios Callejeros', '1350 RP'],
];

const precios = [
  ['Dr. Mundo', '3,1', 31, true],
  ['Ornn', '3,3', 33, false],
  ['Urgot', '3,5', 35, false],
  ['Talon', '4,9', 49, false],
  ['Malphite', '5,0', 50, false],
  ['Blitzcrank', '6,3', 63, false],
];

slides.push(`
  <section data-label="Las skins y el precio" data-screen-label="04 · Skins y precio" data-speaker-notes="El Dr. Mundo tiene once skins en total pero solo cinco las puedes comprar, y te saldrian en unos cincuenta dolares, que son como tres dias de salario minimo. Es el campeon mas barato de vestir de todos los que llevamos en esta serie, y ayer les dije que Blitzcrank tiene dieciocho." style="${seccion()}">
    ${glow(TONGUE, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('11 skins, pero solo<br><span style="color: ' + TONGUE + ';">5 a la venta</span>', 88)}

      <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
        ${skins.map(([img, nombre, rp]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 6px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 112px; object-fit: cover; object-position: center 24%; border-radius: 10px; border: 1px solid rgba(196,85,224,0.25);">
            <span style="font-size: 18px; font-weight: 600; color: ${BONE}; line-height: 1.15;">${nombre}</span>
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 1px; color: ${TONGUE};">${rp}</span>
          </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 34px; display: flex; align-items: flex-end; gap: 40px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 116px; line-height: 0.86; color: ${TONGUE};">~<span data-cuenta="50">50</span> <span style="font-size: 62px;">USD</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las cinco · 6 470 RP · ~970 MXN</div>
        </div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Ayer <strong style="color: ${BONE};">Blitzcrank tenía 18 skins</strong>. Mundo tiene once.</div>
      </div>

      <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 12px;">
        <span style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Días de salario mínimo (México)</span>
        ${precios.map(([quien, dias, pct, top]) => `
        <div data-precio-fila style="display: flex; align-items: center; gap: 20px;">
          <span style="flex: none; width: 180px; font-size: 25px; font-weight: ${top ? '700' : '500'}; color: ${top ? BONE : MUTED};">${quien}</span>
          <div style="flex: 1; height: 38px; border-radius: 9px; background: rgba(255,255,255,0.06); overflow: hidden;">
            <div data-precio-barra style="width: ${pct * 1.5}%; height: 100%; background: ${top ? TONGUE : 'rgba(255,255,255,0.16)'}; display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; box-sizing: border-box;">
              <span style="font-family: ${DISPLAY}; font-size: 26px; color: ${top ? BG : BONE};">${dias}</span>
            </div>
          </div>
        </div>`).join('')}
        <span style="margin-top: 2px; font-size: 25px; font-weight: 500; color: ${BONE};">El <strong style="color: ${TONGUE};">más barato de vestir</strong> de toda la serie.</span>
      </div>
    </div>
  </section>`);

// ── 5 · La sequía: siete años y tres meses ───────────────────────────────
// La línea va de 2009 a 2026 (17 años). x% = (año − 2009) / 17.
const INI = 2009, TRAMO = 17;
const pos = a => ((a - INI) / TRAMO * 100).toFixed(2);

const historial = [
  [2009.67, 'Tóxico', false],
  [2010.55, 'Sr. Mundoverso', false],
  [2010.70, 'Ejecutivo', true],
  [2010.95, 'Mundo Mundo', false],
  [2011.50, 'Verdugo', false],
  [2012.57, 'Nacido de la Ira', true],
  [2013.50, 'TPA', false],
  [2015.48, 'Veraniego', true],
  [2016.42, 'El Macho', true],
  [2018.50, 'Príncipe del Hielo', false],
  [2023.70, 'Demonios Callejeros', true],
];

const SEQ_INI = 2016.42, SEQ_FIN = 2023.70, REWORK = 2021.44;

slides.push(`
  <section data-label="La sequía" data-screen-label="05 · La sequía" data-speaker-notes="Entre El Macho Mundo, que salio en junio de dos mil dieciseis, y la siguiente que puedes comprar, pasaron siete anos y tres meses sin una sola skin. Y lo mas ojete es que a este cabron si lo reworkearon en junio de dos mil veintiuno, kit, visuales y todo. Y aun asi tardaron dos anos y tres meses mas en sacarle una skin nueva." style="${seccion()}">
    ${glow(ALERT, '50% 42%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Riot lo tenía olvidado', ALERT)}
      ${titulo('Siete años y tres meses<br><span style="color: ' + ALERT + ';">sin una skin comprable</span>', 82)}

      <div style="margin-top: 46px; position: relative; height: 250px;">

        <!-- marca del rework, encima de la banda -->
        <div data-rework style="position: absolute; left: ${pos(REWORK)}%; top: 0; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 3;">
          <span style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${SERUM}; white-space: nowrap;">Rework 2021</span>
          <span style="width: 2px; height: 44px; background: ${SERUM};"></span>
        </div>

        <!-- carril -->
        <div style="position: absolute; left: 0; right: 0; top: 108px; height: 10px;">
          <div data-carril style="position: absolute; inset: 0; border-radius: 999px; background: rgba(255,255,255,0.10);"></div>
          <div data-banda style="position: absolute; left: ${pos(SEQ_INI)}%; width: ${(pos(SEQ_FIN) - pos(SEQ_INI)).toFixed(2)}%; top: 0; bottom: 0; border-radius: 999px; background: ${ALERT};"></div>
        </div>

        <!-- skins -->
        ${historial.map(([a, nombre, comprable]) => `
        <div data-punto style="position: absolute; left: ${pos(a)}%; top: 96px; transform: translateX(-50%); z-index: 2;">
          <span style="display: block; width: 34px; height: 34px; border-radius: 50%; box-sizing: border-box; ${comprable
            ? `background: ${TONGUE}; border: 4px solid ${BG}; box-shadow: 0 0 18px rgba(79,201,216,0.6);`
            : `background: ${BG}; border: 4px solid rgba(255,255,255,0.28);`}" title="${nombre}"></span>
        </div>`).join('')}

        <!-- extremos de la sequía -->
        <div data-extremo style="position: absolute; left: ${pos(SEQ_INI)}%; top: 150px; transform: translateX(-50%); text-align: center; width: 220px;">
          <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${BONE};">jun 2016</div>
          <div style="font-size: 20px; font-weight: 600; color: ${MUTED};">El Macho</div>
        </div>
        <div data-extremo style="position: absolute; left: ${pos(SEQ_FIN)}%; top: 150px; transform: translateX(-50%); text-align: center; width: 220px;">
          <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${BONE};">sep 2023</div>
          <div style="font-size: 20px; font-weight: 600; color: ${MUTED};">Demonios Callejeros</div>
        </div>

        <!-- años -->
        <div style="position: absolute; left: 0; right: 0; top: 218px; display: flex; justify-content: space-between; font-size: 20px; font-weight: 600; letter-spacing: 1px; color: rgba(156,138,163,0.6);">
          <span>2009</span><span>2026</span>
        </div>
      </div>

      <div data-cifra style="margin-top: 30px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 124px; line-height: 0.86; color: ${ALERT};"><span data-cuenta="7">7</span> AÑOS</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">y tres meses de nada</div>
        </div>
        <div style="width: 2px; height: 96px; background: rgba(224,72,63,0.35);"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Los <span style="color: ${TONGUE};">●</span> son las comprables; los <span style="color: rgba(255,255,255,0.45);">○</span>, las que ya están en bóveda.</div>
      </div>

      ${remate('Y sí lo reworkearon — kit, visuales y todo. <strong style="color: ' + ALERT + ';">Aun así tardaron dos años y tres meses más</strong> en sacarle una skin. Ni arreglándolo se acordaron de él.', ALERT)}
    </div>
  </section>`);

// ── 6 · El lore: el matón y el manicomio ─────────────────────────────────
slides.push(`
  <section data-label="Lore · El manicomio" data-screen-label="06 · El lore" data-speaker-notes="El Dr. Mundo no es doctor, y ni siquiera se llama Mundo. Era un maton, guardaespaldas de un chem-baron de Zaun. Cometio un error que enfurecio a su jefe, y el jefe decidio hacer un ejemplo de el y lo mando internar al manicomio de Osweld. Ahi lo usaron para experimentar." style="${seccion()}">
    ${glow(SERUM, '50% 30%', '110% 45%')}
    <div style="position: relative;">
      ${eyebrow('El lore')}
      ${arte('DrMundo_0.jpg', 'Dr. Mundo con la camisa de fuerza', 330, 'center 22%')}
      <h2 data-a="up2" style="margin: 32px 0 0; font-family: ${DISPLAY}; font-size: 88px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">No es doctor.<br><span style="color: ${SERUM};">Ni se llama Mundo.</span></h2>
      ${pasos([
        'Era un <strong style="color:' + BONE + ';">matón</strong>, guardaespaldas de un chem-barón de Zaun',
        'Cometió un error y el jefe decidió <strong style="color:' + BONE + ';">hacer un ejemplo de él</strong>',
        'Lo internaron en el <strong style="color:' + BONE + ';">manicomio de Osweld</strong>, y ahí lo usaron para experimentar',
        'Le inyectaron <strong style="color:' + BONE + ';">cantidades enormes de químicos</strong>',
      ])}
      ${remate('Le hicieron <strong style="color: ' + SERUM + ';">crecer los músculos</strong> pero <strong style="color: ' + SERUM + ';">le destruyeron el cerebro</strong>: perdió su nombre, su historia y hasta el nombre del cabrón que lo mandó ahí.')}
    </div>
  </section>`);

// ── 7 · La camisa de fuerza ──────────────────────────────────────────────
slides.push(`
  <section data-label="La camisa de fuerza" data-screen-label="07 · La bata" data-speaker-notes="Y como ya no tenia nada, se armo una realidad nueva con lo que tenia enfrente. Confundio su camisa de fuerza con la bata de un doctor, y a partir de eso decidio que era medico y se puso Dr. Mundo." style="${seccion()}">
    ${glow(SERUM, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Y aquí está lo mejor')}
      ${titulo('Confundió la camisa de fuerza<br><span style="color: ' + SERUM + ';">con una bata de doctor</span>', 76)}

      <p data-a="up2" style="margin: 34px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Como ya no le quedaba nada, <strong style="color: ${BONE};">se armó una realidad nueva</strong> con lo que tenía enfrente:</p>

      <div style="margin-top: 40px; display: flex; align-items: stretch; gap: 20px;">
        <div data-tarjeta style="flex: 1; padding: 34px 30px; border-radius: 20px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.09); text-align: center;">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${MUTED};">Lo que traía puesto</div>
          <div style="margin-top: 14px; font-family: ${DISPLAY}; font-size: 66px; line-height: 1; color: ${MUTED};">Camisa<br>de fuerza</div>
        </div>
        <div data-flecha style="flex: none; display: flex; align-items: center; font-family: ${DISPLAY}; font-size: 76px; color: ${SERUM};">→</div>
        <div data-tarjeta style="flex: 1; padding: 34px 30px; border-radius: 20px; background: ${SERUM}1F; border: 2px solid ${SERUM}; text-align: center;">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${SERUM};">Lo que él entendió</div>
          <div style="margin-top: 14px; font-family: ${DISPLAY}; font-size: 66px; line-height: 1; color: ${BONE};">Bata<br>de doctor</div>
        </div>
      </div>

      ${remate('Y a partir de ahí decidió que era médico. <strong style="color: ' + SERUM + ';">Se puso Dr. Mundo él solo.</strong>')}
    </div>
  </section>`);

// ── 8 · Los atendió a todos ──────────────────────────────────────────────
slides.push(`
  <section data-label="Los atendió a todos" data-screen-label="08 · Los pacientes" data-speaker-notes="Con el tiempo fue tratando a todos los del manicomio, o sea matandolos y desmembrandolos. Y cuando el chem-baron regreso por su maton, Mundo tambien lo atendio y lo mato en la mesa de operaciones. Despues de eso salio a la calle por primera vez y vio que afuera habia muchisimos pacientes que necesitaban ser curados." style="${seccion()}">
    ${glow(ALERT, '50% 38%', '112% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y se puso a ejercer', ALERT)}
      ${titulo('Los atendió<br><span style="color: ' + ALERT + ';">a todos</span>', 104)}
      ${pasos([
        'Fue <strong style="color:' + BONE + ';">«tratando»</strong> a todos los del manicomio: matándolos y desmembrándolos',
        'El chem-barón volvió por su matón y <strong style="color:' + BONE + ';">Mundo también lo atendió</strong>: lo mató en la mesa de operaciones',
        'Salió a la calle por primera vez y vio <strong style="color:' + BONE + ';">un montón de pacientes</strong> que necesitaban ser curados',
      ], ALERT)}
      ${arte('DrMundo_21.jpg', 'Dr. Mundo Demonios Callejeros', 330, 'center 26%', 'margin-top: 38px;')}
    </div>
  </section>`);

// ── 9 · El remate: de verdad cree que ayuda ──────────────────────────────
slides.push(`
  <section data-label="Cree que ayuda" data-screen-label="09 · El remate" data-speaker-notes="Y Mundo de verdad cree que es doctor y que esta ayudando. El lore dice que se pone triste cuando sus curas no funcionan. Por eso su frase es que debe ser buen doctor porque los pacientes nunca regresan." style="${seccion()}">
    ${glow(TONGUE, '50% 36%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Lo que lo vuelve trágico', TONGUE)}
      ${titulo('De verdad cree<br><span style="color: ' + TONGUE + ';">que está ayudando</span>', 96)}

      <p data-a="up2" style="margin: 36px 0 0; font-size: 32px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">No es maldad, es un delirio completo. Y el lore es explícito: <strong style="color: ${BONE};">se pone triste cuando sus curas no funcionan</strong>.</p>

      <div data-cita style="margin-top: 46px; padding: 44px 46px; border-radius: 22px; background: ${PANEL}D9; border-left: 6px solid ${TONGUE};">
        <div style="font-family: ${DISPLAY}; font-size: 82px; line-height: 1.0; color: ${BONE};">«Debo ser buen doctor.<br><span style="color: ${TONGUE};">Los pacientes nunca regresan.»</span></div>
        <div style="margin-top: 20px; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Frase oficial del personaje</div>
      </div>
    </div>
  </section>`);

// ── 10 · Cierre: pase a Janna ────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre · Janna" data-screen-label="10 · Cierre" data-speaker-notes="Y al rato nos wachamos con la otra cumpleanera del dia. Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${glow(SERUM, '50% 34%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Al rato nos wachamos con')}
      ${titulo('La otra<br><span style="color: ' + SERUM + ';">cumpleañera</span>', 116)}

      <div data-janna style="margin-top: 48px; display: flex; align-items: center; gap: 32px; padding: 36px 40px; border-radius: 22px; background: ${PANEL}D9; border: 1px solid rgba(196,85,224,0.3);">
        <img src="assets/icon-Janna.png" alt="Janna" style="width: 176px; height: 176px; border-radius: 26px; flex: none; border: 3px solid ${SERUM};">
        <div style="min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${BONE};">JANNA</div>
          <div style="margin-top: 8px; font-size: 26px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${SERUM};">También 17 años</div>
        </div>
      </div>

      <div data-gigi style="margin-top: 52px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${TONGUE};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Todo con tl.from(): sin JS el deck se ve completo. Ninguna timeline pasa de
// ~1,7 s, que es lo que espera tools/capturar.mjs antes de disparar el PNG.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  // Contador con separador de miles, para que 17 962 834 no se lea como un
  // amasijo de dígitos mientras corre. El de kit.cjs no agrupa.
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

  // El OTP: los dos paneles entran desde fuera y se cruzan; el retrato late una
  // vez al aterrizar y las temporadas caen en cascada.
  animar('El one trick #1', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.08)
      .from(s.querySelector('[data-panel="maestria"]'), { x: -54, opacity: 0, duration: 0.7 }, 0.22)
      .from(s.querySelector('[data-panel="rangos"]'), { x: 54, opacity: 0, duration: 0.7 }, 0.28)
      .from(s.querySelector('[data-retrato]'), { scale: 0.7, duration: 0.6, ease: 'back.out(2)' }, 0.42)
      .from(s.querySelector('[data-insignia]'), { scale: 0, duration: 0.45, ease: 'back.out(2.6)' }, 0.66)
      .from(q(s, '[data-rango]'), { x: 26, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.5)
      .from(s.querySelector('[data-cierre]'), { y: 24, opacity: 0, duration: 0.6 }, 1.0);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.5);
  });

  // Los récords: las barras crecen de izquierda a derecha, la de Mundo primero
  // para que se lea como el récord y no como una fila más.
  animar('Los récords de la serie', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-fila]'), { x: -28, opacity: 0, duration: 0.45, stagger: 0.08 }, 0.22)
      .from(q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.85, ease: 'power2.inOut', stagger: 0.08 }, 0.34)
      .from(s.querySelector('[data-remate]'), { y: 26, opacity: 0, duration: 0.6 }, 1.05);
  });

  animar('Las skins y el precio', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 30, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.07 }, 0.22)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.6 }, 0.62)
      .from(q(s, '[data-precio-fila]'), { x: -22, opacity: 0, duration: 0.4, stagger: 0.06 }, 0.78)
      .from(q(s, '[data-precio-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.62, ease: 'power2.inOut', stagger: 0.06 }, 0.86);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.62);
  });

  // La sequía es la pieza del deck: se dibuja el carril, caen las once skins,
  // crece la banda roja del hueco y hasta el final baja la marca del rework —
  // el orden importa, porque el chiste es que el rework cae DENTRO del hueco.
  animar('La sequía', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-carril]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power2.inOut' }, 0.28)
      .from(q(s, '[data-punto]'), { scale: 0, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'back.out(2.4)' }, 0.5)
      .from(s.querySelector('[data-banda]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.65, ease: 'power2.inOut' }, 0.95)
      .from(q(s, '[data-extremo]'), { y: 16, opacity: 0, duration: 0.45, stagger: 0.1 }, 1.05)
      .from(s.querySelector('[data-rework]'), { y: -34, opacity: 0, duration: 0.5, ease: 'back.out(1.9)' }, 1.15)
      .from(s.querySelector('[data-cifra]'), { y: 24, opacity: 0, duration: 0.55 }, 1.05)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.25);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 1.0, 0.8);
  });

  ['Lore · El manicomio', 'Los atendió a todos'].forEach(function (etiqueta) {
    animar(etiqueta, function (tl, s) {
      tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
        .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
        .from(s.querySelector('[data-a="img"]'), { scale: 1.05, opacity: 0, duration: 0.8 }, 0.15)
        .from(s.querySelector('h2'), { y: 30, opacity: 0, duration: 0.6 }, 0.3)
        .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.45)
        .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2.2)' }, 0.48)
        .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.05);
    });
  });

  // La bata: la tarjeta de la izquierda es lo que traía puesto y la de la
  // derecha lo que él entendió, así que la flecha entra en medio de las dos.
  animar('La camisa de fuerza', function (tl, s) {
    var tarjetas = q(s, '[data-tarjeta]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('p[data-a="up2"]'), { y: 22, opacity: 0, duration: 0.5 }, 0.3)
      .from(tarjetas[0], { x: -44, opacity: 0, duration: 0.6 }, 0.45)
      .from(s.querySelector('[data-flecha]'), { scale: 0, opacity: 0, duration: 0.45, ease: 'back.out(2.6)' }, 0.72)
      .from(tarjetas[1], { x: 44, opacity: 0, duration: 0.6 }, 0.85)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.15);
  });

  animar('Cree que ayuda', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.15)
      .from(s.querySelector('p[data-a="up2"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.35)
      .from(s.querySelector('[data-cita]'), { y: 40, opacity: 0, duration: 0.75 }, 0.55);
  });

  animar('Cierre · Janna', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="up2"]'), { y: 40, opacity: 0, duration: 0.7 }, 0.18)
      .from(s.querySelector('[data-janna]'), { y: 34, opacity: 0, scale: 0.96, duration: 0.65 }, 0.5)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.85);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dr. Mundo cumple 17 años</title>
${kit.og({ titulo: "Dr. Mundo cumple 17 años", descripcion: "Diecisiete años del Loco de Zaun: el one trick que rompió todos los récords de la serie y sigue en Plata, siete años sin skin comprable, y el matón que confundió su camisa de fuerza con una bata. Apoyo visual para TikTok.", carpeta: "mundo" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(196,85,224,0.45); border-radius: 999px;
    background: rgba(20,10,23,0.85); color: ${SERUM}; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
