<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:shopping" class="text-orange-500" />
        {{ $t("page.product.text.relatedProduct") }}
      </h3>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <Trulink
        v-for="product in products"
        :key="product.id"
        :to="getProductUrl(product)"
        class="group bg-gray-50 hover:bg-white rounded-lg transition-all hover:shadow-md border border-transparent hover:border-gray-200"
      >
        <div class="aspect-square bg-white rounded-lg overflow-hidden mb-3">
          <img
            :src="`https://www.trumecs.com/public/image/product/${product.img || 'noimage.png'}`"
            :alt="product.tittle"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
        <h4
          class="text-sm font-medium px-2 text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {{ product.tittle }}
        </h4>
        <div class="text-xs text-gray-500 mt-1 px-2">
          {{ product.brand || "Trumecs" }}
        </div>
        <div class="text-lg font-bold text-orange-500 mt-2 px-2">
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
