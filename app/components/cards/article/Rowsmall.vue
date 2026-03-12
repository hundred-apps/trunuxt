<!-- components/TrendingArticles.vue -->
<template>
  <div class="divide-y divide-gray-100">
    <Trulink
      v-for="article in articles"
      :key="article.id"
      :to="`/article/${article.url}`"
      class="block px-6 py-4 hover:bg-gray-50 transition-colors group"
    >
      <div class="flex gap-3">
        <!-- Image -->
        <div
          :class="imageSizeClass"
          class="rounded-lg overflow-hidden flex-shrink-0"
        >
          <img
            :src="article.image"
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <h6
            class="font-semibold text-sm line-clamp-2 group-hover:text-orange-500 transition-colors"
          >
            {{ article.title }}
          </h6>

          <!-- Date -->
          <p v-if="article.date" class="text-xs text-gray-500 mt-1">
            <Icon name="material-symbols:calendar-today" class="inline mr-1" />
            {{ formatDate(article.date) }}
          </p>

          <!-- Category (optional) -->
          <p
            v-if="showCategory && article.category"
            class="text-xs text-orange-500 mt-1"
          >
            {{ article.category }}
          </p>
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
