export const EXTENSION_FORGE_NAME = 'mv3-forge';
export const EXTENSION_FORGE_VERSION = '0.1.8';

export const MANIFEST_VERSION = 3;

export const ENTRY_POINTS = {
    background: 'background.ts',
    popup: 'popup.ts',
    content: 'content.ts',
} as const;

export const DIRECTORIES = {
    source: 'src',
    dist: 'dist',
    assets: 'assets',
    public: 'public',
} as const;

// Re-export template types from registry
export { TEMPLATE_REGISTRY, type TemplateType } from './template-registry.js';
