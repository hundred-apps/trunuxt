<template>
  <div class="member-dashboard">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('member.dashboard.title') }}</h1>
      <p class="mt-1 text-gray-600">{{ $t('member.dashboard.subtitle', { name: authStore.user?.firstName || '' }) }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('member.dashboard.activeRfq') }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.activeRfq }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Icon name="material-symbols:assignment" class="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('member.dashboard.pendingOrders') }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.pendingOrders }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="material-symbols:pending" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('member.dashboard.completedOrders') }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.completedOrders }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Icon name="material-symbols:check-circle" class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('member.dashboard.unreadMessages') }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.unreadMessages }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Icon name="material-symbols:chat" class="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('member.dashboard.quickActions') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          to="/member/rfq/create"
          class="group p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
            <Icon name="material-symbols:add-circle" class="h-5 w-5 text-orange-600" />
          </div>
          <h3 class="font-medium text-gray-900">{{ $t('member.dashboard.createRfq') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('member.dashboard.createRfqDesc') }}</p>
        </NuxtLink>

        <NuxtLink
          to="/member/rfq"
          class="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <Icon name="material-symbols:list-alt" class="h-5 w-5 text-blue-600" />
          </div>
          <h3 class="font-medium text-gray-900">{{ $t('member.dashboard.viewRfq') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('member.dashboard.viewRfqDesc') }}</p>
        </NuxtLink>

        <NuxtLink
          to="/member/chat"
          class="group p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
            <Icon name="material-symbols:message" class="h-5 w-5 text-green-600" />
          </div>
          <h3 class="font-medium text-gray-900">{{ $t('member.dashboard.messages') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('member.dashboard.messagesDesc') }}</p>
        </NuxtLink>

        <NuxtLink
          to="/c/all/query?q=on"
          class="group p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          <div class="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
            <Icon name="material-symbols:search" class="h-5 w-5 text-purple-600" />
          </div>
          <h3 class="font-medium text-gray-900">{{ $t('member.dashboard.findProducts') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('member.dashboard.findProductsDesc') }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent RFQ -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('member.dashboard.recentRfq') }}</h2>
          <NuxtLink to="/member/rfq" class="text-sm text-orange-600 hover:underline">{{ $t('member.viewAll') }}</NuxtLink>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="rfq in recentRfq" :key="rfq.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ rfq.title }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(rfq.createdAt) }} · {{ getStatusLabel(rfq.status) }}</p>
              </div>
              <span :class="getStatusClass(rfq.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusLabel(rfq.status) }}
              </span>
            </div>
          </div>
          <div v-if="recentRfq.length === 0" class="px-6 py-8 text-center text-gray-500">
            {{ $t('member.dashboard.noRfq') }}
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('member.dashboard.recentOrders') }}</h2>
          <NuxtLink to="/member/orders" class="text-sm text-orange-600 hover:underline">{{ $t('member.viewAll') }}</NuxtLink>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="order in recentOrders" :key="order.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ order.productName }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(order.createdAt) }} · {{ formatPrice(order.total) }}</p>
              </div>
              <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
          </div>
          <div v-if="recentOrders.length === 0" class="px-6 py-8 text-center text-gray-500">
            {{ $t('member.dashboard.noOrders') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const stats = ref({
  activeRfq: 3,
  pendingOrders: 2,
  completedOrders: 12,
  unreadMessages: 5,
});

const recentRfq = ref([
  { id: 1, title: 'Sparepart Excavator Komatsu PC200', status: 'waiting_quotes', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: 2, title: 'Ban Truck 11.00R20 - 20 unit', status: 'quoted', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 3, title: 'Oli Mesin Diesel 15W40 - 5 drum', status: 'completed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
]);

const recentOrders = ref([
  { id: 1, productName: 'GREASE LI CX-2 - 1 drum', status: 'shipped', total: 19427899, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: 2, productName: 'Ban Hixih GD08 825R16 - 4 set', status: 'delivered', total: 10074000, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: 3, productName: 'Oli Hydraulic 46 - 2 drum', status: 'processing', total: 15680000, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
]);

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    waiting_quotes: 'Menunggu Penawaran',
    quoted: 'Sudah Dikutip',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Diterima',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    waiting_quotes: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    processing: 'bg-orange-100 text-orange-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>