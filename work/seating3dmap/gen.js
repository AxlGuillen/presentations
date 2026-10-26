// Generador de index.html — «seating3dmap: the new 3D seating map»: cómo
// evolucionó el nuevo mapa 3D de los microsites de UrVenue, fase por fase.
// Ejecutar: node work/seating3dmap/gen.js
//
// Presentación informativa EN INGLÉS para el equipo de UrVenue (16:9). Sigue
// el brief del repo seating-map (`docs/briefs/presentation-brief.md`) con sus
// fuentes, en este orden: `jira-updates.md` (UWS-10771, la narrativa),
// `presentation-facts.md` (cifras con fuente) y `presentation-assets.md`
// (catálogo de imágenes). Sin video ni guion, por encargo: Axl graba el video
// de los cambios por su cuenta.
//
// Cuidados que vienen del brief (no quitarlos al editar):
//   - La versión 1 es el commit 550dd48 (Fase 1). Los commits anteriores son
//     importaciones base y no se presentan como trabajo nuevo.
//   - Fase 1 no tiene capturas propias: su lámina usa el hallazgo del modelo
//     y la de Fase 2 usa `ours-desktop/02-initial`, marcada como «Phase 2/3 look».
//   - La compresión 13.6 MB → 1.9 MB es un HALLAZGO entregado a backend:
//     staging todavía sirve el GLB de 13.6 MB (sale en siguientes pasos).
//   - Las ecozonas usan datos sintéticos y la lámina lo dice.
//   - Las capturas de chat (Momo, Alejandro) no se muestran: su feedback va
//     parafraseado. Nunca se abre `dev/config.local.php`.
//   - Las capturas `v2-*`, `v1-*`, `old-2d` y `tel-*` se tomaron de staging el
//     17/10/2026 con Chrome headless (cookies rechazadas) y se rehicieron el 18/10,
//     cuando el acento de la página pasó de naranja a azul claro; el resto viene de
//     `dev/qa/shots` y `docs/briefs/phase4-refs`, recortadas sin la barra de debug.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');

// ── Identidad · «Blueprint» ──────────────────────────────────────────────
// Elegida por Axl entre cuatro propuestas: un plano arquitectónico, porque el
// producto ES un mapa. Papel de plano con retícula en dos escalas, tinta azul
// y un azul eléctrico como único acento. El gris grafito es «antes», coral es
// un problema reportado y verde lo resuelto. Las capturas, que son oscuras,
// van en su ventana o su teléfono y sobre el papel se leen como pantallas.
// (Antes fue azul noche y luego blanco con el degradado del logo; las dos se
// descartaron: una muy oscura, la otra poco atractiva.)
const BG = '#F6F8FB';        // papel de plano
const NOCHE = '#0D0D29';     // el fondo del producto: marcos y fondos de captura
const PANEL = '#EEF2F8';
const PANEL_2 = '#FFFFFF';
const LINE = '#DCE3EE';
const TEXT = '#0F1B3D';      // azul tinta
const MUTED = '#52607E';
const DIM = '#8794AE';
const VIOLET = '#1E40AF';    // azul profundo: estructura, cejas secundarias
const CYAN_B = '#3B82F6';    // azul claro: rellenos y brillos
const CYAN = '#2563EB';      // azul eléctrico: el acento
const BEFORE = '#94A3B8';    // gris grafito: «antes»
const ISSUE = '#E5484D';
const DONE = '#13A36A';
const GRAD = `linear-gradient(120deg, ${VIOLET} 0%, ${CYAN_B} 100%)`;
const SOMBRA_PANT = '0 30px 60px rgba(20,20,58,0.20), 0 6px 16px rgba(20,20,58,0.10)';

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`;
const NUM = 'font-variant-numeric: tabular-nums;';
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFE 100%); border: 1px solid ${LINE}; ${kit.sombra({ tinta: TEXT, halo: VIOLET })}`;
// Retícula de plano en dos escalas: líneas gruesas cada 120 px y finas cada 24
const FONDO = kit.fondo(BG,
  kit.grano({ opacidad: 0.025 }),
  kit.lavado({ color: '#FFFFFF', en: '35% 30%', ancho: 70, alto: 60, fuerza: 0.7, alcance: 70 }),
  { imagen: `linear-gradient(${kit.alpha(CYAN, 0.10)} 1px, transparent 1px), linear-gradient(90deg, ${kit.alpha(CYAN, 0.10)} 1px, transparent 1px)`, tam: '120px 120px, 120px 120px' },
  { imagen: `linear-gradient(${kit.alpha(CYAN, 0.045)} 1px, transparent 1px), linear-gradient(90deg, ${kit.alpha(CYAN, 0.045)} 1px, transparent 1px)`, tam: '24px 24px, 24px 24px' },
  kit.lavado({ color: CYAN_B, en: '100% 100%', ancho: 55, alto: 50, fuerza: 0.08, alcance: 60 }));
const textoGrad = `background: ${GRAD}; -webkit-background-clip: text; background-clip: text; color: transparent;`;

// ── Helpers ──────────────────────────────────────────────────────────────
const logo = (alto = 30) => `<img src="assets/urvenue-logo-dark.svg" alt="UrVenue" style="height: ${alto}px; width: auto; display: block;">`;

const header = (etiqueta, extra = '') => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 104px; display: flex; align-items: center; justify-content: space-between; padding: 0 96px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.75);">
      <div style="display: flex; align-items: center; gap: 18px;">
        ${logo(28)}
        <span style="width: 1px; height: 26px; background: ${LINE};"></span>
        <span style="font: 500 18px/1 ${MONO}; color: ${MUTED};">seating3dmap</span>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        ${extra}
        <span style="font-size: 17px; font-weight: 700; letter-spacing: 2.6px; text-transform: uppercase; color: ${CYAN};">${etiqueta}</span>
      </div>
    </header>`;

const seccion = (extra = '') => `${FONDO} font-family: ${FONT}; color: ${TEXT}; display: flex; flex-direction: column; padding: 148px 96px 60px; box-sizing: border-box; overflow: hidden; ${extra}`;

const h2 = (txt, size = 60) =>
  `<h2 data-split style="margin: 0; font-size: ${size}px; font-weight: 800; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;
const bajada = (txt, max = 1500) =>
  `<p data-a="up2" style="margin: 16px 0 0; font-size: 25px; color: ${MUTED}; line-height: 1.5; max-width: ${max}px;">${txt}</p>`;
const ceja = (t, color = CYAN) => `<span style="font-size: 15px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: ${color};">${t}</span>`;
const chip = (t, color = CYAN) => `<span data-chip style="display: inline-flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: ${color}; background: ${kit.alpha(color, 0.12)}; border: 1px solid ${kit.alpha(color, 0.32)}; border-radius: 999px; padding: 8px 16px; white-space: nowrap;">${t}</span>`;
const fase = n => `<span style="font: 600 15px/1 ${MONO}; color: #FFFFFF; background: ${GRAD}; border-radius: 999px; padding: 8px 14px;">${n}</span>`;
const hash = h => `<span style="font: 500 15px/1 ${MONO}; color: ${MUTED}; background: ${PANEL_2}; border: 1px solid ${LINE}; border-radius: 6px; padding: 5px 9px;">${h}</span>`;
const punto = (txt, color = CYAN) => `
        <div data-punto style="display: flex; gap: 14px; align-items: flex-start;">
          <span style="flex: none; margin-top: 11px; width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 10px ${kit.alpha(color === CYAN ? CYAN_B : color, 0.6)};"></span>
          <span style="font-size: 21px; line-height: 1.45; color: ${TEXT};">${txt}</span>
        </div>`;
const fuerte = t => `<strong style="font-weight: 700; color: ${TEXT};">${t}</strong>`;
const sello = (txt, color = CYAN) => `<span data-sello style="display: inline-flex; align-items: center; gap: 8px; font: 600 14px/1 ${MONO}; letter-spacing: 1px; text-transform: uppercase; color: ${color === CYAN ? '#7DB2FF' : color === VIOLET ? '#A9C2FF' : color === BEFORE ? '#C9CFDC' : color}; background: ${kit.alpha(NOCHE, 0.82)}; border: 1px solid ${kit.alpha(color === CYAN || color === VIOLET ? CYAN_B : color, 0.6)}; border-radius: 8px; padding: 8px 12px; backdrop-filter: blur(6px);">${txt}</span>`;

// Ventana de navegador alrededor de una captura de escritorio
const ventana = (src, alt, { etiqueta = 'staging', extra = '', estilo = '', imgEstilo = '' } = {}) => `
        <div data-ventana style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid ${LINE}; background: ${NOCHE}; box-shadow: ${SOMBRA_PANT}; ${estilo}">
          <div style="height: 34px; display: flex; align-items: center; gap: 8px; padding: 0 14px; background: ${PANEL}; border-bottom: 1px solid ${LINE};">
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #FF5F57;"></span><span style="width: 11px; height: 11px; border-radius: 50%; background: #FEBC2E;"></span><span style="width: 11px; height: 11px; border-radius: 50%; background: #28C840;"></span>
            <span style="margin-left: 12px; font: 500 13px/1 ${MONO}; color: ${DIM};">${etiqueta}</span>
          </div>
          <div style="position: relative; overflow: hidden;">
            <img src="assets/${src}" alt="${alt}" style="display: block; width: 100%; height: auto; ${imgEstilo}">
            ${extra}
          </div>
        </div>`;

// Marco de teléfono
const telefono = (src, alt, { ancho = 300, alto = 620, extra = '', imgAttrs = '' } = {}) => `
        <div data-tel style="position: relative; width: ${ancho}px; height: ${alto}px; border-radius: 46px; padding: 12px; background: linear-gradient(160deg, #2A2A55, #121232); box-shadow: ${SOMBRA_PANT}, inset 0 0 0 1px rgba(255,255,255,0.08); box-sizing: border-box; flex: none;">
          <div style="position: relative; width: 100%; height: 100%; border-radius: 35px; overflow: hidden; background: ${NOCHE};">
            <img ${imgAttrs} src="assets/${src}" alt="${alt}" style="display: block; width: 100%; height: auto;">
            ${extra}
          </div>
        </div>`;

// Deslizador antes/después: se puede arrastrar en vivo, y al entrar «barre»
const comparar = (antes, despues, { eAntes = 'Before', eDespues = 'After', alto = 560, ratio = null, ajuste = 'cover' } = {}) => `
        <div data-comparar style="--corte: 50%; position: relative; height: ${alto}px; ${ratio ? `aspect-ratio: ${ratio}; height: auto;` : ''} border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT}; cursor: ew-resize; touch-action: none; user-select: none;">
          <img src="assets/${despues}" alt="${eDespues}" draggable="false" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${ajuste}; background: ${NOCHE};">
          <div data-antes style="position: absolute; inset: 0; clip-path: inset(0 calc(100% - var(--corte)) 0 0);">
            <img src="assets/${antes}" alt="${eAntes}" draggable="false" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${ajuste}; filter: saturate(0.85); background: ${BG};">
          </div>
          <div data-manija style="position: absolute; top: 0; bottom: 0; left: var(--corte); width: 3px; margin-left: -1.5px; background: #FFFFFF; box-shadow: 0 0 18px rgba(44,187,255,0.8);">
            <span style="position: absolute; top: 50%; left: 50%; width: 52px; height: 52px; margin: -26px 0 0 -26px; border-radius: 50%; background: ${GRAD}; box-shadow: 0 6px 18px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font: 700 20px/1 ${FONT};">⇆</span>
          </div>
          <span style="position: absolute; left: 16px; top: 16px;">${sello(eAntes, BEFORE)}</span>
          <span style="position: absolute; right: 16px; top: 16px;">${sello(eDespues, CYAN)}</span>
        </div>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// Un piso en perspectiva (la retícula de un venue 3D) y la captura de staging
// que entra acostada y se endereza, como un mapa que se posa.
slides.push(`
  <section data-label="Cover" data-screen-label="Cover" data-speaker-notes="seating3dmap is a new map type for UrVenue microsites. In five days it went from a first 3D demo to a design the product owner chose." style="${FONDO} font-family: ${FONT}; color: ${TEXT}; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-piso style="position: absolute; left: -20%; right: -20%; bottom: -38%; height: 90%; background-image: linear-gradient(${kit.alpha(CYAN, 0.22)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${kit.alpha(VIOLET, 0.22)} 1.5px, transparent 1.5px); background-size: 90px 90px; transform: perspective(900px) rotateX(64deg); transform-origin: 50% 0%; -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%); mask-image: linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%);"></div>
      <div data-halo style="position: absolute; right: 120px; top: 120px; width: 900px; height: 700px; background: radial-gradient(closest-side, ${kit.alpha(CYAN, 0.22)}, transparent); filter: blur(20px);"></div>
    </div>
    <div data-heroe style="position: absolute; right: -60px; top: 150px; width: 1060px; transform: perspective(1800px) rotateY(-16deg) rotateX(8deg); transform-origin: 100% 50%;">
      ${ventana('v2-inicial.jpg', 'Option 2 on staging', { etiqueta: 'seating3dmapv2 · staging', extra: `<span data-brillo style="position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%); transform: translateX(120%);"></span>` })}
    </div>
    <div style="position: absolute; left: 110px; top: 0; bottom: 0; width: 820px; display: flex; flex-direction: column; justify-content: center;">
      <div data-a="up" style="display: flex; align-items: center; gap: 18px;">${logo(42)}</div>
      <span data-a="up" style="margin-top: 40px; font: 500 20px/1 ${MONO}; color: ${MUTED};">UWS-10771 · UWSCore / UWSPlugin</span>
      <h1 data-split style="margin: 20px 0 0; font-size: 104px; font-weight: 800; letter-spacing: -4px; line-height: 0.98;">The new<br>3D seating map</h1>
      <p data-a="up2" style="margin: 28px 0 0; font-size: 27px; color: ${MUTED}; line-height: 1.5;">How <span style="font-family: ${MONO}; color: ${TEXT};">seating3dmap</span> went from a first demo to the design the product owner chose, in five days.</p>
      <div data-a="up3" style="margin-top: 44px; display: flex; gap: 52px; align-items: flex-start;">
        ${[['5', 'phases'], ['5', 'days'], ['2', 'layouts, one engine'], ['40', 'automated suites']].map(([v, t]) => `
        <div data-stat style="display: flex; flex-direction: column; gap: 6px;">
          <span data-cuenta="${v}" style="font-size: 62px; font-weight: 800; letter-spacing: -2px; line-height: 1; ${textoGrad} ${NUM}">${v}</span>
          <span style="font-size: 18px; color: ${MUTED};">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 2 · Qué es ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="What it is" data-screen-label="What it is" data-speaker-notes="A new map type for the microsites. It renders the venue in 3D with three.js so guests can pick and book a spot. It is fully independent from the existing 2D seating map. Drag the slider to compare." style="${seccion()}">
    ${header('What it is')}
    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 56px; flex: 1; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
        ${h2('A new map type<br>for UrVenue microsites', 58)}
        <p data-a="up2" style="margin: 0; font-size: 24px; color: ${MUTED}; line-height: 1.5;">The venue in 3D, so guests can choose and book their place: a cabana, a table or a daybed.</p>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 6px;">
          ${punto(`Built with ${fuerte('three.js')} on top of the <span style="font-family: ${MONO}; font-size: 19px;">seating3dmap</span> API`)}
          ${punto(`${fuerte('Independent')} from the 2D seating map that already exists`)}
          ${punto(`Lives in ${fuerte('uvcore')}: new page, no global changes`)}
          ${punto(`English, Spanish and Japanese ${fuerte('from day one')}`)}
        </div>
        <span data-a="up3" style="margin-top: 8px; font-size: 17px; color: ${DIM};">↔ Drag the slider to compare</span>
      </div>
      <div data-a="up2">${comparar('old-2d.jpg', 'v2-inicial.jpg', { eAntes: 'Seating map 2D · live', eDespues: 'seating3dmap · staging', alto: 0, ratio: '16 / 10' })}</div>
    </div>
  </section>`);

// ── 3 · Línea de tiempo ──────────────────────────────────────────────────
const FASES = [
  { n: '1', h: '550dd48', d: 'Oct 13', t: '3D demo', s: 'Map, list, selection, availability, model compression' },
  { n: '2', h: '1228d9d', d: 'Oct 14', t: 'Redesign & API v2', s: 'Plugin styles, 2D mode, keyboard, tour, responsive' },
  { n: '3', h: 'c14959b', d: 'Oct 15', t: 'uvcore card', s: 'Hover card, accent colour, phone Expand and sheet' },
  { n: '4', h: 'c6efc15', d: 'Oct 16', t: 'Two layouts', s: 'Classic and New on one engine; 3D quality; prices' },
  { n: '5–6', h: '088e756', d: 'Oct 17', t: 'Post-QA polish', s: 'Guest-portal mobile, navigation, Reset view, skeletons' },
];
const TL_W = 1728;
slides.push(`
  <section data-label="Timeline" data-screen-label="Timeline" data-speaker-notes="Five phases in five days. Version 1 is the Phase 1 commit; everything after is the development. Earlier commits were base imports, so they are not presented as features." style="${seccion()}">
    ${header('Timeline')}
    ${h2('Five phases, five days')}
    ${bajada(`Version 1 is the Phase 1 commit. Every phase answered concrete feedback and was synced to staging the same day.`)}
    <div data-a="up2" style="position: relative; margin-top: 70px; height: 470px;">
      <svg viewBox="0 0 ${TL_W} 40" style="position: absolute; left: 0; top: 52px; width: ${TL_W}px; height: 40px; overflow: visible;">
        <defs><linearGradient id="g-tl" x1="0" x2="1"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${CYAN}"/></linearGradient></defs>
        <line x1="0" y1="20" x2="${TL_W}" y2="20" stroke="${LINE}" stroke-width="4" stroke-linecap="round"></line>
        <line data-trazo data-largo="${TL_W - 40}" x1="20" y1="20" x2="${TL_W - 20}" y2="20" stroke="url(#g-tl)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${TL_W - 40}" stroke-dashoffset="0"></line>
      </svg>
      <div style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px;">
        ${FASES.map((f, i) => `
        <div data-fase style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
          <span style="font: 600 18px/1 ${MONO}; color: ${MUTED};">${f.d}</span>
          <span data-nodo style="width: 36px; height: 36px; border-radius: 50%; background: ${BG}; border: 4px solid ${i === 4 ? CYAN : VIOLET}; box-shadow: 0 0 22px ${kit.alpha(i === 4 ? CYAN : VIOLET, 0.6)};"></span>
          <div style="${CARD} border-radius: 20px; padding: 28px 26px; display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; min-height: 340px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              ${fase('Phase ' + f.n)}
              <span data-hash data-texto="${f.h}" style="font: 500 16px/1 ${MONO}; color: ${CYAN};">${f.h}</span>
            </div>
            <span style="font-size: 34px; font-weight: 800; letter-spacing: -0.8px; line-height: 1.12;">${f.t}</span>
            <span style="font-size: 21px; color: ${MUTED}; line-height: 1.5;">${f.s}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 4 · Fase 1 ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Phase 1" data-screen-label="Phase 1" data-speaker-notes="Version 1 was already a working 3D demo with list, selection and availability. It also produced two findings about the 3D model that we handed to backend." style="${seccion()}">
    ${header('Phase 1', `${hash('550dd48')}${fase('Oct 13')}`)}
    ${h2('Version 1: a working 3D demo')}
    <div data-a="up2" style="margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 34px; flex: 1;">
      <div style="${CARD} border-radius: 24px; padding: 32px 34px; display: flex; flex-direction: column; gap: 16px;">
        ${ceja('What shipped')}
        ${punto('Locations list grouped by section, row and zone')}
        ${punto('Hover sync between map and list; click to select and fly to a spot')}
        ${punto('Zoom, area filter and a preview minimap of the current view')}
        ${punto('Availability with floor plates; occupied models greyed out')}
        ${punto(`${fuerte('Auto camera side')}: picks the view that hides the fewest spots`)}
        ${punto('Handles no-map dates, maps without spots and custom backgrounds')}
        <div style="flex: 1;"></div>
        <div style="display: flex; gap: 30px; padding-top: 18px; border-top: 1px solid ${LINE};">
          ${[['6,676', 'lines of shipped code'], ['1,236', 'lines of engine JS'], ['3', 'languages']].map(([v, t]) => `
          <div data-stat style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: -1.2px; ${textoGrad} ${NUM}">${v}</span>
            <span style="font-size: 16px; color: ${MUTED};">${t}</span>
          </div>`).join('')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div data-hallazgo style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
          ${ceja('Model finding 1 · weight', VIOLET)}
          <div style="display: flex; align-items: baseline; gap: 18px;">
            <span data-peso style="font-size: 76px; font-weight: 800; letter-spacing: -3px; line-height: 1; ${textoGrad} ${NUM}">1.9 MB</span>
            <span style="font-size: 22px; color: ${MUTED};">from <span style="text-decoration: line-through; color: ${BEFORE};">13.6 MB</span></span>
          </div>
          <div style="height: 16px; border-radius: 8px; background: ${PANEL}; overflow: hidden; box-shadow: inset 0 1px 3px rgba(20,20,58,0.12);">
            <div data-barra-peso style="width: ${(1.9 / 13.6 * 100).toFixed(1)}%; height: 100%; border-radius: 8px; background: ${GRAD};"></div>
          </div>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.45;">WebP textures plus Draco, with identical geometry: 730 nodes and 323 meshes, zero transform difference.</span>
        </div>
        <div data-hallazgo style="${CARD} border-radius: 24px; padding: 22px; display: grid; grid-template-columns: 330px 1fr; gap: 22px; align-items: center; flex: 1;">
          <div style="border-radius: 14px; overflow: hidden; border: 1px solid ${LINE}; height: 100%; min-height: 180px; background-image: url('assets/ref-pool-squares.jpg'); background-position: center; background-size: cover;"></div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${ceja('Model finding 2 · pool', ISSUE)}
            <span style="font-size: 25px; font-weight: 800; line-height: 1.2;">Black squares through the pool water</span>
            <span style="font-size: 18px; color: ${MUTED}; line-height: 1.45;">The tiles material used a displacement map as its normal map. Fixed at load time in Phase 4.</span>
          </div>
        </div>
      </div>
    </div>
  </section>`);

// ── 5 · Fase 2 ───────────────────────────────────────────────────────────
const TECLAS = [['W', 'A', 'S', 'D'], ['Q', 'E'], ['+', '−'], ['V'], ['N'], ['Esc']];
const tecla = k => `<span data-tecla style="display: inline-flex; align-items: center; justify-content: center; min-width: 54px; height: 54px; padding: 0 12px; box-sizing: border-box; border-radius: 12px; background: linear-gradient(180deg, #FFFFFF, #EEF0F8); border: 1px solid #D5D8E8; box-shadow: 0 5px 0 #C6CADF, 0 8px 18px rgba(20,20,58,0.12); font: 700 21px/1 ${FONT}; color: ${TEXT};">${k}</span>`;
slides.push(`
  <section data-label="Phase 2" data-screen-label="Phase 2" data-speaker-notes="Phase 2 restyled everything with the plugin theme, adapted to API v2, and added the 2D plan view, full keyboard control and a guided tour." style="${seccion()}">
    ${header('Phase 2', `${hash('1228d9d')}${fase('Oct 14')}`)}
    ${h2('Redesign, API v2 and real navigation')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1.15fr 1fr; gap: 40px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ventana('phase2-desktop.jpg', 'Phase 2 desktop', { etiqueta: 'Phase 2/3 look · QA capture' })}
        <span style="font-size: 16px; color: ${DIM};">Colours come from the microsite theme: accent, green for available, grey for occupied.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div data-teclado style="${CARD} border-radius: 22px; padding: 26px 28px; display: flex; flex-direction: column; gap: 18px;">
          ${ceja('Full keyboard control')}
          <div style="display: flex; flex-wrap: wrap; gap: 18px 26px; align-items: center;">
            ${TECLAS.map((g, i) => `<div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;"><div style="display: flex; gap: 8px;">${g.map(tecla).join('')}</div><span style="font-size: 15px; color: ${MUTED};">${['Move', 'Rotate', 'Zoom', '2D', 'After dark', 'Close'][i]}</span></div>`).join('')}
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${['2D plan mode', 'Guided tour', 'Shareable spot URL', 'API v2 response', 'Date picker locks empty days', 'Wheel never traps page scroll', 'Tablet and phone layouts', 'No-WebGL fallback', 'ARIA, focus, reduced motion'].map(t => chip(t)).join('')}
        </div>
        <div style="flex: 1;"></div>
        <div data-stat style="display: flex; align-items: baseline; gap: 16px;">
          <span data-cuenta="28" style="font-size: 72px; font-weight: 800; letter-spacing: -2.5px; line-height: 1; ${textoGrad} ${NUM}">28</span>
          <span style="font-size: 21px; color: ${MUTED};">automated suites, about 1,100 checks, on desktop, tablet and phone</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 6 · Fase 3 ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Phase 3" data-screen-label="Phase 3" data-speaker-notes="Phase 3 rebuilt the card in the uvcore style, added a hover card, used the site accent colour for selection, and brought full-screen and bottom-sheet modes to phones." style="${seccion()}">
    ${header('Phase 3', `${hash('c14959b')}${fase('Oct 15')}`)}
    ${h2('A uvcore-style card and phone modes')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1fr 300px 300px; gap: 34px; flex: 1; align-items: start;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div style="position: relative;">
          ${ventana('phase3-hover.jpg', 'Hover mini card', { etiqueta: 'hover mini card · QA capture' })}
          <div data-flota style="position: absolute; right: -24px; bottom: -40px; width: 250px; border-radius: 16px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT};">
            <img src="assets/phase3-card.jpg" alt="Detail card" style="display: block; width: 100%;">
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; max-width: 760px;">
          ${punto(`Detail card rebuilt on the ${fuerte('uvcore style')}: chips, More Info, price slot and the plugin Book button`)}
          ${punto(`Selection uses the ${fuerte('site accent colour')}, so it adapts to every microsite`)}
          ${punto('Rotate / Move toggle, icon-only After dark and subtle motion')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
        ${telefono('phase3-phone-sheet.jpg', 'Bottom sheet', { ancho: 280, alto: 580 })}
        <span style="font-size: 17px; color: ${MUTED}; text-align: center;">Draggable bottom sheet</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
        ${telefono('phase3-phone-expand.jpg', 'Expand mode', { ancho: 280, alto: 580 })}
        <span style="font-size: 17px; color: ${MUTED}; text-align: center;">Full-screen Expand; Back closes it</span>
      </div>
    </div>
  </section>`);

// ── 7 · La ronda de feedback ─────────────────────────────────────────────
const PROBLEMAS = [
  { t: 'The centre of the map gets too busy', d: 'Card, hover and labels crowd the map. Use the right-hand space for details.', q: 'Alejandro', img: null },
  { t: 'The model floats in space', d: 'No ground, and the unfinished back shows when you rotate.', q: 'Product owner', img: 'ref-floating.jpg' },
  { t: 'Black squares in the pool', d: 'They appear through the water when you zoom in.', q: 'Product owner', img: 'ref-pool-squares.jpg' },
  { t: 'Resolution dropped', d: 'The map looked softer than the render in the backend editor.', q: 'Momo', img: 'ref-hollow.jpg' },
];
slides.push(`
  <section data-label="The review" data-screen-label="The review" data-speaker-notes="After Phase 3 came a full review. The product owner brief had 14 requests and doubts; we turned them into 25 planned improvements before writing code." style="${seccion()}">
    ${header('Phase 4 · the review', fase('Oct 15'))}
    ${h2('Then came the review')}
    ${bajada(`The product owner brief listed ${fuerte('14 requests and doubts')}. Before coding, they became a plan of ${fuerte('25 improvements')}: 11 critical, 9 important, 5 nice to have.`)}
    <div data-a="up3" style="margin-top: 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; flex: 1;">
      ${PROBLEMAS.map(p => `
      <div data-problema style="${CARD} border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; border-top: 4px solid ${ISSUE};">
        <div style="height: 210px; ${p.img ? `background-image: url('assets/${p.img}'); background-position: center; background-size: cover;` : `background: ${PANEL}; display: flex; align-items: center; justify-content: center;`} position: relative;">
          ${p.img ? '' : `<div style="position: relative; width: 240px; height: 150px;">
            <div style="position: absolute; inset: 0; border-radius: 12px; border: 1px dashed ${kit.alpha(ISSUE, 0.6)};"></div>
            ${[[30, 26, 120], [100, 64, 110], [44, 98, 140], [150, 30, 70]].map(([x, y, w]) => `<div data-saturado style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: 30px; border-radius: 8px; background: ${kit.alpha(ISSUE, 0.25)}; border: 1px solid ${kit.alpha(ISSUE, 0.6)};"></div>`).join('')}
          </div>`}
          <span style="position: absolute; left: 14px; bottom: 14px;">${sello('Reported', ISSUE)}</span>
        </div>
        <div style="padding: 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
          <span style="font-size: 24px; font-weight: 800; line-height: 1.2; letter-spacing: -0.4px;">${p.t}</span>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.45;">${p.d}</span>
          <div style="flex: 1;"></div>
          <span style="font: 500 15px/1 ${MONO}; color: ${DIM};">— ${p.q}</span>
        </div>
      </div>`).join('')}
    </div>
  </section>`);

// ── 8 · Dos propuestas, un motor ─────────────────────────────────────────
const nodo = (x, y, w, titulo, sub, color, attrs = '') => `
        <g ${attrs}>
          <rect x="${x}" y="${y}" width="${w}" height="74" rx="16" fill="${PANEL_2}" stroke="${color}" stroke-width="2"></rect>
          <text x="${x + w / 2}" y="${y + 33}" text-anchor="middle" style="font: 700 21px ${FONT}; fill: ${TEXT};">${titulo}</text>
          <text x="${x + w / 2}" y="${y + 57}" text-anchor="middle" style="font: 500 15px ${MONO}; fill: ${MUTED};">${sub}</text>
        </g>`;
const opcion = (n, titulo, src, items, color, arch) => `
      <div data-opcion style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: baseline; gap: 14px;">
          <span style="font: 600 16px/1 ${MONO}; color: ${color};">OPTION ${n}</span>
          <span style="font-size: 32px; font-weight: 800; letter-spacing: -0.8px;">${titulo}</span>
          <span style="margin-left: auto; font: 500 14px/1 ${MONO}; color: ${DIM};">${arch}</span>
        </div>
        ${ventana(src, `Option ${n}`, { etiqueta: n === 1 ? 'seating3dmap · staging' : 'seating3dmapv2 · staging', estilo: 'width: 700px;' })}
        <div style="display: flex; flex-direction: column; gap: 10px;">${items.map(t => punto(t, color)).join('')}</div>
      </div>`;
slides.push(`
  <section data-label="Two proposals" data-screen-label="Two proposals" data-speaker-notes="Instead of one redesign we built two complete layouts on the same engine, so the product owner could choose with both working on staging. Each layout lives in its own files." style="${seccion()}">
    ${header('Phase 4', `${hash('c6efc15')}${fase('Oct 16')}`)}
    ${h2('Two complete layouts on one shared engine')}
    <div data-a="up2" style="margin-top: 26px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
      ${opcion(1, 'Classic', 'v1-seleccion-mapa.jpg', ['List on the left and a centred popup, like the classic map', 'Keeps the microsite header'], BEFORE, 'classic.js · 937 lines')}
      ${opcion(2, 'New', 'v2-seleccion.jpg', ['Guest-portal style: title, time-slot tabs and date arrows', 'Area labels on the map; a right column with categories and Reserve'], CYAN, 'portal.js · 1,150 lines')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="display: grid; grid-template-columns: 560px 1fr; gap: 36px; align-items: center;">
      <svg viewBox="0 0 660 190" style="width: 560px; height: 161px; overflow: visible;">
        <defs><linearGradient id="g-arq" x1="0" x2="1"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${CYAN}"/></linearGradient></defs>
        <path data-trazo data-largo="210" d="M 330 76 C 330 110, 130 100, 130 116" fill="none" stroke="${BEFORE}" stroke-width="2.5" stroke-dasharray="210" stroke-dashoffset="0"></path>
        <path data-trazo data-largo="210" d="M 330 76 C 330 110, 530 100, 530 116" fill="none" stroke="${CYAN}" stroke-width="2.5" stroke-dasharray="210" stroke-dashoffset="0"></path>
        ${nodo(200, 2, 260, 'Shared engine', 'seating3dmap.js · 5,655', 'url(#g-arq)', 'data-nodo')}
        ${nodo(20, 116, 220, 'Classic layout', 'classic.js + .css', BEFORE, 'data-nodo')}
        ${nodo(420, 116, 220, 'New layout', 'portal.js + .css', CYAN, 'data-nodo')}
      </svg>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <span style="font-size: 25px; font-weight: 800; line-height: 1.3;">One layout contract, one file set per layout</span>
        <span style="font-size: 19px; color: ${MUTED}; line-height: 1.5;">Every hook is optional. The option not chosen can be removed cleanly, and the engine is ready for other projects.</span>
      </div>
    </div>
  </section>`);

// ── 9 · La elección ──────────────────────────────────────────────────────
// Sello de «Chosen» que cae con rebote y una explosión de confeti con
// posiciones fijas (deterministas, como pide el render cuadro a cuadro).
const CONFETI = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.2;
  const r = 150 + (i * 37) % 120;
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r * 0.7), c: [CYAN, VIOLET, DONE, '#FFFFFF'][i % 4], rot: (i * 47) % 180, w: 8 + (i % 3) * 4 };
});
slides.push(`
  <section data-label="The choice" data-screen-label="The choice" data-speaker-notes="On October 16 the product owner, Hector Mendoza, chose Option 2, the guest-portal style. Phases 5 and 6 polish that option. Drag the slider: the classic map we started from, against Option 2 today." style="${seccion()}">
    ${header('The choice', fase('Oct 16'))}
    <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 54px; flex: 1; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 22px; position: relative;">
        <span data-a="up" style="font: 600 18px/1 ${MONO}; color: ${MUTED};">October 16, 2026</span>
        ${h2(`Option 2<br>was chosen`, 92)}
        <p data-a="up2" style="margin: 0; font-size: 25px; color: ${MUTED}; line-height: 1.5;">The product owner, <span style="color: ${TEXT}; font-weight: 700;">Hector Mendoza</span>, picked the guest-portal style. Phases 5 and 6 polish that option.</p>
        <div data-premio style="position: relative; align-self: flex-start; margin-top: 18px;">
          <div aria-hidden="true" style="position: absolute; left: 50%; top: 50%; width: 0; height: 0;">
            ${CONFETI.map(c => `<span data-confeti data-dx="${c.x}" data-dy="${c.y}" style="position: absolute; left: ${c.x}px; top: ${c.y}px; width: ${c.w}px; height: ${Math.round(c.w / 2.4)}px; border-radius: 3px; background: ${c.c}; transform: rotate(${c.rot}deg);"></span>`).join('')}
          </div>
          <span data-estampa style="position: relative; display: inline-flex; align-items: center; gap: 14px; font-size: 34px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #FFFFFF; background: ${GRAD}; border-radius: 18px; padding: 18px 32px; box-shadow: 0 18px 44px ${kit.alpha(CYAN, 0.35)}; transform: rotate(-4deg);">✓ Chosen</span>
        </div>
      </div>
      <div data-a="up2" style="display: flex; flex-direction: column; gap: 14px;">
        ${comparar('ref-classic-map.jpg', 'v2-detalle.jpg', { eAntes: 'The classic map', eDespues: 'Option 2 today', alto: 0, ratio: '16 / 10' })}
        <span style="font-size: 17px; color: ${DIM};">↔ Drag to compare · left: the classic uvcore map the product started from</span>
      </div>
    </div>
  </section>`);

// ── 10 · Recorrido por la Opción 2 (cámara con pasos) ────────────────────
// Cada paso acerca la «cámara» a una zona de la captura (stepchange) y
// enciende su marcador y su explicación. Posiciones en fracción de la imagen
// (1440×900 de origen).
const ZONAS = [
  { x: 0.80, y: 0.07, s: 2.2, t: 'Take a tour, next to the date', d: 'A button beside the date arrows instead of a chip on the map.', q: 'Hector #2' },
  { x: 0.33, y: 0.58, s: 2.0, t: 'Area labels on the map', d: 'Tap an area and the map zooms in to show what is available there.', q: 'Phase 4' },
  { x: 0.36, y: 0.30, s: 2.1, t: 'A preview that holds still', d: 'Photo, name and seats. It fades while you zoom and returns to its spot.', q: 'Hector #3' },
  { x: 0.85, y: 0.40, s: 1.9, t: 'Categories in a right column', d: 'Spots with photo and seats, Reserve and details, without covering the map.', q: 'Alejandro' },
  { x: 0.16, y: 0.91, s: 2.3, t: 'One control bar and Reset view', d: 'Zoom, 3D/2D, Rotate/Move and After dark. Reset view appears only after you move.', q: 'Phase 6' },
];
slides.push(`
  <section data-label="Option 2 tour" data-screen-label="Option 2 tour" data-speaker-notes="A guided look at Option 2. Each arrow press zooms the camera into one part of the screen." style="${seccion()}">
    ${header('Option 2, piece by piece', `<span style="font-size: 16px; color: ${DIM};">→ to zoom in</span>`)}
    <div style="display: grid; grid-template-columns: 1.55fr 1fr; gap: 40px; flex: 1; align-items: center;">
      <div data-camara style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT}; aspect-ratio: 16 / 10;">
        <div data-lente style="position: absolute; inset: 0; transform-origin: 0 0;">
          <img src="assets/v2-seleccion.jpg" alt="Option 2 with a spot selected" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          ${ZONAS.map((z, i) => `
          <span data-step="${i + 1}" data-marca data-zoom="${z.s}" style="position: absolute; left: ${(z.x * 100).toFixed(1)}%; top: ${(z.y * 100).toFixed(1)}%; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; background: ${GRAD}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font: 800 17px/1 ${FONT}; box-shadow: 0 0 0 6px ${kit.alpha(CYAN, 0.25)};">
            <span class="pulso" style="position: absolute; inset: -6px; border-radius: 50%; border: 2px solid ${CYAN};"></span>${i + 1}</span>`).join('')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${ZONAS.map((z, i) => `
        <div data-step="${i + 1}" data-zona style="${CARD} border-radius: 18px; padding: 18px 22px; display: grid; grid-template-columns: 40px 1fr; gap: 16px; align-items: start;">
          <span style="width: 40px; height: 40px; border-radius: 12px; background: ${GRAD}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font: 800 18px/1 ${FONT};">${i + 1}</span>
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 10px;">
              <span style="font-size: 22px; font-weight: 800; line-height: 1.2;">${z.t}</span>
              <span style="font: 500 13px/1 ${MONO}; color: ${CYAN}; white-space: nowrap;">${z.q}</span>
            </div>
            <span style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">${z.d}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 11 · Calidad 3D ──────────────────────────────────────────────────────
slides.push(`
  <section data-label="3D quality" data-screen-label="3D quality" data-speaker-notes="The 3D work: sharper textures, a ground with a baked shadow so the venue no longer floats, the pool fixed, and a rotation limit that hides the unfinished back. The compression path is ready for backend." style="${seccion()}">
    ${header('3D quality', fase('Phase 4'))}
    ${h2('Sharper, grounded, and no more black squares')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1.3fr 1fr; gap: 36px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${comparar('ref-pool-squares.jpg', 'render-after-steps.jpg', { eAntes: 'Pool · before', eDespues: 'Pool · after', alto: 0, ratio: '16 / 10' })}
        <span style="font-size: 17px; color: ${DIM};">↔ The normal map is regenerated from the height map at load, so the water stays clean.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div data-par style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid ${LINE}; aspect-ratio: 16 / 11; background-image: url('assets/ref-floating.jpg'); background-position: center; background-size: cover;"><span style="position: absolute; left: 10px; top: 10px;">${sello('Floating', BEFORE)}</span></div>
          <div data-par style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid ${kit.alpha(CYAN, 0.5)}; aspect-ratio: 16 / 11; background-image: url('assets/render-after-home.jpg'); background-position: center; background-size: cover;"><span style="position: absolute; left: 10px; top: 10px;">${sello('Grounded', CYAN)}</span></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${punto(`Ground with a ${fuerte('baked shadow')}: the venue no longer floats`)}
          ${punto(`${fuerte('16× anisotropic filtering')}: +9% sharpness at the home view, +15% on tilted views, no measurable cost`)}
          ${punto(`Rotation limited to ${fuerte('±90°')} to hide the unfinished back`)}
          ${punto('Lighter water on phones')}
        </div>
        <div style="flex: 1;"></div>
        <div data-hallazgo style="${CARD} border-radius: 18px; padding: 18px 22px; display: flex; align-items: center; gap: 18px;">
          <span data-peso style="font-size: 44px; font-weight: 800; letter-spacing: -1.5px; ${textoGrad} ${NUM}">1.9 MB</span>
          <span style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">Compression path for the 13.6 MB model, with identical geometry. Handed to backend: staging still serves the original.</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 12 · Datos reales ────────────────────────────────────────────────────
const TABS = ['Full Day', 'Morning', 'Afternoon'];
slides.push(`
  <section data-label="Real data" data-screen-label="Real data" data-speaker-notes="A new endpoint maps the event inventory: prices, labels, schedules, photos, categories and time slots. Content appears automatically as backend fills the API. The time-slot example uses synthetic data." style="${seccion()}">
    ${header('Real data', fase('Phases 4–6'))}
    ${h2('Real data, straight from the API')}
    <div data-a="up2" style="margin-top: 30px; display: grid; grid-template-columns: 1.45fr 1fr; gap: 40px; flex: 1;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div data-tabs style="position: relative; display: grid; grid-template-columns: repeat(3, 190px); background: ${PANEL}; border: 1px solid ${LINE}; border-radius: 14px; padding: 5px;">
            <span data-indicador style="position: absolute; left: 195px; top: 5px; width: 190px; bottom: 5px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 2px ${VIOLET}, 0 6px 16px ${kit.alpha(VIOLET, 0.25)};"></span>
            ${TABS.map(t => `<span style="position: relative; text-align: center; padding: 12px 0; font-size: 19px; font-weight: 700;">${t}</span>`).join('')}
          </div>
          ${sello('Synthetic data · 3 time slots', VIOLET)}
        </div>
        <div style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT}; aspect-ratio: 16 / 10;">
          <img src="assets/ecozones-morning.jpg" alt="Morning time slot" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          <img data-eco="tarde" src="assets/ecozones-afternoon.jpg" alt="Afternoon time slot" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0;">
          <img data-eco="dia" src="assets/ecozones-fullday.jpg" alt="Full day time slot" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0;">
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div style="${CARD} border-radius: 22px; padding: 26px 28px; display: flex; flex-direction: column; gap: 14px;">
          ${ceja('New endpoint · inventory')}
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${['Prices', 'Pricing labels', 'Pay Now', 'Disclaimer', 'Schedule', 'Photos', 'Descriptions', 'Categories', 'Time slots & hours'].map(t => chip(t)).join('')}
          </div>
          <span style="font-size: 18px; color: ${MUTED}; line-height: 1.45;">About 2–4 KB per call, on the same 60-second cache as the event page.</span>
        </div>
        <div style="${CARD} border-radius: 22px; padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
          ${ceja('Richer rows · Hector #4')}
          <div style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid ${LINE};">
            <img src="assets/rows-after.jpg" alt="Row with schedule and price" style="display: block; width: 100%; height: 215px; object-fit: cover; object-position: 50% 100%;">
          </div>
          <span style="font-size: 17px; color: ${MUTED}; line-height: 1.45;">Schedule, price, price label and seats. ${fuerte('Content appears on its own')} as backend fills the API.</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 13 · Móvil ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Mobile" data-screen-label="Mobile" data-speaker-notes="Mobile now follows the guest portal: the list sits below a map card, one finger moves the map inside the card, the page scrolls from outside, and tapping a spot opens its category." style="${seccion()}">
    ${header('Mobile', fase('Phase 5'))}
    ${h2('Mobile, in the guest-portal style')}
    <div data-a="up2" style="margin-top: 28px; display: grid; grid-template-columns: 560px repeat(3, 280px); gap: 32px; flex: 1; align-items: start;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div data-comparativa style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; background: #8A8A8A;">
          <img src="assets/compare-phone.jpg" alt="Guest portal reference next to ours" style="display: block; width: 100%;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; font-size: 16px; color: ${MUTED};"><span>Guest portal · reference</span><span style="padding-left: 6px;">seating3dmap · ours</span></div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
          ${punto('List below the map, with categories and spot counts')}
          ${punto('One finger moves the map; the page scrolls from outside it')}
          ${punto('No floating preview on touch devices')}
        </div>
      </div>
      ${[['tel-pagina.jpg', 'Scrolls like a page', 'data-scroll'], ['tel-categoria.jpg', 'Tap an area: “Showing Zone 3”', ''], ['tel-expand.jpg', 'Expand: every control, full screen', '']].map(([src, t, a]) => `
      <div data-telcol style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
        ${telefono(src, t, { ancho: 280, alto: 580, imgAttrs: a })}
        <span style="font-size: 17px; color: ${MUTED}; text-align: center; line-height: 1.35;">${t}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 14 · Navegación (cursor) ─────────────────────────────────────────────
// Un cursor arrastra el mapa, aparece «Reset view», lo toca y el mapa vuelve.
slides.push(`
  <section data-label="Navigation" data-screen-label="Navigation" data-speaker-notes="Navigation was reworked: zoom goes toward the cursor or fingers, rotation no longer stays anchored to the last spot, and Reset view appears only after you move the map." style="${seccion()}">
    ${header('Navigation', fase('Phases 5–6'))}
    ${h2('Move freely, come back in one click')}
    <div data-a="up2" style="margin-top: 28px; display: grid; grid-template-columns: 880px 1fr; gap: 40px; flex: 1; align-items: start;">
      <div data-escena style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT}; aspect-ratio: 996 / 748; background: ${NOCHE};">
        <img data-mapa src="assets/v2-mapa.jpg" alt="Option 2 map area" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 50%;">
        <span data-reset style="position: absolute; left: 31.9%; top: 92.4%; display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 999px; background: rgba(13,13,41,0.92); border: 1px solid rgba(255,255,255,0.18); font: 700 15px/1 ${FONT}; color: #FFFFFF; box-shadow: 0 6px 16px rgba(0,0,0,0.5); white-space: nowrap;">⛶ Reset view</span>
        <span data-onda style="position: absolute; left: 37.5%; top: 95%; width: 70px; height: 70px; margin: -35px 0 0 -35px; border-radius: 50%; border: 3px solid ${CYAN}; opacity: 0;"></span>
        <svg data-cursor viewBox="0 0 26 34" style="position: absolute; left: 37.5%; top: 95%; width: 30px; height: 38px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));"><path d="M2 2 L2 28 L9 21 L14 32 L19 30 L14 19 L24 19 Z" fill="#FFFFFF" stroke="#0D0D29" stroke-width="2" stroke-linejoin="round"/></svg>
        <span style="position: absolute; right: 14px; top: 14px;">${sello('Replay of the real control')}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${[['Zoom toward the cursor', 'Wheel and pinch zoom where you point, not to the centre.'],
           ['No anchor to the last spot', 'After deselecting, rotation and zoom stay free.'],
           ['Dragging slides over the ground', 'In 3D the map moves along the deck, as expected.'],
           ['Reset view, only when needed', 'A text pill that appears once the map has moved. No automatic re-framing.'],
           ['Never fights the page', 'The wheel does not trap page scroll; a pinch during scroll goes to the page.']].map(([t, d], i) => `
        <div data-nav style="${CARD} border-radius: 16px; padding: 14px 20px; display: flex; flex-direction: column; gap: 4px; ${i === 3 ? `border-color: ${kit.alpha(CYAN, 0.6)};` : ''}">
          <span style="font-size: 21px; font-weight: 800;">${t}</span>
          <span style="font-size: 17px; color: ${MUTED}; line-height: 1.4;">${d}</span>
        </div>`).join('')}
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 4px;">
          ${[['v2-2d.jpg', '2D plan'], ['v2-after-dark.jpg', 'After dark'], ['v2-tour.jpg', 'Tour']].map(([s, t]) => `
          <div data-mini style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid ${LINE}; aspect-ratio: 16 / 10; background-image: url('assets/${s}'); background-position: 30% 50%; background-size: cover;"><span style="position: absolute; left: 8px; bottom: 8px;">${sello(t)}</span></div>`).join('')}
        </div>
      </div>
    </div>
  </section>`);

// ── 15 · Carga y detalles ────────────────────────────────────────────────
// La carga se repite en vivo: skeleton con brillo y luego el mapa listo.
slides.push(`
  <section data-label="Loading" data-screen-label="Loading" data-speaker-notes="Skeletons replaced the spinners: the map, the date picker days, prices and hours all show a placeholder while loading. It replays when the slide opens." style="${seccion()}">
    ${header('Loading & details', fase('Phase 6'))}
    ${h2('Skeletons instead of spinners')}
    ${bajada(`The map, the date-picker days, prices and hours show a placeholder while they load. ${fuerte('Hector #1')}.`)}
    <div data-a="up3" style="margin-top: 30px; display: grid; grid-template-columns: 1090px 300px; gap: 60px; flex: 1; align-items: start; justify-content: center;">
      <div style="position: relative; border-radius: 18px; overflow: hidden; border: 1px solid ${LINE}; box-shadow: ${SOMBRA_PANT}; aspect-ratio: 16 / 10;">
        <img src="assets/v2-inicial.jpg" alt="Loaded map" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
        <div data-esqueleto style="position: absolute; inset: 0; opacity: 0; overflow: hidden;">
          <img src="assets/v2-skeleton.jpg" alt="Skeleton while loading" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          <span data-shimmer style="position: absolute; top: 0; bottom: 0; width: 40%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.12), transparent); transform: translateX(-120%);"></span>
          <span style="position: absolute; left: 16px; top: 16px;">${sello('Loading…', VIOLET)}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
        ${telefono('tel-skeleton.jpg', 'Phone skeleton', { ancho: 300, alto: 620 })}
        <span style="font-size: 17px; color: ${MUTED}; text-align: center;">“Preparing 3D view” on phones</span>
      </div>
    </div>
  </section>`);

// ── 16 · Feedback → respuesta ────────────────────────────────────────────
const RESPUESTAS = [
  ['Skeleton loader instead of the spinner', 'Skeletons for the map, date-picker days, prices and hours', 'Hector #1'],
  ['“Take a Tour” as a button next to the date', 'Button beside the date; a pill under the map on phones', 'Hector #2'],
  ['Lock the item preview while zooming', 'The preview fades and returns to its spot after zoom or flight', 'Hector #3'],
  ['More info in the item list', 'Rows with schedule, price, price label, seats, info and Reserve', 'Hector #4'],
  ['Mobile: hard to move between items', 'One finger moves the map in its card; zoom toward the fingers', 'Mobile (a)'],
  ['Mobile: hide the item preview', 'No floating preview on touch devices', 'Mobile (b)'],
  ['Mobile: list items below the map', 'Guest-portal list under a map card, with category counts', 'Mobile (c)'],
];
slides.push(`
  <section data-label="Feedback" data-screen-label="Feedback" data-speaker-notes="Every request from the product owner, one by one, and what we did about it. Press the arrow to reveal each answer." style="${seccion()}">
    ${header('Feedback → response', `<span style="font-size: 16px; color: ${DIM};">→ one at a time</span>`)}
    ${h2('Every request had an answer')}
    <div data-a="up2" style="margin-top: 26px; ${CARD} border-radius: 22px; overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div style="display: grid; grid-template-columns: 150px 1fr 60px 1.15fr; gap: 0 20px; padding: 16px 28px; background: ${PANEL}; border-bottom: 1px solid ${LINE};">
        <span></span>${ceja('Requested', ISSUE)}<span></span>${ceja('What we did', DONE)}
      </div>
      ${RESPUESTAS.map(([a, b, q], i) => `
      <div data-step="${i + 1}" data-resp style="flex: 1; display: grid; grid-template-columns: 150px 1fr 60px 1.15fr; gap: 0 20px; padding: 0 28px; align-items: center; ${i < RESPUESTAS.length - 1 ? `border-bottom: 1px solid ${LINE};` : ''}">
        <span style="font: 600 15px/1 ${MONO}; color: ${CYAN};">${q}</span>
        <span style="position: relative; font-size: 20px; color: ${MUTED}; line-height: 1.35; justify-self: start;">${a}<span data-tachado style="position: absolute; left: 0; right: 0; top: 52%; height: 2px; background: ${kit.alpha(ISSUE, 0.8)}; transform-origin: 0 50%;"></span></span>
        <span style="width: 36px; height: 36px; border-radius: 50%; background: ${kit.alpha(DONE, 0.16)}; border: 1.5px solid ${DONE}; color: ${DONE}; display: inline-flex; align-items: center; justify-content: center; font: 800 17px/1 ${FONT};">✓</span>
        <span style="font-size: 20px; font-weight: 600; color: ${TEXT}; line-height: 1.35;">${b}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 17 · Calidad del desarrollo ──────────────────────────────────────────
const SUITES = [['P1', 0], ['P2', 29], ['P3', 37], ['P4', 35], ['P5–6', 40]];
const LINEAS = [['P1', 1236], ['P2', 5006], ['P3', 5904], ['P4', 5655], ['P5–6', 6022]];
const GW = 640, GH = 240;
const lx = i => 30 + i * (GW - 60) / (LINEAS.length - 1);
const ly = v => GH - 30 - v / 6500 * (GH - 60);
const rutaLineas = LINEAS.map(([, v], i) => `${i ? 'L' : 'M'} ${lx(i).toFixed(1)} ${ly(v).toFixed(1)}`).join(' ');
let largoLineas = 0;
for (let i = 1; i < LINEAS.length; i++) largoLineas += Math.hypot(lx(i) - lx(i - 1), ly(LINEAS[i][1]) - ly(LINEAS[i - 1][1]));
largoLineas = Math.ceil(largoLineas);
slides.push(`
  <section data-label="Quality" data-screen-label="Quality" data-speaker-notes="Quality grew with the product: automated suites went from zero to forty, run on desktop, tablet and phone, plus accessibility and a fallback for browsers without WebGL." style="${seccion()}">
    ${header('Quality')}
    ${h2('Quality grew with the product')}
    <div data-a="up2" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 34px; flex: 1;">
      <div style="${CARD} border-radius: 24px; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('Automated test suites')}<span style="font-size: 16px; color: ${DIM};">desktop · tablet · phone</span></div>
        <div style="flex: 1; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; align-items: end; min-height: 300px;">
          ${SUITES.map(([f, v], i) => `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; height: 100%; justify-content: flex-end;">
            <span data-cuenta="${v}" style="font-size: 34px; font-weight: 800; ${i === 4 ? textoGrad : `color: ${TEXT};`} ${NUM}">${v}</span>
            <div data-columna style="width: 100%; height: ${Math.max(4, v / 40 * 230)}px; border-radius: 12px 12px 4px 4px; background: ${i === 4 ? GRAD : `linear-gradient(180deg, ${kit.alpha(VIOLET, 0.7)}, ${kit.alpha(VIOLET, 0.25)})`}; transform-origin: 50% 100%;"></div>
            <span style="font: 600 15px/1 ${MONO}; color: ${MUTED};">${f}</span>
          </div>`).join('')}
        </div>
        <span style="font-size: 17px; color: ${MUTED};">About 1,480 checks by Phase 3. Phase 6 closed with 40 of 40 green.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="${CARD} border-radius: 24px; padding: 24px 28px; display: flex; flex-direction: column; gap: 10px;">
          ${ceja('Engine JS, lines per phase', VIOLET)}
          <svg viewBox="0 0 ${GW} ${GH}" style="width: 100%; height: auto; overflow: visible;">
            <defs><linearGradient id="g-lin" x1="0" x2="1"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${CYAN}"/></linearGradient></defs>
            <path data-trazo data-largo="${largoLineas}" d="${rutaLineas}" fill="none" stroke="url(#g-lin)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${largoLineas}" stroke-dashoffset="0"></path>
            ${LINEAS.map(([f, v], i) => `<g data-vertice><circle cx="${lx(i).toFixed(1)}" cy="${ly(v).toFixed(1)}" r="7" fill="${BG}" stroke="${i === 4 ? CYAN : VIOLET}" stroke-width="3"></circle>
              <text x="${lx(i).toFixed(1)}" y="${(ly(v) - 18).toFixed(1)}" text-anchor="middle" style="font: 600 15px ${MONO}; fill: ${TEXT};">${v.toLocaleString('en-US')}</text>
              <text x="${lx(i).toFixed(1)}" y="${GH - 4}" text-anchor="middle" style="font: 500 14px ${MONO}; fill: ${MUTED};">${f}</text></g>`).join('')}
          </svg>
          <span style="font-size: 16px; color: ${MUTED};">Phase 4 is lower because the layouts moved into their own files.</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${['ARIA, focus and reduced motion', 'No-WebGL fallback', 'en · es · ja', '3 load endpoints', '2 microsite pages', 'three.js r186, vendored'].map(t => chip(t)).join('')}
        </div>
      </div>
    </div>
  </section>`);

// ── 18 · Siguientes pasos ────────────────────────────────────────────────
const PASOS = [
  ['Connect the cart', 'Reserve does not add to the cart yet.'],
  ['QA on real phones', 'iPhone and Android: inertia, gestures and frame time.'],
  ['Remove the Classic layout', 'Clean, since each layout lives in its own files.'],
  ['Backend fills the data', 'Prices, hours, photos, categories and more time slots.'],
  ['Model fixes on backend', 'Compress the GLB, real pool normal maps, simpler planters.'],
  ['Finish the modular architecture', 'The remaining phases of the engine plan.'],
];
slides.push(`
  <section data-label="Next steps" data-screen-label="Next steps" data-speaker-notes="What is left: connect the cart, test on real phones, remove the Classic layout now that Option 2 was chosen, and the backend work on data and the 3D model." style="${seccion()}">
    ${header('Next steps')}
    ${h2('What comes next')}
    <div data-a="up2" style="margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; flex: 1;">
      ${PASOS.map(([t, d], i) => `
      <div data-paso style="${CARD} border-radius: 22px; padding: 28px 30px; display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden;">
        <span style="position: absolute; right: -10px; top: -26px; font-size: 150px; font-weight: 800; letter-spacing: -6px; color: ${kit.alpha(CYAN, 0.07)}; ${NUM}">${i + 1}</span>
        <span style="width: 50px; height: 50px; border-radius: 14px; border: 2px dashed ${kit.alpha(CYAN, 0.6)}; display: inline-flex; align-items: center; justify-content: center; font: 700 20px/1 ${FONT}; color: ${CYAN};">${i + 1}</span>
        <span style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.15;">${t}</span>
        <span style="font-size: 20px; color: ${MUTED}; line-height: 1.45;">${d}</span>
      </div>`).join('')}
    </div>
  </section>`);

// ── 19 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Closing" data-screen-label="Closing" data-speaker-notes="From a first demo to the chosen design in five days, with the product owner's feedback answered phase by phase." style="${FONDO} font-family: ${FONT}; color: ${TEXT}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden;">
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      <div data-piso style="position: absolute; left: -20%; right: -20%; bottom: -40%; height: 85%; background-image: linear-gradient(${kit.alpha(CYAN, 0.2)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${kit.alpha(VIOLET, 0.2)} 1.5px, transparent 1.5px); background-size: 90px 90px; transform: perspective(900px) rotateX(64deg); transform-origin: 50% 0%; -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%); mask-image: linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%);"></div>
    </div>
    <div data-a="up" style="position: relative;">${logo(64)}</div>
    <h2 data-split style="position: relative; margin: 46px 0 0; font-size: 90px; font-weight: 800; letter-spacing: -3.4px; line-height: 1.04;">From a first demo<br>to the chosen design</h2>
    <p data-a="up2" style="position: relative; margin: 30px 0 0; font-size: 28px; color: ${MUTED}; line-height: 1.5; max-width: 1200px;">Five phases in five days, every request answered, and one engine ready for whatever layout comes next.</p>
    <div data-a="up3" style="position: relative; margin-top: 44px; display: flex; gap: 14px; justify-content: center;">
      ${chip('seating3dmap')}${chip('Option 2 · guest-portal style', CYAN)}${chip('40 suites green', DONE)}
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>seating3dmap · The new 3D seating map</title>
${kit.og({ titulo: 'seating3dmap · The new 3D seating map', descripcion: 'How the new 3D seating map for UrVenue microsites evolved in five phases: from a first three.js demo to two layouts on one engine and the guest-portal design the product owner chose.', carpeta: 'work/seating3dmap' })}
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  /* Los pulsos de los marcadores son decorativos; con movimiento reducido se
     quedan quietos. Las entradas las orquesta GSAP y nada se oculta en CSS. */
  .pulso { animation: pulso 1.8s ease-out infinite; }
  @keyframes pulso { 0% { transform: scale(0.8); opacity: 0.9; } 100% { transform: scale(1.8); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .pulso { animation: none; } }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${kit.alpha(CYAN, 0.45)}; border-radius: 999px;
    background: rgba(255,255,255,0.92); color: ${TEXT}; cursor: pointer;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px; opacity: 0.55; transition: opacity 160ms ease;
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
<script>
// ── Deslizadores antes/después: arrastrables en vivo ─────────────────────
(function () {
  document.querySelectorAll('[data-comparar]').forEach(function (c) {
    var activo = false;
    function mover(e) {
      var r = c.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      c.style.setProperty('--corte', (p * 100).toFixed(1) + '%');
    }
    c.addEventListener('pointerdown', function (e) { activo = true; c.setPointerCapture(e.pointerId); mover(e); e.stopPropagation(); });
    c.addEventListener('pointermove', function (e) { if (activo) mover(e); });
    c.addEventListener('pointerup', function () { activo = false; });
    c.addEventListener('click', function (e) { e.stopPropagation(); });
  });
})();
</script>
<script>
// ── Coreografía ──────────────────────────────────────────────────────────
// Variedad a propósito: cada lámina tiene un evento propio. Portada que se
// posa en 3D, hashes que se teclean, peso que baja, teclas que se presionan,
// tarjetas que voltean, sello con confeti, cámara que se acerca por pasos,
// cursor que toca Reset view, teléfono que hace scroll, pestañas de ecozona,
// skeleton que carga y gráficas que crecen. Todo con tl.from() o con
// estados finales iguales al HTML, para que sin JS el deck se vea completo.
(function () {
  if (!window.animar || !window.gsap) return;
  var Q = function (s, sel) { return s.querySelectorAll(sel); };
  var q = function (s, sel) { return s.querySelector(sel); };

  function partir(el) {
    if (!el || el.dataset.partido) return [];
    var salida = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span'); s.textContent = p; s.style.display = 'inline-block';
        frag.appendChild(s); salida.push(s);
      });
      el.replaceChild(frag, n);
    });
    el.dataset.partido = '1';
    return salida;
  }
  function titular(tl, el, pos) {
    if (!el) return;
    var ps = el.dataset.partido ? el.querySelectorAll('span') : partir(el);
    if (ps.length) tl.from(ps, { y: 44, opacity: 0, rotationX: -60, transformPerspective: 900, transformOrigin: '50% 100%', duration: 0.7, stagger: 0.045, ease: 'power3.out' }, pos || 0);
  }
  function cuentas(tl, s, pos) { Q(s, '[data-cuenta]').forEach(function (el) { cuenta(tl, el, pos); }); }
  function trazos(tl, lista, pos, dur) {
    Array.prototype.forEach.call(lista, function (l, i) {
      tl.from(l, { attr: { 'stroke-dashoffset': l.dataset.largo }, duration: dur || 0.8, ease: 'power2.inOut' }, (pos || 0) + i * 0.12);
    });
  }
  // el deslizador barre: arranca cubierto por el «antes», se asoma y se acomoda
  function barrer(tl, s, pos) {
    Q(s, '[data-comparar]').forEach(function (c) {
      tl.fromTo(c, { '--corte': '100%' }, { '--corte': '18%', duration: 0.9, ease: 'power2.inOut' }, pos)
        .to(c, { '--corte': '50%', duration: 0.6, ease: 'power2.out' }, pos + 0.95);
    });
  }
  function peso(tl, s, pos) {
    Q(s, '[data-peso]').forEach(function (el) {
      var o = { v: 13.6 };
      tl.set(el, { textContent: '13.6 MB' }, 0)
        .to(o, { v: 1.9, duration: 1.1, ease: 'power3.inOut', onUpdate: function () { el.textContent = o.v.toFixed(1) + ' MB'; } }, pos);
    });
    var b = q(s, '[data-barra-peso]');
    if (b) tl.fromTo(b, { width: '100%' }, { width: b.style.width, duration: 1.1, ease: 'power3.inOut' }, pos);
  }

  animar('Cover', function (tl, s) {
    tl.from(q(s, '[data-piso]'), { opacity: 0, backgroundPositionY: '-180px', duration: 1.6, ease: 'power2.out' }, 0)
      .from(q(s, '[data-halo]'), { opacity: 0, scale: 0.7, duration: 1.4 }, 0)
      .from(q(s, '[data-heroe]'), { rotationX: 62, rotationY: -4, y: 260, opacity: 0, duration: 1.3, ease: 'power3.out' }, 0.15)
      .to(q(s, '[data-brillo]'), { x: '-120%', duration: 1.0, ease: 'power2.inOut' }, 1.1);
    Q(s, '[data-a="up"]').forEach(function (el, i) { tl.from(el, { y: 22, opacity: 0, duration: 0.5 }, 0.1 + i * 0.1); });
    titular(tl, q(s, 'h1'), 0.3);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.75)
      .from(Q(s, '[data-stat]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.9);
    cuentas(tl, s, 0.95);
  });

  animar('What it is', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, 'p'), { y: 18, opacity: 0, duration: 0.5 }, 0.3)
      .from(Q(s, '[data-punto]'), { x: -24, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.4)
      .from(q(s, '[data-comparar]'), { scale: 0.94, opacity: 0, duration: 0.6 }, 0.2);
    barrer(tl, s, 0.55);
  });

  animar('Timeline', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, 'p'), { y: 18, opacity: 0, duration: 0.5 }, 0.2);
    trazos(tl, Q(s, '[data-trazo]'), 0.3, 1.2);
    tl.from(Q(s, '[data-fase]'), { y: 40, opacity: 0, duration: 0.5, stagger: 0.16 }, 0.35)
      .from(Q(s, '[data-nodo]'), { scale: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.16 }, 0.4);
    // los hashes se teclean carácter por carácter
    Q(s, '[data-hash]').forEach(function (el, i) {
      var txt = el.dataset.texto, o = { n: 0 };
      tl.set(el, { textContent: '' }, 0)
        .to(o, { n: txt.length, duration: 0.45, ease: 'none', onUpdate: function () { el.textContent = txt.slice(0, Math.round(o.n)); } }, 0.65 + i * 0.16);
    });
  });

  animar('Phase 1', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"] > div'), { x: -40, opacity: 0, duration: 0.6 }, 0.2)
      .from(Q(s, '[data-punto]'), { x: -18, opacity: 0, duration: 0.35, stagger: 0.06 }, 0.35)
      .from(Q(s, '[data-hallazgo]'), { x: 40, opacity: 0, duration: 0.6, stagger: 0.15 }, 0.3)
      .from(Q(s, '[data-stat]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.8);
    peso(tl, s, 0.6);
  });

  animar('Phase 2', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-ventana]'), { rotationY: 18, x: -60, opacity: 0, transformPerspective: 1400, duration: 0.8 }, 0.2)
      .from(q(s, '[data-teclado]'), { y: 30, opacity: 0, duration: 0.5 }, 0.3);
    var teclas = Q(s, '[data-tecla]');
    tl.from(teclas, { y: -30, opacity: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.04 }, 0.4)
      // y se «presionan» una tras otra
      .to(teclas, { y: 5, boxShadow: '0 0 0 #C6CADF, 0 2px 6px rgba(20,20,58,0.12)', duration: 0.07, yoyo: true, repeat: 1, stagger: 0.06 }, 0.85)
      .from(Q(s, '[data-chip]'), { scale: 0.85, opacity: 0, duration: 0.3, stagger: 0.04 }, 0.7)
      .from(q(s, '[data-stat]'), { y: 20, opacity: 0, duration: 0.5 }, 0.9);
    cuentas(tl, s, 0.9);
  });

  animar('Phase 3', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-ventana]'), { y: 40, opacity: 0, duration: 0.6 }, 0.2)
      .from(q(s, '[data-flota]'), { y: 60, rotation: 6, opacity: 0, duration: 0.7, ease: 'back.out(1.4)' }, 0.6)
      .from(Q(s, '[data-tel]'), { y: 120, rotation: function (i) { return i ? 8 : -8; }, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }, 0.35)
      .from(Q(s, '[data-punto]'), { x: -18, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.9);
  });

  animar('The review', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, 'p'), { y: 18, opacity: 0, duration: 0.5 }, 0.25)
      .from(Q(s, '[data-problema]'), { y: 50, opacity: 0, rotation: function (i) { return [-3, 2, -2, 3][i]; }, duration: 0.6, stagger: 0.12, ease: 'back.out(1.3)' }, 0.35)
      // el bloque «saturado» se llena de cajas de golpe
      .from(Q(s, '[data-saturado]'), { scale: 0, opacity: 0, duration: 0.25, stagger: 0.07, ease: 'back.out(3)' }, 0.8)
      .from(Q(s, '[data-sello]'), { scale: 1.6, opacity: 0, duration: 0.3, stagger: 0.1, ease: 'power3.in' }, 1.0);
  });

  animar('Two proposals', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    // las dos opciones entran volteándose como cartas
    tl.from(Q(s, '[data-opcion]'), { rotationY: function (i) { return i ? -90 : 90; }, opacity: 0, transformPerspective: 1600, transformOrigin: function (i) { return i ? '100% 50%' : '0% 50%'; }, duration: 0.8, stagger: 0.18, ease: 'power3.out' }, 0.2)
      .from(Q(s, '[data-nodo]'), { opacity: 0, y: 14, duration: 0.4, stagger: 0.12 }, 0.9);
    trazos(tl, Q(s, '[data-trazo]'), 1.1, 0.6);
  });

  animar('The choice', function (tl, s) {
    tl.from(q(s, '[data-a="up"]'), { y: 16, opacity: 0, duration: 0.4 }, 0);
    titular(tl, q(s, 'h2'), 0.1);
    tl.from(q(s, 'p'), { y: 18, opacity: 0, duration: 0.5 }, 0.5)
      .from(q(s, '[data-comparar]'), { x: 60, opacity: 0, duration: 0.7 }, 0.2)
      // el sello cae con fuerza y revienta el confeti
      .from(q(s, '[data-estampa]'), { scale: 3, opacity: 0, rotation: -18, duration: 0.45, ease: 'power4.in' }, 0.75)
      .from(Q(s, '[data-confeti]'), { x: function (i, el) { return -el.dataset.dx; }, y: function (i, el) { return -el.dataset.dy; }, scale: 0, opacity: 0, rotation: '-=200', duration: 0.9, ease: 'expo.out', stagger: 0.008 }, 1.18);
    barrer(tl, s, 0.6);
  });

  animar('Option 2 tour', function (tl, s) {
    enfocar(s, 0, true);
    tl.from(q(s, '[data-camara]'), { scale: 0.92, opacity: 0, duration: 0.7 }, 0);
  });

  animar('3D quality', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-comparar]'), { y: 40, opacity: 0, duration: 0.6 }, 0.2)
      .from(Q(s, '[data-par]'), { y: 30, opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.15 }, 0.35)
      .from(Q(s, '[data-punto]'), { x: 20, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.6)
      .from(q(s, '[data-hallazgo]'), { y: 20, opacity: 0, duration: 0.5 }, 0.8);
    barrer(tl, s, 0.5);
    peso(tl, s, 0.95);
  });

  animar('Real data', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-tabs]'), { y: 20, opacity: 0, duration: 0.45 }, 0.2)
      .from(Q(s, '[data-chip]'), { scale: 0.8, opacity: 0, duration: 0.3, stagger: 0.04 }, 0.5);
    // las pestañas recorren Full Day → Afternoon → Morning y la pantalla cambia con ellas
    var ind = q(s, '[data-indicador]'), dia = q(s, '[data-eco="dia"]'), tarde = q(s, '[data-eco="tarde"]');
    tl.fromTo(ind, { x: -190 }, { x: 190, duration: 0.45, ease: 'power3.inOut' }, 1.0)
      .to(ind, { x: 0, duration: 0.45, ease: 'power3.inOut' }, 1.75)
      .fromTo(dia, { opacity: 1 }, { opacity: 0, duration: 0.35 }, 1.05)
      .fromTo(tarde, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 1.05)
      .to(tarde, { opacity: 0, duration: 0.35 }, 1.8);
  });

  animar('Mobile', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-comparativa]'), { x: -50, opacity: 0, duration: 0.6 }, 0.2)
      .from(Q(s, '[data-punto]'), { x: -16, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.5)
      .from(Q(s, '[data-telcol]'), { y: 140, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 0.25);
    // el primer teléfono hace scroll solo hasta la lista, como el usuario
    var img = q(s, '[data-scroll]');
    if (img) tl.fromTo(img, { y: 0 }, { y: function () { return -(img.offsetHeight - img.parentNode.offsetHeight); }, duration: 1.3, ease: 'power2.inOut' }, 0.95);
  });

  animar('Navigation', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-escena]'), { y: 30, opacity: 0, duration: 0.5 }, 0.1)
      .from(Q(s, '[data-nav]'), { x: 30, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.3)
      .from(Q(s, '[data-mini]'), { y: 20, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.5);
    var mapa = q(s, '[data-mapa]'), cur = q(s, '[data-cursor]'), pill = q(s, '[data-reset]'), onda = q(s, '[data-onda]');
    var esc = q(s, '[data-escena]');
    var W = function () { return esc.offsetWidth; }, H = function () { return esc.offsetHeight; };
    // 1) el cursor entra al mapa y lo arrastra: solo se mueve el mapa, no la interfaz
    tl.fromTo(cur, { x: function () { return -W() * 0.12; }, y: function () { return -H() * 0.62; } }, { x: function () { return W() * 0.06; }, y: function () { return -H() * 0.5; }, duration: 0.35, ease: 'power2.out' }, 0.45)
      .to(cur, { x: function () { return -W() * 0.12; }, y: function () { return -H() * 0.42; }, duration: 0.55, ease: 'power1.inOut' }, 0.85)
      .fromTo(mapa, { x: 0, y: 0, scale: 1 }, { x: function () { return -W() * 0.09; }, y: function () { return H() * 0.05; }, scale: 1.12, duration: 0.55, ease: 'power1.inOut' }, 0.85)
      // 2) aparece Reset view
      .fromTo(pill, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 1.35)
      // 3) el cursor va al botón y lo toca
      .to(cur, { x: 0, y: 0, duration: 0.4, ease: 'power2.inOut' }, 1.5)
      .to(cur, { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, 1.92)
      .fromTo(onda, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 1.6, duration: 0.5, ease: 'power2.out', immediateRender: false }, 1.95)
      // 4) el mapa vuelve a su encuadre y el botón se va
      .to(mapa, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'power3.inOut' }, 2.0)
      .to(pill, { opacity: 0, scale: 0.8, duration: 0.25 }, 2.25);
  });

  animar('Loading', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, 'p'), { y: 18, opacity: 0, duration: 0.5 }, 0.2)
      .from(q(s, '[data-tel]'), { y: 100, opacity: 0, duration: 0.7 }, 0.3);
    // el skeleton aparece, brilla dos veces y da paso al mapa listo
    var esq = q(s, '[data-esqueleto]'), sh = q(s, '[data-shimmer]');
    tl.from(esq, { opacity: 1, duration: 0.45 }, 1.75)
      .fromTo(sh, { x: '-120%' }, { x: '320%', duration: 0.7, ease: 'power1.inOut', repeat: 1 }, 0.3);
  });

  animar('Feedback', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.2);
  });

  animar('Quality', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-columna]'), { scaleY: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 0.3)
      .from(Q(s, '[data-chip]'), { scale: 0.85, opacity: 0, duration: 0.3, stagger: 0.05 }, 1.0);
    trazos(tl, Q(s, '[data-trazo]'), 0.4, 1.2);
    tl.from(Q(s, '[data-vertice]'), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.22 }, 0.5);
    cuentas(tl, s, 0.35);
  });

  animar('Next steps', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-paso]'), { y: 40, opacity: 0, rotationX: -25, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 0.55, stagger: { each: 0.09, grid: [2, 3], from: 'start' } }, 0.25);
  });

  animar('Closing', function (tl, s) {
    tl.from(q(s, '[data-piso]'), { opacity: 0, backgroundPositionY: '-180px', duration: 1.6, ease: 'power2.out' }, 0)
      .from(q(s, '[data-a="up"]'), { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.1);
    titular(tl, q(s, 'h2'), 0.35);
    tl.from(q(s, 'p'), { y: 20, opacity: 0, duration: 0.55 }, 0.85)
      .from(Q(s, '[data-chip]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.0);
  });

  // ── Eventos de paso (data-step) ──
  // Recorrido de la Opción 2: la cámara se acerca a la zona del paso actual.
  // Feedback: al revelar una fila, la petición se tacha.
  function enfocar(s, paso, inmediato) {
    var lente = q(s, '[data-lente]'), cam = q(s, '[data-camara]');
    if (!lente) return;
    var marcas = Q(s, '[data-marca]');
    var w = cam.offsetWidth, h = cam.offsetHeight, x = 0, y = 0, k = 1;
    if (paso > 0 && marcas[paso - 1]) {
      var m = marcas[paso - 1];
      k = parseFloat(m.dataset.zoom || 2);
      var px = parseFloat(m.style.left) / 100 * w, py = parseFloat(m.style.top) / 100 * h;
      x = Math.min(0, Math.max(w - w * k, w / 2 - px * k));
      y = Math.min(0, Math.max(h - h * k, h / 2 - py * k));
    }
    gsap.to(lente, { x: x, y: y, scale: k, duration: inmediato ? 0 : 0.9, ease: 'power3.inOut' });
  }
  document.addEventListener('stepchange', function (e) {
    var d = e.detail; if (!d) return;
    var s = d.slide;
    // un paso a la vez acerca la cámara; un salto (llegar con todos los pasos) vuelve a la vista general
    if (s.dataset.label === 'Option 2 tour') enfocar(s, Math.abs(d.step - d.previousStep) === 1 ? d.step : 0, false);
    if (s.dataset.label === 'Feedback' && d.step === d.previousStep + 1) {
      var fila = s.querySelectorAll('[data-resp]')[d.step - 1];
      if (fila) gsap.from(fila.querySelector('[data-tachado]'), { scaleX: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' });
    }
  });
})();
</script>
<script>
(function () {
  var on = false, btn = document.createElement('button');
  btn.id = 'modo-presentacion'; btn.type = 'button';
  function pinta() { btn.textContent = on ? 'Exit · Esc' : 'Present · P'; if (on) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on'); }
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
