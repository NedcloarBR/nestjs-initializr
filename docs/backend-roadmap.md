# ⚙️ Backend Roadmap

This document outlines planned features and improvements for the NestJS Initializr backend.

## 📦 Current Features

- Plugin-based generator architecture
- Automatic plugin discovery with decorators
- Biome lint/format before zip creation
- NPM package search proxy with caching
- Configuration file export
- Fastify HTTP adapter
- Swagger API documentation
- Rate limiting with @nestjs/throttler
- Health checks with @nestjs/terminus
- Request ID tracking (X-Request-Id header)
- CORS configuration
- Helmet security headers
- Global validation pipe with class-validator
- Global exception filter with structured errors
- Structured logging with request tracing

---

## 🔴 High Priority

Essential improvements for reliability and performance.

| Feature | Description |
|---------|-------------|
| **Plugin Validation** | Validate plugin outputs before zip creation |
| **Generation Metrics** | Track generation time, file count, errors |
| **Plugin Testing** | Unit tests for each plugin |
| **E2E Generation Tests** | Verify generated projects compile |
| **Input Sanitization** | Sanitize all user inputs before file generation |
| **Path Traversal Protection** | Prevent malicious file paths |

---

## 🟡 Medium Priority

Features that enhance maintainability and developer experience.

| Feature | Description |
|---------|-------------|
| **Generation Queue** | Queue system for high load scenarios |
| **OpenAPI Spec** | Auto-generate TypeScript client from spec |
| **OpenTelemetry** | Distributed tracing with Grafana stack |
| **Prometheus Metrics** | Export metrics for monitoring |
| **Sentry Integration** | Error tracking and performance monitoring |
| **Streaming Zip** | Stream zip creation instead of buffering |

---

## 🟢 Low Priority

Nice to have for specific use cases.

| Feature | Description |
|---------|-------------|
| **Plugin Marketplace API** | Endpoints for community plugins |
| **Analytics API** | Popular modules, configurations statistics |
| **Webhook Notifications** | Notify external services on generation |
| **S3 Storage** | Store generated zips in cloud storage |
| **Generation History API** | Server-side generation history (auth required) |
| **Template Versioning** | Support multiple NestJS versions |
| **API Key Authentication** | Optional auth for rate limit bypass |
| **Dependency Scanning** | Verify generated dependencies are safe |

---

## 🏗️ Architecture Improvements

| Improvement | Description |
|-------------|-------------|
| **Plugin Isolation** | Run plugins in isolated contexts |
| **Dependency Graph** | Automatic plugin ordering based on dependencies |
| **Template Engine** | Use EJS/Handlebars for complex templates |
| **Virtual File System** | Generate in-memory before disk write |
| **Parallel Generation** | Run independent plugins concurrently |
| **Worker Threads** | Offload heavy tasks to workers |

---

## 🧪 Testing Strategy

| Type | Description | Coverage Target |
|------|-------------|-----------------|
| **Unit Tests** | Plugin logic, utilities, services | 80% |
| **Integration Tests** | API endpoints, plugin system | 70% |
| **E2E Tests** | Full generation flow | Key paths |
| **Snapshot Tests** | Generated file content verification | All plugins |
| **Performance Tests** | Load testing with k6 or Artillery | Critical paths |

---

## 🔧 Technical Debt

| Task | Description |
|------|-------------|
| **Reduce Cognitive Complexity** | Refactor generatePackageJson method |
| **Remove Deprecated Code** | Clean up old generator service |
| **Type Safety** | Eliminate any types |
| **Documentation** | JSDoc for all public methods |

---

## ⚡ Suggested Implementation Order

```
Phase 1: Quality & Security
├── Plugin validation
├── Input sanitization
├── Path traversal protection
├── Plugin unit tests
└── E2E generation tests

Phase 2: Performance
├── Generation queue
├── Streaming zip
├── Worker threads
└── Reduce technical debt

Phase 3: Observability
├── OpenTelemetry + Grafana
├── Prometheus metrics
├── Sentry integration
└── Generation metrics

Phase 4: Advanced
├── Plugin marketplace API
├── Analytics API
├── Template versioning
└── S3 storage
```

---

## 📡 API Endpoints (Current)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generator` | Generate project zip |
| POST | `/generator/config` | Export configuration file |
| GET | `/npm/packages` | Search NPM packages |
| GET | `/health` | Health check |

---

## 📡 API Endpoints (Planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plugins` | List available plugins |
| GET | `/plugins/:name` | Get plugin details |
| GET | `/presets` | List preset configurations |
| GET | `/stats` | Generation statistics |
| POST | `/validate` | Validate configuration without generating |

---

## 🤝 Contributing

Want to contribute? Check out:
- [Creating Plugins](./creating-plugins.md) - Plugin development guide
- [Plugin Roadmap](./plugins-roadmap.md) - Planned plugins

### Code Guidelines

- Follow NestJS best practices
- Use dependency injection
- Write unit tests for new features
- Document public APIs with JSDoc
- Keep cognitive complexity under 15
