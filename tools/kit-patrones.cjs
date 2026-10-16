// tools/kit-patrones.cjs — Texturas y patrones generativos, en build-time.
//
//   kit.patron(tipo, opciones)       → <svg> inline (cada pieza con data-pieza,
//                                       lista para efecto('piezas'))
//   kit.patronFondo(tipo, opciones)  → capa para kit.fondo() (data-URI)
//
// Tipos: puntos · confeti · flujo · curvas · facetas · medio-tono · ondas ·
//        trazo · marco
//
// Por qué generarlos y no bajarlos: con la misma semilla sale exactamente el
// mismo SVG cada vez que se corre gen.js (diffs limpios, video determinista),
// toman la paleta del deck y no hay licencia de terceros que cuidar. Sin
// dependencias: el ruido simplex, el muestreo de Poisson y las curvas de nivel
// están aquí mismo.
//
// Opciones comunes: ancho (1080), alto (1920), paleta (['#FFFFFF']),
// semilla ('patron'), opacidad (1), estilo (CSS extra para el <svg>).

/** Hash FNV-1a de un texto a entero de 32 bits (la semilla). */
const semillaDe = (txt) => {
  let h = 2166136261 >>> 0;
  for (const c of String(txt)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

/** PRNG mulberry32: rápido, de 32 bits y reproducible. */
const prng = (semilla) => {
  let a = typeof semilla === 'number' ? semilla : semillaDe(semilla);
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Ruido simplex 2D (algoritmo de Stefan Gustavson), permutación con semilla.
 *  Devuelve valores en [-1, 1] aprox. */
const ruido2D = (r) => {
  const grad = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  return (xin, yin) => {
    const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s);
    const t = (i + j) * G2, x0 = xin - (i - t), y0 = yin - (j - t);
    const [i1, j1] = x0 > y0 ? [1, 0] : [0, 1];
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    const esquina = (x, y, g) => { let tt = 0.5 - x * x - y * y; if (tt < 0) return 0; tt *= tt; return tt * tt * (g[0] * x + g[1] * y); };
    return 70 * (esquina(x0, y0, grad[perm[ii + perm[jj]] & 7]) +
                 esquina(x1, y1, grad[perm[ii + i1 + perm[jj + j1]] & 7]) +
                 esquina(x2, y2, grad[perm[ii + 1 + perm[jj + 1]] & 7]));
  };
};

const n1 = (v) => Math.round(v * 10) / 10;                   // un decimal: SVG ligero
const elige = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];
const hexARgb = (h) => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbAHex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
/** Color a lo largo de la paleta con t en [0,1] (interpolación lineal). */
const enPaleta = (paleta, t) => {
  if (paleta.length === 1) return paleta[0];
  const x = Math.max(0, Math.min(0.9999, t)) * (paleta.length - 1), k = Math.floor(x), f = x - k;
  const a = hexARgb(paleta[k]), b = hexARgb(paleta[k + 1]);
  return rgbAHex(a.map((v, i) => v + (b[i] - v) * f));
};

/** Muestreo de Poisson (Bridson): puntos repartidos sin encimarse. */
const poisson = (r, ancho, alto, radio, k = 24, max = 4000) => {
  const celda = radio / Math.SQRT2, cols = Math.ceil(ancho / celda), filas = Math.ceil(alto / celda);
  const rejilla = new Array(cols * filas).fill(-1), pts = [], activos = [];
  const agrega = (p) => { pts.push(p); activos.push(p); rejilla[Math.floor(p[1] / celda) * cols + Math.floor(p[0] / celda)] = pts.length - 1; };
  agrega([r() * ancho, r() * alto]);
  while (activos.length && pts.length < max) {
    const idx = Math.floor(r() * activos.length), [px, py] = activos[idx];
    let encontrado = false;
    for (let n = 0; n < k; n++) {
      const ang = r() * Math.PI * 2, d = radio * (1 + r());
      const x = px + Math.cos(ang) * d, y = py + Math.sin(ang) * d;
      if (x < 0 || y < 0 || x >= ancho || y >= alto) continue;
      const cx = Math.floor(x / celda), cy = Math.floor(y / celda);
      let ok = true;
      for (let yy = Math.max(0, cy - 2); ok && yy <= Math.min(filas - 1, cy + 2); yy++) {
        for (let xx = Math.max(0, cx - 2); xx <= Math.min(cols - 1, cx + 2); xx++) {
          const q = rejilla[yy * cols + xx];
          if (q >= 0 && (pts[q][0] - x) ** 2 + (pts[q][1] - y) ** 2 < radio * radio) { ok = false; break; }
        }
      }
      if (ok) { agrega([x, y]); encontrado = true; break; }
    }
    if (!encontrado) activos.splice(idx, 1);
  }
  return pts;
};

/** ¿El punto cae en el hueco reservado? hueco = [x0, y0, x1, y1] en fracciones. */
const enHueco = (hueco, x, y, ancho, alto) =>
  hueco && x > hueco[0] * ancho && x < hueco[2] * ancho && y > hueco[1] * alto && y < hueco[3] * alto;

/** Une segmentos sueltos [[x1,y1,x2,y2],…] en polilíneas continuas. */
const encadenar = (segs) => {
  const clave = (x, y) => `${Math.round(x * 4)},${Math.round(y * 4)}`;
  const porPunto = new Map(), usado = new Uint8Array(segs.length);
  segs.forEach((s, i) => {
    for (const k of [clave(s[0], s[1]), clave(s[2], s[3])]) { if (!porPunto.has(k)) porPunto.set(k, []); porPunto.get(k).push(i); }
  });
  const siguiente = (x, y) => (porPunto.get(clave(x, y)) || []).find((i) => !usado[i]);
  const lineas = [];
  for (let i = 0; i < segs.length; i++) {
    if (usado[i]) continue;
    usado[i] = 1;
    const linea = [[segs[i][0], segs[i][1]], [segs[i][2], segs[i][3]]];
    for (const extremo of ['fin', 'ini']) {
      for (;;) {
        const [x, y] = extremo === 'fin' ? linea[linea.length - 1] : linea[0];
        const j = siguiente(x, y);
        if (j === undefined) break;
        usado[j] = 1;
        const s = segs[j], otro = clave(s[0], s[1]) === clave(x, y) ? [s[2], s[3]] : [s[0], s[1]];
        if (extremo === 'fin') linea.push(otro); else linea.unshift(otro);
      }
    }
    lineas.push(linea);
  }
  return lineas;
};

const ruta = (pts, cerrar = false) =>
  'M' + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join('L') + (cerrar ? 'Z' : '');

/** Trazo «a mano»: línea con temblor y algo de curva, como roughjs. */
const trazoAMano = (r, x1, y1, x2, y2, temblor) => {
  const largo = Math.hypot(x2 - x1, y2 - y1), pasos = Math.max(4, Math.round(largo / 40));
  const nx = -(y2 - y1) / (largo || 1), ny = (x2 - x1) / (largo || 1), comba = (r() * 2 - 1) * temblor;
  const pts = [];
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos, arco = Math.sin(t * Math.PI) * comba, j = (r() * 2 - 1) * temblor * 0.35;
    pts.push([x1 + (x2 - x1) * t + nx * (arco + j), y1 + (y2 - y1) * t + ny * (arco + j)]);
  }
  return pts;
};

// ── Generadores ─────────────────────────────────────────────────────────
const GEN = {
  // Puntos repartidos sin encimarse, de tamaños y opacidades variadas.
  puntos({ ancho, alto, paleta, r, separacion = 46, tam = 1, opacidad, hueco }) {
    return poisson(r, ancho, alto, separacion)
      .filter(([x, y]) => !enHueco(hueco, x, y, ancho, alto))
      .map(([x, y]) => `<circle data-pieza cx="${n1(x)}" cy="${n1(y)}" r="${n1(separacion * (0.06 + r() * 0.12) * tam)}" fill="${elige(r, paleta)}" opacity="${n1((0.35 + r() * 0.65) * opacidad * 10) / 10}"/>`);
  },

  // Confeti y serpentinas. hueco: [x0,y0,x1,y1] deja libre el centro.
  confeti({ ancho, alto, paleta, r, cantidad = 90, tam = 1, opacidad, hueco }) {
    const out = [];
    for (let i = 0, intentos = 0; out.length < cantidad && intentos < cantidad * 20; intentos++) {
      const x = r() * ancho, y = r() * alto;
      if (enHueco(hueco, x, y, ancho, alto)) continue;
      i++;
      const c = elige(r, paleta), rot = n1(r() * 360), t = tam * (0.7 + r() * 0.8), forma = r();
      let f;
      if (forma < 0.4) f = `<rect x="${n1(-11 * t)}" y="${n1(-5 * t)}" width="${n1(22 * t)}" height="${n1(10 * t)}" rx="${n1(2 * t)}" fill="${c}"/>`;
      else if (forma < 0.6) f = `<circle r="${n1(7 * t)}" fill="${c}"/>`;
      else if (forma < 0.75) f = `<path d="M${n1(-9 * t)} ${n1(7 * t)}L0 ${n1(-9 * t)}L${n1(9 * t)} ${n1(7 * t)}Z" fill="${c}"/>`;
      else {
        const L = 46 * t, pts = [];
        for (let k = 0; k <= 12; k++) pts.push([-L / 2 + (L * k) / 12, Math.sin((k / 12) * Math.PI * 3) * 7 * t]);
        f = `<path d="${ruta(pts)}" fill="none" stroke="${c}" stroke-width="${n1(5 * t)}" stroke-linecap="round"/>`;
      }
      out.push(`<g data-pieza transform="translate(${n1(x)} ${n1(y)}) rotate(${rot})" opacity="${opacidad}">${f}</g>`);
    }
    return out;
  },

  // Líneas de flujo que siguen un campo de ruido.
  flujo({ ancho, alto, paleta, r, ruido, lineas = 110, pasos = 70, paso = 9, escala = 0.0015, giro = 1, grosor = 2, opacidad }) {
    const out = [];
    for (let i = 0; i < lineas; i++) {
      let x = r() * ancho, y = r() * alto;
      const pts = [[x, y]];
      for (let k = 0; k < pasos; k++) {
        const a = ruido(x * escala, y * escala) * Math.PI * 2 * giro;
        x += Math.cos(a) * paso; y += Math.sin(a) * paso;
        if (x < -20 || y < -20 || x > ancho + 20 || y > alto + 20) break;
        pts.push([x, y]);
      }
      if (pts.length < 6) continue;
      out.push(`<path data-pieza d="${ruta(pts)}" fill="none" stroke="${elige(r, paleta)}" stroke-width="${grosor}" stroke-linecap="round" opacity="${n1((0.4 + r() * 0.6) * opacidad * 10) / 10}"/>`);
    }
    return out;
  },

  // Curvas de nivel (mapa topográfico) por marching squares sobre ruido.
  curvas({ ancho, alto, paleta, ruido, niveles = 13, celda = 14, escala = 0.0019, grosor = 1.8, opacidad }) {
    const cols = Math.ceil(ancho / celda) + 1, filas = Math.ceil(alto / celda) + 1;
    const v = (i, j) => { const x = i * celda * escala, y = j * celda * escala; return ruido(x, y) * 0.75 + ruido(x * 2.1 + 7, y * 2.1 + 3) * 0.25; };
    const campo = [];
    for (let j = 0; j < filas; j++) for (let i = 0; i < cols; i++) campo.push(v(i, j));
    const val = (i, j) => campo[j * cols + i];
    const out = [];
    for (let n = 1; n <= niveles; n++) {
      const umbral = -0.8 + (1.6 * n) / (niveles + 1), segs = [];
      const interp = (x1, y1, a, x2, y2, b) => { const t = (umbral - a) / (b - a || 1e-9); return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]; };
      for (let j = 0; j < filas - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = val(i, j), b = val(i + 1, j), c = val(i + 1, j + 1), d = val(i, j + 1);
          const x = i * celda, y = j * celda, X = x + celda, Y = y + celda;
          const caso = (a > umbral ? 8 : 0) | (b > umbral ? 4 : 0) | (c > umbral ? 2 : 0) | (d > umbral ? 1 : 0);
          if (caso === 0 || caso === 15) continue;
          const arriba = () => interp(x, y, a, X, y, b), derecha = () => interp(X, y, b, X, Y, c);
          const abajo = () => interp(x, Y, d, X, Y, c), izq = () => interp(x, y, a, x, Y, d);
          const pares = {
            1: [[izq, abajo]], 2: [[abajo, derecha]], 3: [[izq, derecha]], 4: [[arriba, derecha]], 5: [[izq, arriba], [abajo, derecha]],
            6: [[arriba, abajo]], 7: [[izq, arriba]], 8: [[izq, arriba]], 9: [[arriba, abajo]], 10: [[arriba, derecha], [izq, abajo]],
            11: [[arriba, derecha]], 12: [[izq, derecha]], 13: [[abajo, derecha]], 14: [[izq, abajo]],
          }[caso];
          for (const [p, q] of pares) { const P = p(), Q = q(); segs.push([P[0], P[1], Q[0], Q[1]]); }
        }
      }
      const d = encadenar(segs).filter((l) => l.length > 3).map((l) => ruta(l)).join('');
      if (d) out.push(`<path data-pieza d="${d}" fill="none" stroke="${enPaleta(paleta, n / niveles)}" stroke-width="${grosor}" stroke-linejoin="round" opacity="${opacidad}"/>`);
    }
    return out;
  },

  // Low-poly: triángulos sobre una rejilla con temblor, color por ruido.
  facetas({ ancho, alto, paleta, r, ruido, columnas = 8, temblor = 0.38, escala = 0.0013, opacidad }) {
    const paso = ancho / columnas, filas = Math.ceil(alto / paso), p = [];
    for (let j = 0; j <= filas; j++) {
      const fila = [];
      for (let i = 0; i <= columnas; i++) {
        const borde = i === 0 || j === 0 || i === columnas || j === filas;
        fila.push([i * paso + (borde ? 0 : (r() * 2 - 1) * paso * temblor), j * paso + (borde ? 0 : (r() * 2 - 1) * paso * temblor)]);
      }
      p.push(fila);
    }
    const out = [];
    const tri = (a, b, c) => {
      const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3;
      const t = (ruido(cx * escala, cy * escala) + 1) / 2 * 0.85 + (cy / alto) * 0.15;
      const col = enPaleta(paleta, t);
      out.push(`<path data-pieza d="${ruta([a, b, c], true)}" fill="${col}" stroke="${col}" stroke-width="1" opacity="${opacidad}"/>`);
    };
    for (let j = 0; j < filas; j++) {
      for (let i = 0; i < columnas; i++) {
        const a = p[j][i], b = p[j][i + 1], c = p[j + 1][i + 1], d = p[j + 1][i];
        if ((i + j) % 2) { tri(a, b, c); tri(a, c, d); } else { tri(a, b, d); tri(b, c, d); }
      }
    }
    return out;
  },

  // Trama de medio tono: puntos en rejilla hexagonal que crecen hacia un lado.
  'medio-tono'({ ancho, alto, paleta, ruido, paso = 42, direccion = 'abajo', escala = 0.002, opacidad }) {
    const out = [], dy = paso * 0.866;
    for (let j = 0, y = 0; y <= alto + paso; j++, y = j * dy) {
      for (let x = (j % 2) * paso / 2; x <= ancho + paso; x += paso) {
        const g = { abajo: y / alto, arriba: 1 - y / alto, derecha: x / ancho, izquierda: 1 - x / ancho, centro: 1 - Math.hypot(x / ancho - 0.5, y / alto - 0.5) * 1.6 }[direccion];
        const f = Math.max(0, Math.min(1, g * 0.85 + ruido(x * escala, y * escala) * 0.25));
        const rad = (paso / 2) * f;
        if (rad < 1.2) continue;
        out.push(`<circle data-pieza cx="${n1(x)}" cy="${n1(y)}" r="${n1(rad)}" fill="${paleta[0]}" opacity="${opacidad}"/>`);
      }
    }
    return out;
  },

  // Olas en capas (al estilo de los generadores de fondos), de abajo arriba.
  ondas({ ancho, alto, paleta, ruido, capas = 5, desde = 0.55, amplitud = 70, opacidad }) {
    const out = [];
    for (let k = 0; k < capas; k++) {
      const base = alto * (desde + ((1 - desde) * k) / capas), pts = [[0, alto]];
      for (let x = 0; x <= ancho; x += 18) pts.push([x, base + ruido(x * 0.0022, k * 3.1) * amplitud]);
      pts.push([ancho, alto]);
      out.push(`<path data-pieza d="${ruta(pts, true)}" fill="${enPaleta(paleta, k / Math.max(1, capas - 1))}" opacity="${opacidad}"/>`);
    }
    return out;
  },

  // Subrayado a mano: dos pasadas de plumón. Usar con ancho/alto pequeños.
  trazo({ ancho, alto, paleta, r, grosor = 10, temblor = 7, pasadas = 2 }) {
    const out = [];
    for (let k = 0; k < pasadas; k++) {
      const y = alto / 2 + (k - (pasadas - 1) / 2) * grosor * 0.6;
      out.push(`<path data-pieza d="${ruta(trazoAMano(r, grosor, y, ancho - grosor, y + (r() * 2 - 1) * temblor, temblor))}" fill="none" stroke="${paleta[0]}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    return out;
  },

  // Crestas que se tapan entre sí (la portada de Unknown Pleasures). Trazos
  // puros, sin rellenos: el «horizonte flotante» dibuja de adelante hacia atrás
  // y de cada línea solo deja lo que asoma por encima de las de adelante, así
  // va sobre cualquier fondo. Una pieza por línea.
  hilos({ ancho, alto, paleta, ruido, lineas = 44, amplitud = 5.5, campana = 0.24, desde = 0.18, hasta = 0.92, grosor = 1.3, opacidad }) {
    const paso = (alto * (hasta - desde)) / (lineas - 1), dx = 6, N = Math.ceil(ancho / dx) + 1, out = [];
    const H = new Float64Array(N).fill(Infinity);
    for (let k = lineas - 1; k >= 0; k--) {
      const y0 = alto * desde + k * paso, ys = new Float64Array(N);
      for (let i = 0; i < N; i++) {
        const x = i * dx, u = (x - ancho / 2) / (ancho * campana), c = Math.exp(-u * u);
        const v = (ruido(x * 0.012, k * 0.35) + 1) / 2 + 0.35 * ((ruido(x * 0.045, k * 0.9 + 9) + 1) / 2);
        ys[i] = y0 - c * v * paso * amplitud + ruido(x * 0.05, k * 2.1) * paso * 0.12;
      }
      let d = '', abierto = false;
      const punto = (x, y) => { d += `${abierto ? 'L' : 'M'}${n1(x)} ${n1(y)}`; abierto = true; };
      for (let i = 0; i < N; i++) {
        const vis = ys[i] < H[i] - 0.5;
        if (i > 0) {
          const visA = ys[i - 1] < H[i - 1] - 0.5;
          if (vis !== visA) {   // cruce con el horizonte: corta justo ahí
            const a = H[i - 1] - ys[i - 1], b = H[i] - ys[i], t = Number.isFinite(a) && Number.isFinite(b) ? a / (a - b) : (vis ? 0 : 1);
            const x = (i - 1 + t) * dx, y = ys[i - 1] + (ys[i] - ys[i - 1]) * t;
            punto(x, y);
            if (!vis) abierto = false;
          }
        }
        if (vis) punto(i * dx, ys[i]);
        else abierto = false;
      }
      for (let i = 0; i < N; i++) H[i] = Math.min(H[i], ys[i]);
      if (d) out.unshift(`<path data-pieza d="${d}" fill="none" stroke="${enPaleta(paleta, k / lineas)}" stroke-width="${grosor}" stroke-linejoin="round" stroke-linecap="round" opacity="${opacidad}"/>`);
    }
    return out;
  },

  // Rejilla en perspectiva hasta el horizonte y un sol de franjas (paleta:
  // rejilla, sol, línea del horizonte).
  horizonte({ ancho, alto, paleta, horizonte: h = 0.55, radiales = 15, filas = 13, sol = true, grosor = 1.4, opacidad }) {
    const hy = alto * h, cx = ancho / 2, out = [];
    const [rej, solC = rej, linea = rej] = paleta, pieza = (x1, y1, x2, y2, c, op = opacidad) =>
      `<line data-pieza x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" stroke="${c}" stroke-width="${grosor}" stroke-linecap="round" opacity="${op}"/>`;
    out.push(pieza(0, hy, ancho, hy, linea));
    if (sol) {
      const r = Math.min(ancho, alto) * 0.2, sy = hy - r * 0.08, s = r / 11;
      for (let y = sy - r + s * 0.5, j = 0; y < hy - 2; y += s, j++) {
        const w = Math.sqrt(Math.max(0, r * r - (y - sy) ** 2));
        if ((y - (sy - r)) / r > 0.5 && j % 2) continue;   // la mitad de abajo, en franjas
        out.push(pieza(cx - w, y, cx + w, y, solC));
      }
    }
    for (let i = -radiales; i <= radiales; i++) {
      // la fuga se corta en el borde del lienzo, no más allá
      const x2 = cx + (i / radiales) * ancho * 1.6, t = x2 < 0 ? cx / (cx - x2) : x2 > ancho ? (ancho - cx) / (x2 - cx) : 1;
      out.push(pieza(cx, hy, cx + (x2 - cx) * t, hy + (alto - hy) * t, rej, opacidad * 0.75));
    }
    for (let j = 0; j < filas; j++) { const y = hy + (alto - hy) / (1 + j * 0.42); out.push(pieza(0, y, ancho, y, rej, opacidad * 0.75)); }
    return out;
  },

  // Guilloché: anillos ondulados con la fase corrida, como el fondo de un
  // billete. Dos bandas concéntricas; una pieza por anillo.
  guilloche({ ancho, alto, paleta, radio = 0.34, anillos = 12, ondas = 14, amplitud = 0.07, grosor = 1, muestras = 300, opacidad }) {
    const cx = ancho / 2, cy = alto / 2, R = Math.min(ancho, alto) * radio, out = [];
    for (const [banda, rb, sentido] of [[0, R, 1], [1, R * 0.62, -1]]) {
      for (let k = 0; k < anillos; k++) {
        const fase = (k / anillos) * Math.PI * 2 / ondas * sentido, pts = [];
        for (let i = 0; i <= muestras; i++) {
          const t = (i / muestras) * Math.PI * 2, r = rb * (1 + amplitud * Math.sin(ondas * t + fase * ondas) + amplitud * 0.45 * Math.sin((ondas * 2 + 1) * t - fase * 3));
          pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
        }
        out.push(`<path data-pieza d="${ruta(pts, true)}" fill="none" stroke="${enPaleta(paleta, (banda + k / anillos) / 2)}" stroke-width="${grosor}" opacity="${opacidad}"/>`);
      }
    }
    return out;
  },

  // Marco a mano: cuatro lados con sobrepaso y doble pasada.
  marco({ ancho, alto, paleta, r, grosor = 6, temblor = 6, pasadas = 2 }) {
    const out = [], m = grosor * 2, sob = 18;
    for (let k = 0; k < pasadas; k++) {
      const lados = [[m - sob, m, ancho - m + sob, m], [ancho - m, m - sob, ancho - m, alto - m + sob],
                     [ancho - m + sob, alto - m, m - sob, alto - m], [m, alto - m + sob, m, m - sob]];
      for (const [x1, y1, x2, y2] of lados) {
        out.push(`<path data-pieza d="${ruta(trazoAMano(r, x1, y1, x2, y2, temblor))}" fill="none" stroke="${paleta[0]}" stroke-width="${grosor}" stroke-linecap="round"/>`);
      }
    }
    return out;
  },
};

/** <svg> inline con el patrón. Cada pieza lleva data-pieza para animarla con
 *  efecto('piezas', …). El SVG llena su contenedor (preserveAspectRatio slice). */
const patron = (tipo, opciones = {}) => {
  const gen = GEN[tipo];
  if (!gen) throw new Error(`kit.patron: tipo desconocido «${tipo}». Hay: ${Object.keys(GEN).join(', ')}`);
  const o = { ancho: 1080, alto: 1920, paleta: ['#FFFFFF'], semilla: 'patron', opacidad: 1, ...opciones };
  const r = prng(`${tipo}:${o.semilla}`);
  o.r = r;
  o.ruido = ruido2D(prng(`${tipo}:${o.semilla}:ruido`));
  const piezas = gen(o);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.ancho} ${o.alto}" preserveAspectRatio="xMidYMid slice" ` +
    `data-patron="${tipo}" data-semilla="${o.semilla}" aria-hidden="true" style="display:block;${o.estilo || ''}">${piezas.join('')}</svg>`;
};

/** El mismo patrón como capa de fondo para kit.fondo() (no se anima). */
const patronFondo = (tipo, opciones = {}) => {
  const svg = patron(tipo, opciones).replace(/ data-pieza/g, '').replace(/"/g, "'");
  return { imagen: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, tam: 'cover' };
};

module.exports = { patron, patronFondo, prng, semillaDe, ruido2D, encadenar };
