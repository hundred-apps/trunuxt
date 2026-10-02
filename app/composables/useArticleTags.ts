import { computed, ref } from "vue";
import type { CardArticle } from "~/types/article";

// Jumlah artikel yang diambil per request (API tidak menyediakan filter tag,
// jadi artikel harusdifilter di sisi klien secara bertahap).
const CHUNK_SIZE = 100;

interface RawArticle {
  id: number | string;
  title?: string;
  title_en?: string;
  title_ch?: string;
  url?: string;
  img?: string;
  date?: string;
  tag?: string;
  tag_en?: string;
  tag_ch?: string;
}

interface ArticleApiResponse {
  status: boolean;
  pagination?: {
    current_page: number;
    total_page: number;
    total_data: number;
    per_page: number;
  };
  payload: { list_article: RawArticle[] };
}

export interface ArticleTagItem {
  name: string;
  slug: string;
  count: number;
}

// Cache di module scope (bukan useState) supaya tidak ikut ter-serialize
// ke payload SSR. Data artikel cukup besar, tidak perlu SSR.
let cache: {
  articles: RawArticle[];
  scannedPages: number;
  totalPages: number;
  totalData: number;
  done: boolean;
  running: Promise<void> | null;
} | null = null;

function ensureCache() {
  if (!cache) {
    cache = {
      articles: [],
      scannedPages: 0,
      totalPages: 0,
      totalData: 0,
      done: false,
      running: null,
    };
  }
  return cache;
}

/**
 * Pecah field tag menjadi daftar tag.
 * Format API: "#TagSatu #Tag Dua #TagTiga" -> tag dipisah oleh "#",
 * sehingga tag yang mengandung spasi (mis. "Alat Berat") tetap utuh.
 */
function parseTagString(raw?: string): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();

  // Ada "#" -> pemisah utama adalah "#"
  // Tanpa "#" -> pecah koma/semicolon, atau spasi ganda
  const parts = trimmed.includes("#")
    ? trimmed.split("#")
    : trimmed.split(/[,;]+|\s{2,}/);

  return parts
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function slugifyTag(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ambil semua tag (lokal + en + zh) dari satu artikel */
function collectTags(article: RawArticle): { slug: string; name: string }[] {
  const out: { slug: string; name: string }[] = [];
  const seen = new Set<string>();

  for (const field of [article.tag, article.tag_en, article.tag_ch]) {
    for (const name of parseTagString(field)) {
      const slug = slugifyTag(name);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, name });
    }
  }

  return out;
}

/** Samakan bentuk data artikel dengan CardArticle */
function toCardArticle(article: RawArticle): CardArticle {
  const locale = useI18n().locale.value.toLowerCase();
  const title =
    (locale === "en"
      ? article.title_en
      : locale === "zh"
        ? article.title_ch
        : null) ||
    article.title ||
    "";

  return {
    id: article.id,
    url: article.url || `article-${article.id}`,
    title,
    image: article.img
      ? `${useRuntimeConfig().public.baseImageArticle}${article.img}`
      : "https://via.placeholder.com/400x250?text=No+Image",
    category: "",
    date: article.date || "",
  };
}

export function useArticleTags() {
  const config = useRuntimeConfig();

  const articles = ref<RawArticle[]>([]);
  const loading = ref(false);
  const done = ref(false);
  const scannedPages = ref(0);
  const totalData = ref(0);
  const progress = ref(0);

  const syncFromCache = () => {
    const c = ensureCache();
    articles.value = c.articles;
    scannedPages.value = c.scannedPages;
    totalData.value = c.totalData;
    done.value = c.done;
  };

  const fetchChunk = async (page: number) => {
    const res = await $fetch<ArticleApiResponse>(
      `${config.public.baseURL}article-read?page=${page}&limit=${CHUNK_SIZE}`,
      { method: "GET" }
    );

    const list = res?.payload?.list_article;
    return {
      list: Array.isArray(list) ? list : [],
      pagination: res?.pagination,
    };
  };

  /** Scan satu chunk berikutnya. Return true jika masih ada halaman. */
  const scanNext = async (): Promise<boolean> => {
    const c = ensureCache();
    const nextPage = c.scannedPages + 1;

    // Sudah semua
    if (c.totalPages > 0 && nextPage > c.totalPages) {
      c.done = true;
      return false;
    }
    // Melewati total data
    if (c.totalData > 0 && c.articles.length >= c.totalData) {
      c.done = true;
      return false;
    }

    try {
      const { list, pagination } = await fetchChunk(nextPage);

      if (pagination) {
        c.totalPages = pagination.total_page ?? 0;
        c.totalData = pagination.total_data ?? 0;
      }

      c.scannedPages = nextPage;
      c.articles.push(...list);

      if (c.totalPages > 0 && c.scannedPages >= c.totalPages) {
        c.done = true;
      }
      if (c.totalData > 0 && c.articles.length >= c.totalData) {
        c.done = true;
      }
    } catch {
      c.done = true;
    }

    syncFromCache();
    progress.value = c.totalData > 0 ? c.articles.length / c.totalData : 0;

    return !c.done;
  };

  /** Scan bertahap: pastikan minimal `minMatches` artikel untuk sebuah tag */
  const scanUntil = async (
    tagSlug: string,
    minMatches: number
  ): Promise<void> => {
    const c = ensureCache();
    if (loading.value) return;
    loading.value = true;

    try {
      let guard = 0;
      while (guard < 50) {
        guard++;
        const matches = c.articles.filter((a) =>
          collectTags(a).some((t) => t.slug === tagSlug)
        );
        if (matches.length >= minMatches) break;
        const more = await scanNext();
        if (!more) break;
      }
    } finally {
      loading.value = false;
    }
  };

  /** Scan semua (dipakai halaman index tag, progresif) */
  const scanAll = async (): Promise<void> => {
    const c = ensureCache();
    if (loading.value) return;
    loading.value = true;

    try {
      if (c.running) {
        await c.running;
        return;
      }

      c.running = (async () => {
        let guard = 0;
        while (guard < 50 && !c.done) {
          guard++;
          const more = await scanNext();
          if (!more) break;
        }
      })();

      await c.running;
    } finally {
      loading.value = false;
      c.running = null;
    }
  };

  /** Daftar semua tag + jumlah artikelnya */
  const tags = computed<ArticleTagItem[]>(() => {
    const map = new Map<string, ArticleTagItem>();

    for (const article of articles.value) {
      for (const { slug, name } of collectTags(article)) {
        const existing = map.get(slug);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(slug, { name, slug, count: 1 });
        }
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );
  });

  /** Artikel yang punya tag tertentu */
  const articlesForTag = computed(() => (tagSlug: string) => {
    const { locale } = useI18n();
    const lang = String(locale.value || "id").toLowerCase();

    return articles.value
      .filter((a) => collectTags(a).some((t) => t.slug === tagSlug))
      .map((a) => toCardArticle(a));
  });

  /** Cari nama tag yang enak dibaca dari slug */
  const tagNameBySlug = computed(() => (slug: string) => {
    return tags.value.find((t) => t.slug === slug)?.name || slug;
  });

  return {
    loading,
    done,
    scannedPages,
    totalData,
    progress,
    tags,
    articlesForTag,
    tagNameBySlug,
    scanNext,
    scanUntil,
    scanAll,
    slugifyTag,
  };
}