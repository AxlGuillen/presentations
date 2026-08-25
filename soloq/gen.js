// Generador de index.html — Presentación vertical SoloQ Challenge 2026
// Ejecutar: node gen.js
const fs = require('fs');
const kit = require('../tools/kit.cjs'); // metas OG (y demás helpers de build-time)

// ── Datos ────────────────────────────────────────────────────────────────
// Tipos de cambio (open.er-api.com, 20/ago/2026) y salario mínimo diario:
// MX: dato oficial diario CONASAMI · CL/CO/AR: mensual ÷ 30
const PAISES = [
  { id: 'mx', nombre: 'México',    wageDia: 315.04,    tc: 19.814561,   moneda: 'MXN', flag: ['#006847', '#FFFFFF', '#CE1126'], dir: 'v' },
  { id: 'cl', nombre: 'Chile',     wageDia: 18451.77,  tc: 1077.981828, moneda: 'CLP', flag: ['#FFFFFF', '#D52B1E'], dir: 'h', canton: '#0039A6' },
  { id: 'co', nombre: 'Colombia',  wageDia: 58363.50,  tc: 3561.610396, moneda: 'COP', flag: ['#FCD116', '#FCD116', '#003893', '#CE1126'], dir: 'h' },
  { id: 'ar', nombre: 'Argentina', wageDia: 12553.33,  tc: 1749.094981, moneda: 'ARS', flag: ['#74ACDF', '#FFFFFF', '#74ACDF'], dir: 'h' },
];

const JUGADORES = [
  { n: 'JavierLoL', total: 32000, foto: 'JavierLoL.png', premios: [
    ['1º clasificación general · High Elo', 30000, 'torneo', ''],
    ['Mejor MID · High Elo', 1000, 'torneo', ''],
    ['Villano del Evento', 1000, 'kick', 'Más Blue Shells recibidas'] ] },
  { n: 'sol1xd', total: 16000, foto: 'sol1xd.png', premios: [
    ['2º clasificación general · High Elo', 15000, 'torneo', ''],
    ['David vs Goliath', 1000, 'kick', 'Más victorias contra el Top 5 vigente'] ] },
  { n: 'AlimentaChino', total: 13000, foto: 'AlimentaChino.png', premios: [
    ['1º clasificación general · Low Elo', 12500, 'torneo', ''],
    ['Mejor TOP · Low Elo', 500, 'torneo', ''] ] },
  { n: 'EkkoTheNeeko', total: 8500, foto: 'EkkoTheNeeko.png', premios: [
    ['3º clasificación general · High Elo', 7000, 'torneo', ''],
    ['King Slayer', 1000, 'kick', 'Más victorias contra el nº 1 vigente'],
    ['Más daño a campeones', 250, 'kick', 'Récord de partida'],
    ['Mejor CS/min', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Jesskiu', total: 7250, foto: 'Jesskiu.png', premios: [
    ['2º clasificación general · Low Elo', 6500, 'torneo', ''],
    ['Mejor MID · Low Elo', 500, 'torneo', ''],
    ['Más oro', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Dahvys', total: 5250, foto: 'Dahvys.png', premios: [
    ['4º clasificación general · High Elo', 4000, 'torneo', ''],
    ['Mejor JUNGLA · High Elo', 1000, 'torneo', ''],
    ['Más kills', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Manolito', total: 5000, foto: 'Manolito.png', premios: [
    ['El Grindeador', 2500, 'kick', 'Más partidas ganadas en todo el torneo'],
    ['7º clasificación general · High Elo', 1500, 'torneo', ''],
    ['Mejor TOP · High Elo', 1000, 'torneo', ''] ] },
  { n: 'Palkiogre2', total: 4500, foto: 'Palkiogre2.png', premios: [
    ['Main Character', 2500, 'kick', 'Mejor winrate con un mismo campeón (mín. 100 partidas)'],
    ['Consistency King', 1000, 'kick', 'Racha más larga con KDA de 5 o más'],
    ['KDA Player', 1000, 'kick', 'Mejor KDA medio (mín. 100 partidas)'] ] },
  { n: 'AlvaroStorm', total: 3800, foto: 'AlvaroStorm.png', premios: [
    ['4º clasificación general · Low Elo', 1800, 'torneo', ''],
    ['Rocky Balboa', 1500, 'kick', 'Más puestos escalados en las últimas 48 horas'],
    ['Mejor JUNGLA · Low Elo', 500, 'torneo', ''] ] },
  { n: 'Attila', total: 3500, foto: 'Attila.png', premios: [
    ['5º clasificación general · High Elo', 2500, 'torneo', ''],
    ['Mejor SUPPORT · High Elo', 1000, 'torneo', ''] ] },
  { n: 'Candela', total: 3500, foto: 'Candela.png', premios: [
    ['3º clasificación general · Low Elo', 3000, 'torneo', ''],
    ['Mejor SUPPORT · Low Elo', 500, 'torneo', ''] ] },
  { n: 'Dalvenger', total: 3500, foto: 'Dalvenger.jpeg', premios: [
    ['One Trick King', 2500, 'kick', 'Más victorias usando un mismo campeón'],
    ['El Sheriff', 1000, 'kick', 'Más primeras sangres'] ] },
  { n: 'AdcShiro', total: 2500, foto: 'AdcShiro.png', premios: [
    ['Sin Frenos', 1500, 'kick', 'La racha de victorias seguidas más larga'],
    ['Mejor ADC · High Elo', 1000, 'torneo', ''] ] },
  { n: 'Marquez', total: 2500, foto: 'Marquez.png', premios: [
    ['Pentakill Hunter', 1500, 'kick', 'Más pentakills'],
    ['Cuadra Killer', 1000, 'kick', 'Más cuádruples asesinatos'] ] },
  { n: 'Jesuscpev', total: 2000, foto: 'Jesuscpev.png', premios: [
    ['6º clasificación general · High Elo', 2000, 'torneo', ''] ] },
  { n: 'Charolon', total: 1700, foto: 'Charolon.png', premios: [
    ['Mejor Autofill · High Elo', 1000, 'torneo', 'Mejor winrate fuera de su línea principal'],
    ['9º clasificación general · High Elo', 700, 'torneo', ''] ] },
  { n: 'Karchez', total: 1600, foto: 'Karchez.png', premios: [
    ['7º clasificación general · Low Elo', 600, 'torneo', ''],
    ['Mejor ADC · Low Elo', 500, 'torneo', ''],
    ['Mejor Autofill · Low Elo', 500, 'torneo', ''] ] },
  { n: 'Adertyh', total: 1500, foto: 'Adertyh.png', premios: [
    ['Agente del Caos', 1500, 'kick', 'La Blue Shell más demoledora del torneo'] ] },
  { n: 'WillyrexFanboy', total: 1300, foto: 'WillyrexFanboy.png', premios: [
    ['Criminal de Guerra', 1000, 'kick', 'Más Blue Shells lanzadas'],
    ['10º clasificación general · High Elo', 300, 'torneo', ''] ] },
  { n: 'Maiiser', total: 1100, foto: 'Maiiser.png', premios: [
    ['5º clasificación general · Low Elo', 1100, 'torneo', ''] ] },
  { n: 'Champi', total: 1000, foto: 'Champi.png', premios: [
    ['Maestro del Champion Pool', 1000, 'kick', 'Victorias con más campeones diferentes'] ] },
  { n: 'NotOtakuu', total: 1000, foto: 'NotOtakuu.png', premios: [
    ['8º clasificación general · High Elo', 1000, 'torneo', ''] ] },
  { n: 'HolaSoySergio', total: 800, foto: 'HolaSoySergio.png', premios: [
    ['6º clasificación general · Low Elo', 800, 'torneo', ''] ] },
  { n: 'Katth', total: 750, foto: 'Katth.png', premios: [
    ['Más visión', 250, 'kick', 'Récord de partida'],
    ['Victoria más larga', 250, 'kick', 'Récord de partida'],
    ['Mayor participación', 250, 'kick', 'Récord de partida'] ] },
  { n: 'PauSenpaii', total: 400, foto: 'PauSenpaii.png', premios: [
    ['8º clasificación general · Low Elo', 400, 'torneo', ''] ] },
  { n: 'Future', total: 250, foto: 'Future.png', premios: [
    ['Mejor KDA', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Kerios', total: 250, foto: 'Kerios.png', premios: [
    ['Más daño a torres', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Yonna', total: 250, foto: 'Yonna.png', premios: [
    ['Más asistencias', 250, 'kick', 'Récord de partida'] ] },
  { n: 'Mahria', total: 200, foto: 'Mahria.png', premios: [
    ['9º clasificación general · Low Elo', 200, 'torneo', ''] ] },
  { n: 'Zeling', total: 100, foto: 'Zeling.png', premios: [
    ['10º clasificación general · Low Elo', 100, 'torneo', ''] ] },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const NB = ' '; // espacio fino para miles: legible en cualquier locale
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const eur = n => `${fmt(n)}${NB}€`;

const dias = (totalEur, pais) => Math.ceil(totalEur * pais.tc / pais.wageDia);
const humano = d => {
  if (d >= 365) return `≈ ${(d / 365).toFixed(1)} años`;
  if (d >= 90) return `≈ ${Math.round(d / 30)} meses`;
  return 'de lunes a lunes, sin descanso';
};

const flagCss = p => {
  const stops = p.flag.map((c, i) => `${c} ${(i / p.flag.length) * 100}%, ${c} ${((i + 1) / p.flag.length) * 100}%`).join(', ');
  return `background: linear-gradient(${p.dir === 'v' ? '90deg' : '180deg'}, ${stops});`;
};

const GREEN = '#53FC18', YELLOW = '#E9FF1F', BG = '#0B0B0B';
const CARD = 'background: linear-gradient(160deg, #16161B, #0A0A0D); border: 1px solid rgba(255,255,255,0.15);';
const TITLE = `font-weight: 800; font-style: italic; text-transform: uppercase;`;

const fuentePill = f => f === 'kick'
  ? `<span style="flex: none; background: ${YELLOW}; color: #000; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 4px 14px; letter-spacing: 1px;">KICK</span>`
  : `<span style="flex: none; background: ${GREEN}; color: #000; font-size: 17px; font-weight: 700; border-radius: 999px; padding: 4px 14px; letter-spacing: 1px;">TORNEO</span>`;

function topBar(right) {
  return `<div style="position: absolute; top: 0; left: 0; right: 0; height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="display: flex; align-items: center; gap: 16px;"><img src="assets/soloq-logo.webp" alt="SoloQ Challenge" style="height: 52px; width: auto;"><span style="font-size: 21px; font-weight: 700; letter-spacing: 2.5px; color: rgba(255,255,255,0.85); text-transform: uppercase; font-style: italic;">SoloQ Challenge 2026</span></div>
      ${right}
    </div>`;
}

function bloqueDias(total, extraStyle) {
  const cards = PAISES.map(p => {
    const d = dias(total, p);
    return `<div style="${CARD} border-radius: 34px 0; padding: 26px 30px 24px; display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 42px; height: 28px; border-radius: 6px; flex: none; ${flagCss(p)}"></span>
          <span style="font-size: 23px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.85);">${p.nombre}</span>
        </div>
        <div style="font-size: 52px; font-weight: 800; font-style: italic; color: ${YELLOW}; letter-spacing: -1px; line-height: 1;">${fmt(d)} <span style="font-size: 26px; font-weight: 700; letter-spacing: 0;">días</span></div>
        <div style="font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.55);">${humano(d)}</div>
      </div>`;
  }).join('');
  return `<div style="${extraStyle || ''}">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
        <span style="width: 34px; height: 4px; background: ${GREEN};"></span>
        <span style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${GREEN}; font-style: italic;">Días de salario mínimo para ganarlo</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 22px;">${cards}</div>
    </div>`;
}

// ── Slides de puestos (empates agrupados) ────────────────────────────────
const grupos = [];
for (const j of JUGADORES) {
  const g = grupos.find(x => x.total === j.total);
  if (g) g.jugadores.push(j); else grupos.push({ total: j.total, jugadores: [j] });
}
grupos.sort((a, b) => b.total - a.total);

function slidePuesto(g, idx) {
  const puesto = idx + 1;
  const varios = g.jugadores.length > 1;
  const nombres = g.jugadores.map(j => j.n).join(' · ');
  const avatarSize = varios ? (g.jugadores.length === 3 ? 210 : 250) : 320;
  const avatares = g.jugadores.map(j => `<img src="assets/avatars/${j.foto}" alt="${j.n}" style="width: ${avatarSize}px; height: ${avatarSize}px; border-radius: 50%; object-fit: cover; border: 4px solid ${GREEN}; box-shadow: 0 0 0 5px rgba(83,252,24,0.25), 0 0 60px rgba(83,252,24,0.35);">`).join('');

  const premioRows = g.jugadores.flatMap(j => j.premios.map(([nombre, monto, fuente, desc]) => {
    const quien = varios ? `<span style="color: ${GREEN}; font-weight: 700;">${j.n}</span> · ` : '';
    return `<div style="${CARD} border-radius: 22px 0; padding: 18px 26px; display: flex; align-items: center; gap: 18px;">
        ${fuentePill(fuente)}
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
          <span style="font-size: 25px; font-weight: 700; color: #FFFFFF; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px;">${quien}${nombre}</span>
          ${desc ? `<span style="font-size: 19px; font-weight: 500; color: rgba(255,255,255,0.6);">${desc}</span>` : ''}
        </div>
        <span style="flex: none; font-size: 29px; font-weight: 800; font-style: italic; color: ${GREEN};">${eur(monto)}</span>
      </div>`;
  })).join('');

  const nombreSize = varios ? 52 : (nombres.length > 12 ? 66 : 78);
  const notaEmpate = varios ? `<div data-a="up" style="margin-top: 10px; font-size: 22px; font-weight: 600; color: ${YELLOW}; letter-spacing: 2px; text-transform: uppercase; font-style: italic;">Empate a ${eur(g.total)} — ${g.jugadores.length} jugadores</div>` : '';

  return `
  <section data-label="Puesto ${puesto} — ${nombres}" data-screen-label="Puesto ${puesto}" data-speaker-notes="Puesto ${puesto}: ${nombres}, ${eur(g.total)} en total." style="background: ${BG}; background-image: radial-gradient(120% 55% at 50% 0%, rgba(83,252,24,0.14) 0%, rgba(0,0,0,0) 55%); font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif; color: #E5E7EB; display: flex; flex-direction: column; padding: 132px 64px 56px; box-sizing: border-box; overflow: hidden;">
    ${topBar(`<span style="background: ${GREEN}; color: #000; font-size: 22px; font-weight: 800; font-style: italic; border-radius: 999px; padding: 8px 24px; letter-spacing: 1px;">PUESTO #${puesto}</span>`)}
    <div data-a="ghost" style="position: absolute; top: 46px; right: -10px; font-size: 420px; font-weight: 800; font-style: italic; line-height: 1; color: rgba(255,255,255,0.05); letter-spacing: -12px;">${String(puesto).padStart(2, '0')}</div>
    <div data-a="img" style="display: flex; justify-content: center; gap: 34px; margin-top: 34px;">${avatares}</div>
    <div style="text-align: center; margin-top: 34px;">
      <h2 data-a="up" style="margin: 0; font-size: ${nombreSize}px; ${TITLE} letter-spacing: -1.5px; line-height: 1.05; color: #FFFFFF; background: linear-gradient(#FFFFFF, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${nombres}</h2>
      ${notaEmpate}
      <div data-a="up2" style="margin-top: 18px; font-size: 108px; font-weight: 800; font-style: italic; color: ${GREEN}; letter-spacing: -3px; line-height: 1; text-shadow: 0 0 46px rgba(83,252,24,0.45);">${eur(g.total)}</div>
      ${varios ? `<div data-a="up2" style="margin-top: 8px; font-size: 21px; color: rgba(255,255,255,0.55); font-weight: 500;">cada uno</div>` : ''}
    </div>
    <div data-a="up3" style="margin-top: 40px; display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="width: 34px; height: 4px; background: ${GREEN};"></span>
        <span style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${GREEN}; font-style: italic;">Por qué ganó</span>
      </div>
      ${premioRows}
    </div>
    <div style="flex: 1;"></div>
    ${bloqueDias(g.total, 'margin-top: 36px;').replace('<div style="', '<div data-a="up3" style="')}
  </section>`;
}

// ── Portada ──────────────────────────────────────────────────────────────
const portada = `
  <section data-label="Portada" data-screen-label="Portada" data-speaker-notes="SoloQ Challenge 2026 de ElmiilloR: 125.000 EUR repartidos en 23 días. Cuanto costaria ganarlos con salario minimo en Latam." style="background: ${BG}; background-image: radial-gradient(130% 60% at 50% 0%, rgba(83,252,24,0.22) 0%, rgba(0,0,0,0) 60%); font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif; color: #E5E7EB; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 70px; box-sizing: border-box; overflow: hidden;">
    <img data-a="img" src="assets/soloq-logo.webp" alt="SoloQ Challenge" style="height: 300px; width: auto; filter: drop-shadow(0 0 50px rgba(83,252,24,0.4));">
    <h1 data-a="up" style="margin: 46px 0 0; font-size: 108px; ${TITLE} letter-spacing: -3px; line-height: 0.98; background: linear-gradient(#FFFFFF, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">SoloQ<br>Challenge<br>2026</h1>
    <div data-a="up2" style="margin-top: 30px; font-size: 27px; font-weight: 500; color: rgba(255,255,255,0.7); line-height: 1.45; max-width: 760px;">¿Cuánto ganó cada jugador… y cuántos días de <span style="color: ${YELLOW}; font-weight: 700;">salario mínimo</span> costaría ganarlo en Latinoamérica?</div>
    <div data-a="up3" style="margin-top: 56px; ${CARD} border-radius: 44px 0; padding: 34px 66px;">
      <div style="font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${GREEN}; font-style: italic;">Bolsa total repartida</div>
      <div style="font-size: 124px; font-weight: 800; font-style: italic; color: ${GREEN}; letter-spacing: -4px; line-height: 1.05; text-shadow: 0 0 50px rgba(83,252,24,0.5);">125${NB}000${NB}€</div>
      <div style="margin-top: 8px; font-size: 22px; font-weight: 500; color: rgba(255,255,255,0.6);">en 23 días de torneo · 28 jul – 19 ago · organizado por ElmiilloR</div>
    </div>
    <div data-a="up3" style="margin-top: 44px; display: flex; gap: 16px;">
      <span style="background: ${GREEN}; color: #000; font-size: 21px; font-weight: 700; border-radius: 999px; padding: 10px 26px; letter-spacing: 1px;">TORNEO · 100${NB}000${NB}€</span>
      <span style="background: ${YELLOW}; color: #000; font-size: 21px; font-weight: 700; border-radius: 999px; padding: 10px 26px; letter-spacing: 1px;">KICK · 25${NB}000${NB}€</span>
    </div>
  </section>`;

// ── Metodología ──────────────────────────────────────────────────────────
const metodologia = `
  <section data-label="Cómo lo calculamos" data-screen-label="Metodología" data-speaker-notes="Metodologia: salario minimo diario por pais y tipo de cambio del 20 de agosto de 2026. Solo Mexico define salario diario oficial; en el resto es el mensual entre 30." style="background: ${BG}; font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif; color: #E5E7EB; display: flex; flex-direction: column; padding: 150px 64px 60px; box-sizing: border-box; overflow: hidden;">
    ${topBar(`<span style="background: ${YELLOW}; color: #000; font-size: 22px; font-weight: 800; font-style: italic; border-radius: 999px; padding: 8px 24px; letter-spacing: 1px;">METODOLOGÍA</span>`)}
    <h2 data-a="up" style="margin: 0; font-size: 84px; ${TITLE} letter-spacing: -2.5px; line-height: 1; background: linear-gradient(#FFFFFF, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">¿Cómo lo<br>calculamos?</h2>
    <div data-a="up2" style="margin-top: 30px; font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.7); line-height: 1.5;">Tomamos el premio en euros, lo convertimos a moneda local y lo dividimos entre el <span style="color: ${YELLOW}; font-weight: 700;">salario mínimo de un día</span> de trabajo.</div>
    <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 20px;">
      ${PAISES.map(p => `<div style="${CARD} border-radius: 34px 0; padding: 28px 34px; display: flex; align-items: center; gap: 24px;">
        <span style="width: 62px; height: 42px; border-radius: 8px; flex: none; ${flagCss(p)}"></span>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 30px; font-weight: 800; font-style: italic; text-transform: uppercase; color: #FFFFFF; letter-spacing: 0.5px;">${p.nombre}</span>
          <span style="font-size: 21px; font-weight: 500; color: rgba(255,255,255,0.6);">1${NB}€ = ${fmt(Math.round(p.tc * 100) / 100)} ${p.moneda}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 40px; font-weight: 800; font-style: italic; color: ${GREEN}; letter-spacing: -1px;">${fmt(Math.round(p.wageDia))} <span style="font-size: 22px;">${p.moneda}</span></div>
          <div style="font-size: 19px; font-weight: 500; color: rgba(255,255,255,0.55);">salario mínimo por día</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="${CARD} border-radius: 26px 0; padding: 24px 32px; font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.6); line-height: 1.55;">
      Solo México fija un salario mínimo <em>diario</em> oficial (CONASAMI 2026). En Chile, Colombia y Argentina es mensual y lo dividimos entre 30. Argentina: SMVM de agosto 2026. Tipo de cambio del 20/ago/2026. Los días se redondean hacia arriba y suponen trabajar <em>todos</em> los días, sin descanso.
    </div>
  </section>`;

// ── Bonus Princesita + Cierre ────────────────────────────────────────────
const bonus = `
  <section data-label="Bonus — POCHIQUEUE" data-screen-label="Bonus" data-speaker-notes="Bonus: Princesita gano el POCHIQUEUE, la racha de derrotas mas larga. El monto nunca se revelo." style="background: ${BG}; background-image: radial-gradient(120% 55% at 50% 0%, rgba(233,255,31,0.12) 0%, rgba(0,0,0,0) 55%); font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif; color: #E5E7EB; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 140px 70px 80px; box-sizing: border-box; overflow: hidden;">
    ${topBar(`<span style="background: ${YELLOW}; color: #000; font-size: 22px; font-weight: 800; font-style: italic; border-radius: 999px; padding: 8px 24px; letter-spacing: 1px;">BONUS</span>`)}
    <div data-a="ghost" style="position: absolute; top: 60px; right: 0px; font-size: 400px; font-weight: 800; font-style: italic; line-height: 1; color: rgba(233,255,31,0.06); letter-spacing: -12px;">??</div>
    <img data-a="img" src="assets/avatars/Princesita.png" alt="Princesita" style="width: 300px; height: 300px; border-radius: 50%; object-fit: cover; border: 4px solid ${YELLOW}; box-shadow: 0 0 0 5px rgba(233,255,31,0.25), 0 0 60px rgba(233,255,31,0.3);">
    <h2 data-a="up" style="margin: 36px 0 0; font-size: 78px; ${TITLE} letter-spacing: -2px; background: linear-gradient(#FFFFFF, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Princesita</h2>
    <div data-a="up2" style="margin-top: 20px; font-size: 30px; font-weight: 700; font-style: italic; text-transform: uppercase; color: ${YELLOW}; letter-spacing: 2px;">Premio «POCHIQUEUE»</div>
    <div data-a="up2" style="margin-top: 14px; font-size: 26px; font-weight: 500; color: rgba(255,255,255,0.7); max-width: 720px; line-height: 1.5;">La racha de derrotas seguidas más larga del torneo.</div>
    <div data-a="up3" style="margin-top: 44px; font-size: 160px; font-weight: 800; font-style: italic; color: ${YELLOW}; text-shadow: 0 0 60px rgba(233,255,31,0.4); line-height: 1;">???${NB}€</div>
    <div data-a="up3" style="margin-top: 24px; font-size: 23px; font-weight: 500; color: rgba(255,255,255,0.55); max-width: 700px; line-height: 1.5;">La web nunca reveló el monto. Días de salario mínimo necesarios: también ???</div>
  </section>`;

const cierre = `
  <section data-label="Cierre" data-screen-label="Cierre" data-speaker-notes="Cierre: los 125.000 EUR completos equivalen a decadas de salario minimo. Datos de soloqchallenge.gg." style="background: ${BG}; background-image: radial-gradient(130% 60% at 50% 100%, rgba(83,252,24,0.18) 0%, rgba(0,0,0,0) 60%); font-family: 'General Sans', 'GeneralSans', ui-sans-serif, system-ui, sans-serif; color: #E5E7EB; display: flex; flex-direction: column; padding: 150px 64px 70px; box-sizing: border-box; overflow: hidden;">
    ${topBar(`<span style="background: ${GREEN}; color: #000; font-size: 22px; font-weight: 800; font-style: italic; border-radius: 999px; padding: 8px 24px; letter-spacing: 1px;">CIERRE</span>`)}
    <h2 data-a="up" style="margin: 0; font-size: 82px; ${TITLE} letter-spacing: -2.5px; line-height: 1.02; background: linear-gradient(#FFFFFF, rgba(255,255,255,0.55)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Y toda la bolsa,<br>¿cuánto trabajo es?</h2>
    <div data-a="up2" style="margin-top: 26px; font-size: 27px; font-weight: 500; color: rgba(255,255,255,0.7); line-height: 1.5;">Los <span style="color: ${GREEN}; font-weight: 800; font-style: italic;">125${NB}000${NB}€</span> del SoloQ Challenge se ganaron en <span style="color: ${YELLOW}; font-weight: 700;">23 días</span>. Con salario mínimo, esa cifra tomaría…</div>
    <div data-a="up3" style="margin-top: 44px; display: flex; flex-direction: column; gap: 22px;">
      ${PAISES.map(p => {
        const d = dias(125000, p);
        return `<div style="${CARD} border-radius: 34px 0; padding: 30px 36px; display: flex; align-items: center; gap: 24px;">
          <span style="width: 62px; height: 42px; border-radius: 8px; flex: none; ${flagCss(p)}"></span>
          <span style="flex: 1; font-size: 32px; font-weight: 800; font-style: italic; text-transform: uppercase; color: #FFFFFF;">${p.nombre}</span>
          <div style="text-align: right;">
            <div style="font-size: 54px; font-weight: 800; font-style: italic; color: ${YELLOW}; letter-spacing: -1.5px; line-height: 1;">${fmt(d)} días</div>
            <div style="font-size: 22px; font-weight: 500; color: rgba(255,255,255,0.6);">${humano(d)} de trabajo sin descanso</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="flex: 1;"></div>
    <div data-a="up3" style="text-align: center; font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.45); line-height: 1.6;">Datos: soloqchallenge.gg/premios · Salarios mínimos oficiales 2026 · Tipo de cambio 20/ago/2026<br>Presentación no oficial, con cariño para la comunidad 💚</div>
  </section>`;

// ── Documento ────────────────────────────────────────────────────────────
const slides = [portada, metodologia, ...grupos.map(slidePuesto), bonus, cierre].join('\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SoloQ Challenge 2026 — Premios vs Salario Mínimo</title>
${kit.og({ titulo: "SoloQ Challenge 2026 · Premios vs salario mínimo", descripcion: "El ranking completo de ganadores con sus premios, y cuántos días de salario mínimo tomaría ganar cada cifra en México, Chile, Colombia y Argentina.", carpeta: "soloq" })}
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,401,500,501,600,601,700,701&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  @keyframes dsUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
  @keyframes dsImg { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: none; } }
  @keyframes dsGhost { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: no-preference) {
    [data-deck-active] [data-a="up"] { animation: dsUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up2"] { animation: dsUp 0.7s 0.15s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="up3"] { animation: dsUp 0.8s 0.28s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="img"] { animation: dsImg 0.9s 0.1s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
    [data-deck-active] [data-a="ghost"] { animation: dsGhost 1.2s 0.1s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid rgba(83,252,24,0.4); border-radius: 999px;
    background: rgba(11,11,11,0.8); color: ${GREEN}; cursor: pointer;
    font: 600 13px/1 'General Sans', sans-serif; letter-spacing: 0.8px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides}
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
console.log(`index.html generado: ${2 + grupos.length + 2} slides (${grupos.length} puestos, ${JUGADORES.length} jugadores)`);
