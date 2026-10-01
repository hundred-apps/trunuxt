<template>
  <Teleport to="body">
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl sm:rounded-t-2xl z-20">
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
                :placeholder="$t('scrap.phName')"
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
                :placeholder="$t('scrap.phPhone')"
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
                :placeholder="$t('scrap.phEmail')"
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
                :placeholder="$t('scrap.phUnit')"
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
                :placeholder="$t('scrap.phLocation')"
                class="w-full"
                required
              />
            </div>

            <div>
              <label for="scrapDescription" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('scrap.condition') }}
              </label>
              <el-input
                id="scrapDescription"
                v-model="form.description"
                type="textarea"
                :rows="4"
                :placeholder="$t('scrap.phDescription')"
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
import { useI18n } from 'vue-i18n';

const config = useRuntimeConfig();
const { t: $t } = useI18n();

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
    ElMessage.error($t('scrap.errRequired'));
    return;
  }
  if (!form.value.agree) {
    ElMessage.error($t('scrap.errAgree'));
    return;
  }

  submitting.value = true;
  try {
    const message = encodeURIComponent(
      $t('scrap.waIntro') + `\n\n` +
      $t('scrap.name') + `: ${form.value.name}\n` +
      $t('scrap.phone') + `: ${form.value.phone}\n` +
      $t('scrap.email') + `: ${form.value.email || '-'}\n` +
      $t('scrap.unitType') + `: ${form.value.unitType}\n` +
      $t('scrap.location') + `: ${form.value.location}\n` +
      $t('scrap.condition') + `: ${form.value.description || '-'}\n\n` +
      $t('scrap.waClosing')
    );
    window.open(`https://wa.me/${config.public.info.phone}?text=${message}`, '_blank');
    ElMessage.success($t('scrap.waOpening'));
    closeModal();
  } catch {
    ElMessage.error($t('scrap.waFail'));
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