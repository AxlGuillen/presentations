// Estadísticas de los partidos de un día de lolesports, para decks de datos.
// Uso: node tools/partidos.mjs <carpeta> --dia=2026-10-23 [--zona=-6] [--liga=worlds] [--solo-dano]
//        [--marcadores=2026_Season_World_Championship/Main_Event/Scoreboards] [--intentos=6]
//
// Escribe <carpeta>/partidos.json con, por cada game terminado ese día —contado
// en hora de CDMX (UTC−6) por defecto, porque el último partido de un día de
// Worlds en Allen cae ya en el día siguiente en UTC—:
// equipos (lado, si ganó, oro, kills, torres, dragones, barones, daño) y los
// cinco jugadores de cada uno (rol, campeón, KDA, oro, CS, daño, % de daño y
// participación en kills), más la curva de la diferencia de oro minuto a minuto.
//
// Fuentes:
// - El calendario y los ids de los games: la API de lolesports
//   (esports-api.lolesports.com). Pide LOLESPORTS_API_KEY en .env: es la clave
//   pública que manda la propia página de lolesports.com en el header x-api-key.
// - Oro, kills, objetivos, KDA, % de daño y la curva: el feed en vivo
//   (feed.lolesports.com/livestats), que no pide clave. Su reloj arranca antes
//   del juego (en el IG–GEN del 23/10, 5 min 24 s antes), así que la curva se
//   corre con la duración oficial; sin ella, con el primer cambio de oro
//   (el oro pasivo arranca al 1:05).
// - El daño a campeones en números y la duración oficial: la API Cargo de
//   Leaguepedia (ScoreboardPlayers y ScoreboardGames). El feed solo da el % de
//   daño dentro del equipo. ⚠️ Leaguepedia limita mucho las peticiones
//   anónimas: si responde «ratelimited» el archivo sale sin daño y se completa
//   después con --solo-dano, que no vuelve a bajar el feed.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const carpeta = (args.find(a => !a.startsWith('--')) || '').replace(/[\\/]+$/, '');
const opcion = (n, def) => { const a = args.find(x => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : def; };
const DIA = opcion('dia');
const LIGA = opcion('liga', 'worlds');
const ZONA = parseFloat(opcion('zona', '-6'));
// El día local en UTC: [desde, hasta).
const DESDE = new Date(Date.parse(`${DIA}T00:00:00Z`) - ZONA * 3600000);
const HASTA = new Date(DESDE.getTime() + 86400000);
const sql = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
const SOLO_DANO = args.includes('--solo-dano');
if (!carpeta || !DIA) {
  console.error('Uso: node tools/partidos.mjs <carpeta> --dia=AAAA-MM-DD [--zona=-6] [--liga=worlds] [--solo-dano]');
  process.exit(1);
}
const salida = path.join(raiz, carpeta, 'partidos.json');

const leerEnv = () => {
  const f = path.join(raiz, '.env');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
};
const espera = (ms) => new Promise(r => setTimeout(r, ms));
const pedir = async (url, headers = {}) => {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': 'presentaciones-axl (tools/partidos.mjs)', ...headers } });
    if (r.status === 200) { const t = await r.text(); return t ? JSON.parse(t) : null; }
    if (r.status === 204 || r.status === 404) return null;
    await espera(800 * (i + 1));
  }
  throw new Error(`No respondió: ${url}`);
};
const normal = (s) => String(s || '').normalize('NFD').replace(/[^A-Za-z0-9]/g, '').toLowerCase();
// El feed usa el id de Data Dragon y Leaguepedia el nombre: casi siempre
// coinciden quitando signos, salvo estos.
const ALIAS = { monkeyking: 'wukong', renata: 'renataglasc', nunu: 'nunuwillump' };
const campeon = (s) => { const n = normal(s); return ALIAS[n] || n; };

// ── lolesports: calendario y feed ────────────────────────────────────────
const API = 'https://esports-api.lolesports.com/persisted/gw';
const FEED = 'https://feed.lolesports.com/livestats/v1';
// El feed solo acepta tiempos en múltiplos de 10 s.
const iso = (ms) => new Date(Math.floor(ms / 10000) * 10000).toISOString().replace(/\.\d+Z$/, '.000Z');

async function gamesDelDia() {
  const env = leerEnv();
  const clave = process.env.LOLESPORTS_API_KEY || env.LOLESPORTS_API_KEY;
  if (!clave) { console.error('Falta LOLESPORTS_API_KEY en .env (ver .env.example)'); process.exit(1); }
  const h = { 'x-api-key': clave };
  const ligas = (await pedir(`${API}/getLeagues?hl=es-MX`, h)).data.leagues;
  const liga = ligas.find(l => l.slug === LIGA);
  if (!liga) throw new Error(`No hay liga «${LIGA}» en lolesports`);
  const eventos = (await pedir(`${API}/getSchedule?hl=es-MX&leagueId=${liga.id}`, h)).data.schedule.events
    .filter(e => e.match && Date.parse(e.startTime) >= DESDE && Date.parse(e.startTime) < HASTA);
  const games = [];
  for (const e of eventos) {
    if (e.state !== 'completed') { console.log(`  · ${e.match.teams.map(t => t.code).join(' vs ')}: ${e.state}, se salta`); continue; }
    const m = (await pedir(`${API}/getEventDetails?hl=es-MX&id=${e.match.id}`, h)).data.event.match;
    const jugados = m.games.filter(g => g.state === 'completed');
    // En un Bo1 el ganador del game es el del partido; en series largas el
    // calendario no da el de cada game y se deduce de las torres (ver abajo).
    const ganaSerie = (e.match.teams.find(t => t.result && t.result.outcome === 'win') || {}).code || null;
    for (const g of jugados) games.push({ partido: e.match.id, juego: g.id, numero: g.number, hora: e.startTime, bloque: e.blockName,
      ganador: jugados.length === 1 ? ganaSerie : null });
  }
  return games;
}

async function feed(id) {
  const ini = await pedir(`${FEED}/window/${id}`);
  const t0 = Date.parse(ini.frames[0].rfc460Timestamp);
  // Paso de un minuto hasta el final; cada ventana trae ~10 s de cuadros.
  const muestras = [];
  let fin = null, ultimo = null;
  for (let k = 1; k < 90 && !fin; k++) {
    const w = await pedir(`${FEED}/window/${id}?startingTime=${iso(t0 + k * 60000)}`);
    if (!w || !w.frames || !w.frames.length) break;
    for (const f of w.frames) muestras.push({ t: Date.parse(f.rfc460Timestamp), azul: f.blueTeam.totalGold, rojo: f.redTeam.totalGold });
    fin = w.frames.find(f => f.gameState === 'finished') || null;
    ultimo = w.frames[w.frames.length - 1];
  }
  fin = fin || ultimo;
  const tFin = Date.parse(fin.rfc460Timestamp);
  const det = await pedir(`${FEED}/details/${id}?startingTime=${iso(tFin - 10000)}`);
  return { meta: ini.gameMetadata, t0, tFin, final: { azul: fin.blueTeam, rojo: fin.redTeam },
    detalle: det.frames[det.frames.length - 1], muestras };
}

// ── Leaguepedia: daño y duración oficial ─────────────────────────────────
async function leaguepedia() {
  const consulta = (tablas, campos, donde, union) => 'https://lol.fandom.com/api.php?' + new URLSearchParams({
    action: 'cargoquery', format: 'json', limit: '500', tables: tablas, fields: campos, where: donde, ...(union ? { join_on: union } : {}),
  });
  const donde = `SG.DateTime_UTC >= "${sql(DESDE)}" AND SG.DateTime_UTC < "${sql(HASTA)}"`;
  const url = consulta('ScoreboardGames=SG,ScoreboardPlayers=SP',
    'SG.GameId=juego,SG.Gamelength_Number=minutos,SG.Tournament=torneo,SP.Champion=campeon,SP.DamageToChampions=dano,SP.Link=jugador',
    donde, 'SG.GameId=SP.GameId');
  const intentos = parseInt(opcion('intentos', '6'), 10);
  for (let i = 0; i < intentos; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': 'presentaciones-axl (tools/partidos.mjs)' } });
    const d = await r.json().catch(() => ({}));
    if (d.cargoquery) return d.cargoquery.map(x => x.title);
    const motivo = d.error ? d.error.code : r.status;
    if (i + 1 === intentos) { console.log(`  · Leaguepedia: ${motivo}`); break; }
    console.log(`  · Leaguepedia: ${motivo}, reintento en ${20 * (i + 1)} s`);
    await espera(20000 * (i + 1));
  }
  return null;
}

// ── Armar cada game ──────────────────────────────────────────────────────
const ROL = { top: 'top', jungle: 'jungla', mid: 'medio', bottom: 'tirador', support: 'soporte' };
function armar(g, f) {
  const det = Object.fromEntries(f.detalle.participants.map(p => [p.participantId, p]));
  const equipo = (lado) => {
    const md = f.meta[lado === 'azul' ? 'blueTeamMetadata' : 'redTeamMetadata'];
    const fin = f.final[lado];
    const jug = md.participantMetadata.map(p => {
      const d = det[p.participantId];
      const [codigo, ...nombre] = p.summonerName.split(' ');
      return { nombre: nombre.join(' ') || codigo, rol: ROL[p.role] || p.role, campeon: p.championId,
        k: d.kills, d: d.deaths, a: d.assists, oro: d.totalGoldEarned, cs: d.creepScore,
        dano: null, danoPct: +d.championDamageShare.toFixed(4), kp: +d.killParticipation.toFixed(4) };
    });
    return { codigo: md.participantMetadata[0].summonerName.split(' ')[0], esportsId: md.esportsTeamId, lado,
      oro: fin.totalGold, kills: fin.totalKills, torres: fin.towers, inhibidores: fin.inhibitors, barones: fin.barons,
      dragones: fin.dragons, dano: null, jugadores: jug };
  };
  const azul = equipo('azul'), rojo = equipo('rojo');
  // El feed no dice quién tiró el nexo: sin ganador del calendario, gana el de
  // más torres (el nexo cae después de sus dos torres).
  const ganador = g.ganador || (azul.torres >= rojo.torres ? azul.codigo : rojo.codigo);
  azul.gana = ganador === azul.codigo; rojo.gana = ganador === rojo.codigo;
  return { ...g, ganador, duracionFeed: Math.round((f.tFin - f.t0) / 1000), duracion: null, equipos: [azul, rojo], curva: [], _muestras: f.muestras };
}

function curva(j) {
  const m = j._muestras;
  if (!m.length) return [];
  const tFin = m[m.length - 1].t;
  let inicio;
  if (j.duracion) inicio = tFin - j.duracion * 1000;
  else {
    const primero = m.find(x => x.azul > 2500 || x.rojo > 2500);
    inicio = (primero ? primero.t : m[0].t) - 65000;
  }
  const puntos = [];
  for (let min = 0; inicio + min * 60000 <= tFin + 1; min++) {
    const t = inicio + min * 60000;
    const x = m.reduce((b, s) => Math.abs(s.t - t) < Math.abs(b.t - t) ? s : b, m[0]);
    puntos.push({ min, dif: t < m[0].t ? 0 : x.azul - x.rojo });
  }
  const ultimo = m[m.length - 1];
  puntos.push({ min: +(j.duracion ? j.duracion / 60 : (tFin - inicio) / 60000).toFixed(2), dif: ultimo.azul - ultimo.rojo });
  return puntos;
}

function ponerDano(juegos, filas) {
  let completos = 0;
  for (const j of juegos) {
    const campeones = new Set(j.equipos.flatMap(e => e.jugadores.map(p => campeon(p.campeon))));
    // El game de Leaguepedia es el que tiene los mismos diez campeones.
    const porJuego = {};
    for (const f of filas) (porJuego[f.juego] = porJuego[f.juego] || []).push(f);
    const lp = Object.values(porJuego).find(fs_ => fs_.length === 10 && fs_.every(f => campeones.has(campeon(f.campeon))));
    if (!lp) { console.log(`  · ${j.equipos.map(e => e.codigo).join(' vs ')}: aún no está en Leaguepedia`); continue; }
    j.duracion = Math.round(parseFloat(lp[0].minutos) * 60);
    for (const e of j.equipos) {
      for (const p of e.jugadores) {
        const f = lp.find(x => campeon(x.campeon) === campeon(p.campeon));
        p.dano = f && f.dano !== '' ? Number(f.dano) : null;
      }
      e.dano = e.jugadores.every(p => p.dano != null) ? e.jugadores.reduce((s, p) => s + p.dano, 0) : null;
    }
    completos++;
  }
  return completos;
}

// ── Principal ────────────────────────────────────────────────────────────
let juegos;
const cache = path.join(raiz, carpeta, 'video-out', 'partidos-feed.json');
if (SOLO_DANO) {
  if (!fs.existsSync(cache)) { console.error('No hay feed guardado: córrelo primero sin --solo-dano.'); process.exit(1); }
  juegos = JSON.parse(fs.readFileSync(cache, 'utf8'));
} else {
  const lista = await gamesDelDia();
  console.log(`${lista.length} games terminados el ${DIA}`);
  juegos = [];
  for (const g of lista) {
    const f = await feed(g.juego);
    const j = armar(g, f);
    console.log(`  ✓ ${j.equipos.map(e => `${e.codigo} ${(e.oro / 1000).toFixed(1)}k ${e.kills}`).join('  vs  ')}`);
    juegos.push(j);
  }
  fs.mkdirSync(path.dirname(cache), { recursive: true });
  fs.writeFileSync(cache, JSON.stringify(juegos));
}

// Las filas de Cargo se guardan al llegar: si la siguiente corrida se topa con
// el límite, se usan las de antes en vez de dejar el archivo sin daño.
const cacheLp = path.join(raiz, carpeta, 'video-out', 'partidos-leaguepedia.json');
let filas = await leaguepedia();
if (filas) fs.writeFileSync(cacheLp, JSON.stringify(filas));
else if (fs.existsSync(cacheLp)) { filas = JSON.parse(fs.readFileSync(cacheLp, 'utf8')); console.log('  · Leaguepedia no respondió: uso las filas de la corrida anterior'); }
if (filas) console.log(`Leaguepedia: daño en ${ponerDano(juegos, filas)} de ${juegos.length} games`);
else console.log('⚠️ Leaguepedia no respondió: partidos.json sale sin daño en números (córrelo luego con --solo-dano)');

// Sin Cargo, la duración oficial todavía se puede leer de la página de
// Scoreboards en HTML (--marcadores=<página de Leaguepedia>), que no comparte
// su límite. Cada game se reconoce por sus kills y su oro (en miles, a 0,1).
const MARCADORES = opcion('marcadores');
if (MARCADORES && juegos.some(j => !j.duracion)) {
  // Con curl: Fandom le responde 403 al fetch de Node aunque lleve el mismo User-Agent.
  const c = spawnSync('curl', ['-s', '-f', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', `https://lol.fandom.com/wiki/${MARCADORES}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const html = c.status === 0 ? c.stdout : '';
  if (!html) console.log('  · Scoreboards de Leaguepedia: no respondió');
  const cabeceras = [...html.matchAll(/class="sb-header"([\s\S]*?)class="sb-p"/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '))
    .map(t => t.match(/(Victory|Defeat) ([\d.]+)k (\d+) (\d+):(\d\d) (Victory|Defeat) ([\d.]+)k (\d+)/)).filter(Boolean)
    .map(m => ({ oro: [+m[2], +m[7]], kills: [+m[3], +m[8]], s: +m[4] * 60 + +m[5] }));
  let n = 0;
  for (const j of juegos.filter(x => !x.duracion)) {
    const [A, B] = j.equipos;
    const c = cabeceras.find(h => [[0, 1], [1, 0]].some(([p, q]) => h.kills[p] === A.kills && h.kills[q] === B.kills
      && Math.abs(h.oro[p] - A.oro / 1000) < 0.11 && Math.abs(h.oro[q] - B.oro / 1000) < 0.11));
    if (c) { j.duracion = c.s; n++; }
  }
  console.log(`Scoreboards de Leaguepedia: duración oficial de ${n} games más`);
}
for (const j of juegos) j.curva = curva(j);
const limpio = juegos.map(({ _muestras, ...j }) => j);
fs.writeFileSync(salida, JSON.stringify({ dia: DIA, zona: ZONA, liga: LIGA, fuentes: ['feed.lolesports.com', 'esports-api.lolesports.com', 'lol.fandom.com (Cargo)'], juegos: limpio }, null, 1) + '\n', 'utf8');
console.log(`Listo: ${path.relative(raiz, salida)}`);
process.exitCode = 0;
