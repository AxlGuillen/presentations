// Dibujo a líneas en build-time (kit.lineas): objetos 3D sencillos pintados
// solo con trazos, como una ilustración técnica. Sin dependencias y
// determinista: misma escena, mismo SVG.
//
//   const L = kit.lineas;
//   const caja = L.caja([0, 0, 0], [150, 200, 44]);
//   caja.frente.detalles.push(L.rect(caja.frente, 0.06, 0.05, 0.94, 0.95));
//   L.dibujar([caja], { camara: { ojo: [330, 190, 400] }, ancho: 800, alto: 800 })
//
// Cómo dibuja: de cada malla saca solo las aristas que un dibujante trazaría
// (siluetas, pliegues de más de `umbral` grados y bordes abiertos, nunca las
// costuras entre facetas de una superficie curva), las corta donde las cruza
// una silueta y prueba el punto medio de cada tramo contra todas las caras: si
// alguna queda delante, el tramo no se dibuja. Así salen trazos puros, sin
// rellenos que tapen, y van sobre cualquier fondo. Los detalles (marcos,
// círculos, renglones) y el achurado viven pegados a una cara y pasan por la
// misma prueba.
//
// La salida agrupa los trazos por capa (silueta, pliegue, detalle, achurado,
// cota) en coordenadas de píxeles reales, para que la receta `traza` de
// kit.efectos los anime en ese orden, como una sola pluma.
const { encadenar } = require('./kit-patrones.cjs');

// ── Vectores ─────────────────────────────────────────────────────────────
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const centro = (pts) => mul(pts.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / pts.length);
/** Normal de un polígono por el método de Newell (sirve aunque no sea plano del todo). */
const normal = (pts) => {
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    x += (a[1] - b[1]) * (a[2] + b[2]); y += (a[2] - b[2]) * (a[0] + b[0]); z += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return unit([x, y, z]);
};
const n1 = (v) => Math.round(v * 10) / 10;

// ── Mallas ───────────────────────────────────────────────────────────────
// Una cara: { pts: [[x,y,z]…] en sentido antihorario visto desde afuera,
// detalles: [[p…]…] polilíneas sobre la cara, achurado: { paso, angulo } }.
const cara = (pts, extra = {}) => ({ pts, detalles: [], achurado: null, ...extra });
const sinRepetidos = (pts) => pts.filter((p, i) => largo(sub(p, pts[(i + 1) % pts.length])) > 1e-9);

/** Junta todas las caras de una escena (arreglos, objetos con nombre, anidados). */
const aplanar = (x, out = []) => {
  if (!x) return out;
  if (Array.isArray(x)) x.forEach((y) => aplanar(y, out));
  else if (x.pts) out.push(x);
  else if (typeof x === 'object') Object.values(x).forEach((y) => aplanar(y, out));
  return out;
};

/** Caja alineada a los ejes. Caras con nombre: frente (+z), atras, der (+x),
 *  izq, arriba (+y), abajo. En cada una, u va a la derecha y v hacia arriba
 *  mirándola de frente. */
const caja = (c, [w, h, d]) => {
  const P = (i, j, k) => [c[0] + (i * w) / 2, c[1] + (j * h) / 2, c[2] + (k * d) / 2];
  return {
    frente: cara([P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)]),
    atras: cara([P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)]),
    der: cara([P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)]),
    izq: cara([P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)]),
    arriba: cara([P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)]),
    abajo: cara([P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)]),
  };
};

/** Extruye un contorno 2D (plano XY, y hacia arriba) a lo largo de Z.
 *  Devuelve { tapa (+z), fondo, lados }. */
const extruir = (contorno, prof, { z = 0 } = {}) => {
  let area = 0;
  contorno.forEach((p, i) => { const q = contorno[(i + 1) % contorno.length]; area += p[0] * q[1] - q[0] * p[1]; });
  const C = area < 0 ? contorno.slice().reverse() : contorno;
  const a = C.map(([x, y]) => [x, y, z + prof / 2]), b = C.map(([x, y]) => [x, y, z - prof / 2]);
  return {
    tapa: cara(a), fondo: cara(b.slice().reverse()),
    lados: C.map((_, i) => { const j = (i + 1) % C.length; return cara([a[i], b[i], b[j], a[j]]); }),
  };
};

/** Superficie de revolución alrededor del eje Y. perfil = [[radio, y]…] de
 *  abajo hacia arriba por la cara de afuera (para un vaso, sube por fuera y
 *  baja por dentro). Empezar o terminar en radio 0 lo cierra. */
const revolucion = (perfil, { segmentos = 48, c = [0, 0, 0] } = {}) => {
  const caras = [];
  const P = (k, i) => { const t = (i / segmentos) * Math.PI * 2, [r, y] = perfil[k]; return [c[0] + r * Math.cos(t), c[1] + y, c[2] + r * Math.sin(t)]; };
  for (let k = 0; k < perfil.length - 1; k++) {
    for (let i = 0; i < segmentos; i++) {
      const pts = sinRepetidos([P(k, i), P(k + 1, i), P(k + 1, i + 1), P(k, i + 1)]);
      if (pts.length >= 3) caras.push(cara(pts));
    }
  }
  return caras;
};

/** Cilindro vertical centrado en c. */
const cilindro = (c, r, h, segmentos = 48) => revolucion([[0, -h / 2], [r, -h / 2], [r, h / 2], [0, h / 2]], { segmentos, c });

const PHI = (1 + Math.sqrt(5)) / 2;
const VERTICES = {
  tetraedro: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
  cubo: [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))),
  octaedro: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  icosaedro: [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]],
  dodecaedro: [...[-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))),
    ...[-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [[0, a / PHI, b * PHI], [a / PHI, b * PHI, 0], [a * PHI, 0, b / PHI]]))],
};
/** Poliedro regular (dado): tetraedro (d4), cubo (d6), octaedro (d8),
 *  dodecaedro (d12) o icosaedro (d20). Las caras salen de su envolvente convexa. */
const poliedro = (nombre, c, radio) => {
  const V0 = VERTICES[nombre];
  if (!V0) throw new Error(`kit.lineas.poliedro: «${nombre}» no existe. Hay: ${Object.keys(VERTICES).join(', ')}`);
  const V = V0.map((p) => add(c, mul(unit(p), radio))), eps = radio * 1e-6, vistos = new Set(), caras = [];
  for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) for (let k = j + 1; k < V.length; k++) {
    let n = cross(sub(V[j], V[i]), sub(V[k], V[i]));
    if (largo(n) < eps) continue;
    n = unit(n);
    const d = dot(n, V[i]), lado = V.map((p) => dot(n, p) - d);
    if (lado.some((s) => s > eps * 10) && lado.some((s) => s < -eps * 10)) continue;
    const enPlano = V.map((_, m) => m).filter((m) => Math.abs(lado[m]) <= eps * 10), clave = enPlano.join(',');
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    const cc = centro(enPlano.map((m) => V[m])), afuera = dot(n, sub(cc, c)) > 0 ? n : mul(n, -1);
    const e1 = unit(sub(V[enPlano[0]], cc)), e2 = cross(afuera, e1);
    const pts = enPlano.map((m) => V[m]).sort((p, q) => Math.atan2(dot(sub(p, cc), e2), dot(sub(p, cc), e1)) - Math.atan2(dot(sub(q, cc), e2), dot(sub(q, cc), e1)));
    caras.push(cara(pts));
  }
  return caras;
};

// ── Transformaciones (devuelven copias, con los nombres de las caras) ────
const mapear = (x, f) => {
  if (Array.isArray(x)) return x.map((y) => mapear(y, f));
  if (x && x.pts) return { ...x, pts: x.pts.map(f), detalles: x.detalles.map((l) => l.map(f)) };
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, mapear(v, f)]));
  return x;
};
const mover = (obj, d) => mapear(obj, (p) => add(p, d));
const escalar = (obj, k, c = [0, 0, 0]) => mapear(obj, (p) => add(c, mul(sub(p, c), k)));
const rotar = (obj, eje, grados, c = [0, 0, 0]) => {
  const t = (grados * Math.PI) / 180, co = Math.cos(t), si = Math.sin(t);
  const R = { x: ([x, y, z]) => [x, y * co - z * si, y * si + z * co], y: ([x, y, z]) => [x * co + z * si, y, -x * si + z * co], z: ([x, y, z]) => [x * co - y * si, x * si + y * co, z] }[eje];
  return mapear(obj, (p) => add(c, R(sub(p, c))));
};

// ── Detalles sobre una cara (u, v de 0 a 1 sobre sus dos primeros lados) ──
const en = (f, u, v) => {
  const a = f.pts[0], b = f.pts[1], d = f.pts[f.pts.length - 1];
  return add(a, add(mul(sub(b, a), u), mul(sub(d, a), v)));
};
const rect = (f, u0, v0, u1, v1) => [en(f, u0, v0), en(f, u1, v0), en(f, u1, v1), en(f, u0, v1), en(f, u0, v0)];
const circulo = (f, cu, cv, ru, rv = ru, n = 64) => Array.from({ length: n + 1 }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return en(f, cu + Math.cos(a) * ru, cv + Math.sin(a) * rv);
});
const linea = (f, u0, v0, u1, v1) => [en(f, u0, v0), en(f, u1, v1)];

/** Cota de plano: línea paralela a a→b, corrida `desplaza`, con sus dos
 *  líneas de referencia y la medida. Va en `encima` de dibujar(). */
const cota = (a, b, desplaza, texto = '') => [
  { pts: [add(a, desplaza), add(b, desplaza)], texto },
  { pts: [add(a, mul(desplaza, 0.25)), add(a, mul(desplaza, 1.25))] },
  { pts: [add(b, mul(desplaza, 0.25)), add(b, mul(desplaza, 1.25))] },
];

// ── Cámara ───────────────────────────────────────────────────────────────
/** { ojo, centro, fov } en perspectiva (fov estrecho, 20–28°, es lo elegante),
 *  o { iso: true, giro, altura } isométrica / axonométrica (ortográfica). */
const hacerCamara = ({ ojo = [320, 220, 480], centro: c = [0, 0, 0], fov = 24, iso = false, giro = 45, altura = 35.264 } = {}) => {
  let f, eye;
  if (iso) {
    const g = (giro * Math.PI) / 180, h = (altura * Math.PI) / 180;
    f = unit([-Math.sin(g) * Math.cos(h), -Math.sin(h), -Math.cos(g) * Math.cos(h)]);
    eye = sub(c, mul(f, 1e4));
  } else { eye = ojo; f = unit(sub(c, ojo)); }
  let r = cross(f, [0, 1, 0]);
  if (largo(r) < 1e-6) r = [1, 0, 0];
  r = unit(r);
  const u = cross(r, f), K = iso ? 1 : 1 / Math.tan((fov * Math.PI) / 360);
  const aCam = (p) => { const q = sub(p, eye); return [dot(q, r), dot(q, u), dot(q, f)]; };
  return {
    iso, K, aCam,
    giro: (n) => [dot(n, r), dot(n, u), dot(n, f)],
    proyecta: (pc) => (iso ? [pc[0], -pc[1], pc[2]] : [(pc[0] * K) / pc[2], (-pc[1] * K) / pc[2], pc[2]]),
    deFrente: (n, punto) => (iso ? dot(n, f) < 0 : dot(n, sub(eye, punto)) > 0),
    // profundidad del plano (nc·p = c, en coordenadas de cámara) bajo un punto de pantalla
    hondo: (nc, cc, sx, sy) => {
      if (iso) return Math.abs(nc[2]) < 1e-9 ? null : (cc - nc[0] * sx + nc[1] * sy) / nc[2];
      const den = (nc[0] * sx) / K - (nc[1] * sy) / K + nc[2];
      return Math.abs(den) < 1e-12 ? null : cc / den;
    },
  };
};

// ── Achurado: en pantalla, como un grabado ───────────────────────────────
// Paralelas a `angulo` grados separadas `paso` px, ancladas al origen del
// dibujo: las de caras vecinas caen sobre la misma recta y se unen en un solo
// trazo. (Rayar cada faceta en su propio plano daba ruido en las superficies
// curvas: cada una con su inclinación.) Recortadas al polígono por pares de
// cruces, así sirven también para polígonos cóncavos.
const rayar = (poly, paso, angulo) => {
  const t = (angulo * Math.PI) / 180, d = [Math.cos(t), Math.sin(t)], m = [-d[1], d[0]];
  const P = poly.map(([x, y]) => [x * d[0] + y * d[1], x * m[0] + y * m[1]]), ws = P.map((p) => p[1]), out = [];
  const de = (U, W) => [U * d[0] + W * m[0], U * d[1] + W * m[1]];
  for (let k = Math.ceil(Math.min(...ws) / paso); k * paso <= Math.max(...ws); k++) {
    const w = k * paso, us = [];
    P.forEach((a, i) => { const b = P[(i + 1) % P.length]; if ((a[1] <= w) !== (b[1] <= w)) us.push(a[0] + ((w - a[1]) / (b[1] - a[1])) * (b[0] - a[0])); });
    us.sort((p, q) => p - q);
    for (let i = 0; i + 1 < us.length; i += 2) out.push([...de(us[i], w), ...de(us[i + 1], w)]);
  }
  return out;
};

// ── Geometría de pantalla ────────────────────────────────────────────────
const dentro = (x, y, poly) => {
  let s = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) s = !s;
  }
  return s;
};
const corte = (A, B, C, D) => {
  const r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - C[0], D[1] - C[1]], den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-12) return null;
  const t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den, w = ((C[0] - A[0]) * r[1] - (C[1] - A[1]) * r[0]) / den;
  return t > 1e-6 && t < 1 - 1e-6 && w >= -1e-6 && w <= 1 + 1e-6 ? t : null;
};

/** Pinta una escena. Devuelve un <svg data-lineas> con viewBox en píxeles. */
const dibujar = (objetos, {
  camara: opCam = {}, ancho = 800, alto = 800, margen = 24,
  tinta = '#F2EFE8', acento = tinta, grosor = 2.2, fino = 1.2,
  umbral = 30, sombra = null, encima = [], estilo = '', titulo = 'Dibujo a líneas', tamTexto = 14,
} = {}) => {
  const cam = hacerCamara(opCam), caras = aplanar(objetos);
  // 1 · caras: normal, si da a la cámara, plano en coordenadas de cámara
  const F = caras.map((f) => {
    const pts = sinRepetidos(f.pts), n = normal(pts), pc = pts.map(cam.aCam), ps = pc.map(cam.proyecta), nc = cam.giro(n);
    return { f, pts, n, frente: cam.deFrente(n, centro(pts)), nc, cc: dot(nc, pc[0]), ps,
      bx: [Math.min(...ps.map((p) => p[0])), Math.max(...ps.map((p) => p[0]))], by: [Math.min(...ps.map((p) => p[1])), Math.max(...ps.map((p) => p[1]))] };
  });
  const zs = F.flatMap((x) => x.ps.map((p) => p[2])), eps = (Math.max(...zs) - Math.min(...zs) + 1) * 2e-4;
  // 2 · aristas, compartidas por clave de vértice
  const clave = (p) => p.map((v) => Math.round(v * 1000)).join(',');
  const aristas = new Map();
  F.forEach((x, i) => x.pts.forEach((p, k) => {
    const q = x.pts[(k + 1) % x.pts.length], ka = clave(p), kb = clave(q), id = ka < kb ? ka + '|' + kb : kb + '|' + ka;
    if (!aristas.has(id)) aristas.set(id, { a: p, b: q, caras: [] });
    aristas.get(id).caras.push(i);
  }));
  const segs = [], cortan = [], cosUmbral = Math.cos((umbral * Math.PI) / 180);
  for (const e of aristas.values()) {
    const fr = e.caras.map((i) => F[i].frente);
    let capa = null;
    if (e.caras.length === 1) capa = fr[0] ? 'borde' : null;
    else if (e.caras.length === 2) {
      if (fr[0] !== fr[1]) capa = 'silueta';
      else if (fr[0] && dot(F[e.caras[0]].n, F[e.caras[1]].n) < cosUmbral) capa = 'pliegue';
    } else if (fr.some(Boolean)) capa = 'pliegue';
    if (capa === 'silueta' || capa === 'borde') cortan.push([cam.proyecta(cam.aCam(e.a)), cam.proyecta(cam.aCam(e.b))]);
    if (capa) segs.push({ a: e.a, b: e.b, capa: capa === 'borde' ? 'silueta' : capa, excluye: e.caras });
  }
  // 3 · detalles de las caras que dan a la cámara; el achurado se apunta y se
  // raya al final, cuando ya se sabe la escala en píxeles
  const luz = sombra ? unit(sombra.luz || [-0.5, 1, 0.8]) : null, rayados = [];
  F.forEach((x, i) => {
    if (!x.frente) return;
    for (const l of x.f.detalles) for (let k = 0; k + 1 < l.length; k++) segs.push({ a: l[k], b: l[k + 1], capa: 'detalle', excluye: [i] });
    if (x.f.achurado) {
      const { paso = 6, angulo = 45, cruzado = false } = x.f.achurado;
      rayados.push({ i, paso, angulo, cruzado });
    } else if (luz) {
      const tono = 1 - Math.max(0, dot(x.n, luz)), [u1 = 0.45, u2 = 0.8] = sombra.umbrales || [];
      if (tono > u1) rayados.push({ i, paso: sombra.paso || 6, angulo: sombra.angulo == null ? 45 : sombra.angulo, cruzado: tono > u2 });
    }
  });
  // 4 · cortar en las siluetas y quedarse con los tramos que nadie tapa
  const visibles = { silueta: [], pliegue: [], detalle: [] };
  const tapado = (sx, sy, z, excluye) => F.some((x, i) => {
    if (excluye.includes(i) || sx < x.bx[0] || sx > x.bx[1] || sy < x.by[0] || sy > x.by[1] || !dentro(sx, sy, x.ps)) return false;
    const h = cam.hondo(x.nc, x.cc, sx, sy);
    return h !== null && h < z - eps;
  });
  for (const s of segs) {
    const ca = cam.aCam(s.a), cb = cam.aCam(s.b), A = cam.proyecta(ca), B = cam.proyecta(cb);
    const ts = [0, 1];
    for (const [C, D] of cortan) { const t = corte(A, B, C, D); if (t !== null) ts.push(t); }
    ts.sort((p, q) => p - q);
    for (let k = 0; k + 1 < ts.length; k++) {
      if (ts[k + 1] - ts[k] < 1e-6) continue;
      const tm = (ts[k] + ts[k + 1]) / 2, sx = A[0] + (B[0] - A[0]) * tm, sy = A[1] + (B[1] - A[1]) * tm;
      // profundidad del punto medio: 1/z se interpola en línea recta en pantalla
      const z = cam.iso ? ca[2] + (cb[2] - ca[2]) * tm : 1 / ((1 - tm) / ca[2] + tm / cb[2]);
      if (tapado(sx, sy, z, s.excluye)) continue;
      visibles[s.capa].push([A[0] + (B[0] - A[0]) * ts[k], A[1] + (B[1] - A[1]) * ts[k], A[0] + (B[0] - A[0]) * ts[k + 1], A[1] + (B[1] - A[1]) * ts[k + 1]]);
    }
  }
  // 5 · encuadre: todo a píxeles dentro de ancho × alto
  const notas = encima.flat().map((e) => ({ ...e, P: e.pts.map((p) => cam.proyecta(cam.aCam(p))) }));
  const xs = [], ys = [];
  Object.values(visibles).flat().forEach((q) => { xs.push(q[0], q[2]); ys.push(q[1], q[3]); });
  notas.forEach((e) => e.P.forEach((p) => { xs.push(p[0]); ys.push(p[1]); }));
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((ancho - 2 * margen) / (x1 - x0 || 1), (alto - 2 * margen) / (y1 - y0 || 1));
  const ox = (ancho - (x1 - x0) * k) / 2 - x0 * k, oy = (alto - (y1 - y0) * k) / 2 - y0 * k;
  const X = (v) => v * k + ox, Y = (v) => v * k + oy;
  // 6 · achurado, ya en píxeles: se raya el polígono proyectado de cada cara,
  // se corta en las siluetas y cada tramo se prueba con la profundidad de su cara
  const achurado = [], cortanPx = cortan.map(([C, D]) => [[X(C[0]), Y(C[1])], [X(D[0]), Y(D[1])]]);
  for (const r of rayados) {
    const x = F[r.i], poly = x.ps.map((p) => [X(p[0]), Y(p[1])]);
    const lineas = rayar(poly, r.paso, r.angulo).concat(r.cruzado ? rayar(poly, r.paso, r.angulo + 90) : []);
    for (const [ax, ay, bx, by] of lineas) {
      const ts = [0, 1];
      for (const [C, D] of cortanPx) { const t = corte([ax, ay], [bx, by], C, D); if (t !== null) ts.push(t); }
      ts.sort((p, q) => p - q);
      for (let j = 0; j + 1 < ts.length; j++) {
        const tm = (ts[j] + ts[j + 1]) / 2, sx = ((ax + (bx - ax) * tm) - ox) / k, sy = ((ay + (by - ay) * tm) - oy) / k;
        const z = cam.hondo(x.nc, x.cc, sx, sy);
        if (z === null || tapado(sx, sy, z, [r.i])) continue;
        achurado.push([ax + (bx - ax) * ts[j], ay + (by - ay) * ts[j], ax + (bx - ax) * ts[j + 1], ay + (by - ay) * ts[j + 1]]);
      }
    }
  }
  const ruta = (l) => 'M' + l.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L');
  const capa = (nombre, lista, ancho_, enPx = false) => {
    if (!lista.length) return '';
    const cadenas = encadenar(enPx ? lista : lista.map((q) => [X(q[0]), Y(q[1]), X(q[2]), Y(q[3])])).filter((l) => l.length > 1);
    cadenas.sort((a, b) => b.length - a.length);
    return `<g data-capa="${nombre}" stroke-width="${ancho_}"${nombre === 'achurado' ? ' stroke-opacity=".75"' : ''}>${cadenas.map((l) => `<path d="${ruta(l)}"/>`).join('')}</g>`;
  };
  // cotas y anotaciones: encima de todo, en el acento, con la medida del lado de afuera
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  let cotas = '';
  for (const e of notas) {
    cotas += `<path d="${ruta(e.P.map((p) => [X(p[0]), Y(p[1])]))}"/>`;
    if (e.texto) {
      const a = e.P[0], b = e.P[e.P.length - 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let px = -(b[1] - a[1]), py = b[0] - a[0];
      const l = Math.hypot(px, py) || 1; px /= l; py /= l;
      if (px * (mx - cx) + py * (my - cy) < 0) { px = -px; py = -py; }
      cotas += `<text x="${n1(X(mx) + px * tamTexto * 1.1)}" y="${n1(Y(my) + py * tamTexto * 1.1)}" fill="${acento}" stroke="none" font-family="'Geist Mono', 'JetBrains Mono', ui-monospace, monospace" font-size="${tamTexto}" text-anchor="middle" dominant-baseline="central">${e.texto}</text>`;
    }
  }
  return `<svg data-lineas viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${titulo}" style="display:block;overflow:visible;${estilo}">` +
    `<g fill="none" stroke="${tinta}" stroke-linecap="round" stroke-linejoin="round">` +
    capa('silueta', visibles.silueta, grosor) + capa('pliegue', visibles.pliegue, grosor * 0.85) +
    capa('detalle', visibles.detalle, fino) + capa('achurado', achurado, fino * 0.8, true) + '</g>' +
    (cotas ? `<g data-capa="cota" fill="none" stroke="${acento}" stroke-width="${fino}" stroke-linecap="round">${cotas}</g>` : '') + '</svg>';
};

module.exports = { caja, extruir, revolucion, cilindro, poliedro, cara, mover, rotar, escalar, en, rect, circulo, linea, cota, dibujar, aplanar };
