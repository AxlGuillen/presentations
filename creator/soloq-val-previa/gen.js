// Generador de index.html — «75 streamers, 22 días y 44 mil euros: arranca el SoloQ de Valorant»
// (canal Axelsine, domingo 16/11/2026)
// Ejecutar: node creator/soloq-val-previa/gen.js   ·   clips: node tools/laminas.mjs creator/soloq-val-previa --banda=arriba
//
// Sigue al pie de la letra el paquete `2026-11-16_arranca-el-soloq-de-valorant--paquete.md` (PKB de Axl):
//   · **Formato de jhin-letalidad** (banda ARRIBA): el riel, el panel, `dato`, la sección y la guía están
//     copiados de creator/jhin-letalidad/gen.js; cambia la paleta (VALORANT en vez del dorado de Jhin).
//   · **El torneo de verdad**: las capturas de soloqvalorant.com van recortadas (sin el aviso de cookies)
//     y enmarcadas como ventana de navegador, con la URL arriba, esquinas de 10 px y sombra. Las caras son
//     la foto de perfil de Twitch de cada participante, en círculo de 150 px con borde de 3 px.
//   · **Zona segura de la banda arriba**: nada de texto ni cifras en los primeros 180 px; el texto va de
//     y 180 a 640, entre x 60 y 960. Los fondos sí van a sangre.
//   · 🚫 **Nada de groserías ni chistes en pantalla, solo datos** (ni en las notas del orador). La opinión
//     sobre la web (la comparación con la de ElmilloR) va solo en la voz.
//   · Logos oficiales (VALORANT, TikTok), el ícono oficial de Radiante (valorant-api) y la bandera de
//     Argentina (Wikimedia Commons). Nada de íconos genéricos. Dinero: solo las cifras del torneo en euros.
//   · Ninguna lámina arranca en negro (el azul noche con el patrón se ve desde el cuadro 0) ni tarda más de
//     2,8 s en entrar.
//
// ⚠️ Recetas que el paquete pide y se cambiaron (anotadas también en el paquete):
//   · La tabla pide `letrero` en seis láminas, tres de ellas seguidas (sv-mixwell, sv-horcus, sv-sirmaza),
//     y `palabra` en tres; su propia regla dice que ninguna receta pasa de dos (salvo contador y maquina)
//     y que dos seguidas no repiten la principal. El MOLDE del letrero (foto, nombre, barra) se repite en
//     todos; la RECETA `letrero` solo en sv-septimo y sv-mixwell. Las demás:
//       - sv-horcus: la principal es `maquina` (las tres líneas se teclean); la foto cae con la curva golpe;
//       - sv-sirmaza: la principal es el `destello` detrás de CAMPEÓN;
//       - sv-black: entra desde la derecha con `cortinilla`;
//       - sv-kadnita: la bandera `ondea` a mano (no existe en el kit) y las líneas entran con `lineas`;
//       - sv-clips: la frase entra con `golpe` (palabra por palabra), no con `palabra`.
//   · `crece` del kit es el FLIP de una celda: las columnas de sv-ladders suben a mano (scaleY desde abajo,
//     curva `entrada`). `pulso` no existe: latido de escala con la curva golpe (nota de jhin-build).
//   · sv-jubilona: las caras caen con la curva golpe y al final se separan a mano; `rebanadas` del kit
//     parte una imagen en tiras y no separa elementos.
//   · `iris` (sv-web) va a mano sobre la ventana: el del kit recorta la <section> entera.
//   · `brillo` del kit es para texto: en sv-apuesta el ícono de Radiante lleva un barrido de luz a mano,
//     con la máscara del propio ícono.
//   · `data-paso` («entra cuando la voz lo nombra»): no hay voz alineada y las láminas duran 2,5 s, así
//     que los pasos van escalonados en el orden del guion; cada pieza lleva su data-paso.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (sección 1.5, VALORANT) ───────────────────────────────────────
const BG = '#0F1923';      // azul noche
const ROJO = '#FF4655';    // rojo VALORANT: lo protagonista (cifras clave, el 200 €, la apuesta)
const LUZ = '#ECE8E1';     // hueso: cifras y texto
const VERDE = '#53FC18';   // el verde de la web del torneo (medido en las capturas): botes y premios
const GRIS = '#5B6B78';    // lo secundario
const TARJ = '#16222D';    // tarjetas (un tono arriba del fondo)
const LINEA = '#2A3A48';   // bordes finos

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const UI = `'Archivo', system-ui, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── Datos (sección 5, verificados el 12/11/2026; seguidores de Twitch del 12/11) ──
const PREMIOS = { pro: 16000, pro1: 8000, elo: 6000, casual: 3000 };
const RETOS = [['OTP HUSH', 2500], ['MEJOR COSPLAY', 1000], ['RACHA DE DERROTAS', 200]];
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const eur = (n) => `${num(n)}&nbsp;€`;

// ── El riel (el de jhin-letalidad con los colores de VALORANT; kit.banda() lo invierte con la banda arriba) ──
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-soloq-val');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  const brillos = [0, 1, 2, 3].map((i) => {
    const lado = i < 2, cuarto = i % 2;
    const x = Math.round(80 + cuarto * 480 + r() * 380), y = Math.round(lado ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${lado ? ROJO : LUZ}" opacity="${(0.5 + r() * 0.3).toFixed(2)}"/>`;
  }).join('');
  return `
      <svg data-riel viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none; z-index: 20;">
        <g fill="none" stroke="${LUZ}" stroke-linecap="round">
          <line x1="0" y1="20" x2="${PW}" y2="20" stroke-width="1.6" stroke-opacity=".5"/>
          <line x1="0" y1="28" x2="${PW}" y2="28" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="652" x2="${PW}" y2="652" stroke-width=".8" stroke-opacity=".22"/>
          <line x1="0" y1="660" x2="${PW}" y2="660" stroke-width="1.6" stroke-opacity=".5"/>
          <g stroke-width="1" stroke-opacity=".34">${marcas.join('')}</g>
        </g>
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${ROJO}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${ROJO}"/>
        ${brillos}
      </svg>`;
})();

// ── El patrón de contornos de la web, imitado con SVG propio (kit.patron 'curvas') al 8 % ──
// Se escribe una vez en assets/contornos.svg (en línea, repetido en cada lámina, el index pesaba 740 KB).
fs.writeFileSync(path.join(__dirname, 'assets', 'contornos.svg'), kit.patron('curvas', { ancho: PW, alto: PH, paleta: [LUZ], semilla: 'soloq-val', niveles: 9, escala: 0.0024, grosor: 7 }).replace(/ data-pieza/g, '').replace('<svg ', '<svg width="1080" height="680" '), 'utf8');
const CONTORNOS = `<img src="assets/contornos.svg" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px; opacity: .08; pointer-events: none; display: block;">`;

// ── Piezas (de jhin-letalidad) ───────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

/** Texto: solo el dato. Siempre entre y 180 y 640, x 60 y 960 (zona segura de la banda arriba). */
const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true, nowrap = false, paso = null } = {}) => `
      <div${k ? ` data-k="${k}"` : ''}${paso != null ? ` data-paso="${paso}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.6);` : ''}${nowrap ? ' white-space: nowrap;' : ''}">${txt}</div>`;
/** Ordinal dibujado: Bebas no trae ª ni º (de blg-final). */
const ord = (n, l) => `${n}.<span style="display: inline-block; font-size: .5em; line-height: 1; vertical-align: .82em; border-bottom: .09em solid currentColor; margin-left: .03em;">${l}</span>`;
const VINETA_ROJA = `<div style="position: absolute; inset: 0; background: radial-gradient(80% 95% at 30% 60%, ${a(ROJO, 0.22)} 0%, ${a(ROJO, 0.06)} 50%, ${a(BG, 0)} 80%);"></div>`;

/** Layout B: captura enmarcada como ventana de navegador (x 60–1020, y 190–650): barra con la URL,
 *  esquinas de 10 px y sombra. La captura va a lo ancho de la ventana (escala `esc` de sus 1280 px) y
 *  `desde` es la fila de la captura (en px de la captura) que queda arriba. */
const V = { x: 60, y: 190, w: 960, h: 460, barra: 44 };
const ventana = (captura, { desde = 0, esc = V.w / 1280, izq = 0, k = 'ventana', alt = 'soloqvalorant.com, captura del 12/11/2026' } = {}) => `
      <div data-k="${k}" style="position: absolute; left: ${V.x}px; top: ${V.y}px; width: ${V.w}px; height: ${V.h}px; border-radius: 10px; overflow: hidden; background: #09060D; box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px ${a(LUZ, 0.12)};">
        <div style="position: absolute; left: 0; top: 0; width: 100%; height: ${V.barra}px; background: #1B2632; display: flex; align-items: center; gap: 8px; padding-left: 16px; box-sizing: border-box; z-index: 2;">
          <i style="width: 12px; height: 12px; border-radius: 50%; background: ${a(LUZ, 0.28)};"></i><i style="width: 12px; height: 12px; border-radius: 50%; background: ${a(LUZ, 0.2)};"></i><i style="width: 12px; height: 12px; border-radius: 50%; background: ${a(LUZ, 0.14)};"></i>
          <div style="margin-left: 18px; width: 560px; height: 28px; border-radius: 7px; background: ${BG}; display: flex; align-items: center; padding-left: 14px; box-sizing: border-box; font: 500 17px/1 ${UI}; letter-spacing: .3px; color: ${a(LUZ, 0.85)};">soloqvalorant.com</div>
        </div>
        <div style="position: absolute; left: 0; top: ${V.barra}px; width: 100%; height: ${V.h - V.barra}px; overflow: hidden;">
          <img data-captura src="assets/capturas/${captura}" alt="${alt}" style="position: absolute; left: ${-izq * esc}px; top: ${-desde * esc}px; width: ${1280 * esc}px; height: auto; max-width: none; display: block;">
        </div>
      </div>`;
/** Placa del dato sobre la ventana: fondo azul noche, filo rojo a la izquierda. */
const placa = (txt, { x, y, w, tam = 84, k = 'placa', alinear = 'left' } = {}) => `
      <div data-k="${k}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; box-sizing: border-box; padding: 16px 26px 12px; background: ${a(BG, 0.94)}; border-left: 8px solid ${ROJO}; box-shadow: 0 18px 44px rgba(0,0,0,.6); text-align: ${alinear}; font-size: ${tam}px; line-height: 1; letter-spacing: 4px; white-space: nowrap; z-index: 5;">${txt}</div>`;

/** Layout F: el molde del `letrero` del kit con la foto de Twitch en un círculo de 150 px y borde de 3 px. */
const perfil = (nombre, cara, { tam = 120, color = ROJO } = {}) => kit.letrero({ nombre, retrato: `assets/caras/${cara}.jpg`, color, tinta: LUZ, tam, fuente: DISPLAY, sombra: '0 6px 28px rgba(0,0,0,.45)' })
  .replace(/border:[\d.]+px solid/, 'border:3px solid')
  .replace(/width:150px;height:150px;border-radius:50%/, 'width:150px;height:150px;border-radius:50%;box-shadow:0 10px 30px rgba(0,0,0,.55)');
/** Ficha de categoría (PRO, ELO ALTO): texto con filo fino, como las pestañas de la web. */
const categoria = (txt, { x, y, k = 'categoria' }) => `
      <div data-k="${k}" style="position: absolute; left: ${x}px; top: ${y}px; padding: 10px 20px 6px; border: 2px solid ${a(LUZ, 0.7)}; font-size: 54px; line-height: 1; letter-spacing: 6px; white-space: nowrap;">${txt}</div>`;
/** Cara de Twitch suelta (layout G). */
const cara = (n, { tam = 150, paso = null, k = '' } = {}) => `<div${k ? ` data-k="${k}"` : ''}${paso != null ? ` data-paso="${paso}"` : ''} data-cara="${n}" style="width: ${tam}px; height: ${tam}px; border-radius: 50%; overflow: hidden; border: 3px solid ${ROJO}; box-sizing: border-box; box-shadow: 0 10px 30px rgba(0,0,0,.55); background: #000;"><img src="assets/caras/${n}.jpg" alt="${n}, foto de perfil de Twitch" style="width: 100%; height: 100%; object-fit: cover; display: block;"></div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      ${CONTORNOS}
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const flecha = (x, y, w = 70, color = a(LUZ, 0.75)) => `<svg viewBox="0 0 ${w} 40" style="position: absolute; left: ${x}px; top: ${y - 20}px; width: ${w}px; height: 40px; overflow: visible;"><path d="M4 20 H${w - 8} M${w - 24} 5 L${w - 6} 20 L${w - 24} 35" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const slides = [];

// ── 1 · sv-portada · A ─── 75 · 22 DÍAS · 44.000 € ── (contador, una tras otra)
const filaCifra = (k, cifra, etiqueta, y, color = LUZ) => `
      <div style="position: absolute; left: 60px; top: ${y}px; display: flex; align-items: baseline; gap: 22px; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.6);">
        <span data-k="${k}" style="font-size: 140px; line-height: 1; letter-spacing: 3px; color: ${color};">${cifra}</span><span data-k="${k}-etq" style="font-size: 60px; line-height: 1; letter-spacing: 6px;">${etiqueta}</span>
      </div>`;
slides.push(lamina('sv-portada', 'Setenta y cinco streamers, veintidós días y cuarenta y cuatro mil euros.', `
      <img data-k="logo" src="assets/logos/valorant-v.svg" alt="VALORANT" style="position: absolute; left: 880px; top: 200px; width: 80px; height: auto;">
      ${filaCifra('c75', '75', 'STREAMERS', 196)}
      ${filaCifra('c22', '22', 'DÍAS', 340)}
      ${filaCifra('c44', eur(44000), '', 484, ROJO)}`));

// ── 2 · sv-derrotas · A ─── 200 € a la peor racha de derrotas ── (sello + maquina)
slides.push(lamina('sv-derrotas', 'Te pagan doscientos euros si eres el que más pierde seguidas.', `
      ${VINETA_ROJA}
      <div style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;"><div data-k="cifra" style="position: absolute; left: 56px; top: 196px; font-size: 330px; line-height: .9; letter-spacing: 4px; color: ${ROJO}; white-space: nowrap; text-shadow: 0 10px 40px rgba(0,0,0,.6);">${eur(200)}</div></div>
      ${dato('<span data-k="linea">A LA PEOR RACHA DE DERROTAS</span>', { x: 62, y: 532, w: 900, tam: 72, tracking: 5, nowrap: true })}`));

// ── 3 · sv-arranca · B ─── web-inicio recortada a la cabecera y el «16 NOV» ── (empuje + letras)
slides.push(lamina('sv-arranca', 'Arranca el SoloQ de Valorant y lo vamos a seguir todos los días.', `
      ${ventana('web-inicio.webp', { esc: 0.96, desde: 70 })}
      ${placa(`<span data-k="f1" style="display: inline-block;">16/11</span><span data-k="flecha-fecha" style="display: inline-block; width: 84px; height: .6em; vertical-align: .12em; margin: 0 6px;"><svg viewBox="0 0 100 40" style="width: 100%; height: 100%; overflow: visible; display: block;"><path d="M8 20 H88 M70 5 L90 20 L70 35" fill="none" stroke="${LUZ}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span data-k="f2" style="display: inline-block; color: ${ROJO};">07/12</span>`, { x: 470, y: 524, w: 490, tam: 80, alinear: 'left' })}`));

// ── 4 · sv-clips · C ─── la cuenta empezó con clips de VALORANT ── (golpe + contador)
slides.push(lamina('sv-clips', 'Esta cuenta empezó subiendo clips de Valorant.', `
      ${dato('<span data-k="titulo" style="display: block;">ESTA CUENTA EMPEZÓ CON CLIPS DE VALORANT</span>', { x: 60, y: 190, w: 900, tam: 54, tracking: 3, alinear: 'center', nowrap: true })}
      <div data-k="logos" style="position: absolute; left: 90px; top: 318px; display: flex; align-items: center; gap: 44px;">
        <img src="assets/logos/valorant-v.svg" alt="VALORANT" style="width: 150px; height: auto; display: block;">
        <img src="assets/logos/tiktok.svg" alt="TikTok" style="width: 120px; height: auto; display: block;">
      </div>
      <div style="position: absolute; left: 440px; top: 286px; width: 3px; height: 300px; background: ${LINEA};"></div>
      ${dato('2022 <span style="color: ' + GRIS + ';">·</span> 2025', { x: 480, y: 290, w: 480, tam: 96, tracking: 5, k: 'anios', nowrap: true })}
      <div style="position: absolute; left: 478px; top: 400px; display: flex; align-items: baseline; gap: 18px; white-space: nowrap;">
        <span data-k="vistas" style="font-size: 170px; line-height: 1; letter-spacing: 3px; color: ${ROJO};">269</span><span data-k="vistas-etq" style="font-size: 62px; line-height: 1; letter-spacing: 4px;">MIL VISTAS</span>
      </div>`));

// ── 5 · sv-ediciones · C ─── línea de tiempo: 2021 · 2022 · 2026 ── (dibujo + data-paso)
const HITOS = [['2021', 'SIRMAZA', 210], ['2022', 'HORCUS', 540], ['2026', '?', 870]];
slides.push(lamina('sv-ediciones', 'Ya hubo uno en 2021 y otro en 2022, pero este es el primero que organiza Mixwell.', `
      ${dato('EDICIONES DEL SOLOQ DE VALORANT', { x: 60, y: 190, w: 900, tam: 56, tracking: 5, alinear: 'center', color: a(LUZ, 0.85), k: 'titulo' })}
      <svg data-k="linea" viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <path d="M100 420 H980" fill="none" stroke="${a(LUZ, 0.55)}" stroke-width="5" stroke-linecap="round"/>
        ${HITOS.map(([, , x], i) => `<circle cx="${x}" cy="420" r="16" fill="${BG}" stroke="${i === 2 ? ROJO : LUZ}" stroke-width="6"/>`).join('')}
      </svg>
      ${HITOS.map(([anio, quien, x], i) => `
      <div data-hito data-paso="${i + 1}" style="position: absolute; left: ${x - 150}px; top: 280px; width: 300px; text-align: center;">
        <div style="font-size: 104px; line-height: 1; letter-spacing: 4px; color: ${i === 2 ? ROJO : LUZ};">${anio}</div>
        <div style="margin-top: 70px; font-size: ${i === 2 ? 130 : 72}px; line-height: 1; letter-spacing: 5px; color: ${i === 2 ? ROJO : LUZ};">${quien}</div>
      </div>`).join('')}`));

// ── 6 · sv-septimo · F ─── Mixwell: 7.º en 2022, organiza y juega en 2026 ── (letrero + revuelto)
slides.push(lamina('sv-septimo', 'Mixwell quedó séptimo en el de 2022 y ahora se hizo su propio torneo.', `
      <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('MIXWELL', 'mixwell')}</div>
      ${dato(`2022: ${ord(7, 'O')} (INMORTAL 3)`, { x: 62, y: 392, w: 900, tam: 76, tracking: 4, color: GRIS, k: 'antes', nowrap: true })}
      ${dato('<span data-k="ahora" style="display: inline-block;">2026: ORGANIZA Y JUEGA</span>', { x: 62, y: 500, w: 900, tam: 100, tracking: 5, nowrap: true })}`));

// ── 7 · sv-reglas · H ─── cinco fichas de dato ── (bento por data-paso)
const REGLAS = [['SOLO SOLOQ', 'SIN DÚO NI EQUIPO'], ['8', 'PARTIDAS AL DÍA'], ['100', 'MÍNIMO PARA COBRAR'], ['STREAM + CÁMARA', 'PARTIDA COMPLETA'], ['CUENTA', 'QUE DA RIOT']];
const FICHA = { w: 284, h: 206, sep: 24 };
slides.push(lamina('sv-reglas', 'Solo SoloQ. Máximo ocho partidas al día y mínimo cien para cobrar. Todo en stream con cámara, con una cuenta que da Riot.', `
      <div data-k="fichas" style="position: absolute; left: 60px; top: 198px; width: 900px; display: flex; flex-wrap: wrap; justify-content: center; gap: ${FICHA.sep}px ${FICHA.sep}px;">
        ${REGLAS.map(([cifra, linea], i) => `<div data-paso="${i + 1}" style="width: ${FICHA.w}px; height: ${FICHA.h}px; box-sizing: border-box; padding: 26px 22px 0; background: ${TARJ}; border: 1px solid ${LINEA}; border-top: 4px solid ${ROJO}; border-radius: 6px; box-shadow: 0 14px 34px rgba(0,0,0,.45);">
          <div style="font-size: ${cifra.length > 6 ? 62 : 104}px; line-height: ${cifra.length > 6 ? 1.04 : 1}; letter-spacing: 3px; height: 108px; display: flex; align-items: flex-end;">${cifra}</div>
          <div style="margin-top: 16px; font-size: 36px; line-height: 1; letter-spacing: 2px; color: ${a(LUZ, 0.75)}; white-space: nowrap;">${linea}</div>
        </div>`).join('')}
      </div>`));

// ── 8 · sv-ladders · C ─── tres columnas como las de la web ── (suben a mano + contador + latido)
const COL = { w: 280, y: 258, h: 382 };
const columna = (k, nombre, bote, x, { pro = false } = {}) => `
      <div data-col data-k="${k}" style="position: absolute; left: ${x}px; top: ${COL.y}px; width: ${COL.w}px; height: ${COL.h}px; box-sizing: border-box; padding: 26px 24px 0; background: ${TARJ}; border: ${pro ? `2px solid ${VERDE}` : `1px solid ${LINEA}`}; border-radius: 6px; box-shadow: 0 14px 34px rgba(0,0,0,.45); transform-origin: 50% 100%;">
        <div data-nombre-col style="font-size: 78px; line-height: 1; letter-spacing: 4px; white-space: nowrap;">${nombre}</div>
        <div style="margin-top: 8px; font-size: 38px; line-height: 1; letter-spacing: 3px; color: ${GRIS};">25 STREAMERS</div>
        <div style="margin-top: 22px; font-size: 32px; line-height: 1; letter-spacing: 3px; color: ${a(LUZ, 0.7)};">BOTE</div>
        <div style="margin-top: 6px; font-size: 78px; line-height: 1; letter-spacing: 2px; color: ${VERDE}; white-space: nowrap;">${eur(bote)}</div>
        ${pro ? `<div style="margin-top: 16px; padding: 10px 14px 6px; background: ${a(ROJO, 0.14)}; border-left: 5px solid ${ROJO}; font-size: 54px; line-height: 1; letter-spacing: 2px; color: ${ROJO}; white-space: nowrap;">${ord(1, 'O')} <span data-k="primero">8.000</span>&nbsp;€</div>` : ''}
      </div>`;
slides.push(lamina('sv-ladders', 'Tres categorías de veinticinco. En la Pro el primer lugar se lleva ocho mil euros. Luego Elo alto y luego Casual.', `
      ${dato('PREMIOS POR LADDER', { x: 60, y: 190, w: 900, tam: 56, tracking: 6, alinear: 'center', color: a(LUZ, 0.85), k: 'titulo' })}
      ${columna('pro', 'PRO', PREMIOS.pro, 60, { pro: true })}
      ${columna('elo', 'ELO ALTO', PREMIOS.elo, 370)}
      ${columna('casual', 'CASUAL', PREMIOS.casual, 680)}`));

// ── 9 · sv-retos · A ─── tres tarjetas de reto con el estilo de la web ── (voltea por data-paso)
const RT = { w: 280, h: 300, y: 300 };
const reto = ([nombre, premio], i) => {
  const rojo = i === 2, x = 60 + i * (RT.w + 30), borde = rojo ? ROJO : VERDE;
  return `
      <div data-paso="${i + 1}" style="position: absolute; left: ${x}px; top: ${RT.y}px; width: ${RT.w}px; height: ${RT.h}px;">
        <div data-reto style="position: relative; width: 100%; height: 100%; display: grid;">
          <div data-cara="frente" style="grid-area: 1 / 1; box-sizing: border-box; background: ${TARJ}; border: 1px solid ${LINEA}; border-top: 3px solid ${borde}; border-radius: 6px; display: flex; align-items: center; justify-content: center;"><img src="assets/logos/valorant-v.svg" alt="" style="width: 110px; opacity: .25;"></div>
          <div data-cara="dorso" style="grid-area: 1 / 1; box-sizing: border-box; padding: 30px 24px 0; background: ${TARJ}; border: 1px solid ${LINEA}; border-top: 3px solid ${borde}; border-radius: 6px; box-shadow: 0 14px 34px rgba(0,0,0,.45);">
            <div style="font-size: ${nombre.length > 12 ? 60 : 70}px; line-height: 1; letter-spacing: 3px; height: 128px;">${nombre.replace('RACHA DE ', 'RACHA DE<br>').replace('MEJOR ', 'MEJOR<br>').replace('OTP ', 'OTP<br>')}</div>
            <div style="margin-top: 18px; font-size: 96px; line-height: 1; letter-spacing: 2px; color: ${rojo ? ROJO : VERDE}; white-space: nowrap;">${eur(premio)}</div>
          </div>
        </div>
      </div>`;
};
slides.push(lamina('sv-retos', 'Dos mil quinientos euros al que más partidas juegue con Hush, mil al mejor cosplay y doscientos a la peor racha de derrotas.', `
      ${dato('RETOS', { x: 60, y: 192, w: 600, tam: 84, tracking: 10, k: 'titulo' })}
      ${RETOS.map(reto).join('')}`));

// ── 10 · sv-mas-retos · B ─── web-retos: la rejilla de Retos Kick y los bonus ── (cortinilla + scroll)
slides.push(lamina('sv-mas-retos', 'Y hay como veinte retos más con premio.', `
      ${ventana('web-retos.webp', { desde: 930 })}
      ${placa(`<span data-k="n-retos">23</span> RETOS <span style="color: ${GRIS};">·</span> <span style="color: ${VERDE};">${eur(19000)}</span>`, { x: 60, y: 528, w: 560, tam: 84 })}`));

// ── 11 · sv-web · B ─── web-inicio completa ── (iris a mano + scroll largo)
slides.push(lamina('sv-web', 'La página web del torneo.', `
      ${ventana('web-inicio.webp', { desde: 0 })}
      ${placa('SOLOQVALORANT.COM', { x: 230, y: 534, w: 620, tam: 80, alinear: 'center' })}`));

// ── 12 · sv-chamba · A ─── Axl, desarrollador web ── (palabra + maquina)
slides.push(lamina('sv-chamba', 'Yo soy desarrollador web.', `
      ${VINETA_ROJA}
      ${dato('<span data-k="axl" style="display: inline-block;">AXL</span>', { x: 56, y: 186, w: 600, tam: 220, tracking: 10, color: ROJO })}
      ${dato('DESARROLLADOR WEB', { x: 62, y: 400, w: 900, tam: 96, tracking: 6, k: 'rol', nowrap: true })}
      ${dato('<span data-k="url">AXL13.DEV</span>', { x: 62, y: 518, w: 900, tam: 96, tracking: 8, color: a(LUZ, 0.9), nowrap: true })}`));

// ── 13 · sv-mixwell · F ─── 1,28 M en Twitch · PRO ── (letrero + contador)
slides.push(lamina('sv-mixwell', 'Mixwell, con más de un millón de seguidores en Twitch.', `
      <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('MIXWELL', 'mixwell')}</div>
      <div style="position: absolute; left: 60px; top: 380px; display: flex; align-items: baseline; gap: 22px; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.6);">
        <span style="font-size: 160px; line-height: 1; letter-spacing: 3px; color: ${ROJO};"><span data-k="seguidores">1,28</span>&nbsp;M</span><span data-k="twitch" style="font-size: 66px; line-height: 1; letter-spacing: 5px;">EN TWITCH</span>
      </div>
      ${categoria('PRO', { x: 790, y: 210 })}`));

// ── 14 · sv-horcus · F ─── campeón 2022, Radiant 645 RR, 2 meses lesionado ── (maquina; la foto cae con la curva golpe)
slides.push(lamina('sv-horcus', 'Horcus ganó el de 2022 y este año se perdió dos meses por una lesión.', `
      <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('HORCUS', 'horcus')}</div>
      ${dato('<span data-k="l1">CAMPEÓN 2022</span>', { x: 62, y: 384, w: 900, tam: 96, tracking: 5, nowrap: true })}
      ${dato('<span data-k="l2">RADIANT 645 RR</span>', { x: 62, y: 482, w: 900, tam: 66, tracking: 4, color: a(LUZ, 0.8), nowrap: true })}
      ${dato(`<span data-k="l3">2026: 2 MESES LESIONADO</span>`, { x: 62, y: 562, w: 900, tam: 66, tracking: 4, color: ROJO, nowrap: true })}`));

// ── 15 · sv-sirmaza · F ─── campeón 2021 ── (destello en CAMPEÓN)
slides.push(lamina('sv-sirmaza', 'SirMaza ganó el de 2021.', `
      <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('SIRMAZA', 'sirmaza')}</div>
      <div data-k="destello" style="position: absolute; left: ${300 - 280}px; top: ${470 - 280}px; pointer-events: none;">${kit.destello({ tam: 560, rayos: 18, color: '#FFD2D6', semilla: 'sirmaza' })}</div>
      ${dato('<span data-k="campeon" style="display: inline-block;">CAMPEÓN 2021</span>', { x: 56, y: 400, w: 900, tam: 170, tracking: 6, nowrap: true })}`));

// ── 16 · sv-jubilona · G ─── La Jubilona: cinco caras en fila ── (caen con la curva golpe; al final se separan)
const JUB = [['mixwell', 'MIXWELL'], ['horcus', 'HORCUS'], ['sirmaza', 'SIRMAZA'], ['borja', 'BORJA'], ['nixerino', 'NIXERINO']];
const JX = (PW - (5 * 150 + 4 * 36)) / 2;
slides.push(lamina('sv-jubilona', 'Mixwell, Horcus, SirMaza, Borja y Nixerino juegan juntos en La Jubilona, que en abril ganó el Premier; ahora los cinco están en la Pro.', `
      ${dato('LA JUBILONA', { x: 60, y: 186, w: 900, tam: 96, tracking: 8, alinear: 'center', k: 'titulo' })}
      ${dato('CAMPEONES DEL PREMIER (ABRIL 2026)', { x: 60, y: 284, w: 900, tam: 46, tracking: 4, alinear: 'center', color: a(LUZ, 0.8), k: 'premier', nowrap: true })}
      ${JUB.map(([n, nombre], i) => `
      <div data-jub data-paso="${i + 1}" style="position: absolute; left: ${JX + i * 186}px; top: 346px; width: 150px; text-align: center;">
        ${cara(n)}
        <div style="margin-top: 10px; font-size: 30px; line-height: 1; letter-spacing: 2px; white-space: nowrap;">${nombre}</div>
      </div>`).join('')}
      ${dato(`5 EN LA PRO <span style="color: ${GRIS};">·</span> <span style="color: ${VERDE};">8.000&nbsp;€</span> AL ${ord(1, 'O')}`, { x: 60, y: 574, w: 900, tam: 56, tracking: 4, alinear: 'center', k: 'pie', nowrap: true })}`));

// ── 17 · sv-black · F ─── Black, Elo alto, 952 mil en Twitch ── (cortinilla desde la derecha)
slides.push(lamina('sv-black', 'Black, también de La Jubilona, se fue a Elo alto con casi un millón de seguidores.', `
      <div data-k="grupo" style="position: absolute; inset: 0;">
        <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('BLACK', 'black')}</div>
        <div style="position: absolute; left: 60px; top: 380px; display: flex; align-items: baseline; gap: 22px; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.6);">
          <span data-k="seguidores" style="font-size: 160px; line-height: 1; letter-spacing: 3px; color: ${ROJO};">952</span><span style="font-size: 66px; line-height: 1; letter-spacing: 5px;">MIL EN TWITCH</span>
        </div>
        ${categoria('ELO ALTO', { x: 690, y: 210 })}
      </div>`));

// ── 18 · sv-kadnita · F ─── Kadnita, Argentina, Elo alto ── (la bandera ondea a mano + lineas)
const TIRAS = 12, BAND = { x: 700, y: 400, w: 260, h: 162 };
slides.push(lamina('sv-kadnita', 'De Latinoamérica solo encontré a Kadnita, que es argentina.', `
      <div data-k="letrero" style="position: absolute; left: 60px; top: 192px;">${perfil('KADNITA', 'kadnita')}</div>
      <div data-k="bandera" style="position: absolute; left: ${BAND.x}px; top: ${BAND.y}px; width: ${BAND.w}px; height: ${BAND.h}px; filter: drop-shadow(0 12px 26px rgba(0,0,0,.55));">
        ${Array.from({ length: TIRAS }, (_, i) => {
          const x0 = Math.floor((i * BAND.w) / TIRAS), x1 = Math.ceil(((i + 1) * BAND.w) / TIRAS);
          return `<div data-tira style="position: absolute; left: ${x0}px; top: 0; width: ${x1 - x0 + 1}px; height: ${BAND.h}px; overflow: hidden;"><img src="assets/iconos/argentina.svg" alt="${i ? '' : 'Bandera de Argentina'}" style="position: absolute; left: ${-x0}px; top: 0; width: ${BAND.w}px; height: ${BAND.h}px; max-width: none; display: block;"></div>`;
        }).join('')}
      </div>
      ${dato('<span data-k="lineas" style="display: block;">ARGENTINA<br>LA ÚNICA LATINA</span>', { x: 62, y: 400, w: 620, tam: 88, lh: 1.04, tracking: 5, nowrap: true })}
      ${categoria('ELO ALTO', { x: 690, y: 210 })}`));

// ── 19 · sv-apuesta · F ─── mi apuesta: Horcus; top 1 Radiant x6 ── (sello rojo + barrido de luz en el ícono)
slides.push(lamina('sv-apuesta', 'Mi apuesta es Horcus: seis veces top uno Radiant, regresa de una lesión y quiere su segundo título.', `
      ${VINETA_ROJA}
      <div style="position: absolute; left: 60px; top: 196px;">${cara('horcus', { k: 'cara' })}</div>
      <div style="position: absolute; left: 236px; top: 226px; font-size: 86px; line-height: 1; letter-spacing: 3px; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.6);"><span data-k="apuesta" style="display: inline-block; color: ${ROJO};">MI APUESTA:</span> <span data-k="horcus" style="display: inline-block;">HORCUS</span></div>
      <div data-k="radiante" style="position: absolute; left: 70px; top: 396px; width: 210px; height: 210px;">
        <img src="assets/iconos/radiante.png" alt="Radiante (VALORANT)" style="width: 100%; height: 100%; display: block; filter: drop-shadow(0 0 26px rgba(255,255,170,.35));">
        <div data-k="barrido" style="position: absolute; inset: 0; background: linear-gradient(110deg, transparent 38%, rgba(255,255,235,.9) 50%, transparent 62%); background-size: 260% 100%; background-position: 120% 0; -webkit-mask-image: url('assets/iconos/radiante.png'); mask-image: url('assets/iconos/radiante.png'); -webkit-mask-size: 100% 100%; mask-size: 100% 100%;"></div>
      </div>
      ${dato(`TOP 1 RADIANT <span style="color: ${ROJO};">X6</span>`, { x: 316, y: 440, w: 660, tam: 112, tracking: 5, k: 'top', nowrap: true })}`));

// ── 20 · sv-cierre · A ─── ¿quién gana? mañana: día 1 ── (palabra + chispas rojas)
slides.push(lamina('sv-cierre', 'Díganme quién creen que gana. Mañana arranca el día uno.', `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div style="position: absolute; inset: -40px; background-image: url('assets/capturas/web-pickem-caras.jpg'); background-size: cover; background-position: center; filter: blur(6px) brightness(.3);"></div></div>
      <div style="position: absolute; inset: 0; background: linear-gradient(90deg, ${a(BG, 0.85)} 0%, ${a(BG, 0.4)} 60%, ${a(BG, 0.1)} 100%);"></div>
      <div data-k="chispas" style="position: absolute; left: 0; top: 190px; width: 760px; height: 260px;"></div>
      ${dato('<span data-k="pregunta" style="display: inline-block;">¿QUIÉN GANA?</span>', { x: 56, y: 196, w: 900, tam: 200, tracking: 6, nowrap: true })}
      ${dato(`MAÑANA: <span style="color: ${ROJO};">DÍA 1</span>`, { x: 62, y: 430, w: 900, tam: 110, tracking: 6, k: 'manana', nowrap: true })}`));

// ── reposo · A ─── azul noche con el patrón ──
slides.push(lamina('sv-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${dato(`SOLOQ VALORANT · <span style="color: ${ROJO};">DÍA 0</span>`, { x: 60, y: 190, w: 600, tam: 48, tracking: 6, color: a(LUZ, 0.85) })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  var cae = function (tl, el, en) { if (el) tl.from(el, { y: -70, scale: 1.25, opacity: 0, duration: 0.5, ease: 'golpe' }, en); };
  // «pulso» no existe en el kit: latido de escala con la curva golpe (nota de jhin-build).
  var pulso = function (tl, el, en) { if (el) tl.to(el, { scale: 1.1, duration: 0.22, ease: 'golpe', yoyo: true, repeat: 1, transformOrigin: '0% 50%' }, en); };
  var muestra = function (tl, el, en) { if (el) tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, en); };
  var C = {
    'sv-portada': function (tl, s) {
      aparece(tl, k(s, 'logo'), 0, 0.4);
      // Las tres cifras, una tras otra, desde 0.
      [['c75', 75, 0.1], ['c22', 22, 0.65], ['c44', 44000, 1.2]].forEach(function (c) {
        muestra(tl, k(s, c[0]).parentNode, c[2]);
        efecto('contador', tl, k(s, c[0]), { en: c[2], dur: 1.0, cuenta: c[1], separador: '.', sufijo: c[0] === 'c44' ? '\\u00A0€' : '' });
      });
    },
    'sv-derrotas': function (tl, s) {
      efecto('sello', tl, k(s, 'cifra'), { en: 0.2, fuerza: 12 });
      efecto('maquina', tl, k(s, 'linea'), { en: 0.85, ritmo: 0.035, cursor: 'no' });
    },
    'sv-arranca': function (tl, s) {
      tl.from(k(s, 'ventana'), { opacity: 0, y: 30, duration: 0.5, ease: 'entrada' }, 0);
      efecto('empuje', tl, k(s, 'ventana').querySelector('[data-captura]').parentNode, { desde: 1.15, origen: '15% 40%', dur: 2.5 });
      aparece(tl, k(s, 'placa'), 0.9, 0.35);
      efecto('letras', tl, k(s, 'f1'), { en: 1.05, dur: 0.5 });
      aparece(tl, k(s, 'flecha-fecha'), 1.35, 0.3);
      efecto('letras', tl, k(s, 'f2'), { en: 1.45, dur: 0.5 });
    },
    'sv-clips': function (tl, s) {
      efecto('golpe', tl, k(s, 'titulo'), { en: 0.05, escalon: 0.12 });
      tl.from(k(s, 'logos').children, { opacity: 0, scale: 0.8, duration: 0.45, ease: 'asentar', stagger: 0.15 }, 0.6);
      aparece(tl, k(s, 'anios'), 0.9, 0.4);
      muestra(tl, k(s, 'vistas').parentNode, 1.15);
      efecto('contador', tl, k(s, 'vistas'), { en: 1.15, dur: 1.2, cuenta: 269 });
    },
    'sv-ediciones': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      efecto('dibujo', tl, k(s, 'linea'), { en: 0.2, dur: 0.9, escalon: 0.25 });
      // data-paso: cada hito cuando la voz lo nombra (2021, 2022, el de Mixwell).
      q(s, '[data-hito]').forEach(function (el, i) { aparece(tl, el, 0.45 + i * 0.5, 0.4); });
    },
    'sv-septimo': function (tl, s) {
      efecto('letrero', tl, k(s, 'letrero').firstElementChild, { en: 0.1 });
      aparece(tl, k(s, 'antes'), 0.75, 0.4);
      muestra(tl, k(s, 'ahora'), 1.2);
      efecto('revuelto', tl, k(s, 'ahora'), { en: 1.2, dur: 0.9 });
    },
    'sv-reglas': function (tl, s) {
      // data-paso: una ficha por regla, en el orden de la voz.
      efecto('bento', tl, k(s, 'fichas'), { desde: 'start', escalon: 0.38, dur: 0.5, en: 0.1 });
    },
    'sv-ladders': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      // La «crece» del paquete: las columnas suben desde abajo con la curva entrada.
      tl.from(q(s, '[data-col]'), { scaleY: 0, opacity: 0, duration: 0.7, ease: 'entrada', stagger: 0.2 }, 0.2);
      efecto('contador', tl, k(s, 'primero'), { en: 0.9, dur: 1.0, cuenta: 8000, separador: '.' });
      pulso(tl, k(s, 'casual').querySelector('[data-nombre-col]'), 2.0);
    },
    'sv-retos': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      // data-paso: cada tarjeta voltea cuando la voz la nombra.
      q(s, '[data-reto]').forEach(function (el, i) { efecto('voltea', tl, el, { en: 0.2 + i * 0.5, dur: 0.8 }); });
    },
    'sv-mas-retos': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'ventana'), { direccion: 'derecha', dur: 0.7, en: 0 });
      // Desplazamiento lento hacia abajo, como un scroll, durante la entrada.
      tl.to(k(s, 'ventana').querySelector('[data-captura]'), { y: -400, duration: 2.5, ease: 'power1.inOut' }, 0.15);
      aparece(tl, k(s, 'placa'), 0.8, 0.4);
      muestra(tl, k(s, 'n-retos'), 0.85);
      efecto('contador', tl, k(s, 'n-retos'), { en: 0.85, dur: 1.0, cuenta: 23 });
    },
    'sv-web': function (tl, s) {
      // El iris del paquete, a mano sobre la ventana (el del kit recorta la sección entera).
      tl.fromTo(k(s, 'ventana'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.0, ease: 'power3.inOut', immediateRender: true }, 0.05);
      tl.to(k(s, 'ventana').querySelector('[data-captura]'), { y: -560, duration: 2.0, ease: 'power2.inOut' }, 0.6);
      aparece(tl, k(s, 'placa'), 1.0, 0.4);
    },
    'sv-chamba': function (tl, s) {
      efecto('palabra', tl, k(s, 'axl'), { en: 0.15 });
      aparece(tl, k(s, 'rol'), 0.4, 0.4);
      // El cursor parpadea al terminar: el tecleo arranca en 0,6 para que todo acabe antes de 2,8 s.
      efecto('maquina', tl, k(s, 'url'), { en: 0.6, ritmo: 0.05, color: '${ROJO}' });
    },
    'sv-mixwell': function (tl, s) {
      efecto('letrero', tl, k(s, 'letrero').firstElementChild, { en: 0.1 });
      muestra(tl, k(s, 'seguidores').parentNode.parentNode, 0.75);
      efecto('contador', tl, k(s, 'seguidores'), { en: 0.75, dur: 1.2, cuenta: 1.28, decimales: 2 });
      aparece(tl, k(s, 'categoria'), 1.4, 0.4);
    },
    'sv-horcus': function (tl, s) {
      var l = k(s, 'letrero');
      cae(tl, l.querySelector('[data-retrato]'), 0.05);
      tl.from(l.querySelector('[data-barra]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'entrada' }, 0.25);
      aparece(tl, l.querySelector('[data-nombre]'), 0.3, 0.35);
      ['l1', 'l2', 'l3'].forEach(function (n, i) { efecto('maquina', tl, k(s, n), { en: 0.7 + i * 0.55, ritmo: 0.035, cursor: 'no' }); });
    },
    'sv-sirmaza': function (tl, s) {
      var l = k(s, 'letrero');
      tl.from(l.querySelector('[data-retrato]'), { opacity: 0, scale: 0.85, duration: 0.45, ease: 'asentar' }, 0.05);
      tl.from(l.querySelector('[data-barra]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'entrada' }, 0.2);
      aparece(tl, l.querySelector('[data-nombre]'), 0.25, 0.35);
      efecto('destello', tl, k(s, 'destello'), { en: 0.75, dur: 1.5, semilla: 'sirmaza' });
      tl.from(k(s, 'campeon'), { opacity: 0, scale: 1.15, transformOrigin: '0% 60%', duration: 0.4, ease: 'golpe' }, 0.85);
    },
    'sv-jubilona': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35); aparece(tl, k(s, 'premier'), 0.2, 0.35);
      var caras = q(s, '[data-jub]');
      // data-paso: cada cara cae con la curva golpe cuando la voz la nombra.
      caras.forEach(function (el, i) { cae(tl, el, 0.35 + i * 0.25); });
      aparece(tl, k(s, 'pie'), 1.5, 0.4);
      // Al final se separan hacia los lados (a mano: rebanadas del kit parte imágenes, no elementos).
      caras.forEach(function (el, i) { tl.to(el, { x: (i - 2) * 14, duration: 0.5, ease: 'power3.out' }, 2.0); });
    },
    'sv-black': function (tl, s) {
      // Entra desde la derecha: va aparte del grupo.
      efecto('cortinilla', tl, k(s, 'grupo'), { direccion: 'izquierda', dur: 0.8, en: 0.05 });
      tl.from(k(s, 'grupo'), { x: 90, duration: 0.8, ease: 'power3.out' }, 0.05);
      muestra(tl, k(s, 'seguidores'), 0.8);
      efecto('contador', tl, k(s, 'seguidores'), { en: 0.8, dur: 1.2, cuenta: 952 });
    },
    'sv-kadnita': function (tl, s) {
      aparece(tl, k(s, 'letrero'), 0.05, 0.45);
      aparece(tl, k(s, 'categoria'), 0.3, 0.4);
      // «ondea» no existe en el kit: cada tira de la bandera sube y baja con un desfase que se apaga.
      q(s, '[data-tira]').forEach(function (t, i) {
        tl.to(t, { keyframes: [{ y: -16, duration: 0.3, ease: 'sine.inOut' }, { y: 12, duration: 0.3, ease: 'sine.inOut' }, { y: -6, duration: 0.3, ease: 'sine.inOut' }, { y: 0, duration: 0.3, ease: 'sine.inOut' }] }, 0.4 + i * 0.06);
      });
      tl.from(k(s, 'bandera'), { opacity: 0, x: 40, duration: 0.45, ease: 'entrada' }, 0.3);
      efecto('lineas', tl, k(s, 'lineas'), { en: 0.7, dur: 0.8, escalon: 0.3 });
    },
    'sv-apuesta': function (tl, s) {
      tl.from(k(s, 'cara'), { opacity: 0, scale: 0.85, duration: 0.4, ease: 'asentar' }, 0);
      efecto('sello', tl, k(s, 'apuesta'), { en: 0.25, fuerza: 10 });
      aparece(tl, k(s, 'horcus'), 0.8, 0.35);
      tl.from(k(s, 'radiante'), { opacity: 0, scale: 0.8, duration: 0.5, ease: 'asentar' }, 1.0);
      // El «brillo» del paquete sobre el ícono: barrido de luz a mano con la máscara del ícono.
      tl.fromTo(k(s, 'barrido'), { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', duration: 1.0, ease: 'power2.inOut', immediateRender: true }, 1.4);
      aparece(tl, k(s, 'top'), 1.2, 0.4);
    },
    'sv-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'pregunta'), { en: 0.3 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 0.35, dur: 1.4, color: '${ROJO},#FF9AA2,#FFFFFF', origen: '35 50', semilla: 'soloq-val' });
      aparece(tl, k(s, 'manana'), 1.0, 0.45);
    },
    'sv-reposo': function () {},
  };
  Object.keys(C).forEach(function (id) {
    animar(id, function (tl, s) {
      C[id](tl, s);
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
<title>Arranca el SoloQ de Valorant</title>
${kit.og({ titulo: 'Arranca el SoloQ de Valorant', descripcion: '75 streamers, 22 días y 44.000 €: la previa del SoloQ Challenge de VALORANT de Mixwell (16/11 → 07/12/2026), con las capturas de la web del torneo, las reglas, los premios y los nombres, en banda superior.', carpeta: 'creator/soloq-val-previa' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600&family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(15,25,35,0.85); color: ${LUZ}; cursor: pointer;
    font: 600 13px/1 system-ui, sans-serif; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}" data-banda="arriba">
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

fs.writeFileSync(path.join(__dirname, 'index.html'), kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
