<!-- components/bess/BessBenefits.vue -->
<template>
  <section ref="sectionRef" id="bess-benefits" class="relative overflow-hidden">
    <div class="relative mx-auto max-w-[1440px] px-4 md:px-8">
      <!-- HEADER -->
      <div class="mx-auto mb-6 max-w-4xl text-center md:mb-6">
        <div class="mb-4 flex items-center justify-center gap-3">
          <span class="h-[2px] w-10 bg-green-500" />
          <span
            class="text-xs font-bold uppercase tracking-[0.3em] text-green-600"
          >
            Battery Energy Storage System
          </span>
          <span class="h-[2px] w-10 bg-green-500" />
        </div>
        <h2
          class="text-3xl font-bold tracking-tight text-[#0c2a59] md:text-4xl lg:text-5xl"
        >
          Smart Energy.
          <br class="md:hidden" />
          <span class="text-blue-600"> Better Performance. </span>
        </h2>
        <p
          class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base"
        >
          Optimalkan energi, stabilkan sistem, dan pastikan operasional tetap
          berjalan dengan Battery Energy Storage System.
        </p>
      </div>

      <!-- ENERGY DIAGRAM -->
      <div ref="diagramRef" class="relative mx-auto mb-6 overflow-hidden">
        <!-- SVG Background - Flow Lines & Arrows -->
        <svg
          class="absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 1100 500"
          preserveAspectRatio="none"
        >
          <!-- Flow Lines -->
          <path
            v-for="(line, i) in flowLines"
            :key="i"
            :d="line.d"
            fill="none"
            :stroke="line.color"
            stroke-width="3"
            stroke-dasharray="6 8"
            :class="line.class"
          />
          <!-- Arrow Heads -->
          <polygon
            v-for="(arrow, i) in arrowHeads"
            :key="'arrow-' + i"
            :points="arrow.points"
            :fill="arrow.color"
            class="arrow-blue"
          />
          <!-- Particles -->
          <circle
            v-for="(particle, i) in particles"
            :key="'particle-' + i"
            :cx="particle.cx"
            :cy="particle.cy"
            r="5"
            :fill="particle.color"
            class="particle"
          />
        </svg>

        <!-- Content Grid -->
        <div class="relative z-10 grid grid-cols-5 gap-0 mb-3">
          <!-- SOLAR -->
          <div class="flex flex-col items-center justify-center text-center">
            <div
              class="flex h-[100px] w-[100px] items-center justify-center md:h-[120px] md:w-[120px]"
            >
              <BessIcons name="solar" class="h-full w-full" />
            </div>
            <div class="text-sm font-bold text-[#0c2a59] md:text-base">
              Solar Energy
            </div>
            <div class="text-[10px] text-gray-500 md:text-xs">
              Hasilkan energi bersih
            </div>
          </div>

          <!-- GRID -->
          <div class="flex flex-col items-center justify-center text-center">
            <div
              class="flex h-[100px] w-[100px] items-center justify-center md:h-[120px] md:w-[120px]"
            >
              <BessIcons name="grid" class="h-full w-full" />
            </div>
            <div class="text-sm font-bold text-[#0c2a59] md:text-base">
              Grid
            </div>
            <div class="text-[10px] text-gray-500 md:text-xs">
              Impor / Ekspor
            </div>
          </div>

          <!-- BESS (Tengah) -->
          <div
            class="relative flex flex-col items-center justify-center text-center"
          >
            <!-- Glow CSS -->
            <div
              class="bess-glow pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-300/30 blur-[45px] md:h-[200px] md:w-[200px]"
            />

            <div
              class="relative flex h-[100px] w-[100px] items-center justify-center md:h-[120px] md:w-[120px]"
            >
              <BessIcons name="bess" class="h-full w-full" />
            </div>

            <div class="text-sm font-bold text-[#0c2a59] md:text-base">
              Battery Storage
            </div>
            <div class="text-xs font-semibold text-green-600">
              <span ref="batteryLevelRef">42</span>% Energy
            </div>
          </div>

          <!-- FACTORY / LOAD -->
          <div class="flex flex-col items-center justify-center text-center">
            <div
              class="flex h-[100px] w-[100px] items-center justify-center md:h-[120px] md:w-[120px]"
            >
              <BessIcons name="factory" class="h-full w-full" />
            </div>
            <div class="text-sm font-bold text-[#0c2a59] md:text-base">
              Beban
            </div>
            <div class="text-[10px] text-gray-500 md:text-xs">
              Operasi andal
            </div>
          </div>

          <!-- EV -->
          <div class="flex flex-col items-center justify-center text-center">
            <div
              class="flex h-[100px] w-[100px] items-center justify-center md:h-[120px] md:w-[120px]"
            >
              <BessIcons name="ev" class="h-full w-full" />
            </div>
            <div class="text-sm font-bold text-[#0c2a59] md:text-base">
              EV Charging
            </div>
            <div class="text-[10px] text-gray-500 md:text-xs">
              Transportasi bersih
            </div>
          </div>
        </div>
      </div>

      <!-- 3 MANFAAT UTAMA BESS -->
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 text-center">
          <h3 class="text-xl font-bold text-[#0c2a59] md:text-2xl">
            3 Manfaat Utama BESS
          </h3>
          <p class="text-sm text-gray-500">
            Klik pada setiap manfaat untuk melihat bagaimana BESS bekerja
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 3 Manfaat - 3 kolom di kiri -->
          <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="benefit in benefits"
              :key="benefit.id"
              type="button"
              class="group relative overflow-hidden rounded-2xl border bg-white p-6 text-left transition-all duration-500"
              :class="
                activeBenefit === benefit.id
                  ? 'border-green-500 shadow-xl shadow-green-500/10 -translate-y-1'
                  : 'border-gray-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg'
              "
              @click="selectBenefit(benefit.id)"
            >
              <div
                class="absolute left-0 top-0 h-full w-1 rounded-r-full bg-green-500 transition-transform duration-500"
                :class="
                  activeBenefit === benefit.id ? 'scale-y-100' : 'scale-y-0'
                "
              />

              <div class="mb-4 flex items-center justify-between">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all duration-500"
                  :class="
                    activeBenefit === benefit.id
                      ? 'bg-green-500 text-white scale-110'
                      : 'bg-green-50 text-green-600'
                  "
                >
                  {{ benefit.icon }}
                </div>
                <span class="text-xs font-bold tracking-widest text-gray-300">
                  {{ benefit.number }}
                </span>
              </div>

              <h3
                class="mb-1 text-lg font-bold transition-colors"
                :class="
                  activeBenefit === benefit.id
                    ? 'text-green-600'
                    : 'text-[#0c2a59]'
                "
              >
                {{ benefit.title }}
              </h3>

              <p class="text-sm font-semibold leading-relaxed text-gray-800">
                {{ benefit.headline }}
              </p>

              <p class="mt-2 text-xs leading-relaxed text-gray-500">
                {{ benefit.description }}
              </p>

              <div
                class="mt-4 flex items-center gap-2 text-xs font-bold transition-all"
                :class="
                  activeBenefit === benefit.id
                    ? 'text-green-600'
                    : 'text-gray-400'
                "
              >
                Jelajahi manfaat
                <span
                  class="transition-transform duration-300 group-hover:translate-x-1"
                  >→</span
                >
              </div>
            </button>
          </div>

          <!-- Kenapa BESS Penting? - 1 kolom di kanan -->
          <div class="lg:col-span-1">
            <div
              class="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 h-full flex flex-col hover:shadow-md transition-shadow"
            >
              <h4 class="text-center text-lg font-bold text-[#0c2a59] mb-4">
                Kenapa BESS Penting?
              </h4>

              <div class="flex-1 space-y-4">
                <div
                  class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="text-3xl shrink-0">💰</div>
                  <div class="flex flex-col">
                    <h5 class="font-bold text-sm text-[#0c2a59]">
                      Hemat Biaya
                    </h5>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Kurangi biaya operasional hingga 30%
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="text-3xl shrink-0">⚡</div>
                  <div class="flex flex-col">
                    <h5 class="font-bold text-sm text-[#0c2a59]">
                      Sistem Stabil
                    </h5>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Tegangan stabil, peralatan lebih awet
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="text-3xl shrink-0">🔄</div>
                  <div class="flex flex-col">
                    <h5 class="font-bold text-sm text-[#0c2a59]">
                      Operasional 24/7
                    </h5>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Backup power saat listrik padam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// ============ REFS ============
const sectionRef = ref(null);
const diagramRef = ref(null);
const batteryLevelRef = ref(null);
const activeBenefit = ref("peak");

// ============ SVG DATA ============
const flowLines = [
  {
    d: "M140 250 C240 250 240 250 305 250",
    color: "#2563eb",
    class: "energy-flow-blue",
  },
  {
    d: "M340 250 C510 250 510 250 510 250",
    color: "#16a34a",
    class: "energy-flow-green",
  },
  {
    d: "M580 250 C720 250 720 250 720 250",
    color: "#16a34a",
    class: "energy-flow-green",
  },
  {
    d: "M810 250 C930 250 930 250 930 250",
    color: "#2563eb",
    class: "energy-flow-blue",
  },
];

const arrowHeads = [
  { points: "305,245 315,250 305,255", color: "#2563eb" },
  { points: "510,245 520,250 510,255", color: "#16a34a" },
  { points: "720,245 730,250 720,255", color: "#16a34a" },
  { points: "930,245 940,250 930,255", color: "#2563eb" },
];

// const particles = [
//   { cx: 200, cy: 250, color: "#2563eb" },
//   { cx: 380, cy: 250, color: "#16a34a" },
//   { cx: 600, cy: 250, color: "#16a34a" },
//   { cx: 800, cy: 250, color: "#2563eb" },
//   { cx: 900, cy: 250, color: "#16a34a" },
// ];

// ============ BENEFITS ============
const benefits = [
  {
    id: "peak",
    number: "01",
    title: "Peak Shaving",
    headline: "Kurangi Beban Puncak. Optimalkan Biaya.",
    description:
      "BESS menyimpan energi saat kebutuhan listrik rendah dan menggunakannya ketika beban mencapai puncak.",
    icon: "⚡",
  },
  {
    id: "power",
    number: "02",
    title: "Power Factor",
    headline: "Kendalikan Daya Reaktif. Stabilkan Sistem.",
    description:
      "BESS membantu mengoptimalkan kebutuhan daya reaktif untuk meningkatkan efisiensi dan stabilitas sistem kelistrikan.",
    icon: "〽",
  },
  {
    id: "always",
    number: "03",
    title: "Always On",
    headline: "Listrik Padam. Operasional Tetap Jalan.",
    description:
      "Ketika terjadi gangguan jaringan, BESS dapat mengambil alih suplai energi sehingga operasional tetap berjalan.",
    icon: "◉",
  },
];

// ============ METHODS ============
const selectBenefit = (id) => {
  if (activeBenefit.value === id) return;
  activeBenefit.value = id;
};

const { t } = useI18n();

useHead({
  title: t("page.principal.vinenergo.seo.title") || "VinEnergo BESS",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content: t("page.principal.vinenergo.seo.description") || "Solusi BESS",
    },
  ],
});
</script>

<style scoped>
/* Energy flow animations */
.energy-flow-blue {
  animation: flowBlue 1.5s linear infinite;
}
.energy-flow-green {
  animation: flowGreen 1.5s linear infinite;
}

@keyframes flowBlue {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -14;
  }
}
@keyframes flowGreen {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -14;
  }
}

/* Arrow pulse */
.arrow-blue {
  animation: arrowPulse 1.5s ease-in-out infinite;
}
@keyframes arrowPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Particle glow */
.particle {
  animation: particleGlow 2s ease-in-out infinite;
}
@keyframes particleGlow {
  0%,
  100% {
    r: 4;
    opacity: 1;
  }
  50% {
    r: 8;
    opacity: 0.5;
  }
}

/* BESS glow */
.bess-glow {
  animation: bessPulse 2s ease-in-out infinite;
}
@keyframes bessPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
}

/* Transisi untuk button */
button {
  transition: all 0.3s ease;
}
</style>
