// composables/useAdminProducts.ts
import { computed, ref, watch } from "vue";
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

// Pilihan pengemasan - sama dengan daftar di form produk CI
// (application/modules/backendproduct/views/form.php)
export const PACKAGING_OPTIONS = [
  "Box Kertas",
  "Box Kayu",
  "Drum",
  "Pail",
  "Dus",
  "Lithos",
  "Botol",
  "Gallon",
  "Can",
  "Stemped",
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
  "promo_volume",
  "estimated_deliveryindent",
  "store_id",
  "created_by",
  "component",
];

// Field harga/decimal dikirim sebagai string (kolom BigInt/Decimal di API)
const PRICE_FIELDS = [
  "price",
  "price_promo",
  "price_bigsale",
  "promo_cbd_price",
  "promo_volume_price",
  "promo_referral_price",
  "rent_price",
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
  // Pohon kategori asli dari category-read (root = jenis produk, punya children & brands)
  const categoryRoots = ref<any[]>([]);
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
      // allSettled: satu halaman gagal tidak boleh membuang seluruh hasil
      const results = await Promise.allSettled(slice);
      for (const r of results) {
        if (r.status === "fulfilled") merged.push(...r.value.payload);
        else console.error("fetchAllByStatus gagal", status, r.reason);
      }
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
    await tagsStore.load();
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
    const roots = catRes?.payload?.category?.products || [];
    walk(roots, "");
    categories.value = flat;
    categoryRoots.value = roots;

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
    // Halaman admin produk mengikuti menu "Produk" di CI (Backendproduct::listall):
    // semua admin melihat seluruh produk, bukan hanya miliknya sendiri.
    return cacheProducts.value;
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

  // filter reaktif: ketika keyword/category/brand/status/stock/creator berubah -> refresh
  watch(filters, () => {
    currentPage.value = 1;
    refreshList();
  }, { deep: true });

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    refreshList();
  }

  // refresh otomatis saat currentPage berubah (dari el-pagination)
  watch(currentPage, () => refreshList());

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
   * - mengikuti form CI: dimensi "p x l x t" -> sx/sy/sz, atribut -> specs,
   *   unit/ppn/estimasi memakai nilai default CI bila kosong
   */
  function buildProductBody(
    original: AdminProduct | null,
    values: Record<string, any>
  ) {
    const body: Record<string, any> = { ...(original || {}) };
    for (const key of RELATION_FIELDS) delete body[key];
    delete body.id;
    delete body.tag_ids;
    delete body.imageFile;
    delete body.attributesLoaded;

    Object.assign(body, values);
    delete body.tag_ids;
    delete body.imageFile;
    delete body.attributesLoaded;

    for (const key of NUMERIC_FIELDS) {
      const v = body[key];
      if (v === null || v === undefined || v === "") body[key] = 0;
      else body[key] = Number(v) || 0;
    }

    // Field harga/decimal: kirim sebagai string, bukan angka
    for (const key of PRICE_FIELDS) {
      const v = body[key];
      if (v === null || v === undefined || v === "") body[key] = "0";
      else body[key] = String(v);
    }

    // Dimensi: CI memakai satu input "100x50x20" lalu dipecah ke sx/sy/sz
    if (body.dimention !== undefined) {
      const parts = String(body.dimention ?? "")
        .split("x")
        .map((part) => Number(String(part).trim()) || 0);
      body.sx = parts[0] || 0;
      body.sy = parts[1] || 0;
      body.sz = parts[2] || 0;
    }
    delete body.dimention;

    // Atribut produk (CI: attribute[] / value[]) disimpan sebagai relasi specs.
    // Hanya dikirim kalau form memang memuat atribut (lihat attributesLoaded),
    // supaya detail produk yang gagal dimuat tidak menghapus atribut lama.
    if (Array.isArray(values.attributes)) {
      body.specs = values.attributes
        .map((attr: any) => ({
          name: String(attr?.name ?? "").trim(),
          value: String(attr?.value ?? "").trim(),
        }))
        .filter((attr: any) => attr.name !== "" && attr.value !== "");
    } else {
      delete body.specs;
    }
    delete body.attributes;

    // Nilai default form CI
    if (!body.unit) body.unit = "1 Pc";
    if (!body.ppn) body.ppn = "10";
    if (!body.availability_at) body.availability_at = "INDONESIA";
    if (!Number(body.estimated_delivery)) body.estimated_delivery = 3;
    else body.estimated_delivery = String(body.estimated_delivery);
    if (!Number(body.estimated_deliveryindent))
      body.estimated_deliveryindent = 7;

    // Deskripsi: CI menyimpan newline sebagai <br /> (nl2br)
    if (values.description !== undefined) {
      const raw = String(values.description ?? "").trim();
      body.description = raw ? raw.replace(/\r\n|\r|\n/g, "<br />") : null;
    }

    // brand / quality / area: nama -> id (nilai id numerik dibiarkan apa adanya)
    const resolveRelationId = (
      value: any,
      fallback: any,
      resolver: (name: string) => number
    ) => {
      if (value === null || value === undefined || value === "") {
        return Number(fallback) || 0;
      }
      if (typeof value === "number") return value;
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) return numeric;
      return resolver(String(value)) || Number(fallback) || 0;
    };

    body.brand = resolveRelationId(values.brand, original?.brand, brandIdByName);
    body.quality = resolveRelationId(
      values.quality,
      original?.quality,
      gradeIdByName
    );
    body.area = resolveRelationId(values.area, original?.area, areaIdByName);

    if (values.id !== undefined && values.id !== null)
      body.id = Number(values.id);
    else if (original?.id !== undefined && original?.id !== null)
      body.id = Number(original.id);

    body.created_by = Number(
      original?.created_by ?? currentAdminId.value ?? 0
    );
    if (!body.store_id) body.store_id = 0;
    // tags: dikirim terpisah lewat endpoint product_tag/create (lihat syncProductTags)

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

  /** Header untuk request multipart (Content-Type dibiarkan diisi browser). */
  function multipartHeaders() {
    const headers: Record<string, string> = { ...authHeaders.value };
    delete headers["Content-Type"];
    return headers;
  }

  /** Body JSON -> FormData (dipakai saat ada file gambar produk). */
  function toFormData(body: Record<string, any>, file: File) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value === null || value === undefined) {
        formData.append(key, "");
        continue;
      }
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
        continue;
      }
      formData.append(key, String(value));
    }
    // API migration memakai field "images" (plural) untuk upload file gambar.
    // File yang diunggah akan disimpan server dan ditambahkan ke gallery_img produk.
    formData.append("images", file, file.name);
    return formData;
  }

  /**
   * Kirim simpan/update produk.
   * - ada file gambar -> multipart/form-data (field `img`, seperti upload di CI)
   * - tanpa file       -> JSON biasa (gambar lama tetap dipakai)
   * - PUT multipart tidak selalu terbaca di PHP -> dicoba juga POST + `_method`
   * - kalau API menolak relasi `specs`, ulangi sekali tanpa specs
   */
  async function sendProduct(
    path: string,
    method: "POST" | "PUT",
    body: Record<string, any>,
    file?: File | null
  ) {
    const send = (
      data: Record<string, any>,
      reqMethod: "POST" | "PUT",
      spoof: boolean
    ) => {
      const url = `${apiBase()}${path}`;
      if (!file) {
        return $fetch<any>(url, {
          method: reqMethod,
          body: data,
          headers: authHeaders.value,
        });
      }
      const formData = toFormData(data, file);
      // Sebagian backend PHP hanya mem-parse multipart pada POST, jadi
      // method asli dikirim lewat `_method` (method spoofing).
      if (spoof) formData.append("_method", reqMethod);
      return $fetch<any>(url, {
        method: spoof ? "POST" : reqMethod,
        body: formData,
        headers: multipartHeaders(),
      });
    };

    const attempts: (() => Promise<any>)[] = [];
    if (file && method === "PUT") {
      attempts.push(() => send(body, method, true));
      if (Array.isArray(body.specs)) {
        const noSpecs = { ...body };
        delete noSpecs.specs;
        attempts.push(() => send(noSpecs, method, true));
      }
    }
    attempts.push(() => send(body, method, false));
    if (Array.isArray(body.specs)) {
      const noSpecs = { ...body };
      delete noSpecs.specs;
      attempts.push(() => send(noSpecs, method, false));
    }

    let lastError: unknown = null;
    for (const attempt of attempts) {
      try {
        return await attempt();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  /** Ambil objek produk dari response API (bentuknya bisa berbeda-beda). */
  function extractProduct(res: any): AdminProduct | null {
    const candidate = res?.data?.payload || res?.payload || res?.data || res;
    const id = Number(candidate?.id ?? res?.insert_id ?? res?.id ?? 0);
    return id ? { ...(candidate as AdminProduct), id } : null;
  }

  async function createProduct(
    values: Record<string, any>,
    imageFile?: File | null
  ) {
    saving.value = true;
    try {
      const body = buildProductBody(null, values);
      const res = await sendProduct("product/create", "POST", body, imageFile);
      let created = extractProduct(res);
      if (created?.id) {
        cacheProducts.value = [
          created,
          ...cacheProducts.value.filter((p) => p.id !== created!.id),
        ];
      } else {
        // Response tidak menyertakan id -> muat ulang supaya data & tag sinkron
        await loadProducts(true);
        created = null;
      }
      const tagIds = (values as any)?.tag_ids || [];
      if (created?.id && tagIds.length)
        await syncProductTags(created.id, tagIds);
      refreshList();
      return created;
    } finally {
      saving.value = false;
    }
  }

  async function updateProduct(
    id: number,
    values: Record<string, any>,
    original?: AdminProduct | null,
    imageFile?: File | null
  ) {
    saving.value = true;
    try {
      // Selalu baca data asli dulu supaya field lain tidak hilang
      const base =
        (await fetchProductDetail(id)) || original || null;
      const body = buildProductBody(base, { ...values, id });
      const res = await sendProduct("product/update", "PUT", body, imageFile);
      const updated = extractProduct(res);
      if (updated?.id) {
        cacheProducts.value = cacheProducts.value.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p
        );
      } else {
        // Gagal baca response -> pastikan list ikut data server
        await loadProducts(true);
      }
      const tagIds = (values as any)?.tag_ids;
      if (Array.isArray(tagIds)) await syncProductTags(id, tagIds);
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
      await $fetch(`${apiBase()}product_tag/delete?product_id=${productId}`, {
        method: "DELETE",
        headers: authHeaders.value,
      });
    } catch {
      /* mungkin tidak ada */
    }
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

  /** Muat ulang daftar tag dari API (dipakai setelah menambah tag baru). */
  async function reloadTags() {
    try {
      const res = await $fetch<any>(`${apiBase()}tags/read`, {
        method: "GET",
        headers: authHeaders.value,
      });
      const list = res?.payload || res?.data?.payload || [];
      if (Array.isArray(list) && list.length) tagsStore.tags.value = list;
      return tagsStore.tags.value;
    } catch (e) {
      console.warn("reloadTags gagal", e);
      return tagsStore.tags.value;
    }
  }

  /**
   * Tambah tag baru (dipakai tombol "Tambah tag" di form produk).
   * Endpoint tag memakai bentuk jamak untuk read (`tags/read`), jadi
   * `tags/create` dicoba lebih dulu lalu `tag/create` sebagai cadangan.
   */
  async function createTag(input: {
    tag: string;
    tag_en?: string;
    tag_ch?: string;
  }) {
    const tag = String(input.tag ?? "").trim();
    const tagEn = String(input.tag_en ?? "").trim() || tag;
    const tagCh = String(input.tag_ch ?? "").trim();
    if (!tag) throw new Error("Nama tag wajib diisi");

    const payload = { tag, tag_en: tagEn, tag_ch: tagCh, clicked: "0" };
    const endpoints = ["tags/create", "tag/create"];
    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const res = await $fetch<any>(`${apiBase()}${endpoint}`, {
          method: "POST",
          body: payload,
          headers: authHeaders.value,
        });
        const candidate =
          res?.data?.payload || res?.payload || res?.data || res?.tag || res;
        const newId = Number(candidate?.id ?? res?.insert_id ?? 0);
        if (newId) {
          const created: any = { ...payload, ...candidate, id: newId };
          // simpan ke cache tag bersama supaya langsung muncul di dropdown
          tagsStore.tags.value = [
            created,
            ...tagsStore.tags.value.filter(
              (t) => String(t.id) !== String(created.id)
            ),
          ];
          return created;
        }
        // request sukses tapi id tidak terbaca -> segarkan dari server
        const list = await reloadTags();
        const found = list.find(
          (t) =>
            String(t.tag || "").toLowerCase() === tag.toLowerCase() &&
            String(t.tag || "") !== ""
        );
        if (found) return found;
      } catch (error) {
        lastError = error;
      }
    }

    await reloadTags();
    throw lastError || new Error("Gagal menambah tag");
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

  // ================= Cascading filter helpers =================
  // (opsi filter menyesuaikan filter lain yang sedang aktif)
  function matchesFilters(p: AdminProduct, exclude: string): boolean {
    const kw =
      exclude === "keyword" ? "" : filters.value.keyword.trim().toLowerCase();
    const cat =
      exclude === "category" || !filters.value.category
        ? null
        : Number(filters.value.category);
    const brand = exclude === "brand" ? "" : filters.value.brand;
    const status = exclude === "status" ? "" : filters.value.status;
    const stock = exclude === "stock" ? "" : filters.value.stock;
    const creator =
      exclude === "creator" || !filters.value.creator
        ? null
        : Number(filters.value.creator);

    if (creator !== null && Number(p.created_by) !== creator) return false;
    if (cat !== null) {
      if (cat === 0) {
        if (p.component) return false;
      } else if (Number(p.component) !== cat) return false;
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
        p.partnumber_trumecs,
        p.physicnumber,
        p.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(kw)) return false;
    }
    return true;
  }

  function filteredBy(exclude: string): AdminProduct[] {
    return scopedProducts.value.filter((p) => matchesFilters(p, exclude));
  }

  const availableCategories = computed(() => {
    const allowed = new Set(
      filteredBy("category").map((p) => Number(p.component) || 0)
    );
    return categories.value.filter((c) => allowed.has(Number(c.id)));
  });

  const availableBrands = computed(() => {
    const set = new Set<string>();
    for (const p of filteredBy("brand")) {
      if (p.brand) set.add(String(p.brand));
    }
    return brandOptions.value.filter((b) => set.has(b));
  });

  const availableStatuses = computed(() => {
    const set = new Set(
      filteredBy("status").map((p) => String(p.status ?? ""))
    );
    return statusOptions.value.filter((s) => set.has(s));
  });

  const availableCreators = computed(() => {
    const set = new Set(
      filteredBy("creator").map((p) => Number(p.created_by))
    );
    return creators.value.filter((c) => set.has(Number(c.id)));
  });

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
    availableCategories,
    availableBrands,
    availableStatuses,
    availableCreators,
    categories,
    categoryRoots,
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
    createTag,
    reloadTags,
    deleteProduct,
    toggleStatus,
    duplicateProduct,
    init,
  };
}
