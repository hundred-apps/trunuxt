<!-- components/calculator/BessResult.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
    <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <Icon name="mdi:chart-line" class="text-green-500" />
      {{ $t("calculator.bess.result") || "Hasil Perhitungan" }}
    </h3>

    <div v-if="!result" class="text-center py-8 text-gray-400">
      <Icon name="mdi:calculator" class="text-6xl mx-auto mb-3" />
      <p>
        {{
          $t("calculator.bess.noData") || "Masukkan data untuk melihat hasil"
        }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <p class="text-xs text-gray-500">
            {{ $t("calculator.bess.dailySavings") || "Harian" }}
          </p>
          <p class="text-lg font-bold text-green-600">
            {{ formatCurrency(result.dailySavings) }}
          </p>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <p class="text-xs text-gray-500">
            {{ $t("calculator.bess.monthlySavings") || "Bulanan" }}
          </p>
          <p class="text-lg font-bold text-blue-600">
            {{ formatCurrency(result.monthlySavings) }}
          </p>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <p class="text-xs text-gray-500">
            {{ $t("calculator.bess.annualSavings") || "Tahunan" }}
          </p>
          <p class="text-lg font-bold text-purple-600">
            {{ formatCurrency(result.annualSavings) }}
          </p>
        </div>
        <div class="bg-orange-50 rounded-lg p-3 text-center">
          <p class="text-xs text-gray-500">
            {{ $t("calculator.bess.roi") || "ROI" }}
          </p>
          <p class="text-lg font-bold text-orange-600">
            {{ result.roi.toFixed(1) }}%
          </p>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="border-t border-gray-100 pt-4 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">{{
            $t("calculator.bess.totalInvestment") || "Total Investasi"
          }}</span>
          <span class="font-medium">{{
            formatCurrency(result.totalInvestment)
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">{{
            $t("calculator.bess.solarEnergy") || "Energi Solar/Hari"
          }}</span>
          <span class="font-medium"
            >{{ result.solarEnergy.toFixed(1) }} kWh</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">{{
            $t("calculator.bess.bessEnergy") || "Energi BESS/Hari"
          }}</span>
          <span class="font-medium"
            >{{ result.bessEnergy.toFixed(1) }} kWh</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">{{
            $t("calculator.bess.totalEnergy") || "Total Energi Hemat/Hari"
          }}</span>
          <span class="font-medium"
            >{{ result.totalEnergySaved.toFixed(1) }} kWh</span
          >
        </div>
        <div
          class="flex justify-between border-t border-gray-100 pt-2 font-semibold"
        >
          <span class="text-gray-700">{{
            $t("calculator.bess.payback") || "Payback Period"
          }}</span>
          <span class="text-green-600"
            >{{ result.paybackPeriod.toFixed(1) }} tahun</span
          >
        </div>
      </div>

      <!-- CO2 Savings -->
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500">
          {{ $t("calculator.bess.co2Reduction") || "Pengurangan Emisi CO₂" }}
        </p>
        <p class="text-lg font-bold text-green-600">
          {{ result.co2Reduction.toFixed(1) }} kg CO₂/tahun
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BessResult as ResultType } from "~/types/calculator";

// ============ PROPS ============
const props = defineProps<{
  result: ResultType | null;
}>();

// ============ HELPERS ============
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
</script>
