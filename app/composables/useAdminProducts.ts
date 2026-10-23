// composables/useAdminProducts.ts
import { computed, ref } from "vue";
import { useAdminStore } from "~/stores/admin";
import { useProductTags } from "~/composables/useProductTags";

export interface AdminProduct {
  id: number;
  tittle: string | null;
  partnumber: string | null;
  physicnumber: string | null;
  partnumber_trumecs: string | null;
  quality: string | number | null;
  stock: number | null;
  moq: number | null;
  price: string | number | null;
  price_promo: string | number | null;
  price_bigsale: string | number | null;
  img: string | null;
  jenisproduct: string | null;
  unit: string | null;
  brand: string | number | null;
  component: number | null;
  status: string | null;
  created_by: number | null;
  area: string | number | null;
  store_id: number | null;
  description: string | null;
  warranty: string | null;
  made: string | null;
  packagin: string | null;
  weight: string | null;
  availability_at: string | null;
  view: number | null;
  [key: string]: any;
}

export interface Creator {
  id: number;
  name: string;
  email: string;
}

export interface OptionItem {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------------
// Kontrak API (diverifikasi langsung ke migrationbe.trumecs.com):
//   GET    /product/:id            -> detail produk (brand/quality/area = NAMA)
//   POST   /product-search          -> daftar produk (hanya status "show" default)
//   POST   /product/create          -> simpan produk baru
//   PUT    /product/update          -> ubah produk (body wajib berisi id)
//   DELETE /product/delete?id=<id>  -> hapus produk
// Catatan: saat menulis, brand/quality/area harus mengirim ID (bukan nama),
// dan seluruh field numerik wajib ikut mengirim (jika tidak akan di-reset).
// ---------------------------------------------------------------------------

// Grade (mutu) & Area tidak punya endpoint list -> dipetakan dari data API
const GRADES: OptionItem[] = [
  { id: 1, name: "Asli" },
  { id: 2, name: "Replika" },
  { id: 3, name: "Bekas" },
  { id: 4, name: "Copotan" },
  { id: 5, name: "Senior" },
  { id: 6, name: "Junior" },
];

const AREAS: OptionItem[] = [
  { id: 1, name: "Jakarta" },
  { id: 2, name: "Cirebon" },
  { id: 3, name: "Bekasi" },
  { id: 4, name: "Suralaya" },
  { id: 5, name: "Tangerang" },
];

// Field yang TIDAK boleh dikirim (relasi / array)
const RELATION_FIELDS = [
  "promo",
  "gallery_img",
  "specs",
  "related_product",
  "store",
  "categori",
];

// Field numerik: wajib dikirim, jika tidak akan menjadi null
const NUMERIC_FIELDS = [
  "stock",
  "moq",
  "price",
  "price_promo",
  "price_bigsale",
  "sx",
  "sy",
  "sz",
  "px",
  "py",
  "pz",
  "type",
  "brand_unit",
  "price_old",
  "is_sell",
  "is_rent",
  "is_service",
  "operator_option",
  "operator_price",
  "fuel_option",
  "rent_time_unit",
  "hour_meter",
  "minimum_rent",
  "rent_price",
  "promo_cbd_price",
  "promo_volume",
  "promo_volume_price",
  "promo_referral_price",
  "estimated_deliveryindent",
  "store_id",
  "created_by",
  "component",
];

const STATUS_LIST = ["show", "draft", "hidden"];
const API_PAGE_SIZE = 100;
const API_CONCURRENCY = 8;

// ---- Cache module-level (hanya di browser, tidak masuk payload SSR) ----
const cacheProducts = ref<AdminProduct[]>([]);
const cacheLoaded = ref(false);
let inflight: Promise<void> | null = null;

export function useAdminProducts() {
  const adminStore = useAdminStore();
  const config = useRuntimeConfig();
  const tagsStore = useProductTags();

  const loading = ref(false);
  const saving = ref(false);
  const list = ref<AdminProduct[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(20);
  const totalItems = ref(0);
  const totalPages = ref(0);
  const creators = ref<Creator[]>([]);
  const categories = ref<{ id: number; name: string; parent: string }[]>([]);
  const brands = ref<OptionItem[]>([]);

  const filters = ref({
    keyword: "",
    category: "",
    brand: "",
    status: "",
    stock: "",
    creator: "",
  });

  // ---- Identitas & hak akses ----
  const currentAdmin = computed(() => adminStore.currentAdmin);
  const currentAdminId = computed(() => currentAdmin.value?.id ?? 0);
  // Role admin (privileges "1") => melihat semua produk
  const isSuperAdmin = computed(() =>
    String(currentAdmin.value?.privileges ?? "")
      .split(",")
      .map((p) => p.trim())
      .includes("1")
  );
  const canSeeAll = isSuperAdmin;

  const authHeaders = computed(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (adminStore.token)
      headers.Authorization = `Bearer ${adminStore.token}`;
    return headers;
  });

  const apiBase = () => String(config.public.baseURL || "");

  // ================= API helpers =================

  async function fetchProductSearch(body: Record<string, any>) {
    const res = await $fetch<any>(`${apiBase()}product-search`, {
      method: "POST",
      body,
      headers: authHeaders.value,
    });
    return {
      payload: (res?.payload || []) as AdminProduct[],
      total: Number(res?.meta?.total || 0),
    };
  }

  async function fetchAllByStatus(status: string): Promise<AdminProduct[]> {
    try {
    const first = await fetchProductSearch({
      page: 1,
      limit: API_PAGE_SIZE,
      keyword: "",
      status,
    });
    const merged: AdminProduct[] = [...first.payload];
    const pages = Math.min(
      Math.max(1, Math.ceil(first.total / API_PAGE_SIZE)),
      30
    );
    if (pages <= 1) return merged;

    for (let p = 2; p <= pages; p += API_CONCURRENCY) {
      const slice: Promise<any>[] = [];
      for (let k = p; k < p + API_CONCURRENCY && k <= pages; k++) {
        slice.push(
          fetchProductSearch({
            page: k,
            limit: API_PAGE_SIZE,
            keyword: "",
            status,
          })
        );
      }
      const results = await Promise.all(slice);
      for (const r of results) merged.push(...r.payload);
    }
    return merged;
    } catch (e) {
      console.error("fetchAllByStatus", status, e);
      return [];
    }
  }

  // Muat seluruh produk (semua status) - cukup sekali per sesi
  async function loadProducts(force = false) {
    if (!force && cacheLoaded.value) return;
    if (inflight) return inflight;

    inflight = (async () => {
      try {
      const perStatus = await Promise.all(
        STATUS_LIST.map((s) => fetchAllByStatus(s))
      );
      const merged: AdminProduct[] = [];
      const seen = new Set<number>();
      for (const items of perStatus) {
        for (const p of items) {
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          merged.push(p);
        }
      }
      console.log("loadProducts: " + merged.length + " produk dimuat");
      cacheProducts.value = merged;
      cacheLoaded.value = true;
      } catch (e) {
        console.error("loadProducts gagal:", e);
        cacheProducts.value = [];
      }
    })();

    try {
      await inflight;
    } finally {
      inflight = null;
    }
  }

  // Kategori (tree), brand, dan daftar admin/pembuat
  async function loadMeta() {
    const [catRes, adminRes] = await Promise.all([
      $fetch<any>(`${apiBase()}category-read`, { method: "GET" }).catch(
        () => null
      ),
      $fetch<any>(`${apiBase()}admin/read`, { method: "GET" }).catch(() => null),
    ]);

    const flat: { id: number; name: string; parent: string }[] = [];
    const walk = (nodes: any[], parent: string) => {
      for (const node of nodes || []) {
        flat.push({ id: node.id, name: node.name, parent });
        if (node.children?.length) walk(node.children, node.name);
      }
    };
    walk(catRes?.payload?.category?.products || [], "");
    categories.value = flat;

    brands.value = (catRes?.payload?.category?.brands || []).map((b: any) => ({
      id: b.id,
      name: b.name,
    }));

    creators.value = (adminRes?.payload || []).map((a: any) => ({
      id: a.id,
      name: a.name || a.email,
      email: a.email,
    }));
  }

  // ================= Filter =================

  // Admin biasa hanya boleh melihat produk yang dibuatnya sendiri
  // ID tag milik produk (dari product_tag relation)
  const productTagIds = computed(() => (id: number | null | undefined) => {
    if (id === null || id === undefined) return [] as number[];
    const items = tagsStore.productTagItems.value.filter((it) => String(it.product_id) === String(id));
    const ids = new Set<number>();
    for (const it of items) ids.add(Number(it.tag_id));
    return Array.from(ids);
  });

  // semua tag (untuk dropdown)
  const allTags = computed(() => tagsStore.tags.value);

  const scopedProducts = computed(() => {
    const all = cacheProducts.value;
    if (canSeeAll.value) return all;
    return all.filter(
      (p) => Number(p.created_by) === Number(currentAdminId.value)
    );
  });

  const filteredProducts = computed(() => {
    const kw = filters.value.keyword.trim().toLowerCase();
    const cat = filters.value.category ? Number(filters.value.category) : null;
    const brand = filters.value.brand;
    const status = filters.value.status;
    const stock = filters.value.stock;
    const creator = filters.value.creator
      ? Number(filters.value.creator)
      : null;

    return scopedProducts.value.filter((p) => {
      if (
        !canSeeAll.value &&
        Number(p.created_by) !== Number(currentAdminId.value)
      )
        return false;
      if (creator !== null && Number(p.created_by) !== creator) return false;
      if (cat !== null) {
        if (cat === 0) {
          if (p.component) return false;
        } else if (Number(p.component) !== cat) {
          return false;
        }
      }
      if (brand && String(p.brand ?? "") !== brand) return false;
      if (status && String(p.status ?? "") !== status) return false;
      if (stock === "zero" && Number(p.stock || 0) !== 0) return false;
      if (stock === "low") {
        const s = Number(p.stock || 0);
        if (s === 0 || s > 5) return false;
      }
      if (kw) {
        const haystack = [
          p.tittle,
          p.partnumber,
          p.physicnumber,
          p.partnumber_trumecs,
          p.brand,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  });

  // Merek yang tersedia (dari produk yang sedang terlihat)
  const brandOptions = computed(() => {
    const set = new Set<string>();
    for (const p of scopedProducts.value) {
      const b = String(p.brand ?? "").trim();
      if (b && b !== "0") set.add(b);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  const statusOptions = computed(() => {
    const set = new Set<string>();
    for (const p of scopedProducts.value) {
      const s = String(p.status ?? "").trim();
      if (s) set.add(s);
    }
    return Array.from(set);
  });

  // ================= Pagination (client side) =================

  const pagedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredProducts.value.slice(start, start + pageSize.value);
  });

  function refreshList() {
    totalItems.value = filteredProducts.value.length;
    totalPages.value = Math.max(
      1,
      Math.ceil(totalItems.value / pageSize.value)
    );
    if (currentPage.value > totalPages.value)
      currentPage.value = totalPages.value;
    list.value = pagedProducts.value;
  }

  function applyFilters() {
    currentPage.value = 1;
    refreshList();
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    refreshList();
  }

  // ================= Body builder =================

  const brandIdByName = (name: string) => {
    const key = String(name ?? "").trim().toLowerCase();
    const found = brands.value.find(
      (b) => b.name.trim().toLowerCase() === key
    );
    return found ? found.id : 0;
  };
  const gradeIdByName = (name: string) =>
    GRADES.find((g) => g.name === name)?.id ?? 1;
  const areaIdByName = (name: string) =>
    AREAS.find((a) => a.name === name)?.id ?? 0;

  /**
   * Siapkan body simpan/update.
   * - buang field relasi (promo, gallery, dll)
   * - field numerik selalu dikirim (0 bila kosong) supaya tidak di-reset API
   * - brand / quality / area dikirim sebagai ID (API menyimpan id, baca nama)
   */
  function buildProductBody(
    original: AdminProduct | null,
    values: Record<string, any>
  ) {
    const body: Record<string, any> = { ...(original || {}) };
    for (const key of RELATION_FIELDS) delete body[key];
    delete body.id;

    Object.assign(body, values);

    for (const key of NUMERIC_FIELDS) {
      const v = body[key];
      if (v === null || v === undefined || v === "") body[key] = 0;
      else body[key] = Number(v) || 0;
    }

    // brand: nama -> id
    const brandValue = values.brand ?? original?.brand;
    body.brand =
      typeof brandValue === "number"
        ? brandValue
        : brandIdByName(String(brandValue ?? ""));

    // quality (mutu): nama -> id
    const qualityValue = values.quality ?? original?.quality;
    body.quality =
      typeof qualityValue === "number"
        ? qualityValue
        : gradeIdByName(String(qualityValue ?? ""));

    // area: nama -> id
    const areaValue = values.area ?? original?.area;
    body.area =
      typeof areaValue === "number"
        ? areaValue
        : areaIdByName(String(areaValue ?? ""));

    if (values.id !== undefined && values.id !== null)
      body.id = Number(values.id);
    else if (original?.id !== undefined && original?.id !== null)
      body.id = Number(original.id);

    body.created_by = Number(
      original?.created_by ?? currentAdminId.value ?? 0
    );
    if (!body.store_id) body.store_id = 0;
    // tags: disimpan terpisah lewat endpoint product_tag/create (lihat TODO di bawah)


    return body;
  }

  // ================= CRUD =================

  async function fetchProductDetail(id: number) {
    try {
      const res = await $fetch<any>(`${apiBase()}product/${id}`, {
        method: "GET",
        headers: authHeaders.value,
      });
      return (res?.payload || null) as AdminProduct | null;
    } catch {
      // API error kalau store_id produk null - pakai data dari list saja
      return null;
    }
  }

  async function createProduct(values: Record<string, any>) {
    saving.value = true;
    try {
      const body = buildProductBody(null, values);
      const res = await $fetch<any>(`${apiBase()}product/create`, {
        method: "POST",
        body,
        headers: authHeaders.value,
      });
      const created = (res?.data || res?.payload) as AdminProduct;
      if (created?.id) {
        cacheProducts.value = [
          created,
          ...cacheProducts.value.filter((p) => p.id !== created.id),
        ];
        // simpan tag
        const tagIds = (values as any)?.tag_ids || [];
        if (tagIds.length) await syncProductTags(created.id, tagIds);
      }
      refreshList();
      return created;
    } finally {
      saving.value = false;
    }
  }

  async function updateProduct(
    id: number,
    values: Record<string, any>,
    original?: AdminProduct | null
  ) {
    saving.value = true;
    try {
      // Selalu baca data asli dulu supaya field lain tidak hilang
      const base =
        (await fetchProductDetail(id)) || original || null;
      const body = buildProductBody(base, { ...values, id });
      const res = await $fetch<any>(`${apiBase()}product/update`, {
        method: "PUT",
        body,
        headers: authHeaders.value,
      });
      const updated = (res?.data || res?.payload) as AdminProduct;
      if (updated?.id) {
        cacheProducts.value = cacheProducts.value.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p
        );
        const tagIds = (values as any)?.tag_ids;
        if (Array.isArray(tagIds)) await syncProductTags(updated.id, tagIds);
      }
      refreshList();
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function deleteProduct(id: number) {
    saving.value = true;
    try {
      await $fetch<any>(`${apiBase()}product/delete?id=${id}`, {
        method: "DELETE",
        headers: authHeaders.value,
      });
      cacheProducts.value = cacheProducts.value.filter((p) => p.id !== id);
      refreshList();
    } finally {
      saving.value = false;
    }
  }

  // Ubah status tanpa menimpa field lain
  async function toggleStatus(product: AdminProduct) {
    const next = product.status === "show" ? "draft" : "show";
    return updateProduct(product.id, { status: next }, product);
  }

  /** Sinkronisasi tag produk via endpoint product_tag. */
  async function syncProductTags(productId: number, tagIds: number[]) {
    // hapus relasi lama
    try {
      await $fetch(`${apiBase()}product_tag/delete?product_id=${productId}`, { method: "DELETE", headers: authHeaders.value });
    } catch { /* mungkin tidak ada */ }
    for (const tid of tagIds) {
      try {
        await $fetch(`${apiBase()}product_tag/create`, {
          method: "POST",
          body: { product_id: productId, tag_id: tid },
          headers: authHeaders.value,
        });
      } catch (e) {
        console.warn("syncProductTags gagal untuk tag", tid, e);
      }
    }
  }

  async function duplicateProduct(product: AdminProduct) {
    const detail = await fetchProductDetail(product.id).catch(() => null);
    const source = detail || product;
    const values: Record<string, any> = {};
    for (const [key, value] of Object.entries(source)) {
      if (key === "id" || key === "created_by") continue;
      if (RELATION_FIELDS.includes(key)) continue;
      values[key] = value;
    }
    values.tittle = source.tittle ? `${source.tittle} (copy)` : "";
    values.status = "draft";
    return createProduct(values);
  }

  // ================= Init =================

  async function init() {
    loading.value = true;
    try {
      await Promise.all([loadProducts(), loadMeta()]);
      refreshList();
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    saving,
    list,
    products: pagedProducts,
    filters,
    categories,
    brands,
    creators,
    brandOptions,
    statusOptions,
    grades: GRADES,
    areas: AREAS,
    allTags,
    productTagIds,
    tagsStore,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    currentAdmin,
    currentAdminId,
    isSuperAdmin,
    canSeeAll,
    scopedProducts,
    filteredProducts,
    loadProducts,
    loadMeta,
    refreshList,
    applyFilters,
    goToPage,
    fetchProductDetail,
    createProduct,
    updateProduct,
    syncProductTags,
    deleteProduct,
    toggleStatus,
    duplicateProduct,
    init,
  };
}
