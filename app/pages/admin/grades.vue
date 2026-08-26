<template>
  <div class="admin-grades">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.grades.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ $t('admin.grades.subtitle') }}</p>
      </div>
      <NuxtLink to="/admin/grades/create">
        <Trubutton
          :text="$t('admin.grades.addNew')"
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
        placeholder="Cari nama grade..."
        class="w-full max-w-md"
        prefix-icon="material-symbols:search"
        @keyup.enter="fetchGrades"
      />
    </div>

    <!-- Grades Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-4 px-6 py-4 border-b border-gray-100">
            <div class="h-4 bg-gray-200 rounded w-48" />
            <div class="h-4 bg-gray-200 rounded w-32" />
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="grades.length === 0" class="text-center py-16">
        <Icon name="material-symbols:grade" class="text-4xl text-gray-300 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ $t('admin.grades.empty') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('admin.grades.emptyDesc') }}</p>
        <NuxtLink to="/admin/grades/create">
          <Trubutton
            :text="$t('admin.grades.addFirst')"
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
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('admin.table.name') }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('admin.table.type') }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('admin.table.parent') }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('admin.table.products') }}</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">{{ $t('admin.table.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="grade in grades" :key="grade.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ grade.name }}</p>
                <p class="text-xs text-gray-500">Slug: {{ grade.slug }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="grade.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ grade.type === 'product' ? 'Produk' : 'Jasa' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ grade.parent || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ grade.productCount }}</td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/grades/${grade.id}/edit`"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </NuxtLink>
                  <button
                    @click="deleteGrade(grade)"
                    class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Hapus"
                  >
                    <Icon name="material-symbols:delete" class="h-4 w-4" />
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

<script setup lang="ts>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useConfirm } from '~/composables/useConfirm';

const { confirmDelete } = useConfirm();

const loading = ref(false);
const grades = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

const filters = ref({ search: '' });

const fetchGrades = async () => {
  loading.value = true;
  try {
    await new Promise(r => setTimeout(r, 500));
    
    grades.value = [
      { id: 1, name: 'Asli', slug: 'asli', type: 'product', parent: null, productCount: 4520 },
      { id: 2, name: 'Bekas', slug: 'bekas', type: 'product', parent: null, productCount: 1240 },
      { id: 3, name: 'Tiruan', slug: 'tiruan', type: 'product', parent: null, productCount: 180 },
      { id: 4, name: 'Grade A', slug: 'grade-a', type: 'service', parent: null, productCount: 0 },
      { id: 5, name: 'Grade B', slug: 'grade-b', type: 'service', parent: 'Grade A', productCount: 0 },
      { id: 6, name: 'Premium', slug: 'premium', type: 'product', parent: 'Asli', productCount: 320 },
      { id: 7, name: 'Standard', slug: 'standard', type: 'product', parent: 'Asli', productCount: 1500 },
      { id: 7, name: 'Economy', slug: 'economy', type: 'product', parent: 'Bekas', productCount: 800 },
    ];

    totalItems.value = grades.value.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    
    const start = (currentPage.value - 1) * pageSize.value;
    grades.value = grades.value.slice(start, start + pageSize.value);
    
  } catch (e: any) {
    ElMessage.error('Gagal memuat data grade');
  } finally {
    loading.value = false;
  }
};

const deleteGrade = async (grade: any) => {
  try {
    await confirmDelete(grade.name, 'Konfirmasi');
    await new Promise(r => setTimeout(r, 500));
    ElMessage.success('Grade dihapus');
  } catch {}
};

const pageSize = ref(20);
const currentPage = ref(1);

onMounted(() => {
  fetchGrades();
});

watch(() => filters.value.search, () => {
  currentPage.value = 1;
  fetchGrades();
}, { deep: true });

watch(() => currentPage.value, () => {
  fetchGrades();
});
</script>