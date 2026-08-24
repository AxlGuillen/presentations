// Prueba qué modelo acepta la key sin crédito (banner: "S2.1 Pro gratis para desarrolladores")
import fs from 'node:fs'; import path from 'node:path';
const raiz = path.resolve(import.meta.dirname, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(raiz,'.env'),'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(),l.slice(l.indexOf('=')+1).trim()]));
const KEY = env.FISH_API_KEY;
const candidatos = ['s2.1-pro-free', 's2.1-pro', 'speech-2.1-pro', 's2-pro', 's1', 'speech-1.5'];
for (const modelo of candidatos) {
  const r = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', model: modelo },
    body: JSON.stringify({ text: 'Hola, esto es una prueba.', format: 'mp3' }),
  });
  let extra = '';
  if (!r.ok) { try { extra = (await r.text()).slice(0, 120); } catch {} }
  else { const b = await r.arrayBuffer(); extra = `${(b.byteLength/1024).toFixed(0)} KB de audio`; }
  console.log(`${modelo.padEnd(16)} → ${r.status} ${extra}`);
  if (r.ok) break;
}
