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
// huecos y fuera de orden.
//
// La entrada (2,5 s como máximo; después el último cuadro queda congelado):
//   · una estela (receta `cometa`) cruza la banda de izquierda a derecha, empezando y
//     terminando fuera de cuadro; detrás de ella se levanta la sombra del arte,
//   · cada destello del riel late cuando la estela le pasa encima y vuelve a su sitio,
//   · al llegar al dato, el dato entra con un `destello` detrás y un estallido de
//     `chispas` (que terminan invisibles). Todo determinista por seek.
// Los splashes van a sangre (a 1080×680 se ven al 95 %: ya no se amplían); las
// pantallas de carga verticales van en una columna de 400 px con el dato al otro lado.
// Las letras: 90 px como mínimo (DEMONKINGOFNOXUS); el resto, 140–420 px.
//
// Arte: el mismo de la primera versión (Data Dragon, CommunityDragon y los logos de
// suiza-qf), todo oficial. Sin dinero, sin el récord del Mundial y sin inventar lore.
// ⚠️ El ícono de la R es de 64 px (ampliado 4×): en am-ulti va a 380 px.
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

// La estela que cruza la banda: un solo trazo de -60 a 1140 (fuera de cuadro en los dos extremos).
const barrido = (y) => `
      <svg data-barrido viewBox="0 0 ${PW} ${PH}" style="position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; overflow: visible; pointer-events: none; filter: drop-shadow(0 0 6px ${a(ORO, 0.9)});">
        <path data-camino d="M-60 ${y} L1140 ${y}" fill="none" stroke="${ORO_CL}" stroke-width="3" stroke-linecap="round"/>
      </svg>`;

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${CREMA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

// Guía de dónde va el gameplay del prereel: solo para ver el deck en el navegador.
// Lleva data-fondo y queda fuera del recorte: nunca sale en un clip.
const GUIA = `
    <div data-fondo style="position: absolute; left: 0; top: 297px; width: ${PW}px; height: 943px; box-sizing: border-box; border: 2px dashed ${a(ORO, 0.16)}; display: flex; align-items: center; justify-content: center; font-size: 56px; letter-spacing: 12px; color: ${a(CREMA, 0.14)};">GAMEPLAY</div>`;

// Encuadre → traslación, sin pasarse de los bordes de la imagen.
function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return { x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0), y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0), z };
}

// Visor con una imagen oficial adentro y la cámara declarada en `cam`:
// [cx0, cy0, z0, cx1, cy1, z1] — centro normalizado (0–1) y zoom sobre `cover`.
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', sombra = false, attrs = '' }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden;${sombra ? ' box-shadow: 0 0 70px rgba(0,0,0,0.7);' : ''}">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Fondo opaco detrás de una pantalla de carga: su copia de 360 px desenfocada (NO es data-fondo).
const respaldo = (src, brillo = 0.42, attrs = '') => `
      <div style="position: absolute; inset: 0; overflow: hidden;"><div ${attrs} style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(40px) saturate(1.15) brightness(${brillo});"></div></div>`;

// Velo para que el dato se lea sobre un splash a sangre: entra desde la izquierda.
const veloIzq = `
      <div style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, ${a(BG, 0.9)} 0%, ${a(BG, 0.6)} 42%, ${a(BG, 0)} 74%);"></div>`;

// Texto: solo el dato.
const texto = (txt, { x, y, w, tam, clase = 'oro', tracking = 8 }) => `
      <div data-dato style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; box-sizing: border-box; text-align: center; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px; white-space: nowrap;"><span class="${clase}">${txt}</span></div>`;

// El destello que se abre detrás del dato al llegar la estela.
const luz = (cx, cy, tam, semilla) => `
      <div data-luz style="position: absolute; left: ${cx - tam / 2}px; top: ${cy - tam / 2}px; width: ${tam}px; height: ${tam}px; opacity: 0.75; pointer-events: none;">${kit.destello({ tam, rayos: 16, color: ORO_CL, semilla })}</div>`;

/**
 * El panel de la banda: arte → sombra que levanta la estela → riel → dato → estela → chispas.
 * `y` es la altura de la estela; `llegada` [x, y] el centro del dato (sin dato, la estela solo cruza).
 */
function panel({ arte, dato = '', y, llegada = null, semilla }) {
  return `
    <div data-panel data-barrido-y="${y}"${llegada ? ` data-llegada="${llegada.join(' ')}"` : ''} style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px; overflow: hidden; background: ${BG};">${arte}
      <div data-sombra style="position: absolute; inset: 0; background: ${a(BG, 0.58)}; pointer-events: none;"></div>${RIEL}${llegada ? luz(llegada[0], llegada[1], 340, semilla) : ''}${dato}${barrido(y)}
      <div data-chispas style="position: absolute; inset: 0; pointer-events: none;"></div>
    </div>`;
}

const lamina = (id, notasOrador, cuerpo, extra = '') => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}"${extra} style="${SECCION}">${GUIA}${cuerpo}
  </section>`;

// Una imagen oficial: splash (1215×717) a sangre, o pantalla de carga (308×560) en columna.
const SP = { iw: 1215, ih: 717 };
const COL = { w: 400, h: PH, iw: 308, ih: 560, sombra: true };
const CENTRO = { ...COL, x: 340 };
const splash = (n) => `splash/${n}.jpg`;

const slides = [];

// ── 1 · am-portada ───────────────────────────────────────────────────────
slides.push(lamina('am-portada', 'Hace dos años salió Ambessa.', panel({ semilla: 'am-portada', y: 300, llegada: [775, 300],
  arte: `${respaldo('skins/Ambessa_0-fondo.jpg', 0.42)}
      ${vista('skins/Ambessa_0.jpg', 'Ambessa, pantalla de carga base', { ...COL, x: 70, cam: [0.5, 0.42, 1.06, 0.5, 0.36, 1.14] })}`,
  dato: `${texto('2', { x: 470, y: 36, w: 610, tam: 400 })}
      ${texto('AMBESSA', { x: 470, y: 452, w: 610, tam: 150, clase: 'crema', tracking: 12 })}` })));

// ── 2 · am-arcane ────────────────────────────────────────────────────────
slides.push(lamina('am-arcane', 'Sale en Arcane.', panel({ semilla: 'am-arcane', y: 470,
  arte: vista(splash('Mel_1'), 'Mel, Arcane: Concejal, splash', { ...SP, cam: [0.36, 0.5, 1, 0.62, 0.48, 1.06] }) })));

// ── 3 · am-t1 ────────────────────────────────────────────────────────────
slides.push(lamina('am-t1', 'Hoy juega T1 y Doran le dio su skin.', panel({ semilla: 'am-t1', y: 340, llegada: [330, 340],
  arte: `${vista(splash('Ambessa_8'), 'Ambessa T1, splash', { ...SP, cam: [0.6, 0.45, 1, 0.72, 0.4, 1.08] })}${veloIzq}`,
  dato: texto('DORAN', { x: 30, y: 225, w: 600, tam: 230, tracking: 14 }) })));

// ── 4 · am-doran ─────────────────────────────────────────────────────────
slides.push(lamina('am-doran', 'La sacó dos veces en el Mundial y ganó las dos.', panel({ semilla: 'am-doran', y: 420, llegada: [320, 420],
  arte: `${respaldo('skins/Ambessa_8-fondo.jpg', 0.42)}
      ${vista('skins/Ambessa_8.jpg', 'Ambessa T1, pantalla de carga', { ...COL, x: 640, cam: [0.5, 0.5, 1.06, 0.5, 0.44, 1.14] })}`,
  dato: `
      <div data-dato style="position: absolute; left: 220px; top: 56px; width: 200px;"><img src="assets/logos/T1.png" alt="Logo de T1" style="display: block; width: 200px; height: auto; filter: drop-shadow(0 8px 30px rgba(0,0,0,0.8));"></div>
      ${texto('2-0', { x: 20, y: 290, w: 600, tam: 300, tracking: 10 })}` })));

// ── 5 · am-kc ────────────────────────────────────────────────────────────
slides.push(lamina('am-kc', 'Hoy no es la excepción: les toca a los de Karmine.', panel({ semilla: 'am-kc', y: 380, llegada: [540, 380],
  arte: `${vista(splash('Ambessa_8'), 'Ambessa T1, splash oscurecido', { ...SP, cam: [0.5, 0.5, 1, 0.58, 0.46, 1.08], filtro: 'filter: blur(10px) brightness(0.32) saturate(1.1);' })}
      <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(45% 70% at 14% 50%, ${a(T1_ROJO, 0.3)}, ${a(T1_ROJO, 0)} 70%), radial-gradient(45% 70% at 86% 50%, ${a(KC_AZUL, 0.28)}, ${a(KC_AZUL, 0)} 70%);"></div>`,
  dato: `
      <div data-dato style="position: absolute; left: 40px; top: 210px; width: 230px;"><img src="assets/logos/T1.png" alt="Logo de T1" style="display: block; width: 230px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));"></div>
      <div data-dato style="position: absolute; left: 810px; top: 190px; width: 230px;"><img src="assets/logos/KC.png" alt="Logo de Karmine Corp" style="display: block; width: 230px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));"></div>
      <div data-dato style="position: absolute; left: 290px; top: 130px; width: 500px; box-sizing: border-box; text-align: center; font-size: 120px; line-height: 1; letter-spacing: 10px; padding-left: 10px; white-space: nowrap; text-shadow: 0 6px 30px rgba(10,5,6,0.9);"><span style="color: ${T1_ROJO};">T1</span> <span style="color: ${CREMA};">VS</span> <span style="color: ${KC_AZUL};">KC</span></div>
      ${texto('HOY', { x: 290, y: 290, w: 500, tam: 260, tracking: 18 })}` })));

// ── 6 · am-popular ───────────────────────────────────────────────────────
slides.push(lamina('am-popular', 'Se ha popularizado muchísimo en competitivo y en rankeds.', panel({ semilla: 'am-popular', y: 480,
  arte: vista(splash('Ambessa_0'), 'Ambessa, splash base', { ...SP, cam: [0.3, 0.5, 1, 0.46, 0.46, 1.05] }) })));

// ── 7 · am-ksante ────────────────────────────────────────────────────────
slides.push(lamina('am-ksante', 'Caso contrario a K\'Sante.', panel({ semilla: 'am-ksante', y: 480,
  arte: `${respaldo('skins/KSante_0-fondo.jpg', 0.45)}
      ${vista('skins/KSante_0.jpg', 'K\'Sante, pantalla de carga base', { ...CENTRO, cam: [0.5, 0.5, 1.06, 0.5, 0.44, 1.14] })}` })));

// ── 8 · am-ulti ──────────────────────────────────────────────────────────
slides.push(lamina('am-ulti', 'Es fácil esquivar su ulti.', panel({ semilla: 'am-ulti', y: 340, llegada: [540, 340],
  arte: vista(splash('Ambessa_0'), 'Ambessa, splash base desenfocado', { ...SP, cam: [0.5, 0.5, 1, 0.5, 0.5, 1.1], filtro: 'filter: blur(16px) brightness(0.45) saturate(1.1);' }),
  dato: `
      <div data-dato style="position: absolute; left: 350px; top: 150px; width: 380px; height: 380px;"><img src="assets/iconos/AmbessaR.png" alt="Ejecución Pública, la R de Ambessa" style="display: block; width: 380px; height: 380px; box-shadow: 0 0 90px ${a(ORO, 0.35)}, 0 24px 70px rgba(0,0,0,0.75);"></div>` })));

// ── 9 · am-lore ──────────────────────────────────────────────────────────
slides.push(lamina('am-lore', 'Pasemos con su lore.', panel({ semilla: 'am-lore', y: 470,
  arte: vista('centered/Ambessa_0.jpg', 'Ambessa, imagen centrada', { iw: 1280, ih: 720, cam: [0.5, 0.58, 1.12, 0.5, 0.4, 1.2] }) })));

// ── 10 · am-espadas ──────────────────────────────────────────────────────
slides.push(lamina('am-espadas', 'Recoger las espadas de los soldados muertos.', panel({ semilla: 'am-espadas', y: 470,
  arte: vista(splash('Ambessa_0'), 'Ambessa, splash base: las espadas', { ...SP, cam: [0.72, 0.55, 1.1, 0.8, 0.5, 1.22] }) })));

// ── 11 · am-general ──────────────────────────────────────────────────────
slides.push(lamina('am-general', 'Fue general bien joven.', panel({ semilla: 'am-general', y: 480,
  arte: `${respaldo('skins/Ambessa_1-fondo.jpg', 0.45)}
      ${vista('skins/Ambessa_1.jpg', 'Ambessa Elegida del Lobo, pantalla de carga', { ...CENTRO, cam: [0.5, 0.5, 1.06, 0.5, 0.44, 1.14] })}` })));

// ── 12 · am-mel ──────────────────────────────────────────────────────────
slides.push(lamina('am-mel', 'Embarazada de Mel.', panel({ semilla: 'am-mel', y: 480,
  arte: `${respaldo('skins/Mel_0-fondo.jpg', 0.45)}
      ${vista('skins/Mel_0.jpg', 'Mel, pantalla de carga base', { ...CENTRO, cam: [0.5, 0.5, 1.06, 0.5, 0.42, 1.14] })}` })));

// ── 13 · am-matriarca ────────────────────────────────────────────────────
// La pantalla de carga base cerrada en el rostro (otro recorte que la portada).
slides.push(lamina('am-matriarca', 'Se quedó como la jefa.', panel({ semilla: 'am-matriarca', y: 480,
  arte: `${respaldo('skins/Ambessa_0-fondo.jpg', 0.36)}
      ${vista('skins/Ambessa_0.jpg', 'Ambessa, pantalla de carga base: el rostro', { ...CENTRO, cam: [0.52, 0.3, 1.35, 0.52, 0.22, 1.5] })}` })));

// ── 14 · am-lobo ─────────────────────────────────────────────────────────
slides.push(lamina('am-lobo', 'Su lema es ser el Lobo en todo.', panel({ semilla: 'am-lobo', y: 470,
  arte: vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash', { ...SP, cam: [0.34, 0.5, 1, 0.62, 0.44, 1.06] }) })));

// ── 15 · am-piltover ─────────────────────────────────────────────────────
slides.push(lamina('am-piltover', 'Mandó a Mel a Piltóver.', panel({ semilla: 'am-piltover', y: 470,
  arte: vista(splash('Mel_0'), 'Mel, splash base', { ...SP, cam: [0.38, 0.5, 1, 0.58, 0.46, 1.05] }) })));

// ── 16 · am-caitlyn ──────────────────────────────────────────────────────
slides.push(lamina('am-caitlyn', 'Usó a Caitlyn como su títere.', panel({ semilla: 'am-caitlyn', y: 470,
  arte: vista(splash('Caitlyn_50'), 'Caitlyn Comandante, Arcane, splash', { ...SP, cam: [0.5, 0.46, 1, 0.56, 0.4, 1.1] }) })));

// ── 17 · am-leblanc ──────────────────────────────────────────────────────
slides.push(lamina('am-leblanc', 'La mató LeBlanc.', panel({ semilla: 'am-leblanc', y: 470,
  arte: vista(splash('Leblanc_0'), 'LeBlanc, splash base', { ...SP, cam: [0.4, 0.5, 1, 0.46, 0.45, 1.1] }) })));

// ── 18 · am-muerte ───────────────────────────────────────────────────────
// En la segunda mitad la imagen se apaga sobre sí misma (no hay velo negro encima).
slides.push(lamina('am-muerte', 'Murió en brazos de Mel.', panel({ semilla: 'am-muerte', y: 480,
  arte: `${respaldo('skins/Mel_1-fondo.jpg', 0.45, 'data-borroso')}
      ${vista('skins/Mel_1.jpg', 'Mel, Arcane: Concejal, pantalla de carga', { ...CENTRO, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1], filtro: 'filter: brightness(1);' })}` })));

// ── 19 · am-otp ──────────────────────────────────────────────────────────
slides.push(lamina('am-otp', 'Demon King of Noxus, con más de cuatro millones de puntos, en Platino 4.', panel({ semilla: 'am-otp', y: 330, llegada: [725, 330],
  arte: vista(splash('Ambessa_0'), 'Ambessa, splash base oscurecido', { ...SP, cam: [0.46, 0.5, 1, 0.52, 0.5, 1.08], filtro: 'filter: brightness(0.36);' }),
  dato: `
      <div data-dato style="position: absolute; left: 40px; top: 190px; width: 330px;"><img src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="display: block; width: 330px; height: auto; filter: drop-shadow(0 0 40px rgba(120,220,210,0.4)) drop-shadow(0 20px 36px rgba(0,0,0,0.65));"></div>
      ${texto('DEMONKINGOFNOXUS', { x: 390, y: 168, w: 670, tam: 90, clase: 'crema', tracking: 4 })}
      ${texto('4.245.731', { x: 390, y: 290, w: 670, tam: 170, tracking: 4 })}` })));

// ── 20 · am-seis ─────────────────────────────────────────────────────────
slides.push(lamina('am-seis', 'Este año solo la ha jugado seis veces.', panel({ semilla: 'am-seis', y: 330, llegada: [760, 330],
  arte: vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash oscurecido', { ...SP, cam: [0.6, 0.5, 1, 0.52, 0.5, 1.08], filtro: 'filter: blur(14px) brightness(0.3);' }),
  dato: `
      <div data-dato style="position: absolute; left: 60px; top: 176px; width: 380px;"><img src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="display: block; width: 380px; height: auto; filter: drop-shadow(0 0 46px rgba(120,220,210,0.4)) drop-shadow(0 20px 36px rgba(0,0,0,0.65));"></div>
      ${texto('6', { x: 470, y: 50, w: 580, tam: 320 })}
      ${texto('PARTIDAS', { x: 470, y: 390, w: 580, tam: 150, tracking: 8 })}` })));

// ── 21 · am-skins ────────────────────────────────────────────────────────
// El 2 a la izquierda y las dos pantallas de carga (Elegida del Lobo y T1) en columna.
slides.push(lamina('am-skins', 'De skins solo tiene dos.', panel({ semilla: 'am-skins', y: 340, llegada: [180, 340],
  arte: `${respaldo('skins/Ambessa_1-fondo.jpg', 0.4)}
      ${vista('skins/Ambessa_1.jpg', 'Ambessa Elegida del Lobo, pantalla de carga', { x: 350, y: 40, w: 340, h: 600, iw: 308, ih: 560, sombra: true, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1] })}
      ${vista('skins/Ambessa_8.jpg', 'Ambessa T1, pantalla de carga', { x: 710, y: 40, w: 340, h: 600, iw: 308, ih: 560, sombra: true, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1] })}`,
  dato: texto('2', { x: 20, y: 130, w: 320, tam: 420 }) })));

// ── 22 · am-legendaria ───────────────────────────────────────────────────
// Elegida del Lobo cerrada en el rostro (otro recorte que am-lobo).
slides.push(lamina('am-legendaria', 'Elegida del Lobo, la primera campeona en salir con una legendaria.', panel({ semilla: 'am-legendaria', y: 340, llegada: [410, 340],
  arte: `${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash: el rostro', { ...SP, cam: [0.7, 0.4, 1.12, 0.72, 0.3, 1.26] })}${veloIzq}`,
  dato: texto('LEGENDARIA', { x: 30, y: 260, w: 760, tam: 160, tracking: 6 }) })));

// ── 23 · am-cierre ───────────────────────────────────────────────────────
// Splash T1 cerrado sobre Ambessa (otro recorte que am-t1).
slides.push(lamina('am-cierre', 'Ni pedo, solo queda decir gigi easy.', panel({ semilla: 'am-cierre', y: 340, llegada: [350, 340],
  arte: `${vista(splash('Ambessa_8'), 'Ambessa T1, splash: el rostro', { ...SP, cam: [0.84, 0.32, 1.12, 0.8, 0.22, 1.3] })}${veloIzq}`,
  dato: texto('GG EZ', { x: 30, y: 190, w: 640, tam: 300, tracking: 8 }) })));

// ── 24 · am-reposo ───────────────────────────────────────────────────────
// La banda decorada sin dato: ReelForge la usa para llenar los huecos entre láminas.
slides.push(lamina('am-reposo', 'Reposo: la banda sin dato, para los huecos entre láminas.', panel({ semilla: 'am-reposo', y: 340,
  arte: vista('centered/Ambessa_0.jpg', 'Ambessa, imagen centrada oscurecida', { iw: 1280, ih: 720, cam: [0.5, 0.46, 1.14, 0.5, 0.42, 1.2], filtro: 'filter: brightness(0.34) saturate(0.9);' }) }), ' data-reposo'));

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return [].slice.call(s.querySelectorAll(sel)); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  var PW = ${PW}, PH = ${PH};
  var DUR = 2.5;                    // ninguna lámina pasa de aquí
  var EN = 0.15, DB = 1.25;         // la estela: arranca y cruza
  var X0 = -60, X1 = 1140;          // de fuera de cuadro a fuera de cuadro

  // Dónde va la estela en cada instante (power2.inOut) y su inversa, para que cada cosa
  // pase justo cuando la estela le llega encima.
  function inversa(y) { return y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt((1 - y) / 2); }
  function paso(x) { return EN + DB * inversa(Math.min(1, Math.max(0, (x - X0) / (X1 - X0)))); }

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo de cada imagen, de su encuadre inicial al final, en toda la lámina.
  function camara(tl, s) {
    q(s, '[data-cam]').forEach(function (img) {
      var v = img.parentNode, vw = +v.dataset.vw, vh = +v.dataset.vh, cw = +img.dataset.cw, ch = +img.dataset.ch;
      var c = img.dataset.cam.split(',').map(Number);
      var ini = encuadre(vw, vh, cw, ch, c[0], c[1], c[2]), fin = encuadre(vw, vh, cw, ch, c[3], c[4], c[5]);
      ini.transformOrigin = '0 0'; fin.transformOrigin = '0 0';
      fin.duration = DUR; fin.ease = 'power1.out'; fin.immediateRender = true;
      tl.fromTo(img, ini, fin, 0);
    });
  }

  // La entrada común: estela, sombra que se levanta, riel que late y, si hay dato, el dato.
  function entrada(tl, s) {
    var p = uno(s, '[data-panel]');
    efecto('cometa', tl, uno(p, '[data-barrido]'), { en: EN, dur: DB, ease: 'power2.inOut', radio: 7, color: '${ORO_CL}' });
    tl.fromTo(uno(p, '[data-camino]'), { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power1.in', immediateRender: false }, EN + DB * 0.6);

    // La sombra del arte se levanta detrás de la punta de la estela, con el borde difuminado.
    // En p = 0 cubre todo el panel y en p = 1 nada: el primer y el último cuadro no dependen de la máscara.
    var sombra = uno(p, '[data-sombra]'), est = { p: 0 };
    var pinta = function () {
      var x = X0 + (X1 - X0) * est.p;
      var m = 'linear-gradient(90deg, rgba(0,0,0,0) ' + (x - 60).toFixed(1) + 'px, #000 ' + (x + 20).toFixed(1) + 'px)';
      sombra.style.webkitMaskImage = m; sombra.style.maskImage = m;
    };
    tl.fromTo(est, { p: 0 }, { p: 1, duration: DB, ease: 'power2.inOut', immediateRender: true, onUpdate: pinta, onReverseComplete: pinta }, EN);
    pinta();

    // Cada destello del riel late al pasar la estela y vuelve exactamente a como estaba.
    q(p, '[data-brillo-riel]').forEach(function (b) {
      var op = +b.getAttribute('opacity'), org = b.dataset.x + ' ' + b.dataset.y;
      tl.fromTo(b, { scale: 1, opacity: op, svgOrigin: org }, { keyframes: [
        { scale: 1.9, opacity: 1, duration: 0.16, ease: 'power2.out' },
        { scale: 1, opacity: op, duration: 0.45, ease: 'power2.in' }], immediateRender: false }, paso(+b.dataset.x) - 0.08);
    });

    if (!p.dataset.llegada) return;
    var c = p.dataset.llegada.split(' ').map(Number), t = paso(c[0]);
    q(p, '[data-dato]').forEach(function (d, i) {
      tl.fromTo(d, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.55, ease: 'entrada', immediateRender: true }, t - 0.12 + i * 0.08);
    });
    var l = uno(p, '[data-luz]');
    // El destello se abre al llegar y se apaga: el estado final es el dato solo.
    if (l) { efecto('destello', tl, l, { en: t - 0.05, dur: 1.3 }); tl.to(l, { opacity: 0, duration: 0.6, ease: 'power1.in' }, t + 0.6); }
    efecto('chispas', tl, uno(p, '[data-chispas]'), { en: t, dur: 1, n: 34, fuerza: 620, subida: 120,
      origen: (100 * c[0] / PW).toFixed(1) + ' ' + (100 * c[1] / PH).toFixed(1), color: '#FFF1C2,${ORO_CL},${ORO}' });
  }

  function lamina(id, extra) {
    animar(id, function (tl, s) { camara(tl, s); entrada(tl, s); if (extra) extra(tl, s); });
  }
  ['am-portada', 'am-arcane', 'am-t1', 'am-doran', 'am-kc', 'am-popular', 'am-ksante', 'am-ulti', 'am-lore',
   'am-espadas', 'am-general', 'am-mel', 'am-matriarca', 'am-lobo', 'am-piltover', 'am-caitlyn', 'am-leblanc',
   'am-otp', 'am-seis', 'am-skins', 'am-legendaria', 'am-cierre', 'am-reposo'].forEach(function (id) { lamina(id); });
  // En la segunda mitad la imagen se apaga sobre sí misma, y su respaldo con ella.
  lamina('am-muerte', function (tl, s) {
    tl.fromTo(uno(s, '[data-cam]'), { filter: 'brightness(1)' }, { filter: 'brightness(0.22)', duration: 1.2, ease: 'power1.in', immediateRender: true }, 1.3);
    tl.fromTo(uno(s, '[data-borroso]'), { opacity: 1 }, { opacity: 0.22, duration: 1.2, ease: 'power1.in', immediateRender: true }, 1.3);
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
${kit.og({ titulo: 'Ambessa cumple 2 años', descripcion: 'Cumplelolero #31 en banda inferior: la parte de abajo del video es del deck, de borde a borde, con un riel común que une las láminas. Solo arte oficial.', carpeta: 'creator/ambessa' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .oro { background: linear-gradient(180deg, #FFF6D6 0%, ${ORO_CL} 34%, ${ORO} 68%, #7A5E1E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 26px rgba(14,8,6,0.85)); }
  .crema { color: ${CREMA}; text-shadow: 0 6px 30px rgba(14,8,6,0.9); }
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
<deck-stage width="1080" height="1920" data-recorte="${RECORTE}">
${slides.join('\n')}
</deck-stage>
${kit.gsap(__dirname)}
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
