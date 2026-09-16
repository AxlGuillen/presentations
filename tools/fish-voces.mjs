// Voces de Fish Audio: buscar en el catálogo, guardar las que sirven y probar
// cómo suenan antes de comprometer un guion.
//
//   node tools/fish-voces.mjs                        → las voces guardadas aquí
//   node tools/fish-voces.mjs buscar narrador        → busca en el catálogo
//   node tools/fish-voces.mjs buscar narrador --en   → filtra por idioma
//   node tools/fish-voces.mjs probar narrador-v2     → genera una muestra mp3
//   node tools/fish-voces.mjs probar <id> "texto"    → con tu propio texto
//
// El `_id` que imprime es lo que va en el campo `voz` de `<carpeta>/guion.json`.
//
// ⚠️ **Las favoritas de la cuenta NO se pueden listar por API.** Se probaron
// `/model?self=true` (devuelve 0: solo lista modelos propios, y no hay ninguno
// porque no se ha clonado ninguna voz), `/model/bookmark` y `/bookmark`, y no
// existen. Por eso el registro de abajo es a mano: se busca la voz una vez en
// fish.audio, se corre `buscar` para sacar su id y se apunta aquí.
import fs from 'node:fs';
import path from 'node:path';

// ── Las voces que ya sirvieron ───────────────────────────────────────────
// alias → { id, nota }. Editar a mano al encontrar una nueva.
const GUARDADAS = {
  'narrador-v2': {
    id: '35199d5438854f5d9157c500479ab684',
    nota: 'Narrador v2 · @Jesus Pérez · es · masculino, mediana edad, cinematográfico. ' +
          'Para la serie de lore. NO para Cumplelolero: es voz de narrador serio y ese guion es de albur.',
  },
  'femenina-estancia': {
    id: 'bfed5c0810a347dbb62e8ccce7f59c48',
    nota: 'Voz femenina español del catálogo. Es la que usa estancia/guion.json.',
  },
};

const raiz = path.resolve(import.meta.dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(raiz, '.env'), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const KEY = env.FISH_API_KEY;
if (!KEY) { console.error('Falta FISH_API_KEY en .env'); process.exit(1); }

const MUESTRA = 'De Runaterra solo se conoce una sexta parte. Del resto del planeta no quedó ni el nombre.';

const [orden, ...resto] = process.argv.slice(2);

await main();

async function main() {

// ── Listar lo guardado ───────────────────────────────────────────────────
if (!orden) {
  console.log('Voces guardadas (el id va en el campo "voz" de guion.json):\n');
  for (const [alias, v] of Object.entries(GUARDADAS)) {
    console.log(`  ${alias.padEnd(20)} ${v.id}`);
    console.log(`  ${' '.repeat(20)} ${v.nota}\n`);
  }
  console.log('Para añadir una: búscala en fish.audio, luego');
  console.log('  node tools/fish-voces.mjs buscar "<su nombre>"   y apunta el id aquí arriba.');
  return;
}

// ── Buscar en el catálogo ────────────────────────────────────────────────
if (orden === 'buscar') {
  const banderas = resto.filter(a => a.startsWith('--')).map(a => a.slice(2));
  const texto = resto.filter(a => !a.startsWith('--')).join(' ');
  if (!texto) { console.error('uso: node tools/fish-voces.mjs buscar <texto> [--es|--en|--pt]'); process.exit(1); }
  const idioma = banderas[0];

  const url = new URL('https://api.fish.audio/model');
  url.searchParams.set('page_size', '15');
  url.searchParams.set('title', texto);
  if (idioma) url.searchParams.set('language', idioma);

  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  if (!r.ok) { console.error(`${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  const j = await r.json();
  const items = j.items ?? [];
  if (!items.length) { console.log('Sin resultados.'); return; }

  // Ordenados por popularidad: la que busca suele ser la de más corazones.
  items.sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
  console.log(`${items.length} resultados para «${texto}»${idioma ? ` (${idioma})` : ''}:\n`);
  for (const it of items) {
    console.log(`  ${it._id}  ${(it.languages || []).join(',').padEnd(6)} ${String(it.like_count ?? 0).padStart(6)} ♥  ${it.title}`);
  }
  console.log('\nPara oírla:  node tools/fish-voces.mjs probar <id>');
  return;
}

// ── Probar cómo suena ────────────────────────────────────────────────────
if (orden === 'probar') {
  const [clave, ...frase] = resto;
  if (!clave) { console.error('uso: node tools/fish-voces.mjs probar <alias|id> ["texto"]'); process.exit(1); }
  const id = GUARDADAS[clave]?.id ?? clave;
  const texto = frase.join(' ') || MUESTRA;

  const dir = path.join(raiz, 'video-out', 'voces');
  fs.mkdirSync(dir, { recursive: true });
  const salida = path.join(dir, `${clave.replace(/[^\w-]/g, '')}.mp3`);

  process.stdout.write(`♪ ${id} … `);
  const t0 = Date.now();
  // Modelo gratuito a propósito: las voces del catálogo funcionan con él, y
  // con el endpoint de timestamps que usa video.mjs también. No hace falta
  // crédito para esto — lo que sí cobra es el ASR.
  const r = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', model: 's2.1-pro-free' },
    body: JSON.stringify({ text: texto, format: 'mp3', reference_id: id, latency: 'normal' }),
  });
  if (!r.ok) { console.log(`\n${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(salida, buf);
  console.log(`${(buf.length / 1024).toFixed(0)} KB en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  console.log(`→ ${path.relative(raiz, salida)}`);
  return;
}

  console.error(`Orden desconocida: ${orden}\n`);
  console.error('  node tools/fish-voces.mjs                     → voces guardadas');
  console.error('  node tools/fish-voces.mjs buscar <texto>      → buscar en el catálogo');
  console.error('  node tools/fish-voces.mjs probar <alias|id>   → generar una muestra');
  process.exitCode = 1;
}
