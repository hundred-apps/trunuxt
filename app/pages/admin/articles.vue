<template>
  <div class="admin-articles">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.articles.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.articles.subtitle") }}</p>
      </div>
      <NuxtLink to="/admin/articles/create">
        <Trubutton
          :text="$t('admin.articles.addNew')"
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
            placeholder="Cari judul, penulis, kategori..."
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
            v-model="filters.status"
            placeholder="Status"
            class="w-36"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              :label="$t('admin.articles.status.published')"
              value="published"
            />
            <el-option
              :label="$t('admin.articles.status.draft')"
              value="draft"
            />
            <el-option
              :label="$t('admin.articles.status.archived')"
              value="archived"
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

    <!-- Articles Table -->
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
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:article"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.articles.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.articles.emptyDesc") }}</p>
        <NuxtLink to="/admin/articles/create">
          <Trubutton
            :text="$t('admin.articles.addFirst')"
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
                {{ $t("admin.table.title") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.category") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.author") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.views") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
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
              v-for="article in articles"
              :key="article.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <img
                  :src="getArticleImage(article.image)"
                  :alt="article.title"
                  class="h-12 w-16 object-cover rounded"
                />
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900 line-clamp-1 max-w-xs">
                  {{ article.title }}
                </p>
                <p class="text-xs text-gray-500">Slug: {{ article.slug }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ article.category }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ article.author }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ article.views.toLocaleString() }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(article.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(article.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(article.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/articles/${article.id}`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Detail"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/articles/${article.id}/edit`"
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
                          @click="updateStatus(article, status.value)"
                        >
                          {{ status.label }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          :divided="true"
                          @click="duplicateArticle(article)"
                          >{{
                            $t("admin.articles.duplicate")
                          }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          class="text-red-600"
                          @click="deleteArticle(article)"
                          >{{ $t("admin.articles.delete") }}</el-dropdown-item
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
const articles = ref<any[]>([]);
const categories = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({
  search: "",
  category: "",
  status: "",
  dateRange: [] as string[],
});

const statusOptions = [
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Diarsipkan" },
];

const applyFilters = () => {
  currentPage.value = 1;
  fetchArticles();
};

const fetchArticles = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));

    categories.value = [
      { id: 1, name: "Tips Perawatan" },
      { id: 2, name: "Panduan Sparepart" },
      { id: 3, name: "Berita Industri" },
      { id: 4, name: "Teknologi" },
      { id: 5, name: "Studi Kasus" },
    ];

    const mockArticles = [
      {
        id: 1,
        title: "Cara Merawat Engine Excavator Agar Awet",
        slug: "cara-merawat-engine-excavator",
        category: "Tips Perawatan",
        author: "Tim Teknis Trumecs",
        views: 15420,
        status: "published",
        createdAt: new Date("2024-01-15"),
        image: "article-engine-care.jpg",
      },
      {
        id: 2,
        title: "Panduan Memilih Ban Truck Yang Tepat",
        slug: "panduan-memilih-ban-truck",
        category: "Panduan Sparepart",
        author: "Ahmad Wijaya",
        views: 8930,
        status: "published",
        createdAt: new Date("2024-01-20"),
        image: "article-ban-truck.jpg",
      },
      {
        id: 3,
        title: "Tren Teknologi Elektrik di Alat Berat 2024",
        slug: "tren-teknologi-elektrik-alat-berat",
        category: "Berita Industri",
        author: "Siti Rahayu",
        views: 12100,
        status: "published",
        createdAt: new Date("2024-02-01"),
        image: "article-electric-trend.jpg",
      },
      {
        id: 4,
        title: "Studi Kasus: Efisiensi Bahan Bakar dengan Oli Sintetis",
        slug: "studi-kasus-efisiensi-bahan-bakar",
        category: "Studi Kasus",
        author: "Budi Santoso",
        views: 6540,
        status: "draft",
        createdAt: new Date("2024-02-10"),
        image: "article-case-study.jpg",
      },
      {
        id: 5,
        title: "Tips Memilih Filter Oli Berkualitas",
        slug: "tips-memilih-filter-oli",
        category: "Panduan Sparepart",
        author: "Dewi Lestari",
        views: 4320,
        status: "published",
        createdAt: new Date("2024-02-20"),
        image: "article-filter-oli.jpg",
      },
      {
        id: 6,
        title: "Inovasi Teknologi Hydraulic System Modern",
        slug: "inovasi-hydraulic-system",
        category: "Teknologi",
        author: "Rudi Hartono",
        views: 3890,
        status: "draft",
        createdAt: new Date("2024-03-01"),
        image: "article-hydraulic.jpg",
      },
    ];

    totalItems.value = mockArticles.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);

    const start = (currentPage.value - 1) * pageSize.value;
    articles.value = mockArticles.slice(start, start + pageSize.value);
  } catch (e: any) {
    ElMessage.error("Gagal memuat data artikel");
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    published: "Dipublikasikan",
    draft: "Draft",
    archived: "Diarsipkan",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    archived: "bg-blue-100 text-blue-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getArticleImage = (img: string) => {
  if (img) return `https://www.trumecs.com/public/image/artikel/${img}`;
  return "https://via.placeholder.com/64x48?text=No+Image";
};

const updateStatus = async (article: any, newStatus: string) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    article.status = newStatus;
    ElMessage.success(`Status artikel diubah ke ${getStatusLabel(newStatus)}`);
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const duplicateArticle = async (article: any) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Artikel diduplikasi");
  } catch {
    ElMessage.error("Gagal menduplikasi");
  }
};

const deleteArticle = async (article: any) => {
  try {
    await confirmDelete(article.title, "Konfirmasi");
    await new Promise((r) => setTimeout(r, 500));
    ElMessage.success("Artikel dihapus");
  } catch {}
};

onMounted(() => {
  fetchArticles();
});

watch(
  () => [filters.value.search, filters.value.category, filters.value.status],
  () => {
    currentPage.value = 1;
    fetchArticles();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchArticles();
  }
);
</script>
