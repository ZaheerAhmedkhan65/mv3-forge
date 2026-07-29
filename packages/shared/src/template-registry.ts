import { join, dirname } from 'node:path';
import { existsSync, readdirSync, statSync } from 'node:fs';

export type TemplateType = 'vanilla' | 'react' | 'vue' | 'solid' | 'svelte';

// Template type alias for backward compatibility
export type Template = TemplateType;

export interface TemplateInfo {
  name: TemplateType;
  label: string;
  description: string;
  available: boolean;
}

/**
 * Template registry - central source of truth for all templates.
 * Adding a new template only requires adding to this list.
 */
export const TEMPLATE_REGISTRY: Record<string, Omit<TemplateInfo, 'available'>> = {
  vanilla: {
    name: 'vanilla',
    label: 'Vanilla',
    description: 'TypeScript + HTML/CSS extension without framework',
  },
  react: {
    name: 'react',
    label: 'React',
    description: 'React + TypeScript extension with modern tooling',
  },
  vue: {
    name: 'vue',
    label: 'Vue',
    description: 'Vue.js extension (coming soon)',
  },
  solid: {
    name: 'solid',
    label: 'Solid',
    description: 'SolidJS extension (coming soon)',
  },
  svelte: {
    name: 'svelte',
    label: 'Svelte',
    description: 'Svelte extension (coming soon)',
  },
} as const;

/**
 * Get all registered templates
 */
export function getRegisteredTemplates(): TemplateInfo[] {
  const templatesDir = getTemplatesDir();
  const templates: TemplateInfo[] = [];

  for (const key of Object.keys(TEMPLATE_REGISTRY)) {
    const template = TEMPLATE_REGISTRY[key as TemplateType];
    const templatePath = join(templatesDir, key);
    templates.push({
      ...template,
      available: existsSync(templatePath) && statSync(templatePath).isDirectory(),
    });
  }

  return templates;
}

/**
 * Check if a template is available (exists on disk)
 */
export function isTemplateAvailable(template: TemplateType): boolean {
  const templatesDir = getTemplatesDir();
  const templatePath = join(templatesDir, template);
  return existsSync(templatePath) && statSync(templatePath).isDirectory();
}

/**
 * Get the templates directory path.
 * Works in both development (monorepo) and production (npm package) modes.
 */
export function getTemplatesDir(): string {
  try {
    // Get the current module's directory
    const currentFilePath = new URL(import.meta.url).pathname;
    const __dirname = dirname(currentFilePath);

    // CASE 1: Monorepo development (packages/cli/dist, packages/core/dist, packages/shared/dist)
    // Navigate up to find pnpm-workspace.yaml, then use root templates/
    const isDevMode =
      __dirname.includes('/packages/cli/dist') ||
      __dirname.includes('/packages/core/dist') ||
      __dirname.includes('/packages/shared/dist');

    if (isDevMode) {
      let templatesDir = __dirname;
      while (!existsSync(join(templatesDir, 'pnpm-workspace.yaml'))) {
        const parent = dirname(templatesDir);
        if (parent === templatesDir) break; // reached root
        templatesDir = parent;
      }
      const rootTemplates = join(templatesDir, 'templates');
      if (existsSync(rootTemplates)) {
        return rootTemplates;
      }
    }

    // CASE 2: npm global/local install (dist/index.js -> templates/)
    // When installed via npm, the structure is:
    //   mv3-forge/
    //     dist/index.js     (built CLI)
    //     templates/         (bundled templates)
    // So templates is one level up from dist/
    const templatesBundled = join(__dirname, '..', 'templates');
    if (existsSync(templatesBundled) && statSync(templatesBundled).isDirectory()) {
      return templatesBundled;
    }
  } catch {
    // Fallback to current working directory
  }

  return join(process.cwd(), 'templates');
}

/**
 * Resolve a template path within the templates directory
 */
export function resolveTemplatePath(template: TemplateType): string {
  return join(getTemplatesDir(), template);
}

/**
 * Get available templates from disk
 */
export function getAvailableTemplates(): TemplateType[] {
  const templatesDir = getTemplatesDir();
  if (!existsSync(templatesDir)) return [];

  const entries = readdirSync(templatesDir);
  const templates: TemplateType[] = [];

  for (const entry of entries) {
    const entryPath = join(templatesDir, entry);
    if (statSync(entryPath).isDirectory()) {
      templates.push(entry as TemplateType);
    }
  }

  return templates;
}