// Generador de index.html — Reporte semanal de Jira · Semana 42 (mar 13 – lun 19 oct 2026)
// Ejecutar: node work/semana42/gen.js
//
// Fuente: worklogs de Jira (urvenue.atlassian.net, proyectos UWS y FES) con
// autor Axl Guillen entre el 13 y el 19 de octubre de 2026 — 19 registros,
// 85 260 s = 23 h 41 m sobre 12 issues. Estados al martes 20 oct 2026.
// Ninguna issue pasó de 20 worklogs, así que la API los devolvió todos.
//
// Quinta entrega de la serie, misma paleta y coreografía que semana38. Las
// semanas 39 a 41 no tuvieron reporte. Lo propio de esta: la historia central
// es una sola tarea (el nuevo mapa 3D, UWS-10771, 66 % de la semana) y, al
// final, dos láminas con las novedades de los repos `presentations` y
// `walkthrough` en la misma semana (pedido de Axl): salen de su git log, no de Jira.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Identidad · paleta Jira (compartida con semana34, 35, 36 y 38) ───────
const BLUE = '#0052CC';
const BRIGHT = '#2684FF';
const WASH = '#DEEBFF';
const BG = '#FFFFFF';
const SOFT = '#F5F7FA';
const INK = '#172B4D';
const MUTED = '#5E6C84';
const LINE = '#DFE1E6';
const OK = '#00875A';    const OK_WASH = '#E3FCEF';
const WARN = '#974F0C';  const WARN_WASH = '#FFF0B3';
const BAD = '#DE350B';   const BAD_WASH = '#FFEBE6';
const GRIS = '#C1C7D0';      // las semanas más viejas en la comparativa
const GRIS_2 = '#8993A4';    // la penúltima

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: BLUE });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(BLUE, 0.14) }),
  kit.lavado({ color: WASH, fuerza: 0.6 }));
const puntosAzul = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });


// ── Datos de la semana ───────────────────────────────────────────────────
const TOTAL_S = 85260;                 // 23 h 41 m
const SEM34_S = 71100, SEM35_S = 54600, SEM36_S = 74880, SEM38_S = 42540;
const hm = s => `${Math.floor(s / 3600)} h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')} m`;

const TEMAS = [
  { n: 'Nuevo mapa 3D', s: 56160, c: BLUE,
    d: 'UWS-10771 — seating3dmap: de la demo en three.js a dos layouts sobre un motor y la opción elegida, en cuatro días.' },
  { n: 'Ajustes de cliente', s: 7920, c: BRIGHT,
    d: 'Bosse Tracking v2 a LIVE, Caesars Glass Bar sin mapa, Circa Legacy Club, Wave Resort y el widget de Boiler.' },
  { n: 'Integraciones y despliegue', s: 7680, c: '#5E9BE8',
    d: 'UWS-8489 — reunión interna y assets de la presentación; UWS-10280 — Turning Stone hacia el deploy con GitHub.' },
  { n: 'Fairmont · Guest Portal', s: 6840, c: '#8FBCEF',
    d: 'Etiquetas navideñas como primer tile y el spa BASIN al final de su grupo, renombrado por venue.' },
  { n: 'Videos del Guest Portal', s: 6660, c: GRIS_2,
    d: 'Propuestas de video para el microsite de LIV y para Caesars Palace, en HD.' },
];

const DIAS = [
  { d: 'MAR 13', s: 19560, n: 6, txt: ['Demo del mapa 3D en staging', 'Fairmont: etiquetas navideñas a LIVE', 'Videos de LIV y reunión de integraciones'] },
  { d: 'MIÉ 14', s: 27120, n: 4, txt: ['Fases 2 y 3 del mapa 3D', 'Video de Caesars Palace', 'Revisión del widget de Boiler'], pico: true },
  { d: 'JUE 15', s: 13680, n: 1, txt: ['Fase 4 del mapa: dos layouts', 'Calidad 3D y datos de inventario', 'Un solo registro, de fondo'] },
  { d: 'VIE 16', s: 14940, n: 4, txt: ['Ajustes post-QA del mapa', 'Caesars Glass Bar sin mapa', 'Fairmont: BASIN al final'] },
  { d: 'LUN 19', s: 9960, n: 4, txt: ['Bosse Tracking v2 a LIVE', 'Turning Stone hacia GitHub', 'Wave Resort y BASIN renombrado'] },
];

// El mapa 3D: cinco registros, uno por fase
const FASES = [
  { d: 'MAR 13', t: '2 h 07 m', n: 'Fase 1 · demo en three.js', x: 'Mapa, lista, selección y disponibilidad en staging; hallazgos del modelo 3D' },
  { d: 'MIÉ 14', t: '4 h 15 m', n: 'Fase 2 · rediseño y API v2', x: 'Estilos del plugin, modo 2D, teclado, tour y responsive' },
  { d: 'MIÉ 14', t: '2 h 18 m', n: 'Fase 3 · tarjeta uvcore', x: 'Hover card, color de acento del sitio y modos de teléfono' },
  { d: 'JUE 15', t: '3 h 48 m', n: 'Fase 4 · dos layouts, un motor', x: 'Classic y Nuevo, calidad 3D y datos de inventario', grande: true },
  { d: 'VIE 16', t: '3 h 08 m', n: 'Post-QA · móvil y navegación', x: 'Lista estilo guest portal en teléfono, zoom hacia el cursor' },
];

const TABLERO = {
  fin: [['UWS-10734', 'Fairmont · etiquetas navideñas'], ['UWS-9478', 'Bosse · Tracking v2'], ['FES-7092', 'Caesars · Glass Bar'], ['FES-7078', 'Circa · Legacy Club']],
  qa: [['UWS-10249', 'Wave Resort · color de fuente']],
  curso: [['UWS-10771', 'Nuevo mapa 3D'], ['FES-7089', 'Fairmont · BASIN'], ['UWS-10280', 'Turning Stone · GitHub'], ['UWS-10576', 'Videos · estrategia GPM'], ['FES-7081', 'Boiler · Book Now'], ['UWS-8489', 'Integraciones']],
  porhacer: [['UWS-10776', 'Video · Caesars Palace']],
};

// ── Helpers de maquetado ─────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.72);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 40px; height: 40px; border-radius: 10px; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">S42</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Reporte semanal · Jira</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `${FONDO_BLANCO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 66px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 62) =>
  `<h2 data-a="up" data-split style="margin: 0; font-size: ${size}px; font-weight: 800; color: ${INK}; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;

const bajada = (txt, max = 1380) =>
  `<p data-a="up2" style="margin: 18px 0 0; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const pill = (txt, bg = 'rgba(255,255,255,0.16)', color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 9px 22px; letter-spacing: 0.3px; white-space: nowrap; ${NUM}">${txt}</span>`;

const chip = (k, dark = false) =>
  `<span style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px; color: ${dark ? '#FFFFFF' : BLUE}; background: ${dark ? 'rgba(255,255,255,0.14)' : WASH}; border-radius: 6px; padding: 3px 10px; white-space: nowrap;">${k}</span>`;

const nota = (txt, color = BLUE) => `
    <div data-a="up3" data-nota style="background: ${color === BLUE ? WASH : color + '14'}; border-left: 5px solid ${color}; border-radius: 0 14px 14px 0; padding: 22px 30px; font-size: 22.5px; font-weight: 400; color: ${INK}; line-height: 1.5; box-shadow: 0 8px 20px rgba(23,43,77,0.08);">${txt}</div>`;

const slides = [];



// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Semana del 13 al 19 de octubre. La de mas horas de la serie, y dos tercios fueron para una sola tarea: el nuevo mapa 3D." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '88% 10%', ancho: 85, alto: 75, fuerza: 0.55 }), kit.lavado({ color: INK, en: '8% 95%', ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
      <div data-orbe style="position: absolute; left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);"></div>
    </div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span data-sello style="width: 74px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 33px; font-weight: 800;">S42</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reporte semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Jira · UrVenue Web Services</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 90px; font-weight: 800; letter-spacing: -3.2px; line-height: 1.05; max-width: 1560px;">Semana 42: el nuevo mapa 3D,<br>de la demo a la opción elegida</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 1180px;">Martes 13 – lunes 19 de octubre de 2026 · Axl Guillen · con base en los worklogs de Jira.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('23 h 41 m registradas')}
      ${pill('12 issues')}
      ${pill('19 worklogs')}
      ${pill('4 finalizadas', '#FFFFFF', BLUE)}
    </div>
  </section>`);

// ── 2 · Números y las cinco semanas ──────────────────────────────────────
const stat = (v, k, sub = '', cuenta = null) => `
        <div data-stat style="${CARD} border-radius: 20px; padding: 22px 26px 20px; display: flex; flex-direction: column; gap: 6px; border-top: 5px solid ${BLUE};">
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 58px; font-weight: 800; color: ${BLUE}; letter-spacing: -2.2px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 21px; font-weight: 600; color: ${INK}; line-height: 1.25;">${k}</span>
          ${sub ? `<span style="font-size: 17.5px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${sub}</span>` : ''}
        </div>`;

// Cinco barras por métrica; la actual en azul y las viejas en grises
const evolucion = (etiqueta, vals, max, fmt) => `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 19px; font-weight: 700; color: ${INK};">${etiqueta}</span>
            ${vals.map(([sem, v], i) => {
              const ultima = i === vals.length - 1;
              const color = ultima ? `linear-gradient(90deg, ${BLUE}, ${BRIGHT})` : (i === vals.length - 2 ? GRIS_2 : GRIS);
              return `
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 14.5px; font-weight: ${ultima ? 800 : 700}; color: ${ultima ? BLUE : MUTED}; width: 46px; letter-spacing: 1px;">${sem}</span>
              <div style="flex: 1; background: ${SOFT}; border-radius: 5px; height: 11px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.13);">
                <div data-barra${ultima ? '-hoy' : ''} style="width: ${Math.round(v / max * 100)}%; height: 100%; border-radius: 5px; background: ${color};${ultima ? ` box-shadow: 0 1px 4px rgba(0,82,204,0.35);` : ''}"></div>
              </div>
              <span style="font-size: 17px; font-weight: ${ultima ? 800 : 600}; color: ${ultima ? BLUE : MUTED}; width: 100px; text-align: right; ${NUM}">${fmt(v)}</span>
            </div>`;
            }).join('')}
          </div>`;

slides.push(`
  <section data-label="La semana en números" data-screen-label="Números" data-speaker-notes="La semana con mas horas registradas de la serie, veintitres horas y cuarenta y un minutos. Los cierres bajan a cuatro porque casi todo el tiempo fue a una sola tarea de fondo." style="${seccion()}">
    ${header('Números')}
    ${h2('La semana con más horas<br>de la serie')}
    ${bajada('23 h 41 m en cinco días con registro. Dos tercios fueron para una sola tarea, el nuevo mapa 3D; el resto, piezas cortas de cliente.')}
    <div data-a="up3" style="margin-top: 26px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;">
      ${stat('23 h 41 m', 'Tiempo registrado', '85 260 s en 19 worklogs')}
      ${stat('12', 'Issues trabajadas', 'Proyectos UWS y FES', 12)}
      ${stat('4', 'Finalizadas', 'Y una más en control de calidad', 4)}
      ${stat('66 %', 'En una sola tarea', 'UWS-10771 · nuevo mapa 3D')}
    </div>
    <div data-comparativa style="${CARD} margin-top: 16px; border-radius: 22px; padding: 16px 32px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px; flex: 1;">
      <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Las cinco semanas del reporte</span>
      ${evolucion('Tiempo registrado', [['S34', SEM34_S], ['S35', SEM35_S], ['S36', SEM36_S], ['S38', SEM38_S], ['S42', TOTAL_S]], TOTAL_S, s => hm(s))}
      ${evolucion('Issues finalizadas', [['S34', 7], ['S35', 9], ['S36', 5], ['S38', 14], ['S42', 4]], 14, v => String(v))}
      <span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Las semanas 39 a 41 no tuvieron reporte. Las curvas vuelven a cruzarse: la 38 fue de barrer pendientes y cerró catorce; esta fue de construir una pieza grande y cerró cuatro.</span>
    </div>
  </section>`);

// ── 3 · Dónde se fue el tiempo · dona SVG ────────────────────────────────
const R = 132, GROSOR = 40, C = +(2 * Math.PI * R).toFixed(2);
let acumulado = 0;
const arcos = TEMAS.map(t => {
  const frac = t.s / TOTAL_S;
  const largo = +(frac * C).toFixed(2);
  const giro = +(-90 + acumulado * 360).toFixed(2);
  acumulado += frac;
  return `<circle data-arco data-largo="${largo}" cx="170" cy="170" r="${R}" fill="none" stroke="${t.c}" stroke-width="${GROSOR}" stroke-dasharray="0 ${C}" stroke-linecap="butt" transform="rotate(${giro} 170 170)"></circle>`;
}).join('\n        ');

slides.push(`
  <section data-label="Dónde se fue el tiempo" data-screen-label="Tiempo por tema" data-speaker-notes="El reparto mas concentrado de la serie: el mapa 3D se llevo el sesenta y seis por ciento. Los otros cuatro frentes rondan el ocho o nueve por ciento cada uno." style="${seccion()}">
    ${header('Tiempo por tema')}
    ${h2('Una tarea se llevó<br>dos tercios de la semana')}
    <div data-a="up2" style="margin-top: 26px; display: grid; grid-template-columns: 420px 1fr; gap: 44px; flex: 1; align-items: center;">
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <svg data-dona viewBox="0 0 340 340" style="width: 380px; height: 380px; overflow: visible;">
          <circle cx="170" cy="170" r="${R}" fill="none" stroke="${SOFT}" stroke-width="${GROSOR}"></circle>
          ${arcos}
        </svg>
        <div style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <span data-total style="font-size: 46px; font-weight: 800; color: ${INK}; letter-spacing: -1.6px; ${NUM}">23 h 41 m</span>
          <span style="font-size: 17px; font-weight: 600; letter-spacing: 1.6px; text-transform: uppercase; color: ${MUTED};">registradas</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 17px;">
        ${TEMAS.map(t => `
        <div data-tema style="display: flex; gap: 16px; align-items: flex-start;">
          <span style="flex: none; margin-top: 7px; width: 16px; height: 16px; border-radius: 5px; background: ${t.c};"></span>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; align-items: baseline; gap: 12px;">
              <span style="font-size: 25px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px;">${t.n}</span>
              <span style="font-size: 21px; font-weight: 700; color: ${t.c === GRIS_2 ? MUTED : t.c}; white-space: nowrap; ${NUM}">${hm(t.s)} · ${Math.round(t.s / TOTAL_S * 100)}%</span>
            </div>
            <span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.4; max-width: 900px;">${t.d}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
    ${nota('Es el reparto más concentrado de la serie, al revés que la semana 38, donde ningún frente pasó del 26 %. <strong style="font-weight: 700;">Así se ve una semana de construcción</strong>: una pieza grande y alrededor solo lo urgente.')}
  </section>`);

// ── 4 · Historia central: el nuevo mapa 3D ───────────────────────────────
slides.push(`
  <section data-label="Mapa 3D" data-screen-label="Mapa 3D" data-speaker-notes="La historia de la semana: el nuevo mapa 3D. Cinco registros, uno por fase, de la demo del martes a los ajustes post-QA del viernes. El jueves se construyeron dos layouts sobre el mismo motor y Hector eligio la opcion dos." style="${seccion()}">
    ${header('Historia central', pill('UWS-10771', WASH, BLUE))}
    ${h2('El nuevo mapa 3D: cinco fases<br>en cuatro días')}
    <div data-a="up2" style="margin-top: 26px; display: grid; grid-template-columns: 0.62fr 1.38fr; gap: 28px; flex: 1;">
      <div data-panel style="${kit.fondo(BLUE, puntosAzul(26), kit.lavado({ color: BRIGHT, en: '85% 8%', ancho: 90, alto: 70, fuerza: 0.6, alcance: 60 }))} border-radius: 26px; padding: 36px 34px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(23,43,77,0.14), 0 18px 40px rgba(0,82,204,0.28);">
        <span data-cuenta="5" style="font-size: 132px; font-weight: 800; letter-spacing: -5px; line-height: 1; ${NUM}">5</span>
        <span style="font-size: 25px; font-weight: 600; margin-top: 6px; line-height: 1.3;">fases — 15 h 36 m, el 66 % de la semana</span>
        <div style="flex: 1;"></div>
        <div style="display: flex; flex-direction: column; gap: 13px;">
          <span style="font-size: 19px; color: rgba(255,255,255,0.85); line-height: 1.45;">Un tipo de mapa nuevo para los microsites: el venue en 3D con <strong style="font-weight: 700;">three.js</strong>, para elegir y reservar un lugar.</span>
          <div style="height: 1px; background: rgba(255,255,255,0.22);"></div>
          <span style="font-size: 19px; color: rgba(255,255,255,0.85); line-height: 1.45;">El jueves se construyeron <strong style="font-weight: 700;">dos layouts sobre el mismo motor</strong> y el viernes el product owner eligió la Opción 2, estilo guest portal.</span>
          <span style="margin-top: 4px; align-self: flex-start; background: rgba(255,255,255,0.16); color: #FFFFFF; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 8px 18px;">En staging · sigue en curso</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div data-lista style="${CARD} border-radius: 22px; padding: 18px 24px; display: flex; flex-direction: column; gap: 6px;">
          ${FASES.map(f => `
          <div data-sitio style="display: grid; grid-template-columns: 96px 330px 1fr 92px; gap: 16px; align-items: center; padding: ${f.grande ? '11px 14px' : '8px 14px'}; border-radius: 12px; ${f.grande ? `background: ${WASH};` : ''}">
            <span style="font-size: 15.5px; font-weight: 800; letter-spacing: 1.4px; color: ${f.grande ? BLUE : MUTED};">${f.d}</span>
            <span style="font-size: ${f.grande ? 22 : 20}px; font-weight: 700; color: ${INK}; letter-spacing: -0.3px;">${f.n}</span>
            <span style="font-size: 16.5px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${f.x}</span>
            <span style="font-size: 18px; font-weight: 800; color: ${f.grande ? BLUE : INK}; text-align: right; ${NUM}">${f.t}</span>
          </div>`).join('')}
        </div>
        <div data-captura style="position: relative; flex: 1; border-radius: 20px; overflow: hidden; border: 1px solid ${LINE}; ${SOMBRA} background: url('assets/mapa3d.jpg') 50% 38% / cover;">
          <span style="position: absolute; left: 16px; bottom: 16px; background: rgba(23,43,77,0.86); color: #FFFFFF; font-size: 16px; font-weight: 700; border-radius: 10px; padding: 8px 14px;">Opción 2 en staging · la presentación completa está en /seating3dmap/</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 5 · Ajustes de cliente ───────────────────────────────────────────────
const fila = (k, titulo, texto, estado, color) => `
        <div data-fila style="${CARD} border-radius: 15px; padding: 13px 24px; display: grid; grid-template-columns: 126px 1fr 168px; gap: 20px; align-items: center;">
          ${chip(k)}
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 21px; font-weight: 700; color: ${INK}; letter-spacing: -0.3px;">${titulo}</span>
            <span style="font-size: 16.5px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${texto}</span>
          </div>
          <span style="font-size: 16.5px; font-weight: 700; text-align: center; padding: 6px 12px; border-radius: 999px; background: ${color === OK ? OK_WASH : color === WARN ? WARN_WASH : WASH}; color: ${color};">${estado}</span>
        </div>`;

slides.push(`
  <section data-label="Ajustes de cliente" data-screen-label="Ajustes de cliente" data-speaker-notes="Alrededor del mapa, siete ajustes cortos de cliente. Cuatro cerrados, uno en control de calidad y dos en curso." style="${seccion()}">
    ${header('Ajustes de cliente')}
    ${h2('Siete ajustes cortos,<br>cuatro ya cerrados')}
    <div data-a="up2" style="margin-top: 22px; display: flex; flex-direction: column; gap: 8px;">
      ${fila('UWS-10734', 'Fairmont · etiquetas navideñas primero', 'Primer tile en GP2 con un ajuste por venue, probado en UAT y publicado — 52 m.', 'Finalizada', OK)}
      ${fila('UWS-9478', 'Bosse · Tracking v2', 'Publicado en LIVE — 48 m.', 'Finalizada', OK)}
      ${fila('FES-7092', 'Caesars · Glass Bar sin mapa', 'Botón del mapa 3D oculto y redirección a la página del evento, en todos los ambientes — 37 m.', 'Finalizada', OK)}
      ${fila('FES-7078', 'Circa · Legacy Club', '«Admission» pasó a «Venue Fee» en todos los ambientes — 19 m.', 'Finalizada', OK)}
      ${fila('UWS-10249', 'Wave Resort · color de fuente', 'Estilos actualizados y merge a stg — 17 m.', 'En QA', BLUE)}
      ${fila('FES-7089', 'Fairmont · BASIN en Banff y Rimrock', 'Al final de su grupo de disponibilidad y renombrado por venue; en staging y main — 1 h 02 m.', 'En curso', WARN)}
      ${fila('FES-7081', 'Boiler · fecha en «Book Now»', 'Revisión de la respuesta de la API — 11 m.', 'En curso', WARN)}
    </div>
    <div style="flex: 1; min-height: 12px;"></div>
    ${nota('Las dos de Fairmont salen del mismo recurso: <strong style="font-weight: 700;">un ajuste por venue en options.php</strong>, que fija una etiqueta o un tile sin tocar el código de los demás venues.')}
  </section>`);

// ── 6 · Videos y despliegue ──────────────────────────────────────────────
const pieza = (etiqueta, k, titulo, items, color, tiempo, cierre) => `
        <div data-pieza style="${CARD} border-radius: 24px; padding: 32px 32px; display: flex; flex-direction: column; gap: 15px; border-top: 5px solid ${color};">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${etiqueta}</span>
            <span style="font-size: 20px; font-weight: 800; color: ${color}; ${NUM}">${tiempo}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 13px;">
            ${chip(k)}
            <span style="font-size: 27px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${items.map(t => `
            <div data-pieza-item style="display: flex; gap: 13px; align-items: flex-start;">
              <span style="flex: none; margin-top: 9px; width: 7px; height: 7px; border-radius: 50%; background: ${color};"></span>
              <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${t}</span>
            </div>`).join('')}
          </div>
          <div style="flex: 1;"></div>
          <div style="height: 1px; background: ${LINE};"></div>
          <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${cierre}</span>
        </div>`;

slides.push(`
  <section data-label="Videos y despliegue" data-screen-label="Videos y despliegue" data-speaker-notes="Dos frentes mas: los videos del Guest Portal, con propuestas para LIV y Caesars Palace, y el despliegue, con la reunion de integraciones y Turning Stone hacia el deploy con GitHub." style="${seccion()}">
    ${header('Videos y despliegue')}
    ${h2('Videos para el Guest Portal<br>y el camino a GitHub')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; flex: 1;">
      ${pieza('Videos del Guest Portal', 'UWS-10576 · 10776', 'Propuestas para dos clientes', [
        'LIV: tres propuestas de video —comparación, Studio y mixta—; la B y la C, renderizadas en HD para revisión.',
        'Caesars Palace: guion con voz nueva y dos propuestas en HD, vertical y de escritorio.',
        'Parte de la estrategia de video del Guest Portal Microsite (qué se graba, por qué y con qué guion).',
      ], '#8FBCEF', '1 h 51 m', 'Las dos esperan revisión antes de producir la versión final.')}
      ${pieza('Integraciones y despliegue', 'UWS-8489 · 10280', 'Reunión y repositorio', [
        'Integrations Management: reunión interna y assets para la presentación — 1 h 05 m.',
        'Turning Stone: convenciones de los repos revisadas (Zouk, Voltaire, Bosse, Marrakech) y snapshots frescos de PRD y STG por SFTP — 1 h 03 m.',
        'Repositorio wp-turning-stone armado solo con los temas, como los demás sitios.',
      ], GRIS_2, '2 h 08 m', 'Turning Stone sigue en curso: falta conectar el deploy con GitHub.')}
    </div>
  </section>`);

// ── 7 · Día por día · curva de la semana ─────────────────────────────────
const AN = 1560, AL = 270, PAD_X = 130;
const maxDia = Math.max(...DIAS.map(d => d.s));
const pts = DIAS.map((d, i) => {
  const x = +(PAD_X + i * ((AN - PAD_X * 2) / (DIAS.length - 1))).toFixed(1);
  const y = +(AL - 26 - (d.s / maxDia) * (AL - 96)).toFixed(1);
  return { x, y, ...d };
});
const linea = pts.map(p => `${p.x},${p.y}`).join(' ');
const area = `${PAD_X},${AL - 26} ${linea} ${pts.at(-1).x},${AL - 26}`;
const largoLinea = +pts.slice(1).reduce((a, p, i) =>
  a + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0).toFixed(1);

slides.push(`
  <section data-label="Día por día" data-screen-label="Día por día" data-speaker-notes="Cinco dias con registro. El miercoles fue el pico con siete horas y media, las fases dos y tres del mapa. El jueves tuvo un solo registro de casi cuatro horas, y el fin de semana no hubo tiempo registrado." style="${seccion()}">
    ${header('Día por día')}
    ${h2('El pico fue el miércoles,<br>con dos fases del mapa')}
    <div data-a="up2" style="margin-top: 20px; position: relative;">
      <svg viewBox="0 0 ${AN} ${AL}" style="width: 100%; height: ${AL}px; overflow: visible;">
        <defs>
          <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${BRIGHT}" stop-opacity="0.28"></stop>
            <stop offset="100%" stop-color="${BRIGHT}" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <line x1="${PAD_X - 60}" y1="${AL - 26}" x2="${AN - PAD_X + 60}" y2="${AL - 26}" stroke="${LINE}" stroke-width="2"></line>
        <polygon data-area points="${area}" fill="url(#relleno)"></polygon>
        <polyline data-linea points="${linea}" fill="none" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${largoLinea}" stroke-dashoffset="0"></polyline>
        ${pts.map(p => `
        <g data-punto>
          <circle cx="${p.x}" cy="${p.y}" r="${p.pico ? 13 : 9}" fill="#FFFFFF" stroke="${p.pico ? BLUE : BRIGHT}" stroke-width="${p.pico ? 6 : 4}"></circle>
          <text x="${p.x}" y="${p.y - 26}" text-anchor="middle" style="font: 800 ${p.pico ? 26 : 22}px ${FONT}; fill: ${p.pico ? BLUE : INK}; ${NUM}">${hm(p.s).replace(' h 0', ' h ').replace(' m', '')}</text>
        </g>`).join('')}
        ${pts.map(p => `<text data-etiqueta x="${p.x}" y="${AL - 4}" text-anchor="middle" style="font: 700 19px ${FONT}; letter-spacing: 1.5px; fill: ${p.pico ? BLUE : MUTED};">${p.d}</text>`).join('')}
      </svg>
    </div>
    <div data-a="up3" style="margin-top: 14px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; flex: 1; align-content: start;">
      ${DIAS.map(d => `
        <div data-dia style="${CARD} ${d.pico ? `border: 2px solid ${BLUE};` : ''} border-radius: 18px; padding: 18px 18px; display: flex; flex-direction: column; gap: 9px;">
          <span style="font-size: 15.5px; font-weight: 700; letter-spacing: 1.5px; color: ${d.pico ? BLUE : MUTED};">${d.n} worklog${d.n === 1 ? '' : 's'}</span>
          <div style="height: 1px; background: ${LINE};"></div>
          ${d.txt.map(t => `<span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.4;"><span style="color: ${BLUE}; font-weight: 700;">·</span> ${t}</span>`).join('')}
        </div>`).join('')}
    </div>
    ${nota('El jueves tuvo <strong style="font-weight: 700;">un solo registro de 3 h 48 m</strong>: la fase de los dos layouts, de principio a fin. El sábado y el domingo no tienen tiempo registrado.')}
  </section>`);

// ── 8 · Estado del tablero ───────────────────────────────────────────────
const col = (titulo, color, wash, issues, cols = 1) => `
        <div data-col style="background: ${wash}; border-radius: 20px; padding: 24px 22px; display: flex; flex-direction: column; gap: 13px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 10px 26px rgba(23,43,77,0.09);">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 10px;">
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: ${color};">${titulo}</span>
            <span data-cuenta="${issues.length}" style="font-size: 38px; font-weight: 800; color: ${color}; letter-spacing: -1px; ${NUM}">${issues.length}</span>
          </div>
          <div style="display: ${cols > 1 ? `grid; grid-template-columns: repeat(${cols}, 1fr)` : 'flex; flex-direction: column'}; gap: 9px;">
            ${issues.map(([k, n]) => `
            <div data-issue style="background: ${BG}; border: 1px solid rgba(23,43,77,0.08); border-radius: 10px; padding: 9px 12px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 2px 6px rgba(23,43,77,0.07);">
              <span style="font-size: 14.5px; font-weight: 700; color: ${color}; letter-spacing: 0.3px;">${k}</span>
              <span style="font-size: 15px; font-weight: 400; color: ${INK}; line-height: 1.3;">${n}</span>
            </div>`).join('')}
          </div>
        </div>`;

slides.push(`
  <section data-label="Estado del tablero" data-screen-label="Estado" data-speaker-notes="Al martes veinte de octubre: cuatro finalizadas, una en QA, seis en curso y una por hacer. La columna en curso es la mas grande porque el mapa y los videos siguen abiertos." style="${seccion()}">
    ${header('Estado')}
    ${h2('Cómo quedó el tablero')}
    ${bajada('Estado en Jira al martes 20 de octubre. Por primera vez en la serie, la columna más larga es la de trabajo en curso.')}
    <div data-a="up3" style="margin-top: 26px; display: grid; grid-template-columns: 1fr 0.8fr 1.6fr 0.8fr; gap: 20px; flex: 1; align-content: start;">
      ${col('Finalizadas', OK, OK_WASH, TABLERO.fin)}
      ${col('En QA', BLUE, WASH, TABLERO.qa)}
      ${col('En curso', WARN, WARN_WASH, TABLERO.curso, 2)}
      ${col('Por hacer', MUTED, SOFT, TABLERO.porhacer)}
    </div>
  </section>`);

// ── 9 · Lo que viene ─────────────────────────────────────────────────────
const siguiente = (n, titulo, texto, color = BLUE) => `
        <div data-sig style="${CARD} border-radius: 22px; padding: 30px 28px; display: flex; flex-direction: column; gap: 11px; border-top: 5px solid ${color};">
          <span style="font-size: 16.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color};">${n}</span>
          <span style="font-size: 25px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

slides.push(`
  <section data-label="Lo que viene" data-screen-label="Lo que viene" data-speaker-notes="Semana 43: el mapa 3D sigue con el carrito y QA en telefonos reales, y hay tres frentes cortos por cerrar." style="${seccion()}">
    ${header('Lo que viene')}
    ${h2('La semana 43 sigue<br>con el mapa')}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; flex: 1; align-content: start;">
      ${siguiente('Construir', 'Nuevo mapa 3D', 'Conectar el carrito, hacer QA en teléfonos reales y quitar el layout Classic ahora que se eligió la Opción 2.')}
      ${siguiente('Cerrar', 'Fairmont · BASIN', 'Verificar el renombre en producción y pasar FES-7089 a QA.', WARN)}
      ${siguiente('Revisar', 'Videos del Guest Portal', 'Recibir la revisión de las propuestas de LIV y Caesars Palace para producir las versiones finales.', WARN)}
      ${siguiente('Desplegar', 'Turning Stone con GitHub', 'Terminar la conexión del repositorio wp-turning-stone con el deploy (UWS-10280).', OK)}
    </div>
    ${nota('El tablero queda con <strong style="font-weight: 700;">una sola issue en QA</strong> y nada devuelto de control de calidad.', OK)}
  </section>`);

// ── 10–11 · Además, esta semana: novedades en los repos ──────────────────
// Pedido de Axl: al final del reporte, lo que cambió en `presentations` y en
// `walkthrough` la misma semana. Las cifras salen de su git log (13–19 oct) y
// de sus docs; walkthrough es un repo privado, así que aquí solo va lo que ya
// aparece en los reportes (Caesars, LIV, el mapa 3D) y ningún nombre de persona.
const miniStat = (v, t) => `
        <div data-mini style="${CARD} border-radius: 16px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; border-top: 4px solid ${BLUE};">
          <span style="font-size: 38px; font-weight: 800; color: ${BLUE}; letter-spacing: -1.4px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 16px; font-weight: 600; color: ${MUTED}; line-height: 1.3;">${t}</span>
        </div>`;
const novedad = (n, t, d, extra = '') => `
        <div data-nov style="${CARD} border-radius: 18px; padding: 20px 22px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="flex: none; width: 34px; height: 34px; border-radius: 10px; background: ${WASH}; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800;">${n}</span>
            <span style="font-size: 21px; font-weight: 800; color: ${INK}; letter-spacing: -0.3px; line-height: 1.2;">${t}</span>
          </div>
          <span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.42;">${d}</span>
          ${extra ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;">${extra}</div>` : ''}
        </div>`;
const etiquetas = (...xs) => xs.map(x => chip(x)).join('');

slides.push(`
  <section data-label="Novedades · presentations" data-screen-label="Novedades · presentations" data-speaker-notes="Ademas, esta semana. En el repo de presentaciones: ocho decks nuevos, un kit de animacion con efectos con nombre, y el render de video veinte veces mas rapido." style="${seccion()}">
    ${header('Además · presentations', pill('21 commits', WASH, BLUE))}
    ${h2('presentations: ocho decks nuevos<br>y un kit que renderiza 20 veces más rápido')}
    <div data-a="up2" style="margin-top: 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      ${miniStat('8', 'decks nuevos · 193 láminas')}
      ${miniStat('38 → 46', 'decks en la galería')}
      ${miniStat('145 → 6,6 s', 'capturar un deck de 17 láminas')}
      ${miniStat('248 → ~30 s', 'render cuadro a cuadro de 862 cuadros')}
    </div>
    <div data-a="up3" style="margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; flex: 1; align-content: start;">
      ${novedad(1, 'Dos charlas con video narrado', 'Ultracode en la práctica (15 láminas) y DRA (18), con videos de unos 4 minutos en la voz de Axl y sin silencios.', etiquetas('ultracode', 'dra'))}
      ${novedad(2, 'Kit con GSAP 3.15', 'Todos los plugins, 25 efectos con nombre y 8 efectos SVG, deterministas y declarados en el HTML.', etiquetas('lab · 60', 'novedades · 27'))}
      ${novedad(3, 'Continuidad y dibujo a líneas', 'El efecto continua, como el Morph de PowerPoint, con seis modos; y objetos 3D dibujados solo con trazos.', etiquetas('continua', 'kit.lineas'))}
      ${novedad(4, 'Video más rápido', 'Capturas y cuadros en paralelo, voz con caché y reproductor arreglado: la capa del video ya no tapa el deck al cargar.', etiquetas('video.mjs', 'cuadros.mjs'))}
      ${novedad(5, 'seating3dmap', 'El reporte de producto del nuevo mapa 3D, en inglés: 19 láminas con deslizadores, zoom de cámara y demo de Reset view.', etiquetas('UWS-10771'))}
      ${novedad(6, 'Esports y Cumplelolero', 'Worlds fase suiza, Lux y Graves, y una herramienta que corta cada lámina en un miniclip listo para el montaje.', etiquetas('laminas.mjs'))}
    </div>
  </section>`);

slides.push(`
  <section data-label="Novedades · walkthrough" data-screen-label="Novedades · walkthrough" data-speaker-notes="Y en walkthrough, la herramienta que graba videos de producto sobre la app real: los videos de Caesars y LIV de esta semana salieron de ahi, se puede narrar con una grabacion real y la captura es dos a cuatro veces mas rapida." style="${seccion()}">
    ${header('Además · walkthrough', pill('59 commits', WASH, BLUE))}
    ${h2('walkthrough: videos de producto<br>grabados sobre la app real')}
    ${bajada('Recorre una app web real con Playwright y produce un video narrado con zoom a lo importante, cada clic dibujado y voz. Los videos de esta semana salieron de ahí.', 1500)}
    <div data-a="up2" style="margin-top: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      ${miniStat('11', 'tours nuevos: Caesars, LIV y el mapa 3D')}
      ${miniStat('~501 → ~825', 'casos de prueba')}
      ${miniStat('48 → 11 s', 'captura con marco de teléfono')}
      ${miniStat('−30 %', 'CPU al codificar · videos 20–36 % más chicos')}
    </div>
    <div data-a="up3" style="margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; flex: 1; align-content: start;">
      ${novedad(1, 'Videos para clientes', 'Caesars Itinerary Planner en versión 2.0, vertical y 16:9; tres propuestas para LIV; y el mapa 3D en escritorio y teléfono.', etiquetas('UWS-10776', 'UWS-10576', 'UWS-10771'))}
      ${novedad(2, 'Narrar con una grabación real', 'La grabación se corta en sus pausas y whisper.cpp, local y gratis, da el tiempo de cada palabra para los subtítulos.')}
      ${novedad(3, 'Pasada de rendimiento', 'Solo los píxeles que el tour necesita y navegación que no espera a que toda la red se calle: en LIV, de 29,7 s a 4–5 s por tour.')}
      ${novedad(4, 'Recetas de texto de presentations', 'Líneas, letras, marcatextos, máquina de escribir y tragamonedas, reescritas para los overlays y con semilla.')}
      ${novedad(5, 'Gestos y puntero', 'Arrastre y rueda cuadro a cuadro, un halo bajo cada clic y el dedo dibujado en teléfono.')}
      ${novedad(6, 'Pendiente', 'Dos commits locales sin subir y la siguiente versión de Caesars todavía sin registrar en git.', etiquetas('main local'))}
    </div>
  </section>`);


// ── Cierre ───────────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="En una frase: la semana de mas horas de la serie, casi toda para el nuevo mapa 3D, que paso de demo a la opcion elegida en cuatro dias." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '15% 90%', ancho: 80, alto: 70, fuerza: 0.5, alcance: 60 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; left: 40%; bottom: -260px; width: 520px; height: 520px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.09);"></div>
    </div>
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-split style="margin: 26px 0 0; font-size: 84px; font-weight: 800; letter-spacing: -3px; line-height: 1.05; max-width: 1540px;">La semana de más horas,<br>casi toda para el mapa 3D</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.55; max-width: 1220px;">23 h 41 m en 12 issues: el nuevo mapa pasó de demo a la opción elegida en cuatro días, con siete ajustes de cliente alrededor.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Semana 42 · 13–19 oct 2026')}
      ${pill('Fuente: worklogs de Jira · UWS y FES')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Semana 42 · Reporte semanal Jira</title>
${kit.og({ titulo: 'Semana 42 · Reporte semanal Jira', descripcion: '23 h 41 m en 12 issues del 13 al 19 de octubre: el nuevo mapa 3D pasó de demo a la opción elegida en cuatro días, siete ajustes de cliente y las novedades de presentations y walkthrough.', carpeta: 'work/semana42' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BLUE}; }
  /* Las entradas las orquesta GSAP (coreografía al final del documento).
     Cero estados iniciales ocultos en CSS a propósito: sin JS el deck se ve
     completo y estático, y la impresión a PDF sigue funcionando. */
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.35); border-radius: 999px;
    background: rgba(23,43,77,0.85); color: #FFFFFF; cursor: pointer;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1920" height="1080">
${slides.join('\n')}
</deck-stage>
<script src="./gsap.min.js"></script>
${kit.animador()}
<script>
// ── Coreografía ──────────────────────────────────────────────────────────
// La misma familia que semana35 y semana36 (es una serie): titulares partidos
// en palabras con entrada 3D, dona que se traza, curva que se dibuja, barras
// comparativas y contadores. Todo con GSAP core y con tl.from(), para que sin
// JS el deck se vea completo y el PDF no se rompa.
(function () {
  if (!window.animar || !window.gsap) return;

  // Parte un titular en palabras envueltas en <span>, respetando los <br>.
  // Idempotente: una sola vez por elemento, porque las timelines se
  // reconstruyen cada vez que la slide se reactiva.
  function partir(el) {
    if (!el || el.dataset.partido) return [];
    var salida = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;                       // <br> y demás, intactos
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\\s+)/).forEach(function (parte) {
        if (!parte) return;
        if (/^\\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
        var s = document.createElement('span');
        s.textContent = parte;
        s.style.display = 'inline-block';
        s.style.willChange = 'transform, opacity';
        frag.appendChild(s);
        salida.push(s);
      });
      el.replaceChild(frag, n);
    });
    el.dataset.partido = '1';
    return salida;
  }
  function palabras(el) {
    if (!el) return [];
    if (el.dataset.partido) return el.querySelectorAll('span');
    return partir(el);
  }
  function titular(tl, el, pos) {
    var ps = palabras(el);
    if (!ps.length) return;
    tl.from(ps, { y: 40, opacity: 0, rotationX: -55, transformPerspective: 900,
                  transformOrigin: '50% 100%', duration: 0.7, stagger: 0.045,
                  ease: 'power3.out' }, pos || 0);
  }
  function cuentaHM(tl, el, seg, pos) {
    if (!el) return;
    var o = { v: 0 };
    tl.to(o, { v: seg, duration: 1.05, ease: 'power2.out', onUpdate: function () {
      var h = Math.floor(o.v / 3600), m = Math.round(o.v % 3600 / 60);
      el.textContent = h + ' h ' + (m < 10 ? '0' + m : m) + ' m';
    } }, pos || 0);
  }
  var Q = function (s, sel) { return s.querySelectorAll(sel); };
  var q = function (s, sel) { return s.querySelector(sel); };

  animar('Portada', function (tl, s) {
    tl.from(Q(s, '[data-orbe]'), { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 0)
      .from(q(s, '[data-sello]'), { scale: 0, rotation: -90, duration: 0.7, ease: 'back.out(1.7)' }, 0.1)
      .from(q(s, '[data-a="up"] div'), { x: -22, opacity: 0, duration: 0.55 }, 0.25);
    titular(tl, q(s, 'h1'), 0.3);
    tl.from(q(s, 'p'), { y: 22, opacity: 0, duration: 0.55 }, 0.75)
      .from(Q(s, 'div[data-a="up3"] span'), { y: 18, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.06 }, 0.85);
  });

  animar('La semana en números', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-stat]'), { y: 40, opacity: 0, rotationX: -28, transformPerspective: 1200,
                                   transformOrigin: '50% 0%', duration: 0.65, stagger: 0.07 }, 0.3)
      .from(q(s, '[data-comparativa]'), { y: 30, opacity: 0, duration: 0.6 }, 0.6)
      // las semanas viejas crecen primero; la actual remata y es la que manda
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.5, ease: 'power2.inOut', stagger: 0.04 }, 0.62)
      .from(Q(s, '[data-barra-hoy]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.82);
    Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, 0.45); });
  });

  animar('Dónde se fue el tiempo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-dona]'), { rotation: -22, scale: 0.9, opacity: 0, duration: 0.8,
                                   transformOrigin: '50% 50%', ease: 'power3.out' }, 0.15);
    Q(s, '[data-arco]').forEach(function (arco, i) {
      tl.to(arco, { attr: { 'stroke-dasharray': arco.dataset.largo + ' ${C}' },
                    duration: 0.5, ease: 'power2.out' }, 0.35 + i * 0.11);
    });
    cuentaHM(tl, q(s, '[data-total]'), ${TOTAL_S}, 0.4);
    tl.from(Q(s, '[data-tema]'), { x: 34, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.45)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.95);
  });

  animar('Mapa 3D', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-panel]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100,
                                    transformOrigin: '0% 50%', duration: 0.8 }, 0.2)
      .from(q(s, '[data-lista]'), { x: 50, opacity: 0, duration: 0.75 }, 0.3)
      // los ocho sitios caen en cascada rápida: es un barrido
      .from(Q(s, '[data-sitio]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.55)
      .from(q(s, '[data-captura]'), { y: 30, opacity: 0, scale: 0.97, duration: 0.7 }, 0.75);
    cuenta(tl, q(s, '[data-cuenta]'), 0.4);
  });

  animar('Videos y despliegue', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-pieza]'), { y: 46, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                    transformOrigin: '50% 0%', duration: 0.7, stagger: 0.14 }, 0.25)
      .from(Q(s, '[data-pieza-item]'), { y: 16, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.55)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.95);
  });

  animar('Ajustes de cliente', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-fila]'), { x: -40, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.25)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.9);
  });

  animar('Día por día', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    var linea = q(s, '[data-linea]');
    if (linea) tl.from(linea, { attr: { 'stroke-dashoffset': ${largoLinea} }, duration: 1.1, ease: 'power1.inOut' }, 0.25);
    tl.from(q(s, '[data-area]'), { opacity: 0, duration: 0.9 }, 0.5)
      .from(Q(s, '[data-punto]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%',
                                    duration: 0.45, ease: 'back.out(2.2)', stagger: 0.13 }, 0.55)
      .from(Q(s, '[data-etiqueta]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.13 }, 0.6)
      .from(Q(s, '[data-dia]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.72)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.55 }, 1.0);
  });

  animar('Estado del tablero', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-col]'), { y: 36, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.3)
      .from(Q(s, '[data-issue]'), { y: 14, opacity: 0, duration: 0.4, stagger: 0.028 }, 0.55);
    Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, 0.5); });
  });

  animar('Lo que viene', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-sig]'), { y: 40, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                  transformOrigin: '50% 0%', duration: 0.65, stagger: 0.1 }, 0.25)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.8);
  });

  function novedades(tl, s) {
    titular(tl, q(s, 'h2'), 0);
    var baj = q(s, 'p[data-a="up2"]');
    if (baj) tl.from(baj, { y: 20, opacity: 0, duration: 0.5 }, 0.2);
    tl.from(Q(s, '[data-mini]'), { y: 30, opacity: 0, rotationX: -25, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 0.55, stagger: 0.07 }, 0.25)
      .from(Q(s, '[data-nov]'), { y: 26, opacity: 0, duration: 0.45, stagger: 0.07 }, 0.55);
  }
  animar('Novedades · presentations', novedades);
  animar('Novedades · walkthrough', novedades);

  animar('Cierre', function (tl, s) {
    tl.from(Q(s, '[data-orbe]'), { scale: 0.82, opacity: 0, duration: 1.2, stagger: 0.14, ease: 'power2.out' }, 0)
      .from(q(s, '[data-a="up"]'), { y: 20, opacity: 0, duration: 0.5 }, 0.1);
    titular(tl, q(s, 'h2'), 0.2);
    tl.from(q(s, 'p'), { y: 22, opacity: 0, duration: 0.6 }, 0.7)
      .from(Q(s, 'div[data-a="up3"] span'), { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.85);
  });
})();
</script>
<script>
(function () {
  var presenting = false;
  var btn = document.createElement('button');
  btn.id = 'modo-presentacion';
  btn.type = 'button';
  function render() {
    btn.textContent = presenting ? 'Salir · Esc' : 'Presentar · P';
    if (presenting) btn.setAttribute('data-on', '');
    else btn.removeAttribute('data-on');
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

// kit.diferir es la convención del repo aunque este deck no traiga imágenes:
// si algún día se le añade una, sale diferida sin tener que acordarse.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
