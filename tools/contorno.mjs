// Saca el «dibujo de líneas» de una imagen: curvas de nivel de su luminancia.
// Lo llama kit.contorno() en build-time (como diagrama.mjs, con el Chrome del
// sistema); no se usa a mano. Entrada: JSON por argv. Salida: JSON por stdout
// con la rejilla de luminancia ya recortada como `object-fit: cover`.
//
// Chrome solo hace lo que Node no sabe sin dependencias: decodificar el JPEG,
// recortarlo, reducirlo y suavizarlo (canvas con filter: blur). Las curvas se
// sacan en kit-efectos.cjs con el mismo marching squares de kit-patrones.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const { archivo, ancho, alto, detalle, suavizado, posicion } = JSON.parse(process.argv[2]);
const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));

const ext = archivo.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
const datos = `data:image/${ext};base64,${fs.readFileSync(archivo).toString('base64')}`;
const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const pagina = await navegador.newPage();
const rejilla = await pagina.evaluate(async ({ datos, ancho, alto, detalle, suavizado, posicion }) => {
  const img = new Image();
  img.src = datos;
  await img.decode();
  // recorte tipo object-fit: cover con object-position en fracciones
  const escala = Math.max(ancho / img.naturalWidth, alto / img.naturalHeight);
  const vw = ancho / escala, vh = alto / escala;
  const sx = (img.naturalWidth - vw) * posicion[0], sy = (img.naturalHeight - vh) * posicion[1];
  const w = detalle, h = Math.round(detalle * alto / ancho);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.filter = `blur(${suavizado}px)`;
  ctx.drawImage(img, sx, sy, vw, vh, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  const lum = new Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = Math.round((0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]));
  return { w, h, lum };
}, { datos, ancho, alto, detalle, suavizado, posicion });
await navegador.close();
process.stdout.write(JSON.stringify(rejilla));
