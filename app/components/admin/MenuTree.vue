<template>
  <div class="p-4">
    <ul class="space-y-1">
      <MenuTreeItem
        v-for="menu in menus"
        :key="menu.id"
        :menu="menu"
        :level="0"
        @edit="edit"
        @delete="deleteMenu"
        @add-child="addChild"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import MenuTreeItem from "~/components/admin/MenuTreeItem.vue";

defineProps<{
  menus: any[];
}>();

defineEmits<{
  edit: [menu: any];
  delete: [menu: any];
  "add-child": [parentId: number];
}>();
</script>
