---
name: nuevo-deck
description: Scaffold de una presentación nueva en este repo — carpeta con gen.js + deck-stage.js, card en la galería, filas en README y CLAUDE.md. Usar cuando el usuario pida crear/agregar un deck o presentación nueva.
---

# Nuevo deck

Crea una presentación siguiendo las convenciones del repo. Antes de escribir código, define con el usuario (o deriva del encargo): **nombre de carpeta** (corto, minúsculas), **formato** (16:9 → `<deck-stage width="1920" height="1080">`, o 9:16 TikTok → `1080×1920` con banda segura `padding: 300px 84px 350px`), e **identidad visual** (paleta de 4–6 colores con un solo acento, tipografía de Google Fonts, texturas). La identidad se decide primero y se documenta después — nunca un deck con la paleta de otro.

## Pasos

1. **Carpeta y runtime**: `mkdir <nombre>` y copia `deck-stage.js` desde cualquier deck existente (todas las copias son idénticas a propósito — verifica con `md5 -q */deck-stage.js | sort -u` que sigue habiendo un solo hash). Si va animado, copia también `tools/vendor/gsap.min.js` a la carpeta.
2. **Generador**: escribe `<nombre>/gen.js` (CommonJS). Patrón de los existentes (`semana34/gen.js` es el más completo): comentario de cabecera con alcance y fuente de datos, datos/paleta arriba como constantes, `require('../tools/kit.cjs')` para fondos/texturas/sombras/diagramas, helpers de slide, `slides.push(...)` por diapositiva con `data-label`, `data-screen-label` y `data-speaker-notes`, y al final el template HTML con el botón «Presentar · P». Si anima: `<script src="./gsap.min.js"></script>` + `${kit.animador()}` + builders `animar('Etiqueta', (tl, s) => ...)`; estados iniciales solo con `tl.from()`. Pasos dentro de una slide: `data-step="1..N"`.
3. **Generar**: `node <nombre>/gen.js`. Rutas siempre relativas (`assets/foo.png`). Cierra el generador con `fs.writeFileSync(dest, kit.diferir(html), 'utf8')` para que los assets de todas las láminas menos la portada salgan diferidos (ver «Carga de assets» en CLAUDE.md).
4. **Galería**: card en el `index.html` raíz — clase de portada `.cover--<nombre>` en el CSS + bloque `<a class="card">` (hay plantilla comentada al final de las cards).
5. **Docs**: fila en la tabla de estructura del README, y en CLAUDE.md: fila en el árbol de Arquitectura, fila en la tabla generado/a-mano, y viñeta en Identidad visual.
6. **Verificar**: corre el skill `verificar-deck` (desborde + revisión visual).

No commitees sin que el usuario lo pida. Recuerda que el repo es público.
