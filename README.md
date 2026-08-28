# Presentaciones con IA

Portafolio de presentaciones web interactivas generadas con IA. La raíz es una galería con cards de preview; cada presentación vive en su propia subruta con sus propios assets. Sitio 100% estático, sin build ni dependencias.

**En vivo:** https://presentations-three-phi.vercel.app

## Estructura

```
/                    galería con las cards          index.html
/tabletas/           Comparativo Tabletas Rugged DYMMSA   · 16:9 · 22 slides
/soloq/              SoloQ Challenge 2026: premios vs salario mínimo · 9:16 · 28 slides
/lowelo/             Low Elo vs High Elo: el corte por LP · 9:16 · 7 slides
/estancia/           Propuesta: web + administración para estancia infantil · 16:9 · 8 slides
/ornn/               Ornn cumple 9 años (apoyo visual para TikTok) · 9:16 · 8 slides
/urgot/              Urgot cumple 16 años (apoyo visual para TikTok) · 9:16 · 5 slides
/talon/              Talon cumple 15 años (apoyo visual para TikTok) · 9:16 · 7 slides
/skins/              Los campeones con más skins (apoyo visual para TikTok) · 9:16 · 4 slides
/caras/              Las skins más caras del LoL (apoyo visual para TikTok) · 9:16 · 5 slides
/semana34/           Reporte semanal Jira: semana 34 (18–24 ago 2026) · 16:9 · 8 slides
404.html             página de error con enlaces de regreso
vercel.json          trailingSlash: true (imprescindible, ver abajo)
docs/                propuestas de features
tools/               módulo de video (captura + voz + montaje), solo local
```

Cada carpeta de presentación es autocontenida: su `index.html`, el runtime del deck (`deck-stage.js`) y su `assets/` con **rutas relativas**. Por eso `vercel.json` fija `trailingSlash: true`: sin la barra final, `/soloq` resolvería `assets/...` contra la raíz del sitio y las imágenes darían 404.

## Cómo se usan los decks

| Acción | Cómo |
|---|---|
| Navegar | `←` `→`, espacio, `Inicio`/`Fin`, o número de diapositiva |
| Modo presentación | tecla **P** (pantalla completa, oculta miniaturas); `Esc` para salir |
| Exportar a PDF | `Ctrl+P` → Guardar como PDF (una diapositiva por página) |
| Móvil | toca la mitad izquierda/derecha para retroceder/avanzar |

## Agregar una presentación

1. Crea `/nombre/` con su `index.html` y su `assets/` (siempre rutas relativas).
2. Copia `deck-stage.js` de un deck existente a esa carpeta.
3. Añade su card en el `index.html` de la raíz — hay un bloque comentado de ejemplo.
4. Commit y push: Vercel la publica en `/nombre/`.

## Desarrollo

```bash
npx serve .
```

`soloq/index.html` **se genera** con `node soloq/gen.js` — los datos viven en `gen.js`, no edites el HTML a mano. `tabletas/index.html` sí se edita directamente. Ver [CLAUDE.md](CLAUDE.md) para el detalle.

## Roadmap

- [**Presentación → video narrado**](docs/video-narrado.md): **implementado** con Fish Audio (`node tools/video.mjs <carpeta>`). Cada deck con un `guion.json` genera `video.mp4` con voz y subtítulos sincronizados. Primer video publicado: `/estancia/video.mp4`.

## Deploy

Vercel · proyecto `presentations` · preset **Other**, sin build command. Cada push a `main` despliega automáticamente.
