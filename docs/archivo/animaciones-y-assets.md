# Propuesta: animación y assets para la siguiente versión de los decks

> Estado: **implementado** el 14/oct/2026, el mismo día de la investigación
> (los cinco updates; lo de Riot quedó fuera por decisión de Axl). El catálogo
> vivo es el deck [`lab/`](../lab/) y lo que cambió respecto a la propuesta está
> en «Lo que cambió al implementarlo», al final. Todo lo que dice «probado» se
> corrió en este repo; lo demás sale de la documentación o la licencia de cada
> proyecto (fuentes al final).

## En corto: cinco updates, en orden de impacto

| # | Update | Qué cambia en pantalla | Costo |
|---|---|---|---|
| 1 | **GSAP 3.12.5 → 3.15 con todos los plugins** | Texto que entra por líneas y letras con máscara, trazos que se dibujan solos, formas que se transforman, contenedores que cambian de layout | Una sesión. **Probado**: funciona con `kit.animador()` sin tocarlo |
| 2 | **Catálogo de efectos en `kit.cjs` + un deck `lab/`** | Recetas con nombre para texto, imagen, contenedor y transición, en vez de reescribir la coreografía en cada `gen.js` | 1–2 sesiones |
| 3 | **`kit.patron()`: texturas generativas con semilla** | Confeti, puntos, curvas de nivel, cristales, medio tono, bordes a mano. Con la paleta del deck y sin licencias de terceros | Una sesión |
| 4 | **`kit.icono()` + ilustraciones SVG** | Íconos e ilustraciones limpias incrustados en build-time, para los decks profesionales y los reportes | Una sesión |
| 5 | **Transiciones `xfade` en `video.mjs`** | Cortes con transición entre láminas en los videos narrados | Media sesión. ffmpeg ya las trae |

> ⚠️ **Cumplelolero se queda como está acordado**: solo arte, nada de íconos ni
> ilustraciones dibujadas (ver `jinx/` y `samira/`). Para esa serie solo entra lo
> que mueve el arte: los updates 1, 2 y 3. Los íconos y las ilustraciones son para
> tabletas, estancia, los reportes, parches y datos curiosos.

---

## El filtro: lo que tiene que cumplir cualquier cosa nueva

| Regla del repo | Por qué | Qué deja fuera |
|---|---|---|
| **Vendorizado, cero CDN o npm en runtime** | Cada carpeta tiene que funcionar sola (CLAUDE.md) | Componentes de React, runtimes en la nube, Iconify cargado en el navegador |
| **Seekeable con `tl.time(t)`** | `cuadros.mjs` renderiza el video saltando a tiempos exactos | `@keyframes` y `transition` de CSS sueltos, la View Transitions API y Lottie en autoplay. **Todo movimiento pasa por la timeline de GSAP** |
| **Licencia apta para repo público y videos con anuncios** | El repo es público y los videos se publican | Lo que prohíbe redistribuir no puede ir como carpeta-biblioteca; lo que pide crédito va a un `CREDITOS.md`, como en caps |
| **Peso** | La primera lámina debe cargar rápido (`qa-peso`) | Motores de varios MB para un efecto que se hace con 5 KB |

---

## 1 · Motor de animación: GSAP 3.15

Hoy `tools/vendor/gsap.min.js` es la **3.12.5** y cada deck animado trae su copia.
Desde la 3.13 Webflow liberó **todos** los plugins que antes eran de pago, y la
versión vigente en npm es la **3.15.0**. La licencia «Standard no charge» permite
uso comercial. Lo único que prohíbe es meter GSAP en **herramientas visuales sin
código** que compitan con Webflow, y eso no nos aplica.

| Plugin | Qué resuelve aquí | Peso min (gzip) |
|---|---|---|
| **SplitText** | Texto por líneas, palabras o letras **con máscara**. Reemplaza los `data-linea` armados a mano en cada portada | 7,7 KB (3,6) |
| **DrawSVG** | Trazos que se dibujan. Reemplaza el `getTotalLength()` + `dasharray` a mano de missfortune, con su trampa de `preserveAspectRatio` | 4,4 KB (2,2) |
| **MorphSVG** | Una forma se convierte en otra: un blob en otro, un emblema en otro | 21 KB (9,5) |
| **Flip** | Contenedores que cambian de layout: una celda de la rejilla de skins crece hasta llenar la lámina, o un top 5 se reordena | 25,5 KB (9,7) |
| **ScrambleText** | Texto que se «decodifica»: el Riot ID del OTP, «HIERRO 1» | 11,7 KB (3,9) |
| **CustomEase / CustomWiggle** | Rebotes y temblores con firma propia, como un sello que golpea o la pantalla que tiembla | 7,1 + 2,3 KB |
| **MotionPath** | Objetos que siguen una curva: el cohete de Jinx, un proyectil | 22 KB (9,7) |
| **Physics2D** | Confeti y partículas con gravedad, deterministas | 2,2 KB (1,2) |

### Probado el 14/oct

Monté un deck mínimo con GSAP 3.15, SplitText, DrawSVG y un *stagger* que arranca
del centro, y lo pasé por `tools/qa-anim.mjs`:

- **Funciona con `kit.animador()` tal cual**, sin cambiarle una línea.
- **Es determinista a efectos de video.** Repetir el mismo seek da **75 dB de
  PSNR** entre corridas: 707 de 347 600 píxeles cambian 8 niveles o menos, puro
  antialiasing de las máscaras de línea. Como referencia, la 3.12.5 en xerath sale
  idéntica bit a bit. La diferencia no se ve.
- ⚠️ **Hallazgo: SplitText con `mask: 'lines'` corta las tildes de las
  mayúsculas** (Ñ, Á, É). La máscara mide la caja de la línea, y Bebas con
  `line-height: 0.9` deja los acentos fuera. **Arreglo probado**:

  ```js
  SplitText.create(el, { type: 'lines,chars', mask: 'lines', linesClass: 'linea' });
  // CSS: .linea-mask { padding-top: .18em; margin-top: -.18em; }
  tl.from(st.chars, { yPercent: 135, stagger: 0.03 });   // con 110 la tilde se asoma suelta antes que la letra
  ```

### Cómo migrar sin romper nada

- Los decks viejos **no se tocan**: cada carpeta trae su copia y sigue en 3.12.5.
- `tools/vendor/` pasa a 3.15 y suma los plugins.
- `kit.animador()` registra los plugins que encuentre cargados.
- Cada deck nuevo copia solo los plugins que use, igual que hoy copia `gsap.min.js`.

### Alternativas que revisé y descarto

| Opción | Por qué no |
|---|---|
| **anime.js v4** (MIT, 24,5 KB) | Trae trazos, morph y motion path, pero no trae separador de texto ni Flip. Y tener dos motores rompe el reloj único que necesita `cuadros.mjs` |
| **Motion** (motion.dev, MIT) | Se apoya en la Web Animations API y está pensado para React |
| **View Transitions API** (nativa) | Muy bonita para cambiar de lámina en el navegador, pero **no se puede seekear**, así que no saldría en el video |
| **Rive** (runtime MIT, ~5,6 MB con wasm) | Exige su editor y es demasiado para B-roll |
| **Theatre.js** | Editor visual de timelines; aquí las timelines se escriben en código y ya son seekeables |

---

## 2 · Catálogo de efectos (`kit.efectos`) y deck de laboratorio

Hoy cada `gen.js` reescribe su coreografía y los mismos gestos se repiten con
pequeñas variaciones. La propuesta es juntarlos en **recetas con nombre** dentro
de `kit.cjs`, para usarlas así: `animar('Portada', kit.efecto('lineas-mascara'))`.
Además, un deck **`lab/`** con una lámina por efecto, para escoger viéndolos:
«quiero el 3, el 7 y el 12».

### Texto

| Efecto | Cómo | Dónde encaja |
|---|---|---|
| Revelado por líneas con máscara | SplitText `lines` + el arreglo de tildes | Portadas y títulos de lore |
| Letras en ola desde el centro | SplitText `chars` + `stagger: { from: 'center' }` | Nombre del campeón |
| Decodificación | ScrambleText con glifos propios | Riot ID, rango, cifras |
| Máquina de escribir con cursor | TextPlugin | Citas textuales de la biografía |
| **Marcatextos que se dibuja** detrás de una palabra | Un `rect` con `scaleX` desde la izquierda, o DrawSVG con trazo de pincel | Generaliza el resaltado de parche2620 a cualquier deck |
| Tragamonedas de dígitos | Columnas de 0–9 que ruedan hasta la cifra | Alternativa a `cuentaMil` para cifras redondas |
| Barrido de brillo | `background-clip: text` + `background-position` tweenado | Un remate por deck, no más |

### Imagen

| Efecto | Cómo | Dónde encaja |
|---|---|---|
| Push-in con origen elegido | `scale` + `transformOrigin` en la cara | Ya existe en jinx; falta poder elegir el punto |
| Cortinillas con `clip-path` | `inset` (persiana), `circle` (iris desde un punto) o `polygon` diagonal (corte de espada). Todas se pueden tweenear y seekear | Entradas de splash |
| **Revelado a pincel** | `mask-image` con un SVG de trazo que se dibuja con DrawSVG | Arte de lore, cartas de LoR |
| Duotono animado | `feColorMatrix` con el color del deck, tweenado | Flashbacks, como el Xerath humano o Ivern el Cruel |
| Glitch | `feTurbulence` + `feDisplacementMap` con `scale` tweenado, o canales RGB desplazados con `mix-blend-mode: screen` | Corrupción: Xerath, el Vacío, Viktor |
| Parallax de capas | El render recortado de la wiki (`*_Render.png`) delante del splash borroso, moviéndose a otra velocidad | Portadas con profundidad |
| Rebanadas | El splash partido en N tiras que entran escalonadas | Revelado de skin |

### Contenedores

| Efecto | Cómo | Dónde encaja |
|---|---|---|
| Celda que crece a lámina | Flip | La skin elegida sale de la rejilla de 8 |
| Ranking que se reordena | Flip | Top 5 del OTP, comparativas |
| Borde que se dibuja antes que el contenido | DrawSVG sobre un `rect` redondeado | Marcos de recortes (parche), fichas |
| Tarjeta que voltea | `rotateY(180deg)` + `backface-visibility` | Antes y después, nerf contra buff |
| Bento que se arma desde el centro | Rejilla con `stagger: { grid: 'auto', from: 'center' }` | Ya probado en el laboratorio del 14/oct |
| Mazo que se reparte | Rotación + desplazamiento escalonados | Skins como cartas |

### Transiciones dentro del deck

La entrada de cada lámina vive en sus **primeros 0,3 s de timeline**: una cortina
del color del deck que se retira, o un iris. Así sale igual en el navegador y en el
video, sin tocar `deck-stage.js`.

---

## 3 · Transiciones en el video: `xfade` de ffmpeg

El ffmpeg instalado (8.1.2) trae **`xfade` con 58 transiciones**: `wipe*`,
`slide*`, `smooth*`, `circleopen`/`circleclose`, `radial`, `pixelize`,
`dissolve`, `diag*`, rebanadas (`hlslice`…), `zoomin`, `squeeze*`, más
`custom` con una expresión propia. Hoy `video.mjs` une los clips con cortes secos.

La propuesta: un campo `"transicion"` en `guion.json`, global o por lámina, de
0,25 a 0,4 s, y recorrer `tiempos.json` lo que dure el solape para que la voz no
se desfase.

```bash
ffmpeg -i a.mp4 -i b.mp4 -filter_complex \
  "[0][1]xfade=transition=smoothleft:duration=0.3:offset=4.7[v]" -map "[v]" out.mp4
```

Aplica a los videos que arma `video.mjs` (reportes narrados). En Cumplelolero el
montaje lo hace Axl en su editor, así que las transiciones ahí son suyas.

---

## 4 · Assets

### 4.1 Íconos

| Librería | Licencia | Cuántos | Estilo |
|---|---|---|---|
| **Tabler Icons** | MIT | 6 238 (5 184 de trazo + relleno) | Trazo de 2 px ajustable. La más completa |
| **Lucide** | ISC | ~1 890 | Trazo, muy consistente. La más sobria |
| **Phosphor** | MIT | ~1 500 × 6 pesos | De *thin* a *fill*, más un **duotono** que pega con paletas de dos colores |
| **game-icons.net** | **CC BY 3.0** | ~4 180 | Espadas, cráneos, pociones, monstruos. La única con temática de juego. **Obliga a dar crédito** («Icons made by Lorc, Delapouite… Available on https://game-icons.net») → `CREDITOS.md` |
| **3dicons** | CC0 | 200 íconos, ~1 400 renders | 3D. Para títulos de reportes |

**Cómo entrarían: `kit.icono('tabler:chart-bar', { color, tam })` en build-time.**
Lee el SVG de una caché en `tools/cache/`, que se baja una vez de
`api.iconify.design` (sirve todas estas colecciones con el mismo formato), y lo
incrusta inline con `currentColor`. No hay nada en runtime, y como son trazos se
pueden dibujar con DrawSVG.

### 4.2 Ilustraciones SVG limpias

| Fuente | Licencia | Notas |
|---|---|---|
| **unDraw** | Propia: uso comercial **sin atribución** | Se recolorean a un solo color, el del deck. ⚠️ Prohíbe redistribuirlas «en packs» y usarlas para entrenar IA: en el repo público solo van las que use un deck, nunca una carpeta-biblioteca |
| **Open Peeps** (y Open Doodles / Humaaans del mismo autor) | **CC0** | Personas armables, más de 584 000 combinaciones, estilo boceto a mano |
| **Storyset** (Freepik) | Gratis **con crédito obligatorio**, o pagando Flaticon Premium | Sin redistribución. Segunda opción |

Encajan en estancia, tabletas, los reportes y futuras propuestas a cliente. En los
decks de LoL no.

### 4.3 Fotos y video de stock

- **Unsplash**: comercial y sin atribución. Prohíbe venderlas sin modificarlas y
  compilarlas para replicar el servicio.
- **Pexels** (fotos y video): términos parecidos; confirmar al usar.
- **Wikimedia Commons / Openverse**: CC variadas, casi siempre con atribución. El
  patrón ya existe en `caps/CREDITOS.md`.
- El video de stock pesa demasiado para un deck; va mejor en el editor.

### 4.4 Texturas y patrones

Generadores revisados:

| Generador | Qué hace | Licencia |
|---|---|---|
| **fffuel** (~60 generadores) | Grano (`nnnoise`, `gggrain`), ondas (`sssurf`), blobs (`ssshape`), confeti (`bbburst`), patrones isométricos (`mmmotif`), garabatos (`ssscribble`)… | Comercial y sin atribución. ⚠️ No permite redistribuir las imágenes sueltas |
| **Hero Patterns** | Patrones SVG repetibles | CC BY 4.0 (con crédito) |
| **Haikei** | Blobs, olas, picos en capas | Gratis, pero **no encontré su licencia publicada** → no usar hasta verla |
| **Pattern Monster** | Patrones SVG | Sin licencia clara en el sitio → igual |

**Recomendación: generarlos nosotros en build-time con `kit.patron(tipo, opciones)`.**

- **Semilla = nombre del deck**, con un PRNG propio (mulberry32). Regenerar da
  exactamente el mismo SVG: diffs limpios y video determinista.
  `gsap.utils.random` no sirve aquí porque no admite semilla.
- **Sin licencias de terceros**: el resultado es nuestro.
- **Toma la paleta del deck** y sale como SVG inline ligero.
- **Cada pieza lleva un `data-*`** para poder escalonarla: el confeti puede caer
  con Physics2D.

| Tipo | Cómo | Librería (solo en Node, build-time) |
|---|---|---|
| Grano | Ya existe: `kit.grano` | — |
| Puntos dispersos sin encimarse | Muestreo de Poisson | Ninguna |
| Confeti y serpentinas | Formas al azar con la paleta | Ninguna. Para cierres de cumpleaños |
| Líneas de flujo / curvas de nivel | Ruido simplex + isolíneas | `simplex-noise` (MIT, 18 KB) + `d3-contour` (ISC) |
| Cristales / Voronoi | Teselado | `d3-delaunay` (ISC). Freljord, Shurima facetado |
| Medio tono (halftone) | Rejilla de puntos de radio variable | Ninguna. Cómic, Zaun |
| **Bordes y subrayados a mano** | Trazo irregular tipo plumón | `roughjs` (MIT, 28 KB). Anotaciones sobre los recortes de los parches |

---

## 5 · Opcional: Lottie para stickers animados

- **`lottie_light`**: 168 KB. Las animaciones gratis de LottieFiles usan la
  **Lottie Simple License**: uso comercial sin atribución, y los derivados quedan
  bajo la misma licencia.
- **Se puede seekear** si se ata su cuadro a la timeline:
  `tl.to(estado, { frame: 60, onUpdate: () => anim.goToAndStop(estado.frame, true) })`.
- **Uso**: fuego, explosión o *check* en reportes y datos curiosos. En Cumplelolero no.

---

## 6 · Riesgos y licencias (incluye la política de Riot, que seguía pendiente)

**Riot, «Legal Jibber Jabber»** (riotgames.com/legal, actualizada por última vez
en agosto de 2018):

- **Permite** ingresos pasivos por anuncios en videos y streams a jugadores
  individuales. **Prohíbe** poner el contenido tras un muro de pago (Patreon,
  YouTube Premium…) sin licencia escrita.
- **Exige un aviso visible** en lo que se comparte:
  > [Título del proyecto] was created under Riot Games' "Legal Jibber Jabber"
  > policy using assets owned by Riot Games. Riot Games does not endorse or
  > sponsor this project.

  → Propuesta: ponerlo en el pie de la galería y en la descripción de los videos.
- ⚠️ **Sin licencia escrita no se pueden usar logos ni marcas de Riot.** Los
  carteles de Arcane de `jinx/` traen el logo **ARCANE** (y el de Netflix): vale
  la pena recortarlos o taparlos.
- **TikTok Creator Rewards** no aparece por nombre. Lo más cercano es «anuncios»:
  zona gris, decisión de Axl.

**Otras fuentes:**

- game-icons.net y Hero Patterns (CC BY) → `CREDITOS.md`.
- unDraw, fffuel y Storyset → **nunca como packs** en el repo público.

---

## 7 · Plan por fases

| Fase | Entrega | Hecho cuando |
|---|---|---|
| **F1 · Motor** | GSAP 3.15 + plugins en `tools/vendor/`, `kit.animador()` los registra, arreglo de tildes documentado en CLAUDE.md | Un deck nuevo los usa y `qa-anim` da el mismo cuadro en dos corridas |
| **F2 · Laboratorio** | `kit.efecto()` con las recetas de §2 y el deck `lab/` | Axl escoge los efectos que se quedan |
| **F3 · Patrones** | `kit.patron()` con confeti, puntos, curvas de nivel y medio tono | Mismo SVG en dos regeneraciones; `qa-peso` no sube más de 30 KB por lámina |
| **F4 · Íconos e ilustraciones** | `kit.icono()` con caché + `CREDITOS.md` si entra game-icons | Un reporte semanal los usa |
| **F5 · Video** | `"transicion"` en `guion.json` → `xfade` en `video.mjs` | Un video narrado sale con transiciones y la voz en sincronía |
| **F6 · Lottie** (opcional) | Atado a la timeline | Se ve igual en el navegador y en `cuadros.mjs` |

---

## Lo que cambió al implementarlo

| Propuesto | Hecho | Por qué |
|---|---|---|
| `kit.efecto()` | `kit.efectos()` emite el catálogo en el navegador: `efecto(nombre, tl, el, o)` y `data-efecto="…"` en el HTML | Declarar en el HTML deja casi todas las láminas sin coreografía escrita; el animador aplica las recetas por defecto |
| Flip para `crece` y `reordena` | FLIP a mano con `offsetLeft`/`offsetTop` | Flip no ve la escala que deck-stage aplica dentro de su shadow DOM: a mitad de animación la pieza salía desplazada |
| ScrambleText para decodificar | Receta propia `revuelto`, con glifos sacados de un hash | ScrambleText sortea con `Math.random`: dos renders del video no saldrían iguales |
| Physics2D para el confeti | `piezas` con `data-modo="cae"` y PRNG con semilla | Una caída con física no tiene estado final; el confeti tiene que aterrizar en su patrón |
| `simplex-noise`, `d3-contour`, `d3-delaunay`, `roughjs` | Nada de eso: ruido simplex, Poisson, marching squares y trazo a mano propios en `kit-patrones.cjs` | Son unas 300 líneas y así no hay dependencias, ni ESM contra CommonJS en el kit |
| unDraw y Open Peeps | Open Doodles (CC0) bajadas y recoloreables; unDraw solo por ruta, bajado a mano | La licencia de unDraw prohíbe la descarga automatizada; las Open Doodles están empaquetadas en react-open-doodles (MIT) |
| Íconos «desde una caché» | `tools/iconos.mjs` + `tools/cache/iconos/` commiteada, con la licencia de cada colección | `kit.icono()` avisa cuando la colección pide crédito (game-icons) |
| Lottie (opcional) | No se hizo | Era la fase 6 opcional; nada del catálogo lo necesitó |

Además salió un bug ajeno al kit: en Windows con Node 24, `process.exit()` justo
después de un `fetch` revienta libuv. Los descargadores usan `process.exitCode`.

## Fuentes

- GSAP: [licencia estándar](https://gsap.com/standard-license), [3.13 (plugins gratis)](https://gsap.com/blog/3-13/), [3.15](https://gsap.com/blog/3-15/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText). Versiones, licencias y pesos: registro de npm y unpkg (14/oct/2026).
- [anime.js](https://animejs.com/), [Lucide](https://lucide.dev/), [Tabler Icons](https://tabler.io/icons), [game-icons.net](https://game-icons.net/about.html), [3dicons](https://3dicons.co/)
- [Licencia de unDraw](https://undraw.co/license), [Open Peeps](https://www.openpeeps.com/), [Términos de Storyset](https://www.storyset.com/terms), [Licencia de Unsplash](https://unsplash.com/license)
- [fffuel](https://www.fffuel.co/) y [su licencia](https://www.fffuel.co/license/), [Hero Patterns](https://heropatterns.com/)
- [Lottie Simple License](https://lottiefiles.com/page/license)
- [Riot Games — Legal (Legal Jibber Jabber)](https://www.riotgames.com/en/legal)
- `ffmpeg -h filter=xfade` en la máquina local (ffmpeg 8.1.2)
