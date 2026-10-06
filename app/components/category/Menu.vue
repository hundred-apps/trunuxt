<template>
  <div ref="menuRef" class="relative" @mouseleave="closeMenu">
    <!-- Trigger: daftar kategori utama -->
    <ul class="flex items-center gap-1">
      <li v-for="product in products" :key="product.id">
        <Trulink
          :to="hasChildren(product) ? undefined : categoryUrl(product)"
          class="flex items-center gap-1 rounded-lg pe-3 py-2 text-sm font-medium transition-colors"
          :class="
            isActiveRoot(product)
              ? ' text-orange-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
          "
          @mouseenter="openRoot(product, $event)"
          @focus="openRoot(product, $event)"
          @click="handleClick(product)"
        >
          <span class="max-w-[9rem] truncate">{{ product.name }}</span>
          <Icon
            v-if="hasChildren(product)"
            name="material-symbols:keyboard-arrow-down"
            class="text-base text-gray-400 transition-transform duration-200"
            :class="isActiveRoot(product) ? 'rotate-180' : ''"
          />
        </Trulink>
      </li>
    </ul>

    <!-- Mega panel: setiap level jadi satu kolom, berlanjut ke kanan -->
    <div
      v-if="activeRoot"
      class="absolute top-full z-50 pt-2 w-max"
      :style="panelStyle"
    >
      <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
        <div class="flex items-start overflow-x-auto">
          <div
            v-for="(col, colIndex) in columns"
            v-show="col.length > 0"
            :key="colIndex"
            class="w-[16rem] shrink-0"
            :class="colIndex > 0 ? 'border-l border-gray-100 pl-4 ml-4' : ''"
          >
            <!-- Judul kolom = node yang sedang aktif di kolom sebelumnya -->
            <p
              class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400"
            >
              {{ columnTitle(colIndex) }}
            </p>

            <ul
              class="max-h-[60vh] space-y-0.5 overflow-y-auto overscroll-contain pr-1"
            >
              <li v-for="item in col" :key="item.id">
                <div
                  class="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                  :class="
                    isActiveItem(item)
                      ? 'bg-orange-50 font-medium text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                  @mouseenter="hoverItem(item, colIndex)"
                  @focus="hoverItem(item, colIndex)"
                >
                  <Trulink
                    :to="categoryUrl(item)"
                    class="min-w-0 flex-1 truncate"
                    @click="handleClick(item, colIndex)"
                  >
                    {{ item.name }}
                  </Trulink>
                  <Icon
                    v-if="hasChildren(item)"
                    name="material-symbols:chevron-right"
                    class="shrink-0 text-base text-gray-300"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import type { ProductCategory } from "~/types/category";

const { trackClickCategory } = useAnalytics();

const props = defineProps<{
  products: ProductCategory[];
}>();

const emit = defineEmits<{
  (e: "select", index: string): void;
}>();

const activeRoot = ref<any>(null);

// Rantai node aktif: [sub dari root, subsub, ...]
const activeChain = ref<any[]>([]);

const menuRef = ref<HTMLElement | null>(null);
const panelStyle = ref<Record<string, string>>({});

// Panel menempel pada kategori yang di-hover: sisi kiri panel = sisi kiri
// trigger, lebar panel mengikuti isi (w-max) dan hanya dibatasi layar.
const updatePanelPosition = (event?: Event) => {
  const container = menuRef.value;
  const target = event?.currentTarget as HTMLElement | undefined;

  if (!container || !target || typeof window === "undefined") {
    panelStyle.value = {};
    return;
  }

  const cRect = container.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();

  const left = Math.max(0, tRect.left - cRect.left);
  const viewportGap = 16;
  const maxWidth = Math.max(320, window.innerWidth - left - viewportGap);

  panelStyle.value = {
    left: `${left}px`,
    maxWidth: `${maxWidth}px`,
  };
};

const hasChildren = (item: any) =>
  Array.isArray(item?.children) && item.children.length > 0;

const isActiveRoot = (product: any) => activeRoot.value?.id === product.id;
const isActiveItem = (item: any) => {
  const node = activeChain.value.find((n) => n.id === item.id);
  return !!node;
};

// Kolom 0 = anak dari root, kolom 1 = anak dari activeChain[0], dst.
const columns = computed<any[][]>(() => {
  if (!activeRoot.value) return [];
  const cols: any[][] = [activeRoot.value.children || []];
  activeChain.value.forEach((node) => {
    if (hasChildren(node)) {
      cols.push(node.children || []);
    }
  });
  return cols;
});

const columnTitle = (colIndex: number) => {
  if (colIndex === 0) return activeRoot.value?.name || "";
  return activeChain.value[colIndex - 1]?.name || "";
};

const openRoot = (product: any, event?: Event) => {
  if (!hasChildren(product)) return;
  activeRoot.value = product;
  activeChain.value = [];
  updatePanelPosition(event);
};

const closeMenu = () => {
  activeRoot.value = null;
  activeChain.value = [];
};

// Hover item di kolom colIndex: item jadi node aktif, level di bawahnya reset
const hoverItem = (item: any, colIndex: number) => {
  activeChain.value = [...activeChain.value.slice(0, colIndex), item];
};

// Rantai node untuk membangun URL: [root, ...sampai item]
const urlTrail = (item: any, colIndex: number) => [
  activeRoot.value,
  ...activeChain.value.slice(0, colIndex + 1),
  item,
];

const categoryUrl = (item: any) => {
  const id = item?.id;
  return id != null ? `/search?cat=${id}` : "/search";
};

const handleClick = (item: any, colIndex: number) => {
  const trail = urlTrail(item, colIndex);
  const levels = trail.map((i) => i?.name).filter(Boolean);
  trackClickCategory(levels[0], levels[1], levels[2]);
  emit("select", String(item?.id ?? ""));
  closeMenu();
};

watch(
  () => props.products,
  () => closeMenu()
);
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}
</style>
