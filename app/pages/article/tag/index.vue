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
        v-else-if="tags.length === 0"
        class="text-center py-16 bg-white rounded-xl border border-gray-100"
      >
        <Icon name="material-symbols:sell" class="text-6xl text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("label.noResults") }}
        </h3>
      </div>

      <!-- Daftar tag -->
      <template v-else>
        <p class="text-sm text-gray-500 mb-4">
          {{ $t("page.articleTag.totalTags", { count: tags.length }) }}
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          <Trulink
            v-for="tag in tags"
            :key="tag.slug"
            :to="`/article/tag/${tag.slug}`"
            class="group bg-white rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-orange-200"
          >
            <div class="flex items-center gap-3">
              <span
                class="h-9 w-9 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center transition-colors group-hover:bg-orange-100"
              >
                <Icon
                  name="material-symbols:sell"
                  class="text-lg text-orange-500"
                />
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
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { useArticleTags } from "~/composables/useArticleTags";

const { t: $t } = useI18n();
const { updateHeaderHeight } = useHeaderHeight();

const { loading, tags, progress, scanAll } = useArticleTags();

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