<template>
  <div class="min-h-screen bg-surface font-body-md text-on-surface">
    <!-- ============ HERO SECTION ============ -->
    <section
      class="relative pt-safe-top min-h-[60dvh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-800"
    >
      <!-- Background Image dengan efek lebih baik -->
      <div class="absolute inset-0 z-0">
        <div
          class="w-full h-full bg-cover bg-center bg-no-repeat"
          :style="{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBeTRnZrdiqij9vDG_CRXkKQDK11a2Rhu-c_uxBUZXQLn4IJSiJOfAkXmWAX1pR2GdG4JTWFC6NaYklvLs2HpJiScidi1DoRAuAWKZD7Z5y7YjpCsACspcGb8YvBSEANSpKnSbnzQRYTFwDGPlbHFI7Et7cwkGgR6se2hGhDewuFx_tVK5w8evHqLupABx4SOjQbHppr0rawsl063G02C7P4WMB4VncqeqXScybateHPvueYebRv2BY7A')`,
          }"
        ></div>
        <!-- Overlay gradient lebih baik -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40"
        ></div>
        <!-- Overlay pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
          ></div>
        </div>
      </div>

      <!-- Konten -->
      <div class="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8">
        <div
          class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 md:py-16"
        >
          <!-- Left Content -->
          <div class="max-w-3xl">
            <!-- Badge -->
            <div
              class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <span
                class="w-2 h-2 rounded-full bg-green-400 animate-pulse"
              ></span>
              <span
                class="text-xs font-semibold uppercase tracking-wider text-white/90"
                >Ready Stock • Garansi</span
              >
            </div>

            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Suku Cadang Alat Berat
              <span class="text-orange-400">Copotan Berkualitas</span>
              & Bergaransi
            </h1>

            <p
              class="text-lg md:text-xl text-gray-200/90 mb-8 max-w-2xl leading-relaxed"
            >
              Solusi hemat dan andal untuk kebutuhan sparepart alat berat Anda.
              Original & OEM, diinspeksi ketat, dan siap pakai.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <ElButton
                type="primary"
                size="large"
                class="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !px-8 !py-4 !rounded-xl !font-semibold !shadow-lg hover:!shadow-xl transition-all !text-base"
                @click="scrollTo('featured')"
              >
                <Icon name="mdi:view-grid" class="text-xl mr-2" />
                Lihat Katalog
              </ElButton>

              <ElButton
                size="large"
                class="!bg-white/10 !border-2 !border-white/30 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-xl !font-semibold !backdrop-blur-sm transition-all !text-base"
                @click="scrollTo('contactLocations')"
              >
                <Icon name="mdi:whatsapp" class="text-xl mr-2" />
                Hubungi Sales
              </ElButton>
            </div>
          </div>

          <!-- Right Content - Image / Visual -->
          <div class="hidden lg:flex justify-center items-center relative">
            <!-- Decorative circle -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl"
              ></div>
            </div>

            <!-- Main Image -->
            <div class="relative z-10 w-full max-w-md">
              <div
                class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeTRnZrdiqij9vDG_CRXkKQDK11a2Rhu-c_uxBUZXQLn4IJSiJOfAkXmWAX1pR2GdG4JTWFC6NaYklvLs2HpJiScidi1DoRAuAWKZD7Z5y7YjpCsACspcGb8YvBSEANSpKnSbnzQRYTFwDGPlbHFI7Et7cwkGgR6se2hGhDewuFx_tVK5w8evHqLupABx4SOjQbHppr0rawsl063G02C7P4WMB4VncqeqXScybateHPvueYebRv2BY7A"
                  alt="Suku Cadang Alat Berat"
                  class="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <!-- Gradient overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ABOUT SPARE PARTS ============ -->
    <section class="py-12 md:py-6 bg-surface" id="about">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-primary mb-3">
            Memahami Sparepart Copotan Kami
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan suku cadang bekas berkualitas tinggi yang berfokus
            pada keaslian dan keandalan untuk memastikan performa optimal pada
            alat berat Anda.
          </p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <div
            v-for="item in aboutItems"
            :key="item.title"
            class="bg-white p-5 rounded-lg shadow-sm border border-gray-200/10 text-center"
          >
            <Icon
              :name="item.icon"
              class="text-4xl text-secondary-container mb-3"
            />
            <h3 class="text-xl font-bold text-primary mb-2">
              {{ item.title }}
            </h3>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CATEGORIES ============ -->
    <!-- <section class="py-12 md:py-16 bg-surface" id="categories">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <h2 class="text-3xl font-bold text-primary mb-8 text-center">
          Kategori Suku Cadang
        </h2>
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          <a
            v-for="category in categories"
            :key="category.name"
            class="group block p-4 bg-white rounded-lg border border-gray-200/10 hover:border-secondary-container transition-all text-center cursor-pointer"
            href="#"
          >
            <Icon
              :name="category.icon"
              class="text-3xl text-primary group-hover:text-secondary-container mb-2"
            />
            <h3 class="font-semibold text-primary">{{ category.name }}</h3>
          </a>
        </div>
      </div>
    </section> -->

    <!-- ============ FEATURED PARTS ============ -->
    <section class="py-12 md:py-6 bg-surface-container-lowest" id="featured">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold text-primary mb-2">
              Sparepart Pilihan
            </h2>
            <p class="text-gray-600">
              Koleksi part copotan dengan kondisi terbaik saat ini.
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <Trulink
            v-for="part in featuredParts"
            :key="part.name"
            href="https://www.trumecs.com/c/Sparepart/query?q=on&nama="
            target="_blank"
            class="bg-white rounded-lg border border-gray-200/10 overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div class="h-48 bg-gray-100 relative">
              <div
                class="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded font-bold"
              >
                {{ part.type }}
              </div>
              <div
                class="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold"
              >
                {{ part.status }}
              </div>
              <div class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:image" class="text-4xl text-gray-300" />
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold text-primary mb-1">
                {{ part.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Kondisi: {{ part.condition }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section
      class="py-12 md:py-6 bg-surface-container-lowest border-b border-gray-200/10"
      id="brands"
    >
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
        <h2
          class="text-xl font-semibold text-gray-600 mb-4 uppercase tracking-wider"
        >
          Merek yang Kami Dukung
        </h2>
        <div class="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <span
            v-for="brand in brands"
            :key="brand"
            class="text-2xl md:text-3xl font-bold text-primary/70 uppercase tracking-widest"
          >
            {{ brand }}
          </span>
        </div>
      </div>
    </section>

    <section class="py-12 md:py-6" id="buying-options">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8">Pilihan Pembelian Fleksibel</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            v-for="option in buyingOptions"
            :key="option.title"
            class="bg-white/5 hover:bg-white/10 transition-colors p-6 rounded-xl backdrop-blur-sm border border-white/10 text-left"
          >
            <Icon
              :name="option.icon"
              class="text-5xl text-secondary-fixed-dim mb-4"
            />
            <h3 class="text-2xl font-bold mb-2">{{ option.title }}</h3>
            <p class="">{{ option.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- ============ LOCATION ============ -->
    <section
      class="py-4 md:py-6 bg-surface border-t border-gray-200/10 flex items-center"
      id="contactLocations"
    >
      <div class="max-w-[1440px] mx-auto px-4 md:px-8">
        <div class="max-w-2xl mx-auto text-center">
          <Icon
            name="mdi:phone"
            class="text-5xl text-secondary-container mb-3"
          />
          <h2 class="text-3xl font-bold mb-4">Ada Kebutuhan Sparepart?</h2>
          <p class="text-gray-500 mb-8">
            Hubungi tim sales kami untuk konsultasi dan penawaran terbaik.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <ElButton
              type="success"
              size="large"
              class="!bg-secondary-container !border-secondary-container hover:!bg-secondary !text-white !px-8 !py-3 !rounded !font-semibold"
              @click="handleContact"
            >
              <Icon name="mdi:whatsapp" class="text-xl mr-2" />
              Chat WhatsApp
            </ElButton>
            <ElButton
              type="warning"
              size="large"
              class="!bg-warning !border !border-white !text-white hover:!bg-warning !px-8 !py-3 !rounded !font-semibold"
              @click="handleEmail"
            >
              <Icon name="mdi:email" class="text-xl mr-2" />
              Email Inquiry
            </ElButton>
          </div>
        </div>
      </div>
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
        <Icon name="mdi:city" class="text-5xl text-secondary-container mb-3" />
        <h2 class="text-3xl font-bold text-primary mb-3">
          Lokasi & Area Layanan Utama
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto mb-6">
          Kami berlokasi strategis untuk melayani kebutuhan industri berat di
          area berikut dengan cepat dan tanggap.
        </p>
        <div class="flex flex-wrap justify-center gap-3 md:gap-4">
          <div
            v-for="location in locations"
            :key="location"
            class="bg-white border border-gray-200/10 px-6 py-3 rounded-full shadow-sm flex items-center gap-2"
          >
            <Icon name="mdi:map-marker" class="text-secondary text-xl" />
            <span class="font-semibold text-primary text-lg">{{
              location
            }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

// ============ DATA ============
const aboutItems = [
  {
    icon: "mdi:verified",
    title: "Sparepart Original",
    description:
      "Suku cadang asli bawaan pabrik (Genuine), copotan langsung dari unit alat berat dengan kondisi prima.",
  },
  {
    icon: "material-symbols:build-circle-outline",
    title: "Sparepart OEM",
    description:
      "Original Equipment Manufacturer. Diproduksi dengan spesifikasi yang persis sama dengan part original.",
  },
  {
    icon: "material-symbols:fact-check-outline",
    title: "Inspeksi Ketat",
    description:
      "Setiap part melewati proses pengecekan kualitas menyeluruh sebelum dijual.",
  },
  {
    icon: "material-symbols:inventory-2-outline-rounded",
    title: "Ready Stock",
    description:
      "Ketersediaan barang yang tinggi untuk meminimalkan downtime alat berat Anda.",
  },
];

const buyingOptions = [
  {
    icon: "mdi:package-variant",
    title: "Beli Secara Bundle",
    description:
      "Pembelian paket lengkap untuk perbaikan menyeluruh atau overhaul. Lebih praktis, hemat biaya, dan menjamin kompatibilitas antar komponen secara optimal.",
  },
  {
    icon: "mdi:widgets",
    title: "Beli Secara Satuan",
    description:
      "Pembelian individual untuk part spesifik yang dibutuhkan. Solusi tepat sasaran untuk mengganti komponen tertentu yang mengalami kerusakan.",
  },
];

const brands = ["Komatsu", "Doosan", "Scania", "Howo", "MAN", "CAMC"];

const categories = [
  { name: "Engine Parts", icon: "mdi:engine" },
  { name: "Hydraulic System", icon: "mdi:water-pump" },
  { name: "Transmission", icon: "mdi:settings" },
  { name: "Final Drive", icon: "mdi:tire" },
  { name: "Swing Motor", icon: "mdi:sync" },
  { name: "Travel Motor", icon: "mdi:car" },
  { name: "Undercarriage", icon: "mdi:construction" },
  { name: "Electrical", icon: "mdi:bolt" },
  { name: "Cooling System", icon: "mdi:snowflake" },
  { name: "Fuel System", icon: "mdi:gas-station" },
  { name: "Cabin & Interior", icon: "mdi:seat" },
  { name: "Attachments", icon: "mdi:precision-manufacturing" },
];

const featuredParts = [
  {
    name: "Engine Block",
    type: "OEM / Original",
    status: "Tersedia",
    condition: "Inspected & Ready",
  },
  {
    name: "Control Valve",
    type: "OEM / Original",
    status: "Tersedia",
    condition: "Inspected & Ready",
  },
  {
    name: "Tapper Roller Bearing",
    type: "OEM / Original",
    status: "Tersedia",
    condition: "Inspected & Ready",
  },
  {
    name: "Crankshaft Lower Bearing",
    type: "OEM / Original",
    status: "Tersedia",
    condition: "Inspected & Ready",
  },
];

const locations = ["Jakarta", "Bekasi", "Cikarang", "Tangerang"];

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const openPartDetail = (part: any) => {
  ElMessage.info(`Detail: ${part.name} - ${part.condition}`);
};

const handleContact = () => {
  window.open(
    "https://wa.me/6285176912338?text=Halo%20Trumecs%2C%20saya%20tertarik%20dengan%20sparepart%20copotan%20Anda.",
    "_blank"
  );
};

const handleEmail = () => {
  window.location.href =
    "mailto:info@trumecs.com?subject=Sparepart%20Copotan%20Inquiry";
};

// ============ SEO ============
useHead({
  title: "Suku Cadang Alat Berat Copotan",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    { name: "description", content: "Solusi hemat dan andal untuk kebutuhan sparepart alat berat Anda. Original & OEM, diinspeksi ketat, dan siap pakai." },
    { property: "og:title", content: "Suku Cadang Alat Berat Copotan | Trumecs.com" },
    { property: "og:description", content: "Solusi hemat dan andal untuk kebutuhan sparepart alat berat Anda. Original & OEM, diinspeksi ketat, dan siap pakai." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "canonical", href: "https://www.trumecs.com/principal/usedsparepart" },
  ],
});
</script>

<style scoped>
/* Override Element Plus button styles */
:deep(.el-button) {
  font-weight: 600 !important;
}

:deep(.el-button.is-disabled) {
  opacity: 0.5;
}

/* Smooth transitions */
.group {
  transition: all 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #fa8420;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e0751d;
}
</style>
