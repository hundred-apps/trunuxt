<template>
  <div class="admin-roles">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.roles.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.roles.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/roles/create">
        <Trubutton
          :text="$t('admin.roles.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
        />
      </NuxtLink>
    </div>

    <!-- Roles Grid -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>

      <div v-else-if="roles.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:admin-panel-settings"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.roles.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.roles.emptyDesc") }}</p>
        <NuxtLink to="/admin/roles/create">
          <Trubutton
            :text="$t('admin.roles.addFirst')"
            type="primary"
            variant="solid"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="role in roles"
          :key="role.id"
          class="p-6 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ role.name }}
              </h3>
              <span
                class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full"
                >{{ role.menuCount }} menu</span
              >
            </div>
            <p class="text-sm text-gray-500">{{ role.description }}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="menu in role.menus"
                :key="menu"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >{{ menu }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2 sm:ml-4">
            <NuxtLink
              :to="`/admin/roles/${role.id}/edit`"
              class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
              title="Edit"
            >
              <Icon name="material-symbols:edit" class="h-4 w-4" />
            </NuxtLink>
            <button
              @click="deleteRole(role)"
              class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="Hapus"
            >
              <Icon name="material-symbols:delete" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menus Section -->
    <div class="mt-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">
          {{ $t("admin.roles.menus") }}
        </h2>
        <NuxtLink to="/admin/roles/menus/create">
          <Trubutton
            :text="$t('admin.roles.addMenu')"
            type="primary"
            variant="outline"
            icon="material-symbols:add"
          />
        </NuxtLink>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <MenuTree
          :menus="menus"
          @edit="editMenu"
          @delete="deleteMenu"
          @add-child="addChildMenu"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MenuTree from "~/components/admin/MenuTree.vue";

const loading = ref(false);
const roles = ref<any[]>([]);
const menus = ref<any[]>([]);

const fetchRoles = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    roles.value = [
      {
        id: 1,
        name: "Super Admin",
        description: "Akses penuh ke semua fitur admin",
        menuCount: 25,
        menus: [
          "Dashboard",
          "Members",
          "Products",
          "Orders",
          "Promos",
          "Articles",
          "Categories",
          "Brands",
          "Grades",
          "Principals",
          "Roles",
          "Settings",
          "Reports",
          "Users",
          "Logs",
        ],
      },
      {
        id: 2,
        name: "Admin Produk",
        description: "Mengelola produk, kategori, merek, grade",
        menuCount: 6,
        menus: [
          "Products",
          "Categories",
          "Brands",
          "Grades",
          "Promos",
          "Reports",
        ],
      },
      {
        id: 3,
        name: "Admin Order",
        description: "Mengelola order, pengiriman, pembayaran",
        menuCount: 3,
        menus: ["Orders", "Shipping", "Reports"],
      },
      {
        id: 4,
        name: "Admin Member",
        description: "Mengelola member, principal, role",
        menuCount: 4,
        menus: ["Members", "Principals", "Roles", "Reports"],
      },
      {
        id: 5,
        name: "Admin Konten",
        description: "Mengelola artikel, promo, halaman",
        menuCount: 3,
        menus: ["Articles", "Promos", "Pages"],
      },
      {
        id: 6,
        name: "Viewer",
        description: "Hanya melihat laporan dan dashboard",
        menuCount: 1,
        menus: ["Dashboard", "Reports"],
      },
    ];
  } catch (e: any) {
    ElMessage.error("Gagal memuat data role");
  } finally {
    loading.value = false;
  }
};

const fetchMenus = async () => {
  try {
    await new Promise((r) => setTimeout(r, 500));

    menus.value = [
      {
        id: 1,
        name: "Dashboard",
        icon: "material-symbols:dashboard",
        url: "/admin",
        parent_id: null,
        children: [],
      },
      {
        id: 2,
        name: "Manajemen",
        icon: "material-symbols:people",
        url: "#",
        parent_id: null,
        children: [
          {
            id: 3,
            name: "Member",
            icon: "material-symbols:person",
            url: "/admin/members",
            parent_id: 2,
            children: [],
          },
          {
            id: 4,
            name: "Principal",
            icon: "material-symbols:business",
            url: "/admin/principals",
            parent_id: 2,
            children: [],
          },
        ],
      },
      {
        id: 5,
        name: "Katalog",
        icon: "material-symbols:inventory-2",
        url: "#",
        parent_id: null,
        children: [
          {
            id: 6,
            name: "Produk",
            icon: "material-symbols:inventory-2",
            url: "/admin/products",
            parent_id: 5,
            children: [],
          },
          {
            id: 7,
            name: "Kategori",
            icon: "material-symbols:category",
            url: "/admin/categories",
            parent_id: 5,
            children: [],
          },
          {
            id: 8,
            name: "Merek",
            icon: "material-symbols:label",
            url: "/admin/brands",
            parent_id: 5,
            children: [],
          },
          {
            id: 9,
            name: "Grade",
            icon: "material-symbols:grade",
            url: "/admin/grades",
            parent_id: 5,
            children: [],
          },
        ],
      },
      {
        id: 10,
        name: "Transaksi",
        icon: "material-symbols:shopping-cart",
        url: "#",
        parent_id: null,
        children: [
          {
            id: 11,
            name: "Order",
            icon: "material-symbols:receipt",
            url: "/admin/orders",
            parent_id: 10,
            children: [],
          },
          {
            id: 12,
            name: "Pengiriman",
            icon: "material-symbols:local-shipping",
            url: "/admin/shipping",
            parent_id: 10,
            children: [],
          },
        ],
      },
      {
        id: 13,
        name: "Pemasaran",
        icon: "material-symbols:campaign",
        url: "#",
        parent_id: null,
        children: [
          {
            id: 14,
            name: "Promo",
            icon: "material-symbols:local-offer",
            url: "/admin/promos",
            parent_id: 13,
            children: [],
          },
          {
            id: 15,
            name: "Artikel",
            icon: "material-symbols:article",
            url: "/admin/articles",
            parent_id: 13,
            children: [],
          },
        ],
      },
      {
        id: 16,
        name: "Sistem",
        icon: "material-symbols:settings",
        url: "#",
        parent_id: null,
        children: [
          {
            id: 17,
            name: "Role & Hak Akses",
            icon: "material-symbols:admin-panel-settings",
            url: "/admin/roles",
            parent_id: 16,
            children: [],
          },
          {
            id: 18,
            name: "Pengaturan",
            icon: "material-symbols:settings",
            url: "/admin/settings",
            parent_id: 16,
            children: [],
          },
          {
            id: 19,
            name: "Log Aktivitas",
            icon: "material-symbols:history",
            url: "/admin/logs",
            parent_id: 16,
            children: [],
          },
        ],
      },
    ];
  } catch (e: any) {
    ElMessage.error("Gagal memuat data menu");
  }
};

const editMenu = (menu: any) => {
  navigateTo(`/admin/roles/menus/${menu.id}/edit`);
};

const addChildMenu = (parentId: number) => {
  navigateTo(`/admin/roles/menus/create?parent=${parentId}`);
};

const deleteMenu = async (menu: any) => {
  try {
    await ElMessageBox.confirm(`Hapus menu "${menu.name}"?`, "Konfirmasi", {
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      type: "warning",
    });
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Menu dihapus");
  } catch {}
};

const deleteRole = async (role: any) => {
  try {
    await ElMessageBox.confirm(`Hapus role "${role.name}"?`, "Konfirmasi", {
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      type: "warning",
    });
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Role dihapus");
  } catch {}
};

onMounted(() => {
  fetchRoles();
  fetchMenus();
});
</script>
