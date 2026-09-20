// Generador de index.html — Katarina cumple 17 años (screenshots para TikTok)
// Ejecutar: node katarina/gen.js
//
// Serie «Cumplelolero» #15, animado. **Corte pedido: solo portadas, one trick y
// skins, todo centrado y con poco texto**, porque las láminas son assets para
// cortar encima de la voz en off. El lore del guion (el papá, el error de
// Demetrius, la cicatriz que le hizo Talon) se narra sin apoyo escrito.
//
// **Este episodio rompe el orden de la serie a propósito**: el one trick abre
// en vez de cerrar, porque por primera vez en quince episodios **el número uno
// del mundo es latino** — y en los dos anteriores el bloque LATAM se cayó por ir
// al final.
//
// Piezas de diseño:
//  · Los rangos tienen **lámina propia y van enormes**: el emblema de Hierro a
//    300 px con los cinco del historial debajo. El dato no es un número, es ver
//    doce millones de puntos al lado de un emblema de Hierro.
//  · Las once skins comprables van en rejilla de tres por fila y **grandes**;
//    la legendaria (Reina Guerrera) es la única con borde de acento.
//  · **Pétalos Primaverales tiene lámina propia**, a lo ancho: es el remate del
//    bloque de skins — salió en febrero de este año y ya está en la bóveda.
//  · El motivo son **las dos dagas cruzadas** (`dagas()`), dibujadas.
//
// ⚠️ La investigación marca como **sin confirmar** que Pétalos Primaverales ya
// esté en bóveda: sale de la sección «Legacy Vault» de la wiki y es raro para
// una skin de hace siete meses. El guion sí lo narra, así que va — pero conviene
// verificarlo en el cliente antes de grabar.
//
// Paleta muestreada del splash: el fondo es teal frío (hue 180, el tono más
// repetido de la imagen) y lo único cálido es su pelo y el rastro carmesí.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta Katarina: el acero frío y el carmesí ──────────────────────────
// El rojo está muy visto en el repo (caps, briar, mundo), así que lo que separa
// a este es **con qué va emparejado**: briar lleva su carmín sobre violeta con
// un azul cielo pálido, y aquí el carmesí va sobre grafito con el TEAL del
// splash de estructura. Ningún otro deck usa esa pareja.
const BG = '#0A0E11';        // acero de Noxus, de noche
const FILO = '#E8365F';      // el carmesí de su pelo — acento
const ACERO = '#63A8B0';     // el teal frío del splash — datos y estructura
const BONE = '#EFEAEA';      // texto principal
const MUTED = '#7E858A';     // texto secundario
const PANEL = '#121A1D';     // paneles

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;

// Banda segura de TikTok: la interfaz tapa arriba y abajo.
const SAFE = 'padding: 300px 84px 350px;';

// Todas las láminas van centradas por encargo.
const seccion = (extra = 'align-items: center; text-align: center;') =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; ${extra}`;

const glow = (color = FILO, pos = '50% 50%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}29 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

// Banda superior con recorte suave sobre una copia borrosa del mismo splash
// (helper de missfortune). La capa borrosa sangra fuera del marco, de ahí el
// contenedor con overflow oculto: si no, infla scrollHeight.
const portada = (src, alt, posNitida = 'center 20%') => `
    <div style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
    <div data-fondo style="position: absolute; inset: -60px; background-image: url('assets/${src}'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(48px) saturate(0.9) brightness(0.4); transform: scale(1.08);" role="img" aria-label="${alt}"></div>
    <div data-fondo-nitido style="position: absolute; left: 0; right: 0; top: 0; height: 820px; background-image: url('assets/${src}'); background-size: cover; background-position: ${posNitida}; background-repeat: no-repeat; -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%);"></div>
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,14,17,0.14) 0%, rgba(10,14,17,0.38) 34%, rgba(10,14,17,0.92) 64%, rgba(10,14,17,0.99) 100%);"></div>
    </div>`;

const eyebrow = (txt, color = FILO) =>
  `<div data-a="up" style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 26px;">
      <span style="width: 44px; height: 5px; background: ${color};"></span>
      <span style="font-family: ${BODY}; font-size: 26px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: ${color}; text-shadow: 0 2px 12px rgba(10,14,17,0.9);">${txt}</span>
      <span style="width: 44px; height: 5px; background: ${color};"></span>
    </div>`;

const titulo = (txt, size = 100) =>
  `<h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// ── Las dos dagas cruzadas: el motivo del deck ───────────────────────────
const daga = (color, giro) => `
      <g data-daga transform="rotate(${giro} 60 60)">
        <path d="M60 4 L75 42 L75 76 L45 76 L45 42 Z" fill="${color}"/>
        <rect x="30" y="76" width="60" height="11" rx="4" fill="${color}"/>
        <rect x="52" y="87" width="16" height="22" rx="6" fill="${color}"/>
        <circle cx="60" cy="113" r="9" fill="${color}"/>
      </g>`;

const dagas = (tam = 120, color = FILO) => `
    <svg data-dagas viewBox="0 0 120 120" width="${tam}" height="${tam}" style="flex: none; display: block; overflow: visible; filter: drop-shadow(0 0 ${Math.round(tam * 0.22)}px ${color}73);" aria-hidden="true">
      ${daga(color, -32)}
      ${daga(color, 32)}
    </svg>`;

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy cumple diecisiete anos Katarina y esta vez no voy a empezar por el lore porque traigo un dato que no se habia repetido en toda la serie." style="${seccion()}">
    ${portada('Katarina_0.jpg', 'Katarina, la Daga Siniestra', 'center 16%')}
    ${glow(FILO, '50% 26%', '120% 44%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Cumplelolero · 19 sep 2009 — 2026')}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 186px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE}; text-shadow: 0 2px 26px rgba(10,14,17,0.88);"><span data-linea style="display: block;">KATARINA</span><span data-linea style="display: block; color: ${FILO};">17 AÑOS</span></h1>
      <p data-sub style="margin: 30px 0 0; font-size: 38px; font-weight: 500; color: ${ACERO}; line-height: 1.3;">La Daga Siniestra</p>
      <p data-sub style="margin: 12px 0 0; font-size: 29px; font-weight: 400; color: ${MUTED};">Mid · Noxus · Casa Du Couteau</p>
      <div data-sub style="margin-top: 38px;">${dagas(148)}</div>
    </div>
  </section>`);

// ── 2 · El número uno del mundo es latino ────────────────────────────────
// Rompe el orden de la serie: el one trick abre. Es la primera vez en quince
// episodios que el mejor del planeta en un campeón es de los servidores latinos.
slides.push(`
  <section data-label="El número uno" data-screen-label="02 · El OTP" data-speaker-notes="El Katarina con mas puntos de maestria del mundo es latino. No de Brasil, latino de los nuestros, del servidor del sur. Se llama Wild Kat y tiene doce millones trescientos mil puntos con nivel de maestria novecientos seis. El numero uno del planeta en puntos." style="${seccion()}">
    ${glow(FILO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Primera vez en toda la serie')}
      ${titulo('El número uno<br>del mundo <span style="color: ' + FILO + ';">es latino</span>', 96)}

      <div data-servidor style="margin-top: 34px; display: inline-flex; align-items: center; gap: 18px; padding: 16px 34px; border-radius: 999px; background: ${FILO}1F; border: 1px solid ${FILO}80;">
        <span style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; color: ${FILO};">#1</span>
        <span style="font-size: 27px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${BONE};">Del servidor del sur</span>
      </div>

      <div data-cifra style="margin-top: 34px;">
        <div data-cuenta="12367424" style="font-family: ${DISPLAY}; font-size: 160px; line-height: 0.84; color: ${BONE}; text-shadow: 0 0 70px rgba(232,54,95,0.35);">12 367 424</div>
        <div style="margin-top: 6px; font-size: 25px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">puntos de maestría</div>
      </div>

      <div data-fichas style="margin-top: 38px; display: flex; gap: 16px;">
        ${[['WILD KAT', 'su nombre'], ['906', 'nivel de maestría'], ['649', 'de 802 partidas']].map(([a, b]) => `
        <div style="padding: 22px 26px; border-radius: 16px; background: ${PANEL}D9; border: 1px solid rgba(99,168,176,0.28);">
          <div style="font-family: ${DISPLAY}; font-size: 54px; line-height: 1; color: ${ACERO};">${a}</div>
          <div style="margin-top: 2px; font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 3 · Los rangos, en grande ────────────────────────────────────────────
// El emblema a 300 px es la lámina: el dato no es el número, es ver doce
// millones de puntos al lado de un emblema de Hierro.
const historial = [
  ['S2025', 'Bronce 4', 'bronze.png'],
  ['S2024 S3', 'Hierro 2', 'iron.png'],
  ['S2024 S2', 'Hierro 2', 'iron.png'],
  ['S2024 S1', 'Hierro 2', 'iron.png'],
  ['S2023 S2', 'Hierro 3', 'iron.png'],
];

slides.push(`
  <section data-label="Los rangos" data-screen-label="03 · Los rangos" data-speaker-notes="Y ahora agarrense porque esta en Hierro uno. No es que ande en Plata teniendo un mal ano. Es que nunca ha salido de ahi. Su historial completo es Hierro dos Hierro dos Hierro dos Hierro tres y Bronce cuatro. Su pico historico en toda su vida es Bronce tres y esta en el tres por ciento mas bajo de su servidor. De ochocientas dos partidas esta temporada seiscientas cuarenta y nueve son con ella. Doce millones de puntos para seguir en Hierro. Pero nadie en el planeta le ha metido mas horas a esa campeona y eso no se lo quita nadie." style="${seccion()}">
    ${glow(ACERO, '50% 34%', '118% 52%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Y ahora agárrense', ACERO)}

      <img data-emblema src="assets/emblems/iron.png" alt="Hierro" style="width: 380px; height: auto; display: block; filter: drop-shadow(0 0 70px rgba(232,54,95,0.30)) brightness(1.12);">
      <div data-rango style="margin-top: 6px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.88; color: ${BONE};">HIERRO 1</div>
      <div data-rango style="margin-top: 4px; font-size: 27px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${MUTED};">84 LP · nunca ha salido de ahí</div>

      <div data-historial style="margin-top: 40px; display: flex; gap: 14px;">
        ${historial.map(([temp, nombre, emblema]) => `
        <div data-temporada style="flex: 1; padding: 16px 10px 14px; border-radius: 14px; background: ${PANEL}D9; border: 1px solid rgba(255,255,255,0.08);">
          <img src="assets/emblems/${emblema}" alt="${nombre}" style="width: 100%; max-width: 104px; height: auto; display: block; margin: 0 auto; filter: brightness(1.1);">
          <div style="margin-top: 6px; font-size: 22px; font-weight: 700; color: ${BONE}; line-height: 1.1;">${nombre}</div>
          <div style="margin-top: 2px; font-size: 17px; font-weight: 600; letter-spacing: 1px; color: ${MUTED};">${temp}</div>
        </div>`).join('')}
      </div>

      <div data-remate style="margin-top: 34px; display: flex; gap: 18px;">
        ${[['Bronce 3', 'su pico de toda la vida'], ['3 %', 'más bajo del servidor']].map(([a, b]) => `
        <div style="flex: 1; padding: 22px 24px; border-radius: 16px; background: ${FILO}14; border: 1px solid ${FILO}59;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${FILO};">${a}</div>
          <div style="margin-top: 2px; font-size: 20px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED};">${b}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 4 · Las skins: récord de la serie ────────────────────────────────────
const comprables = [
  ['Katarina_1.jpg', 'Mercenaria', '520'],
  ['Katarina_5.jpg', 'Alto Mando', '750'],
  ['Katarina_6.jpg', 'Tormenta de Arena', '975'],
  ['Katarina_8.jpg', 'Reinos en Guerra', '975'],
  ['Katarina_9.jpg', 'PROYECTO', '1350'],
  ['Katarina_12.jpg', 'Academia de Combate', '1350'],
  ['Katarina_21.jpg', 'Luna de Sangre', '1350'],
  ['Katarina_29.jpg', 'Reina Guerrera', '1820'],
  ['Katarina_37.jpg', 'La Forajida', '1350'],
  ['Katarina_47.jpg', 'Corte Feérica', '1350'],
  ['Katarina_59.jpg', 'Elegida del Lobo', '1350'],
];

slides.push(`
  <section data-label="Las skins" data-screen-label="04 · Las skins" data-speaker-notes="Y de skins tiene veinte, que es el record de toda esta serie. Once puedes comprar y te salen en unos cien dolares, seis dias de salario minimo." style="${seccion()}">
    ${glow(FILO, '50% 28%', '118% 48%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Récord de toda la serie')}
      ${titulo('20 skins, y <span style="color: ' + FILO + ';">11 a la venta</span>', 88)}

      <div data-rejilla style="margin-top: 26px; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px;">
        ${comprables.map(([img, nombre, rp]) => {
          const legendaria = rp === '1820';
          return `
        <div data-skin style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid ${legendaria ? FILO + 'CC' : 'rgba(99,168,176,0.24)'};">
          <img src="assets/${img}" alt="Katarina ${nombre}" style="width: 100%; height: 226px; object-fit: cover; object-position: center 20%; display: block;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,14,17,0) 44%, rgba(10,14,17,0.93) 100%);"></div>
          <div style="position: absolute; left: 12px; right: 12px; bottom: 9px; text-align: left;">
            <div style="font-size: 19px; font-weight: 700; color: ${BONE}; line-height: 1.12;">${nombre}</div>
            <div style="font-size: 17px; font-weight: 600; color: ${legendaria ? FILO : ACERO};">${rp} RP${legendaria ? ' · legendaria' : ''}</div>
          </div>
        </div>`;
        }).join('')}
      </div>

      <div data-precio style="margin-top: 22px; display: flex; align-items: center; justify-content: center; gap: 24px;">
        <div style="font-family: ${DISPLAY}; font-size: 86px; line-height: 0.9; color: ${FILO};">~<span data-cuenta="101">101</span> <span style="font-size: 44px;">USD</span></div>
        <div style="width: 2px; height: 58px; background: ${FILO}4D;"></div>
        <div style="text-align: left; font-size: 21px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${MUTED}; line-height: 1.35;">13 140 RP · 6,3 días de salario<br>las otras nueve, fuera de tienda</div>
      </div>
    </div>
  </section>`);

// ── 5 · La bóveda: siete meses y ya no se puede comprar ──────────────────
// El remate del bloque de skins, con la skin a lo ancho y casi sin texto.
slides.push(`
  <section data-label="La bóveda" data-screen-label="05 · La bóveda" data-speaker-notes="Pero wachen el detalle. Su skin mas nueva salio en febrero de este ano y ya esta encerrada en la boveda. Siete meses y ya no la puedes comprar." style="${seccion()}">
    ${glow(ACERO, '50% 34%', '118% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${eyebrow('Pero wachen el detalle', ACERO)}

      <div data-pieza style="position: relative; width: 100%; border-radius: 18px; overflow: hidden; border: 1px solid ${ACERO}59;">
        <img src="assets/Katarina_70.jpg" alt="Katarina Pétalos Primaverales" style="width: 100%; height: 430px; object-fit: cover; object-position: center 24%; display: block; filter: saturate(0.6) brightness(0.72);">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,14,17,0.10) 40%, rgba(10,14,17,0.92) 100%);"></div>
        <div data-sello style="position: absolute; top: 18px; right: 18px; background: ${ACERO}; color: ${BG}; font-size: 20px; font-weight: 800; letter-spacing: 2px; border-radius: 8px; padding: 8px 16px;">EN BÓVEDA</div>
        <div style="position: absolute; left: 24px; right: 24px; bottom: 18px; text-align: left;">
          <div style="font-family: ${DISPLAY}; font-size: 62px; line-height: 1; color: ${BONE};">Pétalos Primaverales</div>
          <div style="margin-top: 2px; font-size: 22px; font-weight: 600; color: ${ACERO};">19 de febrero de 2026 · su skin más nueva</div>
        </div>
      </div>

      <div data-meses style="margin-top: 36px;">
        <div style="font-family: ${DISPLAY}; font-size: 168px; line-height: 0.84; color: ${FILO};">7 meses</div>
        <div style="margin-top: 6px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.35;">y ya no la puedes comprar</div>
      </div>
    </div>
  </section>`);

// ── 6 · Cierre ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Cierre" data-screen-label="06 · Cierre" data-speaker-notes="Ni pedo, solo queda decir gigi easy, tirenme un follow o les voy a meter la cuarta, chao." style="${seccion()}">
    ${portada('Katarina_29.jpg', 'Katarina Reina Guerrera', 'center 16%')}
    ${glow(FILO, '50% 42%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${eyebrow('Diecisiete años de la Daga Siniestra')}
      <h2 data-a="up2" style="margin: 0; font-family: ${DISPLAY}; font-size: 124px; font-weight: 400; line-height: 0.9; letter-spacing: 2px; text-transform: uppercase; color: ${BONE};">Feliz cumpleaños,<br><span style="color: ${FILO};">Katarina</span></h2>
      <div style="margin-top: 40px;">${dagas(172)}</div>
      <div data-gigi style="margin-top: 44px; font-family: ${DISPLAY}; font-size: 104px; line-height: 1.0; color: ${ACERO};">GIGI EASY</div>
      <div data-gigi style="margin-top: 8px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };

  function cuentaMil(tl, el, pos, dur) {
    if (!el) return;
    var fin = parseFloat(el.dataset.cuenta), o = { v: 0 };
    tl.to(o, { v: fin, duration: dur || 1.0, ease: 'power2.out', onUpdate: function () {
      el.textContent = String(Math.round(o.v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
    } }, pos || 0);
  }

  // Las dagas siempre entran igual: llegan desde fuera y se cruzan.
  function cruce(tl, s, pos) {
    var d = q(s, '[data-daga]');
    if (!d.length) return;
    tl.from(d[0], { x: -70, rotation: -80, opacity: 0, duration: 0.55, ease: 'back.out(1.6)' }, pos)
      .from(d[1], { x: 70, rotation: 80, opacity: 0, duration: 0.55, ease: 'back.out(1.6)' }, pos + 0.1);
  }

  animar('Portada', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 26, opacity: 0, duration: 0.5 }, 0.08)
      .from(q(s, '[data-linea]'), { y: 52, opacity: 0, duration: 0.78, stagger: 0.13 }, 0.22)
      .from(q(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.64);
    cruce(tl, s, 0.94);
  });

  // La chapa del servidor entra antes que la cifra: primero de dónde es, y
  // después cuántos puntos tiene. Ese es el orden del guion.
  animar('El número uno', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(s.querySelector('[data-servidor]'), { scale: 0.86, opacity: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.38)
      .from(s.querySelector('[data-cifra]'), { y: 28, opacity: 0, duration: 0.55 }, 0.62)
      .from(q(s, '[data-fichas] > div'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.1 }, 1.06);
    cuentaMil(tl, s.querySelector('[data-cuenta]'), 0.64, 0.9);
  });

  // El emblema cae primero y grande; el historial se despliega después, para
  // que el «nunca salió de ahí» llegue cuando ya se vio el Hierro.
  animar('Los rangos', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-emblema]'), { y: -34, scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.14)
      .from(q(s, '[data-rango]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.5)
      .from(q(s, '[data-temporada]'), { y: 24, opacity: 0, duration: 0.42, stagger: 0.09 }, 0.84)
      .from(q(s, '[data-remate] > div'), { y: 24, opacity: 0, duration: 0.45, stagger: 0.09 }, 1.22);
  });

  animar('Las skins', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-a="up2"]'), { y: 30, opacity: 0, duration: 0.6 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 24, scale: 0.95, opacity: 0, duration: 0.42, stagger: 0.055 }, 0.26)
      .from(s.querySelector('[data-precio]'), { y: 24, opacity: 0, duration: 0.5 }, 1.06);
    cuentaMil(tl, s.querySelector('[data-precio] [data-cuenta]'), 1.06, 0.6);
  });

  // La skin entra a color y se apaga al caer el sello: se ve cómo la encierran.
  animar('La bóveda', function (tl, s) {
    tl.from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0)
      .from(s.querySelector('[data-pieza]'), { y: 30, opacity: 0, duration: 0.65 }, 0.16)
      .from(s.querySelector('[data-pieza] img'), { filter: 'saturate(1) brightness(1)', duration: 0.8 }, 0.3)
      .from(s.querySelector('[data-sello]'), { y: -22, rotation: -8, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.72)
      .from(s.querySelector('[data-meses]'), { y: 28, opacity: 0, duration: 0.6 }, 1.0);
  });

  animar('Cierre', function (tl, s) {
    tl.from(s.querySelector('[data-fondo-nitido]'), { scale: 1.05, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="ghost"]'), { scale: 0.88, opacity: 0, duration: 1.1 }, 0)
      .from(s.querySelector('[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.08)
      .from(s.querySelector('h2'), { y: 40, opacity: 0, duration: 0.75 }, 0.22);
    cruce(tl, s, 0.66);
    tl.from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.1 }, 1.08);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Katarina cumple 17 años</title>
${kit.og({ titulo: "Katarina cumple 17 años", descripcion: "Diecisiete años de la Daga Siniestra: el mejor Katarina del planeta es latino, del servidor del sur, y nunca ha salido de Hierro. Apoyo visual para TikTok.", carpeta: "katarina" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(232,54,95,0.45); border-radius: 999px;
    background: rgba(10,14,17,0.85); color: ${FILO}; cursor: pointer;
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
<script src="./gsap.min.js"></script>
${kit.animador()}
${coreografias}
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
