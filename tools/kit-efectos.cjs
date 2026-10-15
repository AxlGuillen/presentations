// tools/kit-efectos.cjs — Catálogo de efectos de animación para los decks.
//
// `kit.efectos()` devuelve un <script> inline que define, en el navegador:
//
//   efecto(nombre, tl, el, opciones)   añade la receta `nombre` a la timeline
//   efectosDeclarados(tl, seccion)     aplica las recetas declaradas en el HTML
//                                      con data-efecto="nombre" (+ data-en, data-dur…)
//
// El pegamento `kit.animador()` llama a efectosDeclarados() por defecto, así
// que en la mayoría de las láminas basta con marcar el HTML:
//
//   <h1 data-efecto="lineas" data-en="0.2">Título</h1>
//
// Reglas que cumple cada receta (son las del repo):
//  · Determinista: nada de Math.random. El azar sale de un PRNG con semilla
//    (data-semilla), así cuadros.mjs saca el mismo video siempre.
//  · Seekeable: todo vive en la timeline; tl.time(t) da siempre el mismo cuadro.
//  · Sin JS el deck se ve completo: los estados iniciales se ponen al construir
//    la timeline, nunca en CSS. Lo que la receta inyecta en el DOM (cortinas,
//    rebanadas, máscaras) solo existe con JS.
//  · Reconstruible: el animador rehace la timeline cada vez que se activa la
//    lámina. Lo que una receta cambia del DOM lo deshace con deshacer(); el
//    animador corre esa pila antes de volver a construir. Sin eso SplitText
//    partiría el texto dos veces.
//
// Plugins: las recetas usan SplitText, DrawSVG, MorphSVG, Flip y MotionPath si
// están cargados (kit.gsap() los copia y registra) y caen a una versión simple
// si no lo están.

const efectos = () => `<script>
(function () {
  if (!window.gsap) return;
  var G = window.gsap;

  // ── utilidades ─────────────────────────────────────────────────────────
  // Arreglo de tildes: la máscara de SplitText mide la caja de la línea y con
  // line-height < 1 deja fuera los acentos de las mayúsculas (Ñ, Á, É). Se le
  // da aire por arriba y las letras arrancan más abajo (yPercent 135).
  var css = document.createElement('style');
  css.textContent =
    '.efx-linea-mask{padding-top:.18em;margin-top:-.18em}';
  document.head.appendChild(css);

  function seccionDe(el) { return el.closest ? (el.closest('section') || el) : el; }
  function deshacer(el, fn) { var s = seccionDe(el); (s.__deshacer = s.__deshacer || []).push(fn); }
  function guardaEstilo(el) { var c = el.getAttribute('style'); deshacer(el, function () { if (c == null) el.removeAttribute('style'); else el.setAttribute('style', c); }); }
  function semilla(txt) { var h = 2166136261 >>> 0; txt = String(txt); for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function prng(s) { var a = typeof s === 'number' ? s : semilla(s); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashEntero(n) { n = Math.imul(n ^ n >>> 16, 0x45d9f3b); n = Math.imul(n ^ n >>> 16, 0x45d9f3b); return (n ^ n >>> 16) >>> 0; }
  function lista(x) { return x && x.length !== undefined && !x.tagName ? [].slice.call(x) : (x ? [x] : []); }
  function imagenDe(el) { return el.tagName === 'IMG' ? el : el.querySelector('img'); }
  function srcDe(img) { return img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') || ''; }
  function partir(el, opciones) {
    var st = window.SplitText.create(el, opciones);
    deshacer(el, function () { st.revert(); });
    return st;
  }

  // Dibuja trazos SVG: DrawSVG si está, si no stroke-dashoffset a mano (en
  // unidades de usuario: los SVG del kit usan viewBox en píxeles reales).
  function dibujar(tl, els, o) {
    els = lista(els);
    if (!els.length) return;
    var en = o.en || 0, dur = o.dur || 1, esc = o.escalon == null ? 0 : o.escalon, ease = o.ease || 'power2.inOut';
    if (window.DrawSVGPlugin && !o.manual) {
      tl.from(els, { drawSVG: '0%', duration: dur, ease: ease, stagger: esc }, en);
    } else {
      els.forEach(function (e) { var L = e.getTotalLength ? e.getTotalLength() : 0; G.set(e, { strokeDasharray: L + 1, strokeDashoffset: 0 }); });
      tl.from(els, { strokeDashoffset: function (i, e) { return e.getTotalLength ? e.getTotalLength() + 1 : 0; }, duration: dur, ease: ease, stagger: esc }, en);
    }
  }

  var R = {};

  // ── TEXTO ──────────────────────────────────────────────────────────────
  // Líneas que suben desde detrás de una máscara.
  R.lineas = function (tl, el, o) {
    if (!window.SplitText) return tl.from(el, { y: 40, opacity: 0, duration: o.dur || 0.7 }, o.en || 0);
    var st = partir(el, { type: 'lines', mask: 'lines', linesClass: 'efx-linea' });
    tl.from(st.lines, { yPercent: 135, duration: o.dur || 0.8, ease: 'power4.out', stagger: o.escalon == null ? 0.12 : o.escalon }, o.en || 0);
  };

  // Letras en cascada; data-desde="center" las hace salir del centro (ola).
  R.letras = function (tl, el, o) {
    if (!window.SplitText) return tl.from(el, { y: 40, opacity: 0, duration: o.dur || 0.7 }, o.en || 0);
    var st = partir(el, { type: 'lines,chars', mask: 'lines', linesClass: 'efx-linea' });
    tl.from(st.chars, { yPercent: 135, rotation: o.giro || 0, duration: o.dur || 0.6, ease: 'power3.out',
      stagger: { each: o.escalon || 0.035, from: o.desde || 'start' } }, o.en || 0);
  };

  // Texto que se «decodifica». Determinista: el glifo de cada letra en cada
  // cuadro sale de un hash (posición, cuadro), no de Math.random.
  // Solo para elementos con texto plano (sin <br> ni spans dentro).
  R.revuelto = function (tl, el, o) {
    var final = el.textContent, n = final.length, dur = o.dur || 1.2;
    var glifos = o.glifos || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$';
    deshacer(el, function () { el.textContent = final; });
    var est = { p: 0 };
    function pinta() {
      var p = est.p, cuadro = Math.floor(p * dur * 24), umbral = Math.max(0, (p - 0.3) / 0.7) * n, txt = '';
      for (var i = 0; i < n; i++) {
        var c = final[i];
        if (c === ' ' || c === '\\n' || i < umbral) { txt += c; continue; }
        txt += glifos[hashEntero(i * 7919 + cuadro * 104729 + 1) % glifos.length];
      }
      el.textContent = txt;
    }
    tl.fromTo(est, { p: 0 }, { p: 1, duration: dur, ease: 'none', immediateRender: true, onUpdate: pinta }, o.en || 0);
    pinta();
  };

  // Máquina de escribir, con cursor que parpadea al terminar.
  R.maquina = function (tl, el, o) {
    if (!window.SplitText) return tl.from(el, { opacity: 0, duration: 0.4 }, o.en || 0);
    var st = partir(el, { type: 'chars' }), en = o.en || 0, ritmo = o.ritmo || 0.045;
    tl.from(st.chars, { autoAlpha: 0, duration: 0.001, ease: 'none', stagger: ritmo }, en);
    if (o.cursor === false || o.cursor === 'no') return;
    var cur = document.createElement('span');
    cur.textContent = '▍';
    cur.style.cssText = 'margin-left:.06em;color:' + (o.color || 'currentColor');
    el.appendChild(cur);
    deshacer(el, function () { cur.remove(); });
    var fin = en + st.chars.length * ritmo;
    tl.fromTo(cur, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, immediateRender: true }, fin)
      .to(cur, { autoAlpha: 0, duration: 0.001, repeat: 5, yoyo: true, repeatDelay: 0.22 }, fin + 0.22);
  };

  // Marcatextos que se dibuja detrás de la palabra (de izquierda a derecha).
  // data-color para el color; data-alto="completo" lo pone detrás de toda la letra.
  R.marcatextos = function (tl, el, o) {
    guardaEstilo(el);
    el.style.position = 'relative';
    el.style.isolation = 'isolate';
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    var m = document.createElement('span');
    var completo = o.alto === 'completo';
    m.style.cssText = 'position:absolute;left:-.1em;right:-.1em;z-index:-1;border-radius:.08em;transform-origin:0 50%;' +
      'background:' + (o.color || '#FFD640') + ';' + (completo ? 'top:.02em;bottom:.02em' : 'top:52%;bottom:.04em');
    el.appendChild(m);
    deshacer(el, function () { m.remove(); });
    tl.from(m, { scaleX: 0, duration: o.dur || 0.55, ease: 'power2.inOut' }, o.en || 0);
  };

  // Tragamonedas: cada dígito rueda en su columna hasta quedar en su valor.
  R.tragamonedas = function (tl, el, o) {
    var html = el.innerHTML, txt = el.textContent;
    deshacer(el, function () { el.innerHTML = html; });
    var sonda = document.createElement('span');
    sonda.textContent = '0';
    sonda.style.display = 'inline-block';
    el.appendChild(sonda);
    var h = sonda.offsetHeight;
    el.innerHTML = '';
    var cols = [];
    for (var i = 0; i < txt.length; i++) {
      var c = txt[i];
      if (!/[0-9]/.test(c)) { var s = document.createElement('span'); s.textContent = c; el.appendChild(s); continue; }
      var rod = document.createElement('span');
      rod.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;height:' + h + 'px';
      var col = document.createElement('span');
      col.style.cssText = 'display:block';
      for (var k = 0; k < 20; k++) { var d = document.createElement('span'); d.textContent = k % 10; d.style.cssText = 'display:block;height:' + h + 'px;line-height:' + h + 'px'; col.appendChild(d); }
      rod.appendChild(col);
      el.appendChild(rod);
      G.set(col, { y: -(10 + (+c)) * h });
      cols.push(col);
    }
    tl.from(cols, { y: 0, duration: o.dur || 1.4, ease: 'power3.out', stagger: { each: o.escalon || 0.07, from: 'end' } }, o.en || 0);
  };

  // Barrido de brillo sobre el texto.
  R.brillo = function (tl, el, o) {
    guardaEstilo(el);
    var c = getComputedStyle(el).color, b = o.color || '#FFFFFF';
    el.style.backgroundImage = 'linear-gradient(110deg,' + c + ' 0%,' + c + ' 40%,' + b + ' 50%,' + c + ' 60%,' + c + ' 100%)';
    el.style.backgroundSize = '250% 100%';
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    tl.fromTo(el, { backgroundPosition: '100% 0%' }, { backgroundPosition: '0% 0%', duration: o.dur || 1.3, ease: 'power2.inOut' }, o.en || 0);
  };

  // Contador con separador de miles. data-cuenta (o el propio texto) es el final.
  R.contador = function (tl, el, o) {
    var orig = el.textContent;
    deshacer(el, function () { el.textContent = orig; });
    var fin = parseFloat(o.cuenta != null ? o.cuenta : orig.replace(/[^0-9.]/g, ''));
    var sep = o.separador == null ? '\\u00A0' : o.separador, dec = o.decimales || 0, pre = o.prefijo || '', suf = o.sufijo || '';
    var est = { v: 0 };
    function pinta() {
      var t = est.v.toFixed(dec).split('.');
      el.textContent = pre + t[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep) + (t[1] ? ',' + t[1] : '') + suf;
    }
    tl.fromTo(est, { v: 0 }, { v: fin, duration: o.dur || 1.2, ease: 'power2.out', immediateRender: true, onUpdate: pinta }, o.en || 0);
    pinta();
  };

  // ── IMAGEN ─────────────────────────────────────────────────────────────
  // Empuje (Ken Burns) con el origen donde está la cara: data-origen="62% 30%".
  R.empuje = function (tl, el, o) {
    var t = imagenDe(el) || el;
    tl.from(t, { scale: o.desde || 1.18, transformOrigin: o.origen || '50% 50%', duration: o.dur || 2, ease: 'power2.out' }, o.en || 0);
  };

  // Cortinillas con clip-path: persiana, iris, diagonal o tajo.
  R.cortinilla = function (tl, el, o) {
    var forma = o.forma || 'persiana', at = o.origen || '50% 50%', desde, hasta = 'inset(0% 0% 0% 0%)';
    if (forma === 'iris') { desde = 'circle(0% at ' + at + ')'; hasta = 'circle(150% at ' + at + ')'; }
    else if (forma === 'diagonal') { desde = 'polygon(0% 0%, 0% 0%, 0% 0%)'; hasta = 'polygon(0% 0%, 200% 0%, 0% 200%)'; }
    else if (forma === 'tajo') { desde = 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)'; hasta = 'polygon(0% 100%, 0% -40%, 140% -40%, 100% 100%)'; }
    else {
      var dir = o.direccion || 'derecha';
      desde = { derecha: 'inset(0% 100% 0% 0%)', izquierda: 'inset(0% 0% 0% 100%)', abajo: 'inset(0% 0% 100% 0%)', arriba: 'inset(100% 0% 0% 0%)' }[dir];
    }
    tl.fromTo(el, { clipPath: desde }, { clipPath: hasta, duration: o.dur || 0.9, ease: o.ease || 'power3.inOut' }, o.en || 0);
  };

  // Revelado a pincel: el <svg> que arma kit.pincel() trae una máscara con
  // trazos [data-trazo]; dibujarlos destapa la imagen.
  R.pincel = function (tl, el, o) {
    // A mano y no con DrawSVG: los trazos viven dentro de un <mask>, que no se
    // renderiza, y getBBox() ahí no es fiable; getTotalLength() sí.
    dibujar(tl, el.querySelectorAll('[data-trazo]'), { en: o.en || 0, dur: o.dur || 1.6, escalon: o.escalon == null ? 0.18 : o.escalon, ease: 'power1.inOut', manual: true });
  };

  // Duotono: una copia de la imagen con el filtro de kit.duotono() encima,
  // que aparece (data-hacia="duotono") o se va (data-hacia="color").
  R.duotono = function (tl, el, o) {
    var img = imagenDe(el);
    if (!img) return;
    var par = img.parentElement;
    guardaEstilo(par);
    if (getComputedStyle(par).position === 'static') par.style.position = 'relative';
    var c = document.createElement('img');
    c.src = srcDe(img);
    c.alt = '';
    var ci = getComputedStyle(img);
    c.style.cssText = 'position:absolute;pointer-events:none;left:' + img.offsetLeft + 'px;top:' + img.offsetTop + 'px;width:' + img.offsetWidth + 'px;height:' + img.offsetHeight + 'px;' +
      'object-fit:' + ci.objectFit + ';object-position:' + ci.objectPosition + ';border-radius:' + ci.borderRadius + ';filter:url(#' + (o.filtro || 'efx-duotono') + ')';
    par.appendChild(c);
    deshacer(el, function () { c.remove(); });
    var aDuotono = (o.hacia || 'duotono') === 'duotono';
    tl.fromTo(c, { opacity: aDuotono ? 0 : 1 }, { opacity: aDuotono ? 1 : 0, duration: o.dur || 1.4, ease: 'power1.inOut' }, o.en || 0);
  };

  // Glitch: desplazamiento con el filtro de kit.glitch(), a saltos (steps),
  // que se calma hasta cero. Determinista: la semilla del ruido es fija.
  R.glitch = function (tl, el, o) {
    var f = document.getElementById(o.filtro || 'efx-glitch');
    if (!f) return;
    guardaEstilo(el);
    el.style.filter = 'url(#' + f.id + ')';
    var dm = f.querySelector('feDisplacementMap'), tu = f.querySelector('feTurbulence');
    var pasos = 'steps(' + (o.pasos || 10) + ')', en = o.en || 0, dur = o.dur || 1;
    tl.fromTo(dm, { attr: { scale: o.fuerza || 140 } }, { attr: { scale: 0 }, duration: dur, ease: pasos }, en)
      .fromTo(tu, { attr: { seed: 1 } }, { attr: { seed: 40 }, duration: dur, ease: pasos }, en)
      .fromTo(el, { x: -(o.temblor || 16) }, { x: 0, duration: dur, ease: 'steps(' + (o.pasos || 10) + ')' }, en);
  };

  // Rebanadas: la imagen partida en N tiras que entran alternando arriba/abajo.
  // El contenedor debe tener tamaño propio y overflow:hidden.
  R.rebanadas = function (tl, el, o) {
    var img = imagenDe(el);
    if (!img) return;
    guardaEstilo(el);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var w = el.offsetWidth, h = el.offsetHeight, n = o.n || 6, src = srcDe(img), ci = getComputedStyle(img), capas = [], tiras = [];
    for (var i = 0; i < n; i++) {
      var x0 = Math.floor(i * w / n), x1 = Math.ceil((i + 1) * w / n) + 1;
      var tira = document.createElement('div');
      tira.style.cssText = 'position:absolute;top:0;bottom:0;overflow:hidden;left:' + x0 + 'px;width:' + (x1 - x0) + 'px';
      var c = document.createElement('img');
      c.src = src; c.alt = '';
      c.style.cssText = 'position:absolute;top:0;max-width:none;left:' + (-x0) + 'px;width:' + w + 'px;height:' + h + 'px;object-fit:' + ci.objectFit + ';object-position:' + ci.objectPosition;
      tira.appendChild(c); el.appendChild(tira);
      tiras.push(tira); capas.push(c);
    }
    deshacer(el, function () { tiras.forEach(function (t) { t.remove(); }); });
    tl.set(img, { autoAlpha: 0 }, 0)
      .from(capas, { yPercent: function (i) { return i % 2 ? 105 : -105; }, duration: o.dur || 0.9, ease: 'power3.out', stagger: o.escalon || 0.07 }, o.en || 0);
  };

  // Parallax: los hijos [data-capa="n"] se mueven más cuanto mayor su n.
  R.parallax = function (tl, el, o) {
    lista(el.querySelectorAll('[data-capa]')).forEach(function (c) {
      var p = parseFloat(c.getAttribute('data-capa')) || 1;
      tl.from(c, { y: p * (o.distancia || 70), scale: 1 + p * 0.05, duration: o.dur || 2, ease: 'power2.out' }, o.en || 0);
    });
  };

  // ── CONTENEDORES ───────────────────────────────────────────────────────
  // Rejilla que se arma desde el centro.
  R.bento = function (tl, el, o) {
    tl.from(el.children, { scale: o.escala || 0.7, opacity: 0, duration: o.dur || 0.55, ease: 'back.out(1.6)',
      stagger: { each: o.escalon || 0.07, grid: 'auto', from: o.desde || 'center' } }, o.en || 0);
  };

  // OJO, por qué estas dos no usan el plugin Flip: Flip mide en coordenadas de
  // pantalla y corrige con las transformaciones de los ancestros subiendo por
  // parentNode. deck-stage escala el lienzo DENTRO de su shadow DOM, así que Flip
  // no ve esa escala y a mitad de animación la pieza sale desplazada (el estado
  // final sí cuadra). Aquí se mide con offsetLeft/offsetTop, que son de layout y
  // no dependen de la escala: la técnica FLIP a mano, exacta y seekeable.

  // Una celda (data-elegida) crece hasta ocupar todo el contenedor.
  R.crece = function (tl, el, o) {
    var hijos = lista(el.children);
    var eleg = hijos.filter(function (h) { return h.hasAttribute('data-elegida'); })[0] || hijos[o.elegida || 0];
    if (!eleg) return;
    var otros = hijos.filter(function (h) { return h !== eleg; });
    [el, eleg].forEach(guardaEstilo);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var ini = { left: eleg.offsetLeft, top: eleg.offsetTop, width: eleg.offsetWidth, height: eleg.offsetHeight };
    // Un hueco en su lugar: si no, al sacarla del flujo la rejilla se recorre.
    var hueco = document.createElement('div');
    hueco.style.visibility = 'hidden';
    el.insertBefore(hueco, eleg);
    deshacer(el, function () { hueco.remove(); });
    eleg.style.position = 'absolute';
    eleg.style.zIndex = 3;
    eleg.style.margin = '0';
    var fin = { left: 0, top: 0, width: el.clientWidth, height: el.clientHeight };
    tl.fromTo(eleg, ini, Object.assign({ duration: o.dur || 0.9, ease: 'power3.inOut', immediateRender: false }, fin), o.en || 0)
      .fromTo(otros, { opacity: 1 }, { opacity: 0, duration: 0.45 }, o.en || 0);
    // Antes del crecimiento la elegida está en su celda: se fija ahí desde el
    // principio (posición absoluta con las medidas de la celda).
    G.set(eleg, ini);
  };

  // Ranking que se reordena. El HTML va en el orden FINAL y cada hijo dice de
  // dónde viene con data-desde="0..n" — así sin JS se ve el resultado.
  R.reordena = function (tl, el, o) {
    var hijos = lista(el.children);
    var finalTop = hijos.map(function (h) { return h.offsetTop; });
    var inicial = hijos.slice().sort(function (a, b) { return (+a.getAttribute('data-desde')) - (+b.getAttribute('data-desde')); });
    inicial.forEach(function (h) { el.appendChild(h); });
    var iniTop = hijos.map(function (h) { return h.offsetTop; });
    hijos.forEach(function (h) { el.appendChild(h); });
    tl.from(hijos, { y: function (i) { return iniTop[i] - finalTop[i]; }, duration: o.dur || 1.1, ease: 'power3.inOut',
      stagger: o.escalon || 0.05 }, o.en || 0);
  };

  // Borde que se dibuja alrededor del contenedor antes que su contenido.
  R.borde = function (tl, el, o) {
    guardaEstilo(el);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var w = el.offsetWidth, h = el.offsetHeight, m = o.margen == null ? 10 : o.margen, g = o.grosor || 4, r = o.radio == null ? 20 : o.radio;
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + (w + 2 * m) + ' ' + (h + 2 * m));
    svg.style.cssText = 'position:absolute;pointer-events:none;overflow:visible;left:' + (-m) + 'px;top:' + (-m) + 'px;width:' + (w + 2 * m) + 'px;height:' + (h + 2 * m) + 'px';
    var rect = document.createElementNS(NS, 'rect');
    [['x', g / 2], ['y', g / 2], ['width', w + 2 * m - g], ['height', h + 2 * m - g], ['rx', r], ['fill', 'none'], ['stroke', o.color || 'currentColor'], ['stroke-width', g], ['stroke-linecap', 'round']]
      .forEach(function (a) { rect.setAttribute(a[0], a[1]); });
    svg.appendChild(rect); el.appendChild(svg);
    deshacer(el, function () { svg.remove(); });
    dibujar(tl, rect, { en: o.en || 0, dur: o.dur || 1.1, ease: 'power2.inOut' });
  };

  // Tarjeta que voltea. Hijos [data-cara="frente"] y [data-cara="dorso"],
  // apilados en la misma celda (grid-area: 1/1). Sin JS se ve el dorso.
  R.voltea = function (tl, el, o) {
    var fr = el.querySelector('[data-cara="frente"]'), ds = el.querySelector('[data-cara="dorso"]');
    if (!fr || !ds) return;
    [el, fr, ds, el.parentElement].forEach(guardaEstilo);
    el.parentElement.style.perspective = (o.perspectiva || 2200) + 'px';
    el.style.transformStyle = 'preserve-3d';
    fr.style.backfaceVisibility = ds.style.backfaceVisibility = 'hidden';
    ds.style.transform = 'rotateY(180deg)';
    tl.fromTo(el, { rotationY: 0 }, { rotationY: 180, duration: o.dur || 1.1, ease: 'power3.inOut' }, o.en || 0);
  };

  // Mazo: los hijos salen apilados del centro del contenedor y se reparten.
  R.mazo = function (tl, el, o) {
    guardaEstilo(el);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var hijos = lista(el.children), r = prng(o.semilla || 'mazo'), cx = el.offsetWidth / 2, cy = el.offsetHeight / 2;
    var dx = hijos.map(function (h) { return cx - (h.offsetLeft + h.offsetWidth / 2); });
    var dy = hijos.map(function (h) { return cy - (h.offsetTop + h.offsetHeight / 2); });
    var rot = hijos.map(function () { return (r() * 2 - 1) * 14; });
    tl.from(hijos, { x: function (i) { return dx[i]; }, y: function (i) { return dy[i]; }, rotation: function (i) { return rot[i]; },
      duration: o.dur || 0.75, ease: 'power3.out', stagger: o.escalon || 0.09 }, o.en || 0);
  };

  // ── TRANSICIONES (entrada de la lámina) ────────────────────────────────
  // Cortina: uno o dos paneles de color que se retiran. Va en los primeros
  // ~0,6 s de la timeline, así sale igual en el navegador y en el video.
  R.cortina = function (tl, el, o) {
    var s = seccionDe(el), dir = o.direccion || 'arriba', vertical = dir === 'arriba' || dir === 'abajo';
    var origen = { arriba: '50% 0%', abajo: '50% 100%', izquierda: '0% 50%', derecha: '100% 50%' }[dir];
    var colores = [o.color || '#000000'].concat(o.color2 ? [o.color2] : []);
    var prop = vertical ? 'scaleY' : 'scaleX', en = o.en || 0;
    colores.slice().reverse().forEach(function (col, i) {
      var p = document.createElement('div');
      p.style.cssText = 'position:absolute;inset:0;z-index:' + (60 + i) + ';pointer-events:none;background:' + col;
      s.appendChild(p);
      deshacer(el, function () { p.remove(); });
      var desde = {}, hasta = { duration: o.dur || 0.65, ease: 'power4.inOut', transformOrigin: origen };
      desde[prop] = 1; hasta[prop] = 0;
      tl.fromTo(p, desde, hasta, en + (colores.length - 1 - i) * 0.12);
    });
  };

  // Iris de lámina: la sección entera se abre en círculo desde un punto.
  R.iris = function (tl, el, o) {
    var s = seccionDe(el), at = o.origen || '50% 50%';
    tl.fromTo(s, { clipPath: 'circle(0% at ' + at + ')' }, { clipPath: 'circle(150% at ' + at + ')', duration: o.dur || 0.9, ease: 'power3.inOut' }, o.en || 0);
  };

  // ── SVG ────────────────────────────────────────────────────────────────
  // Dibuja todos los trazos de un SVG (íconos de línea, garabatos, mapas).
  R.dibujo = function (tl, el, o) {
    var els = lista(el.querySelectorAll('path,line,polyline,polygon,circle,ellipse,rect')).filter(function (e) {
      var st = getComputedStyle(e).stroke; return st && st !== 'none';
    });
    dibujar(tl, els, { en: o.en || 0, dur: o.dur || 1.2, escalon: o.escalon == null ? 0.05 : o.escalon });
  };

  // Una forma se convierte en otra (MorphSVG). data-desde = selector o path.
  R.transforma = function (tl, el, o) {
    if (!window.MorphSVGPlugin || !o.desde) return tl.from(el, { opacity: 0, duration: 0.5 }, o.en || 0);
    tl.from(el, { morphSVG: o.desde, duration: o.dur || 1.2, ease: o.ease || 'power2.inOut' }, o.en || 0);
  };

  // Un elemento recorre un camino SVG (MotionPath) y termina en su final.
  R.trayectoria = function (tl, el, o) {
    if (!window.MotionPathPlugin || !o.camino) return;
    tl.to(el, { motionPath: { path: o.camino, align: o.camino, alignOrigin: [0.5, 0.5], autoRotate: o.girar ? +o.girar || true : false },
      duration: o.dur || 1.6, ease: o.ease || 'power1.inOut', immediateRender: true }, o.en || 0);
  };

  // ── PATRONES (los SVG de kit.patron) ───────────────────────────────────
  // data-modo: aparece (por defecto) | cae (confeti) | dibuja (flujo, curvas).
  // El orden de aparición es aleatorio pero con semilla: siempre el mismo.
  R.piezas = function (tl, el, o) {
    var ps = lista(el.querySelectorAll('[data-pieza]'));
    if (!ps.length) return;
    var r = prng(o.semilla || el.getAttribute('data-semilla') || 'piezas');
    var orden = ps.map(function () { return r(); }), giro = ps.map(function () { return r() * 2 - 1; });
    var abanico = o.abanico == null ? 0.9 : o.abanico, en = o.en || 0, modo = o.modo || 'aparece';
    var retraso = function (i) { return orden[i] * abanico; };
    if (modo === 'dibuja') {
      dibujar(tl, ps, { en: en, dur: o.dur || 1.4, escalon: retraso, ease: 'power1.inOut' });
    } else if (modo === 'sube') {
      // capas que suben en orden (olas): la primera pieza es la del fondo
      tl.from(ps, { y: o.altura || 520, duration: o.dur || 1, ease: 'power3.out', stagger: o.escalon || 0.12 }, en);
    } else if (modo === 'cae') {
      // Caen desde arriba del propio SVG (su alto en unidades del viewBox).
      var svgCae = el.tagName === 'svg' ? el : el.querySelector('svg');
      var altoVb = svgCae && svgCae.viewBox && svgCae.viewBox.baseVal ? svgCae.viewBox.baseVal.height : 1500;
      tl.from(ps, { y: -(o.altura || altoVb * 0.75), rotation: function (i) { return giro[i] * 260; }, duration: o.dur || 1.1,
        ease: 'power2.out', stagger: retraso }, en);
    } else {
      tl.from(ps, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: o.dur || 0.5, ease: 'back.out(2)', stagger: retraso }, en);
    }
  };

  // ── API ────────────────────────────────────────────────────────────────
  var NUM = /^-?\\d+(\\.\\d+)?$/;
  function leer(el) {
    var o = {}, d = el.dataset;
    for (var k in d) {
      if (k === 'efecto') continue;
      var v = d[k];
      o[k] = NUM.test(v) ? parseFloat(v) : v;
    }
    return o;
  }
  window.efecto = function (nombre, tl, el, opciones) {
    if (!el) return tl;
    var f = R[nombre];
    if (!f) { console.warn('efecto desconocido:', nombre); return tl; }
    f(tl, el, opciones || {});
    return tl;
  };
  window.efectosDeclarados = function (tl, s) {
    lista(s.querySelectorAll('[data-efecto]')).forEach(function (el) {
      el.getAttribute('data-efecto').split(/\\s+/).forEach(function (nombre) { window.efecto(nombre, tl, el, leer(el)); });
    });
  };
  window.efectosDisponibles = Object.keys(R);
})();
</${'script'}>`;

// ── Piezas de build-time que algunas recetas necesitan en el HTML ────────
const { prng, semillaDe } = require('./kit-patrones.cjs');

/** Imagen que se destapa a brochazos (receta 'pincel'). Devuelve un <svg>
 *  con la imagen enmascarada por trazos gruesos [data-trazo] que la receta
 *  dibuja de arriba abajo. `ancho`/`alto` son los del hueco donde va. */
const pincel = (src, alt, { ancho = 912, alto = 600, trazos = 6, semilla = src } = {}) => {
  const r = prng(`pincel:${semilla}`), id = `pincel-${semillaDe(src + semilla).toString(36)}`;
  const fila = alto / trazos, grosor = fila * 1.55, d = [];
  for (let i = 0; i < trazos; i++) {
    const y = fila * (i + 0.5), ida = i % 2 === 0, x1 = ida ? -grosor * 0.4 : ancho + grosor * 0.4, x2 = ida ? ancho + grosor * 0.4 : -grosor * 0.4;
    const pts = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([x1 + (x2 - x1) * t, y + Math.sin(t * Math.PI * 2 + i) * fila * 0.12 + (r() * 2 - 1) * fila * 0.06]); }
    d.push(`<path data-trazo d="M${pts.map(([x, yy]) => `${x.toFixed(1)} ${yy.toFixed(1)}`).join('L')}" fill="none" stroke="#FFF" stroke-width="${grosor.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  return `<svg viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${alt}" data-pincel style="display:block;width:100%;height:100%">` +
    `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}">${d.join('')}</mask></defs>` +
    `<image href="${src}" x="0" y="0" width="${ancho}" height="${alto}" preserveAspectRatio="xMidYMid slice" mask="url(#${id})"/></svg>`;
};

/** Filtro SVG de duotono (receta 'duotono'): sombras → `oscuro`, luces → `claro`.
 *  Va una vez en el HTML (p. ej. dentro de la lámina que lo usa). */
const duotono = (id = 'efx-duotono', oscuro = '#140A1E', claro = '#FF4FA8') => {
  const a = parseInt(oscuro.slice(1), 16), b = parseInt(claro.slice(1), 16);
  const canal = (sh) => `${(((a >> sh) & 255) / 255).toFixed(3)} ${(((b >> sh) & 255) / 255).toFixed(3)}`;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${id}" color-interpolation-filters="sRGB">` +
    `<feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"/>` +
    `<feComponentTransfer><feFuncR type="table" tableValues="${canal(16)}"/><feFuncG type="table" tableValues="${canal(8)}"/>` +
    `<feFuncB type="table" tableValues="${canal(0)}"/></feComponentTransfer></filter></svg>`;
};

/** Filtro SVG de glitch (receta 'glitch'): ruido en franjas horizontales que
 *  desplaza la imagen. La semilla del ruido es fija: el video sale igual. */
const glitch = (id = 'efx-glitch', { frecuencia = '0.0006 0.11' } = {}) =>
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">` +
  `<feTurbulence type="fractalNoise" baseFrequency="${frecuencia}" numOctaves="1" seed="1" result="ruido"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="ruido" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`;

module.exports = { efectos, pincel, duotono, glitch };
