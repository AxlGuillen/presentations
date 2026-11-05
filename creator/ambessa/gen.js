// Generador de index.html — Ambessa cumple 2 años (láminas para el montaje automático)
// Ejecutar: node creator/ambessa/gen.js   ·   clips: node tools/laminas.mjs creator/ambessa
//
// Serie «Cumplelolero» #31, **mismo formato y misma regla que leblanc**: cada lámina
// es un miniclip para el **panel de 1080×1370** (`crop=1080:1370:0:275`) que en el
// video final se escala a 706×896 abajo del gameplay. Sigue el paquete de Axl
// (`ambessa-paquete-presentacion.md`, 5/11/2026): 23 láminas.
//
// 🎯 **Solo arte oficial, nada dibujado.** Cada lámina es un splash, una pantalla de
// carga, el ícono de la R, el emblema de Platino o el logo de T1 y de KC, a pantalla
// completa o casi. La única animación es **de cámara** (empuje o paneo con
// `power1.out`, 2,8 s como máximo) más un fundido corto cuando entra el dato. Sin
// rebotes, contadores, partículas, SVG a mano, chips ni marcos. El único texto es el
// dato: AMBESSA y 2, DORAN, 2-0, T1 VS KC y HOY, DEMONKINGOFNOXUS y 4.245.731,
// 6 PARTIDAS, 2, LEGENDARIA y GG EZ. Ninguna lámina arranca en negro.
//
// De dónde sale cada imagen (links del paquete, todos con HTTP 200 al 5/11/2026):
//  · Data Dragon — pantallas de carga y splashes de Ambessa (base, Elegida del Lobo y
//    T1), Mel (base y Arcane: Concejal Mel), Caitlyn Comandante (`Caitlyn_50`),
//    LeBlanc base, pantalla de carga de K'Sante y la imagen centrada de Ambessa.
//  · El ícono de la R (`AmbessaR`, 64 px, ampliado 4× con Lanczos).
//  · Emblema de Platino de CommunityDragon, recortado a su contenido.
//  · Logos de T1 y KC copiados de `suiza-qf/assets/logos/`.
// Todas cargaron: no se cambió ninguna imagen por otra.
//
// ⚠️ **Los splashes `Ambessa_0`, `_1` y `_8` salen varias veces** y cada vez con otro
// recorte: el base en la mitad izquierda (popular), en las espadas de la derecha
// (espadas) y oscurecido de fondo (ulti, otp); `_1` en el arma y el rostro (lobo) y en
// el rostro cerrado (legendaria); `_8` en Ambessa a la derecha (t1) y tan cerrado como
// da (cierre). Las pantallas de carga también: portada, matriarca (rostro).
// ⚠️ **No hay carta de Legends of Runeterra de Ambessa**: el lore va con sus splashes,
// los de Mel y las skins de Arcane. Sin el récord del Mundial (9-11), sin dinero y sin
// inventar a Menelik, a Kino ni a la familia Medarda.
// ⚠️ `am-kc` dice «HOY»: el video se publica el 6/11 antes del T1 vs KC (16:00 CDMX).
//
// ⚠️ **El paquete dice 24 láminas pero lista 23** (tabla y marcas del guion): aquí van las 23.
// Las 23 láminas y la palabra del guion que dispara cada una están en
// `video-out/laminas/guion-marcado.txt`; cada <section> lleva su `data-lamina`.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Las copias desenfocadas, el lavado y la viñeta llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#120C0A';        // negro cálido
const ORO = '#C9A24A';       // las placas de su armadura
const ORO_CL = '#EBD596';
const ROJO = '#A3202B';      // rojo noxiano: solo acento (el lavado del fondo)
const CREMA = '#F4EBDD';
const T1_ROJO = '#E2012D';
const KC_AZUL = '#2FB4FF';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 1370, PANEL_TOP = 275;

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${CREMA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

const borroso = (src, brillo = 0.45) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(46px) saturate(1.15) brightness(${brillo});"></div>
    </div>`;

// Un lavado rojo noxiano arriba y una viñeta: nunca un fondo plano.
const ambiente = (color = ROJO, fuerza = 0.2) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(80% 45% at 50% 18%, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(14,8,6,0.72) 100%);"></div>`;

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL_TOP}px; width: ${PW}px; height: ${PH}px;">${contenido}
    </div>`;

// Encuadre → traslación, sin pasarse de los bordes de la imagen.
function encuadre(vw, vh, cw, ch, cx, cy, z) {
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return {
    x: clamp(vw / 2 - cx * cw * z, vw - cw * z, 0),
    y: clamp(vh / 2 - cy * ch * z, vh - ch * z, 0),
    z,
  };
}

// Visor con una imagen oficial adentro y la cámara declarada en `cam`:
// [cx0, cy0, z0, cx1, cy1, z1] — centro normalizado (0–1) y zoom sobre `cover`.
function vista(src, alt, { x = 0, y = 0, w = PW, h = PH, iw, ih, cam, filtro = '', radio = '0', mascara = '', attrs = '' }) {
  const s = Math.max(w / iw, h / ih), cw = iw * s, ch = ih * s;
  const fin = encuadre(w, h, cw, ch, cam[3], cam[4], cam[5]);
  return `
      <div data-vista data-vw="${w}" data-vh="${h}" ${attrs} style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; overflow: hidden; border-radius: ${radio}; ${mascara}">
        <img data-cam="${cam.join(',')}" data-cw="${cw.toFixed(2)}" data-ch="${ch.toFixed(2)}" src="assets/${src}" alt="${alt}" style="position: absolute; left: 0; top: 0; width: ${cw.toFixed(2)}px; height: ${ch.toFixed(2)}px; max-width: none; transform-origin: 0 0; transform: translate(${fin.x.toFixed(2)}px, ${fin.y.toFixed(2)}px) scale(${fin.z}); display: block; ${filtro}">
      </div>`;
}

// Velo para que el dato se lea sobre el arte (no es un marco: sube desde abajo).
const velo = (alto = 620, fuerza = 0.92) => `
      <div style="position: absolute; left: 0; bottom: 0; width: ${PW}px; height: ${alto}px; background: linear-gradient(to bottom, ${a(BG, 0)}, ${a(BG, fuerza)} 72%); pointer-events: none;"></div>`;

const lamina = (id, notasOrador, cuerpo) => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notasOrador}" style="${SECCION}">${cuerpo}
  </section>`;

// Texto: solo el dato, grande, sin cejas ni remates.
const dato = (txt, { tam, clase = 'oro', top, bottom, tracking = 8, attrs = '' }) => `
      <div ${attrs} style="position: absolute; left: 0; right: 0; ${top !== undefined ? `top: ${top}px;` : ''} ${bottom !== undefined ? `bottom: ${bottom}px;` : ''} text-align: center; font-size: ${tam}px; line-height: 1; letter-spacing: ${tracking}px; padding-left: ${tracking}px;"><span class="${clase}">${txt}</span></div>`;

// Una imagen oficial sin más: splash (1215×717) o pantalla de carga (308×560).
const SP = { iw: 1215, ih: 717 };
const CARGA = { x: 163, w: 754, h: PH, iw: 308, ih: 560 };   // vertical, centrada en el panel
const splash = (n) => `splash/${n}.jpg`;
const fondoSp = (n, b) => borroso(`splash/${n}-fondo.jpg`, b);
const fondoCa = (n, b) => borroso(`skins/${n}-fondo.jpg`, b);

const slides = [];

// ── 1 · am-portada ───────────────────────────────────────────────────────
// Pantalla de carga base entera sobre su copia desenfocada. El 2 entra con fundido.
slides.push(lamina('am-portada', 'Hace dos años salió Ambessa.', `
    ${fondoCa('Ambessa_0', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Ambessa_0.jpg', 'Ambessa, pantalla de carga base', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.44, 1.16] })}
      ${velo(660)}
      ${dato('2', { tam: 460, bottom: 214, attrs: 'data-dato' })}
      ${dato('AMBESSA', { tam: 200, bottom: 30, clase: 'crema', tracking: 12 })}`)}`));

// ── 2 · am-arcane ────────────────────────────────────────────────────────
// Splash de Arcane: Concejal Mel; paneo lento de Mel a la figura de la derecha.
slides.push(lamina('am-arcane', 'Sale en Arcane.', `
    ${fondoSp('Mel_1', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Mel_1'), 'Mel, Arcane: Concejal, splash', { ...SP, cam: [0.4, 0.5, 1, 0.68, 0.5, 1] })}`)}`));

// ── 3 · am-t1 ────────────────────────────────────────────────────────────
// Splash T1; el empuje arranca en el centro del arte y se asienta sobre Ambessa.
slides.push(lamina('am-t1', 'Hoy juega T1 y Doran le dio su skin.', `
    ${fondoSp('Ambessa_8', 0.5)}
    ${ambiente(T1_ROJO, 0.16)}
    ${panel(`
      ${vista(splash('Ambessa_8'), 'Ambessa T1, splash', { ...SP, cam: [0.58, 0.5, 1, 0.7, 0.44, 1.06] })}
      ${velo(560)}
      ${dato('DORAN', { tam: 340, bottom: 30, attrs: 'data-dato', tracking: 14 })}`)}`));

// ── 4 · am-doran ─────────────────────────────────────────────────────────
// Pantalla de carga T1 con el logo de T1 arriba; el 2-0 entra con fundido.
slides.push(lamina('am-doran', 'La sacó dos veces en el Mundial y ganó las dos.', `
    ${fondoCa('Ambessa_8', 0.5)}
    ${ambiente(T1_ROJO, 0.16)}
    ${panel(`
      ${vista('skins/Ambessa_8.jpg', 'Ambessa T1, pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.45, 1.14] })}
      ${velo(640)}
      <img data-logo src="assets/logos/T1.png" alt="Logo de T1" style="position: absolute; left: 330px; top: 70px; width: 420px; height: auto; filter: drop-shadow(0 8px 30px rgba(0,0,0,0.8));">
      ${dato('2-0', { tam: 480, bottom: 40, attrs: 'data-dato', clase: 'oro', tracking: 10 })}`)}`));

// ── 5 · am-kc ────────────────────────────────────────────────────────────
// Los dos logos juntos sobre el splash T1 desenfocado y oscurecido.
slides.push(lamina('am-kc', 'Hoy no es la excepción: les toca a los de Karmine.', `
    ${fondoSp('Ambessa_8', 0.35)}
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 40% at 18% 40%, ${a(T1_ROJO, 0.28)}, ${a(T1_ROJO, 0)} 70%), radial-gradient(60% 40% at 82% 40%, ${a(KC_AZUL, 0.26)}, ${a(KC_AZUL, 0)} 70%);"></div>
    ${ambiente(ROJO, 0.08)}
    ${panel(`
      ${vista(splash('Ambessa_8'), 'Ambessa T1, splash oscurecido', { ...SP, cam: [0.5, 0.5, 1, 0.58, 0.46, 1.08], filtro: 'filter: blur(10px) brightness(0.32) saturate(1.1);' })}
      <div data-logos style="position: absolute; left: 0; top: 250px; width: ${PW}px; height: 520px;">
        <img src="assets/logos/T1.png" alt="Logo de T1" style="position: absolute; left: 60px; top: 150px; width: 450px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));">
        <img src="assets/logos/KC.png" alt="Logo de Karmine Corp" style="position: absolute; left: 600px; top: 40px; width: 420px; height: auto; filter: drop-shadow(0 10px 36px rgba(0,0,0,0.85));">
      </div>
      <div style="position: absolute; left: 0; right: 0; top: 800px; text-align: center; font-size: 210px; line-height: 1; letter-spacing: 12px; padding-left: 12px; text-shadow: 0 6px 30px rgba(10,5,6,0.9);"><span data-t style="color: ${T1_ROJO};">T1</span> <span data-t style="color: ${CREMA};">VS</span> <span data-t style="color: ${KC_AZUL};">KC</span></div>
      ${dato('HOY', { tam: 330, top: 1000, attrs: 'data-dato', tracking: 18 })}`)}`));

// ── 6 · am-popular ───────────────────────────────────────────────────────
slides.push(lamina('am-popular', 'Se ha popularizado muchísimo en competitivo y en rankeds.', `
    ${fondoSp('Ambessa_0', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_0'), 'Ambessa, splash base', { ...SP, cam: [0.3, 0.5, 1, 0.5, 0.46, 1] })}`)}`));

// ── 7 · am-ksante ────────────────────────────────────────────────────────
slides.push(lamina('am-ksante', 'Caso contrario a K\'Sante.', `
    ${fondoCa('KSante_0', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/KSante_0.jpg', 'K\'Sante, pantalla de carga base', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.45, 1.15] })}`)}`));

// ── 8 · am-ulti ──────────────────────────────────────────────────────────
// Ícono oficial de la R, Ejecución Pública, grande sobre el splash base desenfocado.
slides.push(lamina('am-ulti', 'Es fácil esquivar su ulti.', `
    ${fondoSp('Ambessa_0', 0.4)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_0'), 'Ambessa, splash base desenfocado', { ...SP, cam: [0.5, 0.5, 1, 0.5, 0.5, 1.12], filtro: 'filter: blur(16px) brightness(0.5) saturate(1.1);' })}
      <img data-icono src="assets/iconos/AmbessaR.png" alt="Ejecución Pública, la R de Ambessa" style="position: absolute; left: 270px; top: 465px; width: 540px; height: 540px; box-shadow: 0 0 100px ${a(ORO, 0.35)}, 0 30px 80px rgba(0,0,0,0.75); transform-origin: 50% 50%;">`)}`));

// ── 9 · am-lore ──────────────────────────────────────────────────────────
// Imagen centrada; la cámara sube de los pies al rostro.
slides.push(lamina('am-lore', 'Pasemos con su lore.', `
    ${borroso('centered/Ambessa_0-fondo.jpg', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('centered/Ambessa_0.jpg', 'Ambessa, imagen centrada', { iw: 1280, ih: 720, cam: [0.5, 0.6, 1.2, 0.5, 0.4, 1.2] })}`)}`));

// ── 10 · am-espadas ──────────────────────────────────────────────────────
// Las espadas de la derecha del splash base.
slides.push(lamina('am-espadas', 'Recoger las espadas de los soldados muertos.', `
    ${fondoSp('Ambessa_0', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_0'), 'Ambessa, splash base: las espadas', { ...SP, cam: [0.7, 0.55, 1.05, 0.78, 0.5, 1.16] })}`)}`));

// ── 11 · am-general ──────────────────────────────────────────────────────
slides.push(lamina('am-general', 'Fue general bien joven.', `
    ${fondoCa('Ambessa_1', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Ambessa_1.jpg', 'Ambessa Elegida del Lobo, pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.45, 1.15] })}`)}`));

// ── 12 · am-mel ──────────────────────────────────────────────────────────
slides.push(lamina('am-mel', 'Embarazada de Mel.', `
    ${fondoCa('Mel_0', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Mel_0.jpg', 'Mel, pantalla de carga base', { ...CARGA, cam: [0.5, 0.5, 1.06, 0.5, 0.44, 1.15] })}`)}`));

// ── 13 · am-matriarca ────────────────────────────────────────────────────
// Pantalla de carga base cerrada en el rostro (otro recorte que la portada).
slides.push(lamina('am-matriarca', 'Se quedó como la jefa.', `
    ${fondoCa('Ambessa_0', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Ambessa_0.jpg', 'Ambessa, pantalla de carga base: el rostro', { ...CARGA, cam: [0.52, 0.34, 1.28, 0.52, 0.22, 1.42] })}`)}`));

// ── 14 · am-lobo ─────────────────────────────────────────────────────────
// Splash Elegida del Lobo; paneo del arma al rostro.
slides.push(lamina('am-lobo', 'Su lema es ser el Lobo en todo.', `
    ${fondoSp('Ambessa_1', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash', { ...SP, cam: [0.34, 0.5, 1, 0.66, 0.44, 1] })}`)}`));

// ── 15 · am-piltover ─────────────────────────────────────────────────────
slides.push(lamina('am-piltover', 'Mandó a Mel a Piltóver.', `
    ${fondoSp('Mel_0', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Mel_0'), 'Mel, splash base', { ...SP, cam: [0.4, 0.5, 1, 0.6, 0.46, 1] })}`)}`));

// ── 16 · am-caitlyn ──────────────────────────────────────────────────────
slides.push(lamina('am-caitlyn', 'Usó a Caitlyn como su títere.', `
    ${fondoSp('Caitlyn_50', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Caitlyn_50'), 'Caitlyn Comandante, Arcane, splash', { ...SP, cam: [0.5, 0.46, 1, 0.56, 0.4, 1.1] })}`)}`));

// ── 17 · am-leblanc ──────────────────────────────────────────────────────
slides.push(lamina('am-leblanc', 'La mató LeBlanc.', `
    ${fondoSp('Leblanc_0', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Leblanc_0'), 'LeBlanc, splash base', { ...SP, cam: [0.4, 0.5, 1, 0.45, 0.45, 1.1] })}`)}`));

// ── 18 · am-muerte ───────────────────────────────────────────────────────
// Empuje muy lento sobre Mel y fundido a oscuro al final: la imagen se apaga sobre
// sí misma (no hay un velo negro encima, para que el alfa siga limpio).
slides.push(lamina('am-muerte', 'Murió en brazos de Mel.', `
    ${fondoCa('Mel_1', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Mel_1.jpg', 'Mel, Arcane: Concejal, pantalla de carga', { ...CARGA, cam: [0.5, 0.5, 1.04, 0.5, 0.47, 1.1], filtro: 'filter: brightness(1);' })}`)}`));

// ── 19 · am-otp ──────────────────────────────────────────────────────────
// Splash base oscurecido con el emblema de Platino. El número entra con fundido.
slides.push(lamina('am-otp', 'Demon King of Noxus, con más de cuatro millones de puntos, en Platino 4.', `
    ${fondoSp('Ambessa_0', 0.35)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_0'), 'Ambessa, splash base oscurecido', { ...SP, cam: [0.46, 0.5, 1, 0.52, 0.5, 1.1], filtro: 'filter: brightness(0.4);' })}
      ${dato('DEMONKINGOFNOXUS', { tam: 132, top: 90, clase: 'crema', tracking: 8 })}
      ${dato('4.245.731', { tam: 232, top: 270, attrs: 'data-dato' })}
      <img data-emblema src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="position: absolute; left: 210px; top: 700px; width: 660px; height: auto; filter: drop-shadow(0 0 46px rgba(120,220,210,0.4)) drop-shadow(0 24px 40px rgba(0,0,0,0.65)); transform-origin: 50% 50%;">`)}`));

// ── 20 · am-seis ─────────────────────────────────────────────────────────
// El emblema de Platino solo, más grande y sobre el splash Elegida del Lobo oscurecido.
slides.push(lamina('am-seis', 'Este año solo la ha jugado seis veces.', `
    ${fondoSp('Ambessa_1', 0.3)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash oscurecido', { ...SP, cam: [0.6, 0.5, 1, 0.52, 0.5, 1.08], filtro: 'filter: blur(14px) brightness(0.3);' })}
      <img data-emblema src="assets/emblemas/platinum.png" alt="Emblema de Platino" style="position: absolute; left: 130px; top: 130px; width: 820px; height: auto; filter: drop-shadow(0 0 56px rgba(120,220,210,0.4)) drop-shadow(0 24px 40px rgba(0,0,0,0.65)); transform-origin: 50% 50%;">
      ${dato('6 PARTIDAS', { tam: 250, bottom: 70, attrs: 'data-dato', tracking: 10 })}`)}`));

// ── 21 · am-skins ────────────────────────────────────────────────────────
// Las dos pantallas de carga (Elegida del Lobo y T1) lado a lado; fundido de las dos.
slides.push(lamina('am-skins', 'De skins solo tiene dos.', `
    ${fondoCa('Ambessa_1', 0.4)}
    ${ambiente()}
    ${panel(`
      ${dato('2', { tam: 340, top: -20 })}
      <div data-fila>
      ${vista('skins/Ambessa_1.jpg', 'Ambessa Elegida del Lobo, pantalla de carga', { x: 25, y: 340, w: 505, h: 920, iw: 308, ih: 560, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1] })}
      ${vista('skins/Ambessa_8.jpg', 'Ambessa T1, pantalla de carga', { x: 550, y: 340, w: 505, h: 920, iw: 308, ih: 560, cam: [0.5, 0.5, 1.04, 0.5, 0.46, 1.1] })}
      </div>`)}`));

// ── 22 · am-legendaria ───────────────────────────────────────────────────
// Elegida del Lobo cerrada en el rostro (otro recorte que am-lobo).
slides.push(lamina('am-legendaria', 'Elegida del Lobo, la primera campeona en salir con una legendaria.', `
    ${fondoSp('Ambessa_1', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(splash('Ambessa_1'), 'Ambessa Elegida del Lobo, splash: el rostro', { ...SP, cam: [0.7, 0.4, 1.12, 0.72, 0.3, 1.26] })}
      ${velo(560)}
      ${dato('LEGENDARIA', { tam: 230, bottom: 40, attrs: 'data-dato', tracking: 8 })}`)}`));

// ── 23 · am-cierre ───────────────────────────────────────────────────────
// Splash T1 cerrado sobre Ambessa (otro recorte que am-t1).
slides.push(lamina('am-cierre', 'Ni pedo, solo queda decir gigi easy.', `
    ${fondoSp('Ambessa_8', 0.5)}
    ${ambiente(T1_ROJO, 0.14)}
    ${panel(`
      ${vista(splash('Ambessa_8'), 'Ambessa T1, splash: el rostro', { ...SP, cam: [0.84, 0.32, 1.12, 0.8, 0.22, 1.3] })}
      ${velo(560)}
      ${dato('GG EZ', { tam: 440, bottom: 30, attrs: 'data-dato', tracking: 8 })}`)}`));

// ── Coreografías GSAP: cámara y fundidos cortos ──────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var DUR = 2.8;   // ninguna animación pasa de aquí

  function encuadre(vw, vh, cw, ch, cx, cy, z) {
    var cl = function (v, mn, mx) { return Math.min(mx, Math.max(mn, v)); };
    return { x: cl(vw / 2 - cx * cw * z, vw - cw * z, 0), y: cl(vh / 2 - cy * ch * z, vh - ch * z, 0), scale: z };
  }
  // Empuje o paneo: cada imagen pasa de su encuadre inicial al final.
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
  // Empuje leve de un elemento sobre sí mismo (ícono, emblema, logos).
  function empuje(tl, el, hasta) {
    if (el) tl.fromTo(el, { scale: 1 }, { scale: hasta || 1.07, duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  }
  function fundido(tl, el, desde, dur, en) {
    if (el) tl.fromTo(el, { opacity: desde }, { opacity: 1, duration: dur || 0.6, ease: 'power1.out', immediateRender: true }, en || 0);
  }
  function lamina(id, extra) {
    animar(id, function (tl, s) { camara(tl, s); if (extra) extra(tl, s); });
  }
  var uno = function (s, sel) { return s.querySelector(sel); };

  lamina('am-portada', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.7); });
  lamina('am-arcane');
  lamina('am-t1', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.6, 0.6); });
  lamina('am-doran', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.7); });
  // Los dos logos y el cruce entran juntos con fundido y se acercan apenas.
  lamina('am-kc', function (tl, s) {
    fundido(tl, uno(s, '[data-logos]'), 0.3, 0.7, 0);
    empuje(tl, uno(s, '[data-logos]'), 1.05);
    q(s, '[data-t]').forEach(function (t) { fundido(tl, t, 0.3, 0.7, 0.2); });
    fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.8);
  });
  lamina('am-popular');
  lamina('am-ksante');
  lamina('am-ulti', function (tl, s) { empuje(tl, uno(s, '[data-icono]'), 1.07); });
  lamina('am-lore');
  lamina('am-espadas');
  lamina('am-general');
  lamina('am-mel');
  lamina('am-matriarca');
  lamina('am-lobo');
  lamina('am-piltover');
  lamina('am-caitlyn');
  lamina('am-leblanc');
  // Empuje muy lento y, en la segunda mitad, la imagen se apaga sobre sí misma.
  lamina('am-muerte', function (tl, s) {
    var img = uno(s, '[data-cam]'), fondo = uno(s, '[data-borroso]');
    tl.fromTo(img, { filter: 'brightness(1)' }, { filter: 'brightness(0.22)', duration: 1.3, ease: 'power1.in', immediateRender: true }, 1.5);
    tl.fromTo(fondo, { opacity: 1 }, { opacity: 0.22, duration: 1.3, ease: 'power1.in', immediateRender: true }, 1.5);
  });
  lamina('am-otp', function (tl, s) {
    fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.8);
    empuje(tl, uno(s, '[data-emblema]'), 1.06);
  });
  lamina('am-seis', function (tl, s) {
    empuje(tl, uno(s, '[data-emblema]'), 1.07);
    fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.7);
  });
  // Las dos entran a la vez con fundido y se acercan apenas.
  lamina('am-skins', function (tl, s) { fundido(tl, uno(s, '[data-fila]'), 0.5, 0.7, 0); });
  lamina('am-legendaria', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.6, 0.6); });
  lamina('am-cierre', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.6, 0.6); });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ambessa cumple 2 años</title>
${kit.og({ titulo: 'Ambessa cumple 2 años', descripcion: 'Cumplelolero #31: la Skin T1 de Doran antes del T1 vs KC, el lore de la matriarca de los Medarda, el OTP de Platino 4 con más de cuatro millones de puntos y sus dos skins. Solo arte oficial.', carpeta: 'creator/ambessa' })}
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
<deck-stage width="1080" height="1920">
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
