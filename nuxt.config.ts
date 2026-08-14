// https://nuxt.com/docs/api/configuration/nuxt-config

const i18nDomains = ["trumecs.com", "en.trumecs.com", "zh.trumecs.com"];
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {},
    baseURL: "/",
    cdnURL: "/",
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_API_URL,
      baseImageArticle: process.env.NUXT_API_BASEIMGARTICLE,
      baseCat: process.env.NUXT_API_CATC,
      googleTagId: process.env.NUXT_PUBLIC_GTAG_ID,
      info: {
        phone: "6285176912338",
        email: "info@trumecs.com",
        address:
          "No. B, Jl. Pintu Air Raya No.31, RT.13/RW.8, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10710",
        maps: "https://maps.app.goo.gl/XF8berfSdGwtQ4qv9",
        linkTrumecsPhp: "https://www.trumecs.com",
      },
      sosmed: {
        linkedIn: "https://www.linkedin.com/company/trumecs",
        instagram: "https://www.instagram.com/trumecs",
        facebook: "https://www.facebook.com/trumecsid",
        twitter: "https://twitter.com/trumecs",
        youtube: "https://www.youtube.com/@trumecs",
      },
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
    "nuxt-gtag",
  ],

  css: [
    "element-plus/theme-chalk/dark/css-vars.css",
    "~/assets/css/article.css", // pakai ~ bukan ./
    "flag-icons/css/flag-icons.min.css",
  ],
  // Auto import components
  components: true,

  elementPlus: {},
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
    loadingStrategy: "async",
  },

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
    // locales: [
    //   {
    //     code: "id",
    //     iso: "id-ID",
    //     file: "id.json",
    //     name: "Bahasa Indonesia",
    //   },
    //   { code: "en", iso: "en-US", file: "en.json", name: "English" },
    //   {
    //     code: "zh",
    //     iso: "zh-CN",
    //     file: "zh.json",
    //     name: "中文",
    //   },
    // ],
    locales: [
      {
        code: "id",
        domains: i18nDomains,
        defaultForDomains: ["trumecs.com"],
        iso: "id-ID",
        name: "Bahasa Indonesia",
        file: "id.json",
      },
      {
        code: "en",
        domains: i18nDomains,
        defaultForDomains: ["en.trumecs.com"],
        iso: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "zh",
        domains: i18nDomains,
        defaultForDomains: ["zh.trumecs.com"],
        iso: "zh-CN",
        name: "中文",
        file: "zh.json",
      },
    ],
    multiDomainLocales: true,
    // strategy: "prefix_except_default",
    strategy: "no_prefix",
    // lazy: true,
    langDir: "locales/",
    defaultLocale: "id",
    skipSettingLocaleOnNavigate: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "language",
      redirectOn: "root",
      alwaysRedirect: true,
      cookieDomain: isProd ? ".trumecs.com" : undefined,
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
