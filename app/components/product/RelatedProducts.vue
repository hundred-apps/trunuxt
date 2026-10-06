<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:shopping" class="text-orange-500" />
        {{ $t("page.product.text.relatedProduct") }}
      </h3>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
    >
      <Trulink
        v-for="product in products.slice(0, 10)"
        :key="product.id"
        :to="getProductUrl(product)"
        class="group bg-gray-50 hover:bg-white rounded-lg transition-all hover:shadow-md border border-transparent hover:border-gray-200"
      >
        <div class="aspect-square bg-white rounded-lg overflow-hidden mb-2">
          <AppImage
            :src="`https://www.trumecs.com/public/image/product/${product.img || 'noimage.png'}`"
            :alt="product.tittle"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            sizes="50vw sm:33vw lg:20vw"
            width="300"
            height="300"
            loading="lazy"
          />
        </div>
        <h4
          class="text-xs font-medium px-1.5 text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {{ product.tittle }}
        </h4>
        <div class="text-[11px] text-gray-500 mt-1 px-1.5 line-clamp-1">
          {{ product.brand || "Trumecs" }}
        </div>
        <div class="text-sm font-bold text-orange-500 mt-1.5 px-1.5">
          Rp {{ formatPrice(Number(product.price || 0)) }}
        </div>
      </Trulink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatSlug } from "~/utils/slug";
const props = defineProps<{
  products: Array<{
    id: number;
    tittle: string;
    brand: string;
    price: string | number;
    img?: string;
  }>;
  currentProductId: number;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const localePath = useLocalePath();

const getProductUrl = (product: { id: number; tittle: string }) => {
  const slug = formatSlug(product.tittle);
  return localePath(`/product/${product.id}/${slug}`);
};
</script>
