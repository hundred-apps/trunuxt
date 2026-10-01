// composables/useProductSearch.ts
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  ProductCategory,
  Brand,
  CategoryResponse,
  Product,
} from "~/types/category";
import { useFetchApi } from "~/composables/useFetchApi";
import { useProductTags } from "~/composables/useProductTags";
import type { BaseResponse } from "~/types/global";

export function useProductSearch() {
  const route = useRoute();
  const router = useRouter();

  const loading = ref(false);
  const categories = ref<ProductCategory[]>([]);
  const allProducts = ref<Product[]>([]);
  const allBrands = ref<Brand[]>([]);
  const selectedCategoryIds = ref<number[]>([]);
  const selectedBrandId = ref<number | null>(null);
  const selectedTagIds = ref<Array<string | number>>([]);
  const keyword = ref("");
  const currentPage = ref(1);
  const perPage = ref(20);
  const sortBy = ref("default");
  const filteredProducts = ref<Product[]>([]);

  const tagsStore = useProductTags();

  // ============ HELPERS ============

  function getBrandName(id: number): string | null {
    return allBrands.value.find((b) => b.id === id)?.name || null;
  }

  // Kumpulkan id node + semua descendant untuk satu/lebih root category
  function selectedSubcategorySet(): Set<number> {
    const set = new Set<number>();
    const walk = (node: any) => {
      set.add(node.id);
      (node.children || []).forEach(walk);
    };
    for (const root of categories.value) {
      if (selectedCategoryIds.value.includes(root.id)) walk(root);
      else {
        for (const child of root.children || []) {
          if (selectedCategoryIds.value.includes(child.id)) walk(child);
        }
      }
    }
    return set;
  }

  // Produk yang match seleksi category + brand + keyword (tanpa filter tag)
  function baseFilteredProducts(): Product[] {
    const subIds = selectedSubcategorySet();
    const brandName = selectedBrandId.value
      ? getBrandName(selectedBrandId.value)
      : null;
    const kw = keyword.value.trim().toLowerCase();
    return allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (brandName && p.brand !== brandName) return false;
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""} ${p.partnumber || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }

  function productHasTags(productId: string | number): boolean {
    if (selectedTagIds.value.length === 0) return true;
    return tagsStore
      .productsForTags(selectedTagIds.value)
      .some((item: any) => String(item.id) === String(productId));
  }

  // ============ API ============

  async function fetchCategories() {
    loading.value = true;
    try {
      const response = await useFetchApi<CategoryResponse>(
        "category-read",
        "search-category-tree",
        "get",
        null
      );
      if (response.status === "success" && response.data) {
        const payload = response.data.payload;
        categories.value = payload.category.products || [];
        allBrands.value = payload.category.brands || [];
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllProducts() {
    loading.value = true;
    try {
      const limitPerPage = 100;
      const first = await useFetchApi<BaseResponse<Product[]>>(
        "product-search",
        "search-products-page1",
        "post",
        { page: 1, limit: limitPerPage, keyword: "" }
      );

      if (first.status !== "success" || !first.data?.payload) {
        loading.value = false;
        return;
      }

      const merged: Product[] = [...first.data.payload];
      const total = first.data.meta?.total ?? first.data.payload.length;
      const pages = Math.min(
        Math.max(1, Math.ceil(total / limitPerPage)),
        30
      );

      const batch: Promise<any>[] = [];
      for (let p = 2; p <= pages; p++) {
        batch.push(
          useFetchApi<BaseResponse<Product[]>>(
            "product-search",
            `search-products-page${p}`,
            "post",
            { page: p, limit: limitPerPage, keyword: "" }
          )
        );
      }
      const results = await Promise.all(batch);
      results.forEach((res) => {
        if (res.status === "success" && res.data?.payload) {
          merged.push(...res.data.payload);
        }
      });

      allProducts.value = merged;
      await tagsStore.load();
      applyFilters();
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      loading.value = false;
    }
  }

  // ============ FILTERS ============

  function applyFilters() {
    const base = baseFilteredProducts();
    const result = base.filter((p) => productHasTags(p.id));
    filteredProducts.value = result;
    const maxPage = Math.max(1, Math.ceil(result.length / perPage.value));
    if (currentPage.value > maxPage) currentPage.value = maxPage;
  }

  const hasActiveFilters = computed(
    () =>
      selectedCategoryIds.value.length > 0 ||
      selectedBrandId.value !== null ||
      selectedTagIds.value.length > 0 ||
      keyword.value.trim() !== ""
  );

  function toggleCategory(id: number) {
    currentPage.value = 1;
    const idx = selectedCategoryIds.value.indexOf(id);
    if (idx >= 0) selectedCategoryIds.value.splice(idx, 1);
    else selectedCategoryIds.value.push(id);
    applyFilters();
    syncUrl();
  }

  function toggleTag(id: string | number) {
    currentPage.value = 1;
    const idx = selectedTagIds.value.indexOf(id);
    if (idx >= 0) selectedTagIds.value.splice(idx, 1);
    else selectedTagIds.value.push(id);
    applyFilters();
    syncUrl();
  }

  function selectBrand(id: number | null) {
    currentPage.value = 1;
    selectedBrandId.value = id;
    applyFilters();
    syncUrl();
  }

  function setKeyword(value: string) {
    currentPage.value = 1;
    keyword.value = value;
    applyFilters();
    syncUrl();
  }

  function clearFilters() {
    currentPage.value = 1;
    selectedCategoryIds.value = [];
    selectedBrandId.value = null;
    selectedTagIds.value = [];
    keyword.value = "";
    applyFilters();
    syncUrl();
  }

  // ============ URL SYNC ============

  function syncUrl() {
    const query: Record<string, string> = {};
    if (selectedCategoryIds.value.length > 0)
      query.cat = selectedCategoryIds.value.join(",");
    if (selectedBrandId.value !== null)
      query.brand = String(selectedBrandId.value);
    if (selectedTagIds.value.length > 0)
      query.tag = selectedTagIds.value.join(",");
    if (keyword.value.trim()) query.q = keyword.value.trim();
    if (sortBy.value !== "default") query.sort = sortBy.value;
    if (currentPage.value > 1) query.page = String(currentPage.value);
    router.replace({ query });
  }

  function syncFromUrl() {
    const cat = (route.query.cat as string) || "";
    selectedCategoryIds.value = cat
      ? cat.split(",").map(Number).filter(Number.isFinite)
      : [];
    const brand = (route.query.brand as string) || "";
    selectedBrandId.value = brand ? Number(brand) : null;
    const tag = (route.query.tag as string) || "";
    selectedTagIds.value = tag ? tag.split(",") : [];
    keyword.value = (route.query.q as string) || "";
    sortBy.value = (route.query.sort as string) || "default";
    currentPage.value = Number(route.query.page) || 1;
    applyFilters();
  }

  // ============ SORT ============

  function setSortBy(value: string) {
    sortBy.value = value;
    currentPage.value = 1;
    applyFilters();
    syncUrl();
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

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return sortedProducts.value.slice(start, end);
  });

  const totalProducts = computed(() => sortedProducts.value.length);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalProducts.value / perPage.value))
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      syncUrl();
    }
  }

  // ============ COUNTS ============

  // Produk per node kategori (bisa di filter seleksi lain: brand/keyword/tag)
  const categoryCounts = computed<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    const base = allProducts.value.filter((p) => {
      if (selectedBrandId.value !== null) {
        const name = getBrandName(selectedBrandId.value);
        if (name && p.brand !== name) return false;
      }
      if (selectedTagIds.value.length > 0 && !productHasTags(p.id)) return false;
      const kw = keyword.value.trim().toLowerCase();
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
    const walk = (node: any) => {
      const childIds = new Set<number>();
      const collect = (n: any) => {
        childIds.add(n.id);
        (n.children || []).forEach(collect);
      };
      collect(node);
      map[node.id] = base.filter(
        (p) => p.component && childIds.has(p.component)
      ).length;
      (node.children || []).forEach(walk);
    };
    categories.value.forEach(walk);
    return map;
  });

  // Produk per brand (dibatasi seleksi kategori + tag + keyword)
  const brandCounts = computed<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    const subIds = selectedSubcategorySet();
    const kw = keyword.value.trim().toLowerCase();
    const base = allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (selectedTagIds.value.length > 0 && !productHasTags(p.id)) return false;
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
    allBrands.value.forEach((b) => {
      map[b.id] = base.filter((p) => p.brand === b.name).length;
    });
    return map;
  });

  // Produk per tag (dibatasi seleksi kategori + brand + keyword)
  const tagCounts = computed<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    const subIds = selectedSubcategorySet();
    const brandName = selectedBrandId.value
      ? getBrandName(selectedBrandId.value)
      : null;
    const kw = keyword.value.trim().toLowerCase();
    const base = allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (brandName && p.brand !== brandName) return false;
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
    for (const tag of tagsStore.tags.value) {
      const id = String(tag.id);
      const items = tagsStore.productsForTags([tag.id]);
      map[id] = base.filter((p) =>
        items.some((it: any) => String(it.id) === String(p.id))
      ).length;
    }
    return map;
  });

  // Brand yang masih punya produk setelah seleksi category/tag/keyword
  const filteredBrands = computed(() => {
    const subIds = selectedSubcategorySet();
    const kw = keyword.value.trim().toLowerCase();
    const base = allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (selectedTagIds.value.length > 0 && !productHasTags(p.id)) return false;
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
    const names = new Set(base.map((p) => p.brand).filter(Boolean));
    return allBrands.value.filter((b) => names.has(b.name));
  });

  // Tag yang masih punya produk setelah seleksi category/brand/keyword
  const filteredTags = computed(() => {
    const subIds = selectedSubcategorySet();
    const brandName = selectedBrandId.value
      ? getBrandName(selectedBrandId.value)
      : null;
    const kw = keyword.value.trim().toLowerCase();
    const base = allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (brandName && p.brand !== brandName) return false;
      if (kw) {
        const haystack =
          `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
    return tagsStore.tags.value.filter((tag) => {
      const items = tagsStore.productsForTags([tag.id]);
      return base.some((p) =>
        items.some((it: any) => String(it.id) === String(p.id))
      );
    });
  });

  // ============ RETURN ============

  return {
    loading,
    categories,
    allBrands,
    tags: tagsStore.tags,
    tagLabel: tagsStore.tagLabel,
    tagCounts,
    filteredBrands,
    filteredTags,
    filteredProducts: paginatedProducts,
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
    brandCounts,
    fetchCategories,
    fetchAllProducts,
    toggleCategory,
    toggleTag,
    selectBrand,
    setKeyword,
    setSortBy,
    clearFilters,
    goToPage,
    syncFromUrl,
  };
}