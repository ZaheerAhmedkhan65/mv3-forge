import type { Plugin, PluginHook, PluginContext, BuildContext, ManifestContext, ZipContext } from './plugin-interface.js';

export class PluginManagerImpl {
  private plugins: Plugin[] = [];

  register(plugin: Plugin): void {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(`[mv3-forge] Plugin '${plugin.name}' is already registered`);
      return;
    }
    this.plugins.push(plugin);
  }

  unregister(name: string): void {
    this.plugins = this.plugins.filter((p) => p.name !== name);
  }

  async execute(hook: PluginHook, context: PluginContext | BuildContext | ManifestContext | ZipContext): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const plugin of this.plugins) {
      const hookFn = plugin.hooks[hook];
      if (hookFn) {
        promises.push(Promise.resolve().then(() => hookFn(context)));
      }
    }

    await Promise.all(promises);
  }

  getPlugins(): Plugin[] {
    return [...this.plugins];
  }
}

export const pluginManager = new PluginManagerImpl();

export function createPlugin(plugin: Plugin): Plugin {
  return plugin;
}