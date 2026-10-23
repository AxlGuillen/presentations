# Propuesta: segunda tanda de efectos (SVG, filtros, datos, partículas)

> Estado: **los 8 recomendados están implementados** (15/oct/2026, ver «Lo que
> cambió al implementarlo» al final), y **chispas y destello** entraron el
> 22/oct/2026 con el kit de edit (sin Physics2D: las chispas son una fórmula
> cerrada con roce y gravedad), y **golpe, dona, radar, pixelado y derrumbe**
> el mismo día con la fase de acabado. Los otros 10 siguen en propuesta.
> Investigación del 15/oct/2026, sobre
> el catálogo que ya existe en `tools/kit-efectos.cjs` (las 27 recetas del deck
> `lab/`). Los efectos marcados «probado» se armaron como prototipo en Chrome
> 155 a 1080×1920 y escala 1, igual que `cuadros.mjs`, sin tocar el repo.

## Lo que dicen las pruebas

- **Determinismo**: en los 15 prototipos medidos, volver al mismo tiempo de la
  timeline da el mismo PNG byte por byte.
- **Rendimiento**: los filtros SVG cuestan como mucho ~2 ms de GPU por cuadro
  en la RTX 5070, y a escala 2 no se encarecen. En el render del video no
  estorban: lo caro es capturar cada cuadro (~100 ms).
- **Filtros y máscaras sobre `<img>` normal**: `filter: url(#id)` y
  `mask: url(#id)` funcionan sobre un `<img>` HTML, incluso con una máscara
  hecha de ruido filtrado. Eso importa: así la imagen sigue pasando por
  `kit.diferir` y `optimizar-imagenes` (ver «Riesgos»).

★ = los 8 recomendados para implementar primero.

## Filtros SVG

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **quemado** ★ (probado) | La imagen se deshace o aparece a manchas, con un borde de brasa | `feTurbulence` con `seed` fijo → umbral en `feColorMatrix`/`feComponentTransfer` que GSAP mueve dentro de `values`; un segundo umbral un poco más alto deja la franja que se pinta del color de brasa, con un brillo suave | Skin vieja → rework, guerras/helia, el Vacío |
| **tinta** ★ (probado como máscara) | Una mancha orgánica destapa el arte | `mask: url(#m)` sobre el `<img>`, con ruido + degradado radial; falta probar el crecimiento desde un punto | Entrada de cartas de LoR |
| **pixelado** (probado) | El arte pasa de bloques grandes a nítido, a escalones | El truco de muestrear un píxel por celda y engordarlo (`feFlood`/`feComposite`/`feMorphology`), con ease por escalones | «Adivina la skin», parches |
| **aberración** | Pulso de canales RGB separados | Cada canal aislado con `feColorMatrix`, desplazado con `feOffset` y vuelto a sumar | Zaun/Arcane, impactos |
| **especular** (probado) | Brillo metálico con relieve que barre un título | `feSpecularLighting` con una luz puntual que GSAP mueve de lado a lado | Rangos, trofeos |
| **neón** (probado) | Contorno que crece alrededor de las letras | `feMorphology` engorda la letra y se le resta el original; parpadeo con desenfoque y ease por escalones | Reportes, KPIs |
| **foco** (probado) | Una capa se desenfoca mientras la otra se aclara | `filter: blur()` animado por GSAP (seekeable) | B-roll |

## Trazos y formas

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **contorno** ★ (prototipo) | El arte aparece como dibujo de líneas sacado de sí mismo y luego entra a color | Build-time: Pillow reduce y suaviza la imagen y el marching squares de `kit-patrones.cjs` saca las curvas (con la portada de Jinx: 40 trazos, 9 KB comprimido, y se reconoce la cara). Runtime: `dibujo` + fundido a la imagen | Cumplelolero: las líneas salen del propio arte, cumple «solo arte» |
| **cometa** ★ | Un trazo que se dibuja con un punto brillante en la punta | DrawSVG y MotionPath sobre el mismo camino, con la misma duración y ease | Rutas, mapas, gráficas |
| **silueta** | Un emblema se convierte en otro (Hierro → Oro) | Contorno del canal alfa del PNG en build-time → MorphSVG → fundido al PNG real | Historial de rangos del OTP |
| **sello** ★ | Un sello cae y golpea; la lámina tiembla | Escala de 2,4 a 1 con CustomEase de rebote, bordes de tinta con desplazamiento fijo, temblor con CustomWiggle (cualquier tipo **menos** `random`) | «HECHO», «NERF», «sin registro» |
| **destello** | Rayos alrededor de un centro y un brillo de cuatro puntas | Rayos con semilla en build-time; solo rotación, escala y opacidad | Legendarias, récords |

## Texto con SVG

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **ventana** ★ (probado) | Un nombre gigante es la ventana al arte; la cámara entra por una letra hasta la imagen completa | Mejor con `background-clip: text` que con `clipPath`, para que el arte siga siendo `data-bg` | Portada de Cumplelolero (el nombre es el dato) |
| **órbita** (probado) | Texto que gira sobre un círculo o una ruta | `<textPath>` y GSAP en `startOffset` de 0 % a 100 % (~2 ms de CPU por cuadro). Las letras fuera del camino no se pintan: es la especificación | Charlas, etiquetas de ruta |
| **rotulado** | Primero el contorno de la letra, luego el relleno | `stroke-dasharray` directo sobre `<text>`, sin pasar la fuente a trazos | Títulos de reportes |

## Máscaras y cámara

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **cámara** ★ | Paneo y zoom entre varios puntos del arte (cara → arma → fondo) | Fotogramas clave de `scale`/`x`/`y` desde un `data-focos`; distinto de `empuje`, que va a un solo punto. Variante **lupa**: círculo recortado sobre una copia ampliada | Cumplelolero, parches (zoom al valor) |
| **mosaico** | Las piezas de `kit.patron('facetas')` como máscara, en orden con semilla | Máscara SVG + `piezas` | Transiciones |

## Transiciones y datos

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **cortina líquida** (probado) | Gotas que crecen, se funden y se retiran | Efecto *gooey*: `feGaussianBlur` + contraste del alfa en `feColorMatrix` | Reportes, charlas |
| **línea** ★ | Gráfica de línea que se dibuja con el área destapándose, un punto en la punta y un contador | Camino generado en build-time con viewBox en píxeles reales (como missfortune) | Horas por día, elo del OTP |
| **dona** | Segmentos que se dibujan uno tras otro | Rangos de DrawSVG (`"a% a%"` → `"a% b%"`); generaliza lo hecho a mano en semana35 | Reportes |
| **radar** | El polígono de estadísticas cambia de antes a después | GSAP interpola los números de `points` | Parches |

## Partículas y tipografía cinética

| Efecto | Qué se ve | Cómo | Dónde |
|---|---|---|---|
| **chispas** | Estallido de partículas que se apagan | Physics2D con velocidad y ángulo de la semilla. Sin fricción es fórmula cerrada; con fricción, al saltar atrás recalcula desde el inicio: también determinista. Terminan invisibles, no necesitan estado final | Con el sello, récords |
| **ensamble** | Cientos de puntos vuelan a formar un emblema o una cifra y se funden con la imagen real | Puntos muestreados en build-time | Remates |
| **derrumbe** | Salida: las letras caen con gravedad y giro con semilla | El catálogo hoy solo tiene entradas | Cierres |
| **golpe** | Palabra por palabra al ritmo de la voz | Los tiempos por palabra que ya da Fish Audio en `video.mjs` | Remates en charlas y reportes |

## Riesgos generales

- **Las imágenes no van dentro de `<svg><image>`.** `kit.diferir` solo reescribe
  `src=` y `optimizar-imagenes` solo mide `<img>` y fondos: una imagen dentro de
  un SVG se baja al entrar y nadie la optimiza. **`kit.pincel` ya tiene ese
  hueco**; los efectos nuevos deben aplicar filtro o máscara al `<img>` HTML.
- **Más fuentes de `Math.random` en GSAP** además de ScrambleText:
  `stagger: { from: 'random' }`, las cadenas `"random(…)"`,
  `gsap.utils.random`/`shuffle`, CustomWiggle `type: 'random'` y RoughEase
  (aleatorio por defecto; necesita `randomize: false`). Todo `onUpdate` debe
  depender solo del estado del tween, como `revuelto`.
- **Calibrar el umbral del ruido**: el `fractalNoise` se concentra cerca de 0,5;
  en el primer intento del «quemado», a mitad de animación ya no quedaba imagen.
- **Fuera de esta máquina**: con GPU integrada, o si Chrome se queda sin GPU
  (escritorio remoto, lista de bloqueo), los filtros pasan al procesador y
  pueden costar ~10 veces más; según Chromium, los filtros sobre SVG van siempre
  por procesador. Contención: `numOctaves` ≤ 4, región del filtro ajustada y no
  más de dos capas a sangre filtradas a la vez.

## Lo que cambió al implementarlo

Los 8 ★ son recetas de `kit.efectos()` con su pieza de build-time en
`tools/kit-efectos.cjs`, y tienen lámina en `lab/` (40–47) y en `novedades/`.

- **contorno**: no se hizo con Pillow sino con Chrome (`tools/contorno.mjs`),
  que ya es dependencia de las herramientas y decodifica cualquier JPEG/PNG; la
  luminancia se guarda en `tools/cache/contornos/`. Con la portada de Jinx los
  40 trazos del prototipo no alcanzaban: con 7 niveles a 220 de detalle salen
  ~150 y se reconoce, a 60–90 KB inline (~37 KB comprimido).
- **ventana**: va con `mask: url(#…)` sobre el `<img>`, no con
  `background-clip: text`. Así el arte sigue siendo un `<img>` (diferido y
  optimizado) y la cámara puede entrar escalando solo el texto de la máscara.
- **sello**: sin CustomEase ni CustomWiggle. La caída es `power4.in` y el
  temblor una secuencia fija de cinco fotogramas que se apaga; los huecos de
  tinta y el borde irregular salen de dos `feTurbulence` con semilla.
- **cometa** y **línea**: sin MotionPath ni DrawSVG para la punta; se coloca con
  `getPointAtLength()` en el `onUpdate`, que solo depende del progreso.
- **quemado**: el umbral útil va de 4 a 36 y la franja de brasa es el segundo
  umbral a +0,9 (con +1,4 la brasa tapaba media imagen).
- **Determinismo**: ir a 1,1 s, saltar a 2,6 s y volver da el mismo cuadro en
  las 8 (69–104 dB dentro de la lámina).

## Fuentes

- [Codrops, efectos gooey](https://tympanus.net/codrops/2015/03/10/creative-gooey-effects/) y [CSS-Tricks, gooey de Bebber](https://css-tricks.com/?p=195076)
- [Codrops, distorsión de imagen con filtros SVG](https://tympanus.net/codrops/2019/03/12/image-distortion-effects-with-svg-filters)
- [Soueidan, contorno con feMorphology](https://tympanus.net/codrops/?p=37424) y [su serie de filtros SVG](https://sarasoueidan.com/blog/svg-filters-series/)
- [Codrops, transiciones con máscara SVG (2026)](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/)
- [Codrops, texto con clip-path (2024)](https://tympanus.net/codrops/2024/01/10/experimental-on-scroll-text-animations-with-svg-clip-path)
- [Codrops, mapas SVG (2026)](https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap)
- [GSAP DrawSVG](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/), [GSAP MorphSVG](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin)
- [MDN, startOffset](https://developer.mozilla.org/en-US/docs/Web/API/SVGTextPathElement/startOffset)
- [Chromium, filter effects](https://www.chromium.org/developers/design-documents/image-filters/)
