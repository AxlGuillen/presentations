// Generador de index.html — «¿Por qué siempre ganan chinos y coreanos?» (láminas para el montaje automático)
// Ejecutar: node creator/ganan/gen.js   ·   clips: node tools/laminas.mjs creator/ganan
//
// Video del canal Axelsine (02/11/2026), mismo formato que elise y lux: cada lámina
// es un miniclip para el **panel de 1080×1370** (`crop=1080:1370:0:275`) que va abajo
// del gameplay del prereel. Todo lo importante vive dentro de `PANEL`.
//
// DISEÑO (2/11/2026, a pedido de Axl): la identidad de **Worlds 2026** — azul eléctrico
// sobre negro azulado con el resplandor del horizonte de su key art, plata para el texto
// (la tipografía del «WORLDS 26» es un condensado pesado: Anton es lo más cercano) y
// cian de acento — y **la Copa del Invocador oficial** (la tercera edición, que Riot
// presentó en el Worlds 2025 y sigue siendo la vigente) con los **logos de los equipos**
// como piezas. Los assets salen de lolesports.com (logos, escudo del Worlds) y de
// Dot Esports (foto oficial de la copa sobre negro, que se mezcla con `screen`).
//
// Criterio de jinx: el único texto es el dato (años, conteos, porcentajes, nombres de
// jugadores, códigos de equipo y de región). Sin cejas, chips, citas ni remates. Sin
// capturas de medios ni arte de jugadores.
//
// ⚠️ Es un video de DUDA, no de afirmación: las láminas de hipótesis usan «?» o un
// trazo a medias, nunca una X definitiva.
// ⚠️ Códigos de región (KR, CN, TW, EU, NA), no banderas. Sin dinero en pantalla.
// ⚠️ `gan-academias`: en Europa solo van los cuatro equipos con nombre (KOI, KC, HRTS
// encendidos y VIT que se apaga). No se inventan casillas vacías.
// ⚠️ Ningún clip arranca en negro: el fondo se ve desde el cuadro 0.
// ⚠️ Logos de campeones antiguos: SKT (2013, 2015, 2016), Samsung White (2014) y Samsung
// Galaxy (2017) son los de lolesports; **2020 (DWG KIA) usa el logo de Dplus KIA**, su
// organización de hoy, porque lolesports no trae el de DWG. Samsung va aclarado con un
// filtro: su logo es verde oscuro y sobre la ficha azul casi no se ve.
//
// Fuente: 2026-11-02_por-que-siempre-ganan-chinos-y-coreanos.md (PKB, secciones 4 a 6).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Paleta: Worlds 2026 ──────────────────────────────────────────────────
const BG = '#02031C';          // negro azulado de su key art
const ELEC = '#1B3BFF';        // azul eléctrico del resplandor
const LUZ = '#6895FF';         // el azul claro del horizonte
const PLATA = '#DDDDDD';       // el gris plata del «WORLDS 26»
const CIAN = '#2BD8E6';        // acento (Pick'Ems y detalles de la marca)
const APAGADO = '#4A5688';     // lo sin dato o lo que se apaga
const REG = { KR: '#4D6BFF', CN: CIAN, TW: '#F2F4FF', EU: '#9AA7D9' };

const DISPLAY = `'Anton', Impact, sans-serif`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };

// ── Piezas comunes ───────────────────────────────────────────────────────
function prng(semilla) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SECCION = `background: ${BG}; color: ${PLATA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// El mundo del key art: negro azulado arriba, el horizonte eléctrico abajo con su línea de
// luz, un haz en diagonal y una viñeta. Todo con data-fondo para sacarlo con --alfa.
const mundo = (haz = 1) => {
  const fondoY = PANEL.top + PANEL.h; // el borde de abajo del panel
  return `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, ${BG} 0, ${BG} ${PANEL.top}px, #040A44 ${PANEL.top + 700}px, #0A1FA8 ${fondoY - 60}px, #0A22C8 ${fondoY + 40}px, ${BG} 100%);"></div>
    <div data-fondo style="position: absolute; left: -300px; right: -300px; top: ${fondoY - 360}px; height: 620px; pointer-events: none; background: radial-gradient(50% 50% at 50% 55%, ${a(LUZ, 0.75)}, ${a(ELEC, 0.45)} 38%, ${a(ELEC, 0)} 72%);"></div>
    <div data-fondo data-horizonte style="position: absolute; left: 0; right: 0; top: ${fondoY - 95}px; height: 4px; pointer-events: none; background: linear-gradient(90deg, ${a('#FFFFFF', 0)}, ${a('#FFFFFF', 0.85)} 50%, ${a('#FFFFFF', 0)}); filter: blur(1.5px); box-shadow: 0 0 40px 8px ${a(LUZ, 0.7)};"></div>
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;"><div data-haz style="position: absolute; left: -200px; top: ${PANEL.top - 200}px; width: 520px; height: 1900px; transform: rotate(22deg); transform-origin: 0 0; background: linear-gradient(90deg, ${a('#FFFFFF', 0)}, ${a('#9DB4FF', 0.12 * haz)} 50%, ${a('#FFFFFF', 0)}); filter: blur(6px);"></div></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(1,2,16,0.8) 100%);"></div>`;
};

// Líneas de flujo desenfocadas que derivan (el viento de fondo), en azul y plata.
const flujo = (semilla, opacidad = 0.3) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-humo style="position: absolute; inset: -60px; filter: blur(5px); mix-blend-mode: screen; opacity: ${opacidad};">
        ${kit.patron('flujo', { ancho: 1200, alto: 2040, paleta: [LUZ, ELEC, PLATA], semilla, lineas: 50, pasos: 80, paso: 10, grosor: 5, escala: 0.0011, opacidad: 0.5, estilo: 'width:100%;height:100%' })}
      </div>
    </div>`;

// Motas que suben: plata y cian.
const motas = (semilla, n = 20) => {
  const r = prng(semilla);
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = Math.round(30 + r() * 1020), y = Math.round(PANEL.top + 60 + r() * (PANEL.h - 120));
    const t = (3 + r() * 6).toFixed(1), q = r(), col = q < 0.65 ? '#FFFFFF' : CIAN, op = (0.28 + r() * 0.45).toFixed(2);
    h += `<span data-brasa style="position: absolute; left: ${x}px; top: ${y}px; width: ${t}px; height: ${t}px; border-radius: 50%; background: ${col}; opacity: ${op}; box-shadow: 0 0 ${t * 3}px ${col}; pointer-events: none;"></span>`;
  }
  return `<div data-fondo style="position: absolute; inset: 0; pointer-events: none;">${h}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;

const lamina = (id, notas, cuerpo, extraSeccion = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION} ${extraSeccion}">${cuerpo}
  </section>`;

// El escudo del Worlds, muy tenue, detrás de lo que importa.
const escudo = (x, y, w, op = 0.07) => `<img data-fondo data-escudo src="assets/escudo.png" alt="" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; opacity: ${op}; pointer-events: none; mix-blend-mode: screen;">`;

// Una ficha de cristal con el logo del equipo y el color de su región en el borde.
// Samsung (verde oscuro) va aclarado: sobre el azul no se leería.
const CLARO = new Set(['SSW', 'SSG']);
function ficha({ logo, color, x, y, w, h = w, lado = 0.62, abajo = 0, attrs = '', extra = '', radio = 22, op = 1 }) {
  const filtro = CLARO.has(logo) ? 'brightness(2.1) saturate(1.25) contrast(0.95)' : '';
  return `<div ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; border-radius: ${radio}px; box-sizing: border-box; opacity: ${op}; background: linear-gradient(160deg, ${a('#5C7BFF', 0.3)}, ${a('#050B46', 0.9)} 70%); border: 2px solid ${a(color, 0.9)}; box-shadow: 0 0 34px ${a(color, 0.45)}, inset 0 0 34px ${a(color, 0.16)}, 0 14px 30px rgba(0,0,12,0.6); display: flex; align-items: center; justify-content: center;">
        <img src="assets/logos/${logo}.png" alt="${logo}" style="width: ${lado * 100}%; height: ${lado * 100 - abajo}%; object-fit: contain; margin-bottom: ${abajo}%; filter: ${filtro} drop-shadow(0 4px 12px rgba(0,0,10,0.55)); display: block;">${extra}
      </div>`;
}
const birrete = (c, tam = 36) => `<svg viewBox="0 0 64 64" width="${tam}" height="${tam}" style="display: block;" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 12 L60 26 L32 40 L4 26 Z"/><path d="M16 33 V46 C16 50 24 54 32 54 C40 54 48 50 48 46 V33"/><path d="M60 26 V42"/></svg>`;

const slides = [];

// ── gan-portada ──────────────────────────────────────────────────────────
// La Copa del Invocador oficial al centro, con el escudo del Worlds detrás; a los lados
// dos zonas encendidas con los logos de los equipos: coreanos a la izquierda, chinos a la
// derecha. Entra con un empuje lento y un haz de luz cruza la copa.
const KR4 = ['T1', 'GEN', 'HLE', 'DK'], CN4 = ['BLG', 'TES', 'IG', 'AL'];
const lateral = (logos, color, x) => logos.map((l, i) => ficha({ logo: l, color, x, y: 150 + i * 175, w: 130, h: 150, lado: 0.66, attrs: `data-lado data-lado-${x < 500 ? 'kr' : 'cn'}` })).join('\n      ');
slides.push(lamina('gan-portada', 'Koi se fue eliminado del mundial pero Ibai ya había tirado un facto como una casa.', `
    ${mundo(1.4)}
    ${flujo(11, 0.3)}
    ${motas(101, 22)}
    ${panel(`
      ${escudo(90, 40, 900, 0.07)}
      <div data-zona-kr data-fondo style="position: absolute; left: -330px; top: 90px; width: 720px; height: 960px; border-radius: 50%; background: radial-gradient(closest-side, ${a(REG.KR, 0.55)}, ${a(ELEC, 0)} 100%); filter: blur(24px);"></div>
      <div data-zona-cn data-fondo style="position: absolute; left: 690px; top: 90px; width: 720px; height: 960px; border-radius: 50%; background: radial-gradient(closest-side, ${a(CIAN, 0.45)}, ${a(CIAN, 0)} 100%); filter: blur(24px);"></div>
      <div style="position: absolute; left: 0; top: 0; width: 1080px; height: 1370px;">
        <img data-copa src="assets/copa.jpg" alt="Copa del Invocador" style="position: absolute; left: ${(1080 - 810) / 2}px; top: 10px; width: 810px; height: auto; mix-blend-mode: screen; -webkit-mask-image: radial-gradient(70% 62% at 50% 52%, #000 62%, transparent 100%); mask-image: radial-gradient(70% 62% at 50% 52%, #000 62%, transparent 100%); filter: drop-shadow(0 0 40px ${a(LUZ, 0.35)});">
        <div data-barrido data-fondo style="position: absolute; left: -300px; top: -100px; width: 220px; height: 1250px; transform: rotate(18deg); background: linear-gradient(90deg, ${a('#FFFFFF', 0)}, ${a('#FFFFFF', 0.45)} 50%, ${a('#FFFFFF', 0)}); mix-blend-mode: screen; filter: blur(8px); opacity: 0;"></div>
      </div>
      ${lateral(KR4, REG.KR, 24)}
      ${lateral(CN4, REG.CN, 926)}
      <div data-pregunta style="position: absolute; left: 0; right: 0; top: 1050px; text-align: center; font-size: 222px; line-height: 1; letter-spacing: 3px; white-space: nowrap;">${'¿SIEMPRE?'.split('').map(c => `<span data-letra class="plata" style="display: inline-block;">${c}</span>`).join('')}</div>`)}`));

// ── gan-palmares ─────────────────────────────────────────────────────────
// Quince Mundiales (2011-2025): una ficha por año con el logo del campeón y el color de su
// región en el borde. Fuente: Wikipedia (🟢). Corea 10, China 3, Taiwán 1, Europa 1.
// Norteamérica: sin marca.
const PALMARES = [
  [2011, 'EU', 'FNC'], [2012, 'TW', 'TPA'], [2013, 'KR', 'SKT'], [2014, 'KR', 'SSW'], [2015, 'KR', 'SKT'],
  [2016, 'KR', 'SKT'], [2017, 'KR', 'SSG'], [2018, 'CN', 'IG'], [2019, 'CN', 'FPX'], [2020, 'KR', 'DK'],
  [2021, 'CN', 'EDG'], [2022, 'KR', 'DRX'], [2023, 'KR', 'T1'], [2024, 'KR', 'T1'], [2025, 'KR', 'T1'],
];
const CW = 180, CG = 20, CX0 = (1080 - (5 * CW + 4 * CG)) / 2, CY0 = 40;
const fichasPalmares = PALMARES.map(([anio, reg, logo], i) => {
  const c = i % 5, f = Math.floor(i / 5);
  return ficha({
    logo, color: REG[reg], x: CX0 + c * (CW + CG), y: CY0 + f * (CW + CG), w: CW, h: CW, lado: 0.62, abajo: 18, attrs: `data-ficha data-reg="${reg}"`,
    extra: `<span style="position: absolute; left: 0; right: 0; bottom: 9px; text-align: center; font-size: 44px; line-height: 1; letter-spacing: 2px; color: ${PLATA}; text-shadow: 0 2px 10px rgba(0,0,10,0.9);">${anio}</span>`,
  });
}).join('\n      ');
const CONTEO = [['10', 'KR', 10], ['3', 'CN', 3], ['1', 'TW', 1], ['1', 'EU', 1]];
const NANCHOS = [340, 230, 200, 200], NX = [50, 400, 640, 850], NY = 740;
const conteos = CONTEO.map(([n, cod, v], i) => `
      <div data-conteo style="position: absolute; left: ${NX[i]}px; top: ${NY}px; width: ${NANCHOS[i]}px; text-align: center;">
        <div data-num class="plata" data-v="${v}" style="font-size: 330px; line-height: 0.95;">${n}</div>
        <div style="margin: 6px auto 0; width: ${i === 0 ? 220 : 150}px; height: 14px; border-radius: 7px; background: ${REG[cod]}; box-shadow: 0 0 26px ${a(REG[cod], 0.8)};"></div>
        <div style="margin-top: 12px; font-size: 104px; line-height: 1; letter-spacing: 6px; padding-left: 6px; color: ${PLATA};">${cod}</div>
      </div>`).join('');
slides.push(lamina('gan-palmares', 'Los coreanos tienen diez mundiales, el segundo puesto se lo lleva china con tres, y luego Taiwán y Europa con uno cada uno.', `
    ${mundo(1)}
    ${flujo(23, 0.26)}
    ${motas(202, 16)}
    ${panel(`
      ${escudo(300, 700, 480, 0.06)}
      ${fichasPalmares}
      ${conteos}`)}`));

// ── gan-academias ────────────────────────────────────────────────────────
// Corea: los 10 equipos de la liga, todos con academia (encendidos). Europa: SOLO los cuatro
// equipos con nombre (KOI, KC y HRTS encendidos, VIT que se apaga). Sin casillas «vacías».
const LCK10 = ['T1', 'GEN', 'HLE', 'DK', 'KT', 'DRX', 'BFX', 'NS', 'DNS', 'BRO'];
const KW = 170, KG = 16, KX0 = (1080 - (5 * KW + 4 * KG)) / 2;
const fichasKR = LCK10.map((l, i) => {
  const c = i % 5, f = Math.floor(i / 5);
  return ficha({ logo: l, color: REG.KR, x: KX0 + c * (KW + KG), y: 214 + f * (KW + KG), w: KW, h: KW, lado: 0.6, attrs: 'data-ficha-kr',
    extra: `<span style="position: absolute; right: 9px; top: 9px; opacity: 0.9;">${birrete(PLATA, 30)}</span>` });
}).join('\n      ');
const EU4 = [['KOI', 'MKOI', true], ['KC', 'KC', true], ['HRTS', 'TH', true], ['VIT', 'VIT', false]];
const EW = 214, EG = 19, EX0 = (1080 - (4 * EW + 3 * EG)) / 2, EY = 830;
const fichasEU = EU4.map(([cod, logo, vivo], i) => ficha({
  logo, color: REG.EU, x: EX0 + i * (EW + EG), y: EY, w: EW, h: 360, lado: 0.56, abajo: 22, radio: 24,
  attrs: `data-ficha-eu ${vivo ? '' : 'data-apaga'}`,
  extra: `<span data-cod style="position: absolute; left: 0; right: 0; bottom: 56px; text-align: center; font-size: ${cod.length > 3 ? 70 : 92}px; line-height: 1; letter-spacing: 3px; color: ${PLATA};">${cod}</span><span data-icono style="position: absolute; left: 0; right: 0; bottom: 14px; display: flex; justify-content: center;">${birrete(PLATA, 34)}</span>`,
})).join('\n      ');
slides.push(lamina('gan-academias', 'Y aquí sí hay una pista, porque en Corea todos los equipos tienen academia, y en otros servidores como Europa no es obligatorio. Algunos la mantienen, como Movistar Koi, Karmin y Heretics, y Vitality cerró la suya hace unas semanas.', `
    ${mundo(1)}
    ${flujo(37, 0.24)}
    ${motas(303, 14)}
    ${panel(`
      ${escudo(340, 380, 400, 0.05)}
      <div data-et-kr class="plata" style="position: absolute; left: 60px; top: 24px; font-size: 130px; line-height: 1; letter-spacing: 6px;">KR</div>
      <div data-kr-total class="plata" style="position: absolute; right: 60px; top: 8px; font-size: 190px; line-height: 1; white-space: nowrap;"><span data-kr-n>10</span>/10</div>
      ${fichasKR}
      <div data-linea style="position: absolute; left: 60px; right: 60px; top: 640px; height: 3px; border-radius: 2px; background: linear-gradient(90deg, ${a('#FFFFFF', 0)}, ${a('#FFFFFF', 0.7)} 20%, ${a('#FFFFFF', 0.7)} 80%, ${a('#FFFFFF', 0)}); box-shadow: 0 0 20px ${a(LUZ, 0.7)};"></div>
      <div data-et-eu class="plata" style="position: absolute; left: 60px; top: 672px; font-size: 130px; line-height: 1; letter-spacing: 6px;">EU</div>
      ${fichasEU}`)}`));

// ═══ LÁMINAS 3 A 22 ═══════════════════════════════════════════════════════
// Mismas reglas: panel 1080×1370, fondo desde el cuadro 0, el único texto es el dato.
// ⚠️ La copa va con `mix-blend-mode: screen` sobre su foto negra: **ningún ancestro de
// una copa puede llevar transform** (GSAP deja `transform: translate(0,0)` y eso aísla la
// mezcla: la copa saldría con un rectángulo negro). Por eso las copas se animan solas, y por
// eso el `sello` de las láminas con copa va con `temblor: 'no'`: su temblor mueve el padre, que
// aquí es el panel entero (le pasó a gan-lcs y gan-matiz).
const copaImg = ({ x, y, w, attrs = '', filtro = '', op = 1, src = 'copa' }) => `<img ${attrs} src="assets/${src}.jpg" alt="Copa del Invocador" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: auto; mix-blend-mode: screen; opacity: ${op}; -webkit-mask-image: radial-gradient(70% 62% at 50% 52%, #000 62%, transparent 100%); mask-image: radial-gradient(70% 62% at 50% 52%, #000 62%, transparent 100%); ${filtro ? `filter: ${filtro};` : ''}">`;
const ic = (n, tam, color, trazo = 2) => kit.icono(n, { tam, color, trazo });
const grad = (c, c2) => `linear-gradient(180deg, ${c2 || a('#FFFFFF', 0.35)} 0%, ${c} 45%, ${a(c, 0.72)} 100%)`;
const texto = (txt, { x, y, w, size, color, clase = 'plata', attrs = '', extra = '' }) =>
  `<div ${attrs} class="${clase}" style="position: absolute; left: ${x}px; top: ${y}px; ${w ? `width: ${w}px; text-align: center;` : ''} font-size: ${size}px; line-height: 1; white-space: nowrap; ${color ? `color: ${color};` : ''} ${extra}">${txt}</div>`;

// ── gan-triple ───────────────────────────────────────────────────────────
// Tres barras de bloques (1, 3 y 10 títulos) y dos flechas: ×3 y ×3,3.
const U = 82, BASE = 1060;
const bloquesBarra = (n, x, w, color, g) => Array.from({ length: n }, (_, i) =>
  `<div data-bloque data-g="${g}" style="position: absolute; left: ${x}px; top: ${BASE - (i + 1) * U + 4}px; width: ${w}px; height: ${U - 8}px; border-radius: 12px; background: ${grad(color)}; box-shadow: 0 0 22px ${a(color, 0.55)}, inset 0 2px 0 ${a('#FFFFFF', 0.4)};"></div>`).join('');
slides.push(lamina('gan-triple', 'Eso quiere decir que China triplica al tercer puesto y que Corea más que triplica a China.', `
    ${mundo(1)}
    ${flujo(41, 0.26)}
    ${motas(404, 14)}
    ${panel(`
      ${escudo(300, 300, 480, 0.05)}
      ${bloquesBarra(1, 110, 220, REG.TW, 0)}${bloquesBarra(3, 430, 220, REG.CN, 1)}${bloquesBarra(10, 750, 220, REG.KR, 2)}
      ${texto('TW · EU', { x: 80, y: BASE + 24, w: 280, size: 64, attrs: 'data-cod' })}
      ${texto('CN', { x: 400, y: BASE + 24, w: 280, size: 90, attrs: 'data-cod' })}
      ${texto('KR', { x: 720, y: BASE + 24, w: 280, size: 90, attrs: 'data-cod' })}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g fill="none" stroke="${CIAN}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 14px ${a(CIAN, 0.8)});">
          <path data-flecha d="M230 948 C 280 800, 420 730, 516 782"/><path data-punta d="M476.6 783.4 L516 782 L495.6 748.2"/>
          <path data-flecha d="M560 790 C 610 520, 760 300, 850 222"/><path data-punta d="M837.4 259.4 L850 222 L811.2 229.2"/>
        </g>
      </svg>
      ${texto('×3', { x: 120, y: 620, w: 300, size: 190, clase: 'cian', attrs: 'data-mult data-v="3"' })}
      ${texto('×3,3', { x: 320, y: 330, w: 330, size: 190, clase: 'cian', attrs: 'data-mult data-v="3.3"' })}`)}`));

// ── gan-importados ───────────────────────────────────────────────────────
// 96 jugadores del Mundial, 37 coreanos (🟡 un solo medio).
const GC = 72, GG = 10, GL = (1080 - (12 * GC + 11 * GG)) / 2;
const celdasImp = Array.from({ length: 96 }, (_, i) => {
  const c = i % 12, f = Math.floor(i / 12), on = i < 37;
  return `<div ${on ? 'data-on' : 'data-off'} style="position: absolute; left: ${GL + c * (GC + GG)}px; top: ${400 + f * (GC + GG)}px; width: ${GC}px; height: ${GC}px; border-radius: 14px; box-sizing: border-box; ${on ? `background: ${grad(REG.KR)}; box-shadow: 0 0 20px ${a(REG.KR, 0.6)}, inset 0 2px 0 ${a('#FFFFFF', 0.4)}; border: 2px solid ${a('#FFFFFF', 0.35)};` : `background: ${a('#0A1458', 0.7)}; border: 2px solid ${a(APAGADO, 0.55)};`}"></div>`;
}).join('');
slides.push(lamina('gan-importados', 'Está tan marcada la calidad coreana que en el mundial actual, de los noventa y seis jugadores, treinta y siete son coreanos.', `
    ${mundo(1)}
    ${flujo(53, 0.26)}
    ${motas(505, 14)}
    ${panel(`
      ${escudo(300, 760, 480, 0.05)}
      ${texto('<span data-n>37</span>/96', { x: 0, y: 30, w: 1080, size: 330, attrs: 'data-total' })}
      ${celdasImp}`)}`));

// ── gan-mids ─────────────────────────────────────────────────────────────
// 19 equipos, 11 con mid coreano. Anónimas a propósito: la nota no dice cuáles (🟡).
const midMarca = (c, tam = 74) => `<svg viewBox="0 0 64 64" width="${tam}" height="${tam}" fill="none" stroke="${c}" stroke-linecap="round"><rect x="6" y="6" width="52" height="52" rx="10" stroke-width="4" opacity="0.55"/><path d="M14 50 L50 14" stroke-width="8"/></svg>`;
const MW = 170, MG = 20, MX0 = (1080 - (5 * MW + 4 * MG)) / 2;
const celdasMid = Array.from({ length: 19 }, (_, i) => {
  const c = i % 5, f = Math.floor(i / 5), on = i < 11;
  return `<div ${on ? 'data-on' : 'data-off'} style="position: absolute; left: ${MX0 + c * (MW + MG)}px; top: ${400 + f * (MW + MG)}px; width: ${MW}px; height: ${MW}px; border-radius: 22px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; ${on ? `background: linear-gradient(160deg, ${a('#5C7BFF', 0.35)}, ${a('#050B46', 0.9)} 70%); border: 2px solid ${a(REG.KR, 0.95)}; box-shadow: 0 0 34px ${a(REG.KR, 0.55)}, inset 0 0 30px ${a(REG.KR, 0.2)};` : `background: ${a('#0A1458', 0.7)}; border: 2px solid ${a(APAGADO, 0.5)};`}">${midMarca(on ? PLATA : APAGADO)}</div>`;
}).join('');
slides.push(lamina('gan-mids', 'De hecho once de los diecinueve equipos tienen mid coreano.', `
    ${mundo(1)}
    ${flujo(61, 0.26)}
    ${motas(606, 14)}
    ${panel(`
      ${escudo(300, 760, 480, 0.05)}
      ${texto('<span data-n>11</span>/19', { x: 0, y: 30, w: 1080, size: 330, attrs: 'data-total' })}
      ${celdasMid}`)}`));

// ── gan-gente ────────────────────────────────────────────────────────────
// Jugadores en ranked: Europa Oeste por encima de Corea (op.gg, foto del 2/11, 🟡).
const GENTE = [['EUW', 3660655, 960, '#9AA7D9', 250], ['KR', 3221111, Math.round(960 * 3221111 / 3660655), REG.KR, 640]];
const barrasGente = GENTE.map(([cod, n, w, col, y]) => `
      ${texto(cod, { x: 60, y, size: 120, attrs: 'data-cod' })}
      ${texto(`<span data-num data-v="${n}">${n.toLocaleString('es-MX').replace(/,/g, '.')}</span>`, { x: 380, y: y + 6, w: 640, size: 118, extra: 'text-align: right;', attrs: 'data-cifra' })}
      <div data-barra style="position: absolute; left: 60px; top: ${y + 140}px; width: ${w}px; height: 150px; border-radius: 22px; background: ${grad(col)}; box-shadow: 0 0 34px ${a(col, 0.55)}, inset 0 3px 0 ${a('#FFFFFF', 0.4)}; transform-origin: 0 50%;"></div>`).join('');
slides.push(lamina('gan-gente', 'A ver, a priori puedes pensar que ahí lo juegan más. En total no, el servidor de Europa Oeste tiene más jugadores que el de Corea.', `
    ${mundo(1)}
    ${flujo(71, 0.26)}
    ${motas(707, 14)}
    ${panel(`
      ${escudo(300, 760, 480, 0.05)}
      ${barrasGente}`)}`));

// ── gan-proporcion ───────────────────────────────────────────────────────
// ¿Y en proporción a la población? Un solo bloque (un país) contra muchos (muchos países)
// y un «?»: no hay dato verificado, así que no lleva cifras.
const peques = Array.from({ length: 16 }, (_, i) => `<div data-pieza style="position: absolute; left: ${580 + (i % 4) * 108}px; top: ${620 + Math.floor(i / 4) * 108}px; width: 92px; height: 92px; border-radius: 16px; background: ${grad('#9AA7D9')}; box-shadow: 0 0 18px ${a('#9AA7D9', 0.5)}, inset 0 2px 0 ${a('#FFFFFF', 0.4)};"></div>`).join('');
slides.push(lamina('gan-proporcion', 'Aunque ojo, Corea es un solo país y Europa Oeste son un montón, así que en proporción a la gente que vive ahí, la neta no tengo el dato.', `
    ${mundo(1)}
    ${flujo(83, 0.26)}
    ${motas(808, 14)}
    ${panel(`
      ${escudo(300, 700, 480, 0.05)}
      <div data-gran style="position: absolute; left: 70px; top: 620px; width: 420px; height: 420px; border-radius: 34px; background: ${grad(REG.KR)}; box-shadow: 0 0 50px ${a(REG.KR, 0.6)}, inset 0 4px 0 ${a('#FFFFFF', 0.4)};"></div>
      ${peques}
      ${texto('KR', { x: 70, y: 1070, w: 420, size: 120, attrs: 'data-lab' })}
      ${texto('EUW', { x: 580, y: 1070, w: 420, size: 120, attrs: 'data-lab' })}
      ${texto('?', { x: 190, y: 40, w: 700, size: 520, clase: 'cian', attrs: 'data-signo' })}`)}`));

// ── gan-dinero ───────────────────────────────────────────────────────────
// Una balanza a líneas en equilibrio (LCK contra LEC), sin cifras y sin texto. Los topes
// salariales de los cinco mejor pagados son parecidos (🟡/🟢).
const BAL = { px: 540, py: 380, L: 320, hilo: 270, copa: 330 };
const balanzaPos = (r) => ({ lx: BAL.px - BAL.L * Math.cos(r), ly: BAL.py - BAL.L * Math.sin(r), rx: BAL.px + BAL.L * Math.cos(r), ry: BAL.py + BAL.L * Math.sin(r) });
const plato = (color, lado) => `
          <g stroke="${PLATA}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M0 0 L-135 ${BAL.hilo}"/><path d="M0 0 L135 ${BAL.hilo}"/></g>
          ${[0, 1, 2].map((i) => `<rect x="-80" y="${BAL.hilo - 78 * (i + 1) - 4}" width="160" height="70" rx="14" fill="${color}" fill-opacity="0.92" stroke="${a('#FFFFFF', 0.45)}" stroke-width="3" style="filter: drop-shadow(0 0 16px ${a(color, 0.7)});"/>`).join('')}
          <path d="M-155 ${BAL.hilo} H155 Q 140 ${BAL.copa + 46} 0 ${BAL.copa + 46} Q -140 ${BAL.copa + 46} -155 ${BAL.hilo} Z" fill="${a('#0A1458', 0.9)}" stroke="${PLATA}" stroke-width="5" stroke-linejoin="round"/>`;
const bp = balanzaPos(0);
slides.push(lamina('gan-dinero', 'Va, entonces es el dinero. Tampoco, los topes salariales de los equipos de la liga coreana están cerca de los de la liga europea.', `
    ${mundo(1)}
    ${flujo(97, 0.26)}
    ${motas(909, 14)}
    ${panel(`
      ${escudo(300, 700, 480, 0.05)}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <g fill="none" stroke="${PLATA}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 10px ${a(LUZ, 0.7)});">
          <path d="M540 380 V1130"/><path d="M370 1140 H710 L690 1090 H390 Z" fill="${a('#0A1458', 0.9)}"/>
        </g>
        <line data-viga x1="${bp.lx}" y1="${bp.ly}" x2="${bp.rx}" y2="${bp.ry}" stroke="${PLATA}" stroke-width="14" stroke-linecap="round" style="filter: drop-shadow(0 0 12px ${a(LUZ, 0.8)});"/>
        <g data-plato-i transform="translate(${bp.lx} ${bp.ly})">${plato(REG.KR, 'i')}</g>
        <g data-plato-d transform="translate(${bp.rx} ${bp.ry})">${plato('#9AA7D9', 'd')}</g>
        <circle cx="540" cy="380" r="26" fill="${BG}" stroke="${PLATA}" stroke-width="9"/>
      </svg>`)}`));

// ── gan-china ────────────────────────────────────────────────────────────
// Los tres Mundiales de China tuvieron coreanos (🟢): Rookie (IG 2018), Doinb (FPX 2019)
// y Scout y Viper (EDG 2021). Una tarjeta por título con su copa; el nombre en una píldora KR.
const CHINA = [
  [2018, 'IG', ['ROOKIE']],
  [2019, 'FPX', ['DOINB']],
  [2021, 'EDG', ['SCOUT', 'VIPER']],
];
const CXC = [190, 540, 890];
const tarjetasChina = CHINA.map(([anio, logo, nombres], i) => {
  const cx = CXC[i];
  const pill = nombres.map((n, k) => `<div data-nombre style="position: absolute; left: ${cx - 140}px; top: ${900 + k * 96}px; width: 280px; height: 84px; border-radius: 42px; background: ${grad(REG.KR)}; box-shadow: 0 0 28px ${a(REG.KR, 0.6)}, inset 0 3px 0 ${a('#FFFFFF', 0.35)}; border: 2px solid ${a('#FFFFFF', 0.4)}; display: flex; align-items: center; justify-content: center; font-size: 62px; line-height: 1; letter-spacing: 3px; color: #FFFFFF; padding-left: 3px;">${n}</div>`).join('');
  return `
      <div data-card style="position: absolute; left: ${cx - 160}px; top: 50px; width: 320px; height: 1100px; border-radius: 28px; box-sizing: border-box; background: linear-gradient(160deg, ${a('#5C7BFF', 0.22)}, ${a('#050B46', 0.88)} 70%); border: 2px solid ${a(CIAN, 0.85)}; box-shadow: 0 0 36px ${a(CIAN, 0.35)}, inset 0 0 40px ${a(CIAN, 0.1)};"></div>
      <img data-logo-c src="assets/logos/${logo}.png" alt="${logo}" style="position: absolute; left: ${cx - 70}px; top: 90px; width: 140px; height: 140px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,10,0.55));">
      ${copaImg({ x: cx - 170, y: 250, w: 340, attrs: 'data-copa-c', filtro: `brightness(1.12) drop-shadow(0 0 40px ${a(CIAN, 0.85)})` })}
      ${texto(String(anio), { x: cx - 160, y: 720, w: 320, size: 150, attrs: 'data-anio' })}
      ${pill}`;
}).join('');
slides.push(lamina('gan-china', 'Pero los tres títulos que tiene China tuvieron miembros de nacionalidad coreana en sus equipos.', `
    ${mundo(1)}
    ${flujo(109, 0.26)}
    ${motas(1010, 14)}
    ${panel(`
      ${tarjetasChina}`)}`));

// ── gan-lcs ──────────────────────────────────────────────────────────────
// La liga de Norteamérica 2026: ~43 % coreanos contra ~33 % de EE. UU. y Canadá (🟡;
// otro conteo da 16 contra 12). Al lado, la copa de Norteamérica, vacía.
const SEG = [['KR', 43, REG.KR, true], ['NA', 33, '#7C88B5', true], ['', 24, '#1B2564', false]];
let acum = 0;
const segmentos = SEG.map(([cod, pct, col, lleva]) => {
  const x = 60 + acum * 9.6, w = pct * 9.6; acum += pct;
  return `<div data-seg style="position: absolute; left: ${x}px; top: 170px; width: ${w - 6}px; height: 210px; border-radius: 22px; background: ${grad(col)}; box-shadow: 0 0 30px ${a(col, 0.5)}, inset 0 3px 0 ${a('#FFFFFF', 0.4)}; display: flex; align-items: center; justify-content: center; font-size: 118px; line-height: 1; color: #FFFFFF; transform-origin: 0 50%;">${lleva ? `<span data-pct data-v="${pct}">${pct} %</span>` : ''}</div>`;
}).join('');
slides.push(lamina('gan-lcs', 'Y en la liga de Norteamérica hay más coreanos que norteamericanos, chíngense ese dato, y no ganan nada. O sea que no basta con tener un coreano.', `
    ${mundo(1)}
    ${flujo(127, 0.26)}
    ${motas(1111, 14)}
    ${panel(`
      ${escudo(300, 640, 480, 0.05)}
      ${texto('KR', { x: 60, y: 40, w: 420, size: 110, extra: 'text-align: left;' })}
      ${texto('NA', { x: 480, y: 40, w: 320, size: 110, extra: 'text-align: left;' })}
      ${segmentos}
      ${copaImg({ x: 220, y: 450, w: 460, attrs: 'data-copa-vacia', src: 'copa-g' })}
      ${texto('0', { x: 680, y: 560, w: 340, size: 460, attrs: 'data-cero', color: APAGADO, clase: 'cero' })}
      ${['TL', 'C9', 'LYON'].map((l, i) => ficha({ logo: l, color: '#7C88B5', x: 250 + i * 190, y: 1130, w: 160, h: 160, lado: 0.64, attrs: 'data-na-logo' })).join('')}`)}`));

// ── gan-agua ─────────────────────────────────────────────────────────────
// Plan B de «¿qué le dan en el agua?»: un vaso a líneas con agua en azul y cian y una gota
// que cae y abre ondas. Lámina corta (pasa por una sola frase).
const onda = (amp, fase, y0) => { let d = `M40 ${y0}`; for (let x = 40; x <= 1040; x += 20) d += ` L${x} ${(y0 + amp * Math.sin((x + fase) / 38)).toFixed(1)}`; return d + ` L1040 1100 L40 1100 Z`; };
slides.push(lamina('gan-agua', 'Entonces qué le dan en el agua a estos cabrones.', `
    ${mundo(1)}
    ${flujo(131, 0.26)}
    ${motas(1212, 16)}
    ${panel(`
      ${escudo(300, 600, 480, 0.05)}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <defs>
          <clipPath id="vaso"><path d="M330 300 H750 L700 1040 Q 695 1090 645 1090 H435 Q 385 1090 380 1040 Z"/></clipPath>
          <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LUZ}"/><stop offset="1" stop-color="${ELEC}"/></linearGradient>
        </defs>
        <g clip-path="url(#vaso)">
          <g data-agua><path data-onda1 d="${onda(10, 0, 520)}" fill="url(#agua)" fill-opacity="0.95"/><path data-onda2 d="${onda(8, 140, 540)}" fill="${CIAN}" fill-opacity="0.35"/></g>
          <ellipse data-ondita cx="540" cy="540" rx="40" ry="10" fill="none" stroke="#FFFFFF" stroke-width="5" opacity="0"/>
          <ellipse data-ondita cx="540" cy="540" rx="40" ry="10" fill="none" stroke="${CIAN}" stroke-width="5" opacity="0"/>
          <ellipse data-ondita cx="540" cy="540" rx="40" ry="10" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0"/>
        </g>
        <path data-vaso d="M330 300 H750 L700 1040 Q 695 1090 645 1090 H435 Q 385 1090 380 1040 Z" fill="${a('#FFFFFF', 0.04)}" stroke="${PLATA}" stroke-width="9" stroke-linejoin="round" style="filter: drop-shadow(0 0 14px ${a(LUZ, 0.8)});"/>
        <path data-brillo d="M372 360 L418 980" stroke="${a('#FFFFFF', 0.45)}" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path data-gota d="M540 120 C 540 120, 508 168, 508 192 A32 32 0 0 0 572 192 C 572 168, 540 120, 540 120 Z" fill="${CIAN}" stroke="#FFFFFF" stroke-width="4" style="filter: drop-shadow(0 0 16px ${CIAN});"/>
      </svg>`)}`));

// ── gan-piramide ─────────────────────────────────────────────────────────
// La pirámide de Corea: LCK (10), Challengers (10) y Academy Series (10), unidas por un mismo
// corchete («mismo sistema»), y debajo, aparte y de otro color, la liga de preparatorias (9
// equipos de LoL), que organiza otra entidad y arrancó su versión institucional en 2026.
const NIV = [
  { y: 70, ar: 150, ab: 220, n: '10', c: REG.KR, ic: 'escudo' },
  { y: 312, ar: 226, ab: 296, n: '10', c: REG.KR, ic: 'birrete' },
  { y: 554, ar: 302, ab: 372, n: '10', c: REG.KR, ic: 'birrete' },
];
const polNiv = (v) => `${540 - v.ar},${v.y} ${540 + v.ar},${v.y} ${540 + v.ab},${v.y + 230} ${540 - v.ab},${v.y + 230}`;
const N4 = { y: 884, ar: 378, ab: 448 };
slides.push(lamina('gan-piramide', 'Y ahora sí vamos a ver la pirámide coreana, porque existe la liga coreana, pero también la Challengers y la Academy Series, y abajo de todo la liga de preparatorias.', `
    ${mundo(1)}
    ${flujo(149, 0.26)}
    ${motas(1313, 14)}
    ${panel(`
      ${escudo(340, 300, 400, 0.04)}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <defs><linearGradient id="niv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C93FF"/><stop offset="1" stop-color="${REG.KR}"/></linearGradient></defs>
        ${NIV.map((v, i) => `<polygon data-nivel data-i="${i}" points="${polNiv(v)}" fill="url(#niv)" fill-opacity="${0.95 - i * 0.12}" stroke="${a('#FFFFFF', 0.5)}" stroke-width="3" stroke-linejoin="round" style="filter: drop-shadow(0 0 22px ${a(REG.KR, 0.55)});"/>`).join('')}
        <polygon data-nivel4 points="${polNiv(N4)}" fill="${a(CIAN, 0.1)}" stroke="${CIAN}" stroke-width="4" stroke-dasharray="16 12" stroke-linejoin="round" style="filter: drop-shadow(0 0 16px ${a(CIAN, 0.5)});"/>
        <path data-corchete d="M965 70 Q1010 70 1010 115 L1010 380 Q1010 427 1045 427 Q1010 427 1010 474 L1010 740 Q1010 784 965 784" fill="none" stroke="${PLATA}" stroke-width="9" stroke-linecap="round" style="filter: drop-shadow(0 0 12px ${a(LUZ, 0.8)});"/>
      </svg>
      ${NIV.map((v, i) => `<div data-num-niv style="position: absolute; left: 0; width: 1080px; top: ${v.y + 22}px; height: 190px; display: flex; align-items: center; justify-content: center; gap: 22px;">${v.ic === 'escudo' ? '<img src="assets/escudo.png" alt="" style="width: 92px; height: auto;">' : birrete('#FFFFFF', 84)}<span class="plata" style="font-size: 190px; line-height: 1;">${v.n}</span></div>`).join('')}
      <div data-num-niv4 style="position: absolute; left: 0; width: 1080px; top: ${N4.y + 22}px; height: 190px; display: flex; align-items: center; justify-content: center; gap: 22px;">${birrete(CIAN, 84)}<span style="font-size: 190px; line-height: 1; color: ${CIAN};">9</span></div>`)}`));

// ── gan-europa ───────────────────────────────────────────────────────────
// Trece ligas regionales sueltas (una por país) y la liga europea, cerrada y de 10 equipos,
// con candado. Las flechas se cortan antes de llegar. 2022: la academia deja de ser obligatoria.
const celdasLEC = Array.from({ length: 10 }, (_, i) => `<div data-lec style="position: absolute; left: ${116 + (i % 5) * 172}px; top: ${200 + Math.floor(i / 5) * 140}px; width: 160px; height: 128px; border-radius: 18px; background: linear-gradient(160deg, ${a('#5C7BFF', 0.3)}, ${a('#050B46', 0.9)} 70%); border: 2px solid ${a('#9AA7D9', 0.8)}; box-shadow: 0 0 22px ${a('#9AA7D9', 0.3)};"></div>`).join('');
const FILAS13 = [5, 4, 4];
let idx13 = 0;
const circulos13 = FILAS13.map((n, f) => Array.from({ length: n }, (_, k) => {
  const x = (1080 - (n * 130 + (n - 1) * 36)) / 2 + k * 166, y = 760 + f * 166; idx13++;
  return `<div data-liga style="position: absolute; left: ${x}px; top: ${y}px; width: 130px; height: 130px; border-radius: 50%; box-sizing: border-box; border: 3px solid #9AA7D9; background: radial-gradient(closest-side, ${a('#9AA7D9', 0.3)}, ${a('#050B46', 0.85)}); box-shadow: 0 0 22px ${a('#9AA7D9', 0.4)}; display: flex; align-items: center; justify-content: center;"><img src="assets/escudo.png" alt="" style="width: 54px; height: auto; opacity: 0.8;"></div>`;
}).join('')).join('');
slides.push(lamina('gan-europa', 'Esas tres divisiones cuelgan del mismo sistema, mientras que en Europa hay trece ligas regionales, una por país, y la liga europea es cerrada, sin ascenso. De hecho las academias dejaron de ser obligatorias hace cuatro años.', `
    ${mundo(1)}
    ${flujo(163, 0.26)}
    ${motas(1414, 14)}
    ${panel(`
      ${texto('10', { x: 0, y: 10, w: 1080, size: 170, attrs: 'data-diez' })}
      ${celdasLEC}
      <div data-candado style="position: absolute; left: ${540 - 70}px; top: ${200 + 134 - 70}px; width: 140px; height: 140px; border-radius: 50%; background: ${a(BG, 0.92)}; border: 4px solid ${CIAN}; box-shadow: 0 0 40px ${a(CIAN, 0.7)}; display: flex; align-items: center; justify-content: center;">${ic('tabler:lock', 84, CIAN, 2.4)}</div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;">
        <g fill="none" stroke="#9AA7D9" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
          ${[170, 370, 570].map((x) => `<path data-flecha d="M${x} 720 L${x} 610"/><path data-punta d="M${x - 20} 636 L${x} 610 L${x + 20} 636"/><path data-corte d="M${x - 24} 560 L${x + 24} 532 M${x - 24} 532 L${x + 24} 560" stroke="${CIAN}"/>`).join('')}
        </g>
      </svg>
      ${texto('2022', { x: 700, y: 490, w: 340, size: 130, clase: 'cian', attrs: 'data-anio22' })}
      <div data-academia style="position: absolute; left: ${870 - 50}px; top: 630px;">${birrete(CIAN, 100)}</div>
      ${circulos13}
      ${texto('13', { x: 0, y: 1232, w: 1080, size: 120, attrs: 'data-trece' })}`)}`));

// ── gan-matiz ────────────────────────────────────────────────────────────
// El matiz: Corea ya ganaba en 2013-2017, antes de la obligación (2021), y Norteamérica tuvo
// academias de 2017 a 2022 sin ganar. Línea de tiempo 2011-2026 con dos carriles.
const TX = (y) => 70 + (y - 2011) * 62.4; // x de cada año
const KRT = [2013, 2014, 2015, 2016, 2017, 2020, 2022, 2023, 2024, 2025];
const LOGO_KR = { 2013: 'SKT', 2014: 'SSW', 2015: 'SKT', 2016: 'SKT', 2017: 'SSG', 2020: 'DK', 2022: 'DRX', 2023: 'T1', 2024: 'T1', 2025: 'T1' };
const copasKR = KRT.map((y) => ficha({ logo: LOGO_KR[y], color: REG.KR, x: TX(y) - 28, y: 262, w: 56, h: 66, lado: 0.72, radio: 12, op: y < 2021 ? 1 : 0.42, attrs: 'data-copa-kr' })).join('');
slides.push(lamina('gan-matiz', 'Pues tampoco alcanza, porque la supremacía ya estaba desde antes de que fueran obligatorias. Y en Norteamérica tuvieron academias años y tampoco ganaron.', `
    ${mundo(1)}
    ${flujo(173, 0.26)}
    ${motas(1515, 14)}
    ${panel(`
      ${escudo(300, 700, 480, 0.05)}
      ${texto('KR', { x: 40, y: 120, size: 100, extra: 'text-align: left;' })}
      ${texto('NA', { x: 40, y: 560, size: 100, extra: 'text-align: left;' })}
      <div style="position: absolute; left: 40px; top: 360px; width: 1000px; height: 4px; border-radius: 2px; background: ${a('#FFFFFF', 0.5)}; box-shadow: 0 0 18px ${a(LUZ, 0.7)};"></div>
      ${copasKR}
      <div data-franja style="position: absolute; left: ${TX(2017)}px; top: 690px; width: ${TX(2022) - TX(2017)}px; height: 110px; border-radius: 24px; background: ${grad('#7C88B5')}; box-shadow: 0 0 30px ${a('#7C88B5', 0.5)}; display: flex; align-items: center; justify-content: space-around; transform-origin: 0 50%;">${[0, 1, 2, 3, 4].map(() => birrete('#FFFFFF', 54)).join('')}</div>
      ${copaImg({ x: TX(2022) + 20, y: 640, w: 150, attrs: 'data-copa-na', src: 'copa-g' })}
      <div data-marca21 style="position: absolute; left: ${TX(2021) - 3}px; top: 150px; width: 6px; height: 760px; border-radius: 3px; background: ${CIAN}; box-shadow: 0 0 30px ${a(CIAN, 0.9)}; transform-origin: 50% 0;"></div>
      <div data-marca21-i style="position: absolute; left: ${TX(2021) - 44}px; top: 40px; width: 88px; height: 88px; border-radius: 50%; background: ${a(BG, 0.9)}; border: 4px solid ${CIAN}; box-shadow: 0 0 34px ${a(CIAN, 0.8)}; display: flex; align-items: center; justify-content: center;">${birrete(CIAN, 52)}</div>
      ${texto('2021', { x: TX(2021) - 280, y: 940, w: 560, size: 230, clase: 'cian', attrs: 'data-marca21-t' })}`)}`));

// ── gan-resumen ──────────────────────────────────────────────────────────
// Cuatro hipótesis, ninguna alcanza: gente, dinero, un coreano, academias. Cada una lleva un
// trazo a medias y un «?» — nunca una X definitiva: el video es de duda.
const RES = [['tabler:users', ''], ['tabler:coin', ''], ['tabler:user', 'KR'], ['tabler:school', '']];
const fichasRes = RES.map(([icono, cod], i) => {
  const x = 50 + i * 250;
  return `
      <div data-hip style="position: absolute; left: ${x}px; top: 430px; width: 230px; height: 400px; border-radius: 26px; box-sizing: border-box; background: linear-gradient(160deg, ${a('#5C7BFF', 0.3)}, ${a('#050B46', 0.9)} 70%); border: 2px solid ${a('#9AA7D9', 0.85)}; box-shadow: 0 0 30px ${a('#9AA7D9', 0.3)}, 0 14px 30px rgba(0,0,12,0.6);">
        <div style="position: absolute; left: 0; right: 0; top: 70px; display: flex; justify-content: center;">${ic(icono, 150, PLATA, 1.7)}</div>
        ${cod ? `<div style="position: absolute; left: 0; right: 0; top: 260px; text-align: center; font-size: 80px; line-height: 1; color: ${PLATA};">${cod}</div>` : ''}
      </div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none;"><path data-trazo d="M${x + 24} 450 L${x + 120} 640" fill="none" stroke="${CIAN}" stroke-width="14" stroke-linecap="round" style="filter: drop-shadow(0 0 14px ${a(CIAN, 0.9)});"/></svg>
      ${texto('?', { x: x + 55, y: 835, w: 120, size: 150, clase: 'cian', attrs: 'data-int' })}`;
}).join('');
slides.push(lamina('gan-resumen', 'O sea que no es la gente, no es el dinero, no basta con traerte un coreano, y ni las academias parecen alcanzar.', `
    ${mundo(1)}
    ${flujo(181, 0.26)}
    ${motas(1616, 14)}
    ${panel(`
      ${escudo(300, 700, 480, 0.05)}
      ${fichasRes}`)}`));

// ── gan-cultura ──────────────────────────────────────────────────────────
// En 2025 el League fue el juego más jugado en los cibercafés de Corea (🟡; no se compara con
// Europa ni Norteamérica y no lleva porcentaje). Una fila de monitores vista de frente, el
// primero encendido.
const monitores = Array.from({ length: 5 }, (_, i) => {
  const x = 75 + i * 190, on = i === 0;
  return `<g data-monitor ${on ? 'data-on' : ''}>
        <rect x="${x}" y="620" width="170" height="124" rx="14" fill="${on ? 'url(#pantalla)' : a('#0A1458', 0.8)}" stroke="${on ? '#FFFFFF' : APAGADO}" stroke-width="${on ? 5 : 4}" style="${on ? `filter: drop-shadow(0 0 30px ${a(CIAN, 0.9)});` : ''}"/>
        <path d="M${x + 85} 744 V790 M${x + 40} 796 H${x + 130}" stroke="${on ? '#FFFFFF' : APAGADO}" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>`;
}).join('');
slides.push(lamina('gan-cultura', 'Lo único que puedo ver es que en dos mil veinticinco el League fue el juego más jugado en los cibercafés de Corea, pero no tenemos una manera clara de comparar eso con Europa o Norteamérica.', `
    ${mundo(1)}
    ${flujo(191, 0.26)}
    ${motas(1717, 14)}
    ${panel(`
      ${escudo(300, 760, 480, 0.05)}
      ${texto('#1', { x: 0, y: 60, w: 1080, size: 520, attrs: 'data-uno' })}
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <defs><linearGradient id="pantalla" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${CIAN}"/><stop offset="1" stop-color="${ELEC}"/></linearGradient></defs>
        ${monitores}
      </svg>
      ${texto('2025', { x: 0, y: 900, w: 1080, size: 260, clase: 'cian', attrs: 'data-anio25' })}`)}`));

// ── gan-deporte ──────────────────────────────────────────────────────────
// Cultura deportiva: obsesión por rendir a nivel de élite. Un cronómetro a líneas con la
// manecilla que acelera y deja estela.
const marcasCrono = Array.from({ length: 60 }, (_, i) => { const t = i % 5 === 0, ang = i * 6 * Math.PI / 180, r0 = t ? 300 : 316, r1 = 336; return `<line x1="${(540 + r0 * Math.sin(ang)).toFixed(1)}" y1="${(640 - r0 * Math.cos(ang)).toFixed(1)}" x2="${(540 + r1 * Math.sin(ang)).toFixed(1)}" y2="${(640 - r1 * Math.cos(ang)).toFixed(1)}" stroke="${PLATA}" stroke-width="${t ? 8 : 4}" stroke-linecap="round" opacity="${t ? 1 : 0.6}"/>`; }).join('');
slides.push(lamina('gan-deporte', 'O es un tema de cultura deportiva, que estén más obsesionados con dar un desempeño de élite.', `
    ${mundo(1)}
    ${flujo(199, 0.26)}
    ${motas(1818, 14)}
    ${panel(`
      ${escudo(300, 700, 480, 0.05)}
      <div style="position: absolute; left: ${540 - 372}px; top: ${640 - 372}px; width: 744px; height: 744px; border-radius: 50%; background: ${a('#0A1458', 0.7)};"></div>
      <div data-estela style="position: absolute; left: ${540 - 300}px; top: ${640 - 300}px; width: 600px; height: 600px; border-radius: 50%; background: conic-gradient(from 0deg, ${a(CIAN, 0)} 0deg, ${a(CIAN, 0)} 250deg, ${a(CIAN, 0.55)} 358deg, ${a(CIAN, 0)} 360deg); -webkit-mask-image: radial-gradient(closest-side, transparent 0, transparent 40%, #000 42%); mask-image: radial-gradient(closest-side, transparent 0, transparent 40%, #000 42%);"></div>
      <svg viewBox="0 0 1080 1370" width="1080" height="1370" style="position: absolute; left: 0; top: 0; overflow: visible;">
        <circle cx="540" cy="640" r="372" fill="none" stroke="${PLATA}" stroke-width="12" style="filter: drop-shadow(0 0 20px ${a(LUZ, 0.8)});"/>
        <rect x="500" y="228" width="80" height="48" rx="12" fill="${a('#0A1458', 0.9)}" stroke="${PLATA}" stroke-width="9"/>
        ${marcasCrono}
        <g data-mano><line x1="540" y1="700" x2="540" y2="360" stroke="${CIAN}" stroke-width="14" stroke-linecap="round" style="filter: drop-shadow(0 0 14px ${CIAN});"/></g>
        <circle cx="540" cy="640" r="26" fill="${BG}" stroke="${PLATA}" stroke-width="9"/>
      </svg>`)}`));

// ── gan-entorno ──────────────────────────────────────────────────────────
// El entorno de práctica: los 10 equipos de la liga coreana en círculo y, abajo, las dos
// últimas LCK (Gen.G 2025 y 2026) frente al tricampeón del mundo (T1 ×3, fuera del círculo).
const ang10 = (i) => (i / 10) * 2 * Math.PI - Math.PI / 2;
const anillo = LCK10.map((l, i) => ficha({ logo: l, color: REG.KR, x: 540 + 320 * Math.cos(ang10(i)) - 65, y: 400 + 320 * Math.sin(ang10(i)) - 65, w: 130, h: 130, lado: 0.64, attrs: 'data-lck', radio: 65 })).join('');
slides.push(lamina('gan-entorno', 'O es el entorno de práctica, estar rodeado de equipos súper top en una liga donde las últimas dos veces ganó Gen.G y no el tricampeón del mundo.', `
    ${mundo(1)}
    ${flujo(211, 0.26)}
    ${motas(1919, 14)}
    ${panel(`
      ${escudo(390, 250, 300, 0.12)}
      ${anillo}
      ${copaImg({ x: 90, y: 820, w: 290, attrs: 'data-copa-e data-g="0"' })}
      ${copaImg({ x: 400, y: 820, w: 290, attrs: 'data-copa-e data-g="1"' })}
      ${copaImg({ x: 760, y: 820, w: 290, attrs: 'data-copa-t', filtro: `drop-shadow(0 0 40px ${a(CIAN, 0.8)})` })}
      <div data-sep style="position: absolute; left: 726px; top: 840px; width: 4px; height: 460px; border-radius: 2px; background: ${a('#FFFFFF', 0.45)};"></div>
      ${texto('GEN.G 2025', { x: 60, y: 1235, w: 330, size: 62, attrs: 'data-et' })}
      ${texto('GEN.G 2026', { x: 370, y: 1235, w: 330, size: 62, attrs: 'data-et' })}
      ${texto('T1 ×3', { x: 740, y: 1210, w: 320, size: 120, clase: 'cian', attrs: 'data-et-t' })}`)}`));

// ── gan-bola ─────────────────────────────────────────────────────────────
// La bola de nieve: el que gana atrae a los mejores y los mejores lo siguen haciendo ganar.
// Una bola rueda de izquierda a derecha, se va pegando puntos (jugadores) y crece. Va en HTML
// (no en SVG) para que el escalado desde el suelo sea predecible.
const PUNTOS = [[260, -0.6], [330, 0.9], [410, 2.1], [490, -1.7], [560, 0.2], [640, 1.5], [700, -2.6], [770, 2.8], [820, 0.6], [860, -1.1]];
const colPunto = (i) => (i % 3 ? '#FFFFFF' : CIAN);
const sueltos = PUNTOS.map(([x], i) => `<span data-suelto data-i="${i}" style="position: absolute; left: ${x - 14}px; top: ${1130 - 34}px; width: 28px; height: 28px; border-radius: 50%; background: ${colPunto(i)}; box-shadow: 0 0 14px ${CIAN};"></span>`).join('');
const pegados = PUNTOS.map(([, ang], i) => `<span data-pegado data-i="${i}" style="position: absolute; left: ${(60 + Math.cos(ang) * 63 - 13).toFixed(1)}px; top: ${(60 + Math.sin(ang) * 63 - 13).toFixed(1)}px; width: 26px; height: 26px; border-radius: 50%; background: ${colPunto(i)}; box-shadow: 0 0 12px ${CIAN}; opacity: 0;"></span>`).join('');
slides.push(lamina('gan-bola', 'O es una bola de nieve, el que gana atrae a los mejores y los mejores lo siguen haciendo ganar.', `
    ${mundo(1)}
    ${flujo(223, 0.26)}
    ${motas(2020, 14)}
    ${panel(`
      ${escudo(300, 300, 480, 0.05)}
      <div style="position: absolute; left: 40px; top: 1130px; width: 1000px; height: 6px; border-radius: 3px; background: ${a('#FFFFFF', 0.6)}; box-shadow: 0 0 18px ${a(LUZ, 0.8)};"></div>
      ${sueltos}
      <div data-bola style="position: absolute; left: 100px; top: 1010px; width: 120px; height: 120px; transform-origin: 50% 100%;">
        <div data-bola-i style="position: absolute; inset: 0; border-radius: 50%; box-sizing: border-box; border: 4px solid #FFFFFF; background: radial-gradient(circle at 35% 30%, #FFFFFF, ${LUZ} 38%, ${ELEC} 100%); box-shadow: 0 0 34px ${a(LUZ, 0.9)}; display: flex; align-items: center; justify-content: center;">
          <img src="assets/escudo.png" alt="" style="width: 50%; height: auto; opacity: 0.55;">${pegados}
        </div>
      </div>`)}`));

// ── gan-pregunta ─────────────────────────────────────────────────────────
// La copa de la portada con un «?» gigante encima (solo el contorno, para que se vea la copa).
slides.push(lamina('gan-pregunta', 'Es difícil dar una respuesta simple a una situación tan compleja, pero díganme qué creen que sea lo que hace que los coreanos sean superiores.', `
    ${mundo(1.2)}
    ${flujo(227, 0.28)}
    ${motas(2121, 22)}
    ${panel(`
      ${escudo(90, 40, 900, 0.07)}
      ${copaImg({ x: 150, y: 40, w: 780, attrs: 'data-copa-p', filtro: `drop-shadow(0 0 40px ${a(LUZ, 0.35)})` })}
      <div style="position: absolute; left: 0; top: 0; width: 1080px; height: 1370px; overflow: hidden; pointer-events: none;">${texto('?', { x: 0, y: -90, w: 1080, size: 1500, clase: 'signo', attrs: 'data-signo-g' })}</div>`)}`));

// ── gan-cierre ───────────────────────────────────────────────────────────
// La copa a sangre; se apaga. GG EZ.
slides.push(lamina('gan-cierre', 'Y ni pedo, tocará leer a más de un prófugo del ácido fólico, pero solo queda decir gigi easy, nerfeen a los coreanos o nos van a meter la cuarta chao.', `
    ${mundo(1.2)}
    ${flujo(229, 0.28)}
    ${motas(2222, 22)}
    ${panel(`
      ${copaImg({ x: -140, y: -250, w: 1360, attrs: 'data-copa-z', filtro: `drop-shadow(0 0 60px ${a(LUZ, 0.45)})` })}
      <div data-velo style="position: absolute; left: 0; top: 700px; width: 1080px; height: 670px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, 0.82)} 65%); pointer-events: none;"></div>
      ${texto('GG EZ', { x: 0, y: 930, w: 1080, size: 400, attrs: 'data-ggez', extra: 'transform: rotate(-4deg);' })}`)}`));

// Orden del guion.
const ORDEN = ['gan-portada', 'gan-palmares', 'gan-triple', 'gan-importados', 'gan-mids', 'gan-gente', 'gan-proporcion', 'gan-dinero', 'gan-china', 'gan-lcs', 'gan-agua', 'gan-academias', 'gan-piramide', 'gan-europa', 'gan-matiz', 'gan-resumen', 'gan-cultura', 'gan-deporte', 'gan-entorno', 'gan-bola', 'gan-pregunta', 'gan-cierre'];
const idDe = (h) => /data-lamina="([^"]+)"/.exec(h)[1];
slides.sort((x, y) => ORDEN.indexOf(idDe(x)) - ORDEN.indexOf(idDe(y)));
if (slides.length !== ORDEN.length) throw new Error(`Faltan láminas: ${slides.length} de ${ORDEN.length}`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  // Las líneas de flujo derivan, el haz de luz se desplaza y las motas suben.
  function ambiente(tl, s, dur) {
    q(s, '[data-humo]').forEach(function (h) { tl.fromTo(h, { x: -30, y: 20 }, { x: 40, y: -50, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-haz]').forEach(function (h) { tl.fromTo(h, { x: -60 }, { x: 80, duration: dur, ease: 'none' }, 0); });
    q(s, '[data-horizonte]').forEach(function (h) { tl.fromTo(h, { opacity: 0.55 }, { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0); });
    q(s, '[data-brasa]').forEach(function (m, i) {
      tl.fromTo(m, { y: 40 + (i % 5) * 14, opacity: 0 }, { y: -60 - (i % 7) * 14, opacity: parseFloat(m.style.opacity), duration: dur, ease: 'none' }, 0);
    });
  }

  animar('gan-portada', function (tl, s) {
    ambiente(tl, s, 3.8);
    tl.from(uno(s, '[data-copa]'), { scale: 1.1, opacity: 0.2, y: 50, transformOrigin: '50% 45%', duration: 3.6, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-zona-kr]'), { opacity: 0, x: -120, duration: 1.4, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-zona-cn]'), { opacity: 0, x: 120, duration: 1.4, ease: 'power2.out' }, 0.15)
      .from(q(s, '[data-lado-kr]'), { x: -170, opacity: 0, duration: 0.6, stagger: 0.13, ease: 'back.out(1.5)' }, 0.5)
      .from(q(s, '[data-lado-cn]'), { x: 170, opacity: 0, duration: 0.6, stagger: 0.13, ease: 'back.out(1.5)' }, 0.65)
      .fromTo(uno(s, '[data-barrido]'), { x: 0, opacity: 0 }, { x: 1500, opacity: 1, duration: 1.8, ease: 'power1.inOut', immediateRender: false }, 0.8)
      .to(uno(s, '[data-barrido]'), { opacity: 0, duration: 0.3 }, 2.4)
      .from(q(s, '[data-letra]'), { yPercent: 110, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.6)' }, 1.5);
  });

  animar('gan-palmares', function (tl, s) {
    ambiente(tl, s, 4);
    // Caen en orden cronológico, 2011 → 2025.
    tl.from(q(s, '[data-ficha]'), { y: -240, opacity: 0, scale: 0.7, rotation: function (i) { return (i % 2 ? 1 : -1) * 12; }, duration: 0.55, stagger: 0.13, ease: 'back.out(1.4)' }, 0.1);
    q(s, '[data-num]').forEach(function (n, i) {
      var v = parseFloat(n.getAttribute('data-v'));
      efecto('contador', tl, n, { cuenta: v, dur: 0.5 + Math.min(1.3, v * 0.12), en: 2.1 + i * 0.12 });
      tl.from(n, { y: 40, opacity: 0, duration: 0.4, ease: 'power3.out' }, 2.1 + i * 0.12);
    });
    tl.from(q(s, '[data-conteo] > div:not([data-num])'), { opacity: 0, y: 14, duration: 0.4, stagger: 0.05 }, 2.3);
  });

  animar('gan-academias', function (tl, s) {
    ambiente(tl, s, 4.4);
    tl.from(uno(s, '[data-et-kr]'), { x: -50, opacity: 0, duration: 0.5 }, 0.05)
      .from(q(s, '[data-ficha-kr]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.07, ease: 'back.out(2)' }, 0.2);
    efecto('contador', tl, uno(s, '[data-kr-n]'), { cuenta: 10, dur: 0.8, en: 0.2 });
    tl.from(uno(s, '[data-kr-total]'), { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.3)
      .from(uno(s, '[data-linea]'), { scaleX: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.out' }, 1.1)
      .from(uno(s, '[data-et-eu]'), { x: -50, opacity: 0, duration: 0.5 }, 1.3)
      .from(q(s, '[data-ficha-eu]'), { y: 70, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.6)' }, 1.4);
    // VIT se apaga al final: parpadea y queda gris-azul, sin tachar.
    var vit = uno(s, '[data-apaga]');
    tl.to(vit, { keyframes: [{ opacity: 0.55, duration: 0.12 }, { opacity: 1, duration: 0.1 }, { opacity: 0.45, duration: 0.12 }, { opacity: 0.8, duration: 0.08 }, { opacity: 1, duration: 0.08 }], ease: 'none' }, 3.0)
      .to(vit, { borderColor: '${APAGADO}', boxShadow: '0 0 0 rgba(0,0,0,0), 0 10px 24px rgba(0,0,10,0.5)', duration: 0.7, ease: 'power2.inOut' }, 3.55)
      .to(vit.querySelector('img'), { opacity: 0.3, filter: 'grayscale(1)', duration: 0.7 }, 3.55)
      .to(vit.querySelector('[data-cod]'), { color: '${APAGADO}', duration: 0.7, ease: 'power2.inOut' }, 3.55)
      .to(vit.querySelector('[data-icono]'), { opacity: 0.25, duration: 0.7 }, 3.55);
  });

  // ═══ LÁMINAS 3 A 22 ═════════════════════════════════════════════════════
  // Entradas cortas: cada lámina dura lo que dura su frase; la animación termina y se queda quieta.
  function pops(tl, el, en, esc) { tl.from(el, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: esc || 0.08, ease: 'back.out(2)' }, en); }

  animar('gan-triple', function (tl, s) {
    ambiente(tl, s, 4.6);
    [0, 1, 2].forEach(function (g) {
      tl.from(q(s, '[data-bloque][data-g="' + g + '"]'), { scaleY: 0, opacity: 0, transformOrigin: '50% 100%', duration: 0.3, stagger: 0.09, ease: 'back.out(1.7)' }, 0.1 + g * 0.5);
    });
    tl.from(q(s, '[data-cod]'), { y: 24, opacity: 0, duration: 0.4, stagger: 0.18 }, 0.5);
    var fl = q(s, '[data-flecha]'), pu = q(s, '[data-punta]'), mu = q(s, '[data-mult]');
    [0, 1].forEach(function (i) {
      var t = 1.8 + i * 1.1;
      tl.from(fl[i], { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, t).from(pu[i], { opacity: 0, duration: 0.15 }, t + 0.6);
      efecto('contador', tl, mu[i], { cuenta: parseFloat(mu[i].getAttribute('data-v')), decimales: i, prefijo: '×', dur: 0.7, en: t + 0.2 });
      tl.from(mu[i], { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, t + 0.2);
    });
  });

  animar('gan-importados', function (tl, s) {
    ambiente(tl, s, 3.6);
    efecto('contador', tl, uno(s, '[data-n]'), { cuenta: 37, dur: 1.6, en: 0.5 });
    tl.from(uno(s, '[data-total]'), { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.2)
      .from(q(s, '[data-off]'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.25, stagger: 0.006 }, 0.1)
      .from(q(s, '[data-on]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.04, ease: 'back.out(2)' }, 0.5);
  });

  animar('gan-mids', function (tl, s) {
    ambiente(tl, s, 3.6);
    efecto('contador', tl, uno(s, '[data-n]'), { cuenta: 11, dur: 1.2, en: 0.5 });
    tl.from(uno(s, '[data-total]'), { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.2)
      .from(q(s, '[data-off]'), { opacity: 0, scale: 0.7, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.03 }, 0.1)
      .from(q(s, '[data-on]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.11, ease: 'back.out(2)' }, 0.5)
      .to(q(s, '[data-on]'), { scale: 1.07, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 1, stagger: 0.04, ease: 'sine.inOut' }, 2.2);
  });

  animar('gan-gente', function (tl, s) {
    ambiente(tl, s, 3.6);
    q(s, '[data-barra]').forEach(function (b, i) { tl.from(b, { scaleX: 0, duration: 1.4, ease: 'power2.out' }, 0.3 + i * 0.4); });
    q(s, '[data-num]').forEach(function (n, i) { efecto('contador', tl, n, { cuenta: parseFloat(n.getAttribute('data-v')), separador: '.', dur: 1.5, en: 0.3 + i * 0.4 }); });
    tl.from(q(s, '[data-cod]'), { x: -50, opacity: 0, duration: 0.5, stagger: 0.4 }, 0.2)
      .from(q(s, '[data-cifra]'), { opacity: 0, y: 20, duration: 0.4, stagger: 0.4 }, 0.3);
  });

  animar('gan-proporcion', function (tl, s) {
    ambiente(tl, s, 3.6);
    tl.from(uno(s, '[data-gran]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(1.6)' }, 0.2);
    pops(tl, q(s, '[data-pieza]'), 0.7, 0.05);
    tl.from(q(s, '[data-lab]'), { opacity: 0, y: 16, duration: 0.4, stagger: 0.1 }, 1.7);
    efecto('sello', tl, uno(s, '[data-signo]'), { en: 2.1, desde: 2.4, fuerza: 10 });
  });

  animar('gan-dinero', function (tl, s) {
    ambiente(tl, s, 4);
    var viga = uno(s, '[data-viga]'), pi = uno(s, '[data-plato-i]'), pd = uno(s, '[data-plato-d]'), est = { r: -0.3 }, L = 320, px = 540, py = 380;
    function pon() {
      var c = Math.cos(est.r), sn = Math.sin(est.r);
      viga.setAttribute('x1', px - L * c); viga.setAttribute('y1', py - L * sn); viga.setAttribute('x2', px + L * c); viga.setAttribute('y2', py + L * sn);
      pi.setAttribute('transform', 'translate(' + (px - L * c) + ' ' + (py - L * sn) + ')');
      pd.setAttribute('transform', 'translate(' + (px + L * c) + ' ' + (py + L * sn) + ')');
    }
    tl.from(uno(s, '[data-panel] svg'), { opacity: 0, y: 40, duration: 0.5 }, 0)
      .fromTo(est, { r: -0.3 }, { r: 0, duration: 2.6, ease: 'elastic.out(1,0.38)', onUpdate: pon, immediateRender: true }, 0.4)
      .from(q(s, '[data-plato-i] rect, [data-plato-d] rect'), { y: -220, opacity: 0, duration: 0.45, stagger: 0.1, ease: 'back.out(1.5)' }, 0.6);
    pon();
  });

  animar('gan-china', function (tl, s) {
    ambiente(tl, s, 4.4);
    var cards = q(s, '[data-card]'), logos = q(s, '[data-logo-c]'), copas = q(s, '[data-copa-c]'), anios = q(s, '[data-anio]'), nombres = q(s, '[data-nombre]');
    var anio = [2018, 2019, 2021], nIdx = [[0], [1], [2, 3]];
    for (var i = 0; i < 3; i++) {
      var t = 0.2 + i * 1.15;
      tl.from(cards[i], { y: 60, opacity: 0, duration: 0.55, ease: 'power3.out' }, t)
        .from(logos[i], { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, t + 0.15)
        .from(copas[i], { filter: 'brightness(0.45) drop-shadow(0 0 0px rgba(43,216,230,0))', opacity: 0.2, y: 40, duration: 0.7, ease: 'power2.out' }, t + 0.25);
      efecto('contador', tl, anios[i], { cuenta: anio[i], desde: anio[i] - 12, separador: '', dur: 0.7, en: t + 0.35 });
      nIdx[i].forEach(function (k, j) { tl.from(nombres[k], { scaleX: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(2)' }, t + 0.7 + j * 0.15); });
    }
  });

  animar('gan-lcs', function (tl, s) {
    ambiente(tl, s, 4.2);
    var segs = q(s, '[data-seg]');
    tl.from(q(s, '[data-seg]'), { scaleX: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out' }, 0.2);
    q(s, '[data-pct]').forEach(function (p, i) { efecto('contador', tl, p, { cuenta: parseFloat(p.getAttribute('data-v')), sufijo: ' %', dur: 0.9, en: 0.3 + i * 0.25 }); });
    tl.from(uno(s, '[data-copa-vacia]'), { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' }, 1.4)
      .from(q(s, '[data-na-logo]'), { y: 40, opacity: 0, duration: 0.45, stagger: 0.12, ease: 'back.out(1.6)' }, 1.8);
    efecto('sello', tl, uno(s, '[data-cero]'), { en: 2.4, desde: 2.4, temblor: 'no' });
  });

  animar('gan-agua', function (tl, s) {
    ambiente(tl, s, 4.4);
    var gota = uno(s, '[data-gota]'), agua = uno(s, '[data-agua]');
    tl.from(uno(s, '[data-vaso]'), { drawSVG: '0%', duration: 1.0, ease: 'power2.inOut' }, 0)
      .from(agua, { opacity: 0, duration: 0.6 }, 0.5)
      .from(gota, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.3 }, 0.6)
      .to(gota, { y: 420, duration: 0.8, ease: 'power2.in' }, 0.9)
      .to(gota, { opacity: 0, duration: 0.08 }, 1.68)
      .to(agua, { y: -14, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.7);
    tl.fromTo(uno(s, '[data-onda1]'), { x: 0 }, { x: -238.8, duration: 4.4, ease: 'none' }, 0)
      .fromTo(uno(s, '[data-onda2]'), { x: -238.8 }, { x: 0, duration: 4.4, ease: 'none' }, 0);
    q(s, '[data-ondita]').forEach(function (o, i) {
      tl.fromTo(o, { attr: { rx: 20, ry: 5 }, opacity: 0.9 }, { attr: { rx: 270, ry: 48 }, opacity: 0, duration: 1.6, ease: 'power2.out', immediateRender: false }, 1.7 + i * 0.35);
    });
  });

  animar('gan-piramide', function (tl, s) {
    ambiente(tl, s, 4.6);
    var niv = q(s, '[data-nivel]'), nums = q(s, '[data-num-niv]');
    [2, 1, 0].forEach(function (i, k) {
      tl.from(niv[i], { y: 140, opacity: 0, duration: 0.55, ease: 'back.out(1.5)' }, 0.2 + k * 0.4)
        .from(nums[i], { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, 0.35 + k * 0.4);
    });
    tl.from(uno(s, '[data-nivel4]'), { y: 90, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.7)
      .from(uno(s, '[data-num-niv4]'), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, 1.85)
      .from(uno(s, '[data-corchete]'), { drawSVG: '0%', duration: 1.1, ease: 'power2.inOut' }, 2.6);
  });

  animar('gan-europa', function (tl, s) {
    ambiente(tl, s, 5);
    efecto('contador', tl, uno(s, '[data-diez]'), { cuenta: 10, dur: 0.7, en: 0.2 });
    tl.from(uno(s, '[data-diez]'), { scale: 0.7, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.2)
      .from(q(s, '[data-lec]'), { scale: 0.5, opacity: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.04, ease: 'back.out(1.6)' }, 0.3)
      .from(uno(s, '[data-candado]'), { scale: 0, rotation: -50, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2.2)' }, 0.9);
    pops(tl, q(s, '[data-liga]'), 1.3, 0.05);
    efecto('contador', tl, uno(s, '[data-trece]'), { cuenta: 13, dur: 0.8, en: 1.4 });
    tl.from(uno(s, '[data-trece]'), { opacity: 0, y: 20, duration: 0.4 }, 1.4);
    var fl = q(s, '[data-flecha]'), pu = q(s, '[data-punta]'), co = q(s, '[data-corte]');
    fl.forEach(function (f, i) {
      var t = 2.3 + i * 0.3;
      tl.from(f, { drawSVG: '0%', duration: 0.45, ease: 'power2.in' }, t).from(pu[i], { opacity: 0, duration: 0.1 }, t + 0.4)
        .from(co[i], { drawSVG: '0%', duration: 0.25, ease: 'power2.out' }, t + 0.5);
    });
    tl.from(uno(s, '[data-anio22]'), { opacity: 0, x: 40, duration: 0.5 }, 3.5);
    efecto('sello', tl, uno(s, '[data-academia]'), { en: 3.8, desde: 2.6, fuerza: 10 });
  });

  animar('gan-matiz', function (tl, s) {
    ambiente(tl, s, 4.8);
    tl.from(q(s, '[data-copa-kr]'), { opacity: 0, y: -60, scale: 0.4, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.12, ease: 'back.out(1.8)' }, 0.2)
      .from(uno(s, '[data-franja]'), { scaleX: 0, duration: 1.2, ease: 'power2.out' }, 1.5)
      .from(uno(s, '[data-copa-na]'), { opacity: 0, duration: 0.5 }, 2.7)
      .from(uno(s, '[data-marca21]'), { scaleY: 0, duration: 0.8, ease: 'power2.out' }, 2.0)
      .from(uno(s, '[data-marca21-i]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' }, 2.6);
    efecto('sello', tl, uno(s, '[data-marca21-t]'), { en: 2.9, desde: 2.4, temblor: 'no' });
  });

  animar('gan-resumen', function (tl, s) {
    ambiente(tl, s, 4.6);
    var hip = q(s, '[data-hip]'), tra = q(s, '[data-trazo]'), ints = q(s, '[data-int]');
    hip.forEach(function (h, i) {
      var t = 0.2 + i * 0.7;
      tl.from(h, { y: 60, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, t)
        .from(tra[i], { drawSVG: '0%', duration: 0.4, ease: 'power2.inOut' }, t + 0.35)
        .from(ints[i], { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.4)' }, t + 0.6);
    });
  });

  animar('gan-cultura', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(q(s, '[data-monitor]'), { opacity: 0, y: 40, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, 0.2)
      .fromTo(uno(s, '[data-monitor][data-on]'), { opacity: 1 }, { keyframes: [{ opacity: 0.3, duration: 0.07 }, { opacity: 1, duration: 0.07 }, { opacity: 0.5, duration: 0.07 }, { opacity: 1, duration: 0.1 }], ease: 'none', immediateRender: false }, 1.0);
    efecto('sello', tl, uno(s, '[data-uno]'), { en: 1.3, desde: 2.4, fuerza: 12 });
    efecto('contador', tl, uno(s, '[data-anio25]'), { cuenta: 2025, desde: 2000, separador: '', dur: 1.2, en: 2.0 });
    tl.from(uno(s, '[data-anio25]'), { opacity: 0, y: 30, duration: 0.5 }, 2.0);
  });

  animar('gan-deporte', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(uno(s, '[data-panel] svg'), { opacity: 0, scale: 0.85, transformOrigin: '50% 47%', duration: 0.6, ease: 'back.out(1.4)' }, 0)
      .fromTo(uno(s, '[data-mano]'), { rotation: 0, svgOrigin: '540 640' }, { rotation: 1440, svgOrigin: '540 640', duration: 3.2, ease: 'power3.in', immediateRender: true }, 0.4)
      .fromTo(uno(s, '[data-estela]'), { rotation: 0 }, { rotation: 1440, duration: 3.2, ease: 'power3.in', immediateRender: true }, 0.4)
      .from(uno(s, '[data-estela]'), { opacity: 0, duration: 2.4, ease: 'power2.in' }, 0.4);
  });

  animar('gan-entorno', function (tl, s) {
    ambiente(tl, s, 4.6);
    tl.from(q(s, '[data-lck]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.09, ease: 'back.out(2)' }, 0.1);
    var gs = q(s, '[data-copa-e]'), ets = q(s, '[data-et]');
    gs.forEach(function (g, i) {
      var t = 1.2 + i * 0.5;
      tl.from(g, { opacity: 0, y: 60, scale: 1.2, duration: 0.5, ease: 'power3.out' }, t).from(ets[i], { opacity: 0, y: 20, duration: 0.35 }, t + 0.25);
    });
    tl.from(uno(s, '[data-sep]'), { scaleY: 0, duration: 0.5, ease: 'power2.out' }, 2.2)
      .from(uno(s, '[data-copa-t]'), { opacity: 0, y: 60, duration: 0.6, ease: 'power3.out' }, 2.6)
      .from(uno(s, '[data-et-t]'), { opacity: 0, scale: 1.6, transformOrigin: '50% 50%', duration: 0.4, ease: 'power4.in' }, 3.0);
  });

  animar('gan-bola', function (tl, s) {
    ambiente(tl, s, 4.4);
    var bola = uno(s, '[data-bola]'), inter = uno(s, '[data-bola-i]'), T = 3.3, T0 = 0.4;
    var sueltos = q(s, '[data-suelto]'), pegados = q(s, '[data-pegado]');
    // La bola rueda con aceleración (ease cuadrática) y crece; cada punto se le pega cuando su borde lo toca.
    tl.from(sueltos, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05 }, 0.05)
      .fromTo(bola, { x: 0, scale: 1 }, { x: 650, scale: 2.9, duration: T, ease: 'power1.in', immediateRender: true }, T0)
      .fromTo(inter, { rotation: 0 }, { rotation: 1100, duration: T, ease: 'power1.in', immediateRender: true }, T0);
    sueltos.forEach(function (d, i) {
      var xd = parseFloat(d.style.left) + 14, tc = T;
      for (var k = 0; k <= 1000; k++) {
        var u = Math.pow(k / 1000, 2), xc = 100 + 60 + 650 * u, r = 60 * (1 + 1.9 * u);
        if (Math.abs(xd - xc) <= r * 0.75) { tc = (k / 1000) * T; break; }
      }
      tl.set(d, { opacity: 0 }, T0 + tc).fromTo(pegados[i], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.15, immediateRender: false }, T0 + tc);
    });
  });

  animar('gan-pregunta', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(uno(s, '[data-copa-p]'), { opacity: 0.2, scale: 1.12, transformOrigin: '50% 45%', duration: 3.2, ease: 'power2.out' }, 0);
    efecto('sello', tl, uno(s, '[data-signo-g]'), { en: 1.0, desde: 1.6, fuerza: 14 });
  });

  animar('gan-cierre', function (tl, s) {
    ambiente(tl, s, 4);
    tl.from(uno(s, '[data-copa-z]'), { scale: 1.1, transformOrigin: '50% 45%', duration: 3.2, ease: 'power2.out' }, 0)
      .fromTo(uno(s, '[data-copa-z]'), { opacity: 1 }, { opacity: 0.16, duration: 1.8, ease: 'power2.inOut', immediateRender: false }, 1.0)
      .from(uno(s, '[data-velo]'), { opacity: 0, duration: 0.6 }, 0.4)
      .from(uno(s, '[data-ggez]'), { scale: 2.4, opacity: 0, duration: 0.45, ease: 'power4.in' }, 2.0);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>¿Por qué siempre ganan chinos y coreanos?</title>
${kit.og({ titulo: '¿Por qué siempre ganan chinos y coreanos?', descripcion: 'Láminas animadas del video de Axelsine: palmarés, importados, academias y la pirámide coreana, con una pregunta abierta.', carpeta: 'creator/ganan' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .plata { background: linear-gradient(180deg, #FFFFFF 0%, ${PLATA} 45%, #8E97BE 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 24px rgba(0,0,16,0.85)); }
.cian { background: linear-gradient(180deg, #FFFFFF 0%, #A8F4FA 40%, ${CIAN} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 26px ${a(CIAN, 0.6)}); }
  .cero { -webkit-text-fill-color: transparent; -webkit-text-stroke: 10px ${APAGADO}; }
  .signo { -webkit-text-fill-color: ${a(CIAN, 0.12)}; -webkit-text-stroke: 12px ${CIAN}; filter: drop-shadow(0 0 30px ${a(CIAN, 0.8)}); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.5)}; border-radius: 999px;
    background: rgba(2,3,28,0.85); color: ${LUZ}; cursor: pointer;
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
${kit.gsap(__dirname, ['DrawSVG'])}
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
