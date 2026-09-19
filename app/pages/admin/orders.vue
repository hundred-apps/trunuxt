<template>
  <div class="admin-orders">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.orders.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.orders.subtitle") }}</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/orders/export">
          <Trubutton
            :text="$t('admin.orders.export')"
            type="primary"
            variant="outline"
            icon="material-symbols:download"
          />
        </NuxtLink>
        <NuxtLink to="/admin/orders/create">
          <Trubutton
            :text="$t('admin.orders.create')"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <form
        @submit.prevent="applyFilters"
        class="flex flex-col lg:flex-row gap-4"
      >
        <div class="flex-1">
          <el-input
            v-model="filters.search"
            placeholder="Cari ID order, nama pembeli, supplier..."
            class="w-full"
            prefix-icon="material-symbols:search"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <el-select
            v-model="filters.status"
            placeholder="Status"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              :label="$t('admin.orders.status.unpaid')"
              value="unpaid"
            />
            <el-option
              :label="$t('admin.orders.status.waiting_po')"
              value="waiting_po"
            />
            <el-option
              :label="$t('admin.orders.status.waiting_invoice')"
              value="waiting_invoice"
            />
            <el-option
              :label="$t('admin.orders.status.process')"
              value="process"
            />
            <el-option
              :label="$t('admin.orders.status.delivery')"
              value="delivery"
            />
            <el-option
              :label="$t('admin.orders.status.completed')"
              value="completed"
            />
            <el-option
              :label="$t('admin.orders.status.cancelled')"
              value="cancelled"
            />
          </el-select>
          <el-select
            v-model="filters.paymentStatus"
            placeholder="Pembayaran"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              :label="$t('admin.orders.payment.pending')"
              value="pending"
            />
            <el-option :label="$t('admin.orders.payment.paid')" value="paid" />
            <el-option
              :label="$t('admin.orders.payment.partial')"
              value="partial"
            />
          </el-select>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            :range-separator="$t('admin.filters.to')"
            :start-placeholder="$t('admin.filters.startDate')"
            :end-placeholder="$t('admin.filters.endDate')"
            class="w-64"
            size="small"
            value-format="YYYY-MM-DD"
          />
        </div>
      </form>
    </div>

    <!-- Orders Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div v-if="loading" class="p-8">
        <div class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="animate-pulse flex items-center gap-4 px-6 py-4 border-b border-gray-100"
          >
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-4 bg-gray-200 rounded w-20" />
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:shopping-cart"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.orders.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.orders.emptyDesc") }}</p>
        <NuxtLink to="/admin/orders/create">
          <Trubutton
            :text="$t('admin.orders.createFirst')"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.orderId") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.buyer") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.supplier") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.items") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.total") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.payment") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.date") }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32"
              >
                {{ $t("admin.table.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <p class="font-mono font-medium text-gray-900">
                  {{ order.id }}
                </p>
                <p class="text-xs text-gray-500">
                  Sourcing: {{ order.sourcingId }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ order.buyer }}</p>
                <p class="text-sm text-gray-500">{{ order.buyerCompany }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ order.supplier }}</p>
                <p class="text-sm text-gray-500">{{ order.supplierCompany }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ order.itemCount }} item{{ order.itemCount > 1 ? "s" : "" }}
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900">
                  {{ formatCurrency(order.total) }}
                </p>
                <p class="text-xs text-gray-500">
                  PPN: {{ formatCurrency(order.ppn) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(order.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getPaymentClass(order.paymentStatus)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getPaymentLabel(order.paymentStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/orders/${order.id}`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Detail"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/orders/${order.id}/edit`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <el-dropdown>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="status in statusOptions"
                          :key="status.value"
                          @click="updateStatus(order, status.value)"
                        >
                          {{ status.label }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          :divided="true"
                          @click="printOrder(order)"
                        >
                          {{ $t("admin.orders.print") }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="sendNotification(order)">
                          {{ $t("admin.orders.notify") }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                    <el-button
                      class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                      title="More"
                    >
                      <Icon name="material-symbols:more-vert" class="h-4 w-4" />
                    </el-button>
                  </el-dropdown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200" v-if="totalPages > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

definePageMeta({ layout: "admin" });

const loading = ref(false);
const orders = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({
  search: "",
  status: "",
  paymentStatus: "",
  dateRange: [] as string[],
});

const statusOptions = [
  { value: "unpaid", label: "Belum Bayar" },
  { value: "waiting_po", label: "Menunggu PO" },
  { value: "waiting_invoice", label: "Menunggu Invoice" },
  { value: "process", label: "Diproses" },
  { value: "delivery", label: "Pengiriman" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const applyFilters = () => {
  currentPage.value = 1;
  fetchOrders();
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    const mockOrders = [
      {
        id: "TRM-2024-001",
        sourcingId: "SRC-2024-001",
        buyer: "PT. Jaya Makmur",
        buyerCompany: "PT. Jaya Makmur",
        supplier: "CV. Sumber Rejeki",
        supplierCompany: "CV. Sumber Rejeki",
        itemCount: 3,
        total: 15000000,
        ppn: 1650000,
        status: "completed",
        paymentStatus: "paid",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "TRM-2024-002",
        sourcingId: "SRC-2024-002",
        buyer: "CV. Sumber Rejeki",
        buyerCompany: "CV. Sumber Rejeki",
        supplier: "PT. Jaya Makmur",
        supplierCompany: "PT. Jaya Makmur",
        itemCount: 5,
        total: 8500000,
        ppn: 935000,
        status: "process",
        paymentStatus: "paid",
        createdAt: new Date("2024-01-20"),
      },
      {
        id: "TRM-2024-003",
        sourcingId: "SRC-2024-003",
        buyer: "UD. Berkah",
        buyerCompany: "UD. Berkah",
        supplier: "PT. Maju Jaya",
        supplierCompany: "PT. Maju Jaya",
        itemCount: 2,
        total: 3200000,
        ppn: 352000,
        status: "delivery",
        paymentStatus: "partial",
        createdAt: new Date("2024-01-25"),
      },
      {
        id: "TRM-2024-004",
        sourcingId: "SRC-2024-004",
        buyer: "PT. Maju Jaya",
        buyerCompany: "PT. Maju Jaya",
        supplier: "CV. Sejahtera",
        supplierCompany: "CV. Sejahtera",
        itemCount: 4,
        total: 25000000,
        ppn: 2750000,
        status: "waiting_invoice",
        paymentStatus: "pending",
        createdAt: new Date("2024-02-01"),
      },
      {
        id: "TRM-2024-005",
        sourcingId: "SRC-2024-005",
        buyer: "CV. Sejahtera",
        buyerCompany: "CV. Sejahtera",
        supplier: "Toko Lina",
        supplierCompany: "Toko Lina",
        itemCount: 1,
        total: 12000000,
        ppn: 1320000,
        status: "unpaid",
        paymentStatus: "pending",
        createdAt: new Date("2024-02-10"),
      },
      {
        id: "TRM-2024-006",
        sourcingId: "SRC-2024-006",
        buyer: "Toko Lina",
        buyerCompany: "Toko Lina",
        supplier: "Startup Tech",
        supplierCompany: "Startup Tech",
        itemCount: 2,
        total: 5500000,
        ppn: 605000,
        status: "completed",
        paymentStatus: "paid",
        createdAt: new Date("2024-02-15"),
      },
      {
        id: "TRM-2024-007",
        sourcingId: "SRC-2024-007",
        buyer: "Startup Tech",
        buyerCompany: "Startup Tech",
        supplier: "PT. Industri Prima",
        supplierCompany: "PT. Industri Prima",
        itemCount: 3,
        total: 18000000,
        ppn: 1980000,
        status: "waiting_po",
        paymentStatus: "pending",
        createdAt: new Date("2024-02-20"),
      },
      {
        id: "TRM-2024-008",
        sourcingId: "SRC-2024-008",
        buyer: "PT. Industri Prima",
        buyerCompany: "PT. Industri Prima",
        supplier: "CV. Sumber Rejeki",
        supplierCompany: "CV. Sumber Rejeki",
        itemCount: 2,
        total: 7200000,
        ppn: 792000,
        status: "cancelled",
        paymentStatus: "pending",
        createdAt: new Date("2024-02-25"),
      },
    ];

    totalItems.value = mockOrders.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    orders.value = mockOrders.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data order");
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    unpaid: "Belum Bayar",
    waiting_po: "Menunggu PO",
    waiting_invoice: "Menunggu Invoice",
    process: "Diproses",
    delivery: "Pengiriman",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    unpaid: "bg-red-100 text-red-800",
    waiting_po: "bg-orange-100 text-orange-800",
    waiting_invoice: "bg-yellow-100 text-yellow-800",
    process: "bg-blue-100 text-blue-800",
    delivery: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getPaymentLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Belum Bayar",
    paid: "Lunas",
    partial: "Sebagian",
  };
  return labels[status] || status;
};

const getPaymentClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const updateStatus = async (order: any, newStatus: string) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    order.status = newStatus;
    ElMessage.success(
      `Status order ${order.id} diubah ke ${getStatusLabel(newStatus)}`
    );
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const printOrder = (order: any) => {
  ElMessage.info("Membuka print...");
  window.open(`/admin/orders/${order.id}/print`, "_blank");
};

const sendNotification = (order: any) => {
  ElMessage.success("Notifikasi dikirim ke pembeli & supplier");
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchOrders();
};

onMounted(() => {
  fetchOrders();
});

watch(
  () => [
    filters.value.search,
    filters.value.status,
    filters.value.paymentStatus,
  ],
  () => {
    currentPage.value = 1;
    fetchOrders();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchOrders();
  }
);
</script>
