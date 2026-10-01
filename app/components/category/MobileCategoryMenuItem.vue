<template>
  <!-- Jika punya children, render sub-menu -->
  <div v-if="hasChildren" class="mobile-submenu">
    <div
      class="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 cursor-pointer"
      @click="toggleSubmenu"
    >
      <span
        class="flex-1 min-w-0 truncate text-sm font-medium text-gray-800"
        :class="isOpen ? 'text-orange-600' : ''"
      >
        {{ item.name }}
      </span>
      <span
        class="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500"
      >
        {{ item.children.length }}
      </span>
      <Icon
        name="material-symbols:expand-more"
        class="shrink-0 text-base text-gray-400 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </div>

    <!-- Render children recursively -->
    <div v-show="isOpen" class="ml-3 border-l border-gray-100 pl-2">
      <MobileCategoryMenuItem
        v-for="(child, childIdx) in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :parents="[...parents, item]"
        @close-mobile-menu="$emit('close-mobile-menu')"
      />
    </div>
  </div>

  <!-- Jika tidak punya children, render menu item biasa -->
  <Trulink
    v-else
    :href="categoryUrl"
    class="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-600 cursor-pointer"
    @click="handleCategoryClick"
  >
    <span class="flex-1 min-w-0 truncate text-sm">{{ item.name }}</span>
  </Trulink>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { PropType } from "vue";
import type { CategoryChild, ProductCategory } from "~/types/category";

const { trackClickCategory } = useAnalytics();
const config = useRuntimeConfig();

const props = defineProps({
  item: {
    type: Object as PropType<CategoryChild | ProductCategory>,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  parents: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  parentIndex: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close-mobile-menu"]);

const isOpen = ref(false);

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// Sama seperti desktop, menggabungkan URL dari parents
const categoryUrl = computed(() => {
  const segments = [...props.parents.map((p) => p.url), props.item.url].filter(
    Boolean
  );

  return `${config.public.baseCat}/${segments.join("/")}`;
});

// Sama seperti desktop, mendapatkan hierarchy untuk tracking
const getCategoryHierarchy = () => {
  return [...props.parents.map((p) => p.name), props.item.name];
};

const handleCategoryClick = () => {
  const levels = getCategoryHierarchy();

  const category = levels[0];
  const subcategory = levels[1];
  const subsubcategory = levels[2];

  trackClickCategory(category, subcategory, subsubcategory);

  // Tutup mobile menu setelah klik
  emit("close-mobile-menu");
};

const toggleSubmenu = () => {
  isOpen.value = !isOpen.value;
};

defineOptions({
  name: "MobileCategoryMenuItem",
});
</script>

<style scoped>
.mobile-submenu {
  width: 100%;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
