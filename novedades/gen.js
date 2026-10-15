// Generador de index.html — Lo nuevo del kit (cuaderno de novedades)
// Ejecutar: node novedades/gen.js
//
// Explica, con demos vivas, lo que se sumó al proyecto en octubre de 2026:
// GSAP 3.15 y sus plugins (kit.gsap), el catálogo de recetas (kit.efectos),
// la segunda tanda de efectos SVG (docs/efectos-svg.md), los patrones, íconos
// e ilustraciones de build-time, y la auditoría del módulo de video.
//
// Es para leer en la compu, no B-roll: 16:9, texto a la izquierda y a la
// derecha una «pantalla» oscura con la receta corriendo. Cada demo usa la
// misma línea que aparece en el código de su lámina.
//
// Los splashes y retratos son de Data Dragon (copiados de lab/); los íconos,
// Tabler, Lucide y Phosphor (MIT/ISC) y game-icons (CC BY 3.0, crédito en
// CREDITOS.md); la ilustración, Open Doodles (CC0).
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad: cuaderno de papel con pantallas ───────────────────────────
// Papel y tinta para el texto, azul ultramar de acento (ningún otro deck lo
// usa) y las demos dentro de una pantalla casi negra, que es donde se ven
// mejor los efectos de luz (brasa, contorno, cometa).
const PAPEL = '#F2EEE5';
const TINTA = '#17150F';
const GRIS = '#5F5A4F';
const AZUL = '#3346FF';
const PANTALLA = '#0E0F16';
const CLARO = '#ECEAF2';
const AZUL_CLARO = '#8C98FF';
const NARANJA = '#FF8A3D';
const VERDE = '#3FD68A';
const APAGADO = '#7D7A8C';

const SERIF = `'Instrument Serif', Georgia, serif`;
const SANS = `'Geist', system-ui, sans-serif`;
const MONO = `'Geist Mono', ui-monospace, monospace`;
const DISPLAY = `'Bebas Neue', Impact, sans-serif`;

const W = 960, H = 800;   // la pantalla de las demos

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SECCION = `background: ${PAPEL}; font-family: ${SANS}; color: ${TINTA}; padding: 90px 110px; box-sizing: border-box; overflow: hidden; position: relative;`;

// Resaltado mínimo para los bloques de código: comentarios, cadenas,
// atributos data-* y llamadas del kit.
const codigo = (texto, tam = 19) => {
  const h = esc(texto)
    .replace(/(\/\/[^\n]*)/g, `<span style="color:${APAGADO}">$1</span>`)
    .replace(/(&quot;.*?&quot;|'[^'\n]*')/g, `<span style="color:#FFC58A">$1</span>`)
    .replace(/\b(data-[a-z-]+)/g, `<span style="color:${AZUL_CLARO}">$1</span>`)
    .replace(/(?<![\w-])(kit\.[a-zA-Z]+|efecto|animar)\b/g, `<span style="color:#7FE0C3">$1</span>`);
  return `<pre data-a="up3" style="margin: 34px 0 0; padding: 22px 26px; border-radius: 14px; background: ${PANTALLA}; color: ${CLARO}; font: 500 ${tam}px/1.6 ${MONO}; white-space: pre-wrap;">${h}</pre>`;
};
const chips = (lista, color = AZUL) => `<div data-a="up2" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px;">${lista.map((c) =>
  `<span style="padding: 8px 14px; border-radius: 999px; border: 1.5px solid ${color}; color: ${color}; font: 500 18px/1 ${MONO};">${c}</span>`).join('')}</div>`;
const imagen = (src, alt, pos = '50% 30%', extra = '') =>
  `<img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block; ${extra}">`;
const etiqueta = (t) => `<span style="position:absolute;left:16px;bottom:14px;z-index:5;padding:6px 10px;border-radius:8px;background:rgba(14,15,22,.78);color:${CLARO};font:500 16px/1 ${MONO}">${t}</span>`;

let n = 0;
const slides = [];
const num = () => String(n).padStart(2, '0');

/** Lámina de dos columnas: lo que es a la izquierda, la demo a la derecha. */
const lamina = ({ nombre, grupo, titulo, texto, extra = '', code = '', tamCodigo, demo, fondoPantalla = PANTALLA, notas = '' }) => {
  n++;
  slides.push(`
  <section data-label="${nombre}" data-screen-label="${num()} · ${nombre}" data-speaker-notes="${esc(notas)}" style="${SECCION}">
    <div style="display: grid; grid-template-columns: 660px ${W}px; gap: 80px; height: 100%; align-items: center;">
      <div>
        <div data-a="up" style="font: 500 18px/1 ${MONO}; letter-spacing: 3px; text-transform: uppercase; color: ${AZUL};">${num()} · ${grupo}</div>
        <h2 data-a="up" style="margin: 20px 0 0; font: 400 88px/0.98 ${SERIF}; letter-spacing: -1px;">${titulo}</h2>
        <p data-a="up2" style="margin: 26px 0 0; font: 400 25px/1.5 ${SANS}; color: ${GRIS};">${texto}</p>
        ${extra}
        ${code ? codigo(code, tamCodigo) : ''}
      </div>
      <div data-pantalla style="position: relative; width: ${W}px; height: ${H}px; border-radius: 26px; overflow: hidden; background: ${fondoPantalla}; display: flex; align-items: center; justify-content: center;">${demo}</div>
    </div>
  </section>`);
};

// Mancha y estrella para MorphSVG (mismo dibujo que lab/, centrado en la pantalla).
const { prng } = require('../tools/kit-patrones.cjs');
const forma = (semilla, puntas, cx, cy, escala) => {
  const r = prng(semilla), N = puntas || 9, pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, rad = (puntas ? (i % 2 ? 150 : 330) : 230 + r() * 120) * escala;
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  if (puntas) return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map((v) => v.toFixed(1)).join(' ')} ${c2.map((v) => v.toFixed(1)).join(' ')} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};

// ── 1 · Portada ──────────────────────────────────────────────────────────
n++;
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="${esc('El arte de la derecha es el efecto contorno: las líneas salen de la propia imagen y luego entra a color.')}" style="${SECCION}">
    <div style="display: grid; grid-template-columns: 660px ${W}px; gap: 80px; height: 100%; align-items: center;">
      <div>
        <div data-a="up" style="font: 500 18px/1 ${MONO}; letter-spacing: 3px; text-transform: uppercase; color: ${AZUL};">Cuaderno de novedades · octubre 2026</div>
        <h1 data-efecto="lineas" data-en="0.15" style="margin: 26px 0 0; font: 400 150px/0.92 ${SERIF}; letter-spacing: -2px;">Lo nuevo<br>del <em style="color: ${AZUL};">kit</em></h1>
        <p data-a="up2" style="margin: 34px 0 0; font: 400 27px/1.5 ${SANS}; color: ${GRIS};">Todo lo que se sumó al proyecto en las últimas tandas: el motor de animación, 35 recetas, assets generativos y un video que se arma hasta veinte veces más rápido. Cada lámina trae una demo viva y la línea exacta para usarla.</p>
        <div data-a="up3" style="margin-top: 40px; font: 500 18px/1 ${MONO}; color: ${GRIS};">← → para avanzar · P para presentar</div>
      </div>
      <div data-efecto="contorno" data-en="0.5" data-dur="1.8" style="position: relative; width: ${W}px; height: ${H}px; border-radius: 26px; overflow: hidden; background: ${PANTALLA};">
        ${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}${kit.contorno(__dirname + '/assets/Jinx_0.jpg', { ancho: W, alto: H, posicion: [0.62, 0.3], color: CLARO })}
      </div>
    </div>
  </section>`);

// ── 2 · Mapa ─────────────────────────────────────────────────────────────
const FRENTES = [
  ['tabler:engine', 'El motor', 'GSAP 3.15 con todos sus plugins, copiado a cada deck con kit.gsap().', '04'],
  ['tabler:wand', '27 recetas', 'La primera tanda: texto, imagen, contenedores, transiciones y SVG, declaradas con data-efecto.', '05'],
  ['tabler:flame', '8 efectos SVG', 'Quemado, tinta, contorno, cometa, sello, ventana, cámara y línea.', '09'],
  ['tabler:palette', 'Assets generativos', 'Patrones con semilla, íconos de Iconify e ilustraciones recoloreadas.', '18'],
  ['tabler:movie', 'Video', 'Captura y render en paralelo, voz en caché y transiciones entre láminas.', '20'],
  ['tabler:flask', 'El laboratorio', '/lab/ — el catálogo vivo, una lámina por receta con la línea para copiarla.', '24'],
];
n++;
slides.push(`
  <section data-label="Mapa" data-screen-label="02 · Mapa" data-speaker-notes="${esc('Los seis frentes de la actualización; el número de cada tarjeta es la lámina donde empieza.')}" style="${SECCION}">
    <div data-a="up" style="font: 500 18px/1 ${MONO}; letter-spacing: 3px; text-transform: uppercase; color: ${AZUL};">02 · Qué cambió</div>
    <h2 data-a="up" style="margin: 20px 0 0; font: 400 96px/0.98 ${SERIF}; letter-spacing: -1px;">Seis <em>frentes</em></h2>
    <div data-efecto="bento" data-desde="start" data-en="0.35" data-escala="0.85" style="margin-top: 64px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
      ${FRENTES.map(([ic, t, d, l]) => `<div style="position: relative; padding: 40px 44px 44px; border-radius: 24px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(23,21,15,.06), 0 14px 34px rgba(23,21,15,.07);">
        ${kit.icono(ic, { tam: 72, color: AZUL, trazo: 1.5 })}
        <div style="margin-top: 22px; font: 400 56px/1 ${SERIF};">${t}</div>
        <div style="margin-top: 14px; font: 400 23px/1.45 ${SANS}; color: ${GRIS};">${d}</div>
        <div style="position: absolute; top: 44px; right: 44px; font: 500 20px/1 ${MONO}; color: ${GRIS};">→ ${l}</div>
      </div>`).join('')}
    </div>
  </section>`);

// ── 3 · Cómo se usa ──────────────────────────────────────────────────────
lamina({ nombre: 'Cómo se usa', grupo: 'Lo básico', titulo: 'Tres formas de <em>pedir</em> un efecto',
  texto: 'Casi todo se declara en el HTML: al entrar a la lámina, el animador lee <b>data-efecto</b> y sus opciones <b>data-*</b>. Para un orden fino se llama <b>efecto()</b> dentro de <b>animar()</b>. Y los que necesitan un filtro o una máscara traen su pieza de build-time.',
  code: [
    '<h1 data-efecto="letras" data-desde="center">JINX</h1>',
    '',
    "animar('Mi lámina', (tl, s) => {",
    "  efecto('revuelto', tl, s.querySelector('p'), { en: 0.6 });",
    '});',
    '',
    '${kit.quemado()}   // emite el filtro, una vez por deck',
  ].join('\n'),
  notas: 'Reglas de todas las recetas: sin azar, seekeables, estados iniciales con from() y lo que tocan del DOM se deshace solo.',
  demo: `<div style="text-align: center;">
    <div data-efecto="letras" data-desde="center" data-en="0.3" style="font: 400 330px/0.85 ${DISPLAY}; color: ${CLARO};">JINX</div>
    <div data-efecto="revuelto" data-en="0.9" data-dur="1.3" style="margin-top: 30px; font: 500 40px/1 ${MONO}; letter-spacing: 6px; color: ${AZUL_CLARO};">SIEMPRE IGUAL</div>
    <div data-a="up3" style="margin-top: 26px; font: 400 22px/1.4 ${SANS}; color: ${APAGADO};">el revuelto usa un hash, no Math.random:<br>en el video sale idéntico cada vez</div></div>` });

// ── 4 · El motor ─────────────────────────────────────────────────────────
lamina({ nombre: 'El motor', grupo: 'Motor', titulo: 'GSAP 3.15, <em>completo</em>',
  texto: 'Desde la 3.13 todos los plugins de GSAP son gratis. <b>kit.gsap()</b> copia a la carpeta del deck solo los que pide y los registra, así que el deck sigue autocontenido. Los decks viejos se quedan en 3.12.5 sin tocar.',
  extra: chips(['SplitText', 'DrawSVG', 'MorphSVG', 'MotionPath', 'ScrambleText', 'CustomEase', 'CustomWiggle', 'Physics2D', 'Text', 'EasePack', 'Flip*']) +
    `<div data-a="up2" style="margin-top: 16px; font: 400 19px/1.45 ${SANS}; color: ${GRIS};">* Flip no sirve dentro de deck-stage, que escala el lienzo en su shadow DOM: las recetas que lo usarían hacen FLIP a mano.</div>`,
  code: "${kit.gsap(__dirname, ['SplitText', 'DrawSVG', 'MorphSVG', 'MotionPath'])}",
  notas: 'La demo: MorphSVG convierte la mancha en estrella y MotionPath lleva el cohete por el camino punteado.',
  demo: `<svg viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px;overflow:visible">
    <path id="nov-mancha" d="${forma('mancha-a', 0, 480, 400, 0.95)}" style="display:none"/>
    <path id="nov-camino" d="M70 720 C 160 380, 380 820, 470 460 S 740 170, 840 140" fill="none" stroke="${APAGADO}" stroke-width="4" stroke-dasharray="4 18" stroke-linecap="round"/>
    <path data-efecto="transforma" data-desde="#nov-mancha" data-en="0.3" data-dur="1.4" d="${forma('estrella', 10, 480, 400, 0.95)}" fill="${AZUL}" opacity="0.9"/>
    <g data-efecto="trayectoria" data-camino="#nov-camino" data-girar="45" data-en="0.4" data-dur="1.8">${kit.icono('lucide:rocket', { tam: 110, color: NARANJA, trazo: 2 }).replace('<svg ', '<svg x="-55" y="-55" ')}</g></svg>` });

// ── 5 · Texto ────────────────────────────────────────────────────────────
const celda = (t, cuerpo, fondo = '#161722') => `<div style="position:relative;display:flex;align-items:center;justify-content:center;border-radius:18px;background:${fondo};overflow:hidden">${cuerpo}<span style="position:absolute;left:18px;top:16px;font:500 16px/1 ${MONO};color:${fondo === PAPEL ? GRIS : APAGADO}">${t}</span></div>`;
lamina({ nombre: 'Texto', grupo: 'Recetas', titulo: 'Ocho recetas de <em>texto</em>',
  texto: 'Todas parten el texto con SplitText y se deshacen solas al salir de la lámina, así que volver a entrar no lo parte dos veces. La Ñ ya no se corta: la máscara de las líneas lleva aire arriba.',
  extra: chips(['lineas', 'letras', 'revuelto', 'maquina', 'marcatextos', 'tragamonedas', 'brillo', 'contador']),
  code: '<span data-efecto="marcatextos" data-color="#FFD640">nuevo</span>\n<b data-efecto="contador" data-cuenta="9904026">…</b>',
  demo: `<div style="width:100%;height:100%;padding:20px;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px">
    ${celda('tragamonedas', `<div data-efecto="tragamonedas" data-en="0.3" style="font:400 190px/1 ${DISPLAY};color:${CLARO}">2026</div>`)}
    ${celda('contador', `<div data-efecto="contador" data-cuenta="9904026" data-en="0.4" data-dur="1.6" style="font:400 104px/1 ${DISPLAY};color:${AZUL_CLARO}">9 904 026</div>`)}
    ${celda('maquina', `<div data-efecto="maquina" data-en="0.6" data-ritmo="0.05" data-color="${NARANJA}" style="font:500 26px/1.4 ${MONO};color:${CLARO};white-space:nowrap">node novedades/gen.js</div>`)}
    ${celda('marcatextos', `<div style="font:400 58px/1.1 ${SERIF};color:${TINTA};text-align:center;padding:0 30px">el valor<br><span data-efecto="marcatextos" data-en="0.9" data-color="#FFD640">nuevo</span> va aquí</div>`, PAPEL)}
  </div>` });

// ── 6 · Imagen ───────────────────────────────────────────────────────────
const CW = 450, CH = 370;
lamina({ nombre: 'Imagen', grupo: 'Recetas', titulo: 'La imagen <em>entra</em> de nueve formas',
  texto: 'empuje, cuatro cortinillas (persiana, iris, diagonal y tajo), pincel, duotono, glitch, rebanadas y parallax. Ninguna toca el archivo: la imagen sigue pasando por <b>kit.diferir</b> y por el optimizador.',
  code: '<div data-efecto="cortinilla" data-forma="tajo">…</div>\n${kit.duotono(id, oscuro, claro)} + data-efecto="duotono"',
  demo: `${kit.duotono('nov-duotono', '#10121F', AZUL_CLARO)}${kit.glitch('nov-glitch')}
    <div style="width:100%;height:100%;padding:20px;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px">
    <div data-efecto="pincel" data-en="0.25" data-dur="1.1" data-escalon="0.1" style="position:relative;border-radius:16px;overflow:hidden;background:#161722">${kit.pincel('assets/Jinx_0.jpg', 'Jinx', { ancho: CW, alto: CH })}${etiqueta('pincel')}</div>
    <div style="position:relative;border-radius:16px;overflow:hidden"><div data-efecto="duotono" data-filtro="nov-duotono" data-en="0.5" style="width:100%;height:100%">${imagen('Vi_0.jpg', 'Vi', '60% 30%')}</div>${etiqueta('duotono')}</div>
    <div style="position:relative;border-radius:16px;overflow:hidden"><div data-efecto="glitch" data-filtro="nov-glitch" data-en="0.4" style="width:100%;height:100%">${imagen('Viktor_0.jpg', 'Viktor', '50% 35%')}</div>${etiqueta('glitch')}</div>
    <div style="position:relative;border-radius:16px;overflow:hidden;background:#161722"><div data-efecto="cortinilla" data-forma="tajo" data-en="0.7" style="width:100%;height:100%">${imagen('Jinx_0.jpg', 'Jinx', '70% 25%')}</div>${etiqueta('cortinilla · tajo')}</div>
  </div>` });

// ── 7 · Contenedores ─────────────────────────────────────────────────────
const CARTAS = ['Caitlyn', 'Ekko', 'Jinx', 'Vi', 'Viktor', 'Warwick'];
lamina({ nombre: 'Contenedores', grupo: 'Recetas', titulo: 'Contenedores que se <em>arman</em>',
  texto: 'bento, crece, reordena, borde, voltea y mazo. <b>crece</b> y <b>reordena</b> miden con offsetLeft/offsetTop en vez del plugin Flip, que dentro de deck-stage dejaba la pieza desplazada a mitad de camino.',
  extra: chips(['bento', 'crece', 'reordena', 'borde', 'voltea', 'mazo']),
  code: '<div data-efecto="mazo" data-semilla="arcane">\n  …seis cartas…\n</div>',
  demo: `<div data-efecto="mazo" data-semilla="arcane" data-en="0.3" style="width:880px;height:720px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:20px">
    ${CARTAS.map((c) => `<div style="border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.45)"><img src="assets/cartas/${c}.jpg" alt="${c}" style="width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block"></div>`).join('')}</div>` });

// ── 8 · Transiciones ─────────────────────────────────────────────────────
const XFADE = ['fade', 'smoothleft', 'smoothup', 'circleopen', 'circleclose', 'radial', 'pixelize', 'dissolve', 'zoomin',
  'slideup', 'wipeleft', 'hblur', 'fadeblack', 'diagtl', 'squeezeh', 'coverleft', 'revealup', 'hlwind', 'vertopen', 'distance'];
lamina({ nombre: 'Transiciones', grupo: 'Recetas', titulo: 'Transiciones, en el deck <em>y</em> en el video',
  texto: 'En el deck, <b>cortina</b> e <b>iris</b> abren la lámina entera (esta entró con una cortina). En el video, el guion pide cualquiera de las 57 transiciones de xfade —para todo el video o lámina por lámina— sin mover la voz ni los subtítulos.',
  code: '// todo el video\n"transicion": "smoothleft"\n// solo la que entra a la lámina 4\n{ "slide": 4, "transicion": "circleopen" }\n// corte seco\n{ "slide": 5, "transicion": "corte" }',
  demo: `<div data-efecto="cortina" data-color="${TINTA}" data-color2="${AZUL}" data-direccion="izquierda"></div>
    <div data-efecto="bento" data-en="0.7" data-desde="start" data-escalon="0.04" style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;padding:60px">
    ${XFADE.map((x, i) => `<span style="padding:14px 22px;border-radius:12px;background:${x === 'smoothleft' || x === 'circleopen' ? AZUL : '#1B1D2A'};color:${CLARO};font:500 26px/1 ${MONO}">${x}</span>`).join('')}
    <span style="padding:14px 22px;border-radius:12px;border:1.5px dashed ${APAGADO};color:${APAGADO};font:500 26px/1 ${MONO}">+37 más</span></div>` });

// ── 9 · Segunda tanda ────────────────────────────────────────────────────
const COMETAS = ['M30 700 C 220 650, 300 330, 520 360 S 840 260, 930 80', 'M30 430 C 260 520, 420 160, 640 230 S 840 460, 930 380',
  'M110 790 C 180 540, 520 660, 560 480 S 720 150, 920 190'];
lamina({ nombre: 'Segunda tanda', grupo: 'Segunda tanda', titulo: 'Ocho efectos <em>nuevos</em>, casi todo SVG',
  texto: 'Salen de <b>docs/efectos-svg.md</b>, que propuso 25 y recomendó estos 8. Ninguno usa azar: el ruido lleva semilla fija y los puntos que viajan se calculan en cada cuadro, así que el video cuadro a cuadro sale igual cada vez.',
  extra: chips(['quemado', 'tinta', 'contorno', 'cometa', 'sello', 'ventana', 'cámara', 'línea'], NARANJA),
  notas: 'Las siguientes ocho láminas son una por efecto, con su línea de uso.',
  demo: `<div style="position:relative;width:100%;height:100%">
    <svg data-efecto="cometa" data-en="0.2" data-dur="1.5" data-radio="9" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0;width:100%;height:100%">
      ${COMETAS.map((d, i) => `<path data-camino d="${d}" fill="none" stroke="${[NARANJA, AZUL_CLARO, CLARO][i]}" stroke-width="${[7, 5, 3][i]}" stroke-linecap="round" opacity=".85"/>`).join('')}</svg>
    <div data-efecto="sello" data-en="1.5" style="position:absolute;left:50%;top:50%;width:560px;margin:-110px 0 0 -280px">${kit.sello('NUEVO', { color: NARANJA, ancho: 560, alto: 220 })}</div></div>` });

// ── 10–17 · Uno por efecto ───────────────────────────────────────────────
const S2 = (i) => `Segunda tanda · ${i}/8`;
const para = (t) => `<div data-a="up2" style="margin-top: 22px; padding-left: 18px; border-left: 3px solid ${NARANJA}; font: 400 21px/1.45 ${SANS}; color: ${GRIS};"><b style="color:${TINTA}">Para:</b> ${t}</div>`;

lamina({ nombre: 'Quemado', grupo: S2(1), titulo: '<em>Quemado</em>',
  texto: 'Un filtro SVG con ruido fijo y dos umbrales. GSAP mueve el umbral y la imagen aparece a manchas con un borde de brasa. Con <b>data-hacia="deshace"</b> se quema al revés, para despedir un arte.',
  extra: para('skin vieja → rework, el Vacío, la serie de lore.'),
  code: "${kit.quemado('efx-quemado', { brasa: '#FF7A1A' })}\n<div data-efecto=\"quemado\" data-dur=\"1.8\">\n  <img src=\"assets/jinx.jpg\">\n</div>",
  demo: `${kit.quemado('efx-quemado', { brasa: NARANJA })}<div data-efecto="quemado" data-en="0.3" data-dur="1.8" style="width:100%;height:100%">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}</div>` });

lamina({ nombre: 'Tinta', grupo: S2(2), titulo: '<em>Tinta</em>',
  texto: 'Una mancha orgánica crece desde un punto y destapa el arte. Es una máscara SVG —un círculo deformado con ruido— sobre el <b>&lt;img&gt;</b> de siempre, así que la imagen sigue diferida y optimizada.',
  extra: para('entrada de cartas de Legends of Runeterra, láminas de lore.'),
  code: "${kit.tinta('efx-tinta', { ancho: 960, alto: 800, origen: [0.3, 0.7] })}\n<div data-efecto=\"tinta\">…</div>",
  demo: `${kit.tinta('efx-tinta', { ancho: W, alto: H, origen: [0.28, 0.72] })}<div data-efecto="tinta" data-en="0.3" data-dur="1.7" style="width:100%;height:100%">${imagen('Vi_0.jpg', 'Vi', '50% 30%')}</div>` });

lamina({ nombre: 'Contorno', grupo: S2(3), titulo: '<em>Contorno</em>',
  texto: 'El arte aparece primero como dibujo de líneas sacado de sí mismo y luego entra a color. Chrome lee la luminancia (<b>tools/contorno.mjs</b>), marching squares saca las curvas de nivel y se guardan en <b>tools/cache/contornos/</b>: 0,7 s la primera vez, 19 ms después.',
  extra: para('Cumplelolero: las líneas salen del propio arte, así que cumple «solo arte».'),
  code: "${kit.contorno(__dirname + '/assets/viktor.jpg', {\n  ancho: 960, alto: 800, posicion: [0.5, 0.35]\n})}",
  demo: `<div data-efecto="contorno" data-en="0.2" data-dur="1.8" style="position:relative;width:100%;height:100%">${imagen('Viktor_0.jpg', 'Viktor', '50% 35%')}${kit.contorno(__dirname + '/assets/Viktor_0.jpg', { ancho: W, alto: H, posicion: [0.5, 0.35], color: CLARO })}</div>` });

lamina({ nombre: 'Cometa', grupo: S2(4), titulo: '<em>Cometa</em>',
  texto: 'Un trazo que se dibuja con un punto brillante en la punta. El punto se calcula con <b>getPointAtLength()</b> en cada cuadro, sin MotionPath, así que saltar a cualquier tiempo da exactamente el mismo cuadro.',
  extra: para('rutas, mapas, gráficas, el camino de una pelea.'),
  code: '<svg data-efecto="cometa" data-radio="9">\n  <path data-camino d="M30 700 C…" stroke="#FF8A3D"/>\n</svg>',
  demo: `<svg data-efecto="cometa" data-en="0.25" data-dur="1.6" data-radio="10" viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px">
    ${COMETAS.map((d, i) => `<path data-camino d="${d}" fill="none" stroke="${[NARANJA, AZUL_CLARO, CLARO][i]}" stroke-width="${[8, 6, 3][i]}" stroke-linecap="round"/>`).join('')}</svg>` });

lamina({ nombre: 'Sello', grupo: S2(5), titulo: '<em>Sello</em>',
  texto: 'Cae desde grande, golpea y la pantalla tiembla. El temblor es una secuencia fija que se apaga, no un random, y los huecos de tinta salen de un ruido con semilla: el mismo sello siempre.',
  extra: para('«NERF», «HECHO», «sin registro», el veredicto de un parche.'),
  code: "<div data-efecto=\"sello\">\n  ${kit.sello('BUFFEADA', { color: '#3FD68A' })}\n</div>",
  demo: `<div style="position:relative;width:100%;height:100%">${imagen('Vi_0.jpg', 'Vi', '50% 30%', 'filter: saturate(0.5) brightness(0.62);')}
    <div data-efecto="sello" data-en="0.55" style="position:absolute;left:50%;top:50%;width:620px;margin:-120px 0 0 -310px">${kit.sello('BUFFEADA', { color: VERDE, ancho: 620, alto: 240, rotacion: -7 })}</div></div>` });

lamina({ nombre: 'Ventana', grupo: S2(6), titulo: '<em>Ventana</em>',
  texto: 'El nombre gigante es la ventana al arte; luego la cámara entra por las letras hasta la imagen completa. Es una máscara con el texto: el arte sigue siendo un <b>&lt;img&gt;</b> normal.',
  extra: para('la portada de Cumplelolero, donde el nombre es el dato.'),
  code: "${kit.ventana('ZAUN', { ancho: 960, alto: 800, origen: [0.4, 0.5] })}\n<div data-efecto=\"ventana\">…</div>",
  demo: `${kit.ventana('ZAUN', { ancho: W, alto: H, origen: [0.4, 0.5] })}<div data-efecto="ventana" data-en="0.7" data-dur="1.5" style="width:100%;height:100%">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}</div>` });

lamina({ nombre: 'Cámara', grupo: S2(7), titulo: '<em>Cámara</em>',
  texto: 'Paneo y zoom entre varios puntos del arte: la cara, el guante y el plano completo. Cada foco es <b>x% y% zoom</b>, y la cámara nunca enseña la orilla aunque el foco esté pegado a ella.',
  extra: para('B-roll de Cumplelolero; en los parches, el zoom al valor que cambió.'),
  code: '<div data-efecto="camara"\n     data-focos="70 40 2.6; 51 62 1.9; 50 50 1">\n  <img src="assets/vi.jpg">\n</div>',
  demo: `<div data-efecto="camara" data-focos="70 40 2.6; 51 62 1.9; 50 50 1" data-en="0.3" data-dur="1" style="width:100%;height:100%;overflow:hidden">${imagen('Vi_0.jpg', 'Vi', '50% 30%')}</div>` });

lamina({ nombre: 'Línea', grupo: S2(8), titulo: '<em>Línea</em>',
  texto: 'Gráfica de línea que se dibuja con el área destapándose, un punto en la punta y el valor contando junto a él. El camino sale en build-time con viewBox en píxeles reales, para que la longitud medida cuadre con la dibujada.',
  extra: para('horas por día en los reportes, el elo de un OTP por temporada.'),
  code: "<div data-efecto=\"linea\">\n  ${kit.grafica([1.2, 3.4, 2.9, 6.1, 9.9], {\n    etiquetas: ['2022', …], decimales: 1, sufijo: ' M'\n  })}\n</div>",
  demo: `<div style="width:860px">
    <div data-a="up3" style="font:500 18px/1 ${MONO};color:${APAGADO};margin:0 0 18px 60px">datos de ejemplo</div>
    <div data-efecto="linea" data-en="0.3" data-dur="2">${kit.grafica([1.2, 3.4, 2.9, 6.1, 9.9], { ancho: 860, alto: 600, color: AZUL_CLARO, etiquetas: ['2022', '2023', '2024', '2025', '2026'], decimales: 1, sufijo: ' M', tamValor: 64, textoColor: CLARO })}</div></div>` });

// ── 18 · Patrones ────────────────────────────────────────────────────────
const PW = 293, PH = 240;
const PATRONES = [['puntos', { separacion: 26 }, 'aparece'], ['confeti', { cantidad: 26, tam: 0.9 }, 'cae'], ['flujo', { lineas: 40, grosor: 1.8 }, 'dibuja'],
  ['curvas', { niveles: 8, grosor: 1.6 }, 'dibuja'], ['facetas', { columnas: 5 }, 'aparece'], ['medio-tono', { paso: 22 }, 'aparece'],
  ['ondas', { capas: 4, desde: 0.35, amplitud: 30 }, 'sube'], ['trazo', { grosor: 9 }, 'dibuja'], ['marco', { grosor: 6 }, 'dibuja']];
const PALETA = [AZUL_CLARO, NARANJA, CLARO];
lamina({ nombre: 'Patrones', grupo: 'Assets', titulo: 'Patrones con <em>semilla</em>',
  texto: 'Nueve generadores de SVG. La misma semilla da el mismo dibujo siempre, así que un deck se regenera sin que cambie nada; con otra semilla sale otro. <b>kit.patronFondo()</b> da lo mismo como fondo CSS, y <b>data-efecto="piezas"</b> los anima.',
  code: "${kit.patron('flujo', { ancho, alto, paleta, semilla: 'jinx' })}\n<div data-efecto=\"piezas\" data-modo=\"dibuja\">…</div>",
  demo: `<div style="display:grid;grid-template-columns:repeat(3,${PW}px);grid-template-rows:repeat(3,${PH}px);gap:20px">
    ${PATRONES.map(([tipo, op, modo], i) => {
      const chico = tipo === 'trazo' || tipo === 'marco';
      const pat = kit.patron(tipo, { ancho: chico ? 220 : PW, alto: chico ? (tipo === 'trazo' ? 40 : 150) : PH, paleta: tipo === 'facetas' ? ['#1D2140', '#3346FF', AZUL_CLARO] : tipo === 'ondas' ? ['#1D2140', '#3346FF', AZUL_CLARO] : PALETA, semilla: 'novedades', estilo: 'width:100%;height:100%', ...op });
      return `<div style="position:relative;border-radius:14px;overflow:hidden;background:#161722;${chico ? 'display:flex;align-items:center;justify-content:center' : ''}">
        <div data-efecto="piezas" data-modo="${modo}" data-en="${(0.2 + i * 0.08).toFixed(2)}" style="${chico ? `width:220px;height:${tipo === 'trazo' ? 40 : 150}px` : 'position:absolute;inset:0'}">${pat}</div>${etiqueta(tipo)}</div>`;
    }).join('')}</div>` });

// ── 19 · Íconos e ilustraciones ──────────────────────────────────────────
const ICONOS = ['tabler:sword', 'lucide:crown', 'ph:fire-duotone', 'game-icons:dragon-head', 'tabler:trophy', 'lucide:sparkles'];
lamina({ nombre: 'Recursos', grupo: 'Assets', titulo: 'Íconos e <em>ilustraciones</em>, sin CDN',
  texto: '<b>kit.icono()</b> trae cualquier ícono de Iconify —Tabler, Lucide, Phosphor, game-icons…— la primera vez, lo guarda en <b>tools/cache/iconos</b> y lo incrusta como SVG. <b>kit.ilustracion()</b> recolorea Open Doodles. Ojo: game-icons es CC BY y pide crédito.',
  code: "${kit.icono('tabler:sword', { tam: 120, color })}\n${kit.ilustracion('doodle:Coffee', { tinta, acento })}",
  demo: `<div style="display:grid;grid-template-columns:400px 440px;gap:40px;align-items:center">
    <div data-efecto="bento dibujo" data-en="0.2" data-dur="1.1" data-escala="0.8" style="display:grid;grid-template-columns:repeat(2,1fr);gap:28px">
      ${ICONOS.map((ic, i) => `<div style="padding:26px 0 18px;border-radius:16px;background:#161722;text-align:center">${kit.icono(ic, { tam: 96, color: [AZUL_CLARO, CLARO, NARANJA][i % 3], trazo: 1.5 })}<div style="margin-top:12px;font:500 14px/1 ${MONO};color:${APAGADO}">${ic}</div></div>`).join('')}</div>
    <div data-efecto="bento" data-en="0.6" data-escala="0.8" style="border-radius:20px;background:${PAPEL};padding:30px">${kit.ilustracion('doodle:Coffee', { tinta: TINTA, acento: AZUL, estilo: 'width:100%;height:auto;display:block' })}</div>
  </div>` });

// ── 20 · Video ───────────────────────────────────────────────────────────
const VELOCIDAD = [['capturar.mjs · jinx, 17 láminas', 145, 6.6, '×22'], ['cuadros.mjs · jinx, 862 cuadros', 248, 30, '×8'], ['video de 4 láminas · la 2ª vez', 31, 5.8, '×5']];
const MAXV = 248;
lamina({ nombre: 'Video', grupo: 'Video', titulo: 'El video, hasta <em>veinte veces</em> más rápido',
  texto: '<b>capturar.mjs</b> salta cada timeline a su final en vez de esperarla; <b>cuadros.mjs</b> reparte el render entre varios Chrome y les pasa los cuadros a ffmpeg por tubería; la voz va en paralelo y con caché. Y con la pantalla apagada ya no se arrastra.',
  extra: para('Chrome bajaba a un cuadro por segundo con el monitor apagado: ahora arranca sin freno de vsync ni de segundo plano.'),
  demo: `<div style="width:840px">
    ${VELOCIDAD.map(([t, antes, ahora, x]) => `<div style="margin-bottom:46px">
      <div data-a="up2" style="display:flex;justify-content:space-between;align-items:baseline;font:500 22px/1 ${MONO};color:${CLARO}"><span>${t}</span><span style="font:400 60px/1 ${SERIF};color:${NARANJA}">${x}</span></div>
      <div style="margin-top:16px;display:flex;align-items:center;gap:16px"><div data-barra style="height:30px;width:${(antes / MAXV) * 680}px;border-radius:6px;background:#3A3C4E"></div><span style="font:500 22px/1 ${MONO};color:${APAGADO}">${String(antes).replace('.', ',')} s</span></div>
      <div style="margin-top:10px;display:flex;align-items:center;gap:16px"><div data-barra style="height:30px;width:${Math.max(8, (ahora / MAXV) * 680)}px;border-radius:6px;background:${AZUL_CLARO}"></div><span data-efecto="contador" data-cuenta="${ahora}" data-decimales="${ahora % 1 ? 1 : 0}" data-sufijo=" s" data-en="0.9" style="font:500 22px/1 ${MONO};color:${CLARO}">${String(ahora).replace('.', ',')} s</span></div>
    </div>`).join('')}</div>` });

// ── 21 · El guion ────────────────────────────────────────────────────────
const GUION = [
  '{',
  '  "voz": "35199d54…",',
  '  "subtitulos": "karaoke",',
  '  "acento": "#FF4FA8",',
  '  "transicion": "smoothleft",',
  '  "paralelo_voz": 3,',
  '  "slides": [',
  '    { "slide": 1, "texto": "[excited] …" },',
  '    { "slide": 4, "texto": "…",',
  '      "transicion": { "tipo": "circleopen", "dur": 0.4 } },',
  '    { "slide": 9, "texto": "…", "transicion": "corte" }',
  '  ]',
  '}',
];
const resalta = (l) => esc(l).replace(/(&quot;.*?&quot;)/g, `<span style="color:#FFC58A">$1</span>`);
lamina({ nombre: 'El guion', grupo: 'Video', titulo: 'El guion pide <em>más</em>',
  texto: '<b>transicion</b> para todo el video o por lámina. La voz se guarda en caché por texto, voz, modelo y prosodia: corregir dos láminas solo vuelve a pedir esas dos. <b>paralelo_voz</b> dice cuántas peticiones van a la vez a Fish (con 1 van en serie si la cuenta da 429).',
  extra: para('regenerar un video ya narrado: 31 s la primera vez, 5,8 s la segunda, sin una sola petición a Fish.'),
  demo: `<div data-efecto="bento" data-desde="start" data-escalon="0.06" data-escala="0.96" style="width:860px;font:500 23px/1.62 ${MONO};color:${CLARO};white-space:pre">${GUION.map((l) => `<div>${resalta(l) || ' '}</div>`).join('')}</div>` });

// ── 22 · Arreglos ────────────────────────────────────────────────────────
const ARREGLOS = [['tabler:eye-off', 'La capa del video tapaba el deck', 'Se ocultaba con el atributo hidden y un display: flex en línea le ganaba. Ahora es display: none.'],
  ['tabler:download', 'Bajaba el video al entrar', 'El <video> no lleva src hasta que se abre: antes se descargaban ~10 s aunque nadie le diera play.'],
  ['tabler:arrows-horizontal', 'Los botones se enciman', '«▶ Reproducir · V» se coloca midiendo el ancho real de «Presentar · P».'],
  ['tabler:bolt', 'Arranca sin esperar', 'Los MP4 salen con +faststart: el índice va al principio y no hay que bajar la cola del archivo.']];
lamina({ nombre: 'Arreglos', grupo: 'Video', titulo: 'Lo que se <em>arregló</em>',
  texto: 'La auditoría del reproductor (<b>kit.reproductor</b>, el botón «▶ Reproducir · V» de ultracode, dra y semana38) encontró cuatro fallas. Las cuatro están corregidas en el kit y los tres decks se regeneraron.',
  demo: `<div style="width:880px;display:grid;grid-template-columns:1fr 1fr;gap:26px">
    ${ARREGLOS.map(([ic, t, d], i) => `<div data-efecto="borde" data-color="${AZUL_CLARO}" data-radio="20" data-grosor="3" data-en="${(0.3 + i * 0.2).toFixed(1)}" style="padding:34px 32px;border-radius:18px;background:#161722">
      ${kit.icono(ic, { tam: 56, color: NARANJA, trazo: 1.6 })}
      <div style="margin-top:18px;font:400 36px/1.05 ${SERIF};color:${CLARO}">${t}</div>
      <div style="margin-top:12px;font:400 19px/1.45 ${SANS};color:${APAGADO}">${esc(d)}</div></div>`).join('')}</div>` });

// ── 23 · Dónde vive ──────────────────────────────────────────────────────
const ARBOL = [['tools/', ''], ['  kit.cjs', 'gsap() · animador() · reproductor()'], ['  kit-efectos.cjs', 'las 35 recetas + piezas de build-time'],
  ['  kit-patrones.cjs', 'patron() · patronFondo() · semillas'], ['  kit-recursos.cjs', 'icono() · ilustracion()'], ['  contorno.mjs', 'luminancia para kit.contorno()'],
  ['  transiciones.mjs', 'las 57 de xfade'], ['  cache/', 'íconos, doodles y contornos'], ['  vendor/', 'GSAP 3.15 y sus plugins'], ['lab/', 'una lámina por receta'],
  ['docs/', ''], ['  animaciones-y-assets.md', 'la primera tanda'], ['  efectos-svg.md', '25 propuestos, 8 hechos']];
const REGLAS = [['Sin azar', 'nada de Math.random: PRNG con semilla o hash.'], ['Seekeables', 'el video salta a cualquier tiempo y sale el mismo cuadro.'],
  ['Solo from()', 'nunca ocultar en CSS: sin JS el deck se ve completo.'], ['Se deshacen', 'lo que tocan del DOM lo registran con deshacer().']];
lamina({ nombre: 'Dónde vive', grupo: 'Mapa', titulo: 'Dónde vive <em>cada cosa</em>',
  texto: 'Todo es build-time o se copia a la carpeta del deck: ninguna lámina pide nada a un CDN. Las recetas siguen cuatro reglas, y una receta nueva que no las cumpla rompe el render de video.',
  extra: `<div data-a="up3" style="margin-top: 26px; display: grid; gap: 12px;">${REGLAS.map(([t, d], i) => `<div style="display:flex;gap:16px;align-items:baseline"><span style="font:400 34px/1 ${SERIF};color:${AZUL};width:26px">${i + 1}</span><span style="font:400 21px/1.4 ${SANS};color:${GRIS}"><b style="color:${TINTA}">${t}:</b> ${d}</span></div>`).join('')}</div>`,
  demo: `<div data-efecto="bento" data-desde="start" data-escalon="0.05" data-escala="0.96" style="width:860px;font:500 21px/1.75 ${MONO};white-space:pre">${ARBOL.map(([f, d]) =>
    `<div style="display:flex"><span style="flex:0 0 370px;color:${f.trim().endsWith('/') ? AZUL_CLARO : CLARO}">${f}</span><span style="color:${APAGADO}">${d}</span></div>`).join('')}</div>` });

// ── 24 · Cierre ──────────────────────────────────────────────────────────
const FALTAN = ['pixelado', 'aberración', 'especular', 'neón', 'foco', 'silueta', 'destello', 'órbita', 'rotulado', 'mosaico', 'cortina líquida', 'dona', 'radar', 'chispas', 'ensamble', 'derrumbe', 'golpe'];
lamina({ nombre: 'Cierre', grupo: 'Lo que sigue', titulo: 'Faltan <em>diecisiete</em>',
  texto: '<b>docs/efectos-svg.md</b> trae los que siguen, varios ya con prototipo probado en Chrome. Mientras, todo lo de este cuaderno se puede ver suelto, una receta por lámina, en el laboratorio.',
  extra: `<a data-a="up3" href="../lab/" style="display: inline-block; margin-top: 36px; padding: 18px 30px; border-radius: 999px; background: ${AZUL}; color: #FFFFFF; font: 500 22px/1 ${SANS}; text-decoration: none;">Abrir el laboratorio →</a>`,
  demo: `<div style="position:absolute;inset:0" data-efecto="piezas" data-modo="cae" data-abanico="1">${kit.patron('confeti', { ancho: W, alto: H, paleta: [AZUL_CLARO, NARANJA, CLARO], semilla: 'novedades', cantidad: 60, tam: 1.1, hueco: [0.08, 0.12, 0.92, 0.88], estilo: 'width:100%;height:100%' })}</div>
    <div data-efecto="bento" data-en="0.4" data-escalon="0.04" style="position:relative;display:flex;flex-wrap:wrap;gap:14px;justify-content:center;padding:0 90px">
    ${FALTAN.map((f) => `<span style="padding:14px 22px;border-radius:12px;background:#1B1D2A;color:${CLARO};font:500 26px/1 ${MONO}">${f}</span>`).join('')}</div>` });

// ── Coreografías propias ─────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  function base(tl, s) {
    ['up', 'up2', 'up3'].forEach(function (k, i) {
      var els = s.querySelectorAll('[data-a="' + k + '"]');
      if (els.length) tl.from(els, { y: 26, opacity: 0, duration: 0.65 }, i * 0.13);
    });
  }
  // Las barras crecen desde la izquierda; los números de «ahora» cuentan.
  animar('Video', function (tl, s) {
    base(tl, s);
    tl.from(s.querySelectorAll('[data-barra]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9, ease: 'power3.inOut', stagger: 0.12 }, 0.35);
    efectosDeclarados(tl, s);
  });
})();
</${'script'}>`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lo nuevo del kit</title>
${kit.og({ titulo: 'Lo nuevo del kit', descripcion: 'Cuaderno de novedades: GSAP 3.15, 35 recetas de animación (ocho de ellas, efectos SVG nuevos), patrones, íconos e ilustraciones, y un módulo de video hasta veinte veces más rápido. Cada lámina con su demo viva.', carpeta: 'novedades' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${PAPEL}; }
  deck-stage section em { font-style: italic; }
  deck-stage section b { font-weight: 600; color: ${TINTA}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(51,70,255,0.45); border-radius: 999px;
    background: rgba(242,238,229,0.9); color: ${AZUL}; cursor: pointer;
    font: 600 13px/1 ${SANS}; letter-spacing: 0.6px; opacity: 0.6; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
</style>
</head>
<body>
<deck-stage width="1920" height="1080">
${slides.join('\n')}
</deck-stage>
${kit.gsap(__dirname, ['SplitText', 'DrawSVG', 'MorphSVG', 'MotionPath'])}
${kit.efectos()}
${kit.animador()}
${coreografias}
<script>
(function () {
  var presenting = false, btn = document.createElement('button');
  btn.id = 'modo-presentacion'; btn.type = 'button';
  function render() { btn.textContent = presenting ? 'Salir · Esc' : 'Presentar · P'; if (presenting) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on'); }
  function setPresenting(on) {
    if (on === presenting) return;
    presenting = on;
    window.postMessage({ __omelette_presenting: on }, '*');
    if (on) { if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); }
    else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    render();
  }
  btn.addEventListener('click', function () { setPresenting(!presenting); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'p' || e.key === 'P') { setPresenting(!presenting); e.preventDefault(); }
    else if (e.key === 'Escape' && presenting && !document.fullscreenElement) setPresenting(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && presenting) setPresenting(false); });
  render(); document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
