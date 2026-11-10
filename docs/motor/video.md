# Módulo de video

> Movido desde el `CLAUDE.md` de la raíz el 10/nov/2026. Algunos ejemplos citan decks que ya están archivados en la etiqueta de git `archivo-2026-11` (soloq, tabletas, janna, riven…); se dejan como registro de por qué las cosas son así.

## Módulo de video (tools/)

`node tools/video.mjs <carpeta>` convierte un deck en `video-out/video.mp4` narrado con subtítulos: lee `<carpeta>/guion.json` (textos por slide + `voz` de Fish Audio), captura las diapositivas con `tools/capturar.mjs` (Chrome del sistema vía puppeteer-core, con rutas para macOS y Windows), pide la voz a Fish Audio (`s2.1-pro-free`, **gratis**; el modelo `s1` cobra) con timestamps palabra a palabra, y monta con ffmpeg. **Si el deck usa GSAP** (existe `<carpeta>/gsap.min.js`), `tools/cuadros.mjs` renderiza además las timelines **cuadro a cuadro** — seeks exactos con `section.__tl.time(t)` a 30 fps, determinista, sin frames perdidos — en clips `video-out/anim/anim-NN.mp4`, y cada slide entra animada al video congelando su último cuadro el resto de su narración (las slides sin timeline siguen con PNG estático). Se puede correr suelto: `node tools/cuadros.mjs <carpeta> [fps]`. La narración acepta **etiquetas de expresión entre corchetes** en el texto del guion (`[excited]`, `[break]`, `[whispering]`…, no salen en los subtítulos) y `guion.json` admite `voz` (reference_id, ver «Elegir la voz» abajo), `velocidad`, `temperatura`, y `"subtitulos"` con tres modos: omitido = subtítulos clásicos de dos líneas, `"ninguno"` = **solo voz y animación, sin nada quemado** (el SRT se sigue escribiendo aparte por si se quiere después), y `"karaoke"` = **subtítulos estilo TikTok**: líneas de 3 palabras centradas donde la palabra hablada se pinta con `"acento"` (#RRGGBB del deck) usando los timestamps reales, vía ASS/libass. El detalle vive en el skill `guion-video`. Requiere `FISH_API_KEY` en `.env` (nunca al repo) y `npm install` dentro de `tools/`. Las salidas `video-out/` están ignoradas; para publicar un video se copia a mano a la carpeta del deck y se enlaza desde su card (hoy ningún deck publica video).

**Velocidad** (auditada el 15/oct/2026):

| Paso | Antes | Ahora | Cómo |
|---|---|---|---|
| `capturar.mjs` (jinx, 17 láminas) | 145 s | **6,6 s** | Salta cada timeline a su final en vez de esperar 2,6 s, y captura por CDP |
| `cuadros.mjs` (jinx, 862 cuadros) | 248 s | **27–34 s** | Varios Chrome en paralelo (`--paralelo=N`, por defecto la mitad de los núcleos hasta 6), captura directa por CDP y cuadros por tubería a ffmpeg, sin PNG a disco |
| Voz (Fish) | una lámina tras otra, siempre | **en paralelo y con caché** | 3 peticiones a la vez (`"paralelo_voz"`), reintentos ante 429/5xx, y caché en `video-out/audio/cache/` por texto + voz + modelo + prosodia: regenerar tras tocar dos láminas solo pide esas dos |
| Segmentos | en serie, preset medium | **en paralelo** | 2–4 ffmpeg a la vez; en `veryfast` cuando después hay otra pasada (subtítulos o transiciones) |

Prueba de punta a punta con 4 láminas: 31 s la primera vez, **5,8 s** la segunda (0 peticiones a Fish). Tres cosas aprendidas:

- **Con la pantalla apagada o bloqueada, Chrome baja a ~1 cuadro por segundo**: un render de 15 s tardaba más de 3 minutos, al azar según si el monitor estaba encendido. `capturar.mjs` y `cuadros.mjs` arrancan Chrome con `--disable-gpu-vsync --disable-frame-rate-limit` y los flags de no-throttling para desligarlo del monitor.
- **Varias pestañas del mismo Chrome no escalan** (comparten el proceso de GPU); varios navegadores sí, casi en línea recta. Y en `page.evaluate` el cuerpo va con llaves: si la flecha devuelve `__tl.time(t)`, puppeteer serializa la timeline entera (~0,8 s por cuadro).
- **El render es exacto en el tiempo pero no byte a byte**: cada cuadro cae en su tiempo de timeline, pero dos corridas pueden diferir un poco en píxeles (41–60 dB de PSNR, invisible), porque Chrome elige a qué resolución rasterizar lo que se anima según el ritmo real entre cuadros. **Ya pasaba con el script anterior** (medido: 4 corridas de riven daban de 2 a 4 clips idénticos de 4).

**La voz ya no se atrasa (24/oct/2026).** Cada segmento llevaba su audio en AAC y el AAC añade su relleno (~35 ms), que al unirlos con `-c copy` se acumulaba: la voz iba 0,5 s tarde al final de 14 láminas. Los videos de `dra/` y `ultracode/` publicados antes tienen ese desfase. Ahora los segmentos son `.mov` con el audio en PCM y el AAC se codifica una sola vez, al unir; medido por correlación de cada lámina contra su clip de voz, el desfase máximo pasó de 0,46 s a 0,02 s. Si algún día se sospecha de la sincronía, esa es la prueba.

**El cuadro 0 de las recetas con `onUpdate`** (contador, partículas, gira, lottie y tres) salía con lo que hubiera pintado la reproducción automática al activarse la lámina, hasta el 22/oct/2026. `cuadros.mjs` regresaba la timeline con `pause(0)`, que por defecto no llama a los callbacks. Ahora es `pause(0, false)`. Lo destapó la prueba de Lottie: el primer cuadro de dos renders daba 37 dB, y con el arreglo los 301 salen idénticos.

**Recortes de páginas de Riot** (`tools/recortes.mjs <carpeta> [--solo=id,…] [--listar]`): lee `<carpeta>/recortes.json` (bloques de campeón u objeto con `partes` o `sinCita`, secciones por su h2, párrafos y la cabecera del artículo) y saca cada recorte a 600 px ×2 sin el banner de cookies, más **un PNG por renglón resaltado con su posición** en `assets/recortes/recortes.json`, para animar el marcatextos encima. Dos trampas resueltas: **no se captura con `captureBeyondViewport`** (puppeteer estira el viewport y el texto se reacomoda; se hace scroll hasta el bloque con un viewport de 2600 de alto) y se fuerza **`text-wrap: wrap`** (con `pretty` los cortes de renglón cambiaban al envolver la frase en un `<span>`). La frase se busca desde el final y si se repite en la lista marca la aparición anterior (la patada y el choque de Lee Sin).

**Estadísticas de partidos** (`tools/partidos.mjs <carpeta> --dia=AAAA-MM-DD [--zona=-6] [--liga=worlds] [--solo-dano]`): escribe `<carpeta>/partidos.json` con cada game terminado ese día —**contado en hora de CDMX** por defecto, porque el último partido de un día de Worlds en Allen ya cae en el día siguiente en UTC—: por equipo, lado, si ganó, oro, kills, torres, dragones (con su tipo), barones y daño; por jugador, rol, campeón, KDA, oro, CS, daño, % del daño del equipo y participación en kills; y la curva de la diferencia de oro por minuto. Fuentes y trampas:
- El calendario y los ids salen de la API de lolesports con **`LOLESPORTS_API_KEY` en `.env`** (la clave pública que manda la página de lolesports.com en `x-api-key`; aun siendo pública no se commitea). El resto sale del **feed en vivo** (`feed.lolesports.com/livestats/v1/window` y `/details`), que no pide clave y solo acepta tiempos en múltiplos de 10 s.
- **El feed no trae el daño en números**, solo el % dentro del equipo: el daño y la duración oficial salen de la API Cargo de Leaguepedia (`ScoreboardGames` + `ScoreboardPlayers`), emparejando el game por sus diez campeones. **Leaguepedia limita mucho a los anónimos** (el 23/10 respondió `ratelimited` durante más de diez minutos): sin respuesta, el archivo sale sin daño y se completa luego con `--solo-dano`, que reutiliza el feed guardado en `video-out/partidos-feed.json`. Su página de Scoreboards en HTML sí responde, pero no trae el daño.
- **El reloj del feed arranca antes del juego** (5 min 24 s antes en el IG–GEN del 23/10): la curva se corre con la duración oficial y, sin ella, con el primer cambio de oro menos 65 s (el oro pasivo arranca al 1:05), que quedó a menos de un minuto de la real en los siete games. `duracionFeed` es ese reloj crudo y **no es la duración del game**.
- El feed no dice quién tiró el nexo: en un Bo1 el ganador sale del resultado del calendario; en series largas, del que tiene más torres. Un partido cuyo game ya terminó puede seguir sin resultado unos minutos y se salta hasta que el calendario lo marque `completed`.

**Láminas para el montaje automático** (`tools/laminas.mjs <carpeta> [--crop=W:H:X:Y] [--quieto=s] [--fps=30] [--alfa | --alfa=webm] [--banda=abajo|arriba] [--sin-render]`): corre `capturar.mjs` y `cuadros.mjs` y corta cada `<section data-lamina="id">` en `video-out/laminas/<id>.mp4` (la animación completa + `quieto` s del último cuadro), `<id>.png` (el último cuadro) y `manifest.json`, recortados por defecto a `1080:1370:0:275`, el panel que va abajo del gameplay del prereel. Lo estrenó `lux/`. El manifest es `[{id, archivo, png, dur_anim, dur, alfa, caja, palabras}]`: los tres últimos campos se agregaron el 22/oct sin tocar los que ya lee ReelForge. `caja` es el panel en las claves de su montaje (`{ width, x: 'center', bottom }`, calculada del recorte y de la altura del deck) y `palabras` sale de un `data-palabras="k/da, kda"` opcional en la `<section>`.

**Capas con alfa** (`--alfa` en `cuadros.mjs`, `laminas.mjs` y `qa-anim.mjs`): las láminas salen **con transparencia** para ir encima del gameplay, en `.mov` ProRes 4444 (`yuva444p10le`) o, con `--alfa=webm`, en VP9 `yuva420p`, y el PNG final con alfa sale del último cuadro del propio clip. Chrome pinta sin fondo (`Emulation.setDefaultBackgroundColorOverride` en alfa 0; `optimizeForSpeed` conserva el alfa), se vacían los fondos de la página **y los de dentro del shadow DOM** de deck-stage (`:host` y `.canvas`, que una hoja de afuera no alcanza), y **todo lo que lleve `data-fondo` va con `display: none`**. Por eso los gen.js del montaje marcan sus fondos: en lux y graves los llevan las copias desenfocadas, los lavados, los rayos, el humo y los tintes a sangre; lo que es contenido (barrotes, arte a sangre como el de la prohibición o el cierre) se queda. Los clips van a `video-out/anim-alfa/`, aparte de los opacos. Lo aprendido:
- **ProRes va con `-qscale:v 9`**: sin tope de calidad un clip con la copia borrosa pesaba 580 MB. Con q9 da 49 dB contra 55,6 dB de q4 y el render de lux bajó de 3,1 GB a 702 MB; con los fondos apagados, las 11 láminas de lux pesan ~880 MB en `.mov`. El webm del mismo clip son 4 MB, pero no todos los editores leen su alfa.
- **Una lámina sin timeline sale como clip de un cuadro** en modo alfa: no hay PNG opaco que sirva para congelarla.
- Probado con `overlay=format=auto` sobre un video de prueba: sin rectángulos y con la duración completa.
- **`cuadros.mjs` no salía al terminar**: las conexiones keep-alive de Chrome dejaban vivo el servidor y `laminas.mjs` se quedaba esperando. Ahora corta las conexiones y sale con `process.exit(0)`.

Los MP4 salen con `+faststart` (el índice al principio): sin eso el navegador tenía que bajar la cola del archivo antes de reproducir.

**Música, efectos de sonido y loudness** (`tools/audio.mjs`, desde el 22/oct/2026). Al final del montaje `video.mjs` mezcla tres buses en un solo `amix`:
- **la voz**, tal como quedó en el video;
- **la música** (`"musica"` en el guion), recortada al largo del video, nivelada a `cama` LU bajo la voz (−12 por defecto) y agachada con `sidechaincompress` (`threshold=0.03:ratio=8:attack=20:release=400`) con la voz de llave;
- **los efectos**, que entran después del ducking para no agachar la música.

Luego mide el integrado y aplica la ganancia que falta para el `objetivo` (−16 LUFS por defecto), lineal, con un `alimiter` que deja el pico real bajo −1 dBTP. Lo aprendido:
- **No se aplica con `loudnorm`**: con `linear=true` se pasa solo a modo dinámico cuando el pico no le cabe y deshace la bajada de la música. Una ganancia fija con limitador es lineal siempre.
- **Los efectos se sintetizan en Node**, sin archivos ni licencias: *whoosh* (ruido con un pasabanda que barre), golpe (un seno que se hunde de 120 a 48 Hz), *ticks* (clics espaciados como un `power2.out`) y *pop*, con el PRNG del kit. El bus se escribe entero en un WAV con cada efecto en su muestra, así que no hay `adelay`: su relleno sale sin marcas de tiempo en ffmpeg 8.1 y adelantaba lo que venía después.
- **El momento sale de la timeline**: `efecto()` y `cuenta()` ponen `sfx:<receta>` donde se ve lo que suena (el sello, al caer), `cuadros.mjs` las junta en `anim.json` (también las de timelines anidadas) y `video.mjs` las suma al arranque de cada lámina en `tiempos.json`. Uno por lámina como máximo.
- **Solo se mezcla si hay algo que mezclar** (música, efectos o `"loudness"` en el guion): un video de solo voz sale igual que antes.
- La pista con licencia de uso **no entra al repo**: va con ruta absoluta o `MUSICA_DIR`, y en `tools/audio/` solo van pistas CC0 con su `CREDITOS.md`.
- **Medido**: con señales sintéticas la cama baja 15 dB mientras suena la voz y la mezcla queda en −16,0 y −14,0 LUFS (picos de −4,2 y −2,2 dBTP). En semana38, con música de Mixkit tomada de fuera, salieron −16,0 LUFS, −1,9 dBTP, la misma duración de audio y video, y los tres *ticks* a 0,5 ms de su etiqueta.

**Transiciones** (`tools/transiciones.mjs`; las láminas enlazadas con `data-continua` van con corte seco sin pedirlo): `"transicion": "smoothleft"` en `guion.json` —o `{ "tipo": "circleopen", "dur": 0.4 }`; global, o por lámina en `slides[i].transicion` para la que entra a esa lámina, con `"corte"` para un corte seco— une los segmentos con `xfade` de ffmpeg (las 57 que trae la 8.x) en vez del `concat` seco. Cada segmento se alarga congelando su último cuadro lo que dura la transición que lo sigue, y el xfade arranca justo cuando empieza la narración de la lámina siguiente: **la duración total no cambia**, así que `tiempos.json` y los subtítulos siguen valiendo. El audio no pasa por xfade; se concatena aparte. Probado con segmentos sintéticos (rojo 2 s, verde 1,5 s, azul 2,5 s): 6,000 s exactos y cada transición empieza en el segundo justo. Un nombre mal escrito falla antes de pedir la voz.

### Elegir la voz

`node tools/fish-voces.mjs` tiene tres modos:

```
node tools/fish-voces.mjs                      # las voces ya guardadas, con su id
node tools/fish-voces.mjs buscar narrador --es # busca en el catálogo, ordenado por ♥
node tools/fish-voces.mjs probar narrador-v2   # genera una muestra mp3 para oírla
```

El `_id` que imprime va en el campo `voz` de `guion.json`. Las muestras caen en
`video-out/voces/`, que está ignorado.

**Las voces del catálogo funcionan con el modelo gratuito y con timestamps** —
comprobado contra `/v1/tts/stream/with-timestamp`, que es el que usa `video.mjs`:
devuelve los segmentos con su tiempo, así que **los subtítulos karaoke salen
igual con una voz del catálogo que con una propia**. No hace falta clonar nada
ni pagar para tener narración con subtítulos.

⚠️ **Las favoritas de la cuenta NO se pueden listar por API.** Se probaron
`/model?self=true` (devuelve 0 porque solo lista modelos propios), `/model/bookmark`
y `/bookmark`: no existen. Por eso `fish-voces.mjs` lleva un **registro a mano**
en la constante `GUARDADAS` — se busca la voz una vez y se apunta su id ahí.
Hoy tiene `narrador-v2` (`35199d5438854f5d9157c500479ab684`, 4 818 ♥) para la
serie de lore, que **no sirve para Cumplelolero**: es voz de narrador serio y
ese guion es de albur.

### Lo que la API de Fish Audio sí y no da (probado el 16/09/2026)

| | Estado |
|---|---|
| TTS con `s2.1-pro-free` + timestamps | ✅ **gratis**, es lo que usa `video.mjs` |
| Voces del catálogo por `reference_id` | ✅ gratis, con timestamps |
| **ASR / voz a texto** (`POST /v1/asr`) | ❌ **cobra**: devuelve `402 Insufficient API credit` y el saldo está en `$0.000000` |
| Clonar voz con *reference audio* en la llamada | ❓ probablemente gratis: devolvió `400 Reference Audio is not valid` con una muestra falsa, **no 402**. Falta probarlo con una grabación real |
| **Imágenes y video** | ❌ **no hay API**. El «Imagen y video» de la barra lateral de fish.audio es solo de la app web; el esquema REST solo expone voz |

El ASR sería lo que permitiría **grabar su propia voz y sacar los subtítulos
karaoke solos** —hoy los timestamps solo existen si el audio lo generó el TTS—,
pero hace falta meter crédito. El CRUD de modelos está en `/model`, no en
`/v1/models` como dice la doc (ese devuelve 404).

