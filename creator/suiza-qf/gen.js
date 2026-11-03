// Generador de index.html — Worlds 2026 · Cuartos de final (vertical, 1080×1920)
// Ejecutar: node creator/suiza-qf/gen.js
//
// Encargo (1/11/2026): la presentación de los cuatro cuartos, con el formato de
// flyers de función estelar de `suiza/` y `suiza-r5/` (mismos logos, fotos y
// coreografía, copiados), apegada al guion de Axl: gancho con el bracket, los cuatro
// cruces por fecha y cierre con el bracket. Para cada cruce hay un flyer y una lámina
// de **historial**: el camino de cada equipo en el Mundial (ronda por ronda) y el
// cara a cara que llevan en 2026.
//
// Fuente única: `PKB/redes-sociales/creador-de-contenido-axelsine/worlds-2026/
// cuartos-de-final/2026-11-01_previa-cuartos-de-final-datos.md` (bracket, fechas y
// resultados de la suiza de la API de lolesports; el resto, de cuatro agentes con
// búsqueda web) y su guion del mismo día. Los datos van tal cual de ahí; lo que la nota
// marca «NV» (no verificado) se queda fuera o se avisa abajo.
// ⚠️ NV que sí entra: la fecha del TES–IG del 25/1 (puede estar duplicada con la del
// 21/1) cuenta para el 3–3 de la nota, así que va en la lista del cara a cara.
// ⚠️ Los cuartos son Bo5 con Fearless Draft, a las 16:00 CDMX en Allen, Texas. Las
// semis (7 y 8/11) las confirman varios medios pero la API todavía las trae «por definir».
// ⚠️ No van cuotas ni probabilidades de las casas: la nota las da como orden de magnitud
// y todas vienen de fragmentos de búsqueda.
// ⚠️ TL y TSW tienen logo blanco: solo van sobre fondo oscuro (aquí todo lo es).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Paleta: plata cromada y azul hielo; el color lo ponen los equipos ────
const BG = '#07070A';
const PLATA = '#E9EDF3';
const HIELO = '#7CC4FF';
const MUTED = '#8B93A3';
const SUBE = '#46E39B';      // ganó
const FUERA = '#FF4D5E';     // perdió

const DISPLAY = `'Anton', Impact, sans-serif`;
const BODY = `'Archivo', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

// ── Equipos ──────────────────────────────────────────────────────────────
const EQ = {
  TES: { marca: 'TES', nombre: 'Top Esports', region: 'LPL', color: '#FF3B30', estrella: ['jackeylove', 'JackeyLove', 'Campeón 2018'], extra: [] },
  IG: { marca: 'INVICTUS', nombre: 'Invictus Gaming', region: 'LPL', color: '#D9DFE7', estrella: ['theshy', 'TheShy', 'Campeón 2018'], extra: ['rookie', 'meiko'] },
  GEN: { marca: 'GEN.G', nombre: 'Gen.G', region: 'LCK', color: '#C9A35C', estrella: ['chovy', 'Chovy', '97–36 en 2026'], extra: ['ruler', 'canyon'] },
  LYON: { marca: 'LYON', nombre: 'LYON', region: 'LCS', color: '#C9A06A', estrella: ['inspired', 'Inspired', 'Jungla'], extra: ['berserker'] },
  DK: { marca: 'DPLUS', nombre: 'Dplus KIA', region: 'LCK', color: '#7FD9E8', estrella: ['showmaker', 'ShowMaker', 'Campeón 2020'], extra: [] },
  BLG: { marca: 'BILIBILI', nombre: 'Bilibili Gaming', region: 'LPL', color: '#36C5F4', estrella: ['viper', 'Viper', 'Campeón 2021'], extra: ['bin', 'knight'] },
  T1: { marca: 'T1', nombre: 'T1', region: 'LCK', color: '#E4002B', estrella: ['faker', 'Faker', '6 títulos mundiales'], extra: ['keria', 'oner'] },
  KC: { marca: 'KARMINE', nombre: 'Karmine Corp', region: 'LEC', color: '#19D3F3', estrella: ['caliste', 'Caliste', 'MVP del verano'], extra: ['kyeahoo'] },
  // Rivales de la suiza (solo logo y código)
  HLE: { marca: 'HANWHA', nombre: 'Hanwha Life Esports', color: '#F58220' },
  G2: { marca: 'G2', nombre: 'G2 Esports', color: '#E8443A' },
  AL: { marca: 'ANYONE’S', nombre: 'Anyone’s Legend', color: '#E5392E' },
  TSW: { marca: 'SECRET', nombre: 'Team Secret Whales', color: '#B7C1CF' },
  TL: { marca: 'LIQUID', nombre: 'Team Liquid Alienware', color: '#3F7FE0' },
  CFO: { marca: 'CFO', nombre: 'CTBC Flying Oyster', color: '#F5A524' },
  LOS: { marca: 'LOS', nombre: 'LOS', color: '#FF6A2B' },
  MKOI: { marca: 'KOI', nombre: 'Movistar KOI', color: '#4C7DFF' },
};
const cod = (t) => ({ MKOI: 'KOI' }[t] || t);

// Los cuatro cuartos: Bo5, 16:00 CDMX, Allen. [A, B, día, fecha, gancho]
const HORA = '16:00';
const QF = [
  ['TES', 'IG', 'MAR', '3 NOV', 'Guerra civil de la LPL · van 3–3 este año'],
  ['GEN', 'LYON', 'MIÉ', '4 NOV', 'El 3–0 contra el último de la LCS'],
  ['DK', 'BLG', 'JUE', '5 NOV', 'El más parejo · DK ya le ganó en la EWC'],
  ['T1', 'KC', 'VIE', '6 NOV', 'Faker contra el equipo de Kameto'],
];

// Camino de cada equipo en el Mundial: [ronda, rival, G|P, marcador del punto de vista del equipo]
// (la suiza R1–R3 de la nota son Bo1 salvo los Bo3 que la nota detalla).
const CAMINO = {
  TES: { rec: '3–1', r: [['R1', 'HLE', 'P', '0–1'], ['R2', 'AL', 'G', '1–0'], ['R3', 'G2', 'G', '1–0'], ['R4', 'BLG', 'G', '2–1']], nota: 'Juega con 369 en el top: ZUIAN no consiguió visa' },
  IG: { rec: '3–1', r: [['R1', 'GEN', 'P', '0–1'], ['R2', 'TSW', 'G', '1–0'], ['R3', 'HLE', 'G', '1–0'], ['R4', 'LYON', 'G', '2–1']], nota: 'Primer equipo de la LPL en clasificar' },
  GEN: { rec: '3–0', r: [['R1', 'IG', 'G', '1–0'], ['R2', 'HLE', 'G', '1–0'], ['R3', 'LYON', 'G', '2–1']], nota: 'Segundo equipo en clasificar a cuartos' },
  LYON: { rec: '3–2', r: [['R1', 'TSW', 'G', '1–0'], ['R2', 'KC', 'G', '1–0'], ['R3', 'GEN', 'P', '1–2'], ['R4', 'IG', 'P', '1–2'], ['R5', 'LOS', 'G', '2–1']], nota: 'Remontó a LOS en la ronda 5' },
  DK: { rec: '3–0', r: [['R1', 'G2', 'G', '1–0'], ['R2', 'T1', 'G', '1–0'], ['R3', 'MKOI', 'G', '2–0']], nota: 'Primer equipo en clasificar a cuartos' },
  BLG: { rec: '3–2', r: [['R1', 'MKOI', 'P', '0–1'], ['R2', 'TL', 'G', '1–0'], ['R3', 'KC', 'G', '1–0'], ['R4', 'TES', 'P', '1–2'], ['R5', 'HLE', 'G', '2–0']], nota: 'Le ganó 2–0 a Hanwha, campeón del MSI' },
  T1: { rec: '3–1', r: [['R1', 'LOS', 'G', '1–0'], ['R2', 'DK', 'P', '0–1'], ['R3', 'CFO', 'G', '1–0'], ['R4', 'MKOI', 'G', '2–0']], nota: 'Tricampeón vigente' },
  KC: { rec: '3–2', r: [['R1', 'AL', 'G', '1–0'], ['R2', 'LYON', 'P', '0–1'], ['R3', 'BLG', 'P', '0–1'], ['R4', 'CFO', 'G', '2–0'], ['R5', 'MKOI', 'G', '2–0']], nota: 'Llegó desde el Play-In' },
};

// Cara a cara en 2026: [fecha, torneo, ganador, marcador, ¿fue en el Mundial?]
const H2H = {
  'TES-IG': { resumen: '3–3 en 2026', sub: 'Seis series en doce meses', filas: [
    ['17/9', 'Final regional · Bo5', 'TES', '3–1'], ['5/9', 'Playoffs del Split 3 · Bo5', 'IG', '3–2'],
    ['19/4', 'Split 2 · Bo3', 'TES', '2–0'], ['4/4', 'Split 2 · Bo3', 'IG', '2–0'],
    ['25/1', 'Split 1 · Bo3', 'TES', '2–0'], ['21/1', 'Split 1 · Bo3', 'IG', '2–1']] },
  'GEN-LYON': { resumen: 'Gen.G 2–0 en 2026', sub: 'LYON le ganó el mapa 1 en la suiza', filas: [
    ['25/10', 'Mundial · ronda 3 · Bo3', 'GEN', '2–1', true], ['19/3', 'First Stand · Bo5', 'GEN', '3–0']] },
  'DK-BLG': { resumen: 'DK 1–0 en 2026', sub: 'Una sola serie: cuartos de la EWC', filas: [
    ['17/7', 'EWC · cuartos · Bo3', 'DK', '2–1']] },
  'T1-KC': { resumen: '1–1 en 2026', sub: 'Primer cruce entre los dos en un Mundial', filas: [
    ['18/7', 'EWC · semifinal · Bo3', 'KC', '2–1'], ['29/6', 'MSI · final de upper del Play-In · Bo5', 'T1', '3–0']] },
};

const logo = (t) => `assets/logos/${t}.png`;
const foto = (id) => `assets/jugadores/${id}.webp`;
const a = kit.alpha;

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; font-family: ${BODY}; color: ${PLATA}; position: relative; overflow: hidden; box-sizing: border-box; padding: 300px 84px 350px;`;
const grano = `<div style="position: absolute; inset: 0; pointer-events: none; ${kit.fondo('transparent', kit.grano({ opacidad: 0.07 }))} mix-blend-mode: overlay;"></div>`;
const halo = (color, x, y, w = 900, h = 900, f = 0.42) =>
  `<div data-halo style="position: absolute; left: ${x - w / 2}px; top: ${y - h / 2}px; width: ${w}px; height: ${h}px; border-radius: 50%; background: radial-gradient(closest-side, ${a(color, f)}, ${a(color, 0)}); pointer-events: none;"></div>`;
const chip = (txt, color = HIELO) =>
  `<div data-chip style="display: inline-flex; align-items: center; gap: 12px; padding: 10px 22px; border-radius: 999px; background: ${a(color, 0.12)}; border: 1px solid ${a(color, 0.55)}; font-family: ${MONO}; font-size: 22px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${color};"><span style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>${txt}</div>`;
const tamMarca = (txt, ancho, max) => Math.min(max, Math.floor(ancho / (0.47 * txt.length)));

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// Cartel de función estelar: Faker al centro, Chovy y ShowMaker detrás.
slides.push(`
  <section data-lamina="qf-portada" data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Cuartos de final del Mundial 2026: cuatro series al mejor de cinco, martes a viernes a las cuatro de la tarde hora de México, en Allen, Texas. Gen.G y T1 quedaron en lados distintos del bracket." style="${SECCION}">
    ${halo(HIELO, 540, 760, 1300, 1300, 0.28)}
    ${halo('#E4002B', 540, 900, 760, 760, 0.3)}
    <div data-contorno style="position: absolute; left: -40px; right: -40px; top: 250px; text-align: center; font-family: ${DISPLAY}; font-size: 430px; line-height: 0.86; color: transparent; -webkit-text-stroke: 2px ${a(PLATA, 0.16)};">BO5<br>BO5</div>
    <img data-lado src="${foto('chovy')}" alt="Chovy" style="position: absolute; left: -150px; top: 640px; height: 560px; filter: grayscale(0.6) brightness(0.45);">
    <img data-lado src="${foto('showmaker')}" alt="ShowMaker" style="position: absolute; right: -150px; top: 640px; height: 560px; filter: grayscale(0.6) brightness(0.45);">
    <img data-estrella src="${foto('faker')}" alt="Faker" style="position: absolute; left: 50%; top: 520px; height: 760px; transform: translateX(-50%); -webkit-mask-image: linear-gradient(180deg, #000 78%, transparent 100%); mask-image: linear-gradient(180deg, #000 78%, transparent 100%);">
    <div style="position: absolute; left: 84px; right: 84px; top: 300px; text-align: center;">${chip('Worlds 2026 · Allen, Texas')}</div>
    <div style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center;">
      <div data-titulo class="cromo" style="font-family: ${DISPLAY}; font-size: 210px; line-height: 0.86; letter-spacing: 2px;">CUARTOS<br>DE FINAL</div>
      <div data-sub style="margin-top: 26px; font-size: 38px; font-weight: 800; font-style: italic; letter-spacing: 1px; text-transform: uppercase;">Martes a viernes · <span style="color: ${HIELO};">${HORA} CDMX</span></div>
    </div>
    ${grano}
  </section>`);

// ── 2–5 · Flyers de los cuartos ─────────────────────────────────────────
// Arriba el primer equipo (estrella a la derecha, nombre a la izquierda),
// abajo el segundo en espejo; en medio la banda del VS, girada.
function lado(t, arriba) {
  const e = EQ[t], [id, quien, dato] = e.estrella;
  const top = arriba ? 420 : 1085;
  const tam = tamMarca(e.marca, 880, 240);
  const hacia = arriba ? 'right' : 'left';
  const contra = arriba ? 'left' : 'right';
  const mascara = arriba ? '' : `-webkit-mask-image: linear-gradient(180deg, #000 72%, transparent 96%); mask-image: linear-gradient(180deg, #000 72%, transparent 96%);`;
  const fantasmas = e.extra.map((x, i) =>
    `<img data-fantasma src="${foto(x)}" alt="" style="position: absolute; ${hacia}: ${250 + i * 190}px; top: ${top + 70}px; height: 400px; filter: grayscale(1) brightness(0.42) contrast(1.1); opacity: 0.9; ${mascara}">`).join('');
  const contorno = `<div data-contorno-${arriba ? 'a' : 'b'} style="position: absolute; ${contra}: -60px; top: ${arriba ? 300 : 1010}px; white-space: nowrap; font-family: ${DISPLAY}; font-size: 260px; line-height: 0.88; color: transparent; -webkit-text-stroke: 2px ${a(e.color, 0.22)}; transform: rotate(-6deg);">${e.marca} ${e.marca}<br>${e.marca} ${e.marca}</div>`;
  const bloque = arriba
    ? `<div data-bloque-a style="position: absolute; left: 84px; right: 84px; top: 440px; text-align: left;">
        <img data-logo src="${logo(t)}" alt="${e.nombre}" style="height: 120px; max-width: 240px; object-fit: contain; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));">
      </div>
      <div data-nombre-a style="position: absolute; left: 84px; top: ${905 - tam * 0.86 - 92}px; text-align: left;">
        <div class="cromo marca" style="font-size: ${tam}px;">${e.marca}</div>
        <div data-firma style="margin-top: 10px; font-family: ${MONO}; font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${e.color};">${e.nombre} · ${e.region}</div>
        <div data-firma style="margin-top: 6px; font-size: 30px; font-weight: 800; font-style: italic; text-transform: uppercase;">★ ${quien} <span style="font-weight: 600; color: ${MUTED};">${dato}</span></div>
      </div>`
    : `<div data-bloque-b style="position: absolute; left: 84px; right: 84px; top: 1130px; text-align: right;">
        <img data-logo src="${logo(t)}" alt="${e.nombre}" style="height: 120px; max-width: 240px; object-fit: contain; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));">
      </div>
      <div data-nombre-b style="position: absolute; right: 84px; top: 1290px; text-align: right;">
        <div class="cromo marca" style="font-size: ${tam}px;">${e.marca}</div>
        <div data-firma style="margin-top: 10px; font-family: ${MONO}; font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${e.color};">${e.nombre} · ${e.region}</div>
        <div data-firma style="margin-top: 6px; font-size: 30px; font-weight: 800; font-style: italic; text-transform: uppercase;">★ ${quien} <span style="font-weight: 600; color: ${MUTED};">${dato}</span></div>
      </div>`;
  const estrella = `<img data-estrella-${arriba ? 'a' : 'b'} src="${foto(id)}" alt="${quien}" style="position: absolute; ${hacia}: -40px; top: ${top}px; height: 560px; filter: drop-shadow(0 0 40px ${a(e.color, 0.35)}); ${mascara}">`;
  return { contorno, fantasmas, estrella, bloque };
}
QF.forEach(([A, B, dia, fecha, gancho], i) => {
  const ea = EQ[A], eb = EQ[B];
  const la = lado(A, true), lb = lado(B, false);
  const notas = `Cuarto ${i + 1}: ${ea.nombre} contra ${eb.nombre}, ${dia} ${fecha} a las cuatro de la tarde hora de México, al mejor de cinco con Fearless Draft. ${gancho}.`;
  slides.push(`
  <section data-lamina="qf-${cod(A).toLowerCase()}-${cod(B).toLowerCase()}" data-label="Cruce ${i + 1}" data-screen-label="${String(2 + i).padStart(2, '0')} · ${cod(A)} vs ${cod(B)}" data-speaker-notes="${notas}" style="${SECCION}">
    <div data-fondo-a style="position: absolute; inset: 0 0 50% 0; background: linear-gradient(200deg, ${a(ea.color, 0.38)}, ${a(ea.color, 0)} 62%);"></div>
    <div data-fondo-b style="position: absolute; inset: 50% 0 0 0; background: linear-gradient(20deg, ${a(eb.color, 0.38)}, ${a(eb.color, 0)} 62%);"></div>
    ${halo(ea.color, 800, 640, 820, 820, 0.4)}
    ${halo(eb.color, 280, 1330, 820, 820, 0.4)}
    ${la.contorno}${lb.contorno}
    ${la.fantasmas}${la.estrella}
    ${lb.fantasmas}${lb.estrella}
    ${la.bloque}${lb.bloque}
    <div style="position: absolute; left: 84px; right: 84px; top: 300px; text-align: center;">
      ${chip(`Cuartos de final · Cruce ${i + 1} de 4`)}
      <div data-gancho style="margin-top: 16px; font-size: 34px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px;">${gancho}</div>
    </div>
    <div data-banda style="position: absolute; left: -160px; right: -160px; top: 935px; height: 150px; transform: rotate(-6deg); background: linear-gradient(90deg, #050507, #121219 50%, #050507); border-top: 5px solid ${ea.color}; border-bottom: 5px solid ${eb.color}; box-shadow: 0 0 60px rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; gap: 70px;">
      <div data-fecha style="width: 250px; text-align: right; font-family: ${MONO}; font-size: 26px; font-weight: 600; letter-spacing: 2px; line-height: 1.35;">${dia} ${fecha}<br><span style="color: ${HIELO};">BO5</span></div>
      <div data-vs class="cromo" style="font-family: ${DISPLAY}; font-size: 170px; line-height: 1; font-style: italic; padding: 0 10px;">VS</div>
      <div data-fecha style="width: 250px; text-align: left; font-family: ${MONO}; font-size: 26px; font-weight: 600; letter-spacing: 2px; line-height: 1.35;">${HORA}<br><span style="color: ${MUTED};">CDMX</span></div>
    </div>
    <div data-destello style="position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none;"></div>
    ${grano}
  </section>`);
});

// ── 6–9 · Historial: el camino en el Mundial y el cara a cara ───────────
const chipRonda = ([ronda, rival, res, marc]) => {
  const g = res === 'G', c = g ? SUBE : FUERA;
  return `<div data-ronda style="width: 168px; flex: none; border-radius: 20px; padding: 12px 10px 14px; box-sizing: border-box; background: linear-gradient(180deg, ${a(c, 0.15)}, ${a(c, 0.04)}); border: 1px solid ${a(c, 0.5)}; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="font-family: ${MONO}; font-size: 18px; font-weight: 600; letter-spacing: 3px; color: ${MUTED};">${ronda}</div>
        <img src="${logo(rival)}" alt="${EQ[rival].nombre}" style="height: 66px; max-width: 120px; object-fit: contain; margin-top: 2px; filter: drop-shadow(0 5px 12px rgba(0,0,0,0.6));">
        <div class="cromo" style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1.05; letter-spacing: 1px;">${cod(rival)}</div>
        <div style="margin-top: 2px; padding: 2px 14px; border-radius: 999px; background: ${a(c, 0.2)}; font-family: ${MONO}; font-size: 24px; font-weight: 600; color: ${c};">${g ? '▲' : '▼'} ${marc}</div>
      </div>`;
};
function filaCamino(t) {
  const e = EQ[t], h = CAMINO[t], [id] = e.estrella;
  const tam = tamMarca(e.marca, 380, 92);
  return `
    <div data-fila-hist style="position: relative; height: 352px; border-radius: 28px; overflow: hidden; background: linear-gradient(100deg, ${a(e.color, 0.3)}, #0D0D12 62%); border: 1px solid ${a(PLATA, 0.13)}; box-sizing: border-box; padding: 20px 20px 0;">
      <img src="${foto(id)}" alt="" style="position: absolute; right: -40px; top: -30px; height: 300px; opacity: 0.3; filter: grayscale(0.5); -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%); mask-image: linear-gradient(180deg, #000 55%, transparent 100%);">
      <div style="position: relative; display: flex; align-items: center; gap: 18px;">
        <img src="${logo(t)}" alt="${e.nombre}" style="height: 70px; max-width: 100px; object-fit: contain; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));">
        <div>
          <div class="cromo marca" style="font-size: ${tam}px;">${e.marca}</div>
          <div style="margin-top: 4px; font-family: ${MONO}; font-size: 18px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${e.color};">${h.nota}</div>
        </div>
        <div style="margin-left: auto; position: relative; padding: 4px 18px; border-radius: 999px; background: ${a(PLATA, 0.1)}; border: 1px solid ${a(PLATA, 0.35)}; font-family: ${MONO}; font-size: 30px; font-weight: 600;">${h.rec}</div>
      </div>
      <div style="position: relative; margin-top: 14px; display: flex; gap: 9px;">${h.r.map(chipRonda).join('')}</div>
    </div>`;
}
function bloqueH2H(clave, A, B) {
  const d = H2H[clave];
  const filas = d.filas.map(([fecha, torneo, gan, marc, mundial]) => {
    const eg = EQ[gan];
    return `
      <div data-h2h style="display: flex; align-items: center; gap: 16px; height: 50px; padding: 0 16px; border-radius: 14px; background: ${a(PLATA, 0.05)}; border-left: 4px solid ${mundial ? HIELO : a(eg.color, 0.8)};">
        <div style="width: 84px; font-family: ${MONO}; font-size: 22px; font-weight: 600; color: ${MUTED};">${fecha}</div>
        <div style="flex: 1; font-size: 23px; font-weight: 700; ${mundial ? `color: ${HIELO};` : ''}">${torneo}</div>
        <img src="${logo(gan)}" alt="${eg.nombre}" style="height: 34px; width: 46px; object-fit: contain;">
        <div style="width: 82px; text-align: right; font-family: ${MONO}; font-size: 26px; font-weight: 600;">${marc}</div>
      </div>`;
  }).join('');
  return `
    <div style="margin-top: 16px;">
      <div data-h2h style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
        <div style="font-family: ${MONO}; font-size: 19px; font-weight: 600; letter-spacing: 3px; color: ${HIELO};">CARA A CARA · ${d.resumen.toUpperCase()}</div>
        <div style="font-size: 20px; font-weight: 600; font-style: italic; color: ${MUTED};">${d.sub}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">${filas}</div>
    </div>`;
}
QF.forEach(([A, B], i) => {
  const ea = EQ[A], eb = EQ[B];
  slides.push(`
  <section data-lamina="qf-historial-${cod(A).toLowerCase()}-${cod(B).toLowerCase()}" data-label="Historial ${i + 1}" data-screen-label="${String(6 + i).padStart(2, '0')} · Historial ${cod(A)} y ${cod(B)}" data-speaker-notes="El camino de ${ea.nombre} y ${eb.nombre} en el Mundial, ronda por ronda, y lo que llevan cara a cara este año." style="${SECCION}">
    ${halo(ea.color, 240, 700, 900, 900, 0.3)}
    ${halo(eb.color, 840, 1250, 900, 900, 0.3)}
    <div style="position: relative;">
      <div style="text-align: center;">${chip('Su camino en el Mundial')}</div>
      <div style="margin-top: 16px;">${filaCamino(A)}</div>
      <div style="position: relative; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div data-vs-chico class="cromo" style="position: absolute; z-index: 2; font-family: ${DISPLAY}; font-size: 54px; font-style: italic; line-height: 1; padding: 0 14px; background-color: ${BG}; border-radius: 12px;">VS</div>
      </div>
      <div>${filaCamino(B)}</div>
      ${bloqueH2H(`${A}-${B}`, A, B)}
    </div>
    ${grano}
  </section>`);
});

// ── 10 · El cuadro de los cuartos ───────────────────────────────────────
const cara = (t, color) => `<div style="width: 110px; height: 110px; flex: none; border-radius: 50%; overflow: hidden; border: 3px solid ${color}; background: radial-gradient(circle at 50% 30%, ${a(color, 0.45)}, #0E0E14 75%); box-shadow: 0 0 24px ${a(color, 0.45)};">
          <img src="${foto(EQ[t].estrella[0])}" alt="${EQ[t].estrella[1]}" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; transform: scale(1.35); transform-origin: 50% 0%;">
        </div>`;
const filaCuadro = ([A, B, dia, fecha]) => {
  const ea = EQ[A], eb = EQ[B];
  return `
    <div data-fila style="position: relative; height: 176px; margin-bottom: 20px; border-radius: 28px; background: linear-gradient(90deg, ${a(ea.color, 0.34)}, #0D0D12 38%, #0D0D12 62%, ${a(eb.color, 0.34)}); border: 1px solid ${a(PLATA, 0.12)}; display: flex; align-items: center; padding: 0 14px; box-sizing: border-box;">
      ${cara(A, ea.color)}
      <img src="${logo(A)}" alt="${ea.nombre}" style="width: 74px; height: 64px; object-fit: contain; margin-left: 12px;">
      <div style="flex: 1; margin-left: 10px; font-family: ${DISPLAY}; font-size: 68px; line-height: 1; letter-spacing: 1px;">${cod(A)}</div>
      <div style="width: 140px; display: flex; justify-content: center;">
        <div data-medalla style="width: 128px; height: 128px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #1C1C24, #08080B 70%); border: 2px solid ${a(PLATA, 0.45)}; box-shadow: 0 0 0 5px ${BG}, 0 0 22px ${a(HIELO, 0.3)}; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="cromo" style="font-family: ${DISPLAY}; font-size: 46px; font-style: italic; line-height: 1;">VS</div>
          <div style="margin-top: 2px; font-family: ${MONO}; font-size: 18px; font-weight: 600; color: ${HIELO};">${dia} ${fecha.split(' ')[0]}</div>
        </div>
      </div>
      <div style="flex: 1; margin-right: 10px; text-align: right; font-family: ${DISPLAY}; font-size: 68px; line-height: 1; letter-spacing: 1px;">${cod(B)}</div>
      <img src="${logo(B)}" alt="${eb.nombre}" style="width: 74px; height: 64px; object-fit: contain; margin-right: 12px;">
      ${cara(B, eb.color)}
    </div>`;
};
const miniLogos = (ts) => `<span style="display: inline-flex; gap: 6px; align-items: center;">${ts.map(t => `<img src="${logo(t)}" alt="${EQ[t].nombre}" style="height: 48px; width: 62px; object-fit: contain;">`).join('')}</span>`;
const semi = (etiqueta, fecha, izq, der) => `
      <div data-semi style="flex: 1; border-radius: 22px; padding: 16px 18px 18px; background: ${a(PLATA, 0.05)}; border: 1px solid ${a(PLATA, 0.16)};">
        <div style="font-family: ${MONO}; font-size: 22px; font-weight: 600; letter-spacing: 3px; color: ${HIELO};">${etiqueta} · ${fecha}</div>
        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          ${miniLogos(izq)}
          <span class="cromo" style="font-family: ${DISPLAY}; font-size: 48px; font-style: italic; line-height: 1;">VS</span>
          ${miniLogos(der)}
        </div>
      </div>`;
slides.push(`
  <section data-lamina="qf-cuadro" data-label="Cuadro" data-screen-label="10 · El cuadro de los cuartos" data-speaker-notes="El bracket: cuatro cuartos de martes a viernes, semifinales el siete y el ocho de noviembre y la final el catorce en Nueva York. Gen.G y T1 quedaron en lados distintos, así que la final soñada puede pasar." style="${SECCION}">
    ${halo(HIELO, 540, 420, 1100, 700, 0.16)}
    <div style="position: relative; text-align: center;">
      ${chip('Todos a las 16:00 · hora CDMX')}
      <h2 data-titulo class="cromo" style="margin: 14px 0 20px; font-family: ${DISPLAY}; font-weight: 400; font-size: 118px; line-height: 0.86;">CUARTOS</h2>
    </div>
    <div style="position: relative;">
      <div data-espina style="position: absolute; left: 50%; top: 40px; bottom: 90px; width: 3px; margin-left: -1.5px; background: linear-gradient(${a(HIELO, 0)}, ${PLATA} 12%, ${PLATA} 88%, ${a(HIELO, 0)}); transform-origin: top;"></div>
      ${QF.map(filaCuadro).join('')}
      <div style="display: flex; gap: 14px; margin-top: 4px;">
        ${semi('Semi 1', 'SÁB 7/11', ['TES', 'IG'], ['GEN', 'LYON'])}
        ${semi('Semi 2', 'DOM 8/11', ['T1', 'KC'], ['DK', 'BLG'])}
      </div>
      <div data-pie style="margin-top: 14px; text-align: center; font-family: ${MONO}; font-size: 24px; font-weight: 600; letter-spacing: 2px; color: ${MUTED};">FINAL · 14/11 · BARCLAYS CENTER, BROOKLYN</div>
    </div>
    ${grano}
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Las mismas de `suiza/` y `suiza-r5/`: entran los colores, las estrellas se acercan
// desde los lados, la banda se abre de golpe con un destello y los nombres llegan después.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };

  animar('Portada', function (tl, s) {
    tl.from(q(s, '[data-halo]'), { scale: 0.7, opacity: 0, duration: 1.4 }, 0)
      .from(uno(s, '[data-contorno]'), { y: 60, opacity: 0, duration: 1.4 }, 0)
      .from(uno(s, '[data-estrella]'), { y: 80, opacity: 0, duration: 1.0 }, 0.15)
      .from(q(s, '[data-lado]'), { x: function (i) { return i ? 140 : -140; }, opacity: 0, duration: 1.0 }, 0.35)
      .from(uno(s, '[data-chip]'), { y: -20, opacity: 0, duration: 0.5 }, 0.3)
      .from(uno(s, '[data-titulo]'), { scale: 1.25, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.7)
      .from(uno(s, '[data-sub]'), { y: 20, opacity: 0, duration: 0.5 }, 1.1);
  });

  function flyer(tl, s) {
    tl.from(uno(s, '[data-fondo-a]'), { opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-fondo-b]'), { opacity: 0, duration: 0.8 }, 0.1)
      .from(q(s, '[data-halo]'), { scale: 0.6, opacity: 0, duration: 1.2, stagger: 0.1 }, 0)
      .from(uno(s, '[data-contorno-a]'), { x: -260, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-contorno-b]'), { x: 260, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-estrella-a]'), { x: 180, opacity: 0, duration: 0.9 }, 0.15)
      .from(uno(s, '[data-estrella-b]'), { x: -180, opacity: 0, duration: 0.9 }, 0.25)
      .from(q(s, '[data-fantasma]'), { opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
      .from(uno(s, '[data-banda]'), { scaleX: 0, duration: 0.45, ease: 'expo.out' }, 0.6)
      .from(uno(s, '[data-vs]'), { scale: 2.6, opacity: 0, duration: 0.42, ease: 'power4.in' }, 0.72)
      .fromTo(uno(s, '[data-destello]'), { opacity: 0 }, { opacity: 0.28, duration: 0.05, ease: 'none', immediateRender: false }, 1.12)
      .to(uno(s, '[data-destello]'), { opacity: 0, duration: 0.45, ease: 'power2.out' }, 1.17)
      .from(q(s, '[data-fecha]'), { opacity: 0, duration: 0.4, stagger: 0.08 }, 1.15)
      .from(q(s, '[data-nombre-a] .marca'), { x: -80, opacity: 0, skewX: 12, duration: 0.6 }, 1.0)
      .from(q(s, '[data-nombre-b] .marca'), { x: 80, opacity: 0, skewX: -12, duration: 0.6 }, 1.08)
      .from(q(s, '[data-logo]'), { scale: 0.5, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 1.15)
      .from(q(s, '[data-firma]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.07 }, 1.3)
      .from(uno(s, '[data-chip]'), { y: -20, opacity: 0, duration: 0.45 }, 0.1)
      .from(uno(s, '[data-gancho]'), { y: -14, opacity: 0, duration: 0.5 }, 0.3);
  }
  for (var i = 1; i <= 4; i++) animar('Cruce ' + i, flyer);

  // Historial: cada equipo entra desde su lado, las rondas se plantan una tras otra
  // y al final caen las filas del cara a cara.
  function historial(tl, s) {
    tl.from(q(s, '[data-halo]'), { opacity: 0, scale: 0.7, duration: 1.1 }, 0)
      .from(uno(s, '[data-chip]'), { y: -20, opacity: 0, duration: 0.45 }, 0.05)
      .from(q(s, '[data-fila-hist]'), { x: function (i) { return i ? 140 : -140; }, opacity: 0, duration: 0.65, stagger: 0.18, ease: 'power3.out' }, 0.2)
      .from(uno(s, '[data-vs-chico]'), { scale: 2.2, opacity: 0, duration: 0.4, ease: 'power4.in' }, 0.55)
      .from(q(s, '[data-ronda]'), { scale: 0.7, opacity: 0, y: 20, duration: 0.4, stagger: 0.06, ease: 'back.out(1.8)' }, 0.7)
      .from(q(s, '[data-h2h]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.5);
  }
  for (var j = 1; j <= 4; j++) animar('Historial ' + j, historial);

  animar('Cuadro', function (tl, s) {
    tl.from(q(s, '[data-halo]'), { opacity: 0, duration: 1 }, 0)
      .from(uno(s, '[data-chip]'), { y: 20, opacity: 0, duration: 0.45 }, 0)
      .from(uno(s, '[data-titulo]'), { scale: 1.2, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.1)
      .from(uno(s, '[data-espina]'), { scaleY: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)
      .from(q(s, '[data-fila]'), { x: function (i) { return i % 2 ? 120 : -120; }, opacity: 0, duration: 0.55, stagger: 0.11 }, 0.4)
      .from(q(s, '[data-medalla]'), { scale: 0, rotation: -90, duration: 0.45, stagger: 0.11, ease: 'back.out(2)' }, 0.65)
      .from(q(s, '[data-semi]'), { y: 24, opacity: 0, duration: 0.5, stagger: 0.12 }, 1.3)
      .from(uno(s, '[data-pie]'), { opacity: 0, y: 12, duration: 0.5 }, 1.6);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Worlds 2026 · Cuartos de final</title>
${kit.og({ titulo: 'Worlds 2026 · Cuartos de final', descripcion: 'Los cuatro cuartos de final del Mundial 2026 como flyers de función estelar, con el camino de cada equipo en la suiza y su cara a cara.', carpeta: 'creator/suiza-qf' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:ital,wght@0,500;0,600;0,700;0,800;1,600;1,800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .cromo {
    background: linear-gradient(180deg, #FFFFFF 0%, #DCE2EA 40%, #8D97A5 52%, #F3F6F9 63%, #B6BFCB 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .marca { font-family: ${DISPLAY}; line-height: 0.86; letter-spacing: 1px; white-space: nowrap; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.75)); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(HIELO, 0.45)}; border-radius: 999px;
    background: rgba(7,7,10,0.85); color: ${HIELO}; cursor: pointer;
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
${kit.gsap(__dirname, [])}
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
