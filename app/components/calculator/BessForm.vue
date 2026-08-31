<!-- components/calculator/BessForm.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <form @submit.prevent="$emit('calculate')">
      <!-- System Type -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t("calculator.bess.systemType") || "Jenis Sistem" }}
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="updateConfig({ hasSolar: false })"
            class="py-3 px-4 rounded-lg border-2 transition-all"
            :class="
              !config.hasSolar
                ? 'border-orange-500 bg-orange-50 text-orange-600'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <Icon name="mdi:battery" class="text-2xl mx-auto block" />
            <span class="text-sm font-medium">{{
              $t("calculator.bess.bessOnly") || "BESS Only"
            }}</span>
          </button>
          <button
            type="button"
            @click="updateConfig({ hasSolar: true })"
            class="py-3 px-4 rounded-lg border-2 transition-all"
            :class="
              config.hasSolar
                ? 'border-orange-500 bg-orange-50 text-orange-600'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <Icon name="mdi:solar-power" class="text-2xl mx-auto block" />
            <span class="text-sm font-medium">{{
              $t("calculator.bess.bessSolar") || "BESS + Solar"
            }}</span>
          </button>
        </div>
      </div>

      <!-- BESS Config -->
      <div class="border-b border-gray-100 pb-4 mb-4">
        <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Icon name="mdi:battery-charging" class="text-orange-500" />
          {{ $t("calculator.bess.bessConfig") || "Konfigurasi BESS" }}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          v-model="config.bessCapacity"
          :label="$t('calculator.bess.capacity') || 'Kapasitas BESS (kWh)'"
          :min="1"
          :max="10000"
          :step="1"
          type="number"
        />
        <FormInput
          v-model="config.bessPower"
          :label="$t('calculator.bess.power') || 'Daya Output (kW)'"
          :min="0.5"
          :max="5000"
          :step="0.5"
          type="number"
        />
        <FormSlider
          v-model="config.dod"
          :label="$t('calculator.bess.dod') || 'Depth of Discharge (%)'"
          :min="50"
          :max="100"
          :step="5"
          :marks="{ 50: '50%', 80: '80%', 100: '100%' }"
        />
        <FormSlider
          v-model="config.cycleEfficiency"
          :label="$t('calculator.bess.efficiency') || 'Efisiensi Siklus (%)'"
          :min="80"
          :max="98"
          :step="1"
          :marks="{ 80: '80%', 90: '90%', 98: '98%' }"
        />
        <div class="md:col-span-2">
          <FormInput
            v-model="config.investmentCost"
            :label="
              $t('calculator.bess.investment') || 'Biaya Investasi BESS (Rp)'
            "
            :min="1000000"
            :step="1000000"
            type="currency"
          />
        </div>
      </div>

      <!-- Solar Config -->
      <div
        v-if="config.hasSolar"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4"
      >
        <div class="md:col-span-2">
          <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon name="mdi:solar-panel" class="text-yellow-500" />
            {{ $t("calculator.bess.solarConfig") || "Konfigurasi Solar Panel" }}
          </h3>
        </div>

        <FormInput
          v-model="config.solarCapacity"
          :label="
            $t('calculator.bess.solarCapacity') || 'Kapasitas Panel (kWp)'
          "
          :min="0.1"
          :max="1000"
          :step="0.5"
          type="number"
        />
        <FormInput
          v-model="config.sunHours"
          :label="
            $t('calculator.bess.sunHours') || 'Jam Sinar Matahari (jam/hari)'
          "
          :min="1"
          :max="12"
          :step="0.5"
          type="number"
        />
        <FormSlider
          v-model="config.panelEfficiency"
          :label="
            $t('calculator.bess.panelEfficiency') || 'Efisiensi Panel (%)'
          "
          :min="15"
          :max="25"
          :step="0.5"
          :marks="{ 15: '15%', 20: '20%', 25: '25%' }"
        />
        <FormInput
          v-model="config.solarCost"
          :label="$t('calculator.bess.solarCost') || 'Biaya Solar Panel (Rp)'"
          :min="0"
          :step="500000"
          type="currency"
        />
      </div>

      <!-- Usage & Tariff -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4"
      >
        <div class="md:col-span-2">
          <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon name="mdi:home-lightning" class="text-yellow-500" />
            {{ $t("calculator.bess.usage") || "Konsumsi & Tarif" }}
          </h3>
        </div>

        <FormInput
          v-model="config.dailyLoad"
          :label="
            $t('calculator.bess.dailyLoad') || 'Daya Beban Harian (kWh/hari)'
          "
          :min="0.1"
          :step="0.5"
          type="number"
        />
        <FormInput
          v-model="config.electricityRate"
          :label="$t('calculator.bess.rate') || 'Tarif Listrik (Rp/kWh)'"
          :min="500"
          :max="5000"
          :step="50"
          type="number"
        />
        <FormInput
          v-model="config.peakRate"
          :label="$t('calculator.bess.peakRate') || 'Tarif Peak (Rp/kWh)'"
          :min="500"
          :max="5000"
          :step="50"
          type="number"
        />
        <FormInput
          v-model="config.peakHours"
          :label="
            $t('calculator.bess.peakHours') || 'Jam Operasi Puncak (jam/hari)'
          "
          :min="0"
          :max="24"
          :step="1"
          type="number"
        />
      </div>

      <button
        type="submit"
        class="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="mdi:calculator" class="text-xl" />
        {{ $t("calculator.bess.calculate") || "Hitung Efisiensi" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import FormInput from "./FormInput.vue";
import FormSlider from "./FormSlider.vue";
import type { BessConfig } from "~/types/calculator";

// ============ PROPS ============
const props = defineProps<{
  config: BessConfig;
}>();

// ============ EMITS ============
const emit = defineEmits<{
  "update:config": [config: Partial<BessConfig>];
  calculate: [];
}>();

function updateConfig(newConfig: Partial<BessConfig>) {
  emit("update:config", newConfig);
}
</script>
