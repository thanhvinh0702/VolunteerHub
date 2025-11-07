import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'smirkingly-nonspalling-awilda.ngrok-free.dev'
    ],
    host: true,
    port: 5173
  }
})
