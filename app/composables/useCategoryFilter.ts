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
  // Nama root category (mis. "Pelumas") untuk filter server-side via jenisproduct
  const rootCategoryName = ref("");

  const state = ref<CategoryFilterState>({
    selectedCategoryId: null,
    selectedSubcategoryId: null,
    selectedBrandId: null,
  });

  const currentPage = ref(1);
  const perPage = ref(20);
  const totalProducts = ref(0);
  const sortBy = ref("default");

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

      if (response.status === "success" && response.data) {
        const payload = response.data.payload;
        const products = payload.category.products;

        // Find the root category by ID
        const rootCat = products.find(
          (c: ProductCategory) => c.id === Number(categoryId)
        );

        if (rootCat) {
          // Set category tree
          categoryTree.value = rootCat;
          state.value.selectedCategoryId = rootCat.id;
          rootCategoryName.value = rootCat.name;

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
                  rootCategoryName.value = cat.name;
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
      // product-search membatasi limit maks 100 per halaman. Karena API tidak
      // memfilter subcategori server-side, kita muat SEMUA produk dari root
      // category (via jenisproduct) lalu scope ke tree category di client.
      // Mirip CI3 getAllCategoryIdsInTree + where_in('component', ...).
      const limitPerPage = 100;
      const fallbackTotal = 3000;

      const merged: Product[] = [];
      let page = 1;
      let total = fallbackTotal;
      let maxPages = 30; // guard: cap 30 halaman (30 x 100 = 3000)

      while (page <= maxPages) {
        const body: Record<string, any> = {
          page,
          limit: limitPerPage,
          keyword: "",
        };
        // Server hanya memfilter kategori via jenisproduct (root category name)
        if (rootCategoryName.value) {
          body.jenisproduct = rootCategoryName.value;
        }

        const response = await useFetchApi<BaseResponse<Product[]>>(
          "product-search",
          `category-${categoryId}-page${page}`,
          "post",
          body
        );

        if (response.status === "success" && response.data) {
          const list = response.data.payload || [];
          if (list.length === 0) break;
          merged.push(...list);
          total = response.data.meta?.total ?? total;
          // Paginasi sampai meta.total terpenuhi
          page += 1;
          if (merged.length >= total) break;
        } else {
          break;
        }
      }

      const treeIds = collectCategoryIds(categoryTree.value);
      allProducts.value = merged.filter(
        (p) => p.component && treeIds.has(p.component)
      );
      totalProducts.value = allProducts.value.length;
      applyFilters();
      console.log("✅ Products loaded:", allProducts.value.length);
    } catch (e) {
      console.error("❌ Failed to fetch products:", e);
    } finally {
      loading.value = false;
    }
  }

  // Collect this category id and all descendant ids (CI3 getAllCategoryIdsInTree)
  function collectCategoryIds(cat: ProductCategory | null): Set<number> {
    const ids = new Set<number>();
    if (!cat) return ids;
    const walk = (node: ProductCategory | CategoryChild) => {
      ids.add(node.id);
      (node.children || []).forEach(walk);
    };
    walk(cat);
    return ids;
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
    const maxPage = Math.max(1, Math.ceil(result.length / perPage.value));
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage;
    }
    // Reset ke halaman 1 di handler seleksi (selectSubcategory/selectBrand),
    // bukan di sini, agar pagination (goToPage) tidak tertimpa.
  }

  function selectSubcategory(id: number | null) {
    state.value.selectedSubcategoryId = id;
    currentPage.value = 1;
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
    currentPage.value = 1;
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
    currentPage.value = 1;
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

  // ============ SORT ============

  function setSortBy(value: string) {
    sortBy.value = value;
    currentPage.value = 1;
    applyFilters();
  }

  const sortedProducts = computed(() => {
    const list = [...filteredProducts.value];
    switch (sortBy.value) {
      case "price_asc":
        list.sort(
          (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
        );
        break;
      case "price_desc":
        list.sort(
          (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
        );
        break;
      case "newest":
        list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case "popular":
        list.sort((a, b) => (Number(b.view) || 0) - (Number(a.view) || 0));
        break;
      default:
        break;
    }
    return list;
  });

  // ============ PAGINATION ============

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return sortedProducts.value.slice(start, end);
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
    sortBy,
    setSortBy,
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
