// composables/useCategoryFilter.ts
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  ProductCategory,
  CategoryChild,
  Brand,
  CategoryPayload,
  CategoryResponse,
  Product,
} from "~/types/category";
import { useFetchApi } from "~/composables/useFetchApi";
import type { BaseResponse } from "~/types/global";

export interface CategoryFilterState {
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  selectedBrandId: number | null;
}

export function useCategoryFilter(categoryId: number | string) {
  const route = useRoute();
  const router = useRouter();

  const loading = ref(false);
  const categoryTree = ref<ProductCategory | null>(null);
  const allBrands = ref<Brand[]>([]);
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

  // ============ HELPER FUNCTIONS ============

  // Find category by ID recursively
  function findCategoryById(
    cat: ProductCategory | CategoryChild,
    id: number
  ): ProductCategory | CategoryChild | null {
    if (cat.id === id) return cat;
    if (cat.children && cat.children.length > 0) {
      for (const child of cat.children) {
        const found = findCategoryById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Find brand by ID
  function findBrandById(id: number): Brand | null {
    return allBrands.value.find((b) => b.id === id) || null;
  }

  // Find brand by name
  function findBrandByName(name: string): Brand | null {
    return allBrands.value.find((b) => b.name === name) || null;
  }

  // ============ COMPUTED ============

  // Get available subcategories (children of current category)
  const availableSubcategories = computed(() => {
    if (!categoryTree.value) return [];
    return categoryTree.value.children || [];
  });

  // Get available brands
  const availableBrands = computed(() => {
    return allBrands.value || [];
  });

  // Filter brands based on selected subcategory
  const filteredBrands = computed(() => {
    if (state.value.selectedSubcategoryId) {
      // Get products from selected subcategory
      const subcatProducts = allProducts.value.filter(
        (p) => p.component === state.value.selectedSubcategoryId
      );
      // Get unique brand names from these products
      const brandNames = new Set(
        subcatProducts.map((p) => p.brand).filter(Boolean)
      );
      return allBrands.value.filter((b) => brandNames.has(b.name));
    }
    if (state.value.selectedBrandId) {
      // Get products from selected brand
      const brand = findBrandById(state.value.selectedBrandId);
      if (!brand) return allBrands.value;
      const brandProducts = allProducts.value.filter(
        (p) => p.brand === brand.name
      );
      const subcatIds = new Set(
        brandProducts.map((p) => p.component).filter(Boolean)
      );
      return allBrands.value.filter((b) =>
        allProducts.value.some(
          (p) => p.brand === b.name && subcatIds.has(p.component)
        )
      );
    }
    return allBrands.value;
  });

  // Filter subcategories based on selected brand
  const filteredSubcategories = computed(() => {
    if (state.value.selectedBrandId) {
      const brand = findBrandById(state.value.selectedBrandId);
      if (!brand) return availableSubcategories.value;
      const brandProducts = allProducts.value.filter(
        (p) => p.brand === brand.name
      );
      const subcatIds = new Set(
        brandProducts.map((p) => p.component).filter(Boolean)
      );
      return availableSubcategories.value.filter((s) => subcatIds.has(s.id));
    }
    return availableSubcategories.value;
  });

  // ============ API FUNCTIONS ============

  async function fetchCategoryTree() {
    loading.value = true;
    try {
      const response = await useFetchApi<CategoryResponse>(
        "category-read",
        "category-tree",
        "get",
        null
      );

      if (response.status.value === "success" && response.data.value) {
        const payload = response.data.value.payload;
        const products = payload.category.products;

        // Find the root category by ID
        const rootCat = products.find(
          (c: ProductCategory) => c.id === Number(categoryId)
        );

        if (rootCat) {
          // Set category tree
          categoryTree.value = rootCat;
          state.value.selectedCategoryId = rootCat.id;

          // Set all brands from category
          allBrands.value = rootCat.brands || [];

          console.log("✅ Category tree loaded:", rootCat.name);
          console.log("✅ Brands loaded:", allBrands.value.length);
        } else {
          // Try to find in nested children
          let found = false;
          for (const cat of products) {
            if (cat.children && cat.children.length > 0) {
              for (const child of cat.children) {
                if (child.id === Number(categoryId)) {
                  // Create ProductCategory from child
                  categoryTree.value = {
                    ...child,
                    parent: null,
                    children: child.children || [],
                    brands: findBrandsForCategory(child.id, products),
                  } as ProductCategory;
                  state.value.selectedCategoryId = child.id;
                  found = true;
                  break;
                }
              }
            }
            if (found) break;
          }

          if (!found) {
            console.warn("⚠️ Category not found:", categoryId);
          }
        }
      }
    } catch (e) {
      console.error("❌ Failed to fetch category tree:", e);
    } finally {
      loading.value = false;
    }
  }

  // Helper to find brands for a specific category
  function findBrandsForCategory(
    catId: number,
    allCategories: ProductCategory[]
  ): Brand[] {
    for (const cat of allCategories) {
      if (cat.id === catId) {
        return cat.brands || [];
      }
      if (cat.children) {
        for (const child of cat.children) {
          if (child.id === catId) {
            // Find the parent category's brands
            return allCategories.find((c) => c.id === cat.id)?.brands || [];
          }
        }
      }
    }
    return [];
  }

  async function fetchAllProducts() {
    loading.value = true;
    try {
      const response = await useFetchApi<any>(
        `product-search/category/${categoryId}`,
        `category-${categoryId}-all`,
        "post",
        {
          page: 1,
          limit: 3000,
          keyword: "",
          category_id: categoryId,
        }
      );

      if (response.status.value === "success" && response.data.value) {
        const payload = response.data.value.payload;
        allProducts.value = payload.products || [];
        totalProducts.value = payload.total || allProducts.value.length;
        applyFilters();
        console.log("✅ Products loaded:", allProducts.value.length);
      }
    } catch (e) {
      console.error("❌ Failed to fetch products:", e);
    } finally {
      loading.value = false;
    }
  }

  // ============ FILTER FUNCTIONS ============

  function applyFilters() {
    let result = allProducts.value;

    // Filter by subcategory (component = subcategory ID)
    if (state.value.selectedSubcategoryId) {
      result = result.filter(
        (p) => p.component === state.value.selectedSubcategoryId
      );
    }

    // Filter by brand (brand name match)
    if (state.value.selectedBrandId) {
      const brand = findBrandById(state.value.selectedBrandId);
      if (brand) {
        result = result.filter((p) => p.brand === brand.name);
      }
    }

    filteredProducts.value = result;
    totalProducts.value = result.length;
    currentPage.value = 1;
  }

  function selectSubcategory(id: number | null) {
    state.value.selectedSubcategoryId = id;
    // If brand selected but no products in this subcategory, clear brand
    if (id && state.value.selectedBrandId) {
      const brand = findBrandById(state.value.selectedBrandId);
      const hasProducts = allProducts.value.some(
        (p) => p.component === id && p.brand === brand?.name
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
    // If subcategory selected but no products in this brand, clear subcategory
    if (id && state.value.selectedSubcategoryId) {
      const brand = findBrandById(id);
      const hasProducts = allProducts.value.some(
        (p) =>
          p.component === state.value.selectedSubcategoryId &&
          p.brand === brand?.name
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

  // ============ URL SYNC ============

  function syncUrl() {
    const query: Record<string, string> = {};
    if (state.value.selectedSubcategoryId)
      query.subcat = String(state.value.selectedSubcategoryId);
    if (state.value.selectedBrandId)
      query.brand = String(state.value.selectedBrandId);
    if (currentPage.value > 1) query.page = String(currentPage.value);
    router.replace({ query });
  }

  function syncFromUrl() {
    if (route.query.subcat) {
      state.value.selectedSubcategoryId = Number(route.query.subcat);
    } else {
      state.value.selectedSubcategoryId = null;
    }
    if (route.query.brand) {
      state.value.selectedBrandId = Number(route.query.brand);
    } else {
      state.value.selectedBrandId = null;
    }
    if (route.query.page) {
      currentPage.value = Number(route.query.page);
    }
    applyFilters();
  }

  // ============ PAGINATION ============

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredProducts.value.slice(start, end);
  });

  const totalPages = computed(() =>
    Math.ceil(totalProducts.value / perPage.value)
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      syncUrl();
    }
  }

  // ============ RETURN ============

  return {
    loading,
    categoryTree,
    allBrands,
    state,
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
    // Helper functions
    findCategoryById,
    findBrandById,
    findBrandByName,
  };
}
