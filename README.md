<div align="center">

# ⚡ n8n Workflow Templates

**Biblioteca de automatizaciones para n8n — listas para producción**

[![Plantillas](https://img.shields.io/badge/plantillas-51-3b82f6?style=for-the-badge)](#)
[![Categorías](https://img.shields.io/badge/categorías-9-22d3ee?style=for-the-badge)](#)
[![Herramientas](https://img.shields.io/badge/tools-32-f59e0b?style=for-the-badge)](#)
[![Licencia](https://img.shields.io/badge/licencia-MIT-22c55e?style=for-the-badge)](LICENSE)

Catálogo visual interactivo de workflows para n8n con diagramas profesionales, wizard de ayuda y toolbox de herramientas open-source.

</div>

---

## 📋 Tabla de contenidos

- [Qué es](#-qué-es)
- [Características](#-características)
- [Instalación rápida](#-instalación-rápida)
- [Cómo usar las plantillas](#-cómo-usar-las-plantillas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Categorías](#-categorías)
- [Toolbox de herramientas](#-toolbox-de-herramientas-open-source)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Qué es

Una biblioteca **autocontenida** (sin backend, sin dependencias) de plantillas de workflows para n8n, organizadas por categoría, con:

- **JSON importable** en n8n (arrastrar al canvas o `Ctrl+C`/`Ctrl+V`)
- **Diagrama SVG profesional** por cada workflow (estilo plano de ingeniería)
- **Catálogo web** con búsqueda, filtros y tema oscuro/claro
- **Wizard interactivo** para usuarios que no conocen n8n
- **Toolbox** con 32 herramientas open-source y detección de servicios locales

Pensado para **industria** (Oil & Gas, minería, desaladoras, metalúrgicas, refinerías, maestranzas) y automatización general.

---

## ✨ Características

| Feature | Descripción |
|---------|-------------|
| 📦 51 plantillas | Workflows probados en 9 categorías |
| 🎨 Diagramas profesionales | SVG con iconos, leyenda y bloque de ingeniería |
| 🔍 Catálogo interactivo | Búsqueda en tiempo real + filtros por categoría |
| 🧙 Wizard de ayuda | 8 pasos visuales con memoria (localStorage) |
| 🧰 Toolbox | 32 herramientas open-source con detección de puertos |
| 🌗 Tema dual | Oscuro (azul/negro) y claro |
| 📱 PWA | Funciona offline con service worker |
| ♿ Accesible | ARIA, skip-link, navegación por teclado |
| 🌐 i18n | Español / Inglés |
| 🤖 CI/CD | GitHub Actions valida JSON + SVG en cada push |
| 🧪 Tests | `npm test` valida integridad completa |

---

## 🚀 Instalación rápida

### Opción A: n8n local (recomendado)

```bash
# Instalar n8n global
npm install -g n8n

# Iniciar
n8n start
# → Abre http://localhost:5678
```

### Opción B: Ver la biblioteca

```bash
git clone https://github.com/USER/n8n-workflow-templates.git
cd n8n-workflow-templates

# Abrir el catálogo
# Doble clic en index.html
# o:
npx http-server . -p 3000
```

---

## 📖 Cómo usar las plantillas

1. Abre el catálogo (`index.html`) en tu navegador
2. Busca una plantilla por nombre, categoría o etiqueta
3. Haz clic en **⬇ Abrir JSON**
4. En n8n:
   - **Arrastra** el archivo `.json` al canvas, **o**
   - Copia el contenido del JSON y pulsa `Ctrl+V` en el canvas
5. Configura tus credenciales (los nodos lo indican con 🔑)
6. Pulsa **Test workflow** y luego activa con el switch **Active**

> 💡 ¿No sabes usar n8n? Pulsa el botón **?** en el catálogo — el wizard te guía paso a paso.

---

## 🗂️ Estructura del proyecto

```
n8n-workflow-templates/
├── index.html              # Catálogo web interactivo
├── data.js                 # Base de datos de plantillas (fuente única)
├── build-all.js            # Generador de diagramas SVG (Node)
├── Generate-Diagram.ps1    # Generador standalone (PowerShell)
├── sw.js                   # Service Worker (PWA offline)
├── manifest.json           # PWA manifest
├── package.json            # Scripts npm (test, build, lint)
├── tests/
│   └── validate.js         # Test de integridad
├── .github/workflows/
│   └── ci.yml              # CI/CD GitHub Actions
│
├── 01-IA-AI/               # 9 plantillas
├── 02-Webhooks-API/        # 5 plantillas
├── 03-Email-Comunicacion/  # 4 plantillas
├── 04-Datos-Scraping/      # 5 plantillas
├── 05-Productividad/       # 4 plantillas
├── 06-Redes-Sociales/      # 4 plantillas
├── 07-DevOps/              # 4 plantillas
├── 08-Marketing/           # 4 plantillas
├── 09-Industrial-Plantas/  # 12 plantillas
│
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── ROADMAP.md
├── LICENSE
└── .gitignore
```

Cada categoría contiene:
- `*.json` — Workflow importable en n8n
- `*.svg` — Diagrama profesional
- `CATALOGO.md` — Documentación detallada (categorías 01-02)

---

## 📂 Categorías

| # | Categoría | Plantillas | Cobertura |
|---|-----------|:----------:|-----------|
| 01 | **IA / AI** | 9 | OpenAI, Whisper, RAG, DALL-E, traducción, sentimiento |
| 02 | **Webhooks / API** | 5 | REST, formularios, Stripe, paginación, Typeform |
| 03 | **Email / Comunicación** | 4 | Gmail, facturas, newsletter, WhatsApp |
| 04 | **Datos / Scraping** | 5 | RSS, scraper web, precios, CSV, Postgres |
| 05 | **Productividad** | 4 | Calendar, Trello-Notion, backup, tareas IA |
| 06 | **Redes Sociales** | 4 | Telegram, Discord, LinkedIn, Buffer |
| 07 | **DevOps** | 4 | Uptime, GitHub, SSL, errores |
| 08 | **Marketing** | 4 | Leads, Mailchimp, HubSpot, webinar |
| 09 | **Industrial / Plantas** | 12 | SCADA, HSE, turnos, bitácora, maestranza |

---

## 🧰 Toolbox de herramientas open-source

El panel inferior del catálogo incluye 32 herramientas con detección automática:

- **IA Local**: Ollama, LM Studio, Whisper.cpp, LocalAI, SearXNG
- **Bases de Datos**: PostgreSQL, MySQL, Redis, InfluxDB, MongoDB
- **Monitoreo**: Grafana, Prometheus, Uptime Kuma, Portainer
- **Comunicación**: Mattermost, Rocket.Chat, ntfy
- **Almacenamiento**: MinIO, Nextcloud
- **No-Code/CMS**: NocoDB, Baserow, Directus, Supabase, Appwrite
- **IoT/Industrial**: MQTT, Node-RED, Home Assistant
- **Documentos**: Gotenberg, Stirling-PDF, Paperless-ngx
- **Web/Scraping**: ChangeDetection, Playwright

Cada herramienta muestra su estado (🟢 conectado / ⚫ no detectado) y, si no está instalada, ofrece comandos `winget`/`docker` para instalarla.

---

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md). Resumen:

```bash
# 1. Diseña tu workflow en n8n → exporta el JSON
# 2. Agrégalo a la carpeta de categoría
# 3. Regístralo en data.js
# 4. Genera el diagrama
npm run build:diagrams

# 5. Verifica
npm test

# 6. Commit + PR
```

---

## 📜 Licencia

[MIT](LICENSE) — úsalo, modifícalo y distribúyelo libremente.

---

<div align="center">

**Fuentes y referencias**: [n8n.io/workflows](https://n8n.io/workflows/) · [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) · [felipfr/awesome-n8n-workflows](https://github.com/felipfr/awesome-n8n-workflows) · [Activepieces](https://www.activepieces.com/pieces)

</div>
