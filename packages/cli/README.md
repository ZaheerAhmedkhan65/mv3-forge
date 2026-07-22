# mv3-forge CLI

A CLI tool for creating Manifest V3 browser extensions.

[![npm version](https://img.shields.io/npm/v/mv3-forge.svg)](https://www.npmjs.com/package/mv3-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g mv3-forge
# or
npx mv3-forge new my-extension
# or with pnpm
pnpm dlx mv3-forge new my-extension
```

## Usage

```bash
mv3-forge new [project-name] [options]

Options:
  -t, --template <template>  Template to use (vanilla, react, vue, solid, svelte)
  -h, --help              Display help for command
  -V, --version           Display version number
```

### Quick Start

```bash
# Create a new extension project
mv3-forge new my-extension

# Or with a specific template
mv3-forge new my-extension --template vanilla
```

## Available Templates

| Template  | Description                    | Status       |
|-----------|--------------------------------|--------------|
| vanilla   | Plain TypeScript with Vite     | ✅ Available  |
| react     | React + TypeScript + Vite      | ✅ Available  |
| vue       | Vue + TypeScript + Vite        | 🚧 Coming Soon |
| solid     | Solid + TypeScript + Vite      | 🚧 Coming Soon |
| svelte    | Svelte + TypeScript + Vite     | 🚧 Coming Soon |

## Requirements

- Node.js >= 18
- pnpm >= 8 (recommended)

## License

MIT