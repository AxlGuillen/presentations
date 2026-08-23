# CLAUDE.md

Portafolio de presentaciones web (decks HTML) servido como sitio estático en Vercel. Repo público: `AxlGuillen/presentations`. Proyecto Vercel: `presentations` → https://presentations-three-phi.vercel.app

## Arquitectura

Sin build, sin dependencias, sin framework. Una carpeta por presentación, autocontenida:

```
tabletas/   index.html + deck-stage.js + support.js + assets/
soloq/      index.html + gen.js + deck-stage.js + assets/
estancia/   index.html + gen.js + deck-stage.js   (sin assets: todo es CSS)
ornn/       index.html + gen.js + deck-stage.js + assets/
index.html  galería raíz con las cards
```

`deck-stage.js` está **duplicado a propósito** en cada carpeta. Es lo que mantiene cada deck independiente: se puede copiar una carpeta a otro sitio y funciona sola. No lo centralices en la raíz.

Todas las rutas dentro de un deck son **relativas** (`assets/foo.png`, nunca `/assets/foo.png`). De ahí que `vercel.json` tenga `trailingSlash: true`: sin la barra final, `/soloq` resolvería los assets contra la raíz del sitio y darían 404. Si alguna vez se quitan las barras finales, se rompen las imágenes de todos los decks.

## Regla crítica: generado vs. escrito a mano

| Archivo | Origen |
|---|---|
| `soloq/index.html` | **GENERADO** por `soloq/gen.js`. Nunca lo edites a mano: edita `gen.js` y corre `node soloq/gen.js`. Los datos (premios, salarios mínimos, tipos de cambio) están arriba de ese archivo. |
| `estancia/index.html` | **GENERADO** por `estancia/gen.js`. Mismo trato que soloq: edita el generador y corre `node estancia/gen.js`. El alcance acordado está documentado en el comentario de cabecera de `gen.js`: 8 diapositivas de primer contacto, **sin app para padres** (el seguimiento a papás queda deliberadamente por definir). |
| `ornn/index.html` | **GENERADO** por `ornn/gen.js`. Los splash arts vienen de Data Dragon; el cuadro de Hefesto es *La fragua de Vulcano* de Velázquez (dominio público, Wikimedia). |
| `tabletas/index.html` | Escrito a mano (exportado de Claude Design). No tiene generador; se edita directo. |
| `index.html` raíz, `404.html` | A mano. |

## Runtime de los decks

`deck-stage.js` define el custom element `<deck-stage width height>`; las diapositivas son `<section>` hermanas con estilos inline. Aporta navegación por teclado, escalado automático al viewport, barra de miniaturas, `@media print` (una slide por página) y speaker notes vía `data-speaker-notes`.

Cada deck añade un botón "Presentar · P" que hace `postMessage({__omelette_presenting: true})` — el runtime ya escuchaba ese mensaje y oculta miniaturas y pie de navegación. No hace falta tocar `deck-stage.js` para eso.

Tamaños de diseño: **tabletas 1920×1080**, **soloq 1080×1920**.

## Verificar que nada desborda

Las diapositivas tienen altura fija; si el contenido crece, se corta al exportar o presentar. Tras cualquier cambio de contenido, con el deck abierto en el navegador:

```js
[...document.querySelectorAll('deck-stage section')]
  .map((s, i) => ({ i: i + 1, label: s.dataset.label, over: s.scrollHeight - ALTURA_DISEÑO }))
  .filter(x => x.over > 2)
```

Debe devolver vacío. Si algo desborda, ajusta padding/margen **solo en esa diapositiva** (en `gen.js` si es soloq).

## Identidad visual

- **tabletas** — fondo blanco, rojo `#C31722`, gris oscuro `#16181D`, tipografía Barlow. Corporativo, sobrio.
- **soloq** — fondo `#0B0B0B`, verde neón `#53FC18`, amarillo `#E9FF1F`, General Sans (Fontshare). Títulos en MAYÚSCULAS itálicas peso 800 con gradiente blanco→55%, tarjetas con radio asimétrico `34px 0`. Estilo esports, tomado de soloqchallenge.gg.
- **estancia** — propuesta comercial para **La Casita Feliz** (CAI). La paleta sale del logo del cliente: crema `#FFF9FA`, morado `#5B2168` / `#7B2E8E`, rosa `#E94B85`, verde `#6CBE45` / `#2FA84F`, amarillo `#FFC510`, café `#8D5B3F`, tipografía Poppins. El logo va como marca de agua al 5–7% en todas las diapositivas vía `marca()`; se pinta con `background-image` **a propósito**, para que si el archivo falta no se vea nada roto.
- **ornn** — apoyo visual para video vertical de TikTok, no deck de lectura. Negro forja `#0B0605`, carmesí `#C0272D`, brasa `#FF6B1A`, oro `#FFA23A`, Bebas Neue para cifras y titulares. El contenido va en una banda central (`padding: 300px 84px 350px`) para que la interfaz de TikTok no tape nada: **si tocas esos márgenes, revisa que todo siga dentro de la zona segura**.
- **galería y 404** — fondo `#0D0E12`, Barlow, cards con la portada de cada deck.

## Agregar una presentación

1. `nuevo/` con `index.html` + `assets/` (rutas relativas) + copia de `deck-stage.js`.
2. Card en el `index.html` raíz — hay un bloque comentado de plantilla.
3. Actualiza la tabla de estructura del README.

## Notas de entorno

- Shell primario: PowerShell en Windows. Al escribir archivos con contenido acentuado desde PowerShell, usa UTF-8 **sin BOM** (`New-Object System.Text.UTF8Encoding($false)`); si no, salen mojibake tipo `tÃ©cnico`.
- El repo es **público**: nunca commitees API keys (ver `docs/video-narrado.md`, que necesitará una de ElevenLabs en `.env`).
- Deploy: push a `main` → Vercel despliega solo. Verifica en producción con `curl -sI` sobre `/`, `/tabletas/`, `/soloq/` y algún asset antes de dar por cerrado un cambio de estructura.

## Roadmap

`docs/video-narrado.md` — convertir decks en MP4 narrado con subtítulos vía ElevenLabs con timestamps. Propuesta cerrada, sin implementar.
