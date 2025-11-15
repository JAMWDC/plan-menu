// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ↓↓↓ AÑADIDO: Se define la ruta base para el despliegue en GitHub Pages ↓↓↓
  base: '/plan-menu/', 
  
  plugins: [react()], 
  server: {
    host: '0.0.0.0', 
    port: 5173 
  }
});