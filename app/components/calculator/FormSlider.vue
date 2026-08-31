<!-- components/calculator/FormSlider.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <el-slider
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :min="min"
      :max="max"
      :step="step"
      :marks="marks"
    />
    <span class="text-sm text-gray-500">{{ modelValue }}%</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number;
  label: string;
  min: number;
  max: number;
  step: number;
  marks?: Record<number, string>;
}>();

defineEmits<{
  "update:modelValue": [value: number];
}>();
</script>
