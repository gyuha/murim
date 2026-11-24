import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Served from the custom domain murim.gyuha.com (site root).
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 25173,
  },
  preview: {
    port: 25173,
  },
});
