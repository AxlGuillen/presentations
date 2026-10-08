// Generador de index.html — Parche 26.20 (screenshots para TikTok)
// Ejecutar: node parche2620/gen.js
//
// Primer deck de la serie de **parches**: apoyo visual para el video de las
// notas de la versión 26.20, la de Worlds. Encargo: **recortes del sitio
// oficial** que enseñen los cambios que narra el guion, así que lo que
// estructura cada lámina no es un dato reescrito sino la captura de
// leagueoflegends.com/es-mx, dentro de un marco con la dirección arriba.
//
// Los recortes salen de la página oficial con Chrome a 600 px de ancho y
// deviceScaleFactor 2 (para que el texto aguante la escala de 1080), cada uno
// del bloque exacto del campeón u objeto. **El único añadido es el resaltado
// amarillo**, que se inyecta en el DOM antes de capturar y va sobre el valor
// nuevo o la frase que la voz cita; el resto es la página tal cual. El script
// de captura era temporal (`tools/_parche.mjs`) y no se guardó: si hay que
// rehacer un recorte, el patrón es elemento → union de rects (incluidos los
// descendientes, porque el retrato del campeón va posicionado aparte) → clip.
//
// ⚠️ **Todo lo que narra el guion está verificado contra las notas**, número
// por número. La cita de Yunara en la página es «hiperescalado sin hacer
// nada» (el guion dice «hyperscaler»): en pantalla va la textual.
// ⚠️ Lo de Lucian «le quitaron la pasiva y se la pasaron a la Q» es del parche
// anterior y no sale en estas notas; lo que sí sale es la justificación de
// Riot («terminó debilitando el carril inferior»), y eso es lo que se resalta.
// ⚠️ Las skins HEARTSTEEL salen **el 7 de octubre** según la página; el guion
// dice «mañana» porque se graba el 6. En pantalla va la fecha.
// ⚠️ Lo de Lee Sin SKT T1 son **chromas** («Lanzaremos los siguientes chromas
// en esta versión»), no una skin nueva. El recorte es la imagen del chroma.
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG, animador y carga diferida

// ── Paleta: la página de Riot y un marcatextos ───────────────────────────
// El fondo de los bloques de las notas es `#0A1428` (muestreado del recorte):
// el marco va de ese color para que el recorte no se vea pegado. El acento es
// el **amarillo del resaltado** que lleva cada captura; verde y rojo solo dicen
// buff o nerf.
const BG = '#060C1A';        // la noche detrás de la página
const PAGINA = '#0A1428';    // el fondo de las notas oficiales
const MARCA = '#FFD640';     // marcatextos — acento
const BUFF = '#3FD68A';
const NERF = '#FF5468';
const BONE = '#EEF2F8';
const MUTED = '#8090A8';

const DISPLAY = `'Bebas Neue', Impact, sans-serif`;
const BODY = `'Barlow', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

const SAFE = 'padding: 300px 84px 350px;';

const seccion = () =>
  `background: ${BG}; font-family: ${BODY}; color: ${BONE}; display: flex; flex-direction: column; justify-content: center; ${SAFE} box-sizing: border-box; overflow: hidden; align-items: center; text-align: center;`;

const glow = (color = MARCA, pos = '50% 40%', size = '110% 55%') =>
  `<div data-a="ghost" style="position: absolute; inset: 0; background: radial-gradient(${size} at ${pos}, ${color}1F 0%, rgba(0,0,0,0) 65%); pointer-events: none;"></div>`;

const c = (txt, color) => `<span style="color: ${color};">${txt}</span>`;

const chip = (txt, color) =>
  `<div data-a="up" style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 18px; padding: 10px 22px; border-radius: 999px; background: ${color}1F; border: 1px solid ${color}99;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: ${color};"></span>
      <span style="font-size: 25px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${color};">${txt}</span>
    </div>`;

const titulo = (txt, size = 120) =>
  `<h2 data-titulo style="margin: 0 0 28px; font-family: ${DISPLAY}; font-size: ${size}px; font-weight: 400; line-height: 0.9; letter-spacing: 1px; text-transform: uppercase; color: ${BONE};">${txt}</h2>`;

// Un recorte de la página. `etiqueta` es el nombre del campeón cuando van
// varios en el mismo marco.
const rec = (nombre, alt, etiqueta = '', color = BUFF) => `
        ${etiqueta ? `<div data-etiqueta style="padding: 8px 26px 0; text-align: left; font-family: ${DISPLAY}; font-size: 40px; line-height: 1; color: ${color};">${etiqueta}</div>` : ''}
        <img data-recorte src="assets/recortes/${nombre}.png" alt="${alt}" style="width: 100%; height: auto; display: block;">`;

// El marco: la barra con la dirección y los recortes apilados sin hueco.
const marco = (contenido) => `
      <div data-marco style="width: 100%; border-radius: 18px; overflow: hidden; background: ${PAGINA}; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 30px 80px rgba(0,0,0,0.55); text-align: left;">
        <div style="display: flex; align-items: center; gap: 10px; padding: 14px 20px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.08);">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${NERF}B3;"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${MARCA}B3;"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${BUFF}B3;"></span>
          <span style="margin-left: 10px; font-family: ${MONO}; font-size: 19px; color: ${MUTED};">leagueoflegends.com · notas 26.20</span>
        </div>
        ${contenido}
      </div>`;

const remate = (txt) =>
  `<p data-remate style="margin: 30px 0 0; font-size: 34px; font-weight: 600; color: ${BONE}; line-height: 1.3;">${txt}</p>`;

// Lámina de cambio: chip, nombre, marco con recortes y una línea de remate.
const cambio = ({ label, screen, notas, tipo, nombre, size = 130, recortes, pie = '' }) => {
  const color = tipo === 'nerf' ? NERF : BUFF;
  return `
  <section data-label="${label}" data-screen-label="${screen}" data-speaker-notes="${notas}" style="${seccion()}">
    ${glow(color, '50% 40%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip(tipo === 'nerf' ? 'Nerf' : 'Buff', color)}
      ${titulo(nombre, size)}
      ${marco(recortes)}
      ${pie ? remate(pie) : ''}
    </div>
  </section>`;
};

const slides = [];

// ── 1 · Portada ──────────────────────────────────────────────────────────
// La infografía oficial de «Versión en breve» hace de portada.
slides.push(`
  <section data-label="Portada" data-screen-label="01 · Portada" data-speaker-notes="Hoy tenemos nuevo parche en el juegito de mierda, el veintiseis punto veinte, y este es mi parche porque le metieron buff a dos de los campeones que mas juego. Lo que no entiendo es por que putas buffearon a Lucian." style="${seccion()}">
    ${glow(MARCA, '50% 30%', '120% 50%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Notas oficiales · 6 oct 2026', MARCA)}
      <h1 style="margin: 0; font-family: ${DISPLAY}; font-size: 190px; font-weight: 400; line-height: 0.84; letter-spacing: 2px; color: ${BONE};"><span data-linea style="display: block;">PARCHE</span><span data-linea style="display: block; color: ${MARCA};">26.20</span></h1>
      <div data-infografia style="margin-top: 40px; width: 100%; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 30px 80px rgba(0,0,0,0.55);">
        <img src="assets/breve.jpg" alt="Infografía oficial de la versión 26.20: nerfs, mejoras, sistemas y aspectos nuevos" style="width: 100%; height: auto; display: block;">
      </div>
      <p data-sub style="margin: 36px 0 0; font-size: 38px; font-weight: 600; color: ${BONE}; line-height: 1.3;">Buff a dos de mis mains.<br>${c('Y a Lucian. ¿Por qué?', NERF)}</p>
    </div>
  </section>`);

// ── 2 · Worlds ───────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Worlds" data-screen-label="02 · El parche del mundial" data-speaker-notes="Y antes que nada, este si es el parche del mundial. Todo Worlds se va a jugar aqui, asi que lo que vean en el torneo sale de estas notas." style="${seccion()}">
    ${glow(MARCA, '50% 45%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Antes que nada', MARCA)}
      ${titulo('El parche<br>' + c('del mundial', MARCA), 150)}
      ${marco(rec('worlds', 'Introducción de las notas: es la versión de Worlds'))}
      ${remate('Lo que vean en el torneo<br>sale de estas notas')}
    </div>
  </section>`);

// ── 3 · Smolder ──────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Smolder', screen: '03 · Buff · Smolder',
  notas: 'Ahora si lo mio. Buffearon a Smolder, le subieron el dano de la pasiva y la curacion de la ulti, que en nivel tres pasa de ciento setenta a doscientos cincuenta. Y Riot dice textual que perdio poder en los ultimos parches. Gracias, porque el viernes les dije que iba dos y siete con el.',
  tipo: 'buff', nombre: 'Smolder',
  recortes: rec('smolder-cita', 'Smolder: Riot dice que ha perdido bastante poder en las últimas versiones') + rec('smolder-r', 'Smolder R: autocuración 100/135/170 a 100/175/250'),
  pie: `La ulti cura ${c('170 → 250', MARCA)} en nivel 3.<br>Y más daño en la pasiva.`,
}));

// ── 4 · Mordekaiser ──────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Mordekaiser', screen: '04 · Buff · Mordekaiser',
  notas: 'Y buffearon a Mordekaiser. La ulti baja de ciento cuarenta a ciento veinte segundos de enfriamiento en nivel uno y la Q pega mas en late. Y que cachorrito me pone este buffeo porque yo ya le compre los eternos, aunque como en todo hay partidas buenas y malas. Luego les enseno como me violento un Fizz top con ignite y extenuar, pero esos traumas son para otro video.',
  tipo: 'buff', nombre: 'Mordekaiser',
  recortes: rec('morde', 'Mordekaiser: la razón de Riot') + rec('morde-r', 'Mordekaiser R: enfriamiento 140/120/100 a 120/110/100') + rec('morde-q', 'Mordekaiser Q: progresión del nivel 10 al 20 de +5 a +7'),
  pie: `Ulti: ${c('140 → 120 s', MARCA)} en nivel 1`,
}));

// ── 5 · Lucian ───────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Lucian', screen: '05 · Buff · Lucian, mi queja',
  notas: 'Pero ahora mi queja. Buffearon a Lucian, que es de los que mas me revientan. Y la razon esta en el overview pasado. Les conte que le quitaron la pasiva y se la pasaron a la Q para equilibrar el de mid con el de bot. Pues Riot ahora admite que ese cambio le salio como nerf al Lucian de bot, asi que le suben el dano por nivel para compensarlo. O sea que lo arreglaron y lo descompusieron en dos parches.',
  tipo: 'buff', nombre: '¿Por qué ' + c('Lucian', NERF) + '?', size: 120,
  recortes: rec('lucian', 'Lucian: el ajuste de la versión pasada terminó debilitando el carril inferior; daño de ataque por nivel de 2.5 a 2.9'),
  pie: `Lo arreglaron y lo descompusieron<br>${c('en dos parches', MARCA)}`,
}));

// ── 6 · Vayne ────────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Vayne', screen: '06 · Buff · Vayne',
  notas: 'Y de pilon buffearon a Vayne, la otra psicopata que se hace invisible y carrea sola en late. Le dejaron la Q en treinta de mana fijo y le dieron mas regeneracion para que aguante en linea.',
  tipo: 'buff', nombre: 'Vayne',
  recortes: rec('vayne', 'Vayne: la razón de Riot') + rec('vayne-base', 'Vayne: vida cada 5 de 4 + 0.5 a 5.5 + 0.4 por nivel') + rec('vayne-q', 'Vayne Q: costo de maná fijo en 30'),
  pie: `La Q, ${c('30 de maná fijo', MARCA)}`,
}));

// ── 7 · Swain ────────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Swain', screen: '07 · Buff · Swain',
  notas: 'Y a Swain, que le hice el cumpleanos el sabado, le llego buff tres dias despues. Le subieron el dano de la W y le bajaron el enfriamiento.',
  tipo: 'buff', nombre: 'Swain',
  recortes: rec('swain', 'Swain: la razón de Riot') + rec('swain-w', 'Swain W: más daño y menos enfriamiento'),
  pie: `Le hice el cumpleaños el sábado.<br>${c('Buff tres días después.', MARCA)}`,
}));

// ── 8 · Buffs rápidos (1) ────────────────────────────────────────────────
slides.push(cambio({
  label: 'Rapidito 1', screen: '08 · Buffs rápidos · Diana, Kennen, Kindred',
  notas: 'Y rapidito los demas buffeos. A Diana le subieron el escudo de la W para que la build de bruiser sirva. A Kennen mas velocidad de ataque en la E. A Kindred mas dano contra monstruos y la ralentizacion de la E dura mas.',
  tipo: 'buff', nombre: 'Rapidito', size: 110,
  recortes: rec('diana', 'Diana W: escudo de 11% a 14%', 'Diana') + rec('kennen', 'Kennen E: más velocidad de ataque', 'Kennen') + rec('kindred', 'Kindred: más daño contra monstruos y ralentización de 1 a 1.5 s', 'Kindred'),
}));

// ── 9 · Buffs rápidos (2) ────────────────────────────────────────────────
slides.push(cambio({
  label: 'Rapidito 2', screen: '09 · Buffs rápidos · Lillia, Neeko, Tahm Kench',
  notas: 'A Lillia la ulti dura mas en niveles altos. A Neeko le subieron el dano y el enraizamiento de la E. Y a Tahm Kench le duplicaron la curacion de la Q.',
  tipo: 'buff', nombre: 'Rapidito', size: 110,
  recortes: rec('lillia', 'Lillia R: dura más en niveles altos', 'Lillia') + rec('neeko', 'Neeko E: más daño y enraizamiento', 'Neeko') + rec('tahm', 'Tahm Kench Q: curación de 25 a 50 al máximo', 'Tahm Kench'),
  pie: `A Tahm Kench, ${c('la curación al doble', MARCA)}`,
}));

// ── 10 · Nerfs ───────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Nerfs', screen: '10 · Nerfs · pensando en el profesional',
  notas: 'De nerfeos, casi todo es pensando en el profesional. A Ambessa le bajaron el dano de la pasiva. A Ashe el dano por nivel. A Cassiopeia vida y mana base para que no domine tanto en linea. A K\'Sante le subieron el costo de la W y le bajaron la reduccion de dano.',
  tipo: 'nerf', nombre: 'Pensando en el pro', size: 84,
  recortes: rec('ambessa', 'Ambessa pasiva: menos daño', 'Ambessa', NERF) + rec('ashe', 'Ashe: daño de ataque por nivel de 3.5 a 3', 'Ashe', NERF) + rec('cassio', 'Cassiopeia: menos vida y maná base', 'Cassiopeia', NERF) + rec('ksante', "K'Sante W: más costo y menos reducción de daño", "K'Sante", NERF),
}));

// ── 11 · Yunara ──────────────────────────────────────────────────────────
slides.push(cambio({
  label: 'Yunara', screen: '11 · Nerf · Yunara',
  notas: 'Y a Yunara le bajaron el dano de la Q y la ralentizacion de la W ya no se acumula con otras. Y lo de Yunara esta buenisimo, porque Riot escribio que era la principal candidata a hyperscaler que no hace nada. Asi, con esas palabras.',
  tipo: 'nerf', nombre: 'Yunara',
  recortes: rec('yunara-cita', 'Yunara: la principal candidata para el hiperescalado sin hacer nada') + rec('yunara-cambios', 'Yunara: menos daño en la Q y la ralentización de la W ya no se acumula'),
  pie: `Riot, textual: ${c('«hiperescalado<br>sin hacer nada»', MARCA)}`,
}));

// ── 12 · Objetos ─────────────────────────────────────────────────────────
slides.push(`
  <section data-label="Objetos" data-screen-label="12 · Objetos · Cinturón Cohete" data-speaker-notes="En objetos el cambio fuerte es el Rocketbelt. Le quitaron la mitad de la celeridad pero ahora el activo pega mas. Riot dice que la gente lo usaba para huir y lo quiere para entrar. Y tambien nerfearon el Hexplate en los de rango y el Huracan de Runaan." style="${seccion()}">
    ${glow(MARCA, '50% 40%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Objetos', MARCA)}
      ${titulo('Para entrar,<br>' + c('no para huir', MARCA), 120)}
      ${marco(rec('cinturon', 'Cinturón Cohete Hextech: aceleración de habilidad de 20 a 10 y más daño de activa'))}
      <div data-tambien style="margin-top: 26px; width: 100%;">
        <div style="font-size: 23px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${NERF}; margin-bottom: 14px;">Y también nerf a</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div data-item style="border-radius: 14px; overflow: hidden; background: ${PAGINA}; border: 1px solid ${NERF}59;"><img src="assets/recortes/placa-h.png" alt="Placa Hexperimental" style="width: 100%; height: auto; display: block;"></div>
          <div data-item style="border-radius: 14px; overflow: hidden; background: ${PAGINA}; border: 1px solid ${NERF}59;"><img src="assets/recortes/runaan-h.png" alt="Huracán de Runaan" style="width: 100%; height: auto; display: block;"></div>
        </div>
      </div>
    </div>
  </section>`);

// ── 13 · Repeticiones ────────────────────────────────────────────────────
slides.push(`
  <section data-label="Repeticiones" data-screen-label="13 · Repeticiones privadas" data-speaker-notes="Y aqui viene el cambio mas grande que nadie esta viendo. Desde este parche solo vas a poder ver las repeticiones de tus propias partidas. Nadie mas puede bajar las tuyas y las paginas externas se quedan sin acceso. Riot dice que es para frenar a los que hacian programas de trampas con esos datos." style="${seccion()}">
    ${glow(MARCA, '50% 45%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Lo que nadie está viendo', MARCA)}
      ${titulo('Repeticiones<br>' + c('privadas', MARCA), 150)}
      ${marco(rec('repeticiones', 'Repeticiones privadas: solo podrán acceder a las repeticiones de las partidas que hayan jugado'))}
      ${remate('Para frenar a los que hacían trampas<br>con esos datos')}
    </div>
  </section>`);

// ── 14 · El marcador ─────────────────────────────────────────────────────
slides.push(`
  <section data-label="Marcador" data-screen-label="14 · El marcador" data-speaker-notes="Ah y ya no vas a ver en el marcador los numeros de casi ningun objeto, nomas los de las lagrimas y el Mejai." style="${seccion()}">
    ${glow(MARCA, '50% 45%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Ah, y', MARCA)}
      ${titulo('Adiós a los números<br>' + c('del marcador', MARCA), 120)}
      ${marco(rec('marcador', 'Limpieza del tablero de puntuaciones: se ocultan los números de casi todos los objetos'))}
      ${remate('Nomás quedan las lágrimas y el Mejai')}
    </div>
  </section>`);

// ── 15 · HEARTSTEEL ──────────────────────────────────────────────────────
const hs = [['sett', 'Sett'], ['ezreal', 'Ezreal'], ['kayn', 'Kayn'], ['aphelios', 'Aphelios'], ['yone', 'Yone'], ['ksante', "K'Sante"]];
slides.push(`
  <section data-label="HEARTSTEEL" data-screen-label="15 · Skins HEARTSTEEL" data-speaker-notes="Y salen skins manana, la linea HEARTSTEEL con Sett, Ezreal, Kayn, Aphelios, Yone y K'Sante." style="${seccion()}">
    ${glow(MARCA, '50% 45%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Salen el 7 de octubre', MARCA)}
      ${titulo('HEARTSTEEL', 140)}
      <div data-rejilla style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${hs.map(([f, n]) => `
        <div data-skin style="border-radius: 14px; overflow: hidden; background: ${PAGINA}; border: 1px solid rgba(255,255,255,0.14);"><img src="assets/recortes/hs-${f}.jpg" alt="${n} HEARTSTEEL Live My Life" style="width: 100%; height: auto; display: block;"></div>`).join('')}
      </div>
    </div>
  </section>`);

// ── 16 · Lee Sin SKT T1 ──────────────────────────────────────────────────
slides.push(`
  <section data-label="Lee Sin" data-screen-label="16 · Chromas de Lee Sin SKT T1" data-speaker-notes="Pero lo que a mi me gusto es otra cosa. Sacaron cromas de la skin de SKT T1 de Lee Sin, y justo ayer les hable de Josedeodo y de su Lee Sin. El universo me esta dando la razon." style="${seccion()}">
    ${glow(MARCA, '50% 42%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      ${chip('Lo que a mí me gustó', MARCA)}
      ${titulo('Cromas de<br>' + c('Lee Sin SKT T1', MARCA), 130)}
      <div data-marco style="border-radius: 18px; overflow: hidden; background: ${PAGINA}; border: 1px solid ${MARCA}80; box-shadow: 0 0 90px ${MARCA}26;">
        <img src="assets/leesin-skt.png" alt="Chroma Élite de Lee Sin SKT T1" style="height: 640px; width: auto; display: block;">
      </div>
      ${remate('Y ayer les hablé de Josedeodo.<br>' + c('El universo me da la razón.', MARCA))}
    </div>
  </section>`);

// ── 17 · Cierre ──────────────────────────────────────────────────────────
// Los dos mains del buff, uno arriba del otro.
slides.push(`
  <section data-label="Cierre" data-screen-label="17 · Cierre" data-speaker-notes="Y quien este buffeando a mis counters que vaya y chingue a su puta madre. Ni pedo solo queda decir gigi easy tirenme un follow o les voy a meter la cuarta chao." style="${seccion()}">
    ${glow(MARCA, '50% 45%', '120% 55%')}
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div data-mains style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <img src="assets/Smolder_0.jpg" alt="Smolder" style="width: 100%; height: 520px; object-fit: cover; object-position: 50% 30%; border-radius: 18px; border: 2px solid ${BUFF}99; box-sizing: border-box; display: block;">
        <img src="assets/Mordekaiser_0.jpg" alt="Mordekaiser" style="width: 100%; height: 520px; object-fit: cover; object-position: 62% 30%; border-radius: 18px; border: 2px solid ${BUFF}99; box-sizing: border-box; display: block;">
      </div>
      <p data-sub style="margin: 30px 0 0; font-size: 32px; font-weight: 600; color: ${MUTED}; line-height: 1.3;">Mis mains, buffeados.<br>Mis counters, también.</p>
      <div data-gigi style="margin-top: 40px; font-family: ${DISPLAY}; font-size: 150px; line-height: 0.9; color: ${MARCA};">GIGI EASY</div>
      <div data-gigi style="margin-top: 12px; font-size: 30px; font-weight: 500; color: ${MUTED}; line-height: 1.4;">Tírenme un follow o les voy a meter la cuarta. Chao.</div>
    </div>
  </section>`);

// ── Coreografías GSAP ────────────────────────────────────────────────────
// Todas igual a propósito: el chip, el título, el marco entra y los recortes
// caen uno tras otro, como si se fueran pegando.
const coreografias = `<script>
(function () {
  if (!window.animar) return;
  var q = function (s, sel) { return s.querySelectorAll(sel); };
  var uno = function (s, sel) { return s.querySelector(sel); };

  animar('Portada', function (tl, s) {
    tl.from(q(s, '[data-a="ghost"]'), { scale: 0.86, opacity: 0, duration: 1.0 }, 0)
      .from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.5 }, 0.05)
      .from(q(s, '[data-linea]'), { y: 52, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.18)
      .from(uno(s, '[data-infografia]'), { y: 40, opacity: 0, duration: 0.7 }, 0.62)
      .from(uno(s, '[data-sub]'), { y: 22, opacity: 0, duration: 0.5 }, 1.1);
  });

  function cambio(tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.45 }, 0)
      .from(uno(s, '[data-titulo]'), { y: 30, opacity: 0, duration: 0.55 }, 0.1)
      .from(uno(s, '[data-marco]'), { y: 40, opacity: 0, duration: 0.6 }, 0.34);
    var piezas = q(s, '[data-marco] [data-recorte], [data-marco] [data-etiqueta]');
    if (piezas.length > 1) tl.from(piezas, { y: 18, opacity: 0, duration: 0.4, stagger: 0.12 }, 0.6);
    if (uno(s, '[data-tambien]')) tl.from(q(s, '[data-item]'), { y: 20, opacity: 0, duration: 0.4, stagger: 0.12 }, 1.0);
    if (uno(s, '[data-remate]')) tl.from(uno(s, '[data-remate]'), { y: 20, opacity: 0, duration: 0.45 }, 1.2);
  }
  ['Worlds', 'Smolder', 'Mordekaiser', 'Lucian', 'Vayne', 'Swain', 'Rapidito 1', 'Rapidito 2', 'Nerfs', 'Yunara', 'Objetos', 'Repeticiones', 'Marcador', 'Lee Sin'].forEach(function (l) { animar(l, cambio); });

  animar('HEARTSTEEL', function (tl, s) {
    tl.from(uno(s, '[data-a="up"]'), { y: 24, opacity: 0, duration: 0.45 }, 0)
      .from(uno(s, '[data-titulo]'), { y: 30, opacity: 0, duration: 0.55 }, 0.1)
      .from(q(s, '[data-skin]'), { y: 26, scale: 0.95, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.34);
  });

  animar('Cierre', function (tl, s) {
    tl.from(q(s, '[data-mains] img'), { y: 40, opacity: 0, duration: 0.6, stagger: 0.14 }, 0)
      .from(uno(s, '[data-sub]'), { y: 20, opacity: 0, duration: 0.45 }, 0.6)
      .from(q(s, '[data-gigi]'), { y: 26, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.9);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Parche 26.20</title>
${kit.og({ titulo: "Parche 26.20", descripcion: "El parche de Worlds en recortes de las notas oficiales: buff a Smolder, Mordekaiser y, no se sabe por qué, Lucian. Apoyo visual para TikTok.", carpeta: "parche2620" })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(255,214,64,0.45); border-radius: 999px;
    background: rgba(6,12,26,0.85); color: ${MARCA}; cursor: pointer;
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

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
