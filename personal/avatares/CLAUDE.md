# avatares

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `avatares/gen.js`. Demo de las **transiciones integradas** de los avatares 3D (v2, 13/11/2026): el clon de Axl, Axelsine y el clon de Jhin mueven las láminas con las manos y los pies. Son 8 láminas de 16:9 y 7 transiciones.

- **Estado:** de prueba. **Sin listar** en la galería (no está en `DECKS`) y con `noindex`.
- **Los clips sí van al repo:** Axl lo autorizó el 13/11/2026, aunque llevan su cara y el repo es público.

**De dónde salen los clips:** `C:/BlenderProyectos/acciones/v2/`.

- `scripts/acciones2.py` anima y renderiza en Blender (918 px, 30 fps, fondo transparente, sombra en una «pared» detrás del avatar y contraluz índigo). Cada ficha trae la **trayectoria por cuadro**: palmas, puntas de los dedos, pies, talones, cadera, cabeza y la boca de la Whisper, normalizadas desde abajo a la izquierda del cuadro.
- `scripts/empaquetar2.py` desvanece el alfa en las orillas (para que la sombra no tenga corte), saca un webm VP9 con alfa y escribe `catalogo_v2.json` con el **ancla** (los pies del último cuadro).
- `gen.js` copia a `assets/avatares/` solo los clips que usa y calcula dónde va lo que el avatar agarra (la tarjeta del mantel queda justo en su palma en el cuadro `agarra`).

**El escenario:** cada clip se dibuja a `S = 900` px y los pies de todos pisan la línea `PISO = 1030`. Un punto del clip (u, v) cae en el deck en `x = izq + u·S`, `y = arr + (1−v)·S`, con `izq = xPies − ancla.u·S` y `arr = yPies − (1−ancla.v)·S`. El deck mueve al avatar en el aire (caídas, saltos); el clip solo trae la pose.

**`avatares.js`** es la lógica, todavía local. Si funciona, pasa al kit como `kit.avatares()`.

- **Transición:** deck-stage cambia de lámina al instante y avisa con `slidechange`. Se clona la lámina anterior encima de la nueva (el «fantasma», `data-fantasma`) con una **foto** del último cuadro de los avatares que se van; los que siguen en la lámina nueva se mudan sin cortar su bucle.
- **Cada efecto es una función por cuadro** (`EF.<efecto>(E)` devuelve `cada(f)`), que lee el cuadro real del clip y amarra la lámina a la trayectoria:

| Efecto | Quién | Qué pasa |
|---|---|---|
| `baja` | Axelsine (y el clon en el final) | Cae, se cuelga de la orilla de arriba (la lámina da un jalón al recibirlo), la baja en dos tirones, la suelta y aterriza; la lámina sigue cayendo con su velocidad |
| `sube` | clon | Sube desde abajo empujando la orilla con las palmas; la lámina se enrolla (rollo de papel que engorda), salta y la avienta |
| `mantel` | clon | Agarra la tarjeta `[data-arrastre]`, jala (la lámina se cae como mantel), la avienta en arco con giro y aterriza en su lugar en la lámina nueva con aplastamiento y resorte |
| `pela` | Axelsine volteado (`pela-izq`) | Cae junto a la esquina, la esquina se levanta hacia su mano y la lámina se pela: el doblez es la mediatriz entre la esquina y la mano, el revés es papel lavanda con sombra |
| `patada` | Jhin | Entra de un salto y patea: cada `[data-pieza]` (y la foto del avatar anterior) sale volando con gravedad, giro y rebote en el piso |
| `disparo` | Jhin | Cámara lenta (×0.24) desde un cuadro antes del tiro; fogonazo en la boca de la Whisper, bala, grietas (Voronoi) desde el agujero y esquirlas que caen girando en 3D |

- **Integración:** sombra de contacto por actor (se encoge y aclara con la altura), polvo al aterrizar, sacudida de cámara (`translate` de la lámina), desenfoque por velocidad en lo que vuela, física con subpasos de 1/240 s (determinista).
- **Hacia atrás no hay transición.**
- **En reposo:** el avatar respira en bucle (`<pj>/reposo`; Axelsine a la derecha usa `reposo-izq`).

**Grabarlo a video:** `node tools/grabar-avatares.mjs personal/avatares [--ancho=1920] [--quieto=1.6]` deja `video-out/avatares.mp4`.

- Abre el deck con `?reloj=1`: `avatares.js` quita el ticker de GSAP y no reproduce los `<video>`. La grabadora llama `window.__avanzar(1/30)`, que mueve el reloj de la escena (multiplicado por el ritmo de la cámara lenta), busca cada clip en su cuadro y espera el `seeked`.
- Después de cada → graba mientras `window.__ocupado()` diga que hay animaciones de GSAP vivas, y luego queda quieta.
- Por eso todo lo que tarda va con el reloj de GSAP (`tween`, `gsap.delayedCall`), nunca con `setTimeout`.

## Identidad visual

La de `dra` y `musk`: índigo `#4B3BD6` sobre blanco con puntitos, Figtree, y la portada y el final a color con lavados.
