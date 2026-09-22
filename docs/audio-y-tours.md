# Feature propuesta: capa de audio y tours guiados

> Estado: **propuesta, sin implementar**. Documentado el 22/sep/2026, después de
> entregar el primer video narrado (`semana38`, 1:50, voz fija y sin subtítulos).

Dos ideas que salieron al entregar ese video. La primera es incremental y se
puede hacer ya; la segunda es un producto nuevo y queda para más adelante.

---

## 1 · Sonido: efectos sutiles y música de fondo

Hoy el video lleva **solo voz**. Falta la capa que lo hace sentir producido:
una música tenue por debajo y algún efecto puntual cuando la animación lo pide.

### Por qué es viable con lo que ya hay

Las tres piezas necesarias existen:

| Pieza | Dónde está |
|---|---|
| Los filtros de audio | `ffmpeg` local ya trae `sidechaincompress`, `amix`, `adelay`, `afade` y `loudnorm` — verificado |
| Cuándo empieza cada lámina en el video final | `video-out/tiempos.json` → `{slide, ini, dur}` en segundos absolutos |
| Cuándo ocurre cada animación dentro de la lámina | `video-out/anim/anim.json` → `{fps, clips:[{slide, dur, cuadros}]}` |

Y sobre todo: **las timelines de GSAP son deterministas** (`cuadros.mjs` las
recorre con seeks exactos). Si la barra crece siempre en el mismo instante, el
efecto se puede clavar ahí sin ensayo y error.

### Música de fondo con ducking

El problema clásico es que la música tape la voz. Se resuelve con
`sidechaincompress`: la pista baja sola cuando hay narración y vuelve a subir
en los silencios, sin automatizar nada a mano.

```bash
ffmpeg -i video-sin-musica.mp4 -i cama.mp3 -filter_complex \
  "[1:a]aloop=loop=-1:size=2e9,volume=0.18[m]; \
   [m][0:a]sidechaincompress=threshold=0.04:ratio=8:attack=20:release=400[duck]; \
   [duck][0:a]amix=inputs=2:duration=first:dropout_transition=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac video.mp4
```

Referencia de niveles: la voz manda a unos −16 LUFS y la cama se queda entre
**−26 y −30 LUFS**; con el ducking activo baja otros 8–10 dB mientras se habla.
Conviene cerrar con `loudnorm` para que todos los videos salgan al mismo volumen.

### Efectos puntuales

La regla que evita el ridículo: **un efecto por lámina como máximo**, y solo
donde hay un gesto visual que lo justifique.

| Gesto que ya existe | Efecto | Cuándo |
|---|---|---|
| Titular partido en palabras | *whoosh* muy corto | al inicio de la timeline |
| Barras que crecen / dona que se traza | *swell* suave | con el tween de las barras |
| Contadores (`data-cuenta`) | *ticks* muy bajos | durante el conteo |
| Checkmarks con `back.out` | *pop* seco | en el stagger |
| Cambio de lámina | *transición* apenas audible | en el corte |

El tiempo absoluto de cada efecto sale de sumar: `tiempos[i].ini + LEAD (0,35 s)
+ el offset dentro de la timeline`. Ese offset ya está escrito en el `gen.js`,
en el tercer argumento de cada `tl.from(...)`.

**Cómo se declararía.** Lo más simple es extender `guion.json`, que ya es el
sitio donde se configura el video:

```json
{
  "musica": { "pista": "cama-sobria.mp3", "volumen": 0.18 },
  "slides": [
    { "slide": 1, "texto": "…", "sfx": [{ "en": 0.35, "sonido": "whoosh" }] },
    { "slide": 2, "texto": "…", "sfx": [{ "en": 0.8, "sonido": "swell" }] }
  ]
}
```

Y en `tools/video.mjs`, un paso más antes del montaje final que construya un
`amix` con todos los efectos retrasados con `adelay`.

### De dónde sale el audio (ojo: el repo es público)

Solo material **CC0 o dominio público**, nunca "gratis para uso personal":

- **Pixabay Audio** y **Freesound** filtrando por CC0.
- La **YouTube Audio Library** sirve para YouTube, pero su licencia no cubre
  redistribuir el archivo en un repo público — no vale aquí.

Los archivos irían en `tools/audio/` con un `CREDITOS.md` al lado, como ya se
hizo con las fotos de `caps/`. Son pocos KB y se reutilizan en todos los videos,
así que no crecen con cada deck.

### Riesgos

- **Saturar.** El reporte semanal es un documento de trabajo, no un tráiler. Si
  hay duda, se deja solo la música.
- **Peso.** La música sube el MP4 un poco; el video ya vive en el repo, así que
  conviene vigilar que no se acumulen versiones.
- **Licencias.** Es lo único que puede dar un problema real. Sin `CREDITOS.md`
  con el enlace y la licencia de cada archivo, no entra.

---

## 2 · Tours guiados y videos de QA

La idea: usar el mismo pipeline para explicar **lo que se agregó**, no lo que se
trabajó. En vez de un reporte de horas, un recorrido por la funcionalidad nueva.

Dos formatos:

- **Video de QA.** Al cerrar una issue, un clip corto que muestre el antes y el
  después y diga qué revisar. Sustituye al "ya quedó, pruébalo" de Jira, y queda
  adjunto al ticket.
- **Side tour / tour de producto.** Un recorrido por una funcionalidad nueva
  para clientes o para el equipo: qué cambió, dónde está y para qué sirve.

### Qué faltaría

Lo que hoy no existe y habría que resolver:

- **Capturar la aplicación real, no un deck.** El pipeline actual parte de
  `<section>` estáticas. Para un tour hay que grabar la app en uso — navegar,
  hacer clic, mostrar el resultado. Puppeteer ya se usa en `capturar.mjs`, así
  que la base está, pero grabar una sesión es otro problema.
- **Resaltar lo que importa.** Un tour necesita señalar: recuadros, zoom sobre
  un área, un cursor visible. Eso es composición de video, no captura.
- **El guion.** Para el reporte sale de los worklogs. Para un tour tendría que
  salir de la descripción de la issue y del PR, que son bastante más pobres.

No es una extensión del módulo de video: es un producto aparte que reutilizaría
la voz y el montaje. Anotado para cuando haya un caso concreto que lo pida.
