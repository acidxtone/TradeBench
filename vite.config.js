import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    // Remove server proxy for Supabase compatibility
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize for Vercel deployment
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  // Define global constants for build
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
