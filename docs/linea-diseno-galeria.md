# Línea de diseño — Galería de presentaciones (rediseño)

> Estado: **dirección aprobable, sin implementar**. Documentado el 27/08/2026.
> Destino: pasarla a **Claude Design** (skill `design`, canvas de artboards) para maquetar, y de ahí a `index.html`.

---

## 1 · El diagnóstico honesto

La galería actual es exactamente el look que delata a la IA: fondo casi negro neutro,
grid de cards con `border-radius` generoso, un acento por card, hero centrado con
gradiente. Funciona, pero **podría ser la landing de cualquier cosa** — y este sitio
no es cualquier cosa: es el escaparate de alguien que vende *identidades visuales*.

**La tesis del rediseño:** el producto de este sitio son identidades — DYMMSA rojo
corporativo, SoloQ verde neón, La Casita Feliz pastel, la forja de Ornn, el ácido de
Zaun, el filo de Talon, el violeta de Datos curiosos. La landing no debe competir con
ellas ni aplanarlas en cards iguales: debe ser **un contenedor editorial neutro que se
deja teñir por lo que señalas**. Que la página demuestre el oficio *comportándose*
como un sistema de identidad, no describiéndolo.

## 2 · El concepto: «El programa»

La galería como **programa de sala** — el índice impreso de una filmoteca o el
programa de un festival: una lista tipográfica grande, con metadatos de archivo,
donde cada función tiene su ficha. No un grid de cards: un **índice editorial**.

Los tres movimientos que lo hacen memorable:

1. **Índice, no grid.** Cada presentación es una fila a todo lo ancho con tipografía
   enorme: título grande, y en columnas de metadatos la serie (Cumplelolero · Datos
   curiosos · Comercial), el formato (16:9 / 9:16), el número de diapositivas y la
   fecha. La lista ES el diseño.
2. **El hover proyecta.** Al pasar por una fila, la portada del deck aparece en
   grande (panel lateral fijo o siguiendo al cursor) **y la página entera se tiñe
   con la paleta de ese deck** — fondo, acentos, subrayados. Sales de la fila y la
   página vuelve a su neutro. El sitio "se pone" cada identidad como quien se prueba
   un traje: eso es el pitch sin decir una palabra.
3. **Los datos como material.** Contadores reales en el masthead (N presentaciones ·
   M diapositivas · 2 series · videos narrados), etiquetas de archivo tipo
   `PRES—007`, fechas. Nada decorativo: todo verificable en el repo.

En móvil el índice colapsa con la portada visible por fila (el hover no existe ahí).

## 3 · Tokens

### Color — neutro con sesgo, nunca gris puro

| Token | Hex | Uso |
|---|---|---|
| `--tinta` | `#16130E` | fondo base — carbón cálido, sesgo tungsteno (luz de proyector), no negro puro |
| `--papel` | `#EDE8DD` | texto principal — hueso cálido, no blanco puro |
| `--humo` | `#8F887A` | metadatos, texto secundario |
| `--linea` | `#2C2822` | reglas y divisores del índice |
| `--lampara` | `#E8B54D` | acento propio del sitio: ámbar de lámpara de proyección. Solo chrome: subrayados, focus, el cursor-preview |
| `--deck-*` | dinámico | cada fila inyecta su paleta vía `data-*` (bg, acento) y CSS custom properties |

Regla: `--lampara` es el único acento del chrome y se usa poco. El color de verdad
lo ponen los decks al hover. La página en reposo es casi monocroma — eso hace que el
tinte al hover se sienta.

### Tipografía — nada de Inter/Space Grotesk/los de siempre

| Rol | Fuente (Google Fonts) | Notas |
|---|---|---|
| Display (títulos del índice) | **Bricolage Grotesque** 800, óptico grande | carácter sin ser payasa; condensa bien en títulos de 2 líneas |
| Texto | **Archivo** 400/500 | seca, editorial, buena en español |
| Datos/etiquetas | **Spline Sans Mono** 400/500 | los metadatos de archivo (`9:16 · 7 diapositivas · AGO 2026`) en mono, con `tabular-nums` |

Los decks conservan sus propias fuentes (Bebas, Poppins, etc.) — la galería no las
toca ni las reutiliza: el contenedor no se disfraza de contenido.

### Layout

- Masthead de programa: nombre del estudio a la izquierda, contadores reales a la
  derecha en mono. Sin hero gigante: la primera fila del índice ya es el hero.
- Índice a todo lo ancho, filas separadas por `--linea` de 1px. Título ~clamp(40px,
  7vw, 96px). Metadatos alineados a una grilla de columnas fija (mono + tabular).
- Panel de proyección: la portada del deck en hover, con la proporción real del
  formato (16:9 apaisada, 9:16 vertical) — el formato se *ve*, no solo se etiqueta.
- Footer: el CTA comercial de siempre + enlace al repo (el making-of es parte del
  pitch).

### Motión (GSAP ya está vendorizado)

- Entrada: las filas del índice aparecen en cascada breve (skill `gsap-timeline`).
- Hover: crossfade de portada + transición de las custom properties del tinte
  (~350 ms). Un solo momento orquestado; nada de parallax ni partículas.
- `prefers-reduced-motion`: sin cascada, tinte instantáneo.

## 4 · Referencias

- Patrón lista-con-proyección: portfolios tipo Emilie Vizcano (lista de nombres,
  imagen gigante al hover) y los ejemplos de [brutalist/editorial de Awwwards](https://www.awwwards.com/brutalism-brutalist-websites.html)
  y [Webflow](https://webflow.com/blog/10-brutalist-websites) — tomamos la
  interacción, no la estética brutalista completa.
- Tendencias 2026 que confirman la dirección (índices visuales con hover-preview,
  micro-interacción sobria): [Colorlib](https://colorlib.com/wp/portfolio-design-trends/),
  [Design Shack](https://designshack.net/articles/trends/portfolio-design/).
- Programas de filmoteca impresos (Filmoteca de Catalunya / Española) como referencia
  de *tono*: metadatos serios, tipografía grande, cero adorno.

## 5 · Qué NO hacer (checklist anti-genérico)

- ❌ Grid de cards redondeadas con sombra — es lo que ya tenemos.
- ❌ Crema + serif + terracota, o negro + acento ácido único — clichés IA documentados.
- ❌ Hero centrado con gradiente morado/azul.
- ❌ Emoji como marcadores de sección.
- ❌ Numeración 01/02/03 decorativa — solo si el orden significa algo (aquí las
  fechas sí; los números de orden no).
- ❌ Reutilizar Barlow/Bebas del contenido en el chrome de la galería.

## 6 · Skills y herramientas para ejecutarlo

| Fase | Herramienta |
|---|---|
| Maquetar la dirección | Skill **`design`** (canvas de Claude Design) — artboards de la landing en desktop y móvil |
| Fundamentos y revisión anti-genérico | Skill **`artifact-design`** (cargado; sus reglas están incorporadas arriba) |
| Motión | Skills **`gsap-core`** y **`gsap-timeline`** (oficiales, ya en `.claude/skills/`) |
| Datos de las filas | Generar el índice desde las carpetas reales (títulos, formatos, conteos) — quizá un `gen.js` para la raíz, como los decks |

## 7 · Handoff a Claude Design

Prompt sugerido para el canvas: *"Landing 'El programa' para un estudio de
presentaciones con IA: índice editorial a todo lo ancho (no cards), Bricolage
Grotesque display + Archivo + Spline Sans Mono, carbón cálido `#16130E` / hueso
`#EDE8DD` / ámbar `#E8B54D` solo en chrome; cada fila con metadatos en mono
(serie · formato · diapositivas · fecha) y panel de proyección al hover con la
portada en su proporción real y tinte de página con la paleta del deck. Desktop
1440 y móvil 390."* Adjuntar este documento completo.
