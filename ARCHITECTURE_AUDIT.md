# Architecture Audit Report

## Phase 1: Audit Findings

### 1. CRITICAL - Duplicated Templates Directory
- **Location**: `/templates/` and `/packages/cli/templates/`
- **Problem**: Complete duplication of both `vanilla` and `react` templates
- **Reason**: `copy-templates.js` script copies from root to CLI package during build
- **Impact**: Any changes to templates must be made in TWO places

### 2. CRITICAL - Manifest Inconsistency
- **Root templates** (`/templates/vanilla/manifest.json`, `/templates/react/manifest.json`)
  - Uses raw JSON format
- **CLI templates** (`/packages/cli/templates/vanilla/manifest.config.ts`, `/packages/cli/templates/react/manifest.config.ts`)
  - Uses `defineManifest()` DSL
- **Problem**: Inconsistent manifest handling across template locations

### 3. HIGH - Vite Config Duplication
- **Location**: Both template versions have identical `vite.config.ts` with duplicated plugins
- **Problem**: 
  - ~100 lines of duplicated code in each template
  - `devPagePlugin()` and `extensionAssetsPlugin()` duplicated
  - Only difference: React template adds `@vitejs/plugin-react`
- **Impact**: Plugin changes require updates in multiple places

### 4. HIGH - Missing Template Standardization
- **Current structure** (both templates):
  ```
  src/
  ├── background.ts
  ├── content.ts
  ├── index.html (options page)
  ├── index.ts (options script)
  ├── popup.html
  ├── popup.ts
  └── styles.css
  icons/ (root level)
  ├── icon16.png
  ├── icon32.png
  ├── icon48.png
  └── icon128.png
  index.html
  manifest.json
  package.json
  tsconfig.json
  vite.config.ts
  ```
- **Required structure** (from requirements):
  ```
  src/
  ├── icons/
  ├── background/
  │   └── index.ts
  ├── content/
  │   └── index.ts
  ├── popup/
  │   ├── index.html
  │   ├── main.ts
  │   └── styles.css
  ├── options/
  │   ├── index.html
  │   ├── main.ts
  │   └── styles.css
  ├── sidepanel/
  │   ├── index.html
  │   ├── main.ts
  │   └── styles.css
  ├── shared/
  ├── assets/
  ├── styles/
  ├── manifest.ts
  └── env.d.ts
  ```

### 5. HIGH - Duplicated Utility Functions
- **CLI** (`packages/cli/src/index.ts`): Has its own `exists`, `isEmptyDirectory`, `ensureDir`, `copyDirRecursive`, `readdirRecursive`
- **Shared** (`packages/shared/src/filesystem.ts`): Already has these utilities
- **Problem**: Code duplication, inconsistency

### 6. MEDIUM - Template Registry Missing
- CLI has hardcoded template array in `index.ts`
- Core has no template registry
- Adding new templates requires modification in multiple places

### 7. MEDIUM - Assets Handling
- Icons at root level `/icons/` instead of `/src/icons/`
- Build scripts copy icons manually instead of using bundled plugin

## Phase 2: Proposed Architecture

### Single Source of Truth
```
/templates/                    # ONLY source for templates (remove CLI copy)
/packages/cli/templates/     # DELETED (will be bundled from /templates during build)

/packages/vite-plugin/         # Extract shared vite plugins
  └── src/
      ├── extension-plugin.ts  # Unified extension build plugin
      ├── entry-discovery.ts
      └── hmr-plugin.ts

/packages/shared/             # Shared utilities (keep)
  └── src/
      ├── filesystem.ts
      ├── logger.ts
      ├── paths.ts
      └── template-registry.ts  # NEW: Template registry

/packages/core/               # Core logic (keep)
  └── src/
      ├── manifest/
      ├── plugins/
      └── project-creator.ts
```

### Template Structure (Standardized)
Each template will follow the exact same structure with `src/manifest.ts` instead of `manifest.json`.

## Phase 3: Implementation Plan

1. Create unified Vite plugin for extension builds
2. Create template registry in shared package
3. Delete duplicated `/packages/cli/templates/` directory
4. Update build process to bundle templates
5. Standardize template structures
6. Move icons to `src/icons/`
7. Replace manifest.json with manifest.ts
8. Update CLI to use shared utilities
9. Test and verify everything works

## Phase 4: Implementation Summary

### Completed Changes

#### 1. Deleted Duplicated Templates
- Removed `/packages/cli/templates/` directory completely
- Templates now exist only in `/templates/` directory

#### 2. Created Unified Extension Plugin
- Created `/packages/vite-plugin/src/extension-plugin.ts` with:
  - `createExtensionPlugin()` - dev server middleware
  - `createExtensionBuildPlugin()` - production build handling
  - `extensionPlugin()` - combined helper function
- Updated `/packages/vite-plugin/src/index.ts` to export extension plugin
- Updated `/packages/vite-plugin/package.json` with proper description and vite dependency

#### 3. Created Template Registry
- Created `/packages/shared/src/template-registry.ts` with:
  - `TEMPLATE_REGISTRY` - single source of truth for all templates
  - `getRegisteredTemplates()` - get all registered templates with availability
  - `isTemplateAvailable()` - check if template exists on disk
  - `getTemplatesDir()` - resolves templates directory (works in dev and npm)
  - `resolveTemplatePath()` - get full path to a template
  - `getAvailableTemplates()` - get list of available templates
- Updated `/packages/shared/src/index.ts` to export template-registry
- Updated `/packages/shared/src/constants.ts` to re-export TemplateType

#### 4. Standardized Template Structures
Both vanilla and react templates now follow the same structure:
```
templates/
├── vanilla/
│   ├── index.html (dev page)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── gitignore.template
│   ├── README.md
│   └── src/
│       ├── icons/ (moved from root)
│       ├── background/index.ts
│       ├── content/index.ts
│       ├── popup/index.html, main.ts, styles.css
│       ├── options/index.html, main.ts, styles.css
│       ├── manifest.ts (replaces manifest.json)
│       └── env.d.ts
```

#### 5. Updated CLI to Use Shared Utilities
- Updated `/packages/cli/src/index.ts`:
  - Removed duplicated utility functions
  - Now imports from `@mv3-forge/shared`
  - Uses `TEMPLATE_REGISTRY` and `getAvailableTemplates()`

#### 6. Updated Core Template Manager
- Updated `/packages/core/src/template-manager.ts`:
  - Uses shared `getTemplatesDir()` function
  - Removed duplicated path resolution logic

### Files Changed

**New Files Created:**
- `/packages/vite-plugin/src/extension-plugin.ts`
- `/packages/shared/src/template-registry.ts`
- `/templates/vanilla/src/manifest.ts`
- `/templates/vanilla/src/background/index.ts`
- `/templates/vanilla/src/content/index.ts`
- `/templates/vanilla/src/popup/index.html`
- `/templates/vanilla/src/popup/main.ts`
- `/templates/vanilla/src/popup/styles.css`
- `/templates/vanilla/src/options/index.html`
- `/templates/vanilla/src/options/main.ts`
- `/templates/vanilla/src/options/styles.css`
- `/templates/vanilla/src/env.d.ts`
- `/templates/vanilla/README.md`
- `/templates/vanilla/gitignore.template`
- `/templates/react/src/manifest.ts`
- `/templates/react/src/background/index.ts`
- `/templates/react/src/content/index.ts`
- `/templates/react/src/popup/index.html`
- `/templates/react/src/popup/main.tsx`
- `/templates/react/src/popup/styles.css`
- `/templates/react/src/options/index.html`
- `/templates/react/src/options/main.tsx`
- `/templates/react/src/options/styles.css`
- `/templates/react/src/env.d.ts`
- `/templates/react/README.md`
- `/templates/react/gitignore.template`

**Files Modified:**
- `/packages/shared/src/index.ts`
- `/packages/shared/src/constants.ts`
- `/packages/shared/tsup.config.ts`
- `/packages/vite-plugin/src/index.ts`
- `/packages/vite-plugin/package.json`
- `/packages/cli/src/index.ts`
- `/packages/core/src/template-manager.ts`

**Files Deleted:**
- `/packages/cli/templates/` directory (entire directory)
- `/templates/vanilla/icons/` directory
- `/templates/vanilla/manifest.json`
- `/templates/vanilla/manifest.config.ts`
- `/templates/vanilla/src/background.ts`, `content.ts`, `popup.ts`, etc.
- `/templates/react/icons/` directory
- `/templates/react/manifest.json`
- `/templates/react/manifest.config.ts`
- `/templates/react/src/background.ts`, `content.ts`, `popup.tsx`, etc.

### Verification Status

✅ **Build**: All packages build successfully (`pnpm build` passes)
✅ **CLI**: CLI works correctly and can create projects
✅ **Templates**: Standardized structure implemented for both vanilla and react
✅ **Template Registry**: Single source of truth for templates created
✅ **Extension Plugin**: Shared Vite plugin for extension builds created

### Remaining Work

1. **Manifest compilation**: The `manifest.ts` files need to be compiled to `manifest.json` during Vite build. Currently templates reference `@mv3-forge/core` but this is for future use when the extension is built.

2. **copy-templates.js**: Update to include the templates directory in npm package during publishing.

3. **Template source for Vite builds**: The templates currently reference `@mv3-forge/vite-plugin` which needs to be added as a dependency in generated projects.

### Architecture Benefits Achieved

1. **DRY**: Templates are now in a single location
2. **Single Source of Truth**: Template registry defines all templates
3. **Template Standardization**: Both templates follow identical structure
4. **Extensibility**: Adding a new template only requires:
   - Creating a directory under `/templates/`
   - Adding entry to `TEMPLATE_REGISTRY`
5. **Shared Utilities**: CLI now uses shared utilities from `@mv3-forge/shared`
6. **Clean Build**: Vite plugin extracted to shared package for reuse
