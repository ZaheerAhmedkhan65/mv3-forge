# MV3-Forge Implementation Plan

## Completed Implementation (Phases 1-5)

### Phase 1 — Project Foundation ✅

#### 1. CLI Bootstrap
- ✅ Modular generators exist (project-creator.ts, template-manager.ts)
- ✅ Template system with placeholders

#### 2. Shared Configuration ✅
- ✅ Config loader module (`packages/shared/src/config.ts`)
  - Project metadata (name, description, version)
  - Browser targets configuration (chrome, firefox, edge, safari)
  - Build configuration (outDir, sourceDir, sourceMaps, minify)
  - Environment mode (development/staging/production)
- ✅ Environment variable loader (`packages/shared/src/env-loader.ts`)
  - .env file loading
  - Browser-safe variables (MV3_FORGE_ prefix)
  - Server-only variables (MV3_SERVER_ prefix)

#### 3. Plugin System ✅
- ✅ Plugin interface with lifecycle hooks (`packages/core/src/plugins/plugin-interface.ts`)
  - beforeBuild, afterBuild
  - beforeManifest, afterManifest
  - beforeZip, afterZip
  - beforeDev, afterDev
- ✅ Plugin manager (`packages/core/src/plugins/plugin-manager.ts`)
- ✅ Icon plugin (`packages/core/src/plugins/icon-plugin.ts`)
- ✅ ZIP plugin (`packages/core/src/plugins/zip-plugin.ts`)
- ✅ Changelog plugin (`packages/core/src/plugins/changelog-plugin.ts`)

### Phase 2 — Vite Integration ✅

#### 4. Vite Core
- ✅ Entry discovery plugin (`packages/vite-plugin/src/entry-discovery.ts`)
  - Auto-discovers: popup, options, background, content, sidepanel, devtools, newtab, welcome
  - Automatic entry point registration

#### 5. Hot Reload
- ✅ HMR plugin (`packages/vite-plugin/src/hmr-plugin.ts`)
  - WebSocket infrastructure
  - Live reload for extension pages

### Phase 3 — Manifest Generator ✅

#### 8. Manifest DSL
- ✅ `defineManifest()` function (`packages/core/src/manifest/manifest-dsl.ts`)
  - Strongly typed ManifestConfig interface
  - Schema validation with ManifestSchema
  - Default value inference
  - Full Chrome Manifest V3 types

#### 9. Manifest Compiler
- ✅ ManifestCompiler class (`packages/core/src/manifest/manifest-compiler.ts`)
  - Auto-registration for all entry points
  - Proper manifest.json generation

### Phase 4 — Environment System ✅

#### 11-12. Environment Variables
- ✅ .env loading in shared/config.ts
- ✅ Multiple environment support (development, staging, production)

### Phase 5 — Extension APIs ✅

#### 13. Storage API
- ✅ StorageWrapper class (`packages/core/src/runtime/storage.ts`)
  - sync, local, managed, session storage
  - Type-safe get/set/remove/clear
  - Change listeners

#### 14. Messaging
- ✅ MessageBroker class (`packages/core/src/runtime/messaging.ts`)
  - Request-response abstraction
  - Type-safe messaging

## Completed Implementation (Phases 6-9 - CLI Commands)

### Phase 6 — Built-in Pages
- [ ] Popup template (templates exist in vanilla/react)
- [ ] Options page (templates exist in vanilla/react)
- [ ] Side panel (templates to be added)
- [ ] DevTools page (templates to be added)
- [ ] New tab override (templates to be added)
- [ ] Welcome page (templates to be added)

### Phase 7 — Developer Experience
- [ ] Auto version bump (semver) - placeholder in release command
- [ ] Auto release (Git tags + GitHub releases) - placeholder in release command
- [ ] Full icon generation with sharp - placeholder in icon plugin

### Phase 8 — Testing
- [x] Mock Chrome APIs (`packages/testing/src/mock-chrome.ts`)
- [ ] Storage tests
- [ ] Background tests
- [ ] Popup tests
- [ ] Messaging tests
- [ ] Playwright integration tests

### Phase 9 — CLI Commands
- [x] `dev` command
- [x] `build` command
- [x] `zip` command
- [x] `release` command
- [x] `publish` command
- [x] `doctor` command
- [x] `lint` command
- [x] `test` command

## Core Infrastructure (Phases 1-5) ✅ COMPLETE

All core architectural foundations have been implemented:
- Plugin system with lifecycle hooks
- Shared configuration module
- Vite entry discovery and HMR
- Manifest DSL and compiler

## Architecture Summary

```
CLI (packages/cli)
  ├── Commands (new, dev, build, zip, release, etc.)
  └── Templates (vanilla, react)

Shared (packages/shared)
  ├── Logger
  ├── Filesystem utilities
  ├── Path helpers
  ├── Constants
  ├── Validation
  ├── Config loader
  └── Env loader

Core (packages/core)
  ├── Project creator
  ├── Template manager
  ├── Manifest generator
  ├── Plugin system
  │   ├── Plugin interface
  │   ├── Plugin manager
  │   ├── Icon plugin
  │   ├── ZIP plugin
  │   └── Changelog plugin
  ├── Manifest DSL & compiler
  └── Runtime APIs
      ├── Storage
      └── Messaging

Vite Plugin (packages/vite-plugin)
  ├── Entry discovery
  └── HMR plugin

Testing (packages/testing)
  └── Vitest/Playwright setup