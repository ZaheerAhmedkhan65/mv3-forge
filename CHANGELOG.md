# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.8] - 2026-27-07

### Added

- Template registry in `@mv3-forge/shared` for single source of truth
- Unified extension Vite plugin in `@mv3-forge/vite-plugin`
- Standardized template structure for both Vanilla and React templates
- `src/manifest.ts` using `defineManifest()` DSL (replaces `manifest.json`)
- `src/icons/` directory (moved from root `/icons/`)
- `src/background/index.ts`, `src/content/index.ts`, `src/popup/`, `src/options/`, `src/env.d.ts`
- `README.md` for each template
- `types: ["node"]` in tsconfig.base.json for proper Node.js type resolution

### Changed

- Removed duplicated `/packages/cli/templates/` directory (single source: `/templates/`)
- CLI build script now copies templates before building (`node copy-templates.js && tsup`)
- CLI uses shared utilities from `@mv3-forge/shared` instead of local duplicates
- Core `TemplateManager` uses shared template registry
- Both Vanilla and React templates follow identical directory structure

### Fixed

- Typecheck error: use `TemplateType` from shared package instead of `keyof typeof TEMPLATE_REGISTRY`
- Lint errors: unused imports and prototype method access
- Templates now properly bundled into npm package during build

## [0.1.7] - 2026-27-07

## [0.1.6] - 2026-23-07

## [0.1.5] - 2026-23-07

## [0.1.4] - 2026-22-07

## [0.1.3] - 2026-22-07

### Added

- ROADMAP.md for project planning and milestones
- SECURITY.md with vulnerability reporting guidelines
- CODE_OF_CONDUCT.md based on Contributor Covenant
- SUPPORTED_BROWSERS.md with browser compatibility information
- CONTRIBUTING.md with comprehensive contribution guidelines
- Options page with settings functionality to vanilla template
- Publishing guide and checklist for npm package release

### Changed

- Added root tsconfig.json for project-wide TypeScript configuration
- Removed deprecated `ignoreDeprecations` option from tsconfig.base.json
- Updated project dependencies

## [0.1.2] - 2026-22-07

### Added

- Initial project structure with Turborepo monorepo
- `@mv3-forge/cli` package for CLI scaffolding
- `@mv3-forge/core` package for core generation logic
- `@mv3-forge/shared` package for shared utilities
- `@mv3-forge/testing` package for testing utilities
- `@mv3-forge/vite-plugin` package for Vite integration
- Vanilla template for TypeScript extensions
- Hot module replacement with Vite
- TypeScript strict mode support
- ESLint and Prettier configuration

### Features

- CLI command: `mv3-forge new <project-name>`
- CLI command: `mv3-forge new <project-name> --template vanilla`
- Interactive mode for CLI prompts
- Manifest V3 support out of the box
- Cross-browser compatibility (Chrome, Firefox, Chromium-based browsers)

## [0.1.1] - 2026-21-07

### Added

- Initial release
- Basic project scaffolding
- Template directory structure
