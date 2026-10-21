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

// ---- Cache global produk/kategori (data publik, tidak masuk payload SSR) ----
const sharedCategories = ref<ProductCategory[]>([]);
const sharedAllProducts = ref<Product[]>([]);
const sharedAllBrands = ref<Brand[]>([]);
const sharedProductsLoaded = ref(false);
const sharedCategoriesLoaded = ref(false);

export function useProductSearch() {
  const route = useRoute();
  const router = useRouter();

  const loading = ref(false);
  const loadingCategories = ref(false);
  // ---- State produk & kategori (shared + cache antar navigasi) ----
  const categories = sharedCategories;
  const allProducts = sharedAllProducts;
  const allBrands = sharedAllBrands;
  const productsLoaded = sharedProductsLoaded;
  const categoriesLoaded = sharedCategoriesLoaded;
  const selectedCategoryIds = ref<number[]>([]);
  const selectedBrandId = ref<number | null>(null);
  const selectedTagIds = ref<Array<string | number>>([]);
  const keyword = ref("");
  const currentPage = ref(1);
  const perPage = ref(20);
  const sortBy = ref("default");

  const tagsStore = useProductTags();

  // ============ HELPERS ============

  function getBrandName(id: number): string | null {
    return allBrands.value.find((b) => b.id === id)?.name || null;
  }

  // Kumpulkan id node + semua descendant untuk satu/lebih root category
  function selectedSubcategorySet(): Set<number> {
    const set = new Set<number>();
    const selected = selectedCategoryIds.value;

    // Kumpulkan node terpilih beserta seluruh keturunannya
    const collect = (node: any) => {
      set.add(node.id);
      (node.children || []).forEach(collect);
    };

    // Cari node terpilih di kedalaman berapa pun (root / sub / subsub)
    const search = (node: any) => {
      if (selected.includes(node.id)) {
        collect(node);
        return;
      }
      (node.children || []).forEach(search);
    };

    categories.value.forEach(search);
    return set;
  }

  // Subset kategori terpilih (dihitung ulang hanya bila filter kategori berubah)
  const subcategorySet = computed(() => selectedSubcategorySet());

  // Nama brand terpilih
  const selectedBrandName = computed(() =>
    selectedBrandId.value !== null ? getBrandName(selectedBrandId.value) : null
  );

  // Keyword lowercase
  const keywordLower = computed(() => keyword.value.trim().toLowerCase());

  // Set id produk yang cocok dengan tag terpilih (lookup O(1))
  const selectedTagProductIds = computed(() => {
    if (selectedTagIds.value.length === 0) return new Set<string>();
    return tagsStore.productIdsForTags(selectedTagIds.value);
  });

  // Produk yang match seleksi category + brand + keyword (tanpa filter tag)
  function baseFilteredProducts(): Product[] {
    const subIds = subcategorySet.value;
    const brandName = selectedBrandName.value;
    const kw = keywordLower.value;
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

  // Base list = category + brand + keyword (satu sumber untuk semua count)
  const baseProducts = computed(() => baseFilteredProducts());

  function productHasTags(productId: string | number): boolean {
    if (selectedTagIds.value.length === 0) return true;
    return selectedTagProductIds.value.has(String(productId));
  }

  // ============ API ============

  // Isi cache kategori/brand dari data SSR (supaya tidak fetch ulang di client)
  function setCategories(
    payload:
      | { products?: ProductCategory[]; brands?: Brand[] }
      | null
      | undefined
  ) {
    if (!payload) return;
    if (payload.products) categories.value = payload.products;
    if (payload.brands) allBrands.value = payload.brands;
    categoriesLoaded.value = true;
  }

  async function fetchCategories() {
    if (categoriesLoaded.value && categories.value.length) return;
    loadingCategories.value = true;
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
        categoriesLoaded.value = true;
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    } finally {
      loadingCategories.value = false;
    }
  }

  async function fetchAllProducts() {
    // Sudah pernah di-cache -> tidak perlu request lagi
    if (productsLoaded.value && allProducts.value.length) {
      await tagsStore.load();
      return;
    }
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

      // Tampilkan hasil halaman pertama langsung (progressive render)
      allProducts.value = [...first.data.payload];
      // Stop spinner supaya user langsung melihat hasil
      loading.value = false;

      // Data tag diambil paralel dengan halaman produk
      const tagsPromise = tagsStore.load();

      const total = first.data.meta?.total ?? first.data.payload.length;
      const pages = Math.min(
        Math.max(1, Math.ceil(total / limitPerPage)),
        30
      );

      // Halaman sisanya diambil bertahap & langsung di-append,
      // jadi user tidak perlu menunggu semua halaman selesai.
      const CONCURRENCY = 8;
      for (let p = 2; p <= pages; p += CONCURRENCY) {
        const slice: Promise<any>[] = [];
        for (let k = p; k < p + CONCURRENCY && k <= pages; k++) {
          slice.push(
            useFetchApi<BaseResponse<Product[]>>(
              "product-search",
              `search-products-page${k}`,
              "post",
              { page: k, limit: limitPerPage, keyword: "" }
            )
          );
        }
        const results = await Promise.all(slice);
        for (const res of results) {
          if (res.status === "success" && res.data?.payload) {
            allProducts.value.push(...res.data.payload);
          }
        }
        // Jaga agar halaman yang sedang dibuka tidak keluar dari jangkauan
        applyFilters(false);
      }

      productsLoaded.value = true;
      await tagsPromise;
      applyFilters();
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      loading.value = false;
    }
  }

  // ============ FILTERS ============

  function applyFilters(clamp = true) {
    // Data produk belum ada -> jangan clamp halaman (nanti salah)
    if (!allProducts.value.length) return;
    const result = baseProducts.value.filter((p) => productHasTags(p.id));
    if (!clamp) return;
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

  // ============ TRI-STATE CATEGORY ============

  // Cari node berdasarkan id
  function findCategoryNode(
    id: number,
    nodes: any[] = categories.value
  ): any | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findCategoryNode(id, node.children || []);
      if (found) return found;
    }
    return null;
  }

  // Node + seluruh keturunannya
  function collectNodeIds(node: any): number[] {
    const ids: number[] = [node.id];
    for (const child of node.children || []) {
      ids.push(...collectNodeIds(child));
    }
    return ids;
  }

  // "none" | "partial" | "all"
  function getCategoryCheckState(id: number): "none" | "partial" | "all" {
    const node = findCategoryNode(id);
    if (!node) return "none";

    const ids = collectNodeIds(node);
    const selected = selectedCategoryIds.value;
    const hit = ids.filter((n) => selected.includes(n)).length;

    if (hit === 0) return "none";
    if (hit === ids.length) return "all";
    return "partial";
  }

  // Pilih parent -> semua child ikut tercentang; pilih yang sudah penuh -> lepas semua
  function toggleCategory(id: number) {
    currentPage.value = 1;
    const node = findCategoryNode(id);

    if (!node) {
      const idx = selectedCategoryIds.value.indexOf(id);
      if (idx >= 0) selectedCategoryIds.value.splice(idx, 1);
      else selectedCategoryIds.value.push(id);
      applyFilters();
      syncUrl();
      return;
    }

    const ids = collectNodeIds(node);
    const wasFull = getCategoryCheckState(id) === "all";

    selectedCategoryIds.value = wasFull
      ? selectedCategoryIds.value.filter((cid) => !ids.includes(cid))
      : Array.from(new Set([...selectedCategoryIds.value, ...ids]));

    applyFilters();
    syncUrl();
  }

  // Rantai ancestor dari node terpilih, supaya node terpilih selalu terlihat
  function ancestorsOfSelectedIds(): number[] {
    const out = new Set<number>();
    const selected = selectedCategoryIds.value;

    const walk = (node: any, trail: number[]) => {
      const selfTrail = [...trail, node.id];
      if (selected.includes(node.id)) {
        selfTrail.forEach((tid) => out.add(tid));
        return;
      }
      for (const child of node.children || []) {
        walk(child, selfTrail);
      }
    };

    categories.value.forEach((node: any) => walk(node, []));
    return Array.from(out);
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
    const nextCats = cat
      ? cat.split(",").map(Number).filter(Number.isFinite)
      : [];
    const brand = (route.query.brand as string) || "";
    const nextBrand = brand ? Number(brand) : null;
    const tag = (route.query.tag as string) || "";
    const nextTags = tag ? tag.split(",") : [];
    const nextKeyword = (route.query.q as string) || "";
    const nextSort = (route.query.sort as string) || "default";
    const nextPage = Number(route.query.page) || 1;

    // Hanya assign kalau memang berubah ->Computed tidak di-recalc tanpa perlu
    if (nextCats.join(",") !== selectedCategoryIds.value.join(","))
      selectedCategoryIds.value = nextCats;
    if (nextBrand !== selectedBrandId.value) selectedBrandId.value = nextBrand;
    if (nextTags.join(",") !== selectedTagIds.value.join(","))
      selectedTagIds.value = nextTags;
    if (nextKeyword !== keyword.value) keyword.value = nextKeyword;
    if (nextSort !== sortBy.value) sortBy.value = nextSort;
    if (nextPage !== currentPage.value) currentPage.value = nextPage;

    applyFilters();
  }

  // ============ SORT ============

  function setSortBy(value: string) {
    sortBy.value = value;
    currentPage.value = 1;
    applyFilters();
    syncUrl();
  }

  // Produk hasil filter tag (reaktif, tanpa perlu refetch)
  const tagFilteredProducts = computed(() => {
    if (selectedTagIds.value.length === 0) return baseProducts.value;
    const ids = selectedTagProductIds.value;
    return baseProducts.value.filter((p) => ids.has(String(p.id)));
  });

  const sortedProducts = computed(() => {
    const list = [...tagFilteredProducts.value];
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

  // Base untuk count: category + brand + keyword (tanpa tag)
  const countBaseProducts = computed(() => {
    const subIds = subcategorySet.value;
    const brandName = selectedBrandName.value;
    const kw = keywordLower.value;
    return allProducts.value.filter((p) => {
      if (subIds.size > 0 && !(p.component && subIds.has(p.component)))
        return false;
      if (brandName && p.brand !== brandName) return false;
      if (kw) {
        const haystack = `${p.tittle || ""} ${p.brand || ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  });

  // Produk per node kategori (dibatasi seleksi lain: brand/keyword/tag)
  const categoryCounts = computed<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    const base = countBaseProducts.value.filter((p) => productHasTags(p.id));
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
    const base = countBaseProducts.value.filter((p) => productHasTags(p.id));
    const byName = new Map<string, number>();
    for (const p of base) {
      if (!p.brand) continue;
      byName.set(p.brand, (byName.get(p.brand) || 0) + 1);
    }
    allBrands.value.forEach((b) => {
      map[b.id] = byName.get(b.name) || 0;
    });
    return map;
  });

  // Produk per tag (dibatasi seleksi kategori + brand + keyword)
  // Dihitung satu kali per produk memakai index tag (bukan scan ulang per tag)
  const tagCounts = computed<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    const base = countBaseProducts.value;
    for (const p of base) {
      const tagIds = tagsStore.tagIdsForProduct(p.id);
      for (const tagId of tagIds) {
        map[tagId] = (map[tagId] || 0) + 1;
      }
    }
    return map;
  });

  // Brand yang masih punya produk setelah seleksi category/tag/keyword
  const filteredBrands = computed(() => {
    const base = countBaseProducts.value.filter((p) => productHasTags(p.id));
    const names = new Set(base.map((p) => p.brand).filter(Boolean));
    return allBrands.value.filter((b) => names.has(b.name));
  });

  // Tag yang masih punya produk setelah seleksi category/brand/keyword
  const filteredTags = computed(() => {
    const counts = tagCounts.value;
    return tagsStore.tags.value.filter(
      (tag) => (counts[String(tag.id)] || 0) > 0
    );
  });

  // ============ RETURN ============

  return {
    loading,
    loadingCategories,
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
  getCategoryCheckState,
  ancestorsOfSelectedIds,
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
  };
}