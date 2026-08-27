<template>
  <div class="promo-detail-page py-4 lg:py-8">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <div v-if="loading" class="text-center py-16">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"
        />
        <p class="mt-4 text-gray-500">{{ $t("label.loading") }}</p>
      </div>

      <div
        v-else-if="!promo"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <Icon
          name="material-symbols:local-offer"
          class="text-6xl text-gray-300 mb-4"
        />
        <h2 class="text-xl font-bold text-gray-700 mb-2">
          {{ $t("page.promo.empty") }}
        </h2>
        <Trulink to="/promo" class="text-orange-500 hover:underline">
          {{ $t("button.seeAll") }} {{ $t("label.promo") }}
        </Trulink>
      </div>

      <template v-else>
        <Breadcrumbs :items="breadcrumbs" class="mb-4" />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div class="lg:col-span-8">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                <img
                  v-if="promo.img"
                  :src="`${config.public.baseImagePromo}${promo.img}`"
                  :alt="promo.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:local-offer"
                    class="text-8xl text-white/80"
                  />
                </div>

                <div class="absolute top-4 left-4 flex gap-2">
                  <span
                    class="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg"
                  >
                    {{ $t("label.promo") }}
                  </span>
                  <span
                    v-if="promo.type === 'bundle'"
                    class="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-lg"
                  >
                    Bundle
                  </span>
                </div>
              </div>

              <div class="p-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-3">
                  {{ promo.name }}
                </h1>

                <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span class="flex items-center gap-1">
                    <Icon
                      name="material-symbols:calendar-today"
                      class="text-sm"
                    />
                    {{ $t("page.promo.activeUntil") }}
                    {{ formatDate(promo.end_date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="material-symbols:visibility" class="text-sm" />
                    {{ promo.view || 0 }} {{ $t("page.product.text.views") }}
                  </span>
                </div>

                <div
                  v-if="promo.description"
                  class="prose prose-sm max-w-none text-gray-600"
                  v-html="promo.description"
                />
              </div>
            </div>

            <div v-if="promoProducts.length > 0" class="mt-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">
                {{ $t("label.products") }}
              </h2>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
              >
                <ProductCard
                  v-for="product in promoProducts"
                  :key="product.id"
                  :product="product"
                />
              </div>
            </div>
          </div>

          <div class="lg:col-span-4">
            <div
              class="lg:sticky lg:top-[var(--header-height,150px)] space-y-4"
              style="--header-height: 150px"
            >
              <div
                class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h3 class="font-bold text-gray-800 mb-3">{{ promo.name }}</h3>

                <div v-if="promo.type === 'bundle' && promo.price" class="mb-4">
                  <p class="text-sm text-gray-500">
                    {{ $t("page.promo.bundlePrice") }}
                  </p>
                  <p class="text-2xl font-bold text-orange-600">
                    {{ formatPrice(Number(promo.price)) }}
                  </p>
                </div>

                <div class="space-y-2 text-sm mb-4">
                  <div class="flex justify-between">
                    <span class="text-gray-500">{{
                      $t("page.promo.activeUntil")
                    }}</span>
                    <span class="font-medium text-gray-700">{{
                      formatDate(promo.end_date)
                    }}</span>
                  </div>
                  <div v-if="promo.products" class="flex justify-between">
                    <span class="text-gray-500">{{
                      $t("label.products")
                    }}</span>
                    <span class="font-medium text-gray-700">
                      {{ promo.products.length }} {{ $t("page.promo.items") }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="isPromoEnded(promo.end_date)"
                  class="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg text-center mb-4"
                >
                  {{ $t("page.promo.ended") }}
                </div>

                <Trubutton
                  v-if="!isPromoEnded(promo.end_date)"
                  :text="$t('label.writeToUs')"
                  type="primary"
                  size="medium"
                  variant="solid"
                  icon="logos:whatsapp-icon"
                  full-width
                  class="mb-3"
                  @click="handleContact"
                />

                <div class="border-t pt-4 mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">
                    {{ $t("label.followOurSocial") }}
                  </p>
                  <div class="flex gap-3">
                    <Trulink
                      v-for="social in socialLinks"
                      :key="social.name"
                      :href="social.url"
                      target="_blank"
                      class="min-w-[44px] min-h-[44px] bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      <Icon :name="social.icon" class="text-lg" />
                    </Trulink>
                  </div>
                </div>
              </div>

              <div
                class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h3 class="font-bold text-gray-800 mb-3">
                  {{ $t("label.writeToUs") }}
                </h3>
                <p class="text-sm text-gray-500 mb-3">
                  {{ $t("page.home.cta.subtitle") }}
                </p>
                <Trubutton
                  :text="$t('page.product.button.buy')"
                  type="primary"
                  size="medium"
                  variant="solid"
                  icon="logos:whatsapp-icon"
                  full-width
                  @click="handleContact"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import type { Promo, PromoProduct } from "~/types/promo";
import { useHeaderHeight } from "~/composables/useHeaderHeight";

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const route = useRoute();
const config = useRuntimeConfig();

const loading = ref(true);
const promo = ref<Promo | null>(null);

const slug = computed(() => route.params.slug as string);

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("page.promo.title"), to: "/promo" },
  { text: promo.value?.name || "", to: "" },
]);

const promoProducts = computed((): PromoProduct[] => {
  if (!promo.value?.products) return [];
  return promo.value.products;
});

const isPromoEnded = (endDate: string) => {
  return new Date(endDate) < new Date();
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const socialLinks = computed(() => [
  {
    name: "linkedin",
    icon: "mdi:linkedin",
    url: config.public.sosmed.linkedIn,
  },
  {
    name: "instagram",
    icon: "mdi:instagram",
    url: config.public.sosmed.instagram,
  },
  {
    name: "facebook",
    icon: "mdi:facebook",
    url: config.public.sosmed.facebook,
  },
]);

const handleContact = () => {
  window.open(
    `https://wa.me/${config.public.info.phone}?text=${encodeURIComponent(
      `Halo, saya tertarik dengan promo "${promo.value?.name}". Bisa info lebih lanjut?`
    )}`,
    "_blank"
  );
};

const fetchPromo = async () => {
  loading.value = true;
  try {
    const response = await useFetchApi<any>(
      `promo-read/${slug.value}`,
      `promo-detail-${slug.value}`,
      "post",
      null
    );
    if (response.status === "success") {
      promo.value = response.data?.payload || null;
    }
  } catch (e) {
    console.error("Error fetching promo:", e);
  } finally {
    loading.value = false;
  }
};

useHead({
  title: computed(() => promo.value?.name || "Promo"),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => {
    const desc = promo.value?.description
      ? promo.value.description.replace(/<[^>]*>/g, "").substring(0, 160)
      : "Promo terbaru dari Trumecs";
    const img = promo.value?.img
      ? `https://www.trumecs.com/public/image/promo/${promo.value.img}`
      : undefined;
    const metas: Record<string, string>[] = [
      { name: "description", content: desc },
      {
        property: "og:title",
        content: `${promo.value?.name || "Promo"} | Trumecs.com`,
      },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Trumecs.com" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (img) {
      metas.push({ property: "og:image", content: img });
      metas.push({ name: "twitter:image", content: img });
    }
    return metas;
  }),
  link: computed(() => [
    { rel: "canonical", href: `https://www.trumecs.com/promo/${slug.value}` },
  ]),
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: computed(() => [
      { position: 1, name: "Home", item: "https://www.trumecs.com" },
      { position: 2, name: "Promo", item: "https://www.trumecs.com/promo" },
      {
        position: 3,
        name: promo.value?.name || "Promo",
        item: `https://www.trumecs.com/promo/${slug.value}`,
      },
    ]),
  }),
]);

onMounted(() => {
  updateHeaderHeight();
  fetchPromo();
});

watch(slug, () => {
  fetchPromo();
});
</script>
