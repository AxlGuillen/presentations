// Renderiza un diagrama Mermaid a SVG en build-time.
// Uso: node tools/diagrama.mjs [archivo.mmd] [configJSON]
//   - sin archivo, lee el código Mermaid de stdin
//   - configJSON es el objeto de mermaid.initialize() (tema, themeVariables,
//     fontFamily…) para que el diagrama salga con la paleta del deck
//   - escribe el SVG a stdout
//
// Los gen.js no lo llaman directo: usan kit.diagrama(codigo, config), que
// envuelve este script con execFileSync. El SVG va inline al HTML generado,
// así que el deck sigue autocontenido y sin Mermaid en runtime.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const raiz = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const esJson = s => s && s.trim().startsWith('{');
const archivo = args.find(a => !esJson(a));
const config = JSON.parse(args.find(esJson) || '{}');

const codigo = archivo
  ? fs.readFileSync(path.resolve(archivo), 'utf8')
  : fs.readFileSync(0, 'utf8');
if (!codigo.trim()) { console.error('Sin código Mermaid (archivo o stdin).'); process.exit(1); }

const CHROME = [
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('No encontré Chrome ni Edge instalados.'); process.exit(1); }

const mermaidJs = fs.readFileSync(path.join(raiz, 'tools', 'vendor', 'mermaid.min.js'), 'utf8');

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
try {
  const pagina = await navegador.newPage();
  pagina.on('pageerror', e => console.error('[mermaid]', e.message));
  await pagina.setContent('<!DOCTYPE html><html><body></body></html>');
  await pagina.addScriptTag({ content: mermaidJs });
  const svg = await pagina.evaluate(async (codigo, config) => {
    mermaid.initialize({ startOnLoad: false, ...config });
    const { svg } = await mermaid.render('diagrama', codigo);
    return svg;
  }, codigo, config);
  process.stdout.write(svg);
} finally {
  await navegador.close();
}
