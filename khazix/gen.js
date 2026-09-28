// Generador de index.html — Kha'Zix cumple 14 años (screenshots para TikTok)
// Ejecutar: node khazix/gen.js
//
// Serie «Cumplelolero» #20, animado. Mismo criterio que samira, sona y vex:
// **pocas láminas, arte real y nada dibujado**. Sin motivo gráfico propio.
//
// **El lore no tiene historia, tiene una sola noche**, y es toda sobre Rengar.
// Por eso el bloque de lore es el único de la serie que se cuenta con arte
// oficial **de los dos juntos**: el salto, la pelea y el cara a cara.
//
// De dónde sale cada imagen:
//  · Splashes de Kha'Zix y de Rengar — Data Dragon (1215×717; CommunityDragon
//    no tiene versión más grande de estos).
//  · **Wiki oficial**: *Kha'Zix Rengar Adaptation* (Rengar le cae encima),
//    *Rengar vs Kha'Zix Promo* (**vertical, 1591×2400**: la única del repo que
//    ya viene en formato TikTok, va a sangre en la lámina de la pelea) y
//    *Masters of the Hunt Promo 01/02* (la pelea en la selva y el cara a cara).
//  · `rengar-ojo.jpg` es un recorte de la cara del splash original de Rengar,
//    donde se ve la pieza de metal que le tapa el ojo.
//  · Íconos de la pasiva y del salto — Data Dragon. Son de 64 px, que es su
//    tamaño nativo en el juego, así que se pintan a 96 y no más.
//  · Emblemas de CommunityDragon a 500 px, recortados a su bbox.
//
// ⚠️ **El ojo está verificado por Riot, no es interpretación.** La investigación
// lo marcaba como «lectura razonable, no textual», pero la biografía oficial
// de Rengar en es-MX dice que persigue a Kha'Zix, «la criatura del vacío que le
// arrancó el ojo». Por eso la lámina del remate lo afirma.
//
// ⚠️ **Nombres oficiales en es_MX, distintos a la investigación**: el título es
// **«el Saqueador del Vacío»** (no «Segador») y Death Blossom es **«Pétalo
// Mortal»** (no «Flor de la Muerte»). El guion no nombra ninguna de las dos,
// así que en pantalla van las oficiales.
//
// ⚠️ **Cumplió el 26, no el 27**: la investigación lo corrige y el guion ya dice
// «ayer cumplió», así que la portada dice «ayer».
//
// ⚠️ Los valores del buff salen de las notas del parche 26.19 de la
// investigación; no hay otra fuente en el repo para contrastarlos. En pantalla
// van solo los dos cambios que narra el guion (daño de la pasiva y rango del
// salto evolucionado); el del W evolucionado se queda fuera.
//
// ⚠️ Fuera porque el guion no los narra: que el OTP es **de LAN** (el guion no
// lo dice y la investigación deja la decisión abierta), su Yuumi y su Soraka al
// 13 %, la ventaja de 1,14× sobre el segundo del mundo, las referencias de Mecha
// a Metal Gear y Evangelion, que Riot los viste igual en Mecha y Guardián de las
// Arenas, y la medición de popularidad por puntos al año, que aquí además está
// rota (los puntos de maestría existen desde 2016).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Kha'Zix: el ojo del bicho, su caparazón y la sangre ───────────
// Su splash es violeta del Vacío sobre selva oscura, y lo más vivo son sus
// ojos, verde ácido. Ese verde es el acento; el violeta del caparazón va de
// estructura, y el rojo **solo donde hay sangre**: la suya, la primera vez que
// la probó, y el ojo de Rengar. El verde ácido también está en urgot, pero ahí
// va con rojo de traición sobre acero; aquí va con violeta, que ningún deck
// verde usa de apoyo.
const BG = '#07060C';        // la selva de noche
const OJO = '#86EE5A';       // el verde de sus ojos — acento
const VACIO = '#9C73E8';     // el violeta del caparazón — datos y estructura
const SANGRE = '#E5483E';    // la sangre y el ojo — solo esos dos momentos
const BONE = '#EEEDF3';      // texto principal
const MUTED = '#7E7A8C';     // texto secundario
const PANEL = '#110F1A';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = VACIO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}26 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo arte.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,6,12,0.14) 0%, rgba(7,6,12,0.38) 34%, rgba(7,6,12,0.92) 64%, rgba(7,6,12,0.99) 100%);"></div>
    </div>`;

// Arte apaisado entero sobre su copia borrosa, con la capa borrosa en archivo
// aparte de 360 px (la trampa del optimizador, ver samira).
const arte = (src, alt, alto = 513) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${VACIO}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

const eyebrow = (txt, color = VACIO) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(7,6,12,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(7,6,12,0.85);">${txt}</h2>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Ayer cumplio catorce anos Kha'Zix y llego a su cumpleanos buffeado." style="${seccion()}">
    ${portada('Khazix_0.jpg', "Kha'Zix, el Saqueador del Vacío", 'center 22%')}
    ${glow(OJO, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · ayer, 26 sep de 2012')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(7,6,12,0.88);"><span data-linea style="display: block;">KHA'ZIX</span><span data-linea style="display: block; color: ${OJO};">14 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${VACIO}; line-height: 1.3;">El Saqueador del Vacío</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Jungla · asesino · del Vacío</p>
    </div>
  </section>`);

// ── 2 · Llegó buffeado ───────────────────────────────────────────────────
// Los dos cambios que narra el guion, con el ícono real de cada habilidad, y
// abajo la frase de Riot, que es el chiste.
const buffs = [
  ['iconos/pasiva.png', 'Amenaza Invisible', 'daño de la pasiva', '17–136', '22–141'],
  ['iconos/salto.png', 'Salto evolucionado', 'rango extra', '+200', '+300'],
];
slides.push(`
  <section data-label="Buff" data-screen-label="02 · Llegó buffeado" data-speaker-notes="En el parche de esta semana le subieron el dano de la pasiva y le subieron el rango del salto evolucionado de doscientos a trescientos. Y la razon que dio Riot es la mejor parte. Dicen que lo buffearon porque quedo al margen del meta. O sea que le festejaron el cumpleanos admitiendo que lo tenian olvidado." style="${seccion()}">
    ${glow(OJO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Parche 26.19 · esta semana', OJO)}
      ${titulo('Llegó a su<br>cumpleaños ' + c('buffeado', OJO), 112)}
      <div data-buffs style="margin-top: 40px; width: 100%; display: flex; flex-direction: column; gap: 16px;">
        ${buffs.map(([ico, nombre, que, antes, ahora]) => `
        <div data-buffito style="display: flex; align-items: center; gap: 24px; padding: 22px 28px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid ${OJO}4D; text-align: left;">
          <img src="assets/${ico}" alt="${nombre}" style="width: 96px; height: 96px; flex: none; border-radius: 12px; border: 2px solid ${VACIO}99; display: block;">
          <div style="flex: 1;">
            <div style="font-size: 30px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${que}</div>
          </div>
          <div style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; white-space: nowrap;"><span style="color: ${MUTED};">${antes}</span> <span style="color: ${MUTED}; font-size: 40px;">→</span> <span style="color: ${OJO};">${ahora}</span></div>
        </div>`).join('')}
      </div>
      <div data-cita style="margin-top: 38px;">
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">La razón de Riot</div>
        <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 88px; line-height: 0.92; color: ${BONE};">«Quedó al margen<br>del meta»</div>
        <div style="margin-top: 14px; font-size: 31px; font-weight: 600; color: ${OJO};">O sea: lo tenían olvidado</div>
      </div>
    </div>
  </section>`);

// ── 3 · Una sola noche ───────────────────────────────────────────────────
// Solo tipografía: es el gancho del bloque de lore, y el arte de la noche
// viene en las tres láminas siguientes.
slides.push(`
  <section data-label="Una noche" data-screen-label="03 · Lore · una sola noche" data-speaker-notes="Y su lore es cortito, porque este no tiene historia. Tiene una sola noche. Kha'Zix llego a este mundo fragil y hambriento. Se fue a cazar a las criaturas mas peligrosas que habia, arriesgando la vida a proposito. Cada presa lo hacia mas fuerte y mas rapido, y se creyo invencible. El lore lo dice asi, que su agresividad lo llevo a sentirse omnipotente." style="${seccion()}">
    ${glow(VACIO, '50% 45%', '100% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div data-golpe style="font-family: ${DISPLAY}; font-size: 128px; line-height: 0.9; text-transform: uppercase; color: ${MUTED};">No tiene<br>historia.</div>
      <div data-golpe style="margin-top: 36px; font-family: ${DISPLAY}; font-size: 170px; line-height: 0.86; text-transform: uppercase; color: ${BONE};">Tiene una<br>${c('sola noche.', OJO)}</div>
      <div data-golpe style="margin-top: 60px; max-width: 800px;">
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${VACIO};">Antes de esa noche, dice su lore</div>
        <div style="margin-top: 10px; font-size: 36px; font-weight: 600; color: ${BONE}; line-height: 1.3;">«Su agresividad lo llevó a sentirse omnipotente»</div>
      </div>
    </div>
  </section>`);

// ── 4 · Algo le saltó encima ─────────────────────────────────────────────
slides.push(`
  <section data-label="El salto" data-screen-label="04 · Algo le saltó encima" data-speaker-notes="Hasta que un dia, mientras se saboreaba una presa fresca, algo le salto encima de entre la maleza y lo tiro al suelo. Le rugio en la cara y lo rajo, y ahi Kha'Zix probo su propia sangre por primera vez en su vida. Y Kha'Zix le contesto rajandole el ojo." style="${seccion()}">
    ${glow(SANGRE, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('De entre la maleza')}
      ${arte('ataque.jpg', "Rengar le cae encima a Kha'Zix, arte oficial")}
      <div data-texto style="margin-top: 36px;">
        ${titulo('Probó su propia sangre<br>' + c('por primera vez', SANGRE), 96)}
      </div>
      <div data-remate style="margin-top: 30px; font-family: ${DISPLAY}; font-size: 76px; line-height: 1; color: ${BONE};">Y le rajó ${c('el ojo', SANGRE)}</div>
    </div>
  </section>`);

// ── 5 · Del atardecer al amanecer ────────────────────────────────────────
// El único arte vertical del repo, así que va a sangre, de arriba abajo, y el
// texto entra abajo sobre un degradado.
slides.push(`
  <section data-label="La pelea" data-screen-label="05 · Del atardecer al amanecer" data-speaker-notes="Pelearon del atardecer al amanecer, los dos quedaron al borde de la muerte y se separaron de mala gana. Y lo que sintio Kha'Zix mientras se le cerraban las heridas no fue miedo. Fue emocion, porque por fin encontro a alguien que aguantara la fuerza del Vacio." style="${seccion('align-items: center; text-align: center; justify-content: flex-end;')}">
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-fondo style="position: absolute; inset: 0; background-image: url('assets/noche.jpg'); background-size: cover; background-position: center 30%;" role="img" aria-label="Rengar contra Kha'Zix, ilustración oficial"></div>
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,6,12,0) 30%, rgba(7,6,12,0.55) 55%, rgba(7,6,12,0.96) 80%, rgba(7,6,12,1) 100%);"></div>
    </div>
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Del atardecer al amanecer')}
      <div data-texto style="font-family: ${DISPLAY}; font-size: 110px; line-height: 0.9; text-transform: uppercase;">
        <span style="display: block; color: ${MUTED};">No sintió miedo.</span>
        <span style="display: block; color: ${OJO};">Sintió emoción.</span>
      </div>
      <p data-remate style="margin: 26px 0 0; font-size: 32px; font-weight: 600; color: ${BONE}; line-height: 1.35;">Por fin alguien aguantaba<br>la fuerza del Vacío</p>
    </div>
  </section>`);

// ── 6 · Ese era Rengar ───────────────────────────────────────────────────
// El remate del lore: el cara a cara arriba y, encima, la cara de Rengar con
// el ojo tapado. Lo confirma la biografía oficial de Rengar.
slides.push(`
  <section data-label="Rengar" data-screen-label="06 · Ese era Rengar · el ojo" data-speaker-notes="Ese era Rengar. Y el ojo que Rengar trae tapado se lo dejo el." style="${seccion()}">
    ${glow(SANGRE, '50% 40%', '118% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${arte('cara-a-cara.jpg', "Rengar y Kha'Zix cara a cara, arte oficial")}
      <img data-ojo src="assets/rengar-ojo.jpg" alt="La cara de Rengar, con el ojo tapado" style="margin-top: -150px; position: relative; width: 330px; height: 330px; object-fit: cover; border-radius: 50%; border: 5px solid ${SANGRE}; box-shadow: 0 0 80px ${SANGRE}59, 0 0 0 12px ${BG}; display: block;">
      <div data-texto style="margin-top: 30px;">
        ${titulo('Ese era ' + c('Rengar', SANGRE), 132)}
      </div>
      <p data-remate style="margin: 22px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Y el ojo que trae tapado<br>${c('se lo dejó Kha\'Zix', SANGRE)}</p>
      <p data-fuente style="margin: 18px 0 0; font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Lo dice la biografía oficial de Rengar</p>
    </div>
  </section>`);

// ── 7 · El OTP ───────────────────────────────────────────────────────────
// La lámina del emblema grande de la serie, pero con la bajada: Diamante 2 este
// año y hoy Platino 1. Los dos emblemas reales, uno junto al otro.
slides.push(`
  <section data-label="El OTP" data-screen-label="07 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos del mundo, y este senor se puso ka seis en el nombre dos veces. Trae ocho millones ochocientos mil puntos y nivel de maestria seiscientos sesenta y cinco. Jugo mil cinco partidas esta temporada, novecientas sesenta y ocho con Kha'Zix. Y es Platino uno con cuarenta y nueve por ciento. Este ano habia llegado a Diamante dos, o sea que va para abajo." style="${seccion()}">
    ${glow(OJO, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El número uno del mundo')}

      <div data-nombre style="display: inline-flex; align-items: baseline; gap: 16px; padding: 14px 32px; border-radius: 999px; background: ${OJO}1A; border: 1px solid ${OJO}80;">
        <span style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; color: ${BONE};">K6DMK6</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${OJO};">el K6 dos veces</span>
      </div>

      <div data-cifra style="margin-top: 30px;">
        <div data-cuenta="8813090" style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.84; color: ${OJO}; text-shadow: 0 0 70px rgba(134,238,90,0.28);">8 813 090</div>
        <div style="margin-top: 6px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría · nivel 665</div>
      </div>

      <div data-caida style="margin-top: 36px; width: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px;">
        <div data-rango style="display: flex; flex-direction: column; align-items: center; opacity: 0.55;">
          <img src="assets/emblems/diamond.png" alt="Diamante" style="width: 200px; height: auto; display: block; filter: grayscale(0.6);">
          <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${BONE};">Diamante 2</div>
          <div style="font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">su pico de este año</div>
        </div>
        <div data-flecha style="font-family: ${DISPLAY}; font-size: 110px; line-height: 1; color: ${SANGRE};">→</div>
        <div data-rango style="display: flex; flex-direction: column; align-items: center;">
          <img src="assets/emblems/platinum.png" alt="Platino" style="width: 230px; height: auto; display: block; filter: drop-shadow(0 0 40px rgba(134,238,90,0.25));">
          <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 64px; line-height: 1; color: ${BONE};">Platino 1</div>
          <div style="font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${SANGRE};">hoy · va para abajo</div>
        </div>
      </div>

      <div data-fichas style="margin-top: 34px; width: 100%; display: flex; gap: 14px;">
        ${[['968', 'de 1 005 partidas'], ['49 %', 'de victorias']].map(([a, b]) => `
        <div style="flex: 1; padding: 18px 16px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${VACIO}40;">
          <div style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; color: ${BONE};">${a}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED};">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 8 · Las skins ────────────────────────────────────────────────────────
const comprables = [
  ['Khazix_1.jpg', 'Mecha', '1350', true],
  ['Khazix_2.jpg', 'Guardián de las Arenas', '975'],
  ['Khazix_3.jpg', 'Pétalo Mortal', '975'],
  ['Khazix_4.jpg', 'Estrella Oscura', '1350'],
  ['Khazix_60.jpg', 'Odisea', '1350'],
  ['Khazix_69.jpg', 'Guardián Lunar', '1350'],
];
slides.push(`
  <section data-label="Las skins" data-screen-label="08 · Las skins" data-speaker-notes="Y de skins tiene seis comprables, unos cincuenta y siete dolares, tres dias y medio de salario minimo." style="${seccion()}">
    ${glow(VACIO, '50% 28%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Seis a la venta')}
      <div data-rejilla style="width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
        ${comprables.map(([img, nombre, rp, mecha]) => `
        <div data-skin style="position: relative; border-radius: 14px; overflow: hidden; border: ${mecha ? '2px solid ' + OJO : '1px solid ' + VACIO + '40'};">
          <img src="assets/${img}" alt="Kha'Zix ${nombre}" style="width: 100%; height: 250px; object-fit: cover; object-position: center 26%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,6,12,0) 45%, rgba(7,6,12,0.93) 100%);"></div>
          <div style="position: absolute; left: 14px; right: 14px; bottom: 10px; text-align: left;">
            <div style="font-size: 22px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
            <div style="font-size: 18px; font-weight: 600; color: ${mecha ? OJO : VACIO};">${rp} RP${mecha ? ' · salió con él' : ''}</div>
          </div>
        </div>`).join('')}
      </div>
      <div data-precio style="margin-top: 26px; display: flex; align-items: center; justify-content: center; gap: 24px;">
        <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${OJO};">~<span data-cuenta="57">57</span> <span style="font-size: 44px;">USD</span></div>
        <div style="width: 2px; height: 58px; background: ${OJO}4D;"></div>
        <div style="text-align: left; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.35;">7 350 RP<br>3,5 días de salario</div>
      </div>
    </div>
  </section>`);

// ── 9 · Mecha ────────────────────────────────────────────────────────────
// El dato del episodio: la primera skin de lanzamiento a 1350, y con el
// paquete peor descontado. Verificado en Kha'Zix/Cosmetics de la wiki.
slides.push(`
  <section data-label="Mecha" data-screen-label="09 · Mecha · la primera a 1350" data-speaker-notes="Y ahi hay un dato que vale. La Mecha salio el mismo dia que el y fue la primera skin de lanzamiento que Riot puso a mil trescientos cincuenta errepes. Antes de esa, las de lanzamiento salian mas baratas. Y encima el paquete lo dejaron en novecientos setenta y cinco en vez del cincuenta por ciento de descuento que daban siempre. Asi que la primera vez que subieron el precio tambien bajaron el descuento." style="${seccion()}">
    ${glow(OJO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Salió el mismo día que él', OJO)}
      <div data-pieza style="position: relative; width: 100%; border-radius: 18px; overflow: hidden; border: 2px solid ${OJO}B3;">
        <img src="assets/Khazix_1.jpg" alt="Kha'Zix Mecha" style="width: 100%; height: 440px; object-fit: cover; object-position: center 30%; display: block;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,6,12,0) 50%, rgba(7,6,12,0.9) 100%);"></div>
        <div style="position: absolute; left: 24px; bottom: 16px; font-family: ${DISPLAY}; font-size: 68px; line-height: 1; color: ${BONE};">Kha'Zix Mecha</div>
      </div>
      <div data-texto style="margin-top: 32px;">
        ${titulo('La primera de lanzamiento<br>a ' + c('1350 RP', OJO), 96)}
      </div>
      <div data-fichas style="margin-top: 28px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${[['Subió el precio', 'antes salían más baratas', OJO], ['Bajó el descuento', 'paquete a 975, no al 50 %', SANGRE]].map(([a, b, col]) => `
        <div data-ficha style="padding: 20px 22px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid ${col}66;">
          <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${col};">${a}</div>
          <div style="margin-top: 4px; font-size: 20px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${MUTED}; line-height: 1.25;">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
// Con los dos en la selva: el cumpleaños es suyo, pero la historia es de dos.
slides.push(`
  <section data-label="Cierre" data-screen-label="10 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('pelea.jpg', "Rengar y Kha'Zix peleando en la selva, arte oficial", 'center 40%')}
    ${glow(OJO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Catorce años del Saqueador del Vacío')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${OJO};">Kha'Zix</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${VACIO};">GIGI EASY</div>
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

  // Los dos buffs entran en orden y la frase de Riot llega al final.
  animar('Buff', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-buffito]'), { x: -34, opacity: 0, duration: 0.45, stagger: 0.14 }, 0.46)
      .from(uno(s, '[data-cita]'), { y: 26, opacity: 0, duration: 0.55 }, 1.0);
  });

  // Tres golpes: no tiene historia, tiene una noche, y la cita del lore.
  animar('Una noche', function (tl, s) {
    tl.from(q(s, '[data-golpe]'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.4, ease: 'power3.out' }, 0.1);
  });

  // La sangre primero y el ojo después, con un golpe más seco.
  animar('El salto', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.1);
    tl.from(uno(s, '[data-texto]'), { y: 30, opacity: 0, duration: 0.55 }, 0.78)
      .from(uno(s, '[data-remate]'), { scale: 0.8, opacity: 0, duration: 0.42, ease: 'back.out(2)' }, 1.26);
  });

  // El arte vertical baja despacio, como una cámara que recorre la pelea.
  animar('La pelea', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { scale: 1.1, opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.5)
      .from(q(s, '[data-texto] span'), { y: 34, opacity: 0, duration: 0.55, stagger: 0.24 }, 0.66)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.45 }, 1.3);
  });

  // El cara a cara, y luego la cara de Rengar cae encima con el ojo tapado.
  animar('Rengar', function (tl, s) {
    entraArte(tl, s, 0);
    tl.from(uno(s, '[data-ojo]'), { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, 0.5)
      .from(uno(s, '[data-texto]'), { y: 28, opacity: 0, duration: 0.5 }, 0.86)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.45 }, 1.12)
      .from(uno(s, '[data-fuente]'), { opacity: 0, duration: 0.4 }, 1.36);
  });

  // La cifra sube, y luego la caída de Diamante a Platino se lee de izquierda a
  // derecha: primero lo que tuvo, después la flecha, después lo que tiene.
  animar('El OTP', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-nombre]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.1)
      .from(uno(s, '[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.34)
      .from(q(s, '[data-rango]')[0], { y: 24, opacity: 0, duration: 0.42 }, 0.86)
      .from(uno(s, '[data-flecha]'), { x: -30, opacity: 0, duration: 0.35 }, 1.06)
      .from(q(s, '[data-rango]')[1], { y: -24, opacity: 0, duration: 0.42, ease: 'back.out(1.6)' }, 1.2)
      .from(q(s, '[data-fichas] > div'), { y: 20, opacity: 0, duration: 0.36, stagger: 0.08 }, 1.36);
    cuentaMil(tl, uno(s, '[data-cifra] [data-cuenta]'), 0.36, 0.85);
  });

  animar('Las skins', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-skin]'), { y: 24, scale: 0.95, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.14)
      .from(uno(s, '[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 0.86);
    cuentaMil(tl, uno(s, '[data-precio] [data-cuenta]'), 0.86, 0.6);
  });

  // Primero la skin, luego el dato, y las dos consecuencias una tras otra.
  animar('Mecha', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-pieza]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(uno(s, '[data-pieza] img'), { scale: 1.06, duration: 1.1, ease: 'power2.out' }, 0.1)
      .from(uno(s, '[data-texto]'), { y: 28, opacity: 0, duration: 0.55 }, 0.7)
      .from(q(s, '[data-ficha]'), { y: 22, opacity: 0, duration: 0.42, stagger: 0.2 }, 1.1);
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
<title>Kha'Zix cumple 14 años</title>
${kit.og({ titulo: "Kha'Zix cumple 14 años", descripcion: "Llegó a su cumpleaños buffeado porque Riot lo tenía olvidado, su lore es una sola noche contra Rengar, y el ojo que Rengar trae tapado se lo dejó él. Apoyo visual para TikTok.", carpeta: "khazix" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(134,238,90,0.45); border-radius: 999px;
    background: rgba(7,6,12,0.85); color: ${OJO}; cursor: pointer;
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
