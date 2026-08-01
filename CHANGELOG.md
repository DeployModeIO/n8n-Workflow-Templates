# 📝 Changelog

Todos los cambios notables de este proyecto se documentan aquí.
El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] — 2026-08-01

### ✨ Añadido
- **51 plantillas** de workflows n8n en 9 categorías:
  - IA / AI (9): resumen, clasificación, RAG, Whisper, DALL-E, traducción, PDF, sentimiento, contenido
  - Webhooks / API (5): REST genérico, formularios, Stripe, paginación, Typeform
  - Email / Comunicación (4): auto-responder, facturas, newsletter, WhatsApp
  - Datos / Scraping (5): RSS, scraper web, monitor precios, CSV, Postgres sync
  - Productividad (4): calendar, Trello-Notion, backup, gestor tareas IA
  - Redes Sociales (4): bot Telegram, Discord, LinkedIn, Buffer
  - DevOps (4): uptime, GitHub, SSL, alertas errores
  - Marketing (4): leads, Mailchimp, HubSpot, webinar
  - Industrial / Plantas (12): checklist, bitácora, turnos, HSE, PTW, SST, SCADA, producción, calibración, parada/arranque, maestranza
- **Catálogo web interactivo** (`index.html`):
  - Diseño glassmorphism oscuro azul/negro (estilo DataCore)
  - Búsqueda en tiempo real por nombre, descripción, nodos, tags
  - Filtros por categoría con chips
  - Tema oscuro/claro con persistencia
  - Responsive (desktop, tablet, móvil)
- **Wizard de ayuda** lateral:
  - 8 pasos visuales con ilustraciones SVG
  - Progreso persistente en localStorage
  - Timeline interactivo con micro-animaciones
- **Toolbox inferior**:
  - 32 herramientas open-source categorizadas
  - Detección automática de servicios locales (ping por puerto)
  - Modal de instalación con comandos winget/docker/npm
  - Drag & drop de nodos pre-configurados a n8n
  - Copy-to-clipboard de nodos n8n
- **Diagramas SVG profesionales**:
  - Estilo plano de ingeniería con bloque de título
  - Iconos vectoriales por tipo de nodo
  - Leyenda de colores
  - Generados automáticamente desde data.js (`npm run build:diagrams`)
- **Infraestructura de proyecto**:
  - Tests de integridad automatizados (`npm test`)
  - CI/CD con GitHub Actions
  - PWA con service worker (modo offline)
  - Meta tags OG/Twitter para redes sociales
  - Accesibilidad: ARIA, skip-link, navegación por teclado
  - Soporte i18n ES/EN

### 🔧 Técnico
- `data.js` como fuente única de verdad (51 plantillas)
- `build-all.js` genera 51 diagramas SVG desde data.js
- `Generate-Diagram.ps1` generador standalone (PowerShell)
- `tests/validate.js` valida JSON, SVG, referencias cruzadas
- Sin dependencias npm externas (100% vanilla JS)
