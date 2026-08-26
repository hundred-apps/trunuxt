<template>
  <div class="compare-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('compare.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ $t('compare.subtitle') }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="compareProducts.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
        <Icon name="material-symbols:compare" class="text-6xl text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('compare.empty') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('compare.emptyDesc') }}</p>
        <NuxtLink to="/c/all/query">
          <Trubutton
            :text="$t('compare.startComparing')"
            type="primary"
            variant="solid"
            icon="material-symbols:search"
          />
        </NuxtLink>
      </div>

      <!-- Compare Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header Row -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  {{ $t('compare.specifications') }}
                </th>
                <th
                  v-for="product in compareProducts"
                  :key="product.id"
                  class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  <div class="flex items-center justify-center gap-2">
                    <img
                      :src="getProductImage(product.img)"
                      :alt="product.tittle"
                      class="h-12 w-12 object-cover rounded"
                    />
                    <button
                      @click="removeProduct(product.id)"
                      class="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Icon name="material-symbols:close" class="h-4 w-4" />
                    </button>
                  </div>
                  <p class="font-medium text-gray-900 text-sm mt-1 max-w-[150px] truncate mx-auto">
                    {{ product.tittle }}
                  </p>
                  <p class="text-sm text-orange-600 font-semibold">
                    {{ formatPrice(getPrice(product)) }}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="spec in allSpecs" :key="spec.key">
                <td class="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                  {{ spec.label }}
                </td>
                <td
                  v-for="product in compareProducts"
                  :key="product.id"
                  class="px-4 py-3 text-center text-sm text-gray-600"
                >
                  {{ getSpecValue(product, spec.key) || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <Trubutton
            :text="$t('compare.share')"
            type="primary"
            variant="outline"
            icon="material-symbols:share"
            @click="openShareModal"
          />
          <Trubutton
            :text="$t('compare.clearAll')"
            type="danger"
            variant="outline"
            icon="material-symbols:delete-sweep"
            @click="clearAll"
          />
        </div>
      </div>

      <!-- Share Modal -->
      <Teleport to="body">
        <div v-if="shareModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div class="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('compare.shareTitle') }}</h3>
              <button @click="shareModalOpen = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="material-symbols:close" class="h-5 w-5" />
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('compare.recipientEmails') }}</label>
                <el-input
                  v-model="shareForm.emails"
                  type="textarea"
                  :rows="3"
                  placeholder="email1@domain.com, email2@domain.com"
                  class="w-full"
                />
                <p class="text-xs text-gray-500 mt-1">{{ $t('compare.emailsHint') }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('compare.message') }}</label>
                <el-input
                  v-model="shareForm.message"
                  type="textarea"
                  :rows="3"
                  placeholder="Pesan opsional..."
                  class="w-full"
                />
              </div>
              <div class="flex gap-3 justify-end pt-4">
                <Trubutton
                  :text="$t('button.cancel')"
                  variant="outline"
                  @click="shareModalOpen = false"
                />
                <Trubutton
                  :text="$t('compare.send')"
                  variant="solid"
                  @click="sendShare"
                  :loading="sharing"
                />
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue';
import { useI18n } from 'vue-i18n';
import Breadcrumbs from '~/components/Breadcrumbs.vue';

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const compareProducts = ref<any[]>([]);
const shareModalOpen = ref(false);
const sharing = ref(false);

const shareForm = ref({
  emails: '',
  message: '',
});

const breadcrumbs = computed(() => [
  { text: $t('breadcrumb.home'), to: '/' },
  { text: $t('compare.title'), to: '/compare' },
]);

const allSpecs = computed(() => {
  if (compareProducts.value.length === 0) return [];

  const specs = [
    { key: 'brand', label: 'Merek' },
    { key: 'price', label: 'Harga' },
    { key: 'stock', label: 'Stok' },
    { key: 'condition', label: 'Kondisi' },
    { key: 'moq', label: 'MOQ' },
    { key: 'unit', label: 'Unit' },
    { key: 'weight', label: 'Berat' },
    { key: 'warranty', label: 'Garansi' },
  ];

  // Add dynamic specs from product.specs
  compareProducts.value.forEach(p => {
    p.specs?.forEach((s: any) => {
      if (!specs.find(sp => sp.key === s.name)) {
        specs.push({ key: s.name, label: s.name });
      }
    });
  });

  return specs;
});

const getPrice = (product: any) => {
  return Number(product.price_promo) > 0 ? Number(product.price_promo) : Number(product.price);
};

const getSpecValue = (product: any, key: string) => {
  if (key === 'brand') return product.brand;
  if (key === 'price') return formatPrice(getPrice(product));
  if (key === 'stock') return product.stock > 0 ? `${product.stock} ${product.unit}` : 'Habis';
  if (key === 'condition') return product.condition === 'new' ? 'Baru' : 'Bekas';
  if (key === 'moq') return product.moq ? `${product.moq} ${product.unit}` : '-';
  if (key === 'unit') return product.unit;
  if (key === 'weight') return product.weight ? `${product.weight} kg` : '-';
  if (key === 'warranty') return product.warranty || '-';

  const spec = product.specs?.find((s: any) => s.name === key);
  return spec?.value || '-';
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getProductImage = (img: string) => {
  if (img) return `${config.public.baseImageProduct}${img}`;
  return 'https://via.placeholder.com/300x300?text=No+Image';
};

const removeProduct = (id: number) => {
  compareProducts.value = compareProducts.value.filter(p => p.id !== id);
  saveToStorage();
};

const clearAll = () => {
  ElMessageBox.confirm('Hapus semua produk dari perbandingan?', 'Konfirmasi', {
    confirmButtonText: 'Hapus Semua',
    cancelButtonText: 'Batal',
    type: 'warning',
  }).then(() => {
    compareProducts.value = [];
    saveToStorage();
    ElMessage.success('Perbandingan dikosongkan');
  }).catch(() => {});
};

const openShareModal = () => {
  if (compareProducts.value.length === 0) {
    ElMessage.warning('Tidak ada produk untuk dibagikan');
    return;
  }
  shareModalOpen.value = true;
};

const sendShare = async () => {
  if (!shareForm.value.emails.trim()) {
    ElMessage.error('Masukkan minimal satu email');
    return;
  }
  sharing.value = true;
  try {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    ElMessage.success('Perbandingan telah dibagikan');
    shareModalOpen.value = false;
    shareForm.value = { emails: '', message: '' };
  } catch {
    ElMessage.error('Gagal mengirim');
  } finally {
    sharing.value = false;
  }
};

const saveToStorage = () => {
  if (import.meta.client) {
    localStorage.setItem('compare_products', JSON.stringify(compareProducts.value.map(p => p.id)));
  }
};

const loadFromStorage = () => {
  if (import.meta.client) {
    const stored = localStorage.getItem('compare_products');
    if (stored) {
      const ids = JSON.parse(stored);
      // In real app, fetch product details from API
      // For now, use mock data
    }
  }
};

onMounted(() => {
  loadFromStorage();
  // Mock data for demo
  compareProducts.value = [
    { id: 1, tittle: 'GREASE LI CX-2', brand: 'PERTAMINA', price: 19427899, price_promo: 0, stock: 1, moq: 1, unit: 'drum', weight: 180, warranty: '12 bulan', img: 'grease-li-cx2.jpg', specs: [{ name: 'NLGI Grade', value: '2' }, { name: 'Base Oil', value: 'Mineral' }] },
    { id: 2, tittle: 'GREASE EPX-NL 2', brand: 'PERTAMINA', price: 1177600, price_promo: 0, stock: 5, moq: 1, unit: 'kg', weight: 180, warranty: '12 bulan', img: 'grease-epx-nl2.jpg', specs: [{ name: 'NLGI Grade', value: '2' }, { name: 'Base Oil', value: 'Semi-synthetic' }] },
  ];
});

watch(compareProducts, () => {
  saveToStorage();
}, { deep: true });
</script>