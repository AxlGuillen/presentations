// Generador de index.html — Propuesta: sistema integral para estancia infantil
// Ejecutar: node estancia/gen.js
const fs = require('fs');

// ── Identidad ────────────────────────────────────────────────────────────
const CREAM = '#FFFBF7';
const TEAL = '#123B4A';        // primario oscuro
const TEAL_MID = '#1E5A6E';
const CORAL = '#FF7A59';       // acento cálido
const AMBER = '#FFB547';
const GREEN = '#2FA37A';
const INK = '#16262E';
const MUTED = '#6B7C85';
const LINE = '#E9E1D9';

// Nombre de la escuela: reemplazar cuando el cliente lo confirme.
const ESCUELA = 'la estancia';
const ESCUELA_TITULO = '[ Nombre de la estancia ]';

const FONT = `'Poppins', ui-sans-serif, system-ui, sans-serif`;
const CARD = `background: #FFFFFF; border: 1px solid ${LINE}; box-shadow: 0 10px 28px rgba(18, 59, 74, 0.06);`;

// ── Helpers ──────────────────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 120px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE};">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="width: 40px; height: 40px; border-radius: 13px; background: ${TEAL}; display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 21px; font-weight: 700;">e</span>
        <span style="font-size: 21px; font-weight: 600; color: ${TEAL}; letter-spacing: -0.2px;">Propuesta de sistema integral</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${CORAL};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = (base = '') => `background: ${CREAM}; font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 176px 100px 74px; box-sizing: border-box; overflow: hidden; ${base}`;

const h2 = (txt, size = 62) =>
  `<h2 data-a="up" style="margin: 0; font-size: ${size}px; font-weight: 700; color: ${TEAL}; letter-spacing: -1.6px; line-height: 1.05;">${txt}</h2>`;

const bajada = txt =>
  `<p data-a="up2" style="margin: 20px 0 0; font-size: 27px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: 1320px;">${txt}</p>`;

const pill = (txt, bg, color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 8px 22px; letter-spacing: 0.5px; white-space: nowrap;">${txt}</span>`;

/** Tarjeta con número/ícono, título y texto. */
const tarjeta = (num, titulo, texto, acento = CORAL) => `
        <div style="${CARD} border-radius: 24px; padding: 34px 34px 32px; display: flex; flex-direction: column; gap: 12px;">
          <span style="width: 54px; height: 54px; border-radius: 16px; background: ${acento}1A; color: ${acento}; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">${num}</span>
          <span style="font-size: 27px; font-weight: 600; color: ${TEAL}; letter-spacing: -0.4px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

/** Fila de bullet con check. */
const bullet = (txt, acento = GREEN) => `
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <span style="flex: none; margin-top: 5px; width: 26px; height: 26px; border-radius: 50%; background: ${acento}1F; color: ${acento}; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700;">✓</span>
            <span style="font-size: 24px; font-weight: 400; color: ${INK}; line-height: 1.4;">${txt}</span>
          </div>`;

// ── Diapositivas ─────────────────────────────────────────────────────────
const slides = [];

// 1 · Portada
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Presentacion de la propuesta. Sistema integral para la estancia infantil, construido por fases." style="background: ${TEAL}; background-image: radial-gradient(90% 70% at 85% 15%, rgba(255,122,89,0.28) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div data-a="ghost" style="position: absolute; right: -60px; bottom: -120px; width: 620px; height: 620px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
    <div data-a="ghost" style="position: absolute; right: 190px; top: -90px; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,181,71,0.12);"></div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px;">
      <span style="width: 46px; height: 46px; border-radius: 15px; background: ${CORAL}; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">e</span>
      <span style="font-size: 23px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.75);">${ESCUELA_TITULO}</span>
    </div>
    <h1 data-a="up2" style="margin: 46px 0 0; font-size: 104px; font-weight: 700; letter-spacing: -3.5px; line-height: 1.02; max-width: 1350px;">Un sistema que acompaña<br>el día completo de<br>cada niño</h1>
    <p data-a="up3" style="margin: 36px 0 0; font-size: 30px; font-weight: 400; color: rgba(255,255,255,0.8); line-height: 1.5; max-width: 1080px;">Propuesta de desarrollo por fases: presencia web, operación diaria, control de cobranza y comunicación con las familias.</p>
    <div data-a="up3" style="margin-top: 54px; display: flex; gap: 14px;">
      ${pill('4 fases', 'rgba(255,255,255,0.14)')}
      ${pill('Web + app para padres', 'rgba(255,255,255,0.14)')}
      ${pill('Hasta 60 menores', 'rgba(255,255,255,0.14)')}
    </div>
  </section>`);

// 2 · Lo que entendimos
slides.push(`
  <section data-label="Lo que entendimos" data-screen-label="Lo que entendimos" data-speaker-notes="Demostrar que escuchamos: repetir su operacion tal como nos la contaron antes de proponer nada." style="${seccion()}">
    ${header('Contexto')}
    ${h2('Lo que entendimos de su operación')}
    ${bajada('Antes de proponer tecnología, así es como funciona hoy la escuela. Si algo de esto no es exacto, lo ajustamos juntos.')}
    <div data-a="up3" style="margin-top: 52px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px;">
      ${tarjeta('60', 'Hasta 60 menores', 'Desde los 2 meses de edad, con necesidades muy distintas entre lactantes y preescolares.', CORAL)}
      ${tarjeta('1×1', 'Reporte diario', 'Cada maestra entrega un reporte individual del día de cada alumno a su familia.', TEAL_MID)}
      ${tarjeta('★', 'Programa formativo', 'Materias enfocadas en motricidad fina y desarrollo cognitivo.', AMBER)}
      ${tarjeta('♥', 'Trato cercano', 'Comunicación constante con los padres: es parte del valor de la escuela.', GREEN)}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="background: ${TEAL}0D; border-left: 5px solid ${TEAL}; border-radius: 0 18px 18px 0; padding: 26px 34px; font-size: 24px; font-weight: 400; color: ${TEAL}; line-height: 1.5;">
      El objetivo no es cambiar cómo trabajan, sino <strong style="font-weight: 600;">quitarles trabajo administrativo</strong> y dejar registro de lo que hoy se pierde en papel.
    </div>
  </section>`);

// 3 · El reto
slides.push(`
  <section data-label="El reto de hoy" data-screen-label="El reto" data-speaker-notes="Los dolores. Ojo: son hipotesis, hay que validarlas en la junta y ajustar." style="${seccion()}">
    ${header('Diagnóstico')}
    ${h2('Lo que hoy vive en papel,<br>en WhatsApp o en la memoria')}
    <div data-a="up3" style="margin-top: 48px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px;">
      ${tarjeta('01', 'El reporte diario se queda en el papel', 'Se llena a mano y se entrega. No hay historial consultable: si un padre pregunta cómo comió su hijo la semana pasada, no hay dónde buscarlo.', CORAL)}
      ${tarjeta('02', 'La comunicación está dispersa', 'Los avisos importantes se mezclan con conversaciones personales en WhatsApp. Nadie sabe con certeza quién leyó qué.', CORAL)}
      ${tarjeta('03', 'La entrada y salida no deja constancia', 'No queda registro formal de a qué hora ni a quién se entregó al menor, ni del estado de salud confirmado por ambas partes.', CORAL)}
      ${tarjeta('04', 'La cobranza consume horas', 'Saber quién debe, cuánto y desde cuándo depende de una libreta, un Excel y la memoria de alguien.', CORAL)}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Ninguno de estos puntos es una falla de la escuela: es lo que pasa cuando la operación crece y las herramientas siguen siendo manuales.</div>
  </section>`);

// 4 · La visión
slides.push(`
  <section data-label="Hacia dónde vamos" data-screen-label="La visión" data-speaker-notes="La vision: que cada dia quede registrado, cada familia informada y la administracion deje de perseguir papeles." style="${seccion()}">
    ${header('Visión')}
    ${h2('Lo mismo que hacen hoy,<br>con registro y sin fricción')}
    <div data-a="up3" style="margin-top: 52px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; flex: 1;">
      <div style="${CARD} border-radius: 26px; padding: 44px 38px; display: flex; flex-direction: column; gap: 20px;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${CORAL};">Para las familias</span>
        <span style="font-size: 32px; font-weight: 600; color: ${TEAL}; line-height: 1.25; letter-spacing: -0.5px;">Saber cómo estuvo su hijo, sin tener que preguntar</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El reporte del día llega a su celular con fotos. Los avisos de la escuela no se pierden entre mensajes.</span>
      </div>
      <div style="${CARD} border-radius: 26px; padding: 44px 38px; display: flex; flex-direction: column; gap: 20px;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${TEAL_MID};">Para las maestras</span>
        <span style="font-size: 32px; font-weight: 600; color: ${TEAL}; line-height: 1.25; letter-spacing: -0.5px;">Menos papeleo, más tiempo con los niños</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El reporte se llena a toques desde una tablet o celular, en segundos, sin escribir párrafos.</span>
      </div>
      <div style="${CARD} border-radius: 26px; padding: 44px 38px; display: flex; flex-direction: column; gap: 20px;">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${GREEN};">Para la dirección</span>
        <span style="font-size: 32px; font-weight: 600; color: ${TEAL}; line-height: 1.25; letter-spacing: -0.5px;">Control de quién pagó, quién debe y qué pasó cada día</span>
        <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Y una bitácora que respalda a la institución ante cualquier aclaración.</span>
      </div>
    </div>
  </section>`);

// 5 · El plan por fases
const fasesResumen = [
  ['01', 'Presencia web', 'La cara pública de la escuela: sitio, programa, blog y captación de informes.', CORAL, 'Proyecto cerrado'],
  ['02', 'Operación diaria', 'Reporte diario, entrada/salida con QR y portal para padres. El corazón del sistema.', TEAL_MID, 'Desarrollo continuo'],
  ['03', 'Control de cobranza', 'Estado de cuenta por alumno, adeudos y recordatorios automáticos.', AMBER, 'Desarrollo continuo'],
  ['04', 'Comunicación avanzada', 'Chat con las familias, muro de la escuela y métricas.', GREEN, 'Desarrollo continuo'],
];
slides.push(`
  <section data-label="El plan por fases" data-screen-label="El plan" data-speaker-notes="Cada fase entrega algo usable por si sola. Fases 2 y 3 se pueden invertir segun donde duela mas: cobrar o llenar lugares." style="${seccion()}">
    ${header('El plan')}
    ${h2('Cuatro fases, cada una<br>útil por sí sola')}
    ${bajada('No hay que esperar al final para ver resultados: al terminar cada fase la escuela ya está usando algo.')}
    <div data-a="up3" style="margin-top: 46px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; flex: 1;">
      ${fasesResumen.map(([n, t, d, c, modo]) => `
        <div style="${CARD} border-radius: 26px; padding: 38px 32px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${c};">
          <span style="font-size: 54px; font-weight: 700; color: ${c}; letter-spacing: -2px; line-height: 1;">${n}</span>
          <span style="font-size: 29px; font-weight: 600; color: ${TEAL}; letter-spacing: -0.5px; line-height: 1.2;">${t}</span>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.45; flex: 1;">${d}</span>
          <span style="font-size: 17px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${c};">${modo}</span>
        </div>`).join('')}
    </div>
    <div data-a="up3" style="margin-top: 34px; font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El orden de las fases 2 y 3 puede intercambiarse: si la prioridad es cobrar a tiempo, empezamos por cobranza; si es diferenciarse para llenar lugares, empezamos por la operación diaria.</div>
  </section>`);

// 6 · Fase 1
slides.push(`
  <section data-label="Fase 1 · Presencia web" data-screen-label="Fase 1" data-speaker-notes="Fase 1: sitio publico. Rapido, barato, se paga solo porque capta inscripciones. Modalidad proyecto cerrado." style="${seccion()}">
    ${header('Fase 01', pill('Proyecto cerrado', CORAL))}
    <div style="display: flex; gap: 70px; flex: 1;">
      <div style="flex: 1.05; display: flex; flex-direction: column;">
        ${h2('Presencia web', 74)}
        ${bajada('La cara pública de la escuela: lo primero que ve una mamá o un papá que está buscando dónde dejar a su hijo.')}
        <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 20px;">
          ${bullet('Inicio, filosofía, programa e instalaciones', CORAL)}
          ${bullet('Blog para publicar noticias y actividades', CORAL)}
          ${bullet('Formulario de informes que llega directo a la escuela', CORAL)}
          ${bullet('Diseñada para celular y para aparecer en buscadores', CORAL)}
        </div>
      </div>
      <div style="flex: 0.95; display: flex; flex-direction: column; justify-content: center;">
        <div style="${CARD} border-radius: 28px; padding: 46px 44px; display: flex; flex-direction: column; gap: 22px;">
          <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${CORAL};">Por qué empezar aquí</span>
          <span style="font-size: 34px; font-weight: 600; color: ${TEAL}; line-height: 1.25; letter-spacing: -0.6px;">Es la fase que se paga sola</span>
          <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.55;">Sale a producción en semanas, no en meses. Empieza a captar inscripciones desde el primer día y da algo tangible sobre lo que seguir construyendo.</span>
          <div style="height: 1px; background: ${LINE};"></div>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Alcance, precio y fecha definidos desde el inicio.</span>
        </div>
      </div>
    </div>
  </section>`);

// 7 · Fase 2
slides.push(`
  <section data-label="Fase 2 · Operación diaria" data-screen-label="Fase 2" data-speaker-notes="Fase 2 es el corazon. Aqui los padres ya reciben la app instalable: la app NO es una fase aparte." style="${seccion()}">
    ${header('Fase 02', pill('El corazón del sistema', TEAL_MID))}
    ${h2('Operación diaria')}
    ${bajada('Todo lo que ocurre con un niño durante el día queda registrado, y su familia lo ve en su celular.')}
    <div data-a="up3" style="margin-top: 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; flex: 1;">
      ${tarjeta('◧', 'Padrón y grupos', 'Alumnos, familias autorizadas, maestras y grupos. La base sobre la que funciona todo lo demás.', TEAL_MID)}
      ${tarjeta('✎', 'Reporte diario digital', 'Comidas, siestas, cambios, ánimo, actividades y fotos. En segundos, sin escribir.', TEAL_MID)}
      ${tarjeta('⇄', 'Entrada y salida con QR', 'Quién entrega, quién recoge, a qué hora y en qué estado de salud. Con bitácora.', TEAL_MID)}
      ${tarjeta('▣', 'Portal para padres', 'Aplicación instalable en el celular: el día de su hijo, fotos y avisos de la escuela.', TEAL_MID)}
      ${tarjeta('◈', 'Avisos y circulares', 'Comunicados que llegan como notificación y con confirmación de lectura.', TEAL_MID)}
      ${tarjeta('!', 'Alarma de emergencia', 'Difusión inmediata a todas las familias cuando algo urgente ocurre.', CORAL)}
    </div>
  </section>`);

// 8 · El reporte diario
slides.push(`
  <section data-label="El reporte diario" data-screen-label="Reporte diario" data-speaker-notes="La clave de exito del proyecto: si llenar un reporte tarda mas de 30 segundos, las maestras lo abandonan." style="${seccion()}">
    ${header('Fase 02 · A fondo')}
    <div style="display: flex; gap: 70px; flex: 1;">
      <div style="flex: 1; display: flex; flex-direction: column;">
        ${h2('El reporte diario,<br>en 30 segundos', 66)}
        ${bajada('Una maestra con diez bebés no puede escribir párrafos. Por eso el reporte se llena <strong style="color: ' + TEAL + '; font-weight: 600;">a toques, no con el teclado</strong>.')}
        <div data-a="up3" style="margin-top: 38px; display: flex; flex-direction: column; gap: 18px;">
          ${bullet('Opciones predefinidas: comió todo / la mitad / poco', TEAL_MID)}
          ${bullet('Siestas, cambios de pañal y estado de ánimo con un toque', TEAL_MID)}
          ${bullet('Acciones en grupo: marca a todo el salón y ajusta las excepciones', TEAL_MID)}
          ${bullet('Fotos del día, que es lo que más valoran los padres', TEAL_MID)}
        </div>
      </div>
      <div style="flex: 0.85; display: flex; flex-direction: column; justify-content: center; gap: 24px;">
        <div style="${CARD} border-radius: 28px; padding: 40px 38px; display: flex; flex-direction: column; gap: 14px; border-left: 6px solid ${CORAL};">
          <span style="font-size: 26px; font-weight: 600; color: ${TEAL}; line-height: 1.3;">Aquí se decide si el sistema vive o muere</span>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">La razón número uno por la que fracasan estos sistemas es que las maestras dejan de usarlos porque les quitan tiempo. Todo el diseño está puesto en evitar eso.</span>
        </div>
        <div style="${CARD} border-radius: 28px; padding: 40px 38px; display: flex; flex-direction: column; gap: 14px; border-left: 6px solid ${GREEN};">
          <span style="font-size: 26px; font-weight: 600; color: ${TEAL}; line-height: 1.3;">Del otro lado</span>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El padre recibe una notificación, abre y ve el día completo de su hijo con fotos. Sin pedirlo, sin preguntar en la puerta.</span>
        </div>
      </div>
    </div>
  </section>`);

// 9 · Entrada y salida
slides.push(`
  <section data-label="Entrada y salida" data-screen-label="Entrada y salida" data-speaker-notes="Argumento fuerte de venta: la bitacora protege legalmente a la escuela, no es solo comodidad." style="${seccion()}">
    ${header('Fase 02 · A fondo')}
    <div style="display: flex; gap: 70px; flex: 1;">
      <div style="flex: 1; display: flex; flex-direction: column;">
        ${h2('Entrada y salida:<br>tranquilidad y respaldo', 66)}
        ${bajada('El padre trae su código QR en el celular y en recepción se escanea con una tablet común. Sin equipos especiales.')}
        <div data-a="up3" style="margin-top: 38px; display: flex; flex-direction: column; gap: 18px;">
          ${bullet('Hora exacta de entrada y de salida')}
          ${bullet('Quién entregó y quién recogió, de la lista de personas autorizadas')}
          ${bullet('Confirmación del estado de salud del menor por ambas partes')}
          ${bullet('Foto del momento, opcional')}
        </div>
      </div>
      <div style="flex: 0.9; display: flex; align-items: center;">
        <div style="background: ${TEAL}; border-radius: 30px; padding: 52px 46px; display: flex; flex-direction: column; gap: 22px; color: #FFFFFF;">
          <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${AMBER};">El valor que no se ve</span>
          <span style="font-size: 36px; font-weight: 600; line-height: 1.25; letter-spacing: -0.7px;">Ante una aclaración, la escuela tiene el registro</span>
          <span style="font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.8); line-height: 1.55;">Una bitácora con hora, persona y estado de salud confirmado protege a la institución tanto como tranquiliza a la familia. Es el tipo de respaldo que solo se echa de menos el día que hace falta.</span>
        </div>
      </div>
    </div>
  </section>`);

// 10 · Fase 3
slides.push(`
  <section data-label="Fase 3 · Cobranza" data-screen-label="Fase 3" data-speaker-notes="Cobranza, NO contabilidad. Aclarar que no sustituye al contador ni emite facturas: eso se integra si hace falta." style="${seccion()}">
    ${header('Fase 03', pill('ROI directo', AMBER, INK))}
    ${h2('Control de cobranza')}
    ${bajada('El control que hoy vive en una libreta o un Excel, automatizado y siempre al día.')}
    <div data-a="up3" style="margin-top: 46px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
      ${tarjeta('$', 'Estado de cuenta', 'Por alumno: qué pagó, cuánto debe y desde cuándo.', AMBER)}
      ${tarjeta('◷', 'Recordatorios', 'Avisos automáticos a los padres antes y después del vencimiento.', AMBER)}
      ${tarjeta('▤', 'Colegiaturas', 'Conceptos, fechas de corte, descuentos y recargos según sus reglas.', AMBER)}
      ${tarjeta('◔', 'Reportes', 'Ingresos del mes y lista de morosidad, de un vistazo.', AMBER)}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="background: #FFFFFF; border: 1px solid ${LINE}; border-radius: 20px; padding: 30px 36px; display: flex; align-items: flex-start; gap: 20px;">
      <span style="flex: none; width: 34px; height: 34px; border-radius: 50%; background: ${TEAL}14; color: ${TEAL}; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700;">i</span>
      <span style="font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.5;"><strong style="color: ${TEAL}; font-weight: 600;">Esto no sustituye a su contador ni emite facturas.</strong> Es control de cobranza. Si más adelante necesitan facturación fiscal, se conecta con un proveedor autorizado en lugar de construirla desde cero: es más rápido, más barato y siempre está al día con los cambios del SAT.</span>
    </div>
  </section>`);

// 11 · Fase 4
slides.push(`
  <section data-label="Fase 4 · Comunicación" data-screen-label="Fase 4" data-speaker-notes="Fase 4 al final a proposito: el chat es lo mas caro y lo que mas carga operativa mete a las maestras." style="${seccion()}">
    ${header('Fase 04', pill('Al final, a propósito', GREEN))}
    ${h2('Comunicación avanzada')}
    ${bajada('Se construye cuando el sistema ya está en uso y sabemos qué comunicación hace falta de verdad.')}
    <div data-a="up3" style="margin-top: 46px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px;">
      ${tarjeta('◍', 'Chat con las familias', 'Conversación por alumno entre maestra y padres, dentro del sistema y con historial.', GREEN)}
      ${tarjeta('◫', 'Muro de la escuela', 'Publicaciones, eventos y galería para toda la comunidad.', GREEN)}
      ${tarjeta('◎', 'Métricas', 'Asistencia, participación y uso del sistema para la dirección.', GREEN)}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="background: ${GREEN}0F; border-left: 5px solid ${GREEN}; border-radius: 0 18px 18px 0; padding: 28px 34px; font-size: 23px; font-weight: 400; color: ${INK}; line-height: 1.5;">
      <strong style="font-weight: 600; color: ${TEAL};">Por qué el chat va al final:</strong> es la función más costosa de construir y la que más carga operativa le mete a las maestras. Antes de abrir un canal de mensajes que alguien tiene que contestar todo el día, conviene tener resuelto el reporte diario y los avisos — que es lo que la mayoría de los padres realmente quiere.
    </div>
  </section>`);

// 12 · Decisiones técnicas
slides.push(`
  <section data-label="Decisiones que cuidan su inversión" data-screen-label="Decisiones técnicas" data-speaker-notes="Slide de credibilidad: mostrar donde NO gastamos su dinero y por que." style="${seccion()}">
    ${header('Enfoque técnico')}
    ${h2('Decisiones que cuidan<br>su inversión')}
    ${bajada('Tan importante como lo que se construye es lo que decidimos no construir.')}
    <div data-a="up3" style="margin-top: 46px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; flex: 1;">
      ${tarjeta('◱', 'App instalable, no app de tienda', 'Los padres la instalan desde el navegador y funciona igual en Android y iPhone. Sin pagos anuales a Apple ni Google, sin esperar aprobaciones y con actualizaciones inmediatas.', TEAL_MID)}
      ${tarjeta('▭', 'Sin hardware a la medida', 'Una tablet común en recepción hace de terminal de entrada y salida. Nada que mandar fabricar, instalar ni reparar.', TEAL_MID)}
      ${tarjeta('◰', 'No reinventamos la facturación', 'Si hace falta CFDI, se integra un proveedor autorizado. Son semanas de desarrollo que no tiene sentido cobrarles.', TEAL_MID)}
      ${tarjeta('☁', 'Infraestructura administrada', 'Sin servidores propios que mantener ni actualizar. Para una escuela de 60 alumnos el costo mensual de operación es mínimo.', TEAL_MID)}
    </div>
  </section>`);

// 13 · Cómo trabajamos
slides.push(`
  <section data-label="Cómo trabajamos" data-screen-label="Modelo de trabajo" data-speaker-notes="Modelo comercial: fase 1 cerrada, fases 2-4 con bloque de horas mensuales. Explicar por que conviene a AMBAS partes." style="${seccion()}">
    ${header('Modelo de trabajo')}
    ${h2('Cómo trabajamos')}
    <div data-a="up3" style="margin-top: 44px; display: grid; grid-template-columns: 1fr 1.25fr; gap: 30px; flex: 1;">
      <div style="${CARD} border-radius: 28px; padding: 44px 40px; display: flex; flex-direction: column; gap: 18px; border-top: 6px solid ${CORAL};">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${CORAL};">Fase 1</span>
        <span style="font-size: 38px; font-weight: 600; color: ${TEAL}; letter-spacing: -0.8px; line-height: 1.2;">Proyecto cerrado</span>
        <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.55;">El sitio web tiene un alcance claro y acotado, así que se cotiza cerrado: precio y fecha de entrega definidos desde el inicio.</span>
      </div>
      <div style="${CARD} border-radius: 28px; padding: 44px 40px; display: flex; flex-direction: column; gap: 18px; border-top: 6px solid ${TEAL_MID};">
        <span style="font-size: 20px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${TEAL_MID};">Fases 2 a 4</span>
        <span style="font-size: 38px; font-weight: 600; color: ${TEAL}; letter-spacing: -0.8px; line-height: 1.2;">Desarrollo continuo por módulos</span>
        <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.55;">Un bloque de horas de desarrollo dedicadas al sistema cada mes. Cada mes: priorizamos juntos qué módulo sigue, se entrega funcionando y se revisa en una demo.</span>
        <div style="height: 1px; background: ${LINE};"></div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${bullet('Ustedes deciden el orden de lo que se construye', TEAL_MID)}
          ${bullet('Ven avance real cada mes, no promesas', TEAL_MID)}
          ${bullet('Se puede ajustar el rumbo sin renegociar un contrato', TEAL_MID)}
        </div>
      </div>
    </div>
    <div data-a="up3" style="margin-top: 30px; background: ${TEAL}0D; border-left: 5px solid ${TEAL}; border-radius: 0 18px 18px 0; padding: 26px 34px; font-size: 23px; font-weight: 400; color: ${INK}; line-height: 1.5;">
      <strong style="font-weight: 600; color: ${TEAL};">¿Por qué no cotizar el sistema completo de una vez?</strong> Porque nadie puede estimar con precisión un sistema de este tamaño antes de empezar, y alguien termina perdiendo: o se infla el precio para cubrir lo desconocido, o se recorta el alcance a la mitad del camino. Cuando el sistema esté terminado, esas mismas horas se convierten en soporte, mantenimiento y mejoras.
    </div>
  </section>`);

// 14 · Privacidad
slides.push(`
  <section data-label="Datos de menores" data-screen-label="Privacidad" data-speaker-notes="Datos de menores = datos sensibles. Mencionarlo posiciona como el proveedor serio. Recomendar revisar el aviso de privacidad con su abogado." style="${seccion()}">
    ${header('Responsabilidad')}
    ${h2('Estamos manejando datos<br>de menores de edad')}
    ${bajada('Fotos, reportes de salud y datos de familias. Eso exige cuidado desde el diseño, no como un parche al final.')}
    <div data-a="up3" style="margin-top: 48px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; flex: 1;">
      ${tarjeta('§', 'Aviso de privacidad y consentimiento', 'Cada familia acepta explícitamente qué datos se guardan y para qué, incluida la autorización para tomar y compartir fotografías.', TEAL_MID)}
      ${tarjeta('◐', 'Cada quien ve solo lo suyo', 'Un padre ve únicamente a su hijo. Una maestra, solo a su grupo. La dirección, todo. Definido por permisos, no por confianza.', TEAL_MID)}
      ${tarjeta('◭', 'Fotos con criterio', 'Solo se comparten con las familias autorizadas, cuidando que no aparezcan menores cuyos padres no dieron su consentimiento.', TEAL_MID)}
      ${tarjeta('◫', 'Respaldos y bitácora', 'Copias de seguridad automáticas y registro de quién accedió a qué información.', TEAL_MID)}
    </div>
  </section>`);

// 15 · Lo que necesitamos
slides.push(`
  <section data-label="Lo que necesitamos de ustedes" data-screen-label="Siguientes datos" data-speaker-notes="Preguntas abiertas que cambian el alcance. Sacarlas en la junta y anotar respuestas." style="${seccion()}">
    ${header('Para afinar la propuesta')}
    ${h2('Lo que necesitamos<br>saber de ustedes')}
    ${bajada('Estas respuestas definen el alcance real y el calendario. Ninguna detiene el arranque de la Fase 1.')}
    <div data-a="up3" style="margin-top: 44px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 60px;">
      ${bullet('¿Las maestras usarían su propio celular o la escuela proveería tablets?', CORAL)}
      ${bullet('¿Hoy emiten facturas (CFDI) o entregan recibos?', CORAL)}
      ${bullet('¿Cómo cobran actualmente: efectivo, transferencia, terminal?', CORAL)}
      ${bullet('¿Cuántas maestras y personal usarían el sistema?', CORAL)}
      ${bullet('¿Ya tienen consentimiento firmado para fotografiar a los menores?', CORAL)}
      ${bullet('¿Quién sería la persona administradora del sistema?', CORAL)}
      ${bullet('¿Tienen logo, manual de marca y dominio de internet?', CORAL)}
      ${bullet('¿Hay una fecha objetivo, como el inicio del ciclo escolar?', CORAL)}
    </div>
  </section>`);

// 16 · Cierre
slides.push(`
  <section data-label="Siguiente paso" data-screen-label="Cierre" data-speaker-notes="Cierre: proponer arrancar fase 1 y agendar la sesion de alcance." style="background: ${TEAL}; background-image: radial-gradient(80% 70% at 20% 90%, rgba(255,122,89,0.26) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div data-a="ghost" style="position: absolute; right: -80px; top: -80px; width: 520px; height: 520px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
    <span data-a="up" style="font-size: 22px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${AMBER};">Siguiente paso</span>
    <h2 data-a="up2" style="margin: 30px 0 0; font-size: 88px; font-weight: 700; letter-spacing: -2.8px; line-height: 1.05; max-width: 1280px;">Empecemos por la<br>presencia web</h2>
    <p data-a="up3" style="margin: 34px 0 0; font-size: 28px; font-weight: 400; color: rgba(255,255,255,0.8); line-height: 1.55; max-width: 1080px;">Es la fase más rápida de poner en marcha y la que empieza a traer inscripciones mientras construimos el resto. Definimos juntos el alcance y el calendario, y arrancamos.</p>
    <div data-a="up3" style="margin-top: 54px; display: flex; gap: 16px;">
      ${pill('Sesión de alcance', 'rgba(255,255,255,0.14)')}
      ${pill('Calendario de Fase 1', 'rgba(255,255,255,0.14)')}
      ${pill('Propuesta económica', 'rgba(255,255,255,0.14)')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuesta · Sistema integral para estancia infantil</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${TEAL}; }
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
    background: rgba(18,59,74,0.85); color: #FFFFFF; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
