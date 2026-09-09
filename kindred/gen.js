// Generador de index.html — Kindred cumple 11 años (screenshots para TikTok)
// Ejecutar: node kindred/gen.js
//
// Serie «Cumplelolero» #12, animado. Lore primero (quinto episodio seguido con
// ese orden, tras ivern, missfortune, syndra y riven).
//
// ⚠️ El video va **adelantado un día**: se graba para el domingo 13 y el
// cumpleaños real es el lunes 14, así que la portada dice «mañana cumple».
//
// Piezas de diseño:
//  · **El deck entero está partido en dos**, que es de lo que va el personaje.
//    Cordero es el hueso cálido y Lobo el azul espectral, y ningún bloque los
//    mezcla: donde manda uno, el otro no aparece. Es el único deck de la serie
//    con dos acentos en paridad en vez de uno principal y otro de apoyo.
//  · El motivo son **las dos máscaras** (`mascaraCordero()` y `mascaraLobo()`),
//    dibujadas. Y van **cruzadas a propósito**: Cordero lleva la de lobo y Lobo
//    la de cordero, como en el lore.
//  · La pieza es la lámina del hacha: **una sola máscara se parte en dos** y las
//    mitades se separan. El corte se ve, no se explica.
//  · La lámina del one trick invierte la escala del resto de la serie: la cifra
//    enorme arriba y **cuatro filas de Hierro debajo**, todas iguales. El hueco
//    entre las dos cosas es el dato.
//  · La rejilla de skins es **deliberadamente monótona**: las siete al mismo
//    precio, con la misma etiqueta. Que se vea plana es el punto.
//
// ⚠️ El récord de ventaja sobre el segundo del mundo (1,86×, que supera a riven
// con 1,84× y a syndra con 1,81×) **no sale en el deck**: la investigación lo
// trae pero el guion no lo narra, y en su lugar dice «el hueco más grande entre
// puntos y rango». Meter otro récord ahí competiría con ese remate.
//
// Paleta muestreada del splash: el fondo es negro-verdoso, el Lobo aporta el
// azul espectral (hue 210) y el cuerpo del suelo el oro apagado (hue 40).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Kindred: la noche, y los dos que son uno ──────────────────────
const BG = '#07090C';        // bosque de noche
const LOBO = '#4D9EE6';      // azul espectral de sus ojos — la muerte violenta
const CORDERO = '#F0E3C8';   // hueso cálido — la muerte tranquila
const ORO = '#C9A63C';       // el cuerpo del suelo — dinero y skins
const HIERRO = '#8A7F76';    // gris pardo, reservado al historial del one trick
const BONE = '#EAEBEF';      // texto principal
const MUTED = '#79808A';     // texto secundario
const PANEL = '#101419';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = LOBO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash
// (helper de missfortune). La capa borrosa sangra fuera del marco, de ahí el
// contenedor con overflow oculto: si no, infla scrollHeight y el QA marca un
// desborde falso.
const portada = (src, alt, posNitida = 'center 30%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(46px) saturate(0.85) brightness(0.42); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 780px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,9,12,0.16) 0%, rgba(7,9,12,0.40) 34%, rgba(7,9,12,0.92) 64%, rgba(7,9,12,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = LOBO) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(7,9,12,0.9);">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// ── Las dos máscaras: el motivo del deck ─────────────────────────────────
// Dibujadas, no recortadas del splash: se repiten en cinco láminas a tamaños
// muy distintos y tienen que poder partirse por la mitad en la del hacha.
// Van cruzadas a propósito — Cordero lleva la de lobo y Lobo la de cordero.
const mascaraCordero = (tam = 96, color = CORDERO, id = 'c') => `
    <svg data-mascara viewBox="0 0 72 72" width="${tam}" height="${tam}" style="flex: none; display: block; filter: drop-shadow(0 0 ${Math.round(tam * 0.3)}px ${color}66);" aria-hidden="true">
      <path d="M25 14 C11 11 2 22 6 35 C8.5 43 15 46 19 42 C12 40 9 33 11 26 C13 19 19 16 25 19 Z" fill="${color}"/>
      <path d="M47 14 C61 11 70 22 66 35 C63.5 43 57 46 53 42 C60 40 63 33 61 26 C59 19 53 16 47 19 Z" fill="${color}"/>
      <path d="M36 8 C45 8 49 18 49 32 C49 48 43 68 36 68 C29 68 23 48 23 32 C23 18 27 8 36 8 Z" fill="${color}"/>
      <ellipse cx="30.6" cy="33" rx="3.4" ry="6.6" transform="rotate(-16 30.6 33)" fill="${BG}"/>
      <ellipse cx="41.4" cy="33" rx="3.4" ry="6.6" transform="rotate(16 41.4 33)" fill="${BG}"/>
    </svg>`;

const mascaraLobo = (tam = 96, color = LOBO) => `
    <svg data-mascara viewBox="0 0 72 72" width="${tam}" height="${tam}" style="flex: none; display: block; filter: drop-shadow(0 0 ${Math.round(tam * 0.3)}px ${color}66);" aria-hidden="true">
      <path d="M19 20 L10 1 L31 12 Z" fill="${color}"/>
      <path d="M53 20 L62 1 L41 12 Z" fill="${color}"/>
      <path d="M36 9 L55 17 L60 34 L47 54 L36 69 L25 54 L12 34 L17 17 Z" fill="${color}"/>
      <path d="M21 32 L32.5 27 L32.5 38 L22.5 39 Z" fill="${BG}"/>
      <path d="M51 32 L39.5 27 L39.5 38 L49.5 39 Z" fill="${BG}"/>
      <path d="M29 51 L36 47 L43 51 L36 60 Z" fill="${BG}"/>
    </svg>`;

// Las dos juntas, que es como siempre aparecen: nunca una sola.
const parMascaras = (tam = 96, gap = 34) => `
      <div data-par style="display: flex; align-items: center; gap: ${gap}px;">
        <span data-lado="cordero" style="display: block;">${mascaraCordero(tam)}</span>
        <span data-lado="lobo" style="display: block;">${mascaraLobo(tam)}</span>
      </div>`;

const pasos = (lista, color = LOBO) => `
      <div data-a="up3" style="margin-top: 32px; display: flex; flex-direction: column; gap: 16px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${color}; width: 44px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = LOBO) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// «Mañana cumple» y no «hoy»: el video se graba adelantado un día.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Y ahi les va algo que no deberian de saber. Manana cumple anos Kindred, que va a llevar once anos desde que llego a la Grieta del Invocador, y toca darle sus tres minutos de atencion para que los otepes de esta mierda me den su apoyo incondicional." style="${seccion()}">
    ${portada('Kindred_0.jpg', 'Kindred, los Cazadores Eternos', 'center 28%')}
    ${glow(LOBO, '52% 26%', '120% 44%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · mañana, 14 sep')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 196px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE};"><span data-linea style="display: block;">KINDRED</span><span data-linea style="display: block; color: ${LOBO};">11 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 38px; font-weight: 500; color: ${CORDERO}; line-height: 1.3;">Los Cazadores Eternos</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Jungla · Tirador · <strong style="color: ${BONE};">no tiene nación: es un dios</strong></p>
      <div data-sub style="margin-top: 38px;">${parMascaras(86, 30)}</div>
    </div>
  </section>`);

// ── 2 · No es un campeón, es la muerte ───────────────────────────────────
slides.push(`
  <section data-label="Es la muerte" data-screen-label="02 · La muerte" data-speaker-notes="Y les voy a decir algo de una vez. Kindred no es un campeon. Kindred es la muerte. Y son dos." style="${seccion('align-items: center; text-align: center;')}">
    ${glow(LOBO, '50% 44%', '120% 56%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Y les voy a decir algo de una vez')}
      <div data-frase style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.98; color: ${MUTED};">KINDRED NO ES<br>UN CAMPEÓN</div>
      <div data-igual style="margin: 30px 0; width: 130px; height: 4px; background: ${LOBO};"></div>
      <div data-frase style="font-family: ${DISPLAY}; font-size: 168px; line-height: 0.9; color: ${BONE}; text-shadow: 0 0 80px rgba(77,158,230,0.4);">ES LA MUERTE</div>
      <div data-frase style="margin-top: 20px; font-family: ${DISPLAY}; font-size: 112px; line-height: 1; color: ${LOBO};">Y SON DOS</div>
      <div style="margin-top: 46px;">${parMascaras(112, 44)}</div>
    </div>
  </section>`);

// ── 3 · Lore I · El que estaba solo ──────────────────────────────────────
slides.push(`
  <section data-label="El que estaba solo" data-screen-label="03 · El origen" data-speaker-notes="Porque al principio era uno solo. El lore lo describe como un hombre palido de pelo oscuro que era el dios de la muerte, y estaba completamente solo. Y no porque quisiera, sino porque todo lo que esta vivo tarde o temprano se lo tiene que topar. Entonces la gente lo rechazaba." style="${seccion()}">
    ${glow(CORDERO, '50% 34%', '112% 50%')}
    <div style="position: relative;">
      ${eyebrow('Al principio era uno solo', CORDERO)}
      ${titulo('Un hombre pálido<br><span style="color: ' + CORDERO + ';">de pelo oscuro</span>', 96)}
      ${pasos([
        'Era <strong style="color:' + BONE + ';">el dios de la muerte</strong>, y estaba completamente solo',
        'No porque quisiera: <strong style="color:' + BONE + ';">todo lo que está vivo</strong> tarde o temprano se lo tiene que topar',
        'Y por eso <strong style="color:' + BONE + ';">la gente lo rechazaba</strong>',
      ], CORDERO)}
      ${remate('Nadie quiere estar cerca de <strong style="color: ' + CORDERO + ';">la única cita que no se puede cancelar</strong>.', CORDERO)}
    </div>
  </section>`);

// ── 4 · Lore II · El hacha ───────────────────────────────────────────────
// La pieza del deck: una máscara sola que se parte y se separa en dos.
slides.push(`
  <section data-label="El hacha" data-screen-label="04 · El hacha" data-speaker-notes="Y wachen lo que hizo. Agarro un hacha y se partio a si mismo en dos. Asi tal cual, literal. El lore lo dice con estas palabras, lo hizo para tener siempre un amigo. Y de esas dos mitades salieron Cordero y Lobo. Separados para siempre pero juntos siempre." style="${seccion('align-items: center; text-align: center;')}">
    ${glow(LOBO, '50% 40%', '118% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Y wachen lo que hizo')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 104px; font-weight: 400; line-height: 0.94; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">Agarró un hacha<br>y <span style="color: ${LOBO};">se partió en dos</span></h2>

      <div data-corte style="margin-top: 52px; position: relative; width: 460px; height: 240px; display: flex; align-items: center; justify-content: center;">
        <div data-mitad="izq" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 220px; height: 220px; clip-path: polygon(-30% -30%, 50% -30%, 50% 130%, -30% 130%);">${mascaraCordero(220, CORDERO)}</div>
        <div data-mitad="der" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 220px; height: 220px; clip-path: polygon(50% -30%, 130% -30%, 130% 130%, 50% 130%);">${mascaraLobo(220, LOBO)}</div>
        <div data-tajo style="position: absolute; left: 50%; top: -10px; width: 3px; height: 260px; background: linear-gradient(180deg, rgba(255,255,255,0) 0%, ${BONE} 22%, ${BONE} 78%, rgba(255,255,255,0) 100%); transform: translateX(-50%);"></div>
      </div>

      <div data-por style="margin-top: 44px; padding: 28px 36px; border-radius: 18px; background: ${LOBO}1A; border: 1px solid ${LOBO}66; max-width: 800px;">
        <div style="font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">El lore lo dice con estas palabras</div>
        <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 76px; line-height: 1.02; color: ${BONE};">«Para tener<br><span style="color: ${LOBO};">siempre un amigo»</span></div>
      </div>

      <p data-sep style="margin: 34px 0 0; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.35;">Separados para siempre, <strong style="color: ${BONE};">pero juntos siempre</strong>.</p>
    </div>
  </section>`);

// ── 5 · Lore III · Cordero y Lobo ────────────────────────────────────────
// La lámina de la dualidad: dos columnas que no comparten ni un color.
const mitades = [
  ['cordero', 'CORDERO', 'La muerte tranquila', CORDERO,
   'Si <strong>aceptas</strong> que ya te tocó', 'Te mete una flecha limpia y se acabó. <strong>Sin dolor.</strong>'],
  ['lobo', 'LOBO', 'La muerte violenta', LOBO,
   'Si <strong>te resistes</strong> y sales corriendo', 'Te caza. <strong>Y lo disfruta.</strong>'],
];

slides.push(`
  <section data-label="Cordero y Lobo" data-screen-label="05 · Los dos" data-speaker-notes="Y cada uno hace un trabajo distinto. Cordero es la muerte tranquila, es arquera, y al que acepta que ya le toco le mete una flecha limpia y se acabo, sin dolor. Lobo es la muerte violenta, y al que se resiste y sale corriendo lo caza. Y lo disfruta. O sea que si eliges como te vas. Nomas que casi nadie elige a conciencia, muchos ya eligieron sin saberlo nomas por como vivieron." style="${seccion()}">
    ${glow(LOBO, '76% 40%', '80% 55%')}
    ${glow(CORDERO, '24% 40%', '80% 55%')}
    <div style="position: relative;">
      ${eyebrow('Cada uno hace un trabajo distinto')}

      <div style="margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        ${mitades.map(([id, quien, que, color, cuando, como]) => `
        <div data-mitad-col style="padding: 30px 28px; border-radius: 20px; background: ${color}12; border: 1px solid ${color}59; display: flex; flex-direction: column; align-items: center; text-align: center;">
          ${id === 'cordero' ? mascaraCordero(126, color) : mascaraLobo(126, color)}
          <div style="margin-top: 20px; font-family: ${DISPLAY}; font-size: 76px; line-height: 1; color: ${color};">${quien}</div>
          <div style="margin-top: 2px; font-size: 23px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">${que}</div>
          <div style="margin-top: 22px; width: 64px; height: 3px; background: ${color}80;"></div>
          <div style="margin-top: 20px; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${cuando}</div>
          <div style="margin-top: 10px; font-size: 27px; font-weight: 400; color: ${BONE}; line-height: 1.35;">${como}</div>
        </div>`).join('')}
      </div>

      ${remate('O sea que <strong style="color: ' + BONE + ';">sí eliges cómo te vas</strong>. Nomás que casi nadie elige a conciencia: muchos ya eligieron <strong style="color: ' + BONE + ';">nomás por cómo vivieron</strong>.')}
    </div>
  </section>`);

// ── 6 · Lore IV · Cómo se acaba todo ─────────────────────────────────────
slides.push(`
  <section data-label="Cómo se acaba todo" data-screen-label="06 · El final" data-speaker-notes="Y wachen como se acaba todo esto. En el lore esta sugerido que cuando ya no quede nada vivo en Runeterra o cuando la gente deje de creer en ellos, Cordero y Lobo se van a matar el uno al otro. O sea que el unico ser al que la muerte no puede matar es a si misma. Tiene que esperar a quedarse sin trabajo." style="${seccion()}">
    ${glow(LOBO, '50% 38%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y wachen cómo se acaba todo')}
      ${titulo('Cuando no quede<br><span style="color: ' + LOBO + ';">nada vivo</span>', 100)}

      <div data-duelo style="margin-top: 46px; display: flex; align-items: center; justify-content: center; gap: 60px;">
        <span data-frente="cordero" style="display: block;">${mascaraCordero(160, CORDERO)}</span>
        <span data-vs style="font-family: ${DISPLAY}; font-size: 74px; line-height: 1; color: ${MUTED};">se matan<br>entre ellos</span>
        <span data-frente="lobo" style="display: block; transform: scaleX(-1);">${mascaraLobo(160, LOBO)}</span>
      </div>

      <div data-remate style="margin-top: 48px; padding: 34px 38px; border-radius: 20px; background: ${CORDERO}12; border-left: 6px solid ${CORDERO};">
        <div style="font-family: ${DISPLAY}; font-size: 72px; line-height: 1.02; color: ${BONE};">El único ser al que la muerte<br><span style="color: ${CORDERO};">no puede matar es a sí misma</span></div>
        <div style="margin-top: 16px; font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Tiene que esperar a <strong style="color: ${BONE};">quedarse sin trabajo</strong>.</div>
      </div>
    </div>
  </section>`);

// ── 7 · El one trick, y el hueco más grande de la serie ──────────────────
// La cifra arriba y el historial abajo. Todas las filas dicen lo mismo a
// propósito: la monotonía del Hierro es la mitad del chiste.
const rangos = [
  ['S2025', 'Hierro 4', 'iron.png'],
  ['S2024 S3', 'Hierro 3', 'iron.png'],
  ['S2024 S2', 'Hierro 3', 'iron.png'],
  ['S2024 S1', 'Hierro 4', 'iron.png'],
  ['S2023 S2', 'Bronce 4', 'bronze.png'],
];

slides.push(`
  <section data-label="El one trick" data-screen-label="07 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos, y este esta mal de la cabeza. Es un taiwanes con diecisiete millones de puntos y nivel de maestria mil trescientos setenta. Y agarrense porque aqui es donde se pone bueno. Este cabron esta sin clasificar esta temporada. Y su historial completo de rangos es Hierro cuatro, Hierro tres, Hierro tres, Hierro cuatro. Diecisiete millones de puntos y nunca ha salido de Hierro. Su segundo campeon es Miss Fortune con doce veces menos puntos. Es el hueco mas grande entre puntos y rango que hemos visto en toda la serie. Malphite en Bronce ya no es nada." style="${seccion()}">
    ${glow(ORO, '50% 24%', '118% 40%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo', ORO)}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${BONE};">PKOOPK</span>
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 0.95; color: ${ORO};">#TW2</span>
      </div>
      <p data-nombre style="margin: 10px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Taiwán · nivel de invocador 1 773 · maestría 1 370</p>

      <div data-cifra style="margin-top: 22px;">
        <div data-cuenta="17075802" style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.86; color: ${ORO};">17 075 802</div>
        <div style="margin-top: 4px; font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div data-sin style="margin-top: 30px; display: flex; align-items: center; gap: 22px; padding: 22px 28px; border-radius: 16px; background: ${HIERRO}1F; border: 1px solid ${HIERRO}80;">
        <span style="flex: 1; font-family: ${DISPLAY}; font-size: 64px; line-height: 1; color: ${HIERRO};">Sin clasificar esta temporada</span>
      </div>

      <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 10px;">
        ${rangos.map(([temp, nombre, emblema]) => `
        <div data-rango style="display: flex; align-items: center; gap: 16px; padding: 9px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
          <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 52px; height: 52px; object-fit: contain; flex: none;">
          <span style="flex: none; width: 128px; font-size: 23px; font-weight: 600; color: ${MUTED};">${temp}</span>
          <span style="flex: 1; font-size: 28px; font-weight: 600; color: ${HIERRO};">${nombre}</span>
        </div>`).join('')}
      </div>

      ${remate('Diecisiete millones de puntos y <strong style="color: ' + HIERRO + ';">nunca ha salido de Hierro</strong>. Es <strong style="color: ' + BONE + ';">el hueco más grande de la serie</strong> — Malphite en Bronce ya no es nada.', ORO)}
    </div>
  </section>`);

// ── 8 · El bloque LATAM más fuerte desde Talon ───────────────────────────
// «servidor del norte» y «del sur» a propósito: nunca LAN ni LAS.
const latinos = [
  ['#5', 'Jamas otro', 'norte', '8 205 013', true],
  ['#11', 'Ouro Kronii Simp', 'sur', '6 774 957', true],
  ['#15', 'Raid Night', 'norte', '6 000 148', true],
  ['#17', 'ProKind', 'norte', '5 900 209', true],
  ['#35', 'beckylover', 'norte', '', false],
  ['#45', 'Ovejo', 'sur', '', false],
  ['#47', 'EsposodeKindred', 'norte', '', false],
];

slides.push(`
  <section data-label="Somos potencia" data-screen-label="08 · LATAM" data-speaker-notes="Y ahora si saquen la banderita porque en Kindred somos potencia. Hay siete latinos en el top cincuenta del mundo y cuatro de esos estan en el top veinte. El mas alto esta en el quinto lugar del planeta con ocho millones de puntos. Y uno de ellos se puso de nombre EsposodeKindred asi que ahi les dejo la informacion." style="${seccion()}">
    ${glow(CORDERO, '50% 36%', '115% 52%')}
    <div style="position: relative;">
      ${eyebrow('Saquen la banderita', CORDERO)}
      ${titulo('En Kindred<br><span style="color: ' + CORDERO + ';">somos potencia</span>', 96)}

      <div data-cabecera style="margin-top: 26px; display: flex; gap: 18px;">
        ${[['7', 'en el top 50 del mundo'], ['4', 'en el top 20'], ['#5', 'el más alto del planeta']].map(([cifra, pie]) => `
        <div style="flex: 1; padding: 20px 16px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid rgba(240,227,200,0.20); text-align: center;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${CORDERO};">${cifra}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${pie}</div>
        </div>`).join('')}
      </div>

      <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 9px;">
        ${latinos.map(([puesto, quien, server, puntos, top]) => `
        <div data-latino style="display: flex; align-items: center; gap: 16px; padding: 10px 18px; border-radius: 12px; ${top ? `background: ${CORDERO}12; border: 1px solid ${CORDERO}4D;` : 'border: 1px solid rgba(255,255,255,0.06);'}">
          <span style="flex: none; width: 74px; font-family: ${DISPLAY}; font-size: 44px; line-height: 1; color: ${top ? CORDERO : MUTED};">${puesto}</span>
          <span style="flex: 1; min-width: 0; font-size: ${top ? 27 : 24}px; font-weight: ${top ? 700 : 500}; color: ${top ? BONE : MUTED}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${quien}</span>
          <span style="flex: none; font-size: 19px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${server}</span>
          ${puntos ? `<span style="flex: none; width: 152px; text-align: right; font-family: ${DISPLAY}; font-size: 34px; line-height: 1; color: ${CORDERO};">${puntos}</span>` : '<span style="flex: none; width: 152px;"></span>'}
        </div>`).join('')}
      </div>

      ${remate('Y uno se puso de nombre <strong style="color: ' + CORDERO + ';">EsposodeKindred</strong>. Ahí les dejo la información.', CORDERO)}
    </div>
  </section>`);

// ── 9 · Las skins, y el catálogo más plano de la serie ───────────────────
// Todas las etiquetas dicen 1350. Que se vea monótono es exactamente el dato.
const skins = [
  ['Kindred_1.jpg', 'Fuego Sombrío', '2015'],
  ['Kindred_2.jpg', 'Supergalácticos', '2016'],
  ['Kindred_3.jpg', 'Flor Espiritual', '2020'],
  ['Kindred_12.jpg', 'de Porcelana', '2022'],
  ['Kindred_22.jpg', 'Can y Cordero', '2023'],
  ['Kindred_34.jpg', 'Elegido del Lobo', '2024'],
  ['Kindred_45.jpg', 'Pandemonium', '2026'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="09 · Las skins" data-speaker-notes="Y de skins tiene nueve y siete que puedes comprar, que te saldrian en unos setenta y tres dolares, cuatro dias y medio de salario minimo. Pero wachen el detalle. Las siete cuestan exactamente lo mismo, mil trescientos cincuenta cada una. Ni una barata ni una cara. Kindred lleva once anos sin que Riot le saque una legendaria ni una ultimate. Es el unico de la serie con el catalogo asi de plano." style="${seccion()}">
    ${glow(ORO, '50% 32%', '115% 52%')}
    <div style="position: relative;">
      ${eyebrow('Las skins', ORO)}
      ${titulo('9 skins, y <span style="color: ' + ORO + ';">7 a la venta</span>', 92)}

      <div style="margin-top: 26px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;">
        ${skins.map(([img, nombre, anio]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 6px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 124px; object-fit: cover; object-position: center 26%; border-radius: 10px; border: 1px solid rgba(201,166,60,0.26);">
            <span style="font-size: 18px; font-weight: 600; color: ${MUTED}; line-height: 1.12;">${nombre}</span>
            <span data-precio-tag style="font-family: ${DISPLAY}; font-size: 30px; line-height: 1; color: ${ORO};">1350 RP</span>
          </div>`).join('')}
        <div data-skin style="display: flex; flex-direction: column; justify-content: center; padding: 14px; border-radius: 10px; border: 1px dashed ${ORO}59;">
          <span style="font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">Ni una barata,<br>ni una cara</span>
          <span style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${ORO};">Las 7 igual</span>
        </div>
      </div>

      <div data-precio style="margin-top: 26px; display: flex; align-items: center; gap: 28px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 96px; line-height: 0.86; color: ${ORO};">~<span data-cuenta="73">73</span> <span style="font-size: 52px;">USD</span></div>
          <div style="font-size: 21px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las siete · 9 450 RP · 4,5 días de salario</div>
        </div>
        <div style="width: 2px; height: 76px; background: ${ORO}4D;"></div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Queda <strong style="color: ${BONE};">a media tabla</strong> de la serie.</div>
      </div>

      <div data-plano style="margin-top: 24px; display: flex; align-items: center; gap: 26px; padding: 24px 30px; border-radius: 18px; background: ${LOBO}1A; border: 1px solid ${LOBO}66;">
        <div style="flex: none; font-family: ${DISPLAY}; font-size: 72px; line-height: 0.92; color: ${LOBO};">11 años</div>
        <div style="width: 2px; height: 72px; background: ${LOBO}59;"></div>
        <div style="flex: 1; font-size: 26px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Sin una <strong style="color: ${BONE};">legendaria</strong> ni una <strong style="color: ${BONE};">ultimate</strong>. El único de la serie con el catálogo así de plano.</div>
      </div>
    </div>
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="10 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('Kindred_3.jpg', 'Kindred Flor Espiritual', 'center 20%')}
    ${glow(LOBO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Once años de los Cazadores Eternos')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${LOBO};">Kindred</span></h2>
      <div style="margin-top: 40px;">${parMascaras(96, 38)}</div>
      <div data-gigi style="margin-top: 46px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${CORDERO};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  function cuentaMil(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.05, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  // Las dos máscaras nunca entran a la vez: primero Cordero y después Lobo,
  // con un respiro en medio. Son dos, y ese es el motivo del deck.
  function mascaras(tl, s, pos) {
    var c = s.querySelector('[data-lado="cordero"]'), l = s.querySelector('[data-lado="lobo"]');
    if (c) tl.from(c, { x: -30, scale: 0.7, opacity: 0, duration: 0.55, ease: 'back.out(2)' }, pos || 0);
    if (l) tl.from(l, { x: 30, scale: 0.7, opacity: 0, duration: 0.55, ease: 'back.out(2)' }, (pos || 0) + 0.18);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.66);
    mascaras(tl, s, 0.98);
  });

  // «No es un campeón» primero en gris, la regla, y al final la sentencia.
  // El «y son dos» tiene que llegar después de «es la muerte», nunca a la vez.
  animar('Es la muerte', function (tl, s) {
    var f = q(s, '[data-frase]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(f[0], { y: 26, opacity: 0, duration: 0.55 }, 0.12)
      .from(s.querySelector('[data-igual]'), { scaleX: 0, opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 0.44)
      .from(f[1], { y: 34, opacity: 0, duration: 0.6 }, 0.62)
      .from(f[2], { y: 26, opacity: 0, duration: 0.5 }, 0.94);
    mascaras(tl, s, 1.06);
  });

  animar('El que estaba solo', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-paso]'), { x: 28, opacity: 0, duration: 0.44, stagger: 0.13 }, 0.34)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.02);
  });

  // La pieza del deck: el tajo baja, y en cuanto pasa las dos mitades se
  // separan. El corte tiene que ocurrir ANTES de la separación o no se lee
  // como un hachazo.
  animar('El hacha', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-corte]'), { scale: 0.9, opacity: 0, duration: 0.5 }, 0.36)
      .fromTo(s.querySelector('[data-tajo]'), { scaleY: 0, transformOrigin: '50% 0%', opacity: 1 },
              { scaleY: 1, duration: 0.34, ease: 'power3.in' }, 0.62)
      .to(s.querySelector('[data-tajo]'), { opacity: 0, duration: 0.4 }, 1.08)
      .from(s.querySelector('[data-mitad="izq"]'), { x: 26, duration: 0.55, ease: 'power2.out' }, 0.96)
      .from(s.querySelector('[data-mitad="der"]'), { x: -26, duration: 0.55, ease: 'power2.out' }, 0.96)
      .from(s.querySelector('[data-por]'), { y: 26, opacity: 0, duration: 0.55 }, 1.16)
      .from(s.querySelector('[data-sep]'), { y: 20, opacity: 0, duration: 0.5 }, 1.3);
  });

  // Las dos columnas entran desde sus lados, nunca juntas.
  animar('Cordero y Lobo', function (tl, s) {
    var c = q(s, '[data-mitad-col]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(c[0], { x: -36, opacity: 0, duration: 0.6 }, 0.16)
      .from(c[1], { x: 36, opacity: 0, duration: 0.6 }, 0.38)
      .from(q(s, '[data-mascara]'), { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.22, ease: 'back.out(2)' }, 0.3)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.06);
  });

  // Aquí sí se acercan: es la única lámina donde las dos máscaras se miran.
  animar('Cómo se acaba todo', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-frente="cordero"]'), { x: -70, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.36)
      .from(s.querySelector('[data-frente="lobo"]'), { x: 70, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.36)
      .from(s.querySelector('[data-vs]'), { scale: 0.7, opacity: 0, duration: 0.45 }, 0.78)
      .from(s.querySelector('[data-remate]'), { y: 28, opacity: 0, duration: 0.6 }, 1.02);
  });

  // La cifra sube contando y el historial de Hierro cae después, fila por
  // fila: primero se celebra el número y luego se desinfla.
  animar('El one trick', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 24, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.08)
      .from(s.querySelector('[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.28)
      .from(s.querySelector('[data-sin]'), { x: -30, opacity: 0, duration: 0.55 }, 0.86)
      .from(q(s, '[data-rango]'), { x: 26, opacity: 0, duration: 0.36, stagger: 0.08 }, 1.06)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.28);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.32, 1.0);
  });

  animar('Somos potencia', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-cabecera]'), { y: 24, opacity: 0, duration: 0.5 }, 0.34)
      .from(q(s, '[data-latino]'), { x: 26, opacity: 0, duration: 0.34, stagger: 0.07 }, 0.56)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.16);
  });

  // Las siete etiquetas de precio entran juntas y no en cascada: si se
  // escalonan parecen distintas, y el dato es que son idénticas.
  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 24, opacity: 0, scale: 0.94, duration: 0.44, stagger: 0.05 }, 0.26)
      .from(q(s, '[data-precio-tag]'), { y: 14, opacity: 0, duration: 0.42 }, 0.78)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.5 }, 0.98)
      .from(s.querySelector('[data-plano]'), { x: 30, opacity: 0, duration: 0.55 }, 1.2);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.98, 0.6);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.24);
    mascaras(tl, s, 0.7);
    tl.from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 1.08);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kindred cumple 11 años</title>
${kit.og({ titulo: "Kindred cumple 11 años", descripcion: "Once años de los Cazadores Eternos: el dios que se partió con un hacha para tener un amigo, y el one trick con diecisiete millones de puntos que nunca ha salido de Hierro. Apoyo visual para TikTok.", carpeta: "kindred" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(77,158,230,0.45); border-radius: 999px;
    background: rgba(7,9,12,0.85); color: ${LOBO}; cursor: pointer;
    font: 600 13px/1 ${BODY}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides.join('\n')}
</deck-stage>
<script src="./gsap.min.js"></script>
${kit.animador()}
${coreografias}
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

// kit.diferir: todo lo que no sea la portada sale con data-src/data-bg, para
// que al entrar el navegador solo descargue los assets de la primera lámina.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
