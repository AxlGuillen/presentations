// Generador de index.html — «Senna cumple 7 años» (Cumplelolero #32, martes 10/11/2026)
// Ejecutar: node creator/senna/gen.js   ·   clips: node tools/laminas.mjs creator/senna --alfa=webm
//
// Sigue al pie de la letra el paquete `senna-paquete-presentacion.md` (PKB de Axl, 10/11/2026):
//   · **Formato de t1-blg** (su manifest real: recorte 1080:680:0:1240, alfa en webm, caja
//     {width: 1080, x: center, bottom: 0}, lámina de reposo con reposo: true): banda opaca de
//     1080×680 de lado a lado; el único data-fondo es la guía «GAMEPLAY», que nunca sale en un clip;
//     un riel común idéntico en el primer y el último cuadro de cada lámina.
//   · **Tipografía y tono de ambessa**: Bebas Neue.
//   · **Esta vez NO es solo cámara**: cada lámina usa el layout (A–F) y la receta del kit de la
//     sección 4, sin repetir receta principal en dos láminas seguidas, y las 6 gráficas de la
//     sección 5 con esos datos exactos. El arte es oficial; lo dibujado es dato (gráficas, el tachón,
//     el sello, el rayo, las chispas y el destello).
//   · Ninguna lámina arranca en negro: cada una lleva debajo una copia desenfocada y opaca de su arte
//     (no es data-fondo), visible desde el cuadro 0, y lo que entra es el primer plano.
//   · Ninguna entrada pasa de 2,8 s.
//
// ⚠️ **Cuatro recetas del paquete se hicieron a mano con el mismo movimiento**, porque la del kit no
// sirve dentro de la banda (decisión anotada aquí, como pide la sección 7):
//   · `crece` en las barras de sn-top5: la `crece` del kit es el FLIP de una celda que llena su
//     contenedor, no barras. Las barras crecen desde 0 con la curva `entrada` y 0,12 s entre ellas
//     (las reglas de las gráficas). La `crece` del kit sí se usa en sn-urias.
//   · `iris` en sn-lore: el `iris` del kit recorta la <section> entera, y en el cuadro 0 la banda
//     quedaría transparente con alfa. Aquí el mismo círculo recorta solo el arte.
//   · `cortina` en sn-dialogos: la del kit tapa la sección con paneles de color que se retiran; el
//     paquete pide que cada mitad entre desde su lado, y eso es lo que se hace.
//   · `parallax` horizontal en sn-lucian: el del kit es vertical. Dos capas del mismo splash: la
//     entera (con la sombra de Lucian) va lenta y la de Senna, con máscara suave, rápida.
// ⚠️ **gol.gg revisado el 10/11/2026 antes de exportar sn-mundial**: Senna no aparece entre los
// campeones con pick o ban de «Worlds 2026 Main Event» (98) ni de «Worlds 2026 Play-In» (94); en
// «MSI 2026» sí. El 0 picks · 0 bans se queda. Si cambia, se toca MUNDIAL abajo.
// ⚠️ **Lucian Justiciero Enmascarado es Lucian_62** (champion.json es_MX 16.22.1).
// ⚠️ Los íconos de habilidad son de 64 px (ampliados 4× con Lanczos): van a 200 px como máximo.
// ⚠️ Las cartas de LoR «-full» son el arte apaisado de 2048×1024 sin marco (guardadas a 1600 en JPEG).
// Sin dinero en pantalla. Las gráficas no llevan fuente en pantalla (están en el paquete y la ficha).
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (sección 1.5) ─────────────────────────────────────────────────
const BG = '#0A0F0E';
const VERDE = '#46D3B0';   // lo de Senna
const LUZ = '#F3EFE2';     // cifras y texto
const ORO = '#E5B84B';     // skins
const ROJO = '#D2443C';    // solo lo malo
const GRIS = '#5B6461';    // barras de comparación
const WORLDS = '#1B3BFF';  // identidad de Worlds 2026 (ganan)

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// Datos que cambian (sección 5)
const TOP5 = [
  { nombre: 'JAMES BROWN', region: 'BR', puntos: 10.818329, txt: '10,8 M' },
  { nombre: 'SENNADOR SENNA', region: 'BR', puntos: 9.227884, txt: '9,2 M' },
  { nombre: 'MASTARAFIKI6', region: 'NA', puntos: 8.257526, txt: '8,3 M' },
  { nombre: 'PEANUTSYNDROME', region: 'OCE', puntos: 7.762042, txt: '7,8 M' },
  { nombre: 'KANLT', region: 'VN', puntos: 7.561512, txt: '7,6 M' },
];
// Rango por año: Plata 4 = 0 … Plata 1 = 3, Oro 4 = 4 … Oro 1 = 7, Platino 4 = 8 … Platino 1 = 11, Esmeralda 4 = 12 … Esmeralda 1 = 15
const HISTORIAL = [['2019', 5], ['2020', 4], ['2021', 4], ['2022', 2], ['2023', 9], ['2024', 8], ['2025', 11], ['2026', 11]];
const TECHO = 15; // pico de 2026: Esmeralda 1
const NERFS = [['ANTES', 90, false], ['26.13', 85, true], ['26.14', 80, true]];
const MUNDIAL = { msi: 7, picks: 0, bans: 0 };
const SKINS = [1, 9, 10, 16, 26, 27, 36, 46, 56, 63, 72, 81]; // prestigiosas: 9 y 27

// ── El riel: idéntico en todas las láminas ───────────────────────────────
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-senna');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  const brillos = [0, 1, 2, 3, 4, 5].map((i) => {
    const arriba = i < 3, tercio = i % 3;
    const x = Math.round(70 + tercio * 330 + r() * 260), y = Math.round(arriba ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${arriba ? VERDE : ORO}" opacity="${(0.5 + r() * 0.3).toFixed(2)}"/>`;
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
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${VERDE}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${VERDE}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

/** Arte a sangre o en una caja: <img> con object-fit cover, foco en `pos` y zoom fijo. */
const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '', imgEstilo = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block; ${filtro ? `filter: ${filtro};` : ''} ${imgEstilo}">
      </div>`;
/** Copia desenfocada y opaca (no es data-fondo: la banda es opaca y se ve desde el cuadro 0). */
const respaldo = (src, { blur = 18, brillo = 0.3, pos = 'center', x = 0, y = 0, w = PW, h = PH, k = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(1.1);"></div></div>`;
const veloIzq = (fuerza = 0.88) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.55)} 38%, ${a(BG, 0)} 66%);"></div>`;
const veloAbajoIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(90% 90% at 0% 70%, ${a(BG, 0.85)} 0%, ${a(BG, 0.4)} 45%, ${a(BG, 0)} 75%);"></div>`;

/** Texto: solo el dato. */
const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.85);` : ''}">${txt}</div>`;

/** Layout B: imagen a la izquierda (648×680), panel de dato a la derecha (432×680) y la línea verde. */
const L_B = (izquierda, derecha) => `
      <div data-k="izq" style="position: absolute; left: 0; top: 0; width: 648px; height: ${PH}px; overflow: hidden;">${izquierda}
      </div>
      <div style="position: absolute; left: 648px; top: 0; width: 432px; height: ${PH}px; background: ${a(BG, 0.92)};"></div>
      <div style="position: absolute; left: 647px; top: 0; width: 2px; height: ${PH}px; background: ${VERDE};"></div>${derecha}`;

/** Layout D: dos mitades de 540×680 con un corte diagonal de 6° al centro. */
const T6 = Math.tan((6 * Math.PI) / 180) * (PH / 2);
const CLIP_IZQ = `polygon(0 0, ${(540 + T6).toFixed(1)}px 0, ${(540 - T6).toFixed(1)}px ${PH}px, 0 ${PH}px)`;
const CLIP_DER = `polygon(${(540 + T6).toFixed(1)}px 0, ${PW}px 0, ${PW}px ${PH}px, ${(540 - T6).toFixed(1)}px ${PH}px)`;
const mitad = (lado, contenido, k = lado) => `
      <div data-k="${k}" style="position: absolute; inset: 0; clip-path: ${lado === 'izq' ? CLIP_IZQ : CLIP_DER};">${contenido}
      </div>`;
const costura = `
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="${(540 + T6).toFixed(1)}" y1="0" x2="${(540 - T6).toFixed(1)}" y2="${PH}" stroke="${VERDE}" stroke-width="3"/></svg>`;

/** Layout E: las 12 pantallas de carga en 6×2 (162×300, 8 px de separación), centradas. */
const RX = (PW - (6 * 162 + 5 * 8)) / 2, RY = (PH - (2 * 300 + 8)) / 2;
const celda = (i) => ({ x: RX + (i % 6) * 170, y: RY + Math.floor(i / 6) * 308 });
const tileSkin = (n, i, { x, y, w = 162, h = 300, estilo = '' } = celda(i)) => `<div data-continua="skin-${n}" data-skin="${n}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; border-radius: 6px; box-shadow: 0 10px 26px rgba(0,0,0,.6); ${estilo}"><img src="assets/carga/Senna_${n}.jpg" alt="Senna, skin ${n}" style="width: 100%; height: 100%; object-fit: cover; display: block;"></div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;

const slides = [];

// ── 1 · sn-portada · A ─── Know My Name en tres capas: fondo, Senna y el 7 ──
slides.push(lamina('sn-portada', 'Hoy cumple siete años la única support que pega más que su adecarry.', `
      <div data-k="capas" style="position: absolute; inset: 0;">
        <div data-capa="0.4" style="position: absolute; inset: 0;">${respaldo('splash/Senna_81-fondo.jpg', { blur: 14, brillo: 0.55 })}</div>
        <div data-capa="1" style="position: absolute; left: 300px; top: 0; width: 780px; height: ${PH}px; -webkit-mask-image: radial-gradient(60% 75% at 58% 42%, #000 55%, transparent 100%); mask-image: radial-gradient(60% 75% at 58% 42%, #000 55%, transparent 100%);">
          <img src="assets/centered/Senna_81.jpg" alt="Senna True Damage Know My Name" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block;">
        </div>
        ${veloIzq(0.75)}
        <div data-capa="1.8" style="position: absolute; inset: 0;">
          ${dato('<span data-k="siete" style="display: inline-block;">7</span>', { x: 50, y: 6, w: 360, tam: 470, lh: 0.9, tracking: 0, color: VERDE })}
          ${dato('SENNA', { x: 330, y: 300, w: 420, tam: 130, tracking: 10, k: 'nombre' })}
        </div>
      </div>`));

// ── 2 · sn-td · B ─── la pantalla de carga True Damage 2019 ──
slides.push(lamina('sn-td', 'Salió de una vez con su skin de True Damage.', L_B(`
        ${respaldo('splash/Senna_1-fondo.jpg', { blur: 16, brillo: 0.45, w: 648 })}
        <div data-k="carga" style="position: absolute; left: ${(648 - 374) / 2}px; top: 0; width: 374px; height: ${PH}px; overflow: hidden; box-shadow: 0 0 60px rgba(0,0,0,.7);">
          <img src="assets/carga/Senna_1.jpg" alt="Senna True Damage, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block;">
        </div>`, `
      ${dato('<span data-k="anio" style="white-space: nowrap;">2019</span>', { x: 676, y: 130, w: 224, tam: 124, color: ORO, tracking: 2 })}
      ${dato('<span data-k="dia">DÍA UNO</span>', { x: 676, y: 290, w: 224, tam: 74, tracking: 3 })}`)));

// ── 3 · sn-otp · F ─── el letrero del OTP con el emblema de Platino detrás ──
slides.push(lamina('sn-otp', 'El otepé con más puntos del mundo se llama James Brown 6969, es de Brasil.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { blur: 16, brillo: 0.32, pos: '60% 30%' })}
      <img data-k="emblema" src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="position: absolute; left: 330px; top: 60px; width: 520px; height: auto; opacity: .4;">
      <div data-k="letrero" style="position: absolute; left: 60px; top: 150px;">
        ${kit.letrero({ nombre: 'JAMES BROWN #6969', campeon: 'BRASIL', retrato: 'assets/carga/Senna_0.jpg', color: VERDE, tinta: LUZ, tam: 96, fuente: DISPLAY })}
      </div>`));

// ── 4 · sn-top5 · C ─── gráfica 1: top 5 mundial de maestría ──
const BAR = { x0: 390, max: 330, y0: 128, alto: 54, paso: 68 };
slides.push(lamina('sn-top5', 'Tiene diez punto ocho millones de puntos.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { pos: '55% 30%' })}
      ${dato('TOP 5 DEL MUNDO EN MAESTRÍA', { x: 60, y: 46, w: 840, tam: 60, tracking: 4, alinear: 'center' })}
      ${TOP5.map((j, i) => {
        const y = BAR.y0 + i * BAR.paso, w = Math.round((BAR.max * j.puntos) / TOP5[0].puntos), uno = i === 0;
        return `
      <div style="position: absolute; left: 60px; top: ${y}px; width: 316px; height: ${BAR.alto}px; display: flex; align-items: center; justify-content: flex-end; gap: 10px; font-size: 38px; letter-spacing: 1px; color: ${uno ? LUZ : a(LUZ, 0.8)};">
        ${j.region === 'BR' ? `<span style="font-size: 26px; padding: 3px 8px 1px; border-radius: 4px; background: ${uno ? VERDE : GRIS}; color: ${BG};">BR</span>` : ''}<span>${j.nombre}</span>
      </div>
      <div data-barra style="position: absolute; left: ${BAR.x0}px; top: ${y}px; width: ${w}px; height: ${BAR.alto}px; background: ${uno ? VERDE : GRIS}; border-radius: 0 6px 6px 0; transform-origin: 0 50%;"></div>
      <div data-valor${uno ? ' data-uno' : ''} style="position: absolute; left: ${BAR.x0 + w + 14}px; top: ${y}px; height: ${BAR.alto}px; display: flex; align-items: center; font-size: ${uno ? 52 : 40}px; color: ${uno ? VERDE : LUZ}; white-space: nowrap;">${j.txt}</div>`;
      }).join('')}`));

// ── 5 · sn-partidas · C ─── gráfica 2: la dona del 96 % ──
slides.push(lamina('sn-partidas', 'Este año jugó más de dos mil partidas con ella, como seis y media diarias.', `
      ${respaldo('splash/Senna_1-fondo.jpg', { pos: '48% 25%' })}
      <div data-k="dona" style="position: absolute; left: 110px; top: 120px;">
        ${kit.dona([{ valor: 96, color: VERDE }, { valor: 4, color: GRIS }], { tam: 420, grosor: 64, fondo: 'rgba(243,239,226,.07)', centro: { texto: '96%', cuenta: 96, sufijo: '%', color: LUZ, tam: 120 } })}
      </div>
      ${dato('<span data-k="partidas">2.022</span>', { x: 580, y: 110, w: 320, tam: 190, color: VERDE, tracking: 2 })}
      ${dato('6,5 AL DÍA', { x: 580, y: 320, w: 320, tam: 92, tracking: 3, k: 'aldia' })}`));

// ── 6 · sn-historial · C ─── gráfica 3: la línea de rango 2019–2026 ──
const H = { x0: 230, x1: 950, yCero: 560, paso: 24.5 };
const hx = (i) => H.x0 + (i * (H.x1 - H.x0)) / (HISTORIAL.length - 1);
const hy = (v) => H.yCero - (v + 0.5) * H.paso;
const lineaRango = 'M' + HISTORIAL.map(([, v], i) => `${hx(i).toFixed(1)} ${hy(v).toFixed(1)}`).join('L');
const EJE = [['silver', 1.5, 74], ['gold', 5.5, 74], ['platinum', 9.5, 84], ['emerald', 13.5, 84]];
slides.push(lamina('sn-historial', 'Y está en Platino uno.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { pos: '20% 60%', brillo: 0.28 })}
      ${EJE.map(([e, v, w]) => `<img data-eje src="assets/emblemas/${e}.png" alt="Emblema de ${e}" style="position: absolute; left: ${118 - w / 2}px; top: ${(hy(v) - w * 0.4).toFixed(0)}px; width: ${w}px; height: auto;">`).join('')}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <line data-k="techo" x1="${H.x0 - 30}" y1="${hy(TECHO).toFixed(1)}" x2="${H.x1 + 20}" y2="${hy(TECHO).toFixed(1)}" stroke="${VERDE}" stroke-width="3" stroke-dasharray="14 12" opacity=".75"/>
        <g data-k="trazo"><path d="${lineaRango}" fill="none" stroke="${VERDE}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g>
        ${HISTORIAL.map(([anio, v], i) => `<circle data-punto cx="${hx(i).toFixed(1)}" cy="${hy(v).toFixed(1)}" r="${i === HISTORIAL.length - 1 ? 13 : 9}" fill="${i === HISTORIAL.length - 1 ? LUZ : VERDE}"/>` +
          `<text x="${hx(i).toFixed(1)}" y="612" text-anchor="middle" font-family="${DISPLAY.replace(/'/g, '&#39;')}" font-size="34" fill="${a(LUZ, 0.7)}">${anio}</text>`).join('')}
      </svg>
      ${dato('PLATINO 1', { x: 560, y: 56, w: 340, tam: 96, tracking: 4, alinear: 'right', k: 'rango' })}`));

// ── 7 · sn-adc · A ─── el cañón, en duotono verde que vira a color ──
slides.push(lamina('sn-adc', 'Como adecarry llorón que soy Senna me cae mal.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { blur: 10, brillo: 0.5, pos: '25% 35%' })}
      ${arte('splash/Senna_0.jpg', 'Senna, splash base: el cañón', { pos: '22% 34%', zoom: 1.45, k: 'arte' })}
      ${kit.duotono('dt-senna', BG, VERDE)}`));

// ── 8 · sn-escala · C ─── gráfica 4: el alcance en escalones contra las almas ──
const E = { x0: 130, paso: 68, y600: 520, porEscalon: 30 };
const ex = (k) => E.x0 + k * E.paso, ey = (k) => E.y600 - k * E.porEscalon;
let escalera = `M${ex(0)} ${ey(0)}`;
for (let k = 0; k < 12; k++) escalera += ` H${ex(k + 1)} V${ey(k + 1)}`;
let camino = `M${ex(0)} ${ey(0)}`;
for (let k = 0; k < 10; k++) camino += ` H${ex(k + 1)} V${ey(k + 1)}`;
const xFin = ex(12);
slides.push(lamina('sn-escala', 'Escala para siempre con las almas.', `
      ${respaldo('splash/Senna_27-fondo.jpg', { pos: '62% 30%' })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <line x1="${E.x0}" y1="${E.y600 + 24}" x2="${ex(10)}" y2="${E.y600 + 24}" stroke="${a(LUZ, 0.25)}" stroke-width="2"/>
        <text x="${E.x0}" y="${E.y600 + 66}" font-family="${DISPLAY.replace(/'/g, '&#39;')}" font-size="34" fill="${a(LUZ, 0.7)}">0</text>
        <text x="${ex(10)}" y="${E.y600 + 66}" text-anchor="middle" font-family="${DISPLAY.replace(/'/g, '&#39;')}" font-size="34" fill="${a(LUZ, 0.7)}">200 ALMAS</text>
        <g data-k="trazo"><path d="${escalera} H${xFin + 70}" fill="none" stroke="${VERDE}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g>
        <path id="sn-camino" d="${camino}" fill="none" stroke="none"/>
        <path data-k="flecha" d="M${xFin + 48} ${ey(12) - 18} L${xFin + 76} ${ey(12)} L${xFin + 48} ${ey(12) + 18}" fill="none" stroke="${VERDE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <img data-k="almas" src="assets/iconos/Senna_Passive.png" alt="Absolución, la pasiva de Senna" style="position: absolute; left: 0; top: 0; width: 84px; height: 84px; border-radius: 50%; border: 4px solid ${VERDE}; box-shadow: 0 0 24px ${a(VERDE, 0.6)};">
      ${dato('<span data-k="alcance">800</span>', { x: 90, y: 60, w: 400, tam: 130, color: VERDE })}
      ${dato('ALCANCE', { x: 96, y: 186, w: 300, tam: 36, tracking: 4, color: a(LUZ, 0.75) })}
      ${dato('<span data-k="infinito" style="display: inline-block; font-family: system-ui, sans-serif; font-weight: 300;">∞</span>', { x: 330, y: 40, w: 240, tam: 170 })}`));

// ── 9 · sn-ulti · A ─── PROYECTO oscurecido, la R y el rayo de lado a lado ──
slides.push(lamina('sn-ulti', 'Su ulti cruza el mapa en menos de un segundo.', `
      ${arte('splash/Senna_16.jpg', 'PROYECTO: Senna, splash', { pos: '72% 25%', zoom: 1.05, filtro: 'brightness(.42) saturate(1.1)' })}
      <img data-k="r" src="assets/iconos/SennaR.png" alt="Cañón de Sombras, la R de Senna" style="position: absolute; left: 60px; top: 110px; width: 200px; height: 200px; border-radius: 16px; border: 4px solid ${VERDE}; box-shadow: 0 0 40px ${a(VERDE, 0.5)};">
      <div data-k="rayo" style="position: absolute; inset: 0;">${kit.rayo(['M-120 470 C 260 430, 700 520, 1200 450', 'M-120 500 C 320 470, 760 560, 1200 490'], { ancho: PW, alto: PH, color: VERDE, grosor: 12 })}</div>
      ${dato('<span data-k="seg">0,9 S</span>', { x: 300, y: 100, w: 600, tam: 250, tracking: 6 })}`));

// ── 10 · sn-lento · C ─── gráfica 5: los dos temporizadores a su velocidad real ──
slides.push(lamina('sn-lento', 'Su ataque es de los más lentos del juego.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { pos: '60% 30%' })}
      ${dato('SENNA', { x: 110, y: 96, w: 300, tam: 44, tracking: 4, color: a(LUZ, 0.8) })}
      ${dato('0,5 S', { x: 560, y: 70, w: 340, tam: 84, alinear: 'right', color: ROJO })}
      <div style="position: absolute; left: 110px; top: 160px; width: 790px; height: 70px; border-radius: 8px; background: rgba(243,239,226,.08); overflow: hidden;"><div data-k="t-senna" style="width: 100%; height: 100%; background: ${ROJO}; transform-origin: 0 50%;"></div></div>
      ${dato('LA MAYORÍA', { x: 110, y: 286, w: 300, tam: 44, tracking: 4, color: a(LUZ, 0.8) })}
      ${dato('0,2–0,3 S', { x: 500, y: 260, w: 400, tam: 84, alinear: 'right' })}
      <div style="position: absolute; left: 110px; top: 350px; width: 790px; height: 70px; border-radius: 8px; background: rgba(243,239,226,.08); overflow: hidden;"><div data-k="t-mayoria" style="width: 100%; height: 100%; background: ${GRIS}; transform-origin: 0 50%;"></div></div>`));

// ── 11 · sn-nerfs · C ─── gráfica 6: el crítico 90 → 85 → 80 ──
const barraImg = (color) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${color}"/></svg>`)}`;
slides.push(lamina('sn-nerfs', 'En el verano Riot le cortó las manos con dos nerfeos seguidos.', `
      ${respaldo('splash/Senna_46-fondo.jpg', { pos: '60% 25%' })}
      ${dato(`CRÍTICO 90&nbsp;% <span style="color: ${ROJO};">→ 80&nbsp;%</span>`, { x: 90, y: 40, w: 900, tam: 72, tracking: 3, alinear: 'center' })}
      ${NERFS.map(([etq, v, malo], i) => {
        const h = Math.round((330 * v) / 90), x = 250 + i * 230, base = 560;
        return `
      <div data-barra style="position: absolute; left: ${x}px; top: ${base - h}px; width: 150px; height: ${h}px; overflow: hidden; border-radius: 6px 6px 0 0;"><img src="${barraImg(malo ? ROJO : GRIS)}" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;"></div>
      <div data-cifra style="position: absolute; left: ${x - 40}px; top: ${base - h - 78}px; width: 230px; text-align: center; font-size: 66px; line-height: 1; color: ${malo ? ROJO : LUZ}; text-shadow: 0 6px 24px rgba(0,0,0,.8);">${v}&nbsp;%</div>
      <div style="position: absolute; left: ${x - 40}px; top: ${base + 12}px; width: 230px; text-align: center; font-size: 38px; letter-spacing: 2px; color: ${a(LUZ, 0.75)};">${etq}</div>`;
      }).join('')}`));

// ── 12 · sn-mundial · D ─── MSI contra Mundial ──
slides.push(lamina('sn-mundial', 'En el Mundial nadie la quiso: cero picks y cero bans.', `
      ${mitad('izq', `
        ${respaldo('splash/Senna_0-fondo.jpg', { blur: 12, brillo: 0.4, pos: '55% 30%' })}
        ${dato('MSI', { x: 60, y: 56, w: 420, tam: 84, tracking: 8, color: a(LUZ, 0.8) })}
        ${dato(String(MUNDIAL.msi), { x: 60, y: 120, w: 420, tam: 300, color: VERDE, tracking: 0 })}`)}
      ${mitad('der', `
        <div style="position: absolute; inset: 0; background: radial-gradient(70% 60% at 75% 110%, ${a(WORLDS, 0.75)}, ${a('#02031C', 0)} 70%), #02031C;"></div>
        <img src="assets/logos/worlds-escudo.png" alt="Escudo del Mundial" style="position: absolute; left: 700px; top: 150px; width: 330px; height: auto; opacity: .22;">
        <div data-k="mundo" style="position: absolute; inset: 0;">
          ${dato('MUNDIAL', { x: 600, y: 56, w: 300, tam: 84, tracking: 8, alinear: 'right', color: a(LUZ, 0.8) })}
          ${dato(`<span data-k="cero" style="display: inline-block;">${MUNDIAL.picks}</span>`, { x: 600, y: 120, w: 300, tam: 300, color: ROJO, alinear: 'right', tracking: 0 })}
          ${dato(`${MUNDIAL.bans} BANS`, { x: 600, y: 380, w: 300, tam: 60, tracking: 6, alinear: 'right', color: ROJO, k: 'bans' })}
        </div>`)}
      ${costura}
      ${kit.glitch('gl-senna')}`));

// ── 13 · sn-knowmyname · B ─── Know My Name a pincel, con un destello en el arma ──
slides.push(lamina('sn-knowmyname', 'El mes pasado le sacaron skin nueva de True Damage y ni un equipo la tocó.', L_B(`
        ${respaldo('splash/Senna_81-fondo.jpg', { blur: 16, brillo: 0.4, w: 648, pos: '47% 30%' })}
        <div data-k="pincel" style="position: absolute; inset: 0;">${kit.pincel('assets/splash/Senna_81-kmn.jpg', 'Senna True Damage Know My Name', { ancho: 648, alto: PH, trazos: 6 })}</div>
        <div data-k="destello" style="position: absolute; left: 330px; top: 20px;">${kit.destello({ tam: 300, rayos: 16, color: ORO, semilla: 'kmn' })}</div>`, `
      ${dato('26.21', { x: 676, y: 110, w: 224, tam: 140, color: ORO, tracking: 2, k: 'parche' })}
      ${dato('<span style="white-space: nowrap;">0 EQUIPOS</span>', { x: 676, y: 270, w: 224, tam: 60, color: ROJO, tracking: 2, k: 'equipos' })}`)));

// ── 14 · sn-lore · A ─── la centrada base, que se abre en iris ──
slides.push(lamina('sn-lore', 'Pasemos con su lore, que es una novela de las nueve.', `
      ${respaldo('centered/Senna_0-fondo.jpg', { blur: 16, brillo: 0.45, pos: '55% 25%' })}
      ${arte('centered/Senna_0.jpg', 'Senna, imagen centrada', { pos: '55% 22%', zoom: 1.08, k: 'arte' })}`));

// ── 15 · sn-niebla · A ─── la Niebla Negra se expande desde la orilla ──
slides.push(lamina('sn-niebla', 'De niña la Niebla Negra se le pegó como polilla a la luz.', `
      ${respaldo('ruina/niebla-negra-fondo.jpg', { blur: 14, brillo: 0.35 })}
      <div data-k="tinta" style="position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px;">
        ${arte('ruina/niebla-negra.jpg', 'La Niebla Negra, arte de La Ruina', { pos: '40% 50%' })}
        <div style="position: absolute; left: ${(PW - 374) / 2 + 120}px; top: 0; width: 374px; height: ${PH}px; opacity: .6; -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);">
          <img src="assets/carga/Senna_0.jpg" alt="Senna, pantalla de carga" style="width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(1.35);">
        </div>
      </div>
      ${kit.tinta('tn-senna', { ancho: PW, alto: PH, origen: [0, 0.5], semilla: 11, escala: 140 })}`));

// ── 16 · sn-urias · B ─── la carta de la Senna humana crece desde el centro ──
slides.push(lamina('sn-urias', 'La salvó un Centinela de la Luz que se llamaba Urias.', L_B(`
        <div data-k="fondo" style="position: absolute; inset: 0; overflow: hidden;">
          <img src="assets/cartas/01DE038-fondo.jpg" alt="" style="position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; filter: blur(16px) brightness(.4); display: block;">
        </div>
        <div data-k="crece" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
          <div data-elegida style="width: 200px; height: 210px; overflow: hidden; border-radius: 8px;">
            <img src="assets/cartas/01DE038.jpg" alt="Senna, Centinela de la Luz (Legends of Runeterra)" style="width: 100%; height: 100%; object-fit: cover; object-position: 30% 35%; display: block;">
          </div>
        </div>`, `
      ${dato('URIAS', { x: 676, y: 110, w: 224, tam: 130, color: VERDE, tracking: 4, k: 'urias' })}
      ${dato('CENTINELAS<br>DE LA LUZ', { x: 676, y: 262, w: 224, tam: 52, tracking: 2, lh: 1.05, k: 'centinelas' })}`)));

// ── 17 · sn-lucian · A ─── La Forajida: la sombra de Lucian va más lenta que Senna ──
slides.push(lamina('sn-lucian', 'Ahí conoció a su hijo Lucian.', `
      ${respaldo('splash/Senna_10-fondo.jpg', { blur: 12, brillo: 0.5 })}
      <div data-k="base" style="position: absolute; left: -60px; top: 0; width: ${PW + 120}px; height: ${PH}px; overflow: hidden;">
        <img src="assets/splash/Senna_10.jpg" alt="Senna la Forajida, splash (la sombra de Lucian)" style="width: 100%; height: 100%; object-fit: cover; object-position: 40% 30%; display: block;">
      </div>
      <div data-k="senna" style="position: absolute; left: -60px; top: 0; width: ${PW + 120}px; height: ${PH}px; overflow: hidden; -webkit-mask-image: radial-gradient(26% 52% at 50% 40%, #000 55%, transparent 100%); mask-image: radial-gradient(26% 52% at 50% 40%, #000 55%, transparent 100%);">
        <img src="assets/splash/Senna_10.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 40% 30%; display: block;">
      </div>
      ${veloAbajoIzq}
      ${dato('LUCIAN', { x: 60, y: 300, w: 500, tam: 140, tracking: 10, k: 'nombre' })}`));

// ── 18 · sn-thresh · A ─── Thresh, empuje lento hacia la linterna ──
slides.push(lamina('sn-thresh', 'En esa búsqueda se toparon con Thresh.', `
      ${respaldo('ruina/Thresh_0-fondo.jpg', { blur: 12, brillo: 0.45 })}
      ${arte('ruina/Thresh_0.jpg', 'Thresh, splash base', { pos: '62% 30%', k: 'arte' })}
      ${veloAbajoIzq}
      ${dato('THRESH', { x: 60, y: 300, w: 520, tam: 140, tracking: 10, k: 'nombre' })}`));

// ── 19 · sn-cadena · A ─── la imagen se consume y queda la penumbra ──
slides.push(lamina('sn-cadena', 'La cadena la agarró a ella y terminó encerrada en la linterna.', `
      ${respaldo('ruina/thresh-fondo.jpg', { blur: 10, brillo: 0.32, pos: '70% 40%' })}
      ${arte('ruina/thresh.jpg', 'Thresh con la linterna, arte de La Ruina', { pos: '50% 35%', k: 'arte' })}
      ${kit.quemado('qm-senna', { brasa: VERDE, semilla: 9 })}`));

// ── 20 · sn-vida · B ─── MUERTE se tacha y se reescribe como VIDA ──
slides.push(lamina('sn-vida', 'Descubrió que su maldición no era la muerte sino la vida.', L_B(`
        ${respaldo('splash/Senna_26-fondo.jpg', { blur: 14, brillo: 0.45, w: 648 })}
        ${arte('splash/Senna_26.jpg', 'Senna Eclipse Lunar, splash', { w: 648, pos: '56% 30%', zoom: 1.08, k: 'arte' })}`, `
      <div style="position: absolute; left: 676px; top: 110px; width: 224px;">
        <div data-k="muerte" style="position: relative; display: inline-block; font-size: 78px; line-height: 1; letter-spacing: 3px; color: ${a(LUZ, 0.6)};">MUERTE<svg viewBox="0 0 220 80" preserveAspectRatio="none" style="position: absolute; left: -6px; top: 0; width: calc(100% + 12px); height: 100%; overflow: visible;"><path data-k="tachon" d="M2 46 C 60 38, 150 50, 218 34" fill="none" stroke="${ROJO}" stroke-width="9" stroke-linecap="round"/></svg></div>
      </div>
      ${dato('<span data-k="vida">VIDA</span>', { x: 676, y: 220, w: 224, tam: 150, color: VERDE, tracking: 4 })}`)));

// ── 21 · sn-isolde · D ─── Isolde en espectro y con Viego, en franjas ──
slides.push(lamina('sn-isolde', 'Lleva un pedazo del alma de Isolde, la esposa de Viego.', `
      ${mitad('izq', `
        ${respaldo('ruina/isolde-espectro-fondo.jpg', { blur: 12, brillo: 0.45 })}
        <div data-k="reb-izq" style="position: absolute; left: 0; top: 0; width: ${Math.ceil(540 + T6)}px; height: ${PH}px; overflow: hidden;">
          <img src="assets/ruina/isolde-espectro.jpg" alt="Isolde, el espectro" style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 28%; display: block;">
        </div>`)}
      ${mitad('der', `
        ${respaldo('ruina/viego-isolde-fondo.jpg', { blur: 12, brillo: 0.45, pos: '30% 35%' })}
        <div data-k="reb-der" style="position: absolute; left: ${Math.floor(540 - T6)}px; top: 0; width: ${Math.ceil(540 + T6)}px; height: ${PH}px; overflow: hidden;">
          <img src="assets/ruina/viego-isolde.jpg" alt="Viego e Isolde, arte de La Ruina" style="width: 100%; height: 100%; object-fit: cover; object-position: 30% 35%; display: block;">
        </div>`)}
      ${costura}
      ${dato('ISOLDE', { x: 60, y: 300, w: 440, tam: 130, tracking: 10, k: 'nombre' })}`));

// ── 22 · sn-escape · B ─── la carta humana voltea y es la campeona ──
slides.push(lamina('sn-escape', 'Liberó almas de la linterna y se escapó.', L_B(`
        ${respaldo('cartas/05SI009-fondo.jpg', { blur: 16, brillo: 0.4, w: 648 })}
        <div style="position: absolute; inset: 0;">
          <div data-k="voltea" style="position: absolute; inset: 0; display: grid;">
            <div data-cara="frente" style="grid-area: 1 / 1; overflow: hidden;"><img src="assets/cartas/01DE038.jpg" alt="Senna, Centinela de la Luz" style="width: 100%; height: 100%; object-fit: cover; object-position: 30% 35%; display: block;"></div>
            <div data-cara="dorso" style="grid-area: 1 / 1; overflow: hidden;"><img src="assets/cartas/05SI009.jpg" alt="Senna, la campeona (Legends of Runeterra)" style="width: 100%; height: 100%; object-fit: cover; object-position: 42% 32%; display: block;"></div>
          </div>
        </div>`, `
      ${dato('MUERTA<br>Y VIVA', { x: 676, y: 120, w: 224, tam: 96, color: VERDE, tracking: 3, lh: 1, k: 'texto' })}`)));

// ── 23 · sn-dialogos · D ─── Senna y Lucian Justicieros Enmascarados ──
slides.push(lamina('sn-dialogos', 'Lo mejor son sus diálogos con Lucian.', `
      ${respaldo('splash/Senna_63-fondo.jpg', { blur: 14, brillo: 0.4 })}
      ${mitad('izq', arte('splash/Senna_63.jpg', 'Senna Justiciera Enmascarada, splash', { pos: '80% 25%', zoom: 1.1 }))}
      ${mitad('der', arte('splash/Lucian_62.jpg', 'Lucian Justiciero Enmascarado, splash', { pos: '66% 20%', zoom: 1.1 }))}
      ${costura}`));

// ── 24 · sn-asqueroso · B ─── Thresh en bloques que se aclaran ──
slides.push(lamina('sn-asqueroso', 'Cuando mata a Thresh dice: seguro le gustó, asqueroso.', L_B(`
        ${respaldo('ruina/Thresh_0-fondo.jpg', { blur: 14, brillo: 0.4, w: 648, pos: '62% 22%' })}
        <div data-k="pixel" style="position: absolute; inset: 0;">
          <img src="assets/ruina/Thresh_0.jpg" alt="Thresh, splash base: el rostro" style="position: absolute; left: 0; top: 0; width: 648px; height: ${PH}px; object-fit: cover; object-position: 62% 18%; display: block;">
        </div>`, '')));

// ── 25 · sn-skins · E ─── las 12 skins ──
slides.push(lamina('sn-skins', 'Y de skins tiene doce.', `
      ${respaldo('carga/rejilla-fondo.jpg', { blur: 20, brillo: 0.3 })}
      <div data-k="rejilla" style="position: absolute; inset: 0;">${SKINS.map((n, i) => tileSkin(n, i)).join('')}</div>
      <div style="position: absolute; left: 340px; top: 150px; width: 400px; height: 300px; background: radial-gradient(50% 50% at 50% 50%, ${a(BG, 0.85)}, ${a(BG, 0)} 75%);"></div>
      ${dato('<span data-k="doce">12</span>', { x: 340, y: 120, w: 400, tam: 320, alinear: 'center', color: ORO, tracking: 0 })}`));

// ── 26 · sn-prestigio · E ─── las 2 prestigiosas al centro y el resto apagado ──
const GRANDE = { w: 214, h: 390 };
const prestigio = { 9: { x: 490, y: 150 }, 27: { x: 720, y: 150 } };
slides.push(lamina('sn-prestigio', 'Dos de prestigio y una hecha con Louis Vuitton.', `
      ${respaldo('carga/rejilla-fondo.jpg', { blur: 20, brillo: 0.3 })}
      <div data-k="rejilla" style="position: absolute; inset: 0;">${SKINS.filter((n) => !prestigio[n]).map((n) => tileSkin(n, SKINS.indexOf(n), { ...celda(SKINS.indexOf(n)), estilo: 'opacity: .25;' })).join('')}
        ${SKINS.filter((n) => prestigio[n]).map((n) => tileSkin(n, SKINS.indexOf(n), { ...prestigio[n], ...GRANDE, estilo: `border: 3px solid ${ORO}; box-shadow: 0 0 40px ${a(ORO, 0.45)}, 0 14px 30px rgba(0,0,0,.7); z-index: 2;` })).join('')}
      </div>
      <div style="position: absolute; left: 0; top: 0; width: 520px; height: ${PH}px; background: linear-gradient(90deg, ${a(BG, 0.85)}, ${a(BG, 0)});"></div>
      ${dato('<span data-k="dos" style="color: ' + ORO + ';">2 PRESTIGIO</span>', { x: 60, y: 150, w: 420, tam: 96, tracking: 3 })}
      ${dato('LOUIS VUITTON', { x: 60, y: 270, w: 420, tam: 62, tracking: 4, k: 'lv' })}`));

// ── 27 · sn-esports · C ─── el 0 de esports cae como sello ──
slides.push(lamina('sn-esports', 'Y cero de esports, porque ningún pro la quiere.', `
      ${respaldo('carga/rejilla-fondo.jpg', { blur: 18, brillo: 0.3 })}
      <div style="position: absolute; left: 160px; top: 40px; width: 360px; height: 420px;">
        <div data-k="cero" style="position: absolute; inset: 0; text-align: center; font-size: 440px; line-height: 0.95; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.8);">0</div>
      </div>
      ${dato('ESPORTS', { x: 520, y: 200, w: 380, tam: 120, tracking: 8, k: 'esports' })}`));

// ── 28 · sn-cierre · A ─── True Damage, GG EZ con chispas doradas ──
slides.push(lamina('sn-cierre', 'Ni pedo, solo queda decir gigi easy.', `
      ${respaldo('splash/Senna_1-fondo.jpg', { blur: 12, brillo: 0.5, pos: '47% 20%' })}
      ${arte('splash/Senna_1.jpg', 'Senna True Damage, splash: el rostro', { pos: '47% 14%', zoom: 1.5, k: 'arte' })}
      ${veloIzq(0.8)}
      <div data-k="chispas" style="position: absolute; left: 0; top: 0; width: 600px; height: 520px;"></div>
      ${dato('<span data-k="gg" style="display: inline-block;">GG EZ</span>', { x: 60, y: 140, w: 600, tam: 230, tracking: 8, color: ORO })}`));

// ── reposo · A ─── Senna base desenfocada al 45 % ──
slides.push(lamina('sn-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${respaldo('splash/Senna_0-fondo.jpg', { blur: 16, brillo: 0.45, pos: '58% 30%' })}
      ${dato(`SENNA · <span style="color: ${VERDE};">7</span>`, { x: 60, y: 60, w: 400, tam: 48, tracking: 6, color: a(LUZ, 0.85) })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  var C = {
    'sn-portada': function (tl, s) {
      efecto('parallax', tl, k(s, 'capas'), { dur: 2.2, distancia: 60 });
      efecto('tragamonedas', tl, k(s, 'siete'), { en: 0.2, dur: 1.6 });
      aparece(tl, k(s, 'nombre'), 1.1, 0.5);
    },
    'sn-td': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'carga'), { direccion: 'derecha', dur: 0.9 });
      efecto('maquina', tl, k(s, 'anio'), { en: 0.55, ritmo: 0.08, cursor: 'no' });
      efecto('maquina', tl, k(s, 'dia'), { en: 0.95, ritmo: 0.06, cursor: 'no' });
    },
    'sn-otp': function (tl, s) {
      tl.fromTo(k(s, 'emblema'), { opacity: 0, scale: 0.85 }, { opacity: 0.4, scale: 1, duration: 1, ease: 'entrada', immediateRender: true }, 0);
      efecto('letrero', tl, k(s, 'letrero').firstElementChild, { en: 0.25 });
    },
    'sn-top5': function (tl, s) {
      // La «crece» del paquete: barras que crecen desde 0 con la curva entrada, 0,12 s entre ellas.
      var barras = q(s, '[data-barra]'), valores = q(s, '[data-valor]');
      tl.from(barras, { scaleX: 0, duration: 0.9, ease: 'entrada', stagger: 0.12 }, 0.3);
      valores.forEach(function (v, i) {
        if (v.hasAttribute('data-uno')) { aparece(tl, v, 0.35, 0.3); efecto('contador', tl, v, { en: 0.35, dur: 1.3, cuenta: 10.8, decimales: 1, sufijo: ' M' }); }
        else aparece(tl, v, 0.75 + i * 0.12, 0.4);
      });
    },
    'sn-partidas': function (tl, s) {
      efecto('dona', tl, k(s, 'dona'), { en: 0.2, dur: 1.4 });
      efecto('contador', tl, k(s, 'partidas'), { en: 0.2, dur: 1.4, cuenta: 2022, separador: '.' });
      aparece(tl, k(s, 'aldia'), 1.3);
    },
    'sn-historial': function (tl, s) {
      tl.from(q(s, '[data-eje]'), { opacity: 0, x: -20, duration: 0.4, stagger: 0.08, ease: 'entrada' }, 0);
      efecto('dibujo', tl, k(s, 'trazo'), { en: 0.3, dur: 1.6, escalon: 0 });
      q(s, '[data-punto]').forEach(function (p, i, ps) { tl.from(p, { opacity: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.25, ease: 'golpe' }, 0.3 + (1.6 * i) / (ps.length - 1)); });
      tl.from(k(s, 'techo'), { opacity: 0, duration: 0.5 }, 1.1);
      var ult = q(s, '[data-punto]').pop();
      tl.to(ult, { scale: 1.8, transformOrigin: '50% 50%', duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 2.0);
      aparece(tl, k(s, 'rango'), 1.7);
    },
    'sn-adc': function (tl, s) {
      efecto('duotono', tl, k(s, 'arte'), { filtro: 'dt-senna', hacia: 'color', dur: 1.6, en: 0.3 });
    },
    'sn-escala': function (tl, s) {
      efecto('dibujo', tl, k(s, 'trazo'), { en: 0.2, dur: 2.0, escalon: 0 });
      efecto('trayectoria', tl, k(s, 'almas'), { camino: '#sn-camino', en: 0.2, dur: 1.65, ease: 'none' });
      efecto('contador', tl, k(s, 'alcance'), { en: 0.2, dur: 1.65, desde: 600, cuenta: 800, ease: 'none' });
      tl.from(k(s, 'flecha'), { opacity: 0, x: -20, duration: 0.3 }, 2.1);
      tl.from(k(s, 'infinito'), { opacity: 0, scale: 0.6, transformOrigin: '80% 50%', duration: 0.45, ease: 'golpe' }, 2.0);
    },
    'sn-ulti': function (tl, s) {
      tl.from(k(s, 'r'), { opacity: 0, scale: 0.7, duration: 0.4, ease: 'golpe' }, 0);
      efecto('rayo', tl, k(s, 'rayo'), { en: 0.2, dur: 0.6, escalon: 0.06 });
      efecto('palabra', tl, k(s, 'seg'), { en: 0.5 });
    },
    'sn-lento': function (tl, s) {
      // A su velocidad real: Senna 0,5 s por ataque (tres) y la mayoría 0,25 s (seis).
      var sn = k(s, 't-senna'), my = k(s, 't-mayoria'), t0 = 0.4;
      for (var i = 0; i < 3; i++) tl.fromTo(sn, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'none', immediateRender: i === 0 }, t0 + i * 0.5);
      for (var j = 0; j < 6; j++) tl.fromTo(my, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'none', immediateRender: j === 0 }, t0 + j * 0.25);
    },
    'sn-nerfs': function (tl, s) {
      var barras = q(s, '[data-barra]'), cifras = q(s, '[data-cifra]');
      barras.forEach(function (b, i) {
        efecto('rebanadas', tl, b, { n: 5, en: 0.2 + i * 0.5, dur: 0.6, escalon: 0.05 });
        efecto('golpe', tl, cifras[i], { en: 0.55 + i * 0.5 });
      });
    },
    'sn-mundial': function (tl, s) {
      efecto('glitch', tl, k(s, 'der'), { filtro: 'gl-senna', dur: 1.2, en: 0.1, fuerza: 120 });
      efecto('tragamonedas', tl, k(s, 'cero'), { en: 0.3, dur: 1.5 });
      aparece(tl, k(s, 'bans'), 1.6);
    },
    'sn-knowmyname': function (tl, s) {
      efecto('pincel', tl, k(s, 'pincel'), { dur: 1.3 });
      efecto('destello', tl, k(s, 'destello'), { en: 1.15, dur: 1.2, semilla: 'kmn' });
      aparece(tl, k(s, 'parche'), 0.9); aparece(tl, k(s, 'equipos'), 1.2);
    },
    'sn-lore': function (tl, s) {
      // El iris del paquete, sobre el arte (el del kit recorta la sección entera).
      tl.fromTo(k(s, 'arte'), { clipPath: 'circle(0% at 55% 40%)' }, { clipPath: 'circle(110% at 55% 40%)', duration: 1.3, ease: 'power3.inOut', immediateRender: true }, 0.1);
    },
    'sn-niebla': function (tl, s) {
      efecto('tinta', tl, k(s, 'tinta'), { mascara: 'tn-senna', dur: 1.9, en: 0.1 });
    },
    'sn-urias': function (tl, s) {
      efecto('empuje', tl, k(s, 'fondo'), { desde: 1.15, dur: 2.4 });
      efecto('crece', tl, k(s, 'crece'), { en: 0.2, dur: 1.0 });
      aparece(tl, k(s, 'urias'), 0.9); aparece(tl, k(s, 'centinelas'), 1.15);
    },
    'sn-lucian': function (tl, s) {
      // Parallax horizontal: la sombra de Lucian (la capa entera) va lenta y Senna rápida.
      tl.from(k(s, 'base'), { x: -50, duration: 2.3, ease: 'power2.out' }, 0);
      tl.from(k(s, 'senna'), { x: -140, duration: 2.3, ease: 'power2.out' }, 0);
      tl.from(k(s, 'nombre'), { opacity: 0, x: -40, duration: 0.6, ease: 'entrada' }, 1.0);
    },
    'sn-thresh': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.22, origen: '88% 45%', dur: 2.5 });
      aparece(tl, k(s, 'nombre'), 1.0, 0.6);
    },
    'sn-cadena': function (tl, s) {
      var arte = k(s, 'arte');
      efecto('quemado', tl, arte, { filtro: 'qm-senna', hacia: 'desaparece', dur: 1.9, en: 0.3 });
      // Al terminar no queda brasa suelta: el arte se va y queda la penumbra del fondo.
      tl.set(arte, { opacity: 0, filter: 'none' }, 2.25);
    },
    'sn-vida': function (tl, s) {
      efecto('dibujo', tl, k(s, 'tachon').parentNode, { en: 0.25, dur: 0.45, escalon: 0 });
      efecto('revuelto', tl, k(s, 'vida'), { en: 0.75, dur: 1.3, glifos: 'MUERTEVIDA' });
    },
    'sn-isolde': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-izq'), { n: 5, en: 0.05, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-der'), { n: 5, en: 0.3, dur: 0.8 });
      aparece(tl, k(s, 'nombre'), 1.1, 0.5);
    },
    'sn-escape': function (tl, s) {
      efecto('voltea', tl, k(s, 'voltea'), { en: 0.5, dur: 1.2 });
      aparece(tl, k(s, 'texto'), 1.4, 0.5);
    },
    'sn-dialogos': function (tl, s) {
      // La cortina del paquete: cada mitad entra desde su lado.
      tl.from(k(s, 'izq'), { x: -560, duration: 0.85, ease: 'power3.out' }, 0.1);
      tl.from(k(s, 'der'), { x: 560, duration: 0.85, ease: 'power3.out' }, 0.25);
    },
    'sn-asqueroso': function (tl, s) {
      efecto('pixelado', tl, k(s, 'pixel'), { dur: 2.2, desde: 72, pasos: 6 });
    },
    'sn-skins': function (tl, s) {
      efecto('bento', tl, k(s, 'rejilla'), { desde: 'start', escalon: 0.06, dur: 0.5 });
      efecto('contador', tl, k(s, 'doce'), { en: 0.4, dur: 1.4, cuenta: 12 });
    },
    'sn-prestigio': function (tl, s) {
      window.continua(tl, s);
      // El resto llega encendido desde sn-skins y se apaga al 25 %.
      tl.fromTo(q(s, '[data-skin]').filter(function (t) { return ['9', '27'].indexOf(t.getAttribute('data-skin')) < 0; }), { opacity: 1 }, { opacity: 0.25, duration: 0.6, ease: 'power1.inOut', immediateRender: true }, 0.15);
      aparece(tl, k(s, 'dos').parentNode, 0.6, 0.45);
      efecto('brillo', tl, k(s, 'dos'), { en: 0.9, dur: 1.2, color: '#FFF3C4' });
      aparece(tl, k(s, 'lv'), 1.0);
    },
    'sn-esports': function (tl, s) {
      efecto('sello', tl, k(s, 'cero'), { en: 0.4, fuerza: 12 });
      aparece(tl, k(s, 'esports'), 1.0, 0.5);
    },
    'sn-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'gg'), { en: 0.35 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 0.35, dur: 1.4, color: '${ORO},#FFF1C2,#FFFFFF', origen: '30 50', semilla: 'gg-senna' });
    },
    'sn-reposo': function () {},
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
<title>Senna cumple 7 años</title>
${kit.og({ titulo: 'Senna cumple 7 años', descripcion: 'Cumplelolero #32 en banda inferior: el OTP de Brasil, las seis gráficas (maestría, partidas, rango, alcance, ataque y crítico), el Mundial sin picks ni bans, el lore con La Ruina y las 12 skins. Solo arte oficial.', carpeta: 'creator/senna' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(10,15,14,0.85); color: ${LUZ}; cursor: pointer;
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
${kit.gsap(__dirname, ['SplitText', 'MotionPath'])}
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
