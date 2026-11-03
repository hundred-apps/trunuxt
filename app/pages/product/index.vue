<template>
  <div class="product-page">
    <div class="container mx-auto max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <!-- Page Header -->
      <div
        class="mb-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.category.title") }}
            </h1>
            <p v-if="loading" class="mt-0.5 h-4 w-40 animate-pulse rounded bg-gray-200" />
            <p v-else class="mt-0.5 text-sm text-gray-400">
              {{
                $t("page.category.showing", {
                  from: showingFrom,
                  to: showingTo,
                  total: totalProducts,
                })
              }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:inventory-2" class="text-sm" />
              {{ $t("page.category.productsCount", { count: totalProducts }) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Mobile Filter Toggle -->
      <div class="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <Trubutton
          :text="showFilters ? $t('button.hideFilters') : $t('button.showFilters')"
          variant="outline"
          size="small"
          :icon="showFilters ? 'material-symbols:close' : 'material-symbols:tune'"
          icon-position="left"
          @click="showFilters = !showFilters"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:col-span-3">
          <div
            :class="[
              'space-y-6 lg:sticky lg:top-[120px] lg:block',
              showFilters ? 'block' : 'hidden',
            ]"
          >
            <!-- Keyword Search -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3
                class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
              >
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500"
                >
                  <Icon name="material-symbols:search" class="text-lg" />
                </span>
                {{ $t("page.category.filter.search") }}
              </h3>

              <el-input
                :model-value="keywordDraft"
                size="small"
                clearable
                :placeholder="$t('placeholder.searchProducts')"
                @update:model-value="onKeywordInput"
                @keyup.enter="applyKeyword"
                @clear="applyKeyword"
              >
                <template #prefix>
                  <Icon name="material-symbols:search" class="text-gray-400" />
                </template>
              </el-input>

              <button
                v-if="keyword"
                type="button"
                class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-600"
                @click="clearKeyword"
              >
                <Icon name="material-symbols:close" class="text-sm" />
                {{ $t("button.clearFilters") }}
              </button>
            </div>

            <CategoryTree
              :categories="categories"
              :selected-ids="selectedCategoryIds"
              :counts="categoryCounts"
              :check-state="getCategoryCheckState"
              :title="$t('page.category.categories')"
              :loading="loadingCategories"
              @toggle="toggleCategory"
              @clear="clearFilters"
            />

            <TagGrid
              v-if="filteredTags.length > 0"
              :tags="filteredTags"
              :active-ids="selectedTagIds"
              :counts="tagCounts"
              :title="$t('label.industry')"
              :loading="loadingCategories"
              @toggle="toggleTag"
              @clear="clearFilters"
            />

            <BrandGrid
              v-if="filteredBrands.length > 0"
              :brands="filteredBrands"
              :active-id="selectedBrandId"
              :counts="brandCounts"
              :title="$t('page.category.brands')"
              :loading="loadingCategories"
              @select="selectBrand"
              @clear="clearFilters"
            />

            <Trubutton
              v-if="hasActiveFilters"
              :text="$t('button.clearFilters')"
              variant="outline"
              size="default"
              full-width
              icon="mdi:filter-remove"
              @click="clearFilters"
            />
          </div>
        </aside>

        <!-- Products -->
        <main class="lg:col-span-9">
          <ProductTable
            :products="filteredProducts"
            :total-products="totalProducts"
            :current-page="currentPage"
            :per-page="perPage"
            :total-pages="totalPages"
            :loading="loading"
            :view-mode="viewMode"
            :sort-by="sortBy"
            :has-active-filters="hasActiveFilters"
            @view-change="viewMode = $event"
            @sort-change="setSortBy"
            @page-change="goToPage"
            @clear-filters="clearFilters"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useProductSearch } from "~/composables/useProductSearch";
import { useProductTags } from "~/composables/useProductTags";
import { useFetchApi } from "~/composables/useFetchApi";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { usePageSeo } from "~/composables/usePageSeo";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import CategoryTree from "~/components/category/CategoryTree.vue";
import TagGrid from "~/components/category/TagGrid.vue";
import BrandGrid from "~/components/category/BrandGrid.vue";
import ProductTable from "~/components/category/ProductTable.vue";
import Trubutton from "~/components/Trubutton.vue";

const { t: $t } = useI18n();
const route = useRoute();
const { updateHeaderHeight } = useHeaderHeight();

const {
  loading,
  loadingCategories,
  categories,
  allBrands,
  tags: allTags,
  tagCounts,
  filteredBrands,
  filteredTags,
  filteredProducts,
  totalProducts,
  totalPages,
  currentPage,
  perPage,
  sortBy,
  keyword,
  selectedCategoryIds,
  selectedBrandId,
  selectedTagIds,
  hasActiveFilters,
  categoryCounts,
  getCategoryCheckState,
  brandCounts,
  fetchCategories,
  setCategories,
  fetchAllProducts,
  toggleCategory,
  toggleTag,
  selectBrand,
  setKeyword,
  setSortBy,
  clearFilters,
  goToPage,
  syncFromUrl,
} = useProductSearch();

const { setTags } = useProductTags();

// ---- Data dasar diambil di server (kategori & tags) supaya sidebar tidak kosong saat pertama render ----
const { data: categoryPayload } = await useAsyncData(
  "product-categories",
  () =>
    useFetchApi<any>(
      "category-read",
      "product-categories",
      "get",
      null
    ),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

if (categoryPayload.value?.status === "success") {
  setCategories(categoryPayload.value.data?.payload?.category ?? null);
}

const { data: tagsPayload } = await useAsyncData(
  "product-tags",
  () => useFetchApi<any>("tags/read", "product-tags", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

if (tagsPayload.value?.status === "success") {
  setTags(tagsPayload.value.data?.payload ?? null);
}

// Baca filter dari URL sejak awal (juga saat SSR) supaya meta title benar di render pertama
syncFromUrl();

const tagsList = computed(() => allTags?.value || filteredTags.value || []);
const brandsList = computed(() => allBrands.value || filteredBrands.value || []);

const viewMode = ref<"grid" | "list">("grid");

// Mobile filter toggle
const showFilters = ref(false);

const activeFilterCount = computed(() =>
  (keyword.value.trim() ? 1 : 0) +
  selectedCategoryIds.value.length +
  (selectedBrandId.value ? 1 : 0)
);

// Keyword diketik dulu, baru diterapkan saat Enter / tombol apply
const keywordDraft = ref(keyword.value);
const onKeywordInput = (value: string) => {
  keywordDraft.value = value;
};
const applyKeyword = () => {
  setKeyword(keywordDraft.value);
  goToPage(1);
};
const clearKeyword = () => {
  setKeyword("");
  goToPage(1);
};

watch(keyword, (value) => {
  keywordDraft.value = value;
});

const resetFiltersAndClose = () => {
  clearFilters();
  showFilters.value = false;
};

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home") || "Home", to: "/" },
  { text: $t("page.category.title") || "Produk", to: "/product" },
]);

usePageSeo({
  title: computed(() => $t("page.category.title") || "Produk"),
  description: computed(
    () => $t("page.home.metaDescription") || undefined
  ),
  url: "/product",
  type: "website",
  breadcrumbs: [
    { name: $t("breadcrumb.home") || "Home", url: "/" },
    { name: $t("page.category.title") || "Produk", url: "/product" },
  ],
});

const showingFrom = computed(() =>
  totalProducts.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
);
const showingTo = computed(() =>
  Math.min(currentPage.value * perPage.value, totalProducts.value)
);

// Lifecycle
onMounted(async () => {
  updateHeaderHeight();
  // Kategori & produk diambil paralel -> hemat 1 round trip
  await Promise.all([fetchCategories(), fetchAllProducts()]);
  syncFromUrl();
});

// Watch URL changes
watch(
  () => route.query,
  () => {
    syncFromUrl();
  }
);
</script>
