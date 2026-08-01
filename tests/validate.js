#!/usr/bin/env node
/**
 * validate.js — Test de integridad del proyecto n8n Workflow Templates
 *
 * Verifica:
 * 1. Todos los JSON de workflows son validos (parse sin errores)
 * 2. Cada plantilla en data.js tiene su .json y .svg en disco
 * 3. No hay .json o .svg huerfanos (sin entrada en data.js)
 * 4. Cada workflow tiene los campos obligatorios (nodes, connections)
 * 5. Los diagramas SVG estan bien formados (contienen <svg> y </svg>)
 *
 * Uso:
 *   node tests/validate.js            → test completo
 *   node tests/validate.js --json-only → solo validar JSONs
 *
 * Exit code: 0 = OK, 1 = errores encontrados
 */

const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

let errors = 0;
let warnings = 0;

function log(icon, msg, color = '') {
  console.log(`${color}${icon}${COLORS.reset} ${msg}`);
}

function err(msg) { errors++; log('✗', msg, COLORS.red); }
function ok(msg) { log('✓', msg, COLORS.green); }
function warn(msg) { warnings++; log('⚠', msg, COLORS.yellow); }
function info(msg) { log('ℹ', msg, COLORS.cyan); }

// ── Cargar data.js ──
const dataJsPath = path.join(BASE, 'data.js');
if (!fs.existsSync(dataJsPath)) {
  err('data.js no encontrado');
  process.exit(1);
}

const dataJs = fs.readFileSync(dataJsPath, 'utf8');
let TEMPLATES, CATS, NODE_COLORS;
eval(dataJs + '\n;this._r={TEMPLATES,CATS,NODE_COLORS}');
({ TEMPLATES, CATS, NODE_COLORS } = eval('this._r') || {});

if (!TEMPLATES || !CATS) {
  err('No se pudieron leer TEMPLATES o CATS de data.js');
  process.exit(1);
}

const jsonOnly = process.argv.includes('--json-only');

console.log(`\n${COLORS.bold}${COLORS.cyan}═══════════════════════════════════════════${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}  n8n Workflow Templates — Test de Integridad${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}═══════════════════════════════════════════${COLORS.reset}\n`);

// ── 1. Validar campos de cada plantilla en data.js ──
info(`Validando ${TEMPLATES.length} plantillas en data.js...`);
const requiredFields = ['cat', 'name', 'file', 'desc', 'flow', 'creds', 'uses', 'obs', 'tags'];
const validCats = new Set(Object.keys(CATS));

for (const t of TEMPLATES) {
  for (const f of requiredFields) {
    if (!(f in t)) {
      err(`Plantilla "${t.name || t.file}" falta campo: ${f}`);
    }
  }
  if (t.cat && !validCats.has(t.cat)) {
    err(`Plantilla "${t.name}" tiene categoria invalida: ${t.cat}`);
  }
  if (t.flow && !Array.isArray(t.flow)) {
    err(`Plantilla "${t.name}" flow no es array`);
  }
  if (t.flow) {
    for (const f of t.flow) {
      if (!Array.isArray(f) || f.length < 2) {
        err(`Plantilla "${t.name}" flow item invalido: ${JSON.stringify(f)}`);
      }
    }
  }
  if (t.tags && t.tags.length === 0) {
    warn(`Plantilla "${t.name}" no tiene tags`);
  }
}
ok(`${TEMPLATES.length} plantillas validadas en data.js`);
ok(`${Object.keys(CATS).length} categorias definidas`);

if (jsonOnly) {
  // Solo validar JSONs, saltar resto
}

// ── 2. Validar JSONs en disco ──
if (!jsonOnly) {
  info('Validando archivos JSON en disco...');
}

const walk = (dir) => {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'tests') {
      results.push(...walk(full));
    } else if (entry.isFile() && (full.endsWith('.json') || full.endsWith('.svg'))) {
      results.push(full);
    }
  }
  return results;
};

const allFiles = walk(BASE);
const jsonFiles = allFiles.filter(f => f.endsWith('.json'));
const svgFiles = allFiles.filter(f => f.endsWith('.svg'));

// Validar parse de cada JSON
let jsonOk = 0;
const jsonByFolder = {};
for (const f of jsonFiles) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      warn(`${path.relative(BASE, f)}: JSON valido pero sin campo "nodes"`);
    }
    if (!parsed.connections) {
      warn(`${path.relative(BASE, f)}: JSON valido pero sin campo "connections"`);
    }
    jsonOk++;
    const folder = path.basename(path.dirname(f));
    jsonByFolder[folder] = (jsonByFolder[folder] || 0) + 1;
  } catch (e) {
    err(`${path.relative(BASE, f)}: JSON invalido → ${e.message}`);
  }
}
ok(`${jsonOk}/${jsonFiles.length} JSON validos`);

// ── 3. Verificar que cada plantilla en data.js tenga .json + .svg ──
if (!jsonOnly) {
  info('Verificando referencias cruzadas data.js ↔ disco...');
  for (const t of TEMPLATES) {
    const jsonPath = path.join(BASE, t.cat, t.file + '.json');
    const svgPath = path.join(BASE, t.cat, t.file + '.svg');
    if (!fs.existsSync(jsonPath)) err(`Falta JSON: ${t.cat}/${t.file}.json`);
    if (!fs.existsSync(svgPath)) err(`Falta SVG: ${t.cat}/${t.file}.svg`);
  }

  // ── 4. Detectar huerfanos (archivos sin entrada en data.js) ──
  info('Detectando archivos huerfanos...');
  const knownKeys = new Set(TEMPLATES.map(t => `${t.cat}/${t.file}`));
  for (const f of jsonFiles) {
    const rel = path.relative(BASE, f).replace(/\\/g, '/').replace('.json', '');
    if (!knownKeys.has(rel) && !f.includes('package.json') && !f.includes('manifest.json')) {
      warn(`JSON huerfano (no esta en data.js): ${rel}.json`);
    }
  }
  for (const f of svgFiles) {
    const rel = path.relative(BASE, f).replace(/\\/g, '/').replace('.svg', '');
    if (!knownKeys.has(rel)) {
      warn(`SVG huerfano (no esta en data.js): ${rel}.svg`);
    }
  }

  // ── 5. Validar SVGs bien formados ──
  info('Validando estructura de SVGs...');
  let svgOk = 0;
  for (const f of svgFiles) {
    const content = fs.readFileSync(f, 'utf8');
    if (!content.includes('<svg') || !content.includes('</svg>')) {
      err(`SVG mal formado: ${path.relative(BASE, f)}`);
    } else {
      svgOk++;
    }
  }
  ok(`${svgOk}/${svgFiles.length} SVG bien formados`);

  // ── 6. Verificar index.html y data.js existencia ──
  info('Verificando archivos core...');
  const coreFiles = ['index.html', 'data.js', 'build-all.js', 'Generate-Diagram.ps1'];
  for (const cf of coreFiles) {
    if (!fs.existsSync(path.join(BASE, cf))) {
      err(`Archivo core faltante: ${cf}`);
    } else {
      ok(`Archivo core OK: ${cf}`);
    }
  }
}

// ── Resumen por categoria ──
console.log(`\n${COLORS.bold}── Resumen por categoria ──${COLORS.reset}`);
const byCat = {};
for (const t of TEMPLATES) byCat[t.cat] = (byCat[t.cat] || 0) + 1;
for (const [cat, count] of Object.entries(byCat).sort()) {
  const catName = CATS[cat]?.name || cat;
  const color = CATS[cat]?.color || '#888';
  console.log(`  ${COLORS.gray}${cat.padEnd(26)}${COLORS.reset} ${count} plantillas  ${catName}`);
}

// ── Resultado final ──
console.log(`\n${COLORS.bold}${'═'.repeat(45)}${COLORS.reset}`);
if (errors === 0) {
  console.log(`${COLORS.bold}${COLORS.green}  ✓ TODOS LOS TESTS PASARON${COLORS.reset}`);
  if (warnings > 0) console.log(`${COLORS.yellow}  ⚠ ${warnings} advertencias (no bloqueantes)${COLORS.reset}`);
  console.log(`  Plantillas: ${TEMPLATES.length} | JSON: ${jsonOk} | SVG: ${svgFiles.length} | Categorias: ${Object.keys(CATS).length}\n`);
  process.exit(0);
} else {
  console.log(`${COLORS.bold}${COLORS.red}  ✗ ${errors} ERROR(ES) ENCONTRADO(S)${COLORS.reset}`);
  if (warnings > 0) console.log(`${COLORS.yellow}  ⚠ ${warnings} advertencias${COLORS.reset}`);
  console.log('\n');
  process.exit(1);
}
