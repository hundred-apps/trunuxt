<template>
  <div class="article-detail-page">
    <!-- Breadcrumb -->

    <!-- Loading -->
    <div v-if="loading && !article" class="container py-12 text-center">
      <Icon
        name="svg-spinners:90-ring-with-bg"
        class="text-6xl text-orange-500 mb-4 animate-spin"
      />
      <h2 class="text-2xl font-bold text-gray-700 mb-2">
        {{ $t("page.article.loading") }}
      </h2>
      <p class="text-gray-500 mb-6">{{ $t("page.article.loadingDesc") }}</p>
    </div>

    <!-- Error / Not Found -->
    <div v-else-if="!article" class="container py-12 text-center">
      <Icon
        name="material-symbols:error-outline"
        class="text-6xl text-red-400 mb-4"
      />
      <h2 class="text-2xl font-bold text-gray-700 mb-2">
        {{ $t("page.article.notFound") }}
      </h2>
      <p class="text-gray-500 mb-6">
        {{ error || $t("page.article.notFoundDesc") }}
      </p>
      <button
        type="button"
        class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        @click="fetchDetailArticle()"
      >
        {{ $t("page.article.retry") }}
      </button>
    </div>

    <!-- Main Content - Only show if article exists -->
    <template v-if="article">
      <section class="article-detail py-4" id="article-detail">
        <div class="container">
          <Breadcrumbs :items="articleBreadcrumb" />
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <!-- Left Column - Article Content (lg:col-span-8) -->
            <div class="lg:col-span-8">
              <article class="overflow-hidden">
                <div class="">
                  <!-- Title -->
                  <h1
                    class="text-2xl lg:text-3xl font-bold mb-3 px-2 lg:px-0"
                    itemprop="headline"
                  >
                    {{ article.title }}
                  </h1>

                  <!-- Meta Info -->
                  <div
                    class="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4 px-2 lg:px-0"
                  >
                    <div class="flex items-center">
                      <Icon
                        name="material-symbols:calendar-today"
                        class="mr-2"
                      />
                      <span>{{ formatDate(article.date) }}</span>
                    </div>
                    <div class="flex items-center">
                      <Icon name="material-symbols:person" class="mr-2" />
                      <span>{{ article.author.name }}</span>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div
                    v-if="articleTags.length"
                    class="flex flex-wrap gap-2 mb-4 px-2 lg:px-0"
                  >
                    <span
                      v-for="tag in articleTags"
                      :key="tag"
                      class="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- Featured Image -->
                  <div class="article-image mb-6">
                    <AppImage
                      :src="article.image"
                      :alt="article.title"
                      class="w-full"
                      :style="{ maxHeight: '500px', objectFit: 'cover' }"
                      sizes="100vw lg:800px"
                      width="800"
                      height="500"
                      loading="eager"
                      fetchpriority="high"
                      preload
                    />
                  </div>

                  <!-- Article Content with Dynamic Insertions -->
                  <div
                    class="article-content prose prose-sm lg:prose-base max-w-none px-2 lg:px-0"
                  >
                    <div v-html="processedContent"></div>
                  </div>

                  <!-- Tags -->
                  <div
                    v-if="articleTags.length"
                    class="mt-6 pt-4 px-2 border-t border-gray-200"
                  >
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-sm font-semibold text-gray-600 mr-1">
                        {{ $t("page.article.tags") }}
                      </span>
                      <Trulink
                        v-for="tag in articleTags"
                        :key="tag"
                        :to="tagFilterLink(tag)"
                        class="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 transition-colors hover:border-orange-300 hover:bg-orange-100"
                      >
                        #{{ tag }}
                      </Trulink>
                    </div>
                  </div>

                  <!-- Share Buttons - Mobile Only -->
                  <div
                    class="share-buttons mt-6 pt-4 px-2 lg:px-0 border-t border-gray-200"
                  >
                    <span class="font-semibold mr-3">{{
                      $t("page.article.share")
                    }}</span>
                    <div class="flex gap-2">
                      <button
                        v-for="share in shareButtons"
                        :key="share.name"
                        @click="shareArticle(share)"
                        class="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors"
                      >
                        <Icon :name="share.icon" class="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Right Column - Sidebar (lg:col-span-4) -->
            <div class="lg:col-span-4">
              <div
                class="sticky top-[var(--header-height,80px)] flex flex-col gap-4"
                style="--header-height: 80px"
              >
                <!-- Trending Section -->
                <div class="overflow-hidden">
                  <div class="border-b border-gray-200 py-3">
                    <h5 class="font-bold flex items-center">
                      <Icon
                        name="material-symbols:local-fire"
                        class="text-orange-500 mr-2"
                      />
                      {{ $t("label.trendingArticle") }}
                    </h5>
                  </div>
                  <div class="py-3">
                    <CardsArticleRowsmall
                      :articles="trendingArticles"
                      :show-ranking="false"
                      image-size="sm"
                      :max-title-lines="2"
                    />
                  </div>
                </div>

                <!-- Maintenance Banner - Desktop Only -->
                <CardsArticleAds v-if="randomAdsTop" v-bind="randomAdsTop" />

                <!-- Related Articles -->
                <div class="overflow-hidden">
                  <div class="border-b border-gray-200 px-2 py-3">
                    <h5 class="font-bold">{{ $t("label.relatedArticle") }}</h5>
                  </div>
                  <div class="py-3">
                    <CardsArticleRowsmall
                      :articles="visibleRelatedArticles"
                      :show-ranking="false"
                      image-size="sm"
                      :max-title-lines="2"
                    />
                  </div>
                </div>

                <!-- Construction Banner - Desktop Only -->
                <CardsArticleAds
                  v-if="randomAdsBottom"
                  v-bind="randomAdsBottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Request Form Section -->
      <!-- <section class="request-form py-8 lg:py-12 bg-gray-50" id="request-form">
        <div class="container">
          <div class="space-y-4">
            <h3 class="text-xl lg:text-2xl font-bold">
              Tidak menemukan barang? kirim permintaan sekarang!
            </h3>
            <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <RequestForm />
            </div>
          </div>
        </div>
      </section> -->

      <!-- Related Products Section -->
      <!-- <section class="product-related py-8 lg:py-12" id="product-related">
        <div class="container">
          <h3 class="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
            Produk Terkait
          </h3> -->

      <!-- Desktop Grid (lg:grid) -->
      <!-- <div class="hidden lg:grid lg:grid-cols-4 gap-4">
            <ProductCard
              v-for="product in relatedProducts"
              :key="product.id"
              :product="product"
            />
          </div> -->

      <!-- Mobile Slider (lg:hidden) -->
      <!-- <div class="lg:hidden">
            <div class="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
              <div
                v-for="product in relatedProducts"
                :key="product.id"
                class="flex-shrink-0 w-[160px] snap-start"
              >
                <ProductCardMobile :product="product" />
              </div>
            </div>
          </div> -->
      <!-- </div>
      </section> -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Article, CardArticle } from "~/types/article";
import type { ProductCategory, ArticleAd } from "~/types/category";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import {
  slugifyTag,
  parseTagString,
  useArticleTags,
} from "~/composables/useArticleTags";

// ============ SETUP COMPOSABLES (di atas!) ============
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const config = useRuntimeConfig();
const { headerHeight, updateHeaderHeight } = useHeaderHeight();

// ============ STATE ============
const article = ref<CardArticle | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const slug = ref(route.params.slug as string);

// ✅ Deklarasi SEBELUM computed yang menggunakannya
const trendingArticles = ref<CardArticle[]>([]);
const relatedArticles = ref<CardArticle[]>([]);
const categories = ref<ArticleAd[]>([]);
const randomAdsTop = ref<ArticleAd | null>(null);
const randomAdsBottom = ref<ArticleAd | null>(null);
const activeRelatedTag = ref<string | null>(null);

// ============ SEO (setelah t dideklarasikan) ============
useHead({
  title: computed(() => article.value?.title || t("breadcrumb.article")),
  titleTemplate: "%s | Trumecs.com",
});

useSeoMeta({
  title: computed(() => article.value?.title),
  ogTitle: computed(() => article.value?.title),
  description: computed(
    () =>
      article.value?.excerpt ||
      article.value?.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
      ""
  ),
  ogDescription: computed(
    () =>
      article.value?.excerpt ||
      article.value?.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
      ""
  ),
  ogImage: computed(() => article.value?.image),
  ogType: "article",
  ogSiteName: "Trumecs.com",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  canonical: computed(
    () => `https://www.trumecs.com/article/${article.value?.url}`
  ),
});

useSchemaOrg([
  computed(() =>
    defineBreadcrumb({
      itemListElement: [
        { position: 1, name: "Home", item: "https://www.trumecs.com" },
        {
          position: 2,
          name: "Artikel",
          item: "https://www.trumecs.com/article",
        },
        {
          position: 3,
          name: article.value?.title || "Artikel",
          item: `https://www.trumecs.com/article/${article.value?.url}`,
        },
      ],
    })
  ),
]);

// ============ COMPUTED TAGS ============
// Panggil di scope setup; hasilnya dipakai di computed + fetch.
const { articlesForTag, scanAll } = useArticleTags();

const articleTags = computed<string[]>(() => article.value?.tags ?? []);

const tagFilterLink = (tag: string): string => {
  const from = article.value?.url
    ? `?from=${encodeURIComponent(article.value.url)}`
    : "";
  return `/article/tag/${slugifyTag(tag)}${from}`;
};

const relatedArticleTags = computed<string[]>(() => articleTags.value);

/**
 * Chip filter memakai tag milik ARTIKEL INI.
 *
 * Sebelumnya chip diambil dari tag artikel `related`, tapi endpoint
 * `article-read/{slug}` mengembalikan `related` dengan kolom `tag` kosong.
 * Akibatnya `relatedArticleTags` selalu [] dan blok filter tidak pernah tampil.
 */
const localRelatedArticles = computed<CardArticle[]>(() => {
  const seen = new Set<string>([String(article.value?.id ?? "")]);
  const out: CardArticle[] = [];

  for (const tag of articleTags.value) {
    for (const a of articlesForTag.value(slugifyTag(tag))) {
      const id = String(a.id);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(a);
    }
  }

  return out;
});

/**
 * Related = hasil scan lokal (punya tag, bisa difilter) digabung dengan
 * `related` dari API (sudah dinormalisasi server berdasarkan `score`).
 */
const allRelatedArticles = computed<CardArticle[]>(() => {
  const out: CardArticle[] = [];
  const seen = new Set<string>();

  for (const a of [...localRelatedArticles.value, ...relatedArticles.value]) {
    const id = String(a.id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(a);
  }

  return out.slice(0, 5);
});

const relatedCountByTag = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {};
  for (const tag of relatedArticleTags.value) {
    out[tag] = allRelatedArticles.value.filter((a) =>
      (a.tags || []).includes(tag)
    ).length;
  }
  return out;
});

const toggleRelatedTag = (tag: string) => {
  activeRelatedTag.value = activeRelatedTag.value === tag ? null : tag;
};

const visibleRelatedArticles = computed<CardArticle[]>(() => {
  if (!activeRelatedTag.value) return allRelatedArticles.value;
  return allRelatedArticles.value.filter((a) =>
    (a.tags || []).includes(activeRelatedTag.value as string)
  );
});

// ============ BREADCRUMB ============
const articleBreadcrumb = computed(() => [
  { text: t("breadcrumb.home"), to: "/" },
  { text: t("breadcrumb.article"), to: "/article" },
  { text: article.value?.title || t("label.loading") },
]);

// ============ HELPERS ============
const goBack = () => router.back();

// config.public.baseImageArticle (bukan baseURLIMGARTICLE) adalah key yang benar.
const articleImageBase = () =>
  (config.public.baseImageArticle as string) ||
  "https://www.trumecs.com/public/image/artikel/";

// Tag artikel datang dalam dua format ("#A #B #C" atau "a, b"),
// jadi selalu lewat parseTagString supaya tiap tag terpisah.
const extractTags = (tags: unknown): string[] =>
  parseTagString(typeof tags === "string" ? tags : undefined);

const setRandomAds = () => {
  if (categories.value.length < 2) return;
  const shuffled = [...categories.value].sort(() => 0.5 - Math.random());
  randomAdsTop.value = shuffled[0];
  randomAdsBottom.value = shuffled[1];
};

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

// ============ FETCH FUNCTIONS ============
const fetchTrendingArticles = async () => {
  try {
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read`,
      `trending-articles`,
      "get",
      null
    );

    // ✅ Gunakan .value untuk Ref
    if (response.status === "success" && response.data) {
      const apiData = response.data!.payload.trend_article;

      trendingArticles.value = Array.isArray(apiData)
        ? apiData.map((item: Article) => ({
            id: item.id,
            url: item.url || `article-${item.id}`,
            title: item.title || "Untitled",
            image: item.img
              ? item.img.startsWith("http")
                ? item.img
                : `${articleImageBase()}${item.img}`
              : "",
            category: item.tag,
            date: item.date,
            views: item.view,
          }))
        : [];
    }
  } catch (e) {
    console.error("Failed to fetch trending:", e);
  }
};

const fetchRelatedArticles = async () => {
  try {
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read/${slug.value}`,
      `article-trending-${slug.value}`,
      "get",
      null
    );

    if (response.status === "success" && response.data) {
      const apiData = response.data!.payload?.related;

      relatedArticles.value = Array.isArray(apiData)
        ? apiData.map((item: Article) => ({
            id: item.id,
            url: item.url || `article-${item.id}`,
            title: item.title || "Untitled",
            image: item.img
              ? item.img.startsWith("http")
                ? item.img
                : `${articleImageBase()}${item.img}`
              : "",
            category: item.tag,
            date: item.date,
            views: item.view,
          }))
        : [];
    }
  } catch (e) {
    console.error("Failed to fetch related:", e);
  }
};

const fetchDetailArticle = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read/${slug.value}`,
      `article-read-${slug.value}`,
      "get",
      null
    );

    if (response.status !== "success" || !response.data?.payload?.id) {
      error.value = t("page.article.loadError");
      article.value = null;
      return;
    }

    const apiData = response.data!.payload;

    // Update view (opsional, tidak boleh menggagalkan render)
    try {
      await useFetchApi(
        `article/update-view/${apiData.id}`,
        `article-update-view-${apiData.id}`,
        "put",
        null
      );
    } catch (e) {
      console.warn("Failed to update view:", e);
    }

    const tags = extractTags(apiData.tag);

    article.value = {
      id: apiData.id,
      url: apiData.url || `article-${apiData.id}`,
      title: apiData.title || "Untitled",
      image: apiData.img
        ? apiData.img.startsWith("http")
          ? apiData.img
          : `${articleImageBase()}${apiData.img}`
        : "",
      category: tags[0] || "General",
      tags,
      date: apiData.date,
      excerpt: apiData.discription_seo || "",
      content: apiData.value || "",
      author: {
        name: apiData.created_by || "Anonymous",
        avatar: "",
        role: apiData.created_by ? "Contributor" : "Guest",
      },
    };
  } catch (e) {
    console.error("Error fetching article:", e);
    error.value = t("page.article.loadError");
    article.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await useFetchApi<BaseResponse<ProductCategory>>(
      `category-read/`,
      `category-for-ads`,
      "get",
      null
    );

    if (response.status === "success" && response.data) {
      const apiData = response.data!.payload?.category?.products;

      categories.value = Array.isArray(apiData)
        ? apiData.map((item: ProductCategory) => ({
            title: `Segala Hal Tentang ${item.name}`,
            description: `Bingung memilih ${item.name} sesuai dengan kebutuhan anda?`,
            imageUrl: `https://migration.trumecs.com/article/ads/${item.name?.toLowerCase()}.png`,
            imageAlt: `Gambar Rekayasa Tentang ${item.name}`,
            buttonLink: `https://wa.me/+6285176912338`,
            buttonText: `Konsultasikan kebutuhan ${item.name} bersama kami`,
          }))
        : [];
    }
  } catch (e) {
    console.error("Failed to fetch categories:", e);
  }
};

// ============ PROCESSED CONTENT ============
const processedContent = computed(() => {
  return (
    article.value?.content
      ?.replace(/(<p>\s*(&nbsp;|\s)*<\/p>)/gi, "")
      ?.replace(/&nbsp;/g, " ") || ""
  );
});

// ============ SHARE ============
const shareButtons = [
  {
    name: "facebook",
    icon: "logos:facebook",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  {
    name: "twitter",
    icon: "skill-icons:twitter",
    url: "https://twitter.com/intent/tweet?text=",
  },
  {
    name: "linkedin",
    icon: "logos:linkedin-icon",
    url: "https://www.linkedin.com/shareArticle?mini=true&url=",
  },
  {
    name: "pinterest",
    icon: "logos:pinterest",
    url: "https://pinterest.com/pin/create/button/?url=",
  },
  {
    name: "whatsapp",
    icon: "logos:whatsapp-icon",
    url: "https://wa.me/?text=",
  },
];

const shareArticle = (share: any) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(article.value?.title || "");
  let shareUrl = "";

  switch (share.name) {
    case "facebook":
      shareUrl = `${share.url}${url}`;
      break;
    case "twitter":
      shareUrl = `${share.url}${title}%20${url}`;
      break;
    case "linkedin":
      shareUrl = `${share.url}${url}&title=${title}`;
      break;
    case "pinterest":
      shareUrl = `${share.url}${url}&description=${title}`;
      break;
    case "whatsapp":
      shareUrl = `${share.url}${title}%20-%20${url}`;
      break;
    default:
      shareUrl = `${share.url}${url}`;
  }

  window.open(shareUrl, "_blank", "width=600,height=400");
};

// ============ LIFECYCLE ============
onMounted(async () => {
  updateHeaderHeight();
  await fetchDetailArticle();
  await fetchTrendingArticles();
  await fetchRelatedArticles();
  await fetchCategories();
  setRandomAds();

  // Artikel terkait + filter tag butuh tag artikel, yang hanya ada di
  // hasil scan lokal. Cache-nya module scope, jadi sekali saja per sesi.
  if (articleTags.value.length) {
    scanAll();
  }
});

watch(
  () => route.params.slug,
  async (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
      slug.value = newSlug as string;
      await fetchDetailArticle();
      await fetchRelatedArticles();
      if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }
);
</script>
