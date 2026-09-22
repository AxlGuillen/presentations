// Generador de index.html — Sona cumple 16 años (screenshots para TikTok)
// Ejecutar: node sona/gen.js
//
// Serie «Cumplelolero» #18, animado. Sigue el criterio que pidió samira —
// **pocas láminas, muy visuales, recursos reales y nada dibujado con iconos** —,
// así que tampoco tiene motivo gráfico propio: lo que estructura es arte oficial.
//
// De dónde sale cada imagen:
//  · Splashes de Sona y de Katarina — Data Dragon.
//  · Sona no tiene carta en Legends of Runeterra, así que el lore se ilustra con
//    **cartas del mundo que le tocó**, no con ella:
//    - `monasterio` = **Monastery of Hirana** (`03IO006`, set3). Ojo: el lore
//      dice que la dejaron en un monasterio de la provincia de **Galrin**, no en
//      Hirana. Por eso la lámina dice «un monasterio en Jonia» y **nunca nombra
//      el sitio**: la carta está como imagen de un monasterio jonio, no como el
//      suyo.
//    - `demacia` = **The Grand Plaza** (`03DE010`, set3), la misma que ya usa
//      guerras/ (se copió de `guerras/assets/gran-plaza.jpg`).
//    - `buscamagos` = **Mageseeker Investigator** (`01DE023`, set1): un
//      buscamagos tocando a una puerta **mientras Lux se esconde detrás**. Es
//      exactamente la situación del remate —una maga escondida en el país que
//      caza magos— sin que la carta sea de Sona.
//  · Emblemas de CommunityDragon a 500 px, recortados a su bbox.
//
// Las cartas van enteras sobre una copia borrosa **con archivo propio de 360 px**
// (`<nombre>-fondo.jpg`): si la capa borrosa apunta al mismo archivo, el
// optimizador guarda el arte a tamaño completo para desenfocarlo (ver samira).
//
// ⚠️ **El cumpleaños es HOY**, el mismo día que Samira: Sona salió el
// 21/09/2010 (parche 1.0.0.101).
//
// ⚠️ **El total de skins no va en pantalla a propósito.** El guion dice
// «quince» y la investigación también, pero la wiki lista **16 sin contar la
// base**: a la investigación le faltan **Sona Victoriosa** (recompensa de
// clasificatoria, 2024) y **Sona Réquiem Prestigiosa** (pase de batalla, marzo
// de 2026). Las **diez comprables sí están bien**, así que la lámina se apoya
// en ese número y no en el total.
//
// ⚠️ **DJ Sona «le cambia la música a toda la partida»** es del gancho del guion
// y la investigación lo marca sin verificar. En pantalla va solo lo que sí está
// comprobado: Ultimate, 3250 RP y **tres modos musicales** (la wiki trae el arte
// de los tres: Kinetic, Concussive y Ethereal).
//
// ⚠️ El guion dice «siete días de salario» y la investigación **7,2**: en
// pantalla va el 7,2, la voz redondea.
//
// ⚠️ Fuera porque el guion no los narra: el nombre del etwahl, la Casa Buvelle,
// que daba recitales, los 13,6 asistencias del OTP, la ventaja de 1,47× sobre el
// segundo del mundo, las 72 partidas de la última semana, y los callbacks a
// Guerras Rúnicas y al Dr. Simi. El de Riven **sí** va, porque el guion lo dice.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Sona: un solo color ───────────────────────────────────────────
// Todos los decks de la serie tienen un acento y uno o dos colores de apoyo.
// Este es **el único con un solo color**: el turquesa del etwahl y del pelo
// sobre tinta azul marino, y todo lo demás en hueso y gris. Es un episodio sobre
// alguien sin voz, así que la paleta tampoco levanta la voz.
// El turquesa roza el aguamarina de janna `#69E8C8`, pero janna es más verde y
// más brillante y **va emparejada con rosa**; aquí no hay pareja, que es justo
// el diferenciador. El fondo es azul marino y no negro: es el vestido del
// splash original.
const BG = '#070B14';        // tinta azul marino, su vestido
const ETWAHL = '#5CCFC8';    // el turquesa del instrumento — el único color
const BONE = '#EEF1F4';      // texto principal
const PLATA = '#B9C3CE';     // estructura y datos, neutro
const MUTED = '#7D8794';     // texto secundario
const PANEL = '#0F1624';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${ETWAHL}24 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,11,20,0.14) 0%, rgba(7,11,20,0.38) 34%, rgba(7,11,20,0.92) 64%, rgba(7,11,20,0.99) 100%);"></div>
    </div>`;

// Carta apaisada entera sobre su copia borrosa (archivo aparte, ver cabecera).
const arte = (src, alt, alto = 456) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${ETWAHL}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

const eyebrow = (txt, color = ETWAHL) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(7,11,20,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

const acento = (txt) => `<span style="color: ${ETWAHL};">${txt}</span>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// El gancho del guion es la ironía, así que va en la portada misma: la más
// musical del juego, y no puede hablar.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy cumple dieciseis anos Sona y aqui les va lo mas ironico que hay en el juego. Es la campeona mas musical que existe, tiene una skin que le cambia la musica a toda la partida, y la cabrona no puede hablar." style="${seccion()}">
    ${portada('Sona_0.jpg', 'Sona, la Virtuosa de las Cuerdas', 'center 22%')}
    ${glow('50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · hoy, 21 sep de 2010')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(7,11,20,0.88);"><span data-linea style="display: block;">SONA</span><span data-linea style="display: block; color: ${ETWAHL};">16 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${PLATA}; line-height: 1.3;">La Virtuosa de las Cuerdas</p>
      <p data-sub style="margin: 10px 0 0; font-size: 40px; font-weight: 700; color: ${ETWAHL}; line-height: 1.3;">y no puede hablar</p>
    </div>
  </section>`);

// ── 2 · El instrumento que nadie conocía ─────────────────────────────────
slides.push(`
  <section data-label="El instrumento" data-screen-label="02 · El instrumento" data-speaker-notes="A Sona la dejaron de bebe en un monasterio en Jonia. No dejaron ninguna pista de quien era ni de donde venia. Lo unico que venia con ella era un instrumento de cuerdas que nadie en el monasterio reconocia. Los monjes la criaron bien y con el tiempo se dieron cuenta de que la nina no podia hablar. Y wachen este detalle. Aprendio a tocar sola." style="${seccion()}">
    ${glow('50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('La dejaron de bebé en Jonia')}
      ${arte('monasterio.jpg', 'Un monasterio en las montañas de Jonia, arte de Legends of Runeterra')}
      <div data-texto style="margin-top: 36px;">
        ${titulo('Con un instrumento<br>que ' + acento('nadie conocía'), 96)}
      </div>
      <p data-remate style="margin: 28px 0 0; font-size: 36px; font-weight: 600; color: ${BONE}; line-height: 1.34;">No había quién le enseñara.<br>${acento('Aprendió a tocar sola.')}</p>
    </div>
  </section>`);

// ── 3 · Ocho se fueron, ella se quedó ────────────────────────────────────
slides.push(`
  <section data-label="Se quedó" data-screen-label="03 · Ella se quedó" data-speaker-notes="Despues Noxus invadio Jonia, que por cierto es la misma guerra de la que les hable en el video de Riven, y el monasterio evacuo a los huerfanos en un barco a Demacia. Alla una familia noble acepto cuidar a nueve huerfanos de guerra por tres meses. Cuando se acabaron los tres meses ocho se fueron y Sona decidio quedarse. Y como no hablaba el idioma de Demacia, esa familia le invento un lenguaje de senas propio nada mas para poder entenderse con ella." style="${seccion()}">
    ${glow('50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('La evacuaron en barco a Demacia')}
      ${arte('demacia.jpg', 'Demacia, arte de Legends of Runeterra')}
      <div data-texto style="margin-top: 34px;">
        ${titulo('Ocho se fueron.<br>' + acento('Ella se quedó.'), 96)}
      </div>
      <p data-remate style="margin: 24px 0 0; font-size: 32px; font-weight: 500; color: ${PLATA}; line-height: 1.36;">Y le inventaron un lenguaje de señas<br>nada más para ella</p>
      <div data-callback style="margin-top: 28px; display: inline-flex; align-items: center; padding: 14px 28px; border-radius: 999px; background: ${ETWAHL}1A; border: 1px solid ${ETWAHL}73;">
        <span style="font-size: 23px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Huyó de la invasión de Noxus · la guerra de Riven</span>
      </div>
    </div>
  </section>`);

// ── 4 · Su única voz es su único delito ──────────────────────────────────
// El remate del lore. La carta es la de Lux escondida detrás de la puerta.
slides.push(`
  <section data-label="El delito" data-screen-label="04 · Su única voz" data-speaker-notes="Anos despues, estudiando en una biblioteca, descubrio lo que era su instrumento. Es un artefacto magico. Y eso significa que ella es maga. Y aqui esta el problema. Esta en Demacia, el pais que caza magos. O sea que Sona no puede hablar, lo unico con lo que se expresa es ese instrumento, y ese instrumento es justo lo que la delataria. Su unica voz es tambien su unico delito." style="${seccion()}">
    ${glow('50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Su instrumento es un artefacto mágico')}
      ${arte('buscamagos.jpg', 'Un buscamagos de Demacia tocando a la puerta, arte de Legends of Runeterra')}
      <p data-contexto style="margin: 30px 0 0; font-size: 32px; font-weight: 500; color: ${PLATA}; line-height: 1.34;">Es maga, en el país que caza magos</p>
      <div data-remate style="margin-top: 22px; font-family: ${DISPLAY}; font-size: 112px; line-height: 0.9; text-transform: uppercase;">
        <span style="display: block; color: ${BONE};">Su única voz</span>
        <span style="display: block; color: ${ETWAHL};">es su único delito</span>
      </div>
    </div>
  </section>`);

// ── 5 · El OTP ───────────────────────────────────────────────────────────
// El emblema de Hierro en grande otra vez, como en katarina, y abajo la
// comparación que el guion sí narra: el de Katarina era el 3 % más bajo y
// este es el 0,2 %. Las caras salen de los **retratos de pantalla de carga**
// (308×560, verticales) y no de los splashes: un círculo recortado del centro
// de un splash apaisado enseñaba la espada de Katarina y el instrumento de Sona.
const duelo = [
  ['Katarina-carga.jpg', 'Katarina', 'hace dos días', '12,4 M', '3 %', 'center 16%', false],
  ['Sona-carga.jpg', 'Sona', 'hoy', '16,3 M', '0,2 %', 'center 14%', true],
];

slides.push(`
  <section data-label="El OTP" data-screen-label="05 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos y este rompe el record que puse hace dos dias con Katarina. Es un europeo con dieciseis millones doscientos mil puntos, nivel de maestria mil ciento treinta y seis y nivel de invocador dos mil doscientos cincuenta y ocho. Y esta en Hierro cuatro. En el cero punto dos por ciento mas bajo de su servidor. Acuerdense que el de Katarina andaba en el tres por ciento mas bajo, pues este esta diez veces mas abajo todavia. Nunca ha pasado de Bronce en su vida. Y de sus novecientas cincuenta partidas de temporada novecientas treinta y cinco son con Sona." style="${seccion()}">
    ${glow('50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Rompe el récord de Katarina')}

      <img data-emblema src="assets/emblems/iron.png" alt="Hierro" style="width: 330px; height: auto; display: block; filter: drop-shadow(0 0 60px rgba(92,207,200,0.25)) brightness(1.12);">
      <div data-rango style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 138px; line-height: 0.88; color: ${BONE};">HIERRO 4</div>
      <div data-rango style="margin-top: 4px; font-size: 25px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${PLATA};">nunca ha pasado de Bronce en su vida</div>

      <div data-cifra style="margin-top: 26px;">
        <div data-cuenta="16271621" style="font-family: ${DISPLAY}; font-size: 138px; line-height: 0.84; color: ${ETWAHL};">16 271 621</div>
        <div style="margin-top: 4px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div data-fichas style="margin-top: 26px; width: 100%; display: flex; gap: 14px;">
        ${[['1 136', 'nivel de maestría'], ['2 258', 'nivel de invocador'], ['935', 'de 950 partidas']].map(([a, b]) => `
        <div style="flex: 1; padding: 18px 16px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(185,195,206,0.2);">
          <div style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${BONE};">${a}</div>
          <div style="margin-top: 2px; font-size: 18px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">${b}</div>
        </div>`).join('')}
      </div>

      <div data-duelo style="margin-top: 22px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${duelo.map(([img, nombre, cuando, pts, pct, pos, hoy]) => `
        <div data-lado style="display: flex; align-items: center; gap: 16px; padding: 14px 18px; border-radius: 16px; background: ${hoy ? ETWAHL + '14' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${hoy ? ETWAHL + '66' : 'rgba(255,255,255,0.08)'};">
          <img src="assets/${img}" alt="${nombre}" style="width: 72px; height: 72px; flex: none; border-radius: 50%; object-fit: cover; object-position: ${pos}; display: block; filter: ${hoy ? 'none' : 'grayscale(0.7) brightness(0.85)'};">
          <div style="text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 0.95; color: ${hoy ? ETWAHL : MUTED};">${pct} <span style="font-size: 26px;">más bajo</span></div>
            <div style="font-size: 18px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${hoy ? PLATA : '#5E6772'};">${nombre} · ${cuando} · ${pts}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 6 · Las skins ────────────────────────────────────────────────────────
// DJ Sona enorme y sola arriba, las otras nueve comprables en rejilla de tres.
const comprables = [
  ['Sona_2.jpg', 'Pentakill', '975'],
  ['Sona_4.jpg', 'Guqin', '975'],
  ['Sona_5.jpg', 'de Arcadia', '1350'],
  ['Sona_9.jpg', 'Odisea', '1350'],
  ['Sona_17.jpg', 'PsyOps', '1820'],
  ['Sona_26.jpg', 'Pentakill III', '1350'],
  ['Sona_35.jpg', 'Guardiana Estelar', '1350'],
  ['Sona_45.jpg', 'Viaje Inmortal', '1350'],
  ['Sona_66.jpg', 'Flor Espiritual', '1350'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="06 · Las skins" data-speaker-notes="Y de skins tiene quince, de las cuales diez puedes comprar, unos ciento dieciseis dolares, siete dias de salario minimo. Y entre esas esta DJ Sona que es Ultimate, de tres mil doscientos cincuenta, de las mas caras que existen." style="${seccion()}">
    ${glow('50% 26%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Diez a la venta')}

      <div data-ulti style="position: relative; width: 100%; border-radius: 18px; overflow: hidden; border: 2px solid ${ETWAHL}D9;">
        <img src="assets/Sona_6.jpg" alt="DJ Sona" style="width: 100%; height: 360px; object-fit: cover; object-position: center 30%; display: block;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,11,20,0) 42%, rgba(7,11,20,0.94) 100%);"></div>
        <div data-sello style="position: absolute; top: 18px; left: 18px; background: ${ETWAHL}; color: ${BG}; font-size: 21px; font-weight: 800; letter-spacing: 3px; border-radius: 8px; padding: 9px 18px;">ULTIMATE</div>
        <div style="position: absolute; left: 24px; right: 24px; bottom: 16px; text-align: left;">
          <div style="font-family: ${DISPLAY}; font-size: 70px; line-height: 0.98; color: ${BONE};">DJ Sona</div>
          <div style="margin-top: 2px; font-size: 24px; font-weight: 700; color: ${ETWAHL};">3250 RP · tres modos musicales</div>
        </div>
      </div>

      <div data-rejilla style="margin-top: 12px; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        ${comprables.map(([img, nombre, rp]) => `
        <div data-skin style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(185,195,206,0.2);">
          <img src="assets/${img}" alt="Sona ${nombre}" style="width: 100%; height: 150px; object-fit: cover; object-position: center 22%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,11,20,0) 40%, rgba(7,11,20,0.93) 100%);"></div>
          <div style="position: absolute; left: 10px; right: 10px; bottom: 7px; text-align: left;">
            <div style="font-size: 17px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            <div style="font-size: 15px; font-weight: 600; color: ${PLATA};">${rp} RP</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 22px; display: flex; align-items: center; justify-content: center; gap: 24px;">
        <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${ETWAHL};">~<span data-cuenta="116">116</span> <span style="font-size: 44px;">USD</span></div>
        <div style="width: 2px; height: 58px; background: ${ETWAHL}4D;"></div>
        <div style="text-align: left; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.35;">15 120 RP<br>7,2 días de salario</div>
      </div>
    </div>
  </section>`);

// ── 7 · Noche de Paz ─────────────────────────────────────────────────────
// El chiste del cierre, con la skin en grande. En es_MX se llama «Noche de Paz»,
// pero el chiste está en el nombre en inglés, que es el que narra el guion.
slides.push(`
  <section data-label="Silent Night" data-screen-label="07 · Silent Night" data-speaker-notes="Ah y hay una que se llama Silent Night, que en ingles significa noche silenciosa. Se la pusieron al unico personaje del juego que no puede hablar." style="${seccion()}">
    ${glow('50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Y hay una que se llama')}
      <div data-pieza style="position: relative; width: 100%; border-radius: 18px; overflow: hidden; border: 1px solid ${ETWAHL}59;">
        <img src="assets/Sona_3.jpg" alt="Sona Noche de Paz" style="width: 100%; height: 540px; object-fit: cover; object-position: 72% 30%; display: block;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,11,20,0) 55%, rgba(7,11,20,0.9) 100%);"></div>
        <div style="position: absolute; left: 24px; bottom: 18px; text-align: left; font-size: 22px; font-weight: 600; color: ${PLATA};">Diciembre de 2010 · hoy en bóveda</div>
      </div>
      <div data-nombre style="margin-top: 34px;">
        <div style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.84; color: ${BONE};">SILENT NIGHT</div>
        <div style="margin-top: 10px; font-size: 32px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${ETWAHL};">noche silenciosa</div>
      </div>
      <p data-remate style="margin: 26px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Para la única campeona<br>del juego que no puede hablar</p>
    </div>
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="08 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Sona_35.jpg', 'Sona Guardiana Estelar', 'center 22%')}
    ${glow('50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Dieciséis años de la Virtuosa')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${ETWAHL};">Sona</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${PLATA};">GIGI EASY</div>
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
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.28 }, 0.68);
  });

  // Las tres de lore comparten molde: arte, frase y remate, en ese orden.
  function lore(tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(s.querySelector('[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.84)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.12);
  }
  animar('El instrumento', lore);
  animar('Se quedó', function (tl, s) {
    lore(tl, s);
    tl.from(s.querySelector('[data-callback]'), { scale: 0.86, opacity: 0, duration: 0.45, ease: 'back.out(1.8)' }, 1.34);
  });

  // El contexto entra primero y la frase grande después, en dos golpes.
  animar('El delito', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(s.querySelector('[data-contexto]'), { y: 20, opacity: 0, duration: 0.45 }, 0.8)
      .from(q(s, '[data-remate] span'), { y: 34, opacity: 0, duration: 0.55, stagger: 0.24 }, 1.0);
  });

  // El emblema cae grande; la comparación con Katarina llega al final.
  animar('El OTP', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-emblema]'), { y: -34, scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.12)
      .from(q(s, '[data-rango]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.46)
      .from(s.querySelector('[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.7)
      .from(q(s, '[data-fichas] > div'), { y: 22, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.96)
      .from(q(s, '[data-lado]'), { y: 20, opacity: 0, duration: 0.42, stagger: 0.14 }, 1.24);
    cuentaMil(tl, s.querySelector('[data-cifra] [data-cuenta]'), 0.72, 0.85);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-ulti]'), { y: 30, scale: 0.97, opacity: 0, duration: 0.65 }, 0.12)
      .from(s.querySelector('[data-sello]'), { x: -24, opacity: 0, duration: 0.45, ease: 'back.out(2)' }, 0.6)
      .from(q(s, '[data-skin]'), { y: 20, opacity: 0, duration: 0.36, stagger: 0.055 }, 0.76)
      .from(s.querySelector('[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 1.24);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.24, 0.55);
  });

  // El nombre llega después de ver la skin, y la traducción justo detrás.
  animar('Silent Night', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-pieza]'), { y: 30, opacity: 0, duration: 0.65 }, 0.12)
      .from(s.querySelector('[data-pieza] img'), { scale: 1.06, duration: 1.1, ease: 'power2.out' }, 0.12)
      .from(s.querySelector('[data-nombre]'), { y: 30, opacity: 0, duration: 0.6 }, 0.8)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.2);
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
<title>Sona cumple 16 años</title>
${kit.og({ titulo: "Sona cumple 16 años", descripcion: "La campeona más musical del juego no puede hablar, y su instrumento es justo lo que la delataría en el país que caza magos. Su única voz es su único delito. Apoyo visual para TikTok.", carpeta: "sona" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(92,207,200,0.45); border-radius: 999px;
    background: rgba(7,11,20,0.85); color: ${ETWAHL}; cursor: pointer;
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
