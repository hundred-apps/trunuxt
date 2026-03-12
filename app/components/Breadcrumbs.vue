<template>
  <div class="hidden lg:block py-2" id="breadcrumb">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li v-for="(item, index) in items" :key="index">
            <template v-if="index > 0">
              <span class="text-gray-400 mx-2">/</span>
            </template>

            <template v-if="item.to">
              <Trulink :to="item.to" class="text-orange-500 hover:underline">
                {{ item.text }}
              </Trulink>
            </template>

            <template v-else>
              <span class="text-gray-600 truncate max-w-[200px] lg:max-w-none">
                {{ item.text }}
              </span>
            </template>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>
