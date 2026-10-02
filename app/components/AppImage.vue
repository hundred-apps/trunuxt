<script setup lang="ts">
import { computed } from "vue";

/**
 * Wrapper <img> yang otomatis memakai @nuxt/image (ipx + sharp) untuk gambar
 * dari domain yang diizinkan, dan tetap memakai <img> biasa untuk sumber lain
 * (mis. placeholder eksternal) yang tidak boleh diproxy.
 */
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    sizes?: string;
    quality?: number;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
    preload?: boolean;
    decoding?: string;
  }>(),
  {
    alt: "",
    quality: 70,
    loading: "lazy",
    decoding: "async",
  }
);

const OPTIMIZABLE_HOSTS = [
  "https://www.trumecs.com/",
  "https://migration.trumecs.com/",
  "https://migrationbe.trumecs.com/",
];

const canOptimize = computed(() =>
  OPTIMIZABLE_HOSTS.some((host) => props.src?.startsWith(host))
);
</script>

<template>
  <NuxtImg
    v-if="canOptimize"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :quality="quality"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :preload="preload"
    :decoding="decoding"
    format="webp"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
  />
</template>