import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        wafdeen: resolve(projectRoot, 'wafdeen.html')
      },
      output: {
        manualChunks: {
          app: ['./src/main.js']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true
  }
});
