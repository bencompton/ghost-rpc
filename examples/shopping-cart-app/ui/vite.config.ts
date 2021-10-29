import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: '/',
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
      }
    }
  }
});
