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
  // Mismo hash que semillaDe() de kit-patrones (por code points): así random(semilla) en la página
  // y kit.random(semilla) en build-time dan la misma secuencia.
  function semilla(txt) { var h = 2166136261 >>> 0; for (var c of String(txt)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
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
    var sep = o.separador == null ? '\\u00A0' : o.separador, dec = o.decimales || 0, pre = o.prefijo == null ? '' : String(o.prefijo), suf = o.sufijo == null ? '' : String(o.sufijo);
    var ini = o.desde || 0, est = { v: ini };
    function pinta() {
      var t = est.v.toFixed(dec).split('.');
      el.textContent = pre + t[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep) + (t[1] ? ',' + t[1] : '') + suf;
    }
    tl.fromTo(est, { v: ini }, { v: fin, duration: o.dur || 1.2, ease: o.ease || 'power2.out', immediateRender: true, onUpdate: pinta }, o.en || 0);
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

  // Dibujo a líneas de kit.lineas: capa por capa, como una sola pluma —
  // silueta, pliegues, detalles, achurado y al final las cotas con su medida.
  R.traza = function (tl, el, o) {
    var svg = el.matches && el.matches('[data-lineas]') ? el : el.querySelector('[data-lineas]');
    if (!svg) return;
    var en = o.en || 0, dur = o.dur || 2.4;
    [['silueta', 0, 0.42], ['pliegue', 0.2, 0.6], ['detalle', 0.38, 0.8], ['achurado', 0.55, 0.95], ['cota', 0.72, 1]].forEach(function (c) {
      var ps = lista(svg.querySelectorAll('[data-capa="' + c[0] + '"] path'));
      if (!ps.length) return;
      var ventana = dur * (c[2] - c[1]), esc = Math.min(0.08, (ventana * 0.5) / ps.length);
      dibujar(tl, ps, { en: en + dur * c[1], dur: ventana - esc * (ps.length - 1), escalon: esc, ease: 'power1.inOut' });
    });
    var textos = svg.querySelectorAll('[data-capa="cota"] text');
    if (textos.length) tl.from(textos, { opacity: 0, duration: 0.4, stagger: 0.06 }, en + dur * 0.86);
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

  // ── SEGUNDA TANDA (docs/efectos-svg.md) ───────────────────────────────
  // Todas sin plugins y sin azar: los puntos que viajan por un camino se
  // calculan con getPointAtLength() en cada cuadro, así el seek es exacto.

  // Quemado: la imagen aparece (o se deshace) a manchas con borde de brasa.
  // Necesita el filtro de kit.quemado(); GSAP mueve el umbral del ruido.
  R.quemado = function (tl, el, o) {
    var f = document.getElementById(o.filtro || 'efx-quemado');
    if (!f) return;
    guardaEstilo(el);
    el.style.filter = 'url(#' + f.id + ')';
    var a1 = f.querySelector('[data-umbral="1"]'), a2 = f.querySelector('[data-umbral="2"]');
    var M = function (k) { return '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -30 0 0 0 ' + k; };
    var aparece = (o.hacia || 'aparece') === 'aparece', desde = aparece ? 4 : 36, hasta = aparece ? 36 : 4;
    var dur = o.dur || 1.6, en = o.en || 0, ease = 'power1.inOut';
    tl.fromTo(a1, { attr: { values: M(desde) } }, { attr: { values: M(hasta) }, duration: dur, ease: ease }, en)
      .fromTo(a2, { attr: { values: M(desde + 0.9) } }, { attr: { values: M(hasta + 0.9) }, duration: dur, ease: ease }, en);
  };

  // Tinta: una mancha orgánica crece desde un punto y destapa el arte. La
  // máscara (círculo deformado con ruido) la emite kit.tinta().
  R.tinta = function (tl, el, o) {
    var m = document.getElementById(o.mascara || 'efx-tinta');
    if (!m) return;
    guardaEstilo(el);
    el.style.webkitMask = 'url(#' + m.id + ')';
    el.style.mask = 'url(#' + m.id + ')';
    var c = m.querySelector('circle');
    tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: parseFloat(c.getAttribute('data-r')) }, duration: o.dur || 1.6, ease: o.ease || 'power2.in' }, o.en || 0);
  };

  // Contorno: el arte aparece primero como dibujo de líneas sacado de sí mismo
  // (el <svg data-contorno> de kit.contorno()) y luego entra a color.
  R.contorno = function (tl, el, o) {
    var svg = el.querySelector('[data-contorno]'), img = imagenDe(el);
    if (!svg) return;
    // Son cientos de trazos: el escalón se reparte en la mitad de la duración
    // para que el dibujo termine a tiempo pase lo que pase con el arte.
    var en = o.en || 0, dur = o.dur || 1.5, trazos = svg.querySelectorAll('path');
    var esc = o.escalon == null ? (dur * 0.5) / Math.max(1, trazos.length) : o.escalon;
    dibujar(tl, trazos, { en: en, dur: dur - esc * trazos.length, escalon: esc, ease: 'power1.inOut' });
    var color = en + dur * 0.9;
    if (img) tl.fromTo(img, { opacity: 0 }, { opacity: 1, duration: o.fundido || 0.9, ease: 'power1.inOut' }, color);
    tl.fromTo(svg, { opacity: 1 }, { opacity: parseFloat(svg.getAttribute('data-queda') || '0.18'), duration: o.fundido || 0.9 }, color + 0.1);
  };

  // Cometa: el trazo se dibuja con un punto brillante en la punta.
  R.cometa = function (tl, el, o) {
    var NS = 'http://www.w3.org/2000/svg';
    var caminos = lista(el.querySelectorAll('[data-camino]'));
    if (!caminos.length) caminos = lista(el.querySelectorAll('path'));
    caminos.forEach(function (c, k) {
      guardaEstilo(c);
      var L = c.getTotalLength(), color = o.color || c.getAttribute('stroke') || '#FFFFFF', r = o.radio || 8;
      var punta = document.createElementNS(NS, 'g');
      [[r * 3.2, 0.16], [r * 1.9, 0.35], [r, 1]].forEach(function (a, j) {
        var ci = document.createElementNS(NS, 'circle');
        ci.setAttribute('r', a[0]);
        ci.setAttribute('fill', j === 2 ? '#FFFFFF' : color);
        ci.setAttribute('opacity', a[1]);
        punta.appendChild(ci);
      });
      c.parentNode.appendChild(punta);
      deshacer(el, function () { punta.remove(); });
      c.style.strokeDasharray = L + 1;
      var est = { p: 0 };
      var pinta = function () {
        var q = c.getPointAtLength(L * est.p);
        punta.setAttribute('transform', 'translate(' + q.x + ' ' + q.y + ')');
        c.style.strokeDashoffset = (L + 1) * (1 - est.p);
      };
      var ini = (o.en || 0) + k * (o.escalon == null ? 0.25 : o.escalon), dur = o.dur || 1.6;
      tl.fromTo(est, { p: 0 }, { p: 1, duration: dur, ease: o.ease || 'power2.inOut', immediateRender: true, onUpdate: pinta }, ini);
      if (o.queda !== 'si') tl.to(punta, { opacity: 0, duration: 0.35 }, ini + dur);
      pinta();
    });
  };

  // Sello: cae desde grande, golpea y la lámina tiembla (sin azar: el temblor
  // es una secuencia fija que se apaga).
  R.sello = function (tl, el, o) {
    var en = o.en || 0, dur = o.dur || 0.42;
    tl.from(el, { scale: o.desde || 2.4, opacity: 0, rotation: '+=10', duration: dur, ease: 'power4.in' }, en);
    if (o.temblor === 'no') return;
    var f = o.fuerza || 14, blanco = el.parentElement;
    tl.to(blanco, { keyframes: [{ x: -f, y: f * 0.5, duration: 0.05 }, { x: f * 0.8, y: -f * 0.4, duration: 0.05 },
      { x: -f * 0.5, y: f * 0.3, duration: 0.05 }, { x: f * 0.25, y: -f * 0.15, duration: 0.05 }, { x: 0, y: 0, duration: 0.06 }], ease: 'none' }, en + dur);
  };

  // Ventana: el nombre gigante es la ventana al arte; la cámara entra por las
  // letras hasta la imagen completa. La máscara la emite kit.ventana().
  R.ventana = function (tl, el, o) {
    var m = document.getElementById(o.mascara || 'efx-ventana');
    if (!m) return;
    guardaEstilo(el);
    el.style.webkitMask = 'url(#' + m.id + ')';
    el.style.mask = 'url(#' + m.id + ')';
    var letras = m.querySelector('[data-letras]'), fondo = m.querySelector('[data-fondo-ventana]');
    var cx = parseFloat(letras.getAttribute('data-cx')), cy = parseFloat(letras.getAttribute('data-cy'));
    var en = o.en || 0.5, dur = o.dur || 1.4, z = o.zoom || 14, est = { s: 1 };
    var pinta = function () {
      letras.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') scale(' + est.s + ') translate(' + (-cx) + ' ' + (-cy) + ')');
    };
    tl.fromTo(est, { s: 1 }, { s: z, duration: dur, ease: 'power3.in', immediateRender: true, onUpdate: pinta }, en)
      .fromTo(fondo, { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: dur * 0.45, ease: 'power1.in' }, en + dur * 0.6);
    pinta();
  };

  // Cámara: paneo y zoom entre varios focos del arte.
  // data-focos="62 30 2.2; 40 70 1.8; 50 50 1"  (x% y% zoom por foco)
  R.camara = function (tl, el, o) {
    var img = imagenDe(el) || el.firstElementChild;
    if (!img) return;
    var W = el.clientWidth, H = el.clientHeight;
    var focos = String(o.focos || '50 50 1').split(';').map(function (f) {
      var p = f.split(' ').filter(function (x) { return x; }).map(parseFloat);
      var z = p[2] || 1, x = W / 2 - (p[0] / 100) * W * z, y = H / 2 - (p[1] / 100) * H * z;
      return { scale: z, x: Math.min(0, Math.max(W - W * z, x)), y: Math.min(0, Math.max(H - H * z, y)), transformOrigin: '0 0' };
    });
    var t = o.en || 0, paso = o.dur || 0.9, pausa = o.pausa == null ? 0.3 : o.pausa;
    for (var i = 1; i < focos.length; i++) {
      tl.fromTo(img, focos[i - 1], Object.assign({ duration: paso, ease: 'power2.inOut', immediateRender: i === 1 }, focos[i]), t + (i - 1) * (paso + pausa));
    }
  };

  // Línea: la gráfica de kit.grafica() se dibuja, el área se destapa al mismo
  // ritmo, un punto va en la punta y el valor lo acompaña.
  R.linea = function (tl, el, o) {
    var svg = el.matches && el.matches('[data-grafica]') ? el : el.querySelector('[data-grafica]');
    if (!svg) return;
    var ln = svg.querySelector('[data-linea]'), av = svg.querySelector('[data-avance]'), punta = svg.querySelector('[data-punta]');
    var val = svg.querySelector('[data-valor]'), hitos = lista(svg.querySelectorAll('[data-hito]'));
    var xs = JSON.parse(svg.getAttribute('data-xs')), vs = JSON.parse(svg.getAttribute('data-vs'));
    var W = parseFloat(av.getAttribute('width')), L = ln.getTotalLength();
    var sep = svg.getAttribute('data-sep') || ' ', dec = +(svg.getAttribute('data-dec') || 0), suf = svg.getAttribute('data-suf') || '';
    var fmt = function (v) {
      var t = v.toFixed(dec).split('.'), e = t[0], s = '';
      while (e.length > 3) { s = sep + e.slice(-3) + s; e = e.slice(0, -3); }
      return e + s + (t[1] ? ',' + t[1] : '') + suf;
    };
    var estado = { punta: punta.getAttribute('transform'), texto: val.textContent, x: val.getAttribute('x'), y: val.getAttribute('y'), ancho: av.getAttribute('width') };
    guardaEstilo(ln);
    deshacer(el, function () {
      av.setAttribute('width', estado.ancho); punta.setAttribute('transform', estado.punta);
      val.textContent = estado.texto; val.setAttribute('x', estado.x); val.setAttribute('y', estado.y);
      hitos.forEach(function (h) { h.style.opacity = ''; });
    });
    // La animación avanza en x, no en largo: así puede arrancar y parar en un
    // punto de la serie (data-hasta = cuántos puntos enseña la lámina; o.desdePunto
    // = desde cuál arranca, que es lo que usa continua para «sigue»).
    var n = xs.length, hasta = Math.max(1, Math.min(n, +(svg.getAttribute('data-hasta') || n)));
    var x0 = xs[Math.max(1, Math.min(hasta, o.desdePunto || 1)) - 1], x1 = xs[hasta - 1];
    var largoEn = function (x) {
      var lo = 0, hi = L;
      for (var i = 0; i < 24; i++) { var m = (lo + hi) / 2; if (ln.getPointAtLength(m).x < x) lo = m; else hi = m; }
      return hi;
    };
    ln.style.strokeDasharray = L + 1;
    var est = { x: x0 };
    var pinta = function () {
      var l = largoEn(est.x), q = ln.getPointAtLength(l);
      ln.style.strokeDashoffset = (L + 1) - l;
      av.setAttribute('width', q.x);
      punta.setAttribute('transform', 'translate(' + q.x + ' ' + q.y + ')');
      var k = 0;
      while (k < xs.length - 2 && q.x > xs[k + 1]) k++;
      var f = Math.max(0, Math.min(1, (q.x - xs[k]) / ((xs[k + 1] - xs[k]) || 1)));
      val.textContent = fmt(vs[k] + (vs[k + 1] - vs[k]) * f);
      val.setAttribute('x', Math.max(60, Math.min(W - 60, q.x)));
      val.setAttribute('y', q.y - 34);
      hitos.forEach(function (h) { h.style.opacity = parseFloat(h.getAttribute('cx')) <= q.x + 0.5 ? 1 : 0; });
    };
    tl.fromTo(est, { x: x0 }, { x: x1, duration: o.dur || 1.8, ease: o.ease || 'power1.inOut', immediateRender: true, onUpdate: pinta }, o.en || 0);
    pinta();
  };

  // ── CONTINUIDAD ────────────────────────────────────────────────────────
  // El mismo elemento (data-continua="nombre") en láminas seguidas: al entrar,
  // arranca como estaba en la lámina de la que venimos y llega a su estado.
  // Es el Morph de PowerPoint / Magic Move de Keynote. La pareja es la lámina
  // anterior EN EL ORDEN DEL DECK (así el video cuadro a cuadro, que siempre
  // avanza, es determinista); si se llegó retrocediendo, la siguiente.
  //   data-como = mueve | cuenta | transforma | crece | sigue | camara
  //   (varios separados por espacio; sin data-como se deduce del elemento)
  var vista = null;
  document.addEventListener('slidechange', function (e) { var d = e.detail || {}; vista = { de: d.previousIndex, a: d.index }; }, true);
  function seccionesDe(s) { return lista(s.parentNode ? s.parentNode.children : []).filter(function (x) { return x.tagName === 'SECTION'; }); }
  function origenDe(s) {
    var todas = seccionesDe(s), i = todas.indexOf(s);
    if (vista && vista.a === i && vista.de === i + 1) return todas[i + 1];
    return i > 0 ? todas[i - 1] : null;
  }
  // Caja en coordenadas de diseño, con offsets de layout: no las mueven los
  // transforms (ni los from() que otras recetas ya aplicaron) ni la escala de
  // deck-stage. Los elementos SVG no tienen offsets: van por su rectángulo.
  function abs(e) { var x = 0, y = 0; while (e) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x, y]; }
  function cajaEn(el, s) {
    if (!(el instanceof HTMLElement)) {
      var r = el.getBoundingClientRect(), rs = s.getBoundingClientRect(), k = rs.width / (s.offsetWidth || rs.width) || 1;
      return { x: (r.left - rs.left) / k, y: (r.top - rs.top) / k, w: r.width / k, h: r.height / k };
    }
    var x = 0, y = 0, e = el;
    while (e && e !== s) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    if (e !== s) { var b = abs(s); x -= b[0]; y -= b[1]; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function numeroDe(el) {
    var c = el.getAttribute('data-cuenta');
    if (c != null) return parseFloat(c);
    return parseFloat(el.textContent.replace(/[^0-9,.-]/g, '').replace(/\\.(?=\\d{3}(\\D|$))/g, '').replace(',', '.')) || 0;
  }
  function progresoDe(el) { var p = el.getAttribute('data-progreso'); return p == null ? 1 : parseFloat(p); }
  function ultimoFoco(el) { var f = String(el.getAttribute('data-focos') || '50 50 1').split(';'); return f[f.length - 1].trim() || '50 50 1'; }
  // Recorte que hace una imagen con object-fit: cover dentro de su caja.
  function recorte(img, c) {
    var iw = img.naturalWidth || c.w, ih = img.naturalHeight || c.h, k = Math.max(c.w / iw, c.h / ih);
    var pos = (getComputedStyle(img).objectPosition || '50% 50%').split(' ').map(function (v) { return v.indexOf('%') > 0 ? parseFloat(v) / 100 : 0.5; });
    return { x: c.x + (c.w - iw * k) * pos[0], y: c.y + (c.h - ih * k) * pos[1], w: iw * k, h: ih * k };
  }
  function modosDe(el, par) {
    var c = el.getAttribute('data-como');
    if (c) return c.split(/\\s+/);
    if (el.hasAttribute('data-focos')) return ['camara'];
    if (el.matches('[data-grafica]') || el.querySelector('[data-grafica]')) return ['sigue'];
    if (el.hasAttribute('data-progreso')) return ['sigue'];
    if (el.tagName.toLowerCase() === 'path' && par.getAttribute('d') !== el.getAttribute('d')) return ['transforma'];
    return el.hasAttribute('data-cuenta') ? ['mueve', 'cuenta'] : ['mueve'];
  }
  // Interpola el avance de un trazo con pathLength="1" (data-progreso de 0 a 1).
  function sigueTrazo(tl, el, par, o) {
    if (!el.getAttribute('pathLength')) return;
    tl.fromTo(el, { attr: { 'stroke-dashoffset': 1 - progresoDe(par) } }, { attr: { 'stroke-dashoffset': 1 - progresoDe(el) }, duration: o.dur, ease: o.ease }, o.en);
  }
  var MODOS = {
    mueve: function (tl, el, par, a, b, o) {
      if (o.uniforme) {
        var k = Math.min(a.w / b.w, a.h / b.h);
        tl.from(el, { x: a.x + a.w / 2 - (b.x + b.w * k / 2) , y: a.y + a.h / 2 - (b.y + b.h * k / 2), scale: k, transformOrigin: '0 0', duration: o.dur, ease: o.ease }, o.en);
      } else {
        tl.from(el, { x: a.x - b.x, y: a.y - b.y, scaleX: a.w / b.w, scaleY: a.h / b.h, transformOrigin: '0 0', duration: o.dur, ease: o.ease }, o.en);
      }
      // los trazos de avance de adentro (anillos, barras) siguen desde los de la pareja
      var mios = lista(el.querySelectorAll('[data-progreso]')), suyos = lista(par.querySelectorAll('[data-progreso]'));
      mios.forEach(function (m, i) { if (suyos[i]) sigueTrazo(tl, m, suyos[i], o); });
    },
    cuenta: function (tl, el, par, a, b, o) {
      R.contador(tl, el, Object.assign({}, o, { cuenta: numeroDe(el), desde: numeroDe(par), ease: 'power2.inOut' }));
    },
    transforma: function (tl, el, par, a, b, o) {
      if (window.MorphSVGPlugin && el.tagName.toLowerCase() === 'path') tl.from(el, { morphSVG: par, duration: o.dur, ease: o.ease }, o.en);
      var cs = getComputedStyle(par), cm = getComputedStyle(el), desde = {};
      if (cs.fill !== cm.fill) desde.fill = cs.fill;
      if (cs.stroke !== cm.stroke) desde.stroke = cs.stroke;
      if (Object.keys(desde).length) tl.from(el, Object.assign(desde, { duration: o.dur, ease: o.ease }), o.en);
    },
    // Un marco chico de la lámina anterior se vuelve este elemento grande: la
    // ventana (clip-path) arranca en la caja del marco y la imagen de adentro,
    // donde la pareja la enseñaba. Exacto si las dos usan el mismo archivo.
    crece: function (tl, el, par, a, b, o) {
      guardaEstilo(el);
      var rad = parseFloat(getComputedStyle(par).borderTopLeftRadius) || 0;
      var ins = function (t, r, bo, l, rr) { return 'inset(' + t + 'px ' + r + 'px ' + bo + 'px ' + l + 'px round ' + rr + 'px)'; };
      tl.fromTo(el, { clipPath: ins(a.y - b.y, b.x + b.w - a.x - a.w, b.y + b.h - a.y - a.h, a.x - b.x, rad) },
        { clipPath: ins(0, 0, 0, 0, 0), duration: o.dur, ease: o.ease }, o.en);
      var img = imagenDe(el), imgPar = imagenDe(par);
      if (img && imgPar) {
        var ra = recorte(imgPar, cajaEn(imgPar, seccionDe(par))), cb = cajaEn(img, seccionDe(el)), rb = recorte(img, cb), k = ra.w / rb.w;
        tl.from(img, { x: ra.x - cb.x - k * (rb.x - cb.x), y: ra.y - cb.y - k * (rb.y - cb.y), scale: k, transformOrigin: '0 0', duration: o.dur, ease: o.ease }, o.en);
      }
    },
    sigue: function (tl, el, par, a, b, o) {
      var g = el.matches('[data-grafica]') ? el : el.querySelector('[data-grafica]');
      if (g) {
        var gp = par.matches('[data-grafica]') ? par : par.querySelector('[data-grafica]');
        var desde = gp ? +(gp.getAttribute('data-hasta') || JSON.parse(gp.getAttribute('data-xs')).length) : 1;
        return R.linea(tl, g, Object.assign({}, o, { desdePunto: desde, ease: o.ease }));
      }
      sigueTrazo(tl, el, par, o);
    },
    camara: function (tl, el, par, a, b, o) {
      R.camara(tl, el, Object.assign({}, o, { focos: ultimoFoco(par) + ';' + (el.getAttribute('data-focos') || '50 50 1'), pausa: o.pausa == null ? 0.25 : o.pausa }));
    },
  };
  // Lo que cada modo ya anima: si el elemento también lo declara con
  // data-efecto, la receta suelta no corre (la continuidad la sustituye).
  var SUSTITUYE = { cuenta: 'contador', transforma: 'transforma', sigue: 'linea', camara: 'camara' };
  window.continua = function (tl, s) {
    var hechos = [], origen = origenDe(s);
    if (!origen) return hechos;
    var pares = lista(s.querySelectorAll('[data-continua]')).map(function (el) {
      return { el: el, par: origen.querySelector('[data-continua="' + el.getAttribute('data-continua') + '"]') };
    }).filter(function (p) { return p.par; });
    if (!pares.length) return hechos;
    // Medir todo antes de que ningún from() mueva nada.
    pares.forEach(function (p) { p.a = cajaEn(p.par, origen); p.b = cajaEn(p.el, s); });
    var fondoA = getComputedStyle(origen).backgroundColor, fondoB = getComputedStyle(s).backgroundColor;
    if (fondoA !== fondoB && s.getAttribute('data-continua-fondo') !== 'no') {
      guardaEstilo(s);
      tl.fromTo(s, { backgroundColor: fondoA }, { backgroundColor: fondoB, duration: 0.9, ease: 'power2.inOut' }, 0);
    }
    pares.forEach(function (p) {
      var o = leer(p.el);
      o.dur = o.dur || 0.9; o.en = o.en || 0; o.ease = o.ease || 'power3.inOut';
      // anidado en otro elemento que viaja: su posición ya la lleva el de afuera
      var anidado = p.el.parentElement && p.el.parentElement.closest('[data-continua]');
      anidado = anidado && s.contains(anidado);
      var modos = modosDe(p.el, p.par).filter(function (m) { return MODOS[m] && !(anidado && (m === 'mueve' || m === 'crece')); });
      modos.forEach(function (m) { MODOS[m](tl, p.el, p.par, p.a, p.b, o); });
      hechos.push({ el: p.el, modos: modos });
    });
    return hechos;
  };

  // ── API ────────────────────────────────────────────────────────────────
  var NUM =/^-?\\d+(\\.\\d+)?$/;
  function leer(el) {
    var o = {}, d = el.dataset;
    for (var k in d) {
      if (k === 'efecto') continue;
      var v = d[k];
      o[k] = NUM.test(v) ? parseFloat(v) : v;
    }
    return o;
  }
  // PRNG con semilla para coreografías propias (nunca Math.random: rompe el render cuadro a cuadro)
  window.random = prng;
  window.efecto = function (nombre, tl, el, opciones) {
    if (!el) return tl;
    var f = R[nombre];
    if (!f) { console.warn('efecto desconocido:', nombre); return tl; }
    f(tl, el, opciones || {});
    return tl;
  };
  window.efectosDeclarados = function (tl, s) {
    // La continuidad mide primero, antes de que las demás recetas apliquen sus from().
    var omitir = [];
    window.continua(tl, s).forEach(function (h) {
      h.modos.forEach(function (m) { if (SUSTITUYE[m]) omitir.push({ el: h.el, nombre: SUSTITUYE[m] }); });
    });
    lista(s.querySelectorAll('[data-efecto]')).forEach(function (el) {
      el.getAttribute('data-efecto').split(/\\s+/).forEach(function (nombre) {
        var sustituida = omitir.some(function (x) { return x.nombre === nombre && (x.el === el || x.el.contains(el)); });
        if (!sustituida) window.efecto(nombre, tl, el, leer(el));
      });
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

// ── Segunda tanda: piezas de build-time ──────────────────────────────────
const svgOculto = (cuerpo) => `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${cuerpo}</svg>`;
const n1 = (v) => Math.round(v * 10) / 10;

/** Filtro de la receta 'quemado': ruido fijo con dos umbrales; el borde entre
 *  ellos se pinta de `brasa` con un brillo. Va una vez en el HTML. */
const quemado = (id = 'efx-quemado', { brasa = '#FF7A1A', frecuencia = 0.005, semilla = 7 } = {}) => {
  const M = (k) => `0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -30 0 0 0 ${k}`;
  return svgOculto(`<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${frecuencia}" numOctaves="4" seed="${semilla}" result="n"/>` +
    `<feColorMatrix data-umbral="1" in="n" type="matrix" values="${M(36)}" result="a"/>` +
    `<feColorMatrix data-umbral="2" in="n" type="matrix" values="${M(36.9)}" result="b"/>` +
    `<feComposite in="b" in2="a" operator="out" result="borde"/>` +
    `<feFlood flood-color="${brasa}"/><feComposite in2="borde" operator="in" result="brasa"/>` +
    `<feGaussianBlur in="brasa" stdDeviation="3" result="brasaB"/>` +
    `<feComposite in="SourceGraphic" in2="a" operator="in" result="img"/>` +
    `<feMerge><feMergeNode in="img"/><feMergeNode in="brasaB"/><feMergeNode in="brasa"/></feMerge></filter>`);
};

/** Máscara de la receta 'tinta': un círculo deformado con ruido que crece desde
 *  `origen` (fracciones). `ancho`/`alto` son los del elemento enmascarado. */
const tinta = (id = 'efx-tinta', { ancho = 912, alto = 960, origen = [0.5, 0.5], semilla = 3, escala = 110 } = {}) => {
  const cx = ancho * origen[0], cy = alto * origen[1];
  const r = Math.hypot(Math.max(cx, ancho - cx), Math.max(cy, alto - cy)) + escala;
  return svgOculto(`<defs><filter id="${id}-f" filterUnits="userSpaceOnUse" x="${-ancho * 0.3}" y="${-alto * 0.3}" width="${ancho * 1.6}" height="${alto * 1.6}">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="${semilla}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${escala}" xChannelSelector="R" yChannelSelector="G"/></filter>` +
    `<mask id="${id}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}">` +
    `<g filter="url(#${id}-f)"><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" data-r="${n1(r)}" fill="#FFFFFF"/></g></mask></defs>`);
};

/** Máscara de la receta 'ventana': el `texto` gigante, que luego se amplía
 *  desde `origen` hasta abrir la imagen entera. */
const ventana = (texto, { id = 'efx-ventana', ancho = 912, alto = 960, origen = [0.5, 0.5], fuente = "'Bebas Neue', Impact, sans-serif", tam = null } = {}) => {
  const fs = tam || Math.min(alto * 0.72, (ancho * 0.92) / Math.max(1, texto.length) * 3.2);
  return svgOculto(`<mask id="${id}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}">` +
    `<g data-letras data-cx="${n1(ancho * origen[0])}" data-cy="${n1(alto * origen[1])}"><text x="${ancho / 2}" y="${alto / 2}" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${fuente}" font-size="${n1(fs)}" fill="#FFFFFF" textLength="${n1(ancho * 0.9)}" lengthAdjust="spacingAndGlyphs">${texto}</text></g>` +
    `<rect data-fondo-ventana x="0" y="0" width="${ancho}" height="${alto}" fill="#FFFFFF" opacity="1"/></mask>`);
};

/** Sello de tinta (receta 'sello'): marco doble y texto, con huecos de tinta y
 *  bordes irregulares por un ruido con semilla fija. */
const sello = (texto, { color = '#E5483E', ancho = 560, alto = 220, rotacion = -8, semilla = 4 } = {}) => {
  const id = `sello-${semillaDe(texto + semilla).toString(36)}`;
  return `<svg data-sello viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${texto}" style="display:block;width:${ancho}px;max-width:100%;height:auto;transform:rotate(${rotacion}deg)">` +
    `<defs><filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${semilla}" result="g"/>` +
    `<feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3 0 0 0 2.35" result="huecos"/>` +
    `<feComposite in="SourceGraphic" in2="huecos" operator="in" result="tinta"/>` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${semilla + 1}" result="ondas"/>` +
    `<feDisplacementMap in="tinta" in2="ondas" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter></defs>` +
    `<g filter="url(#${id})" fill="none" stroke="${color}">` +
    `<rect x="8" y="8" width="${ancho - 16}" height="${alto - 16}" rx="18" stroke-width="10"/>` +
    `<rect x="26" y="26" width="${ancho - 52}" height="${alto - 52}" rx="10" stroke-width="3"/>` +
    `<text x="${ancho / 2}" y="${alto / 2 + 4}" text-anchor="middle" dominant-baseline="central" font-family="'Bebas Neue', Impact, sans-serif" ` +
    `font-size="${n1(alto * 0.58)}" fill="${color}" stroke="none" textLength="${ancho - 100}" lengthAdjust="spacingAndGlyphs">${texto}</text></g></svg>`;
};

/** Gráfica de línea (receta 'linea'), con viewBox en píxeles reales para que
 *  getTotalLength() cuadre con lo dibujado. `valores` en orden; `etiquetas`
 *  opcionales bajo cada punto. */
let graficas = 0;
const grafica = (valores, { ancho = 912, alto = 560, color = '#FF6A3D', area = color, margen = 60, min = null, max = null, hasta = null,
  etiquetas = [], textoColor = '#F2EFE8', ejeColor = 'rgba(255,255,255,.14)', decimales = 0, sufijo = '', separador = ' ', tamValor = 46 } = {}) => {
  // hasta: cuántos puntos enseña (los demás quedan recortados). Con la misma
  // serie y un hasta mayor en la lámina siguiente, continua «sigue» la línea.
  const h = Math.max(1, Math.min(valores.length, hasta || valores.length)), parcial = h < valores.length;
  const lo = min ?? Math.min(...valores), hi = max ?? Math.max(...valores);
  const xs = valores.map((_, i) => margen + (i * (ancho - 2 * margen)) / Math.max(1, valores.length - 1));
  const ys = valores.map((v) => alto - margen - ((v - lo) / ((hi - lo) || 1)) * (alto - 2 * margen - tamValor));
  const linea = 'M' + xs.map((x, i) => `${n1(x)} ${n1(ys[i])}`).join('L');
  const zona = `${linea}L${n1(xs.at(-1))} ${alto - margen}L${n1(xs[0])} ${alto - margen}Z`;
  // El id lleva un contador: dos gráficas iguales en el mismo deck (la de
  // «sigue») no pueden compartir el clipPath.
  const id = `graf-${semillaDe(valores.join(',') + color).toString(36)}-${++graficas}`;
  const fmt = (v) => { const t = v.toFixed(decimales).split('.'); return t[0].replace(/\B(?=(\d{3})+(?!\d))/g, separador) + (t[1] ? ',' + t[1] : '') + sufijo; };
  return `<svg data-grafica viewBox="0 0 ${ancho} ${alto}" data-xs="${JSON.stringify(xs.map(n1))}" data-vs="${JSON.stringify(valores)}" data-sep="${separador}" data-dec="${decimales}" data-suf="${sufijo}"${parcial ? ` data-hasta="${h}"` : ''} ` +
    `style="display:block;width:100%;height:auto;overflow:visible" role="img" aria-label="Gráfica: ${valores.join(', ')}">` +
    `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${area}" stop-opacity=".42"/><stop offset="1" stop-color="${area}" stop-opacity="0"/></linearGradient>` +
    `<clipPath id="${id}-c"><rect data-avance x="0" y="0" width="${parcial ? n1(xs[h - 1]) : ancho}" height="${alto}"/></clipPath></defs>` +
    `<line x1="${margen}" y1="${alto - margen}" x2="${ancho - margen}" y2="${alto - margen}" stroke="${ejeColor}" stroke-width="2"/>` +
    etiquetas.map((e, i) => `<text x="${n1(xs[i])}" y="${alto - margen + 34}" text-anchor="middle" font-family="'Barlow', system-ui, sans-serif" font-size="22" font-weight="600" fill="${ejeColor.replace(/[\d.]+\)$/, '.55)')}">${e}</text>`).join('') +
    `<path data-area d="${zona}" fill="url(#${id}-g)" clip-path="url(#${id}-c)"/>` +
    `<path data-linea d="${linea}"${parcial ? ` clip-path="url(#${id}-c)"` : ''} fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>` +
    xs.map((x, i) => `<circle data-hito cx="${n1(x)}" cy="${n1(ys[i])}" r="7" fill="${color}"${i >= h ? ' opacity="0"' : ''}/>`).join('') +
    `<g data-punta transform="translate(${n1(xs[h - 1])} ${n1(ys[h - 1])})"><circle r="18" fill="${color}" opacity=".3"/><circle r="9" fill="#FFFFFF"/></g>` +
    `<text data-valor x="${n1(Math.max(60, Math.min(ancho - 60, xs[h - 1])))}" y="${n1(ys[h - 1] - 34)}" text-anchor="middle" font-family="'Bebas Neue', Impact, sans-serif" font-size="${tamValor}" fill="${textoColor}">${fmt(valores[h - 1])}</text></svg>`;
};

/** Contorno (receta 'contorno'): curvas de nivel de la luminancia de una imagen,
 *  recortada como object-fit: cover a `ancho`×`alto`. El análisis lo hace
 *  tools/contorno.mjs con Chrome (decodificar y suavizar); el resultado se
 *  guarda en tools/cache/contornos/ para no relanzar Chrome en cada gen.js. */
const contorno = (archivo, { ancho = 912, alto = 960, niveles = 7, detalle = 220, suavizado = 1.1, posicion = [0.5, 0.5],
  color = '#FFFFFF', grosor = 1.8, minimo = 24, queda = 0.18 } = {}) => {
  const fs = require('fs'), path = require('path'), crypto = require('crypto');
  const { execFileSync } = require('child_process');
  const { encadenar } = require('./kit-patrones.cjs');
  const opciones = { ancho, alto, detalle, suavizado, posicion };
  const clave = crypto.createHash('sha1').update(fs.readFileSync(archivo)).update(JSON.stringify(opciones)).digest('hex').slice(0, 16);
  const dirCache = path.join(__dirname, 'cache', 'contornos');
  const rutaCache = path.join(dirCache, `${clave}.json`);
  let rejilla;
  if (fs.existsSync(rutaCache)) rejilla = JSON.parse(fs.readFileSync(rutaCache, 'utf8'));
  else {
    rejilla = JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'contorno.mjs'), JSON.stringify({ archivo: path.resolve(archivo), ...opciones })],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
    fs.mkdirSync(dirCache, { recursive: true });
    fs.writeFileSync(rutaCache, JSON.stringify(rejilla));
  }
  const { w, h, lum } = rejilla;
  // Niveles por cuantiles: reparten las curvas donde de verdad hay tonos.
  const orden = [...lum].sort((a, b) => a - b);
  const umbrales = Array.from({ length: niveles }, (_, k) => orden[Math.floor(((k + 1) / (niveles + 1)) * (orden.length - 1))] + 0.5);
  const ex = ancho / (w - 1), ey = alto / (h - 1);
  const val = (i, j) => lum[j * w + i];
  const paths = [];
  umbrales.forEach((u, nivel) => {
    const segs = [];
    const it = (x1, y1, a, x2, y2, b) => { const t = (u - a) / ((b - a) || 1e-9); return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]; };
    for (let j = 0; j < h - 1; j++) {
      for (let i = 0; i < w - 1; i++) {
        const a = val(i, j), b = val(i + 1, j), c = val(i + 1, j + 1), d = val(i, j + 1);
        const k = (a > u ? 8 : 0) | (b > u ? 4 : 0) | (c > u ? 2 : 0) | (d > u ? 1 : 0);
        if (k === 0 || k === 15) continue;
        const T = () => it(i, j, a, i + 1, j, b), R = () => it(i + 1, j, b, i + 1, j + 1, c);
        const B = () => it(i, j + 1, d, i + 1, j + 1, c), Lf = () => it(i, j, a, i, j + 1, d);
        const P = { 1: [[Lf, B]], 2: [[B, R]], 3: [[Lf, R]], 4: [[T, R]], 5: [[Lf, T], [B, R]], 6: [[T, B]], 7: [[Lf, T]], 8: [[Lf, T]],
          9: [[T, B]], 10: [[T, R], [Lf, B]], 11: [[T, R]], 12: [[Lf, R]], 13: [[B, R]], 14: [[Lf, B]] }[k];
        for (const [p, q] of P) { const A = p(), Q = q(); segs.push([A[0], A[1], Q[0], Q[1]]); }
      }
    }
    for (const l of encadenar(segs)) {
      if (l.length < minimo) continue;
      const pts = l.filter((_, k) => k % 2 === 0 || k === l.length - 1);
      paths.push(`<path d="M${pts.map(([x, y]) => `${Math.round(x * ex)} ${Math.round(y * ey)}`).join('L')}" stroke-opacity="${(0.45 + (0.55 * (nivel + 1)) / niveles).toFixed(2)}"/>`);
    }
  });
  return `<svg data-contorno data-queda="${queda}" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" ` +
    `style="position:absolute;inset:0;width:100%;height:100%;opacity:${queda};pointer-events:none">` +
    `<g fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linejoin="round" stroke-linecap="round">${paths.join('')}</g></svg>`;
};

module.exports = { efectos, pincel, duotono, glitch, quemado, tinta, ventana, sello, grafica, contorno };
