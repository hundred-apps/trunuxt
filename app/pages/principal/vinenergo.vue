<template>
  <div class="min-h-screen bg-surface font-body-md text-on-surface">
    <!-- ============ HERO SECTION ============ -->
    <section
      class="relative pt-safe-top min-h-[60dvh] flex items-center overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="w-full h-full bg-cover bg-center bg-no-repeat"
          :style="{
            backgroundImage: `url('https://static.vinenergo.com/public/gioi_thieu_vinenergo_7ebc199006.jpg?w=1920&q=100')`,
          }"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/70 to-emerald-900/40"
        ></div>
        <div class="absolute inset-0 opacity-10">
          <div
            class="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
          ></div>
        </div>
      </div>

      <div class="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8">
        <div
          class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 md:py-16"
        >
          <div class="max-w-3xl">
            <div class="flex items-center gap-3 mb-6">
              <img
                src="https://static.vinenergo.com/public/logo_c0ce5b3ebc.png?w=128&q=100"
                alt="VinEnergo"
                class="h-10 md:h-14 w-auto object-contain"
                loading="lazy"
              />
              <div
                class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full"
              >
                <span
                  class="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                ></span>
                <span
                  class="text-xs font-semibold uppercase tracking-wider text-white/90"
                  >{{ $t("page.principal.vinenergo.hero.badge") }}</span
                >
              </div>
            </div>

            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              {{ $t("page.principal.vinenergo.hero.titleLine1") }}
              <span class="text-green-400">{{
                $t("page.principal.vinenergo.hero.titleLine2")
              }}</span>
            </h1>

            <p
              class="text-lg md:text-xl text-gray-200/90 mb-8 max-w-2xl leading-relaxed"
            >
              {{ $t("page.principal.vinenergo.hero.subtitle") }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <ElButton
                type="primary"
                size="large"
                class="!bg-green-600 !border-green-600 hover:!bg-green-700 !text-white !px-8 !py-4 !rounded-xl !font-semibold !shadow-lg hover:!shadow-xl transition-all !text-base"
                @click="scrollTo('products')"
              >
                <Icon name="mdi:battery-charging" class="text-xl mr-2" />
                {{ $t("page.principal.vinenergo.hero.ctaProducts") }}
              </ElButton>

              <ElButton
                size="large"
                class="!bg-white/10 !border-2 !border-white/30 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-xl !font-semibold !backdrop-blur-sm transition-all !text-base"
                @click="scrollTo('benefits')"
              >
                <Icon name="mdi:lightning-bolt" class="text-xl mr-2" />
                {{ $t("page.principal.vinenergo.hero.ctaBenefits") }}
              </ElButton>
            </div>
          </div>

          <div class="hidden lg:flex justify-center items-center relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl"
              ></div>
            </div>
            <div class="relative z-10 w-full max-w-md">
              <div class="relative overflow-hidden">
                <img
                  src="https://migration.trumecs.com/principal/vinenergo/container-bess.png"
                  alt="VinEnergo BESS"
                  class="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ PRODUCTS SECTION ============ -->
    <section class="py-12 md:py-6 bg-surface" id="products">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-green-600"></span>
            <span
              class="text-xs text-green-600 uppercase tracking-widest font-semibold"
              >{{ $t("page.principal.vinenergo.products.sectionLabel") }}</span
            >
            <span class="w-8 h-1 bg-green-600"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {{ $t("page.principal.vinenergo.products.title") }}
          </h2>
          <p class="text-gray-600">
            {{ $t("page.principal.vinenergo.products.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(product, pIdx) in products"
            :key="pIdx"
            class="bg-white rounded-xl overflow-hidden border border-gray-200/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center"
            >
              <img
                :src="product.image"
                :alt="product.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div
                class="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider"
              >
                {{ product.badge }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-primary mb-2">
                {{ product.title }}
              </h3>
              <p class="text-sm text-green-600 font-semibold mb-3">
                {{ product.customer }}
              </p>
              <p class="text-gray-600 text-sm mb-4">
                {{ product.description }}
              </p>
              <div class="space-y-2">
                <div
                  v-for="(spec, sIdx) in product.specs"
                  :key="sIdx"
                  class="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0"
                >
                  <span class="text-gray-500">{{ spec.label }}</span>
                  <span class="font-semibold text-primary">{{
                    spec.value
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURES ACCORDION ============ -->
    <section class="py-12 md:py-6 bg-gray-50" id="features">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-green-600"></span>
            <span
              class="text-xs text-green-600 uppercase tracking-widest font-semibold"
              >{{ $t("page.principal.vinenergo.features.sectionLabel") }}</span
            >
            <span class="w-8 h-1 bg-green-600"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {{ $t("page.principal.vinenergo.features.title") }}
          </h2>
          <p class="text-gray-600">
            {{ $t("page.principal.vinenergo.features.subtitle") }}
          </p>
        </div>

        <!-- Desktop: Horizontal Accordion -->
        <div class="hidden md:flex gap-4 h-[420px]">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out group"
            :class="activeFeature === index ? 'flex-[4]' : 'flex-[0.7]'"
            @click="activeFeature = index"
          >
            <div
              class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              :style="{ backgroundImage: `url('${feature.image}')` }"
            ></div>
            <div
              class="absolute inset-0 transition-all duration-500"
              :class="
                activeFeature === index
                  ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/10'
                  : 'bg-black/60'
              "
            ></div>

            <div class="relative z-10 h-full p-6">
              <div
                class="absolute inset-0 transition-all duration-500 flex items-center justify-center"
                :class="
                  activeFeature !== index
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                "
              >
                <h3
                  class="text-white font-bold text-lg whitespace-nowrap -rotate-90 select-none"
                >
                  {{ feature.title }}
                </h3>
              </div>

              <div
                class="h-full flex flex-col justify-end transition-all duration-500"
                :class="
                  activeFeature === index
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                "
              >
                <div
                  class="w-12 h-12 rounded-xl bg-green-500/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-green-500/30"
                >
                  <Icon :name="feature.icon" class="text-green-400 text-2xl" />
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Vertical Accordion with Images -->
        <div class="md:hidden space-y-3">
          <div
            v-for="(feature, index) in features"
            :key="index + '-mobile'"
            class="rounded-xl overflow-hidden relative"
            :style="{
              minHeight: activeFeatureMobile === index ? '280px' : '120px',
            }"
          >
            <div
              class="absolute inset-0 bg-cover bg-center"
              :style="{ backgroundImage: `url('${feature.image}')` }"
            ></div>
            <div
              class="absolute inset-0 transition-all duration-300"
              :class="
                activeFeatureMobile === index
                  ? 'bg-gradient-to-t from-black/90 via-black/50 to-black/20'
                  : 'bg-black/60'
              "
            ></div>

            <button
              class="relative z-10 w-full text-left p-4 h-full flex flex-col justify-end"
              @click="
                activeFeatureMobile = activeFeatureMobile === index ? -1 : index
              "
            >
              <div
                class="flex items-center gap-3"
                :class="activeFeatureMobile === index ? 'mb-3' : ''"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-green-500/30"
                  :class="
                    activeFeatureMobile === index
                      ? 'bg-green-500/20'
                      : 'bg-green-500/10'
                  "
                >
                  <Icon :name="feature.icon" class="text-green-400 text-xl" />
                </div>
                <span class="font-bold text-white text-lg flex-1">{{
                  feature.title
                }}</span>
                <Icon
                  name="mdi:chevron-down"
                  class="text-white/70 text-xl transition-transform duration-300"
                  :class="activeFeatureMobile === index ? 'rotate-180' : ''"
                />
              </div>

              <div
                class="overflow-hidden transition-all duration-300"
                :class="
                  activeFeatureMobile === index
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                "
              >
                <p class="text-sm text-gray-300 leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ BENEFITS SECTION ============ -->
    <section class="py-4 md:py-6 bg-surface" id="benefits">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-green-600"></span>
            <span
              class="text-xs text-green-600 uppercase tracking-widest font-semibold"
              >{{ $t("page.principal.vinenergo.benefits.sectionLabel") }}</span
            >
            <span class="w-8 h-1 bg-green-600"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {{ $t("page.principal.vinenergo.benefits.title") }}
          </h2>
          <p class="text-gray-600">
            {{ $t("page.principal.vinenergo.benefits.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(benefit, bIdx) in benefits"
            :key="bIdx"
            class="bg-white rounded-xl p-8 border border-gray-200/30 shadow-sm hover:shadow-lg transition-all"
          >
            <div
              class="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center mb-6"
            >
              <Icon :name="benefit.icon" class="text-green-600 text-3xl" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">
              {{ benefit.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-4 md:py-6 bg-surface border-t border-gray-200/10">
      <div class="container mx-auto px-4 py-8">
        <!-- <BessCalculator
          title="Kalkulator Efisiensi BESS"
          subtitle="Hitung potensi penghematan listrik dengan BESS dan solar panel"
          :show-header="true"
          @calculate="handleCalculate"
        /> -->
        <BessInteractive />
      </div>
    </section>

    <!-- ============ CONTACT & LOCATIONS ============ -->
    <section
      class="py-4 md:py-6 bg-surface border-t border-gray-200/10"
      id="contactLocations"
    >
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 flex gap-2 items-center">
        <div class="max-w-2xl mx-auto text-center">
          <Icon name="mdi:phone" class="text-5xl text-green-600 mb-3" />
          <h2 class="text-3xl font-bold mb-4">
            {{ $t("page.principal.vinenergo.contact.title") }}
          </h2>
          <p class="text-gray-500 mb-8">
            {{ $t("page.principal.vinenergo.contact.subtitle") }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <ElButton
              type="success"
              size="large"
              class="!bg-green-600 !border-green-600 hover:!bg-green-700 !text-white !px-8 !py-3 !rounded !font-semibold"
              @click="handleContact"
            >
              <Icon name="mdi:whatsapp" class="text-xl mr-2" />
              {{ $t("page.principal.vinenergo.contact.whatsapp") }}
            </ElButton>
            <ElButton
              type="warning"
              size="large"
              class="!bg-warning !border !border-white !text-white hover:!bg-warning !px-8 !py-3 !rounded !font-semibold"
              @click="handleEmail"
            >
              <Icon name="mdi:email" class="text-xl mr-2" />
              {{ $t("page.principal.vinenergo.contact.email") }}
            </ElButton>
          </div>
        </div>

        <div class="max-w-[1440px] mx-auto px-4 md:px-8 text-center mt-12">
          <Icon name="mdi:city" class="text-5xl text-green-600 mb-3" />
          <h2 class="text-3xl font-bold text-primary mb-3">
            {{ $t("page.principal.vinenergo.contact.locationTitle") }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto mb-6">
            {{ $t("page.principal.vinenergo.contact.locationDesc") }}
          </p>
          <div class="flex flex-wrap justify-center gap-3 md:gap-4">
            <div
              v-for="location in locations"
              :key="location"
              class="bg-white border border-gray-200/10 px-6 py-3 rounded-full shadow-sm flex items-center gap-2"
            >
              <Icon name="mdi:map-marker" class="text-green-600 text-xl" />
              <span class="font-semibold text-primary text-lg">{{
                location
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BessCalculator from "~/components/calculator/BessCalculator.vue";
import type { BessResult } from "~/types/calculator";
const { t } = useI18n();

const activeFeature = ref(0);
const activeFeatureMobile = ref(0);

function handleCalculate(result: BessResult) {
  console.log("Calculation result:", result);
  // Kirim ke analytics, simpan, dll.
}

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleContact = () => {
  window.open(
    "https://wa.me/6285176912338?text=Halo%20Trumecs%2C%20saya%20tertarik%20dengan%20BESS%20Anda.",
    "_blank"
  );
};

const handleEmail = () => {
  window.location.href =
    "mailto:info@trumecs.com?subject=Machining%20dan%20Fabrication%20Inquiry";
};

const products = [
  {
    title: "Box Type BESS",
    badge: "Residential",
    customer: "Residential & Office",
    description:
      "Energy storage solution for homes and small offices. Compact design, easy to install, and supports up to 5 stack modules.",
    image:
      "https://static.vinenergo.com/public/product_civil_4373bb0bda.jpg?w=828&q=100",
    specs: [
      { label: "Nominal Voltage", value: "51.2V" },
      { label: "Battery Cell", value: "LFP 3.2V/52Ah" },
      { label: "Capacity", value: "5.1 - 26.5 kWh" },
      { label: "Scalability", value: "Up to 5 stacks" },
      { label: "Cycle Life", value: "> 4,000 cycles" },
    ],
  },
  {
    title: "Cabinet Type BESS",
    badge: "Commercial",
    customer: "Commercial & Industrial",
    description:
      "Cabinet energy storage system for commercial and industrial operations. Equipped with fire suppression and active cooling.",
    image:
      "https://static.vinenergo.com/public/product_cabinet_energy_storage_1_aed3b70cb2.jpg?w=828&q=100",
    specs: [
      { label: "Rated Capacity", value: "138.3 kWh" },
      { label: "Power Output", value: "66 kW" },
      { label: "Efficiency", value: "≥ 96.5%" },
      { label: "Cycle Life", value: "8,000 cycles" },
      { label: "Certifications", value: "UL 1973, UL 9540" },
    ],
  },
  {
    title: "Container Based BESS",
    badge: "Large Scale",
    customer: "Large Scale Commercial & Industrial",
    description:
      "Large-scale energy storage solution based on a 20ft container. Massive capacity for industrial and utility networks.",
    image:
      "https://static.vinenergo.com/public/product_20ft_container_4cb0b7b16b.jpg?w=828&q=100",
    specs: [
      { label: "Rated Energy", value: "3,686 kWh" },
      { label: "Nominal Voltage", value: "1,229V" },
      { label: "Cooling", value: "Active liquid cooling" },
      { label: "Weight", value: "~ 33 Tons" },
      { label: "Certifications", value: "UL 1973, UL 9540" },
    ],
  },
];

const features = [
  {
    title: "Energy Management System",
    description:
      "Intelligent energy management system that optimizes charging/discharging based on consumption patterns and electricity tariffs.",
    icon: "mdi:lightning-bolt",
    image:
      "https://static.vinenergo.com/public/gioi_thieu_san_phan_vinenergo_d42809f8d1.jpg?w=1920&q=100",
  },
  {
    title: "Battery Management System",
    description:
      "Advanced battery management system that monitors and optimizes the performance of each battery cell in real-time.",
    icon: "mdi:battery-heart",
    image:
      "https://static.vinenergo.com/public/product_civil_4373bb0bda.jpg?w=1920&q=100",
  },
  {
    title: "Cell-Level Monitoring",
    description:
      "Individual cell-level monitoring to detect anomalies before they become serious problems.",
    icon: "mdi:chart-areaspline",
    image:
      "https://static.vinenergo.com/public/product_cabinet_energy_storage_1_aed3b70cb2.jpg?w=1920&q=100",
  },
  {
    title: "Self-Diagnostics",
    description:
      "Automatic diagnostic system that runs periodically to ensure all components are functioning optimally.",
    icon: "mdi:tools",
    image:
      "https://static.vinenergo.com/public/product_20ft_container_4cb0b7b16b.jpg?w=1920&q=100",
  },
  {
    title: "Advanced Management System",
    description:
      "Centralized management platform for monitoring, control, and optimization of entire BESS installations from a single dashboard.",
    icon: "mdi:monitor-dashboard",
    image:
      "https://static.vinenergo.com/public/gioi_thieu_vinenergo_7ebc199006.jpg?w=1920&q=100",
  },
  {
    title: "Fire Protection System",
    description:
      "Advanced fire protection system with 3 Level Issue Detection and 5 Levels of Protection.",
    icon: "mdi:fire-extinguisher",
    image:
      "https://static.vinenergo.com/public/gioi_thieu_san_phan_vinenergo_d42809f8d1.jpg?w=1920&q=100",
  },
];

const benefits = [
  {
    title: "Grid Stabilization",
    description:
      "Maintains stable PLN grid frequency and voltage against fluctuation disturbances. BESS acts as an instant energy absorber and releaser to maintain network balance.",
    icon: "mdi:transmission-tower",
  },
  {
    title: "Backup Power",
    description:
      "Provides emergency power supply during outages or disruptions in isolated areas. Ensures critical operations continue without interruption.",
    icon: "mdi:generator-portable",
  },
  {
    title: "Peak Shaving",
    description:
      "Reduces operational electricity costs during demand spikes. Store energy during off-peak hours and use it during peak hours to save costs.",
    icon: "streamline:graph-bar-decrease-solid",
  },
];

const locations = ["Jakarta", "Bekasi", "Cikarang", "Tangerang"];

useHead({
  title: t("page.principal.vinenergo.seo.title") || "VinEnergo BESS",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content: t("page.principal.vinenergo.seo.description") || "Solusi BESS",
    },
    {
      property: "og:title",
      content: `${t("page.principal.vinenergo.seo.title") || "VinEnergo"} | Trumecs.com`,
    },
    {
      property: "og:description",
      content: t("page.principal.vinenergo.seo.description") || "Solusi BESS",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.trumecs.com/principal/vinenergo",
    },
  ],
});
</script>

<style scoped>
:deep(.el-button) {
  font-weight: 600 !important;
}

:deep(.el-button.is-disabled) {
  opacity: 0.5;
}
</style>
