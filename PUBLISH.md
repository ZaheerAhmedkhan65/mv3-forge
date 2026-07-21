# Publishing Guide

This document outlines the steps required to publish the `@mv3-forge/cli` package to npm.

## Publishing Checklist

Before publishing, ensure you've completed all the following steps:

- [ ] Update version in all `package.json` files
- [ ] Run `pnpm install` to sync lockfile
- [ ] Run `pnpm build` to compile all packages
- [ ] Run `pnpm test` to verify tests pass
- [ ] Run `pnpm lint` to verify no linting errors
- [ ] Run `pnpm typecheck` to verify TypeScript
- [ ] Run `npm pack` in packages/cli to generate tarball
- [ ] Verify tarball contents include templates
- [ ] Install from tarball and smoke test CLI
- [ ] Run `npm publish --access public`

## Release Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Typecheck
pnpm typecheck

# Generate tarball for verification
cd packages/cli
npm pack

# Dry-run publish (verifies everything works without publishing)
npm publish --access public --dry-run

# Login to npm (if not already logged in)
npm login

# Actual publish
npm publish --access public
```

## Version Updates

This monorepo contains the following packages that may need version updates:

| Package | Location |
|---------|----------|
| `@mv3-forge/cli` | `packages/cli/package.json` |
| `@mv3-forge/core` | `packages/core/package.json` |
| `@mv3-forge/shared` | `packages/shared/package.json` |
| `@mv3-forge/testing` | `packages/testing/package.json` |
| `@mv3-forge/vite-plugin` | `packages/vite-plugin/package.json` |

## Pre-Publish Verification

### 1. Check Tarball Contents

After running `npm pack` in the CLI package, verify the tarball contains the expected files:

```bash
# List tarball contents
tar -tvf mv3-forge-*.tgz

# Verify templates are included
tar -tvf mv3-forge-*.tgz | grep templates
```

### 2. Smoke Test CLI

```bash
# Create a test directory
mkdir /tmp/smoke-test
cd /tmp/smoke-test

# Install from local tarball
npm install /path/to/mv3-forge-*.tgz

# Test the CLI
npx mv3-forge new test-extension --template vanilla

# Verify the project was created
ls test-extension
```

## Important Notes

- Always use `--access public` when publishing to make the package publicly accessible
- The `--dry-run` flag helps verify the package will be published correctly without actually publishing it
- Make sure you're logged into npm with an account that has publish access to the `@mv3-forge` organization