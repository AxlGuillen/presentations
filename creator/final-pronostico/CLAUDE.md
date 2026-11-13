# final-pronostico

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `final-pronostico/gen.js`. «Mañana alguien gana su primer Mundial sí o sí» (canal Axelsine, viernes 13/11/2026) es el pronóstico de la final del Mundial 2026, Gen.G contra BLG (sábado 14/11). Sale del paquete `2026-11-13_pronostico-final-gen-vs-blg--paquete.md` (PKB de Axl, `videos/2026-11/`). Son 24 láminas y `fp-reposo`.

- **Banda ARRIBA con el formato de zed:**
  - Copiados de `zed/gen.js`: el riel (otra semilla; el rombo partido en dorado y azul, y los destellos del lado del gameplay en dorado y azul), el panel, `arte`, `respaldo`, `dato`, `ord`, el layout B (`L_B`, con la línea del color del equipo), el D (`mitad`, `costura`, `imgMitad`) y el tachón.
  - Copiados de `blg-final/gen.js`: `logo()` y `foto()`, cajas del tamaño exacto del asset (constantes `LOGOS` y `FOTOS`).
  - Clips: `node tools/laminas.mjs creator/final-pronostico --banda=arriba` deja en `video-out/laminas-arriba/` 25 mp4 H.264 de 1080×680 con `alfa: false` y `banda: "arriba"`, sus PNG, `manifest.json` y `guion-marcado.txt` (la sección 3 del paquete sin las comillas de bloque).
- **Contra quién le ganó cada uno:**
  - Todo equipo que nombra la voz sale con su logo oficial y su resultado escrito al lado.
  - El camino de cada equipo usa el layout E, `tarjetas()`: cinco tarjetas de 168×300 en x 60–960, con el logo, la fase y el resultado. `DERROTA` va en rojo, con su filo rojo.
  - Gen.G va en dorado y BLG en azul en todo el deck.
- **Assets:**
  - Los logos GEN, BLG, T1, DK, HLE e IG y las fotos de Knight, Bin y Canyon salen de `blg-final`.
  - Los logos de LYON, KOI, TL, KC, TES y G2 salen de `ganan`. TL es el blanco, que solo va sobre fondo oscuro.
  - La copa sale de `ganan`; con fondo negro, en la portada y el cierre lleva una máscara radial para que no se vea el borde de su caja.
  - Las fotos de Chovy y Ruler son de lolesports (recortadas a su contenido, en WebP).
  - Los splash `Ahri_97`, `Akali_103` y `Ekko_59` son de Data Dragon.
- **Fondo:** cada lámina sin arte lleva el resplandor de su equipo (o los dos), así que ninguna arranca en negro. Las cifras y los revueltos se ocultan hasta que empieza su receta.
- **La entrada más larga dura 2,7 s** (`fp-marcador`).

⚠️ **Recetas cambiadas** (anotadas también en el paquete):
- **La tabla repite `cortina` tres veces y pone `revuelto` en dos láminas seguidas** (`fp-t1` y `fp-cuarto`).
  - `fp-camino-blg` reparte las tarjetas con `mazo`.
  - `fp-cuarto` traza los tres tachones con `dibujo`.
- **`fp-favorito`:** la dona es la de `kit.dona`, con su receta `dona` (traza cada arco en orden).
- **`crece` del kit es el FLIP de una celda:** en `fp-un-coreano`, la tarjeta de HLE crece a mano con la curva `asentar` y las demás bajan a gris.
- **`cortina`** (cada mitad desde su lado) va a mano en `fp-bin-canyon` y `fp-pronostico`. **`iris`** va a mano sobre el arte en `fp-league-next`.
- **El 3-0 de `fp-dk`** entra con la receta `golpe`. **Los logos de la portada** caen con la curva golpe.
- **`pulso` es un latido de escala con la curva golpe:**
  - en `fp-camino-gen`, IG y LYON laten cuando aparece su segunda tarjeta;
  - en `fp-cuarto`, late Gen.G.

⚠️ **Otros cuidados:**
- **Sin dinero ni palabras de apuestas.** La dona dice FAVORITO.
- **Chistes solo en la voz,** ni en pantalla ni en las notas.
- **El historial entre los dos (2023 y MSI 2024) no va.**
- **El pronóstico es de Axl** (`fp-pronostico` y `fp-marcador`): si lo cambia, se tocan esas dos.
- **«SU PRIMERA FINAL» de Chovy** se deduce de los datos; está marcado así en el paquete.
- **El año de Gen.G** pone en gris lo malo (G2, MSI, DK); el rojo queda solo para DERROTA y ELIMINADO.
- **En `fp-bin-canyon`** se agregaron `BIN · BLG` y `CANYON · GEN.G` bajo cada foto, porque la voz los nombra.

## Identidad visual

- **Azul noche `#0A0E17`.**
- **Dorado Gen.G `#C9A45C`.**
- **Azul BLG `#4FB3FF`.**
- **Blanco `#F3EFE2`** para cifras y texto.
- **Gris `#5B6461`** para lo eliminado y los logos tachados.
- **Rojo `#D2443C`** solo para DERROTA y ELIMINADO.
- **Tarjetas** en `#121826`.

Bebas Neue.
