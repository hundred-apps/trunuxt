<template>
  <div class="admin-brands">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.brands.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.brands.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/brands/create">
        <Trubutton
          :text="$t('admin.brands.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
        />
      </NuxtLink>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <el-input
        v-model="filters.search"
        placeholder="Cari nama merek..."
        class="w-full max-w-md"
        prefix-icon="material-symbols:search"
        @keyup.enter="fetchBrands"
      />
    </div>

    <!-- Brands Grid -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse bg-gray-50 rounded-lg p-4 border border-gray-200 text-center"
        >
          <div
            class="aspect-square bg-gray-200 rounded mx-auto mb-3 max-w-xs"
          />
          <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        </div>
      </div>

      <div v-else-if="brands.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:label"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.brands.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.brands.emptyDesc") }}</p>
        <NuxtLink to="/admin/brands/create">
          <Trubutton
            :text="$t('admin.brands.addFirst')"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6"
      >
        <div
          v-for="brand in brands"
          :key="brand.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
        >
          <div class="aspect-square mb-3 overflow-hidden rounded">
            <img
              v-if="brand.logo"
              :src="getBrandLogo(brand.logo)"
              :alt="brand.name"
              class="w-full h-full object-contain p-2"
            />
            <div
              v-else
              class="aspect-square bg-gray-200 rounded flex items-center justify-center"
            >
              <Icon
                name="material-symbols:label"
                class="h-12 w-12 text-gray-400"
              />
            </div>
          </div>
          <h3 class="font-bold text-gray-800 line-clamp-1 mb-1">
            {{ brand.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-3">
            {{ brand.categoryCount }} kategori
          </p>
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/brands/${brand.id}/edit`"
              class="flex-1 p-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg"
            >
              {{ $t("admin.table.edit") }}
            </NuxtLink>
            <button
              @click="deleteBrand(brand)"
              class="flex-1 p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              {{ $t("admin.table.delete") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200" v-if="totalPages > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({ layout: "admin" });

const { confirmDelete } = useConfirm();

const loading = ref(false);
const brands = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({ search: "" });

const fetchBrands = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    brands.value = [
      { id: 1, name: "PERTAMINA", logo: "pertamina.png", categoryCount: 12 },
      { id: 2, name: "SHELL", logo: "shell.png", categoryCount: 8 },
      { id: 3, name: "MOBIL", logo: "mobil.png", categoryCount: 10 },
      { id: 4, name: "CASTROL", logo: "castrol.png", categoryCount: 8 },
      { id: 5, name: "KOMATSU", logo: "komatsu.png", categoryCount: 15 },
      {
        id: 6,
        name: "CATERPILLAR",
        logo: "caterpillar.png",
        categoryCount: 12,
      },
      { id: 7, name: "MOBIL 1", logo: "mobil1.png", categoryCount: 6 },
      { id: 8, name: "MOTUL", logo: "motul.png", categoryCount: 5 },
      { id: 9, name: "REPSOL", logo: "repsol.png", categoryCount: 4 },
      { id: 10, name: "TOTAL", logo: "total.png", categoryCount: 7 },
      { id: 11, name: "VALVOLINE", logo: "valvoline.png", categoryCount: 4 },
      { id: 12, name: "WIN", logo: "win.png", categoryCount: 3 },
      { id: 13, name: "ENEOS", logo: "eneos.png", categoryCount: 5 },
      { id: 14, name: "IDEMITSU", logo: "idemitsu.png", categoryCount: 3 },
      { id: 15, name: "FUCHS", logo: "fuchs.png", categoryCount: 4 },
      { id: 16, name: "GULF", logo: "gulf.png", categoryCount: 2 },
    ];

    totalItems.value = brands.value.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    brands.value = brands.value.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data merek");
  } finally {
    loading.value = false;
  }
};

const deleteBrand = async (brand: any) => {
  try {
    await confirmDelete(brand.name, "Konfirmasi");
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Merek dihapus");
  } catch {}
};

const getBrandLogo = (logo: string) => {
  if (logo) return `https://www.trumecs.com/public/upload/categori/${logo}`;
  return "";
};

onMounted(() => {
  fetchBrands();
});

watch(
  () => filters.value.search,
  () => {
    currentPage.value = 1;
    fetchBrands();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchBrands();
  }
);
</script>
