// Generador de index.html — Reunión de DRA del 2 de noviembre de 2026:
// la investigación de la semana y lo que se decide hoy.
// Ejecutar: node personal/dra-1102/gen.js        (también escribe dra-1102/NOTAS.md)
//
// Charla de Axl para Diego y Rodrigo: reunión de unos 45 minutos, la
// presentación ocupa unos 20. Fuente ÚNICA: el brief
// DRA-PKB/proyectos/presentacion-2026-11-02.md y los informes y páginas de la
// wiki que cita (cada lámina dice cuáles en su pie y en sus notas).
//
// Mismo sistema que dra/ y musk/ (mismo equipo, misma audiencia): índigo
// #4B3BD6 sobre blanco con puntitos, Figtree, portada a color con orbes.
// Cada lámina lleva un chip que dice QUÉ TIPO de afirmación es:
//   INFORME      → sale de un informe de reports/ y lleva su fuente.
//   POR CONFIRMAR → algo que quedó abierto el 25/oct y no sabemos su estado.
//   PROPUESTA    → síntesis de los informes, sin decidir (borde punteado índigo).
//   PENDIENTE    → no está investigado todavía (borde punteado ámbar).
//
// El sitio es PÚBLICO y el deck lleva noindex: sin montos de nadie, sin
// enlaces a Notion ni Miro, sin datos personales de los socios.
//
// Cuidados (no quitarlos al editar):
//   - NO decir que el equipo descartó el scraper de Maps: es la conclusión del
//     informe y la lectura de Axl; la wiki no registra una decisión.
//   - VetSaaS y TikTok Shop NO son investigaciones terminadas. Las cifras de
//     VetSaaS (216 veterinarias, 80 % papel y WhatsApp, 18 meses) son del PKB
//     de Axl y van marcadas «sin verificar».
//   - Estimaciones propias, hipótesis y lo no verificado se ven como tales.
//   - Prospección: las 7 a 11 h semanales y los US$30 al mes son estimación
//     propia del informe; las horas del piloto (6 a 13 por persona) también.
//   - La ley de datos de 2025: «no trae excepción propia para contactos B2B»;
//     no es asesoría legal.
//   - Pádel: el ingreso (30 a 50 mil pesos al año) es HIPOTÉTICO y el tope de
//     gasto (< ~4,000 pesos) es estimación sin verificar.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
const L = kit.lineas;

// ── Identidad: la de dra/ y musk/ ────────────────────────────────────────
const ACC = '#4B3BD6';
const BRIGHT = '#7A6BFF';
const WASH = '#ECEAFF';
const PALE = '#F4F2FF';
const BG = '#FFFFFF';
const SOFT = '#F6F5FB';
const INK = '#1C1A3A';
const MUTED = '#64618A';
const LINE = '#E2E0EE';
const OK = '#00875A';   const OK_WASH = '#E3FCEF';
const BAD = '#DE350B';  const BAD_WASH = '#FFEBE6';
const WARN = '#974F0C'; const WARN_WASH = '#FFF0B3';

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: ACC });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FCFBFF 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
// Una propuesta se reconoce a simple vista: borde punteado índigo y fondo pálido.
const CARD_P = `background: ${PALE}; border: 2px dashed ${kit.alpha(ACC, 0.55)};`;
// Lo pendiente: el mismo borde punteado, en ámbar.
const CARD_W = `background: #FFF9E3; border: 2px dashed ${kit.alpha(WARN, 0.6)};`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(ACC, 0.13) }),
  kit.lavado({ color: WASH, fuerza: 0.7 }));
const puntosClaro = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });
const FONDO_COLOR = (en1 = '88% 10%', en2 = '8% 95%') => kit.fondo(ACC, puntosClaro(),
  kit.lavado({ color: BRIGHT, en: en1, ancho: 85, alto: 75, fuerza: 0.55 }),
  kit.lavado({ color: INK, en: en2, ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }));

// ── Helpers ──────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fuerte = (t) => `<strong style="font-weight: 700;">${t}</strong>`;
const ceja = (t, color = ACC) => `<span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${t}</span>`;
const chip = (txt, color = ACC, wash = WASH) =>
  `<span style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px; color: ${color}; background: ${wash}; border-radius: 7px; padding: 4px 11px; white-space: nowrap;">${txt}</span>`;
const pill = (txt, bg = 'rgba(255,255,255,0.16)', color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 9px 22px; letter-spacing: 0.3px; white-space: nowrap;">${txt}</span>`;
const h2 = (txt, size = 62) =>
  `<h2 data-split style="margin: 0; font-size: ${size}px; font-weight: 800; color: ${INK}; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;
const cifra = (valor, { pre = '', suf = '', dec = 0, size = 96, color = ACC, extra = '' } = {}) =>
  `<span data-cuenta data-valor="${valor}" data-pre="${pre}" data-suf="${suf}" data-dec="${dec}" style="font-size: ${size}px; font-weight: 800; color: ${color}; letter-spacing: ${Math.round(-size / 14)}px; line-height: 0.95; white-space: nowrap; ${NUM} ${extra}">${pre}${Number(valor).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${suf}</span>`;
const nota = (txt, color = ACC) => `
    <div data-nota style="background: ${color === ACC ? WASH : kit.alpha(color, 0.09)}; border-left: 5px solid ${color}; border-radius: 0 14px 14px 0; padding: 18px 30px; font-size: 26px; font-weight: 400; color: ${INK}; line-height: 1.42; box-shadow: 0 8px 20px rgba(28,26,58,0.08);">${txt}</div>`;
const orbes = (lista) => `
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      ${lista.map((o) => `<div data-orbe style="position: absolute; ${o}"></div>`).join('\n      ')}
    </div>`;

// Lo primero que se lee de cada lámina: qué tipo de afirmación es.
const pastilla = (icono, texto, color, wash, borde) =>
  `<span style="display: inline-flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: ${color}; background: ${wash}; border: ${borde}; border-radius: 999px; padding: 7px 16px;"><span style="font-size: 17px;">${icono}</span> ${texto}</span>`;
const TIPOS = {
  informe: pastilla('✓', 'De los informes · con fuente', INK, SOFT, `1.5px solid ${LINE}`),
  propuesta: pastilla('◇', 'Propuesta · sin decidir', ACC, PALE, `2px dashed ${kit.alpha(ACC, 0.65)}`),
  confirmar: pastilla('?', 'Por confirmar', WARN, WARN_WASH, `1.5px solid ${kit.alpha(WARN, 0.4)}`),
  pendiente: pastilla('…', 'Pendiente · sin investigar', WARN, '#FFF9E3', `2px dashed ${kit.alpha(WARN, 0.65)}`),
  intro: pastilla('', 'Para empezar', ACC, WASH, `1.5px solid ${WASH}`),
  voto: pastilla('✋', 'Para votar hoy', ACC, PALE, `2px dashed ${kit.alpha(ACC, 0.65)}`),
};
const header = (tipo, etiqueta) => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.74);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 46px; height: 40px; border-radius: 10px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Reunión · 2 de noviembre</span>
      </div>
      <div style="display: flex; align-items: center; gap: 22px;">
        ${TIPOS[tipo]}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${ACC};">${etiqueta}</span>
      </div>
    </header>`;
const fuente = (txt) => `<div data-fuente style="position: absolute; left: 100px; right: 100px; bottom: 30px; font-size: 15.5px; font-weight: 500; color: ${MUTED}; line-height: 1.35; letter-spacing: 0.1px;">${txt}</div>`;

const slides = [];
const NOTAS = [];

// Una lámina estándar: cabecera, cuerpo y fuente. `notas` son 3–5 líneas.
function lamina({ label, tipo, etiqueta, notas, fuentes, cuerpo }) {
  NOTAS.push({ label, notas });
  slides.push(`
  <section data-label="${label}" data-screen-label="${String(slides.length + 1).padStart(2, '0')} · ${label}" data-speaker-notes="${esc(notas.join(' '))}" style="${FONDO_BLANCO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 78px; box-sizing: border-box; overflow: hidden;">
    ${header(tipo, etiqueta)}
    ${cuerpo}
    ${fuente(fuentes)}
  </section>`);
}

// ── 1 · Portada ──────────────────────────────────────────────────────────
// Cuatro bloques de distinta altura, dibujados solo con líneas: los cuatro
// temas de la semana.
const bloques = () => {
  const W = 150, D = 150, G = 40;
  const lista = [
    [0, 0, 170], [W + G, 0, 250], [0, D + G, 120], [W + G, D + G, 210],
  ].map(([x, z, h]) => {
    const c = L.caja([x, h / 2, z], [W, h, D]);
    c.der.achurado = { paso: 9, angulo: 45 };
    return c;
  });
  return L.dibujar(lista, { camara: { iso: true, giro: 38, altura: 24 }, ancho: 760, alto: 700, margen: 30,
    tinta: '#FFFFFF', grosor: 3.2, fino: 1.6, estilo: 'width:100%;height:100%', titulo: 'Cuatro bloques: los cuatro temas de la semana' });
};
const NOTAS_PORTADA = [
  'Esta semana se hicieron tres informes nuevos y hay dos ideas más por retomar. Hoy los repasamos y al final decidimos.',
  'Aclaro de entrada qué es cada cosa: lo que sale de un informe lleva su fuente; lo que es mío o del informe como síntesis va marcado como propuesta; y lo que aún no se investigó se dice tal cual.',
  'La reunión es de unos 45 minutos y esta presentación ocupa unos 20. Después cargamos ideas al evaluador y filtramos.',
];
NOTAS.push({ label: 'Portada', notas: NOTAS_PORTADA });
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="${esc(NOTAS_PORTADA.join(' '))}" style="${FONDO_COLOR()} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${orbes([
      'right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);',
      'right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);',
      'left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);',
    ])}
    <div data-efecto="traza" data-dur="2.6" data-en="0.2" style="position: absolute; right: 90px; bottom: 150px; width: 760px; height: 700px;">${bloques()}</div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px; position: relative;">
      <span data-sello style="width: 86px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reunión · 2 de noviembre</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Diego · Rodrigo · Axl</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 90px; font-weight: 800; letter-spacing: -3px; line-height: 1.04; white-space: nowrap; position: relative;">Lo que investigamos<br>y lo que decidimos hoy</h1>
    <p data-a="up3" style="margin: 30px 0 0; font-size: 36px; font-weight: 600; color: rgba(255,255,255,0.92); line-height: 1.35; max-width: 1000px; position: relative;">Prospección, pádel y dos ideas por retomar</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px; position: relative;">
      ${pill('Tres informes nuevos')}
      ${pill('Dos ideas por retomar')}
      ${pill('Siete decisiones', '#FFFFFF', ACC)}
    </div>
  </section>`);

// ── 2 · Pendientes del 25 de octubre ─────────────────────────────────────
const TAREAS = [
  ['Desplegar el evaluador (repo en GitHub y Vercel)', 'Rodrigo'],
  ['Subir 2 o 3 ideas propias al evaluador', 'los tres'],
  ['Traer propuesta de nombre y logo', 'los tres'],
  ['Decidir: ¿«empresa fantasma» con página, o esperar el nombre real?', 'sin responsable'],
];
const PREGUNTAS = [
  ['¿Adoptamos el plan de iteración y el formato de experimentos?', 'Hubo «estoy dentro» y «ya suena», pero no se revisó el tope de 4 h, la regla del 10 % ni el calendario.'],
  ['¿Cuántas ideas en paralelo?', 'Diego propuso tres o cuatro; nadie fijó un número.'],
  ['¿El evaluador califica 12 criterios o 5 o 6?', 'La versión de Rodrigo tiene 12; el plan propone 5 o 6.'],
  ['¿Diego y Rodrigo tienen acceso al segundo cerebro?', 'El 20/oct se prometió; el 25/oct se dijo que no.'],
];
lamina({
  label: 'Pendientes', tipo: 'confirmar', etiqueta: 'Recap · 5 min',
  notas: [
    'Lo acordado el 25 de octubre: cada socio sube sus ideas al evaluador y hoy se filtran. No hubo votación; el acuerdo se infiere del cierre de la reunión.',
    'No sé en qué estado está cada tarea hoy, así que todas van como «por confirmar». Lo primero es que cada quien diga cuáles ya están hechas.',
    'Tareas abiertas: desplegar el evaluador (Rodrigo), subir dos o tres ideas cada quien, propuesta de nombre y logo, y decidir si hace falta una «empresa fantasma» con página para acercarse a clientes.',
    'Cuatro preguntas quedaron sin cerrar: el plan de iteración, cuántas ideas en paralelo, 12 criterios contra 5 o 6 y el acceso al segundo cerebro. Dos de ellas las retomamos en las decisiones del final.',
    'Aparte, Axl dijo «es la tercera sesión» y en el wiki solo hay una reunión grabada antes: si hubo una intermedia, falta su transcripción.',
    'Fuente: minuta de la reunión del 25/oct y decisión «Subir las ideas al evaluador esta semana» (wiki).',
  ],
  fuentes: 'Wiki: reunión 2026-10-25 «evaluador y experimentos» y decisión 2026-10-25 «ideas al evaluador esta semana». Estado actual de cada tarea: por confirmar en la reunión.',
  cuerpo: `
    ${h2('Lo que quedó abierto el 25 de octubre')}
    <div data-a="up2" style="margin-top: 26px;">${nota(`${fuerte('Lo acordado:')} cada socio sube sus ideas al evaluador y hoy se filtran. No hubo votación: el acuerdo se infiere del cierre de la reunión.`)}</div>
    <div data-a="up2" style="margin-top: 24px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 36px;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Tareas abiertas')}
        ${TAREAS.map(([t, d]) => `
        <div data-fila style="${CARD} border-radius: 18px; padding: 0 24px; flex: 1; display: grid; grid-template-columns: 38px 1fr auto; gap: 18px; align-items: center;">
          <span style="width: 34px; height: 34px; border-radius: 9px; border: 3px dashed ${kit.alpha(WARN, 0.6)}; box-sizing: border-box;"></span>
          <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 27px; font-weight: 700; line-height: 1.22; color: ${INK};">${t}</span><span style="font-size: 20px; font-weight: 700; color: ${ACC};">${d}</span></div>
          ${chip('POR CONFIRMAR', WARN, WARN_WASH)}
        </div>`).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Preguntas sin cerrar')}
        ${PREGUNTAS.map(([t, d]) => `
        <div data-fila style="${CARD} border-radius: 18px; padding: 0 24px; flex: 1; display: grid; grid-template-columns: 44px 1fr; gap: 18px; align-items: center;">
          <span style="width: 44px; height: 44px; border-radius: 50%; background: ${WASH}; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">?</span>
          <div style="display: flex; flex-direction: column; gap: 5px;"><span style="font-size: 27px; font-weight: 700; line-height: 1.22; color: ${INK};">${t}</span><span style="font-size: 21px; color: ${MUTED}; line-height: 1.32;">${d}</span></div>
        </div>`).join('')}
      </div>
    </div>`,
});

// ── 3 · Agenda ───────────────────────────────────────────────────────────
const AGENDA = [
  ['Recap', 5, 'Los pendientes del 25/oct, marcando qué se hizo.'],
  ['Investigación de la semana', 20, null],
  ['Evaluador', 15, 'Cargar pádel, VetSaaS y las dos que ya existen, y filtrar. Sin ellas el evaluador no tiene con qué comparar.'],
  ['Decisiones', 5, 'Siete votos, de uno en uno.'],
];
const TEMAS = ['Prospección con proyectos de GitHub (y el caso Google Maps)', 'Pádel: marcador y seguimiento de partidas', 'VetSaaS Morelia, como propuesta a retomar', 'TikTok Shop como intermediario (pendiente de investigar)'];
lamina({
  label: 'Agenda', tipo: 'intro', etiqueta: 'Agenda',
  notas: [
    'La reunión dura unos 45 minutos. La investigación es lo que presento yo, unos 20 minutos; el resto es de los tres.',
    'Los tiempos son una sugerencia mía, no un acuerdo: 5 de recap, 20 de investigación, 15 para cargar ideas al evaluador y filtrar, y 5 para las decisiones.',
    'El orden de la investigación: prospección con GitHub y Google Maps, pádel, VetSaaS y TikTok Shop. De este último no hay investigación todavía.',
    'Sin las ideas que ya existen (el sistema de gestión para pymes industriales y la agencia de software), el evaluador no tiene con qué comparar las nuevas.',
  ],
  fuentes: 'Brief de la reunión (DRA-PKB, proyectos/presentacion-2026-11-02), sección 2. Los minutos son sugeridos.',
  cuerpo: `
    ${h2('Cuatro bloques, 45 minutos')}
    <div data-a="up2" style="margin-top: 38px;">
      <div style="display: flex; gap: 8px; height: 104px;">
        ${AGENDA.map(([t, m], i) => `<span data-min style="flex: ${m}; border-radius: 14px; background: ${i === 1 ? ACC : kit.alpha(ACC, 0.16 + i * 0.07)}; color: ${i === 1 ? '#FFFFFF' : INK}; font-size: 27px; font-weight: 800; display: flex; align-items: center; justify-content: center; white-space: nowrap; ${NUM}">${m}′<span style="font-size: 20px; font-weight: 600; margin-left: 12px; opacity: 0.85;">${t}</span></span>`).join('')}
      </div>
      <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: baseline;"><span style="font-size: 19px; color: ${MUTED};">Tiempos sugeridos</span><span style="font-size: 19px; font-weight: 700; color: ${ACC};">Lo que presenta Axl: la barra oscura</span></div>
    </div>
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 0.85fr 1.5fr 1fr 0.8fr; gap: 24px; margin-bottom: 90px;">
      ${AGENDA.map(([t, m, d], i) => `
      <div data-paso style="${i === 1 ? `background: linear-gradient(180deg, ${WASH} 0%, #FFFFFF 100%); border: 3px solid ${ACC};` : CARD} border-radius: 24px; padding: 30px 30px 32px; display: flex; flex-direction: column; gap: 18px; ${i === 1 ? '' : `border-top: 5px solid ${kit.alpha(ACC, 0.5)};`}">
        <div style="display: flex; align-items: center; gap: 14px;"><span style="width: 50px; height: 50px; border-radius: 15px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">${i + 1}</span><span style="font-size: 33px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px; line-height: 1.1;">${t}</span></div>
        ${d ? `<span style="font-size: 30px; color: ${MUTED}; line-height: 1.45;">${d}</span>` : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${TEMAS.map((x, j) => `<div style="display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start;"><span style="width: 34px; height: 34px; border-radius: 10px; background: ${j === 3 ? '#FFF9E3' : WASH}; color: ${j === 3 ? WARN : ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; font-weight: 800; ${j === 3 ? `border: 2px dashed ${kit.alpha(WARN, 0.6)};` : ''}">${j + 1}</span><span style="font-size: 29px; font-weight: 600; color: ${INK}; line-height: 1.28;">${x}</span></div>`).join('')}
        </div>`}
      </div>`).join('')}
    </div>`,
});

// ── 4 · Prospección con proyectos de GitHub ──────────────────────────────
const FLUJO = [
  ['1', 'DENUE · INEGI', 'El directorio oficial, gratis, de unos 6.1 millones de establecimientos. Uso comercial permitido, citando a INEGI.', 'Teléfono, correo y web vienen incompletos.'],
  ['2', 'Un CRM sencillo', 'Twenty (versión Cloud) o Atomic CRM, solo como registro de a quién se le habló y qué dijo.', 'Aburrido, y es lo que de verdad sirve.'],
  ['3', 'Trato humano', 'Referidos y visita. WhatsApp uno a uno, y solo después de recibir permiso.', 'El segmento responde al trato personal.'],
];
lamina({
  label: 'Prospección', tipo: 'informe', etiqueta: 'Investigación · 1',
  notas: [
    'El informe parte de lo que se viraliza en GitHub para prospección, con corte al 27 de octubre. No se ejecutó el código de ningún repo: todo es lectura de README, API de GitHub e issues.',
    'Mensaje central: el cuello de botella de DRA no es tecnológico. Lo que se viraliza ofrece más automatización de la que se puede usar con 7 a 11 horas semanales (estimación propia del informe).',
    'Lo útil es aburrido: la API gratuita DENUE del INEGI como fuente y un CRM sencillo como registro. Son los repos con más sustancia real (Twenty tiene 788 contribuyentes).',
    'Lo que se evita: los agentes «AI SDR» que mandan correo o WhatsApp solos (Harvey, Franco, OpenOutreach) son jóvenes, de pocos mantenedores y sin resultados independientes; sus marcos legales son de EE.UU. y la UE, no de México. Los gateways de WhatsApp no oficiales y los scrapers violan términos de plataforma; el riesgo real no es la multa, es perder el número, la cuenta o la reputación en una ciudad donde los círculos de pymes son chicos.',
    'Sobre la ley de datos de 2025: según el informe no trae una excepción propia para contactos B2B. No es asesoría legal.',
    'Costo estimado del flujo humano: 7 a 11 horas semanales para todo el equipo y unos US$30 al mes en herramientas, sin asesoría legal. Son estimaciones propias del informe.',
    'Ojo con la decisión del 20 de octubre (primero el segundo cerebro y el evaluador, antes de ir con clientes): el informe pide reconciliar esto antes de ejecutarlo.',
    'Fuente: informe «Proyectos GitHub para prospección» (reports/).',
  ],
  fuentes: 'Informe «Proyectos GitHub para prospección» (DRA-PKB, corte 27-oct-2026; no se ejecutó código) · horas y costo: estimación propia del informe · no es asesoría legal.',
  cuerpo: `
    ${h2('El cuello de botella no es la tecnología')}
    <p data-a="up2" style="margin: 14px 0 0; font-size: 28px; color: ${MUTED}; line-height: 1.4; max-width: 1500px;">Lo que se viraliza ofrece más automatización de la que podemos usar con 7 a 11 horas semanales ${chip('estimación propia', WARN, WARN_WASH)}</p>
    <div data-a="up2" style="margin-top: 26px; flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr 560px; gap: 22px;">
      ${FLUJO.map(([n, t, d, pie]) => `
      <div data-panel style="${CARD} border-radius: 24px; padding: 28px 28px 26px; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${OK};">
        <div style="display: flex; align-items: center; gap: 14px;"><span style="width: 46px; height: 46px; border-radius: 14px; background: ${OK}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800;">${n}</span><span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.1;">${t}</span></div>
        <span style="font-size: 29px; color: ${INK}; line-height: 1.42;">${d}</span>
        <span style="margin-top: auto; font-size: 25px; color: ${MUTED}; line-height: 1.35; font-weight: 600;">${pie}</span>
      </div>`).join('')}
      <div data-panel style="${CARD} border-radius: 24px; padding: 28px 30px 26px; display: flex; flex-direction: column; gap: 14px; border-top: 5px solid ${BAD}; background: linear-gradient(180deg, ${BAD_WASH} 0%, #FFFFFF 70%);">
        ${ceja('Lo que se evita', BAD)}
        <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 31px; font-weight: 800; color: ${INK}; line-height: 1.2; letter-spacing: -0.5px;">Agentes «AI SDR» que escriben solos</span><span style="font-size: 25px; color: ${MUTED}; line-height: 1.35;">Harvey, Franco, OpenOutreach: jóvenes, de pocos mantenedores y sin resultados independientes.</span></div>
        <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 31px; font-weight: 800; color: ${INK}; line-height: 1.2; letter-spacing: -0.5px;">WhatsApp no oficial y scrapers</span><span style="font-size: 25px; color: ${MUTED}; line-height: 1.35;">Violan términos de plataforma.</span></div>
        <div style="margin-top: auto; background: #FFFFFF; border-radius: 14px; padding: 14px 18px; border-left: 5px solid ${BAD};"><span style="font-size: 23px; font-weight: 700; color: ${INK}; line-height: 1.32;">El riesgo real: perder el número, la cuenta o la reputación en una ciudad chica.</span></div>
      </div>
    </div>
    <div style="margin-top: 20px; margin-bottom: 34px;">${nota(`${fuerte('Costo estimado:')} 7 a 11 h semanales para todo el equipo y unos US$30 al mes en herramientas ${chip('estimación propia', WARN, WARN_WASH)} La ley de datos de 2025 no trae excepción para contactos B2B (no es asesoría legal).`, WARN)}</div>`,
});

// ── 5 · Google Maps ──────────────────────────────────────────────────────
const NIVELES = [
  [OK, '1', 'DENUE como lista; Maps solo para mirar', 'El nivel por defecto. Teléfono y sitio se completan con Overture y Foursquare. Ni scraper ni API hacen falta.', 'POR DEFECTO'],
  [WARN, '2', 'Places API en modo consulta', 'Solo se guarda el place_id. Cuesta de US$0 a ~US$52 por 1,000 negocios (estimación propia, sin probar).', 'SI HACE FALTA'],
  [BAD, '3', 'Un scraper, al final', 'Solo si el piloto muestra que Maps agrega mucho más que DENUE y se acepta el riesgo contractual con los ojos abiertos.', 'ÚLTIMO RECURSO'],
];
lamina({
  label: 'Google Maps', tipo: 'informe', etiqueta: 'Investigación · 1b',
  notas: [
    'Este informe extiende el anterior y profundiza solo en Google Maps. Lo que dice es la conclusión del informe y la lectura de Axl; el wiki no registra que el equipo haya decidido nada sobre el scraper.',
    'Los repos que usan Maps hacen casi lo mismo: abren Maps con un navegador automatizado y exportan nombre, teléfono y sitio. Solo un motor es maduro, gosom/google-maps-scraper, con unas 6.9 mil estrellas y licencia MIT.',
    'Pero es casi un proyecto de una sola persona: 304 contribuciones del autor contra 3 del siguiente. Y en octubre hay un issue abierto (#338) donde casi todos los trabajos fallan; lo grave es que deja un CSV vacío y termina con código 0, así que un pipeline lo leería como «sin resultados». Además manda telemetría por defecto (se apaga con DISABLE_TELEMETRY=1).',
    'Los términos de Google prohíben descargar su contenido en bloque. La ruta oficial, Places API, cuesta poco pero no deja guardar nombres, teléfonos ni sitios; solo el place_id. Costo: estimación propia, sin probar, de US$0 a unos US$52 por 1,000 negocios en el peor caso.',
    'Consecuencias: lo documentado es técnico (CAPTCHA, bloqueo de IP), no judicial. No se halló ningún caso contra un equipo pequeño, pero no se investigó el derecho penal mexicano. No es asesoría legal.',
    'Conclusión del informe: armar la lista con DENUE, usar Maps solo para mirar a mano y dejar el scraper como tercer nivel, con la decisión basada en una muestra piloto (siguiente lámina).',
    'Lo que no se midió: la cobertura de DENUE, Overture y Foursquare para Morelia, y la API de Google no se probó.',
    'Fuente: informe «Proyectos GitHub prospección con Google Maps» (reports/).',
  ],
  fuentes: 'Informe «Proyectos GitHub prospección con Google Maps» (DRA-PKB, corte 27-oct-2026; nada se instaló ni ejecutó) · costo: estimación propia, sin probar · no es asesoría legal.',
  cuerpo: `
    ${h2('Armar la lista sin raspar Maps')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 1fr 640px; gap: 28px;">
      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${NIVELES.map(([c, n, t, d, tag], i) => `
        <div data-panel style="${CARD} border-radius: 24px; padding: 0 32px; flex: 1; display: grid; grid-template-columns: 70px 1fr; gap: 26px; align-items: center; border-left: 8px solid ${c}; margin-left: ${i * 44}px;">
          <span style="width: 64px; height: 64px; border-radius: 18px; background: ${c}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 800;">${n}</span>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;"><span style="font-size: 34px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px; line-height: 1.12;">${t}</span>${chip(tag, c, kit.alpha(c, 0.1))}</div>
            <span style="font-size: 24px; color: ${MUTED}; line-height: 1.4;">${d}</span>
          </div>
        </div>`).join('')}
      </div>
      <div data-panel style="${CARD} border-radius: 26px; padding: 30px 34px; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${BAD};">
        ${ceja('Por qué el scraper va al final', BAD)}
        <div style="display: flex; align-items: baseline; gap: 14px;">${cifra(6.9, { suf: 'k ★', dec: 1, size: 80, color: INK })}<span style="font-size: 23px; color: ${MUTED}; line-height: 1.3;">gosom, el único motor maduro</span></div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${[
            `${fuerte('Casi un solo mantenedor:')} 304 contribuciones del autor, 3 del siguiente.`,
            `${fuerte('Fallo abierto (#338):')} deja un CSV vacío y sale con código 0, como si no hubiera resultados.`,
            `${fuerte('Telemetría por defecto:')} se apaga con DISABLE_TELEMETRY=1.`,
            `${fuerte('Términos de Google:')} prohíben bajar el contenido en bloque; solo el place_id se puede guardar.`,
          ].map((x) => `<span style="font-size: 23px; color: ${INK}; line-height: 1.38; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: ${BAD}; font-weight: 800;">•</span>${x}</span>`).join('')}
        </div>
        <span style="margin-top: auto; font-size: 20px; color: ${MUTED}; line-height: 1.4;">Sin casos documentados contra equipos pequeños; no se investigó el derecho penal mexicano.</span>
      </div>
    </div>
    <div style="margin-top: 20px; margin-bottom: 34px;">${nota(`${fuerte('Conclusión del informe:')} Maps sirve para mirar; la lista sale de DENUE. ${chip('no hay decisión del equipo', WARN, WARN_WASH)}`)}</div>`,
});

// ── 6 · Piloto de datos ──────────────────────────────────────────────────
const MIDE = [
  'Qué % de la lista tiene teléfono, correo y sitio en DENUE',
  'Qué % se encuentra en Maps, y qué % ya cerró o no existe',
  'Qué % tiene teléfono en Maps y si coincide con el de DENUE',
  'Qué % aparece en Overture y Foursquare, con su teléfono',
  'Cuánto tiempo toma por negocio',
];
lamina({
  label: 'Piloto de datos', tipo: 'propuesta', etiqueta: 'Investigación · 1c',
  notas: [
    'Propuesta del informe: antes de decidir entre DENUE, API o scraper, hacer una muestra de 50 a 100 negocios de DENUE y medir la calidad de los datos. Sin contactar a nadie.',
    'La muestra debe ser aleatoria y estratificada por clase SCIAN, no los «mejores» prospectos, porque esos sesgan las tasas. Con 100 negocios el margen de error es de unos ±10 puntos y con 50 de unos ±14: alcanza para decidir si seguir o cambiar de ruta, no para estimar tasas finas.',
    'Se mide el porcentaje con teléfono, correo y sitio en DENUE, el emparejado con una ficha de Maps, el cerrado, el teléfono en Maps contra DENUE, Overture y Foursquare, y el tiempo por negocio.',
    'Dos reglas de parada, ambas propuestas propias del informe a ajustar: si más del 30 % de los registros de DENUE ya no existen o están cerrados en Maps, la lista base está vieja y hay que rehacerla. Y si la brecha de teléfonos entre Maps y la suma de DENUE, Overture y Foursquare es menor a unos 20 puntos, el scraper compra poco y no justifica el riesgo.',
    'Horas: de 6 a 13 por persona en dos semanas, estimación propia sin respaldo externo; el informe pide calibrarlas con la primera semana. Diego aportaría el juicio del segmento (marcar «lo conozco / sigue operando / giro correcto», por ejemplo talleres de hasta 15 personas).',
    'No contradice la decisión del 20 de octubre, porque mide calidad de datos sin contactar a nadie. Cualquier contacto real sí exigiría confirmarla o reabrirla.',
    'Fuente: informe «Proyectos GitHub prospección con Google Maps», sección del piloto.',
  ],
  fuentes: 'Informe «Proyectos GitHub prospección con Google Maps»: piloto de 50 a 100 negocios · horas y reglas de parada: estimaciones y propuestas propias del informe, a ajustar con la primera semana.',
  cuerpo: `
    ${h2('Antes de decidir, un piloto de datos')}
    <div data-a="up2" style="margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      <div data-panel style="${CARD_P} border-radius: 24px; padding: 24px 32px; display: flex; flex-direction: column; gap: 6px;">${ceja('Muestra de DENUE')}<div style="display: flex; align-items: baseline; gap: 12px;">${cifra(50, { size: 88 })}<span style="font-size: 44px; font-weight: 800; color: ${ACC};">–</span>${cifra(100, { size: 88 })}<span style="font-size: 26px; color: ${MUTED};">negocios</span></div></div>
      <div data-panel style="${CARD_P} border-radius: 24px; padding: 24px 32px; display: flex; flex-direction: column; gap: 6px;">${ceja('Personas contactadas')}<div style="display: flex; align-items: baseline; gap: 14px;">${cifra(0, { size: 88 })}<span style="font-size: 26px; color: ${MUTED}; line-height: 1.25;">solo se mide la calidad de los datos</span></div></div>
      <div data-panel style="${CARD_P} border-radius: 24px; padding: 24px 32px; display: flex; flex-direction: column; gap: 6px;">${ceja('Por persona, en 2 semanas')}<div style="display: flex; align-items: baseline; gap: 12px;">${cifra(6, { size: 88 })}<span style="font-size: 44px; font-weight: 800; color: ${ACC};">–</span>${cifra(13, { suf: ' h', size: 88 })}</div><div>${chip('estimación propia', WARN, WARN_WASH)}</div></div>
    </div>
    <div data-a="up2" style="margin-top: 24px; flex: 1; display: grid; grid-template-columns: 1.1fr 1fr; gap: 26px;">
      <div data-panel style="${CARD} border-radius: 24px; padding: 28px 34px; display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Qué se mide')}
        ${MIDE.map((x, i) => `<div style="display: grid; grid-template-columns: 38px 1fr; gap: 16px; align-items: center; flex: 1;"><span style="width: 36px; height: 36px; border-radius: 10px; background: ${WASH}; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800;">${i + 1}</span><span style="font-size: 28px; font-weight: 600; color: ${INK}; line-height: 1.28;">${x}</span></div>`).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div data-panel style="${CARD} border-radius: 24px; padding: 24px 30px; flex: 1; display: flex; align-items: center; gap: 26px; border-left: 8px solid ${BAD};">
          ${cifra(30, { pre: '> ', suf: ' %', size: 76, color: BAD })}
          <div style="display: flex; flex-direction: column; gap: 4px;">${ceja('Regla de parada 1', BAD)}<span style="font-size: 25px; font-weight: 700; color: ${INK}; line-height: 1.28;">de registros cerrados o inexistentes: la lista base está vieja, se rehace.</span></div>
        </div>
        <div data-panel style="${CARD} border-radius: 24px; padding: 24px 30px; flex: 1; display: flex; align-items: center; gap: 26px; border-left: 8px solid ${WARN};">
          ${cifra(20, { pre: '< ', suf: ' pts', size: 76, color: WARN })}
          <div style="display: flex; flex-direction: column; gap: 4px;">${ceja('Regla de parada 2', WARN)}<span style="font-size: 25px; font-weight: 700; color: ${INK}; line-height: 1.28;">de brecha en teléfonos con Maps: el scraper no compensa el riesgo.</span></div>
        </div>
        <span style="font-size: 20px; color: ${MUTED}; line-height: 1.4;">Umbrales propuestos por el informe, a ajustar. No contradice la decisión del 20/oct: no se contacta a nadie.</span>
      </div>
    </div>
    <div style="height: 34px;"></div>`,
});

// ── 7 · Pádel: panorama ──────────────────────────────────────────────────
const CAPAS = [
  [BAD, 'Gestión de cuadros y cobro', 'OCUPADA', 'Playtomic Manager (4 % al jugador por pagos con tarjeta), Tournify (gratis hasta 8 equipos) y Xporty ya la cubren; en México, PADO y PadelMatch, con muy pocas reseñas.'],
  [OK, 'Marcador por punto para el espectador amateur', 'POCO RESUELTO', 'En todo lo verificado una persona captura el resultado y la app lo difunde: ningún producto capta los puntos solo.'],
  [WARN, 'Cámara con IA y seguir la bola', 'INVESTIGACIÓN', 'PlaySight es el líder (afirmación del proveedor). Con una cámara, la pelota es visible solo en el 36 % de los cuadros de una final.'],
  [MUTED, 'Pelota con sensor', 'DESCARTADA', 'No existe una para pádel; el sensor sería ~5 % del peso de la pelota (cálculo del informe) y las competencias exigen pelotas homologadas.'],
];
lamina({
  label: 'Pádel panorama', tipo: 'informe', etiqueta: 'Investigación · 2',
  notas: [
    'Este es el ángulo que Axl planteó después de la reunión: no gestionar cuadros, sino llevar el marcador del partido y del torneo para el espectador y, más adelante, grabar para sacar mejores momentos.',
    'La capa de gestión de cuadros y cobro ya tiene dueños. Playtomic Manager cobra al jugador 4 % de servicio por pagos con tarjeta; Tournify es gratis hasta 8 equipos; hay entrantes mexicanos con muy pocas reseñas.',
    'El hueco documentado es el marcador por punto para espectadores amateur: en todo lo verificado, una persona captura y la app difunde. Un marcador configurable, un cuadro público por QR y un video con disparo manual y corte con FFmpeg son ingeniería conocida y de costo casi nulo (la parte del video es síntesis propia del informe).',
    'Seguir la bola con una sola cámara y automatizar el marcador sí son investigación: la pelota es visible en 36 % de los cuadros de una final y no se halló ningún artículo ni producto que automatice el marcador.',
    'Mercado: más de 630 clubes, 2,300 canchas y cerca de un millón de jugadores en México, pero unos 8,000 federados (FIP, marzo de 2025). En Morelia, 6 clubes y 29 canchas; no se encontró ningún torneo con fecha en fuentes públicas.',
    'El ingreso es una síntesis propia con precios hipotéticos: de 1,500 a 2,500 pesos por torneo y 20 torneos al año serían de 30 mil a 50 mil pesos anuales. Es hipotético; solo con marcador no se sostiene un negocio en Morelia.',
    'Sin verificar: Instagram, Facebook y Reddit (donde vive la actividad real), los precios vigentes de Playtomic Manager y MATCHi, el texto oficial de la ley de datos y los precios de cámaras en México.',
    'Fuente: informe «Pádel marcador cámara IA y torneos» y página de idea sistema-torneos-padel (estado: semilla).',
  ],
  fuentes: 'Informe «Pádel marcador cámara IA y torneos» (DRA-PKB, 27-oct-2026) y wiki: idea sistema-torneos-padel (semilla) · México: FIP, mar-2025 · ingreso: síntesis propia con precios hipotéticos · sin verificar: Instagram, Facebook, Reddit, precios.',
  cuerpo: `
    ${h2('Pádel: el hueco está en el marcador')}
    <div data-a="up2" style="margin-top: 26px; flex: 1; display: grid; grid-template-columns: 1fr 520px; gap: 26px;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${CAPAS.map(([c, t, tag, d]) => `
        <div data-fila style="${CARD} border-radius: 20px; padding: 0 28px; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; border-left: 8px solid ${c};">
          <div style="display: flex; align-items: center; gap: 14px;"><span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.12;">${t}</span>${chip(tag, c, kit.alpha(c, 0.1))}</div>
          <span style="font-size: 22px; color: ${MUTED}; line-height: 1.38;">${d}</span>
        </div>`).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div data-panel style="${CARD} border-radius: 24px; padding: 24px 30px; flex: 1; display: flex; flex-direction: column; gap: 10px; border-top: 5px solid ${ACC};">
          ${ceja('México · FIP, mar 2025')}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px;">
            <div style="display: flex; flex-direction: column;">${cifra(630, { pre: '+', size: 54 })}<span style="font-size: 20px; color: ${MUTED};">clubes</span></div>
            <div style="display: flex; flex-direction: column;">${cifra(2300, { size: 54 })}<span style="font-size: 20px; color: ${MUTED};">canchas</span></div>
            <div style="display: flex; flex-direction: column;">${cifra(1, { pre: '~', suf: ' M', size: 54 })}<span style="font-size: 20px; color: ${MUTED};">jugadores</span></div>
            <div style="display: flex; flex-direction: column;">${cifra(8000, { pre: '~', size: 54, color: MUTED })}<span style="font-size: 20px; color: ${MUTED};">federados</span></div>
          </div>
        </div>
        <div data-panel style="${CARD} border-radius: 24px; padding: 22px 30px; display: flex; align-items: center; gap: 24px;">
          <div style="display: flex; flex-direction: column;">${cifra(6, { size: 64 })}<span style="font-size: 20px; color: ${MUTED};">clubes en Morelia</span></div>
          <div style="display: flex; flex-direction: column;">${cifra(29, { size: 64 })}<span style="font-size: 20px; color: ${MUTED};">canchas</span></div>
        </div>
        <div data-panel style="${CARD_P} border-radius: 24px; padding: 22px 30px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">${ceja('Solo con marcador')}${chip('HIPOTÉTICO', ACC, WASH)}</div>
          <div style="display: flex; align-items: baseline; gap: 10px;">${cifra(30, { pre: '$', suf: 'k', size: 54 })}<span style="font-size: 34px; font-weight: 800; color: ${ACC};">–</span>${cifra(50, { pre: '$', suf: 'k', size: 54 })}<span style="font-size: 21px; color: ${MUTED};">pesos al año</span></div>
          <span style="font-size: 19px; color: ${MUTED}; line-height: 1.35;">1,500 a 2,500 por torneo × 20 torneos. Síntesis propia, precios hipotéticos.</span>
        </div>
      </div>
    </div>
    <div style="height: 34px;"></div>`,
});

// ── 8 · Pádel: el plan ───────────────────────────────────────────────────
const FASES = [
  ['0 · Campo', 'Semanas 1 y 2', 'Entrevistar de 8 a 10 organizadores y clubes, y visitar uno.', '0'],
  ['1 · Marcador a mano', 'Semanas 3 a 6', 'Marcador configurable y cuadro por QR, operado en un torneo con anotadores voluntarios.', '0 a ~1,000'],
  ['2 · Video manual', 'Semanas 7 a 10', 'Celular fijo en 1 o 2 canchas, un reel por pareja y prueba de precios.', '0 a ~3,000'],
  ['3 · Experimento de IA', 'Semana 11 en adelante', 'Solo si se sigue: medir detección de golpes y seguimiento de la bola en 2 o 3 partidos.', '< US$50'],
];
lamina({
  label: 'Pádel plan', tipo: 'propuesta', etiqueta: 'Investigación · 2b',
  notas: [
    'La propuesta del informe: tratarlo como un experimento con tope de tiempo y gasto, no como una nueva línea principal.',
    'Fase 0, semanas 1 y 2: entrevistar de 8 a 10 organizadores y clubes, revisar los 6 clubes de Morelia, averiguar qué cámara usa uno de ellos y visitar un club. Gasto de bolsillo: cero. Es lo único que pedimos hoy.',
    'Fase 1, semanas 3 a 6: marcador configurable y cuadro público por QR, en un torneo con anotadores voluntarios. Fase 2, semanas 7 a 10: video manual. Fase 3: el experimento de IA, solo si se sigue.',
    'El gasto total estimado queda por debajo de unos 4,000 pesos, según estimaciones sin verificar.',
    'Construir el marcador (Fase 1) requiere que los tres lo acuerden, porque la decisión del 20 de octubre pospone los prototipos. La Fase 0 no la contradice.',
    'Aunque la idea muera, el experimento le da al evaluador algo que hoy no tiene: disposición a pagar medida en pesos reales y horas de trabajo por entrega.',
    'Criterios del informe para decidir (hipótesis, no datos de mercado): seguir si al menos 2 organizadores aceptan un piloto y pagarían el siguiente torneo; pivotar si el marcador se usa pero nadie paga; descartar si hay menos de 6 torneos al año en la ciudad y nadie quiere piloto.',
    'Riesgos a mencionar: grabar y publicar jugadores exige aviso de privacidad y consentimiento (texto de la ley de 2025 sin verificar; no es asesoría legal), y conviene excluir los torneos de menores.',
    'Pregunta abierta para hoy: ¿hacemos la Fase 0 y quién la hace? Es trabajo social, de entrevistas.',
  ],
  fuentes: 'Informe «Pádel marcador cámara IA y torneos» y wiki: idea sistema-torneos-padel · gasto total < ~4,000 pesos: estimación sin verificar · criterios para decidir: hipótesis del informe.',
  cuerpo: `
    ${h2('Un experimento con tope, no una línea nueva')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;">
      <div style="position: absolute; left: 24px; right: 24px; top: 21px; height: 4px; background: ${kit.alpha(ACC, 0.25)}; border-radius: 2px;"><div data-ruta-viva style="height: 100%; width: 100%; background: linear-gradient(90deg, ${ACC}, ${BRIGHT}); border-radius: 2px;"></div></div>
      ${FASES.map(([t, sub, d, gasto], i) => `
      <div data-fase style="position: relative; padding-top: 52px; display: flex; flex-direction: column;">
        <span data-hito style="position: absolute; left: 14px; top: 8px; width: 30px; height: 30px; border-radius: 50%; background: ${i === 0 ? ACC : '#FFFFFF'}; border: 4px solid ${ACC}; box-sizing: border-box;"></span>
        <div style="${i === 0 ? `background: linear-gradient(180deg, ${WASH} 0%, #FFFFFF 100%); border: 3px solid ${ACC};` : CARD_P} border-radius: 22px; padding: 26px 26px 24px; flex: 1; display: flex; flex-direction: column; gap: 14px;">
          <div><span style="font-size: 36px; font-weight: 800; color: ${INK}; letter-spacing: -0.9px; line-height: 1.1;">${t}</span><br><span style="font-size: 18px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${ACC};">${sub}</span></div>
          <span style="font-size: 29px; color: ${INK}; line-height: 1.42;">${d}</span>
          <div style="margin-top: auto; background: #FFFFFF; border-radius: 14px; padding: 12px 16px; border-left: 5px solid ${i === 0 ? OK : WARN};">
            <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: ${i === 0 ? OK : WARN};">Gasto de bolsillo · pesos</span><br>
            <span style="font-size: 28px; font-weight: 800; color: ${INK}; ${NUM}">${gasto}</span>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <div style="margin-top: 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 34px;">
      <div data-lazo style="${CARD} border-radius: 16px; padding: 16px 24px; display: flex; flex-direction: column; gap: 4px; border-top: 4px solid ${WARN};"><span style="font-size: 20px; font-weight: 800; color: ${WARN}; letter-spacing: 1.2px; text-transform: uppercase;">Tope de gasto</span><span style="font-size: 24px; font-weight: 700; color: ${INK}; line-height: 1.3;">Menos de ~4,000 pesos en total ${chip('estimación sin verificar', WARN, WARN_WASH)}</span></div>
      <div data-lazo style="${CARD} border-radius: 16px; padding: 16px 24px; display: flex; flex-direction: column; gap: 4px; border-top: 4px solid ${ACC};"><span style="font-size: 20px; font-weight: 800; color: ${ACC}; letter-spacing: 1.2px; text-transform: uppercase;">Para construir</span><span style="font-size: 24px; font-weight: 700; color: ${INK}; line-height: 1.3;">La Fase 1 requiere que los tres lo acuerden</span></div>
      <div data-lazo style="${CARD} border-radius: 16px; padding: 16px 24px; display: flex; flex-direction: column; gap: 4px; border-top: 4px solid ${OK};"><span style="font-size: 20px; font-weight: 800; color: ${OK}; letter-spacing: 1.2px; text-transform: uppercase;">Aunque la idea muera</span><span style="font-size: 24px; font-weight: 700; color: ${INK}; line-height: 1.3;">Le da al evaluador disposición a pagar en pesos reales</span></div>
    </div>`,
});

// ── 9 · VetSaaS Morelia ──────────────────────────────────────────────────
lamina({
  label: 'VetSaaS', tipo: 'propuesta', etiqueta: 'Idea por retomar · 3',
  notas: [
    'VetSaaS Morelia es una idea mía, en fase cero, que investigué en mayo de 2026. No es una investigación de esta semana: la traigo como propuesta a retomar.',
    'Es un SaaS para clínicas veterinarias independientes, con tres piezas: cartilla digital portátil, seguimiento automático del paciente y campañas de marketing.',
    'Las cifras que sostienen la idea —216 veterinarias mapeadas en Morelia, un 80 % que opera con papel y WhatsApp y una ventana de unos 18 meses de ventaja para el primero en llegar— salen de mi investigación en mi PKB y no están verificadas aquí. Por eso van marcadas.',
    'La tensión: es un SaaS de un solo gremio, y mi tesis, la de DRA hasta ahora, es software a la medida para pymes. Hay que decidir si cabe en el portafolio o si compite con esa tesis.',
    'No tiene stack definido y todavía no está cargada al evaluador.',
    'Lo que propongo: cargarla al evaluador hoy y validarla con 3 o 4 llamadas a veterinarias antes de invertir más.',
    'Fuente: wiki, página del equipo de Axl (sección «Ideas que trae») y su PKB personal, que vive fuera del repo.',
  ],
  fuentes: 'Wiki: página de Axl, «Ideas que trae» (VetSaaS Morelia, investigada en mayo de 2026, fase 0). Las tres cifras vienen del PKB de Axl y no están verificadas.',
  cuerpo: `
    ${h2('VetSaaS Morelia: una propuesta que retomar')}
    <div data-a="up2" style="margin-top: 28px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 28px;">
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div data-panel style="${CARD_P} border-radius: 24px; padding: 28px 34px; display: flex; flex-direction: column; gap: 16px;">
          ${ceja('Qué es')}
          <span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.22;">Un SaaS para clínicas veterinarias independientes</span>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${['Cartilla digital portátil', 'Seguimiento automático del paciente', 'Campañas de marketing'].map((x) => `<span style="font-size: 24px; font-weight: 700; color: ${ACC}; background: #FFFFFF; border: 1.5px solid ${kit.alpha(ACC, 0.35)}; border-radius: 999px; padding: 10px 22px;">${x}</span>`).join('')}
          </div>
          <span style="font-size: 21px; color: ${MUTED};">Idea propia en fase 0, investigada en mayo de 2026. Sin stack definido.</span>
        </div>
        <div data-panel style="${CARD} border-radius: 24px; padding: 26px 34px; flex: 1; display: flex; flex-direction: column; gap: 14px; justify-content: center; border-top: 5px solid ${WARN};">
          <div style="display: flex; justify-content: space-between; align-items: center;">${ceja('Las cifras de la idea', WARN)}${chip('SIN VERIFICAR · PKB de Axl', WARN, WARN_WASH)}</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 6px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">${cifra(216, { size: 96, color: MUTED })}<span style="font-size: 21px; color: ${MUTED}; line-height: 1.3;">veterinarias mapeadas</span></div>
            <div style="display: flex; flex-direction: column; gap: 4px;">${cifra(80, { suf: ' %', size: 96, color: MUTED })}<span style="font-size: 21px; color: ${MUTED}; line-height: 1.3;">con papel y WhatsApp</span></div>
            <div style="display: flex; flex-direction: column; gap: 4px;">${cifra(18, { pre: '~', size: 96, color: MUTED })}<span style="font-size: 21px; color: ${MUTED}; line-height: 1.3;">meses de ventana al primero</span></div>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div data-panel style="${CARD} border-radius: 24px; padding: 28px 34px; display: flex; flex-direction: column; gap: 14px; border-top: 5px solid ${BAD};">
          ${ceja('La tensión', BAD)}
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;">
            <div style="background: ${SOFT}; border-radius: 16px; padding: 18px 20px; text-align: center;"><span style="font-size: 26px; font-weight: 800; color: ${INK}; line-height: 1.25;">SaaS de un solo gremio</span></div>
            <span style="font-size: 34px; font-weight: 800; color: ${BAD};">vs</span>
            <div style="background: ${SOFT}; border-radius: 16px; padding: 18px 20px; text-align: center;"><span style="font-size: 26px; font-weight: 800; color: ${INK}; line-height: 1.25;">Software a la medida para pymes</span></div>
          </div>
          <span style="font-size: 23px; color: ${MUTED}; line-height: 1.4;">La tesis de Axl es la segunda. Hay que decidir si cabe en el portafolio o compite con ella.</span>
        </div>
        <div data-panel style="${CARD_P} border-radius: 24px; padding: 28px 34px; flex: 1; display: flex; flex-direction: column; gap: 26px; justify-content: center;">
          ${ceja('Para retomarla falta')}
          ${['Cargarla al evaluador', 'Validarla con 3 o 4 llamadas a veterinarias'].map((x, i) => `<div style="display: grid; grid-template-columns: 50px 1fr; gap: 18px; align-items: center;"><span style="width: 48px; height: 48px; border-radius: 14px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 25px; font-weight: 800;">${i + 1}</span><span style="font-size: 34px; font-weight: 700; color: ${INK}; line-height: 1.25;">${x}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div style="height: 34px;"></div>`,
});

// ── 10 · TikTok Shop ─────────────────────────────────────────────────────
const PREG10 = [
  '¿Qué requisitos y comisiones tiene en México?',
  '¿Qué dice lo legal y lo fiscal?',
  '¿Cabe en las 7 a 14 horas semanales por socio?',
];
lamina({
  label: 'TikTok Shop', tipo: 'pendiente', etiqueta: 'Idea por definir · 4',
  notas: [
    'Esta lámina es honesta: de TikTok Shop como intermediario no hay investigación. No hay informe ni cifras. Lo que traigo son las preguntas.',
    'La primera pregunta es de modelo: ¿somos afiliados, aprovechando el canal Axelsine, o armamos un canal para negocios locales? Son ideas distintas y se investigan distinto.',
    'Después: requisitos y comisiones en México, qué dice lo legal y lo fiscal, y si cabe en las 7 a 14 horas semanales que tiene cada socio.',
    'Lo que se pide hoy no es aprobar nada: es decidir si se investiga y con qué modelo, para traer el informe a la siguiente reunión.',
  ],
  fuentes: 'Brief de la reunión (DRA-PKB, proyectos/presentacion-2026-11-02), sección 3.5: tema pendiente de investigar. No hay informe, cifras ni fuentes todavía.',
  cuerpo: `
    ${h2('TikTok Shop como intermediario: aún no hay nada investigado')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 1.15fr 1fr; gap: 28px;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
        ${ceja('Primero hay que escoger el modelo', WARN)}
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 22px;">
          ${[['A', 'Afiliados', 'Vender como afiliados, con el canal Axelsine.'], ['B', 'Canal para negocios locales', 'Un canal pensado para los negocios de aquí.']].map(([l, t, d]) => `
          <div data-panel style="${CARD_W} border-radius: 26px; padding: 30px 30px 28px; display: flex; flex-direction: column; gap: 16px;">
            <span style="width: 64px; height: 64px; border-radius: 18px; background: #FFFFFF; border: 3px dashed ${kit.alpha(WARN, 0.6)}; color: ${WARN}; display: inline-flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 800;">${l}</span>
            <span style="font-size: 46px; font-weight: 800; color: ${INK}; letter-spacing: -1.2px; line-height: 1.1;">${t}</span>
            <span style="font-size: 32px; color: ${MUTED}; line-height: 1.42;">${d}</span>
            <span style="margin-top: auto; font-size: 19px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: ${WARN};">Por definir</span>
          </div>`).join('')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Lo que no sabemos', WARN)}
        ${PREG10.map((x) => `
        <div data-fila style="${CARD} border-radius: 20px; padding: 0 28px; flex: 1; display: grid; grid-template-columns: 52px 1fr; gap: 20px; align-items: center;">
          <span style="width: 50px; height: 50px; border-radius: 50%; background: #FFF9E3; border: 2px dashed ${kit.alpha(WARN, 0.6)}; color: ${WARN}; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800;">?</span>
          <span style="font-size: 29px; font-weight: 700; color: ${INK}; line-height: 1.28; letter-spacing: -0.3px;">${x}</span>
        </div>`).join('')}
        <div data-panel style="background: ${WARN_WASH}; border-radius: 16px; padding: 16px 24px; border-left: 5px solid ${WARN};"><span style="font-size: 24px; color: ${INK}; line-height: 1.4;">${fuerte('Hoy se pide:')} decidir si se investiga y con qué modelo. No hay nada que aprobar todavía.</span></div>
      </div>
    </div>
    <div style="height: 34px;"></div>`,
});

// ── 11 · Decisiones ──────────────────────────────────────────────────────
const VOTOS = [
  ['¿Adoptamos el plan de iteración?', 'Tope de 4 horas y 2 semanas por experimento, y el formato de reuniones.'],
  ['¿Cuántas ideas trabajamos en paralelo?', 'Una · de dos a tres · tres o cuatro (la propuesta de Diego del 25/oct).'],
  ['¿Aceptamos el piloto de datos?', '50 a 100 negocios de DENUE, sin contactar a nadie; el scraper de Maps queda para después del piloto.'],
  ['¿Hacemos la Fase 0 del pádel y quién la hace?', 'Entrevistar de 8 a 10 organizadores y clubes en dos semanas, sin gasto.'],
  ['¿Retomamos VetSaaS?', 'Cargarla al evaluador y validarla con 3 o 4 llamadas.'],
  ['¿Investigamos TikTok Shop, y con qué modelo?', 'Afiliados con el canal Axelsine, o un canal para negocios locales.'],
  ['¿Cuántos criterios tiene el evaluador?', 'Los 12 de la versión actual, o los 5 o 6 que propone el plan.'],
];
const voto2 = (n, q, d) => `
        <div data-voto-c data-step="${n}" style="${CARD_P} border-radius: 22px; padding: 0 28px; display: grid; grid-template-columns: 52px 1fr; gap: 20px; align-items: center;">
          <span style="width: 52px; height: 52px; border-radius: 15px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">${'abcdefg'[n - 1]}</span>
          <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.16;">${q}</span><span style="font-size: 21.5px; color: ${MUTED}; line-height: 1.35;">${d}</span></div>
        </div>`;
lamina({
  label: 'Decisiones', tipo: 'voto', etiqueta: 'Decisiones · 5 min',
  notas: [
    'Siete votos, de uno en uno con la flecha. Cada uno sale de un pendiente de la reunión del 25 de octubre o de la investigación de hoy.',
    'a) El plan de iteración: tope de 4 horas y 2 semanas por experimento. El 25/oct hubo «estoy dentro» pero no se revisó el tope.',
    'b) Cuántas ideas en paralelo: Diego propuso tres o cuatro y nadie fijó número.',
    'c) El piloto de datos de 50 a 100 negocios de DENUE sin contactar a nadie. Si se acepta, el scraper de Maps queda para después del piloto; no es que alguien lo haya descartado.',
    'd) La Fase 0 del pádel y quién la hace: son entrevistas, sin gasto.',
    'e) Retomar VetSaaS: cargarla al evaluador y 3 o 4 llamadas. f) Investigar TikTok Shop y con qué modelo.',
    'g) Cuántos criterios tiene el evaluador: 12 o 5 o 6.',
    'Lo que se acuerde se registra como decisión en el wiki; lo que no, queda como pregunta abierta.',
  ],
  fuentes: 'Brief de la reunión (DRA-PKB), sección 4, y minuta del 25/oct. Nada de esto es decisión hasta que los tres lo acuerden.',
  cuerpo: `
    ${h2('Siete decisiones para hoy')}
    <div data-a="up2" style="margin-top: 26px; margin-bottom: 36px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 16px 24px;">
      ${VOTOS.map(([q, d], i) => voto2(i + 1, q, d)).join('')}
      <div style="background: ${WASH}; border-radius: 22px; padding: 0 30px; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
        ${ceja('Después de votar')}
        <span style="font-size: 24px; color: ${INK}; line-height: 1.38;">Lo que se acuerde queda como decisión en el wiki; lo demás, como pregunta abierta.</span>
      </div>
    </div>`,
});

// ── Coreografía ──────────────────────────────────────────────────────────
// La de dra/ y musk/: titulares partidos en palabras con entrada 3D, tarjetas
// que caen, contadores y barras. Todo con tl.from(); sin Math.random.
const etiquetas = ['Pendientes', 'Agenda', 'Prospección', 'Google Maps', 'Piloto de datos', 'Pádel panorama', 'Pádel plan', 'VetSaaS', 'TikTok Shop'];
const coreografias = `<script>
(function () {
  if (!window.animar || !window.gsap) return;
  var Q = function (s, sel) { return s.querySelectorAll(sel); };
  var q = function (s, sel) { return s.querySelector(sel); };

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
  var caer = { y: 40, opacity: 0, rotationX: -24, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 0.6 };
  function contar(tl, el, pos) {
    var fin = parseFloat(el.dataset.valor), dec = parseInt(el.dataset.dec || '0', 10);
    var pre = el.dataset.pre || '', suf = el.dataset.suf || '', o = { v: 0 };
    tl.to(o, { v: fin, duration: 1.1, ease: 'power2.out', onUpdate: function () {
      el.textContent = pre + o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    } }, pos);
  }
  function cuentas(tl, s, pos) { Array.prototype.forEach.call(Q(s, '[data-cuenta]'), function (el) { contar(tl, el, pos); }); }
  function conNota(tl, s, pos) { var n = q(s, '[data-nota]'); if (n) tl.from(n, { y: 22, opacity: 0, duration: 0.55 }, pos); }
  // Lo común: titular, la cuadrícula entra y las tarjetas caen en cascada.
  function estandar(tl, s, extra) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2);
    var cartas = Q(s, '[data-panel], [data-fila], [data-paso], [data-lazo]');
    if (cartas.length) tl.from(cartas, Object.assign({ stagger: 0.09 }, caer), 0.35);
    cuentas(tl, s, 0.55);
    conNota(tl, s, 1.3);
    if (extra) extra(tl, s);
  }

  animar('Portada', function (tl, s) {
    if (window.efectosDeclarados) window.efectosDeclarados(tl, s);
    tl.from(Q(s, '[data-orbe]'), { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 0);
    tl.from(q(s, '[data-sello]'), { scale: 0, rotation: -90, duration: 0.7, ease: 'back.out(1.7)' }, 0.1)
      .from(q(s, '[data-a="up"] div'), { x: -22, opacity: 0, duration: 0.55 }, 0.25);
    titular(tl, q(s, 'h1'), 0.3);
    tl.from(q(s, 'p'), { y: 22, opacity: 0, duration: 0.55 }, 0.75)
      .from(Q(s, 'div[data-a="up3"] span'), { y: 18, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.06 }, 0.9);
  });

  animar('Pendientes', function (tl, s) { estandar(tl, s); });

  // La barra de tiempos crece de izquierda a derecha y cada bloque cae.
  animar('Agenda', function (tl, s) {
    estandar(tl, s, function () {
      tl.from(Q(s, '[data-min]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.45, stagger: 0.1 }, 0.4);
    });
  });

  animar('Prospección', function (tl, s) { estandar(tl, s); });
  animar('Google Maps', function (tl, s) { estandar(tl, s); });
  animar('Piloto de datos', function (tl, s) { estandar(tl, s); });
  animar('Pádel panorama', function (tl, s) { estandar(tl, s); });

  // La ruta se dibuja de izquierda a derecha y cada fase cae en su hito.
  animar('Pádel plan', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { opacity: 0, duration: 0.3 }, 0.1)
      .from(q(s, '[data-ruta-viva]'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power2.inOut' }, 0.3)
      .from(Q(s, '[data-hito]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.4)', stagger: 0.3 }, 0.35)
      .from(Q(s, '[data-fase] > div'), Object.assign({ stagger: 0.3 }, caer), 0.45)
      .from(Q(s, '[data-lazo]'), Object.assign({ stagger: 0.12 }, caer), 1.5);
  });

  animar('VetSaaS', function (tl, s) { estandar(tl, s); });
  animar('TikTok Shop', function (tl, s) { estandar(tl, s); });

  // Los siete votos llevan data-step: los revela la navegación.
  animar('Decisiones', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Lo que investigamos y lo que decidimos hoy · DRA</title>
${kit.og({ titulo: 'Lo que investigamos y lo que decidimos hoy · DRA', descripcion: 'Reunión de DRA del 2 de noviembre: prospección con proyectos de GitHub, Google Maps, pádel, VetSaaS y TikTok Shop, y siete decisiones.', carpeta: 'personal/dra-1102' })}
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
${kit.gsap(__dirname, ['DrawSVG'])}
${kit.efectos()}
${kit.animador()}
${coreografias}
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
// Las notas del orador, para tenerlas a la mano (el deck solo las expone por
// postMessage): un renglón por línea, lámina por lámina.
fs.writeFileSync(__dirname + '/NOTAS.md', `# Notas del orador · Reunión de DRA del 2 de noviembre\n\nNotas locales (este archivo no se sube al repo). 11 láminas, unos 20 minutos.\n\n${NOTAS.map((n, i) => `## ${i + 1} · ${n.label}\n\n${n.notas.map((x) => `- ${x}`).join('\n')}\n`).join('\n')}`, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
