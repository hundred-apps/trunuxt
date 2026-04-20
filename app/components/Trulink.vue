<script lang="ts" setup>
// micro compiler
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "orange",
  },
});
// state
const href = toRef(props, "href");
const to = toRef(props, "to");

// computed classes
const linkClass = computed(() => {
  const colorClasses = {
    orange: "hover:text-orange-700 text-orange-500",
    blue: "hover:text-blue-700 text-blue-500",
    red: "hover:text-red-700 text-red-500",
    green: "hover:text-green-700 text-green-500",
    purple: "hover:text-purple-700 text-purple-500",
    gray: "hover:text-gray-700 text-gray-500",
    black: "hover:text-gray-700 text-black",
  };
  return (
    colorClasses[props.color as keyof typeof colorClasses] ||
    colorClasses.orange
  );
});
</script>

<template>
  <NuxtLinkLocale v-if="to" tag="a" :to="to" :class="linkClass">
    <slot>{{ text }}</slot>
  </NuxtLinkLocale>
  <a v-else-if="!href" :class="linkClass" href="#">
    <slot>{{ text }}</slot>
  </a>
  <a v-else :class="linkClass" :href="href">
    <slot>{{ text }}</slot>
  </a>
</template>
