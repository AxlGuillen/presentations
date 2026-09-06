// Generador de index.html — Miss Fortune cumple 16 años (screenshots para TikTok)
// Ejecutar: node missfortune/gen.js
//
// Serie «Cumplelolero» #9, animado. Sigue el orden del guion, que es el
// **experimento del lore primero** (segundo episodio consecutivo, después de
// ivern): lore → one trick → skins. La recomendación de la investigación era
// al revés, pero manda el guion, que es lo que se narra.
//
// Dos piezas nuevas de diseño:
//  1. La lámina del remate dibuja un **arco SVG de retorno** que va del último
//     eslabón de la cadena al primero — las pistolas vuelven a su origen. Es la
//     primera animación de trazo (stroke-dashoffset) del repo.
//  2. La lámina del rango es una **línea plana**: seis temporadas y la línea
//     nunca sale de la banda de Plata, con el resto de la escalera en gris
//     encima. El chiste del episodio es que no se movió nunca.
//
// Paleta muestreada: el fondo del splash es el teal del puerto (hue 180) y su
// icono es el rojo cobre del pelo (hue 15–30), que aquí hace doble trabajo
// como el fuego del incendio y la venganza.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Miss Fortune: puerto de Bilgewater, fuego y oro pirata ────────
const BG = '#071316';        // el puerto de noche
const FUEGO = '#E8552E';     // rojo cobre de su pelo — el incendio y la venganza
const MAR = '#3FB8B0';       // teal del puerto — datos y cifras
const ORO = '#EFC45A';       // oro pirata — el dinero
const BONE = '#F2ECE6';      // texto principal
const MUTED = '#8FA0A2';     // texto secundario
const PANEL = '#0E1F23';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = FUEGO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = FUEGO) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// Los splash son apaisados (1215×717) y el lienzo es vertical (1080×1920): con
// background cover hay que ampliarlos 2,7× y se recorta casi todo. Esta portada
// pone la imagen ENTERA (contain) sobre una copia borrosa que rellena el marco,
// que es el mismo recurso que usa tools/og.mjs para los decks verticales.
// El background-repeat va explícito en las dos capas.
const portada = (src, alt, posNitida = 'center 22%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(46px) saturate(0.8) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 760px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,19,22,0.18) 0%, rgba(7,19,22,0.42) 34%, rgba(7,19,22,0.92) 66%, rgba(7,19,22,0.99) 100%);"></div>
    </div>`;

const arte = (src, alt, alto, pos = 'center 25%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(232,85,46,0.26); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,19,22,0) 40%, rgba(7,19,22,0.85) 100%);"></div>
      </div>`;

const pasos = (lista, color = FUEGO) => `
      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 17px;">
        ${lista.map((t, i) => `
        <div data-paso style="display: flex; align-items: flex-start; gap: 20px;">
          <span data-paso-num style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${color}; width: 46px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>`;

const remate = (html, color = FUEGO) => `
      <div data-remate style="margin-top: 32px; padding: 26px 32px; border-radius: 16px; background: ${color}1F; border: 1px solid ${color}73; font-size: 29px; font-weight: 500; color: ${BONE}; line-height: 1.35;">${html}</div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy es cumpleanos de Miss Fortune, que lleva dieciseis anos desde que llego a la Grieta del Invocador, y toca darle sus tres minutos de atencion." style="${seccion()}">
    ${portada('MissFortune_0.jpg', 'Miss Fortune')}
    ${glow(FUEGO, '50% 30%', '120% 45%')}
    <div style="position: relative;">
      ${eyebrow('Cumplelolero · 8 sep 2010 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 172px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 0 90px rgba(232,85,46,0.42);"><span data-linea style="display: block;">MISS FORTUNE</span><span data-linea style="display: block; color: ${FUEGO};">16 AÑOS</span></h1>
      <p data-sub style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${FUEGO}; line-height: 1.3;">Sarah Fortune · la Reina de Bilgewater</p>
      <p data-sub style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">ADC · Bilgewater</p>
    </div>
  </section>`);

// ── 2 · Lore I · Su madre y el encargo ───────────────────────────────────
slides.push(`
  <section data-label="El encargo" data-screen-label="02 · El encargo" data-speaker-notes="Miss Fortune en realidad se llama Sarah Fortune, y su mama era Abigale Fortune, una fabricante de armas muy famosa en Bilgewater que le enseno a hacer pistolas desde chiquita. Un dia llego Gangplank al taller a encargarle dos pistolas poderosas. Abigale acepto y le dijo que en un ano las tendria listas." style="${seccion()}">
    ${glow(FUEGO, '50% 32%', '110% 48%')}
    <div style="position: relative;">
      ${eyebrow('Su lore es de venganza pura')}
      ${titulo('En realidad se llama<br><span style="color: ' + FUEGO + ';">Sarah Fortune</span>', 92)}


      ${pasos([
        'Su madre, <strong style="color:' + BONE + ';">Abigale Fortune</strong>, era una fabricante de armas famosa en Bilgewater',
        'Le enseñó a Sarah <strong style="color:' + BONE + ';">a hacer pistolas desde chiquita</strong>',
        'Un día llegó <strong style="color:' + BONE + ';">Gangplank</strong> al taller a encargarle <strong style="color:' + BONE + ';">dos pistolas poderosas</strong>',
        'Abigale aceptó y le dijo que <strong style="color:' + BONE + ';">en un año las tendría listas</strong>',
      ])}
    </div>
  </section>`);

// ── 3 · Lore II · La traición ────────────────────────────────────────────
slides.push(`
  <section data-label="La traición" data-screen-label="03 · La traición" data-speaker-notes="Y al ano Gangplank regreso, pero no traia intencion de pagar. Agarro las pistolas, y con esas mismas pistolas le disparo a Abigale, al esposo de Abigale, y a Sarah. Despues les quemo el taller." style="${seccion()}">
    ${glow(FUEGO, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('Al año regresó')}
      ${titulo('Y no traía<br><span style="color: ' + FUEGO + ';">intención de pagar</span>', 100)}

      <div data-golpe style="margin-top: 48px; padding: 44px 46px; border-radius: 22px; background: ${FUEGO}1A; border: 1px solid ${FUEGO}73;">
        <div style="font-family: ${DISPLAY}; font-size: 82px; line-height: 1.0; color: ${BONE};">Agarró las pistolas y<br><span style="color: ${FUEGO};">con esas mismas disparó</span></div>
      </div>

      <div style="margin-top: 36px; display: flex; gap: 16px;">
        ${['A Abigale', 'A su esposo', 'A Sarah'].map(v => `
        <div data-victima style="flex: 1; padding: 28px 18px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(232,85,46,0.32); text-align: center;">
          <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1.05; color: ${BONE};">${v}</span>
        </div>`).join('')}
      </div>

      ${remate('Y después <strong style="color: ' + FUEGO + ';">les quemó el taller</strong>.')}
    </div>
  </section>`);

// ── 4 · Lore III · Sobrevivió y se volvió Miss Fortune ───────────────────
slides.push(`
  <section data-label="Sobrevivió" data-screen-label="04 · Sobrevivió" data-speaker-notes="Pero Sarah sobrevivio de milagro y alcanzo a salir del incendio con las armas de su madre. Su cuerpo se recupero pero le quedaron los terrores nocturnos, el estres postraumatico y unas ganas enormes de vengarse. Ya de adolescente, con las armas reparadas, se metio al mundo del crimen. Su primer asesinato traia una recompensa enorme, y de ahi agarro mas carteles y en unos dias cobro todas esas cabezas. Asi se fue haciendo de fama en Bilgewater hasta que le empezaron a decir Miss Fortune." style="${seccion()}">
    ${glow(FUEGO, '50% 30%', '110% 46%')}
    <div style="position: relative;">
      ${eyebrow('Pero sobrevivió')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 88px; line-height: 0.94; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">Salió del incendio<br><span style="color: ${FUEGO};">con las armas de su madre</span></h2>
      ${pasos([
        'Su cuerpo se recuperó, pero le quedaron <strong style="color:' + BONE + ';">terrores nocturnos y estrés postraumático</strong>',
        'De adolescente, con las armas reparadas, <strong style="color:' + BONE + ';">se metió al mundo del crimen</strong>',
        'Su primer asesinato traía una recompensa enorme, y en unos días <strong style="color:' + BONE + ';">cobró todas esas cabezas</strong>',
        'Se hizo de fama en Bilgewater hasta que le empezaron a decir <strong style="color:' + BONE + ';">Miss Fortune</strong>',
      ])}
    </div>
  </section>`);

// ── 5 · Lore IV · La reina de Bilgewater ─────────────────────────────────
slides.push(`
  <section data-label="La reina de Bilgewater" data-screen-label="05 · La reina" data-speaker-notes="Y de ahi se puso a juntar aliados y a acumular poder hasta que pudo enfrentar a Gangplank. Le armo un plan que lo tumbo, y sin el, Sarah se quedo con el trono de la ciudad. Hoy es la reina de Bilgewater." style="${seccion()}">
    ${glow(ORO, '50% 40%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Y se fue por él', ORO)}
      ${titulo('Juntó aliados hasta que<br><span style="color: ' + ORO + ';">pudo enfrentarlo</span>', 88)}

      ${pasos([
        'Fue <strong style="color:' + BONE + ';">acumulando poder</strong> hasta poder enfrentar a Gangplank',
        'Le armó <strong style="color:' + BONE + ';">un plan que lo tumbó</strong>',
        'Y sin él, <strong style="color:' + BONE + ';">Sarah se quedó con el trono de la ciudad</strong>',
      ], ORO)}

      <div data-trono style="margin-top: 44px; padding: 40px 44px; border-radius: 22px; background: ${ORO}14; border: 1px solid ${ORO}73; text-align: center;">
        <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.95; color: ${ORO};">Hoy es la reina<br>de Bilgewater</div>
      </div>
    </div>
  </section>`);

// ── 6 · El remate: las mismas pistolas ───────────────────────────────────
// La cadena vuelve a su origen, así que la lámina lo dibuja: un arco SVG que
// sale del último eslabón y regresa al primero.
const cadena = [
  ['Su madre las fabricó', 'para Gangplank', MUTED],
  ['Gangplank mató con ellas', 'a Abigale, a su esposo y a Sarah', FUEGO],
  ['Sarah mata con ellas', 'hoy, como Miss Fortune', MAR],
];

slides.push(`
  <section data-label="Las mismas pistolas" data-screen-label="06 · El remate" data-speaker-notes="Y el detalle que me parece lo mejor de todo es que las pistolas con las que Miss Fortune mata son literalmente las que su mama le fabrico a Gangplank. Las mismas con las que el le disparo a su familia." style="${seccion()}">
    ${glow(MAR, '50% 42%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El detalle que remata todo', MAR)}
      ${titulo('Son <span style="color: ' + MAR + ';">las mismas pistolas</span>', 92)}

      <div style="margin-top: 46px; position: relative; padding-left: 120px;">
        <svg data-svg-arco viewBox="0 0 120 470" preserveAspectRatio="none" style="position: absolute; left: 0; top: 0; width: 120px; height: 470px; overflow: visible;">
          <path data-arco d="M 104 430 C 12 430, 12 40, 104 40" fill="none" stroke="${MAR}" stroke-width="4" stroke-linecap="round"></path>
          <path d="M 96 32 L 106 40 L 96 48" fill="none" stroke="${MAR}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-punta></path>
        </svg>

        <div style="display: flex; flex-direction: column; gap: 22px;">
          ${cadena.map(([cabeza, pie, color]) => `
          <div data-eslabon style="padding: 26px 30px; border-radius: 18px; background: ${color === MUTED ? 'rgba(255,255,255,0.04)' : color + '14'}; border: 1px solid ${color === MUTED ? 'rgba(255,255,255,0.10)' : color + '66'};">
            <div style="font-family: ${DISPLAY}; font-size: 52px; line-height: 1; color: ${color === MUTED ? BONE : color};">${cabeza}</div>
            <div style="margin-top: 6px; font-size: 25px; font-weight: 400; color: ${MUTED};">${pie}</div>
          </div>`).join('')}
        </div>
      </div>

      ${remate('Las pistolas con las que mata son <strong style="color: ' + MAR + ';">las que su madre le fabricó a Gangplank</strong>. Las mismas con las que él le disparó a su familia.', MAR)}
    </div>
  </section>`);

// ── 7 · El one trick: el número uno del planeta es latino ────────────────
slides.push(`
  <section data-label="El one trick #1" data-screen-label="07 · El OTP" data-speaker-notes="El mejor Miss Fortune del planeta es latino, del servidor del sur, y se llama El Gran Estafador. Trece millones doscientos cincuenta mil puntos de maestria y nivel mil siete." style="${seccion()}">
    ${glow(MAR, '50% 40%', '118% 58%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo', MAR)}
      ${titulo('Y por primera vez<br><span style="color: ' + MAR + ';">es de los nuestros</span>', 92)}

      <div data-tarjeta style="margin-top: 46px; padding: 40px 42px; border-radius: 22px; background: ${PANEL}D9; border: 1px solid ${MAR}59;">
        <div style="display: flex; align-items: center; gap: 26px;">
          <img data-retrato src="assets/icon-MissFortune.png" alt="Miss Fortune" style="width: 132px; height: 132px; border-radius: 50%; flex: none; border: 4px solid ${MAR}; box-shadow: 0 0 40px rgba(63,184,176,0.42);">
          <div style="min-width: 0;">
            <div style="font-family: ${DISPLAY}; font-size: 80px; line-height: 0.95; color: ${BONE};">EL GRAN ESTAFADOR</div>
            <div data-bandera style="margin-top: 10px; display: inline-flex; align-items: center; gap: 12px; padding: 7px 18px; border-radius: 999px; background: ${ORO}1F; border: 1px solid ${ORO};">
              <span style="font-size: 23px; font-weight: 800; letter-spacing: 2px; color: ${ORO};">LAS</span>
              <span style="font-size: 22px; font-weight: 600; color: ${BONE};">Latinoamérica Sur</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 34px; display: flex; gap: 18px;">
          ${[['#1', 'del planeta', ORO], ['13 254 949', 'puntos de maestría', MAR], ['1 007', 'nivel de maestría', MAR]].map(([cifra, pie, color]) => `
          <div data-cifra style="flex: 1; padding: 22px 16px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); text-align: center;">
            <div style="font-family: ${DISPLAY}; font-size: ${cifra.length > 8 ? 52 : 68}px; line-height: 1; color: ${color};">${cifra}</div>
            <div style="margin-top: 6px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${pie}</div>
          </div>`).join('')}
        </div>
      </div>

      ${remate('Es la <strong style="color: ' + ORO + ';">primera vez en la serie</strong> que el número uno del mundo es latino. Y su segunda campeona, Jinx, tiene <strong style="color: ' + BONE + ';">33 veces menos puntos</strong>.', MAR)}
    </div>
  </section>`);

// ── 8 · Pero nunca ha salido de Plata ────────────────────────────────────
// Seis temporadas, cuatro divisiones de Plata. La línea nunca sale de la banda.
const DIV = { 'Plata 4': 0, 'Plata 3': 1, 'Plata 2': 2, 'Plata 1': 3 };
const historial = [
  ['S8', 'Plata 3'], ['S9', 'Plata 4'], ['S2020', 'Plata 3'],
  ['S2021', 'Plata 2'], ['S2022', 'Plata 4'], ['S2026', 'Plata 4'],
];
// Coordenadas en PÍXELES del lienzo, no en un viewBox normalizado: con
// preserveAspectRatio="none" el SVG se escala distinto en X que en Y, y
// entonces getTotalLength() (que mide en unidades de usuario) no corresponde
// al trazo dibujado — el dasharray de la animación salía con huecos.
const PLOT_W = 762, PLOT_H = 160;          // 1080 − 168 de banda − 150 de eje
const yDiv = div => 144 - (DIV[div] / 3) * 128;   // 16 arriba, 144 abajo
const puntos = historial.map(([, div], i) => [
  ((i / (historial.length - 1)) * PLOT_W).toFixed(1),
  yDiv(div).toFixed(1),
]);
const linea = puntos.map(([x, y]) => `${x},${y}`).join(' ');

slides.push(`
  <section data-label="Nunca salió de Plata" data-screen-label="08 · La línea plana" data-speaker-notes="Pero wachen. Este cabron esta en Plata cuatro. Y no es de ahorita, es que en toda su historia jamas ha pasado de Plata dos. Y esta temporada lleva treinta y ocho por ciento de winrate con ella y un KDA de cero punto noventa y ocho." style="${seccion()}">
    ${glow(FUEGO, '50% 42%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Pero wachen', FUEGO)}
      ${titulo('Trece millones de puntos<br><span style="color: ' + FUEGO + ';">y sigue en Plata 4</span>', 82)}

      <div style="margin-top: 44px; position: relative; height: 400px; padding-left: 150px; box-sizing: border-box;">
        <!-- la escalera que nunca tocó -->
        ${[['Diamante', 0], ['Esmeralda', 1], ['Platino', 2], ['Oro', 3]].map(([nombre, i]) => `
        <div data-escalon style="position: absolute; left: 0; right: 0; top: ${i * 42}px; height: 40px; display: flex; align-items: center; gap: 16px;">
          <span style="flex: none; width: 134px; text-align: right; font-size: 22px; font-weight: 600; color: rgba(143,160,162,0.45);">${nombre}</span>
          <span style="flex: 1; height: 1px; background: rgba(255,255,255,0.05);"></span>
        </div>`).join('')}

        <!-- la banda de Plata, donde vivió siempre -->
        <div data-banda style="position: absolute; left: 150px; right: 0; top: 178px; height: 176px; border-radius: 14px; background: ${FUEGO}12; border: 1px solid ${FUEGO}4D;"></div>
        <div style="position: absolute; left: 0; top: 178px; height: 176px; width: 134px; display: flex; flex-direction: column; justify-content: space-between; text-align: right; font-size: 21px; font-weight: 600; color: ${MUTED};">
          <span>Plata 1</span><span>Plata 4</span>
        </div>

        <!-- la línea de sus seis temporadas -->
        <svg viewBox="0 0 ${PLOT_W} ${PLOT_H}" style="position: absolute; left: 150px; top: 186px; width: ${PLOT_W}px; height: ${PLOT_H}px; overflow: visible;">
          <polyline data-linea-rango points="${linea}" fill="none" stroke="${FUEGO}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
        </svg>
        ${puntos.map(([x, y]) => `
        <div data-nodo style="position: absolute; left: ${(150 + +x).toFixed(1)}px; top: ${(186 + +y).toFixed(1)}px; transform: translate(-50%, -50%); z-index: 2;">
          <span style="display: block; width: 20px; height: 20px; border-radius: 50%; background: ${FUEGO}; border: 3px solid ${BG};"></span>
        </div>`).join('')}

        <!-- temporadas -->
        <div style="position: absolute; left: 150px; right: 0; bottom: 0; display: flex; justify-content: space-between; font-size: 20px; font-weight: 600; color: ${MUTED};">
          ${historial.map(([t]) => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div data-stats style="margin-top: 24px; display: flex; gap: 18px;">
        ${[['38 %', 'de winrate con ella'], ['0,98', 'de KDA promedio'], ['80,97 %', 'del servidor por encima']].map(([cifra, pie]) => `
        <div style="flex: 1; padding: 20px 14px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <div style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${FUEGO};">${cifra}</div>
          <div style="margin-top: 4px; font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${pie}</div>
        </div>`).join('')}
      </div>

      ${remate('En <strong style="color: ' + FUEGO + ';">toda su historia registrada</strong> jamás ha pasado de Plata 2.')}
    </div>
  </section>`);

// ── 9 · Las skins ────────────────────────────────────────────────────────
const skins = [
  ['MissFortune_1.jpg', 'Vaquera'], ['MissFortune_2.jpg', 'Waterloo'],
  ['MissFortune_6.jpg', 'Ciudad del Crimen'], ['MissFortune_7.jpg', 'Arcadia'],
  ['MissFortune_8.jpg', 'Capitana'], ['MissFortune_9.jpg', 'Veraniega'],
  ['MissFortune_15.jpg', 'Guardiana Estelar'], ['MissFortune_16.jpg', 'Gatillera Galáctica'],
  ['MissFortune_17.jpg', 'Pijama Estelar'], ['MissFortune_21.jpg', 'Arruinada'],
  ['MissFortune_31.jpg', 'Conejita Guerrera'], ['MissFortune_40.jpg', 'Pacto Quebrantado'],
  ['MissFortune_50.jpg', 'Porcelana'], ['MissFortune_60.jpg', 'Reina Guerrera'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="09 · Las skins" data-speaker-notes="De skins nomas rapidito, porque de esto ya les hable en el video de Lux. Miss Fortune tiene veintidos skins en total y catorce que puedes comprar, y esas catorce te saldrian en unos ciento cuarenta y tres dolares, que son casi dos semanas de salario minimo. Es la mas cara de vestir de todos los cumpleaneros que llevamos. Y tiene una definitiva, la Gun Goddess, que vale ella sola dos mil setecientos setenta y cinco." style="${seccion()}">
    ${glow(ORO, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Nomás rapidito', ORO)}
      ${titulo('22 skins, y <span style="color: ' + ORO + ';">14 a la venta</span>', 88)}

      <div style="margin-top: 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;">
        ${skins.map(([img, nombre]) => `
          <div data-skin style="display: flex; flex-direction: column; gap: 6px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 128px; object-fit: cover; object-position: center 22%; border-radius: 10px; border: 1px solid rgba(239,196,90,0.24);">
            <span style="font-size: 18px; font-weight: 600; color: ${MUTED}; line-height: 1.15;">${nombre}</span>
          </div>`).join('')}
      </div>

      <div data-definitiva style="margin-top: 28px; display: flex; align-items: center; gap: 24px; padding: 22px 28px; border-radius: 18px; background: ${ORO}14; border: 1px solid ${ORO}73;">
        <img src="assets/MissFortune_16.jpg" alt="Gatillera Galáctica" style="width: 168px; height: 92px; object-fit: cover; object-position: center 26%; border-radius: 12px; flex: none;">
        <div style="min-width: 0;">
          <div style="font-family: ${DISPLAY}; font-size: 50px; line-height: 1; color: ${ORO};">Gatillera Galáctica · definitiva</div>
          <div style="margin-top: 6px; font-size: 25px; font-weight: 400; color: ${MUTED};">Ella sola vale <strong style="color: ${BONE};">2 775 RP</strong> — la única definitiva de toda la serie</div>
        </div>
      </div>

      <div data-precio style="margin-top: 30px; display: flex; align-items: flex-end; gap: 36px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 110px; line-height: 0.86; color: ${ORO};">~<span data-cuenta="143">143</span> <span style="font-size: 58px;">USD</span></div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las catorce · 18 615 RP · ~2 795 MXN</div>
        </div>
      </div>

      <div data-precio-nota style="margin-top: 24px; display: flex; align-items: center; gap: 26px;">
        <div style="flex: none;">
          <div style="font-family: ${DISPLAY}; font-size: 78px; line-height: 0.9; color: ${ORO};">8,9 días</div>
          <div style="font-size: 20px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">de salario mínimo</div>
        </div>
        <div style="width: 2px; height: 72px; background: ${ORO}4D;"></div>
        <div style="flex: 1; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Casi <strong style="color: ${ORO};">dos semanas de salario</strong>. <strong style="color: ${BONE};">La más cara de toda la serie</strong> — el segundo es Blitzcrank con 6,3.</div>
      </div>
    </div>
  </section>`);

// ── 10 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="10 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion('align-items: center; text-align: center;')}">
    ${portada('MissFortune_16.jpg', 'Miss Fortune Gatillera Galactica', 'center 16%')}
    ${glow(FUEGO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Dieciséis años de la Reina')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 128px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${FUEGO};">Sarah</span></h2>
      <div data-gigi style="margin-top: 54px; font-family: ${DISPLAY}; font-size: 108px; line-height: 1.0; color: ${ORO};">GIGI EASY</div>
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

  // Dibuja un trazo SVG midiendo su longitud real. El dasharray se pone aquí y
  // no en CSS: sin JS el trazo se ve completo, que es el estado correcto.
  function trazo(tl, el, pos, dur) {
    if (!el || !el.getTotalLength) return;
    var L = el.getTotalLength();
    gsap.set(el, { strokeDasharray: L });
    tl.from(el, { strokeDashoffset: L, duration: dur || 0.9, ease: 'power2.inOut' }, pos || 0);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 28, opacity: 0, duration: 0.55 }, 0.05)
      .from(q(s, '[data-linea]'), { y: 54, opacity: 0, duration: 0.8, stagger: 0.13 }, 0.18)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 }, 0.62);
  });

  animar('El encargo', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.14)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.36)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.39);
  });

  // La traición: el bloque del disparo entra de golpe y las tres víctimas caen
  // una por una detrás — el orden es el de los disparos.
  animar('La traición', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-golpe]'), { scale: 0.92, opacity: 0, duration: 0.5, ease: 'back.out(1.9)' }, 0.36)
      .from(q(s, '[data-victima]'), { y: 26, opacity: 0, duration: 0.42, stagger: 0.14 }, 0.72)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.24);
  });

  animar('Sobrevivió', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.9, opacity: 0, duration: 1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('h2'), { y: 30, opacity: 0, duration: 0.6 }, 0.16)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.38)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.41);
  });

  animar('La reina de Bilgewater', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-paso]'), { x: 26, opacity: 0, duration: 0.45, stagger: 0.11 }, 0.32)
      .from(q(s, '[data-paso-num]'), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.11, ease: 'back.out(2.2)' }, 0.35)
      .from(s.querySelector('[data-trono]'), { scale: 0.93, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.92);
  });

  // El remate: los tres eslabones entran en orden y HASTA EL FINAL se dibuja el
  // arco que regresa del último al primero. El trazo ES el chiste: el arma
  // vuelve a donde empezó.
  animar('Las mismas pistolas', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-eslabon]'), { x: 34, opacity: 0, duration: 0.5, stagger: 0.16 }, 0.3)
      .from(s.querySelector('[data-punta]'), { opacity: 0, duration: 0.3 }, 1.48)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.2);
    trazo(tl, s.querySelector('[data-arco]'), 0.9, 0.85);
  });

  animar('El one trick #1', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-tarjeta]'), { y: 34, opacity: 0, duration: 0.65 }, 0.32)
      .from(s.querySelector('[data-retrato]'), { scale: 0.7, duration: 0.55, ease: 'back.out(2)' }, 0.5)
      .from(s.querySelector('[data-bandera]'), { scale: 0.8, opacity: 0, duration: 0.45, ease: 'back.out(2.2)' }, 0.72)
      .from(q(s, '[data-cifra]'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.86)
      .from(s.querySelector('[data-remate]'), { y: 24, opacity: 0, duration: 0.55 }, 1.2);
  });

  // La línea plana: primero aparece la escalera que nunca tocó, luego la banda
  // de Plata, y encima se dibuja la línea de las seis temporadas. Que el trazo
  // no salga de la banda es todo el argumento.
  animar('Nunca salió de Plata', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-escalon]'), { opacity: 0, x: -18, duration: 0.4, stagger: 0.07 }, 0.3)
      .from(s.querySelector('[data-banda]'), { scaleY: 0, transformOrigin: '50% 50%', opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, 0.56)
      .from(q(s, '[data-nodo]'), { scale: 0, duration: 0.35, stagger: 0.07, ease: 'back.out(2.2)' }, 0.88)
      .from(s.querySelector('[data-stats]'), { y: 22, opacity: 0, duration: 0.5 }, 1.22)
      .from(s.querySelector('[data-remate]'), { y: 22, opacity: 0, duration: 0.5 }, 1.28);
    trazo(tl, s.querySelector('[data-linea-rango]'), 0.8, 0.8);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 24, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.035 }, 0.26)
      .from(s.querySelector('[data-definitiva]'), { x: 30, opacity: 0, duration: 0.55 }, 0.78)
      .from(s.querySelector('[data-precio]'), { y: 26, opacity: 0, duration: 0.55 }, 0.98)
      .from(s.querySelector('[data-precio-nota]'), { y: 22, opacity: 0, duration: 0.5 }, 1.14);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.98, 0.7);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.2)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.7);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Miss Fortune cumple 16 años</title>
${kit.og({ titulo: "Miss Fortune cumple 16 años", descripcion: "Dieciséis años de la Reina de Bilgewater: mata con las pistolas que su madre le fabricó a Gangplank, y el mejor Miss Fortune del planeta es latino y nunca ha salido de Plata. Apoyo visual para TikTok.", carpeta: "missfortune" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(232,85,46,0.45); border-radius: 999px;
    background: rgba(7,19,22,0.85); color: ${FUEGO}; cursor: pointer;
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
