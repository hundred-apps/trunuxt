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

// --------------------
// Composable
// --------------------

export function useProductTags() {
  const { locale } = useI18n();

  const loading = ref(true);
  const loaded = ref(false);
  const tags = ref<Tag[]>([]);
  const productTagItems = ref<ProductTagItem[]>([]);

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
    return tags.value.find((tg) => String(tg.id) === key) || null;
  }

  // All products linked to a tag
  function getProductsByTag(tagId: string | number | null | undefined): ProductTagItem[] {
    if (tagId === null || tagId === undefined) return [];
    const key = String(tagId);
    return productTagItems.value.filter(
      (item) => String(item.tag_id) === key && item.product
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
    for (const item of productTagItems.value) {
      if (String(item.product_id) !== key) continue;
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
    for (const item of productTagItems.value) {
      if (!item.product) continue;
      if (!ids.includes(String(item.tag_id))) continue;
      map.set(String(item.product.id), item.product);
    }
    return Array.from(map.values());
  }

  async function load() {
    if (loaded.value) return;
    loading.value = true;
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
    }
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
    load,
  };
}