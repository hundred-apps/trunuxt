<template>
  <div class="request-form-modal">
    <Teleport to="body">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
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
                  <el-input v-model="form.name" :placeholder="$t('requestForm.phName')" class="w-full" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.email') }} *</label>
                  <el-input v-model="form.email" type="email" :placeholder="$t('requestForm.phEmail')" class="w-full" required />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.phone') }} *</label>
                  <el-input v-model="form.phone" type="tel" :placeholder="$t('requestForm.phPhone')" class="w-full" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.company') }}</label>
                  <el-input v-model="form.company" :placeholder="$t('requestForm.phCompany')" class="w-full" />
                </div>
              </div>

              <div v-if="type === 'product' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.productName') }} *</label>
                <el-input v-model="form.productName" :placeholder="$t('requestForm.phProductName')" class="w-full" :required="type === 'product'" />
              </div>

              <div v-if="type === 'service' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.serviceType') }} *</label>
                <el-select v-model="form.serviceType" :placeholder="$t('requestForm.phServiceType')" class="w-full" :required="type === 'service'">
                  <el-option :label="$t('jasa.categoryMaintenance')" value="maintenance" />
                  <el-option :label="$t('jasa.categoryRepair')" value="repair" />
                  <el-option :label="$t('jasa.categoryInspection')" value="inspection" />
                  <el-option :label="$t('jasa.categoryTesting')" value="testing" />
                  <el-option :label="$t('rental.locationOther')" value="other" />
                </el-select>
              </div>

              <div v-if="type === 'rental' || type === 'all'">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.equipmentType') }} *</label>
                <el-select v-model="form.equipmentType" :placeholder="$t('requestForm.phEquipmentType')" class="w-full" :required="type === 'rental'">
                  <el-option label="Excavator" value="excavator" />
                  <el-option label="Bulldozer" value="bulldozer" />
                  <el-option label="Wheel Loader" value="wheel_loader" />
                  <el-option label="Dump Truck" value="dump_truck" />
                  <el-option label="Crane" value="crane" />
                  <el-option label="Forklift" value="forklift" />
                  <el-option label="Motor Grader" value="grader" />
                  <el-option label="Compactor" value="compactor" />
                  <el-option :label="$t('rental.locationOther')" value="other" />
                </el-select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div v-if="type === 'rental' || type === 'all'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.rentalDuration') }} *</label>
                  <el-select v-model="form.rentalDuration" :placeholder="$t('requestForm.phRentalDuration')" class="w-full" :required="type === 'rental'">
                    <el-option :label="$t('rental.durationDaily')" value="daily" />
                    <el-option :label="$t('rental.durationWeekly')" value="weekly" />
                    <el-option :label="$t('rental.durationMonthly')" value="monthly" />
                    <el-option label="Proyek (custom)" value="project" />
                  </el-select>
                </div>
                <div v-if="type === 'rental' || type === 'all'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.rentalLocation') }} *</label>
                  <el-input v-model="form.rentalLocation" :placeholder="$t('requestForm.phRentalLocation')" class="w-full" :required="type === 'rental'" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('requestForm.description') }} *</label>
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('requestForm.phDescription')"
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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

const titles: Record<string, string> = {
  product: 'requestForm.titleProduct',
  service: 'requestForm.titleService',
  rental: 'requestForm.titleRental',
  all: 'requestForm.titleAll',
};

const descriptions: Record<string, string> = {
  product: 'requestForm.descProduct',
  service: 'requestForm.descService',
  rental: 'requestForm.descRental',
  all: 'requestForm.descAll',
};

const title = computed(() => $t(titles[props.type]));
const description = computed(() => $t(descriptions[props.type]));

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
    ElMessage.error($t('requestForm.errRequired'));
    return;
  }
  if (!form.value.agree) {
    ElMessage.error($t('requestForm.errAgree'));
    return;
  }

  const requiredFields: Record<string, string[]> = {
    product: ['productName'],
    service: ['serviceType'],
    rental: ['equipmentType', 'rentalDuration', 'rentalLocation'],
  };

  if (requiredFields[props.type]?.some(f => !form.value[f])) {
    ElMessage.error($t('requestForm.errTypeRequired'));
    return;
  }

  submitting.value = true;
  try {
    await new Promise(r => setTimeout(r, 1500));
    ElMessage.success($t('requestForm.success'));
    emit('submit', { ...form.value, type: props.type });
    close();
  } catch {
    ElMessage.error($t('requestForm.fail'));
  } finally {
    submitting.value = false;
  }
};
</script>