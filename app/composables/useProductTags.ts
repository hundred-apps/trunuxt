// composables/useProductTags.ts
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useFetchApi } from "~/composables/useFetchApi";
import type { BaseResponse } from "~/types/global";

// --------------------
// Types (match the real API: /tags/read & /product_tag/read)
// --------------------

export interface Tag {
  id: string;
  tag: string; // Indonesian, e.g. "Pertambangan"
  tag_en: string; // English, e.g. "Mining"
  tag_ch: string; // Chinese (often empty)
  clicked: string;
}

export interface ProductTagItem {
  id: string | number;
  product_id: string | number;
  tag_id: string | number;
  product: Record<string, any>;
  tag: Tag | null;
}

// Satu promise_LOAD yang di-share supaya tidak ada request ganda
let inflightLoad: Promise<void> | null = null;

// ---- Cache global (data publik, di-share antar halaman & composable) ----
// Sengaja di module scope: tidak masuk payload SSR (data produk cukup besar)
const sharedLoading = ref(false);
const sharedLoaded = ref(false);
const sharedTags = ref<Tag[]>([]);
const sharedProductTagItems = ref<ProductTagItem[]>([]);

// --------------------
// Composable
// --------------------

export function useProductTags() {
  const { locale } = useI18n();

  // ---- State bersama (shared antar halaman & composable) ----
  // Data diambil 1x saja lalu di-cache di module scope
  const loading = sharedLoading;
  const loaded = sharedLoaded;
  const tags = sharedTags;
  const productTagItems = sharedProductTagItems;

  // ============ INDEXES (lookup O(1), bukan scan berulang) ============

  // tag id -> Tag
  const tagByIdMap = computed(() => {
    const map = new Map<string, Tag>();
    for (const t of tags.value) map.set(String(t.id), t);
    return map;
  });

  // tag id -> item product_tag
  const itemsByTagId = computed(() => {
    const map = new Map<string, ProductTagItem[]>();
    for (const item of productTagItems.value) {
      const key = String(item.tag_id);
      const arr = map.get(key);
      if (arr) arr.push(item);
      else map.set(key, [item]);
    }
    return map;
  });

  // product id -> item product_tag
  const itemsByProductId = computed(() => {
    const map = new Map<string, ProductTagItem[]>();
    for (const item of productTagItems.value) {
      const key = String(item.product_id);
      const arr = map.get(key);
      if (arr) arr.push(item);
      else map.set(key, [item]);
    }
    return map;
  });

  // product id -> Set(tag id)
  const tagIdsByProductId = computed(() => {
    const map = new Map<string, Set<string>>();
    const add = (pid: string, tagId: string) => {
      let set = map.get(pid);
      if (!set) {
        set = new Set<string>();
        map.set(pid, set);
      }
      set.add(tagId);
    };
    for (const item of productTagItems.value) {
      const tagKey = String(item.tag_id);
      const pid = String(item.product_id);
      add(pid, tagKey);
      // produk nested bisa punya id berbeda -> tetap ikut di-index
      const nestedId = item.product?.id;
      if (nestedId !== undefined && nestedId !== null) {
        const nkey = String(nestedId);
        if (nkey !== pid) add(nkey, tagKey);
      }
    }
    return map;
  });

  // Tag-friendly display name based on current locale
  function tagLabel(tag: Tag | null | undefined): string {
    if (!tag) return "";
    const lang = String(locale.value).toLowerCase();
    if (lang === "en") return tag.tag_en || tag.tag;
    if (lang === "zh") return tag.tag_ch || tag.tag;
    return tag.tag;
  }

  // Lookup tag by id (returns the raw tag object)
  function getTagById(id: string | number | null | undefined): Tag | null {
    if (id === null || id === undefined) return null;
    const key = String(id);
    return tagByIdMap.value.get(key) || null;
  }

  // All products linked to a tag
  function getProductsByTag(tagId: string | number | null | undefined): ProductTagItem[] {
    if (tagId === null || tagId === undefined) return [];
    return (itemsByTagId.value.get(String(tagId)) || []).filter(
      (item) => item.product
    );
  }

  // Product count per tag id
  const tagCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const item of productTagItems.value) {
      const key = String(item.tag_id);
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  });

  function tagCount(tagId: string | number): number {
    return tagCounts.value[String(tagId)] || 0;
  }

  // Unique brands from a set of product items (for sidebar)
  function availableBrands(items: ProductTagItem[]): Array<{ id: number; name: string; url: string }> {
    const seen = new Map<string, string>();
    for (const item of items) {
      const brand = String(item.product?.brand || "").trim();
      if (!brand || brand === "0" || brand.toLowerCase() === "other") continue;
      seen.set(brand.toLowerCase(), brand);
    }
    return Array.from(seen.values()).map((name, index) => ({
      id: index + 1,
      name,
      url: name,
    }));
  }

  // Tags attached to a product (from the product_tag relations)
  function tagsForProduct(productId: string | number | null | undefined): Tag[] {
    if (productId === null || productId === undefined) return [];
    const key = String(productId);
    const result: Tag[] = [];
    const seen = new Set<string>();
    for (const item of itemsByProductId.value.get(key) || []) {
      const t = item.tag || getTagById(item.tag_id);
      if (t && !seen.has(String(t.id))) {
        seen.add(String(t.id));
        result.push(t);
      }
    }
    return result;
  }

  // Union of products (flat product records) matching any of the given tag ids
  function productsForTags(tagIds: string | number | Array<string | number>): Array<Record<string, any>> {
    const ids = (Array.isArray(tagIds) ? tagIds : [tagIds]).map((v) => String(v));
    const map = new Map<string, Record<string, any>>();
    for (const id of ids) {
      for (const item of itemsByTagId.value.get(id) || []) {
        if (!item.product) continue;
        const pid = String(item.product.id ?? item.product_id);
        map.set(pid, item.product);
      }
    }
    return Array.from(map.values());
  }

  // Set of product ids untuk sekumpulan tag (jalur cepat untuk filter)
  function productIdsForTags(tagIds: string | number | Array<string | number>): Set<string> {
    const ids = (Array.isArray(tagIds) ? tagIds : [tagIds]).map((v) => String(v));
    const out = new Set<string>();
    for (const id of ids) {
      for (const item of itemsByTagId.value.get(id) || []) {
        const pid = item.product?.id ?? item.product_id;
        if (pid !== undefined && pid !== null) out.add(String(pid));
      }
    }
    return out;
  }

  // Set of tag ids untuk satu produk
  function tagIdsForProduct(productId: string | number | null | undefined): Set<string> {
    if (productId === null || productId === undefined) return new Set<string>();
    return tagIdsByProductId.value.get(String(productId)) || new Set<string>();
  }

  // Isi cache dari data SSR (supaya tidak fetch ulang di client)
  function setTags(data: Tag[] | null | undefined) {
    if (Array.isArray(data) && data.length) tags.value = data;
  }

  async function load() {
    if (loaded.value) return;
    if (inflightLoad) return inflightLoad;

    loading.value = true;
    inflightLoad = (async () => {
      try {
        const [tagsRes, ptRes] = await Promise.all([
          useFetchApi<BaseResponse<Tag[]>>("tags/read", "tags-read", "get", null),
          useFetchApi<BaseResponse<ProductTagItem[]>>(
            "product_tag/read",
            "product-tag-read",
            "get",
            null
          ),
        ]);

        if (tagsRes.status === "success" && tagsRes.data?.payload) {
          tags.value = tagsRes.data.payload;
        }

        if (ptRes.status === "success" && Array.isArray(ptRes.data?.payload)) {
          productTagItems.value = ptRes.data!.payload;
        }
      } catch (e) {
        console.error("Failed to load tag data:", e);
        tags.value = [];
      } finally {
        loading.value = false;
        loaded.value = true;
        inflightLoad = null;
      }
    })();

    return inflightLoad;
  }

  return {
    loading,
    loaded,
    tags,
    tagCounts,
    productTagItems,
    tagLabel,
    getTagById,
    getProductsByTag,
    tagCount,
    availableBrands,
    tagsForProduct,
    productsForTags,
    productIdsForTags,
    tagIdsForProduct,
    setTags,
    load,
  };
}
