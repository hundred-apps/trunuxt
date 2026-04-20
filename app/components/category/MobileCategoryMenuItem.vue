<template>
  <!-- Jika punya children, render sub-menu -->
  <div v-if="hasChildren" class="mobile-submenu">
    <div
      class="flex items-center justify-between border-b py-3 border-gray-200 hover:text-gray-500 cursor-pointer"
      @click="toggleSubmenu"
    >
      <span>{{ item.name }}</span>
      <span class="text-gray-700">
        <svg
          :class="{ 'rotate-180': isOpen }"
          class="w-4 h-4 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </span>
    </div>

    <!-- Render children recursively -->
    <div v-show="isOpen" class="ml-4">
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
    class="flex items-center gap-3 border-b py-3 text-gray-700 hover:bg-opacity-10 border-gray-200 hover:text-gray-500 cursor-pointer"
    @click="handleCategoryClick"
  >
    <span>{{ item.name }}</span>
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
