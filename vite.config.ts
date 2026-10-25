import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/motion/') || id.includes('node_modules/gsap/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/canvas-confetti/')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
});
