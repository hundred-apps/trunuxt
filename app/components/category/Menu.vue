<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    class="border-b-0 py-2"
  >
    <template v-for="(product, index) in products" :key="product.id">
      <CategoryMenuItem
        :item="product"
        :parent-index="`product-${product.id}`"
        :level="0"
      />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { ProductCategory } from "~/types/category";
import CategoryMenuItem from "./MenuItem.vue";

// Props
const props = defineProps<{
  products: ProductCategory[];
}>();

// Emits
const emit = defineEmits<{
  (e: "select", index: string): void;
}>();

// Handle menu select
const handleSelect = (index: string) => {
  emit("select", index);
  console.log("Selected menu:", index);
};

defineOptions({
  name: "CategoryMenu",
});
</script>
