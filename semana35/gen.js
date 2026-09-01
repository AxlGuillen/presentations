// Generador de index.html — Reporte semanal de Jira · Semana 35 (mar 25 – lun 31 ago 2026)
// Ejecutar: node semana35/gen.js
//
// Fuente: worklogs de Jira (urvenue.atlassian.net, proyecto UWS) con autor
// Axl Guillen entre el 25 y el 31 de agosto de 2026 — 25 registros,
// 54 600 s = 15 h 10 m sobre 12 issues. Estados al martes 1 sep 2026.
// OJO: tres worklogs de UWS-9283 no vienen en la API de búsqueda (corta en 20
// por issue) y se recuperaron del changelog de `timespent`; por eso esa issue
// aparece sin comentario de worklog en el detalle.
//
// Serie del reporte semanal: misma paleta Jira que semana34 a propósito.
// Esta es la **v2.0 de la coreografía**: titulares partidos en palabras,
// dona SVG, curva de la semana que se dibuja, comparativa contra la semana
// anterior y pasos (data-step) en la lámina de la cola de QA.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad · paleta Jira (compartida con semana34) ────────────────────
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
const GRIS = '#B3BAC5';  // la semana pasada, en la comparativa

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: BLUE });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(BLUE, 0.14) }),
  kit.lavado({ color: WASH, fuerza: 0.6 }));
const puntosAzul = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });

// ── Datos de la semana ───────────────────────────────────────────────────
const TOTAL_S = 54600;                 // 15 h 10 m
const SEM34_S = 71100;                 // 19 h 45 m
const hm = s => `${Math.floor(s / 3600)} h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')} m`;

const TEMAS = [
  { n: 'Tracking v2 en dos propiedades', s: 17760, c: BLUE,
    d: 'UWS-9493 y UWS-9608 — RWLV a LIVE con V1 conviviendo en la pestaña nueva, y Voltaire integrado desde cero.' },
  { n: 'GPM · experiencia del huésped', s: 16500, c: BRIGHT,
    d: 'UWS-9584, UWS-9544 y UWS-9583 — agregar experiencias desde el día abierto, riel de fechas en móvil y aviso de traslapes.' },
  { n: 'Micrositios de cliente', s: 11700, c: '#5E9BE8',
    d: 'Parton’s Nashville, Boiler, ZoukLV y la autodetección de idioma de Zouk Tokio.' },
  { n: 'Studio · tags fantasma', s: 5160, c: '#8FBCEF',
    d: 'UWS-9513 — el preview del wizard mostraba tags que no existen en el catálogo real.' },
  { n: 'AEO y reunión semanal', s: 3480, c: GRIS,
    d: 'Diagnóstico del reverse proxy para el AEO de Turning Stone y la weekly del equipo.' },
];

const DIAS = [
  { d: 'MAR 25', s: 13920, n: 7, txt: ['Bug de tags fantasma: rama con el fix y merge a UAT', 'Riel de fechas móvil + encabezados fijos del calendario', 'Tracking de RWLV a LIVE'] },
  { d: 'MIÉ 26', s: 20820, n: 7, txt: ['Agregar experiencia desde el día del itinerario', 'Voltaire: acceso, tracking v2 y prueba en STG', 'Autodetección de idioma en Zouk Tokio', 'Fix del micrositio de Boiler'], pico: true },
  { d: 'JUE 27', s: 6000, n: 4, txt: ['Reordenar pestañas del tracking y pasar a LIVE', 'Voltaire y ZoukLV a LIVE con reporte'] },
  { d: 'VIE 28', s: 4500, n: 2, txt: ['Estilos de Parton’s', 'Reverse proxy del AEO de Turning Stone'] },
  { d: 'LUN 31', s: 9360, n: 5, txt: ['Tracking: campo nuevo, a LIVE y probado', 'Traslapes: conflictos resueltos', 'Cierre de Parton’s'] },
];

// Continuidad: lo que la semana 34 dejó pendiente y cómo cerró
const COLA = [
  { k: 'UWS-9511', t: 'ZoukLV · landing del 16 de septiembre', de: 'Regresó de QA', a: 'Finalizada' },
  { k: 'UWS-9369', t: 'Zouk Tokio · checkout en japonés', de: 'En QA', a: 'Finalizada' },
  { k: 'UWS-9213', t: 'Zouk Tokio · estilos de la integración', de: 'En QA', a: 'Finalizada' },
  { k: 'UWS-9262', t: 'Plugin WP · integraciones no configurables', de: 'En QA', a: 'Finalizada' },
  { k: 'UWS-9544', t: 'GPM · itinerario en móvil', de: 'Por hacer', a: 'Finalizada' },
  { k: 'UWS-9513', t: 'Studio · tags fantasma del wizard', de: 'Por hacer', a: 'Finalizada' },
];

const TABLERO = {
  fin: [
    ['UWS-9584', 'GPM · agregar desde el día'],
    ['UWS-9544', 'GPM · itinerario en móvil'],
    ['UWS-9608', 'Voltaire · Tracking v2'],
    ['UWS-9513', 'Studio · tags fantasma'],
    ['UWS-9283', 'Parton’s · branding'],
    ['UWS-9633', 'Boiler · fecha del micrositio'],
    ['UWS-9511', 'ZoukLV · landing'],
    ['UWS-9369', 'Zouk Tokio · checkout JA'],
    ['UWS-8619', 'AEO · nightlife de Turning Stone'],
  ],
  curso: [['UWS-9493', 'RWLV · Tracking v2'], ['UWS-8489', 'Gestión de integraciones']],
  qa: [['UWS-9583', 'GPM · aviso de traslapes']],
};

// ── Helpers de maquetado ─────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.72);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 40px; height: 40px; border-radius: 10px; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">S35</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Reporte semanal · Jira UWS</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `${FONDO_BLANCO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 66px; box-sizing: border-box; overflow: hidden;`;

// data-split: el pegamento parte el texto en palabras y las anima escalonadas
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
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Semana del 25 al 31 de agosto. 15 horas 10 minutos, 12 issues, y la cola de QA de la semana pasada quedo limpia." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '88% 10%', ancho: 85, alto: 75, fuerza: 0.55 }), kit.lavado({ color: INK, en: '8% 95%', ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
      <div data-orbe style="position: absolute; left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);"></div>
    </div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span data-sello style="width: 74px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 33px; font-weight: 800;">S35</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reporte semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Jira · UrVenue Web Services</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 96px; font-weight: 800; letter-spacing: -3.4px; line-height: 1.04; max-width: 1580px;">Semana 35: la semana<br>en que se vació la cola</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 1120px;">Martes 25 – lunes 31 de agosto de 2026 · Axl Guillen · con base en los worklogs de Jira.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('15 h 10 m registradas')}
      ${pill('12 issues')}
      ${pill('25 worklogs')}
      ${pill('9 finalizadas', '#FFFFFF', BLUE)}
    </div>
  </section>`);

// ── 2 · Números y comparativa contra la semana 34 ────────────────────────
const stat = (v, k, sub = '', cuenta = null) => `
        <div data-stat style="${CARD} border-radius: 20px; padding: 32px 30px 28px; display: flex; flex-direction: column; gap: 8px; border-top: 5px solid ${BLUE};">
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 60px; font-weight: 800; color: ${BLUE}; letter-spacing: -2.2px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 22px; font-weight: 600; color: ${INK}; line-height: 1.25;">${k}</span>
          ${sub ? `<span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${sub}</span>` : ''}
        </div>`;

// Comparativa: dos barras por métrica, la 34 en gris y la 35 en azul
const compara = (etiqueta, v34, v35, max, fmt) => {
  const p34 = Math.round(v34 / max * 100), p35 = Math.round(v35 / max * 100);
  const delta = v35 - v34;
  const signo = delta > 0 ? '+' : '−';
  return `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 21px; font-weight: 700; color: ${INK};">${etiqueta}</span>
              <span style="font-size: 19px; font-weight: 700; color: ${delta >= 0 ? OK : MUTED}; ${NUM}">${signo}${fmt(Math.abs(delta))}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 15px; font-weight: 700; color: ${MUTED}; width: 52px; letter-spacing: 1px;">S34</span>
              <div style="flex: 1; background: ${SOFT}; border-radius: 5px; height: 13px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.13);">
                <div data-barra34 style="width: ${p34}%; height: 100%; border-radius: 5px; background: ${GRIS};"></div>
              </div>
              <span style="font-size: 18px; font-weight: 600; color: ${MUTED}; width: 108px; text-align: right; ${NUM}">${fmt(v34)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 15px; font-weight: 800; color: ${BLUE}; width: 52px; letter-spacing: 1px;">S35</span>
              <div style="flex: 1; background: ${SOFT}; border-radius: 5px; height: 13px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.13);">
                <div data-barra35 style="width: ${p35}%; height: 100%; border-radius: 5px; background: linear-gradient(90deg, ${BLUE}, ${BRIGHT}); box-shadow: 0 1px 4px rgba(0,82,204,0.35);"></div>
              </div>
              <span style="font-size: 18px; font-weight: 800; color: ${BLUE}; width: 108px; text-align: right; ${NUM}">${fmt(v35)}</span>
            </div>
          </div>`;
};

slides.push(`
  <section data-label="La semana en números" data-screen-label="Números" data-speaker-notes="Menos horas que la semana 34 pero mas cierres: 9 finalizadas contra 7. El foco estuvo en cerrar, no en abrir frentes." style="${seccion()}">
    ${header('Números')}
    ${h2('Menos horas, más cierres')}
    ${bajada('Cinco días con 15 h 10 m repartidas en 12 issues. Contra la semana anterior bajó el tiempo registrado, pero subieron las tareas terminadas.')}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      ${stat('15 h 10 m', 'Tiempo registrado', '54 600 s en 25 worklogs')}
      ${stat('12', 'Issues trabajadas', 'Todas en el proyecto UWS', 12)}
      ${stat('9', 'Finalizadas', '75 % de lo que se tocó', 9)}
      ${stat('3 h 02 m', 'Promedio por día', 'El miércoles fue el pico')}
    </div>
    <div data-comparativa style="${CARD} margin-top: 26px; border-radius: 22px; padding: 24px 34px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; flex: 1;">
      <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Semana 34 → semana 35</span>
      ${compara('Tiempo registrado', SEM34_S, TOTAL_S, SEM34_S, s => hm(s))}
      ${compara('Issues finalizadas', 7, 9, 12, v => String(v))}
      ${compara('Worklogs registrados', 31, 25, 31, v => String(v))}
      <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Menos registros y menos horas, pero cada uno más resolutivo: la semana 34 abrió frentes, la 35 los cerró.</span>
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
  <section data-label="Dónde se fue el tiempo" data-screen-label="Tiempo por tema" data-speaker-notes="Dos tercios de la semana fueron tracking v2 y GPM. Tracking en dos propiedades distintas: RWLV y Voltaire." style="${seccion()}">
    ${header('Tiempo por tema')}
    ${h2('Dos tercios en tracking y GPM')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 420px 1fr; gap: 44px; flex: 1; align-items: center;">
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <svg data-dona viewBox="0 0 340 340" style="width: 380px; height: 380px; overflow: visible;">
          <circle cx="170" cy="170" r="${R}" fill="none" stroke="${SOFT}" stroke-width="${GROSOR}"></circle>
          ${arcos}
        </svg>
        <div style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <span data-total style="font-size: 46px; font-weight: 800; color: ${INK}; letter-spacing: -1.6px; ${NUM}">15 h 10 m</span>
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
              <span style="font-size: 21px; font-weight: 700; color: ${t.c === GRIS ? MUTED : t.c}; white-space: nowrap; ${NUM}">${hm(t.s)} · ${Math.round(t.s / TOTAL_S * 100)}%</span>
            </div>
            <span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.4; max-width: 900px;">${t.d}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
    ${nota('Siete propiedades de cliente y dos productos internos —GPM y Studio— en la misma semana. <strong style="font-weight: 700;">Ningún frente se llevó más de un tercio</strong>: el tiempo se repartió entre migrar tracking y pulir el itinerario del huésped.')}
  </section>`);

// ── 4 · Historia central: Tracking v2 en dos propiedades ─────────────────
const logro = (txt) => `
          <div data-logro style="display: flex; align-items: flex-start; gap: 15px;">
            <span data-check style="flex: none; margin-top: 4px; width: 26px; height: 26px; border-radius: 50%; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800;">✓</span>
            <span style="font-size: 22px; font-weight: 400; color: ${INK}; line-height: 1.42;">${txt}</span>
          </div>`;

slides.push(`
  <section data-label="Tracking v2" data-screen-label="Tracking v2" data-speaker-notes="La historia central: el tracking v2 se llevo un tercio de la semana en dos propiedades. RWLV fue migracion con convivencia V1, Voltaire fue de cero. RWLV sigue en curso." style="${seccion()}">
    ${header('Historia central')}
    ${h2('Tracking v2, dos propiedades<br>y una migración con red')}
    <div data-a="up2" style="margin-top: 36px; display: grid; grid-template-columns: 0.82fr 1.3fr; gap: 32px; flex: 1;">
      <div data-panel style="${kit.fondo(BLUE, puntosAzul(26), kit.lavado({ color: BRIGHT, en: '85% 8%', ancho: 90, alto: 70, fuerza: 0.6, alcance: 60 }))} border-radius: 26px; padding: 42px 38px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(23,43,77,0.14), 0 18px 40px rgba(0,82,204,0.28);">
        <span data-cuenta="33" data-sufijo="%" style="font-size: 122px; font-weight: 800; letter-spacing: -5px; line-height: 1; ${NUM}">33%</span>
        <span style="font-size: 25px; font-weight: 600; margin-top: 8px; line-height: 1.3;">de la semana — 4 h 56 m en 7 worklogs</span>
        <div style="flex: 1;"></div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">${chip('UWS-9493', true)}<span style="font-size: 18px; color: rgba(255,255,255,0.85); ${NUM}">RWLV · 3 h 15 m</span></div>
          <div style="display: flex; align-items: center; gap: 12px;">${chip('UWS-9608', true)}<span style="font-size: 18px; color: rgba(255,255,255,0.85); ${NUM}">Voltaire · 1 h 41 m</span></div>
          <span style="margin-top: 6px; align-self: flex-start; background: #FFFFFF; color: ${BLUE}; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 8px 18px;">Voltaire cerrado · RWLV en curso</span>
        </div>
      </div>
      <div data-detalle style="${CARD} border-radius: 26px; padding: 40px 38px; display: flex; flex-direction: column; gap: 18px;">
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Qué implicó</span>
        ${logro('<strong style="font-weight: 700;">RWLV:</strong> integración en STG, migración de los códigos V1 a V2 y pase a LIVE con validación.')}
        ${logro('Reordenar el panel: se eliminó la pestaña vieja y <strong style="font-weight: 700;">V1 quedó dentro de la pestaña nueva</strong>, para no perder el histórico durante la transición.')}
        ${logro('Un campo adicional agregado el lunes, publicado y probado en LIVE.')}
        ${logro('<strong style="font-weight: 700;">Voltaire:</strong> gestión de accesos, tracking v2 desde cero, prueba en STG y códigos cargados en LIVE — cerrado en dos días.')}
        ${logro('Ambas cuelgan del mismo épico: el tablero de GTM, GA y Meta para los sitios de UWS.')}
      </div>
    </div>
  </section>`);

// ── 5 · GPM: tres mejoras al itinerario ──────────────────────────────────
const mejora = (n, k, titulo, texto, estado, color) => `
        <div data-gpm style="${CARD} border-radius: 22px; padding: 32px 30px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${color};">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <span data-gpm-num style="font-size: 15px; font-weight: 800; letter-spacing: 2px; color: ${color};">${n}</span>
            ${chip(k)}
          </div>
          <span style="font-size: 26px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
          <div style="flex: 1;"></div>
          <span style="align-self: flex-start; font-size: 16px; font-weight: 700; padding: 5px 14px; border-radius: 999px; background: ${color}1A; color: ${color};">${estado}</span>
        </div>`;

slides.push(`
  <section data-label="GPM" data-screen-label="GPM" data-speaker-notes="Tres mejoras al itinerario del huesped, 4 horas 35. Las dos primeras cerradas; el aviso de traslapes regreso de QA el domingo." style="${seccion()}">
    ${header('GPM')}
    ${h2('Tres arreglos al itinerario<br>del huésped')}
    ${bajada('4 h 35 m en el flujo donde el huésped arma su estancia: descubrir fechas, agregar experiencias y no chocar consigo mismo.')}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; flex: 1;">
      ${mejora('AGREGAR', 'UWS-9584', 'Reservar desde el día que está viendo', 'El itinerario no ofrecía forma de sumar una experiencia al día abierto. Ahora el catálogo llega acotado a esa fecha, verificado con datos reales.', 'Finalizada · 2 h 48 m', OK)}
      ${mejora('NAVEGAR', 'UWS-9544', 'Ver todas las fechas en móvil', 'Antes solo se avanzaba semana por semana. Se añadió un riel de fechas con encabezados de calendario fijos.', 'Finalizada · 58 m', OK)}
      ${mejora('AVISAR', 'UWS-9583', 'Advertir si la reserva se traslapa', 'Aviso previo cuando la nueva reserva choca con otra que el huésped ya tiene, evaluado por acompañante.', 'Regresó de QA · 49 m', BAD)}
    </div>
    ${nota('Las tres nacen del mismo hallazgo: <strong style="font-weight: 700;">el huésped no puede planear lo que no alcanza a ver</strong>. Dos ya están en producción; el aviso de traslapes volvió de QA el domingo y abre la semana 36.')}
  </section>`);

// ── 6 · Día por día · curva de la semana ─────────────────────────────────
const AN = 1560, AL = 288, PAD_X = 40;
const maxDia = Math.max(...DIAS.map(d => d.s));
const pts = DIAS.map((d, i) => {
  const x = +(PAD_X + i * ((AN - PAD_X * 2) / (DIAS.length - 1))).toFixed(1);
  const y = +(AL - 26 - (d.s / maxDia) * (AL - 66)).toFixed(1);
  return { x, y, ...d };
});
const linea = pts.map(p => `${p.x},${p.y}`).join(' ');
const area = `${PAD_X},${AL - 26} ${linea} ${pts.at(-1).x},${AL - 26}`;
// longitud de la polilínea, para dibujarla con strokeDasharray (build-time,
// determinista: el render de video la reproduce igual)
const largoLinea = +pts.slice(1).reduce((a, p, i) =>
  a + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0).toFixed(1);

slides.push(`
  <section data-label="Día por día" data-screen-label="Día por día" data-speaker-notes="El miercoles concentro 5 horas 47: cuatro frentes distintos en un dia. Viernes fue el mas ligero. El lunes cerro Parton's y publico el campo del tracking." style="${seccion()}">
    ${header('Día por día')}
    ${h2('El miércoles cargó la semana')}
    <div data-a="up2" style="margin-top: 26px; position: relative;">
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
    <div data-a="up3" style="margin-top: 22px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 18px; flex: 1; align-content: start;">
      ${DIAS.map(d => `
        <div data-dia style="${CARD} ${d.pico ? `border: 2px solid ${BLUE};` : ''} border-radius: 18px; padding: 22px 20px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 16px; font-weight: 700; letter-spacing: 1.5px; color: ${d.pico ? BLUE : MUTED};">${d.n} worklogs</span>
          <div style="height: 1px; background: ${LINE};"></div>
          ${d.txt.map(t => `<span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.35;"><span style="color: ${BLUE}; font-weight: 700;">·</span> ${t}</span>`).join('')}
        </div>`).join('')}
    </div>
    ${nota('El miércoles concentró <strong style="font-weight: 700;">cuatro frentes distintos en un solo día</strong> —GPM, Voltaire, Zouk Tokio y Boiler—; jueves y viernes fueron de publicar y reportar lo abierto el miércoles.')}
  </section>`);

// ── 7 · La cola de QA quedó limpia · con data-step ───────────────────────
// Cada fila es un paso: al presentar se revelan una por una.
slides.push(`
  <section data-label="La cola de QA" data-screen-label="Cola de QA" data-speaker-notes="La lamina de continuidad. Las seis que la semana 34 dejo en QA o por hacer cerraron esta semana. Se revela una por una con las flechas." style="${seccion()}">
    ${header('Continuidad', pill('6 de 6', OK_WASH, OK))}
    ${h2('Todo lo que la semana 34<br>dejó pendiente, cerrado')}
    ${bajada('El reporte anterior terminó con cuatro issues en control de calidad, dos sin empezar y una que había regresado de QA. Así quedaron.')}
    <div data-a="up3" style="margin-top: 30px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
      ${COLA.map((c, i) => `
        <div data-fila data-step="${i + 1}" style="${CARD} border-radius: 16px; padding: 18px 26px; display: grid; grid-template-columns: 118px 1fr 176px 34px 132px; gap: 20px; align-items: center;">
          ${chip(c.k)}
          <span style="font-size: 22px; font-weight: 600; color: ${INK};">${c.t}</span>
          <span style="font-size: 17px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${c.de === 'Regresó de QA' ? BAD_WASH : c.de === 'Por hacer' ? SOFT : WASH}; color: ${c.de === 'Regresó de QA' ? BAD : c.de === 'Por hacer' ? MUTED : BLUE};">${c.de}</span>
          <span data-flecha style="font-size: 24px; font-weight: 800; color: ${MUTED}; text-align: center;">→</span>
          <span style="font-size: 17px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${OK_WASH}; color: ${OK};">${c.a}</span>
        </div>`).join('')}
    </div>
    ${nota('Solo una excepción: <strong style="font-weight: 700;">el tracking de RWLV volvió a desarrollo</strong> en lugar de cerrar — de ahí las 3 h 15 m que se le dedicaron esta semana.', BLUE)}
  </section>`);

// ── 8 · Estado del tablero ───────────────────────────────────────────────
const col = (titulo, color, wash, issues, paso, cols = 1) => `
        <div data-col${paso ? ` data-step="${paso}"` : ''} style="background: ${wash}; border-radius: 20px; padding: 26px 24px; display: flex; flex-direction: column; gap: 14px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 10px 26px rgba(23,43,77,0.09);">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 10px;">
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${color};">${titulo}</span>
            <span data-cuenta="${issues.length}" style="font-size: 40px; font-weight: 800; color: ${color}; letter-spacing: -1px; ${NUM}">${issues.length}</span>
          </div>
          <div style="display: ${cols > 1 ? `grid; grid-template-columns: repeat(${cols}, 1fr)` : 'flex; flex-direction: column'}; gap: 9px;">
            ${issues.map(([k, n]) => `
            <div data-issue style="background: ${BG}; border: 1px solid rgba(23,43,77,0.08); border-radius: 10px; padding: 10px 13px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 2px 6px rgba(23,43,77,0.07);">
              <span style="font-size: 15px; font-weight: 700; color: ${color}; letter-spacing: 0.3px;">${k}</span>
              <span style="font-size: 15.5px; font-weight: 400; color: ${INK}; line-height: 1.3;">${n}</span>
            </div>`).join('')}
          </div>
        </div>`;

slides.push(`
  <section data-label="Estado del tablero" data-screen-label="Estado" data-speaker-notes="Como quedo el tablero al martes 1 de septiembre. Nueve finalizadas, dos en curso y una que regreso de QA." style="${seccion()}">
    ${header('Estado')}
    ${h2('Cómo quedó el tablero')}
    ${bajada('Estado en Jira al martes 1 de septiembre por la mañana. De las 12 issues trabajadas, 9 quedaron cerradas.')}
    <div data-a="up3" style="margin-top: 32px; display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 22px; flex: 1; align-content: start;">
      ${col('Finalizadas', OK, OK_WASH, TABLERO.fin, null, 2)}
      ${col('En curso', BLUE, WASH, TABLERO.curso)}
      ${col('Regresó de QA', BAD, BAD_WASH, TABLERO.qa)}
    </div>
  </section>`);

// ── 9 · Lo que viene ─────────────────────────────────────────────────────
const siguiente = (n, titulo, texto, color = BLUE) => `
        <div data-sig style="${CARD} border-radius: 22px; padding: 32px 30px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${color};">
          <span style="font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color};">${n}</span>
          <span style="font-size: 26px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

slides.push(`
  <section data-label="Lo que viene" data-screen-label="Lo que viene" data-speaker-notes="Semana 36 abre con el aviso de traslapes que regreso de QA y con cerrar el tracking de RWLV. Wynn sigue esperando y Turning Stone volvio a por hacer." style="${seccion()}">
    ${header('Lo que viene')}
    ${h2('La semana 36 abre con<br>una devolución y un cierre')}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; flex: 1; align-content: start;">
      ${siguiente('Primero', 'Traslapes de GPM', 'UWS-9583 regresó de QA el domingo. Ya hay conflictos resueltos del lunes, así que arranca con contexto fresco.', BAD)}
      ${siguiente('Cerrar', 'Tracking de RWLV', 'UWS-9493 es lo único que sigue en curso después de 3 h 15 m. Es la última pieza del tablero de GTM, GA y Meta.')}
      ${siguiente('Esperando', 'Wynn y Turning Stone', 'La guest list de Wynn sigue en «Waiting on Status Update» y la página de Game Day volvió a «por hacer»: ninguna depende de mí.', WARN)}
      ${siguiente('En pausa', 'Tutoriales del portal', 'UWS-9293 sigue On Hold desde la semana 34. Sin movimiento y sin bloquear nada.', MUTED)}
    </div>
    ${nota('Sin frentes nuevos abiertos: la semana 36 empieza con <strong style="font-weight: 700;">dos issues vivas y ambas ya arrancadas</strong>.')}
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="En una frase: menos horas, mas cierres, la cola limpia. 9 de 12 finalizadas." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '15% 90%', ancho: 80, alto: 70, fuerza: 0.5, alcance: 60 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; left: 40%; bottom: -260px; width: 520px; height: 520px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.09);"></div>
    </div>
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-split style="margin: 26px 0 0; font-size: 86px; font-weight: 800; letter-spacing: -3px; line-height: 1.04; max-width: 1500px;">Menos horas, más cierres<br>y la cola de QA vacía</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.55; max-width: 1140px;">15 h 10 m para terminar 9 de 12 issues y dejar limpio todo lo que la semana 34 había dejado esperando. Quedan dos vivas, las dos ya arrancadas.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Semana 35 · 25–31 ago 2026')}
      ${pill('Fuente: worklogs de Jira · proyecto UWS')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Semana 35 · Reporte semanal Jira</title>
${kit.og({ titulo: 'Semana 35 · Reporte semanal Jira', descripcion: '15 h 10 m en 12 issues del 25 al 31 de agosto: tracking v2 en dos propiedades, tres arreglos al itinerario de GPM y la cola de QA de la semana anterior cerrada por completo.', carpeta: 'semana35' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BLUE}; }
  /* Las entradas las orquesta GSAP (coreografía v2.0 al final del documento).
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
// ── Coreografía v2.0 ─────────────────────────────────────────────────────
// Más rica que la de semana34: titulares partidos en palabras con entrada 3D,
// dona SVG que se traza, curva de la semana que se dibuja, barras comparativas
// y contadores de tiempo formateados. Todo con GSAP core (sin plugins de club)
// y con tl.from(), para que sin JS el deck se vea completo.
(function () {
  if (!window.animar || !window.gsap) return;

  // Parte un titular en palabras envueltas en <span>, respetando los <br>.
  // Idempotente: se hace una sola vez por elemento (las timelines se
  // reconstruyen cada vez que la slide se reactiva).
  function partir(el) {
    if (!el || el.dataset.partido) return [];
    var salida = [];
    var nodos = Array.prototype.slice.call(el.childNodes);
    nodos.forEach(function (n) {
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
  // Entrada de titular: palabras que suben y rotan en 3D, escalonadas.
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
      .from(Q(s, '[data-barra34]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.inOut', stagger: 0.07 }, 0.62)
      .from(Q(s, '[data-barra35]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.75, ease: 'power3.out', stagger: 0.07 }, 0.75);
    Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, 0.45); });
  });

  animar('Dónde se fue el tiempo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    // la dona gira un poco al aparecer y cada arco se traza en secuencia
    tl.from(q(s, '[data-dona]'), { rotation: -22, scale: 0.9, opacity: 0, duration: 0.8,
                                   transformOrigin: '50% 50%', ease: 'power3.out' }, 0.15);
    Q(s, '[data-arco]').forEach(function (arco, i) {
      tl.to(arco, { attr: { 'stroke-dasharray': arco.dataset.largo + ' ${C}' },
                    duration: 0.5, ease: 'power2.out' }, 0.35 + i * 0.11);
    });
    cuentaHM(tl, q(s, '[data-total]'), ${TOTAL_S}, 0.4);
    tl.from(Q(s, '[data-tema]'), { x: 34, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.45);
  });

  animar('Tracking v2', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-panel]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100,
                                    transformOrigin: '0% 50%', duration: 0.8 }, 0.2)
      .from(q(s, '[data-detalle]'), { x: 50, opacity: 0, duration: 0.75 }, 0.3)
      .from(Q(s, '[data-logro]'), { y: 18, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.6)
      .from(Q(s, '[data-check]'), { scale: 0, duration: 0.45, ease: 'back.out(2.6)', stagger: 0.1 }, 0.65);
    cuenta(tl, q(s, '[data-cuenta]'), 0.4);
  });

  animar('GPM', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-gpm]'), { y: 46, opacity: 0, rotationX: -22, transformPerspective: 1200,
                                  transformOrigin: '50% 0%', duration: 0.7, stagger: 0.12 }, 0.3)
      .from(Q(s, '[data-gpm-num]'), { opacity: 0, x: -14, duration: 0.4, stagger: 0.12 }, 0.6)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.9);
  });

  animar('Día por día', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    var linea = q(s, '[data-linea]');
    // la polilínea se dibuja: el offset arranca en su largo total (build-time)
    if (linea) tl.from(linea, { attr: { 'stroke-dashoffset': ${largoLinea} }, duration: 1.1, ease: 'power1.inOut' }, 0.25);
    tl.from(q(s, '[data-area]'), { opacity: 0, duration: 0.9 }, 0.5)
      .from(Q(s, '[data-punto]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%',
                                    duration: 0.45, ease: 'back.out(2.2)', stagger: 0.11 }, 0.55)
      .from(Q(s, '[data-etiqueta]'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.11 }, 0.6)
      .from(Q(s, '[data-dia]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.75);
  });

  animar('La cola de QA', function (tl, s) {
    // Las filas llevan data-step: las revela la navegación (el pegamento las
    // anima al aparecer). Aquí solo entra el encabezado y la nota.
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.35);
  });

  animar('Estado del tablero', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-col]'), { y: 36, opacity: 0, duration: 0.6, stagger: 0.13 }, 0.3)
      .from(Q(s, '[data-issue]'), { y: 14, opacity: 0, duration: 0.4, stagger: 0.035 }, 0.55);
    Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, 0.5); });
  });

  animar('Lo que viene', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-sig]'), { y: 40, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                  transformOrigin: '50% 0%', duration: 0.65, stagger: 0.1 }, 0.25)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.75);
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
