// https://nuxt.com/docs/api/configuration/nuxt-config

const i18nDomains = ["trumecs.com", "en.trumecs.com", "zh.trumecs.com"];
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      htmlAttrs: { lang: "id" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Trumecs.com | Solusi Pengadaan Mekanikal Terpercaya",
      meta: [
        { name: "theme-color", content: "#fa8420" },
        { name: "application-name", content: "Trumecs" },
        {
          name: "description",
          content:
            "Solusi pengadaan mekanikal terpercaya. Sparepart, pelumas, ban, alat berat, dan peralatan kerja berkualitas dari ribuan merek ternama.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Trumecs.com" },
        { property: "og:locale", content: "id_ID" },
        { property: "og:locale:alternate", content: "en_US" },
        { property: "og:locale:alternate", content: "zh_CN" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://www.trumecs.com" },
      ],
    },
    baseURL: "/",
    cdnURL: "/",
  },
  site: {
    url: "https://www.trumecs.com",
    name: "Trumecs.com",
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_API_URL,
      baseImageArticle: process.env.NUXT_API_BASEIMGARTICLE,
      baseImageProduct: "https://www.trumecs.com/public/image/product/",
      baseImageGallery: "https://www.trumecs.com/public/image/galery/",
      baseImagePromo: "https://www.trumecs.com/public/image/promo/",
      baseCat: process.env.NUXT_API_CATC,
      googleTagId: process.env.NUXT_PUBLIC_GTAG_ID,
      siteUrl: "https://www.trumecs.com",
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
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/device",
    "@element-plus/nuxt",
    "nuxt-schema-org",
    "nuxt-gtag",
  ],

  css: [
    "element-plus/theme-chalk/dark/css-vars.css",
    "~/assets/css/article.css", // pakai ~ bukan ./
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
  robots: {
    allow: ["/"],
    disallow: ["/profile", "/api/"],
    sitemap: "https://www.trumecs.com/sitemap.xml",
  },

  ogImage: { enabled: false },

  nitro: {
    preset: "node-server",
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