import type { Plugin, BuildContext } from './plugin-interface.js';
import { exists, ensureDir } from '@mv3-forge/shared';
import { join } from 'path';
import { promises as fs } from 'fs';

export interface IconPluginOptions {
  source: string;
  outputs: {
    size: number;
    path: string;
  }[];
}

export const iconPlugin = (options: IconPluginOptions): Plugin => ({
  name: 'icons',
  hooks: {
    async afterBuild(context: BuildContext) {
      const { outDir } = context;
      const iconsDir = join(outDir, 'icons');
      
      // Check if source icon exists
      if (!(await exists(options.source))) {
        console.warn(`[mv3-forge] Icon source not found: ${options.source}`);
        return;
      }

      // Ensure icons directory exists
      await ensureDir(iconsDir);

      // Note: Icon resize would require sharp package
      // For now, copy source icon as placeholder
      for (const { path } of options.outputs) {
        try {
          const dir = path.substring(0, path.lastIndexOf('/'));
          await ensureDir(dir);
          await fs.copyFile(options.source, path);
          console.log(`[mv3-forge] Copied icon to: ${path}`);
        } catch (error) {
          console.error(`[mv3-forge] Failed to copy icon:`, error);
        }
      }
    },
  },
});

// Default icon sizes for Chrome extensions
export const DEFAULT_ICON_SIZES = [16, 32, 48, 128];

export function createIconPlugin(sourcePath: string, outDir: string): Plugin {
  return iconPlugin({
    source: sourcePath,
    outputs: DEFAULT_ICON_SIZES.map(size => ({
      size,
      path: join(outDir, 'icons', `icon${size}.png`),
    })),
  });
}