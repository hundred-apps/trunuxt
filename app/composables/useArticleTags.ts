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
  view?: number;
  discription_seo?: string;
  created_by?: string;
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
} | null = null;

function ensureCache() {
  if (!cache) {
    cache = {
      articles: [],
      scannedPages: 0,
      totalPages: 0,
      totalData: 0,
      done: false,
    };
  }
  return cache;
}

/**
 * Antrean serial untuk scanning.
 *
 * Tanpa ini, `scanUntil()` (dari halaman tag detail) dan `scanNext()` /
 * `scanAll()` bisa jalan bersamaan. Keduanya menghitung
 * `nextPage = scannedPages + 1` dari state yang sama, jadi keduanya fetch
 * halaman yang sama lalu `push()` dua kali -> artikel duplikat dan
 * `articleCount` jadi ngawur.
 *
 * Semua scan wajib lewat `enqueue()`.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  // Antrian harus tetap live walau satu task gagal.
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

/**
 * Pecah string tag dari API menjadi daftar tag terpisah.
 *
 * Format di lapangan:
 *   "#TagA #TagB #TagC"             -> pisah "#"
 *   "impact roller, roller conveyor" -> pisah koma, tapi ISI tag mengandung spasi
 *   "TagA, TagB #TagC"              -> gabungan keduanya
 *
 * "#", koma, dan semicolon selalu jadi pemisah; spasi tunggal TIDAK
 * memisahkan, supaya "impact roller" tetap satu tag.
 */
export function parseTagString(raw?: string): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();

  const parts = trimmed.split(/[#,;]+|\s{2,}/);

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

/**
 * Samakan bentuk data artikel dengan CardArticle.
 *
 * CATATAN: fungsi ini dipanggil dari dalam computed/callback, yaitu DI LUAR
 * setup(). Karena itu locale & config harus diteruskan sebagai parameter —
 * memanggil useI18n()/useRuntimeConfig() di sini akan memicu
 * "NUXT_E1001: A composable that requires access to the Nuxt instance
 *  was called outside of a plugin, Nuxt hook, Nuxt middleware,
 *  or Vue setup function".
 */
function toCardArticle(
  article: RawArticle,
  lang: string,
  baseImageArticle: string
): CardArticle {
  const title =
    (lang === "en"
      ? article.title_en
      : lang === "zh"
        ? article.title_ch
        : null) ||
    article.title ||
    "";

  // collectTags() dipanggil sekali saja; dipakai untuk category + tags.
  const tagNames = collectTags(article).map((t) => t.name);

  return {
    id: article.id,
    url: article.url || `article-${article.id}`,
    title,
    image: article.img
      ? article.img.startsWith("http")
        ? article.img
        : `${baseImageArticle}${article.img}`
      : "",
    category: tagNames[0] || "",
    tags: tagNames,
    date: article.date || "",
    excerpt: article.discription_seo || "",
    description: article.discription_seo || "",
    views: article.view || 0,
    author: {
      name: article.created_by || "Anonymous",
      avatar: "",
      role: article.created_by ? "Contributor" : "Guest",
    },
  };
}

export function useArticleTags() {
  const config = useRuntimeConfig();

  // Diambil sekali di dalam setup() lalu dipakai ulang, supaya composable
  // tidak dipanggil dari luar konteks setup.
  const { locale } = useI18n();
  const currentLang = () => String(locale.value || "id").toLowerCase();
  const baseImageArticle = () =>
    (config.public.baseImageArticle as string) || "";

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

  /** Satu chunk berikutnya (versi internal, tanpa antrean). */
  const scanStep = async (): Promise<boolean> => {
    const c = ensureCache();
    const nextPage = c.scannedPages + 1;

    if (c.totalPages > 0 && nextPage > c.totalPages) {
      c.done = true;
      syncFromCache();
      return false;
    }
    if (c.totalData > 0 && c.articles.length >= c.totalData) {
      c.done = true;
      syncFromCache();
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

      if (c.totalPages > 0 && c.scannedPages >= c.totalPages) c.done = true;
      if (c.totalData > 0 && c.articles.length >= c.totalData) c.done = true;
    } catch (e) {
      console.warn("[useArticleTags] scan halaman gagal:", nextPage, e);
      c.done = true;
    }

    syncFromCache();
    progress.value =
      c.totalData > 0 ? Math.min(1, c.articles.length / c.totalData) : 0;

    return !c.done;
  };

  /** Scan satu chunk berikutnya. Return true jika masih ada halaman. */
  const scanNext = (): Promise<boolean> => enqueue(scanStep);

  /** Scan bertahap: pastikan minimal `minMatches` artikel untuk sebuah tag */
  const scanUntil = async (
    tagSlug: string,
    minMatches: number
  ): Promise<void> => {
    const c = ensureCache();

    // PENTING: cache module sudah bisa terisi dari halaman sebelumnya
    // (mis. user datang dari /article/tag). Tanpa sync di sini, `articles`
    // tetap kosong kalau loop langsung break di iterasi pertama.
    syncFromCache();
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
      syncFromCache();
      loading.value = false;
    }
  };

  /** Scan semua (dipakai halaman index tag) */
  const scanAll = async (): Promise<void> => {
    syncFromCache();

    // `scanNext()` di-enqueue sendiri, jadi di dalam enqueue harus pakai
    // `scanStep()` langsung atau akan deadlock (menunggu dirinya sendiri).
    await enqueue(async () => {
      let guard = 0;
      while (guard < 50) {
        guard++;
        const c = ensureCache();
        if (c.done) break;
        const more = await scanStep();
        if (!more) break;
      }
    });
    loading.value = false;
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
    return articles.value
      .filter((a) => collectTags(a).some((t) => t.slug === tagSlug))
      .map((a) => toCardArticle(a, currentLang(), baseImageArticle()));
  });

  /** Semua artikel yang sudah terscan sebagai CardArticle, untuk pencarian global. */
  const allCards = computed(() =>
    articles.value.map((a) => toCardArticle(a, currentLang(), baseImageArticle()))
  );

  /**
   * Tag lain yang muncul di artikel sebuah tag (untuk chip filter).
   * Tag itu sendiri tidak ikut dihitung, jadi user bisa melihat artikel
   * yang share topik lain dengan tag yang sedang dibuka.
   */
  const siblingTags = computed(() => (tagSlug: string, limit = 12) => {
    const count = new Map<string, { name: string; count: number }>();

    for (const article of articles.value) {
      const mine = collectTags(article);
      if (!mine.some((t) => t.slug === tagSlug)) continue;

      const seenHere = new Set<string>();
      for (const { slug, name } of mine) {
        if (slug === tagSlug || seenHere.has(slug)) continue;
        seenHere.add(slug);
        const e = count.get(slug);
        if (e) e.count += 1;
        else count.set(slug, { name, count: 1 });
      }
    }

    return [...count.entries()]
      .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, limit);
  });

  /** Artikel trending (paling banyak dibaca) di dalam sebuah tag */
  const trendingForTag = computed(
    () => (tagSlug: string, limit = 5) => {
      return articlesForTag.value(tagSlug)
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limit);
    }
  );

  /**
   * Artikel terkait: artikel yang share tag dengan tag yang sedang dibuka,
   * DIKECUALIKAN artikel yang juga memakai tag tersebut (itu bukan "related",
   * itu artikel yang sama).
   * Diurutkan dari yang paling banyak tag-nya cocok.
   */
  const relatedForTag = computed(
    () => (tagSlug: string, limit = 6) => {
      const siblings = new Set<string>();
      for (const article of articles.value) {
        const mine = collectTags(article);
        if (!mine.some((t) => t.slug === tagSlug)) continue;
        for (const t of mine) {
          if (t.slug !== tagSlug) siblings.add(t.slug);
        }
      }
      if (siblings.size === 0) return [];

      const pool: { card: CardArticle; score: number }[] = [];
      for (const article of articles.value) {
        const mine = collectTags(article);
        if (mine.some((t) => t.slug === tagSlug)) continue;

        let score = 0;
        for (const t of mine) {
          if (siblings.has(t.slug)) score += 1;
        }
        if (score === 0) continue;

        pool.push({
          card: toCardArticle(article, currentLang(), baseImageArticle()),
          score,
        });
      }

      if (pool.length > 0) {
        return pool
          .sort(
            (a, b) =>
              b.score - a.score ||
              (b.card.views || 0) - (a.card.views || 0)
          )
          .slice(0, limit)
          .map((e) => e.card);
      }

      /**
       * Fallback. Data tag sangat sparse (602 tag untuk 885 artikel), jadi
       * untuk sebagian besar tag tidak ada artikel LUAR tag yang share tag
       * sibling. Kalau hasil ketatnya kosong, pakai artikel dalam tag ini
       * yang paling banyak dibaca, kecuali 5 teratas yang sudah dipakai
       * oleh section trending supaya tidak dobel.
       */
      const byViews = articlesForTag.value(tagSlug)
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0));

      const trendingIds = new Set(
        byViews.slice(0, 5).map((c) => String(c.id))
      );

      return byViews
        .filter((c) => !trendingIds.has(String(c.id)))
        .slice(0, limit);
    }
  );

  /** Cari nama tag yang enak dibaca dari slug */
  const tagNameBySlug = computed(() => (slug: string) => {
    return tags.value.find((t) => t.slug === slug)?.name || slug;
  });

  /**
   * True kalau tag benar-benar ada di hasil scan.
   * Dipakai halaman detail untuk membedakan "tag tidak ada" dari
   * "scan belum sempat sampai halaman itu".
   */
  const isKnownTag = computed(() => (slug: string) => {
    return tags.value.some((t) => t.slug === slug);
  });

  /**
   * Tambahkan satu artikel dari endpoint detail ke cache module.
   * Dibutuhkan ketika artikel tidak muncul di list publik
   * (`article-read`) namun dirujuk dari chip tag pada halaman detail.
   */
  const addArticle = (raw: RawArticle): void => {
    const c = ensureCache();
    if (c.articles.some((a) => String(a.id) === String(raw.id))) return;
    c.articles.push(raw);
    // Ref elements dalam syncFromCache menunjuk ke objek array yang sama,
    // sehingga mendorong ke `articles.value` memperbarui keduanya.
    articles.value.push(raw);
  };

  // Cache module sudah bisa terisi sebelum halaman ini dibuka (mis. user
  // datang dari /article/tag). Tanpa sync awal, articles = [] dan tag
  // yang valid akan terlihat "tidak ditemukan".
  syncFromCache();

  return {
    loading,
    done,
    scannedPages,
    totalData,
    progress,
    tags,
    articles,
    allCards,
    articlesForTag,
    siblingTags,
    trendingForTag,
    relatedForTag,
    tagNameBySlug,
    isKnownTag,
    addArticle,
    scanNext,
    scanUntil,
    scanAll,
    slugifyTag,
  };
}