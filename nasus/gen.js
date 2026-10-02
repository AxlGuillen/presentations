// Generador de index.html — Nasus cumple 17 años (screenshots para TikTok)
// Ejecutar: node nasus/gen.js
//
// Serie «Cumplelolero» #21, animado. Mismo criterio que samira, sona, vex y
// khazix: **pocas láminas por bloque, arte real y nada dibujado**.
//
// **Orden invertido, como desde katarina**: el one trick abre y el lore va
// después. Y el guion **cambia de registro a la mitad a propósito** — el OTP en
// crudo, el lore narrado en serio — así que el deck cambia de color con él (ver
// la paleta).
//
// Las dos mitades cuentan la misma idea: **darlo todo y que no te alcance**. El
// OTP metió doce millones de puntos y no sale de Bronce; Renekton cargó a su
// hermano creyendo que iba a morir por él y terminó encerrado.
//
// De dónde sale cada imagen:
//  · Splashes de Nasus, retratos de pantalla de carga de Katarina y Cho'Gath,
//    e ícono del Golpe Absorbente — Data Dragon.
//  · **Legends of Runeterra (set4, Shurima)**: Nasus (`04SH047`) para el
//    bibliotecario, **el Disco Solar restaurado** (`04SH062T1`) para la
//    Ascensión, **la Tumba arenosa** (`04SH105`) para la Tumba de los
//    Emperadores y **Nasus nivel 2** (`04SH047T2`), donde los dos hermanos
//    pelean, para el reencuentro.
//  · **Wiki oficial**: *Azir Nasus Renekton LoR Promo 01*, los dos hermanos
//    ascendidos con Azir, para «ascendieron los dos».
//  · Emblemas de CommunityDragon a 500 px, recortados a su bbox.
//
// ⚠️ **No existe arte oficial de Renekton cargando a Nasus**, que la
// investigación pedía como prioridad. Esa lámina va sobre el Disco Solar, que
// es el lugar donde pasó, y el golpe lo da el texto.
//
// ⚠️ **El lore está verificado en las biografías oficiales es-MX**, que la
// investigación no pudo leer. La de Renekton dice textual que lo alzó en
// brazos y subió los últimos peldaños «convencido de que aquel gesto lo
// conduciría a la muerte», y que Xerath lo convenció en la tumba de que Nasus
// se había deshecho de él por celos — de ahí que lo culpe.
//
// ⚠️ **Sin dinero ni salarios mínimos, por decisión de Axl** (está en la
// investigación). La lámina de skins se queda en conteos y en la bóveda.
//
// ⚠️ Fuera porque el guion no los narra (y la investigación lo deja como
// decisión, no omisión): el bloque LATAM (FerNasus145, cuarto del mundo, en
// Master) y el top 5 mundial.
//
// ⚠️ El rango se mueve a diario: la investigación pide tomar la captura el día
// de grabación. Si cambió, hay que tocar `RANGO` aquí abajo y regenerar.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

const RANGO = 'Bronce 3';   // ⚠️ confirmar el día de grabación

// ── Paleta Nasus: el bronce que no se rompe y la noche de Shurima ────────
// El acento es **bronce mate `#D08B4F`**: es literalmente el techo del one trick
// y, de paso, el metal de Shurima. Va con el **azul noche desaturado `#8FA7C9`**
// de su splash —el tono más repetido de la imagen— para datos y estructura.
// Se separa de azir, el otro deck de Shurima, en que ahí es oro de sol brillante
// con lapislázuli saturado; aquí todo está apagado, que es el tono del episodio.
// **El bronce manda en el OTP y las skins; en el lore se apaga** y el azul noche
// toma el relevo, igual que el guion baja el tono a la mitad.
const BG = '#0A0B10';        // la noche del desierto
const BRONCE = '#D08B4F';    // el techo del OTP — acento
const NOCHE = '#8FA7C9';     // azul noche del splash — datos y estructura
const BONE = '#EEEDEA';      // texto principal
const MUTED = '#7E828C';     // texto secundario
const PANEL = '#12141B';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = NOCHE, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}26 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,11,16,0.14) 0%, rgba(10,11,16,0.38) 34%, rgba(10,11,16,0.92) 64%, rgba(10,11,16,0.99) 100%);"></div>
    </div>`;

// Carta apaisada entera sobre su copia borrosa (archivo aparte de 360 px).
const arte = (src, alt, alto = 456) => `
    <div data-arte style="position: relative; width: 100%; height: ${alto}px; border-radius: 16px; overflow: hidden; border: 1px solid ${NOCHE}40;">
      <div style="position: absolute; inset: -40px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(38px) saturate(0.8) brightness(0.42);"></div>
      <img src="assets/${src}" alt="${alt}" style="position: relative; width: 100%; height: 100%; object-fit: contain; display: block;">
    </div>`;

const eyebrow = (txt, color = NOCHE) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(10,11,16,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(10,11,16,0.85);">${txt}</h2>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

// Lámina de lore: arte, frase y una línea. Las cinco comparten molde para que el
// tramo serio se lea continuo, como en samira.
const lore = ({ label, screen, notas, src, alt, ceja, frase, size = 100, apoyo = '', extra = '', alto = 456 }) => `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${glow(NOCHE, '50% 32%', '118% 50%')}
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
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy cumple diecisiete anos Nasus y el cabron que mas puntos de maestria tiene con el en todo el planeta esta en Bronce tres." style="${seccion()}">
    ${portada('Nasus_0.jpg', 'Nasus, el Curador de las Arenas', 'center 22%')}
    ${glow(BRONCE, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · hoy, 1 oct de 2009', BRONCE)}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(10,11,16,0.88);"><span data-linea style="display: block;">NASUS</span><span data-linea style="display: block; color: ${BRONCE};">17 AÑOS</span></h1>
      <p data-sub style="margin: 32px 0 0; font-size: 40px; font-weight: 500; color: ${NOCHE}; line-height: 1.3;">El Curador de las Arenas</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Top · Shurima · hermano de Renekton</p>
    </div>
  </section>`);

// ── 2 · Doce millones para andar en Bronce ───────────────────────────────
slides.push(`
  <section data-label="El OTP" data-screen-label="02 · El OTP" data-speaker-notes="Se llama KAISER1V9 y trae doce millones trescientos mil puntos con maestria nivel nueve. Doce millones de puntos para andar en Bronce no mames." style="${seccion()}">
    ${glow(BRONCE, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('El que más puntos tiene del mundo', BRONCE)}
      <div data-nombre style="display: inline-flex; align-items: baseline; gap: 16px; padding: 14px 32px; border-radius: 999px; background: ${NOCHE}1A; border: 1px solid ${NOCHE}73;">
        <span style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; color: ${BONE};">KAISER1V9</span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${NOCHE};">maestría nivel 9</span>
      </div>
      <div data-cifra style="margin-top: 30px;">
        <div data-cuenta="12338546" style="font-family: ${DISPLAY}; font-size: 160px; line-height: 0.84; color: ${BONE};">12 338 546</div>
        <div style="margin-top: 6px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>
      <img data-emblema src="assets/emblems/bronze.png" alt="Bronce" style="margin-top: 34px; width: 360px; height: auto; display: block; filter: drop-shadow(0 0 60px rgba(208,139,79,0.35)) brightness(1.08);">
      <div data-rango style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.88; color: ${BRONCE};">${RANGO.toUpperCase()}</div>
    </div>
  </section>`);

// ── 3 · Lo más alto de su vida ───────────────────────────────────────────
// El historial como fila de emblemas, **del más reciente al más viejo** porque
// así lo lee la voz («Hierro cuatro, Hierro cuatro, Hierro cuatro y Hierro
// dos»), y el Bronce de hoy debajo, que es el techo.
const historial = [
  ['iron.png', 'Hierro 4', 'S2024 S3'],
  ['iron.png', 'Hierro 4', 'S2024 S2'],
  ['iron.png', 'Hierro 4', 'S2024 S1'],
  ['iron.png', 'Hierro 2', 'S2023 S2'],
];
slides.push(`
  <section data-label="Historial" data-screen-label="03 · Historial · lo más alto de su vida" data-speaker-notes="Esta temporada lleva cuatrocientas treinta y cuatro ganadas contra cuatrocientas sesenta y cinco perdidas que es un cuarenta y ocho por ciento y su historial completo es Hierro cuatro Hierro cuatro Hierro cuatro y Hierro dos o sea que Bronce es lo mas alto que ha estado en toda su vida." style="${seccion()}">
    ${glow(BRONCE, '50% 40%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Su historial completo')}
      <div data-fila style="width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        ${historial.map(([em, nombre, temp]) => `
        <div data-temporada style="padding: 18px 8px 14px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.08);">
          <img src="assets/emblems/${em}" alt="${nombre}" style="width: 100%; max-width: 190px; height: auto; display: block; margin: 0 auto; filter: grayscale(0.4) brightness(0.95);">
          <div style="margin-top: 8px; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${MUTED};">${nombre}</div>
          <div style="margin-top: 2px; font-size: 17px; font-weight: 600; letter-spacing: 1px; color: #5E626B;">${temp}</div>
        </div>`).join('')}
      </div>
      <div data-hoy style="margin-top: 34px; width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 26px 30px; border-radius: 18px; background: ${BRONCE}14; border: 2px solid ${BRONCE}99;">
        <img src="assets/emblems/bronze.png" alt="Bronce" style="width: 270px; height: auto; display: block; flex: none;">
        <div style="text-align: left;">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${BRONCE};">Hoy</div>
          <div style="font-family: ${DISPLAY}; font-size: 84px; line-height: 0.92; color: ${BONE};">${RANGO}</div>
          <div style="margin-top: 4px; font-size: 26px; font-weight: 600; color: ${BRONCE};">lo más alto de su vida</div>
        </div>
      </div>
      <div data-record style="margin-top: 30px; font-family: ${DISPLAY}; font-size: 80px; line-height: 1; color: ${BONE};">434 <span style="color: ${MUTED}; font-size: 54px;">—</span> 465 <span style="font-size: 50px; color: ${NOCHE};">· 48 %</span></div>
      <div data-record style="font-size: 21px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${MUTED};">ganadas · perdidas esta temporada</div>
    </div>
  </section>`);

// ── 4 · Juega lo mismo que yo ────────────────────────────────────────────
const otros = [
  ['Katarina-carga.jpg', 'Katarina', 'la cumpleañera de hace dos semanas', 'center 16%'],
  ['Chogath-carga.jpg', "Cho'Gath", 'el tanque favorito de ayer', 'center 18%'],
];
slides.push(`
  <section data-label="Lo mismo" data-screen-label="04 · Juega lo mismo que yo" data-speaker-notes="El noventa y seis por ciento de sus partidas son en top y el noventa y cuatro por ciento con tanques y wachen el detalle porque sus otros dos campeones son Katarina y Cho'Gath o sea la cumpleanera de hace dos semanas y uno de los dos tanques que les dije ayer que son mis favoritos. El wey y yo jugamos exactamente lo mismo nomas que el trae doce millones de puntos y yo no." style="${seccion()}">
    ${glow(NOCHE, '50% 36%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Wachen el detalle')}
      <div data-pct style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['96 %', 'en top'], ['94 %', 'con tanques']].map(([a, b]) => `
        <div data-cajita style="padding: 22px 20px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid ${NOCHE}40;">
          <div style="font-family: ${DISPLAY}; font-size: 110px; line-height: 0.9; color: ${BONE};">${a}</div>
          <div style="font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${NOCHE};">${b}</div>
        </div>`).join('')}
      </div>
      <div style="margin-top: 40px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Sus otros dos campeones</div>
      <div data-otros style="margin-top: 18px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${otros.map(([img, nombre, que, pos]) => `
        <div data-otro style="position: relative; height: 430px; border-radius: 18px; overflow: hidden; border: 1px solid ${BRONCE}66;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,11,16,0) 45%, rgba(10,11,16,0.94) 100%);"></div>
          <div style="position: absolute; left: 16px; right: 16px; bottom: 14px; text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 60px; line-height: 1; color: ${BONE};">${nombre}</div>
            <div style="font-size: 20px; font-weight: 600; color: ${BRONCE}; line-height: 1.2;">${que}</div>
          </div>
        </div>`).join('')}
      </div>
      <p data-remate style="margin: 30px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.32;">Jugamos lo mismo.<br>${c('Nomás que él trae doce millones.', BRONCE)}</p>
    </div>
  </section>`);

// ── 5 · Cambalache, no regalo ────────────────────────────────────────────
// Los dos lados del cambio del 26.16, juntos: si solo sale el «3 → 4», el primer
// comentario es el «actually» de las cosas grandes.
slides.push(`
  <section data-label="Parche" data-screen-label="05 · Debería jugar dormido · el 26.16" data-speaker-notes="Y la neta no me explico como puede ser tan perro malo porque con doce millones de puntos ese cabron deberia sabarselas todas de memoria. Deberia jugar dormido y ganar. Y eso que el campeon hasta se le hizo mas facil porque desde el parche veintiseis dieciseis Nasus apila cuatro stacks por muerte en vez de tres aunque por las cosas grandes le bajaron de doce a diez asi que fue cambalache y no regalo." style="${seccion()}">
    ${glow(BRONCE, '50% 36%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div data-dormido style="font-family: ${DISPLAY}; font-size: 118px; line-height: 0.9; text-transform: uppercase; color: ${BONE};">Debería jugar<br>${c('dormido y ganar', BRONCE)}</div>
      <div data-icono style="margin-top: 50px; display: flex; align-items: center; justify-content: center; gap: 18px;">
        <img src="assets/iconos/golpe.png" alt="Golpe Absorbente" style="width: 96px; height: 96px; border-radius: 12px; border: 2px solid ${NOCHE}99; display: block;">
        <div style="text-align: left;">
          <div style="font-size: 30px; font-weight: 700; color: ${BONE}; line-height: 1.1;">Golpe Absorbente</div>
          <div style="font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">parche 26.16 · stacks por muerte</div>
        </div>
      </div>
      <div data-cambios style="margin-top: 26px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['Normal', '3', '4', BRONCE, 'subió'], ['Cosas grandes', '12', '10', NOCHE, 'bajó']].map(([que, a, b, col, v]) => `
        <div data-cambio style="padding: 22px 20px; border-radius: 18px; background: ${PANEL}D9; border: 1px solid ${col}66;">
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">${que}</div>
          <div style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 96px; line-height: 0.95;"><span style="color: ${MUTED};">${a}</span> <span style="color: ${MUTED}; font-size: 60px;">→</span> <span style="color: ${col};">${b}</span></div>
          <div style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${col};">${v}</div>
        </div>`).join('')}
      </div>
      <div data-golpe style="margin-top: 36px; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${BONE};">Cambalache, ${c('no regalo', BRONCE)}</div>
    </div>
  </section>`);

// ── 6 · Bibliotecario ────────────────────────────────────────────────────
// Desde aquí el guion baja el tono y el deck también: el bronce se apaga y
// manda el azul noche.
slides.push(lore({
  label: 'Bibliotecario', screen: '06 · Lore · era bibliotecario',
  notas: 'Y miren que coincidencia porque el lore de Nasus va justamente de eso de darlo todo por alguien y que te lo paguen de la chingada. Porque Nasus no era guerrero Nasus era bibliotecario. Fue el conservador de la gran biblioteca de Shurima y escribio algunas de las obras literarias mas importantes del imperio.',
  src: 'bibliotecario.jpg', alt: 'Nasus, arte de Legends of Runeterra',
  ceja: 'Darlo todo y que te lo paguen mal',
  frase: 'No era guerrero.<br>' + c('Era bibliotecario.', NOCHE), size: 112,
  apoyo: 'El conservador de la gran biblioteca de Shurima',
}));

// ── 7 · Los escalones ────────────────────────────────────────────────────
// No hay arte oficial de Renekton cargándolo: va el Disco Solar, que es donde
// pasó, y el golpe lo da la frase.
slides.push(lore({
  label: 'Los escalones', screen: '07 · Lore · Renekton lo cargó',
  notas: 'Y el sacerdocio declaro que era voluntad del Sol que lo ascendieran pero para entonces Nasus se estaba muriendo de una enfermedad y ya no tenia fuerzas ni para subir los escalones de la plataforma. Entonces su hermano Renekton lo cargo en brazos y subio los ultimos escalones por el sabiendo que esa energia lo iba a matar porque el disco solar no estaba destinado para el. Y lo hizo de todas formas.',
  src: 'disco-solar.jpg', alt: 'El Disco Solar de Shurima, arte de Legends of Runeterra',
  ceja: 'No podía ni subir los escalones',
  frase: 'Renekton lo cargó<br>' + c('en brazos', NOCHE), size: 120,
  apoyo: 'Sabiendo que esa energía lo iba a matar.<br>' + c('Y lo hizo de todas formas.', NOCHE),
}));

// ── 8 · Ascendieron los dos ──────────────────────────────────────────────
slides.push(lore({
  label: 'Ascendidos', screen: '08 · Lore · no se murió',
  notas: 'Y no se murio. Ascendieron los dos, Nasus con cuerpo de chacal y Renekton de cocodrilo.',
  src: 'ascendidos.jpg', alt: 'Nasus, Renekton y Azir ascendidos, arte oficial', alto: 513,
  ceja: 'Y no se murió',
  frase: 'Ascendieron<br>' + c('los dos', NOCHE), size: 140,
  extra: `
      <div data-pareja style="margin-top: 26px; display: flex; justify-content: center; gap: 14px;">
        ${[['Nasus', 'chacal'], ['Renekton', 'cocodrilo']].map(([n, a]) => `
        <div style="padding: 14px 26px; border-radius: 999px; background: ${NOCHE}1A; border: 1px solid ${NOCHE}66;">
          <span style="font-family: ${DISPLAY}; font-size: 44px; color: ${BONE};">${n}</span>
          <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${NOCHE};"> · ${a}</span>
        </div>`).join('')}
      </div>`,
}));

// ── 9 · La Tumba ─────────────────────────────────────────────────────────
slides.push(lore({
  label: 'La tumba', screen: '09 · Lore · selló la puerta',
  notas: 'Anos despues Xerath traiciono al imperio y los dos hermanos fueron por el pero no pudieron con el mago. Entonces Renekton lo arrastro hasta la Tumba de los Emperadores y le grito a Nasus que sellara la puerta. Y wachen como le pago. Nasus intento detenerlo pero al final cedio y encerro a su hermano vivo ahi adentro con el mago.',
  src: 'tumba.jpg', alt: 'Una tumba de Shurima, arte de Legends of Runeterra',
  ceja: 'La Tumba de los Emperadores',
  frase: 'Y Nasus<br>' + c('selló la puerta', BRONCE), size: 130,
  apoyo: 'Con su hermano vivo adentro, encerrado con Xerath.',
}));

// ── 10 · Lo que encontró ─────────────────────────────────────────────────
slides.push(lore({
  label: 'Siglos después', screen: '10 · Lore · ya no era su hermano',
  notas: 'Volvio siglos despues a hacer las paces y lo que encontro ya no era su hermano. Era una bestia que los siglos de tormento volvieron loca y que lo unico que quiere es matarlo porque lo culpa a el de todo. El mismo que lo habia cargado en brazos creyendo que se iba a morir por el.',
  src: 'hermanos.jpg', alt: 'Nasus y Renekton peleando, arte de Legends of Runeterra',
  ceja: 'Siglos después',
  frase: 'Ya no era<br>' + c('su hermano', NOCHE), size: 130,
  apoyo: 'El mismo que lo había cargado en brazos<br>' + c('creyendo que iba a morir por él.', BRONCE),
}));

// ── 11 · Las skins ───────────────────────────────────────────────────────
// Sin dinero, por decisión de Axl. Las once comprables en chico y las dos de la
// bóveda en grande y apagadas, que son las que narra el guion.
const comprables = [1, 2, 3, 5, 6, 10, 16, 25, 35, 45, 54];
const boveda = [
  ['Nasus_4.jpg', 'Riot Nasus K-9', '2011'],
  ['Nasus_11.jpg', 'Guardián Lunar', '2018'],
];
slides.push(`
  <section data-label="Las skins" data-screen-label="11 · Las skins · la bóveda" data-speaker-notes="Y ya para cerrar de skins tiene catorce de las cuales once las puedes comprar y dos estan encerradas en la boveda que son la Riot K-9 de dos mil once y la Guardian Lunar de dos mil dieciocho. Esas ya no las vas a tener nunca." style="${seccion()}">
    ${glow(BRONCE, '50% 30%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Catorce skins', BRONCE)}
      ${titulo('Once ' + c('a la venta', BRONCE), 96)}
      <div data-mini style="margin-top: 22px; width: 100%; display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
        ${comprables.map((n) => `<img data-chica src="assets/Nasus_${n}.jpg" alt="Skin de Nasus" style="width: 100%; height: 94px; object-fit: cover; object-position: center 28%; border-radius: 8px; display: block; border: 1px solid ${NOCHE}33;">`).join('')}
      </div>
      <div style="margin-top: 34px; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">Y dos encerradas</div>
      <div data-piezas style="margin-top: 16px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${boveda.map(([img, nombre, anio]) => `
        <div data-pieza style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${BRONCE}66;">
          <img src="assets/${img}" alt="Nasus ${nombre}" style="width: 100%; height: 380px; object-fit: cover; object-position: center 25%; display: block; filter: saturate(0.4) brightness(0.62);">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,11,16,0.05) 40%, rgba(10,11,16,0.93) 100%);"></div>
          <div data-sello style="position: absolute; top: 14px; left: 14px; background: ${BRONCE}; color: ${BG}; font-size: 18px; font-weight: 800; letter-spacing: 2px; border-radius: 8px; padding: 7px 14px;">EN BÓVEDA</div>
          <div style="position: absolute; left: 18px; right: 18px; bottom: 14px; text-align: left;">
            <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 0.98; color: ${BONE};">${nombre}</div>
            <div style="font-size: 21px; font-weight: 600; color: ${BRONCE};">${anio}</div>
          </div>
        </div>`).join('')}
      </div>
      <div data-nunca style="margin-top: 30px; font-family: ${DISPLAY}; font-size: 80px; line-height: 0.95; color: ${BONE};">Esas ya no ${c('las vas a tener nunca', BRONCE)}</div>
    </div>
  </section>`);

// ── 12 · Cierre ──────────────────────────────────────────────────────────
// Con Faraón Nasus: arena y bronce, de vuelta al color del principio.
slides.push(`
  <section data-label="Cierre" data-screen-label="12 · Cierre" data-speaker-notes="Ni pedo solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Nasus_2.jpg', 'Faraón Nasus', 'center 26%')}
    ${glow(BRONCE, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Diecisiete años del Curador de las Arenas', BRONCE)}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${BRONCE};">Nasus</span></h2>
      <div data-gigi style="margin-top: 56px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${NOCHE};">GIGI EASY</div>
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

  // La cifra sube entera y el Bronce cae al final, como golpe.
  animar('El OTP', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-nombre]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 0.1)
      .from(uno(s, '[data-cifra]'), { y: 26, opacity: 0, duration: 0.5 }, 0.34)
      .from(uno(s, '[data-emblema]'), { y: -40, scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, 1.0)
      .from(uno(s, '[data-rango]'), { y: 24, opacity: 0, duration: 0.45 }, 1.26);
    cuentaMil(tl, uno(s, '[data-cifra] [data-cuenta]'), 0.36, 0.8);
  });

  // Los cuatro Hierro caen uno por uno y el Bronce de hoy llega al final.
  animar('Historial', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-temporada]'), { y: 26, opacity: 0, duration: 0.42, stagger: 0.12 }, 0.12)
      .from(uno(s, '[data-hoy]'), { scale: 0.92, opacity: 0, duration: 0.55, ease: 'back.out(1.6)' }, 0.78)
      .from(q(s, '[data-record]'), { y: 20, opacity: 0, duration: 0.42, stagger: 0.1 }, 1.24);
  });

  animar('Lo mismo', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(q(s, '[data-cajita]'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.1)
      .from(q(s, '[data-otro]'), { y: 30, opacity: 0, duration: 0.5, stagger: 0.16 }, 0.56)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.45 }, 1.2);
  });

  // Primero el reclamo, luego el cambio en sus dos lados, y la conclusión.
  animar('Parche', function (tl, s) {
    tl.from(uno(s, '[data-dormido]'), { y: 34, opacity: 0, duration: 0.6 }, 0)
      .from(uno(s, '[data-icono]'), { y: 20, opacity: 0, duration: 0.45 }, 0.46)
      .from(q(s, '[data-cambio]'), { y: 24, opacity: 0, duration: 0.42, stagger: 0.18 }, 0.7)
      .from(uno(s, '[data-golpe]'), { scale: 0.86, opacity: 0, duration: 0.45, ease: 'back.out(1.8)' }, 1.3);
  });

  // Las cinco de lore comparten entrada: arte, frase y remate.
  function loreEntrada(tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0);
    entraArte(tl, s, 0.12);
    tl.from(uno(s, '[data-texto]'), { y: 30, opacity: 0, duration: 0.6 }, 0.82);
    if (uno(s, '[data-remate]')) tl.from(uno(s, '[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.2);
    if (uno(s, '[data-pareja]')) tl.from(q(s, '[data-pareja] > div'), { y: 20, opacity: 0, duration: 0.4, stagger: 0.14 }, 1.16);
  }
  ['Bibliotecario', 'Los escalones', 'Ascendidos', 'La tumba', 'Siglos después'].forEach(function (l) { animar(l, loreEntrada); });

  // Las once chicas en cascada, las dos de la bóveda se apagan al caer el sello.
  animar('Las skins', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(uno(s, '[data-a="up2"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-chica]'), { y: 16, opacity: 0, duration: 0.3, stagger: 0.035 }, 0.24)
      .from(q(s, '[data-pieza]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.7)
      .from(q(s, '[data-pieza] img'), { filter: 'saturate(1) brightness(1)', duration: 0.6, stagger: 0.12 }, 0.86)
      .from(q(s, '[data-sello]'), { y: -18, rotation: -8, opacity: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.12 }, 1.06)
      .from(uno(s, '[data-nunca]'), { y: 22, opacity: 0, duration: 0.45 }, 1.34);
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
<title>Nasus cumple 17 años</title>
${kit.og({ titulo: "Nasus cumple 17 años", descripcion: "Doce millones de puntos no sacan de Bronce a su mejor one trick, y su hermano lo cargó en brazos creyendo que iba a morir por él para terminar encerrado en una tumba. Apoyo visual para TikTok.", carpeta: "nasus" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(208,139,79,0.45); border-radius: 999px;
    background: rgba(10,11,16,0.85); color: ${BRONCE}; cursor: pointer;
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
