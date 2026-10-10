import { defineConfig } from 'vite';

const supabaseProxy = {
  target: 'https://kryihlhqsxauhnbaukqe.supabase.co',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/__supabase/, ''),
};

export default defineConfig({
  base: './',
  // The Edge Function does not allow the browser's Authorization preflight.
  // Proxy local dev/preview requests through Vite; production still uses the direct URL.
  server: { proxy: { '/__supabase': supabaseProxy } },
  preview: { proxy: { '/__supabase': supabaseProxy } },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Legacy classic scripts stay ordered and unbundled to preserve globals/inline handlers.
    copyPublicDir: true,
  },
});
