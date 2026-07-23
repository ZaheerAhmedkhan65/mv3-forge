import type { SharedConfig } from '@mv3-forge/shared';

export interface PluginContext {
  config: SharedConfig;
  projectRoot: string;
}

export interface BuildContext extends PluginContext {
  outDir: string;
  mode: 'development' | 'staging' | 'production';
  sourceMaps: boolean;
}

export interface ManifestContext extends PluginContext {
  manifest: Record<string, unknown>;
}

export interface ZipContext extends PluginContext {
  zipPath: string;
}

export type PluginHook = 'beforeBuild' | 'afterBuild' | 'beforeManifest' | 'afterManifest' | 'beforeZip' | 'afterZip' | 'beforeDev' | 'afterDev';

export interface Plugin {
  name: string;
  hooks: {
    [K in PluginHook]?: (context: K extends 'beforeBuild' | 'afterBuild' ? BuildContext :
      K extends 'beforeManifest' | 'afterManifest' ? ManifestContext :
      K extends 'beforeZip' | 'afterZip' ? ZipContext :
      PluginContext) => Promise<void> | void;
  };
}

export interface PluginManager {
  register(plugin: Plugin): void;
  unregister(name: string): void;
  execute(hook: PluginHook, context: PluginContext | BuildContext | ManifestContext | ZipContext): Promise<void>;
  getPlugins(): Plugin[];
}