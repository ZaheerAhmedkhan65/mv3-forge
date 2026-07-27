import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { extensionPlugin } from '@mv3-forge/vite-plugin';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [react(), extensionPlugin({
    manifestPath: resolve(__dirname, 'src/manifest.ts'),
    iconsPath: resolve(__dirname, 'src/icons'),
    htmlEntrypoints: ['popup.html', 'index.html'],
    serveDevPage: true,
    devPagePath: resolve(__dirname, 'index.html'),
  })].flat(),
  server: {
    hmr: false,
    open: '/',
  },
});