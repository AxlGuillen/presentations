---
name: verificar-deck
description: Verificación de un deck de este repo — desbordes de altura, revisión visual slide por slide y captura real en Chrome. Usar tras cualquier cambio de contenido o estilos en un deck, o cuando el usuario pida revisar/verificar una presentación.
---

# Verificar deck

Las diapositivas tienen altura fija: lo que desborda se corta al presentar o exportar. Verifica siempre tras cambiar contenido.

## Pasos

1. **Servir y abrir**: usa el Browser pane con el server estático del proyecto (`.claude/launch.json`, entrada `presentacion`) y navega a `/<carpeta>/`.
2. **Desborde** (el chequeo del CLAUDE.md): ejecuta en la página, con la ALTURA de diseño del deck (1080 u 1920):

```js
[...document.querySelectorAll('deck-stage section')]
  .map((s, i) => ({ i: i + 1, label: s.dataset.label, over: s.scrollHeight - ALTURA }))
  .filter(x => x.over > 2)
```

Debe devolver `[]`. Si algo desborda, ajusta padding/márgenes **solo en esa diapositiva** (en el `gen.js` si el deck es generado) y regenera. Ojo: los elementos decorativos absolutos que sangran fuera de la slide inflan `scrollHeight` — envuélvelos en un contenedor `position:absolute; inset:0; overflow:hidden`.

3. **Revisión visual**: recorre las slides (clic en las miniaturas del rail) y toma screenshots de las que cambiaron. En decks 9:16 revisa que todo siga dentro de la banda segura de TikTok.
4. **Si el deck usa GSAP**: el Browser pane embebido NO corre `requestAnimationFrame`, así que ahí las timelines no avanzan — no es un bug del deck. La verificación real de animaciones es `node tools/capturar.mjs <carpeta>` (Chrome de verdad, espera 2 s) y revisar los PNG de `<carpeta>/video-out/slides/`: deben mostrar los **estados finales** (barras llenas, contadores completos). Para ver un estado intermedio, seekea a mano: `section.__tl.time(t)`.
5. **Pasos (`data-step`)**: si la slide los usa, valida con `ds.next()`/`ds.prev()` que revela/oculta en orden y que la captura PNG sale con todo revelado.
6. **Tras cambios de estructura del sitio** (rutas, vercel.json): verifica en producción con `curl -sI` sobre `/`, `/<carpeta>/` y algún asset.
