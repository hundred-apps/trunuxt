<template>
  <div class="min-h-screen bg-background font-body-md text-on-surface">
    <!-- 1. Hero Section -->
    <section
      class="relative min-h-[90dvh] flex items-center justify-center overflow-hidden"
    >
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <div
          class="bg-cover bg-center w-full h-full"
          :style="{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuARdKjmt1GsJqLX36SI3POXwA2GT6XW60m0U_y73R4f3ofMEgWPUaBAgKYQ6iuAgW7WdnlOiseqWHy9dfmrmR75n42eXXW87-zBpJT3zGZ5G9OZJX3CvIyXNWE2qCokbR0LV_unkm-8JYD1UXnih8WN_fJw5ZMCqhjhkE-Co4PifaVKVaOOt8vGSSFAYtpCmBQwR8RCbWwgm4YQaxcW_0Q1q9b1HBbwrX8FYax1rBmBhfvFhBa56O2X')`,
          }"
        ></div>

        <div class="absolute inset-0 bg-black/60"></div>

        <div
          class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
        ></div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
        ></div>
      </div>

      <!-- Konten -->
      <div
        class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left pt-20"
      >
        <div class="max-w-3xl mx-auto md:mx-0">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6"
          >
            <span
              class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"
            ></span>
            <span class="font-mono text-xs tracking-wider font-semibold"
              >{{ t('page.principal.machining.hero.badge') }}</span
            >
          </div>

          <h1
            class="font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            {{ t('page.principal.machining.hero.titleLine1') }}
            <span class="text-orange-400">{{ t('page.principal.machining.hero.titleLine2') }}</span>
          </h1>

          <p
            class="text-lg md:text-xl text-gray-200/90 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed"
          >
            {{ t('page.principal.machining.hero.subtitle') }}
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start"
          >
            <ElButton
              type="primary"
              size="large"
              class="w-full sm:w-auto !bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !px-8 !py-4 !rounded-lg !font-semibold !shadow-lg hover:!shadow-xl transition-all"
              @click="scrollTo('contactLocations')"
            >
              {{ t('page.principal.machining.hero.ctaQuote') }}
              <Icon name="mdi:arrow-right" class="text-lg ml-1" />
            </ElButton>

            <ElButton
              size="large"
              class="w-full sm:w-auto !bg-white/10 !border-2 !border-white/40 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-lg !font-semibold !backdrop-blur-sm transition-all"
              @click="scrollTo('services')"
            >
              {{ t('page.principal.machining.hero.ctaServices') }}
            </ElButton>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block"
      >
        <a
          @click.prevent="scrollTo('aboutMachining')"
          class="text-white/50 hover:text-white/80 transition-colors cursor-pointer flex flex-col items-center gap-1"
        >
          <span class="text-[10px] uppercase tracking-widest">Scroll</span>
          <Icon name="mdi:chevron-double-down" class="text-2xl" />
        </a>
      </div>
    </section>

    <!-- 2. About Machining Section -->
    <section class="py-6 bg-surface relative overflow-hidden" id="aboutMachining">
      <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
                >{{ t('page.principal.machining.aboutMachining.sectionLabel') }}</span
              >
            </div>

            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
            >
              {{ t('page.principal.machining.aboutMachining.title') }}
            </h2>

            <p class="text-gray-600 mb-8 leading-relaxed">
              {{ t('page.principal.machining.aboutMachining.description') }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="(item, index) in aboutMachiningHighlights"
                :key="index"
                class="flex items-start gap-4"
              >
                <div
                  class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"
                >
                  <Icon :name="item.icon" class="text-orange-500 text-2xl" />
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="absolute -inset-4 bg-gray-100 rounded-2xl transform rotate-3 z-0 opacity-50"
            ></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqRoCAqyU-Vv0JveUI0ickT1MrOJQFHcYtQrJZDGym22rCLAO7HI7GovKB9AIu2UEVQqx0CJqPX7uz87gqu3blDtBnX56FH3Kq0B5N9r2JdNzihBXIkZKNthLDmWcWxlBekkz2DO-zVlvbQzyi7OxPVuWGQQzjulaA_LPP6sfEXMsoI1Gs0eCg-_aD8PDun1NZdIIL-ppS6fwQg1CuxpJVoAfK5n9lN4HgCRWms5kAj1ILQOtP5BF5"
              alt="Machining Excellence"
              class="relative z-10 w-full h-auto rounded-xl shadow-lg object-cover border border-gray-200/30 aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. About Fabrication Section -->
    <section class="py-6 bg-gray-50 relative overflow-hidden" id="aboutFabrikasi">
      <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative order-2 lg:order-1">
            <div
              class="absolute -inset-4 bg-gray-100 rounded-2xl transform -rotate-3 z-0 opacity-50"
            ></div>
            <div
              class="relative z-10 w-full h-auto rounded-xl shadow-lg border border-gray-200/30 aspect-[4/3] bg-gradient-to-br from-orange-50 to-gray-100 flex items-center justify-center"
            >
              <Icon name="mdi:factory" class="text-orange-500 text-8xl opacity-30" />
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
                >{{ t('page.principal.machining.aboutFabrikasi.sectionLabel') }}</span
              >
            </div>

            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
            >
              {{ t('page.principal.machining.aboutFabrikasi.title') }}
            </h2>

            <p class="text-gray-600 mb-8 leading-relaxed">
              {{ t('page.principal.machining.aboutFabrikasi.description') }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="(item, index) in aboutFabrikasiHighlights"
                :key="index"
                class="flex items-start gap-4"
              >
                <div
                  class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"
                >
                  <Icon :name="item.icon" class="text-orange-500 text-2xl" />
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Methods Section -->
    <section class="py-4 bg-gray-50" id="methods">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t('page.principal.machining.methods.sectionLabel') }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {{ t('page.principal.machining.methods.title') }}
          </h2>
          <p class="text-gray-600">
            {{ t('page.principal.machining.methods.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(method, index) in methods"
            :key="index"
            class="bg-white rounded-xl p-8 border border-gray-200/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gray-100 group-hover:bg-orange-500 transition-colors flex items-center justify-center mb-6"
            >
              <Icon
                :name="method.icon"
                class="text-orange-500 group-hover:text-white transition-colors text-3xl"
              />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">
              {{ method.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-4 flex-grow">
              {{ method.description }}
            </p>
            <ul class="space-y-1">
              <li
                v-for="(feature, fIndex) in method.features"
                :key="fIndex"
                class="flex items-center gap-2 text-xs text-gray-500"
              >
                <Icon name="mdi:check-circle" class="text-orange-400 text-sm shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Products Section -->
    <section class="py-6 bg-surface" id="products">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div
          class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
                >{{ t('page.principal.machining.products.sectionLabel') }}</span
              >
            </div>
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary max-w-xl"
            >
              {{ t('page.principal.machining.products.title') }}
            </h2>
          </div>
          <p class="text-gray-600 max-w-xl">
            {{ t('page.principal.machining.products.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="bg-white rounded-xl p-8 border border-gray-200/30 shadow-sm flex flex-col items-center text-center hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors flex items-center justify-center mb-6"
            >
              <Icon
                :name="product.icon"
                class="text-orange-500 text-3xl"
              />
            </div>
            <h3 class="text-lg font-bold text-primary mb-2">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Materials Section -->
    <section class="py-4 bg-gray-50 border-t border-gray-200/20" id="materials">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t('page.principal.machining.materials.sectionLabel') }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {{ t('page.principal.machining.materials.title') }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ t('page.principal.machining.materials.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(material, index) in materials"
            :key="index"
            class="bg-white p-8 rounded-xl border border-gray-200/30 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div
              class="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4"
            >
              <Icon :name="material.icon" class="text-orange-500 text-3xl" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">
              {{ material.name }}
            </h3>
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <span
                v-for="(grade, gIndex) in material.grades"
                :key="gIndex"
                class="px-3 py-1 bg-gray-100 text-primary text-xs font-semibold rounded-full"
              >
                {{ grade }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              {{ material.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Contact & Locations Section -->
    <section
      class="max-w-7xl mx-auto px-4 md:px-8 relative z-10 py-6"
      id="contactLocations"
    >
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {{ t('page.principal.machining.contact.title') }}
      </h2>
      <div class="flex items-center">
        <div class="max-w-[1440px] mx-auto px-4 md:px-8">
          <div class="max-w-2xl mx-auto text-center">
            <Icon
              name="mdi:phone"
              class="text-5xl text-secondary-container mb-3"
            />
            <h2 class="text-3xl font-bold mb-4">{{ t('page.principal.machining.contact.needTitle') }}</h2>
            <p class="text-gray-500 mb-8">
              {{ t('page.principal.machining.contact.needDesc') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <ElButton
                type="success"
                size="large"
                class="!bg-secondary-container !border-secondary-container hover:!bg-secondary !text-white !px-8 !py-3 !rounded !font-semibold"
                @click="handleContact"
              >
                <Icon name="mdi:whatsapp" class="text-xl mr-2" />
                {{ t('page.principal.machining.contact.whatsapp') }}
              </ElButton>
              <ElButton
                type="warning"
                size="large"
                class="!bg-warning !border !border-white !text-white hover:!bg-warning !px-8 !py-3 !rounded !font-semibold"
                @click="handleEmail"
              >
                <Icon name="mdi:email" class="text-xl mr-2" />
                {{ t('page.principal.machining.contact.email') }}
              </ElButton>
            </div>
          </div>
        </div>
        <div class="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
          <Icon
            name="mdi:city"
            class="text-5xl text-secondary-container mb-3"
          />
          <h2 class="text-3xl font-bold text-primary mb-3">
            {{ t('page.principal.machining.contact.locationTitle') }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto mb-6">
            {{ t('page.principal.machining.contact.locationDesc') }}
          </p>
          <div class="flex flex-wrap justify-center gap-3 md:gap-4">
            <div
              v-for="(location, index) in locations"
              :key="index"
              class="bg-white border border-gray-200/10 px-6 py-3 rounded-full shadow-sm flex items-center gap-2"
            >
              <Icon name="mdi:map-marker" class="text-secondary text-xl" />
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
const { t } = useI18n();

const aboutMachiningHighlights = [
  { title: "CNC Machining", icon: "mdi:cpu-64-bit", description: "Computer Numerical Control memungkinkan presisi tinggi dan reproduktifitas yang konsisten." },
  { title: "Toleransi Presisi", icon: "mdi:tune-variant", description: "Mencapai toleransi hingga ±0.001mm untuk aplikasi kritis." },
  { title: "Multi-Axis Capability", icon: "mdi:axis-arrow", description: "Mesin 3-axis hingga 5-axis untuk geometri kompleks." },
  { title: "Quality Control", icon: "mdi:shield-check", description: "Inspeksi CMM dan dokumentasi ketat di setiap tahap." }
];

const aboutFabrikasiHighlights = [
  { title: "Cutting & Shaping", icon: "mdi:content-cut", description: "Pemotongan presisi menggunakan laser, plasma, atau waterjet." },
  { title: "Welding & Joining", icon: "mdi:fire", description: "Pengelasan MIG, TIG, dan SMAW untuk struktur kokoh." },
  { title: "Bending & Forming", icon: "mdi:arrow-decline", description: "Pembengkokan dan pembentukan plat serta profil baja." },
  { title: "Assembly", icon: "mdi:puzzle-check", description: "Perakitan komponen menjadi produk akhir yang siap install." }
];

const methods = [
  { title: "Milling", icon: "mdi:milling", description: "Proses pemotongan menggunakan frais berputar untuk menghasilkan permukaan datar, slot, dan geometri kompleks pada benda kerja.", features: ["3-axis hingga 5-axis", "Permukaan datar & kontur", "Slot & keyway", "Toleransi ±0.01mm"] },
  { title: "Turning", icon: "mdi:rotate-3d-variant", description: "Proses pembubutan untuk membuat komponen silindris dengan presisi tinggi menggunakan pahat statis pada benda kerja yang berputar.", features: ["Shaft & axle", "Bushing & bearing", "Thread & ulir", "Toleransi ±0.005mm"] },
  { title: "Grinding", icon: "mdi:blur", description: "Proses penghalusan permukaan menggunakan batu gerinda untuk mencapai kekasaran permukaan dan dimensi akhir yang sangat presisi.", features: ["Surface grinding", "Cylindrical grinding", "Surface finish Ra 0.4μm", "Flatness < 0.005mm"] },
  { title: "Cutting", icon: "mdi:content-cut", description: "Proses pemotongan material menggunakan berbagai metode untuk mendapatkan ukuran dan bentuk yang diinginkan.", features: ["Band saw cutting", "Wire EDM", "Laser cutting", "Waterjet cutting"] }
];

const products = [
  { name: "Gear", description: "Roda gigi presisi untuk transmisi daya mesin dan perangkat mekanis lainnya.", icon: "mdi:cog" },
  { name: "Shaft", description: "Poros mesin dengan toleransi ketat untuk transmisi rotasi dan beban.", icon: "mdi:minus-thick" },
  { name: "Roller", description: "Silinder penggulung untuk conveyor, printing, dan aplikasi industri lainnya.", icon: "mdi:circle-slice8" },
  { name: "Pulley", description: "Roda katrol untuk sistem transmisi belt dan power transmission.", icon: "mdi:record-circle-outline" },
  { name: "Chain", description: "Rantai transmisi daya untuk mesin industri dan otomotif.", icon: "mdi:chain" },
  { name: "Bolt, Nut & Washer", description: "Mur, baut, dan ring presisi untuk perakitan dan struktur.", icon: "mdi:screw-flat-top" }
];

const materials = [
  { name: "Stainless Steel", icon: "mdi:silverware-fork-knife", grades: ["SS304", "SS316"], description: "Tahan karat, cocok untuk aplikasi food grade, kimia, dan medis." },
  { name: "Alloy Steel", icon: "mdi:factory", grades: ["SCM440", "SNCM439"], description: "Kekuatan tinggi untuk komponen mesin berat dan transmisi." },
  { name: "Carbon Steel", icon: "mdi:steel", grades: ["S45C", "ST41"], description: "Umum digunakan untuk shaft, gear, dan komponen struktural." }
];

const locations = ["Jakarta", "Bekasi", "Cikarang", "Tangerang"];

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleContact = () => {
  window.open(
    "https://wa.me/6285176912338?text=Halo%20Trumecs%2C%20saya%20tertarik%20dengan%20machining%20dan%20fabrikasi%20Anda.",
    "_blank"
  );
};

const handleEmail = () => {
  window.location.href =
    "mailto:info@trumecs.com?subject=Machining%20dan%20Fabrication%20Inquiry";
};

// ============ SEO ============
useHead({
  title: t('page.principal.machining.seo.title'),
  titleTemplate: "%s | Trumecs.com",
  meta: [
    { name: "description", content: t('page.principal.machining.seo.description') },
    { property: "og:title", content: t('page.principal.machining.seo.title') },
    { property: "og:description", content: t('page.principal.machining.seo.description') },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "canonical", href: "https://www.trumecs.com/principal/machining" },
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

/* Form styles */
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}

:deep(.el-form-item .el-form-item__label) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  padding-bottom: 4px !important;
}

:deep(.el-input__wrapper) {
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px #e5e7eb inset !important;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #fa8420 inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #fa8420 inset !important;
}

:deep(.el-textarea__inner) {
  border-radius: 8px !important;
  border-color: #e5e7eb !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #fa8420 !important;
  box-shadow: 0 0 0 2px rgba(250, 132, 32, 0.2) !important;
}
</style>
