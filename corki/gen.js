// Generador de index.html — Corki cumple 17 años (screenshots para TikTok)
// Ejecutar: node corki/gen.js
//
// Serie «Cumplelolero» #16, animado. **Mismo corte que katarina por encargo**:
// portada, one trick, rangos, skins, bóveda y cierre, todo centrado y con poco
// texto, porque las láminas son assets para cortar encima de la voz. El lore
// (el piloto de guerra jubilado a la fuerza) se narra sin apoyo escrito.
//
// Dos láminas que katarina no tenía, y las dos las pide el guion:
//  · **El ROFL Copter**, que es el dato del episodio y abre el video.
//  · **La comparativa contra Katarina**, que es el cierre del guion: salieron
//    el mismo día hace diecisiete años y a uno le fue la mitad de bien.
//
// ⚠️ **El cumpleaños fue AYER**: Corki salió el 19/09/2009 (parche 0.9.25.21),
// el mismo día que Katarina, y el video se graba el 20. La portada dice
// «ayer cumplió».
//
// ── La referencia del meme, verificada ──────────────────────────────────
// El guion afirma que el nombre está «en la biografía oficial de Riot». Es
// cierto y sigue vivo hoy: la bio de Corki en universe.leagueoflegends.com
// dice textualmente «the original design for the Reconnaissance Operations
// Front-Line Copter, an aerial assault vehicle which has become the backbone
// of the Bandle City Expeditionary Force». R-O-F-L.
// La wiki lo confirma como chiste deliberado en `Corki/Trivia`: «In his
// original lore, Corki flew a Reconnaissance Operations Front Line (ROFL)
// Copter that was built by Heimerdinger. **The name was a reference to the
// ROFLcopter meme.**»
// Y el meme es anterior al campeón: roflcopter.com se registró el 30 de marzo
// de 2004 con el GIF del helicóptero ASCII de aspas ROFL/LOL, y el «my
// roflcopter goes soi soi soi» salió el 10 de julio de 2006. El ASCII de la
// lámina 2 es ese helicóptero.
//
// ⚠️ Dos datos verificados que **quedan fuera porque el guion no los narra**:
//  · La wiki dice que Corki fue **el primer campeón con dos skins legendarias
//    y el primero con tres**, y que ninguna de ellas se puede comprar. Refuerza
//    el bloque de bóveda, pero el guion dice «dos legendarias» y meter el
//    récord ahí le robaría el remate.
//  · El bloque LATAM (cinco en el top 50, GEOANIMADOS #6 del mundo desde el
//    servidor del sur). El guion lo salta a propósito: este episodio es «al
//    revés que el de ayer», el uno es europeo.
//
// ⚠️ El rango sale **del guion, no de la investigación**: la investigación
// marca el perfil de op.gg del OTP como pendiente. Esmeralda 4, pico Diamante 2
// y 8+ de farmeo por minuto son lo que narra la voz.
//
// Paleta: ver más abajo. La novedad del deck es que el **acento es frío**.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Corki: el hangar y la bengala ─────────────────────────────────
// El splash original es todo humo, latón y noche violácea — muestreado no da
// ni un color frío. El frío sale de **Trineo de Hielo** (hue 199 dominante),
// que además es una de las dos legendarias encerradas de las que habla el
// episodio. Y va de acento, no de apoyo: la historia del deck es el piloto al
// que **jubilaron**, así que manda el acero y el fuego es lo que perdió.
// Esa inversión es lo que lo separa de briar (azul frío de estructura bajo un
// carmín de acento) y de missfortune (cobre de acento sobre teal de apoyo).
const BG = '#090C11';        // noche de hangar
const ACERO = '#5FA8CE';     // azul de aviación — acento
const BENGALA = '#F2682A';   // el fuego del combate: bóveda, pérdidas y remates
const BONE = '#ECEFF2';      // texto principal
const MUTED = '#79838D';     // texto secundario
const PANEL = '#101720';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;
const MONO = `'Courier New', ui-monospace, monospace`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

// Todas las láminas van centradas, igual que katarina.
const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = ACERO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash.
// La capa borrosa sangra fuera del marco: va en un contenedor con overflow
// oculto o infla scrollHeight y el QA marca un desborde falso.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,12,17,0.14) 0%, rgba(9,12,17,0.38) 34%, rgba(9,12,17,0.92) 64%, rgba(9,12,17,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = ACERO) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(9,12,17,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// ── El rotor: el motivo del deck ─────────────────────────────────────────
// Tres palas en cuña y el disco que barren. **Tres y no cuatro a propósito**:
// con cuatro palas rectas a noventa grados el dibujo se lee como una mira de
// francotirador, no como un rotor. Tres en ángulo impar leen rotación solas.
// Siempre entra igual: llega girando y frena en su sitio.
const rotor = (tam = 120, color = ACERO) => `
    <svg viewBox="0 0 120 120" width="${tam}" height="${tam}" style="flex: none; display: block; overflow: visible; filter: drop-shadow(0 0 ${Math.round(tam * 0.22)}px ${color}73);" aria-hidden="true">
      <circle data-disco cx="60" cy="60" r="53" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4 11" opacity="0.45"/>
      <g data-rotor>
        ${[0, 120, 240].map((g) => `<path d="M62 56 L102 48 Q114 52 114 60 Q114 68 102 72 L62 64 Z" fill="${color}" transform="rotate(${g} 60 60)"/>`).join('')}
        <circle cx="60" cy="60" r="13" fill="${color}"/>
        <circle cx="60" cy="60" r="5.5" fill="${BG}"/>
      </g>
    </svg>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Ayer cumplio diecisiete anos Corki el mismo dia que Katarina y les voy a soltar el dato que nadie sabe de este wey." style="${seccion()}">
    ${portada('Corki_0.jpg', 'Corki, el Bombardero Osado', 'center 26%')}
    ${glow(ACERO, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · ayer, 19 sep de 2009')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(9,12,17,0.88);"><span data-linea style="display: block;">CORKI</span><span data-linea style="display: block; color: ${ACERO};">17 AÑOS</span></h1>
      <p data-sub style="margin: 30px 0 0; font-size: 38px; font-weight: 500; color: ${BENGALA}; line-height: 1.3;">El Bombardero Osado</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Mid · Bandle City · radicado en Piltóver</p>
      <div data-sub style="margin-top: 38px;">${rotor(148)}</div>
    </div>
  </section>`);

// ── 2 · El ROFL Copter ───────────────────────────────────────────────────
// La pieza del deck y el que abre el video. El acrónimo va en vertical porque
// así la columna R-O-F-L se lee sola, sin tener que subrayar nada; y debajo va
// el helicóptero ASCII original, que es de dónde salió el chiste.
const acronimo = [
  ['R', 'ECONNAISSANCE'],
  ['O', 'PERATIONS'],
  ['F', 'RONT-'],
  ['L', 'INE COPTER'],
];

// El helicóptero ASCII de roflcopter.com (2004): aspas de ROFL/LOL arriba y el
// rotor de cola a la izquierda, que son los dos rasgos que lo hacen reconocible.
// ⚠️ Va en un `<pre>` **alineado a la izquierda** dentro de un inline-block: la
// lámina entera lleva `text-align: center` y eso centra cada renglón por
// separado, lo que desarma el dibujo. El inline-block es lo que lo vuelve a
// centrar como bloque sin tocar la alineación interna.
// Rejilla: el mástil, el centro del fuselaje y el eje del aspa caen en la
// columna 11; las patas, en la 8 y la 14.
const ascii = [
  '           |',
  ' L    /---------\\',
  'LOL===[  o   o  ]',
  ' L    \\---------/',
  '        |     |',
  '     ---\'-----\'---',
].join('\n');

slides.push(`
  <section data-label="ROFL Copter" data-screen-label="02 · ROFL Copter" data-speaker-notes="Su helicoptero tiene nombre oficial en la biografia de Riot. Se llama Reconnaissance Operations Front Line Copter. O sea R O F L. ROFL Copter. Riot le metio un meme de internet al lore oficial y ahi lleva diecisiete anos sin que nadie se los quite." style="${seccion()}">
    ${glow(BENGALA, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El dato que nadie sabe', BENGALA)}
      ${titulo('Su helicóptero<br>tiene <span style="color: ' + BENGALA + ';">nombre oficial</span>', 86)}

      <div data-acronimo style="margin-top: 30px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px;">
        ${acronimo.map(([ini, resto]) => `
        <div data-fila style="display: flex; align-items: baseline; gap: 16px;">
          <span style="width: 74px; text-align: center; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.96; color: ${BENGALA}; text-shadow: 0 0 40px ${BENGALA}59;">${ini}</span>
          <span style="font-family: ${DISPLAY}; font-size: 60px; line-height: 0.96; letter-spacing: 1px; color: ${BONE};">${resto}</span>
        </div>`).join('')}
      </div>

      <div data-terminal style="margin-top: 32px; width: 100%; border-radius: 14px; background: ${PANEL}E6; border: 1px solid ${ACERO}3D; padding: 26px 0 24px;">
        <pre style="display: inline-block; text-align: left; margin: 0; font-family: ${MONO}; font-size: 40px; font-weight: 700; line-height: 1.24; color: ${ACERO};"><span data-helice style="display: block; color: ${BENGALA};">ROFL:ROFL:LOL:ROFL:ROFL</span>${ascii}</pre>
      </div>

      <p data-pie style="margin: 20px 0 0; font-size: 25px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">El meme es de 2004. La biografía de Riot lo dice <span style="color: ${BONE};">desde 2009 y sigue ahí</span>.</p>
    </div>
  </section>`);

// ── 3 · El OTP ───────────────────────────────────────────────────────────
// Mismo molde que la lámina 2 de katarina, pero al revés: ayer el uno era
// latino, hoy es europeo. La chapa entra antes que la cifra.
slides.push(`
  <section data-label="El OTP" data-screen-label="03 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos y este es justo al reves del de ayer. Es un europeo con siete millones doscientos mil puntos. Y de pilon se puso de nombre Olivia Colman, que es una actriz britanica de verdad, ganadora del Oscar." style="${seccion()}">
    ${glow(ACERO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Justo al revés que ayer')}
      ${titulo('El número uno<br>del mundo <span style="color: ' + ACERO + ';">es europeo</span>', 96)}

      <div data-servidor style="margin-top: 34px; display: inline-flex; align-items: center; gap: 18px; padding: 16px 34px; border-radius: 999px; background: ${ACERO}1F; border: 1px solid ${ACERO}80;">
        <span style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${ACERO};">#1</span>
        <span style="font-size: 27px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${BONE};">Europa Oeste</span>
      </div>

      <div data-cifra style="margin-top: 34px;">
        <div data-cuenta="7273626" style="font-family: ${DISPLAY}; font-size: 160px; line-height: 0.84; color: ${BONE}; text-shadow: 0 0 70px rgba(95,168,206,0.35);">7 273 626</div>
        <div style="margin-top: 6px; font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div data-fichas style="margin-top: 38px; display: flex; gap: 16px;">
        ${[['OLIVIA COLMAN', 'sí, la actriz del Óscar'], ['EUW', 'europa oeste'], ['1,11×', 'sobre el #2 — lo más apretado de la serie']].map(([a, b]) => `
        <div style="flex: 1; padding: 22px 22px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(95,168,206,0.28);">
          <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${ACERO};">${a}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 4 · Los rangos ───────────────────────────────────────────────────────
// La lámina es el contraste con ayer: el mismo emblema enorme de katarina,
// pero esta vez es Esmeralda. Por eso el Hierro de ayer vuelve a salir abajo,
// pequeño y en gris — es lo que el guion pide recordar.
slides.push(`
  <section data-label="Los rangos" data-screen-label="04 · Los rangos" data-speaker-notes="Acuerdense que ayer les dije que el numero uno de Katarina andaba en Hierro. Pues este anda en Esmeralda cuatro y llego a Diamante dos, y al chile juega bien el cabron, trae mas de ocho de farmeo por minuto." style="${seccion()}">
    ${glow(ACERO, '50% 32%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Y este sí juega')}

      <img data-emblema src="assets/emblems/emerald.png" alt="Esmeralda" style="width: 380px; height: auto; display: block; filter: drop-shadow(0 0 70px rgba(95,168,206,0.32)) brightness(1.08);">
      <div data-rango style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.88; color: ${BONE};">ESMERALDA 4</div>

      <div data-tarjetas style="margin-top: 32px; width: 100%; display: flex; gap: 16px;">
        <div style="flex: 1; display: flex; align-items: center; gap: 18px; padding: 20px 24px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(95,168,206,0.26);">
          <img src="assets/emblems/diamond.png" alt="Diamante" style="width: 116px; height: auto; display: block; flex: none; filter: brightness(1.08);">
          <div style="text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 0.96; color: ${ACERO};">Diamante 2</div>
            <div style="margin-top: 2px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">su pico histórico</div>
          </div>
        </div>
        <div style="flex: none; width: 282px; padding: 22px 24px; border-radius: 16px; background: ${BENGALA}14; border: 1px solid ${BENGALA}59;">
          <div style="font-family: ${DISPLAY}; font-size: 82px; line-height: 0.96; color: ${BENGALA};">8,0+</div>
          <div style="margin-top: 2px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.2;">de farmeo por minuto</div>
        </div>
      </div>

      <div data-ayer style="margin-top: 30px; display: inline-flex; align-items: center; gap: 18px; padding: 14px 28px 14px 18px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);">
        <img src="assets/emblems/iron.png" alt="Hierro" style="width: 74px; height: auto; display: block; filter: grayscale(1) brightness(0.9);">
        <div style="text-align: left;">
          <div style="font-size: 28px; font-weight: 700; color: ${MUTED}; line-height: 1.15;">Ayer, el número uno de Katarina</div>
          <div style="font-size: 24px; font-weight: 600; color: #5C646C;">Hierro 1 · doce millones de puntos</div>
        </div>
      </div>
    </div>
  </section>`);

// ── 5 · Las skins ────────────────────────────────────────────────────────
// Seis comprables, tres por fila. En es_MX la de 2025 no se llama «Brick Toy»:
// se llama **Corki Pollo Volador**, y así va en pantalla.
const comprables = [
  ['Corki_5.jpg', 'Corki MontaUrfs', '975'],
  ['Corki_6.jpg', 'Ala de Dragón', '975'],
  ['Corki_8.jpg', 'Corki de Arcadia', '1350'],
  ['Corki_18.jpg', 'Corki Corgi', '1350'],
  ['Corki_26.jpg', 'AstroCorki', '1350'],
  ['Corki_36.jpg', 'Pollo Volador', '1350'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="05 · Las skins" data-speaker-notes="Y de skins tiene doce pero nada mas seis puedes comprar, unos cincuenta y siete dolares, tres dias y medio de salario minimo." style="${seccion()}">
    ${glow(ACERO, '50% 28%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Doce skins')}
      ${titulo('Pero solo <span style="color: ' + ACERO + ';">6 a la venta</span>', 92)}

      <div data-rejilla style="margin-top: 28px; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
        ${comprables.map(([img, nombre, rp]) => `
        <div data-skin style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid rgba(95,168,206,0.24);">
          <img src="assets/${img}" alt="Corki ${nombre}" style="width: 100%; height: 268px; object-fit: cover; object-position: center 24%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,12,17,0) 44%, rgba(9,12,17,0.93) 100%);"></div>
          <div style="position: absolute; left: 12px; right: 12px; bottom: 10px; text-align: left;">
            <div style="font-size: 20px; font-weight: 700; color: ${BONE}; line-height: 1.12;">${nombre}</div>
            <div style="font-size: 18px; font-weight: 600; color: ${ACERO};">${rp} RP</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 26px; display: flex; align-items: center; justify-content: center; gap: 24px;">
        <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${ACERO};">~<span data-cuenta="57">57</span> <span style="font-size: 44px;">USD</span></div>
        <div style="width: 2px; height: 58px; background: ${ACERO}4D;"></div>
        <div style="text-align: left; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.35;">7 350 RP · 3,5 días de salario<br>las otras seis, fuera de tienda</div>
      </div>
    </div>
  </section>`);

// ── 6 · La bóveda ────────────────────────────────────────────────────────
// El remate del bloque de skins: las dos legendarias a color entran y se
// apagan al caer los sellos. El número grande es el cero.
const encerradas = [
  ['Corki_2.jpg', 'Trineo de Hielo', '1820 RP · 12 feb 2010'],
  ['Corki_3.jpg', 'Barón Rojo', '1820 RP · 24 mar 2010'],
];

slides.push(`
  <section data-label="La bóveda" data-screen-label="06 · La bóveda" data-speaker-notes="Pero wachen la tragedia. Corki tiene dos legendarias y las dos estan encerradas en la boveda. Salieron en dos mil diez y ninguna la puedes conseguir hoy." style="${seccion()}">
    ${glow(BENGALA, '50% 32%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Pero wachen la tragedia', BENGALA)}

      <div data-piezas style="width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        ${encerradas.map(([img, nombre, pie]) => `
        <div data-pieza style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${BENGALA}59;">
          <img src="assets/${img}" alt="Corki ${nombre}" style="width: 100%; height: 400px; object-fit: cover; object-position: center 22%; display: block; filter: saturate(0.42) brightness(0.66);">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,12,17,0.08) 38%, rgba(9,12,17,0.94) 100%);"></div>
          <div data-sello style="position: absolute; top: 16px; left: 16px; background: ${BENGALA}; color: ${BG}; font-size: 19px; font-weight: 800; letter-spacing: 2px; border-radius: 8px; padding: 7px 14px;">EN BÓVEDA</div>
          <div style="position: absolute; left: 20px; right: 20px; bottom: 16px; text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 0.98; color: ${BONE};">${nombre}</div>
            <div style="margin-top: 2px; font-size: 21px; font-weight: 600; color: ${BENGALA};">${pie}</div>
          </div>
        </div>`).join('')}
      </div>

      <div data-cero style="margin-top: 38px;">
        <div style="font-family: ${DISPLAY}; font-size: 190px; line-height: 0.8; color: ${BENGALA};">0</div>
        <div style="margin-top: 10px; font-size: 32px; font-weight: 500; color: ${MUTED}; line-height: 1.35;">legendarias que puedas comprar hoy</div>
      </div>
    </div>
  </section>`);

// ── 7 · Corki contra Katarina ────────────────────────────────────────────
// El cierre del guion. Va en dos columnas con las dos caras arriba: el dato no
// es ninguna cifra suelta, es que la columna de la derecha pierde cinco veces.
const duelo = [
  ['puntos del #1 del mundo', '12 367 424', '7 273 626'],
  ['skins totales', '20', '12'],
  ['skins comprables', '11', '6'],
  ['días de salario mínimo', '6,3', '3,5'],
  ['legendarias a la venta', '1', '0'],
];

slides.push(`
  <section data-label="Contra Katarina" data-screen-label="07 · Contra Katarina" data-speaker-notes="Y para cerrar. Corki y Katarina salieron el mismo dia hace diecisiete anos. Ella tiene veinte skins y el doce. El otepe de ella lleva doce millones de puntos y el de el siete. Mismo cumpleanos, misma edad, y a uno le fue la mitad de bien que al otro." style="${seccion()}">
    ${glow(BENGALA, '50% 36%', '118% 54%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Mismo día, hace 17 años', BENGALA)}

      <div data-cabezas style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['Katarina_0.jpg', 'Katarina', MUTED, 'center 14%'], ['Corki_0.jpg', 'Corki', ACERO, 'center 26%']].map(([img, nombre, color, pos]) => `
        <div data-cabeza style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${color}4D;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 196px; object-fit: cover; object-position: ${pos}; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,12,17,0) 40%, rgba(9,12,17,0.94) 100%);"></div>
          <div style="position: absolute; left: 0; right: 0; bottom: 10px; font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${color};">${nombre}</div>
        </div>`).join('')}
      </div>

      <div data-tabla style="margin-top: 18px; width: 100%; display: flex; flex-direction: column; gap: 19px;">
        ${duelo.map(([etiqueta, kat, cor]) => `
        <div data-fila style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch;">
          <div style="padding: 13px 18px; border-radius: 12px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07);">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${MUTED};">${kat}</div>
          </div>
          <div style="padding: 13px 18px; border-radius: 12px; background: ${BENGALA}12; border: 1px solid ${BENGALA}45;">
            <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${BENGALA};">${cor}</div>
          </div>
          <div style="grid-column: 1 / -1; margin-top: -3px; font-size: 20px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #5C646C;">${etiqueta}</div>
        </div>`).join('')}
      </div>

      <p data-remate style="margin: 26px 0 0; font-size: 33px; font-weight: 600; color: ${BONE}; line-height: 1.32;">Misma edad, mismo cumpleaños,<br><span style="color: ${BENGALA};">y a uno le fue la mitad de bien</span>.</p>
    </div>
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
// Va con el Barón Rojo: es el as de la aviación, y es una de las dos que ya no
// se pueden comprar.
slides.push(`
  <section data-label="Cierre" data-screen-label="08 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Corki_3.jpg', 'Corki Barón Rojo', 'center 24%')}
    ${glow(ACERO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Diecisiete años del Bombardero Osado')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${ACERO};">Corki</span></h2>
      <div style="margin-top: 40px;">${rotor(172)}</div>
      <div data-gigi style="margin-top: 44px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${BENGALA};">GIGI EASY</div>
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

  // El rotor siempre entra igual: llega girando y frena en su sitio.
  function gira(tl, s, pos) {
    var r = s.querySelector('[data-rotor]');
    if (!r) return;
    tl.from(s.querySelector('[data-disco]'), { scale: 0.45, opacity: 0, svgOrigin: '60 60', duration: 0.6 }, pos)
      .from(r, { rotation: -340, scale: 0.55, opacity: 0, svgOrigin: '60 60', duration: 0.85, ease: 'power3.out' }, pos);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 52, opacity: 0, duration: 0.78, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.64);
    gira(tl, s, 0.9);
  });

  // El acrónimo baja letra por letra para que la columna ROFL se arme a la
  // vista; el ASCII entra después y la línea de las aspas, al final.
  animar('ROFL Copter', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-acronimo] [data-fila]'), { x: -34, opacity: 0, duration: 0.42, stagger: 0.12 }, 0.4)
      .from(s.querySelector('[data-terminal]'), { y: 26, opacity: 0, duration: 0.55 }, 1.0)
      .from(s.querySelector('[data-helice]'), { opacity: 0, scaleX: 0.5, duration: 0.45, ease: 'power2.out' }, 1.24)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.45 }, 1.34);
  });

  animar('El OTP', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-servidor]'), { scale: 0.86, opacity: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.38)
      .from(s.querySelector('[data-cifra]'), { y: 28, opacity: 0, duration: 0.55 }, 0.62)
      .from(q(s, '[data-fichas] > div'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.1 }, 1.06);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.64, 0.9);
  });

  // El emblema cae primero y grande, igual que en katarina — y el Hierro de
  // ayer llega al final, cuando ya se vio el Esmeralda.
  animar('Los rangos', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-emblema]'), { y: -34, scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.14)
      .from(s.querySelector('[data-rango]'), { y: 26, opacity: 0, duration: 0.5 }, 0.5)
      .from(q(s, '[data-tarjetas] > div'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.82)
      .from(s.querySelector('[data-ayer]'), { y: 22, opacity: 0, duration: 0.5 }, 1.2);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 24, scale: 0.95, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.26)
      .from(s.querySelector('[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 1.02);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.02, 0.6);
  });

  // Las dos entran a color y se apagan al caer los sellos: se ve cómo las
  // encierran. El cero llega cuando ya están las dos grises.
  animar('La bóveda', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-pieza]'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.14 }, 0.14)
      .from(q(s, '[data-pieza] img'), { filter: 'saturate(1) brightness(1)', duration: 0.75, stagger: 0.14 }, 0.34)
      .from(q(s, '[data-sello]'), { y: -22, rotation: -8, opacity: 0, duration: 0.48, ease: 'back.out(2)', stagger: 0.14 }, 0.74)
      .from(s.querySelector('[data-cero]'), { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.16);
  });

  // Las filas caen por parejas: primero Katarina, después Corki, para que cada
  // renglón se lea como un marcador.
  animar('Contra Katarina', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-cabeza]'), { y: 24, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.12)
      .from(q(s, '[data-tabla] [data-fila]'), { y: 20, opacity: 0, duration: 0.38, stagger: 0.1 }, 0.5)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.12);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22);
    gira(tl, s, 0.66);
    tl.from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 1.1);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Corki cumple 17 años</title>
${kit.og({ titulo: "Corki cumple 17 años", descripcion: "Su helicóptero se llama Reconnaissance Operations Front-Line Copter: R-O-F-L. Riot le metió un meme de 2004 al lore oficial y ahí sigue. Apoyo visual para TikTok.", carpeta: "corki" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(95,168,206,0.45); border-radius: 999px;
    background: rgba(9,12,17,0.85); color: ${ACERO}; cursor: pointer;
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
