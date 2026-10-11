// Generador de index.html — Jinx cumple 13 años (screenshots para TikTok)
// Ejecutar: node jinx/gen.js
//
// Serie «Cumplelolero» #24, animado. **Encargo nuevo y más estricto que el de
// xerath: solo assets visuales.** Axl pidió dejar de adornar o saturar las
// láminas con texto, así que aquí no hay cejas, chips, citas ni remates: cada
// lámina es arte oficial a pantalla para cortar encima de la voz. El único
// texto que queda es el que ES el dato: el nombre en la portada, la cifra del
// OTP, el 0 contra el 16–0 de Olaf y el «gigi easy» del cierre.
//
// El guion cuenta la historia de **Arcane**, no la del juego, y no hay Arcane
// en Legends of Runeterra (sets 1–9). Todo sale de la **wiki oficial**:
//  · Carteles verticales de la serie (`Jinx_Arcane_S1_Promo_01`, `Silco_Arcane_
//    S1_Promo_01`, `Jinx_Arcane_S2_Promo_01`, `Jinx_Arcane_S1_Promo_03`): ya
//    vienen en vertical, que es justo el formato.
//  · Miniaturas oficiales de episodio: **1x01** (Vander cargando a Vi y a
//    Powder) y **1x03** (Powder llorando con la mano de Vi en la cara, el
//    capítulo del «jinx»).
//  · El retrato de la familia en sepia (*Claggor Mylo Powder Vander Violet
//    JFE Portrait*), Powder niña (su splash de TFT), Cassandra Kiramman, Isha y
//    Vander convertido en Warwick.
//  · Splashes y retratos de carga de Data Dragon; Arcane: Jinx Quebrantada en
//    HD y sus dos formas (Menace y Tinkerer) de la wiki.
//
// ⚠️ La frase del lore «nadie sabe qué le pasó» está verificada en la biografía
// es-MX: «Nadie sabe con certeza qué sucedió para que esa dulce niñita se
// transformara…». Título oficial: **la Bala Perdida**.
// ⚠️ **Cumplió AYER** (10/10/2013): el video es del domingo 11.
// ⚠️ El conteo de skins y el precio **no van en pantalla**: la lámina de skins
// es la rejilla de las ocho comprables sin rótulos, y la de Quebrantada solo
// arte (lo del Sanctum lo dice la voz; su precio en dinero está sin verificar).
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Jinx: rosa de grafiti y azul de su pelo ───────────────────────
// Casi no hay texto, así que la paleta trabaja poco: el fondo y los halos. Rosa
// de los grafitis de Arcane de acento y el azul de su pelo de apoyo, sobre un
// negro violáceo de Zaun.
const BG = '#0A0710';        // Zaun de noche
const ROSA = '#FF4FA8';      // grafiti — acento
const AZUL = '#5BC8F5';      // su pelo
const BONE = '#F3EEF5';
const MUTED = '#8A8094';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = () =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; align-items: center; text-align: center;`;

// Copia desenfocada del mismo arte a todo el lienzo (archivo aparte de 360 px).
const fondo = (src) => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src.replace('.jpg', '-fondo.jpg')}'); background-size: cover; background-position: center; filter: blur(46px) saturate(1.1) brightness(0.42);"></div>
    </div>`;

// Arte apaisado de borde a borde (sale de la banda segura por los lados a
// propósito, como en helia: la banda protege texto, no imágenes).
const banda = (src, alt, alto = 760, pos = 'center') => `
      <div data-arte style="position: relative; width: calc(100% + 168px); margin: 0 -84px; height: ${alto}px; overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.6);">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">
      </div>`;

// Cartel vertical entero.
const poster = (src, alt, alto = 1250) => `
      <div data-arte style="height: ${alto}px; border-radius: 18px; overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.65);">
        <img src="assets/${src}" alt="${alt}" style="height: 100%; width: auto; display: block;">
      </div>`;

const lamina = ({ label, screen, notas, src, contenido }) => `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${fondo(src)}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${contenido}
    </div>
  </section>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// La ilustración de su página de Universe, a sangre. El único texto del deck
// además de los datos.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Buen domingo. Y el sabado fue cumpleanos de uno de los mejores personajes de Arcane. Jinx cumplio trece anos." style="${seccion()} justify-content: flex-end;">
    <div style="position: absolute; inset: 0; overflow: hidden;">
      <img data-portada src="assets/portada.jpg" alt="Jinx con Fishbones al atardecer, ilustración oficial" style="width: 100%; height: 100%; object-fit: cover; object-position: 74% center; display: block;">
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,7,16,0) 40%, rgba(10,7,16,0.55) 66%, rgba(10,7,16,0.95) 100%);"></div>
    </div>
    <h1 style="position: relative; margin: 0; font-family: ${DISPLAY}; font-weight: 400; line-height: 0.82; color: ${BONE}; text-shadow: 0 4px 30px rgba(10,7,16,0.8);"><span data-linea style="display: block; font-size: 250px; letter-spacing: 4px;">JINX</span><span data-linea style="display: block; font-size: 170px; color: ${ROSA};">13 AÑOS</span></h1>
  </section>`);

// ── 2 · Arcane ───────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Arcane', screen: '02 · Uno de los mejores personajes de Arcane',
  notas: 'La loquita que atrae la desvivicion para sus seres queridos. Uno de los personajes con la historia mas triste y sin duda con la peor suerte en toda Runaterra.',
  src: 'poster-jinx.jpg', contenido: poster('poster-jinx.jpg', 'Cartel oficial de Jinx, Arcane temporada 1'),
}));

// ── 3 · En el juego ──────────────────────────────────────────────────────
slides.push(lamina({
  label: 'El juego', screen: '03 · En el juego, adecé',
  notas: 'La que corre como ratera en cuanto consigue una kill y que ahorita es una de las adeces mas fuertes del juego.',
  src: 'Jinx_0.jpg', contenido: banda('Jinx_0.jpg', 'Jinx, splash original', 900, '62% center'),
}));

// ── 4 · La niña ──────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Powder', screen: '04 · Lore · nadie sabe qué le pasó',
  notas: 'Y lo chistoso es que en el lore del juego Riot nomas dice que nadie sabe que le paso a esa nina dulce de Zaun para volverse asi. Y luego hicieron Arcane para contarnoslo con todo y traumas.',
  src: 'powder.jpg', contenido: banda('powder.jpg', 'Powder de niña con su bomba, ilustración oficial', 900, '58% center'),
}));

// ── 5 · Vander ───────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Vander', screen: '05 · Arcane · la adoptó Vander',
  notas: 'Porque wachen la lista de gente que la quiso. Se quedo huerfana desde chiquita y la adopto Vander junto con su hermana Vi.',
  src: 'vander.jpg', contenido: banda('vander.jpg', 'Vander cargando a Vi y a Powder, Arcane episodio 1', 900, '52% center'),
}));

// ── 6 · La familia ───────────────────────────────────────────────────────
// En sepia de origen: es el retrato de los que se lleva la bomba.
slides.push(lamina({
  label: 'La familia', screen: '06 · Arcane · la bomba',
  notas: 'Luego quiso ayudar a rescatar a Vander con una bomba que hizo con un cristal hextech robado. Y por primera vez en su vida un invento le salio bien y se llevo a Mylo y a Claggor y dejo a Vander muriendose.',
  src: 'familia.jpg', contenido: banda('familia.jpg', 'Retrato de Vander, Vi, Powder, Mylo y Claggor', 900, '50% center'),
}));

// ── 7 · Jinx ─────────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'El grito', screen: '07 · Arcane · le gritó jinx',
  notas: 'Y ahi su propia hermana le grito que era una jinx o sea una salada. Y la dejo tirada.',
  src: 'jinx-grito.jpg', contenido: banda('jinx-grito.jpg', 'Powder llorando, Arcane episodio 3', 900, '46% center'),
}));

// ── 8 · El nombre ────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'El nombre', screen: '08 · Su nombre es el insulto',
  notas: 'Asi que su nombre literalmente es el insulto que le grito su hermana el peor dia de su vida. Imaginense presentarse asi en cada partida.',
  src: 'enemiga.jpg', contenido: banda('enemiga.jpg', 'Arcane: Jinx Enemiga', 900, '58% center'),
}));

// ── 9 · Silco ────────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Silco', screen: '09 · Arcane · Silco',
  notas: 'Luego la adopto Silco el villano y la crio como su hija. Y al final de la primera temporada ella misma le metio plomo. Y el wey todavia le dijo que siempre la considero su hija.',
  src: 'poster-silco.jpg', contenido: poster('poster-silco.jpg', 'Cartel oficial de Silco, Arcane temporada 1'),
}));

// ── 10 · Cassandra ───────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Cassandra', screen: '10 · Arcane · el cohete al consejo',
  notas: 'Y de pilon le avento un cohete al consejo de Piltover y ahi se murio la mama de Caitlyn. La novia de su hermana. Nomas para fortalecer la relacion familiar.',
  src: 'cassandra.jpg', contenido: banda('cassandra.jpg', 'Cassandra Kiramman, la mamá de Caitlyn', 900, '50% 30%'),
}));

// ── 11 · Isha ────────────────────────────────────────────────────────────
// Warwick arriba y la niña abajo, encimada: es la escena.
slides.push(lamina({
  label: 'Isha', screen: '11 · Arcane · Isha contra Warwick',
  notas: 'Y en uno de mis traumas cinematograficos mas pasados de pincel Isha la nina que adopto en la segunda temporada se sacrifica contra Warwick que era Vander para salvar a Jinx en una escena que es simplemente cine.',
  src: 'warwick.jpg', contenido: `
      ${banda('warwick.jpg', 'Vander convertido en Warwick', 640, '50% center')}
      <img data-isha src="assets/isha.jpg" alt="Isha" style="margin-top: -150px; position: relative; width: 470px; height: 470px; border-radius: 50%; object-fit: cover; object-position: 50% 30%; border: 4px solid ${AZUL}; box-shadow: 0 0 90px ${AZUL}59; display: block;">`,
}));

// ── 12 · El final ────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'El final', screen: '12 · Arcane · se sacrificó',
  notas: 'Basicamente toda su historia se resume en que perra mala suerte tiene. Y para terminar la serie se sacrifico pero todos sabemos que sigue con vida y esperemos que salga en la siguiente serie.',
  src: 'poster-final.jpg', contenido: poster('poster-final.jpg', 'Cartel oficial de Jinx, Arcane temporada 2', 1130),
}));

// ── 13 · El OTP ──────────────────────────────────────────────────────────
// El dato es la imagen: trece millones y medio junto a un Hierro.
slides.push(lamina({
  label: 'El OTP', screen: '13 · El OTP · Hierro 1',
  notas: 'Ahora el one trick pony con mas puntos. Es un norteamericano con trece millones y medio de puntos de Jinx y esta en Hierro uno.',
  src: 'Jinx_0.jpg', contenido: `
      <div data-cifra data-cuenta="13637663" style="font-family: ${DISPLAY}; font-size: 190px; line-height: 0.84; color: ${BONE};">13 637 663</div>
      <img data-emblema src="assets/emblems/iron.png" alt="Hierro" style="margin-top: 70px; width: 600px; height: auto; display: block; filter: drop-shadow(0 0 70px rgba(255,79,168,0.3));">
      <div data-rango style="margin-top: 20px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.9; color: ${ROSA};">HIERRO 1</div>`,
}));

// ── 14 · Olaf ────────────────────────────────────────────────────────────
// Jinx apagada con su 0; Olaf a color con su 16–0.
slides.push(lamina({
  label: 'Olaf', screen: '14 · El OTP · ahora juega Olaf',
  notas: 'Y wachen esto. Esta temporada no ha jugado ni una sola partida con ella. Ahorita juega Olaf y va dieciseis a cero. Veinticuatro ganadas y cinco perdidas lo cual apesta a eloboost pero no quiero senalar a nadie. Ustedes que opinan, huele a mierda o no?',
  src: 'Jinx_0.jpg', contenido: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; width: 100%;">
        <div data-carta>
          <img src="assets/Jinx-carga.jpg" alt="Jinx" style="width: 100%; height: auto; display: block; border-radius: 16px; filter: grayscale(1) brightness(0.5); border: 2px solid ${MUTED}66; box-sizing: border-box;">
          <div style="margin-top: 18px; font-family: ${DISPLAY}; font-size: 170px; line-height: 0.9; color: ${MUTED};">0</div>
        </div>
        <div data-carta>
          <img src="assets/Olaf-carga.jpg" alt="Olaf" style="width: 100%; height: auto; display: block; border-radius: 16px; border: 2px solid ${ROSA}; box-shadow: 0 0 80px ${ROSA}4D; box-sizing: border-box;">
          <div style="margin-top: 18px; font-family: ${DISPLAY}; font-size: 170px; line-height: 0.9; color: ${ROSA};">16–0</div>
        </div>
      </div>`,
}));

// ── 15 · Las skins ───────────────────────────────────────────────────────
// Las ocho comprables, sin rótulos.
const skins = [1, 2, 4, 13, 20, 38, 51, 65];
slides.push(lamina({
  label: 'Las skins', screen: '15 · Las skins',
  notas: 'Y de skins tiene quince y ocho las puedes comprar. Unos mil seiscientos varos.',
  src: 'Jinx_0.jpg', contenido: `
      <div data-rejilla style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${skins.map((n) => `<img data-skin src="assets/skins/Jinx_${n}.jpg" alt="Skin de Jinx" style="width: 100%; height: 290px; object-fit: cover; object-position: 60% 25%; border-radius: 14px; display: block;">`).join('')}
      </div>`,
}));

// ── 16 · Quebrantada ─────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Quebrantada', screen: '16 · Arcane: Jinx Quebrantada',
  notas: 'Y la skin carinosa que cuesta un ojo de la cara se saca con la dinamica para ludopatas que es por tiradas. Y en mi opinion esta skin esta hermosa al chile creo que es la mejor de su categoria.',
  src: 'quebrantada.jpg', contenido: `
      ${banda('quebrantada.jpg', 'Arcane: Jinx Quebrantada', 640, '50% center')}
      <div data-formas style="margin-top: 40px; display: flex; justify-content: center; align-items: flex-end; gap: 40px; height: 560px;">
        <img data-forma src="assets/quebrantada-1.png" alt="Jinx Quebrantada, forma Menace" style="height: 100%; width: auto; display: block;">
        <img data-forma src="assets/quebrantada-2.png" alt="Jinx Quebrantada, forma Tinkerer" style="height: 100%; width: auto; display: block;">
      </div>`,
}));

// ── 17 · Cierre ──────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Cierre', screen: '17 · Cierre',
  notas: 'Ni pedo solo queda decir gigi easy tirenme un follow o les voy a meter la cuarta chao.',
  src: 'poster-cierre.jpg', contenido: `
      ${poster('poster-cierre.jpg', 'Cartel oficial de Jinx, Arcane', 1080)}
      <div data-gigi style="margin-top: 50px; font-family: ${DISPLAY}; font-size: 130px; line-height: 0.9; color: ${ROSA};">GIGI EASY</div>`,
}));

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Todas iguales a propósito: el arte entra y empuja despacio hacia dentro,
// que es lo que se monta debajo de la voz.
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

  animar('Portada', function (tl, s) {
    tl.from(uno(s, '[data-portada]'), { scale: 1.08, opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
      .from(q(s, '[data-linea]'), { y: 60, opacity: 0, duration: 0.75, stagger: 0.14 }, 0.4);
  });

  function arte(tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 0.8 }, 0);
    var a = uno(s, '[data-arte]');
    if (a) tl.from(a, { y: 30, opacity: 0, duration: 0.7 }, 0.05).from(a.querySelector('img'), { scale: 1.1, duration: 1.7, ease: 'power2.out' }, 0.05);
    if (uno(s, '[data-isha]')) tl.from(uno(s, '[data-isha]'), { scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.75);
    if (uno(s, '[data-forma]')) tl.from(q(s, '[data-forma]'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.16 }, 0.6);
    if (uno(s, '[data-gigi]')) tl.from(uno(s, '[data-gigi]'), { y: 30, opacity: 0, duration: 0.55 }, 0.85);
  }
  ['Arcane', 'El juego', 'Powder', 'Vander', 'La familia', 'El grito', 'El nombre', 'Silco', 'Cassandra', 'Isha', 'El final', 'Quebrantada', 'Cierre'].forEach(function (l) { animar(l, arte); });

  animar('El OTP', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 0.8 }, 0)
      .from(uno(s, '[data-cifra]'), { y: 30, opacity: 0, duration: 0.5 }, 0.05)
      .from(uno(s, '[data-emblema]'), { y: 40, scale: 0.86, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.9)
      .from(uno(s, '[data-rango]'), { y: 24, opacity: 0, duration: 0.45 }, 1.2);
    cuentaMil(tl, uno(s, '[data-cifra]'), 0.08, 0.9);
  });

  animar('Olaf', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 0.8 }, 0)
      .from(q(s, '[data-carta]'), { y: 50, opacity: 0, duration: 0.6, stagger: 0.35 }, 0.05);
  });

  animar('Las skins', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 0.8 }, 0)
      .from(q(s, '[data-skin]'), { y: 26, scale: 0.94, opacity: 0, duration: 0.45, stagger: 0.09 }, 0.05);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jinx cumple 13 años</title>
${kit.og({ titulo: "Jinx cumple 13 años", descripcion: "Todos los que la quisieron, en arte oficial de Arcane, y el OTP número uno del mundo en Hierro sin jugar Jinx. Apoyo visual para TikTok.", carpeta: "jinx" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,79,168,0.45); border-radius: 999px;
    background: rgba(10,7,16,0.85); color: ${ROSA}; cursor: pointer;
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
