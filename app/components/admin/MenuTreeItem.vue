<template>
  <li class="relative">
    <div class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
      <button
        v-if="hasChildren"
        @click="expanded = !expanded"
        class="p-1 text-gray-400 hover:text-gray-600 rounded"
        aria-label="Toggle children"
      >
        <Icon
          :name="expanded ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'"
          class="h-4 w-4"
        />
      </button>
      <div v-else class="w-6" />

      <button class="p-1 text-gray-400 hover:text-gray-600 rounded" title="Drag to reorder">
        <Icon name="material-symbols:drag-indicator" class="h-4 w-4" />
      </button>

      <div class="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon :name="menu.icon || 'material-symbols:menu'" class="h-4 w-4 text-gray-600" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 truncate">{{ menu.name }}</p>
        <p class="text-xs text-gray-500 truncate">URL: {{ menu.url || '-' }}</p>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="$emit('add-child', menu.id)"
          class="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
          title="Tambah submenu"
        >
          <Icon name="material-symbols:add-circle" class="h-4 w-4" />
        </button>
        <button
          @click="$emit('edit', menu)"
          class="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
          title="Edit"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4" />
        </button>
        <button
          @click="$emit('delete', menu)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Hapus"
        >
          <Icon name="material-symbols:delete" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <ul v-if="hasChildren && expanded" class="ml-10 mt-1 space-y-1 border-l border-gray-200 pl-4">
      <MenuTreeItem
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts>
import { computed } from 'vue';

interface Props {
  menu: any;
  level: number;
}

const props = defineProps<Props>();

defineEmits<{
  edit: [menu: any];
  delete: [menu: any];
  'add-child': [parentId: number];
}>();

const expanded = ref(true);

const hasChildren = computed(() => props.menu.children && props.menu.children.length > 0);
</script>