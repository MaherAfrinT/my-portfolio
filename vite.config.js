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
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('react-router-dom') || id.includes('react-router')) return 'vendor-router';
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
            if (id.includes('remark') || id.includes('rehype') || id.includes('lowlight') || id.includes('highlight.js') || id.includes('markdown')) return 'vendor-markdown';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})