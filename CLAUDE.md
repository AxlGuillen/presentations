# CLAUDE.md

Portafolio de presentaciones web (decks HTML) servido como sitio estático en Vercel. Repo público: `AxlGuillen/presentations`. Proyecto Vercel: `presentations` → https://presentations-three-phi.vercel.app

Este archivo tiene **solo las reglas y el mapa**. El detalle vive en dos lugares:

- **`<deck>/CLAUDE.md`**: las decisiones, cuidados e identidad visual de cada deck. Claude Code lo carga al trabajar en esa carpeta; léelo antes de tocar un deck.
- **`docs/motor/`**: el motor completo. `runtime-y-assets.md` (deck-stage, carga diferida, peso de imágenes, cortina, desbordes, OG, contraseña), `kit.md` (kit de build-time, GSAP, recetas, continuidad, líneas, patrones, edit y ritmo), `video.md` (video narrado, voz, audio, transiciones) y `montaje.md` (laminas.mjs, manifest, banda, clips, modo capa y API local). **Lee el que toque antes de cambiar herramientas o escribir coreografías.**

## Arquitectura

Sin build, sin dependencias en runtime, sin framework. Una carpeta autocontenida por presentación **dentro de su escritorio**: `work/` (UrVenue), `personal/` (lo propio y los clientes propios) y `creator/` (LoL y esports). La URL sigue a la carpeta (`/creator/lux/`). Desde el 26/oct/2026; **solo `/seating3dmap/` redirige** a su ruta nueva (en `vercel.json`) porque era el único enlace compartido.

```
<escritorio>/<deck>/  index.html (generado) + gen.js + deck-stage.js + CLAUDE.md + assets/
                      [+ gsap.min.js y plugins] [+ guion.json + video.mp4] [+ clips.json, guion-marcado.txt]
index.html            galería «La cartelera» (array DECKS), protegida por middleware.ts
404.html              «Fuera de cartelera»; no enlaza a ningún deck a propósito
middleware.ts         contraseña de la galería (Routing Middleware de Vercel)
portadas/             JPG de cada card (node tools/portadas.mjs <carpeta>)
tools/                kit de build-time, captura, video, montaje y pruebas (solo local)
docs/                 motor, propuestas abiertas y archivo
```

- **`deck-stage.js` está duplicado a propósito** en cada carpeta: cada deck se puede copiar a otro sitio y funciona solo. No lo centralices. Todas las copias son idénticas (lo comprueba `tools/pruebas/runtime.test.mjs`).
- **Rutas siempre relativas** dentro de un deck (`assets/foo.png`, nunca `/assets/foo.png`). Por eso `vercel.json` tiene `trailingSlash: true`; sin la barra final las imágenes de todos los decks dan 404.
- **Archivo**: el 10/nov/2026 se quitaron 40 decks (Cumplelolero #1–#24, soloq, lowelo, skins, caras, caps, parche2620, suiza, suiza-r1, suiza-r5, semana34–38, tabletas, estancia y novedades) y los MP4 de dra, musk y ultracode. Siguen en la etiqueta `archivo-2026-11`: `git checkout archivo-2026-11 -- creator/jinx`. Varias notas y docs citan esos decks como ejemplo.

## Decks vivos

| Deck | Formato | Qué es |
|---|---|---|
| `personal/omicron` | 16:9 | Propuesta de servicios para MT Omicron Sigma (privada en parte: `INVESTIGACION.md` no se sube) |
| `personal/dra`, `personal/musk`, `personal/dra-1102` | 16:9 | Charlas y reunión de DRA; dra-1102 con video narrado |
| `personal/lab` | 9:16 | Catálogo vivo del kit: una lámina por receta, con su línea de uso |
| `work/seating3dmap` | 16:9 | Mapa 3D de UrVenue, en inglés |
| `work/semana42` | 16:9 | Reporte semanal de Jira |
| `work/ultracode` | 16:9 | Charla de Claude Code (video quitado en la limpieza; queda `guion.json`) |
| `work/urvenue-video` | 16:9 | **Sin listar** (no está en `DECKS`, lleva `noindex`) |
| `creator/guerras`, `creator/helia` | 9:16 banda segura | Serie de lore: paquetes de assets por bloque del guion |
| `creator/suiza-qf` | 9:16 banda segura | Worlds 2026, cuartos de final (flyers) |
| `creator/lux`, `graves`, `elise`, `seraphine`, `ksante`, `leblanc` | Panel 1080×1370 | Cumplelolero #25–#30 para el montaje automático |
| `creator/ganan`, `creator/parche2621` | Panel 1080×1370 | Video de análisis y serie de parches |
| `creator/ambessa`, `senna` | Banda inferior | Cumplelolero #31 y #32 |
| `creator/t1-blg`, `vayne-troll`, `tom-draft` | Banda inferior | Canal Axelsine: previas y análisis |
| `creator/jhin-build` | **Banda superior** | Canal Axelsine: la build de Jhin; el primero con la banda arriba y con `tarjeta-item` |

## Regla crítica: generado vs. escrito a mano

- **Todo `index.html` de deck lo GENERA su `gen.js`.** Nunca lo edites a mano: edita `gen.js` y corre `node <escritorio>/<deck>/gen.js`. Los datos van como constantes arriba del generador.
- A mano solo: `index.html` raíz, `404.html` y `middleware.ts`.
- **El kit se incrusta en cada deck al generarlo** (`kit.animador()`, `kit.efectos()`…), así que regenerar un deck viejo le cambia el runtime aunque no toques su contenido. Los decks terminados se consideran **congelados**: no se regeneran salvo que haya que cambiarlos, y al hacerlo se revisa el diff completo. El 10/nov/2026, antes de la limpieza, corrían sin error los 64 generadores que había entonces; hoy quedan 25.
- Cada generador termina con `fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8')` (carga diferida de imágenes; ver `docs/motor/runtime-y-assets.md`).

## Formatos

Cuatro formatos asentados. Un deck nuevo parte del más reciente de su formato.

1. **16:9 de charlas y reportes** (1920×1080). Reportes con la paleta Jira y la coreografía de la serie semanal; charlas de DRA con índigo `#4B3BD6` sobre blanco con puntitos (Figtree).
2. **9:16 con banda segura de TikTok** (1080×1920, `padding: 300px 84px 350px`). La interfaz de TikTok tapa lo de fuera. Bebas Neue (Anton en los flyers de Worlds).
3. **Panel del montaje automático** (1080×1920 con el contenido en el panel de 1080×1370 desde y = 275; `crop=1080:1370:0:275`). Va abajo del gameplay del prereel. Fondos marcados con `data-fondo` para sacarlos con alfa.
4. **Banda inferior** (1080×680 desde y = 1240), el formato actual del canal. Reglas:
   - `<deck-stage data-recorte="1080:680:0:1240" data-banda="abajo">` y `${kit.banda()}` después de `</deck-stage>`.
   - Banda **opaca** de borde a borde: el fondo va en el `div[data-panel]`, no en la `<section>`. Exporta **mp4 H.264** con `alfa: false`; un deck que necesite transparencia lo declara con `data-alfa="webm"`.
   - **El riel** (líneas, rombo y destellos) va marcado con `data-riel`, es el mismo markup en todas las láminas e idéntico en el primer y el último cuadro (ReelForge funde las pegadas en 0,25 s). `?banda=arriba` / `--banda=arriba` lo invierte para la variante de banda superior.
   - Una lámina de reposo con `data-reposo` (la banda sin dato). Sin `data-continua`: en el montaje las láminas caen por palabra, con huecos y fuera de orden.
   - Ninguna lámina arranca en negro: el fondo se ve desde el cuadro 0.

**Criterios de contenido del canal** (de Axl, valen para todo `creator/`):
- Desde jinx, **solo el dato en pantalla**: sin cejas, chips, citas ni remates.
- Arte oficial (Data Dragon, CommunityDragon, Legends of Runeterra, la wiki, lolesports). Lo que no existe se dibuja a líneas, no con doodles de stock.
- Sin dinero ni salarios mínimos desde nasus, salvo que el paquete lo pida.
- Groserías y nombres de jugadores del guion no van en pantalla.
- **No se inventa lo que la fuente no da**: casillas vacías o fuera.
- Nombres de skins y títulos en **es_MX**, salvo que la voz diga otro.
- El paquete de Axl manda sobre la investigación; si discrepan, va lo verificable y se anota en el `CLAUDE.md` del deck.

## Runtime de los decks (resumen)

`deck-stage.js` define `<deck-stage width height>`; las láminas son `<section>` hermanas. Aporta:
- navegación, escalado, rail de miniaturas, impresión (una lámina por página) y notas del orador (`data-speaker-notes`);
- pasos dentro de una lámina (`data-step="1..N"`);
- la cortina de carga;
- el modo capa `?capa=<id>[&alfa=1][&banda=arriba]` para el estudio de ReelForge.

El botón «Presentar · P» manda `postMessage({__omelette_presenting: true})`.

**Verificar desbordes** tras cualquier cambio de contenido: `node tools/qa-deck.mjs <carpeta>` (alto y ancho) o, en el navegador:

```js
[...document.querySelectorAll('deck-stage section')]
  .map((s, i) => ({ i: i + 1, label: s.dataset.label, over: s.scrollHeight - ALTURA_DISEÑO }))
  .filter(x => x.over > 2)
```

Imágenes: `node tools/optimizar-imagenes.mjs <carpeta> --aplicar` las reduce al tamaño al que se ven, y `node tools/qa-peso.mjs <carpeta>` mide el peso de la primera lámina. **Al cambiar un asset de papel** (de miniatura a fondo a sangre) vuelve a bajar el original: el del repo ya está reducido. Detalle en `docs/motor/runtime-y-assets.md`.

## Kit y animación (resumen)

`tools/kit.cjs` (CommonJS a propósito; `tools/package.json` es ESM) da helpers de **build-time** que devuelven strings: texturas, sombras, OG, `kit.diferir`, `kit.reproductor` y `kit.banda`. También trae `kit.gsap(__dirname, [plugins])`, `kit.efectos()` (recetas declaradas con `data-efecto`), `kit.animador()` (coreografías con `animar('<data-label>', (tl, s) => …)`), `kit.lineas`, `kit.patron`, `kit.icono` y `kit.random`. La sofisticación nueva entra por el kit o por librerías vendorizadas por carpeta, **nunca por CDN ni npm en runtime**. El catálogo visual es `personal/lab`.

Reglas que rompen cosas si se olvidan:
- **Estados iniciales con `tl.from()`, nunca ocultando en CSS**: sin JS el deck se ve completo y la impresión funciona.
- **El `data-label` de una lámina es la llave de `animar()`**: dos láminas con el mismo nombre comparten coreografía.
- **Nada de `Math.random`**: `kit.random(semilla)` en build-time y `random(semilla)` en la página (el video tiene que ser determinista).
- Una receta que cambie el DOM registra su deshacer en `section.__deshacer`: el animador reconstruye la timeline en cada activación.
- El plugin Flip no sirve dentro de deck-stage (mide en pantalla y el lienzo va escalado): FLIP a mano con `offsetLeft`/`offsetTop`.
- El degradado recortado al texto va en cada `<span>` si las letras se animan por separado.
- `mix-blend-mode` deja de mezclar si un ancestro lleva transform.
- Los trazos SVG con dasharray van en un viewBox en píxeles reales.
- GSAP: los decks nuevos usan la 3.15 que copia `kit.gsap`; las copias 3.12.5 de los decks viejos no se tocan.
- Al escribir o revisar coreografías carga los skills `gsap-timeline` y `gsap-core`.

`node tools/qa-anim.mjs <carpeta> <nSlide> [t1,t2,…]` guarda un PNG por instante para revisar una coreografía a mitad de camino.

## Video y montaje (resumen)

- **Video narrado**: `node tools/video.mjs <carpeta>` lee `guion.json`, captura, pide la voz a Fish Audio (`s2.1-pro-free`, gratis; `FISH_API_KEY` en `.env`) y monta con ffmpeg. Si el deck anima, `cuadros.mjs` renderiza cuadro a cuadro. Música opcional desde `MUSICA_DIR` (nunca al repo). Skill `guion-video`; detalle en `docs/motor/video.md`.
- **Láminas para ReelForge**: `node tools/laminas.mjs <carpeta> [--banda=arriba] [--solo=id,…]` corta cada `<section data-lamina="id">` en `video-out/laminas/<id>.mp4` + `.png` + `manifest.json` (schema en `tools/manifest.schema.json`) y copia `guion-marcado.txt`. Los clips de `clips.json` entran al manifest tras su lámina.
- **API local** en `node tools/servidor-local.mjs` (puerto 3125, solo loopback) para el estudio de ReelForge. Detalle en `docs/motor/montaje.md`.
- `video-out/` está ignorado y se regenera.

## Galería

- **«La cartelera»**: carbón cálido `#16130E`, hueso `#EDE8DD` y ámbar `#E8B54D` solo en el chrome; Bricolage Grotesque, Archivo y Spline Sans Mono. La línea de diseño está en `docs/linea-diseno-galeria.md`.
- **Tres escritorios** (Work, Personal y Content creator) como pestañas; la pestaña activa se recuerda en el hash y en `localStorage`.
- **Cada deck es una entrada del array `DECKS`** del `index.html` raíz, con `desk`, `grupo`, `ruta`, `titulo`, `acento` y `glow`. Los grupos salen en el orden de su primera aparición.
- **Al agregar o quitar un deck**: tocar su entrada en `DECKS` y su `portadas/<deck>.jpg` (`node tools/portadas.mjs <carpeta>`).
- **Contraseña**: `middleware.ts` protege solo `/` e `/index.html`, con `GALERIA_CLAVE` en Vercel y en `.env`, y una cookie HMAC de 30 días; `/?salir` la borra. Los decks siguen abiertos porque se comparten por enlace.
- ⚠️ El repo es público: `DECKS` y las rutas de todos los decks se leen en GitHub. La contraseña protege el sitio, no un secreto.
- **Cards al compartir (OG)**: `kit.og({ titulo, descripcion, carpeta })` emite las metas e `og.png` se genera con `node tools/og.mjs <carpeta>`. Se regenera si cambia la portada.

## Agregar una presentación

Skill **`nuevo-deck`**. En corto:
1. Crear `<escritorio>/<deck>/` con `gen.js` (`require('../../tools/kit.cjs')`), una copia de `deck-stage.js`, `assets/` y su **`CLAUDE.md`** con el encargo, las decisiones, los ⚠️ cuidados y la identidad visual.
2. Agregar su entrada en `DECKS` y correr `node tools/portadas.mjs <carpeta>` y `node tools/og.mjs <carpeta>`.
3. Agregar su línea en la tabla de este archivo y en la del README.

## Skills del proyecto (.claude/skills/)

- **nuevo-deck**: scaffold de un deck.
- **verificar-deck**: desbordes, revisión visual y captura real en Chrome (el Browser pane embebido no corre rAF; GSAP se verifica ahí).
- **guion-video**: `guion.json` y MP4 narrado.
- **gsap-core / gsap-timeline / gsap-performance / gsap-utils**: los oficiales de GreenSock.

## Pruebas

`node --test "tools/pruebas/*.test.mjs"`. Las que abren Chrome o ffmpeg se saltan si no están. `capa.test.mjs` era intermitente hasta el 10/nov/2026 y se arregló en `deck-stage.js` (ver «Modo capa» en `docs/motor/montaje.md`): pasó 8 de 8 veces seguidas.

## Notas de entorno

- Shell primario: PowerShell en Windows. Al escribir archivos con acentos desde PowerShell, UTF-8 **sin BOM** (`New-Object System.Text.UTF8Encoding($false)`).
- **Secretos solo en `.env`** (ignorado; el repo es público): `FISH_API_KEY`, `LOLESPORTS_API_KEY`, `GALERIA_CLAVE` y `MUSICA_DIR` (esta última no es secreta: es la carpeta local de pistas).
- **Deploy**: un push a `main` despliega solo en Vercel. `.vercelignore` deja fuera `tools/`, `docs/`, los `.md`, los `gen.js` y los datos de build. **Nunca ignores `middleware.ts`**: sin él la galería queda abierta. Tras un cambio de estructura, verifica con `curl -sI` la raíz, un deck y un asset en producción.

## Docs

- `docs/motor/`: el motor (ver arriba).
- `docs/efectos-svg.md`: 15 efectos implementados y 10 en propuesta.
- `docs/lineas-y-continuidad.md`: investigación del dibujo a líneas y de la continuidad (implementado).
- `docs/linea-diseno-galeria.md` y `docs/diseno-galeria/`: diseño de la galería.
- `docs/archivo/`: planes y propuestas ya cerrados (mejoras y plan de octubre, video narrado, animaciones y assets, audio y tours).
