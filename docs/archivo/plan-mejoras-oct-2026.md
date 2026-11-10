# Plan de desarrollo de las mejoras de octubre (22/oct/2026)

Plan para ejecutar `docs/mejoras-oct-2026.md`. Ese documento dice **qué** hacer en cada mejora (P1–P11) y cuándo está terminada; este dice **en qué orden**, **en cuántas sesiones**, **con qué ramas** y **qué se verifica antes de cada commit**.

Si los dos documentos no coinciden en el diseño de una mejora, manda `mejoras-oct-2026.md`; si no coinciden en el orden, manda este.

## Resumen

| Fase | Mejoras | Sesiones | Qué destraba |
|---|---|---|---|
| **0 · Cimientos** | P9, pruebas del kit (P8), `kit.random` | 1 | Que el kit tenga pruebas y el PRNG que pide P4 |
| **1 · Capas con alfa** | P1 y la parte de fps de P10 | 2 | El montaje sin rectángulos y todo el kit de edit (P4) |
| **2 · Sonido** | P2 y la parte de loudness de P10 | 2 | Videos narrados con música, y los estándares de salida |
| **3 · Ritmo y edit** | P3, P4 y P5 (chispas, destello) | 3–4 | Las capas de edits sobre el beat |
| **4 · Acabado** | P7 y P5 (golpe, dona, radar, pixelado, derrumbe) | 2–3 | Que las láminas se vean menos «hechas con código» |
| **5 · Exploración** | P6 y P11 | 2, cada una con una prueba antes | Objetos que giran, Lottie y Three.js |

**Todo se desarrolla y se prueba en local, en la Mac de Axl** (decisión del 22/oct/2026): no se verifica nada en sesiones en la nube. Por eso la parte de Linux de P8 queda descartada.

Una **sesión** es una conversación de trabajo que termina con commits verificados en una rama. Son unas **12–14 sesiones** en total; las fases 3 y 4 se pueden alternar según lo que pidan las series activas.

## Por qué este orden

El documento de mejoras ordena por impacto (P1, P2, P3…). Aquí se adelantan dos cosas chicas porque condicionan a las demás:

1. **Las pruebas del kit van primero.** Sin ellas, cada fase que toque `kit.patron`, `kit.lineas` o `kit.diferir` puede ensuciar los diffs de todos los decks sin que nada avise.
2. **P9 va con ellas.** Son correcciones de texto y la tabla rota de `CLAUDE.md` confunde a cualquier sesión que lo lea. Cuestan minutos.
3. **`kit.random` antes de P4.** P4 lo pide para sus partículas y hoy no existe (hay dos PRNG internos sin exportar). Conviene hacerlo en la fase 0, con su prueba, para que la fase 3 arranque sin deudas.

### Dependencias

```
Fase 0 ──┬─> P1 ──┬─> P4 ──> P5 (chispas, destello)
         │        └─> P7 (desenfoque: no combinar con alfa sin probar)
         ├─> P2 ──> P10 (loudness)
         └─> P7
P1 ──> P10 (fps en laminas.mjs)
P3 ──> P4 (letreros y palabra al beat)
P6, P11: independientes; van al final porque llevan riesgo
```

## Reglas para todas las fases

- **Se trabaja en `stg`**, al día con `main`, con un commit por mejora o por fase (así lo pidió Axl el 22/oct). Las ramas que nombra cada fase quedan como sugerencia si una mejora se alarga. De `stg` a `main` se pasa con PR, como siempre.
- **Antes de empezar:** `git log -5` y revisar que los archivos que nombra la mejora sigan como dice el documento. Si algo cambió, se anota en la mejora antes de seguir.
- **Antes de cada commit**, según lo que se toque:
  - `node --test "tools/**/*.test.mjs"` (desde la fase 0).
  - `node tools/qa-deck.mjs <deck>` en los decks afectados: sin desbordes nuevos ni errores de consola.
  - `node tools/qa-anim.mjs <deck> <n> <t1,t2,…>` si cambia una coreografía o una receta: ir y volver dentro de la lámina da el mismo cuadro.
  - `node tools/cuadros.mjs <deck>` o `laminas.mjs` si cambia el render.
- **Regresión visual:** antes de tocar el render se capturan los decks de referencia con `capturar.mjs` y se guardan fuera del repo; después se comparan por PSNR (≥ 45 dB = sin cambio visible). Decks de referencia: `lux`, `graves`, `semana42`, `seating3dmap` y `lab`.
- **Documentación en el mismo commit que el código:** `CLAUDE.md` (la sección que corresponda) y, en `docs/mejoras-oct-2026.md`, la mejora marcada como hecha con su fecha y su commit.
- **El repo es público.** Nada de llaves, pistas de música con licencia de uso ni arte sin permiso. Ver «Notas de entorno» abajo.
- **Commits firmados con el correo que reconoce Vercel.** El 20/oct Vercel bloqueó el deploy de `semana42` mientras el repo estuvo privado, porque el commit iba con `axl.guillen@urvenue.com`. Hoy el repo es público y pasa, pero si vuelve a cambiar a privado, el plan Hobby solo despliega commits del dueño de la cuenta.

---

## Fase 0 · Cimientos (1 sesión)

**Rama:** `mejora/p8-cimientos`.

### Pasos

1. **P9, deudas de documentación:**
   - Rehacer la fila de `parche2621` en `CLAUDE.md` sin el salto de línea real (líneas 95–96 hoy).
   - Cambiar la nota de ElevenLabs por Fish Audio (`FISH_API_KEY`) en «Notas de entorno».
   - Agregar `lowelo/` al árbol de Arquitectura y a la tabla de generado contra escrito a mano (revisar primero si tiene `gen.js`).
   - Reemplazar el `md5 -q` del skill `nuevo-deck` por una línea de Node que corra en macOS, Windows y Linux.
   - Marcar como cubierta por walkthrough la segunda parte de `docs/audio-y-tours.md`.
   - `404.html` queda anotado como pendiente: es diseño, no deuda de texto, y no bloquea nada.
2. **P8, Chrome en Linux: descartado.** Todo se prueba en la Mac, donde las herramientas ya encuentran Chrome. De P8 solo queda la parte de pruebas (paso 4).
3. **`kit.random`:**
   - Unificar `prng` (`kit-efectos.cjs`) y `mulberry` (`kit-patrones.cjs`) en una sola función.
   - Exportarla como `kit.random(semilla)` y emitir la misma en el runtime de `kit.efectos()`.
   - Comprobar que `kit.patron` con la misma semilla sigue dando **el mismo SVG byte a byte** que antes: si cambia, los diffs de todos los decks con patrones se ensucian.
4. **Pruebas mínimas** con `node --test`, sin dependencias nuevas, en `tools/pruebas/`:
   - `kit.patron`: misma semilla, mismo hash; cada patrón bajo su tope de peso.
   - `kit.lineas`: una caja isométrica da el número esperado de aristas visibles.
   - `kit.diferir`: idempotente y deja intacta la primera lámina.
   - `kit.random`: la misma semilla da la misma secuencia en Node y en el runtime (se compara contra una lista fija).

### Terminado cuando

- `node --test "tools/**/*.test.mjs"` pasa en la Mac (con la ruta sola, `node --test tools/`, Node 24 la toma como archivo y falla).
- Los SVG de patrones no cambian (mismo hash que antes del cambio).
- `CLAUDE.md` explica las pruebas y `kit.random`.

**Hecho el 22/oct/2026.** Además de lo anterior, `optimizar-imagenes.mjs` llama a `python3` en macOS y Linux, así que ya no hace falta el alias.

---

## Fase 1 · Capas con alfa para el montaje (2 sesiones)

**Rama:** `mejora/p1-alfa`. Diseño completo en P1 del documento de mejoras.

### Sesión 1 · `cuadros.mjs --alfa`

1. **Prueba de un cuadro antes que nada:** un HTML mínimo con un círculo sobre fondo transparente, capturado con `Emulation.setDefaultBackgroundColorOverride` en alfa 0.
   - Leer el canal alfa del PNG con y sin `optimizeForSpeed`.
   - Si `optimizeForSpeed` pierde el alfa, se apaga solo en modo alfa y se anota el costo medido.
2. Vaciar fondos: la hoja en el documento y otra **dentro de `ds.shadowRoot`** para `:host` y el escenario de `deck-stage.js` (los dos `background: #000`).
3. **`data-fondo`:** en modo alfa, todo lo que lo lleve va con `display: none`.
4. **Encoder:** ProRes 4444 (`prores_ks -profile:v 4444 -pix_fmt yuva444p10le -vendor apl0`) en `.mov`; `--alfa=webm` con `libvpx-vp9 -pix_fmt yuva420p`. Los dos están en el ffmpeg 8.1.1 de esta Mac.
5. Verificar con `ffprobe` (`yuva444p10le`) y con un cuadro extraído a `rgba`: una esquina vacía tiene alfa 0 y el primer plano alfa 255.

### Sesión 2 · `laminas.mjs --alfa`, manifest y decks

1. `laminas.mjs --alfa`: pide los clips con alfa, corta con `crop` y `tpad` sin pasar por `yuv420p`, y guarda el PNG final con alfa.
2. **Manifest nuevo** (compatible con el que ya lee ReelForge): `alfa`, `caja` y `palabras`, con `palabras` sacado de `data-palabras` en la `<section>`.
3. **P10, fps:** `laminas.mjs --fps=60` (hoy está fijo en 30); `cuadros.mjs` ya lo acepta.
4. Marcar con `data-fondo` los fondos de `lux` y `graves` (copias desenfocadas, rayos, humo, lavados), regenerar y comprobar que **el modo opaco no cambia** (PSNR contra la captura de referencia).
5. `qa-anim --alfa` para guardar PNG con transparencia.
6. **Prueba completa:** `ffmpeg -i fondo.mp4 -i <lamina>.mov -filter_complex overlay` sobre un video cualquiera: no debe verse ningún rectángulo.

### Terminado cuando

Lo que dice P1, más: `laminas.mjs graves --alfa` también produce sus `.mov`, y el modo opaco de `lux` y `graves` es idéntico al de antes.

### Riesgos

- **El peso de ProRes 4444** (decenas de MB por clip). Si estorba para pasarlo entre herramientas, el webm es el plan B, y se mide el tiempo de codificación de los dos.
- **El desenfoque de las copias borrosas hace de fondo** en lux: al apagarlo con `data-fondo`, revisar que el primer plano siga leyéndose sobre el gameplay. Si no, se agrega una sombra que solo exista en modo alfa.

### Resultado (22/oct, hecho en stg)

- `optimizeForSpeed` **sí conserva el alfa**: no hubo que apagarlo.
- ProRes sin tope pesaba 580 MB por clip; con `-qscale:v 9` (49 dB) y los fondos marcados, el render de lux bajó de 3,1 GB a 702 MB y de 170 s a 62 s.
- Además de los helpers (`borroso`, `ambiente`, `rayos`, `humo`), hubo que marcar a mano tres capas a sangre que no salían de ellos: la copia borrosa de la skin expandida de lux y los tintes `data-frio` / `data-sombra` de lux y graves. Para encontrarlas sirvió componer cada PNG final sobre un damero.
- Sobre el video de prueba el primer plano se lee sin la copia borrosa: no hizo falta la sombra de modo alfa.
- El modo opaco no cambió: el HTML, sin las marcas `data-fondo`, solo difiere en el runtime del kit de la fase 0, y los clips opacos dan 48–82 dB de PSNR contra los de la versión anterior de `cuadros.mjs` (la variación normal entre corridas es 41–60 dB), con las mismas duraciones.
- Apareció un error ajeno a la fase: `cuadros.mjs` no salía al terminar porque las conexiones keep-alive dejaban vivo el servidor. Se arregló aquí mismo.

---

## Fase 2 · Sonido (2 sesiones)

**Rama:** `mejora/p2-sonido`. Diseño completo en P2. Se reescribe lo que walkthrough ya resolvió, sin copiar su código.

### Sesión 1 · Música, ducking y loudness

1. **Música:** `"musica"` en `guion.json`, con la pista fuera del repo (ruta absoluta o `MUSICA_DIR`). Dentro del repo solo pistas CC0 en `tools/audio/` con su `CREDITOS.md`.
2. **Ducking** con `sidechaincompress`, la voz como llave: `threshold=0.03:ratio=8:attack=20:release=400` de arranque.
3. **Loudness en dos pasadas:** `loudnorm` mide y la segunda pasada aplica con `linear=true`; al final un `alimiter` bajo −1 dBTP.
4. **Revisar la voz actual:** hoy `video.mjs` mete el aire con `adelay` + `apad` (línea 310). Con ffmpeg 8.1 el relleno de `adelay` sale sin marcas de tiempo, así que al mezclar con `amix` hay que pasar a `asetpts=N/SR/TB` después del relleno, como advierte P2.
5. **Pruebas sintéticas:** un tono de voz sobre ruido; la cama baja ≥ 8 dB mientras suena la voz (`astats` por ventana), el integrado queda a ±1 LU y el pico real bajo −1 dBTP (`ebur128`).

### Sesión 2 · Efectos de sonido

1. **Etiquetas en la timeline:** cada receta que suena agrega `tl.addLabel('sfx:<nombre>', pos)` (`cortinilla`, `lineas`, `sello`, `contador`, `bento`, `piezas`).
2. `cuadros.mjs` lee `tl.labels` y los escribe en `anim.json`; `video.mjs` los suma al inicio de cada lámina (`tiempos.json`).
3. **Efectos sintetizados** con `sine` y `anoisesrc` con semilla: *whoosh*, golpe seco, *ticks* y *pop*. Uno por lámina como máximo, y nunca si lo que lo provoca no se ve.
4. **Bus de efectos después del ducking**, para que no agache la música; un solo `amix` por bus.
5. `"sfx": false` global o por lámina.
6. **Prueba de oído:** regenerar `semana38` con música y efectos. Dura lo mismo que sin ellos, y cada efecto cae a menos de un cuadro de su etiqueta.

### P10, loudness

Fijar los valores con Axl (reel corto −14 LUFS / −1 dBTP; narrado largo −16) en `metodologia/video/estandares.md` del PKB, y que `CLAUDE.md` lo enlace en vez de copiarlo. Este paso es del PKB, no de este repo, así que se propone y no se hace sin que Axl lo apruebe.

### Resultado (22/oct, hecho en stg)

- **Los efectos se sintetizan en Node y no con fuentes de ffmpeg**: el bus completo sale de `tools/audio.mjs` como un WAV con cada efecto en su muestra, con el PRNG del kit. Es lo mismo que pedía el plan (sin archivos y con semilla), pero sin cadenas de `adelay` ni `asetpts`.
- **El loudness se aplica con una ganancia fija y no con `loudnorm linear=true`**, que se pasa solo a modo dinámico cuando el pico no le cabe. La primera pasada mide con `ebur128`.
- **El `adelay` de los segmentos (paso 4) se queda**: la mezcla parte del audio ya concatenado del video, que trae sus marcas de tiempo, así que el problema de P2 no aplica. Se comprobó que audio y video miden lo mismo (112,52 y 112,53 s en semana38).
- semana38 solo usa `cuenta()`, así que en su prueba sonaron tres *ticks*. Las demás recetas se comprobaron leyendo las etiquetas de las 60 láminas de `lab/`.
- **Pendiente:** el sonido «apenas audible» del cambio de lámina, que la tabla de P2 menciona, no se hizo porque choca con la regla de un efecto por lámina. También queda pendiente que Axl escuche la prueba y diga si los volúmenes (`cama` −12 LU y el bus de efectos a 1) le funcionan.

### Riesgo

**La licencia de la música.** Ninguna pista con licencia de uso entra al repo; los videos publicados en las cards llevan la pista ya mezclada, que sí se puede distribuir.

---

## Fase 3 · Ritmo y kit de edit (3–4 sesiones)

**Ramas:** `mejora/p3-ritmo` y `mejora/p4-edit`.

### Sesión 1 · `kit.ritmo` (P3)

- Funciones puras en `tools/kit.cjs`: `b(n)` con interpolación fraccionaria, `compas(n)` sobre `downbeats`, `drop` y `palabra('texto')`, todas relativas a `desde`.
- Pruebas con un `beatmap.json` de ejemplo escrito a mano en `tools/pruebas/`: `desde` fuera de la canción da un error legible.
- Una lámina en `lab/` que golpea en el beat, con un beatmap de ejemplo commiteado y **sin la música**.

### Sesiones 2–4 · Recetas de edit (P4, una o dos por sesión)

En este orden, porque comparten base:

1. `brasas` y `chispas` (con `kit.random`), y de paso **`destello`** de P5.
2. `palabra` (el golpe de 125 % a 100 % en 80 ms, con el degradado en cada letra) y `multikill` (variante de `sello`).
3. `letrero-kill` (centrado por la altura de las mayúsculas, no por la caja) y `rayo`/`impacto`.

Cada receta lleva:

- Su lámina en `lab/`.
- El deshacer en `section.__deshacer` si toca el DOM.
- La prueba de `qa-anim` yendo y volviendo.
- Un render con `laminas.mjs --alfa` (fase 1) para ver la capa sobre un video.

### Terminado cuando

Las recetas están en el catálogo de `CLAUDE.md` y en `lab/`, y un deck de prueba de 3 láminas de edit (partículas, palabra y letrero) sale con alfa y se monta a mano sobre un clip sin rectángulos.

### Resultado (22/oct, hecho en stg y en una sola sesión)

- `kit.ritmo` vive en `tools/kit-ritmo.cjs`, con 4 pruebas sobre `tools/pruebas/beatmap.json`. Los índices empiezan en 0 desde la lámina, y además de `b`, `compas`, `drop` y `palabra` trae `beats(desde, n)` y `seccion(tipo)`.
- Las ocho recetas (`chispas`, `brasas`, `destello`, `palabra`, `multikill`, `letrero`, `rayo` e `impacto`) tienen su lámina en el grupo «Edit» de `lab/`. Las partículas no usan Physics2D: son una fórmula cerrada con roce y gravedad.
- **La prueba de ida y vuelta se hizo en la misma página** (mitad → final → mitad), con un script aparte, porque `qa-anim` nombra los PNG por tiempo y no deja repetir uno.
  - En el área de la demo dio de 68 dB a idéntica.
  - Lo que cambia en las láminas cortas es la cabecera a medio animar, igual que con `sello` y `cortinilla`.
- **El deck de prueba es un generador** (`tools/pruebas/deck-edit.cjs` → `prueba-edit/`, ignorada en git) para no sumar un deck público a la galería. Se montó con `overlay` sobre 12 s del video de ultracode.
- Las recetas que suenan suman su efecto a la tabla de P2: `palabra`, `multikill` e `impacto` → golpe; `rayo` y `letrero` → *whoosh*.

---

## Fase 4 · Acabado (2–3 sesiones)

**Ramas:** `mejora/p7-movimiento` y `mejora/p5-efectos`.

1. **P7, tokens de easing:** `entrada`, `salida`, `golpe`, `asentar` y `deriva` con `CustomEase` (vendorizado en la 3.15). Las recetas nuevas los usan por nombre; las viejas se migran solo si se tocan, para no mover los decks hechos.
2. **P7, desenfoque de movimiento:** `data-blur` en la lámina, N subcuadros mezclados con `tmix`. Prueba: un bloque que cruza deja una estela proporcional y el cuadro final queda nítido. **No se combina con `--alfa`** hasta probarlo, porque `tmix` también promedia el alfa.
3. **P5, efectos que faltan**, en el orden del documento:
   - `golpe`, palabra por palabra con los tiempos de Fish, para charlas y reportes narrados.
   - `dona`, que generaliza la de los reportes semanales: el próximo reporte la estrena.
   - `radar`, `pixelado` y `derrumbe`.
   - El resto, cuando lo pida un deck.

### Resultado (22/oct, hecho en stg)

- **Curvas:** si no hay CustomEase, cada curva cae a la estándar más parecida, registrada con `gsap.registerEase` y el mismo nombre. Así las recetas las piden por nombre en cualquier deck, incluso en los que traen la 3.12.5. Las recetas de edit de la fase 3 se migraron; las viejas, no.
- **Desenfoque:** se probó con `tools/pruebas/deck-blur.cjs` (`prueba-blur/`, ignorada en git). La estela mide 154 px contra 155 esperados y el cuadro final sale idéntico al nítido. Con `--alfa` avisa y no se aplica.
- **`golpe` necesita los tiempos de la voz en build-time**, y la voz se pide en `video.mjs`. Por eso `video.mjs` escribe `video-out/palabras.json`, y `kit.voz()` y `kit.golpe()` lo leen. Hay que regenerar el deck después de la primera voz; la segunda pasada sale de la caché.
- Las cinco recetas tienen su lámina en el grupo «Acabado» de `lab/` y salen deterministas en la ida y vuelta (de 77 dB a idéntico).
- Al armar `derrumbe` apareció que partir el texto con `textContent` borraba los `<br>`. Ahora `golpe` y `derrumbe` recorren los nodos de texto.

---

## Fase 5 · Exploración (2 sesiones, con prueba antes)

Cada una arranca con **una prueba de una sesión** y solo sigue si la prueba sale bien.

- **P6, objetos que giran:** un deck de prueba con un objeto que gira entre dos láminas, medido con `cuadros.mjs`. Se sigue si cada cuadro cuesta menos de ~100 ms en Chrome.
- **P11, Lottie y Three.js:** 10 s de cada uno, midiendo el tiempo por cuadro y comparando dos renders por PSNR. Se sigue si el render es determinista en esta Mac y la licencia de cada asset es clara.

### Resultado de P6 (22/oct, hecho en stg)

- **La prueba** (`tools/pruebas/deck-gira.cjs`) es el trofeo con sombra dando una vuelta en 3 s. Proyectar cuesta 43 ms de media por cuadro en Chrome (p95 70, máximo 86), sobre los ~90 ms que ya cuesta capturar. Pasa el criterio, así que se integró.
- **El runtime sale de la misma fuente** (opción 1 del diseño): `kit.lineasRuntime()` incrusta `kit-lineas.cjs` y la única función que importa, `encadenar`. Se comprobó que da el mismo SVG que el build-time.
- **Hizo falta un encuadre fijo** (`escala` en `dibujar`): con el ajuste automático, el objeto se acercaba y se alejaba al girar.
- La receta `gira` y el modo `gira` de `continua` interpolan la cámara en órbita. La receta da la vuelta entera sin camino corto, para que 360° no se anule.
- En `lab/` hay tres láminas, deterministas yendo y volviendo (80 dB a idéntico).

### Resultado de P11 (22/oct, hecho en stg)

- **Las pruebas** (`tools/pruebas/deck-lottie.cjs` y `deck-three.cjs`) son 10 s de una animación y una escena hechas a mano, sin assets de terceros. Las dos dan unos 28 ms por cuadro, con la captura incluida, y dos renders idénticos en los 301 cuadros. Three.js corre en la GPU (ANGLE Metal, M2). Licencias MIT en `tools/vendor/`.
- **La prueba destapó un error de `cuadros.mjs`, no de Lottie:** `pause(0)` no llama a los `onUpdate`, así que el cuadro 0 de toda receta que pinta ahí salía con lo que hubiera dejado la reproducción automática. Ahora es `pause(0, false)`.
- **Lottie** es la versión light (solo SVG). Su receta vuelve a pintar en `DOMLoaded`, porque `loadAnimation` monta el DOM después.
- **three.js 0.186 ya no trae build minificado** y es un módulo ES (2,1 MB). Como carga tarde, `kit.animador` ganó `window.relanzar()` y el arranque de three lo llama. Se comprobó con una escena en la primera lámina.
- En `lab/` hay dos láminas (`lottie` y `tres`), deterministas yendo y volviendo.
- **Pendiente:** probar en una máquina sin GPU y revisar la licencia de cualquier animación de LottieFiles antes de usarla en un deck.

---

## Seguimiento

Estado de cada mejora. Se actualiza en el mismo commit que la cierra.

| Mejora | Fase | Estado | Rama | Commit |
|---|---|---|---|---|
| P9 · Deudas de documentación | 0 | Hecho (22/oct; `404.html` sigue pendiente) | stg | ver fase 0 |
| P8 · Pruebas del kit (Linux descartado) | 0 | Hecho (22/oct) | stg | ver fase 0 |
| `kit.random` | 0 | Hecho (22/oct) | stg | ver fase 0 |
| P1 · Capas con alfa | 1 | Hecho (22/oct; probado en lux y graves) | stg | ver fase 1 |
| P10 · fps en `laminas.mjs` | 1 | Hecho (22/oct) | stg | ver fase 1 |
| P2 · Música, ducking y loudness | 2 | Hecho (22/oct) | stg | ver fase 2 |
| P2 · Efectos de sonido | 2 | Hecho (22/oct; falta el sonido de cambio de lámina) | stg | ver fase 2 |
| P10 · Estándares de loudness (PKB) | 2 | Pendiente, requiere a Axl | | |
| P3 · `kit.ritmo` | 3 | Hecho (22/oct) | stg | ver fase 3 |
| P4 · Recetas de edit | 3 | Hecho (22/oct) | stg | ver fase 3 |
| P5 · Chispas y destello | 3 | Hecho (22/oct) | stg | ver fase 3 |
| P7 · Easing y desenfoque | 4 | Hecho (22/oct) | stg | ver fase 4 |
| P5 · Golpe, dona, radar, pixelado, derrumbe | 4 | Hecho (22/oct) | stg | ver fase 4 |
| P6 · Objetos que giran | 5 | Hecho (22/oct; la prueba pasó: 43 ms por cuadro) | stg | ver fase 5 |
| P11 · Lottie y Three.js | 5 | Hecho (22/oct; las dos pruebas pasaron) | stg | ver fase 5 |

## Prompt para arrancar cada sesión

> Lee `CLAUDE.md`, `docs/mejoras-oct-2026.md` y `docs/plan-mejoras-oct-2026.md`. Vamos a hacer la **sesión N de la fase F**. Confirma con `git log -5` y revisando los archivos que nombra que el repo sigue como dicen los documentos, y si algo cambió dímelo antes de escribir código. Trabaja en la rama que dice el plan, sigue sus pasos en orden, corre las verificaciones de «Reglas para todas las fases» antes de cada commit y actualiza la tabla de «Seguimiento» al cerrar.

## Notas de entorno

- **Esta Mac (22/oct/2026):** ffmpeg 8.1.1 con `prores_ks`, `libvpx-vp9`, `sidechaincompress`, `loudnorm`, `ebur128`, `alimiter` y `tmix`; Node 24 (`node --test` incluido).
- **El repo es público otra vez al 22/oct** (estuvo privado el 20/oct). `CLAUDE.md` lo da por hecho en sus reglas; si cambia, hay que revisar el correo de los commits (ver «Reglas para todas las fases»).
