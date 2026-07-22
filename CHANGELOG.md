# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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