import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/template-registry.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
});
