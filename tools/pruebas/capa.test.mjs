// «Modo capa» de deck-stage.js (?capa=<id>&alfa=1 + postMessage seek/info/listo).
// Uso: node --test tools/pruebas/capa.test.mjs   (necesita Chrome o Edge y ffmpeg; sin Chrome se salta)
//
// Criterio principal: el cuadro que muestra el modo capa tras {tipo:'seek', t} es
// idéntico, píxel a píxel, al que saca cuadros.mjs con section.__tl.time(t, false).
// Se comparan las CAPTURAS crudas (mismo viewport, mismo Page.captureScreenshot):
// los clips de cuadros.mjs salen codificados con pérdida y contra eso nunca daría 0.
// La ruta de referencia (`referencia`) repite los pasos de cuadros.mjs (abrir() y
// renderizar()); si cambia ese archivo, cambia esto.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { CHROME, servir, psnr, laminasDe, raiz, lanzar, referencia, porCapa } from './ayudas.mjs';

const DECK = 'creator/leblanc';
const hayDeck = fs.existsSync(path.join(raiz, DECK, 'index.html'));
const omitir = !CHROME ? 'no hay Chrome ni Edge instalados' : !hayDeck ? `no existe ${DECK}` : false;
const FPS = 30;
const CUADRO = 36;                    // el cuadro 36 a 30 fps…
const T = CUADRO / FPS;               // …es t = 1.2 s

// Chrome no rasteriza igual dos veces (cuadros.mjs lo documenta: 41–60 dB entre corridas; aquí, la ruta de cuadros
// contra sí misma da 84–92 dB), así que «píxel 0» literal no se puede pedir ni a cuadros.mjs. Se comprueba:
//  1. el ESTADO de la lámina tras el seek (caja, transform, opacidad, color… de cada elemento): idéntico, exacto;
//  2. los píxeles dentro del ruido de Chrome (≥ 45 dB; lo medido entre las dos rutas es ≥ 58 dB);
//  3. un control: otro instante cae por debajo (t = 0: ~14–26 dB), o sea que 1 y 2 detectan un seek distinto.
const PSNR_MIN = 45;

test('modo capa: mismo cuadro que cuadros.mjs (estado idéntico, píxeles dentro del ruido de Chrome)', { skip: omitir, timeout: 400000 }, async (t) => {
  const web = await servir();
  const navegador = await lanzar();
  t.after(async () => { await navegador.close(); web.cerrar(); });
  const laminas = laminasDe(DECK);
  const elegidas = [laminas[0], laminas[1], laminas[laminas.length - 1]];   // la primera, una que se activa con _go y la última
  const url = `${web.origen}/${DECK}/`;
  for (const alfa of [false, true]) {
    for (const { i, id } of elegidas) {
      const a = await referencia(navegador, url, i, T, alfa);
      const b = await porCapa(navegador, url, id, T, alfa);
      const nombre = `${id}${alfa ? ' (alfa)' : ''} @ t=${T}`;
      assert.ok(a.png.length > 1000, `${nombre}: captura vacía`);
      assert.equal(b.estado, a.estado, `${nombre}: el estado de la lámina difiere`);
      if (!a.png.equals(b.png)) {
        const db = psnr(a.png, b.png);
        assert.ok(db >= PSNR_MIN, `${nombre}: las capturas difieren, PSNR ${db.toFixed(2)} dB (mínimo ${PSNR_MIN})`);
      }
    }
  }
  // Control: en otro instante (t = 0) el estado y los píxeles SÍ cambian.
  const { i, id } = laminas[0];
  const en = await referencia(navegador, url, i, T, false);
  const cero = await porCapa(navegador, url, id, 0, false);
  assert.notEqual(cero.estado, en.estado, 'el control no distingue t=0 de t=1.2 en el estado');
  assert.ok(psnr(en.png, cero.png) < PSNR_MIN, 'el control no distingue t=0 de t=1.2 en los píxeles');
});

/** Una página «padre» en su propio origen que incrusta el deck en un iframe y apunta lo que le llega por postMessage. */
async function padreCon(deck, id) {
  const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), 'padre-'));
  const web = await servir(carpeta);
  fs.writeFileSync(path.join(carpeta, 'host.html'), `<!doctype html><iframe id="f" width="1080" height="1920" src="${deck.origen}/${DECK}/?capa=${id}"></iframe>
<script>window.__msgs=[];addEventListener('message',e=>{if(e.data&&e.data.tipo)window.__msgs.push({...e.data,origen:e.origin});});</script>`);
  return { ...web, url: `${web.origen}/host.html`, carpeta };
}

test('modo capa: protocolo postMessage dentro de un iframe', { skip: omitir, timeout: 120000 }, async (t) => {
  const deck = await servir();                                    // el deck
  const { id } = laminasDe(DECK)[0];
  const padre = await padreCon(deck, id);                         // la página que lo incrusta: el origen autorizado
  const intruso = await padreCon(deck, id);                       // otra página, en OTRO origen que el deck no autoriza
  const navegador = await lanzar();
  t.after(async () => {
    await navegador.close(); deck.cerrar(); padre.cerrar(); intruso.cerrar();
    for (const w of [padre, intruso]) fs.rmSync(w.carpeta, { recursive: true, force: true });
  });
  // El deck solo autoriza al origen «padre» (evaluateOnNewDocument corre también dentro del iframe).
  const abrir = async (host) => {
    const pagina = await navegador.newPage();
    await pagina.evaluateOnNewDocument((o) => { window.CAPA_ORIGENES = [o]; }, padre.origen);
    await pagina.bringToFront();
    await pagina.goto(host.url);
    const marco = await (async () => {
      for (let n = 0; n < 200; n++) { const m = pagina.frames().find((x) => x.url().includes('capa=')); if (m) return m; await new Promise((r) => setTimeout(r, 50)); }
      throw new Error('el iframe no cargó');
    })();
    return { pagina, marco };
  };
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const enviar = (pagina, msg) => pagina.evaluate((m, o) => document.getElementById('f').contentWindow.postMessage(m, o), msg, deck.origen);

  const { pagina, marco } = await abrir(padre);
  await pagina.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'listo'), { timeout: 30000, polling: 100 });
  const listo = await pagina.evaluate(() => window.__msgs.find((m) => m.tipo === 'listo'));
  assert.equal(listo.id, id);
  assert.equal(listo.ancho, 1080);
  assert.equal(listo.alto, 1920);
  assert.equal(listo.origen, deck.origen);
  assert.ok(listo.dur_anim > 0, 'la lámina de leblanc tiene timeline');

  const tiempo = () => marco.evaluate(() => document.querySelector('section[data-deck-active]').__tl.time());
  assert.equal(await tiempo(), 0, 'empieza en pausa, en 0');
  await enviar(pagina, { tipo: 'seek', t: 1.2 });
  await espera(60);
  assert.equal(await tiempo(), 1.2);
  // Un seek más allá del final se acota a la duración; uno negativo, a 0.
  await enviar(pagina, { tipo: 'seek', t: 999 });
  await espera(60);
  assert.equal(await tiempo(), listo.dur_anim);
  await enviar(pagina, { tipo: 'seek', t: -3 });
  await espera(60);
  assert.equal(await tiempo(), 0);
  // Mensajes sin sentido no rompen nada.
  await enviar(pagina, { tipo: 'seek', t: 'x' });
  await enviar(pagina, 'hola');
  await enviar(pagina, null);
  assert.equal(await tiempo(), 0);
  // {tipo:'info'} responde otra vez el 'listo', al origen que preguntó.
  await pagina.evaluate(() => { window.__msgs.length = 0; });
  await enviar(pagina, { tipo: 'info' });
  await pagina.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'listo'), { timeout: 5000 });

  // Desde un origen que el deck no autoriza, el seek se ignora.
  const intrusa = await abrir(intruso);
  await intrusa.marco.waitForFunction(() => !!document.querySelector('section[data-deck-active]')?.__tl, { timeout: 30000, polling: 100 });
  await espera(500);                                              // sobra para que el deck termine de prepararse
  await enviar(intrusa.pagina, { tipo: 'seek', t: 1.2 });
  await espera(150);
  assert.equal(await intrusa.marco.evaluate(() => document.querySelector('section[data-deck-active]').__tl.time()), 0, 'un origen no autorizado no puede mover la lámina');
  assert.deepEqual(await intrusa.pagina.evaluate(() => window.__msgs), [], 'y el deck no le avisa nada a quien no está en la lista');
});

test('modo capa: una sola lámina, sin rail ni controles; con alfa, fondos vacíos', { skip: omitir, timeout: 120000 }, async (t) => {
  const web = await servir();
  const navegador = await lanzar();
  t.after(async () => { await navegador.close(); web.cerrar(); });
  const { id } = laminasDe(DECK)[1];
  for (const alfa of [false, true]) {
    const pagina = await navegador.newPage();
    await pagina.evaluateOnNewDocument(() => { window.CAPA_ORIGENES = [location.origin]; window.__msgs = []; addEventListener('message', (e) => { if (e.data && e.data.tipo) window.__msgs.push(e.data); }); });
    await pagina.setViewport({ width: 1080, height: 1920 });
    await pagina.goto(`${web.origen}/${DECK}/?capa=${id}${alfa ? '&alfa=1' : ''}`, { waitUntil: 'networkidle0' });
    await pagina.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'listo'), { timeout: 30000 });
    const r = await pagina.evaluate((idLamina) => {
      const ds = document.querySelector('deck-stage');
      const activas = [...ds.querySelectorAll(':scope > section[data-deck-active]')].map((s) => s.dataset.lamina);
      const cs = (el) => getComputedStyle(el);
      const rail = ds.shadowRoot.querySelector('.rail'), cortina = ds.shadowRoot.querySelector('.cortina');
      const transparente = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
      const fondos = [cs(document.documentElement).backgroundColor, cs(document.body).backgroundColor, cs(ds).backgroundColor,
        cs(ds.querySelector(`[data-lamina="${idLamina}"]`)).backgroundColor, cs(ds.shadowRoot.querySelector('.canvas')).backgroundColor];
      return { activas, noRail: ds.hasAttribute('no-rail'), railOculto: !rail || cs(rail).display === 'none' || rail.hasAttribute('data-presenting'),
        cortinaFuera: !cortina || cortina.hasAttribute('data-listo'), todosTransparentes: fondos.every(transparente), fondos,
        fondosMarcados: [...ds.querySelectorAll('[data-fondo]')].every((e) => cs(e).display === 'none'), hayMarcados: ds.querySelectorAll('[data-fondo]').length };
    }, id);
    assert.deepEqual(r.activas, [id]);
    assert.ok(r.noRail);
    assert.ok(r.railOculto, 'sin tira de miniaturas');
    assert.ok(r.cortinaFuera, 'sin cortina de carga');
    if (alfa) {
      assert.ok(r.todosTransparentes, `fondos con alfa: ${r.fondos.join(' | ')}`);
      assert.ok(r.fondosMarcados, 'los [data-fondo] van ocultos');
    } else {
      assert.ok(!r.todosTransparentes, 'sin alfa la lámina conserva su fondo');
    }
    await pagina.close();
  }
});

test('modo capa: lámina inexistente avisa error; lámina sin timeline responde dur_anim 0 e ignora el seek', { skip: omitir, timeout: 120000 }, async (t) => {
  // Un deck mínimo sin GSAP: el runtime real, dos láminas y nada más.
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-sin-tl-'));
  fs.mkdirSync(path.join(base, 'x', 'y'), { recursive: true });
  fs.copyFileSync(path.join(raiz, DECK, 'deck-stage.js'), path.join(base, 'x', 'y', 'deck-stage.js'));
  fs.writeFileSync(path.join(base, 'x', 'y', 'index.html'), `<!doctype html><meta charset="utf-8"><body style="margin:0">
<deck-stage width="1080" height="1920"><section data-lamina="a" style="background:#123">A</section><section data-lamina="b" style="background:#321">B</section></deck-stage>
<script src="deck-stage.js"></script>`);
  const web = await servir(base);
  const navegador = await lanzar();
  t.after(async () => { await navegador.close(); web.cerrar(); fs.rmSync(base, { recursive: true, force: true }); });
  const abrir = async (query) => {
    const pagina = await navegador.newPage();
    await pagina.evaluateOnNewDocument(() => { window.CAPA_ORIGENES = [location.origin]; window.__msgs = []; addEventListener('message', (e) => { if (e.data && e.data.tipo) window.__msgs.push(e.data); }); });
    await pagina.goto(`${web.origen}/x/y/?${query}`, { waitUntil: 'networkidle0' });
    return pagina;
  };
  const sin = await abrir('capa=b');
  await sin.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'listo'), { timeout: 10000 });
  const listo = await sin.evaluate(() => window.__msgs.find((m) => m.tipo === 'listo'));
  assert.deepEqual({ id: listo.id, dur_anim: listo.dur_anim, ancho: listo.ancho, alto: listo.alto }, { id: 'b', dur_anim: 0, ancho: 1080, alto: 1920 });
  await sin.evaluate(() => window.postMessage({ tipo: 'seek', t: 1 }, '*'));    // no debe lanzar
  assert.deepEqual(await sin.evaluate(() => [...document.querySelectorAll('section[data-deck-active]')].map((s) => s.dataset.lamina)), ['b']);

  const falta = await abrir('capa=no-existe');
  await falta.waitForFunction(() => window.__msgs.some((m) => m.tipo === 'error'), { timeout: 10000 });
  const error = await falta.evaluate(() => window.__msgs.find((m) => m.tipo === 'error'));
  assert.deepEqual({ id: error.id, motivo: error.motivo }, { id: 'no-existe', motivo: 'lamina-no-encontrada' });
});
