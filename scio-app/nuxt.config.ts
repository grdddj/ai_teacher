// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  typescript: {
    includeWorkspace: true,
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  vite: {
    server: {
      hmr: {
        clientPort: 3000,
      },
      allowedHosts: ['localhost', '127.0.0.1', 'aiteacher.jirkuvserver.cz', '.jirkuvserver.cz'],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
})
