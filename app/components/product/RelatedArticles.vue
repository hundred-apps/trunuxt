<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:newspaper-variant" class="text-orange-500" />
        Artikel Terkait
      </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        v-for="article in articles"
        :key="article.id"
        :href="`/article/${article.id}`"
        class="group flex gap-4 bg-gray-50 hover:bg-white rounded-lg p-3 transition-all hover:shadow-md border border-transparent hover:border-gray-200"
      >
        <div
          class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden"
        >
          <img
            :src="`https://www.trumecs.com/public/image/artikel/${article.img || 'noimage.png'}`"
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
              {{ article.view || 0 }} views
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  articles: Array<{
    id: number;
    title: string;
    img?: string;
    description?: string;
    view?: number;
  }>;
  productTitle: string;
}>();
</script>
