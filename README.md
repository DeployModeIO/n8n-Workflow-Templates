<div align="center">

# ⚡ n8n Workflow Templates

**Production-ready automation library for n8n**

[![Templates](https://img.shields.io/badge/templates-194-3b82f6?style=for-the-badge)](#)
[![Categories](https://img.shields.io/badge/categories-9-22d3ee?style=for-the-badge)](#)
[![Tools](https://img.shields.io/badge/tools-32-f59e0b?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)](LICENSE)

Interactive visual catalog of n8n workflows with professional diagrams, a step-by-step wizard, and an open-source tools toolbox with auto-detection.

</div>

---

## Table of Contents

- [What is this?](#-what-is-this)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [How to Use Templates](#-how-to-use-templates)
- [Project Structure](#-project-structure)
- [Categories](#-categories)
- [Open-Source Toolbox](#-open-source-toolbox)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 What is this?

A **self-contained** (no backend, no dependencies) library of n8n workflow templates, organized by category, featuring:

- **Importable JSON** for n8n (drag onto canvas or `Ctrl+C`/`Ctrl+V`)
- **Professional SVG diagram** for each workflow (engineering-drawing style)
- **Web catalog** with search, filters, and dark/light theme
- **Interactive wizard** for users new to n8n
- **Toolbox** with 32 open-source tools and local service auto-detection

Built for **industry** (Oil & Gas, mining, desalination, metallurgy, refineries, maintenance shops) and general automation.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📦 194 templates | Tested workflows across 9 categories |
| 🎨 Professional diagrams | SVG with icons, legend, and engineering title block |
| 🔍 Interactive catalog | Real-time search + category filters |
| 🧙 Help wizard | 8 visual steps with progress memory (localStorage) |
| 🧰 Toolbox | 32 open-source tools with port auto-detection |
| 🌗 Dual theme | Dark (blue/black) and light |
| 📱 PWA | Works offline with service worker |
| ♿ Accessible | ARIA labels, skip-link, keyboard navigation |
| 🤖 CI/CD | GitHub Actions validates JSON + SVG on every push |
| 🧪 Tests | `npm test` validates full integrity |

---

## 🚀 Quick Start

### Option A: Run n8n locally (recommended)

```bash
# Install n8n globally
npm install -g n8n

# Start
n8n start
# → Opens http://localhost:5678
```

### Option B: Browse the catalog

```bash
git clone https://github.com/USER/n8n-workflow-templates.git
cd n8n-workflow-templates

# Open the catalog
# Double-click index.html
# or:
npx http-server . -p 3000
```

---

## 📖 How to Use Templates

1. Open the catalog (`index.html`) in your browser
2. Search for a template by name, category, or tag
3. Click **⬇ Abrir JSON**
4. In n8n:
   - **Drag** the `.json` file onto the canvas, **or**
   - Copy the JSON content and press `Ctrl+V` on the canvas
5. Configure your credentials (nodes indicate them with 🔑)
6. Click **Test workflow**, then toggle **Active**

> 💡 New to n8n? Click the **?** button in the catalog — the wizard guides you step by step.

---

## 🗂️ Project Structure

```
n8n-workflow-templates/
├── index.html              # Interactive web catalog
├── data.js                 # Template database (single source of truth)
├── build-all.js            # SVG diagram generator (Node.js)
├── Generate-Diagram.ps1    # Standalone generator (PowerShell)
├── sw.js                   # Service Worker (PWA offline)
├── manifest.json           # PWA manifest
├── package.json            # npm scripts (test, build, lint)
├── tests/
│   └── validate.js         # Integrity test suite
├── .github/workflows/
│   └── ci.yml              # CI/CD GitHub Actions
│
├── 01-IA-AI/               # 33 templates
├── 02-Webhooks-API/        # 20 templates
├── 03-Email-Comunicacion/  # 18 templates
├── 04-Datos-Scraping/      # 20 templates
├── 05-Productividad/       # 19 templates
├── 06-Redes-Sociales/      # 16 templates
├── 07-DevOps/              # 19 templates
├── 08-Marketing/           # 19 templates
├── 09-Industrial-Plantas/  # 30 templates
│
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── ROADMAP.md
├── LICENSE
└── .gitignore
```

Each category contains:
- `*.json` — Importable n8n workflow
- `*.svg` — Professional diagram

---

## 📂 Categories

| # | Category | Templates | Coverage |
|---|----------|:---------:|----------|
| 01 | **AI / ML** | 33 | OpenAI, Whisper, RAG, DALL-E, translation, sentiment, code gen |
| 02 | **Webhooks / API** | 20 | REST, forms, Stripe, pagination, GraphQL, rate limiter |
| 03 | **Email / Comms** | 18 | Gmail, invoices, newsletter, WhatsApp, SMS, drip campaigns |
| 04 | **Data / Scraping** | 20 | RSS, web scraper, price monitor, CSV, ETL, DB sync |
| 05 | **Productivity** | 19 | Calendar, Trello-Notion, backup, tasks, standup, onboarding |
| 06 | **Social Media** | 16 | Telegram, Discord, LinkedIn, Buffer, cross-post, listening |
| 07 | **DevOps** | 19 | Uptime, GitHub, SSL, logs, backups, auto-scaling, security |
| 08 | **Marketing** | 19 | Leads, Mailchimp, HubSpot, A/B testing, ROI, funnel |
| 09 | **Industrial / Plants** | 30 | SCADA, HSE, shifts, logbook, maintenance, quality, permits |

---

## 🧰 Open-Source Toolbox

The bottom panel of the catalog includes 32 tools with auto-detection:

- **Local AI**: Ollama, LM Studio, Whisper.cpp, LocalAI, SearXNG
- **Databases**: PostgreSQL, MySQL, Redis, InfluxDB, MongoDB
- **Monitoring**: Grafana, Prometheus, Uptime Kuma, Portainer
- **Comms**: Mattermost, Rocket.Chat, ntfy
- **Storage**: MinIO, Nextcloud
- **No-Code/CMS**: NocoDB, Baserow, Directus, Supabase, Appwrite
- **IoT/Industrial**: MQTT, Node-RED, Home Assistant
- **Documents**: Gotenberg, Stirling-PDF, Paperless-ngx
- **Web/Scraping**: ChangeDetection, Playwright

Each tool shows its status (🟢 connected / ⚫ not detected) and, if not installed, offers `winget`/`docker` commands to install it.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Quick summary:

```bash
# 1. Design your workflow in n8n → export the JSON
# 2. Add it to the category folder
# 3. Register it in data.js
# 4. Generate the diagram
npm run build:diagrams

# 5. Validate
npm test

# 6. Commit + PR
```

---

## 📜 License

[MIT](LICENSE) — use, modify, and distribute freely.

---

<div align="center">

**Sources & references**: [n8n.io/workflows](https://n8n.io/workflows/) · [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) · [felipfr/awesome-n8n-workflows](https://github.com/felipfr/awesome-n8n-workflows) · [Activepieces](https://www.activepieces.com/pieces)

</div>
