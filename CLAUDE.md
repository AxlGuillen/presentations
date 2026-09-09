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
janna/      index.html + gen.js + deck-stage.js + gsap.min.js + assets/
ivern/      index.html + gen.js + deck-stage.js + gsap.min.js + assets/
missfortune/ index.html + gen.js + deck-stage.js + gsap.min.js + assets/
syndra/     index.html + gen.js + deck-stage.js + gsap.min.js + assets/
riven/      index.html + gen.js + deck-stage.js + gsap.min.js + assets/
kindred/    index.html + gen.js + deck-stage.js + gsap.min.js + assets/
caps/       index.html + gen.js + deck-stage.js + gsap.min.js + CREDITOS.md + assets/
skins/      index.html + gen.js + deck-stage.js + assets/
caras/      index.html + gen.js + deck-stage.js + assets/
semana34/   index.html + gen.js + deck-stage.js + gsap.min.js + assets/ (solo og.png)
semana35/   index.html + gen.js + deck-stage.js + gsap.min.js + assets/ (solo og.png)
semana36/   index.html + gen.js + deck-stage.js + gsap.min.js + assets/ (solo og.png)
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
| `janna/index.html` | **GENERADO** por `janna/gen.js`. Serie Cumplelolero #7, animado con GSAP y **cierre de la tanda de cuatro del 2 de septiembre**: hay una lámina que compara a los cuatro one tricks y otra que compara sus edades en el lore. La pieza es la lámina del OTP — se construyen las cifras y la medalla de «mejor del mundo» y al final caen las dos colas en gris. |
| `ivern/index.html` | **GENERADO** por `ivern/gen.js`. Serie Cumplelolero #8, animado. Es donde la serie **varía el diseño a propósito**: portada centrada con el «10» de fondo (los otros siete llevan el bloque abajo a la izquierda), el bloque del lore arranca en paleta fría del Freljord y vira a verde al transformarse, y el remate es una **gráfica de dispersión** (puntos de maestría contra rango) en vez de barras. El pasado se pinta con el mismo splash en escala de grises: es el mismo personaje, no hacía falta otro asset. Janna no sale en la gráfica porque no juega ranked y se dice en la lámina. |
| `missfortune/index.html` | **GENERADO** por `missfortune/gen.js`. Serie Cumplelolero #9, animado. Sigue el orden del guion, que es el **experimento del lore primero** (segundo consecutivo, tras ivern): lore → one trick → skins; la investigación recomendaba al revés, pero manda el guion. Dos piezas nuevas: la lámina del remate dibuja un **arco SVG de retorno** del último eslabón al primero (primera animación de trazo del repo) y la del rango es una **línea plana** que nunca sale de la banda de Plata. Las láminas de lore van **sin imagen a propósito**: no hay splash que corresponda a lo que se narra y reusar el de la portada la repetía. |
| `syndra/index.html` | **GENERADO** por `syndra/gen.js`. Serie Cumplelolero #10, animado. Lore primero (tercer episodio consecutivo con ese orden). El lore ocupa **cuatro láminas a propósito**: el remate —que al día siguiente Riot le nerfea el poder igual que su maestro— solo aterriza si la traición de Konigen se contó completa antes. La lámina del castigo dibuja un **círculo cerrado** con las tres esferas encima. ⚠️ **El nerfeo va sin cifras a propósito**: la investigación las marca como sin verificar y además su tabla dice que el maná *baja*, mientras el guion narra que sube — poner el número contradiría la voz en off. |
| `riven/index.html` | **GENERADO** por `riven/gen.js`. Serie Cumplelolero #11, animado y **de cuatro láminas por encargo**: portada, one trick, skins y felicitación. El guion trae un bloque de lore largo (la traición de Emystan y las armas químicas) que aquí va narrado sobre la portada, sin apoyo visual propio. ⚠️ El guion dice «siete días y medio de salario mínimo» y la investigación calcula **7,4**: en pantalla va el 7,4, la voz redondea. |
| `kindred/index.html` | **GENERADO** por `kindred/gen.js`. Serie Cumplelolero #12, animado. Lore primero (quinto episodio seguido con ese orden). ⚠️ **El video va adelantado un día** —se graba para el domingo 13 y el cumpleaños es el lunes 14—, así que la portada dice «mañana cumple» y no «hoy». La pieza es la lámina del hacha: una sola máscara se parte por la mitad y las mitades se separan; el tajo baja **antes** de la separación o no se lee como un hachazo. La del one trick invierte la escala de la serie —la cifra enorme arriba y cuatro filas de Hierro debajo, todas iguales— y la rejilla de skins es **deliberadamente monótona**: las siete con la misma etiqueta de 1350, porque que se vea plana es el dato. ⚠️ El récord de ventaja sobre el segundo del mundo (1,86×, que supera a riven y syndra) **queda fuera a propósito**: la investigación lo trae pero el guion no lo narra y en su lugar dice «el hueco más grande entre puntos y rango» — meter otro récord ahí competiría con ese remate. Las skins de bóveda (DRX y Porcelana Prestigiosa) tampoco salen por lo mismo. |
| `caps/index.html` | **GENERADO** por `caps/gen.js`. **No es Cumplelolero**: tributo de esports por la entrada de Caps al Hall of Legends. El encargo fue **priorizar gráfico sobre texto** (son assets para el video), así que los números no se escriben, **se cuentan**: 18 copas contra 10 en la comparativa con Faker y 11 encendidas de 17 en la de los MVP. Las **fotos son reales y de licencia libre** (Wikimedia Commons): retratos de Caps, Faker y Uzi para el Hall of Legends, G2 levantando el trofeo de la EU LCS 2016 junto a las copas dibujadas, el estadio de la final de 2018 en gris, y **G2 levantando el trofeo del MSI 2019**, que es la única foto del deck donde se gana algo. ⚠️ Las CC BY **obligan a dar crédito**: la tabla de autoría y la línea lista para la descripción del video están en `caps/CREDITOS.md`, y hay que ponerla si el video se publica. **La copa está dibujada, no recortada**: las únicas fotos libres del trofeo de la LEC lo tienen con manos y caras encima y a resolución de captura de video, así que un recorte limpio no daba — y dibujada escala a cualquier tamaño, que es lo que necesitan las rejillas de 18. ⚠️ Tres cuidados de la investigación: Fnatic ganó **el primer Mundial de la historia, sin año** (la fuente dice 2013 y es error, fue la Temporada 1 en 2011); **no decir que tiene el récord de pentakills de Europa** (es de Ice con 9); y el «11 de 17 MVP» sale del guion, mientras la tabla de la investigación dice «MVP de final de LEC: 7» — manda el guion. |
| `skins/index.html` | **GENERADO** por `skins/gen.js`. Serie «Datos curiosos», mismo formato TikTok que Cumplelolero. Los collages usan tiles de pantalla de carga de Data Dragon; los mapas nombre→num están hardcodeados en gen.js. |
| `caras/index.html` | **GENERADO** por `caras/gen.js`. Serie «Datos curiosos» #2 — las skins más caras. Splashes de Data Dragon; la skin de Caps (Tristana) está marcada como filtración a propósito. |
| `semana34/index.html` | **GENERADO** por `semana34/gen.js`. Reporte semanal de Jira (18–24 ago 2026); los datos vienen de los worklogs y están fijos en el generador. Usa `tools/kit.cjs` en build-time. |
| `semana35/index.html` | **GENERADO** por `semana35/gen.js`. Reporte semanal de Jira (25–31 ago 2026), **v2.0 de la coreografía**. Los datos están fijos arriba del generador; tres worklogs de UWS-9283 se recuperaron del changelog de `timespent` porque la API de búsqueda corta en 20 worklogs por issue. |
| `semana36/index.html` | **GENERADO** por `semana36/gen.js`. Reporte semanal de Jira (1–7 sep 2026). Tercera entrega: reusa la coreografía de semana35 **a propósito** (son una serie) y añade la comparativa de las tres semanas y la lámina de la línea de producción del tracking. Aquí ninguna issue pasó de 20 worklogs, así que la API los devolvió todos sin recurrir al changelog. |
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

Deja intacta la **primera** diapositiva (que además es lo que capturan `portadas.mjs` y `og.mjs`) y en el resto convierte `src="assets/…"` en `data-src` y todo `background-image` en línea en un atributo `data-bg` — el de la `<section>` **y el de los `<div>` internos**: el helper `portada()` de la serie Cumplelolero pinta el splash en dos capas dentro de la diapositiva, y mirando solo la `<section>` se escapaba justo la imagen más pesada del deck (la portada del cierre se bajaba al entrar). Es idempotente y delimita por las propias `<section>`, no por el contenedor, porque `tabletas` las envuelve en `<x-import>` en vez de `<deck-stage>`. `tabletas/index.html` está escrito a mano: se le aplicó una vez y hay que mantener los `data-src` al editarlo.

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

### Peso de los assets

El otro lado del problema: los splash de Data Dragon vienen a **1215×717** y la rejilla de skins los pinta a **228×134**. Son 28 veces el área que se ve. El peso no estaba en la compresión, estaba en píxeles que nadie mira.

`node tools/optimizar-imagenes.mjs <carpeta…> [--aplicar] [--holgura=2]` mide en Chrome a qué tamaño se muestra realmente cada archivo y lo reescala a eso. Reglas:

- El objetivo sale del **uso más grande** del archivo en el deck: un mismo splash puede ser miniatura en una lámina y fondo a sangre en otra.
- Con `cover` la imagen se recorta, así que manda el lado que exige más escala.
- **Nunca amplía.** Si el objetivo sale mayor que el original, el archivo se queda igual.
- La **holgura de 2×** cubre pantallas hi-DPI, donde deck-stage escala el lienzo por encima de su tamaño de diseño. Para exportar a TikTok bastaría 1× (capturar.mjs usa el tamaño de diseño con deviceScaleFactor 1).
- Si el reencode no ahorra al menos un 8%, se deja el original intacto.
- El reencode JPEG es **q88 con croma 4:4:4 a propósito**. Se midió contra 4:2:0 a q88/q92/q95 y el 4:4:4 da el PSNR más alto de todas las opciones (53,5 dB contra 51,2 en la portada de Janna): el ahorro tiene que venir de los píxeles que sobran, no del croma.
- La clave de cada archivo es su ruta **relativa a `assets/`**, no el nombre suelto — hay decks con subcarpetas (`soloq/assets/avatars`, `*/assets/emblems`) que con solo el basename se quedaban fuera.
- Los `background-image` se miden en la `<section>` **y en los elementos internos**, contra la caja de quien los pinta. Mirando solo la `<section>` un splash que es miniatura en una lámina y fondo a sangre en el cierre se planificaba con la escala de la miniatura: así salieron borrosos los cierres de missfortune y syndra (`MissFortune_16.jpg` a 441×260 y `Syndra_44.jpg` a 590×348 estirados a una banda de 1080×760). Ojo también con que `style.backgroundImage` devuelve la url **tal cual se escribió** —y en los decks es relativa—, así que hay que resolverla antes de usarla como clave.

Resultado: **29 MB → 23 MB** de assets, 96 archivos reescritos y 142 dejados intactos.

**Cuando el PSNR baja de 35 dB, primero descarta el remuestreo.** La rejilla de riven da 35,7 dB, el peor de la serie, y **la misma lámina con las miniaturas guardadas a calidad 98 da 35,9**: el reencode no tiene la culpa, la diferencia es que el navegador redimensiona el original de 1215 px con su propio filtro y Pillow usa LANCZOS en build-time. Subir la holgura a 2,6× tampoco movió la aguja (35,9 dB por 237 KB más). Si más píxeles y más calidad no cambian el número, lo que se está midiendo no es pérdida.

**Cómo se comprueba que no se perdió calidad.** No basta con mirar: se capturan las láminas antes y después con `capturar.mjs` y se compara el PNG renderizado píxel a píxel. Tras la optimización el peor caso es la rejilla de skins de janna con **41,6 dB de PSNR**, y soloq y tabletas salen **idénticas**. Por encima de ~35 dB la diferencia no es visible; a 2× sin interpolación las miniaturas son indistinguibles.

**Lo que queda fuera.** Los avatares de soloq (23 PNG opacos, 2,5 MB) y las fotos de tabletas (12 PNG opacos, 3,0 MB) son fotografías guardadas como PNG: pasarlas a JPEG ahorraría un 75% pero es convertir de un formato sin pérdida a uno con pérdida, y además obliga a renombrar las referencias. Los PNG con transparencia real (7 avatares, 4 imágenes de tabletas) tienen que seguir siendo PNG.

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

`node tools/qa-deck.mjs <carpeta>` mide además el **desborde a lo ancho** (`desbordeAncho`), que no se puede ver con `scrollWidth` porque la `<section>` lleva `overflow: hidden`: lo que sobra se corta en silencio, y así se coló una fila de trofeos recortada en caps. Compara la caja de cada elemento del contenido contra la banda segura y se salta lo posicionado en absoluto, que es como se pintan fondos y halos a sangre. **No tumba el exit code**: entrar unos píxeles en el margen es cosmético (una sombra girada, un glow); lo que importa —contenido cortado por el marco— sale con decenas de píxeles. Hoy reporta 12 px en la portada de riven (el bbox de una esquirla girada) y 29 px en el podio de skins, los dos preexistentes.

## Identidad visual

- **tabletas** — fondo blanco, rojo `#C31722`, gris oscuro `#16181D`, tipografía Barlow. Corporativo, sobrio.
- **soloq** — fondo `#0B0B0B`, verde neón `#53FC18`, amarillo `#E9FF1F`, General Sans (Fontshare). Títulos en MAYÚSCULAS itálicas peso 800 con gradiente blanco→55%, tarjetas con radio asimétrico `34px 0`. Estilo esports, tomado de soloqchallenge.gg.
- **estancia** — propuesta comercial para **La Casita Feliz** (CAI). La paleta sale del logo del cliente: crema `#FFF9FA`, morado `#5B2168` / `#7B2E8E`, rosa `#E94B85`, verde `#6CBE45` / `#2FA84F`, amarillo `#FFC510`, café `#8D5B3F`, tipografía Poppins. El logo va como marca de agua al 5–7% en todas las diapositivas vía `marca()`; se pinta con `background-image` **a propósito**, para que si el archivo falta no se vea nada roto.
- **ornn** — apoyo visual para video vertical de TikTok, no deck de lectura. Negro forja `#0B0605`, carmesí `#C0272D`, brasa `#FF6B1A`, oro `#FFA23A`, Bebas Neue para cifras y titulares. El contenido va en una banda central (`padding: 300px 84px 350px`) para que la interfaz de TikTok no tape nada: **si tocas esos márgenes, revisa que todo siga dentro de la zona segura**.
- **urgot** — serie Cumplelolero, mismo formato TikTok que ornn (banda central 300/350). Acero de Zaun `#070A09`, verde ácido `#96E32E`, rojo `#D8342C` para traición/sequía, Bebas Neue. Mantener Bebas Neue y la banda segura en toda la serie Cumplelolero para que los videos se vean de la misma familia.
- **talon** — serie Cumplelolero #3, mismo formato TikTok (banda 300/350, Bebas Neue). Noche `#07080F`, filo cian `#6FC7F0`, azul `#2E5F94`, carmesí Noxus `#C43048` para la sequía, dorado `#E8B84B` para logros y el bloque de latinos.
- **semana36** — tercera entrega de la serie, sin desviarse de la paleta Jira. Suma un gris intermedio `#8993A4` para distinguir tres semanas en la misma comparativa (S34 gris claro, S35 gris medio, S36 azul).
- **semana35** — misma paleta y tipografía que semana34 **a propósito**: son una serie, lo que cambia es la coreografía (v2.0). Añade gris `#B3BAC5` para la semana anterior en la comparativa y una escala de azules para los arcos de la dona.
- **semana34** — reporte semanal de trabajo, paleta Jira/Atlassian: azul `#0052CC` sobre blanco, tinta navy `#172B4D`, lavado `#DEEBFF`, tipografía Figtree. Textura de puntitos y sombras en capas vía `tools/kit.cjs`. Semánticos aparte del acento: verde `#00875A` (hecho), ámbar `#974F0C` (espera), rojo `#DE350B` (regresó de QA).
- **blitzcrank** — serie Cumplelolero #4, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: noche de Zaun `#0A0A18`, violeta eléctrico `#8F6DFF` (los arcos que le dan el nombre), latón `#D9913C` para dinero y logros, verde químico `#3FC38A` solo en el lore.
- **malphite** — serie Cumplelolero #5, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: basalto `#120D12`, terracota de arenisca `#E08A72` (su cuerpo), verde `#B5CE45` (lo único vivo de la lámina: su mirada) para lore y remates, arena `#EBC27C` para dinero y óxido `#C4564E` para el elo del one trick — aquí el color de alerta marca el rango bajo, al revés que el dorado de logro en talon y blitzcrank.
- **mundo** — serie Cumplelolero #6, mismo formato TikTok (banda 300/350, Bebas Neue). Paleta muestreada del splash: laboratorio `#140A17`, suero morado magenta `#C455E0` (su piel) como acento, cian de su lengua `#4FC9D8` para cifras y dinero, y rojo de alerta médica `#E0483F` para la sequía y el elo. Es el único deck de la serie con animación.
- **janna** — serie Cumplelolero #7, mismo formato TikTok (banda 300/350, Bebas Neue) y animado. Paleta muestreada: tormenta `#060F14`, aguamarina del viento `#69E8C8` (acento, más verde que el cian de talon y mundo para no confundirse con ellos), rosa `#F2799E` de su icono para la diosa y el lore, y gris pizarra `#6E7A8A` reservado al «sin clasificar» del one trick.
- **ivern** — serie Cumplelolero #8, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. Paleta muestreada del splash: bosque de noche `#08110D`, verde savia `#7DD66B` (el Padre Verde, acento), oro del Sauce Dios `#E0B94A` para cifras y dinero, y **acero frío `#7FA8C9` reservado al bloque de Ivern el Cruel** — es el único deck de la serie que cambia de paleta a media presentación, porque ahí el color cuenta la historia.
- **missfortune** — serie Cumplelolero #9, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. **Portada y cierre usan el helper `portada()`** en vez del `background: cover` a sangre del resto de la serie: los splash son apaisados (1215×717) y el lienzo vertical, así que a sangre hay que ampliarlos 2,7× y se recorta casi todo. En su lugar, una banda superior de 760 px con recorte suave que se funde hacia abajo sobre una copia borrosa del mismo splash — mismo recurso que usa `tools/og.mjs` para los verticales. Ojo: la capa borrosa sangra fuera del marco, así que va envuelta en un contenedor con `overflow: hidden` o infla `scrollHeight` y el QA marca un desborde falso. Paleta muestreada: puerto de Bilgewater `#071316`, rojo cobre `#E8552E` de su pelo como acento — que aquí hace doble trabajo como el fuego del incendio y la venganza —, teal del puerto `#3FB8B0` para datos y oro pirata `#EFC45A` para el dinero, que en este episodio es protagonista porque es la más cara de vestir de la serie.
- **syndra** — serie Cumplelolero #10, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. Cae justo entre el violeta de blitzcrank y el magenta de mundo, así que el diferenciador es que **su acento es pálido**: lila `#C9A7FF`, el núcleo de sus esferas — ningún otro deck usa un acento desaturado como principal. Noche de Ionia `#0D0A1A`, violeta profundo `#8B3FD1` para estructura y paneles, y rosa carmín `#E0567F` reservado a la humillación y al nerfeo. Las tres esferas son el motivo recurrente y siempre entran igual, estallando desde el centro.
- **riven** — serie Cumplelolero #11, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. Es el tercer deck verde de la serie, así que el diferenciador no es el tono sino **con qué va emparejado**: janna e ivern son verdes fríos sobre fondos fríos, y aquí el verde rúnico de la espada `#3FDE6A` —el único color frío que hay en el splash— va sobre ruinas cálidas. Polvo de Noxus `#0D0A08`, arenisca `#D9B489` para estructura y dinero, y carmesí `#C43A4A` reservado a las derrotas y a la sequía. El motivo recurrente son **las esquirlas** de la Espada Rúnica (`esquirlas()`): tres trozos con cortes y giros distintos, nunca tres copias, que entran girando y se acomodan. La lámina del one trick es la pieza: los dos récords arriba, el rango en gris debajo, y de remate las 997 victorias y 998 derrotas creciendo desde la costura central — las dos mitades salen idénticas a propósito, que es justo el dato.
- **caps** — tributo de esports, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. El oro está muy visto en el repo (lowelo, caras, talon), así que aquí **no es el acento**: es solo el color de los trofeos, que es lo único que significa en este deck. El acento es el **escarlata de G2 `#FF2D55`**, el único rojo-rosa saturado de la colección. Negro de escenario `#0A0709` y **plata fría `#93A4B8` reservada a los dos subcampeonatos de Worlds**: es el único bloque que no toca ni el escarlata ni el oro, porque ahí no hay nada que celebrar. El motivo recurrente es **el trofeo de la LEC** (`copaLEC()` / `copas()`) —sus dos hojas curvas y la gema ovalada, dibujadas—, y siempre entra igual: cayendo una tras otra con rebote corto. Ojo con las rejillas de copas — se dibujan con `width: 100%` dentro de la celda **a propósito**: con ancho fijo la novena de la fila se salía del marco y, como la `<section>` lleva `overflow: hidden`, se cortaba en silencio.
- **kindred** — serie Cumplelolero #12, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. Es el único deck de la serie con **dos acentos en paridad** en vez de uno principal y otro de apoyo, porque el personaje son dos: hueso cálido `#F0E3C8` para Cordero (la muerte tranquila) y azul espectral `#4D9EE6` para Lobo (la violenta), y **ningún bloque los mezcla** — donde manda uno, el otro no aparece. Bosque de noche `#07090C`, oro apagado `#C9A63C` del cuerpo del splash para dinero y skins, y **gris pardo `#8A7F76` reservado al historial de Hierro del one trick**. El motivo son **las dos máscaras** (`mascaraCordero()` / `mascaraLobo()`), dibujadas porque se repiten a tamaños muy distintos y tienen que poder partirse por la mitad; van **cruzadas a propósito**, como en el lore. Nunca entran a la vez: primero Cordero y después Lobo.
- **skins** — serie «Datos curiosos» #1, formato TikTok (banda 300/350, Bebas Neue). Violeta `#0B0714`, oro `#F5C042` para el dinero, magenta `#E75FB4`, rojo `#E0475B` para lo bloqueado (tiles en escala de grises).
- **caras** — serie «Datos curiosos» #2, misma identidad que skins (violeta `#0B0714`, oro `#F5C042`, magenta `#E75FB4`) + rojo `#E0475B` para lo escandaloso. Formato TikTok (banda 300/350, Bebas Neue).
- **galería** — «La cartelera» (línea en `docs/linea-diseno-galeria.md`, diseño en `docs/diseno-galeria/`): carbón cálido `#16130E`, hueso `#EDE8DD`, ámbar `#E8B54D` solo en chrome; Bricolage Grotesque + Archivo + Spline Sans Mono. Pantalla de proyección que rota (portadas JPG reales en `/portadas/`, se regeneran con `node tools/portadas.mjs`) y cada deck tiñe la página con su acento vía `--deck-acento`/`--deck-glow`. Las filas se agrupan por el campo `grupo` («Profesional», «Reportes semanales» y «Creador de contenido»), en el orden del array — el orden de los grupos es el de su primera aparición, así que mover una fila mueve su grupo. Los reportes de Jira van aparte de «Profesional» **a propósito**: son trabajo interno recurrente, no propuestas a cliente, y mezclados escondían las dos que sí son comerciales. El contador de la cabecera sale del propio array; para que un grupo nuevo salga abreviado hay que añadirlo al mapa `CORTO` (si no, aparece con su nombre completo). Los datos están en el array `DECKS` del propio index.html: al agregar un deck, añade su entrada ahí y corre portadas.mjs. La marca **4XL** vive en `marca/` (fuente SVG) y `favicon.svg`/`favicon.ico` en la raíz — el `.ico` cubre todos los decks sin tocarlos; el monograma va como marca de agua al 4.5% en la esquina de la pantalla de proyección.
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

Reglas: los estados iniciales se ponen con `tl.from()`, **nunca ocultando en CSS** — sin JS el deck se ve completo y la impresión a PDF funciona. `prefers-reduced-motion` salta al final. Las timelines quedan en `section.__tl` y son seekeables (`tl.time(t)`) pensando en el futuro render de video cuadro a cuadro. Si una timeline supera ~1.8s, sube la espera en `tools/capturar.mjs` (hoy **2600 ms**) para que la captura tome el estado final. **Trazos SVG:** para dibujar una línea con `stroke-dashoffset` hay que medir con `getTotalLength()`, que devuelve **unidades de usuario**. Si el SVG se escala de forma no uniforme (`preserveAspectRatio="none"` con un viewBox normalizado) el dasharray no corresponde al trazo dibujado y la línea sale con huecos: usa un viewBox en píxeles del tamaño real, como en la gráfica de missfortune. `node tools/qa-anim.mjs <carpeta> <nSlide> [t1,t2,…]` seekea la timeline de una lámina a los tiempos que le pidas y guarda un PNG por cada uno: sirve para revisar la coreografía a mitad de camino y para comprobar que es determinista antes del render de video.

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
