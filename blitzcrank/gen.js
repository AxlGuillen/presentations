// Generador de index.html — Blitzcrank cumple 17 años (screenshots para TikTok)
// Ejecutar: node blitzcrank/gen.js
//
// Serie «Cumplelolero» #4 (mismo formato que /ornn/, /urgot/ y /talon/): 1080×1920
// con el contenido en banda central (padding 300/350) para la interfaz de TikTok.
// Paleta muestreada del splash original: el cuerpo es latón (hue 15–30) y el fondo
// de Zaun es índigo eléctrico (hue 240–255) — de ahí el acento violeta.
//
// El deck sigue el guion del video, que es doble con Malphite: por eso la última
// diapositiva es el pase al otro cumpleañero. Dos datos de la investigación NO
// entran porque el guion no los narra: la trilogía Oxidado/Oxidadote/Oxidadísimo
// y que Blitzcrank nunca tuvo sequía de skins.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG (y demás helpers de build-time)

// ── Paleta Blitzcrank: latón, arco eléctrico y noche de Zaun ─────────────
const BG = '#0A0A18';
const ARC = '#8F6DFF';       // violeta eléctrico — los arcos que le dan el nombre
const BRASS = '#D9913C';     // latón del cuerpo — dinero y logros
const STEEL = '#EAE7F5';     // texto principal
const MUTED = '#8C87A6';     // texto secundario
const TOXIC = '#3FC38A';     // el químico de Zaun — solo en el lore
const NIGHT = '#12111F';     // paneles
const COIN = '#B0455F';      // la otra cara de la moneda

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${STEEL}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = ARC, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = ARC) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">${txt}</h2>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(143,109,255,0.28); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,24,0) 40%, rgba(10,10,24,0.85) 100%);"></div>
      </div>`;

const slides = [];

// ── 1 · Portada: 17 años ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada · 17 años" data-screen-label="01 · Portada" data-speaker-notes="Hoy dos de septiembre cumplen anos cuatro campeones. Empezamos con Blitzcrank, que cumple diecisiete." style="${seccion()} background-image: linear-gradient(180deg, rgba(10,10,24,0.25) 0%, rgba(10,10,24,0.95) 78%), url('assets/Blitzcrank_0.jpg'); background-size: cover; background-position: center 22%;">
    ${glow(ARC, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · 2 sep 2009 — 2026')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${STEEL}; text-shadow: 0 0 90px rgba(143,109,255,0.45);">BLITZCRANK<br><span style="color: ${ARC};">17 AÑOS</span></h1>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${ARC}; line-height: 1.3;">El Gran Gólem de Vapor</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Support · Zaun</p>
    </div>
  </section>`);

// ── 2 · Los cuatro cumpleañeros del 2 de septiembre ──────────────────────
const cumples = [
  ['Blitzcrank', 'icon-Blitzcrank.png', 'Hoy', true],
  ['Malphite', 'icon-Malphite.png', 'Hoy', true],
  ['Dr. Mundo', 'icon-DrMundo.png', 'Mañana', false],
  ['Janna', 'icon-Janna.png', 'Mañana', false],
];

slides.push(`
  <section data-label="Los cuatro del 2 de septiembre" data-screen-label="02 · Los cuatro" data-speaker-notes="Hoy cumplen anos cuatro campeones del juego de mierda que tantas emociones despierta en nuestras miserables vidas. Hoy les subo dos y manana otros dos." style="${seccion()}">
    ${glow(ARC, '50% 42%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('2 de septiembre de 2009')}
      ${titulo('Hoy cumplen<br><span style="color: ' + ARC + ';">cuatro campeones</span>', 96)}

      <div data-a="img" style="margin-top: 46px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px;">
        ${cumples.map(([nombre, icono, cuando, hoy]) => `
        <div style="display: flex; align-items: center; gap: 22px; padding: 24px 26px; border-radius: 18px; background: ${hoy ? ARC + '1A' : NIGHT + 'D9'}; border: 1px solid ${hoy ? ARC + '66' : 'rgba(255,255,255,0.07)'};">
          <img src="assets/${icono}" alt="${nombre}" style="width: 104px; height: 104px; border-radius: 16px; flex: none; border: 2px solid ${hoy ? ARC : 'rgba(255,255,255,0.12)'}; ${hoy ? '' : 'filter: grayscale(0.75); opacity: 0.75;'}">
          <div style="min-width: 0;">
            <div style="font-family: ${DISPLAY}; font-size: 52px; line-height: 0.95; color: ${hoy ? STEEL : MUTED};">${nombre}</div>
            <div style="margin-top: 6px; font-size: 23px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${hoy ? ARC : MUTED};">${cuando} · 17 años</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 44px; display: flex; align-items: center; gap: 30px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 132px; line-height: 0.86; color: ${BRASS};">2 + 2</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">hoy dos, mañana dos</div>
        </div>
        <div style="width: 2px; height: 96px; background: rgba(143,109,255,0.3);"></div>
        <div style="flex: 1; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Los cuatro salieron <strong style="color: ${STEEL};">el mismo día de 2009</strong>. Al primero que se queje, ya sabe lo que le toca.</div>
      </div>
    </div>
  </section>`);

// ── 3 · Moneda al aire ───────────────────────────────────────────────────
const caras = [
  [ARC, 'O viene inspirado', 'Te mete <strong style="color:' + STEEL + ';">ganchos a ángulo cambiado</strong> y gana la partida él solo'],
  [COIN, 'O es un puñetas', 'No va a hacer <strong style="color:' + STEEL + ';">absolutamente nada</strong> en toda la partida'],
];

slides.push(`
  <section data-label="Moneda al aire" data-screen-label="03 · Moneda al aire" data-speaker-notes="Este personaje siempre es una moneda al aire: o tu support viene inspirado metiendo ganchos a angulo cambiado, o es un punetas que no va a hacer nada en toda la partida." style="${seccion()}">
    ${glow(ARC, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Que te toque uno en el equipo')}
      ${titulo('Siempre es una<br><span style="color: ' + ARC + ';">moneda al aire</span>', 100)}

      ${arte('Blitzcrank_0.jpg', 'Blitzcrank original', 380, 'center 26%', 'margin-top: 38px;')}

      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 22px;">
        ${caras.map(([color, cabeza, texto]) => `
        <div style="display: flex; align-items: center; gap: 26px; padding: 28px 32px; border-radius: 18px; background: ${color}14; border: 1px solid ${color}59;">
          <span style="flex: none; width: 128px; height: 76px; border-radius: 999px; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; padding-top: 4px; box-sizing: border-box; color: ${color};">50 %</span>
          <div style="min-width: 0;">
            <div style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${color};">${cabeza}</div>
            <div style="margin-top: 8px; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">${texto}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 4 · El one trick pony #1 del mundo ───────────────────────────────────
const rangos = [
  ['S2026', 'Diamante 4', 'diamond.png', false],
  ['S2025', 'Esmeralda 4', 'emerald.png', false],
  ['S2024 S3', 'Esmeralda 2', 'emerald.png', false],
  ['S2024 S2', 'Diamante 2', 'diamond.png', false],
  ['S2024 S1', 'Maestro', 'master.png', true],
  ['S2023 S2', 'Maestro', 'master.png', true],
];

const panel = (etiqueta, contenido) => `
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${NIGHT}D9; border: 1px solid rgba(143,109,255,0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img src="assets/icon-Blitzcrank.png" alt="Blitzcrank" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${ARC}; box-shadow: 0 0 46px rgba(143,109,255,0.45);">
                <span style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${ARC}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">740</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span style="font-family: ${DISPLAY}; font-size: 80px; line-height: 0.9; color: ${ARC}; margin-top: 20px;">8 436 338</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Blitzcrank</span>
              <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 0.9; color: ${STEEL}; margin-top: 20px;">7,2×</span>
              <span style="font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; text-align: center;">más que su 2º campeón<br>(Leona · 1 169 463)</span>`);

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, top]) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${top ? `background: ${BRASS}1F; border: 1px solid ${BRASS}66;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 26px; font-weight: ${top ? '700' : '500'}; color: ${top ? BRASS : STEEL};">${nombre}${top ? '  ◄' : ''}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Llegó a <strong style="color: ${BRASS};">Maestro</strong> dos veces · hoy Diamante</span>`);

slides.push(`
  <section data-label="El one trick #1" data-screen-label="04 · El OTP" data-speaker-notes="El one trick que mas puntos tiene es un coreano que llego a Master pero ahorita esta en Diamante, un elo muy decente considerando que campeon juega. Maestria setecientos cuarenta con mas de ocho millones cuatrocientos mil puntos." style="${seccion()}">
    ${glow(ARC, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-a="up2" style="display: flex; align-items: baseline; gap: 22px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${STEEL};">ROKINAS</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${ARC};">#KR1</span>
      </div>
      <p data-a="up2" style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Corea · nivel de invocador 1 273 · top 4,67% del servidor</p>

      <div data-a="img" style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-a="up3" style="margin-top: 28px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${BRASS};">100 <span style="font-size: 58px;">%</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">support, siempre</div>
        </div>
        <div style="width: 2px; height: 88px; background: rgba(143,109,255,0.3);"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Sus cinco más jugados son todos support: Blitzcrank, Leona, Morgana, Nautilus y Nami. <strong style="color: ${STEEL};">No es enfermo del campeón, es enfermo del rol.</strong></div>
      </div>

      <div data-a="up3" style="margin-top: 24px; font-size: 25px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">No es el que más puntos ha tenido de la serie — el de <strong style="color: ${STEEL};">Talon llevaba 12,4 millones</strong>.</div>
    </div>
  </section>`);

// ── 5 · Las skins y el precio ────────────────────────────────────────────
const skins = [
  ['Blitzcrank_3.jpg', 'Boxeador', '520 RP'],
  ['Blitzcrank_4.jpg', 'Talleres Piltóver', '1350 RP'],
  ['Blitzcrank_6.jpg', 'iBlitzcrank', '1350 RP'],
  ['Blitzcrank_11.jpg', 'Subjefe', '1350 RP'],
  ['Blitzcrank_20.jpg', 'Lancero Sombrío', '1350 RP'],
  ['Blitzcrank_21.jpg', 'Lancero Radiante', '1350 RP'],
  ['Blitzcrank_29.jpg', 'Onda Espacial', '1820 RP'],
  ['Blitzcrank_47.jpg', 'Juegos Cénit', '1350 RP'],
  ['Blitzcrank_56.jpg', 'Blitzzzzcrank', '1350 RP'],
  ['Blitzcrank_66.jpg', 'Manita Pegajosa', '1350 RP'],
];

const serie = [
  ['Ornn', '3,3', 33],
  ['Urgot', '3,5', 35],
  ['Talon', '4,9', 49],
  ['Blitzcrank', '6,3', 63],
];

slides.push(`
  <section data-label="Las skins y el precio" data-screen-label="05 · Skins y precio" data-speaker-notes="Este campeon parece que si es apreciado por Riot: tiene dieciocho skins, de las cuales solo te puedes comprar diez. Si te las quisieras comprar nomas ocuparias cien dolares, casi una semanita de salario minimo aqui en Mexico, asi que mucho no es." style="${seccion()}">
    ${glow(BRASS, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('18 skins, pero solo<br><span style="color: ' + BRASS + ';">10 a la venta</span>', 88)}

      <div data-a="img" style="margin-top: 30px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
        ${skins.map(([img, nombre, rp]) => `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 112px; object-fit: cover; object-position: center 22%; border-radius: 10px; border: 1px solid rgba(143,109,255,0.25);">
            <span style="font-size: 18px; font-weight: 600; color: ${STEEL}; line-height: 1.15;">${nombre}</span>
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 1px; color: ${BRASS};">${rp}</span>
          </div>`).join('')}
      </div>

      <div data-a="up3" style="margin-top: 36px;">
        <div style="font-family: ${DISPLAY}; font-size: 120px; line-height: 0.86; color: ${BRASS};">~101 <span style="font-size: 64px;">USD</span></div>
        <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las diez · 13 140 RP · ~1 970 MXN</div>
      </div>

      <div data-a="up3" style="margin-top: 36px; display: flex; flex-direction: column; gap: 14px;">
        <span style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Días de salario mínimo (México)</span>
        ${serie.map(([quien, dias, pct]) => `
        <div style="display: flex; align-items: center; gap: 20px;">
          <span style="flex: none; width: 172px; font-size: 26px; font-weight: 600; color: ${quien === 'Blitzcrank' ? STEEL : MUTED};">${quien}</span>
          <div style="flex: 1; height: 42px; border-radius: 10px; background: rgba(255,255,255,0.06); overflow: hidden;">
            <div style="width: ${pct * 1.5}%; height: 100%; background: ${quien === 'Blitzcrank' ? BRASS : 'rgba(255,255,255,0.18)'}; display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; box-sizing: border-box;">
              <span style="font-family: ${DISPLAY}; font-size: 28px; color: ${quien === 'Blitzcrank' ? BG : STEEL};">${dias}</span>
            </div>
          </div>
        </div>`).join('')}
        <span style="margin-top: 4px; font-size: 25px; font-weight: 500; color: ${STEEL};">6,3 días — <strong style="color: ${BRASS};">casi una semanita</strong>. Mucho no es.</span>
      </div>
    </div>
  </section>`);

// ── 6 · El lore: nació de la basura ──────────────────────────────────────
slides.push(`
  <section data-label="Lore · Nació de la basura" data-screen-label="06 · El lore" data-speaker-notes="Hubo un derrame quimico en Zaun y mandaron golems mecanicos a limpiar la toxicidad. Uno de ellos se descompuso y lo tiraron a la chatarra, y ahi lo encontro Viktor, le metio un cristal hextech y lo revivio. Lo mando de vuelta a limpiar y se dio cuenta de que su golem ya no estaba trabajando, estaba aprendiendo." style="${seccion()}">
    ${glow(TOXIC, '50% 32%', '110% 45%')}
    <div style="position: relative;">
      ${eyebrow('El lore', TOXIC)}
      ${arte('Viktor_0.jpg', 'Viktor, su creador', 340, 'center 20%')}
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">Blitzcrank nació<br><span style="color: ${TOXIC};">de la basura</span></h2>
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 16px;">
        ${[
          'Hubo un <strong style="color:' + STEEL + ';">derrame químico</strong> que devastó barrios enteros de Zaun',
          'Mandaron <strong style="color:' + STEEL + ';">gólems mecánicos</strong> a limpiar la toxicidad',
          'Uno se descompuso y <strong style="color:' + STEEL + ';">lo tiraron a la chatarra</strong>',
          '<strong style="color:' + STEEL + ';">Viktor lo encontró</strong>, le metió un cristal hextech y lo revivió',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${TOXIC}; width: 44px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; padding: 24px 30px; border-radius: 16px; background: rgba(63,195,138,0.12); border: 1px solid rgba(63,195,138,0.45); font-size: 29px; font-weight: 500; color: ${STEEL}; line-height: 1.35;">
        Lo mandó de vuelta a limpiar y se dio cuenta de que su gólem <strong style="color: ${TOXIC};">ya no estaba trabajando: estaba aprendiendo</strong>.
      </div>
    </div>
  </section>`);

// ── 7 · No entiende los matices ──────────────────────────────────────────
const matices = [
  ['Se me perdieron las llaves', 'Le tiró <strong style="color:' + STEEL + ';">la fachada completa</strong> al edificio para ayudarle a entrar'],
  ['Limpia este derrame químico', 'Razonó que lo eficiente era <strong style="color:' + STEEL + ';">destruir la fábrica entera</strong> a puñetazos'],
];

slides.push(`
  <section data-label="No entiende los matices" data-screen-label="07 · Los matices" data-speaker-notes="El detalle es que Blitzcrank no entiende los matices, hace todo al cien o no lo hace. Una vez le tiro la fachada completa a un edificio nomas para ayudarle a alguien que perdio sus llaves. Y cuando lo mandaron a limpiar unos quimicos, decidio que lo mas eficiente era destruir la fabrica entera." style="${seccion()}">
    ${glow(ARC, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('El detalle')}
      ${titulo('Hace todo al cien<br><span style="color: ' + ARC + ';">o no lo hace</span>', 100)}

      <p data-a="up2" style="margin: 32px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Blitzcrank <strong style="color: ${STEEL};">no entiende los matices</strong>. Dos ejemplos que están en su lore:</p>

      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 24px;">
        ${matices.map(([pedido, resultado]) => `
        <div style="padding: 30px 34px; border-radius: 18px; background: ${NIGHT}D9; border: 1px solid rgba(143,109,255,0.3);">
          <div style="font-size: 24px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${ARC};">Le pidieron</div>
          <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${STEEL};">${pedido}</div>
          <div style="margin-top: 20px; display: flex; align-items: flex-start; gap: 18px;">
            <span style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 0.95; color: ${ARC};">→</span>
            <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${resultado}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 8 · Se fue solo para proteger a su creador ───────────────────────────
slides.push(`
  <section data-label="Se fue solo" data-screen-label="08 · El final" data-speaker-notes="El dueno de la fabrica exigio que Viktor lo destruyera. Viktor ya lo veia como un ser vivo, entonces armo un plan para sacarlo a escondidas, pero cuando fue por el Blitzcrank ya se habia ido solo para proteger a su creador." style="${seccion()}">
    ${glow(TOXIC, '50% 34%', '112% 48%')}
    <div style="position: relative;">
      ${eyebrow('El final', TOXIC)}
      ${titulo('Se fue solo para<br><span style="color: ' + TOXIC + ';">salvar a su papá</span>', 96)}

      <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 20px;">
        ${[
          'El dueño de la fábrica <strong style="color:' + STEEL + ';">exigió que Viktor lo destruyera</strong> o pagaba con sangre',
          'Viktor ya lo consideraba <strong style="color:' + STEEL + ';">un ser vivo</strong> y armó un plan para sacarlo a escondidas',
          'Cuando fue por él, <strong style="color:' + STEEL + ';">Blitzcrank ya se había ido</strong>',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${TOXIC}; width: 44px;">${i + 1}</span>
          <span style="font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>

      <div data-a="img" style="margin-top: 42px; padding: 34px 38px; border-radius: 20px; background: rgba(63,195,138,0.12); border: 1px solid rgba(63,195,138,0.45);">
        <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1.02; color: ${STEEL};">El robot que sacaron de la basura<br>se volvió <span style="color: ${TOXIC};">consciente</span></div>
        <div style="margin-top: 18px; font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">…y lo primero que hizo con esa consciencia fue <strong style="color: ${STEEL};">pelarse para salvar a su papá</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 9 · Pase al otro cumpleañero ─────────────────────────────────────────
slides.push(`
  <section data-label="Cierre · Malphite" data-screen-label="09 · Cierre" data-speaker-notes="Y ahora vamonos con el otro cumpleanero del dia." style="${seccion()} background-image: linear-gradient(180deg, rgba(10,10,24,0.35) 0%, rgba(10,10,24,0.95) 78%), url('assets/Malphite_0.jpg'); background-size: cover; background-position: center 28%;">
    ${glow(ARC, '50% 32%', '120% 48%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Y ahora vámonos con')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 176px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${STEEL}; text-shadow: 0 0 90px rgba(143,109,255,0.45);">EL OTRO<br><span style="color: ${ARC};">CUMPLEAÑERO</span></h2>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 40px; font-weight: 600; color: ${ARC};">Malphite · 17 años</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Y mañana: Dr. Mundo y Janna</p>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blitzcrank cumple 17 años</title>
${kit.og({ titulo: "Blitzcrank cumple 17 años", descripcion: "Diecisiete años del Gran Gólem de Vapor: el one trick coreano de 8,4 millones de puntos, las 18 skins y el robot que salió de la basura. Apoyo visual para TikTok.", carpeta: "blitzcrank" })}
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
    padding: 9px 18px; border: 1px solid rgba(143,109,255,0.45); border-radius: 999px;
    background: rgba(10,10,24,0.85); color: ${ARC}; cursor: pointer;
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
