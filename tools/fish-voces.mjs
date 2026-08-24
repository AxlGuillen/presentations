import fs from 'node:fs'; import path from 'node:path';
const raiz = path.resolve(import.meta.dirname, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(raiz,'.env'),'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(),l.slice(l.indexOf('=')+1).trim()]));
for (const q of ['language=es', 'title=spanish', 'title=español']) {
  const r = await fetch(`https://api.fish.audio/model?page_size=6&sort_by=score&${q}`, { headers: { Authorization: `Bearer ${env.FISH_API_KEY}` } });
  const j = await r.json();
  console.log(`— ${q} → ${r.status}, ${j.items?.length ?? 0} resultados`);
  for (const it of j.items ?? []) console.log(`   ${it._id}  ${(it.languages||[]).join(',').padEnd(8)} ${it.title.slice(0,58)}`);
}
