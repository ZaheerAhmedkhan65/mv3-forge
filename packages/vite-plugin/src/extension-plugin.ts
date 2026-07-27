import { Plugin } from 'vite';
import { copyFileSync, mkdirSync, existsSync, cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ViteDevServer } from 'vite';

export interface ExtensionPluginOptions {
  /** Path to the manifest source file (src/manifest.ts or manifest.json) */
  manifestPath?: string;
  /** Path to the icons directory */
  iconsPath?: string;
  /** List of HTML entry points to move to dist root */
  htmlEntrypoints?: string[];
  /** Whether to serve a dev page at / */
  serveDevPage?: boolean;
  /** Path to dev page HTML (for root / route) */
  devPagePath?: string;
}

/**
 * Creates a Vite plugin for Chrome Extension development.
 * Handles manifest, icons, and HTML entrypoint processing.
 */
export function createExtensionPlugin(options: ExtensionPluginOptions = {}): Plugin {
  const {
    serveDevPage = true,
    devPagePath,
  } = options;

  return {
    name: 'mv3-extension',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      if (!serveDevPage || !devPagePath) return;

      server.middlewares.use(
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.url === '/' || req.url === '/index.html') {
            if (existsSync(devPagePath)) {
              res.setHeader('Content-Type', 'text/html');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(readFileSync(devPagePath, 'utf-8'));
              return;
            }
          }
          next();
        }
      );
    },
  };
}

/**
 * Creates a build plugin for Chrome Extension production builds.
 * Copies manifest and icons to dist, reorganizes HTML files.
 */
export function createExtensionBuildPlugin(options: ExtensionPluginOptions = {}): Plugin {
  const {
    manifestPath,
    iconsPath,
    htmlEntrypoints = ['popup.html', 'options.html', 'index.html'],
  } = options;

  return {
    name: 'mv3-extension-build',
    generateBundle() {
      const outDir = resolve(process.cwd(), 'dist');

      // Ensure dist directory exists
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      // Copy manifest.json if provided
      if (manifestPath && existsSync(manifestPath)) {
        const manifestDest = resolve(outDir, 'manifest.json');
        copyFileSync(manifestPath, manifestDest);
      }

      // Copy icons folder if provided
      if (iconsPath && existsSync(iconsPath)) {
        const iconsDest = resolve(outDir, 'icons');
        mkdirSync(iconsDest, { recursive: true });
        cpSync(iconsPath, iconsDest, { recursive: true });
      }
    },

    closeBundle() {
      // Move HTML files from dist/src/ to dist/ root and fix paths
      const srcDir = resolve(process.cwd(), 'dist/src');
      if (existsSync(srcDir)) {
        for (const file of htmlEntrypoints) {
          const srcFile = resolve(srcDir, file);
          const destFile = resolve(process.cwd(), 'dist', file);
          if (existsSync(srcFile)) {
            let content = readFileSync(srcFile, 'utf-8');
            // Fix relative paths - remove ../ since files are now at root
            content = content.replace(/src="\.\.\//g, 'src="');
            content = content.replace(/href="\.\.\//g, 'href="');
            writeFileSync(destFile, content, 'utf-8');
          }
        }
        // Remove the src directory
        rmSync(srcDir, { recursive: true, force: true });
      }
    },
  };
}

/**
 * Creates a complete extension plugin (dev + build)
 */
export function extensionPlugin(options: ExtensionPluginOptions = {}): Plugin[] {
  return [
    createExtensionPlugin(options),
    createExtensionBuildPlugin(options),
  ];
}