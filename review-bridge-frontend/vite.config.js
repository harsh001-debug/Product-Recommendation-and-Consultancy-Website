import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Handle SPA fallback - serve index.html for all non-file routes
    historyApiFallback: true,
  },
  appType: 'spa',
})
