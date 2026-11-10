// Generador de index.html — Ambessa cumple 2 años, formato «banda inferior»
// Ejecutar: node creator/ambessa/gen.js   ·   clips: node tools/laminas.mjs creator/ambessa --alfa=webm
//
// Serie «Cumplelolero» #31. **Segunda versión, para comparar** (6/11/2026): la primera
// (panel de 1080×1370 que el montaje reducía a 706 px, encima del watermark del
// campeón) quedó en el historial de git (commit e438ec3). Aquí la parte de abajo del
// video ES del deck, de borde a borde, y no hay watermark:
//
//   · El prereel de Reel Express deja libre una franja de 1080×680 desde y = 1240 (el
//     gameplay va de 297 a 1239). El deck sigue siendo de 1080×1920, pero declara su
//     panel en <deck-stage data-recorte="1080:680:0:1240">: laminas.mjs y la API del
//     estudio cortan con ese recorte y la caja sale {width: 1080, x: center, bottom: 0}.
//   · La banda es OPACA de borde a borde: dentro del panel no va nada con data-fondo,
//     así que con ?capa=…&alfa=1 (o --alfa) se ve igual. El único data-fondo del deck
//     es la guía «GAMEPLAY» de arriba, que nunca sale en los clips.
//   · Las mismas 23 láminas, con los mismos ids y el mismo guion-marcado.txt, más
//     `am-reposo` (data-reposo): la banda decorada sin dato con la que ReelForge llena
//     los huecos entre láminas.
//
// 🎯 **Flujo continuo.** Todas las láminas comparten un **riel** (líneas finas, marcas y
// destellos en oro) que en el PRIMER y en el ÚLTIMO cuadro está exactamente igual:
// mismo markup, mismas posiciones (kit.random con semilla) y cada cosa que se mueve
// vuelve a su estado. ReelForge funde las láminas pegadas en 0,25 s, así que el riel no
// se corta y solo cambia el contenido. No se usa data-continua a propósito: su pareja
// es la lámina anterior del deck, y en el montaje las láminas caen por palabra, con
// huecos y fuera de orden. Nada toca la <section> (ni `cortina` ni `iris` de lámina):
// las transiciones van dentro del panel, debajo del riel.
//
// 🎯 **Variedad** (pedidos de Axl del 6/11: «no siempre horizontal, mismo diseño» y,
// después, «no la misma línea siempre: la transición completa de una lámina a otra»).
//   · **Cada lámina entra con su transición, y las 24 son distintas**: mueven el
//     [data-contenido] entero (el riel queda encima, quieto). Iris desde la vela,
//     persianas verticales y horizontales, barrido diagonal, empuje, puertas, mosaico,
//     reloj, acercamiento desenfocado, tinta, tajo, quemado, volteo 3D, cortina desde
//     abajo y desde arriba, pixelado, glitch, alejamiento, caja, sube, giro, ventana,
//     iris desde la esquina y fundido (tabla TRANSICION de las coreografías).
//   · En el cuadro 0 de cada lámina se ve solo la banda vacía con el riel —igual en
//     todas— y la transición destapa la lámina: el fundido de 0,25 s de ReelForge va de
//     la lámina anterior a esa banda y la siguiente entra con su propia transición.
//   · Además cada lámina tiene su composición (a sangre, diagonal partida, abanico,
//     pantalla partida T1/KC, bento, carta que voltea, círculo, nombre en vertical,
//     fila de seis, rejilla de chromas…) y el dato su receta (letras, palabra, revuelto,
//     tragamonedas, sello, contador, impacto, rayo, duotono, confeti, brasas).
// La **imagen de cumpleaños** de Axl (`assets/cumple/cumple.jpg`, no es arte de Riot)
// sale tres veces con tres encuadres: portada, cierre y reposo.
// Todo dura 2,5 s como máximo; después el último cuadro queda congelado. Todo es
// determinista por seek (sin Math.random ni reloj; el mosaico usa random(semilla)).
//
// Arte: Data Dragon (splashes, pantallas de carga, tiles de 380 px y los íconos de la
// pasiva, Q, W, E y R, de 64 px ampliados 4× con Lanczos), CommunityDragon (los 12
// chromas de Elegida del Lobo y T1, y el emblema de Platino), el Bastión Inmortal de
// Noxus de Legends of Runeterra (copiado de guerras/) y los logos de T1 y KC de
// suiza-qf. Sin dinero, sin el récord del Mundial y sin inventar lore.
// ⚠️ Los íconos son de 64 px: la R va a 340 px y las otras cuatro a 150.
// ⚠️ `am-kc` dice «HOY»: el video se publica el 6/11 antes del T1 vs KC (16:00 CDMX).
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#120C0A';        // negro cálido
const ORO = '#C9A24A';       // las placas de su armadura
const ORO_CL = '#EBD596';
const CREMA = '#F4EBDD';
const T1_ROJO = '#E2012D';
const KC_AZUL = '#2FB4FF';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── El riel: idéntico en todas las láminas ───────────────────────────────
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-ambessa');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  const rombo = (cx, cy) => `<path d="M${cx} ${cy - 6} L${cx + 6} ${cy} L${cx} ${cy + 6} L${cx - 6} ${cy}Z" fill="${ORO}" fill-opacity=".7"/>`;
  // Seis destellos: tres arriba y tres abajo, cada uno en su tercio de la banda.
  const brillos = [0, 1, 2, 3, 4, 5].map((i) => {
    const arriba = i < 3, tercio = i % 3;
    const x = Math.round(70 + tercio * 330 + r() * 260), y = Math.round(arriba ? 52 + r() * 34 : 594 + r() * 34), s = Math.round(9 + r() * 9);
    const op = (0.45 + r() * 0.35).toFixed(2);
    return `<path data-brillo-riel data-x="${x}" data-y="${y}" d="${estrella(x, y, s)}" fill="${ORO_CL}" opacity="${op}"/>`;
  }).join('');
  return `
      <div data-riel style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to bottom, ${a(BG, 0.62)} 0, ${a(BG, 0)} 96px, ${a(BG, 0)} 584px, ${a(BG, 0.62)} 100%);"></div>
      <svg data-riel viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;">
        <g fill="none" stroke="${ORO}" stroke-linecap="round">
          <line x1="0" y1="20" x2="${PW}" y2="20" stroke-width="1.6" stroke-opacity=".7"/>
          <line x1="0" y1="28" x2="${PW}" y2="28" stroke-width=".8" stroke-opacity=".35"/>
          <line x1="0" y1="652" x2="${PW}" y2="652" stroke-width=".8" stroke-opacity=".35"/>
          <line x1="0" y1="660" x2="${PW}" y2="660" stroke-width="1.6" stroke-opacity=".7"/>
          <g stroke-width="1" stroke-opacity=".5">${marcas.join('')}</g>
        </g>
        ${rombo(540, 20)}${rombo(540, 660)}
        ${brillos}
      </svg>`;
})();

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${CREMA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Guía de dónde va el gameplay del prereel: solo para ver el deck en el navegador.
// Lleva data-fondo y queda fuera del recorte: nunca sale en un clip.
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(ORO, 0.16)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(CREMA, 0.14)};">GAMEPLAY</div>`;

function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return { x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0), y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0), z };
}

// Visor con la cámara declarada en `cam`: [cx0, cy0, z0, cx1, cy1, z1] (centro 0–1 y zoom sobre `cover`).
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', attrs = '', estilo = '' }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Imagen que llena su caja (object-fit: cover): la usan las recetas que copian o miden el <img>.
const foto = (src, alt, { pos = '50% 50%', filtro = '', attrs = '' } = {}) =>
  `<img ${attrs} src="assets/${src}" alt="${alt}" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: ${pos}; ${filtro}">`;

// Una caja posicionada en el panel.
const caja = (x, y, w, h, dentro, { rot = 0, attrs = '', estilo = '' } = {}) =>
  `<div ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px;${rot ? ` transform: rotate(${rot}deg);` : ''} ${estilo}">${dentro}</div>`;

// Una carta: marco fino de oro, sombra y la imagen adentro.
const carta = (x, y, w, h, dentro, { rot = 0, attrs = '' } = {}) => caja(x, y, w, h,
  `<div style="position: absolute; inset: 0; overflow: hidden; outline: 2px solid ${a(ORO, 0.8)}; outline-offset: -2px; box-shadow: 0 18px 50px rgba(0,0,0,0.75);">${dentro}</div>`, { rot, attrs });

// Fondo opaco hecho con la copia de 360 px desenfocada (NO es data-fondo).
const respaldo = (src, brillo = 0.42, attrs = '') => `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div ${attrs} style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(40px) saturate(1.15) brightness(${brillo});"></div></div>`;

const veloIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 42%, ${a(BG, 0)} 74%);"></div>`;
const veloAbajo = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, ${a(BG, 0.92)} 0%, ${a(BG, 0.55)} 34%, ${a(BG, 0)} 62%);"></div>`;

// Texto: solo el dato. `propio` = su entrada la hace la coreografía de la lámina.
const texto = (txt, { x, y, w, tam, clase = 'oro', tracking = 8, propio = false, attrs = '', alinear = 'center', color = '' }) => `
      <div data-dato${propio ? '="propio"' : ''} ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; box-sizing: border-box; text-align: ${alinear}; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;${color ? ` color: ${color}; text-shadow: 0 6px 30px rgba(14,8,6,0.9);` : ''}"><span class="${clase}">${txt}</span></div>`;

const luz = (cx, cy, tam, semilla) => `
      <div data-luz style="position: absolute; left: ${cx - tam / 2}px; top: ${cy - tam / 2}px; width: ${tam}px; height: ${tam}px; opacity: 0.75; pointer-events: none;">${kit.destello({ tam, rayos: 16, color: ORO_CL, semilla })}</div>`;

/**
 * El panel de la banda: [data-contenido] (arte → destello → dato → extra) → riel → chispas.
 * La transición de entrada de cada lámina mueve el [data-contenido] entero; el riel va encima
 * y no se mueve. `llegada` [x, y] es el centro del dato (destello y chispas).
 */
function panel({ arte, dato = '', llegada = null, semilla, extra = '' }) {
  return `
    <div data-panel${llegada ? ` data-llegada="${llegada.join(' ')}"` : ''} style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${arte}${llegada ? luz(llegada[0], llegada[1], 340, semilla) : ''}${dato}${extra}
      </div>${RIEL}
      <div data-chispas style="position: absolute; inset: 0; pointer-events: none;"></div>
    </div>`;
}

const lamina = (id, notasOrador, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}"${extra} style="${SECCION}">${GUIA}${cuerpo}
  </section>`;

const SP = { iw: 1215, ih: 717 };
const CENTRO = { x: 340, w: 400, h: PH, iw: 308, ih: 560 };
const splash = (n) => `splash/${n}.jpg`;
const carga = (n) => `skins/${n}.jpg`;
const CUMPLE = 'cumple/cumple.jpg';

const slides = [];

// ── 1 · am-portada ─── la imagen de cumpleaños; la cámara sale de la vela del 2 ──
slides.push(lamina('am-portada', 'Hace dos años salió Ambessa.', panel({ semilla: 'am-portada', llegada: [950, 300],
  arte: `${caja(0, 0, PW, PH, foto(CUMPLE, 'Ambessa celebrando su cumpleaños con un pastel de vela 2'), { attrs: 'data-focos', estilo: 'overflow: hidden;' })}${veloAbajo}`,
  dato: `${texto('2', { x: 830, y: 150, w: 240, tam: 300, propio: true, attrs: 'data-dos' })}
      ${texto('AMBESSA', { x: 40, y: 520, w: 640, tam: 120, clase: 'crema', tracking: 14, propio: true, alinear: 'left', attrs: 'data-nombre' })}` })));

// ── 2 · am-arcane ─── Mel en Arcane entra en rebanadas verticales ──
slides.push(lamina('am-arcane', 'Sale en Arcane.', panel({ semilla: 'am-arcane', arte: caja(0, 0, PW, PH, caja(0, 0, PW, PH, foto(splash('Mel_1'), 'Mel, Arcane: Concejal, splash', { pos: '42% 40%' }), { attrs: 'data-rebanadas', estilo: 'overflow: hidden;' }), { attrs: 'data-escala', estilo: 'overflow: hidden;' }) })));

// ── 3 · am-t1 ─── diagonal partida: el splash T1 a la derecha, DORAN se decodifica a la izquierda ──
slides.push(lamina('am-t1', 'Hoy juega T1 y Doran le dio su skin.', panel({ semilla: 'am-t1', llegada: [235, 340],
  arte: `
      <div style="position: absolute; inset: 0; background: radial-gradient(60% 80% at 15% 50%, ${a(T1_ROJO, 0.22)}, ${a(T1_ROJO, 0)} 70%);"></div>
      <div style="position: absolute; inset: 0; clip-path: polygon(40% 0, 100% 0, 100% 100%, 24% 100%);">
        <div data-cortinilla style="position: absolute; inset: 0;">${vista(splash('Ambessa_8'), 'Ambessa T1, splash', { ...SP, cam: [0.66, 0.42, 1.08, 0.72, 0.4, 1.02] })}</div>
      </div>
      <svg data-filo viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="432" y1="0" x2="259" y2="680" stroke="${ORO_CL}" stroke-width="4"/></svg>`,
  dato: texto('DORAN', { x: 10, y: 245, w: 470, tam: 190, tracking: 10, propio: true, attrs: 'data-revuelto' }) })));

// ── 4 · am-doran ─── abanico de tres cartas T1 y el 2-0 en tragamonedas ──
slides.push(lamina('am-doran', 'La sacó dos veces en el Mundial y ganó las dos.', panel({ semilla: 'am-doran', llegada: [850, 430],
  arte: `${respaldo('skins/Ambessa_8-fondo.jpg', 0.38)}
      <div data-mazo style="position: absolute; left: 0; top: 0; width: 640px; height: ${PH}px;">
        ${carta(50, 140, 230, 400, foto('tiles/Ambessa_8.jpg', 'Ambessa T1, tile'), { rot: -9 })}
        ${carta(205, 110, 230, 410, foto(carga('Ambessa_8'), 'Ambessa T1, pantalla de carga'), { rot: 0 })}
        ${carta(360, 140, 230, 400, foto(splash('Ambessa_8'), 'Ambessa T1, splash', { pos: '78% 40%' }), { rot: 9 })}
      </div>`,
  dato: `
      <div data-dato style="position: absolute; left: 750px; top: 70px; width: 200px;"><img src="assets/logos/T1.png" alt="Logo de T1" style="display: block; width: 200px; height: auto; filter: drop-shadow(0 8px 30px rgba(0,0,0,0.8));"></div>
      ${texto('2-0', { x: 640, y: 300, w: 420, tam: 260, clase: 'plano', tracking: 10, propio: true, attrs: 'data-tragamonedas', color: ORO_CL })}` })));

// ── 5 · am-kc ─── pantalla partida en diagonal, T1 contra KC; el HOY cae como sello ──
slides.push(lamina('am-kc', 'Hoy no es la excepción: les toca a los de Karmine.', panel({ semilla: 'am-kc', llegada: [540, 400],
  arte: `${vista(splash('Ambessa_8'), 'Ambessa T1, splash oscurecido', { ...SP, cam: [0.5, 0.5, 1, 0.56, 0.48, 1.06], filtro: 'filter: blur(8px) brightness(0.35);' })}
      <div data-lado="t1" style="position: absolute; inset: 0; clip-path: polygon(0 0, 58% 0, 42% 100%, 0 100%); background: linear-gradient(135deg, ${a('#3A0610', 0.92)}, ${a('#0E0406', 0.88)});">
        <img src="assets/logos/T1.png" alt="Logo de T1" style="position: absolute; left: 70px; top: 250px; width: 300px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));">
      </div>
      <div data-lado="kc" style="position: absolute; inset: 0; clip-path: polygon(58% 0, 100% 0, 100% 100%, 42% 100%); background: linear-gradient(225deg, ${a('#06253A', 0.92)}, ${a('#040A10', 0.88)});">
        <img src="assets/logos/KC.png" alt="Logo de Karmine Corp" style="position: absolute; left: 720px; top: 225px; width: 290px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));">
      </div>
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="626" y1="0" x2="454" y2="680" stroke="${ORO_CL}" stroke-width="5"/></svg>`,
  extra: `<div data-impacto style="position: absolute; inset: 0; pointer-events: none;">${kit.impacto({ ancho: PW, alto: PH, n: 52, color: ORO_CL, semilla: 'am-kc', hueco: 0.5, centro: [0.5, 0.59] })}</div>`,
  dato: `
      <div data-dato style="position: absolute; left: 290px; top: 64px; width: 500px; box-sizing: border-box; text-align: center; font-size: 96px; line-height: 1; letter-spacing: 10px; padding-left: 10px; white-space: nowrap; text-shadow: 0 6px 30px rgba(10,5,6,0.9);"><span style="color: #FF3355;">T1</span> <span style="color: ${CREMA};">VS</span> <span style="color: ${KC_AZUL};">KC</span></div>
      <div data-dato="propio" data-hoy style="position: absolute; left: 350px; top: 310px; width: 380px;">${kit.sello('HOY', { color: ORO_CL, ancho: 380, alto: 170, rotacion: -6, semilla: 9 })}</div>` })));

// ── 6 · am-popular ─── bento de cinco cortes de su arte ──
const celda = (dentro, extra = '') => `<div style="position: relative; overflow: hidden; outline: 2px solid ${a(ORO, 0.7)}; outline-offset: -2px; ${extra}">${dentro}</div>`;
slides.push(lamina('am-popular', 'Se ha popularizado muchísimo en competitivo y en rankeds.', panel({ semilla: 'am-popular', arte: `
      <div data-bento style="position: absolute; left: 40px; top: 52px; width: 1000px; height: 576px; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 12px;">
        ${celda(foto(splash('Ambessa_0'), 'Ambessa, splash base', { pos: '30% 40%' }), 'grid-column: span 2; grid-row: span 2;')}
        ${celda(foto('tiles/Ambessa_1.jpg', 'Ambessa Elegida del Lobo, tile'))}
        ${celda(foto('tiles/Ambessa_8.jpg', 'Ambessa T1, tile'))}
        ${celda(foto(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash', { pos: '70% 35%' }))}
        ${celda(foto('tiles/Ambessa_0.jpg', 'Ambessa, tile'))}
      </div>` })));

// ── 7 · am-ksante ─── la carta de Ambessa voltea y es K'Sante ──
slides.push(lamina('am-ksante', 'Caso contrario a K\'Sante.', panel({ semilla: 'am-ksante', arte: `${respaldo('skins/KSante_0-fondo.jpg', 0.42)}
      ${caja(365, 40, 350, 600, `
        <div data-voltea style="position: absolute; inset: 0; display: grid;">
          <div data-cara="frente" style="grid-area: 1 / 1; position: relative; overflow: hidden; outline: 2px solid ${a(ORO, 0.8)}; outline-offset: -2px; box-shadow: 0 18px 50px rgba(0,0,0,0.75);">${foto(carga('Ambessa_0'), 'Ambessa, pantalla de carga base')}</div>
          <div data-cara="dorso" style="grid-area: 1 / 1; position: relative; overflow: hidden; outline: 2px solid ${a(ORO, 0.8)}; outline-offset: -2px; box-shadow: 0 18px 50px rgba(0,0,0,0.75);">${foto(carga('KSante_0'), 'K\'Sante, pantalla de carga base')}</div>
        </div>`, { rot: -4 })}` })));

// ── 8 · am-ulti ─── la R cae como sello; la pasiva, Q, W y E se acomodan al lado ──
const icono = (n, alt) => `<div style="position: relative; overflow: hidden; outline: 2px solid ${a(ORO, 0.7)}; outline-offset: -2px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);"><img src="assets/iconos/Ambessa${n}.png" alt="${alt}" style="display: block; width: 100%; height: 100%;"></div>`;
slides.push(lamina('am-ulti', 'Es fácil esquivar su ulti.', panel({ semilla: 'am-ulti', llegada: [320, 340],
  arte: `${vista(splash('Ambessa_0'), 'Ambessa, splash base desenfocado', { ...SP, cam: [0.5, 0.5, 1, 0.5, 0.5, 1.1], filtro: 'filter: blur(16px) brightness(0.42) saturate(1.1);' })}
      <div data-habilidades style="position: absolute; left: 610px; top: 152px; width: 324px; height: 324px; display: grid; grid-template-columns: 150px 150px; grid-template-rows: 150px 150px; gap: 24px;">
        ${icono('P', 'Pasiva de Ambessa')}${icono('Q', 'Barrido Astuto, la Q de Ambessa')}${icono('W', 'Repudio, la W de Ambessa')}${icono('E', 'Lacerar, la E de Ambessa')}
      </div>`,
  extra: `<div data-impacto style="position: absolute; inset: 0; pointer-events: none;">${kit.impacto({ ancho: PW, alto: PH, n: 44, color: ORO_CL, semilla: 'am-ulti', hueco: 0.62, centro: [0.296, 0.5] })}</div>`,
  dato: `
      <div data-dato="propio" data-r style="position: absolute; left: 150px; top: 170px; width: 340px; height: 340px; box-shadow: 0 0 90px ${a(ORO, 0.4)}, 0 24px 70px rgba(0,0,0,0.75); outline: 3px solid ${ORO_CL}; outline-offset: -3px;"><img src="assets/iconos/AmbessaR.png" alt="Ejecución Pública, la R de Ambessa" style="display: block; width: 340px; height: 340px;"></div>` })));

// ── 9 · am-lore ─── la imagen centrada se destapa a tinta ──
slides.push(lamina('am-lore', 'Pasemos con su lore.', panel({ semilla: 'am-lore', arte: `${kit.tinta('tinta-lore', { ancho: PW, alto: PH, origen: [0.5, 0.42], semilla: 5 })}
      ${vista('centered/Ambessa_0.jpg', 'Ambessa, imagen centrada', { iw: 1280, ih: 720, cam: [0.5, 0.5, 1.2, 0.5, 0.4, 1.12], attrs: 'data-tinta' })}` })));

// ── 10 · am-espadas ─── un tajo dorado cruza y el arte entra en diagonal ──
slides.push(lamina('am-espadas', 'Recoger las espadas de los soldados muertos.', panel({ semilla: 'am-espadas', arte: `<div data-tajo style="position: absolute; inset: 0;">${vista(splash('Ambessa_0'), 'Ambessa, splash base: las espadas', { ...SP, cam: [0.72, 0.55, 1.18, 0.8, 0.5, 1.24] })}</div>`,
  extra: `<div data-rayo style="position: absolute; inset: 0; pointer-events: none;">${kit.rayo(['M40 700 L1040 -20', 'M-20 560 L760 -40'], { ancho: PW, alto: PH, color: ORO_CL, grosor: 7 })}</div>` })));

// ── 11 · am-general ─── el Bastión de Noxus se enciende a quemado y entra su carta de general ──
slides.push(lamina('am-general', 'Fue general bien joven.', panel({ semilla: 'am-general', arte: `${kit.quemado('quemado-general', { brasa: '#FF8A2A', semilla: 11 })}
      ${caja(0, 0, PW, PH, foto('noxus/bastion.jpg', 'El Bastión Inmortal de Noxus, Legends of Runeterra', { pos: '50% 45%', filtro: 'filter: brightness(0.8);' }), { attrs: 'data-quemado', estilo: 'overflow: hidden;' })}
      ${veloIzq}
      ${carta(700, 50, 320, 580, foto(carga('Ambessa_1'), 'Ambessa Elegida del Lobo, pantalla de carga'), { rot: 4, attrs: 'data-sube' })}` })));

// ── 12 · am-mel ─── madre e hija: dos cartas inclinadas una hacia la otra ──
slides.push(lamina('am-mel', 'Embarazada de Mel.', panel({ semilla: 'am-mel', arte: `${respaldo('skins/Mel_0-fondo.jpg', 0.42)}
      <div data-mazo style="position: absolute; inset: 0;">
        ${carta(235, 60, 300, 560, foto(carga('Ambessa_0'), 'Ambessa, pantalla de carga base'), { rot: -7 })}
        ${carta(545, 60, 300, 560, foto(carga('Mel_0'), 'Mel, pantalla de carga base'), { rot: 7 })}
      </div>` })));

// ── 13 · am-matriarca ─── retrato en círculo con dos anillos de oro ──
slides.push(lamina('am-matriarca', 'Se quedó como la jefa.', panel({ semilla: 'am-matriarca', arte: `${respaldo('skins/Ambessa_0-fondo.jpg', 0.32)}
      ${vista(carga('Ambessa_0'), 'Ambessa, pantalla de carga base', { x: 60, w: 250, h: PH, iw: 308, ih: 560, cam: [0.5, 0.5, 1.1, 0.5, 0.45, 1.16], filtro: 'filter: brightness(0.45) grayscale(0.4);' })}
      ${vista(carga('Ambessa_0'), 'Ambessa, pantalla de carga base', { x: 770, w: 250, h: PH, iw: 308, ih: 560, cam: [0.5, 0.5, 1.1, 0.5, 0.55, 1.16], filtro: 'filter: brightness(0.45) grayscale(0.4);' })}
      <div data-iris style="position: absolute; left: 320px; top: 100px; width: 440px; height: 440px; border-radius: 50%; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8);">${foto('tiles/Ambessa_0.jpg', 'Ambessa, el rostro', { pos: '50% 40%' })}</div>
      <svg data-anillos viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;" fill="none" stroke="${ORO_CL}">
        <circle cx="540" cy="320" r="232" stroke-width="4" transform="rotate(-90 540 320)"/><circle cx="540" cy="320" r="256" stroke-width="1.5" stroke-opacity=".6" transform="rotate(90 540 320)"/>
      </svg>` })));

// ── 14 · am-lobo ─── Elegida del Lobo, de duotono rojo a color ──
slides.push(lamina('am-lobo', 'Su lema es ser el Lobo en todo.', panel({ semilla: 'am-lobo', arte: `${kit.duotono('duotono-lobo', '#1A0507', '#E2584A')}
      ${caja(0, 0, PW, PH, caja(0, 0, PW, PH, foto(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash', { pos: '58% 42%' }), { attrs: 'data-duotono' }), { attrs: 'data-escala', estilo: 'overflow: hidden;' })}` })));

// ── 15 · am-piltover ─── persiana de arriba abajo y la cámara viaja de Mel a la ciudad ──
slides.push(lamina('am-piltover', 'Mandó a Mel a Piltóver.', panel({ semilla: 'am-piltover', arte: `<div data-persiana style="position: absolute; inset: 0;">${caja(0, 0, PW, PH, foto(splash('Mel_0'), 'Mel, splash base'), { attrs: 'data-focos', estilo: 'overflow: hidden;' })}</div>` })));

// ── 16 · am-caitlyn ─── el títere: de pixelado a nítido ──
slides.push(lamina('am-caitlyn', 'Usó a Caitlyn como su títere.', panel({ semilla: 'am-caitlyn', arte: caja(0, 0, PW, PH, caja(0, 0, PW, PH, foto(splash('Caitlyn_50'), 'Caitlyn Comandante, Arcane, splash', { pos: '50% 38%' }), { attrs: 'data-pixelado' }), { attrs: 'data-escala', estilo: 'overflow: hidden;' }) })));

// ── 17 · am-leblanc ─── LeBlanc entra con glitch: la que engaña ──
slides.push(lamina('am-leblanc', 'La mató LeBlanc.', panel({ semilla: 'am-leblanc', arte: `${kit.glitch('glitch-leblanc')}
      ${caja(0, 0, PW, PH, caja(0, 0, PW, PH, foto(splash('Leblanc_0'), 'LeBlanc, splash base', { pos: '45% 42%' }), { attrs: 'data-glitch' }), { attrs: 'data-escala', estilo: 'overflow: hidden;' })}` })));

// ── 18 · am-muerte ─── Mel se apaga a gris y suben brasas ──
slides.push(lamina('am-muerte', 'Murió en brazos de Mel.', panel({ semilla: 'am-muerte', arte: `${respaldo('skins/Mel_1-fondo.jpg', 0.45, 'data-borroso')}
      ${vista(carga('Mel_1'), 'Mel, Arcane: Concejal, pantalla de carga', { ...CENTRO, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1], filtro: 'filter: brightness(1) grayscale(0);' })}
      <div data-brasas style="position: absolute; inset: 0; pointer-events: none;"></div>` })));

// ── 19 · am-otp ─── el nombre en vertical, el emblema cae y la cifra cuenta ──
slides.push(lamina('am-otp', 'Demon King of Noxus, con más de cuatro millones de puntos, en Platino 4.', panel({ semilla: 'am-otp', llegada: [780, 340],
  arte: vista(splash('Ambessa_0'), 'Ambessa, splash base oscurecido', { ...SP, cam: [0.46, 0.5, 1, 0.52, 0.5, 1.08], filtro: 'filter: brightness(0.32);' }),
  dato: `
      <div style="position: absolute; left: -230px; top: 298px; width: 600px; height: 84px; transform: rotate(-90deg);">${texto('DEMONKINGOFNOXUS', { x: 0, y: 0, w: 600, tam: 70, clase: 'crema', tracking: 6, propio: true, attrs: 'data-letras' })}</div>
      <div data-dato="propio" data-emblema style="position: absolute; left: 150px; top: 196px; width: 330px;"><img src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="display: block; width: 330px; height: auto; filter: drop-shadow(0 0 40px rgba(120,220,210,0.4)) drop-shadow(0 20px 36px rgba(0,0,0,0.65));"></div>
      ${texto('4.245.731', { x: 500, y: 265, w: 560, tam: 150, tracking: 4, propio: true, attrs: 'data-contador' })}` })));

// ── 20 · am-seis ─── seis cartas, una por partida, en fila ──
slides.push(lamina('am-seis', 'Este año solo la ha jugado seis veces.', panel({ semilla: 'am-seis', llegada: [540, 470],
  arte: `${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash oscurecido', { ...SP, cam: [0.6, 0.5, 1, 0.52, 0.5, 1.08], filtro: 'filter: blur(14px) brightness(0.3);' })}
      <div data-fila style="position: absolute; left: 75px; top: 60px; width: 930px; height: 220px; display: grid; grid-template-columns: repeat(6, 140px); gap: 18px;">
        ${['0', '1', '8', '0', '1', '8'].map((n, i) => celda(foto(`tiles/Ambessa_${n}.jpg`, `Partida ${i + 1}`))).join('')}
      </div>`,
  dato: texto('6 PARTIDAS', { x: 0, y: 370, w: PW, tam: 190, tracking: 10 }) })));

// ── 21 · am-skins ─── el 2, sus dos skins en abanico y los doce chromas ──
const CHROMAS = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14].map((n) => 799000 + n);
slides.push(lamina('am-skins', 'De skins solo tiene dos.', panel({ semilla: 'am-skins', llegada: [130, 340],
  arte: `${respaldo('skins/Ambessa_1-fondo.jpg', 0.36)}
      <div data-mazo style="position: absolute; left: 230px; top: 0; width: 480px; height: ${PH}px;">
        ${carta(20, 120, 210, 390, foto(carga('Ambessa_1'), 'Ambessa Elegida del Lobo, pantalla de carga'), { rot: -5 })}
        ${carta(240, 120, 210, 390, foto(carga('Ambessa_8'), 'Ambessa T1, pantalla de carga'), { rot: 5 })}
      </div>
      <div data-chromas style="position: absolute; left: 715px; top: 64px; width: 330px; height: 552px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, 1fr); gap: 6px;">
        ${CHROMAS.map((id) => `<div style="position: relative; background: ${a(ORO, 0.08)}; outline: 1px solid ${a(ORO, 0.4)}; outline-offset: -1px;"><img src="assets/chromas/${id}.png" alt="Chroma ${id}" style="position: absolute; inset: 4px; width: calc(100% - 8px); height: calc(100% - 8px); object-fit: contain;"></div>`).join('')}
      </div>`,
  dato: texto('2', { x: 20, y: 150, w: 220, tam: 380, propio: true, attrs: 'data-dos' }) })));

// ── 22 · am-legendaria ─── la palabra es la ventana al arte ──
slides.push(lamina('am-legendaria', 'Elegida del Lobo, la primera campeona en salir con una legendaria.', panel({ semilla: 'am-legendaria', llegada: [380, 560],
  arte: `${kit.ventana('LEGENDARIA', { id: 'ventana-legendaria', ancho: PW, alto: PH, origen: [0.5, 0.5], tam: 300 })}
      ${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash: el rostro', { ...SP, cam: [0.7, 0.36, 1.2, 0.74, 0.3, 1.45], attrs: 'data-ventana' })}
      <div data-velo style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, ${a(BG, 0.9)} 0%, ${a(BG, 0.4)} 30%, ${a(BG, 0)} 55%);"></div>`,
  dato: texto('LEGENDARIA', { x: 40, y: 490, w: 700, tam: 140, tracking: 8, alinear: 'left' }) })));

// ── 23 · am-cierre ─── otra vez el cumpleaños, otro encuadre; GG EZ golpe a golpe y confeti ──
const veloDer = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(270deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 40%, ${a(BG, 0)} 70%);"></div>`;
slides.push(lamina('am-cierre', 'Ni pedo, solo queda decir gigi easy.', panel({ semilla: 'am-cierre', llegada: [790, 340],
  arte: `${caja(0, 0, PW, PH, foto(CUMPLE, 'Ambessa celebrando su cumpleaños', { pos: '50% 50%' }), { attrs: 'data-focos', estilo: 'overflow: hidden;' })}${veloDer}`,
  extra: `<div data-confeti style="position: absolute; inset: 0; pointer-events: none;">${kit.patron('confeti', { ancho: PW, alto: PH, paleta: [ORO, ORO_CL, '#E94B85', '#2FB4FF', '#E2012D'], semilla: 'am-cierre', cantidad: 46, tam: 1.1, hueco: [0.45, 0.2, 1, 0.8], estilo: `width: ${PW}px; height: ${PH}px;` })}</div>`,
  dato: texto('GG EZ', { x: 510, y: 215, w: 560, tam: 260, clase: 'plano', tracking: 8, propio: true, attrs: 'data-gg' }) })));

// ── 24 · am-reposo ─── la banda sin dato: el cumpleaños en penumbra, arriba (los globos) ──
slides.push(lamina('am-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', panel({ semilla: 'am-reposo', arte: caja(0, 0, PW, PH, foto(CUMPLE, 'Ambessa celebrando su cumpleaños, en penumbra', { pos: '50% 22%', filtro: 'filter: brightness(0.36) saturate(0.85);' }), { attrs: 'data-escala', estilo: 'overflow: hidden;' }) }), ' data-reposo'));

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Cada lámina entra con SU transición, que mueve el [data-contenido] entero (nunca la
// <section> ni el riel): en el cuadro 0 se ve solo la banda vacía con el riel —igual en
// todas— y la transición destapa la lámina. Las 24 son distintas (TRANSICION, abajo).
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  var PW = ${PW}, PH = ${PH};
  var DUR = 2.5;                    // ninguna lámina pasa de aquí

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo de cada [data-cam], en toda la lámina.
  function camara(tl, s) {
    q(s, '[data-cam]').forEach(function (img) {
      var v = img.parentNode, vw = +v.dataset.vw, vh = +v.dataset.vh, cw = +img.dataset.cw, ch = +img.dataset.ch;
      var c = img.dataset.cam.split(',').map(Number);
      var ini = encuadre(vw, vh, cw, ch, c[0], c[1], c[2]), fin = encuadre(vw, vh, cw, ch, c[3], c[4], c[5]);
      ini.transformOrigin = '0 0'; fin.transformOrigin = '0 0';
      fin.duration = DUR; fin.ease = 'power1.out'; fin.immediateRender = true;
      tl.fromTo(img, ini, fin, 0);
    });
    q(s, '[data-escala]').forEach(function (el) {
      tl.fromTo(el, { scale: 1.08 }, { scale: 1, transformOrigin: '50% 50%', duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
    });
  }

  // Una transición hecha con un valor p de 0 a 1 que se pinta en cada cuadro (clip-path o máscara).
  // Al terminar se limpia el estilo: el estado final es el contenido tal cual.
  function porProgreso(tl, el, dur, ease, pinta, prop) {
    var est = { p: 0 }, f = function () { pinta(est.p); };
    tl.fromTo(est, { p: 0 }, { p: 1, duration: dur, ease: ease, immediateRender: true, onUpdate: f, onReverseComplete: f }, 0);
    f();
    tl.set(el, prop, dur);
    return dur;
  }
  var r1 = function (v) { return v.toFixed(1); };
  var clip = function (el, v) { el.style.clipPath = v; };
  var mascara = function (el, v) { el.style.webkitMaskImage = v; el.style.maskImage = v; };

  // Las transiciones. Cada una devuelve cuándo termina (el contenido ya está completo).
  var T = {
    // Círculo que se abre desde un punto (la vela, la esquina…).
    iris: function (tl, c, o) {
      var R = Math.hypot(PW, PH);
      return porProgreso(tl, c, o.dur || 0.85, 'power2.inOut', function (p) { clip(c, 'circle(' + r1(p * R) + 'px at ' + o.origen + ')'); }, { clipPath: 'none' });
    },
    // Persianas: franjas que se abren a la vez (verticales u horizontales).
    persianas: function (tl, c, o) {
      var paso = o.paso || 120, ang = o.vertical ? 90 : 180;
      return porProgreso(tl, c, o.dur || 0.8, 'power2.inOut', function (p) {
        var w = r1(p * paso);
        mascara(c, 'repeating-linear-gradient(' + ang + 'deg, #000 0px, #000 ' + w + 'px, transparent ' + w + 'px, transparent ' + paso + 'px)');
      }, { maskImage: 'none', webkitMaskImage: 'none' });
    },
    // Barrido en diagonal, de izquierda a derecha.
    diagonal: function (tl, c, o) {
      var k = 300;
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) {
        var x = p * (PW + k);
        clip(c, 'polygon(0 0, ' + r1(x) + 'px 0, ' + r1(x - k) + 'px 100%, 0 100%)');
      }, { clipPath: 'none' });
    },
    // La lámina entra empujada desde la derecha.
    empuje: function (tl, c, o) {
      tl.fromTo(c, { x: PW }, { x: 0, duration: o.dur || 0.7, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.7;
    },
    // Dos puertas que se abren desde el centro.
    puertas: function (tl, c, o) {
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) { var m = r1((1 - p) * 50); clip(c, 'inset(0 ' + m + '% 0 ' + m + '%)'); }, { clipPath: 'none' });
    },
    // Mosaico: celdas de 135 × 136 que crecen desde su centro, en un orden de la semilla.
    mosaico: function (tl, c, o) {
      var cols = 8, filas = 5, cw = PW / cols, ch = PH / filas, celdas = [], r = random(o.semilla || 'mosaico');
      for (var i = 0; i < cols * filas; i++) celdas.push({ x: (i % cols) * cw, y: Math.floor(i / cols) * ch, t: r() * 0.55 });
      return porProgreso(tl, c, o.dur || 0.95, 'none', function (p) {
        var pts = ['0px 0px'];
        celdas.forEach(function (k) {
          var e = Math.min(1, Math.max(0, (p - k.t) / 0.45)); e = 1 - Math.pow(1 - e, 3);
          if (!e) return;
          var hw = cw * e / 2 + 0.5, hh = ch * e / 2 + 0.5, cx = k.x + cw / 2, cy = k.y + ch / 2;
          pts.push(r1(cx - hw) + 'px ' + r1(cy - hh) + 'px', r1(cx + hw) + 'px ' + r1(cy - hh) + 'px', r1(cx + hw) + 'px ' + r1(cy + hh) + 'px',
            r1(cx - hw) + 'px ' + r1(cy + hh) + 'px', r1(cx - hw) + 'px ' + r1(cy - hh) + 'px', '0px 0px');
        });
        clip(c, pts.length > 1 ? 'polygon(' + pts.join(', ') + ')' : 'polygon(0 0, 0 0, 0 0)');
      }, { clipPath: 'none' });
    },
    // Reloj: una manecilla barre la lámina desde las 12.
    reloj: function (tl, c, o) {
      var cx = PW / 2, cy = PH / 2, R = 1400;
      return porProgreso(tl, c, o.dur || 0.9, 'power2.inOut', function (p) {
        var pts = [cx + 'px ' + cy + 'px'], fin = p * 360;
        for (var a = 0; a <= fin; a += 6) pts.push(r1(cx + R * Math.sin(a * Math.PI / 180)) + 'px ' + r1(cy - R * Math.cos(a * Math.PI / 180)) + 'px');
        pts.push(r1(cx + R * Math.sin(fin * Math.PI / 180)) + 'px ' + r1(cy - R * Math.cos(fin * Math.PI / 180)) + 'px');
        clip(c, 'polygon(' + pts.join(', ') + ')');
      }, { clipPath: 'none' });
    },
    // Acercamiento desde lejos, desenfocado.
    acerca: function (tl, c, o) {
      tl.fromTo(c, { scale: 0.62, opacity: 0, filter: 'blur(18px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', transformOrigin: '50% 50%', duration: o.dur || 0.8, ease: 'entrada', immediateRender: true }, 0);
      tl.set(c, { filter: 'none' }, o.dur || 0.8);
      return o.dur || 0.8;
    },
    // Se aleja desde muy cerca mientras aparece (lento: es la muerte).
    aleja: function (tl, c, o) {
      tl.fromTo(c, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 45%', duration: o.dur || 1.1, ease: 'power2.out', immediateRender: true }, 0);
      return o.dur || 1.1;
    },
    // Las recetas del kit sobre la lámina entera.
    tinta: function (tl, c, o) { efecto('tinta', tl, c, { mascara: o.mascara, dur: o.dur || 1.05, en: 0, ease: 'power2.inOut' }); return o.dur || 1.05; },
    tajo: function (tl, c, o) { efecto('cortinilla', tl, c, { forma: 'tajo', dur: o.dur || 0.8, en: 0 }); return o.dur || 0.8; },
    quemado: function (tl, c, o) {
      efecto('quemado', tl, c, { filtro: o.filtro, dur: o.dur || 1.2, en: 0 });
      tl.set(c, { filter: 'none' }, o.dur || 1.2);   // con el umbral al tope todavía deja motas de brasa
      return o.dur || 1.2;
    },
    ventana: function (tl, c, o) {
      efecto('ventana', tl, c, { mascara: o.mascara, en: 0.15, dur: o.dur || 1.2, zoom: 12 });
      tl.set(c, { maskImage: 'none', webkitMaskImage: 'none' }, 0.15 + (o.dur || 1.2));
      return 0.15 + (o.dur || 1.2);
    },
    glitch: function (tl, c, o) {
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'steps(3)', immediateRender: true }, 0);
      efecto('glitch', tl, c, { filtro: o.filtro, dur: o.dur || 0.9, fuerza: 170, pasos: 12, en: 0 });
      tl.set(c, { filter: 'none' }, o.dur || 0.9);
      return o.dur || 0.9;
    },
    // Volteo en 3D: la lámina gira sobre su eje vertical.
    voltea: function (tl, c, o) {
      tl.fromTo(c, { rotationY: -88, opacity: 0.2 }, { rotationY: 0, opacity: 1, transformPerspective: 1500, transformOrigin: '0% 50%', duration: o.dur || 0.85, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.85;
    },
    // Cortina: se destapa desde un borde.
    cortina: function (tl, c, o) {
      var desde = { abajo: 'inset(100% 0 0 0)', arriba: 'inset(0 0 100% 0)' }[o.desde];
      tl.fromTo(c, { clipPath: desde }, { clipPath: 'inset(0% 0% 0% 0%)', duration: o.dur || 0.75, ease: 'power3.inOut', immediateRender: true }, 0);
      tl.set(c, { clipPath: 'none' }, o.dur || 0.75);
      return o.dur || 0.75;
    },
    // Caja que crece desde el centro.
    caja: function (tl, c, o) {
      return porProgreso(tl, c, o.dur || 0.75, 'power3.inOut', function (p) { var y = r1((1 - p) * 50), x = r1((1 - p) * 50); clip(c, 'inset(' + y + '% ' + x + '% ' + y + '% ' + x + '%)'); }, { clipPath: 'none' });
    },
    // La lámina sube desde abajo, como una carta que se desliza.
    sube: function (tl, c, o) {
      tl.fromTo(c, { y: PH }, { y: 0, duration: o.dur || 0.7, ease: 'entrada', immediateRender: true }, 0);
      return o.dur || 0.7;
    },
    // La lámina cae girando y se asienta.
    giro: function (tl, c, o) {
      tl.fromTo(c, { rotation: -14, scale: 0.55, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, transformOrigin: '50% 60%', duration: o.dur || 0.8, ease: 'asentar', immediateRender: true }, 0);
      return o.dur || 0.8;
    },
    // Lo único que hace el arte de la lámina: pixelado a nítido.
    pixelado: function (tl, c, o) { efecto('pixelado', tl, uno(c, '[data-pixelado]'), { desde: 96, pasos: 7, dur: o.dur || 1.2, en: 0 }); return o.dur || 1.2; },
    fundido: function (tl, c, o) {
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: o.dur || 1, ease: 'power1.inOut', immediateRender: true }, 0);
      return o.dur || 1;
    },
  };

  // Una transición distinta por lámina (24, ninguna repetida).
  var TRANSICION = {
    'am-portada': { tipo: 'iris', origen: '47% 70%' },            // se abre desde la vela del 2
    'am-arcane': { tipo: 'persianas', vertical: true, paso: 135 },
    'am-t1': { tipo: 'diagonal' },
    'am-doran': { tipo: 'empuje' },
    'am-kc': { tipo: 'puertas' },
    'am-popular': { tipo: 'mosaico', semilla: 'am-popular' },
    'am-ksante': { tipo: 'reloj' },
    'am-ulti': { tipo: 'acerca' },
    'am-lore': { tipo: 'tinta', mascara: 'tinta-lore' },
    'am-espadas': { tipo: 'tajo' },
    'am-general': { tipo: 'quemado', filtro: 'quemado-general' },
    'am-mel': { tipo: 'persianas', vertical: false, paso: 85 },
    'am-matriarca': { tipo: 'voltea' },
    'am-lobo': { tipo: 'cortina', desde: 'abajo' },
    'am-piltover': { tipo: 'cortina', desde: 'arriba' },
    'am-caitlyn': { tipo: 'pixelado' },
    'am-leblanc': { tipo: 'glitch', filtro: 'glitch-leblanc' },
    'am-muerte': { tipo: 'aleja' },
    'am-otp': { tipo: 'caja' },
    'am-seis': { tipo: 'sube' },
    'am-skins': { tipo: 'giro' },
    'am-legendaria': { tipo: 'ventana', mascara: 'ventana-legendaria' },
    'am-cierre': { tipo: 'iris', origen: '100% 100%', dur: 0.9 },
    'am-reposo': { tipo: 'fundido' },
  };

  // El dato genérico, el destello y las chispas, cuando la lámina ya entró.
  function dato(tl, s, t) {
    var p = uno(s, '[data-panel]');
    if (!p.dataset.llegada) return;
    var c = p.dataset.llegada.split(' ').map(Number);
    q(p, '[data-dato]:not([data-dato="propio"])').forEach(function (d, i) {
      tl.fromTo(d, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'entrada', immediateRender: true }, t + i * 0.08);
    });
    var l = uno(p, '[data-luz]');
    if (l) { efecto('destello', tl, l, { en: t, dur: 1.1 }); tl.to(l, { opacity: 0, duration: 0.5, ease: 'power1.in' }, t + 0.6); }
    efecto('chispas', tl, uno(p, '[data-chispas]'), { en: t + 0.05, dur: 0.95, n: 30, fuerza: 600, subida: 120,
      origen: (100 * c[0] / PW).toFixed(1) + ' ' + (100 * c[1] / PH).toFixed(1), color: '#FFF1C2,${ORO_CL},${ORO}' });
  }

  // Lo propio de cada lámina, a partir de t (cuando la transición ya destapó casi todo).
  var PROPIO = {
    'am-portada': function (tl, s, t) {
      efecto('camara', tl, uno(s, '[data-focos]'), { focos: '47 66 2.1; 46 52 1.3; 50 50 1', en: 0, dur: 0.95, pausa: 0.1 });
      efecto('letras', tl, uno(s, '[data-nombre]'), { en: t, escalon: 0.05, dur: 0.55 });
      efecto('palabra', tl, uno(s, '[data-dos]'), { en: t + 0.35, golpe: 1.6, duracion: 0.12 });
    },
    'am-t1': function (tl, s, t) {
      efecto('dibujo', tl, uno(s, '[data-filo]'), { dur: 0.6, en: 0.3 });
      efecto('revuelto', tl, uno(s, '[data-revuelto] span'), { dur: 1, en: t - 0.2 });
    },
    'am-doran': function (tl, s, t) {
      efecto('mazo', tl, uno(s, '[data-mazo]'), { dur: 0.7, escalon: 0.1, semilla: 'am-doran', en: 0.35 });
      efecto('tragamonedas', tl, uno(s, '[data-tragamonedas] span'), { dur: 1.15, en: t });
    },
    'am-kc': function (tl, s, t) {
      efecto('impacto', tl, uno(s, '[data-impacto]'), { en: t + 0.25, dur: 0.6 });
      efecto('sello', tl, uno(s, '[data-hoy] svg'), { en: t, temblor: 'no', desde: 2.2 });
    },
    'am-ksante': function (tl, s) { efecto('voltea', tl, uno(s, '[data-voltea]'), { en: 1.1, dur: 0.9 }); },
    'am-ulti': function (tl, s, t) {
      efecto('sello', tl, uno(s, '[data-r]'), { en: t, temblor: 'no', desde: 1.9 });
      efecto('impacto', tl, uno(s, '[data-impacto]'), { en: t + 0.4, dur: 0.6 });
      tl.fromTo(uno(s, '[data-habilidades]'), { opacity: 1 }, { opacity: 0.45, duration: 0.5, ease: 'power1.inOut', immediateRender: false }, t + 0.45);
    },
    'am-espadas': function (tl, s) { efecto('rayo', tl, uno(s, '[data-rayo]'), { dur: 0.55, escalon: 0.12, en: 0.55 }); },
    'am-general': function (tl, s, t) { tl.from(uno(s, '[data-sube]'), { y: 720, duration: 0.8, ease: 'entrada' }, t - 0.2); },
    'am-mel': function (tl, s) { efecto('mazo', tl, uno(s, '[data-mazo]'), { dur: 0.8, escalon: 0.14, semilla: 'am-mel', en: 0.5 }); },
    'am-matriarca': function (tl, s, t) { efecto('dibujo', tl, uno(s, '[data-anillos]'), { dur: 1.2, escalon: 0.2, en: t - 0.2 }); },
    'am-lobo': function (tl, s) { efecto('duotono', tl, uno(s, '[data-duotono]'), { filtro: 'duotono-lobo', hacia: 'color', dur: 1.5, en: 0.6 }); },
    'am-piltover': function (tl, s) { efecto('camara', tl, uno(s, '[data-focos]'), { focos: '30 42 1.55; 62 45 1.05', en: 0.5, dur: 1.6 }); },
    'am-muerte': function (tl, s) {
      tl.fromTo(uno(s, '[data-cam]'), { filter: 'brightness(1) grayscale(0)' }, { filter: 'brightness(0.24) grayscale(1)', duration: 1.1, ease: 'power1.in', immediateRender: true }, 1.4);
      tl.fromTo(uno(s, '[data-borroso]'), { opacity: 1 }, { opacity: 0.22, duration: 1.1, ease: 'power1.in', immediateRender: true }, 1.4);
      efecto('brasas', tl, uno(s, '[data-brasas]'), { en: 0.3, dur: 2.1, n: 30, color: '#FF8A3D,${ORO_CL}', semilla: 'am-muerte' });
    },
    'am-otp': function (tl, s, t) {
      efecto('letras', tl, uno(s, '[data-letras]'), { en: 0.35, escalon: 0.035, dur: 0.5 });
      efecto('sello', tl, uno(s, '[data-emblema]'), { en: t - 0.1, temblor: 'no', desde: 1.8 });
      efecto('contador', tl, uno(s, '[data-contador] span'), { cuenta: 4245731, separador: '.', dur: 1.3, en: t });
    },
    'am-seis': function (tl, s, t) { efecto('bento', tl, uno(s, '[data-fila]'), { dur: 0.45, escalon: 0.09, desde: 'start', escala: 0.5, en: t - 0.3 }); },
    'am-skins': function (tl, s, t) {
      efecto('bento', tl, uno(s, '[data-chromas]'), { dur: 0.45, escalon: 0.05, desde: 'end', en: t - 0.1 });
      efecto('palabra', tl, uno(s, '[data-dos]'), { en: t, golpe: 1.6, duracion: 0.12 });
    },
    'am-legendaria': function (tl, s, t) { tl.from(uno(s, '[data-velo]'), { opacity: 0, duration: 0.5 }, t - 0.2); },
    'am-cierre': function (tl, s, t) {
      efecto('camara', tl, uno(s, '[data-focos]'), { focos: '72 55 1.9; 50 66 1.5; 36 42 1.15', en: 0, dur: 0.75, pausa: 0.1 });
      efecto('palabra', tl, uno(s, '[data-gg] span'), { en: t, letras: 'si', escalon: 0.09, golpe: 1.45, color: '#FFF6D6', color2: '${ORO}' });
      efecto('piezas', tl, uno(s, '[data-confeti]'), { modo: 'cae', en: t - 0.1, dur: 0.85, abanico: 0.6, semilla: 'am-cierre' });
    },
  };

  Object.keys(TRANSICION).forEach(function (id) {
    animar(id, function (tl, s) {
      camara(tl, s);
      var tr = TRANSICION[id];
      var fin = T[tr.tipo](tl, uno(s, '[data-contenido]'), tr);
      var t = Math.max(0.35, fin - 0.15);          // el dato entra cuando la lámina ya está casi completa
      dato(tl, s, t);
      if (PROPIO[id]) PROPIO[id](tl, s, t);
      if (tl.duration() < DUR) tl.set({}, {}, DUR);
    });
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ambessa cumple 2 años</title>
${kit.og({ titulo: 'Ambessa cumple 2 años', descripcion: 'Cumplelolero #31 en banda inferior: la parte de abajo del video es del deck, de borde a borde, con un riel común que une las láminas y una transición distinta en cada una.', carpeta: 'creator/ambessa' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .oro { background: linear-gradient(180deg, #FFF6D6 0%, ${ORO_CL} 34%, ${ORO} 68%, #7A5E1E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 26px rgba(14,8,6,0.85)); }
  .crema { color: ${CREMA}; text-shadow: 0 6px 30px rgba(14,8,6,0.9); }
  .plano { display: inline-block; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(ORO, 0.5)}; border-radius: 999px;
    background: rgba(18,12,10,0.85); color: ${ORO_CL}; cursor: pointer;
    font: 600 13px/1 system-ui, sans-serif; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="abajo">
${slides.join('\n')}
</deck-stage>
${kit.banda()}
${kit.gsap(__dirname, ['SplitText'])}
${kit.efectos()}
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
