import type { Manifest, ManifestIcons, ManifestAction, ManifestBackground, ManifestContentScript, ManifestWebAccessibleResource, ManifestCommand, ManifestSidePanel, ManifestOptionsUI } from '../types.js';

// Strongly typed Manifest DSL interfaces - re-export from types for convenience
export type { ManifestIcons, ManifestAction, ManifestBackground, ManifestContentScript, ManifestWebAccessibleResource, ManifestCommand, ManifestSidePanel, ManifestOptionsUI };

export interface ManifestConfig {
  name: string;
  description?: string;
  version?: string;
  icons?: ManifestIcons;
  action?: ManifestAction;
  options_page?: string;
  options_ui?: ManifestOptionsUI;
  background?: ManifestBackground;
  content_scripts?: ManifestContentScript[];
  content_security_policy?: {
    extension_pages?: string;
    sandbox?: string;
  };
  permissions?: string[];
  optional_permissions?: string[];
  host_permissions?: string[];
  web_accessible_resources?: ManifestWebAccessibleResource[];
  commands?: Record<string, ManifestCommand>;
  side_panel?: ManifestSidePanel;
  devtools_page?: string;
  newtab?: {
    url: string;
  };
  manifest_version?: number;
}

// Schema validation helper
export class ManifestSchema {
  static validate(config: ManifestConfig): ManifestConfig {
    const errors: string[] = [];

    if (!config.name) {
      errors.push('name is required');
    }

    if (config.manifest_version !== undefined && config.manifest_version !== 3) {
      errors.push('manifest_version must be 3 for Chrome Manifest V3');
    }

    if (config.version && !/^\d+\.\d+\.\d+/.test(config.version)) {
      errors.push('version should follow semantic versioning (e.g., 1.0.0)');
    }

    if (errors.length > 0) {
      throw new Error(`Manifest validation errors:\n${errors.map(e => `  - ${e}`).join('\n')}`);
    }

    return config;
  }

  static inferDefaults(config: ManifestConfig): ManifestConfig {
    return {
      manifest_version: 3,
      ...config,
      version: config.version || '1.0.0',
    };
  }
}

// defineManifest function - the main DSL API
export function defineManifest(config: ManifestConfig): Manifest {
  const validated = ManifestSchema.validate(config);
  const withDefaults = ManifestSchema.inferDefaults(validated);
  
  return withDefaults as Manifest;
}