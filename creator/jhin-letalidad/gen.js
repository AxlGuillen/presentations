// Generador de index.html — «La build que dije que no servía contra Vayne jungla, Brand ADC y Yuumi»
// (canal Axelsine, 12/11/2026)
// Ejecutar: node creator/jhin-letalidad/gen.js   ·   clips: node tools/laminas.mjs creator/jhin-letalidad --banda=arriba
//
// Sigue al pie de la letra el paquete `2026-11-12_jhin-build-que-no-servia--paquete.md` (PKB de Axl):
//   · **Banda ARRIBA con el formato y la tarjeta-item de jhin-build**: el riel, el panel, `arte`,
//     `respaldo`, `dato`, `icono`, `tarjeta`, `mitad`/`costura` y `ranuras` están copiados tal cual de
//     creator/jhin-build/gen.js. Lo único que se le agregó a `ranuras` es el minuto de compra (layout E)
//     y el layout G nuevo, `retrato()`, para el draft enemigo.
//   · **Zona segura de la banda arriba**: nada de texto ni cifras en los primeros 180 px; el texto va de
//     y 180 a 640, entre x 60 y 960. El arte sí va a sangre.
//   · 🚫 **NUNCA aparecen nombres de jugadores**: el ranking de jl-ultimo y las gráficas van solo con el
//     ícono cuadrado del campeón. Nada de capturas de op.gg ni del TAB.
//   · Todo campeón enemigo que nombra la voz sale con su ícono oficial y su rol; los roles troll (Vayne
//     JUNGLA y Brand ADC) en rojo. Todo item con su ícono y su nombre en inglés; las runas en español,
//     como las dice la voz (CLARIDAD MENTAL, no «Concentración Profunda»).
//   · Solo arte oficial (Data Dragon 16.22.1). Lo dibujado es dato: gráficas, filas de inventario, los
//     tachones, las grietas del marco y el anillo de almas. Groserías y chistes solo en la voz.
//   · Ninguna lámina arranca en negro ni tarda más de 2,8 s en entrar.
//
// ⚠️ Recetas que el paquete pide y se cambiaron (anotadas también en el paquete):
//   · `astilla` no existe en el kit: en jl-papel las grietas del marco se trazan con `dibujo` y la ranura
//     baja al 40 % de brillo a mano.
//   · `crece` del kit es el FLIP de una celda que llena su contenedor: el Jax de jl-papel crece a mano
//     (escala con la curva `asentar`) y las barras de jl-dano crecen a mano con la curva `entrada`.
//   · `pulso` no existe (nota de jhin-build): latido de escala con la curva `golpe` (ida y vuelta).
//   · `cortina` (jl-cristal) e `iris` (jl-brand) van a mano, como en jhin-build: las del kit recortan la
//     <section> entera y la banda quedaría vacía en el cuadro 0.
//   · `data-paso` («entra cuando la voz lo nombra»): las láminas son de 2,5 s y no hay voz alineada, así
//     que los pasos van escalonados en el orden del guion; cada pieza lleva su data-paso para cuando el
//     montaje los sincronice.
//   · En jl-runas el encendido de gris a color es a mano (no hay receta para eso).
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ── Paleta (sección 1.5; la de jhin-build) ────────────────────────────────
const BG = '#0D0A0B';
const ORO = '#E0B354';     // lo de Axl: la build de letalidad, sus cifras y su barra
const LUZ = '#F3EFE2';     // cifras y texto
const ROJO = '#D2443C';    // el otro equipo y lo malo
const GRIS = '#5B6461';    // comparación y la build de Cronofox cuando se descarta
const TIP = '#010A13';     // tarjeta-item
const BORDE = '#785A28';   // tarjeta-item y ranuras del HUD

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── Items (sección 5; Data Dragon 16.22.1, nombres en inglés, estadísticas en es_MX) ──
const ITEMS = {
  hubris: { id: 6697, nombre: 'HUBRIS', costo: 2800, stats: ['+55 DAÑO DE ATAQUE', '18 LETALIDAD', '10 ACELERACIÓN DE HABILIDAD'],
    pasiva: { nombre: 'EMINENCIA', texto: '<b>+DAÑO DE ATAQUE</b> POR KILL' } },
  collector: { id: 6676, nombre: 'THE COLLECTOR', costo: 3000, stats: ['+50 DAÑO DE ATAQUE', '10 LETALIDAD', '25 % CRÍTICO'],
    pasiva: { nombre: 'MUERTE', texto: 'EJECUTA DEBAJO DEL <b>5 %</b> DE VIDA' } },
  swiftness: { id: 3009, nombre: 'BOOTS OF SWIFTNESS' },
  ie: { id: 3031, nombre: 'INFINITY EDGE' },
  stormrazor: { id: 3095, nombre: 'STORMRAZOR' },
  hexoptics: { id: 2523, nombre: 'HEXOPTICS C44' },
};
// Capturas reales que reemplazan a la tarjeta si existen (como en jhin-build). Si se agregan, los nombres
// de los jugadores tienen que estar tapados antes.
const CAPTURAS = { hubris: 'hubris', collector: 'collector' };
const captura = (clave) => {
  const n = CAPTURAS[clave];
  return n && fs.existsSync(path.join(__dirname, 'assets', 'capturas', `${n}.png`)) ? `capturas/${n}.png` : null;
};

// ── Datos (sección 5: op.gg del 12/11/2026, partida del 10/11, victoria en 26:32) ──
const ENEMIGOS = [ // en el orden del guion
  { c: 'Vayne', rol: 'JUNGLA', troll: true }, { c: 'Brand', rol: 'ADC', troll: true },
  { c: 'Yuumi', rol: 'SUPPORT' }, { c: 'Katarina', rol: 'MID' }, { c: 'Jax', rol: 'TOP' },
];
// Puntuación de op.gg, de mayor a menor. `eq`: 'axl' o 'enemigo'. Solo ícono: sin nombres de jugador.
const RANKING = [['Lux', 8.3, 'axl'], ['Jhin', 8.1, 'axl'], ['Zyra', 7.7, 'axl'], ['Ekko', 5.8, 'axl'], ['Yone', 5.6, 'axl'],
  ['Katarina', 4.4, 'enemigo'], ['Yuumi', 3.8, 'enemigo'], ['Brand', 3.5, 'enemigo'], ['Jax', 2.8, 'enemigo'], ['Vayne', 0.4, 'enemigo']];
const DANO = [['Jhin', 22997], ['Ekko', 22351], ['Katarina', 21032], ['Jax', 17536]];
const ORO_P = [['Jhin', 15922], ['Ekko', 13615], ['Zyra', 12354]];
const DPM = { cronofox: 913, partida: 867, hubris: 696 };
const BUILD = [['hubris', 9], ['swiftness', 10], ['collector', 16], ['ie', 20], ['stormrazor', 23]];

// ── El riel (copiado de jhin-build; kit.banda() lo invierte con la banda arriba) ──
const estrella = (x, y, s) => {
  const f = s * 0.16, n = (v) => +v.toFixed(1);
  return `M${n(x)} ${n(y - s)} Q${n(x + f)} ${n(y - f)} ${n(x + s)} ${n(y)} Q${n(x + f)} ${n(y + f)} ${n(x)} ${n(y + s)} Q${n(x - f)} ${n(y + f)} ${n(x - s)} ${n(y)} Q${n(x - f)} ${n(y - f)} ${n(x)} ${n(y - s)}Z`;
};
const RIEL = (() => {
  const r = kit.random('riel-jhin');
  const marcas = [];
  for (let x = 60; x <= 1020; x += 120) {
    marcas.push(`<line x1="${x}" y1="28" x2="${x}" y2="${x % 240 === 60 ? 40 : 34}"/>`, `<line x1="${x}" y1="652" x2="${x}" y2="${x % 240 === 60 ? 640 : 646}"/>`);
  }
  // Cuatro destellos: el número de balas de Jhin. Del lado del gameplay en dorado; del otro, blancos.
  const brillos = [0, 1, 2, 3].map((i) => {
    const lado = i < 2, cuarto = i % 2;
    const x = Math.round(80 + cuarto * 480 + r() * 380), y = Math.round(lado ? 52 + r() * 30 : 598 + r() * 30), s = Math.round(7 + r() * 7);
    return `<path d="${estrella(x, y, s)}" fill="${lado ? ORO : LUZ}" opacity="${(0.5 + r() * 0.3).toFixed(2)}"/>`;
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
        <path d="M540 14 L546 20 L540 26 L534 20Z" fill="${ORO}"/><path d="M540 654 L546 660 L540 666 L534 660Z" fill="${ORO}"/>
        ${brillos}
      </svg>`;
})();

// ── Piezas (copiadas de jhin-build) ──────────────────────────────────────
const SECCION = `background: ${BG}; color: ${LUZ}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(LUZ, 0.12)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(LUZ, 0.12)};">GAMEPLAY</div>`;

/** Arte a sangre o en una caja: <img> con object-fit cover, foco en `pos` y zoom fijo. */
const arte = (src, alt, { x = 0, y = 0, w = PW, h = PH, pos = '50% 50%', zoom = 1, filtro = '', k = '', estilo = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; ${estilo}">
        <img src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; transform: scale(${zoom}); transform-origin: ${pos}; display: block; ${filtro ? `filter: ${filtro};` : ''}">
      </div>`;
/** Copia desenfocada y opaca (no es data-fondo: la banda es opaca y se ve desde el cuadro 0). */
const respaldo = (src, { blur = 18, brillo = 0.3, pos = 'center', x = 0, y = 0, w = PW, h = PH, k = '' } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;"><div style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: ${pos}; filter: blur(${blur}px) brightness(${brillo}) saturate(1.1);"></div></div>`;
const veloIzq = (fuerza = 0.88) => `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, fuerza)} 0%, ${a(BG, fuerza * 0.55)} 40%, ${a(BG, 0)} 68%);"></div>`;
const veloAbajoIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(95% 90% at 0% 80%, ${a(BG, 0.88)} 0%, ${a(BG, 0.45)} 45%, ${a(BG, 0)} 75%);"></div>`;

/** Texto: solo el dato. Siempre entre y 180 y 640, x 60 y 960 (zona segura de la banda arriba). */
const dato = (txt, { x = 60, y, w = 840, tam, color = LUZ, alinear = 'left', tracking = 4, lh = 1, k = '', sombra = true } = {}) => `
      <div${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; text-align: ${alinear}; font-size: ${tam}px; line-height: ${lh}; letter-spacing: ${tracking}px; color: ${color};${sombra ? ` text-shadow: 0 6px 30px rgba(0,0,0,.85);` : ''}">${txt}</div>`;

/** Ícono oficial de item con el marco dorado del HUD. */
const icono = (clave, tam, { k = '', x = null, y = null, borde = BORDE, estilo = '' } = {}) => {
  const it = ITEMS[clave];
  const pos = x == null ? 'position: relative;' : `position: absolute; left: ${x}px; top: ${y}px;`;
  return `<div${k ? ` data-k="${k}"` : ''} style="${pos} width: ${tam}px; height: ${tam}px; box-sizing: border-box; border: ${Math.max(2, Math.round(tam / 48))}px solid ${borde}; background: ${TIP}; box-shadow: 0 10px 28px rgba(0,0,0,.65); ${estilo}"><img src="assets/items/${it.id}.png" alt="${it.nombre}" style="width: 100%; height: 100%; display: block;"></div>`;
};

/** Layout B: tarjeta-item (o su captura real) en x 60, y 180, 520×460. Igual que en jhin-build. */
const T = { x: 60, y: 180, w: 520, h: 460 };
const tarjeta = (clave) => {
  const it = ITEMS[clave], cap = captura(clave);
  if (cap) return `
      <div data-k="tarjeta" style="position: absolute; left: ${T.x}px; top: ${T.y}px; width: ${T.w}px; height: ${T.h}px; box-sizing: border-box; border: 2px solid ${BORDE}; background: ${a(TIP, 0.94)}; display: flex; align-items: center; justify-content: center; box-shadow: 0 18px 44px rgba(0,0,0,.65);">
        <img src="assets/${cap}" alt="${it.nombre}, captura del juego" style="max-width: 100%; max-height: 100%; image-rendering: auto; display: block;">
      </div>`;
  return `
      <div data-k="tarjeta" style="position: absolute; left: ${T.x}px; top: ${T.y}px; width: ${T.w}px; height: ${T.h}px; box-sizing: border-box; border: 2px solid ${BORDE}; background: ${a(TIP, 0.94)}; box-shadow: 0 18px 44px rgba(0,0,0,.65);">
        ${icono(clave, 128, { k: 'icono', x: 22, y: 22, borde: '#C8AA6E' })}
        <div style="position: absolute; left: 170px; top: 22px; width: 330px; height: 128px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size: ${it.nombre.length > 14 ? 46 : 54}px; line-height: .95; letter-spacing: 1px; color: ${LUZ};">${it.nombre}</div>
          <div style="display: flex; align-items: center; gap: 10px; font-size: 40px; line-height: 1; color: ${ORO};"><img src="assets/iconos/oro.png" alt="Oro" style="width: 34px; height: 34px; display: block;">${it.costo}</div>
        </div>
        <div style="position: absolute; left: 22px; right: 22px; top: 168px; height: 2px; background: linear-gradient(90deg, ${BORDE}, ${a(BORDE, 0.2)});"></div>
        <div style="position: absolute; left: 22px; top: 186px; width: 470px;">
          ${it.stats.map((s) => `<div data-stat style="font-size: 34px; line-height: 39px; letter-spacing: 1px; color: ${a(LUZ, 0.92)}; white-space: nowrap;">${s}</div>`).join('')}
        </div>
        <div data-k="pasiva" style="position: absolute; left: 22px; right: 22px; bottom: 22px; padding: 10px 14px 12px; border-left: 5px solid ${ORO}; background: ${a(ORO, 0.1)};">
          ${it.pasiva.nombre ? `<div style="font-size: 24px; line-height: 1; letter-spacing: 3px; color: ${a(ORO, 0.8)};">${it.pasiva.nombre}</div>` : ''}
          <div style="margin-top: ${it.pasiva.nombre ? 6 : 0}px; font-size: 31px; line-height: 1.08; letter-spacing: 1px; color: ${ORO};">${it.pasiva.texto.replace(/<b>/g, `<b style="font-weight: 400; font-size: 42px; color: #FFE7A8; white-space: nowrap;">`)}</div>
        </div>
      </div>`;
};

/** Layout D: dos mitades de 540×680 con un corte diagonal de 6° al centro. */
const T6 = Math.tan((6 * Math.PI) / 180) * (PH / 2);
const CLIP_IZQ = `polygon(0 0, ${(540 + T6).toFixed(1)}px 0, ${(540 - T6).toFixed(1)}px ${PH}px, 0 ${PH}px)`;
const CLIP_DER = `polygon(${(540 + T6).toFixed(1)}px 0, ${PW}px 0, ${PW}px ${PH}px, ${(540 - T6).toFixed(1)}px ${PH}px)`;
const mitad = (lado, contenido, k = lado) => `
      <div data-k="${k}" style="position: absolute; inset: 0; clip-path: ${lado === 'izq' ? CLIP_IZQ : CLIP_DER};">${contenido}
      </div>`;
const costura = `
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; pointer-events: none;"><line x1="${(540 + T6).toFixed(1)}" y1="0" x2="${(540 - T6).toFixed(1)}" y2="${PH}" stroke="${ORO}" stroke-width="3"/></svg>`;

/** Layout E: seis ranuras de inventario en fila, con el marco del HUD (de jhin-build). Nuevo aquí:
 *  `minutos`, el minuto de compra debajo de cada ícono, y el nombre en inglés debajo del minuto. */
const ranuras = (llenas, { tam = 120, sep = 24, y = 240, x0 = null, k = 'fila', etiquetas = true, minutos = [], apagar = [], destacar = -1 } = {}) => {
  const ancho = 6 * tam + 5 * sep, xi = x0 == null ? (PW - ancho) / 2 : x0, marcos = [];
  const celdas = [0, 1, 2, 3, 4, 5].map((i) => {
    const clave = llenas[i], x = xi + i * (tam + sep), it = clave && ITEMS[clave];
    const marco = `position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; box-sizing: border-box; border: 3px solid ${i === destacar ? ORO : BORDE}; background: ${a(TIP, 0.82)};`;
    const vacia = `<div data-ranura style="${marco} box-shadow: inset 0 0 22px rgba(0,0,0,.8);"></div>`;
    marcos.push(vacia);
    if (!it) return '';
    const min = minutos[i] != null ? `<div data-minuto style="position: absolute; left: ${x - 20}px; top: ${y + tam + 8}px; width: ${tam + 40}px; text-align: center; font-size: 42px; line-height: 1; letter-spacing: 1px; color: ${ORO}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${minutos[i]}'</div>` : '';
    const nombre = etiquetas ? `<div data-nombre-item style="position: absolute; left: ${x - 40}px; top: ${y + tam + (minutos[i] != null ? 56 : 10)}px; width: ${tam + 80}px; text-align: center; font-size: ${minutos[i] != null ? 30 : 34}px; line-height: 1; letter-spacing: 1px; color: ${a(LUZ, 0.92)}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${it.nombre.replace(' C44', '<br>C44').replace('THE ', 'THE<br>').replace('BOOTS OF ', 'BOOTS OF<br>').replace('INFINITY ', 'INFINITY<br>')}</div>` : '';
    return `<div data-item="${clave}" style="${marco} border-color: ${i === destacar ? ORO : '#C8AA6E'}; ${apagar.includes(i) ? 'filter: grayscale(1) brightness(.6);' : ''} box-shadow: ${i === destacar ? `0 0 34px ${a(ORO, 0.7)}` : '0 10px 26px rgba(0,0,0,.6)'};"><img src="assets/items/${it.id}.png" alt="${it.nombre}" style="width: 100%; height: 100%; display: block;"></div>${min}${nombre}`;
  }).join('');
  return `<div data-k="${k}" style="position: absolute; inset: 0;"><div data-k="${k}-marcos" style="position: absolute; inset: 0;">${marcos.join('')}</div>${celdas}</div>`;
};

/** Layout G (nuevo): ícono cuadrado del campeón con el borde rojo del equipo enemigo y su rol debajo
 *  (34 px; en rojo si es un rol fuera de lugar). Nunca el nombre del jugador. */
const retrato = (c, { tam = 150, rol = '', troll = false, borde = ROJO, k = '', paso = null, estilo = '', tamRol = 34 } = {}) => `
        <div${k ? ` data-k="${k}"` : ''}${paso != null ? ` data-paso="${paso}"` : ''} data-retrato="${c}" style="position: relative; width: ${tam}px; ${estilo}">
          <div data-marco style="position: relative; width: ${tam}px; height: ${tam}px; box-sizing: border-box; border: 3px solid ${borde}; background: ${TIP}; box-shadow: 0 10px 26px rgba(0,0,0,.6);"><img src="assets/campeones/${c}.png" alt="${c}" style="width: 100%; height: 100%; display: block;"></div>
          ${rol ? `<div data-rol${troll ? ' data-troll' : ''} style="margin-top: 12px; text-align: center; font-size: ${tamRol}px; line-height: 1; letter-spacing: 3px; color: ${troll ? ROJO : LUZ}; text-shadow: 0 4px 18px rgba(0,0,0,.9); white-space: nowrap;">${rol}</div>` : ''}
        </div>`;

/** Tachón a mano (pathLength 1: se dibuja con strokeDashoffset). */
const tachon = (k, { x, y, w, h = 60, grosor = 10, color = ROJO } = {}) => `
      <svg viewBox="0 0 ${w} ${h}" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: visible; pointer-events: none; z-index: 3;"><path data-k="${k}" d="M4 ${h * 0.62} C ${w * 0.3} ${h * 0.45}, ${w * 0.7} ${h * 0.6}, ${w - 4} ${h * 0.36}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** Ficha chica de campeón enemigo + nombre con su rol (para las láminas de plano completo). */
const ficha = (c, rol, troll, { y = 196 } = {}) => `
      <div data-k="ficha" style="position: absolute; left: 60px; top: ${y}px; display: flex; align-items: center; gap: 24px;">
        ${retrato(c, { tam: 116 })}
        <div style="font-size: 104px; line-height: 1; letter-spacing: 4px; text-shadow: 0 6px 30px rgba(0,0,0,.85); white-space: nowrap;">${c.toUpperCase()} <span style="color: ${troll ? ROJO : LUZ};">${rol}</span></div>
      </div>`;

const slides = [];

// ── 1 · jl-portada · E ─── la fila de Hubris y The Collector, y el 2–5 viejo ── (sello)
slides.push(lamina('jl-portada', 'En mi video pasado les dije que con la build de Hubris y Collector iba dos y cinco.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { pos: '55% 30%', brillo: 0.56 })}
      ${dato('OP.GG', { x: 120, y: 186, w: 400, tam: 40, tracking: 8, color: a(LUZ, 0.6), k: 'opgg' })}
      ${ranuras(['hubris', 'collector'], { y: 240, x0: 120 })}
      <div style="position: absolute; left: 520px; top: 400px; width: 440px; height: 220px;">
        <div data-k="marcador" style="position: absolute; inset: 0; text-align: center; font-size: 210px; line-height: .95; letter-spacing: 4px; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.85);">2–5</div>
      </div>`));

// ── 2 · jl-tragar · A ─── Luna de Sangre: el 2–5 se tacha y entra el 14/5/7 ── (revuelto)
slides.push(lamina('jl-tragar', 'Miren nada más quién se tuvo que tragar sus palabras.', `
      ${respaldo('splash/Jhin_2-fondo.jpg', { blur: 12, brillo: 0.45, pos: '60% 25%' })}
      ${arte('splash/Jhin_2.jpg', 'Jhin Luna de Sangre, splash', { pos: '62% 22%', zoom: 1.1, filtro: 'brightness(.85)' })}
      ${veloAbajoIzq}${veloIzq(0.6)}
      <div style="position: absolute; left: 60px; top: 200px; font-size: 150px; line-height: 1; letter-spacing: 4px; color: ${ROJO}; text-shadow: 0 6px 30px rgba(0,0,0,.85);"><span data-k="viejo" style="display: inline-block;">2–5</span></div>
      ${tachon('tachon', { x: 46, y: 228, w: 230, h: 80, grosor: 12, color: LUZ })}
      ${dato('<span data-k="nuevo" style="display: inline-block;">14/5/7</span>', { x: 56, y: 360, w: 800, tam: 250, tracking: 6, color: ORO })}`));

// ── 3 · jl-draft · G ─── el draft enemigo, en el orden en que lo nombra la voz ── (bento)
const G = { tam: 150, sep: 30, y: 290 }, GX = (PW - (5 * G.tam + 4 * G.sep)) / 2;
const filaDraft = (k, opciones = () => ({})) => `
      <div data-k="${k}" style="position: absolute; left: ${GX}px; top: ${G.y}px; display: flex; gap: ${G.sep}px;">
        ${ENEMIGOS.map((e, i) => retrato(e.c, { tam: G.tam, rol: e.rol, troll: e.troll, paso: i + 1, ...opciones(e, i) })).join('')}
      </div>`;
const VINETA = `
      <div style="position: absolute; inset: 0; background: radial-gradient(70% 80% at 50% 55%, #2A171A 0%, #170D0F 55%, ${BG} 100%);"></div>`;
slides.push(lamina('jl-draft', 'Cuando vi el draft del otro equipo: Vayne jungla, Brand ADC, Yuumi de support, Katarina mid y un Jax top.', `
      ${VINETA}
      ${dato('DRAFT ENEMIGO', { x: 60, y: 190, w: 960, tam: 60, tracking: 12, alinear: 'center', color: a(LUZ, 0.8), k: 'titulo' })}
      ${filaDraft('draft')}`));

// ── 4 · jl-papel · G ─── cuatro de cristal se agrietan; Jax queda entero ── (dibujo)
const grieta = (i) => {
  const r = kit.random(`grieta-${i}`), t = G.tam, p = [];
  let x = t * (0.3 + r() * 0.4), y = 0;
  p.push(`M${x.toFixed(1)} 0`);
  while (y < t) { y = Math.min(t, y + t * (0.16 + r() * 0.12)); x = Math.max(8, Math.min(t - 8, x + (r() * 2 - 1) * t * 0.22)); p.push(`L${x.toFixed(1)} ${y.toFixed(1)}`); }
  const yb = t * (0.35 + r() * 0.3);
  return `<path d="${p.join(' ')}"/><path d="M${(t * 0.5).toFixed(1)} ${yb.toFixed(1)} L${(r() < 0.5 ? 4 : t - 4)} ${(yb + t * (0.1 + r() * 0.15)).toFixed(1)}"/>`;
};
slides.push(lamina('jl-papel', 'Cuatro personajes de papel y uno con algo de vida.', `
      ${VINETA}
      ${filaDraft('papel', (e) => (e.c === 'Jax' ? { k: 'jax' } : {}))}
      <svg data-k="grietas" viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible; pointer-events: none;">
        ${[0, 1, 2, 3].map((i) => `<g transform="translate(${GX + i * (G.tam + G.sep)} ${G.y})" fill="none" stroke="${LUZ}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${grieta(i)}</g>`).join('')}
      </svg>
      ${dato(`4 DE CRISTAL <span style="color: ${a(LUZ, 0.45)};">·</span> <span style="color: ${ORO};">1 JAX</span>`, { x: 60, y: 540, w: 960, tam: 76, tracking: 6, alinear: 'center', k: 'frase' })}`));

// ── 5 · jl-vayne · A ─── Vayne jungla: 1/9/2 y 4.764 de daño ── (sello)
slides.push(lamina('jl-vayne', 'La Vayne jungla terminó uno, nueve, dos, con cuatro mil setecientos de daño en veintiséis minutos.', `
      ${respaldo('splash/Vayne_0-fondo.jpg', { blur: 12, brillo: 0.45 })}
      ${arte('splash/Vayne_0.jpg', 'Vayne, splash', { pos: '60% 25%', filtro: 'brightness(.8)' })}
      ${veloIzq(0.9)}
      ${ficha('Vayne', 'JUNGLA', true)}
      <div style="position: absolute; left: 60px; top: 340px; width: 520px; height: 190px;"><div data-k="kda" style="font-size: 200px; line-height: .95; letter-spacing: 6px; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.85);">1/9/2</div></div>
      ${dato(`<span data-k="dano">${num(4764)}</span> DE DAÑO`, { x: 60, y: 548, w: 700, tam: 76, tracking: 4 })}`));

// ── 6 · jl-ultimo · C ─── la puntuación de op.gg, solo con íconos de campeón ── (maquina)
const fila10 = ([c, p, eq], i) => {
  const col = i < 5 ? 0 : 1, fila = i % 5, x = 60 + col * 470, y = 244 + fila * 78, ult = i === 9;
  const color = ult ? ROJO : c === 'Jhin' ? ORO : eq === 'enemigo' ? a(LUZ, 0.7) : LUZ;
  return `
      <div data-fila${ult ? ' data-k="ultima"' : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: 430px; height: 66px; display: flex; align-items: center; gap: 22px; ${ult ? `background: ${a(ROJO, 0.14)}; box-shadow: inset 4px 0 0 ${ROJO};` : ''}">
        <div style="width: 58px; text-align: right; font-size: 44px; line-height: 1; color: ${a(LUZ, 0.55)};">${i + 1}</div>
        <div style="width: 62px; height: 62px; box-sizing: border-box; border: 3px solid ${eq === 'enemigo' ? ROJO : c === 'Jhin' ? ORO : a(LUZ, 0.35)};"><img src="assets/campeones/${c}.png" alt="${c}" style="width: 100%; height: 100%; display: block;"></div>
        <div style="font-size: 56px; line-height: 1; letter-spacing: 2px; color: ${color};"><span data-puntos>${p.toFixed(1)}</span></div>
      </div>`;
};
slides.push(lamina('jl-ultimo', 'op.gg lo puso último de los diez jugadores.', `
      ${respaldo('splash/Vayne_0-fondo.jpg', { blur: 18, brillo: 0.3 })}
      ${dato('OP.GG · PUNTUACIÓN', { x: 60, y: 186, w: 700, tam: 44, tracking: 6, color: a(LUZ, 0.7), k: 'titulo' })}
      ${RANKING.map(fila10).join('')}`));

// ── 7 · jl-brand · A ─── Brand ADC: 5/8/5, ocho muertes ── (iris a mano)
slides.push(lamina('jl-brand', 'El Brand ADC al menos hizo daño pero se murió ocho veces.', `
      ${respaldo('splash/Brand_0-fondo.jpg', { blur: 12, brillo: 0.4 })}
      ${arte('splash/Brand_0.jpg', 'Brand, splash', { pos: '60% 30%', k: 'arte', filtro: 'brightness(.8)' })}
      ${veloIzq(0.9)}
      ${ficha('Brand', 'ADC', true)}
      ${dato('5/8/5', { x: 60, y: 340, w: 600, tam: 170, tracking: 6, k: 'kda' })}
      ${dato(`<span data-k="muertes">8</span> MUERTES`, { x: 60, y: 524, w: 600, tam: 96, tracking: 5, color: ROJO, k: 'linea-muertes' })}`));

// ── 8 · jl-yuumi · A ─── Yuumi: 0/5/11 ── (empuje)
slides.push(lamina('jl-yuumi', 'Y la Yuumi pues hizo lo que hace Yuumi.', `
      ${respaldo('splash/Yuumi_0-fondo.jpg', { blur: 12, brillo: 0.45 })}
      ${arte('splash/Yuumi_0.jpg', 'Yuumi, splash', { pos: '55% 35%', k: 'arte', filtro: 'brightness(.75)' })}
      ${veloIzq(0.88)}
      ${ficha('Yuumi', 'SUPPORT', false)}
      ${dato('<span data-k="kda" style="display: inline-block;">0/5/11</span>', { x: 56, y: 350, w: 800, tam: 230, tracking: 6 })}`));

// ── 9 · jl-cristal · D ─── Cronofox (gris, tachada) contra letalidad (dorado) ── (cortina a mano + destello)
slides.push(lamina('jl-cristal', 'Si el enemigo es puro cristal no necesito la build de Cronofox. Necesito letalidad.', `
      ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 16, brillo: 0.28 })}
      ${mitad('izq', `
        ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 12, brillo: 0.32, pos: '30% 40%' })}
        <div data-k="iconos-izq" style="position: absolute; left: ${270 - 160}px; top: 210px; display: flex; gap: 20px;">${icono('hexoptics', 150, { estilo: 'filter: grayscale(1) brightness(.6);' })}${icono('stormrazor', 150, { estilo: 'filter: grayscale(1) brightness(.6);' })}</div>
        ${dato('<span data-k="txt-izq">CRONOFOX</span>', { x: 60, y: 420, w: 420, tam: 96, tracking: 5, alinear: 'center', color: GRIS })}
        ${tachon('tachon', { x: 96, y: 432, w: 330, h: 80, grosor: 12 })}`)}
      ${mitad('der', `
        ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 12, brillo: 0.42, pos: '70% 30%' })}
        <div data-k="destello" style="position: absolute; left: ${810 - 230}px; top: ${285 - 230}px;">${kit.destello({ tam: 460, rayos: 16, color: ORO, semilla: 'letalidad' })}</div>
        <div data-k="iconos-der" style="position: absolute; left: ${810 - 160}px; top: 210px; display: flex; gap: 20px;">${icono('hubris', 150, { borde: ORO, estilo: `box-shadow: 0 0 34px ${a(ORO, 0.5)};` })}${icono('collector', 150, { borde: ORO, estilo: `box-shadow: 0 0 34px ${a(ORO, 0.5)};` })}</div>
        ${dato('<span data-k="txt-der">LETALIDAD</span>', { x: 600, y: 420, w: 380, tam: 96, tracking: 5, alinear: 'center', color: ORO })}`)}
      ${costura}`));

// ── 10 · jl-cosecha · A ─── Cosecha Oscura a 3× sobre Jhin_14 ── (brillo)
slides.push(lamina('jl-cosecha', 'Las runas fueron Cosecha oscura para rematar a los que quedan con poca vida.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 10, brillo: 0.5, pos: '60% 30%' })}
      ${arte('splash/Jhin_14.jpg', 'Jhin Alta Costura, splash', { pos: '62% 25%', filtro: 'brightness(.7)' })}
      ${veloIzq(0.9)}
      <img data-k="runa" src="assets/runas/DarkHarvest.png" alt="Cosecha Oscura" style="position: absolute; left: 50px; top: 200px; width: 240px; height: 240px; filter: drop-shadow(0 0 30px rgba(210,68,60,.55));">
      ${dato('<span data-k="nombre">COSECHA OSCURA</span>', { x: 320, y: 236, w: 640, tam: 104, tracking: 4, color: ORO })}
      ${dato('REMATA A LOS DE POCA VIDA', { x: 324, y: 360, w: 600, tam: 66, tracking: 3, lh: 1.02, k: 'efecto' })}`));

// ── 11 · jl-runas · E ─── la página de runas, de gris a color en el orden de la voz ── (encendido a mano)
const RUNAS_A = [['DarkHarvest', 'COSECHA OSCURA', 1, 140], ['TasteOfBlood', 'SABOR A SANGRE', 2, 110], ['GrislyMementos', 'RECUERDOS MACABROS', 3, 110], ['TreasureHunter', 'CAZADOR DE TESOROS', 3, 110]];
const RUNAS_B = [['PresenceOfMind', 'CLARIDAD MENTAL', 4, 100], ['CoupDeGrace', 'GOLPE DE GRACIA', 5, 100]];
const runa = ([f, nom, paso, tam], cx, y) => `
      <div data-runa data-paso="${paso}" style="position: absolute; left: ${cx - 110}px; top: ${y}px; width: 220px; text-align: center;">
        <img src="assets/runas/${f}.png" alt="${nom.charAt(0) + nom.slice(1).toLowerCase()}" style="width: ${tam}px; height: ${tam}px; display: block; margin: 0 auto ${140 - tam}px;">
        <div style="margin-top: 8px; font-size: 30px; line-height: 1; letter-spacing: 1px; color: ${LUZ}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${nom}</div>
      </div>`;
slides.push(lamina('jl-runas', 'Sabor a sangre, Cazador de tesoros, y en la secundaria Claridad mental y Golpe de gracia.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 18, brillo: 0.3, pos: '40% 60%' })}
      <img src="assets/runas/Domination.png" alt="Dominación" style="position: absolute; left: 60px; top: 236px; width: 72px; height: 72px;">
      ${RUNAS_A.map((r, i) => runa(r, 250 + i * 200, 190)).join('')}
      <div style="position: absolute; left: 60px; top: 404px; width: 900px; height: 2px; background: ${a(BORDE, 0.6)};"></div>
      <img src="assets/runas/Precision.png" alt="Precisión" style="position: absolute; left: 60px; top: 452px; width: 72px; height: 72px;">
      ${RUNAS_B.map((r, i) => runa(r, 250 + i * 200, 420)).join('')}`));

// ── 12 · jl-almas · C ─── el anillo de almas alrededor de la Cosecha ── (dibujo)
const ALMA = { cx: 540, cy: 440, r: 150, n: 12 };
const arcos = Array.from({ length: ALMA.n }, (_, i) => {
  const a0 = (i / ALMA.n) * Math.PI * 2 - Math.PI / 2 + 0.07, a1 = ((i + 1) / ALMA.n) * Math.PI * 2 - Math.PI / 2 - 0.07;
  const p = (ang) => `${(ALMA.cx + ALMA.r * Math.cos(ang)).toFixed(1)} ${(ALMA.cy + ALMA.r * Math.sin(ang)).toFixed(1)}`;
  return `<path d="M${p(a0)} A${ALMA.r} ${ALMA.r} 0 0 1 ${p(a1)}"/>`;
}).join('');
slides.push(lamina('jl-almas', 'Y la Cosecha se va cargando con cada alma que juntas.', `
      ${respaldo('splash/Jhin_2-fondo.jpg', { blur: 18, brillo: 0.32, pos: '60% 30%' })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <circle cx="${ALMA.cx}" cy="${ALMA.cy}" r="${ALMA.r}" fill="none" stroke="${a(LUZ, 0.14)}" stroke-width="16"/>
        <g data-k="anillo" fill="none" stroke="${ORO}" stroke-width="16" stroke-linecap="butt">${arcos}</g>
      </svg>
      <img data-k="runa" src="assets/runas/DarkHarvest.png" alt="Cosecha Oscura" style="position: absolute; left: ${ALMA.cx - 100}px; top: ${ALMA.cy - 100}px; width: 200px; height: 200px;">
      ${dato('+DAÑO POR CADA ALMA', { x: 60, y: 192, w: 960, tam: 70, tracking: 6, alinear: 'center', color: ORO, k: 'titulo' })}`));

// ── 13 · jl-hubris · B ─── tarjeta de Hubris y MIN 9 ── (tarjeta-item + golpe)
slides.push(lamina('jl-hubris', 'La build arrancó con Hubris al minuto nueve; te da más daño de ataque por cada kill.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { blur: 18, brillo: 0.35, pos: '70% 25%' })}
      ${tarjeta('hubris')}
      ${dato('<span data-k="minuto">MIN 9</span>', { x: 610, y: 250, w: 350, tam: 190, color: ORO, tracking: 4 })}
      ${dato('PRIMER ITEM', { x: 614, y: 460, w: 350, tam: 60, tracking: 4, k: 'etq' })}`));

// ── 14 · jl-orden · E ─── Hubris puesta; las botas caen ── (bento)
slides.push(lamina('jl-orden', 'Luego Botas de rapidez.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { pos: '40% 60%', brillo: 0.3 })}
      ${ranuras(['hubris', 'swiftness'], { y: 220, minutos: [9, 10] })}`));

// ── 15 · jl-collector · B ─── tarjeta de The Collector y el 5 % ── (tarjeta-item + contador)
slides.push(lamina('jl-collector', 'Collector, que remata a los que quedan con poquita vida.', `
      ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 18, brillo: 0.35, pos: '50% 30%' })}
      ${tarjeta('collector')}
      ${dato('EJECUTA', { x: 610, y: 196, w: 350, tam: 64, tracking: 6, color: a(LUZ, 0.8), k: 'ejecuta' })}
      ${dato('<span data-k="cifra">5&nbsp;%</span>', { x: 610, y: 262, w: 350, tam: 200, color: ORO, tracking: 2 })}
      ${dato('DE VIDA', { x: 614, y: 470, w: 350, tam: 64, tracking: 6, k: 'vida' })}`));

// ── 16 · jl-build · E ─── la fila completa con el minuto de cada compra ── (destello)
const RF = { y: 230 }, RFX = (PW - (6 * 120 + 5 * 24)) / 2;
slides.push(lamina('jl-build', 'Filo infinito y de cierre Stormrazor.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { pos: '45% 30%', brillo: 0.32 })}
      <div data-k="destello" style="position: absolute; left: ${RFX + 2 * 144 + 60 - 280}px; top: ${RF.y + 60 - 280}px; pointer-events: none;">${kit.destello({ tam: 560, rayos: 20, color: ORO, semilla: 'build-final' })}</div>
      ${ranuras(BUILD.map((b) => b[0]), { y: RF.y + 20, minutos: BUILD.map((b) => b[1]) })}
      ${dato('BUILD FINAL', { x: 60, y: 186, w: 960, tam: 52, tracking: 10, alinear: 'center', color: LUZ, k: 'titulo' })}`));

// ── 17 · jl-resultado · A ─── Creador de Mitos: 14/5/7, victoria ── (tragamonedas)
slides.push(lamina('jl-resultado', 'Resultado: catorce, cinco, siete.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { blur: 12, brillo: 0.5, pos: '45% 30%' })}
      ${arte('splash/Jhin_47.jpg', 'Jhin Creador de Mitos, splash', { pos: '42% 28%', zoom: 1.2, filtro: 'brightness(.8)' })}
      ${veloIzq(0.85)}
      ${dato('<span data-k="kda">14/5/7</span>', { x: 56, y: 220, w: 800, tam: 270, tracking: 6, color: ORO })}
      ${dato('VICTORIA', { x: 62, y: 500, w: 600, tam: 110, tracking: 12, k: 'victoria' })}`));

// ── Gráficas (layout C) ─────────────────────────────────────────────────
/** Barra horizontal con el ícono del campeón (nunca el nombre del jugador) y el valor escrito en ella. */
const barra = ({ c = null, item = null, etiqueta = '', valor, max, color, y, x = 160, ancho = 760, alto = 66, k, tinta = BG }) => {
  const w = Math.max(120, Math.round((ancho * valor) / max));
  const ico = c ? `<div style="position: absolute; left: 60px; top: ${y - 3}px; width: ${alto + 6}px; height: ${alto + 6}px; box-sizing: border-box; border: 3px solid ${color === ORO ? ORO : a(LUZ, 0.3)};"><img src="assets/campeones/${c}.png" alt="${c}" style="width: 100%; height: 100%; display: block;"></div>`
    : item ? `<div style="position: absolute; left: 60px; top: ${y - 3}px;">${icono(item, alto + 6, { borde: color === ORO ? ORO : BORDE })}</div>` : '';
  return `${ico}
      ${etiqueta ? `<div style="position: absolute; left: ${x}px; top: ${y - 44}px; font-size: 36px; line-height: 1; letter-spacing: 3px; color: ${a(LUZ, 0.8)}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${etiqueta}</div>` : ''}
      <div data-barra${k ? ` data-k="${k}"` : ''} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${alto}px; background: ${color}; border-radius: 0 6px 6px 0; transform-origin: 0 50%; display: flex; align-items: center; padding-left: 18px; box-sizing: border-box; font-size: ${Math.round(alto * 0.78)}px; line-height: 1; letter-spacing: 2px; color: ${tinta};"><span data-valor data-cuenta="${valor}">${num(valor)}</span></div>`;
};

// ── 18 · jl-dano · C ─── gráfica 1: el daño más alto de la partida ── (contador)
slides.push(lamina('jl-dano', 'Veintitrés mil de daño, que fue el más alto de la partida.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { pos: '50% 30%', brillo: 0.3 })}
      ${dato('MÁS DAÑO DE LA PARTIDA', { x: 60, y: 186, w: 900, tam: 56, tracking: 6, color: ORO, k: 'titulo' })}
      ${DANO.map(([c, v], i) => barra({ c, valor: v, max: DANO[0][1], color: i === 0 ? ORO : GRIS, tinta: i === 0 ? BG : LUZ, y: 266 + i * 92 })).join('')}`));

// ── 19 · jl-oro · C ─── gráfica 2: el oro más alto ── (barras a mano)
slides.push(lamina('jl-oro', 'Quince mil novecientos de oro, que también fue el más alto.', `
      ${respaldo('splash/Jhin_5-fondo.jpg', { pos: '50% 40%', brillo: 0.3 })}
      ${dato('MÁS ORO DE LA PARTIDA', { x: 60, y: 186, w: 900, tam: 56, tracking: 6, color: ORO, k: 'titulo' })}
      ${ORO_P.map(([c, v], i) => barra({ c, valor: v, max: ORO_P[0][1], color: i === 0 ? ORO : GRIS, tinta: i === 0 ? BG : LUZ, y: 284 + i * 112, alto: 80 })).join('')}`));

// ── 20 · jl-marcador · A ─── 35–17 en 26:32 ── (letras + contador)
slides.push(lamina('jl-marcador', 'Y ganamos en veintiséis minutos con treinta y cinco kills contra diecisiete.', `
      ${respaldo('splash/Jhin_5-fondo.jpg', { blur: 10, brillo: 0.5, pos: '30% 70%' })}
      ${arte('splash/Jhin_5.jpg', 'Jhin Oscuridad Cósmica, splash', { pos: '30% 70%', zoom: 1.25, filtro: 'brightness(.65)' })}
      ${veloIzq(0.85)}
      <div style="position: absolute; left: 56px; top: 210px; font-size: 270px; line-height: 1; letter-spacing: 6px; text-shadow: 0 10px 40px rgba(0,0,0,.85); white-space: nowrap;"><span data-k="nuestras" style="color: ${ORO}; display: inline-block; min-width: 1.04em;">35</span><span style="color: ${a(LUZ, 0.5)};">–</span><span data-k="suyas" style="color: ${ROJO}; display: inline-block; min-width: 1.04em;">17</span></div>
      ${dato('<span data-k="tiempo">26:32</span>', { x: 62, y: 500, w: 600, tam: 110, tracking: 10 })}`));

// ── 21 · jl-honesto · C ─── gráfica 3: daño por minuto ── (barras + pulso)
const HX = 160, HMAX = DPM.cronofox;
slides.push(lamina('jl-honesto', 'En daño por minuto esta partida no le gana a la build de Cronofox: ochocientos sesenta y siete contra novecientos trece.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { pos: '60% 25%', brillo: 0.44 })}
      ${dato('DAÑO POR MINUTO', { x: 60, y: 186, w: 900, tam: 52, tracking: 6, color: a(LUZ, 0.85), k: 'titulo' })}
      ${barra({ item: 'hexoptics', etiqueta: 'CRONOFOX (PROMEDIO)', valor: DPM.cronofox, max: HMAX, color: LUZ, y: 306, x: HX, ancho: 700, alto: 60, k: 'b-cronofox' })}
      ${barra({ c: 'Jhin', etiqueta: 'ESTA PARTIDA', valor: DPM.partida, max: HMAX, color: ORO, y: 430, x: HX, ancho: 700, alto: 60 })}
      ${barra({ item: 'hubris', etiqueta: 'HUBRIS (PROMEDIO)', valor: DPM.hubris, max: HMAX, color: GRIS, tinta: LUZ, y: 554, x: HX, ancho: 700, alto: 60 })}`));

// ── 22 · jl-nieve · B ─── Hubris a 2×: kills de 0 a 14 ── (contador + marco que crece)
slides.push(lamina('jl-nieve', 'La Hubris hizo bola de nieve: cada kill me hacía más fuerte.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { blur: 14, brillo: 0.42, pos: '70% 25%' })}
      <div style="position: absolute; left: 110px; top: 250px; width: 256px; height: 256px;">${icono('hubris', 256, { k: 'hubris', borde: ORO, estilo: `box-shadow: 0 0 44px ${a(ORO, 0.55)};` })}</div>
      ${dato('KILLS', { x: 500, y: 196, w: 460, tam: 70, tracking: 10, color: a(LUZ, 0.8), k: 'kills' })}
      ${dato('<span data-k="cuenta">14</span>', { x: 496, y: 260, w: 460, tam: 260, tracking: 4, color: ORO })}
      ${dato('CADA KILL = MÁS DAÑO', { x: 60, y: 560, w: 900, tam: 64, tracking: 5, alinear: 'center', k: 'frase' })}`));

// ── 23 · jl-leccion · D ─── contra tanques / contra cristal ── (rebanadas)
const mitadLeccion = (lado, items, titulo, color, pos) => {
  const izq = lado === 'izq', cx = izq ? 270 : 810;
  return mitad(lado, `
        <div data-k="reb-${lado}" style="position: absolute; left: ${izq ? 0 : Math.floor(540 - T6)}px; top: 0; width: ${Math.ceil(540 + T6)}px; height: ${PH}px; overflow: hidden;">
          <img src="assets/splash/Jhin_36.jpg" alt="Jhin Rey del Escenario, splash" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">
        </div>
        <div style="position: absolute; inset: 0; background: ${a(BG, 0.72)};"></div>
        ${dato(`<span style="white-space: nowrap;">${titulo}</span>`, { x: izq ? 50 : 585, y: 220, w: izq ? 440 : 410, tam: 62, tracking: 3, alinear: 'center', color, k: `tit-${lado}` })}
        <div data-k="ico-${lado}" style="position: absolute; left: ${cx - 160}px; top: 340px; display: flex; gap: 20px;">${items.map((it) => icono(it, 150, { borde: color === ORO ? ORO : '#C8AA6E' })).join('')}</div>`);
};
slides.push(lamina('jl-leccion', 'La build no se casa contigo: contra tanques, la de Cronofox; contra cristal, Hubris y Collector.', `
      ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 16, brillo: 0.3 })}
      ${mitadLeccion('izq', ['hexoptics', 'stormrazor'], 'CONTRA TANQUES', LUZ, '30% 40%')}
      ${mitadLeccion('der', ['hubris', 'collector'], 'CONTRA CRISTAL', ORO, '80% 30%')}
      ${costura}`));

// ── 24 · jl-cierre · A ─── ¿qué hubieras comprado? y los cinco enemigos ── (palabra + chispas)
slides.push(lamina('jl-cierre', 'Díganme qué hubieran comprado ustedes contra este draft.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 12, brillo: 0.5, pos: '60% 30%' })}
      ${arte('splash/Jhin_14.jpg', 'Jhin Alta Costura, splash', { pos: '62% 22%', zoom: 1.15, filtro: 'brightness(.7)' })}
      ${veloIzq(0.85)}
      <div data-k="chispas" style="position: absolute; left: 0; top: 200px; width: 800px; height: 320px;"></div>
      ${dato('<span data-k="pregunta" style="display: inline-block;">¿QUÉ HUBIERAS<br>COMPRADO?</span>', { x: 60, y: 196, w: 900, tam: 150, lh: 0.95, tracking: 6, color: ORO })}
      <div data-k="enemigos" style="position: absolute; left: 60px; top: 530px; display: flex; gap: 16px;">
        ${ENEMIGOS.map((e) => retrato(e.c, { tam: 84 })).join('')}
      </div>`));

// ── reposo · A ─── Jhin base desenfocado al 45 % ──
slides.push(lamina('jl-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { blur: 16, brillo: 0.58, pos: '58% 30%' })}
      ${dato(`JHIN · <span style="color: ${ORO};">LETALIDAD</span>`, { x: 60, y: 190, w: 500, tam: 48, tracking: 6, color: a(LUZ, 0.85) })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  // El ícono «cae con golpe»: la curva golpe del kit (la receta golpe es para texto). De jhin-build.
  var cae = function (tl, el, en) { if (el) tl.from(el, { y: -70, scale: 1.25, opacity: 0, duration: 0.5, ease: 'golpe' }, en); };
  // «pulso» no existe en el kit: latido de escala con la curva golpe y un brillo. De jhin-build.
  var pulso = function (tl, el, en, color) { if (!el) return; tl.to(el, { scale: 1.12, filter: 'drop-shadow(0 0 18px ' + (color || '${ORO}') + ')', duration: 0.22, ease: 'golpe', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, en); };
  var traza = function (tl, el, en, d) { if (el) tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 0.4, ease: 'entrada', immediateRender: true }, en); };
  // tarjeta-item, igual que en jhin-build.
  var tarjeta = function (tl, s, cifra) {
    efecto('cortinilla', tl, k(s, 'tarjeta'), { forma: 'persiana', direccion: 'abajo', dur: 0.7, en: 0.05 });
    cae(tl, k(s, 'icono'), 0.25);
    q(s, '[data-stat]').forEach(function (el, i) { efecto('maquina', tl, el, { en: 0.75 + i * 0.3, ritmo: 0.02, cursor: 'no' }); });
    aparece(tl, k(s, 'pasiva'), 1.45, 0.4);
    if (cifra) {
      tl.fromTo(k(s, 'cifra'), { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 1.2);
      efecto('contador', tl, k(s, 'cifra'), Object.assign({ en: 1.25, dur: 1.15 }, cifra));
    }
  };
  // Barras: crecen desde 0 con la curva entrada (regla de las gráficas).
  var barras = function (tl, s, en, esc) { tl.from(q(s, '[data-barra]'), { scaleX: 0, duration: 1.1, ease: 'entrada', stagger: esc == null ? 0.15 : esc }, en); };
  var C = {
    'jl-portada': function (tl, s) {
      aparece(tl, k(s, 'opgg'), 0.05, 0.35);
      tl.from(q(s, '[data-ranura]'), { opacity: 0, duration: 0.3, stagger: 0.04 }, 0);
      q(s, '[data-item]').forEach(function (el, i) { cae(tl, el, 0.35 + i * 0.35); });
      q(s, '[data-nombre-item]').forEach(function (el, i) { aparece(tl, el, 0.65 + i * 0.35, 0.35); });
      efecto('sello', tl, k(s, 'marcador'), { en: 1.4, fuerza: 10 });
    },
    'jl-tragar': function (tl, s) {
      efecto('revuelto', tl, k(s, 'viejo'), { en: 0.05, dur: 0.7, glifos: '25–' });
      traza(tl, k(s, 'tachon'), 0.8, 0.4);
      tl.to(k(s, 'viejo'), { opacity: 0.55, duration: 0.4 }, 0.9);
      tl.fromTo(k(s, 'nuevo'), { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 1.05);
      efecto('tragamonedas', tl, k(s, 'nuevo'), { en: 1.1, dur: 1.3 });
    },
    'jl-draft': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      // data-paso: una ranura por campeón, en el orden del guion (Vayne, Brand, Yuumi, Katarina, Jax).
      efecto('bento', tl, k(s, 'draft'), { desde: 'start', escalon: 0.32, dur: 0.5, en: 0.2 });
      // Los roles troll (Vayne JUNGLA, Brand ADC) laten en rojo justo después de entrar su ranura.
      q(s, '[data-rol][data-troll]').forEach(function (el, i) { pulso(tl, el, 0.8 + i * 0.32, '${ROJO}'); });
    },
    'jl-papel': function (tl, s) {
      var marcos = q(k(s, 'papel'), '[data-retrato]');
      marcos.slice(0, 4).forEach(function (m, i) { tl.to(m.querySelector('[data-marco]'), { filter: 'brightness(.4) grayscale(.3)', duration: 0.35, ease: 'entrada' }, 0.3 + i * 0.28); });
      efecto('dibujo', tl, k(s, 'grietas'), { en: 0.25, dur: 1.3, escalon: 0.14 });
      tl.to(k(s, 'jax').querySelector('[data-marco]'), { scale: 1.12, borderColor: '${ORO}', boxShadow: '0 0 34px ${a(ORO, 0.6)}', duration: 0.6, ease: 'asentar', transformOrigin: '50% 50%' }, 1.5);
      aparece(tl, k(s, 'frase'), 1.7, 0.5);
    },
    'jl-vayne': function (tl, s) {
      aparece(tl, k(s, 'ficha'), 0.05, 0.45);
      efecto('sello', tl, k(s, 'kda'), { en: 0.55, fuerza: 12 });
      tl.fromTo(k(s, 'dano').parentNode, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: true }, 1.15);
      efecto('contador', tl, k(s, 'dano'), { en: 1.2, dur: 1.2, cuenta: 4764, separador: '.' });
    },
    'jl-ultimo': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      q(s, '[data-fila]').forEach(function (el, i) {
        var t = 0.15 + i * 0.15;
        tl.from(el, { opacity: 0, x: -16, duration: 0.25, ease: 'entrada' }, t);
        efecto('maquina', tl, el.querySelector('[data-puntos]'), { en: t + 0.05, ritmo: 0.04, cursor: 'no' });
      });
      pulso(tl, k(s, 'ultima'), 1.85, '${ROJO}');
    },
    'jl-brand': function (tl, s) {
      // El iris del paquete, a mano sobre el arte (el del kit recorta la sección entera).
      tl.fromTo(k(s, 'arte'), { clipPath: 'circle(0% at 60% 45%)' }, { clipPath: 'circle(120% at 60% 45%)', duration: 1.2, ease: 'power3.inOut', immediateRender: true }, 0.05);
      aparece(tl, k(s, 'ficha'), 0.35, 0.45); aparece(tl, k(s, 'kda'), 0.7, 0.45);
      aparece(tl, k(s, 'linea-muertes'), 1.1, 0.4);
      efecto('contador', tl, k(s, 'muertes'), { en: 1.15, dur: 1.0, cuenta: 8 });
    },
    'jl-yuumi': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.25, origen: '55% 35%', dur: 2.6 });
      aparece(tl, k(s, 'ficha'), 0.2, 0.45);
      efecto('palabra', tl, k(s, 'kda'), { en: 0.9 });
    },
    'jl-cristal': function (tl, s) {
      // La cortina del paquete: cada mitad entra desde su lado (a mano, como en jhin-build).
      tl.from(k(s, 'izq'), { x: -560, duration: 0.8, ease: 'power3.out' }, 0.05);
      traza(tl, k(s, 'tachon'), 0.85, 0.4);
      tl.from(k(s, 'der'), { x: 560, duration: 0.8, ease: 'power3.out' }, 0.9);
      efecto('destello', tl, k(s, 'destello'), { en: 1.4, dur: 1.2, semilla: 'letalidad' });
    },
    'jl-cosecha': function (tl, s) {
      cae(tl, k(s, 'runa'), 0.1);
      aparece(tl, k(s, 'nombre').parentNode, 0.45, 0.4);
      efecto('brillo', tl, k(s, 'nombre'), { en: 0.9, dur: 1.2, color: '#FFF3C4' });
      aparece(tl, k(s, 'efecto'), 1.1, 0.45);
    },
    'jl-runas': function (tl, s) {
      // data-paso: de gris a color en el orden de la voz (Recuerdos Macabros con Cazador de Tesoros).
      q(s, '[data-runa]').forEach(function (el) {
        var p = +el.getAttribute('data-paso');
        tl.fromTo(el, { filter: 'grayscale(1) brightness(.45)' }, { filter: 'grayscale(0) brightness(1)', duration: 0.4, ease: 'entrada', immediateRender: true }, 0.15 + (p - 1) * 0.45);
      });
    },
    'jl-almas': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0.05, 0.4);
      efecto('dibujo', tl, k(s, 'anillo'), { en: 0.3, dur: 1.0, escalon: 0.08 });
      pulso(tl, k(s, 'runa'), 1.95);
    },
    'jl-hubris': function (tl, s) {
      tarjeta(tl, s, null);
      efecto('golpe', tl, k(s, 'minuto'), { en: 1.0, escalon: 0.25 });
      aparece(tl, k(s, 'etq'), 1.6, 0.4);
    },
    'jl-orden': function (tl, s) {
      efecto('bento', tl, k(s, 'fila-marcos'), { desde: 'start', escalon: 0.05, dur: 0.45 });
      var it = q(s, '[data-item]');
      aparece(tl, it[0], 0.2, 0.3);
      cae(tl, it[1], 0.75);
      q(s, '[data-minuto]').forEach(function (el, i) { aparece(tl, el, i ? 1.05 : 0.3, 0.35); });
      q(s, '[data-nombre-item]').forEach(function (el, i) { aparece(tl, el, i ? 1.15 : 0.35, 0.35); });
    },
    'jl-collector': function (tl, s) {
      tarjeta(tl, s, { cuenta: 5, sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'ejecuta'), 1.05); aparece(tl, k(s, 'vida'), 1.6);
    },
    'jl-build': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.35);
      // Las tres primeras ya están; IE y Stormrazor caen en el orden de la voz (data-paso).
      var it = q(s, '[data-item]'), mins = q(s, '[data-minuto]'), noms = q(s, '[data-nombre-item]');
      [3, 4].forEach(function (i, j) { cae(tl, it[i], 0.5 + j * 0.55); aparece(tl, mins[i], 0.75 + j * 0.55, 0.3); aparece(tl, noms[i], 0.8 + j * 0.55, 0.3); });
      efecto('destello', tl, k(s, 'destello'), { en: 1.65, dur: 1.0, semilla: 'build-final' });
    },
    'jl-resultado': function (tl, s) {
      efecto('tragamonedas', tl, k(s, 'kda'), { en: 0.2, dur: 1.5 });
      aparece(tl, k(s, 'victoria'), 1.2, 0.5);
    },
    'jl-dano': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      barras(tl, s, 0.25);
      q(s, '[data-valor]').forEach(function (el, i) { efecto('contador', tl, el, { en: 0.25 + i * 0.15, dur: 1.1, cuenta: +el.getAttribute('data-cuenta'), separador: '.' }); });
    },
    'jl-oro': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      barras(tl, s, 0.25, 0.2);
      tl.from(q(s, '[data-valor]'), { opacity: 0, x: -10, duration: 0.35, stagger: 0.2, ease: 'entrada' }, 1.0);
    },
    'jl-marcador': function (tl, s) {
      efecto('contador', tl, k(s, 'nuestras'), { en: 0.15, dur: 1.3, cuenta: 35 });
      efecto('contador', tl, k(s, 'suyas'), { en: 0.3, dur: 1.1, cuenta: 17 });
      efecto('letras', tl, k(s, 'tiempo'), { en: 1.0, dur: 0.6 });
    },
    'jl-honesto': function (tl, s) {
      aparece(tl, k(s, 'titulo'), 0, 0.4);
      barras(tl, s, 0.25, 0.2);
      tl.from(q(s, '[data-valor]'), { opacity: 0, duration: 0.3, stagger: 0.2 }, 0.9);
      tl.to(k(s, 'b-cronofox'), { scaleY: 1.18, filter: 'drop-shadow(0 0 16px rgba(243,239,226,.7))', duration: 0.22, ease: 'golpe', yoyo: true, repeat: 1 }, 1.85);
    },
    'jl-nieve': function (tl, s) {
      aparece(tl, k(s, 'kills'), 0.05, 0.35);
      efecto('contador', tl, k(s, 'cuenta'), { en: 0.3, dur: 1.7, cuenta: 14, ease: 'none' });
      // Con cada kill el marco crece un poco: escala de 1 a 1,25 en 14 escalones.
      tl.fromTo(k(s, 'hubris'), { scale: 1 }, { scale: 1.25, duration: 1.7, ease: 'steps(14)', transformOrigin: '50% 50%', immediateRender: true }, 0.3);
      aparece(tl, k(s, 'frase'), 1.8, 0.45);
    },
    'jl-leccion': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-izq'), { n: 5, en: 0.05, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-der'), { n: 5, en: 0.3, dur: 0.8 });
      aparece(tl, k(s, 'tit-izq'), 0.8); aparece(tl, k(s, 'tit-der'), 1.0);
      tl.from(k(s, 'ico-izq').children, { opacity: 0, y: 20, duration: 0.4, stagger: 0.12, ease: 'entrada' }, 1.0);
      tl.from(k(s, 'ico-der').children, { opacity: 0, y: 20, duration: 0.4, stagger: 0.12, ease: 'entrada' }, 1.25);
    },
    'jl-cierre': function (tl, s) {
      efecto('palabra', tl, k(s, 'pregunta'), { en: 0.3 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 0.35, dur: 1.4, color: '${ORO},#FFF1C2,#FFFFFF', origen: '30 50', semilla: 'gg-letalidad' });
      tl.from(k(s, 'enemigos').children, { opacity: 0, y: 18, duration: 0.35, stagger: 0.1, ease: 'entrada' }, 1.0);
    },
    'jl-reposo': function () {},
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
<title>La build que dije que no servía</title>
${kit.og({ titulo: 'La build que dije que no servía', descripcion: 'Jhin con letalidad (Hubris y The Collector) contra Vayne jungla, Brand ADC y Yuumi, en banda superior: el draft, las runas, la build y los números de la partida. Solo arte oficial y sin nombres de jugador.', carpeta: 'creator/jhin-letalidad' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(LUZ, 0.4)}; border-radius: 999px;
    background: rgba(13,10,11,0.85); color: ${LUZ}; cursor: pointer;
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
