<template>
  <div class="category-page">
    <div class="container mx-auto max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <!-- Page Header -->
      <div
        class="mb-5 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ pageTitle }}
            </h1>
            <p
              v-if="isSearchAll && searchKeyword"
              class="mt-0.5 text-sm text-gray-400"
            >
              {{
                $t("search.subtitle", {
                  keyword: searchKeyword,
                  total: pagination.total,
                })
              }}
            </p>
            <p v-else class="mt-0.5 text-sm text-gray-400">
              {{
                $t("page.category.showing", {
                  from: pagination.from,
                  to: pagination.to,
                  total: pagination.total,
                })
              }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:inventory-2" class="text-sm" />
              {{
                $t("page.category.productsCount", { count: pagination.total })
              }}
            </span>
            <span
              v-if="availableBrands.length"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:business" class="text-sm" />
              {{ availableBrands.length }} {{ $t("page.category.brands") }}
            </span>
          </div>
        </div>
      </div>

<!-- Mobile Filter Toggle (FAB) -->
<div
          class="lg:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] right-4 z-[60]"
        >
          <button
            type="button"
            class="relative flex items-center gap-2 rounded-full bg-orange-500 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-95"
            :aria-expanded="showFilters"
            @click="showFilters = true"
          >
            <Icon name="material-symbols:tune" class="text-lg" />
            <span>{{ $t("page.category.filter.title") }}</span>
            <span
              v-if="activeFilterCount > 0"
              class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-orange-600"
            >
              {{ activeFilterCount }}
            </span>
          </button>
        </div>

        <!-- Filter Bottom Sheet (mobile) -->
        <Teleport to="body">
          <div
            v-if="showFilters"
            class="lg:hidden fixed inset-0 z-[9999] flex items-end"
          >
            <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="showFilters = false"
            />
            <div
              class="relative w-full max-h-[88dvh] flex flex-col bg-white rounded-t-2xl shadow-2xl"
            >
              <!-- Sheet Header -->
              <div
                class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    name="material-symbols:tune"
                    class="text-orange-500 text-xl"
                  />
                  <h2 class="text-base font-bold text-gray-800">
                    {{ $t("page.category.filter.title") }}
                  </h2>
                  <span
                    v-if="activeFilterCount > 0"
                    class="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600"
                  >
                    {{ activeFilterCount }}
                  </span>
                </div>
                <button
                  type="button"
                  class="p-2 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="close"
                  @click="showFilters = false"
                >
                  <Icon name="material-symbols:close" class="text-xl text-gray-400" />
                </button>
              </div>

              <!-- Sheet Body -->
              <div class="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <ProductFilterSidebar
                  :filters="filters"
                  :brands="availableBrands"
                  :tags="tagOptions"
                  :hide-actions="true"
                  @update:filters="updateFilters"
                  @apply="applyFilters"
                  @reset="resetFilters"
                />
              </div>

              <!-- Sheet Footer -->
              <div
                class="flex gap-3 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] border-t border-gray-100 bg-white flex-shrink-0"
              >
                <Trubutton
                  variant="outline"
                  size="large"
                  class="flex-1"
                  @click="resetFiltersAndClose"
                >
                  {{ $t("page.category.filter.reset") }}
                </Trubutton>
                <Trubutton
                  variant="primary"
                  size="large"
                  class="flex-1"
                  @click="applyFiltersAndClose"
                >
                  {{ $t("button.apply") }}
                </Trubutton>
              </div>
            </div>
          </div>
        </Teleport>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" :class="{ 'hidden': showFilters }">
        <!-- Sidebar Filters -->
        <aside class="lg:col-span-3">
          <div
            :class="[
              'lg:sticky lg:top-[150px] space-y-6 lg:block',
              showFilters ? 'block' : 'hidden',
            ]"
          >
            <ProductFilterSidebar
              :filters="filters"
              :brands="availableBrands"
              :tags="tagOptions"
              @update:filters="updateFilters"
              @apply="applyFilters"
              @reset="resetFilters"
            />
          </div>
        </aside>

        <!-- Products -->
        <main class="lg:col-span-9">
          <!-- Toolbar -->
          <div
            class="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2
                class="flex items-center gap-2 text-lg font-bold text-gray-800"
              >
                {{ $t("page.category.products") }}
                <span
                  class="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600"
                >
                  {{ pagination.total }}
                </span>
              </h2>
              <p class="mt-0.5 text-sm text-gray-500">
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
              <!-- View Toggle -->
              <div
                class="flex items-center rounded-xl border border-gray-200 p-1"
              >
                <button
                  @click="viewMode = 'grid'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                  :class="
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  "
                  :aria-pressed="viewMode === 'grid'"
                  :title="$t('label.gridView')"
                  type="button"
                >
                  <Icon name="material-symbols:grid-view" class="text-lg" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                  :class="
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  "
                  :aria-pressed="viewMode === 'list'"
                  :title="$t('label.listView')"
                  type="button"
                >
                  <Icon name="material-symbols:view-list" class="text-lg" />
                </button>
              </div>

              <!-- Sort -->
              <div class="relative">
                <Icon
                  name="material-symbols:swap-vert"
                  class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400"
                />
                <el-select
                  v-model="sortBy"
                  size="default"
                  class="!w-44"
                  @change="applyFilters"
                  :placeholder="$t('label.sort')"
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
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" :class="gridClass" class="grid gap-3 lg:gap-4">
            <div
              v-for="i in 12"
              :key="i"
              class="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div class="aspect-square bg-gray-200" />
              <div class="space-y-2 p-3">
                <div class="h-3 w-1/3 rounded bg-gray-200" />
                <div class="h-3 w-full rounded bg-gray-200" />
                <div class="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div
            v-else-if="products.length === 0"
            class="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm"
          >
            <Icon
              name="material-symbols:search-off"
              class="mx-auto text-6xl text-gray-200"
            />
            <h3 class="mb-1 mt-4 text-lg font-semibold text-gray-600">
              {{ $t("page.category.empty") }}
            </h3>
            <p class="mb-4 text-sm text-gray-400">
              {{ $t("label.noResults") }}
            </p>
            <div
              class="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Trubutton
                :text="$t('button.clearFilters')"
                variant="outline"
                icon="mdi:filter-remove"
                @click="resetFilters"
              />
              <NuxtLink to="/c/all/query">
                <Trubutton
                  :text="$t('search.browseAll')"
                  variant="solid"
                  icon="material-symbols:grid-view"
                />
              </NuxtLink>
            </div>
          </div>

          <!-- Products -->
          <div v-else>
            <!-- Grid View -->
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4"
            >
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                :tags="tagsForProduct(product.id)"
              />
            </div>

            <!-- List View -->
            <div v-else class="space-y-3">
              <div
                v-for="product in products"
                :key="product.id"
                class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md"
              >
                <Trulink
                  :to="`/product/${product.id}/${formatSlug(product.tittle)}`"
                  class="flex"
                >
                  <div
                    class="relative h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-50 sm:h-36 sm:w-36"
                  >
                    <img
                      :src="getProductImage(product.img)"
                      :alt="product.tittle"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      v-if="tagsForProduct(product.id).length > 0"
                      class="absolute bottom-1 left-1 z-10 flex items-center gap-1"
                    >
                      <span
                        v-for="tag in tagsForProduct(product.id).slice(0, 2)"
                        :key="tag.id || tag.tag"
                        class="rounded bg-orange-500/90 px-1.5 py-0.5 text-[10px] font-medium text-white"
                      >
                        {{ tagLabel(tag) }}
                      </span>
                      <span
                        v-if="tagsForProduct(product.id).length > 2"
                        class="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-white"
                      >
                        +{{ tagsForProduct(product.id).length - 2 }}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-1 flex-col justify-center p-4">
                    <p
                      v-if="
                        product.brand && product.brand.toLowerCase() !== 'other'
                      "
                      class="mb-1 text-xs font-semibold text-orange-500"
                    >
                      {{ product.brand }}
                    </p>
                    <h3
                      class="mb-1 line-clamp-2 font-semibold text-gray-800 transition-colors group-hover:text-orange-500"
                    >
                      {{ product.tittle }}
                    </h3>
                    <p
                      v-if="product.description"
                      class="mb-2 line-clamp-2 text-sm text-gray-500"
                    >
                      {{ product.description }}
                    </p>
                    <div class="flex flex-wrap items-center gap-3">
                      <div v-if="Number(product.price) > 0">
                        <p
                          v-if="Number(product.price_promo) > 0"
                          class="text-xs text-gray-400 line-through"
                        >
                          {{ formatPrice(Number(product.price)) }}
                        </p>
                        <p
                          class="text-sm font-bold text-orange-600 sm:text-base"
                        >
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
                        class="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600"
                      >
                        {{ $t("page.product.text.stock") }}: {{ product.stock }}
                      </span>
                    </div>
                  </div>
                </Trulink>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="pagination.total > perPage"
              class="mt-8 flex justify-center"
            >
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defineBreadcrumb, useSchemaOrg } from "@unhead/schema-org/vue";
import { useI18n } from "vue-i18n";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { useProductTags } from "~/composables/useProductTags";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import ProductCard from "~/components/product/ProductCard.vue";
import ProductFilterSidebar from "~/components/product/FilterSidebar.vue";
import type { CategoryResponse } from "~/types/category";

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const { t: $t, locale } = useI18n();

const tagLabel = (tag: { tag?: string; tag_en?: string; tag_ch?: string }) => {
  const lang = String(locale.value).toLowerCase();
  if (lang === "en") return tag.tag_en || tag.tag || "";
  if (lang === "zh") return tag.tag_ch || tag.tag || "";
  return tag.tag || tag.tag_en || "";
};

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
const showFilters = ref(false);
const products = ref<ProductItem[]>([]);
const availableBrands = ref<Array<{ id: number; name: string; url: string }>>(
  []
);
const categoryInfo = ref<{
  id: number;
  name: string;
  url: string;
  description?: string;
} | null>(null);
const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("default");
const currentPage = ref(1);
const perPage = ref(20);

const {
  tags: tagOptions,
  tagsForProduct,
  productsForTags,
  load: loadTags,
} = useProductTags();

const filters = ref({
  search: "",
  tags: [] as Array<string | number>,
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

const tagMode = computed(() => {
  return Array.isArray(filters.value.tags) && filters.value.tags.length > 0;
});

const pageTitle = computed(() => {
  if (isSearchAll.value) {
    return searchKeyword.value
      ? $t("page.category.searchResult", { keyword: searchKeyword.value })
      : $t("label.allProducts");
  }
  if (categoryInfo.value) {
    return categoryInfo.value.name;
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
    return "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4";
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

// Resolusi kategori dari slug segmen pertama (mis. /c/Pelumas)
const loadCategoryInfo = async () => {
  try {
    const response = await useFetchApi<CategoryResponse>(
      "category-read",
      "category-read-c",
      "get",
      null
    );
    if (response.status === "success" && response.data) {
      const roots = response.data.payload.category.products;
      if (roots && roots.length > 0) {
        // Semua brand dari root category
        const allRootBrands = roots.flatMap((r) => r.brands || []);
        availableBrands.value = allRootBrands.map((b) => ({
          id: b.id,
          name: b.name,
          url: b.name,
        }));

        if (!isSearchAll.value && slugSegments.value.length > 0) {
          const slugLower = slugSegments.value[0]
            .toLowerCase()
            .replace(/-/g, " ");
          const match = roots.find(
            (r) =>
              r.name.toLowerCase() === slugLower ||
              r.url.toLowerCase().replace(/-/g, " ") === slugLower
          );
          if (match) {
            categoryInfo.value = {
              id: match.id,
              name: match.name,
              url: match.url,
              description: (match as any).description,
            };
            const catBrands = (match.brands || []).map((b) => ({
              id: b.id,
              name: b.name,
              url: b.name,
            }));
            if (catBrands.length > 0) {
              availableBrands.value = catBrands;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to load category info:", e);
  }
};

const buildQueryFromFilters = () => {
  const query: Record<string, any> = {};
  if (filters.value.search) {
    query.q = "on";
    query.nama = filters.value.search;
  }
  if (filters.value.tags && filters.value.tags.length) {
    query.tags = filters.value.tags.join(",");
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
  filters.value.tags = ((route.query.tags as string) || "")
    .split(",")
    .filter(Boolean);
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
    tags: [],
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

// Jumlah filter aktif untuk badge pada tombol floating
const activeFilterCount = computed(() => {
  const f = filters.value as any;
  let count = 0;
  if (f.search) count++;
  if (Array.isArray(f.tags) ? f.tags.length > 0 : !!f.tags) count++;
  if (f.brand) count++;
  if (f.grade) count++;
  if (f.minPrice) count++;
  if (f.maxPrice) count++;
  return count;
});

const applyFiltersAndClose = () => {
  applyFilters();
  showFilters.value = false;
};

const resetFiltersAndClose = () => {
  resetFilters();
  showFilters.value = false;
};

// Kunci scroll body saat bottom sheet filter terbuka
watch(showFilters, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  router.replace({ query: buildQueryFromFilters() });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const productPassesFilters = (p: ProductItem): boolean => {
  const kw = (filters.value.search || "").toLowerCase();
  if (kw) {
    const haystack = [
      p.tittle,
      p.partnumber,
      p.partnumber_trumecs,
      p.tittle_en,
      p.tittle_ch,
      p.brand,
    ]
      .map((v) => String(v || "").toLowerCase())
      .join(" ");
    if (!haystack.includes(kw)) return false;
  }
  if (filters.value.brand) {
    if (
      String(p.brand).toLowerCase() !==
      String(filters.value.brand).toLowerCase()
    ) {
      return false;
    }
  }
  if (filters.value.grade) {
    if (String(p.quality) !== String(filters.value.grade)) {
      return false;
    }
  }
  const effectivePrice =
    Number(p.price_promo) > 0 ? Number(p.price_promo) : Number(p.price);
  if (
    filters.value.minPrice &&
    effectivePrice < Number(filters.value.minPrice)
  ) {
    return false;
  }
  if (
    filters.value.maxPrice &&
    effectivePrice > Number(filters.value.maxPrice)
  ) {
    return false;
  }
  return true;
};

const applyClientSort = (list: ProductItem[]): ProductItem[] => {
  const arr = [...list];
  if (sortBy.value === "price_asc") {
    arr.sort((a, b) => {
      const pa =
        Number(a.price_promo) > 0 ? Number(a.price_promo) : Number(a.price);
      const pb =
        Number(b.price_promo) > 0 ? Number(b.price_promo) : Number(b.price);
      return pa - pb;
    });
  } else if (sortBy.value === "price_desc") {
    arr.sort((a, b) => {
      const pa =
        Number(a.price_promo) > 0 ? Number(a.price_promo) : Number(a.price);
      const pb =
        Number(b.price_promo) > 0 ? Number(b.price_promo) : Number(b.price);
      return pb - pa;
    });
  } else if (sortBy.value === "newest") {
    arr.sort((a, b) => Number(b.id) - Number(a.id));
  }
  return arr;
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    // Mode tag: filter dari relasi product_tag (dijamin jalan tanpa bergantung backend)
    if (tagMode.value) {
      await loadTags();
      let list = productsForTags(filters.value.tags).filter(
        productPassesFilters
      ) as ProductItem[];
      list = applyClientSort(list);

      const totalItems = list.length;
      const start = (currentPage.value - 1) * perPage.value;
      products.value = list.slice(start, start + perPage.value);
      pagination.value = {
        total: totalItems,
        from: totalItems ? start + 1 : 0,
        to: Math.min(start + perPage.value, totalItems),
      };
      loading.value = false;
      return;
    }

    const slug = slugSegments.value.join("/");

    const body: Record<string, any> = {
      page: currentPage.value,
      limit: perPage.value,
    };

    if (!isSearchAll.value) {
      // Server hanya memfilter kategori via jenisproduct
      if (categoryInfo.value) {
        body.jenisproduct = categoryInfo.value.name;
      } else if (slug) {
        body.jenisproduct = slug;
      } else {
        body.slug = "all";
      }
    } else {
      body.slug = "all";
    }
    if (filters.value.search) body.keyword = filters.value.search;
    if (filters.value.tags && filters.value.tags.length) {
      body.tags = filters.value.tags.join(",");
    }
    if (sortBy.value !== "default") body.sort = sortBy.value;

    const response = await useFetchApi<BaseResponse<ProductItem[]>>(
      "product-search",
      `category-${slug}-${currentPage.value}`,
      "post",
      body
    );

    if (response.status === "success" && response.data) {
      const list = (response.data.payload || []).filter(
        productPassesFilters
      ) as ProductItem[];
      const totalItems = response.data.meta?.total || list.length;
      const sortedTotal = totalItems;

      const sortedPage = applyClientSort(list);
      products.value = sortedPage.length > 0 ? sortedPage : list;
      pagination.value = {
        total: sortedTotal,
        from: sortedPage.length
          ? (currentPage.value - 1) * perPage.value + 1
          : 0,
        to: Math.min(
          (currentPage.value - 1) * perPage.value + sortedPage.length,
          sortedTotal
        ),
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

// Inisialisasi: sync dari URL, muat data kategori/brands/tags, lalu fetch produk
syncFiltersFromRoute();
await Promise.all([loadCategoryInfo(), loadTags()]);
await fetchProducts();

onMounted(() => {
  updateHeaderHeight();
});

watch(
  () => route.params.slug,
  () => {
    currentPage.value = 1;
    syncFiltersFromRoute();
    loadCategoryInfo().then(() => fetchProducts());
  }
);

watch(
  () => route.query,
  () => {
    syncFiltersFromRoute();
    fetchProducts();
  }
);
</script>

<style scoped>
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
