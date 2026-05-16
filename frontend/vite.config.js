import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/hints': 'http://localhost:8000',
      '/solution': 'http://localhost:8000',
      '/run': 'http://localhost:8000',
      '/leetcode': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
      '/submissions': 'http://localhost:8000',
    },
  },
})
