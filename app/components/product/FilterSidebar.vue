<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Icon name="material-symbols:filter-list" class="text-orange-500" />
      {{ $t("page.category.filter.title") }}
    </h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("page.category.filter.search")
        }}</label>
        <el-input
          :model-value="filters.search"
          @update:model-value="$emit('update:filters', { ...filters, search: $event })"
          :placeholder="$t('placeholder.searchProducts')"
          size="default"
          clearable
        >
          <template #prefix>
            <Icon name="material-symbols:search" class="text-gray-400" />
          </template>
        </el-input>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("page.category.filter.brand")
        }}</label>
        <el-select
          :model-value="filters.brand"
          @update:model-value="$emit('update:filters', { ...filters, brand: $event })"
          :placeholder="$t('placeholder.selectBrand')"
          size="default"
          clearable
          class="w-full"
        >
          <el-option
            v-for="brand in brands"
            :key="brand.id"
            :label="brand.name"
            :value="brand.url"
          />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("page.category.filter.grade")
        }}</label>
        <el-select
          :model-value="filters.grade"
          @update:model-value="$emit('update:filters', { ...filters, grade: $event })"
          :placeholder="$t('placeholder.selectGrade')"
          size="default"
          clearable
          class="w-full"
        >
          <el-option label="Asli" value="asli" />
          <el-option label="Replika" value="replika" />
          <el-option label="Bekas" value="bekas" />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("label.price")
        }}</label>
        <div class="flex gap-2">
          <el-input
            :model-value="filters.minPrice"
            @update:model-value="$emit('update:filters', { ...filters, minPrice: $event })"
            :placeholder="$t('placeholder.minPrice')"
            size="default"
            type="number"
          />
          <el-input
            :model-value="filters.maxPrice"
            @update:model-value="$emit('update:filters', { ...filters, maxPrice: $event })"
            :placeholder="$t('placeholder.maxPrice')"
            size="default"
            type="number"
          />
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <el-button
          type="primary"
          class="flex-1 bg-orange-500 border-orange-500 hover:bg-orange-600"
          @click="$emit('apply')"
        >
          {{ $t("page.category.filter.apply") }}
        </el-button>
        <el-button class="flex-1" @click="$emit('reset')">
          {{ $t("page.category.filter.reset") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filters: {
    search: string;
    brand: string;
    grade: string;
    minPrice: string;
    maxPrice: string;
  };
  brands: Array<{ id: number; name: string; url: string }>;
}>();

defineEmits<{
  "update:filters": [value: any];
  apply: [];
  reset: [];
}>();
</script>
