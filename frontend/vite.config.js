// vite.config.js (CommonJS)
import { VitePWA } from 'vite-plugin-pwa';
const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')

module.exports = defineConfig({
  plugins: [vue(), 
    VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Mi PWA',
                short_name: 'PWA',
                description: 'Una aplicación web progresiva con Vue y Vite',
                theme_color: '#4DBA87',
                icons: [
                  {
                        src: '/icons/144.png',
                        sizes: '144x144',
                        type: 'image/png',
                    },  
                  {
                        src: '/icons/512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/1024.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                    },
                ],
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
            },
        }),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],  // <-- aquí
      reportsDirectory: 'coverage'          // opcional, por defecto es "coverage"
    }
  }
})
