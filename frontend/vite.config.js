// vite.config.js (CommonJS)
const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')

module.exports = defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],  // <-- aquí
      reportsDirectory: 'coverage'          // opcional, por defecto es "coverage"
    }
  }
})
