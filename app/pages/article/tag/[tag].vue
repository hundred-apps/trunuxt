<template>
  <div class="article-tag-detail">
    <div class="container mx-auto max-w-[1280px] px-4 lg:px-0">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <header class="mb-6">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span
            class="h-10 w-10 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center"
          >
            <Icon name="material-symbols:sell" class="text-xl text-orange-500" />
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
        v-else-if="!tagName"
        class="text-center py-16 bg-white rounded-xl border border-gray-100"
      >
        <Icon name="material-symbols:sell" class="text-6xl text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("page.articleTag.notFound") }}
        </h3>
        <NuxtLink to="/article/tag">
          <Trubutton
            :text="$t('page.articleTag.backToTags')"
            type="primary"
            size="medium"
            variant="solid"
            class="mt-4"
          />
        </NuxtLink>
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
        <CardsArticleListArticle :articles="currentArticles" />

        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="perPage"
            :current-page="currentPage"
            @update:current-page="handlePageChange"
          />
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

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const { updateHeaderHeight } = useHeaderHeight();

const perPage = 10;

const { loading, articlesForTag, tagNameBySlug, scanUntil, scanNext } =
  useArticleTags();

const currentPage = ref(1);

const slug = computed(() => String(route.params.tag || ""));

const tagName = computed(() => tagNameBySlug.value(slug.value));

const allArticles = computed(() => articlesForTag.value(slug.value));

const total = computed(() => allArticles.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage));
const currentArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return allArticles.value.slice(start, start + perPage);
});

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
    query: { page: page > 1 ? page : undefined },
  });
};

// Scan bertahap: ambil artikel secukupnya untuk halaman yang sedang dilihat
const load = async () => {
  currentPage.value = route.query.page ? Number(route.query.page) || 1 : 1;
  await scanUntil(slug.value, currentPage.value * perPage);
};

watch(slug, () => {
  load();
});

watch(() => route.query.page, () => {
  const page = route.query.page ? Number(route.query.page) || 1 : 1;
  if (page !== currentPage.value) {
    currentPage.value = page;
    scanUntil(slug.value, page * perPage);
  }
});

onMounted(() => {
  updateHeaderHeight();
  load();
  // Lanjutkan scan di background supaya paginasi & jumlah tag terisi
  scanNext();
});
</script>

<style scoped>
.article-tag-detail {
  min-height: calc(100vh - 200px);
}
</style>