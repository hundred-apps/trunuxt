<!-- components/FeaturedArticleGrid.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
    <div
      v-for="(article, index) in displayedArticles"
      :key="index"
      class="featured-article"
    >
      <Trulink
        :to="`/article/${article.url}`"
        class="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
      >
        <div class="flex md:flex-col">
          <!-- Image Section -->
          <div class="w-1/3 md:w-full aspect-[4/3] overflow-hidden">
            <AppImage
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="33vw md:250px"
              width="250"
              height="188"
              loading="lazy"
            />
          </div>

          <!-- Content Section -->
          <div class="w-2/3 md:w-full p-3">
            <!-- Category -->
            <span
              v-if="article.category"
              class="text-xs font-semibold text-orange-500"
            >
              {{ article.category }}
            </span>

            <!-- Title -->
            <h3
              class="font-bold text-sm md:text-base line-clamp-2 mt-1 group-hover:text-orange-500 transition-colors"
            >
              {{ article.title }}
            </h3>

            <!-- Date -->
            <p v-if="article.date" class="text-xs text-gray-500 mt-2">
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
</template>

<script setup lang="ts">
import { computed } from "vue";

// Types/Interfaces
interface Article {
  url: string;
  title: string;
  image: string;
  category?: string;
  date?: string;
  excerpt?: string;
}

// Props definition with TypeScript
const props = withDefaults(
  defineProps<{
    articles: Article[];
    startIndex?: number;
    endIndex?: number;
    dateFormat?: Intl.DateTimeFormatOptions;
  }>(),
  {
    startIndex: 1,
    endIndex: 5,
    dateFormat: () => ({
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }
);

// Emits (jika diperlukan)
const emit = defineEmits<{
  (e: "articleClick", article: Article): void;
}>();

// Computed: Menampilkan articles sesuai range
const displayedArticles = computed(() => {
  return props.articles.slice(props.startIndex, props.endIndex);
});

// Method: Format date dengan options yang bisa dikustomisasi
const formatDate = (date?: string): string => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("id-ID", props.dateFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
};

// Method: Handle click (jika perlu tambahan logic)
const handleArticleClick = (article: Article) => {
  emit("articleClick", article);
};
</script>

<style scoped></style>
