// https://nuxt.com/docs/api/configuration/nuxt-config

// const i18nDomains = [
//   "mydomain.com",
//   "es.mydomain.com",
//   "fr.mydomain.com",
//   "http://pl.mydomain.com",
//   "https://ua.mydomain.com",
// ];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      script: [
        {
          src: "https://www.googletagmanager.com/gtm.js?id=GTM-TVC4G9C",
          async: true,
        },
      ],
    },
    baseURL: "/",
    cdnURL: "/",
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_API_URL,
      baseImageArticle: process.env.NUXT_API_BASEIMGARTICLE,
      baseCat: process.env.NUXT_API_CATC,
      GoogleTagId: process.env.NUXT_PUBLIC_GTAG_ID,
    },
  },
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@nuxtjs/device",
    "@element-plus/nuxt",
    "nuxt-schema-org",
  ],

  css: ["element-plus/theme-chalk/dark/css-vars.css"],

  // Auto import components
  components: true,

  elementPlus: {},

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  nitro: {
    preset: "node-server",
    // routeRules: {
    //   '/_nuxt/**': {
    //     headers: {
    //       'Access-Control-Allow-Origin': 'https://dev.trumecs.com',
    //       'Access-Control-Allow-Methods': 'GET, OPTIONS',
    //       'Access-Control-Allow-Headers': '*'
    //     }
    //   }
    // }
  },
  experimental: {
    writeEarlyHints: false,
  },

  i18n: {
    locales: [
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
      {
        code: "id",
        iso: "id-ID",
        file: "id.json",
        name: "Bahasa Indonesia",
      },
    ],
    // locales: [
    //   {
    //     code: 'en',
    //     domains: i18nDomains,
    //     defaultForDomains: ['mydomain.com']
    //   },
    //   {
    //     code: 'es',
    //     domains: i18nDomains,
    //     defaultForDomains: ['es.mydomain.com']
    //   },
    // ],
    // multiDomainLocales: true,
    strategy: "prefix_except_default",
    lazy: true,
    langDir: "locales/",
    defaultLocale: "id",
    skipSettingLocaleOnNavigate: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "language",
      redirectOn: "root",
      alwaysRedirect: true,
    },
    // customRoutes: "config",
    // pages: {
    //   setting: {
    //     en: "/setting",
    //   },
    // },
  },
  colorMode: {
    preference: "light", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storage: "cookie", // or 'sessionStorage' or 'cookie' or 'localStorage'
    storageKey: "color-mode",
  },
});
