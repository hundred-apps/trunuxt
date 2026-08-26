<template>
  <div class="category-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div class="lg:col-span-3">
          <div class="lg:sticky lg:top-[var(--header-height,150px)]" style="--header-height: 150px;">
            <ProductFilterSidebar
              :filters="filters"
              :brands="availableBrands"
              @update:filters="updateFilters"
              @apply="applyFilters"
              @reset="resetFilters"
            />
          </div>
        </div>

        <div class="lg:col-span-9">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-800">
                {{ pageTitle }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                {{
                  $t("page.category.showing", {
                    from: pagination.from,
                    to: pagination.to,
                    total: pagination.total,
                  })
                }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <el-select
                v-model="sortBy"
                size="small"
                class="w-40"
                @change="applyFilters"
              >
                <el-option
                  :label="$t('page.category.sort.default')"
                  value="default"
                />
                <el-option
                  :label="$t('page.category.sort.priceLow')"
                  value="price_asc"
                />
                <el-option
                  :label="$t('page.category.sort.priceHigh')"
                  value="price_desc"
                />
                <el-option
                  :label="$t('page.category.sort.newest')"
                  value="newest"
                />
              </el-select>

              <div
                class="hidden sm:flex items-center border rounded-lg overflow-hidden"
              >
                <button
                  @click="viewMode = 'grid'"
                  class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                  :class="
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  "
                >
                  <Icon name="material-symbols:grid-view" class="text-lg" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                  :class="
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  "
                >
                  <Icon name="material-symbols:view-list" class="text-lg" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="grid gap-4" :class="gridClass">
            <div
              v-for="i in 12"
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
            v-else-if="products.length === 0"
            class="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <Icon
              name="material-symbols:inventory-2"
              class="text-6xl text-gray-300 mb-4"
            />
            <h3 class="text-lg font-medium text-gray-600 mb-2">
              {{ $t("page.category.empty") }}
            </h3>
            <p class="text-sm text-gray-400">
              {{ $t("label.noResults") }}
            </p>
          </div>

          <div v-else>
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
            >
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="product in products"
                :key="product.id"
                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <Trulink
                  :to="`/produk/${product.id}/${formatSlug(product.tittle)}`"
                  class="flex"
                >
                  <div
                    class="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-50"
                  >
                    <img
                      :src="getProductImage(product.img)"
                      :alt="product.tittle"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex-1 p-4">
                    <p
                      v-if="
                        product.brand && product.brand.toLowerCase() !== 'other'
                      "
                      class="text-xs text-orange-500 font-semibold mb-1"
                    >
                      {{ product.brand }}
                    </p>
                    <h3 class="font-medium text-gray-800 line-clamp-1 mb-1">
                      {{ product.tittle }}
                    </h3>
                    <p class="text-sm text-gray-500 line-clamp-2 mb-2">
                      {{ product.description?.substring(0, 100) }}
                    </p>
                    <div class="flex items-center gap-4">
                      <div v-if="Number(product.price) > 0">
                        <p
                          v-if="Number(product.price_promo) > 0"
                          class="text-xs text-gray-400 line-through"
                        >
                          {{ formatPrice(Number(product.price)) }}
                        </p>
                        <p class="text-sm font-bold text-orange-600">
                          {{
                            formatPrice(
                              Number(product.price_promo) > 0
                                ? Number(product.price_promo)
                                : Number(product.price)
                            )
                          }}
                        </p>
                      </div>
                      <span
                        v-if="product.stock > 0"
                        class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded"
                      >
                        {{ $t("page.product.text.stock") }}: {{ product.stock }}
                      </span>
                    </div>
                  </div>
                </Trulink>
              </div>
            </div>

            <div class="flex justify-center mt-8">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="pagination.total"
                :page-size="perPage"
                v-model:current-page="currentPage"
                @update:current-page="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defineBreadcrumb, useSchemaOrg } from "@unhead/schema-org/vue";
import { useI18n } from "vue-i18n";
import { useHeaderHeight } from "~/composables/useHeaderHeight";

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const { t: $t } = useI18n();

interface ProductItem {
  id: number;
  tittle: string;
  partnumber: string;
  physicnumber: string;
  quality: string;
  stock: number;
  moq: number;
  price: string;
  price_promo: string;
  price_bigsale: string;
  img: string;
  promo: string;
  categori: string;
  jenisproduct: string;
  partnumber_trumecs: string;
  price_old: number;
  made: string;
  warranty: string;
  unit: string;
  warrantyvendor: string;
  livetime: string;
  dimention: string;
  packagin: string;
  weight: string;
  description: string;
  view: number;
  sx: number;
  sy: number;
  sz: number;
  px: number;
  py: number;
  pz: number;
  brand: string;
  type: number;
  component: number;
  status: string;
  availability_at: string;
  estimated_delivery: string;
  estimated_deliveryindent: number;
  ppn: string;
  link_tokped: string;
  link_bukalapak: string;
  link_shopee: string;
  link_blibli: string;
  area: string | null;
  youtube: string;
  brand_unit: number | null;
  created_by: number;
  tittle_en: string;
  warranty_en: string;
  unit_en: string;
  warrantyvendor_en: string;
  livetime_en: string;
  packagin_en: string;
  description_en: string;
  tittle_ch: string;
  warranty_ch: string;
  unit_ch: string;
  warrantyvendor_ch: string;
  livetime_ch: string;
  packagin_ch: string;
  description_ch: string;
  promo_cbd_price: string;
  promo_volume: number;
  promo_volume_price: string;
  promo_referral_price: string;
  store_id: string;
  is_sell: number;
  is_rent: number;
  rent_description: string | null;
  operator_option: number | null;
  fuel_option: number | null;
  rent_description_en: string | null;
  rent_description_ch: string | null;
  rent_time_unit: number | null;
  hour_meter: number | null;
  minimum_rent: number | null;
  operator_price: number | null;
  rent_price: string | null;
  is_service: number;
  file: string;
  sku_number: string | null;
  price_description: string | null;
  last_medical: string | null;
  last_education: string | null;
  _score: number;
  specs: Array<{ name: string; value: string }>;
  store: any;
}

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const loading = ref(true);
const products = ref<ProductItem[]>([]);
const availableBrands = ref<any[]>([]);
const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("default");
const currentPage = ref(1);
const perPage = ref(20);

const filters = ref({
  search: "",
  brand: "",
  grade: "",
  minPrice: "",
  maxPrice: "",
});

const pagination = ref({
  total: 0,
  from: 0,
  to: 0,
});

const slugSegments = computed(() => {
  const slug = route.params.slug;
  if (Array.isArray(slug)) return slug;
  if (typeof slug === "string") return slug.split("/").filter(Boolean);
  return [];
});

// Mode pencarian global: /c/all/query?q=on&nama=keyword (pola CI3)
const isSearchAll = computed(() => {
  const segs = slugSegments.value.map((s) => s.toLowerCase());
  return segs.length > 0 && segs[0] === "all";
});

const searchKeyword = computed(() => (route.query.nama as string) || "");

const pageTitle = computed(() => {
  if (isSearchAll.value) {
    return searchKeyword.value
      ? $t("page.category.searchResult", { keyword: searchKeyword.value })
      : $t("label.allProducts");
  }
  if (slugSegments.value.length === 0) {
    return $t("label.allProducts");
  }
  return slugSegments.value
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "))
    .join(" > ");
});

const breadcrumbs = computed(() => {
  const items: { text: string; to: string }[] = [
    { text: $t("breadcrumb.home"), to: "/" },
  ];

  if (isSearchAll.value) {
    items.push({
      text: searchKeyword.value || $t("label.allProducts"),
      to: route.fullPath,
    });
    return items;
  }

  let path = "";
  slugSegments.value.forEach((segment, index) => {
    path += (index > 0 ? "/" : "") + segment;
    items.push({
      text:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      to: `/c/${path}`,
    });
  });

  return items;
});

const gridClass = computed(() => {
  if (viewMode.value === "grid") {
    return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
  }
  return "";
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatSlug = (text: string | null) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const getProductImage = (img: string) => {
  if (img) return `${config.public.baseImageProduct}${img}`;
  return "https://via.placeholder.com/300x300?text=No+Image";
};

const updateFilters = (newFilters: any) => {
  filters.value = newFilters;
};

const buildQueryFromFilters = () => {
  const query: Record<string, any> = {};
  if (filters.value.search) {
    query.q = "on";
    query.nama = filters.value.search;
  }
  if (filters.value.brand) query.brand = filters.value.brand;
  if (filters.value.grade) query.quality = filters.value.grade;
  if (filters.value.minPrice) query.minp = filters.value.minPrice;
  if (filters.value.maxPrice) query.maxp = filters.value.maxPrice;
  if (currentPage.value > 1) query.page = currentPage.value;
  return query;
};

const syncFiltersFromRoute = () => {
  filters.value.search = (route.query.nama as string) || "";
  filters.value.brand = (route.query.brand as string) || "";
  filters.value.grade = (route.query.quality as string) || "";
  filters.value.minPrice = (route.query.minp as string) || "";
  filters.value.maxPrice = (route.query.maxp as string) || "";
  currentPage.value = parseInt(route.query.page as string) || 1;
};

const applyFilters = () => {
  currentPage.value = 1;
  const query = buildQueryFromFilters();
  if (JSON.stringify(query) !== JSON.stringify(route.query)) {
    router.replace({ query });
  } else {
    fetchProducts();
  }
};

const resetFilters = () => {
  filters.value = {
    search: "",
    brand: "",
    grade: "",
    minPrice: "",
    maxPrice: "",
  };
  sortBy.value = "default";
  currentPage.value = 1;
  const hasQuery = Object.keys(route.query).length > 0;
  if (hasQuery) {
    router.replace({ query: {} });
  } else {
    fetchProducts();
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  router.replace({ query: buildQueryFromFilters() });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const slug = slugSegments.value.join("/");

    const body: Record<string, any> = {
      page: currentPage.value,
      limit: perPage.value,
    };

    if (!isSearchAll.value && slug) body.slug = slug;
    if (filters.value.search) body.keyword = filters.value.search;
    if (filters.value.brand) body.brand = filters.value.brand;
    if (filters.value.grade) body.quality = filters.value.grade;
    if (filters.value.minPrice) body.minp = filters.value.minPrice;
    if (filters.value.maxPrice) body.maxp = filters.value.maxPrice;
    if (sortBy.value !== "default") body.sort = sortBy.value;

    const response = await useFetchApi<BaseResponse<ProductItem[]>>(
      "product-search",
      `category-${slug}-${currentPage.value}`,
      "post",
      body
    );

    if (response.status === "success" && response.data) {
      products.value = response.data.payload || [];
      const totalItems = response.data.meta?.total || products.value.length;
      pagination.value = {
        total: totalItems,
        from: (currentPage.value - 1) * perPage.value + 1,
        to: Math.min(currentPage.value * perPage.value, totalItems),
      };
    }
  } catch (e) {
    console.error("Error fetching products:", e);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

useHead({
  title: computed(() => pageTitle.value),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    {
      name: "description",
      content: `Jelajahi produk ${pageTitle.value} di Trumecs. Temukan sparepart, pelumas, dan kebutuhan industri berkualitas.`,
    },
    { property: "og:title", content: `${pageTitle.value} | Trumecs.com` },
    {
      property: "og:description",
      content: `Jelajahi produk ${pageTitle.value} di Trumecs.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    {
      name: "robots",
      content: isSearchAll.value ? "noindex, follow" : "index, follow",
    },
    { name: "twitter:card", content: "summary" },
  ]),
  link: computed(() => [
    {
      rel: "canonical",
      href: isSearchAll.value
        ? `https://www.trumecs.com/c/all/query`
        : `https://www.trumecs.com/c/${slugSegments.value.join("/")}`,
    },
  ]),
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((item, index) => ({
      position: index + 1,
      name: item.text,
      item: `https://www.trumecs.com${item.to}`,
    })),
  }),
]);

// SSR: fetch produk saat render server (top-level await), client lanjut via watcher
syncFiltersFromRoute();
await fetchProducts();

onMounted(() => {
  updateHeaderHeight();
});

watch(
  () => [route.params.slug, route.query],
  () => {
    syncFiltersFromRoute();
    currentPage.value = 1;
    fetchProducts();
  }
);
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

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #fa8420;
}
</style>
