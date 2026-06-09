import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import githubHandler from './api/github.js'

function githubDevApiPlugin() {
  return {
    name: 'github-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/github', async (request, response) => {
        const requestUrl = new URL(request.url, 'http://localhost')
        const query = Object.fromEntries(requestUrl.searchParams)

        await githubHandler(
          { query },
          {
            setHeader(name, value) {
              response.setHeader(name, value)
            },
            status(statusCode) {
              response.statusCode = statusCode
              return this
            },
            json(payload) {
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify(payload))
            },
          },
        )
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      vue(),
      vueDevTools(),
      githubDevApiPlugin(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
