// Generador de index.html — LeBlanc cumple 16 años (láminas para el montaje automático)
// Ejecutar: node creator/leblanc/gen.js   ·   clips: node tools/laminas.mjs creator/leblanc
//
// Serie «Cumplelolero» #30, mismo formato que lux, graves, elise, seraphine y
// ksante: cada lámina es un miniclip para el **panel de 1080×1370**
// (`crop=1080:1370:0:275`) que en el video final se escala a 706×896 abajo del
// gameplay. Sigue el paquete de Axl (`leblanc-paquete-presentacion.md`, 4/11/2026).
//
// 🎯 **Regla de este video: solo arte oficial, nada dibujado.** Cada lámina es
// una imagen de Riot (splash, pantalla de carga, carta de Legends of Runeterra,
// ícono de habilidad o emblema de rango) a pantalla completa o casi, y la única
// animación es **de cámara**: empuje lento o paneo sobre la imagen, y un fundido
// corto cuando algo entra (el dato, los íconos, la rejilla). Sin rebotes, sin
// armados pieza por pieza, sin contadores, sin partículas, sin SVG hechos a mano,
// sin chips, marcos ni bentos. El único texto es el dato: LEBLANC y 16, LEBLUNK y
// 7.591.836, ORO → PLATA, SPECTRVM y #12, 14, FAKER, ROOKIE, 2021 y GG EZ.
//
// Cada animación dura **2,8 s o menos** (en K'Sante varias se cortaron porque el
// guion no les daba tiempo) y ninguna arranca en negro: la imagen se ve desde el
// cuadro 0 y lo único que entra con fundido es el dato.
//
// Cámara: cada imagen vive dentro de un visor con `overflow: hidden` y se
// mueve con (x, y, escala) desde un encuadre (cx, cy, zoom) a otro; el zoom 1 es
// el de `object-fit: cover`. La geometría se calcula aquí para el estado final
// (el que ve el PNG) y en la página para el inicial, con el mismo recorte.
//
// De dónde sale cada imagen (links del paquete, todos con HTTP 200 al 4/11/2026):
//  · Data Dragon — pantallas de carga y splashes de LeBlanc, Mordekaiser, Swain y
//    Elise (`Elise_34`, copiada de `elise/`), pantallas de carga de K'Sante, Vex y
//    Seraphine, e íconos de habilidad (64 px, ampliados 4× con Lanczos).
//  · Legends of Runeterra (set4, es_mx, versión `-full`): `04NX004` LeBlanc,
//    `04NX008` Estratega Mordaz, `04NX006` Espía de la Rosa Negra y `04NX004T1`
//    Sello de la Maldad.
//  · Emblemas de Plata y Oro de CommunityDragon, recortados a su contenido.
//
// ⚠️ **El paquete dice 20 láminas pero lista 21** (tabla y marcas del guion):
// aquí van las 21.
// ⚠️ **Boram Darkwill no tiene arte oficial**: `lb-darkwill` usa la pantalla de
// carga de Swain, que entra en la misma frase. No se dibuja a Darkwill.
// ⚠️ **`04NX004` ya salió en elise (entera, con el centro de la mesa) y en swain
// (entera, camarilla)**: aquí va como **recorte vertical sobre LeBlanc**, con la
// cámara subiendo de la mesa a su rostro.
// ⚠️ **`04NX004T1` es un disco**: la carta trae esquinas negras, así que el visor
// es un círculo y el arte llena justo ese círculo.
// ⚠️ Sin el récord de LeBlanc en el Mundial y sin dinero en pantalla.
// ⚠️ «Siguen vivos en este Mundial»: Rookie sí (IG eliminó a TES el 3/11). Faker
// juega contra KC el viernes 6/11; si T1 pierde antes de publicar, hay que avisar
// a Axl para que cambie la frase (`lb-faker` no cambia).
//
// Las 21 láminas y la palabra del guion que dispara cada una están en
// `video-out/laminas/guion-marcado.txt`; cada <section> lleva su `data-lamina`.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
// Las copias desenfocadas, el lavado y la viñeta llevan data-fondo: en
// `laminas.mjs --alfa` se apagan y la lámina sale transparente sobre el gameplay.

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#120A14';        // negro violáceo
const ORO = '#D4AF37';       // dorado de su ropa y del emblema de la Rosa Negra
const ORO_CL = '#F4DC86';
const CARMESI = '#B3263A';   // solo acento: el lavado del fondo
const CREMA = '#F6EDDC';
const PLATA = '#C9D3DC';     // rango Plata
const PLATA_CL = '#F0F4F8';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const a = kit.alpha;
const PW = 1080, PH = 1370, PANEL_TOP = 275;

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${CREMA}; font-family: ${DISPLAY}; position: relative; overflow: hidden;`;

const borroso = (src, brillo = 0.45) => `
    <div data-fondo style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-borroso style="position: absolute; inset: -80px; background-image: url('assets/${src}'); background-size: cover; background-position: center; filter: blur(46px) saturate(1.15) brightness(${brillo});"></div>
    </div>`;

// Un lavado carmesí arriba y una viñeta: nunca un fondo plano.
const ambiente = (color = CARMESI, fuerza = 0.16) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(80% 45% at 50% 18%, ${a(color, fuerza)}, ${a(color, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(10,5,12,0.72) 100%);"></div>`;

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

const slides = [];

// ── 1 · lb-portada ───────────────────────────────────────────────────────
// Pantalla de carga base entera sobre su copia desenfocada. El 16 entra con fundido.
slides.push(lamina('lb-portada', 'El lunes también cumplió dieciséis años LeBlanc.', `
    ${borroso('skins/Leblanc_0.jpg', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Leblanc_0.jpg', 'LeBlanc, pantalla de carga base', { x: 163, w: 754, h: PH, iw: 308, ih: 560, cam: [0.5, 0.5, 1, 0.5, 0.43, 1.1] })}
      ${velo(660)}
      ${dato('16', { tam: 460, bottom: 214, attrs: 'data-dato' })}
      ${dato('LEBLANC', { tam: 200, bottom: 30, clase: 'crema', tracking: 12 })}`)}`));

// ── 2 · lb-kit ───────────────────────────────────────────────────────────
// Splash base con paneo lento y los íconos oficiales de W, E y R debajo, que
// entran juntos con fundido.
const ICON = 300, ICONGAP = 40, ICONX0 = (PW - (3 * ICON + 2 * ICONGAP)) / 2;
const icono = (arch, i) => `
      <img data-icono src="assets/iconos/${arch}.png" alt="Ícono de habilidad de LeBlanc" style="position: absolute; left: ${ICONX0 + i * (ICON + ICONGAP)}px; top: 1000px; width: ${ICON}px; height: ${ICON}px; border-radius: 18px; box-shadow: 0 0 50px ${a(ORO, 0.3)}, 0 24px 56px rgba(0,0,0,0.7);">`;
slides.push(lamina('lb-kit', 'Doble salto, cadenas y el combo con su clon.', `
    ${borroso('splash/Leblanc_0-fondo.jpg', 0.4)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Leblanc_0.jpg', 'LeBlanc, splash base', { h: 950, iw: 1215, ih: 717, cam: [0.38, 0.5, 1, 0.56, 0.5, 1.04], mascara: 'mask-image: linear-gradient(to bottom, #000 84%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #000 84%, transparent 100%);' })}
      ${['LeblancW', 'LeblancE', 'LeblancR'].map(icono).join('')}`)}`));

// ── 3 · lb-clon ──────────────────────────────────────────────────────────
// El ícono oficial de la pasiva, grande, sobre el splash base desenfocado.
slides.push(lamina('lb-clon', 'El clon cuando está a punto de morir.', `
    ${borroso('splash/Leblanc_0-fondo.jpg', 0.4)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Leblanc_0.jpg', 'LeBlanc, splash base desenfocado', { iw: 1215, ih: 717, cam: [0.5, 0.5, 1, 0.5, 0.5, 1.12], filtro: 'filter: blur(16px) brightness(0.5) saturate(1.1);' })}
      <img data-icono-p src="assets/iconos/LeblancP.png" alt="Imagen Especular, pasiva de LeBlanc" style="position: absolute; left: 260px; top: 405px; width: 560px; height: 560px; box-shadow: 0 0 90px ${a(ORO, 0.35)}, 0 30px 80px rgba(0,0,0,0.75); transform-origin: 50% 50%;">`)}`));

// ── 4 · lb-otp ───────────────────────────────────────────────────────────
// Splash base oscurecido con el emblema de Plata. El número entra con fundido.
slides.push(lamina('lb-otp', 'LeBlunK, de Europa, con más de siete millones y medio de puntos.', `
    ${borroso('splash/Leblanc_0-fondo.jpg', 0.35)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Leblanc_0.jpg', 'LeBlanc, splash base oscurecido', { iw: 1215, ih: 717, cam: [0.46, 0.5, 1, 0.52, 0.5, 1.1], filtro: 'filter: brightness(0.4);' })}
      ${dato('LEBLUNK', { tam: 200, top: 80, clase: 'crema', tracking: 12 })}
      ${dato('7.591.836', { tam: 215, top: 285, attrs: 'data-dato' })}
      <img data-emblema src="assets/emblemas/silver.png" alt="Emblema de Plata" style="position: absolute; left: 190px; top: 715px; width: 700px; height: auto; filter: drop-shadow(0 0 46px ${a(PLATA, 0.4)}) drop-shadow(0 24px 40px rgba(0,0,0,0.65)); transform-origin: 50% 50%;">`)}`));

// ── 5 · lb-plata ─────────────────────────────────────────────────────────
// Oro y Plata lado a lado; fundido cruzado de uno a otro.
slides.push(lamina('lb-plata', 'Hace una semana estaba en Oro y nunca ha pasado de Platino.', `
    ${borroso('splash/Leblanc_0-fondo.jpg', 0.35)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Leblanc_0.jpg', 'LeBlanc, splash base oscurecido', { iw: 1215, ih: 717, cam: [0.58, 0.5, 1, 0.42, 0.5, 1.08], filtro: 'filter: brightness(0.3);' })}
      <img data-oro src="assets/emblemas/gold.png" alt="Emblema de Oro" style="position: absolute; left: 36px; top: 380px; width: 414px; height: auto; filter: drop-shadow(0 0 46px ${a(ORO, 0.5)}) drop-shadow(0 24px 40px rgba(0,0,0,0.65));">
      <img data-plata src="assets/emblemas/silver.png" alt="Emblema de Plata" style="position: absolute; left: 500px; top: 380px; width: 547px; height: auto; filter: drop-shadow(0 0 46px ${a(PLATA, 0.45)}) drop-shadow(0 24px 40px rgba(0,0,0,0.65));">
      <div style="position: absolute; left: 0; right: 0; top: 890px; text-align: center; font-size: 200px; line-height: 1; letter-spacing: 8px;"><span data-t-oro class="oro">ORO</span> <span data-t-flecha class="crema" style="font-family: 'Noto Sans', 'Segoe UI Symbol', sans-serif; font-size: 140px; vertical-align: 10px;">→</span> <span data-t-plata class="plata">PLATA</span></div>`)}`));

// ── 6 · lb-latino ────────────────────────────────────────────────────────
// Emblema de Oro sobre el splash de Bosqueviejo desenfocado.
slides.push(lamina('lb-latino', 'El mejor latino se llama Spectrum, de Sudamérica, también en Oro.', `
    ${borroso('splash/Leblanc_5-fondo.jpg', 0.42)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Leblanc_5.jpg', 'LeBlanc Bosqueviejo, splash desenfocado', { iw: 1215, ih: 717, cam: [0.5, 0.5, 1, 0.56, 0.5, 1.1], filtro: 'filter: blur(16px) brightness(0.55) saturate(1.1);' })}
      ${dato('SPECTRVM', { tam: 200, top: 80, clase: 'crema', tracking: 12 })}
      ${dato('#12', { tam: 380, top: 270, attrs: 'data-dato' })}
      <img data-emblema src="assets/emblemas/gold.png" alt="Emblema de Oro" style="position: absolute; left: 270px; top: 800px; width: 540px; height: auto; filter: drop-shadow(0 0 46px ${a(ORO, 0.55)}) drop-shadow(0 24px 40px rgba(0,0,0,0.65)); transform-origin: 50% 50%;">`)}`));

// ── 7 · lb-nuevos ────────────────────────────────────────────────────────
// Pantallas de carga de K'Sante, Vex y Seraphine en tríptico, con paneo lateral.
const NUEVOS = ['KSante_0', 'Vex_0', 'Seraphine_0'];
slides.push(lamina('lb-nuevos', 'Los de personajes nuevos como K\'Sante, Vex o Seraphine tienden a estar en high elo.', `
    ${borroso('skins/Vex_0.jpg', 0.42)}
    ${ambiente()}
    ${panel(`
      ${NUEVOS.map((n, i) => vista(`skins/${n}.jpg`, `${n.split('_')[0]}, pantalla de carga`, { x: i * 360, y: 185, w: 360, h: 1000, iw: 308, ih: 560, cam: [0.4, 0.5, 1, 0.6, 0.5, 1] })).join('')}`)}`));

// ── 8 · lb-elise ─────────────────────────────────────────────────────────
slides.push(lamina('lb-elise', 'La Mujer Pálida de la Rosa Negra que le ofreció a Elise un lugar en su sociedad secreta.', `
    ${borroso('splash/Elise_34-fondo.jpg', 0.42)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Elise_34.jpg', 'Elise Baile de la Rosa Negra, splash', { iw: 1215, ih: 717, cam: [0.36, 0.5, 1, 0.62, 0.5, 1] })}`)}`));

// ── 9 · lb-rosa ──────────────────────────────────────────────────────────
// 04NX004 con otro recorte que elise y swain: vertical sobre LeBlanc, y la cámara
// sube de la mesa a su rostro.
slides.push(lamina('lb-rosa', 'LeBlanc es la dama de la Rosa Negra, un culto más viejo que Noxus.', `
    ${borroso('cartas/04NX004-fondo.jpg', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('cartas/04NX004.jpg', 'LeBlanc en la mesa de la Rosa Negra, carta de Legends of Runeterra', { iw: 2048, ih: 1024, cam: [0.5, 0.64, 1.3, 0.5, 0.36, 1.3] })}`)}`));

// ── 10 · lb-mordekaiser ──────────────────────────────────────────────────
slides.push(lamina('lb-mordekaiser', 'Hace siglos ayudó a las tribus bárbaras contra Mordekaiser.', `
    ${borroso('splash/Mordekaiser_0-fondo.jpg', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Mordekaiser_0.jpg', 'Mordekaiser, splash base', { iw: 1215, ih: 717, cam: [0.5, 0.5, 1, 0.52, 0.46, 1.12] })}`)}`));

// ── 11 · lb-consejera ────────────────────────────────────────────────────
slides.push(lamina('lb-consejera', 'Ha aconsejado en secreto a varias naciones al mismo tiempo.', `
    ${borroso('cartas/04NX008-fondo.jpg', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('cartas/04NX008.jpg', 'Estratega Mordaz, carta de Legends of Runeterra', { iw: 2048, ih: 1024, cam: [0.32, 0.5, 1, 0.6, 0.5, 1] })}`)}`));

// ── 12 · lb-darkwill ─────────────────────────────────────────────────────
// Boram Darkwill no tiene arte oficial: va la pantalla de carga de Swain.
slides.push(lamina('lb-darkwill', 'Cuando Boram Darkwill llegó al trono de Noxus no quiso a los asesores que ella le escogió.', `
    ${borroso('skins/Swain_0.jpg', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('skins/Swain_0.jpg', 'Swain, pantalla de carga base', { x: 163, w: 754, h: PH, iw: 308, ih: 560, cam: [0.5, 0.5, 1, 0.5, 0.44, 1.1] })}`)}`));

// ── 13 · lb-ejecucion ────────────────────────────────────────────────────
slides.push(lamina('lb-ejecucion', 'Se dejó ejecutar con los conspiradores, o al menos eso pareció.', `
    ${borroso('cartas/04NX006-fondo.jpg', 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista('cartas/04NX006.jpg', 'Espía de la Rosa Negra, carta de Legends of Runeterra', { iw: 2048, ih: 1024, cam: [0.5, 0.5, 1, 0.47, 0.46, 1.2] })}`)}`));

// ── 14 · lb-veneno ───────────────────────────────────────────────────────
// 04NX004T1 es un disco: el visor es un círculo del mismo ancho que el panel.
slides.push(lamina('lb-veneno', 'Le fue envenenando la mente mientras lo hacía más poderoso.', `
    ${borroso('cartas/04NX004T1-fondo.jpg', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('cartas/04NX004T1.jpg', 'Sello de la Maldad de LeBlanc, carta de Legends of Runeterra', { y: 145, w: 1080, h: 1080, iw: 1024, ih: 1024, radio: '50%', cam: [0.5, 0.5, 1, 0.5, 0.5, 1.12] })}`)}`));

// ── 15 · lb-swain ────────────────────────────────────────────────────────
// Paneo hacia arriba: de la capa de Swain a su rostro.
slides.push(lamina('lb-swain', 'Swain no cayó, derrocó a Darkwill y se quedó con Noxus.', `
    ${borroso('splash/Swain_0-fondo.jpg', 0.5)}
    ${ambiente()}
    ${panel(`
      ${vista('splash/Swain_0.jpg', 'Swain, splash base', { iw: 1215, ih: 717, cam: [0.6, 0.62, 1.2, 0.6, 0.38, 1.2] })}`)}`));

// ── 16 · lb-hermanas ─────────────────────────────────────────────────────
// Cuatro pantallas de carga de LeBlanc en fila: base, Bosqueviejo, Programa y Aquelarre.
const HERMANAS = [0, 5, 12, 20];
slides.push(lamina('lb-hermanas', 'Tiene hermanas, otras LeBlanc metidas en distintos reinos.', `
    ${borroso('skins/Leblanc_0.jpg', 0.45)}
    ${ambiente()}
    ${panel(`
      <div data-fila>
      ${HERMANAS.map((n, i) => vista(`skins/Leblanc_${n}.jpg`, `LeBlanc, pantalla de carga ${n}`, { x: i * 272, y: 185, w: 264, h: 1000, iw: 308, ih: 560, cam: [0.5, 0.5, 1, 0.5, 0.5, 1.08] })).join('')}
      </div>`)}`));

// ── 17 · lb-skins ────────────────────────────────────────────────────────
// Las 14 pantallas de carga (sin la clásica). Fundido de la rejilla completa.
const SKINS = [1, 2, 3, 4, 5, 12, 19, 20, 29, 33, 35, 45, 55, 59];
const TW = 193, TH = 350, TG = 6, GX = (PW - (5 * TW + 4 * TG)) / 2, GY = 296;
const casilla = (n, i) => {
  const fila = Math.floor(i / 5), col = i % 5, enFila = fila === 2 ? 4 : 5;
  const x0 = GX + (5 - enFila) * (TW + TG) / 2;
  return `<img src="assets/skins/Leblanc_${n}.jpg" alt="LeBlanc, pantalla de carga ${n}" style="position: absolute; left: ${x0 + col * (TW + TG)}px; top: ${GY + fila * (TH + TG)}px; width: ${TW}px; height: ${TH}px; display: block;">`;
};
slides.push(lamina('lb-skins', 'De skins tiene catorce.', `
    ${borroso('skins/Leblanc_0.jpg', 0.4)}
    ${ambiente()}
    ${panel(`
      <div data-rejilla style="position: absolute; inset: 0; transform-origin: 50% 50%;">
        ${dato('14', { tam: 290, top: -10 })}
        ${SKINS.map(casilla).join('\n        ')}
      </div>`)}`));

// ── 18-21 · splashes con su dato ─────────────────────────────────────────
const conDato = (id, notas, splash, alt, cam, texto, tam, extra = '') => lamina(id, notas, `
    ${borroso(`splash/${splash}-fondo.jpg`, 0.45)}
    ${ambiente()}
    ${panel(`
      ${vista(`splash/${splash}.jpg`, alt, { iw: 1215, ih: 717, cam })}
      ${velo(560)}
      ${dato(texto, { tam, bottom: 30, attrs: 'data-dato', tracking: extra ? 14 : 8 })}`)}`);

slides.push(conDato('lb-faker', 'La de Faker, por su Salón de la Leyenda.', 'Leblanc_55', 'LeBlanc Espíritu Legendario, splash', [0.52, 0.5, 1, 0.58, 0.46, 1.1], 'FAKER', 420, 'x'));
slides.push(conDato('lb-rookie', 'La de Invictus Gaming, que es de Rookie.', 'Leblanc_19', 'LeBlanc Invictus Gaming, splash', [0.5, 0.5, 1, 0.46, 0.46, 1.1], 'ROOKIE', 380, 'x'));
slides.push(conDato('lb-galante', 'La última que se puede comprar salió hace casi cinco años.', 'Leblanc_35', 'LeBlanc Galante, splash', [0.5, 0.5, 1, 0.58, 0.46, 1.1], '2021', 520));
slides.push(conDato('lb-cierre', 'Ni pedo, solo queda decir gigi easy.', 'Leblanc_59', 'LeBlanc Demonios Playeros Prestigiosa, splash', [0.55, 0.5, 1, 0.66, 0.46, 1.1], 'GG EZ', 440));

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
  // Empuje leve de un elemento sobre sí mismo (ícono, emblema).
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

  lamina('lb-portada', function (tl, s) { fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.7); });
  lamina('lb-kit', function (tl, s) { fundido(tl, null); q(s, '[data-icono]').forEach(function (i) { fundido(tl, i, 0, 0.6, 0.5); }); });
  lamina('lb-clon', function (tl, s) { empuje(tl, uno(s, '[data-icono-p]'), 1.07); });
  lamina('lb-otp', function (tl, s) {
    fundido(tl, uno(s, '[data-dato]'), 0, 0.7, 0.8);
    empuje(tl, uno(s, '[data-emblema]'), 1.06);
  });
  // Fundido cruzado de Oro a Plata.
  lamina('lb-plata', function (tl, s) {
    var oro = uno(s, '[data-oro]'), plata = uno(s, '[data-plata]'), tOro = uno(s, '[data-t-oro]'), tPlata = uno(s, '[data-t-plata]');
    tl.fromTo(oro, { opacity: 1 }, { opacity: 0.22, duration: 1.0, ease: 'power1.inOut', immediateRender: true }, 0.5)
      .fromTo(plata, { opacity: 0.22 }, { opacity: 1, duration: 1.0, ease: 'power1.inOut', immediateRender: true }, 0.5)
      .fromTo(tOro, { opacity: 1 }, { opacity: 0.3, duration: 1.0, ease: 'power1.inOut', immediateRender: true }, 0.5)
      .fromTo(tPlata, { opacity: 0.3 }, { opacity: 1, duration: 1.0, ease: 'power1.inOut', immediateRender: true }, 0.5);
  });
  lamina('lb-latino', function (tl, s) { empuje(tl, uno(s, '[data-emblema]'), 1.06); });
  lamina('lb-nuevos');
  lamina('lb-elise');
  lamina('lb-rosa');
  lamina('lb-mordekaiser');
  lamina('lb-consejera');
  lamina('lb-darkwill');
  lamina('lb-ejecucion');
  lamina('lb-veneno');
  lamina('lb-swain');
  // Las cuatro entran a la vez con fundido y se acercan apenas.
  lamina('lb-hermanas', function (tl, s) { fundido(tl, uno(s, '[data-fila]'), 0.5, 0.7, 0); });
  lamina('lb-skins', function (tl, s) {
    var r = uno(s, '[data-rejilla]');
    fundido(tl, r, 0.5, 0.8, 0);
    tl.fromTo(r, { scale: 1 }, { scale: 1.03, duration: DUR, ease: 'power1.out', immediateRender: true }, 0);
  });
  lamina('lb-faker');
  lamina('lb-rookie');
  lamina('lb-galante');
  lamina('lb-cierre');
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LeBlanc cumple 16 años</title>
${kit.og({ titulo: 'LeBlanc cumple 16 años', descripcion: 'Cumplelolero #30: el OTP número uno en Plata, la Rosa Negra y su traición a Darkwill, las hermanas del clon y las skins de Faker y Rookie. Solo arte oficial.', carpeta: 'creator/leblanc' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .oro { background: linear-gradient(180deg, #FFF8DA 0%, ${ORO_CL} 34%, ${ORO} 68%, #8A6B12 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 26px rgba(10,5,12,0.85)); }
  .plata { background: linear-gradient(180deg, #FFFFFF 0%, ${PLATA_CL} 34%, ${PLATA} 68%, #7A8794 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 26px rgba(10,5,12,0.85)); }
  .crema { color: ${CREMA}; text-shadow: 0 6px 30px rgba(10,5,12,0.9); }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(ORO, 0.5)}; border-radius: 999px;
    background: rgba(18,10,20,0.85); color: ${ORO_CL}; cursor: pointer;
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
