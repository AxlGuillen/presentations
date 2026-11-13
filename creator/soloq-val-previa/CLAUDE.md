# soloq-val-previa

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `soloq-val-previa/gen.js`. «75 streamers, 22 días y 44 mil euros: arranca el SoloQ de Valorant» (canal Axelsine, domingo 16/11/2026) es la previa del SoloQ Challenge de VALORANT de Mixwell (del 16/11 al 07/12/2026). Sale del paquete `2026-11-16_arranca-el-soloq-de-valorant--paquete.md` (PKB de Axl, `videos/2026-11/`). Es el primer video de VALORANT del canal en láminas.

- **Versión 3 (13/11): son 19 láminas y `sv-reposo`.**
  - Salieron `sv-mixwell`, `sv-horcus`, `sv-sirmaza` y `sv-black`.
  - Entraron `sv-top-pro`, `sv-top-elo` y `sv-top-casual` (layout G, `topCinco()`): los cinco canales más grandes de cada categoría, con foto de Twitch, nombre, seguidores y una línea chica (CAMPEÓN 2022 y 2021, LA JUBILONA).
  - `sv-cierre` dice «HOY 5 PM (CDMX): DÍA 1».
  - El guion marcado es el de la versión 3.
  - La versión 1 tenía 20 láminas y el reposo; el paquete decía 21.
- **Banda ARRIBA con el formato de jhin-letalidad:**
  - De `jhin-letalidad/gen.js` se copiaron el riel (con otra semilla y los colores de VALORANT), el panel, la sección, la guía y `dato`.
  - Clips: `node tools/laminas.mjs creator/soloq-val-previa --banda=arriba` deja en `video-out/laminas-arriba/` 21 mp4 H.264 de 1080×680 con `alfa: false` y `banda: "arriba"`, sus PNG, `manifest.json` y `guion-marcado.txt` (la sección 3 del paquete sin las comillas de bloque).
- **Fondo:** azul noche con el patrón de contornos de la web, imitado con `kit.patron('curvas')` al 8 %. Va en `assets/contornos.svg`, que escribe `gen.js`: en línea y repetido en las 21 láminas, el `index.html` pesaba 740 KB. Todas las láminas se ven desde el cuadro 0.
- **Capturas de soloqvalorant.com** (del 12/11, en el `--assets` del paquete):
  - En `assets/capturas/` están las cinco recortadas en la fila 2276, justo antes del aviso de cookies, y en WebP. `web-pickem-caras.jpg` es el recorte de la rejilla de caras.
  - `ventana()` las enmarca como ventana de navegador: barra con `soloqvalorant.com`, esquinas de 10 px y sombra. Nunca van a pantalla completa sin marco.
  - Las tres láminas de capturas (`sv-arranca`, `sv-mas-retos` y `sv-web`) llevan su dato en una `placa()` sobre la ventana.
- **Las caras son la foto de perfil de Twitch** (300×300, de `static-cdn.jtvnw.net`), en círculo de 150 px con borde de 3 px.
  - La URL de cada foto salió de la consulta pública de Twitch (`gql.twitch.tv`, `profileImageURL`), porque cuatro páginas no la traen en el HTML.
  - Los seguidores del paquete (TwitchTracker, 12/11) se confirmaron ahí el 13/11. En pantalla van redondeados como dice el paquete: Horcus 1.004.174 sale como 1,0 M y Santipatico 74.655 como 75 MIL.
  - Las cifras van en rojo, con el «M» o «MIL» a media altura: a 64 px enteros se juntaban entre columnas.
- **Logos e íconos:**
  - De Wikimedia Commons: el logo de VALORANT (la V con la palabra, versión negra pasada a hueso), el ícono de TikTok (sin su fondo negro, en hueso) y la bandera de Argentina.
  - De valorant-api: el ícono de Radiante (tier 27).
- **El verde de la web es `#53FC18`**, medido en las capturas; el paquete proponía `#B6F36A` «o el más cercano».
- **La entrada más larga dura 2,65 s** (`sv-mas-retos`).

⚠️ **Recetas cambiadas** (anotadas también en el paquete):
- **`letrero` y `palabra` no pasan de dos.** El molde del letrero (foto, nombre y barra) va en `sv-septimo` y `sv-kadnita`, pero la receta `letrero` solo en `sv-septimo`.
  - En `sv-kadnita`, la bandera ondea a mano y las líneas entran con `lineas`.
  - En `sv-clips` la frase entra con `golpe` en vez de `palabra`.
- **Los tres top 5:**
  - La receta principal es el `contador` de los seguidores, que puede repetirse.
  - Las caras entran con la curva golpe y `data-paso`: en la Pro desde arriba, en Elo alto desde la derecha y en Casual desde abajo.
  - `sv-top-pro` y `sv-jubilona` van seguidas y las dos dejan caer las caras desde arriba, pero la principal de `sv-jubilona` es la separación del final.
- **`crece` del kit es el FLIP de una celda:** las columnas de `sv-ladders` suben a mano (scaleY desde abajo con la curva `entrada`).
- **`pulso` no existe:** el de `CASUAL` es un latido con la curva golpe.
- **`ondea` no existe:** la bandera son 12 tiras que suben y bajan con un desfase que se apaga.
- **`sv-jubilona`:** las caras caen con la curva golpe y al final se separan a mano, porque `rebanadas` parte una imagen y no separa elementos.
- **`iris` (`sv-web`) va a mano sobre la ventana,** porque el del kit recorta toda la `<section>`.
- **`brillo` del kit es para texto:** el ícono de Radiante lleva un barrido de luz a mano, con la máscara del propio ícono.
- **`data-paso`:** no hay voz alineada, así que los pasos van escalonados en el orden del guion.

⚠️ **Otros cuidados:**
- **🚫 Nada de groserías ni chistes en pantalla, ni en las notas del orador.** La comparación con la web de ElmilloR va solo en la voz.
- **No se dice que las cuentas arrancan «de cero» ni en Hierro:** no hay fuente.
- **`sv-reglas`:** las líneas chicas («SIN DÚO NI EQUIPO», «PARTIDA COMPLETA» y «QUE DA RIOT») salen de las normas de la web y de la voz.
- **`sv-kadnita` suma ARGENTINA** a «LA ÚNICA LATINA», porque la bandera sola no dice el país.
- **El revuelto de `sv-septimo` se oculta hasta que empieza,** porque si no, el cuadro 0 enseñaba letras al azar.
- **Las capturas son de antes del arranque** (la clasificación está vacía).

## Identidad visual

- **Azul noche `#0F1923`**, con los contornos de la web al 8 %.
- **Rojo VALORANT `#FF4655`** para lo protagonista: 44.000 €, 200 €, 269, el 1.º de la Pro, AXL, las cifras de seguidores, MI APUESTA, el filo de las placas, el rombo del riel y los bordes de las caras.
- **Hueso `#ECE8E1`** para cifras y texto.
- **Verde de la web `#53FC18`** solo para lo que viene de la web: los botes y los premios.
- **Gris `#5B6B78`** para lo secundario.
- **Tarjetas** en `#16222D` con borde `#2A3A48`.

Bebas Neue en todo, y Archivo solo en la barra de la ventana.
