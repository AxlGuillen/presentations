// Convierte un deck en un MP4 narrado con subtítulos.
// Uso: node tools/video.mjs <carpeta>          (p. ej. estancia)
//
// Requiere: <carpeta>/guion.json  y las capturas de tools/capturar.mjs
// (si faltan, las genera). Voz: Fish Audio s2.1-pro-free (gratis) con
// timestamps palabra por palabra → los subtítulos salen sin transcribir.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const raiz = path.resolve(import.meta.dirname, '..');
const deck = (process.argv[2] || '').replace(/[\\/]/g, '');
const dirDeck = path.join(raiz, deck);
const rutaGuion = path.join(dirDeck, 'guion.json');
if (!deck || !fs.existsSync(rutaGuion)) {
  console.error('Uso: node tools/video.mjs <carpeta>   (debe existir <carpeta>/guion.json)');
  process.exit(1);
}

const env = Object.fromEntries(
  fs.readFileSync(path.join(raiz, '.env'), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
if (!env.FISH_API_KEY) { console.error('Falta FISH_API_KEY en .env'); process.exit(1); }

const guion = JSON.parse(fs.readFileSync(rutaGuion, 'utf8'));
const out = path.join(dirDeck, 'video-out');
const dirAudio = path.join(out, 'audio');
const dirSlides = path.join(out, 'slides');
fs.mkdirSync(dirAudio, { recursive: true });

// ── 0 · Capturas (si faltan) ─────────────────────────────────────────────
const pngEsperados = guion.slides.map(s => path.join(dirSlides, `slide-${String(s.slide).padStart(2, '0')}.png`));
if (!pngEsperados.every(f => fs.existsSync(f))) {
  console.log('No hay capturas: corriendo tools/capturar.mjs…');
  const r = spawnSync(process.execPath, [path.join(raiz, 'tools', 'capturar.mjs'), deck], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ── 0b · Clips animados (si el deck usa GSAP y faltan) ───────────────────
// tools/cuadros.mjs recorre las timelines con seeks exactos a 30 fps; cada
// slide con animación entra al video con su clip y se congela en el último
// cuadro el resto de su narración. Las slides sin timeline siguen con PNG.
const dirAnim = path.join(out, 'anim');
if (fs.existsSync(path.join(dirDeck, 'gsap.min.js')) && !fs.existsSync(path.join(dirAnim, 'anim.json'))) {
  console.log('El deck usa GSAP y no hay clips: corriendo tools/cuadros.mjs…');
  const r = spawnSync(process.execPath, [path.join(raiz, 'tools', 'cuadros.mjs'), deck], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ── 1 · Voz por diapositiva, con alineamiento ────────────────────────────
const LEAD = 0.35;  // aire antes de que empiece a hablar en cada slide
const TAIL = 0.65;  // aire después

async function tts(texto, extra = {}) {
  const res = await fetch('https://api.fish.audio/v1/tts/stream/with-timestamp', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.FISH_API_KEY}`, 'Content-Type': 'application/json', model: 's2.1-pro-free' },
    body: JSON.stringify({ text: texto, format: 'wav', reference_id: guion.voz || undefined, latency: 'normal', ...extra }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const trozos = [];
  const porChunk = new Map(); // chunk_seq → { alignment, offset }
  let buffer = '';
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    let i;
    while ((i = buffer.indexOf('\n')) >= 0) {
      const linea = buffer.slice(0, i).trim(); buffer = buffer.slice(i + 1);
      if (!linea.startsWith('data:')) continue;
      const crudo = linea.slice(5).trim();
      if (!crudo || crudo === '[DONE]') continue;
      let ev; try { ev = JSON.parse(crudo); } catch { continue; }
      if (typeof ev.audio_base64 === 'string') trozos.push(Buffer.from(ev.audio_base64, 'base64'));
      if (ev.alignment) porChunk.set(ev.chunk_seq ?? 0, { alignment: ev.alignment, offset: ev.chunk_audio_offset_sec ?? 0 });
    }
  }
  // palabras absolutas dentro del clip; el alignment de cada chunk es acumulado → último gana por chunk
  const palabras = [];
  let dur = 0;
  for (const { alignment, offset } of [...porChunk.entries()].sort((a, b) => a[0] - b[0]).map(e => e[1])) {
    for (const s of alignment.segments || []) palabras.push({ t: s.text, ini: offset + s.start, fin: offset + s.end });
    dur = Math.max(dur, offset + (alignment.audio_duration || 0));
  }
  return { audio: Buffer.concat(trozos), palabras, dur };
}

const clips = [];
for (const s of guion.slides) {
  const wav = path.join(dirAudio, `clip-${String(s.slide).padStart(2, '0')}.wav`);
  process.stdout.write(`♪ slide ${s.slide} (${s.texto.length} chars)… `);
  // prosodia opcional desde guion.json: "velocidad" (0.5–2, global o por
  // slide) y "temperatura" (global; más baja = clips más consistentes)
  const extra = {};
  const velocidad = s.velocidad ?? guion.velocidad;
  if (velocidad) extra.prosody = { speed: velocidad };
  if (guion.temperatura != null) extra.temperature = guion.temperatura;
  const { audio, palabras, dur } = await tts(s.texto, extra);
  fs.writeFileSync(wav, audio);
  // duración real medida por ffprobe (más fiable que el reporte del API)
  const real = parseFloat(execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());
  clips.push({ ...s, wav, palabras, dur: real || dur });
  console.log(`${(real || dur).toFixed(2)}s · ${palabras.length} palabras`);
}

// ── 2 · Subtítulos (SRT) con tiempos globales ────────────────────────────
const srtT = t => {
  const ms = Math.round(t * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

// ── 2b · Karaoke opcional (guion.json: "subtitulos": "karaoke") ──────────
// Subtítulos estilo TikTok: líneas cortas centradas, la palabra hablada se
// pinta con el color de acento del deck ("acento": "#RRGGBB", opcional).
// Usa los timestamps palabra a palabra de Fish, así que la sincronía es real.
const esKaraoke = guion.subtitulos === 'karaoke';
const assLineas = [];
let assHeader = '';
if (esKaraoke) {
  const [W, H] = execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', pngEsperados[0]])
    .toString().trim().split(',').map(Number);
  const vertical = H > W;
  const tam = Math.round(W * (vertical ? 0.062 : 0.036));
  const margen = Math.round(H * (vertical ? 0.21 : 0.08)); // en 9:16, arriba de la interfaz de TikTok
  const assColor = hex => {
    const n = parseInt((hex || '#FFC800').replace('#', ''), 16);
    const b = n & 255, g = (n >> 8) & 255, r = (n >> 16) & 255;
    return ('&H00' + [b, g, r].map(x => x.toString(16).padStart(2, '0')).join('') + '&').toUpperCase();
  };
  assHeader = `[Script Info]
ScriptType: v4.00+
PlayResX: ${W}
PlayResY: ${H}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: K,Arial,${tam},${assColor(guion.acento)},&H00FFFFFF,&H00141414,&H78000000,-1,0,0,0,100,100,0,0,1,${Math.max(2, Math.round(tam * 0.07))},${Math.max(1, Math.round(tam * 0.05))},2,60,60,${margen},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
}
const assT = t => {
  const cs = Math.round(t * 100);
  const h = Math.floor(cs / 360000), m = Math.floor(cs / 6000) % 60, s = Math.floor(cs / 100) % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
};

let t0 = 0, nSub = 0;
const srt = [];
const tiempos = [];
for (const c of clips) {
  const iniSlide = t0;
  const total = LEAD + c.dur + TAIL;
  tiempos.push({ slide: c.slide, ini: iniSlide, dur: total });
  // agrupar palabras en líneas de ≤ 40 caracteres
  let linea = [], iniLinea = null;
  const cerrar = fin => {
    if (!linea.length) return;
    srt.push(`${++nSub}\n${srtT(iniSlide + LEAD + iniLinea)} --> ${srtT(iniSlide + LEAD + fin)}\n${linea.join(' ')}\n`);
    linea = []; iniLinea = null;
  };
  for (const p of c.palabras) {
    // por si el alignment devolviera una etiqueta de expresión ([break],
    // [excited]…) como "palabra": nunca va a los subtítulos
    if (/^\s*[\[\(][^\]\)]*[\]\)]\s*$/.test(p.t)) continue;
    if (iniLinea == null) iniLinea = p.ini;
    linea.push(p.t);
    if (linea.join(' ').length > 40 || /[.!?…:]$/.test(p.t)) cerrar(p.fin);
  }
  cerrar(c.palabras.at(-1)?.fin ?? c.dur);

  if (esKaraoke) {
    // líneas de hasta 3 palabras; cada palabra dura hasta que arranca la
    // siguiente ({\k} en centésimas), así el resalte no deja huecos
    const abs = c.palabras
      .filter(p => !/^\s*[\[\(][^\]\)]*[\]\)]\s*$/.test(p.t))
      .map(p => ({ t: p.t, ini: iniSlide + LEAD + p.ini, fin: iniSlide + LEAD + p.fin }));
    for (let j = 0; j < abs.length; j += 3) {
      const grupo = abs.slice(j, j + 3);
      const partes = grupo.map((p, k) => {
        const hasta = k < grupo.length - 1 ? grupo[k + 1].ini : p.fin;
        return `{\\k${Math.max(1, Math.round((hasta - p.ini) * 100))}}${p.t}`;
      }).join(' ');
      assLineas.push(`Dialogue: 0,${assT(grupo[0].ini)},${assT(grupo.at(-1).fin)},K,,0,0,0,,${partes}`);
    }
  }
  t0 += total;
}
const rutaSrt = path.join(out, 'subs.srt');
fs.writeFileSync(rutaSrt, srt.join('\n'), 'utf8');
console.log(`\nSubtítulos: ${nSub} líneas → ${path.relative(raiz, rutaSrt)}`);
let rutaAss = null;
if (esKaraoke) {
  rutaAss = path.join(out, 'subs.ass');
  fs.writeFileSync(rutaAss, assHeader + assLineas.join('\n') + '\n', 'utf8');
  console.log(`Karaoke: ${assLineas.length} líneas → ${path.relative(raiz, rutaAss)}`);
}
fs.writeFileSync(path.join(out, 'tiempos.json'), JSON.stringify(tiempos, null, 2));

// ── 3 · Segmentos de video y concatenación ───────────────────────────────
const dirSeg = path.join(out, 'seg');
fs.mkdirSync(dirSeg, { recursive: true });
const ff = args => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });

const lista = [];
for (const [i, c] of clips.entries()) {
  const png = pngEsperados[i];
  const seg = path.join(dirSeg, `seg-${String(c.slide).padStart(2, '0')}.mp4`);
  const total = (LEAD + c.dur + TAIL).toFixed(3);
  const anim = path.join(dirAnim, `anim-${String(c.slide).padStart(2, '0')}.mp4`);
  const audioArgs = ['-af', `adelay=${Math.round(LEAD * 1000)}|${Math.round(LEAD * 1000)},apad`, '-t', total];
  const codecs = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
                  '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '2'];
  if (fs.existsSync(anim)) {
    // clip animado + congelar el último cuadro hasta cubrir la narración
    const durAnim = parseFloat(execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', anim]).toString());
    const resto = Math.max(0, +total - durAnim).toFixed(3);
    ff(['-i', anim, '-i', c.wav,
        '-vf', `tpad=stop_mode=clone:stop_duration=${resto}`,
        ...audioArgs, ...codecs, seg]);
    process.stdout.write(`▢ seg ${c.slide} (${total}s · animado ${durAnim.toFixed(2)}s)\n`);
  } else {
    ff(['-loop', '1', '-framerate', '30', '-i', png, '-i', c.wav,
        ...audioArgs, ...codecs, seg]);
    process.stdout.write(`▢ seg ${c.slide} (${total}s)\n`);
  }
  lista.push(`file '${seg.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`);
}
const rutaLista = path.join(dirSeg, 'lista.txt');
fs.writeFileSync(rutaLista, lista.join('\n'));

const sinSubs = path.join(out, 'video-sin-subs.mp4');
ff(['-f', 'concat', '-safe', '0', '-i', rutaLista, '-c', 'copy', sinSubs]);

// ── 4 · Quemar subtítulos ────────────────────────────────────────────────
const final = path.join(out, 'video.mp4');
const estilo = 'FontName=Segoe UI,FontSize=13,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H0030224A,Outline=1.4,Shadow=0.6,MarginV=46';
// el filtro subtitles es quisquilloso con rutas de Windows → cwd relativo
const rel = p => path.relative(out, p).replace(/\\/g, '/');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', rel(sinSubs),
  '-vf', esKaraoke ? `ass=${rel(rutaAss)}` : `subtitles=${rel(rutaSrt)}:force_style='${estilo}'`,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-c:a', 'copy', rel(final)], { cwd: out, stdio: ['ignore', 'inherit', 'inherit'] });

const st = fs.statSync(final);
const durTotal = tiempos.reduce((a, t) => a + t.dur, 0);
console.log(`\n✔ ${path.relative(raiz, final)} · ${durTotal.toFixed(1)}s · ${(st.size / 1024 / 1024).toFixed(1)} MB`);
console.log(`  (también: video-sin-subs.mp4 y subs.srt por separado)`);
