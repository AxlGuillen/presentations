// Generador de index.html — Talon cumple 15 años (screenshots para TikTok)
// Ejecutar: node talon/gen.js
//
// Serie «Cumplelolero» #3 (mismo formato que /ornn/ y /urgot/): 1080×1920 con
// el contenido en banda central (padding 300/350) para la interfaz de TikTok.
// Paleta muestreada del splash original: noche azul acero + filo cian,
// carmesí de Noxus para peligro/sequía y dorado para los logros.
const fs = require('fs');

// ── Paleta Talon: noche, acero y filo ────────────────────────────────────
const BG = '#07080F';
const BLADE = '#6FC7F0';     // cian del filo — el protagonista
const DEEP = '#2E5F94';      // azul profundo del splash
const STEEL = '#E9EEF5';     // texto principal
const MUTED = '#8A93A8';     // texto secundario
const CRIMSON = '#C43048';   // rojo Noxus — sequía, peligro
const GOLD = '#E8B84B';      // logros: top 2,62%, los latinos
const NIGHT = '#10131F';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${STEEL}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = BLADE, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = BLADE) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">${txt}</h2>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(111,199,240,0.28); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,8,15,0) 40%, rgba(7,8,15,0.85) 100%);"></div>
      </div>`;

const slides = [];

// ── 1 · Portada: 15 años ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada · 15 años" data-screen-label="01 · Portada" data-speaker-notes="Cumpleanos doble: hoy tambien es cumpleanos de Talon, quince anos en el juegito. Serie Cumplelolero." style="${seccion()} background-image: linear-gradient(180deg, rgba(7,8,15,0.25) 0%, rgba(7,8,15,0.95) 78%), url('assets/Talon_0.jpg'); background-size: cover; background-position: center 18%;">
    ${glow(DEEP, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · 24 ago 2011 — 2026')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 210px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${STEEL}; text-shadow: 0 0 90px rgba(111,199,240,0.4);">TALON<br><span style="color: ${BLADE};">15 AÑOS</span></h1>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${BLADE}; line-height: 1.3;">La Sombra de la Navaja</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Mid / Jungla · Asesino · Noxus</p>
    </div>
  </section>`);

// ── 2 · El one trick #1 (el primero que sí es bueno) ─────────────────────
const rangos = [
  ['S2026', 'Diamante 2', 'diamond.png', true],
  ['S2025', 'Esmeralda 1', 'emerald.png', false],
  ['S2024 S3', 'Esmeralda 2', 'emerald.png', false],
  ['S2024 S2', 'Esmeralda 1', 'emerald.png', false],
  ['S2024 S1', 'Diamante 4', 'diamond.png', false],
  ['S2023 S2', 'Diamante 1', 'diamond.png', false],
];

const panel = (etiqueta, contenido) => `
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${NIGHT}D9; border: 1px solid rgba(111,199,240,0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img src="assets/talon-icon.png" alt="Talon" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${BLADE}; box-shadow: 0 0 46px rgba(111,199,240,0.4);">
                <span style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${BLADE}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">1039</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span style="font-family: ${DISPLAY}; font-size: 80px; line-height: 0.9; color: ${BLADE}; margin-top: 20px;">12 408 195</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Talon</span>
              <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 0.9; color: ${STEEL}; margin-top: 20px;">311×</span>
              <span style="font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; text-align: center;">más que su 2º campeón<br>(Darius · 39 888)</span>`);

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, top]) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${top ? `background: ${GOLD}1F; border: 1px solid ${GOLD}66;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 26px; font-weight: ${top ? '700' : '500'}; color: ${top ? GOLD : STEEL};">${nombre}${top ? '  ◄' : ''}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Pico esta temporada: <strong style="color: ${GOLD};">Diamante 1</strong></span>`);

slides.push(`
  <section data-label="El one trick #1" data-screen-label="02 · El OTP" data-speaker-notes="Masieh: maestria 1039, 12.4 millones de puntos, 311 veces mas que su segundo campeon. Y aqui si hay que darselo: Diamante 2, top 2 por ciento de su servidor. El primero de la serie que si es bueno." style="${seccion()}">
    ${glow(BLADE, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-a="up2" style="display: flex; align-items: baseline; gap: 22px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${STEEL};">MASIEH</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${BLADE};">#EUNE</span>
      </div>
      <p data-a="up2" style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Europa · nivel de invocador 1 281 · también europeo, como el de Urgot</p>

      <div data-a="img" style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-a="up3" style="margin-top: 28px; display: flex; align-items: center; gap: 36px;">
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${GOLD};">TOP 2,62 <span style="font-size: 58px;">%</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">de EUNE · puesto 36 869</div>
        </div>
        <div style="width: 2px; height: 88px; background: rgba(111,199,240,0.3);"></div>
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${STEEL};">51 <span style="font-size: 58px;">%</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">winrate · 279V – 273D</div>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 22px; font-size: 27px; font-weight: 500; color: ${STEEL}; line-height: 1.4;">
        El primero de la serie que <strong style="color: ${GOLD};">sí es bueno</strong>: Diamante 2 y la obsesión más alta de las tres — 311× su segundo campeón.
      </div>
    </div>
  </section>`);

// ── 3 · ⭐ El campeón de los latinos ──────────────────────────────────────
const latinos = [
  ['4', 'TTV SLASH2290', 'LAS', '8 497 385'],
  ['6', 'Whitning', 'LAN', '7 689 267'],
  ['8', 'Axems', 'LAS', '7 451 627'],
  ['10', 'cubil', 'LAS', '7 355 500'],
  ['12', 'qiqe', 'LAS', '6 540 520'],
  ['15', 'Grim', 'LAN', '5 905 879'],
];
slides.push(`
  <section data-label="El campeón de los latinos" data-screen-label="03 · Latinos" data-speaker-notes="El dato que nos toca: de los 15 mejores Talon del mundo, 6 son de Latinoamerica (4 de LAS, 2 de LAN). Con los 2 brasilenos son 8 de 15. Como buenos migrantes, nos la pasamos saltando muros." style="${seccion()}">
    ${glow(GOLD, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('El dato que nos toca', GOLD)}
      ${titulo('Talon es el campeón<br><span style="color: ' + GOLD + ';">de los latinos</span>', 92)}

      <div data-a="up3" style="margin-top: 30px; font-size: 29px; font-weight: 500; color: ${STEEL}; line-height: 1.4;">Del <strong style="color: ${GOLD};">top 15 mundial</strong> por puntos de maestría…</div>

      <div data-a="img" style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
        ${latinos.map(([puesto, nombre, region, pts]) => `
        <div style="display: flex; align-items: center; gap: 16px; padding: 14px 22px; border-radius: 14px; background: ${GOLD}14; border: 1px solid ${GOLD}4D;">
          <span style="flex: none; width: 76px; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${GOLD};">#${puesto}</span>
          <span style="flex: 1; font-size: 29px; font-weight: 600; color: ${STEEL};">${nombre}</span>
          <span style="flex: none; background: ${GOLD}; color: ${BG}; font-size: 21px; font-weight: 800; border-radius: 8px; padding: 5px 14px; letter-spacing: 1px;">${region}</span>
          <span style="flex: none; width: 190px; text-align: right; font-size: 25px; font-weight: 500; color: ${MUTED};">${pts}</span>
        </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 30px; display: flex; align-items: center; gap: 36px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.86; color: ${GOLD}; text-shadow: 0 0 60px ${GOLD}59;">6 / 15</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">son de LAS o LAN</div>
        </div>
        <div style="flex: 1; font-size: 27px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">…y con los dos brasileños (Toih #3 y Zaczao #7) son <strong style="color: ${STEEL};">8 de 15</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 4 · El rework: saltar paredes ────────────────────────────────────────
slides.push(`
  <section data-label="El rework" data-screen-label="04 · El rework" data-speaker-notes="Assassin Update, pretemporada 2017. Le dieron lo que hoy lo define: saltar paredes. Y la pasiva de sangrado al tercer golpe." style="${seccion()}">
    ${glow(DEEP, '50% 35%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El rework')}
      ${titulo('2017: le dieron<br>lo que hoy <span style="color: ' + BLADE + ';">lo define</span>', 96)}
      ${arte('Talon_5.jpg', 'Talon Luna de Sangre', 420, 'center 22%', 'margin-top: 36px;')}
      <div data-a="up3" style="margin-top: 36px; display: flex; flex-direction: column; gap: 18px;">
        ${[
          ['E', '<strong style="color:' + STEEL + ';">Salta paredes.</strong> La habilidad que lo volvió el rey del roam'],
          ['Pasiva', 'Sus habilidades hieren; al tercer golpe, <strong style="color:' + STEEL + ';">te desangras</strong>'],
          ['R', 'Anillo de cuchillas + <strong style="color:' + STEEL + ';">invisibilidad</strong>'],
        ].map(([a, t]) => `
        <div style="display: flex; align-items: center; gap: 24px;">
          <span style="flex: none; width: 140px; font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${BLADE};">${a}</span>
          <span style="font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; font-size: 27px; font-weight: 500; color: ${STEEL}; line-height: 1.4;">Assassin Update · pretemporada 2017. Antes era un asesino más; después, <strong style="color: ${BLADE};">el que salta muros</strong>.</div>
    </div>
  </section>`);

// ── 5 · Las skins y la sequía ────────────────────────────────────────────
const skins = [
  ['Talon_1.jpg', 'Renegado', 'ago 2011'],
  ['Talon_2.jpg', 'Élite Carmesí', 'ago 2011'],
  ['Talon_3.jpg', 'Espadragón', 'ene 2012'],
  ['Talon_5.jpg', 'Luna de Sangre', 'feb 2017'],
  ['Talon_12.jpg', 'Filo Perpetuo', 'sep 2018'],
  ['Talon_20.jpg', 'Bosque Negro', 'mar 2020'],
  ['Talon_29.jpg', 'Rosa Marchita', 'feb 2021'],
  ['Talon_38.jpg', 'El Forajido', 'may 2022'],
  ['Talon_49.jpg', 'Emboscada Primigenia', 'ene 2024'],
];
const celdaSkin = ([img, nombre, fecha]) => `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 158px; object-fit: cover; object-position: center 20%; border-radius: 12px; border: 1px solid rgba(111,199,240,0.25);">
            <div style="display: flex; flex-direction: column; gap: 1px;">
              <span style="font-size: 22px; font-weight: 600; color: ${STEEL}; line-height: 1.15;">${nombre}</span>
              <span style="font-size: 20px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${BLADE};">${fecha}</span>
            </div>
          </div>`;

slides.push(`
  <section data-label="Las skins" data-screen-label="05 · Las skins" data-speaker-notes="Nueve skins, pero entre 2012 y 2017 pasaron cinco anos sin nada. Y la sequia acabo justo con el rework. Igual que Urgot: Riot reworkea y aprovecha para sacar skins." style="${seccion()}">
    ${glow(CRIMSON, '50% 42%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('9 skins en 15 años', 84)}

      <div data-a="img" style="margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        ${skins.map(celdaSkin).join('')}
      </div>

      <div data-a="up3" style="margin-top: 28px; padding: 22px 28px; border-radius: 16px; background: rgba(196,48,72,0.13); border: 1px solid rgba(196,48,72,0.45); display: flex; align-items: center; gap: 24px;">
        <span style="font-family: ${DISPLAY}; font-size: 76px; line-height: 0.85; color: ${CRIMSON}; white-space: nowrap;">5 AÑOS</span>
        <span style="font-size: 24px; font-weight: 500; color: ${STEEL}; line-height: 1.35;">sin una sola skin (2012 → 2017)…<br>y la sequía terminó <strong style="color: ${BLADE};">justo con el rework</strong></span>
      </div>

      <div data-a="up3" style="margin-top: 22px; font-size: 26px; font-weight: 500; color: ${STEEL}; line-height: 1.45;">
        Igual que Urgot. <strong style="color: ${CRIMSON};">Riot deja de sacarle skins a un campeón cuando deja de creer en él</strong> — y vuelve cuando lo arregla.
      </div>
    </div>
  </section>`);

// ── 6 · El precio ────────────────────────────────────────────────────────
const serie = [
  ['Ornn', '3,3', 32],
  ['Urgot', '3,5', 35],
  ['Talon', '4,9', 49],
];
slides.push(`
  <section data-label="El precio" data-screen-label="06 · El precio" data-speaker-notes="Las nueve: 80 dolares, unos 1550 pesos, casi una semana de salario minimo. El mas caro de la serie. Y hay tres mas que ya no se pueden comprar, una es la de campeon del mundo de Samsung White." style="${seccion()}">
    ${glow(BLADE, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Comprarlas todas')}
      ${titulo('El más caro<br>de la serie', 96)}

      <div data-a="up3" style="margin-top: 40px; display: flex; align-items: flex-end; gap: 36px;">
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 120px; line-height: 0.86; color: ${BLADE};">~80 <span style="font-size: 64px;">USD</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las nueve · 10 345 RP · ~1 550 MXN</div>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 16px;">
        <span style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Días de salario mínimo (México)</span>
        ${serie.map(([quien, dias, pct]) => `
        <div style="display: flex; align-items: center; gap: 20px;">
          <span style="flex: none; width: 130px; font-size: 27px; font-weight: 600; color: ${quien === 'Talon' ? STEEL : MUTED};">${quien}</span>
          <div style="flex: 1; height: 46px; border-radius: 10px; background: rgba(255,255,255,0.06); overflow: hidden;">
            <div style="width: ${pct * 2}%; height: 100%; background: ${quien === 'Talon' ? BLADE : 'rgba(255,255,255,0.18)'}; display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; box-sizing: border-box;">
              <span style="font-family: ${DISPLAY}; font-size: 30px; color: ${quien === 'Talon' ? BG : STEEL};">${dias}</span>
            </div>
          </div>
        </div>`).join('')}
        <span style="font-size: 25px; font-weight: 500; color: ${STEEL};">4,9 días — <strong style="color: ${BLADE};">casi una semana</strong> de trabajo</span>
      </div>

      <div data-a="up3" style="margin-top: 34px; display: flex; align-items: center; gap: 18px; padding: 16px 22px; border-radius: 14px; border: 2px dashed rgba(138,147,168,0.4);">
        <img src="assets/Talon_4.jpg" alt="Talon SSW" style="width: 96px; height: 58px; object-fit: cover; object-position: center 20%; border-radius: 8px; filter: grayscale(0.6);">
        <span style="font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Y hay <strong style="color: ${STEEL};">3 más que ya no puedes comprar</strong> — una es la <strong style="color: ${STEEL};">SSW</strong>, la skin de campeón del mundo de Samsung White.</span>
      </div>
    </div>
  </section>`);

// ── 7 · Lore: solo obedece a quien no puede derrotar ─────────────────────
slides.push(`
  <section data-label="Lore · Du Couteau" data-screen-label="07 · El lore" data-speaker-notes="Huerfano sin nombre de los bajos fondos de Noxus. El General Du Couteau lo vencio en duelo y le dio a elegir: morir o servir. Eligio vivir con una condicion: solo acepta ordenes de quien no puede derrotar." style="${seccion()}">
    ${glow(CRIMSON, '50% 32%', '110% 42%')}
    <div style="position: relative;">
      ${eyebrow('El lore', CRIMSON)}
      ${arte('Talon_2.jpg', 'Talon Élite Carmesí', 380, 'center 18%')}
      <h2 data-a="up2" style="margin: 38px 0 0; font-family: ${DISPLAY}; font-size: 86px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">Solo obedece a quien<br><span style="color: ${CRIMSON};">no puede derrotar</span></h2>
      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 20px;">
        ${[
          '<strong style="color:' + STEEL + ';">Huérfano sin nombre</strong> de los bajos fondos de Noxus: ladrón y asesino a sueldo',
          'No recuerda a su familia <strong style="color:' + STEEL + ';">ni una sola muestra de cariño</strong> en toda su vida',
          'El General <strong style="color:' + STEEL + ';">Du Couteau</strong> fue por él en persona y lo venció en duelo',
          'Le dio a elegir: <strong style="color:' + STEEL + ';">morir o servir</strong>. Eligió vivir — sirviendo solo al General',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${CRIMSON}; width: 44px;">${i + 1}</span>
          <span style="font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Talon cumple 15 años</title>
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
    padding: 9px 18px; border: 1px solid rgba(111,199,240,0.45); border-radius: 999px;
    background: rgba(7,8,15,0.85); color: ${BLADE}; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
