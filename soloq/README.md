# SoloQ Challenge 2026 — Premios vs Salario Mínimo

Presentación web **vertical (1080×1920)** con los premios del SoloQ Challenge 2026 (ElmiilloR): una diapositiva por puesto del ranking de ganancias (empates agrupados), por qué ganó cada quien, y cuántos días de salario mínimo tomaría ganar esa cifra en México, Chile, Colombia y Argentina.

Estilo inspirado en soloqchallenge.gg: negro `#0B0B0B`, verde neón `#53FC18`, amarillo `#E9FF1F`, tipografía General Sans (Fontshare).

## Estructura

- `gen.js` — generador: contiene los datos (premios, salarios mínimos, tipos de cambio) y produce `index.html`. Para actualizar datos, edita `gen.js` y corre `node gen.js`.
- `index.html` — la presentación generada (28 diapositivas). No editar a mano.
- `deck-stage.js` — runtime del deck (navegación ←/→, tecla P = modo presentación, escalado automático, impresión a PDF).
- `assets/avatars/` — fotos de los jugadores (CDN de Twitch vía soloqchallenge.gg).

## Metodología

- Salario mínimo diario: México $315.04 MXN (CONASAMI 2026, único país con dato diario oficial); Chile $553.553 CLP/mes ÷ 30; Colombia $1.750.905 COP/mes ÷ 30; Argentina SMVM ago-2026 $376.600 ARS/mes ÷ 30.
- Tipo de cambio EUR del 20/ago/2026 (open.er-api.com).
- Días redondeados hacia arriba; supone trabajar todos los días sin descanso.

## Ver localmente

```bash
npx serve .
```

## Deploy en Vercel

Sitio estático sin build: importa el repo con preset **Other** y configuración por defecto.
