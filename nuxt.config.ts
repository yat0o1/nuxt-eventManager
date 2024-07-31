// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    server: {
      port: process.env.PORT || 3000, 
    },
    public: {
      ApiKey: process.env.API_KEY
    },
  },
})
