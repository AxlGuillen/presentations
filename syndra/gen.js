// Generador de index.html — Syndra cumple 14 años (screenshots para TikTok)
// Ejecutar: node syndra/gen.js
//
// Serie «Cumplelolero» #10, animado. Orden del guion: lore primero (tercer
// episodio consecutivo con ese orden, tras ivern y missfortune). Aquí el lore
// ocupa cuatro láminas a propósito: el remate del video —que mañana Riot le
// nerfea el poder igual que su maestro en la historia— solo aterriza si la
// traición de Konigen se contó completa antes.
//
// Piezas de diseño:
//  · Portada y cierre usan el helper `portada()` estrenado en missfortune:
//    banda superior con recorte suave sobre una copia borrosa del splash.
//  · La lámina del castigo dibuja un **círculo cerrado** con las tres esferas
//    encima: el sueño en bucle se ve, no se explica.
//  · Las tres esferas son el motivo recurrente (`orbes()`), y aparecen en las
//    dos láminas donde el lore dice que explotó.
//
// ⚠️ El nerfeo del parche 26.18 va SIN cifras a propósito. La investigación
// marca los números como sin verificar (el parche sale después del video) y
// además su tabla dice que el maná BAJA de 20–255 a 20–199, mientras el guion
// narra que «le suben el maná». Poner la cifra contradiría la voz en off.
//
// Paleta muestreada: el splash es violeta-índigo (hue 240–270) y su icono
// aporta el magenta (hue 300–315).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Syndra: noche de Ionia, esferas y la herida ───────────────────
const BG = '#0D0A1A';        // noche de Ionia
const ORBE = '#C9A7FF';      // lila pálido del núcleo de sus esferas — acento
const SOBERANA = '#8B3FD1';  // violeta profundo — estructura y paneles
const HERIDA = '#E0567F';    // rosa carmín — la humillación y el nerfeo
const BONE = '#EFEAF7';      // texto principal
const MUTED = '#9187A3';     // texto secundario
const PANEL = '#171029';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = ORBE, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash:
// los splash son apaisados y el lienzo vertical, así que a sangre habría que
// ampliarlos casi 3× (ver missfortune). La capa borrosa sangra fuera del
// marco, de ahí el contenedor con overflow oculto — si no, infla scrollHeight.
const portada = (src, alt, posNitida = 'center 22%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(46px) saturate(0.8) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 760px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,10,26,0.18) 0%, rgba(13,10,26,0.42) 34%, rgba(13,10,26,0.92) 66%, rgba(13,10,26,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = ORBE) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// Las tres esferas: el motivo del personaje. Aparecen donde el lore dice que
// explotó, y otra vez encima del círculo del castigo.
const orbes = (tam = 46, gap = 26) => `
      <div data-orbes style="display: flex; align-items: center; gap: ${gap}px;">
        ${[0, 1, 2].map(() => `
        <span data-orbe style="display: block; width: ${tam}px; height: ${tam}px; border-radius: 50%; background: radial-gradient(circle at 35% 32%, #FFFFFF 0%, ${ORBE} 42%, ${SOBERANA} 100%); box-shadow: 0 0 ${Math.round(tam * 0.8)}px ${ORBE}80;"></span>`).join('')}
      </div>`;

const pasos = (lista, color = ORBE) => `
      <div data-a="up3" style="margin-top: 32px; display: flex; flex-direction: column; gap: 16px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span data-paso-num style="flex: none; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${color}; width: 44px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = ORBE) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy es cumpleanos de Syndra, que lleva catorce anos desde que llego a la Grieta del Invocador, y toca darle sus tres minutos de atencion." style="${seccion()}">
    ${portada('Syndra_0.jpg', 'Syndra, la Soberana Oscura')}
    ${glow(ORBE, '50% 30%', '120% 45%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · 9 sep 2012 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 196px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 0 90px rgba(201,167,255,0.45);"><span data-linea style="display: block;">SYNDRA</span><span data-linea style="display: block; color: ${ORBE};">14 AÑOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${ORBE}; line-height: 1.3;">La Soberana Oscura</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Mid · Maga · Ionia</p>
    </div>
  </section>`);

// ── 2 · Su nombre significa Destrucción ──────────────────────────────────
slides.push(`
  <section data-label="Destrucción" data-screen-label="02 · El nombre" data-speaker-notes="Arrancamos con el dato mas simple de todos. Syndra en ionio significa Destruccion. Literalmente le pusieron asi." style="${seccion('align-items: center; text-align: center;')}">
    ${glow(SOBERANA, '50% 46%', '120% 58%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('El dato más simple de todos')}
      <div data-palabra style="font-family: ${DISPLAY}; font-size: 128px; line-height: 1; color: ${MUTED}; letter-spacing: 6px;">«SYNDRA»</div>
      <div data-igual style="margin: 26px 0; width: 120px; height: 4px; background: ${ORBE};"></div>
      <div data-significado style="font-family: ${DISPLAY}; font-size: 176px; line-height: 0.92; color: ${ORBE}; text-shadow: 0 0 80px rgba(201,167,255,0.4);">DESTRUCCIÓN</div>
      <p data-a="up3" style="margin: 40px 0 0; font-size: 33px; font-weight: 400; color: ${MUTED}; line-height: 1.4; max-width: 780px;">Eso quiere decir su nombre <strong style="color: ${BONE};">en ionio</strong>. Literalmente le pusieron así.</p>
      <div style="margin-top: 46px;">${orbes(54, 32)}</div>
    </div>
  </section>`);

// ── 3 · Lore I · La niña y el Sauce Espectral ────────────────────────────
slides.push(`
  <section data-label="El Sauce Espectral" data-screen-label="03 · El escondite" data-speaker-notes="Su lore es el mas triste que he contado en esta serie, porque Syndra es una nina a la que castigaron toda la vida por tener demasiado poder. Nacio en un pueblo chico de Ionia. Era distraida y sus papas la castigaban seguido, y cada vez que la castigaban se iba a su escondite secreto, un arbol al que le decian el Sauce Espectral, a contarle sus penas entre las raices." style="${seccion()}">
    ${glow(SOBERANA, '50% 36%', '112% 52%')}
    <div style="position: relative;">
      ${eyebrow('El lore más triste de la serie')}
      ${titulo('Una niña castigada<br><span style="color: ' + ORBE + ';">por tener demasiado poder</span>', 82)}
      ${pasos([
        'Nació en <strong style="color:' + BONE + ';">un pueblo chico de Ionia</strong>',
        'Era distraída y <strong style="color:' + BONE + ';">sus papás la castigaban seguido</strong>',
        'Cada vez que la castigaban se iba a su escondite secreto: <strong style="color:' + BONE + ';">el Sauce Espectral</strong>',
        'Ahí, <strong style="color:' + BONE + ';">metida entre las raíces</strong>, le contaba sus penas al árbol',
      ])}
      ${remate('Un árbol al que le contaba lo que no podía contarle a nadie más. <strong style="color: ' + ORBE + ';">Ese era todo su refugio.</strong>')}
    </div>
  </section>`);

// ── 4 · Lore II · La primera explosión y el exilio ───────────────────────
slides.push(`
  <section data-label="La primera explosión" data-screen-label="04 · La explosión" data-speaker-notes="Hasta que un dia su hermano y sus amigos encontraron el escondite y se pusieron a burlarse. Ella los ignoro, pero uno le tiro lodo y la hizo sangrar. Y ahi exploto por primera vez. Le aparecieron tres orbes alrededor y el sauce se marchito completo. El problema es que el pueblo entero dependia de ese arbol para su magia. Asi que culparon a la familia de Syndra y los exiliaron a todos." style="${seccion()}">
    ${glow(HERIDA, '50% 34%', '115% 52%')}
    <div style="position: relative;">
      ${eyebrow('Hasta que la encontraron', HERIDA)}
      ${titulo('Le tiraron lodo<br><span style="color: ' + HERIDA + ';">y la hicieron sangrar</span>', 92)}

      <div data-explosion style="margin-top: 44px; padding: 40px 44px; border-radius: 22px; background: ${SOBERANA}1A; border: 1px solid ${ORBE}59; display: flex; flex-direction: column; align-items: center; gap: 26px;">
        ${orbes(58, 38)}
        <div style="font-family: ${DISPLAY}; font-size: 76px; line-height: 1.0; color: ${BONE}; text-align: center;">Y ahí explotó<br><span style="color: ${ORBE};">por primera vez</span></div>
      </div>

      ${pasos([
        'Le aparecieron <strong style="color:' + BONE + ';">tres orbes alrededor</strong> y el sauce <strong style="color:' + BONE + ';">se marchitó completo</strong>',
        'El pueblo entero <strong style="color:' + BONE + ';">dependía de ese árbol</strong> para su magia',
        'Culparon a su familia y <strong style="color:' + BONE + ';">los exiliaron a todos</strong>',
      ], HERIDA)}
    </div>
  </section>`);

// ── 5 · Lore III · La escuela y la traición del maestro ──────────────────
slides.push(`
  <section data-label="La traición del maestro" data-screen-label="05 · El maestro" data-speaker-notes="Vagaron por Ionia hasta llegar a una escuela de magia especializada en domar magia salvaje, y ahi sus papas la dejaron. Paso anos estudiando, hasta que noto que su poder estaba disminuyendo en vez de crecer. Encaro a su maestro, y el le confeso que se los habia sellado a escondidas porque le parecio que tenia demasiados. Syndra exploto otra vez y lo mato." style="${seccion()}">
    ${glow(SOBERANA, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y sus papás la dejaron ahí')}
      ${titulo('Su poder estaba bajando<br><span style="color: ' + ORBE + ';">en vez de crecer</span>', 84)}

      ${pasos([
        'Vagaron por Ionia hasta <strong style="color:' + BONE + ';">una escuela de magia</strong> especializada en domar magia salvaje',
        'Pasó años estudiando, hasta que <strong style="color:' + BONE + ';">notó que su poder disminuía</strong>',
        'Encaró a su maestro y él le confesó que <strong style="color:' + BONE + ';">se los había sellado a escondidas</strong>',
      ])}

      <div data-motivo style="margin-top: 36px; padding: 34px 38px; border-radius: 20px; background: ${HERIDA}14; border-left: 6px solid ${HERIDA};">
        <div style="font-family: ${DISPLAY}; font-size: 68px; line-height: 1.02; color: ${BONE};">Porque le pareció que<br><span style="color: ${HERIDA};">tenía demasiados</span></div>
      </div>

      ${remate('Syndra explotó otra vez. <strong style="color: ' + ORBE + ';">Y lo mató.</strong>')}
    </div>
  </section>`);

// ── 6 · Lore IV · El castigo: el sueño en bucle ──────────────────────────
// El bucle se dibuja: un círculo cerrado con las tres esferas encima.
const R = 148, CX = 190, CY = 190;
const posOrbe = i => {
  const a = (-90 + i * 120) * Math.PI / 180;
  return [(CX + R * Math.cos(a)).toFixed(1), (CY + R * Math.sin(a)).toFixed(1)];
};

slides.push(`
  <section data-label="El sueño en bucle" data-screen-label="06 · El castigo" data-speaker-notes="Despues subio al cielo, invoco tres orbes que le chuparon la esencia magica a la isla completa y arraso con todo el que se le puso enfrente. Ahi intervino el Espiritu de Ionia y la encerro en un estanque magico por romper el equilibrio de la naturaleza. Y esta es la parte mas cruel. Mientras estaba dormida ahi encerrada la condenaron a un sueno en bucle que no la dejaba despertar, y el sueno era exactamente el momento en que la humillaron de nina. La dejaron viviendo eso una y otra vez durante anos." style="${seccion()}">
    ${glow(SOBERANA, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Y esta es la parte más cruel', HERIDA)}
      ${titulo('La condenaron a<br><span style="color: ' + HERIDA + ';">un sueño en bucle</span>', 92)}

      <div style="margin-top: 40px; display: flex; align-items: center; gap: 40px;">
        <svg data-svg-bucle viewBox="0 0 380 380" style="flex: none; width: 380px; height: 380px; overflow: visible;">
          <circle data-bucle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${ORBE}" stroke-width="5" stroke-linecap="round"></circle>
          ${[0, 1, 2].map(i => {
            const [x, y] = posOrbe(i);
            return `<circle data-orbe-bucle cx="${x}" cy="${y}" r="17" fill="${ORBE}" stroke="${BG}" stroke-width="5"></circle>`;
          }).join('')}
        </svg>
        <div style="flex: 1; min-width: 0;">
          <div data-bucle-txt style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1.04; color: ${BONE};">El sueño era exactamente<br><span style="color: ${HERIDA};">el momento en que la humillaron de niña</span></div>
          <div data-bucle-txt style="margin-top: 22px; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">La dejaron viviendo eso <strong style="color: ${BONE};">una y otra vez durante años</strong>.</div>
        </div>
      </div>

      ${remate('Antes de eso arrasó la isla completa, y el <strong style="color: ' + ORBE + ';">Espíritu de Ionia</strong> la encerró en un estanque mágico por romper el equilibrio de la naturaleza.')}
    </div>
  </section>`);

// ── 7 · El remate: Riot le hace lo mismo que el maestro ──────────────────
// Sin cifras a propósito: ver la nota de cabecera.
const nerfeos = [
  ['Las esferas', 'Le suben el maná'],
  ['La W', 'Le suben el cooldown'],
];

slides.push(`
  <section data-label="Riot es el maestro" data-screen-label="07 · El nerfeo" data-speaker-notes="Y ahora agarrense, porque manana sale el parche veintiseis punto dieciocho y a Syndra le meten un nerfeo. Le suben el mana de las esferas y le suben el cooldown de la W. O sea que Riot le esta haciendo exactamente lo mismo que el maestro del lore, quitarle poder porque tiene demasiado." style="${seccion()}">
    ${glow(HERIDA, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Y ahora agárrense', HERIDA)}
      ${titulo('Mañana le meten<br><span style="color: ' + HERIDA + ';">un nerfeo</span>', 104)}

      <div data-parche style="margin-top: 40px; display: inline-flex; align-items: center; gap: 14px; padding: 12px 26px; border-radius: 999px; background: ${HERIDA}1F; border: 1px solid ${HERIDA};">
        <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${HERIDA};">PARCHE 26.18</span>
      </div>

      <div style="margin-top: 32px; display: flex; gap: 18px;">
        ${nerfeos.map(([que, como]) => `
        <div data-nerfeo style="flex: 1; padding: 30px 26px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid ${HERIDA}4D;">
          <div style="font-size: 23px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${MUTED};">${que}</div>
          <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 54px; line-height: 1.02; color: ${HERIDA};">${como}</div>
        </div>`).join('')}
      </div>

      <div data-paralelo style="margin-top: 40px; padding: 38px 42px; border-radius: 22px; background: ${SOBERANA}1F; border: 1px solid ${ORBE}73;">
        <div style="font-family: ${DISPLAY}; font-size: 72px; line-height: 1.02; color: ${BONE};">Riot le está haciendo<br><span style="color: ${ORBE};">lo mismo que el maestro</span></div>
        <div style="margin-top: 18px; font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Quitarle poder <strong style="color: ${BONE};">porque tiene demasiado</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 8 · El one trick más dominante de la serie ───────────────────────────
const rangos = [
  ['S2026', 'Master · 130 LP', 'master.png', true],
  ['S2025', 'Esmeralda 1', 'emerald.png', false],
  ['S2024 S3', 'Diamante 4', 'diamond.png', false],
  ['S2024 S2', 'Esmeralda 2', 'emerald.png', false],
  ['S2024 S1', 'Diamante 3', 'diamond.png', false],
  ['S2023 S2', 'Master', 'master.png', true],
];

slides.push(`
  <section data-label="El one trick #1" data-screen-label="08 · El OTP" data-speaker-notes="Es un norteamericano con catorce millones trescientos mil puntos, y el segundo mejor Syndra del mundo tiene siete millones novecientos mil. Le saca casi el doble. Y este si es bueno, esta en Master y es top cero punto cinco por ciento de su servidor. Y el dato que nos toca, porque el cuarto mejor Syndra del mundo es del servidor del sur." style="${seccion()}">
    ${glow(ORBE, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${BONE};">HUGH AKSTON</span>
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${ORBE};">#NA1</span>
      </div>
      <p data-nombre style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Norteamérica · nivel de invocador 1 386 · 85% mid · 98% maga</p>

      <div style="margin-top: 34px; display: flex; gap: 20px;">
        <div data-panel style="flex: 1; min-width: 0; padding: 30px 26px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(201,167,255,0.28);">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Él</div>
          <div data-cuenta="14328495" style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 68px; line-height: 0.95; color: ${ORBE};">14 328 495</div>
          <div style="margin-top: 4px; font-size: 21px; font-weight: 600; color: ${MUTED};">puntos de maestría</div>
        </div>
        <div data-panel style="flex: 1; min-width: 0; padding: 30px 26px; border-radius: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09);">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">El segundo del mundo</div>
          <div style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 68px; line-height: 0.95; color: ${MUTED};">7 916 519</div>
          <div style="margin-top: 4px; font-size: 21px; font-weight: 600; color: ${MUTED};">puntos de maestría</div>
        </div>
      </div>

      <div data-ventaja style="margin-top: 28px; display: flex; align-items: center; gap: 30px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 118px; line-height: 0.86; color: ${ORBE};">1,81×</div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">le saca casi el doble</div>
        </div>
        <div style="width: 2px; height: 90px; background: rgba(201,167,255,0.3);"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Es <strong style="color: ${BONE};">el dominio más aplastante</strong> de su propio ranking en toda la serie.</div>
      </div>

    </div>
  </section>`);

// ── 9 · Y este sí es bueno: el historial de rangos ───────────────────────
slides.push(`
  <section data-label="Y este sí es bueno" data-screen-label="09 · El rango" data-speaker-notes="Y este si es bueno, esta en Master y es top cero punto cinco por ciento de su servidor. Y el dato que nos toca, porque el cuarto mejor Syndra del mundo es del servidor del sur." style="${seccion()}">
    ${glow(ORBE, '50% 40%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y este sí es bueno')}
      ${titulo('Master, y <span style="color: ' + ORBE + ';">top 0,58%</span><br>de su servidor', 88)}

      <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 12px;">
        ${rangos.map(([temp, nombre, emblema, top]) => `
        <div data-rango style="display: flex; align-items: center; gap: 16px; padding: 12px 18px; border-radius: 14px; ${top ? `background: ${ORBE}1A; border: 1px solid ${ORBE}66;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
          <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 62px; height: 62px; object-fit: contain; flex: none;">
          <span style="flex: none; width: 118px; font-size: 24px; font-weight: 600; color: ${MUTED};">${temp}</span>
          <span style="flex: 1; font-size: 29px; font-weight: ${top ? '700' : '500'}; color: ${top ? ORBE : BONE};">${nombre}${top ? '  ◄' : ''}</span>
        </div>`).join('')}
      </div>

      <div data-racha style="margin-top: 30px; display: flex; gap: 16px;">
        ${[['8 V — 2 D', 'la última semana'], ['70 %', 'en sus últimas 20'], ['122×', 'más que su 2º campeón']].map(([cifra, pie]) => `
        <div style="flex: 1; padding: 20px 14px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 1; color: ${ORBE};">${cifra}</div>
          <div style="margin-top: 4px; font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${pie}</div>
        </div>`).join('')}
      </div>

      <div data-latam style="margin-top: 28px; display: flex; align-items: center; gap: 22px; padding: 24px 28px; border-radius: 18px; background: ${SOBERANA}1F; border: 1px solid ${SOBERANA}80;">
        <span style="flex: none; font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${ORBE};">#4</span>
        <span style="flex: none; background: ${ORBE}; color: ${BG}; font-size: 21px; font-weight: 800; border-radius: 8px; padding: 5px 14px; letter-spacing: 1px;">LAS</span>
        <span style="flex: 1; font-size: 27px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Y el dato que nos toca: <strong style="color: ${BONE};">el cuarto mejor Syndra del mundo</strong> es del servidor del sur.</span>
      </div>
    </div>
  </section>`);

// ── 9 · Las skins y la de campeón del mundo ──────────────────────────────
const skins = [
  ['Syndra_1.jpg', 'Justiciera'], ['Syndra_2.jpg', 'Atlante'],
  ['Syndra_3.jpg', 'Reina de Diamantes'], ['Syndra_6.jpg', 'Guardiana Estelar'],
  ['Syndra_7.jpg', 'Veraniega'], ['Syndra_16.jpg', 'Rosa Marchita'],
  ['Syndra_44.jpg', 'Flor Espiritual'], ['Syndra_54.jpg', 'Aquelarre'],
  ['Syndra_65.jpg', 'Monerías Dumplinescas'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="10 · Las skins" data-speaker-notes="De skins tiene trece en total y nueve que puedes comprar, que te saldrian en unos ochenta y tres dolares. Pero la buena esta en la boveda, porque Syndra tiene skin de campeon del mundo. Cuando SKT gano el mundial de dos mil dieciseis, Faker la eligio para su coleccion." style="${seccion()}">
    ${glow(ORBE, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('13 skins, y <span style="color: ' + ORBE + ';">9 a la venta</span>', 90)}

      <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        ${skins.map(([img, nombre]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 7px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 160px; object-fit: cover; object-position: center 22%; border-radius: 10px; border: 1px solid rgba(201,167,255,0.24);">
            <span style="font-size: 19px; font-weight: 600; color: ${MUTED}; line-height: 1.15;">${nombre}</span>
          </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 32px; display: flex; align-items: flex-end; gap: 34px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 106px; line-height: 0.86; color: ${ORBE};">~<span data-cuenta="83">83</span> <span style="font-size: 56px;">USD</span></div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las nueve · 10 800 RP · 5,1 días de salario</div>
        </div>
      </div>

      <div data-faker style="margin-top: 30px; display: flex; align-items: center; gap: 24px; padding: 22px 28px; border-radius: 18px; background: ${SOBERANA}1F; border: 1px solid ${ORBE}73;">
        <img src="assets/Syndra_5.jpg" alt="Syndra SKT T1" style="width: 176px; height: 96px; object-fit: cover; object-position: center 24%; border-radius: 12px; flex: none;">
        <div style="min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 1; color: ${ORBE};">Pero la buena está en la bóveda</div>
          <div style="margin-top: 6px; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Cuando <strong style="color: ${BONE};">SKT ganó el mundial de 2016</strong>, Faker eligió a Syndra para su colección.</div>
        </div>
      </div>
    </div>
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="11 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('Syndra_44.jpg', 'Syndra Flor Espiritual', 'center 18%')}
    ${glow(ORBE, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Catorce años de la Soberana Oscura')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${ORBE};">Syndra</span></h2>
      <div style="margin-top: 40px;">${orbes(44, 28)}</div>
      <div data-gigi style="margin-top: 46px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${HERIDA};">GIGI EASY</div>
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

  // Dibuja un trazo SVG midiendo su longitud real. El dasharray se pone aquí y
  // no en CSS: sin JS el trazo se ve completo, que es el estado correcto.
  function trazo(tl, el, pos, dur) {
    if (!el || !el.getTotalLength) return;
    var L = el.getTotalLength();
    gsap.set(el, { strokeDasharray: L });
    tl.from(el, { strokeDashoffset: L, duration: dur || 0.9, ease: 'power2.inOut' }, pos || 0);
  }

  // Las tres esferas siempre entran igual: estallan desde el centro con rebote.
  // Es el motivo del personaje, así que conviene que se reconozca.
  function estallido(tl, s, pos) {
    var o = q(s, '[data-orbe]');
    if (o.length) tl.from(o, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'back.out(2.6)' }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.66);
  });

  // El nombre: primero la palabra en gris, luego la regla, y al final el
  // significado. La traducción tiene que llegar después, no a la vez.
  animar('Destrucción', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-palabra]'), { y: 26, opacity: 0, duration: 0.6 }, 0.14)
      .from(s.querySelector('[data-igual]'), { scaleX: 0, opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 0.44)
      .from(s.querySelector('[data-significado]'), { scale: 0.86, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }, 0.62)
      .from(s.querySelector('p[data-a="up3"]'), { y: 22, opacity: 0, duration: 0.55 }, 0.98);
    estallido(tl, s, 1.08);
  });

  animar('El Sauce Espectral', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.12)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.36)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.39)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.08);
  });

  // La explosión: el bloque entra de golpe y las esferas estallan dentro.
  animar('La primera explosión', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-explosion]'), { scale: 0.92, opacity: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.34)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.92)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.95);
    estallido(tl, s, 0.58);
  });

  animar('La traición del maestro', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.34)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.37)
      .from(s.querySelector('[data-motivo]'), { x: -34, opacity: 0, duration: 0.6 }, 0.92)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.2);
  });

  // El bucle: el círculo se cierra sobre sí mismo y encima aterrizan las tres
  // esferas. Que el trazo no tenga principio ni final es exactamente el castigo.
  animar('El sueño en bucle', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-orbe-bucle]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.1, ease: 'back.out(2.4)' }, 1.06)
      .from(q(s, '[data-bucle-txt]'), { y: 24, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.72)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.24);
    trazo(tl, s.querySelector('[data-bucle]'), 0.3, 0.95);
  });

  // El remate: los dos nerfeos primero y el paralelo con el maestro al final,
  // que es donde cierra el chiste del episodio.
  animar('Riot es el maestro', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-parche]'), { scale: 0.8, opacity: 0, duration: 0.45, ease: 'back.out(2.2)' }, 0.36)
      .from(q(s, '[data-nerfeo]'), { y: 28, opacity: 0, duration: 0.5, stagger: 0.13 }, 0.54)
      .from(s.querySelector('[data-paralelo]'), { y: 34, opacity: 0, duration: 0.7 }, 0.98);
  });

  animar('El one trick #1', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.08)
      .from(q(s, '[data-panel]'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.14 }, 0.28)
      .from(s.querySelector('[data-ventaja]'), { y: 26, opacity: 0, duration: 0.6 }, 0.9);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.42, 0.9);
  });

  // El historial: las temporadas caen en cascada y la racha y el bloque LATAM
  // llegan después, para que primero se lea que nunca bajó de Diamante.
  animar('Y este sí es bueno', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-rango]'), { x: 28, opacity: 0, duration: 0.42, stagger: 0.09 }, 0.32)
      .from(s.querySelector('[data-racha]'), { y: 24, opacity: 0, duration: 0.5 }, 0.92)
      .from(s.querySelector('[data-latam]'), { x: -30, opacity: 0, duration: 0.55 }, 1.12);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 26, opacity: 0, scale: 0.94, duration: 0.48, stagger: 0.06 }, 0.26)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.55 }, 0.86)
      .from(s.querySelector('[data-faker]'), { x: 30, opacity: 0, duration: 0.6 }, 1.06);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.86, 0.7);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.24)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.86);
    estallido(tl, s, 0.68);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Syndra cumple 14 años</title>
${kit.og({ titulo: "Syndra cumple 14 años", descripcion: "Catorce años de la Soberana Oscura: su nombre significa Destrucción, la castigaron toda la vida por tener demasiado poder, y mañana Riot le hace exactamente lo mismo que su maestro. Apoyo visual para TikTok.", carpeta: "syndra" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(201,167,255,0.45); border-radius: 999px;
    background: rgba(13,10,26,0.85); color: ${ORBE}; cursor: pointer;
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
