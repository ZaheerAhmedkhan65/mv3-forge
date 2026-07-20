# extension-forge

A monorepo for building cross-browser extensions with modern tooling.

## Installation

```bash
# Using pnpm
pnpm create extension-forge my-extension

# Or using npx
npx extension-forge create my-extension
```

## Quick Start

```bash
cd my-extension
pnpm install
pnpm dev
```

Then load the extension in Chrome via `chrome://extensions` using the generated `dist/` directory.

## Available Templates

- **vanilla** - Plain TypeScript with Vite
- **react** - React + TypeScript
- **vue** - Vue + TypeScript
- **solid** - Solid + TypeScript
- **svelte** - Svelte + TypeScript

## Packages

- `@extension-forge/cli` - Command-line interface
- `@extension-forge/core` - Core project generation logic
- `@extension-forge/shared` - Shared utilities
- `@extension-forge/testing` - Testing utilities (coming soon)
- `@extension-forge/vite-plugin` - Vite plugin for extension development (coming soon)

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run linter
pnpm lint
```

## License

MIT