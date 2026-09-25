# La Ruina de Helia — paquete de assets

Material gráfico del **episodio 2 de la serie de lore**. Todo lo que está en
`assets/` se puede meter directo al editor.

- Los archivos están a **1600 px de ancho** (los splash de Data Dragon, a su
  tamaño original de 1215), y aguantan un push-in sobre un lienzo vertical de
  1080.
- La columna **Original** lleva a la fuente a resolución completa por si hace
  falta más.
- **No pasan por `tools/optimizar-imagenes.mjs`**, igual que los de guerras:
  aquí son el entregable.

La vista armada está en [`/helia/`](https://presentations-three-phi.vercel.app/helia/):
una lámina por bloque del guion, y el `data-screen-label` de cada una dice a
cuál corresponde.

---

## Por bloque del guion

| # | Bloque | Asset |
|---|---|---|
| 1 | El gancho: la isla que cayó | `ciudades-hundidas` |
| 2 | La niebla blanca y las Aguas de la Vida | `niebla-blanca` |
| 3 | La orden de eruditos · Helia · las Islas Bendecidas | `islas-bendecidas` |
| 4 | Las bóvedas y los artefactos | `bovedas-helia` |
| 5 | Viego, el segundo hijo | `viego` |
| 6 | La costurera | `viego-isolde` |
| 7 | La daga | *solo tipografía* |
| 8 | Kalista busca la cura y llega tarde | `kalista` |
| 9 | Traidora · Hecarim la saca de la celda | `hecarim` |
| 10 | «La muerte es definitiva» · la lanza por la espalda | `orden-de-hierro` |
| 11 | Thresh, el carcelero | `thresh` |
| 12 | Las tres versiones | `isolde-espectro` |
| 13 | La Ruina: la niebla se vuelve negra | `niebla-negra` |
| 14 | En qué se convirtieron | `Hecarim_0` · `Kalista_0` · `Thresh_0` |
| 15 | El amarre con el episodio 1 | `destruccion` |
| 16 | La muñeca | `hecha-con-amor` |
| 17 | Mil años después | `Gwen_0` |
| 18 | «Viego» | *solo tipografía* |

---

## Los archivos

### Wiki oficial de League of Legends

| Archivo | Qué es | Original |
|---|---|---|
| `ciudades-hundidas.jpg` | *Shadow Isles Flooded Cities* | `https://wiki.leagueoflegends.com/en-us/images/Shadow_Isles_Flooded_Cities.jpg` (1920×721) |
| `niebla-blanca.jpg` | *Beyond the Mist: Helia* — un barco entrando a Helia por la niebla blanca | `https://wiki.leagueoflegends.com/en-us/images/Beyond_the_Mist_Helia.png` (2340×1080) |
| `islas-bendecidas.jpg` | *Shadow Isles: The Blessed Isles* — el archipiélago **antes** de la Ruina | `https://wiki.leagueoflegends.com/en-us/images/Shadow_Isles_The_Blessed_Isles.jpg` (1920×1080) |
| `viego-isolde.jpg` | *Gwen/Viego «Made with Love» — concept 07*: Viego e Isolde abrazados, con la muñeca en la repisa | `https://wiki.leagueoflegends.com/en-us/images/Gwen_Viego_Made_with_Love_Concept_07.jpg` (1920×1126) |
| `isolde-espectro.jpg` | *Isolde Render* — Isolde como espectro | `https://wiki.leagueoflegends.com/en-us/images/Isolde_Render.png` (804×804) |
| `hecha-con-amor.jpg` | ⭐ *Gwen «Made with Love»* — **Isolde cosiendo a Gwen**. Es el remate del episodio | `https://wiki.leagueoflegends.com/en-us/images/Gwen_Made_with_Love.png` (1920×1080) |

### Legends of Runeterra — arte de carta a 2048 px

Patrón: `https://dd.b.pvp.net/latest/<set>/en_us/img/cards/<código>-full.png`

| Archivo | Carta | Código | Set |
|---|---|---|---|
| `bovedas-helia.jpg` | Las Bóvedas de Helia | `03SI009` | set3 |
| `viego.jpg` | Viego | `04SI055` | set4 |
| `kalista.jpg` | Kalista | `01SI030` | set1 |
| `hecarim.jpg` | Hecarim | `01SI042` | set1 |
| `orden-de-hierro.jpg` | Heraldo de Hierro (Iron Harbinger) | `01SI031` | set1 |
| `thresh.jpg` | Thresh | `01SI052` | set1 |
| `niebla-negra.jpg` | Niebla que avanza (Encroaching Mist) | `04SI045` | set4 |

### Data Dragon

`Hecarim_0.jpg`, `Kalista_0.jpg`, `Thresh_0.jpg` y `Gwen_0.jpg` —
`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/<Campeón>_0.jpg`

### Del episodio 1

`destruccion.jpg` — *Noxus Memories Of Destruction*, la portada de guerras. Se
repite **a propósito** en la lámina del amarre: es la misma imagen con la que
abrió el episodio anterior.

---

## Sin usar pero disponibles

Buenos para cortes extra o para otros episodios del arco:

- **Wiki:** *Shadow Isles Blessed Isles Bridge*, *Helia Docks 01/02* (concept de
  los muelles), *Citizens Of The Blessed Isles* (los eruditos, sobre fondo blanco),
  *Blessed Isles Vault concept 01–04*, *Isolde Render 02* (Isolde viva, cuerpo
  entero).
- **LoR:** *The Ruination* (`01SI015`, cuyo texto dice «pensar que algo tan puro
  como el amor pudo causar algo tan cruel»), *Spectral Rider* (`01SI024`, jinete
  y caballo fundidos), *Black Spear* (`01SI034`), *The Harrowing* (`01SI003`),
  *Catalogue of Regrets* (`05SI014`), *Maokai* (`02SI008`), *Camavoran Soldier*
  (`04SI054`).

**Sin arte oficial:** Isolde envenenada, la escena de la cámara, la flota de
Camavor en el mar. No se rellenaron.

---

## ⚠️ Nota de uso

**Todo el arte es propiedad de Riot Games** — la wiki oficial, Legends of
Runeterra y Data Dragon. Igual que en el episodio 1, **sigue pendiente leer la
política de contenido de fans de Riot** antes de monetizar: que los archivos sean
públicos no equivale a permiso de uso comercial.
