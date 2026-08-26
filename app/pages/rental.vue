<template>
  <div class="rental-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('rental.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ $t('rental.subtitle') }}</p>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <el-input
              v-model="filters.search"
              placeholder="Cari alat berat..."
              class="w-full"
              prefix-icon="material-symbols:search"
              @keyup.enter="applyFilters"
            />
          </div>
          <div class="flex gap-2 flex-wrap">
            <el-select v-model="filters.category" placeholder="Kategori" class="w-40" size="small">
              <el-option label="Excavator" value="excavator" />
              <el-option label="Bulldozer" value="bulldozer" />
              <el-option label="Wheel Loader" value="wheel_loader" />
              <el-option label="Dump Truck" value="dump_truck" />
              <el-option label="Crane" value="crane" />
              <el-option label="Forklift" value="forklift" />
            </el-select>
            <el-select v-model="filters.duration" placeholder="Durasi" class="w-40" size="small">
              <el-option label="Harian" value="daily" />
              <el-option label="Mingguan" value="weekly" />
              <el-option label="Bulanan" value="monthly" />
            </el-select>
            <el-select v-model="filters.location" placeholder="Lokasi" class="w-40" size="small">
              <el-option label="Jakarta" value="jakarta" />
              <el-option label="Bekasi" value="bekasi" />
              <el-option label="Cikarang" value="cikarang" />
              <el-option label="Tangerang" value="tangerang" />
              <el-option label="Lainnya" value="other" />
            </el-select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-3">
          <div class="lg:sticky lg:top-[var(--header-height,150px)] space-y-6" style="--header-height: 150px;">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 class="font-semibold text-gray-900 mb-3">{{ $t('rental.filters') }}</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('rental.priceRange') }}</label>
                  <el-slider
                    v-model="priceRange"
                    :min="0"
                    :max="50000000"
                    :step="500000"
                    range
                    class="w-full"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Rp 0</span>
                    <span>Rp 50 Juta</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('rental.availability') }}</label>
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <el-checkbox v-model="filters.withOperator" size="small" />
                      <span class="text-sm text-gray-700">{{ $t('rental.withOperator') }}</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <el-checkbox v-model="filters.withFuel" size="small" />
                      <span class="text-sm text-gray-700">{{ $t('rental.withFuel') }}</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <el-checkbox v-model="filters.availableNow" size="small" />
                      <span class="text-sm text-gray-700">{{ $t('rental.availableNow') }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-9">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-500">
              {{ $t('rental.showing', { from: showingFrom, to: showingTo, total: totalItems }) }}
            </p>
            <div class="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <button
                @click="viewMode = 'grid'"
                class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                :class="viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                <Icon name="material-symbols:grid-view" class="text-lg" />
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-3 transition-colors min-w-[44px] min-h-[44px]"
                :class="viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                <Icon name="material-symbols:view-list" class="text-lg" />
              </button>
            </div>
          </div>

          <div v-if="loading" :class="gridClass">
            <div v-for="i in 6" :key="i" class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="aspect-video bg-gray-200" />
              <div class="p-3 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-1/3" />
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          <div v-else-if="equipment.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
            <Icon name="material-symbols:construction" class="text-6xl text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-600 mb-2">{{ $t('rental.noResults') }}</h3>
            <p class="text-sm text-gray-400 mb-4">{{ $t('rental.noResultsDesc') }}</p>
            <Trubutton :text="$t('button.clearFilters')" variant="outline" icon="mdi:filter-remove" @click="resetFilters" />
          </div>

          <div v-else>
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <RentalCard v-for="item in equipment" :key="item.id" :item="item" />
            </div>

            <div v-else class="space-y-3">
              <div v-for="item in equipment" :key="item.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <Trulink :to="`/rental/${item.id}/${formatSlug(item.name)}`" class="flex">
                  <div class="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-50">
                    <img :src="getImage(item.image)" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div class="flex-1 p-4">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">{{ item.category }}</span>
                      <span v-if="item.withOperator" class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">{{ $t('rental.withOperator') }}</span>
                    </div>
                    <h3 class="font-medium text-gray-800 line-clamp-1 mb-1">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ item.location }}</p>
                    <div class="flex items-center gap-4">
                      <div class="text-sm font-bold text-orange-600">{{ formatPrice(item.priceDaily) }}<span class="text-gray-500 font-normal">/hari</span></div>
                    </div>
                  </div>
                </Trulink>
              </div>
            </div>

            <div class="flex justify-center mt-8">
              <el-pagination background layout="prev, pager, next" :total="totalItems" :page-size="perPage" v-model:current-page="currentPage" @update:current-page="handlePageChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue';
import { useI18n } from 'vue-i18n';
import { useHeaderHeight } from '~/composables/useHeaderHeight';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import RentalCard from '~/components/rental/RentalCard.vue';

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { headerHeight, updateHeaderHeight } = useHeaderHeight();

const loading = ref(false);
const equipment = ref<any[]>([]);
const viewMode = ref<'grid' | 'list'>('grid');
const currentPage = ref(1);
const perPage = ref(12);
const totalItems = ref(0);

const priceRange = ref([0, 50000000]);

const filters = ref({
  search: '',
  category: '',
  duration: '',
  location: '',
  withOperator: false,
  withFuel: false,
  availableNow: false,
});

const breadcrumbs = computed(() => [
  { text: $t('breadcrumb.home'), to: '/' },
  { text: $t('rental.title'), to: '/rental' },
]);

const gridClass = computed(() => {
  if (viewMode.value === 'grid') return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6';
  return '';
});

const showingFrom = computed(() => (currentPage.value - 1) * perPage.value + 1);
const showingTo = computed(() => Math.min(currentPage.value * perPage.value, totalItems.value));

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
const formatSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const getImage = (img: string) => img ? `${config.public.baseImageProduct}${img}` : 'https://via.placeholder.com/400x300?text=No+Image';

const applyFilters = () => { currentPage.value = 1; fetchEquipment(); };
const resetFilters = () => { filters.value = { search: '', category: '', duration: '', location: '', withOperator: false, withFuel: false, availableNow: false }; priceRange.value = [0, 50000000]; fetchEquipment(); };
const handlePageChange = (page: number) => { currentPage.value = page; window.scrollTo({ top: 0, behavior: 'smooth' }); fetchEquipment(); };

const fetchEquipment = async () => {
  loading.value = true;
  try {
    // Mock data - replace with actual API call
    await new Promise(r => setTimeout(r, 500));
    equipment.value = [
      { id: 1, name: 'Excavator Komatsu PC200-8', category: 'Excavator', location: 'Jakarta', priceDaily: 2500000, priceMonthly: 45000000, withOperator: true, image: 'excavator-pc200.jpg', specs: { weight: '20 ton', bucketCapacity: '1.0 m3', year: 2020 } },
      { id: 2, name: 'Bulldozer Komatsu D65P', category: 'Bulldozer', location: 'Bekasi', priceDaily: 3000000, priceMonthly: 55000000, withOperator: true, image: 'dozer-d65p.jpg', specs: { weight: '18 ton', bladeCapacity: '3.5 m3', year: 2019 } },
      { id: 3, name: 'Wheel Loader Komatsu WA320', category: 'Wheel Loader', location: 'Cikarang', priceDaily: 2000000, priceMonthly: 38000000, withOperator: true, image: 'loader-wa320.jpg', specs: { weight: '12 ton', bucketCapacity: '2.5 m3', year: 2021 } },
      { id: 4, name: 'Dump Truck Hino 500', category: 'Dump Truck', location: 'Tangerang', priceDaily: 1500000, priceMonthly: 28000000, withOperator: false, image: 'dump-hino.jpg', specs: { capacity: '10 ton', year: 2020 } },
      { id: 5, name: 'Crane Tadano 50 Ton', category: 'Crane', location: 'Jakarta', priceDaily: 5000000, priceMonthly: 90000000, withOperator: true, image: 'crane-tadano.jpg', specs: { maxCapacity: '50 ton', boomLength: '40 m', year: 2018 } },
      { id: 6, name: 'Forklift Toyota 3 Ton', category: 'Forklift', location: 'Bekasi', priceDaily: 800000, priceMonthly: 15000000, withOperator: false, image: 'forklift-toyota.jpg', specs: { capacity: '3 ton', liftHeight: '4.5 m', year: 2022 } },
    ];
    totalItems.value = equipment.value.length;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  updateHeaderHeight();
  await fetchEquipment();
});
</script>