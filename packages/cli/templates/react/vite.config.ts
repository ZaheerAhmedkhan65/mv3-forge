import { defineConfig, ViteDevServer } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { copyFileSync, mkdirSync, existsSync, cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Plugin to serve root index.html for dev server
function devPagePlugin() {
  return {
    name: 'dev-page',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/' || req.url === '/index.html') {
          const indexPath = resolve(__dirname, 'index.html');
          if (existsSync(indexPath)) {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(readFileSync(indexPath, 'utf-8'));
            return;
          }
        }
        next();
      });
    },
  };
}

// Plugin to copy manifest and icons to dist during build
function extensionAssetsPlugin() {
  return {
    name: 'extension-assets',
    generateBundle() {
      const outDir = resolve(__dirname, 'dist');

      // Ensure dist directory exists
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      // Copy manifest.json
      const manifestSrc = resolve(__dirname, 'manifest.json');
      const manifestDest = resolve(__dirname, 'dist/manifest.json');
      if (existsSync(manifestSrc)) {
        copyFileSync(manifestSrc, manifestDest);
      }

      // Copy icons folder
      const iconsSrc = resolve(__dirname, 'icons');
      const iconsDest = resolve(__dirname, 'dist/icons');
      if (existsSync(iconsSrc)) {
        mkdirSync(iconsDest, { recursive: true });
        cpSync(iconsSrc, iconsDest, { recursive: true });
      }
    },
    closeBundle() {
      // Move HTML files from dist/src/ to dist/ root and fix paths
      const srcDir = resolve(__dirname, 'dist/src');
      if (existsSync(srcDir)) {
        const files = ['popup.html', 'index.html'];
        for (const file of files) {
          const srcFile = resolve(srcDir, file);
          const destFile = resolve(__dirname, 'dist', file);
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

export default defineConfig({
  base: './', // Use relative paths for extension assets
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        popup: resolve(__dirname, 'src/popup.html'),
        options: resolve(__dirname, 'src/index.html'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [react(), devPagePlugin(), extensionAssetsPlugin()],
  server: {
    hmr: false, // Disable HMR for extension development
    open: '/', // Open root path
  },
});