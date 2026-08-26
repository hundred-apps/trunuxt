<template>
  <div class="admin-categories">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.categories.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.categories.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/categories/create">
        <Trubutton
          :text="$t('admin.categories.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
        />
      </NuxtLink>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <el-input
        v-model="filters.search"
        placeholder="Cari nama kategori..."
        class="w-full max-w-md"
        prefix-icon="material-symbols:search"
        @keyup.enter="fetchCategories"
      />
    </div>

    <!-- Category Tree -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div v-if="loading" class="p-8 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto"
        />
        <p class="mt-4 text-gray-500">{{ $t("admin.loading") }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <CategoryTree
          :categories="categories"
          @edit="editCategory"
          @delete="deleteCategory"
          @add-child="addChildCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CategoryTree from "~/components/admin/CategoryTree.vue";

const loading = ref(false);
const categories = ref<any[]>([]);
const filters = ref({ search: "" });

const fetchCategories = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    // Mock hierarchical categories
    categories.value = [
      {
        id: 1,
        name: "Pelumas",
        slug: "pelumas",
        parent_id: null,
        is_brand: false,
        children: [
          {
            id: 11,
            name: "GREASE",
            slug: "grease",
            parent_id: 1,
            is_brand: false,
            children: [],
          },
          {
            id: 12,
            name: "HYDRAULIC OILS",
            slug: "hydraulic-oils",
            parent_id: 1,
            is_brand: false,
            children: [],
          },
          {
            id: 13,
            name: "ENGINE OIL",
            slug: "engine-oil",
            parent_id: 1,
            is_brand: false,
            children: [],
          },
          {
            id: 14,
            name: "GEAR OIL",
            slug: "gear-oil",
            parent_id: 1,
            is_brand: false,
            children: [],
          },
        ],
      },
      {
        id: 2,
        name: "Ban",
        slug: "ban",
        parent_id: null,
        is_brand: false,
        children: [
          {
            id: 21,
            name: "Off The Road",
            slug: "off-the-road",
            parent_id: 2,
            is_brand: false,
            children: [],
          },
          {
            id: 22,
            name: "Truck & Bus Radial",
            slug: "truck-bus-radial",
            parent_id: 2,
            is_brand: false,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "Power & Battery",
        slug: "power-battery",
        parent_id: null,
        is_brand: false,
        children: [
          {
            id: 31,
            name: "Heavy Duty / Industry",
            slug: "heavy-duty",
            parent_id: 3,
            is_brand: false,
            children: [],
          },
          {
            id: 32,
            name: "Automotif",
            slug: "automotif",
            parent_id: 3,
            is_brand: false,
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: "Sparepart",
        slug: "sparepart",
        parent_id: null,
        is_brand: false,
        children: [
          {
            id: 41,
            name: "Engine",
            slug: "engine",
            parent_id: 4,
            is_brand: false,
            children: [],
          },
          {
            id: 42,
            name: "Filter",
            slug: "filter",
            parent_id: 4,
            is_brand: false,
            children: [],
          },
          {
            id: 43,
            name: "Brake",
            slug: "brake",
            parent_id: 4,
            is_brand: false,
            children: [],
          },
        ],
      },
      {
        id: 5,
        name: "Unit",
        slug: "unit",
        parent_id: null,
        is_brand: false,
        children: [],
      },
      {
        id: 6,
        name: "Tools",
        slug: "tools",
        parent_id: null,
        is_brand: false,
        children: [],
      },
    ];
  } catch (e: any) {
    ElMessage.error("Gagal memuat data kategori");
  } finally {
    loading.value = false;
  }
};

const editCategory = (category: any) => {
  navigateTo(`/admin/categories/${category.id}/edit`);
};

const addChildCategory = (parentId: number) => {
  navigateTo(`/admin/categories/create?parent=${parentId}`);
};

const deleteCategory = async (category: any) => {
  try {
    await ElMessageBox.confirm(
      `Hapus kategori "${category.name}"?`,
      "Konfirmasi",
      {
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        type: "warning",
      }
    );
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Kategori dihapus");
  } catch {}
};

onMounted(() => {
  fetchCategories();
});
</script>
