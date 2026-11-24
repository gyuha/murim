import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages serves this project from /murim/.
  base: '/murim/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 25173,
  },
  preview: {
    port: 25173,
  },
});
