export const EXTENSION_FORGE_NAME = 'mv3-forge';
export const EXTENSION_FORGE_VERSION = '0.1.2';

export const TEMPLATES = ['vanilla', 'react', 'vue', 'solid', 'svelte'] as const;
export type Template = (typeof TEMPLATES)[number];

export const DEFAULT_TEMPLATE: Template = 'vanilla';

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