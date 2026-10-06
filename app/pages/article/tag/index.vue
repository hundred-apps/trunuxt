<template>
  <div class="article-tag-page">
    <div class="container mx-auto max-w-[1280px] px-4 lg:px-0">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <header class="mb-6">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
          {{ $t("page.articleTag.title") }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ $t("page.articleTag.subtitle") }}
        </p>
      </header>

      <!-- Pencarian tag (ada ratusan tag, jadi tidak bisa di-scroll semua) -->
      <div class="relative mb-4">
        <input
          v-model="searchDraft"
          type="search"
          :placeholder="$t('page.articleTag.searchPlaceholder')"
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
        class="mb-4 flex items-center gap-2 text-sm text-gray-600"
      >
        <span>{{ $t("page.article.searchResultFor") }}</span>
        <span class="font-semibold text-orange-600">
          "{{ activeSearch }}"
        </span>
        <span>({{ filteredTags.length }})</span>
      </div>

      <!-- Progress scan -->
      <div
        v-if="loading && tags.length === 0"
        class="mb-6 rounded-xl bg-orange-50 border border-orange-100 p-4"
      >
        <div class="flex items-center justify-between text-sm text-orange-700 mb-2">
          <span>{{ $t("page.articleTag.scanning") }}</span>
          <span>{{ Math.round(progress * 100) }}%</span>
        </div>
        <div class="h-2 w-full rounded-full bg-orange-100 overflow-hidden">
          <div
            class="h-full rounded-full bg-orange-500 transition-all duration-300"
            :style="{ width: `${Math.max(6, Math.round(progress * 100))}%` }"
          />
        </div>
      </div>

      <!-- Loading awal -->
      <div
        v-if="loading && tags.length === 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <div class="p-4 flex items-center gap-3">
            <div class="h-9 w-9 rounded-lg bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-3/4" />
              <div class="h-2 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Kosong -->
      <div
        v-else-if="filteredTags.length === 0"
        class="text-center py-16 bg-white rounded-xl border border-gray-100"
      >
        <span class="inline-block text-6xl font-bold text-gray-300 mb-4">#</span>
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("label.noResults") }}
        </h3>
        <button
          v-if="activeSearch"
          type="button"
          class="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          @click="clearSearch"
        >
          {{ $t("page.article.clearSearch") }}
        </button>
      </div>

      <!-- Daftar tag -->
      <template v-else>
        <p class="text-sm text-gray-500 mb-4">
          {{
            activeSearch
              ? $t("page.article.searchResultFor")
              : $t("page.articleTag.totalTags", { count: filteredTags.length })
          }}
          <span v-if="activeSearch">({{ filteredTags.length }})</span>
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          <Trulink
            v-for="tag in filteredTags"
            :key="tag.slug"
            :to="`/article/tag/${tag.slug}`"
            class="group bg-white rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-orange-200"
          >
            <div class="flex items-center gap-3">
              <span
                class="h-9 w-9 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center transition-colors group-hover:bg-orange-100"
              >
                <span class="text-lg font-bold text-orange-500">#</span>
              </span>
              <div class="min-w-0">
                <h3
                  class="font-medium text-gray-800 truncate group-hover:text-orange-600 transition-colors text-sm"
                >
                  {{ tag.name }}
                </h3>
                <p class="text-xs text-gray-500">
                  {{
                    $t("page.articleTag.articleCount", { count: tag.count })
                  }}
                </p>
              </div>
            </div>
          </Trulink>
        </div>

        <div v-if="loading" class="mt-6 text-center text-sm text-gray-400">
          {{ $t("page.articleTag.scanningMore") }}
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
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { useArticleTags } from "~/composables/useArticleTags";

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const { updateHeaderHeight } = useHeaderHeight();

const { loading, tags, progress, scanAll } = useArticleTags();

// ============ PENCARIAN TAG ============
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

/**
 * Filter tag berdasarkan nama. Cocokkan juga dengan slug supaya
 * "roller conveyor" tetap menemukan tag `roller-conveyor`.
 * Semua kata kunci harus cocok (AND).
 */
const filteredTags = computed(() => {
  const q = normalizeText(activeSearch.value);
  if (!q) return tags.value;

  const words = q.split(" ");
  return tags.value.filter((t) => {
    const haystack = `${normalizeText(t.name)} ${normalizeText(t.slug)}`;
    return words.every((word) => haystack.includes(word));
  });
});

const applySearch = async () => {
  const q = searchDraft.value.trim();
  activeSearch.value = q;
  await router.replace({
    query: q ? { ...route.query, q } : omitQuery(route.query, "q"),
  });
};

const clearSearch = async () => {
  searchDraft.value = "";
  await applySearch();
};

// Ikuti perubahan ?q= dari luar (mis. dari Navbar atau tombol back).
watch(
  () => route.query.q,
  (value) => {
    const q = String(value || "");
    if (q !== activeSearch.value) {
      activeSearch.value = q;
      searchDraft.value = q;
    }
  }
);

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("label.article"), to: "/article" },
  { text: $t("page.articleTag.title"), to: "/article/tag" },
]);

useHead({
  title: computed(() => $t("page.articleTag.title")),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    { name: "description", content: $t("page.articleTag.subtitle") },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: $t("page.articleTag.title") },
    { property: "og:description", content: $t("page.articleTag.subtitle") },
    { property: "og:type", content: "website" },
  ]),
  link: computed(() => [
    { rel: "canonical", href: "https://www.trumecs.com/article/tag" },
  ]),
});

onMounted(() => {
  updateHeaderHeight();
  scanAll();
});
</script>

<style scoped>
.article-tag-page {
  min-height: calc(100vh - 200px);
}
</style>