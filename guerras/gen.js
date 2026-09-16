// Generador de index.html — Guerras Rúnicas · paquete de assets
// Ejecutar: node guerras/gen.js
//
// **Esto no es un deck de lectura ni una presentación**: es el material gráfico
// del episodio 1 de la serie de lore, una lámina por bloque del guion, para ir
// cortando encima de la voz en off. De ahí que cada `data-screen-label` diga a
// qué bloque del guion corresponde — así se emparejan al editar.
//
// **El problema del episodio, convertido en identidad.** Las Guerras Rúnicas
// están escritas pero casi no están dibujadas: no existe arte oficial de Khom,
// ni de las batallas, ni de Tyrus, ni de los doce años de miedo. En vez de
// rellenar esos huecos, el deck los **declara**: esos bloques van en negro con
// una etiqueta «sin registro». Es un episodio sobre historia que se perdió, así
// que el vacío visual dice lo mismo que el guion en vez de contradecirlo.
//
// Piezas de diseño:
//  · Los cinco Fragmentos de las Runas **traen su propio color cada uno** en el
//    arte de Legends of Runeterra (verde, azul, violeta, rojo, ámbar), así que
//    la lámina de las Runas no necesita paleta: la trae puesta.
//  · El arte se muestra **entero, sin recortar**, sobre una copia borrosa de sí
//    mismo. Son composiciones apaisadas en un lienzo vertical: a sangre habría
//    que tirar dos tercios de la imagen, y aquí la imagen es el producto.
//  · «Un sexto del mapa» se dibuja: seis celdas, una encendida. No hace falta
//    mapa y además es el dato exacto.
//
// ⚠️ **Los assets NO pasan por optimizar-imagenes.mjs a propósito.** En el
// resto del repo las imágenes son decoración del deck y se reescalan al tamaño
// en que se ven; aquí **son el entregable**, así que se guardan a 1600 px de
// ancho para que aguanten un push-in al editar. Las URLs de los originales a
// resolución completa (2048 px en LoR, 3838 px en la wiki) están en ASSETS.md.
//
// ⚠️ Todo el arte es de Riot (Legends of Runeterra, Data Dragon y la wiki
// oficial). Ver la nota de uso en ASSETS.md.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Guerras Rúnicas: el vacío, la runa y los que ganaron ──────────
const BG = '#07070B';        // el vacío
const RUNA = '#41C4E8';      // azul rúnico — acento
const CENIZA = '#CFC4B2';    // pergamino quemado — estructura y lo que se perdió
const NOXUS = '#C4283C';     // carmesí — Noxus, y el remate
const BONE = '#EDEBE6';      // texto principal
const MUTED = '#7A7A85';     // texto secundario
const PANEL = '#101017';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = RUNA, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Fondo: una copia borrosa y oscurecida del mismo arte que se muestra entero
// encima. Así la lámina se siente a sangre sin recortar la composición.
const fondoBorroso = (src, alt) => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(54px) saturate(0.8) brightness(0.30); transform: scale(1.1);" role="img" aria-label="${alt}"></div>
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,7,11,0.72) 0%, rgba(7,7,11,0.52) 42%, rgba(7,7,11,0.88) 100%);"></div>
    </div>`;

// El arte, entero y sin recortar.
const arte = (src, alt, extra = '') => `
      <img data-arte src="assets/${src}" alt="${alt}" style="width: 100%; height: auto; display: block; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12); ${extra}">`;

const eyebrow = (txt, color = RUNA) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 24px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(7,7,11,0.9);">${txt}</span>
    </div>`;

const titulo = (txt, size = 96) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.94; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(7,7,11,0.8);">${txt}</h2>`;

const pie = (html, color = RUNA) => `
      <p data-pie style="margin: 26px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.38;">${html}</p>`;

// Etiqueta de los bloques que no tienen arte oficial. Es la pieza de identidad
// del episodio: el hueco se declara, no se rellena.
const sello = () => `
      <div data-sello style="display: inline-flex; align-items: center; gap: 14px; padding: 12px 24px; border: 1px dashed ${MUTED}; border-radius: 999px;">
        <span style="width: 9px; height: 9px; border-radius: 50%; background: ${MUTED};"></span>
        <span style="font-size: 22px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${MUTED};">Sin registro</span>
      </div>`;

const slides = [];

// ── 01 · Portada ─────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Portada del episodio. Arte: Noxus Memories Of Destruction, la imagen de cabecera de la propia pagina de las Guerras Runicas en la wiki." style="${seccion()}">
    ${fondoBorroso('destruccion.jpg', 'Memorias de la destrucción')}
    ${glow(NOXUS, '50% 34%', '120% 48%')}
    <div style="position: relative;">
      ${arte('destruccion.jpg', 'Memorias de la destrucción', 'margin-bottom: 44px;')}
      ${eyebrow('Serie de lore · episodio 1', NOXUS)}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 176px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 30px rgba(7,7,11,0.9);"><span data-linea style="display: block;">LAS GUERRAS</span><span data-linea style="display: block; color: ${RUNA};">RÚNICAS</span></h1>
      <p data-sub style="margin: 26px 0 0; font-size: 32px; font-weight: 500; color: ${MUTED}; line-height: 1.35;">Por qué del resto del planeta <strong style="color: ${BONE};">no quedó ni el nombre</strong>.</p>
    </div>
  </section>`);

// ── 02 · Un sexto del mapa ───────────────────────────────────────────────
// No hace falta mapa: seis celdas y una encendida dicen el dato exacto.
slides.push(`
  <section data-label="Un sexto" data-screen-label="02 · Bloque 1 · un sexto del mapa" data-speaker-notes="De Runaterra solo se conoce una sexta parte. Todo lo que tiene nombre, los imperios, las guerras, los dioses, cabe en una esquina del noroeste del mapa. Del resto del planeta no quedo ni el nombre. Esto es la historia de por que." style="${seccion()}">
    ${glow(RUNA, '30% 40%', '110% 52%')}
    <div style="position: relative;">
      ${eyebrow('De todo el planeta')}
      ${titulo('Solo se conoce<br><span style="color: ' + RUNA + ';">una sexta parte</span>', 100)}

      <div data-rejilla style="margin-top: 46px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        ${[true, false, false, false, false, false].map((viva, i) => `
        <div data-celda style="position: relative; height: 200px; border-radius: 10px; ${viva
          ? `background: ${RUNA}1F; border: 2px solid ${RUNA}; box-shadow: 0 0 60px ${RUNA}4D;`
          : 'background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.16);'}">
          ${viva ? `<span style="position: absolute; left: 16px; bottom: 12px; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${RUNA};">LO QUE<br>TIENE NOMBRE</span>` : ''}
        </div>`).join('')}
      </div>

      ${pie('Los imperios, las guerras y los dioses caben en <strong style="color: ' + BONE + ';">una esquina del noroeste</strong>. Los otros cinco sextos no tienen ni nombre.')}
    </div>
  </section>`);

// ── 03 · Sin registro · la historia escrita ──────────────────────────────
slides.push(`
  <section data-label="La historia escrita" data-screen-label="03 · Bloque 2 · sin registro" data-speaker-notes="Hubo un tiempo en que Runaterra tuvo historia escrita. Civilizaciones que dejaron registro, continentes con nombre propio, archivos. Nada de eso sobrevive. Lo que hay hoy son mitos, folclor y versiones que no coinciden entre si." style="${seccion()}">
    <div style="position: relative;">
      ${eyebrow('Hubo un tiempo', CENIZA)}
      ${titulo('Runeterra tuvo<br><span style="color: ' + CENIZA + ';">historia escrita</span>', 100)}
      <p data-pie style="margin: 30px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Civilizaciones con registro. Continentes con nombre propio. Archivos.</p>
      <div data-hueco style="margin-top: 48px; padding: 56px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); text-align: center;">
        <div style="font-family: ${DISPLAY}; font-size: 118px; line-height: 1; color: ${CENIZA};">Nada de eso<br>sobrevive</div>
      </div>
      <div data-sello-wrap style="margin-top: 36px;">${sello()}</div>
    </div>
  </section>`);

// ── 04 · Las Runas del Mundo ─────────────────────────────────────────────
// Los cinco fragmentos traen su color puesto desde el arte de LoR; los nombres
// hacen el trabajo solos: Traición, Locura, Violencia.
const fragmentos = [
  ['runa-traicion.jpg', 'Traición', '#4FD08A'],
  ['runa-esperanza.jpg', 'Esperanza', '#5AB6E8'],
  ['runa-locura.jpg', 'Locura', '#A87BE0'],
  ['runa-violencia.jpg', 'Violencia', '#E0573F'],
  ['runa-reverencia.jpg', 'Reverencia', '#E8A83C'],
];

slides.push(`
  <section data-label="Las Runas del Mundo" data-screen-label="04 · Bloque 3 · las Runas" data-speaker-notes="Todo empezo con las Runas del Mundo. Las Runas no eran armas. Eran los fragmentos con los que se le dio forma al planeta, el origen de toda la magia que existe. Durante siglos estuvieron ocultas." style="${seccion()}">
    ${glow(RUNA, '50% 30%', '118% 48%')}
    <div style="position: relative;">
      ${eyebrow('Todo empezó con ellas')}
      ${titulo('Las Runas<br><span style="color: ' + RUNA + ';">del Mundo</span>', 92)}

      <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 12px;">
        ${fragmentos.map(([img, nombre, color]) => `
        <div data-frag style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid ${color}59;">
          <img src="assets/${img}" alt="Fragmento de la ${nombre}" style="width: 100%; height: 140px; object-fit: cover; object-position: center 46%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,7,11,0.86) 0%, rgba(7,7,11,0.34) 46%, rgba(7,7,11,0.10) 100%);"></div>
          <div style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${color}; text-shadow: 0 2px 14px rgba(7,7,11,0.9);">${nombre}</div>
        </div>`).join('')}
      </div>

      ${pie('No eran armas: son <strong style="color: ' + BONE + ';">los fragmentos con los que se le dio forma al planeta</strong>, el origen de toda la magia que existe.')}
    </div>
  </section>`);

// ── 05 · La orden de las Islas Benditas ──────────────────────────────────
slides.push(`
  <section data-label="Las Bóvedas de Helia" data-screen-label="05 · Bloque 4 · la orden" data-speaker-notes="Una orden antigua de las Islas Benditas tenia una sola mision, reunir los artefactos mas peligrosos del mundo y mantenerlos lejos de cualquier mano mortal." style="${seccion()}">
    ${fondoBorroso('boveda-helia.jpg', 'Las Bóvedas de Helia')}
    ${glow(RUNA, '50% 32%', '118% 50%')}
    <div style="position: relative;">
      ${eyebrow('Una orden con una sola misión')}
      ${titulo('Guardar lo que<br><span style="color: ' + RUNA + ';">no debía tocarse</span>', 92)}
      ${arte('boveda-helia.jpg', 'Las Bóvedas de Helia', 'margin-top: 34px;')}
      ${pie('Las <strong style="color: ' + BONE + ';">Bóvedas de Helia</strong>, en las Islas Benditas: reunir los artefactos más peligrosos del mundo y mantenerlos lejos de cualquier mano mortal.')}
    </div>
  </section>`);

// ── 06 · Cayó Helia ──────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cayó Helia" data-screen-label="06 · Bloque 4b · cae la orden" data-speaker-notes="Esa orden cayo cuando cayo Helia. Y los artefactos empezaron a aparecer en manos equivocadas." style="${seccion()}">
    ${fondoBorroso('la-ruina.jpg', 'La Ruina')}
    ${glow(RUNA, '50% 36%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('Y esa orden cayó')}
      ${arte('la-ruina.jpg', 'La Ruina', 'margin-bottom: 36px;')}
      ${titulo('Los artefactos empezaron<br>a aparecer en <span style="color: ' + NOXUS + ';">manos equivocadas</span>', 76)}
    </div>
  </section>`);

// ── 07 · Sin registro · doce años de miedo ───────────────────────────────
slides.push(`
  <section data-label="Doce años de miedo" data-screen-label="07 · Bloque 5 · sin registro" data-speaker-notes="Durante doce anos no paso nada. Solo miedo. Ninguna nacion confiaba en otra, porque cualquiera podia estar guardando algo capaz de borrarla del mapa sin previo aviso." style="${seccion('align-items: center; text-align: center;')}">
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Durante doce años', CENIZA)}
      <div data-numerote style="font-family: ${DISPLAY}; font-size: 300px; line-height: 0.82; color: ${CENIZA};">12</div>
      <div data-numerote style="margin-top: 10px; font-family: ${DISPLAY}; font-size: 96px; line-height: 1; color: ${BONE};">años sin que<br>pasara nada</div>
      <p data-pie style="margin: 34px 0 0; max-width: 820px; font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.4;">Solo miedo. Ninguna nación confiaba en otra, porque <strong style="color: ${BONE};">cualquiera podía estar guardando algo capaz de borrarla del mapa</strong>.</p>
      <div data-sello-wrap style="margin-top: 40px;">${sello()}</div>
    </div>
  </section>`);

// ── 08 · Sin registro · Khom ─────────────────────────────────────────────
// La más importante de las láminas negras: el guion dice que no quedó nada, y
// la lámina tampoco tiene nada. Es el hueco que más trabaja del episodio.
slides.push(`
  <section data-label="Khom" data-screen-label="08 · Bloque 6 · Khom · sin registro" data-speaker-notes="La guerra empezo en una aldea llamada Khom. Dos naciones rivales pidieron parlamento y llamaron como mediador a Tyrus, un mago de Helia. No se sabe quien saco la primera Runa. Se sabe que se usaron dos, y que cuando se apago la luz no quedaba Khom, ni el valle, ni la gente que habia ido a negociar la paz." style="${seccion()}">
    ${glow(CENIZA, '50% 42%', '110% 40%')}
    <div style="position: relative;">
      ${eyebrow('La guerra empezó aquí', CENIZA)}
      ${titulo('Una aldea<br>llamada <span style="color: ' + CENIZA + ';">Khom</span>', 116)}

      <div data-lista style="margin-top: 44px; display: flex; flex-direction: column; gap: 18px;">
        ${['Dos naciones rivales pidieron parlamento',
           'Llamaron de mediador a <strong style="color:' + BONE + ';">Tyrus</strong>, un mago de Helia',
           'No se sabe quién sacó la primera Runa. <strong style="color:' + BONE + ';">Se usaron dos</strong>'].map((t, i) => `
        <div data-item style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 42px; line-height: 1; color: ${CENIZA}; width: 40px;">${i + 1}</span>
          <span style="font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>

      <div data-hueco style="margin-top: 44px; padding: 46px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 1.02; color: ${BONE};">Cuando se apagó la luz<br>no quedaba <span style="color: ${CENIZA};">nada</span></div>
      </div>

      <div data-sello-wrap style="margin-top: 32px;">${sello()}</div>
    </div>
  </section>`);

// ── 09 · Ryze y Tyrus ────────────────────────────────────────────────────
slides.push(`
  <section data-label="Ryze" data-screen-label="09 · Bloque 7 · Ryze y Tyrus" data-speaker-notes="Tyrus llego con su aprendiz. El aprendiz se llamaba Ryze. Ryze vio eso a los pocos anos de haber empezado a estudiar magia, y esa imagen lo persiguio durante el resto de su vida antinaturalmente larga." style="${seccion()}">
    ${fondoBorroso('ryze.jpg', 'Ryze')}
    ${glow(RUNA, '50% 34%', '118% 50%')}
    <div style="position: relative;">
      ${eyebrow('El aprendiz que iba con él')}
      ${arte('ryze.jpg', 'Ryze', 'margin-bottom: 36px;')}
      ${titulo('Se llamaba<br><span style="color: ' + RUNA + ';">Ryze</span>', 128)}
      ${pie('Vio Khom <strong style="color: ' + BONE + ';">a los pocos años de empezar a estudiar magia</strong>, y esa imagen lo persiguió el resto de su vida antinaturalmente larga.')}
    </div>
  </section>`);

// ── 10 · Veintidós años de guerra ────────────────────────────────────────
slides.push(`
  <section data-label="Veintidós años" data-screen-label="10 · Bloque 8 · 22 años de guerra" data-speaker-notes="Despues de Khom ya no hubo diplomacia. Hubo veintidos anos de guerra magica. El resto del mundo no tuvo suerte. Naciones enteras desaparecieron. Continentes completos dejaron de existir, y con ellos toda la historia que habian escrito." style="${seccion()}">
    ${fondoBorroso('destruccion.jpg', 'Memorias de la destrucción')}
    ${glow(NOXUS, '50% 36%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('Ya no hubo diplomacia', NOXUS)}
      <div data-veintidos style="display: flex; align-items: baseline; gap: 22px;">
        <span style="font-family: ${DISPLAY}; font-size: 216px; line-height: 0.82; color: ${NOXUS};">22</span>
        <span style="font-family: ${DISPLAY}; font-size: 88px; line-height: 1; color: ${BONE};">años de<br>guerra mágica</span>
      </div>
      ${arte('destruccion.jpg', 'Memorias de la destrucción', 'margin-top: 34px;')}
      ${pie('Naciones enteras desaparecieron. <strong style="color: ' + BONE + ';">Continentes completos dejaron de existir</strong>, y con ellos toda la historia que habían escrito.')}
    </div>
  </section>`);

// ── 11 · El Bastión Inmortal ─────────────────────────────────────────────
// El único arte que existe de un momento concreto de esta guerra.
slides.push(`
  <section data-label="El Bastión Inmortal" data-screen-label="11 · Bloque 9 · los noxii" data-speaker-notes="Las tribus noxii se encerraron en el Bastion Inmortal y sobrevivieron porque los magos de la Rosa Negra alcanzaron a contener buena parte de lo que caia del cielo. Fueron de los pocos." style="${seccion()}">
    ${fondoBorroso('bastion-inmortal.jpg', 'La Rosa Negra defendiendo el Bastión Inmortal')}
    ${glow(NOXUS, '50% 34%', '120% 52%')}
    <div style="position: relative;">
      ${eyebrow('Y fueron de los pocos', NOXUS)}
      ${arte('bastion-inmortal.jpg', 'La Rosa Negra defendiendo el Bastión Inmortal', 'margin-bottom: 34px;')}
      ${titulo('Las tribus noxii se encerraron<br>en el <span style="color: ' + NOXUS + ';">Bastión Inmortal</span>', 72)}
      ${pie('Sobrevivieron porque <strong style="color: ' + BONE + ';">los magos de la Rosa Negra alcanzaron a contener</strong> buena parte de lo que caía del cielo.', NOXUS)}
    </div>
  </section>`);

// ── 12 · La Rosa Negra ───────────────────────────────────────────────────
slides.push(`
  <section data-label="La Rosa Negra" data-screen-label="12 · Bloque 9b · la Rosa Negra" data-speaker-notes="Material de apoyo de la Rosa Negra, los magos que contuvieron el embate sobre el Bastion Inmortal." style="${seccion()}">
    ${glow(NOXUS, '50% 36%', '118% 52%')}
    <div style="position: relative;">
      ${eyebrow('Los que contuvieron el cielo', NOXUS)}
      ${titulo('La <span style="color: ' + NOXUS + ';">Rosa Negra</span>', 116)}
      <div style="margin-top: 34px; display: flex; flex-direction: column; gap: 16px;">
        ${[['espina-rosa.jpg', 'Espina de la Rosa'], ['espia-rosa-negra.jpg', 'Espía de la Rosa Negra'], ['mordekaiser.jpg', 'Mordekaiser · el Bastión']].map(([img, nombre]) => `
        <div data-carta style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid ${NOXUS}47;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 178px; object-fit: cover; object-position: center 42%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,7,11,0.82) 0%, rgba(7,7,11,0.20) 56%, rgba(7,7,11,0.06) 100%);"></div>
          <div style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); font-family: ${DISPLAY}; font-size: 50px; line-height: 1.02; color: ${BONE}; text-shadow: 0 2px 14px rgba(7,7,11,0.9); max-width: 60%;">${nombre}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 13 · Ryze mata a Tyrus ───────────────────────────────────────────────
// De Tyrus no hay arte, pero el nombre de la carta hace el trabajo: el
// Fragmento de la Traición al lado de la Prisión Rúnica cuenta la escena.
slides.push(`
  <section data-label="La traición" data-screen-label="13 · Bloque 10 · Ryze mata a Tyrus" data-speaker-notes="Ryze y su maestro dedicaron esos anos a recuperar Runas y esconderlas. Hasta que Tyrus decidio usar dos para sus propios fines. Ryze lo enfrento y lo mato. Ese dia juro no volver a usar una Runa del Mundo nunca. Sigue caminando el mundo, juntandolas." style="${seccion()}">
    ${glow(RUNA, '50% 34%', '118% 50%')}
    <div style="position: relative;">
      ${eyebrow('Hasta que el maestro las quiso')}
      ${titulo('Ryze lo enfrentó<br>y <span style="color: ' + NOXUS + ';">lo mató</span>', 104)}

      <div style="margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['runa-traicion.jpg', 'Fragmento de la Traición', '#4FD08A'], ['prision-runica.jpg', 'Prisión Rúnica', RUNA]].map(([img, nombre, color]) => `
        <div data-carta style="border-radius: 12px; overflow: hidden; border: 1px solid ${color}59;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 300px; object-fit: cover; object-position: center 46%; display: block;">
          <div style="padding: 14px 16px 18px; background: ${PANEL}E6;">
            <div style="font-family: ${DISPLAY}; font-size: 38px; line-height: 1.02; color: ${color};">${nombre}</div>
          </div>
        </div>`).join('')}
      </div>

      ${pie('Ese día juró <strong style="color: ' + BONE + ';">no volver a usar una Runa del Mundo nunca</strong>. Sigue caminando el mundo, juntándolas.')}
    </div>
  </section>`);

// ── 14 · Demacia y la petricita ──────────────────────────────────────────
const demacia = [
  ['ciervo-petricita.jpg', 'Ciervo de Petricita'],
  ['alagrande-petricita.jpg', 'Alagrande de Petricita'],
  ['supresor-petreo.jpg', 'Supresor Pétreo'],
  ['gran-plaza.jpg', 'La Gran Plaza'],
];

slides.push(`
  <section data-label="Demacia" data-screen-label="14 · Bloque 11 · Demacia y la petricita" data-speaker-notes="Un grupo de refugiados que huia hacia el oeste encontro un bosque donde los arboles anulaban la magia. Ahi, debajo de esos arboles, levantaron su primera ciudad. Ese bosque es el origen de Demacia. Su odio a la magia no es una idea politica, es lo que les quedo de haber visto arder el mundo." style="${seccion()}">
    ${glow(CENIZA, '50% 34%', '115% 50%')}
    <div style="position: relative;">
      ${eyebrow('Un bosque donde no funcionaba la magia', CENIZA)}
      ${titulo('Ese bosque es<br>el origen de <span style="color: ' + CENIZA + ';">Demacia</span>', 86)}

      <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${demacia.map(([img, nombre]) => `
        <div data-carta style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(207,196,178,0.26);">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 190px; object-fit: cover; object-position: center 46%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,7,11,0) 46%, rgba(7,7,11,0.9) 100%);"></div>
          <div style="position: absolute; left: 14px; right: 14px; bottom: 11px; font-size: 21px; font-weight: 700; color: ${BONE}; line-height: 1.15;">${nombre}</div>
        </div>`).join('')}
      </div>

      ${pie('Su odio a la magia no es una idea política: es <strong style="color: ' + BONE + ';">lo que les quedó de haber visto arder el mundo</strong>.', CENIZA)}
    </div>
  </section>`);

// ── 15 · Ixtal se cierra ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Ixtal" data-screen-label="15 · Bloque 12 · Ixtal se cierra" data-speaker-notes="En el sur, Skarner convencio a los suyos de cerrar la frontera de Ixtal y atrajo la selva para que sirviera de muro. Ixtal se aislo del resto de Runaterra y no volvio a salir." style="${seccion()}">
    ${fondoBorroso('centinela-ixtali.jpg', 'Centinela ixtalí')}
    ${glow(RUNA, '50% 34%', '115% 50%')}
    <div style="position: relative;">
      ${eyebrow('Y en el sur')}
      ${titulo('Ixtal <span style="color: ' + RUNA + ';">cerró la frontera</span><br>y no volvió a salir', 80)}
      <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 14px;">
        ${[['skarner.jpg', 'Skarner · el que convenció a los suyos'], ['centinela-ixtali.jpg', 'Centinela ixtalí']].map(([img, nombre]) => `
        <div data-carta style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(65,196,232,0.26);">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 232px; object-fit: cover; object-position: center 40%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,7,11,0) 50%, rgba(7,7,11,0.9) 100%);"></div>
          <div style="position: absolute; left: 20px; right: 20px; bottom: 14px; font-family: ${DISPLAY}; font-size: 42px; line-height: 1.02; color: ${BONE}; text-shadow: 0 2px 14px rgba(7,7,11,0.9);">${nombre}</div>
        </div>`).join('')}
      </div>
      ${pie('Atrajo la selva <strong style="color: ' + BONE + ';">para que sirviera de muro</strong>.')}
    </div>
  </section>`);

// ── 16 · Targón, Kayle y Morgana ─────────────────────────────────────────
slides.push(`
  <section data-label="Targón" data-screen-label="16 · Bloque 13 · Targón" data-speaker-notes="En el Monte Targon, un matrimonio subio huyendo de la guerra. Ella iba embarazada. Llegaron a la cima y un Aspecto la considero digna. Ese mismo ano nacieron sus hijas gemelas, Kayle y Morgana." style="${seccion()}">
    ${fondoBorroso('pico-targon.jpg', 'El Pico de Targón')}
    ${glow(CENIZA, '50% 30%', '118% 48%')}
    <div style="position: relative;">
      ${eyebrow('Un matrimonio subió huyendo', CENIZA)}
      ${arte('pico-targon.jpg', 'El Pico de Targón', 'margin-bottom: 28px;')}
      ${titulo('Y ese mismo año nacieron<br><span style="color: ' + CENIZA + ';">las gemelas</span>', 76)}
      <div style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${[['kayle.jpg', 'Kayle'], ['morgana.jpg', 'Morgana']].map(([img, nombre]) => `
        <div data-carta style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(207,196,178,0.26);">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 210px; object-fit: cover; object-position: center 42%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,7,11,0) 48%, rgba(7,7,11,0.9) 100%);"></div>
          <div style="position: absolute; left: 18px; bottom: 12px; font-family: ${DISPLAY}; font-size: 48px; line-height: 1; color: ${BONE}; text-shadow: 0 2px 14px rgba(7,7,11,0.9);">${nombre}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 17 · Nocturne ────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Nocturne" data-screen-label="17 · Bloque 14 · Nocturne" data-speaker-notes="Y hacia el final, cuando ya no quedaba con que pelear, cabalas de magos desesperados se despojaron de su propia carne para entrar al reino espiritual. Su magia de sombras se metio en los pensamientos de los vivos y los empujo a cosas peores. De esa magia nacio Nocturne, que se dedico a cazar uno por uno a los magos que la habian creado." style="${seccion()}">
    ${fondoBorroso('nocturne.jpg', 'Nocturne')}
    ${glow(RUNA, '50% 34%', '118% 50%')}
    <div style="position: relative;">
      ${eyebrow('Cuando ya no quedaba con qué pelear')}
      ${arte('nocturne.jpg', 'Nocturne', 'margin-bottom: 32px;')}
      ${titulo('De esa magia<br>nació <span style="color: ' + RUNA + ';">Nocturne</span>', 100)}
      ${pie('Y se dedicó a <strong style="color: ' + BONE + ';">cazar uno por uno a los magos que la habían creado</strong>.')}
    </div>
  </section>`);

// ── 18 · El remate ───────────────────────────────────────────────────────
slides.push(`
  <section data-label="Los que ganaron" data-screen-label="18 · Bloque 15 · el remate" data-speaker-notes="Las Guerras Runicas terminaron tres anos antes de que se fundara Noxus. Y ahi esta el ultimo detalle. La unica cronica ordenada que sobrevivio de todo esto se cuenta en calendario noxiano, y la escribio Noxus. Cada fecha del mundo se mide desde el dia en que nacio el imperio mas agresivo que ha tenido Runaterra. Asi que todo lo que se acaba de contar es la version de los que ganaron." style="${seccion()}">
    ${fondoBorroso('arena-noxkraya.jpg', 'La Arena Noxkraya')}
    ${glow(NOXUS, '50% 36%', '120% 54%')}
    <div style="position: relative;">
      ${eyebrow('Y ahí está el último detalle', NOXUS)}
      ${arte('arena-noxkraya.jpg', 'La Arena Noxkraya', 'margin-bottom: 32px;')}
      <div data-remate style="padding: 34px 38px; border-radius: 20px; background: ${NOXUS}1A; border-left: 6px solid ${NOXUS};">
        <div style="font-family: ${DISPLAY}; font-size: 94px; line-height: 1.0; color: ${BONE};">Todo esto es<br><span style="color: ${NOXUS};">la versión de los que ganaron</span></div>
        <div style="margin-top: 18px; font-size: 28px; font-weight: 400; color: ${MUTED}; line-height: 1.38;">La única crónica ordenada que sobrevivió <strong style="color: ${BONE};">se cuenta en calendario noxiano</strong>, y la escribió Noxus.</div>
      </div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  // Entrada por defecto de las láminas de arte: el arte llega primero y el
  // texto después. Son material para cortar encima, no información que leer.
  function lamina(tl, s, pos) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.08, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.15 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.1)
      .from(s.querySelector('[data-arte]'), { y: 30, scale: 0.96, opacity: 0, duration: 0.75 }, pos || 0.26)
      .from(s.querySelector('[data-a="up2"]'), { y: 28, opacity: 0, duration: 0.6 }, (pos || 0.26) + 0.42)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, (pos || 0.26) + 0.78);
  }

  // Las láminas sin registro entran lentas y sin rebote: el vacío no se
  // celebra. El sello llega al final, cuando ya se leyó lo que falta.
  function vacio(tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.55 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.7 }, 0.14)
      .from(s.querySelector('[data-sello]'), { opacity: 0, duration: 0.6 }, 1.12);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.1, opacity: 0, duration: 1.3 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.2 }, 0)
      .from(s.querySelector('[data-arte]'), { y: 34, scale: 0.95, opacity: 0, duration: 0.85 }, 0.16)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.62)
      .from(q(s, '[data-linea]'), { y: 48, opacity: 0, duration: 0.7, stagger: 0.13 }, 0.76)
      .from(s.querySelector('[data-sub]'), { y: 20, opacity: 0, duration: 0.5 }, 1.24);
  });

  // Las seis celdas aparecen todas y solo después se enciende la que cuenta.
  animar('Un sexto', function (tl, s) {
    var c = q(s, '[data-celda]');
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(c, { scale: 0.9, opacity: 0, duration: 0.42, stagger: 0.05 }, 0.34)
      .from(c[0], { boxShadow: '0 0 0px rgba(65,196,232,0)', duration: 0.6 }, 0.86)
      .from(c[0].firstElementChild, { opacity: 0, y: 14, duration: 0.5 }, 0.92)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.16);
  });

  animar('La historia escrita', function (tl, s) {
    vacio(tl, s);
    tl.from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 0.48)
      .from(s.querySelector('[data-hueco]'), { opacity: 0, duration: 0.8 }, 0.68);
  });

  // Los cinco fragmentos caen uno tras otro: los nombres son el dato.
  animar('Las Runas del Mundo', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-frag]'), { x: -30, opacity: 0, duration: 0.46, stagger: 0.13 }, 0.32)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.18);
  });

  animar('Las Bóvedas de Helia', function (tl, s) { lamina(tl, s, 0.28); });
  animar('Cayó Helia', function (tl, s) { lamina(tl, s, 0.2); });

  animar('Doce años de miedo', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.55 }, 0)
      .from(q(s, '[data-numerote]'), { y: 34, opacity: 0, duration: 0.7, stagger: 0.16 }, 0.14)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 0.82)
      .from(s.querySelector('[data-sello]'), { opacity: 0, duration: 0.6 }, 1.1);
  });

  animar('Khom', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.55 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.7 }, 0.12)
      .from(q(s, '[data-item]'), { x: 26, opacity: 0, duration: 0.4, stagger: 0.12 }, 0.44)
      .from(s.querySelector('[data-hueco]'), { opacity: 0, duration: 0.75 }, 0.96)
      .from(s.querySelector('[data-sello]'), { opacity: 0, duration: 0.55 }, 1.34);
  });

  animar('Ryze', function (tl, s) { lamina(tl, s, 0.2); });

  animar('Veintidós años', function (tl, s) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.08, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.15 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.1)
      .from(s.querySelector('[data-veintidos]'), { y: 30, opacity: 0, duration: 0.65 }, 0.26)
      .from(s.querySelector('[data-arte]'), { y: 28, scale: 0.96, opacity: 0, duration: 0.7 }, 0.62)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.12);
  });

  animar('El Bastión Inmortal', function (tl, s) { lamina(tl, s, 0.18); });

  animar('La Rosa Negra', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.65 }, 0.1)
      .from(q(s, '[data-carta]'), { x: -28, opacity: 0, duration: 0.5, stagger: 0.14 }, 0.36);
  });

  animar('La traición', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.65 }, 0.1)
      .from(q(s, '[data-carta]'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.16 }, 0.38)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.14);
  });

  animar('Demacia', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.65 }, 0.1)
      .from(q(s, '[data-carta]'), { y: 26, scale: 0.95, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.36)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.1);
  });

  animar('Ixtal', function (tl, s) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.08, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.15 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.1)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.65 }, 0.22)
      .from(q(s, '[data-carta]'), { x: 30, opacity: 0, duration: 0.55, stagger: 0.16 }, 0.5)
      .from(s.querySelector('[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.18);
  });

  animar('Targón', function (tl, s) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.08, opacity: 0, duration: 1.2 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.15 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.1)
      .from(s.querySelector('[data-arte]'), { y: 28, scale: 0.96, opacity: 0, duration: 0.7 }, 0.24)
      .from(s.querySelector('[data-a="up2"]'), { y: 28, opacity: 0, duration: 0.6 }, 0.68)
      .from(q(s, '[data-carta]'), { y: 26, opacity: 0, duration: 0.55, stagger: 0.14 }, 0.96);
  });

  animar('Nocturne', function (tl, s) { lamina(tl, s, 0.2); });

  animar('Los que ganaron', function (tl, s) {
    tl.from(s.querySelector('[data-fondo]'), { scale: 1.08, opacity: 0, duration: 1.25 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.2 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.1)
      .from(s.querySelector('[data-arte]'), { y: 30, scale: 0.96, opacity: 0, duration: 0.75 }, 0.24)
      .from(s.querySelector('[data-remate]'), { y: 30, opacity: 0, duration: 0.7 }, 0.82);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guerras Rúnicas · assets del episodio</title>
${kit.og({ titulo: "Guerras Rúnicas · assets del episodio", descripcion: "Material gráfico del episodio 1 de la serie de lore: una lámina por bloque del guion, con el arte oficial que sí existe y los huecos declarados donde no lo hay.", carpeta: "guerras" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(65,196,232,0.45); border-radius: 999px;
    background: rgba(7,7,11,0.85); color: ${RUNA}; cursor: pointer;
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

// kit.diferir: todo lo que no sea la portada sale con data-src/data-bg, para
// que al entrar el navegador solo descargue los assets de la primera lámina.
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
