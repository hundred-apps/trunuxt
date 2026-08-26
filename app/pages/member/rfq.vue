<template>
  <div class="member-rfq">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('member.rfq.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ $t('member.rfq.subtitle') }}</p>
      </div>
      <NuxtLink to="/member/rfq/create">
        <Trubutton
          :text="$t('member.rfq.createNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
        />
      </NuxtLink>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6">
      <div class="flex gap-2 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="[
            activeTab === tab.value
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }} <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- RFQ List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-4 px-6 py-4 border-b border-gray-100">
            <div class="h-4 bg-gray-200 rounded w-1/4" />
            <div class="h-4 bg-gray-200 rounded w-1/3" />
            <div class="h-4 bg-gray-200 rounded w-1/6" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredRfq.length === 0" class="text-center py-12">
        <Icon name="material-symbols:inventory-2" class="text-4xl text-gray-300 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ $t('member.rfq.empty') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('member.rfq.emptyDesc') }}</p>
        <NuxtLink to="/member/rfq/create">
          <Trubutton
            :text="$t('member.rfq.createFirst')"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="rfq in filteredRfq"
          :key="rfq.id"
          class="px-6 py-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="font-medium text-gray-900 truncate">{{ rfq.title }}</h3>
              <span :class="getStatusClass(rfq.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusLabel(rfq.status) }}
              </span>
              <span class="text-sm text-gray-500">{{ formatDate(rfq.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1 truncate">{{ rfq.description }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="cat in rfq.categories" :key="cat" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{{ cat }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 sm:ml-4">
            <NuxtLink
              :to="`/member/rfq/${rfq.id}`"
              class="text-sm text-orange-600 hover:underline font-medium"
            >
              {{ $t('member.rfq.viewDetails') }}
            </NuxtLink>
            <button
              v-if="rfq.status === 'waiting_quotes'"
              @click="cancelRfq(rfq.id)"
              class="text-sm text-red-600 hover:underline"
            >
              {{ $t('member.rfq.cancel') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @update:current-page="fetchRfq"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const activeTab = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const tabs = computed(() => [
  { value: 'all', label: 'Semua', count: 15 },
  { value: 'waiting_quotes', label: 'Menunggu Penawaran', count: 3 },
  { value: 'quoted', label: 'Sudah Dikutip', count: 5 },
  { value: 'completed', label: 'Selesai', count: 7 },
  { value: 'cancelled', label: 'Dibatalkan', count: 0 },
]);

const rfqList = ref([
  { id: 1, title: 'Sparepart Excavator Komatsu PC200', status: 'waiting_quotes', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), description: 'Butuh engine assembly, injector, turbo, pompa air untuk Komatsu PC200-8', categories: ['Engine', 'Hydraulic'] },
  { id: 2, title: 'Ban Truck 11.00R20 - 20 unit', status: 'quoted', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), description: 'Ban radial truck & bus, merk bebas, kondisi baru', categories: ['Ban', 'Truck'] },
  { id: 3, title: 'Oli Mesin Diesel 15W40 - 5 drum', status: 'completed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), description: 'Oli mesin diesel 15W40 API CI-4, drum 200L', categories: ['Pelumas', 'Engine Oil'] },
  { id: 4, title: 'Hydraulic Hose Assembly - 10 set', status: 'waiting_quotes', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), description: 'Hose hidrolik high pressure untuk excavator', categories: ['Hydraulic', 'Sparepart'] },
  { id: 5, title: 'Filter Oli & Bahan Bakar - 50 pcs', status: 'quoted', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), description: 'Filter oli dan bahan bakar untuk armada truk', categories: ['Filter', 'Maintenance'] },
]);

const filteredRfq = computed(() => {
  if (activeTab.value === 'all') return rfqList.value;
  return rfqList.value.filter(r => r.status === activeTab.value);
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    waiting_quotes: 'Menunggu Penawaran',
    quoted: 'Sudah Dikutip',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    waiting_quotes: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const cancelRfq = async (id: number) => {
  try {
    await ElMessageBox.confirm('Batalkan RFQ ini?', 'Konfirmasi', {
      confirmButtonText: 'Batalkan',
      cancelButtonText: 'Batal',
      type: 'warning',
    });
    ElMessage.success('RFQ dibatalkan');
  } catch {}
};

const fetchRfq = async () => {
  loading.value = true;
  await new Promise(r => setTimeout(r, 500));
  loading.value = false;
};

onMounted(() => {
  fetchRfq();
});

watch(activeTab, () => {
  currentPage.value = 1;
  fetchRfq();
});
</script>