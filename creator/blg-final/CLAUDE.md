# blg-final

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `blg-final/gen.js`. «BLG: de romperme el corazón a mi equipo» (canal Axelsine, 12/11/2026): la previa de opinión de la final del Mundial 2026 (Gen.G contra BLG, sábado 14/11), del paquete `2026-11-12_blg-de-romperme-el-corazon--paquete.md` (PKB de Axl, `videos/2026-11/`). Los datos salen del archivo `--datos.md` del mismo paquete. Son 27 láminas y `bf-reposo`.

- **Banda inferior** (formato 4), con el formato copiado del `index.html` real de jhin-build y t1-blg:
  - `<deck-stage data-recorte="1080:680:0:1240" data-banda="abajo">`, `kit.banda()` y el riel con `data-riel`. El riel lleva cinco destellos, uno por jugador: los del lado del gameplay en azul y los de abajo en blanco. El rombo va en azul.
  - Clips: `node tools/laminas.mjs creator/blg-final` deja en `video-out/laminas/` 28 mp4 H.264 de 1080×680 con `alfa: false`, sus PNG, `manifest.json` y `guion-marcado.txt`. Ese guion es la sección «Guion marcado» del paquete, tal cual.
- **El paquete dice «29 + reposo», pero su guion y su tabla traen 27 marcas.** Van las 27 y el reposo; no se inventaron dos.
- **Las presentaciones usan un solo molde, `perfil()`:** foto oficial a la derecha, nombre a 190 px, rol en azul, una regla y un dato grande. Se repite el molde, no la receta:

  | Lámina | Receta |
  |---|---|
  | Viper | fundido lento |
  | Knight | `rebanadas` y `letras` |
  | Bin | `cortinilla` tajo |
  | Xun | `pincel` |
  | ON | `destello` y `empuje`, sobre el splash de Seraphine |
  | Daeny | `revuelto` |

- **Daeny no tiene foto oficial**, porque `getTeams` de lolesports solo trae jugadores. En el lugar de la foto va el logo de BLG; no se inventa ni se ilustra ninguna cara.
- **Fotos oficiales:** salen de `getTeams` de lolesports del 11/11 (las de BLG son de 2026, al igual que las de Canyon y Faker). Están recortadas a su contenido y guardadas en WebP con alfa. `FOTOS` en `gen.js` guarda el tamaño de cada una para que `rebanadas` y `pincel` la copien sin deformarla.
- **Recetas principales, en orden:**
  1. lineas
  2. voltea
  3. contador
  4. sello
  5. empuje
  6. bento
  7. fundido
  8. fundido
  9. tragamonedas
  10. cortinilla iris
  11. rebanadas
  12. maquina
  13. golpe
  14. mazo
  15. cortinilla tajo
  16. multikill
  17. voltea
  18. letras
  19. dibujo
  20. pincel
  21. destello
  22. revuelto
  23. bento
  24. marcatextos
  25. cortinilla iris
  26. contador
  27. palabra

  Ninguna se repite en dos láminas seguidas, **salvo `bf-viper` → `bf-viper-cita`**, que el paquete pide con el mismo fundido lento.

⚠️ **Cuidados:**
- **`bf-viper` y `bf-viper-cita` son el único momento serio:**
  - Llevan fondo liso y entran con un fundido lento: la foto pasa de 25–30 % a 100 % en 2 s y los textos le siguen. Sin desplazamientos, escalas, golpes, conteos ni sacudidas.
  - La foto arranca visible para que la lámina no empiece en negro.
  - La cita va en **Archivo 600** (la única lámina con otra fuente) y la fuente en chico: «Viper, entrevista tras BLG 2-0 HLE · Mundial 2026».
  - Puede que en el montaje la tape el clip de la entrevista.
- **El logo de DAMWON** sale de Wikimedia Commons (`DAMWON_Gaming_logo_square.png`), porque lolesports solo da el actual de Dplus KIA. Su texto venía en gris oscuro y se aclaró a hueso para que se lea sobre el negro.
- **`bf-mids-coreanos` lleva los logos de IG, FPX y EDG**, de `ganan/assets/logos`. El paquete solo lista el de EDG, pero son los equipos de Rookie, Doinb y Scout, y no hay foto oficial vigente de los tres.
- **Groserías:** «un chingo», «hijos de su puta madre», «hijo de la chingada», «pendejos» y «cabrón» no van en pantalla ni en las notas del orador.
- **El 10 contra 3 es una gráfica:** «MUNDIALES · COREA 10 · CHINA 3», sin banderas ni chistes.
- **La línea de Chovy** sigue en las notas de `bf-pregunta`, pero en pantalla solo va «¿POR QUIÉN VAN? · SÁBADO 14/11». Si Axl la quita del guion, no hay que tocar nada más.
- **Por verificar antes de grabar** (lo pide el paquete): Corea 10 y China 3, y la fecha de la final. Están en `bf-10-3` y `bf-pregunta`.
- **Knight no tiene dato grande en el paquete** (solo «KNIGHT · MID»). Va «2023: GANÓ TODO EN CHINA», que es lo que dice la voz.

## Identidad visual

Banda de 1080×680 **abajo**:
- **Negro `#0B0B0E`.**
- **Azul BLG `#36CFF3`** para lo que va a favor de BLG: roles, el 3-1, «A MI EQUIPO», la barra de China y los tachones de HLE y DK.
- **Rojo T1 `#E4002B`** solo para el dolor de T1: el 13-0, «CORAZÓN», «Y NI ASÍ», el tachón del 13-0 y la X sobre T1.
- **Dorado Gen.G `#AA8B56`** para Gen.G y Canyon.
- **Blanco `#F3EFE2`** para las cifras.

Cada lámina sin splash lleva de fondo el resplandor del color de su equipo y, a veces, el logo en marca de agua; así se ve desde el cuadro 0. Bebas Neue en todo, salvo la cita de Viper.
