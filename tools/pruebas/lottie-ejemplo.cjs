// Animación de Lottie hecha a mano (sin assets de terceros): una estrella que
// crece y gira, un círculo que recorre el cuadro y un anillo que se traza.
// La usan tools/pruebas/deck-lottie.cjs y la lámina «lottie» de lab/.
// ── La animación (formato Lottie/Bodymovin), 1080×1080 a 30 fps, 300 cuadros ──
const k = (t, s, ease = true) => ({ t, s, ...(ease ? { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } } : {}) });
const tr = { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } };
const capa = (ind, nm, ks, shapes) => ({ ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: 300, st: 0, bm: 0,
  ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [540, 540, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }, ...ks }, shapes });
const color = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).concat(1);
const estrella = Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 90 : 220, a = -Math.PI / 2 + (i / 10) * Math.PI * 2; return [Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r)]; });
module.exports = {
  v: '5.7.0', fr: 30, ip: 0, op: 300, w: 1080, h: 1080, nm: 'prueba', ddd: 0, assets: [],
  layers: [
    capa(1, 'estrella', { r: { a: 1, k: [k(0, [0]), k(300, [720], false)] }, s: { a: 1, k: [k(0, [20, 20, 100]), k(60, [110, 110, 100]), k(150, [80, 80, 100]), k(300, [100, 100, 100], false)] } },
      [{ ty: 'gr', it: [{ ty: 'sh', ks: { a: 0, k: { c: true, v: estrella, i: estrella.map(() => [0, 0]), o: estrella.map(() => [0, 0]) } } },
        { ty: 'fl', c: { a: 0, k: color('#FFD36B') }, o: { a: 0, k: 100 } }, tr] }]),
    capa(2, 'circulo', { p: { a: 1, k: [k(0, [160, 900, 0]), k(100, [920, 880, 0]), k(200, [540, 200, 0]), k(300, [160, 900, 0], false)] } },
      [{ ty: 'gr', it: [{ ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [150, 150] } }, { ty: 'fl', c: { a: 0, k: color('#FF6A3D') }, o: { a: 0, k: 100 } }, tr] }]),
    capa(3, 'trazo', {},
      [{ ty: 'gr', it: [{ ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [860, 860] } },
        { ty: 'st', c: { a: 0, k: color('#7C5CFF') }, o: { a: 0, k: 100 }, w: { a: 0, k: 18 }, lc: 2, lj: 2 },
        { ty: 'tm', s: { a: 0, k: 0 }, e: { a: 1, k: [k(0, [0]), k(240, [100]), k(300, [100], false)] }, o: { a: 1, k: [k(0, [0]), k(300, [180], false)] }, m: 1 }, tr] }]),
  ],
};
