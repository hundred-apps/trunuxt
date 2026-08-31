<!-- components/calculator/BessCalculator.vue -->
<template>
  <div class="bess-calculator">
    <!-- Header -->
    <div v-if="showHeader" class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ title || "Kalkulator Efisiensi BESS" }}
      </h2>
      <p class="text-gray-600">
        {{
          subtitle ||
          "Hitung potensi penghematan listrik dengan BESS dan panel surya"
        }}
      </p>
    </div>

    <div class="grid lg:grid-cols-5 gap-6">
      <!-- Form -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <form @submit.prevent="handleCalculate">
            <!-- System Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jenis Sistem
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="config.hasSolar = false"
                  class="py-3 px-4 rounded-lg border-2 transition-all"
                  :class="
                    !config.hasSolar
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <Icon name="mdi:battery" class="text-2xl mx-auto block" />
                  <span class="text-sm font-medium">BESS Only</span>
                </button>
                <button
                  type="button"
                  @click="config.hasSolar = true"
                  class="py-3 px-4 rounded-lg border-2 transition-all"
                  :class="
                    config.hasSolar
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <Icon name="mdi:solar-power" class="text-2xl mx-auto block" />
                  <span class="text-sm font-medium">BESS + Solar</span>
                </button>
              </div>
            </div>

            <!-- BESS Config -->
            <div class="border-b border-gray-100 pb-4 mb-4">
              <h3
                class="font-semibold text-gray-700 mb-3 flex items-center gap-2"
              >
                <Icon name="mdi:battery-charging" class="text-orange-500" />
                Konfigurasi BESS
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Kapasitas BESS -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kapasitas BESS (kWh)
                </label>
                <el-input-number
                  v-model="config.bessCapacity"
                  :min="1"
                  :max="10000"
                  :step="1"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Daya Output -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Daya Output (kW)
                </label>
                <el-input-number
                  v-model="config.bessPower"
                  :min="0.5"
                  :max="5000"
                  :step="0.5"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- DoD -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Depth of Discharge (DoD)
                </label>
                <div class="flex items-center gap-4">
                  <el-slider
                    v-model="config.dod"
                    :min="50"
                    :max="100"
                    :step="5"
                    class="flex-1"
                  />
                  <span class="text-sm font-medium text-gray-700 min-w-[50px]">
                    {{ config.dod }}%
                  </span>
                </div>
              </div>

              <!-- Efisiensi Siklus -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Efisiensi Siklus
                </label>
                <div class="flex items-center gap-4">
                  <el-slider
                    v-model="config.cycleEfficiency"
                    :min="80"
                    :max="98"
                    :step="1"
                    class="flex-1"
                  />
                  <span class="text-sm font-medium text-gray-700 min-w-[50px]">
                    {{ config.cycleEfficiency }}%
                  </span>
                </div>
              </div>

              <!-- Biaya Investasi -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Investasi BESS (Rp)
                </label>
                <el-input-number
                  v-model="config.investmentCost"
                  :min="1000000"
                  :step="1000000"
                  controls-position="right"
                  class="w-full"
                  :formatter="
                    (value) => new Intl.NumberFormat('id-ID').format(value)
                  "
                  :parser="(value) => Number(value.replace(/[^0-9]/g, ''))"
                />
              </div>
            </div>

            <!-- Solar Config -->
            <div
              v-if="config.hasSolar"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4"
            >
              <div class="md:col-span-2">
                <h3
                  class="font-semibold text-gray-700 mb-3 flex items-center gap-2"
                >
                  <Icon name="mdi:solar-panel" class="text-yellow-500" />
                  Konfigurasi Solar Panel
                </h3>
              </div>

              <!-- Kapasitas Panel -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kapasitas Panel (kWp)
                </label>
                <el-input-number
                  v-model="config.solarCapacity"
                  :min="0.1"
                  :max="1000"
                  :step="0.5"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Jam Matahari -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jam Sinar Matahari Efektif (jam/hari)
                </label>
                <el-input-number
                  v-model="config.sunHours"
                  :min="1"
                  :max="12"
                  :step="0.5"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Efisiensi Panel -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Efisiensi Panel
                </label>
                <div class="flex items-center gap-4">
                  <el-slider
                    v-model="config.panelEfficiency"
                    :min="15"
                    :max="25"
                    :step="0.5"
                    class="flex-1"
                  />
                  <span class="text-sm font-medium text-gray-700 min-w-[50px]">
                    {{ config.panelEfficiency }}%
                  </span>
                </div>
              </div>

              <!-- Biaya Solar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Investasi Solar Panel (Rp)
                </label>
                <el-input-number
                  v-model="config.solarCost"
                  :min="0"
                  :step="500000"
                  controls-position="right"
                  class="w-full"
                  :formatter="
                    (value) => new Intl.NumberFormat('id-ID').format(value)
                  "
                  :parser="(value) => Number(value.replace(/[^0-9]/g, ''))"
                />
              </div>
            </div>

            <!-- Usage & Tariff -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4"
            >
              <div class="md:col-span-2">
                <h3
                  class="font-semibold text-gray-700 mb-3 flex items-center gap-2"
                >
                  <Icon name="mdi:home-lightning" class="text-yellow-500" />
                  Konsumsi & Tarif
                </h3>
              </div>

              <!-- Daya Beban -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Daya Beban Harian (kWh/hari)
                </label>
                <el-input-number
                  v-model="config.dailyLoad"
                  :min="0.1"
                  :step="0.5"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Tarif Listrik -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarif Listrik (Rp/kWh)
                </label>
                <el-input-number
                  v-model="config.electricityRate"
                  :min="500"
                  :max="5000"
                  :step="50"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Tarif Peak -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarif Peak Hour (Rp/kWh)
                </label>
                <el-input-number
                  v-model="config.peakRate"
                  :min="500"
                  :max="5000"
                  :step="50"
                  controls-position="right"
                  class="w-full"
                />
              </div>

              <!-- Jam Peak -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jam Operasi Puncak (jam/hari)
                </label>
                <el-input-number
                  v-model="config.peakHours"
                  :min="0"
                  :max="24"
                  :step="1"
                  controls-position="right"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Tombol Hitung -->
            <button
              type="submit"
              class="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="mdi:calculator" class="text-xl" />
              Hitung Efisiensi
            </button>
          </form>
        </div>
      </div>

      <!-- Result -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
          <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="mdi:chart-line" class="text-green-500" />
            Hasil Perhitungan
          </h3>

          <div v-if="!result" class="text-center py-8 text-gray-400">
            <Icon name="mdi:calculator" class="text-6xl mx-auto mb-3" />
            <p>Masukkan data di samping<br />untuk melihat hasil</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-green-50 rounded-lg p-3 text-center">
                <p class="text-xs text-gray-500">Penghematan Harian</p>
                <p class="text-lg font-bold text-green-600">
                  {{ formatCurrency(result.dailySavings) }}
                </p>
              </div>
              <div class="bg-blue-50 rounded-lg p-3 text-center">
                <p class="text-xs text-gray-500">Penghematan Bulanan</p>
                <p class="text-lg font-bold text-blue-600">
                  {{ formatCurrency(result.monthlySavings) }}
                </p>
              </div>
              <div class="bg-purple-50 rounded-lg p-3 text-center">
                <p class="text-xs text-gray-500">Penghematan Tahunan</p>
                <p class="text-lg font-bold text-purple-600">
                  {{ formatCurrency(result.annualSavings) }}
                </p>
              </div>
              <div class="bg-orange-50 rounded-lg p-3 text-center">
                <p class="text-xs text-gray-500">ROI</p>
                <p class="text-lg font-bold text-orange-600">
                  {{ result.roi.toFixed(1) }}%
                </p>
              </div>
            </div>

            <!-- Detailed Results -->
            <div class="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Total Investasi</span>
                <span class="font-medium">{{
                  formatCurrency(result.totalInvestment)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Energi Solar / Hari</span>
                <span class="font-medium"
                  >{{ result.solarEnergy.toFixed(1) }} kWh</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Energi BESS / Hari</span>
                <span class="font-medium"
                  >{{ result.bessEnergy.toFixed(1) }} kWh</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Total Energi Hemat / Hari</span>
                <span class="font-medium"
                  >{{ result.totalEnergySaved.toFixed(1) }} kWh</span
                >
              </div>
              <div
                class="flex justify-between border-t border-gray-100 pt-2 font-semibold"
              >
                <span class="text-gray-700">Payback Period</span>
                <span class="text-green-600"
                  >{{ result.paybackPeriod.toFixed(1) }} tahun</span
                >
              </div>
            </div>

            <!-- CO2 Savings -->
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-xs text-gray-500">Pengurangan Emisi CO₂</p>
              <p class="text-lg font-bold text-green-600">
                {{ result.co2Reduction.toFixed(1) }} kg CO₂/tahun
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// ============ PROPS ============
const props = defineProps<{
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  defaultConfig?: Partial<BessConfig>;
}>();

// ============ EMITS ============
const emit = defineEmits<{
  calculate: [result: BessResult];
}>();

// ============ TYPES ============
interface BessConfig {
  hasSolar: boolean;
  bessCapacity: number;
  bessPower: number;
  dod: number;
  cycleEfficiency: number;
  investmentCost: number;
  solarCapacity: number;
  sunHours: number;
  panelEfficiency: number;
  solarCost: number;
  dailyLoad: number;
  electricityRate: number;
  peakRate: number;
  peakHours: number;
}

interface BessResult {
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  totalInvestment: number;
  solarEnergy: number;
  bessEnergy: number;
  totalEnergySaved: number;
  paybackPeriod: number;
  co2Reduction: number;
}

// ============ DEFAULT CONFIG ============
const defaultConfig: BessConfig = {
  hasSolar: false,
  bessCapacity: 100,
  bessPower: 50,
  dod: 80,
  cycleEfficiency: 90,
  investmentCost: 500000000,
  solarCapacity: 10,
  sunHours: 4.5,
  panelEfficiency: 20,
  solarCost: 150000000,
  dailyLoad: 200,
  electricityRate: 1500,
  peakRate: 2000,
  peakHours: 4,
};

const config = reactive<BessConfig>({
  ...defaultConfig,
  ...props.defaultConfig,
});

const result = ref<BessResult | null>(null);

// ============ METHODS ============
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function performCalculation(config: BessConfig): BessResult {
  const CO2_FACTOR = 0.85;

  // 1. BESS Energy per day
  const usableBessCapacity =
    config.bessCapacity * (config.dod / 100) * (config.cycleEfficiency / 100);
  const bessEnergy = Math.min(usableBessCapacity, config.dailyLoad * 0.5);

  // 2. Solar Energy per day
  let solarEnergy = 0;
  if (config.hasSolar) {
    solarEnergy =
      config.solarCapacity * config.sunHours * (config.panelEfficiency / 100);
    solarEnergy = Math.min(solarEnergy, config.dailyLoad * 0.7);
  }

  // 3. Total energy saved
  const totalEnergySaved = bessEnergy + solarEnergy;

  // 4. Cost savings
  const normalCost = totalEnergySaved * config.electricityRate;
  const peakShaving = Math.min(
    totalEnergySaved * 0.4,
    config.peakHours * config.peakRate
  );
  const peakSavings = peakShaving * (config.peakRate - config.electricityRate);
  const dailySavings = normalCost + peakSavings;

  // 5. Monthly and annual savings
  const monthlySavings = dailySavings * 30;
  const annualSavings = dailySavings * 365;

  // 6. Total investment
  const totalInvestment =
    config.investmentCost + (config.hasSolar ? config.solarCost : 0);

  // 7. ROI
  const roi = totalInvestment > 0 ? (annualSavings / totalInvestment) * 100 : 0;

  // 8. Payback period
  const paybackPeriod = annualSavings > 0 ? totalInvestment / annualSavings : 0;

  // 9. CO2 reduction
  const co2Reduction = totalEnergySaved * 365 * CO2_FACTOR;

  return {
    dailySavings,
    monthlySavings,
    annualSavings,
    roi,
    totalInvestment,
    solarEnergy,
    bessEnergy,
    totalEnergySaved,
    paybackPeriod,
    co2Reduction,
  };
}

function handleCalculate() {
  // Validasi input
  if (config.dailyLoad <= 0) {
    ElMessage.warning("Masukkan daya beban harian yang valid");
    return;
  }
  if (config.electricityRate <= 0) {
    ElMessage.warning("Masukkan tarif listrik yang valid");
    return;
  }
  if (config.bessCapacity <= 0) {
    ElMessage.warning("Masukkan kapasitas BESS yang valid");
    return;
  }

  const resultData = performCalculation(config);
  result.value = resultData;
  emit("calculate", resultData);

  ElMessage.success("Perhitungan selesai!");
}
</script>

<style scoped>
:deep(.el-slider) {
  width: 100%;
}

:deep(.el-slider .el-slider__bar) {
  background-color: #fa8420;
}

:deep(.el-slider .el-slider__button) {
  border-color: #fa8420;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
}
</style>
