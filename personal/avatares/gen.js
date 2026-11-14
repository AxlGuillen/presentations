// Generador de index.html — «Avatares que mueven las láminas» (v2): demo de las transiciones integradas
// de los avatares 3D (clon de Axl, Axelsine y el clon de Jhin).
// Ejecutar: node personal/avatares/gen.js
//
// Deck de PRUEBA, sin listar en la galería (no está en DECKS) y con noindex.
// Los clips salen de C:/BlenderProyectos/acciones/v2 (Blender: scripts/acciones2.py + empaquetar2.py). Cada ficha
// trae, cuadro por cuadro, dónde están las palmas, los pies, la cadera, la cabeza y la boca de la Whisper, así que
// el deck amarra la lámina a la mano real del avatar. Este generador lee catalogo_v2.json, copia los webm que usa a
// assets/avatares/ y calcula dónde poner lo que el avatar agarra (la tarjeta del «mantel»).
// La lógica vive en avatares.js. Si funciona, se pasa al kit (tools/kit.cjs) como kit.avatares().
const fs = require('fs');
const path = require('path');
const kit = require('../../tools/kit.cjs');

const BIB = 'C:/BlenderProyectos/acciones/v2';
const CAT = JSON.parse(fs.readFileSync(path.join(BIB, 'catalogo_v2.json'), 'utf8'));

// ── Identidad: la de dra/ y musk/ (índigo sobre blanco con puntitos, Figtree) ──
const ACC = '#4B3BD6', BRIGHT = '#7A6BFF', WASH = '#ECEAFF', BG = '#FFFFFF', INK = '#1C1A3A', MUTED = '#64618A', LINE = '#E2E0EE';
const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const SOMBRA = kit.sombra({ tinta: INK, halo: ACC });
const FONDO_BLANCO = kit.fondo(BG, kit.puntos({ color: kit.alpha(ACC, 0.13) }), kit.lavado({ color: WASH, fuerza: 0.7 }));
const FONDO_COLOR = kit.fondo(ACC, kit.puntos({ color: 'rgba(255,255,255,0.13)', paso: 30 }),
  kit.lavado({ color: BRIGHT, en: '88% 10%', ancho: 85, alto: 75, fuerza: 0.55 }),
  kit.lavado({ color: INK, en: '8% 95%', ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }));
const FONDO_LAVANDA = kit.fondo('#F6F5FF', kit.puntos({ color: kit.alpha(ACC, 0.16) }), kit.lavado({ color: '#E4E0FF', en: '70% 20%', fuerza: 0.8 }));

// ── Escenario: tamaño del clip en el deck y línea del piso (los pies de todos pisan aquí) ──
const S = 900, PISO = 1030;
const IZQ = 330, DER = 1745;          // dónde se para el avatar a la izquierda o a la derecha

// punto de la trayectoria de un clip en px del deck, con los pies del avatar en (x, PISO)
function enDeck(clave, nombre, cuadro, x) {
  const f = CAT[clave], p = f.tray[cuadro - 1][nombre];
  return { x: x + (p[0] - f.ancla[0]) * S, y: PISO - (p[1] - f.ancla[1]) * S };
}

// ── Las transiciones: quién sale de cada lámina y cómo ──
// elenco: quién está en la lámina (reposo en bucle); entra: clip con el que cae del cielo (lámina final)
const T = {
  bajada:   { efecto: 'baja', pj: 'axelsine', clave: 'axelsine/baja', x: IZQ },
  persiana: { efecto: 'sube', pj: 'clon', clave: 'clon/sube', x: IZQ },
  mantel:   { efecto: 'mantel', pj: 'clon', clave: 'clon/mantel', x: IZQ, continua: true },
  esquina:  { efecto: 'pela', pj: 'axelsine', clave: 'axelsine/pela-izq', x: DER, reposo: 'axelsine/reposo-izq' },
  patada:   { efecto: 'patada', pj: 'jhin', clave: 'jhin/patada', x: IZQ + 30 },
  disparo:  { efecto: 'disparo', pj: 'jhin', clave: 'jhin/dispara', x: IZQ + 30, continua: true },
  final:    { efecto: 'baja', pj: 'clon', clave: 'clon/baja', x: 1530 },
};

// la tarjeta del mantel: su orilla izquierda queda justo en la palma del clon cuando la agarra
const TARJ = { w: 430, h: 236 };
const agarre = enDeck('clon/mantel', CAT['clon/mantel'].mano, CAT['clon/mantel'].agarra, T.mantel.x);
const TARJ_EN = { left: Math.round(agarre.x - 26), top: Math.round(agarre.y - TARJ.h / 2) };
const TARJ_DESTINO = { left: 1330, top: 600 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const chip = (t, extra = '') => `<span data-pieza style="display: inline-block; font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${ACC}; background: ${WASH}; border-radius: 8px; padding: 7px 14px; ${extra}">${t}</span>`;
const tarjeta = (pos) => `
  <div data-arrastre="tarjeta" style="position: absolute; left: ${pos.left}px; top: ${pos.top}px; width: ${TARJ.w}px; height: ${TARJ.h}px; box-sizing: border-box;
    background: #FFFFFF; border: 1px solid ${LINE}; ${SOMBRA} border-radius: 22px; padding: 30px 34px; font-family: ${FONT}; color: ${INK};">
    <div style="font-size: 16px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: ${MUTED};">Un solo esqueleto</div>
    <div style="margin-top: 10px; font-size: 64px; font-weight: 800; letter-spacing: -2px; color: ${ACC}; line-height: 1;">3 personajes</div>
    <div style="margin-top: 14px; font-size: 22px; line-height: 1.4;">Cada acción se escribe una vez y sale para el clon, Axelsine y Jhin.</div>
  </div>`;
const NOMBRE = { clon: 'Clon de Axl', axelsine: 'Axelsine', jhin: 'Clon de Jhin' };
let N = 0;
const encabezado = (titulo, quien, left, top, ancho) => `
  <div style="position: absolute; left: ${left}px; top: ${top}px; width: ${ancho}px;">
    ${chip(`Transición ${++N} de 7 · ${NOMBRE[quien]}`)}
    <h2 data-pieza style="margin: 22px 0 0; font-size: 150px; font-weight: 800; letter-spacing: -6px; line-height: 0.92; color: ${ACC};">${esc(titulo)}</h2>
  </div>`;
const parrafo = (t, left, top, ancho, tam = 36) => `<p data-pieza style="position: absolute; left: ${left}px; top: ${top}px; width: ${ancho}px; margin: 0; font-size: ${tam}px; font-weight: 500; line-height: 1.38;">${t}</p>`;
const nota = (t, left, top, ancho) => `<p data-pieza style="position: absolute; left: ${left}px; top: ${top}px; width: ${ancho}px; margin: 0; font-size: 26px; color: ${MUTED}; line-height: 1.45;">${t}</p>`;
const bloque = (k, v, left, top, w) => `<div data-pieza style="position: absolute; left: ${left}px; top: ${top}px; width: ${w}px; box-sizing: border-box; background: #FFFFFF; border: 1px solid ${LINE}; ${SOMBRA} border-radius: 20px; padding: 24px 28px;">
    <div style="font-size: 15px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${MUTED};">${k}</div>
    <div style="margin-top: 8px; font-family: ${MONO}; font-size: 28px; font-weight: 500; color: ${INK};">${v}</div></div>`;
const seccion = (label, fondo, cuerpo, color = INK) => `
<section data-label="${esc(label)}" style="${fondo} font-family: ${FONT}; color: ${color};">${cuerpo}
</section>`;

const L = [];
// 1 · Portada (el clon espera; Axelsine baja colgado de la orilla de arriba)
L.push({ elenco: [{ pj: 'clon', x: IZQ }], sale: T.bajada, html: seccion('Portada', FONDO_COLOR, `
  <div style="position: absolute; left: 640px; right: 120px; top: 210px;">
    <div style="font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8;">Presentations · Avatares 3D · v2</div>
    <h1 style="margin: 26px 0 0; font-size: 112px; font-weight: 800; letter-spacing: -4px; line-height: 0.98;">Ellos mueven las láminas</h1>
    <p style="margin: 34px 0 0; font-size: 34px; line-height: 1.4; opacity: 0.92; max-width: 1060px;">Tres personajes, siete transiciones. Cada lámina va amarrada a la mano o al pie real del avatar, cuadro por cuadro.</p>
    <div style="display: flex; gap: 14px; margin-top: 46px;">${['Clon de Axl', 'Axelsine', 'Clon de Jhin'].map((t) => `<span style="background: rgba(255,255,255,0.16); font-size: 22px; font-weight: 600; border-radius: 999px; padding: 11px 26px;">${t}</span>`).join('')}</div>
  </div>`, '#FFFFFF') });
// 2 · Bajada
L.push({ elenco: [{ pj: 'axelsine', x: IZQ }], sale: T.persiana, html: seccion('Bajada', FONDO_BLANCO, `
  ${encabezado('Bajada', 'axelsine', 640, 160, 1200)}
  ${parrafo('Entró colgado de la orilla de arriba. Bajó la lámina en dos tirones, la soltó y cayó en cuclillas. La lámina siguió cayendo sola.', 640, 520, 1120)}
  ${nota('Sirve para: bajar al detalle de un tema.', 640, 760, 1100)}`) });
// 3 · Persiana (lleva la tarjeta que el clon va a jalar)
L.push({ elenco: [{ pj: 'clon', x: IZQ }], sale: T.mantel, html: seccion('Persiana', FONDO_LAVANDA, `
  ${encabezado('Persiana', 'clon', 640, 120, 1200)}
  ${parrafo('Subió desde abajo empujando la orilla con las palmas. La lámina se enrolló como persiana y al final la aventó.', 640, 400, 1150, 34)}
  ${tarjeta(TARJ_EN)}
  ${nota('← Ahora va a jalar esta tarjeta', TARJ_EN.left + TARJ.w + 40, TARJ_EN.top + 96, 520)}`) });
// 4 · Mantel (la tarjeta aterriza aquí)
L.push({ elenco: [{ pj: 'clon', x: IZQ }], sale: T.esquina, html: seccion('Mantel', FONDO_BLANCO, `
  ${encabezado('Mantel', 'clon', 640, 160, 1200)}
  ${parrafo('Agarró la tarjeta y jaló. La lámina se cayó como un mantel y la tarjeta voló a su lugar nuevo.', 640, 520, 640)}
  ${nota('Sirve para: llevar un dato de una lámina a la siguiente.', 640, 790, 640)}
  ${tarjeta(TARJ_DESTINO)}`) });
// 5 · Esquina (bloques sueltos: la patada los manda a volar)
L.push({ elenco: [{ pj: 'axelsine', x: DER, reposo: 'axelsine/reposo-izq' }], sale: T.patada, html: seccion('Esquina', FONDO_BLANCO, `
  ${encabezado('Esquina', 'axelsine', 130, 130, 1300)}
  ${parrafo('Cayó junto a la esquina, la agarró y peló la lámina. El doblez sigue a su mano y, al soltarla, la página se termina de pelar sola.', 130, 470, 1200, 34)}
  ${bloque('Doblez', 'mediatriz mano–esquina', 130, 690, 400)}
  ${bloque('Revés', 'papel lavanda', 560, 690, 330)}
  ${bloque('Sombra', 'drop-shadow', 920, 690, 330)}
  ${nota('Cada bloque de esta lámina es una pieza suelta. Mira lo que viene.', 130, 880, 1100)}`) });
// 6 · Patada
L.push({ elenco: [{ pj: 'jhin', x: T.patada.x }], sale: T.disparo, html: seccion('Patada', FONDO_LAVANDA, `
  ${encabezado('Patada', 'jhin', 640, 150, 1200)}
  ${parrafo('Entró de un salto y pateó la lámina. Cada bloque salió volando con su propia física: gravedad, giro y rebote en el piso.', 640, 500, 1120)}
  ${nota('Sirve para: romper con el tema anterior.', 640, 740, 1100)}`) });
// 7 · Disparo (número grande donde pega la bala)
L.push({ elenco: [{ pj: 'jhin', x: T.disparo.x }], sale: T.final, html: seccion('Disparo', FONDO_BLANCO, `
  ${encabezado('Disparo', 'jhin', 640, 150, 1200)}
  ${parrafo('Apuntó la Whisper y el tiempo se frenó. La bala cruzó la lámina y la rompió como vidrio, desde el agujero.', 640, 500, 1120)}
  <div data-pieza style="position: absolute; left: 640px; top: 720px; font-family: ${MONO}; font-size: 120px; font-weight: 500; color: ${ACC}; letter-spacing: -4px;">×0.24</div>
  ${nota('de velocidad en el impacto', 1060, 790, 600)}`) });
// 8 · Final: Jhin se queda, el clon baja colgado y Axelsine cae del cielo
L.push({ elenco: [{ pj: 'jhin', x: T.disparo.x }, { pj: 'clon', x: T.final.x }, { pj: 'axelsine', x: 950, entra: 'axelsine/baja' }], html: seccion('Final', FONDO_COLOR, `
  <div style="position: absolute; left: 0; right: 0; top: 120px; text-align: center;">
    <div style="font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8;">Biblioteca de acciones v2</div>
    <h2 style="margin: 22px 0 0; font-size: 92px; font-weight: 800; letter-spacing: -3px; line-height: 1;">Un esqueleto, tres personajes</h2>
    <p style="margin: 22px 0 0; font-size: 30px; opacity: 0.9;">Blender exporta la trayectoria de cada mano y cada pie. El deck amarra la lámina ahí.</p>
  </div>`, '#FFFFFF') });

// ── Clips usados y fichas para la página ──
const usados = new Set();
L.forEach((l) => {
  l.elenco.forEach((e) => { usados.add(e.reposo || e.pj + '/reposo'); if (e.entra) usados.add(e.entra); });
  if (l.sale) { usados.add(l.sale.clave); usados.add(l.sale.reposo || l.sale.pj + '/reposo'); }
});
const EVENTOS = ['suelta', 'aterriza', 'agarra', 'jalon', 'piso', 'impacto', 'mano', 'pie'];
const r4 = (v) => Math.round(v * 10000) / 10000;
const FICHAS = {}, faltan = [];
fs.mkdirSync(path.join(__dirname, 'assets/avatares'), { recursive: true });
for (const k of usados) {
  const f = CAT[k];
  if (!f) { faltan.push(k); continue; }
  const o = { cuadros: f.cuadros, ancla: f.ancla, kb: f.kb };
  EVENTOS.forEach((e) => { if (f[e] !== undefined) o[e] = f[e]; });
  o.tray = f.tray.map((t) => { const q = {}; for (const n in t) q[n] = [r4(t[n][0]), r4(t[n][1])]; return q; });
  FICHAS[k] = o;
  const origen = path.join(BIB, f.archivo), destino = path.join(__dirname, 'assets/avatares', k.replace('/', '-') + '.webm');
  if (!fs.existsSync(destino) || fs.statSync(destino).mtimeMs < fs.statSync(origen).mtimeMs) fs.copyFileSync(origen, destino);
}
if (faltan.length) { console.error('Faltan en catalogo_v2.json:', faltan.join(', ')); process.exit(1); }

const VER = require('crypto').createHash('md5').update(fs.readFileSync(__dirname + '/avatares.js')).digest('hex').slice(0, 8);
const config = { base: 'assets/avatares/', S, piso: PISO, fichas: FICHAS,
  laminas: L.map((l) => ({ elenco: l.elenco, sale: l.sale ? Object.fromEntries(Object.entries(l.sale).filter(([k]) => k !== 'html')) : null })) };

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Avatares que mueven las láminas</title>
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>html, body { margin: 0; padding: 0; background: ${INK}; } section { overflow: hidden; }</style>
</head>
<body>
<deck-stage width="1920" height="1080">
${L.map((l) => l.html).join('\n')}
</deck-stage>
<script src="./gsap.min.js"></script>
<script>window.AVATARES = ${JSON.stringify(config)};</script>
<script src="./avatares.js?v=${VER}"></script>
</body>
</html>
`;
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${L.length} láminas, ${Object.keys(FICHAS).length} clips; tarjeta en ${TARJ_EN.left},${TARJ_EN.top}`);
