# jhin-letalidad

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `jhin-letalidad/gen.js`. «La build que dije que no servía contra Vayne jungla, Brand ADC y Yuumi» (canal Axelsine, 12/11/2026). Es la segunda parte de jhin-build: Jhin con letalidad (Hubris y The Collector) contra un draft de cristal, y ganó 14/5/7. Sale del paquete `2026-11-12_jhin-build-que-no-servia--paquete.md` (PKB de Axl, `videos/2026-11/`). Son 24 láminas y `jl-reposo`.

- **Banda ARRIBA, con el formato y la `tarjeta-item` de jhin-build:**
  - Copiados tal cual de `jhin-build/gen.js`: el riel (con la misma semilla, así que es el mismo riel), el panel, `arte`, `respaldo`, `dato`, `icono`, `tarjeta`, `mitad`/`costura` y `ranuras`.
  - Lo nuevo:
    - `ranuras` acepta `minutos`, para el minuto de compra bajo cada ícono (layout E);
    - `retrato()` es el layout G: el ícono cuadrado del campeón con el borde rojo del equipo enemigo y su rol debajo;
    - `barra()` es para las gráficas.
  - Clips: `node tools/laminas.mjs creator/jhin-letalidad --banda=arriba` deja en `video-out/laminas-arriba/` 25 mp4 H.264 de 1080×680 con `alfa: false` y `banda: "arriba"`, sus PNG, `manifest.json` y `guion-marcado.txt`. Ese guion es la sección 3 del paquete, sin las comillas de bloque.
- **🚫 Sin nombres de jugadores en ninguna lámina.** El ranking de `jl-ultimo` y las barras de `jl-dano` y `jl-oro` van solo con el ícono del campeón. No hay capturas: si se agregan a `assets/capturas/hubris.png` o `collector.png` (que reemplazan la tarjeta), los nombres tienen que ir tapados.
- **Campeones enemigos:** cada uno sale con su ícono oficial y su rol. Los roles troll, JUNGLA de Vayne y ADC de Brand, van en rojo. En las láminas de plano completo (`jl-vayne`, `jl-brand` y `jl-yuumi`), `ficha()` pone el ícono chico junto al nombre y al rol.
- **Assets:**
  - Los items, el splash de Jhin y el ícono de oro se copiaron de `jhin-build/assets`, y el arte de Vayne de `vayne-troll/assets`.
  - De Data Dragon 16.22.1 se bajaron:
    - los íconos de campeón, de 128 px ampliados a 192 con Lanczos;
    - los splash `Brand_0` y `Yuumi_0`;
    - las runas: las menores de 64 px ampliadas a 128 y los árboles de 32 px ampliados a 96, así que se ven suaves.
- **La entrada más larga dura 2,65 s** (`jl-build`). El primer cuadro más oscuro tiene brillo 14 de 255.

⚠️ **Recetas cambiadas** (anotadas también en el paquete):
- **`astilla` no existe.** En `jl-papel`, las grietas del marco se trazan con `dibujo` y la ranura baja al 40 % a mano.
- **`crece` del kit es el FLIP de una celda.** El Jax de `jl-papel` crece a mano, con la curva `asentar`, y las barras de `jl-dano` crecen a mano con la curva `entrada`.
- **`pulso` no existe**, así que es un latido de escala con la curva `golpe`, como en jhin-build. En `jl-honesto` la barra de 913 late en alto (`scaleY`).
- **`cortina` (`jl-cristal`) e `iris` (`jl-brand`) van a mano**, como en jhin-build.
- **`data-paso` («entra cuando la voz lo nombra»):** no hay voz alineada y las láminas duran 2,5 s, así que los pasos van escalonados en el orden del guion. Cada pieza lleva su `data-paso` para cuando el montaje los sincronice.
- **En `jl-runas`, el encendido de gris a color es a mano.** Recuerdos Macabros se enciende con Cazador de Tesoros.
- **Variedad de recetas:** ninguna se usa más de 2 veces (sin contar `contador`, `golpe` y `maquina`) y dos láminas seguidas nunca repiten la principal.

⚠️ **Otros cuidados:**
- **Sin cifras inventadas:** `jl-almas` no dice cuántas almas juntó la Cosecha y `jl-nieve` no dice cuánto daño de ataque dio Hubris (el contador de kills, 0 → 14, sí es dato).
- **`CLARIDAD MENTAL`**, como la dice la voz; en el cliente es «Concentración Profunda».
- **«Last pick» va solo en la voz.**
- **`jl-honesto` no es una derrota:** la barra de 867 va en dorado.
- **Sin dinero en pantalla,** salvo el costo dentro de las tarjetas y las cifras de oro de `jl-oro`.
- **En `jl-tragar`, el revuelto del 2–5 solo baraja 2, 5 y –,** para no enseñar otras cifras.

## Identidad visual

La de jhin-build:
- **negro vino `#0D0A0B`;**
- **dorado Jhin `#E0B354`** para lo de Axl (la build de letalidad, sus cifras, sus barras y el 35);
- **blanco `#F3EFE2`;**
- **rojo `#D2443C`** para el otro equipo y lo malo: los roles troll, el 1/9/2, el 2–5, las 8 muertes, el 17, el último lugar y los bordes del draft enemigo;
- **gris `#5B6461`** para las barras de comparación y la build de Cronofox cuando se descarta;
- **azul tooltip `#010A13` con borde `#785A28`** en las tarjetas, las ranuras y los marcos de los íconos.

El riel es el de jhin-build. Bebas Neue.
