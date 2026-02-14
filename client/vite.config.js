import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Use 0.0.0.0 to access dev server from other machines on same network
    // Remove or set to 'localhost' for local development only
    host: '0.0.0.0',
    port: 5173,
    base: "/"
  }
})
