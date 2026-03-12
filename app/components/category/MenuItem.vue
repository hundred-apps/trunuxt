<template>
  <!-- Jika punya children, render sub-menu -->
  <el-sub-menu v-if="hasChildren" :index="computedIndex">
    <template #title>{{ item.name }}</template>

    <!-- Render children recursively -->
    <template v-for="(child, childIdx) in item.children" :key="child.id">
      <CategoryMenuItem
        :item="child"
        :parent-index="`${computedIndex}-${childIdx}`"
        :level="level + 1"
        :parents="[...parents, item]"
      />
    </template>
  </el-sub-menu>

  <!-- Jika tidak punya children, render menu item biasa -->
  <el-menu-item v-else :index="computedIndex">
    <Trulink :href="categoryUrl" @click="handleCategoryClick">
      {{ item.name }}
    </Trulink>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { CategoryChild, ProductCategory } from "~/types/category";
const { trackClickCategory } = useAnalytics();
const config = useRuntimeConfig();

// Props
const props = defineProps({
  item: {
    type: Object as PropType<CategoryChild | ProductCategory>,
    required: true,
  },
  parentIndex: {
    type: String,
    default: "",
  },
  level: {
    type: Number,
    default: 0,
  },
  parents: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

// Computed index
const computedIndex = computed(() => {
  if (props.parentIndex) {
    return props.parentIndex;
  }
  // Untuk top level, gunakan ID
  return `cat-${props.item.id}`;
});

// Check if has children
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

const categoryUrl = computed(() => {
  const segments = [...props.parents.map((p) => p.url), props.item.url].filter(
    Boolean
  );

  return `${config.public.baseCat}/${segments.join("/")}`;
});

const getCategoryHierarchy = () => {
  return [...props.parents.map((p) => p.name), props.item.name];
};

const handleCategoryClick = () => {
  const levels = getCategoryHierarchy();

  const category = levels[0];
  const subcategory = levels[1];
  const subsubcategory = levels[2];

  trackClickCategory(category, subcategory, subsubcategory);
};

defineOptions({
  name: "CategoryMenuItem",
});
</script>
