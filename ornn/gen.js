// Generador de index.html — Ornn cumple 9 años (screenshots para TikTok)
// Ejecutar: node ornn/gen.js
//
// Formato 1080×1920 (9:16). El contenido va concentrado en una banda central
// con márgenes grandes arriba y abajo, para que la interfaz de TikTok
// (usuario, caption, botones) no tape nada.
// Un slide por momento clave del guion, en el orden en que se narra.
const fs = require('fs');

// ── Paleta Ornn: forja, hierro y lava ────────────────────────────────────
const BG = '#0B0605';
const IRON = '#171010';
const CRIMSON = '#C0272D';
const EMBER = '#FF6B1A';
const GOLD = '#FFA23A';
const HOT = '#FFD9A0';
const TEXT = '#F5E9DE';
const MUTED = '#A08878';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', ui-sans-serif, system-ui, sans-serif`;

// Banda central: márgenes generosos arriba/abajo para las zonas seguras de TikTok
const SAFE = 'padding: 300px 84px 350px;';

const seccion = (extra = '') =>
  `background: ${BG}; font-family: ${BODY}; color: ${TEXT}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

/** Brillo de forja detrás del contenido. */
const glow = (color = EMBER, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}33 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const eyebrow = txt =>
  `<div data-a="up" style="display: flex; align-items: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 54px; height: 5px; background: ${EMBER};"></span>
      <span style="font-family: ${BODY}; font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${EMBER};">${txt}</span>
    </div>`;

const titulo = (txt, size = 108) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">${txt}</h2>`;

const parrafo = (txt, size = 34) =>
  `<p data-a="up3" style="margin: 32px 0 0; font-size: ${size}px; font-weight: 400; color: ${MUTED}; line-height: 1.45;">${txt}</p>`;

/** Cifra enorme con etiqueta debajo. */
const cifra = (n, label, color = EMBER, size = 150) => `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-family: ${DISPLAY}; font-size: ${size}px; line-height: 0.86; color: ${color}; letter-spacing: 1px; text-shadow: 0 0 60px ${color}66;">${n}</span>
          <span style="font-size: 25px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">${label}</span>
        </div>`;

/** Imagen con recorte y viñeta cálida. */
const arte = (src, alt, alto, extra = '') => `
      <div data-a="img" style="position: relative; width: 100%; height: ${alto}px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,162,58,0.25); box-shadow: 0 30px 70px rgba(0,0,0,0.6); ${extra}">
        <img src="assets/${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 28%;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,6,5,0) 40%, rgba(11,6,5,0.85) 100%);"></div>
      </div>`;

const slides = [];

// ── 1 · Portada: 9 años ──────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada · 9 años" data-screen-label="01 · Portada" data-speaker-notes="Hoy es cumpleanos de Ornn: nueve anos desde que llego a la Grieta." style="${seccion()} background-image: linear-gradient(180deg, rgba(11,6,5,0.2) 0%, rgba(11,6,5,0.95) 78%), url('assets/Ornn_0.jpg'); background-size: cover; background-position: center 30%;">
    ${glow(CRIMSON, '50% 30%', '120% 45%')}
    <div style="position: relative; margin-top: auto;">
      ${eyebrow('Agosto 2017 — 2026')}
      <h1 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 230px; font-weight: 400; line-height: 0.82; letter-spacing: 2px; color: ${TEXT}; text-shadow: 0 0 90px rgba(255,107,26,0.45);">ORNN<br><span style="color: ${EMBER};">9 AÑOS</span></h1>
      <p data-a="up3" style="margin: 34px 0 0; font-size: 38px; font-weight: 500; color: ${HOT}; line-height: 1.3;">El Fuego Debajo de la Montaña</p>
      <p data-a="up3" style="margin: 12px 0 0; font-size: 30px; font-weight: 400; color: ${MUTED};">Toplaner · Tanque · Fréljord</p>
    </div>
  </section>`);

// ── 2 · El OTP número uno del mundo ──────────────────────────────────────
slides.push(`
  <section data-label="El OTP #1" data-screen-label="02 · OTP coreano" data-speaker-notes="El one trick con mas puntos del mundo: coreano, maestria 456, siete millones de puntos." style="${seccion()}">
    ${glow(EMBER, '50% 42%')}
    <div style="position: relative;">
      ${eyebrow('El one trick #1 del mundo')}
      ${titulo('쾌 활 한<br><span style="color: ' + EMBER + ';">#KR1</span>', 104)}
      <p data-a="up3" style="margin: 26px 0 0; font-size: 30px; font-weight: 500; color: ${MUTED};">Corea · CHZZK 쾌활한 (Cheerful)</p>
      <div data-a="up3" style="margin-top: 58px; display: flex; flex-direction: column; gap: 44px;">
        ${cifra('7 079 757', 'Puntos de maestría en Ornn', EMBER, 132)}
        <div style="display: flex; gap: 70px;">
          ${cifra('456', 'Nivel de maestría', GOLD, 116)}
          ${cifra('1190', 'Nivel de invocador', MUTED, 116)}
        </div>
      </div>
    </div>
  </section>`);

// ── 3 · ~9.000 partidas ──────────────────────────────────────────────────
slides.push(`
  <section data-label="9.000 partidas" data-screen-label="03 · Las partidas" data-speaker-notes="Son alrededor de nueve mil partidas: mil por cada ano que lleva el campeon en el juego." style="${seccion()}">
    ${glow(CRIMSON, '50% 45%')}
    <div style="position: relative; text-align: center;">
      <div data-a="up" style="font-size: 27px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${EMBER}; margin-bottom: 40px;">Eso es, aproximadamente…</div>
      <div data-a="up2" style="font-family: ${DISPLAY}; font-size: 300px; line-height: 0.82; color: ${TEXT}; text-shadow: 0 0 80px rgba(255,107,26,0.5);">9 000</div>
      <div data-a="up2" style="font-size: 40px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${HOT}; margin-top: 10px;">partidas de Ornn</div>
      <div data-a="up3" style="margin-top: 62px; padding: 40px 34px; border-top: 2px solid rgba(255,162,58,0.25); border-bottom: 2px solid rgba(255,162,58,0.25);">
        <div style="font-family: ${DISPLAY}; font-size: 128px; line-height: 0.9; color: ${EMBER};">1 000</div>
        <div style="font-size: 30px; font-weight: 500; color: ${MUTED}; margin-top: 10px;">por cada año que el campeón lleva en el juego</div>
      </div>
    </div>
  </section>`);

// ── 4 · El historial de temporadas (la captura que habla sola) ───────────
const temporadas = [
  ['S2026', 'Sin clasificar', MUTED, false],
  ['S2025', 'Esmeralda 4', TEXT, false],
  ['S2024 S3', 'Esmeralda 2', TEXT, false],
  ['S2024 S2', 'Esmeralda 2', TEXT, false],
  ['S2024 S1', 'Diamante 3', GOLD, true],
  ['S2023 S2', 'Diamante 4', TEXT, false],
  ['S2023 S1', 'Platino 3', TEXT, false],
  ['S2022', 'Platino 4', TEXT, false],
  ['S2021', 'Oro 3', TEXT, false],
  ['S2020', 'Platino 4', TEXT, false],
  ['S9', 'Oro 3', TEXT, false],
  ['S7', 'Plata 2', TEXT, false],
  ['S5', 'Plata 2', TEXT, false],
];
slides.push(`
  <section data-label="Historial de temporadas" data-screen-label="04 · Historial" data-speaker-notes="CAPTURA CLAVE: se deja fija ~15 segundos. No se dice en voz; la imagen lo cuenta sola." style="${seccion()}">
    ${glow(GOLD, '50% 40%', '110% 60%')}
    <div style="position: relative;">
      ${eyebrow('Su historial completo')}
      ${titulo('Nunca pasó<br>de <span style="color: ' + GOLD + ';">Diamante 3</span>', 92)}
      <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 8px;">
        ${temporadas.map(([t, r, c, top]) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 26px; border-radius: 12px; ${top ? `background: ${GOLD}1F; border: 1px solid ${GOLD}66;` : 'border: 1px solid rgba(255,255,255,0.07);'}">
          <span style="font-size: 27px; font-weight: 600; color: ${MUTED}; letter-spacing: 1px;">${t}</span>
          <span style="font-size: 29px; font-weight: ${top ? '700' : '500'}; color: ${c};">${r}${top ? '  ◄' : ''}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 5 · La sequía de skins ───────────────────────────────────────────────
slides.push(`
  <section data-label="La sequía de skins" data-screen-label="05 · La sequía" data-speaker-notes="Primera skin en 2017 y la siguiente hasta diciembre de 2020. Tres anos y cuatro meses de nada." style="${seccion()}">
    ${glow(CRIMSON, '50% 45%')}
    <div style="position: relative;">
      ${eyebrow('Las skins')}
      ${titulo('Entre su primera<br>y su segunda skin<br>pasaron', 88)}
      <div data-a="up3" style="margin-top: 46px; font-family: ${DISPLAY}; font-size: 236px; line-height: 0.84; color: ${EMBER}; text-shadow: 0 0 80px rgba(255,107,26,0.45);">3 AÑOS</div>
      <div data-a="up3" style="font-size: 46px; font-weight: 600; color: ${HOT}; letter-spacing: 1px;">y 4 meses</div>
      <div data-a="up3" style="margin-top: 56px; display: flex; gap: 22px;">
        <div style="flex: 1; padding: 26px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 25px; font-weight: 700; color: ${EMBER}; letter-spacing: 2px;">AGO 2017</div>
          <div style="font-size: 28px; font-weight: 500; color: ${TEXT}; margin-top: 6px;">Señor del Trueno</div>
        </div>
        <div style="flex: 1; padding: 26px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 25px; font-weight: 700; color: ${EMBER}; letter-spacing: 2px;">DIC 2020</div>
          <div style="font-size: 28px; font-weight: 500; color: ${TEXT}; margin-top: 6px;">Bosqueviejo</div>
        </div>
      </div>
    </div>
  </section>`);

// ── 6 · Las 5 skins y lo que cuestan ────────────────────────────────────
const skins = [
  ['Ornn_1.jpg', 'Señor del Trueno', 'ago 2017'],
  ['Ornn_2.jpg', 'Bosqueviejo', 'dic 2020'],
  ['Ornn_11.jpg', 'Onda Espacial', 'nov 2022'],
  ['Ornn_20.jpg', 'ConductOrnn', 'abr 2024'],
  ['Ornn_29.jpg', 'Egidatrón', 'ene 2026'],
];
slides.push(`
  <section data-label="Las 5 skins y el precio" data-screen-label="06 · Precio" data-speaker-notes="Cinco skins. Comprarlas todas son unos 52 dolares: tres dias de salario minimo en Mexico." style="${seccion()}">
    ${glow(EMBER, '50% 38%')}
    <div style="position: relative;">
      ${eyebrow('Comprarlas todas')}
      ${titulo('5 skins<br>en 9 años', 96)}
      <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 12px;">
        ${skins.map(([img, nombre, fecha]) => `
        <div style="display: flex; align-items: center; gap: 20px; padding: 10px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07);">
          <img src="assets/${img}" alt="${nombre}" style="width: 132px; height: 74px; object-fit: cover; object-position: center 25%; border-radius: 9px; flex: none;">
          <span style="flex: 1; font-size: 29px; font-weight: 600; color: ${TEXT};">${nombre}</span>
          <span style="font-size: 24px; font-weight: 500; color: ${MUTED}; letter-spacing: 1px;">${fecha}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 44px; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 34px; border-top: 2px solid rgba(255,162,58,0.28);">
        ${cifra('~52', 'dólares', EMBER, 138)}
        <div style="text-align: right; padding-bottom: 8px;">
          <div style="font-family: ${DISPLAY}; font-size: 92px; line-height: 0.9; color: ${GOLD};">3,3</div>
          <div style="font-size: 25px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">días de salario<br>mínimo en México</div>
        </div>
      </div>
    </div>
  </section>`);

// ── 7 · Todas valen lo mismo ─────────────────────────────────────────────
slides.push(`
  <section data-label="Cero legendarias" data-screen-label="07 · 1350 RP" data-speaker-notes="Las cinco cuestan exactamente lo mismo. En nueve anos: ni legendaria, ni definitiva, ni prestigio." style="${seccion()}">
    ${glow(CRIMSON, '50% 42%')}
    <div style="position: relative;">
      ${eyebrow('Y el detalle más ojete')}
      ${titulo('Las cinco cuestan<br>exactamente<br>lo mismo', 92)}
      <div data-a="up3" style="margin-top: 44px; font-family: ${DISPLAY}; font-size: 210px; line-height: 0.86; color: ${EMBER};">1350 <span style="font-size: 110px;">RP</span></div>
      <div data-a="up3" style="font-size: 30px; font-weight: 500; color: ${MUTED};">las cinco, sin excepción</div>
      <div data-a="up3" style="margin-top: 58px; display: flex; flex-direction: column; gap: 14px;">
        ${['Legendarias', 'Definitivas', 'Prestigio'].map(t => `
        <div style="display: flex; align-items: center; gap: 24px; padding: 22px 30px; border-radius: 16px; background: rgba(192,39,45,0.12); border: 1px solid rgba(192,39,45,0.4);">
          <span style="font-family: ${DISPLAY}; font-size: 74px; line-height: 0.8; color: ${CRIMSON}; width: 70px;">0</span>
          <span style="font-size: 36px; font-weight: 600; color: ${TEXT};">${t}</span>
        </div>`).join('')}
      </div>
      <div data-a="up3" style="margin-top: 30px; font-size: 29px; font-weight: 500; color: ${HOT};">En nueve años. Nada.</div>
    </div>
  </section>`);

// ── 8 · Lore: Anivia ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="Lore · Anivia" data-screen-label="08 · Anivia" data-speaker-notes="Talo los arboles de su hermana Anivia, ella le quemo la casa, y el nunca supo que fue ella." style="${seccion()}">
    ${glow('#4FC3F7', '50% 32%', '110% 40%')}
    <div style="position: relative;">
      ${eyebrow('El lore')}
      ${arte('Anivia_0.jpg', 'Anivia', 400)}
      <h2 data-a="up2" style="margin: 40px 0 0; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">Su hermana le<br>quemó la casa…<br><span style="color: ${EMBER};">y él nunca lo supo</span></h2>
      <div data-a="up3" style="margin-top: 42px; display: flex; flex-direction: column; gap: 20px;">
        ${[
          'Taló los árboles favoritos de <strong style="color:' + TEXT + ';">Anivia</strong> para construir su salón',
          'Ella se vengó <strong style="color:' + TEXT + ';">incendiándoselo</strong>',
          'Él creyó que ardió por su <strong style="color:' + TEXT + ';">propia arrogancia</strong>',
          'Juró no volver a presumir su trabajo <strong style="color:' + TEXT + ';">jamás</strong>',
        ].map((t, i) => `
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <span style="flex: none; font-family: ${DISPLAY}; font-size: 46px; line-height: 1; color: ${EMBER}; width: 44px;">${i + 1}</span>
          <span style="font-size: 31px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 9 · Lore: Sangre del Hogar ───────────────────────────────────────────
slides.push(`
  <section data-label="Lore · Sangre del Hogar" data-screen-label="09 · Volibear" data-speaker-notes="Los Sangre del Hogar murieron todos en una pelea entre Ornn y Volibear." style="${seccion()}">
    ${glow(CRIMSON, '50% 32%', '110% 42%')}
    <div style="position: relative;">
      ${eyebrow('Y hay otra peor')}
      ${arte('Volibear_0.jpg', 'Volibear', 400)}
      <h2 data-a="up2" style="margin: 40px 0 0; font-family: ${DISPLAY}; font-size: 90px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">El dios de la creación<br><span style="color: ${CRIMSON};">borró del mapa</span><br>a los únicos que<br>le hacían caso</h2>
      ${parrafo('Un pueblo entero lo adoraba y aprendió a forjar con él: <strong style="color: ' + TEXT + ';">los Sangre del Hogar</strong>. Murieron todos y su hogar fue destruido durante una pelea entre Ornn y <strong style="color: ' + TEXT + ';">Volibear</strong>.', 32)}
    </div>
  </section>`);

// ── 10 · Hefesto ─────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Hefesto" data-screen-label="10 · Hefesto" data-speaker-notes="Esta basado en Hefesto: el dios herrero griego, despreciado por los otros dioses, que trabajaba solo bajo un volcan." style="${seccion()}">
    ${glow(GOLD, '50% 34%', '110% 42%')}
    <div style="position: relative;">
      ${eyebrow('De dónde salió')}
      ${arte('hefesto.jpg', 'La fragua de Vulcano, Velázquez (1630)', 420, 'border-color: rgba(255,162,58,0.35);')}
      <div data-a="up3" style="margin-top: 12px; font-size: 21px; font-weight: 400; color: ${MUTED}; font-style: italic;">La fragua de Vulcano · Velázquez, 1630 · Museo del Prado</div>
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 104px; line-height: 0.9; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">Está basado en<br><span style="color: ${GOLD};">Hefesto</span></h2>
      <div data-a="up3" style="margin-top: 38px; display: flex; flex-direction: column; gap: 18px;">
        ${['El dios griego herrero', 'Despreciado por los demás dioses', 'Trabajaba solo bajo un volcán'].map(t => `
        <div style="display: flex; align-items: center; gap: 20px;">
          <span style="flex: none; width: 12px; height: 12px; background: ${GOLD}; transform: rotate(45deg);"></span>
          <span style="font-size: 33px; font-weight: 500; color: ${MUTED};">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 11 · El remate: la skin del tren ─────────────────────────────────────
slides.push(`
  <section data-label="La skin del tren" data-screen-label="11 · ConductOrnn" data-speaker-notes="Remate: la skin del tren empezo como fanart de burla en Reddit y cuatro anos despues Riot la saco oficial." style="${seccion()}">
    ${glow(EMBER, '50% 32%', '110% 42%')}
    <div style="position: relative;">
      ${eyebrow('Pero la mejor es esta')}
      ${arte('Ornn_20.jpg', 'El ConductOrnn de Trenes', 400)}
      <h2 data-a="up2" style="margin: 38px 0 0; font-family: ${DISPLAY}; font-size: 88px; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT};">La única skin que la<br>comunidad le consiguió<br><span style="color: ${EMBER};">fue burlándose de él</span></h2>
      <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 16px;">
        ${[
          ['2020', 'Un usuario sube a Reddit un fanart de “Ornn conductor de tren” <strong style="color:' + TEXT + ';">como burla</strong>'],
          ['↓', 'La comunidad lo vuelve mod y se hace famoso'],
          ['2024', '<strong style="color:' + TEXT + ';">Riot la saca como skin oficial</strong>'],
        ].map(([a, t]) => `
        <div style="display: flex; align-items: flex-start; gap: 24px;">
          <span style="flex: none; width: 116px; font-family: ${DISPLAY}; font-size: 50px; line-height: 1.05; color: ${EMBER};">${a}</span>
          <span style="font-size: 30px; font-weight: 400; color: ${MUTED}; line-height: 1.35;">${t}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 12 · Cierre ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="12 · Cierre" data-speaker-notes="Cierre: saquenle una legendaria al herrero." style="${seccion()} background-image: linear-gradient(180deg, rgba(11,6,5,0.55) 0%, rgba(11,6,5,0.96) 72%), url('assets/Ornn_0.jpg'); background-size: cover; background-position: center 28%;">
    ${glow(EMBER, '50% 62%', '120% 50%')}
    <div style="position: relative; text-align: center; margin-top: auto;">
      <div data-a="up" style="font-size: 28px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${EMBER};">9 años después</div>
      <h2 data-a="up2" style="margin: 34px 0 0; font-family: ${DISPLAY}; font-size: 132px; line-height: 0.88; letter-spacing: 1px; text-transform: uppercase; color: ${TEXT}; text-shadow: 0 0 70px rgba(255,107,26,0.4);">Sáquenle una<br><span style="color: ${EMBER};">legendaria</span><br>al herrero</h2>
      <p data-a="up3" style="margin: 40px 0 0; font-size: 34px; font-weight: 500; color: ${HOT};">Feliz cumpleaños, Ornn 🔨</p>
    </div>
  </section>`);

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ornn cumple 9 años</title>
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
    padding: 9px 18px; border: 1px solid rgba(255,107,26,0.45); border-radius: 999px;
    background: rgba(11,6,5,0.85); color: ${EMBER}; cursor: pointer;
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
