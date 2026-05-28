import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/ask-dsa': 'http://localhost:8000',
      '/run': 'http://localhost:8000',
      '/leetcode': 'http://localhost:8000',
    },
  },
})
