// Servidor local que imita a Vercel para este sitio: sirve los estáticos con
// barra final (trailingSlash) y pasa por middleware.ts las rutas de su
// matcher, para probar la contraseña de la galería sin desplegar. La clave
// sale de GALERIA_CLAVE (entorno o .env, que está ignorado).
// Uso: node tools/servidor-local.mjs [puerto]   → http://localhost:3125/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const puerto = Number(process.argv[2] || 3125);
if (!process.env.GALERIA_CLAVE && fs.existsSync(path.join(raiz, '.env'))) {
  const m = fs.readFileSync(path.join(raiz, '.env'), 'utf8').match(/^GALERIA_CLAVE=(.*)$/m);
  if (m) process.env.GALERIA_CLAVE = m[1].trim();
}
const { default: middleware, config } = await import(path.join(raiz, 'middleware.ts'));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${puerto}`);
  if (config.matcher.includes(url.pathname)) {
    const cuerpo = req.method === 'POST' ? await new Promise((ok) => { const t = []; req.on('data', (c) => t.push(c)); req.on('end', () => ok(Buffer.concat(t))); }) : undefined;
    const r = await middleware(new Request(url, { method: req.method, headers: req.headers, body: cuerpo }));
    if (r) {
      res.writeHead(r.status, Object.fromEntries(r.headers));
      return res.end(Buffer.from(await r.arrayBuffer()));
    }
  }
  let rel = decodeURIComponent(url.pathname);
  const abs0 = path.join(raiz, rel);
  // trailingSlash de vercel.json: /deck → /deck/
  if (!rel.endsWith('/') && fs.existsSync(abs0) && fs.statSync(abs0).isDirectory()) { res.writeHead(308, { Location: rel + '/' + url.search }); return res.end(); }
  if (rel.endsWith('/')) rel += 'index.html';
  const abs = path.join(raiz, rel);
  if (!abs.startsWith(raiz) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(raiz, '404.html')).pipe(res);
  }
  const tam = fs.statSync(abs).size, rango = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  const tipo = TIPOS[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  if (rango) {   // los <video> piden por rangos
    const ini = rango[1] ? +rango[1] : 0, fin = rango[2] ? +rango[2] : tam - 1;
    res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${ini}-${fin}/${tam}`, 'Accept-Ranges': 'bytes', 'Content-Length': fin - ini + 1 });
    return fs.createReadStream(abs, { start: ini, end: fin }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': tam, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(abs).pipe(res);
}).listen(puerto, () => console.log(`Sitio local (con la contraseña de la galería): http://localhost:${puerto}/` + (process.env.GALERIA_CLAVE ? '' : '  · sin GALERIA_CLAVE: la galería queda cerrada')));
