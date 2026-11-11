// Generador de index.html — «La build rara de Jhin» (canal Axelsine, miércoles 11/11/2026)
// Ejecutar: node creator/jhin-build/gen.js   ·   clips: node tools/laminas.mjs creator/jhin-build --banda=arriba
//
// Sigue al pie de la letra el paquete `2026-11-11_build-jhin-cronofox--paquete.md` (PKB de Axl):
//   · **Primer video del canal con la BANDA ARRIBA**: formato 4 del CLAUDE.md (banda opaca de
//     1080×680, mp4 sin alfa) con <deck-stage data-recorte="1080:680:0:1240" data-banda="arriba">,
//     kit.banda() y el riel con data-riel; laminas.mjs --banda=arriba lo deja en video-out/laminas-arriba/.
//   · **Zona segura de la banda arriba**: nada de texto ni cifras en los primeros 180 px (las
//     pestañas de TikTok); el texto clave va de y 180 a 640, entre x 60 y 960. El arte sí va a sangre.
//   · **Cada item que nombra la voz se ve con su ícono oficial y su nombre en inglés**, con el
//     componente `tarjeta-item` (el tooltip del juego: panel #010A13, borde #785A28, ícono a 128 px,
//     costo con el ícono de oro, estadísticas cortas en español y la pasiva resaltada). Si existe
//     assets/capturas/<item>.png se usa la captura en vez de la tarjeta (constante CAPTURAS).
//   · Solo arte oficial (Data Dragon y CommunityDragon) y el glifo oficial de Twitch; lo dibujado es
//     dato (gráficas, el aro de alcance, las ranuras de inventario, el tachón y la flecha).
//   · Ninguna lámina arranca en negro (cada una lleva debajo una copia desenfocada y opaca de su arte)
//     ni tarda más de 2,8 s en entrar. Groserías y chistes solo en la voz.
//   · ⚠️ La Hexoptics NO sube el daño de la ulti: jb-critico va de crítico → daño de ataque → ulti, y
//     jb-distancia es estilo de juego. Ninguna lámina dice otra cosa.
//
// ⚠️ Recetas que el paquete pide y se cambiaron (decisiones anotadas aquí, como pide la sección 4):
//   · `pulso` no existe en el kit: en jb-stormrazor y jb-nadie es un latido de escala con la curva
//     `golpe` (ida y vuelta) más un brillo dorado; es lo más parecido.
//   · El `golpe` del kit parte texto palabra por palabra: los ÍCONOS «caen con golpe» con la curva
//     `golpe` del kit (ease: 'golpe'), no con la receta. Para texto (+28 %) sí es la receta.
//   · El `brillo` del kit es un barrido sobre texto: en jb-runas lo hacen las palabras PIES VELOCES y
//     BRUJERÍA, y los íconos laten con un resplandor.
//   · `palabra` saldría 3 veces (ratero, esmeralda, cierre) y el paquete pone 2 como máximo: en
//     jb-esmeralda el texto entra con `letras`.
//   · `crece` del kit (el FLIP de una celda) va en jb-esmeralda; el aro de jb-alcance y las barras de
//     jb-numeros crecen a mano con la curva `entrada` (regla de las gráficas), como en senna.
//   · `cortina` (jb-runas) y `iris` (jb-ulti) a mano con el mismo movimiento: las del kit recortan la
//     <section> y la banda quedaría vacía en el cuadro 0 (lo mismo que en senna).
// ⚠️ `inventario.png` (la build real de la partida del 02/11: LDR, Hexoptics, Stormrazor, IE, Guardian
//    Angel y Gluttonous Greaves) no es la captura de un solo item, así que no reemplaza ninguna tarjeta:
//    va en jb-numeros, que es donde la voz habla de «esta build».
// ⚠️ jb-quinto lleva los nombres completos (TITANIC HYDRA · GUARDIAN ANGEL) y no HYDRA · GA: la regla
//    principal del paquete pide el nombre en inglés de cada item que nombra la voz.
// ⚠️ El ícono de Brujería solo existe a 32 px (Data Dragon y CommunityDragon): va ampliado con Lanczos.
// Sin dinero en pantalla salvo el costo en oro dentro de tarjeta-item. Las gráficas no llevan fuente.
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

// ⚠️ Por confirmar con Axl antes de exportar jb-cronofox (sección 7 del paquete): cómo se escribe su canal.
const CRONOFOX = 'CRONOFOX';

// ── Paleta (sección 1.5) ─────────────────────────────────────────────────
const BG = '#0D0A0B';
const ORO = '#E0B354';     // la build nueva
const LUZ = '#F3EFE2';     // cifras y texto
const ROJO = '#D2443C';    // solo lo malo: 2–5 con Hubris y 7–8 de las botas
const GRIS = '#5B6461';    // comparación y build vieja
const TIP = '#010A13';     // tarjeta-item
const BORDE = '#785A28';   // tarjeta-item y ranuras del HUD
const TWITCH = '#9146FF';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 680, PANEL_TOP = 1240;
const RECORTE = `${PW}:${PH}:0:${PANEL_TOP}`;

// ── Items (sección 5; Data Dragon 16.22.1, nombres en inglés, estadísticas en es_MX) ──
const ITEMS = {
  hexoptics: { id: 2523, nombre: 'HEXOPTICS C44', costo: 2800, stats: ['+55 DAÑO DE ATAQUE', '25 % CRÍTICO'],
    pasiva: { nombre: 'MAGNIFICACIÓN', texto: 'HASTA <b>+10 %</b> DE DAÑO SEGÚN LA DISTANCIA' } },
  stormrazor: { id: 3095, nombre: 'STORMRAZOR', costo: 3200, stats: ['+50 DAÑO DE ATAQUE', '25 % VELOCIDAD DE ATAQUE', '25 % CRÍTICO'],
    pasiva: { nombre: 'ENERGIZADO', texto: 'EL ATAQUE CARGADO DA <b>+45 %</b> DE VELOCIDAD POR 1,5 S' } },
  gluttonous: { id: 3008, nombre: 'GLUTTONOUS GREAVES', costo: 1100, stats: ['+45 VELOCIDAD DE MOVIMIENTO', '4 % OMNIVAMPIRISMO'],
    pasiva: { nombre: 'EXTERMINAR', texto: '<b>4 %</b> OMNIVAMPIRISMO <span style="white-space: nowrap;">(HASTA <b>10 %</b>)</span>' } },
  swiftness: { id: 3009, nombre: 'BOOTS OF SWIFTNESS' },
  ie: { id: 3031, nombre: 'INFINITY EDGE', costo: 3500, stats: ['+75 DAÑO DE ATAQUE', '25 % CRÍTICO'],
    pasiva: { nombre: '', texto: '<b>+30 %</b> DAÑO CRÍTICO' } },
  ldr: { id: 3036, nombre: 'LORD DOMINIK\'S REGARDS', costo: 3300, stats: ['+35 DAÑO DE ATAQUE', '25 % CRÍTICO'],
    pasiva: { nombre: '', texto: '<b>35 %</b> PENETRACIÓN DE ARMADURA' } },
  hydra: { id: 3748, nombre: 'TITANIC HYDRA' },
  ga: { id: 3026, nombre: 'GUARDIAN ANGEL' },
  hubris: { id: 6697, nombre: 'HUBRIS' },
  collector: { id: 6676, nombre: 'THE COLLECTOR' },
};
// Capturas reales que reemplazan a la tarjeta si existen (sección 6 del paquete).
const CAPTURAS = { hexoptics: 'hexoptics', stormrazor: 'stormrazor', gluttonous: 'gluttonous', ie: 'ie', ldr: 'ldr', hydra: 'hydra' };
const captura = (clave) => {
  const n = CAPTURAS[clave];
  return n && fs.existsSync(path.join(__dirname, 'assets', 'capturas', `${n}.png`)) ? `capturas/${n}.png` : null;
};

// Datos (sección 5)
const DATOS = { partidas: 355, gano: 178, perdio: 177, hubris: '2–5', build: { v: 17, d: 12, pct: 59 }, temporada: 50,
  glotonas: '7–8', dano: { hubris: 23790, build: 30528, pct: 28 }, alcance: [550, 650] };

// ── El riel: idéntico en todas las láminas (kit.banda() lo invierte con la banda arriba) ──
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

// ── Piezas ───────────────────────────────────────────────────────────────
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

/** Layout B: tarjeta-item (o su captura real) en x 60, y 180, 520×460. */
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

/** Layout E: seis ranuras de inventario en fila, con el marco del HUD. */
const ranuras = (llenas, { tam = 120, sep = 24, y = 240, x0 = null, k = 'fila', etiquetas = true, numeros = false, apagar = [], destacar = -1 } = {}) => {
  const ancho = 6 * tam + 5 * sep, xi = x0 == null ? (PW - ancho) / 2 : x0, marcos = [];
  const celdas = [0, 1, 2, 3, 4, 5].map((i) => {
    const clave = llenas[i], x = xi + i * (tam + sep), it = clave && ITEMS[clave];
    const marco = `position: absolute; left: ${x}px; top: ${y}px; width: ${tam}px; height: ${tam}px; box-sizing: border-box; border: 3px solid ${i === destacar ? ORO : BORDE}; background: ${a(TIP, 0.82)};`;
    const vacia = `<div data-ranura style="${marco} box-shadow: inset 0 0 22px rgba(0,0,0,.8);"></div>`;
    marcos.push(vacia);
    if (!it) return '';
    const nombre = etiquetas ? `<div data-nombre-item style="position: absolute; left: ${x - 40}px; top: ${y + tam + 10}px; width: ${tam + 80}px; text-align: center; font-size: 34px; line-height: 1; letter-spacing: 1px; color: ${a(LUZ, 0.92)}; text-shadow: 0 4px 18px rgba(0,0,0,.9);">${it.nombre.replace(' C44', '<br>C44').replace('THE ', 'THE<br>')}</div>` : '';
    const num = numeros ? `<div data-num style="position: absolute; left: ${x + tam - 30}px; top: ${y + tam - 40}px; width: 46px; height: 46px; border-radius: 50%; background: ${ORO}; color: ${BG}; font-size: 36px; line-height: 50px; text-align: center; z-index: 2;">${i + 1}</div>` : '';
    return `<div data-item="${clave}" style="${marco} border-color: ${i === destacar ? ORO : '#C8AA6E'}; ${apagar.includes(i) ? 'filter: grayscale(1) brightness(.6);' : ''} box-shadow: ${i === destacar ? `0 0 34px ${a(ORO, 0.7)}` : '0 10px 26px rgba(0,0,0,.6)'};"><img src="assets/items/${it.id}.png" alt="${it.nombre}" style="width: 100%; height: 100%; display: block;"></div>${num}${nombre}`;
  }).join('');
  return `<div data-k="${k}" style="position: absolute; inset: 0;"><div data-k="${k}-marcos" style="position: absolute; inset: 0;">${marcos.join('')}</div>${celdas}</div>`;
};

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">
      <div data-contenido style="position: absolute; inset: 0; overflow: hidden;">${contenido}
      </div>${RIEL}
    </div>`;
const lamina = (id, notas, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}"${extra} style="${SECCION}">${GUIA}${panel(cuerpo)}
  </section>`;
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const slides = [];

// ── 1 · jb-portada · A ─── Oscuridad Cósmica en tres capas y el 50 → 59 ──
slides.push(lamina('jb-portada', 'Le copié la build a Cronofox y mi Jhin pasó de 50 a 59 % de winrate.', `
      <div data-k="capas" style="position: absolute; inset: 0;">
        <div data-capa="0.4" style="position: absolute; inset: 0;">${respaldo('splash/Jhin_5-fondo.jpg', { blur: 14, brillo: 0.55 })}</div>
        <div data-capa="1" style="position: absolute; left: 380px; top: 0; width: 700px; height: ${PH}px; -webkit-mask-image: radial-gradient(62% 80% at 55% 40%, #000 52%, transparent 100%); mask-image: radial-gradient(62% 80% at 55% 40%, #000 52%, transparent 100%);">
          <img src="assets/splash/Jhin_5-centrada.jpg" alt="Jhin Oscuridad Cósmica" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 28%; display: block;">
        </div>
        ${veloIzq(0.8)}
        <div data-capa="1.8" style="position: absolute; inset: 0;">
          <div style="position: absolute; left: 60px; top: 252px; display: flex; align-items: baseline; gap: 26px; white-space: nowrap; text-shadow: 0 8px 34px rgba(0,0,0,.85);">
            <span style="font-size: 130px; line-height: 1; letter-spacing: 2px; color: ${a(LUZ, 0.62)};">50&nbsp;%</span>
            <span style="font-size: 110px; line-height: 1; color: ${ORO};">→</span>
            <span style="font-size: 300px; line-height: .86; letter-spacing: 2px; color: ${ORO};">5<span data-k="nueve" style="display: inline-block;">9</span>&nbsp;%</span>
          </div>
        </div>
      </div>`));

// ── 2 · jb-temporada · C ─── gráfica 1: la dona partida a la mitad ──
slides.push(lamina('jb-temporada', 'Llevo 355 partidas con Jhin esta temporada y estaba en 50 % clavado.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { pos: '55% 30%', brillo: 0.4 })}
      <div data-k="dona" style="position: absolute; left: 120px; top: 196px;">
        ${kit.dona([{ valor: DATOS.gano, color: ORO }, { valor: DATOS.perdio, color: GRIS }], { tam: 430, grosor: 62, fondo: 'rgba(243,239,226,.07)', centro: { texto: String(DATOS.partidas), cuenta: DATOS.partidas, sufijo: '', color: LUZ, tam: 150 } })}
      </div>
      ${dato('PARTIDAS', { x: 600, y: 230, w: 360, tam: 100, tracking: 4, k: 'partidas' })}
      ${dato(`<span style="color: ${ORO};">${DATOS.gano}</span> <span style="color: ${a(LUZ, 0.5)};">–</span> <span style="color: ${a(LUZ, 0.65)};">${DATOS.perdio}</span>`, { x: 600, y: 370, w: 360, tam: 110, tracking: 3, k: 'marcador' })}
      ${dato(`${DATOS.temporada}&nbsp;%`, { x: 600, y: 500, w: 360, tam: 80, tracking: 3, color: a(LUZ, 0.75), k: 'pct' })}`));

// ── 3 · jb-hubris · E ─── la build de op.gg: Hubris y The Collector, 2–5 ──
slides.push(lamina('jb-hubris', 'Con la build de Hubris y The Collector que te recomienda op.gg iba dos y cinco.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { pos: '55% 30%', brillo: 0.42 })}
      ${dato('OP.GG', { x: 120, y: 186, w: 400, tam: 40, tracking: 8, color: a(LUZ, 0.6), k: 'opgg' })}
      ${ranuras(['hubris', 'collector'], { y: 240, x0: 120 })}
      <div data-k="sello-caja" style="position: absolute; left: 520px; top: 400px; width: 440px; height: 220px;">
        <div data-k="marcador" style="position: absolute; inset: 0; text-align: center; font-size: 210px; line-height: .95; letter-spacing: 4px; color: ${ROJO}; text-shadow: 0 10px 40px rgba(0,0,0,.85);">${DATOS.hubris}</div>
      </div>`));

// ── 4 · jb-cronofox · F ─── el letrero con el Forajido y el glifo de Twitch ──
const glifoTwitch = `<svg viewBox="0 0 24 24" style="display: inline-block; width: .62em; height: .62em; margin-left: .22em; vertical-align: .08em;" aria-label="Twitch"><path fill="${TWITCH}" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`;
slides.push(lamina('jb-cronofox', 'Un compa me pasó a Cronofox, un OTP de Jhin que stremea en Twitch.', `
      ${respaldo('carga/Jhin_1-fondo.jpg', { blur: 16, brillo: 0.32, pos: '50% 25%' })}
      ${arte('carga/Jhin_1.jpg', 'Jhin el Forajido, pantalla de carga', { x: 700, y: 0, w: 380, h: PH, pos: '50% 20%', filtro: 'brightness(.55)', estilo: '-webkit-mask-image: linear-gradient(90deg, transparent, #000 40%); mask-image: linear-gradient(90deg, transparent, #000 40%);' })}
      <div data-k="letrero" style="position: absolute; left: 60px; top: 250px;">
        ${kit.letrero({ nombre: `${CRONOFOX}${glifoTwitch}`, campeon: 'OTP DE JHIN', retrato: 'assets/carga/Jhin_1.jpg', color: ORO, tinta: LUZ, tam: 120, fuente: DISPLAY })}
      </div>`));

// ── 5 · jb-runas · D ─── Pies veloces y Brujería ──
slides.push(lamina('jb-runas', 'Arrancas con Pies veloces y Brujería.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 16, brillo: 0.3 })}
      ${mitad('izq', `
        ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 12, brillo: 0.4, pos: '30% 40%' })}
        <img data-k="runa-izq" src="assets/runas/FleetFootwork.png" alt="Sobre la Marcha (Fleet Footwork)" style="position: absolute; left: ${270 - 120}px; top: 196px; width: 240px; height: 240px;">
        ${dato('<span data-k="txt-izq">PIES VELOCES</span>', { x: 60, y: 470, w: 420, tam: 86, tracking: 4, alinear: 'center', color: ORO })}`)}
      ${mitad('der', `
        ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 12, brillo: 0.4, pos: '75% 30%' })}
        <img data-k="runa-der" src="assets/runas/Sorcery.png" alt="Brujería (Sorcery)" style="position: absolute; left: ${810 - 84}px; top: 196px; width: 168px; height: 240px; object-fit: contain;">
        ${dato('<span data-k="txt-der">BRUJERÍA</span>', { x: 600, y: 470, w: 420, tam: 86, tracking: 4, alinear: 'center' })}`)}
      ${costura}`));

// ── 6 · jb-orden · E ─── las seis ranuras y los dos primeros items ──
slides.push(lamina('jb-orden', 'El primer item es Hexoptics C44, luego Stormrazor.', `
      ${respaldo('splash/Jhin_4-fondo.jpg', { pos: '60% 30%', brillo: 0.3 })}
      ${ranuras(['hexoptics', 'stormrazor'], { y: 230, numeros: true })}`));

// ── 7 · jb-botas · D ─── Boots of Swiftness tachadas, Gluttonous Greaves en dorado ──
slides.push(lamina('jb-botas', 'En lugar de las Boots of Swiftness te vas por las Gluttonous Greaves.', `
      ${mitad('izq', `
        ${respaldo('splash/Jhin_4-fondo.jpg', { blur: 12, brillo: 0.32, pos: '25% 50%' })}
        ${icono('swiftness', 160, { k: 'ico-izq', x: 190, y: 196, estilo: 'filter: grayscale(.85) brightness(.7);' })}
        <div style="position: absolute; left: 60px; top: 400px; width: 420px; text-align: center; font-size: 66px; line-height: 1; letter-spacing: 2px; color: ${a(LUZ, 0.7)}; text-shadow: 0 6px 24px rgba(0,0,0,.85);">BOOTS OF<br><span style="position: relative; display: inline-block;"><span data-k="swift">SWIFTNESS</span><svg viewBox="0 0 300 60" preserveAspectRatio="none" style="position: absolute; left: -10px; top: 6px; width: calc(100% + 20px); height: 100%; overflow: visible;"><path data-k="tachon" d="M2 36 C 80 26, 200 40, 298 22" fill="none" stroke="${ROJO}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg></span></div>`)}
      ${mitad('der', `
        ${respaldo('splash/Jhin_1-fondo.jpg'.replace('splash/', 'carga/'), { blur: 12, brillo: 0.36, pos: '50% 30%' })}
        ${icono('gluttonous', 160, { k: 'ico-der', x: 730, y: 196, borde: ORO, estilo: `box-shadow: 0 0 40px ${a(ORO, 0.55)};` })}
        ${dato('GLUTTONOUS<br>GREAVES', { x: 600, y: 400, w: 360, tam: 66, tracking: 2, alinear: 'center', color: ORO, k: 'nom-der' })}`)}
      ${costura}`));

// ── 8 · jb-hexoptics · B ─── tarjeta y gráfica 2 (la distancia) ──
const G2 = { x0: 640, x1: 900, xFin: 950, y0: 540, y1: 290 };
slides.push(lamina('jb-hexoptics', 'La Hexoptics te da más daño entre más lejos estés del enemigo.', `
      ${respaldo('splash/Jhin_4-fondo.jpg', { blur: 18, brillo: 0.35, pos: '60% 25%' })}
      ${tarjeta('hexoptics')}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <line x1="${G2.x0}" y1="${G2.y0}" x2="${G2.xFin}" y2="${G2.y0}" stroke="${a(LUZ, 0.3)}" stroke-width="2"/>
        <g data-k="trazo"><path d="M${G2.x0} ${G2.y0} L${G2.x1} ${G2.y1} L${G2.xFin} ${G2.y1}" fill="none" stroke="${ORO}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/></g>
        <text x="${G2.x0}" y="${G2.y0 + 42}" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="36" fill="${a(LUZ, 0.75)}">0</text>
        <text x="${G2.x1}" y="${G2.y0 + 42}" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="36" fill="${a(LUZ, 0.75)}">500</text>
        <text x="${(G2.x0 + G2.x1) / 2}" y="${G2.y0 + 86}" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="34" letter-spacing="3" fill="${a(LUZ, 0.6)}">DISTANCIA</text>
      </svg>
      ${dato('<span data-k="cifra">+10&nbsp;%</span>', { x: 640, y: 204, w: 320, tam: 96, color: ORO, alinear: 'right', tracking: 2 })}`));

// ── 9 · jb-alcance · C ─── el aro de 550 que se abre a 650 ──
const ARO = { cx: 320, cy: 412, r0: 180, r1: Math.round((180 * DATOS.alcance[1]) / DATOS.alcance[0]) };
slides.push(lamina('jb-alcance', 'Cuando consigues una kill te da cien de alcance extra por ocho segundos.', `
      ${respaldo('splash/Jhin_4-fondo.jpg', { pos: '20% 70%', brillo: 0.3 })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <circle cx="${ARO.cx}" cy="${ARO.cy}" r="${ARO.r0}" fill="none" stroke="${a(LUZ, 0.45)}" stroke-width="4" stroke-dasharray="14 12"/>
        <circle data-k="aro" cx="${ARO.cx}" cy="${ARO.cy}" r="${ARO.r1}" fill="${a(ORO, 0.08)}" stroke="${ORO}" stroke-width="7"/>
      </svg>
      ${icono('hexoptics', 128, { k: 'ico', x: ARO.cx - 64, y: ARO.cy - 64, borde: '#C8AA6E' })}
      ${dato(`<span data-k="alcance">${DATOS.alcance[1]}</span>`, { x: 600, y: 216, w: 360, tam: 200, color: ORO, tracking: 2 })}
      ${dato('ALCANCE', { x: 600, y: 410, w: 360, tam: 60, tracking: 6, k: 'etq' })}
      ${dato(`+100 · 8&nbsp;S`, { x: 600, y: 492, w: 360, tam: 80, tracking: 3, color: a(LUZ, 0.85), k: 'mas' })}`));

// ── 10 · jb-stormrazor · B ─── tarjeta; la velocidad de ataque que Jhin vuelve daño ──
slides.push(lamina('jb-stormrazor', 'La Stormrazor te da velocidad de ataque que Jhin convierte en daño.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { blur: 18, brillo: 0.35, pos: '70% 25%' })}
      ${tarjeta('stormrazor')}
      ${dato('<span data-k="cifra">25&nbsp;%</span>', { x: 610, y: 214, w: 350, tam: 180, color: ORO, tracking: 2 })}
      ${dato('VELOCIDAD<br>DE ATAQUE', { x: 610, y: 408, w: 350, tam: 54, tracking: 3, lh: 1, k: 'va' })}
      <div data-k="dano" style="position: absolute; left: 610px; top: 530px; display: flex; align-items: center; gap: 18px; font-size: 76px; line-height: 1; letter-spacing: 3px; color: ${ORO}; text-shadow: 0 6px 24px rgba(0,0,0,.85);">→
        <img data-k="pasiva-jhin" src="assets/iconos/Jhin_P.png" alt="Susurro, la pasiva de Jhin" style="width: 96px; height: 96px; border: 3px solid ${ORO}; box-sizing: border-box;"> DAÑO</div>`));

// ── 11 · jb-ratero · A ─── Empíreo y el rayo de lado a lado ──
slides.push(lamina('jb-ratero', 'Cuando cargas el ataque corres muchísimo.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { blur: 10, brillo: 0.5, pos: '75% 20%' })}
      ${arte('splash/Jhin_25.jpg', 'Jhin Empíreo, splash', { pos: '78% 22%', zoom: 1.35 })}
      ${veloAbajoIzq}
      <div data-k="rayo" style="position: absolute; inset: 0;">${kit.rayo(['M-120 300 C 260 270, 700 330, 1200 280', 'M-120 336 C 320 310, 760 370, 1200 320'], { ancho: PW, alto: PH, color: ORO, grosor: 12 })}</div>
      ${dato('<span data-k="cifra" style="display: inline-block;">+45&nbsp;%</span>', { x: 60, y: 300, w: 700, tam: 220, color: ORO, tracking: 4 })}
      ${dato('VELOCIDAD · 1,5&nbsp;S', { x: 66, y: 520, w: 700, tam: 76, tracking: 5, k: 'vel' })}`));

// ── 12 · jb-sinergia · D ─── alcance y velocidad que se juntan ──
slides.push(lamina('jb-sinergia', 'Juntas hacen una sinergia bien rara: se siente como velocidad de movimiento.', `
      ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 16, brillo: 0.26 })}
      ${mitad('izq', `<div data-k="cort-izq" style="position: absolute; inset: 0;">
        ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 12, brillo: 0.4, pos: '30% 40%' })}
        ${icono('hexoptics', 192, { x: 270 - 96, y: 196, borde: '#C8AA6E' })}
        ${dato('ALCANCE', { x: 60, y: 430, w: 420, tam: 90, tracking: 6, alinear: 'center', color: ORO })}</div>`, 'izq')}
      ${mitad('der', `<div data-k="cort-der" style="position: absolute; inset: 0;">
        ${respaldo('splash/Jhin_36-fondo.jpg', { blur: 12, brillo: 0.4, pos: '70% 30%' })}
        ${icono('stormrazor', 192, { x: 810 - 96, y: 196, borde: '#C8AA6E' })}
        ${dato('VELOCIDAD', { x: 600, y: 430, w: 360, tam: 90, tracking: 6, alinear: 'center', color: ORO })}</div>`, 'der')}
      ${costura}
      <div data-k="destello" style="position: absolute; left: ${540 - 190}px; top: ${310 - 190}px;">${kit.destello({ tam: 380, rayos: 16, color: ORO, semilla: 'sinergia-jhin' })}</div>`));

// ── 13 · jb-rango · E ─── la ranura de botas voltea ──
const RX = (PW - (6 * 120 + 5 * 24)) / 2, RY = 236;
slides.push(lamina('jb-rango', 'Es más rango y más velocidad, y por eso te puedes dar el lujo de cambiar las botas.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { pos: '60% 25%', brillo: 0.3 })}
      ${ranuras(['hexoptics', 'stormrazor'], { y: RY, etiquetas: false })}
      <div style="position: absolute; left: ${RX + 2 * 144}px; top: ${RY}px; width: 120px; height: 120px;">
        <div data-k="voltea" style="position: absolute; inset: 0; display: grid;">
          <div data-cara="frente" style="grid-area: 1 / 1; box-sizing: border-box; border: 3px solid #C8AA6E; background: ${TIP};"><img src="assets/items/${ITEMS.swiftness.id}.png" alt="Boots of Swiftness" style="width: 100%; height: 100%; display: block;"></div>
          <div data-cara="dorso" style="grid-area: 1 / 1; box-sizing: border-box; border: 3px solid ${ORO}; background: ${TIP}; box-shadow: 0 0 34px ${a(ORO, 0.6)};"><img src="assets/items/${ITEMS.gluttonous.id}.png" alt="Gluttonous Greaves" style="width: 100%; height: 100%; display: block;"></div>
        </div>
      </div>
      ${dato('= SE PUEDEN CAMBIAR LAS BOTAS', { x: 60, y: 430, w: 900, tam: 72, tracking: 4, alinear: 'center', k: 'frase' })}`));

// ── 14 · jb-glotonas · B ─── tarjeta de Gluttonous Greaves y el 7–8 ──
slides.push(lamina('jb-glotonas', 'Con las Gluttonous Greaves mi winrate no es el mejor, voy siete y ocho, pero te curan muchísimo.', `
      ${respaldo('carga/Jhin_1-fondo.jpg', { blur: 18, brillo: 0.35, pos: '50% 30%' })}
      ${tarjeta('gluttonous')}
      ${dato('HASTA', { x: 610, y: 196, w: 350, tam: 54, tracking: 6, color: a(LUZ, 0.75), k: 'hasta' })}
      ${dato('<span data-k="cifra">10&nbsp;%</span>', { x: 610, y: 250, w: 350, tam: 190, color: ORO, tracking: 2 })}
      ${dato('OMNIVAMPIRISMO', { x: 610, y: 440, w: 350, tam: 54, tracking: 3, k: 'omni' })}
      ${dato(`<span data-k="record">${DATOS.glotonas}</span>`, { x: 610, y: 530, w: 350, tam: 80, color: ROJO, tracking: 3 })}`));

// ── 15 · jb-ie · B ─── tarjeta de Infinity Edge ──
slides.push(lamina('jb-ie', 'Después va la Infinity Edge, que es súper tradicional.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { blur: 18, brillo: 0.35, pos: '45% 30%' })}
      ${tarjeta('ie')}
      ${dato('<span data-k="cifra">+30&nbsp;%</span>', { x: 610, y: 210, w: 350, tam: 160, color: ORO, tracking: 2 })}
      ${dato('DAÑO<br>CRÍTICO', { x: 610, y: 400, w: 350, tam: 80, tracking: 4, lh: 1, k: 'etq' })}`));

// ── 16 · jb-ldr · B ─── tarjeta de Lord Dominik's Regards (otro recorte de fondo) ──
slides.push(lamina('jb-ldr', 'Casi siempre le sigue Lord Dominik\'s Regards.', `
      ${respaldo('splash/Jhin_2-fondo.jpg', { blur: 18, brillo: 0.35, pos: '15% 80%' })}
      ${tarjeta('ldr')}
      ${dato('<span data-k="cifra">35&nbsp;%</span>', { x: 610, y: 210, w: 350, tam: 180, color: ORO, tracking: 2 })}
      ${dato('PENETRACIÓN<br>DE ARMADURA', { x: 610, y: 400, w: 350, tam: 64, tracking: 3, lh: 1.02, k: 'etq' })}`));

// ── 17 · jb-quinto · D ─── Titanic Hydra o Guardian Angel ──
slides.push(lamina('jb-quinto', 'De quinto item puedes ir por Titanic Hydra o el Guardian Angel.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { blur: 16, brillo: 0.32 })}
      ${mitad('izq', `
        <div data-k="reb-izq" style="position: absolute; left: 0; top: 0; width: ${Math.ceil(540 + T6)}px; height: ${PH}px; overflow: hidden;">
          <img src="assets/splash/Jhin_47.jpg" alt="Jhin Creador de Mitos, splash" style="width: 100%; height: 100%; object-fit: cover; object-position: 40% 30%; display: block;">
        </div>
        <div style="position: absolute; inset: 0; background: ${a(BG, 0.7)};"></div>
        ${icono('hydra', 192, { k: 'ico-izq', x: 270 - 96, y: 192, borde: ORO, estilo: `box-shadow: 0 0 44px ${a(ORO, 0.55)};` })}
        ${dato('TITANIC HYDRA', { x: 60, y: 410, w: 420, tam: 74, tracking: 3, alinear: 'center', color: ORO, k: 'nom-izq' })}
        ${dato('+600 VIDA', { x: 60, y: 500, w: 420, tam: 56, tracking: 4, alinear: 'center', k: 'dato-izq' })}`)}
      ${mitad('der', `
        <div data-k="reb-der" style="position: absolute; left: ${Math.floor(540 - T6)}px; top: 0; width: ${Math.ceil(540 + T6)}px; height: ${PH}px; overflow: hidden;">
          <img src="assets/splash/Jhin_47.jpg" alt="Jhin Creador de Mitos, splash (otro recorte)" style="width: 100%; height: 100%; object-fit: cover; object-position: 85% 60%; display: block;">
        </div>
        <div style="position: absolute; inset: 0; background: ${a(BG, 0.74)};"></div>
        ${icono('ga', 150, { k: 'ico-der', x: 810 - 75, y: 212 })}
        ${dato('GUARDIAN ANGEL', { x: 600, y: 410, w: 360, tam: 62, tracking: 3, alinear: 'center', color: a(LUZ, 0.85), k: 'nom-der' })}
        ${dato('REVIVES', { x: 600, y: 500, w: 360, tam: 56, tracking: 4, alinear: 'center', color: a(LUZ, 0.75), k: 'dato-der' })}`)}
      ${costura}`));

// ── 18 · jb-ulti · A ─── Luna de Sangre se abre en iris desde la R ──
const R_ICO = { x: 60, y: 200, tam: 170 };
slides.push(lamina('jb-ulti', 'Donde de verdad se nota es en la ulti.', `
      ${respaldo('splash/Jhin_2-fondo.jpg', { blur: 12, brillo: 0.4, pos: '60% 25%' })}
      ${arte('splash/Jhin_2.jpg', 'Jhin Luna de Sangre, splash', { pos: '62% 22%', zoom: 1.12, k: 'arte' })}
      ${veloAbajoIzq}
      <img data-k="r" src="assets/iconos/JhinR.png" alt="Llamado a Escena, la R de Jhin" style="position: absolute; left: ${R_ICO.x}px; top: ${R_ICO.y}px; width: ${R_ICO.tam}px; height: ${R_ICO.tam}px; box-sizing: border-box; border: 4px solid ${ORO}; box-shadow: 0 0 40px ${a(ORO, 0.5)};">
      ${dato('CURTAIN CALL', { x: 60, y: 420, w: 800, tam: 160, tracking: 8, k: 'nombre' })}`));

// ── 19 · jb-critico · C ─── gráfica 3: cuatro escalones de 25 % y la flecha a la R ──
const ESC = { x0: 80, paso: 150, base: 610, alto: 78 };
const escX = (i) => ESC.x0 + i * ESC.paso, escY = (i) => ESC.base - i * ESC.alto;
let escalera = `M${escX(0)} ${escY(0)}`;
for (let i = 0; i < 4; i++) escalera += ` V${escY(i + 1)} H${escX(i + 1)}`;
const CRIT = ['hexoptics', 'stormrazor', 'ie', 'ldr'];
slides.push(lamina('jb-critico', 'Toda la build es crítico; a Jhin cada punto de crítico le da más daño de ataque y la ulti escala con ese daño.', `
      ${respaldo('splash/Jhin_2-fondo.jpg', { pos: '40% 60%', brillo: 0.3 })}
      <svg viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible;">
        <line x1="${escX(0)}" y1="${ESC.base}" x2="${escX(4)}" y2="${ESC.base}" stroke="${a(LUZ, 0.3)}" stroke-width="2"/>
        <g data-k="trazo"><path d="${escalera}" fill="none" stroke="${ORO}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g>
        <g data-k="flecha" fill="none" stroke="${ORO}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M${escX(4) + 16} ${escY(4)} H${escX(4) + 70}"/><path d="M${escX(4) + 52} ${escY(4) - 16} L${escX(4) + 70} ${escY(4)} L${escX(4) + 52} ${escY(4) + 16}"/></g>
      </svg>
      ${CRIT.map((c, i) => `
      <div data-paso style="position: absolute; left: ${escX(i) + 30}px; top: ${escY(i + 1) - 4}px; width: 90px;">
        ${icono(c, 84, { borde: '#C8AA6E' })}
      </div>
      <div data-pct style="position: absolute; left: ${escX(i) + 6}px; top: ${escY(i + 1) - 52}px; width: 140px; text-align: center; font-size: 40px; line-height: 1; color: ${i === 3 ? ORO : a(LUZ, 0.85)}; text-shadow: 0 4px 18px rgba(0,0,0,.85);">${(i + 1) * 25}&nbsp;%</div>`).join('')}
      ${dato('DAÑO DE<br>ATAQUE', { x: escX(4) + 90, y: escY(4) - 72, w: 200, tam: 60, tracking: 2, lh: 1, color: ORO, k: 'da' })}
      <svg data-k="baja" viewBox="0 0 40 70" style="position: absolute; left: ${escX(4) + 160}px; top: ${escY(4) + 64}px; width: 40px; height: 70px; overflow: visible;"><path d="M20 2 V62 M6 48 L20 64 L34 48" fill="none" stroke="${ORO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <img data-k="r" src="assets/iconos/JhinR.png" alt="Llamado a Escena, la R de Jhin" style="position: absolute; left: ${escX(4) + 120}px; top: ${escY(4) + 146}px; width: 120px; height: 120px; box-sizing: border-box; border: 4px solid ${ORO}; box-shadow: 0 0 34px ${a(ORO, 0.5)};">`));

// ── 20 · jb-distancia · A ─── Oscuridad Cósmica, la cámara se aleja ──
slides.push(lamina('jb-distancia', 'Toda la build te pide jugar a distancia, que es justo desde donde Jhin tira la ulti.', `
      ${respaldo('splash/Jhin_5-fondo.jpg', { blur: 10, brillo: 0.5 })}
      ${arte('splash/Jhin_5.jpg', 'Jhin Oscuridad Cósmica, splash completo', { pos: '50% 45%', k: 'arte' })}
      ${veloAbajoIzq}
      ${dato('JUGAR A<br>DISTANCIA', { x: 60, y: 330, w: 700, tam: 140, tracking: 6, lh: 0.95, k: 'frase' })}`));

// ── 21 · jb-numeros · C ─── gráfica 4: 50 % contra 59 %, con la build real de la partida ──
const B4 = { x: 500, max: 440, alto: 64 };
slides.push(lamina('jb-numeros', 'Llevo 29 partidas con esta build y voy diecisiete y doce, 59 por ciento.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { pos: '60% 25%', brillo: 0.3 })}
      ${dato(`<span data-k="v">${DATOS.build.v}</span><span style="color: ${a(LUZ, 0.5)};">–</span><span style="color: ${a(LUZ, 0.8)};">${DATOS.build.d}</span>`, { x: 60, y: 206, w: 400, tam: 130, color: ORO, tracking: 3 })}
      <div data-k="inventario" style="position: absolute; left: 60px; top: 372px; width: 400px; height: 240px; box-sizing: border-box; border: 3px solid ${BORDE}; background: ${TIP}; box-shadow: 0 16px 40px rgba(0,0,0,.65); overflow: hidden;">
        <img src="assets/capturas/inventario.png" alt="Inventario de la partida: Lord Dominik's Regards, Hexoptics C44, Stormrazor, Infinity Edge, Guardian Angel y Gluttonous Greaves" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
      ${dato('TEMPORADA', { x: B4.x, y: 236, w: 460, tam: 44, tracking: 4, color: a(LUZ, 0.8) })}
      <div data-barra style="position: absolute; left: ${B4.x}px; top: 290px; width: ${Math.round((B4.max * DATOS.temporada) / 100)}px; height: ${B4.alto}px; background: ${GRIS}; border-radius: 0 6px 6px 0; transform-origin: 0 50%;"></div>
      <div data-valor style="position: absolute; left: ${B4.x + Math.round((B4.max * DATOS.temporada) / 100) + 16}px; top: 290px; height: ${B4.alto}px; display: flex; align-items: center; font-size: 60px; color: ${LUZ};"><span data-k="v-temp">${DATOS.temporada}&nbsp;%</span></div>
      ${dato('ESTA BUILD', { x: B4.x, y: 396, w: 460, tam: 44, tracking: 4, color: ORO })}
      <div data-barra style="position: absolute; left: ${B4.x}px; top: 450px; width: ${Math.round((B4.max * DATOS.build.pct) / 100)}px; height: ${B4.alto}px; background: ${ORO}; border-radius: 0 6px 6px 0; transform-origin: 0 50%;"></div>
      <div data-valor style="position: absolute; left: ${B4.x + Math.round((B4.max * DATOS.build.pct) / 100) + 16}px; top: 450px; height: ${B4.alto}px; display: flex; align-items: center; font-size: 72px; color: ${ORO};"><span data-k="v-build">${DATOS.build.pct}&nbsp;%</span></div>`));

// ── 22 · jb-nadie · E ─── op.gg contra la build de Cronofox ──
const N = { x0: 280, tam: 100, sep: 14, y1: 206, y2: 404 };
slides.push(lamina('jb-nadie', 'Nadie la usa: en op.gg la Hexoptics ni aparece y la Stormrazor sale hasta como quinto item.', `
      ${respaldo('splash/Jhin_25-fondo.jpg', { pos: '30% 70%', brillo: 0.28 })}
      ${dato('<span data-k="fila-1">OP.GG</span>', { x: 60, y: N.y1 + 26, w: 220, tam: 54, tracking: 6, color: a(LUZ, 0.75) })}
      ${ranuras([null, null, null, null, 'stormrazor', null], { tam: N.tam, sep: N.sep, y: N.y1, x0: N.x0, k: 'fila-op', etiquetas: false, destacar: 4 })}
      ${dato('<span data-k="txt-1">STORMRAZOR: 5.º ITEM</span>', { x: N.x0, y: N.y1 + N.tam + 14, w: 6 * N.tam + 5 * N.sep, tam: 44, tracking: 3, alinear: 'right' })}
      ${dato(`<span data-k="fila-2">${CRONOFOX}</span>`, { x: 60, y: N.y2 + 28, w: 210, tam: 48, tracking: 3, color: ORO })}
      ${ranuras(['hexoptics', 'stormrazor', 'gluttonous', 'ie', 'ldr', 'hydra'], { tam: N.tam, sep: N.sep, y: N.y2, x0: N.x0, k: 'fila-cf', etiquetas: false })}
      <div data-k="etiqueta" style="position: absolute; left: ${N.x0 - 6}px; top: ${N.y2 - 40}px; padding: 4px 10px 2px; background: ${ROJO}; color: ${LUZ}; font-size: 30px; line-height: 1; letter-spacing: 2px; z-index: 3;">0 EN OP.GG</div>
      ${dato('<span data-k="txt-2">HEXOPTICS: NO APARECE</span>', { x: N.x0, y: N.y2 + N.tam + 14, w: 6 * N.tam + 5 * N.sep, tam: 44, tracking: 3, alinear: 'right', color: ORO })}`));

// ── 23 · jb-esmeralda · B ─── el emblema de Esmeralda y las 29 partidas ──
slides.push(lamina('jb-esmeralda', 'No les voy a decir que está rota porque son 29 partidas en Esmeralda.', `
      ${respaldo('splash/Jhin_14-fondo.jpg', { blur: 18, brillo: 0.35, pos: '60% 25%' })}
      <div data-k="crece" style="position: absolute; left: 40px; top: 180px; width: 540px; height: 460px; display: flex; align-items: center; justify-content: center;">
        <div data-elegida style="width: 180px; height: 132px;">
          <img src="assets/emblemas/emerald.png" alt="Emblema de Esmeralda" style="width: 100%; height: 100%; object-fit: contain; display: block;">
        </div>
      </div>
      ${dato('<span data-k="num">29</span>', { x: 600, y: 220, w: 360, tam: 240, color: ORO, tracking: 2 })}
      ${dato('<span data-k="txt">PARTIDAS</span>', { x: 604, y: 500, w: 360, tam: 96, tracking: 6 })}`));

// ── 24 · jb-dano · C ─── gráfica 5: daño a campeones por partida ──
const B5 = { x: 60, max: 690, alto: 72 };
const anchoDano = (v) => Math.round((B5.max * v) / DATOS.dano.build);
slides.push(lamina('jb-dano', 'Estoy haciendo casi 30 % más de daño que con la build de Hubris.', `
      ${respaldo('splash/Jhin_36-fondo.jpg', { pos: '50% 30%', brillo: 0.3 })}
      ${dato('HUBRIS', { x: B5.x, y: 190, w: 400, tam: 46, tracking: 4, color: a(LUZ, 0.8) })}
      <div data-barra style="position: absolute; left: ${B5.x}px; top: 242px; width: ${anchoDano(DATOS.dano.hubris)}px; height: ${B5.alto}px; background: ${GRIS}; border-radius: 0 6px 6px 0; transform-origin: 0 50%;"></div>
      <div style="position: absolute; left: ${B5.x + anchoDano(DATOS.dano.hubris) + 16}px; top: 242px; height: ${B5.alto}px; display: flex; align-items: center; font-size: 64px; color: ${LUZ};"><span data-k="v-hubris">${num(DATOS.dano.hubris)}</span></div>
      ${dato('ESTA BUILD', { x: B5.x, y: 340, w: 400, tam: 46, tracking: 4, color: ORO })}
      <div data-barra style="position: absolute; left: ${B5.x}px; top: 392px; width: ${anchoDano(DATOS.dano.build)}px; height: ${B5.alto}px; background: ${ORO}; border-radius: 0 6px 6px 0; transform-origin: 0 50%;"></div>
      <div style="position: absolute; left: ${B5.x + anchoDano(DATOS.dano.build) + 16}px; top: 392px; height: ${B5.alto}px; display: flex; align-items: center; font-size: 64px; color: ${ORO};"><span data-k="v-build">${num(DATOS.dano.build)}</span></div>
      ${dato(`<span data-k="pct">+${DATOS.dano.pct}&nbsp;% DAÑO</span>`, { x: B5.x, y: 494, w: 900, tam: 120, tracking: 4, color: ORO })}`));

// ── 25 · jb-cierre · A ─── Creador de Mitos: ¿Diamante? ──
slides.push(lamina('jb-cierre', 'Díganme si le sigo con esta build hasta Diamante.', `
      ${respaldo('splash/Jhin_47-fondo.jpg', { blur: 12, brillo: 0.5, pos: '45% 30%' })}
      ${arte('splash/Jhin_47.jpg', 'Jhin Creador de Mitos, splash', { pos: '42% 28%', zoom: 1.3, filtro: 'brightness(.8)' })}
      ${veloIzq(0.82)}
      <div data-k="emblemas" style="position: absolute; left: 60px; top: 190px; display: flex; align-items: center; gap: 22px;">
        <img src="assets/emblemas/emerald.png" alt="Emblema de Esmeralda" style="height: 130px; width: auto; display: block;">
        <svg viewBox="0 0 70 40" style="width: 70px; height: 40px;"><path d="M4 20 H60 M44 6 L62 20 L44 34" fill="none" stroke="${ORO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <img src="assets/emblemas/diamond.png" alt="Emblema de Diamante" style="height: 110px; width: auto; display: block;">
      </div>
      <div data-k="chispas" style="position: absolute; left: 0; top: 300px; width: 700px; height: 320px;"></div>
      ${dato('<span data-k="diamante" style="display: inline-block;">¿DIAMANTE?</span>', { x: 60, y: 370, w: 860, tam: 190, tracking: 6, color: ORO })}`));

// ── reposo · A ─── Jhin base desenfocado al 45 % ──
slides.push(lamina('jb-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', `
      ${respaldo('splash/Jhin_0-fondo.jpg', { blur: 16, brillo: 0.45, pos: '58% 30%' })}
      ${dato(`JHIN · <span style="color: ${ORO};">BUILD</span>`, { x: 60, y: 190, w: 400, tam: 48, tracking: 6, color: a(LUZ, 0.85) })}`, ' data-reposo'));

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar || !window.efecto) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var k = function (s, n) { return s.querySelector('[data-k="' + n + '"]'); };
  var DUR = 2.5;                     // largo mínimo; ninguna entrada pasa de 2,8
  var aparece = function (tl, el, en, d) { if (el) tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: d || 0.45, ease: 'entrada', immediateRender: true }, en); };
  // El ícono «cae con golpe»: la curva golpe del kit (la receta golpe es para texto).
  var cae = function (tl, el, en) { if (el) tl.from(el, { y: -70, scale: 1.25, opacity: 0, duration: 0.5, ease: 'golpe' }, en); };
  // «pulso» no existe en el kit: latido de escala con la curva golpe y un brillo dorado.
  var pulso = function (tl, el, en) { if (!el) return; tl.to(el, { scale: 1.16, filter: 'drop-shadow(0 0 18px ${ORO})', duration: 0.22, ease: 'golpe', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, en); };
  // tarjeta-item: el ícono cae con golpe, la tarjeta baja con cortinilla, las estadísticas
  // entran con maquina una tras otra y la cifra de la pasiva hace contador.
  var tarjeta = function (tl, s, cifra) {
    efecto('cortinilla', tl, k(s, 'tarjeta'), { forma: 'persiana', direccion: 'abajo', dur: 0.7, en: 0.05 });
    cae(tl, k(s, 'icono'), 0.25);
    q(s, '[data-stat]').forEach(function (el, i) { efecto('maquina', tl, el, { en: 0.75 + i * 0.3, ritmo: 0.02, cursor: 'no' }); });
    aparece(tl, k(s, 'pasiva'), 1.45, 0.4);
    if (cifra) {
      // La cifra no se ve en «0 %» mientras baja la tarjeta: aparece cuando empieza a contar.
      tl.fromTo(k(s, 'cifra'), { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 1.2);
      efecto('contador', tl, k(s, 'cifra'), Object.assign({ en: 1.25, dur: 1.15 }, cifra));
    }
  };
  var C = {
    'jb-portada': function (tl, s) {
      efecto('parallax', tl, k(s, 'capas'), { dur: 2.2, distancia: 50 });
      efecto('tragamonedas', tl, k(s, 'nueve'), { en: 0.4, dur: 1.6 });
    },
    'jb-temporada': function (tl, s) {
      efecto('dona', tl, k(s, 'dona'), { en: 0.2, dur: 1.5 });
      aparece(tl, k(s, 'partidas'), 0.5); aparece(tl, k(s, 'marcador'), 1.0); aparece(tl, k(s, 'pct'), 1.4);
    },
    'jb-hubris': function (tl, s) {
      aparece(tl, k(s, 'opgg'), 0.05, 0.35);
      tl.from(q(s, '[data-ranura]'), { opacity: 0, duration: 0.3, stagger: 0.04 }, 0);
      q(s, '[data-item]').forEach(function (el, i) { cae(tl, el, 0.35 + i * 0.35); });
      q(s, '[data-nombre-item]').forEach(function (el, i) { aparece(tl, el, 0.65 + i * 0.35, 0.35); });
      efecto('sello', tl, k(s, 'marcador'), { en: 1.4, fuerza: 10 });
    },
    'jb-cronofox': function (tl, s) {
      efecto('letrero', tl, k(s, 'letrero').firstElementChild, { en: 0.25 });
    },
    'jb-runas': function (tl, s) {
      // La cortina del paquete: cada mitad entra desde su lado (a mano, como en senna).
      tl.from(k(s, 'izq'), { x: -560, duration: 0.85, ease: 'power3.out' }, 0.1);
      tl.from(k(s, 'der'), { x: 560, duration: 0.85, ease: 'power3.out' }, 0.25);
      efecto('brillo', tl, k(s, 'txt-izq'), { en: 1.0, dur: 1.2, color: '#FFF3C4' });
      efecto('brillo', tl, k(s, 'txt-der'), { en: 1.2, dur: 1.2, color: '#FFFFFF' });
      [k(s, 'runa-izq'), k(s, 'runa-der')].forEach(function (el, i) {
        tl.fromTo(el, { filter: 'drop-shadow(0 0 0 rgba(224,179,84,0))' }, { filter: 'drop-shadow(0 0 26px rgba(224,179,84,.9))', duration: 0.5, ease: 'golpe', yoyo: true, repeat: 1, immediateRender: false }, 1.0 + i * 0.2);
      });
    },
    'jb-orden': function (tl, s) {
      efecto('bento', tl, k(s, 'fila-marcos'), { desde: 'start', escalon: 0.05, dur: 0.45 });
      q(s, '[data-item]').forEach(function (el, i) { cae(tl, el, 0.7 + i * 0.6); });
      q(s, '[data-num]').forEach(function (el, i) { tl.from(el, { scale: 0, duration: 0.3, ease: 'golpe' }, 1.0 + i * 0.6); });
      q(s, '[data-nombre-item]').forEach(function (el, i) { aparece(tl, el, 1.0 + i * 0.6, 0.35); });
    },
    'jb-botas': function (tl, s) {
      efecto('revuelto', tl, k(s, 'swift'), { en: 0.1, dur: 0.8, glifos: 'SWIFTNESGLUTONRAV' });
      tl.fromTo(k(s, 'tachon'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'entrada', immediateRender: true }, 0.95);
      tl.to(k(s, 'ico-izq'), { opacity: 0.45, duration: 0.5 }, 1.0);
      cae(tl, k(s, 'ico-der'), 1.2);
      aparece(tl, k(s, 'nom-der'), 1.45, 0.45);
    },
    'jb-hexoptics': function (tl, s) {
      tarjeta(tl, s, { cuenta: 10, prefijo: '+', sufijo: '\\u00A0%' });
      efecto('dibujo', tl, k(s, 'trazo'), { en: 0.5, dur: 1.5, escalon: 0 });
    },
    'jb-alcance': function (tl, s) {
      // El aro crece de 550 a 650 a mano (curva entrada), mientras la cifra cuenta.
      tl.fromTo(k(s, 'aro'), { attr: { r: ${ARO.r0} } }, { attr: { r: ${ARO.r1} }, duration: 1.4, ease: 'entrada', immediateRender: true }, 0.4);
      cae(tl, k(s, 'ico'), 0.1);
      efecto('contador', tl, k(s, 'alcance'), { en: 0.4, dur: 1.4, desde: ${DATOS.alcance[0]}, cuenta: ${DATOS.alcance[1]}, separador: '' });
      aparece(tl, k(s, 'etq'), 0.6); aparece(tl, k(s, 'mas'), 1.5);
    },
    'jb-stormrazor': function (tl, s) {
      tarjeta(tl, s, { cuenta: 25, sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'va'), 1.4); aparece(tl, k(s, 'dano'), 1.7);
      pulso(tl, k(s, 'pasiva-jhin'), 2.1);
    },
    'jb-ratero': function (tl, s) {
      efecto('rayo', tl, k(s, 'rayo'), { en: 0.1, dur: 0.6, escalon: 0.06 });
      efecto('palabra', tl, k(s, 'cifra'), { en: 0.45 });
      aparece(tl, k(s, 'vel'), 0.95);
    },
    'jb-sinergia': function (tl, s) {
      efecto('cortinilla', tl, k(s, 'cort-izq'), { direccion: 'derecha', dur: 0.8, en: 0.05 });
      efecto('cortinilla', tl, k(s, 'cort-der'), { direccion: 'izquierda', dur: 0.8, en: 0.25 });
      efecto('destello', tl, k(s, 'destello'), { en: 1.0, dur: 1.2, semilla: 'sinergia-jhin' });
    },
    'jb-rango': function (tl, s) {
      tl.from(q(s, '[data-item]'), { opacity: 0, y: 20, duration: 0.4, stagger: 0.1, ease: 'entrada' }, 0);
      efecto('voltea', tl, k(s, 'voltea'), { en: 0.5, dur: 1.1 });
      aparece(tl, k(s, 'frase'), 1.3, 0.5);
    },
    'jb-glotonas': function (tl, s) {
      tarjeta(tl, s, { cuenta: 10, sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'hasta'), 1.1); aparece(tl, k(s, 'omni'), 1.5);
      efecto('maquina', tl, k(s, 'record'), { en: 2.0, ritmo: 0.08, cursor: 'no' });
    },
    'jb-ie': function (tl, s) {
      tarjeta(tl, s, { cuenta: 30, prefijo: '+', sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'etq'), 1.5);
    },
    'jb-ldr': function (tl, s) {
      tarjeta(tl, s, { cuenta: 35, sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'etq'), 1.5);
    },
    'jb-quinto': function (tl, s) {
      efecto('rebanadas', tl, k(s, 'reb-izq'), { n: 5, en: 0.05, dur: 0.8 });
      efecto('rebanadas', tl, k(s, 'reb-der'), { n: 5, en: 0.3, dur: 0.8 });
      cae(tl, k(s, 'ico-izq'), 0.8); cae(tl, k(s, 'ico-der'), 1.0);
      aparece(tl, k(s, 'nom-izq'), 1.1); aparece(tl, k(s, 'dato-izq'), 1.3);
      aparece(tl, k(s, 'nom-der'), 1.3); aparece(tl, k(s, 'dato-der'), 1.5);
    },
    'jb-ulti': function (tl, s) {
      // El iris del paquete, sobre el arte y desde el ícono de la R (el del kit recorta la sección entera).
      cae(tl, k(s, 'r'), 0);
      tl.fromTo(k(s, 'arte'), { clipPath: 'circle(0% at ${R_ICO.x + R_ICO.tam / 2}px ${R_ICO.y + R_ICO.tam / 2}px)' }, { clipPath: 'circle(140% at ${R_ICO.x + R_ICO.tam / 2}px ${R_ICO.y + R_ICO.tam / 2}px)', duration: 1.4, ease: 'power3.inOut', immediateRender: true }, 0.25);
      aparece(tl, k(s, 'nombre'), 1.2, 0.55);
    },
    'jb-critico': function (tl, s) {
      efecto('dibujo', tl, k(s, 'trazo'), { en: 0.1, dur: 1.6, escalon: 0 });
      q(s, '[data-paso]').forEach(function (el, i) { cae(tl, el, 0.25 + i * 0.4); });
      q(s, '[data-pct]').forEach(function (el, i) { aparece(tl, el, 0.4 + i * 0.4, 0.3); });
      tl.from(k(s, 'flecha'), { opacity: 0, x: -20, duration: 0.3 }, 1.8);
      aparece(tl, k(s, 'da'), 1.9, 0.35);
      tl.from(k(s, 'baja'), { opacity: 0, y: -16, duration: 0.3 }, 2.15);
      cae(tl, k(s, 'r'), 2.25);
    },
    'jb-distancia': function (tl, s) {
      efecto('empuje', tl, k(s, 'arte'), { desde: 1.3, origen: '48% 30%', dur: 2.6 });
      aparece(tl, k(s, 'frase'), 0.8, 0.6);
    },
    'jb-numeros': function (tl, s) {
      tl.from(k(s, 'inventario'), { opacity: 0, x: -30, duration: 0.5, ease: 'entrada' }, 0);
      tl.from(q(s, '[data-barra]'), { scaleX: 0, duration: 1.0, ease: 'entrada', stagger: 0.15 }, 0.35);
      efecto('contador', tl, k(s, 'v-temp'), { en: 0.35, dur: 1.0, cuenta: ${DATOS.temporada}, sufijo: '\\u00A0%' });
      efecto('contador', tl, k(s, 'v-build'), { en: 0.5, dur: 1.2, cuenta: ${DATOS.build.pct}, sufijo: '\\u00A0%' });
      aparece(tl, k(s, 'v').parentNode, 0.1, 0.5);
    },
    'jb-nadie': function (tl, s) {
      efecto('maquina', tl, k(s, 'fila-1'), { en: 0.05, ritmo: 0.06, cursor: 'no' });
      tl.from(q(k(s, 'fila-op'), '[data-ranura], [data-item]'), { opacity: 0, duration: 0.25, stagger: 0.05 }, 0.2);
      efecto('maquina', tl, k(s, 'txt-1'), { en: 0.75, ritmo: 0.025, cursor: 'no' });
      pulso(tl, k(s, 'fila-op').querySelector('[data-item]'), 1.1);
      efecto('maquina', tl, k(s, 'fila-2'), { en: 1.0, ritmo: 0.05, cursor: 'no' });
      tl.from(q(k(s, 'fila-cf'), '[data-ranura], [data-item]'), { opacity: 0, duration: 0.25, stagger: 0.05 }, 1.15);
      efecto('maquina', tl, k(s, 'txt-2'), { en: 1.75, ritmo: 0.025, cursor: 'no' });
      tl.from(k(s, 'etiqueta'), { scale: 0, duration: 0.3, ease: 'golpe', transformOrigin: '0% 100%' }, 2.1);
    },
    'jb-esmeralda': function (tl, s) {
      efecto('crece', tl, k(s, 'crece'), { en: 0.15, dur: 1.0 });
      efecto('contador', tl, k(s, 'num'), { en: 0.4, dur: 1.2, cuenta: 29 });
      // palabra saldría tres veces (ratero, esmeralda, cierre): aquí van las letras.
      efecto('letras', tl, k(s, 'txt'), { en: 0.9, dur: 0.6 });
    },
    'jb-dano': function (tl, s) {
      tl.from(q(s, '[data-barra]'), { scaleX: 0, duration: 1.1, ease: 'entrada', stagger: 0.2 }, 0.2);
      efecto('contador', tl, k(s, 'v-hubris'), { en: 0.2, dur: 1.1, cuenta: ${DATOS.dano.hubris}, separador: '.' });
      efecto('contador', tl, k(s, 'v-build'), { en: 0.4, dur: 1.3, cuenta: ${DATOS.dano.build}, separador: '.' });
      efecto('golpe', tl, k(s, 'pct'), { en: 1.8, escalon: 0.18 });
    },
    'jb-cierre': function (tl, s) {
      tl.from(k(s, 'emblemas').children, { opacity: 0, x: -24, duration: 0.4, stagger: 0.15, ease: 'entrada' }, 0.1);
      efecto('palabra', tl, k(s, 'diamante'), { en: 0.7 });
      efecto('chispas', tl, k(s, 'chispas'), { en: 0.7, dur: 1.4, color: '${ORO},#FFF1C2,#FFFFFF', origen: '30 50', semilla: 'gg-jhin' });
    },
    'jb-reposo': function () {},
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
<title>La build rara de Jhin</title>
${kit.og({ titulo: 'La build rara de Jhin', descripcion: 'La build de Cronofox (Hexoptics C44, Stormrazor y Gluttonous Greaves) en banda superior: cada item con su tooltip, el 50 → 59 % de winrate, el alcance, el crítico y el daño. Solo arte oficial.', carpeta: 'creator/jhin-build' })}
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
