import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function mandiPricesPlugin() {
  return {
    name: 'mandi-prices-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://localhost')
        if (parsedUrl.pathname === '/api/prices') {
          try {
            const { getKeralaPrices } = await import('../server/pricesService.js')
            const forceRefresh = parsedUrl.searchParams.get('refresh') === 'true'
            const data = await getKeralaPrices({ forceRefresh })
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return
          } catch (err) {
            console.error('[VITE] /api/prices error:', err.message)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              updatedAt: null,
              source: 'data.gov.in Agmarknet',
              items: [],
              stale: true,
              error: err.message,
            }))
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), mandiPricesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

