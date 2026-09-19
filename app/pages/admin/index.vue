<template>
  <div class="admin-dashboard">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ $t("admin.dashboard.title") }}
      </h1>
      <p class="mt-1 text-gray-600">
        {{
          $t("admin.dashboard.subtitle", {
            name: adminStore.currentAdmin?.name || "Admin",
          })
        }}
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        :title="$t('admin.dashboard.totalMembers')"
        :value="stats.totalMembers"
        :change="stats.membersChange"
        icon="material-symbols:people"
        color="blue"
      />
      <StatCard
        :title="$t('admin.dashboard.totalProducts')"
        :value="stats.totalProducts"
        :change="stats.productsChange"
        icon="material-symbols:inventory-2"
        color="green"
      />
      <StatCard
        :title="$t('admin.dashboard.totalOrders')"
        :value="stats.totalOrders"
        :change="stats.ordersChange"
        icon="material-symbols:shopping-cart"
        color="orange"
      />
      <StatCard
        :title="$t('admin.dashboard.totalRevenue')"
        :value="formatCurrency(stats.totalRevenue)"
        :change="stats.revenueChange"
        icon="material-symbols:attach-money"
        color="purple"
      />
    </div>

    <!-- Charts & Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <h2 class="text-lg font-semibold text-gray-900">
            {{ $t("admin.dashboard.recentOrders") }}
          </h2>
          <NuxtLink
            to="/admin/orders"
            class="text-sm text-orange-600 hover:underline"
            >{{ $t("admin.viewAll") }}</NuxtLink
          >
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">
                  #{{ order.id }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ order.customer }} •
                  {{ formatRelativeTime(order.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">
                  {{ formatCurrency(order.total) }}
                </p>
                <span
                  :class="getStatusClass(order.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Members -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <h2 class="text-lg font-semibold text-gray-900">
            {{ $t("admin.dashboard.recentMembers") }}
          </h2>
          <NuxtLink
            to="/admin/members"
            class="text-sm text-orange-600 hover:underline"
            >{{ $t("admin.viewAll") }}</NuxtLink
          >
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="member in recentMembers"
            :key="member.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium"
                >
                  {{ member.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-sm text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <span
                :class="
                  member.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ member.active ? $t("admin.active") : $t("admin.inactive") }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Low Stock Products -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div
        class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h2 class="text-lg font-semibold text-gray-900">
          {{ $t("admin.dashboard.lowStock") }}
        </h2>
        <NuxtLink
          to="/admin/products?stock=low"
          class="text-sm text-orange-600 hover:underline"
          >{{ $t("admin.viewAll") }}</NuxtLink
        >
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.product") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.stock") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.moq") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in lowStockProducts"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="getProductImage(product.img)"
                    :alt="product.name"
                    class="h-10 w-10 object-cover rounded"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">{{ product.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full"
                  >{{ product.stock }}</span
                >
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ product.moq }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                  >{{ $t("admin.lowStock") }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useAdminStore } from "~/stores/admin";
import StatCard from "~/components/admin/StatCard.vue";

definePageMeta({ layout: "admin" });

const adminStore = useAdminStore();

const stats = ref({
  totalMembers: 12543,
  membersChange: "+12%",
  totalProducts: 8542,
  productsChange: "+5%",
  totalOrders: 3421,
  ordersChange: "+8%",
  totalRevenue: 1250000000,
  revenueChange: "+15%",
});

const recentOrders = ref([
  {
    id: "TRM-2024-001",
    customer: "PT. Jaya Makmur",
    total: 15000000,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "TRM-2024-002",
    customer: "CV. Sumber Rejeki",
    total: 8500000,
    status: "processing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "TRM-2024-003",
    customer: "UD. Berkah",
    total: 3200000,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "TRM-2024-004",
    customer: "PT. Maju Jaya",
    total: 25000000,
    status: "shipped",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "TRM-2024-005",
    customer: "CV. Sejahtera",
    total: 12000000,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]);

const recentMembers = ref([
  { id: 1, name: "Budi Santoso", email: "budi@email.com", active: true },
  { id: 2, name: "Siti Rahayu", email: "siti@company.com", active: true },
  { id: 3, name: "Ahmad Wijaya", email: "ahmad@store.com", active: false },
  { id: 4, name: "Dewi Lestari", email: "dewi@shop.com", active: true },
  { id: 5, name: "Rudi Hartono", email: "rudi@market.com", active: true },
]);

const lowStockProducts = ref([
  {
    id: 1,
    name: "Engine Oil 15W40",
    sku: "EO-15W40-200L",
    stock: 3,
    moq: 10,
    img: "engine-oil.jpg",
  },
  {
    id: 2,
    name: 'Hydraulic Hose 1/2"',
    sku: "HH-012-50M",
    stock: 2,
    moq: 5,
    img: "hydraulic-hose.jpg",
  },
  {
    id: 3,
    name: "Air Filter Komatsu",
    sku: "AF-KOM-PC200",
    stock: 1,
    moq: 10,
    img: "air-filter.jpg",
  },
  {
    id: 4,
    name: "Hydraulic Filter Element",
    sku: "HFE-001",
    stock: 0,
    moq: 20,
    img: "hydraulic-filter.jpg",
  },
]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRelativeTime = (date: Date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getProductImage = (img: string) => {
  if (img) return `https://www.trumecs.com/public/image/product/${img}`;
  return "https://via.placeholder.com/40x40?text=No+Image";
};
</script>
