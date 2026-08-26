<template>
  <div class="category-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <div v-if="loading" class="space-y-8">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            <div v-for="i in 10" :key="i" class="aspect-square bg-gray-200 rounded-xl" />
          </div>
        </div>
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            <div v-for="i in 12" :key="i" class="aspect-square bg-gray-200 rounded-xl" />
          </div>
        </div>
        <div class="animate-pulse">
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="aspect-square bg-gray-200" />
              <div class="p-3 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-1/3" />
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-8">
            <div class="flex gap-2">
              <div v-for="i in 5" :key="i" class="w-10 h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <!-- Left Sidebar - Filters -->
          <div class="lg:col-span-3">
            <div class="lg:sticky lg:top-[var(--header-height,150px)] space-y-6" style="--header-height: 150px;">
              <SubcategoryGrid
                :subcategories="availableSubcategories"
                :active-id="state.selectedSubcategoryId"
                :disabled="disabledSubcategoryIds"
                :title="$t('page.category.subcategories')"
                @select="selectSubcategory"
                @clear="clearFilters"
              />

              <BrandGrid
                :brands="filteredBrands"
                :active-id="state.selectedBrandId"
                :disabled="disabledBrandIds"
                :title="$t('page.category.brands')"
                @select="selectBrand"
                @clear="clearFilters"
              />

              <div v-if="hasActiveFilters" class="pt-4 border-t border-gray-200">
                <Trubutton
                  :text="$t('button.clearFilters')"
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
import { onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue';
import { useI18n } from 'vue-i18n';
import { useCategoryFilter } from '~/composables/useCategoryFilter';
import { useHeaderHeight } from '~/composables/useHeaderHeight';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import SubcategoryGrid from '~/components/category/SubcategoryGrid.vue';
import BrandGrid from '~/components/category/BrandGrid.vue';
import ProductTable from '~/components/category/ProductTable.vue';
import type { ProductCategory } from '~/types/category';

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const id = computed(() => route.params.id as string);
const categoryId = computed(() => Number(id.value));

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
} = useCategoryFilter(categoryId);

const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('default');

const breadcrumbs = computed(() => {
  const items: { text: string; to: string }[] = [
    { text: $t('breadcrumb.home'), to: '/' },
  ];

  if (categoryTree.value) {
    items.push({
      text: categoryTree.value.name,
      to: `/category/${categoryTree.value.id}`,
    });
  } else {
    items.push({
      text: $t('label.category'),
      to: '',
    });
  }

  return items;
});

const hasActiveFilters = computed(() =>
  state.selectedSubcategoryId !== null || state.selectedBrandId !== null
);

const disabledSubcategoryIds = computed(() => {
  if (!state.selectedBrandId) return [];
  return availableSubcategories.value
    .filter(sub => !filteredSubcategories.value.some(fs => fs.id === sub.id))
    .map(s => s.id);
});

const disabledBrandIds = computed(() => {
  if (!state.selectedSubcategoryId) return [];
  return availableBrands.value
    .filter(brand => !filteredBrands.value.some(fb => fb.id === brand.id))
    .map(b => b.id);
});

useHead({
  title: computed(() => categoryTree.value?.name || $t('label.category')),
  titleTemplate: '%s | Trumecs.com',
  meta: computed(() => [
    {
      name: 'description',
      content: categoryTree.value
        ? `Jelajahi produk ${categoryTree.value.name} di Trumecs. Temukan sparepart, pelumas, dan kebutuhan industri berkualitas.`
        : $t('meta.category.description'),
    },
    { property: 'og:title', content: `${categoryTree.value?.name || $t('label.category')} | Trumecs.com` },
    { property: 'og:description', content: `Jelajahi produk ${categoryTree.value?.name || 'kategori'} di Trumecs.` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Trumecs.com' },
    { name: 'robots', content: 'index, follow' },
    { name: 'twitter:card', content: 'summary' },
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: categoryTree.value
        ? `https://www.trumecs.com/category/${categoryTree.value.id}`
        : `https://www.trumecs.com/category/${id.value}`,
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
  await fetchCategoryTree();
  await fetchAllProducts();
  syncFromUrl();
});

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
</style>