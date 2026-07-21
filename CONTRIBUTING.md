# Contributing to mv3-forge

Thank you for your interest in contributing to mv3-forge! This document provides guidelines and instructions to help you get started.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Release Strategy](#release-strategy)
- [Git Workflow](#git-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Adding New Templates](#adding-new-templates)
- [Documentation](#documentation)
- [Questions or Issues?](#questions-or-issues)

## Project Overview

mv3-forge is a modern CLI tool for scaffolding cross-browser extensions with Manifest V3 support. It's a monorepo managed by Turborepo containing the following packages:

- `@mv3-forge/cli` - Command-line interface for scaffolding browser extensions
- `@mv3-forge/core` - Core project generation logic and templates
- `@mv3-forge/shared` - Shared utilities, helpers, and types
- `@mv3-forge/testing` - Testing utilities and helpers
- `@mv3-forge/vite-plugin` - Vite plugin for extension development

## Development Setup

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8

### Installation

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/<your-username>/mv3-forge.git
   cd mv3-forge
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build all packages**

   ```bash
   pnpm build
   ```

4. **Verify setup**

   ```bash
   pnpm lint
   pnpm typecheck
   ```

### Development Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm dev` | Start development mode with watch |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests across all packages |
| `pnpm format` | Format code with Prettier |

### Working with Packages

To work with a specific package:

```bash
# Build specific package
pnpm build --filter=@mv3-forge/cli

# Watch mode for development
pnpm dev --filter=@mv3-forge/core
```

## Project Structure

```
mv3-forge/
├── packages/
│   ├── cli/           # CLI entry point and commands
│   ├── core/          # Core generation logic
│   ├── shared/        # Shared utilities
│   ├── testing/       # Testing utilities
│   └── vite-plugin/   # Vite plugin
├── templates/         # Project templates
├── package.json       # Root package.json with workspace scripts
├── turbo.json         # Turborepo configuration
└── tsconfig.base.json # Shared TypeScript config
```

## Code Style

This project follows specific coding standards:

### TypeScript

- Use TypeScript for all source files
- Follow the configured ESLint and Prettier rules
- Run `pnpm format` before committing

### Imports

- Use ES modules (`import/export`)
- Prefer named exports over default exports

### File Naming

- Use `kebab-case` for file names
- Test files should be named with `.test.ts` suffix

### Code Quality Tools

This project enforces code quality with the following tools:

| Tool | Purpose |
|------|---------|
| TypeScript (strict mode) | Static type checking |
| ESLint | Code linting and style enforcement |
| Prettier | Code formatting |
| Husky | Git hooks for pre-commit checks |
| Vitest | Unit and integration testing |

## Release Strategy

We follow [Semantic Versioning](https://semver.org/):

- **PATCH** (v0.1.2 → v0.1.3): Bug fixes, no API changes
- **MINOR** (v0.1.2 → v0.2.0): New backward-compatible features
- **MAJOR** (v0.1.2 → v1.0.0): Breaking changes

## Git Workflow

### Branch Naming

Use descriptive branch names with the following conventions:

- **Features**: `feature/add-react-template`
- **Bug fixes**: `fix/correct-manifest-generation`
- **Documentation**: `docs/improve-readme`
- **Refactoring**: `refactor/simplify-template-logic`

### Committing Changes

We use Conventional Commits for consistent commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat(cli): add react template support"
git commit -m "fix(core): correct manifest.json version field"
git commit -m "docs: update contributing guide"
```

## Pull Request Process

1. **Create a feature branch** from `main`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Keep PRs focused** - Limit each PR to a single change or feature

4. **Run checks** to ensure code quality

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   pnpm test
   ```

5. **Add or update tests** when changing behavior

6. **Update documentation** when introducing new features

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** with:
   - A clear, descriptive title
   - Description of changes and motivation
   - Reference to any related issues
   - Screenshots (if applicable)

9. **PR Checklist:**
   - [ ] I ran tests
   - [ ] I updated documentation
   - [ ] I followed coding standards
   - [ ] No breaking changes (or breaking changes clearly documented)
   - [ ] Linked related issue
   - [ ] Code follows style guidelines
   - [ ] All CI checks pass
   - [ ] Tests added/updated (if applicable)
   - [ ] Commit messages follow conventions

### Pull Request Template

When creating a PR, please confirm:

- I ran tests
- I updated documentation
- I followed coding standards
- No breaking changes (or breaking changes clearly documented)

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@mv3-forge/core
```

### Writing Tests

- Place test files alongside source or in `__tests__` directories
- Use descriptive test names that explain the expected behavior
- Ensure tests are isolated and don't depend on each other

## Adding New Templates

Templates are located in `packages/cli/templates/` and `templates/`. To add a new template:

1. **Create template directory** under `packages/cli/templates/`

   ```
   packages/cli/templates/<template-name>/
   ```

2. **Required files:**
   - `package.json` - Template dependencies
   - `tsconfig.json` - TypeScript configuration
   - `vite.config.ts` - Vite configuration
   - `manifest.json` - Extension manifest template
   - `gitignore.template` - Gitignore template

3. **Source files:**
   - `src/background.ts` - Background service worker
   - `src/content.ts` - Content script
   - `src/popup.ts` - Popup script
   - `src/popup.html` - Popup HTML
   - `src/index.html` - Options page
   - `src/styles.css` - Styles

4. **Update template configuration** in `packages/core/src/template-manager.ts`

5. **Add icons** if applicable under `icons/`

6. **Update documentation** in README.md

## Documentation

When adding or updating features, please:

- Update README.md with usage examples
- Add inline code comments for complex logic
- Keep breaking changes documented with clear migration paths

## Questions or Issues?

- **Bug reports**: Open an issue with reproduction steps
- **Feature requests**: Open an issue with detailed description
- **Questions**: Open a discussion or issue with `question` label

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

---

Thank you for contributing to mv3-forge! ⭐