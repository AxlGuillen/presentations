# Mejoras propuestas (22/oct/2026)

Documento para retomar el trabajo desde una sesión nueva, sin más contexto que este archivo y el repo. Junta tres fuentes:

- Lo que quedó abierto en los documentos de `docs/`.
- Las deudas que se encontraron al revisar el repo.
- Lo que salió de la investigación del 22/oct/2026 sobre las tres herramientas de video: este repo, walkthrough y ReelForge.

**El orden de ejecución, las fases, las ramas y las verificaciones están en `docs/plan-mejoras-oct-2026.md`.** Aquí está el diseño de cada mejora; si los dos documentos no coinciden en el orden, manda el plan.

Cada mejora dice:

- Por qué importa.
- Dónde vive hoy en el código.
- Cómo hacerla.
- Cómo probarla.
- Cuándo está terminada.

**Punto de partida:** `main` en `cb2a259` (20/oct/2026). Las últimas entregas son `parche2621`, `semana42`, `lux`, `graves` y `suiza`. De esas, **`parche2621`, `lux` y `graves`** usan el montaje automático con `tools/laminas.mjs` (llevan `data-lamina`); `suiza` recorta sus flyers con `cuadros.mjs` sin pasar por `laminas.mjs`, y `semana42` es un reporte semanal, fuera del montaje.

## Cómo arrancar una sesión con este archivo

Pega esto al inicio de la sesión, cambiando el número de la mejora:

> Lee `CLAUDE.md` y `docs/mejoras-oct-2026.md`. Vamos a hacer la mejora **P1**. Antes de escribir código, confirma con `git log -5` que el repo sigue donde dice el documento. Revisa también los archivos que nombra la mejora; si algo cambió, dímelo antes de seguir. Sigue sus pasos en orden y verifica con las herramientas de `tools/` (`qa-deck`, `qa-anim`, `cuadros`) antes de cada commit.

## Reglas que no cambian

Resumen de lo que `CLAUDE.md` ya exige y que todas las mejoras respetan:

- **El repo es público.**
  - Nada de llaves ni datos privados.
  - Solo material de licencia clara (CC0, dominio público o propio) dentro del repo.
  - Lo que no se puede redistribuir (música con licencia de uso, arte de terceros sin permiso) vive fuera del repo o se genera.
- **Los decks no tienen build ni dependencias en runtime.** La sofisticación entra por `tools/kit*.cjs` en build-time o por librerías vendorizadas por carpeta, nunca por CDN.
- **Lo generado no se edita a mano.** Se cambia el `gen.js` y se regenera.
- **Determinismo:**
  - Las timelines se buscan con `tl.time(t)`.
  - Nada de `Math.random` ni de las fuentes de azar de GSAP (lista en `docs/efectos-svg.md`, «Riesgos generales»).
  - Lo que una receta cambia del DOM se registra en `section.__deshacer`.
- **Estados iniciales con `tl.from()`,** nunca escondiendo en CSS.
- **Rutas relativas dentro de cada deck** y `deck-stage.js` copiado tal cual en cada carpeta.
- **walkthrough y ReelForge no comparten código con este repo.** Lo que se comparte son **contratos de archivo** (un JSON con forma fija) que cada repo implementa por su lado. Las soluciones de walkthrough se leen y se reescriben aquí.

## Orden recomendado

| # | Mejora | Tamaño | Por qué en este orden |
|---|---|---|---|
| **P1** | `--alfa` en `cuadros.mjs` y `laminas.mjs`, con un manifest más completo | Mediana | Quita el «destello negro» y el rectángulo opaco del montaje; habilita P4 |
| **P2** | Música con ducking y efectos de sonido en `video.mjs` | Mediana | Los decks narrados suenan planos; es lo que más efecto da por esfuerzo |
| **P3** | Animación al ritmo: leer `beatmap.json` en el `gen.js` | Chica | Láminas que golpean en el beat de la canción del reel |
| **P4** | Kit de edit: recetas para capas de edits (partículas, palabra gigante, letrero de kill, multikill) | Grande, por receta | Todo el acabado gráfico de los edits sale de aquí |
| **P5** | Efectos de la segunda tanda que faltan (17 de 25) | Por efecto | Ya están diseñados y probados en prototipo |
| **P6** | Dibujo a líneas: objetos que giran entre láminas | Mediana | Lo único pendiente de `docs/lineas-y-continuidad.md` |
| **P7** | Tokens de easing y desenfoque de movimiento en `cuadros.mjs` | Mediana | Que se vea menos «hecho con código» |
| **P8** | Herramientas en Linux y pruebas mínimas del kit | Chica | Hoy no corren en una sesión en la nube y el kit no tiene pruebas |
| **P9** | Deudas de documentación | Chica | Una tabla rota en `CLAUDE.md` y datos viejos |
| **P10** | Estándares de salida (loudness, zonas seguras, fps) | Chica | Los tres repos usan valores distintos |
| **P11** | Lottie y Three.js como recetas | Grande, con riesgo | Después de lo demás, con una prueba primero |

---

## P1 · Capas con transparencia para el montaje

### Problema

Las láminas del montaje automático (`lux`, `graves`, `parche2621` y los flyers de `suiza`) salen de `tools/laminas.mjs` como **mp4 opacos** recortados al panel de 1080×1370.

- **Sobre el gameplay, cada lámina es un rectángulo.** Hoy se disimula con el modo «franja» del montaje: la capa centrada sobre una copia suya difuminada.
- **El primer cuadro tiene que estar lleno.** La regla de lux («ningún clip arranca en negro») existe porque el fondo opaco entraba como destello.

Lo pidió el 18/oct la nota del PKB `redes-sociales/creador-de-contenido-axelsine/montaje-automatico-con-animaciones-html.md`, en su «Prompt para el chat de presentaciones».

### Dónde vive hoy

- **`tools/cuadros.mjs`:**
  - Chrome sin cabeza.
  - `Page.captureScreenshot({ format: 'png', optimizeForSpeed: true })` por cuadro.
  - Los cuadros van por tubería a `ffmpeg -f image2pipe … -c:v libx264 -pix_fmt yuv420p`.
- **`tools/laminas.mjs`:**
  - Corta `anim-NN.mp4` con `crop=1080:1370:0:275` y `tpad` para el cuadro quieto.
  - Escribe `manifest.json` como `[{ id, archivo, png, dur_anim, dur }]`.
- **`deck-stage.js`:** su shadow DOM pinta fondos negros (`:host { background: #000 }` y el contenedor del escenario). Esos fondos también hay que vaciar.

### Diseño

**1. `cuadros.mjs --alfa`.**

- Antes del primer cuadro, en cada trabajador:
  - `cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })`.
  - Un `<style>` en el documento: `html, body, deck-stage, section { background: transparent !important }`.
  - Otro `<style>` dentro de `ds.shadowRoot` que vacíe los fondos de `:host` y del escenario. **Una hoja de afuera no entra al shadow DOM**, salvo la regla sobre el propio host.
- **Qué se apaga en modo alfa:**
  - Los fondos de la lámina (copias desenfocadas, rayos, lavados, puntitos) llevan un atributo nuevo, `data-fondo`, y en modo alfa van con `display: none`.
  - Es una marca que pone el `gen.js`, no una heurística.
  - Sin la marca, la lámina sale tal cual: solo se vacían los fondos de página.
- **Encoder:** ProRes 4444 en `.mov`:

  ```
  -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -vendor apl0
  ```

  Es el formato que ReelForge ya lee y el que pedía el diseño del montaje.
  - **Opción `--alfa=webm`:** `-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30`, más liviano y más lento de codificar.
  - **No usar `qtrle`:** es lo que usa walkthrough internamente para sus overlays, pero pesa mucho para pasarse entre herramientas.
- **Verificar que `optimizeForSpeed` conserva el alfa del PNG.** Si no, quitarlo solo en modo alfa: cuesta ~150 ms más por cuadro.

**2. `laminas.mjs --alfa`.**

- Pide `cuadros.mjs --alfa` y corta igual (`crop` + `tpad`), pero:
  - Escribe `<id>.mov` con el mismo codec, sin pasar por `yuv420p`.
  - Guarda el PNG final con alfa.
- **El manifest crece sin romper lo que ya lee ReelForge.** ReelForge lee la lista o `{laminas | flyers}`, y de cada entrada `id` y `archivo`:

  ```json
  [{
    "id": "p-kda", "archivo": "p-kda.mov", "png": "p-kda.png",
    "dur_anim": 2.4, "dur": 3.4, "alfa": true,
    "caja": { "width": 1080, "x": "center", "bottom": 275 },
    "palabras": ["k/da"]
  }]
  ```

  - **`caja`** usa las claves de la caja del montaje de ReelForge (`width`, `x`, `bottom`; o `mode: "band"` con `y` y `height`). Así ReelForge puede tomarla como caja por omisión de esa capa. Hoy no la lee: ver «Del lado de ReelForge».
  - **`palabras`** son las palabras del guion que disparan la lámina. Salen de un `data-palabras="k/da"` opcional en la `<section>`.

**3. El primer cuadro.** Con alfa, el cuadro 0 puede estar vacío: lo que entra es el primer plano y el gameplay se ve detrás. La regla de lux («los fondos se ven desde el cuadro 0») sigue valiendo para el modo opaco.

### Del lado de ReelForge (otro repo)

- Su montaje ya acepta `.mov` con alfa.
- **Leer `caja` del manifest** como caja por omisión de cada capa sería un cambio chico allá. No es parte de esta mejora.

### Pruebas

- `ffprobe` del `.mov` da `yuva444p10le` (o `yuva420p` en webm).
- **Una esquina sin contenido es transparente:**
  - Se extrae un cuadro con `-pix_fmt rgba` y se lee el canal alfa.
  - Un elemento de primer plano es opaco.
- **`qa-anim` en modo alfa:** sumar `--alfa` para guardar los PNG con transparencia.
- **Prueba completa:** montar a mano en ffmpeg (`overlay`) un `.mov` de `lux` sobre un video cualquiera. No debe verse ningún rectángulo.

### Terminado cuando

- `node tools/laminas.mjs lux --alfa` deja `.mov` con transparencia y el manifest nuevo.
- `CLAUDE.md` («Módulo de video» y la fila de `lux`) explica `--alfa` y `data-fondo`.
- `lux` y `graves` marcan sus fondos con `data-fondo`.

---

## P2 · Música y efectos de sonido en `video.mjs`

### Problema

`docs/audio-y-tours.md` lo propuso el 22/sep y sigue sin hacerse: los videos narrados (`ultracode`, `dra`, `semana38`) llevan **solo voz**.

De esa propuesta solo llegaron las transiciones `xfade`. Hoy `video.mjs` arma la voz con aire alrededor (`aire`, `recortar`) y une segmentos, pero no mezcla nada más.

### Diseño

Reescribir aquí lo que walkthrough ya resolvió en su montaje (sin copiar código):

**1. `guion.json` con música.**

```json
"musica": { "pista": "…", "volumen": 0.18, "desde": 0, "fadeIn": 1.5, "fadeOut": 2 }
```

- **`pista` puede estar fuera del repo:** ruta absoluta o variable de entorno `MUSICA_DIR`.
- **Por qué:** el repo es público, y una pista de Mixkit o Pixabay se puede usar en el video pero no redistribuir como archivo.
- **Dentro del repo**, solo pistas CC0 en `tools/audio/` con su `CREDITOS.md`.

**2. Ducking con `sidechaincompress`.** La voz es la llave:

- La música baja sola mientras se habla: `threshold=0.03:ratio=8:attack=20:release=400` es el punto de partida que funcionó en walkthrough.
- Niveles: voz a ~−16 LUFS y cama entre −26 y −30.

**3. Loudness en dos pasadas.**

- **Primera pasada:** `loudnorm` mide (`print_format=json`).
- **Segunda pasada:** aplica lo medido con `linear=true`. En una sola pasada, `loudnorm` actúa como un control automático de ganancia y deshace la bajada de la música.
- **Al final:** un `alimiter` para quedar bajo −1 dBTP, que en modo lineal no está garantizado.

**4. Efectos de sonido sintetizados, sin archivos.** walkthrough los hace con fuentes de ffmpeg (`sine`, `anoisesrc` con semilla y filtros), así que no hay licencias que cuidar en un repo público.

- **Un efecto por receta**, con la regla de `docs/audio-y-tours.md`: uno por lámina como máximo.

  | Receta | Efecto |
  |---|---|
  | `cortinilla` o `lineas` | *whoosh* |
  | `sello` | golpe seco |
  | `contador` | *ticks* |
  | `bento` o `piezas` | *pop* |
  | Cambio de lámina | apenas audible |

- **El momento sale de la timeline**, no de un número a mano. Cada receta del kit agrega una etiqueta (`tl.addLabel('sfx:sello', pos)`). `cuadros.mjs` lee `tl.labels` y lo escribe en `anim.json`. `video.mjs` lo suma al inicio de la lámina en el video (`tiempos.json`).
- **Cada efecto cae en el primer cuadro en que se ve** lo que lo provoca, y si no se ve, no suena. Esta es la regla de walkthrough.
- **Cuidado con ffmpeg 8.1:** el relleno de `adelay` sale sin marcas de tiempo y adelanta los efectos. Los retrasos se hacen con `asetpts=N/SR/TB` después de un relleno, como hace walkthrough.
- **Desactivable:** `"sfx": false` en el guion, o por lámina.

**5. Un solo `amix` por bus.**

- Voz.
- Música con ducking.
- Efectos, que entran **después** del ducking para no agachar la música.

### Pruebas

- **Con señales sintéticas:** un tono de voz y una cama de ruido. La cama baja al menos 8 dB mientras suena la voz (medido con `astats` por ventana).
- **Loudness integrado del resultado** a ±1 LU del objetivo y pico real bajo −1 dBTP (`ebur128`).
- **Un efecto en su segundo:** el inicio del pico a menos de un cuadro (33 ms a 30 fps).
- **`semana38` regenerado con música** suena bien al oído, y el video dura lo mismo que sin música.

---

## P3 · Animación al ritmo de una canción

### Problema

Las láminas para reels se animan con tiempos a mano. Cuando la lámina va sobre un edit con música, conviene que los golpes (el sello, el contador, la entrada del título) caigan en el beat.

### Diseño

- **El contrato.** ReelForge produce un `beatmap.json` con claves en inglés:
  - `bpm`, `beats` y `downbeats` en segundos.
  - `sections: [{ type, start, end, energy }]`, con `type` entre `intro`, `verse`, `chorus`, `bridge` y `outro`.
  - `drop`, `buildups` y `words: [{ text, start, end }]`.

  walkthrough piensa leer el mismo formato. Aquí solo se **lee**, no se analiza música.
- **Un helper de build-time:**

  ```js
  const r = kit.ritmo(require('./beatmap.json'), { desde: 12.4 })
  r.b(8)        // segundo del beat 8 desde `desde`
  r.compas(2)   // primer tiempo del compás 2
  r.drop        // el drop, relativo a `desde`
  ```

  Se usa en el `gen.js` para escribir `data-en`, o dentro de `animar()` como posición de la timeline. `desde` es el segundo de la canción donde empieza la lámina en el reel.
- **La letra.** `r.palabra('survive')` da el segundo de esa palabra. Es la versión musical de la receta «golpe» propuesta en `docs/efectos-svg.md`.
- **Dónde va el `beatmap.json`:** en la carpeta del deck, porque los tiempos son datos y no pesan. La música no se commitea.

### Pruebas

- Funciones puras en `tools/kit.cjs`, con un beatmap de ejemplo escrito a mano.
- `b()` interpola entre beats si el índice es fraccionario.
- `compas()` cae en `downbeats`.
- Un `desde` fuera de la canción es un error legible.

---

## P4 · Kit de edit: recetas para capas de edits

### Por qué

Los edits del canal (de anime, de partidas de Worlds) necesitan un acabado gráfico que el video solo no tiene. ReelForge ya resuelve el video: cortes al beat, velocidad, flash, zoom, sacudida y letreros simples en ASS. Lo que GSAP hace mejor que un ASS son las **capas animadas con alfa** que se montan encima (P1).

### Recetas propuestas

Todas van en `tools/kit-efectos.cjs`, deterministas y con su lámina en `lab/`.

**Antes de la primera receta:** `kit.random(semilla)` **todavía no existe**. Hoy hay dos PRNG internos sin exportar, `prng` en `tools/kit-efectos.cjs` y `mulberry` en `tools/kit-patrones.cjs`. El primer paso de P4 es unificarlos en uno solo y exponerlo como `kit.random(semilla)` (build-time) y como `random(semilla)` dentro de `kit.efectos()` (runtime), con la misma secuencia en los dos lados y una prueba que lo compare.

| Receta | Qué se ve | Notas |
|---|---|---|
| `brasas` / `chispas` | Partículas que suben o estallan y se apagan | Posiciones y velocidades de un PRNG con semilla; fórmula cerrada en el tiempo, sin Physics2D. Terminan invisibles, así que el estado final es vacío |
| `rayo` | Estela de luz que cruza el cuadro | Un trazo con degradado y desenfoque; misma técnica que `cometa` |
| `impacto` | Líneas de velocidad hacia el centro | Rayos con semilla en build-time; solo escala y opacidad |
| `palabra` | Una palabra gigante con degradado que entra con golpe (125 % → 100 % en 80 ms) | La firma del edit de referencia. El degradado al texto **va en cada letra** si las letras se animan por separado (lección de `lux`) |
| `letrero-kill` | NOMBRE grande y campeón chico debajo, con el retrato opcional | Centrado por la altura de las mayúsculas, no por la caja: en Anton la caja deja las letras ~25 px más abajo (medido en ReelForge) |
| `multikill` | «QUADRA KILL» estampado en oro | Variante de `sello` |

### Cuidados

- **El arte de Riot sigue fuera de lo que se puede publicar** sin el aviso de contenido de fans (ver `docs/animaciones-y-assets.md`). Las recetas no traen arte: lo recibe el deck.
- **Un mismo letrero no debería salir dos veces.** Si el edit ya lleva el letrero de ReelForge, la capa de aquí reemplaza al ASS, no se le suma.

---

## P5 · Efectos de la segunda tanda que faltan

`docs/efectos-svg.md` propuso 25 efectos y entraron los 8 marcados con ★. Quedan 17, ya diseñados. Prioridad sugerida según lo que piden las series activas:

1. **golpe:** palabra por palabra con los tiempos de Fish, que `video.mjs` ya tiene. Para charlas y reportes narrados.
2. **chispas** y **destello:** remates con `sello` en récords. Comparten base con P4.
3. **dona:** generaliza lo hecho a mano en `semana35`; los reportes semanales la usan cada semana.
4. **radar:** parches (antes y después de las estadísticas).
5. **pixelado:** «adivina la skin».
6. **derrumbe:** el catálogo solo tiene entradas, no salidas.
7. Resto (aberración, especular, neón, foco, silueta, rotulado, órbita, mosaico, cortina líquida, ensamble), según lo pida un deck.

**Antes de cada efecto, leer «Riesgos generales» de ese documento:**

- Imágenes fuera de `<svg><image>`.
- Fuentes de azar de GSAP.
- Calibrar el ruido.
- Costo de los filtros sin GPU.

**Cada efecto termina igual:** receta, lámina en `lab/`, y la prueba de `qa-anim` yendo y volviendo dentro de la lámina, que debe dar el mismo cuadro.

---

## P6 · Dibujo a líneas: objetos que giran entre láminas

Lo único pendiente de `docs/lineas-y-continuidad.md`.

### Hoy

`kit.lineas.dibujar()` proyecta en build-time y deja el SVG ya resuelto. Entre láminas, la continuidad mueve el SVG, pero no puede girar el objeto en 3D.

### Diseño

- Dejar el modelo (vértices, caras y cámara) en el HTML como JSON y proyectar en cada cuadro.
- Para eso, la parte pura de `tools/kit-lineas.cjs` tiene que poder correr también en la página: proyección, recorte de aristas ocultas y achurado.
  - Opción 1: generarla como un `<script>` en línea desde la misma fuente.
  - Opción 2: copiar el archivo por carpeta, como `deck-stage.js`.
- La receta `continua` gana un modo `gira` que interpola la cámara de una lámina a la otra.

### Riesgo

Costo por cuadro. Hoy la escena más pesada (el trofeo con sombra) tarda 43 ms en Node. Si en Chrome cuesta lo mismo, sigue siendo viable a 30 fps cuadro a cuadro, porque el render no es en tiempo real.

### Primer paso

Un deck de prueba con un objeto que gira entre dos láminas, medido con `cuadros.mjs`. El documento ya pedía ese deck de prueba antes de volverlo criterio de serie.

---

## P7 · Easing con nombre y desenfoque de movimiento

### Tokens de easing

De 3 a 5 curvas con nombre en `kit.efectos()`: `entrada`, `salida`, `golpe`, `asentar` y `deriva`. Las recetas las usan por nombre, en vez de un `power3.out` distinto en cada una.

- Con `CustomEase` ya vendorizado en la 3.15. Los decks viejos traen su propia 3.12.5 y no se tocan.
- Las curvas se definen con puntos fijos, que son deterministas.

### Desenfoque de movimiento

- **Qué:** `data-blur` en una lámina hace que `cuadros.mjs` capture N subcuadros por cuadro (por ejemplo 4, en `t`, `t + 1/(4·fps)`…) y los mezcle con `tmix=frames=4` en ffmpeg.
- **Costo:** se multiplica por N, así que se pide solo donde hay movimiento rápido.
- **Cuidado con el modo alfa (P1):** `tmix` promedia el alfa también. Para capas de bordes nítidos, mejor no combinarlos.
- **Prueba:** un bloque que cruza el cuadro deja una estela proporcional a su velocidad, y el cuadro final queda nítido.

---

## P8 · Herramientas en Linux y pruebas del kit

### Linux

`capturar.mjs` y `cuadros.mjs` buscan Chrome solo en rutas de macOS y Windows. En una sesión en la nube (Linux) no corren.

- Agregar `CHROME_PATH` como variable de entorno.
- Agregar las rutas típicas de Linux (`/usr/bin/google-chrome`, `/usr/bin/chromium`, `/opt/pw-browsers/chromium-*/chrome-linux/chrome`) a la lista.

Lo mismo en `og.mjs`, `portadas.mjs`, `qa-*.mjs`, `recortes.mjs`, `contorno.mjs` y `diagrama.mjs`. Conviene un solo `tools/chrome.mjs` que todos importen. No es código compartido con otro repo, así que está permitido.

### Pruebas

El kit no tiene pruebas automáticas. Con `node --test`, sin dependencias nuevas:

- **`kit.patron`:** misma semilla, mismo SVG (hash); el peso de cada patrón bajo su tope.
- **`kit.lineas`:** una caja con la cámara isométrica da el número esperado de aristas visibles.
- **`kit.diferir`:** es idempotente y deja intacta la primera lámina.
- **`kit.ritmo` (P3)**, cuando exista.

Se corren con `node --test tools/`. Agregar la línea a `CLAUDE.md`.

---

## P9 · Deudas de documentación

Encontradas al revisar el repo el 22/oct:

- **`CLAUDE.md`, fila de `parche2621`:** la tabla está rota.
  - **Causa:** dentro de la celda hay un salto de línea real donde se quería escribir el texto `\r\n` («en Windows Python escribe la lista con `…` (curl falla si no se quita)»).
  - **Efecto:** la fila se parte en dos y todo lo que sigue sale fuera de la tabla.
  - **Arreglo:** poner el texto entre comillas invertidas, sin el salto.
- **`CLAUDE.md`, «Notas de entorno»** todavía dice que `docs/video-narrado.md` «necesitará una [llave] de ElevenLabs». El proyecto usa Fish Audio (`FISH_API_KEY`).
- **`lowelo/`** existe pero no está en el árbol de «Arquitectura» de `CLAUDE.md`, ni en la tabla de generado contra escrito a mano.
- **Skill `nuevo-deck`:** verifica con `md5 -q */deck-stage.js`, que solo existe en macOS. Reemplazarlo por algo que corra en Windows y Linux:

  ```
  node -e "…crypto.createHash('md5')…"
  ```

  Hoy las 48 copias tienen el mismo hash: la divergencia de 5 copias que anotó el PKB ya se resolvió.
- **`404.html`** sigue con la identidad vieja (Barlow, `#0D0E12`); falta migrarlo a «La cartelera».
- **`docs/audio-y-tours.md`, segunda parte** (tours guiados y videos de QA): ya la cubre walkthrough, el repo hermano que graba la app real. Marcarla como resuelta allá, y dejar en este repo solo la parte de sonido (P2).

---

## P10 · Estándares de salida

Hoy cada herramienta decide sola:

| Qué | Este repo | walkthrough | ReelForge |
|---|---|---|---|
| Loudness | Sin normalizar | −16 LUFS / −1,5 dBTP | −11 LUFS en la intro de competitivo |
| fps | 30 | 30 | 60 en competitivo y en edits de partidas |
| Banda segura en 9:16 | 300/350 px | 12 % arriba y 20 % abajo en el sizzle; piso de 5 % en el resto | Por módulo |

**Propuesta:**

- Fijar valores por tipo de salida en un documento del PKB (`metodologia/video/estandares.md`), y que cada `CLAUDE.md` lo enlace en lugar de copiarlo:
  - Reel corto: −14 LUFS / −1 dBTP.
  - Video narrado largo: −16.
- **Zonas seguras:** un PNG en `qa-deck`, validado una vez contra los overlays oficiales de TikTok Ads, que avise del texto tapado por los controles.
- **Edits con movimiento rápido a 60 fps.** `cuadros.mjs` ya acepta el fps como argumento; `laminas.mjs` lo fija en 30.

---

## P11 · Lottie y Three.js como recetas

Más adelante, y cada uno con una prueba de un día antes de comprometerse.

### Lottie

- **Qué:** `lottie-web` vendorizado por carpeta, con `goToAndStop(frame, true)` en el `onUpdate` de un tween, así es seekeable.
- **Riesgo:** la licencia de **cada** animación de LottieFiles; en un repo público solo entran las de licencia clara.

### Three.js

- **Qué:** vendorizado por carpeta, con `renderer.render()` en cada seek y la cámara movida por la timeline, sin `requestAnimationFrame`. Sirve para logos extruidos o el mapa 3D de `seating3dmap`.
- **Riesgos:**
  - WebGL sin GPU (SwiftShader) es unas 4 veces más lento.
  - El determinismo entre máquinas no está garantizado.
- **Primer paso:** 10 s con un modelo simple, midiendo el tiempo por cuadro y comparando dos renders.

---

## Relación con los otros repos

| Contrato | Lo produce | Lo lee |
|---|---|---|
| `manifest.json` de láminas (con `archivo`, y desde P1 `alfa`, `caja` y `palabras`) | Este repo (`laminas.mjs`) | ReelForge (`montage`) |
| `beatmap.json` (claves en inglés: `beats`, `downbeats`, `sections`, `drop`, `words`) | ReelForge (`beatmap`) | Este repo (P3) y walkthrough |
| Música con ducking, efectos sintetizados y loudness en dos pasadas | walkthrough (ya lo tiene) | Este repo lo reescribe en `video.mjs` (P2) |

Ningún repo importa código de otro; si un contrato cambia, cambia en los dos lados en la misma semana y se anota aquí.
