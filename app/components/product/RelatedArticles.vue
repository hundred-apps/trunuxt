<template>
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
      <Icon name="mdi:newspaper-variant" class="text-orange-500" />
      {{ $t("page.product.text.relatedArticle") }}
    </h3>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Trulink
      v-for="article in items"
      :key="article.id"
      :to="`/article/${article.url}`"
      data-track-card="article"
      :data-track-id="String(article.id)"
      :data-track-title="article.title"
      class="group flex gap-4 bg-gray-50 hover:bg-white rounded-lg p-1 transition-all hover:shadow-md border border-transparent hover:border-gray-200"
      loading="lazy"
    >
      <div
        class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden"
      >
        <AppImage
          :src="`https://www.trumecs.com/public/image/artikel/${article.img || 'noimage.png'}`"
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform"
          sizes="100vw sm:50vw lg:33vw"
          width="400"
          height="267"
          loading="lazy"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h4
          class="text-sm font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {{ article.title }}
        </h4>
        <!-- Beberapa kata awal, sama seperti card artikel di halaman lain.
               Kalau datanya tidak punya teks sama sekali, barisnya disembunyikan
               (bukan diisi kalimat "lihat selengkapnya"). -->
        <p
          v-if="article.preview"
          class="text-xs text-gray-500 mt-1 line-clamp-2"
        >
          {{ article.preview }}
        </p>
        <div class="text-xs text-gray-400 mt-2">
          <span class="flex items-center gap-1">
            <Icon name="mdi:eye" class="text-sm" />
             {{ article.view || 0 }}
          </span>
        </div>
      </div>
    </Trulink>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { articlePreview } from "~/utils/articlePreview";

type RelatedArticle = {
  id: number;
  url: string;
  title: string;
  img?: string;
  description?: string;
  discription_seo?: string;
  seo_key?: string;
  value?: string;
  view?: number;
};

const props = defineProps<{
  articles: RelatedArticle[];
  productTitle: string;
}>();

// Pratinjau dihitung sekali per artikel, bukan tiap render.
const items = computed(() =>
  (props.articles || []).map((article) => ({
    ...article,
    preview: articlePreview(article),
  }))
);
</script>
