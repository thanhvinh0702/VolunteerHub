import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'inflexionally-debonair-crew.ngrok-free.dev'
    ],
    host: true,
    port: 5173
  }
})
