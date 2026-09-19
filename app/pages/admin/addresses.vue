<template>
  <div class="admin-addresses">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.nav.addresses") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.addresses.subtitle") }}</p>
      </div>
    </div>

    <!-- Address Lookup via cascading select -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        {{ $t("admin.addresses.lookupTitle") }}
      </h2>
      <AddressSelect v-model="selectedAddress" @change="onAddressChange" />
      <div
        v-if="selectedAddress.village"
        class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200"
      >
        <h3 class="text-sm font-semibold text-orange-800 mb-1">
          {{ $t("admin.addresses.fullAddress") }}
        </h3>
        <p class="text-sm text-gray-700">
          {{ selectedAddress.village }}, {{ selectedAddress.district }},
          {{ selectedAddress.regency }}, {{ selectedAddress.province }}
          {{ selectedAddress.zipcode ? ` - ${selectedAddress.zipcode}` : "" }}
        </p>
      </div>
    </div>

    <!-- Search Village -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        {{ $t("admin.addresses.searchTitle") }}
      </h2>
      <el-input
        v-model="searchKeyword"
        :placeholder="$t('admin.addresses.searchPlaceholder')"
        prefix-icon="material-symbols:search"
        clearable
        class="w-full max-w-xl"
        @input="debounceSearch"
      />
      <div v-if="searchResults.length > 0" class="mt-4 space-y-2">
        <div
          v-for="item in searchResults"
          :key="String(item.value)"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
          @click="selectSearchResult(item)"
        >
          <span class="text-sm text-gray-700" v-html="item.label" />
          <button
            class="text-xs text-orange-600 hover:text-orange-800 font-medium px-2 py-1 rounded hover:bg-orange-100"
            @click.stop="selectSearchResult(item)"
          >
            {{ $t("button.select") }}
          </button>
        </div>
      </div>
      <div
        v-else-if="searchKeyword.length >= 2 && !searchLoading"
        class="mt-4 text-center text-gray-500 text-sm"
      >
        {{ $t("label.noResults") }}
      </div>
    </div>

    <!-- Province Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ $t("admin.addresses.provinces") }}
        </h2>
      </div>
      <div v-if="loadingProvinces" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse flex gap-4">
          <div class="h-4 bg-gray-200 rounded w-1/4" />
          <div class="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <el-table v-else :data="provinces" style="width: 100%" stripe>
        <el-table-column prop="name" :label="$t('address.province')" />
        <el-table-column
          prop="id"
          :label="$t('admin.addresses.regencyCount')"
          width="140"
          align="center"
        />
        <el-table-column :label="$t('admin.table.action')" width="120" align="center">
          <template #default="{ row }">
            <button
              class="text-sm text-orange-600 hover:text-orange-800 font-medium"
              @click="viewRegencies(row)"
            >
              {{ $t("admin.addresses.viewRegencies") }}
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Drill-down: Regencies → Districts → Villages -->
    <div
      v-if="selectedProvince"
      class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ selectedProvince.name }} &mdash; {{ $t("address.city") }}
        </h2>
        <button
          class="text-sm text-gray-500 hover:text-gray-700"
          @click="selectedProvince = null; regenciesList = []"
        >
          {{ $t("admin.addresses.close") }}
        </button>
      </div>
      <div v-if="loadingRegenciesList" class="p-6">
        <div class="animate-pulse space-y-3">
          <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <el-table v-else :data="regenciesList" style="width: 100%" stripe>
        <el-table-column prop="name" :label="$t('address.city')" />
        <el-table-column :label="$t('admin.table.action')" width="140" align="center">
          <template #default="{ row }">
            <button
              class="text-sm text-orange-600 hover:text-orange-800 font-medium"
              @click="viewDistricts(row)"
            >
              {{ $t("admin.addresses.viewDistricts") }}
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div
      v-if="selectedRegency"
      class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ selectedRegency.name }} &mdash; {{ $t("address.district") }}
        </h2>
        <button
          class="text-sm text-gray-500 hover:text-gray-700"
          @click="selectedRegency = null; districtsList = []"
        >
          {{ $t("admin.addresses.close") }}
        </button>
      </div>
      <div v-if="loadingDistrictsList" class="p-6">
        <div class="animate-pulse space-y-3">
          <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <el-table v-else :data="districtsList" style="width: 100%" stripe>
        <el-table-column prop="name" :label="$t('address.district')" />
        <el-table-column prop="kode_jne" label="Kode JNE" width="140" align="center" />
        <el-table-column :label="$t('admin.table.action')" width="140" align="center">
          <template #default="{ row }">
            <button
              class="text-sm text-orange-600 hover:text-orange-800 font-medium"
              @click="viewVillages(row)"
            >
              {{ $t("admin.addresses.viewVillages") }}
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div
      v-if="selectedDistrict"
      class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ selectedDistrict.name }} &mdash; {{ $t("address.village") }}
        </h2>
        <button
          class="text-sm text-gray-500 hover:text-gray-700"
          @click="selectedDistrict = null; villagesList = []"
        >
          {{ $t("admin.addresses.close") }}
        </button>
      </div>
      <div v-if="loadingVillagesList" class="p-6">
        <div class="animate-pulse space-y-3">
          <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <el-table v-else :data="villagesList" style="width: 100%" stripe>
        <el-table-column prop="name" :label="$t('address.village')" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAddress } from "~/composables/useAddress";
import { ElMessage } from "element-plus";

definePageMeta({ layout: "admin" });

const {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
  searchVillage,
} = useAddress();

const selectedAddress = ref<Record<string, any>>({});

const searchKeyword = ref("");
const searchResults = ref<any[]>([]);
const searchLoading = ref(false);

const provinces = ref<any[]>([]);
const loadingProvinces = ref(false);

const selectedProvince = ref<any>(null);
const regenciesList = ref<any[]>([]);
const loadingRegenciesList = ref(false);

const selectedRegency = ref<any>(null);
const districtsList = ref<any[]>([]);
const loadingDistrictsList = ref(false);

const selectedDistrict = ref<any>(null);
const villagesList = ref<any[]>([]);
const loadingVillagesList = ref(false);

let searchTimer: ReturnType<typeof setTimeout>;

function onAddressChange(val: any) {
  selectedAddress.value = val;
}

function debounceSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (!searchKeyword.value || searchKeyword.value.length < 2) {
      searchResults.value = [];
      return;
    }
    searchLoading.value = true;
    searchResults.value = await searchVillage(searchKeyword.value);
    searchLoading.value = false;
  }, 350);
}

function selectSearchResult(item: any) {
  if (item.value) {
    selectedAddress.value = { village_id: String(item.value) };
    searchKeyword.value = "";
    searchResults.value = [];
    ElMessage.success("Alamat dipilih");
  }
}

async function viewRegencies(province: any) {
  selectedProvince.value = province;
  selectedRegency.value = null;
  selectedDistrict.value = null;
  districtsList.value = [];
  villagesList.value = [];
  loadingRegenciesList.value = true;
  regenciesList.value = await getRegencies(province.id);
  loadingRegenciesList.value = false;
}

async function viewDistricts(regency: any) {
  selectedRegency.value = regency;
  selectedDistrict.value = null;
  villagesList.value = [];
  loadingDistrictsList.value = true;
  districtsList.value = await getDistricts(regency.id);
  loadingDistrictsList.value = false;
}

async function viewVillages(district: any) {
  selectedDistrict.value = district;
  loadingVillagesList.value = true;
  villagesList.value = await getVillages(district.id);
  loadingVillagesList.value = false;
}

onMounted(async () => {
  loadingProvinces.value = true;
  provinces.value = await getProvinces();
  loadingProvinces.value = false;
});
</script>
