# Guerras Rúnicas — paquete de assets

Material gráfico del **episodio 1 de la serie de lore**. Todo lo que está en
`assets/` se puede meter directo al editor.

- Los archivos del repo están a **1600 px de ancho**, que aguantan un push-in
  sobre un lienzo vertical de 1080.
- La columna **Original** lleva a la fuente a resolución completa (2048 px en
  Legends of Runeterra, 3838 px en la wiki) por si hace falta más.
- **Estos assets no pasan por `tools/optimizar-imagenes.mjs`** a propósito: en
  el resto del repo las imágenes son decoración del deck y se reescalan al
  tamaño en que se ven, pero aquí son el entregable.

La vista armada por bloques está en [`/guerras/`](https://presentations-three-phi.vercel.app/guerras/)
— una lámina por bloque del guion, y el `data-screen-label` de cada una dice a
cuál corresponde.

---

## Por bloque del guion

| # | Bloque | Assets |
|---|---|---|
| 1 | Un sexto del mapa | *gráfico propio* — seis celdas, una encendida |
| 2 | Runeterra tuvo historia escrita | **sin registro** — negro con texto |
| 3 | Qué eran las Runas del Mundo | `runa-traicion` · `runa-esperanza` · `runa-locura` · `runa-violencia` · `runa-reverencia` |
| 4 | La orden de las Islas Benditas | `boveda-helia` · `la-ruina` |
| 5 | Doce años de miedo | **sin registro** |
| 6 | Khom y el parlamento | **sin registro** |
| 7 | Ryze y Tyrus | `ryze` — de Tyrus no existe arte |
| 8 | Los veintidós años de guerra | `destruccion` |
| 9 | Los noxii en el Bastión Inmortal | `bastion-inmortal` · `mordekaiser` |
| 10 | La Rosa Negra | `espina-rosa` · `espia-rosa-negra` |
| 11 | Ryze mata a Tyrus | `runa-traicion` · `prision-runica` |
| 12 | Demacia y la petricita | `ciervo-petricita` · `alagrande-petricita` · `supresor-petreo` · `gran-plaza` |
| 13 | Ixtal se cierra | `skarner` · `centinela-ixtali` |
| 14 | Targón, Kayle y Morgana | `pico-targon` · `pico-estrellado` · `kayle` · `morgana` |
| 15 | Nocturne | `nocturne` · `horror-nocturne` |
| 16 | El remate | `arena-noxkraya` |

---

## Los archivos

### Legends of Runeterra — arte de carta a 2048 px

El patrón de URL es
`https://dd.b.pvp.net/latest/<set>/en_us/img/cards/<código>-full.png`.
El catálogo completo de cada set está en
`https://dd.b.pvp.net/latest/<set>/en_us/data/<set>-en_us.json`.

| Archivo | Carta | Código | Set |
|---|---|---|---|
| `runa-traicion.jpg` | Fragmento de la Traición | `06RU006T2` | set6cde |
| `runa-esperanza.jpg` | Fragmento de la Esperanza | `06RU006T6` | set6cde |
| `runa-locura.jpg` | Fragmento de la Locura | `06RU006T1` | set6cde |
| `runa-violencia.jpg` | Fragmento de la Violencia | `06RU006T4` | set6cde |
| `runa-reverencia.jpg` | Fragmento de la Reverencia | `06RU006T7` | set6cde |
| `ryze.jpg` | Ryze | `06RU006` | set6cde |
| `prision-runica.jpg` | Prisión Rúnica | `06RU006T12` | set6cde |
| `boveda-helia.jpg` | Las Bóvedas de Helia | `03SI009` | set3 |
| `la-ruina.jpg` | La Ruina | `01SI015` | set1 |
| `centinela-ixtali.jpg` | Centinela ixtalí | `05SI008` | set5 |
| `mordekaiser.jpg` | Mordekaiser | `08SI042` | set8 |
| `espina-rosa.jpg` | Espina de la Rosa | `04NX010` | set4 |
| `espia-rosa-negra.jpg` | Espía de la Rosa Negra | `04NX006` | set4 |
| `ciervo-petricita.jpg` | Ciervo de Petricita | `05DE013` | set5 |
| `alagrande-petricita.jpg` | Alagrande de Petricita | `05DE012` | set5 |
| `supresor-petreo.jpg` | Supresor Pétreo | `03DE015` | set3 |
| `gran-plaza.jpg` | La Gran Plaza | `03DE010` | set3 |
| `pico-targon.jpg` | El Pico de Targón | `03MT064` | set3 |
| `pico-estrellado.jpg` | El Pico Estrellado | `04MT010` | set4 |
| `kayle.jpg` | Kayle | `06MT008` | set6cde |
| `morgana.jpg` | Morgana | `08MT003` | set8 |
| `nocturne.jpg` | Nocturne | `03SI005` | set3 |
| `horror-nocturne.jpg` | Horror Indecible de Nocturne | `03SI005T3` | set3 |
| `arena-noxkraya.jpg` | La Arena Noxkraya | `03NX004` | set3 |

**Dos hallazgos que no venían en la investigación:**

- **`boveda-helia` — Las Bóvedas de Helia** (`03SI009`). Es el landmark de la
  bóveda donde la orden guardaba los artefactos peligrosos. Ilustra el bloque 4
  mucho mejor que un arte genérico de las Islas Benditas.
- **`la-ruina` — La Ruina** (`01SI015`), para el momento en que cae Helia.

### Wiki oficial de League of Legends

| Archivo | Qué es | Original |
|---|---|---|
| `destruccion.jpg` | *Noxus Memories Of Destruction* — la imagen de cabecera de la propia página de las Guerras Rúnicas | `https://wiki.leagueoflegends.com/en-us/images/Noxus_Memories_Of_Destruction.jpg` (1920×1080) |
| `bastion-inmortal.jpg` | *Origins of Noxus 05* — la Rosa Negra conteniendo el embate sobre el Bastión Inmortal | `https://wiki.leagueoflegends.com/en-us/images/Origins_of_Noxus_05.jpg` (3838×2159) |

`bastion-inmortal` es **el único arte que existe de un momento concreto de esta
guerra**, y es el que más trabaja del paquete.

### Data Dragon

| Archivo | Original |
|---|---|
| `skarner.jpg` | `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Skarner_0.jpg` |

---

## Lo que no existe, y por qué el deck no lo rellena

**Sin arte oficial:** la destrucción de Khom · las batallas · la fundación de
Zeffira · Tyrus · el Continente Camavorano · los doce años de miedo.

Los bloques 2, 5 y 6 van **en negro con una etiqueta «sin registro»**. No es un
parche: es un episodio sobre historia que se perdió, así que el vacío visual
dice lo mismo que el guion en vez de contradecirlo. Es el recurso que usan los
documentales sobre civilizaciones destruidas.

Si más adelante se quiere tapar alguno de esos huecos con imagen generada, los
tres son **paisaje y destrucción, no personajes**, que es donde menos se nota.
Pero mezclada con arte oficial siempre se ve el salto de estilo.

---

## ⚠️ Nota de uso

**Todo el arte de este paquete es propiedad de Riot Games** — Legends of
Runeterra, Data Dragon y la wiki oficial. Se bajó de CDNs públicos de Riot.

La investigación del episodio deja pendiente **leer la política de contenido de
fans de Riot** antes de usarlo, y sigue pendiente: que los archivos sean
públicos y descargables no equivale a permiso de uso comercial. Conviene
revisarlo antes de monetizar el video.
