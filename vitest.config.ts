import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Отдельный конфиг: тестам нужны только алиасы, плагины Vue и Nuxt UI не требуются,
// потому что проверяется чистая логика расчётов и импорта/экспорта.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts']
  }
})
