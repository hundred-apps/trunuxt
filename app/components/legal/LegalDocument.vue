<template>
  <div class="space-y-8">
    <!-- Intro -->
    <div
      v-if="doc.intro?.length"
      class="rounded-2xl border border-orange-100 bg-orange-50/60 p-5"
    >
      <p
        v-for="(paragraph, i) in doc.intro"
        :key="i"
        class="text-sm sm:text-base text-gray-700 leading-relaxed"
        :class="i > 0 ? 'mt-3' : ''"
      >
        {{ paragraph }}
      </p>
    </div>

    <!-- Sections -->
    <section
      v-for="(section, sIndex) in doc.sections"
      :key="sIndex"
      class="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
    >
      <div class="flex items-start gap-3 mb-4">
        <span
          v-if="section.number"
          class="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-bold"
        >
          {{ section.number }}
        </span>
        <h2
          class="text-lg sm:text-xl font-bold text-gray-800 leading-snug pt-1"
        >
          {{ section.heading }}
        </h2>
      </div>

      <p
        v-for="(paragraph, pIndex) in section.paragraphs || []"
        :key="`p-${pIndex}`"
        class="text-sm sm:text-base text-gray-600 leading-relaxed mb-3"
      >
        {{ paragraph }}
      </p>

      <ul
        v-if="section.list?.length"
        class="space-y-2.5 mt-3 list-none"
      >
        <li
          v-for="(item, lIndex) in section.list"
          :key="`l-${lIndex}`"
          class="flex gap-3 text-sm sm:text-base text-gray-600 leading-relaxed"
        >
          <span class="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { LegalDocument } from "~/content/legal/types";

defineProps<{
  doc: LegalDocument;
}>();
</script>
