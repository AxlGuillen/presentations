# guerras

Notas de este deck (se cargan al trabajar en su carpeta). Las reglas generales están en el `CLAUDE.md` de la raíz y el motor en `docs/motor/`.

## Qué es y decisiones

**GENERADO** por `guerras/gen.js`. **No es una presentación**: es el paquete de assets del episodio 1 de la serie de lore, una lámina por bloque del guion para ir cortando encima de la voz en off — por eso cada `data-screen-label` dice a qué bloque corresponde. El arte sale de **Legends of Runeterra** (`https://dd.b.pvp.net/latest/<set>/en_us/img/cards/<código>-full.png`, 2048 px), de la **wiki oficial** y de Data Dragon; el índice completo con códigos y URLs de los originales está en `guerras/ASSETS.md`. La decisión de diseño es que **los bloques sin arte oficial van en negro con un sello «sin registro»** en vez de rellenarse: es un episodio sobre historia que se perdió y el vacío dice lo mismo que el guion. ⚠️ **Sus assets NO pasan por `optimizar-imagenes.mjs`**: aquí las imágenes son el entregable, no decoración, así que se guardan a 1600 px para que aguanten un push-in al editar. ⚠️ El arte es de Riot y la política de contenido de fans sigue sin revisar — la nota está en ASSETS.md.

## Identidad visual

serie de lore #1, formato TikTok de siempre (banda 300/350, Bebas Neue) y animado. El vacío `#07070B`, **azul rúnico `#41C4E8`** de acento, pergamino quemado `#CFC4B2` para lo que se perdió y carmesí `#C4283C` reservado a Noxus y al remate. Dos cosas propias de este deck: el arte se muestra **entero y sin recortar** sobre una copia borrosa de sí mismo —son composiciones apaisadas en un lienzo vertical y aquí la imagen es el producto—, y los cinco Fragmentos de las Runas **no necesitan paleta** porque el arte de LoR ya les da un color a cada uno (verde, azul, violeta, rojo, ámbar).
