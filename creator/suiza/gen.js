// Generador de index.html — Worlds 2026 · Fase suiza (vertical, 1080×1920)
// Ejecutar: node creator/suiza/gen.js
//
// Encargo: la ronda 1 de la fase suiza y, al final, su cuadro «muy bonito»,
// con logos, fotos y los nombres de los equipos
// estilizados **como flyer de evento**. Que parezcan partidos especiales,
// pero sin amontonar cosas: cada partido es una lámina con dos estrellas
// frente a frente, el nombre del equipo en grande, la banda del VS con la
// hora y una sola línea de gancho.
//
// Fuente: la nota de investigación de Axl del 18/10/2026 (API de lolesports
// para logos y fotos, Liquipedia para rosters, formato y bombos). Logos y
// fotos son los oficiales de lolesports (static.lolesports.com), recortados a
// su contenido; las fotos van en WebP con transparencia (13 MB en PNG → 1,5 MB).
//
// ⚠️ La ronda 1 entera cae el **viernes 23 de octubre** en hora de CDMX: el
// último partido es 24/10 a las 00:00 UTC, que en México son las 18:00 del 23.
// Las cuatro láminas de información (reglas, cuadro de récords, calendario y
// bombos) se quitaron el 18/10 a pedido de Axl: el deck es portada, los ocho
// flyers y el cuadro.
// ⚠️ TL y TSW tienen logo blanco: solo van sobre fondo oscuro (aquí todo lo es).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Paleta: plata cromada y azul hielo; el color lo ponen los equipos ────
const BG = '#07070A';        // negro de arena apagada
const PLATA = '#E9EDF3';     // la tipografía cromada
const HIELO = '#7CC4FF';     // acento: el acero de la Copa
const MUTED = '#8B93A3';
const SUBE = '#46E39B';      // clasifica
const FUERA = '#FF4D5E';     // eliminado

const DISPLAY = `'Anton', Impact, sans-serif`;
const BODY = `'Archivo', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

// ── Equipos ──────────────────────────────────────────────────────────────
// `marca` es el nombre que va en grande en el flyer; `estrella` la foto
// principal y `extra` las que van detrás, apagadas.
const EQ = {
  GEN: { marca: 'GEN.G', nombre: 'Gen.G', region: 'LCK', color: '#C9A35C', estrella: ['chovy', 'Chovy', '8 Mundiales · 0 títulos'], extra: ['ruler', 'canyon'] },
  IG: { marca: 'INVICTUS', nombre: 'Invictus Gaming', region: 'LPL', color: '#D9DFE7', estrella: ['theshy', 'TheShy', 'Campeón 2018'], extra: ['rookie', 'meiko'] },
  TL: { marca: 'LIQUID', nombre: 'Team Liquid Alienware', region: 'LCS', color: '#3F7FE0', estrella: ['josedeodo', 'Josedeodo', 'Jungla argentino'], extra: ['corejj'] },
  CFO: { marca: 'CFO', nombre: 'CTBC Flying Oyster', region: 'LCP', color: '#F5A524', estrella: ['doggo', 'Doggo', 'ADC'], extra: ['shad0w'] },
  AL: { marca: 'ANYONE’S', nombre: 'Anyone’s Legend', region: 'LPL', color: '#E5392E', estrella: ['tarzan', 'Tarzan', 'Jungla veterano'], extra: [] },
  KC: { marca: 'KARMINE', nombre: 'Karmine Corp', region: 'LEC', color: '#19D3F3', estrella: ['caliste', 'Caliste', 'Campeón del Play-In'], extra: ['kyeahoo'] },
  G2: { marca: 'G2', nombre: 'G2 Esports', region: 'LEC', color: '#E8443A', estrella: ['caps', 'Caps', '9 Mundiales · 2 finales'], extra: ['brokenblade'] },
  DK: { marca: 'DPLUS', nombre: 'Dplus KIA', region: 'LCK', color: '#7FD9E8', estrella: ['showmaker', 'ShowMaker', 'Campeón 2020'], extra: [] },
  HLE: { marca: 'HANWHA', nombre: 'Hanwha Life Esports', region: 'LCK', color: '#F58220', estrella: ['gumayusi', 'Gumayusi', 'MVP de la final 2025'], extra: ['zeus', 'zeka'] },
  TES: { marca: 'TES', nombre: 'Top Esports', region: 'LPL', color: '#FF3B30', estrella: ['jackeylove', 'JackeyLove', 'Campeón 2018'], extra: [] },
  LOS: { marca: 'LOS', nombre: 'LOS', region: 'CBLOL', color: '#FF6A2B', estrella: ['feisty', 'Feisty', 'Mid'], extra: [] },
  T1: { marca: 'T1', nombre: 'T1', region: 'LCK', color: '#E4002B', estrella: ['faker', 'Faker', '6 títulos · 11 Mundiales'], extra: ['keria', 'oner'] },
  TSW: { marca: 'SECRET', nombre: 'Team Secret Whales', region: 'LCP', color: '#B7C1CF', estrella: ['dire', 'Dire', 'Mid'], extra: [] },
  LYON: { marca: 'LYON', nombre: 'LYON', region: 'LCS', color: '#C9A06A', estrella: ['inspired', 'Inspired', 'Jungla'], extra: ['berserker'] },
  BLG: { marca: 'BILIBILI', nombre: 'Bilibili Gaming', region: 'LPL', color: '#36C5F4', estrella: ['viper', 'Viper', 'Campeón 2021'], extra: ['bin', 'knight'] },
  MKOI: { marca: 'KOI', nombre: 'Movistar KOI', region: 'LEC', color: '#4C7DFF', estrella: ['elyoya', 'Elyoya', 'Jungla'], extra: ['supa'] },
};

// Ronda 1, en el orden del calendario (hora CDMX, todos el viernes 23).
// ⚠️ Corregido el 23/10 con el calendario de la API de lolesports: el orden de
// la nota de investigación del 18/10 no fue el que se jugó (BLG–MKOI era el
// último y fue el tercero; el último fue TSW–LYON).
const R1 = [
  ['GEN', 'IG', '11:00', 'Chovy contra los campeones de 2018'],
  ['HLE', 'TES', '12:00', 'El MVP de la final 2025 contra JackeyLove'],
  ['BLG', 'MKOI', '13:00', 'Viper contra Elyoya'],
  ['AL', 'KC', '14:00', 'Debuta el campeón del Play-In'],
  ['G2', 'DK', '15:00', 'Caps contra ShowMaker'],
  ['TL', 'CFO', '16:00', 'Josedeodo, el latino del Mundial'],
  ['LOS', 'T1', '17:00', 'Debuta el tricampeón'],
  ['TSW', 'LYON', '18:00', 'Vietnam contra Norteamérica'],
];

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
// Tamaño de la marca para que quepa en `ancho` (Anton mide ~0,47 em por letra).
const tamMarca = (txt, ancho, max) => Math.min(max, Math.floor(ancho / (0.47 * txt.length)));

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// Cartel de función estelar: Faker al centro, Chovy y Gumayusi detrás.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Arranca la fase suiza de Worlds 2026: dieciséis equipos, ocho lugares en cuartos, y todo empieza el viernes veintitrés en Allen, Texas." style="${SECCION}">
    ${halo(HIELO, 540, 760, 1300, 1300, 0.28)}
    ${halo('#E4002B', 540, 900, 760, 760, 0.3)}
    <div data-contorno style="position: absolute; left: -40px; right: -40px; top: 250px; text-align: center; font-family: ${DISPLAY}; font-size: 430px; line-height: 0.86; color: transparent; -webkit-text-stroke: 2px ${a(PLATA, 0.16)};">SUIZA<br>SUIZA</div>
    <img data-lado src="${foto('chovy')}" alt="Chovy" style="position: absolute; left: -150px; top: 640px; height: 560px; filter: grayscale(0.6) brightness(0.45);">
    <img data-lado src="${foto('gumayusi')}" alt="Gumayusi" style="position: absolute; right: -150px; top: 640px; height: 560px; filter: grayscale(0.6) brightness(0.45);">
    <img data-estrella src="${foto('faker')}" alt="Faker" style="position: absolute; left: 50%; top: 520px; height: 760px; transform: translateX(-50%); -webkit-mask-image: linear-gradient(180deg, #000 78%, transparent 100%); mask-image: linear-gradient(180deg, #000 78%, transparent 100%);">
    <div style="position: absolute; left: 84px; right: 84px; top: 300px; text-align: center;">${chip('Worlds 2026 · Allen, Texas')}</div>
    <div style="position: absolute; left: 0; right: 0; top: 1150px; text-align: center;">
      <div data-titulo class="cromo" style="font-family: ${DISPLAY}; font-size: 230px; line-height: 0.86; letter-spacing: 2px;">FASE<br>SUIZA</div>
      <div data-sub style="margin-top: 26px; font-size: 38px; font-weight: 800; font-style: italic; letter-spacing: 1px; text-transform: uppercase;">16 equipos · <span style="color: ${HIELO};">8 boletos a cuartos</span></div>
    </div>
    ${grano}
  </section>`);

// ── 2–9 · Flyers de la ronda 1 ──────────────────────────────────────────
// Arriba el primer equipo (estrella a la derecha, nombre a la izquierda),
// abajo el segundo en espejo; en medio la banda del VS, girada, con el borde
// de arriba del color de uno y el de abajo del color del otro.
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
R1.forEach(([A, B, hora, gancho], i) => {
  const ea = EQ[A], eb = EQ[B];
  const la = lado(A, true), lb = lado(B, false);
  const notas = `Partido ${i + 1} de la ronda uno: ${ea.nombre} contra ${eb.nombre}, viernes veintitrés a las ${hora} de la Ciudad de México, a un solo mapa. ${gancho}.`;
  slides.push(`
  <section data-label="Partido ${i + 1}" data-screen-label="${String(2 + i).padStart(2, '0')} · ${A} vs ${B}" data-speaker-notes="${notas}" style="${SECCION}">
    <div data-fondo-a style="position: absolute; inset: 0 0 50% 0; background: linear-gradient(200deg, ${a(ea.color, 0.38)}, ${a(ea.color, 0)} 62%);"></div>
    <div data-fondo-b style="position: absolute; inset: 50% 0 0 0; background: linear-gradient(20deg, ${a(eb.color, 0.38)}, ${a(eb.color, 0)} 62%);"></div>
    ${halo(ea.color, 800, 640, 820, 820, 0.4)}
    ${halo(eb.color, 280, 1330, 820, 820, 0.4)}
    ${la.contorno}${lb.contorno}
    ${la.fantasmas}${la.estrella}
    ${lb.fantasmas}${lb.estrella}
    ${la.bloque}${lb.bloque}
    <div style="position: absolute; left: 84px; right: 84px; top: 300px; text-align: center;">
      ${chip(`Ronda 1 · Partido ${i + 1} de 8`)}
      <div data-gancho style="margin-top: 16px; font-size: 34px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px;">${gancho}</div>
    </div>
    <div data-banda style="position: absolute; left: -160px; right: -160px; top: 935px; height: 150px; transform: rotate(-6deg); background: linear-gradient(90deg, #050507, #121219 50%, #050507); border-top: 5px solid ${ea.color}; border-bottom: 5px solid ${eb.color}; box-shadow: 0 0 60px rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; gap: 70px;">
      <div data-fecha style="width: 250px; text-align: right; font-family: ${MONO}; font-size: 26px; font-weight: 600; letter-spacing: 2px; line-height: 1.35;">VIE 23 OCT<br><span style="color: ${MUTED};">BO1</span></div>
      <div data-vs class="cromo" style="font-family: ${DISPLAY}; font-size: 170px; line-height: 1; font-style: italic; padding: 0 10px;">VS</div>
      <div data-fecha style="width: 250px; text-align: left; font-family: ${MONO}; font-size: 26px; font-weight: 600; letter-spacing: 2px; line-height: 1.35;">${hora}<br><span style="color: ${MUTED};">CDMX</span></div>
    </div>
    <div data-destello style="position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none;"></div>
    ${grano}
  </section>`);
});

// ── 10 · El cuadro de la ronda 1 ─────────────────────────────────────────
const cara = (t, color) => `<div style="width: 100px; height: 100px; flex: none; border-radius: 50%; overflow: hidden; border: 3px solid ${color}; background: radial-gradient(circle at 50% 30%, ${a(color, 0.45)}, #0E0E14 75%); box-shadow: 0 0 24px ${a(color, 0.45)};">
          <img src="${foto(EQ[t].estrella[0])}" alt="${EQ[t].estrella[1]}" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; transform: scale(1.35); transform-origin: 50% 0%;">
        </div>`;
const filaCuadro = ([A, B, hora], i) => {
  const ea = EQ[A], eb = EQ[B];
  return `
    <div data-fila style="position: relative; height: 118px; margin-bottom: 10px; border-radius: 22px; background: linear-gradient(90deg, ${a(ea.color, 0.34)}, #0D0D12 38%, #0D0D12 62%, ${a(eb.color, 0.34)}); border: 1px solid ${a(PLATA, 0.12)}; display: flex; align-items: center; padding: 0 9px; box-sizing: border-box;">
      ${cara(A, ea.color)}
      <img src="${logo(A)}" alt="${ea.nombre}" style="width: 66px; height: 56px; object-fit: contain; margin-left: 14px;">
      <div style="flex: 1; margin-left: 12px; font-family: ${DISPLAY}; font-size: 56px; line-height: 1; letter-spacing: 1px;">${A}</div>
      <div style="width: 118px; display: flex; justify-content: center;">
        <div data-medalla style="width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #1C1C24, #08080B 70%); border: 2px solid ${a(PLATA, 0.45)}; box-shadow: 0 0 0 5px ${BG}, 0 0 22px ${a(HIELO, 0.25)}; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="cromo" style="font-family: ${DISPLAY}; font-size: 40px; font-style: italic; line-height: 1;">VS</div>
          <div style="margin-top: 2px; font-family: ${MONO}; font-size: 17px; font-weight: 600; color: ${HIELO};">${hora}</div>
        </div>
      </div>
      <div style="flex: 1; margin-right: 12px; text-align: right; font-family: ${DISPLAY}; font-size: 56px; line-height: 1; letter-spacing: 1px;">${B}</div>
      <img src="${logo(B)}" alt="${eb.nombre}" style="width: 66px; height: 56px; object-fit: contain; margin-right: 14px;">
      ${cara(B, eb.color)}
    </div>`;
};
slides.push(`
  <section data-label="Cuadro" data-screen-label="10 · El cuadro de la ronda 1" data-speaker-notes="Y este es el cuadro de la primera ronda, ocho partidos el viernes veintitrés desde las once de la mañana. Los ganadores pasan a uno cero y los perdedores a cero uno, y a partir de ahí, mismo récord contra mismo récord." style="${SECCION}">
    ${halo(HIELO, 540, 400, 1100, 700, 0.16)}
    <div style="position: relative; text-align: center;">
      ${chip('Viernes 23 de octubre · hora CDMX')}
      <h2 data-titulo class="cromo" style="margin: 16px 0 20px; font-family: ${DISPLAY}; font-weight: 400; font-size: 128px; line-height: 0.86;">RONDA 1</h2>
    </div>
    <div style="position: relative;">
      <div data-espina style="position: absolute; left: 50%; top: 40px; bottom: 50px; width: 3px; margin-left: -1.5px; background: linear-gradient(${a(HIELO, 0)}, ${PLATA} 12%, ${PLATA} 88%, ${a(HIELO, 0)}); transform-origin: top;"></div>
      ${R1.map(filaCuadro).join('')}
      <div data-pie style="margin-top: 8px; text-align: center; font-family: ${MONO}; font-size: 22px; font-weight: 600; letter-spacing: 2px;"><span style="color: ${SUBE};">GANAN → 1–0</span> <span style="color: ${MUTED};">·</span> <span style="color: ${FUERA};">PIERDEN → 0–1</span></div>
    </div>
    ${grano}
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Los flyers comparten coreografía: entran los colores, las estrellas se
// acercan desde los lados, la banda se abre de golpe con un destello y los
// nombres llegan después, como en un cartel de función.
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
  for (var i = 1; i <= 8; i++) animar('Partido ' + i, flyer);

  animar('Cuadro', function (tl, s) {
    tl.from(q(s, '[data-halo]'), { opacity: 0, duration: 1 }, 0)
      .from(uno(s, '[data-chip]'), { y: 20, opacity: 0, duration: 0.45 }, 0)
      .from(uno(s, '[data-titulo]'), { scale: 1.2, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.1)
      .from(uno(s, '[data-espina]'), { scaleY: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)
      .from(q(s, '[data-fila]'), { x: function (i) { return i % 2 ? 120 : -120; }, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.4)
      .from(q(s, '[data-medalla]'), { scale: 0, rotation: -90, duration: 0.45, stagger: 0.09, ease: 'back.out(2)' }, 0.65)
      .from(uno(s, '[data-pie]'), { opacity: 0, y: 12, duration: 0.5 }, 1.5);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Worlds 2026 · Fase suiza</title>
${kit.og({ titulo: 'Worlds 2026 · Fase suiza', descripcion: 'El formato suizo de Worlds 2026 y los ocho partidos de la ronda 1 en flyers de función estelar, con las estrellas de cada equipo.', carpeta: 'creator/suiza' })}
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
