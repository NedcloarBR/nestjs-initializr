# 🚀 Project Roadmap

This document outlines planned features and improvements that impact the entire NestJS Initializr project.

## 📦 Current State

### Backend
- Plugin-based generator architecture
- Automatic plugin discovery
- Rate limiting, health checks, caching
- Biome lint/format before zip
- Swagger API documentation

### Frontend
- Next.js with shadcn/ui
- Light/dark theme
- i18n (en-US, pt-BR)
- Project history (localStorage)
- Configuration export/import

---

## 🔴 High Priority

Cross-cutting features that improve the entire system.

| Feature | Description | Affects |
|---------|-------------|---------|
| **Presets/Templates** | Quick-start configurations (API, Discord Bot, Microservice) | Backend + Frontend |
| **Share Configuration** | Generate shareable URL with encoded config | Backend + Frontend |
| **Preview Mode** | Show generated file tree before download | Backend + Frontend |
| **CLI Tool** | Generate projects via terminal command | New Package |
| **Monorepo Migration** | Better separation of packages with shared types | Backend + Frontend |

---

## 🟡 Medium Priority

Features that enhance user experience across the platform.

| Feature | Description | Affects |
|---------|-------------|---------|
| **Plugin API** | REST endpoints to list/describe available plugins | Backend + Frontend |
| **Validation API** | Validate configuration without generating | Backend + Frontend |
| **Generation Statistics** | Track and display popular modules/configurations | Backend + Frontend |
| **WebSocket Progress** | Real-time generation progress updates | Backend + Frontend |
| **Preset Sharing** | Save and share custom presets | Backend + Frontend |

---

## 🟢 Low Priority

Nice to have for specific use cases.

| Feature | Description | Affects |
|---------|-------------|---------|
| **GitHub Integration** | Create repo directly after generation | Backend + Frontend |
| **VS Code Extension** | Generate projects from VS Code | New Package |
| **Discord Bot** | Generate projects via Discord commands | New Package |
| **Self-Hosted Mode** | Docker image for self-hosting | DevOps |
| **Plugin Marketplace** | Community-created plugins and presets | Backend + Frontend |

---

## 🔧 Infrastructure

| Task | Description |
|------|-------------|
| **Shared Types Package** | Extract common types to shared package |
| **API Client Generation** | Auto-generate TypeScript client from OpenAPI |
| **E2E Testing** | Full flow tests (Frontend → Backend → Generated Project) |
| **CI/CD Pipeline** | Automated testing, building, and deployment |
| **Documentation Site** | Dedicated docs site with examples |

---

## 🌐 Deployment

| Task | Description |
|------|-------------|
| **Docker Compose** | Production-ready compose file |
| **Kubernetes Manifests** | K8s deployment files |
| **Terraform/Pulumi** | Infrastructure as code |
| **CDN Configuration** | Static asset caching |
| **Monitoring Stack** | Grafana + Prometheus + Loki |

---

## ⚡ Suggested Implementation Order

```
Phase 1: Core Features
├── Presets/Templates
├── Share configuration via URL
├── Preview mode (file tree)
└── Plugin API endpoints

Phase 2: Developer Experience
├── CLI tool (npm create nestjs-initializr)
├── Shared types package
├── API client generation
└── E2E testing

Phase 3: Integrations
├── Validation API
├── WebSocket progress
├── Generation statistics
└── GitHub integration

Phase 4: Community
├── Plugin marketplace
├── Preset sharing
├── VS Code extension
└── Documentation site

Phase 5: Production
├── Docker/K8s deployment
├── Monitoring stack
├── Self-hosted mode
└── CDN configuration
```

---

## 📊 Milestones

| Version | Focus | Key Features |
|---------|-------|--------------|
| **v1.1** | Templates | Presets, share URL, preview mode |
| **v1.2** | API | Plugin API, validation, statistics |
| **v1.3** | CLI | Command-line tool, shared types |
| **v1.4** | Integrations | GitHub, WebSocket progress |
| **v2.0** | Community | Marketplace, preset sharing |

---

## 📚 Related Roadmaps

- [Plugin Roadmap](./plugins-roadmap.md) - Planned generator plugins
- [Frontend Roadmap](./frontend-roadmap.md) - UI/UX improvements
- [Backend Roadmap](./backend-roadmap.md) - API and architecture improvements

---

## 🤝 Contributing

Want to contribute? Check out:
- [Creating Plugins](./creating-plugins.md) - Plugin development guide
- Open issues on GitHub for tasks to pick up
