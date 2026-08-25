---
name: guion-video
description: Escribir el guion.json de narración de un deck y generar su video MP4 con voz y subtítulos (Fish Audio + ffmpeg). Usar cuando el usuario pida narrar un deck, generar su video, o escribir/ajustar un guion.
---

# Guion y video narrado

Convierte un deck en `video-out/video.mp4` narrado con subtítulos sincronizados palabra a palabra.

## El contrato: `<carpeta>/guion.json`

```json
{
  "voz": "<reference_id de Fish Audio, opcional — sin él usa la voz por defecto>",
  "velocidad": 1.0,
  "temperatura": 0.5,
  "slides": [
    { "slide": 1, "texto": "[excited] Narración de la primera diapositiva…" },
    { "slide": 8, "texto": "…", "velocidad": 0.9 }
  ]
}
```

`velocidad` (0.5–2, global o por slide — p. ej. 0.9 en el cierre) y `temperatura` (global; más baja = entonación más consistente entre clips) son opcionales.

## Escribir el guion

- Parte del contenido real de cada slide y de sus `data-speaker-notes` (ahí está la intención de cada diapositiva). No leas la slide en voz alta: nárrala — tono conversacional, números redondeados al hablar, una idea por slide.
- Longitud: la slide dura lo que dure su narración (+1 s de aire). Para TikTok apunta a 6–12 s por slide; para decks informativos hasta ~20 s.
- El texto va a TTS: evita siglas crípticas y símbolos (escribe «diecinueve horas», no «19 h»), y usa puntuación normal — los subtítulos se parten por puntuación y ~40 caracteres.
- Enseña el borrador del guion al usuario antes de gastar API.

## Etiquetas de expresión (que no suene plano)

El modelo `s2.1-pro-free` (familia S2) honra etiquetas **entre corchetes** dentro del texto — verificado: cambian la interpretación y NO aparecen en los subtítulos (y video.mjs las filtra por si acaso):

- **Emoción** al inicio de la oración: `[excited]`, `[confident]`, `[calm]`, `[curious]`, `[proud]`, `[worried]`, `[sarcastic]`, `[hopeful]`, `[determined]`…
- **Tono**: `[whispering]`, `[soft tone]`, `[emphasis]`, `[in a hurry tone]`.
- **Pausas**: `[break]` (corta), `[long-break]` (~1 s) — mejores que las comas para el ritmo dramático.
- **Efectos** (con moderación): `[sighing]`, `[chuckling]`.

Reglas de la doc de Fish: **una emoción primaria por oración** (al inicio), máximo 3 etiquetas por oración, espaciar los cambios emocionales, y no saturar textos cortos. Un guion bien etiquetado usa 1–2 por slide: la emoción de arranque y quizá un `[long-break]` antes del remate. El modelo S1 legacy usa paréntesis `(tag)` pero **cobra** — no usarlo.

## Generar

1. Requisitos: `FISH_API_KEY` en `.env` (NUNCA al repo — es público) y `npm install` dentro de `tools/`.
2. `node tools/video.mjs <carpeta>` hace todo: captura PNGs si faltan, y si el deck usa GSAP (`<carpeta>/gsap.min.js`) renderiza los clips cuadro a cuadro con `tools/cuadros.mjs` — cada slide entra animada y se congela en su último cuadro el resto de la narración. La voz usa el modelo `s2.1-pro-free` (gratis; `s1` cobra).
3. Salidas en `<carpeta>/video-out/` (gitignored): `video.mp4`, `video-sin-subs.mp4`, `subs.srt`, `tiempos.json`.
4. **Publicar**: copia a mano el MP4 a la carpeta del deck (ej. `estancia/video.mp4`), enlázalo desde su card en la galería (patrón del botón «▶ Ver video» de estancia) y actualiza el README si aplica.

Si cambia el deck después de generar, borra `video-out/slides/` y `video-out/anim/` para que se recapture.
