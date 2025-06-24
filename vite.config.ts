// vite.config.ts  (ES-модуль с top-level await остаётся)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'

// Replit-ovy плагины без изменений
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal'

export default defineConfig(async ({ mode }) => ({
  plugins: [
    react(),

    // Add legacy support for older browsers
    legacy({
      targets: ['Chrome >= 72', 'Android >= 6'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      polyfills: [
        'es.object.from-entries',
        'es.array.flat',
        'es.array.flat-map',
        'es.string.match-all'
      ],
      modernPolyfills: true
    }),

    runtimeErrorOverlay(),

    // Replit Cartographer -- как было
    ...(mode !== 'production' && process.env.REPL_ID !== undefined
      ? [(await import('@replit/vite-plugin-cartographer')).cartographer()]
      : [])
  ],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets')
    }
  },

  root: path.resolve(import.meta.dirname, 'client'),

  build: {
    target: 'es2017',
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true
  },

  server: {
    fs: {
      strict: true,
      deny: ['**/.*']
    }
  }
}))
