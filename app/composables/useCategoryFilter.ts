import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProductCategory, CategoryChild, Product } from '~/types/category';
import { useFetchApi } from '~/composables/useFetchApi';
import type { BaseResponse } from '~/types/global';

export interface CategoryFilterState {
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  selectedBrandId: number | null;
}

export interface FilteredData {
  subcategories: CategoryChild[];
  brands: CategoryChild[];
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useCategoryFilter(categoryId: number | string) {
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();

  const loading = ref(false);
  const categoryTree = ref<ProductCategory | null>(null);
  const allProducts = ref<Product[]>([]);
  const filteredProducts = ref<Product[]>([]);

  const state = ref<CategoryFilterState>({
    selectedCategoryId: null,
    selectedSubcategoryId: null,
    selectedBrandId: null,
  });

  const currentPage = ref(1);
  const perPage = ref(20);
  const totalProducts = ref(0);

  const selectedCategory = computed(() => {
    if (!categoryTree.value || !state.value.selectedCategoryId) return null;
    return findCategoryById(categoryTree.value, state.value.selectedCategoryId);
  });

  const selectedSubcategory = computed(() => {
    if (!selectedCategory.value?.children || !state.value.selectedSubcategoryId) return null;
    return selectedCategory.value.children.find(c => c.id === state.value.selectedSubcategoryId) || null;
  });

  const selectedBrand = computed(() => {
    if (!categoryTree.value || !state.value.selectedBrandId) return null;
    return findCategoryById(categoryTree.value, state.value.selectedBrandId);
  });

  const availableSubcategories = computed(() => {
    if (!categoryTree.value) return [];
    const cat = findCategoryById(categoryTree.value, Number(categoryId));
    return cat?.children || [];
  });

  const availableBrands = computed(() => {
    if (!categoryTree.value) return [];
    const cat = findCategoryById(categoryTree.value, Number(categoryId));
    return getBrandsForCategory(cat);
  });

  const filteredBrands = computed(() => {
    if (state.value.selectedSubcategoryId) {
      return getBrandsForSubcategory(state.value.selectedSubcategoryId, allProducts.value);
    }
    if (state.value.selectedBrandId) {
      return getSubcategoriesForBrand(state.value.selectedBrandId, allProducts.value);
    }
    return availableBrands.value;
  });

  const filteredSubcategories = computed(() => {
    if (state.value.selectedBrandId) {
      return getSubcategoriesForBrand(state.value.selectedBrandId, allProducts.value);
    }
    return availableSubcategories.value;
  });

  function findCategoryById(cat: ProductCategory, id: number): ProductCategory | null {
    if (cat.id === id) return cat;
    if (cat.children) {
      for (const child of cat.children) {
        const found = findCategoryById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  function getBrandsForCategory(cat: ProductCategory | null): CategoryChild[] {
    if (!cat) return [];
    const brands: CategoryChild[] = [];
    function collectBrands(c: ProductCategory) {
      if (c.is_brand) {
        brands.push(c);
      }
      if (c.children) {
        c.children.forEach(collectBrands);
      }
    }
    collectBrands(cat);
    return brands;
  }

  function getBrandsForSubcategory(subcatId: number, products: Product[]): CategoryChild[] {
    const brandIds = new Set(
      products
        .filter(p => p.component === subcatId)
        .map(p => p.brand)
        .filter(Boolean)
    );
    return availableBrands.value.filter(b => brandIds.has(b.name));
  }

  function getSubcategoriesForBrand(brandId: number, products: Product[]): CategoryChild[] {
    const subcatIds = new Set(
      products
        .filter(p => p.brand === findCategoryById(categoryTree.value!, brandId)?.name)
        .map(p => p.component)
        .filter(Boolean)
    );
    return availableSubcategories.value.filter(s => subcatIds.has(s.id));
  }

  async function fetchCategoryTree() {
    try {
      const response = await useFetchApi<BaseResponse<any>>(
        'category-read',
        'category-tree',
        'get',
        null
      );
      if (response.status === 'success' && response.data) {
        const products = response.data.payload.category.products;
        const rootCat = products.find((c: ProductCategory) => c.id === Number(categoryId));
        if (rootCat) {
          categoryTree.value = rootCat;
          state.value.selectedCategoryId = rootCat.id;
        }
      }
    } catch (e) {
      console.error('Failed to fetch category tree:', e);
    }
  }

  async function fetchAllProducts() {
    loading.value = true;
    try {
      const response = await useFetchApi<BaseResponse<Product[]>>(
        'product-search',
        `category-${categoryId}-all`,
        'post',
        { page: 1, limit: 3000, keyword: '' }
      );
      if (response.status === 'success' && response.data) {
        allProducts.value = response.data.payload || [];
        totalProducts.value = response.data.meta?.total || allProducts.value.length;
        applyFilters();
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      loading.value = false;
    }
  }

  function applyFilters() {
    let result = allProducts.value;

    if (state.value.selectedSubcategoryId) {
      result = result.filter(p => p.component === state.value.selectedSubcategoryId);
    }

    if (state.value.selectedBrandId) {
      const brandName = findCategoryById(categoryTree.value!, state.value.selectedBrandId)?.name;
      if (brandName) {
        result = result.filter(p => p.brand === brandName);
      }
    }

    filteredProducts.value = result;
    totalProducts.value = result.length;
    currentPage.value = 1;
  }

  function selectSubcategory(id: number | null) {
    state.value.selectedSubcategoryId = id;
    if (id && state.value.selectedBrandId) {
      const brandName = findCategoryById(categoryTree.value!, state.value.selectedBrandId)?.name;
      const hasProducts = allProducts.value.some(
        p => p.component === id && p.brand === brandName
      );
      if (!hasProducts) {
        state.value.selectedBrandId = null;
      }
    }
    applyFilters();
    syncUrl();
  }

  function selectBrand(id: number | null) {
    state.value.selectedBrandId = id;
    if (id && state.value.selectedSubcategoryId) {
      const brandName = findCategoryById(categoryTree.value!, id)?.name;
      const hasProducts = allProducts.value.some(
        p => p.component === state.value.selectedSubcategoryId && p.brand === brandName
      );
      if (!hasProducts) {
        state.value.selectedSubcategoryId = null;
      }
    }
    applyFilters();
    syncUrl();
  }

  function clearFilters() {
    state.value.selectedSubcategoryId = null;
    state.value.selectedBrandId = null;
    applyFilters();
    syncUrl();
  }

  function syncUrl() {
    const query: Record<string, string> = {};
    if (state.value.selectedSubcategoryId) query.subcat = String(state.value.selectedSubcategoryId);
    if (state.value.selectedBrandId) query.brand = String(state.value.selectedBrandId);
    if (currentPage.value > 1) query.page = String(currentPage.value);
    router.replace({ query });
  }

  function syncFromUrl() {
    if (route.query.subcat) state.value.selectedSubcategoryId = Number(route.query.subcat);
    if (route.query.brand) state.value.selectedBrandId = Number(route.query.brand);
    if (route.query.page) currentPage.value = Number(route.query.page);
    applyFilters();
  }

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredProducts.value.slice(start, start + perPage.value);
  });

  const totalPages = computed(() => Math.ceil(totalProducts.value / perPage.value));

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      syncUrl();
    }
  }

  return {
    loading,
    categoryTree,
    state,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    availableSubcategories,
    availableBrands,
    filteredBrands,
    filteredSubcategories,
    filteredProducts: paginatedProducts,
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
  };
}