import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/progress': 'http://localhost:4000',
      '/diagnostic': 'http://localhost:4000',
      '/lessons': 'http://localhost:4000',
      '/session': 'http://localhost:4000',
    },
  },
})
