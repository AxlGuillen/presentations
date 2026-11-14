/* avatares.js v2 — los avatares 3D de Axl mueven las láminas (transiciones integradas).
 *
 * La lámina que sale se clona encima de la nueva (el «fantasma») y el avatar la manipula. Todo lo que toca va
 * amarrado a su trayectoria real: cada clip trae, cuadro por cuadro, dónde están sus palmas, pies, cadera, cabeza y
 * (Jhin) la boca de la Whisper, exportado de Blender (acciones2.py). Los avatares que estaban en la lámina anterior
 * se van con ella (una foto de su último cuadro dentro del fantasma), salvo los que siguen en la nueva.
 *
 * Efectos: baja (cuelga de la orilla de arriba y la baja), sube (la enrolla como persiana), mantel (jala una tarjeta,
 * la lámina se cae y la tarjeta vuela a su lugar en la nueva), pela (dobla la esquina y pela la lámina), patada
 * (cada bloque sale volando con física) y disparo (cámara lenta y la lámina se rompe como vidrio).
 *
 * Config (window.AVATARES, la escribe gen.js):
 *   { base, S, piso, fichas: { 'pj/accion': {cuadros, ancla:[u,v], tray:[{palmaL:[u,v],…}], suelta?, …} },
 *     laminas: [ { elenco: [{pj, x, reposo?, entra?}], sale: {efecto, pj, clave, x, continua?, reposo?} } ] }
 *   u, v: posición en el clip normalizada desde abajo a la izquierda. ancla: los pies del avatar parado.
 * Modo reloj (?reloj=1): nada corre solo; la grabadora llama window.__avanzar(dt) y pregunta window.__ocupado().
 */
(function () {
  var C = window.AVATARES; if (!C) return;
  var deck = document.querySelector('deck-stage');
  var gsap = window.gsap;
  var FPS = 30, S = C.S || 900, PISO = C.piso || 1050, W = 1920, H = 1080;
  var MANUAL = /[?&]reloj=1/.test(location.search);
  var ahora = 0, ritmo = 1, enCurso = new Map(), pool = {};
  if (MANUAL) { gsap.ticker.remove(gsap.updateRoot); gsap.ticker.lagSmoothing(0); gsap.updateRoot(0); }

  // ── utilidades ───────────────────────────────────────────────────────
  function cl(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ss(t) { t = cl(t, 0, 1); return t * t * (3 - 2 * t); }
  function eo(t) { t = cl(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function ei(t) { t = cl(t, 0, 1); return t * t; }
  function azar(sem) { var s = sem >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function el(tag, css, padre) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (padre) padre.appendChild(e); return e; }
  function fijarRitmo(r) {
    ritmo = r;
    if (!MANUAL) { gsap.globalTimeline.timeScale(r); Object.keys(pool).forEach(function (k) { pool[k].playbackRate = r; }); }
  }
  // corre cada(t) con el reloj de la escena (respeta la cámara lenta y el modo reloj)
  function tween(dur, cada, fin) {
    var o = { t: 0 };
    return gsap.to(o, { t: dur, duration: dur, ease: 'none', onUpdate: function () { cada(o.t); }, onComplete: fin });
  }

  // ── clips ────────────────────────────────────────────────────────────
  function fi(k) { return C.fichas[k]; }
  function video(k) {
    if (pool[k]) return pool[k];
    var v = document.createElement('video');
    v.src = C.base + k.replace('/', '-') + '.webm'; v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.style.cssText = 'position:absolute; left:0; top:0; width:' + S + 'px; height:' + S + 'px; z-index:60; pointer-events:none; will-change:transform;';
    pool[k] = v; return v;
  }
  Object.keys(C.fichas).forEach(function (k) { video(k).load(); });
  function tClip(v) {
    var e = enCurso.get(v); if (!e) return 0;
    var d = fi(e.k).cuadros / FPS, t = MANUAL ? ahora - e.inicio : v.currentTime;
    return e.loop ? ((t % d) + d) % d : cl(t, 0, d - 0.5 / FPS);
  }
  function fClip(v) { return tClip(v) * FPS + 1; }
  function tray(k, f) {               // trayectoria interpolada entre cuadros
    var tr = fi(k).tray, i = cl(Math.floor(f) - 1, 0, tr.length - 1), j = Math.min(i + 1, tr.length - 1), t = cl(f - 1 - i, 0, 1);
    var a = tr[i], b = tr[j], o = {};
    for (var n in a) o[n] = [lerp(a[n][0], b[n][0], t), lerp(a[n][1], b[n][1], t)];
    return o;
  }
  // altura (px del deck) de un punto del clip sobre los pies del avatar
  function sobrePies(k, nombre, f) { return (tray(k, f)[nombre][1] - fi(k).ancla[1]) * S; }

  // ── actores: un video y una sombra de contacto por personaje ─────────
  var actores = {};
  function actor(pj) {
    if (actores[pj]) return actores[pj];
    var sombra = el('div', 'position:absolute; left:0; top:0; width:230px; height:42px; margin:-21px 0 0 -115px; border-radius:50%; z-index:59; pointer-events:none;' +
      'background: radial-gradient(closest-side, rgba(28,26,58,0.40), rgba(28,26,58,0.16) 58%, rgba(28,26,58,0) 100%);');
    sombra.setAttribute('data-sombra-actor', '');
    return (actores[pj] = { pj: pj, sombra: sombra, v: null, k: null, xf: 0, yf: PISO, izq: 0, arr: 0 });
  }
  function poner(a, k, slide, opts) {
    opts = opts || {};
    var v = video(k);
    if (a.v && a.v !== v) { enCurso.delete(a.v); a.v.remove(); }
    slide.appendChild(a.sombra); slide.appendChild(v);
    a.v = v; a.k = k;
    var desde = ((opts.desde || 1) - 1) / FPS;
    enCurso.set(v, { k: k, inicio: ahora - desde, loop: !!opts.loop });
    if (!MANUAL) { v.loop = !!opts.loop; v.currentTime = desde; v.playbackRate = ritmo; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    colocar(a, a.xf, a.yf);
  }
  function quitar(a) { if (a.v) { enCurso.delete(a.v); a.v.remove(); } a.sombra.remove(); a.v = null; a.k = null; }
  function colocar(a, xf, yf) {
    a.xf = xf; a.yf = yf;
    var an = fi(a.k).ancla;
    a.izq = xf - an[0] * S; a.arr = yf - (1 - an[1]) * S;
    a.v.style.transform = 'translate(' + a.izq.toFixed(2) + 'px,' + a.arr.toFixed(2) + 'px)';
    // la sombra de contacto se encoge y se aclara mientras más alto está del piso
    var h = Math.max(0, PISO - yf), op = cl(1 - h / 420, 0, 1), sc = 1 - Math.min(h, 600) / 1000;
    a.sombra.style.opacity = op.toFixed(3);
    a.sombra.style.transform = 'translate(' + xf.toFixed(1) + 'px,' + (PISO + 4) + 'px) scale(' + sc.toFixed(3) + ')';
  }
  function punto(a, nombre, f) {
    var p = tray(a.k, f)[nombre];
    return { x: a.izq + p[0] * S, y: a.arr + (1 - p[1]) * S };
  }
  function palmas(a, f) { var l = punto(a, 'palmaL', f), r = punto(a, 'palmaR', f); return { x: (l.x + r.x) / 2, y: (l.y + r.y) / 2 }; }

  // ── el fantasma de la lámina que sale ────────────────────────────────
  function foto(a) {
    var c = document.createElement('canvas'); c.width = a.v.videoWidth || 918; c.height = a.v.videoHeight || 918;
    try { c.getContext('2d').drawImage(a.v, 0, 0, c.width, c.height); } catch (e) {}
    var img = new Image(); img.src = c.toDataURL();
    img.setAttribute('data-pieza', ''); img.setAttribute('data-bajo', String(Math.round(fi(a.k).ancla[1] * S)));
    img.style.cssText = 'position:absolute; left:0; top:0; width:' + S + 'px; height:' + S + 'px; transform:' + a.v.style.transform + '; z-index:60; pointer-events:none;';
    var s = a.sombra.cloneNode(true); s.removeAttribute('data-sombra-actor');
    return [s, img];
  }
  function fantasma(prev, slide, seVan) {
    var f = prev.cloneNode(true);
    f.querySelectorAll('video, [data-fantasma], [data-sombra-actor]').forEach(function (x) { x.remove(); });
    f.removeAttribute('data-deck-active'); f.removeAttribute('data-label'); f.removeAttribute('data-screen-label');
    f.setAttribute('data-fantasma', '');
    f.style.cssText += ';position:absolute; inset:0; z-index:50; visibility:visible; opacity:1; pointer-events:none; margin:0; translate:none;';
    seVan.forEach(function (a) { foto(a).forEach(function (n) { f.appendChild(n); }); });
    slide.appendChild(f); return f;
  }
  function rectEn(e, slide) {
    var r = e.getBoundingClientRect(), s = slide.getBoundingClientRect(), k = s.width / W;
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  }
  function propio(slide, sel) {      // un elemento de la lámina nueva (no del fantasma)
    return Array.prototype.filter.call(slide.querySelectorAll(sel), function (x) { return !x.closest('[data-fantasma]'); })[0];
  }

  // ── efectos de cámara y de contacto ──────────────────────────────────
  function sacudir(slide, fuerza, dur) {
    var rnd = azar(7 + Math.round(fuerza * 13));
    tween(dur, function (t) {
      var d = fuerza * Math.pow(1 - t / dur, 2);
      slide.style.translate = ((rnd() - 0.5) * 2 * d).toFixed(1) + 'px ' + ((rnd() - 0.5) * 2 * d).toFixed(1) + 'px';
    }, function () { slide.style.translate = ''; });
  }
  function polvo(slide, x, fuerza) {  // nubecitas lavanda donde aterriza
    [-1, 1].forEach(function (lado) {
      for (var i = 0; i < 3; i++) {
        var n = el('div', 'position:absolute; left:' + (x - 40) + 'px; top:' + (PISO - 26) + 'px; width:80px; height:40px; border-radius:50%; z-index:61; pointer-events:none;' +
          'background: radial-gradient(closest-side, rgba(200,194,240,0.75), rgba(200,194,240,0));', slide);
        gsap.fromTo(n, { x: 0, y: 0, scale: 0.4, opacity: 0.9 },
          { x: lado * (70 + i * 55) * fuerza, y: -14 - i * 10, scale: 1.3 + i * 0.35, opacity: 0, duration: 0.45 + i * 0.08, ease: 'power2.out', onComplete: n.remove.bind(n) });
      }
    });
  }
  function onda(slide, x, y, w, h, color, dur) {
    var n = el('div', 'position:absolute; left:' + (x - w / 2) + 'px; top:' + (y - h / 2) + 'px; width:' + w + 'px; height:' + h + 'px; border-radius:50%; z-index:68; pointer-events:none; border:5px solid ' + color + ';', slide);
    gsap.fromTo(n, { scale: 0.25, opacity: 1 }, { scale: 1.6, opacity: 0, duration: dur, ease: 'power2.out', onComplete: n.remove.bind(n) });
  }
  function cae(nodo, y0, v0, rot, alFin) {     // caída libre del fantasma completo
    nodo.style.transformOrigin = '50% 0%';
    tween(1.1, function (t) {
      var y = y0 + v0 * t + 0.5 * 3600 * t * t, vel = Math.abs(v0 + 3600 * t);
      nodo.style.transform = 'translateY(' + y.toFixed(1) + 'px) rotate(' + (rot * Math.min(1, t / 0.5)).toFixed(2) + 'deg)';
      nodo.style.filter = 'blur(' + Math.min(3, vel / 2200).toFixed(2) + 'px)';
    }, function () { nodo.remove(); if (alFin) alFin(); });
  }

  // ── geometría (pelado y vidrio) ──────────────────────────────────────
  var RECT = [[0, 0], [W, 0], [W, H], [0, H]];
  function corta(poly, n, m, lado) {   // conserva los puntos con lado·((p−m)·n) <= 0
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length];
      var da = lado * ((a[0] - m[0]) * n[0] + (a[1] - m[1]) * n[1]), db = lado * ((b[0] - m[0]) * n[0] + (b[1] - m[1]) * n[1]);
      if (da <= 0) out.push(a);
      if ((da < 0) !== (db < 0) && da !== db) { var t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  function poli(p) { return p.length > 2 ? 'polygon(' + p.map(function (q) { return q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px'; }).join(',') + ')' : 'polygon(0 0,0 0,0 0)'; }
  function voronoi(sitios) {
    return sitios.map(function (s, i) {
      var c = RECT;
      for (var j = 0; j < sitios.length && c.length; j++) {
        if (i === j) continue;
        var o = sitios[j];
        c = corta(c, [o[0] - s[0], o[1] - s[1]], [(o[0] + s[0]) / 2, (o[1] + s[1]) / 2], 1);
      }
      return c;
    });
  }
  function centro(p) { var x = 0, y = 0; p.forEach(function (q) { x += q[0]; y += q[1]; }); return [x / p.length, y / p.length]; }
  // posición (%) de un punto sobre la línea de un linear-gradient de ángulo ang (grados CSS) en la lámina
  function enGradiente(ang, q) {
    var r = ang * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), L = Math.abs(W * dx) + Math.abs(H * dy);
    return (((q[0] - W / 2) * dx + (q[1] - H / 2) * dy) / L + 0.5) * 100;
  }

  // ── física de piezas sueltas (subpasos de 1/240 s, determinista) ─────
  function fisica(piezas, opts) {
    var g = opts.g || 3200, piso = opts.piso, dt = 1 / 240, t = 0;
    tween(opts.dur || 2.4, function (T) {
      while (t < T) {
        t += dt;
        piezas.forEach(function (p) {
          if (t < p.retraso) return;
          p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.rx += (p.vrx || 0) * dt; p.ry += (p.vry || 0) * dt;
          var fondo = p.y + p.h - (p.bajo || 0);
          if (piso && fondo > piso && p.vy > 0) {
            p.y -= fondo - piso; p.vy *= -0.38; p.vx *= 0.7; p.vr *= 0.5;
            if (Math.abs(p.vy) < 140) p.vy = 0;
            if (!p.reboto) { p.reboto = true; if (opts.alRebotar) opts.alRebotar(p); }
          }
        });
      }
      piezas.forEach(function (p) {
        var op = cl(1 - (T - (opts.desvanece || 1.6)) / 0.5, 0, 1), vel = Math.hypot(p.vx, p.vy);
        p.n.style.opacity = op.toFixed(3);
        p.n.style.filter = vel > 900 ? 'blur(' + Math.min(4, (vel - 900) / 700).toFixed(2) + 'px)' : 'none';
        p.n.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) rotate(' + p.r.toFixed(1) + 'deg)' +
          (p.vrx ? ' rotateX(' + p.rx.toFixed(1) + 'deg) rotateY(' + p.ry.toFixed(1) + 'deg)' : '');
      });
      if (opts.cada) opts.cada(T);
    }, function () { piezas.forEach(function (p) { p.n.remove(); }); if (opts.fin) opts.fin(); });
  }

  // ── efectos ──────────────────────────────────────────────────────────
  var EF = {};

  // Baja: entra colgado de la orilla de arriba de la lámina que sale y la baja en dos tirones de rapel; la suelta,
  // cae y aterriza. La lámina sigue cayendo sola con la velocidad que traía.
  EF.baja = function (E) {
    var a = E.a, k = E.k, F = fi(k), x = E.x, suelta = F.suelta, aterriza = F.aterriza;
    var alturaSuelta = 120;                                 // pies sobre el piso al soltar
    var ySuelta = PISO - alturaSuelta;
    var manos = function (f) { return (sobrePies(k, 'palmaL', f) + sobrePies(k, 'palmaR', f)) / 2; };
    var CAE = 5, eAg = 150, eFin = ySuelta - manos(suelta), eMed = lerp(eAg, eFin, 0.45);
    function orilla(f) {                                    // y de la orilla de arriba de la lámina
      if (f <= CAE) return 0;
      if (f <= 11) { var u = (f - CAE) / 6; return eAg * (1 - Math.exp(-5 * u) * Math.cos(7 * u)); }   // lo recibe: jalón con rebote
      if (f <= 16) return lerp(eAg * (1 - Math.exp(-5) * Math.cos(7)), eMed, ss((f - 11) / 5));
      if (f <= 22) return eMed + Math.sin((f - 16) / 6 * Math.PI) * 10 * (1 - (f - 16) / 6);           // rebote del tirón
      return lerp(eMed, eFin, ei((f - 22) / (suelta - 22)));
    }
    var yManos = function (f) { return f < CAE ? lerp(-420, 0, ei((f - 1) / (CAE - 1))) : orilla(f); };
    var soltada = false, aterrizo = false;
    E.fan.style.boxShadow = '0 -16px 36px rgba(28,26,58,0.18)';
    return function (f) {
      if (f <= suelta) {
        var e = orilla(f);
        colocar(a, x, yManos(f) + manos(f));
        E.fan.style.transform = 'translateY(' + e.toFixed(1) + 'px)';
        if (f >= CAE && !E.agarro) { E.agarro = true; sacudir(E.slide, 3, 0.15); }
      } else {
        if (!soltada) {
          soltada = true;
          E.fan.style.transform = '';
          cae(E.fan, orilla(suelta), (orilla(suelta) - orilla(suelta - 1)) * FPS, 2.5);
        }
        colocar(a, x, f >= aterriza ? PISO : lerp(ySuelta, PISO, ei((f - suelta) / (aterriza - suelta))));
        if (!aterrizo && f >= aterriza) { aterrizo = true; polvo(E.slide, x, 1); sacudir(E.slide, 4, 0.2); }
      }
    };
  };

  // Sube: aparece desde abajo empujando con las palmas la orilla de abajo; la lámina se enrolla hacia arriba
  // (un rollo de papel que engorda) y al final la avienta.
  EF.sube = function (E) {
    var a = E.a, k = E.k, F = fi(k), x = E.x;
    var yIni = H + 40 + (sobrePies(k, 'palmaL', 1) + sobrePies(k, 'palmaR', 1)) / 2;
    var rollo = el('div', 'position:absolute; left:-24px; right:-24px; top:0; z-index:58; pointer-events:none; border-radius:999px;' +
      'background: linear-gradient(180deg, #DCD8F2 0%, #FFFFFF 26%, #F4F2FC 52%, #CBC6E8 80%, #9E97D0 100%);' +
      'box-shadow: 0 16px 28px rgba(28,26,58,0.26), inset 0 -3px 0 rgba(75,59,214,0.25);', E.slide);
    function pinta(e) {
      var h = cl(16 + (H - e) * 0.06, 16, 80);
      E.fan.style.clipPath = 'inset(0 0 ' + Math.max(0, H - e + h * 0.5).toFixed(1) + 'px 0)';
      rollo.style.height = h.toFixed(1) + 'px'; rollo.style.transform = 'translateY(' + (e - h * 0.5).toFixed(1) + 'px)';
    }
    var soltada = false;
    return function (f) {
      var hop = 0, sh = (f - (F.piso - 2)) / 14;            // salto: despega antes de soltar y cae después
      if (sh > 0 && sh < 1) hop = 190 * 4 * sh * (1 - sh);
      colocar(a, x, (f <= F.piso ? lerp(yIni, PISO, eo((f - 1) / (F.piso - 1))) : PISO) - hop);
      if (sh >= 1 && !E.cayo) { E.cayo = true; polvo(E.slide, x, 0.8); }
      if (f <= F.suelta) pinta(palmas(a, f).y);
      else if (!soltada) {
        soltada = true;
        var e0 = palmas(a, F.suelta).y, v = Math.min(-900, (e0 - palmas(a, F.suelta - 1).y) * FPS * 3);
        tween(0.5, function (t) {
          var e = e0 + v * t - 0.5 * 5200 * t * t;
          pinta(Math.max(e, -140)); rollo.style.filter = 'blur(' + Math.min(3, t * 8).toFixed(2) + 'px)';
        }, function () { E.fan.remove(); rollo.remove(); });
      }
    };
  };

  // Mantel: agarra la tarjeta, jala (la lámina se cae como mantel) y la avienta a su lugar en la lámina nueva.
  EF.mantel = function (E) {
    var a = E.a, F = fi(E.k);
    var src = E.fan.querySelector('[data-arrastre]'), id = src && src.getAttribute('data-arrastre');
    var dst = id && propio(E.slide, '[data-arrastre="' + id + '"]');
    if (dst) dst.style.visibility = 'hidden';
    var vuela = null, off = null, prev = null, estado = 0, rot = 0;
    return function (f) {
      colocar(a, E.x, PISO);
      if (!src || !dst) return;
      if (estado === 0 && f >= F.agarra) {
        estado = 1;
        var r = rectEn(src, E.slide), p = punto(a, F.mano, F.agarra);
        vuela = src.cloneNode(true); src.style.visibility = 'hidden';
        vuela.style.cssText += ';position:absolute; left:0; top:0; margin:0; width:' + r.w + 'px; height:' + r.h + 'px; z-index:59; transform-origin: 6% 50%; box-sizing:border-box;';
        E.slide.appendChild(vuela); off = { x: r.x - p.x, y: r.y - p.y }; prev = p;
      }
      if (estado === 1) {
        var p = punto(a, F.mano, Math.min(f, F.suelta)), vx = p.x - prev.x, vy = p.y - prev.y;
        rot = lerp(rot, cl(-vx * 0.45 + vy * 0.15, -18, 18), 0.4); prev = p;
        vuela.style.transform = 'translate(' + (p.x + off.x).toFixed(1) + 'px,' + (p.y + off.y).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
        vuela.style.filter = 'blur(' + Math.min(2.5, Math.hypot(vx, vy) / 30).toFixed(2) + 'px)';
        if (!E.cayo && f >= F.jalon) { E.cayo = true; cae(E.fan, 0, -160, -4); sacudir(E.slide, 3, 0.18); }
        if (f >= F.suelta) {
          estado = 2;
          var x0 = p.x + off.x, y0 = p.y + off.y, d = rectEn(dst, E.slide), x2 = d.x, y2 = d.y;
          var cx = (x0 + x2) / 2, cy = Math.min(y0, y2) - 340, r0 = rot;
          vuela.style.transformOrigin = '50% 50%';
          tween(0.6, function (t) {
            var u = t / 0.6, uu = lerp(u, ss(u), 0.35), w0 = (1 - uu) * (1 - uu), w1 = 2 * (1 - uu) * uu, w2 = uu * uu;
            var bx = w0 * x0 + w1 * cx + w2 * x2, by = w0 * y0 + w1 * cy + w2 * y2;
            vuela.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px) rotate(' + lerp(r0, 360, eo(u)).toFixed(1) + 'deg)';
            vuela.style.filter = 'blur(' + (2.2 * Math.sin(u * Math.PI)).toFixed(2) + 'px)';
          }, function () {
            // aterriza: se aplasta contra la lámina y rebota (resorte amortiguado)
            vuela.style.filter = 'none'; vuela.style.transformOrigin = '50% 100%';
            tween(0.55, function (t) {
              var q = 0.15 * Math.exp(-7 * t) * Math.cos(24 * t);
              vuela.style.transform = 'translate(' + x2 + 'px,' + y2 + 'px) scale(' + (1 + q * 0.5).toFixed(4) + ',' + (1 - q).toFixed(4) + ')';
            }, function () { dst.style.visibility = ''; vuela.remove(); });
            onda(E.slide, x2 + d.w / 2, y2 + d.h, d.w + 80, 44, 'rgba(75,59,214,0.45)', 0.45);
          });
        }
      }
    };
  };

  // Pela: cae del cielo junto a la esquina de abajo a la derecha, la agarra y pela la lámina; el doblez es la
  // mediatriz entre la esquina y su mano. Al soltarla, la página se termina de pelar sola.
  EF.pela = function (E) {
    var a = E.a, F = fi(E.k), x = E.x, Cq = [W, H];
    var flap = el('div', 'position:absolute; inset:0; z-index:57; pointer-events:none; filter: drop-shadow(-16px 14px 18px rgba(28,26,58,0.30));', E.slide);
    var cara = el('div', 'position:absolute; inset:0;', flap);
    var sombra = el('div', 'position:absolute; inset:0; z-index:56; pointer-events:none;', E.slide);
    function pela(P) {
      var dx = Cq[0] - P[0], dy = Cq[1] - P[1], L = Math.hypot(dx, dy);
      if (L < 2) { E.fan.style.clipPath = ''; cara.style.clipPath = poli([]); sombra.style.clipPath = poli([]); return; }
      var n = [dx / L, dy / L], m = [(Cq[0] + P[0]) / 2, (Cq[1] + P[1]) / 2];
      var base = corta(RECT, n, m, 1), pel = corta(RECT, n, m, -1);
      var refl = pel.map(function (q) { var dd = 2 * ((q[0] - m[0]) * n[0] + (q[1] - m[1]) * n[1]); return [q[0] - dd * n[0], q[1] - dd * n[1]]; });
      E.fan.style.clipPath = poli(base);
      cara.style.clipPath = poli(refl);
      var ang = Math.atan2(-n[0], n[1]) * 180 / Math.PI, p0 = enGradiente(ang, m), p1 = enGradiente(ang, P);
      cara.style.background = 'linear-gradient(' + ang.toFixed(1) + 'deg, #C9C3EA ' + p0.toFixed(1) + '%, #EEEBFB ' + lerp(p0, p1, 0.3).toFixed(1) + '%, #FFFFFF ' + lerp(p0, p1, 0.75).toFixed(1) + '%, #F3F1FC ' + p1.toFixed(1) + '%)';
      sombra.style.clipPath = poli(base);
      var q0 = enGradiente(ang, m), q1 = enGradiente(ang, [m[0] - n[0] * 140, m[1] - n[1] * 140]);
      sombra.style.background = 'linear-gradient(' + ang.toFixed(1) + 'deg, rgba(28,26,58,0.22) ' + q0.toFixed(1) + '%, rgba(28,26,58,0) ' + q1.toFixed(1) + '%)';
    }
    var g0 = null, soltada = false, aterrizo = false, A0 = F.agarra - 4, A1 = F.agarra + 3;
    pela(Cq);
    return function (f) {
      colocar(a, x, f >= F.aterriza ? PISO : lerp(-260, PISO, ei((f - 1) / (F.aterriza - 1))));
      if (!aterrizo && f >= F.aterriza) { aterrizo = true; polvo(E.slide, x, 1.2); sacudir(E.slide, 6, 0.24); }
      if (f < A0) return;
      var ff = Math.min(f, F.suelta), p = punto(a, F.mano, ff);
      if (!g0) g0 = Cq.slice();
      // la esquina se levanta hacia la mano entre A0 y A1 (anticipa el agarre) y luego la sigue
      var w = ss((ff - A0) / (A1 - A0)), P = [lerp(Cq[0], p.x, w), lerp(Cq[1], p.y, w)];
      if (f <= F.suelta) { pela(P); E.P = P; }
      else if (!soltada) {
        soltada = true;
        var q = punto(a, F.mano, F.suelta - 1), v = [(p.x - q.x) * FPS, (p.y - q.y) * FPS], P0 = E.P;
        var acel = [-5200, -3600];
        tween(0.7, function (t) { pela([P0[0] + v[0] * t + 0.5 * acel[0] * t * t, P0[1] + v[1] * t + 0.5 * acel[1] * t * t]); },
          function () { E.fan.remove(); flap.remove(); sombra.remove(); });
      }
    };
  };

  // Patada: entra de un salto, cae y patea; cada bloque de la lámina (y el avatar que estaba) sale volando con su
  // propia física y rebota en el piso.
  EF.patada = function (E) {
    var a = E.a, F = fi(E.k), x = E.x, x0 = -260, hecho = false, aterrizo = false;
    return function (f) {
      var s = cl((f - 1) / (F.aterriza - 1), 0, 1);
      var xf = f >= F.aterriza ? x : lerp(x0, x, eo(s)), yf = f >= F.aterriza ? PISO : PISO - (90 * (1 - s) + 4 * 320 * s * (1 - s));
      colocar(a, xf, yf);
      if (!aterrizo && f >= F.aterriza) { aterrizo = true; polvo(E.slide, x, 0.9); }
      if (!hecho && f >= F.impacto) {
        hecho = true;
        var pie = punto(a, F.pie, F.impacto), piezas = [], rnd = azar(42);
        sacudir(E.slide, 10, 0.32);
        onda(E.slide, pie.x, pie.y, 150, 150, 'rgba(75,59,214,0.6)', 0.35);
        onda(E.slide, pie.x, pie.y, 260, 260, 'rgba(75,59,214,0.25)', 0.5);
        E.fan.querySelectorAll('[data-pieza]').forEach(function (n) {
          var r = rectEn(n, E.slide); if (r.w < 4 || r.h < 4) return;
          var c = n.cloneNode(true); n.style.visibility = 'hidden';
          c.style.cssText += ';position:absolute; left:0; top:0; margin:0; width:' + r.w + 'px; height:' + r.h + 'px; z-index:58; transform-origin:50% 50%; box-sizing:border-box;';
          E.slide.appendChild(c);
          var cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = cx - pie.x, dy = cy - pie.y, d = Math.hypot(dx, dy) || 1;
          var fu = 2400 * (0.35 + 0.65 * Math.max(0, 1 - d / 1700));
          piezas.push({ n: c, x: r.x, y: r.y, w: r.w, h: r.h, bajo: +(n.getAttribute('data-bajo') || 0),
            vx: dx / d * fu + 420, vy: dy / d * fu * 0.6 - 1000 - rnd() * 350,
            r: 0, vr: (rnd() < 0.5 ? -1 : 1) * (160 + rnd() * 380), retraso: d / 3400 });
        });
        gsap.to(E.fan, { opacity: 0, y: 24, duration: 0.3, delay: 0.08, ease: 'power2.in' });
        fisica(piezas, { piso: PISO + 20, dur: 1.7, desvanece: 1.15, fin: function () { E.fan.remove(); } });
      }
    };
  };

  // Disparo: apunta, dispara y el tiempo se frena (×0.24); la bala cruza, la lámina se agrieta desde el agujero
  // y se rompe como vidrio en esquirlas que caen girando en 3D.
  EF.disparo = function (E) {
    var a = E.a, F = fi(E.k), lento = false, tiro = false;
    return function (f) {
      colocar(a, E.x, PISO);
      if (!lento && f >= F.impacto - 1.5) { lento = true; fijarRitmo(0.24); }
      if (!tiro && f >= F.impacto) {
        tiro = true;
        var b = punto(a, 'boca', F.impacto), m = punto(a, 'palmaR', F.impacto - 1), b1 = punto(a, 'boca', F.impacto - 1);
        var ux = b1.x - m.x, uy = b1.y - m.y, ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
        if (ux < 0.5) { ux = 0.97; uy = -0.24; }
        var dist = (1260 - b.x) / ux, T = [b.x + ux * dist, cl(b.y + uy * dist, 220, 860)];
        var fogon = el('div', 'position:absolute; left:' + (b.x - 110) + 'px; top:' + (b.y - 110) + 'px; width:220px; height:220px; border-radius:50%; z-index:72; pointer-events:none;' +
          'background: radial-gradient(circle, #FFFBE6 0%, #FFD86B 28%, rgba(255,140,60,0.55) 50%, rgba(255,140,60,0) 72%);', E.slide);
        gsap.fromTo(fogon, { scale: 0.2, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.2, ease: 'power2.out', onComplete: fogon.remove.bind(fogon) });
        var flash = el('div', 'position:absolute; inset:0; z-index:90; pointer-events:none; background: radial-gradient(circle at ' + b.x.toFixed(0) + 'px ' + b.y.toFixed(0) + 'px, rgba(255,240,205,0.6), rgba(255,240,205,0) 50%);', E.slide);
        gsap.to(flash, { opacity: 0, duration: 0.22, onComplete: flash.remove.bind(flash) });
        sacudir(E.slide, 3, 0.12);
        var dx = T[0] - b.x, dy = T[1] - b.y, ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var bala = el('div', 'position:absolute; left:0; top:0; width:220px; height:5px; margin-top:-2.5px; border-radius:3px; z-index:71; pointer-events:none; transform-origin: 100% 50%;' +
          'background: linear-gradient(90deg, rgba(255,230,160,0), #FFF1C8 70%, #FFFFFF); box-shadow: 0 0 10px rgba(255,220,140,0.8);', E.slide);
        tween(0.12, function (t) {
          var u = t / 0.12, px = b.x + dx * u, py = b.y + dy * u;
          bala.style.transform = 'translate(' + (px - 220).toFixed(1) + 'px,' + py.toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)';
        }, function () { bala.remove(); vidrio(E, T); });
      }
    };
  };
  function vidrio(E, T) {
    var rnd = azar(1311), sitios = [];
    for (var i = 0; i < 30; i++) {
      var r = 16 + 1100 * Math.pow(rnd(), 1.8), an = rnd() * Math.PI * 2;
      sitios.push([cl(T[0] + Math.cos(an) * r, 4, W - 4), cl(T[1] + Math.sin(an) * r * 0.8, 4, H - 4)]);
    }
    var celdas = voronoi(sitios).filter(function (c) { return c.length > 2; });
    var d = '';
    celdas.forEach(function (c) { d += 'M' + c.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L') + ' Z '; });
    // grietas radiales quebradas desde el agujero (lo que hace que se lea como vidrio)
    for (var k = 0; k < 13; k++) {
      var ang = (k / 13) * Math.PI * 2 + rnd() * 0.35, largo = 260 + rnd() * 520, x = T[0], y = T[1];
      d += 'M' + x.toFixed(1) + ' ' + y.toFixed(1);
      for (var sgm = 1; sgm <= 6; sgm++) {
        var rr = largo * sgm / 6, aj = ang + (rnd() - 0.5) * 0.3;
        x = T[0] + Math.cos(aj) * rr; y = T[1] + Math.sin(aj) * rr; d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      d += ' ';
    }
    // anillos concéntricos cerca del impacto
    [46, 92].forEach(function (r0) {
      var pts = [];
      for (var q = 0; q < 14; q++) { var aa = q / 14 * Math.PI * 2, rr = r0 * (0.85 + rnd() * 0.3); pts.push((T[0] + Math.cos(aa) * rr).toFixed(1) + ' ' + (T[1] + Math.sin(aa) * rr).toFixed(1)); }
      d += 'M' + pts.join(' L') + ' Z ';
    });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.style.cssText = 'position:absolute; left:0; top:0; width:' + W + 'px; height:' + H + 'px; z-index:56; pointer-events:none;';
    svg.innerHTML = '<defs><mask id="av-mk"><circle id="av-mc" cx="' + T[0] + '" cy="' + T[1] + '" r="0" fill="#fff"/></mask></defs>' +
      '<g mask="url(#av-mk)"><path d="' + d + '" stroke="rgba(28,26,58,0.55)" stroke-width="2.4" fill="none" stroke-linejoin="round"/>' +
      '<path d="' + d + '" stroke="rgba(255,255,255,0.95)" stroke-width="1.1" fill="none" transform="translate(1.6,1.6)"/></g>' +
      '<circle cx="' + T[0] + '" cy="' + T[1] + '" r="36" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="6"/>' +
      '<circle cx="' + T[0] + '" cy="' + T[1] + '" r="14" fill="#1C1A3A"/>';
    E.slide.appendChild(svg);
    var mc = svg.querySelector('#av-mc');
    sacudir(E.slide, 7, 0.4);
    tween(0.1, function (t) { mc.setAttribute('r', (t / 0.1 * 1500).toFixed(0)); }, function () {
      gsap.delayedCall(0.05, function () {
        var caja = el('div', 'position:absolute; inset:0; z-index:55; pointer-events:none; perspective:1600px; filter: drop-shadow(0 12px 16px rgba(28,26,58,0.30));', E.slide), piezas = [];
        celdas.forEach(function (c) {
          var n = E.fan.cloneNode(true); n.removeAttribute('data-fantasma');
          var cc = centro(c);
          n.style.clipPath = poli(c); n.style.transformOrigin = cc[0].toFixed(0) + 'px ' + cc[1].toFixed(0) + 'px';
          caja.appendChild(n);
          var dx = cc[0] - T[0], dy = cc[1] - T[1], dd = Math.hypot(dx, dy) || 1, fu = 240 + 720 * Math.max(0, 1 - dd / 1300);
          piezas.push({ n: n, x: 0, y: 0, w: 0, h: 0, vx: dx / dd * fu, vy: dy / dd * fu - 150, r: 0, vr: (rnd() - 0.5) * 110,
            rx: 0, ry: 0, vrx: (rnd() - 0.5) * 280 || 30, vry: (rnd() - 0.5) * 280 || 30, retraso: dd / 6000 });
        });
        E.fan.remove(); svg.remove();
        fisica(piezas, { g: 3000, dur: 1.7, desvanece: 1.1, cada: function (t) {
          fijarRitmo(t < 0.3 ? 0.24 : Math.min(1, 0.24 + (t - 0.3) / 0.25 * 0.76));
        }, fin: function () { caja.remove(); fijarRitmo(1); } });
      });
    });
  }

  // Entrada desde el cielo (lámina final): el clip de «baja» desde que suelta, cayendo hasta el piso.
  function aterrizaDelCielo(a, k, slide, x, retraso) {
    var F = fi(k);
    gsap.delayedCall(retraso, function () {
      a.xf = x; a.yf = -320; poner(a, k, slide, { desde: F.suelta });
      var aterrizo = false;
      tween((F.cuadros - F.suelta) / FPS, function () {
        var f = fClip(a.v);
        colocar(a, x, f >= F.aterriza ? PISO : lerp(-320, PISO, ei((f - F.suelta) / (F.aterriza - F.suelta))));
        if (!aterrizo && f >= F.aterriza) { aterrizo = true; polvo(slide, x, 1.2); sacudir(slide, 6, 0.22); }
      }, function () { poner(a, a.pj + '/reposo', slide, { loop: true }); });
    });
  }

  // ── ciclo de vida ────────────────────────────────────────────────────
  function presentes() { return Object.keys(actores).map(function (p) { return actores[p]; }).filter(function (a) { return a.v; }); }
  function entrar(i, slide) {
    var L = C.laminas[i] || {}, el2 = L.elenco || [];
    presentes().forEach(function (a) { if (!el2.some(function (e) { return e.pj === a.pj; })) quitar(a); });
    el2.forEach(function (e) { var a = actor(e.pj); a.xf = e.x; a.yf = PISO; poner(a, e.reposo || e.pj + '/reposo', slide, { loop: true }); });
  }
  var corriendo = null;
  deck.addEventListener('slidechange', function (e) {
    var d = e.detail;
    if (corriendo) { corriendo.kill(); corriendo = null; }
    gsap.globalTimeline.clear();
    deck.querySelectorAll(':scope > section').forEach(function (x) { x.style.translate = ''; });
    document.querySelectorAll('[data-fantasma]').forEach(function (x) { x.remove(); });
    fijarRitmo(1);
    var Lp = d.previousIndex >= 0 ? C.laminas[d.previousIndex] : null, L = C.laminas[d.index] || {}, elenco = L.elenco || [];
    var adelante = d.previousIndex >= 0 && d.index === d.previousIndex + 1;
    if (!(adelante && Lp && Lp.sale)) { entrar(d.index, d.slide); return; }
    var sale = Lp.sale, a = actor(sale.pj);
    var sigue = function (x) { return x.pj !== sale.pj && elenco.some(function (en) { return en.pj === x.pj && !en.entra; }); };
    var seVan = presentes().filter(function (x) { return x.pj !== sale.pj && !sigue(x); });
    var fan = fantasma(d.previousSlide, d.slide, seVan);
    seVan.forEach(quitar);
    presentes().filter(sigue).forEach(function (x) { d.slide.appendChild(x.sombra); d.slide.appendChild(x.v); });
    a.xf = sale.x; a.yf = sale.continua ? PISO : -2000;
    poner(a, sale.clave, d.slide);
    var E = { a: a, k: sale.clave, x: sale.x, fan: fan, slide: d.slide };
    var cada = EF[sale.efecto](E), F = fi(sale.clave);
    cada(1);
    corriendo = tween(F.cuadros / FPS, function () { cada(fClip(a.v)); }, function () {
      corriendo = null;
      poner(a, sale.reposo || sale.pj + '/reposo', d.slide, { loop: true });
      elenco.forEach(function (en, j) {
        if (en.entra && !actor(en.pj).v) aterrizaDelCielo(actor(en.pj), en.entra, d.slide, en.x, 0.05 + j * 0.12);
      });
    });
  });
  function inicio() {
    var s = deck.querySelector('[data-deck-active]'); if (!s) return setTimeout(inicio, 50);
    entrar(Array.prototype.indexOf.call(deck.querySelectorAll(':scope > section'), s), s);
  }
  inicio();

  // ── grabadora (tools/grabar-avatares.mjs) ────────────────────────────
  window.__ocupado = function () { return gsap.globalTimeline.getChildren(true, true, true).length > 0; };
  window.__avanzar = function (dt) {
    ahora += dt * ritmo; gsap.updateRoot(ahora);
    var esperas = [];
    enCurso.forEach(function (e, v) {
      var t = tClip(v) + 0.25 / FPS;
      if (Math.abs(v.currentTime - t) > 1e-4) esperas.push(new Promise(function (ok) {
        var listo = function () { v.removeEventListener('seeked', listo); ok(); };
        v.addEventListener('seeked', listo); v.currentTime = t; setTimeout(ok, 2000);
      }));
    });
    return Promise.all(esperas).then(function () { return ahora; });
  };
})();
