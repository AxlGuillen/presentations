# Presentaciones con IA

Portafolio de presentaciones web interactivas generadas con IA. La raíz es una galería con cards de preview, protegida con contraseña; cada presentación vive en su propia subruta dentro de su escritorio (`/work/`, `/personal/` o `/creator/`) con sus propios assets. Sitio 100% estático, sin build ni dependencias.

**En vivo:** https://presentations-three-phi.vercel.app

## Estructura

```
/                     galería «La cartelera»        index.html + portadas/
/personal/omicron/    Propuesta: redes, relaciones públicas y sitio para MT Omicron Sigma · 16:9 · 9 slides
/personal/dra/        Charla: DRA · Del pizarrón a la evidencia · 16:9 · 18 slides
/personal/musk/       Charla: Borrar antes de acelerar (iteración estilo Musk aplicada a DRA) · 16:9 · 14 slides
/personal/dra-1102/   Reunión de DRA del 2/nov/2026, con video narrado · 16:9 · 11 slides
/personal/lab/        Laboratorio de efectos: catálogo vivo del kit · 9:16 · 81 slides
/work/seating3dmap/   seating3dmap: el nuevo mapa 3D de UrVenue, fase por fase (en inglés) · 16:9 · 19 slides
/work/semana42/       Reporte semanal Jira: semana 42 (13–19 oct 2026) · 16:9 · 12 slides
/work/ultracode/      Charla: Ultracode en la práctica (caso Minuto Dulce) · 16:9 · 15 slides
/work/urvenue-video/  Más videos, rápido (para UrVenue; sin listar) · 16:9 · 4 slides
/creator/guerras/     Guerras Rúnicas · paquete de assets del episodio 1 de lore · 9:16 · 18 slides
/creator/helia/       La Ruina de Helia · paquete de assets del episodio 2 de lore · 9:16 · 18 slides
/creator/parche2621/  Parche 26.21 en recortes con marcatextos animado (montaje automático) · 9:16 · 17 slides
/creator/ganan/       ¿Por qué siempre ganan chinos y coreanos? (montaje automático) · 9:16 · 22 slides
/creator/suiza-qf/    Worlds 2026 · cuartos de final: flyers, camino y cara a cara · 9:16 · 10 slides
/creator/t1-blg/      Worlds 2026 · previa de la semifinal T1 vs BLG (banda inferior) · 9:16 · 25 slides
/creator/vayne-troll/ ¿La Vayne de Doran fue troll? (banda inferior) · 9:16 · 23 slides
/creator/tom-draft/   El draft de Tom (banda inferior) · 9:16 · 29 slides
/creator/jhin-build/  La build rara de Jhin (banda superior) · 9:16 · 26 slides
/creator/jhin-letalidad/ La build que dije que no servía (banda superior) · 9:16 · 25 slides
/creator/blg-final/   BLG: de romperme el corazón a mi equipo (banda inferior) · 9:16 · 28 slides
/creator/soloq-val-previa/ Arranca el SoloQ de Valorant (banda superior) · 9:16 · 21 slides
/creator/lux/         Lux cumple 16 años (montaje automático) · 9:16 · 11 slides
/creator/graves/      Graves cumple 15 años (montaje automático) · 9:16 · 13 slides
/creator/elise/       Elise cumple 14 años (montaje automático) · 9:16 · 15 slides
/creator/seraphine/   Seraphine cumple 6 años (montaje automático) · 9:16 · 20 slides
/creator/ksante/      K'Sante cumple 4 años (montaje automático) · 9:16 · 18 slides
/creator/leblanc/     LeBlanc cumple 16 años (montaje automático, solo arte oficial) · 9:16 · 21 slides
/creator/ambessa/     Ambessa cumple 2 años (banda inferior) · 9:16 · 24 slides
/creator/senna/       Senna cumple 7 años (banda inferior) · 9:16 · 29 slides
/creator/zed/         Zed cumple 14 años (banda superior) · 9:16 · 33 slides
404.html              página de error
vercel.json           trailingSlash: true (imprescindible, ver abajo)
docs/                 documentación del motor y propuestas
tools/                kit de build-time, video y montaje, solo local
```

Cada carpeta de presentación es autocontenida: su `index.html`, el runtime del deck (`deck-stage.js`) y su `assets/` con **rutas relativas**. Por eso `vercel.json` fija `trailingSlash: true`: sin la barra final, `/creator/lux` resolvería `assets/...` contra la raíz del sitio y las imágenes darían 404. Las notas de cada deck están en su propio `CLAUDE.md`.

**Archivo.** Los 40 decks anteriores (Cumplelolero #1–#24, soloq, lowelo, skins, caras, caps, parche2620, suiza, suiza-r1, suiza-r5, los reportes de las semanas 34 a 38, tabletas, estancia y novedades) se quitaron el 10/nov/2026 y siguen en la etiqueta de git `archivo-2026-11`:

```bash
git checkout archivo-2026-11 -- creator/jinx
```

## Cómo se usan los decks

| Acción | Cómo |
|---|---|
| Navegar | `←` `→`, espacio, `Inicio`/`Fin`, o número de diapositiva |
| Modo presentación | tecla **P** (pantalla completa, oculta miniaturas); `Esc` para salir |
| Exportar a PDF | `Ctrl+P` → Guardar como PDF (una diapositiva por página) |
| Ver el video | tecla **V** — solo en los decks que traen `video.mp4`; se abre sobre el propio deck y `Esc` lo cierra |
| Móvil | toca la mitad izquierda/derecha para retroceder/avanzar |

## Agregar una presentación

Con el skill `nuevo-deck`. En corto: carpeta `<escritorio>/<nombre>/` con su `gen.js`, una copia de `deck-stage.js` y su `CLAUDE.md`; card en el array `DECKS` del `index.html` raíz y `node tools/portadas.mjs <carpeta>`.

## Desarrollo

```bash
node tools/servidor-local.mjs
```

Imita a Vercel (barra final, 404 y la contraseña de la galería) en el puerto 3125. Todos los `index.html` de los decks **se generan** con su `gen.js`: no se editan a mano. Ver [CLAUDE.md](CLAUDE.md).

## Deploy

Vercel · proyecto `presentations` · preset **Other**, sin build command. Cada push a `main` despliega automáticamente. `.vercelignore` deja fuera del deploy las herramientas, la documentación y los generadores.
