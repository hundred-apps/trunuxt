<!-- components/calculator/FormInput.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <el-input-number
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :min="min"
      :max="max"
      :step="step"
      class="w-full"
      :formatter="formatter"
      :parser="parser"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  type?: "number" | "currency";
}>();

defineEmits<{
  "update:modelValue": [value: number];
}>();

const formatter = (value: number) => {
  if (props.type === "currency") {
    return new Intl.NumberFormat("id-ID").format(value);
  }
  return String(value);
};

const parser = (value: string) => {
  return Number(value.replace(/[^0-9]/g, ""));
};
</script>
