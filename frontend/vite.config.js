import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Requests to /api/... go to the FastAPI backend. The browser sees one
    // address (localhost:5173), so no CORS setup is needed in development.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
