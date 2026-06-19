<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:shopping" class="text-orange-500" />
        Produk Terkait
      </h3>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <a
        v-for="product in products"
        :key="product.id"
        :href="`/product/${product.id}`"
        class="group bg-gray-50 hover:bg-white rounded-lg p-4 transition-all hover:shadow-md border border-transparent hover:border-gray-200"
      >
        <div class="aspect-square bg-white rounded-lg overflow-hidden mb-3">
          <img
            :src="`https://www.trumecs.com/public/image/product/${product.img || 'noimage.png'}`"
            :alt="product.tittle"
            class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
          />
        </div>
        <h4
          class="text-sm font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {{ product.tittle }}
        </h4>
        <div class="text-xs text-gray-500 mt-1">
          {{ product.brand || "Trumecs" }}
        </div>
        <div class="text-lg font-bold text-orange-500 mt-2">
          Rp {{ formatPrice(Number(product.price || 0)) }}
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
