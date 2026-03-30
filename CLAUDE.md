# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context (TCC)

This project is the **TCC (Trabalho de Conclusão de Curso)** of **Miguel Alexandre Uhlein**, submitted to **Faculdade de Tecnologia SENAI Porto Alegre** for the course *Análise e Desenvolvimento de Sistemas* (Curricular Unit S096).

**Title:** Desenvolvimento de uma Ferramenta Web para Geração Modular e Personalizável de Boilerplates do Framework NestJS

**Problem being solved:** The absence of a tool that automates and standardizes NestJS project creation — making setup slow, repetitive, and error-prone, especially in multi-service or multi-team environments.

**Core deliverables (specific objectives from the proposal):**
- Intuitive web UI for configuring and generating projects
- Selection of modules, dependencies, and optional integrations (adapters, package managers, Node.js version, etc.)
- Automated generation of a complete, functional boilerplate as a downloadable ZIP
- Apply NestJS architecture best practices
- Validate the tool with real developers (surveys/forms)
- Publish as open-source

## Commands

**Install:** `yarn install`

**Dev servers:**
- `yarn nx serve backend` / `yarn nx serve frontend`
- Both at once: `yarn nx run-many -t serve`

**Build:** `yarn nx build <project>` (projects: `backend`, `frontend`)

**Tests:**
- Unit: `yarn nx test backend` or `yarn nx test frontend`
- Single test: `yarn nx test <project> --testNamePattern="My test name"`
- Single file: `yarn nx test <project> --testPathPattern="apps/<project>/path/to/file"`
- E2E: `yarn nx run backend-e2e:e2e` / `yarn nx run frontend-e2e:e2e`

**Lint / format (Biome):**
- `yarn lint` — lint check
- `yarn format` — format (autofix)
- `yarn check` — lint + format + semantic checks (autofix)
- Single file: `npx biome lint path/to/file`

**Local package registry (Verdaccio):**
- `yarn nx run @nestjs-initializr/source:local-registry`

## Environment setup

```bash
cp apps/backend/.env.example apps/backend/.env.development
cp apps/frontend/.env.example apps/frontend/.env.local
```

Key backend env vars: `PORT`, `GLOBAL_PREFIX`, `CORS_ORIGIN`, `SOCKET_ADMIN_ENABLED`, `NODE_ENV`.

## Plugin architecture

The generator uses a plugin system. Plugins are auto-discovered at **build time** via Webpack's `require.context()` — every plugin must be a `*.plugin.ts` file.

**New plugin location:** `apps/backend/src/app/modules/generator/plugins/<name>/<name>.plugin.ts`

**Minimum plugin structure:**
```typescript
@Plugin({ name: 'my-plugin', displayName: 'My Plugin', priority: 100 })
export class MyPlugin extends BasePlugin {
  async generate(ctx: GeneratorContext): Promise<PluginResult> { ... }
}
```

**Key `BasePlugin` APIs:**
- `createFile(name, path, content)` — add a generated file
- `addDependency(name, version)` / `addDevDependency(name, version)`
- `addPkg(name)` — auto-resolve version from `NPM_DEPENDENCIES` constants
- `addScript(name, command)` — add a `package.json` script
- `setState<T>(key, value)` / `getState<T>(key)` — share data between plugins
- `hasModule(name)` / `hasExtra(name)` — check user's selections
- `isFastify` / `isExpress` — adapter detection

**Plugin decorator options:** `name`, `displayName`, `description`, `version`, `priority` (higher runs earlier), `dependencies` (other plugin names), `conflicts`.

**Inject other plugins:** `@InjectPlugin("plugin-name")` in the constructor — the container resolves order automatically.

**File updates** (returned in `PluginResult.fileUpdates`) run after all plugins complete. Actions: `replace`, `append`, `prepend`, `insert-after`, `insert-before`.

**AppModule injection:** Set `constants.import`, `constants.importArray`, `constants.importIn` in `PluginResult` — the executor uses `ts-morph` to inject these into `AppModule`'s AST.

**Cross-plugin state:** `ctx.state` is the only supported mechanism for sharing data between plugins at runtime.

## Code style

- Biome is the sole linter/formatter — do not add ESLint or Prettier config
- Frontend: Tailwind classes must be sorted (`useSortedClasses: error`); `dangerouslySetInnerHTML` is blocked
- Backend: `unsafeParameterDecoratorsEnabled: true` is intentional for NestJS decorators
- Prefer `yarn nx <target>` over raw `npx` commands to preserve Nx cache

## Commits & branching

- Conventional Commits enforced by Husky: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `perf:`, `ci:`, `build:`, `types:`, `revert:`
- Branch from `master`: `feature/<short-description>` or `fix/<short-description>`
- Regular merge commits (not squash)
