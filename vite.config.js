import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:"../pulse/a/"
  },
  appType:'spa',
  base:'/a',
  server: {
    port: 5001,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/ws': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/login': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/logout': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/callback': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
    },
  },
});
