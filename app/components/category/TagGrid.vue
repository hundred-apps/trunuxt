<template>
  <section
    class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    aria-labelledby="tag-heading"
  >
    <header class="mb-4 flex items-center justify-between">
      <h2
        id="tag-heading"
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Icon name="material-symbols:local-offer" class="text-lg" />
        </span>
        {{ title }}

        <span
          v-if="tags.length > 0"
          class="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600"
        >
          {{ tags.length }}
        </span>
      </h2>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 4" :key="i" class="h-10 animate-pulse rounded-xl bg-gray-100" />
    </div>

    <!-- Empty -->
    <div v-else-if="tags.length === 0" class="py-8 text-center">
      <Icon name="material-symbols:local-offer" class="mx-auto text-3xl text-gray-300" />
      <p class="mt-2 text-sm text-gray-400">{{ $t('page.category.noBrands') }}</p>
    </div>

    <!-- List -->
    <ul
      v-else
      class="space-y-1.5 overflow-y-auto pr-1"
      :class="{ 'max-h-[320px]': tags.length > 8 }"
    >
      <li v-for="tag in tags" :key="tag.id">
        <button
          type="button"
          @click="handleClick(tag.id)"
          :aria-pressed="isActive(tag.id)"
          class="group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
          :class="
            isActive(tag.id)
              ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
              : 'border-gray-100 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/60'
          "
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
            :class="
              isActive(tag.id)
                ? 'border-white bg-white text-orange-500'
                : 'border-gray-300 bg-white text-transparent group-hover:border-orange-300'
            "
          >
            <Icon name="material-symbols:check" class="text-xs font-bold" />
          </span>

          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            :class="
              isActive(tag.id)
                ? 'bg-white/20 text-white'
                : 'bg-orange-50 text-orange-500'
            "
          >
            <Icon name="material-symbols:sell" class="text-sm" />
          </span>

          <span class="min-w-0 flex-1 truncate text-sm font-medium">
            {{ label(tag) }}
          </span>

          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="
              isActive(tag.id)
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
            "
          >
            {{ counts[String(tag.id)] ?? 0 }}
          </span>
        </button>
      </li>
    </ul>

    <p
      v-if="tags.length > 8"
      class="mt-2 flex items-center gap-1 text-[11px] text-gray-400"
    >
      <Icon name="material-symbols:unfold-more" class="text-xs" />
      {{ $t('page.category.scrollHint') }}
    </p>

    <Trubutton
      v-if="activeIds.length > 0"
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
import { useI18n } from "vue-i18n";

interface TagItem {
  id: string | number;
  tag?: string;
  tag_en?: string;
  tag_ch?: string;
}

const props = defineProps({
  tags: {
    type: Array as () => TagItem[],
    required: true,
  },
  activeIds: {
    type: Array as () => Array<string | number>,
    default: () => [],
  },
  counts: {
    type: Object as () => Record<string, number>,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "Tags",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  toggle: [id: string | number];
  clear: [];
}>();

const { locale } = useI18n();

const label = (tag: TagItem) => {
  const lang = String(locale.value).toLowerCase();
  if (lang === "en") return tag.tag_en || tag.tag || "";
  if (lang === "zh") return tag.tag_ch || tag.tag || "";
  return tag.tag || tag.tag_en || "";
};

const isActive = (id: string | number) => props.activeIds.includes(id);

const handleClick = (id: string | number) => emit("toggle", id);
</script>