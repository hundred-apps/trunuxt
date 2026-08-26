<template>
  <div class="admin-principals">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.principals.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.principals.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/principals/create">
        <Trubutton
          :text="$t('admin.principals.addNew')"
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
        placeholder="Cari nama principal, perusahaan..."
        class="w-full max-w-md"
        prefix-icon="material-symbols:search"
        @keyup.enter="fetchPrincipals"
      />
    </div>

    <!-- Principals Table -->
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
            <div class="h-10 w-10 rounded-full bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-28" />
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="principals.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:business"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.principals.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.principals.emptyDesc") }}</p>
        <NuxtLink to="/admin/principals/create">
          <Trubutton
            :text="$t('admin.principals.addFirst')"
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
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"
              >
                {{ $t("admin.table.logo") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.name") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.company") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.contact") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.products") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
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
              v-for="principal in principals"
              :key="principal.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <img
                  v-if="principal.logo"
                  :src="getLogo(principal.logo)"
                  :alt="principal.name"
                  class="h-10 w-10 object-contain rounded"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:business"
                    class="h-5 w-5 text-orange-600"
                  />
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ principal.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ principal.id }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ principal.company }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <p>{{ principal.contactPerson }}</p>
                <p>{{ principal.email }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ principal.productCount }} produk
              </td>
              <td class="px-6 py-4">
                <span
                  :class="
                    principal.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{
                    principal.active ? $t("admin.active") : $t("admin.inactive")
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/principals/${principal.id}`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Detail"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/principals/${principal.id}/edit`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="toggleStatus(principal)"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="principal.active ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <Icon
                      :name="
                        principal.active
                          ? 'material-symbols:block'
                          : 'material-symbols:check-circle'
                      "
                      class="h-4 w-4"
                    />
                  </button>
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

const { confirmDelete } = useConfirm();

const loading = ref(false);
const principals = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({ search: "" });

const fetchPrincipals = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    principals.value = [
      {
        id: 1,
        name: "Komatsu",
        company: "PT. Komatsu Indonesia",
        contactPerson: "Budi Santoso",
        email: "budi@komatsu.co.id",
        productCount: 1250,
        active: true,
        logo: "komatsu.png",
      },
      {
        id: 2,
        name: "Caterpillar",
        company: "PT. Caterpillar Indonesia",
        contactPerson: "Siti Rahayu",
        email: "siti@cat.com",
        productCount: 980,
        active: true,
        logo: "caterpillar.png",
      },
      {
        id: 3,
        name: "Shell",
        company: "PT. Shell Indonesia",
        contactPerson: "Ahmad Wijaya",
        email: "ahmad@shell.com",
        productCount: 420,
        active: true,
        logo: "shell.png",
      },
      {
        id: 4,
        name: "Pertamina",
        company: "PT. Pertamina Lubricants",
        contactPerson: "Dewi Lestari",
        email: "dewi@pertamina.com",
        productCount: 380,
        active: true,
        logo: "pertamina.png",
      },
      {
        id: 5,
        name: "Mobil",
        company: "PT. ExxonMobil Indonesia",
        contactPerson: "Rudi Hartono",
        email: "rudi@mobil.com",
        productCount: 310,
        active: true,
        logo: "mobil.png",
      },
      {
        id: 6,
        name: "Castrol",
        company: "PT. Castrol Indonesia",
        contactPerson: "Lina Kusuma",
        email: "lina@castrol.com",
        productCount: 290,
        active: false,
        logo: "castrol.png",
      },
      {
        id: 7,
        name: "Hixih",
        company: "PT. Hixih Tire Indonesia",
        contactPerson: "Agus Prasetyo",
        email: "agus@hixih.com",
        productCount: 240,
        active: true,
        logo: "hixih.png",
      },
      {
        id: 8,
        name: "STRUMAN",
        company: "PT. Struman Power Solutions",
        contactPerson: "Maya Sari",
        email: "maya@struman.com",
        productCount: 15,
        active: true,
        logo: "struman.png",
      },
    ];

    totalItems.value = principals.value.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    principals.value = principals.value.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data principal");
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (principal: any) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    principal.active = !principal.active;
    ElMessage.success(
      `Principal ${principal.active ? "diaktifkan" : "dinonaktifkan"}`
    );
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const getLogo = (logo: string) => {
  if (logo) return `https://www.trumecs.com/public/upload/categori/${logo}`;
  return "";
};

onMounted(() => {
  fetchPrincipals();
});

watch(
  () => filters.value.search,
  () => {
    currentPage.value = 1;
    fetchPrincipals();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchPrincipals();
  }
);
</script>
