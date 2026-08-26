<template>
  <div class="request-form-modal">
    <Teleport to="body">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="close" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Icon name="material-symbols:close" class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 text-center">
                {{ description }}
              </p>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.name') }} *</label>
                  <el-input v-model="form.name" placeholder="Nama lengkap" class="w-full" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.email') }} *</label>
                  <el-input v-model="form.email" type="email" placeholder="Email" class="w-full" required />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.phone') }} *</label>
                  <el-input v-model="form.phone" type="tel" placeholder="Nomor telepon/WhatsApp" class="w-full" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.company') }}</label>
                  <el-input v-model="form.company" placeholder="Nama perusahaan" class="w-full" />
                </div>
              </div>

              <div v-if="type === 'product' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.productName') }} *</label>
                <el-input v-model="form.productName" placeholder="Nama produk yang dicari" class="w-full" :required="type === 'product'" />
              </div>

              <div v-if="type === 'service' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.serviceType') }} *</label>
                <el-select v-model="form.serviceType" placeholder="Pilih jenis jasa" class="w-full" :required="type === 'service'">
                  <el-option label="Perawatan Alat Berat" value="maintenance" />
                  <el-option label="Perbaikan/Reparasi" value="repair" />
                  <el-option label="Inspeksi & Audit" value="inspection" />
                  <el-option label:="Pengujian/Testing" value="testing" />
                  <el-option label="Lainnya" value="other" />
                </el-select>
              </div>

              <div v-if="type === 'rental' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.equipmentType') }} *</label>
                <el-select v-model="form.equipmentType" placeholder="Pilih tipe alat" class="w-full" :required="type === 'rental'">
                  <el-option label="Excavator" value="excavator" />
                  <el-option label="Bulldozer" value="bulldozer" />
                  <el-option label="Wheel Loader" value="wheel_loader" />
                  <el-option label="Dump Truck" value="dump_truck" />
                  <el-option label="Crane" value="crane" />
                  <el-option label="Forklift" value="forklift" />
                  <el-option label="Motor Grader" value="grader" />
                  <el-option label="Compactor" value="compactor" />
                  <el-option label="Lainnya" value="other" />
                </el-select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div v-if="type === 'rental' || type === 'all'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.rentalDuration') }} *</label>
                  <el-select v-model="form.rentalDuration" placeholder="Durasi sewa" class="w-full" :required="type === 'rental'">
                    <el-option label="Harian" value="daily" />
                    <el-option label="Mingguan" value="weekly" />
                    <el-option label="Bulanan" value="monthly" />
                    <el-option label="Proyek (custom)" value="project" />
                  </el-select>
                </div>
                <div v-if="type === 'rental' || type === 'all'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.rentalLocation') }} *</label>
                  <el-input v-model="form.rentalLocation" placeholder="Lokasi proyek/sewa" class="w-full" :required="type === 'rental'" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.description') }} *</label>
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="4"
                  placeholder="Jelaskan kebutuhan Anda secara detail (spesifikasi, jumlah, kondisi, timeline, dll.)"
                  class="w-full"
                  required
                />
              </div>

              <div class="flex items-start gap-3">
                <el-checkbox v-model="form.agree" size="small">
                  <span class="text-sm text-gray-600">
                    {{ $t('requestForm.agree') }}
                    <NuxtLink to="/page/syarat-ketentuan" class="text-orange-600 hover:underline">{{ $t('requestForm.terms') }}</NuxtLink>
                  </span>
                </el-checkbox>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 flex gap-3 justify-end">
              <Trubutton :text="$t('button.cancel')" variant="outline" @click="close" />
              <Trubutton
                :text="$t('button.submit')"
                type="primary"
                variant="solid"
                native-type="submit"
                :loading="submitting"
              />
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

interface Props {
  type: 'product' | 'service' | 'rental' | 'all';
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();

const submitting = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  productName: '',
  serviceType: '',
  equipmentType: '',
  rentalDuration: '',
  rentalLocation: '',
  description: '',
  agree: false,
});

const typeLabels: Record<string, string> = {
  product: 'Produk',
  service: 'Jasa',
  rental: 'Rental',
  all: 'Permintaan',
};

const titles: Record<string, string> = {
  product: 'Permintaan Produk',
  service: 'Permintaan Jasa',
  rental: 'Permintaan Rental',
  all: 'Kirim Permintaan',
};

const descriptions: Record<string, string> = {
  product: 'Butuh produk yang tidak tersedia di katalog? Kirim permintaan dan tim kami akan mencarikannya untuk Anda.',
  service: 'Butuh jasa perawatan, perbaikan, atau inspeksi alat berat? Kami menghubungkan Anda dengan bengkel terpercaya.',
  rental: 'Butuh alat berat untuk proyek? Kami menyediakan rental alat berat dengan operator berpengalaman.',
  all: 'Kirimkan kebutuhan Anda, tim kami akan menghubungi Anda segera.',
};

const title = computed(() => titles[props.type]);
const description = computed(() => descriptions[props.type]);

const close = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    company: '',
    productName: '',
    serviceType: '',
    equipmentType: '',
    rentalDuration: '',
    rentalLocation: '',
    description: '',
    agree: false,
  };
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email || !form.value.phone || !form.value.description) {
    ElMessage.error('Lengkapi kolom yang wajib diisi');
    return;
  }
  if (!form.value.agree) {
    ElMessage.error('Anda harus menyetujui syarat dan ketentuan');
    return;
  }

  const requiredFields: Record<string, string[]> = {
    product: ['productName'],
    service: ['serviceType'],
    rental: ['equipmentType', 'rentalDuration', 'rentalLocation'],
  };

  if (requiredFields[props.type]?.some(f => !form.value[f])) {
    ElMessage.error('Lengkapi kolom yang wajib diisi untuk tipe ini');
    return;
  }

  submitting.value = true;
  try {
    await new Promise(r => setTimeout(r, 1500));
    ElMessage.success('Permintaan berhasil dikirim! Tim kami akan menghubungi Anda segera.');
    emit('submit', { ...form.value, type: props.type });
    close();
  } catch {
    ElMessage.error('Gagal mengirim permintaan');
  } finally {
    submitting.value = false;
  }
};
</script>