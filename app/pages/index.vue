<template>
  <div class="homepage">
    <section class="hero-section relative overflow-hidden">
      <div class="relative">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="w-full flex-shrink-0"
            >
              <div
                class="relative h-[200px] sm:h-[300px] lg:h-[400px] bg-gradient-to-r from-orange-500 to-orange-600 flex items-center"
              >
                <div
                  class="absolute inset-0 bg-cover bg-center opacity-30"
                  :style="{ backgroundImage: `url(${slide.image})` }"
                />
                <div
                  class="relative z-10 container mx-auto px-4 lg:px-8 max-w-[1280px]"
                >
                  <div class="max-w-lg">
                    <h1
                      class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3"
                    >
                      {{ slide.title }}
                    </h1>
                    <p class="text-white/90 text-sm sm:text-base mb-4">
                      {{ slide.subtitle }}
                    </p>
                    <Trubutton
                      :text="slide.cta"
                      type="primary"
                      size="medium"
                      variant="solid"
                      icon="mdi:arrow-right"
                      @click="navigateTo(slide.link)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="prevSlide"
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
        >
          <Icon
            name="material-symbols:chevron-left"
            class="text-gray-700 text-xl"
          />
        </button>
        <button
          @click="nextSlide"
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
        >
          <Icon
            name="material-symbols:chevron-right"
            class="text-gray-700 text-xl"
          />
        </button>

        <div
          class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        >
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="currentSlide = index"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentSlide === index ? 'bg-white w-6' : 'bg-white/50'"
          />
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="text-center mb-6 lg:mb-8">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
            {{ $t("page.home.categories.title") }}
          </h2>
          <p class="text-gray-500 text-sm lg:text-base mt-1">
            {{ $t("page.home.categories.subtitle") }}
          </p>
        </div>

        <div
          v-if="loadingCategories"
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-xl" />
            <div class="h-3 bg-gray-200 rounded mt-2 w-3/4 mx-auto" />
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          <Trulink
            v-for="category in categories"
            :key="category.id"
            :href="`category/${category.id}`"
            class="group"
          >
            <div
              class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 border border-orange-100"
            >
              <img
                v-if="category.img"
                :src="`${config.public.baseCat}/../public/upload/categori/${category.img}`"
                :alt="category.name"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="handleImageError"
              />
              <Icon
                v-else
                name="material-symbols:category"
                class="text-3xl lg:text-4xl text-orange-400"
              />
            </div>
            <p
              class="text-center text-xs sm:text-sm font-medium text-gray-700 mt-2 group-hover:text-orange-500 transition-colors line-clamp-2"
            >
              {{ category.name }}
            </p>
          </Trulink>
        </div>
      </div>
    </section>

    <section
      v-if="promos.length > 0"
      class="py-8 lg:py-12 bg-gradient-to-br from-orange-50 to-white"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.promo.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.promo.subtitle") }}
            </p>
          </div>
          <Trulink
            :href="`${urlTrumecs}/promo`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <Trulink
            v-for="promo in promos.slice(0, 3)"
            :key="promo.id"
            :href="`${urlTrumecs}/promo/${promo.url}`"
            class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div class="relative h-40 sm:h-48 overflow-hidden">
              <img
                v-if="promo.img"
                :src="`${config.public.baseImagePromo}${promo.img}`"
                :alt="promo.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:local-offer"
                  class="text-5xl text-white/80"
                />
              </div>
              <div
                class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("label.promo") }}
              </div>
              <div
                v-if="isPromoEnded(promo.end_date)"
                class="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("page.promo.ended") }}
              </div>
            </div>
            <div class="p-4">
              <h3
                class="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1"
              >
                {{ promo.name }}
              </h3>
              <p
                class="text-sm text-gray-500 mt-1 line-clamp-2"
                v-html="stripHtml(promo.description)"
              />
              <div class="flex items-center justify-between mt-3">
                <span class="text-xs text-gray-400">
                  {{ $t("page.promo.activeUntil") }}
                  {{ formatDate(promo.end_date) }}
                </span>
                <span
                  v-if="promo.product && promo.product.length > 0"
                  class="text-xs text-orange-500 font-medium"
                >
                  {{ promo.product.length }} {{ $t("page.promo.items") }}
                </span>
              </div>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.featured.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.featured.subtitle") }}
            </p>
          </div>
        </div>

        <div
          v-if="loadingProducts"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div class="aspect-square bg-gray-200" />
            <div class="p-3 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-full" />
              <div class="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <section
      v-for="(section, sIndex) in categoryShowcases"
      :key="sIndex"
      class="py-8 lg:py-12"
      :class="sIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
            {{ section.title }}
          </h2>
          <Trulink
            :href="`${config.public.baseCat}/${section.url}`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
        >
          <Trulink
            v-for="sub in section.subcategories"
            :key="sub.id"
            :href="`${config.public.baseCat}/${section.url}/${sub.url}`"
            class="group bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all"
          >
            <div
              class="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors"
            >
              <Icon
                name="material-symbols:inventory-2"
                class="text-xl lg:text-2xl text-orange-500"
              />
            </div>
            <p
              class="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors line-clamp-2"
            >
              {{ sub.name }}
            </p>
          </Trulink>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.articles.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.articles.subtitle") }}
            </p>
          </div>
          <Trulink
            to="/article"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div
          v-if="loadingArticles"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div class="aspect-video bg-gray-200" />
            <div class="p-4 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-1/4" />
              <div class="h-4 bg-gray-200 rounded w-full" />
              <div class="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <Trulink
            v-for="article in latestArticles"
            :key="article.id"
            :to="`/article/${article.url}`"
            class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div class="aspect-video overflow-hidden">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span
                  v-if="article.category"
                  class="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded"
                >
                  {{ article.category }}
                </span>
                <span class="text-xs text-gray-400">{{
                  formatDate(article.date)
                }}</span>
              </div>
              <h3
                class="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2"
              >
                {{ article.title }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2">
                {{ article.excerpt }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section
      class="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-orange-600"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px] text-center">
        <h2 class="text-2xl lg:text-3xl font-bold text-white mb-3">
          {{ $t("page.home.cta.title") }}
        </h2>
        <p class="text-white/90 text-sm lg:text-base mb-6 max-w-xl mx-auto">
          {{ $t("page.home.cta.subtitle") }}
        </p>
        <Trubutton
          :text="$t('page.home.cta.button')"
          type="primary"
          size="large"
          variant="solid"
          icon="mdi:email"
          class="bg-white text-orange-500 hover:bg-gray-100 border-white"
          @click="navigateTo(`${urlTrumecs}/bulk`)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Product } from "~/types/product";
import type { Promo } from "~/types/promo";
import type { CardArticle } from "~/types/article";

const config = useRuntimeConfig();
const urlTrumecs = config.public.info.linkTrumecsPhp;
const siteUrl = (config.public.siteUrl as string) || "https://www.trumecs.com";

usePageSeo({
  title: "Trumecs.com",
  description:
    "Temukan kebutuhan mekanikal Anda dari ribuan produk berkualitas. Sparepart, pelumas, ban, alat berat, dan peralatan kerja.",
  url: "/",
});

useSchemaOrg([
  defineOrganization({
    name: "Trumecs",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/trumecs",
      "https://www.instagram.com/trumecs",
      "https://www.facebook.com/trumecsid",
      "https://www.youtube.com/@trumecs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-851-7691-2338",
      contactType: "sales",
      availableLanguage: ["Indonesian", "English"],
    },
  }),
  defineWebSite({
    name: "Trumecs.com",
    url: siteUrl,
  }),
]);

const currentSlide = ref(0);
const slides = ref([
  {
    title: "Sparepart & Komponen",
    subtitle: "Ribuan sparepart berkualitas untuk kebutuhan industri Anda",
    cta: "Jelajahi Produk",
    link: `${config.public.baseCat}/sparepart`,
    image: "",
  },
  {
    title: "Promo Terbaru",
    subtitle: "Jangan lewatkan penawaran menarik dari Trumecs",
    cta: "Lihat Promo",
    link: `${urlTrumecs}/promo`,
    image: "",
  },
  {
    title: "Solusi Pengadaan Mekanikal",
    subtitle: "Hubungi kami untuk kebutuhan pengadaan skala besar",
    cta: "Kirim RFQ",
    link: `${urlTrumecs}/bulk`,
    image: "",
  },
]);

// SSR data fetching
const { data: categoriesData, pending: loadingCategories } = await useAsyncData(
  "home-categories",
  () => useFetchApi<any>("category-read", "home-categories", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const { data: promosData, pending: loadingPromos } = await useAsyncData(
  "home-promos",
  () => useFetchApi<any>("promo-read", "home-promos", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const { data: productsData, pending: loadingProducts } = await useAsyncData(
  "home-products",
  () =>
    useFetchApi<any>(
      "product-read?page=1&limit=8",
      "home-products",
      "get",
      null
    ),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const { data: articlesData, pending: loadingArticles } = await useAsyncData(
  "home-articles",
  () =>
    useFetchApi<any>(
      "article-read?page=1&limit=6",
      "home-articles",
      "get",
      null
    ),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const categories = computed(() => {
  const d = categoriesData.value;
  if (!d || d.status !== "success") return [];
  return d.data?.payload?.category?.products?.slice(0, 12) || [];
});

const promos = computed(() => {
  const d = promosData.value;
  if (!d || d.status !== "success") return [];
  return d.data?.payload || [];
});

const featuredProducts = computed(() => {
  const d = productsData.value;
  if (!d || d.status !== "success") return [];
  return d.data?.payload || [];
});

const latestArticles = computed(() => {
  const d = articlesData.value;
  if (!d || d.status !== "success") return [];
  const articles = d.data?.payload?.list_article || [];
  return articles.map((item: any) => ({
    id: item.id,
    url: item.url || `article-${item.id}`,
    title: item.title || "Untitled",
    image: item.img
      ? `${config.public.baseImageArticle}${item.img}`
      : "https://via.placeholder.com/400x250?text=No+Image",
    category: Array.isArray(item.tag) ? item.tag[0] : item.tag || "General",
    date: item.date,
    excerpt: item.discription_seo
      ? item.discription_seo.substring(0, 120)
      : item.value
        ? item.value.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
        : "",
  }));
});

const categoryShowcases = ref([
  {
    title: "Pelumas",
    url: "pelumas",
    subcategories: [
      { id: 1, name: "Grease", url: "grease" },
      { id: 2, name: "Hydraulic Oil", url: "hydraulic-oil" },
      { id: 3, name: "Engine Oil", url: "engine-oil" },
      { id: 4, name: "Gear Oil", url: "gear-oil" },
      { id: 5, name: "Compressor Oil", url: "compressor-oil" },
    ],
  },
  {
    title: "Ban",
    url: "ban",
    subcategories: [
      { id: 6, name: "Ban Alat Berat", url: "ban-alat-berat" },
      { id: 7, name: "Ban Truck", url: "ban-truck" },
      { id: 8, name: "Ban Forklift", url: "ban-forklift" },
      { id: 9, name: "Inner Tube", url: "inner-tube" },
      { id: 10, name: "Flap", url: "flap" },
    ],
  },
  {
    title: "Sparepart",
    url: "sparepart",
    subcategories: [
      { id: 11, name: "Filter", url: "filter" },
      { id: 12, name: "Bearing", url: "bearing" },
      { id: 13, name: "Seal", url: "seal" },
      { id: 14, name: "Belt", url: "belt" },
      { id: 15, name: "Hose", url: "hose" },
    ],
  },
  {
    title: "Unit",
    url: "unit",
    subcategories: [
      { id: 16, name: "Alat Berat", url: "alat-berat" },
      { id: 17, name: "Truck", url: "truck" },
      { id: 18, name: "Forklift", url: "forklift" },
      { id: 19, name: "Crane", url: "crane" },
      { id: 20, name: "Excavator", url: "excavator" },
    ],
  },
  {
    title: "Tools & Peralatan",
    url: "tools",
    subcategories: [
      { id: 21, name: "Hand Tools", url: "hand-tools" },
      { id: 22, name: "Power Tools", url: "power-tools" },
      { id: 23, name: "Safety Equipment", url: "safety-equipment" },
    ],
  },
]);

let slideInterval: ReturnType<typeof setInterval>;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const isPromoEnded = (endDate: string) => {
  return new Date(endDate) < new Date();
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const stripHtml = (html: string | null) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").substring(0, 150);
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
