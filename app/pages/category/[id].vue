<template>
  <div class="category-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <!-- Loading State -->
      <div v-if="loading" class="space-y-8">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
          >
            <div
              v-for="i in 10"
              :key="i"
              class="aspect-square bg-gray-200 rounded-xl"
            />
          </div>
        </div>
        <div class="animate-pulse">
          <div
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
          >
            <div
              v-for="i in 6"
              :key="i"
              class="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div class="aspect-square bg-gray-200" />
              <div class="p-3 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-1/3" />
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <!-- Category Header -->
        <div v-if="categoryTree" class="mb-6">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            {{ categoryTree.name }}
          </h1>
          <p v-if="categoryTree.description" class="text-gray-600 mt-2">
            {{ categoryTree.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <!-- Left Sidebar - Filters -->
          <div class="lg:col-span-3">
            <div class="lg:sticky lg:top-[150px] space-y-6">
              <!-- Subcategories -->
              <SubcategoryGrid
                v-if="availableSubcategories.length > 0"
                :subcategories="availableSubcategories"
                :active-id="state.selectedSubcategoryId"
                :title="$t('page.category.subcategories') || 'Sub Kategori'"
                @select="selectSubcategory"
                @clear="clearFilters"
              />

              <!-- Brands -->
              <BrandGrid
                v-if="filteredBrands.length > 0"
                :brands="filteredBrands"
                :active-id="state.selectedBrandId"
                :title="$t('page.category.brands') || 'Merk'"
                @select="selectBrand"
                @clear="clearFilters"
              />

              <!-- Clear Filters -->
              <div
                v-if="hasActiveFilters"
                class="pt-4 border-t border-gray-200"
              >
                <Trubutton
                  :text="$t('button.clearFilters') || 'Reset Filter'"
                  variant="outline"
                  full-width
                  icon="mdi:filter-remove"
                  @click="clearFilters"
                />
              </div>
            </div>
          </div>

          <!-- Right Content - Products -->
          <div class="lg:col-span-9">
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
              @sort-change="sortBy = $event"
              @page-change="goToPage"
              @clear-filters="clearFilters"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { defineBreadcrumb, useSchemaOrg } from "@unhead/schema-org/vue";
import { useCategoryFilter } from "~/composables/useCategoryFilter";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import SubcategoryGrid from "~/components/category/SubcategoryGrid.vue";
import BrandGrid from "~/components/category/BrandGrid.vue";
import ProductTable from "~/components/category/ProductTable.vue";
import type { ProductCategory } from "~/types/category";

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const id = computed(() => route.params.id as string);
const categoryId = computed(() => Number(id.value));

// Use category filter
const {
  loading,
  categoryTree,
  state,
  availableSubcategories,
  availableBrands,
  filteredBrands,
  filteredSubcategories,
  filteredProducts,
  allProducts,
  totalProducts,
  totalPages,
  currentPage,
  perPage,
  fetchCategoryTree,
  fetchAllProducts,
  selectSubcategory,
  selectBrand,
  clearFilters,
  goToPage,
  syncFromUrl,
} = useCategoryFilter(categoryId.value);

const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("default");

// Breadcrumbs
const breadcrumbs = computed(() => {
  const items: { text: string; to: string }[] = [
    { text: $t("breadcrumb.home") || "Home", to: "/" },
  ];

  if (categoryTree.value) {
    items.push({
      text: categoryTree.value.name,
      to: `/category/${categoryTree.value.id}`,
    });
  } else {
    items.push({
      text: $t("label.category") || "Kategori",
      to: "",
    });
  }

  return items;
});

const hasActiveFilters = computed(
  () =>
    state.value.selectedSubcategoryId !== null ||
    state.value.selectedBrandId !== null
);

// SEO
useHead({
  title: computed(
    () => categoryTree.value?.name || $t("label.category") || "Kategori"
  ),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    {
      name: "description",
      content: categoryTree.value
        ? `Jelajahi produk ${categoryTree.value.name} di Trumecs. Temukan sparepart, pelumas, dan kebutuhan industri berkualitas.`
        : "Jelajahi kategori produk di Trumecs.",
    },
    {
      property: "og:title",
      content: `${categoryTree.value?.name || "Kategori"} | Trumecs.com`,
    },
    {
      property: "og:description",
      content: `Jelajahi produk ${categoryTree.value?.name || "kategori"} di Trumecs.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
    { name: "twitter:card", content: "summary" },
  ]),
  link: computed(() => [
    {
      rel: "canonical",
      href: categoryTree.value
        ? `https://www.trumecs.com/category/${categoryTree.value.id}`
        : `https://www.trumecs.com/category/${id.value}`,
    },
  ]),
});

// Schema Org
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((item, index) => ({
      position: index + 1,
      name: item.text,
      item: `https://www.trumecs.com${item.to}`,
    })),
  }),
]);

// Lifecycle
onMounted(async () => {
  updateHeaderHeight();
  await fetchCategoryTree();
  await fetchAllProducts();
  syncFromUrl();
});

// Watch for URL changes
watch(
  () => route.query,
  () => {
    syncFromUrl();
  }
);
</script>

<style scoped>
.category-page {
  min-height: calc(100vh - 200px);
}

/* Sticky sidebar adjustment */
.lg\:sticky {
  position: sticky;
  top: 150px;
}
</style>
