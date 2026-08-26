<template>
  <div class="admin-products">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.products.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.products.subtitle") }}</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/products/import">
          <Trubutton
            :text="$t('admin.products.import')"
            type="primary"
            variant="outline"
            icon="material-symbols:upload"
          />
        </NuxtLink>
        <NuxtLink to="/admin/products/export">
          <Trubutton
            :text="$t('admin.products.export')"
            type="primary"
            variant="outline"
            icon="material-symbols:download"
          />
        </NuxtLink>
        <NuxtLink to="/admin/products/create">
          <Trubutton
            :text="$t('admin.products.addNew')"
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
            placeholder="Cari nama, SKU, part number..."
            class="w-full"
            prefix-icon="material-symbols:search"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <el-select
            v-model="filters.category"
            placeholder="Kategori"
            class="w-48"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
          <el-select
            v-model="filters.brand"
            placeholder="Merek"
            class="w-48"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="brand in brands"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>
          <el-select
            v-model="filters.status"
            placeholder="Status"
            class="w-36"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option :label="$t('admin.filters.show')" value="show" />
            <el-option :label="$t('admin.filters.draft')" value="draft" />
          </el-select>
          <el-select
            v-model="filters.stock"
            placeholder="Stok"
            class="w-36"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option :label="$t('admin.filters.lowStock')" value="low" />
            <el-option :label="$t('admin.filters.outOfStock')" value="zero" />
          </el-select>
        </div>
      </form>
    </div>

    <!-- Products Table -->
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
            <div class="h-10 w-10 rounded bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-4 bg-gray-200 rounded w-20" />
            <div class="h-6 w-20 bg-gray-200 rounded" />
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:inventory-2"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.products.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.products.emptyDesc") }}</p>
        <NuxtLink to="/admin/products/create">
          <Trubutton
            :text="$t('admin.products.addFirst')"
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
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
              >
                {{ $t("admin.table.image") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.product") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.category") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.brand") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.price") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.stock") }}
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
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <img
                  :src="getProductImage(product.img)"
                  :alt="product.name"
                  class="h-12 w-12 object-cover rounded"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900 truncate max-w-xs">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-500">SKU: {{ product.sku }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ product.category }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ product.brand }}
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">
                  {{ formatCurrency(product.price) }}
                </p>
                <p
                  v-if="product.promoPrice"
                  class="text-sm text-orange-600 line-through"
                >
                  {{ formatCurrency(product.originalPrice) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStockClass(product.stock)"
                  class="px-2 py-1 text-sm font-medium rounded-full"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(product.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(product.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/products/${product.id}`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Detail"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/products/${product.id}/edit`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <el-dropdown>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          :divided="true"
                          @click="toggleStatus(product)"
                        >
                          {{
                            product.status === "show"
                              ? $t("admin.products.setDraft")
                              : $t("admin.products.setShow")
                          }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="duplicateProduct(product)">{{
                          $t("admin.products.duplicate")
                        }}</el-dropdown-item>
                        <el-dropdown-item
                          class="text-red-600"
                          @click="deleteProduct(product)"
                          >{{ $t("admin.products.delete") }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                    <button
                      class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                      title="More"
                    >
                      <Icon name="material-symbols:more-vert" class="h-4 w-4" />
                    </button>
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
          @update:current-page="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useConfirm } from "~/composables/useConfirm";

const { confirmDelete } = useConfirm();

const loading = ref(false);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const brands = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({
  search: "",
  category: "",
  brand: "",
  status: "",
  stock: "",
});

const applyFilters = () => {
  currentPage.value = 1;
  fetchProducts();
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    // Mock categories and brands
    categories.value = [
      { id: 1, name: "Pelumas" },
      { id: 2, name: "Ban" },
      { id: 3, name: "Power & Battery" },
      { id: 4, name: "Sparepart" },
      { id: 5, name: "Unit" },
      { id: 6, name: "Tools" },
    ];

    brands.value = [
      { id: 1, name: "PERTAMINA" },
      { id: 2, name: "SHELL" },
      { id: 3, name: "MOBIL" },
      { id: 4, name: "CASTROL" },
      { id: 5, name: "KOMATSU" },
      { id: 6, name: "CATERPILLAR" },
    ];

    // Mock products
    const mockProducts = [
      {
        id: 1,
        name: "GREASE LI CX-2",
        sku: "GLCX2-200L",
        category: "Pelumas",
        brand: "PERTAMINA",
        price: 19427899,
        promoPrice: 0,
        stock: 5,
        status: "show",
        img: "grease-li-cx2.jpg",
      },
      {
        id: 2,
        name: "Ban Hixih GD08 825R16",
        sku: "HIX-GD08-825R16",
        category: "Ban",
        brand: "HIXIH",
        price: 2518500,
        promoPrice: 2300000,
        stock: 10,
        status: "show",
        img: "ban-hixih.jpg",
      },
      {
        id: 4,
        name: "Engine Oil 15W40",
        sku: "EO-15W40-200L",
        category: "Pelumas",
        brand: "SHELL",
        price: 8500000,
        promoPrice: 0,
        stock: 3,
        status: "show",
        img: "engine-oil.jpg",
      },
      {
        id: 5,
        name: 'Hydraulic Hose 1/2"',
        sku: "HH-012-50M",
        category: "Sparepart",
        brand: "PARKER",
        price: 1250000,
        promoPrice: 0,
        stock: 2,
        status: "show",
        img: "hydraulic-hose.jpg",
      },
      {
        id: 6,
        name: "Air Filter Komatsu",
        sku: "AF-KOM-PC200",
        category: "Sparepart",
        brand: "KOMATSU",
        price: 450000,
        promoPrice: 0,
        stock: 1,
        status: "show",
        img: "air-filter.jpg",
      },
      {
        id: 7,
        name: "Excavator Komatsu PC200",
        sku: "EXC-KOM-PC200",
        category: "Unit",
        brand: "KOMATSU",
        price: 1250000000,
        promoPrice: 0,
        stock: 1,
        status: "show",
        img: "excavator.jpg",
      },
      {
        id: 8,
        name: "Wheel Loader Komatsu WA320",
        sku: "WL-KOM-WA320",
        category: "Unit",
        brand: "KOMATSU",
        price: 850000000,
        promoPrice: 0,
        stock: 0,
        status: "draft",
        img: "wheel-loader.jpg",
      },
      {
        id: 9,
        name: "Forklift Toyota 3 Ton",
        sku: "FL-TOY-3T",
        category: "Unit",
        brand: "TOYOTA",
        price: 450000000,
        promoPrice: 0,
        stock: 2,
        status: "show",
        img: "forklift.jpg",
      },
      {
        id: 10,
        name: "Grease EPX-NL 2",
        sku: "GRE-EPXNL2-180KG",
        category: "Pelumas",
        brand: "PERTAMINA",
        price: 1177600,
        promoPrice: 0,
        stock: 15,
        status: "show",
        img: "grease-epx.jpg",
      },
    ];

    totalItems.value = mockProducts.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    products.value = mockProducts.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data produk");
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  // Mock - replace with API call
  categories.value = [
    { id: 1, name: "Pelumas" },
    { id: 2, name: "Ban" },
    { id: 3, name: "Power & Battery" },
    { id: 4, name: "Sparepart" },
    { id: 5, name: "Unit" },
    { id: 6, name: "Tools" },
  ];
};

const fetchBrands = async () => {
  // Mock - replace with API call
  brands.value = [
    { id: 1, name: "PERTAMINA" },
    { id: 2, name: "SHELL" },
    { id: 3, name: "MOBIL" },
    { id: 4, name: "CASTROL" },
    { id: 5, name: "KOMATSU" },
    { id: 6, name: "CATERPILLAR" },
  ];
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    show: "Tampil",
    draft: "Draft",
    hidden: "Tersembunyi",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    show: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    hidden: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStockClass = (stock: number) => {
  if (stock === 0) return "bg-red-100 text-red-800";
  if (stock <= 5) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getProductImage = (img: string) => {
  if (img) return `https://www.trumecs.com/public/image/product/${img}`;
  return "https://via.placeholder.com/48x48?text=No+Image";
};

const toggleStatus = async (product: any) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    product.status = product.status === "show" ? "draft" : "show";
    ElMessage.success(
      `Produk ${product.status === "show" ? "ditampilkan" : "draft"}`
    );
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const duplicateProduct = async (product: any) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Produk diduplikasi");
    // Refresh or add to list
  } catch {
    ElMessage.error("Gagal menduplikasi");
  }
};

const deleteProduct = async (product: any) => {
  try {
    await confirmDelete(product.name, "Konfirmasi");
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Produk dihapus");
    // Remove from list
  } catch {}
};

onMounted(async () => {
  await fetchCategories();
  await fetchBrands();
  await fetchProducts();
});

watch(
  () => currentPage.value,
  () => {
    fetchProducts();
  }
);
</script>
