<template>
  <div class="p-4">
    <ul class="space-y-1">
      <CategoryTreeItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :level="0"
        @edit="edit"
        @delete="deleteCategory"
        @add-child="addChild"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import CategoryTreeItem from "~/components/admin/CategoryTreeItem.vue";

defineProps<{
  categories: any[];
}>();

defineEmits<{
  edit: [category: any];
  delete: [category: any];
  "add-child": [parentId: number];
}>();
</script>
