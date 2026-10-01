<template>
  <div class="member-rfq-create">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('member.rfq.createTitle') }}</h1>
      <p class="mt-1 text-gray-600">{{ $t('member.rfq.createSubtitle') }}</p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
        >
          <div
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
              currentStep >= index
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            ]"
          >
            <span v-if="currentStep > index" class="material-symbols-outlined text-sm">check</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'flex-1 h-1 mx-2 transition-all',
              currentStep > index ? 'bg-orange-500' : 'bg-gray-200'
            ]"
          />
        </div>
      </div>
      <div class="flex mt-4">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          :class="[
            'flex-1 text-center text-sm font-medium transition-colors',
            currentStep >= index ? 'text-orange-600' : 'text-gray-400'
          ]"
        >
          {{ step.label }}
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step 1: Category & Product -->
      <div v-if="currentStep === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('member.rfq.step1.title') }}</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.category') }}</label>
            <el-select
              v-model="form.categoryId"
              :placeholder="$t('member.rfq.phCategory')"
              class="w-full"
              @change="handleCategoryChange"
            >
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </div>

          <div v-if="subcategories.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.subcategory') }}</label>
            <el-select
              v-model="form.subcategoryId"
              :placeholder="$t('member.rfq.phSubcategory')"
              class="w-full"
              @change="handleSubcategoryChange"
            >
              <el-option
                v-for="sub in subcategories"
                :key="sub.id"
                :label="sub.name"
                :value="sub.id"
              />
            </el-select>
          </div>

          <div v-if="brands.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.brand') }}</label>
            <el-select
              v-model="form.brandId"
              :placeholder="$t('member.rfq.phBrand')"
              class="w-full"
            >
              <el-option
                v-for="brand in brands"
                :key="brand.id"
                :label="brand.name"
                :value="brand.id"
              />
            </el-select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.productName') }}</label>
            <el-input
              v-model="form.productName"
              :placeholder="$t('member.rfq.phProductName')"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.partNumber') }}</label>
            <el-input
              v-model="form.partNumber"
              :placeholder="$t('member.rfq.phPartNumber')"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step1.quantity') }}</label>
            <el-input-number
              v-model="form.quantity"
              :min="1"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Specifications -->
      <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('member.rfq.step2.title') }}</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.description') }}</label>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              :placeholder="$t('member.rfq.phDescription')"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.condition') }}</label>
            <el-select
              v-model="form.condition"
              :placeholder="$t('member.rfq.phCondition')"
              class="w-full"
            >
              <el-option :label="$t('member.rfq.conditionNew')" value="new" />
              <el-option :label="$t('member.rfq.conditionUsed')" value="used" />
              <el-option :label="$t('member.rfq.conditionRefurbished')" value="refurbished" />
            </el-select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.budgetMin') }}</label>
              <el-input-number
                v-model="form.budgetMin"
                :min="0"
                :precision="0"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.budgetMax') }}</label>
              <el-input-number
                v-model="form.budgetMax"
                :min="0"
                :precision="0"
                class="w-full"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.requiredBy') }}</label>
            <el-date-picker
              v-model="form.requiredBy"
              type="date"
              :placeholder="$t('member.rfq.phRequiredBy')"
              class="w-full"
              value-format="YYYY-MM-DD"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step2.attachments') }}</label>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
              <Icon name="material-symbols:cloud-upload" class="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-600 mb-2">{{ $t('member.rfq.step2.uploadFiles') }}</p>
              <el-button size="small" type="primary" @click="fileInput.click()">
                {{ $t('member.rfq.step2.chooseFiles') }}
              </el-button>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="hidden"
                @change="handleFiles"
              />
              <p class="text-xs text-gray-500 mt-2">{{ $t('member.rfq.step2.fileTypes') }}</p>
            </div>
            <div v-if="files.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(file, index) in files"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button type="button" @click="files.splice(index, 1)" class="text-red-500 hover:underline text-sm">
                  {{ $t('member.rfq.remove') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Delivery & Contact -->
      <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('member.rfq.step3.title') }}</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step3.deliveryAddress') }}</label>
            <el-input
              v-model="form.deliveryAddress"
              type="textarea"
              :rows="3"
              :placeholder="$t('member.rfq.phDeliveryAddress')"
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step3.contactPerson') }}</label>
              <el-input
                v-model="form.contactPerson"
                :placeholder="$t('member.rfq.phContactPerson')"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step3.contactPhone') }}</label>
              <el-input
                v-model="form.contactPhone"
                type="tel"
                :placeholder="$t('member.rfq.phContactPhone')"
                class="w-full"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('member.rfq.step3.notes') }}</label>
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              :placeholder="$t('member.rfq.phNotes')"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <Trubutton
          v-if="currentStep > 0"
          :text="$t('button.back')"
          type="primary"
          variant="outline"
          @click="prevStep"
        />
        <div class="flex gap-3">
          <Trubutton
            v-if="currentStep < steps.length - 1"
            :text="$t('button.next')"
            type="primary"
            variant="solid"
            icon="material-symbols:arrow-forward"
            icon-position="right"
            @click="nextStep"
          />
          <Trubutton
            v-else
            :text="$t('member.rfq.submit')"
            type="primary"
            variant="solid"
            icon="material-symbols:send"
            icon-position="right"
            native-type="submit"
            :loading="submitting"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const authStore = useAuthStore();
const { t: $t } = useI18n();

const currentStep = ref(0);
const submitting = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

const steps = computed(() => [
  { id: 1, label: $t('member.rfq.step1.title') },
  { id: 2, label: $t('member.rfq.step2.title') },
  { id: 3, label: $t('member.rfq.step3.title') },
]);

const categories = ref([
  { id: 1, name: 'Pelumas' },
  { id: 2, name: 'Ban' },
  { id: 3, name: 'Power & Battery' },
  { id: 4, name: 'Sparepart' },
  { id: 5, name: 'Unit' },
  { id: 6, name: 'Tools' },
]);

const subcategories = ref<{id: number, name: string, parentId: number}[]>([]);
const brands = ref<{id: number, name: string}[]>([]);

const form = ref({
  categoryId: null as number | null,
  subcategoryId: null as number | null,
  brandId: null as number | null,
  productName: '',
  partNumber: '',
  quantity: 1,
  description: '',
  condition: 'new',
  budgetMin: 0,
  budgetMax: 0,
  requiredBy: '',
  deliveryAddress: '',
  contactPerson: '',
  contactPhone: '',
  notes: '',
});

const handleCategoryChange = async () => {
  form.value.subcategoryId = null;
  form.value.brandId = null;
  subcategories.value = [];
  brands.value = [];

  if (!form.value.categoryId) return;

  // Mock subcategories based on category
  const subcatMap: Record<number, {id: number, name: string}[]> = {
    1: [{ id: 11, name: 'GREASE' }, { id: 12, name: 'HYDRAULIC OILS' }, { id: 13, name: 'ENGINE OIL' }],
    2: [{ id: 21, name: 'Off The Road' }, { id: 22, name: 'Truck & Bus Radial' }],
    4: [{ id: 41, name: 'Engine' }, { id: 42, name: 'Filter' }, { id: 43, name: 'Brake' }],
  };
  subcategories.value = subcatMap[form.value.categoryId] || [];
};

const handleSubcategoryChange = async () => {
  form.value.brandId = null;
  brands.value = [];

  if (!form.value.subcategoryId) return;

  // Mock brands
  brands.value = [
    { id: 1, name: 'PERTAMINA' },
    { id: 2, name: 'SHELL' },
    { id: 3, name: 'MOBIL' },
    { id: 4, name: 'CASTROL' },
    { id: 5, name: 'KOMATSU' },
    { id: 6, name: 'CATERPILLAR' },
  ];
};

const handleFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    Array.from(input.files).forEach(f => {
      if (f.size <= 10 * 1024 * 1024) {
        files.value.push(f);
      } else {
        ElMessage.error($t('member.rfq.step2.fileTooLarge', { name: f.name }));
      }
    });
  }
  if (fileInput.value) fileInput.value.value = '';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const nextStep = () => {
  if (currentStep.value === 0 && !form.value.categoryId) {
    ElMessage.error($t('member.rfq.errCategory'));
    return;
  }
  if (currentStep.value === 0 && !form.value.productName) {
    ElMessage.error($t('member.rfq.errProductName'));
    return;
  }
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!form.value.deliveryAddress || !form.value.contactPerson || !form.value.contactPhone) {
    ElMessage.error($t('member.rfq.errDelivery'));
    return;
  }

  submitting.value = true;
  try {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    ElMessage.success($t('member.rfq.success'));
    await router.push('/member/rfq');
  } catch (e: any) {
    ElMessage.error(e.message || $t('member.rfq.fail'));
  } finally {
    submitting.value = false;
  }
};
</script>