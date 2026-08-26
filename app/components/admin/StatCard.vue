<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
        <p v-if="change" class="text-sm mt-2" :class="changeStartsWithPlus ? 'text-green-600' : 'text-red-600'">
          <Icon :name="changeStartsWithPlus ? 'material-symbols:trending-up' : 'material-symbols:trending-down'" class="inline h-4 w-4" />
          {{ change }}
        </p>
      </div>
      <div :class="colorClasses" class="h-12 w-12 rounded-xl flex items-center justify-center">
        <Icon :name="icon" class="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts>
interface Props {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
  change?: string;
}

const props = defineProps<Props>();

const changeStartsWithPlus = computed(() => props.change?.startsWith('+') ?? false);

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    teal: 'bg-teal-500',
  };
  return colors[props.color] || 'bg-gray-500';
});
</script>