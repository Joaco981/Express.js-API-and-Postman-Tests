// vite.config.js (ES6)
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [vue(), 
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mi PWA',
        short_name: 'PWA',
        description: 'Una aplicación web progresiva con Vue y Vite',
        theme_color: '#4DBA87',
        screenshots: [
          {
            src: 'img/Screenshot1.png',
            sizes: '2490x1484',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'img/ScreenshotMobile.png',
            sizes: '1960x3194',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ],
        icons: [
          {
            src: 'img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },  
          {
            src: 'img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
      },
      workbox: {
        // Opciones de Workbox para personalizar el Service Worker
        globPatterns: ['*/.{js,css,html,png,jpg,jpeg,svg}'], // Archivos a cachear
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage'
    }
  }
});
