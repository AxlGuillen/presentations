// Generador de index.html — Reporte semanal de Jira · Semana 38 (mar 15 – lun 21 sep 2026)
// Ejecutar: node semana38/gen.js
//
// Fuente: worklogs de Jira (urvenue.atlassian.net, proyecto UWS) con autor
// Axl Guillen entre el 15 y el 21 de septiembre de 2026 — 27 registros,
// 42 540 s = 11 h 49 m sobre 16 issues. Estados al martes 22 sep 2026.
// Ninguna issue pasó de 20 worklogs, así que la API los devolvió todos.
//
// OJO con el hueco: la semana 37 (8–14 sep) no tuvo reporte porque solo
// registró 3 h 13 m, todas el martes 8. Ese día se cerró el aviso de
// traslapes de GPM, que era la deuda vieja del tablero: por eso aparece en
// la lámina de continuidad aunque caiga fuera del rango de este reporte.
//
// Cuarta entrega de la serie: misma paleta e idéntica coreografía que
// semana36, porque son una serie. Lo propio de esta es la comparativa de
// las cuatro semanas y la lámina del barrido de AEO.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad · paleta Jira (compartida con semana34, 35 y 36) ───────────
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
const TOTAL_S = 42540;                 // 11 h 49 m
const SEM34_S = 71100, SEM35_S = 54600, SEM36_S = 74880;
const SEM37_S = 11580;                 // 3 h 13 m, todas el martes 8
const hm = s => `${Math.floor(s / 3600)} h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')} m`;

const TEMAS = [
  { n: 'AEO · ocho sitios', s: 10860, c: BLUE,
    d: 'UWS-8311 migrado al módulo estándar con su llms.txt; los otros siete, ajustes de configuración de minutos cada uno.' },
  { n: 'Tracking y sitemap', s: 9540, c: BRIGHT,
    d: 'UWS-9990 — códigos v2 en el nightlife de Turning Stone; UWS-10067 — sitemap XML de eventos para Zouk Group LV.' },
  { n: 'Micrositios de cliente', s: 9480, c: '#5E9BE8',
    d: 'Savaya Bali, Green Valley (bullets y estilos) y el pop-up de Go Pool del 23 de septiembre.' },
  { n: 'Experiences Popup', s: 8040, c: '#8FBCEF',
    d: 'UWS-10166 — la hora de apertura de puertas en la plantilla del pop-up de eventos, publicada en todos los ambientes.' },
  { n: 'Guest Portal · traducción', s: 4620, c: GRIS_2,
    d: 'UWS-9838 — el portal no tenía capa de traducción: se fijó la lista de idiomas de GP2 y se prototipó el español.' },
];

const DIAS = [
  { d: 'JUE 17', s: 14400, n: 15, txt: ['Ocho sitios de AEO ajustados en una tanda', 'Tracking v2 del nightlife de Turning Stone', 'Savaya Bali y Green Valley a LIVE'] },
  { d: 'VIE 18', s: 12420, n: 4, txt: ['Doors open en la plantilla del pop-up', 'Migración del AEO de Zouk Group LV', 'Capa de traducción del Guest Portal'] },
  { d: 'LUN 21', s: 15720, n: 8, txt: ['Sitemap XML de eventos, verificado en STG', 'AEO de Zouk Group LV al módulo estándar', 'Pop-up de Go Pool y cierres de Green Valley'], pico: true },
];

// El barrido de AEO: un sitio migrado de fondo y siete ajustados en minutos
const AEO = [
  { n: 'Zouk Group LV', k: 'UWS-8311', t: '2 h 25 m', d: 'Migración al módulo estándar y configuración de llms.txt / llms-full', grande: true },
  { n: 'Zouk Group', k: 'UWS-8202', t: '4 m', d: 'Ajuste de settings' },
  { n: 'livnightclub.com', k: 'UWS-8549', t: '3 m', d: 'Respuesta .md desactivada' },
  { n: 'bodegamke.com', k: 'UWS-8564', t: '6 m', d: 'Ajuste de settings' },
  { n: 'Heat Ultra Lounge', k: 'UWS-8600', t: '5 m', d: 'Ajuste de settings' },
  { n: 'Zouk LA', k: 'UWS-8601', t: '6 m', d: 'Ajuste de settings' },
  { n: 'Turning Stone nightlife', k: 'UWS-8619', t: '6 m', d: 'Respuesta .md desactivada' },
  { n: 'lasvegasnewyearseve.com', k: 'UWS-8684', t: '6 m', d: 'Cambios aplicados' },
];

// Continuidad: qué pasó con todo lo que la semana 36 dejó vivo
const COLA = [
  { k: 'UWS-9583', t: 'GPM · aviso de traslapes', de: 'Devuelto de QA', a: 'Finalizada', bien: true, nota: 'cerrada el 8 de sep' },
  { k: 'UWS-9611', t: 'Zouk LV · Tracking v2', de: 'En QA', a: 'Finalizada', bien: true },
  { k: 'UWS-9614', t: 'Sevilla · Tracking v2', de: 'En QA', a: 'Finalizada', bien: true },
  { k: 'UWS-9615', t: 'The Cheetah · Tracking v2', de: 'En QA', a: 'Finalizada', bien: true },
  { k: 'UWS-9714', t: 'Guest Portal · analytics', de: 'En QA', a: 'Finalizada', bien: true },
  { k: 'UWS-9375', t: 'Turning Stone · Game Day', de: 'Esperando cliente', a: 'Sigue esperando', bien: false },
];

const TABLERO = {
  fin: [
    ['UWS-8311', 'AEO · Zouk Group LV'],
    ['UWS-10166', 'Experiences Popup · doors open'],
    ['UWS-9838', 'Guest Portal · traducción'],
    ['UWS-10135', 'Green Valley · bullets'],
    ['UWS-10125', 'Savaya Bali · imágenes'],
    ['UWS-10136', 'Green Valley · estilos'],
    ['UWS-10141', 'Go Pool · pop-up del 23/9'],
    ['UWS-8202 · 8549', 'AEO · Zouk Group y Liv'],
    ['UWS-8564 · 8600', 'AEO · bodegamke y Heat'],
    ['UWS-8601 · 8619', 'AEO · Zouk LA y nightlife'],
    ['UWS-8684', 'AEO · lasvegasnewyearseve'],
  ],
  qa: [['UWS-9990', 'Turning Stone · tracking v2'], ['UWS-10067', 'Zouk Group LV · sitemap']],
  espera: [['UWS-9375', 'Turning Stone · Game Day'], ['UWS-8324', 'Guest Portal unificado'], ['UWS-8489', 'Gestión de integraciones']],
};

// ── Helpers de maquetado ─────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.72);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 40px; height: 40px; border-radius: 10px; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">S38</span>
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
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Semana del 15 al 21 de septiembre. La de menos horas de la serie y la de mas cierres: catorce de dieciseis, en solo tres dias con registro." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '88% 10%', ancho: 85, alto: 75, fuerza: 0.55 }), kit.lavado({ color: INK, en: '8% 95%', ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
      <div data-orbe style="position: absolute; left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);"></div>
    </div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span data-sello style="width: 74px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 33px; font-weight: 800;">S38</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reporte semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Jira · UrVenue Web Services</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 90px; font-weight: 800; letter-spacing: -3.2px; line-height: 1.05; max-width: 1560px;">Semana 38: catorce cierres<br>en tres días</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 1120px;">Martes 15 – lunes 21 de septiembre de 2026 · Axl Guillen · con base en los worklogs de Jira.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('11 h 49 m registradas')}
      ${pill('16 issues')}
      ${pill('27 worklogs')}
      ${pill('14 finalizadas', '#FFFFFF', BLUE)}
    </div>
  </section>`);

// ── 2 · Números y las cuatro semanas ─────────────────────────────────────
const stat = (v, k, sub = '', cuenta = null) => `
        <div data-stat style="${CARD} border-radius: 20px; padding: 30px 28px 26px; display: flex; flex-direction: column; gap: 8px; border-top: 5px solid ${BLUE};">
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 58px; font-weight: 800; color: ${BLUE}; letter-spacing: -2.2px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 21px; font-weight: 600; color: ${INK}; line-height: 1.25;">${k}</span>
          ${sub ? `<span style="font-size: 17.5px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${sub}</span>` : ''}
        </div>`;

// Cuatro barras por métrica; la actual en azul y las viejas en grises
const evolucion = (etiqueta, vals, max, fmt) => `
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <span style="font-size: 20px; font-weight: 700; color: ${INK};">${etiqueta}</span>
            ${vals.map(([sem, v], i) => {
              const ultima = i === vals.length - 1;
              const color = ultima ? `linear-gradient(90deg, ${BLUE}, ${BRIGHT})` : (i === vals.length - 2 ? GRIS_2 : GRIS);
              return `
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 14.5px; font-weight: ${ultima ? 800 : 700}; color: ${ultima ? BLUE : MUTED}; width: 46px; letter-spacing: 1px;">${sem}</span>
              <div style="flex: 1; background: ${SOFT}; border-radius: 5px; height: 12px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.13);">
                <div data-barra${ultima ? '-hoy' : ''} style="width: ${Math.round(v / max * 100)}%; height: 100%; border-radius: 5px; background: ${color};${ultima ? ` box-shadow: 0 1px 4px rgba(0,82,204,0.35);` : ''}"></div>
              </div>
              <span style="font-size: 17px; font-weight: ${ultima ? 800 : 600}; color: ${ultima ? BLUE : MUTED}; width: 100px; text-align: right; ${NUM}">${fmt(v)}</span>
            </div>`;
            }).join('')}
          </div>`;

slides.push(`
  <section data-label="La semana en números" data-screen-label="Números" data-speaker-notes="El dato de la semana: la de menos horas registradas y la de mas cierres de toda la serie. Catorce finalizadas contra las nueve del record anterior." style="${seccion()}">
    ${header('Números')}
    ${h2('Menos horas que nunca,<br>más cierres que nunca')}
    ${bajada('11 h 49 m repartidas en tres días con registro. Aun así se cerraron 14 de las 16 issues tocadas: el mejor número de la serie por amplio margen.')}
    <div data-a="up3" style="margin-top: 26px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;">
      ${stat('11 h 49 m', 'Tiempo registrado', '42 540 s en 27 worklogs')}
      ${stat('16', 'Issues trabajadas', 'Todas en el proyecto UWS', 16)}
      ${stat('14', 'Finalizadas', '88 % de lo que se tocó', 14)}
      ${stat('3', 'Días con registro', 'Jueves, viernes y lunes', 3)}
    </div>
    <div data-comparativa style="${CARD} margin-top: 20px; border-radius: 22px; padding: 22px 32px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; flex: 1;">
      <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Las cuatro semanas del reporte</span>
      ${evolucion('Tiempo registrado', [['S34', SEM34_S], ['S35', SEM35_S], ['S36', SEM36_S], ['S38', TOTAL_S]], SEM36_S, s => hm(s))}
      ${evolucion('Issues finalizadas', [['S34', 7], ['S35', 9], ['S36', 5], ['S38', 14]], 14, v => String(v))}
      <span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Las dos curvas se cruzan: la semana 36 fue de construir una página entera y cerró cinco; esta fue de barrer pendientes y cerró catorce.</span>
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
  <section data-label="Dónde se fue el tiempo" data-screen-label="Tiempo por tema" data-speaker-notes="El reparto mas parejo de la serie: cinco frentes entre 11 y 26 por ciento. Ninguno domina, al reves que la semana 36 donde uno se llevo el 42." style="${seccion()}">
    ${header('Tiempo por tema')}
    ${h2('Cinco frentes y ninguno<br>se lleva un tercio')}
    <div data-a="up2" style="margin-top: 26px; display: grid; grid-template-columns: 420px 1fr; gap: 44px; flex: 1; align-items: center;">
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <svg data-dona viewBox="0 0 340 340" style="width: 380px; height: 380px; overflow: visible;">
          <circle cx="170" cy="170" r="${R}" fill="none" stroke="${SOFT}" stroke-width="${GROSOR}"></circle>
          ${arcos}
        </svg>
        <div style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <span data-total style="font-size: 46px; font-weight: 800; color: ${INK}; letter-spacing: -1.6px; ${NUM}">11 h 49 m</span>
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
    ${nota('Es el reparto más parejo de la serie: del 26 % al 11 %, sin un frente que se coma la semana. <strong style="font-weight: 700;">Así se ve una semana de mantenimiento</strong>, frente a una de construcción como la 36.')}
  </section>`);

// ── 4 · Historia central: el barrido de AEO ──────────────────────────────
slides.push(`
  <section data-label="AEO" data-screen-label="AEO" data-speaker-notes="La historia de la semana: ocho sitios de AEO tocados. Uno con migracion de fondo de dos horas y media, y siete con ajustes de minutos. Los ocho quedaron cerrados." style="${seccion()}">
    ${header('Historia central', pill('8 sitios', WASH, BLUE))}
    ${h2('Ocho sitios de AEO,<br>una migración y siete ajustes')}
    <div data-a="up2" style="margin-top: 28px; display: grid; grid-template-columns: 0.72fr 1.38fr; gap: 30px; flex: 1;">
      <div data-panel style="${kit.fondo(BLUE, puntosAzul(26), kit.lavado({ color: BRIGHT, en: '85% 8%', ancho: 90, alto: 70, fuerza: 0.6, alcance: 60 }))} border-radius: 26px; padding: 40px 36px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(23,43,77,0.14), 0 18px 40px rgba(0,82,204,0.28);">
        <span data-cuenta="8" style="font-size: 132px; font-weight: 800; letter-spacing: -5px; line-height: 1; ${NUM}">8</span>
        <span style="font-size: 25px; font-weight: 600; margin-top: 6px; line-height: 1.3;">sitios tocados — 3 h 01 m en total</span>
        <div style="flex: 1;"></div>
        <div style="display: flex; flex-direction: column; gap: 13px;">
          <span style="font-size: 19px; color: rgba(255,255,255,0.85); line-height: 1.45;">Siete se resolvieron con <strong style="font-weight: 700;">36 minutos sumados</strong>: el módulo ya estaba puesto y solo faltaba la configuración.</span>
          <div style="height: 1px; background: rgba(255,255,255,0.22);"></div>
          <span style="font-size: 19px; color: rgba(255,255,255,0.85); line-height: 1.45;">El octavo, Zouk Group LV, se llevó <strong style="font-weight: 700;">2 h 25 m</strong> porque había que migrarlo al módulo estándar desde cero.</span>
          <span style="margin-top: 4px; align-self: flex-start; background: ${OK_WASH}; color: ${OK}; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 8px 18px;">Los ocho, finalizados</span>
        </div>
      </div>
      <div data-lista style="${CARD} border-radius: 26px; padding: 30px 30px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
        ${AEO.map(a => `
        <div data-sitio style="display: grid; grid-template-columns: 250px 122px 1fr 86px; gap: 16px; align-items: center; padding: ${a.grande ? '13px 16px' : '9px 16px'}; border-radius: 12px; ${a.grande ? `background: ${WASH};` : ''}">
          <span style="font-size: ${a.grande ? 23 : 20}px; font-weight: ${a.grande ? 700 : 600}; color: ${a.grande ? INK : MUTED}; letter-spacing: -0.3px;">${a.n}</span>
          ${chip(a.k)}
          <span style="font-size: 17.5px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${a.d}</span>
          <span style="font-size: ${a.grande ? 19 : 17}px; font-weight: 700; color: ${a.grande ? BLUE : MUTED}; text-align: right; ${NUM}">${a.t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 5 · Las dos piezas de producto ───────────────────────────────────────
const pieza = (etiqueta, k, titulo, items, color, tiempo, cierre) => `
        <div data-pieza style="${CARD} border-radius: 24px; padding: 34px 32px; display: flex; flex-direction: column; gap: 15px; border-top: 5px solid ${color};">
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
  <section data-label="Producto" data-screen-label="Producto" data-speaker-notes="Las dos piezas que no son de un cliente puntual sino de la plataforma: la hora de apertura en la plantilla del popup, y la capa de traduccion que el Guest Portal no tenia." style="${seccion()}">
    ${header('Producto')}
    ${h2('Dos cambios que sirven<br>para todos los clientes')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; flex: 1;">
      ${pieza('Experiences Popup', 'UWS-10166', 'La hora de apertura de puertas', [
        'Se añadió «doors open» a la plantilla del pop-up de eventos, no a un sitio concreto.',
        'Ajustes de estilo y un PR aparte para revisión.',
        'Publicado en todos los ambientes y probado en el wizard.',
      ], '#8FBCEF', '2 h 14 m', 'Al vivir en la plantilla, cualquier venue que use el pop-up de experiencias lo hereda sin tocar nada.')}
      ${pieza('Guest Portal', 'UWS-9838', 'El portal no hablaba otro idioma', [
        'Cada texto del portal era un literal en inglés dentro de un componente: no había capa de traducción.',
        'Se revisó la estructura y se fijó la lista de idiomas que ya usa GP2.',
        'Prototipo de traducción automática al español como prueba de concepto.',
      ], GRIS_2, '1 h 17 m', 'Es el siguiente ladrillo del Guest Portal unificado, después del vocabulario de eventos de la semana 36.')}
    </div>
    ${nota('Las dos salen del mismo sitio: <strong style="font-weight: 700;">arreglar la plataforma en vez de cada instalación</strong>. Juntas son 3 h 31 m, casi un tercio de la semana.')}
  </section>`);

// ── 6 · Publicar y medir ─────────────────────────────────────────────────
const fila = (k, titulo, texto, estado, color) => `
        <div data-fila style="${CARD} border-radius: 15px; padding: 15px 24px; display: grid; grid-template-columns: 126px 1fr 168px; gap: 20px; align-items: center;">
          ${chip(k)}
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 21.5px; font-weight: 700; color: ${INK}; letter-spacing: -0.3px;">${titulo}</span>
            <span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${texto}</span>
          </div>
          <span style="font-size: 16.5px; font-weight: 700; text-align: center; padding: 6px 12px; border-radius: 999px; background: ${color === OK ? OK_WASH : WASH}; color: ${color};">${estado}</span>
        </div>`;

slides.push(`
  <section data-label="Publicar y medir" data-screen-label="Publicar y medir" data-speaker-notes="El resto de la semana: cuatro micrositios publicados y dos piezas de medicion, tracking y sitemap, que quedaron en control de calidad." style="${seccion()}">
    ${header('Publicar y medir')}
    ${h2('Cuatro micrositios publicados<br>y dos formas de medirlos')}
    <div data-a="up2" style="margin-top: 24px; display: flex; flex-direction: column; gap: 9px;">
      ${fila('UWS-10135', 'Green Valley · bullets del checkout', 'Tres pasadas el jueves, un bullet nuevo el lunes y pase a LIVE con reporte — 1 h 05 m.', 'Finalizada', OK)}
      ${fila('UWS-10125', 'Savaya Bali · imágenes del landing', 'Imágenes actualizadas en STG y publicadas — 44 m.', 'Finalizada', OK)}
      ${fila('UWS-10136', 'Green Valley · estilos de GVR Special Events', 'Estilos corregidos y a LIVE en una sola pasada — 28 m.', 'Finalizada', OK)}
      ${fila('UWS-10141', 'Go Pool · pop-up del 23 de septiembre', 'Pop-up personalizado creado y publicado con tiempo — 21 m.', 'Finalizada', OK)}
      ${fila('UWS-9990', 'Turning Stone nightlife · Tracking v2', 'Códigos migrados a v2 y publicados — 1 h 26 m.', 'En QA', BLUE)}
      ${fila('UWS-10067', 'Zouk Group LV · sitemap XML de eventos', 'Sitemap desarrollado y verificado en STG — 1 h 13 m.', 'En QA', BLUE)}
    </div>
    <div style="flex: 1; min-height: 14px;"></div>
    ${nota('Los cuatro micrositios se cerraron el mismo día en que se tocaron. <strong style="font-weight: 700;">Las dos piezas de medición son las únicas que quedaron esperando QA</strong> — y son, justamente, las que tocan datos de producción.')}
  </section>`);

// ── 7 · Día por día · curva de la semana ─────────────────────────────────
const AN = 1560, AL = 288, PAD_X = 190;   // tres puntos: más aire a los lados
const maxDia = Math.max(...DIAS.map(d => d.s));
const pts = DIAS.map((d, i) => {
  const x = +(PAD_X + i * ((AN - PAD_X * 2) / (DIAS.length - 1))).toFixed(1);
  const y = +(AL - 26 - (d.s / maxDia) * (AL - 96)).toFixed(1);
  return { x, y, ...d };
});
const linea = pts.map(p => `${p.x},${p.y}`).join(' ');
const area = `${PAD_X},${AL - 26} ${linea} ${pts.at(-1).x},${AL - 26}`;
// longitud de la polilínea, en build-time, para dibujarla con strokeDashoffset
const largoLinea = +pts.slice(1).reduce((a, p, i) =>
  a + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0).toFixed(1);

slides.push(`
  <section data-label="Día por día" data-screen-label="Día por día" data-speaker-notes="Solo tres dias con registro y los tres parecidos, entre tres y media y cuatro y media. El jueves con quince worklogs fue el dia del barrido; el viernes, con cuatro, el de trabajo de fondo." style="${seccion()}">
    ${header('Día por día')}
    ${h2('Tres días casi idénticos<br>en horas, opuestos en forma')}
    <div data-a="up2" style="margin-top: 22px; position: relative;">
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
    <div data-a="up3" style="margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1; align-content: start;">
      ${DIAS.map(d => `
        <div data-dia style="${CARD} ${d.pico ? `border: 2px solid ${BLUE};` : ''} border-radius: 18px; padding: 22px 22px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 16px; font-weight: 700; letter-spacing: 1.5px; color: ${d.pico ? BLUE : MUTED};">${d.n} worklogs</span>
          <div style="height: 1px; background: ${LINE};"></div>
          ${d.txt.map(t => `<span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.4;"><span style="color: ${BLUE}; font-weight: 700;">·</span> ${t}</span>`).join('')}
        </div>`).join('')}
    </div>
    ${nota('El jueves tuvo <strong style="font-weight: 700;">quince registros</strong> —el barrido de AEO y los micrositios— y el viernes solo cuatro para casi las mismas horas: dos tareas de fondo. El martes y el miércoles no tienen tiempo registrado.')}
  </section>`);

// ── 8 · Continuidad · con data-step ──────────────────────────────────────
slides.push(`
  <section data-label="Continuidad" data-screen-label="Continuidad" data-speaker-notes="Todo lo que la semana 36 dejo esperando cerro, incluida la deuda vieja del traslape de GPM que se cerro el 8 de septiembre. Lo unico que sigue igual es Game Day, que depende del cliente. Se revela una por una." style="${seccion()}">
    ${header('Continuidad', pill('5 de 6', OK_WASH, OK))}
    ${h2('La cola de QA de la semana 36,<br>vacía')}
    ${bajada('El reporte anterior cerró con seis issues esperando veredicto o respuesta. Cinco se resolvieron; la sexta sigue del lado del cliente.')}
    <div data-a="up3" style="margin-top: 26px; display: flex; flex-direction: column; gap: 11px;">
      ${COLA.map((c, i) => `
        <div data-fila data-step="${i + 1}" style="${CARD} border-radius: 16px; padding: 17px 26px; display: grid; grid-template-columns: 122px 1fr 186px 34px 168px; gap: 18px; align-items: center; ${c.bien ? '' : `border-left: 5px solid ${WARN};`}">
          ${chip(c.k)}
          <div style="display: flex; align-items: baseline; gap: 10px;">
            <span style="font-size: 22px; font-weight: 600; color: ${INK};">${c.t}</span>
            ${c.nota ? `<span style="font-size: 16px; font-weight: 600; color: ${MUTED};">· ${c.nota}</span>` : ''}
          </div>
          <span style="font-size: 16.5px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${c.de === 'Devuelto de QA' ? BAD_WASH : c.de === 'Esperando cliente' ? WARN_WASH : WASH}; color: ${c.de === 'Devuelto de QA' ? BAD : c.de === 'Esperando cliente' ? WARN : BLUE};">${c.de}</span>
          <span data-flecha style="font-size: 24px; font-weight: 800; color: ${MUTED}; text-align: center;">→</span>
          <span style="font-size: 16.5px; font-weight: 700; text-align: center; padding: 5px 12px; border-radius: 999px; background: ${c.bien ? OK_WASH : WARN_WASH}; color: ${c.bien ? OK : WARN};">${c.a}</span>
        </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    ${nota('La semana 37 no tuvo reporte porque solo registró <strong style="font-weight: 700;">3 h 13 m, todas el martes 8</strong> — y fue justo ese día cuando se cerró el aviso de traslapes de GPM, la deuda más vieja del tablero.')}
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
  <section data-label="Estado del tablero" data-screen-label="Estado" data-speaker-notes="Al martes 22 de septiembre: catorce finalizadas, dos en QA y tres esperando a alguien mas. La columna verde no cabia en una sola fila." style="${seccion()}">
    ${header('Estado')}
    ${h2('Cómo quedó el tablero')}
    ${bajada('Estado en Jira al martes 22 de septiembre. Es la primera vez en la serie que la columna de finalizadas necesita dos columnas para caber.')}
    <div data-a="up3" style="margin-top: 26px; display: grid; grid-template-columns: 1.85fr 0.75fr 0.9fr; gap: 20px; flex: 1; align-content: start;">
      ${col('Finalizadas', OK, OK_WASH, TABLERO.fin, 2)}
      ${col('En QA', BLUE, WASH, TABLERO.qa)}
      ${col('Esperando', WARN, WARN_WASH, TABLERO.espera)}
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
  <section data-label="Lo que viene" data-screen-label="Lo que viene" data-speaker-notes="Semana 39: el tablero queda casi limpio. Solo dos en QA, el Guest Portal como proyecto grande, y Game Day que lleva tres semanas del lado del cliente." style="${seccion()}">
    ${header('Lo que viene')}
    ${h2('El tablero queda<br>casi limpio')}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; flex: 1; align-content: start;">
      ${siguiente('Vigilar', 'Dos issues en QA', 'El tracking del nightlife de Turning Stone y el sitemap de Zouk Group LV. Es la cola más corta de toda la serie.')}
      ${siguiente('Construir', 'Guest Portal unificado', 'Tras el vocabulario de eventos y la capa de traducción, es el frente donde queda trabajo de fondo por hacer.', WARN)}
      ${siguiente('Insistir', 'Game Day de Turning Stone', 'Lleva tres semanas en «esperando respuesta» desde que se construyó. Conviene empujar por el lado del cliente, no del código.', WARN)}
      ${siguiente('Sin deuda', 'Nada devuelto de QA', 'Por primera vez en la serie no hay ninguna issue de vuelta de control de calidad ni ninguna deuda arrastrada.', OK)}
    </div>
    ${nota('Es el mejor punto de partida de las cuatro semanas: <strong style="font-weight: 700;">sin devoluciones pendientes y con solo dos issues esperando veredicto</strong>.', OK)}
  </section>`);

// ── 11 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="En una frase: la semana de menos horas y mas cierres. Catorce de dieciseis, con la cola de QA de la semana 36 vaciada." style="${kit.fondo(BLUE, puntosAzul(), kit.lavado({ color: BRIGHT, en: '15% 90%', ancho: 80, alto: 70, fuerza: 0.5, alcance: 60 }))} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-orbe style="position: absolute; right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-orbe style="position: absolute; left: 40%; bottom: -260px; width: 520px; height: 520px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.09);"></div>
    </div>
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-split style="margin: 26px 0 0; font-size: 84px; font-weight: 800; letter-spacing: -3px; line-height: 1.05; max-width: 1540px;">La semana de menos horas<br>y más cierres de la serie</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.55; max-width: 1180px;">11 h 49 m en tres días para cerrar 14 de 16 issues, vaciar la cola de QA que dejó la semana 36 y dejar el tablero sin ninguna deuda arrastrada.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Semana 38 · 15–21 sep 2026')}
      ${pill('Fuente: worklogs de Jira · proyecto UWS')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Semana 38 · Reporte semanal Jira</title>
${kit.og({ titulo: 'Semana 38 · Reporte semanal Jira', descripcion: '11 h 49 m en 16 issues del 15 al 21 de septiembre: ocho sitios de AEO, la hora de apertura en el pop-up de experiencias y la capa de traducción del Guest Portal. Catorce cierres, el récord de la serie.', carpeta: 'semana38' })}
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
${kit.reproductor({ src: 'video.mp4', etiqueta: 'Reproducir', tecla: 'v', acento: BLUE })}
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

  animar('AEO', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-panel]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100,
                                    transformOrigin: '0% 50%', duration: 0.8 }, 0.2)
      .from(q(s, '[data-lista]'), { x: 50, opacity: 0, duration: 0.75 }, 0.3)
      // los ocho sitios caen en cascada rápida: es un barrido
      .from(Q(s, '[data-sitio]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.06 }, 0.55);
    cuenta(tl, q(s, '[data-cuenta]'), 0.4);
  });

  animar('Producto', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-pieza]'), { y: 46, opacity: 0, rotationX: -20, transformPerspective: 1200,
                                    transformOrigin: '50% 0%', duration: 0.7, stagger: 0.14 }, 0.25)
      .from(Q(s, '[data-pieza-item]'), { y: 16, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.55)
      .from(q(s, '[data-nota]'), { y: 22, opacity: 0, duration: 0.6 }, 0.95);
  });

  animar('Publicar y medir', function (tl, s) {
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
