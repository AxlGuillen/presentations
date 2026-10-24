// Generador de index.html — Worlds 2026 · Fase suiza, ronda 1 en números
// Ejecutar: node suiza-r1/gen.js
//   datos:  node tools/partidos.mjs suiza-r1 --dia=2026-10-23   (escribe partidos.json)
//   clips:  node tools/laminas.mjs suiza-r1
//
// Encargo (23/10/2026): las diferencias de oro, kills y daño por equipo y por
// rol de los partidos del día, la ronda 1 de la fase suiza. Formato del
// montaje automático, como lux, graves y parche2621: cada lámina es un
// miniclip en el **panel de 1080×1370** que recorta `crop=1080:1370:0:275`.
//
// Por partido van tres láminas: el marcador (oro, kills, daño, torres,
// dragones y barones en barras de tira y afloja), la curva de la diferencia de
// oro minuto a minuto y el cara a cara por rol. Abren los resultados de la
// ronda y cierran los líderes del día.
//
// Datos: `partidos.json`, que arma tools/partidos.mjs con el feed en vivo de
// lolesports (oro, kills, objetivos, KDA y la curva) y la API Cargo de
// Leaguepedia (el daño a campeones en números y la duración oficial; el feed
// solo trae el % de daño dentro del equipo). Si un game todavía no tiene daño
// en Leaguepedia, sus barras de daño salen con el % del feed y lo dicen.
//
// La identidad es la de suiza (Anton, plata cromada, negro de arena) con una
// diferencia a propósito: **los datos van en azul y rojo de lado**, no en el
// color de cada equipo. Cuatro de los ocho partidos enfrentan colores casi
// iguales (TES y HLE, LOS y T1, MKOI y BLG, LYON y TSW), y en una barra de tira
// y afloja dos naranjas no se distinguen. El equipo lo dice su logo; el color
// del equipo solo tiñe el fondo.
const fs = require('fs');
const kit = require('../tools/kit.cjs');

const DATOS = JSON.parse(fs.readFileSync(__dirname + '/partidos.json', 'utf8'));

// ── Paleta ───────────────────────────────────────────────────────────────
const BG = '#07070A';
const PLATA = '#E9EDF3';
const HIELO = '#7CC4FF';
const MUTED = '#8B93A3';
const AZUL = '#4C9BFF';       // lado azul
const ROJO = '#FF4D5E';       // lado rojo
const GANA = '#46E39B';
const DISPLAY = `'Anton', Impact, sans-serif`;
const BODY = `'Archivo', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;
const a = kit.alpha;
const PANEL = { top: 275, w: 1080, h: 1370 };

// Equipos: el código del feed (TLAW) puede no ser el del logo (TL).
const EQ = {
  GEN: { logo: 'GEN', nombre: 'Gen.G', color: '#C9A35C' },
  IG: { logo: 'IG', nombre: 'Invictus Gaming', color: '#D9DFE7' },
  TLAW: { logo: 'TL', nombre: 'Team Liquid', color: '#3F7FE0', corto: 'TL' },
  TL: { logo: 'TL', nombre: 'Team Liquid', color: '#3F7FE0' },
  CFO: { logo: 'CFO', nombre: 'CTBC Flying Oyster', color: '#F5A524' },
  AL: { logo: 'AL', nombre: 'Anyone’s Legend', color: '#E5392E' },
  KC: { logo: 'KC', nombre: 'Karmine Corp', color: '#19D3F3' },
  G2: { logo: 'G2', nombre: 'G2 Esports', color: '#E8443A' },
  DK: { logo: 'DK', nombre: 'Dplus KIA', color: '#7FD9E8' },
  HLE: { logo: 'HLE', nombre: 'Hanwha Life', color: '#F58220' },
  TES: { logo: 'TES', nombre: 'Top Esports', color: '#FF3B30' },
  LOS: { logo: 'LOS', nombre: 'LOS', color: '#FF6A2B' },
  T1: { logo: 'T1', nombre: 'T1', color: '#E4002B' },
  TSW: { logo: 'TSW', nombre: 'Team Secret Whales', color: '#B7C1CF' },
  LYON: { logo: 'LYON', nombre: 'LYON', color: '#C9A06A' },
  BLG: { logo: 'BLG', nombre: 'Bilibili Gaming', color: '#36C5F4' },
  MKOI: { logo: 'MKOI', nombre: 'Movistar KOI', color: '#4C7DFF' },
};
const eq = (codigo) => {
  const e = EQ[codigo];
  if (!e) throw new Error(`Falta el equipo ${codigo} en EQ`);
  return { codigo: e.corto || codigo, ...e };
};
const logo = (codigo) => `assets/logos/${eq(codigo).logo}.png`;
const icono = (campeon) => `assets/campeones/${campeon}.png`;
// Fotos de lolesports que ya trajo suiza (solo para el cierre).
const FOTOS = new Set(fs.readdirSync(__dirname + '/assets/jugadores').map(f => f.replace(/\.webp$/, '')));
const foto = (nombre) => FOTOS.has(nombre.toLowerCase()) ? `assets/jugadores/${nombre.toLowerCase()}.webp` : null;

// ── Formatos ─────────────────────────────────────────────────────────────
const miles = (n) => (n / 1000).toFixed(1).replace('.', ',') + 'k';
const reloj = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const REMONTADA = 3000;
// La duración oficial (Leaguepedia) o, sin ella, el final de la curva, que se
// cuenta desde el primer oro pasivo. `duracionFeed` es el reloj crudo del feed,
// que arranca antes del juego: no sirve como duración.
const dur = (j) => j.duracion || Math.round(j.curva[j.curva.length - 1].min * 60);
const ROLES = { top: 'Top', jungla: 'Jungla', medio: 'Medio', tirador: 'Tirador', soporte: 'Soporte' };

// ── Piezas comunes ───────────────────────────────────────────────────────
const SECCION = `background: ${BG}; font-family: ${BODY}; color: ${PLATA}; position: relative; overflow: hidden;`;
// El fondo se ve desde el cuadro 0 (en suiza el arranque en negro se veía como
// destello) y lleva data-fondo para sacar las láminas con alfa.
const fondo = (cA, cB) => `
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(70% 45% at 8% 22%, ${a(cA, 0.22)}, ${a(cA, 0)} 70%), radial-gradient(70% 45% at 92% 82%, ${a(cB, 0.22)}, ${a(cB, 0)} 70%);"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; ${kit.fondo('transparent', kit.puntos({ color: a('#AFC3E0', 0.07), radio: 1.6, paso: 30 }))}"></div>
    <div data-fondo style="position: absolute; inset: 0; pointer-events: none; ${kit.fondo('transparent', kit.grano({ opacidad: 0.06 }))} mix-blend-mode: overlay;"></div>`;
const panel = (contenido) => `
    <div data-panel style="position: absolute; left: 0; top: ${PANEL.top}px; width: ${PANEL.w}px; height: ${PANEL.h}px;">${contenido}
    </div>`;
const lamina = (id, notas, [cA, cB], cuerpo) => `
  <section data-lamina="${id}" data-label="${id}" data-screen-label="${id}" data-speaker-notes="${notas}" style="${SECCION}">
    ${fondo(cA, cB)}
    ${panel(cuerpo)}
  </section>`;

// Cabecera de un partido: logo, código y si ganó, a cada lado; al centro lo que toque.
const lado = (e, color, alinear, tam) => {
  const E = eq(e.codigo);
  const pierde = !e.gana;
  const marca = `<img src="${logo(e.codigo)}" alt="${E.nombre}" style="height: ${tam}px; width: ${tam}px; object-fit: contain; ${pierde ? 'filter: grayscale(0.7) brightness(0.7);' : `filter: drop-shadow(0 0 24px ${a(color, 0.55)});`}">`;
  const texto = `<div style="text-align: ${alinear};">
          <div class="${pierde ? '' : 'cromo'}" style="font-family: ${DISPLAY}; font-size: ${Math.round(tam * 0.56)}px; line-height: 0.95; letter-spacing: 1px; ${pierde ? `color: ${MUTED};` : ''}">${E.codigo}</div>
          <div style="margin-top: 8px; font-family: ${MONO}; font-size: ${Math.max(18, Math.round(tam * 0.13))}px; font-weight: 600; letter-spacing: 3px; color: ${pierde ? a(MUTED, 0.8) : GANA};">${pierde ? 'DERROTA' : '● VICTORIA'}</div>
        </div>`;
  return `<div data-lado style="display: flex; align-items: center; gap: 22px; ${alinear === 'right' ? 'flex-direction: row-reverse;' : ''}">${marca}${texto}</div>`;
};
const cabecera = (j, centro, { tam = 120, top = 40 } = {}) => {
  const [A, B] = j.equipos;
  return `
      <div data-cabecera style="position: absolute; left: 60px; right: 60px; top: ${top}px; display: flex; align-items: center; justify-content: space-between;">
        ${lado(A, AZUL, 'left', tam)}
        <div data-centro style="text-align: center;">${centro}</div>
        ${lado(B, ROJO, 'right', tam)}
      </div>`;
};
const etiqueta = (txt, color = MUTED, tam = 24) => `<div style="font-family: ${MONO}; font-size: ${tam}px; font-weight: 600; letter-spacing: 5px; text-transform: uppercase; color: ${color};">${txt}</div>`;

// Barra de tira y afloja: cada lado crece desde el punto donde se parten.
// Con los dos en cero (un 0–0 de barones) la barra queda gris y partida a la mitad.
const tira = (va, vb, { ancho = 920, alto = 22 } = {}) => {
  const total = va + vb;
  const pa = total ? va / total : 0.5;
  const gris = total ? '' : 'filter: saturate(0) brightness(0.45);';
  return `<div data-tira style="position: relative; width: ${ancho}px; height: ${alto}px; margin: 0 auto; border-radius: ${alto}px; background: rgba(255,255,255,0.06); overflow: hidden; ${gris}">
          <div data-tira-a style="position: absolute; left: 0; top: 0; bottom: 0; width: ${(pa * 100).toFixed(2)}%; background: linear-gradient(90deg, ${a(AZUL, 0.55)}, ${AZUL}); transform-origin: 100% 50%;"></div>
          <div data-tira-b style="position: absolute; right: 0; top: 0; bottom: 0; width: ${((1 - pa) * 100).toFixed(2)}%; background: linear-gradient(90deg, ${ROJO}, ${a(ROJO, 0.55)}); transform-origin: 0% 50%;"></div>
          <div style="position: absolute; left: calc(${(pa * 100).toFixed(2)}% - 2px); top: -4px; bottom: -4px; width: 4px; background: ${BG};"></div>
        </div>`;
};
// Una cifra que cuenta: data-valor y data-formato (k = miles con coma, n = entero).
const cifra = (v, formato, estilo) => `<span data-cifra data-valor="${v}" data-formato="${formato}" style="${estilo}">${formato === 'k' ? miles(v) : v}</span>`;

const slides = [];
const J = DATOS.juegos;

// ── Portada: los resultados de la ronda ──────────────────────────────────
{
  const filas = J.map((j, i) => {
    const [A, B] = j.equipos;
    const nom = (e, al) => `<div style="display: flex; align-items: center; gap: 18px; ${al === 'right' ? 'flex-direction: row-reverse;' : ''} width: 360px;">
          <img src="${logo(e.codigo)}" alt="" style="width: 76px; height: 76px; object-fit: contain; ${e.gana ? '' : 'filter: grayscale(0.8) brightness(0.6);'}">
          <span style="font-family: ${DISPLAY}; font-size: 58px; line-height: 1; ${e.gana ? `color: ${PLATA};` : `color: ${a(MUTED, 0.75)};`}">${eq(e.codigo).codigo}</span>
        </div>`;
    return `<div data-fila style="display: flex; align-items: center; justify-content: space-between; padding: 0 70px; height: 112px; ${i ? 'border-top: 1px solid rgba(255,255,255,0.07);' : ''}">
        ${nom(A, 'left')}
        <div style="font-family: ${DISPLAY}; font-size: 58px; letter-spacing: 4px;"><span style="color: ${A.gana ? GANA : a(MUTED, 0.6)};">${A.gana ? 1 : 0}</span><span style="color: ${a(MUTED, 0.5)}; margin: 0 14px;">–</span><span style="color: ${B.gana ? GANA : a(MUTED, 0.6)};">${B.gana ? 1 : 0}</span></div>
        ${nom(B, 'right')}
      </div>`;
  }).join('');
  slides.push(lamina('r1-portada', 'Asi quedo la primera ronda de la fase suiza del Mundial. Vamos a ver los numeros de cada partido: oro, kills y dano, por equipo y por rol.', [HIELO, '#E4002B'], `
      <div data-titulo style="position: absolute; left: 0; right: 0; top: 30px; text-align: center;">
        ${etiqueta('Worlds 2026 · fase suiza', HIELO, 26)}
        <div class="cromo" style="margin-top: 16px; font-family: ${DISPLAY}; font-size: 170px; line-height: 0.88; letter-spacing: 2px;">RONDA 1</div>
        <div style="margin-top: 10px; font-size: 36px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: 1px;">en <span style="color: ${HIELO};">números</span></div>
      </div>
      <div data-tabla style="position: absolute; left: 50px; right: 50px; top: ${J.length > 7 ? 360 : 400}px; border-radius: 26px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.09);">${filas}</div>`));
}

// ── Por partido ──────────────────────────────────────────────────────────
J.forEach((j, n) => {
  const [A, B] = j.equipos;
  const cols = [eq(A.codigo).color, eq(B.codigo).color];
  const id = `p${n + 1}`;
  const nombres = `${eq(A.codigo).codigo} contra ${eq(B.codigo).codigo}`;
  const gana = j.equipos.find(e => e.gana);
  const conDano = A.dano != null && B.dano != null;

  // 1 · Marcador
  const FILAS = [
    ['Oro', A.oro, B.oro, 'k'],
    ['Kills', A.kills, B.kills, 'n'],
    conDano ? ['Daño a campeones', A.dano, B.dano, 'k'] : null,
    ['Torres', A.torres, B.torres, 'n'],
    ['Dragones', A.dragones.length, B.dragones.length, 'n'],
    ['Barones', A.barones, B.barones, 'n'],
  ].filter(Boolean);
  const alto = conDano ? 150 : 172;
  const filas = FILAS.map(([nom, va, vb, f], k) => `
        <div data-stat style="position: absolute; left: 0; right: 0; top: ${360 + k * alto}px;">
          <div style="display: flex; align-items: flex-end; justify-content: space-between; padding: 0 80px; margin-bottom: 14px;">
            ${cifra(va, f, `font-family: ${DISPLAY}; font-size: 76px; line-height: 0.9; color: ${va >= vb ? PLATA : a(MUTED, 0.85)};`)}
            <div style="padding-bottom: 10px;">${etiqueta(nom)}</div>
            ${cifra(vb, f, `font-family: ${DISPLAY}; font-size: 76px; line-height: 0.9; color: ${vb >= va ? PLATA : a(MUTED, 0.85)};`)}
          </div>
          ${tira(va, vb)}
        </div>`).join('');
  slides.push(lamina(`${id}-marcador`, `${nombres}: gano ${eq(gana.codigo).codigo} en ${reloj(dur(j))}.`, cols, `
      ${cabecera(j, `${etiqueta('Duración')}<div style="margin-top: 8px; font-family: ${MONO}; font-size: 54px; font-weight: 600; color: ${PLATA};">${reloj(dur(j))}</div>`, { tam: 150, top: 60 })}
      <div data-linea style="position: absolute; left: 80px; right: 80px; top: 300px; height: 1px; background: linear-gradient(90deg, ${a(AZUL, 0)}, ${a(AZUL, 0.5)}, ${a(ROJO, 0.5)}, ${a(ROJO, 0)});"></div>
      ${filas}`));

  // 2 · Curva de la diferencia de oro (positivo = va arriba el lado azul)
  {
    const W = 980, H = 860, padX = 70, padY = 40;
    const c = j.curva;
    const fin = c[c.length - 1].min;
    const maxAbs = Math.max(2000, ...c.map(p => Math.abs(p.dif)));
    const tope = Math.ceil(maxAbs / 2000) * 2000;
    const x = (m) => padX + (m / fin) * (W - padX - 20);
    const y = (d) => padY + (1 - (d + tope) / (2 * tope)) * (H - 2 * padY);
    const pts = c.map(p => [x(p.min), y(p.dif)]);
    const linea = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
    const area = `${linea} L${x(fin).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
    const y0 = y(0);
    const pico = (s) => c.reduce((b, p) => (s * p.dif > s * b.dif ? p : b), c[0]);
    const pA = pico(1), pB = pico(-1);
    const marcas = [];
    for (let v = -tope; v <= tope; v += tope / 2) marcas.push(`<line x1="${padX}" x2="${W - 20}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="rgba(255,255,255,${v === 0 ? 0.35 : 0.07})" stroke-width="${v === 0 ? 2 : 1}"/>
          <text x="${padX - 14}" y="${(y(v) + 8).toFixed(1)}" text-anchor="end" font-family="JetBrains Mono" font-size="22" fill="${MUTED}">${v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v / 1000) + 'k'}</text>`);
    for (let m = 5; m < fin; m += 5) marcas.push(`<text x="${x(m).toFixed(1)}" y="${H - 4}" text-anchor="middle" font-family="JetBrains Mono" font-size="22" fill="${MUTED}">${m}'</text>`);
    const pinta = (p, color, arriba) => p.dif * (arriba ? 1 : -1) > 0 ? `
          <g data-pico data-t="${(p.min / fin).toFixed(3)}">
            <circle cx="${x(p.min).toFixed(1)}" cy="${y(p.dif).toFixed(1)}" r="11" fill="${color}" stroke="${BG}" stroke-width="4"/>
            <text x="${(x(p.min) > W - 160 ? x(p.min) - 24 : Math.max(padX + 60, x(p.min))).toFixed(1)}" y="${(y(p.dif) + (x(p.min) > W - 160 ? 14 : arriba ? -26 : 50)).toFixed(1)}" text-anchor="${x(p.min) > W - 160 ? 'end' : 'middle'}" font-family="Anton" font-size="46" fill="${color}">+${miles(Math.abs(p.dif))}</text>
          </g>` : '';
    const gid = `oro${n}`;
    const svg = `<svg data-curva width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display: block; overflow: visible;">
          <defs>
            <clipPath id="${gid}-arriba"><rect x="0" y="0" width="${W}" height="${y0.toFixed(1)}"/></clipPath>
            <clipPath id="${gid}-abajo"><rect x="0" y="${y0.toFixed(1)}" width="${W}" height="${(H - y0).toFixed(1)}"/></clipPath>
            <clipPath id="${gid}-avance"><rect data-avance x="0" y="-80" width="${W}" height="${H + 160}"/></clipPath>
            <linearGradient id="${gid}-ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AZUL}" stop-opacity="0.55"/><stop offset="1" stop-color="${AZUL}" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="${gid}-gb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ROJO}" stop-opacity="0.55"/><stop offset="1" stop-color="${ROJO}" stop-opacity="0.05"/></linearGradient>
          </defs>
          ${marcas.join('')}
          <g clip-path="url(#${gid}-avance)">
            <path d="${area}" fill="url(#${gid}-ga)" clip-path="url(#${gid}-arriba)"/>
            <path d="${area}" fill="url(#${gid}-gb)" clip-path="url(#${gid}-abajo)"/>
            <path d="${linea}" fill="none" stroke="${AZUL}" stroke-width="5" stroke-linejoin="round" clip-path="url(#${gid}-arriba)"/>
            <path d="${linea}" fill="none" stroke="${ROJO}" stroke-width="5" stroke-linejoin="round" clip-path="url(#${gid}-abajo)"/>
          </g>
          ${pinta(pA, AZUL, true)}${pinta(pB, ROJO, false)}
        </svg>`;
    const final = c[c.length - 1].dif;
    const quien = final >= 0 ? A : B;
    // Remontada: el ganador llegó a ir 3k abajo (menos que eso es ruido de los primeros minutos).
    const remonta = (final > 0 && -pB.dif >= REMONTADA) || (final < 0 && pA.dif >= REMONTADA);
    const nota = `${nombres}: la diferencia de oro minuto a minuto. ${eq(quien.codigo).codigo} termino arriba por ${miles(Math.abs(final))}${remonta ? ', y fue remontada' : ''}.`;
    slides.push(lamina(`${id}-oro`, nota, cols, `
      ${cabecera(j, `${etiqueta('Diferencia', HIELO)}${etiqueta('de oro', HIELO)}`, { tam: 104, top: 40 })}
      <div style="position: absolute; left: 50px; top: 250px;">
        <img src="${logo(A.codigo)}" alt="" style="position: absolute; left: ${padX + 14}px; top: ${padY + 10}px; width: 64px; height: 64px; object-fit: contain; opacity: 0.55;">
        <img src="${logo(B.codigo)}" alt="" style="position: absolute; left: ${padX + 14}px; top: ${H - padY - 120}px; width: 64px; height: 64px; object-fit: contain; opacity: 0.55;">
        ${svg}
      </div>
      <div data-pie style="position: absolute; left: 0; right: 0; top: ${250 + H + 40}px; text-align: center;">
        ${remonta ? etiqueta(`remontada de ${eq(quien.codigo).codigo}: iba abajo por ${miles(Math.abs(final >= 0 ? pB.dif : pA.dif))}`, GANA, 26) : etiqueta(`${eq(quien.codigo).codigo} termina arriba por ${miles(Math.abs(final))}`, final >= 0 ? AZUL : ROJO, 26)}
      </div>`));
  }

  // 3 · Cara a cara por rol
  {
    const filasRol = A.jugadores.map((pa, k) => {
      const pb = B.jugadores[k];
      const jug = (p, al, color) => `<div style="display: flex; align-items: center; gap: 20px; ${al === 'right' ? 'flex-direction: row-reverse; text-align: right;' : ''} width: 400px;">
            <img src="${icono(p.campeon)}" alt="${p.campeon}" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 4px solid ${color}; box-shadow: 0 0 24px ${a(color, 0.4)};">
            <div>
              <div style="font-family: ${DISPLAY}; font-size: 40px; line-height: 1; letter-spacing: 0.5px; white-space: nowrap;">${p.nombre}</div>
              <div style="margin-top: 6px; font-family: ${MONO}; font-size: 24px; font-weight: 600; color: ${MUTED};"><span style="color: ${PLATA};">${p.k}</span>/<span style="color: ${p.d ? ROJO : PLATA};">${p.d}</span>/${p.a}</div>
            </div>
          </div>`;
      const mini = (nom, va, vb, txtA, txtB) => `
            <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
              <span style="width: 110px; text-align: right; font-family: ${MONO}; font-size: 22px; font-weight: 600; color: ${va >= vb ? PLATA : MUTED};">${txtA}</span>
              <div style="flex: 1;">${tira(va, vb, { ancho: 640, alto: 12 })}</div>
              <span style="width: 110px; font-family: ${MONO}; font-size: 22px; font-weight: 600; color: ${vb >= va ? PLATA : MUTED};">${txtB}</span>
            </div>
            <div style="margin-top: 2px; text-align: center; font-family: ${MONO}; font-size: 16px; letter-spacing: 4px; color: ${a(MUTED, 0.7)};">${nom}</div>`;
      const dano = conDano
        ? mini('DAÑO', pa.dano, pb.dano, miles(pa.dano), miles(pb.dano))
        : mini('% DEL DAÑO DEL EQUIPO', pa.danoPct, pb.danoPct, Math.round(pa.danoPct * 100) + '%', Math.round(pb.danoPct * 100) + '%');
      return `<div data-rol style="position: absolute; left: 40px; right: 40px; top: ${170 + k * 238}px; height: 226px; border-radius: 22px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); padding: 16px 24px; box-sizing: border-box;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            ${jug(pa, 'left', AZUL)}
            ${etiqueta(ROLES[pa.rol] || pa.rol, HIELO, 22)}
            ${jug(pb, 'right', ROJO)}
          </div>
          ${mini('ORO', pa.oro, pb.oro, miles(pa.oro), miles(pb.oro))}
          ${dano}
        </div>`;
    }).join('');
    slides.push(lamina(`${id}-roles`, `${nombres}, rol por rol: oro y dano de cada jugador contra el de enfrente.`, cols, `
      ${cabecera(j, etiqueta('Por rol', HIELO), { tam: 90, top: 30 })}
      ${filasRol}`));
  }
});

// ── Cierre: los líderes del día ──────────────────────────────────────────
{
  const todos = J.flatMap((j) => j.equipos.flatMap((e) => e.jugadores.map(p => ({ ...p, equipo: e.codigo, j }))));
  const mejor = (f) => todos.reduce((b, p) => (f(p) > f(b) ? p : b), todos[0]);
  const kills = mejor(p => p.k);
  const oro = mejor(p => p.oro);
  // El líder de daño solo vale si están todos los games: con uno sin datos podría ser otro.
  const dano = todos.every(p => p.dano != null) ? todos.reduce((b, p) => (p.dano > b.dano ? p : b), todos[0]) : null;
  const ventaja = J.map(j => {
    const g = j.equipos.find(e => e.gana); const s = g.lado === 'azul' ? 1 : -1;
    return { j, e: g, v: Math.max(...j.curva.map(p => s * p.dif)) };
  }).reduce((b, x) => (x.v > b.v ? x : b));
  const corta = J.reduce((b, j) => (dur(j) < dur(b) ? j : b));
  const remontada = J.map(j => {
    const g = j.equipos.find(e => e.gana); const s = g.lado === 'azul' ? 1 : -1;
    return { j, e: g, v: Math.max(...j.curva.map(p => -s * p.dif)) };
  }).reduce((b, x) => (x.v > b.v ? x : b));
  const rival = (j, cod) => eq(j.equipos.find(e => e.codigo !== cod).codigo).codigo;

  const tarjeta = (titulo, valor, quien, sub, img, codigo) => `
        <div data-lider style="position: relative; height: 330px; border-radius: 26px; overflow: hidden; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);">
          ${img ? `<img src="${img}" alt="" style="position: absolute; right: -20px; bottom: 0; height: 300px; opacity: 0.9; -webkit-mask-image: linear-gradient(90deg, transparent, #000 45%); mask-image: linear-gradient(90deg, transparent, #000 45%);">` : ''}
          <img src="${logo(codigo)}" alt="" style="position: absolute; left: 28px; bottom: 26px; width: 58px; height: 58px; object-fit: contain;">
          <div style="position: absolute; left: 28px; top: 26px; right: ${img ? 210 : 28}px;">
            ${etiqueta(titulo, HIELO, 20)}
            <div class="cromo" style="margin-top: 12px; font-family: ${DISPLAY}; font-size: 92px; line-height: 0.9;">${valor}</div>
            <div style="margin-top: 10px; font-family: ${DISPLAY}; font-size: 40px; line-height: 1;">${quien}</div>
            <div style="margin-top: 6px; font-family: ${MONO}; font-size: 20px; color: ${MUTED};">${sub}</div>
          </div>
        </div>`;
  const fotoO = (p) => foto(p.nombre) || null;
  const cards = [
    tarjeta('Más kills', kills.k, kills.nombre, `${kills.k}/${kills.d}/${kills.a} con ${kills.campeon} vs ${rival(kills.j, kills.equipo)}`, fotoO(kills), kills.equipo),
    dano ? tarjeta('Más daño', miles(dano.dano), dano.nombre, `${dano.campeon} vs ${rival(dano.j, dano.equipo)}`, fotoO(dano), dano.equipo)
      : tarjeta('Más oro', miles(oro.oro), oro.nombre, `${oro.campeon} vs ${rival(oro.j, oro.equipo)}`, fotoO(oro), oro.equipo),
    dano ? tarjeta('Más oro', miles(oro.oro), oro.nombre, `${oro.campeon} vs ${rival(oro.j, oro.equipo)}`, fotoO(oro), oro.equipo) : '',
    tarjeta('Mayor ventaja', '+' + miles(ventaja.v), eq(ventaja.e.codigo).codigo, `de oro contra ${rival(ventaja.j, ventaja.e.codigo)}`, null, ventaja.e.codigo),
    tarjeta('Partida más corta', reloj(dur(corta)), eq(corta.ganador).codigo, `contra ${rival(corta, corta.ganador)}`, null, corta.ganador),
    remontada.v >= REMONTADA ? tarjeta('Remontada', '−' + miles(remontada.v), eq(remontada.e.codigo).codigo, `iba abajo y le ganó a ${rival(remontada.j, remontada.e.codigo)}`, null, remontada.e.codigo) : '',
  ].filter(Boolean);
  slides.push(lamina('r1-lideres', `Y los lideres del dia: ${kills.nombre} con ${kills.k} kills${dano ? `, ${dano.nombre} con mas dano` : ''} y ${eq(ventaja.e.codigo).codigo} con la ventaja de oro mas grande.`, [HIELO, GANA], `
      <div style="position: absolute; left: 0; right: 0; top: 30px; text-align: center;">
        ${etiqueta('Ronda 1 · lo mejor del día', HIELO, 26)}
        <div class="cromo" style="margin-top: 0; padding-top: 18px; font-family: ${DISPLAY}; font-size: 130px; line-height: 0.9;">LÍDERES</div>
      </div>
      <div style="position: absolute; left: 40px; right: 40px; top: 250px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">${cards.join('')}</div>`));
}

// ── Coreografías ─────────────────────────────────────────────────────────
const coreografias = `<script>
(function () {
  function q(s, sel) { return Array.prototype.slice.call(s.querySelectorAll(sel)); }
  function uno(s, sel) { return s.querySelector(sel); }
  function miles(v) { return (v / 1000).toFixed(1).replace('.', ',') + 'k'; }
  // Las cifras cuentan desde cero con su formato; el tween solo depende de su progreso.
  function contar(tl, els, pos) {
    els.forEach(function (el) {
      var fin = parseFloat(el.dataset.valor), f = el.dataset.formato, o = { v: 0 };
      tl.to(o, { v: fin, duration: 1, ease: 'power2.out', onUpdate: function () {
        el.textContent = f === 'k' ? miles(o.v) : Math.round(o.v);
      } }, pos);
    });
  }
  function entraCabecera(tl, s) {
    var l = q(s, '[data-lado]');
    tl.from(l[0], { x: -120, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0)
      .from(l[1], { x: 120, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0)
      .from(q(s, '[data-centro]'), { scale: 0.6, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 0.15);
  }
  function crecenTiras(tl, tiras, pos, paso) {
    tiras.forEach(function (t, i) {
      tl.from(t.querySelector('[data-tira-a]'), { scaleX: 0, duration: 0.7, ease: 'power3.out' }, pos + i * paso)
        .from(t.querySelector('[data-tira-b]'), { scaleX: 0, duration: 0.7, ease: 'power3.out' }, pos + i * paso);
    });
  }

  animar('r1-portada', function (tl, s) {
    tl.from(uno(s, '[data-titulo]'), { y: -40, opacity: 0, scale: 1.1, duration: 0.6, ease: 'power3.out' }, 0)
      .from(uno(s, '[data-tabla]'), { opacity: 0, y: 40, duration: 0.5, ease: 'power2.out' }, 0.2)
      .from(q(s, '[data-fila]'), { x: function (i) { return i % 2 ? 80 : -80; }, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'power3.out' }, 0.35);
  });

  q(document, 'section[data-lamina$="-marcador"]').forEach(function (sec) {
    animar(sec.dataset.label, function (tl, s) {
      entraCabecera(tl, s);
      tl.from(uno(s, '[data-linea]'), { scaleX: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
      var st = q(s, '[data-stat]');
      tl.from(st, { y: 30, opacity: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' }, 0.35);
      crecenTiras(tl, st.map(function (x) { return x.querySelector('[data-tira]'); }), 0.45, 0.12);
      st.forEach(function (x, i) { contar(tl, q(x, '[data-cifra]'), 0.45 + i * 0.12); });
    });
  });

  q(document, 'section[data-lamina$="-oro"]').forEach(function (sec) {
    animar(sec.dataset.label, function (tl, s) {
      entraCabecera(tl, s);
      var r = uno(s, '[data-avance]'), W = parseFloat(r.getAttribute('width'));
      var DUR = 1.8, T0 = 0.35;
      tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: W }, duration: DUR, ease: 'none', immediateRender: true }, T0);
      // Cada pico aparece cuando la línea pasa por su minuto.
      q(s, '[data-pico]').forEach(function (p) {
        tl.from(p, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.5)' }, T0 + DUR * parseFloat(p.dataset.t));
      });
      tl.from(uno(s, '[data-pie]'), { y: 20, opacity: 0, duration: 0.4 }, T0 + DUR);
    });
  });

  q(document, 'section[data-lamina$="-roles"]').forEach(function (sec) {
    animar(sec.dataset.label, function (tl, s) {
      entraCabecera(tl, s);
      var filas = q(s, '[data-rol]');
      tl.from(filas, { y: 50, opacity: 0, duration: 0.45, stagger: 0.12, ease: 'power3.out' }, 0.25);
      filas.forEach(function (f, i) { crecenTiras(tl, q(f, '[data-tira]'), 0.4 + i * 0.12, 0.08); });
    });
  });

  animar('r1-lideres', function (tl, s) {
    tl.from(q(s, '[data-lider]'), { y: 60, opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)' }, 0.15);
  });
})();
</script>`;

// ── Documento ────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Worlds 2026 · Ronda 1 en números</title>
${kit.og({ titulo: 'Worlds 2026 · Ronda 1 en números', descripcion: 'Oro, kills y daño de los partidos de la primera ronda de la fase suiza, por equipo y por rol.', carpeta: 'suiza-r1' })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:ital,wght@0,500;0,600;0,700;0,800;1,800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<script src="./deck-stage.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: ${BG}; }
  .cromo {
    background: linear-gradient(180deg, #FFFFFF 0%, #DCE2EA 40%, #8D97A5 52%, #F3F6F9 63%, #B6BFCB 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  #modo-presentacion {
    position: fixed; top: 16px; right: 16px; z-index: 2147483000;
    padding: 9px 18px; border: 1px solid ${a(HIELO, 0.45)}; border-radius: 999px;
    background: rgba(7,7,10,0.85); color: ${HIELO}; cursor: pointer;
    font: 600 13px/1 ${BODY}; letter-spacing: 0.6px;
    opacity: 0.5; transition: opacity 160ms ease;
  }
  #modo-presentacion:hover { opacity: 1; }
  #modo-presentacion[data-on] { opacity: 0; }
  #modo-presentacion[data-on]:hover { opacity: 1; }
</style>
</head>
<body>
<deck-stage width="1080" height="1920">
${slides.join('\n')}
</deck-stage>
${kit.gsap(__dirname, [])}
${kit.animador()}
${coreografias}
<script>
(function () {
  var presenting = false;
  var btn = document.createElement('button');
  btn.id = 'modo-presentacion';
  btn.type = 'button';
  function render() {
    btn.textContent = presenting ? 'Salir · Esc' : 'Presentar · P';
    if (presenting) btn.setAttribute('data-on', ''); else btn.removeAttribute('data-on');
  }
  function setPresenting(on) {
    if (on === presenting) return;
    presenting = on;
    window.postMessage({ __omelette_presenting: on }, '*');
    if (on) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    render();
  }
  btn.addEventListener('click', function () { setPresenting(!presenting); btn.blur(); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') { setPresenting(!presenting); e.preventDefault(); }
    else if (e.key === 'Escape' && presenting && !document.fullscreenElement) setPresenting(false);
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && presenting) setPresenting(false); });
  render();
  document.body.appendChild(btn);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(__dirname + '/index.html', kit.diferir(html), 'utf8');
console.log(`index.html generado: ${slides.length} diapositivas`);
