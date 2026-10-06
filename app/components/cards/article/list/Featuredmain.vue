<!-- components/FeaturedArticle.vue -->
<template>
  <!--
    Featured artikel dimuat di onMounted, jadi saat SSR masih kosong.
    Tanpa guard ini, article bernilai null -> AppImage menerima src undefined
    dan Vue complained "Invalid prop: type check failed".
  -->
  <template v-if="article">
    <Trulink :to="`/article/${article.url}`" class="block h-full group">
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        <!-- Image Section -->
        <div class="aspect-[16/9] overflow-hidden">
          <AppImage
            v-if="article.image"
            :src="article.image"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw md:600px lg:800px"
            width="800"
            height="450"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        <!-- Content Section -->
        <div class="p-6">
          <!-- Category & Date -->
          <div class="flex items-center gap-2 mb-3">
            <span
              class="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full"
            >
              {{ article.category }}
            </span>
            <span class="text-xs text-gray-500">
              <Icon name="material-symbols:calendar-today" class="inline mr-1" />
              {{ formatDate(article.date) }}
            </span>
          </div>

          <!-- Title -->
          <h2
            class="text-2xl font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2"
          >
            {{ article.title }}
          </h2>

          <!-- Excerpt -->
          <p class="text-gray-600 line-clamp-3">
            {{ article.excerpt }}
          </p>

          <!-- Author Info -->
          <div class="flex items-center gap-2 mt-4">
            <div>
              <p class="text-sm font-semibold">
                {{ article.author?.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Trulink>
  </template>
</template>

<script lang="ts" setup>
// Props definition
interface Article {
  url: string;
  title: string;
  image?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
}

const props = withDefaults(
  defineProps<{
    article?: Article | null;
    showAuthor?: boolean;
    titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  }>(),
  { article: null }
);

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const titleTag = computed(() => `h${props.titleLevel ?? 2}`);
</script>
