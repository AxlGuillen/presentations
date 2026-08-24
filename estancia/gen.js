// Generador de index.html — Propuesta: web + sistema de administración para estancia infantil
// Ejecutar: node estancia/gen.js
//
// Alcance acordado (1er contacto, 8 diapositivas):
//   Fase 1 · Web con blog de eventos + SEO asistido con IA
//   Fase 2 · Administración y cobranza  ← el corazón de esta propuesta
//   Fase 3 · Entrada y salida con QR
//   Fase 4 · Comunicación avanzada
//   El seguimiento para padres (app / reporte diario) queda POR DEFINIR a propósito.
const fs = require('fs');

// ── Identidad · colores tomados del logo de La Casita Feliz ─────────────
const CREAM = '#FFF9FA';      // fondo, crema con matiz rosado
const PLUM = '#5B2168';       // morado profundo — titulares y fondos oscuros
const PURPLE = '#7B2E8E';     // morado del "guardería" y la sonrisa
const PINK = '#E94B85';       // rosa de "Casita" y el techo
const GREEN = '#6CBE45';      // verde de "Feliz"
const LEAF = '#2FA84F';       // verde de las hojas
const YELLOW = '#FFC510';     // amarillo de la "I" de CAI
const BROWN = '#8D5B3F';      // café del tronco
const INK = '#2E2230';
const MUTED = '#7A6A72';
const LINE = '#EFE3E9';

const ESCUELA_TITULO = 'La Casita Feliz';
const ESCUELA_SUB = 'CAI · Centro de Atención Infantil';

const FONT = `'Poppins', ui-sans-serif, system-ui, sans-serif`;
const CARD = `background: #FFFFFF; border: 1px solid ${LINE}; box-shadow: 0 10px 28px rgba(91,33,104,0.07);`;

// ── Helpers ──────────────────────────────────────────────────────────────
/** Marca de agua del logo, muy sutil, detrás del contenido.
 *  Es background-image a propósito: si el archivo falta no se ve nada roto. */
const marca = (opacidad = 0.05, tam = 760, pos = 'bottom: -150px; right: -130px;') =>
  `<div aria-hidden="true" style="position: absolute; ${pos} width: ${tam}px; height: ${tam}px; background: url('assets/logo-casita-feliz.png') center/contain no-repeat; opacity: ${opacidad}; pointer-events: none;"></div>`;

/** Logo en caja blanca para las cabeceras y la portada. */
const logoCaja = (tam = 38, radio = 11) =>
  `<span style="width: ${tam}px; height: ${tam}px; border-radius: ${radio}px; background: #FFFFFF url('assets/logo-casita-feliz.png') center/78% no-repeat; box-shadow: 0 2px 10px rgba(91,33,104,0.18); flex: none; display: inline-block;"></span>`;

const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 116px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE};">
      <div style="display: flex; align-items: center; gap: 16px;">
        ${logoCaja(44, 12)}
        <span style="font-size: 20px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.2px;">Propuesta · ${ESCUELA_TITULO}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${PINK};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `background: ${CREAM}; font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 168px 100px 70px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 64) =>
  `<h2 data-a="up" style="margin: 0; font-size: ${size}px; font-weight: 700; color: ${PLUM}; letter-spacing: -1.7px; line-height: 1.06;">${txt}</h2>`;

const bajada = (txt, max = 1360) =>
  `<p data-a="up2" style="margin: 20px 0 0; font-size: 27px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const pill = (txt, bg, color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 8px 22px; letter-spacing: 0.4px; white-space: nowrap;">${txt}</span>`;

const tarjeta = (icono, titulo, texto, acento = PINK) => `
        <div style="${CARD} border-radius: 24px; padding: 32px 32px 30px; display: flex; flex-direction: column; gap: 11px;">
          <span style="width: 52px; height: 52px; border-radius: 16px; background: ${acento}1A; color: ${acento}; display: inline-flex; align-items: center; justify-content: center; font-size: 23px; font-weight: 700;">${icono}</span>
          <span style="font-size: 26px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.4px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

const bullet = (txt, acento = GREEN, size = 24, color = INK) => `
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <span style="flex: none; margin-top: 4px; width: 27px; height: 27px; border-radius: 50%; background: ${acento}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700;">✓</span>
            <span style="font-size: ${size}px; font-weight: 400; color: ${color}; line-height: 1.4;">${txt}</span>
          </div>`;

const nota = (txt, color = PLUM) => `
    <div data-a="up3" style="background: ${color}0D; border-left: 5px solid ${color}; border-radius: 0 18px 18px 0; padding: 24px 32px; font-size: 23px; font-weight: 400; color: ${INK}; line-height: 1.5;">${txt}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Primer contacto. La propuesta son dos cosas: una web que atrae familias y un sistema que ordena la administracion." style="background: ${PLUM}; background-image: radial-gradient(90% 70% at 85% 15%, rgba(233,75,133,0.32) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${marca(0.07, 640, 'top: 90px; right: -80px;')}
    <div data-a="ghost" style="position: absolute; right: -60px; bottom: -120px; width: 620px; height: 620px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
    <div data-a="ghost" style="position: absolute; right: 190px; top: -90px; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,197,16,0.14);"></div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      ${logoCaja(84, 22)}
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 34px; font-weight: 600; color: #FFFFFF; letter-spacing: -0.3px;">${ESCUELA_TITULO}</span>
        <span style="font-size: 20px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.65);">${ESCUELA_SUB}</span>
      </div>
    </div>
    <h1 data-a="up2" style="margin: 46px 0 0; font-size: 100px; font-weight: 700; letter-spacing: -3.4px; line-height: 1.03; max-width: 1380px;">Una web que atrae familias<br>y un sistema que ordena<br>la administración</h1>
    <p data-a="up3" style="margin: 36px 0 0; font-size: 29px; font-weight: 400; color: rgba(255,255,255,0.8); line-height: 1.5; max-width: 1060px;">Propuesta de desarrollo por etapas, empezando por lo que hoy cuesta más tiempo y más dinero.</p>
    <div data-a="up3" style="margin-top: 52px; display: flex; gap: 14px;">
      ${pill('Sitio web y blog', 'rgba(255,255,255,0.14)')}
      ${pill('Administración y cobranza', 'rgba(255,255,255,0.14)')}
      ${pill('Entrada y salida', 'rgba(255,255,255,0.14)')}
    </div>
  </section>`);

// ── 2 · Punto de partida ────────────────────────────────────────────────
slides.push(`
  <section data-label="El punto de partida" data-screen-label="Punto de partida" data-speaker-notes="Demostrar que escuchamos y nombrar el dolor. OJO: la columna derecha son hipotesis, hay que validarlas en la junta." style="${seccion()}">
    ${marca()}
    ${header('Punto de partida')}
    ${h2('Dónde está hoy la escuela')}
    <div data-a="up3" style="margin-top: 46px; display: grid; grid-template-columns: 1fr 1fr; gap: 34px; flex: 1;">
      <div style="${CARD} border-radius: 28px; padding: 44px 42px; display: flex; flex-direction: column; gap: 24px; border-top: 6px solid ${GREEN};">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${GREEN};">Lo que ya funciona</span>
        <div style="display: flex; flex-direction: column; gap: 18px;">
          ${bullet('Hasta 60 menores, desde los 2 meses de edad', GREEN, 23)}
          ${bullet('Reporte diario individual de cada alumno', GREEN, 23)}
          ${bullet('Programa de motricidad fina y desarrollo cognitivo', GREEN, 23)}
          ${bullet('Trato cercano con las familias', GREEN, 23)}
        </div>
      </div>
      <div style="${CARD} border-radius: 28px; padding: 44px 42px; display: flex; flex-direction: column; gap: 24px; border-top: 6px solid ${PINK};">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${PINK};">Dónde se va el tiempo</span>
        <div style="display: flex; flex-direction: column; gap: 18px;">
          ${bullet('Quién pagó, quién debe y desde cuándo vive en una libreta o un Excel', PINK, 23)}
          ${bullet('Los datos de cada familia están en papel y en varias carpetas', PINK, 23)}
          ${bullet('Cobrar tarde o no cobrar depende de que alguien se acuerde', PINK, 23)}
          ${bullet('La escuela casi no aparece cuando buscan guardería en internet', PINK, 23)}
        </div>
      </div>
    </div>
    ${nota('Por eso la propuesta <strong style="font-weight: 600; color: ' + PLUM + ';">no empieza por la tecnología más vistosa, sino por lo que más cuesta hoy</strong>: la administración y la captación de familias nuevas.')}
  </section>`);

// ── 3 · Fase 1 · Web ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="Fase 1 · La web" data-screen-label="Fase 1 · Web" data-speaker-notes="La web no es un folleto: es captacion. El blog de eventos alimenta el posicionamiento y las tarjetas de WhatsApp." style="${seccion()}">
    ${marca()}
    ${header('Fase 01', pill('Proyecto cerrado', PINK))}
    ${h2('Una web que trabaja<br>aunque nadie la esté viendo')}
    <div data-a="up3" style="margin-top: 44px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; flex: 1;">
      ${tarjeta('◧', 'El sitio completo', 'Filosofía, programa, instalaciones, horarios y contacto. Pensada primero para el celular, que es donde la van a ver.', PINK)}
      ${tarjeta('✎', 'Blog de eventos', 'Cada festival, actividad o aviso se publica y queda registrado. La escuela construye su propia memoria pública.', PINK)}
      ${tarjeta('◍', 'Se comparte bonito', 'Al mandar el enlace por WhatsApp aparece una tarjeta con la foto y el título del evento, no una liga sin más. Se ve profesional y da más ganas de abrirlo.', PURPLE)}
      ${tarjeta('◎', 'Posicionamiento con IA', 'Optimizamos textos y estructura para que la escuela aparezca al buscar guardería en la zona — en Google y también cuando le preguntan a un asistente de IA.', PURPLE)}
    </div>
    ${nota('Cada evento que se publica es una razón más para que la escuela aparezca en las búsquedas. <strong style="font-weight: 600; color: ' + PLUM + ';">El blog no es decoración: es lo que mantiene viva la página</strong> ante Google.', PINK)}
  </section>`);

// ── 4 · Fase 2 · Administración y cobranza ───────────────────────────────
slides.push(`
  <section data-label="Fase 2 · Administración y cobranza" data-screen-label="Fase 2 · Administración" data-speaker-notes="El corazon de la propuesta. Padron + cobranza. Aclarar que NO sustituye al contador ni emite facturas." style="${seccion()}">
    ${marca()}
    ${header('Fase 02', pill('El corazón del sistema', PURPLE))}
    ${h2('Administración y cobranza')}
    ${bajada('Todo lo que hoy está en carpetas, libretas y hojas de cálculo, en un solo lugar y siempre al día.')}
    <div data-a="up3" style="margin-top: 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; flex: 1;">
      ${tarjeta('◫', 'Expediente de cada niño', 'Datos, familiares autorizados, contactos de emergencia, alergias y documentos. Todo en una ficha.', PURPLE)}
      ${tarjeta('$', 'Colegiaturas', 'Inscripción, mensualidad y extras, con sus fechas de corte, descuentos y recargos según sus reglas.', YELLOW)}
      ${tarjeta('▤', 'Estado de cuenta', 'Por alumno: qué pagó, qué debe y desde cuándo. Sin buscar en una libreta.', YELLOW)}
      ${tarjeta('◷', 'Recordatorios', 'Avisos automáticos a las familias antes y después del vencimiento, sin que nadie tenga que perseguirlas.', YELLOW)}
    </div>
    ${nota('<strong style="font-weight: 600; color: ' + PLUM + ';">No sustituye a su contador ni emite facturas.</strong> Es el control de cobranza del día a día. Si más adelante necesitan facturación fiscal, se conecta con un proveedor autorizado en lugar de construirla desde cero. Los datos de los menores se manejan con aviso de privacidad y accesos por rol.')}
  </section>`);

// ── 5 · El valor de centralizar ──────────────────────────────────────────
const preguntas = [
  '¿Cuánto llevo cobrado este mes?',
  '¿Quién tiene más de 15 días de retraso?',
  '¿Cómo va agosto comparado con julio?',
  '¿Qué familias siempre pagan tarde?',
];
slides.push(`
  <section data-label="El valor de centralizar" data-screen-label="Datos e IA" data-speaker-notes="Diapositiva diferenciadora. Centralizar pagos = respuestas que hoy no existen. El asistente de IA se conecta al sistema y responde en lenguaje natural." style="${seccion()}">
    ${marca()}
    ${header('Fase 02 · El diferenciador')}
    ${h2('Cuando todos los pagos pasan<br>por un solo lugar,<br>aparecen las respuestas', 58)}
    <div data-a="up3" style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1.08fr; gap: 34px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 18px; padding-top: 6px;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${YELLOW};">Lo que se puede ver</span>
        ${bullet('Ingresos del mes y comparación con los anteriores', YELLOW, 23)}
        ${bullet('Cuánto dinero hay pendiente de cobrar, y de quién', YELLOW, 23)}
        ${bullet('Proyección de lo que debería entrar este mes', YELLOW, 23)}
        ${bullet('Altas y bajas de alumnos a lo largo del año', YELLOW, 23)}
        ${bullet('Qué tan bien funcionan los descuentos y promociones', YELLOW, 23)}
      </div>
      <div style="background: ${PLUM}; border-radius: 30px; padding: 42px 40px; display: flex; flex-direction: column; gap: 20px; color: #FFFFFF;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${YELLOW};">Y para consultarlo…</span>
        <span style="font-size: 33px; font-weight: 600; line-height: 1.25; letter-spacing: -0.6px;">No hace falta aprender a usar el sistema</span>
        <span style="font-size: 21px; font-weight: 400; color: rgba(255,255,255,0.78); line-height: 1.5;">Conectamos un asistente de inteligencia artificial al sistema. Usted pregunta como le hablaría a una persona, y él consulta los datos y responde.</span>
        <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 4px;">
          ${preguntas.map(q => `<span style="background: rgba(255,255,255,0.1); border-radius: 18px 18px 18px 6px; padding: 13px 20px; font-size: 20px; font-weight: 400; color: #FFFFFF;">“${q}”</span>`).join('')}
        </div>
      </div>
    </div>
  </section>`);

// ── 6 · Fases 3 y 4 ──────────────────────────────────────────────────────
slides.push(`
  <section data-label="Fases 3 y 4" data-screen-label="Fases 3 y 4" data-speaker-notes="QR primero, comunicacion despues. El seguimiento a padres queda POR DEFINIR a proposito: no pagar por una app que nadie instala." style="${seccion()}">
    ${marca()}
    ${header('Después')}
    ${h2('Lo que sigue,<br>una vez ordenada la base')}
    <div data-a="up3" style="margin-top: 42px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px;">
      <div style="${CARD} border-radius: 28px; padding: 40px 38px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${PURPLE};">
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${PURPLE};">Fase 03</span>
        <span style="font-size: 34px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.7px; line-height: 1.2;">Entrada y salida con QR</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El familiar trae su código en el celular y se escanea con una tablet común en recepción. Queda registrada la hora, quién entregó, quién recogió y el estado de salud confirmado.</span>
        <div style="height: 1px; background: ${LINE}; margin: 4px 0;"></div>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;"><strong style="color: ${PLUM}; font-weight: 600;">Ante cualquier aclaración, la escuela tiene el registro.</strong> Es un respaldo que protege a la institución tanto como tranquiliza a la familia.</span>
      </div>
      <div style="${CARD} border-radius: 28px; padding: 40px 38px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${GREEN};">
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${GREEN};">Fase 04</span>
        <span style="font-size: 34px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.7px; line-height: 1.2;">Comunicación avanzada</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Avisos y circulares que llegan de verdad y con confirmación de lectura, alarma de emergencia y el canal de comunicación con las familias.</span>
        <div style="height: 1px; background: ${LINE}; margin: 4px 0;"></div>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Aquí también entra el <strong style="color: ${PLUM}; font-weight: 600;">seguimiento diario para los papás</strong>, si deciden que lo quieren.</span>
      </div>
    </div>
    <div style="flex: 1;"></div>
    ${nota('<strong style="font-weight: 600; color: ' + PLUM + ';">El seguimiento para padres lo dejamos a propósito sin definir.</strong> Es la parte más cara y la que más depende de qué usen realmente las familias. Con el sistema ya funcionando sabremos si conviene una aplicación, un portal o simplemente mandarlo por donde los papás ya están. Decidirlo ahora sería adivinar.', YELLOW)}
  </section>`);

// ── 7 · Cómo trabajamos ──────────────────────────────────────────────────
slides.push(`
  <section data-label="Cómo trabajamos" data-screen-label="Modelo de trabajo" data-speaker-notes="Fase 1 cerrada. Fases 2 a 4 con bloque de horas mensuales: se prioriza juntos y hay demo cada mes." style="${seccion()}">
    ${marca()}
    ${header('Modelo de trabajo')}
    ${h2('Cómo trabajamos')}
    <div data-a="up3" style="margin-top: 42px; display: grid; grid-template-columns: 1fr 1.3fr; gap: 30px; flex: 1;">
      <div style="${CARD} border-radius: 28px; padding: 42px 38px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${PINK};">
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${PINK};">Fase 1 · La web</span>
        <span style="font-size: 36px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.8px; line-height: 1.2;">Proyecto cerrado</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.55;">Es un alcance claro y acotado, así que se cotiza cerrado: precio y fecha de entrega definidos desde el inicio.</span>
      </div>
      <div style="${CARD} border-radius: 28px; padding: 42px 38px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${PURPLE};">
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${PURPLE};">Fases 2 a 4 · El sistema</span>
        <span style="font-size: 36px; font-weight: 600; color: ${PLUM}; letter-spacing: -0.8px; line-height: 1.2;">Horas de desarrollo al mes</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.55;">Un bloque de horas dedicadas al sistema cada mes. Priorizamos juntos qué módulo sigue, se entrega funcionando y se revisa en una demo.</span>
        <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 2px;">
          ${bullet('Usted decide el orden de lo que se construye', PURPLE, 21)}
          ${bullet('Ve avance real cada mes, no promesas', PURPLE, 21)}
          ${bullet('Se puede cambiar el rumbo sin renegociar nada', PURPLE, 21)}
        </div>
      </div>
    </div>
    ${nota('<strong style="font-weight: 600; color: ' + PLUM + ';">¿Por qué no cotizar todo el sistema de una vez?</strong> Porque nadie puede estimar con precisión un sistema así antes de empezar, y alguien termina perdiendo: o se infla el precio para cubrir lo desconocido, o se recorta el alcance a la mitad del camino. Cuando el sistema esté terminado, esas mismas horas se convierten en soporte y mejoras.')}
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Siguiente paso" data-screen-label="Cierre" data-speaker-notes="Cierre: arrancar con la web mientras definimos el detalle de administracion. Dejar las 3 preguntas sobre la mesa." style="background: ${PLUM}; background-image: radial-gradient(80% 70% at 20% 90%, rgba(233,75,133,0.28) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${marca(0.07, 640, 'top: 90px; right: -80px;')}
    <div data-a="ghost" style="position: absolute; right: -80px; top: -80px; width: 520px; height: 520px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
    <span data-a="up" style="font-size: 22px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${YELLOW};">Siguiente paso</span>
    <h2 data-a="up2" style="margin: 28px 0 0; font-size: 82px; font-weight: 700; letter-spacing: -2.6px; line-height: 1.05; max-width: 1300px;">Empezamos por la web,<br>y en paralelo definimos<br>la administración</h2>
    <p data-a="up3" style="margin: 32px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.8); line-height: 1.55; max-width: 1080px;">La web es lo más rápido de poner en marcha y empieza a traer familias mientras ordenamos por dentro. Para afinar la siguiente etapa necesitaríamos saber:</p>
    <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 14px; max-width: 1160px;">
      ${bullet('¿Cómo cobran hoy: efectivo, transferencia o terminal? ¿Emiten factura?', YELLOW, 25, '#FFFFFF')}
      ${bullet('¿Cuántas personas usarían el sistema y quién lo administraría?', YELLOW, 25, '#FFFFFF')}
      ${bullet('¿Hay una fecha objetivo, como el inicio del ciclo escolar?', YELLOW, 25, '#FFFFFF')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuesta · La Casita Feliz</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${PLUM}; }
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
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;
    background: rgba(91,33,104,0.88); color: #FFFFFF; cursor: pointer;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
  #ver-video {
    position: fixed; top: 16px; right: 148px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;
    background: ${PINK}; color: #FFFFFF; cursor: pointer; text-decoration: none;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px;
    opacity: 0.85; transition: opacity 160ms ease;
  }
  #ver-video:hover { opacity: 1; }
  #ver-video[data-on] { opacity: 0; pointer-events: none; }
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
  var video = document.createElement('a');
  video.id = 'ver-video';
  video.href = 'video.mp4';
  video.textContent = '▶ Ver video · 1:21';
  function render() {
    btn.textContent = presenting ? 'Salir · Esc' : 'Presentar · P';
    if (presenting) { btn.setAttribute('data-on', ''); video.setAttribute('data-on', ''); }
    else { btn.removeAttribute('data-on'); video.removeAttribute('data-on'); }
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
  document.body.appendChild(video);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
