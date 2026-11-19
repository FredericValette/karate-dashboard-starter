import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react()],
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
