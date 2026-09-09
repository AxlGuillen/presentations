// Generador de index.html — Caps, el jugador con más títulos del planeta
// Ejecutar: node caps/gen.js
//
// **No es Cumplelolero**: es un tributo de esports por su entrada al Hall of
// Legends. Mantiene el formato vertical de TikTok (banda 300/350, Bebas Neue)
// para que se vea de la misma casa, pero es serie aparte.
//
// **Encargo: priorizar gráfico sobre texto.** Son assets para el video, no un
// deck de lectura, así que cada lámina lleva UNA idea visual y el texto es el
// mínimo para anclarla. De ahí que casi todos los datos se cuenten contando
// cosas en pantalla en vez de escribiéndolas.
//
// Piezas de diseño:
//  · El motivo es **la copa** (`copa()`): un SVG de trofeo que se repite. Los
//    números grandes del deck no se escriben, se cuentan — 18 copas contra 10
//    en la comparativa con Faker, y 11 encendidas de 17 en la de los MVP.
//  · El Hall of Legends se cuenta con **las tres skins**: Ahri Leyenda
//    Inmortalizada es la de Faker y Kai'Sa la de Uzi. La de Caps es Tristana y
//    **sale el 10 de septiembre**, así que su tarjeta va en gris con la fecha:
//    el hueco es el dato.
//  · Los dos subcampeonatos de Worlds van en plata fría, el único bloque del
//    deck que no toca ni el escarlata ni el oro. El video vive de esa tensión.
//
// ⚠️ Dos cuidados que vienen de la investigación:
//   · **Fnatic ganó el primer Mundial de la historia, sin año.** La fuente dice
//     2013 y es un error: fue la Temporada 1, en 2011.
//   · **No decir que tiene el récord de pentakills de Europa.** Es de Ice con 9.
//     Los pentakills no salen en el deck porque el guion no los narra.
//
// ⚠️ El «11 de 17 MVP» sale del guion y del bloque de datos destacados de la
// investigación; su tabla de palmarés dice «MVP de final de LEC: 7». Manda el
// guion, que es la voz en off.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Caps: escenario, trofeos y el subcampeonato ───────────────────
// El oro está muy visto en el repo (lowelo, caras, talon), así que aquí NO es
// el acento: es solo el color de los trofeos. El acento es el escarlata de G2.
const BG = '#0A0709';        // negro de escenario
const G2 = '#FF2D55';        // escarlata de G2 — acento y remates
const ORO = '#F0C05A';       // oro: trofeos y Hall of Legends, nada más
const PLATA = '#93A4B8';     // frío: los dos subcampeonatos de Worlds
const BONE = '#F4F1EE';      // texto principal
const MUTED = '#8E868C';     // texto secundario
const PANEL = '#171114';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = G2, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = G2) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// ── La copa: el motivo del deck ──────────────────────────────────────────
// Los números del video son conteos de trofeos, así que en vez de escribirlos
// se dibujan. `lleno = false` deja la copa en contorno: sirve para pintar lo
// que NO pasó (los 6 títulos en los que no fue MVP) sin cambiar la forma.
const copa = (alto = 64, color = ORO, lleno = true, fluido = false) => {
  const w = Math.round(alto * (44 / 52));
  const relleno = lleno ? color : 'none';
  const trazo = lleno ? 'none' : color;
  const medida = fluido ? 'width: 100%; height: auto;' : `width: ${w}px; height: ${alto}px;`;
  return `<svg data-copa viewBox="0 0 44 52" style="flex: none; display: block; ${medida} ${lleno ? `filter: drop-shadow(0 0 ${Math.round(alto * 0.28)}px ${color}59);` : 'opacity: 0.5;'}" aria-hidden="true">
      <path d="M12 4 H32 V16 C32 23.7 27.5 28 22 28 C16.5 28 12 23.7 12 16 Z" fill="${relleno}" stroke="${trazo}" stroke-width="2.4"/>
      <path d="M12 8 H7.5 C5.4 8 4 9.6 4 12.2 C4 17 7.6 20.6 12 21.2" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" ${lleno ? '' : 'opacity="1"'}/>
      <path d="M32 8 H36.5 C38.6 8 40 9.6 40 12.2 C40 17 36.4 20.6 32 21.2" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M19.6 28 H24.4 V36 H19.6 Z" fill="${lleno ? color : 'none'}" stroke="${trazo}" stroke-width="2.4"/>
      <rect x="13" y="36" width="18" height="4.6" rx="1.4" fill="${relleno}" stroke="${trazo}" stroke-width="2.4"/>
      <rect x="9.5" y="42.4" width="25" height="5.6" rx="1.8" fill="${relleno}" stroke="${trazo}" stroke-width="2.4"/>
    </svg>`;
};

// Una hilera de copas que se cuentan solas. `encendidas` permite pintar las
// primeras N llenas y el resto en contorno.
const copas = (total, { color = ORO, encendidas = null, gap = 10, porFila = 9, ancho = 84 } = {}) => `
      <div data-copas style="display: grid; grid-template-columns: repeat(${porFila}, minmax(0, ${ancho}px)); justify-content: start; gap: ${gap}px;">
        ${Array.from({ length: total }, (_, i) =>
          `<span data-copa-slot style="display: block; min-width: 0;">${copa(Math.round(ancho * 52 / 44), color, encendidas === null || i < encendidas, true)}</span>`).join('')}
      </div>`;

const remate = (html, color = G2) => `
      <div data-remate style="margin-top: 30px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// Sin foto del jugador (no hay asset libre), así que el ancla visual es el
// muro de 18 copas detrás del titular: el dato del video es la portada.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Que rollo cabrones. Hoy les voy a hablar del jugador con mas campeonatos de liga de todo el planeta. Y no es coreano, es un danes de veintiseis anos." style="${seccion()}">
    <div data-muro style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.17; pointer-events: none;">
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); justify-items: center; gap: 30px; width: 880px;">
        ${Array.from({ length: 18 }, () => `<span style="display: block; width: 100%;">${copa(150, ORO, true, true)}</span>`).join('')}
      </div>
    </div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,7,9,0.72) 0%, rgba(10,7,9,0.35) 40%, rgba(10,7,9,0.92) 100%); pointer-events: none;"></div>
    ${glow(G2, '50% 42%', '120% 50%')}
    <div style="position: relative;">
      ${eyebrow('Hall of Legends · 18 ago 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 232px; font-weight: 400; line-height: 0.8; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 0 90px rgba(255,45,85,0.35);"><span data-linea style="display: block;">CAPS</span><span data-linea style="display: block; color: ${ORO}; font-size: 168px;">18 TÍTULOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 40px; font-weight: 600; color: ${G2}; line-height: 1.25;">El jugador con más campeonatos<br>de liga del planeta</p>
      <p data-sub style="margin: 14px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Y no es coreano. Es danés.</p>
    </div>
  </section>`);

// ── 2 · Quién es ─────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Quién es" data-screen-label="02 · Quién es" data-speaker-notes="Se llama Rasmus Winther pero ustedes lo conocen como Caps." style="${seccion()}">
    ${glow(G2, '50% 38%', '115% 52%')}
    <div style="position: relative;">
      ${eyebrow('Se llama Rasmus Winther')}
      ${titulo('Ustedes lo conocen<br>como <span style="color: ' + G2 + ';">Caps</span>', 100)}

      <div style="margin-top: 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        ${[
          ['26', 'años', 'nacido el 17 nov 1999', ORO],
          ['DK', 'Dinamarca', 'danés, no coreano', G2],
          ['MID', 'mid laner', '76 campeones jugados', BONE],
          ['G2', 'desde 2019', 'contrato hasta 2027', BONE],
        ].map(([cifra, pie, nota, color]) => `
        <div data-ficha style="padding: 26px 28px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.09);">
          <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${color};">${cifra}</div>
          <div style="margin-top: 4px; font-size: 25px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${pie}</div>
          <div style="margin-top: 2px; font-size: 22px; font-weight: 400; color: ${MUTED};">${nota}</div>
        </div>`).join('')}
      </div>

      ${remate('Su hermano también fue profesional: <strong style="color: ' + G2 + ';">de Dota 2</strong>. Les viene de familia.')}
    </div>
  </section>`);

// ── 3 · El Hall of Legends: tres, y el tercero es él ─────────────────────
// Se cuenta con las skins porque son el único retrato que existe de los tres.
// La de Caps todavía no sale, así que su tarjeta va en gris con la fecha: el
// hueco dice «apenas está pasando» mejor que cualquier frase.
const leyendas = [
  ['Ahri_86.jpg', 'FAKER', 'Corea · 2024', 'Ahri Leyenda Inmortalizada', 'center 18%', false],
  ['Kaisa_71.jpg', 'UZI', 'China · 2025', "Kai'Sa Leyenda Inmortalizada", 'center 20%', false],
  ['Tristana_0.jpg', 'CAPS', 'Europa · 2026', 'Tristana · sale el 10 de sep', 'center 26%', true],
];

slides.push(`
  <section data-label="Hall of Legends" data-screen-label="03 · Hall of Legends" data-speaker-notes="Hace unas semanas Riot lo metio al Hall of Legends, que es el salon de la fama del lolsito. Nada mas han entrado tres personas en la historia. Faker, Uzi, y ahora el. Y es el primer occidental en lograrlo." style="${seccion()}">
    ${glow(ORO, '50% 36%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('El salón de la fama del lolsito', ORO)}
      ${titulo('Han entrado <span style="color: ' + ORO + ';">tres</span><br>en toda la historia', 92)}

      <div style="margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
        ${leyendas.map(([img, quien, donde, skin, pos, esCaps], i) => `
        <div data-leyenda style="display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; border: 1px solid ${esCaps ? ORO + 'CC' : 'rgba(255,255,255,0.10)'}; background: ${PANEL}D9;">
          <div style="position: relative; height: 300px;">
            <img src="assets/${img}" alt="${skin}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block; ${esCaps ? 'filter: grayscale(1) brightness(0.55);' : ''}">
            <span style="position: absolute; top: 10px; left: 10px; font-family: ${DISPLAY}; font-size: 34px; line-height: 1; color: ${esCaps ? ORO : 'rgba(255,255,255,0.55)'};">0${i + 1}</span>
            ${esCaps ? `<span style="position: absolute; bottom: 10px; left: 10px; right: 10px; text-align: center; background: ${ORO}; color: ${BG}; font-size: 19px; font-weight: 800; letter-spacing: 1px; border-radius: 6px; padding: 5px 0;">10 SEP</span>` : ''}
          </div>
          <div style="padding: 14px 16px 18px;">
            <div style="font-family: ${DISPLAY}; font-size: 52px; line-height: 0.95; color: ${esCaps ? ORO : BONE};">${quien}</div>
            <div style="margin-top: 2px; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${donde}</div>
            <div style="margin-top: 6px; font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.25;">${skin}</div>
          </div>
        </div>`).join('')}
      </div>

      ${remate('Y es el <strong style="color: ' + ORO + ';">primer occidental</strong> en entrar.', ORO)}
    </div>
  </section>`);

// ── 4 · 18 contra 10 ─────────────────────────────────────────────────────
// El dato no se escribe: se cuenta. Dos hileras de copas a la misma escala.
slides.push(`
  <section data-label="18 contra 10" data-screen-label="04 · 18 vs Faker" data-speaker-notes="Y para que dimensionen de que tamano es este cabron, Caps tiene diecisiete titulos de la lec. Diecisiete. Sumandole uno que gano en la liga turca son dieciocho campeonatos de liga, y ese es el record mundial en cualquier region del planeta. Faker tiene diez." style="${seccion()}">
    ${glow(ORO, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Récord mundial, en cualquier región', ORO)}

      <div data-bloque style="margin-top: 8px;">
        <div style="display: flex; align-items: baseline; gap: 18px;">
          <span style="font-family: ${DISPLAY}; font-size: 120px; line-height: 0.9; color: ${ORO};">18</span>
          <span style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${BONE};">CAPS</span>
          <span style="font-size: 24px; font-weight: 600; color: ${MUTED};">17 de la LEC + 1 de la liga turca</span>
        </div>
        <div style="margin-top: 14px;">${copas(18, { ancho: 84, color: ORO, gap: 14 })}</div>
      </div>

      <div data-bloque style="margin-top: 44px; padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.10);">
        <div style="display: flex; align-items: baseline; gap: 18px;">
          <span style="font-family: ${DISPLAY}; font-size: 120px; line-height: 0.9; color: ${MUTED};">10</span>
          <span style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${MUTED};">FAKER</span>
          <span style="font-size: 24px; font-weight: 600; color: ${MUTED};">títulos de la LCK</span>
        </div>
        <div style="margin-top: 14px;">${copas(10, { ancho: 84, color: MUTED, gap: 14 })}</div>
      </div>
    </div>
  </section>`);

// ── 5 · Y Europa no está vacía ───────────────────────────────────────────
const europa = [
  ['CAPS', 17, true, 'G2 · el que manda'],
  ['BROKENBLADE', 11, false, 'su compañero actual'],
  ['MIKYX', 11, false, 'su excompañero'],
];

slides.push(`
  <section data-label="Europa no está vacía" data-screen-label="05 · Europa" data-speaker-notes="Y no es que Europa este vacia. El segundo lugar historico lo comparten BrokenBlade, que es su companero actual, y Mikyx, que fue su excompanero. Los dos tienen once. Caps les saca seis." style="${seccion()}">
    ${glow(G2, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y no es que Europa esté vacía')}
      ${titulo('Los segundos<br>tienen <span style="color: ' + G2 + ';">once</span>', 100)}

      <div style="margin-top: 44px; display: flex; flex-direction: column; gap: 26px;">
        ${europa.map(([quien, n, top, nota]) => `
        <div data-carril>
          <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${top ? ORO : BONE};">${quien}</span>
            <span style="font-size: 23px; font-weight: 600; color: ${MUTED};">${nota}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="flex: 1; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.05); overflow: hidden;">
              <div data-barra style="width: ${(n / 17 * 100).toFixed(1)}%; height: 100%; background: ${top ? ORO : 'rgba(255,255,255,0.20)'}; transform-origin: 0 50%;"></div>
            </div>
            <span style="flex: none; width: 84px; text-align: right; font-family: ${DISPLAY}; font-size: 66px; line-height: 1; color: ${top ? ORO : MUTED};">${n}</span>
          </div>
        </div>`).join('')}
      </div>

      ${remate('Les saca <strong style="color: ' + G2 + ';">seis campeonatos</strong> de ventaja.')}
    </div>
  </section>`);

// ── 6 · Once de diecisiete ───────────────────────────────────────────────
// Mismas copas de la lámina 4, ahora con seis en contorno: la proporción se ve
// antes de leer el 65%.
slides.push(`
  <section data-label="Once de diecisiete" data-screen-label="06 · MVP" data-speaker-notes="Y el dato que a mi me parece el mas cabron. De esos diecisiete titulos, en once fue el MVP de la final. O sea que en el sesenta y cinco por ciento de los campeonatos que gano, ademas fue el mejor de la cancha." style="${seccion()}">
    ${glow(ORO, '50% 40%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('El dato más cabrón', ORO)}
      ${titulo('En <span style="color: ' + ORO + ';">once</span> de sus diecisiete<br>fue el MVP de la final', 88)}

      <div style="margin-top: 46px;">${copas(17, { ancho: 88, color: ORO, encendidas: 11, gap: 15 })}</div>

      <div data-porcentaje style="margin-top: 46px; display: flex; align-items: center; gap: 32px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.82; color: ${ORO};"><span data-cuenta="65">65</span> %</div>
        </div>
        <div style="width: 2px; height: 110px; background: ${ORO}4D;"></div>
        <div style="flex: 1; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">De los campeonatos que ganó, <strong style="color: ${BONE};">además fue el mejor de la cancha</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 7 · El camino, y empezó desde abajo ──────────────────────────────────
const camino = [
  ['2015', 'Enigma Esports', 'gris'],
  ['2016', 'Inspire · E-corp · mousesports · Nerv', 'gris'],
  ['2016', 'Dark Passage · liga turca', 'oro'],
  ['2017', 'Fnatic · debuta en primera', 'blanco'],
  ['2019', 'G2 Esports', 'acento'],
];

slides.push(`
  <section data-label="El camino" data-screen-label="07 · El camino" data-speaker-notes="Pero no crean que llego ahi de a gratis. Caps empezo en dos mil quince y paso por seis equipos en dos anos antes de que alguien grande lo pelara. Su primer trofeo lo gano en la liga turca, y ahi fue MVP de la final. Y cuando por fin debuto en primera con Fnatic, su primer ano fue del monton, terceros en los dos splits." style="${seccion()}">
    ${glow(G2, '50% 38%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('No llegó ahí de a gratis')}
      ${titulo('<span style="color: ' + G2 + ';">Seis equipos</span><br>en dos años', 100)}

      <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 0;">
        ${camino.map(([anio, que, tono], i) => {
          const color = tono === 'oro' ? ORO : tono === 'acento' ? G2 : tono === 'blanco' ? BONE : MUTED;
          const fuerte = tono !== 'gris';
          return `
        <div data-paso style="display: flex; align-items: center; gap: 24px; padding: 16px 0;">
          <span style="flex: none; width: 118px; font-family: ${DISPLAY}; font-size: 52px; line-height: 1; color: ${color};">${anio}</span>
          <span style="flex: none; width: 18px; height: 18px; border-radius: 50%; background: ${fuerte ? color : 'transparent'}; border: 3px solid ${color}; box-sizing: border-box;"></span>
          <span style="flex: 1; font-size: ${fuerte ? 30 : 26}px; font-weight: ${fuerte ? 700 : 400}; color: ${fuerte ? BONE : MUTED}; line-height: 1.25;">${que}</span>
          ${tono === 'oro' ? copa(46, ORO, true) : ''}
        </div>${i < camino.length - 1 ? `<div style="width: 3px; height: 18px; background: rgba(255,255,255,0.14); margin-left: 149px;"></div>` : ''}`;
        }).join('')}
      </div>

      ${remate('Su primer trofeo fue <strong style="color: ' + ORO + ';">en la liga turca</strong>, y ahí ya fue MVP de la final.', ORO)}
    </div>
  </section>`);

// ── 8 · Nunca ganó un mundial ────────────────────────────────────────────
// La lámina del video. Es la única del deck en plata: ni escarlata ni oro,
// porque no hay nada que celebrar. Los dos 0–3 se ven idénticos a propósito.
const finales = [
  ['2018', 'FNATIC', 'Invictus Gaming', 'FNC'],
  ['2019', 'G2 ESPORTS', 'FunPlus Phoenix', 'G2'],
];

slides.push(`
  <section data-label="Nunca ganó un mundial" data-screen-label="08 · El pero" data-speaker-notes="Ahora, aqui esta la parte que hace que su historia no sea perfecta. Caps nunca ha ganado un mundial. Y no es que no haya llegado. Llego a la final dos anos seguidos, en dos mil dieciocho con Fnatic y en dos mil diecinueve con G2. Perdio las dos. Y las dos por cero a tres, sin ganar un solo mapa. Es el primer europeo en lograr esa hazana tan triste." style="${seccion()}">
    ${glow(PLATA, '50% 40%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y aquí está el pero', PLATA)}
      ${titulo('Nunca ha ganado<br><span style="color: ' + PLATA + ';">un mundial</span>', 104)}

      <div style="margin-top: 42px; display: flex; flex-direction: column; gap: 20px;">
        ${finales.map(([anio, equipo, rival, corto]) => `
        <div data-final style="display: flex; align-items: center; gap: 28px; padding: 34px 34px; border-radius: 20px; background: rgba(147,176,184,0.07); border: 1px solid ${PLATA}4D;">
          <div style="flex: none; text-align: center;">
            <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 0.95; color: ${PLATA};">${anio}</div>
            <div style="font-size: 19px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">final</div>
          </div>
          <div style="width: 2px; height: 84px; background: ${PLATA}40;"></div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 30px; font-weight: 700; color: ${BONE};">${equipo}</div>
            <div style="margin-top: 2px; font-size: 24px; font-weight: 400; color: ${MUTED};">contra ${rival}</div>
          </div>
          <div style="flex: none; font-family: ${DISPLAY}; font-size: 132px; line-height: 0.86; color: ${PLATA};">0<span style="color: ${MUTED};">–</span>3</div>
        </div>`).join('')}
      </div>

      ${remate('Dos finales seguidas, <strong style="color: ' + BONE + ';">sin ganar un solo mapa</strong>. El primer europeo en lograr esa hazaña tan triste.', PLATA)}
    </div>
  </section>`);

// ── 9 · Lo que sí ganó: el MSI de 2019 ───────────────────────────────────
slides.push(`
  <section data-label="El MSI de 2019" data-screen-label="09 · El MSI" data-speaker-notes="Lo que si gano fue el MSI de dos mil diecinueve, y ojo con esto, porque en semifinales le gano al equipo de Faker y en la final barrio tres a cero a Team Liquid. Ese fue el primer titulo internacional de Europa desde que Fnatic gano el primer mundial de la historia. Y la primera vez que un equipo que no era asiatico ganaba el MSI. Y un detalle que casi nadie sabe. Su papa lo acompanaba a los eventos grandes cuando estaba empezando. Se avento hasta Vietnam y Taiwan nomas para ver a su hijo ganar ese MSI." style="${seccion()}">
    ${glow(ORO, '50% 34%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('Lo que sí ganó', ORO)}

      <div data-msi style="display: flex; align-items: center; gap: 34px;">
        ${copa(230, ORO, true)}
        <div style="flex: 1; min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 118px; line-height: 0.86; color: ${BONE};">MSI<br><span style="color: ${ORO};">2019</span></div>
          <div style="margin-top: 10px; font-size: 28px; font-weight: 500; color: ${MUTED}; line-height: 1.3;">Y fue <strong style="color: ${BONE};">MVP de la final</strong>.</div>
        </div>
      </div>

      <div style="margin-top: 38px; display: flex; flex-direction: column; gap: 16px;">
        ${[
          ['SEMIFINAL', 'Le ganó al equipo de <strong style="color: ' + BONE + ';">Faker</strong>', 'SKT'],
          ['FINAL', 'Barrió a Team Liquid', '3–0'],
        ].map(([fase, texto, marcador]) => `
        <div data-ronda style="display: flex; align-items: center; gap: 22px; padding: 22px 28px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(240,192,90,0.28);">
          <span style="flex: none; width: 154px; font-size: 21px; font-weight: 800; letter-spacing: 2px; color: ${MUTED};">${fase}</span>
          <span style="flex: 1; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.3;">${texto}</span>
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${ORO};">${marcador}</span>
        </div>`).join('')}
      </div>

      <div data-papa style="margin-top: 30px; padding: 26px 32px; border-radius: 18px; background: ${G2}1A; border-left: 6px solid ${G2}; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Su papá se aventó hasta <strong style="color: ${BONE};">Vietnam y Taiwán</strong> nomás para verlo ganar ese MSI.</div>
    </div>
  </section>`);

// ── 10 · La skin, y la duda ──────────────────────────────────────────────
// El top 5 se pinta con las pantallas de carga: son retratos verticales y caben
// cinco en fila. Tristana va aparte y en gris, que es justo el dato.
const top5 = [
  ['carga-Leblanc.jpg', 'LeBlanc', '68,9%'],
  ['carga-Orianna.jpg', 'Orianna', '68,3%'],
  ['carga-Azir.jpg', 'Azir', '64,3%'],
  ['carga-Syndra.jpg', 'Syndra', '67,9%'],
  ['carga-Ryze.jpg', 'Ryze', '66,7%'],
];

slides.push(`
  <section data-label="La skin" data-screen-label="10 · La skin" data-speaker-notes="Y por todo eso Riot le hizo su skin, que es la de Tristana. Aunque a mi me da curiosidad esa eleccion, porque Tristana ni siquiera esta en su top cinco de campeones. Sus favoritos son LeBlanc, Orianna, Azir, Syndra y Ryze. Si alguien sabe por que escogio Tristana, diganmelo en comentarios." style="${seccion()}">
    ${glow(G2, '50% 34%', '115% 52%')}
    <div style="position: relative;">
      ${eyebrow('Riot le hizo su skin')}
      ${titulo('Y es de <span style="color: ' + G2 + ';">Tristana</span>', 100)}

      <div data-trista style="margin-top: 30px; display: flex; align-items: center; gap: 26px; padding: 20px 26px; border-radius: 18px; background: ${G2}14; border: 1px solid ${G2}66;">
        <img src="assets/carga-Tristana.jpg" alt="Tristana" style="width: 130px; height: 168px; object-fit: cover; object-position: center 18%; border-radius: 12px; flex: none; filter: grayscale(0.15);">
        <div style="flex: 1; min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 0.98; color: ${BONE};">Y ni siquiera está<br><span style="color: ${G2};">en su top cinco</span></div>
        </div>
      </div>

      <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;">
        ${top5.map(([img, nombre, wr], i) => `
          <div data-top style="display: flex; flex-direction: column; gap: 8px;">
            <div style="position: relative;">
              <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 244px; object-fit: cover; object-position: center 16%; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: block;">
              <span style="position: absolute; top: 8px; left: 8px; font-family: ${DISPLAY}; font-size: 34px; line-height: 1; color: ${ORO};">${i + 1}</span>
            </div>
            <div style="font-size: 21px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            <div style="font-size: 19px; font-weight: 600; color: ${MUTED};">${wr} WR</div>
          </div>`).join('')}
      </div>

      ${remate('¿Alguien sabe por qué escogió Tristana? <strong style="color: ' + G2 + ';">Díganmelo en comentarios.</strong>')}
    </div>
  </section>`);

// ── 11 · Los apodos ──────────────────────────────────────────────────────
const apodos = [
  ['CLAPS', 'cuando juega bien', G2],
  ['CRAPS', 'cuando juega mal', MUTED],
  ['BABY FAKER', 'se lo pusieron los coreanos', ORO],
  ['EL REY DE LAS GORRAS', 'en China · caps = gorras', BONE],
];

slides.push(`
  <section data-label="Los apodos" data-screen-label="11 · Los apodos" data-speaker-notes="Y les dejo lo mejor al final. A Caps le dicen Claps cuando juega bien y Craps cuando juega mal, asi, dependiendo del dia. Los coreanos le pusieron Baby Faker. Y en China le dicen el Rey de las Gorras, porque caps en ingles son gorras." style="${seccion()}">
    ${glow(G2, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Y les dejo lo mejor al final')}

      <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 26px;">
        ${apodos.map(([apodo, nota, color]) => `
        <div data-apodo>
          <div style="font-family: ${DISPLAY}; font-size: ${apodo.length > 12 ? 96 : 130}px; line-height: 0.88; letter-spacing: 1px; color: ${color};">${apodo}</div>
          <div style="margin-top: 4px; font-size: 27px; font-weight: 500; color: ${MUTED};">${nota}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 12 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="12 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${glow(ORO, '50% 38%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Primer occidental en el Hall of Legends', ORO)}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 150px; font-weight: 400; line-height: 0.88; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">18 títulos,<br><span style="color: ${PLATA};">cero mundiales</span></h2>
      <div style="margin-top: 44px;">${copas(6, { ancho: 92, color: ORO, gap: 18, porFila: 6 })}</div>
      <div data-gigi style="margin-top: 52px; font-family: ${DISPLAY}; font-size: 110px; line-height: 1.0; color: ${G2};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  function cuentaSimple(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 0.9, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v));
    } }, pos || 0);
  }

  // Las copas siempre entran igual: caen una tras otra con un rebote corto.
  // Es el motivo del deck, y es lo que hace que el número se cuente solo.
  function trofeos(tl, s, pos, sel) {
    var c = q(s, sel || '[data-copa-slot]');
    if (c.length) tl.from(c, { y: 26, scale: 0.5, opacity: 0, duration: 0.34, stagger: 0.045, ease: 'back.out(2.4)' }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-muro]'), { scale: 0.9, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.1)
      .from(q(s, '[data-linea]'), { y: 56, opacity: 0, duration: 0.8, stagger: 0.14 }, 0.24)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.72);
  });

  animar('Quién es', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-ficha]'), { y: 28, scale: 0.95, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.32)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 0.92);
  });

  // Las tres tarjetas entran en orden: Faker, Uzi y al final Caps, que es el
  // que importa. Por eso la última llega sola y un poco después.
  animar('Hall of Legends', function (tl, s) {
    var l = q(s, '[data-leyenda]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from([l[0], l[1]], { y: 34, opacity: 0, duration: 0.55, stagger: 0.14 }, 0.34)
      .from(l[2], { y: 34, scale: 0.94, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.86)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.28);
  });

  // Las 18 caen primero y las 10 después: la comparación tiene que verse en
  // ese orden o el remate se pierde.
  animar('18 contra 10', function (tl, s) {
    var b = q(s, '[data-bloque]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(b[0], { y: 24, opacity: 0, duration: 0.45 }, 0.1)
      .from(b[1], { y: 24, opacity: 0, duration: 0.45 }, 0.92);
    trofeos(tl, b[0], 0.24);
    trofeos(tl, b[1], 1.02);
  });

  animar('Europa no está vacía', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-carril]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.12 }, 0.34)
      .from(q(s, '[data-barra]'), { scaleX: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.12 }, 0.42)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.24);
  });

  // Aquí las 17 caen todas juntas y el 65% sube al final: primero se ve la
  // proporción, después se lee la cifra.
  animar('Once de diecisiete', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1);
    trofeos(tl, s, 0.34);
    tl.from(s.querySelector('[data-porcentaje]'), { y: 26, opacity: 0, duration: 0.55 }, 1.14);
    cuentaSimple(tl, s.querySelector('[data-cuenta]'), 1.16, 0.6);
  });

  animar('El camino', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-paso]'), { x: 30, opacity: 0, duration: 0.42, stagger: 0.11 }, 0.34)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.06);
  });

  // Los dos 0–3 entran con el mismo tiempo y la misma forma: son el mismo
  // golpe dos veces, y eso es justo lo que cuenta la lámina.
  animar('Nunca ganó un mundial', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.65 }, 0.1)
      .from(q(s, '[data-final]'), { x: -34, opacity: 0, duration: 0.55, stagger: 0.28 }, 0.42)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.28);
  });

  animar('El MSI de 2019', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-msi]'), { y: 30, opacity: 0, duration: 0.6 }, 0.12)
      .from(s.querySelector('[data-msi] svg'), { scale: 0.5, rotation: -12, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, 0.16)
      .from(q(s, '[data-ronda]'), { x: 30, opacity: 0, duration: 0.5, stagger: 0.14 }, 0.66)
      .from(s.querySelector('[data-papa]'), { y: 24, opacity: 0, duration: 0.55 }, 1.12);
  });

  animar('La skin', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-trista]'), { x: -30, opacity: 0, duration: 0.55 }, 0.32)
      .from(q(s, '[data-top]'), { y: 28, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.08 }, 0.62)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.18);
  });

  // Claps y Craps entran seguidas y a la misma altura: el chiste es que son la
  // misma palabra con una letra cambiada.
  animar('Los apodos', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-apodo]'), { x: 36, opacity: 0, duration: 0.46, stagger: 0.16 }, 0.16);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22);
    trofeos(tl, s, 0.72);
    tl.from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 1.12);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Caps · el jugador con más títulos del planeta</title>
${kit.og({ titulo: "Caps · el jugador con más títulos del planeta", descripcion: "Dieciocho campeonatos de liga, más que cualquier jugador de cualquier región, primer occidental en el Hall of Legends — y dos finales de mundial perdidas 0–3. Apoyo visual para TikTok.", carpeta: "caps" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,45,85,0.45); border-radius: 999px;
    background: rgba(10,7,9,0.85); color: ${G2}; cursor: pointer;
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
