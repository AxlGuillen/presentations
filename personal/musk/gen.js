// Generador de index.html — «Borrar antes de acelerar»: la filosofía de
// iteración de Elon Musk y cómo aplicarla en DRA.
// Ejecutar: node personal/musk/gen.js        (también escribe musk/NOTAS.md)
//
// Publicado en el sitio el 24/10/2026 a pedido de Axl (primero se hizo como deck
// privado). Como el sitio es PÚBLICO, el deck no lleva el dato del sistema de la
// empresa de Diego ni montos de nadie, y los dueños de la lámina 14 van como
// sugerencias por confirmar. Lleva noindex a propósito: se comparte por enlace
// y por la galería, pero no debe salir en buscadores.
//
// Charla para la reunión semanal de DRA (Diego, Rodrigo y Axl), de 15 a 20
// minutos más discusión. Fuente ÚNICA: el informe «Filosofía de iteración de
// Elon Musk» (DRA-PKB/reports/) y su resumen en la wiki
// (wiki/aprendizajes/iteracion-estilo-musk.md). Cada cifra lleva su fuente
// abreviada en letra pequeña, tomada del informe.
//
// Cada lámina es HECHO (con fuente) o PROPUESTA (síntesis para DRA, sin
// decidir): el chip de la cabecera lo dice y las propuestas llevan borde
// punteado índigo. Nada de Musk como héroe o villano: el método y sus costos.
//
// Cuidados (no quitarlos al editar):
//   - NO usar «The best part is no part», «If a schedule is long, it's wrong»
//     ni «Failure is an option here…»: el informe las marca como no
//     verificadas (la tercera solo aparece en fuentes secundarias).
//   - Colossus en 122 días, los ~300 robots de la Giga Press y los $600 → $80
//     de las baterías son AFIRMACIONES de Musk: llevan «según Musk».
//   - El 72–79 % de X es una marca contable de Fidelity, no un precio.
//   - Las lesiones «6 veces» son de Starbase en 2022, no de todo SpaceX.
//   - NASA ($1,600M) fue un CONTRATO por 12 vuelos de carga y Tesla recibió un
//     PRÉSTAMO del DOE ($465M): no se llama «rescate».
//   - El balance de Starship (14 vuelos, 9 éxitos, 5 fallos) sigue la tabla del
//     informe; el vuelo 1 se declaró éxito por su objetivo, y eso va en notas.
const fs = require('fs');
const kit = require('../../tools/kit.cjs');
const L = kit.lineas;

// ── Identidad: la de dra/ (mismo equipo, misma audiencia) ────────────────
const ACC = '#4B3BD6';
const BRIGHT = '#7A6BFF';
const WASH = '#ECEAFF';
const PALE = '#F4F2FF';
const BG = '#FFFFFF';
const SOFT = '#F6F5FB';
const INK = '#1C1A3A';
const MUTED = '#64618A';
const LINE = '#E2E0EE';
const OK = '#00875A';   const OK_WASH = '#E3FCEF';
const BAD = '#DE350B';  const BAD_WASH = '#FFEBE6';
const WARN = '#974F0C'; const WARN_WASH = '#FFF0B3';

const FONT = `'Figtree', 'Segoe UI', ui-sans-serif, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const NUM = 'font-variant-numeric: tabular-nums;';
const SOMBRA = kit.sombra({ tinta: INK, halo: ACC });
const CARD = `background: linear-gradient(180deg, #FFFFFF 0%, #FCFBFF 100%); border: 1px solid ${LINE}; ${SOMBRA}`;
// Una propuesta se reconoce a simple vista: borde punteado índigo y fondo pálido.
const CARD_P = `background: ${PALE}; border: 2px dashed ${kit.alpha(ACC, 0.55)};`;
const FONDO_BLANCO = kit.fondo(BG,
  kit.puntos({ color: kit.alpha(ACC, 0.13) }),
  kit.lavado({ color: WASH, fuerza: 0.7 }));
const puntosClaro = (paso = 30) => kit.puntos({ color: 'rgba(255,255,255,0.13)', paso });
const FONDO_COLOR = (en1 = '88% 10%', en2 = '8% 95%') => kit.fondo(ACC, puntosClaro(),
  kit.lavado({ color: BRIGHT, en: en1, ancho: 85, alto: 75, fuerza: 0.55 }),
  kit.lavado({ color: INK, en: en2, ancho: 70, alto: 60, fuerza: 0.35, alcance: 55 }));

// ── Helpers ──────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fuerte = (t) => `<strong style="font-weight: 700;">${t}</strong>`;
const ceja = (t, color = ACC) => `<span style="font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${color};">${t}</span>`;
const chip = (txt, color = ACC, wash = WASH) =>
  `<span style="font-size: 16px; font-weight: 700; letter-spacing: 0.3px; color: ${color}; background: ${wash}; border-radius: 7px; padding: 4px 11px; white-space: nowrap;">${txt}</span>`;
const pill = (txt, bg = 'rgba(255,255,255,0.16)', color = '#FFFFFF') =>
  `<span style="background: ${bg}; color: ${color}; font-size: 19px; font-weight: 600; border-radius: 999px; padding: 9px 22px; letter-spacing: 0.3px; white-space: nowrap;">${txt}</span>`;
const h2 = (txt, size = 62) =>
  `<h2 data-split style="margin: 0; font-size: ${size}px; font-weight: 800; color: ${INK}; letter-spacing: -1.8px; line-height: 1.06;">${txt}</h2>`;
const cifra = (valor, { pre = '', suf = '', dec = 0, size = 96, color = ACC, extra = '' } = {}) =>
  `<span data-cuenta data-valor="${valor}" data-pre="${pre}" data-suf="${suf}" data-dec="${dec}" style="font-size: ${size}px; font-weight: 800; color: ${color}; letter-spacing: ${Math.round(-size / 14)}px; line-height: 0.95; white-space: nowrap; ${NUM} ${extra}">${pre}${Number(valor).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${suf}</span>`;
const nota = (txt, color = ACC) => `
    <div data-nota style="background: ${color === ACC ? WASH : kit.alpha(color, 0.09)}; border-left: 5px solid ${color}; border-radius: 0 14px 14px 0; padding: 20px 30px; font-size: 27px; font-weight: 400; color: ${INK}; line-height: 1.45; box-shadow: 0 8px 20px rgba(28,26,58,0.08);">${txt}</div>`;
const orbes = (lista) => `
    <div aria-hidden="true" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none;">
      ${lista.map((o) => `<div data-orbe style="position: absolute; ${o}"></div>`).join('\n      ')}
    </div>`;

// HECHO · PROPUESTA · intro: lo primero que se lee de cada lámina.
const TIPOS = {
  hecho: `<span style="display: inline-flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: ${INK}; background: ${SOFT}; border: 1.5px solid ${LINE}; border-radius: 999px; padding: 8px 16px;"><span style="color: ${OK}; font-size: 17px;">✓</span> Hecho · con fuente</span>`,
  propuesta: `<span style="display: inline-flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: ${ACC}; background: ${PALE}; border: 2px dashed ${kit.alpha(ACC, 0.65)}; border-radius: 999px; padding: 7px 16px;"><span style="font-size: 17px;">◇</span> Propuesta para DRA · sin decidir</span>`,
  intro: `<span style="display: inline-flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: ${ACC}; background: ${WASH}; border-radius: 999px; padding: 8px 16px;">Para empezar</span>`,
};
const header = (tipo, etiqueta) => `
    <header style="position: absolute; top: 0; left: 0; right: 0; height: 112px; display: flex; align-items: center; justify-content: space-between; padding: 0 100px; border-bottom: 1px solid ${LINE}; background: rgba(255,255,255,0.74);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 46px; height: 40px; border-radius: 10px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
        <span style="font-size: 20px; font-weight: 600; color: ${INK}; letter-spacing: -0.2px;">Borrar antes de acelerar</span>
      </div>
      <div style="display: flex; align-items: center; gap: 22px;">
        ${TIPOS[tipo]}
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${ACC};">${etiqueta}</span>
      </div>
    </header>`;
const fuente = (txt) => `<div data-fuente style="position: absolute; left: 100px; right: 100px; bottom: 30px; font-size: 15.5px; font-weight: 500; color: ${MUTED}; line-height: 1.35; letter-spacing: 0.1px;">${txt}</div>`;

const slides = [];
const NOTAS = [];

// Una lámina estándar: cabecera, cuerpo y fuente. `notas` son 3–5 líneas.
function lamina({ label, tipo, etiqueta, notas, fuentes, cuerpo }) {
  NOTAS.push({ label, notas });
  slides.push(`
  <section data-label="${label}" data-screen-label="${String(slides.length + 1).padStart(2, '0')} · ${label}" data-speaker-notes="${esc(notas.join(' '))}" style="${FONDO_BLANCO} font-family: ${FONT}; color: ${INK}; display: flex; flex-direction: column; padding: 164px 100px 78px; box-sizing: border-box; overflow: hidden;">
    ${header(tipo, etiqueta)}
    ${cuerpo}
    ${fuente(fuentes)}
  </section>`);
}

// ── 1 · Portada ──────────────────────────────────────────────────────────
// La escalera de los cinco pasos, dibujada solo con líneas (kit.lineas).
const escalera = () => {
  const W = 62, D = 96;
  const cajas = [70, 125, 180, 235, 290].map((h, i) => {
    const c = L.caja([i * W, h / 2, 0], [W, h, D]);
    c.der.achurado = { paso: 9, angulo: 45 };
    return c;
  });
  return L.dibujar(cajas, { camara: { iso: true, giro: 38, altura: 22 }, ancho: 860, alto: 700, margen: 30,
    tinta: '#FFFFFF', grosor: 3.2, fino: 1.6, estilo: 'width:100%;height:100%', titulo: 'Escalera de cinco peldaños' });
};
NOTAS.push({ label: 'Portada', notas: [
  'Hoy no venimos a copiar a Musk: venimos a quedarnos con una sola cosa, el orden en el que hace las cosas.',
  'Vamos a ver el método, de dónde salió, qué le ha funcionado y qué le ha costado, y al final qué nos llevamos nosotros.',
  'Son 15 a 20 minutos y salimos con cuatro decisiones. Anoten dudas para la discusión.',
] });
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="${esc(NOTAS[0].notas.join(' '))}" style="${FONDO_COLOR()} font-family: ${FONT}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 130px; box-sizing: border-box; overflow: hidden;">
    ${orbes([
      'right: -110px; bottom: -170px; width: 640px; height: 640px; border-radius: 50%; background: rgba(255,255,255,0.06);',
      'right: 240px; top: -120px; width: 330px; height: 330px; border-radius: 50%; background: rgba(255,255,255,0.08);',
      'left: -180px; top: 30%; width: 420px; height: 420px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.10);',
    ])}
    <div data-efecto="traza" data-dur="2.6" data-en="0.2" style="position: absolute; right: 70px; bottom: 120px; width: 860px; height: 700px;">${escalera()}</div>
    <div data-a="up" style="display: flex; align-items: center; gap: 16px; position: relative;">
      <span data-sello style="width: 86px; height: 74px; border-radius: 18px; background: #FFFFFF; color: ${ACC}; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; letter-spacing: 0.5px;">DRA</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 30px; font-weight: 700; letter-spacing: -0.3px;">Reunión semanal</span>
        <span style="font-size: 19px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Diego · Rodrigo · Axl</span>
      </div>
    </div>
    <h1 data-split style="margin: 38px 0 0; font-size: 128px; font-weight: 800; letter-spacing: -4.4px; line-height: 1; max-width: 1000px; position: relative;">Borrar antes<br>de acelerar</h1>
    <p data-a="up3" style="margin: 30px 0 0; font-size: 36px; font-weight: 600; color: rgba(255,255,255,0.92); line-height: 1.35; max-width: 1000px; position: relative;">Cómo iterar como Musk<br>(sin quemarnos)</p>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 14px; position: relative;">
      ${pill('Su orden, no su intensidad')}
      ${pill('Hechos con fuente')}
      ${pill('Propuestas para DRA', '#FFFFFF', ACC)}
    </div>
  </section>`);

// ── 2 · La pregunta ──────────────────────────────────────────────────────
const tarj2 = (tipo, titulo, texto, estilo) => `
        <div data-tarjeta style="${estilo} border-radius: 24px; padding: 40px 40px 42px; display: flex; flex-direction: column; gap: 22px;">
          <div>${tipo}</div>
          <span style="font-size: 48px; font-weight: 800; color: ${INK}; letter-spacing: -1.4px; line-height: 1.1;">${titulo}</span>
          <span style="font-size: 30px; color: ${MUTED}; line-height: 1.5;">${texto}</span>
        </div>`;
lamina({
  label: 'La pregunta', tipo: 'intro', etiqueta: 'La pregunta',
  notas: [
    'Musk es polémico, pero su método tiene un orden muy claro y se puede revisar con datos. Eso es lo que nos interesa.',
    'Nosotros no tenemos su dinero ni su tolerancia al riesgo: somos tres, sin capital externo, armando el segundo cerebro y el evaluador de ideas.',
    'Toda la plática cabe en una frase: tomamos el orden, no la intensidad.',
    'Los chips de arriba: gris es lo que dice el informe con su fuente; índigo punteado es propuesta nuestra, todavía sin decidir.',
  ],
  fuentes: 'Informe «Filosofía de iteración de Elon Musk» (DRA-PKB, oct 2026), resumen y conclusión · resumen en wiki/aprendizajes.',
  cuerpo: `
    ${h2('¿Por qué nos importa cómo itera Musk?')}
    <div data-a="up2" style="margin-top: 38px; flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; margin-bottom: 30px;">
      ${tarj2(chip('HECHO', INK, SOFT), 'Un orden, no una receta de velocidad', 'Su «algoritmo» de 5 pasos nació de un error de 2018. Lo útil es la secuencia: cuestionar, borrar, simplificar, acelerar y, al final, automatizar.', CARD)}
      ${tarj2(chip('NUESTRO CONTEXTO', ACC, WASH), 'Somos tres, sin capital externo', 'DRA son tres socios en Morelia, en etapa de concepción. Estamos armando un segundo cerebro y un evaluador de ideas.', CARD)}
      ${tarj2(chip('PROPUESTA', ACC, WASH), 'Tomamos el orden, no la intensidad', 'Iterar rápido donde fallar es barato, reversible y solo nos cuesta a nosotros. Con cero fallos en la operación del cliente.', CARD_P)}
    </div>
    <div data-voto style="display: flex; align-items: center; gap: 22px; margin-bottom: 8px;">
      ${ceja('Hoy salimos con 4 decisiones')}
      <span style="height: 2px; width: 60px; background: ${LINE};"></span>
      ${['Formato de 45 min', 'Tipo «experimento»', 'Entrevistas en noviembre', 'Dueños de la semana'].map((t, i) => `<span data-pildora style="display: inline-flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 700; color: ${INK}; background: #FFFFFF; border: 1.5px solid ${LINE}; border-radius: 999px; padding: 10px 22px 10px 12px;"><span style="width: 30px; height: 30px; border-radius: 50%; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800;">${i + 1}</span>${t}</span>`).join('')}
    </div>`,
});

// ── 3 · El algoritmo ─────────────────────────────────────────────────────
// La escalera: cada peldaño es una tarjeta más alta. Los números llevan
// data-continua: en la lámina 4 viajan a su sitio, pero en el orden inverso.
const PASOS = [
  [1, 'Cuestionar los requisitos', 'Con el nombre de quien los pidió. Nunca «un departamento».'],
  [2, 'Borrar', 'Partes y procesos. Si no regresas al menos 10 %, borraste poco.'],
  [3, 'Simplificar', 'Solo lo que sobrevivió al borrado.'],
  [4, 'Acelerar el ciclo', 'Hasta aquí, y no antes.'],
  [5, 'Automatizar', 'Hasta el final.'],
];
const numero = (n, extra = '') => `<span data-continua="num-${n}" style="flex: none; width: 62px; height: 62px; border-radius: 50%; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; ${extra}">${n}</span>`;
lamina({
  label: 'El algoritmo', tipo: 'hecho', etiqueta: 'El método',
  notas: [
    'Primero cuestionar: cada requisito con el nombre de la persona que lo pidió. Si dice «lo pide Legal» no se puede negociar; si dice «lo pidió Ana», sí.',
    'Después borrar. La regla del 10 %: si al final no regresaste al menos un 10 % de lo que borraste, borraste poco.',
    'Solo entonces simplificar y acelerar, y hasta el final automatizar. Según Musk, optimizar algo que no debería existir es el error más común de un ingeniero listo.',
    'Las citas vienen de transcripciones comunitarias y extractos del libro de Isaacson que coinciden entre sí; no hay transcripción oficial.',
  ],
  fuentes: 'Musk con Tim Dodd (Everyday Astronaut), 30-jul-2021: InsideEVs, Hacker News · Isaacson, «Elon Musk» (2023): Corporate Rebels.',
  cuerpo: `
    ${h2('Cinco pasos, y el orden es lo que importa')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; align-items: end; padding-bottom: 20px;">
      ${PASOS.map(([n, t, d], i) => `
      <div data-peldano style="height: ${350 + i * 44}px; ${CARD} border-radius: 22px; padding: 26px 24px 28px; display: flex; flex-direction: column; gap: 14px; ${n === 5 ? `border: 3px solid ${ACC}; background: linear-gradient(180deg, ${WASH} 0%, #FFFFFF 100%);` : `border-top: 5px solid ${ACC};`}">
        ${numero(n)}
        <span style="font-size: 38px; font-weight: 800; color: ${INK}; letter-spacing: -1px; line-height: 1.1;">${t}</span>
        <span style="font-size: 26px; color: ${MUTED}; line-height: 1.4;">${d}</span>
        ${n === 5 ? `<span style="margin-top: auto;">${ceja('Al final')}</span>` : ''}
      </div>`).join('')}
    </div>
    ${nota(`${fuerte('Dos advertencias de Musk:')} optimizar algo que no debería existir es «possibly the most common error of a smart engineer», y acelerar un proceso equivocado es cavar tu tumba más rápido.`)}`,
});

// ── 4 · De dónde salió ───────────────────────────────────────────────────
// Los mismos cinco números, ahora al revés: así hizo el Model 3.
const AL_REVES = [[5, 'Automatizar'], [4, 'Acelerar'], [3, 'Simplificar'], [2, 'Borrar'], [1, 'Cuestionar']];
lamina({
  label: 'Model 3', tipo: 'hecho', etiqueta: 'El origen',
  notas: [
    'Esto no nació como teoría. En 2018 la línea del Model 3 se automatizó antes de entenderse, y Tesla producía algo más de 2,000 por semana contra una meta de 5,000.',
    'Musk lo admitió: «my mistake», «humans are underrated», y retiró por completo la red de bandas transportadoras.',
    'Su frase: automatizó, aceleró, simplificó y al final borró. Es decir, los cinco pasos al revés.',
    'El algoritmo es una lección aprendida por las malas. Y el paso que más tienta adelantar es el último: automatizar.',
  ],
  fuentes: 'Musk (InsideEVs; CleanTechnica 2021) · tuit del 13-abr-2018 y CBS: GeekWire 2018 · producción: CleanTechnica 2018 · Isaacson vía Corporate Rebels.',
  cuerpo: `
    ${h2('Nació de un error: lo hizo todo al revés')}
    <div data-a="up2" style="margin-top: 26px; ${FONDO_COLOR('85% 8%', '10% 100%')} border-radius: 24px; padding: 30px 42px; color: #FFFFFF; box-shadow: 0 2px 4px rgba(28,26,58,0.14), 0 18px 40px ${kit.alpha(ACC, 0.3)};">
      <span style="font-size: 46px; font-weight: 700; line-height: 1.25; letter-spacing: -0.7px;">«In making Tesla's Model 3, I literally automated, accelerated, simplified and then deleted.»</span>
      <div style="margin-top: 8px; font-size: 19px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.75);">Elon Musk · los cinco pasos, recorridos al revés</div>
    </div>
    <div style="margin-top: 28px; display: flex; align-items: flex-start; justify-content: space-between; padding: 0 40px;">
      ${AL_REVES.map(([n, t], i) => `
      <div style="display: flex; align-items: center; gap: 0;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 230px;">
          ${numero(n)}
          <span data-etiqueta style="font-size: 32px; font-weight: 700; color: ${INK}; letter-spacing: -0.4px; text-align: center;">${t}</span>
        </div>
        ${i < 4 ? `<span data-flecha style="font-size: 40px; font-weight: 700; color: ${kit.alpha(ACC, 0.45)}; margin: -34px 0 0 0;">→</span>` : ''}
      </div>`).join('')}
    </div>
    <div style="margin-top: 34px; flex: 1; display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 24px;">
      <div data-dato style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 14px;">
        ${ceja('Model 3 por semana · 2018')}
        <div style="display: flex; align-items: baseline; gap: 16px;">${cifra(2000, { size: 120 })}<span style="font-size: 27px; color: ${MUTED};">producidos, algo más de</span></div>
        <div style="height: 20px; background: ${SOFT}; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(28,26,58,0.12);"><div data-barra style="width: 40%; height: 100%; border-radius: 6px; background: linear-gradient(90deg, ${ACC}, ${BRIGHT});"></div></div>
        <div style="display: flex; align-items: baseline; justify-content: space-between;"><span style="font-size: 27px; color: ${MUTED};">Meta</span>${cifra(5000, { size: 56, color: MUTED })}</div>
      </div>
      <div data-dato style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${BAD};">
        ${ceja('13 de abril de 2018', BAD)}
        <span style="font-size: 33px; font-weight: 700; line-height: 1.28; color: ${INK};">«Excessive automation at Tesla was a mistake… my mistake»</span>
        <span style="font-size: 29px; color: ${MUTED};">y «humans are underrated».</span>
      </div>
      <div data-dato style="${CARD} border-radius: 22px; padding: 26px 30px; display: flex; flex-direction: column; gap: 12px; border-top: 5px solid ${BAD};">
        ${ceja('En CBS', BAD)}
        <span style="font-size: 33px; font-weight: 700; line-height: 1.28; color: ${INK};">Una «crazy, complex network of conveyor belts» que no funcionaba.</span>
        <span style="font-size: 29px; color: ${MUTED};">La retiraron por completo.</span>
      </div>
    </div>`,
});

// ── 5 · Primeros principios e idiot index ────────────────────────────────
lamina({
  label: 'Primeros principios', tipo: 'hecho', etiqueta: 'La base',
  notas: [
    'Primeros principios: no preguntes cuánto cuesta algo hoy; pregunta de qué está hecho y cuánto cuesta eso.',
    'El ejemplo clásico: las baterías, de unos 600 dólares por kWh a unos 80 sumando los materiales. Ojo: son estimaciones de Musk en 2012, no datos auditados.',
    'El idiot index es el costo total del componente entre el costo de su materia prima. Si el cociente es alto, hay desperdicio escondido.',
    'Se juntan así: los primeros principios dicen dónde está el límite, el índice dice qué piezas están lejos de él y el algoritmo es el camino para cerrar esa distancia.',
  ],
  fuentes: 'Musk con Kevin Rose, 2012: CNBC 2020; Acquisition Talk 2020 · idiot index: Isaacson vía I-Connect007.',
  cuerpo: `
    ${h2('Primeros principios: ¿cuánto cuesta de verdad?')}
    <div data-a="up2" style="margin-top: 28px; flex: 1; display: grid; grid-template-columns: 1.25fr 1fr; gap: 28px;">
      <div data-panel style="${CARD} border-radius: 26px; padding: 30px 38px; display: flex; flex-direction: column; gap: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">${ceja('Las baterías, según Musk · 2012')}${chip('estimación suya, no auditada', WARN, WARN_WASH)}</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: baseline; gap: 14px;">${cifra(600, { pre: '$', size: 100, color: MUTED })}<span style="font-size: 27px; color: ${MUTED}; line-height: 1.25;">por kWh · razonando por analogía:<br>«siempre serán caras»</span></div>
          <div style="height: 34px; background: ${SOFT}; border-radius: 9px; overflow: hidden;"><div data-barra style="width: 100%; height: 100%; background: linear-gradient(90deg, #B9B6D6, #D3D1E6);"></div></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: baseline; gap: 14px;">${cifra(80, { pre: '$', size: 100 })}<span style="font-size: 27px; color: ${INK}; font-weight: 600; line-height: 1.25;">por kWh · sumando los materiales<br>en la London Metal Exchange</span></div>
          <div style="height: 34px; background: ${SOFT}; border-radius: 9px; overflow: hidden;"><div data-barra style="width: 13.3%; height: 100%; border-radius: 9px; background: linear-gradient(90deg, ${ACC}, ${BRIGHT});"></div></div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto;">
          ${['cobalto', 'níquel', 'aluminio', 'carbono', 'polímeros', 'una lata'].map((m) => `<span data-material style="font-size: 26px; font-weight: 600; color: ${ACC}; background: ${WASH}; border-radius: 999px; padding: 10px 24px;">${m}</span>`).join('')}
        </div>
      </div>
      <div data-panel style="${CARD} border-radius: 26px; padding: 34px 38px; display: flex; flex-direction: column; gap: 18px; border-top: 5px solid ${ACC};">
        ${ceja('El «idiot index»')}
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0; margin: 20px 0 4px;">
          <span style="font-size: 40px; font-weight: 800; color: ${INK}; text-align: center; line-height: 1.2; padding: 0 12px 18px;">costo total del componente</span>
          <span data-regla style="height: 5px; width: 100%; background: ${ACC}; border-radius: 3px;"></span>
          <span style="font-size: 40px; font-weight: 800; color: ${INK}; text-align: center; line-height: 1.2; padding: 18px 12px 0;">costo de su materia prima</span>
        </div>
        <span style="font-size: 30px; color: ${MUTED}; line-height: 1.45; margin-top: auto;">Si el cociente es alto, hay desperdicio escondido. En palabras de Musk: «if the ratio is high, you're an idiot».</span>
      </div>
    </div>
    <div style="margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      ${[['Primeros principios', 'fijan el límite'], ['Idiot index', 'señala qué piezas están lejos de él'], ['El algoritmo', 'es el camino para cerrar la distancia']].map(([a, b], i) => `
      <div data-lazo style="display: flex; align-items: center; gap: 16px; background: ${i === 2 ? ACC : WASH}; color: ${i === 2 ? '#FFFFFF' : INK}; border-radius: 16px; padding: 18px 24px;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: -0.5px; white-space: nowrap;">${a}</span><span style="font-size: 25px; line-height: 1.25; opacity: 0.88;">${b}</span>
      </div>`).join('')}
    </div>`,
});

// ── 6 · SpaceX ───────────────────────────────────────────────────────────
// Los 14 vuelos de Starship según la tabla del informe: 2 fallos y 4 éxitos,
// 3 fallos y 2 éxitos, y 3 éxitos (naves) en el Block 3. 9 éxitos y 5 fallos.
const BLOQUES = [
  ['Block 1', 'abr 2023 – nov 2024', [0, 0, 1, 1, 1, 1]],
  ['Block 2', 'ene – oct 2025', [0, 0, 0, 1, 1]],
  ['Block 3', 'may – sep 2026', [1, 1, 1]],
];
let numVuelo = 0;
const punto = (ok, n, extra = '') => `<div style="display: flex; flex-direction: column; align-items: center; gap: 8px;"><span data-vuelo style="width: 52px; height: 52px; border-radius: 50%; background: ${ok ? OK : BAD}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; ${extra}">${ok ? '✓' : '✕'}</span><span style="font-size: 17px; font-weight: 700; color: ${MUTED}; ${NUM}">${n}</span></div>`;
lamina({
  label: 'SpaceX', tipo: 'hecho', etiqueta: 'Caso · SpaceX',
  notas: [
    'Falcon 1 falló tres veces antes de llegar a órbita, en el cuarto vuelo, el 28 de septiembre de 2008. El tercer fallo se arregló con un retraso en la separación: un cambio de procedimiento, no un rediseño. Y el dinero de Musk alcanzaba para más o menos un intento más.',
    'Starship: 14 vuelos, 9 éxitos y 5 fallos en unos tres años y medio, hasta la primera órbita en septiembre de 2026. El conteo sigue la tabla del informe; ojo que SpaceX declaró éxito al vuelo 1 porque su objetivo era despejar la plataforma, así que depende de cómo se defina fallo.',
    'Lo que lo hizo posible: el acero cuesta unos 3 dólares el kilo contra unos 200 de la fibra de carbono ya con el desperdicio, unas 65 veces menos. Prototipos baratos, fallos baratos.',
    'El contraste es la NASA: 4,100 millones de dólares por lanzamiento de SLS proyectados. Cuando cada unidad cuesta eso, fallar no es opción.',
    'La lección no es «falla mucho»: es abarata el fallo hasta que puedas permitirte fallar seguido.',
  ],
  fuentes: 'Falcon 1: GlobalSecurity; Satellite Today 2008 · Starship: Wikipedia (List of Starship launches), NPR/WUNC 2026, Interesting Engineering · acero: Space.com · SLS: NASA OIG (House Science Committee 2022).',
  cuerpo: `
    ${h2('SpaceX convirtió el fallo en un dato con precio')}
    <div data-a="up2" style="margin-top: 28px; flex: 1; display: grid; grid-template-columns: 1fr 590px; gap: 26px;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div data-panel style="${CARD} border-radius: 24px; padding: 24px 34px; display: grid; grid-template-columns: auto 1fr; gap: 34px; align-items: center;">
          <div style="display: flex; gap: 14px; align-items: flex-start;">${punto(0, '2006')}${punto(0, '2007')}${punto(0, '2008')}${punto(1, '28-sep-2008', `box-shadow: 0 0 0 6px ${kit.alpha(OK, 0.2)};`)}</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${ceja('Falcon 1')}
            <span style="font-size: 31px; font-weight: 800; color: ${INK}; letter-spacing: -0.6px; line-height: 1.2;">Tres fallos antes de la órbita</span>
            <span style="font-size: 23px; color: ${MUTED}; line-height: 1.4;">El tercero se arregló con un retraso en la separación: procedimiento, no rediseño. El dinero alcanzaba para un intento más.</span>
          </div>
        </div>
        <div data-panel style="${CARD} border-radius: 24px; padding: 26px 34px; flex: 1; display: flex; flex-direction: column; gap: 18px;">
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            ${ceja('Starship · 3.5 años')}
            <div style="display: flex; gap: 26px; align-items: baseline;">
              <span style="font-size: 25px; color: ${MUTED};">${cifra(14, { size: 56, color: INK })} vuelos</span>
              <span style="font-size: 25px; color: ${MUTED};">${cifra(9, { size: 56, color: OK })} éxitos</span>
              <span style="font-size: 25px; color: ${MUTED};">${cifra(5, { size: 56, color: BAD })} fallos</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex: 1; padding: 0 6px;">
            ${BLOQUES.map(([nom, fecha, vuelos]) => `
            <div data-bloque style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
              <div style="text-align: center;"><span style="font-size: 27px; font-weight: 800; color: ${INK};">${nom}</span><br><span style="font-size: 19px; color: ${MUTED};">${fecha}</span></div>
              <div style="display: flex; gap: 8px; padding: 12px 14px; background: ${SOFT}; border-radius: 16px;">${vuelos.map((ok) => punto(ok, ++numVuelo, numVuelo === 14 ? `box-shadow: 0 0 0 6px ${kit.alpha(OK, 0.25)};` : '').replace('width: 52px; height: 52px', 'width: 44px; height: 44px')).join('')}</div>
            </div>`).join('')}
          </div>
          <span style="font-size: 23px; color: ${MUTED}; line-height: 1.4;">${fuerte('Vuelo 14: primera órbita')}, con 26 Starlink V3. Cada salto de versión reinicia la curva de fallos.</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div data-panel style="${CARD} border-radius: 24px; padding: 26px 30px; flex: 1; display: flex; flex-direction: column; gap: 16px; border-top: 5px solid ${ACC};">
          ${ceja('El material decide cuánto cuesta fallar')}
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: baseline; gap: 12px;">${cifra(3, { pre: '$', suf: '/kg', size: 76 })}<span style="font-size: 26px; font-weight: 700; color: ${INK};">acero inoxidable</span></div>
            <div style="height: 22px; background: ${SOFT}; border-radius: 6px;"><div data-barra style="width: 1.6%; min-width: 12px; height: 100%; border-radius: 6px; background: ${ACC};"></div></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: baseline; gap: 12px;">${cifra(200, { pre: '≈ $', suf: '/kg', size: 76, color: MUTED })}<span style="font-size: 26px; color: ${MUTED};">fibra de carbono</span></div>
            <div style="height: 22px; background: ${SOFT}; border-radius: 6px;"><div data-barra style="width: 100%; height: 100%; border-radius: 6px; background: linear-gradient(90deg, #B9B6D6, #D3D1E6);"></div></div>
          </div>
          <span style="font-size: 22px; color: ${MUTED}; line-height: 1.4;">$135/kg con 35 % de desperdicio. Unas 65 veces más barato por kilo efectivo.</span>
        </div>
        <div data-panel style="${CARD} border-radius: 24px; padding: 22px 30px; display: flex; align-items: center; gap: 22px;">
          <div style="display: flex; flex-direction: column; gap: 2px;">${cifra(4100, { pre: '$', suf: 'M', size: 66, color: BAD })}<span style="font-size: 20px; color: ${MUTED};">por lanzamiento (NASA SLS/Orion)</span></div>
          <span style="font-size: 23px; color: ${INK}; line-height: 1.35; font-weight: 600;">Si cada unidad cuesta miles de millones, fallar no es opción.</span>
        </div>
      </div>
    </div>
    <div style="margin-top: 22px;">${nota(`${fuerte('La lección no es «falla mucho»:')} abarata el fallo hasta que puedas permitirte fallar seguido.`)}</div>`,
});

// ── 7 · Tesla, xAI y X ───────────────────────────────────────────────────
// 70 piezas que se vuelven una: la cuadrícula se pliega y aparece la pieza.
const PIEZAS = Array.from({ length: 70 }, (_, i) => `<span data-pieza style="width: 14px; height: 14px; border-radius: 3px; background: ${BRIGHT};"></span>`).join('');
const cuarto = (etq, color, wash, titulo, cuerpoHtml) => `
      <div data-cuarto style="${CARD} border-radius: 24px; padding: 26px 32px 28px; display: flex; flex-direction: column; gap: 14px; border-top: 5px solid ${color};">
        <div style="display: flex; align-items: center; gap: 14px;">${chip(etq, color, wash)}<span style="font-size: 32px; font-weight: 800; color: ${INK}; letter-spacing: -0.6px;">${titulo}</span></div>
        ${cuerpoHtml}
      </div>`;
lamina({
  label: 'Tesla, xAI y X', tipo: 'hecho', etiqueta: 'Casos · Tesla, xAI y X',
  notas: [
    'Tres empresas de Musk muestran el método en versión buena, rápida, mala y cara.',
    'Giga Press: la parte trasera del Model Y pasó de más de 70 piezas a una sola fundida. No aceleraron el ensamblaje: lo borraron. La cifra de los 300 robots es de Musk.',
    'Colossus: 100 mil GPU en 122 días, también según Musk. El costo apareció afuera, en un conflicto en Memphis por energía e impacto ambiental.',
    'Cybertruck: unas 20 mil vendidas en 2025 contra 250 mil proyectadas, y ese número incluye compras de SpaceX y xAI. Velocidad y audacia de diseño no reemplazan validar con clientes.',
    'X: la plantilla bajó casi 75 % y la plataforma siguió funcionando, pero hubo más caídas y, según Fidelity, el valor cayó entre 72 y 79 %. Es una marca contable, no un precio de mercado, y un exempleado dijo que Spaces ya era inestable antes de los despidos: lo presento como correlación. Lo que dejo en la mesa: borrar sin medir qué se rompe sale caro en un negocio que vive de la confianza.',
  ],
  fuentes: 'Giga Press: Electrek 2021 · Colossus: GPB/NPR 2024, HPCwire 2025 · Cybertruck: Fast Company, TechSpot · X: Boston Globe 2023, Gulf News/Reuters, Fortune 2024 (Fidelity), Business Standard/Reuters.',
  cuerpo: `
    ${h2('Bien, rápido, mal y caro: el mismo método')}
    <div data-a="up2" style="margin-top: 26px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 22px;">
      ${cuarto('BIEN', OK, OK_WASH, 'Giga Press · borrar', `
        <div style="display: flex; align-items: center; gap: 28px; flex: 1;">
          <div data-piezas style="display: grid; grid-template-columns: repeat(14, 14px); gap: 4px; width: 266px; flex: none;">${PIEZAS}</div>
          <span data-una style="font-size: 38px; font-weight: 800; color: ${OK};">→</span>
          <span data-una style="flex: none; width: 92px; height: 92px; border-radius: 12px; background: ${OK};"></span>
          <div style="display: flex; flex-direction: column; gap: 4px;"><span style="font-size: 36px; font-weight: 800; color: ${INK}; ${NUM}">70+ piezas → 1</span><span style="font-size: 23px; color: ${MUTED}; line-height: 1.35;">Según Musk, unos 300 robots menos. No aceleró el ensamblaje: lo borró.</span></div>
        </div>`)}
      ${cuarto('RÁPIDO', ACC, WASH, 'xAI · Colossus', `
        <div style="display: flex; align-items: center; gap: 26px; flex: 1;">
          ${cifra(122, { suf: ' días', size: 84 })}
          <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 26px; font-weight: 700; color: ${INK}; line-height: 1.3;">100,000 GPU, según Musk</span><span style="font-size: 22px; color: ${MUTED}; line-height: 1.35;">El costo apareció afuera: un conflicto en Memphis por energía e impacto ambiental.</span></div>
        </div>`)}
      ${cuarto('MAL', BAD, BAD_WASH, 'Cybertruck · sin validar', `
        <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: center;">
          <div style="display: flex; align-items: baseline; gap: 14px;">${cifra(8, { suf: ' %', size: 96, color: BAD })}<span style="font-size: 25px; color: ${MUTED}; line-height: 1.3;">de lo proyectado</span></div>
          <div style="display: flex; align-items: center; gap: 12px;"><span style="font-size: 21px; color: ${MUTED}; width: 170px; ${NUM}">20,200 en 2025</span><div style="flex: 1; height: 16px; background: ${SOFT}; border-radius: 5px;"><div data-barra style="width: 8%; height: 100%; border-radius: 5px; background: ${BAD};"></div></div></div>
          <div style="display: flex; align-items: center; gap: 12px;"><span style="font-size: 21px; color: ${MUTED}; width: 170px; ${NUM}">250,000 al año</span><div style="flex: 1; height: 16px; background: ${SOFT}; border-radius: 5px;"><div data-barra style="width: 100%; height: 100%; border-radius: 5px; background: #D3D1E6;"></div></div></div>
        </div>`)}
      ${cuarto('CARO', WARN, WARN_WASH, 'X · borrar sin medir', `
        <div style="display: flex; align-items: center; gap: 26px; flex: 1;">
          ${cifra(75, { pre: '−', suf: ' %', size: 84, color: WARN })}
          <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 25px; color: ${INK}; line-height: 1.3; font-weight: 700;">de plantilla: 7,500 → ~2,000</span><span style="font-size: 21px; color: ${MUTED}; line-height: 1.35;">Sexta caída grave del año en marzo de 2023 (3 en el mismo periodo de 2022). Valor de X: −72 % y luego −78.7 %, marca de Fidelity.</span></div>
        </div>`)}
    </div>
    <div style="margin-top: 22px;">${nota(`${fuerte('En un negocio que vive de la confianza del cliente,')} borrar sin medir qué se rompe sale caro.`, WARN)}</div>`,
});

// ── 8 · El lado que no se ve en la foto ──────────────────────────────────
const col8 = (color, etq, big, bigNota, lineas) => `
      <div data-columna style="${CARD} border-radius: 24px; padding: 28px 28px 26px; display: flex; flex-direction: column; gap: 14px; border-top: 5px solid ${color};">
        ${ceja(etq, color)}
        <div style="display: flex; flex-direction: column; gap: 2px;">${big}<span style="font-size: 22px; color: ${MUTED}; line-height: 1.3;">${bigNota}</span></div>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
          ${lineas.map((l) => `<span style="font-size: 24px; color: ${INK}; line-height: 1.38;">${l}</span>`).join('')}
        </div>
      </div>`;
lamina({
  label: 'El lado oscuro', tipo: 'hecho', etiqueta: 'Los costos',
  notas: [
    'Los costos están igual de documentados. Reuters contó al menos 600 lesiones en SpaceX desde 2014; en Starbase, con datos de 2022, 4.8 por cada 100 trabajadores contra 0.8 del promedio de la industria espacial. La serie ganó un Pulitzer.',
    'En producto: 2.03 millones de Tesla llamados a revisión por Autopilot y ocho recalls de la Cybertruck en unos 15 meses.',
    'Y el «Elon time»: en 2015 dijo que los autos autónomos llegaban en tres años; en 2023 se describió como «the boy who cried FSD».',
    'Lo más importante para nosotros: SpaceX sobrevivió a 2008 gracias a un contrato de la NASA, y Tesla a un préstamo del Departamento de Energía. Fallar rápido funciona si alguien paga el siguiente intento, y nosotros no tenemos ese alguien.',
  ],
  fuentes: 'Lesiones: NPR citando a Reuters, 2023 · recalls: S&P Global, NBC News, Insurance Journal 2025 · Elon time: Sherwood News, CNBC · NASA y préstamo DOE: Quartz · Hyperloop One: Verdict.',
  cuerpo: `
    ${h2('Lo que la velocidad le cobra a otros')}
    <div data-a="up2" style="margin-top: 28px; flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;">
      ${col8(BAD, 'Personas', cifra(600, { pre: '≥ ', size: 108, color: BAD }), 'lesiones en SpaceX desde 2014 (Reuters)', [
        `Starbase, 2022: ${fuerte('4.8 por cada 100 trabajadores')}.`,
        `Seis veces el promedio de la industria espacial (0.8).`,
      ])}
      ${col8(BAD, 'Producto', cifra(2.03, { suf: ' M', dec: 2, size: 100, color: BAD }), 'de Tesla llamados a revisión (dic 2023)', [
        'Autopilot: la NHTSA habló de un «débil sistema de monitoreo del conductor».',
        `La Cybertruck: ${fuerte('8 recalls en ~15 meses')}.`,
      ])}
      ${col8(WARN, '«Elon time»', cifra(3, { suf: ' años', size: 100, color: WARN }), 'para los autos autónomos, dijo en 2015', [
        'En 2023 se describió como «the boy who cried FSD».',
        'El Semi: anunciado en 2017 para 2019; primeras entregas a fines de 2022.',
      ])}
      ${col8(ACC, 'Quién pagó el siguiente intento', cifra(1600, { pre: '$', suf: 'M', size: 84, color: ACC }), 'contrato de la NASA por 12 vuelos de carga (dic 2008)', [
        `A Tesla, un ${fuerte('préstamo de $465M')} del Departamento de Energía (ene 2010).`,
        'Hyperloop One cerró en 2023, tras gastar más de $450M sin transportar a nadie.',
      ])}
    </div>
    <div style="margin-top: 22px;">${nota(`${fuerte('Fallar rápido funciona si alguien paga el siguiente intento.')} Y probar en una zona de exclusión no es lo mismo que usar a la gente como banco de pruebas.`)}</div>`,
});

// ── 9 · Qué SÍ y qué NO ──────────────────────────────────────────────────
const PARES = [
  ['Iterar rápido donde fallar es barato, reversible y solo nos cuesta a nosotros', 'Fallar en la operación de la pyme cliente: ahí el presupuesto de fallos es cero'],
  ['El orden: cuestionar, borrar, simplificar, acelerar y al final automatizar', 'La intensidad: la urgencia convertida en culto al sobreesfuerzo'],
  ['Entrevistas y concierge antes que software', 'Prometer fechas al estilo «Elon time»: vivimos de recomendaciones'],
  ['Borrar con registro y la regla del 10 %', 'Borrar sin medir qué se rompe'],
  ['Un tope de 4 horas y 2 semanas por experimento', 'Contar con que alguien más pague el siguiente intento'],
];
lamina({
  label: 'Sí y no', tipo: 'propuesta', etiqueta: 'Qué nos llevamos',
  notas: [
    'Esta es la lámina más importante: qué nos llevamos y qué no. Se revela por pares con la flecha.',
    'Lo que nos llevamos: el orden, los requisitos con nombre, los prototipos baratos, el concierge y el tope de tiempo.',
    'Lo que no: la intensidad, las fechas al estilo Elon time y fallar donde el cliente lo paga.',
    'La regla de oro: en DRA fallar es aceptable; en la operación de la pyme, el presupuesto de fallos es cero. Es la diferencia entre Starship en zona de exclusión y FSD en la vía pública.',
    'Todo esto es síntesis propia a partir del informe, no una decisión todavía.',
  ],
  fuentes: 'Síntesis propia sobre el informe (secciones 4 a 6). Aún no es decisión del equipo.',
  cuerpo: `
    ${h2('Qué sí y qué no nos llevamos')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto repeat(5, 1fr); gap: 16px 28px;">
      <div style="display: flex; align-items: center; gap: 14px;"><span style="width: 50px; height: 50px; border-radius: 14px; background: ${OK}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800;">✓</span><span style="font-size: 36px; font-weight: 800; color: ${OK}; letter-spacing: -0.8px;">Sí nos llevamos</span></div>
      <div style="display: flex; align-items: center; gap: 14px;"><span style="width: 50px; height: 50px; border-radius: 14px; background: ${BAD}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800;">✕</span><span style="font-size: 36px; font-weight: 800; color: ${BAD}; letter-spacing: -0.8px;">No nos llevamos</span></div>
      ${PARES.map(([si, no], i) => `
      <div data-step="${i + 1}" style="${CARD_P} border-radius: 18px; border-left: 6px solid ${OK}; border-style: solid dashed dashed solid; padding: 0 28px; display: flex; align-items: center; background: ${OK_WASH};"><span style="font-size: 30px; font-weight: 700; color: ${INK}; line-height: 1.3; letter-spacing: -0.4px;">${si}</span></div>
      <div data-step="${i + 1}" style="${CARD_P} border-radius: 18px; border-left: 6px solid ${BAD}; border-style: solid dashed dashed solid; padding: 0 28px; display: flex; align-items: center; background: ${BAD_WASH};"><span style="font-size: 30px; font-weight: 700; color: ${INK}; line-height: 1.3; letter-spacing: -0.4px;">${no}</span></div>`).join('')}
    </div>`,
});

// ── 10 · El algoritmo traducido a DRA ────────────────────────────────────
const FILAS10 = [
  ['Requisitos con nombre', 'Cada rubro del evaluador y cada función llevan «pedido por». Sin nombre, van a una lista de «requisitos sin dueño».'],
  ['Borrar, con registro', 'Anotamos qué quitamos y si lo regresamos. Si nunca restauramos nada, borramos poco.'],
  ['Concierge antes que software', 'Primero a mano, varias veces, con un cliente real. Se automatiza solo lo que dolió.'],
  ['La entrevista es nuestro «prototipo de acero»', 'Casi gratis, rápida y sin riesgo para nadie. Le da al evaluador el dolor en pesos y la disposición a pagar.'],
  ['«Idiot index» de mercado', 'Precio de la competencia ÷ costo directo de DRA (tokens, hosting, horas). Adaptación nuestra: ninguna fuente lo aplica a software.'],
];
lamina({
  label: 'Traducido a DRA', tipo: 'propuesta', etiqueta: 'Para DRA',
  notas: [
    'Así se vería el algoritmo en DRA. Todo es propuesta nuestra, todavía sin decidir.',
    'Requisitos con nombre: un campo «pedido por» en cada rubro del evaluador y cada función. Sin nombre, a la lista de requisitos sin dueño.',
    'Borrar con registro. El ejemplo de Tesla: de 64 a 12 clics al quitar páginas legales que ninguna ley exigía, según Jon McNeill, expresidente de Tesla.',
    'Concierge antes que software, y la entrevista como nuestro prototipo de acero: casi gratis y sin riesgo para nadie.',
    'El idiot index de mercado es una adaptación nuestra; lo usaríamos con el costo real de cada prototipo y de cada piloto.',
  ],
  fuentes: 'Síntesis propia sobre el informe (sección 5) · 64 → 12 clics: Jon McNeill, «The Algorithm» (2026), vía Boston Globe, 24-mar-2026 · concierge: Paul Graham, «Do Things That Don\'t Scale».',
  cuerpo: `
    ${h2('El algoritmo, traducido a DRA')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 1fr 520px; gap: 28px;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${FILAS10.map(([t, d], i) => `
        <div data-fila style="${CARD_P} border-radius: 20px; padding: 0 28px; flex: 1; display: grid; grid-template-columns: 54px 1fr; gap: 22px; align-items: center;">
          <span style="width: 54px; height: 54px; border-radius: 15px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">${i + 1}</span>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 33px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.15;">${t}</span>
            <span style="font-size: 23.5px; color: ${MUTED}; line-height: 1.36;">${d}</span>
          </div>
        </div>`).join('')}
      </div>
      <div data-panel style="${CARD} border-radius: 26px; padding: 34px 36px; display: flex; flex-direction: column; gap: 14px; border-top: 5px solid ${ACC};">
        <div style="display: flex; justify-content: space-between; align-items: center;">${ceja('Borrar en acción · Tesla')}${chip('HECHO', INK, SOFT)}</div>
        <div style="display: flex; align-items: baseline; gap: 14px; margin-top: 12px;">
          ${cifra(64, { size: 150, color: MUTED })}
          <span style="font-size: 70px; font-weight: 800; color: ${ACC};">→</span>
          ${cifra(12, { size: 150 })}
        </div>
        <span style="font-size: 34px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.15;">clics para comprar un Tesla en línea</span>
        <span style="font-size: 25px; color: ${MUTED}; line-height: 1.45;">La mayor parte del recorte fue quitar páginas de texto legal que ninguna ley exigía: las pusieron «abogados corporativos bienintencionados durante décadas».</span>
        <span style="margin-top: auto; font-size: 20px; color: ${MUTED}; line-height: 1.4;">Jon McNeill, expresidente de Tesla, en su libro «The Algorithm» (2026).</span>
      </div>
    </div>`,
});

// ── 11 · Plan ────────────────────────────────────────────────────────────
const FASES = [
  ['Esta semana', '26 – 30 oct', ['Segundo cerebro mínimo usable; nada más en dos semanas', 'Evaluador v0: 5 o 6 rubros, cada uno con su nombre', '5 a 7 preguntas tipo Mom Test para dueños de pymes', 'Notas «requisitos sin dueño» y «borrados»'], 'Probamos el formato de 45 minutos'],
  ['Noviembre', 'Aprender sin construir', ['5 a 8 entrevistas sin vender', '«Cliente misterioso»: cotizaciones a 10–20 negocios de Morelia, midiendo cuánto tardan en responder'], '3 dueños describen un dolor con número y aceptan un diagnóstico gratis'],
  ['Diciembre', 'Concierge', ['1 o 2 diagnósticos: seguir cotización → pedido → factura → cobro, cronometrado', '1 o 2 pilotos: reporte semanal de 3 a 5 KPIs, a mano o con Claude, en paralelo a su operación'], 'El cliente usa el reporte cada semana y una métrica cambia'],
  ['Enero', 'Primer cobro', ['Proponer un precio, aunque sea con descuento de fundador', 'Automatizar solo lo que más horas costó', 'Primera «betting table» de 6 semanas'], 'Un cliente paga, o documentamos por qué ninguno lo hizo'],
];
lamina({
  label: 'Plan', tipo: 'propuesta', etiqueta: 'El plan',
  notas: [
    'Es el algoritmo a escala de empresa: noviembre cuestiona con datos de campo, diciembre borra y simplifica, enero acelera y solo al final automatiza.',
    'Se respeta la decisión vigente de hacer primero el segundo cerebro y el evaluador. Lo que cambia es que el evaluador se alimenta con datos de campo desde noviembre.',
    'Las metas numéricas son heurísticas sin calibración externa: las ajustamos con nuestros propios datos.',
    'Lo que más tienta es el último paso: no construir login, roles, facturación ni app móvil hasta que un cliente con nombre y apellido los pida.',
  ],
  fuentes: 'Síntesis propia sobre el informe (sección 6). Las metas numéricas son heurísticas sin calibración externa; se ajustan con datos propios.',
  cuerpo: `
    ${h2('Plan propuesto: de esta semana a enero')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;">
      <div data-ruta style="position: absolute; left: 24px; right: 24px; top: 21px; height: 4px; background: ${kit.alpha(ACC, 0.25)}; border-radius: 2px;"><div data-ruta-viva style="height: 100%; width: 100%; background: linear-gradient(90deg, ${ACC}, ${BRIGHT}); border-radius: 2px;"></div></div>
      ${FASES.map(([t, sub, items, paso], i) => `
      <div data-fase style="position: relative; padding-top: 52px; display: flex; flex-direction: column;">
        <span data-hito style="position: absolute; left: 14px; top: 8px; width: 30px; height: 30px; border-radius: 50%; background: ${i === 0 ? ACC : '#FFFFFF'}; border: 4px solid ${ACC}; box-sizing: border-box;"></span>
        <div style="${CARD_P} border-radius: 22px; padding: 26px 26px 24px; flex: 1; display: flex; flex-direction: column; gap: 12px;">
          <div><span style="font-size: 40px; font-weight: 800; color: ${INK}; letter-spacing: -1px;">${t}</span><br><span style="font-size: 19px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${ACC};">${sub}</span></div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${items.map((x) => `<span style="font-size: 24px; color: ${INK}; line-height: 1.36; padding-left: 22px; position: relative;"><span style="position: absolute; left: 0; top: 0; color: ${ACC}; font-weight: 800;">•</span>${x}</span>`).join('')}
          </div>
          <div style="margin-top: auto; background: #FFFFFF; border-radius: 14px; padding: 14px 16px; border-left: 5px solid ${OK};">
            <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: ${OK};">Pasamos si</span><br>
            <span style="font-size: 22px; font-weight: 600; color: ${INK}; line-height: 1.32;">${paso}</span>
          </div>
        </div>
      </div>`).join('')}
    </div>`,
});

// ── 12 · Qué posponemos ──────────────────────────────────────────────────
const BORRAR = [
  ['SAT y facturación · pasarela de pago', 'Hasta que un cliente piloto lo pida. Es un requisito sin dueño, y el riesgo fiscal sería del cliente.'],
  ['Decidir el stack', 'Un piloto concierge no lo necesita. Hoy es propuesta, no decisión.'],
  ['El «sistema genérico» como primer entregable', 'Mejor: diagnóstico más reporte semanal. La Giga Press elimina pasos, no los acelera.'],
  ['Ideas secundarias', 'Dinámicas para cafeterías y restaurantes → pausada. Visualización de piezas CNC → semilla, sin trabajo activo.'],
  ['Evaluador: recortar a 5 o 6 rubros', 'La interfaz «estilo Tinder» queda como opcional. Nombre y logo: tarea mínima.'],
];
lamina({
  label: 'Qué posponemos', tipo: 'propuesta', etiqueta: 'Qué borramos',
  notas: [
    'Borrar también es una tarea. Esto es lo que proponemos sacar de la mesa por ahora.',
    'SAT y pasarela: son requisitos sin dueño y, si fallan, el cliente carga con el riesgo fiscal.',
    'El stack hoy es propuesta, no decisión; un piloto concierge no lo necesita.',
    'Si dentro de un mes no restauramos nada de lo que borramos, probablemente borramos poco: eso es la regla del 10 %.',
  ],
  fuentes: 'Síntesis propia sobre el informe (sección 6, «Qué borrar o posponer ahora»).',
  cuerpo: `
    ${h2('Lo que borramos o dejamos para después')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 1fr 470px; gap: 28px;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${BORRAR.map(([t, d], i) => `
        <div data-borrar style="${CARD_P} border-radius: 20px; padding: 0 30px; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 5px;">
          <div style="position: relative; align-self: flex-start;"><span style="font-size: 34px; font-weight: 800; color: ${INK}; letter-spacing: -0.7px; line-height: 1.15;">${t}</span><span data-tachon style="position: absolute; left: -4px; right: -4px; top: 52%; height: 4px; background: ${BAD}; border-radius: 2px; transform-origin: 0 50%;"></span></div>
          <span style="font-size: 24px; color: ${MUTED}; line-height: 1.36;">${d}</span>
        </div>`).join('')}
      </div>
      <div data-panel style="${FONDO_COLOR('85% 8%', '10% 100%')} border-radius: 26px; padding: 38px 36px; display: flex; flex-direction: column; color: #FFFFFF; box-shadow: 0 2px 4px rgba(28,26,58,0.14), 0 18px 40px ${kit.alpha(ACC, 0.3)};">
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: rgba(255,255,255,0.75);">La regla del 10 %</span>
        <span data-cuenta data-valor="10" data-suf=" %" data-pre="" data-dec="0" style="font-size: 168px; font-weight: 800; letter-spacing: -7px; line-height: 1; margin-top: 10px; white-space: nowrap; ${NUM}">10 %</span>
        <span style="font-size: 31px; font-weight: 600; line-height: 1.35; margin-top: 8px;">Si no regresa al menos eso de lo que borramos, borramos poco.</span>
        <div style="flex: 1;"></div>
        <span style="font-size: 23px; color: rgba(255,255,255,0.88); line-height: 1.5;">Por eso llevamos una nota de «borrados»: qué se quitó y si volvió.</span>
      </div>
    </div>`,
});

// ── 13 · Cómo registramos los experimentos ───────────────────────────────
const PLANTILLA = [
  ['tipo', 'experimento'],
  ['estado', 'abierto | cerrado'],
  ['hipotesis', '"Los dueños de pymes industriales tardan más de 2 horas en cotizar"'],
  ['metrica', '"minutos de respuesta a una cotización"'],
  ['linea_base', ''],
  ['resultado', ''],
  ['decision', 'perseverar | pivotar | descartar'],
  ['dueno', '"[[diego]]"'],
  ['fecha_cierre', '# máximo 2 semanas'],
  ['costo_horas', '# tope: 4 horas-socio'],
];
lamina({
  label: 'Experimentos', tipo: 'propuesta', etiqueta: 'El registro',
  notas: [
    'La forma más barata de volver medible la iteración es tratar cada experimento como una nota con hipótesis, métrica, resultado y decisión.',
    'Los topes: unas 4 horas-socio y máximo 2 semanas; después se cierra o se decide. Además, un tope mensual de gasto en APIs y hosting.',
    'Si más del 70 u 80 % de los experimentos sale bien, estamos probando cosas demasiado seguras. Aquí el fallo cuesta horas, no cohetes.',
    'Para que exista el tipo «experimento» hay que aprobarlo en AGENTS.md; mientras tanto los experimentos viven en wiki/aprendizajes.',
    'La nota de borrados, con dos columnas, mide la regla del 10 % cada mes.',
  ],
  fuentes: 'Síntesis propia sobre el informe (sección 6) · validated learning: The Lean Startup · circuit breaker: Shape Up (Basecamp).',
  cuerpo: `
    ${h2('Cada experimento, una nota con tope y decisión')}
    <div data-a="up2" style="margin-top: 30px; flex: 1; display: grid; grid-template-columns: 850px 1fr; gap: 28px;">
      <div data-plantilla style="background: ${INK}; border-radius: 24px; padding: 28px 34px; display: flex; flex-direction: column; box-shadow: 0 2px 4px rgba(28,26,58,0.14), 0 18px 40px ${kit.alpha(INK, 0.3)};">
        <div style="display: flex; gap: 8px; margin-bottom: 14px; align-items: center;"><span style="width: 13px; height: 13px; border-radius: 50%; background: #FF5F57;"></span><span style="width: 13px; height: 13px; border-radius: 50%; background: #FEBC2E;"></span><span style="width: 13px; height: 13px; border-radius: 50%; background: #28C840;"></span><span style="margin-left: 14px; font-family: ${MONO}; font-size: 17px; color: rgba(255,255,255,0.55);">_plantillas/experimento.md</span></div>
        <div style="font-family: ${MONO}; font-size: 25px; line-height: 1.62; color: #E6E4FF; display: flex; flex-direction: column;">
          <span data-linea-c style="color: rgba(255,255,255,0.45);">---</span>
          ${PLANTILLA.map(([k, v]) => `<span data-linea-c><span style="color: #9F95FF;">${k}:</span> <span style="color: ${v.startsWith('#') ? 'rgba(255,255,255,0.45)' : '#FFE08A'};">${v.replace(/</g, '&lt;')}</span></span>`).join('')}
          <span data-linea-c style="color: rgba(255,255,255,0.45);">---</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div data-regla-c style="${CARD_P} border-radius: 22px; padding: 24px 30px; display: flex; flex-direction: column; gap: 10px;">
          ${ceja('Presupuesto de fallos')}
          <div style="display: flex; gap: 34px; align-items: baseline; flex-wrap: wrap;">
            <span style="font-size: 26px; color: ${INK};">${cifra(4, { suf: ' h', size: 72 })} por socio</span>
            <span style="font-size: 26px; color: ${INK};">${cifra(2, { suf: ' sem', size: 72 })} máximo</span>
          </div>
          <span style="font-size: 23px; color: ${MUTED}; line-height: 1.4;">Más un tope mensual de gasto en APIs y hosting.</span>
        </div>
        <div data-regla-c style="${CARD_P} border-radius: 22px; padding: 24px 30px; display: flex; flex-direction: column; gap: 8px;">
          ${ceja('Señal de alarma')}
          <span style="font-size: 29px; font-weight: 700; color: ${INK}; line-height: 1.3;">Si más del 70–80 % «sale bien», probamos cosas demasiado seguras.</span>
          <span style="font-size: 23px; color: ${MUTED}; line-height: 1.4;">Aquí el fallo cuesta horas, no cohetes.</span>
        </div>
        <div data-regla-c style="${CARD_P} border-radius: 22px; padding: 24px 30px; display: flex; flex-direction: column; gap: 8px;">
          ${ceja('Nota de «borrados»')}
          <span style="font-size: 26px; color: ${INK}; line-height: 1.38;">Dos columnas: qué se quitó y si volvió. Cada mes mide la regla del 10 %.</span>
        </div>
        <div data-regla-c style="background: ${WARN_WASH}; border-radius: 16px; padding: 16px 24px; border-left: 5px solid ${WARN};"><span style="font-size: 23px; color: ${INK}; line-height: 1.4;">${fuerte('Requiere un voto:')} el tipo «experimento» no existe todavía en el vault. Mientras tanto, viven en <span style="font-family: ${MONO}; font-size: 18px;">wiki/aprendizajes/</span>.</span></div>
      </div>
    </div>`,
});

// ── 14 · Decisiones ──────────────────────────────────────────────────────
const AGENDA = [['Métricas', 5], ['Experimentos', 15], ['Qué borrar', 10], ['Qué probar', 10], ['Tareas', 5]];
const TAREAS = [
  ['Segundo cerebro mínimo usable', '@axl'],
  ['Evaluador v0 con 5 o 6 rubros', '@rodrigo (por confirmar)'],
  ['5 a 7 preguntas tipo Mom Test', '@diego'],
  ['Notas «sin dueño» y «borrados»', '@axl'],
  ['Probar el formato de 45 minutos', 'los tres'],
];
const voto = (n, q, extra = '') => `
        <div data-voto-c data-step="${n}" style="${CARD_P} border-radius: 22px; padding: 22px 30px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: grid; grid-template-columns: 52px 1fr; gap: 20px; align-items: center;">
            <span style="width: 52px; height: 52px; border-radius: 15px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">${'abcd'[n - 1]}</span>
            <span style="font-size: 35px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px; line-height: 1.2;">${q}</span>
          </div>
          ${extra}
        </div>`;
lamina({
  label: 'Decisiones', tipo: 'propuesta', etiqueta: 'Hoy votamos',
  notas: [
    'Cuatro votos. Se van revelando con la flecha.',
    'a) El formato de 45 minutos: 5 de métricas, 15 de experimentos, 10 de qué borrar, 10 de qué probar y 5 de tareas.',
    'b) El tipo «experimento» en el vault. c) Las entrevistas en noviembre.',
    'd) Los dueños de esta semana. Lo del informe son sugerencias; lo de Rodrigo está por confirmar.',
    'Para cerrar: tomamos el orden, no la intensidad.',
  ],
  fuentes: 'Propuestas del informe (sección 6). Los dueños de las tareas son sugerencias por confirmar; nada de esto es decisión hasta que los tres lo acuerden.',
  cuerpo: `
    ${h2('Cuatro decisiones para hoy')}
    <div data-a="up2" style="margin-top: 28px; flex: 1; display: grid; grid-template-columns: 1fr 840px; gap: 26px;">
      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${voto(1, '¿Adoptamos el formato de reunión de 45 minutos?', `
          <div style="display: flex; height: 38px; border-radius: 10px; overflow: hidden; gap: 3px;">
            ${AGENDA.map(([t, m], i) => `<span data-min style="flex: ${m}; background: ${i === 1 ? ACC : kit.alpha(ACC, 0.18 + i * 0.1)}; color: ${i === 1 ? '#FFFFFF' : INK}; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; white-space: nowrap;">${m}′</span>`).join('')}
          </div>
          <span style="font-size: 20px; color: ${MUTED};">${AGENDA.map(([t, m]) => `${t} ${m}′`).join(' · ')}</span>`)}
        ${voto(2, '¿Aprobamos el tipo «experimento» en el vault?', `<span style="font-size: 24px; color: ${MUTED}; line-height: 1.4; padding-left: 72px;">Mientras tanto, los experimentos viven en wiki/aprendizajes.</span>`)}
        ${voto(3, '¿Arrancamos las entrevistas en noviembre?', `<span style="font-size: 24px; color: ${MUTED}; line-height: 1.4; padding-left: 72px;">5 a 8 entrevistas sin vender y cotizaciones de «cliente misterioso» a 10–20 negocios.</span>`)}
      </div>
      <div data-voto-c data-step="4" style="${CARD_P} border-radius: 22px; padding: 26px 32px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: grid; grid-template-columns: 52px 1fr; gap: 20px; align-items: center;">
          <span style="width: 52px; height: 52px; border-radius: 15px; background: ${ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;">d</span>
          <span style="font-size: 35px; font-weight: 800; color: ${INK}; letter-spacing: -0.8px; line-height: 1.2;">¿Quién es dueño de cada tarea de esta semana?</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
          ${TAREAS.map(([t, d]) => `
          <div data-tarea style="background: #FFFFFF; border-radius: 14px; padding: 0 22px; flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 18px; border: 1px solid ${LINE};">
            <span style="font-size: 26px; font-weight: 600; color: ${INK}; line-height: 1.25;">${t}</span>
            <span style="font-size: 23px; font-weight: 800; color: ${ACC}; white-space: nowrap;">${d}</span>
          </div>`).join('')}
        </div>
        <span style="font-size: 19px; color: ${MUTED};">Dueños sugeridos por el informe, por confirmar. Semana del 26 al 30 de octubre.</span>
      </div>
    </div>`,
});

// ── Coreografía ──────────────────────────────────────────────────────────
// La de dra/ (titulares partidos en palabras con entrada 3D, tarjetas que
// caen, contadores y barras) más lo propio: la escalera que se dibuja y cuyos
// números viajan al revés (continua), los 14 vuelos que se encienden uno a
// uno, las 70 piezas que se vuelven una, el tachón de lo que se borra y la ruta
// del plan. Todo con tl.from(); sin Math.random.
const coreografias = `<script>
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
      n.textContent.split(/(\\s+)/).forEach(function (parte) {
        if (!parte) return;
        if (/^\\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
        var s = document.createElement('span');
        s.textContent = parte;
        s.style.display = 'inline-block';
        frag.appendChild(s);
        salida.push(s);
      });
      el.replaceChild(frag, n);
    });
    el.dataset.partido = '1';
    return salida;
  }
  function titular(tl, el, pos) {
    if (!el) return;
    var ps = el.dataset.partido ? el.querySelectorAll('span') : partir(el);
    if (ps.length) tl.from(ps, { y: 40, opacity: 0, rotationX: -55, transformPerspective: 900,
      transformOrigin: '50% 100%', duration: 0.7, stagger: 0.045, ease: 'power3.out' }, pos || 0);
  }
  var caer = { y: 40, opacity: 0, rotationX: -24, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 0.6 };
  function contar(tl, el, pos) {
    var fin = parseFloat(el.dataset.valor), dec = parseInt(el.dataset.dec || '0', 10);
    var pre = el.dataset.pre || '', suf = el.dataset.suf || '', o = { v: 0 };
    tl.to(o, { v: fin, duration: 1.1, ease: 'power2.out', onUpdate: function () {
      el.textContent = pre + o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    } }, pos);
  }
  function cuentas(tl, s, pos) { Array.prototype.forEach.call(Q(s, '[data-cuenta]'), function (el) { contar(tl, el, pos); }); }
  function barras(tl, s, pos) { tl.from(Q(s, '[data-barra]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power2.out', stagger: 0.08 }, pos); }
  function conNota(tl, s, pos) { var n = q(s, '[data-nota]'); if (n) tl.from(n, { y: 22, opacity: 0, duration: 0.55 }, pos); }
  function estandar(tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 20, opacity: 0, duration: 0.55 }, 0.2);
  }

  // Portada: la escalera se traza (receta declarada) y el resto entra en cascada.
  animar('Portada', function (tl, s) {
    if (window.efectosDeclarados) window.efectosDeclarados(tl, s);
    tl.from(Q(s, '[data-orbe]'), { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 0);
    tl.from(q(s, '[data-sello]'), { scale: 0, rotation: -90, duration: 0.7, ease: 'back.out(1.7)' }, 0.1)
      .from(q(s, '[data-a="up"] div'), { x: -22, opacity: 0, duration: 0.55 }, 0.25);
    titular(tl, q(s, 'h1'), 0.3);
    tl.from(q(s, 'p'), { y: 22, opacity: 0, duration: 0.55 }, 0.75)
      .from(Q(s, 'div[data-a="up3"] span'), { y: 18, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.06 }, 0.9);
  });

  animar('La pregunta', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-tarjeta]'), Object.assign({ stagger: 0.12 }, caer), 0.35)
      .from(Q(s, '[data-pildora]'), { y: 16, opacity: 0, scale: 0.94, duration: 0.4, stagger: 0.08 }, 1.0);
  });

  // La escalera sube peldaño a peldaño; su lámina siguiente la voltea.
  animar('El algoritmo', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { opacity: 0, duration: 0.3 }, 0.1)
      .from(Q(s, '[data-peldano]'), { y: 120, opacity: 0, duration: 0.55, stagger: 0.18, ease: 'power3.out' }, 0.25);
    conNota(tl, s, 1.4);
  });

  // Los números viajan solos (data-continua) a su lugar al revés.
  animar('Model 3', function (tl, s) {
    if (window.efectosDeclarados) window.efectosDeclarados(tl, s);
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"]'), { y: 24, opacity: 0, duration: 0.55 }, 0.2)
      .from(Q(s, '[data-etiqueta]'), { y: 12, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.6)
      .from(Q(s, '[data-flecha]'), { x: -14, opacity: 0, duration: 0.35, stagger: 0.1 }, 0.7)
      .from(Q(s, '[data-dato]'), Object.assign({ stagger: 0.1 }, caer), 0.9);
    cuentas(tl, s, 1.0);
    barras(tl, s, 1.0);
  });

  animar('Primeros principios', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-panel]'), Object.assign({ stagger: 0.12 }, caer), 0.3)
      .from(Q(s, '[data-material]'), { y: 10, opacity: 0, scale: 0.92, duration: 0.3, stagger: 0.05 }, 0.9)
      .from(q(s, '[data-regla]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, ease: 'power2.out' }, 0.8)
      .from(Q(s, '[data-lazo]'), { x: -24, opacity: 0, duration: 0.4, stagger: 0.12 }, 1.3);
    cuentas(tl, s, 0.45);
    barras(tl, s, 0.5);
  });

  animar('SpaceX', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-panel]'), Object.assign({ stagger: 0.1 }, caer), 0.3)
      .from(Q(s, '[data-vuelo]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(2.4)', stagger: 0.07 }, 0.6)
      .from(Q(s, '[data-bloque]'), { y: 16, opacity: 0, duration: 0.4, stagger: 0.15 }, 0.55);
    cuentas(tl, s, 0.5);
    barras(tl, s, 0.7);
    conNota(tl, s, 1.6);
  });

  // 70 piezas: aparecen, se pliegan hacia el centro y queda la pieza única.
  animar('Tesla, xAI y X', function (tl, s) {
    estandar(tl, s);
    var cuartos = Q(s, '[data-cuarto]');
    tl.from(cuartos, Object.assign({ stagger: 0.12 }, caer), 0.3);
    var piezas = Q(s, '[data-pieza]');
    tl.from(piezas, { scale: 0, opacity: 0, duration: 0.25, stagger: { each: 0.008, from: 'start' } }, 0.6)
      .to(piezas, { opacity: 0.18, duration: 0.6, ease: 'power2.inOut' }, 1.5)
      .from(Q(s, '[data-una]'), { scale: 0.3, opacity: 0, transformOrigin: '50% 50%', duration: 0.55, stagger: 0.1, ease: 'back.out(1.8)' }, 1.5);
    cuentas(tl, s, 0.7);
    barras(tl, s, 0.9);
    conNota(tl, s, 1.7);
  });

  animar('El lado oscuro', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-columna]'), Object.assign({ stagger: 0.12 }, caer), 0.3);
    cuentas(tl, s, 0.6);
    conNota(tl, s, 1.3);
  });

  // La tabla se revela por pares con la navegación (data-step).
  animar('Sí y no', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(q(s, '[data-a="up2"] > div:nth-child(1)'), { x: -30, opacity: 0, duration: 0.5 }, 0.2)
      .from(q(s, '[data-a="up2"] > div:nth-child(2)'), { x: 30, opacity: 0, duration: 0.5 }, 0.2);
  });

  animar('Traducido a DRA', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-fila]'), { x: -40, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.3)
      .from(q(s, '[data-panel]'), { x: 50, opacity: 0, rotationY: 14, transformPerspective: 1100, transformOrigin: '100% 50%', duration: 0.7 }, 0.45);
    cuentas(tl, s, 0.8);
  });

  // La ruta se dibuja de izquierda a derecha y cada fase cae en su hito.
  animar('Plan', function (tl, s) {
    estandar(tl, s);
    tl.from(q(s, '[data-ruta-viva]'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power2.inOut' }, 0.3)
      .from(Q(s, '[data-hito]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.4)', stagger: 0.3 }, 0.35)
      .from(Q(s, '[data-fase] > div'), Object.assign({ stagger: 0.3 }, caer), 0.45);
  });

  // Lo que se posterga se tacha, uno por uno.
  animar('Qué posponemos', function (tl, s) {
    estandar(tl, s);
    tl.from(Q(s, '[data-borrar]'), { x: -36, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.3)
      .from(q(s, '[data-panel]'), { x: 50, opacity: 0, rotationY: 14, transformPerspective: 1100, transformOrigin: '100% 50%', duration: 0.7 }, 0.4)
      .from(Q(s, '[data-tachon]'), { scaleX: 0, duration: 0.4, ease: 'power2.inOut', stagger: 0.18 }, 1.0);
    cuentas(tl, s, 0.7);
  });

  animar('Experimentos', function (tl, s) {
    estandar(tl, s);
    tl.from(q(s, '[data-plantilla]'), { x: -40, opacity: 0, duration: 0.55 }, 0.25)
      .from(Q(s, '[data-linea-c]'), { x: -12, opacity: 0, duration: 0.25, stagger: 0.08 }, 0.55)
      .from(Q(s, '[data-regla-c]'), Object.assign({ stagger: 0.12 }, caer), 0.45);
    cuentas(tl, s, 0.8);
  });

  // Las cuatro decisiones llevan data-step: las revela la navegación.
  animar('Decisiones', function (tl, s) {
    titular(tl, q(s, 'h2'), 0);
    tl.from(Q(s, '[data-min]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.4, stagger: 0.07 }, 0.4)
      .from(Q(s, '[data-tarea]'), { x: 30, opacity: 0, duration: 0.35, stagger: 0.07 }, 0.5);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Borrar antes de acelerar · DRA</title>
${kit.og({ titulo: 'Borrar antes de acelerar · DRA', descripcion: 'Cómo iterar como Musk sin quemarnos: su algoritmo de cinco pasos, lo que le funcionó, lo que le costó y qué se lleva DRA.', carpeta: 'personal/musk' })}
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${ACC}; }
  /* Las entradas las orquesta GSAP; nada se oculta en CSS a propósito:
     sin JS el deck se ve completo y la impresión a PDF funciona. */
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,255,255,0.35); border-radius: 999px;
    background: ${kit.alpha(INK, 0.85)}; color: #FFFFFF; cursor: pointer;
    font: 600 13px/1 ${FONT}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
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
${kit.gsap(__dirname, ['DrawSVG'])}
${kit.efectos()}
${kit.animador()}
${kit.reproductor({ src: 'video.mp4', etiqueta: 'Reproducir', tecla: 'v', acento: ACC })}
${coreografias}
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
// Las notas del orador, para tenerlas a la mano (el deck solo las expone por
// postMessage): un renglón por línea, lámina por lámina.
fs.writeFileSync(__dirname + '/NOTAS.md', `# Notas del orador · Borrar antes de acelerar\n\nNotas locales (este archivo no se sube al repo). 14 láminas, 15 a 20 minutos más discusión.\n\n${NOTAS.map((n, i) => `## ${i + 1} · ${n.label}\n\n${n.notas.map((x) => `- ${x}`).join('\n')}\n`).join('\n')}`, 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
