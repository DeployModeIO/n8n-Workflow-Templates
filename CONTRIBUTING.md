# 📋 Contributing Guide — n8n Workflow Templates

¡Gracias por tu interés en contribuir! Esta guía te explica cómo agregar plantillas, corregir errores y proponer mejoras.

## 🚀 Inicio rápido

```bash
git clone https://github.com/USER/n8n-workflow-templates.git
cd n8n-workflow-templates
npm test          # verificar integridad
npm run build     # regenerar diagramas + test
```

Abre `index.html` en tu navegador para ver la biblioteca.

## 📐 Cómo agregar una plantilla nueva

### 1. Crear el archivo JSON del workflow

1. Diseña tu workflow en n8n (localhost:5678)
2. Selecciónalo → menú ⋮ → **Download** → guarda el `.json`
3. Renómbralo con el formato: `Categoria-Nombre-Descriptivo.json`
4. Colócalo en la carpeta de categoría correspondiente (01-09)

### 2. Registrar la plantilla en `data.js`

Agrega un objeto al array `TEMPLATES`:

```javascript
{
  cat: "01-IA-AI",                    // ID de categoría (ver CATS)
  name: "IA · Nombre del Workflow",   // Título visible
  file: "IA-Nombre-Workflow",         // Nombre del archivo SIN extensión
  desc: "Descripción breve de qué hace.",
  flow: [                             // Nodos del flujo [nombre, tipo]
    ["Trigger","trigger"],
    ["Procesar","logic"],
    ["Resultado","action"]
  ],
  creds: ["openAiApi"],               // Credenciales necesarias
  uses: ["Caso 1","Caso 2"],         // Casos de uso (máx 4)
  obs: ["Nota técnica 1","Nota 2"],   // Observaciones y tips
  tags: ["ia","etiqueta1","etiqueta2"]
},
```

**Tipos de nodo válidos para `flow`:** `trigger`, `ai`, `action`, `logic`, `data`, `comms`, `wait`

### 3. Generar el diagrama SVG

```bash
npm run build:diagrams
```

Esto regenera TODOS los diagramas automáticamente desde `data.js`.

### 4. Verificar

```bash
npm test
```

Debe mostrar `✓ TODOS LOS TESTS PASARON`.

## 📁 Estructura de carpetas

```
01-IA-AI/              # Inteligencia Artificial
02-Webhooks-API/       # APIs y webhooks
03-Email-Comunicacion/ # Email y mensajería
04-Datos-Scraping/     # Datos, scraping, ETL
05-Productividad/      # Productividad y ofimática
06-Redes-Sociales/     # Redes sociales
07-DevOps/             # Operaciones y monitoring
08-Marketing/          # Marketing y ventas
09-Industrial-Plantas/ # Oil&Gas, minería, SCADA, etc.
```

## ✅ Criterios de aceptación

- [ ] El JSON importa correctamente en n8n (probado)
- [ ] `npm test` pasa sin errores
- [ ] El diagrama SVG se generó con `npm run build:diagrams`
- [ ] Los placeholders están documentados (ej: `TU_CHAT_ID`, `TU_SPREADSHEET_ID`)
- [ ] No contiene credenciales reales ni API keys
- [ ] La descripción es clara y los casos de uso son concretos

## 🔒 Seguridad

- **NUNCA** incluyas API keys, tokens, contraseñas o credenciales reales en los JSON
- Usa placeholders: `TU_API_KEY`, `TU_BOT_TOKEN`, etc.
- Los workflows deben funcionar después de que el usuario configure sus credenciales

## 🎨 Convenciones de nombres

- Archivos: `Categoria-Nombre-Descriptivo.json` (PascalCase con guiones)
- Entradas en data.js: `file` sin extensión, debe coincidir exactamente
- Tags: minúsculas, sin espacios, separados por guiones (ej: `oil-gas`, `web-scraping`)

## 🐛 Reportar bugs

Abre un [Issue](https://github.com/USER/n8n-workflow-templates/issues) con:
- Descripción del problema
- Pasos para reproducir
- Captura de pantalla (si aplica)
- Versión de n8n y navegador

## 💡 Proponer mejoras

Las ideas son bienvenidas. Abre un Issue con la etiqueta `enhancement` describiendo:
- Qué problema resuelve
- Cómo imaginas la solución
- Si estás dispuesto a implementarla

## 📜 Licencia

Al contribuir, aceptas que tus aportes se publican bajo licencia MIT.
