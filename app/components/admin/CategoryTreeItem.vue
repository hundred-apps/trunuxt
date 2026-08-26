<template>
  <li class="relative">
    <div class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
      <!-- Expand/Collapse -->
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

      <!-- Drag handle -->
      <button class="p-1 text-gray-400 hover:text-gray-600 rounded" title="Drag to reorder">
        <Icon name="material-symbols:drag-indicator" class="h-4 w-4" />
      </button>

      <!-- Category icon -->
      <div class="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
        <Icon :name="category.is_brand ? 'material-symbols:label' : 'material-symbols:category'" class="h-4 w-4 text-orange-600" />
      </div>

      <!-- Category info -->
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 truncate">{{ category.name }}</p>
        <p class="text-xs text-gray-500 truncate">Slug: {{ category.slug }} {{ category.is_brand ? '• Brand' : '' }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <button
          @click="$emit('add-child', category.id)"
          class="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
          title="Tambah subkategori"
        >
          <Icon name="material-symbols:add-circle" class="h-4 w-4" />
        </button>
        <button
          @click="$emit('edit', category)"
          class="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
          title="Edit"
        >
          <Icon name="material-symbols:edit" class="h-4 w-4" />
        </button>
        <button
          @click="$emit('delete', category)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Hapus"
        >
          <Icon name="material-symbols:delete" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Children -->
    <ul v-if="hasChildren && expanded" class="ml-10 mt-1 space-y-1 border-l border-gray-200 pl-4">
      <CategoryTreeItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
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
  category: any;
  level: number;
}

const props = defineProps<Props>();

defineEmits<{
  edit: [category: any];
  delete: [category: any];
  'add-child': [parentId: number];
}>();

const expanded = ref(true);

const hasChildren = computed(() => props.category.children && props.category.children.length > 0);
</script>