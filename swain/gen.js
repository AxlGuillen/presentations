// Generador de index.html — Swain cumple 16 años (screenshots para TikTok)
// Ejecutar: node swain/gen.js
//
// Serie «Cumplelolero» #22, animado. Mismo criterio que samira, sona, vex,
// khazix y nasus: **arte real, nada dibujado, una idea por lámina**.
//
// **Lore primero, pedido expreso de Axl** (el orden de vex, no el invertido de
// katarina en adelante): intro, el lore completo, y al final OTP y skins.
//
// **El cuervo es el hilo del episodio.** La intro lo planta —en Arcane salió su
// cuervo con tres ojos demoníacos— y el lore lo cobra: es un cuervo el que se
// le acerca cuando está agonizando y le enseña la verdad. Por eso la misma
// imagen sale dos veces: en la lámina 2 apagada y sin explicar, y en la 5 a
// todo color con las tres visiones.
//
// De dónde sale cada imagen:
//  · Splashes de Swain — Data Dragon.
//  · **Legends of Runeterra**: **Bandada voraz** (`02NX009`, set2) es **el
//    cuervo de Swain con tres ojos morados**, el mismo diseño del cameo de
//    Arcane, y ya viene recortada en círculo a 1024 px. **LeBlanc** (`04NX004`)
//    en una mesa de conspiradores para la camarilla, **Swain** (`02NX007`) con
//    sus cuervos para la Trifarix y **Swain nivel 2** (`02NX007T2`), alado sobre
//    una multitud, para «tomó Noxus en una sola noche».
//  · `bastion.jpg` es el *Origins of Noxus 05* de la wiki, el mismo que usa
//    guerras para el Bastión Inmortal.
//  · Emblemas de CommunityDragon a 500 px, recortados a su bbox.
//
// ⚠️ **El cuervo de Arcane no está aquí**: no hay fotograma oficial publicado
// en la wiki y el clip es material del propio video. La carta de LoR es el
// mismo personaje con el mismo diseño, y es lo que va en pantalla.
//
// ⚠️ **El lore está verificado en la biografía oficial es-MX**, palabra por
// palabra en los puntos que el guion presenta como textuales.
//   - La cita del Bastión dice **«una manera de esgrimirla»**, no «de usarla»
//     como la lee el guion. En pantalla va la textual, porque la voz la anuncia
//     como «la línea textual del lore».
//
// ⚠️ **Nombres de skins: el guion usa los de España, no los de México.** En
// es_MX: Northern Front es **«Frente Nórdico»**, Dragon Master es **«Amo de los
// Dragones»**, Winterblessed es **«Favor del Invierno»** y **Fried Chicken King
// es «Swain Crujipollo»** — «Rey del Pollo Frito» es el nombre de es_ES. Las que
// el guion no nombra van con su nombre es_MX; la del remate va con el del guion
// porque la voz lo dice, como en vex.
//
// ⚠️ **Va adelantado un día**: cumple el 5 y el video sale el 4, así que la
// portada dice «mañana».
//
// ⚠️ Sin dinero ni salarios mínimos, como desde nasus.
//
// ⚠️ Fuera porque el guion no los narra: lo que aprendió en el ejército, que
// retiró los batallones de las campañas de Darkwill, el cierre de la biografía,
// el Malzahar de 2,2 millones del OTP, la ventaja de 1,45×, los nombres raros
// del top 20 y los callbacks a briar y guerras.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Swain: plumas, ojos y sangre ──────────────────────────────────
// El splash es rojo y negro de punta a punta (hue 0) y lo único que no es eso
// son los ojos del cuervo, violeta encendido. Ese violeta es el acento —es el
// hilo del episodio— y el carmesí va de apoyo, reservado a la Rosa Negra, la
// sangre y la traición. El violeta roza el suero de mundo `#C455E0`, pero allá
// va con cian de laboratorio y aquí con carmesí noxiano sobre negro de plumas.
const BG = '#0A0709';        // negro de plumas
const CUERVO = '#C85BF5';    // los tres ojos — acento
const CARMESI = '#D23A3F';   // Noxus, la Rosa Negra y la sangre
const BONE = '#EFEBEC';      // texto principal
const MUTED = '#857C80';     // texto secundario
const PANEL = '#161014';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = CARMESI, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}26 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,7,9,0.14) 0%, rgba(10,7,9,0.38) 34%, rgba(10,7,9,0.92) 64%, rgba(10,7,9,0.99) 100%);"></div>
    </div>`;

// Carta apaisada entera sobre su copia borrosa (archivo aparte de 360 px).
const arte = (src, alt, alto = 456) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${CARMESI}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

// El cuervo de tres ojos, en círculo. `apagado` es la versión de la intro.
const cuervo = (tam, apagado = false) => `
      <img data-cuervo src="assets/cuervo.jpg" alt="El cuervo de Swain, con tres ojos, arte de Legends of Runeterra" style="width: ${tam}px; height: ${tam}px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid ${CUERVO}${apagado ? '66' : 'CC'}; box-shadow: 0 0 ${apagado ? 60 : 110}px ${CUERVO}${apagado ? '33' : '59'}; filter: ${apagado ? 'saturate(0.35) brightness(0.55)' : 'saturate(1) brightness(1)'};">`;

const eyebrow = (txt, color = CARMESI) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(10,7,9,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(10,7,9,0.85);">${txt}</h2>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

const lore = ({ label, screen, notas, src, alt, ceja, frase, size = 100, apoyo = '', extra = '', alto = 456 }) => `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${glow(CARMESI, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow(ceja)}
      ${arte(src, alt, alto)}
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
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy voy a adelantar el video de cumpleanos de Swain porque manana son tres cumpleanos y quiero darle su espacio a cada uno." style="${seccion()}">
    ${portada('Swain_0.jpg', 'Swain, el Gran General Noxiano', 'center 18%')}
    ${glow(CARMESI, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · mañana, 5 oct de 2010')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(10,7,9,0.88);"><span data-linea style="display: block;">SWAIN</span><span data-linea style="display: block; color: ${CARMESI};">16 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${CUERVO}; line-height: 1.3;">El Gran General Noxiano</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Jericho Swain · Noxus</p>
    </div>
  </section>`);

// ── 2 · El cuervo de Arcane (se planta) ──────────────────────────────────
// Apagado a propósito: la intro lo planta sin explicarlo.
slides.push(`
  <section data-label="El cuervo" data-screen-label="02 · Intro · el cuervo de Arcane" data-speaker-notes="Ya salio en Arcane. Aunque no salio el, salio su cuervo. En el ultimo episodio aparece un cuervo que abre los ojos y trae tres ojos demoniacos en la cabeza. Y al final del video van a entender por que ese detalle es lo mas importante que pudieron haber metido." style="${seccion()}">
    ${glow(CUERVO, '50% 38%', '110% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('En Arcane no salió él', CUERVO)}
      ${cuervo(560, true)}
      <div data-texto style="margin-top: 44px;">
        ${titulo('Salió su cuervo<br>' + c('con tres ojos', CUERVO), 112)}
      </div>
      <p data-remate style="margin: 26px 0 0; font-size: 31px; font-weight: 500; color: ${MUTED}; line-height: 1.36;">Al final van a entender por qué importa</p>
    </div>
  </section>`);

// ── 3 · La camarilla ─────────────────────────────────────────────────────
slides.push(lore({
  label: 'La camarilla', screen: '03 · Lore · la rosa negra',
  notas: 'Jericho Swain nacio aristocrata y tenia la vida resuelta. Pero las casas nobles de Noxus empezaron a conspirar contra el emperador Boram Darkwill en una camarilla secreta que se juntaba bajo el simbolo de una rosa negra.',
  src: 'camarilla.jpg', alt: 'LeBlanc en una mesa de conspiradores, arte de Legends of Runeterra',
  ceja: 'Nació aristócrata',
  frase: 'Conspiraban bajo<br>' + c('una rosa negra', CARMESI), size: 112,
  apoyo: 'Contra el emperador Boram Darkwill',
}));

// ── 4 · Sus padres ───────────────────────────────────────────────────────
// Solo tipografía: el dato es la frase, y la cita textual va debajo.
slides.push(`
  <section data-label="Sus padres" data-screen-label="04 · Lore · ejecutó a sus padres" data-speaker-notes="Y Swain los descubrio. Y ejecuto el mismo a los conspiradores mas importantes. Entre ellos estaban sus propios padres. Y el lore lo dice sin adornos. Lo hizo porque valoraba a Noxus mas que al linaje o a la familia." style="${seccion()}">
    ${glow(CARMESI, '50% 45%', '100% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div data-golpe style="font-family: ${DISPLAY}; font-size: 112px; line-height: 0.9; text-transform: uppercase; color: ${MUTED};">Ejecutó él mismo<br>a los conspiradores</div>
      <div data-golpe style="margin-top: 40px; font-family: ${DISPLAY}; font-size: 168px; line-height: 0.86; text-transform: uppercase; color: ${BONE};">Entre ellos,<br>${c('sus padres', CARMESI)}</div>
      <div data-golpe style="margin-top: 56px; max-width: 820px;">
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${CARMESI};">Su biografía, sin adornos</div>
        <div style="margin-top: 10px; font-size: 36px; font-weight: 600; color: ${BONE}; line-height: 1.3;">«Valoraba a Noxus más que<br>al linaje o la familia»</div>
      </div>
    </div>
  </section>`);

// ── 5 · El cuervo (se cobra) ─────────────────────────────────────────────
// La misma imagen de la intro, ahora a todo color, con las tres visiones.
const visiones = ['Una rosa negra', 'Una mujer pálida', 'Su emperador, marioneta'];
slides.push(`
  <section data-label="Las visiones" data-screen-label="05 · Lore · agonizando, el cuervo" data-speaker-notes="Con el ejercito reducido Swain perdio en la Batalla del Placidium. Le destrozaron la rodilla y le perforaron el brazo izquierdo con espadas jonias. Y ahi viene lo bueno. Agonizando se le acerco un cuervo. Lo miro a los ojos y vio una rosa negra, vio a una mujer palida, y vio a su emperador convertido en marioneta." style="${seccion()}">
    ${glow(CUERVO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Agonizando, en el Placidium', CUERVO)}
      ${cuervo(470)}
      <div data-texto style="margin-top: 34px;">
        ${titulo('Lo miró a los ojos<br>' + c('y vio', CUERVO), 100)}
      </div>
      <div data-visiones style="margin-top: 28px; width: 100%; display: flex; flex-direction: column; gap: 12px;">
        ${visiones.map((v, i) => `
        <div data-vision style="display: flex; align-items: center; gap: 18px; padding: 16px 24px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid ${CUERVO}59; text-align: left;">
          <span style="flex: none; width: 18px; height: 18px; border-radius: 50%; background: ${CUERVO}; box-shadow: 0 0 18px ${CUERVO};"></span>
          <span style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${BONE};">${v}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 6 · Para nada ────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Para nada" data-screen-label="06 · Lore · mató a sus padres para nada" data-speaker-notes="O sea que no habia derrotado a la camarilla. Ellos lo habian traicionado y lo habian mandado a morir. Y al emperador que no pudieron derrocar lo habian seducido. Mato a sus padres para nada." style="${seccion()}">
    ${glow(CARMESI, '50% 50%', '100% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div data-golpe style="font-size: 34px; font-weight: 600; color: ${MUTED}; line-height: 1.4;">No había vencido a la camarilla.<br>Lo habían mandado a morir.</div>
      <div data-golpe style="margin-top: 60px; font-family: ${DISPLAY}; font-size: 200px; line-height: 0.84; text-transform: uppercase; color: ${BONE};">Mató a<br>sus padres<br>${c('para nada', CARMESI)}</div>
    </div>
  </section>`);

// ── 7 · El Bastión ───────────────────────────────────────────────────────
// La cita textual de la biografía: «esgrimirla», no «usarla» (ver cabecera).
slides.push(lore({
  label: 'El Bastión', screen: '07 · Lore · el Bastión Inmortal',
  notas: 'Lo corrieron del ejercito por fracasado y lo trataron como un invalido. Entonces Swain se metio al Bastion Inmortal a buscar lo que habia ahi adentro. Una cosa antigua que se alimenta de los moribundos y se come sus secretos. Y aqui esta la linea textual del lore. Swain miro fijamente esa oscuridad y descubrio algo que incluso ella desconocia. Una manera de usarla.',
  src: 'bastion.jpg', alt: 'El Bastión Inmortal, arte oficial', alto: 513,
  ceja: 'Lo corrieron por inválido',
  frase: 'Fue a buscar<br>' + c('lo que había adentro', CARMESI), size: 96,
  extra: `
      <div data-cita style="margin-top: 30px; padding: 26px 30px; border-radius: 18px; background: ${CUERVO}14; border: 1px solid ${CUERVO}66;">
        <div style="font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${CUERVO};">Textual de su biografía</div>
        <div style="margin-top: 10px; font-size: 35px; font-weight: 600; color: ${BONE}; line-height: 1.3;">«Descubrió algo que incluso ella desconocía: <span style="color: ${CUERVO};">una manera de esgrimirla</span>»</div>
      </div>`,
}));

// ── 8 · Una sola noche ───────────────────────────────────────────────────
slides.push(lore({
  label: 'Una noche', screen: '08 · Lore · tomó Noxus en una noche',
  notas: 'Anos de preparacion, y tomo Noxus en una sola noche. Reconstruido por el demonio, mato a Darkwill enfrente de todos sus seguidores y dejo el trono destrozado y vacio.',
  src: 'una-noche.jpg', alt: 'Swain alado sobre una multitud, arte de Legends of Runeterra',
  ceja: 'Años de preparación',
  frase: 'Tomó Noxus<br>' + c('en una sola noche', CARMESI), size: 120,
  apoyo: 'Y mató a Darkwill enfrente de todos sus seguidores',
}));

// ── 9 · La Trifarix ──────────────────────────────────────────────────────
slides.push(lore({
  label: 'La Trifarix', screen: '09 · Lore · la Trifarix',
  notas: 'Y luego hizo algo que no hace ningun villano. Armo la Trifarix para que nadie pudiera gobernar sin oposicion. Incluido el. Y a la Rosa Negra la dejo adentro. Acepta a cualquiera que jure lealtad al imperio, aunque sepa que esos cabrones siguen conspirando contra el.',
  src: 'swain-cuervos.jpg', alt: 'Swain y sus cuervos, arte de Legends of Runeterra',
  ceja: 'Lo que no hace ningún villano',
  frase: 'Nadie gobierna<br>sin oposición.<br>' + c('Incluido él.', CUERVO), size: 100,
  apoyo: 'Armó la Trifarix. Y a la Rosa Negra la dejó adentro.',
}));

// ── 10 · El OTP ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="El OTP" data-screen-label="10 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos del mundo, y este es coreano. Se llama SWAINIAWS, trae dieciseis millones setecientos mil puntos y nivel de maestria mil trescientos treinta y cuatro. Jugo dos mil cuarenta y siete partidas esta temporada, mil novecientas cincuenta y una con Swain. Son cinco partidas y media al dia todos los dias del ano." style="${seccion()}">
    ${glow(CUERVO, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El número uno del mundo', CUERVO)}
      <div data-nombre style="display: inline-flex; align-items: baseline; gap: 16px; padding: 14px 32px; border-radius: 999px; background: ${CUERVO}1A; border: 1px solid ${CUERVO}80;">
        <span style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; color: ${BONE};">SWAINIAWS</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${CUERVO};">Corea</span>
      </div>
      <div data-cifra style="margin-top: 30px;">
        <div data-cuenta="16788987" style="font-family: ${DISPLAY}; font-size: 156px; line-height: 0.84; color: ${BONE};">16 788 987</div>
        <div style="margin-top: 6px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos · maestría nivel 1 334</div>
      </div>
      <div data-partidas style="margin-top: 44px; width: 100%; padding: 30px 28px; box-sizing: border-box; border-radius: 20px; background: ${CARMESI}14; border: 2px solid ${CARMESI}80;">
        <div style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.86; color: ${CARMESI};">2 047</div>
        <div style="font-size: 25px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BONE};">partidas esta temporada · 1 951 con Swain</div>
        <div style="margin-top: 18px; font-family: ${DISPLAY}; font-size: 66px; line-height: 1; color: ${BONE};">5,5 al día, ${c('todos los días del año', CARMESI)}</div>
      </div>
    </div>
  </section>`);

// ── 11 · Este sí sube ────────────────────────────────────────────────────
// Los cinco Oros en el orden en que los lee la voz, y el Platino al final.
const oros = ['Oro 2', 'Oro 1', 'Oro 4', 'Oro 3', 'Oro 1'];
slides.push(`
  <section data-label="Historial" data-screen-label="11 · Historial · este sí sube" data-speaker-notes="Y es Platino uno con cincuenta por ciento. Pero wachen el historial. Oro dos, Oro uno, Oro cuatro, Oro tres, Oro uno. Cinco temporadas seguidas atorado en Oro y este ano por fin subio a Platino. Es el primer otepe de esta serie que va para arriba en vez de para abajo." style="${seccion()}">
    ${glow(CUERVO, '50% 46%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Wachen el historial')}
      <div data-fila style="width: 100%; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
        ${oros.map((o) => `
        <div data-temporada style="padding: 16px 6px 12px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.08);">
          <img src="assets/emblems/gold.png" alt="${o}" style="width: 100%; max-width: 140px; height: auto; display: block; margin: 0 auto; filter: grayscale(0.55) brightness(0.9);">
          <div style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 38px; line-height: 1; color: ${MUTED};">${o}</div>
        </div>`).join('')}
      </div>
      <div data-cinco style="margin-top: 14px; font-size: 22px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${MUTED};">Cinco temporadas atorado en Oro</div>
      <div data-flecha style="margin-top: 18px; font-family: ${DISPLAY}; font-size: 96px; line-height: 1; color: ${CUERVO};">↑</div>
      <div data-hoy style="margin-top: 8px; width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 26px 30px; border-radius: 18px; background: ${CUERVO}14; border: 2px solid ${CUERVO}99;">
        <img src="assets/emblems/platinum.png" alt="Platino" style="width: 250px; height: auto; display: block; flex: none; filter: drop-shadow(0 0 40px rgba(200,91,245,0.3));">
        <div style="text-align: left;">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${CUERVO};">Este año</div>
          <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.92; color: ${BONE};">Platino 1</div>
          <div style="margin-top: 4px; font-size: 25px; font-weight: 600; color: ${CUERVO};">por fin subió · 50 %</div>
        </div>
      </div>
      <p data-remate style="margin: 32px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.32;">El primer otepé de la serie<br>${c('que va para arriba', CUERVO)}</p>
    </div>
  </section>`);

// ── 12 · Las skins ───────────────────────────────────────────────────────
// Nombres es_MX en las que el guion no nombra. La del remate tiene lámina
// propia y no sale aquí.
const comprables = [
  ['Swain_1.jpg', 'Frente Nórdico', true],
  ['Swain_2.jpg', 'Aguasturbias', true],
  ['Swain_3.jpg', 'Tirano'],
  ['Swain_4.jpg', 'Amo de los Dragones'],
  ['Swain_12.jpg', 'Rosa de Cristal'],
  ['Swain_21.jpg', 'Favor del Invierno'],
  ['Swain_32.jpg', 'Elegido del Lobo'],
];
slides.push(`
  <section data-label="Las skins" data-screen-label="12 · Las skins" data-speaker-notes="Y de skins tiene once, ocho comprables, y dos de esas salieron el mismo dia que el." style="${seccion()}">
    ${glow(CARMESI, '50% 28%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Once skins')}
      ${titulo('Ocho ' + c('a la venta', CARMESI), 100)}
      <div data-rejilla style="margin-top: 26px; width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${comprables.map(([img, nombre, conEl]) => `
        <div data-skin style="position: relative; border-radius: 14px; overflow: hidden; border: ${conEl ? '2px solid ' + CUERVO : '1px solid ' + CARMESI + '40'};">
          <img src="assets/${img}" alt="Swain ${nombre}" style="width: 100%; height: 178px; object-fit: cover; object-position: center 24%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,7,9,0) 40%, rgba(10,7,9,0.93) 100%);"></div>
          <div style="position: absolute; left: 14px; right: 14px; bottom: 9px; text-align: left;">
            <div style="font-size: 21px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            ${conEl ? `<div style="font-size: 17px; font-weight: 700; color: ${CUERVO};">salió con él · 2010</div>` : ''}
          </div>
        </div>`).join('')}
        <div data-skin style="display: flex; align-items: center; justify-content: center; border-radius: 14px; border: 1px dashed ${CARMESI}80; background: ${CARMESI}0F;">
          <span style="font-family: ${DISPLAY}; font-size: 54px; line-height: 0.95; color: ${CARMESI};">+ la más<br>nueva</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 13 · Rey del Pollo Frito ─────────────────────────────────────────────
// El remate. Con el nombre que dice la voz (en es_MX es «Crujipollo»).
slides.push(`
  <section data-label="Pollo" data-screen-label="13 · La más nueva" data-speaker-notes="Pero la mas nueva es la mejor. El Gran General de Noxus, el que ejecuto a sus propios padres y derroco a un emperador, tiene una skin que se llama Rey del Pollo Frito." style="${seccion()}">
    ${glow(CARMESI, '50% 40%', '118% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div data-quien style="font-size: 32px; font-weight: 600; color: ${MUTED}; line-height: 1.38;">El que ejecutó a sus padres<br>y derrocó a un emperador</div>
      <div data-pieza style="margin-top: 34px; position: relative; width: 100%; border-radius: 20px; overflow: hidden; border: 2px solid ${CARMESI}B3;">
        <img src="assets/Swain_42.jpg" alt="Swain Rey del Pollo Frito" style="width: 100%; height: 560px; object-fit: cover; object-position: 72% 18%; display: block;">
      </div>
      <div data-nombre style="margin-top: 34px;">
        <div style="font-size: 26px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Tiene una skin que se llama</div>
        <div style="margin-top: 10px; font-family: ${DISPLAY}; font-size: 148px; line-height: 0.86; color: ${BONE};">REY DEL<br>${c('POLLO FRITO', CARMESI)}</div>
      </div>
    </div>
  </section>`);

// ── 14 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="14 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Swain_32.jpg', 'Swain Elegido del Lobo', 'center 22%')}
    ${glow(CARMESI, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Dieciséis años del Gran General')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${CARMESI};">Swain</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${CUERVO};">GIGI EASY</div>
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

  // El cuervo sale de la oscuridad, despacio.
  animar('El cuervo', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-cuervo]'), { scale: 0.86, opacity: 0, duration: 1.0, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-texto]'), { y: 28, opacity: 0, duration: 0.55 }, 0.8)
      .from(uno(s, '[data-remate]'), { opacity: 0, duration: 0.5 }, 1.2);
  });

  function loreEntrada(tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(uno(s, '[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.8);
    if (uno(s, '[data-remate]')) tl.from(uno(s, '[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.18);
    if (uno(s, '[data-cita]')) tl.from(uno(s, '[data-cita]'), { y: 22, opacity: 0, duration: 0.5 }, 1.16);
  }
  ['La camarilla', 'El Bastión', 'Una noche', 'La Trifarix'].forEach(function (l) { animar(l, loreEntrada); });

  // Golpes de texto, uno por frase.
  animar('Sus padres', function (tl, s) {
    tl.from(q(s, '[data-golpe]'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.42, ease: 'power3.out' }, 0.1);
  });
  animar('Para nada', function (tl, s) {
    tl.from(q(s, '[data-golpe]')[0], { y: 24, opacity: 0, duration: 0.55 }, 0.1)
      .from(q(s, '[data-golpe]')[1], { scale: 0.86, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.8);
  });

  // El mismo cuervo, ahora encendido: primero él, luego cada visión.
  animar('Las visiones', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-cuervo]'), { scale: 0.8, opacity: 0, filter: 'saturate(0.35) brightness(0.55)', duration: 0.8, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-texto]'), { y: 26, opacity: 0, duration: 0.5 }, 0.66)
      .from(q(s, '[data-vision]'), { x: -34, opacity: 0, duration: 0.42, stagger: 0.18 }, 0.98);
  });

  animar('El OTP', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-nombre]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.1)
      .from(uno(s, '[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.34)
      .from(uno(s, '[data-partidas]'), { y: 30, opacity: 0, duration: 0.55 }, 1.0);
    cuentaMil(tl, uno(s, '[data-cifra] [data-cuenta]'), 0.36, 0.8);
  });

  // Los cinco Oros caen iguales; luego sube la flecha y llega el Platino.
  animar('Historial', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-temporada]'), { y: 24, opacity: 0, duration: 0.38, stagger: 0.09 }, 0.1)
      .from(uno(s, '[data-cinco]'), { opacity: 0, duration: 0.4 }, 0.6)
      .from(uno(s, '[data-flecha]'), { y: 40, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 0.82)
      .from(uno(s, '[data-hoy]'), { y: 30, scale: 0.94, opacity: 0, duration: 0.5, ease: 'back.out(1.6)' }, 1.0)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.42 }, 1.36);
  });

  animar('Las skins', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-a="up2"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-skin]'), { y: 22, scale: 0.95, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.3);
  });

  // Primero quién es, luego la skin, y el nombre al final con golpe.
  animar('Pollo', function (tl, s) {
    tl.from(uno(s, '[data-quien]'), { y: 22, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-pieza]'), { y: 30, opacity: 0, duration: 0.6 }, 0.36)
      .from(uno(s, '[data-pieza] img'), { scale: 1.08, duration: 1.0, ease: 'power2.out' }, 0.36)
      .from(uno(s, '[data-nombre]'), { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 1.0);
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
<title>Swain cumple 16 años</title>
${kit.og({ titulo: "Swain cumple 16 años", descripcion: "Ejecutó a sus padres para salvar a Noxus y la camarilla lo traicionó igual: los mató para nada. Un cuervo le enseñó la verdad. Apoyo visual para TikTok.", carpeta: "swain" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(200,91,245,0.45); border-radius: 999px;
    background: rgba(10,7,9,0.85); color: ${CUERVO}; cursor: pointer;
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
