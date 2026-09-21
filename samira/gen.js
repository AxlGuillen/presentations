// Generador de index.html — Samira cumple 6 años (screenshots para TikTok)
// Ejecutar: node samira/gen.js
//
// Serie «Cumplelolero» #17, animado. **Encargo: pocas láminas, muy visuales y
// con recursos reales — nada dibujado con iconos.** Por eso este deck es el
// **único de la serie sin motivo gráfico propio**: no hay `dagas()` ni
// `rotor()` ni `disco()`. Lo que estructura las láminas es arte oficial.
//
// De dónde sale cada imagen:
//  · Splashes de skins de Samira — Data Dragon.
//  · **Arte de Legends of Runeterra** (2048×1024) para todo el bloque de lore:
//    `Samira` (`07NX007`, set7), **`Captain Indari` (`07NX005`, set7)** y
//    **`Xerath` (`05SH014T1`, set5)**.
//    - La investigación pedía «arte de Indari si existe» y sí existe: la carta
//      la pinta **en su plataforma de guerra con ruedas**, o sea que la imagen
//      misma cuenta que perdió las piernas. No hace falta escribirlo.
//    - **Xerath va en carta y no en splash a propósito**: su splash de Data
//      Dragon es el de 2011, no se le distingue la cabeza y es azul de punta a
//      punta. La carta lo muestra entero, **con sus cultistas abajo a la
//      derecha** —que es justo lo que narra el guion— y sobre arquitectura
//      shurimana cálida, que además lo ata a la paleta del deck.
//  · Emblemas de rango a 500 px de CommunityDragon, **recortados a su bbox**
//    (la lección de katarina: los de `lowelo/assets/emblems` son de 156 px con
//    casi todo relleno transparente y no aguantan tamaños grandes).
//
// Las tres cartas de LoR se muestran **enteras y sin recortar** sobre una copia
// borrosa de sí mismas, igual que en `guerras/`: son composiciones apaisadas
// en un lienzo vertical y aquí la imagen es el contenido, no la decoración.
// También **se guardan como JPEG y no como el PNG original**, igual que en
// guerras: son ilustraciones opacas sin transparencia y el PNG las triplicaba
// de peso (1,6 MB contra 0,5 MB cada una).
//
// El bloque de lore es el único con tres láminas del mismo molde —marco, arte
// entera, una frase— y eso es deliberado: se lee como un tramo continuo, que es
// como está narrado.
//
// ⚠️ **El cumpleaños es HOY**: Samira salió el 21/09/2020 y el video se graba
// el 21. Es el primero de la tanda con fecha exacta desde hace tres episodios.
//
// ⚠️ **El clip de pentakills del guion no vive aquí**: es material del propio
// canal y va montado en el editor, entre la portada y el bloque de lore. El
// deck no deja hueco para él — son láminas sueltas para cortar encima.
//
// ⚠️ La escalera de los tres OTP (Hierro → Esmeralda → Master) va **como tira
// pequeña dentro de la lámina del one trick, no como lámina propia**: el guion
// no la narra, así que no puede pedir tiempo de voz. Se queda porque son tres
// emblemas reales que refuerzan el dato que sí se narra —que anda en Master—
// sin decir nada nuevo. Es el mismo criterio que el Hierro de ayer en corki.
//
// ⚠️ Datos verificados que **quedan fuera porque el guion no los narra**:
//  · Que se tatuaba sus hazañas y se las iba a presumir a su familia. La
//    investigación lo marca como el mejor descartado y tiene razón, pero no
//    hay arte para sostenerlo y en texto suelto compite con el juramento.
//  · **Bel'zhun** por nombre (el guion dice «un puerto ocupado por Noxus»).
//  · Que Baile de la Rosa Negra sea **el cuarto episodio seguido que toca a la
//    Rosa Negra** (briar, guerras, katarina y esta).
//  · Que Sona cumpla el mismo día.
//
// ⚠️ Sin verificar, y por eso no sale en pantalla: que Rokrund sea el mismo
// sitio donde hirieron a Ambessa. La investigación lo marca como coincidencia
// de nombre sin comprobar, y el guion tampoco lo dice.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Samira: escarlata y arena ─────────────────────────────────────
// El rojo es el color más visto del repo (caps, briar, mundo, katarina), así
// que el diferenciador es **con qué va emparejado**: briar lleva su carmín con
// un azul frío de cueva, katarina el suyo con teal de acero y caps su escarlata
// con plata y oro. Este es **el único deck de la serie sin ningún color frío**:
// escarlata sobre arena de Shurima, que es literalmente lo que es el personaje
// —la Rosa del Desierto, nacida en Shurima y hecha en Noxus— y también lo que
// son sus dos cartas de LoR, todas rojas y ocres. Y se separa de riven, el otro
// deck de arenisca, en que ahí la arena es apoyo bajo un acento verde: aquí la
// arena manda en los datos y no hay verde que la tape.
// El fondo es **violáceo, no marrón**: es el negro que de verdad tiene su
// splash (h=300), y evita confundirse con el polvo cálido de riven.
// El **único frío del deck es el azul de Xerath**, y no se corrige: que el
// villano sea lo único que no pertenece a la paleta lo marca como ajeno, que es
// el mismo recurso que usa ivern con el acero del bloque de Ivern el Cruel.
const BG = '#0C0710';        // noche violácea del splash
const ROSA = '#E62740';      // el escarlata de su banda — acento
const ARENA = '#E3C39C';     // la arena de Shurima — datos y estructura
const BONE = '#F2ECE8';      // texto principal
const MUTED = '#8A7F7C';     // texto secundario
const PANEL = '#190F19';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

// Todas las láminas centradas, como katarina y corki.
const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = ROSA, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash.
// La capa borrosa sangra fuera del marco: va en un contenedor con overflow
// oculto o infla scrollHeight y el QA marca un desborde falso.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12,7,16,0.14) 0%, rgba(12,7,16,0.38) 34%, rgba(12,7,16,0.92) 64%, rgba(12,7,16,0.99) 100%);"></div>
    </div>`;

// Arte apaisado **entero y sin recortar** sobre una copia borrosa de sí mismo.
// Mismo recurso que usa guerras/: las cartas de LoR son 2:1 y el lienzo es
// vertical, así que recortarlas se comería justo lo que hay que ver.
//
// ⚠️ La capa borrosa usa **un archivo aparte de 360 px** (`<nombre>-fondo.jpg`)
// y no el arte grande. Si las dos capas apuntan al mismo archivo,
// `optimizar-imagenes.mjs` se queda con la escala que exige la más golosa — y
// la golosa es la borrosa, porque va con `cover` y sangra 40 px por lado, así
// que pide ~1,05× del original y el arte se queda a 2048 px **para acabar
// desenfocado a 38 px de radio**. Con el archivo chico, el arte nítido se
// planifica por lo que de verdad se ve (912 px × la holgura de 2) y la lámina
// 2, que es vecina de la portada y se precarga con ella, deja de costar medio
// mega. El desenfoque se ve idéntico: a 38 px de radio no hay detalle que
// perder.
const arte = (src, alt, alto = 456) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${ROSA}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

const eyebrow = (txt, color = ROSA) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(12,7,16,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy toca felicitar a Samira porque cumple seis anos desde que entro al juegito en contra de mi voluntad, porque este adece no tiene perro sentido. Me hace counter a mi main Jhin y a mi segundo mejor pick que es Smolder." style="${seccion()}">
    ${portada('Samira_0.jpg', 'Samira, la Rosa del Desierto', 'center 18%')}
    ${glow(ROSA, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · hoy, 21 sep de 2020')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(12,7,16,0.88);"><span data-linea style="display: block;">SAMIRA</span><span data-linea style="display: block; color: ${ROSA};">6 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${ARENA}; line-height: 1.3;">La Rosa del Desierto</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Bot · nació en Shurima, se hizo en Noxus</p>
    </div>
  </section>`);

// ── 2 · Le quemaron el pueblo, y el callback con Azir ────────────────────
// El bloque de lore abre con el villano y no con ella: es lo que amarra este
// episodio con el de Azir de hace cinco días sin tener que explicarlo.
slides.push(`
  <section data-label="Xerath" data-screen-label="02 · Le quemaron el pueblo" data-speaker-notes="La vispera de su cumpleanos catorce atacaron el pueblo. Un ejercito de cultistas que invocaban el nombre de un mago antiguo, matando gente frente a ella. Ah y un detalle, los cultistas que le destruyeron su pueblo eran seguidores de Xerath. El mismo cabron del que les hable hace unos dias con Azir." style="${seccion()}">
    ${glow(ROSA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('La víspera de sus catorce')}
      ${arte('xerath.jpg', 'Xerath y sus cultistas, arte de Legends of Runeterra')}
      <div data-quemaron style="margin-top: 34px;">
        ${titulo('Le quemaron<br>el <span style="color: ' + ROSA + ';">pueblo</span>', 106)}
      </div>
      <div data-callback style="margin-top: 34px; display: inline-flex; align-items: center; padding: 16px 30px; border-radius: 999px; background: ${ROSA}1F; border: 1px solid ${ROSA}80;">
        <span style="font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Cultistas de Xerath · el mismo que traicionó a Azir</span>
      </div>
    </div>
  </section>`);

// ── 3 · El juramento ─────────────────────────────────────────────────────
// La lámina más limpia del deck a propósito: una carta de LoR entera y una
// sola frase. Es la línea que explica todo lo que hace el personaje después,
// así que no lleva nada que compita.
slides.push(`
  <section data-label="El juramento" data-screen-label="03 · El juramento" data-speaker-notes="Y ella no lloro ni grito. Se lleno de rabia. Contra los invasores y contra si misma por haberse escondido, porque fue la primera vez en su vida que el miedo la paralizo. Y ahi juro que nunca mas se iba a volver a sentir asustada ni indefensa." style="${seccion()}">
    ${glow(ROSA, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('No lloró. Se llenó de rabia')}
      ${arte('samira-lor.jpg', 'Samira, arte de Legends of Runeterra')}
      <div data-nunca style="margin-top: 38px;">
        <div style="font-family: ${DISPLAY}; font-size: 176px; line-height: 0.84; color: ${ROSA};">NUNCA MÁS</div>
        <div style="margin-top: 14px; font-size: 32px; font-weight: 500; color: ${MUTED}; line-height: 1.38;">Juró que no iba a volver a sentir<br>miedo ni a quedarse indefensa</div>
      </div>
    </div>
  </section>`);

// ── 4 · Indari y el ojo ──────────────────────────────────────────────────
// La carta de Indari hace sola el trabajo que en otro deck pedirían tres
// renglones: está pintada en su plataforma de guerra con ruedas.
slides.push(`
  <section data-label="Indari" data-screen-label="04 · Indari y el ojo" data-speaker-notes="Los mandaron a aplastar una rebelion y la fortaleza exploto con Indari adentro. Y Samira se avento de cabeza al edificio mientras se caia, a sacar a su capitana. Sobrevivieron las dos. Samira perdio el ojo derecho e Indari perdio el uso de las piernas. Y anos despues le propuso una sociedad, pero Indari le puso una condicion. Que nunca le iba a dar apoyo en campo." style="${seccion()}">
    ${glow(ARENA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Se aventó a la fortaleza que se caía', ARENA)}
      ${arte('indari.jpg', 'La capitana Indari, arte de Legends of Runeterra')}

      <div data-precio style="margin-top: 26px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['El ojo derecho', 'lo perdió Samira'], ['Las piernas', 'las perdió Indari']].map(([a, b]) => `
        <div data-costo style="padding: 22px 24px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${ROSA}45;">
          <div style="font-family: ${DISPLAY}; font-size: 64px; line-height: 0.98; color: ${ROSA};">${a}</div>
          <div style="margin-top: 2px; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${b}</div>
        </div>`).join('')}
      </div>

      <p data-remate style="margin: 28px 0 0; font-size: 35px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Salvó a la única persona<br>que creyó en ella. <span style="color: ${ROSA};">Y desde entonces<br>esa persona la manda sola</span>.</p>
    </div>
  </section>`);

// ── 5 · El OTP ───────────────────────────────────────────────────────────
// El emblema grande, igual que en katarina y corki — pero aquí es Master, que
// es el remate de tres días seguidos. De ahí la tira de abajo.
const escalera = [
  ['iron.png', 'Hierro 1', 'hace dos días'],
  ['emerald.png', 'Esmeralda 4', 'ayer'],
  ['master.png', 'Master', 'hoy'],
];

slides.push(`
  <section data-label="El OTP" data-screen-label="05 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos. Es un norteamericano con siete millones de puntos y anda en Master. Esta en el cero punto tres nueve por ciento mas alto de su servidor. Y no es de los que nomas acumulan. De sus quinientas noventa y ocho partidas de temporada cuatrocientas noventa y ocho son con Samira, y con ella trae cincuenta y tres por ciento de victorias y diez kills de promedio por partida." style="${seccion()}">
    ${glow(ROSA, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Y este es el mejor de la serie')}

      <img data-emblema src="assets/emblems/master.png" alt="Master" style="width: 340px; height: auto; display: block; filter: drop-shadow(0 0 70px rgba(230,39,64,0.32)) brightness(1.08);">
      <div data-rango style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 138px; line-height: 0.88; color: ${BONE};">MASTER</div>
      <div data-rango style="margin-top: 4px; font-size: 27px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${ARENA};">294 LP · top 0,39 % del servidor</div>

      <div data-cifra style="margin-top: 26px;">
        <div data-cuenta="6965754" style="font-family: ${DISPLAY}; font-size: 138px; line-height: 0.84; color: ${ROSA};">6 965 754</div>
        <div style="margin-top: 4px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div data-fichas style="margin-top: 28px; width: 100%; display: flex; gap: 14px;">
        ${[['498', 'de 598 partidas'], ['53 %', 'de victorias con ella'], ['10,1', 'kills por partida']].map(([a, b]) => `
        <div style="flex: 1; padding: 20px 18px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(227,195,156,0.26);">
          <div style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${ARENA};">${a}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">${b}</div>
        </div>`).join('')}
      </div>

      <div data-escalera style="margin-top: 26px; width: 100%; display: flex; align-items: flex-end; justify-content: center; gap: 30px;">
        ${escalera.map(([em, nombre, cuando], i) => {
          const hoy = i === 2;
          return `
        <div data-peldano style="display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: ${hoy ? '1' : '0.5'};">
          <img src="assets/emblems/${em}" alt="${nombre}" style="width: ${60 + i * 26}px; height: auto; display: block; filter: ${hoy ? 'brightness(1.1)' : 'grayscale(0.8) brightness(0.95)'};">
          <div style="font-size: 21px; font-weight: 700; color: ${hoy ? BONE : MUTED}; line-height: 1.1;">${nombre}</div>
          <div style="font-size: 17px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${hoy ? ROSA : '#6A6060'};">${cuando}</div>
        </div>`;
        }).join('')}
      </div>
    </div>
  </section>`);

// ── 6 · Las skins ────────────────────────────────────────────────────────
// La Ultimate va enorme y sola arriba: es el dato de la lámina, y lo que hace
// que cinco skins cuesten más que las doce de Corki.
const comprables = [
  ['Samira_1.jpg', 'PsyOps', '1350'],
  ['Samira_10.jpg', 'Onda Espacial', '1350'],
  ['Samira_20.jpg', 'La Forajida', '1350'],
  ['Samira_35.jpg', 'Profesora', '1350'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="06 · Las skins" data-speaker-notes="Y de skins tiene siete pero nada mas cinco puedes comprar. Y aqui esta el detalle, porque una de esas es Ultimate, de tres mil doscientos cincuenta. Por eso Samira con cinco skins te sale mas cara que Corki con doce. Unos sesenta y siete dolares, cuatro dias de salario minimo." style="${seccion()}">
    ${glow(ROSA, '50% 26%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Solo cinco a la venta')}

      <div data-ulti style="position: relative; width: 100%; border-radius: 18px; overflow: hidden; border: 2px solid ${ROSA}D9;">
        <img src="assets/Samira_30.jpg" alt="Samira Peleadora Álmica" style="width: 100%; height: 400px; object-fit: cover; object-position: center 24%; display: block;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12,7,16,0) 42%, rgba(12,7,16,0.94) 100%);"></div>
        <div data-sello style="position: absolute; top: 18px; left: 18px; background: ${ROSA}; color: ${BONE}; font-size: 21px; font-weight: 800; letter-spacing: 3px; border-radius: 8px; padding: 9px 18px;">ULTIMATE</div>
        <div style="position: absolute; left: 24px; right: 24px; bottom: 18px; text-align: left;">
          <div style="font-family: ${DISPLAY}; font-size: 68px; line-height: 0.98; color: ${BONE};">Peleadora Álmica</div>
          <div style="margin-top: 2px; font-size: 25px; font-weight: 700; color: ${ROSA};">3250 RP · el escalón más alto que existe</div>
        </div>
      </div>

      <div data-rejilla style="margin-top: 14px; width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        ${comprables.map(([img, nombre, rp]) => `
        <div data-skin style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(227,195,156,0.24);">
          <img src="assets/${img}" alt="Samira ${nombre}" style="width: 100%; height: 190px; object-fit: cover; object-position: center 22%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12,7,16,0) 44%, rgba(12,7,16,0.93) 100%);"></div>
          <div style="position: absolute; left: 10px; right: 10px; bottom: 8px; text-align: left;">
            <div style="font-size: 18px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            <div style="font-size: 16px; font-weight: 600; color: ${ARENA};">${rp} RP</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 22px; display: flex; align-items: center; justify-content: center; gap: 24px;">
        <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${ROSA};">~<span data-cuenta="67">67</span> <span style="font-size: 44px;">USD</span></div>
        <div style="width: 2px; height: 58px; background: ${ROSA}4D;"></div>
        <div style="text-align: left; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.35;">8 650 RP · 4,1 días de salario<br><span style="color: ${ARENA};">más cara que Corki con doce</span></div>
      </div>
    </div>
  </section>`);

// ── 7 · Cierre ───────────────────────────────────────────────────────────
// Con **La Forajida** y no con PsyOps, aunque PsyOps sea la que salió con ella
// hace seis años: PsyOps es azul y morada de punta a punta y en un deck que no
// tiene un solo color frío la banda de cierre se peleaba con todo lo anterior.
// La Forajida es la única de sus skins que es desierto puro, que es de lo que
// va el apodo.
//
// ⚠️ Al cambiarla hubo que **volver a bajar el original**: `optimizar-imagenes`
// ya la había reducido a 644×380 para la miniatura de la rejilla, y estirada a
// una banda de 1080×820 habría salido borrosa. Es la trampa de missfortune y
// syndra otra vez — un mismo splash que es miniatura en una lámina y fondo a
// sangre en otra.
slides.push(`
  <section data-label="Cierre" data-screen-label="07 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Samira_20.jpg', 'Samira la Forajida', 'center 22%')}
    ${glow(ROSA, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Seis años de la Rosa del Desierto')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${ROSA};">Samira</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${ARENA};">GIGI EASY</div>
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
    tl.to(o, { v: fin, duration: dur || 1.0, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  // Sin motivo dibujado en este deck: lo que entra es el arte. El arte se
  // acerca un poco al aparecer, como un push-in de cámara.
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
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.68);
  });

  // La chapa del callback entra al final y con rebote: es el remate, y llega
  // cuando ya se vio de quién es la cara.
  animar('Xerath', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(s.querySelector('[data-quemaron]'), { y: 34, opacity: 0, duration: 0.65 }, 0.86)
      .from(s.querySelector('[data-callback]'), { scale: 0.86, opacity: 0, duration: 0.55, ease: 'back.out(1.8)' }, 1.24);
  });

  // El «nunca más» llega tarde a propósito: primero se ve la carta completa.
  animar('El juramento', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.14);
    tl.from(s.querySelector('[data-nunca]'), { y: 30, opacity: 0, duration: 0.65 }, 1.02);
  });

  // Los dos costos caen uno tras otro y el remate después: el orden importa,
  // porque la frase solo pega si ya se leyeron las dos pérdidas.
  animar('Indari', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.14);
    tl.from(q(s, '[data-costo]'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.14 }, 0.9)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.28);
  });

  // El emblema cae primero y grande; la escalera de los tres días, al final.
  animar('El OTP', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-emblema]'), { y: -34, scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.14)
      .from(q(s, '[data-rango]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.5)
      .from(s.querySelector('[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.76)
      .from(q(s, '[data-fichas] > div'), { y: 22, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.0)
      .from(q(s, '[data-peldano]'), { y: 20, opacity: 0, duration: 0.38, stagger: 0.1 }, 1.22);
    cuentaMil(tl, s.querySelector('[data-cifra] [data-cuenta]'), 0.78, 0.85);
  });

  // La Ultimate entra sola y con su sello antes que las otras cuatro: la
  // lámina es ella, las demás son el contexto.
  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-ulti]'), { y: 30, scale: 0.97, opacity: 0, duration: 0.65 }, 0.12)
      .from(s.querySelector('[data-sello]'), { x: -24, opacity: 0, duration: 0.45, ease: 'back.out(2)' }, 0.62)
      .from(q(s, '[data-skin]'), { y: 22, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.82)
      .from(s.querySelector('[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 1.2);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.2, 0.55);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.9);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Samira cumple 6 años</title>
${kit.og({ titulo: "Samira cumple 6 años", descripcion: "Perdió el ojo salvando a la única persona que creyó en ella, y esa persona desde entonces la manda sola. Seis años de la Rosa del Desierto. Apoyo visual para TikTok.", carpeta: "samira" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(230,39,64,0.45); border-radius: 999px;
    background: rgba(12,7,16,0.85); color: ${ROSA}; cursor: pointer;
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
