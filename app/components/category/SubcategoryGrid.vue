<template>
  <section class="mb-8 lg:mb-12" aria-labelledby="subcat-heading">
    <header class="flex items-center justify-between mb-6">
      <h2 id="subcat-heading" class="text-xl lg:text-2xl font-bold text-gray-800">
        {{ title }}
      </h2>
      <Trulink
        v-if="seeAllUrl"
        :to="seeAllUrl"
        class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
      >
        {{ $t('button.seeAll') }}
        <Icon name="material-symbols:arrow-forward" class="text-sm" />
      </Trulink>
    </header>

    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
      <div v-for="i in 10" :key="i" class="animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-xl" />
        <div class="h-3 bg-gray-200 rounded mt-2 w-3/4 mx-auto" />
      </div>
    </div>

    <div v-else-if="subcategories.length === 0" class="text-center py-12">
      <Icon name="material-symbols:inventory-2" class="text-4xl text-gray-300 mb-3" />
      <p class="text-gray-500">{{ $t('page.category.noSubcategories') }}</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
      <button
        v-for="sub in subcategories"
        :key="sub.id"
        @click="handleClick(sub.id)"
        :class="[
          'group relative bg-white rounded-xl p-4 text-center shadow-sm border transition-all duration-300',
          'min-h-[44px] min-w-[44px]',
          isActive(sub.id)
            ? 'border-2 border-orange-500 shadow-md ring-2 ring-orange-500/20'
            : 'border-gray-100 hover:border-orange-200 hover:shadow-lg'
        ]"
        :disabled="disabled?.includes(sub.id)"
        :aria-pressed="isActive(sub.id)"
        type="button"
      >
        <div
          class="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors"
          :class="isActive(sub.id) ? 'bg-orange-100' : ''"
        >
          <Icon
            :name="sub.icon || 'material-symbols:inventory-2'"
            class="text-xl lg:text-2xl text-orange-500"
          />
        </div>
        <p
          class="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors line-clamp-2"
          :class="isActive(sub.id) ? 'text-orange-500 font-semibold' : ''"
        >
          {{ sub.name }}
        </p>

        <div
          v-if="isActive(sub.id)"
          class="absolute top-2 right-2 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs"
        >
          <Icon name="material-symbols:check" class="text-xs" />
        </div>

        <div
          v-if="disabled?.includes(sub.id)"
          class="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center"
        >
          <Icon name="material-symbols:block" class="text-gray-400 text-xl" />
        </div>
      </button>
    </div>

    <div v-if="selectedCount > 0 && subcategories.length > 5" class="mt-4 text-center">
      <Trubutton
        :text="$t('button.clearFilters')"
        variant="outline"
        size="small"
        icon="mdi:filter-remove"
        @click="$emit('clear')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Subcategory {
  id: number;
  name: string;
  url: string;
  icon?: string;
}

const props = defineProps({
  subcategories: {
    type: Array as () => Subcategory[],
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
    default: 'Subkategori',
  },
  seeAllUrl: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  select: [id: number];
  clear: [];
}>();

const selectedCount = computed(() => (props.activeId ? 1 : 0));

const isActive = (id: number) => props.activeId === id;

const handleClick = (id: number) => {
  if (props.disabled?.includes(id)) return;
  emit('select', id);
};
</script>