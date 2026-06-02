# Contributing to Finance as a Service

Thank you for your interest in contributing! This document outlines the guidelines for contributing to this project.

## Code of Conduct

Please read and abide by our [Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to uphold these standards.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing issues and discussions
2. Describe the feature, its use case, and how it fits the project
3. Be open to discussion and feedback

### Pull Requests

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feat/your-feature` or `fix/your-bug`
3. **Make changes** following the code style
4. **Run type checks**: `pnpm build` (must pass with zero errors)
5. **Commit** using conventional commit messages
6. **Push** and open a Pull Request

## Development Setup

```bash
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
pnpm dev
```

## Coding Standards

- **TypeScript** — strict mode; avoid `any` where possible
- **Formatting** — use Prettier defaults
- **Imports** — order: external → internal; no barrel imports for components
- **Components** — use function components; no class components
- **CSS** — Tailwind utility classes; use `cn()` for conditional classes
- **Services** — keep business logic in `src/services/`, not in route handlers
- **Validation** — use Zod schemas in `src/lib/validations/`
- **Types** — define in `src/types/`; re-export from `index.ts`

## Commit Convention

Use conventional commits:

```
feat: add payroll batch export feature
fix: resolve tax calculation overflow
docs: update API documentation
chore: bump dependencies
refactor: extract payroll computation logic
```

## Pull Request Process

1. Update `setup.md` if adding new dependencies
2. Ensure all TypeScript checks pass
3. Update relevant documentation
4. PRs require at least one review before merging
5. Squash commits on merge

## Questions?

Open a discussion or reach out to the maintainers.
