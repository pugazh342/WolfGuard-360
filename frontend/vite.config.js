import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Forces Vite to bind to 0.0.0.0 (opens it to Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true // Ensures Hot-Reload works across Docker volumes on Windows!
    }
  }
})