// Generador de index.html — «Ultracode en la práctica»: mi experiencia con
// Claude Code en orquestación multiagente, contada con Minuto Dulce.
// Ejecutar: node ultracode/gen.js
//
// Charla interna para el equipo (16:9). Fuentes, todas verificadas por un
// workflow de investigación con verificador escéptico por frente (194 cifras:
// 182 confirmadas, 12 corregidas, 0 refutadas):
//   - PKB: metodologia/playbook.md (v1.1), changelog.md, definicion-de-terminado.md,
//     plantillas/workflows/ y las dos retros de Minuto Dulce (2026-10).
//   - Repo minuto-dulce: git log con hora, tags y CHANGELOG.
//   - PKB proyectos/personales/minuto-dulce/modules/tutoriales.md.
//
// Cuidados que vienen de esa verificación (no quitarlos al editar):
//   - La palabra «ultracode» NO aparece en el PKB ni en los retros: que el
//     trabajo se hizo así lo afirma Axl. Lo medible son los workflows.
//   - Los agentes de los workflows llevaban effort «high», nunca «max».
//   - El 55 % del límite semanal del plan Max es DATO DEL USUARIO, sin fuente.
//   - Las «6 horas» = scaffold (17:25) → tag v0.2.0 (23:51): 6 h 26 min de
//     reloj, con una pausa de 112 min. Los tutoriales son de la v0.4.0, dos
//     días después: van como lo que vino DESPUÉS, no dentro de esas horas.
//   - Tokens: 22.5 M en v0.1–v0.3 (la retro dice 22.4 por un redondeo) más
//     6.3 M en v0.4.0 = ~28.8 M, sin contar la sesión principal.
//   - La usuaria de la app es una persona real: va anónima a propósito.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Identidad ────────────────────────────────────────────────────────────
// Sale de las dos apps de Axl: la marca de Minuto Dulce (chocolate, rosa y
// oro de su paleta; Fraunces, DM Sans y Caveat de su tipografía) y el lima
// de su portafolio. Cada color dice de qué lado está cada cosa:
//   rosa  = la orquestación (los agentes)
//   oro   = la sesión directa, el modo de siempre
//   lima  = el humano: su revisión, sus decisiones y su dato del 55 %.
//           Escaso a propósito, como en el portafolio, donde solo sale en foco.
//   fresa = lo que salió mal
// Lo escrito a mano (Caveat) también es del humano, y va siempre en lima.
const BG = '#140D08';        // chocolate de la marca, llevado a noche
const PANEL = '#1D140C';
const PANEL_2 = '#271B11';
const LINE = '#3B2A1B';
const BONE = '#FAEEE6';      // crema con un dejo del rosa claro de la marca
const MUTED = '#BCA48C';
const DIM = '#86705A';
const ROSA = '#F7B7BA';      // --pink de Minuto Dulce · orquestación
const ORO = '#BC9763';       // --gold de Minuto Dulce · sesión directa
const LIMA = '#D9F24A';      // --color-lima del portafolio · el humano
const FRESA = '#EA6B5D';     // lo que salió mal
const OK = '#8CC79B';        // confirmado, en verde

const SANS = `'DM Sans', ui-sans-serif, system-ui, sans-serif`;
const DISPLAY = `'Fraunces', Georgia, serif`;
const MANO = `'Caveat', cursive`;
const MONO = `'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace`;
const SUAVE = "font-variation-settings: 'SOFT' 100, 'opsz' 144;";
const NUM = 'font-variant-numeric: tabular-nums;';
const CARD = `background: linear-gradient(180deg, ${PANEL_2} 0%, ${PANEL} 100%); border: 1px solid ${LINE}; box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset, 0 18px 40px rgba(0,0,0,0.35);`;
// Chispas: el confeti de repostería de la marca, como textura del fondo.
// Posiciones fijas (el video necesita que cada cuadro sea idéntico).
const CHISPAS = [[22, 30, 35, ROSA], [118, 18, -20, ORO], [196, 64, 70, BONE], [64, 104, -55, ORO],
  [160, 134, 15, ROSA], [30, 182, 80, BONE], [104, 210, -30, ROSA], [214, 196, 40, ORO]];
const chispas = () => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>` +
    CHISPAS.map(([x, y, r, c]) => `<rect x='${x}' y='${y}' width='15' height='5' rx='2.5' fill='${c}' fill-opacity='0.11' transform='rotate(${r} ${x + 7.5} ${y + 2.5})'/>`).join('') +
    `</svg>`;
  // comillas simples por la misma razón que kit.grano(): esto va dentro de style="…"
  return kit.capa(`url('data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/'/g, '%27')}')`, '240px 240px');
};
const FONDO = kit.fondo(BG,
  kit.grano({ opacidad: 0.06 }),
  chispas(),
  kit.lavado({ color: ROSA, en: '100% 0%', ancho: 62, alto: 55, fuerza: 0.10, alcance: 62 }),
  kit.lavado({ color: ORO, en: '0% 100%', ancho: 55, alto: 50, fuerza: 0.07, alcance: 60 }));

// ── Datos verificados ────────────────────────────────────────────────────
const hm = min => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

// Hora de cada commit del 9 de octubre (git log --date=format:'%H:%M');
// el último es del 10 a las 00:05 y se cuenta como 24:05.
const COMMITS_9OCT = ['17:25', '17:53', '18:23', '18:23', '18:23', '18:23', '18:23', '18:51', '18:52',
  '18:52', '18:52', '19:13', '19:13', '19:13', '19:14', '19:14', '19:14', '19:14', '19:14', '19:17',
  '19:20', '19:24', '21:17', '22:10', '22:23', '22:30', '23:07', '23:07', '23:30', '23:35', '23:41',
  '23:51', '24:05'];
const aMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

const WORKFLOWS = [
  { n: '01', nombre: 'Construcción', ver: 'v0.1.0', agentes: 13, tokens: 3.2, dur: '~80 min' },
  { n: '02', nombre: 'Calidad y entrega', ver: 'v0.1–0.2', agentes: 22, tokens: 3.9, dur: '~50 min' },
  { n: '03', nombre: 'Refactor a inglés, diseño y E2E', ver: 'v0.2.0', agentes: 42, tokens: 7.9, dur: '~2.5 h' },
  { n: '04', nombre: 'Seguridad y perfil', ver: 'v0.3.0', agentes: 46, tokens: 7.5, dur: '~3 h' },
  { n: '05', nombre: 'Tutoriales en la app', ver: 'v0.4.0', agentes: 33, tokens: 6.3, dur: '~2 h 15 min' },
];
const TOTAL_AGENTES = WORKFLOWS.reduce((a, w) => a + w.agentes, 0);           // 156
const TOTAL_TOKENS = +WORKFLOWS.reduce((a, w) => a + w.tokens, 0).toFixed(1); // 28.8

const TUTORIALES = [
  { f: '01-tu-app', t: 'Tu app', d: '1:22' },
  { f: '02-insumos', t: 'Insumos', d: '1:01' },
  { f: '03-recetas', t: 'Recetas', d: '1:25' },
  { f: '04-cotizar', t: 'Cotizar', d: '1:04' },
  { f: '05-anotar-un-pedido', t: 'Anotar un pedido', d: '0:54' },
  { f: '06-cobrar-y-entregar', t: 'Cobrar y entregar', d: '1:05' },
  { f: '07-todo-conectado', t: 'Todo conectado', d: '1:05' },
];

// ── Helpers de maquetado ─────────────────────────────────────────────────
const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 104px; display: flex; align-items: center; justify-content: space-between; padding: 0 96px; border-bottom: 1px solid ${LINE};">
      <div style="display: flex; align-items: center; gap: 14px; font: 500 19px/1 ${MONO};">
        <span style="color: ${ROSA};">❯</span>
        <span style="color: ${BONE};">ultracode</span>
        <span style="color: ${DIM};">· minuto dulce</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font: 500 16px/1 ${MONO}; letter-spacing: 2.4px; text-transform: uppercase; color: ${MUTED};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = () => `${FONDO} font-family: ${SANS}; color: ${BONE}; display: flex; flex-direction: column; padding: 152px 96px 64px; box-sizing: border-box; overflow: hidden;`;

const h2 = (txt, size = 58) =>
  `<h2 data-split style="margin: 0; font-family: ${DISPLAY}; ${SUAVE} font-size: ${size}px; font-weight: 600; color: ${BONE}; letter-spacing: -1.2px; line-height: 1.08;">${txt}</h2>`;

const bajada = (txt, max = 1400) =>
  `<p data-a="up2" style="margin: 18px 0 0; font-size: 25px; font-weight: 400; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;

const etiqueta = (txt, color = MUTED) =>
  `<span style="font: 500 15px/1 ${MONO}; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${txt}</span>`;

const pastilla = (txt, color = ROSA, fondo = null) =>
  `<span style="display: inline-flex; align-items: center; gap: 8px; font: 500 16px/1 ${MONO}; color: ${color}; background: ${fondo || kit.alpha(color, 0.12)}; border: 1px solid ${kit.alpha(color, 0.35)}; border-radius: 999px; padding: 8px 16px; white-space: nowrap; ${NUM}">${txt}</span>`;

const nota = (txt, color = ROSA) => `
    <div data-nota style="border-left: 3px solid ${color}; background: ${kit.alpha(color, 0.08)}; border-radius: 0 12px 12px 0; padding: 20px 28px; font-size: 22px; line-height: 1.5; color: ${BONE};">${txt}</div>`;

const fuerte = txt => `<strong style="font-weight: 600; color: ${BONE};">${txt}</strong>`;

const slides = [];

// ── Piezas SVG (coordenadas en píxeles reales: el dasharray mide bien) ───
const largo = (x1, y1, x2, y2) => +Math.hypot(x2 - x1, y2 - y1).toFixed(1);
const linea = (x1, y1, x2, y2, color, ancho = 2) => {
  const L = largo(x1, y1, x2, y2);
  return `<line data-trazo data-largo="${L}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="0"></line>`;
};
const capsula = (cx, cy, w, h, txt, color, { lleno = false, tam = 17 } = {}) => `
        <g data-nodo>
          <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${lleno ? color : PANEL_2}" stroke="${color}" stroke-width="1.5"></rect>
          <text x="${cx}" y="${cy + tam * 0.35}" text-anchor="middle" style="font: 500 ${tam}px ${MONO}; fill: ${lleno ? BG : BONE};">${txt}</text>
        </g>`;

// Sesión normal: una sola fila de trabajo, de arriba abajo
const diagramaNormal = () => {
  const x = 230, pasos = [['tú', 34], ['Claude', 104], ['lee', 188], ['edita', 256], ['prueba', 324], ['reporta', 392]];
  let s = '';
  for (let i = 0; i < pasos.length - 1; i++) s += linea(x, pasos[i][1] + 20, x, pasos[i + 1][1] - 20, ORO);
  pasos.forEach(([t, y], i) => { s += capsula(x, y, i < 2 ? 150 : 130, 40, t, ORO, { lleno: i === 1 }); });
  return `<svg viewBox="0 0 460 430" style="width: 460px; height: 430px; overflow: visible;">${s}</svg>`;
};

// Ultracode: el orquestador abre en abanico, cada agente pasa por su
// verificador y todo converge en el gate
const diagramaUltra = () => {
  const cx = 400, xs = [90, 245, 400, 555, 710];
  let s = linea(cx, 54, cx, 82, ROSA);
  xs.forEach(x => { s += linea(cx, 128, x, 196, ROSA); s += linea(x, 238, x, 276, ROSA); s += linea(x, 316, x, 362, ROSA, 1.5); });
  s += capsula(cx, 34, 110, 40, 'tú', ROSA);
  s += capsula(cx, 105, 240, 46, 'orquestador', ROSA, { lleno: true });
  xs.forEach((x, i) => { s += capsula(x, 217, 128, 42, ['base', 'motor', 'recetas', 'ventas', 'testing'][i], ROSA); });
  xs.forEach(x => { s += capsula(x, 296, 116, 38, 'refuta', ROSA, { tam: 15 }); });
  s += `<g data-nodo><rect x="40" y="364" width="720" height="44" rx="10" fill="${kit.alpha(ROSA, 0.14)}" stroke="${ROSA}" stroke-width="1.5"></rect>
          <text x="400" y="392" text-anchor="middle" style="font: 500 17px ${MONO}; fill: ${BONE};">gate · checks · commit del supervisor</text></g>`;
  return `<svg viewBox="0 0 800 430" style="width: 800px; height: 430px; overflow: visible;">${s}</svg>`;
};

// Portada: un nodo que abre en abanico a muchos agentes sobre un arco
const abanicoPortada = () => {
  const ox = 120, oy = 400, n = 15, R = 470;
  let s = '';
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (-62 + i * (124 / (n - 1))) * Math.PI / 180;
    return [+(ox + R * Math.cos(a)).toFixed(1), +(oy + R * Math.sin(a)).toFixed(1)];
  });
  pts.forEach(([x, y]) => { s += linea(ox, oy, x, y, kit.alpha(ROSA, 0.45), 1.5); });
  pts.forEach(([x, y], i) => { s += `<circle data-punto cx="${x}" cy="${y}" r="${i % 4 === 0 ? 11 : 8}" fill="${i % 4 === 0 ? ROSA : PANEL_2}" stroke="${ROSA}" stroke-width="2"></circle>`; });
  s += `<circle data-punto cx="${ox}" cy="${oy}" r="34" fill="${ROSA}"></circle>
        <text x="${ox}" y="${oy + 9}" text-anchor="middle" style="font: 600 26px ${MONO}; fill: ${BG};">❯</text>`;
  return `<svg viewBox="0 0 640 800" style="width: 640px; height: 800px; overflow: visible;">${s}</svg>`;
};

// Chispas sueltas sobre la lámina: caen al entrar, como en la marca.
const chispasSueltas = lista => lista.map(([x, y, r, c, w = 26]) =>
  `<span data-chispa style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${Math.round(w / 3)}px; border-radius: 99px; background: ${c}; opacity: 0.85; transform: rotate(${r}deg);"></span>`).join('');

// ── 1 · Portada ──────────────────────────────────────────────────────────
const contador = (valor, txt, color = ROSA, cuenta = null, sufijo = '', mano = '') => `
        <div data-contador style="position: relative; display: flex; flex-direction: column; gap: 8px; padding-top: 18px; border-top: 2px solid ${kit.alpha(color, 0.6)};">
          ${mano ? `<span data-mano style="position: absolute; right: -6px; top: -50px; font: 700 30px/1 ${MANO}; color: ${LIMA}; transform: rotate(-5deg); white-space: nowrap;">${mano}</span>` : ''}
          <span ${cuenta != null ? `data-cuenta="${cuenta}" ${sufijo ? `data-sufijo="${sufijo}"` : ''}` : ''} style="font: 600 44px/1 ${DISPLAY}; ${SUAVE} color: ${color}; letter-spacing: -1.5px; white-space: nowrap; ${NUM}">${valor}</span>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.35;">${txt}</span>
        </div>`;

slides.push(`
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="Les quiero contar como fue construir una app completa dirigiendo agentes en vez de escribir codigo, con Claude Code en ultracode. Que salio, que costo y que aprendi." style="${FONDO} font-family: ${SANS}; color: ${BONE}; display: grid; grid-template-columns: 1fr 600px; align-items: center; padding: 0 96px 0 120px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div style="position: absolute; right: -40px; top: 140px;">${abanicoPortada()}</div>
      ${chispasSueltas([[1290, 120, 30, ORO], [1480, 86, -40, ROSA], [1700, 150, 65, BONE, 20], [1820, 330, -15, ORO], [1250, 960, 50, ROSA], [1560, 1000, -60, ORO, 22], [1800, 920, 20, ROSA], [1130, 70, -70, BONE, 18]])}
    </div>
    <div style="position: relative; display: flex; flex-direction: column;">
      <div data-a="up" style="display: flex; align-items: center; gap: 14px; font: 500 20px/1 ${MONO};">
        <span style="color: ${ROSA};">❯</span><span style="color: ${BONE};">claude --ultracode</span><span data-cursor style="display: inline-block; width: 11px; height: 22px; background: ${ROSA};"></span>
      </div>
      <h1 data-split style="margin: 34px 0 0; font-family: ${DISPLAY}; ${SUAVE} font-size: 108px; font-weight: 600; letter-spacing: -3px; line-height: 0.98;">Ultracode<br><em style="font-style: italic; font-weight: 500; color: ${ROSA};">en la práctica</em></h1>
      <p data-a="up2" style="margin: 30px 0 0; font-size: 28px; color: ${MUTED}; line-height: 1.45; max-width: 980px;">Cómo construí una app completa <span style="color: ${BONE};">dirigiendo agentes en vez de escribir código</span> — lo que salió, lo que costó y el plan que me dejó.</p>
      <div data-a="up3" style="margin-top: 56px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; max-width: 1180px;">
        ${contador('6 h 26 min', 'del repo vacío al primer entregable')}
        ${contador(String(TOTAL_AGENTES), 'subagentes en 5 workflows', ROSA, TOTAL_AGENTES)}
        ${contador('7', 'tutoriales en video, después', ORO, 7)}
        ${contador('~55 %', 'de mi límite semanal de Max · dato propio', LIMA, null, '', 'lo medí yo ↓')}
      </div>
      <span data-a="up3" style="margin-top: 48px; font: 400 17px/1 ${MONO}; color: ${DIM};">Axl Guillen · octubre 2026 · caso: Minuto Dulce</span>
    </div>
  </section>`);

// ── 2 · Qué es ultracode ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Qué es ultracode" data-screen-label="Qué es" data-speaker-notes="La diferencia no es que Claude escriba mas rapido. Es que deja de hacer la tarea y pasa a dirigirla: escribe un plan, lanza agentes, y cada hallazgo pasa por alguien que intenta tumbarlo." style="${seccion()}">
    ${header('Qué es')}
    ${h2('Con ultracode, Claude deja de hacer la tarea<br>y pasa a dirigirla')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 520px 1fr; gap: 40px; flex: 1;">
      <div data-panel style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${etiqueta('Sesión normal', ORO)}<span style="font: 400 15px ${MONO}; color: ${DIM};">un agente · en serie</span></div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center;">${diagramaNormal()}</div>
      </div>
      <div data-panel style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 10px; border-color: ${kit.alpha(ROSA, 0.4)};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${etiqueta('Ultracode', ROSA)}<span style="font: 400 15px ${MONO}; color: ${DIM};">orquestador + subagentes · en paralelo</span></div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center;">${diagramaUltra()}</div>
      </div>
    </div>
    <div data-a="up3" style="margin-top: 22px; display: flex; gap: 14px; flex-wrap: wrap;">
      ${pastilla('se activa a propósito: «ultracode» en el pedido')}
      ${pastilla('un workflow por cada tarea con sustancia')}
      ${pastilla('cada hallazgo pasa por un verificador que intenta refutarlo')}
      ${pastilla('el costo en tokens deja de ser el límite', FRESA)}
    </div>
  </section>`);

// ── 3 · Comparativo ──────────────────────────────────────────────────────
const FILAS = [
  ['Quién hace el trabajo', 'Un agente, dentro de tu conversación', 'Decenas de subagentes; la sesión principal orquesta y es la única que te habla'],
  ['Paralelismo', 'Una cosa a la vez', 'Varios agentes a la vez, cada uno dueño de sus carpetas'],
  ['Verificación', 'La haces tú al leer la respuesta', 'Revisores encuentran, verificadores escépticos intentan refutar'],
  ['Qué atrapa', 'Lo que tú alcances a ver', '~71 de ~74 hallazgos confirmados en Minuto Dulce v0.1–v0.3'],
  ['Costo', 'Menos de 1 M tokens · horas', '5–15 M por proyecto mediano · Minuto Dulce: ~28.8 M'],
  ['Cuándo conviene', 'Un cambio chico: una regla, un texto, un componente', 'Un proyecto o una fase entera, con el alcance decidido antes'],
];
slides.push(`
  <section data-label="Comparativo" data-screen-label="Comparativo" data-speaker-notes="Lado a lado. Lo que mas cambia no es la velocidad, es la verificacion. Y el costo: no todo merece un workflow, por eso existe la regla del cambio chico." style="${seccion()}">
    ${header('Comparativo')}
    ${h2('Lo que cambia no es la velocidad:<br>es quién verifica y cuánto cuesta')}
    <div data-a="up2" style="margin-top: 34px; ${CARD} border-radius: 22px; overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div style="display: grid; grid-template-columns: 300px 1fr 1fr; padding: 20px 34px; border-bottom: 1px solid ${LINE}; background: ${PANEL};">
        <span></span>${etiqueta('Sesión directa', ORO)}${etiqueta('Ultracode · workflows', ROSA)}
      </div>
      ${FILAS.map(([k, a, b], i) => `
      <div data-fila style="display: grid; grid-template-columns: 300px 1fr 1fr; gap: 0 36px; padding: 0 34px; align-items: center; flex: 1; ${i < FILAS.length - 1 ? `border-bottom: 1px solid ${LINE};` : ''}">
        <span style="font: 500 16px/1.3 ${MONO}; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED};">${k}</span>
        <span data-izq style="font-size: 22px; color: ${ORO}; line-height: 1.38;">${a}</span>
        <span data-der style="font-size: 22px; color: ${BONE}; line-height: 1.38; padding-left: 22px; border-left: 3px solid ${ROSA};">${b}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 4 · El caso: Minuto Dulce ────────────────────────────────────────────
const renglon = (izq, der, { fuerteDer = false, color = BONE, separador = false } = {}) => `
          <div data-renglon style="display: flex; justify-content: space-between; align-items: baseline; gap: 20px; ${separador ? `padding-top: 14px; border-top: 1px dashed ${LINE};` : ''}">
            <span style="font-size: 20px; color: ${MUTED};">${izq}</span>
            <span style="font: ${fuerteDer ? 600 : 500} ${fuerteDer ? 34 : 22}px/1 ${MONO}; color: ${color}; ${NUM}">${der}</span>
          </div>`;

slides.push(`
  <section data-label="El caso" data-screen-label="El caso" data-speaker-notes="El caso de prueba fue real: una reposteria bajo pedido. Se usa de pie en la cocina, asi que todo se diseño a 375 px." style="${seccion()}">
    ${header('El caso')}
    ${h2('El caso: una app para llevar el negocio<br>de una repostería bajo pedido')}
    <div data-a="up2" style="margin-top: 36px; display: grid; grid-template-columns: 640px 1fr; gap: 44px; flex: 1; align-items: start;">
      <div data-ticket style="${CARD} border-radius: 22px; padding: 32px 36px; display: flex; flex-direction: column; gap: 16px;">
        ${etiqueta('Lo que resuelve, de punta a punta', ROSA)}
        ${renglon('Guarda sus recetas una vez', '03 · Recetas')}
        ${renglon('Anota cada pedido que le llega', '05 · Pedido', { separador: true })}
        ${renglon('Marca lo que ya entregó', '06 · Entrega', { separador: true })}
        ${renglon('Y lo ve todo conectado', '07 · Conectado', { color: ROSA, separador: true })}
        <span style="font-size: 17px; color: ${DIM}; line-height: 1.45;">A la derecha, el tutorial en video que cubre cada paso dentro de la app.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 26px;">
        <div data-dato style="display: flex; flex-direction: column; gap: 8px;">
          ${etiqueta('Para quién')}
          <span style="font-size: 26px; line-height: 1.4;">Una persona que hornea y vende bajo pedido. La usa de pie en la cocina, así que <span style="color: ${ROSA};">todo se diseña a 375 px</span>.</span>
        </div>
        <div data-dato style="display: flex; flex-direction: column; gap: 8px;">
          ${etiqueta('El principio')}
          <span style="font-size: 26px; line-height: 1.4;">El sistema sugiere y <span style="color: ${ROSA};">ella decide</span>: la app propone, nunca le impone nada.</span>
        </div>
        <div data-dato style="display: flex; flex-direction: column; gap: 12px;">
          ${etiqueta('Módulos')}
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${['recetas', 'cotizar', 'pedidos y ventas', 'ajustes', 'perfil', 'tutoriales'].map(m => pastilla(m, ORO)).join('')}
          </div>
        </div>
        <div data-dato style="display: flex; flex-direction: column; gap: 8px;">
          ${etiqueta('Stack')}
          <span style="font: 500 22px ${MONO}; color: ${BONE};">Next.js 16 · Supabase · Vercel</span>
        </div>
      </div>
    </div>
    <div style="margin-top: 24px;">${nota(`Fue mi primer proyecto delegado por completo a agentes, y ${fuerte('el código nunca contradijo el documento de negocio')}: cada prueba llevaba un ejemplo obligatorio.`)}</div>
  </section>`);

// ── 5 · Mi primer plan de orquestación ───────────────────────────────────
// Es una secuencia de verdad: los números marcan el orden del ciclo.
const ETAPAS = [
  ['Estándares', 'El supervisor fija las reglas en CLAUDE.md'],
  ['Construcción', 'En paralelo, cada agente en sus carpetas y contra contratos'],
  ['Gate', 'Checks, build y commit del supervisor'],
  ['Revisión adversarial', 'Revisores encuentran, verificadores intentan refutar'],
  ['Correcciones', 'Por área y de vuelta al gate · 1 ronda, máximo 2'],
  ['Revisión humana', 'En el navegador, a 375 px, con sesión real', true],
  ['Entrega', 'Con aprobación: push y deploy'],
  ['Producción y retro', 'Se verifica en vivo y se escribe la retro'],
];
const etapa = ([t, d, humana], i) => `
        <div data-etapa style="${CARD} border-radius: 18px; padding: 22px 22px 20px; display: flex; flex-direction: column; gap: 10px; ${humana ? `border-color: ${LIMA}; background: linear-gradient(180deg, ${kit.alpha(LIMA, 0.12)} 0%, ${PANEL} 100%);` : ''}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font: 500 18px/1 ${MONO}; color: ${humana ? LIMA : DIM}; ${NUM}">${String(i + 1).padStart(2, '0')}</span>
            ${humana ? `<span data-mano style="display: inline-block; font: 700 28px/1 ${MANO}; color: ${LIMA}; transform: rotate(-4deg);">aquí entro yo</span>` : ''}
          </div>
          <span style="font-size: 23px; font-weight: 600; letter-spacing: -0.3px;">${t}</span>
          <span style="font-size: 17px; color: ${MUTED}; line-height: 1.42;">${d}</span>
        </div>`;

slides.push(`
  <section data-label="Mi plan" data-screen-label="Mi plan" data-speaker-notes="Este es el plan que salio de la experiencia: mi playbook. Un kickoff una sola vez y un ciclo de ocho etapas por fase. La pieza que mas me importa es la revision humana: es una etapa con dueño, no un extra." style="${seccion()}">
    ${header('Mi primer plan', pastilla('playbook v1.1 · 11 oct', ROSA))}
    ${h2('Mi primer plan de orquestación:<br>un ciclo por fase con la revisión humana dentro')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 250px 1fr; gap: 26px; flex: 1;">
      <div data-kickoff style="border: 1px dashed ${kit.alpha(ROSA, 0.6)}; border-radius: 18px; padding: 24px 22px; display: flex; flex-direction: column; gap: 12px; justify-content: center;">
        ${etiqueta('Una sola vez', ROSA)}
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.6px;">Kickoff</span>
        <span style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">Alcance, nivel del proyecto, convenciones, cuenta de pruebas y presupuesto, antes de la primera línea.</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 1fr; gap: 18px;">
        ${ETAPAS.map(etapa).join('')}
      </div>
    </div>
    <div style="margin-top: 22px;">${nota(`${fuerte('Definición de terminado:')} se exige evidencia —el archivo y la línea, el comando con su salida real—. «Debería pasar» no cuenta.`)}</div>
  </section>`);

// ── 6 · Roles y mecanismos ───────────────────────────────────────────────
const ROLES = [
  ['Humano', 'Decide el negocio, el gobierno y lo irreversible', LIMA],
  ['Orquestador', 'La sesión principal: diseña los workflows y es la única que te habla', ROSA],
  ['Supervisor', 'CLAUDE.md como contrato; checks, gate y commit', ORO],
  ['Constructores', 'Cada uno dueño de sus carpetas', ORO],
  ['Revisores', 'Buscan problemas, cada uno con su lente', ORO],
  ['Verificadores', 'Intentan refutar: solo se corrige lo que sobrevive', ORO],
  ['Correctores', 'Arreglan por área y regresan al gate', ORO],
];
const MECANISMOS = [
  ['Propiedad de archivos', 'Una tabla dice quién edita cada carpeta'],
  ['Solicitudes', 'Lo que un agente necesita de otro va en su reporte'],
  ['Contratos', 'Las firmas compartidas se escriben antes de construir'],
  ['Exclusividad', 'Solo el supervisor usa git y corre el build'],
  ['Reporte estructurado', 'Qué hizo, archivos y verificación con salida real'],
  ['Biblioteca de workflows', 'Se parte de las plantillas, no de cero'],
];
slides.push(`
  <section data-label="Roles" data-screen-label="Roles" data-speaker-notes="Para que muchos agentes no se pisen hacen falta roles claros y seis reglas. Con eso trabajaron 123 agentes en el mismo arbol sin un solo conflicto de edicion." style="${seccion()}">
    ${header('Roles y reglas')}
    ${h2('Siete roles y seis reglas para que<br>los agentes no se pisen')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${etiqueta('Roles')}
        ${ROLES.map(([r, d, c]) => `
        <div data-rol style="display: grid; grid-template-columns: 190px 1fr; gap: 18px; align-items: center; padding: 12px 18px; border-radius: 12px; background: ${PANEL}; border-left: 3px solid ${c};">
          <span style="font: 600 19px ${MONO}; color: ${c};">${r}</span>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.35;">${d}</span>
        </div>`).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${etiqueta('Mecanismos')}
        ${MECANISMOS.map(([m, d]) => `
        <div data-mec style="${CARD} border-radius: 12px; padding: 14px 20px; display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 21px; font-weight: 600;">${m}</span>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.35;">${d}</span>
        </div>`).join('')}
      </div>
    </div>
    <div style="margin-top: 20px;">${nota(`Con eso trabajaron ${fuerte('123 agentes en el mismo árbol, sin worktrees y sin un solo conflicto de edición')}.`, OK)}</div>
  </section>`);

// ── 7 · Las primeras 6 horas ─────────────────────────────────────────────
// Cada punto es un commit real del 9 de octubre, a su minuto exacto.
const lineaDeTiempo = () => {
  const W = 1728, x0 = 40, x1 = W - 40, ini = aMin('17:00'), fin = aMin('24:20');
  const X = t => +(x0 + (aMin(t) - ini) / (fin - ini) * (x1 - x0)).toFixed(1);
  const ejeY = 250;
  let s = `<rect data-pausa x="${X('19:24')}" y="${ejeY - 150}" width="${(X('21:17') - X('19:24')).toFixed(1)}" height="190" rx="10" fill="${kit.alpha(ORO, 0.10)}" stroke="${kit.alpha(ORO, 0.35)}" stroke-dasharray="6 6"></rect>
        <text data-pausa x="${((X('19:24') + X('21:17')) / 2).toFixed(1)}" y="${ejeY - 120}" text-anchor="middle" style="font: 500 17px ${MONO}; fill: ${ORO};">pausa · 112 min</text>`;
  s += linea(x0, ejeY, x1, ejeY, LINE, 2);
  for (let h = 17; h <= 24; h++) {
    const x = X(`${h}:00`);
    s += `<g data-hora><line x1="${x}" y1="${ejeY}" x2="${x}" y2="${ejeY + 12}" stroke="${DIM}" stroke-width="2"></line>
          <text x="${x}" y="${ejeY + 40}" text-anchor="middle" style="font: 500 17px ${MONO}; fill: ${DIM};">${h === 24 ? '00:00' : h + ':00'}</text></g>`;
  }
  const vistos = {};
  COMMITS_9OCT.forEach(t => {
    const k = vistos[t] = (vistos[t] || 0) + 1;
    s += `<circle data-commit cx="${X(t)}" cy="${ejeY - 12 - (k - 1) * 15}" r="6" fill="${ROSA}"></circle>`;
  });
  // el último hito cae pegado al borde derecho: su texto se ancla hacia la izquierda
  const hito = (t, titulo, sub, alto, izquierda = false) => {
    const tx = izquierda ? X(t) - 12 : X(t) + 12, ancla = izquierda ? 'end' : 'start';
    return `
        <g data-hito>
          <line x1="${X(t)}" y1="${ejeY + 54}" x2="${X(t)}" y2="${ejeY + alto}" stroke="${ROSA}" stroke-width="2"></line>
          <text x="${tx}" y="${ejeY + alto - 26}" text-anchor="${ancla}" style="font: 600 24px ${MONO}; fill: ${BONE};">${titulo}</text>
          <text x="${tx}" y="${ejeY + alto}" text-anchor="${ancla}" style="font: 400 18px ${SANS}; fill: ${MUTED};">${sub}</text>
        </g>`;
  };
  s += hito('17:25', '17:25 · scaffold', 'Next.js, shadcn y auth con Supabase', 128);
  s += hito('19:24', 'v0.1.0', 'primer demo · 1 h 59 min · 22 commits', 196);
  s += hito('23:51', 'v0.2.0', '6 h 26 min · 32 commits', 128, true);
  return `<svg viewBox="0 0 ${W} 460" style="width: 100%; height: 460px; overflow: visible;">${s}</svg>`;
};

slides.push(`
  <section data-label="Las primeras 6 horas" data-screen-label="6 horas" data-speaker-notes="Cada punto es un commit real del 9 de octubre. Arranque a las 5:25 de la tarde, primer demo a las dos horas, y el primer entregable completo, la v0.2.0, a las 6 horas 26 minutos. Hubo casi dos horas de pausa en medio." style="${seccion()}">
    ${header('El primer día')}
    ${h2('Del repo vacío al primer entregable:<br>6 horas y 26 minutos')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: flex; align-items: center;">${lineaDeTiempo()}</div>
    <div data-a="up3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;">
      ${[['1 h 59 min', 'hasta el primer demo funcional (v0.1.0)', ROSA], ['6 h 26 min', 'hasta v0.2.0, el primer entregable revisable', ROSA], ['~4 h 48 min', 'con commits; el resto fue una pausa de casi 2 h', ORO]].map(([v, t, c]) => `
      <div data-resumen style="${CARD} border-radius: 16px; padding: 20px 24px; display: flex; align-items: baseline; gap: 16px;">
        <span style="font: 600 34px/1 ${DISPLAY}; ${SUAVE} color: ${c}; white-space: nowrap; ${NUM}">${v}</span>
        <span style="font-size: 18px; color: ${MUTED}; line-height: 1.35;">${t}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 8 · El alcance a las 6 horas ─────────────────────────────────────────
const cifra = (v, t, cuenta) => `
          <div data-cifra style="display: flex; flex-direction: column; gap: 6px;">
            <span ${cuenta != null ? `data-cuenta="${cuenta}"` : ''} style="font: 600 52px/1 ${DISPLAY}; ${SUAVE} color: ${ROSA}; letter-spacing: -1.5px; ${NUM}">${v}</span>
            <span style="font-size: 18px; color: ${MUTED};">${t}</span>
          </div>`;
slides.push(`
  <section data-label="Alcance" data-screen-label="Alcance" data-speaker-notes="Lo importante es lo que habia a esas horas: no un prototipo, sino la fase uno completa, con diez roles de agente trabajando en paralelo." style="${seccion()}">
    ${header('El alcance')}
    ${h2('A las 6 horas no había un prototipo:<br>había la fase 1 completa')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 1.25fr 1fr; gap: 30px; flex: 1;">
      <div data-version style="${CARD} border-radius: 22px; padding: 30px 34px; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font: 600 30px ${MONO}; color: ${BONE};">v0.1.0</span>${etiqueta('a las 1 h 59 min · 10 roles en paralelo', ROSA)}
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 20px;">
          ${cifra('258', 'archivos', 258)}
          ${cifra('28 334', 'líneas añadidas')}
          ${cifra('16', 'pantallas', 16)}
          ${cifra('4', 'migraciones de BD', 4)}
          ${cifra('39', 'archivos de prueba', 39)}
          ${cifra('3', 'modos de cotizar', 3)}
        </div>
        <div data-roles style="display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 18px; border-top: 1px solid ${LINE};">
          ${etiqueta('Los 10 roles que trabajaron a la vez')}
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${['base', 'BD', 'diseño', 'motor', 'datos', 'insumos', 'recetas', 'cotizar', 'ventas', 'testing'].map(m => pastilla(m, ORO)).join('')}
          </div>
        </div>
      </div>
      <div data-version style="${CARD} border-radius: 22px; padding: 30px 34px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font: 600 30px ${MONO}; color: ${BONE};">v0.2.0</span>${etiqueta('a las 6 h 26 min', ROSA)}
        </div>
        ${['Código, esquema y rutas pasados a inglés', 'Tipografía más cálida y animación sutil', 'Suite E2E con Playwright', 'Revisión con verificadores y correcciones por área'].map(t => `
        <div data-punto-v style="display: flex; gap: 14px; align-items: flex-start;">
          <span style="flex: none; margin-top: 10px; width: 8px; height: 8px; border-radius: 50%; background: ${ROSA};"></span>
          <span style="font-size: 22px; line-height: 1.4;">${t}</span>
        </div>`).join('')}
        <span style="margin-top: auto; font-size: 17px; color: ${DIM}; line-height: 1.45;">32 commits ese día. Ahí pude revisar la app en el navegador por primera vez.</span>
      </div>
    </div>
  </section>`);

// ── 9 · Encaminado ───────────────────────────────────────────────────────
const VERSIONES = [
  ['v0.1.0', '9 oct · 19:24', 'Fase 1: recetas, cotización y ventas'],
  ['v0.2.0', '9 oct · 23:51', 'Inglés, diseño cálido y pruebas E2E'],
  ['v0.3.0', '10 oct · 05:32', 'Seguridad: CSP con nonce y cabeceras; Mi perfil con foto; límite de intentos de login'],
  ['v0.4.0', '11 oct · 19:08', 'Tutoriales en video dentro de la app'],
];
const HOY = [['311', 'archivos en src', 311], ['29 459', 'líneas de código'], ['18', 'pantallas', 18], ['9', 'migraciones', 9], ['1008', 'pruebas unitarias en verde', 1008], ['72', 'E2E escritas · 49 en verde', 72]];
slides.push(`
  <section data-label="Encaminado" data-screen-label="Encaminado" data-speaker-notes="Con esa base, en los dos dias siguientes llegaron la seguridad, el perfil y los tutoriales. Asi quedo el proyecto: encaminado y en produccion." style="${seccion()}">
    ${header('Encaminado')}
    ${h2('Tres días, cuatro versiones:<br>el proyecto quedó encaminado')}
    <div data-a="up2" style="margin-top: 38px; position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;">
      <div data-riel style="position: absolute; left: 12px; right: 12px; top: 13px; height: 2px; background: ${LINE};"></div>
      ${VERSIONES.map(([v, f, d]) => `
      <div data-ver style="position: relative; display: flex; flex-direction: column; gap: 12px;">
        <span style="width: 28px; height: 28px; border-radius: 50%; background: ${BG}; border: 3px solid ${ROSA};"></span>
        <span style="font: 600 30px ${MONO}; color: ${BONE};">${v}</span>
        <span style="font: 500 17px ${MONO}; color: ${ROSA};">${f}</span>
        <span style="font-size: 20px; color: ${MUTED}; line-height: 1.4;">${d}</span>
      </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="${CARD} border-radius: 22px; padding: 26px 34px; display: flex; flex-direction: column; gap: 18px;">
      ${etiqueta('Cómo está hoy', OK)}
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px;">
        ${HOY.map(([v, t, c]) => `
        <div data-hoy style="display: flex; flex-direction: column; gap: 6px;">
          <span ${c != null ? `data-cuenta="${c}"` : ''} style="font: 600 42px/1 ${DISPLAY}; ${SUAVE} color: ${BONE}; letter-spacing: -1px; ${NUM}">${v}</span>
          <span style="font-size: 16px; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
    </div>
    <div style="margin-top: 18px;">${nota(`Seguridad: ${fuerte('ninguna falla alta en la app')} y quien no es miembro ve 0 filas (RLS más lista de permitidos).`, OK)}</div>
  </section>`);

// ── 10 · Los tutoriales ──────────────────────────────────────────────────
const PIPELINE = ['la app real', 'Playwright graba', 'Fish Audio narra', 'ffmpeg compone', 'YouTube', 'dentro de la app'];
slides.push(`
  <section data-label="Tutoriales" data-screen-label="Tutoriales" data-speaker-notes="Con el primer entregable revisado, lo siguiente fue enseñar a usarla. Siete videos cortos grabando la app real, narrados con Fish Audio y metidos en la propia app." style="${seccion()}">
    ${header('Después', pastilla('7 videos · 7:56', ROSA))}
    ${h2('Después: siete tutoriales en video<br>para enseñarle a usarla')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 20px;">
      ${TUTORIALES.map((t, i) => `
      <div data-tut style="display: flex; flex-direction: column; gap: 10px;">
        <div style="aspect-ratio: 9 / 16; border-radius: 16px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: 0 16px 34px rgba(0,0,0,0.45); background: ${PANEL};">
          <img src="assets/tutoriales/${t.f}.jpg" alt="Portada del tutorial ${i + 1}: ${t.t}" style="display: block; width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
          <span style="font-size: 17px; font-weight: 600; line-height: 1.25;">${t.t}</span>
          <span style="font: 500 15px ${MONO}; color: ${MUTED}; ${NUM}">${t.d}</span>
        </div>
      </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      ${PIPELINE.map((p, i) => `<span data-paso>${pastilla(p, i === PIPELINE.length - 1 ? ROSA : ORO)}</span>${i < PIPELINE.length - 1 ? `<span data-paso style="color: ${DIM}; font: 500 20px ${MONO};">→</span>` : ''}`).join('')}
    </div>
    <div style="margin-top: 18px;">${nota(`7 tours escritos en YAML con 108 segmentos de narración. En la app: botón «¿Cómo funciona?» en 5 secciones y una pantalla con los 7. El reproductor carga una portada local de 15–20 KB y ${fuerte('YouTube solo se descarga al tocar play')}.`, ORO)}</div>
  </section>`);

// ── 11 · Impacto ─────────────────────────────────────────────────────────
const embudo = (titulo, rep, conf) => `
        <div data-embudo style="display: flex; flex-direction: column; gap: 12px;">
          ${etiqueta(titulo)}
          <div style="display: grid; grid-template-columns: 150px 1fr 70px; gap: 16px; align-items: center;">
            <span style="font-size: 18px; color: ${MUTED};">reportados</span>
            <div style="height: 22px; background: ${PANEL}; border-radius: 6px; overflow: hidden;"><div data-barra style="width: 100%; height: 100%; background: ${ORO}; border-radius: 6px;"></div></div>
            <span style="font: 600 24px ${MONO}; color: ${ORO}; text-align: right; ${NUM}">${rep}</span>
            <span style="font-size: 18px; color: ${MUTED};">confirmados</span>
            <div style="height: 22px; background: ${PANEL}; border-radius: 6px; overflow: hidden;"><div data-barra style="width: ${(conf / rep * 100).toFixed(1)}%; height: 100%; background: ${ROSA}; border-radius: 6px;"></div></div>
            <span style="font: 600 24px ${MONO}; color: ${ROSA}; text-align: right; ${NUM}">${conf}</span>
          </div>
        </div>`;
const BUGS = [
  ['Un <code style="font-family: ' + MONO + ';">?next=</code> que al normalizarse quedaba como <code style="font-family: ' + MONO + ';">//otro-dominio</code>', 'redirección abierta'],
  ['Abonos de dos sesiones que se sobrescribían', 'pérdida de datos'],
  ['Un dato vacío que se mostraba como si fuera real', 'dato engañoso'],
  ['Una URL firmada que podía servirse ya vencida desde la caché', 'caché'],
];
slides.push(`
  <section data-label="Impacto" data-screen-label="Impacto" data-speaker-notes="Lo que de verdad compra el esfuerzo grande es la revision. Los verificadores confirmaron casi todo lo que reportaron los revisores, y atraparon bugs reales. Pero ojo: el humano en el navegador encontro tres bugs que nadie vio." style="${seccion()}">
    ${header('Impacto')}
    ${h2('Lo que compra el esfuerzo grande:<br>una revisión que encuentra bugs de verdad')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; flex: 1;">
      <div style="${CARD} border-radius: 22px; padding: 30px 32px; display: flex; flex-direction: column; justify-content: center; gap: 34px;">
        ${embudo('Revisión adversarial · v0.1–v0.3', 74, 71)}
        ${embudo('Revisión adversarial · v0.4.0', 12, 9)}
        <span style="font-size: 18px; color: ${MUTED}; line-height: 1.45;">Casi ningún falso positivo: el verificador existe para tumbar lo que no se sostiene.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${etiqueta('Bugs reales que los autores no vieron', ROSA)}
        ${BUGS.map(([b, t]) => `
        <div data-bug style="${CARD} border-radius: 14px; padding: 18px 22px; display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: center;">
          <span style="font-size: 21px; line-height: 1.4;">${b}</span>
          ${pastilla(t, ROSA)}
        </div>`).join('')}
      </div>
    </div>
    <div style="margin-top: 22px;">${nota(`Y aun así, ${fuerte('el humano en el navegador encontró 3 bugs de UI que nadie vio')}: un scroll horizontal de 610 px en Cotizar, nombres cortados y «6 piezas» donde debía decir «6 galletas».`, LIMA)}</div>
  </section>`);

// ── 12 · Esta misma presentación ─────────────────────────────────────────
const FRENTES = ['plan de orquestación', 'línea de tiempo', 'retros', 'ultracode', 'tutoriales'];
const CORRECCIONES = [
  ['Tokens de v0.1–v0.3', '22.4 M', '22.5 M', 'la suma de la retro estaba mal'],
  ['Workflows sobre la guía de 15 agentes', '3 de 5', '4 de 5', 'contó mal sus propias cifras'],
  ['Commits hasta el tag v0.3.0', '54', '49', 'incluía 5 posteriores al tag'],
  ['Pruebas unitarias en v0.3.0', '848', '846', 'dos fuentes no coincidían'],
];
slides.push(`
  <section data-label="Esta presentación" data-screen-label="Esta presentación" data-speaker-notes="Y para que vean que no es teoria: esta misma presentacion la investigo un workflow. Cinco frentes en paralelo, cada uno con un verificador esceptico. Encontro doce errores, varios en mis propias retros." style="${seccion()}">
    ${header('Esta presentación')}
    ${h2('Esta misma presentación<br>se investigó con un workflow')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
      <div style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 10px;">
        ${etiqueta('Cinco frentes en paralelo, cada uno con su verificador', ROSA)}
        ${FRENTES.map(f => `
        <div data-frente style="display: grid; grid-template-columns: 1fr 30px 160px; gap: 14px; align-items: center;">
          ${pastilla(f, ORO)}<span style="color: ${DIM}; font: 500 20px ${MONO}; text-align: center;">→</span>${pastilla('refuta', ROSA)}
        </div>`).join('')}
        <span style="font: 500 16px ${MONO}; color: ${DIM}; margin-top: 6px;">→ guion de láminas, solo con datos que sobrevivieron</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-content: center;">
        ${[['11', 'agentes', ROSA, 11], ['~6 min', 'de reloj', ROSA], ['1.37 M', 'tokens de subagentes', ORO], ['194', 'cifras verificadas una por una', BONE, 194], ['12', 'corregidas', FRESA, 12], ['0', 'refutadas', OK, 0]].map(([v, t, c, n]) => `
        <div data-meta style="${CARD} border-radius: 16px; padding: 18px 22px; display: flex; flex-direction: column; gap: 6px;">
          <span ${n != null ? `data-cuenta="${n}"` : ''} style="font: 600 40px/1 ${DISPLAY}; ${SUAVE} color: ${c}; ${NUM}">${v}</span>
          <span style="font-size: 16px; color: ${MUTED};">${t}</span>
        </div>`).join('')}
      </div>
    </div>
    <div data-a="up3" style="margin-top: 24px; ${CARD} border-radius: 18px; overflow: hidden;">
      <div style="display: grid; grid-template-columns: 1.4fr 150px 150px 1.3fr; padding: 14px 28px; background: ${PANEL}; border-bottom: 1px solid ${LINE};">
        ${etiqueta('Lo que decían mis notas')}${etiqueta('Decía')}${etiqueta('Era', OK)}${etiqueta('Por qué')}
      </div>
      ${CORRECCIONES.map(([q, a, b, p]) => `
      <div data-corr style="display: grid; grid-template-columns: 1.4fr 150px 150px 1.3fr; padding: 12px 28px; align-items: center; border-bottom: 1px solid ${LINE};">
        <span style="font-size: 19px;">${q}</span>
        <span style="font: 500 21px ${MONO}; color: ${MUTED}; text-decoration: line-through; ${NUM}">${a}</span>
        <span style="font: 600 21px ${MONO}; color: ${OK}; ${NUM}">${b}</span>
        <span style="font-size: 17px; color: ${MUTED};">${p}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 13 · Costo ───────────────────────────────────────────────────────────
const MAX_TOK = Math.max(...WORKFLOWS.map(w => w.tokens));
const R_GAUGE = 150, L_GAUGE = +(Math.PI * R_GAUGE).toFixed(1);
const gauge = pct => `
  <svg viewBox="0 0 360 200" style="width: 360px; height: 200px; overflow: visible;">
    <path d="M 30 180 A ${R_GAUGE} ${R_GAUGE} 0 0 1 330 180" fill="none" stroke="${PANEL_2}" stroke-width="26" stroke-linecap="round"></path>
    <path data-arco data-largo="${L_GAUGE}" d="M 30 180 A ${R_GAUGE} ${R_GAUGE} 0 0 1 330 180" fill="none" stroke="${LIMA}" stroke-width="26" stroke-linecap="round" stroke-dasharray="${(L_GAUGE * pct).toFixed(1)} ${L_GAUGE}"></path>
    <text x="180" y="166" text-anchor="middle" style="font: 600 66px ${DISPLAY}; fill: ${BONE};">~55 %</text>
  </svg>`;
slides.push(`
  <section data-label="Costo" data-screen-label="Costo" data-speaker-notes="El precio. Unos 29 millones de tokens de subagentes en cinco workflows, sin contar la sesion principal. En mi plan Max personal eso fue mas o menos el 55 por ciento del limite de la semana." style="${seccion()}">
    ${header('El costo')}
    ${h2(`El precio: ~${TOTAL_TOKENS} M tokens de subagentes<br>y cerca del 55 % de mi semana`)}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 1.35fr 1fr; gap: 36px; flex: 1;">
      <div style="${CARD} border-radius: 22px; padding: 28px 32px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        ${etiqueta('Tokens por workflow')}
        ${WORKFLOWS.map(w => `
        <div data-wf style="display: grid; grid-template-columns: 290px 1fr 90px; gap: 18px; align-items: center;">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 19px; font-weight: 600;"><span style="font-family: ${MONO}; color: ${DIM};">${w.n}</span> ${w.nombre}</span>
            <span style="font: 400 15px ${MONO}; color: ${MUTED};">${w.agentes} agentes · ${w.dur}</span>
          </div>
          <div style="height: 20px; background: ${PANEL}; border-radius: 6px; overflow: hidden;"><div data-barra style="width: ${(w.tokens / MAX_TOK * 100).toFixed(1)}%; height: 100%; border-radius: 6px; background: ${w.n === '03' ? FRESA : ROSA};"></div></div>
          <span style="font: 600 22px ${MONO}; text-align: right; ${NUM}">${w.tokens} M</span>
        </div>`).join('')}
        <span style="font-size: 16px; color: ${DIM}; line-height: 1.45;">En rojo, el workflow que incluyó el refactor a inglés a media obra. Sin contar la sesión principal, que no se midió.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div data-gauge style="${CARD} border-radius: 22px; padding: 24px 28px 22px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
          ${gauge(0.55)}
          <span style="font-size: 18px; color: ${MUTED}; text-align: center;">del límite semanal del plan Claude Max personal</span>
          ${pastilla('dato propio · no lo registra ninguna fuente', LIMA)}
        </div>
        <div data-plan style="${CARD} border-radius: 22px; padding: 22px 28px; display: flex; flex-direction: column; gap: 12px;">
          ${etiqueta('v0.4.0 · lo que estimé contra lo que pasó')}
          ${[['agentes', '10–14', '33'], ['tokens', '2–4 M', '6.3 M'], ['tiempo', '~1 h', '2 h 15 min']].map(([k, a, b]) => `
          <div style="display: grid; grid-template-columns: 100px 1fr 30px 1fr; align-items: baseline; gap: 10px;">
            <span style="font: 400 16px ${MONO}; color: ${MUTED};">${k}</span>
            <span style="font: 500 22px ${MONO}; color: ${ORO}; ${NUM}">${a}</span>
            <span style="color: ${DIM};">→</span>
            <span style="font: 600 22px ${MONO}; color: ${FRESA}; ${NUM}">${b}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`);

// ── 14 · Lo que salió mal ────────────────────────────────────────────────
const FALLAS = [
  ['Sin kickoff ni cuenta de pruebas', '18 flujos E2E con sesión nunca han corrido', 'Kickoff con una cuenta de prueba dedicada'],
  ['El idioma del código no se decidió al inicio', 'Refactor a inglés a media obra y una migración que rompió producción hasta el redeploy', 'Convenciones antes que código'],
  ['Más de lo necesario para una sola usuaria', 'CSP con nonce y ~850 pruebas', 'Niveles S / M / L con techo'],
  ['El orquestador reportó un dato falso sobre la caché', 'Resumió sin contrastar con el código', 'Sin evidencia no cuenta'],
  ['Las credenciales E2E eran de la cuenta real de la usuaria', 'Se detectó antes de lanzar nada', 'Cuenta de prueba que no sea de una persona real'],
  ['Un banco de pruebas improvisado en v0.4.0', 'Triplicó el costo del workflow', 'Un prerrequisito faltante no se sustituye'],
];
slides.push(`
  <section data-label="Lo que salió mal" data-screen-label="Lo que salió mal" data-speaker-notes="Orquestar a muchos agentes trae sus propios errores. Los anote todos, y cada uno se volvio una regla del playbook." style="${seccion()}">
    ${header('Lo que salió mal')}
    ${h2('Orquestar trae sus propios errores:<br>cada uno se volvió una regla')}
    <div data-a="up2" style="margin-top: 32px; ${CARD} border-radius: 22px; overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div style="display: grid; grid-template-columns: 1.1fr 1.2fr 1fr; gap: 30px; padding: 18px 32px; background: ${PANEL}; border-bottom: 1px solid ${LINE};">
        ${etiqueta('Qué pasó', FRESA)}${etiqueta('Qué costó')}${etiqueta('La regla que salió', ROSA)}
      </div>
      ${FALLAS.map(([a, b, c], i) => `
      <div data-falla style="display: grid; grid-template-columns: 1.1fr 1.2fr 1fr; gap: 30px; padding: 0 32px; align-items: center; flex: 1; ${i < FALLAS.length - 1 ? `border-bottom: 1px solid ${LINE};` : ''}">
        <span style="font-size: 20px; font-weight: 500; line-height: 1.35;">${a}</span>
        <span style="font-size: 19px; color: ${MUTED}; line-height: 1.35;">${b}</span>
        <span style="font-size: 19px; color: ${ROSA}; line-height: 1.35;">${c}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 15 · Cierre ──────────────────────────────────────────────────────────
const LLEVO = [
  'Kickoff con alcance, convenciones y cuenta de pruebas',
  'Presupuesto declarado y 1 ronda de corrección por gate',
  'Regla del cambio chico: no todo merece un workflow',
  'Toda afirmación con su evidencia',
  'Revisión humana a 375 px antes de cada push',
];
slides.push(`
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="Lo que me llevo: ultracode rinde cuando yo pongo el alcance, el presupuesto y la revision final. El siguiente paso es convertir el playbook en skills despues de un segundo proyecto." style="${FONDO} font-family: ${SANS}; color: ${BONE}; display: grid; grid-template-columns: 1.1fr 1fr; gap: 70px; align-items: center; padding: 0 110px; box-sizing: border-box; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      ${chispasSueltas([[120, 90, 35, ROSA], [520, 140, -50, ORO], [980, 70, 20, BONE, 20], [1500, 110, -30, ROSA], [1800, 240, 60, ORO], [160, 960, -20, ORO], [760, 1000, 45, ROSA, 22], [1720, 980, -65, ROSA]])}
    </div>
    <div style="position: relative; display: flex; flex-direction: column; gap: 30px;">
      <div data-a="up" style="font: 500 20px ${MONO}; color: ${ROSA};">❯ lo que me llevo</div>
      <h2 data-split style="margin: 0; font-family: ${DISPLAY}; ${SUAVE} font-size: 68px; font-weight: 600; letter-spacing: -1.6px; line-height: 1.06;">Ultracode rinde cuando <em style="font-style: italic; font-weight: 500; color: ${LIMA};">el humano</em> pone el alcance, el presupuesto y la revisión final</h2>
      <span data-mano style="font: 700 40px/1 ${MANO}; color: ${LIMA}; transform: rotate(-3deg); align-self: flex-start;">— Axl</span>
      <p data-a="up3" style="margin: 0; font-size: 24px; color: ${MUTED}; line-height: 1.5;">Siguiente paso: convertir el playbook en skills —<span style="font-family: ${MONO}; color: ${BONE};">/kickoff</span> y <span style="font-family: ${MONO}; color: ${BONE};">/retro</span>— después de un segundo proyecto.</p>
    </div>
    <div data-a="up2" style="position: relative; ${CARD} border-radius: 24px; padding: 34px 36px; display: flex; flex-direction: column; gap: 18px;">
      ${etiqueta('Checklist antes de lanzar un workflow', ROSA)}
      ${LLEVO.map(t => `
      <div data-check style="display: flex; gap: 16px; align-items: flex-start;">
        <span style="flex: none; margin-top: 2px; width: 28px; height: 28px; border-radius: 8px; background: ${kit.alpha(ROSA, 0.16)}; border: 1.5px solid ${ROSA}; color: ${ROSA}; display: inline-flex; align-items: center; justify-content: center; font: 600 16px ${MONO};">✓</span>
        <span style="font-size: 23px; line-height: 1.4;">${t}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ultracode en la práctica · Minuto Dulce</title>
${kit.og({ titulo: 'Ultracode en la práctica', descripcion: 'Cómo construí una app completa dirigiendo agentes con Claude Code: 6 h 26 min al primer entregable, 156 subagentes en 5 workflows, el plan de orquestación que salió de ahí y lo que costó.', carpeta: 'ultracode' })}
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,0..100;1,9..144,400..700,0..100&family=DM+Sans:opsz,wght@9..40,400..700&family=DM+Mono:wght@400;500&family=Caveat:wght@500;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  code { background: ${PANEL_2}; border-radius: 6px; padding: 1px 7px; font-size: 0.9em; }
  /* Las entradas las orquesta GSAP; nada se oculta en CSS a propósito:
     sin JS el deck se ve completo y la impresión a PDF funciona. */
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${kit.alpha(ROSA, 0.5)}; border-radius: 999px;
    background: ${kit.alpha(BG, 0.88)}; color: ${BONE}; cursor: pointer;
    font: 500 13px/1 ${MONO}; letter-spacing: 0.6px; opacity: 0.55; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1920" height="1080">
${slides.join('\n')}
</deck-stage>
<script src="./gsap.min.js"></script>
${kit.animador()}
${kit.reproductor({ src: 'video.mp4', etiqueta: 'Reproducir', tecla: 'v', acento: ROSA })}
<script>
(function () {
  if (!window.animar || !window.gsap) return;

  // Titulares partidos en palabras (idempotente: las timelines se rehacen
  // cada vez que la lámina se activa), respetando los <br>.
  function partir(el, out) {
    if (!el || (!out && el.dataset.partido)) return [];
    out = out || [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      // las cursivas (<em>) se parten igual, palabra por palabra
      if (n.nodeType === 1 && n.tagName !== 'BR') { partir(n, out); return; }
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.textContent = p; s.style.display = 'inline-block';
        frag.appendChild(s); out.push(s);
      });
      el.replaceChild(frag, n);
    });
    el.dataset.partido = '1';
    return out;
  }
  // Lo escrito a mano se «escribe»: se destapa de izquierda a derecha
  function mano(tl, s, pos) {
    Q(s, '[data-mano]').forEach(function (m, i) {
      tl.from(m, { clipPath: 'inset(-20% 100% -20% 0%)', duration: 0.7, ease: 'power1.inOut' }, (pos || 0) + i * 0.2);
    });
  }
  // Las chispas caen girando y rebotan un poco al llegar
  function chispas(tl, s, pos) {
    var cs = Q(s, '[data-chispa]');
    if (cs.length) tl.from(cs, { y: -120, opacity: 0, rotation: '-=140', duration: 0.8, ease: 'bounce.out', stagger: 0.05 }, pos || 0);
  }
  function titular(tl, el, pos) {
    if (!el) return;
    var ps = el.dataset.partido ? el.querySelectorAll('span[style*="inline-block"]') : partir(el);
    if (ps.length) tl.from(ps, { y: 34, opacity: 0, rotationX: -50, transformPerspective: 900,
      transformOrigin: '50% 100%', duration: 0.65, stagger: 0.04, ease: 'power3.out' }, pos || 0);
  }
  // Los trazos SVG se dibujan desde su largo, calculado en build-time
  function trazos(tl, lista, pos, cada) {
    Array.prototype.forEach.call(lista, function (l, i) {
      tl.from(l, { attr: { 'stroke-dashoffset': l.dataset.largo }, duration: 0.5, ease: 'power2.out' }, (pos || 0) + i * (cada || 0.03));
    });
  }
  var Q = function (s, x) { return s.querySelectorAll(x); };
  var q = function (s, x) { return s.querySelector(x); };
  var cuentas = function (tl, s, pos) { Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, pos); }); };

  animar('Portada', function (tl, s) {
    trazos(tl, Q(s, '[data-trazo]'), 0, 0.035);
    tl.from(Q(s, '[data-punto]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(2)', stagger: 0.03 }, 0.25)
      .from(q(s, '[data-a="up"]'), { x: -20, opacity: 0, duration: 0.5 }, 0.05);
    titular(tl, q(s, 'h1'), 0.2);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.5 }, 0.6)
      .from(Q(s, '[data-contador]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.75)
      .from(Q(s, '[data-a="up3"]')[1], { opacity: 0, duration: 0.5 }, 1.1);
    cuentas(tl, s, 0.8);
    chispas(tl, s, 0.1);
    mano(tl, s, 1.15);
  });

  animar('Qué es ultracode', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    var p = Q(s, '[data-panel]');
    tl.from(p, { y: 30, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.2);
    trazos(tl, p[0].querySelectorAll('[data-trazo]'), 0.45, 0.07);
    trazos(tl, p[1].querySelectorAll('[data-trazo]'), 0.6, 0.025);
    tl.from(p[0].querySelectorAll('[data-nodo]'), { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.06 }, 0.4)
      .from(p[1].querySelectorAll('[data-nodo]'), { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.03 }, 0.55)
      .from(Q(s, '[data-a="up3"] > span'), { y: 14, opacity: 0, duration: 0.4, stagger: 0.07 }, 1.15);
  });

  animar('Comparativo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 26, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-izq]'), { x: -16, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.45)
      .from(Q(s, '[data-der]'), { x: 16, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.7);
  });

  animar('El caso', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-ticket]'), { y: 28, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-renglon]'), { x: -14, opacity: 0, duration: 0.35, stagger: 0.09 }, 0.4)
      .from(Q(s, '[data-dato]'), { y: 18, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.5);
  });

  animar('Mi plan', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-kickoff]'), { x: -24, opacity: 0, duration: 0.5 }, 0.2)
      .from(Q(s, '[data-etapa]'), { y: 22, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.35)
      .from(q(s, '[data-nota]'), { y: 16, opacity: 0, duration: 0.45 }, 1.05);
    mano(tl, s, 0.95);
  });

  animar('Roles', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-rol]'), { x: -20, opacity: 0, duration: 0.38, stagger: 0.06 }, 0.2)
      .from(Q(s, '[data-mec]'), { x: 20, opacity: 0, duration: 0.38, stagger: 0.06 }, 0.35)
      .from(q(s, '[data-nota]'), { y: 16, opacity: 0, duration: 0.45 }, 1.0);
  });

  animar('Las primeras 6 horas', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    trazos(tl, Q(s, '[data-trazo]'), 0.2);
    tl.from(Q(s, '[data-hora]'), { opacity: 0, duration: 0.3, stagger: 0.04 }, 0.3)
      .from(Q(s, '[data-pausa]'), { opacity: 0, duration: 0.5 }, 0.55)
      .from(Q(s, '[data-commit]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.25, ease: 'back.out(2.4)', stagger: 0.022 }, 0.35)
      .from(Q(s, '[data-hito]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.15 }, 0.9)
      .from(Q(s, '[data-resumen]'), { y: 18, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.15);
  });

  animar('Alcance', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-version]'), { y: 28, opacity: 0, duration: 0.5, stagger: 0.14 }, 0.2)
      .from(Q(s, '[data-cifra]'), { y: 14, opacity: 0, duration: 0.35, stagger: 0.05 }, 0.45)
      .from(Q(s, '[data-punto-v]'), { x: 14, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.6);
    cuentas(tl, s, 0.5);
  });

  animar('Encaminado', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-riel]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.8, ease: 'power2.inOut' }, 0.2)
      .from(Q(s, '[data-ver]'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.14 }, 0.3)
      .from(q(s, '[data-a="up3"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.8)
      .from(q(s, '[data-nota]'), { y: 16, opacity: 0, duration: 0.45 }, 1.05);
    cuentas(tl, s, 0.85);
  });

  animar('Tutoriales', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-tut]'), { y: 40, opacity: 0, rotation: -2, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 0.2)
      .from(Q(s, '[data-paso]'), { opacity: 0, x: -10, duration: 0.3, stagger: 0.05 }, 0.75)
      .from(q(s, '[data-nota]'), { y: 16, opacity: 0, duration: 0.45 }, 1.1);
  });

  animar('Impacto', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-embudo]'), { y: 20, opacity: 0, duration: 0.45, stagger: 0.12 }, 0.2)
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 0.4)
      .from(Q(s, '[data-bug]'), { x: 22, opacity: 0, duration: 0.4, stagger: 0.09 }, 0.45)
      .from(q(s, '[data-nota]'), { y: 16, opacity: 0, duration: 0.45 }, 1.1);
  });

  animar('Esta presentación', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-frente]'), { x: -18, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.2)
      .from(Q(s, '[data-meta]'), { y: 18, opacity: 0, duration: 0.35, stagger: 0.06 }, 0.35)
      .from(Q(s, '[data-corr]'), { y: 12, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.85);
    cuentas(tl, s, 0.4);
  });

  animar('Costo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-wf]'), { x: -16, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.2)
      .from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.out', stagger: 0.07 }, 0.35)
      .from(q(s, '[data-gauge]'), { y: 22, opacity: 0, duration: 0.45 }, 0.3);
    var arco = q(s, '[data-arco]');
    if (arco) tl.from(arco, { attr: { 'stroke-dasharray': '0 ' + arco.dataset.largo }, duration: 0.9, ease: 'power2.out' }, 0.5);
    tl.from(q(s, '[data-plan]'), { y: 22, opacity: 0, duration: 0.45 }, 0.9);
  });

  animar('Lo que salió mal', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.2)
      .from(Q(s, '[data-falla]'), { y: 12, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.4);
  });

  animar('Cierre', function (tl, s) {
    tl.from(q(s, '[data-a="up"]'), { x: -16, opacity: 0, duration: 0.45 }, 0);
    titular(tl, q(s, 'h2'), 0.1);
    tl.from(q(s, '[data-a="up2"]'), { x: 30, opacity: 0, duration: 0.55 }, 0.35)
      .from(Q(s, '[data-check]'), { x: 14, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.55)
      .from(q(s, '[data-a="up3"]'), { y: 16, opacity: 0, duration: 0.45 }, 1.0);
    chispas(tl, s, 0.05);
    mano(tl, s, 0.9);
  });
})();
</script>
<script>
(function () {
  var on = false, btn = document.createElement('button');
  btn.id = 'modo-presentacion'; btn.type = 'button';
  function pinta() { btn.textContent = on ? 'Salir · Esc' : 'Presentar · P'; if (on) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on'); }
  function poner(v) {
    if (v === on) return; on = v;
    window.postMessage({ __omelette_presenting: v }, '*');
    if (v) { if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); }
    else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    pinta();
  }
  btn.addEventListener('click', function () { poner(!on); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') { poner(!on); e.preventDefault(); }
    else if (e.key === 'Escape' && on && !document.fullscreenElement) poner(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && on) poner(false); });
  pinta(); document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
