// Sonda mínima de la API de Fish Audio: valida la key y muestra la forma real
// de la respuesta con timestamps. No escribe nada en el repo salvo el audio.
// Uso: node tools/fish-test.mjs
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(raiz, '.env'), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const KEY = env.FISH_API_KEY;
if (!KEY) { console.error('Falta FISH_API_KEY en .env'); process.exit(1); }

const texto = 'Hoy es cumpleaños de Ornn: nueve años desde que llegó a la Grieta del Invocador.';

const url = 'https://api.fish.audio/v1/tts/stream/with-timestamp';
const body = { text: texto, format: 'wav', chunk_length: 200, latency: 'normal' };

console.log('→ POST', url);
console.log('  modelo: s2.1-pro-free · formato: wav · caracteres:', texto.length);

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'model': 's2.1-pro-free',
  },
  body: JSON.stringify(body),
});

console.log('← HTTP', res.status, res.statusText);
console.log('  content-type:', res.headers.get('content-type'));

if (!res.ok) {
  console.error('  cuerpo:', (await res.text()).slice(0, 600));
  process.exit(1);
}

// La respuesta es SSE: líneas "data: {json}"
const chunks = [];
let alineamiento = null;
let eventos = 0, buffer = '';
const claves = new Set();

const reader = res.body.getReader();
const dec = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += dec.decode(value, { stream: true });
  let i;
  while ((i = buffer.indexOf('\n')) >= 0) {
    const linea = buffer.slice(0, i).trim();
    buffer = buffer.slice(i + 1);
    if (!linea.startsWith('data:')) continue;
    const crudo = linea.slice(5).trim();
    if (!crudo || crudo === '[DONE]') continue;
    let ev;
    try { ev = JSON.parse(crudo); } catch { continue; }
    eventos++;
    Object.keys(ev).forEach(k => claves.add(k));
    const b64 = ev.audio_base64 ?? ev.audio ?? ev.data;
    if (typeof b64 === 'string') chunks.push(Buffer.from(b64, 'base64'));
    if (ev.alignment != null) alineamiento = ev.alignment;
    if (eventos === 1) console.log('\n  primer evento (recortado):',
      JSON.stringify(ev, (k, v) => typeof v === 'string' && v.length > 60 ? v.slice(0, 60) + `…(${v.length})` : v).slice(0, 900));
  }
}

console.log('\n  eventos SSE:', eventos);
console.log('  claves vistas:', [...claves].join(', '));

const audio = Buffer.concat(chunks);
const salida = path.join(raiz, 'tools', 'prueba.wav');
fs.writeFileSync(salida, audio);
console.log('  audio:', (audio.length / 1024).toFixed(0), 'KB →', path.relative(raiz, salida));

if (alineamiento) {
  const j = JSON.stringify(alineamiento);
  console.log('\n  ALINEAMIENTO presente. Forma:', j.slice(0, 700));
} else {
  console.log('\n  ⚠ Sin campo "alignment" en ningún evento: habría que ir al plan B (un clip por slide).');
}
