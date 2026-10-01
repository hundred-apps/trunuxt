<template>
  <div class="tag-pageuntuk">
    <div class="container mx-auto max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
          {{ $t("page.tag.hubTitle") }}
        </h1>
        <p class="text-gray-600 mt-2">{{ $t("page.tag.hubSubtitle") }}</p>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div class="aspect-square bg-gray-200" />
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-2/3" />
            <div class="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>

      <div
        v-else-if="tags.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <Icon
          name="material-symbols:label"
          class="text-6xl text-gray-300 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          {{ $t("page.tag.empty") }}
        </h3>
        <p class="text-sm text-gray-400">{{ $t("label.noResults") }}</p>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-500">
              {{ $t("page.tag.totalTags", { count: tags.length }) }}
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          <Trulink
            v-for="tag in tags"
            :key="tag.id"
            :to="`/c/all?tags=${tag.id}`"
            class="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-orange-200"
          >
            <div class="p-4 text-center">
              <Icon
                name="material-symbols:label"
                class="text-3xl text-orange-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors"
              />
              <h3
                class="font-medium text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors"
              >
                {{ tagLabel(tag) }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ $t("page.tag.productCount", { count: tagCount(tag.id) }) }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { defineBreadcrumb, useSchemaOrg } from "@unhead/schema-org/vue";
import { useI18n } from "vue-i18n";
import { useHeaderHeight } from "~/composables/useHeaderHeight";
import { useProductTags } from "~/composables/useProductTags";

const { t: $t } = useI18n();

const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const { loading, tags, tagLabel, tagCount, load } = useProductTags();

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("page.tag.title"), to: "/tag" },
]);

useHead({
  title: computed(() => $t("page.tag.hubTitle")),
  titleTemplate: "%s | Trumecs.com",
  meta: computed(() => [
    {
      name: "description",
      content: $t("page.tag.hubSubtitle"),
    },
    {
      property: "og:title",
      content: `${$t("page.tag.hubTitle")} | Trumecs.com`,
    },
    { property: "og:description", content: $t("page.tag.hubSubtitle") },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
    { name: "twitter:card", content: "summary" },
  ]),
  link: computed(() => [
    { rel: "canonical", href: "https://www.trumecs.com/tag" },
  ]),
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((item, index) => ({
      position: index + 1,
      name: item.text,
      item: `https://www.trumecs.com${item.to}`,
    })),
  }),
]);

onMounted(() => {
  updateHeaderHeight();
  load();
});
</script>

<style scoped>
.tag-page {
  min-height: calc(100vh - 200px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
