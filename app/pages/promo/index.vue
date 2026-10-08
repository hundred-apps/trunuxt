<template>
  <div class="promo-page py-4">
    <div class="container mx-auto max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" />

      <div class="mb-6 lg:mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">
          {{ $t("page.promo.listTitle") }}
        </h1>
        <p class="text-gray-500 mt-1">{{ $t("page.home.promo.subtitle") }}</p>
      </div>

      <!-- Search -->
      <div class="mb-5">
        <el-input
          v-model="searchQuery"
          clearable
          :placeholder="$t('page.promo.searchPlaceholder')"
          class="max-w-md"
        >
          <template #prefix>
            <Icon name="material-symbols:search" class="text-gray-400" />
          </template>
        </el-input>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div class="h-48 bg-gray-200" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-200 rounded w-full" />
            <div class="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div
        v-else-if="promos.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <Icon
          name="material-symbols:local-offer"
          class="text-6xl text-gray-300 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("page.promo.empty") }}
        </h3>
      </div>

      <div
        v-else-if="filteredPromos.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <Icon
          name="material-symbols:search-off"
          class="text-6xl text-gray-300 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("label.noResults") }}
        </h3>
      </div>

      <template v-else>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
        <Trulink
          v-for="promo in pagedPromos"
          :key="promo.id"
          :to="`/promo/${promo.url}`"
          data-track-card="promo"
          :data-track-id="String(promo.id)"
          :data-track-title="promo.name"
          class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
        >
          <div class="relative h-48 sm:h-56 overflow-hidden">
            <AppImage
              v-if="promo.img"
              :src="`${config.public.baseImagePromo}${promo.img}`"
              :alt="promo.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="100vw sm:50vw lg:33vw"
              width="600"
              height="360"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
            >
              <Icon
                name="material-symbols:local-offer"
                class="text-6xl text-white/80"
              />
            </div>

            <div class="absolute top-3 left-3 flex gap-2">
              <span
                class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("label.promo") }}
              </span>
              <span
                v-if="promo.type === 'bundle'"
                class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("label.bundle") }}
              </span>
            </div>

            <div
              v-if="isPromoEnded(promo.end_date)"
              class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <span
                class="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg"
              >
                {{ $t("page.promo.ended") }}
              </span>
            </div>
          </div>

          <div class="p-4">
            <h3
              class="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1 mb-2"
            >
              {{ promo.name }}
            </h3>
            <p
              class="text-sm text-gray-500 line-clamp-2 mb-3"
              v-html="stripHtml(promo.description)"
            />

            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-gray-400">
                  {{ $t("page.promo.activeUntil") }}
                  {{ formatDate(promo.end_date) }}
                </p>
                <p
                  v-if="promo.type === 'bundle' && promo.price"
                  class="text-sm font-bold text-orange-600 mt-1"
                >
                  {{ $t("page.promo.bundlePrice") }}:
                  {{ formatPrice(Number(promo.price)) }}
                </p>
              </div>
              <span
                v-if="promo.products && promo.products.length > 0"
                class="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded"
              >
                {{ promo.products.length }} {{ $t("page.promo.items") }}
              </span>
            </div>
          </div>
        </Trulink>
        </div>

        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredPromos.length"
            :page-size="perPage"
            v-model:current-page="currentPage"
            @update:current-page="handlePageChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import type { Promo } from "~/types/promo";

useHead({
  title: "Promo",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content:
        "Lihat promo terbaru dari Trumecs. Jangan lewatkan penawaran menarik untuk produk mekanikal berkualitas.",
    },
    { property: "og:title", content: "Promo | Trumecs.com" },
    {
      property: "og:description",
      content:
        "Lihat promo terbaru dari Trumecs. Jangan lewatkan penawaran menarik untuk produk mekanikal berkualitas.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
    { name: "twitter:card", content: "summary" },
  ],
  link: [{ rel: "canonical", href: "https://www.trumecs.com/promo" }],
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { position: 1, name: "Home", item: "https://www.trumecs.com" },
      { position: 2, name: "Promo", item: "https://www.trumecs.com/promo" },
    ],
  }),
]);

const config = useRuntimeConfig();
const loading = ref(true);
const promos = ref<Promo[]>([]);

// Search (filter lokal pada nama & deskripsi promo)
const searchQuery = ref("");
const filteredPromos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return promos.value;
  return promos.value.filter((promo) => {
    const name = `${promo.name} ${promo.name_en} ${promo.name_ch}`.toLowerCase();
    const desc = stripHtml(promo.description).toLowerCase();
    return name.includes(q) || desc.includes(q);
  });
});

// Pagination (slice lokal, semua promo di-fetch sekaligus)
const currentPage = ref(1);
const perPage = 15;
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPromos.value.length / perPage))
);
const pagedPromos = computed(() =>
  filteredPromos.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  )
);

watch(searchQuery, () => {
  currentPage.value = 1;
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("page.promo.title"), to: "/promo" },
]);

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

const stripHtml = (html: string | null) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").substring(0, 150);
};

const fetchPromos = async () => {
  loading.value = true;
  try {
    const response = await useFetchApi<any>(
      "promo-read",
      "promo-list",
      "post",
      null
    );
    console.log("Promo API Response:", response);
    if (response.status === "success") {
      promos.value = response.data?.payload.query || [];
    }
  } catch (e) {
    console.error("Error fetching promos:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPromos();
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
