import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages hostet das Projekt unter /karate-dashboard-starter/,
  // deshalb braucht der Build einen relativen Base-Pfad.
  // Dev-Server (npm run dev) bleibt weiterhin unter / .
  base: process.env.NODE_ENV === 'production' ? '/karate-dashboard-starter/' : '/',
  server: {
port: 3000,
proxy: {
// Proxy für Live-Daten (falls Backend auf anderem Port läuft)
'/api': {
target: 'http://localhost:8080',
changeOrigin: true,
},
},
},
});
