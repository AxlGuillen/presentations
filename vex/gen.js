// Generador de index.html — Vex cumple 5 años (screenshots para TikTok)
// Ejecutar: node vex/gen.js
//
// Serie «Cumplelolero» #19, animado. Criterio de samira y sona: **pocas
// láminas, muy visuales, recursos reales y nada dibujado con iconos**. Sin
// motivo gráfico propio; lo que estructura es arte oficial.
//
// **Primer episodio de la serie contado como comedia** (los tres anteriores
// fueron tragedias), y el deck lo sigue: el lore y las skins cuentan el mismo
// chiste —el mundo insiste en tratarla bien y a ella le choca—, así que la
// lámina de las skins remata lo que abrió el lore.
//
// De dónde sale cada imagen:
//  · Splashes de Vex — Data Dragon.
//  · **Cartas de Legends of Runeterra** (set9, la expansión de Vex, y set4):
//    - `sombra` = **Shadow** (`09BC018`): su sombra, enorme, encima de una
//      fiesta, y Vex chiquita abajo. Es la lámina de «su mejor amiga era su
//      sombra».
//    - `niebla` = **Vex** (`09BC001`): sentada en el bosque oscuro con la
//      sombra al lado. Para las Islas de la Sombra.
//    - `viego` = **Viego** (`04SI055T2`), nivel 2.
//    - `familia` = **The Family Reunion** (`09BC012`): Vex de brazos cruzados
//      entre dos figuras que la abrazan, una con collar de perlas y otra con
//      bombín. ⚠️ **La carta no dice que sean sus papás** —el texto habla de
//      cenas familiares en las Islas de la Sombra—, así que la lámina no los
//      nombra: se usa como la imagen de «la abrazan y lo odia», que es el remate.
//    - `fiesta` = **Vex** nivel 3 (`09BC001T3`): enfurruñada en medio de una
//      explosión de pastel y confeti. Va de fondo en el cierre: es su
//      cumpleaños, y el texto de su carta dice que odia las fiestas, «sobre
//      todo cuando hay pastel».
//  · Emblema de Challenger de CommunityDragon a 500 px, recortado a su bbox.
//
// Todas las cartas van enteras sobre una copia borrosa con archivo propio de
// 360 px (`<nombre>-fondo.jpg`), por la trampa del optimizador (ver samira).
//
// ⚠️ **El cumpleaños fue AYER respecto al video**: Vex salió el 23/09/2021
// (parche 11.19) y el video se graba para el jueves 24. La portada dice «ayer».
//
// ⚠️ **Los nombres de las skins en pantalla son los del guion, no los del
// cliente en español de México**, porque la voz los dice en voz alta y verlos
// distintos se leería como error. Pero hay que saberlo, porque **en es_MX el
// chiste cambia**:
//      Dawnbringer    → guion «Portadora del Alba»     · es_MX «Portadora del Amanecer»
//      Empyrean       → guion «Empírea»                · es_MX «Empírea»
//      Stargazer      → guion «Observadora de Estrellas» · es_MX «Astromante»
//      Surprise Party → guion «Fiesta Sorpresa»        · es_MX **«Lacrimosa»**
// La de la fiesta, con globos y confeti, en el cliente mexicano **se llama
// Lacrimosa** —«llorosa»—: el único nombre gótico de las cuatro. Cualquiera
// que juegue en español lo va a ver en su cliente. Además el título oficial
// en es_MX es **«la Tristóloga»**, no «la Melancólica» como dice la
// investigación; ese sí va en la portada porque el guion no lo narra.
//
// ⚠️ El OTP **no está en Challenger**: anda en Esmeralda 1 en soloq y el
// Challenger es su **pico en flexible**. El emblema grande lo dice debajo en
// letras, para que no se lea como su rango actual.
//
// ⚠️ El guion dice «dos días y medio» de salario y la investigación **2,6**:
// en pantalla va el 2,6.
//
// ⚠️ Fuera porque el guion no los narra: la medición de popularidad por puntos
// al año (además es un proxy, no un pickrate), el Esmeralda 1 de soloq, la
// pureza del 97,8 %, que Stargazer fuera de Wild Rift, Kindred y Kled en el
// fondo de Fiesta Sorpresa, y el callback a Blitzcrank por el día de los
// inocentes.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Vex: niebla y un solo golpe de color ──────────────────────────
// Su splash es niebla azul fría de punta a punta (hue 192–216) y lo único
// vivo son sus guantes y sus ojos, en magenta. El deck hace lo mismo: todo en
// azul niebla desaturado y **el magenta solo donde cae el chiste**.
// El magenta está en skins/caras (`#E75FB4`, emparejado con oro) y en mundo
// (`#C455E0`, emparejado con cian): aquí va emparejado con un **azul niebla
// apagado**, que ningún otro deck usa como apoyo.
const BG = '#07080E';        // la niebla de las Islas, de noche
const MAGENTA = '#D8409E';   // sus guantes y sus ojos — acento, solo el chiste
const NIEBLA = '#8398B8';    // azul niebla desaturado — datos y estructura
const BONE = '#EDEEF3';      // texto principal
const MUTED = '#7A7F8E';     // texto secundario
const PANEL = '#10121C';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = NIEBLA, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}24 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo arte.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,8,14,0.14) 0%, rgba(7,8,14,0.38) 34%, rgba(7,8,14,0.92) 64%, rgba(7,8,14,0.99) 100%);"></div>
    </div>`;

// Carta apaisada entera sobre su copia borrosa (archivo aparte, ver cabecera).
const arte = (src, alt, alto = 456) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${NIEBLA}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

const eyebrow = (txt, color = NIEBLA) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(7,8,14,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

const golpe = (txt) => `<span style="color: ${MAGENTA};">${txt}</span>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Ayer cumplio cinco anos Vex y su lore arranca con el dato que la explica entera." style="${seccion()}">
    ${portada('Vex_0.jpg', 'Vex, la Tristóloga', 'center 20%')}
    ${glow(NIEBLA, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · ayer, 23 sep de 2021')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(7,8,14,0.88);"><span data-linea style="display: block;">VEX</span><span data-linea style="display: block; color: ${MAGENTA};">5 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${NIEBLA}; line-height: 1.3;">La Tristóloga</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Mid · de Ciudad de Bandle a las Islas de la Sombra</p>
    </div>
  </section>`);

// ── 2 · Su mejor amiga era su sombra ─────────────────────────────────────
// Las dos razones del lore van como dos fichas iguales: el chiste es que son
// razones de verdad.
slides.push(`
  <section data-label="La sombra" data-screen-label="02 · Su sombra" data-speaker-notes="Su mejor amiga de la infancia era su propia sombra. Y el lore da las dos razones, porque era negra que es su color favorito, y porque no hablaba. Vex crecio en Ciudad de Bandle y nunca sintio que perteneciera ahi. Todo ese color y toda esa ternura le empalagaban." style="${seccion()}">
    ${glow(NIEBLA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Ciudad de Bandle le empalagaba')}
      ${arte('sombra.jpg', 'La Sombra de Vex encima de una fiesta, arte de Legends of Runeterra')}
      <div data-texto style="margin-top: 34px;">
        ${titulo('Su mejor amiga<br>era ' + golpe('su sombra'), 104)}
      </div>
      <div data-razones style="margin-top: 28px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['Era negra', 'su color favorito'], ['No hablaba', 'la amiga perfecta']].map(([a, b]) => `
        <div data-razon style="padding: 20px 22px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${NIEBLA}40;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 0.98; color: ${BONE};">${a}</div>
          <div style="margin-top: 2px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${NIEBLA};">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 3 · Siguió la niebla ─────────────────────────────────────────────────
slides.push(`
  <section data-label="La niebla" data-screen-label="03 · Siguió la niebla" data-speaker-notes="Y un dia llego el Aciago a Ciudad de Bandle. Nubes de niebla negra, panico, todos los yordles peleando por sacarla del pueblo. Menos ella. A ella le parecio fascinante y se fue caminando detras de la niebla hasta su origen. Y asi llego a las Islas de la Sombra. Por fin un lugar donde podia amargarse tranquila." style="${seccion()}">
    ${glow(NIEBLA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Llegó la niebla negra a Bandle')}
      ${arte('niebla.jpg', 'Vex y su sombra en las Islas de la Sombra, arte de Legends of Runeterra')}
      <div data-texto style="margin-top: 34px;">
        ${titulo('Todos la combatían.<br>' + golpe('Ella la siguió.'), 96)}
      </div>
      <p data-remate style="margin: 26px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Hasta las Islas de la Sombra.<br><span style="color: ${NIEBLA};">Por fin, un lugar para amargarse tranquila.</span></p>
    </div>
  </section>`);

// ── 4 · Viego ────────────────────────────────────────────────────────────
// Tres renglones, de lo que parecía a lo que era a cómo reaccionó ella.
slides.push(`
  <section data-label="Viego" data-screen-label="04 · Viego" data-speaker-notes="Y ahi se topo con Viego, el Rey Arruinado. El queria cubrir el mundo entero de niebla negra y ella queria exactamente eso. Se hicieron aliados. Pero Vex descubrio por que Viego hacia todo eso. Nomas queria recuperar el alma de su esposa muerta. Y eso a Vex le dio asco. Asi que lo dejo tirado." style="${seccion()}">
    ${glow(NIEBLA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Se alió con el Rey Arruinado')}
      ${arte('viego.jpg', 'Viego, el Rey Arruinado, arte de Legends of Runeterra')}
      <div data-pasos style="margin-top: 30px; width: 100%; display: flex; flex-direction: column; gap: 12px;">
        ${[
          ['Quería cubrir el mundo de niebla', 'justo lo que ella quería', NIEBLA],
          ['Pero era para recuperar a su esposa muerta', 'era un romántico', NIEBLA],
          ['Le dio asco y lo dejó tirado', '', MAGENTA],
        ].map(([a, b, c]) => `
        <div data-paso style="display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 16px 22px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid ${c}40;">
          <span style="font-size: 30px; font-weight: 700; color: ${c === MAGENTA ? MAGENTA : BONE}; text-align: left; line-height: 1.2;">${a}</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; white-space: nowrap;">${b}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 5 · Son lo peor ──────────────────────────────────────────────────────
// El remate del lore: los diálogos textuales y la respuesta de ella en grande.
slides.push(`
  <section data-label="Son lo peor" data-screen-label="05 · Son lo peor" data-speaker-notes="Le quedaba un ultimo recurso para sentirse miserable. Ir a visitar a sus papas a Ciudad de Bandle y disfrutar de como la rechazaban. Su mama le dijo, corazon no entendemos esto. Y su papa le dijo, pero te queremos incondicionalmente y si tu eres feliz nosotros somos felices por ti. Y Vex puso los ojos en blanco, solto un suspirote y les dijo, son lo peor. O sea que fue hasta su casa a que la rechazaran y la aceptaron. Es lo peor que le podia pasar." style="${seccion()}">
    ${glow(MAGENTA, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Fue a que sus papás la rechazaran')}
      ${arte('familia.jpg', 'Vex de brazos cruzados en una reunión familiar, arte de Legends of Runeterra', 420)}
      <div data-dialogos style="margin-top: 24px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${[['Mamá', '«Corazón, no entendemos… esto.»'], ['Papá', '«Pero te queremos incondicionalmente.»']].map(([q, t]) => `
        <div data-dialogo style="padding: 18px 20px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid ${NIEBLA}40; text-align: left;">
          <div style="font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${NIEBLA};">${q}</div>
          <div style="margin-top: 4px; font-size: 27px; font-weight: 600; color: ${BONE}; line-height: 1.25;">${t}</div>
        </div>`).join('')}
      </div>
      <div data-peor style="margin-top: 28px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.84; color: ${MAGENTA};">«SON LO PEOR»</div>
      <p data-remate style="margin: 16px 0 0; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.36;">Fue a que la rechazaran y la aceptaron</p>
    </div>
  </section>`);

// ── 6 · El OTP ───────────────────────────────────────────────────────────
// El dato del episodio es el winrate, no el rango: por eso el 60 % es la cifra
// grande y el Challenger va como emblema con su aclaración debajo.
slides.push(`
  <section data-label="El OTP" data-screen-label="06 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos y este si sabe jugar. Es un brasileno que se puso de nombre sweet gloomy, o sea dulce sombrio, y trae seis millones ochocientos mil puntos. De sus doscientas sesenta y nueve partidas de temporada doscientas sesenta y tres son con Vex. Y con ella trae sesenta por ciento de victorias, que es el mejor winrate de otepe que hemos visto en toda la serie. Y en flexible llego a Challenger." style="${seccion()}">
    ${glow(NIEBLA, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Y este sí sabe jugar')}

      <div data-nombre style="display: inline-flex; align-items: baseline; gap: 16px; padding: 14px 30px; border-radius: 999px; background: ${NIEBLA}1A; border: 1px solid ${NIEBLA}73;">
        <span style="font-family: ${DISPLAY}; font-size: 50px; line-height: 1; color: ${BONE};">SWEET GLOOMY</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${NIEBLA};">dulce sombrío · Brasil</span>
      </div>

      <div data-winrate style="margin-top: 30px;">
        <div data-cuenta="60" data-sufijo=" %" style="font-family: ${DISPLAY}; font-size: 250px; line-height: 0.8; color: ${MAGENTA}; text-shadow: 0 0 80px rgba(216,64,158,0.3);">60 %</div>
        <div style="margin-top: 10px; font-size: 26px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${BONE};">de victorias con Vex</div>
        <div style="margin-top: 4px; font-size: 22px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${NIEBLA};">el mejor otepé de toda la serie</div>
      </div>

      <div data-fichas style="margin-top: 30px; width: 100%; display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 14px; align-items: stretch;">
        <div data-ficha style="display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${MAGENTA}59;">
          <img src="assets/emblems/challenger.png" alt="Challenger" style="width: 92px; height: auto; flex: none; display: block;">
          <div style="text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 0.95; color: ${BONE};">Challenger</div>
            <div style="font-size: 16px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">su pico<br>en flexible</div>
          </div>
        </div>
        ${[['6,83 M', 'puntos de maestría'], ['263', 'de 269 partidas']].map(([a, b]) => `
        <div data-ficha style="padding: 18px 16px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${NIEBLA}33; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${BONE};">${a}</div>
          <div style="margin-top: 2px; font-size: 17px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 7 · Las skins ────────────────────────────────────────────────────────
// El chiste del episodio, y la única lámina que deja entrar color de verdad:
// las cuatro skins grandes en 2×2, y abajo el golpe.
const skins = [
  ['Vex_1.jpg', 'Portadora del Alba', 'Dawnbringer', ''],
  ['Vex_20.jpg', 'Observadora de Estrellas', 'Stargazer', ''],
  ['Vex_10.jpg', 'Empírea', 'Empyrean · de neón', ''],
  ['Vex_29.jpg', 'Fiesta Sorpresa', 'Surprise Party', '1 de abril'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="07 · Las skins" data-speaker-notes="Y de skins tiene cinco y cuatro las puedes comprar, unos cuarenta y dos dolares, dos dias y medio de salario minimo. Pero wachen el detalle y aqui Riot se burlo de ella. Vex existe para odiar la alegria y el color. Y sus cuatro skins se llaman Portadora del Alba, Observadora de Estrellas, Empirea que es de neon, y Fiesta Sorpresa. Ni una sola oscura. Le compraron a la gotica un guardarropa de nina feliz. Y la de Fiesta Sorpresa encima salio el dia de los inocentes." style="${seccion()}">
    ${glow(MAGENTA, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Riot se burló de ella', MAGENTA)}

      <div data-rejilla style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${skins.map(([img, nombre, en, sello]) => `
        <div data-skin style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${MAGENTA}4D;">
          <img src="assets/${img}" alt="Vex ${en}" style="width: 100%; height: 300px; object-fit: cover; object-position: center 24%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,8,14,0) 45%, rgba(7,8,14,0.94) 100%);"></div>
          ${sello ? `<div data-sello style="position: absolute; top: 14px; right: 14px; background: ${MAGENTA}; color: ${BONE}; font-size: 17px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; border-radius: 8px; padding: 7px 12px;">${sello}</div>` : ''}
          <div style="position: absolute; left: 16px; right: 16px; bottom: 12px; text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 0.98; color: ${BONE};">${nombre}</div>
            <div style="font-size: 17px; font-weight: 600; color: ${NIEBLA};">${en} · 1350 RP</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-golpe style="margin-top: 30px;">
        <div style="font-family: ${DISPLAY}; font-size: 124px; line-height: 0.86; color: ${BONE};">NI UNA <span style="color: ${MAGENTA};">OSCURA</span></div>
        <div style="margin-top: 12px; font-size: 29px; font-weight: 500; color: ${MUTED}; line-height: 1.36;">A la gótica le compraron un guardarropa de niña feliz</div>
      </div>

      <div data-precio style="margin-top: 22px; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${NIEBLA};">~<span data-cuenta="42">42</span> USD · 5 400 RP · 2,6 días de salario</div>
    </div>
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
// Su propio cumpleaños, rodeada de pastel y confeti: la carta de nivel 3 de
// Vex en LoR, cuyo texto dice que odia las fiestas «sobre todo si hay pastel».
slides.push(`
  <section data-label="Cierre" data-screen-label="08 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('fiesta.jpg', 'Vex enfurruñada en medio de una fiesta, arte de Legends of Runeterra', 'center 30%')}
    ${glow(MAGENTA, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cinco años de la Tristóloga')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${MAGENTA};">Vex</span></h2>
      <p data-gigi style="margin: 20px 0 0; font-size: 28px; font-weight: 500; color: ${NIEBLA};">(lo va a odiar)</p>
      <div data-gigi style="margin-top: 40px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${BONE};">GIGI EASY</div>
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
    var fin = parseFloat(el.dataset.cuenta), suf = el.dataset.sufijo || '', o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.0, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0') + suf;
    } }, pos || 0);
  }

  // Sin motivo dibujado: lo que entra es el arte, con un push-in de cámara.
  function entraArte(tl, s, pos) {
    var a = s.querySelector('[data-arte]');
    if (!a) return;
    tl.from(a, { y: 26, opacity: 0, duration: 0.6 }, pos)
      .from(a.querySelector('img'), { scale: 1.07, duration: 1.1, ease: 'power2.out' }, pos);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 52, opacity: 0, duration: 0.78, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.68);
  });

  // Las dos razones caen una tras otra: la segunda es el chiste.
  animar('La sombra', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(s.querySelector('[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.8)
      .from(q(s, '[data-razon]'), { y: 22, opacity: 0, duration: 0.45, stagger: 0.22 }, 1.1);
  });

  animar('La niebla', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(s.querySelector('[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.84)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.2);
  });

  // Tres pasos en orden: parecía, era, y cómo reaccionó.
  animar('Viego', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(q(s, '[data-paso]'), { x: -30, opacity: 0, duration: 0.42, stagger: 0.18 }, 0.8);
  });

  // Mamá, papá y después la respuesta, que entra con rebote.
  animar('Son lo peor', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.1);
    tl.from(q(s, '[data-dialogo]'), { y: 20, opacity: 0, duration: 0.42, stagger: 0.16 }, 0.7)
      .from(s.querySelector('[data-peor]'), { scale: 0.7, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 1.1)
      .from(s.querySelector('[data-remate]'), { y: 18, opacity: 0, duration: 0.4 }, 1.36);
  });

  animar('El OTP', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-nombre]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.12)
      .from(s.querySelector('[data-winrate]'), { y: 30, opacity: 0, duration: 0.55 }, 0.42)
      .from(q(s, '[data-ficha]'), { y: 22, opacity: 0, duration: 0.42, stagger: 0.1 }, 1.12);
    cuentaMil(tl, s.querySelector('[data-winrate] [data-cuenta]'), 0.44, 0.9);
  });

  // Las cuatro skins entran de golpe, como el color que ella odia; el
  // «ni una oscura» llega cuando ya se vieron todas.
  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-skin]'), { scale: 0.9, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'back.out(1.6)' }, 0.12)
      .from(s.querySelector('[data-sello]'), { y: -18, rotation: -8, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 0.66)
      .from(s.querySelector('[data-golpe]'), { y: 28, opacity: 0, duration: 0.55 }, 0.92)
      .from(s.querySelector('[data-precio]'), { y: 18, opacity: 0, duration: 0.45 }, 1.3);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.3, 0.45);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.84);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vex cumple 5 años</title>
${kit.og({ titulo: "Vex cumple 5 años", descripcion: "Su mejor amiga era su sombra, fue a casa a que sus papás la rechazaran y la aceptaron, y Riot le compró un guardarropa de niña feliz. Apoyo visual para TikTok.", carpeta: "vex" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(216,64,158,0.45); border-radius: 999px;
    background: rgba(7,8,14,0.85); color: ${MAGENTA}; cursor: pointer;
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
