import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'lottie-web': 'lottie-web/build/player/lottie_light.js'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('lottie')) return 'vendor-lottie';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('highlight.js')) return 'vendor-highlight';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})