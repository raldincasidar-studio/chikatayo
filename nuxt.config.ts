// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },







  app: {
    head: {
      title: 'Chika Tayo — Ang Iyong Personal na Voice Diary at AI Therapy App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Chika Tayo is your personal voice diary and AI therapy app — built for Filipinos to express thoughts, reflect, and heal using natural Tagalog. Developed by Raldin Casidar Studio.'
        },
        {
          name: 'keywords',
          content: 'Chika Tayo, voice diary app, AI therapy, mental health, Tagalog diary, Filipino AI companion, Nuxt PWA, Raldin Casidar Studio'
        },
        { name: 'author', content: 'Raldin Casidar Studio' },

        // Open Graph / Facebook / LinkedIn
        { property: 'og:title', content: 'Chika Tayo — Ang Iyong Personal na Voice Diary at AI Therapy App' },
        { property: 'og:description', content: 'Talk to your AI companion in Tagalog. Chika Tayo is a modern, installable Nuxt PWA designed for your mental health journey.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://chikatayo.vercel.app' },
        { property: 'og:image', content: 'https://chikatayo.vercel.app/play-store/play_store_feature_graphic.png' },
        { property: 'og:image:alt', content: 'Screenshot of Chika Tayo PWA in action' },
        { property: 'og:site_name', content: 'Chika Tayo' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@raldincasidar' }, // Optional: update if you have Twitter
        { name: 'twitter:creator', content: '@raldincasidar' },
        { name: 'twitter:title', content: 'Chika Tayo — AI Therapy & Voice Diary for Filipinos' },
        { name: 'twitter:description', content: 'Chika Tayo is your AI voice diary built for Filipinos — express your thoughts in Tagalog anytime.' },
        { name: 'twitter:image', content: 'https://chikatayo.vercel.app/play-store/play_store_feature_graphic.png' },

        // Schema.org Microdata (Good for Google indexing)
        { itemprop: 'name', content: 'Chika Tayo' },
        { itemprop: 'description', content: 'Voice diary and AI mental health app for Filipinos, developed by Raldin Casidar Studio.' },
        { itemprop: 'image', content: 'https://chikatayo.vercel.app/play-store/play_store_feature_graphic.png' }
      ],
      link: [
        { rel: 'canonical', href: 'https://chikatayo.vercel.app' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
      ]
    }
  },






   build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@vite-pwa/nuxt',
    //...
  ],
  pwa: {
    manifest: {
      name: 'Chika Tayo - AI Therapy & Voice Diary for Filipinos',
      short_name: 'Chika Tayo',
      description: 'Voice diary and AI mental health app for Filipinos, developed by Raldin Casidar Studio.',
      theme_color: '#1E88E5',
      background_color: '#ffffff',
      display: 'standalone', // or 'fullscreen', 'minimal-ui'
      icons: [
        {
          src: 'web/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'web/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'web/icon-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
