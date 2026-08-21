# Feature propuesta: presentación → video narrado

> Estado: **propuesta, sin implementar**. Documentado el 21/ago/2026.

Convertir cualquier deck del portafolio en **un solo MP4 narrado con subtítulos**, sin editar video a mano. El objetivo comercial es poder decirle al cliente: *"de tus datos hago la presentación, y de la presentación hago el contenido para redes"*.

El deck vertical (`/soloq/`, 1080×1920) es el candidato ideal para el primer prototipo: en 9:16 con voz y subtítulos **es literalmente un reel**.

## Por qué es viable

La materia prima ya existe en el repo:

- Cada `<section>` lleva `data-speaker-notes` con la idea de esa diapositiva.
- Los datos duros (premios, cifras, salarios) están estructurados en `soloq/gen.js`.
- El deck es HTML real, así que se puede capturar a imagen sin rehacer el diseño.

## Pipeline

```
gen.js / speaker-notes  →  guion.json  →  ElevenLabs (audio + timestamps)
                                              ↓
        Playwright (PNG por slide)  →  ffmpeg  →  video.mp4 + subs.srt
```

1. **Guion** — Un script recorre las slides y produce `guion.json`:
   `[{ slide: 3, texto: "JavierLoL se llevó 32 mil euros..." }, ...]`.
   Se redacta con tono de video (no de presentación) y se cura a mano una vez.

2. **Voz — una sola generación, no un clip por slide.**
   Se manda el guion completo concatenado a
   `POST /v1/text-to-speech/{voice_id}/with-timestamps`.
   Devuelve un MP3 continuo (prosodia natural, sin cortes entre frases) **más el
   alineamiento carácter por carácter**. Como sabemos en qué offset de carácter
   empieza la narración de cada slide, mapeamos *offset → segundo exacto* y de ahí
   salen los tiempos de cambio de diapositiva.

3. **Captura** — Playwright headless abre el deck real, navega slide por slide y
   exporta PNG a tamaño de diseño. Al capturar el deck de verdad, el video siempre
   refleja la última versión publicada.

4. **Ensamblado** — ffmpeg monta las imágenes con la duración que dicta el
   alineamiento (+ ~0.4s de aire y un mínimo por slide para que ninguna parpadee),
   crossfade suave y música de fondo opcional.

5. **Subtítulos** — salen del mismo alineamiento, palabra por palabra y con timing
   exacto: **no hay que transcribir ni ajustar nada**. Se pueden quemar en el video
   (mejor para redes) o servir como `.srt` aparte.

6. **Publicación** — `soloq/video.mp4` en el repo y un botón "▶ Ver como video" en la
   card de la galería. Mismo dominio, cero infraestructura extra.

## Detalles de implementación ya previstos

- **Usar `alignment`, no `normalized_alignment`.** La API devuelve ambos; el
  normalizado expande el texto (`32 000 €` → *treinta y dos mil euros*) y desplaza
  los índices, rompiendo el mapeo con nuestro guion.
- **Trocear en frontera de diapositiva.** Si un deck largo supera el límite de
  caracteres por petición, se parte en varios envíos cortando entre slides y se
  acumula el offset de tiempo; el timing sigue siendo exacto.
- **La API key nunca al repo** — el repositorio es público. Va en `.env` local y en
  las variables de entorno de Vercel si algún día se genera en CI.
- **Regenerable**: si cambia una cifra en `gen.js`, se vuelve a correr el módulo y
  los tiempos se recalculan solos.

## Variante: "modo video" en la propia web

Antes o además del MP4, el deck puede autoreproducirse en el navegador: avanza solo,
narra con el audio pregenerado y muestra los subtítulos como overlay. Es puro HTML,
queda espectacular para demo en vivo, y el MP4 se reserva para redes y WhatsApp.

## Qué NO hacer

**Video generativo** (IA generando imágenes en movimiento). Es caro, lento y aquí
resta: la fuerza de este producto es que el video es *fiel* a la presentación.

## Interfaz objetivo

```bash
node video.js soloq/          # → soloq/video.mp4 + soloq/subs.srt
```

## Pendiente para arrancar

- [ ] API key de ElevenLabs en `.env` (y `voice_id`; si no, voz española neutra)
- [ ] Prototipo end-to-end con `/soloq/`
- [ ] Generalizar a `node video.js <carpeta>/`
- [ ] Botón "▶ Ver como video" en las cards de la galería

## Referencias

- [Endpoints con timestamps (blog)](https://elevenlabs.io/blog/new-text-to-speech-endpoints-with-timestamps)
- [Create speech with timing (API)](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
- [Forced Alignment](https://elevenlabs.io/docs/overview/capabilities/forced-alignment) — alternativa si algún día el audio no lo genera ElevenLabs
