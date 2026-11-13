# zed

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `zed/gen.js`. Cumplelolero #33: «Zed cumple 14 años» (canal Axelsine, viernes 13/11/2026, un día antes de la final del Mundial). Sale del paquete `2026-11-13_zed-cumple-14-anos--paquete.md` (PKB de Axl, `videos/2026-11/`). Son 32 láminas y `zd-reposo`.

- **Banda ARRIBA con el formato de jhin-letalidad:**
  - Copiados de `jhin-letalidad/gen.js`: el riel (con otra semilla, `riel-zed`, y tres destellos: Zed y sus dos sombras, con el rombo en rojo), el panel, `arte`, `respaldo`, `dato`, `mitad`/`costura` y la ranura con el marco del HUD.
  - Clips: `node tools/laminas.mjs creator/zed --banda=arriba` deja en `video-out/laminas-arriba/` 33 mp4 H.264 de 1080×680 con `alfa: false` y `banda: "arriba"`, sus PNG, `manifest.json` y `guion-marcado.txt`.
  - **`guion-marcado.txt` es la sección 3 del paquete sin las comillas de bloque, con `{clip:faker-ryu}` tal cual.** Ese clip lo pone el montaje y no es una lámina. `laminas.mjs` copia el archivo de la carpeta del deck.
- **Estilo de la serie (senna y ambessa):** Bebas Neue y layouts A–F. El OTP va con el `letrero` del kit (retrato de la pantalla de carga `Zed_0`) y el emblema de Platino detrás al 40 %.
- **Assets:**
  - De Data Dragon: los splash (Zed 0, 2, 10, 13, 15, 58 y 69, Shen_0 y Yasuo_0), las 14 pantallas de carga, la centrada `Zed_0`, las habilidades (64 px ampliadas a 128 con Lanczos), los items 3157, 3026 y 3140 de la 16.22.1, el Cronómetro 2420 de la 13.24.1 y los íconos de Zed y Yasuo (128 ampliados a 192).
  - De Legends of Runeterra, las cartas `-full` en es_MX: 01IO009 y 01IO040 son arte apaisado (guardado a 1280×640); 01IO009T3 y 01IO003 son redondas (WebP con alfa a 640).
  - Copiados de otros decks: el emblema de Platino de `senna`, los logos T1, GEN y BLG de `blg-final`, la copa de `ganan` y el splash `Jhin_0` de `jhin-build`.
- **La entrada más larga dura 2,7 s** (`zd-asco`, el empuje lento). Ningún primer cuadro baja de 14 de brillo.

⚠️ **Recetas cambiadas** (anotadas también en el paquete):
- **La tabla del paquete usa `cortina`, `maquina`, `revuelto` y `crece` tres veces cada una**, y su propia regla dice que nada salvo `contador` y `empuje` pasa de dos. Los cambios para cumplirla:
  - en `zd-ryu`, las mitades entran con `empuje` y la receta principal es el `destello` de la diagonal;
  - en `zd-yasuo`, las líneas entran con `lineas`;
  - en `zd-sinfaker`, el tachón de T1 se traza a mano;
  - en `zd-partidas`, las barras crecen desde 0 con la curva `entrada` (regla de las gráficas); `crece` queda en `zd-kinkou` y `zd-ultima`.
- **`cortina`** («cada mitad entra desde su lado») va a mano en `zd-martes13` y `zd-shen`. **`iris`** va a mano sobre el arte en `zd-yasuo` y `zd-galactico`, porque el del kit recorta toda la `<section>`.
- **`brillo` del kit es para texto:** en `zd-caja` es un barrido de luz a mano sobre la carta.
- **«Cae con la curva golpe»** (`zd-final`, `zd-combo`, `zd-qss`) es la curva del kit, no una receta.
- **`data-paso`** (`zd-combo`): no hay voz alineada, así que los íconos entran escalonados en el orden del guion.
- **Ninguna lámina repite la receta principal de la anterior.**

⚠️ **Otros cuidados:**
- **El nombre del OTP no sale:** va «#1 DEL MUNDO · VIETNAM» (VIETNAM es un dato aparte, porque el campeón del `letrero` sale a 36 px y no se leía).
- **Faker y Ryu sí salen en pantalla**, porque el paquete los pide (`FAKER · SKT`, `RYU · KT`, `FINAL SIN FAKER`). No hay logo de KT: va como texto.
- **Las citas y groserías no van ni en pantalla ni en las notas del orador:**
  - la frase a Shen;
  - el «look at the skill»;
  - lo de «perro asco», «hijo de la chingada» y similares.

  `zd-asco` y `zd-huerfano` no llevan texto.
- **`zd-dosveces` dice lo que dice el cómic** (la voz ya lo separa con «en el cómic»).
- **`1.ª` y `2.º` van con `ord()`** (de blg-final), porque Bebas no trae ª ni º.
- **Rebanadas copia el `<img>` sin su filtro.** Por eso `imgMitad()` pone el filtro (gris u oscurecido) en la caja y no en la imagen.
- **En `zd-partidas`, la barra de 2026 (16 partidas) mide 12 px:** a escala no cabe el valor dentro, así que va justo a su derecha.
- **Sin dinero en pantalla.**

## Identidad visual

- **Negro sombra `#0B0A10`.**
- **Rojo Zed `#E03A3E`** para lo de Zed: el 14, cifras clave, la barra de 2025, el riel y la costura de las mitades.
- **Blanco `#F3EFE2`** para cifras y texto.
- **Dorado SKT `#C9A45C`** solo para Faker y SKT: SKT T1, el croma, FAKER, el QSS y los escalones 1–2, 2–2 y 3–2.
- **Gris `#5B6461`** para lo malo y lo que se compara: los 0 del Mundial, el T1 tachado, el 2026 del OTP, el Cronómetro quitado y el 0–1 y 0–2.
- **Marco del HUD** (`#010A13` con borde `#785A28`/`#C8AA6E`) en las ranuras de habilidades e items.

Bebas Neue.
