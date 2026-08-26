<template>
  <Trulink
    :to="`/produk/${product.id}/${formatSlug(product.tittle)}`"
    class="group block bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-50">
      <img
        :src="productImage"
        :alt="product.tittle"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div
        v-if="Number(product.price_promo) > 0"
        class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        {{ $t("label.promo") }}
      </div>
      <div
        v-if="product.stock <= 0"
        class="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded"
      >
        {{ $t("page.product.text.sold") }}
      </div>
    </div>
    <div class="p-3">
      <p
        v-if="product.brand && product.brand.toLowerCase() !== 'other'"
        class="text-xs text-orange-500 font-semibold mb-1"
      >
        {{ product.brand }}
      </p>
      <h3
        class="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors"
      >
        {{ product.tittle }}
      </h3>
      <div v-if="Number(product.price) > 0" class="mt-auto">
        <p
          v-if="Number(product.price_promo) > 0"
          class="text-xs text-gray-400 line-through"
        >
          {{ formatPrice(Number(product.price)) }}
        </p>
        <p class="text-sm font-bold text-orange-600">
          {{
            formatPrice(
              Number(product.price_promo) > 0
                ? Number(product.price_promo)
                : Number(product.price)
            )
          }}
        </p>
      </div>
      <p v-else class="text-sm text-gray-500 italic">
        {{ $t("label.writeToUs") }}
      </p>
    </div>
  </Trulink>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ProductItem {
  id: number;
  tittle: string;
  img: string;
  price: string;
  price_promo: string;
  brand: string;
  stock: number;
}

const props = defineProps<{
  product: ProductItem;
}>();

const config = useRuntimeConfig();

const productImage = computed(() => {
  if (props.product.img) {
    return `${config.public.baseImageProduct}${props.product.img}`;
  }
  return "https://via.placeholder.com/300x300?text=No+Image";
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatSlug = (text: string | null) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
