<template>
  <Teleport to="body">
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="logos:whatsapp-icon" class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ $t('scrap.title') }}</h3>
              <p class="text-sm text-gray-500">{{ $t('scrap.subtitle') }}</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon name="material-symbols:close" class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-600 text-center">
              {{ $t('scrap.description') }}
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label for="scrapName" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.name') }} <span class="text-red-500">*</span>
              </label>
              <el-input
                id="scrapName"
                v-model="form.name"
                placeholder="Masukkan nama lengkap Anda"
                class="w-full"
                required
              />
            </div>

            <div>
              <label for="scrapPhone" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.phone') }} <span class="text-red-500">*</span>
              </label>
              <el-input
                id="scrapPhone"
                v-model="form.phone"
                type="tel"
                placeholder="Contoh: 08123456789"
                class="w-full"
                required
              />
              <p class="text-xs text-gray-500 mt-1">{{ $t('scrap.phoneHint') }}</p>
            </div>

            <div>
              <label for="scrapEmail" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.email') }}
              </label>
              <el-input
                id="scrapEmail"
                v-model="form.email"
                type="email"
                placeholder="contoh@email.com"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">{{ $t('scrap.emailHint') }}</p>
            </div>

            <div>
              <label for="scrapUnitType" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.unitType') }} <span class="text-red-500">*</span>
              </label>
              <el-input
                id="scrapUnitType"
                v-model="form.unitType"
                placeholder="Contoh: Excavator PC 200, Bulldozer D85, Dump Truck"
                class="w-full"
                required
              />
            </div>

            <div>
              <label for="scrapLocation" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.location') }} <span class="text-red-500">*</span>
              </label>
              <el-input
                id="scrapLocation"
                v-model="form.location"
                placeholder="Contoh: Jakarta, Surabaya, Balikpapan"
                class="w-full"
                required
              />
            </div>

            <div>
              <label for="scrapDescription" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.description') }}
              </label>
              <el-input
                id="scrapDescription"
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="Kondisi unit, tahun, jam operasi, kelengkapan dokumen, dll."
                class="w-full"
              />
            </div>

            <div class="flex items-start gap-3">
              <el-checkbox v-model="form.agree" size="small">
                <span class="text-sm text-gray-600">
                  {{ $t('scrap.agreeTerms') }}
                  <NuxtLink to="/page/syarat-ketentuan" class="text-orange-600 hover:underline">{{ $t('scrap.terms') }}</NuxtLink>
                </span>
              </el-checkbox>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200 flex gap-3">
            <Trubutton
              :text="$t('button.cancel')"
              variant="outline"
              class="flex-1"
              @click="closeModal"
            />
            <Trubutton
              :text="$t('scrap.submit')"
              type="success"
              variant="solid"
              icon="logos:whatsapp-icon"
              class="flex-1"
              native-type="submit"
              :loading="submitting"
            />
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

const modalOpen = ref(false);
const submitting = ref(false);

const form = ref({
  name: '',
  phone: '',
  email: '',
  unitType: '',
  location: '',
  description: '',
  agree: false,
});

const openModal = () => {
  modalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modalOpen.value = false;
  document.body.style.overflow = '';
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    unitType: '',
    location: '',
    description: '',
    agree: false,
  };
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.phone || !form.value.unitType || !form.value.location) {
    ElMessage.error('Lengkapi kolom yang wajib diisi');
    return;
  }
  if (!form.value.agree) {
    ElMessage.error('Anda harus menyetujui syarat dan ketentuan');
    return;
  }

  submitting.value = true;
  try {
    const message = encodeURIComponent(
      `Halo Trumecs, saya ingin menjual scrap alat berat:\n\n` +
      `Nama: ${form.value.name}\n` +
      `Telepon: ${form.value.phone}\n` +
      `Email: ${form.value.email || '-'}\n` +
      `Type Unit: ${form.value.unitType}\n` +
      `Lokasi: ${form.value.location}\n` +
      `Deskripsi: ${form.value.description || '-'}\n\n` +
      `Mohon dihubungi untuk penawaran.`
    );
    window.open(`https://wa.me/${config.public.info.phone}?text=${message}`, '_blank');
    ElMessage.success('Membuka WhatsApp...');
    closeModal();
  } catch {
    ElMessage.error('Gagal membuka WhatsApp');
  } finally {
    submitting.value = false;
  }
};

// Expose openModal globally for other components
if (import.meta.client) {
  (window as any).openScrapModal = openModal;
}

defineExpose({ openModal });
</script>