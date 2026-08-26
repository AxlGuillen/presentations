// Generador de index.html — Deck vertical "Todo lo que está debajo de Master es low elo"
// Ejecutar: node gen.js
// Datos verificados 21/08/2026 — fuentes: esportstales.com (distribución),
// replays.lol/cutoff (cortes Challenger), lols.gg (top 1 mundial).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG (y demás helpers de build-time)

// ── Datos ────────────────────────────────────────────────────────────────
// % de jugadores por tier (soloQ, agosto 2026, esportstales.com)
const TIERS = [
  { id: 'iron',        nombre: 'Hierro',       pct: 3.4,   lp: 0 },
  { id: 'bronze',      nombre: 'Bronce',       pct: 15.8,  lp: 400 },
  { id: 'silver',      nombre: 'Plata',        pct: 21.1,  lp: 800 },
  { id: 'gold',        nombre: 'Oro',          pct: 23.5,  lp: 1200 },
  { id: 'platinum',    nombre: 'Platino',      pct: 18.4,  lp: 1600 },
  { id: 'emerald',     nombre: 'Esmeralda',    pct: 12.9,  lp: 2000 },
  { id: 'diamond',     nombre: 'Diamante',     pct: 4.05,  lp: 2400 },
  { id: 'master',      nombre: 'Master',       pct: 0.83,  lp: 2800 },
  { id: 'grandmaster', nombre: 'Gran Maestro', pct: 0.054, lp: null }, // corte flotante, entre Master y Challenger
  { id: 'challenger',  nombre: 'Challenger',   pct: 0.023, lp: null }, // corte flotante por server
];

// Corte de Challenger por servidor (LP arriba de Master 0) — replays.lol, 21/08/2026
const CORTES = [
  { id: 'LAS', lp: 1267 },
  { id: 'LAN', lp: 1507 },
  { id: 'NA',  lp: 1541 },
  { id: 'KR',  lp: 1831 },
  { id: 'BR',  lp: 2004 },
  { id: 'EUW', lp: 2377 },
];

const IRON_A_MASTER = 2800;          // 28 divisiones × 100 LP
const BRONCE_A_DIAMANTE = 2000;      // 20 divisiones × 100 LP
const CORTE_EUW = 2377;
const TOP1 = { nombre: 'J1HUIV', server: 'EUW', lp: 5219, wr: '55%' }; // OP.GG 21/08/2026 (captura de Axl)
const CAMINO_EUW = IRON_A_MASTER + CORTE_EUW;                 // 5,177
const MITAD_EUW = Math.round(CAMINO_EUW / 2);                 // 2,588 → cae en Diamante
const CORTE_FINO = Math.round((IRON_A_MASTER + TOP1.lp) / 2) - IRON_A_MASTER; // ≈ Master +1,172

// ── Identidad visual (Hextech: azul profundo + dorado LoL) ───────────────
const BG = '#010A13';
const GOLD = '#C89B3C';
const CREAM = '#F0E6D2';
const TEAL = '#0AC8B9';
const CARD = 'background: linear-gradient(160deg, #0E1B26, #050C14); border: 1px solid rgba(200,155,60,0.35);';
const FONT = `font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif;`;
const TITLE = `font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -1px; line-height: 1.04; background: linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; color: transparent;`;

const NB = ' ';
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const emblem = (id, size, extra = '') =>
  `<img src="assets/emblems/${id}.png" alt="" style="width: ${size}px; height: ${size}px; object-fit: contain; flex: none; ${extra}">`;

const footer = `<div style="position: absolute; bottom: 26px; left: 0; right: 0; text-align: center; font-size: 19px; font-weight: 600; letter-spacing: 2px; color: rgba(240,230,210,0.35); text-transform: uppercase;">@axelsine13 · datos 21/08/2026</div>`;

const baseSection = (label, screen, notes, inner, glow = `radial-gradient(130% 55% at 50% 0%, rgba(200,155,60,0.18) 0%, rgba(0,0,0,0) 60%)`) =>
  `<section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notes}" style="background: ${BG}; background-image: ${glow}; ${FONT} color: ${CREAM}; display: flex; flex-direction: column; padding: 110px 64px 70px; box-sizing: border-box; overflow: hidden; position: relative;">
${inner}
${footer}
  </section>`;

// ── Slide 1 · Portada ────────────────────────────────────────────────────
const portada = `<section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Tema polemico: todo lo que esta debajo de Master es low elo. El corte no se define por gente sino por LP." style="background: ${BG}; background-image: radial-gradient(130% 60% at 50% 8%, rgba(200,155,60,0.28) 0%, rgba(0,0,0,0) 62%); ${FONT} color: ${CREAM}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 90px 70px; box-sizing: border-box; overflow: hidden; position: relative;">
    <div data-a="img">${emblem('master', 460, 'filter: drop-shadow(0 30px 60px rgba(200,155,60,0.35));')}</div>
    <h1 data-a="up" style="${TITLE} font-size: 108px; margin: 30px 0 0;">Todo lo que está<br>debajo de Master<br>es <span style="background: linear-gradient(180deg, ${GOLD}, #8A6420); -webkit-background-clip: text; background-clip: text; color: transparent;">low elo</span></h1>
    <p data-a="up2" style="margin: 40px 0 0; font-size: 30px; font-weight: 600; color: rgba(240,230,210,0.75); max-width: 760px; line-height: 1.4;">El rango lo define el LP que recorriste,<br>no cuánta gente vive en tu división.</p>
    <div data-a="up3" style="margin-top: 56px; display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD};">Axelsine · 21/08/2026</div>
  </section>`;

// ── Slide 2 · La campana (distribución por gente) ───────────────────────
const MAXPCT = 23.5;
const BARW = 420, ROWH = 96; // barra de ancho fijo para poder trazar la curva encima
const filasCampana = TIERS.map((t, i) => {
  const w = Math.max((t.pct / MAXPCT) * 100, 1.2);
  const esLow = ['iron', 'bronze', 'silver', 'gold'].includes(t.id);
  const color = esLow ? GOLD : (t.id === 'master' || t.id === 'grandmaster' || t.id === 'challenger') ? TEAL : 'rgba(240,230,210,0.45)';
  return `<div style="display: flex; align-items: center; gap: 16px; height: ${ROWH}px;">
      ${emblem(t.id, 76)}
      <div style="width: 230px; flex: none; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">${t.nombre}</div>
      <div style="width: ${BARW}px; flex: none; height: 46px; border-radius: 10px 0; background: rgba(255,255,255,0.06); overflow: hidden;">
        <div data-grow style="width: ${w}%; height: 100%; background: ${color}; border-radius: 10px 0; animation-delay: ${(0.25 + i * 0.09).toFixed(2)}s;"></div>
      </div>
      <div style="flex: 1; text-align: right; font-size: 26px; font-weight: 800; font-style: italic; color: ${color};">${t.pct}%</div>
    </div>`;
}).join('');

// La curva de la campana: pasa por la punta de cada barra
const pts = TIERS.map((t, i) => [(t.pct / MAXPCT) * BARW, i * ROWH + ROWH / 2]);
let dCurva = `M ${pts[0][0].toFixed(1)} ${pts[0][1]}`;
for (let i = 1; i < pts.length - 1; i++) {
  const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
  dCurva += ` Q ${pts[i][0].toFixed(1)} ${pts[i][1]} ${mx.toFixed(1)} ${my}`;
}
dCurva += ` L ${pts[9][0].toFixed(1)} ${pts[9][1]}`;
const curvaSvg = `<svg class="curva" viewBox="0 0 ${BARW} ${ROWH * 10}" style="position: absolute; left: ${76 + 16 + 230 + 16}px; top: 0; width: ${BARW}px; height: ${ROWH * 10}px; overflow: visible; pointer-events: none;">
      <path d="${dCurva}" fill="none" stroke="${TEAL}" stroke-width="6" stroke-dasharray="16 14" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 14px rgba(10,200,185,0.65));"/>
    </svg>`;

const campana = baseSection(
  'La campana — % de jugadores por rango', 'La campana',
  'Asi se reparte la gente: dos de cada tres viven entre Hierro y Oro. Diamante ya es top 5. Pero esto mide gente amontonada, no altura.',
  `<h2 data-a="up" style="${TITLE} font-size: 66px; margin: 0 0 10px;">La campanita<br>de la distribución</h2>
    <p data-a="up" style="margin: 6px 0 30px; font-size: 26px; font-weight: 600; color: rgba(240,230,210,0.65);">% de jugadores por rango · soloQ · agosto 2026</p>
    <div data-a="up2" style="display: flex; flex-direction: column; position: relative;">${filasCampana}${curvaSvg}</div>
    <div data-a="up3" style="margin-top: 34px; display: flex; gap: 20px;">
      <div style="${CARD} border-radius: 34px 0; padding: 24px 28px; flex: 1;">
        <div style="font-size: 46px; font-weight: 800; font-style: italic; color: ${GOLD}; line-height: 1;">63.8%</div>
        <div style="margin-top: 8px; font-size: 22px; font-weight: 600; color: rgba(240,230,210,0.75); line-height: 1.35;">vive entre Hierro y Oro — 2 de cada 3 jugadores</div>
      </div>
      <div style="${CARD} border-color: rgba(10,200,185,0.4); border-radius: 34px 0; padding: 24px 28px; flex: 1;">
        <div style="font-size: 46px; font-weight: 800; font-style: italic; color: ${TEAL}; line-height: 1;">0.9%</div>
        <div style="margin-top: 8px; font-size: 22px; font-weight: 600; color: rgba(240,230,210,0.75); line-height: 1.35;">llega a Master o más — pero, ¿eso define el corte?</div>
      </div>
    </div>`
);

// ── Slide 3 · El edificio ───────────────────────────────────────────────
const pisos = [...TIERS].reverse().map((t, idx) => {
  const w = Math.max((t.pct / MAXPCT) * 640, 60);
  const esAlto = ['master', 'grandmaster', 'challenger'].includes(t.id);
  const delay = (0.25 + (9 - idx) * 0.1).toFixed(2); // nacen de abajo hacia arriba
  return `<div style="display: flex; align-items: center; gap: 18px; height: 118px;">
      ${emblem(t.id, 78)}
      <div style="flex: 1; display: flex; justify-content: center;">
        <div data-grow-c style="width: ${w}px; height: 100px; ${CARD} ${esAlto ? `border-color: rgba(10,200,185,0.55); box-shadow: 0 0 30px rgba(10,200,185,0.12);` : ''} border-radius: 12px 0; animation-delay: ${delay}s;"></div>
      </div>
      <div style="width: 120px; flex: none; text-align: right; font-size: 23px; font-weight: 800; font-style: italic; color: ${esAlto ? TEAL : 'rgba(240,230,210,0.75)'};">${t.pct}%</div>
    </div>`;
}).join('');

const edificio = baseSection(
  'El edificio — la altura no son vecinos', 'El edificio',
  'Metafora: presumir high elo por percentiles es presumir que vives arriba porque en tu piso viven poquitos. La altura se mide en pisos, no en vecinos.',
  `<h2 data-a="up" style="${TITLE} font-size: 66px; margin: 0 0 10px;">¿En qué piso vives?</h2>
    <p data-a="up" style="margin: 6px 0 24px; font-size: 26px; font-weight: 600; color: rgba(240,230,210,0.65);">Cada piso, un rango · su ancho: cuánta gente vive ahí</p>
    <div data-a="up2" style="display: flex; flex-direction: column; align-items: stretch;">${pisos}</div>
    <div data-a="up3" style="margin-top: 30px; ${CARD} border-radius: 34px 0; padding: 28px 34px; text-align: center;">
      <div style="font-size: 40px; font-weight: 800; font-style: italic; text-transform: uppercase; color: ${GOLD}; line-height: 1.2;">La altura se mide en pisos,<br>no en vecinos</div>
    </div>`,
  `radial-gradient(130% 55% at 50% 100%, rgba(200,155,60,0.14) 0%, rgba(0,0,0,0) 60%)`
);

// ── Slide 4 · El camino en LP (EUW, a escala) ───────────────────────────
const CAMINO_TOTAL = IRON_A_MASTER + TOP1.lp;      // 8,019 LP: de Hierro IV al top 1 mundial
const MITAD_TOTAL = Math.round(CAMINO_TOTAL / 2);  // ≈ 4,010 → Master +1,210
const H_TRACK = 1430; // px que representan CAMINO_TOTAL
const y = lp => Math.round((lp / CAMINO_TOTAL) * H_TRACK);
const delayLp = lp => (0.2 + (lp / CAMINO_TOTAL) * 1.3).toFixed(2); // aparece cuando la barra "pasa" por ahí
const marcas = TIERS.filter(t => t.lp !== null).map(t => `
    <div data-fade style="position: absolute; left: 0; bottom: ${y(t.lp) - 32}px; display: flex; align-items: center; gap: 12px; animation-delay: ${delayLp(t.lp)}s;">
      ${emblem(t.id, 62)}
      <div>
        <div style="font-size: 21px; font-weight: 700;">${t.nombre}</div>
        <div style="font-size: 17px; font-weight: 600; color: rgba(240,230,210,0.5);">${fmt(t.lp)} LP</div>
      </div>
    </div>`).join('');

// Cortes de Challenger por servidor, como marcas intermedias del tramo apex
const cortesTicks = CORTES.filter(c => ['LAS', 'KR', 'EUW'].includes(c.id)).map(c => `
    <div data-fade style="position: absolute; left: 356px; bottom: ${y(IRON_A_MASTER + c.lp) - 13}px; display: flex; align-items: center; gap: 10px; animation-delay: ${delayLp(IRON_A_MASTER + c.lp)}s;">
      <div style="width: 34px; height: 3px; background: rgba(240,230,210,0.55); flex: none;"></div>
      <div style="font-size: 19px; font-weight: 700; color: rgba(240,230,210,0.8); white-space: nowrap;">Corte Challenger ${c.id} <span style="font-weight: 600; color: rgba(240,230,210,0.45);">· ${fmt(IRON_A_MASTER + c.lp)} LP</span></div>
    </div>`).join('');

const camino = baseSection(
  'El camino en LP — de Hierro al top 1', 'El camino',
  'El camino completo a escala: de Hierro a Master 2800 LP, luego los cortes de Challenger por servidor, y hasta arriba el top 1 mundial. La mitad exacta cae arriba de Master.',
  `<h2 data-a="up" style="${TITLE} font-size: 66px; margin: 0 0 10px;">El camino real, a escala</h2>
    <p data-a="up" style="margin: 6px 0 26px; font-size: 26px; font-weight: 600; color: rgba(240,230,210,0.65);">De Hierro IV al top 1 mundial: ${fmt(CAMINO_TOTAL)} LP · cortes del 21/08</p>
    <div data-a="up2" style="position: relative; height: ${H_TRACK + 90}px; margin-left: 8px;">
      <div data-grow-y style="position: absolute; left: 330px; bottom: 0; width: 26px; height: ${H_TRACK}px; border-radius: 13px; background: linear-gradient(180deg, ${TEAL} 0%, ${TEAL} ${100 - (IRON_A_MASTER / CAMINO_TOTAL) * 100}%, ${GOLD} ${100 - (IRON_A_MASTER / CAMINO_TOTAL) * 100}%, #6B4E1B 100%);"></div>
      ${marcas}
      ${cortesTicks}
      <div data-fade style="position: absolute; left: 356px; bottom: ${y(CAMINO_TOTAL) - 46}px; display: flex; align-items: center; gap: 14px; animation-delay: ${delayLp(CAMINO_TOTAL)}s;">
        ${emblem('challenger', 92)}
        <div>
          <div style="font-size: 24px; font-weight: 800; color: ${TEAL};">Top 1 mundial · ${TOP1.nombre}</div>
          <div style="font-size: 19px; font-weight: 600; color: rgba(240,230,210,0.55);">${fmt(TOP1.lp)} LP en Challenger · ${fmt(CAMINO_TOTAL)} desde Hierro</div>
        </div>
      </div>
      <div data-fade style="position: absolute; left: 356px; bottom: ${y(IRON_A_MASTER + 700) - 12}px; display: flex; align-items: center; gap: 10px; opacity: 0.8; animation-delay: ${delayLp(IRON_A_MASTER + 700)}s;">
        <div style="width: 34px; height: 3px; background: rgba(240,230,210,0.35); flex: none;"></div>
        <div style="font-size: 19px; font-weight: 600; color: rgba(240,230,210,0.55); white-space: nowrap;">Gran Maestro, en medio del brinco</div>
      </div>
      <div data-fade style="position: absolute; left: 0; width: 322px; bottom: ${y(MITAD_TOTAL)}px; border-top: 3px dashed ${TEAL}; animation-delay: 1.7s;">
        <div style="position: absolute; left: 0; top: -50px; font-size: 23px; font-weight: 800; font-style: italic; text-transform: uppercase; color: ${TEAL};">Mitad del camino</div>
        <div style="position: absolute; left: 0; top: 8px; font-size: 20px; font-weight: 600; color: rgba(10,200,185,0.85);">${fmt(MITAD_TOTAL)} LP ≈ Master +${fmt(MITAD_TOTAL - IRON_A_MASTER)}</div>
      </div>
    </div>`
);

// ── Slide 5 · El brinco por servidor ────────────────────────────────────
const filasCortes = CORTES.map(c => {
  const w = (c.lp / IRON_A_MASTER) * 100;
  const esEuw = c.id === 'EUW';
  return `<div style="display: flex; align-items: center; gap: 20px; height: 132px;">
      <div style="width: 120px; flex: none; font-size: 34px; font-weight: 800; font-style: italic; color: ${esEuw ? GOLD : CREAM};">${c.id}</div>
      <div style="flex: 1; height: 56px; border-radius: 12px 0; background: rgba(255,255,255,0.06); overflow: hidden; position: relative;">
        <div style="width: ${w}%; height: 100%; background: ${esEuw ? GOLD : 'rgba(10,200,185,0.75)'}; border-radius: 12px 0;"></div>
      </div>
      <div style="width: 190px; flex: none; text-align: right; font-size: 30px; font-weight: 800; font-style: italic; color: ${esEuw ? GOLD : TEAL};">${fmt(c.lp)} LP</div>
    </div>`;
}).join('');

const servidores = baseSection(
  'Master a Challenger por servidor', 'Por servidor',
  'El brinco de Master a Challenger por servidor, comparado contra el camino completo de Hierro a Master que son 2800 LP. En Europa son 2377: casi el camino entero otra vez.',
  `<h2 data-a="up" style="${TITLE} font-size: 66px; margin: 0 0 10px;">Master → Challenger,<br>según tu servidor</h2>
    <p data-a="up" style="margin: 6px 0 30px; font-size: 26px; font-weight: 600; color: rgba(240,230,210,0.65);">La barra completa = Hierro → Master (${fmt(IRON_A_MASTER)} LP, 28 divisiones)</p>
    <div data-a="up2" style="display: flex; align-items: center; gap: 20px; height: 132px; opacity: 0.9;">
      <div style="width: 120px; flex: none; display: flex;">${emblem('iron', 54)}${emblem('master', 54)}</div>
      <div style="flex: 1; height: 56px; border-radius: 12px 0; background: rgba(240,230,210,0.28);"></div>
      <div style="width: 190px; flex: none; text-align: right; font-size: 30px; font-weight: 800; font-style: italic; color: ${CREAM};">${fmt(IRON_A_MASTER)} LP</div>
    </div>
    <div data-a="up2" style="border-top: 1px solid rgba(255,255,255,0.12); margin: 6px 0 6px;"></div>
    ${filasCortes}
    <div data-a="up3" style="margin-top: 28px; ${CARD} border-radius: 34px 0; padding: 24px 30px; font-size: 25px; font-weight: 600; line-height: 1.4; color: rgba(240,230,210,0.85);">Riot puso el piso en <b style="color: ${GOLD};">800 LP</b>, pero el corte real flota con el ladder. Datos del 21/08/2026 — replays.lol</div>`
);

// ── Slide 6 · La cúspide (top 1) ────────────────────────────────────────
const H1 = 470;                                   // torre Hierro→Master
const H2 = Math.round((TOP1.lp / IRON_A_MASTER) * H1); // torre Master→top1 a la misma escala
const cuspide = baseSection(
  'La cúspide — top 1 mundial', 'La cúspide',
  'El numero uno del mundo esta 5144 LP arriba de Master: casi dos veces el camino completo de Hierro a Master. Pero Challenger top 500 y top 1 son el mismo rango: ese camino no lo contamos.',
  `<h2 data-a="up" style="${TITLE} font-size: 66px; margin: 0 0 10px;">Y arriba del corte...<br>sigue la montaña</h2>
    <p data-a="up" style="margin: 6px 0 34px; font-size: 26px; font-weight: 600; color: rgba(240,230,210,0.65);">Top 1 mundial hoy: <b style="color: ${GOLD};">${TOP1.nombre}</b> · ${TOP1.server} · ${fmt(TOP1.lp)} LP arriba de Master</p>
    <div data-a="up2" style="display: flex; align-items: flex-end; justify-content: center; gap: 90px; height: ${H2 + 130}px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <div style="width: 190px; height: ${H1}px; border-radius: 16px 0; background: linear-gradient(180deg, ${GOLD}, #5C431A); display: flex; align-items: flex-start; justify-content: center; padding-top: 16px; box-sizing: border-box;">${emblem('master', 84)}</div>
        <div style="text-align: center; font-size: 23px; font-weight: 700; line-height: 1.3;">Hierro → Master<br><span style="color: ${GOLD}; font-style: italic; font-weight: 800;">${fmt(IRON_A_MASTER)} LP</span></div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <div style="width: 190px; height: ${H2}px; border-radius: 16px 0; background: linear-gradient(180deg, ${TEAL}, #044A44); display: flex; align-items: flex-start; justify-content: center; padding-top: 16px; box-sizing: border-box; box-shadow: 0 0 60px rgba(10,200,185,0.18); position: relative;">${emblem('challenger', 96)}
          ${CORTES.filter(c => ['LAS', 'KR', 'EUW'].includes(c.id)).map(c => `<div style="position: absolute; left: 0; right: 0; bottom: ${Math.round((c.lp / TOP1.lp) * H2)}px; border-top: 2px dashed rgba(255,255,255,0.6);"><span style="position: absolute; right: 8px; top: 5px; font-size: 17px; font-weight: 700; color: #FFFFFF; opacity: 0.9;">corte ${c.id} · ${fmt(c.lp)}</span></div>`).join('')}
        </div>
        <div style="text-align: center; font-size: 23px; font-weight: 700; line-height: 1.3;">Master → top 1<br><span style="color: ${TEAL}; font-style: italic; font-weight: 800;">${fmt(TOP1.lp)} LP</span></div>
      </div>
    </div>
    <div data-a="up3" style="margin-top: 32px; ${CARD} border-radius: 34px 0; padding: 24px 30px; font-size: 25px; font-weight: 600; line-height: 1.45; color: rgba(240,230,210,0.85);">Esa sería la cúspide real... pero el <b style="color: ${TEAL};">Challenger top 500 y el top 1 son el mismo rango</b>, así que ese camino ni lo contamos. Con el corte nos sobra.</div>`,
  `radial-gradient(130% 55% at 50% 0%, rgba(10,200,185,0.16) 0%, rgba(0,0,0,0) 60%)`
);

// ── Slide 7 · La tesis ──────────────────────────────────────────────────
const tesis = `<section data-label="Tesis — ser raro no es ser alto" data-screen-label="Tesis" data-speaker-notes="Tesis: el ranked mide habilidad, no popularidad. Ser raro no es ser alto. Corte fino: techo del top 1 entre dos, cae en Master con mil y pico de LP. Comenta donde pondrias el corte." style="background: ${BG}; background-image: radial-gradient(130% 60% at 50% 100%, rgba(200,155,60,0.22) 0%, rgba(0,0,0,0) 60%); ${FONT} color: ${CREAM}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 70px; box-sizing: border-box; overflow: hidden; position: relative;">
    <h2 data-a="up" style="${TITLE} font-size: 104px; margin: 0;">Ser raro<br>no es ser alto</h2>
    <p data-a="up2" style="margin: 44px 0 0; font-size: 30px; font-weight: 600; color: rgba(240,230,210,0.8); max-width: 820px; line-height: 1.5;">El ranked existe para medir <b style="color: ${GOLD};">habilidad</b>, no popularidad. El rango lo define el LP que recorriste, no cuántos están hardstuck en él.</p>
    <div data-a="up3" style="margin-top: 54px; ${CARD} border-radius: 34px 0; padding: 30px 40px; max-width: 800px;">
      <div style="font-size: 22px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(240,230,210,0.55);">El corte fino</div>
      <div style="margin-top: 12px; font-size: 34px; font-weight: 800; font-style: italic; color: ${GOLD}; line-height: 1.3;">(${fmt(IRON_A_MASTER)} + ${fmt(TOP1.lp)}) ÷ 2 ≈ Master +${fmt(CORTE_FINO)} LP</div>
      <div style="margin-top: 12px; font-size: 23px; font-weight: 600; color: rgba(240,230,210,0.7);">del piso de Hierro IV al techo del top 1, partido a la mitad</div>
    </div>
    <p data-a="up3" style="margin: 50px 0 0; font-size: 27px; font-weight: 700; color: ${TEAL};">¿Dónde pondrías tú el corte? Te leo en comentarios.</p>
    ${footer}
  </section>`;

// ── Documento ────────────────────────────────────────────────────────────
const slides = [portada, campana, edificio, camino, servidores, cuspide, tesis].join('\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Low Elo vs High Elo — El corte por LP</title>
${kit.og({ titulo: "Low Elo vs High Elo · El corte por LP", descripcion: "Dónde empieza de verdad el high elo: el corte por puntos de liga, no por percepción.", carpeta: "lowelo" })}
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,401,500,501,600,601,700,701&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
  @keyframes dsImg { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: none; } }
  @keyframes dsGrowX { from { transform: scaleX(0); } to { transform: none; } }
  @keyframes dsGrowY { from { transform: scaleY(0); } to { transform: none; } }
  @keyframes dsDraw { to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.7s 0.15s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.8s 0.28s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="img"] { animation: dsImg 0.9s 0.1s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-grow] { transform-origin: left center; animation: dsGrowX 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-grow-c] { transform-origin: center; animation: dsGrowX 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-grow-y] { transform-origin: center bottom; animation: dsGrowY 1.5s cubic-bezier(0.33, 0.8, 0.4, 1) both; }
    [data-deck-active] [data-fade] { animation: dsUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] .curva { animation: dsUp 0.9s 1.15s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(200,155,60,0.5); border-radius: 999px;
    background: rgba(1,10,19,0.8); color: ${GOLD}; cursor: pointer;
    font: 600 13px/1 'General Sans', sans-serif; letter-spacing: 0.8px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides}
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
console.log(`index.html generado: 7 slides (portada, campana, edificio, camino, servidores, cuspide, tesis)`);
