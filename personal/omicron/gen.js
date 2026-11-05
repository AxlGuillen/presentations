// Generador de index.html — Propuesta: sitio web nuevo para MT Omicron Sigma Technologies
// Ejecutar: node personal/omicron/gen.js
//
// PRIMERA VERSIÓN (29/10/2026), armada para ir avanzando antes de la reunión.
// SEGUNDA PASADA (4/11/2026), con lo que pidió Andrea: el deck marcaba demasiado que
// son «dos públicos» y «dos puertas», así que ahora habla de SUS PRODUCTOS en general
// (el sitio sigue sirviendo a todos, pero sin pedirle a nadie que elija un lado), y
// suma una lámina para que la mamá de Andrea hable de las relaciones corporativas, con
// su resumen del 4/11 («Propuesta de colaboración empresarial»; el texto largo va en
// las notas del orador y en pantalla solo lo mínimo).
// TERCERA PASADA (4/11/2026), decisiones de Axl: la inversión del sitio es de $5,000 (MXN),
// se quita la medición (no se ofrece analítica ni «qué vamos a medir») y el boletín pasa
// a ser un BLOG, sin suscripción ni correos por ahora, porque Axl no quiere manejar
// altas ni cobros dentro del sitio.
// CUARTA PASADA (4/11/2026): la presentación pasa a ser de los TRES SERVICIOS, en el orden
// que pidió Axl —redes sociales, relaciones públicas y, al final, el sitio web—, y la parte
// del sitio se reduce a dos láminas (el inicio y las ocho secciones). Se quitaron catálogo,
// evidencia, cómo vende, lo que se dice, blog y plan (siguen en el historial de git). Entra el
// paquete de redes de Andrea con su precio y una lámina de inversión con los tres servicios.
// QUINTA PASADA (4/11/2026): llegó el Portafolio EsteriLife (45 págs.: carta, fichas del
// desinfectante y del antiséptico, estudios, informes de laboratorio y hoja de seguridad). Se
// nombra la tecnología (superoxidación con pH neutro), el portafolio entra como pieza de
// «Evidencia» y el cierre pide informes recientes. Su revisión completa, con lo que le falta y
// lo que no se debe afirmar, vive en INVESTIGACION.md §11 (no se sube).
// Alcance del sitio: catálogo, evidencia, cómo comprar y un blog.
//
// ⚠️ El sitio es PÚBLICO. Por eso el deck NO trae los informes de laboratorio (traen
// nombres de analistas, del representante legal y del MVZ responsable), ni los
// números de registro, ni las inconsistencias entre los materiales del cliente
// (año de la empresa, presentaciones, fórmula, estudios). Esas se resuelven con el
// cliente en la reunión y viven en omicron/INVESTIGACION.md, que no se sube.
// Lleva noindex: se comparte por enlace, no debe salir en buscadores.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Identidad · colores de EsteriLife, Zoolubac y el logo de MT ──────────
const NAVY = '#06425C';       // EsteriLife · "Esteri"
const TEAL = '#62C7C4';       // EsteriLife · "Life"
const TEAL_T = '#1F8F8B';     // el mismo teal, oscurecido para texto sobre claro
const ORANGE = '#D35E15';     // Zoolubac · "lubac"
const GOLD = '#E8B857';       // Zoolubac · "Zoo"
const SLATE = '#6E7785';      // gris del logo de MT (marca madre)
const BG = '#F3F7F7';         // fondo, blanco azulado
const INK = '#17262E';
const MUTED = '#5D6B73';
const LINE = '#DCE6E8';

const FONT = `'Montserrat', ui-sans-serif, system-ui, sans-serif`;
const CARD = `background: #FFFFFF; border: 1px solid ${LINE}; box-shadow: 0 10px 28px rgba(6,66,92,0.07);`;

// El equipo: tres frentes, una sola cara para el cliente.
const EQUIPO = [
  ['Andrea Hasly Guillen Luna', 'Redes sociales'],
  ['Ángeles Luna', 'Relaciones públicas'],
  ['Axl Guillén', 'Sitio web'],
];

// ── Precios (MXN) ────────────────────────────────────────────────────────
// Redes: el paquete de Andrea que nos dieron —el de ejemplo, Changarro 84 (14 publicaciones,
// 4 videos, 10 gráficos, 4 coberturas y 4 diseños extraordinarios, $10,000 al mes)—.
// ⚠️ Confirmar con Andrea que es el que se le ofrece a Omicron.
// Relaciones corporativas (Ángeles Luna): $5,000 al mes, **en paquete con redes** (5/11/2026,
// dicho por Axl): redes $10,000 + relaciones $5,000 = **$15,000 al mes**. Su resumen decía
// «honorarios mensuales por acordar»; ya están acordados y el resumen va tal cual en las notas.
// Sitio: $5,000 pago único (Axl), aparte del paquete mensual.
const PRECIO_REDES = '$10,000';
const PRECIO_RP = '$5,000';
const PRECIO_PAQUETE = '$15,000';
const PRECIO_WEB = '$5,000';

// ── Helpers ──────────────────────────────────────────────────────────────
const logoMT = (alto = 52, claro = false) =>
  `<img src="assets/logo-mt${claro ? '-claro' : ''}.png" alt="MT Omicron Sigma Technologies" style="height: ${alto}px; width: auto; display: block;">`;

const logoEst = (alto = 40) => `<img src="assets/logo-esterilife.png" alt="EsteriLife" style="height: ${alto}px; width: auto; display: block;">`;
const logoZoo = (alto = 40) => `<img src="assets/logo-zoolubac.png" alt="Zoolubac" style="height: ${alto}px; width: auto; display: block;">`;

const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 116px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE};">
      <div style="display: flex; align-items: center; gap: 18px;">
        ${logoMT(64)}
        <span style="font-size: 20px; font-weight: 600; color: ${NAVY}; letter-spacing: -0.2px;">Propuesta · MT Omicron Sigma</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 19px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${TEAL_T};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `background: ${BG}; font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 168px 100px 64px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 62) =>
  `<h2 data-a="up" style="margin: 0; font-size: ${size}px; font-weight: 700; color: ${NAVY}; letter-spacing: -1.8px; line-height: 1.07;">${txt}</h2>`;

const bajada = (txt, max = 1400) =>
  `<p data-a="up2" style="margin: 20px 0 0; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const pill = (txt, bg, color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 18px; font-weight: 600; border-radius: 999px; padding: 8px 22px; letter-spacing: 0.4px; white-space: nowrap;">${txt}</span>`;

const etiqueta = (txt, color) =>
  `<span style="font-size: 19px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${color};">${txt}</span>`;

const bullet = (txt, acento = TEAL_T, size = 23, color = INK, marca = '✓') => `
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <span style="flex: none; margin-top: 3px; width: 26px; height: 26px; border-radius: 50%; background: ${acento}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700;">${marca}</span>
            <span style="font-size: ${size}px; font-weight: 400; color: ${color}; line-height: 1.4;">${txt}</span>
          </div>`;

const nota = (txt, color = NAVY) => `
    <div data-a="up3" style="background: ${color}0D; border-left: 5px solid ${color}; border-radius: 0 16px 16px 0; padding: 22px 30px; font-size: 21px; font-weight: 400; color: ${INK}; line-height: 1.5;">${txt}</div>`;

const fuerte = (txt, color = NAVY) => `<strong style="font-weight: 700; color: ${color};">${txt}</strong>`;

/** Marco de navegador para enseñar capturas y maquetas. */
const navegador = (url, contenido, ancho = '100%') => `
      <div style="width: ${ancho}; border-radius: 16px; overflow: hidden; ${CARD} box-shadow: 0 22px 50px rgba(6,66,92,0.16);">
        <div style="height: 44px; background: #E9EFF1; display: flex; align-items: center; gap: 9px; padding: 0 18px; border-bottom: 1px solid ${LINE};">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #F0A09B;"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #F2D27A;"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #8FD0A1;"></span>
          <span style="margin-left: 14px; flex: 1; height: 26px; border-radius: 13px; background: #FFFFFF; font-size: 14px; font-weight: 500; color: ${MUTED}; display: flex; align-items: center; padding: 0 16px; letter-spacing: 0.2px;">${url}</span>
        </div>
        ${contenido}
      </div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Tres servicios para que la empresa se vea (redes), se conozca (relaciones publicas) y se compre (sitio web)." style="background: ${NAVY}; background-image: radial-gradient(70% 80% at 12% 10%, rgba(98,199,196,0.30) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${ORANGE}; clip-path: polygon(64% 0, 100% 0, 100% 100%, 50% 100%);"></div>
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${GOLD}; clip-path: polygon(63.2% 0, 64% 0, 50% 100%, 49.2% 100%);"></div>
    <div data-a="up3" style="position: absolute; right: 150px; top: 130px; display: flex; gap: 34px;">
      <div style="width: 330px; height: 720px; border-radius: 28px; background: #FFFFFF; box-shadow: 0 30px 60px rgba(0,0,0,0.32); display: flex; flex-direction: column; overflow: hidden; margin-top: 90px;">
        <div style="flex: 1; background: url('assets/est-spray.jpg') center/cover no-repeat;"></div>
        <div style="height: 92px; display: flex; align-items: center; justify-content: center; background: #FFFFFF;">${logoEst(40)}</div>
      </div>
      <div style="width: 330px; height: 720px; border-radius: 28px; background: #FFFFFF; box-shadow: 0 30px 60px rgba(0,0,0,0.32); display: flex; flex-direction: column; overflow: hidden;">
        <div style="flex: 1; background: url('assets/zoo-spray.jpg') center/cover no-repeat;"></div>
        <div style="height: 92px; display: flex; align-items: center; justify-content: center; background: #FFFFFF;">${logoZoo(40)}</div>
      </div>
    </div>
    <div data-a="up" style="position: relative; display: flex; align-items: center; gap: 22px;">
      ${logoMT(150, true)}
    </div>
    <h1 data-a="up2" style="position: relative; margin: 40px 0 0; font-size: 92px; font-weight: 700; letter-spacing: -3.2px; line-height: 1.04; max-width: 1020px;">Que se vea,<br>que se conozca,<br>que se compre</h1>
    <p data-a="up3" style="position: relative; margin: 30px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 880px;">Propuesta de tres servicios para MT Omicron Sigma Technologies: redes sociales, relaciones públicas y sitio web.</p>
    <div data-a="up3" style="position: relative; margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Noviembre 2026', 'rgba(255,255,255,0.16)')}
    </div>
    <div data-a="up3" style="position: relative; margin-top: 30px; display: flex; align-items: center; gap: 26px;">
      ${EQUIPO.map(([nombre, rol]) => `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <span style="font-size: 21px; font-weight: 600; color: #FFFFFF;">${nombre}</span>
        <span style="font-size: 17px; font-weight: 400; color: rgba(255,255,255,0.62);">${rol}</span>
      </div>`).join('<span style="width: 1px; height: 34px; background: rgba(255,255,255,0.25);"></span>')}
    </div>
  </section>`);

// ── 2 · Punto de partida ────────────────────────────────────────────────
slides.push(`
  <section data-label="El punto de partida" data-screen-label="Punto de partida" data-speaker-notes="La empresa tiene mas de lo que muestra. El problema no es el producto, es la vitrina." style="${seccion()}">
    ${header('Punto de partida')}
    ${h2('Tienen más de lo que se ve')}
    <div data-a="up3" style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr 540px; gap: 28px; flex: 1;">
      <div style="${CARD} border-radius: 26px; padding: 38px 34px; display: flex; flex-direction: column; gap: 22px; border-top: 6px solid ${TEAL_T};">
        ${etiqueta('Lo que ya tienen', TEAL_T)}
        <div style="display: flex; flex-direction: column; gap: 17px;">
          ${bullet('Productos propios de superoxidación con pH neutro, en dos marcas: EsteriLife y Zoolubac', TEAL_T, 24)}
          ${bullet('Trámites y avisos ante COFEPRIS y SENASICA', TEAL_T, 24)}
          ${bullet('Portafolio técnico con fichas, estudios de laboratorio y hoja de seguridad', TEAL_T, 24)}
          ${bullet('Planta y almacén propios en Morelia', TEAL_T, 24)}
          ${bullet('Catálogos y flyers ya diseñados', TEAL_T, 24)}
        </div>
      </div>
      <div style="${CARD} border-radius: 26px; padding: 38px 34px; display: flex; flex-direction: column; gap: 22px; border-top: 6px solid ${ORANGE};">
        ${etiqueta('Lo que hoy no se ve', ORANGE)}
        <div style="display: flex; flex-direction: column; gap: 17px;">
          ${bullet('El sitio actual no menciona ningún producto ni marca', ORANGE, 24, INK, '!')}
          ${bullet('No abre con candado (HTTPS): el navegador lo marca como «no seguro»', ORANGE, 24, INK, '!')}
          ${bullet('Al buscar EsteriLife o Zoolubac en Google no aparece la empresa', ORANGE, 24, INK, '!')}
          ${bullet('En el celular se lee como un muro de texto', ORANGE, 24, INK, '!')}
          ${bullet('Un formulario y un teléfono: sin catálogo, fichas ni WhatsApp', ORANGE, 24, INK, '!')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${navegador('mtomicronsigma.com.mx', `<div style="height: 330px; background: url('assets/web-actual.jpg') top center/cover no-repeat;"></div>`)}
        <span style="font-size: 16px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Así se ve hoy el sitio de la empresa (captura del 29 de octubre de 2026).</span>
      </div>
    </div>
    <div style="height: 28px;"></div>
    ${nota(`${fuerte('No es un problema de producto, es de vitrina.')} Quien llega al sitio hoy no puede saber qué venden, para quién ni dónde comprarlo. Eso es lo que resuelve esta propuesta.`)}
  </section>`);

// ── 11 · Un equipo, tres frentes ─────────────────────────────────────────
const frente = (n, color, titulo, quien, lista, entrega) => `
        <div style="${CARD} border-radius: 26px; padding: 34px 32px; display: flex; flex-direction: column; gap: 14px; border-top: 6px solid ${color};">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="width: 46px; height: 46px; border-radius: 50%; background: ${color}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 700;">${n}</span>
            <span style="font-size: 17px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color};">${quien}</span>
          </div>
          <span style="font-size: 34px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.8px; line-height: 1.18;">${titulo}</span>
          <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 2px;">
            ${lista.map(x => bullet(x, color, 23)).join('')}
          </div>
          <div style="flex: 1;"></div>
          <div style="border-top: 1px solid ${LINE}; padding-top: 16px; font-size: 18px; font-weight: 500; color: ${MUTED}; line-height: 1.4;"><span style="font-weight: 700; color: ${color};">Entrega:</span> ${entrega}</div>
        </div>`;

slides.push(`
  <section data-label="Un equipo, tres frentes" data-screen-label="Equipo" data-speaker-notes="Tres servicios, cada uno con su responsable, y una sola cara para el cliente. En este orden se presentan: redes sociales con Andrea, relaciones corporativas con Angeles Luna y al final el sitio web." style="${seccion()}">
    ${header('Tres servicios')}
    ${h2('Tres frentes que se<br>refuerzan entre sí', 58)}
    <div data-a="up3" style="margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; flex: 1;">
      ${frente('1', ORANGE, 'Redes sociales', 'Andrea Hasly Guillen Luna', [
        'Contenido de sus productos y de la empresa, en un tono cercano',
        'Paquete mensual de publicaciones, videos y coberturas',
        'Usa la lista de afirmaciones aprobadas'], 'el paquete mensual, todos los meses')}
      ${frente('2', SLATE, 'Relaciones corporativas', 'Ángeles Luna', [
        'Contacto con empresarios, organismos e instituciones',
        'Un encuentro B2B al mes con 10 a 15 prospectos',
        'Entrevistas, congresos y alianzas para abrir mercados'], 'un programa de 12 meses, con evaluación cada trimestre')}
      ${frente('3', TEAL_T, 'Sitio web', 'Axl Guillén', [
        'El sitio nuevo, en su propio dominio y con HTTPS',
        'Catálogo, evidencia y formas de contacto',
        'Un blog para publicar artículos'], 'el sitio en línea y el blog al día')}
    </div>
    <div style="height: 24px;"></div>
    ${nota(`${fuerte('Así se conectan:')} las redes muestran a la empresa, las relaciones corporativas abren puertas y el sitio convierte todo eso en cotizaciones. Una sola cara para ustedes, tres frentes por detrás.`)}
  </section>`);

// ── Redes sociales (Andrea) ──────────────────────────────────────────────
// El paquete mensual: 14 publicaciones (4 videos y 10 gráficos), 4 coberturas de evento y
// 4 diseños extraordinarios. El precio sale de PRECIO_REDES (ver arriba).
const paq = (num, titulo, sub, color) => `
      <div style="${CARD} border-radius: 28px; padding: 36px 32px 32px; display: flex; flex-direction: column; gap: 12px; border-top: 6px solid ${color};">
        <span style="font-size: 200px; font-weight: 800; color: ${color}; letter-spacing: -8px; line-height: 0.95;">${num}</span>
        <span style="font-size: 40px; font-weight: 700; color: ${NAVY}; letter-spacing: -1px; line-height: 1.12;">${titulo}</span>
        <span style="font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${sub}</span>
      </div>`;

slides.push(`
  <section data-label="Redes sociales" data-screen-label="Redes sociales" data-speaker-notes="Paquete mensual de Andrea: 14 publicaciones al mes (4 videos y 10 graficos), 4 coberturas de evento y 4 disenos extraordinarios, por $10,000 al mes. Todo texto pasa por la lista de afirmaciones aprobadas por la empresa. CONFIRMAR con Andrea que este es el paquete y el precio que se le ofrece a Omicron." style="${seccion()}">
    ${header('Redes sociales', pill('Andrea Hasly Guillen Luna', ORANGE) + pill('Servicio mensual', SLATE))}
    ${h2('Presencia constante<br>en redes, cada mes', 58)}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; flex: 1;">
      ${paq('14', 'publicaciones al mes', 'Son 4 videos y 10 gráficos.', TEAL_T)}
      ${paq('4', 'coberturas de evento', 'Para que lo que pasa en la empresa también se vea en redes.', NAVY)}
      ${paq('4', 'diseños extraordinarios', 'Piezas extra, además de las publicaciones del mes.', GOLD)}
      <div style="border-radius: 28px; background: ${NAVY}; background-image: radial-gradient(90% 70% at 20% 10%, rgba(98,199,196,0.35) 0%, rgba(0,0,0,0) 60%); color: #FFFFFF; padding: 36px 32px 32px; display: flex; flex-direction: column; justify-content: space-between; border-top: 6px solid ${ORANGE};">
        <span style="font-size: 19px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${TEAL};">Inversión</span>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="display: flex; align-items: baseline; gap: 10px; white-space: nowrap;"><span style="font-size: 76px; font-weight: 800; letter-spacing: -3px; line-height: 1;">${PRECIO_REDES}</span><span style="font-size: 24px; font-weight: 700; color: ${TEAL};">MXN</span></span>
          <span style="font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.85);">al mes, todos los meses</span>
        </div>
      </div>
    </div>
    <div style="height: 24px; flex: none;"></div>
    ${nota(`${fuerte('Todo lo que se publica sale de una lista de afirmaciones aprobada por ustedes.')} COFEPRIS y SENASICA vigilan la publicidad de estos productos, también en internet: lo que se dice se tiene que poder probar.`)}
  </section>`);

// ── 12 · Relaciones corporativas (la lámina de la mamá de Andrea) ────────
// Su resumen del 4/11/2026, «Propuesta de colaboración empresarial». Andrea pidió una
// lámina para que ella hable con sus palabras, así que en pantalla va lo mínimo: las
// cinco líneas de acción en una frase cada una. El texto completo va en las notas.
// ⚠️ Su resumen es de ESTERILIFE (no de las dos marcas): el nombre va tal cual.
// El precio ($5,000 al mes, en paquete con redes) va en la pastilla de la cabecera y en la lámina de
// inversión. Su resumen decía «por acordar»: queda tal cual en las notas del orador.
const linea = (n, color, titulo, texto) => `
      <div style="${CARD} border-radius: 26px; padding: 34px 28px 30px; display: flex; flex-direction: column; gap: 16px; border-top: 6px solid ${color};">
        <span style="width: 54px; height: 54px; border-radius: 50%; background: ${color}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">${n}</span>
        <span style="font-size: 34px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.9px; line-height: 1.15;">${titulo}</span>
        <span style="font-size: 24px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">${texto}</span>
      </div>`;

slides.push(`
  <section data-label="Relaciones corporativas" data-screen-label="Relaciones corporativas" data-speaker-notes="PRECIO: 5 mil pesos al mes, en paquete con las redes de Andrea (15 mil al mes en total). ESPACIO PARA QUE HABLE ANGELES LUNA, con sus palabras. Su resumen (propuesta de colaboracion empresarial de ESTERILIFE): cobertura municipal, estatal y nacional; vigencia de 12 meses con evaluacion trimestral. Objetivo: impulsar la presencia y el crecimiento comercial de EsteriLife con relaciones empresariales de alto nivel, alianzas estrategicas y acercamientos con instituciones publicas y privadas. Lineas de accion: 1) relaciones corporativas e institucionales, con empresarios, directivos, organismos empresariales y autoridades de los tres ordenes de gobierno; 2) encuentros empresariales B2B, una reunion mensual con 10 a 15 prospectos seleccionados; 3) presencia y proyeccion, una entrevista mensual en medios o espacios especializados, el portafolio en encuentros, congresos y actividades empresariales, y presentaciones con contactos estrategicos; 4) alianzas y desarrollo de mercados en los sectores empresarial, medico, educativo, turistico e institucional; 5) punto de exhibicion y distribucion, un espacio permanente en las oficinas de representacion, con condiciones acordadas aparte. Seguimiento: revisiones trimestrales de contactos, reuniones, oportunidades comerciales y negocios concretados. Esquema: participacion estrategica externa, en coordinacion con la direccion, con autonomia profesional y honorarios mensuales por acordar. Proposito: relaciones que trasciendan la promocion de una marca y se vuelvan oportunidades reales de colaboracion, expansion y crecimiento." style="${seccion()}">
    ${header('Relaciones corporativas', pill('Ángeles Luna', ORANGE) + pill('12 meses · evaluación trimestral', SLATE) + pill(`${PRECIO_RP} MXN al mes`, NAVY))}
    ${h2('Relaciones que se vuelven<br>oportunidades de negocio', 58)}
    ${bajada('Presencia y crecimiento comercial de EsteriLife, con alianzas y contactos empresariales e institucionales en lo municipal, lo estatal y lo nacional.', 1500)}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; flex: 1;">
      ${linea('1', TEAL_T, 'Relaciones corporativas', 'Empresarios, organismos, instituciones y los tres órdenes de gobierno.')}
      ${linea('2', NAVY, 'Encuentros B2B', 'Una reunión al mes con 10 a 15 prospectos seleccionados.')}
      ${linea('3', ORANGE, 'Presencia y proyección', 'Una entrevista al mes en medios, y el portafolio en congresos y encuentros.')}
      ${linea('4', GOLD, 'Alianzas y mercados', 'Nuevos canales, distribuidores y compradores, de lo regional a lo nacional.')}
      ${linea('5', SLATE, 'Punto de exhibición', 'Un espacio permanente para exhibir y comercializar los productos.')}
    </div>
    <div style="height: 24px;"></div>
    ${nota(`${fuerte('Lo que se mide cada trimestre:')} contactos establecidos, reuniones realizadas, oportunidades comerciales generadas y negocios concretados.`)}
  </section>`);

// ── 5 · El inicio ────────────────────────────────────────────────────────
// (Antes «La puerta de entrada», con un selector «soy hospital / soy veterinario».
// Ahora el inicio enseña todos los productos y nadie tiene que elegir un lado.)
const tileProducto = (img, nombre, color) => `
            <div style="flex: 1; border-radius: 14px; overflow: hidden; border: 1px solid ${LINE}; background: #FFFFFF; display: flex; flex-direction: column;">
              <div style="height: 250px; background: #EEF3F4 url('assets/${img}') center/contain no-repeat; border-bottom: 4px solid ${color};"></div>
              <div style="padding: 14px 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                <span style="font-size: 16px; font-weight: 700; color: ${NAVY}; line-height: 1.25; letter-spacing: -0.2px;">${nombre}</span>
                <span style="font-size: 14px; font-weight: 700; color: ${color}; letter-spacing: 0.3px;">Ver ficha →</span>
              </div>
            </div>`;

slides.push(`
  <section data-label="La puerta de entrada" data-screen-label="Inicio del sitio" data-speaker-notes="Maqueta orientativa del inicio, no el diseno final. La idea: que se vea de entrada que venden, que sea facil llegar a cada ficha y que cotizar este siempre a un clic." style="${seccion()}">
    ${header('Sitio web', pill('Maqueta orientativa', SLATE))}
    ${h2('Que nadie tenga que adivinar<br>qué venden', 58)}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: 1.7fr 1fr; gap: 44px; flex: 1;">
      ${navegador('mtomicronsigma.com.mx', `
        <div style="padding: 24px 32px 28px; background: #FFFFFF; display: flex; flex-direction: column; gap: 22px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            ${logoMT(54)}
            <div style="display: flex; gap: 22px; font-size: 15px; font-weight: 600; color: ${MUTED};"><span>Productos</span><span>Nosotros</span><span>Evidencia</span><span>Dónde comprar</span><span>Blog</span><span>Contacto</span></div>
          </div>
          <div style="text-align: center; display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 36px; font-weight: 700; color: ${NAVY}; letter-spacing: -1px;">Soluciones para el control de infecciones</span>
            <span style="font-size: 18px; font-weight: 400; color: ${MUTED};">Superoxidación con pH neutro. Elige un producto o pide tu cotización.</span>
          </div>
          <div style="display: flex; gap: 16px;">
            ${tileProducto('est-galon.jpg', 'Solución desinfectante de alto nivel', TEAL_T)}
            ${tileProducto('est-antiseptico.jpg', 'Solución antiséptica', TEAL_T)}
            ${tileProducto('zoo-spray.jpg', 'Solución antiséptica veterinaria', ORANGE)}
            ${tileProducto('zoo-gel.jpg', 'Gel antiséptico veterinario', ORANGE)}
          </div>
          <div style="display: flex; justify-content: center; gap: 14px;">
            <span style="background: ${NAVY}; color: #FFFFFF; font-size: 16px; font-weight: 700; border-radius: 999px; padding: 12px 28px;">Pedir cotización</span>
            <span style="background: #FFFFFF; border: 2px solid ${TEAL_T}; color: ${TEAL_T}; font-size: 16px; font-weight: 700; border-radius: 999px; padding: 10px 26px;">Escribir por WhatsApp</span>
          </div>
        </div>`)}
      <div style="display: flex; flex-direction: column; gap: 22px; padding-top: 6px;">
        ${etiqueta('Lo que logra esta pantalla', TEAL_T)}
        ${bullet('Quien llega sabe en cinco segundos qué venden', TEAL_T, 22)}
        ${bullet('Todos los productos a la vista, cada uno con su ficha', TEAL_T, 22)}
        ${bullet('Cotizar y WhatsApp están siempre a la vista, en cada página', TEAL_T, 22)}
        ${bullet('Pensado primero para el celular, que es donde la van a abrir', TEAL_T, 22)}
        <div style="flex: 1;"></div>
        <span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Es una maqueta para conversar la idea. El diseño final sale de sus fotos, su logo y lo que decidamos en la reunión.</span>
      </div>
    </div>
  </section>`);

// ── 4 · Mapa del sitio ───────────────────────────────────────────────────
const celdaMapa = (titulo, texto, color, span = 1, lista = null) => `
        <div style="${CARD} grid-column: span ${span}; border-radius: 22px; padding: 24px 28px; display: flex; flex-direction: column; gap: 8px; border-top: 5px solid ${color};">
          <span style="font-size: 31px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.6px;">${titulo}</span>
          <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.42;">${texto}</span>
          ${lista ? `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">${lista.map(x => `<span style="background: ${color}1A; color: ${color === TEAL ? TEAL_T : color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 8px 20px;">${x}</span>`).join('')}</div>` : ''}
        </div>`;

slides.push(`
  <section data-label="Mapa del sitio" data-screen-label="Mapa del sitio" data-speaker-notes="Ocho secciones. Los productos son el centro; lo demas existe para que se confie en ellos y se puedan comprar. Prensa y alianzas es donde vive lo que consiga el frente de relaciones corporativas." style="${seccion()}">
    ${header('Sitio web', pill('Unas cuatro semanas · por confirmar', SLATE))}
    ${h2('Un sitio, ocho secciones', 58)}
    <div data-a="up3" style="margin-top: 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; flex: 1; grid-template-rows: auto auto auto;">
      ${celdaMapa('Inicio', 'Todos los productos a la vista, con cotizar y WhatsApp en cada página.', SLATE)}
      ${celdaMapa('Nosotros', 'Quién es MT Omicron Sigma, dónde está la planta y por qué hacen lo que hacen.', SLATE)}
      ${celdaMapa('Evidencia y registros', 'El portafolio técnico, fichas y estudios para descargar, con su visto bueno.', SLATE)}
      ${celdaMapa('Dónde comprar', 'Cotizar, escribir por WhatsApp o encontrar un distribuidor.', SLATE)}
      ${celdaMapa('Productos', 'Una ficha por producto, con su presentación, su uso y su descarga. Se agrupan por línea, EsteriLife y Zoolubac, dentro del mismo catálogo.', TEAL, 4, ['Desinfectante de alto nivel', 'Antiséptico', 'Gel antiséptico', 'Antiséptico veterinario', 'Gel veterinario'])}
      ${celdaMapa('Blog', 'Artículos de la empresa y de sus productos, cada uno con su propia página.', GOLD)}
      ${celdaMapa('Prensa y alianzas', 'Entrevistas, encuentros y alianzas de la empresa, conforme se vayan dando.', ORANGE, 2)}
      ${celdaMapa('Contacto', 'WhatsApp, teléfono, correo y mapa de la planta; aviso de privacidad.', GOLD)}
    </div>
    <div style="height: 22px; flex: none;"></div>
    ${nota(`${fuerte('Empieza como catálogo y generador de contactos:')} no cobra ni maneja pagos en línea, y todo lo que se publica sale de lo que la empresa aprueba.`)}
  </section>`);

// ── Inversión · los tres servicios ───────────────────────────────────────
const servicio = (etq, quien, color, precio, unidad, lista) => `
      <div style="${CARD} border-radius: 28px; padding: 30px 34px 28px; display: flex; flex-direction: column; gap: 10px; border-top: 6px solid ${color};">
        ${etiqueta(etq, color)}
        <span style="font-size: 22px; font-weight: 500; color: ${MUTED};">${quien}</span>
        <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 4px;">
          ${precio}
          <span style="font-size: 24px; font-weight: 600; color: ${NAVY};">${unidad}</span>
        </div>
        <div style="height: 1px; background: ${LINE}; margin: 10px 0 4px;"></div>
        <div style="display: flex; flex-direction: column; gap: 11px;">${lista.map(x => bullet(x, color, 22)).join('')}</div>
      </div>`;

const monto = (cifra, color, tam = 82) =>
  `<span style="display: flex; align-items: baseline; gap: 10px; white-space: nowrap;"><span style="font-size: ${tam}px; font-weight: 800; color: ${color}; letter-spacing: -3px; line-height: 1;">${cifra}</span><span style="font-size: 24px; font-weight: 700; color: ${color};">MXN</span></span>`;

// Un servicio dentro de la tarjeta del paquete (sin tarjeta propia).
const bloquePaquete = (etq, quien, color, cifra, lista) => `
        <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
          ${etiqueta(etq, color)}
          <span style="font-size: 22px; font-weight: 500; color: ${MUTED};">${quien}</span>
          <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 4px;">
            ${monto(cifra, color, 66)}
            <span style="font-size: 24px; font-weight: 600; color: ${NAVY};">al mes</span>
          </div>
          <div style="height: 1px; background: ${LINE}; margin: 10px 0 4px;"></div>
          <div style="display: flex; flex-direction: column; gap: 11px;">${lista.map(x => bullet(x, color, 22)).join('')}</div>
        </div>`;

slides.push(`
  <section data-label="Inversión" data-screen-label="Inversión" data-speaker-notes="Redes: $10,000 al mes (paquete de Andrea, confirmar). Relaciones corporativas: $5,000 al mes (Angeles Luna). Van en paquete, en una sola tarjeta: $15,000 al mes en total. Sitio web: $5,000 pago unico, aparte del paquete (decision de Axl, 4/nov/2026). Dos formas de pagar el sitio: proyecto cerrado, o repartido en la primera mensualidad de redes. Sin tienda en linea ni suscripciones: no se manejan pagos en el sitio." style="${seccion()}">
    ${header('Inversión')}
    ${h2('Un paquete mensual y un sitio de pago único', 58)}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: 2fr 1fr; gap: 28px; flex: 1;">
      <div style="${CARD} border-radius: 28px; padding: 30px 38px 28px; display: flex; flex-direction: column; gap: 22px; border-top: 6px solid ${NAVY};">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 24px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${etiqueta('Paquete mensual', NAVY)}
            <span style="font-size: 30px; font-weight: 600; color: ${NAVY}; letter-spacing: -0.5px;">Redes sociales + relaciones corporativas, juntas</span>
          </div>
          <span style="display: flex; align-items: baseline; gap: 12px; white-space: nowrap;"><span style="font-size: 84px; font-weight: 800; color: ${NAVY}; letter-spacing: -3px; line-height: 1;">${PRECIO_PAQUETE}</span><span style="font-size: 24px; font-weight: 700; color: ${TEAL_T};">MXN al mes</span></span>
        </div>
        <div style="height: 2px; background: ${LINE};"></div>
        <div style="display: flex; gap: 38px; flex: 1;">
          ${bloquePaquete('Redes sociales', 'Andrea Hasly Guillen Luna', ORANGE, PRECIO_REDES, [
            '14 publicaciones: 4 videos y 10 gráficos',
            '4 coberturas de evento',
            '4 diseños extraordinarios'])}
          <div style="width: 1px; background: ${LINE};"></div>
          ${bloquePaquete('Relaciones corporativas', 'Ángeles Luna', SLATE, PRECIO_RP, [
            '12 meses, con evaluación cada trimestre',
            'Un encuentro B2B al mes',
            'Una entrevista al mes en medios'])}
        </div>
      </div>
      ${servicio('Sitio web', 'Axl Guillén', TEAL_T, monto(PRECIO_WEB, TEAL_T), 'pago único', [
        'Inicio con todos sus productos y una ficha por cada uno',
        'Evidencia, dónde comprar y un blog',
        'Dominio propio con HTTPS y versión de celular'])}
    </div>
    <div style="height: 16px; flex: none;"></div>
    ${nota(`${fuerte('El sitio se puede pagar de dos formas:')} como proyecto cerrado con su fecha de entrega, o repartido en la primera mensualidad del paquete. El sitio no maneja pagos en línea ni suscripciones. Su mantenimiento y el blog, después de publicar, son un servicio mensual aparte, por definir.`, ORANGE)}
  </section>`);

// ── 15 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Siguiente paso" data-screen-label="Cierre" data-speaker-notes="Cierre: lo que necesitamos de ellos para arrancar, y una pregunta sobre que producto va al frente." style="background: ${NAVY}; background-image: radial-gradient(80% 70% at 18% 90%, rgba(98,199,196,0.26) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${ORANGE}; clip-path: polygon(78% 0, 100% 0, 100% 100%, 66% 100%);"></div>
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${GOLD}; clip-path: polygon(77.3% 0, 78% 0, 66% 100%, 65.3% 100%);"></div>
    <span data-a="up" style="position: relative; font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${TEAL};">Siguiente paso</span>
    <h2 data-a="up2" style="position: relative; margin: 26px 0 0; font-size: 80px; font-weight: 700; letter-spacing: -2.6px; line-height: 1.05; max-width: 1180px;">Con cinco cosas de su lado,<br>arrancamos</h2>
    <div data-a="up3" style="position: relative; margin-top: 38px; display: flex; flex-direction: column; gap: 15px; max-width: 1060px;">
      ${bullet('Logos en vectorial y fotos de producto en buena resolución', TEAL, 24, '#FFFFFF')}
      ${bullet('Informes de laboratorio recientes y qué registros se pueden publicar', TEAL, 24, '#FFFFFF')}
      ${bullet('Presentaciones vigentes de cada producto', TEAL, 24, '#FFFFFF')}
      ${bullet('Acceso al dominio y al correo actuales', TEAL, 24, '#FFFFFF')}
      ${bullet('Quién aprueba los textos de su lado', TEAL, 24, '#FFFFFF')}
    </div>
    <p data-a="up3" style="position: relative; margin: 38px 0 0; font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.88); line-height: 1.5; max-width: 980px;">Y una decisión para empezar: ¿qué producto va al frente en el inicio?</p>
    <div data-a="up3" style="position: relative; margin-top: 40px; display: flex; align-items: center; gap: 26px;">
      ${logoMT(96, true)}
      <span style="width: 1px; height: 60px; background: rgba(255,255,255,0.3);"></span>
      <span style="font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.75); line-height: 1.5;">Andrea Hasly Guillen Luna · Ángeles Luna · Axl Guillén</span>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Propuesta · MT Omicron Sigma</title>
${kit.og({ titulo: 'Propuesta · MT Omicron Sigma', descripcion: 'Tres servicios para MT Omicron Sigma, con EsteriLife y Zoolubac: redes sociales, relaciones públicas y sitio web.', carpeta: 'personal/omicron' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${NAVY}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  @keyframes dsGhost { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.65s 0.13s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.75s 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="ghost"] { animation: dsGhost 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;
    background: rgba(6,66,92,0.9); color: #FFFFFF; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
