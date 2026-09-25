// Generador de index.html — La Ruina de Helia · paquete de assets
// Ejecutar: node helia/gen.js
//
// **Episodio 2 de la serie de lore.** Igual que guerras/, esto **no es una
// presentación**: es material gráfico para cortar encima de la voz en off, una
// lámina por bloque del guion. Cada `data-screen-label` dice a qué parte del
// guion corresponde, para emparejarlas al editar. El encargo fue **poco texto**:
// cada lámina lleva el arte, una frase y como mucho una línea de apoyo.
//
// **Es la precuela del episodio 1, y es canon**: según la cronología de la
// wiki, la Ruina de Helia y el inicio de las Guerras Rúnicas caen en el mismo
// año (25 BN), y las guerras empiezan porque los artefactos de las bóvedas de
// Helia quedaron sueltos. La lámina 15 lo amarra con el mismo arte con el que
// abrió el episodio 1.
//
// ── Dos colores con significado ─────────────────────────────────────────
// Todo el arte de las Islas de la Sombra es verde espectral, y lo único cálido
// que existe de este arco es lo de antes de la Ruina: las Islas Bendecidas
// vivas, Helia y la ilustración de Isolde cosiendo la muñeca. El deck usa esa
// división tal cual: **dorado para el antes** (las islas, Helia, Isolde, la
// muñeca) y **verde espectral para el después** (la Ruina, los que ya no pueden
// morir). Es el recurso de ivern, que cambia de paleta cuando cambia la
// historia — aquí lo hace el propio arte.
//
// ── De dónde sale cada imagen ───────────────────────────────────────────
// El índice completo con códigos y URLs de los originales está en ASSETS.md.
//  · **Wiki oficial**: las Islas Bendecidas vivas, el barco entrando a Helia
//    por la niebla blanca, Viego e Isolde abrazados con la muñeca en la repisa
//    (concept de «Made with Love»), Isolde espectral, las ciudades hundidas, y
//    **«Made with Love»: Isolde cosiendo a Gwen**, que es el remate.
//  · **Legends of Runeterra**: las Bóvedas de Helia, Viego, Kalista, Hecarim,
//    un Heraldo de la Orden de Hierro, Thresh y la Niebla que avanza.
//  · **Data Dragon**: Hecarim, Kalista, Thresh y Gwen.
//  · `destruccion.jpg` es el mismo arte con el que abre guerras/.
//
// ⚠️ **Los assets NO pasan por optimizar-imagenes.mjs**, igual que en guerras:
// son el entregable y se guardan a 1600 px para que aguanten un push-in.
//
// ⚠️ **Nombres en español latino oficial** (verificados en las biografías es-MX
// por la investigación): **Islas Bendecidas** —no «Benditas», que es como lo
// dijo el episodio 1—, **la Ruina** —no «el Aciago», que es el evento
// recurrente de la Niebla— y Hecarim sin acento.
//
// ⚠️ Sin verificar y por eso sin fechas en pantalla: la wiki identifica al rey
// de Kalista con Viego, pero las dos biografías nunca se nombran entre sí. El
// guion lo narra como un hecho y las láminas lo siguen.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta La Ruina de Helia ─────────────────────────────────────────────
const BG = '#05090A';        // la niebla negra
const ORO = '#E3BE72';       // el antes: Helia, las islas vivas, Isolde
const ESPECTRO = '#4FE3C1';  // el después: la Ruina y los que no pueden morir
const BONE = '#ECEAE4';      // texto principal
const MUTED = '#7A8584';     // texto secundario

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}26 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Fondo: copia borrosa y oscurecida del mismo arte (helper de guerras).
const fondoBorroso = (src, alt) => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(54px) saturate(0.8) brightness(0.30); transform: scale(1.1);" role="img" aria-label="${alt}"></div>
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,9,10,0.70) 0%, rgba(5,9,10,0.50) 42%, rgba(5,9,10,0.88) 100%);"></div>
    </div>`;

// El arte, entero y sin recortar, **de borde a borde de la pantalla**: sale de
// la banda segura por los lados a propósito (−84 px a cada lado). La banda
// existe para que la interfaz de TikTok no tape texto; al arte no le importa
// que un icono le quede encima, y a lo ancho completo gana un 18 % de tamaño,
// que en un teléfono es la diferencia entre ver una ilustración y ver una
// miniatura. `qa-deck` lo reporta como desborde a lo ancho y es esperado.
const arte = (src, alt, extra = '') => `
      <img data-arte src="assets/${src}" alt="${alt}" style="width: calc(100% + 168px); max-width: none; margin: 0 -84px; height: auto; display: block; border-top: 1px solid rgba(255,255,255,0.12); border-bottom: 1px solid rgba(255,255,255,0.12); ${extra}">`;

const eyebrow = (txt, color) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin: 40px 0 20px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(5,9,10,0.9);">${txt}</span>
    </div>`;

const titulo = (txt, size = 104) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE}; text-shadow: 0 2px 20px rgba(5,9,10,0.8);">${txt}</h2>`;

const pie = (html) => `
      <p data-pie style="margin: 24px 0 0; font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.38;">${html}</p>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

// Lámina tipo: fondo borroso + arte entero + una frase + una línea de apoyo.
const lamina = ({ label, screen, notas, src, alt, color, ceja, frase, size, apoyo = '', extra = '' }) => `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${fondoBorroso(src, alt)}
    ${glow(color, '50% 32%', '120% 50%')}
    <div style="position: relative;">
      ${arte(src, alt)}
      ${eyebrow(ceja, color)}
      ${titulo(frase, size)}
      ${apoyo ? pie(apoyo) : ''}
      ${extra}
    </div>
  </section>`;

const slides = [];

// ── 01 · Portada ─────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada · el gancho" data-speaker-notes="Las Guerras Runicas empezaron porque cayo una isla. Y esa isla cayo porque un hombre no quiso enterrar a su esposa." style="${seccion()}">
    ${fondoBorroso('ciudades-hundidas.jpg', 'Las ciudades hundidas de las Islas de la Sombra')}
    ${glow(ESPECTRO, '50% 30%', '120% 48%')}
    <div style="position: relative;">
      ${arte('ciudades-hundidas.jpg', 'Las ciudades hundidas de las Islas de la Sombra')}
      ${eyebrow('Serie de lore · episodio 2', ESPECTRO)}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 176px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 30px rgba(5,9,10,0.9);"><span data-linea style="display: block;">LA RUINA</span><span data-linea style="display: block; color: ${ESPECTRO};">DE HELIA</span></h1>
      <p data-sub style="margin: 28px 0 0; font-size: 33px; font-weight: 500; color: ${MUTED}; line-height: 1.36;">Cayó porque un hombre <strong style="color: ${BONE};">no quiso enterrar a su esposa</strong>.</p>
    </div>
  </section>`);

// ── 02 · La niebla blanca ────────────────────────────────────────────────
slides.push(lamina({
  label: 'Niebla blanca', screen: '02 · Un archipiélago que no salía en los mapas',
  notas: 'Existio un archipielago que no salia en los mapas. Lo rodeaba una niebla blanca que solo se abria para quien llegaba de buena fe, y debajo tenia un manantial capaz de curar cualquier herida mortal. Le decian las Aguas de la Vida.',
  src: 'niebla-blanca.jpg', alt: 'Un barco llega a Helia a través de la niebla', color: ORO,
  ceja: 'No salía en los mapas',
  frase: 'Solo se abría<br>' + c('para quien llegaba<br>de buena fe', ORO), size: 100,
  extra: `
      <div data-chip style="margin-top: 34px; display: inline-flex; align-items: baseline; gap: 16px; padding: 16px 28px; border-radius: 999px; background: ${ORO}1A; border: 1px solid ${ORO}80;">
        <span style="font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${ORO};">Aguas de la Vida</span>
        <span style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">curaban cualquier herida mortal</span>
      </div>`,
}));

// ── 03 · Las Islas Bendecidas ────────────────────────────────────────────
slides.push(lamina({
  label: 'Islas Bendecidas', screen: '03 · Una orden de eruditos · las Islas Bendecidas',
  notas: 'Los que vivian ahi no hicieron un ejercito. Hicieron una orden de eruditos. La ciudad se llamaba Helia y a esas islas les decian las Islas Bendecidas.',
  src: 'islas-bendecidas.jpg', alt: 'Las Islas Bendecidas antes de la Ruina', color: ORO,
  ceja: 'No hicieron un ejército',
  frase: 'Las Islas<br>' + c('Bendecidas', ORO), size: 150,
  apoyo: 'Una orden de eruditos. Su ciudad se llamaba <strong style="color: ' + BONE + ';">Helia</strong>.',
}));

// ── 04 · Las bóvedas ─────────────────────────────────────────────────────
// El dato que amarra con el episodio 1, así que va solo y en grande.
slides.push(lamina({
  label: 'Las bóvedas', screen: '04 · Las bóvedas debajo de Helia',
  notas: 'Guardaban bajo llave, en bovedas debajo de su ciudad, los artefactos mas peligrosos que existian.',
  src: 'bovedas-helia.jpg', alt: 'Las Bóvedas de Helia, arte de Legends of Runeterra', color: ORO,
  ceja: 'Debajo de la ciudad, bajo llave',
  frase: 'Los artefactos<br>' + c('más peligrosos<br>del mundo', ORO), size: 110,
}));

// ── 05 · Viego ───────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Viego', screen: '05 · Camavor · el rey que nunca debió gobernar',
  notas: 'Del otro lado del mar habia un reino llamado Camavor. Su rey se llamaba Viego y nunca debio gobernar. Era el segundo hijo y le toco la corona nomas porque su hermano mayor se murio antes de tiempo.',
  src: 'viego.jpg', alt: 'Viego, arte de Legends of Runeterra', color: ORO,
  ceja: 'El rey de Camavor',
  frase: 'Viego nunca<br>' + c('debió gobernar', ORO), size: 118,
  apoyo: 'Era el segundo hijo. La corona le tocó porque su hermano se murió antes de tiempo.',
}));

// ── 06 · La costurera ────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Isolde', screen: '06 · El trono no le interesó · Isolde',
  notas: 'El trono no le intereso. Le intereso una costurera. Se llamaba Isolde. Viego se caso con ella y dejo de atender el reino por completo, asi que sus propios aliados conspiraron para quitarselo y sus enemigos mandaron un asesino.',
  src: 'viego-isolde.jpg', alt: 'Viego e Isolde, concept de Made with Love', color: ORO,
  ceja: 'El trono no le interesó',
  frase: 'Le interesó<br>' + c('una costurera', ORO), size: 128,
  apoyo: 'Se llamaba <strong style="color: ' + BONE + ';">Isolde</strong>.',
}));

// ── 07 · La daga ─────────────────────────────────────────────────────────
// La única lámina sin arte: el beat es de tres frases cortas y va en tipografía.
slides.push(`
  <section data-label="La daga" data-screen-label="07 · La daga" data-speaker-notes="La daga iba para el rey. Rozo a Isolde. Estaba envenenada." style="${seccion()}">
    ${glow(ORO, '40% 45%', '110% 55%')}
    <div style="position: relative;">
      <div data-golpe style="font-family: ${DISPLAY}; font-size: 150px; line-height: 0.9; text-transform: uppercase;">
        <span style="display: block; color: ${MUTED};">La daga iba</span>
        <span style="display: block; color: ${MUTED};">para el rey.</span>
      </div>
      <div data-golpe style="margin-top: 40px; font-family: ${DISPLAY}; font-size: 190px; line-height: 0.86; text-transform: uppercase; color: ${BONE};">Rozó a<br><span style="color: ${ORO};">Isolde.</span></div>
      <div data-golpe style="margin-top: 44px; font-size: 38px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: ${MUTED};">Estaba envenenada</div>
    </div>
  </section>`);

// ── 08 · Kalista ─────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Kalista', screen: '08 · Kalista busca la cura · llegó tarde',
  notas: 'El rey mando a su general mas leal, su sobrina Kalista, a buscar una cura a donde fuera. Kalista tardo anos y al final encontro las islas. Cuando volvio, la reina ya estaba muerta.',
  src: 'kalista.jpg', alt: 'Kalista, arte de Legends of Runeterra', color: ORO,
  ceja: 'Su sobrina, su general más leal',
  frase: 'Encontró la cura.<br>' + c('Llegó tarde.', ESPECTRO), size: 118,
  apoyo: 'Cuando volvió, la reina ya estaba muerta.',
}));

// ── 09 · Hecarim ─────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Hecarim', screen: '09 · Traidora · Hecarim la saca de la celda',
  notas: 'El rey la declaro traidora a la corona. El que la saco de la celda fue Hecarim, comandante de la Orden de Hierro. La convencio de guiar la flota a las islas para que el rey oyera la verdad de boca de los maestros y aceptara el entierro. Kalista acepto.',
  src: 'hecarim.jpg', alt: 'Hecarim, arte de Legends of Runeterra', color: ORO,
  ceja: 'El rey la declaró traidora',
  frase: 'La sacó de la celda<br>' + c('Hecarim', ORO), size: 112,
  apoyo: 'Comandante de la Orden de Hierro. La convenció de guiar la flota a las islas.',
}));

// ── 10 · Por la espalda ──────────────────────────────────────────────────
slides.push(lamina({
  label: 'Por la espalda', screen: '10 · Los maestros se niegan · la lanza',
  notas: 'En Helia los maestros se negaron. Dijeron que la muerte es definitiva. El rey le ordeno a Kalista matarlos, Kalista se nego y le pidio apoyo a Hecarim. Hecarim le clavo la lanza por la espalda, y mientras la Orden de Hierro la remataba se pusieron a saquear las bovedas.',
  src: 'orden-de-hierro.jpg', alt: 'Un heraldo de la Orden de Hierro, arte de Legends of Runeterra', color: ESPECTRO,
  ceja: '«La muerte es definitiva»',
  frase: 'Le clavó la lanza<br>' + c('por la espalda', ESPECTRO), size: 112,
  apoyo: 'Y la Orden de Hierro se puso a saquear las bóvedas.',
}));

// ── 11 · Thresh ──────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'Thresh', screen: '11 · El carcelero abrió la puerta',
  notas: 'La puerta que faltaba la abrio un carcelero. Llevaba anos solo custodiando esas bovedas porque nadie lo queria cerca. Se llamaba Thresh, y guio al rey hasta las Aguas por su propia voluntad, y se rio mientras despedazaban frente a el a los guardias del santuario.',
  src: 'thresh.jpg', alt: 'Thresh, arte de Legends of Runeterra', color: ESPECTRO,
  ceja: 'Nadie lo quería cerca',
  frase: 'La puerta la abrió<br>' + c('un carcelero', ESPECTRO), size: 112,
  apoyo: 'Guio al rey hasta las Aguas por su propia voluntad. <strong style="color: ' + BONE + ';">Y se rio.</strong>',
}));

// ── 12 · Las tres versiones ──────────────────────────────────────────────
// El centro del episodio. Tres columnas iguales, y la tercera es la que no
// cuenta nada — ese es el dato.
const versiones = [
  ['I', 'Isolde volvió como espectro y le clavó al rey su propia espada'],
  ['II', 'Volvió como cadáver y le pidió que la dejara morir otra vez'],
  ['III', 'Solo los que estuvieron ahí pueden contar lo que pasó'],
];
slides.push(`
  <section data-label="Tres versiones" data-screen-label="12 · Lo que pasó en la cámara · tres versiones" data-speaker-notes="De lo que paso adentro de esa camara hay tres versiones y ninguna coincide. La tercera es la mas honesta. Dice que solo los que estuvieron ahi pueden contar lo que de verdad paso. Y los que estuvieron ahi son justamente los que ya no pueden morir." style="${seccion()}">
    ${fondoBorroso('isolde-espectro.jpg', 'Isolde como espectro')}
    ${glow(ESPECTRO, '50% 30%', '120% 50%')}
    <div style="position: relative;">
      <img data-arte src="assets/isolde-espectro.jpg" alt="Isolde como espectro" style="width: 360px; height: 360px; object-fit: cover; display: block; border-radius: 50%; border: 2px solid ${ESPECTRO}80; box-shadow: 0 0 90px ${ESPECTRO}40;">
      ${eyebrow('Lo que pasó dentro de la cámara', ESPECTRO)}
      ${titulo('Tres versiones.<br>' + c('Ninguna coincide.', ESPECTRO), 104)}
      <div data-versiones style="margin-top: 34px; display: flex; flex-direction: column; gap: 12px;">
        ${versiones.map(([n, t], i) => `
        <div data-version style="display: flex; align-items: center; gap: 22px; padding: 18px 24px; border-radius: 14px; background: rgba(255,255,255,${i === 2 ? '0.06' : '0.03'}); border: 1px solid ${i === 2 ? ESPECTRO + '80' : 'rgba(255,255,255,0.10)'};">
          <span style="flex: none; width: 56px; font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${i === 2 ? ESPECTRO : MUTED};">${n}</span>
          <span style="font-size: 29px; font-weight: 600; color: ${i === 2 ? BONE : '#B7BDBB'}; line-height: 1.25;">${t}</span>
        </div>`).join('')}
      </div>
      <p data-remate style="margin: 30px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.34;">Y los que estuvieron ahí<br>${c('son los que ya no pueden morir.', ESPECTRO)}</p>
    </div>
  </section>`);

// ── 13 · La Ruina ────────────────────────────────────────────────────────
slides.push(lamina({
  label: 'La Ruina', screen: '13 · La Ruina · la niebla se vuelve negra',
  notas: 'De lo de afuera si hay registro. Una onda de energia oscura salio del subsuelo, sepulto Helia y se extendio por todo el archipielago. La niebla blanca se volvio negra, todo lo que estaba vivo murio al instante y ningun espiritu pudo irse.',
  src: 'niebla-negra.jpg', alt: 'La Niebla Negra avanza, arte de Legends of Runeterra', color: ESPECTRO,
  ceja: 'La Ruina',
  frase: 'La niebla blanca<br>' + c('se volvió negra', ESPECTRO), size: 118,
  apoyo: 'Todo lo vivo murió al instante. <strong style="color: ' + BONE + ';">Ningún espíritu pudo irse.</strong>',
}));

// ── 14 · En qué se convirtieron ──────────────────────────────────────────
const sobrevivientes = [
  ['Hecarim_0.jpg', 'Hecarim', 'Fusionado con su propio caballo', 'center 30%'],
  ['Kalista_0.jpg', 'Kalista', 'Solo recuerda su venganza', 'center 22%'],
  ['Thresh_0.jpg', 'Thresh', 'El único que lo disfrutó', 'center 25%'],
];
slides.push(`
  <section data-label="Los que quedaron" data-screen-label="14 · En qué se convirtieron · Islas de la Sombra" data-speaker-notes="Hecarim quedo fusionado con su propio caballo. Kalista desperto sin recordar nada mas que su venganza. Thresh fue de los primeros en ser reclamado y el unico que lo disfruto. Y desde ese dia las Islas Bendecidas se llaman Islas de la Sombra." style="${seccion()}">
    ${glow(ESPECTRO, '50% 40%', '120% 55%')}
    <div style="position: relative;">
      ${eyebrow('Los que ya no pueden morir', ESPECTRO)}
      <div data-trio style="display: flex; flex-direction: column; gap: 14px;">
        ${sobrevivientes.map(([img, nombre, que, pos]) => `
        <div data-quien style="position: relative; height: 250px; border-radius: 16px; overflow: hidden; border: 1px solid ${ESPECTRO}4D;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5,9,10,0.92) 0%, rgba(5,9,10,0.45) 55%, rgba(5,9,10,0) 100%);"></div>
          <div style="position: absolute; left: 26px; bottom: 22px; right: 40%;">
            <div style="font-family: ${DISPLAY}; font-size: 72px; line-height: 0.95; color: ${BONE};">${nombre}</div>
            <div style="margin-top: 4px; font-size: 25px; font-weight: 600; color: ${ESPECTRO}; line-height: 1.2;">${que}</div>
          </div>
        </div>`).join('')}
      </div>
      <div data-rebautizo style="margin-top: 38px; font-family: ${DISPLAY}; font-size: 84px; line-height: 0.95; text-transform: uppercase;">
        <span style="color: ${ORO}; text-decoration: line-through; text-decoration-thickness: 5px;">Islas Bendecidas</span><br>
        <span style="color: ${ESPECTRO};">Islas de la Sombra</span>
      </div>
    </div>
  </section>`);

// ── 15 · El amarre con el episodio 1 ─────────────────────────────────────
slides.push(lamina({
  label: 'El amarre', screen: '15 · El amarre · ese mismo año empezaron las Guerras Rúnicas',
  notas: 'Las bovedas de Helia guardaban los artefactos mas peligrosos del mundo, y cuando Helia cayo quedaron sueltos. Ese mismo ano empezaron las Guerras Runicas. Veintidos anos de gente matandose con las armas que ese archipielago existia para que nadie tocara.',
  src: 'destruccion.jpg', alt: 'Memorias de la destrucción, arte de la portada del episodio 1', color: ESPECTRO,
  ceja: 'Los artefactos quedaron sueltos',
  frase: 'Ese mismo año<br>' + c('empezaron las<br>Guerras Rúnicas', ESPECTRO), size: 108,
  apoyo: '<strong style="color: ' + BONE + ';">Veintidós años</strong> matándose con las armas que Helia existía para guardar.',
}));

// ── 16 · La muñeca ───────────────────────────────────────────────────────
// Vuelve el dorado: es lo único del antes que sobrevivió.
slides.push(lamina({
  label: 'La muñeca', screen: '16 · Isolde era costurera · la muñeca',
  notas: 'Falta un detalle. Isolde era costurera antes de ser reina. En un pueblo de Camavor le habia hecho una muneca de trapo, y jugaban a duelos de tijeras contra cubiertos debajo de la mesa de la cocina.',
  src: 'hecha-con-amor.jpg', alt: 'Isolde cosiendo la muñeca, ilustración Made with Love', color: ORO,
  ceja: 'Falta un detalle',
  frase: 'Isolde le hizo<br>' + c('una muñeca de trapo', ORO), size: 112,
  apoyo: 'Jugaban a duelos de tijeras contra cubiertos debajo de la mesa.',
}));

// ── 17 · Mil años después ────────────────────────────────────────────────
slides.push(lamina({
  label: 'Mil años', screen: '17 · Mil años después · Gwen',
  notas: 'Mil anos despues esa muneca desperto sola en una playa oscura. No se acordaba de su casa ni de su nombre ni de por que estaba viva.',
  src: 'Gwen_0.jpg', alt: 'Gwen, la Costurera Sagrada', color: ORO,
  ceja: 'Mil años después',
  frase: 'Despertó sola<br>' + c('en una playa oscura', ORO), size: 118,
  apoyo: 'No se acordaba de su casa, ni de su nombre, ni de por qué estaba viva.',
}));

// ── 18 · Viego. ──────────────────────────────────────────────────────────
// El cierre: una sola palabra. Sin arte, para que el nombre sea la imagen.
slides.push(`
  <section data-label="Un nombre" data-screen-label="18 · Cierre · un solo nombre" data-speaker-notes="De toda su vida anterior solo pudo recordar un nombre. Viego." style="${seccion('align-items: center; text-align: center;')}">
    ${glow(ORO, '50% 55%', '90% 40%')}
    <div style="position: relative;">
      <p data-previo style="margin: 0; font-size: 36px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">De toda su vida anterior<br>solo pudo recordar un nombre</p>
      <div data-nombre style="margin-top: 60px; font-family: ${DISPLAY}; font-size: 300px; line-height: 0.8; letter-spacing: 6px; color: ${ORO}; text-shadow: 0 0 120px rgba(227,190,114,0.35);">VIEGO</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Una sola entrada para todas las láminas de arte, porque son material para
// cortar: el arte aparece con un push-in, y el texto llega detrás.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  function uno(s, sel) { return s.querySelector(sel); }

  function base(tl, s) {
    var a = uno(s, '[data-arte]');
    if (uno(s, '[data-fondo]')) tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 1.0 }, 0);
    if (a) tl.from(a, { y: 30, scale: 1.04, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.05);
    if (uno(s, '[data-a="up"]')) tl.from(uno(s, '[data-a="up"]'), { y: 22, opacity: 0, duration: 0.45 }, 0.5);
    if (uno(s, '[data-a="up2"]')) tl.from(uno(s, '[data-a="up2"]'), { y: 32, opacity: 0, duration: 0.6 }, 0.62);
    if (uno(s, '[data-pie]')) tl.from(uno(s, '[data-pie]'), { y: 20, opacity: 0, duration: 0.5 }, 1.0);
    if (uno(s, '[data-chip]')) tl.from(uno(s, '[data-chip]'), { scale: 0.88, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, 1.05);
  }

  ['Niebla blanca', 'Islas Bendecidas', 'Las bóvedas', 'Viego', 'Isolde', 'Kalista', 'Hecarim',
   'Por la espalda', 'Thresh', 'La Ruina', 'El amarre', 'La muñeca', 'Mil años'].forEach(function (l) { animar(l, base); });

  animar('Portada', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 1.0 }, 0)
      .from(uno(s, '[data-arte]'), { y: 30, scale: 1.04, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.05)
      .from(uno(s, '[data-a="up"]'), { y: 22, opacity: 0, duration: 0.45 }, 0.45)
      .from(q(s, '[data-linea]'), { y: 50, opacity: 0, duration: 0.7, stagger: 0.14 }, 0.58)
      .from(uno(s, '[data-sub]'), { y: 20, opacity: 0, duration: 0.5 }, 1.12);
  });

  // Tres golpes, uno por frase.
  animar('La daga', function (tl, s) {
    tl.from(q(s, '[data-golpe]'), { y: 40, opacity: 0, duration: 0.55, stagger: 0.42, ease: 'power3.out' }, 0.1);
  });

  // Las versiones caen en orden; la tercera, la que no cuenta nada, al final.
  animar('Tres versiones', function (tl, s) {
    tl.from(uno(s, '[data-fondo]'), { opacity: 0, duration: 1.0 }, 0)
      .from(uno(s, '[data-arte]'), { scale: 0.8, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.05)
      .from(uno(s, '[data-a="up"]'), { y: 22, opacity: 0, duration: 0.45 }, 0.3)
      .from(uno(s, '[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.55 }, 0.42)
      .from(q(s, '[data-version]'), { x: -30, opacity: 0, duration: 0.42, stagger: 0.16 }, 0.78)
      .from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.45 }, 1.3);
  });

  // Los tres caen uno tras otro, y el nombre de las islas se tacha al final.
  animar('Los que quedaron', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 22, opacity: 0, duration: 0.45 }, 0)
      .from(q(s, '[data-quien]'), { x: -40, opacity: 0, duration: 0.5, stagger: 0.16 }, 0.14)
      .from(uno(s, '[data-rebautizo]'), { y: 26, opacity: 0, duration: 0.55 }, 0.9);
  });

  // El nombre llega solo, después de la frase, como en el guion.
  animar('Un nombre', function (tl, s) {
    tl.from(uno(s, '[data-previo]'), { y: 20, opacity: 0, duration: 0.6 }, 0.1)
      .from(uno(s, '[data-nombre]'), { scale: 0.86, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.8);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>La Ruina de Helia</title>
${kit.og({ titulo: "La Ruina de Helia", descripcion: "Las Guerras Rúnicas empezaron porque cayó una isla, y esa isla cayó porque un hombre no quiso enterrar a su esposa. Episodio 2 de la serie de lore: assets para el video.", carpeta: "helia" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(79,227,193,0.45); border-radius: 999px;
    background: rgba(5,9,10,0.85); color: ${ESPECTRO}; cursor: pointer;
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
