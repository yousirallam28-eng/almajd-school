import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Legacy classic scripts stay ordered and unbundled to preserve globals/inline handlers.
    copyPublicDir: true,
  },
});
