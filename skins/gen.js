// Generador de index.html — Los campeones con más skins (screenshots para TikTok)
// Ejecutar: node skins/gen.js
//
// Serie «Datos curiosos» · 4 diapositivas · 1080×1920 con banda central
// (padding 300/350) para la interfaz de TikTok, como la serie Cumplelolero.
// Conteo usado: SOLO skins comprables hoy en tienda (sin bóveda ni prestigio),
// que es el criterio honesto para hablar de precios. Fuente: wiki de LoL,
// investigación del 26/08/2026.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // kit.diferir para la carga diferida

// ── Paleta «tienda de RP»: violeta profundo + oro + magenta ──────────────
const BG = '#0B0714';
const GOLD = '#F5C042';      // el dinero — protagonista
const MAGENTA = '#E75FB4';   // el brillo de tienda
const TEXT = '#F4EFF9';
const MUTED = '#9C93B5';
const LOCKED = '#E0475B';    // lo que ya no se puede comprar
const PANEL = '#161022';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${TEXT}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = MAGENTA, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}2B 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = MAGENTA) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">${txt}</h2>`;

/** Tira de tiles de pantalla de carga. */
const tira = (champ, nums, ancho, gris = false) => `
        <div style="display: flex; gap: 4px; flex-wrap: nowrap;">
          ${nums.map(n => `<img src="assets/loading/${champ}_${n}.jpg" alt="" style="width: ${ancho}px; aspect-ratio: 308/560; object-fit: cover; border-radius: 7px; border: 1px solid rgba(255,255,255,0.12);${gris ? ' filter: grayscale(0.85) brightness(0.75);' : ''}">`).join('')}
        </div>`;

const slides = [];

// ── 1 · Hook: el triple empate y la trampa del conteo ────────────────────
slides.push(`
  <section data-label="El triple empate" data-screen-label="01 · Hook" data-speaker-notes="Quien tiene mas skins? A priori, triple empate a ~22 entre Lux, Miss Fortune y Ezreal. Pero vamos a descontar las que ya no se pueden conseguir." style="${seccion()} background-image: linear-gradient(180deg, rgba(11,7,20,0.45) 0%, rgba(11,7,20,0.96) 74%), url('assets/Lux_7_splash.jpg'); background-size: cover; background-position: center 20%;">
    ${glow(MAGENTA, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Datos curiosos')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 132px; font-weight: 400; line-height: 0.86; letter-spacing: 1px; color: ${TEXT}; text-shadow: 0 0 80px rgba(231,95,180,0.4);">¿Quién tiene<br><span style="color: ${MAGENTA};">más skins?</span></h1>
      <div data-a="up3" style="margin-top: 44px; display: flex; align-items: center; gap: 20px;">
        ${['Lux', 'MissFortune', 'Ezreal'].map(c => `<img src="assets/${c}-icon.png" alt="${c}" style="width: 110px; height: 110px; border-radius: 18px; border: 2px solid rgba(244,239,249,0.35);">`).join('')}
        <div style="margin-left: 8px;">
          <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.86; color: ${TEXT};">EMPATE <span style="color: ${MAGENTA};">~22</span></div>
          <div style="font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Lux · Miss Fortune · Ezreal</div>
        </div>
      </div>
      <div data-a="up3" style="margin-top: 40px; padding: 22px 30px; border-radius: 16px; background: rgba(224,71,91,0.13); border: 1px solid rgba(224,71,91,0.45); font-size: 28px; font-weight: 500; color: ${TEXT}; line-height: 1.4;">
        Pero vamos a <strong style="color: ${LOCKED};">descontar las que ya no puedes conseguir</strong>: bóveda y prestigio.
      </div>
    </div>
  </section>`);

// ── 2 · Las que ya no puedes comprar (collage bloqueado) ─────────────────
const bloqueadas = [
  ['Lux', 'Lux', [4, 8, 16, 40, 70], '2 bóveda + 3 prestigio'],
  ['Ahri', 'Ahri', [5, 16, 85, 86, 89], 'incluida la de Faker'],
  ['MissFortune', 'Miss Fortune', [3, 4, 5, 18, 20, 32, 41, 69], 'la que más: 4 en bóveda'],
  ['Ezreal', 'Ezreal', [1, 2, 3, 4, 6, 8], '6 en bóveda, récord del top'],
];
slides.push(`
  <section data-label="Las que ya no puedes comprar" data-screen-label="02 · Bloqueadas" data-speaker-notes="Estas existen pero ya no se pueden conseguir: boveda heredada y prestigio. No dejan de existir, solo dejan de estar a la venta." style="${seccion()}">
    ${glow(LOCKED, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Primero, las descartadas', LOCKED)}
      ${titulo('Las que ya no<br><span style="color: ' + LOCKED + ';">puedes comprar</span>', 92)}
      <div data-a="img" style="margin-top: 36px; display: flex; flex-direction: column; gap: 22px;">
        ${bloqueadas.map(([champ, nombre, nums, nota]) => `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: baseline; gap: 14px;">
            <span style="font-family: ${DISPLAY}; font-size: 38px; line-height: 1; color: ${TEXT};">${nombre}</span>
            <span style="font-family: ${DISPLAY}; font-size: 38px; line-height: 1; color: ${LOCKED};">${nums.length}${champ === 'Ezreal' ? '' : ''}</span>
            <span style="font-size: 22px; font-weight: 500; color: ${MUTED};">${nota}</span>
          </div>
          ${tira(champ, nums, 108, true)}
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; font-size: 26px; font-weight: 500; color: ${TEXT}; line-height: 1.45;">
        No dejan de existir — <strong style="color: ${LOCKED};">solo dejan de estar a la venta</strong>.
      </div>
    </div>
  </section>`);

// ── 3 · El podio: las que sí puedes comprar hoy ──────────────────────────
const podio = [
  ['🥇', 'Lux', 'Lux', [1, 2, 3, 5, 6, 7, 14, 15, 18, 17, 19, 29, 42, 38, 61, 72], '21 805 RP · ~168 USD'],
  ['🥈', 'Ahri', 'Ahri', [1, 2, 3, 4, 6, 7, 14, 15, 17, 27, 28, 42, 66, 76, 88], '19 335 RP · ~149 USD'],
  ['🥉', 'MissFortune', 'Miss Fortune', [1, 2, 6, 7, 8, 9, 15, 16, 17, 21, 31, 40, 50, 60], '18 615 RP · ~143 USD'],
];
slides.push(`
  <section data-label="El podio" data-screen-label="03 · El podio" data-speaker-notes="Con ese criterio Lux gana sola con 16 comprables. Ahri 15, Miss Fortune 14. Ezreal se queda cuarto con 13." style="${seccion()}">
    ${glow(GOLD, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las que sí puedes comprar hoy', GOLD)}
      ${titulo('<span style="color: ' + GOLD + ';">Lux gana</span>, sola', 96)}
      <div data-a="img" style="margin-top: 36px; display: flex; flex-direction: column; gap: 26px;">
        ${podio.map(([medalla, champ, nombre, nums, precio]) => `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: baseline; gap: 14px;">
            <span style="font-size: 34px;">${medalla}</span>
            <span style="font-family: ${DISPLAY}; font-size: 42px; line-height: 1; color: ${TEXT};">${nombre}</span>
            <span style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${GOLD};">${nums.length}</span>
            <span style="flex: 1;"></span>
            <span style="font-size: 24px; font-weight: 600; color: ${MUTED};">${precio}</span>
          </div>
          ${tira(champ, nums, champ === 'Lux' ? 53 : (champ === 'Ahri' ? 57 : 61))}
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; font-size: 25px; font-weight: 500; color: ${MUTED}; line-height: 1.45;">
        Ezreal se queda 4º con 13. Y sí: <strong style="color: ${TEXT};">las que más tienen son mujeres y personajes de los más viejos del juego</strong>.
      </div>
    </div>
  </section>`);

// ── 4 · El tarjetazo ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="El tarjetazo" data-screen-label="04 · El tarjetazo" data-speaker-notes="Las 16 de Lux: 168 dolares, diez dias de salario minimo. Y no suena a tanto porque hay skins como la de Faker de Ahri que valen un dineral: 450 dolares una sola. No lo normalicemos." style="${seccion()} background-image: linear-gradient(180deg, rgba(11,7,20,0.5) 0%, rgba(11,7,20,0.96) 70%), url('assets/Ahri_86_splash.jpg'); background-size: cover; background-position: center 18%;">
    ${glow(GOLD, '50% 55%', '120% 50%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('El tarjetazo', GOLD)}
      <div data-a="up2" style="display: flex; align-items: flex-end; gap: 40px;">
        <div>
          <div style="font-family: ${DISPLAY}; font-size: 118px; line-height: 0.86; color: ${GOLD};">~168 <span style="font-size: 62px;">USD</span></div>
          <div style="font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las 16 de Lux · 21 805 RP</div>
        </div>
        <div style="padding-bottom: 6px;">
          <div style="font-family: ${DISPLAY}; font-size: 76px; line-height: 0.9; color: ${TEXT};">10,4</div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">días de salario mínimo</div>
        </div>
      </div>
      <div data-a="up3" style="margin-top: 44px; padding: 26px 32px; border-radius: 18px; background: rgba(22,16,34,0.88); border: 1px solid rgba(245,192,66,0.4);">
        <div style="font-size: 24px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${MAGENTA};">Y no deberíamos normalizarlo</div>
        <div style="margin-top: 14px; font-size: 29px; font-weight: 500; color: ${TEXT}; line-height: 1.4;">Una sola skin de Ahri — la del Hall of Legends de Faker — costó <strong style="color: ${GOLD}; white-space: nowrap;">59&nbsp;260 RP ≈ 450 USD</strong>: casi el triple que TODAS las de Lux juntas.</div>
        <div style="margin-top: 12px; font-size: 24px; font-weight: 500; color: ${MUTED};">27,9 días de salario mínimo. Casi un mes. Pero eso es tema para otro video…</div>
      </div>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Los campeones con más skins</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
  @keyframes dsImg { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: none; } }
  @keyframes dsGhost { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.65s 0.12s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.75s 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="img"] { animation: dsImg 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="ghost"] { animation: dsGhost 1.2s both; }
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(245,192,66,0.45); border-radius: 999px;
    background: rgba(11,7,20,0.85); color: ${GOLD}; cursor: pointer;
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
