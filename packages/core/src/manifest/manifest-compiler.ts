import { join } from 'path';
import type { Manifest } from '../types.js';
import { writeJson, readJson } from '@mv3-forge/shared';
import { defineManifest } from './manifest-dsl.js';

export interface ManifestCompilerOptions {
  sourceDir: string;
  outputDir: string;
  manifestPath?: string;
}

export class ManifestCompiler {
  async compile(options: ManifestCompilerOptions): Promise<Manifest> {
    // If manifest.ts exists, we need to compile it (user would use defineManifest)
    // For now, we'll look for existing manifest.json or use defaults
    const defaultManifest = defineManifest({
      name: 'extension',
      version: '1.0.0',
    });

    if (options.manifestPath) {
      // Load custom manifest from path
      const manifest = await readJson<Manifest>(options.manifestPath);
      const outputPath = join(options.outputDir, 'manifest.json');
      await writeJson(outputPath, manifest);
      return manifest;
    }

    // Use default manifest
    const outputPath = join(options.outputDir, 'manifest.json');
    await writeJson(outputPath, defaultManifest);
    
    return defaultManifest;
  }

  async autoRegister(entries: {
    background?: string;
    popup?: string;
    options?: string;
    sidepanel?: string;
    devtools?: string;
    newtab?: string;
    welcome?: string;
  }, manifest: Manifest): Promise<Manifest> {
    const registered: Manifest = { ...manifest };

    // Auto-register background
    if (entries.background) {
      registered.background = {
        service_worker: entries.background,
        type: 'module',
      };
    }

    // Auto-register popup
    if (entries.popup) {
      registered.action = {
        ...registered.action,
        default_popup: entries.popup,
      };
    }

    // Auto-register options
    if (entries.options) {
      registered.options_page = entries.options;
    }

    // Auto-register side panel
    if (entries.sidepanel) {
      registered.side_panel = {
        default_path: entries.sidepanel,
      };
    }

    // Auto-register devtools
    if (entries.devtools) {
      registered.devtools_page = entries.devtools;
    }

    // Auto-register new tab override
    if (entries.newtab) {
      registered.newtab = {
        url: entries.newtab,
      };
    }

    // welcome page is handled via chrome.runtime.onInstalled

    return registered;
  }
}