// Generador de index.html — «DRA · Del pizarrón a la evidencia»: el método
// común para evaluar las ideas del equipo de socios.
// Ejecutar: node dra/gen.js
//
// Charla para el equipo de DRA (Axl, Rodri y Diego). No es de UrVenue: sin
// logos de nadie. Fuente: el documento base «DRA · Cómo vamos a evaluar
// nuestras ideas» que Axl pegó en la sesión del 14/10/2026, destilado a
// 18 láminas: el embudo de 5 pasos con una lámina por paso, las plataformas,
// el registro, la reunión, el ejemplo de Pádel SoloQ y lo que hay que acordar.
//
// Misma estética y coreografía que los reportes semanales (semana34–38):
// blanco con puntitos, sombras en capas, Figtree, titulares partidos en
// palabras con entrada 3D, contadores y trazos. Lo que cambia es la paleta.
//
// Cuidados (no quitarlos al editar):
//   - El repo y el sitio son PÚBLICOS. De la tabla de capacidad solo salen
//     las horas: las aportaciones y las metas de sueldo de cada socio no van
//     en pantalla, y los montos quedan como pregunta por confirmar.
//   - Los enlaces a Notion y Miro tampoco van: son espacios privados.
//   - «No polémico» y el resto de los filtros van tal cual los acordaron.
//   - La liga manual de Pádel dura 4 semanas, aunque la regla general dice
//     pruebas de máximo 2: así viene en el documento y no se corrige aquí.
//   - Cifras de pádel: FIP 2024 y 2025; Playtomic: Emprendedores.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad ────────────────────────────────────────────────────────────
// La familia de los reportes semanales con su propio acento: un índigo de
// tinta de plumón, el del pizarrón donde salieron las seis ideas. La tríada
// (índigo, teal, magenta) solo aparece donde hay tres cosas que distinguir:
// Impacto/Confianza/Facilidad y deseabilidad/viabilidad/factibilidad.
// Verde, ámbar y rojo quedan reservados a la decisión final de una idea.
const ACC = '#4B3BD6';
const BRIGHT = '#7A6BFF';
const WASH = '#ECEAFF';
const BG = '#FFFFFF';
const SOFT = '#F6F5FB';
const INK = '#1C1A3A';
const MUTED = '#64618A';
const LINE = '#E2E0EE';
const TEAL = '#0E8C7A';   const TEAL_WASH = '#E0F5F1';
const ROSA = '#C2399B';   const ROSA_WASH = '#FBE6F4';
const OK = '#00875A';     const OK_WASH = '#E3FCEF';
const WARN = '#974F0C';   const WARN_WASH = '#FFF0B3';
const BAD = '#DE350B';    const BAD_WASH = '#FFEBE6';

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: ACC });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FCFBFF 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(ACC, 0.13) }),
  kit.lavado({ color: WASH, fuerza: 0.7 }));
const puntosClaro = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });
const FONDO_COLOR = (en1 = '88% 10%', en2 = '8% 95%') => kit.fondo(ACC, puntosClaro(),
  kit.lavado({ color: BRIGHT, en: en1, ancho: 85, alto: 75, fuerza: 0.55 }),
  kit.lavado({ color: INK, en: en2, ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }));

// ── Datos ────────────────────────────────────────────────────────────────
const PASOS = [
  { n: 1, t: 'Filtros', p: '¿Entra?' },
  { n: 2, t: 'Lean Canvas', p: '¿Qué es?' },
  { n: 3, t: 'ICE', p: '¿Cuál primero?' },
  { n: 4, t: 'Supuestos', p: '¿Qué la tumba?' },
  { n: 5, t: 'Tarjetas', p: '¿Funciona?' },
];

// ── Helpers de maquetado ─────────────────────────────────────────────────
// En las láminas de cada paso, la cabecera lleva el embudo en miniatura
// marcando en cuál estamos (lo pedía el documento).
const miniEmbudo = activo => `
        <div style="display: flex; align-items: center; gap: 6px;">
          ${PASOS.map(p => {
            const hecho = p.n < activo, ahora = p.n === activo;
            return `<span data-mini style="display: inline-flex; align-items: center; gap: 7px; font-size: 15px; font-weight: 700; padding: 7px 13px; border-radius: 999px; white-space: nowrap;
              background: ${ahora ? ACC : hecho ? WASH : 'transparent'}; color: ${ahora ? '#FFFFFF' : hecho ? ACC : MUTED}; border: 1.5px solid ${ahora ? ACC : hecho ? WASH : LINE};">${hecho ? '✓' : p.n} ${p.t}</span>`;
          }).join('')}
        </div>`;

const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.74);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 46px; height: 40px; border-radius: 10px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Cómo evaluamos ideas</span>
      </div>
      <div style="display: flex; align-items: center; gap: 22px;">
        ${extra}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${ACC};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `${FONDO_BLANCO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 66px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 62) =>
  `<h2 data-split style="margin: 0; font-size: ${size}px; font-weight: 800; color: ${INK}; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;

const bajada = (txt, max = 1400) =>
  `<p data-a="up2" style="margin: 18px 0 0; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const pill = (txt, bg = 'rgba(255,255,255,0.16)', color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 9px 22px; letter-spacing: 0.3px; white-space: nowrap; ${NUM}">${txt}</span>`;

const chip = (txt, color = ACC, wash = WASH) =>
  `<span style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px; color: ${color}; background: ${wash}; border-radius: 7px; padding: 4px 11px; white-space: nowrap;">${txt}</span>`;

const nota = (txt, color = ACC) => `
    <div data-nota style="background: ${color === ACC ? WASH : kit.alpha(color, 0.08)}; border-left: 5px solid ${color}; border-radius: 0 14px 14px 0; padding: 22px 30px; font-size: 22.5px; font-weight: 400; color: ${INK}; line-height: 1.5; box-shadow: 0 8px 20px rgba(28,26,58,0.08);">${txt}</div>`;

const fuerte = t => `<strong style="font-weight: 700;">${t}</strong>`;
const ceja = (t, color = ACC) => `<span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${t}</span>`;

const orbes = lista => `
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      ${lista.map(o => `<div data-orbe style="position: absolute; ${o}"></div>`).join('\n      ')}
    </div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Tenemos muchas ideas y poco tiempo. Esta es la propuesta de un metodo comun para decidir cuales explorar, con evidencia y no por quien habla mas fuerte." style="${FONDO_COLOR()} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${orbes([
      'right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);',
      'right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);',
      'left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);',
    ])}
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span data-sello style="width: 86px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Cómo vamos a evaluar nuestras ideas</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Propuesta de método para el equipo</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 104px; font-weight: 800; letter-spacing: -3.6px; line-height: 1.02; max-width: 1560px;">Del pizarrón<br>a la evidencia</h1>
    <p data-a="up3" style="margin: 28px 0 0; font-size: 28px; font-weight: 400; color: rgba(255,255,255,0.84); line-height: 1.5; max-width: 1180px;">Tenemos muchas ideas y poco tiempo. Un método común para decidir cuáles explorar con evidencia, no por quien habla más fuerte.</p>
    <div data-a="up3" style="margin-top: 40px; display: flex; gap: 14px;">
      ${pill('Un embudo de 5 pasos')}
      ${pill('Notion + Miro')}
      ${pill('Una reunión de 90 min')}
      ${pill('Pruebas de 2 semanas', '#FFFFFF', ACC)}
    </div>
  </section>`);

// ── 2 · En resumen ───────────────────────────────────────────────────────
const stat = (v, k, sub, cuenta = null, color = ACC) => `
        <div data-stat style="${CARD} border-radius: 22px; padding: 36px 34px 34px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; border-top: 5px solid ${color}; background-image: radial-gradient(120% 70% at 100% 0%, ${kit.alpha(color, 0.08)} 0%, transparent 60%);">
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 170px; font-weight: 800; color: ${color}; letter-spacing: -7px; line-height: 0.9; ${NUM}">${v}</span>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <span style="font-size: 32px; font-weight: 800; color: ${INK}; line-height: 1.15; letter-spacing: -0.6px;">${k}</span>
            <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${sub}</span>
          </div>
        </div>`;

slides.push(`
  <section data-label="En resumen" data-screen-label="En resumen" data-speaker-notes="Cuatro piezas: un embudo por el que pasa toda idea, dos plataformas, una reunion con agenda fija y experimentos baratos antes de construir nada." style="${seccion()}">
    ${header('En resumen')}
    ${h2('Cuatro piezas para decidir juntos')}
    ${bajada('Que cualquier idea se pueda describir, comparar y probar de la misma forma, sin importar de quién venga.')}
    <div data-a="up3" style="margin-top: 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; flex: 1;">
      ${stat('5', 'pasos de un embudo', 'Toda idea pasa por los mismos filtros, la misma ficha y la misma calificación.', 5)}
      ${stat('2', 'plataformas', 'Notion para documentar y Miro para visualizar. Claude ayuda en las dos.', 2)}
      ${stat('90', 'minutos de reunión', 'Una reunión de propuestas con agenda fija para decidir juntos.', 90)}
      ${stat('2', 'semanas por prueba', 'Experimentos baratos antes de construir cualquier cosa.', 2, OK)}
    </div>
  </section>`);

// ── 3 · El problema ──────────────────────────────────────────────────────
const RIESGOS = [
  ['Discutir en círculos', 'Sin poder comparar ideas distintas entre sí.'],
  ['Elegir la más emocionante', 'Y no la más viable.'],
  ['Construir antes de tiempo', 'Sin saber si alguien la quiere.'],
  ['Perder lo que se habló', 'Porque nada quedó registrado.'],
];
slides.push(`
  <section data-label="El problema" data-screen-label="El problema" data-speaker-notes="En la primera reunion salieron seis ideas en el pizarron. Sin un metodo, esto es lo que suele pasar." style="${seccion()}">
    ${header('El problema')}
    ${h2('Seis ideas en el pizarrón<br>y ninguna forma de compararlas')}
    <div data-a="up2" style="margin-top: 38px; display: grid; grid-template-columns: 440px 1fr; gap: 34px; flex: 1;">
      <div data-panel style="${FONDO_COLOR('85% 8%', '10% 100%')} border-radius: 26px; padding: 40px 38px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(28,26,58,0.14), 0 18px 40px ${kit.alpha(ACC, 0.3)};">
        <span data-cuenta="6" style="font-size: 170px; font-weight: 800; letter-spacing: -6px; line-height: 1; ${NUM}">6</span>
        <span style="font-size: 27px; font-weight: 600; margin-top: 8px; line-height: 1.3;">ideas en la primera reunión</span>
        <div style="flex: 1;"></div>
        <span style="font-size: 20px; color: rgba(255,255,255,0.85); line-height: 1.5;">Sin método, lo normal es que gane la que más ruido hace.</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        ${RIESGOS.map(([t, d], i) => `
        <div data-riesgo style="${CARD} border-radius: 22px; padding: 30px 30px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${BAD};">
          <span style="font-size: 17px; font-weight: 800; color: ${BAD}; letter-spacing: 1.5px; ${NUM}">0${i + 1}</span>
          <span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.15;">${t}</span>
          <span style="font-size: 21px; color: ${MUTED}; line-height: 1.45;">${d}</span>
        </div>`).join('')}
      </div>
    </div>
    <div style="margin-top: 26px;">${nota(`${fuerte('Lo que buscamos:')} que cualquier idea se pueda describir, comparar y probar de la misma forma.`)}</div>
  </section>`);

// ── 4 · Principios ───────────────────────────────────────────────────────
const PRINCIPIOS = [
  ['Lo que no está escrito no existe', 'Toda idea se registra.'],
  ['Decidimos con evidencia', 'Las opiniones se convierten en supuestos que se prueban.'],
  ['Probar barato antes de construir', 'Primero entrevistas o pruebas manuales; el código al final.'],
  ['Foco', 'Máximo 3 ideas en validación al mismo tiempo.'],
  ['Descartar también es avanzar', 'Siempre que quede escrito por qué.'],
];
slides.push(`
  <section data-label="Principios" data-screen-label="Principios" data-speaker-notes="Cinco principios que sostienen todo lo demas. Si en algun momento dudamos, regresamos aqui." style="${seccion()}">
    ${header('Principios')}
    ${h2('Cinco reglas que sostienen todo lo demás')}
    <div data-a="up2" style="margin-top: 44px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; flex: 1;">
      ${PRINCIPIOS.map(([t, d], i) => `
      <div data-principio style="${CARD} border-radius: 24px; padding: 34px 30px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; ${i === 4 ? `border-top: 5px solid ${OK};` : `border-top: 5px solid ${ACC};`}">
        <span style="font-size: 150px; font-weight: 800; color: ${i === 4 ? OK : ACC}; opacity: 0.16; letter-spacing: -6px; line-height: 0.85; ${NUM}">${i + 1}</span>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <span style="font-size: 34px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px; line-height: 1.12;">${t}</span>
          <span style="font-size: 22px; color: ${MUTED}; line-height: 1.45;">${d}</span>
        </div>
      </div>`).join('')}
    </div>
  </section>`);

// ── 5 · El embudo ────────────────────────────────────────────────────────
// Un embudo de verdad: la silueta se estrecha de izquierda a derecha y cada
// paso es una pregunta. Al final, las tres salidas posibles.
const EMB_W = 1260, EMB_H = 430;
const embudoSVG = () => {
  const y0 = 0, y1 = EMB_H, yc = EMB_H / 2;
  const fin = 120;
  return `<svg data-silueta viewBox="0 0 ${EMB_W} ${EMB_H}" style="position: absolute; left: 0; top: 0; width: ${EMB_W}px; height: ${EMB_H}px; overflow: visible;">
      <defs><linearGradient id="g-emb" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${WASH}"/><stop offset="1" stop-color="${kit.alpha(ACC, 0.22)}"/></linearGradient></defs>
      <path d="M 0 ${y0} L ${EMB_W} ${yc - fin / 2} L ${EMB_W} ${yc + fin / 2} L 0 ${y1} Z" fill="url(#g-emb)"></path>
    </svg>`;
};
slides.push(`
  <section data-label="El embudo" data-screen-label="El embudo" data-speaker-notes="Toda idea pasa por el mismo embudo de cinco pasos. Cada paso responde una pregunta, y al final solo hay tres salidas: validada, pivote o descartada." style="${seccion()}">
    ${header('El método')}
    ${h2('Un embudo de cinco pasos<br>por el que pasa toda idea')}
    <div data-a="up2" style="margin-top: 40px; display: grid; grid-template-columns: ${EMB_W}px 1fr; gap: 40px; align-items: center; flex: 1;">
      <div style="position: relative; width: ${EMB_W}px; height: ${EMB_H}px;">
        ${embudoSVG()}
        <div style="position: absolute; inset: 0; display: grid; grid-template-columns: 150px repeat(5, 1fr); align-items: center; padding: 0 10px 0 22px; gap: 14px;">
          <div data-nodo style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
            <span style="font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Entra</span>
            <span style="font-size: 30px; font-weight: 800; color: ${INK}; letter-spacing: -0.6px;">Idea</span>
          </div>
          ${PASOS.map(p => `
          <div data-nodo style="${CARD} border-radius: 18px; padding: 20px 16px; display: flex; flex-direction: column; gap: 8px; align-items: center; text-align: center;">
            <span style="width: 40px; height: 40px; border-radius: 50%; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800;">${p.n}</span>
            <span style="font-size: 22px; font-weight: 800; color: ${INK}; letter-spacing: -0.3px; line-height: 1.15;">${p.t}</span>
            <span style="font-size: 16.5px; font-weight: 600; color: ${ACC};">${p.p}</span>
          </div>`).join('')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Sale como')}
        ${[['Validada', 'Pasa a planear el MVP', OK, OK_WASH], ['Pivote', 'Regresa al Lean Canvas', WARN, WARN_WASH], ['Descartada', 'Se archiva con el motivo', BAD, BAD_WASH]].map(([t, d, c, w]) => `
        <div data-salida style="background: ${w}; border-left: 5px solid ${c}; border-radius: 0 16px 16px 0; padding: 18px 22px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 6px 16px rgba(28,26,58,0.07);">
          <span style="font-size: 25px; font-weight: 800; color: ${c};">${t}</span>
          <span style="font-size: 18px; color: ${INK}; line-height: 1.35;">${d}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 6 · Paso 1 · Filtros ─────────────────────────────────────────────────
const FILTROS = ['No lugares físicos', 'Nada ilegal', 'Nada polémico ni político', 'La primera prueba cabe en nuestra capacidad'];
const SOCIOS = [
  { n: 'Axl', busca: 'Currículum', tiempo: '5 h por semana', min: 5, max: 5 },
  { n: 'Rodri', busca: 'Experiencia', tiempo: '2 a 3 h diarias', min: 10, max: 21 },
  { n: 'Diego', busca: 'Ingreso secundario', tiempo: '1.5 h diarias', min: 7.5, max: 10.5 },
];
const MAX_H = 21;
slides.push(`
  <section data-label="Paso 1 · Filtros" data-screen-label="1 · Filtros" data-speaker-notes="Los filtros son las reglas que acordamos en la primera sesion. Si una idea no pasa alguno, se descarta sin mas analisis. El ultimo depende de nuestra capacidad, que todavia hay que confirmar." style="${seccion()}">
    ${header('Paso 1', miniEmbudo(1))}
    ${h2('Si no pasa un filtro,<br>se descarta sin más análisis')}
    <div data-a="up2" style="margin-top: 38px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${ceja('Las reglas que acordamos')}
        ${FILTROS.map((f, i) => `
        <div data-filtro style="${CARD} border-radius: 18px; padding: 22px 26px; display: flex; align-items: center; gap: 20px; ${i === 3 ? `border: 2px solid ${ACC};` : ''}">
          <span style="flex: none; width: 46px; height: 46px; border-radius: 13px; background: ${i === 3 ? ACC : BAD_WASH}; color: ${i === 3 ? '#FFFFFF' : BAD}; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800;">${i === 3 ? '⌛' : '✕'}</span>
          <span style="font-size: 27px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px; line-height: 1.2;">${f}</span>
        </div>`).join('')}
      </div>
      <div data-capacidad style="${CARD} border-radius: 24px; padding: 30px 34px; display: flex; flex-direction: column; gap: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          ${ceja('Nuestra capacidad')}${chip('a confirmar', WARN, WARN_WASH)}
        </div>
        <div style="display: flex; align-items: baseline; gap: 14px;">
          <span style="font-size: 76px; font-weight: 800; color: ${ACC}; letter-spacing: -3px; line-height: 1; ${NUM}">22–36 h</span>
          <span style="font-size: 22px; font-weight: 600; color: ${INK};">por semana, entre los tres</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 30px; margin-top: 22px;">
          ${SOCIOS.map(s => `
          <div data-socio style="display: grid; grid-template-columns: 210px 1fr 150px; gap: 16px; align-items: center;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 27px; font-weight: 800; color: ${INK};">${s.n}</span>
              <span style="font-size: 18px; color: ${MUTED};">Busca: ${s.busca}</span>
            </div>
            <div style="position: relative; height: 22px; background: ${SOFT}; border-radius: 6px; box-shadow: inset 0 1px 3px rgba(28,26,58,0.12);">
              <div data-barra style="position: absolute; left: 0; top: 0; bottom: 0; width: ${(s.max / MAX_H * 100).toFixed(1)}%; border-radius: 6px; background: ${kit.alpha(ACC, 0.25)};"></div>
              <div data-barra style="position: absolute; left: 0; top: 0; bottom: 0; width: ${(s.min / MAX_H * 100).toFixed(1)}%; border-radius: 6px; background: linear-gradient(90deg, ${ACC}, ${BRIGHT});"></div>
            </div>
            <span style="font-size: 20px; font-weight: 700; color: ${ACC}; text-align: right; ${NUM}">${s.tiempo}</span>
          </div>`).join('')}
        </div>
        <div style="flex: 1;"></div>
        <span style="font-size: 17.5px; color: ${MUTED}; line-height: 1.45;">El rango depende de si «diario» incluye fines de semana. Las aportaciones de cada quien se confirman en la reunión.</span>
      </div>
    </div>
  </section>`);

// ── 7 · Paso 2 · Lean Canvas ─────────────────────────────────────────────
// La retícula clásica del Lean Canvas; el número de cada bloque es el orden
// de llenado, y la animación los enciende en ese orden, no en el de lectura.
const BLOQUES = {
  segmento: [1, 'Segmento de clientes', '¿Para quién es?'],
  problema: [2, 'Problema', '¿Qué les duele y cómo lo resuelven hoy?'],
  pvu: [3, 'Propuesta de valor única', '¿Por qué nos elegirían?'],
  solucion: [4, 'Solución', 'Las 3 funciones mínimas'],
  canales: [5, 'Canales', '¿Cómo llegamos a ellos?'],
  ingresos: [6, 'Fuentes de ingreso', '¿Quién paga y cuánto?'],
  costos: [7, 'Estructura de costos', '¿Qué nos cuesta operarla?'],
  metricas: [8, 'Métricas clave', '¿Qué número dice que va bien?'],
  ventaja: [9, 'Ventaja injusta', '¿Qué no se puede copiar?'],
};
const bloque = (k, area, destacado = false) => {
  const [n, t, p] = BLOQUES[k];
  return `
        <div data-bloque data-orden="${n}" style="grid-area: ${area}; ${CARD} border-radius: 16px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; ${destacado ? `border: 2px solid ${ACC}; background: linear-gradient(180deg, ${WASH} 0%, #FFFFFF 100%);` : ''}">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="flex: none; width: 30px; height: 30px; border-radius: 50%; background: ${destacado ? ACC : WASH}; color: ${destacado ? '#FFFFFF' : ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800;">${n}</span>
            <span style="font-size: 20px; font-weight: 800; color: ${INK}; letter-spacing: -0.3px; line-height: 1.15;">${t}</span>
          </div>
          <span style="font-size: 16.5px; color: ${MUTED}; line-height: 1.35;">${p}</span>
        </div>`;
};
slides.push(`
  <section data-label="Paso 2 · Lean Canvas" data-screen-label="2 · Lean Canvas" data-speaker-notes="El Lean Canvas, de Ash Maurya, resume una idea en nueve bloques en una sola pagina. Se llena en el orden de los numeros, empezando por el cliente y el problema. Maximo 45 minutos, y lo que no sabemos se escribe como no sabemos." style="${seccion()}">
    ${header('Paso 2', miniEmbudo(2))}
    ${h2('Lean Canvas: la idea<br>en una sola página')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1fr 380px; gap: 30px; flex: 1;">
      <div data-canvas style="display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: 1fr 1fr 0.8fr; gap: 12px;
        grid-template-areas: 'pr pr so so pv pv ve ve se se' 'pr pr me me pv pv ca ca se se' 'co co co co co in in in in in';">
        ${bloque('problema', 'pr')}
        ${bloque('solucion', 'so')}
        ${bloque('metricas', 'me')}
        ${bloque('pvu', 'pv', true)}
        ${bloque('ventaja', 've')}
        ${bloque('canales', 'ca')}
        ${bloque('segmento', 'se')}
        ${bloque('costos', 'co')}
        ${bloque('ingresos', 'in')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div data-regla style="${kit.fondo(ACC, puntosClaro(26))} border-radius: 22px; padding: 28px 28px; color: #FFFFFF; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 18px 40px ${kit.alpha(ACC, 0.28)};">
          <span data-cuenta="45" data-sufijo=" min" style="font-size: 78px; font-weight: 800; letter-spacing: -3px; line-height: 1; ${NUM}">45 min</span>
          <span style="font-size: 21px; font-weight: 600; line-height: 1.35;">como máximo por idea</span>
        </div>
        <div data-regla style="${CARD} border-radius: 22px; padding: 26px 26px; display: flex; flex-direction: column; gap: 12px;">
          ${ceja('Si algo no se sabe')}
          <span style="font-size: 30px; font-weight: 800; color: ${INK}; letter-spacing: -0.5px;">se escribe «no sabemos»</span>
          <span style="font-size: 19px; color: ${MUTED}; line-height: 1.45;">Cada hueco se vuelve un supuesto por probar en el paso 4.</span>
        </div>
        <span data-regla style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">Creado por Ash Maurya para startups: pone el foco en el problema y en lo que todavía no sabemos.</span>
      </div>
    </div>
  </section>`);

// ── 8 · Paso 3 · ICE ─────────────────────────────────────────────────────
const ICE = [
  ['I', 'Impacto', 'Si funciona, ¿qué tan grande es?', ACC, WASH],
  ['C', 'Confianza', '¿Qué evidencia tenemos?', TEAL, TEAL_WASH],
  ['E', 'Facilidad', '¿Qué tan rápido y barato lo probamos?', ROSA, ROSA_WASH],
];
const escalaICE = () => `
        <div data-escala style="position: relative; padding-top: 34px;">
          <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px;">
            ${Array.from({ length: 10 }, (_, i) => `<div data-celda style="height: 44px; border-radius: 9px; background: ${i >= 5 ? `linear-gradient(180deg, ${BRIGHT}, ${ACC})` : SOFT}; color: ${i >= 5 ? '#FFFFFF' : MUTED}; display: flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800; ${i >= 5 ? '' : `box-shadow: inset 0 1px 3px rgba(28,26,58,0.1);`} ${NUM}">${i + 1}</div>`).join('')}
          </div>
          <div data-umbral style="position: absolute; top: 0; left: calc(50% + 3px); display: flex; align-items: center; gap: 8px;">
            <span style="width: 3px; height: 92px; background: ${INK}; border-radius: 2px; position: absolute; top: 0; left: -2px;"></span>
            <span style="margin-left: 12px; font-size: 17px; font-weight: 800; color: ${INK}; white-space: nowrap;">avanza con 6 o más</span>
          </div>
        </div>`;
slides.push(`
  <section data-label="Paso 3 · ICE" data-screen-label="3 · ICE" data-speaker-notes="ICE califica cada idea del uno al diez en tres criterios. El puntaje es el promedio de los tres, y luego el promedio entre socios. Avanzan las de seis o mas, hasta llenar los tres lugares de validacion." style="${seccion()}">
    ${header('Paso 3', miniEmbudo(3))}
    ${h2('ICE: tres calificaciones<br>del 1 al 10 por idea')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;">
      ${ICE.map(([l, t, p, c, w]) => `
      <div data-letra style="${CARD} border-radius: 24px; padding: 26px 28px; display: grid; grid-template-columns: 92px 1fr; gap: 20px; align-items: center; border-top: 5px solid ${c};">
        <span style="width: 92px; height: 92px; border-radius: 22px; background: ${w}; color: ${c}; display: inline-flex; align-items: center; justify-content: center; font-size: 60px; font-weight: 800;">${l}</span>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 30px; font-weight: 800; color: ${INK}; letter-spacing: -0.5px;">${t}</span>
          <span style="font-size: 19px; color: ${MUTED}; line-height: 1.4;">${p}</span>
        </div>
      </div>`).join('')}
    </div>
    <div data-a="up3" style="margin-top: 26px; display: grid; grid-template-columns: 1.05fr 1fr; gap: 26px; flex: 1;">
      <div data-formula style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        ${ceja('El puntaje')}
        <div style="display: flex; align-items: center; gap: 14px; font-size: 44px; font-weight: 800; color: ${INK}; flex-wrap: wrap; letter-spacing: -1px;">
          <span>(</span><span style="color: ${ACC};">I</span><span style="color: ${MUTED};">+</span><span style="color: ${TEAL};">C</span><span style="color: ${MUTED};">+</span><span style="color: ${ROSA};">E</span><span>) ÷ 3</span>
          <span style="color: ${MUTED}; font-weight: 600;">→</span>
          <span style="font-size: 30px; letter-spacing: -0.4px;">promedio entre socios</span>
        </div>
        ${escalaICE()}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${ceja('Las reglas')}
        ${[['Se califica en secreto', 'y se revela al mismo tiempo, para no influirnos.'],
           ['4 puntos o más de diferencia', 'en un criterio: se discute antes de promediar.'],
           ['Siempre la misma rúbrica', 'para que un «7» signifique lo mismo para todos.'],
           ['Hasta 3 lugares de validación', 'avanzan las mejores de 6 o más hasta llenarlos.']].map(([a, b]) => `
        <div data-reglaice style="display: flex; gap: 14px; align-items: baseline; padding: 14px 20px; border-radius: 14px; background: ${SOFT};">
          <span style="flex: none; width: 9px; height: 9px; border-radius: 50%; background: ${ACC}; transform: translateY(-3px);"></span>
          <span style="font-size: 20.5px; color: ${MUTED}; line-height: 1.4;">${fuerte(`<span style="color: ${INK};">${a}</span>`)} ${b}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 9 · La rúbrica ICE ───────────────────────────────────────────────────
const RUBRICA = [
  ['1–3', 'Problema menor o mercado pequeño', 'Solo intuición', 'Más de 6 meses o mucho capital'],
  ['4–6', 'Problema real pero no urgente', 'Opiniones o competencia que lo valida', 'De 3 a 6 meses o inversión moderada'],
  ['7–8', 'Problema doloroso: ya pagan por resolverlo', '5 o más entrevistas lo confirman', 'Un MVP en menos de un mes'],
  ['9–10', 'Problema urgente en un mercado grande', 'Alguien ya pagó o se registró', 'Se prueba esta semana, sin dinero'],
];
slides.push(`
  <section data-label="La rúbrica" data-screen-label="3 · Rúbrica" data-speaker-notes="La rubrica es lo que hace que un siete signifique lo mismo para los tres. Fijense en confianza: para pasar de seis hacen falta entrevistas, no opiniones." style="${seccion()}">
    ${header('Paso 3', miniEmbudo(3))}
    ${h2('La rúbrica: qué significa<br>cada calificación')}
    <div data-a="up2" style="margin-top: 32px; ${CARD} border-radius: 24px; overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div style="display: grid; grid-template-columns: 150px repeat(3, 1fr); background: ${SOFT}; border-bottom: 1px solid ${LINE};">
        <span style="padding: 20px 26px; font-size: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Puntaje</span>
        ${ICE.map(([l, t, , c]) => `<span style="padding: 20px 26px; font-size: 22px; font-weight: 800; color: ${c}; display: flex; align-items: center; gap: 10px;"><span style="font-size: 16px; width: 30px; height: 30px; border-radius: 9px; background: ${kit.alpha(c, 0.12)}; display: inline-flex; align-items: center; justify-content: center;">${l}</span>${t}</span>`).join('')}
      </div>
      ${RUBRICA.map(([p, i, c, e], k) => `
      <div data-fila-r style="flex: 1; display: grid; grid-template-columns: 150px repeat(3, 1fr); align-items: center; ${k < RUBRICA.length - 1 ? `border-bottom: 1px solid ${LINE};` : ''} ${k >= 2 ? `background: ${kit.alpha(ACC, 0.035 * (k - 1))};` : ''}">
        <span style="padding: 0 26px; font-size: 36px; font-weight: 800; color: ${k >= 2 ? ACC : MUTED}; letter-spacing: -1px; ${NUM}">${p}</span>
        ${[i, c, e].map(t => `<span style="padding: 0 26px; font-size: 21px; color: ${INK}; line-height: 1.4;">${t}</span>`).join('')}
      </div>`).join('')}
    </div>
    <div style="margin-top: 22px;">${nota(`Para pasar de 6 en ${fuerte('Confianza')} hacen falta entrevistas, no opiniones: ${fuerte('la evidencia sube la nota, el entusiasmo no')}.`, TEAL)}</div>
  </section>`);

// ── 10 · Paso 4 · Mapa de supuestos ──────────────────────────────────────
const TIPOS = [
  ['Deseabilidad', '¿Lo quieren?', ACC, WASH],
  ['Viabilidad', '¿Es negocio?', TEAL, TEAL_WASH],
  ['Factibilidad', '¿Podemos hacerlo?', ROSA, ROSA_WASH],
];
const celda = (titulo, sub, estilo, extra = '') =>
  `<div data-cuadrante style="border-radius: 20px; padding: 26px 28px; display: flex; flex-direction: column; justify-content: center; gap: 8px; ${estilo}">${extra}
          <span style="font-size: 34px; font-weight: 800; letter-spacing: -0.8px;">${titulo}</span>
          <span style="font-size: 19px; line-height: 1.4; opacity: 0.85;">${sub}</span>
        </div>`;
slides.push(`
  <section data-label="Paso 4 · Supuestos" data-screen-label="4 · Supuestos" data-speaker-notes="El mapa de supuestos hace explicito lo que estamos dando por hecho. Se acomodan por importancia y evidencia, y se prueban primero los muy importantes con poca evidencia: si son falsos, la idea se cae." style="${seccion()}">
    ${header('Paso 4', miniEmbudo(4))}
    ${h2('Mapa de supuestos: probar primero<br>lo que puede tumbar la idea')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 470px 1fr; gap: 40px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${ceja('1 · Escribir los supuestos en tres tipos')}
        ${TIPOS.map(([t, p, c, w]) => `
        <div data-tipo style="${CARD} border-radius: 18px; padding: 20px 24px; display: flex; align-items: center; gap: 18px; border-left: 5px solid ${c};">
          <span style="flex: none; width: 14px; height: 14px; border-radius: 4px; background: ${c};"></span>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 26px; font-weight: 800; color: ${INK};">${t}</span>
            <span style="font-size: 20px; font-weight: 600; color: ${c};">${p}</span>
          </div>
        </div>`).join('')}
        <div style="flex: 1;"></div>
        <span style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">Técnica de Lean UX (Gothelf y Seiden), refinada por David Bland de Strategyzer.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${ceja('2 · Ubicarlos en la matriz')}
        <div style="flex: 1; display: grid; grid-template-columns: 54px 1fr 1fr; grid-template-rows: 1fr 1fr 40px; gap: 14px;">
          <span style="writing-mode: vertical-rl; transform: rotate(180deg); justify-self: center; align-self: center; font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Muy importante</span>
          ${celda('Probar ya', 'Si son falsos, la idea se cae. Van primero.', `background: linear-gradient(135deg, ${ACC}, ${BRIGHT}); color: #FFFFFF; box-shadow: 0 18px 40px ${kit.alpha(ACC, 0.32)}; position: relative;`, `<span data-pulso style="position: absolute; inset: -6px; border-radius: 24px; border: 3px solid ${kit.alpha(ACC, 0.45)};"></span>`)}
          ${celda('Planear', 'Ya hay evidencia: se toman en cuenta al diseñar.', `${CARD} color: ${INK};`)}
          <span style="writing-mode: vertical-rl; transform: rotate(180deg); justify-self: center; align-self: center; font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Poco importante</span>
          ${celda('Después', 'No urgen: se revisan cuando avance la idea.', `background: ${SOFT}; color: ${INK}; border: 1px dashed ${LINE};`)}
          ${celda('Ignorar', 'Ni importan ni hay duda.', `background: ${SOFT}; color: ${MUTED}; border: 1px dashed ${LINE};`)}
          <span></span>
          <span style="text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Poca evidencia</span>
          <span style="text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Mucha evidencia</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 11 · Paso 5 · Tarjetas ───────────────────────────────────────────────
const hueco = (t, c = ACC) => `<span style="color: ${c}; font-weight: 700; border-bottom: 2.5px solid ${kit.alpha(c, 0.45)}; padding: 0 2px;">${t}</span>`;
const tarjeta = (titulo, cuando, color, frases) => `
        <div data-tarjeta style="${CARD} border-radius: 24px; padding: 30px 34px; display: flex; flex-direction: column; gap: 14px; border-top: 6px solid ${color}; background-image: repeating-linear-gradient(180deg, transparent 0 47px, ${kit.alpha(color, 0.07)} 47px 48px); background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 32px; font-weight: 800; color: ${INK}; letter-spacing: -0.6px;">${titulo}</span>
            ${chip(cuando, color, kit.alpha(color, 0.1))}
          </div>
          ${frases.map(f => `<span data-frase style="font-size: 26px; color: ${INK}; line-height: 1.55;">${f}</span>`).join('')}
        </div>`;
slides.push(`
  <section data-label="Paso 5 · Tarjetas" data-screen-label="5 · Tarjetas" data-speaker-notes="Las tarjetas del libro Testing Business Ideas. La Test Card obliga a escribir el criterio de exito antes de ver los resultados, y la Learning Card registra que aprendimos y que decidimos." style="${seccion()}">
    ${header('Paso 5', miniEmbudo(5))}
    ${h2('El criterio de éxito se escribe<br>antes de ver los resultados')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px;">
      ${tarjeta('Test Card', 'antes', ACC, [
        `Creemos que ${hueco('[supuesto]')}.`,
        `Para verificarlo haremos ${hueco('[experimento]')}.`,
        `Mediremos ${hueco('[métrica]')}.`,
        `Tenemos razón si ${hueco('[criterio con número]')}.`,
      ])}
      ${tarjeta('Learning Card', 'después', TEAL, [
        `Creíamos que ${hueco('[supuesto]', TEAL)}.`,
        `Observamos ${hueco('[resultado]', TEAL)}.`,
        `Aprendimos que ${hueco('[conclusión]', TEAL)}.`,
        `Por lo tanto ${hueco('[continuar / pivotar / descartar]', TEAL)}.`,
      ])}
    </div>
    <div data-a="up3" style="margin-top: 26px; display: flex; flex-direction: column; gap: 12px;">
      ${ceja('Experimentos baratos')}
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        ${['Entrevistas', 'Landing con lista de espera', 'Preventa', 'Servicio manual', 'Anuncio pequeño en redes', 'Prototipo en papel o Figma'].map(e => `<span data-exp style="${CARD} border-radius: 999px; padding: 12px 24px; font-size: 20px; font-weight: 700; color: ${INK};">${e}</span>`).join('')}
      </div>
    </div>
    <div style="flex: 1;"></div>
    ${nota(`Fuente: ${fuerte('Testing Business Ideas')} (Strategyzer). La decisión al final es una de tres: ${fuerte('validada')}, ${fuerte('pivote')} o ${fuerte('descartada')}.`, TEAL)}
  </section>`);

// ── 12 · Plataformas ─────────────────────────────────────────────────────
const PLATAFORMAS = [
  { n: 'Notion', r: 'El expediente', d: 'Una página por idea con la plantilla de propuesta, la guía del método y la de reuniones. Todo dentro del espacio DRA.', c: ACC },
  { n: 'Miro', r: 'El tablero visual', d: 'El pipeline con un sticky por idea, el Lean Canvas, la rúbrica ICE, el mapa de supuestos y las tarjetas.', c: TEAL },
  { n: 'Claude', r: 'El asistente', d: 'Conectado a los dos: redacta propuestas, investiga mercado y competencia y actualiza ambos tableros.', c: ROSA },
  { n: 'Plataforma propia', r: 'Más adelante', d: 'Cuando el proceso esté probado, la construimos con lo aprendido, con su propia conexión a IA.', c: MUTED, futuro: true },
];
slides.push(`
  <section data-label="Plataformas" data-screen-label="Plataformas" data-speaker-notes="Notion es donde escribimos, Miro es donde vemos. Las herramientas de gestion de ideas del mercado estan pensadas para empresas grandes; estas son flexibles, tienen plan gratuito y se pueden operar desde Claude." style="${seccion()}">
    ${header('Plataformas')}
    ${h2('Notion es donde escribimos,<br>Miro es donde vemos')}
    <div data-a="up2" style="margin-top: 38px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; flex: 1;">
      ${PLATAFORMAS.map(p => `
      <div data-plat style="${p.futuro ? `background: ${SOFT}; border: 2px dashed ${LINE};` : `${CARD} border-top: 5px solid ${p.c};`} border-radius: 24px; padding: 34px 32px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px;">
        <span style="width: 96px; height: 96px; border-radius: 26px; background: ${p.futuro ? '#FFFFFF' : kit.alpha(p.c, 0.12)}; color: ${p.c}; display: inline-flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 800; ${p.futuro ? `border: 2px dashed ${LINE};` : ''}">${p.n[0]}</span>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 42px; font-weight: 800; color: ${p.futuro ? MUTED : INK}; letter-spacing: -1px; line-height: 1.08;">${p.n}</span>
          <span style="font-size: 19px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: ${p.c};">${p.r}</span>
          <span style="font-size: 21px; color: ${MUTED}; line-height: 1.5;">${p.d}</span>
        </div>
      </div>`).join('')}
    </div>
    <div style="margin-top: 26px;">${nota(`${fuerte('Por qué estas y no otras:')} Brightidea, Qmarkets o IdeaScale están pensadas para empresas grandes. Notion y Miro son flexibles, tienen plan gratuito y se pueden operar desde Claude.`)}</div>
  </section>`);

// ── 13 · Cómo registramos una idea ───────────────────────────────────────
// El pipeline de Miro con un sticky que lo recorre: entra en «Idea cruda» y
// se detiene en «En validación», que es hasta donde llega por el método.
const COLUMNAS = [['Idea cruda', MUTED], ['Lean Canvas', ACC], ['Priorizada', ACC], ['En validación', ACC], ['Validada', OK], ['Descartada', BAD]];
const COL_W = 262, COL_GAP = 16;
const REGISTRO = [
  ['Se captura', 'como sticky en «Idea cruda» del pipeline en Miro.'],
  ['Se revisa contra los filtros', 'si no pasa, va a «Descartada» con el motivo.'],
  ['El responsable llena la plantilla', 'en Notion: ficha, filtros, mercado, competencia, Canvas, supuestos y Test Card.'],
  ['En la reunión', 'se califica con ICE.'],
  ['El sticky avanza', 'en Miro conforme pasa cada etapa.'],
  ['Cada prueba deja su Learning Card', 'en la página de Notion de la idea.'],
];
slides.push(`
  <section data-label="Registro" data-screen-label="Registro" data-speaker-notes="Asi viaja una idea: nace como sticky en Miro, se documenta en Notion y avanza por las columnas del pipeline hasta que se valida o se descarta." style="${seccion()}">
    ${header('Registro')}
    ${h2('Así viaja una idea por el pipeline')}
    <div data-a="up2" data-pipeline style="position: relative; margin-top: 34px; display: grid; grid-template-columns: repeat(6, ${COL_W}px); gap: ${COL_GAP}px; height: 360px;">
      ${COLUMNAS.map(([t, c], i) => `
      <div data-col style="background: ${i >= 4 ? kit.alpha(c, 0.07) : SOFT}; border-radius: 18px; padding: 18px 18px; display: flex; flex-direction: column; gap: 12px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(28,26,58,0.06); border-top: 4px solid ${c};">
        <span style="font-size: 17px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: ${c};">${t}</span>
        ${i === 0 ? `<div style="height: 64px; border-radius: 6px; background: #FFF6B8; opacity: 0.55; transform: rotate(2deg);"></div><div style="height: 64px; border-radius: 6px; background: #FFF6B8; opacity: 0.4; transform: rotate(-1.5deg);"></div>` : ''}
        ${i === 2 ? `<div style="height: 64px; border-radius: 6px; background: #FFF6B8; opacity: 0.5; transform: rotate(-2deg);"></div>` : ''}
        ${i === 5 ? `<div style="height: 64px; border-radius: 6px; background: #EDEDED; opacity: 0.8; transform: rotate(1.5deg); display: flex; align-items: center; justify-content: center; font-size: 15px; color: ${MUTED}; font-weight: 700;">con el motivo</div>` : ''}
      </div>`).join('')}
      <div data-sticky data-paso-col="${3 * (COL_W + COL_GAP)}" style="position: absolute; left: ${3 * (COL_W + COL_GAP) + 18}px; top: 70px; width: ${COL_W - 36}px; height: 170px; border-radius: 8px; background: linear-gradient(180deg, #FFF07A, #FFE34D); box-shadow: 0 2px 3px rgba(28,26,58,0.18), 0 16px 28px rgba(28,26,58,0.18); transform: rotate(-2deg); padding: 16px 18px; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px;">
        <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(28,26,58,0.6);">Tu idea</span>
        <span style="font-size: 21px; font-weight: 800; color: ${INK}; line-height: 1.2;">con dueño y Test Card con fecha</span>
      </div>
    </div>
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; flex: 1;">
      ${REGISTRO.map(([t, d], i) => `
      <div data-reg style="${CARD} border-radius: 18px; padding: 24px 22px; display: flex; flex-direction: column; gap: 12px;">
        <span style="width: 46px; height: 46px; border-radius: 50%; background: ${WASH}; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 800;">${i + 1}</span>
        <span style="font-size: 24px; font-weight: 800; color: ${INK}; line-height: 1.2; letter-spacing: -0.4px;">${t}</span>
        <span style="font-size: 19px; color: ${MUTED}; line-height: 1.45;">${d}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 14 · La reunión de propuestas ────────────────────────────────────────
const AGENDA = [
  [0, 5, 'Inicio', 'Objetivo, reglas y roles'],
  [5, 50, 'Rondas', '5 min de presentación + 4 de preguntas por idea'],
  [50, 60, 'ICE', 'En secreto'],
  [60, 75, 'Supuestos', 'De las 3 mejores'],
  [75, 85, 'Test Cards', 'Con dueño y fecha'],
  [85, 90, 'Cierre', ''],
];
const AG_W = 1720;
slides.push(`
  <section data-label="La reunión" data-screen-label="La reunión" data-speaker-notes="La reunion de propuestas dura noventa minutos. Se sale con cada idea calificada y maximo tres en validacion, cada una con dueno y Test Card con fecha. Lo importante es lo que pasa antes: todos leen las propuestas 48 horas antes." style="${seccion()}">
    ${header('Ritmo de trabajo', pill('90 min', WASH, ACC))}
    ${h2('La reunión de propuestas: se sale con<br>máximo 3 ideas, cada una con dueño')}
    <div data-a="up2" data-agenda style="margin-top: 40px; position: relative; height: 150px;">
      ${AGENDA.map(([a, b, t, d], i) => {
        const x = a / 90 * AG_W, w = (b - a) / 90 * AG_W - 6;
        const angosto = w < 150;
        return `
      <div data-bloque-ag style="position: absolute; left: ${x.toFixed(1)}px; top: 0; width: ${w.toFixed(1)}px; height: 96px; border-radius: 16px; background: ${i === 1 ? `linear-gradient(90deg, ${ACC}, ${BRIGHT})` : i === 2 ? TEAL : i === 4 ? ROSA : kit.alpha(ACC, 0.18 + i * 0.04)}; color: ${i === 1 || i === 2 || i === 4 ? '#FFFFFF' : INK}; display: flex; flex-direction: column; justify-content: center; padding: 0 ${angosto ? 8 : 18}px; box-sizing: border-box; overflow: hidden; box-shadow: 0 8px 18px rgba(28,26,58,0.1);">
        <span style="font-size: ${angosto ? 17 : 24}px; font-weight: 800; white-space: nowrap; ${angosto ? 'text-align: center;' : ''}">${t}</span>
        ${!angosto && d ? `<span style="font-size: 17px; font-weight: 600; opacity: 0.85; white-space: nowrap;">${d}</span>` : ''}
      </div>
      <span style="position: absolute; left: ${x.toFixed(1)}px; top: 110px; font-size: 16px; font-weight: 700; color: ${MUTED}; ${NUM}">${a}′</span>`;
      }).join('')}
      <span style="position: absolute; right: 0; top: 110px; font-size: 16px; font-weight: 700; color: ${MUTED}; ${NUM}">90′</span>
    </div>
    <div data-a="up3" style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px; flex: 1;">
      ${[['Antes', 'cada quien, en casa', ACC, [
          'Cada socio toma 2 ideas del pizarrón.',
          'Llena una propuesta de una página: unos 60 min más 30 de investigación.',
          `La publica en Notion ${fuerte('48 horas antes')}. Todos leen antes de llegar.`]],
         ['Durante', 'roles que rotan', TEAL, [
          `${fuerte('Facilitador:')} cuida el tiempo.`,
          `${fuerte('Escriba:')} actualiza Notion y Miro en vivo.`,
          `${fuerte('Guion de 5 min:')} problema, idea, mercado, diferenciador, supuestos y qué le pido al equipo.`]],
         ['Después', 'para no perder nada', ROSA, [
          `En ${fuerte('24 horas')}: pipeline e ICE actualizados.`,
          `En ${fuerte('máximo 2 semanas')}: cada dueño corre su prueba.`,
          'En la siguiente reunión: Learning Cards y decisiones.']]].map(([t, s, c, items]) => `
      <div data-momento style="${CARD} border-radius: 22px; padding: 30px 32px; display: flex; flex-direction: column; gap: 18px; border-top: 5px solid ${c};">
        <div style="display: flex; align-items: baseline; gap: 12px;">
          <span style="font-size: 36px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px;">${t}</span>
          <span style="font-size: 19px; font-weight: 600; color: ${c};">${s}</span>
        </div>
        ${items.map(it => `
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="flex: none; margin-top: 12px; width: 8px; height: 8px; border-radius: 50%; background: ${c};"></span>
          <span style="font-size: 22px; color: ${MUTED}; line-height: 1.45;">${it}</span>
        </div>`).join('')}
      </div>`).join('')}
    </div>
  </section>`);

// ── 15 · Ejemplo: Pádel SoloQ, la investigación ──────────────────────────
const dato = (v, t, color = ACC, cuenta = null) => `
          <div data-dato style="display: flex; flex-direction: column; gap: 4px;">
            <span ${cuenta != null ? `data-cuenta="${cuenta}" ` : ''}style="font-size: 76px; font-weight: 800; color: ${color}; letter-spacing: -3px; line-height: 1; ${NUM}">${v}</span>
            <span style="font-size: 21px; color: ${MUTED}; line-height: 1.35;">${t}</span>
          </div>`;
slides.push(`
  <section data-label="Pádel · lo que encontramos" data-screen-label="Pádel · investigación" data-speaker-notes="La idea mas desarrollada del pizarron: una web tipo SoloQ para padel. Al investigar salieron dos cosas: el mercado crece, pero la idea ya existe. Playtomic ya hace ranking y nivel de jugador." style="${seccion()}">
    ${header('Ejemplo', pill('Pádel SoloQ', WASH, ACC))}
    ${h2('Pádel SoloQ: el mercado crece,<br>pero la idea ya existe')}
    ${bajada('Una web tipo SoloQ para pádel, con ranking, torneos y highlights. Es la idea más desarrollada del pizarrón.')}
    <div data-a="up3" style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; flex: 1;">
      <div data-lado style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; border-top: 5px solid ${OK};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('El mercado crece', OK)}<span style="font-size: 16px; color: ${MUTED};">Federación Internacional de Pádel</span></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px 20px;">
          ${dato('320+', 'clubes en México', OK)}
          ${dato('~1,500', 'canchas', OK)}
          ${dato('300 mil+', 'jugadores amateurs', OK)}
          ${dato('1 millón+', 'practicantes en 2025', OK)}
        </div>
      </div>
      <div data-lado style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; border-top: 5px solid ${BAD};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('Pero ya existe', BAD)}<span style="font-size: 16px; color: ${MUTED};">Playtomic, el líder</span></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px 20px;">
          ${dato('6,000', 'clubes', BAD)}
          ${dato('1.5 M', 'jugadores activos al mes', BAD)}
        </div>
        <span style="font-size: 22px; color: ${INK}; line-height: 1.45;">Ya calcula el nivel de cada jugador. Y hay más con ranking y torneos:</span>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${['MatchBall (mexicana)', 'PADELBLAST', 'SliceWin'].map(c => chip(c, BAD, BAD_WASH)).join('')}
        </div>
      </div>
    </div>
    <div style="margin-top: 22px;">${nota(`${fuerte('Lo que eso significa:')} la idea solo tiene sentido si encontramos un diferenciador. Y lo descubrimos ${fuerte('antes de escribir una línea de código')}.`)}</div>
  </section>`);

// ── 16 · Ejemplo: Pádel SoloQ, cómo lo probamos ──────────────────────────
const puntos = (total, exito, color) => `
            <div style="display: flex; gap: 8px;">
              ${Array.from({ length: total }, (_, i) => `<span data-punto style="width: 30px; height: 30px; border-radius: 50%; background: ${i < exito ? color : SOFT}; ${i < exito ? '' : `box-shadow: inset 0 1px 3px rgba(28,26,58,0.15);`}"></span>`).join('')}
            </div>`;
slides.push(`
  <section data-label="Pádel · cómo lo probamos" data-screen-label="Pádel · prueba" data-speaker-notes="La hipotesis de diferenciador y dos pruebas baratas para el riesgo principal. Primero entrevistas, luego una liga manual con una hoja de calculo y el chat del grupo, sin programar nada." style="${seccion()}">
    ${header('Ejemplo', pill('Pádel SoloQ', WASH, ACC))}
    ${h2('En vez de programar,<br>dos pruebas baratas')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 460px 1fr 1fr; gap: 24px; flex: 1;">
      <div data-hipo style="${kit.fondo(ACC, puntosClaro(26), kit.lavado({ color: BRIGHT, en: '85% 8%', ancho: 90, alto: 70, fuerza: 0.6, alcance: 60 }))} border-radius: 24px; padding: 32px 30px; color: #FFFFFF; display: flex; flex-direction: column; gap: 18px; box-shadow: 0 18px 40px ${kit.alpha(ACC, 0.3)};">
        <span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: rgba(255,255,255,0.75);">Hipótesis de diferenciador</span>
        ${['Temporadas y divisiones visibles, como en los videojuegos competitivos.', 'Ligas pensadas para grupos de amigos, no para clubes.', 'Perfil del jugador compartible y, más adelante, highlights.'].map((t, i) => `
        <div data-hip style="display: flex; gap: 14px; align-items: flex-start;">
          <span style="flex: none; width: 34px; height: 34px; border-radius: 10px; background: rgba(255,255,255,0.16); display: inline-flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 800;">${i + 1}</span>
          <span style="font-size: 22px; font-weight: 600; line-height: 1.4;">${t}</span>
        </div>`).join('')}
      </div>
      <div data-prueba style="${CARD} border-radius: 24px; padding: 30px 30px; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${TEAL};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('Prueba 1 · Entrevistas', TEAL)}${chip('2 semanas', TEAL, TEAL_WASH)}</div>
        <span style="font-size: 30px; font-weight: 800; color: ${INK}; line-height: 1.25; letter-spacing: -0.5px;">10 jugadores y 5 organizadores</span>
        <div style="flex: 1;"></div>
        ${ceja('Éxito si dicen que lo usarían', MUTED)}
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 18px; font-weight: 700; color: ${INK};">6 de 10 jugadores</span>
          ${puntos(10, 6, TEAL)}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 18px; font-weight: 700; color: ${INK};">3 de 5 organizadores</span>
          ${puntos(5, 3, TEAL)}
        </div>
      </div>
      <div data-prueba style="${CARD} border-radius: 24px; padding: 30px 30px; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${ROSA};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('Prueba 2 · Liga manual', ROSA)}${chip('4 semanas', ROSA, ROSA_WASH)}</div>
        <span style="font-size: 30px; font-weight: 800; color: ${INK}; line-height: 1.25; letter-spacing: -0.5px;">Un grupo real, una hoja de cálculo y el ranking semanal en su chat</span>
        <div style="flex: 1;"></div>
        ${ceja('Éxito si', MUTED)}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;"><span style="font-size: 18px; font-weight: 700; color: ${INK};">Reportan sus partidos</span><span data-cuenta="70" data-sufijo=" %" style="font-size: 26px; font-weight: 800; color: ${ROSA}; ${NUM}">70 %</span></div>
          <div style="height: 16px; background: ${SOFT}; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(28,26,58,0.12);"><div data-barra style="width: 70%; height: 100%; border-radius: 6px; background: linear-gradient(90deg, ${ROSA}, #E06BBF);"></div></div>
        </div>
        <span style="font-size: 18px; font-weight: 700; color: ${INK};">y piden una segunda temporada</span>
      </div>
    </div>
    <div style="margin-top: 22px;">${nota(`Ese es el valor del método: ${fuerte('descubrimos la competencia y diseñamos una prueba barata para el riesgo principal')}, sin escribir código.`, OK)}</div>
  </section>`);

// ── 17 · Lo que necesitamos acordar · con data-step ──────────────────────
const ACUERDOS = [
  ['¿Adoptamos este método como estándar?', 'El método'],
  ['¿Están bien los números iniciales?', 'ICE de 6 o más · máximo 3 ideas en validación · pruebas de máximo 2 semanas'],
  ['¿Los montos del pizarrón eran aportación mensual?', 'La capacidad'],
  ['¿Quién toma cada una de las 6 ideas?', 'Los dueños'],
  ['¿Cuándo es la reunión de propuestas?', 'La fecha'],
];
slides.push(`
  <section data-label="Lo que necesitamos acordar" data-screen-label="Acuerdos" data-speaker-notes="Cinco preguntas para cerrar hoy. Se revelan una por una con la flecha." style="${seccion()}">
    ${header('Acuerdos', pill('5 preguntas', WASH, ACC))}
    ${h2('Lo que necesitamos acordar hoy')}
    <div data-a="up2" style="margin-top: 36px; display: flex; flex-direction: column; gap: 14px; flex: 1;">
      ${ACUERDOS.map(([q, s], i) => `
      <div data-acuerdo data-step="${i + 1}" style="${CARD} border-radius: 20px; padding: 22px 30px; display: grid; grid-template-columns: 64px 1fr auto; gap: 24px; align-items: center;">
        <span style="width: 64px; height: 64px; border-radius: 18px; background: ${WASH}; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800;">${i + 1}</span>
        <span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.6px; line-height: 1.2;">${q}</span>
        <span style="font-size: 18px; font-weight: 600; color: ${MUTED}; text-align: right; max-width: 520px; line-height: 1.4;">${s}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 18 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="En una frase: toda idea se escribe, se compara con la misma regla y se prueba barato antes de construir. El siguiente paso es la reunion de propuestas." style="${FONDO_COLOR('15% 90%', '90% 5%')} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${orbes([
      'right: -90px; top: -90px; width: 540px; height: 540px; border-radius: 50%; background: rgba(255,255,255,0.06);',
      'left: 40%; bottom: -260px; width: 520px; height: 520px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.09);',
    ])}
    <span data-a="up" style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">En una frase</span>
    <h2 data-split style="margin: 26px 0 0; font-size: 84px; font-weight: 800; letter-spacing: -3px; line-height: 1.05; max-width: 1560px;">Toda idea se escribe, se compara<br>igual y se prueba barato</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 28px; font-weight: 400; color: rgba(255,255,255,0.84); line-height: 1.55; max-width: 1200px;">Descartar también es avanzar, siempre que quede escrito por qué. El siguiente paso es la reunión de propuestas.</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Filtros')}${pill('Lean Canvas')}${pill('ICE')}${pill('Supuestos')}${pill('Tarjetas')}${pill('Siguiente: reunión de propuestas', '#FFFFFF', ACC)}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DRA · Del pizarrón a la evidencia</title>
${kit.og({ titulo: 'DRA · Del pizarrón a la evidencia', descripcion: 'Un método común para evaluar ideas en equipo: un embudo de cinco pasos (filtros, Lean Canvas, ICE, mapa de supuestos y Test Cards), Notion y Miro, una reunión de propuestas y el ejemplo de Pádel SoloQ.', carpeta: 'dra' })}
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${ACC}; }
  /* Las entradas las orquesta GSAP; nada se oculta en CSS a propósito:
     sin JS el deck se ve completo y la impresión a PDF funciona. */
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.35); border-radius: 999px;
    background: ${kit.alpha(INK, 0.85)}; color: #FFFFFF; cursor: pointer;
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
// La familia de los reportes semanales: titulares partidos en palabras con
// entrada 3D, tarjetas que caen con giro, contadores y barras. Lo propio de
// este deck: el embudo que se estrecha, el Lean Canvas que se enciende en
// orden de llenado, el sticky que recorre el pipeline y la agenda de 90 min
// que se llena de izquierda a derecha. Todo con tl.from().
(function () {
  if (!window.animar || !window.gsap) return;

  function partir(el) {
    if (!el || el.dataset.partido) return [];
    var salida = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\\s+)/).forEach(function (parte) {
        if (!parte) return;
        if (/^\\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
        var s = document.createElement('span');
        s.textContent = parte;
        s.style.display = 'inline-block';
        frag.appendChild(s);
        salida.push(s);
      });
      el.replaceChild(frag, n);
    });
    el.dataset.partido = '1';
    return salida;
  }
  function titular(tl, el, pos) {
    if (!el) return;
    var ps = el.dataset.partido ? el.querySelectorAll('span') : partir(el);
    if (ps.length) tl.from(ps, { y: 40, opacity: 0, rotationX: -55, transformPerspective: 900,
      transformOrigin: '50% 100%', duration: 0.7, stagger: 0.045, ease: 'power3.out' }, pos || 0);
  }
  var Q = function (s, sel) { return s.querySelectorAll(sel); };
  var q = function (s, sel) { return s.querySelector(sel); };
  var cuentas = function (tl, s, pos) { Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, pos); }); };
  var caer = { y: 40, opacity: 0, rotationX: -24, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 0.6 };
  function mini(tl, s) {
    var m = Q(s, '[data-mini]');
    if (m.length) tl.from(m, { y: -10, opacity: 0, duration: 0.35, stagger: 0.05 }, 0.05);
  }
  function conNota(tl, s, pos) {
    var n = q(s, '[data-nota]');
    if (n) tl.from(n, { y: 22, opacity: 0, duration: 0.55 }, pos);
  }

  function portada(tl, s) {
    tl.from(Q(s, '[data-orbe]'), { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 0);
    var sello = q(s, '[data-sello]');
    if (sello) tl.from(sello, { scale: 0, rotation: -90, duration: 0.7, ease: 'back.out(1.7)' }, 0.1)
      .from(q(s, '[data-a="up"] div'), { x: -22, opacity: 0, duration: 0.55 }, 0.25);
    else tl.from(q(s, '[data-a="up"]'), { y: 20, opacity: 0, duration: 0.5 }, 0.1);
    titular(tl, q(s, 'h1, h2'), 0.3);
    tl.from(q(s, 'p'), { y: 22, opacity: 0, duration: 0.55 }, 0.75)
      .from(Q(s, 'div[data-a="up3"] span'), { y: 18, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.06 }, 0.85);
  }
  animar('Portada', portada);
  animar('Cierre', portada);

  animar('En resumen', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-stat]'), Object.assign({ stagger: 0.09 }, caer), 0.3);
    cuentas(tl, s, 0.45);
  });

  animar('El problema', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-panel]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100, transformOrigin: '0% 50%', duration: 0.8 }, 0.2)
      .from(Q(s, '[data-riesgo]'), Object.assign({ stagger: 0.09 }, caer), 0.35);
    cuentas(tl, s, 0.3);
    conNota(tl, s, 1.0);
  });

  animar('Principios', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-principio]'), Object.assign({ stagger: 0.1 }, caer), 0.25);
  });

  animar('El embudo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    // la silueta se abre de izquierda a derecha y los pasos caen en orden
    tl.from(q(s, '[data-silueta]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .from(Q(s, '[data-nodo]'), { y: 26, opacity: 0, scale: 0.92, duration: 0.45, stagger: 0.1 }, 0.4)
      .from(Q(s, '[data-salida]'), { x: 30, opacity: 0, duration: 0.45, stagger: 0.1 }, 1.0);
  });

  animar('Paso 1 · Filtros', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-filtro]'), { x: -36, opacity: 0, duration: 0.45, stagger: 0.08 }, 0.25)
      .from(q(s, '[data-capacidad]'), { x: 40, opacity: 0, duration: 0.6 }, 0.35)
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.out', stagger: 0.07 }, 0.7);
  });

  animar('Paso 2 · Lean Canvas', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    // los nueve bloques se encienden en orden de llenado, no de lectura
    var bloques = Array.prototype.slice.call(Q(s, '[data-bloque]'))
      .sort(function (a, b) { return a.dataset.orden - b.dataset.orden; });
    tl.from(bloques, { scale: 0.86, opacity: 0, duration: 0.35, ease: 'back.out(1.6)', stagger: 0.09 }, 0.25)
      .from(Q(s, '[data-regla]'), { x: 30, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.6);
    cuentas(tl, s, 0.65);
  });

  animar('Paso 3 · ICE', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-letra]'), Object.assign({ stagger: 0.1 }, caer), 0.2)
      .from(q(s, '[data-formula]'), { y: 26, opacity: 0, duration: 0.5 }, 0.5)
      .from(Q(s, '[data-celda]'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.3, stagger: 0.04 }, 0.7)
      .from(q(s, '[data-umbral]'), { y: -16, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 1.1)
      .from(Q(s, '[data-reglaice]'), { x: 30, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.6);
  });

  animar('La rúbrica', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.2)
      .from(Q(s, '[data-fila-r]'), { x: -24, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.4);
    conNota(tl, s, 1.0);
  });

  animar('Paso 4 · Supuestos', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-tipo]'), { x: -36, opacity: 0, duration: 0.45, stagger: 0.09 }, 0.25)
      .from(Q(s, '[data-cuadrante]'), { scale: 0.88, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'back.out(1.5)' }, 0.45)
      .from(q(s, '[data-pulso]'), { scale: 1.12, opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.0);
  });

  animar('Paso 5 · Tarjetas', function (tl, s) {
    mini(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-tarjeta]'), { y: 40, opacity: 0, rotation: -1.5, duration: 0.6, stagger: 0.14 }, 0.2)
      .from(Q(s, '[data-frase]'), { x: -14, opacity: 0, duration: 0.35, stagger: 0.06 }, 0.45)
      .from(Q(s, '[data-exp]'), { y: 14, opacity: 0, scale: 0.94, duration: 0.35, stagger: 0.05 }, 0.9);
    conNota(tl, s, 1.15);
  });

  animar('Plataformas', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-plat]'), Object.assign({ stagger: 0.1 }, caer), 0.25);
    conNota(tl, s, 0.95);
  });

  animar('Registro', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-col]'), { y: 24, opacity: 0, duration: 0.4, stagger: 0.06 }, 0.15);
    // el sticky entra en «Idea cruda» y avanza hasta «En validación»
    var st = q(s, '[data-sticky]');
    if (st) tl.from(st, { x: -parseFloat(st.dataset.pasoCol), duration: 1.0, ease: 'power2.inOut' }, 0.6)
      .from(st, { opacity: 0, y: -30, duration: 0.3 }, 0.45);
    tl.from(Q(s, '[data-reg]'), { y: 26, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.5);
  });

  animar('La reunión', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    // los 90 minutos se llenan de izquierda a derecha, bloque por bloque
    tl.from(Q(s, '[data-bloque-ag]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.32, ease: 'power2.out', stagger: 0.13 }, 0.25)
      .from(Q(s, '[data-momento]'), Object.assign({ stagger: 0.1 }, caer), 0.75);
  });

  animar('Pádel · lo que encontramos', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.5 }, 0.2)
      .from(Q(s, '[data-lado]'), { y: 36, opacity: 0, duration: 0.6, stagger: 0.2 }, 0.3)
      .from(Q(s, '[data-dato]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.5);
    conNota(tl, s, 1.1);
  });

  animar('Pádel · cómo lo probamos', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-hipo]'), { x: -50, opacity: 0, rotationY: 14, transformPerspective: 1100, transformOrigin: '0% 50%', duration: 0.7 }, 0.2)
      .from(Q(s, '[data-hip]'), { x: -16, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.4)
      .from(Q(s, '[data-prueba]'), Object.assign({ stagger: 0.12 }, caer), 0.35)
      .from(Q(s, '[data-punto]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.25, ease: 'back.out(2.4)', stagger: 0.035 }, 0.7)
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power2.out' }, 0.8);
    cuentas(tl, s, 0.8);
    conNota(tl, s, 1.15);
  });

  animar('Lo que necesitamos acordar', function (tl, s) {
    // las preguntas llevan data-step: las revela la navegación
    titular(tl, q(s, 'h2'), 0);
  });
})();
</script>
<script>
(function () {
  var on = false, btn = document.createElement('button');
  btn.id = 'modo-presentacion'; btn.type = 'button';
  function pinta() { btn.textContent = on ? 'Salir · Esc' : 'Presentar · P'; if (on) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on'); }
  function poner(v) {
    if (v === on) return; on = v;
    window.postMessage({ __omelette_presenting: v }, '*');
    if (v) { if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); }
    else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    pinta();
  }
  btn.addEventListener('click', function () { poner(!on); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') { poner(!on); e.preventDefault(); }
    else if (e.key === 'Escape' && on && !document.fullscreenElement) poner(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && on) poner(false); });
  pinta(); document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

// kit.diferir es la convención del repo aunque este deck no traiga imágenes.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
