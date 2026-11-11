# Runtime, carga de assets y QA de los decks

> Movido desde el `CLAUDE.md` de la raíz el 10/nov/2026. Algunos ejemplos citan decks que ya están archivados en la etiqueta de git `archivo-2026-11` (soloq, tabletas, janna, riven…); se dejan como registro de por qué las cosas son así.

## Runtime de los decks

`deck-stage.js` define el custom element `<deck-stage width height>`; las diapositivas son `<section>` hermanas con estilos inline. Aporta navegación por teclado, escalado automático al viewport, barra de miniaturas, `@media print` (una slide por página) y speaker notes vía `data-speaker-notes`.

Cada deck añade un botón "Presentar · P" que hace `postMessage({__omelette_presenting: true})` — el runtime ya escuchaba ese mensaje y oculta miniaturas y pie de navegación. No hace falta tocar `deck-stage.js` para eso.

**Pasos dentro de una slide** (opt-in): elementos con `data-step="1"`, `"2"`… se revelan por etapas con la navegación normal — → revela el siguiente paso, ← lo oculta; agotados los pasos se cambia de slide. Al llegar avanzando la slide arranca en 0 pasos; al regresar llega con todos. La ocultación es `visibility` (no mueve layout), miniaturas e impresión muestran siempre todo, y `capturar.mjs`/`cuadros.mjs` revelan todo antes de capturar (PNG y video llevan la slide completa). Cada cambio emite `stepchange` (bubbles) con `{slide, step, previousStep, total}`; el pegamento `kit.animador()` ya anima por defecto los elementos recién revelados. Ejemplo: las columnas del tablero en `semana34`. Sin `data-step` el comportamiento es idéntico al de siempre.

**Modo capa** (desde el 5/nov/2026): con `?capa=<id>[&alfa=1]` el runtime muestra solo esa lámina, para incrustarla en un iframe. Ver «Estudio de montaje: modo capa y API local». Las 61 copias de `deck-stage.js` siguen siendo idénticas (un solo hash; lo comprueba `tools/pruebas/runtime.test.mjs`).

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

- **Una capa borrosa apuntando al mismo archivo lo deja a tamaño completo.** El helper `arte()` de samira pinta el arte nítida encima de una copia de sí misma desenfocada a 38 px, con `cover` y sangrando 40 px por lado. El optimizador se queda con la escala que exige la capa más golosa — y la golosa es la borrosa, que pide ~1,05× del original —, así que guardaba cartas de 2048 px **para acabar desenfocándolas**. La capa borrosa lleva **su propio archivo de 360 px** (`<nombre>-fondo.jpg`, ~25 KB): el desenfoque se ve idéntico y el arte nítida se planifica por lo que de verdad se ve. Quitó 224 KB de la primera lámina de samira, que además es vecina de la portada y se precarga con ella.
- **Al cambiar un asset de papel, vuelve a bajar el original.** Los archivos del repo ya están reducidos al uso que tenían: si un splash pasa de miniatura a fondo a sangre, el que hay en `assets/` ya viene recortado a tamaño de miniatura y se estira sin que nada avise. Pasó al mover el cierre de samira a La Forajida, que estaba guardada a 644×380 para la rejilla de skins.

Resultado: **29 MB → 23 MB** de assets, 96 archivos reescritos y 142 dejados intactos.

**Cuando el PSNR baja de 35 dB, primero descarta el remuestreo.** La rejilla de riven da 35,7 dB, el peor de la serie, y **la misma lámina con las miniaturas guardadas a calidad 98 da 35,9**: el reencode no tiene la culpa, la diferencia es que el navegador redimensiona el original de 1215 px con su propio filtro y Pillow usa LANCZOS en build-time. Subir la holgura a 2,6× tampoco movió la aguja (35,9 dB por 237 KB más). Si más píxeles y más calidad no cambian el número, lo que se está midiendo no es pérdida.

**Cómo se comprueba que no se perdió calidad.** No basta con mirar: se capturan las láminas antes y después con `capturar.mjs` y se compara el PNG renderizado píxel a píxel. Tras la optimización el peor caso es la rejilla de skins de janna con **41,6 dB de PSNR**, y soloq y tabletas salen **idénticas**. Por encima de ~35 dB la diferencia no es visible; a 2× sin interpolación las miniaturas son indistinguibles.

**Lo que queda fuera.** Los avatares de soloq (23 PNG opacos, 2,5 MB) y las fotos de tabletas (12 PNG opacos, 3,0 MB) son fotografías guardadas como PNG: pasarlas a JPEG ahorraría un 75% pero es convertir de un formato sin pérdida a uno con pérdida, y además obliga a renombrar las referencias. Los PNG con transparencia real (7 avatares, 4 imágenes de tabletas) tienen que seguir siendo PNG.

### La cortina de carga

`deck-stage.js` monta un overlay en su shadow DOM con el monograma **4XL** inline (nada que pedir a la red, el deck sigue autocontenido) sobre el carbón de La cartelera `#16130E`, con una barra de progreso ámbar `#E8B54D`. Espera a **todo lo que pinta la primera diapositiva** — sus `<img>` y también el `url()` del `background-image`, porque media serie Cumplelolero tiene la portada como fondo de la `<section>`. Techo duro de 3 s para que una imagen colgada no deje el deck tapado, y se suprime en **modo presentación** —desde el 10/nov/2026 de golpe, sin sus 420 ms de fundido: antes, si la captura caía a media transición, el cuadro salía con la cortina encima a medio desvanecer (lo destapó `capa.test.mjs`, con el estado de la lámina idéntico y 21 dB de PSNR)—, que es lo que activan las cuatro herramientas de `tools/` antes de capturar: por eso nunca sale en un PNG.

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

**Arte ASCII sobre una lámina centrada.** La serie Cumplelolero pinta las secciones con `text-align: center`, y eso **centra cada renglón por separado**: cualquier dibujo en monoespaciado se desarma renglón a renglón y el QA no lo ve, porque no hay desborde ni imagen rota. El `<pre>` va con `text-align: left` dentro de un `display: inline-block`, que es lo que lo vuelve a centrar **como bloque** sin tocar la alineación interna. Ojo también con el `
` pegado a un `<span>` de línea: si el span es `display: block`, el salto de línea que venga después suma un renglón vacío. Es el helicóptero de la lámina 2 de corki.

## Cards al compartir (Open Graph)

Cada deck (y la galería raíz) lleva metas OG/Twitter en el `<head>` para que el enlace salga con card y preview en WhatsApp/Slack/X. En los generados las emite `kit.og({ titulo, descripcion, carpeta })`; en `tabletas/index.html` y la raíz están pegadas a mano. La imagen es `<carpeta>/assets/og.png` (raíz: `/og.png`), 1200×630, **committeada** porque las metas apuntan a su URL absoluta en producción (`kit.PROD`). Se genera con `node tools/og.mjs <carpeta|raiz>` desde la primera diapositiva (horizontales: recorte centrado; verticales: portada sobre sí misma desenfocada) — **regenérala si cambia la portada del deck**. Las previews solo se ven tras deployar a `main`.

## Contraseña de la galería

`middleware.ts` (Routing Middleware de Vercel, en la raíz) protege **solo la galería** (`/` e `/index.html`). Los decks siguen abiertos, porque se comparten por enlace; lo que se evita es que alguien que recibió un deck vaya a la raíz y vea todos los demás. Es TypeScript a propósito: un `middleware.js` necesitaría `"type": "module"` en un `package.json` de la raíz, y eso convertiría en ESM todos los `gen.js`, que son CommonJS.
- **Sin sesión:** el middleware responde con la puerta, en La cartelera y con `noindex`.
- **Con la clave correcta:** guarda una cookie `HttpOnly` con un HMAC-SHA256 de la clave (30 días) y deja pasar al `index.html` estático. Si no devuelve nada, Vercel sigue con el estático.
- **Cambiar la clave** cierra todas las sesiones, y `/?salir` borra la cookie.
- **Sin la variable `GALERIA_CLAVE`**, la galería queda cerrada.
- ⚠️ **No es un secreto absoluto**: el repo es público y `index.html` (con el array `DECKS`) se lee en GitHub. Lo que protege es el sitio, contra quien navega desde un enlace compartido.
- **Pruebas:** 5 en `tools/pruebas/middleware.test.mjs` (Node 24 importa el `.ts` tal cual).
- **En local:** `node tools/servidor-local.mjs` (o la configuración «sitio» de `.claude/launch.json`, en el puerto 3125) imita a Vercel. Sirve los estáticos con barra final y el `404.html`, pasa la galería por el middleware y toma la clave de `GALERIA_CLAVE` en el entorno o en `.env`. `npx serve` no corre middlewares.

