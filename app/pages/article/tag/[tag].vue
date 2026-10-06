<template>
  <div class="article-tag-detail">
    <div class="container mx-auto max-w-[1280px] px-4 lg:px-0">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <header class="mb-6">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span
            class="h-10 w-10 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center"
          >
            <span class="text-xl font-bold text-orange-500">#</span>
          </span>
          <span class="min-w-0">
            <span class="block truncate">{{ tagName }}</span>
            <span v-if="total > 0" class="block text-sm font-normal text-gray-500 mt-1">
              {{ $t("page.articleTag.articleCount", { count: total }) }}
            </span>
          </span>
        </h1>
      </header>

      <!-- Loading -->
      <div v-if="loading && currentArticles.length === 0" class="space-y-4">
        <el-skeleton :rows="4" animated />
      </div>

      <!-- Tag tidak ditemukan -->
      <div
        v-else-if="tagMissing"
        class="text-center py-16 bg-white rounded-xl border border-gray-100"
      >
        <span class="inline-block text-6xl font-bold text-gray-300 mb-4">#</span>
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("page.articleTag.notFound") }}
        </h3>
        <Trulink to="/article/tag">
          <Trubutton
            :text="$t('page.articleTag.backToTags')"
            type="primary"
            size="medium"
            variant="solid"
            class="mt-4"
          />
        </Trulink>
      </div>

      <!-- Tidak ada artikel -->
      <div
        v-else-if="currentArticles.length === 0"
        class="text-center py-16 bg-white rounded-xl border border-gray-100"
      >
        <Icon name="material-symbols:article" class="text-6xl text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("label.noResults") }}
        </h3>
      </div>

      <template v-else>
        <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <!-- Kolom kiri: daftar artikel dengan tag ini, pagination 10 -->
          <div>
            <!-- Filter tag lain yang muncul di artikel tag ini -->
            <div v-if="filterTags.length" class="mb-5">
              <span class="text-sm font-semibold text-gray-600 mr-2">
                {{ $t("page.article.filterByTag") }}
              </span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="t in filterTags"
                  :key="t.slug"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  :class="
                    activeFilter === t.slug
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-300 hover:bg-orange-100'
                  "
                  @click="toggleFilter(t.slug)"
                >
                  {{ t.name }}
                  <span class="opacity-70">{{ t.count }}</span>
                </button>
              </div>
            </div>

            <h2 class="text-lg font-bold text-gray-900 mb-3">
              {{ activeFilter ? activeFilterName : tagName }}
            </h2>

            <CardsArticleListArticle :articles="currentArticles" />

            <div v-if="totalPages > 1" class="flex justify-center mt-8">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="filteredTotal"
                :page-size="perPage"
                :current-page="currentPage"
                @update:current-page="handlePageChange"
              />
            </div>
          </div>

          <!-- Kolom kanan: trending & related, gaya card kecil
               sama seperti artikel populer di /article -->
          <aside class="mt-8 lg:mt-0">
            <section v-if="trendingArticles.length" class="mb-8">
              <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="material-symbols:local-fire-department" class="text-orange-500" />
                {{ $t("page.articleTag.trending") }}
              </h2>
              <CardsArticleRowsmall
                :articles="trendingArticles"
                :max-title-lines="2"
                :empty-message="$t('label.noResults')"
              />
            </section>

            <section v-if="relatedArticles.length" class="mb-8">
              <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="material-symbols:link" class="text-orange-500" />
                {{ $t("page.articleTag.related") }}
              </h2>
              <CardsArticleRowsmall
                :articles="relatedArticles"
                :max-title-lines="2"
                :empty-message="$t('label.noResults')"
              />
            </section>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import CardsArticleListArticle from "~/components/cards/article/list/Article.vue";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { useArticleTags } from "~/composables/useArticleTags";
import { useFetchApi } from "~/composables/useFetchApi";

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const { updateHeaderHeight } = useHeaderHeight();

const perPage = 10;

const {
  loading,
  done,
  articlesForTag,
  siblingTags,
  trendingForTag,
  relatedForTag,
  tagNameBySlug,
  isKnownTag,
  addArticle,
  scanUntil,
} = useArticleTags();

const currentPage = ref(1);
const activeFilter = ref<string | null>(null);

const slug = computed(() => String(route.params.tag || ""));

const tagName = computed(() => tagNameBySlug.value(slug.value));

const allArticles = computed(() => articlesForTag.value(slug.value));

// Trending = paling banyak dibaca di dalam tag ini
const trendingArticles = computed(() =>
  trendingForTag.value(slug.value, 5)
);

// Related = artikel yang share tag dengan tag ini
const relatedArticles = computed(() => relatedForTag.value(slug.value, 5));

// Chip filter = tag lain yang muncul di artikel tag ini
const filterTags = computed(() => siblingTags.value(slug.value, 12));

// CardArticle.tags berisi NAMA tag, sedangkan filter memakai slug.
const activeFilterName = computed(
  () => filterTags.value.find((t) => t.slug === activeFilter.value)?.name || ""
);

const filteredArticles = computed(() => {
  if (!activeFilter.value) return allArticles.value;
  const name = activeFilterName.value;
  return allArticles.value.filter((a) => (a.tags || []).includes(name));
});

const filteredTotal = computed(() => filteredArticles.value.length);
const total = computed(() => allArticles.value.length);
const totalPages = computed(() => Math.ceil(filteredTotal.value / perPage));
const currentArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredArticles.value.slice(start, start + perPage);
});

const toggleFilter = (tagSlug: string) => {
  activeFilter.value = activeFilter.value === tagSlug ? null : tagSlug;
  currentPage.value = 1;
};

// Tag baru saja dipastikan tidak ada setelah scan selesai.
const tagMissing = computed(() => done.value && !isKnownTag.value(slug.value));

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("label.article"), to: "/article" },
  { text: $t("page.articleTag.title"), to: "/article/tag" },
  ...(tagName.value
    ? [{ text: tagName.value, to: `/article/tag/${slug.value}` }]
    : []),
]);

useHead({
  title: computed(() =>
    tagName.value
      ? `${tagName.value} - ${$t("page.articleTag.title")}`
      : $t("page.articleTag.title")
  ),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    {
      name: "description",
      content: $t("page.articleTag.subtitle", { tag: tagName.value }),
    },
    { name: "robots", content: tagName.value ? "index, follow" : "noindex" },
    {
      property: "og:title",
      content: tagName.value
        ? `${tagName.value} - ${$t("page.articleTag.title")}`
        : $t("page.articleTag.title"),
    },
    {
      property: "og:description",
      content: $t("page.articleTag.subtitle", { tag: tagName.value }),
    },
    { property: "og:type", content: "website" },
  ]),
  link: computed(() => [
    {
      rel: "canonical",
      href: `https://www.trumecs.com/article/tag/${slug.value}`,
    },
  ]),
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  router.push({
    path: `/article/tag/${slug.value}`,
    query: {
      page: page > 1 ? page : undefined,
      from: route.query.from || undefined,
    },
  });
};

// Scan bertahap: ambil artikel secukupnya untuk halaman yang sedang dilihat
const load = async () => {
  const page = route.query.page ? Number(route.query.page) || 1 : 1;
  currentPage.value = page > 0 ? page : 1;
  await scanUntil(slug.value, currentPage.value * perPage);
  await injectFromArticle();
};

/**
 * Beberapa artikel (mis. yang tidak tampil di list publik `article-read`)
 * hanya bisa diketahui lewat halaman detail. Saat halaman tag dibuka dengan
 * `?from=<url-artikel>`, kita menambahkan artikel tersebut ke cache supaya
 * halaman tag tidak kosong.
 */
const injectFromArticle = async () => {
  const from = typeof route.query.from === "string" ? route.query.from : "";
  if (!from) return;
  if (isKnownTag.value(slug.value)) return;

  try {
    const response = await useFetchApi<any>(
      `article-read/${encodeURIComponent(from)}`,
      `article-read-inject-${from}`,
      "get",
      null
    );
    const p = response.data?.payload;
    if (!p) return;
    addArticle({
      id: p.id,
      title: p.title,
      url: p.url,
      img: p.img,
      date: p.date,
      view: p.view,
      created_by: p.created_by,
      discription_seo: p.discription_seo,
      tag: p.tag,
      tag_en: p.tag_en,
      tag_ch: p.tag_ch,
    });
  } catch {
    // Tag akan tetap tampil "tidak ditemukan" jika fetch gagal.
  }
};

watch(slug, () => {
  // Filter tag lama tidak relevan kalau tag-nya sudah diganti.
  activeFilter.value = null;
  load();
});

watch(
  () => route.query.page,
  async (page) => {
    const next = page ? Number(page) || 1 : 1;
    if (next === currentPage.value) return;
    currentPage.value = next > 0 ? next : 1;
    await scanUntil(slug.value, currentPage.value * perPage);
    await injectFromArticle();
  }
);

onMounted(async () => {
  updateHeaderHeight();
  // scanUntil sudah scan bertahap sampai cukup, tidak perlu scanNext()
  // terpisah karena keduanya akan fetch halaman yang sama.
  await load();
});
</script>

<style scoped>
.article-tag-detail {
  min-height: calc(100vh - 200px);
}
</style>