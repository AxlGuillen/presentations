// kit.ritmo: los tiempos de una canción, relativos al arranque de una lámina.
//
// Lee el beatmap.json que produce ReelForge (aquí no se analiza música):
//   { bpm, beats: [s…], downbeats: [s…], drop, buildups: [s…],
//     sections: [{ type, start, end, energy }], words: [{ text, start, end }] }
// `desde` es el segundo de la canción en que empieza la lámina en el reel, y
// todo lo que devuelve está en segundos desde ahí: es lo que va en data-en o
// como posición de la timeline dentro de animar().
//
//   const r = kit.ritmo(require('./beatmap.json'), { desde: 12.4 });
//   r.b(0)         el primer beat que cae en la lámina (b(-1) es el de antes)
//   r.b(2.5)       a la mitad entre el beat 2 y el 3
//   r.compas(1)    el primer tiempo del segundo compás de la lámina
//   r.drop         el drop (null si la canción no tiene)
//   r.palabra('survive')     la primera vez que se canta, desde `desde`
//   r.palabra('survive', 2)  la segunda
//   r.seccion('chorus')      { inicio, fin, energia } de la primera que empieza en la lámina
//   r.beats(0, 8)  los segundos de b(0) a b(7), para un stagger que golpea en cada beat
//
// Los índices empiezan en 0 y cuentan desde la lámina, no desde la canción.

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}']+/gu, '');

function ritmo(mapa, { desde = 0 } = {}) {
  if (!mapa || !Array.isArray(mapa.beats) || mapa.beats.length < 2) throw new Error('kit.ritmo: el beatmap no trae «beats» (hacen falta al menos dos)');
  const beats = mapa.beats.slice().sort((a, b) => a - b);
  const fin = Math.max(beats.at(-1), ...(mapa.sections || []).map((s) => s.end || 0));
  if (!(desde >= 0 && desde <= fin)) throw new Error(`kit.ritmo: desde=${desde} s cae fuera de la canción (va de 0 a ${fin.toFixed(2)} s)`);
  const r3 = (x) => Math.round(x * 1000) / 1000;

  // Índice del primer elemento ≥ desde (con un margen de un milisegundo, para
  // que un beat que cae justo en `desde` sea el 0).
  const primero = (xs) => { const i = xs.findIndex((x) => x >= desde - 1e-3); return i < 0 ? xs.length : i; };
  // Valor en un índice fraccionario; fuera de la lista se extrapola con el
  // paso de los extremos, que es lo que haría el pulso si siguiera.
  const en = (xs, k, nombre) => {
    if (!Number.isFinite(k)) throw new Error(`kit.ritmo: ${nombre}(${k}) necesita un número`);
    const i = Math.floor(k), f = k - i;
    const val = (j) => {
      if (j < 0) return xs[0] - (xs[1] - xs[0]) * -j;
      if (j >= xs.length) return xs.at(-1) + (xs.at(-1) - xs.at(-2)) * (j - xs.length + 1);
      return xs[j];
    };
    const t = val(i) + (f ? (val(i + 1) - val(i)) * f : 0);
    if (t > fin + 1e-6) throw new Error(`kit.ritmo: ${nombre}(${k}) cae en ${t.toFixed(2)} s, después del final de la canción (${fin.toFixed(2)} s)`);
    return r3(t - desde);
  };
  const i0 = primero(beats);
  const down = (mapa.downbeats && mapa.downbeats.length >= 2) ? mapa.downbeats.slice().sort((a, b) => a - b) : beats.filter((_, i) => i % 4 === 0);
  const d0 = primero(down);
  const palabras = (mapa.words || []).map((w) => ({ ...w, n: norm(w.text) }));

  return {
    desde,
    bpm: mapa.bpm || r3(60 / ((beats.at(-1) - beats[0]) / (beats.length - 1))),
    b: (k) => en(beats, i0 + k, 'b'),
    compas: (k) => en(down, d0 + k, 'compas'),
    beats: (a, n) => Array.from({ length: n }, (_, j) => en(beats, i0 + a + j, 'beats')),
    drop: mapa.drop == null ? null : r3(mapa.drop - desde),
    palabra(texto, vez = 1) {
      const buscada = norm(texto);
      const halladas = palabras.filter((w) => w.n === buscada && w.start >= desde - 1e-3);
      if (halladas.length < vez) {
        const antes = palabras.some((w) => w.n === buscada);
        throw new Error(`kit.ritmo: «${texto}» ${antes ? `no se canta ${vez === 1 ? 'después' : `${vez} veces después`} de desde=${desde} s` : 'no está en la letra del beatmap'}`);
      }
      return r3(halladas[vez - 1].start - desde);
    },
    seccion(tipo) {
      const s = (mapa.sections || []).find((x) => x.type === tipo && x.start >= desde - 1e-3);
      if (!s) throw new Error(`kit.ritmo: no hay sección «${tipo}» que empiece después de desde=${desde} s`);
      return { inicio: r3(s.start - desde), fin: r3(s.end - desde), energia: s.energy };
    },
  };
}

module.exports = { ritmo };
