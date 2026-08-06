import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/v1/auth': {
          target: env.VITE_AUTH_PROXY_TARGET ?? 'http://localhost:8082',
          changeOrigin: true,
        },
        '/api': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://localhost:8081',
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: false,
      },
    },
  }
})
