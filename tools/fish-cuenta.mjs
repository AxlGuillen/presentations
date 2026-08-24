// Comprueba que la key funciona y consulta saldo/recursos que no cuestan crédito.
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(raiz, '.env'), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const KEY = env.FISH_API_KEY;

const rutas = [
  ['GET', 'https://api.fish.audio/wallet/self/api-credit'],
  ['GET', 'https://api.fish.audio/model?page_size=3&page_number=1'],
];

for (const [metodo, url] of rutas) {
  try {
    const r = await fetch(url, { method: metodo, headers: { Authorization: `Bearer ${KEY}` } });
    const ct = r.headers.get('content-type') || '';
    let cuerpo = ct.includes('json') ? JSON.stringify(await r.json()) : await r.text();
    if (cuerpo.length > 320) cuerpo = cuerpo.slice(0, 320) + '…';
    console.log(`${r.status} ${metodo} ${url.replace('https://api.fish.audio', '')}`);
    console.log('   ', cuerpo, '\n');
  } catch (e) {
    console.log(`ERR ${metodo} ${url}:`, e.message, '\n');
  }
}
