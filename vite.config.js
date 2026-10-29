import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

const rewriteWafdeenPublicPaths = {
  name: 'wafdeen-public-paths',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      return html.replaceAll('./public/wafdeen/', './wafdeen/');
    }
  }
};

export default defineConfig({
  base: './',
  plugins: [rewriteWafdeenPublicPaths],
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
