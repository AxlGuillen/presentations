// Generador de index.html — Reporte semanal de Jira · Semana 36 (mar 1 – lun 7 sep 2026)
// Ejecutar: node semana36/gen.js
//
// Fuente: worklogs de Jira (urvenue.atlassian.net, proyecto UWS) con autor
// Axl Guillen entre el 1 y el 7 de septiembre de 2026 — 24 registros,
// 74 880 s = 20 h 48 m sobre 15 issues. Estados al martes 8 sep 2026.
// Esta semana ninguna issue superó los 20 worklogs, así que la API de
// búsqueda los devolvió todos (en semana35 hubo que ir al changelog).
//
// Tercera entrega de la serie: misma paleta Jira y misma coreografía v2.0 que
// semana35 (titulares partidos, dona SVG, curva que se dibuja, data-step),
// porque son una serie. Lo nuevo aquí es la comparativa de las TRES semanas y
// la lámina de la línea de producción del tracking.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad · paleta Jira (compartida con semana34 y semana35) ─────────
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
const GRIS = '#B3BAC5';      // semanas anteriores en la comparativa
const GRIS_2 = '#8993A4';    // la penúltima, un tono más oscuro

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: BLUE });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(BLUE, 0.14) }),
  kit.lavado({ color: WASH, fuerza: 0.6 }));
const puntosAzul = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });

// ── Datos de la semana ───────────────────────────────────────────────────
const TOTAL_S = 74880;                 // 20 h 48 m
const SEM34_S = 71100, SEM35_S = 54600;
const hm = s => `${Math.floor(s / 3600)} h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')} m`;

const TEMAS = [
  { n: 'Turning Stone · página de Game Day', s: 31680, c: BLUE,
    d: 'UWS-9375 — la página completa: banner, «up next», horarios, un bloque nuevo, estilos y carga en el CMS.' },
  { n: 'Tracking v2 · tres propiedades más', s: 14460, c: BRIGHT,
    d: 'UWS-9611, UWS-9614 y UWS-9615 — ZoukLV, Sevilla y The Cheetah; además cerró RWLV, que venía en curso.' },
  { n: 'AEO · sitios con UWS AI', s: 11220, c: '#5E9BE8',
    d: 'UWS-8202, UWS-8564 y UWS-8619 — módulo AEO actualizado en Zouk Group, bodegamke y Turning Stone, con revisión de llms.txt.' },
  { n: 'Guest Portal unificado', s: 10680, c: '#8FBCEF',
    d: 'UWS-8324, UWS-9714 y UWS-9730 — arranque del proyecto, vocabulario de eventos de GP2 y la ruta lenta del catálogo.' },
  { n: 'Caesars, Wynn, GPM y weekly', s: 6840, c: GRIS,
    d: 'Pop-up de Caesars Palace publicado, revisión de metadatos en Wynn, el traslape de GPM y la reunión del equipo.' },
];

const DIAS = [
  { d: 'MAR 1', s: 15300, n: 6, txt: ['Arranca la página de Game Day: banner, «up next» y horarios', 'Analytics de GP2 inventariado y adoptado en GPM', 'Diagnóstico de la ruta lenta + caché SWR'] },
  { d: 'MIÉ 2', s: 19680, n: 1, txt: ['Un solo registro, todo el día en Game Day: bloque nuevo, estilos y CMS'], pico: true },
  { d: 'JUE 3', s: 21480, n: 8, txt: ['ZoukLV y Sevilla migrados a tracking v2', 'Pop-up de Caesars publicado', 'Kickoff del Guest Portal unificado', 'Detalles y estilos de Game Day'], pico: true },
  { d: 'VIE 4', s: 5280, n: 3, txt: ['AEO de bodegamke a STG y LIVE', 'Módulo AEO de Turning Stone confirmado en LIVE'] },
  { d: 'LUN 7', s: 13140, n: 6, txt: ['AEO de Zouk Group en STG con reporte', 'The Cheetah migrado a v2', 'Sevilla a LIVE y banner de video corregido', 'Revisión de llms.txt en dos sitios'] },
];

// Las cinco propiedades con tracking v2, en el orden en que se migraron
const TRACKING = [
  { n: 'RWLV', k: 'UWS-9493', s: 'Semana 35 · cerrada esta semana', hecho: true },
  { n: 'Voltaire', k: 'UWS-9608', s: 'Semana 35 · cerrada', hecho: true },
  { n: 'Zouk LV', k: 'UWS-9611', s: 'Migrada y publicada · 1 h 30 m', nueva: true },
  { n: 'Sevilla', k: 'UWS-9614', s: 'Migrada, a LIVE y banner corregido · 1 h 16 m', nueva: true },
  { n: 'The Cheetah', k: 'UWS-9615', s: 'Códigos v1 → v2 · 1 h 03 m', nueva: true },
];

// Continuidad con la semana 35
const COLA = [
  { k: 'UWS-9493', t: 'RWLV · Tracking v2', de: 'En curso', a: 'Finalizada', bien: true },
  { k: 'UWS-9375', t: 'Turning Stone · Game Day', de: 'Por hacer', a: 'Esperando cliente', bien: true },
  { k: 'UWS-9583', t: 'GPM · aviso de traslapes', de: 'Regresó de QA', a: 'Sigue en QA', bien: false },
];

const TABLERO = {
  fin: [
    ['UWS-9493', 'RWLV · Tracking v2'],
    ['UWS-9730', 'Ruta lenta del catálogo'],
    ['UWS-9821', 'Caesars · pop-up del 13/9'],
    ['UWS-8619', 'AEO · nightlife de Turning Stone'],
    ['UWS-9139', 'Wynn · UrPay en widgets'],
  ],
  qa: [
    ['UWS-9611', 'Zouk LV · Tracking v2'],
    ['UWS-9614', 'Sevilla · Tracking v2'],
    ['UWS-9615', 'The Cheetah · Tracking v2'],
    ['UWS-8202', 'AEO · Zouk Group'],
    ['UWS-8564', 'AEO · bodegamke'],
    ['UWS-9714', 'Guest Portal · analytics'],
  ],
  curso: [['UWS-8324', 'Guest Portal unificado'], ['UWS-8489', 'Gestión de integraciones']],
  esperando: [['UWS-9375', 'Turning Stone · Game Day'], ['UWS-9583', 'GPM · traslapes (de QA)']],
};

// ── Helpers de maquetado ─────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.72);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 40px; height: 40px; border-radius: 10px; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">S36</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Reporte semanal · Jira UWS</span>
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
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Semana del 1 al 7 de septiembre. La mas cargada de las tres: 20 horas 48. Casi la mitad se fue en una sola pagina, la de Game Day de Turning Stone." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '88% 10%', ancho: 85, alto: 75, fuerza: 0.55 }), kit.lavado({ color: INK, en: '8% 95%', ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
      <div data-orbe style="position: absolute; left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);"></div>
    </div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span data-sello style="width: 74px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 33px; font-weight: 800;">S36</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reporte semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Jira · UrVenue Web Services</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 94px; font-weight: 800; letter-spacing: -3.4px; line-height: 1.04; max-width: 1600px;">Semana 36: casi nueve horas<br>en una sola página</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 1120px;">Martes 1 – lunes 7 de septiembre de 2026 · Axl Guillen · con base en los worklogs de Jira.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('20 h 48 m registradas')}
      ${pill('15 issues')}
      ${pill('24 worklogs')}
      ${pill('la semana más cargada', '#FFFFFF', BLUE)}
    </div>
  </section>`);

// ── 2 · Números y comparativa de las tres semanas ────────────────────────
const stat = (v, k, sub = '', cuenta = null) => `
        <div data-stat style="${CARD} border-radius: 20px; padding: 30px 28px 26px; display: flex; flex-direction: column; gap: 8px; border-top: 5px solid ${BLUE};">
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 58px; font-weight: 800; color: ${BLUE}; letter-spacing: -2.2px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 21px; font-weight: 600; color: ${INK}; line-height: 1.25;">${k}</span>
          ${sub ? `<span style="font-size: 17.5px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${sub}</span>` : ''}
        </div>`;

// Tres barras por métrica: S34, S35 y S36 (esta última en azul)
const evolucion = (etiqueta, vals, max, fmt) => `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 20px; font-weight: 700; color: ${INK};">${etiqueta}</span>
            ${vals.map((v, i) => {
              const ultima = i === vals.length - 1;
              const color = ultima ? `linear-gradient(90deg, ${BLUE}, ${BRIGHT})` : (i === vals.length - 2 ? GRIS_2 : GRIS);
              return `
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 14.5px; font-weight: ${ultima ? 800 : 700}; color: ${ultima ? BLUE : MUTED}; width: 46px; letter-spacing: 1px;">S3${4 + i}</span>
              <div style="flex: 1; background: ${SOFT}; border-radius: 5px; height: 12px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.13);">
                <div data-barra${ultima ? '-hoy' : ''} style="width: ${Math.round(v / max * 100)}%; height: 100%; border-radius: 5px; background: ${color};${ultima ? ` box-shadow: 0 1px 4px rgba(0,82,204,0.35);` : ''}"></div>
              </div>
              <span style="font-size: 17px; font-weight: ${ultima ? 800 : 600}; color: ${ultima ? BLUE : MUTED}; width: 102px; text-align: right; ${NUM}">${fmt(v)}</span>
            </div>`;
            }).join('')}
          </div>`;

slides.push(`
  <section data-label="La semana en números" data-screen-label="Números" data-speaker-notes="20 horas 48: el techo de las tres semanas. Cinco finalizadas, menos que las nueve de la semana pasada, porque seis quedaron esperando veredicto de QA." style="${seccion()}">
    ${header('Números')}
    ${h2('El techo de las tres semanas')}
    ${bajada('20 h 48 m en cinco días, 15 issues tocadas. Se cerraron menos que la semana pasada porque seis quedaron esperando veredicto en control de calidad.')}
    <div data-a="up3" style="margin-top: 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;">
      ${stat('20 h 48 m', 'Tiempo registrado', '74 880 s en 24 worklogs')}
      ${stat('15', 'Issues trabajadas', 'Todas en el proyecto UWS', 15)}
      ${stat('5', 'Finalizadas', 'Y 6 más esperando en QA', 5)}
      ${stat('4 h 10 m', 'Promedio por día', 'Jueves y miércoles, casi 6 h')}
    </div>
    <div data-comparativa style="${CARD} margin-top: 22px; border-radius: 22px; padding: 24px 32px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; flex: 1;">
      <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Las tres semanas del reporte</span>
      ${evolucion('Tiempo registrado', [SEM34_S, SEM35_S, TOTAL_S], TOTAL_S, s => hm(s))}
      ${evolucion('Issues finalizadas', [7, 9, 5], 9, v => String(v))}
      <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">La curva de cierres baja porque el trabajo se hizo más profundo: una página construida de cero y tres migraciones que aún no salen de QA.</span>
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
  <section data-label="Dónde se fue el tiempo" data-screen-label="Tiempo por tema" data-speaker-notes="Cinco frentes. Game Day se lleva 42 por ciento: la primera vez en la serie que un solo ticket domina asi la semana." style="${seccion()}">
    ${header('Tiempo por tema')}
    ${h2('Un solo ticket se llevó<br>cuatro de cada diez minutos')}
    <div data-a="up2" style="margin-top: 26px; display: grid; grid-template-columns: 420px 1fr; gap: 44px; flex: 1; align-items: center;">
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <svg data-dona viewBox="0 0 340 340" style="width: 380px; height: 380px; overflow: visible;">
          <circle cx="170" cy="170" r="${R}" fill="none" stroke="${SOFT}" stroke-width="${GROSOR}"></circle>
          ${arcos}
        </svg>
        <div style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <span data-total style="font-size: 46px; font-weight: 800; color: ${INK}; letter-spacing: -1.6px; ${NUM}">20 h 48 m</span>
          <span style="font-size: 17px; font-weight: 600; letter-spacing: 1.6px; text-transform: uppercase; color: ${MUTED};">registradas</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${TEMAS.map(t => `
        <div data-tema style="display: flex; gap: 16px; align-items: flex-start;">
          <span style="flex: none; margin-top: 7px; width: 16px; height: 16px; border-radius: 5px; background: ${t.c};"></span>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; align-items: baseline; gap: 12px;">
              <span style="font-size: 24px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px;">${t.n}</span>
              <span style="font-size: 21px; font-weight: 700; color: ${t.c === GRIS ? MUTED : t.c}; white-space: nowrap; ${NUM}">${hm(t.s)} · ${Math.round(t.s / TOTAL_S * 100)}%</span>
            </div>
            <span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.4; max-width: 900px;">${t.d}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
    ${nota('Es el reparto más desigual de la serie: en las semanas 34 y 35 ningún frente pasó de un tercio. <strong style="font-weight: 700;">Aquí uno solo se llevó el 42 %</strong> — construir una página entera no se parte en tareas chicas.')}
  </section>`);

// ── 4 · Historia central: la página de Game Day ──────────────────────────
const paso = (n, titulo, texto) => `
          <div data-etapa style="display: flex; gap: 18px; align-items: flex-start;">
            <span data-etapa-num style="flex: none; width: 44px; height: 44px; border-radius: 13px; background: ${WASH}; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; ${NUM}">${n}</span>
            <div style="display: flex; flex-direction: column; gap: 3px; padding-top: 2px;">
              <span style="font-size: 24px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px;">${titulo}</span>
              <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.42;">${texto}</span>
            </div>
          </div>`;

slides.push(`
  <section data-label="Game Day" data-screen-label="Game Day" data-speaker-notes="La historia de la semana. Tres dias sobre la misma pagina: el martes la estructura, el miercoles completo el bloque nuevo y el CMS, el jueves los detalles. Quedo esperando revision del cliente." style="${seccion()}">
    ${header('Historia central')}
    ${h2('La página de Game Day,<br>de cero a esperando cliente')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 0.78fr 1.32fr; gap: 32px; flex: 1;">
      <div data-panel style="${kit.fondo(BLUE, puntosAzul(26), kit.lavado({ color: BRIGHT, en: '85% 8%', ancho: 90, alto: 70, fuerza: 0.6, alcance: 60 }))} border-radius: 26px; padding: 40px 36px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(23,43,77,0.14), 0 18px 40px rgba(0,82,204,0.28);">
        <span data-cuenta="42" data-sufijo="%" style="font-size: 118px; font-weight: 800; letter-spacing: -5px; line-height: 1; ${NUM}">42%</span>
        <span style="font-size: 24px; font-weight: 600; margin-top: 8px; line-height: 1.3;">de la semana — 8 h 48 m en 3 worklogs</span>
        <div style="flex: 1;"></div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin: 26px 0 4px;">
          <span style="font-size: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.65);">Los tres días</span>
          ${[['Mar 1', 6420, '1 h 47 m'], ['Mié 2', 19680, '5 h 28 m'], ['Jue 3', 5580, '1 h 33 m']].map(([d, seg, txt]) => `
          <div style="display: flex; align-items: center; gap: 11px;">
            <span style="font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.8); width: 52px;">${d}</span>
            <div style="flex: 1; background: rgba(255,255,255,0.16); border-radius: 4px; height: 10px; overflow: hidden;">
              <div data-dia-barra style="width: ${Math.round(seg / 19680 * 100)}%; height: 100%; border-radius: 4px; background: #FFFFFF;"></div>
            </div>
            <span style="font-size: 16px; font-weight: 700; color: #FFFFFF; width: 74px; text-align: right; ${NUM}">${txt}</span>
          </div>`).join('')}
        </div>
        <div style="display: flex; flex-direction: column; gap: 11px;">
          <div style="display: flex; align-items: center; gap: 12px;">${chip('UWS-9375', true)}<span style="font-size: 18px; color: rgba(255,255,255,0.85);">NY Rec &amp; Social Club</span></div>
          <span style="font-size: 18px; color: rgba(255,255,255,0.85); line-height: 1.4;">El miércoles entero cupo en <strong style="font-weight: 700;">un solo registro de 5 h 28 m</strong>: el turno más largo de toda la serie.</span>
          <span style="margin-top: 4px; align-self: flex-start; background: ${WARN_WASH}; color: ${WARN}; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 8px 18px;">Esperando revisión del cliente</span>
        </div>
      </div>
      <div data-detalle style="${CARD} border-radius: 26px; padding: 36px 34px; display: flex; flex-direction: column; gap: 18px;">
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Cómo se armó</span>
        ${paso('01', 'Estructura', 'Se creó la página con el banner, la sección de «up next» y los horarios — martes, 1 h 47 m.')}
        ${paso('02', 'El bloque nuevo', 'Un bloque que no existía en la plantilla, más el ajuste de estilos y llenar el CMS con el contenido real — miércoles, 5 h 28 m.')}
        ${paso('03', 'Detalles', 'Repaso de detalles y correcciones de estilo hasta dejarla presentable — jueves, 1 h 33 m.')}
        <div style="flex: 1;"></div>
        <div style="height: 1px; background: ${LINE};"></div>
        <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Venía arrastrándose desde la semana 34, cuando solo se estimó sobre el Figma. Esta semana se construyó completa.</span>
      </div>
    </div>
  </section>`);

// ── 5 · Tracking v2: la línea de producción ──────────────────────────────
slides.push(`
  <section data-label="Tracking v2" data-screen-label="Tracking v2" data-speaker-notes="El tracking dejo de ser un proyecto y es una linea de produccion: cinco propiedades en tres semanas. Las tres nuevas estan en QA." style="${seccion()}">
    ${header('Línea de producción', pill('5 propiedades', WASH, BLUE))}
    ${h2('Tracking v2 ya es rutina:<br>cinco propiedades en tres semanas')}
    ${bajada('Lo que en la semana 35 era una migración con red ahora se repite en serie. Esta semana entraron tres propiedades más y cerró la primera de todas.')}
    <div data-a="up3" style="margin-top: 30px; display: flex; flex-direction: column; gap: 12px;">
      ${TRACKING.map(t => `
        <div data-prop style="${CARD} border-radius: 16px; padding: 18px 26px; display: grid; grid-template-columns: 230px 118px 1fr 150px; gap: 22px; align-items: center; ${t.nueva ? `border-left: 5px solid ${BLUE};` : ''}">
          <span style="font-size: 26px; font-weight: 700; color: ${t.nueva ? INK : MUTED}; letter-spacing: -0.4px;">${t.n}</span>
          ${chip(t.k)}
          <span style="font-size: 19px; font-weight: 400; color: ${MUTED};">${t.s}</span>
          <span style="font-size: 16px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${t.hecho ? OK_WASH : WASH}; color: ${t.hecho ? OK : BLUE};">${t.hecho ? 'Finalizada' : 'En QA'}</span>
        </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    ${nota('Falta Voltaire en el conteo de esta semana porque cerró en la 35, pero cuenta para el total: <strong style="font-weight: 700;">cinco sitios con el tablero de GTM, GA y Meta en v2</strong>. Las tres nuevas esperan veredicto de QA.')}
  </section>`);

// ── 6 · Los dos frentes nuevos ───────────────────────────────────────────
const frente = (etiqueta, titulo, items, color, tiempo, cierre) => `
        <div data-frente style="${CARD} border-radius: 24px; padding: 34px 32px; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${color};">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${etiqueta}</span>
            <span style="font-size: 20px; font-weight: 800; color: ${color}; ${NUM}">${tiempo}</span>
          </div>
          <span style="font-size: 28px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <div style="display: flex; flex-direction: column; gap: 13px;">
            ${items.map(([k, t]) => `
            <div data-frente-item style="display: flex; gap: 13px; align-items: flex-start;">
              <span style="flex: none; margin-top: 3px;">${chip(k)}</span>
              <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.42;">${t}</span>
            </div>`).join('')}
          </div>
          <div style="flex: 1;"></div>
          <div style="height: 1px; background: ${LINE};"></div>
          <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${cierre}</span>
        </div>`;

slides.push(`
  <section data-label="Frentes nuevos" data-screen-label="Frentes nuevos" data-speaker-notes="Dos frentes que no existian en los reportes anteriores: el AEO con UWS AI en tres sitios, y el arranque del Guest Portal unificado con su analytics y un problema de latencia." style="${seccion()}">
    ${header('Frentes nuevos')}
    ${h2('Dos frentes que no estaban<br>en los reportes anteriores')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; flex: 1;">
      ${frente('AEO · UWS AI', 'El módulo de AEO en tres sitios', [
        ['UWS-8202', 'Zouk Group: módulo actualizado en STG, probado y reportado — el más largo de los tres.'],
        ['UWS-8564', 'bodegamke.com: actualizado en STG y LIVE, con repaso de su llms.txt.'],
        ['UWS-8619', 'Turning Stone nightlife: cambios confirmados en LIVE y llms.txt revisado. Ya finalizada.'],
      ], '#5E9BE8', '3 h 07 m', 'Los tres comparten el mismo módulo: actualizarlo es una tarea repetible, no un desarrollo por cliente. Dos siguen en QA.')}
      ${frente('Guest Portal', 'Arranca la plataforma unificada', [
        ['UWS-8324', 'Kickoff con el equipo para unificar Guest Portal y micrositios en una sola plataforma configurable.'],
        ['UWS-9714', 'Analytics de GP2 inventariado y su vocabulario de eventos adoptado en GPM, más lo que pide la plataforma nueva.'],
        ['UWS-9730', 'La ruta de fellowship tardaba 117 s en frío y el catálogo la esperaba: caché SWR y carga provisional. Finalizada.'],
      ], '#8FBCEF', '2 h 58 m', 'Es el proyecto grande del trimestre y esta semana solo se sentaron las bases: acuerdo de alcance, eventos y el primer cuello de botella resuelto.')}
    </div>
    ${nota('El AEO y el Guest Portal se llevaron <strong style="font-weight: 700;">6 h 05 m juntos</strong>, casi un tercio de la semana. Son trabajo de plataforma, no de un cliente puntual: lo que se arregla aquí sirve para todos los sitios.')}
  </section>`);

// ── 7 · Día por día · curva de la semana ─────────────────────────────────
const AN = 1560, AL = 288, PAD_X = 40;
const maxDia = Math.max(...DIAS.map(d => d.s));
const pts = DIAS.map((d, i) => {
  const x = +(PAD_X + i * ((AN - PAD_X * 2) / (DIAS.length - 1))).toFixed(1);
  const y = +(AL - 26 - (d.s / maxDia) * (AL - 96)).toFixed(1);
  return { x, y, ...d };
});
const linea = pts.map(p => `${p.x},${p.y}`).join(' ');
const area = `${PAD_X},${AL - 26} ${linea} ${pts.at(-1).x},${AL - 26}`;
// longitud de la polilínea, calculada en build-time para dibujarla con
// strokeDashoffset (determinista: el render de video la reproduce igual)
const largoLinea = +pts.slice(1).reduce((a, p, i) =>
  a + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0).toFixed(1);

slides.push(`
  <section data-label="Día por día" data-screen-label="Día por día" data-speaker-notes="Miercoles y jueves casi seis horas cada uno. El viernes fue el mas ligero con hora y media. El lunes cerro con seis registros repartidos." style="${seccion()}">
    ${header('Día por día')}
    ${h2('Dos días de casi seis horas')}
    <div data-a="up2" style="margin-top: 24px; position: relative;">
      <svg viewBox="0 0 ${AN} ${AL}" style="width: 100%; height: ${AL}px; overflow: visible;">
        <defs>
          <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${BRIGHT}" stop-opacity="0.28"></stop>
            <stop offset="100%" stop-color="${BRIGHT}" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <line x1="${PAD_X}" y1="${AL - 26}" x2="${AN - PAD_X}" y2="${AL - 26}" stroke="${LINE}" stroke-width="2"></line>
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
    <div data-a="up3" style="margin-top: 18px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; flex: 1; align-content: start;">
      ${DIAS.map(d => `
        <div data-dia style="${CARD} ${d.pico ? `border: 2px solid ${BLUE};` : ''} border-radius: 18px; padding: 20px 18px; display: flex; flex-direction: column; gap: 9px;">
          <span style="font-size: 15.5px; font-weight: 700; letter-spacing: 1.5px; color: ${d.pico ? BLUE : MUTED};">${d.n} worklog${d.n > 1 ? 's' : ''}</span>
          <div style="height: 1px; background: ${LINE};"></div>
          ${d.txt.map(t => `<span style="font-size: 16.5px; font-weight: 400; color: ${MUTED}; line-height: 1.35;"><span style="color: ${BLUE}; font-weight: 700;">·</span> ${t}</span>`).join('')}
        </div>`).join('')}
    </div>
    ${nota('El miércoles tiene <strong style="font-weight: 700;">un único registro de 5 h 28 m</strong> y el jueves ocho de ocho frentes distintos: la misma cantidad de horas repartida de las dos maneras opuestas.')}
  </section>`);

// ── 8 · Continuidad con la semana 35 · con data-step ─────────────────────
slides.push(`
  <section data-label="Continuidad" data-screen-label="Continuidad" data-speaker-notes="Lo que la semana 35 dejo vivo. El tracking de RWLV cerro, Game Day se construyo y quedo con el cliente, pero el traslape de GPM sigue en QA: solo 19 minutos esta semana. Se revela una por una." style="${seccion()}">
    ${header('Continuidad', pill('2 de 3', WASH, BLUE))}
    ${h2('Lo que la semana 35<br>dejó vivo')}
    ${bajada('El reporte anterior cerró con dos issues en curso y una que había regresado de QA. Dos avanzaron; una sigue igual.')}
    <div data-a="up3" style="margin-top: 30px; display: flex; flex-direction: column; gap: 14px;">
      ${COLA.map((c, i) => `
        <div data-fila data-step="${i + 1}" style="${CARD} border-radius: 16px; padding: 22px 28px; display: grid; grid-template-columns: 122px 1fr 176px 34px 180px; gap: 20px; align-items: center; ${c.bien ? '' : `border-left: 5px solid ${BAD};`}">
          ${chip(c.k)}
          <span style="font-size: 23px; font-weight: 600; color: ${INK};">${c.t}</span>
          <span style="font-size: 17px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${c.de === 'Regresó de QA' ? BAD_WASH : c.de === 'Por hacer' ? SOFT : WASH}; color: ${c.de === 'Regresó de QA' ? BAD : c.de === 'Por hacer' ? MUTED : BLUE};">${c.de}</span>
          <span data-flecha style="font-size: 24px; font-weight: 800; color: ${MUTED}; text-align: center;">→</span>
          <span style="font-size: 17px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${c.bien ? OK_WASH : BAD_WASH}; color: ${c.bien ? OK : BAD};">${c.a}</span>
        </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    ${nota('La pendiente honesta: <strong style="font-weight: 700;">el aviso de traslapes de GPM solo recibió 19 minutos</strong> —actualizar la rama y reportar— y sigue devuelto de QA. Es lo primero de la semana 37.', BAD)}
  </section>`);

// ── 9 · Estado del tablero ───────────────────────────────────────────────
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
  <section data-label="Estado del tablero" data-screen-label="Estado" data-speaker-notes="Al martes 8 de septiembre: cinco finalizadas, seis en QA, dos en curso y dos esperando a alguien mas. La cola de QA volvio a llenarse, al reves que la semana pasada." style="${seccion()}">
    ${header('Estado')}
    ${h2('Cómo quedó el tablero')}
    ${bajada('Estado en Jira al martes 8 de septiembre. La cola de control de calidad volvió a llenarse: seis issues esperando veredicto.')}
    <div data-a="up3" style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr 0.72fr 0.72fr; gap: 18px; flex: 1; align-content: start;">
      ${col('Finalizadas', OK, OK_WASH, TABLERO.fin)}
      ${col('En QA', BLUE, WASH, TABLERO.qa)}
      ${col('En curso', WARN, WARN_WASH, TABLERO.curso)}
      ${col('Esperando', MUTED, SOFT, TABLERO.esperando)}
    </div>
  </section>`);

// ── 10 · Lo que viene ────────────────────────────────────────────────────
const siguiente = (n, titulo, texto, color = BLUE) => `
        <div data-sig style="${CARD} border-radius: 22px; padding: 30px 28px; display: flex; flex-direction: column; gap: 11px; border-top: 5px solid ${color};">
          <span style="font-size: 16.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color};">${n}</span>
          <span style="font-size: 25px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

slides.push(`
  <section data-label="Lo que viene" data-screen-label="Lo que viene" data-speaker-notes="Semana 37: el traslape de GPM que ya lleva dos semanas devuelto, las seis de QA que pueden regresar, el Guest Portal como proyecto grande y Game Day esperando al cliente." style="${seccion()}">
    ${header('Lo que viene')}
    ${h2('La semana 37 arranca<br>con una deuda de dos semanas')}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; flex: 1; align-content: start;">
      ${siguiente('Primero', 'El traslape de GPM', 'UWS-9583 lleva dos semanas devuelto de QA y solo ha recibido 19 minutos. Es la deuda más vieja del tablero y toca cerrarla.', BAD)}
      ${siguiente('Vigilar', 'Seis issues en QA', 'Las tres migraciones de tracking, dos AEO y el analytics del Guest Portal esperan veredicto. Si regresan, se vuelven el trabajo de la semana.')}
      ${siguiente('Construir', 'Guest Portal unificado', 'UWS-8324 apenas arrancó con el kickoff. Es el proyecto grande del trimestre: unificar portal y micrositios en una plataforma configurable.', WARN)}
      ${siguiente('Esperando', 'Game Day y Wynn', 'La página de Turning Stone quedó lista y espera revisión del cliente; en Wynn se revisaron los metadatos de las APIs de producción.', MUTED)}
    </div>
    ${nota('Ninguna de las cinco finalizadas necesita seguimiento. El riesgo de la semana 37 está en <strong style="font-weight: 700;">cuánto de esas seis en QA regresa</strong>.')}
  </section>`);

// ── 11 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="En una frase: la semana mas cargada, con casi nueve horas en una sola pagina y el tracking convertido en rutina." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '15% 90%', ancho: 80, alto: 70, fuerza: 0.5, alcance: 60 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; left: 40%; bottom: -260px; width: 520px; height: 520px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.09);"></div>
    </div>
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-split style="margin: 26px 0 0; font-size: 82px; font-weight: 800; letter-spacing: -3px; line-height: 1.05; max-width: 1560px;">Una página construida de cero<br>y el tracking hecho rutina</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.55; max-width: 1180px;">20 h 48 m —el techo de la serie— con el 42 % en la página de Game Day, tres propiedades más en tracking v2 y dos frentes de plataforma recién abiertos. Quedan seis issues esperando QA.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Semana 36 · 1–7 sep 2026')}
      ${pill('Fuente: worklogs de Jira · proyecto UWS')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Semana 36 · Reporte semanal Jira</title>
${kit.og({ titulo: 'Semana 36 · Reporte semanal Jira', descripcion: '20 h 48 m en 15 issues del 1 al 7 de septiembre: la página de Game Day de Turning Stone construida de cero, tres propiedades más con tracking v2 y el arranque del Guest Portal unificado.', carpeta: 'semana36' })}
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
// La misma familia que semana35 (es una serie): titulares partidos en
// palabras con entrada 3D, dona que se traza, curva que se dibuja, barras
// comparativas y contadores. Todo con GSAP core y con tl.from(), para que
// sin JS el deck se vea completo y el PDF no se rompa.
(function () {
  if (!window.animar || !window.gsap) return;

  // Parte un titular en palabras envueltas en <span>, respetando los <br>.
  // Idempotente: se hace una sola vez por elemento, porque las timelines se
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
  // Contador de tiempo con formato "N h MM m".
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
      // las semanas viejas crecen primero, la actual remata
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.55, ease: 'power2.inOut', stagger: 0.05 }, 0.62)
      .from(Q(s, '[data-barra-hoy]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.8);
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

  animar('Game Day', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-panel]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100,
                                    transformOrigin: '0% 50%', duration: 0.8 }, 0.2)
      .from(q(s, '[data-detalle]'), { x: 50, opacity: 0, duration: 0.75 }, 0.3)
      // las tres etapas de construcción, en orden
      .from(Q(s, '[data-etapa]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.13 }, 0.6)
      .from(Q(s, '[data-etapa-num]'), { scale: 0, duration: 0.45, ease: 'back.out(2.4)', stagger: 0.13 }, 0.65)
      .from(Q(s, '[data-dia-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 0.7);
    cuenta(tl, q(s, '[data-cuenta]'), 0.4);
  });

  animar('Tracking v2', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      // la lista de propiedades entra en cascada, como la línea de producción
      .from(Q(s, '[data-prop]'), { x: -40, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.3)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.9);
  });

  animar('Frentes nuevos', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-frente]'), { y: 46, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                     transformOrigin: '50% 0%', duration: 0.7, stagger: 0.14 }, 0.25)
      .from(Q(s, '[data-frente-item]'), { y: 16, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.55)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.95);
  });

  animar('Día por día', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    var linea = q(s, '[data-linea]');
    if (linea) tl.from(linea, { attr: { 'stroke-dashoffset': ${largoLinea} }, duration: 1.1, ease: 'power1.inOut' }, 0.25);
    tl.from(q(s, '[data-area]'), { opacity: 0, duration: 0.9 }, 0.5)
      .from(Q(s, '[data-punto]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%',
                                    duration: 0.45, ease: 'back.out(2.2)', stagger: 0.11 }, 0.55)
      .from(Q(s, '[data-etiqueta]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.11 }, 0.6)
      .from(Q(s, '[data-dia]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.72)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.55 }, 1.0);
  });

  animar('Continuidad', function (tl, s) {
    // Las filas llevan data-step: las revela la navegación (el pegamento las
    // anima al aparecer). Aquí entra solo el encabezado y la nota.
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.35);
  });

  animar('Estado del tablero', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-col]'), { y: 36, opacity: 0, duration: 0.6, stagger: 0.11 }, 0.3)
      .from(Q(s, '[data-issue]'), { y: 14, opacity: 0, duration: 0.4, stagger: 0.03 }, 0.55);
    Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, 0.5); });
  });

  animar('Lo que viene', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-sig]'), { y: 40, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                  transformOrigin: '50% 0%', duration: 0.65, stagger: 0.1 }, 0.25)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.8);
  });

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

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
