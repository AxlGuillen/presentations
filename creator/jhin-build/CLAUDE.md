# jhin-build

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `jhin-build/gen.js`. «La build rara de Jhin» (canal Axelsine, 11/11/2026), del paquete `2026-11-11_build-jhin-cronofox--paquete.md` (PKB de Axl, `videos/2026-11/`). 25 láminas y `jb-reposo`.

- **Es el primer video del canal con la BANDA ARRIBA.** `<deck-stage data-recorte="1080:680:0:1240" data-banda="arriba">`, `kit.banda()` y el riel con `data-riel` (queda invertido: los destellos dorados del lado del gameplay, que ahora está abajo). Clips: `node tools/laminas.mjs creator/jhin-build --banda=arriba` → `video-out/laminas-arriba/` (26 mp4 H.264 de 1080×680 con `alfa: false` y `banda: "arriba"`, sus PNG, `manifest.json` y `guion-marcado.txt`, que es la sección 3 del paquete tal cual).
- **Zona segura:** nada de texto ni cifras en los primeros 180 px de la banda (las pestañas de TikTok); el texto va de y 180 a 640 y de x 60 a 960. El arte sí va a sangre. Se comprobó en Chrome midiendo la caja de cada renglón al final de cada lámina; lo único que sale fuera son los dígitos ocultos del tragamonedas de la portada.
- **El protagonista es el item:** cada item que nombra la voz se ve con su ícono oficial (Data Dragon 16.22.1, 64 px ampliados a 192 con Lanczos) y su nombre en inglés. El componente **`tarjeta()`** (tarjeta-item) imita el tooltip del juego: panel `#010A13` al 94 %, borde `#785A28`, ícono a 128 px, nombre, costo con el ícono de oro de CommunityDragon (`game/assets/ux/floatingtext/goldicon.png`), estadísticas en es_MX y la pasiva resaltada. Entra así: la tarjeta baja con `cortinilla`, el ícono cae con la curva `golpe`, las estadísticas con `maquina` y la cifra grande de la derecha aparece cuando empieza su `contador`.
- **Capturas reales:** si existe `assets/capturas/<hexoptics|stormrazor|gluttonous|ie|ldr|hydra>.png`, `tarjeta()` la usa en vez de la tarjeta (constante `CAPTURAS`). Se agrega el archivo y se regenera.
- **`inventario.png`** es la build real de la partida del 02/11: LDR, Hexoptics, Stormrazor, IE, Guardian Angel y Gluttonous Greaves, identificados contra los íconos oficiales. No es de un solo item, así que va en `jb-numeros`, donde la voz habla de «esta build».
- **Ninguna lámina arranca en negro:** las de dos mitades (`jb-runas`, `jb-sinergia`, `jb-quinto`) llevan una copia desenfocada debajo, porque sus mitades entran recortadas o desplazadas. **La entrada más larga dura 2,75 s** (`jb-critico`).

⚠️ **Recetas cambiadas** (anotadas también en el paquete):
- **`pulso` no existe en el kit.** En `jb-stormrazor` y `jb-nadie` es un latido de escala con la curva `golpe` más un brillo dorado.
- **La receta `golpe` parte texto.** Los íconos «caen con golpe» usando la **curva** `golpe`.
- **`brillo` es un barrido sobre texto.** En `jb-runas` lo hacen las palabras, y los íconos laten con un resplandor.
- **`palabra` salía tres veces.** En `jb-esmeralda` el texto entra con `letras`.
- **El aro de `jb-alcance` y las barras de `jb-numeros` y `jb-dano` crecen a mano** con la curva `entrada`. La `crece` del kit (FLIP) va en `jb-esmeralda`.
- **`cortina` (`jb-runas`) e `iris` (`jb-ulti`) van a mano,** como en senna.
- **En `jb-sinergia` la `cortinilla` va en un envoltorio dentro de cada mitad:** aplicada a la mitad reemplazaba su recorte diagonal y la derecha tapaba la izquierda.
- **En `jb-quinto` el oscurecido es un velo encima:** `rebanadas` copia la imagen sin su `filter`.

⚠️ **Otros cuidados:**
- **`CRONOFOX` está por confirmar:** es la constante de arriba de `gen.js`, y también sale en `jb-nadie`.
- **La Hexoptics no sube el daño de la ulti:** `jb-critico` va crítico → daño de ataque → R, y `jb-distancia` es estilo de juego.
- **`jb-quinto` lleva los nombres completos** (TITANIC HYDRA · GUARDIAN ANGEL), porque la regla principal pide el nombre en inglés.
- **Los nombres y la R:**
  - En es_MX la R se llama «Llamado a Escena», pero en pantalla va `CURTAIN CALL`, como pide el paquete.
  - La runa va como `PIES VELOCES` (la voz); en el cliente es «Sobre la Marcha».
- **El ícono de Brujería solo existe a 32 px** (Data Dragon y CommunityDragon). Va ampliado con Lanczos a 168 px y se ve suave.
- **El op.gg de `jb-nadie`:** las ranuras 1–4 y 6 van vacías (no se inventan); la fila de Cronofox es la build que narra la voz.
- **El glifo de Twitch** es el de simple-icons, en el morado de la marca.
- **Sin dinero en pantalla,** salvo el costo dentro de la tarjeta.

## Identidad visual

Banda de 1080×680 **arriba**. **Negro vino `#0D0A0B`**, **dorado Jhin `#E0B354`** para lo de la build nueva (cifras clave, barras protagonistas y el riel), **blanco `#F3EFE2`** para cifras y texto, **rojo `#D2443C`** solo para lo malo (el 2–5 con Hubris, el 7–8 de las botas y el tachón de Swiftness), **gris `#5B6461`** para la comparación y la build vieja, y **azul tooltip `#010A13` con borde `#785A28`** solo en las tarjetas y las ranuras del HUD. El riel lleva cuatro destellos (las cuatro balas de Jhin). Bebas Neue.
