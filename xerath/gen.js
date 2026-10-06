// Generador de index.html — Xerath cumple 15 años (screenshots para TikTok)
// Ejecutar: node xerath/gen.js
//
// Serie «Cumplelolero» #23, animado. Mismo criterio que samira, sona, vex,
// khazix, nasus y swain: arte real, nada dibujado, una idea por lámina. Y un
// encargo nuevo, **más estricto**: **ninguna lámina sin imagen**. En swain hubo
// dos láminas de solo tipografía («sus padres», «para nada»); aquí hasta los
// golpes de texto («no recibió ninguna», «y lo mató de todos modos») van sobre
// arte, y el OTP lleva el emblema real sobre el splash desenfocado.
//
// **Es la continuación de nasus.** Allá el mago que Renekton arrastró a la Tumba
// de los Emperadores se quedó sin nombre a propósito, y aquí se cobra: por eso
// la lámina 3 reusa **el mismo arte de la tumba** que salió en nasus, y la
// biblioteca a la que lo mandaban de niño es **la misma carta del bibliotecario**.
// Los dos archivos están copiados de `nasus/assets/`.
//
// **El humano sale dos veces.** El boceto oficial de Xerath antes de ascender
// (*Xerath Human Render*, wiki) aparece a todo color cuando Azir le pone nombre
// y otra vez, apagado y en gris, en «la parte honrada de Xerath murió ese día».
// Es el recurso del cuervo de swain: la misma imagen, plantada y cobrada.
//
// De dónde sale cada imagen:
//  · Splashes de Xerath y su retrato de pantalla de carga — Data Dragon.
//  · **Legends of Runeterra, set4 y set5**: Xerath ascendido sobre un ejército
//    (`05SH014T2`), trabajadores cargando una litera en Shurima (`04SH012`),
//    Azir joven con el disco (`04SH003`), un mago invocando tormenta sobre la
//    ciudad (`05SH016`), el estrado del emperador (`04SH051`), Azir en la luz
//    del disco (`04SH003T2`), **Azir derribado del estrado** (`04SH003T3` — su
//    texto de carta dice textual que su amigo «and newly named brother» lo tiró),
//    el disco enterrado (`04SH062`), **Xerath encadenado en círculo** (`06SH033`)
//    y **Renekton** (`04SH067T4`), cuya carta dice que pasó años en la oscuridad
//    con el traidor llenándole la cabeza de odio contra su hermano.
//  · Emblema de Diamante de CommunityDragon a 500 px, recortado a su bbox.
//
// ⚠️ **El lore está verificado en la biografía oficial es-MX** en todo lo que el
// guion presenta como textual («La parte honrada de Xerath murió ese día»,
// «contempló a través de lágrimas…», «la coraza de rencor… demasiado tarde»,
// «retorció la mente de Renekton… rencor inmerecido hacia Nasus»).
//
// ⚠️ **El título oficial en es_MX es «el Mago Ascendente»**, no «Ascendido»
// como dice la investigación (lo confirman la biografía y Data Dragon).
//
// ⚠️ **Sin arte oficial** para el monumento al caballo del emperador ni para la
// bestia de fuego: el primero va dentro de la lámina del esclavo y la segunda
// se queda en la voz.
//
// ⚠️ **El cumpleaños es HOY** (5/10/2011). Sin dinero ni salarios, como desde
// nasus. El guion **no tiene bloque de skins**, así que no hay lámina de skins.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Xerath: arcano contra oro ─────────────────────────────────────
// El splash es azul eléctrico de punta a punta (hue 200–220). Es **la pareja de
// azir invertida**: allá manda el oro del disco y el lapislázuli es apoyo; aquí
// manda el arcano y el oro es de Azir y de Shurima — el pasado humano, el nombre
// que le dieron y la promesa. Donde está uno, el otro casi no aparece.
const BG = '#060A12';        // noche del desierto
const ARCANO = '#58B9FF';    // el vórtice — acento
const ORO = '#E2B45E';       // Azir, Shurima y lo que fue antes
const BONE = '#EDF1F6';      // texto principal
const MUTED = '#7D8796';     // texto secundario
const PANEL = '#0E1420';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = ARCANO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}26 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,10,18,0.12) 0%, rgba(6,10,18,0.36) 34%, rgba(6,10,18,0.92) 64%, rgba(6,10,18,0.99) 100%);"></div>
    </div>`;

// Carta apaisada entera sobre su copia borrosa (archivo aparte de 360 px).
const arte = (src, alt, alto = 456, color = ARCANO) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${color}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

// El Xerath humano. `apagado` es la versión de «la parte honrada murió».
const humano = (ancho, apagado = false) => `
      <div data-humano style="width: ${ancho}px; height: ${Math.round(ancho * 1014 / 802)}px; border-radius: 18px; overflow: hidden; border: 2px solid ${apagado ? MUTED + '66' : ORO + 'B3'}; box-shadow: 0 0 ${apagado ? 40 : 90}px ${apagado ? 'rgba(0,0,0,0.5)' : ORO + '40'};">
        <img src="assets/humano.jpg" alt="Xerath antes de ascender, boceto oficial" style="width: 100%; height: 100%; object-fit: cover; display: block; filter: ${apagado ? 'grayscale(1) brightness(0.42) contrast(1.1)' : 'grayscale(0) brightness(1) contrast(1)'};">
      </div>`;

const eyebrow = (txt, color = ARCANO) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(6,10,18,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(6,10,18,0.85);">${txt}</h2>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

const cita = (txt, color = ARCANO) => `
      <div data-cita style="margin-top: 30px; padding: 26px 30px; border-radius: 18px; background: ${color}14; border: 1px solid ${color}66;">
        <div style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${color};">Textual de su biografía</div>
        <div style="margin-top: 10px; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.3;">${txt}</div>
      </div>`;

const lore = ({ label, screen, notas, src, alt, ceja, frase, size = 100, apoyo = '', extra = '', alto = 456, color = ARCANO }) => `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${glow(color, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow(ceja, color)}
      ${arte(src, alt, alto, color)}
      <div data-texto style="margin-top: 36px;">
        ${titulo(frase, size)}
      </div>
      ${apoyo ? `<p data-remate style="margin: 26px 0 0; font-size: 33px; font-weight: 600; color: ${BONE}; line-height: 1.34;">${apoyo}</p>` : ''}
      ${extra}
    </div>
  </section>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy cumple quince anos Xerath." style="${seccion()}">
    ${portada('Xerath_0.jpg', 'Xerath, el Mago Ascendente, rompiendo su sarcófago', 'center 30%')}
    ${glow(ARCANO, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · hoy, 5 oct de 2011')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(6,10,18,0.88);"><span data-linea style="display: block;">XERATH</span><span data-linea style="display: block; color: ${ARCANO};">15 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${ORO}; line-height: 1.3;">El Mago Ascendente</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Shurima</p>
    </div>
  </section>`);

// ── 2 · El adecé del meta de magos ───────────────────────────────────────
slides.push(lore({
  label: 'El meta', screen: '02 · Intro · el meta de magos',
  notas: 'Y para los que no lo ubican, este es el que en el meta de magos fue el adece mas castroso que hubo, el que desde su rango te mataba sin que alcanzaras a verlo y que a veces de plano era inmatable. Y tiene la fama de ser el campeon favorito de los scripters, y esa fama no se la invento nadie.',
  src: 'rango.jpg', alt: 'Xerath ascendido lanzando rayos sobre un ejército, arte de Legends of Runeterra',
  ceja: 'El adecé del meta de magos',
  frase: 'Te mataba<br>' + c('sin que lo vieras', ARCANO), size: 116,
  apoyo: 'Y el favorito de los scripters',
}));

// ── 3 · Ese mago es este ─────────────────────────────────────────────────
// La tumba es la misma del video de Nasus: el callback entra por la imagen.
slides.push(`
  <section data-label="Ese mago" data-screen-label="03 · Callback · el mago del video de Nasus" data-speaker-notes="Pero su historia es otra cosa. Y si vieron el video de Nasus del jueves ya lo conocen sin saberlo, porque ahi les dije que Renekton arrastro a un mago hasta la Tumba de los Emperadores y que Nasus sello la puerta con su hermano adentro. Ese mago es este cabron." style="${seccion()}">
    ${glow(ARCANO, '50% 40%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('En el video de Nasus', ORO)}
      ${arte('tumba.jpg', 'La Tumba de los Emperadores, arte de Legends of Runeterra', 420, ORO)}
      <p data-remate style="margin: 26px 0 0; font-size: 31px; font-weight: 600; color: ${MUTED}; line-height: 1.36;">Renekton arrastró a un mago<br>hasta la Tumba de los Emperadores</p>
      <div data-revela style="margin-top: 40px; width: 100%; display: flex; align-items: center; gap: 40px;">
        <img data-carta src="assets/Xerath-carga.jpg" alt="Xerath, retrato de pantalla de carga" style="flex: none; width: 250px; height: 455px; object-fit: cover; border-radius: 16px; border: 2px solid ${ARCANO}B3; box-shadow: 0 0 80px ${ARCANO}4D; display: block;">
        <div data-texto style="text-align: left;">
          ${titulo('Ese mago<br>' + c('es este<br>cabrón', ARCANO), 132)}
        </div>
      </div>
    </div>
  </section>`);

// ── 4 · El esclavo sin nombre ────────────────────────────────────────────
// No hay arte del monumento al caballo: el dato va como fila bajo la carta.
const esclavo = [
  ['A su papá', 'lo dejaron tullido por un monumento al caballo del emperador'],
  ['A su mamá', 'no la volvió a ver nunca'],
];
slides.push(lore({
  label: 'El esclavo', screen: '04 · Lore · nació esclavo',
  notas: 'Xerath nacio esclavo y sin nombre, hijo de dos eruditos capturados. A su papa lo dejaron tullido excavando para un monumento al caballo favorito del emperador y lo abandonaron ahi mismo, asi que su mama le rogo a un arquitecto de tumbas que se lo llevara de aprendiz para que no acabara igual. No la volvio a ver nunca.',
  src: 'esclavo.jpg', alt: 'Trabajadores cargando una litera en Shurima, arte de Legends of Runeterra', alto: 420, color: ORO,
  ceja: 'Hijo de dos eruditos capturados',
  frase: 'Nació esclavo.<br>' + c('Y sin nombre.', ORO), size: 112,
  extra: `
      <div data-filas style="margin-top: 30px; width: 100%; display: flex; flex-direction: column; gap: 12px;">
        ${esclavo.map(([quien, que]) => `
        <div data-fila style="padding: 18px 26px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid ${ORO}40; text-align: left;">
          <div style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${ORO};">${quien}</div>
          <div style="margin-top: 6px; font-size: 29px; font-weight: 600; color: ${BONE}; line-height: 1.3;">${que}</div>
        </div>`).join('')}
      </div>`,
}));

// ── 5 · La biblioteca de Nasus ───────────────────────────────────────────
// La misma carta del bibliotecario que salió en nasus.
slides.push(lore({
  label: 'La biblioteca', screen: '05 · Lore · la biblioteca de Nasus',
  notas: 'De aprendiz lo mandaban a la gran biblioteca de Nasus, y ahi un dia se encontro a un chavo atorado con un texto que no entendia.',
  src: 'bibliotecario.jpg', alt: 'Nasus en la Gran Biblioteca, arte de Legends of Runeterra', color: ORO,
  ceja: 'De aprendiz, todos los días',
  frase: 'Lo mandaban<br>a la biblioteca<br>' + c('de Nasus', ORO), size: 112,
  apoyo: 'Y ahí un chavo no entendía un texto',
}));

// ── 6 · Azir ─────────────────────────────────────────────────────────────
slides.push(lore({
  label: 'Azir', screen: '06 · Lore · era Azir',
  notas: 'Era Azir, el hijo menos querido del emperador. Y aunque hablarle a la realeza se castigaba con la muerte, Xerath se paro a ayudarlo.',
  src: 'azir.jpg', alt: 'Azir joven con el disco solar, arte de Legends of Runeterra', color: ORO,
  ceja: 'El hijo menos querido del emperador',
  frase: 'Era ' + c('Azir', ORO), size: 150,
  apoyo: 'Hablarle a la realeza se pagaba con la muerte.<br>Se paró a ayudarlo.',
}));

// ── 7 · El nombre (se planta el humano) ──────────────────────────────────
slides.push(`
  <section data-label="El nombre" data-screen-label="07 · Lore · el que comparte" data-speaker-notes="Azir lo paso a su casa como sirviente, le dejo leer todo, y le puso nombre, porque a los esclavos les estaba prohibido tener uno. Lo llamo Xerath, que significa el que comparte. Luego le salvo la vida de un asesino. Los otros hijos del emperador no corrieron con la misma suerte, asi que Azir quedo heredero y le prometio que algun dia serian hermanos." style="${seccion()}">
    ${glow(ORO, '50% 36%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Los esclavos no tenían nombre', ORO)}
      ${humano(470)}
      <div data-texto style="margin-top: 34px;">
        <div style="font-size: 30px; font-weight: 600; color: ${MUTED};">Azir le puso uno</div>
        ${titulo('Xerath', 150)}
        <div style="margin-top: 4px; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; text-transform: uppercase; color: ${ORO};">«El que comparte»</div>
      </div>
      <p data-remate style="margin: 24px 0 0; font-size: 32px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Y le prometió que algún día<br>serían ${c('hermanos', ORO)}</p>
    </div>
  </section>`);

// ── 8 · La tormenta ──────────────────────────────────────────────────────
slides.push(lore({
  label: 'La tormenta', screen: '08 · Lore · para mantenerlo vivo',
  notas: 'Pero Xerath conocia esa corte. El emperador odiaba a Azir por haber sobrevivido en lugar de sus hijos favoritos, y si la reina tenia otro varon, Azir estaba muerto. Entonces Xerath uso magia para que los bebes de la reina murieran antes de nacer. Varios. Y cuando por fin nacio el principe, invoco una tormenta y los mato a rayos a el y a la reina, y al emperador lo incinero. Le echo la culpa a los magos de un pueblo conquistado. Y todo eso se lo justificaba diciendose que lo hacia para mantener vivo a su amigo.',
  src: 'tormenta.jpg', alt: 'Un mago invoca una tormenta sobre la ciudad, arte de Legends of Runeterra',
  ceja: 'Para que Azir siguiera vivo',
  frase: 'Los bebés de la reina,<br>' + c('antes de nacer', ARCANO), size: 104,
  apoyo: 'Al príncipe y a la reina, a rayos.<br>Al emperador, lo incineró.',
}));

// ── 9 · No recibió ninguna ───────────────────────────────────────────────
slides.push(lore({
  label: 'Ninguna', screen: '09 · Lore · coronaron a Azir',
  notas: 'Coronaron a Azir, y Xerath esperaba su libertad y el titulo de hermano que le prometieron. No recibio ninguna. Azir siguio esquivando el tema, y cuando Xerath insistio se enojo y le recordo que era un esclavo y que no se le olvidara de donde venia.',
  src: 'coronacion.jpg', alt: 'Azir sobre su estrado ante sus soldados, arte de Legends of Runeterra', color: ORO,
  ceja: 'Coronaron a Azir',
  frase: 'Esperaba su libertad<br>y ser su hermano', size: 96,
  extra: `
      <div data-golpe style="margin-top: 30px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.88; text-transform: uppercase; color: ${ARCANO};">No recibió<br>ninguna</div>
      <p data-remate style="margin: 18px 0 0; font-size: 30px; font-weight: 600; color: ${MUTED}; line-height: 1.34;">«Eres un esclavo. No olvides de dónde vienes.»</p>`,
}));

// ── 10 · La parte honrada (se cobra el humano) ───────────────────────────
// El mismo boceto de la lámina 7, ahora en gris.
slides.push(`
  <section data-label="La parte honrada" data-screen-label="10 · Lore · murió ese día" data-speaker-notes="El lore lo dice asi. La parte honrada de Xerath murio ese dia." style="${seccion()}">
    ${glow(ARCANO, '50% 40%', '110% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El lore lo dice así')}
      ${humano(470, true)}
      <div data-texto style="margin-top: 40px;">
        ${titulo('«La parte honrada<br>de Xerath<br>' + c('murió ese día»', ARCANO), 118)}
      </div>
    </div>
  </section>`);

// ── 11 · El disco ────────────────────────────────────────────────────────
const palabras = ['Eres un hombre libre', 'Todos los esclavos de Shurima, libres', 'Mi hermano eterno'];
slides.push(lore({
  label: 'El disco', screen: '11 · Lore · Azir se dio la vuelta',
  notas: 'De ahi todo lo que hizo fue para quedarse con el imperio. Le inflo el ego a Azir hasta convencerlo de hacer el ritual de Ascension, y solto a una bestia de fuego para distraer a Nasus y a Renekton. Llego el dia. Azir camino al disco solar con Xerath al lado. Y segundos antes del ritual, Azir se dio la vuelta. Y le dijo que era un hombre libre. Que todos los esclavos de Shurima quedaban libres. Lo abrazo y lo nombro su hermano eterno.',
  src: 'disco.jpg', alt: 'Azir en la luz del Disco Solar, arte de Legends of Runeterra', alto: 420, color: ORO,
  ceja: 'Segundos antes del ritual',
  frase: 'Azir se dio<br>' + c('la vuelta', ORO), size: 120,
  extra: `
      <div data-palabras style="margin-top: 28px; width: 100%; display: flex; flex-direction: column; gap: 12px;">
        ${palabras.map((p) => `
        <div data-palabra style="padding: 16px 24px; border-radius: 14px; background: ${ORO}14; border: 1px solid ${ORO}66;">
          <span style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${BONE};">«${p}»</span>
        </div>`).join('')}
      </div>`,
}));

// ── 12 · Y lo mató de todos modos ────────────────────────────────────────
slides.push(lore({
  label: 'Lo mató', screen: '12 · Lore · lo mató de todos modos',
  notas: 'Le acababan de dar todo lo que habia querido en su vida. Y lo mato de todos modos. El lore dice que esas palabras le atravesaron la coraza de rencor pero llegaron demasiado tarde. Con un rugido de ira y de dolor lo tiro del disco y vio llorando como su amigo se quemaba hasta volverse ceniza.',
  src: 'golpe.jpg', alt: 'Azir derribado del estrado, arte de Legends of Runeterra',
  ceja: 'Le dieron todo lo que quería',
  frase: 'Y lo mató<br>' + c('de todos modos', ARCANO), size: 132,
  extra: cita('«Contempló a través de lágrimas cómo su antiguo amigo <span style="color: ' + ARCANO + ';">ardía hasta convertirse en ceniza</span>»'),
}));

// ── 13 · Shurima cae ─────────────────────────────────────────────────────
slides.push(lore({
  label: 'Shurima', screen: '13 · Lore · Shurima se cayó',
  notas: 'Y el poder no era para el. Shurima entera se cayo, el desierto se trago la ciudad, y un imperio de generaciones desaparecio en un dia.',
  src: 'shurima.jpg', alt: 'El Disco Solar enterrado en el desierto, arte de Legends of Runeterra', color: ORO,
  ceja: 'Y el poder no era para él',
  frase: 'El desierto<br>' + c('se tragó Shurima', ORO), size: 112,
  apoyo: 'Un imperio de generaciones, en un día',
}));

// ── 14 · El sarcófago ────────────────────────────────────────────────────
slides.push(`
  <section data-label="El sarcófago" data-screen-label="14 · Remate · el sarcófago y la tumba" data-speaker-notes="Y ahora el remate para los que vieron el de Nasus. Lo metieron a un sarcofago y lo hizo pedazos, por eso trae los fragmentos y las cadenas colgando. Lo arrastraron a la Tumba de los Emperadores y Renekton se metio con el." style="${seccion()}">
    ${glow(ARCANO, '50% 36%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Para los que vieron el de Nasus')}
      <img data-circulo src="assets/sarcofago.jpg" alt="Xerath encadenado entre los fragmentos de su sarcófago, arte de Legends of Runeterra" style="width: 540px; height: 540px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid ${ARCANO}CC; box-shadow: 0 0 110px ${ARCANO}59;">
      <div data-texto style="margin-top: 38px;">
        ${titulo('Lo metieron a un sarcófago<br>' + c('y lo hizo pedazos', ARCANO), 100)}
      </div>
      <p data-remate style="margin: 26px 0 0; font-size: 32px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Por eso trae los fragmentos y las cadenas.<br>Y en la tumba, ${c('Renekton se metió con él', ORO)}.</p>
    </div>
  </section>`);

// ── 15 · No fue el tormento ──────────────────────────────────────────────
slides.push(lore({
  label: 'El tormento', screen: '15 · Remate · no fue el tormento',
  notas: 'Y ahi adentro, con los siglos, cuando la fuerza de Renekton se fue acabando, Xerath le retorcio la mente con mentiras y lo lleno de rencor contra Nasus. O sea que cuando les conte que Renekton salio convertido en una bestia que culpa a Nasus de todo, no fue el tormento. Fue este cabron hablandole al oido durante siglos.',
  src: 'renekton.jpg', alt: 'Renekton, arte de Legends of Runeterra',
  ceja: 'Siglos encerrados juntos',
  frase: 'No fue el tormento.<br>' + c('Fue Xerath al oído', ARCANO), size: 104,
  extra: cita('«Retorció la mente de Renekton y la llenó de un <span style="color: ' + ARCANO + ';">rencor inmerecido hacia Nasus</span>»'),
}));

// ── 16 · El OTP ──────────────────────────────────────────────────────────
// El nombre lleva kanji: Bebas no los trae, así que esa pastilla va en Noto
// Sans JP, pedida a Google Fonts solo con esos tres caracteres.
slides.push(`
  <section data-label="El OTP" data-screen-label="16 · El OTP" data-speaker-notes="Y el one trick pony con mas puntos del mundo es japones, trae nueve millones novecientos mil puntos y es Diamante cuatro con pico de Diamante dos." style="${seccion()}">
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/Xerath_0.jpg'); background-size: cover; background-position: center; filter: blur(40px) saturate(1) brightness(0.32); transform: scale(1.08);" role="img" aria-label="Xerath"></div>
    </div>
    ${glow(ARCANO, '50% 40%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El número uno del mundo')}
      <div data-nombre style="display: inline-flex; align-items: baseline; gap: 16px; padding: 14px 32px; border-radius: 999px; background: ${ARCANO}1A; border: 1px solid ${ARCANO}80;">
        <span style="font-family: 'Noto Sans JP', ${BODY}; font-size: 46px; font-weight: 700; line-height: 1.1; color: ${BONE};">赤富士peercast</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${ARCANO};">Japón</span>
      </div>
      <div data-cifra style="margin-top: 30px;">
        <div data-cuenta="9904026" style="font-family: ${DISPLAY}; font-size: 168px; line-height: 0.84; color: ${BONE};">9 904 026</div>
        <div style="margin-top: 6px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>
      <img data-emblema src="assets/emblems/diamond.png" alt="Diamante" style="margin-top: 40px; width: 440px; height: auto; display: block; filter: drop-shadow(0 0 60px rgba(88,185,255,0.35));">
      <div data-rango style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 140px; line-height: 0.88; color: ${ARCANO};">DIAMANTE 4</div>
      <div data-pico style="margin-top: 18px; display: inline-block; padding: 12px 28px; border-radius: 999px; border: 1px solid ${ORO}80; background: ${ORO}14; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${ORO};">Pico de la temporada · Diamante 2</div>
    </div>
  </section>`);

// ── 17 · Cierre ──────────────────────────────────────────────────────────
// Guardián de las Arenas: la única skin que junta el oro de Shurima con el
// arcano, que son los dos colores del deck.
slides.push(`
  <section data-label="Cierre" data-screen-label="17 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Xerath_4.jpg', 'Xerath Guardián de las Arenas', 'center 30%')}
    ${glow(ARCANO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Quince años del Mago Ascendente', ORO)}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${ARCANO};">Xerath</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${ORO};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };

  function cuentaMil(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.0, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  function entraArte(tl, s, pos) {
    var a = uno(s, '[data-arte]');
    if (!a) return;
    tl.from(a, { y: 26, opacity: 0, duration: 0.6 }, pos)
      .from(a.querySelector('img'), { scale: 1.07, duration: 1.1, ease: 'power2.out' }, pos);
  }

  animar('Portada', function (tl, s) {
    tl.from(uno(s, '[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(uno(s, '[data-a="up"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 52, opacity: 0, duration: 0.78, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.68);
  });

  function loreEntrada(tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(uno(s, '[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.8);
    if (uno(s, '[data-remate]')) tl.from(uno(s, '[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.18);
    if (uno(s, '[data-cita]')) tl.from(uno(s, '[data-cita]'), { y: 22, opacity: 0, duration: 0.5 }, 1.16);
  }
  ['El meta', 'La biblioteca', 'Azir', 'La tormenta', 'Lo mató', 'Shurima', 'El tormento'].forEach(function (l) { animar(l, loreEntrada); });

  // Primero la tumba de nasus, y luego se revela quién era el mago.
  animar('Ese mago', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.1);
    tl.from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.5 }, 0.5)
      .from(uno(s, '[data-carta]'), { x: -50, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.0)
      .from(uno(s, '[data-texto]'), { x: 40, opacity: 0, duration: 0.55 }, 1.16);
  });

  animar('El esclavo', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(uno(s, '[data-texto]'), { y: 30, opacity: 0, duration: 0.55 }, 0.7)
      .from(q(s, '[data-fila]'), { x: -34, opacity: 0, duration: 0.45, stagger: 0.2 }, 1.06);
  });

  // El humano a todo color: entra despacio, con el oro.
  animar('El nombre', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-humano]'), { scale: 0.9, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-texto]'), { y: 28, opacity: 0, duration: 0.55 }, 0.74)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.5 }, 1.16);
  });

  animar('Ninguna', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.1);
    tl.from(uno(s, '[data-texto]'), { y: 26, opacity: 0, duration: 0.5 }, 0.6)
      .from(uno(s, '[data-golpe]'), { scale: 0.84, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.0)
      .from(uno(s, '[data-remate]'), { opacity: 0, duration: 0.4 }, 1.4);
  });

  // El mismo boceto de la lámina 7: llega con su color y se apaga.
  animar('La parte honrada', function (tl, s) {
    var img = uno(s, '[data-humano] img');
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-humano]'), { opacity: 0, duration: 0.5 }, 0.05)
      .from(img, { filter: 'grayscale(0) brightness(1) contrast(1)', duration: 1.2, ease: 'power1.inOut' }, 0.3)
      .from(uno(s, '[data-texto]'), { y: 28, opacity: 0, duration: 0.6 }, 0.9);
  });

  animar('El disco', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.1);
    tl.from(uno(s, '[data-texto]'), { y: 26, opacity: 0, duration: 0.5 }, 0.6)
      .from(q(s, '[data-palabra]'), { y: 20, opacity: 0, duration: 0.42, stagger: 0.2 }, 0.96);
  });

  // El círculo encadenado llega girando un poco, como si se rompiera.
  animar('El sarcófago', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-circulo]'), { scale: 0.82, rotation: -8, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
      .from(uno(s, '[data-texto]'), { y: 26, opacity: 0, duration: 0.55 }, 0.74)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.5 }, 1.14);
  });

  animar('El OTP', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-nombre]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.1)
      .from(uno(s, '[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.3)
      .from(uno(s, '[data-emblema]'), { y: 30, scale: 0.86, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.9)
      .from(uno(s, '[data-rango]'), { y: 24, opacity: 0, duration: 0.45 }, 1.14)
      .from(uno(s, '[data-pico]'), { y: 18, opacity: 0, duration: 0.4 }, 1.36);
    cuentaMil(tl, uno(s, '[data-cifra] [data-cuenta]'), 0.32, 0.8);
  });

  animar('Cierre', function (tl, s) {
    tl.from(uno(s, '[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(uno(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(uno(s, 'h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.86);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xerath cumple 15 años</title>
${kit.og({ titulo: "Xerath cumple 15 años", descripcion: "Azir lo liberó, liberó a todos los esclavos de Shurima y lo nombró su hermano eterno. Y Xerath lo mató de todos modos. Apoyo visual para TikTok.", carpeta: "xerath" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=%E8%B5%A4%E5%AF%8C%E5%A3%ABpeercast&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(88,185,255,0.45); border-radius: 999px;
    background: rgba(6,10,18,0.85); color: ${ARCANO}; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
