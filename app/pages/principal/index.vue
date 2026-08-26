<template>
  <div class="principal-page">
    <section class="hero bg-gradient-to-r from-orange-500 to-orange-600 py-16 lg:py-24">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px] text-center">
        <h1 class="text-3xl lg:text-4xl font-bold text-white mb-4">
          {{ $t("page.principal.title") }}
        </h1>
        <p class="text-white/90 text-lg max-w-2xl mx-auto">
          {{ $t("page.principal.subtitle") }}
        </p>
      </div>
    </section>

    <section class="py-12 lg:py-16">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <div
            class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all"
          >
            <div
              class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6"
            >
              <Icon name="material-symbols:business" class="text-3xl text-orange-500" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">
              {{ $t("page.principal.principal") }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ $t("page.principal.principalDesc") }}
            </p>
            <Trulink
              :to="`${urlTrumecs}/principal/form`"
              class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {{ $t("page.principal.register") }}
              <Icon name="material-symbols:arrow-forward" />
            </Trulink>
          </div>

          <div
            class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all"
          >
            <div
              class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6"
            >
              <Icon name="material-symbols:handshake" class="text-3xl text-blue-500" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">
              {{ $t("page.principal.agent") }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ $t("page.principal.agentDesc") }}
            </p>
            <Trulink
              :to="`${urlTrumecs}/principal/partnership`"
              class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {{ $t("page.principal.register") }}
              <Icon name="material-symbols:arrow-forward" />
            </Trulink>
          </div>
        </div>

        <div class="text-center mb-12">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
            {{ $t("page.principal.benefits.title") }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="material-symbols:public" class="text-3xl text-green-500" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">
              {{ $t("page.principal.benefits.market") }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ $t("page.principal.benefits.marketDesc") }}
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="material-symbols:support-agent" class="text-3xl text-purple-500" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">
              {{ $t("page.principal.benefits.support") }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ $t("page.principal.benefits.supportDesc") }}
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="material-symbols:trending-up" class="text-3xl text-orange-500" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">
              {{ $t("page.principal.benefits.growth") }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ $t("page.principal.benefits.growthDesc") }}
            </p>
          </div>
        </div>

        <div
          class="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center"
        >
          <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4">
            {{ $t("page.principal.title") }}
          </h2>
          <p class="text-white/90 mb-6 max-w-xl mx-auto">
            {{ $t("page.principal.subtitle") }}
          </p>
          <Trulink
            :to="`${urlTrumecs}/principal/form`"
            class="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors"
          >
            {{ $t("page.principal.register") }}
            <Icon name="material-symbols:arrow-forward" />
          </Trulink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const urlTrumecs = config.public.info.linkTrumecsPhp;

useHead({
  title: "Principal & Partner",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    { name: "description", content: "Bergabunglah menjadi partner resmi Trumecs. Daftarkan produk Anda dan jangkau ribuan pembeli potensial." },
    { property: "og:title", content: "Principal & Partner | Trumecs.com" },
    { property: "og:description", content: "Bergabunglah menjadi partner resmi Trumecs. Daftarkan produk Anda dan jangkau ribuan pembeli potensial." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  link: [{ rel: "canonical", href: "https://www.trumecs.com/principal" }],
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { position: 1, name: "Home", item: "https://www.trumecs.com" },
      { position: 2, name: "Principal & Partner", item: "https://www.trumecs.com/principal" },
    ],
  }),
]);
</script>
