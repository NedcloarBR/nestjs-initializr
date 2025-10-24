# Contributing to NestJS Initializr

Thank you for your interest in contributing! This document explains how to report issues, propose changes, and submit pull requests for this repository. The project is an Nx monorepo containing a NestJS backend and a Next.js frontend. We use Biome for linting/formatting, Husky for git hooks, and Conventional Commits for commit messages.

## Table of Contents

- Reporting issues
- Proposing changes
- Branching & PR workflow
- Commit messages
- Local setup and common commands
- Testing, linting and CI
- Contributing to templates and generators
- Code review and merge

---

## Reporting issues

- Search existing issues first to avoid duplicates.
- When opening a new issue include:
  - Clear title and summary
  - Steps to reproduce (minimal if possible)
  - Expected vs actual behavior
  - Relevant environment info (Node, Yarn, OS)
  - Logs or error stack traces

Use the issue templates where available.

---

## Proposing changes (feature requests / design)

- For non-trivial features, open an issue first describing the motivation and design.
- If you want to propose a different implementation for a template or generator, include examples and expected output.

---

## Branching & PR workflow

- Fork the repository and create a feature branch from `master`.
- Branch name convention: `feature/<short-description>` or `fix/<short-description>`.
- Keep your PRs focused and small—one logical change per PR.
- Run tests and lint locally before opening a PR.

PR checklist (maintainers may verify before merging):

- PR title follows Conventional Commits (see below)
- All tests pass
- Lint and format applied
- Updated docs if needed

---

## Commit messages (Conventional Commits)

We follow Conventional Commits. Examples:

- `feat: add new generator for microservice`
- `fix: correct package.json scripts`
- `docs: update README with usage examples`
- `chore: update dependencies`

Use `git commit` or a commit helper that enforces the format. The Husky hooks will run pre-commit checks.

---

## Local setup and common commands

1. Clone and install

```bash
git clone https://github.com/NedcloarBR/nestjs-initializr.git
cd nestjs-initializr
yarn install
```

2. Environment

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env.development

# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
```

3. Start apps (development)

```bash
# Start frontend
nx serve frontend

# Start backend
nx serve backend

# Start both (parallel)
nx run-many -t serve
```

4. Tests, linting and format

```bash
# Run unit tests
nx test backend
nx test frontend

# E2E tests
nx e2e backend-e2e
nx e2e frontend-e2e

# Lint and format (Biome)
yarn lint
yarn format

# Check everything
yarn check
```

---

## Testing, linting and CI

- Write unit tests for backend or frontend changes where applicable.
- Ensure linting passes before creating a PR; Husky runs pre-commit checks.
- CI (if configured) will run tests and linting. Fix any CI failures before requesting review.

---

## Contributing to templates and generators

This repository contains generator templates and code in `apps/backend/src/app/modules/generator/`.

- If you want to add or change a template:
  1. Open an issue describing the desired template and use case.
  2. Add unit tests that validate generated output where possible.
  3. Keep templates small and well documented.

- For changing generator logic, prefer small, testable commits and include examples of input and expected generated files.

---

## Code review and merge

- After opening a PR, add a short description and list the main changes.
- Request reviewers and address feedback promptly.
- Once approved and CI passes, a maintainer will merge the PR.

---

## Thank you

Thanks for contributing! If you want to provide ongoing support, consider starring the repo, opening issues with feedback, or sending PRs with improvements.
