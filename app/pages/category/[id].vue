<template>
  <div class="category-page">
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
              {{ categoryTree?.name || $t("label.category") }}
            </h1>
            <p
              v-if="loading"
              class="mt-0.5 h-4 w-40 animate-pulse rounded bg-gray-200"
            />
            <p v-else class="mt-0.5 text-sm text-gray-400">
              {{
                $t("page.category.showing", {
                  from: totalProducts ? (currentPage - 1) * perPage + 1 : 0,
                  to: Math.min(currentPage * perPage, totalProducts),
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
              v-if="availableSubcategories.length"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
            >
              <Icon name="material-symbols:folder-shared" class="text-sm" />
              {{ availableSubcategories.length }}
              {{ $t("page.category.subcategories") }}
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

      <!-- Mobile Filter Toggle -->
      <div class="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <Trubutton
          :text="
            showFilters ? $t('button.hideFilters') : $t('button.showFilters')
          "
          variant="outline"
          size="small"
          :icon="
            showFilters ? 'material-symbols:close' : 'material-symbols:tune'
          "
          :icon-position="'left'"
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
            <SubcategoryGrid
              v-if="filteredSubcategories.length > 0"
              :subcategories="filteredSubcategories"
              :active-id="state.selectedSubcategoryId"
              :counts="subcategoryCounts"
              :title="$t('page.category.subcategories')"
              :loading="loading"
              @select="selectSubcategory"
              @clear="clearFilters"
            />

            <BrandGrid
              v-if="filteredBrands.length > 0"
              :brands="filteredBrands"
              :active-id="state.selectedBrandId"
              :counts="brandCounts"
              :title="$t('page.category.brands')"
              :loading="loading"
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
import { onMounted, computed, watch, ref } from "vue";
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

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const id = computed(() => route.params.id as string);
const categoryId = computed(() => Number(id.value));

const showFilters = ref(false);

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
  sortBy,
  setSortBy,
  fetchCategoryTree,
  fetchAllProducts,
  selectSubcategory,
  selectBrand,
  clearFilters,
  goToPage,
  syncFromUrl,
} = useCategoryFilter(categoryId.value);

const viewMode = ref<"grid" | "list">("grid");

// Count products per subcategory (by component id)
const subcategoryCounts = computed<Record<number, number>>(() => {
  const map: Record<number, number> = {};
  for (const sub of availableSubcategories.value) {
    map[sub.id] = allProducts.value.filter(
      (p) => p.component === sub.id
    ).length;
  }
  return map;
});

// Count products per brand (by brand name)
const brandCounts = computed<Record<number, number>>(() => {
  const map: Record<number, number> = {};
  for (const brand of filteredBrands.value) {
    map[brand.id] = allProducts.value.filter(
      (p) => p.brand === brand.name
    ).length;
  }
  return map;
});

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
