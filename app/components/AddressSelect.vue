<template>
  <div class="address-select space-y-4">
    <!-- Provinsi -->
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ $t("address.province") }}
        </label>
        <el-select
          v-model="model.province_id"
          :placeholder="$t('address.selectProvince')"
          :loading="loadingProvinces"
          filterable
          clearable
          class="w-full"
          @change="onProvinceChange"
        >
          <el-option
            v-for="p in provinces"
            :key="String(p.id)"
            :label="p.name"
            :value="String(p.id)"
          />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ $t("address.city") }}
        </label>
        <el-select
          v-model="model.regency_id"
          :placeholder="$t('address.selectRegency')"
          :disabled="!model.province_id || loadingRegencies"
          :loading="loadingRegencies"
          filterable
          clearable
          class="w-full"
          @change="onRegencyChange"
        >
          <el-option
            v-for="r in regencies"
            :key="String(r.id)"
            :label="r.name"
            :value="String(r.id)"
          />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ $t("address.district") }}
        </label>
        <el-select
          v-model="model.district_id"
          :placeholder="$t('address.selectDistrict')"
          :disabled="!model.regency_id || loadingDistricts"
          :loading="loadingDistricts"
          filterable
          clearable
          class="w-full"
          @change="onDistrictChange"
        >
          <el-option
            v-for="d in districts"
            :key="String(d.id)"
            :label="d.name"
            :value="String(d.id)"
          />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ $t("address.village") }}
        </label>
        <el-select
          v-model="model.village_id"
          :placeholder="$t('address.selectVillage')"
          :disabled="!model.district_id || loadingVillages"
          :loading="loadingVillages"
          filterable
          clearable
          class="w-full"
          @change="onVillageChange"
        >
          <el-option
            v-for="v in villages"
            :key="String(v.id)"
            :label="v.name"
            :value="String(v.id)"
          />
        </el-select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ $t("address.zipcode") }}
        </label>
        <el-input
          v-model="model.zipcode"
          :placeholder="$t('address.zipcodePlaceholder')"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useAddress } from '~/composables/useAddress';

const props = withDefaults(
  defineProps<{
    modelValue?: Record<string, any>;
    defaultProvinceId?: string | number;
  }>(),
  {
    modelValue: undefined,
    defaultProvinceId: undefined,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'change', value: Record<string, any>): void;
  (e: 'statusChange', value: boolean): void;
}>();

const { getProvinces, getRegencies, getDistricts, getVillages, getAddressByVillage } = useAddress();

const model = reactive<Record<string, any>>({
  province_id: '',
  regency_id: '',
  district_id: '',
  village_id: '',
  zipcode: '',
  province: '',
  regency: '',
  district: '',
  village: '',
});

const provinces = ref<any[]>([]);
const regencies = ref<any[]>([]);
const districts = ref<any[]>([]);
const villages = ref<any[]>([]);

const loadingProvinces = ref(false);
const loadingRegencies = ref(false);
const loadingDistricts = ref(false);
const loadingVillages = ref(false);

const ready = computed(() => !!model.village_id);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      Object.keys(model).forEach((k) => {
        if (k in val) model[k as keyof typeof model] = val[k];
      });
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => model.village_id,
  (id) => {
    if (id) populateNameFields();
    emitChange();
  }
);

function emitChange() {
  emit('update:modelValue', { ...model });
  emit('change', { ...model });
  emit('statusChange', ready.value);
}

async function loadProvinces() {
  loadingProvinces.value = true;
  provinces.value = await getProvinces();
  loadingProvinces.value = false;
}

async function onProvinceChange(id: string) {
  model.regency_id = '';
  model.district_id = '';
  model.village_id = '';
  model.zipcode = '';
  regencies.value = [];
  districts.value = [];
  villages.value = [];
  const p = provinces.value.find((x) => String(x.id) === String(id));
  if (p) {
    model.province = p.name;
  } else {
    model.province = '';
  }
  if (!id) return;
  loadingRegencies.value = true;
  regencies.value = await getRegencies(id);
  loadingRegencies.value = false;
  emitChange();
}

async function onRegencyChange(id: string) {
  model.district_id = '';
  model.village_id = '';
  model.zipcode = '';
  districts.value = [];
  villages.value = [];
  const r = regencies.value.find((x) => String(x.id) === String(id));
  if (r) {
    model.regency = r.name;
  } else {
    model.regency = '';
  }
  if (!id) return;
  loadingDistricts.value = true;
  districts.value = await getDistricts(id);
  loadingDistricts.value = false;
  emitChange();
}

async function onDistrictChange(id: string) {
  model.village_id = '';
  model.zipcode = '';
  villages.value = [];
  const d = districts.value.find((x) => String(x.id) === String(id));
  if (d) {
    model.district = d.name;
  } else {
    model.district = '';
  }
  if (!id) return;
  loadingVillages.value = true;
  villages.value = await getVillages(id);
  loadingVillages.value = false;
  emitChange();
}

async function onVillageChange(id: string) {
  const v = villages.value.find((x) => String(x.id) === String(id));
  if (v) {
    model.village = v.name;
    if (!model.zipcode) model.zipcode = v.zipcode || '';
  } else {
    model.village = '';
  }
  emitChange();
}

async function populateNameFields() {
  if (!model.village_id) return;
  const addr = await getAddressByVillage(model.village_id);
  if (addr) {
    model.village = addr.village || model.village;
    model.district = addr.district || model.district;
    model.regency = addr.regency || model.regency;
    model.province = addr.province || model.province;
    if (!model.province_id) model.province_id = addr.province_id || '';
    if (!model.regency_id) model.regency_id = addr.regency_id || '';
    if (!model.district_id) model.district_id = addr.district_id || '';
    if (!model.zipcode) model.zipcode = addr.zipcode || '';
  }
}

onMounted(() => {
  loadProvinces();
  if (props.defaultProvinceId) {
    model.province_id = String(props.defaultProvinceId);
    onProvinceChange(String(props.defaultProvinceId));
  }
});
</script>