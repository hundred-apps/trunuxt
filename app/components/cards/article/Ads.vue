<template>
  <div
    class="hidden lg:block bg-[#F6F6F7] border border-gray-200 rounded-lg overflow-hidden"
  >
    <div class="p-4">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <h6 class="text-gray-600 text-sm mb-2">{{ description }}</h6>
      <a
        :href="buttonLink"
        class="text-orange-500 hover:underline text-sm inline-block"
      >
        {{ buttonText }}
      </a>
    </div>
    <AppImage :src="imageUrl" :alt="imageAlt" class="w-full" sizes="100vw lg:1280px" width="1280" height="400" loading="lazy" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "MAINTENANCE",
  },
  description: {
    type: String,
    default: "Availability of your units is our priority",
  },
  buttonText: {
    type: String,
    default: "Apply",
  },
  buttonLink: {
    type: String,
    default: "#",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: "maintenance",
  },
});
</script>
