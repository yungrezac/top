import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  server: {
    // Railway требует, чтобы приложение слушало на 0.0.0.0
    host: '0.0.0.0',
    // Используем порт из переменной окружения PORT или 8080 по умолчанию
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  }
})

