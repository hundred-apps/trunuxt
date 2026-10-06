<template>
  <div class="search-page">
    <div class="container mx-auto max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <!-- Page Header -->
      <!-- <div
        class="mb-5 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.category.title") }}
            </h1>
            <p class="mt-0.5 text-sm text-gray-400">
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
            <span
              v-if="selectedCategoryIds.length"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:account-tree" class="text-sm" />
              {{ selectedCategoryIds.length }}
              {{ $t("page.category.categories") }}
            </span>
            <span
              v-if="selectedTagIds.length"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:local-offer" class="text-sm" />
              {{ selectedTagIds.length }}
              {{ $t("label.industry") }}
            </span>
            <span
              v-if="filteredBrands.length"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:business" class="text-sm" />
              {{ filteredBrands.length }}
              {{ $t("page.category.brands") }}
            </span>
          </div>
        </div>
      </div> -->

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Sidebar Filters (desktop) -->
        <aside class="hidden lg:block lg:col-span-3">
          <div class="space-y-6 lg:sticky lg:top-[120px]">
            <div
              class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
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
              :loading="loading"
              @toggle="toggleCategory"
              @clear="clearFilters"
            />

            <TagGrid
              v-if="filteredTags.length > 0"
              :tags="filteredTags"
              :active-ids="selectedTagIds"
              :counts="tagCounts"
              :title="$t('label.industry')"
              :loading="loading"
              @toggle="toggleTag"
              @clear="clearFilters"
            />

            <BrandGrid
              v-if="filteredBrands.length > 0"
              :brands="filteredBrands"
              :active-id="selectedBrandId"
              :counts="brandCounts"
              :title="$t('page.category.brands')"
              :loading="loading"
              @select="selectBrand"
              @clear="clearFilters"
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

    <!-- ===== Mobile Filter FAB ===== -->
    <div
      class="lg:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] right-4 z-[60]"
    >
      <button
        type="button"
        class="relative flex items-center gap-2 rounded-full bg-orange-500 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-95"
        :aria-expanded="showFilterSheet"
        @click="showFilterSheet = true"
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

    <!-- ===== Mobile Filter Bottom Sheet ===== -->
    <Teleport to="body">
      <div
        v-if="showFilterSheet"
        class="lg:hidden fixed inset-0 z-[9999] flex items-end"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="showFilterSheet = false"
        />
        <div
          class="relative w-full max-h-[88dvh] flex flex-col bg-white rounded-t-2xl shadow-2xl"
        >
          <!-- Sheet Header -->
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
          >
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:tune" class="text-orange-500 text-xl" />
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
              @click="showFilterSheet = false"
            >
              <Icon name="material-symbols:close" class="text-xl text-gray-400" />
            </button>
          </div>

          <!-- Sheet Body -->
          <div class="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-5">
            <div
              class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
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
              :loading="loading"
              @toggle="toggleCategory"
              @clear="clearFilters"
            />

            <TagGrid
              v-if="filteredTags.length > 0"
              :tags="filteredTags"
              :active-ids="selectedTagIds"
              :counts="tagCounts"
              :title="$t('label.industry')"
              :loading="loading"
              @toggle="toggleTag"
              @clear="clearFilters"
            />

            <BrandGrid
              v-if="filteredBrands.length > 0"
              :brands="filteredBrands"
              :active-id="selectedBrandId"
              :counts="brandCounts"
              :title="$t('page.category.brands')"
              :loading="loading"
              @select="selectBrand"
              @clear="clearFilters"
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
              :disabled="activeFilterCount === 0"
              @click="resetFiltersAndClose"
            >
              {{ $t("page.category.filter.reset") }}
            </Trubutton>
            <Trubutton
              variant="primary"
              size="large"
              class="flex-1"
              @click="showFilterSheet = false"
            >
              {{ $t("button.apply") }}
            </Trubutton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useProductSearch } from "~/composables/useProductSearch";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import CategoryTree from "~/components/category/CategoryTree.vue";
import TagGrid from "~/components/category/TagGrid.vue";
import BrandGrid from "~/components/category/BrandGrid.vue";
import ProductTable from "~/components/category/ProductTable.vue";

const { t: $t } = useI18n();
const route = useRoute();
const { updateHeaderHeight } = useHeaderHeight();

const {
  loading,
  categories,
  filteredBrands,
  filteredTags,
  filteredProducts,
  totalProducts,
  totalPages,
  currentPage,
  perPage,
  sortBy,
  selectedCategoryIds,
  selectedBrandId,
  selectedTagIds,
  hasActiveFilters,
  categoryCounts,
  getCategoryCheckState,
  brandCounts,
  tagCounts,
  tagLabel,
  keyword,
  setKeyword,
  fetchCategories,
  fetchAllProducts,
  toggleCategory,
  toggleTag,
  selectBrand,
  setSortBy,
  clearFilters,
  goToPage,
  syncFromUrl,
} = useProductSearch();

const viewMode = ref<"grid" | "list">("grid");

// Filter bottom sheet (mobile)
const showFilterSheet = ref(false);

const activeFilterCount = computed(() => {
  return (
    (keyword.value.trim() ? 1 : 0) +
    selectedCategoryIds.value.length +
    selectedTagIds.value.length +
    (selectedBrandId.value ? 1 : 0)
  );
});

// Keyword diketik dulu, baru diterapkan saat Enter / tekan tombol
const keywordDraft = ref(keyword.value);

const onKeywordInput = (value: string) => {
  keywordDraft.value = value;
};

const applyKeyword = () => {
  setKeyword(keywordDraft.value);
  goToPage(1);
};

const clearKeyword = () => {
  keywordDraft.value = "";
  setKeyword("");
  goToPage(1);
};

// Selaraskan draft dengan keyword dari URL
watch(keyword, (value) => {
  keywordDraft.value = value;
});

const resetFiltersAndClose = () => {
  clearFilters();
  showFilterSheet.value = false;
};

// Kunci scroll body saat bottom sheet terbuka
watch(showFilterSheet, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});

const showingFrom = computed(() =>
  totalProducts.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
);
const showingTo = computed(() =>
  Math.min(currentPage.value * perPage.value, totalProducts.value)
);

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home") || "Home", to: "/" },
  { text: $t("page.category.title") || "Produk", to: "" },
]);

useHead({
  title: computed(() => $t("page.category.title")),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    { name: "description", content: $t("page.category.subtitle") },
    { name: "robots", content: "noindex, nofollow" },
  ]),
});

// Lifecycle
onMounted(async () => {
  updateHeaderHeight();
  await fetchCategories();
  await fetchAllProducts();
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
