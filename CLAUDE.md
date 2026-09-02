# CLAUDE.md

Portafolio de presentaciones web (decks HTML) servido como sitio estático en Vercel. Repo público: `AxlGuillen/presentations`. Proyecto Vercel: `presentations` → https://presentations-three-phi.vercel.app

## Arquitectura

Sin build, sin dependencias, sin framework. Una carpeta por presentación, autocontenida:

```
tabletas/   index.html + deck-stage.js + support.js + assets/
soloq/      index.html + gen.js + deck-stage.js + assets/
estancia/   index.html + gen.js + deck-stage.js + assets/ (solo og.png)
ornn/       index.html + gen.js + deck-stage.js + assets/
urgot/      index.html + gen.js + deck-stage.js + assets/
talon/      index.html + gen.js + deck-stage.js + assets/
blitzcrank/ index.html + gen.js + deck-stage.js + assets/
malphite/   index.html + gen.js + deck-stage.js + assets/
mundo/      index.html + gen.js + deck-stage.js + gsap.min.js + assets/
skins/      index.html + gen.js + deck-stage.js + assets/
caras/      index.html + gen.js + deck-stage.js + assets/
semana34/   index.html + gen.js + deck-stage.js + gsap.min.js + assets/ (solo og.png)
semana35/   index.html + gen.js + deck-stage.js + gsap.min.js + assets/ (solo og.png)
index.html  galería raíz con las cards
```

`deck-stage.js` está **duplicado a propósito** en cada carpeta. Es lo que mantiene cada deck independiente: se puede copiar una carpeta a otro sitio y funciona sola. No lo centralices en la raíz.

Todas las rutas dentro de un deck son **relativas** (`assets/foo.png`, nunca `/assets/foo.png`). De ahí que `vercel.json` tenga `trailingSlash: true`: sin la barra final, `/soloq` resolvería los assets contra la raíz del sitio y darían 404. Si alguna vez se quitan las barras finales, se rompen las imágenes de todos los decks.

## Regla crítica: generado vs. escrito a mano

| Archivo | Origen |
|---|---|
| `soloq/index.html` | **GENERADO** por `soloq/gen.js`. Nunca lo edites a mano: edita `gen.js` y corre `node soloq/gen.js`. Los datos (premios, salarios mínimos, tipos de cambio) están arriba de ese archivo. |
| `estancia/index.html` | **GENERADO** por `estancia/gen.js`. Mismo trato que soloq: edita el generador y corre `node estancia/gen.js`. El alcance acordado está documentado en el comentario de cabecera de `gen.js`: 10 diapositivas de primer contacto, **sin app para padres** (el seguimiento a papás queda deliberadamente por definir). Incluye 2 láminas del paquete mensual de redes sociales (Andrea Hasly Guillen Luna) justo después de la web: web y redes son «hacia afuera», el sistema es «hacia adentro». |
| `ornn/index.html` | **GENERADO** por `ornn/gen.js`. Los splash arts vienen de Data Dragon; el cuadro de Hefesto es *La fragua de Vulcano* de Velázquez (dominio público, Wikimedia). |
| `urgot/index.html` | **GENERADO** por `urgot/gen.js`. Serie Cumplelolero, mismo formato que ornn. Splashes de Data Dragon; el splash pre-rework viene de la wiki de LoL (`urgot-viejo.jpg`). |
| `talon/index.html` | **GENERADO** por `talon/gen.js`. Serie Cumplelolero #3. Splashes de Data Dragon; paleta muestreada del splash original (noche azul + filo cian `#6FC7F0`). |
| `blitzcrank/index.html` | **GENERADO** por `blitzcrank/gen.js`. Serie Cumplelolero #4. Splashes de Data Dragon. Sigue el guion del video, que es **doble con Malphite** — de ahí la lámina de cierre. Dos datos de la investigación quedaron fuera **a propósito**, porque el guion no los narra: la trilogía Oxidado/Oxidadote/Oxidadísimo y que nunca tuvo sequía de skins. |
| `malphite/index.html` | **GENERADO** por `malphite/gen.js`. Serie Cumplelolero #5 y **segundo bloque del mismo video que blitzcrank** — de ahí que la portada diga «segundo cumpleañero» y el cierre anuncie a Dr. Mundo y Janna. La skin que el guion llama «Malphite WhatsApp» es **Malphite Trébol** (Shamrock), que está en bóveda y por eso va aparte de las 8 comprables. |
| `mundo/index.html` | **GENERADO** por `mundo/gen.js`. Serie Cumplelolero #6 y **el primero de la serie animado con GSAP**: cada lámina registra su coreografía con `animar()`. La lámina de la sequía es la pieza del deck (carril que se dibuja, once skins en cascada, banda roja que crece y la marca del rework cayendo dentro). Ojo con el dato: la sequía es de **skins comprables** — Príncipe del Hielo salió en 2018, dentro del hueco, pero está en bóveda. |
| `skins/index.html` | **GENERADO** por `skins/gen.js`. Serie «Datos curiosos», mismo formato TikTok que Cumplelolero. Los collages usan tiles de pantalla de carga de Data Dragon; los mapas nombre→num están hardcodeados en gen.js. |
| `caras/index.html` | **GENERADO** por `caras/gen.js`. Serie «Datos curiosos» #2 — las skins más caras. Splashes de Data Dragon; la skin de Caps (Tristana) está marcada como filtración a propósito. |
| `semana34/index.html` | **GENERADO** por `semana34/gen.js`. Reporte semanal de Jira (18–24 ago 2026); los datos vienen de los worklogs y están fijos en el generador. Usa `tools/kit.cjs` en build-time. |
| `semana35/index.html` | **GENERADO** por `semana35/gen.js`. Reporte semanal de Jira (25–31 ago 2026), **v2.0 de la coreografía**. Los datos están fijos arriba del generador; tres worklogs de UWS-9283 se recuperaron del changelog de `timespent` porque la API de búsqueda corta en 20 worklogs por issue. |
| `tabletas/index.html` | Escrito a mano (exportado de Claude Design). No tiene generador; se edita directo. |
| `index.html` raíz, `404.html` | A mano. |

## Runtime de los decks

`deck-stage.js` define el custom element `<deck-stage width height>`; las diapositivas son `<section>` hermanas con estilos inline. Aporta navegación por teclado, escalado automático al viewport, barra de miniaturas, `@media print` (una slide por página) y speaker notes vía `data-speaker-notes`.

Cada deck añade un botón "Presentar · P" que hace `postMessage({__omelette_presenting: true})` — el runtime ya escuchaba ese mensaje y oculta miniaturas y pie de navegación. No hace falta tocar `deck-stage.js` para eso.

**Pasos dentro de una slide** (opt-in): elementos con `data-step="1"`, `"2"`… se revelan por etapas con la navegación normal — → revela el siguiente paso, ← lo oculta; agotados los pasos se cambia de slide. Al llegar avanzando la slide arranca en 0 pasos; al regresar llega con todos. La ocultación es `visibility` (no mueve layout), miniaturas e impresión muestran siempre todo, y `capturar.mjs`/`cuadros.mjs` revelan todo antes de capturar (PNG y video llevan la slide completa). Cada cambio emite `stepchange` (bubbles) con `{slide, step, previousStep, total}`; el pegamento `kit.animador()` ya anima por defecto los elementos recién revelados. Ejemplo: las columnas del tablero en `semana34`. Sin `data-step` el comportamiento es idéntico al de siempre.

Tamaños de diseño: **tabletas 1920×1080**, **soloq 1080×1920**.

## Carga de assets

Los decks pesan megabytes en imágenes y todas las diapositivas viven en el DOM a la vez (las inactivas se ocultan con `visibility: hidden` **a propósito**, para no perder estado de videos/iframes). Sin más, el navegador descargaba **todo** al entrar: soloq 3,8 MB, tabletas 4,2 MB.

**El diferido se hace en build-time, no en runtime.** El preload scanner del navegador dispara las peticiones de `<img src>` antes de que corra una sola línea de JS, así que interceptar desde `deck-stage.js` no evita la descarga: hay que no emitir el `src`. De eso se encarga `kit.diferir(html)`, que se aplica al final de cada `gen.js`:

```js
fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
```

Deja intacta la **primera** diapositiva (que además es lo que capturan `portadas.mjs` y `og.mjs`) y en el resto convierte `src="assets/…"` en `data-src` y el `background-image` en línea de la `<section>` en un atributo `data-bg`. Es idempotente y delimita por las propias `<section>`, no por el contenedor, porque `tabletas` las envuelve en `<x-import>` en vez de `<deck-stage>`. `tabletas/index.html` está escrito a mano: se le aplicó una vez y hay que mantener los `data-src` al editarlo.

`deck-stage.js` los hidrata en tres momentos: al activarse una diapositiva **y sus vecinas** (para que → no espere red), al materializarse su miniatura en el rail, y todas de golpe en `beforeprint` o vía `ds.cargarTodo()`.

**El rail va detrás de la cortina.** Las miniaturas son clones y hidratarlas al vuelo devolvía todo el peso al primer paint; ahora se encolan y se vacían en tiempo ocioso una vez levantada la cortina. Sin esa cola el diferido casi no se nota en decks cortos, donde todos los thumbs caben en pantalla.

Coste hasta ver la primera lámina, medido con `node tools/qa-peso.mjs <carpeta…>`:

| Deck | Antes | Después |
|---|---|---|
| tabletas | 4 203 KB | **380 KB** |
| soloq | 3 792 KB | **365 KB** |
| blitzcrank | 3 163 KB | **477 KB** |
| ornn | 3 091 KB | **1 070 KB** |
| skins | 4 074 KB | **1 600 KB** |

### La cortina de carga

`deck-stage.js` monta un overlay en su shadow DOM con el monograma **4XL** inline (nada que pedir a la red, el deck sigue autocontenido) sobre el carbón de La cartelera `#16130E`, con una barra de progreso ámbar `#E8B54D`. Espera a **todo lo que pinta la primera diapositiva** — sus `<img>` y también el `url()` del `background-image`, porque media serie Cumplelolero tiene la portada como fondo de la `<section>`. Techo duro de 3 s para que una imagen colgada no deje el deck tapado, y se suprime en **modo presentación**, que es lo que activan las cuatro herramientas de `tools/` antes de capturar: por eso nunca sale en un PNG.

Si un deck nuevo no emite `data-src`, no se rompe nada — simplemente carga como antes.

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
- **urgot** — serie Cumplelolero, mismo formato TikTok que ornn (banda central 300/350). Acero de Zaun `#070A09`, verde ácido `#96E32E`, rojo `#D8342C` para traición/sequía, Bebas Neue. Mantener Bebas Neue y la banda segura en toda la serie Cumplelolero para que los videos se vean de la misma familia.
- **talon** — serie Cumplelolero #3, mismo formato TikTok (banda 300/350, Bebas Neue). Noche `#07080F`, filo cian `#6FC7F0`, azul `#2E5F94`, carmesí Noxus `#C43048` para la sequía, dorado `#E8B84B` para logros y el bloque de latinos.
- **semana35** — misma paleta y tipografía que semana34 **a propósito**: son una serie, lo que cambia es la coreografía (v2.0). Añade gris `#B3BAC5` para la semana anterior en la comparativa y una escala de azules para los arcos de la dona.
- **semana34** — reporte semanal de trabajo, paleta Jira/Atlassian: azul `#0052CC` sobre blanco, tinta navy `#172B4D`, lavado `#DEEBFF`, tipografía Figtree. Textura de puntitos y sombras en capas vía `tools/kit.cjs`. Semánticos aparte del acento: verde `#00875A` (hecho), ámbar `#974F0C` (espera), rojo `#DE350B` (regresó de QA).
- **blitzcrank** — serie Cumplelolero #4, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: noche de Zaun `#0A0A18`, violeta eléctrico `#8F6DFF` (los arcos que le dan el nombre), latón `#D9913C` para dinero y logros, verde químico `#3FC38A` solo en el lore.
- **malphite** — serie Cumplelolero #5, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: basalto `#120D12`, terracota de arenisca `#E08A72` (su cuerpo), verde `#B5CE45` (lo único vivo de la lámina: su mirada) para lore y remates, arena `#EBC27C` para dinero y óxido `#C4564E` para el elo del one trick — aquí el color de alerta marca el rango bajo, al revés que el dorado de logro en talon y blitzcrank.
- **mundo** — serie Cumplelolero #6, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: laboratorio `#140A17`, suero morado magenta `#C455E0` (su piel) como acento, cian de su lengua `#4FC9D8` para cifras y dinero, y rojo de alerta médica `#E0483F` para la sequía y el elo. Es el único deck de la serie con animación.
- **skins** — serie «Datos curiosos» #1, formato TikTok (banda 300/350, Bebas Neue). Violeta `#0B0714`, oro `#F5C042` para el dinero, magenta `#E75FB4`, rojo `#E0475B` para lo bloqueado (tiles en escala de grises).
- **caras** — serie «Datos curiosos» #2, misma identidad que skins (violeta `#0B0714`, oro `#F5C042`, magenta `#E75FB4`) + rojo `#E0475B` para lo escandaloso. Formato TikTok (banda 300/350, Bebas Neue).
- **galería** — «La cartelera» (línea en `docs/linea-diseno-galeria.md`, diseño en `docs/diseno-galeria/`): carbón cálido `#16130E`, hueso `#EDE8DD`, ámbar `#E8B54D` solo en chrome; Bricolage Grotesque + Archivo + Spline Sans Mono. Pantalla de proyección que rota (portadas JPG reales en `/portadas/`, se regeneran con `node tools/portadas.mjs`) y cada deck tiñe la página con su acento vía `--deck-acento`/`--deck-glow`. Las filas se agrupan por el campo `grupo` («Profesional» y «Creador de contenido»), en el orden del array. Los datos están en el array `DECKS` del propio index.html: al agregar un deck, añade su entrada ahí y corre portadas.mjs. La marca **4XL** vive en `marca/` (fuente SVG) y `favicon.svg`/`favicon.ico` en la raíz — el `.ico` cubre todos los decks sin tocarlos; el monograma va como marca de agua al 4.5% en la esquina de la pantalla de proyección.
- **404** — aún con la identidad vieja (fondo `#0D0E12`, Barlow); pendiente de migrar a La cartelera.

## Agregar una presentación

Usa el skill `nuevo-deck`, que encapsula el flujo completo. En corto:

1. `nuevo/` con `index.html` + `assets/` (rutas relativas) + copia de `deck-stage.js`.
2. Entrada en el array `DECKS` del `index.html` raíz + `node tools/portadas.mjs <carpeta>` para su portada.
3. Actualiza la tabla de estructura del README.

## Skills del proyecto (.claude/skills/)

- **nuevo-deck** — scaffold de una presentación nueva (carpeta, gen.js, card, docs).
- **verificar-deck** — desbordes + revisión visual + captura real en Chrome (la verificación de GSAP va ahí: el Browser pane embebido no corre rAF).
- **guion-video** — escribir `guion.json` y generar el MP4 narrado.
- **gsap-core / gsap-timeline / gsap-performance / gsap-utils** — oficiales de GreenSock para escribir coreografías (ver sección de Animación).

## Kit de diseño (tools/kit.cjs)

Helpers de **build-time** para los `gen.js`: texturas (puntitos, grano `feTurbulence` como data-URI, lavados y mallas de gradiente), sombras en capas y diagramas — `kit.diagrama(codigoMermaid, config)` renderiza Mermaid a **SVG inline** vía `tools/diagrama.mjs` (Chrome del sistema + `tools/vendor/mermaid.min.js`); pásale la paleta del deck en `config.themeVariables` para que el diagrama no salga con el tema default. También expone `kit.diferir(html)` (ver «Carga de assets»). Se importa con `require('../tools/kit.cjs')` y devuelve strings de CSS que se incrustan en el HTML generado — **el deck sigue autocontenido, cero dependencias en runtime**. Es `.cjs` a propósito: `tools/package.json` declara `"type": "module"` y los `gen.js` son CommonJS. La sofisticación visual nueva entra por aquí (o por librerías vendorizadas por carpeta, como `deck-stage.js`), nunca por CDN ni npm en runtime.

## Animación (GSAP, opcional por deck)

La copia maestra vive en `tools/vendor/gsap.min.js` (v3.12.5). Para animar un deck: **copia** `gsap.min.js` a su carpeta (vendorizado, como `deck-stage.js`) y en el `gen.js` incluye al final del body `<script src="./gsap.min.js"></script>` seguido de `${kit.animador()}`. Con solo eso, cada slide obtiene una entrada por defecto sobre los grupos `data-a`. Para coreografías propias se registra `animar('<data-label de la slide>', (tl, s) => { tl.from(...); })` en un script posterior; `cuenta(tl, el, pos)` anima contadores sobre elementos con `data-cuenta`/`data-sufijo` (semana34 es el ejemplo de referencia).

Reglas: los estados iniciales se ponen con `tl.from()`, **nunca ocultando en CSS** — sin JS el deck se ve completo y la impresión a PDF funciona. `prefers-reduced-motion` salta al final. Las timelines quedan en `section.__tl` y son seekeables (`tl.time(t)`) pensando en el futuro render de video cuadro a cuadro. Si una timeline supera ~1.8s, sube la espera en `tools/capturar.mjs` (hoy **2600 ms**) para que la captura tome el estado final. `node tools/qa-anim.mjs <carpeta> <nSlide> [t1,t2,…]` seekea la timeline de una lámina a los tiempos que le pidas y guarda un PNG por cada uno: sirve para revisar la coreografía a mitad de camino y para comprobar que es determinista antes del render de video.

En `.claude/skills/` están los skills oficiales de GreenSock (MIT, instalados con `npx skills add greensock/gsap-skills`): **al escribir o revisar coreografías carga `gsap-timeline`** (secuenciación y position parameter) y `gsap-core` (tweens, eases, stagger); `gsap-performance` para animaciones que tiemblan o pensando en el render de video, y `gsap-utils` para helpers (snap, mapRange, random determinista). No instalamos `gsap-scrolltrigger` (los decks no scrollean) ni `gsap-react`/`gsap-frameworks` (aquí todo es vanilla).

## Módulo de video (tools/)

`node tools/video.mjs <carpeta>` convierte un deck en `video-out/video.mp4` narrado con subtítulos: lee `<carpeta>/guion.json` (textos por slide + `voz` de Fish Audio), captura las diapositivas con `tools/capturar.mjs` (Chrome del sistema vía puppeteer-core, con rutas para macOS y Windows), pide la voz a Fish Audio (`s2.1-pro-free`, **gratis**; el modelo `s1` cobra) con timestamps palabra a palabra, y monta con ffmpeg. **Si el deck usa GSAP** (existe `<carpeta>/gsap.min.js`), `tools/cuadros.mjs` renderiza además las timelines **cuadro a cuadro** — seeks exactos con `section.__tl.time(t)` a 30 fps, determinista, sin frames perdidos — en clips `video-out/anim/anim-NN.mp4`, y cada slide entra animada al video congelando su último cuadro el resto de su narración (las slides sin timeline siguen con PNG estático). Se puede correr suelto: `node tools/cuadros.mjs <carpeta> [fps]`. La narración acepta **etiquetas de expresión entre corchetes** en el texto del guion (`[excited]`, `[break]`, `[whispering]`…, no salen en los subtítulos) y `guion.json` admite `voz` (reference_id, buscar con `tools/fish-voces.mjs`), `velocidad`, `temperatura`, y `"subtitulos": "karaoke"` — **subtítulos estilo TikTok**: líneas de 3 palabras centradas donde la palabra hablada se pinta con `"acento"` (#RRGGBB del deck) usando los timestamps reales, vía ASS/libass. El detalle vive en el skill `guion-video`. Requiere `FISH_API_KEY` en `.env` (nunca al repo) y `npm install` dentro de `tools/`. Las salidas `video-out/` están ignoradas; para publicar un video se copia a mano a la carpeta del deck y se enlaza desde su card (hoy ningún deck publica video).

## Cards al compartir (Open Graph)

Cada deck (y la galería raíz) lleva metas OG/Twitter en el `<head>` para que el enlace salga con card y preview en WhatsApp/Slack/X. En los generados las emite `kit.og({ titulo, descripcion, carpeta })`; en `tabletas/index.html` y la raíz están pegadas a mano. La imagen es `<carpeta>/assets/og.png` (raíz: `/og.png`), 1200×630, **committeada** porque las metas apuntan a su URL absoluta en producción (`kit.PROD`). Se genera con `node tools/og.mjs <carpeta|raiz>` desde la primera diapositiva (horizontales: recorte centrado; verticales: portada sobre sí misma desenfocada) — **regenérala si cambia la portada del deck**. Las previews solo se ven tras deployar a `main`.

## Notas de entorno

- Shell primario: PowerShell en Windows. Al escribir archivos con contenido acentuado desde PowerShell, usa UTF-8 **sin BOM** (`New-Object System.Text.UTF8Encoding($false)`); si no, salen mojibake tipo `tÃ©cnico`.
- El repo es **público**: nunca commitees API keys (ver `docs/video-narrado.md`, que necesitará una de ElevenLabs en `.env`).
- Deploy: push a `main` → Vercel despliega solo. Verifica en producción con `curl -sI` sobre `/`, `/tabletas/`, `/soloq/` y algún asset antes de dar por cerrado un cambio de estructura.

## Roadmap

`docs/video-narrado.md` — convertir decks en MP4 narrado con subtítulos vía ElevenLabs con timestamps. Propuesta cerrada, sin implementar.
