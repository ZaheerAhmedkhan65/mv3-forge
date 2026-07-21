# Roadmap

## Tech Stack

- TypeScript
- Vite
- Tailwind CSS v4
- ESLint
- Prettier
- Vitest
- Playwright
- Chrome Extension Manifest V3
- webextension-polyfill
- Husky
- Lint Staged
- GitHub Actions
- pnpm

## Features

### Core

- [x] Manifest V3
- [x] TypeScript
- [x] Vite
- [x] Hot Reload
- [x] Source Maps
- [x] Environment Variables
- [x] Multiple Environments (development, staging, production)

### UI

- [ ] Popup
- [ ] Options Page
- [ ] Side Panel
- [ ] New Tab
- [ ] DevTools Panel
- [ ] Welcome Page
- [ ] Context Menu

### Extension APIs

- [ ] Storage
- [ ] Tabs
- [ ] Runtime
- [ ] Messaging
- [ ] Context Menus
- [ ] Commands
- [ ] Notifications
- [ ] Downloads
- [ ] Bookmarks
- [ ] History
- [ ] Cookies
- [ ] Identity
- [ ] Alarms
- [ ] Scripting
- [ ] Offscreen
- [ ] Side Panel API

### Developer Experience

- [ ] Auto Manifest Generation
- [ ] Auto Icons
- [ ] Auto Zip
- [ ] Auto Version Bump
- [ ] Auto Release
- [ ] Auto Changelog
- [ ] Auto Screenshots
- [ ] Auto Build

### Testing

- [ ] Vitest
- [ ] Playwright
- [ ] Mock Chrome APIs
- [ ] Storage Tests
- [ ] Background Tests
- [ ] Popup Tests
- [ ] Messaging Tests

## Folder Structure

```
extension-forge/
├── apps/
├── demo-extension/
├── packages/
│   ├── cli/
│   ├── core/
│   ├── vite-plugin/
│   ├── testing/
│   └── shared/
├── docs/
├── templates/
│   ├── basic/
│   ├── react/
│   ├── vue/
│   ├── solid/
│   ├── svelte/
│   └── vanilla/
└── examples/
```

## Generated Project

```
my-extension/
├── src/
│   ├── popup/
│   ├── options/
│   ├── background/
│   ├── content/
│   ├── sidepanel/
│   ├── assets/
│   ├── hooks/
│   ├── utils/
│   ├── services/
│   ├── types/
│   └── styles/
├── manifest.ts
└── vite.config.ts
```

## CLI

| Command | Description |
|---------|-------------|
| `npx mv3-forge new` | Create a new extension project |
| `npx mv3-forge dev` | Start development server |
| `npx mv3-forge build` | Build the extension |
| `npx mv3-forge zip` | Package extension as ZIP |
| `npx mv3-forge release` | Create a release |
| `npx mv3-forge publish` | Publish to npm |
| `npx mv3-forge doctor` | Diagnose issues |
| `npx mv3-forge lint` | Run linter |
| `npx mv3-forge test` | Run tests |

## Auto Generated Manifest

Instead of writing:

```json
{
  // ... lots of manifest boilerplate
}
```

Developers write:

```typescript
export default defineManifest({
  name: "Demo",
  permissions: ["storage", "tabs"]
})
```

Compile → Generate `manifest.json` automatically.

Huge developer experience improvement.

## Built-in Utilities

Instead of `chrome.storage.sync.get(...)`, developers write:

```typescript
await storage.get("theme")
```

Instead of `chrome.runtime.sendMessage(...)`, developers write:

```typescript
await message.send("LOGIN")
```

Instead of `chrome.tabs.query(...)`, developers write:

```typescript
await tabs.active()
```

## Documentation

Every API gets:
- Explanation
- Example
- Best Practices
- Common Errors
- Performance Tips

Like Vite docs.

## GitHub Actions

Automatically run:
- Lint
- Test
- Build
- Zip
- Release
- Publish npm

## Examples

Create 15–20 polished examples such as:

- AI Sidebar
- Ad Blocker
- Dark Mode Toggle
- Notes Extension
- Password Generator
- Pomodoro Timer
- Tab Manager
- URL Shortener
- QR Code Generator
- Screenshot Tool
- YouTube Enhancer
- Gmail Productivity Tools
- Shopping Price Tracker
- RSS Reader
- Translation Popup

These examples become living documentation.

## Long-Term Roadmap

### v1.0

- Manifest V3 support
- Vite integration
- TypeScript
- Tailwind
- Vanilla template

### v2.0

- React template
- Vue template
- Svelte template
- Solid template

### v3.0

- Firefox support
- Edge support
- Brave support

### v4.0

- Safari support
- Cross-browser packaging
- Extension publishing helpers

### v5.0

- AI-powered code generation (e.g., scaffold a popup, background script, or permissions from prompts)

## What Makes This Different?

There are already projects like CRXJS, WXT, and Plasmo. To stand out, don't try to replace them immediately. Focus on developer experience:

- Opinionated project structure
- Excellent documentation
- Type-safe wrappers for browser APIs
- Production-ready templates
- Rich example gallery
- CLI for scaffolding, packaging, and releasing
- Automated testing and CI setup out of the box

This makes it a practical toolkit rather than just another bundler integration.

## Suggested Milestones

### Week 1

Monorepo setup (pnpm + TurboRepo or Nx), CLI, and a basic Vanilla TypeScript template.

### Week 2

Build tooling, hot reload, manifest generation, and packaging.

### Week 3

Storage, messaging, tabs, and runtime utility wrappers with unit tests.

### Week 4

Documentation site, example extensions, GitHub Actions, npm publishing, and the first stable release.