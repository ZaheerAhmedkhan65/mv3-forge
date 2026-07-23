import { resolve, join } from 'path';
import type { Plugin } from 'vite';
import { existsSync } from 'fs';

export type EntryPoint = 
  | 'popup' 
  | 'options' 
  | 'background' 
  | 'content' 
  | 'sidepanel' 
  | 'devtools' 
  | 'newtab' 
  | 'welcome';

export interface DiscoveredEntry {
  name: EntryPoint;
  path: string;
  exists: boolean;
}

export function discoverEntries(sourceDir: string): DiscoveredEntry[] {
  const entryPoints: EntryPoint[] = [
    'popup',
    'options',
    'background',
    'content',
    'sidepanel',
    'devtools',
    'newtab',
    'welcome',
  ];

  return entryPoints.map((point) => {
    // Check for both .ts and .tsx files
    const tsPath = join(sourceDir, `${point}.ts`);
    const tsxPath = join(sourceDir, `${point}.tsx`);
    const htmlPath = join(sourceDir, `${point}.html`);
    
    // Check if any variant exists
    const exists = [tsPath, tsxPath, htmlPath].some((p) => 
      existsSync(p)
    );

    return {
      name: point,
      path: exists ? (existsSync(tsPath) ? tsPath : existsSync(tsxPath) ? tsxPath : htmlPath) : '',
      exists,
    };
  });
}

export function createEntryDiscoveryPlugin(sourceDir: string): Plugin {
  return {
    name: 'mv3-entry-discovery',
    config: () => {
      const discovered = discoverEntries(sourceDir);
      const inputs: Record<string, string> = {};

      for (const entry of discovered) {
        if (entry.exists) {
          inputs[entry.name] = resolve(entry.path);
        }
      }

      return {
        build: {
          rollupOptions: {
            input: inputs,
          },
        },
      };
    },
  };
}