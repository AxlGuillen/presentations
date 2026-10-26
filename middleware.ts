// Contraseña para la galería (la raíz del sitio). Los decks siguen abiertos:
// se comparten por enlace y quien lo recibe no tiene que saber nada más. Lo
// que se protege es el índice, para que alguien que recibió un deck no pueda
// ir a la raíz y ver todos los demás.
//
// Routing Middleware de Vercel (corre antes de servir el estático, en Node).
// Es TypeScript a propósito: un middleware.js necesitaría "type": "module" en
// un package.json de la raíz, y eso convertiría en ESM todos los gen.js
// (CommonJS) de las carpetas. Solo usa sintaxis que se puede borrar, así que
// Node 24 lo importa tal cual en las pruebas (tools/pruebas/middleware.test.mjs).
//
// La clave vive en la variable de entorno GALERIA_CLAVE del proyecto en
// Vercel, NUNCA en el repo (es público). Sin la variable, la galería queda
// cerrada. Al entrar se guarda una cookie con un HMAC de la clave: cambiar la
// clave cierra todas las sesiones. ?salir borra la cookie.

declare const process: { env: Record<string, string | undefined> };

export const config = { matcher: ['/', '/index.html'] };

const COOKIE = 'galeria';
const DURA = 60 * 60 * 24 * 30; // 30 días

const bytes = new TextEncoder();

/** HMAC-SHA256 en hex. Firma la clave para la cookie y también se usa para
 *  comparar el intento con la clave: así las dos cadenas miden lo mismo y la
 *  comparación no filtra el largo. */
async function firma(clave: string, texto: string): Promise<string> {
  const llave = await crypto.subtle.importKey('raw', bytes.encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const f = await crypto.subtle.sign('HMAC', llave, bytes.encode(texto));
  return Array.from(new Uint8Array(f), (b) => b.toString(16).padStart(2, '0')).join('');
}

function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function leerCookie(request: Request, nombre: string): string {
  const todas = request.headers.get('cookie') || '';
  for (const parte of todas.split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombre) return decodeURIComponent(v.join('='));
  }
  return '';
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const clave = process.env.GALERIA_CLAVE || '';
  const url = new URL(request.url);
  const seguro = url.protocol === 'https:' ? '; Secure' : '';

  if (url.searchParams.has('salir')) {
    return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${seguro}`, 'Cache-Control': 'no-store' } });
  }

  const sesion = clave ? await firma(clave, 'galeria-v1') : '';
  // Sesión válida: no se devuelve nada y Vercel sirve el index.html estático.
  if (clave && iguales(leerCookie(request, COOKIE), sesion)) return undefined;

  if (request.method === 'POST') {
    const datos = await request.formData().catch(() => null);
    const intento = String((datos && datos.get('clave')) || '');
    if (clave && intento && iguales(await firma(clave, intento), await firma(clave, clave))) {
      return new Response(null, {
        status: 303,
        headers: { Location: '/', 'Set-Cookie': `${COOKIE}=${sesion}; Path=/; Max-Age=${DURA}; HttpOnly; SameSite=Lax${seguro}`, 'Cache-Control': 'no-store' },
      });
    }
    return acceso(401, clave ? 'Esa no es la contraseña.' : 'La galería todavía no tiene contraseña configurada.');
  }

  return acceso(clave ? 401 : 503, clave ? '' : 'La galería todavía no tiene contraseña configurada.');
}

/** La puerta, con la identidad de La cartelera (carbón, hueso y ámbar). */
function acceso(status: number, error: string): Response {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>El programa · Acceso</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Archivo:wght@400;500;600&family=Spline+Sans+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { background: #16130E; color: #EDE8DD; font-family: 'Archivo', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .puerta { width: 100%; max-width: 420px; }
  .marca { width: 64px; height: auto; color: #E8B54D; display: block; margin-bottom: 34px; }
  .senal { display: flex; align-items: center; gap: 10px; font: 400 11px/1 'Spline Sans Mono', monospace; letter-spacing: 2.5px; color: #E8B54D; }
  .senal i { width: 8px; height: 8px; border-radius: 50%; background: #E8B54D; box-shadow: 0 0 12px rgba(232,181,77,0.8); }
  h1 { margin: 18px 0 10px; font: 800 44px/1 'Bricolage Grotesque', sans-serif; }
  p { margin: 0 0 30px; color: #8F887A; font-size: 15px; line-height: 1.55; }
  label { display: block; font: 400 11px/1 'Spline Sans Mono', monospace; letter-spacing: 1.5px; color: #8F887A; margin-bottom: 10px; }
  input { width: 100%; padding: 15px 16px; border-radius: 10px; border: 1px solid #2C2822; background: #0F0D09; color: #EDE8DD; font: 500 17px/1 'Archivo', sans-serif; }
  input:focus { outline: none; border-color: #E8B54D; }
  button { margin-top: 16px; width: 100%; padding: 15px; border: 0; border-radius: 999px; background: #E8B54D; color: #16130E; font: 500 13px/1 'Spline Sans Mono', monospace; letter-spacing: 1px; cursor: pointer; }
  button:hover { box-shadow: 0 10px 30px rgba(232,181,77,0.25); }
  .error { margin: 14px 0 0; color: #F08A6B; font-size: 14px; }
</style>
</head>
<body>
  <form class="puerta" method="post" action="/">
    <svg class="marca" viewBox="0 0 104 92" fill="currentColor" aria-hidden="true"><path d="M0 52 H104 V66 H0 Z"></path><path d="M66 0 H80 V78 H104 V92 H66 V20 L26 60 H6 Z"></path></svg>
    <div class="senal"><i></i>ACCESO PRIVADO</div>
    <h1>El programa</h1>
    <p>La galería completa es privada. Si te compartieron una presentación, ábrela desde su enlace.</p>
    <label for="clave">CONTRASEÑA</label>
    <input id="clave" name="clave" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">ENTRAR →</button>
    ${error ? `<p class="error" role="alert">${error}</p>` : ''}
  </form>
</body>
</html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}
