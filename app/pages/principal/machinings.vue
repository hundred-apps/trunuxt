<template>
  <div class="min-h-screen bg-background font-body-md text-on-surface">
    <!-- 1. Hero Section -->
    <section
      class="relative min-h-[90dvh] flex items-center justify-center overflow-hidden"
    >
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
            <span class="font-mono text-xs tracking-wider font-semibold">
              {{ t("page.principal.machining.hero.badge") }}
            </span>
          </div>

          <h1
            class="font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            {{ t("page.principal.machining.hero.titleLine1") }}
            <span class="text-orange-400">{{
              t("page.principal.machining.hero.titleLine2")
            }}</span>
          </h1>

          <p
            class="text-lg md:text-xl text-gray-200/90 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed"
          >
            {{ t("page.principal.machining.hero.subtitle") }}
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
              {{ t("page.principal.machining.hero.ctaQuote") }}
              <Icon name="mdi:arrow-right" class="text-lg ml-1" />
            </ElButton>

            <ElButton
              size="large"
              class="w-full sm:w-auto !bg-white/10 !border-2 !border-white/40 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-lg !font-semibold !backdrop-blur-sm transition-all"
              @click="scrollTo('services')"
            >
              {{ t("page.principal.machining.hero.ctaServices") }}
            </ElButton>
          </div>
        </div>
      </div>

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
    <section
      class="py-6 bg-surface relative overflow-hidden"
      id="aboutMachining"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >
                {{ t("page.principal.machining.aboutMachining.sectionLabel") }}
              </span>
            </div>

            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
            >
              {{ t("page.principal.machining.aboutMachining.title") }}
            </h2>

            <p class="text-gray-600 mb-8 leading-relaxed">
              {{ t("page.principal.machining.aboutMachining.description") }}
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

    <!-- 3. Industries We Serve Section (BARU) -->
    <section class="py-12 bg-white" id="industries">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-4">
            {{
              t("page.principal.machining.industries.title") ||
              "Industries We Serve"
            }}
          </h2>
          <div class="w-16 h-1 bg-orange-500"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="(industry, index) in industries"
            :key="index"
            class="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer"
          >
            <img
              :src="industry.image"
              :alt="industry.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white font-bold text-sm md:text-base text-center">
                {{ industry.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Why Choose Trumecs Section (BARU) -->
    <section class="py-12 bg-gray-50" id="whyChoose">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left: Why Choose -->
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">
              {{
                t("page.principal.machining.whyChoose.title") ||
                "Why Choose Trumecs"
              }}
            </h2>
            <div class="w-16 h-1 bg-orange-500 mb-6"></div>

            <ul class="space-y-4">
              <li
                v-for="(item, index) in whyChoose"
                :key="index"
                class="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0"
                >
                  <Icon :name="item.icon" class="text-orange-500 text-xl" />
                </div>
                <span class="font-medium text-primary">{{ item.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Right: Quality You Can Trust -->
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">
              {{
                t("page.principal.machining.quality.title") ||
                "Quality You Can Trust"
              }}
            </h2>
            <div class="w-16 h-1 bg-orange-500 mb-6"></div>

            <ul class="space-y-4">
              <li
                v-for="(item, index) in qualityTrust"
                :key="index"
                class="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0"
                >
                  <Icon :name="item.icon" class="text-green-600 text-xl" />
                </div>
                <span class="font-medium text-primary">{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Products We Can Make Section (DIPERBARUI) -->
    <section class="py-12 bg-white" id="products">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-4">
            {{
              t("page.principal.machining.products.title") ||
              "Products We Can Make"
            }}
          </h2>
          <div class="w-16 h-1 bg-orange-500"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="group text-center"
          >
            <div
              class="bg-gray-50 rounded-xl p-6 mb-3 aspect-square flex items-center justify-center group-hover:bg-orange-50 transition-colors"
            >
              <Icon
                :name="product.icon"
                class="text-6xl text-primary group-hover:text-orange-500 transition-colors"
              />
            </div>
            <h3 class="font-semibold text-primary text-sm md:text-base">
              {{ product.name }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Materials Section (DIPERBARUI) -->
    <section class="py-12 bg-gray-50" id="materials">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-4">
            {{ t("page.principal.machining.materials.title") || "Materials" }}
          </h2>
          <div class="w-16 h-1 bg-orange-500"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div
            v-for="(material, index) in materialsList"
            :key="index"
            class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3"
            >
              <Icon :name="material.icon" class="text-orange-500 text-xl" />
            </div>
            <span class="text-xs font-medium text-primary">{{
              material.name
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Methods Section (DIPERBARUI) -->
    <section class="py-12 bg-white" id="methods">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-4">
            {{
              t("page.principal.machining.methods.title") || "Our Capabilities"
            }}
          </h2>
          <div class="w-16 h-1 bg-orange-500"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="(method, index) in methods" :key="index">
            <h3 class="font-bold text-primary mb-3 text-sm md:text-base">
              {{ method.title }}
            </h3>
            <ul class="space-y-1">
              <li
                v-for="(feature, fIndex) in method.features"
                :key="fIndex"
                class="flex items-start gap-2 text-xs text-gray-600"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"
                ></span>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Contact & Locations Section -->
    <section class="py-12 bg-surface" id="contactLocations">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact -->
          <div class="text-center lg:text-left">
            <Icon name="mdi:phone" class="text-5xl text-orange-500 mb-3" />
            <h2 class="text-3xl font-bold mb-4">
              {{ t("page.principal.machining.contact.needTitle") }}
            </h2>
            <p class="text-gray-500 mb-8">
              {{ t("page.principal.machining.contact.needDesc") }}
            </p>
            <div
              class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <ElButton
                type="success"
                size="large"
                class="!bg-green-600 !border-green-600 hover:!bg-green-700 !text-white !px-8 !py-3 !rounded-lg !font-semibold"
                @click="handleContact"
              >
                <Icon name="mdi:whatsapp" class="text-xl mr-2" />
                {{ t("page.principal.machining.contact.whatsapp") }}
              </ElButton>
              <ElButton
                type="warning"
                size="large"
                class="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !px-8 !py-3 !rounded-lg !font-semibold"
                @click="handleEmail"
              >
                <Icon name="mdi:email" class="text-xl mr-2" />
                {{ t("page.principal.machining.contact.email") }}
              </ElButton>
            </div>
          </div>

          <!-- Locations -->
          <div class="text-center lg:text-left">
            <Icon name="mdi:city" class="text-5xl text-orange-500 mb-3" />
            <h2 class="text-3xl font-bold text-primary mb-3">
              {{ t("page.principal.machining.contact.locationTitle") }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ t("page.principal.machining.contact.locationDesc") }}
            </p>
            <div
              class="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4"
            >
              <div
                v-for="(location, index) in locations"
                :key="index"
                class="bg-white border border-gray-200/10 px-6 py-3 rounded-full shadow-sm flex items-center gap-2"
              >
                <Icon name="mdi:map-marker" class="text-orange-500 text-xl" />
                <span class="font-semibold text-primary text-lg">{{
                  location
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Footer -->
    <footer class="bg-primary text-white py-12">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div class="text-center md:text-left">
            <img
              src="https://migration.trumecs.com/logo/light.png"
              alt="Trumecs"
              class="h-10 mx-auto md:mx-0 mb-4"
            />
            <p class="text-sm text-gray-300">
              Your Reliable Partner for Precision Machining & Industrial
              Manufacturing
            </p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-300">www.trumecs.com</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-300">info@trumecs.com</p>
            <p class="text-sm text-gray-300">+62 851 7691 2338</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const industries = [
  {
    name: "Automotive",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80",
  },
  {
    name: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
  },
  {
    name: "Manufacture",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
  },
  {
    name: "Mill",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
  },
  {
    name: "Textile",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

const whyChoose = [
  { icon: "mdi:clock-fast", text: "Fast Quotation" },
  { icon: "mdi:account-hard-hat", text: "Engineering Support" },
  { icon: "mdi:target", text: "Precision Quality" },
  { icon: "mdi:layers-triple", text: "Material Flexibility" },
  { icon: "mdi:truck-fast", text: "On-Time Delivery" },
];

const qualityTrust = [
  { icon: "mdi:ruler-square", text: "Dimensional Inspection" },
  { icon: "mdi:clipboard-check", text: "Quality Control Process" },
  { icon: "mdi:check-decagram", text: "Final Product Verification" },
];

const products = [
  { name: "Shaft Gear", icon: "mdi:cog" },
  { name: "Chain", icon: "mdi:link-variant" },
  { name: "Bearing Housing", icon: "mdi:circle-double" },
  { name: "Conveyor Roller", icon: "mdi:pipe" },
  { name: "Sprocket", icon: "mdi:rotate-right" },
  { name: "Saw", icon: "mdi:saw-blade" },
  { name: "Coupling", icon: "mdi:connection" },
  { name: "Preforated Sheet", icon: "mdi:grid" },
];

const materialsList = [
  { name: "Stainless Steel", icon: "mdi:shield-star" },
  { name: "Carbon Steel", icon: "mdi:cube-outline" },
  { name: "Alloy Steel", icon: "mdi:hexagon-multiple" },
  { name: "Aluminium", icon: "mdi:alpha-a-box" },
  { name: "Cast Iron", icon: "mdi:anvil" },
  { name: "Engineering Plastics", icon: "mdi:plastic-bottle" },
  { name: "Rubber", icon: "mdi:circle-outline" },
];

const methods = [
  {
    title: "Milling",
    features: ["3-4 axis", "Slot & keyway", "Permukaan datar & kontur"],
  },
  {
    title: "Turning",
    features: ["Shaft & Axle", "Bushing & Bearing", "Thread & Ulir"],
  },
  {
    title: "Grinding",
    features: ["Surface grinding", "Cylindrical grinding"],
  },
  {
    title: "Cutting",
    features: ["Band saw", "Laser", "Waterjet", "Wire EDM"],
  },
  {
    title: "Fabrication",
    features: ["Welding", "Assembly"],
  },
];

// Data lama tetap
const aboutMachiningHighlights = [
  {
    title: "CNC Machining",
    icon: "mdi:cpu-64-bit",
    description:
      "Computer Numerical Control memungkinkan presisi tinggi dan reproduktifitas yang konsisten.",
  },
  {
    title: "Toleransi Presisi",
    icon: "mdi:tune-variant",
    description: "Mencapai toleransi hingga ±0.001mm untuk aplikasi kritis.",
  },
  {
    title: "Multi-Axis Capability",
    icon: "mdi:axis-arrow",
    description: "Mesin 3-axis hingga 5-axis untuk geometri kompleks.",
  },
  {
    title: "Quality Control",
    icon: "mdi:shield-check",
    description: "Inspeksi CMM dan dokumentasi ketat di setiap tahap.",
  },
];

const aboutFabrikasiHighlights = [
  {
    title: "Cutting & Shaping",
    icon: "mdi:content-cut",
    description: "Pemotongan presisi menggunakan laser, plasma, atau waterjet.",
  },
  {
    title: "Welding & Joining",
    icon: "mdi:fire",
    description: "Pengelasan MIG, TIG, dan SMAW untuk struktur kokoh.",
  },
  {
    title: "Bending & Forming",
    icon: "mdi:arrow-decline",
    description: "Pembengkokan dan pembentukan plat serta profil baja.",
  },
  {
    title: "Assembly",
    icon: "mdi:puzzle-check",
    description: "Perakitan komponen menjadi produk akhir yang siap install.",
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
  title: t("page.principal.machining.seo.title"),
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content: t("page.principal.machining.seo.description"),
    },
    { property: "og:title", content: t("page.principal.machining.seo.title") },
    {
      property: "og:description",
      content: t("page.principal.machining.seo.description"),
    },
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
:deep(.el-button) {
  font-weight: 600 !important;
}

:deep(.el-button.is-disabled) {
  opacity: 0.5;
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
</style>
