// Generador de index.html — Propuesta: sitio web nuevo para MT Omicron Sigma Technologies
// Ejecutar: node personal/omicron/gen.js
//
// PRIMERA VERSIÓN (29/10/2026), armada para ir avanzando antes de la reunión.
// Alcance: un sitio que venda a DOS públicos —hospitales y clínicas (EsteriLife) y
// veterinarios, productores y dueños de mascotas (Zoolubac)— más el boletín que se
// publica en él. La lámina de inversión va «por definir» a propósito: el precio lo
// pone Axl y no se inventa aquí.
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
  ['Axl Guillén', 'Sitio web y boletín'],
  ['Andrea Hasly Guillen Luna', 'Redes sociales y contenido'],
];

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

const tarjeta = (icono, titulo, texto, acento = TEAL_T, lista = []) => `
        <div style="${CARD} border-radius: 24px; padding: 38px 36px 34px; display: flex; flex-direction: column; gap: 16px;">
          <span style="width: 64px; height: 64px; border-radius: 18px; background: ${acento}1F; color: ${acento}; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700;">${icono}</span>
          <span style="font-size: 32px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.7px; line-height: 1.18;">${titulo}</span>
          <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">${texto}</span>
          ${lista.length ? `<div style="height: 1px; background: ${LINE}; margin: 6px 0 2px;"></div><div style="display: flex; flex-direction: column; gap: 12px;">${lista.map(x => bullet(x, acento, 21)).join('')}</div>` : ''}
        </div>`;

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
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Primera version. Un solo sitio para dos publicos: hospitales y clinicas por un lado, veterinarios y productores por el otro." style="background: ${NAVY}; background-image: radial-gradient(70% 80% at 12% 10%, rgba(98,199,196,0.30) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
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
    <h1 data-a="up2" style="position: relative; margin: 40px 0 0; font-size: 92px; font-weight: 700; letter-spacing: -3.2px; line-height: 1.04; max-width: 1020px;">Un solo sitio,<br>dos públicos,<br>cada uno por su puerta</h1>
    <p data-a="up3" style="position: relative; margin: 30px 0 0; font-size: 27px; font-weight: 400; color: rgba(255,255,255,0.82); line-height: 1.5; max-width: 880px;">Propuesta de sitio web nuevo para MT Omicron Sigma Technologies: hospitales y clínicas por EsteriLife, veterinarios y productores por Zoolubac.</p>
    <div data-a="up3" style="position: relative; margin-top: 44px; display: flex; gap: 14px;">
      ${pill('Primera versión · octubre 2026', 'rgba(255,255,255,0.16)')}
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
          ${bullet('Producto propio y dos marcas con su catálogo', TEAL_T, 24)}
          ${bullet('Trámites y avisos ante COFEPRIS y SENASICA', TEAL_T, 24)}
          ${bullet('Fichas técnicas y estudios de laboratorio', TEAL_T, 24)}
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

// ── 3 · Dos públicos ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="Dos públicos" data-screen-label="Dos públicos" data-speaker-notes="Querer venderle a ambos obliga a dos conversaciones distintas. Mismo sitio, dos puertas." style="${seccion()}">
    ${header('Objetivo')}
    ${h2('Vender a ambos es hablar<br>en dos idiomas')}
    <div data-a="up3" style="margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
      <div style="${CARD} border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; border-top: 6px solid ${TEAL};">
        <div style="height: 196px; background: url('assets/est-clinica.jpg') center 30%/cover no-repeat; position: relative;">
          <div style="position: absolute; left: 28px; bottom: -26px; background: #FFFFFF; border-radius: 14px; padding: 12px 22px; box-shadow: 0 8px 22px rgba(6,66,92,0.18);">${logoEst(38)}</div>
        </div>
        <div style="padding: 48px 36px 30px; display: flex; flex-direction: column; gap: 14px;">
          <span style="font-size: 30px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.6px; line-height: 1.2;">Hospitales, clínicas y profesionales de la salud</span>
          ${bullet('Quieren poder verificar que el producto está registrado', TEAL_T, 24)}
          ${bullet('Buscan la ficha técnica y la presentación para su compra', TEAL_T, 24)}
          ${bullet('Necesitan saber a quién llamar para cotizar', TEAL_T, 24)}
          <span style="font-size: 21px; font-weight: 600; color: ${TEAL_T}; line-height: 1.4; margin-top: 8px;">Tono: sobrio, técnico, con datos y documentos a la mano.</span>
        </div>
      </div>
      <div style="${CARD} border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; border-top: 6px solid ${ORANGE};">
        <div style="height: 196px; background: url('assets/zoo-perro.jpg') center 62%/cover no-repeat; position: relative;">
          <div style="position: absolute; left: 28px; bottom: -26px; background: #FFFFFF; border-radius: 14px; padding: 12px 22px; box-shadow: 0 8px 22px rgba(6,66,92,0.18);">${logoZoo(38)}</div>
        </div>
        <div style="padding: 48px 36px 30px; display: flex; flex-direction: column; gap: 14px;">
          <span style="font-size: 30px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.6px; line-height: 1.2;">Veterinarios, productores y dueños de mascotas</span>
          ${bullet('Quieren saber para qué especie y para qué sirve', ORANGE, 24)}
          ${bullet('Compran por tamaño: del frasco chico al garrafón', ORANGE, 24)}
          ${bullet('Buscan dónde conseguirlo cerca de ellos', ORANGE, 24)}
          <span style="font-size: 21px; font-weight: 600; color: ${ORANGE}; line-height: 1.4; margin-top: 8px;">Tono: cercano, claro, con fotos reales y pocas palabras técnicas.</span>
        </div>
      </div>
    </div>
    <div style="height: 24px;"></div>
    ${nota(`${fuerte('Mismo sitio, dos conversaciones.')} Cada visitante entra por su puerta y no tiene que leer lo del otro: así ninguno de los dos se pierde en un catálogo que no es para él.`)}
  </section>`);

// ── 4 · Mapa del sitio ───────────────────────────────────────────────────
const celdaMapa = (titulo, texto, color, span = 1, lista = null) => `
        <div style="${CARD} grid-column: span ${span}; border-radius: 22px; padding: 24px 28px; display: flex; flex-direction: column; gap: 8px; border-top: 5px solid ${color};">
          <span style="font-size: 31px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.6px;">${titulo}</span>
          <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.42;">${texto}</span>
          ${lista ? `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">${lista.map(x => `<span style="background: ${color}1A; color: ${color === TEAL ? TEAL_T : color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 8px 20px;">${x}</span>`).join('')}</div>` : ''}
        </div>`;

slides.push(`
  <section data-label="Mapa del sitio" data-screen-label="Mapa del sitio" data-speaker-notes="Ocho secciones. Las dos marcas son el centro; lo demas existe para que se confie en ellas y se pueda comprar." style="${seccion()}">
    ${header('Estructura')}
    ${h2('Un sitio, ocho secciones', 58)}
    <div data-a="up3" style="margin-top: 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; flex: 1; grid-template-rows: auto auto auto;">
      ${celdaMapa('Inicio', 'Las dos puertas: «soy profesional de la salud» y «soy veterinario o productor».', SLATE)}
      ${celdaMapa('Nosotros', 'Quién es MT Omicron Sigma, dónde está la planta y por qué hacen lo que hacen.', SLATE)}
      ${celdaMapa('Evidencia y registros', 'Lo que respalda a cada producto, publicado solo con su visto bueno.', SLATE)}
      ${celdaMapa('Dónde comprar', 'Cotizar, escribir por WhatsApp o encontrar un distribuidor.', SLATE)}
      ${celdaMapa('EsteriLife', 'Salud humana. Una ficha por producto, con su presentación, su uso y su descarga.', TEAL, 2, ['Desinfectante de alto nivel', 'Antiséptico', 'Gel'])}
      ${celdaMapa('Zoolubac', 'Uso veterinario. Una ficha por producto, organizada por tamaño y por especie.', ORANGE, 2, ['Solución antiséptica', 'Gel', 'Garrafones'])}
      ${celdaMapa('Boletín', 'Archivo de cada número y suscripción, con dos listas: salud humana y veterinaria.', GOLD, 2)}
      ${celdaMapa('Contacto', 'WhatsApp, teléfono, correo y mapa de la planta; aviso de privacidad.', GOLD, 2)}
    </div>
  </section>`);

// ── 5 · La puerta de entrada ─────────────────────────────────────────────
const puerta = (img, pos, logo, rol, nombre, color) => `
          <div style="flex: 1; border-radius: 16px; overflow: hidden; border: 1px solid ${LINE}; background: #FFFFFF; display: flex; flex-direction: column;">
            <div style="height: 240px; background: url('assets/${img}') ${pos}/cover no-repeat; border-bottom: 5px solid ${color};"></div>
            <div style="padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 12px;">
              <span style="font-size: 17px; font-weight: 600; color: ${MUTED}; line-height: 1.35;">${rol}</span>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                ${logo}
                <span style="background: ${color}; color: #FFFFFF; font-size: 15px; font-weight: 700; border-radius: 999px; padding: 8px 16px; white-space: nowrap;">${nombre}</span>
              </div>
            </div>
          </div>`;

slides.push(`
  <section data-label="La puerta de entrada" data-screen-label="Inicio del sitio" data-speaker-notes="Maqueta orientativa del inicio, no el diseno final. La idea: que nadie tenga que adivinar por donde entrar." style="${seccion()}">
    ${header('El inicio', pill('Maqueta orientativa', SLATE))}
    ${h2('Que nadie tenga que adivinar<br>por dónde entrar', 58)}
    <div data-a="up3" style="margin-top: 34px; display: grid; grid-template-columns: 1.7fr 1fr; gap: 44px; flex: 1;">
      ${navegador('mtomicronsigma.com.mx', `
        <div style="padding: 24px 32px 28px; background: #FFFFFF; display: flex; flex-direction: column; gap: 22px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            ${logoMT(54)}
            <div style="display: flex; gap: 22px; font-size: 15px; font-weight: 600; color: ${MUTED};"><span>Nosotros</span><span>Evidencia</span><span>Dónde comprar</span><span>Boletín</span><span>Contacto</span></div>
          </div>
          <div style="text-align: center; display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 36px; font-weight: 700; color: ${NAVY}; letter-spacing: -1px;">Soluciones para el control de infecciones</span>
            <span style="font-size: 18px; font-weight: 400; color: ${MUTED};">¿Quién eres? Elige tu camino.</span>
          </div>
          <div style="display: flex; gap: 22px;">
            ${puerta('est-clinica.jpg', 'center 30%', logoEst(30), 'Soy hospital, clínica o profesional de la salud', 'Entrar', TEAL_T)}
            ${puerta('zoo-perro.jpg', 'center 62%', logoZoo(30), 'Soy veterinario, productor o tengo mascota', 'Entrar', ORANGE)}
          </div>
        </div>`)}
      <div style="display: flex; flex-direction: column; gap: 22px; padding-top: 6px;">
        ${etiqueta('Lo que logra esta pantalla', TEAL_T)}
        ${bullet('Quien llega sabe en cinco segundos que es el lugar correcto', TEAL_T, 22)}
        ${bullet('Cada puerta lleva a un catálogo con el tono y las fotos de su público', TEAL_T, 22)}
        ${bullet('Dónde comprar y WhatsApp están siempre a la vista, en cada página', TEAL_T, 22)}
        ${bullet('Pensado primero para el celular, que es donde la van a abrir', TEAL_T, 22)}
        <div style="flex: 1;"></div>
        <span style="font-size: 17px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Es una maqueta para conversar la idea. El diseño final sale de sus fotos, su logo y lo que decidamos en la reunión.</span>
      </div>
    </div>
  </section>`);

// ── 6 · El catálogo ──────────────────────────────────────────────────────
const prod = (marca, color, img, nombre, pres) => `
        <div style="${CARD} border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; border-top: 5px solid ${color};">
          <div style="height: 330px; background: #EEF3F4 url('assets/${img}') center/contain no-repeat;"></div>
          <div style="padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 7px;">
            <span style="font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${color === TEAL ? TEAL_T : color};">${marca}</span>
            <span style="font-size: 24px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.4px; line-height: 1.2;">${nombre}</span>
            <span style="font-size: 18px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${pres}</span>
          </div>
        </div>`;

slides.push(`
  <section data-label="El catálogo" data-screen-label="Catálogo" data-speaker-notes="Cinco productos, cada uno con su ficha. Las presentaciones salen de los catalogos actuales y se confirman con el cliente antes de publicar." style="${seccion()}">
    ${header('El catálogo')}
    ${h2('Cada producto, con su ficha', 58)}
    ${bajada('El catálogo en PDF deja de ser un archivo que se manda por mensaje y se vuelve un lugar que se puede buscar, compartir y encontrar.', 1500)}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px;">
      ${prod('EsteriLife', TEAL, 'est-galon.jpg', 'Solución desinfectante de alto nivel', '1 L · 3,78 L · 20 L')}
      ${prod('EsteriLife', TEAL, 'est-antiseptico.jpg', 'Solución antiséptica', '60, 120 y 240 mL · 3,78 L')}
      <div style="border-radius: 22px; background: ${NAVY}; background-image: radial-gradient(90% 70% at 20% 10%, rgba(98,199,196,0.35) 0%, rgba(0,0,0,0) 60%); color: #FFFFFF; padding: 26px 24px; display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; border-top: 5px solid ${TEAL};">
        <span style="font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${TEAL};">EsteriLife</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; line-height: 1.2;">Gel antiséptico</span>
        <span style="font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.75); line-height: 1.4;">150 · 240 · 500 g<br>Foto de catálogo por recibir</span>
      </div>
      ${prod('Zoolubac', ORANGE, 'zoo-spray.jpg', 'Solución antiséptica veterinaria', '120 mL · 1 L · 5 L · 20 L')}
      ${prod('Zoolubac', ORANGE, 'zoo-gel.jpg', 'Gel antiséptico veterinario', '150 y 240 g')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; align-items: stretch;">
      <div style="display: flex; flex-wrap: wrap; gap: 10px; align-content: center;">
        ${['Para qué sirve', 'Presentaciones', 'Cómo se usa', 'Ficha técnica en PDF', 'Hoja de seguridad', 'Pedir cotización'].map(x => `<span style="background: #FFFFFF; border: 1px solid ${LINE}; color: ${NAVY}; font-size: 18px; font-weight: 600; border-radius: 999px; padding: 9px 20px;">${x}</span>`).join('')}
      </div>
      ${nota(`${fuerte('Presentaciones por confirmar.')} Las de arriba son las de los catálogos actuales: antes de publicar se revisan una por una con ustedes.`, ORANGE)}
    </div>
  </section>`);

// ── 7 · Evidencia ────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Evidencia y registros" data-screen-label="Evidencia" data-speaker-notes="En salud se compra confiando. La seccion de evidencia es la que cierra la venta. Se publica solo lo que el cliente apruebe." style="${seccion()}">
    ${header('Confianza')}
    ${h2('En salud se compra<br>cuando se puede verificar', 58)}
    <div data-a="up3" style="margin-top: 38px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; flex: 1;">
      ${tarjeta('◧', 'Registros y avisos', 'Qué autoridad lo respalda y bajo qué clave, por producto. Quien compra para un hospital o una clínica lo revisa antes de pedir cotización.', TEAL_T, ['Autoridad que lo respalda', 'Producto al que corresponde', 'Vigencia y fecha'])}
      ${tarjeta('▤', 'Fichas técnicas y de seguridad', 'Descargables, siempre la versión vigente, con fecha. Una sola fuente en lugar de PDFs que circulan por correo con versiones distintas.', TEAL_T, ['Ficha técnica en PDF', 'Hoja de seguridad', 'Versión y fecha de cada una'])}
      ${tarjeta('◎', 'Estudios de laboratorio', 'Un resumen claro de cada estudio: qué se midió, en qué condiciones y con qué resultado, con el informe como respaldo.', TEAL_T, ['Qué se midió', 'En qué condiciones', 'Resultado y documento'])}
    </div>
    <div style="height: 26px;"></div>
    <div data-a="up3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 26px;">
      ${nota(`${fuerte('Se publica solo lo que ustedes aprueben.')} Antes de que algo aparezca en el sitio, ustedes eligen qué documento se muestra y cuál se queda para quien lo pida.`, TEAL_T)}
      ${nota(`${fuerte('Resumen en el sitio, informe completo bajo pedido.')} Los informes traen datos de personas y de lotes: se muestra lo que sirve para comprar y lo demás se entrega por correo a quien lo solicite.`, ORANGE)}
    </div>
  </section>`);

// ── 8 · Cómo convierte ───────────────────────────────────────────────────
const paso = (n, titulo, texto, color) => `
        <div style="${CARD} border-radius: 22px; padding: 26px 24px; display: flex; flex-direction: column; gap: 10px; position: relative;">
          <span style="width: 46px; height: 46px; border-radius: 50%; background: ${color}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 700;">${n}</span>
          <span style="font-size: 28px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.5px;">${titulo}</span>
          <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${texto}</span>
        </div>`;

slides.push(`
  <section data-label="Cómo convierte" data-screen-label="De visita a cotización" data-speaker-notes="El sitio arranca como catalogo y generador de contactos, no como tienda. La venta en linea de algunos productos esta regulada, se confirma producto por producto." style="${seccion()}">
    ${header('Cómo vende')}
    ${h2('De visita a cotización,<br>en cinco pasos', 58)}
    <div data-a="up3" style="margin-top: 36px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px;">
      ${paso('1', 'Te encuentra', 'En Google, en redes o en el boletín. Hoy no aparece en ninguno.', TEAL_T)}
      ${paso('2', 'Revisa', 'La ficha del producto y la evidencia que lo respalda.', TEAL_T)}
      ${paso('3', 'Pregunta', 'WhatsApp o formulario, uno para cada público.', TEAL_T)}
      ${paso('4', 'Cotiza', 'Ventas responde con presentación, cantidad y precio.', ORANGE)}
      ${paso('5', 'Compra', 'Directo con la empresa o con un distribuidor de su zona.', ORANGE)}
    </div>
    <div data-a="up3" style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; flex: 1;">
      <div style="${CARD} border-radius: 26px; padding: 32px 34px; display: flex; flex-direction: column; gap: 14px; border-top: 6px solid ${TEAL_T};">
        ${etiqueta('Empezamos así', TEAL_T)}
        <span style="font-size: 34px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.8px; line-height: 1.2;">Catálogo y generador de contactos</span>
        <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">El sitio no cobra en línea: junta personas con interés real y se las entrega a ventas con nombre, teléfono y qué producto preguntaron.</span>
      </div>
      <div style="${CARD} border-radius: 26px; padding: 32px 34px; display: flex; flex-direction: column; gap: 14px; border-top: 6px solid ${ORANGE};">
        ${etiqueta('Tienda en línea, después', ORANGE)}
        <span style="font-size: 34px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.8px; line-height: 1.2;">Producto por producto, si conviene</span>
        <span style="font-size: 22px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">La venta en línea de algunos productos tiene reglas propias de COFEPRIS y SENASICA. Se confirma con su asesor cuáles sí pueden y se agrega cuando haya claridad.</span>
      </div>
    </div>
    <div style="height: 22px;"></div>
    ${nota(`${fuerte('Qué vamos a medir:')} visitas por sección, descargas de ficha, clics a WhatsApp y cotizaciones pedidas — para saber qué público responde y dónde se pierde.`)}
  </section>`);

// ── 9 · Lo que se dice ───────────────────────────────────────────────────
const filtro = (n, titulo, texto, color) => `
        <div style="${CARD} border-radius: 24px; padding: 30px 30px 28px; display: flex; flex-direction: column; gap: 12px; border-top: 6px solid ${color};">
          <span style="font-size: 54px; font-weight: 800; color: ${color}; letter-spacing: -2px; line-height: 1;">${n}</span>
          <span style="font-size: 29px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.6px; line-height: 1.2;">${titulo}</span>
          <span style="font-size: 21px; font-weight: 400; color: ${MUTED}; line-height: 1.48;">${texto}</span>
        </div>`;

slides.push(`
  <section data-label="Lo que se dice" data-screen-label="Afirmaciones aprobadas" data-speaker-notes="En productos de salud un anuncio de mas puede costar mas que no anunciarse. Todo texto sale de una lista aprobada por el cliente." style="${seccion()}">
    ${header('Cuidado')}
    ${h2('En salud, lo que se dice<br>se tiene que poder probar', 58)}
    ${bajada('COFEPRIS y SENASICA vigilan la publicidad de los productos que regulan, también en internet. Por eso cada frase del sitio y de las redes pasa por tres filtros.', 1500)}
    <div data-a="up3" style="margin-top: 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      ${filtro('1', 'Tiene respaldo', 'Cada afirmación lleva al lado el estudio, la ficha o el registro que la sostiene.', TEAL_T)}
      ${filtro('2', 'Coincide con el registro', 'No se dice más —ni distinto— de lo que el producto tiene autorizado.', NAVY)}
      ${filtro('3', 'La aprueban ustedes', 'Una lista de afirmaciones firmada por la empresa. Nada se publica sin su visto bueno.', ORANGE)}
    </div>
    <div style="height: 24px;"></div>
    <div data-a="up3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1;">
      <div style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 13px; border-left: 6px solid ${TEAL_T};">
        ${etiqueta('Sí se publica', TEAL_T)}
        ${bullet('Resultados de laboratorio, con el organismo, el tiempo y el informe', TEAL_T, 22)}
        ${bullet('Para qué se usa, tal como dice el registro', TEAL_T, 22)}
        ${bullet('Presentaciones y modo de uso de la etiqueta', TEAL_T, 22)}
      </div>
      <div style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 13px; border-left: 6px solid ${ORANGE};">
        ${etiqueta('Se queda fuera hasta tener respaldo', ORANGE)}
        ${bullet('Promesas que todavía no tienen un estudio detrás', ORANGE, 22, INK, '–')}
        ${bullet('Usos que no están en el registro del producto', ORANGE, 22, INK, '–')}
        ${bullet('Comparaciones con otras marcas', ORANGE, 22, INK, '–')}
      </div>
    </div>
    <div style="height: 20px;"></div>
    ${nota(`${fuerte('Esto también es un servicio:')} la lista de afirmaciones aprobadas es la misma que usa Andrea para las redes y quien lleve las relaciones públicas. Todos dicen lo mismo, y lo que dicen se puede sostener.`)}
  </section>`);

// ── 10 · Boletín ─────────────────────────────────────────────────────────
const numeroBoletin = (n, titulo, color, fecha) => `
          <div style="display: flex; align-items: center; gap: 18px; padding: 16px 20px; border-radius: 14px; background: #FFFFFF; border: 1px solid ${LINE};">
            <span style="flex: none; width: 54px; height: 54px; border-radius: 14px; background: ${color}; color: #FFFFFF; font-size: 21px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">${n}</span>
            <div style="display: flex; flex-direction: column; gap: 3px; flex: 1;">
              <span style="font-size: 20px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.2px;">${titulo}</span>
              <span style="font-size: 15px; font-weight: 500; color: ${MUTED};">${fecha}</span>
            </div>
            <span style="font-size: 15px; font-weight: 700; color: ${color === ORANGE ? ORANGE : TEAL_T}; letter-spacing: 0.4px;">Leer →</span>
          </div>`;

slides.push(`
  <section data-label="El boletín" data-screen-label="Boletín" data-speaker-notes="El boletin se escribe una vez y vive en tres lugares. Axl lo sube al sitio y mantiene el archivo." style="${seccion()}">
    ${header('El boletín')}
    ${h2('Un boletín que mantiene<br>vivo al sitio', 58)}
    <div data-a="up3" style="margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
        ${bullet(`${fuerte('Se escribe una vez y vive en tres lugares:')} el correo de quien se suscribe, el archivo del sitio y las redes`, TEAL_T, 25)}
        ${bullet(`${fuerte('Dos listas:')} salud humana y veterinaria, para que cada quien reciba solo lo suyo`, TEAL_T, 25)}
        ${bullet(`${fuerte('Cada número tiene su propia página:')} se puede compartir y, además, es una razón más para aparecer en las búsquedas`, TEAL_T, 25)}
        ${bullet(`${fuerte('Suscripción en el sitio y baja con un clic,')} con su aviso de privacidad`, TEAL_T, 25)}
        <div style="flex: 1;"></div>
        <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Quién redacta cada número se acuerda con el equipo de relaciones públicas y redes. Del lado del sitio, cada número se sube y el archivo se mantiene al día.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${navegador('mtomicronsigma.com.mx/boletin', `
        <div style="padding: 26px 28px 30px; background: ${BG}; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 30px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.8px;">Boletín</span>
            <div style="display: flex; gap: 8px;">${pill('Salud humana', TEAL_T)}${pill('Veterinaria', ORANGE)}</div>
          </div>
          ${numeroBoletin('03', 'Título del tercer número', TEAL_T, 'Fecha de publicación')}
          ${numeroBoletin('02', 'Título del segundo número', ORANGE, 'Fecha de publicación')}
          ${numeroBoletin('01', 'Título del primer número', TEAL_T, 'Fecha de publicación')}
          <div style="margin-top: 6px; display: flex; gap: 12px;">
            <span style="flex: 1; height: 50px; border-radius: 12px; background: #FFFFFF; border: 1px solid ${LINE}; display: flex; align-items: center; padding: 0 18px; font-size: 16px; color: ${MUTED};">tu correo</span>
            <span style="height: 50px; border-radius: 12px; background: ${NAVY}; color: #FFFFFF; font-size: 16px; font-weight: 700; display: flex; align-items: center; padding: 0 24px;">Suscribirme</span>
          </div>
        </div>`)}
        <span style="font-size: 16px; font-weight: 400; color: ${MUTED}; text-align: center;">Maqueta de ejemplo: los títulos y las fechas son de relleno.</span>
      </div>
    </div>
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
  <section data-label="Un equipo, tres frentes" data-screen-label="Equipo" data-speaker-notes="Tres frentes con una sola cara para el cliente. Las relaciones publicas y el relanzamiento de marca los lleva la mama de Andrea; falta alinear con su resumen." style="${seccion()}">
    ${header('Equipo')}
    ${h2('Tres frentes que se<br>refuerzan entre sí', 58)}
    <div data-a="up3" style="margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; flex: 1;">
      ${frente('1', SLATE, 'Marca y relaciones públicas', 'Relaciones públicas', [
        'Relanzamiento de MT Omicron Sigma como marca madre',
        'EsteriLife y Zoolubac, cada una con su lugar',
        'Contacto con hospitales, asociaciones, veterinarios y distribuidores'], 'su resumen de relaciones y relanzamiento, por alinear')}
      ${frente('2', ORANGE, 'Redes sociales', 'Andrea Hasly Guillen Luna', [
        'Contenido para las dos marcas, en el tono de cada público',
        'Paquete mensual de publicaciones, videos y coberturas',
        'Usa la lista de afirmaciones aprobadas'], 'el paquete mensual, por definir')}
      ${frente('3', TEAL_T, 'Sitio web y boletín', 'Axl Guillén', [
        'El sitio nuevo, en su propio dominio y con HTTPS',
        'Catálogo, evidencia y formas de contacto',
        'El boletín: cada número sube al archivo del sitio'], 'el sitio en línea y el archivo del boletín al día')}
    </div>
    <div style="height: 24px;"></div>
    ${nota(`${fuerte('Así se conectan:')} las relaciones públicas abren puertas, las redes las muestran, el sitio las convierte en cotizaciones y el boletín las mantiene calientes. Una sola cara para ustedes, tres frentes por detrás.`)}
  </section>`);

// ── 12 · Plan y tiempos ──────────────────────────────────────────────────
const barra = (inicio, fin, color, titulo, texto) => `
        <div style="display: grid; grid-template-columns: 330px 1fr; gap: 28px; align-items: center;">
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 24px; font-weight: 700; color: ${NAVY}; letter-spacing: -0.3px;">${titulo}</span>
            <span style="font-size: 19px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">${texto}</span>
          </div>
          <div style="position: relative; height: 54px; border-radius: 12px; background: ${LINE}66;">
            <div style="position: absolute; top: 0; bottom: 0; left: ${inicio * 20}%; width: ${(fin - inicio) * 20}%; border-radius: 12px; background: ${color};"></div>
          </div>
        </div>`;

slides.push(`
  <section data-label="Plan y tiempos" data-screen-label="Plan" data-speaker-notes="Tiempos por confirmar: dependen de cuando llegue el material y las aprobaciones. El dominio y el correo se migran sin cortar el servicio." style="${seccion()}">
    ${header('Plan', pill('Tiempos por confirmar', SLATE))}
    ${h2('De material a sitio en línea,<br>en unas cuatro semanas', 58)}
    <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 20px; flex: 1;">
      <div style="display: grid; grid-template-columns: 330px 1fr; gap: 28px;">
        <span></span>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); font-size: 16px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">
          <span>Semana 1</span><span>Semana 2</span><span>Semana 3</span><span>Semana 4</span><span>Después</span>
        </div>
      </div>
      ${barra(0, 1, SLATE, 'Material y mensajes', 'Logos, fotos, fichas y la lista de afirmaciones aprobadas.')}
      ${barra(1, 2, TEAL_T, 'Diseño', 'Inicio y fichas de producto, con su visto bueno.')}
      ${barra(2, 3, TEAL_T, 'Construcción', 'Contenido real, versión de celular, WhatsApp y formularios.')}
      ${barra(3, 4, ORANGE, 'Salida', 'Dominio con HTTPS, correo sin cortes y revisión final.')}
      ${barra(4, 5, GOLD, 'Boletín y mejora', 'Cada número al archivo; ajustes con lo que se mida.')}
    </div>
    ${nota(`${fuerte('Lo que más mueve las fechas es el material y las aprobaciones,')} no la construcción. Mientras antes lleguen las fichas, las fotos y la lista de afirmaciones, antes sale el sitio. El dominio y el correo se migran sin cortar el servicio actual.`)}
  </section>`);

// ── 13 · Inversión ───────────────────────────────────────────────────────
slides.push(`
  <section data-label="Inversión" data-screen-label="Inversión" data-speaker-notes="PRECIO POR DEFINIR. Dos formas de cobro sobre la mesa: proyecto cerrado, o repartida en la primera mensualidad del paquete de redes." style="${seccion()}">
    ${header('Inversión', pill('Por definir', ORANGE))}
    ${h2('Qué incluye y cómo se paga', 62)}
    <div data-a="up3" style="margin-top: 38px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 34px; flex: 1;">
      <div style="${CARD} border-radius: 28px; padding: 42px 40px; display: flex; flex-direction: column; gap: 24px; border-top: 6px solid ${TEAL_T};">
        ${etiqueta('El sitio incluye', TEAL_T)}
        ${bullet('Diseño propio con la identidad de las tres marcas', TEAL_T, 24)}
        ${bullet('Inicio con las dos puertas y una ficha por producto', TEAL_T, 24)}
        ${bullet('Evidencia y registros, con lo que ustedes aprueben', TEAL_T, 24)}
        ${bullet('Dónde comprar, WhatsApp y formularios por público', TEAL_T, 24)}
        ${bullet('Boletín con suscripción y archivo', TEAL_T, 24)}
        ${bullet('Dominio propio con HTTPS, y versión de celular', TEAL_T, 24)}
        ${bullet('Textos y estructura pensados para aparecer en Google', TEAL_T, 24)}
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div style="border-radius: 28px; border: 3px dashed ${ORANGE}; background: ${ORANGE}0D; padding: 34px 38px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${etiqueta('Inversión del sitio', ORANGE)}
            <span style="font-size: 23px; font-weight: 400; color: ${MUTED};">Se presenta en la reunión.</span>
          </div>
          <span style="font-size: 76px; font-weight: 800; color: ${ORANGE}; letter-spacing: -2.5px; line-height: 1;">$ —</span>
        </div>
        <div style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; gap: 12px;">
          ${etiqueta('Dos formas de pagarlo', NAVY)}
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 23px; font-weight: 700; color: ${NAVY};">A · Proyecto cerrado</span>
            <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Precio y fecha de entrega definidos desde el inicio.</span>
          </div>
          <div style="height: 1px; background: ${LINE};"></div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 23px; font-weight: 700; color: ${NAVY};">B · Dentro de la primera mensualidad</span>
            <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">La primera mensualidad del paquete de redes se extiende para cubrir el sitio, y no se paga como un costo aparte.</span>
          </div>
        </div>
        <span style="font-size: 20px; font-weight: 400; color: ${MUTED}; line-height: 1.5;">Redes, boletín y mantenimiento del sitio son un servicio mensual aparte, también por definir.</span>
      </div>
    </div>
    <div style="height: 24px;"></div>
    ${nota(`${fuerte('El precio se arma sobre este alcance.')} Si más adelante se suma algo —por ejemplo la tienda en línea de algún producto— se cotiza aparte, sin mover lo ya acordado.`, ORANGE)}
  </section>`);

// ── 14 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Siguiente paso" data-screen-label="Cierre" data-speaker-notes="Cierre: lo que necesitamos de ellos para arrancar, y una pregunta sobre por que publico empezar." style="background: ${NAVY}; background-image: radial-gradient(80% 70% at 18% 90%, rgba(98,199,196,0.26) 0%, rgba(0,0,0,0) 60%); font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${ORANGE}; clip-path: polygon(78% 0, 100% 0, 100% 100%, 66% 100%);"></div>
    <div data-a="ghost" style="position: absolute; inset: 0; background: ${GOLD}; clip-path: polygon(77.3% 0, 78% 0, 66% 100%, 65.3% 100%);"></div>
    <span data-a="up" style="position: relative; font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${TEAL};">Siguiente paso</span>
    <h2 data-a="up2" style="position: relative; margin: 26px 0 0; font-size: 80px; font-weight: 700; letter-spacing: -2.6px; line-height: 1.05; max-width: 1180px;">Con cinco cosas de su lado,<br>arrancamos</h2>
    <div data-a="up3" style="position: relative; margin-top: 38px; display: flex; flex-direction: column; gap: 15px; max-width: 1060px;">
      ${bullet('Logos en vectorial y fotos de producto en buena resolución', TEAL, 24, '#FFFFFF')}
      ${bullet('Fichas técnicas vigentes y qué registros se pueden publicar', TEAL, 24, '#FFFFFF')}
      ${bullet('Presentaciones vigentes de cada producto', TEAL, 24, '#FFFFFF')}
      ${bullet('Acceso al dominio y al correo actuales', TEAL, 24, '#FFFFFF')}
      ${bullet('Quién aprueba los textos de su lado', TEAL, 24, '#FFFFFF')}
    </div>
    <p data-a="up3" style="position: relative; margin: 38px 0 0; font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.88); line-height: 1.5; max-width: 980px;">Y una decisión para empezar: ¿por cuál de los dos públicos abrimos primero?</p>
    <div data-a="up3" style="position: relative; margin-top: 40px; display: flex; align-items: center; gap: 26px;">
      ${logoMT(96, true)}
      <span style="width: 1px; height: 60px; background: rgba(255,255,255,0.3);"></span>
      <span style="font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.75); line-height: 1.5;">Axl Guillén · sitio web y boletín</span>
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
${kit.og({ titulo: 'Propuesta · MT Omicron Sigma', descripcion: 'Un sitio web nuevo para vender a dos públicos: hospitales y clínicas con EsteriLife, veterinarios y productores con Zoolubac.', carpeta: 'personal/omicron' })}
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
