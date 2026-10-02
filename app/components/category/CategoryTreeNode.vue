<template>
  <ul class="space-y-1">
    <li v-for="node in nodes" :key="node.id">
      <div
        class="group flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left transition-all duration-150"
        :class="depth > 0 ? 'pl-3' : ''"
      >
        <button
          v-if="hasChildren(node)"
          type="button"
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-500"
          :aria-label="$t('button.seeAll')"
          :aria-expanded="isExpanded(node)"
          @click.stop="toggleExpand(node)"
        >
          <Icon
            :name="
              isExpanded(node)
                ? 'material-symbols:expand-more'
                : 'material-symbols:chevron-right'
            "
            class="text-base"
          />
        </button>
        <span v-else class="h-6 w-6 shrink-0" />

        <button
          type="button"
          @click="toggleSelect(node.id)"
          :aria-pressed="checkState(node.id) === 'all'"
          :aria-checked="checkState(node.id) === 'all' ? 'true' : checkState(node.id) === 'partial' ? 'mixed' : 'false'"
          class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
          :class="
            checkState(node.id) === 'all'
              ? 'border-orange-500 bg-orange-500 text-white'
              : checkState(node.id) === 'partial'
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-300 bg-white text-transparent group-hover:border-orange-300'
          "
        >
          <Icon
            v-if="checkState(node.id) === 'partial'"
            name="material-symbols:remove"
            class="text-xs font-bold"
          />
          <Icon
            v-else
            name="material-symbols:check"
            class="text-xs font-bold"
          />
        </button>

        <button
          type="button"
          @click="toggleExpand(node)"
          :disabled="!hasChildren(node)"
          class="min-w-0 flex-1 text-left"
        >
          <span
            class="block truncate text-sm font-medium"
            :class="
              checkState(node.id) !== 'none'
                ? 'text-orange-600'
                : 'text-gray-700 group-hover:text-orange-600'
            "
          >
            {{ node.name }}
          </span>
        </button>

        <span
          class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          :class="
            checkState(node.id) !== 'none'
              ? 'bg-orange-100 text-orange-600'
              : 'bg-gray-100 text-gray-500'
          "
        >
          {{ counts[node.id] ?? 0 }}
        </span>
      </div>

      <div
        v-if="isExpanded(node) && hasChildren(node)"
        class="ml-4 mt-1 max-h-[200px] overflow-y-auto rounded-lg bg-gray-50 pr-1"
      >
        <div class="p-1">
          <CategoryTreeNode
            :nodes="node.children || []"
            :depth="depth + 1"
            :selected-ids="selectedIds"
            :counts="counts"
            :expanded-ids="expandedIds"
            :check-state="checkState"
            @toggle="toggleSelect"
            @update:expanded-ids="emit('update:expandedIds', $event)"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "CategoryTreeNode" });

interface CategoryNode {
  id: number;
  name: string;
  url: string;
  children?: CategoryNode[];
}

const props = defineProps<{
  nodes: CategoryNode[];
  depth?: number;
  selectedIds?: number[];
  counts?: Record<number, number>;
  expandedIds?: number[];
  checkState?: (id: number) => "none" | "partial" | "all";
}>();

const emit = defineEmits<{
  toggle: [id: number];
  "update:expandedIds": [ids: number[]];
}>();

const selectedIds = computed(() => props.selectedIds || []);
const counts = computed(() => props.counts || {});
const expandedIds = computed(() => props.expandedIds || []);

const hasChildren = (node: CategoryNode) =>
  Array.isArray(node.children) && node.children.length > 0;

// Status centang: none / partial (indeterminate) / all
const checkState = (id: number): "none" | "partial" | "all" => {
  if (props.checkState) return props.checkState(id);
  return selectedIds.value.includes(id) ? "all" : "none";
};

const isExpanded = (node: CategoryNode) => expandedIds.value.includes(node.id);

// Accordion: membuka satu node menutup sibling-nya di level yang sama.
const toggleExpand = (node: CategoryNode) => {
  if (!hasChildren(node)) return;

  const siblingIds = props.nodes.map((n) => n.id);
  const keep = expandedIds.value.filter((id) => !siblingIds.includes(id));

  if (isExpanded(node)) {
    emit("update:expandedIds", keep);
  } else {
    emit("update:expandedIds", [...keep, node.id]);
  }
};

const toggleSelect = (id: number) => emit("toggle", id);
</script>