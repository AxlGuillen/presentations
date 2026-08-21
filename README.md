# Presentaciones con IA

Portafolio de presentaciones web interactivas generadas con IA. La raíz es una galería con cards; cada presentación vive en su propia subruta con sus propios assets (100% estático, sin build).

## Estructura

```
/                 → galería (index.html)
/tabletas/        → Comparativo Tabletas Rugged DYMMSA (horizontal 16:9, 22 slides)
/soloq/           → SoloQ Challenge 2026: premios vs salario mínimo (vertical 9:16, 28 slides)
vercel.json       → trailingSlash: true (necesario para que las rutas relativas de cada subruta resuelvan)
```

Cada carpeta de presentación es autocontenida: `index.html`, runtime del deck (`deck-stage.js`), y `assets/` propios con rutas relativas. Los decks se navegan con ←/→, tecla **P** para modo presentación a pantalla completa, y Ctrl+P para exportar a PDF.

## Agregar una presentación

1. Crea `/nombre/` con `index.html` + `assets/` (usa rutas relativas).
2. Añade su card en el `index.html` de la raíz (hay un bloque comentado de ejemplo).
3. Commit y push: Vercel la publica en `/nombre/`.

## Ver localmente

```bash
npx serve .
```

## Deploy

Vercel, preset **Other**, sin build command. Conectado al repo: cada push a `main` despliega.
