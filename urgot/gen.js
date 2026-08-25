// Generador de index.html — Urgot cumple 16 años (screenshots para TikTok)
// Ejecutar: node urgot/gen.js
//
// Serie «Cumplelolero» (mismo formato que /ornn/): 1080×1920 con el contenido
// en banda central (padding 300/350) para que la interfaz de TikTok no tape nada.
// Un slide por momento clave del guion, en el orden en que se narra.
// Paleta: acero de Zaun + verde ácido químico, del splash post-rework.
const fs = require('fs');

// ── Paleta Urgot: acero, química y humo de Zaun ──────────────────────────
const BG = '#070A09';
const ACID = '#96E32E';      // verde químico — el protagonista
const TOXIC = '#4FB812';     // verde profundo
const STEEL = '#EAF1E6';     // texto principal, acero claro
const MUTED = '#8CA08F';     // texto secundario
const RUST = '#D8342C';      // rojo de peligro — traición, sequía
const SMOG = '#141A16';      // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

// Banda central: zonas seguras de TikTok
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${STEEL}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

/** Neblina química detrás del contenido. */
const glow = (color = ACID, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}2E 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = (txt, color = ACID) =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">${txt}</h2>`;

/** Imagen con recorte y viñeta. */
const arte = (src, alt, alto, pos = 'center 28%', extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(150,227,46,0.28); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${pos};">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,10,9,0) 40%, rgba(7,10,9,0.85) 100%);"></div>
      </div>`;

const slides = [];

// ── 1 · Portada: 16 años ─────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada · 16 años" data-screen-label="01 · Portada" data-speaker-notes="Hoy es cumpleanos de Urgot: dieciseis anos desde que llego a la Grieta. Serie Cumplelolero." style="${seccion()} background-image: linear-gradient(180deg, rgba(7,10,9,0.25) 0%, rgba(7,10,9,0.95) 78%), url('assets/Urgot_0.jpg'); background-size: cover; background-position: center 22%;">
    ${glow(TOXIC, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Cumplelolero · 24 ago 2010 — 2026')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 210px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${STEEL}; text-shadow: 0 0 90px rgba(150,227,46,0.4);">URGOT<br><span style="color: ${ACID};">16 AÑOS</span></h1>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${ACID}; line-height: 1.3;">El Temerario</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Toplaner · Juggernaut · Noxus → Zaun</p>
    </div>
  </section>`);

// ── 2 · El one trick #1 ─────────────────────────────────────────────────
const rangos = [
  ['S2026', 'Plata 2', 'silver.png', false],
  ['S2025', 'Plata 4', 'silver.png', false],
  ['S2024 S3', 'Bronce 1', 'bronze.png', false],
  ['S2024 S2', 'Plata 4', 'silver.png', false],
  ['S2024 S1', 'Bronce 2', 'bronze.png', false],
  ['S2023 S2', 'Oro 4', 'gold.png', true],
];

const panel = (etiqueta, contenido) => `
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;">
          <div style="height: 616px; border-radius: 18px; background: ${SMOG}D9; border: 1px solid rgba(150,227,46,0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 20px; box-sizing: border-box;">${contenido}</div>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED}; text-align: center;">${etiqueta}</span>
        </div>`;

const panelMaestria = panel('Maestría', `
              <div style="position: relative; margin-bottom: 18px;">
                <img src="assets/urgot-icon.png" alt="Urgot" style="width: 168px; height: 168px; border-radius: 50%; border: 4px solid ${ACID}; box-shadow: 0 0 46px rgba(150,227,46,0.4);">
                <span style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: ${ACID}; color: ${BG}; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; padding: 7px 20px 4px; border-radius: 999px;">1146</span>
              </div>
              <span style="margin-top: 10px; font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">Nivel de maestría</span>
              <span style="font-family: ${DISPLAY}; font-size: 80px; line-height: 0.9; color: ${ACID}; margin-top: 20px;">13 719 886</span>
              <span style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">puntos en Urgot</span>
              <span style="font-family: ${DISPLAY}; font-size: 56px; line-height: 0.9; color: ${STEEL}; margin-top: 20px;">87×</span>
              <span style="font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; text-align: center;">más que su 2º campeón<br>(Dr. Mundo · 158 423)</span>`);

const panelRangos = panel('Historial de rangos', `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                ${rangos.map(([temp, nombre, emblema, top]) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 12px; ${top ? `background: rgba(216,52,44,0.14); border: 1px solid rgba(216,52,44,0.5);` : 'border: 1px solid rgba(255,255,255,0.06);'}">
                  <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 58px; height: 58px; object-fit: contain; flex: none;">
                  <span style="flex: none; width: 96px; font-size: 22px; font-weight: 600; color: ${MUTED};">${temp}</span>
                  <span style="flex: 1; font-size: 26px; font-weight: ${top ? '700' : '500'}; color: ${top ? RUST : STEEL};">${nombre}</span>
                </div>`).join('')}
              </div>
              <span style="margin-top: 14px; font-size: 22px; font-weight: 600; color: ${MUTED}; text-align: center;">Techo de toda su vida: <strong style="color: ${RUST};">Oro 3</strong></span>`);

slides.push(`
  <section data-label="El one trick #1" data-screen-label="02 · El OTP" data-speaker-notes="Voja Maher: maestria 1146, casi 14 millones de puntos, 87 veces mas que su segundo campeon. Winrate 50 por ciento y nunca salio de Plata: no es solo masterizar el campeon, tambien hay que no ser pendejo." style="${seccion()}">
    ${glow(ACID, '50% 40%', '115% 60%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      <div data-a="up2" style="display: flex; align-items: baseline; gap: 22px; flex-wrap: wrap;">
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${STEEL};">VOJA MAHER</span>
        <span style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.95; color: ${ACID};">#EUNE</span>
      </div>
      <p data-a="up2" style="margin: 12px 0 0; font-size: 27px; font-weight: 500; color: ${MUTED};">Europa · nivel de invocador 1 659</p>

      <div data-a="img" style="margin-top: 30px; display: flex; gap: 22px;">
        ${panelMaestria}
        ${panelRangos}
      </div>

      <div data-a="up3" style="margin-top: 28px; display: flex; align-items: center; gap: 36px;">
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${STEEL};">50 <span style="font-size: 58px;">%</span></div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">winrate · 811V – 826D</div>
        </div>
        <div style="width: 2px; height: 88px; background: rgba(150,227,46,0.3);"></div>
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 104px; line-height: 0.86; color: ${RUST};">PLATA 2</div>
          <div style="font-size: 23px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">rango actual · 44 LP</div>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 22px; font-size: 27px; font-weight: 500; color: ${STEEL}; line-height: 1.4;">
        Casi el <strong style="color: ${ACID};">doble</strong> de puntos que el OTP de Ornn… y <strong style="color: ${RUST};">cuatro rangos más abajo</strong>.
      </div>
    </div>
  </section>`);

// ── 3 · El rework ────────────────────────────────────────────────────────
slides.push(`
  <section data-label="El rework" data-screen-label="03 · El rework" data-speaker-notes="2017: Riot lo rehizo completo. Lo tenian como prioridad numero uno entre todos los campeones. Salio convertido en bestia de toplane con escopetas en las rodillas." style="${seccion()}">
    ${glow(TOXIC, '50% 35%', '115% 55%')}
    <div style="position: relative;">
      ${eyebrow('El punto de todo esto')}
      ${titulo('El rework<br>que lo <span style="color: ' + ACID + ';">salvó</span>', 104)}

      <div data-a="img" style="margin-top: 36px; display: flex; gap: 18px; align-items: stretch;">
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px;">
          ${arte('urgot-viejo.jpg', 'Urgot antes del rework', 340, 'center 20%', 'filter: saturate(0.55);')}
          <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED}; text-align: center;">2010 — 2017</span>
        </div>
        <div style="flex: none; align-self: center; font-family: ${DISPLAY}; font-size: 64px; color: ${ACID};">→</div>
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px;">
          ${arte('Urgot_0.jpg', 'Urgot actual', 340, 'center 22%')}
          <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${ACID}; text-align: center;">Desde 2017</span>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 34px; display: flex; flex-direction: column; gap: 16px;">
        ${[
          ['7.15', 'Parche del <strong style="color:' + STEEL + ';">26 de julio de 2017</strong>'],
          ['VGU', 'Rehecho <strong style="color:' + STEEL + ';">completo</strong>: kit, visuales, voz e historia'],
          ['#1', '<strong style="color:' + STEEL + ';">Máxima prioridad</strong> de actualización entre todos los campeones'],
        ].map(([a, t]) => `
        <div style="display: flex; align-items: center; gap: 24px;">
          <span style="flex: none; width: 130px; font-family: ${DISPLAY}; font-size: 56px; line-height: 1; color: ${ACID};">${a}</span>
          <span style="font-size: 29px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 28px; font-size: 28px; font-weight: 500; color: ${STEEL}; line-height: 1.4;">Salió convertido en una bestia de toplane con <strong style="color: ${ACID};">escopetas en las rodillas</strong>.</div>
    </div>
  </section>`);

// ── 4 · Skins: la sequía de 6 años y medio ───────────────────────────────
const skins = [
  ['Urgot_1.jpg', 'Crabgot', 'ago 2010'],
  ['Urgot_3.jpg', 'Blindaje Bélico', 'mar 2012'],
  ['Urgot_9.jpg', 'El Forajido', 'ago 2018'],
  ['Urgot_15.jpg', 'Guardiana Estelar', 'abr 2020'],
  ['Urgot_23.jpg', 'Noche de Terror', 'sep 2022'],
  ['Urgot_32.jpg', 'Don Plomerone', 'abr 2025'],
];
const celdaSkin = ([img, nombre, fecha]) => `
          <div style="display: flex; flex-direction: column; gap: 9px;">
            <img src="assets/${img}" alt="${nombre}" style="width: 100%; height: 210px; object-fit: cover; object-position: center 20%; border-radius: 14px; border: 1px solid rgba(150,227,46,0.25);">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 24px; font-weight: 600; color: ${STEEL}; line-height: 1.15;">${nombre}</span>
              <span style="font-size: 21px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${ACID};">${fecha}</span>
            </div>
          </div>`;

slides.push(`
  <section data-label="Las skins" data-screen-label="04 · Las skins" data-speaker-notes="Seis skins comprables. Entre 2012 y 2018 pasaron seis anos y medio sin nada, y la sequia termino un ano despues del rework. Las seis: 56 dolares, 3.5 dias de salario minimo. La septima esta en la boveda." style="${seccion()}">
    ${glow(RUST, '50% 42%', '115% 58%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('6 skins en 16 años', 84)}

      <div data-a="img" style="margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
        ${skins.slice(0, 3).map(celdaSkin).join('')}
      </div>
      <div data-a="img" style="margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
        ${skins.slice(3).map(celdaSkin).join('')}
      </div>

      <div data-a="up3" style="margin-top: 26px; padding: 20px 26px; border-radius: 16px; background: rgba(216,52,44,0.13); border: 1px solid rgba(216,52,44,0.45); display: flex; align-items: center; gap: 24px;">
        <span style="font-family: ${DISPLAY}; font-size: 74px; line-height: 0.85; color: ${RUST}; white-space: nowrap;">6½ AÑOS</span>
        <span style="font-size: 24px; font-weight: 500; color: ${STEEL}; line-height: 1.35;">sin una sola skin (2012 → 2018)…<br>y la sequía terminó <strong style="color: ${ACID};">un año después del rework</strong></span>
      </div>

      <div data-a="up3" style="margin-top: 24px; display: flex; align-items: flex-end; gap: 32px;">
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 94px; line-height: 0.86; color: ${ACID};">~56 <span style="font-size: 52px;">USD</span></div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">las seis · 7 270 RP</div>
        </div>
        <div style="width: 2px; height: 80px; background: rgba(150,227,46,0.3);"></div>
        <div style="flex: 1;">
          <div style="font-family: ${DISPLAY}; font-size: 94px; line-height: 0.86; color: ${STEEL};">3,5</div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">días de salario mínimo</div>
        </div>
      </div>

      <div data-a="up3" style="margin-top: 22px; display: flex; align-items: center; gap: 18px; padding: 16px 22px; border-radius: 14px; border: 2px dashed rgba(140,160,143,0.4);">
        <img src="assets/Urgot_2.jpg" alt="Urgot Carnicero" style="width: 96px; height: 58px; object-fit: cover; object-position: center 20%; border-radius: 8px; filter: grayscale(0.6);">
        <span style="font-size: 23px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">La séptima, <strong style="color: ${STEEL};">Carnicero</strong>, salió el mismo día que él — pero vive en la <strong style="color: ${STEEL};">Bóveda Heredada</strong> y ya no se puede comprar.</span>
      </div>
    </div>
  </section>`);

// ── 5 · Lore: la traición ────────────────────────────────────────────────
slides.push(`
  <section data-label="Lore · La traición" data-screen-label="05 · La traición" data-speaker-notes="Era el verdugo de Noxus. Swain lo mando a una trampa en Zaun y acabo encadenado en la Draga, donde la alcaidesa Voss prometia libertad a cambio de confesiones y los mataba igual." style="${seccion()}">
    ${glow(RUST, '50% 32%', '110% 42%')}
    <div style="position: relative;">
      ${eyebrow('El lore', RUST)}
      ${arte('Swain_0.jpg', 'Swain', 380, 'center 18%')}
      <h2 data-a="up2" style="margin: 38px 0 0; font-family: ${DISPLAY}; font-size: 88px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">El verdugo acabó<br>del lado <span style="color: ${RUST};">del condenado</span></h2>
      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 20px;">
        ${[
          'Era el <strong style="color:' + STEEL + ';">verdugo de Noxus</strong>: mataba en nombre del imperio',
          '<strong style="color:' + STEEL + ';">Swain</strong> lo mandó a Zaun a una misión que era una trampa',
          'Acabó encadenado en <strong style="color:' + STEEL + ';">la Draga</strong>, la mina-prisión del fondo de Zaun',
          'La alcaidesa <strong style="color:' + STEEL + ';">Voss</strong> prometía libertad a cambio de confesiones… y los mataba igual',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${RUST}; width: 44px;">${i + 1}</span>
          <span style="font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 6 · Lore: las cadenas ────────────────────────────────────────────────
slides.push(`
  <section data-label="Lore · Las cadenas" data-screen-label="06 · Las cadenas" data-speaker-notes="El detalle mas cabron: las cadenas con las que lo esclavizaron son hoy sus armas." style="${seccion()}">
    ${glow(ACID, '50% 34%', '110% 45%')}
    <div style="position: relative;">
      ${eyebrow('Y el detalle más cabrón')}
      ${arte('Urgot_0.jpg', 'Las cadenas de Urgot', 640, 'center 35%')}
      <h2 data-a="up2" style="margin: 40px 0 0; font-family: ${DISPLAY}; font-size: 96px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL};">Las cadenas que<br>lo esclavizaron<br><span style="color: ${ACID};">hoy son sus armas</span></h2>
      <p data-a="up3" style="margin: 30px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">Salió de la mina convertido en lo que es… y se quedó con los grilletes.</p>
    </div>
  </section>`);

// ── 7 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="07 · Cierre" data-speaker-notes="Cierre: gigi easy, tirenme un follow o les meto la cuarta." style="${seccion()} background-image: linear-gradient(180deg, rgba(7,10,9,0.55) 0%, rgba(7,10,9,0.96) 72%), url('assets/Urgot_0.jpg'); background-size: cover; background-position: center 26%;">
    ${glow(ACID, '50% 62%', '120% 50%')}
    <div style="position: relative; text-align: center; margin-top: auto;">
      <div data-a="up" style="font-size: 28px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${ACID};">16 años después</div>
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 136px; line-height: 0.88; letter-spacing: 1px; text-transform: uppercase; color: ${STEEL}; text-shadow: 0 0 70px rgba(150,227,46,0.35);">Tírenme<br>un <span style="color: ${ACID};">follow</span></h2>
      <p data-a="up3" style="margin: 40px 0 0; font-size: 34px; font-weight: 500; color: ${STEEL};">Feliz cumpleaños, Urgot ⛓️</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 25px; font-weight: 500; color: ${MUTED};">…o les voy a meter la cuarta</p>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Urgot cumple 16 años</title>
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
    padding: 9px 18px; border: 1px solid rgba(150,227,46,0.45); border-radius: 999px;
    background: rgba(7,10,9,0.85); color: ${ACID}; cursor: pointer;
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
