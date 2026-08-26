<template>
  <div class="search-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <!-- Search Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t('search.title') }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ $t('search.subtitle', { keyword: searchKeyword, total: pagination.total }) }}
            </p>
          </div>

          <div class="flex items-center gap-4 flex-wrap">
            <div class="hidden sm:block">
              <el-select
                v-model="sortBy"
                size="small"
                class="w-40"
                @change="applyFilters"
              >
                <el-option :label="$t('search.sort.relevance')" value="relevance" />
                <el-option :label="$t('search.sort.priceLow')" value="price_asc" />
                <el-option :label="$t('search.sort.priceHigh')" value="price_desc" />
                <el-option :label="$t('search.sort.newest')" value="newest" />
              </el-select>
            </div>

            <div class="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <button
                @click="viewMode = 'grid'"
                class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                :class="viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                <Icon name="material-symbols:grid-view" class="text-lg" />
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                :class="viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                <Icon name="material-symbols:view-list" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Filter Sidebar -->
        <div class="lg:col-span-3">
          <div class="lg:sticky lg:top-[var(--header-height,150px)] space-y-6" style="--header-height: 150px;">
            <ProductFilterSidebar
              :filters="filters"
              :brands="availableBrands"
              @update:filters="updateFilters"
              @apply="applyFilters"
              @reset="resetFilters"
            />
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-9">
          <div v-if="loading" class="grid gap-4" :class="gridClass">
            <div v-for="i in 12" :key="i" class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="aspect-square bg-gray-200" />
              <div class="p-3 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-1/3" />
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
            <Icon name="material-symbols:search-off" class="text-6xl text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-600 mb-2">
              {{ $t('search.noResults') }}
            </h3>
            <p class="text-sm text-gray-400 mb-4">
              {{ $t('search.noResultsDesc', { keyword: searchKeyword }) }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
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
                  <div class="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-50">
                    <img
                      :src="getProductImage(product.img)"
                      :alt="product.tittle"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex-1 p-4">
                    <p
                      v-if="product.brand && product.brand.toLowerCase() !== 'other'"
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
                        {{ $t('page.product.text.stock') }}: {{ product.stock }}
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue';
import { useI18n } from 'vue-i18n';
import { useHeaderHeight } from '~/composables/useHeaderHeight';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import ProductCard from '~/components/product/ProductCard.vue';
import ProductFilterSidebar from '~/components/product/FilterSidebar.vue';
import type { Product } from '~/types/product';

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const loading = ref(true);
const products = ref<Product[]>([]);
const availableBrands = ref<any[]>([]);
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('relevance');
const currentPage = ref(1);
const perPage = ref(20);

const filters = ref({
  search: '',
  brand: '',
  grade: '',
  minPrice: '',
  maxPrice: '',
});

const pagination = ref({
  total: 0,
  from: 0,
  to: 0,
});

const searchKeyword = computed(() => (route.query.nama as string) || '');

const breadcrumbs = computed(() => [
  { text: $t('breadcrumb.home'), to: '/' },
  { text: $t('search.title'), to: '/cari' },
  { text: searchKeyword.value || $t('label.allProducts'), to: '' },
]);

const gridClass = computed(() => {
  if (viewMode.value === 'grid') {
    return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3';
  }
  return '';
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatSlug = (text: string | null) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const getProductImage = (img: string) => {
  if (img) return `${config.public.baseImageProduct}${img}`;
  return 'https://via.placeholder.com/300x300?text=No+Image';
};

const updateFilters = (newFilters: any) => {
  filters.value = newFilters;
};

const buildQueryFromFilters = () => {
  const query: Record<string, any> = {};
  if (filters.value.search) {
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
  filters.value.search = (route.query.nama as string) || '';
  filters.value.brand = (route.query.brand as string) || '';
  filters.value.grade = (route.query.quality as string) || '';
  filters.value.minPrice = (route.query.minp as string) || '';
  filters.value.maxPrice = (route.query.maxp as string) || '';
  currentPage.value = parseInt(route.query.page as string) || 1;
  sortBy.value = (route.query.sort as string) || 'relevance';
};

const applyFilters = () => {
  currentPage.value = 1;
  const query = buildQueryFromFilters();
  query.sort = sortBy.value;
  if (JSON.stringify(query) !== JSON.stringify(route.query)) {
    router.replace({ query });
  } else {
    fetchProducts();
  }
};

const resetFilters = () => {
  filters.value = {
    search: '',
    brand: '',
    grade: '',
    minPrice: '',
    maxPrice: '',
  };
  sortBy.value = 'relevance';
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const body: Record<string, any> = {
      page: currentPage.value,
      limit: perPage.value,
      keyword: filters.value.search || searchKeyword.value,
    };

    if (filters.value.brand) body.brand = filters.value.brand;
    if (filters.value.grade) body.quality = filters.value.grade;
    if (filters.value.minPrice) body.minp = filters.value.minPrice;
    if (filters.value.maxPrice) body.maxp = filters.value.maxPrice;
    if (sortBy.value !== 'relevance') body.sort = sortBy.value;

    const response = await useFetchApi<BaseResponse<Product[]>>(
      'product-search',
      `search-${searchKeyword.value}-${currentPage.value}`,
      'post',
      body
    );

    if (response.status === 'success' && response.data) {
      products.value = response.data.payload || [];
      const totalItems = response.data.meta?.total || products.value.length;
      pagination.value = {
        total: totalItems,
        from: (currentPage.value - 1) * perPage.value + 1,
        to: Math.min(currentPage.value * perPage.value, totalItems),
      };
    }
  } catch (e) {
    console.error('Error fetching products:', e);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

useHead({
  title: computed(() => searchKeyword.value ? `${searchKeyword.value} - ${$t('search.title')}` : $t('search.title')),
  titleTemplate: '%s | Trumecs.com',
  meta: computed(() => [
    {
      name: 'description',
      content: searchKeyword.value
        ? `Hasil pencarian "${searchKeyword.value}" di Trumecs. Temukan produk berkualitas.`
        : 'Cari produk mekanikal di Trumecs.',
    },
    { property: 'og:title', content: `${searchKeyword.value || $t('search.title')} | Trumecs.com` },
    { property: 'og:description', content: `Hasil pencarian di Trumecs` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Trumecs.com' },
    { name: 'robots', content: 'noindex, follow' },
    { name: 'twitter:card', content: 'summary' },
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: `https://www.trumecs.com/cari${searchKeyword.value ? `?nama=${encodeURIComponent(searchKeyword.value)}` : ''}`,
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

onMounted(async () => {
  updateHeaderHeight();
  syncFiltersFromRoute();
  await fetchProducts();
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
</style>