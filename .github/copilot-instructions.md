# Copilot instructions for nestjs-initializr

This file provides concise, repo-specific guidance to help Copilot sessions work effectively in this Nx monorepo.

---

## Quick commands

- Install dependencies (Yarn v4 / Berry):
  - yarn install

- Run builds and dev servers (Nx):
  - Build a project: yarn nx build <project>
  - Run a project's dev server (Next/Nest/etc): yarn nx run <project>:dev or yarn nx serve <project>
  - Start the local Verdaccio registry (project @nestjs-initializr/source): yarn nx run @nestjs-initializr/source:local-registry

- Tests
  - Run all tests for a project: yarn nx test <project>
  - Run a single test by name: yarn nx test <project> --testNamePattern="My test name"
  - Run tests for a single file: yarn nx test <project> --testPathPattern="apps/<project>/path/to/file" or npx jest apps/<project>/path/to/file.test.ts -t "test name"
  - Run e2e (Playwright) target: yarn nx run <e2e-project>:e2e

- Lint / format / check (Biome):
  - Format workspace: yarn format  (runs: biome format --write ./)
  - Lint workspace: yarn lint     (runs: biome lint ./)
  - Type/other checks: yarn check (runs: biome check --write ./)
  - Lint a single file: npx biome lint path/to/file

- Other useful commands
  - Add shadcn components (frontend): yarn shadcn:add
  - Husky postinstall is configured (postinstall: "husky")

---

## High-level architecture

- Monorepo managed with Nx (nx.json present). Workspaces are under apps/*.
- Frontend: Next.js app(s) (Next plugin configured). Uses React 19 and Tailwind CSS.
- Backend: NestJS app(s) using Fastify adapter (nestjs packages present). There are e2e projects (e.g., backend-e2e) and Playwright is configured for browser e2e.
- Testing: Jest is configured via @nx/jest and the top-level jest.config.ts calls getJestProjectsAsync() to discover project configs.
- Linting/formatting: Biome is the primary linter/formatter (workspace scripts use biome and a shared @nedcloarbr/biome-config).
- Local package registry: Verdaccio target is configured in a project.json target (local-registry).

Note: prefer running Nx targets (yarn nx <target>) so Nx understands graph and affected commands.

---

## Key conventions and repo-specific patterns

- Prefer Nx targets for project tasks (build/test/lint/serve) instead of ad-hoc scripts; this ensures caching and affected detection.
- Biome is the canonical linter/formatter; project-level linters may be wired through Nx but scripts exist at the repo root (yarn lint/format/check).
- Tests are orchestrated through @nx/jest; the workspace uses project-discovery in jest.config.ts so tests can be targeted per project by name/path.
- Playwright is configured via @nx/playwright plugin; run e2e targets through Nx to pick up configuration and CI wiring.
- Next plugin mapping: plugin options map common Next targets (dev/build/start) to Nx target names—use the project's configured target names when invoking.
- Use the provided packageManager metadata (yarn@4.9.2) when scripting automation to avoid mismatches.

---

## AI / assistant related configs checked

- No CLAUDE.md, .cursorrules, AGENTS.md, .windsurfrules, or AIDER_CONVENTIONS.md were found in the repository root when this file was created. If present in future, merge pertinent rules here.

---

## When editing this file

- Keep examples short and prefer Nx target forms (yarn nx run <project>:<target>) so Copilot suggestions produce accurate terminal commands.
- Update commands if workspace project names change (apps/*) or if new tooling is introduced (e.g., switching from Biome to another linter).

---

