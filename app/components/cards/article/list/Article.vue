<!-- components/ArticleList.vue -->
<template>
  <div class="space-y-4">
    <div v-for="article in articles" :key="article.id">
      <Trulink
        :to="`/article/${article.url}`"
        class="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        <!-- Desktop Article Row (hidden on mobile) -->
        <div class="hidden lg:flex gap-4 p-4">
          <!-- Image -->
          <div class="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <!-- Content -->
          <div class="flex-grow">
            <!-- Category & Date -->
            <div class="flex items-center gap-2 mb-2">
              <span
                v-if="article.category"
                class="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded"
              >
                {{ article.category }}
              </span>
              <span v-if="article.date" class="text-xs text-gray-500">
                <Icon
                  name="material-symbols:calendar-today"
                  class="inline mr-1"
                />
                {{ formatDate(article.date) }}
              </span>
            </div>

            <!-- Title -->
            <h4
              class="font-bold text-lg mb-2 group-hover:text-orange-500 transition-colors line-clamp-2"
            >
              {{ article.title }}
            </h4>

            <!-- Excerpt -->
            <p
              v-if="article.excerpt"
              class="text-gray-600 text-sm line-clamp-2 mb-3"
            >
              {{ article.excerpt }}
            </p>

            <!-- Author -->
            <div v-if="article.author" class="flex items-center gap-2">
              <Icon name="icon-park:people-unknown" />
              <span class="text-sm font-medium">{{ article.author.name }}</span>
            </div>
          </div>
        </div>

        <!-- Mobile Article Row (lg:hidden) -->
        <div class="lg:hidden flex gap-3 p-3">
          <!-- Image -->
          <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <!-- Content -->
          <div class="flex-grow">
            <!-- Category -->
            <span
              v-if="article.category"
              class="text-xs font-semibold text-orange-500"
            >
              {{ article.category }}
            </span>

            <!-- Title -->
            <h4 class="font-semibold text-sm line-clamp-2">
              {{ article.title }}
            </h4>

            <!-- Date -->
            <p v-if="article.date" class="text-xs text-gray-500 mt-1">
              <Icon
                name="material-symbols:calendar-today"
                class="inline mr-1"
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
export interface ArticleAuthor {
  name: string;
  avatar: string;
  role?: string;
}

export interface Article {
  id: string | number;
  url: string;
  title: string;
  image: string;
  category?: string;
  date?: string;
  excerpt?: string;
  author?: ArticleAuthor;
}

// Props definition
const props = withDefaults(
  defineProps<{
    articles: Article[];
    dateFormat?: Intl.DateTimeFormatOptions;
    showAuthor?: boolean;
    desktopImageSize?: {
      width: string;
      height: string;
    };
    mobileImageSize?: {
      width: string;
      height: string;
    };
  }>(),
  {
    articles: () => [],
    dateFormat: () => ({
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    showAuthor: true,
    desktopImageSize: () => ({ width: "w-48", height: "h-32" }),
    mobileImageSize: () => ({ width: "w-20", height: "h-20" }),
  }
);

// Emits
const emit = defineEmits<{
  (e: "articleClick", article: Article): void;
  (e: "imageLoad", article: Article): void;
}>();

// Computed classes
const desktopImageClasses = computed(
  () =>
    `${props.desktopImageSize.width} ${props.desktopImageSize.height} rounded-lg overflow-hidden flex-shrink-0`
);

const mobileImageClasses = computed(
  () =>
    `${props.mobileImageSize.width} ${props.mobileImageSize.height} rounded-lg overflow-hidden flex-shrink-0`
);

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
const handleArticleClick = (article: Article) => {
  emit("articleClick", article);
};

// Handle image load
const handleImageLoad = (article: Article) => {
  emit("imageLoad", article);
};
</script>

<style scoped></style>
