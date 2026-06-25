<!-- components/TrendingArticles.vue -->
<template>
  <div class="divide-y divide-gray-100">
    <Trulink
      v-for="article in articles"
      :key="article.id"
      :to="`/article/${article.id}`"
      class="group flex gap-4 bg-gray-50 hover:bg-white rounded-lg p-3 transition-all hover:shadow-md border border-transparent hover:border-gray-200"
    >
      <div
        class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden"
      >
        <img
          :src="article.image"
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h4
          class="text-sm font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {{ article.title }}
        </h4>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2">
          {{ article.description || "Baca artikel selengkapnya..." }}
        </p>
        <div class="text-xs text-gray-400 mt-2">
          <span class="flex items-center gap-1">
            <Icon name="mdi:eye" class="text-sm" />
            {{ article.views || 0 }} views
          </span>
        </div>
      </div>
    </Trulink>
    <!-- Empty state -->
    <div v-if="!articles.length" class="px-6 py-8 text-center text-gray-500">
      <Icon name="material-symbols:article-outline" class="text-4xl mb-2" />
      <p>Tidak ada artikel trending</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Types/Interfaces
export interface TrendingArticle {
  id: string | number;
  url: string;
  title: string;
  image: string;
  date?: string;
  category?: string;
  description?: string;
  views?: number;
}

// Props definition
const props = withDefaults(
  defineProps<{
    articles: TrendingArticle[];
    imageSize?: "sm" | "md" | "lg";
    showCategory?: boolean;
    maxTitleLines?: 1 | 2 | 3;
    dateFormat?: Intl.DateTimeFormatOptions;
    emptyMessage?: string;
  }>(),
  {
    articles: () => [],
    imageSize: "md",
    showCategory: false,
    maxTitleLines: "2",
    dateFormat: () => ({
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    emptyMessage: "Tidak ada artikel trending",
  }
);

// Emits
const emit = defineEmits<{
  (e: "articleClick", article: TrendingArticle): void;
  (e: "imageLoad", article: TrendingArticle): void;
}>();

// Computed image size classes
const imageSizeClass = computed(() => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };
  return sizes[props.imageSize];
});

// Computed title line clamp
const titleLineClamp = computed(() => {
  return `line-clamp-${props.maxTitleLines}`;
});

// Format date
const formatDate = (date?: string): string => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("id-ID", props.dateFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
};

// Handle article click
const handleArticleClick = (article: TrendingArticle) => {
  emit("articleClick", article);
};

// Handle image load
const handleImageLoad = (article: TrendingArticle) => {
  emit("imageLoad", article);
};
</script>

<style scoped></style>
