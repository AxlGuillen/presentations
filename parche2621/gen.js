// Generador de index.html — Parche 26.21 (láminas para el montaje automático)
// Ejecutar: node parche2621/gen.js   ·   recortes: node tools/recortes.mjs parche2621
//           clips: node tools/laminas.mjs parche2621
//
// Serie de parches #2, con el criterio del 26.20 (recortes del sitio oficial
// dentro de un marco con la dirección) llevado al **panel de 1080×1370** del
// montaje automático, como lux y graves. Las 17 láminas y su punto de entrada
// salen de la tabla de Axl del 20/10/2026.
//
// Los recortes los saca `tools/recortes.mjs` desde `recortes.json` (a 600 px y
// deviceScaleFactor 2, sin el banner de cookies) y por cada frase resaltada
// guarda **el pedazo con el resaltado aparte**, con su posición: aquí el
// recorte va limpio y cada resaltado se destapa encima de izquierda a derecha,
// como un marcatextos. El único añadido a la página sigue siendo el amarillo.
//
// ⚠️ **La página es-mx de las notas daba 404 el 20/10/2026**: los recortes de las
// notas son de la en-us. Cuando salga la es-mx, se cambia `lang` en
// `recortes.json`, se traducen las frases de `marcar` y se vuelve a correr la
// herramienta; el /dev de Mel sí está en es-mx.
// ⚠️ **K/DA 2026 no tenía anuncio oficial** (solo filtraciones): el arte sale del
// **PBE vía CommunityDragon** (`…/pbe/plugins/rcp-be-lol-game-data/…/skins/skinNN/`),
// donde el 20/10 solo dos tenían arte final: K/DA FIRESTARTER Ignition Akali
// (84102) y K/DA Hitmaker Evelynn (28066), justo las de tiradas. Las de Ahri
// (103097), Kai'Sa (145083) y Evelynn (28065) seguían con arte provisional
// (splash negro y pantalla de carga base) y por eso no salen.
// Sin dinero en pantalla (las tiradas de 130 dólares las dice la voz).
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Paleta: la página de Riot y un marcatextos (la del 26.20) ────────────
const BG = '#060C1A';
const PAGINA = '#0A1428';
const MARCA = '#FFD640';
const BUFF = '#3FD68A';
const NERF = '#FF5468';
const AJUSTE = '#9FB0C8';
const BONE = '#EEF2F8';
const MUTED = '#8090A8';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };
const ANCHO_MAX = 984;          // marco a lo ancho del panel
const ALTO_LIBRE = 1110;        // alto para recortes debajo del chip y la barra

const R = JSON.parse(fs.readFileSync(__dirname + '/assets/recortes/recortes.json', 'utf8'));
// La captura de YouTube de Axl no sale de la herramienta: su marca (las vistas)
// se hizo aparte con el mismo recorte, fondo amarillo y texto oscuro.
R['kda-youtube'] = { w: 863, h: 290, src: 'assets/kda-youtube.png', marcas: [{ x: 511, y: 58, w: 116, h: 24, archivo: 'kda-youtube-m0.png' }] };
const NOTAS = 'leagueoflegends.com · notas del parche 26.21';

// ── Piezas ───────────────────────────────────────────────────────────────
const SECCION = `background: ${BG}; color: ${BONE}; font-family: ${BODY}; position: relative; overflow: hidden;`;
const fondo = (color) => `
    <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(90% 50% at 50% 30%, ${a(color, 0.16)}, ${a(color, 0)} 70%), radial-gradient(70% 40% at 50% 95%, ${a('#2A5CC7', 0.18)}, rgba(0,0,0,0) 70%);"></div>
    <div style="position: absolute; inset: 0; pointer-events: none; ${kit.fondo('transparent', kit.puntos({ color: a('#8FB2E8', 0.08), radio: 1.6, paso: 30 }))}"></div>`;

const TIPO = { nerf: ['▼ NERF', NERF], buff: ['▲ BUFF', BUFF], ajuste: ['◆ AJUSTE', AJUSTE], marca: ['', MARCA] };
const chip = (tipo, nombre) => {
  const [t, col] = TIPO[tipo];
  return `<div data-chip style="position: absolute; left: 0; right: 0; top: 30px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 18px; padding: 14px 30px; border-radius: 999px; background: ${a(col, 0.14)}; border: 2px solid ${a(col, 0.7)}; box-shadow: 0 0 40px ${a(col, 0.25)};">
          ${t ? `<span style="font-family: ${DISPLAY}; font-size: 48px; line-height: 1; letter-spacing: 3px; color: ${col};">${t}</span><span style="width: 2px; height: 36px; background: ${a(col, 0.5)};"></span>` : ''}
          <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 1; letter-spacing: 2px; color: ${BONE};">${nombre}</span>
        </div>
      </div>`;
};

// Un recorte con sus resaltados encima (posiciones en % del PNG).
const recorte = (id, alt) => {
  const d = R[id];
  if (!d) throw new Error(`falta el recorte ${id}: corre node tools/recortes.mjs parche2621`);
  const marcas = d.marcas.map(m => `<div data-marca style="position: absolute; left: ${(m.x / d.w * 100).toFixed(3)}%; top: ${(m.y / d.h * 100).toFixed(3)}%; width: ${(m.w / d.w * 100).toFixed(3)}%; height: ${(m.h / d.h * 100).toFixed(3)}%;"><img src="assets/recortes/${m.archivo}" alt="" style="width: 100%; height: 100%; display: block;"></div>`).join('');
  return `<div data-recorte style="position: relative; line-height: 0;"><img src="${d.src || `assets/recortes/${id}.png`}" alt="${alt}" style="width: 100%; height: auto; display: block;">${marcas}</div>`;
};

// El marco del navegador con la dirección; los recortes van apilados sin hueco.
const barra = (direccion) => `
        <div style="display: flex; align-items: center; gap: 10px; padding: 16px 22px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.08); line-height: 1;">
          <span style="width: 13px; height: 13px; border-radius: 50%; background: ${NERF}B3;"></span>
          <span style="width: 13px; height: 13px; border-radius: 50%; background: ${MARCA}B3;"></span>
          <span style="width: 13px; height: 13px; border-radius: 50%; background: ${BUFF}B3;"></span>
          <span style="margin-left: 12px; font-family: ${MONO}; font-size: 21px; color: ${MUTED};">${direccion}</span>
        </div>`;
const anchoPara = (ids) => {
  const alto = ids.reduce((s, id) => s + R[id].h * (1092 / R[id].w), 0);
  return Math.min(ANCHO_MAX, Math.floor(ALTO_LIBRE * 1092 / alto));
};
const marco = (ids, alts, { direccion = NOTAS, top = null, ancho = null, fondoPagina = PAGINA, estilo = '' } = {}) => {
  const w = ancho || anchoPara(ids);
  // Sin top fijo, el marco se centra en lo que queda del panel debajo del chip.
  if (top == null) { const alto = ids.reduce((s, id) => s + R[id].h * w / R[id].w, 0) + 56; top = Math.round(150 + Math.max(0, (PANEL.h - 170 - alto) / 2)); }
  return `
      <div data-marco style="position: absolute; left: ${(1080 - w) / 2}px; top: ${top}px; width: ${w}px; border-radius: 18px; overflow: hidden; background: ${fondoPagina}; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 30px 80px rgba(0,0,0,0.6); ${estilo}">
        ${barra(direccion)}
        ${ids.map((id, k) => recorte(id, alts[k])).join('')}
      </div>`;
};
// Pila de tarjetas: cada recorte en su marco, el siguiente encima del anterior.
const pila = (ids, alts, { ancho = 920, paso = 250, top = 150, giros = [-2, 1.6, -1.2, 1] } = {}) => ids.map((id, k) => `
      <div data-tarjeta style="position: absolute; left: ${(1080 - ancho) / 2}px; top: ${top + k * paso}px; width: ${ancho}px; border-radius: 18px; overflow: hidden; background: ${PAGINA}; border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 -10px 60px rgba(0,0,0,0.55), 0 30px 80px rgba(0,0,0,0.6); transform: rotate(${giros[k % giros.length]}deg);">
        ${barra(NOTAS)}
        ${recorte(id, alts[k])}
      </div>`).join('');

const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;
const lamina = (id, notas, color, cuerpo) => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION}">
    ${fondo(color)}
    ${panel(cuerpo)}
  </section>`;

const slides = [];

// ── p-portada ────────────────────────────────────────────────────────────
slides.push(lamina('p-portada', 'Hoy tenemos nuevo parche en el juegito, el veintiseis punto veintiuno, y viene cargadito: ya que el mundial se queda en el parche pasado, ahora si le puede pegar a todo lo que estaba roto. Y ojo: Worlds se sigue jugando en el veintiseis punto veinte.', MARCA, `
      <div data-titulo style="position: absolute; left: 0; right: 0; top: 30px; text-align: center; font-family: ${DISPLAY}; font-size: 210px; line-height: 0.85; letter-spacing: 3px;">PARCHE <span style="color: ${MARCA};">26.21</span></div>
      ${marco(['cabecera'], ['Cabecera de las notas del parche 26.21 con el arte de True Damage'], { top: 250, ancho: 984 })}`));

// ── Nerfs ────────────────────────────────────────────────────────────────
slides.push(lamina('p-jinx', 'Arrancamos con los nerfeos. Jinx pierde dano por nivel y veinte de vida base, y Riot dice textual que estaba igual de dominante que su mejor amiga Caitlyn.', NERF, `
      ${chip('nerf', 'JINX')}
      ${marco(['jinx'], ['Jinx: daño por nivel de 3,25 a 3 y vida base de 630 a 610'])}`));
slides.push(lamina('p-caitlyn', 'Y a Caitlyn tambien le dieron. La pasiva del headshot pega menos en late y a cambio le subieron el dano de la Q.', NERF, `
      ${chip('nerf', 'CAITLYN')}
      ${marco(['caitlyn'], ['Caitlyn: el headshot de 60–100 % a 60–80 % del AD y la Q de 210 a 230 de daño máximo'])}`));
slides.push(lamina('p-leesin', 'Lee Sin pierde un segundo de enfriamiento en la W y la patada de la ulti pega menos.', NERF, `
      ${chip('nerf', 'LEE SIN')}
      ${marco(['leesin'], ['Lee Sin: W de 7 a 8 segundos y la patada de la R de 175/400/625 a 150/350/550'])}`));
slides.push(lamina('p-qiyana', 'Qiyana pierde dano en la Q porque el buff que le dieron hace cuatro parches se les paso de lanza.', NERF, `
      ${chip('nerf', 'QIYANA')}
      ${marco(['qiyana'], ['Qiyana: la Q de 80–200 a 70–190 de daño'])}`));
slides.push(lamina('p-viktor', 'Y a Viktor le bajaron la velocidad de movimiento y el escudo de la Q, y Riot escribio que era hora de la gloriosa devolucion. Viktor y Qiyana fueron de lo que mas domino el Play In.', NERF, `
      ${chip('nerf', 'VIKTOR')}
      ${marco(['viktor'], ['Viktor: «It’s time for the Glorious…Devolution», velocidad de 335 a 330 y menos escudo en la Q'])}`));
slides.push(lamina('p-jungla', 'En la jungla tambien le pegaron a Nidalee, a Wukong y a Rammus. Y lo de Rammus esta buenisimo porque Riot dice que le estaba pasando por encima a todo mundo y lo nerfea con un ok al final.', NERF, `
      ${chip('nerf', 'NIDALEE · WUKONG · RAMMUS')}
      ${pila(['nidalee', 'wukong', 'rammus'], ['Nidalee: menos daño en la W y menos velocidad de ataque en la E', 'Wukong: menos armadura por acumulación', 'Rammus: «rolling over pretty much everyone else… ok?»'], { ancho: 900, paso: 235, top: 150 })}`));
slides.push(lamina('p-tristana', 'A Tristana le bajaron la velocidad de ataque de la Q en niveles bajos porque su linea era nivel uno apretar la Q y darle click hasta ganar. Y a Yone le bajaron tantito el dano de la Q.', NERF, `
      ${chip('nerf', 'TRISTANA · YONE')}
      ${marco(['tristana', 'yone'], ['Tristana: «Level 1 press [Q] and just auto attack», velocidad de ataque de la Q desde 40 %', 'Yone: la Q de 110 % a 105 % del AD'])}`));

// ── Buffs ────────────────────────────────────────────────────────────────
slides.push(lamina('p-top', 'Ahora los buffeos. Darius tiene un segundo menos de enfriamiento en la Q a nivel maximo, y Sion gana vida por nivel y su ulti pega mas mientras mas la cargues.', BUFF, `
      ${chip('buff', 'DARIUS · SION')}
      ${pila(['darius', 'sion'], ['Darius: la Q a nivel 5 de 5 a 4 segundos', 'Sion: vida por nivel de 87 a 95 y la R hasta +200 % al cargarla'], { ancho: 900, paso: 300, top: 150 })}`));
slides.push(lamina('p-magos', 'Buffearon a Ryze, a Orianna y a Azir, los magos favoritos de los profesionales, justo cuando el buff ya no va a llegar al mundial. Y rapidito: Miss Fortune, Nunu, Xin Zhao, Taliyah, Velkoz y Zyra.', BUFF, `
      ${chip('buff', 'RYZE · ORIANNA · AZIR')}
      ${pila(['intro', 'ryze', 'orianna', 'azir'], ['La introducción de Riot: más aire para Azir, Orianna y Ryze con el parche de Worlds congelado', 'Ryze: más daño de Flux y la W al 70 % de AP', 'Orianna: la Q al 60 % y la W al 85 % de AP', 'Azir: maná por nivel de 40 a 50'], { ancho: 920, paso: 210, top: 150 })}`));

// ── Taric y objetos ──────────────────────────────────────────────────────
slides.push(lamina('p-taric', 'Y a Taric le arreglaron que sus habilidades ya funcionan aunque su aliado se vuelva intocable. Pero con una excepcion que Riot puso con nombre y apellido: perdon, Master Yi.', AJUSTE, `
      ${chip('ajuste', 'TARIC')}
      ${marco(['taric'], ['Taric: las habilidades ya funcionan con aliados intocables, con una excepción en la E: «(sorry, Master Yi)»'])}`));
slides.push(lamina('p-objetos', 'En objetos, los tiradores pierden fuerza con Hubris y con las Gluttonous Greaves, que ahora cuestan cien de oro mas.', NERF, `
      ${chip('nerf', 'HUBRIS · GREAVES')}
      ${marco(['hubris', 'greaves'], ['Hubris: 15 cuerpo a cuerpo y 10 a distancia', 'Gluttonous Greaves: de 1000 a 1100 de oro'])}`));

// ── Sistemas, skins y lo que viene ───────────────────────────────────────
slides.push(lamina('p-repeticiones', 'Y se acuerdan del desmadre de las repeticiones del parche pasado: Riot reculo. Ahora si vas a poder bajar las repeticiones de cualquier jugador pero con un limite de diez por hora, y le echan la culpa a las aplicaciones hechas con inteligencia artificial.', MARCA, `
      ${chip('marca', 'REPETICIONES')}
      ${marco(['repeticiones'], ['Límite de descargas de repeticiones: 10 por hora, por las «vibecoded apps»'], {})}`));
slides.push(lamina('p-truedamage', 'Y manana salen las skins de True Damage con Ekko de prestigio y Akali, Qiyana, Senna y Yasuo.', MARCA, `
      ${chip('marca', 'TRUE DAMAGE')}
      ${marco(['truedamage'], ['Patch Highlights: las skins True Damage Know My Name salen el 21 de octubre de 2026'], {})}`));

// K/DA: la captura de YouTube de Axl y las dos skins nuevas que ya traen arte
// final en el PBE (K/DA FIRESTARTER Ignition Akali y K/DA Hitmaker Evelynn, las
// de tiradas). Ahri, Kai'Sa y la Evelynn normal todavía tienen arte provisional.
const KDA = [['akali-firestarter', 'K/DA FIRESTARTER Ignition Akali'], ['evelynn-firestarter', 'K/DA Hitmaker Evelynn']];
slides.push(lamina('p-kda', 'Pero lo que viene en el siguiente parche esta mas cabron. Regresa K/DA despues de seis anos y el video de Firestarter ya lleva catorce millones de vistas en YouTube en solo dos dias. Van a sacar skins para Ahri, Kai Sa, Evelynn y Akali, pero la de Akali y una version de Evelynn solo salen por tiradas.', '#E25CC8', `
      ${chip('marca', 'K/DA · 26.22')}
      ${marco(['kda-youtube'], ['Captura de YouTube: K/DA — FIRESTARTER, 14 M de vistas hace 2 días'], { direccion: 'youtube.com · K/DA — FIRESTARTER', top: 150, ancho: 984, fondoPagina: '#0F0F0F' })}
      <div data-cuatro style="position: absolute; left: 0; right: 0; top: 570px; display: flex; justify-content: center; gap: 24px;">
        ${KDA.map(([f, n]) => `<div data-kda style="width: 420px; height: 764px; border-radius: 18px; overflow: hidden; border: 2px solid ${a('#E25CC8', 0.75)}; box-shadow: 0 0 40px ${a('#E25CC8', 0.35)}, 0 30px 70px rgba(0,0,0,0.6);">
          <img src="assets/kda/${f}.jpg" alt="${n}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
        </div>`).join('')}
      </div>`));

slides.push(lamina('p-mel', 'Y en ese mismo parche le quitan a Mel el reflejo de la W, porque Riot admitio que era imposible balancearla. Asi que disfruten sus ultimas dos semanas.', NERF, `
      ${chip('nerf', 'MEL · 26.22')}
      ${marco(['mel', 'mel-w'], ['El /dev de Mel: «resultaba imposible lograr el balance de sus habilidades»', 'El /dev de Mel: «Decidimos quitar el efecto de reflejo de la [W] de Mel.»'], { direccion: 'leagueoflegends.com · /dev: Mel', fondoPagina: '#FFFFFF' })}`));

// ── cierre ───────────────────────────────────────────────────────────────
slides.push(lamina('cierre', 'Ni pedo, solo queda decir gigi easy. Tirenme un follow o les voy a meter la cuarta. Chao.', MARCA, `
      <div style="position: absolute; inset: 0; overflow: hidden;">
        <div style="position: absolute; inset: -80px; background-image: url('assets/Mel_0-fondo.jpg'); background-size: cover; background-position: center; filter: blur(46px) brightness(0.45);"></div>
      </div>
      <div data-cierre-arte style="position: absolute; left: 0; top: 160px; width: 1080px; height: 720px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.7);">
        <img data-img src="assets/Mel_0.jpg" alt="Mel, splash" style="width: 100%; height: 100%; object-fit: cover; object-position: 60% 30%; display: block;">
      </div>
      <div data-ggez style="position: absolute; left: 0; right: 0; top: 930px; text-align: center; font-family: ${DISPLAY}; font-size: 260px; line-height: 1; color: ${MARCA}; text-shadow: 0 0 40px ${a(MARCA, 0.45)};">GG EZ</div>`));

// ── Coreografías ─────────────────────────────────────────────────────────
// El marco ya está desde el cuadro 0 (nada arranca en negro); los recortes se
// destapan de arriba abajo y luego cada resaltado se pinta como un marcatextos.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };
  function marcas(tl, cont, en) {
    var ms = cont.querySelectorAll('[data-marca]');
    ms.forEach(function (m, i) {
      tl.fromTo(m, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38, ease: 'power2.inOut', immediateRender: true }, en + i * 0.22);
    });
    return en + ms.length * 0.22 + 0.38;
  }
  // El chip ya está desde el cuadro 0: solo late una vez.
  function chipYMarco(tl, s) {
    tl.fromTo(uno(s, '[data-chip] > div'), { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.05);
  }
  // Un marco: los recortes bajan como una persiana y después los resaltados.
  function cambio(tl, s) {
    chipYMarco(tl, s);
    var recs = q(s, '[data-marco] [data-recorte]'), t = 0.25;
    recs.forEach(function (r, i) {
      tl.fromTo(r, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut', immediateRender: true }, t + i * 0.35);
    });
    t = t + recs.length * 0.35 + 0.35;
    recs.forEach(function (r) { t = marcas(tl, r, t) + 0.05; });
  }
  // Pila: cada tarjeta llega desde abajo, se pintan sus resaltados y llega la siguiente.
  function pila(tl, s) {
    chipYMarco(tl, s);
    var t = 0.2;
    q(s, '[data-tarjeta]').forEach(function (c, i) {
      // La primera ya está en su lugar (el marco se ve desde el cuadro 0) y se destapa como las demás láminas.
      if (i === 0) tl.fromTo(c.querySelector('[data-recorte]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut', immediateRender: true }, t);
      else tl.from(c, { y: 700, opacity: 0, rotation: '+=6', duration: 0.6, ease: 'power3.out' }, t);
      t = marcas(tl, c, t + 0.55) + 0.1;
    });
  }
  ['p-jinx', 'p-caitlyn', 'p-leesin', 'p-qiyana', 'p-viktor', 'p-tristana', 'p-taric', 'p-objetos', 'p-repeticiones', 'p-truedamage', 'p-mel'].forEach(function (l) { animar(l, cambio); });
  ['p-jungla', 'p-top', 'p-magos'].forEach(function (l) { animar(l, pila); });

  animar('p-portada', function (tl, s) {
    tl.from(uno(s, '[data-titulo]'), { y: -40, opacity: 0, scale: 1.15, duration: 0.6, ease: 'power3.out' }, 0);
    var r = uno(s, '[data-recorte]');
    tl.fromTo(r, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut', immediateRender: true }, 0.25)
      .from(r.querySelector('img'), { scale: 1.12, duration: 2.2, ease: 'power2.out' }, 0.25);
    marcas(tl, r, 1.05);
  });

  animar('p-kda', function (tl, s) {
    chipYMarco(tl, s);
    tl.fromTo(uno(s, '[data-recorte]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut', immediateRender: true }, 0.25);
    var t = marcas(tl, uno(s, '[data-marco]'), 0.85);
    tl.from(q(s, '[data-kda]'), { y: 160, opacity: 0, rotation: function (i) { return i ? 6 : -6; }, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)' }, t)
      .from(q(s, '[data-kda] img'), { scale: 1.15, duration: 1.6, ease: 'power2.out' }, t);
  });

  animar('cierre', function (tl, s) {
    tl.from(uno(s, '[data-cierre-arte]'), { y: 60, opacity: 0, duration: 0.7 }, 0)
      .from(uno(s, '[data-cierre-arte] [data-img]'), { scale: 1.15, duration: 2.4, ease: 'power2.out' }, 0)
      .from(uno(s, '[data-ggez]'), { scale: 2.2, opacity: 0, duration: 0.45, ease: 'power4.in' }, 0.7);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Parche 26.21</title>
${kit.og({ titulo: 'Parche 26.21', descripcion: 'El parche después de Worlds en recortes de las notas oficiales: nerf a Jinx, Caitlyn, Viktor y Qiyana, buff a los magos de pro, el «sorry, Master Yi» de Taric y lo que viene en el 26.22.', carpeta: 'parche2621' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,214,64,0.45); border-radius: 999px;
    background: rgba(6,12,26,0.85); color: ${MARCA}; cursor: pointer;
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
${kit.gsap(__dirname, [])}
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
