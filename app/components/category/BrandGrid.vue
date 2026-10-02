<template>
  <section
    class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    aria-labelledby="brand-heading"
  >
    <header class="mb-4 flex items-center justify-between">
      <h2
        id="brand-heading"
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500"
        >
          <Icon name="material-symbols:business" class="text-lg" />
        </span>
        {{ title }}

        <span
          v-if="brands.length > 0"
          class="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600"
        >
          {{ brands.length }}
        </span>
      </h2>
      <Trulink
        v-if="seeAllUrl"
        :to="seeAllUrl"
        class="text-xs font-medium text-orange-500 hover:text-orange-600"
      >
        {{ $t("button.seeAll") }}
      </Trulink>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div
        v-for="i in 6"
        :key="i"
        class="h-10 animate-pulse rounded-xl bg-gray-100"
      />
    </div>

    <!-- Empty -->
    <div v-else-if="brands.length === 0" class="py-8 text-center">
      <Icon
        name="material-symbols:inventory-2"
        class="mx-auto text-3xl text-gray-300"
      />
      <p class="mt-2 text-sm text-gray-400">
        {{ $t("page.category.noBrands") }}
      </p>
    </div>

    <!-- List -->
    <ul
      v-else
      class="space-y-1.5 overflow-y-auto pr-1"
      :class="{ 'max-h-[320px]': brands.length > 8 }"
    >
      <li v-for="brand in brands" :key="brand.id">
        <button
          type="button"
          @click="handleClick(brand.id)"
          :disabled="disabled?.includes(brand.id)"
          :aria-pressed="isActive(brand.id)"
          class="group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
          :class="
            isActive(brand.id)
              ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
              : 'border-gray-100 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/60'
          "
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
            :class="
              isActive(brand.id)
                ? 'border-white bg-white text-orange-500'
                : 'border-gray-300 bg-white text-transparent group-hover:border-orange-300'
            "
          >
            <Icon name="material-symbols:check" class="text-xs font-bold" />
          </span>

          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md text-xs font-bold"
            :class="
              isActive(brand.id)
                ? 'bg-white/20 text-white'
                : 'bg-orange-50 text-orange-500'
            "
          >
            <img
              v-if="brand.img"
              :src="`${config.public.baseImageCat}${brand.img}`"
              :alt="brand.name"
              class="h-full w-full object-contain"
            />
            <Icon
              v-else
              :name="brand.icon || 'material-symbols:business'"
              class="text-sm"
            />
          </span>

          <span class="min-w-0 flex-1 truncate text-sm font-medium">
            {{ brand.name }}
          </span>

          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="
              isActive(brand.id)
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
            "
          >
            {{ counts[brand.id] ?? 0 }}
          </span>
        </button>
      </li>
    </ul>

    <p
      v-if="brands.length > 8"
      class="mt-2 flex items-center gap-1 text-[11px] text-gray-400"
    >
      <Icon name="material-symbols:unfold-more" class="text-xs" />
      {{ $t("page.category.scrollHint") }}
    </p>

    <Trubutton
      v-if="activeId && brands.length > 0"
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
const config = useRuntimeConfig();
interface Brand {
  id: number;
  name: string;
  url: string;
  img?: string;
  icon?: string;
}

const props = defineProps({
  brands: {
    type: Array as () => Brand[],
    required: true,
  },
  activeId: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Array as () => number[],
    default: () => [],
  },
  title: {
    type: String,
    default: "Merek",
  },
  seeAllUrl: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  counts: {
    type: Object as () => Record<number, number>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  select: [id: number];
  clear: [];
}>();

const isActive = (id: number) => props.activeId === id;

const handleClick = (id: number) => {
  if (props.disabled?.includes(id)) return;
  emit("select", id);
};
</script>
