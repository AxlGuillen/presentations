// Generador de index.html — Laboratorio de efectos (catálogo vivo del kit)
// Ejecutar: node lab/gen.js
//
// No es una presentación: es el catálogo de lo que trae el kit desde la
// propuesta de docs/animaciones-y-assets.md, una lámina por receta, para
// escoger viéndolas. Cada lámina dice su nombre y la línea exacta para usarla.
//
//   · Texto, imagen, contenedores, transiciones y SVG → kit.efectos()
//     (recetas declaradas con data-efecto="…" o llamadas con efecto(…))
//   · Patrones generativos → kit.patron()
//   · Íconos e ilustraciones → kit.icono() y kit.ilustracion()
//   · Segunda tanda (docs/efectos-svg.md): quemado, tinta, contorno, cometa,
//     sello, ventana, cámara y línea, con sus piezas de build-time
//
// Aquí sí hay texto en las láminas, a propósito: es una herramienta, no B-roll.
// Los splashes y retratos son de Data Dragon; las ilustraciones, Open Doodles
// (CC0); los íconos, Tabler y Lucide (MIT/ISC), Phosphor (MIT) y game-icons
// (CC BY 3.0, crédito en CREDITOS.md).
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Paleta de laboratorio ────────────────────────────────────────────────
// Neutra a propósito para que las recetas se vean sin el tono de un deck:
// carbón, hueso, coral de acento y violeta de apoyo.
const BG = '#0E0E12';
const BONE = '#F2EFE8';
const CORAL = '#FF6A3D';
const VIOLETA = '#7C5CFF';
const MUTED = '#8A8794';
const PANEL = '#17171D';
const PALETA = [CORAL, VIOLETA, BONE];

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SECCION = `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; padding: 300px 84px 350px; box-sizing: border-box; overflow: hidden; position: relative;`;
const marco = (contenido, extra = '') =>
  `<div style="position: relative; width: 100%; height: 100%; border-radius: 22px; overflow: hidden; background: ${PANEL}; ${extra}">${contenido}</div>`;
const imagen = (src, alt, pos = '50% 30%', attrs = '') =>
  `<img src="assets/${src}" alt="${alt}" ${attrs} style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos}; display: block;">`;

let n = 0;
const slides = [];
const lamina = ({ grupo, nombre, uso, cuerpo, alto = 960, notas = '', fondo = BG, attrs = '' }) => {
  n++;
  slides.push(`
  <section data-label="${nombre}" ${attrs} data-screen-label="${String(n).padStart(2, '0')} · ${grupo} · ${nombre}" data-speaker-notes="${esc(notas)}" style="${SECCION.replace(BG, fondo)}">
    <header data-a="up" style="margin-bottom: 34px;">
      <div style="font: 700 24px/1 ${BODY}; letter-spacing: 4px; text-transform: uppercase; color: ${CORAL};">${String(n).padStart(2, '0')} · ${grupo}</div>
      <h2 style="margin: 12px 0 0; font: 400 112px/0.9 ${DISPLAY}; color: ${BONE};">${nombre}</h2>
      <code style="display: block; margin-top: 16px; font: 500 21px/1.4 ${MONO}; color: ${MUTED}; white-space: pre-wrap;">${esc(uso)}</code>
    </header>
    <div style="position: relative; width: 100%; height: ${alto}px; display: flex; align-items: center; justify-content: center;">${cuerpo}</div>
  </section>`);
};

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" style="${SECCION} justify-content: center; align-items: center; text-align: center;">
    <div style="position: absolute; inset: 0;" data-efecto="piezas" data-modo="cae" data-abanico="1.1">${kit.patron('confeti', { paleta: PALETA, semilla: 'lab', cantidad: 110, tam: 1.3, hueco: [0.06, 0.36, 0.94, 0.64], estilo: 'width:100%;height:100%' })}</div>
    <div style="position: relative;">
      <div data-a="up" style="font: 700 26px/1 ${BODY}; letter-spacing: 6px; text-transform: uppercase; color: ${CORAL};">kit · animación y assets</div>
      <h1 data-efecto="letras" data-desde="center" data-en="0.25" style="margin: 26px 0 0; font: 400 200px/0.86 ${DISPLAY}; color: ${BONE};">LABORATORIO</h1>
      <p data-a="up2" style="margin: 30px 0 0; font: 500 30px/1.4 ${MONO}; color: ${MUTED};">efectos · patrones · íconos · ilustraciones</p>
    </div>
  </section>`);
n = 1;

// ── TEXTO ────────────────────────────────────────────────────────────────
const T = `font-family: ${DISPLAY}; color: ${BONE}; margin: 0; text-align: center;`;
lamina({ grupo: 'Texto', nombre: 'lineas', uso: '<h1 data-efecto="lineas">…</h1>  · SplitText con máscara, sin cortar la Ñ',
  cuerpo: `<h1 data-efecto="lineas" data-en="0.3" style="${T} font-size: 150px; line-height: 0.9;">LÍNEAS QUE SUBEN<br>DESDE SU MÁSCARA<br><span style="color:${CORAL}">CON LA Ñ ENTERA</span></h1>` });
lamina({ grupo: 'Texto', nombre: 'letras', uso: 'data-efecto="letras" data-desde="center"  · también start | end | edges',
  cuerpo: `<h1 data-efecto="letras" data-desde="center" data-en="0.3" style="${T} font-size: 240px; line-height: 0.86;">JINX<br><span style="color:${CORAL}">13 AÑOS</span></h1>` });
lamina({ grupo: 'Texto', nombre: 'revuelto', uso: 'data-efecto="revuelto" data-glifos="…"  · determinista: hash, no Math.random',
  cuerpo: `<div style="text-align:center"><div data-efecto="revuelto" data-en="0.3" data-dur="1.3" style="${T} font-size: 150px;">WUDI777</div><div data-efecto="revuelto" data-en="0.5" data-dur="1.2" style="${T} font-size: 150px; color:${CORAL};">HIERRO 1</div></div>` });
lamina({ grupo: 'Texto', nombre: 'maquina', uso: 'data-efecto="maquina" data-ritmo="0.03"  · cursor que parpadea al final',
  cuerpo: `<p data-efecto="maquina" data-en="0.3" data-ritmo="0.028" style="margin:0; font: 600 56px/1.3 ${BODY}; color:${BONE};">«Nadie sabe con certeza qué sucedió para que esa dulce niñita…»</p>` });
lamina({ grupo: 'Texto', nombre: 'marcatextos', uso: '<span data-efecto="marcatextos" data-color="#FFD640">…</span>  · data-alto="completo"',
  cuerpo: `<p style="margin:0; font: 400 104px/1.05 ${DISPLAY}; color:${BONE}; text-align:center;">RIOT DICE QUE <span data-efecto="marcatextos" data-en="0.4" data-color="${CORAL}">PERDIÓ PODER</span> EN LOS ÚLTIMOS <span data-efecto="marcatextos" data-en="0.9" data-alto="completo" data-color="${VIOLETA}">PARCHES</span></p>` });
lamina({ grupo: 'Texto', nombre: 'tragamonedas', uso: 'data-efecto="tragamonedas"  · cada dígito rueda en su columna',
  cuerpo: `<div data-efecto="tragamonedas" data-en="0.3" style="${T} font-size: 210px; line-height: 1;">13 637 663</div>` });
lamina({ grupo: 'Texto', nombre: 'brillo', uso: 'data-efecto="brillo" data-color="#FFFFFF"  · un remate por deck, no más',
  cuerpo: `<div data-efecto="brillo" data-en="0.3" style="${T} font-size: 260px; color: ${CORAL};">GIGI EASY</div>` });
lamina({ grupo: 'Texto', nombre: 'contador', uso: 'data-efecto="contador" data-cuenta="9904026" data-sufijo=" pts"',
  cuerpo: `<div data-efecto="contador" data-en="0.3" data-cuenta="9904026" data-sufijo=" PTS" style="${T} font-size: 190px;">9 904 026 PTS</div>` });

// ── IMAGEN ───────────────────────────────────────────────────────────────
lamina({ grupo: 'Imagen', nombre: 'empuje', uso: 'data-efecto="empuje" data-origen="62% 30%"  · Ken Burns hacia la cara',
  cuerpo: marco(imagen('Jinx_0.jpg', 'Jinx', '62% 30%'), '') .replace('<div style="position: relative;', '<div data-efecto="empuje" data-origen="62% 30%" style="position: relative;') });
lamina({ grupo: 'Imagen', nombre: 'persiana', uso: 'data-efecto="cortinilla" data-forma="persiana" data-direccion="derecha"',
  cuerpo: `<div data-efecto="cortinilla" data-forma="persiana" data-en="0.3" style="width:100%;height:100%">${marco(imagen('Jinx_0.jpg', 'Jinx', '62% 30%'))}</div>` });
lamina({ grupo: 'Imagen', nombre: 'iris', uso: 'data-efecto="cortinilla" data-forma="iris" data-origen="62% 32%"',
  cuerpo: `<div data-efecto="cortinilla" data-forma="iris" data-origen="62% 32%" data-en="0.3" style="width:100%;height:100%">${marco(imagen('Vi_0.jpg', 'Vi', '50% 30%'))}</div>` });
lamina({ grupo: 'Imagen', nombre: 'diagonal y tajo', uso: 'data-forma="diagonal"  ·  data-forma="tajo"',
  cuerpo: `<div style="width:100%;height:100%;display:grid;grid-template-rows:1fr 1fr;gap:20px">
    <div data-efecto="cortinilla" data-forma="diagonal" data-en="0.3">${marco(imagen('Viktor_0.jpg', 'Viktor', '50% 35%'))}</div>
    <div data-efecto="cortinilla" data-forma="tajo" data-en="0.7">${marco(imagen('Jinx_0.jpg', 'Jinx', '60% 35%'))}</div></div>` });
lamina({ grupo: 'Imagen', nombre: 'pincel', uso: '${kit.pincel(src, alt, { ancho, alto })}  +  data-efecto="pincel"',
  cuerpo: `<div data-efecto="pincel" data-en="0.25" data-dur="1.1" data-escalon="0.11" style="width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${kit.pincel('assets/Jinx_0.jpg', 'Jinx', { ancho: 912, alto: 960 })}</div>` });
lamina({ grupo: 'Imagen', nombre: 'duotono', uso: '${kit.duotono(id, oscuro, claro)}  +  data-efecto="duotono" data-hacia="duotono"',
  cuerpo: `${kit.duotono('efx-duotono', '#16101F', CORAL)}<div data-efecto="duotono" data-en="0.4" style="width:100%;height:100%">${marco(imagen('Vi_0.jpg', 'Vi', '50% 30%'))}</div>` });
lamina({ grupo: 'Imagen', nombre: 'glitch', uso: '${kit.glitch()}  +  data-efecto="glitch" data-fuerza="140"',
  cuerpo: `${kit.glitch()}<div data-efecto="glitch" data-en="0.3" style="width:100%;height:100%">${marco(imagen('Viktor_0.jpg', 'Viktor', '50% 35%'))}</div>` });
lamina({ grupo: 'Imagen', nombre: 'rebanadas', uso: 'data-efecto="rebanadas" data-n="7"  · la imagen entra en tiras',
  cuerpo: `<div data-efecto="rebanadas" data-n="7" data-en="0.3" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}</div>` });
lamina({ grupo: 'Imagen', nombre: 'parallax', uso: 'data-efecto="parallax"  · hijos con data-capa="0.4 | 1.6 | 2.6"',
  cuerpo: `<div data-efecto="parallax" data-en="0.2" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">
    <div data-capa="0.4" style="position:absolute;inset:-40px;">${imagen('quebrantada.jpg', 'Arcane: Jinx Quebrantada', '50% 50%')}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,18,0) 30%,rgba(14,14,18,.85) 100%)"></div>
    <img data-capa="1.6" src="assets/quebrantada-1.png" alt="Jinx Quebrantada" style="position:absolute;left:50%;bottom:-20px;height:92%;transform:translateX(-50%);">
    <div data-capa="2.6" style="position:absolute;left:0;right:0;bottom:40px;text-align:center;font:400 130px/0.9 ${DISPLAY};color:${BONE};">QUEBRANTADA</div></div>` });

// ── CONTENEDORES ─────────────────────────────────────────────────────────
const CARTAS = ['Caitlyn', 'Ekko', 'Heimerdinger', 'Jayce', 'Jinx', 'Singed', 'Vi', 'Viktor', 'Warwick'];
const carta = (c, extra = '') => `<div ${extra} style="border-radius:16px;overflow:hidden;background:${PANEL}"><img src="assets/cartas/${c}.jpg" alt="${c}" style="width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block"></div>`;
const rejilla = (attrs) => `<div ${attrs} style="width:100%;height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:16px">${CARTAS.map((c) => carta(c, c === 'Jinx' ? 'data-elegida' : '')).join('')}</div>`;
lamina({ grupo: 'Contenedores', nombre: 'bento', uso: 'data-efecto="bento" data-desde="center"  · los hijos se arman desde el centro',
  cuerpo: rejilla('data-efecto="bento" data-en="0.25"') });
lamina({ grupo: 'Contenedores', nombre: 'crece', uso: 'efecto("bento",…) y luego efecto("crece",…, { en: 1.1 })  · la elegida lleva data-elegida',
  cuerpo: rejilla('data-lab="crece"') });
const TOP = [['Jinx', '13 637 663', 2], ['Melissa', '11 667 948', 4], ['camymata', '10 465 549', 0], ['eqYuriko', '10 420 593', 3], ['Tank Girl', '10 367 419', 1]];
lamina({ grupo: 'Contenedores', nombre: 'reordena', uso: 'data-efecto="reordena"  · HTML en el orden final; cada hijo dice data-desde',
  cuerpo: `<div data-efecto="reordena" data-en="0.6" style="width:100%;display:flex;flex-direction:column;gap:16px">${TOP.map(([nom, pts, desde], i) =>
    `<div data-desde="${desde}" style="display:flex;align-items:center;gap:26px;padding:26px 32px;border-radius:18px;background:${PANEL};border:1px solid ${i === 0 ? CORAL : 'rgba(255,255,255,.08)'}">
      <span style="font:400 84px/1 ${DISPLAY};color:${i === 0 ? CORAL : MUTED};width:60px">${i + 1}</span>
      <span style="font:600 44px/1 ${BODY};color:${BONE};flex:1">${nom}</span>
      <span style="font:400 64px/1 ${DISPLAY};color:${BONE}">${pts}</span></div>`).join('')}</div>` });
lamina({ grupo: 'Contenedores', nombre: 'borde', uso: 'data-efecto="borde" data-color="#FF6A3D" data-radio="22"',
  cuerpo: `<div data-efecto="borde" data-color="${CORAL}" data-radio="30" data-en="0.2" style="width:80%;padding:60px;border-radius:22px;background:${PANEL};text-align:center">
    ${kit.icono('tabler:shield-check', { tam: 180, color: CORAL, trazo: 1.6 })}
    <div style="margin-top:24px;font:400 110px/0.9 ${DISPLAY};color:${BONE}">VERIFICADO</div>
    <div style="margin-top:14px;font:500 34px/1.35 ${BODY};color:${MUTED}">El borde se dibuja antes que el contenido</div></div>` });
lamina({ grupo: 'Contenedores', nombre: 'voltea', uso: 'data-efecto="voltea"  · hijos data-cara="frente" y data-cara="dorso", apilados',
  cuerpo: `<div data-efecto="voltea" data-en="0.5" style="display:grid;width:520px;height:946px">
    <div data-cara="frente" style="grid-area:1/1;border-radius:22px;overflow:hidden"><img src="assets/cartas/Jinx.jpg" alt="Jinx" style="width:100%;height:100%;object-fit:cover;display:block"></div>
    <div data-cara="dorso" style="grid-area:1/1;border-radius:22px;overflow:hidden"><img src="assets/cartas/Vi.jpg" alt="Vi" style="width:100%;height:100%;object-fit:cover;display:block"></div></div>` });
lamina({ grupo: 'Contenedores', nombre: 'mazo', uso: 'data-efecto="mazo" data-semilla="…"  · salen apiladas del centro y se reparten',
  cuerpo: `<div data-efecto="mazo" data-en="0.2" style="width:100%;height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:18px">${CARTAS.slice(0, 6).map((c) => carta(c)).join('')}</div>` });

// ── TRANSICIONES ─────────────────────────────────────────────────────────
lamina({ grupo: 'Transiciones', nombre: 'cortina', uso: 'data-efecto="cortina" data-color="#FF6A3D" data-color2="#7C5CFF" data-direccion="arriba"',
  cuerpo: `<div data-efecto="cortina" data-color="${VIOLETA}" data-color2="${CORAL}" data-direccion="arriba"></div>${marco(imagen('Vi_0.jpg', 'Vi', '50% 30%'))}` });
lamina({ grupo: 'Transiciones', nombre: 'iris de lámina', uso: 'data-efecto="iris" data-origen="50% 45%"  · toda la sección se abre en círculo',
  cuerpo: `<div data-efecto="iris" data-origen="50% 55%"></div>${marco(imagen('Viktor_0.jpg', 'Viktor', '50% 35%'))}` });

// ── SVG ──────────────────────────────────────────────────────────────────
const ICONOS_TRAZO = ['tabler:sword', 'tabler:flame', 'tabler:crown', 'tabler:skull', 'lucide:rocket', 'tabler:heart'];
lamina({ grupo: 'SVG', nombre: 'dibujo', uso: 'data-efecto="dibujo"  · dibuja todos los trazos (íconos de línea, garabatos)',
  cuerpo: `<div data-efecto="dibujo" data-en="0.2" data-dur="1.1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:60px 80px">${ICONOS_TRAZO.map((i) => kit.icono(i, { tam: 220, color: i.includes('flame') || i.includes('heart') ? CORAL : BONE, trazo: 1.4 })).join('')}</div>` });

// Dos manchas con semilla para MorphSVG.
const mancha = (semilla, puntas = 0) => {
  const { prng } = require('../tools/kit-patrones.cjs');
  const r = prng(semilla), N = puntas || 9, pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, rad = puntas ? (i % 2 ? 150 : 330) : 230 + r() * 120;
    pts.push([450 + Math.cos(a) * rad, 450 + Math.sin(a) * rad]);
  }
  if (puntas) return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  // curva suave por los puntos (Catmull-Rom → Bézier)
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map((v) => v.toFixed(1)).join(' ')} ${c2.map((v) => v.toFixed(1)).join(' ')} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};
lamina({ grupo: 'SVG', nombre: 'transforma', uso: 'data-efecto="transforma" data-desde="#otra-forma"  · MorphSVG',
  cuerpo: `<svg viewBox="0 0 900 900" style="width:860px;height:860px"><path id="lab-mancha" d="${mancha('mancha-a')}" style="display:none"/>
    <path data-efecto="transforma" data-desde="#lab-mancha" data-en="0.3" data-dur="1.3" d="${mancha('estrella', 10)}" fill="${CORAL}"/></svg>` });
lamina({ grupo: 'SVG', nombre: 'trayectoria', uso: 'data-efecto="trayectoria" data-camino="#camino" data-girar="45"  · MotionPath',
  cuerpo: `<svg viewBox="0 0 900 900" style="width:800px;height:800px;overflow:visible">
    <path id="lab-camino" d="M60 820 C 140 300, 520 900, 600 420 S 820 120, 840 80" fill="none" stroke="${MUTED}" stroke-width="4" stroke-dasharray="4 18" stroke-linecap="round"/>
    <g data-efecto="trayectoria" data-camino="#lab-camino" data-girar="45" data-en="0.2" data-dur="1.5">${kit.icono('lucide:rocket', { tam: 120, color: CORAL, trazo: 2 }).replace('<svg ', '<svg x="-60" y="-60" ')}</g></svg>` });

// ── PATRONES ─────────────────────────────────────────────────────────────
const patronLamina = (nombre, tipo, opciones, modo, uso) => lamina({ grupo: 'Patrones', nombre, uso,
  cuerpo: `<div data-efecto="piezas" data-modo="${modo}" data-en="0.15" style="width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${kit.patron(tipo, { ancho: 912, alto: 960, paleta: PALETA, semilla: 'lab', estilo: 'width:100%;height:100%', ...opciones })}</div>` });
patronLamina('puntos', 'puntos', { separacion: 40 }, 'aparece', "kit.patron('puntos', { separacion, paleta, semilla })  · Poisson: no se enciman");
patronLamina('confeti', 'confeti', { cantidad: 80, tam: 1.4 }, 'cae', "kit.patron('confeti', { cantidad, hueco })  +  data-modo=\"cae\"");
patronLamina('flujo', 'flujo', { lineas: 90, grosor: 2.4 }, 'dibuja', "kit.patron('flujo', { lineas, escala })  +  data-modo=\"dibuja\"");
patronLamina('curvas', 'curvas', { paleta: [VIOLETA, CORAL], niveles: 12, grosor: 2.2 }, 'dibuja', "kit.patron('curvas', { niveles })  · curvas de nivel sobre ruido simplex");
patronLamina('facetas', 'facetas', { paleta: ['#2A1F4D', VIOLETA, CORAL], columnas: 7 }, 'aparece', "kit.patron('facetas', { columnas, temblor })  · low-poly");
patronLamina('medio tono', 'medio-tono', { paleta: [CORAL], paso: 36, direccion: 'abajo' }, 'aparece', "kit.patron('medio-tono', { paso, direccion })");
patronLamina('ondas', 'ondas', { paleta: ['#2A1F4D', VIOLETA, CORAL], capas: 5, desde: 0.35, amplitud: 80 }, 'sube', "kit.patron('ondas', { capas, desde, amplitud })  +  data-modo=\"sube\"");
lamina({ grupo: 'Patrones', nombre: 'a mano', uso: "kit.patron('trazo' | 'marco', { ancho, alto })  +  data-modo=\"dibuja\"",
  cuerpo: `<div style="text-align:center;width:100%">
    <div style="position:relative;display:inline-block;padding:70px 90px">
      <div data-efecto="piezas" data-modo="dibuja" data-en="0.9" data-dur="0.7" data-abanico="0.3" style="position:absolute;inset:0">${kit.patron('marco', { ancho: 760, alto: 420, paleta: [VIOLETA], semilla: 'lab', grosor: 7, estilo: 'width:100%;height:100%' })}</div>
      <div style="font:400 150px/0.9 ${DISPLAY};color:${BONE}">EL MEJOR<br>DEL MUNDO</div>
      <div data-efecto="piezas" data-modo="dibuja" data-en="0.3" data-dur="0.6" data-abanico="0.15" style="width:520px;height:46px;margin:14px auto 0">${kit.patron('trazo', { ancho: 520, alto: 46, paleta: [CORAL], semilla: 'lab', grosor: 11, estilo: 'width:100%;height:100%' })}</div>
    </div></div>` });

// ── ÍCONOS E ILUSTRACIONES ───────────────────────────────────────────────
const ICONOS = [['tabler:sword', 'Tabler'], ['lucide:crown', 'Lucide'], ['ph:fire-duotone', 'Phosphor duotono'],
  ['ph:skull-duotone', 'Phosphor duotono'], ['game-icons:crossed-swords', 'game-icons'], ['game-icons:dragon-head', 'game-icons'],
  ['tabler:trophy', 'Tabler'], ['lucide:sparkles', 'Lucide'], ['ph:crown-simple-duotone', 'Phosphor duotono']];
lamina({ grupo: 'Recursos', nombre: 'íconos', uso: "kit.icono('tabler:sword', { tam, color, trazo })  · cualquier colección de Iconify",
  cuerpo: `<div data-efecto="bento" data-en="0.2" style="width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">${ICONOS.map(([id, col], i) =>
    `<div style="padding:44px 10px 28px;border-radius:18px;background:${PANEL};text-align:center">${kit.icono(id, { tam: 150, color: i % 3 === 0 ? CORAL : i % 3 === 1 ? BONE : VIOLETA, trazo: 1.6 })}<div style="margin-top:18px;font:500 20px/1.3 ${MONO};color:${MUTED}">${id}<br>${col}</div></div>`).join('')}</div>` });
lamina({ grupo: 'Recursos', nombre: 'ilustraciones', uso: "kit.ilustracion('doodle:Reading', { tinta, acento })  · Open Doodles (CC0); unDraw por ruta",
  cuerpo: `<div data-efecto="bento" data-en="0.2" data-escala="0.85" style="width:100%;display:grid;grid-template-columns:1fr;gap:10px">
    ${['Reading', 'Coffee', 'Zombieing'].map((d, i) => `<div style="border-radius:18px;background:${PANEL};padding:0 40px">${kit.ilustracion(`doodle:${d}`, { tinta: BONE, acento: [CORAL, VIOLETA, CORAL][i], estilo: 'height:300px;width:auto;margin:0 auto' })}</div>`).join('')}</div>` });

// ── SEGUNDA TANDA (docs/efectos-svg.md) ──────────────────────────────────
// Las ocho recomendadas. Las que necesitan un filtro o una máscara la llevan
// emitida por su pieza de build-time (kit.quemado, kit.tinta, kit.ventana…).
const S2 = 'Segunda tanda';
lamina({ grupo: S2, nombre: 'quemado', uso: '${kit.quemado()}  +  data-efecto="quemado"  · data-hacia="deshace" la quema al revés',
  cuerpo: `${kit.quemado('efx-quemado', { brasa: CORAL })}<div data-efecto="quemado" data-en="0.3" data-dur="1.8" style="width:100%;height:100%">${marco(imagen('Jinx_0.jpg', 'Jinx', '62% 30%'))}</div>` });
lamina({ grupo: S2, nombre: 'tinta', uso: "${kit.tinta(id, { ancho, alto, origen: [0.3, 0.7] })}  +  data-efecto=\"tinta\"",
  cuerpo: `${kit.tinta('efx-tinta', { ancho: 912, alto: 960, origen: [0.28, 0.72] })}<div data-efecto="tinta" data-en="0.3" data-dur="1.7" style="width:100%;height:100%">${marco(imagen('Vi_0.jpg', 'Vi', '50% 30%'))}</div>` });
lamina({ grupo: S2, nombre: 'contorno', uso: "${kit.contorno(archivo, { ancho, alto, posicion })}  +  data-efecto=\"contorno\"  · líneas sacadas del propio arte",
  cuerpo: `<div data-efecto="contorno" data-en="0.2" data-dur="1.6" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}${kit.contorno(__dirname + '/assets/Jinx_0.jpg', { ancho: 912, alto: 960, posicion: [0.62, 0.3], color: BONE })}</div>` });
const COMETAS = ['M40 820 C 220 760, 300 380, 520 420 S 820 300, 870 90', 'M40 520 C 260 600, 420 180, 620 260 S 800 520, 870 420',
  'M120 930 C 180 640, 520 760, 560 560 S 700 160, 860 220'];
lamina({ grupo: S2, nombre: 'cometa', uso: 'data-efecto="cometa"  · cada <path data-camino> se dibuja con un punto brillante en la punta',
  cuerpo: `<svg data-efecto="cometa" data-en="0.25" data-dur="1.5" data-radio="9" viewBox="0 0 912 960" style="width:912px;height:960px;overflow:visible">
    ${COMETAS.map((d, i) => `<path data-camino d="${d}" fill="none" stroke="${[CORAL, VIOLETA, BONE][i]}" stroke-width="${[7, 5, 3][i]}" stroke-linecap="round"/>`).join('')}</svg>` });
lamina({ grupo: S2, nombre: 'sello', uso: "${kit.sello('NERFEADO', { color })}  dentro de  data-efecto=\"sello\"  · cae, golpea y la lámina tiembla",
  cuerpo: `<div style="position:relative;width:100%;height:100%">${marco(imagen('Viktor_0.jpg', 'Viktor', '50% 35%'), 'filter: saturate(0.55) brightness(0.8);')}
    <div data-efecto="sello" data-en="0.55" style="position:absolute;left:50%;top:50%;width:620px;margin:-120px 0 0 -310px">${kit.sello('NERFEADO', { color: CORAL, ancho: 620, alto: 240 })}</div></div>` });
lamina({ grupo: S2, nombre: 'ventana', uso: "${kit.ventana('JINX', { ancho, alto, origen })}  +  data-efecto=\"ventana\"  · la cámara entra por las letras",
  cuerpo: `${kit.ventana('JINX', { ancho: 912, alto: 960, origen: [0.4, 0.5] })}<div data-efecto="ventana" data-en="0.7" data-dur="1.5" style="width:100%;height:100%">${marco(imagen('Jinx_0.jpg', 'Jinx', '62% 30%'))}</div>` });
lamina({ grupo: S2, nombre: 'cámara', uso: 'data-efecto="camara" data-focos="76 40 2.6; 52 62 1.9; 50 50 1"  · x% y% zoom por foco',
  cuerpo: `<div data-efecto="camara" data-focos="76 40 2.6; 52 62 1.9; 50 50 1" data-en="0.3" data-dur="1" style="width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${imagen('Vi_0.jpg', 'Vi', '50% 30%')}</div>` });
lamina({ grupo: S2, nombre: 'línea', uso: "${kit.grafica(valores, { etiquetas, decimales, sufijo })}  +  data-efecto=\"linea\"",
  cuerpo: `<div data-efecto="linea" data-en="0.3" data-dur="2" style="width:100%">${kit.grafica([1.2, 3.4, 2.9, 6.1, 9.9], { ancho: 912, alto: 640, color: CORAL, etiquetas: ['2022', '2023', '2024', '2025', '2026'], decimales: 1, sufijo: ' M', tamValor: 64, textoColor: BONE })}</div>` });

// ── CONTINUIDAD (docs/lineas-y-continuidad.md) ───────────────────────────
// Seis láminas SEGUIDAS a propósito: lo que lleva el mismo data-continua viaja
// de una a la siguiente. Hay que recorrerlas en orden para verlo.
const C = 'Continuidad';
const anilloProg = (p) => `<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">
  <circle cx="50" cy="50" r="46" fill="none" stroke="${BONE}" stroke-opacity=".16" stroke-width="1"/>
  <circle data-progreso="${p}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - p).toFixed(2)}" cx="50" cy="50" r="46" fill="none" stroke="${CORAL}" stroke-width="2.4" stroke-linecap="round" transform="rotate(-90 50 50)"/></svg>`;
const anilloCont = (p, num, estilo) => `<div data-continua="anillo" style="position:absolute;${estilo}">${anilloProg(p)}
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span data-continua="numero" data-cuenta="${num}" data-prefijo="0" style="font:400 150px/1 ${DISPLAY};color:${BONE}">0${num}</span></div></div>`;
const cartaCont = (estilo, extra = '') => `<div data-continua="carta" ${extra} style="position:absolute;overflow:hidden;border-radius:20px;background:${PANEL};${estilo}">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}</div>`;
const formaCont = (d, color, estilo) => `<svg data-continua="lienzo" viewBox="0 0 900 900" style="position:absolute;${estilo}"><path data-continua="forma" d="${d}" fill="${color}"/></svg>`;
lamina({ grupo: C, nombre: 'continua', uso: 'data-continua="nombre" en láminas seguidas  · → para ver cómo viaja cada pieza',
  notas: 'Primera de seis láminas seguidas: avanzar con → para ver la continuidad.',
  cuerpo: cartaCont('left:30px;top:40px;width:300px;height:430px') + anilloCont(0.25, 1, 'right:40px;top:60px;width:300px;height:300px') +
    formaCont(mancha('mancha-a'), VIOLETA, 'left:300px;top:560px;width:320px;height:320px') });
lamina({ grupo: C, nombre: 'mueve · cuenta · transforma', fondo: '#151022', uso: 'mueve (FLIP) · cuenta (el 01 sigue al 02) · transforma (MorphSVG) · y el fondo funde',
  cuerpo: cartaCont('right:20px;top:200px;width:420px;height:600px') + anilloCont(0.5, 2, 'left:10px;top:40px;width:420px;height:420px') +
    formaCont(mancha('estrella', 10), CORAL, 'left:40px;top:560px;width:360px;height:360px') });
lamina({ grupo: C, nombre: 'crece · continua', fondo: '#151022', uso: 'data-como="crece"  · un marco chico se vuelve el elemento grande, con la imagen donde estaba',
  cuerpo: cartaCont('inset:0', 'data-como="crece"') });
lamina({ grupo: C, nombre: 'cámara · continua', uso: 'data-focos="…"  · la cámara arranca en el último foco de la lámina anterior',
  cuerpo: cartaCont('inset:0', 'data-focos="58 24 2.6; 40 62 1.8"') });
const SERIE = [1.2, 3.4, 2.9, 6.1, 9.9];
const RUTA = 'M60 880 C 200 700, 120 520, 330 470 S 640 520, 700 330 S 820 120, 870 70';
const graficaCont = (hasta, efecto = '') => `<div data-continua="grafica" ${efecto} style="position:absolute;left:0;right:0;top:0">${kit.grafica(SERIE, { ancho: 912, alto: 560, color: CORAL, hasta, etiquetas: ['2022', '2023', '2024', '2025', '2026'], decimales: 1, sufijo: ' M', tamValor: 60, textoColor: BONE, min: 0, max: 10 })}</div>`;
const rutaCont = (p) => `<svg viewBox="0 0 912 960" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><path d="${RUTA}" fill="none" stroke="${MUTED}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>
  <path data-continua="ruta" data-progreso="${p}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - p).toFixed(2)}" d="${RUTA}" fill="none" stroke="${VIOLETA}" stroke-width="6" stroke-linecap="round"/></svg>`;
lamina({ grupo: C, nombre: 'sigue', uso: 'kit.grafica(serie, { hasta: 3 })  · y un trazo con pathLength="1" data-progreso="0.4"',
  cuerpo: rutaCont(0.4) + graficaCont(3, 'data-efecto="linea" data-en="0.3"') });
lamina({ grupo: C, nombre: 'sigue · 2', uso: 'la misma serie con hasta: 5  · la línea y el trazo siguen desde donde se quedaron',
  cuerpo: rutaCont(1) + graficaCont(5) });

// ── LÍNEAS (kit.lineas + fondos de líneas) ───────────────────────────────
const LN = kit.lineas, LI = 'Líneas';
const cajaJuego = () => {
  const W = 150, H = 200, D = 44, c = LN.caja([0, 0, 0], [W, H, D]), f = c.frente;
  f.detalles.push(LN.rect(f, 0.06, 0.045, 0.94, 0.955), LN.linea(f, 0.06, 0.865, 0.94, 0.865), LN.linea(f, 0.12, 0.91, 0.42, 0.91),
    LN.circulo(f, 0.5, 0.56, 42 / W, 42 / H), LN.circulo(f, 0.5, 0.56, 24 / W, 24 / H), LN.linea(f, 0.16, 0.24, 0.84, 0.24), LN.linea(f, 0.28, 0.19, 0.72, 0.19), LN.rect(f, 0.1, 0.07, 0.19, 0.125));
  c.der.detalles.push(LN.linea(c.der, 0.5, 0.14, 0.5, 0.72), LN.rect(c.der, 0.22, 0.86, 0.78, 0.93));
  c.der.achurado = { paso: 7, angulo: 45 };
  const encima = [...LN.cota([-W / 2, -H / 2, D / 2], [W / 2, -H / 2, D / 2], [0, -26, 0], '150 mm'),
    ...LN.cota([-W / 2, -H / 2, D / 2], [-W / 2, H / 2, D / 2], [-26, 0, 0], '200'), ...LN.cota([W / 2, -H / 2, D / 2], [W / 2, -H / 2, -D / 2], [0, -26, 0], '44')];
  return LN.dibujar([c], { camara: { ojo: [330, 190, 400] }, ancho: 912, alto: 960, margen: 60, tinta: BONE, acento: CORAL, grosor: 3, fino: 1.6, tamTexto: 24, encima, estilo: 'width:100%;height:100%', titulo: 'Caja de un juego' });
};
const suave = (pts, pasos = 6) => {
  const out = [], N = pts.length;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    for (let k = 0; k < pasos; k++) {
      const t = k / pasos, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  return out;
};
const control = () => {
  const der = [[0, 36], [40, 38], [62, 33], [76, 18], [82, -4], [84, -30], [78, -50], [64, -56], [52, -46], [42, -26], [26, -18], [0, -18]];
  const e = LN.extruir(suave([...der, ...der.slice(1, -1).reverse().map(([x, y]) => [-x, y])]), 24), plano = (pts) => pts.map(([x, y]) => [x, y, 12]);
  const circ = (cx, cy, r, k = 40) => plano(Array.from({ length: k + 1 }, (_, i) => [cx + Math.cos((i / k) * 6.2832) * r, cy + Math.sin((i / k) * 6.2832) * r]));
  const cruz = (cx, cy, a, w) => plano([[cx - w, cy + a], [cx + w, cy + a], [cx + w, cy + w], [cx + a, cy + w], [cx + a, cy - w], [cx + w, cy - w], [cx + w, cy - a],
    [cx - w, cy - a], [cx - w, cy - w], [cx - a, cy - w], [cx - a, cy + w], [cx - w, cy + w], [cx - w, cy + a]]);
  e.tapa.detalles.push(cruz(-50, 8, 13, 4.5), circ(-24, -16, 11), circ(-24, -16, 6), circ(24, -16, 11), circ(24, -16, 6), plano([[-14, 22], [-4, 22]]), plano([[4, 22], [14, 22]]));
  for (const [x, y] of [[50, 20], [62, 8], [50, -4], [38, 8]]) e.tapa.detalles.push(circ(x, y, 5.5));
  return LN.dibujar([e], { camara: { ojo: [90, 260, 330] }, ancho: 912, alto: 560, margen: 40, tinta: BONE, grosor: 3, fino: 1.8, estilo: 'width:100%;height:100%', titulo: 'Control' });
};
const CAJA = cajaJuego();
lamina({ grupo: LI, nombre: 'traza · caja', uso: "kit.lineas.caja(…) + detalles por cara + cotas  →  kit.lineas.dibujar(…)  ·  data-efecto=\"traza\"",
  notas: 'Silueta, pliegues, detalles, achurado y cotas, en ese orden. Líneas ocultas reales: van sobre cualquier fondo.',
  cuerpo: `<div data-continua="caja-juego" data-efecto="traza" data-dur="2.6" style="position:absolute;inset:0">${CAJA}</div>` });
lamina({ grupo: LI, nombre: 'traza · control', uso: 'kit.lineas.extruir(contorno, prof)  ·  y la caja de la lámina anterior se va a la esquina con continua',
  cuerpo: `<div data-continua="caja-juego" style="position:absolute;left:0;top:0;width:285px;height:300px">${CAJA}</div>
    <div data-efecto="traza" data-en="0.5" data-dur="2.2" style="position:absolute;left:0;right:0;bottom:40px;height:560px">${control()}</div>` });
const copa = LN.revolucion([[0, 40], [10, 40], [10, 52], [6, 60], [6, 78], [22, 92], [34, 120], [38, 150], [36, 150], [32, 122], [20, 98], [0, 96]], { segmentos: 56 });
const pedestal = LN.caja([0, 18, 0], [64, 36, 64]);
pedestal.frente.detalles.push(LN.rect(pedestal.frente, 0.15, 0.3, 0.85, 0.7));
lamina({ grupo: LI, nombre: 'trofeo · sombra', uso: "kit.lineas.revolucion(perfil)  ·  sombra: { luz, paso, umbrales } raya las caras oscuras como un grabado",
  cuerpo: `<div data-efecto="traza" data-dur="2.6" style="position:absolute;inset:0">${LN.dibujar([copa, pedestal], { camara: { ojo: [180, 260, 420], centro: [0, 80, 0] }, ancho: 912, alto: 960, margen: 50, tinta: BONE, grosor: 3, fino: 1.6,
    sombra: { luz: [-0.6, 0.7, 0.6], paso: 7, umbrales: [0.5, 0.85] }, estilo: 'width:100%;height:100%', titulo: 'Trofeo' })}</div>` });
const DADOS = [['tetraedro', 'd4'], ['cubo', 'd6'], ['octaedro', 'd8'], ['dodecaedro', 'd12'], ['icosaedro', 'd20']];
lamina({ grupo: LI, nombre: 'dados · isométrica', uso: "kit.lineas.poliedro('icosaedro', centro, radio)  ·  camara: { iso: true, giro, altura }",
  cuerpo: `<div data-efecto="traza" data-dur="2.2" style="position:absolute;inset:0">${LN.dibujar(DADOS.map(([p], i) => LN.poliedro(p, [(i % 3) * 150 - 150 + (i > 2 ? 75 : 0), i > 2 ? -150 : 0, 0], 58)),
    { camara: { iso: true, giro: 28, altura: 22 }, ancho: 912, alto: 960, margen: 70, tinta: BONE, grosor: 3, umbral: 15, estilo: 'width:100%;height:100%', titulo: 'Cinco dados',
      encima: DADOS.map(([, t], i) => ({ pts: [[(i % 3) * 150 - 150 + (i > 2 ? 75 : 0), (i > 2 ? -150 : 0) - 82, 0]], texto: t })), tamTexto: 30, acento: CORAL })}</div>` });
patronLamina('hilos', 'hilos', { paleta: [BONE], lineas: 46 }, 'dibuja', "kit.patron('hilos', { lineas, amplitud })  · crestas que se tapan sin rellenos (horizonte flotante)");
patronLamina('horizonte', 'horizonte', { paleta: [BONE, CORAL, VIOLETA] }, 'dibuja', "kit.patron('horizonte', { horizonte, radiales, filas, sol })");
patronLamina('guilloche', 'guilloche', { paleta: [VIOLETA, CORAL] }, 'dibuja', "kit.patron('guilloche', { anillos, ondas, amplitud })  · el fondo de un billete");

// ── EDIT (docs/mejoras-oct-2026.md, P3 y P4) ─────────────────────────────
// Capas para montar encima de un edit con laminas.mjs --alfa. La de ritmo lee
// lab/beatmap.json (un beatmap de ejemplo a 120 bpm; la música no se commitea).
const ED = 'Edit';
const RITMO = kit.ritmo(require('./beatmap.json'), { desde: 4 });
const ANTON = `'Anton', Impact, sans-serif`;
const golpes = RITMO.beats(0, 8);
lamina({ grupo: ED, nombre: 'ritmo', uso: "const r = kit.ritmo(beatmap, { desde: 4 })  ·  r.b(n) · r.compas(n) · r.drop · r.palabra('survive')",
  notas: `Beats de la lámina: ${golpes.join(', ')} s. Palabra «survive» en ${RITMO.palabra('survive')} s y drop en ${RITMO.drop} s.`,
  cuerpo: `<div data-lab="ritmo" data-golpes="${golpes.join(',')}" data-palabra="${RITMO.palabra('survive')}" data-drop="${RITMO.drop}" style="position:relative;width:100%;height:100%">
    <div style="position:absolute;left:0;right:0;top:40px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px 0;justify-items:center">
      ${golpes.map((t, i) => `<div data-golpe style="width:${i % 4 ? 120 : 160}px;height:${i % 4 ? 120 : 160}px;border-radius:50%;background:${i % 4 ? VIOLETA : CORAL};display:flex;align-items:center;justify-content:center;font:500 22px/1 ${MONO};color:${BONE};align-self:center">${t.toFixed(2)}</div>`).join('')}</div>
    <div data-sfx="no" data-palabra-lab style="position:absolute;left:0;right:0;top:470px;text-align:center;font:400 200px/1 ${ANTON}">SURVIVE</div>
    <div data-chispas-lab style="position:absolute;left:0;right:0;top:420px;height:400px"></div>
    <div style="position:absolute;left:0;right:0;bottom:30px;text-align:center;font:500 24px/1.5 ${MONO};color:${MUTED}">un círculo por beat · coral = primer tiempo del compás<br>la palabra cae en r.palabra() y las chispas en r.drop</div></div>` });
lamina({ grupo: ED, nombre: 'brasas', uso: 'data-efecto="brasas" data-n="34" data-dur="3" data-color="#FF8A3D,#FFC46B"  · suben y se apagan',
  cuerpo: `<div data-efecto="brasas" data-en="0" data-dur="3.2" data-n="42" data-semilla="lab" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:radial-gradient(90% 60% at 50% 100%, #2A1208, ${PANEL})"></div>` });
lamina({ grupo: ED, nombre: 'chispas', uso: 'data-efecto="chispas" data-origen="50 45" data-fuerza="900"  · estallan con roce y gravedad, en fórmula cerrada',
  cuerpo: `<div data-efecto="chispas" data-en="0.3" data-origen="50 45" data-semilla="lab" style="position:relative;width:100%;height:100%;border-radius:22px;background:${PANEL}"></div>` });
lamina({ grupo: ED, nombre: 'destello', uso: "${kit.destello({ tam, rayos, color, semilla })}  dentro de  data-efecto=\"destello\"",
  cuerpo: `<div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center">
    <div data-efecto="destello" data-en="0.25" style="position:absolute;left:50%;top:50%;width:760px;height:760px;margin:-380px 0 0 -380px">${kit.destello({ tam: 760, rayos: 22, color: '#FFD36B', semilla: 'lab' })}</div>
    <div data-a="up2" style="position:relative;font:400 300px/1 ${DISPLAY};color:${BONE};text-shadow:0 10px 40px rgba(0,0,0,.6)">#1</div></div>` });
lamina({ grupo: ED, nombre: 'palabra', uso: 'data-efecto="palabra" data-color2="#FF6A3D"  · golpe de 125 % a 100 % en 80 ms  · data-letras="si" o data-tiempos="…"',
  cuerpo: `<div style="display:flex;flex-direction:column;align-items:center;gap:60px">
    <div data-efecto="palabra" data-en="0.3" data-color="#FFE9A8" data-color2="#FF6A3D" style="font:400 300px/0.9 ${ANTON}">GG</div>
    <div data-efecto="palabra" data-tiempos="${RITMO.beats(0, 7).map((t) => (t + 0.4).toFixed(3)).join(',')}" data-color="#FFFFFF" data-color2="#7C5CFF" style="font:400 190px/0.9 ${ANTON}">SURVIVE</div></div>` });
lamina({ grupo: ED, nombre: 'multikill', uso: "${kit.multikill('QUADRA KILL')}  dentro de  data-efecto=\"multikill\"  · cae como el sello y le pasa un brillo",
  cuerpo: `<div style="position:relative;width:100%;height:100%">${marco(imagen('Jinx_0.jpg', 'Jinx', '62% 30%'), 'filter: saturate(0.5) brightness(0.55);')}
    <div data-efecto="multikill" data-en="0.45" style="position:absolute;left:50%;top:50%;width:860px;margin:-110px 0 0 -430px">${kit.multikill('QUADRA KILL', { ancho: 860, alto: 220 })}</div></div>` });
lamina({ grupo: ED, nombre: 'letrero-kill', uso: "${kit.letrero({ nombre, campeon, retrato })}  +  data-efecto=\"letrero\"  · centrado por la altura de las mayúsculas",
  notas: 'Las líneas punteadas marcan la altura de las mayúsculas del NOMBRE: el centro del retrato cae en medio de las dos líneas de texto, no de sus cajas.',
  cuerpo: `<div data-efecto="letrero" data-en="0.3" style="position:relative">${kit.letrero({ nombre: 'POWDER', campeon: 'JINX · PENTAKILL', retrato: 'assets/Jinx_0.jpg', color: CORAL, tam: 150 })}</div>` });
lamina({ grupo: ED, nombre: 'rayo', uso: "${kit.rayo([d, …], { ancho, alto, color })}  dentro de  data-efecto=\"rayo\"  · una estela que cruza y sale",
  cuerpo: `<div data-efecto="rayo" data-en="0.3" data-dur="0.6" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${kit.rayo(['M-60 820 C 260 700, 520 420, 980 120', 'M-60 520 C 300 560, 620 300, 980 330', 'M120 1020 C 300 640, 620 600, 980 -40'], { ancho: 912, alto: 960, color: '#8FD3FF', grosor: 9 })}</div>` });
lamina({ grupo: ED, nombre: 'impacto', uso: "${kit.impacto({ ancho, alto, n, hueco })}  dentro de  data-efecto=\"impacto\"  · data-queda=\"si\" las deja puestas",
  cuerpo: `<div data-efecto="impacto" data-en="0.3" data-queda="si" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${imagen('Vi_0.jpg', 'Vi', '50% 30%')}${kit.impacto({ ancho: 912, alto: 960, n: 70, hueco: 0.42, centro: [0.5, 0.36] })}</div>` });

// ── ACABADO (docs/mejoras-oct-2026.md, P7 y P5) ──────────────────────────
const AC = 'Acabado';
const CURVAS = [['entrada', 'llega rápido y frena suave'], ['salida', 'arranca lento y se va'], ['golpe', 'llega de golpe y rebota apenas'], ['asentar', 'se pasa un poco y se asienta'], ['deriva', 'va y viene despacio']];
lamina({ grupo: AC, nombre: 'curvas', uso: "ease: 'entrada' | 'salida' | 'golpe' | 'asentar' | 'deriva'  · con CustomEase si el deck lo carga",
  cuerpo: `<div data-lab="curvas" style="width:100%;display:flex;flex-direction:column;gap:56px">${CURVAS.map(([n, d]) => `<div>
    <div style="display:flex;justify-content:space-between;font:500 24px/1 ${MONO};color:${MUTED};margin-bottom:18px"><span style="color:${BONE}">${n}</span><span>${d}</span></div>
    <div style="position:relative;height:56px;border-radius:28px;background:${PANEL}"><div data-curva="${n}" style="position:absolute;left:${912 - 56}px;top:0;width:56px;height:56px;border-radius:50%;background:${n === 'golpe' || n === 'asentar' ? CORAL : VIOLETA}"></div></div></div>`).join('')}</div>` });
lamina({ grupo: AC, nombre: 'desenfoque', attrs: 'data-blur="6"', uso: 'data-blur="6" en la <section>  · cuadros.mjs mezcla 6 subcuadros por cuadro (solo se ve en el video)',
  notas: 'En el navegador se ve nítido: el desenfoque lo arma cuadros.mjs con tmix. No se combina con --alfa.',
  cuerpo: `<div data-lab="desenfoque" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:${PANEL}">${[0, 1, 2].map((i) => `<div data-barra-rapida style="position:absolute;left:${156 + i * 230}px;top:${180 + i * 230}px;width:140px;height:140px;border-radius:24px;background:${[CORAL, VIOLETA, BONE][i]}"></div>`).join('')}</div>` });
const FRASE = 'Once horas en dieciséis tareas y catorce cerradas';
// Tiempos como los que deja video.mjs en palabras.json (aquí simulados).
const VOZ_EJEMPLO = FRASE.split(' ').map((t, i) => ({ t, ini: +(0.4 + i * 0.32 + (i > 3 ? 0.25 : 0)).toFixed(2) }));
lamina({ grupo: AC, nombre: 'golpe', uso: 'data-efecto="golpe" data-tiempos="${kit.golpe(texto, kit.voz(__dirname, n))}" data-acento="#FF6A3D"',
  notas: 'Los tiempos de esta lámina son de ejemplo; en un deck narrado salen de video-out/palabras.json, que escribe video.mjs.',
  cuerpo: `<div data-efecto="golpe" data-tiempos="${kit.golpe(FRASE, VOZ_EJEMPLO)}" data-acento="${CORAL}" style="font:400 128px/1.05 ${DISPLAY};color:${BONE};text-align:center">${FRASE}</div>` });
lamina({ grupo: AC, nombre: 'dona', uso: "${kit.dona([{ valor, color }, …], { tam, grosor, centro: { texto, cuenta, sufijo } })}  +  data-efecto=\"dona\"",
  cuerpo: `<div data-efecto="dona" data-en="0.25">${kit.dona([{ valor: 66, color: CORAL }, { valor: 18, color: VIOLETA }, { valor: 10, color: BONE }, { valor: 6, color: MUTED }], { tam: 660, grosor: 92, centro: { texto: '66%', cuenta: 66, sufijo: '%', color: BONE } })}</div>` });
lamina({ grupo: AC, nombre: 'radar', uso: "${kit.radar([antes, después], { ejes, max })}  +  data-efecto=\"radar\"  · la segunda serie sale de la primera",
  cuerpo: `<div data-efecto="radar" data-en="0.2">${kit.radar([{ valores: [6, 5, 7, 4, 6, 5], color: MUTED, relleno: 0.12 }, { valores: [8, 4, 9, 6, 7, 3], color: CORAL }], { ejes: ['DAÑO', 'AGUANTE', 'MOVILIDAD', 'CONTROL', 'ALCANCE', 'UTILIDAD'], max: 10, tam: 860, texto: BONE })}</div>` });
lamina({ grupo: AC, nombre: 'pixelado', uso: 'data-efecto="pixelado" data-desde="80" data-pasos="6"  · «adivina la skin»: de bloques a nítido, con el recorte de object-fit',
  cuerpo: `<div data-efecto="pixelado" data-en="0.3" data-dur="3.2" data-desde="96" data-pasos="6" style="position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden">${imagen('Jinx_0.jpg', 'Jinx', '62% 30%')}</div>` });
lamina({ grupo: AC, nombre: 'derrumbe', uso: 'data-efecto="derrumbe" data-en="0.8" data-semilla="…"  · la salida: las letras caen con giro y deriva',
  cuerpo: `<div data-efecto="derrumbe" data-en="0.9" data-semilla="lab" style="font:400 230px/0.9 ${ANTON};color:${BONE};text-align:center">GAME<br>OVER</div>` });

// ── LÍNEAS VIVAS (P6): el modelo en el HTML, proyectado en cada cuadro ──
const LV = 'Líneas vivas';
const dadosVivos = DADOS.map(([p], i) => LN.poliedro(p, [(i % 3) * 150 - 150 + (i > 2 ? 75 : 0), i > 2 ? -150 : 0, 0], 58));
lamina({ grupo: LV, nombre: 'gira', uso: "kit.lineas.vivo(objetos, { camara, … })  +  data-efecto=\"gira\" data-giro=\"360\"  · y kit.lineasRuntime() en el deck",
  notas: 'El modelo va en data-modelo y window.lineas lo proyecta en cada cuadro: las líneas ocultas se recalculan al girar.',
  cuerpo: `<div data-efecto="gira" data-en="0.3" data-dur="3" style="position:absolute;inset:0">${LN.vivo(dadosVivos, { camara: { iso: true, giro: 28, altura: 22 }, ancho: 912, alto: 960, margen: 70, tinta: BONE, grosor: 3, umbral: 15 })}</div>` });
const copaVivo = LN.revolucion([[0, 40], [10, 40], [10, 52], [6, 60], [6, 78], [22, 92], [34, 120], [38, 150], [36, 150], [32, 122], [20, 98], [0, 96]], { segmentos: 28 });
const pedestalVivo = LN.caja([0, 18, 0], [64, 36, 64]);
pedestalVivo.frente.detalles.push(LN.rect(pedestalVivo.frente, 0.15, 0.3, 0.85, 0.7));
const trofeoVivo = (ojo, escala) => LN.vivo([copaVivo, pedestalVivo], { camara: { ojo, centro: [0, 80, 0], fov: 24 }, ancho: 912, alto: 960, tinta: BONE, grosor: 3, fino: 1.6, escala });
lamina({ grupo: LV, nombre: 'gira · continua', uso: 'data-continua="trofeo" con un kit.lineas.vivo() en las dos láminas  · → la cámara viaja de una a otra',
  notas: 'Primera de dos: avanzar con → para ver al trofeo girar mientras se va a la esquina.',
  cuerpo: `<div data-continua="trofeo-vivo" style="position:absolute;inset:0">${trofeoVivo([0, 150, 540], 560)}</div>` });
lamina({ grupo: LV, nombre: 'gira · llega', uso: 'modo «gira» de continua: radio, acimut (camino corto + data-vueltas), elevación y fov se interpolan aparte',
  cuerpo: `<div data-continua="trofeo-vivo" data-vueltas="1" data-dur="1.8" style="position:absolute;left:0;top:0;width:456px;height:480px">${trofeoVivo([430, 420, 160], 560)}</div>
    <div data-a="up2" style="position:absolute;left:0;right:0;bottom:60px;font:500 26px/1.5 ${MONO};color:${MUTED};text-align:center">la misma escena, otra cámara<br>y una vuelta de más en el camino</div>` });

// ── Coreografías propias (las que no basta declarar) ─────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  function cabecera(tl, s) { tl.from(s.querySelector('header'), { y: 26, opacity: 0, duration: 0.5 }, 0); }
  // curvas: la misma distancia con cada curva con nombre.
  animar('curvas', function (tl, s) {
    cabecera(tl, s);
    s.querySelectorAll('[data-curva]').forEach(function (b, i) {
      tl.from(b, { x: -(912 - 56), duration: 1.6, ease: b.getAttribute('data-curva') }, 0.4 + i * 0.12);
    });
  });
  // desenfoque: tres bloques que cruzan rápido (para ver el data-blur en el video).
  animar('desenfoque', function (tl, s) {
    cabecera(tl, s);
    s.querySelectorAll('[data-barra-rapida]').forEach(function (b, i) {
      tl.from(b, { x: i % 2 ? 900 : -900, rotation: i % 2 ? 90 : -90, duration: 0.55, ease: 'entrada' }, 0.3 + i * 0.18);
    });
  });
  // ritmo: cada círculo golpea en su beat (los segundos vienen de kit.ritmo en
  // build-time), la palabra en r.palabra() y las chispas en el drop.
  animar('ritmo', function (tl, s) {
    cabecera(tl, s);
    var lab = s.querySelector('[data-lab="ritmo"]'), ts = lab.getAttribute('data-golpes').split(',').map(parseFloat);
    lab.querySelectorAll('[data-golpe]').forEach(function (g, i) {
      tl.from(g, { scale: 0.35, opacity: 0.2, duration: 0.16, ease: 'power3.out' }, ts[i]);
    });
    efecto('palabra', tl, lab.querySelector('[data-palabra-lab]'), { en: +lab.getAttribute('data-palabra'), color: '#FFE9A8', color2: '#FF6A3D' });
    efecto('chispas', tl, lab.querySelector('[data-chispas-lab]'), { en: +lab.getAttribute('data-drop'), origen: '50 40', semilla: 'drop' });
  });
  animar('crece', function (tl, s) {
    cabecera(tl, s);
    var r = s.querySelector('[data-lab="crece"]');
    efecto('crece', tl, r, { en: 1.1 });
    efecto('bento', tl, r, { en: 0.2 });
  });
})();
</script>`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laboratorio de efectos</title>
${kit.og({ titulo: 'Laboratorio de efectos', descripcion: 'El catálogo vivo del kit: recetas de animación para texto, imagen, contenedores y transiciones, patrones generativos, íconos e ilustraciones.', carpeta: 'lab' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Barlow:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,106,61,0.45); border-radius: 999px;
    background: rgba(14,14,18,0.85); color: ${CORAL}; cursor: pointer;
    font: 600 13px/1 ${BODY}; letter-spacing: 0.6px; opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides.join('\n')}
</deck-stage>
${kit.gsap(__dirname, ['SplitText', 'DrawSVG', 'MorphSVG', 'MotionPath', 'CustomEase'])}
${kit.lineasRuntime()}
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
