<template>
  <div class="admin-members">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.members.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.members.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/members/create">
        <Trubutton
          :text="$t('admin.members.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:person-add"
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
            placeholder="Cari nama, email, perusahaan..."
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
            <el-option :label="$t('admin.filters.active')" value="active" />
            <el-option :label="$t('admin.filters.inactive')" value="inactive" />
          </el-select>
          <el-select
            v-model="filters.level"
            placeholder="Level"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option label="Silver" value="silver" />
            <el-option label="Gold" value="gold" />
            <el-option label="Platinum" value="platinum" />
          </el-select>
          <el-select
            v-model="filters.sort"
            placeholder="Urutkan"
            class="w-40"
            size="small"
          >
            <el-option :label="$t('admin.filters.newest')" value="newest" />
            <el-option :label="$t('admin.filters.oldest')" value="oldest" />
            <el-option :label="$t('admin.filters.nameAsc')" value="name_asc" />
            <el-option
              :label="$t('admin.filters.nameDesc')"
              value="name_desc"
            />
          </el-select>
        </div>
      </form>
    </div>

    <!-- Members Table -->
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
              <div class="h-4 bg-gray-200 rounded w-1/4" />
              <div class="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="members.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:people"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.members.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.members.emptyDesc") }}</p>
        <NuxtLink to="/admin/members/create">
          <Trubutton
            :text="$t('admin.members.addFirst')"
            type="primary"
            variant="solid"
            icon="material-symbols:person-add"
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
                {{ $t("admin.table.member") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.email") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.phone") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.company") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.level") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.joined") }}
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
              v-for="member in members"
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium"
                  >
                    {{ member.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ member.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ member.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ member.phone }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ member.company || "-" }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getLevelClass(member.level)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ member.level }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="
                    member.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{
                    member.active ? $t("admin.active") : $t("admin.inactive")
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(member.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/members/${member.id}`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Detail"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/members/${member.id}/edit`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="toggleStatus(member)"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="member.active ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <Icon
                      :name="
                        member.active
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const loading = ref(false);
const members = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({
  search: "",
  status: "",
  level: "",
  sort: "newest",
});

const applyFilters = () => {
  currentPage.value = 1;
  fetchMembers();
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    // Mock data - replace with actual API call
    await new Promise((r) => setTimeout(r, 500));

    const mockMembers = [
      {
        id: 1,
        name: "Budi Santoso",
        email: "budi@email.com",
        phone: "081234567890",
        company: "PT. Jaya Makmur",
        level: "gold",
        active: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        name: "Siti Rahayu",
        email: "siti@company.com",
        phone: "081345678901",
        company: "CV. Sumber Rejeki",
        level: "silver",
        active: true,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: 3,
        name: "Ahmad Wijaya",
        email: "ahmad@store.com",
        phone: "081456789012",
        company: "UD. Berkah",
        level: "platinum",
        active: false,
        createdAt: new Date("2024-03-10"),
      },
      {
        id: 4,
        name: "Dewi Lestari",
        email: "dewi@shop.com",
        phone: "081567890123",
        company: "PT. Maju Jaya",
        level: "gold",
        active: true,
        createdAt: new Date("2024-04-05"),
      },
      {
        id: 5,
        name: "Rudi Hartono",
        email: "rudi@market.com",
        phone: "081678901234",
        company: "CV. Sejahtera",
        level: "silver",
        active: true,
        createdAt: new Date("2024-05-12"),
      },
      {
        id: 6,
        name: "Lina Kusuma",
        email: "lina@retail.com",
        phone: "081789012345",
        company: "Toko Lina",
        level: "silver",
        active: true,
        createdAt: new Date("2024-06-18"),
      },
      {
        id: 7,
        name: "Agus Prasetyo",
        email: "agus@industri.com",
        phone: "081890123456",
        company: "PT. Industri Prima",
        level: "platinum",
        active: true,
        createdAt: new Date("2024-07-22"),
      },
      {
        id: 8,
        name: "Maya Sari",
        email: "maya@tech.com",
        phone: "081901234567",
        company: "Startup Tech",
        level: "gold",
        active: false,
        createdAt: new Date("2024-08-30"),
      },
    ];

    // Apply filters
    let filtered = [...mockMembers];

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search) ||
          m.company.toLowerCase().includes(search)
      );
    }

    if (filters.value.status) {
      filtered = filtered.filter(
        (m) => m.active === (filters.value.status === "active")
      );
    }

    if (filters.value.level) {
      filtered = filtered.filter((m) => m.level === filters.value.level);
    }

    // Apply sorting
    switch (filters.value.sort) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // newest
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    totalItems.value = filtered.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    members.value = filtered.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data member");
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (member: any) => {
  try {
    // Mock API call
    await new Promise((r) => setTimeout(r, 500));
    member.active = !member.active;
    ElMessage.success(
      `Member ${member.active ? "diaktifkan" : "dinonaktifkan"}`
    );
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    silver: "bg-gray-100 text-gray-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  };
  return classes[level] || "bg-gray-100 text-gray-800";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  fetchMembers();
});

watch(
  () => [
    filters.value.search,
    filters.value.status,
    filters.value.level,
    filters.value.sort,
  ],
  () => {
    currentPage.value = 1;
    fetchMembers();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchMembers();
  }
);
</script>
