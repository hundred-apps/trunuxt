<template>
  <div class="article-page">
    <div class="container">
      <div class="hidden lg:grid lg:grid-cols-12 gap-6 my-8">
        <div class="lg:col-span-6">
          <CardsArticleListFeaturedmain :article="mainFeaturedArticle" />
        </div>
        <div class="lg:col-span-6">
          <CardsArticleListFeaturedsub
            :articles="subFeaturedArticles"
            :start-index="1"
            :end-index="subFeaturedArticles.length"
          />
        </div>
      </div>

      <!-- Mobile Featured Layout (lg:hidden) -->
      <div class="lg:hidden my-4">
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="(article, index) in featuredArticles.slice(0, 5)"
            :key="index"
            class="featured-article"
          >
            <Trulink
              :to="`/article/${article.url}`"
              class="block bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div class="flex gap-3 p-2">
                <div class="w-1/3 aspect-[4/3] overflow-hidden rounded-lg">
                  <AppImage
                    :src="article.image"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                    sizes="100vw sm:50vw lg:800px"
                    width="800"
                    height="450"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
                <div class="w-2/3 flex flex-col justify-center">
                  <span class="text-xs font-semibold text-orange-500">{{
                    article.category
                  }}</span>
                  <h3 class="font-semibold text-base line-clamp-3">
                    {{ article.title }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">
                    <Icon
                      name="material-symbols:calendar-today"
                      class="inline mr-1 text-xs"
                    />
                    {{ formatDate(article.date) }}
                  </p>
                </div>
              </div>
            </Trulink>
          </div>
        </div>
      </div>
    </div>
    <section id="article-list" class="pt-8"></section>

    <!-- Tabs Search Section -->
    <!-- <section class="tabsearch py-8 lg:py-12 bg-gray-50">
      <div class="container">
        <div class="text-center mb-6 lg:mb-8">
          <h4 class="text-xl lg:text-2xl font-bold mb-2">
            Kirim Permintaan Barang Lebih Mudah dan Cepat
          </h4>
          <p class="text-gray-600 text-sm lg:text-base">
            Dengan
            <Trulink to="/" class="text-orange-500 hover:underline"
              >Trumecs</Trulink
            >, proses pengadaan barang menjadi lebih efisien
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <el-tabs v-model="activeTab" class="request-tabs">
            <el-tab-pane label="Produk" name="product">
              <RequestForm type="product" />
            </el-tab-pane>
            <el-tab-pane label="Jasa" name="service">
              <RequestForm type="service" />
            </el-tab-pane>
            <el-tab-pane label="Rental" name="rental">
              <RequestForm type="rental" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section> -->

    <!-- Main Content Area -->
    <section class="article-content py-8 lg:py-12">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <!-- Articles List - Left Column (lg:col-span-8) -->
          <div class="lg:col-span-8">
            <!-- Trending for Mobile (lg:hidden) -->
            <div class="lg:hidden mb-6">
              <div class="bg-orange-100 rounded-lg shadow-sm p-4">
                <h5 class="font-bold mb-3 flex items-center">
                  <Icon
                    name="material-symbols:local-fire"
                    class="text-orange-500 mr-2"
                  />
                  {{ $t("label.trendingArticle") }}
                </h5>
                <div class="grid grid-cols-1 gap-3">
                  <CardsArticleRowsmall
                    :articles="trendingArticle"
                    :show-ranking="false"
                    image-size="sm"
                    :max-title-lines="2"
                  />
                </div>
              </div>
            </div>

            <!-- Articles List -->
            <div class="grid grid-cols-1 gap-4">
              <p class="text-xl fw-bold">{{ $t("label.article") }}</p>

              <!-- Pencarian artikel (hanya pencarian, tanpa filter tag) -->
              <div class="relative">
                <input
                  v-model="searchDraft"
                  type="search"
                  :placeholder="$t('page.article.searchPlaceholder')"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm outline-none transition-colors focus:border-orange-500"
                  @keyup.enter="applySearch"
                />
                <button
                  type="button"
                  class="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 transition-colors hover:text-orange-500"
                  :aria-label="$t('page.article.search')"
                  @click="applySearch"
                >
                  <Icon name="material-symbols:search" class="text-lg" />
                </button>
                <button
                  v-if="searchDraft"
                  type="button"
                  class="absolute right-9 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 transition-colors hover:text-gray-600"
                  :aria-label="$t('page.article.clearSearch')"
                  @click="clearSearch"
                >
                  <Icon name="material-symbols:close" class="text-lg" />
                </button>
              </div>

              <div
                v-if="activeSearch"
                class="flex items-center gap-2 text-sm text-gray-600"
              >
                <span>{{ $t("page.article.searchResultFor") }}</span>
                <span class="font-semibold text-orange-600">
                  "{{ activeSearch }}"
                </span>
                <span>({{ filteredArticles.length }})</span>
              </div>

              <div v-if="loading" class="text-center py-8">
                <el-skeleton :rows="3" animated />
              </div>

              <!-- Error state: tampilkan pesan, jangan goBack() -->
              <div
                v-else-if="error"
                class="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
              >
                <Icon
                  name="material-symbols:error-outline"
                  class="text-3xl text-red-500 mb-2"
                />
                <p class="text-red-700">{{ error }}</p>
                <button
                  type="button"
                  class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                  @click="fetchArticle()"
                >
                  {{ $t("page.article.retry") }}
                </button>
              </div>

              <!-- Empty State -->
              <div
                v-else-if="transformedArticles.length === 0"
                class="text-center py-8"
              >
                <el-empty :description="$t('page.article.empty')" />
              </div>

              <!-- Article List -->
              <CardsArticleListArticle
                v-else
                :articles="filteredArticles"
                @article-click="handleArticleClick"
              />
            </div>

            <!-- Pagination disembunyikan saat searching -->
            <div v-if="!activeSearch" class="flex justify-center mt-8">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="totalArticles"
                :page-size="perPage"
                v-model:current-page="currentPage"
                @update:current-page="handlePageChange"
              />
            </div>
          </div>

          <!-- Sidebar - Right Column (lg:col-span-4) -->
          <div class="hidden lg:block lg:col-span-4">
            <div
              class="sticky top-[var(--header-height,150px)]"
              style="--header-height: 150px"
            >
              <!-- Trending Section -->
              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                  class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4"
                >
                  <h5 class="font-bold flex items-center">
                    <Icon name="material-symbols:local-fire" class="mr-2" />
                    {{ $t("label.trendingArticle") }}
                  </h5>
                </div>
                <div class="divide-y divide-gray-100">
                  <CardsArticleRowsmall
                    :articles="trendingArticle"
                    :show-ranking="false"
                    image-size="sm"
                    :max-title-lines="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Article, CardArticle } from "~/types/article";
import {
  defineArticle,
  defineBreadcrumb,
  useSchemaOrg,
} from "@unhead/schema-org/vue";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { parseTagString, useArticleTags } from "~/composables/useArticleTags";

const { headerHeight, updateHeaderHeight } = useHeaderHeight();
const { t } = useI18n();
const { allCards, scanAll: scanAllForSearch } = useArticleTags();

useHead({
  title: computed(() => t("page.article.metaTitle")),
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content: computed(() => t("page.article.metaDesc")),
    },
    {
      property: "og:title",
      content: computed(() => `${t("page.article.metaTitle")} | Trumecs.com`),
    },
    {
      property: "og:description",
      content: computed(() => t("page.article.metaDesc")),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  link: [{ rel: "canonical", href: "https://www.trumecs.com/article" }],
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      {
        position: 1,
        name: computed(() => t("breadcrumb.home")),
        item: "https://www.trumecs.com",
      },
      {
        position: 2,
        name: computed(() => t("breadcrumb.article")),
        item: "https://www.trumecs.com/article",
      },
    ],
  }),
]);

const RequestForm = {
  props: ["type"],
  template: `
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-input
          v-model="form.nama"
          :placeholder="t('page.article.formName')"
          size="large"
        />
        <el-input
          v-model="form.email"
          :placeholder="t('page.article.formEmail')"
          size="large"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-input
          v-model="form.perusahaan"
          :placeholder="t('page.article.formCompany')"
          size="large"
        />
        <el-input
          v-model="form.telepon"
          :placeholder="t('page.article.formPhone')"
          size="large"
        />
      </div>
      <el-input
        v-model="form.permintaan"
        :rows="4"
        type="textarea"
        :placeholder="t('page.article.formRequest')"
      />
      <div class="text-center">
        <el-button
          type="primary"
          native-type="submit"
          size="large"
          :loading="loading"
        >
          {{ t('page.article.formSubmit') }}
        </el-button>
      </div>
    </form>
  `,
  setup() {
    const { t } = useI18n();
    // Diambil di scope setup, BUKAN di dalam async fetch* setelah await.
    // Memanggil useRuntimeConfig() setelah await kehilangan konteks Nuxt
    // dan memicu "NUXT_E1001: A composable that requires access to the
    // Nuxt instance was called outside of ... Vue setup function".
    const config = useRuntimeConfig();
    const form = ref({
      nama: "",
      email: "",
      perusahaan: "",
      telepon: "",
      permintaan: "",
    });
    const loading = ref(false);

    const handleSubmit = () => {
      loading.value = true;
      // Simulate API call
      setTimeout(() => {
        loading.value = false;
        ElMessage.success(t("page.article.formSuccess"));
        form.value = {
          nama: "",
          email: "",
          perusahaan: "",
          telepon: "",
          permintaan: "",
        };
      }, 1500);
    };

    return { t, form, loading, handleSubmit };
  },
};

const loading = ref(true);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();
const goBack = () => router.back();
const config = useRuntimeConfig();

// Update tipe data
const dataArticle = ref<CardArticle[]>([]);
const trendingArticle = ref<CardArticle[]>([]);

const mainFeaturedArticle = computed<CardArticle | null>(() => {
  return featuredArticles.value[0] || null;
});

const subFeaturedArticles = computed(() => {
  return featuredArticles.value.slice(0, 5) || [];
});

// useSchemaOrg([
//   defineArticle({
//     headline: mainFeaturedArticle.value?.title,
//     image: mainFeaturedArticle.value?.image,
//     datePublished: mainFeaturedArticle.value?.date,
//     author: {
//       name: mainFeaturedArticle.value?.author?.name,
//     },
//   }),
// ]);

// State
const activeTab = ref("product");
const currentPage = ref(1);
const perPage = ref(10);
const totalArticles = ref(50);

const featuredArticles = ref<CardArticle[]>([]);
const loadingFeatured = ref(false);

const transformedArticles = computed(() => {
  if (!dataArticle.value || dataArticle.value.length === 0) {
    return []; // Return empty array if no data
  }
  return dataArticle.value;
});

// ============ PENCARIAN ARTIKEL ============
//
// Hanya pencarian teks di halaman list artikel. Tidak ada filter tag di sini
// (filter tag hanya ada di halaman detail artikel).

const searchDraft = ref(String(route.query.q || ""));
const activeSearch = ref(String(route.query.q || ""));

const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const omitQuery = (
  query: Record<string, any>,
  key: string
): Record<string, any> => {
  const next = { ...query };
  delete next[key];
  return next;
};

const filteredArticles = computed<CardArticle[]>(() => {
  const q = normalizeText(activeSearch.value);
  if (!q) return transformedArticles.value;

  // Saat searching, saring seluruh artikel yang sudah tersimpan di cache
  // (seluruh dataset, bukan hanya halaman yang sedang dimuat di UI).
  return allCards.value.filter((a) => {
    const haystack = [a.title, (a as any).category, a.url, a.date]
      .map(normalizeText)
      .join(" ");
    // semua kata kunci harus cocok (AND)
    return q.split(" ").every((word) => haystack.includes(word));
  });
});

const applySearch = async () => {
  const q = searchDraft.value.trim();
  activeSearch.value = q;
  currentPage.value = 1;

  // Pastikan seluruh dataset artikel sudah terscan, supaya pencarian
  // tidak terbatas pada halaman artikel yang sedang ditampilkan.
  if (q) scanAllForSearch();

  await router.replace({
    query: q ? { ...route.query, q } : omitQuery(route.query, "q"),
  });
};

const clearSearch = async () => {
  searchDraft.value = "";
  await applySearch();
};

// Ikuti perubahan ?q= dari luar (mis. dari Navbar)
watch(
  () => route.query.q,
  (value) => {
    const q = String(value || "");
    if (q !== activeSearch.value) {
      activeSearch.value = q;
      searchDraft.value = q;
      if (q) scanAllForSearch();
    }
  },
  { immediate: true }
);

const handleArticleClick = (article: Article) => {
  // Bisa untuk analytics
};

const fetchTrendingArticles = async () => {
  loadingFeatured.value = true;

  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read`, // Gunakan endpoint yang sama dengan limit
      `trending-articles`,
      "get",
      null
    );

    if (response.status === "success") {
      const apiData = response.data!.payload.trend_article;

      // Transform data featured
      trendingArticle.value = apiData.map((item: Article) => {
        return {
          id: item.id,
          url: item.url || `article-${item.id}`,
          title: item.title || "Untitled",
          image: item.img
            ? `${
                config.public.baseImageArticle ||
                "https://www.trumecs.com/public/image/artikel/"
              }${item.img}`
            : "https://via.placeholder.com/300x200?text=No+Image",
          category: item.tag,
          date: item.date,
          views: item.view,
        };
      });
    }
  } catch (error) {
  } finally {
    loadingFeatured.value = false;
  }
};

const fetchFeaturedArticles = async () => {
  loadingFeatured.value = true;

  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read?page=1&limit=5`, // Gunakan endpoint yang sama dengan limit
      `featured-articles`,
      "get",
      null
    );

    if (response.status === "success") {
      const apiData = response.data!.payload.main_article;

      // Transform data featured
      featuredArticles.value = apiData.map((item: Article) => {
        return {
          id: item.id,
          url: item.url || `article-${item.id}`,
          title: item.title || "Untitled",
          image: item.img
            ? item.img.startsWith("http")
              ? item.img
              : `${
                  config.public.baseImageArticle ||
                  "https://www.trumecs.com/public/image/artikel/"
                }${item.img}`
            : "https://via.placeholder.com/300x200?text=No+Image",
          category: item.tag,
          date: item.date,
          excerpt:
            item.discription_seo ||
            (item.value
              ? item.value.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
              : "No description"),
          author: item.created_by
            ? {
                name: `${item.created_by}`,
              }
            : {
                name: "Anonymous",
              },
        };
      });
    }
  } catch (error) {
  } finally {
    loadingFeatured.value = false;
  }
};

// Helper: nama kategori dari tag artikel.
// Tag disimpan dalam dua format ("#A #B #C" atau "a, b"), jadi pakai
// parseTagString supaya tidak menampilkan "#A #B #C" sebagai satu kategori.
const extractCategoryFromTags = (tags: unknown): string => {
  const list = parseTagString(typeof tags === "string" ? tags : undefined);
  return list[0] || "General";
};

// Helper: excerpt dari description_seo atau isi artikel.
// Field dari API bisa null/berupa objek, jadi selalu dipaksa jadi string
// sebelum .replace() dipanggil (kalau tidak, akan throw).
const createExcerpt = (description: unknown, content: unknown): string => {
  const desc = typeof description === "string" ? description.trim() : "";
  if (desc) return desc;

  const body = typeof content === "string" ? content : "";
  const stripped = body.replace(/<[^>]*>/g, "").trim();
  if (!stripped) return "";

  return stripped.length > 150 ? stripped.substring(0, 150) + "..." : stripped;
};

const articleImageBase = () =>
  (config.public.baseImageArticle as string) ||
  "https://www.trumecs.com/public/image/artikel/";

const fetchArticle = async () => {
  loading.value = true;
  error.value = null;
  try {
    const page = currentPage.value || 1;
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read?page=${page}`,
      `article-read-${page}`,
      "get",
      null
    );

    if (response.status !== "success" || !response.data) {
      error.value = t("page.article.loadError");
      return;
    }

    // Guard: payload / list_article bisa tidak ada kalau API berubah.
    const list = response.data.payload?.list_article;
    dataArticle.value = Array.isArray(list) ? list.map(transformArticle) : [];

    // Guard: pagination tidak selalu dikirim API.
    const total = response.data.pagination?.total_data;
    if (typeof total === "number" && Number.isFinite(total)) {
      totalArticles.value = total;
    }
  } catch (e) {
    console.error("[article] fetchArticle gagal:", e);
    error.value = t("page.article.loadError");
  } finally {
    loading.value = false;
  }
};

const transformArticle = (item: Article): CardArticle => ({
  id: item.id,
  url: item.url || `article-${item.id}`,
  title: item.title || "Untitled",
  image: item.img
    ? item.img.startsWith("http")
      ? item.img
      : `${articleImageBase()}${item.img}`
    : "",
  category: extractCategoryFromTags(item.tag),
  date: item.date,
  excerpt: createExcerpt(item.discription_seo, item.value),
  author: {
    name: item.created_by ? `${item.created_by}` : "Anonymous",
    avatar: "",
    role: "Contributor",
  },
});

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start", // 'start', 'center', 'end', atau 'nearest'
    });
  }
};

const handlePageChange = async (page: number) => {
  await router.push({ query: { ...route.query, page } });
  scrollToSection("article-list");
};

// Initialize from URL query
onMounted(async () => {
  updateHeaderHeight();
  await fetchTrendingArticles();
  await fetchFeaturedArticles();
  const pageFromUrl = route.query.page ? Number(route.query.page) : 1;
  currentPage.value = pageFromUrl || 1;
  // fetchArticle() dipanggil oleh watch(route.query.page) di bawah,
  // JANGAN dipanggil lagi di sini atau data akan di-fetch 2x.
});

// Watch route query changes.
// immediate: true + onMounted = fetch ganda, jadi watch ini tidak memakai
// immediate; pemanggilan pertama dilakukan lewat flag di bawah.
let initialFetchDone = false;

watch(
  () => route.query.page,
  async (newPage) => {
    const next = newPage ? Number(newPage) : 1;
    currentPage.value = Number.isFinite(next) && next > 0 ? next : 1;
    await fetchArticle();
    initialFetchDone = true;
  },
  { immediate: true }
);
</script>

<style scoped>
/* Container */
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:text-orange-500 {
  color: #fa8420;
}

/* Custom colors */
.text-orange-500 {
  color: #fa8420;
}

.bg-orange-500 {
  background-color: #fa8420;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.hover\:bg-orange-50:hover {
  background-color: #fff7ed;
}

.from-orange-500 {
  --tw-gradient-from: #fa8420;
}

.to-orange-600 {
  --tw-gradient-to: #ea6f0e;
}

/* Pagination overrides */
:deep(.el-pagination) {
  --el-pagination-button-bg-color: transparent;
  --el-pagination-hover-color: #fa8420;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #fa8420;
}

/* Tabs overrides */
:deep(.el-tabs__item.is-active) {
  color: #fa8420;
}

:deep(.el-tabs__active-bar) {
  background-color: #fa8420;
}

:deep(.el-tabs__item:hover) {
  color: #fa8420;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card {
  animation: fadeIn 0.5s ease-out;
}

/* Featured article hover */
.featured-article .group:hover .shadow-lg {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
