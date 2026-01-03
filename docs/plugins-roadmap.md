# 🗺️ Plugin Roadmap

This document outlines planned plugins for the NestJS Initializr project.

## 📦 Current Plugins

- `core` - Base NestJS project structure
- `config` - Configuration module with environment validation
- `docker` - Dockerfile, docker-compose.yml, .dockerignore
- `graphql` - GraphQL API with Apollo Server
- `husky` - Git hooks with lint-staged and commitlint
- `i18n` - Internationalization with nestjs-i18n
- `linter-formatter` - Biome or ESLint+Prettier
- `necord` - Discord bot framework
- `necord-lavalink` - Music player for Discord bots
- `necord-localization` - i18n for Discord bot commands
- `necord-pagination` - Paginated embeds for Discord bots
- `nestwhats` - WhatsApp bot framework
- `test-runner` - Jest or Vitest configuration
- `toolkit` - @nedcloarbr/nestjs-toolkit integration
- `extra` - CORS, Helmet, Compression, Validation

---

## 🔴 High Priority

Essential plugins that most projects need.

| Plugin | Description | Dependencies |
|--------|-------------|--------------|
| `prisma` | Prisma ORM with schema, migrations, and Prisma Client | config (optional) |
| `typeorm` | TypeORM setup with entities, migrations, and data source | config (optional) |
| `mongoose` | MongoDB with Mongoose schemas and connection | config (optional) |
| `swagger` | OpenAPI/Swagger UI with auto-generated documentation | config (optional) |
| `auth` | JWT authentication with Passport strategies and guards | config |
| `cache` | Redis caching with @nestjs/cache-manager | config (optional) |
| `queue` | Background job processing with Bull/BullMQ | config |

---

## 🟡 Medium Priority

Useful for many production applications.

| Plugin | Description | Dependencies |
|--------|-------------|--------------|
| `microservices` | Transport layer setup (TCP, Redis, RabbitMQ, Kafka, gRPC) | config |
| `websockets` | Real-time communication with Socket.io or native WS | - |
| `throttler` | Rate limiting with @nestjs/throttler | config (optional) |
| `health` | Health checks with @nestjs/terminus | - |
| `logger` | Structured logging with Pino or Winston | config (optional) |
| `mailer` | Email sending with templates (Nodemailer, Resend, SendGrid) | config |
| `storage` | File uploads (S3, local filesystem, Cloudinary) | config |
| `event-emitter` | Event-driven architecture with @nestjs/event-emitter | - |

---

## 🟢 Low Priority

Nice to have for specific use cases.

| Plugin | Description | Dependencies |
|--------|-------------|--------------|
| `cqrs` | Command Query Responsibility Segregation pattern | - |
| `schedule` | Cron jobs with @nestjs/schedule | - |
| `better-auth` | Authentication with Better Auth | config |
| `firebase` | Firebase Admin SDK (Auth, Firestore, FCM) | config |
| `stripe` | Payment processing with Stripe | config |
| `sentry` | Error tracking and performance monitoring | config |
| `opentelemetry` | Distributed tracing and observability with Grafana stack | config, docker |
| `drizzle` | Drizzle ORM as Prisma alternative | config (optional) |

---

## ⚡ Suggested Implementation Order

```
Phase 1: Database & Documentation
├── prisma
├── swagger
└── typeorm

Phase 2: Security & Performance
├── auth
├── cache
└── throttler

Phase 3: Communication
├── queue
├── mailer
└── websockets

Phase 4: Production Ready
├── health
├── logger
├── sentry
└── opentelemetry

Phase 5: Advanced
├── microservices
├── cqrs
└── schedule
```

---

## 💡 Advanced Ideas

Future considerations for complex architectures.

| Plugin | Description |
|--------|-------------|
| `monorepo` | Nx/Turborepo setup with multiple apps |
| `serverless` | AWS Lambda, Vercel, or Netlify deployment |
| `grpc` | Protobuf + gRPC server/client setup |
| `temporal` | Durable workflows with Temporal.io |

---

## 🤝 Contributing

Want to implement a plugin? Check out [creating-plugins.md](./creating-plugins.md) for the development guide.

### Plugin Structure

Each plugin should follow this structure:

```
plugins/
└── plugin-name/
    ├── index.ts
    ├── plugin-name.plugin.ts
    └── templates/
        ├── index.ts
        └── plugin-name.templates.ts
```

### Plugin Requirements

1. Extend `BasePlugin`
2. Use `@Plugin` decorator with metadata
3. Implement `shouldActivate(ctx: GeneratorContext): boolean`
4. Implement `protected onGenerate(): void`
5. Add JSDoc documentation
