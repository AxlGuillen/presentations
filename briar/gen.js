// Generador de index.html — Briar cumple 3 años (screenshots para TikTok)
// Ejecutar: node briar/gen.js
//
// Serie «Cumplelolero» #13, animado. **Corte pedido: sin láminas de lore.** El
// guion tiene el bloque de lore más largo de la serie (la fabricaron, se comió
// a su cuidador, la celda, el aburrimiento), pero por encargo aquí no se
// desglosa en texto: en su lugar van **tres láminas de imagen** —el gólem, la
// Rosa Negra y la galería de skins— pensadas como material de apoyo para
// narrar el lore encima, y el peso escrito se va al one trick.
//
// ⚠️ **El cumpleaños fue AYER**, el 13 de septiembre. Briar salió el 13/09/2023,
// no el 14, así que la portada dice «ayer cumplió» y no «hoy cumple». Y el
// video de Kindred que se subió ayer iba adelantado: hoy es el cumple real de
// Kindred, no el de Briar.
//
// Piezas de diseño:
//  · **Este deck no tiene oro.** Es el único de la serie sin él: el dinero se
//    pinta con el mismo carmín de la hemomancia, porque el dato de las skins es
//    que es la más barata y no que valga mucho.
//  · Las tres láminas de imagen llevan **el texto al mínimo a propósito** —una
//    frase o un nombre— para que se puedan usar a pantalla completa mientras
//    corre la voz en off.
//  · La pieza es la lámina de **puntos por año**: Briar tiene tres años y su
//    otepé acumula al doble de velocidad que el de Riven. La barra se compara
//    contra campeones de once, quince y diecisiete años, y por eso la escala se
//    normaliza a puntos por año en vez de a puntos totales.
//  · El 92% de partidas con Briar va como **barra partida**, no como número:
//    el trozo gris que sobra es lo que hace el dato.
//
// ⚠️ **No afirmar que Vladimir la creó.** La wiki lo lista como «Creador» en
// relaciones, pero el texto del lore solo dice «los hemomantes de la Rosa
// Negra». En la lámina va etiquetado como hemomante mayor de Noxus, nada más.
//
// ⚠️ El bloque LATAM **no existe en este episodio**: es la primera vez en la
// serie que no hay ni un latino en el top 50, y el guion decidió saltárselo.
//
// Paleta muestreada del splash: la cueva es azul frío (hue 200) y lo único
// cálido de la imagen es su pelo y la sangre.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Briar: la celda fría y la hemomancia ──────────────────────────
const BG = '#0B0810';        // la celda
const SANGRE = '#E4224A';    // carmín de la hemomancia — acento, y también el dinero
const HIELO = '#84B8D6';     // el azul frío de la cueva — datos y estructura
const BONE = '#EFE9EE';      // texto principal
const MUTED = '#847C8A';     // texto secundario
const PANEL = '#15101A';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = SANGRE, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash
// (helper de missfortune). `alto` sube a 1200 en las láminas de imagen: ahí la
// foto es el contenido, no el fondo. La capa borrosa sangra fuera del marco, de
// ahí el contenedor con overflow oculto — si no, infla scrollHeight.
const portada = (src, alt, posNitida = 'center 24%', alto = 780) => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: ${alto}px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,8,16,0.14) 0%, rgba(11,8,16,0.34) 38%, rgba(11,8,16,0.90) 68%, rgba(11,8,16,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = SANGRE) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(11,8,16,0.9);">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

const remate = (html, color = SANGRE) => `
      <div data-remate style="margin-top: 30px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// «Ayer cumplió», no «hoy cumple»: salió el 13 de septiembre de 2023.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Y ya tiene edad para entrar al kinder porque ayer fue cumpleanos de Briar, este personaje de mierda que siempre me pega las ultis debido a mis condiciones mentales. Y ahi les va el video para que los amantes de las fotos de patas y mains de esta chavalona me den un pinche follow, porque mi cuenta esta mas muerta que las esperanzas de que mi generacion tenga casa propia." style="${seccion()}">
    ${portada('Briar_0.jpg', 'Briar, el Hambre Contenida', 'center 20%')}
    ${glow(SANGRE, '48% 26%', '120% 44%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · ayer, 13 sep')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 204px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(11,8,16,0.85);"><span data-linea style="display: block;">BRIAR</span><span data-linea style="display: block; color: ${SANGRE};">3 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 38px; font-weight: 500; color: ${HIELO}; line-height: 1.3;">El Hambre Contenida</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Jungla · Noxus · <strong style="color: ${BONE};">ya tiene edad para el kínder</strong></p>
      <div data-sub style="margin-top: 34px; display: flex; gap: 14px; flex-wrap: wrap;">
        ${[['LA 165', 'de la historia'], ['13.18', 'el parche'], ['SIN REWORK', 'es muy nueva']].map(([a, b]) => `
        <div data-chip style="padding: 14px 22px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${HIELO};">${a}</div>
          <div style="font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 2 · Imagen · el gólem de sangre ──────────────────────────────────────
// Lámina de apoyo: la imagen ocupa casi todo el lienzo y el texto es una sola
// frase, para poder dejarla en pantalla mientras corre el lore narrado.
slides.push(`
  <section data-label="El gólem" data-screen-label="02 · Imagen · el gólem" data-speaker-notes="Briar no nacio, la fabricaron. La crearon los hemomantes de la Rosa Negra en Noxus, y no es una persona, es un golem de sangre. Tiene carne y tiene sangre pero no necesita comer ni tomar agua para vivir. La disenaron para ser la asesina perfecta. Y les salio al reves, porque la hicieron con un hambre que no se apaga nunca." style="${seccion('justify-content: flex-end;')}">
    ${portada('Briar_0.jpg', 'Briar, el Hambre Contenida', 'center 26%', 1240)}
    ${glow(SANGRE, '50% 30%', '120% 50%')}
    <div style="position: relative;">
      ${eyebrow('No nació. La fabricaron.')}
      <div data-frase style="font-family: ${DISPLAY}; font-size: 128px; line-height: 0.94; color: ${BONE};">Un <span style="color: ${SANGRE};">gólem de sangre</span><br>hecho para matar</div>
      <p data-frase style="margin: 26px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">Tiene carne y tiene sangre, pero <strong style="color: ${BONE};">no necesita comer ni tomar agua</strong> para vivir.</p>
    </div>
  </section>`);

// ── 3 · Imagen · la Rosa Negra ───────────────────────────────────────────
// ⚠️ Vladimir va etiquetado como hemomante mayor de Noxus, NO como su creador:
// el texto del lore solo dice «los hemomantes de la Rosa Negra».
const noxianos = [
  ['Vladimir_0.jpg', 'VLADIMIR', 'El hemomante mayor de Noxus', 'center 18%'],
  ['Swain_0.jpg', 'SWAIN', 'A quien la mandaron a matar', 'center 10%'],
];

slides.push(`
  <section data-label="La Rosa Negra" data-screen-label="03 · Imagen · Noxus" data-speaker-notes="Entonces la Rosa Negra entendio que no la podia controlar, y en vez de arreglarla le construyo un cepo con una gema para atarle las manos y de paso ordenarle la mente. Y le dieron una segunda oportunidad. Cuando Swain dio el golpe de estado en Noxus la mandaron a matarlo, y le asignaron un cuidador para dirigirla. La sacaron del cepo y lo primero que hizo fue devorarse a su propio cuidador." style="${seccion()}">
    ${glow(SANGRE, '50% 32%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('La Rosa Negra, en Noxus')}
      ${titulo('Los que la<br><span style="color: ' + SANGRE + ';">mandaron hacer</span>', 96)}

      <div style="margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        ${noxianos.map(([img, quien, nota, pos]) => `
        <div data-retrato style="display: flex; flex-direction: column; border-radius: 18px; overflow: hidden; border: 1px solid ${SANGRE}47; background: ${PANEL}D9;">
          <div style="height: 506px;">
            <img src="assets/${img}" alt="${quien}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">
          </div>
          <div style="padding: 18px 20px 22px;">
            <div style="font-family: ${DISPLAY}; font-size: 60px; line-height: 0.95; color: ${SANGRE};">${quien}</div>
            <div style="margin-top: 4px; font-size: 22px; font-weight: 500; color: ${MUTED}; line-height: 1.25;">${nota}</div>
          </div>
        </div>`).join('')}
      </div>

      ${remate('Y lo primero que hizo al salir del cepo fue <strong style="color: ' + SANGRE + ';">devorarse a su propio cuidador</strong>.')}
    </div>
  </section>`);

// ── 4 · Imagen · las cuatro ──────────────────────────────────────────────
// Galería grande, sin datos: es material de apoyo, no la lámina de skins.
const galeria = [
  ['Briar_0.jpg', 'Original', 'center 22%'],
  ['Briar_1.jpg', 'Demonios Callejeros', 'center 20%'],
  ['Briar_10.jpg', 'Primordiana', 'center 24%'],
  ['Briar_20.jpg', 'Academia de Combate', 'center 20%'],
];

slides.push(`
  <section data-label="Las cuatro" data-screen-label="04 · Imagen · las cuatro" data-speaker-notes="Y ahora si prepararense porque lo que pasa en esa celda es lo que la define. Briar no se podia morir de hambre, asi que se quedo ahi anos, sola. Y oia gritar a las celdas de al lado, que eran otras armas vivas como ella. Las escucho, y le parecieron aburridas. Puro grito, puro hambre, una sola idea en la cabeza. Y ahi decidio que ella no queria ser eso." style="${seccion()}">
    ${glow(HIELO, '50% 40%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Todo lo que existe de ella', HIELO)}

      <div style="margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${galeria.map(([img, nombre, pos]) => `
        <div data-tile style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.10);">
          <img src="assets/${img}" alt="Briar ${nombre}" style="width: 100%; height: 300px; object-fit: cover; object-position: ${pos}; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,8,16,0) 52%, rgba(11,8,16,0.88) 100%);"></div>
          <div style="position: absolute; left: 18px; right: 18px; bottom: 14px; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${BONE};">${nombre}</div>
        </div>`).join('')}
      </div>

      <div data-cita style="margin-top: 30px; padding: 30px 34px; border-radius: 20px; background: ${SANGRE}14; border-left: 6px solid ${SANGRE};">
        <div style="font-family: ${DISPLAY}; font-size: 82px; line-height: 1.0; color: ${BONE};">«Yo no pierdo el control,<br><span style="color: ${SANGRE};">me libero del control»</span></div>
      </div>
    </div>
  </section>`);

// ── 5 · El one trick ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="El one trick" data-screen-label="05 · El OTP" data-speaker-notes="Ahora el one trick pony con mas puntos, y este tiene un record distinto. Es un europeo con siete millones setecientos mil puntos. Esta en Diamante dos y llego a Master. Y de sus cuatro mil doscientas partidas de temporada, tres mil novecientas son con Briar. El noventa y dos por ciento." style="${seccion()}">
    ${glow(HIELO, '50% 34%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo', HIELO)}
      <div data-nombre style="display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${BONE};">ERIK0</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${HIELO};">#1312</span>
      </div>
      <p data-nombre style="margin: 10px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Europa Nórdica y Este · nivel de invocador 1 755 · maestría 704</p>

      <div data-cifra style="margin-top: 24px;">
        <div data-cuenta="7709980" style="font-family: ${DISPLAY}; font-size: 146px; line-height: 0.86; color: ${SANGRE};">7 709 980</div>
        <div style="margin-top: 4px; font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría · en solo 3 años</div>
      </div>

      <div style="margin-top: 28px; display: flex; gap: 18px;">
        ${[['Diamante 2', 'rango actual · 4 LP', HIELO], ['Master', 'su pico · 367 LP', BONE], ['top 2,77%', 'de la ladder', MUTED]].map(([cifra, pie, color]) => `
        <div data-ficha style="flex: 1; min-width: 0; padding: 20px 20px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.09);">
          <div style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1.02; color: ${color};">${cifra}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${pie}</div>
        </div>`).join('')}
      </div>

      <div data-92 style="margin-top: 30px; padding: 30px 32px 28px; border-radius: 20px; background: ${SANGRE}12; border: 1px solid ${SANGRE}59;">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
          <div>
            <div style="font-family: ${DISPLAY}; font-size: 96px; line-height: 0.9; color: ${SANGRE};">92 %</div>
            <div style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">de todo lo que juega</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${BONE};">3 933 <span style="color: ${MUTED}; font-size: 38px;">de</span> 4 262</div>
            <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">partidas de temporada</div>
          </div>
        </div>
        <div style="margin-top: 18px; display: flex; height: 30px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.06);">
          <div data-barra-92 style="flex: 92 0 0; background: ${SANGRE}; transform-origin: 0 50%;"></div>
          <div style="flex: 8 0 0; background: rgba(255,255,255,0.14);"></div>
        </div>
      </div>

      ${remate('Y en los últimos siete días se echó <strong style="color: ' + BONE + ';">81 partidas</strong> de Briar.', HIELO)}
    </div>
  </section>`);

// ── 6 · El récord: puntos por año ────────────────────────────────────────
// La pieza. Se normaliza a puntos por año porque comparar totales contra
// campeones de once y diecisiete años no diría nada.
const ritmo = [
  ['BRIAR', 'Erik0', 2.57, 3, true],
  ['KINDRED', 'pkoopk', 1.56, 11, false],
  ['RIVEN', 'Secillia', 1.22, 15, false],
  ['DR. MUNDO', 'EVANPORADA', 1.06, 17, false],
  ['MALPHITE', 'BCBG', 0.66, 17, false],
];
const TOPE = 2.57;

slides.push(`
  <section data-label="Puntos por año" data-screen-label="06 · El récord" data-speaker-notes="Suena a poco comparado con los diecisiete millones de ayer, pero acuerdense que Briar tiene tres anos. Ese cabron lleva dos millones y medio de puntos por ano, el doble de rapido que el otepe de Riven. Es el que acumula mas rapido de toda la serie." style="${seccion()}">
    ${glow(SANGRE, '50% 36%', '118% 55%')}
    <div style="position: relative;">
      ${eyebrow('Pero acuérdense que tiene 3 años')}
      ${titulo('El que acumula<br><span style="color: ' + SANGRE + ';">más rápido</span> de la serie', 90)}

      <div style="margin-top: 38px; display: flex; flex-direction: column; gap: 22px;">
        ${ritmo.map(([campeon, otp, mpa, anios, top]) => `
        <div data-carril>
          <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${top ? SANGRE : BONE};">${campeon}</span>
            <span style="font-size: 21px; font-weight: 600; color: ${MUTED};">${otp} · ${anios} año${anios === 1 ? '' : 's'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="flex: 1; height: 40px; border-radius: 9px; background: rgba(255,255,255,0.05); overflow: hidden;">
              <div data-barra style="width: ${(mpa / TOPE * 100).toFixed(1)}%; height: 100%; background: ${top ? SANGRE : 'rgba(132,184,214,0.30)'}; transform-origin: 0 50%;"></div>
            </div>
            <span style="flex: none; width: 168px; text-align: right; font-family: ${DISPLAY}; font-size: 48px; line-height: 1; color: ${top ? SANGRE : HIELO};">${mpa.toFixed(2)} M</span>
          </div>
        </div>`).join('')}
      </div>

      <div data-pie style="margin-top: 26px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Puntos de maestría por año del one trick #1</div>

      ${remate('El <strong style="color: ' + SANGRE + ';">doble de rápido</strong> que el one trick de Riven.')}
    </div>
  </section>`);

// ── 7 · Las skins, y es la más barata de la serie ────────────────────────
const skins = [
  ['carga-Briar_1.jpg', 'Demonios Callejeros', '2023'],
  ['carga-Briar_10.jpg', 'Primordiana', '2024'],
  ['carga-Briar_20.jpg', 'Academia de Combate', '2026'],
];
const tabla = [
  ['BRIAR', 1.9, true], ['Dr. Mundo', 3.1, false], ['Kindred', 4.5, false],
  ['Riven', 7.4, false], ['Miss Fortune', 8.9, false],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="07 · Las skins" data-speaker-notes="Y de skins tiene cuatro y nada mas tres que puedes comprar, que te saldrian en unos treinta y un dolares, menos de dos dias de salario minimo. La mas barata de toda la serie. Acuerdense que vestir a Lux costaba diez dias." style="${seccion()}">
    ${glow(SANGRE, '50% 30%', '115% 50%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('4 skins, y <span style="color: ' + SANGRE + ';">3 a la venta</span>', 92)}

      <div style="margin-top: 26px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        ${skins.map(([img, nombre, anio]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 8px;">
            <img src="assets/${img}" alt="Briar ${nombre}" style="width: 100%; height: 300px; object-fit: cover; object-position: center 14%; border-radius: 12px; border: 1px solid ${SANGRE}33;">
            <span style="font-size: 21px; font-weight: 700; color: ${BONE}; line-height: 1.12;">${nombre}</span>
            <span style="font-size: 19px; font-weight: 600; color: ${MUTED};">1350 RP · ${anio}</span>
          </div>`).join('')}
      </div>

      <div data-precio style="margin-top: 26px; display: flex; align-items: center; gap: 26px;">
        <div style="flex: none; width: 396px;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${SANGRE};">1,9 <span style="font-size: 48px;">días</span></div>
          <div style="font-size: 21px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">de salario mínimo</div>
          <div style="margin-top: 2px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">~31 USD · 4 050 RP</div>
        </div>
        <div style="width: 2px; height: 86px; background: ${SANGRE}4D;"></div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;"><strong style="color: ${BONE};">La más barata de toda la serie.</strong> Vestir a Lux costaba diez días.</div>
      </div>

      <div style="margin-top: 26px; display: flex; flex-direction: column; gap: 10px;">
        ${tabla.map(([quien, dias, top]) => `
        <div data-fila style="display: flex; align-items: center; gap: 18px;">
          <span style="flex: none; width: 190px; font-size: 24px; font-weight: ${top ? 700 : 500}; color: ${top ? SANGRE : MUTED};">${quien}</span>
          <div style="flex: 1; height: 26px; border-radius: 7px; background: rgba(255,255,255,0.05); overflow: hidden;">
            <div data-barra style="width: ${(dias / 8.9 * 100).toFixed(1)}%; height: 100%; background: ${top ? SANGRE : 'rgba(132,184,214,0.28)'}; transform-origin: 0 50%;"></div>
          </div>
          <span style="flex: none; width: 74px; text-align: right; font-family: ${DISPLAY}; font-size: 34px; line-height: 1; color: ${top ? SANGRE : HIELO};">${String(dias).replace('.', ',')}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 8 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="08 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('Briar_10.jpg', 'Briar Primordiana', 'center 18%')}
    ${glow(SANGRE, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Tres años del Hambre Contenida')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${SANGRE};">Briar</span></h2>
      <div data-gigi style="margin-top: 50px; font-family: ${DISPLAY}; font-size: 108px; line-height: 1.0; color: ${HIELO};">GIGI EASY</div>
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

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.66)
      .from(q(s, '[data-chip]'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.09 }, 0.96);
  });

  // Las láminas de imagen entran lentas y sin cascada: son fondo para narrar
  // encima, no información que haya que leer en orden.
  animar('El gólem', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.06, opacity: 0, duration: 1.25 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.2 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 26, opacity: 0, duration: 0.55 }, 0.28)
      .from(q(s, '[data-frase]'), { y: 30, opacity: 0, duration: 0.7, stagger: 0.16 }, 0.46);
  });

  animar('La Rosa Negra', function (tl, s) {
    var r = q(s, '[data-retrato]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(r[0], { x: -34, opacity: 0, duration: 0.65 }, 0.34)
      .from(r[1], { x: 34, opacity: 0, duration: 0.65 }, 0.52)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.06);
  });

  animar('Las cuatro', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-tile]'), { y: 28, scale: 0.95, opacity: 0, duration: 0.55, stagger: 0.11 }, 0.2)
      .from(s.querySelector('[data-cita]'), { y: 28, opacity: 0, duration: 0.65 }, 0.92);
  });

  // La cifra cuenta, las fichas caen, y la barra del 92% crece al final: el
  // trozo gris que sobra es lo que hace el dato, así que tiene que llegar
  // cuando ya se leyó el número.
  animar('El one trick', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-nombre]'), { y: 24, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.08)
      .from(s.querySelector('[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.28)
      .from(q(s, '[data-ficha]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.82)
      .from(s.querySelector('[data-92]'), { y: 26, opacity: 0, duration: 0.55 }, 1.04)
      .from(s.querySelector('[data-barra-92]'), { scaleX: 0, duration: 0.62, ease: 'power2.inOut' }, 1.14)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.48 }, 1.3);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.32, 1.0);
  });

  // Las barras crecen todas a la vez y no en cascada: la comparación es de
  // velocidad, y escalonarlas contaría justo lo contrario.
  animar('Puntos por año', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-carril]'), { x: 24, opacity: 0, duration: 0.4, stagger: 0.09 }, 0.32)
      .from(q(s, '[data-barra]'), { scaleX: 0, duration: 0.75, ease: 'power2.out' }, 0.5)
      .from(s.querySelector('[data-pie]'), { opacity: 0, duration: 0.4 }, 1.12)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.5 }, 1.24);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 26, opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.1 }, 0.28)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.55 }, 0.78)
      .from(q(s, '[data-fila]'), { x: 22, opacity: 0, duration: 0.34, stagger: 0.07 }, 1.0)
      .from(q(s, '[data-fila] [data-barra]'), { scaleX: 0, duration: 0.48, ease: 'power2.out', stagger: 0.07 }, 1.0);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.24)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.9);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Briar cumple 3 años</title>
${kit.og({ titulo: "Briar cumple 3 años", descripcion: "Tres años del Hambre Contenida: un gólem de sangre que salió defectuoso, el one trick que acumula más rápido de toda la serie, y el catálogo de skins más barato del Cumplelolero. Apoyo visual para TikTok.", carpeta: "briar" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(228,34,74,0.45); border-radius: 999px;
    background: rgba(11,8,16,0.85); color: ${SANGRE}; cursor: pointer;
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
