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
const lamina = ({ grupo, nombre, uso, cuerpo, alto = 960, notas = '' }) => {
  n++;
  slides.push(`
  <section data-label="${nombre}" data-screen-label="${String(n).padStart(2, '0')} · ${grupo} · ${nombre}" data-speaker-notes="${esc(notas)}" style="${SECCION}">
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

// ── Coreografías propias (las que no basta declarar) ─────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  function cabecera(tl, s) { tl.from(s.querySelector('header'), { y: 26, opacity: 0, duration: 0.5 }, 0); }
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
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
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
