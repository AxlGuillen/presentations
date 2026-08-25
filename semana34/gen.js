// Generador de index.html — Reporte semanal de Jira · Semana 34 (mar 18 – lun 24 ago 2026)
// Ejecutar: node semana34/gen.js
//
// Fuente de los datos: worklogs de Jira (urvenue.atlassian.net, proyecto UWS)
// con autor Axl Guillen entre el 18 y el 24 de agosto de 2026 — 31 registros,
// 71 100 s = 19 h 45 m sobre 15 issues. Estados al lunes 25 ago ~9:40 PT.
// Paleta: azul y blanco de Jira/Atlassian (#0052CC sobre blanco, tinta #172B4D).
const fs = require('fs');

// ── Identidad · paleta Jira ──────────────────────────────────────────────
const BLUE = '#0052CC';       // azul Jira — acento único
const BRIGHT = '#2684FF';     // azul brillante para gradientes y barras
const WASH = '#DEEBFF';       // lavado azul para chips y fondos suaves
const BG = '#FFFFFF';         // blanco pleno
const SOFT = '#F5F7FA';       // gris con sesgo azul para tarjetas
const INK = '#172B4D';        // navy de texto Atlassian
const MUTED = '#5E6C84';      // gris azulado secundario
const LINE = '#DFE1E6';
// Semánticos de estado (aparte del acento)
const OK = '#00875A';    const OK_WASH = '#E3FCEF';
const WARN = '#974F0C';  const WARN_WASH = '#FFF0B3';
const BAD = '#DE350B';   const BAD_WASH = '#FFEBE6';

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
// Sombra en capas: contacto + elevación + un halo azul muy tenue
const SOMBRA = `box-shadow: 0 1px 2px rgba(23,43,77,0.07), 0 10px 24px rgba(23,43,77,0.08), 0 26px 52px rgba(0,82,204,0.07);`;
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
// Textura de puntitos para los fondos blancos + un lavado azul en la esquina
const DOTS = `background-image: radial-gradient(rgba(0,82,204,0.14) 1.9px, transparent 1.9px), radial-gradient(72% 56% at 100% 0%, rgba(222,235,255,0.6) 0%, rgba(222,235,255,0) 62%); background-size: 26px 26px, 100% 100%;`;
// Variante clara de los puntitos para los fondos azules
const DOTS_AZUL = `radial-gradient(rgba(255,255,255,0.13) 1.9px, transparent 1.9px)`;

// ── Helpers ──────────────────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.72);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 40px; height: 40px; border-radius: 10px; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">S34</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Reporte semanal · Jira UWS</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `background: ${BG}; ${DOTS} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 66px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 62) =>
  `<h2 data-a="up" style="margin: 0; font-size: ${size}px; font-weight: 800; color: ${INK}; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;

const bajada = (txt, max = 1380) =>
  `<p data-a="up2" style="margin: 18px 0 0; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const pill = (txt, bg = 'rgba(255,255,255,0.16)', color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 9px 22px; letter-spacing: 0.3px; white-space: nowrap; ${NUM}">${txt}</span>`;

const key = (k, dark = false) =>
  `<span style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px; color: ${dark ? '#FFFFFF' : BLUE}; background: ${dark ? 'rgba(255,255,255,0.14)' : WASH}; border-radius: 6px; padding: 3px 10px; white-space: nowrap;">${k}</span>`;

const nota = (txt, color = BLUE) => `
    <div data-a="up3" style="background: ${color === BLUE ? WASH : color + '14'}; border-left: 5px solid ${color}; border-radius: 0 14px 14px 0; padding: 22px 30px; font-size: 22.5px; font-weight: 400; color: ${INK}; line-height: 1.5; box-shadow: 0 8px 20px rgba(23,43,77,0.08);">${txt}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Semana del 18 al 24 de agosto. Todo sale de los worklogs de Jira: 31 registros, casi 20 horas." style="background: ${BLUE}; background-image: ${DOTS_AZUL}, radial-gradient(85% 75% at 88% 10%, rgba(38,132,255,0.55) 0%, rgba(0,0,0,0) 62%), radial-gradient(70% 60% at 8% 95%, rgba(23,43,77,0.35) 0%, rgba(0,0,0,0) 55%); background-size: 30px 30px, 100% 100%, 100% 100%; font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-a="ghost" style="position: absolute; right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      <div data-a="ghost" style="position: absolute; right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
    </div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span style="width: 74px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${BLUE}; display: inline-flex; align-items: center; justify-content: center; font-size: 33px; font-weight: 800;">S34</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reporte semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Jira · UrVenue Web Services</span>
      </div>
    </div>
    <h1 data-a="up2" style="margin: 38px 0 0; font-size: 98px; font-weight: 800; letter-spacing: -3.4px; line-height: 1.04; max-width: 1560px;">Semana 34: ocho clientes<br>y Zouk Tokio en japonés</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 1080px;">Martes 18 – lunes 24 de agosto de 2026 · Axl Guillen · con base en los worklogs de Jira.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('19 h 45 m registradas')}
      ${pill('15 issues')}
      ${pill('31 worklogs')}
      ${pill('7 finalizadas', '#FFFFFF', BLUE)}
    </div>
  </section>`);

// ── 2 · La semana en números ─────────────────────────────────────────────
const stat = (v, k, sub = '') => `
        <div style="${CARD} border-radius: 20px; padding: 36px 34px 32px; display: flex; flex-direction: column; gap: 10px; border-top: 5px solid ${BLUE};">
          <span style="font-size: 66px; font-weight: 800; color: ${BLUE}; letter-spacing: -2.5px; line-height: 1; ${NUM}">${v}</span>
          <span style="font-size: 23px; font-weight: 600; color: ${INK}; line-height: 1.25;">${k}</span>
          ${sub ? `<span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${sub}</span>` : ''}
        </div>`;
slides.push(`
  <section data-label="La semana en números" data-screen-label="Números" data-speaker-notes="Cinco dias habiles, casi 4 horas registradas por dia. 7 de 15 issues quedaron finalizadas; el resto en QA o esperando estatus externo." style="${seccion()}">
    ${header('Números')}
    ${h2('La semana en números')}
    ${bajada('Cinco días hábiles con carga pareja: entre 3 h 36 m y 4 h 43 m diarias, repartidas en frentes de ocho clientes distintos.')}
    <div data-a="up3" style="margin-top: 44px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      ${stat('19 h 45 m', 'Tiempo registrado', '71 100 segundos en 31 worklogs')}
      ${stat('15', 'Issues trabajadas', 'Todas en el proyecto UWS')}
      ${stat('3 h 57 m', 'Promedio por día', 'El viernes fue el pico: 4 h 43 m')}
      ${stat('7', 'Issues finalizadas', 'Y al menos 8 pases a LIVE / UAT')}
      ${stat('4', 'Quedaron en QA', 'Zouk Tokio ×2, plugin WP y tracking RWLV')}
      ${stat('8', 'Clientes atendidos', 'De Las Vegas a Nashville y Tokio')}
    </div>
    <div style="flex: 1;"></div>
    ${nota('Ninguna issue se quedó abierta por olvido: las 8 que no cerraron están <strong style="font-weight: 700;">en control de calidad o esperando respuesta externa</strong>, no en el tintero.')}
  </section>`);

// ── 3 · Dónde se fue el tiempo ───────────────────────────────────────────
const tema = (nombre, tiempo, pct, ancho, desc) => `
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 20px;">
            <span style="font-size: 27px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px;">${nombre}</span>
            <span style="font-size: 23px; font-weight: 700; color: ${BLUE}; white-space: nowrap; ${NUM}">${tiempo} · ${pct}%</span>
          </div>
          <div style="background: ${SOFT}; border-radius: 6px; height: 16px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(23,43,77,0.14);">
            <div style="width: ${ancho}%; height: 100%; border-radius: 6px; background: linear-gradient(90deg, ${BLUE}, ${BRIGHT}); box-shadow: 0 1px 4px rgba(0,82,204,0.35);"></div>
          </div>
          <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${desc}</span>
        </div>`;
slides.push(`
  <section data-label="Dónde se fue el tiempo" data-screen-label="Tiempo por tema" data-speaker-notes="Cinco frentes. Zouk Tokio en japones domina con 37%: uno de cada tres minutos de la semana." style="${seccion()}">
    ${header('Tiempo por tema')}
    ${h2('Dónde se fue el tiempo')}
    ${bajada('Cinco frentes concentran las 19 h 45 m. La localización de Zouk Tokio al japonés es por mucho el mayor: <strong style="font-weight: 700; color: ' + INK + ';">uno de cada tres minutos</strong> de la semana.')}
    <div data-a="up3" style="margin-top: 46px; display: flex; flex-direction: column; gap: 30px; flex: 1;">
      ${tema('Zouk Tokio · integración en japonés', '7 h 19 m', 37, 100, 'UWS-9369 y UWS-9213 — soporte JA en la UI, precios dinámicos, vista de mapa y estilos del micrositio.')}
      ${tema('Checkouts y micrositios de clientes', '4 h 30 m', 23, 62, 'Parton’s Nashville, HFTP Las Vegas, Tailgate Beachclub y la landing de ZoukLV.')}
      ${tema('Plugin y núcleo de WordPress', '3 h 24 m', 17, 47, 'Air Datepicker a LIVE y limpieza de integraciones no configurables.')}
      ${tema('RWLV · tracking y cookies', '1 h 54 m', 10, 26, 'Tracking v2 en STG con migración V1→V2 y el bug del pop-up de cookies.')}
      ${tema('Otros frentes', '2 h 34 m', 13, 35, 'Guest list de Wynn, «Open site» de GPM Studio, estimación de Turning Stone y la reunión semanal.')}
    </div>
  </section>`);

// ── 4 · Historia central: Zouk Tokio ─────────────────────────────────────
const logro = (txt) => `
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <span style="flex: none; margin-top: 5px; width: 26px; height: 26px; border-radius: 50%; background: ${BLUE}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800;">✓</span>
            <span style="font-size: 23px; font-weight: 400; color: ${INK}; line-height: 1.42;">${txt}</span>
          </div>`;
slides.push(`
  <section data-label="Zouk Tokio en japonés" data-screen-label="Zouk Tokio" data-speaker-notes="La historia central de la semana. No fue traducir textos sueltos: precios dinamicos, mapa completo y un diagnostico de CSP. Ambas issues quedaron en QA." style="${seccion()}">
    ${header('Historia central')}
    ${h2('Zouk Tokio ya se explica<br>en japonés')}
    <div data-a="up3" style="margin-top: 42px; display: grid; grid-template-columns: 0.9fr 1.25fr; gap: 34px; flex: 1;">
      <div style="background: ${BLUE}; background-image: ${DOTS_AZUL}, radial-gradient(90% 70% at 85% 8%, rgba(38,132,255,0.6) 0%, rgba(0,0,0,0) 60%); background-size: 26px 26px, 100% 100%; border-radius: 26px; padding: 44px 40px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(23,43,77,0.14), 0 18px 40px rgba(0,82,204,0.28);">
        <span style="font-size: 128px; font-weight: 800; letter-spacing: -5px; line-height: 1; ${NUM}">37%</span>
        <span style="font-size: 26px; font-weight: 600; margin-top: 10px; line-height: 1.3;">de la semana — 7 h 19 m en 7 worklogs</span>
        <div style="flex: 1;"></div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">${key('UWS-9369', true)}<span style="font-size: 19px; color: rgba(255,255,255,0.85); ${NUM}">Checkout de la integración · 5 h 34 m</span></div>
          <div style="display: flex; align-items: center; gap: 12px;">${key('UWS-9213', true)}<span style="font-size: 19px; color: rgba(255,255,255,0.85); ${NUM}">Estilos de la integración · 1 h 45 m</span></div>
          <span style="margin-top: 6px; align-self: flex-start; background: #FFFFFF; color: ${BLUE}; font-size: 18px; font-weight: 700; border-radius: 999px; padding: 8px 20px;">Ambas en control de calidad</span>
        </div>
      </div>
      <div style="${CARD} border-radius: 26px; padding: 42px 40px; display: flex; flex-direction: column; gap: 20px;">
        <span style="font-size: 19px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BLUE};">Qué implicó</span>
        ${logro('Soporte de japonés extendido a toda la UI de la integración, con el ambiente apuntado a LIVE.')}
        ${logro('Traducción de las etiquetas de <strong style="font-weight: 700;">precios dinámicos</strong>: desglose, tipos de pago y cadenas compuestas.')}
        ${logro('Vista de mapa completa en japonés: controles, datepicker, tarjetas y el modal de More Info.')}
        ${logro('Diagnóstico del CSP que bloqueaba el logo.')}
        ${logro('Estilos igualados al micrositio y ambientes sincronizados, con pruebas en la página del wizard.')}
      </div>
    </div>
  </section>`);

// ── 5 · Día por día ──────────────────────────────────────────────────────
const dia = (nombre, total, items, pico = false) => `
        <div style="${CARD} ${pico ? `border: 2px solid ${BLUE};` : ''} border-radius: 20px; padding: 28px 26px 24px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${pico ? BLUE : MUTED};">${nombre}${pico ? ' · pico' : ''}</span>
            <span style="font-size: 44px; font-weight: 800; color: ${INK}; letter-spacing: -1.5px; ${NUM}">${total}</span>
          </div>
          <div style="height: 1px; background: ${LINE};"></div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${items.map(t => `<span style="font-size: 18.5px; font-weight: 400; color: ${MUTED}; line-height: 1.38;"><span style="color: ${BLUE}; font-weight: 700;">·</span> ${t}</span>`).join('')}
          </div>
        </div>`;
slides.push(`
  <section data-label="Día por día" data-screen-label="Día por día" data-speaker-notes="Carga pareja toda la semana. El viernes fue el pico con seis issues distintas; el lunes fue de cierres: sincronizar, publicar y reportar." style="${seccion()}">
    ${header('Día por día')}
    ${h2('Carga pareja, viernes de pico<br>y lunes de cierres')}
    <div data-a="up3" style="margin-top: 44px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; flex: 1; align-content: start;">
      ${dia('Mar 18', '3:46', ['Soporte JA en la UI de Zouk Tokio, a LIVE', 'Estilos igualados al micrositio', 'Estimación de Turning Stone y weekly'])}
      ${dia('Mié 19', '3:55', ['Air Datepicker a LIVE con deploy verificado', 'Limpieza de integraciones del plugin WP', 'Estilos y bullet de Tailgate'])}
      ${dia('Jue 20', '3:45', ['Precios dinámicos traducidos al JA', 'Tracking v2 de RWLV en STG, códigos V1→V2', 'Tailgate a LIVE con pruebas'])}
      ${dia('Vie 21', '4:43', ['Vista de mapa completa en JA + CSP del logo', 'Checkout de HFTP a LIVE', 'Guest list de Wynn, GPM a UAT y cookies RWLV'], true)}
      ${dia('Lun 24', '3:36', ['8 issues tocadas en un día', 'Parton’s, plugin WP y HFTP a LIVE', 'Ambientes sincronizados y reportes'])}
    </div>
    ${nota('El lunes casi todo fue <strong style="font-weight: 700;">cierre</strong>: sincronizar ambientes, pasar a LIVE, probar y reportar — ocho issues en 3 h 36 m.')}
  </section>`);

// ── 6 · Estado del tablero ───────────────────────────────────────────────
const col = (titulo, color, wash, issues) => `
        <div style="background: ${wash}; border-radius: 20px; padding: 26px 24px; display: flex; flex-direction: column; gap: 14px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 10px 26px rgba(23,43,77,0.09);">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 10px;">
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${color};">${titulo}</span>
            <span style="font-size: 40px; font-weight: 800; color: ${color}; letter-spacing: -1px; ${NUM}">${issues.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 9px;">
            ${issues.map(([k, n]) => `
            <div style="background: ${BG}; border: 1px solid rgba(23,43,77,0.08); border-radius: 10px; padding: 10px 13px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 2px 6px rgba(23,43,77,0.07);">
              <span style="font-size: 15px; font-weight: 700; color: ${color}; letter-spacing: 0.3px;">${k}</span>
              <span style="font-size: 15.5px; font-weight: 400; color: ${INK}; line-height: 1.3;">${n}</span>
            </div>`).join('')}
          </div>
        </div>`;
slides.push(`
  <section data-label="Estado del tablero" data-screen-label="Estado" data-speaker-notes="Como quedo el tablero al lunes 25 en la manana. Verde: cerrado. Azul: en QA. Ambar: espera externa. Rojo: ZoukLV regreso de QA hoy y es prioridad Highest." style="${seccion()}">
    ${header('Estado')}
    ${h2('Cómo quedó el tablero')}
    ${bajada('Estado en Jira al lunes 25 por la mañana, ordenado como fluye el trabajo: lo cerrado, lo que espera veredicto y lo que regresó.')}
    <div data-a="up3" style="margin-top: 40px; display: grid; grid-template-columns: 1.35fr 1.15fr 1fr 1fr; gap: 20px; flex: 1; align-content: start;">
      ${col('Finalizadas', OK, OK_WASH, [
        ['UWS-9116', 'Air Datepicker en el núcleo'],
        ['UWS-9522', 'Checkout de HFTP Las Vegas'],
        ['UWS-9477', 'Verbiage de Tailgate'],
        ['UWS-9465 · 9283', 'Parton’s: bullets y branding'],
        ['UWS-9291 · 9535', '«Open site» GPM y cookies RWLV'],
      ])}
      ${col('En QA', BLUE, WASH, [
        ['UWS-9369', 'Zouk Tokio · checkout JA'],
        ['UWS-9213', 'Zouk Tokio · estilos'],
        ['UWS-9262', 'Limpieza del plugin WP'],
        ['UWS-9493', 'Tracking v2 de RWLV'],
      ])}
      ${col('En espera', WARN, WARN_WASH, [
        ['UWS-9452', 'Wynn · guest list'],
        ['UWS-9375', 'Turning Stone · estimación'],
        ['UWS-8489', 'Gestión de integraciones (ongoing)'],
      ])}
      ${col('Regresó de QA', BAD, BAD_WASH, [
        ['UWS-9511', 'ZoukLV · landing del 16 de septiembre — prioridad Highest, volvió hoy lunes'],
      ])}
    </div>
  </section>`);

// ── 7 · Lo que viene ─────────────────────────────────────────────────────
const siguiente = (n, titulo, texto, color = BLUE) => `
        <div style="${CARD} border-radius: 22px; padding: 34px 32px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${color};">
          <span style="font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color};">${n}</span>
          <span style="font-size: 27px; font-weight: 700; color: ${INK}; letter-spacing: -0.5px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.48;">${texto}</span>
        </div>`;
slides.push(`
  <section data-label="Lo que viene" data-screen-label="Lo que viene" data-speaker-notes="Prioridad 1: el retrabajo de ZoukLV que regreso de QA hoy — la landing tiene fecha dura, 16 de septiembre. Luego atender lo que regrese de QA y arrancar las dos nuevas de GPM." style="${seccion()}">
    ${header('Lo que viene')}
    ${h2('La semana 35 empieza<br>con una devolución')}
    <div data-a="up3" style="margin-top: 42px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; flex: 1; align-content: start;">
      ${siguiente('Primero', 'Retrabajo de ZoukLV', 'UWS-9511 regresó de QA hoy lunes por la mañana. Es prioridad Highest y la landing del Día de la Independencia tiene fecha dura: el 16 de septiembre no se mueve.', BAD)}
      ${siguiente('Vigilar', 'Cuatro issues en QA', 'Zouk Tokio (×2), la limpieza del plugin WP y el tracking de RWLV esperan veredicto. Cualquiera puede regresar con observaciones, como pasó con ZoukLV.')}
      ${siguiente('Arrancar', 'Dos nuevas de GPM', 'UWS-9544 (el itinerario en móvil solo se navega semana por semana) y UWS-9513 (el preview del wizard muestra tags fantasma). UWS-9293 sigue en pausa.')}
      ${siguiente('Esperar', 'Respuestas externas', 'Wynn quedó con página de pruebas solicitada para la guest list, y la estimación de Turning Stone ya está entregada. Ninguna bloquea trabajo propio.', WARN)}
    </div>
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="Resumen en una frase: 7 cerradas, 8 clientes, Zouk Tokio en japones. La semana 35 abre con el retrabajo de ZoukLV." style="background: ${BLUE}; background-image: ${DOTS_AZUL}, radial-gradient(80% 70% at 15% 90%, rgba(38,132,255,0.5) 0%, rgba(0,0,0,0) 60%); background-size: 30px 30px, 100% 100%; font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-a="ghost" style="position: absolute; right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
    </div>
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-a="up2" style="margin: 26px 0 0; font-size: 88px; font-weight: 800; letter-spacing: -3px; line-height: 1.04; max-width: 1460px;">Siete issues cerradas,<br>ocho clientes atendidos<br>y Zouk Tokio hablando japonés</h2>
    <p data-a="up3" style="margin: 34px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.55; max-width: 1100px;">19 h 45 m registradas sin huecos: todo lo abierto está en QA o esperando a alguien más. La semana 35 abre con el retrabajo de ZoukLV rumbo al 16 de septiembre.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Semana 34 · 18–24 ago 2026')}
      ${pill('Fuente: worklogs de Jira · proyecto UWS')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Semana 34 · Reporte semanal Jira</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BLUE}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  @keyframes dsGhost { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.65s 0.13s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.75s 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="ghost"] { animation: dsGhost 1.1s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
  }
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
