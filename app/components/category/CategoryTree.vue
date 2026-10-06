<template>
  <section
    class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    aria-labelledby="category-tree-heading"
  >
    <header class="mb-4 flex items-center justify-between">
      <h2
        id="category-tree-heading"
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Icon name="material-symbols:account-tree" class="text-lg" />
        </span>
        {{ title }}

        <span
          v-if="selectedIds.length > 0"
          class="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600"
        >
          {{ selectedIds.length }}
        </span>
      </h2>
    </header>

    <!-- Empty -->
    <div v-if="categories.length === 0" class="py-8 text-center">
      <Icon name="material-symbols:account-tree" class="mx-auto text-3xl text-gray-300" />
      <p class="mt-2 text-sm text-gray-400">{{ $t('page.category.noSubcategories') }}</p>
    </div>

    <!-- List -->
    <CategoryTreeNode
      v-else
      :nodes="categories"
      :depth="0"
      :selected-ids="selectedIds"
      :counts="counts"
      :expanded-ids="expandedIds"
      :check-state="checkState"
      class="max-h-[320px] overflow-y-auto pr-1"
      @toggle="toggleSelect"
      @update:expanded-ids="expandedIds = $event"
    />

    <p
      v-if="rootCount > 8"
      class="mt-2 flex items-center gap-1 text-[11px] text-gray-400"
    >
      <Icon name="material-symbols:unfold-more" class="text-xs" />
      {{ $t('page.category.scrollHint') }}
    </p>

    <Trubutton
      v-if="selectedIds.length > 0"
      :text="$t('button.clearFilters')"
      variant="ghost"
      size="mini"
      icon="mdi:filter-remove"
      class="mt-3 w-full"
      @click="$emit('clear')"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import CategoryTreeNode from "~/components/category/CategoryTreeNode.vue";

interface CategoryNode {
  id: number;
  name: string;
  url: string;
  children?: CategoryNode[];
}

const props = defineProps({
  categories: {
    type: Array as () => CategoryNode[],
    required: true,
  },
  selectedIds: {
    type: Array as () => number[],
    default: () => [],
  },
  counts: {
    type: Object as () => Record<number, number>,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "Kategori",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  // Status centang tri-state per node (disediakan parent)
  checkState: {
    type: Function as PropType<
      (id: number) => "none" | "partial" | "all"
    >,
    default: undefined,
  },
});

const emit = defineEmits<{
  toggle: [id: number];
  clear: [];
}>();

const toggleSelect = (id: number) => emit("toggle", id);

const rootCount = computed(() => props.categories.length);

// Accordion: satu node terbuka per level. Di civis dari `CategoryTree` supaya
// setiap sibling bisa saling menutup.
const expandedIds = ref<number[]>([]);

// Kumpulkan rantai ancestor dari SETIAP node yang terpilih (tidak berhenti di
// node atasnya), supaya semua kategori terpilih selalu terlihat.
const hasSelectedInSubtree = (node: any): boolean => {
  const selected = props.selectedIds || [];
  if (selected.includes(node.id)) return true;
  return (node.children || []).some(hasSelectedInSubtree);
};

const collectOpenIds = (
  node: any,
  trail: number[],
  out: Set<number>
) => {
  const selected = props.selectedIds || [];
  const selfTrail = [...trail, node.id];

  // Node ini terpilih -> buka dirinya dan semua ancestor-nya
  if (selected.includes(node.id)) {
    selfTrail.forEach((id) => out.add(id));
  }

  // Tetap turun mencari_selected yang lebih dalam
  (node.children || []).forEach((child) => {
    if (hasSelectedInSubtree(child)) {
      collectOpenIds(child, selfTrail, out);
    }
  });
};

// Buka otomatis node terpilih tanpa menimpa pilihan buka manual user
watch(
  () => props.selectedIds,
  () => {
    const selected = props.selectedIds || [];
    if (selected.length === 0) return;

    const out = new Set<number>();
    props.categories.forEach((node) => collectOpenIds(node, [], out));

    if (out.size > 0) {
      expandedIds.value = Array.from(
        new Set([...expandedIds.value, ...out])
      );
    }
  },
  { immediate: true, deep: true }
);
</script>