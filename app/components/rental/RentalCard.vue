<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
    <div class="relative aspect-video overflow-hidden">
      <img
        :src="getImage(item.image)"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-3 left-3 flex gap-2">
        <span class="px-2 py-1 text-xs bg-white/90 text-gray-700 rounded">{{ item.category }}</span>
        <span v-if="item.withOperator" class="px-2 py-1 text-xs bg-green-500 text-white rounded">{{ $t('rental.withOperator') }}</span>
      </div>
      <div class="absolute bottom-3 left-3 right-3 flex justify-between">
        <div class="bg-white/90 rounded-lg px-3 py-1.5 text-sm font-semibold text-orange-600">
          {{ formatPrice(item.priceDaily) }}<span class="font-normal text-gray-500">/hari</span>
        </div>
        <div v-if="item.priceMonthly" class="bg-white/90 rounded-lg px-3 py-1.5 text-sm text-gray-600">
          {{ formatPrice(item.priceMonthly) }}<span class="font-normal">/bulan</span>
        </div>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
        {{ item.name }}
      </h3>
      <p class="text-sm text-gray-500 mb-2 flex items-center gap-1">
        <Icon name="material-symbols:location-on" class="h-3 w-3" />
        {{ item.location }}
      </p>
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span v-for="spec in Object.entries(item.specs || {})" :key="spec[0]" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
          {{ spec[1] }}
        </span>
      </div>
      <Trulink
        :to="`/rental/${item.id}/${formatSlug(item.name)}`"
        class="w-full"
      >
        <Trubutton
          :text="$t('rental.viewDetail')"
          type="primary"
          variant="outline"
          full-width
          size="small"
        />
      </Trulink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  item: any;
}

const props = defineProps<Props>();
const config = useRuntimeConfig();

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
const formatSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const getImage = (img: string) => img ? `${config.public.baseImageProduct}${img}` : 'https://via.placeholder.com/400x300?text=No+Image';
</script>