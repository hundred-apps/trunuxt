<template>
  <div class="min-h-screen bg-background font-body-md text-on-surface">
    <!-- 1. Hero Section -->
    <section
      class="relative min-h-[80dvh] flex items-center justify-center overflow-hidden"
    >
      <!-- Background Image -->
      <div class="absolute inset-0 z-0 h-[80dvh]">
        <div
          class="bg-cover bg-center w-full h-[80dvh] rounded-b-3xl"
          :style="{
            backgroundImage: `url('/principal/conveyor/conveyor.jpg')`,
          }"
        ></div>

        <div class="absolute inset-0 bg-black/60 h-[80dvh]"></div>
      </div>

      <!-- Konten -->
      <div
        class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left"
      >
        <div class="max-w-3xl mx-auto md:mx-0">
          <!-- Badge -->
          <!-- <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6"
          >
            <Icon
              name="material-symbols:conveyor-belt"
              class="text-orange-400 text-lg"
            />
            <span class="text-sm text-white/90 font-medium">{{
              t("page.principal.conveyor.hero.badge")
            }}</span>
          </div> -->

          <h1
            class="font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight drop-shadow-lg"
          >
            {{ t("page.principal.conveyor.hero.titleLine1") }}
            <span class="text-orange-400">{{
              t("page.principal.conveyor.hero.titleLine2")
            }}</span>
          </h1>

          <p
            class="text-lg md:text-xl text-gray-200/90 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed"
          >
            {{ t("page.principal.conveyor.hero.subtitle") }}
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
              {{ t("page.principal.conveyor.hero.ctaQuote") }}
              <Icon name="mdi:arrow-right" class="text-lg ml-1" />
            </ElButton>

            <ElButton
              size="large"
              class="w-full sm:w-auto !bg-white/10 !border-2 !border-white/40 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-lg !font-semibold !backdrop-blur-sm transition-all"
              @click="scrollTo('products')"
            >
              {{ t("page.principal.conveyor.hero.ctaServices") }}
            </ElButton>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block"
      >
        <a
          @click.prevent="scrollTo('products')"
          class="text-white/50 hover:text-white/80 transition-colors cursor-pointer flex flex-col items-center gap-1"
        >
          <span class="text-[10px] uppercase tracking-widest">Scroll</span>
          <Icon name="mdi:chevron-double-down" class="text-2xl" />
        </a>
      </div>

      <!-- Conveyor Belt Assembly (hero) -->
      <div class="absolute bottom-4 left-0 right-0 z-10 flex items-center px-1">
        <span class="belt-item belt-item-1"></span>
        <span class="belt-item belt-item-2"></span>
        <span class="belt-item belt-item-3"></span>
        <span class="belt-roller relative z-10 -mr-2 shrink-0"></span>
        <div class="belt-strip flex-1 h-4">
          <div class="belt-cleats"></div>
        </div>
        <span class="belt-roller relative z-10 -ml-2 shrink-0"></span>
      </div>
    </section>

    <!-- 2. Products Section -->
    <section class="bg-white py-16" id="products">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t("page.principal.conveyor.products.sectionLabel") }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {{ t("page.principal.conveyor.products.title") }}
          </h2>
          <p class="text-gray-600">
            {{ t("page.principal.conveyor.products.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <button
            v-for="(product, index) in products"
            :key="index"
            type="button"
            class="group text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-400 hover:shadow-lg transition-all duration-300"
            @click="openProductDetail(product)"
          >
            <div class="aspect-[4/3] bg-gray-50 overflow-hidden">
              <AppImage
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width="800"
                height="600"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-primary text-sm md:text-base">
                {{ product.name }}
              </h3>
              <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
                {{ t("page.principal.conveyor.products.detailLabels.viewDetail") }}
                <Icon name="mdi:arrow-right" class="text-sm" />
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Product detail modal -->
      <div
        v-if="selectedProduct"
        class="detail-modal"
        role="dialog"
        aria-modal="true"
        @click.self="closeProductDetail"
      >
        <div class="detail-dialog">
          <button
            type="button"
            class="detail-close"
            :aria-label="t('page.principal.conveyor.products.detailLabels.close')"
            @click="closeProductDetail"
          >
            <Icon name="mdi:close" />
          </button>

          <div class="detail-header">
            <div class="detail-hero-image-wrap">
              <AppImage
                :src="selectedProduct.image"
                :alt="selectedProduct.name"
                class="detail-hero-image"
                width="960"
                height="720"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
            <div class="detail-header-text">
              <h3 class="detail-title">{{ selectedProduct.name }}</h3>
              <p class="detail-desc">{{ selectedProduct.description }}</p>
            </div>
          </div>

          <div class="detail-body">
            <section
              v-if="selectedProduct.specs && selectedProduct.specs.length"
              class="detail-section"
            >
              <h4 class="detail-section-title">
                {{ t("page.principal.conveyor.products.detailLabels.specs") }}
              </h4>
              <ul class="detail-list">
                <li v-for="(s, i) in selectedProduct.specs" :key="i">{{ s }}</li>
              </ul>
            </section>

            <section
              v-if="selectedProduct.applications && selectedProduct.applications.length"
              class="detail-section"
            >
              <h4 class="detail-section-title">
                {{ t("page.principal.conveyor.products.detailLabels.applications") }}
              </h4>
              <div class="detail-chips">
                <span
                  v-for="(a, i) in selectedProduct.applications"
                  :key="i"
                  class="detail-chip"
                  >{{ a }}</span
                >
              </div>
            </section>

            <section
              v-if="selectedProduct.beltTypes && selectedProduct.beltTypes.length"
              class="detail-section"
            >
              <h4 class="detail-section-title">
                {{ t("page.principal.conveyor.products.detailLabels.beltTypes") }}
              </h4>
              <div class="detail-belt-types">
                <div
                  v-for="(bt, i) in selectedProduct.beltTypes"
                  :key="i"
                  class="detail-belt-card"
                >
                  <div class="detail-belt-head">
                    <Icon v-if="bt.icon" :name="bt.icon" class="detail-belt-icon" />
                    <span class="detail-belt-name">{{ bt.name }}</span>
                  </div>
                  <p class="detail-belt-desc">{{ bt.description }}</p>
                  <div v-if="bt.grades && bt.grades.length" class="detail-grades">
                    <span v-for="(g, gi) in bt.grades" :key="gi" class="detail-grade">{{
                      g
                    }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Types Section -->
    <section class="py-16 bg-gray-50" id="types">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-14 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t("page.principal.conveyor.types.sectionLabel") }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {{ t("page.principal.conveyor.types.title") }}
          </h2>
          <p class="text-gray-600">
            {{ t("page.principal.conveyor.types.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          <div
            v-for="(type, index) in types"
            :key="index"
            class="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
            :class="index >= 3 ? 'lg:col-span-3' : 'lg:col-span-4'"
          >
            <div class="aspect-[16/9] bg-gray-100 overflow-hidden">
              <AppImage
                :src="type.image"
                :alt="type.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width="800"
                height="450"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div class="p-6 md:p-7 flex flex-col flex-grow">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-orange-500 transition-colors flex items-center justify-center shrink-0"
                >
                  <Icon
                    :name="type.icon"
                    class="text-orange-500 group-hover:text-white transition-colors text-2xl"
                  />
                </div>
                <h3 class="text-xl font-bold text-primary">
                  {{ type.title }}
                </h3>
              </div>
              <div class="flex-grow mb-2">
                <p
                  class="text-sm text-gray-600 leading-relaxed transition-opacity duration-200 group-hover:hidden"
                >
                  {{ type.description }}
                </p>
                <div class="hidden group-hover:flex flex-wrap gap-2 content-start">
                  <span
                    v-for="(feature, fIndex) in type.features"
                    :key="fIndex"
                    class="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-100"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Industries -->
    <section class="py-16 bg-white" id="industries">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-10 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t("page.principal.conveyor.industries.title") }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {{ t("page.principal.conveyor.industries.title") }}
          </h2>
        </div>
      </div>

      <div
        class="scroll-x flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 md:px-8 pb-4"
      >
        <div
          v-for="(industry, index) in industries"
          :key="index"
          class="group relative rounded-xl overflow-hidden aspect-[3/4] w-52 md:w-60 shrink-0 snap-start cursor-pointer"
        >
          <AppImage
            :src="industry.image"
            :alt="industry.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            width="800"
            height="600"
            sizes="100vw md:600px"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          ></div>
          <div class="absolute bottom-0 left-0 right-0 p-4">

            <h3 class="text-white font-bold text-sm md:text-base text-center">
              {{ industry.name }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Contact -->
    <section
      class="py-16 bg-orange-50/40 border-t border-orange-100/60"
      id="contactLocations"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-12 max-w-2xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >{{ t("page.principal.conveyor.contact.title") }}</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {{ t("page.principal.conveyor.contact.needTitle") }}
          </h2>
        </div>

        <div
          class="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200/60 shadow-md hover:shadow-xl transition-shadow overflow-hidden p-8 md:p-10 text-center"
        >
          <div class="flex justify-center mb-4">
            <Trulink to="/">
              <AppImage
                src="https://fe-migration.trumecs.com/logo/light.png"
                alt="logo trumecs"
                class="h-9 w-auto object-contain"
                width="200"
                height="40"
                sizes="200px"
                loading="eager"
                fetchpriority="high"
              />
            </Trulink>
          </div>
          <p class="text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            {{ t("page.principal.conveyor.contact.needDesc") }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <ElButton
              size="large"
              class="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !px-8 !py-3 !rounded-lg !font-semibold !shadow-md"
              @click="handleContact"
            >
              <Icon name="mdi:whatsapp" class="text-xl mr-2" />
              {{ t("page.principal.conveyor.contact.whatsapp") }}
            </ElButton>
            <ElButton
              size="large"
              class="!bg-white !border-2 !border-gray-200 hover:!border-orange-400 hover:!bg-orange-50 !text-primary !px-8 !py-3 !rounded-lg !font-semibold"
              @click="handleEmail"
            >
              <Icon name="mdi:email" class="text-xl mr-2" />
              {{ t("page.principal.conveyor.contact.email") }}
            </ElButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";

const { t, tm, rt } = useI18n();
const { trackWhatsAppClick } = useAnalytics();

const industries = computed(() => {
  const items = tm("page.principal.conveyor.industries.items");
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    name: rt(item.name),
    image: rt(item.image),
  }));
});

const products = computed(() => {
  const items = tm("page.principal.conveyor.products.items");
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    name: rt(item.name),
    image: rt(item.image),
    description: rt(item.description),
    specs: Array.isArray(item.specs) ? item.specs.map((s: any) => rt(s)) : [],
    applications: Array.isArray(item.applications)
      ? item.applications.map((a: any) => rt(a))
      : [],
    beltTypes: Array.isArray(item.beltTypes)
      ? item.beltTypes.map((bt: any) => ({
          name: rt(bt.name),
          icon: bt.icon ? rt(bt.icon) : "",
          description: rt(bt.description),
          grades: Array.isArray(bt.grades)
            ? bt.grades.map((g: any) => rt(g))
            : [],
        }))
      : [],
  }));
});

const selectedProduct = ref<any | null>(null);
const openProductDetail = (product: any) => {
  selectedProduct.value = product;
};
const closeProductDetail = () => {
  selectedProduct.value = null;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeProductDetail();
};

if (import.meta.client) {
  window.addEventListener("keydown", onKeydown);
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";
  });
  watch(selectedProduct, (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  });
}

const types = computed(() => {
  const items = tm("page.principal.conveyor.types.items");
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    title: rt(item.title),
    icon: rt(item.icon),
    image: rt(item.image),
    description: rt(item.description),
    features: Array.isArray(item.features)
      ? item.features.map((f: any) => rt(f))
      : [],
  }));
});

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleContact = () => {
  const text = encodeURIComponent(t("page.principal.conveyor.contact.waText"));
  const url = `https://wa.me/6285176912338?text=${text}`;
  trackWhatsAppClick("principal_conveyor_contact", {
    link_url: url,
    page_path: "/principal/conveyor",
    link_label: "Conveyor WhatsApp Contact",
  });
  window.open(url, "_blank");
};

const handleEmail = () => {
  const subject = encodeURIComponent(
    t("page.principal.conveyor.contact.emailSubject")
  );
  window.location.href = `mailto:info@trumecs.com?subject=${subject}`;
};

// ============ SEO ============
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/conveyor";

const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.conveyor.seo.title"),
  titleTemplate: "%s",
  htmlAttrs: computed(() => localeHead.value.htmlAttrs ?? {}),
  meta: computed(() => [
    ...(localeHead.value.meta ?? []),
    {
      name: "description",
      content: t("page.principal.conveyor.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.conveyor.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.conveyor.seo.description"),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ]),
  link: computed(() => localeHead.value.link ?? []),
});

const geoJsonLd = computed(() => [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("page.principal.title"),
        item: `${SITE_URL}/principal`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("page.principal.conveyor.seo.title"),
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Conveyor Parts & Accessories",
    name: t("page.principal.conveyor.seo.title"),
    description: t("page.principal.conveyor.seo.description"),
    url: `${SITE_URL}${PAGE_PATH}`,
    provider: {
      "@type": "Organization",
      name: "Trumecs",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Indonesia" },
  },
]);

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: () => JSON.stringify(geoJsonLd.value),
    },
  ],
});
</script>

<style scoped>
/* Scrollbar strip industri */
.scroll-x {
  scrollbar-width: thin;
  scrollbar-color: #fa8420 #f3f4f6;
}

.scroll-x::-webkit-scrollbar {
  height: 6px;
}

.scroll-x::-webkit-scrollbar-thumb {
  background: #fa8420;
  border-radius: 3px;
}

.scroll-x::-webkit-scrollbar-track {
  background: #f3f4f6;
}

/* Hero conveyor belt animation */
.belt-strip {
  position: relative;
  background: linear-gradient(180deg, #3f4754 0%, #1f2937 45%, #111827 100%);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.25);
  overflow: hidden;
}

.belt-strip::before,
.belt-strip::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #fa8420;
  z-index: 1;
}

.belt-strip::before {
  top: 0;
}

.belt-strip::after {
  bottom: 0;
}

.belt-cleats {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: -20px;
  right: -20px;
  background: repeating-linear-gradient(
    90deg,
    transparent 0 16px,
    rgb(255 255 255 / 0.14) 16px 20px
  );
  animation: belt-move 1.2s linear infinite;
}

.belt-roller {
  display: inline-block;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  background:
    radial-gradient(circle at center, #fb923c 0 5px, transparent 5px),
    repeating-conic-gradient(#4b5563 0deg 20deg, #374151 20deg 40deg);
  border: 3px solid #9ca3af;
  box-shadow:
    0 2px 6px rgb(0 0 0 / 0.3),
    inset 0 0 4px rgb(0 0 0 / 0.4);
  animation: roller-spin 2.4s linear infinite;
}

.belt-item {
  position: absolute;
  top: -5px;
  width: 18px;
  height: 14px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.35);
  animation: item-move 9s linear infinite;
}

.belt-item-1 {
  background: #fb923c;
}

.belt-item-2 {
  background: #fdba74;
  animation-delay: -3s;
}

.belt-item-3 {
  background: #f3f4f6;
  animation-delay: -6s;
  width: 14px;
}

@keyframes belt-move {
  to {
    transform: translateX(20px);
  }
}

@keyframes roller-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes item-move {
  from {
    left: -4%;
  }
  to {
    left: 104%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .belt-cleats,
  .belt-roller,
  .belt-item {
    animation: none;
  }
}

/* ============ Product detail modal (format seperti bearing) ============ */
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  overflow: auto;
}
.detail-dialog {
  position: relative;
  width: 100%;
  max-width: 920px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.6);
}
.detail-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d3dae5;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: #1f2937;
  cursor: pointer;
}
.detail-close:hover {
  background: #fff;
}
.detail-header {
  display: grid;
  gap: 0;
}
@media (min-width: 768px) {
  .detail-header {
    grid-template-columns: 360px 1fr;
  }
}
.detail-hero-image-wrap {
  width: 100%;
  height: 260px;
  background: #f3f4f6;
  overflow: hidden;
}
@media (min-width: 768px) {
  .detail-hero-image-wrap {
    height: 100%;
    min-height: 320px;
  }
}
.detail-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.detail-header-text {
  padding: 28px 28px 20px;
}
.detail-title {
  margin: 0 0 10px;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.1;
  color: #111827;
}
.detail-desc {
  margin: 0;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
}
.detail-body {
  padding: 0 28px 28px;
  display: grid;
  gap: 28px;
}
.detail-section {
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
.detail-section-title {
  margin: 0 0 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.95rem;
  color: #fa8420;
}
.detail-list {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  color: #4b5563;
}
.detail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.detail-chip {
  padding: 6px 12px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.875rem;
  border-radius: 999px;
  border: 1px solid #fed7aa;
}
.detail-belt-types {
  display: grid;
  gap: 12px;
}
.detail-belt-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}
.detail-belt-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.detail-belt-icon {
  font-size: 1.1rem;
  color: #fa8420;
}
.detail-belt-name {
  font-weight: 600;
  color: #111827;
}
.detail-belt-desc {
  margin: 0 0 10px;
  font-size: 0.95rem;
  color: #4b5563;
}
.detail-grades {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.detail-grade {
  padding: 4px 10px;
  background: #f3f4f6;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* ============ Element Plus Overrides ============ */
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
