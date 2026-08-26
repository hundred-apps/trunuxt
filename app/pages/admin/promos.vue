<template>
  <div class="admin-promos">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ t("admin.promos.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ t("admin.promos.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/promos/create">
        <Trubutton
          :text="t('admin.promos.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
        />
      </NuxtLink>
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
            :placeholder="
              t('admin.promos.searchPlaceholder') || 'Cari nama promo...'
            "
            class="w-full"
            prefix-icon="material-symbols:search"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <el-select
            v-model="filters.type"
            :placeholder="t('admin.filters.type') || 'Tipe'"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="t('admin.filters.all') || 'Semua'" value="" />
            <el-option
              :label="t('admin.promos.type.promo') || 'Promo'"
              value="promo"
            />
            <el-option
              :label="t('admin.promos.type.bundle') || 'Bundle'"
              value="bundle"
            />
          </el-select>
          <el-select
            v-model="filters.status"
            :placeholder="t('admin.filters.status') || 'Status'"
            class="w-36"
            size="small"
            clearable
          >
            <el-option :label="t('admin.filters.all') || 'Semua'" value="" />
            <el-option
              :label="t('admin.promos.status.active') || 'Aktif'"
              value="active"
            />
            <el-option
              :label="t('admin.promos.status.ended') || 'Berakhir'"
              value="ended"
            />
            <el-option
              :label="t('admin.promos.status.upcoming') || 'Akan Datang'"
              value="upcoming"
            />
          </el-select>
        </div>
      </form>
    </div>

    <!-- Promos Grid -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="aspect-video bg-gray-200 rounded mb-3" />
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="promos.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:local-offer"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ t("admin.promos.empty") || "Belum ada promo" }}
        </h3>
        <p class="text-gray-500 mb-4">
          {{ t("admin.promos.emptyDesc") || "Tambahkan promo pertama Anda" }}
        </p>
        <NuxtLink to="/admin/promos/create">
          <Trubutton
            :text="t('admin.promos.addFirst') || 'Tambah Promo'"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <!-- Promos Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
      >
        <div
          v-for="promo in promos"
          :key="promo.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div class="relative h-40 mb-3">
            <img
              :src="getPromoImage(promo.img)"
              :alt="promo.name"
              class="w-full h-full object-cover rounded"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 flex gap-1">
              <span
                :class="promo.type === 'bundle' ? 'bg-blue-500' : 'bg-red-500'"
                class="px-2 py-1 text-xs font-bold text-white rounded"
              >
                {{ promo.type }}
              </span>
              <span
                v-if="isEnded(promo.endDate)"
                class="bg-gray-800 text-white px-2 py-1 text-xs font-bold rounded"
              >
                {{ t("admin.promos.ended") || "Berakhir" }}
              </span>
            </div>
          </div>
          <h3 class="font-bold text-gray-800 line-clamp-1 mb-1">
            {{ promo.name }}
          </h3>
          <p class="text-sm text-gray-500 line-clamp-2 mb-3">
            {{ promo.description }}
          </p>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-gray-400">
              {{ t("admin.promos.activeUntil") || "Berlaku hingga" }}
              {{ formatDate(promo.endDate) }}
            </span>
            <span
              v-if="promo.type === 'bundle'"
              class="text-xs text-orange-500 font-medium"
            >
              {{ promo.itemCount }} {{ t("admin.promos.items") || "item" }}
            </span>
          </div>
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/promos/${promo.id}`"
              class="flex-1 p-2 text-center text-sm text-orange-600 hover:bg-orange-50 rounded-lg"
            >
              {{ t("admin.table.view") || "Lihat" }}
            </NuxtLink>
            <NuxtLink
              :to="`/admin/promos/${promo.id}/edit`"
              class="flex-1 p-2 text-center text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {{ t("admin.table.edit") || "Edit" }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center p-4 border-t border-gray-200"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @update:current-page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

// ============ I18N ============
const { t } = useI18n();

// ============ TYPES ============
interface Promo {
  id: number;
  name: string;
  type: string;
  img: string;
  description: string;
  endDate: string;
  itemCount: number;
  status: string;
}

interface Filters {
  search: string;
  type: string;
  status: string;
}

// ============ STATE ============
const loading = ref(false);
const promos = ref<Promo[]>([]);
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref<Filters>({
  search: "",
  type: "",
  status: "",
});

// ============ METHODS ============
const applyFilters = () => {
  currentPage.value = 1;
  fetchPromos();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchPromos();
};

const fetchPromos = async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));

    const mockPromos: Promo[] = [
      {
        id: 1,
        name: "Promo Merdeka Excavator Komatsu",
        type: "bundle",
        img: "promo-merdeka-excavator.jpg",
        description:
          "Paket lengkap sparepart excavator Komatsu PC200-8 dengan harga spesial",
        endDate: "2024-08-31",
        itemCount: 4,
        status: "active",
      },
      {
        id: 2,
        name: "Promo Oli Mesin Shell 15W40",
        type: "promo",
        img: "promo-shell-15w40.jpg",
        description: "Oli mesin Shell Helix Ultra 15W40 drum 200L harga promo",
        endDate: "2024-09-15",
        itemCount: 1,
        status: "active",
      },
      {
        id: 3,
        name: "Bundle Ban Truck & Bus",
        type: "bundle",
        img: "promo-ban-truck.jpg",
        description:
          "Paket 4 ban radial truck & bus Hixih GD08 dengan gratis pemasangan",
        endDate: "2024-08-20",
        itemCount: 4,
        status: "active",
      },
      {
        id: 4,
        name: "Promo Hydraulic Oil Pertamina",
        type: "promo",
        img: "promo-hydraulic-pertamina.jpg",
        description: "Oli hidrolik Pertamina Turalik HE 46 drum 200L",
        endDate: "2024-07-31",
        itemCount: 1,
        status: "ended",
      },
      {
        id: 5,
        name: "Bundle Sparepart Excavator",
        type: "bundle",
        img: "promo-sparepart-excavator.jpg",
        description:
          "Paket filter oli, filter bahan bakar, dan filter udara untuk excavator",
        endDate: "2024-10-31",
        itemCount: 3,
        status: "upcoming",
      },
      {
        id: 6,
        name: "Promo Grease Pertamina LI CX-2",
        type: "promo",
        img: "promo-grease-pertamina.jpg",
        description: "Grease Pertamina LI CX-2 drum 180kg harga spesial",
        endDate: "2024-12-31",
        itemCount: 1,
        status: "active",
      },
    ];

    // Apply filters
    let filtered = mockPromos;
    if (filters.value.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.value.search.toLowerCase())
      );
    }
    if (filters.value.type) {
      filtered = filtered.filter((p) => p.type === filters.value.type);
    }
    if (filters.value.status) {
      filtered = filtered.filter((p) => p.status === filters.value.status);
    }

    totalItems.value = filtered.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    promos.value = filtered.slice(start, start + pageSize.value);
  } catch (error) {
    console.error("Error fetching promos:", error);
    ElMessage.error(t("admin.promos.loadError") || "Gagal memuat data promo");
  } finally {
    loading.value = false;
  }
};

const isEnded = (endDate: string) => {
  return new Date(endDate) < new Date();
};

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

const getPromoImage = (img: string) => {
  if (img) return `https://www.trumecs.com/public/image/promo/${img}`;
  return "https://via.placeholder.com/400x250?text=No+Image";
};

// ============ WATCH ============
watch(
  [
    () => filters.value.search,
    () => filters.value.type,
    () => filters.value.status,
  ],
  () => {
    currentPage.value = 1;
    fetchPromos();
  },
  { deep: true }
);

// ============ LIFECYCLE ============
onMounted(() => {
  fetchPromos();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.el-input__wrapper) {
  border-radius: 8px !important;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px !important;
}
</style>
