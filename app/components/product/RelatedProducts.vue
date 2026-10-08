<template>
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
      <Icon name="mdi:shopping" class="text-orange-500" />
      {{ $t("page.product.text.relatedProduct") }}
    </h3>
  </div>

  <div
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
  >
    <ProductCard
      v-for="product in products.slice(0, 10)"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from "~/components/product/ProductCard.vue";

defineProps<{
  products: Array<{
    id: number;
    tittle: string;
    brand: string;
    price: string | number;
    img?: string;
  }>;
  currentProductId: number;
}>();
</script>
