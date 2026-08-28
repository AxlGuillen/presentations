// Generador de index.html — Las skins más caras del LoL (screenshots para TikTok)
// Ejecutar: node caras/gen.js
//
// Serie «Datos curiosos» #2 · 5 diapositivas · 1080×1920 con banda central
// (padding 300/350) para la interfaz de TikTok. Misma identidad que /skins/
// (violeta + oro + magenta) para que la serie se vea de la misma familia.
// Fuente: investigación del 26/08/2026 (Riot dev blog, PCGamesN, GameSpot,
// Dot Esports, Leaguepedia). Cifras en USD aproximadas; días de salario
// mínimo con el diario mexicano de CONASAMI 2026 ($315,04).
// Nota: la skin de Caps (Tristana) viene de una filtración — se marca como
// rumor en la diapositiva a propósito.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

// ── Paleta «Datos curiosos»: violeta profundo + oro + magenta ────────────
const BG = '#0B0714';
const GOLD = '#F5C042';      // el dinero
const MAGENTA = '#E75FB4';   // el brillo de tienda
const TEXT = '#F4EFF9';
const MUTED = '#9C93B5';
const ALERT = '#E0475B';     // lo escandaloso
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

const slides = [];

// ── 1 · Hook: el techo que duró 14 años ──────────────────────────────────
slides.push(`
  <section data-label="El techo roto" data-screen-label="01 · Hook" data-speaker-notes="Durante catorce anos lo mas caro que existia era una definitiva de 25 dolares. En 2024 Riot rompio ese techo dos veces en el mismo ano." style="${seccion()} background-image: linear-gradient(180deg, rgba(11,7,20,0.4) 0%, rgba(11,7,20,0.96) 74%), url('assets/Jinx_60.jpg'); background-size: cover; background-position: center 22%;">
    ${glow(GOLD, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Datos curiosos · el clasismo en el lolsito', GOLD)}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 110px; font-weight: 400; line-height: 0.88; letter-spacing: 1px; color: ${TEXT}; text-shadow: 0 0 80px rgba(245,192,66,0.35);">14 años el techo<br>fue <span style="color: ${GOLD};">25 USD</span>…</h1>
      <div data-a="up3" style="margin-top: 30px; font-family: ${DISPLAY}; font-size: 190px; line-height: 0.84; color: ${ALERT}; text-shadow: 0 0 70px rgba(224,71,91,0.45);">HOY: 450</div>
      <div data-a="up3" style="margin-top: 18px; font-size: 29px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">En 2024 Riot rompió el techo <strong style="color: ${TEXT};">dos veces en el mismo año</strong>, con dos categorías nuevas.</div>
    </div>
  </section>`);

// ── 2 · La escalera de precios ───────────────────────────────────────────
const tiers = [
  ['Normal', '~10 USD', 10, MUTED, '0,6 días'],
  ['Legendaria', '~14 USD', 14, MUTED, '0,9 días'],
  ['Definitiva', '~25 USD', 25, TEXT, '1,5 días'],
  ['Exaltada · 2024', '~240 USD', 240, GOLD, '2 semanas'],
  ['Trascendente · 2024', '~450 USD', 450, ALERT, 'casi 1 mes'],
];
slides.push(`
  <section data-label="La escalera de precios" data-screen-label="02 · La escalera" data-speaker-notes="Normal 10, legendaria 14, definitiva 25 -- hasta ahi el presupuesto. Exaltada 240 y trascendente 450: equivale a 45 skins normales. Dias de salario minimo en Mexico como referencia." style="${seccion()}">
    ${glow(GOLD, '50% 40%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Lo que vale una skin', GOLD)}
      ${titulo('La escalera<br>de precios', 96)}
      <div data-a="img" style="margin-top: 44px; display: flex; flex-direction: column; gap: 18px;">
        ${tiers.map(([nombre, precio, val, color, dias]) => `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            <span style="font-size: 27px; font-weight: 600; color: ${color === MUTED ? TEXT : color};">${nombre}</span>
            <span style="font-size: 22px; font-weight: 500; color: ${MUTED};">${dias} de salario mínimo</span>
          </div>
          <div style="height: 52px; border-radius: 10px; background: rgba(255,255,255,0.05); overflow: hidden; display: flex; align-items: center;">
            <div style="flex: none; width: ${Math.max(3, val / 4.5)}%; height: 100%; border-radius: 10px; background: ${color === MUTED ? 'rgba(255,255,255,0.22)' : color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 16px; box-sizing: border-box;">
              ${val >= 100 ? `<span style="font-family: ${DISPLAY}; font-size: 32px; color: ${BG}; white-space: nowrap;">${precio}</span>` : ''}
            </div>
            ${val < 100 ? `<span style="font-family: ${DISPLAY}; font-size: 32px; color: ${TEXT}; white-space: nowrap; margin-left: 14px;">${precio}</span>` : ''}
          </div>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 34px; padding: 22px 30px; border-radius: 16px; background: rgba(224,71,91,0.12); border: 1px solid rgba(224,71,91,0.45); font-size: 27px; font-weight: 500; color: ${TEXT}; line-height: 1.4;">
        Una trascendente = <strong style="color: ${ALERT};">45 skins normales</strong>. El campeón con más skins comprables tiene 16.
      </div>
    </div>
  </section>`);

// ── 3 · Las 5 exaltadas (y que se tiran, no se compran) ──────────────────
const exaltadas = [
  ['Jinx_60.jpg', 'Arcane Fractured Jinx', 'dic 2024 · la primera'],
  ['Sett_66.jpg', 'Radiant Serpent Sett', ''],
  ['Mordekaiser_54.jpg', 'Sahn-Uzal Mordekaiser', ''],
  ['Morgana_80.jpg', 'Spirit Blossom Morgana', ''],
  ['Viego_43.jpg', 'Revenant Reign Viego', 'ene 2026 · la más nueva'],
];
slides.push(`
  <section data-label="Las 5 exaltadas" data-screen-label="03 · Exaltadas" data-speaker-notes="Cinco exaltadas existen. Y no las compras: las tiras en el Sanctum. Garantizada a las 80 tiradas, hasta 32.000 RP, unos 240 dolares. Una tombola." style="${seccion()}">
    ${glow(MAGENTA, '50% 38%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Exaltadas · ~240 USD', MAGENTA)}
      ${titulo('Las cinco<br>que existen', 92)}
      <div data-a="img" style="margin-top: 34px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        ${exaltadas.slice(0, 4).map(([img, nombre, nota]) => `
        <div style="display: flex; flex-direction: column; gap: 7px;">
          <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 210px; object-fit: cover; object-position: center 18%; border-radius: 14px; border: 1px solid rgba(231,95,180,0.3);">
          <span style="font-size: 23px; font-weight: 600; color: ${TEXT}; line-height: 1.15;">${nombre}</span>
          ${nota ? `<span style="font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MAGENTA};">${nota}</span>` : ''}
        </div>`).join('')}
      </div>
      <div data-a="img" style="margin-top: 16px; display: flex; gap: 16px; align-items: stretch;">
        <div style="flex: 1; display: flex; flex-direction: column; gap: 7px;">
          <img src="assets/Viego_43.jpg" alt="Revenant Reign Viego" style="width: 100%; height: 210px; object-fit: cover; object-position: center 18%; border-radius: 14px; border: 1px solid rgba(231,95,180,0.3);">
          <span style="font-size: 23px; font-weight: 600; color: ${TEXT};">Revenant Reign Viego</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MAGENTA};">ene 2026 · la más nueva</span>
        </div>
        <div style="flex: 1; border-radius: 14px; background: ${PANEL}; border: 1px solid rgba(245,192,66,0.4); padding: 22px 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px;">
          <span style="font-size: 21px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD};">Y no las compras…</span>
          <span style="font-size: 26px; font-weight: 600; color: ${TEXT}; line-height: 1.3;"><strong style="color: ${GOLD};">las tiras.</strong> Garantizada a las 80 tiradas del Sanctum: hasta <span style="white-space: nowrap;">32 000 RP</span></span>
          <span style="font-size: 21px; font-weight: 500; color: ${MUTED};">Con suerte sale antes. Con mala, pagas el máximo. Una tómbola.</span>
        </div>
      </div>
    </div>
  </section>`);

// ── 4 · Las trascendentes: Hall of Legends ───────────────────────────────
slides.push(`
  <section data-label="Las trascendentes" data-screen-label="04 · Trascendentes" data-speaker-notes="Solo dos existen y son de los jugadores mas emblematicos: Faker con Ahri (la mas cara de la historia, Riot defendio el precio), Uzi con Kai'Sa, y Caps ya confirmado -- la skin de Tristana es filtracion. 450 dolares: un mes de salario minimo en Mexico, casi dos en Argentina." style="${seccion()}">
    ${glow(ALERT, '50% 36%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('Trascendentes · ~450 USD', ALERT)}
      ${titulo('Solo para<br><span style="color: ' + ALERT + ';">leyendas</span>', 96)}
      <div data-a="img" style="margin-top: 34px; display: flex; gap: 16px;">
        <div style="flex: 1; display: flex; flex-direction: column; gap: 7px;">
          <img src="assets/Ahri_86.jpg" alt="Immortalized Legend Ahri" style="width: 100%; height: 300px; object-fit: cover; object-position: center 14%; border-radius: 14px; border: 1px solid rgba(224,71,91,0.4);">
          <span style="font-size: 24px; font-weight: 600; color: ${TEXT};">2024 · <strong style="color: ${ALERT};">Faker</strong> · Ahri</span>
          <span style="font-size: 20px; font-weight: 500; color: ${MUTED};">la más cara de la historia</span>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 7px;">
          <img src="assets/Kaisa_71.jpg" alt="Immortalized Legend Kai'Sa" style="width: 100%; height: 300px; object-fit: cover; object-position: center 14%; border-radius: 14px; border: 1px solid rgba(224,71,91,0.4);">
          <span style="font-size: 24px; font-weight: 600; color: ${TEXT};">2025 · <strong style="color: ${ALERT};">Uzi</strong> · Kai'Sa</span>
          <span style="font-size: 20px; font-weight: 500; color: ${MUTED};">mismo nivel de precio</span>
        </div>
      </div>
      <div data-a="up3" style="margin-top: 18px; display: flex; align-items: center; gap: 20px; padding: 18px 24px; border-radius: 14px; border: 2px dashed rgba(156,147,181,0.4);">
        <img src="assets/Tristana-icon.png" alt="Tristana" style="width: 78px; height: 78px; border-radius: 14px; border: 1px solid rgba(244,239,249,0.3); filter: grayscale(0.4);">
        <span style="font-size: 24px; font-weight: 500; color: ${MUTED}; line-height: 1.35;"><strong style="color: ${TEXT};">2026 · Caps</strong> — confirmado hace días, el primer occidental. ¿Su skin? Todo apunta a <strong style="color: ${TEXT};">Tristana</strong> <span style="font-size: 19px; letter-spacing: 1px; text-transform: uppercase; color: ${ALERT};">· filtración</span></span>
      </div>
      <div data-a="up3" style="margin-top: 24px; font-size: 27px; font-weight: 500; color: ${TEXT}; line-height: 1.45;">
        450 USD = <strong style="color: ${ALERT};">un mes de salario mínimo en México</strong>. En Argentina, casi dos.
      </div>
    </div>
  </section>`);

// ── 5 · El contraste final ───────────────────────────────────────────────
const contraste = [
  ['Las 16 skins de Lux — todas las comprables', 168, GOLD, 'assets/Lux-icon.png'],
  ['UNA exaltada', 240, MAGENTA, null],
  ['UNA trascendente', 450, ALERT, null],
];
slides.push(`
  <section data-label="El contraste" data-screen-label="05 · Contraste" data-speaker-notes="El remate: una sola skin cuesta mas que vestir a Lux entera de todas las formas posibles. Ustedes que opinan: la comprarian o no?" style="${seccion()}">
    ${glow(ALERT, '50% 42%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Para dimensionarlo', ALERT)}
      ${titulo('Una skin vale más<br>que <span style="color: ' + GOLD + ';">Lux entera</span>', 90)}
      <div data-a="img" style="margin-top: 44px; display: flex; flex-direction: column; gap: 22px;">
        ${contraste.map(([nombre, val, color, icono]) => `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${icono ? `<img src="${icono}" alt="" style="width: 46px; height: 46px; border-radius: 10px;">` : ''}
            <span style="font-size: 26px; font-weight: 600; color: ${TEXT};">${nombre}</span>
          </div>
          <div style="height: 58px; border-radius: 12px; background: rgba(255,255,255,0.05); overflow: hidden;">
            <div style="width: ${Math.round(val / 4.5)}%; height: 100%; background: ${color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 18px; box-sizing: border-box;">
              <span style="font-family: ${DISPLAY}; font-size: 40px; color: ${BG};">${val} USD</span>
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 44px; padding: 26px 32px; border-radius: 18px; background: ${PANEL}; border: 1px solid rgba(231,95,180,0.4); text-align: center;">
        <div style="font-family: ${DISPLAY}; font-size: 64px; line-height: 0.95; color: ${MAGENTA};">¿La comprarías?</div>
        <div style="margin-top: 10px; font-size: 24px; font-weight: 500; color: ${MUTED};">Suponiendo que tuvieras el dinero… ¿vale la pena? Los leo 👇</div>
      </div>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Las skins más caras del LoL</title>
${kit.og({ titulo: "Las skins más caras del LoL", descripcion: "De 25 a 450 dólares en un año: exaltadas, trascendentes y el clasismo en el lolsito. Apoyo visual para TikTok.", carpeta: "caras" })}
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

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
