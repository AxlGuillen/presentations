// Escena de three.js de ejemplo (una estrella extruida con bisel que gira),
// como texto para incrustar en un <script>: la registra tres('estrella', …).
// La usan tools/pruebas/deck-three.cjs y la lámina «tres» de lab/.
module.exports = `tres('estrella', function (THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(canvas.width, canvas.height, false);
  const escena = new THREE.Scene(), camara = new THREE.PerspectiveCamera(30, canvas.width / canvas.height, 1, 100);
  const forma = new THREE.Shape();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.45 : 1.1, a = -Math.PI / 2 + i / 10 * Math.PI * 2; i ? forma.lineTo(Math.cos(a) * r, Math.sin(a) * r) : forma.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4 });
  geo.center();
  const estrella = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffd36b, metalness: 0.6, roughness: 0.3 }));
  escena.add(estrella, new THREE.AmbientLight(0xffffff, 0.5));
  const luz = new THREE.DirectionalLight(0xffffff, 2.2); luz.position.set(3, 4, 5); escena.add(luz);
  const luz2 = new THREE.DirectionalLight(0xff6a3d, 1.2); luz2.position.set(-4, -2, 3); escena.add(luz2);
  return function (t) {
    estrella.rotation.set(Math.sin(t * 0.9) * 0.35, t * 1.3, 0);
    camara.position.set(0, 0, 7 - Math.sin(t * 0.5) * 1.4); camara.lookAt(0, 0, 0);
    renderer.render(escena, camara);
  };
});
`;
