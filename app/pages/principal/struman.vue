<template>
  <div class="bg-background text-on-surface font-body-md min-h-screen">
    <main>
      <!-- Hero Section -->
      <section
        class="relative bg-industrial-black text-on-primary overflow-hidden py-4 sm:py-section-gap"
      >
        <div class="absolute inset-0 opacity-20">
          <div class="industrial-grid-bg w-full h-full"></div>
        </div>
        <div
          class="max-w-7xl mx-auto px-4 sm:px-grid-margin relative z-10 grid md:grid-cols-2 items-center gap-6 md:gap-grid-gutter"
        >
          <!-- Left Content -->
          <div class="space-y-3 sm:space-y-stack-md text-center md:text-left">
            <div class="flex justify-center md:justify-start">
              <img
                src="https://migration.trumecs.com/logo/principal/struman.png"
                alt="STRUMAN Brand"
                class="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>

            <div
              class="inline-flex items-center gap-2 bg-secondary/10 text-secondary-container px-3 py-1 rounded-full border border-secondary/20 mx-auto md:mx-0"
            >
              <Icon name="mdi:flash" class="text-[18px]" />
              <span
                class="font-label-caps text-label-caps uppercase tracking-wider"
                >Industrial Excellence</span
              >
            </div>

            <h1
              class="font-display-lg font-bold text-2xl sm:text-3xl md:text-4xl lg:text-display-lg leading-tight"
            >
              STRUMAN Power Solutions
            </h1>

            <p
              class="font-body-lg text-sm sm:text-base md:text-body-lg text-on-tertiary-container max-w-xl mx-auto md:mx-0"
            >
              Keandalan tanpa kompromi untuk garda terdepan industri.
              Menyediakan pembangkit listrik portabel dan panel surya yang
              direkayasa dengan presisi, dirancang untuk mendukung operasi
              penting dalam lingkungan apa pun.
            </p>

            <div
              class="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start"
            >
              <a
                href="#catalog"
                class="inline-flex items-center gap-2 bg-secondary-container text-on-primary px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-secondary transition-all"
              >
                Lihat Catalog
                <Icon
                  name="mdi:arrow-right"
                  class="text-[18px] sm:text-[20px]"
                />
              </a>
            </div>
          </div>

          <!-- Right Image -->
          <div class="hidden md:block">
            <div class="relative rounded-2xl overflow-hidden">
              <img
                class="w-full h-auto object-contain mix-blend-multiply"
                src="https://migration.trumecs.com/logo/principal/struman-all.png"
                alt="STRUMAN All"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Brand Intro -->
      <section class="bg-surface-container-lowest py-4 sm:py-6">
        <div class="max-w-4xl mx-auto px-4 sm:px-grid-margin text-center">
          <h2
            class="font-display-lg text-xl sm:text-2xl md:text-3xl lg:text-headline-md font-bold text-on-surface mb-3 sm:mb-4"
          >
            Integrated Power Architecture
          </h2>
          <p
            class="font-body-lg text-sm sm:text-base md:text-body-lg text-on-surface-variant leading-relaxed"
          >
            STRUMAN ini adalah ekosistem eksklusif. Dari baterai lithium fosfat
            berdensitas tinggi hingga integrasi BMS cerdas, sistem kami bekerja
            bersama untuk menyediakan daya tanpa henti untuk operasi di lokasi
            terpencil, unit medis bergerak, dan zona pemulihan bencana.
          </p>
        </div>
      </section>

      <!-- Use Cases Section -->
      <section
        class="bg-surface-container-lowest py-4 sm:py-section-gap border-b border-outline-variant"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-grid-margin">
          <div class="text-center mb-8 sm:mb-12">
            <div
              class="inline-flex items-center gap-2 bg-secondary/10 text-secondary-container px-3 py-1 rounded-full border border-secondary/20 mb-4"
            >
              <span class="material-symbols-outlined text-[18px]">bolt</span>
              <span
                class="font-label-caps text-label-caps uppercase tracking-wider"
                >Solusi Untuk Berbagai Kebutuhan</span
              >
            </div>
            <h2
              class="font-display-lg text-2xl sm:text-3xl md:text-headline-md text-industrial-black mb-3"
            >
              STRUMAN Bisa Digunakan Di Mana Saja
            </h2>
            <p class="text-on-surface-variant font-body-md max-w-2xl mx-auto">
              Dari hunian rumah hingga operasi industri berat — STRUMAN hadir
              sebagai solusi energi mandiri yang andal, tanpa instalasi rumit,
              tanpa genset berisik.
            </p>
          </div>

          <!-- Use Case Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-grid-gutter mb-8 sm:mb-12"
          >
            <div
              v-for="useCase in useCases"
              :key="useCase.title"
              class="relative rounded-xl border border-outline-variant overflow-hidden technical-shadow hover:border-primary/40 transition-all group min-h-[calc(100vh-4rem)] sm:min-h-[380px] lg:min-h-[420px]"
            >
              <img
                :src="useCase.image"
                :alt="useCase.title"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/0"
              ></div>
              <div class="relative z-10 p-6 flex flex-col h-full">
                <div class="mt-auto pt-4">
                  <h3 class="font-headline-md text-headline-md text-white mb-2">
                    {{ useCase.title }}
                  </h3>
                  <p class="text-white/80 text-body-md mb-4">
                    {{ useCase.description }}
                  </p>
                  <span
                    class="font-label-caps text-label-caps text-white font-bold text-secondary-fixed-dim uppercase tracking-wider"
                    >{{ useCase.recommendation }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Key Selling Points Strip -->
          <div
            class="bg-industrial-black rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          >
            <div v-for="stat in stats" :key="stat.label">
              <p
                class="font-display-lg text-secondary-container text-lg sm:text-2xl font-bold"
              >
                {{ stat.value }}
              </p>
              <p
                class="text-on-tertiary-container font-data-tabular text-xs sm:text-data-tabular mt-1"
              >
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Catalog -->
      <section
        class="py-12 sm:py-section-gap max-w-7xl mx-auto px-4 sm:px-grid-margin"
        id="catalog"
      >
        <div class="flex justify-between items-end mb-8 sm:mb-12">
          <h2
            class="font-display-lg text-2xl sm:text-3xl md:text-headline-md text-industrial-black"
          >
            Katalog Produk
          </h2>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-grid-gutter"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-surface rounded-xl border border-outline-variant overflow-hidden group hover:technical-shadow transition-all"
          >
            <div
              class="h-64 bg-surface-container-low flex items-center justify-center border-b border-outline-variant"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <Trulink
                  :to="`https://www.trumecs.com/product/${product.id}`"
                  class="font-headline-md text-headline-md text-industrial-black fs-4"
                >
                  {{ product.name }}
                </Trulink>
                <span
                  :class="`${product.badgeColor} font-label-caps text-[10px] px-2 py-1 rounded`"
                  >{{ product.badge }}</span
                >
              </div>
              <p class="text-primary font-bold text-headline-md mb-6">
                {{ product.price }}
              </p>
              <div class="space-y-1 font-data-tabular text-data-tabular">
                <div
                  v-for="spec in product.specs"
                  :key="spec.label"
                  class="flex justify-between border-b border-outline-variant py-2 last:border-0"
                >
                  <span class="text-on-surface-variant">{{ spec.label }}</span>
                  <span class="font-bold text-industrial-black">{{
                    spec.value
                  }}</span>
                </div>
              </div>
              <button
                @click="openModal(product.id)"
                class="w-full mt-6 bg-surface-container-high py-3 font-semibold text-primary rounded border border-primary/10 hover:bg-primary hover:text-orange-400 transition-all"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ============ PRODUCT MODAL ============ -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        <div
          class="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-5 border-b border-outline-variant sticky top-0 bg-white rounded-t-2xl z-10"
          >
            <div class="flex items-center gap-2">
              <span
                :class="`${selectedProduct?.badgeColor} font-label-caps text-[10px] px-2 py-1 rounded uppercase`"
                >{{ selectedProduct?.badge }}</span
              >
              <span class="text-on-surface-variant text-sm font-data-tabular">{{
                selectedProduct?.sku
              }}</span>
            </div>
            <button
              @click="closeModal"
              class="p-2 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span class="material-symbols-outlined text-on-surface-variant"
                >close</span
              >
            </button>
          </div>

          <div v-if="selectedProduct" class="grid grid-cols-1 gap-0">
            <div class="p-6 border-b border-outline-variant">
              <div
                class="bg-surface-container-low rounded-xl flex items-center justify-center h-48 mb-4 overflow-hidden"
              >
                <img
                  :src="selectedProduct.images[0]"
                  :alt="selectedProduct.name"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
              <div class="flex gap-2 justify-center">
                <button
                  v-for="(img, index) in selectedProduct.images"
                  :key="index"
                  @click="modalImageIndex = index"
                  class="w-16 h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-surface-container-low transition-all"
                  :class="
                    modalImageIndex === index
                      ? 'border-primary'
                      : 'border-outline-variant'
                  "
                >
                  <img
                    :src="img"
                    :alt="`Thumbnail ${index + 1}`"
                    class="max-h-full max-w-full object-contain"
                  />
                </button>
              </div>
            </div>

            <div class="p-6">
              <p
                class="font-display-lg text-2xl font-bold text-industrial-black mb-1"
              >
                {{ selectedProduct.name }}
              </p>
              <p class="text-on-surface-variant text-sm mb-4">
                {{ selectedProduct.subtitle }}
              </p>
              <p class="text-primary font-bold text-headline-md mb-6">
                {{ selectedProduct.price }}
              </p>

              <h4
                class="font-semibold text-sm text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Spesifikasi Teknis
              </h4>
              <div class="space-y-1 font-data-tabular text-data-tabular mb-6">
                <div
                  v-for="spec in selectedProduct.specs"
                  :key="spec.label"
                  class="flex justify-between border-b border-outline-variant py-2 last:border-0"
                >
                  <span class="text-on-surface-variant">{{ spec.label }}</span>
                  <span class="font-bold text-industrial-black">{{
                    spec.value
                  }}</span>
                </div>
              </div>

              <div class="mb-6">
                <h4
                  class="font-semibold text-sm text-on-surface-variant uppercase tracking-wider mb-3"
                >
                  Fitur Unggulan
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="cap in selectedProduct.capabilities"
                    :key="cap.title"
                    class="flex gap-3 items-start"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                    >
                      <span
                        class="material-symbols-outlined text-primary text-[18px]"
                        >{{ cap.icon }}</span
                      >
                    </div>
                    <div>
                      <p class="font-semibold text-sm text-industrial-black">
                        {{ cap.title }}
                      </p>
                      <p class="text-xs text-on-surface-variant">
                        {{ cap.desc }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Trulink
                :to="`${selectedProduct.link}`"
                target="_blank"
                class="w-full bg-secondary-container py-3 rounded font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]">chat</span>
                Hubungi Kami
              </Trulink>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// ============ STATE ============
const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const modalOpen = ref(false);
const modalImageIndex = ref(0);
const selectedProductId = ref<string | null>(null);

const useCases = [
  {
    image: "https://migration.trumecs.com/principal/struman/struman-10.png",
    title: "Rumah & Hunian",
    description:
      "Backup listrik saat PLN padam. Cocok diisi dari panel surya di atap untuk menekan tagihan listrik bulanan.",
    recommendation: "Rekomendasi: HS1800 / G24 PRO",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-7.png",
    title: "Outdoor & Camping",
    description:
      "Portable dan mudah dibawa ke lokasi manapun tanpa perlu akses PLN. Isi daya dari panel surya di lapangan.",
    recommendation: "Rekomendasi: HS1800 / HS3600",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-5.png",
    title: "Kantor & Komersial",
    description:
      "Backup daya untuk operasional kantor yang tidak boleh terhenti. Tidak perlu instalasi — plug and play.",
    recommendation: "Rekomendasi: G24 PRO / M50",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-8.png",
    title: "Medis & Klinik",
    description:
      "Pure Sine Wave output menjaga peralatan medis sensitif dari distorsi listrik. Aman untuk alat diagnostik dan monitoring.",
    recommendation: "Rekomendasi: M50 / HS3600",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-9.png",
    title: "Konstruksi & Lapangan",
    description:
      "Pengganti genset berbahan bakar yang berisik dan berbau. Daya besar untuk peralatan kerja berat di lokasi proyek terpencil.",
    recommendation: "Rekomendasi: M50",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-1.png",
    title: "Sistem Energi Surya",
    description:
      "Semua unit mendukung input panel surya (PV). Kembangkan kapasitas G24 PRO + BT30 hingga 17,4 kWh untuk kemandirian energi penuh.",
    recommendation: "Rekomendasi: G24 PRO + BT30",
  },
];

const stats = [
  { value: "3000+", label: "Siklus Pemakaian (+8 Tahun)" },
  { value: "17,4 kWh", label: "Kapasitas Maksimum" },
  { value: "4500 W", label: "Daya Output Tertinggi (M50)" },
  {
    value: "Pure Sine Wave",
    label: "Seperti listrik PLN — Aman Semua Perangkat",
  },
];

const products = [
  {
    id: "4873",
    name: "G24 PRO",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    price: "Rp22.800.000",
    image: "https://migration.trumecs.com/principal/struman/g24pro.PNG",
    specs: [
      { label: "Kapasitas", value: "2048 Wh" },
      { label: "Dimensi", value: "101 x 45 x 3 cm/modul" },
      { label: "Daya Keluar", value: "3000 W" },
      { label: "Berat", value: "25 kg" },
    ],
  },
  {
    id: "4874",
    name: "BT30",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    price: "Rp17.100.000",
    image: "https://migration.trumecs.com/principal/struman/bt30.PNG",
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Dimensi", value: "51 × 35 × 38 cm" },
      { label: "Berat", value: "25 kg" },
      { label: "Kompatibel", value: "G24 PRO" },
    ],
  },
  {
    id: "4875",
    name: "HS1800",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    price: "Rp13.100.000",
    image: "https://migration.trumecs.com/principal/struman/hs1800.PNG",
    specs: [
      { label: "Kapasitas", value: "1536 Wh" },
      { label: "Dimensi", value: "101 x 45 x 3 cm/modul" },
      { label: "Daya Keluar", value: "1800 W" },
      { label: "Berat", value: "16 kg" },
    ],
  },
  {
    id: "4876",
    name: "HS3600",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    price: "Rp30.300.000",
    image: "https://migration.trumecs.com/principal/struman/hs3600.PNG",
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Dimensi", value: "101 x 45 x 3 cm/modul" },
      { label: "Daya Keluar", value: "3600 W" },
      { label: "Berat", value: "37 kg" },
    ],
  },
  {
    id: "4877",
    name: "M50",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    price: "Rp35.600.000",
    image: "https://migration.trumecs.com/principal/struman/m50.PNG",
    specs: [
      { label: "Kapasitas", value: "5120 Wh" },
      { label: "Dimensi", value: "101 x 45 x 3 cm/modul" },
      { label: "Daya Keluar", value: "4500 W" },
      { label: "Berat", value: "64 kg" },
    ],
  },
  {
    id: "4878",
    name: "SSP400",
    badge: "SOLAR PANEL",
    badgeColor: "bg-power-blue-glow text-primary",
    price: "Rp5.100.000",
    image: "https://migration.trumecs.com/principal/struman/SSP400.png",
    specs: [
      { label: "Kapasitas", value: "400 W (4 × 100 W)" },
      { label: "Dimensi", value: "101 × 45 × 3 cm/modul" },
      { label: "Berat", value: "20 kg (4 × 5 kg)" },
      { label: "Kelengkapan", value: "Kabel konektor" },
    ],
  },
  {
    id: "4879",
    name: "SSP800",
    badge: "SOLAR PANEL",
    badgeColor: "bg-power-blue-glow text-primary",
    price: "Rp8.700.000",
    image: "https://migration.trumecs.com/principal/struman/ssp800.PNG",
    specs: [
      { label: "Kapasitas", value: "800 W (8 × 100 W)" },
      { label: "Dimensi", value: "101 × 45 × 3 cm/modul" },
      { label: "Berat", value: "40 kg (8 × 5 kg)" },
      { label: "Kelengkapan", value: "Kabel konektor" },
    ],
  },
];
const phone = "6285176912338";

const productDetails: Record<string, any> = {
  4873: {
    name: "STRUMAN G24 PRO",
    subtitle: "Stasiun Daya yang Dapat Diperluas",
    price: "Rp22.800.000",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    sku: "SKU: STR-G24PRO",
    images: ["https://migration.trumecs.com/principal/struman/g24pro.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN G24 PRO. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "2048 Wh" },
      { label: "Maks. Output", value: "3000 W" },
      { label: "Berat", value: "25 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Input AC", value: "220-240 V~, 50/60 Hz" },
      { label: "Input Solar", value: "12-90 V/30 A, maks. 1400 W" },
      { label: "Dimensi", value: "51 × 35 × 55 cm" },
    ],
    capabilities: [
      {
        icon: "view_in_ar",
        title: "Desain Modular",
        desc: "Mudah dipasang, diperluas, dan dipindahkan dengan unit baterai yang dapat ditumpuk.",
      },
      {
        icon: "bolt",
        title: "Pengisian Cepat",
        desc: "0-100% penuh dalam sekitar 2 jam melalui input AC.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Keamanan kelas industri dengan masa pakai lebih dari 3000 siklus.",
      },
    ],
  },
  4874: {
    name: "STRUMAN BT30",
    subtitle: "Modul Baterai Eksternal",
    price: "Rp17.100.000",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    sku: "SKU: STR-BT30",
    images: ["https://migration.trumecs.com/principal/struman/bt30.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN BT30. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Berat", value: "25 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Dimensi", value: "51 × 35 × 38 cm" },
      { label: "Kompatibel Dengan", value: "G24 PRO" },
    ],
    capabilities: [
      {
        icon: "view_in_ar",
        title: "Ekspansi Modular",
        desc: "Sambungkan ke G24 PRO untuk kapasitas hingga 17,4 kWh.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Siklus baterai lebih dari 3000 kali untuk keandalan jangka panjang.",
      },
    ],
  },
  4875: {
    name: "STRUMAN HS1800",
    subtitle: "Stasiun Daya Portabel",
    price: "Rp13.100.000",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    sku: "SKU: STR-HS1800",
    images: ["https://migration.trumecs.com/principal/struman/hs1800.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN HS1800. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "1536 Wh" },
      { label: "Maks. Output", value: "1800 W" },
      { label: "Berat", value: "16 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Jenis Output", value: "Pure Sine Wave" },
    ],
    capabilities: [
      {
        icon: "directions_walk",
        title: "Portabel & Ringan",
        desc: "Handle ergonomis untuk kemudahan mobilitas ke mana saja.",
      },
      {
        icon: "bolt",
        title: "Pengisian Cepat",
        desc: "Pengisian cepat via AC dan panel surya.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Aman dan tahan lama dengan lebih dari 3000 siklus.",
      },
    ],
  },
  4876: {
    name: "STRUMAN HS3600",
    subtitle: "Stasiun Daya Tinggi",
    price: "Rp30.300.000",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    sku: "SKU: STR-HS3600",
    images: ["https://migration.trumecs.com/principal/struman/hs3600.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN HS3600. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Maks. Output", value: "3600 W" },
      { label: "Berat", value: "37 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Jenis Output", value: "Pure Sine Wave" },
    ],
    capabilities: [
      {
        icon: "power",
        title: "Output Daya Tinggi",
        desc: "3600 W output untuk peralatan berdaya tinggi sekalipun.",
      },
      {
        icon: "bolt",
        title: "Pengisian Cepat",
        desc: "Pengisian cepat untuk waktu henti yang minimal.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Siklus baterai tinggi untuk keandalan tingkat industri.",
      },
    ],
  },
  4877: {
    name: "STRUMAN M50",
    subtitle: "Unit Daya Industri Bergerak",
    price: "Rp35.600.000",
    badge: "BATERAI",
    badgeColor: "bg-status-success/10 text-status-success",
    sku: "SKU: STR-M50",
    images: ["https://migration.trumecs.com/principal/struman/m50.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN M50. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "5120 Wh" },
      { label: "Maks. Output", value: "4500 W" },
      { label: "Berat", value: "64 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Jenis Output", value: "Pure Sine Wave" },
    ],
    capabilities: [
      {
        icon: "airport_shuttle",
        title: "Mudah Dipindahkan",
        desc: "Roda besar dan handle teleskopik untuk mobilitas yang mudah.",
      },
      {
        icon: "power",
        title: "Output Terbesar",
        desc: "4500 W — cocok untuk peralatan berat di lokasi proyek.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Keandalan industri dengan masa pakai baterai yang sangat panjang.",
      },
    ],
  },
  4878: {
    name: "STRUMAN SSP400",
    subtitle: "Paket Panel Surya (4 × 100W)",
    price: "Rp5.100.000",
    badge: "SOLAR PANEL",
    badgeColor: "bg-power-blue-glow text-primary",
    sku: "SKU: STR-SSP400",
    images: ["https://migration.trumecs.com/principal/struman/SSP400.png"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN SSP400. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "400 W (4 × 100 W)" },
      { label: "Dimensi", value: "101 × 45 × 3 cm/modul" },
      { label: "Berat", value: "20 kg (4 × 5 kg)" },
      { label: "Berat Per Modul", value: "5 kg" },
      { label: "Kelengkapan", value: "Kabel Konektor" },
    ],
    capabilities: [
      {
        icon: "wb_sunny",
        title: "Pengisian Tenaga Surya",
        desc: "Isi daya perangkat STRUMAN langsung dari sinar matahari.",
      },
      {
        icon: "view_in_ar",
        title: "Modular",
        desc: "Setiap modul 100 W — bisa digunakan satuan atau dikombinasikan.",
      },
      {
        icon: "directions_walk",
        title: "Portabel",
        desc: "Ringan dan mudah dibawa ke lokasi outdoor maupun lapangan.",
      },
    ],
  },
  4879: {
    name: "STRUMAN SSP800",
    subtitle: "Paket Panel Surya (8 × 100W)",
    price: "Rp8.700.000",
    badge: "SOLAR PANEL",
    badgeColor: "bg-power-blue-glow text-primary",
    sku: "SKU: STR-SSP800",
    images: ["https://migration.trumecs.com/principal/struman/ssp800.PNG"],
    link: `https://wa.me/${phone}?text=${encodeURIComponent("Hi Trumecs, saya tertarik dengan STRUMAN SSP800. Apakah barang ini tersedia?")}`,
    specs: [
      { label: "Kapasitas", value: "800 W (8 × 100 W)" },
      { label: "Dimensi", value: "101 × 45 × 3 cm/modul" },
      { label: "Berat", value: "40 kg (8 × 5 kg)" },
      { label: "Berat Per Modul", value: "5 kg" },
      { label: "Kelengkapan", value: "Kabel Konektor" },
    ],
    capabilities: [
      {
        icon: "wb_sunny",
        title: "Daya Surya Besar",
        desc: "800 W untuk pengisian lebih cepat pada unit berkapasitas besar.",
      },
      {
        icon: "view_in_ar",
        title: "Modular",
        desc: "8 modul 100 W yang bisa diatur sesuai kebutuhan instalasi.",
      },
      {
        icon: "eco",
        title: "Energi Bersih",
        desc: "Kurangi ketergantungan PLN dengan sistem tenaga surya mandiri.",
      },
    ],
  },
};

// ============ COMPUTED ============
const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null;
  return productDetails[selectedProductId.value] || null;
});

// ============ METHODS ============
const openModal = (productId: string) => {
  selectedProductId.value = productId;
  modalImageIndex.value = 0;
  modalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modalOpen.value = false;
  document.body.style.overflow = "";
};

// ============ KEYBOARD ============
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

// ============ SEO ============
useHead({
  title: "STRUMAN | Solusi Daya Industri - TRUMECS",
  meta: [
    {
      name: "description",
      content:
        "Keandalan tanpa kompromi untuk garda terdepan industri. Menyediakan pembangkit listrik portabel dan panel surya yang direkayasa dengan presisi.",
    },
  ],
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Hanken+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      rel: "stylesheet",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      rel: "stylesheet",
    },
  ],
});
</script>

<style scoped>
.industrial-grid-bg {
  background-image: radial-gradient(#dee2e6 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.technical-shadow {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

/* Smooth transition untuk semua elemen */
* {
  transition-property:
    background-color, border-color, color, fill, stroke, opacity, box-shadow,
    transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
