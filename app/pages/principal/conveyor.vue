<template>
  <div class="conveyor-page min-h-screen bg-[#f7f7f5] text-[#1f2933]">
    <!-- HERO -->
    <section class="relative overflow-hidden bg-[#151515] text-white">
      <div class="absolute inset-0">
        <AppImage
          src="/principal/conveyor/conveyor.jpg"
          :alt="t('page.principal.conveyor.hero.titleLine1')"
          class="h-full w-full object-cover"
          width="1600"
          height="900"
          sizes="100vw"
          loading="eager"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/35"></div>
        <div class="hero-grid absolute inset-0"></div>
      </div>

      <div class="relative mx-auto grid min-h-[78dvh] max-w-7xl items-end gap-10 px-4 pb-24 pt-28 md:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pb-28">
        <div class="max-w-3xl">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span class="h-2 w-2 rounded-full bg-orange-500"></span>
            <span class="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              {{ t("page.principal.conveyor.hero.badge") }}
            </span>
          </div>

          <h1 class="max-w-4xl text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span class="block">{{ t("page.principal.conveyor.hero.titleLine1") }}</span>
            <span class="block text-orange-400">{{ t("page.principal.conveyor.hero.titleLine2") }}</span>
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {{ t("page.principal.conveyor.hero.subtitle") }}
          </p>

          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(249,115,22,0.9)] transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              @click="scrollTo('contactLocations')"
            >
              {{ t("page.principal.conveyor.hero.ctaQuote") }}
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
            <button
              type="button"
              class="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              @click="scrollTo('products')"
            >
              {{ t("page.principal.conveyor.hero.ctaServices") }}
            </button>
          </div>
        </div>

        <div class="hidden lg:block">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              {{ t("page.principal.conveyor.products.sectionLabel") }}
            </p>
            <div class="mt-5 grid grid-cols-2 gap-3">
              <div
                v-for="(product, index) in products.slice(0, 4)"
                :key="`hero-${index}`"
                class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                  <AppImage
                    :src="product.image"
                    :alt="product.name"
                    class="h-full w-full object-cover"
                    width="120"
                    height="120"
                    sizes="48px"
                    loading="lazy"
                  />
                </div>
                <span class="text-sm font-medium leading-snug text-white/90">{{ product.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conveyor belt animation -->
      <div class="absolute bottom-4 left-0 right-0 z-10 flex items-center px-1" aria-hidden="true">
        <span class="belt-item belt-item-1"></span>
        <span class="belt-item belt-item-2"></span>
        <span class="belt-item belt-item-3"></span>
        <span class="belt-roller relative z-10 -mr-2 shrink-0"></span>
        <div class="belt-strip h-4 flex-1">
          <div class="belt-cleats"></div>
        </div>
        <span class="belt-roller relative z-10 -ml-2 shrink-0"></span>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section id="products" class="py-20 md:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div class="max-w-3xl">
            <p class="section-kicker">{{ t("page.principal.conveyor.products.sectionLabel") }}</p>
            <h2 class="section-title">{{ t("page.principal.conveyor.products.title") }}</h2>
            <p class="mt-4 max-w-2xl text-base leading-relaxed text-[#5f6b76]">
              {{ t("page.principal.conveyor.products.subtitle") }}
            </p>
          </div>
          <div class="hidden rounded-2xl border border-[#e6ddd0] bg-white px-5 py-4 md:block">
            <div class="text-3xl font-bold text-[#1f2933]">{{ products.length }}</div>
            <div class="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a3d]">
              {{ t("page.principal.conveyor.products.sectionLabel") }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          <button
            v-for="(product, index) in products"
            :key="index"
            type="button"
            class="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e2da] bg-white text-left shadow-[0_1px_0_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            @click="openProductDetail(product)"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-[#eceae5]">
              <AppImage
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                width="800"
                height="600"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div class="flex flex-1 flex-col p-4 md:p-5">
              <h3 class="text-sm font-semibold leading-snug text-[#18222d] md:text-base">
                {{ product.name }}
              </h3>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
                {{ t("page.principal.conveyor.products.detailLabels.viewDetail") }}
                <Icon name="mdi:arrow-right" class="text-sm transition-transform group-hover:translate-x-0.5" />
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
              <p class="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                {{ t("page.principal.conveyor.products.sectionLabel") }}
              </p>
              <h3 class="detail-title">{{ selectedProduct.name }}</h3>
              <p class="detail-desc">{{ selectedProduct.description }}</p>
            </div>
          </div>

          <div class="detail-body">
            <section v-if="selectedProduct.specs && selectedProduct.specs.length" class="detail-section">
              <h4 class="detail-section-title">{{ t("page.principal.conveyor.products.detailLabels.specs") }}</h4>
              <ul class="detail-list">
                <li v-for="(s, i) in selectedProduct.specs" :key="i">{{ s }}</li>
              </ul>
            </section>

            <section v-if="selectedProduct.applications && selectedProduct.applications.length" class="detail-section">
              <h4 class="detail-section-title">{{ t("page.principal.conveyor.products.detailLabels.applications") }}</h4>
              <div class="detail-chips">
                <span v-for="(a, i) in selectedProduct.applications" :key="i" class="detail-chip">{{ a }}</span>
              </div>
            </section>

            <section v-if="selectedProduct.beltTypes && selectedProduct.beltTypes.length" class="detail-section">
              <h4 class="detail-section-title">{{ t("page.principal.conveyor.products.detailLabels.beltTypes") }}</h4>
              <div class="detail-belt-types">
                <div v-for="(bt, i) in selectedProduct.beltTypes" :key="i" class="detail-belt-card">
                  <div class="detail-belt-head">
                    <Icon v-if="bt.icon" :name="bt.icon" class="detail-belt-icon" />
                    <span class="detail-belt-name">{{ bt.name }}</span>
                  </div>
                  <p class="detail-belt-desc">{{ bt.description }}</p>
                  <div v-if="bt.grades && bt.grades.length" class="detail-grades">
                    <span v-for="(g, gi) in bt.grades" :key="gi" class="detail-grade">{{ g }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <!-- TYPES -->
    <section id="types" class="border-y border-[#e8e2d8] bg-[#efece4] py-20 md:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="mb-12 max-w-3xl">
          <p class="section-kicker">{{ t("page.principal.conveyor.types.sectionLabel") }}</p>
          <h2 class="section-title">{{ t("page.principal.conveyor.types.title") }}</h2>
          <p class="mt-4 text-base leading-relaxed text-[#5f6b76]">
            {{ t("page.principal.conveyor.types.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(type, index) in types"
            :key="index"
            class="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#ddd6c8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.45)]"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-[#ddd7cb]">
              <AppImage
                :src="type.image"
                :alt="type.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                width="800"
                height="500"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
              <div class="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/92 text-orange-600 shadow-sm backdrop-blur">
                <Icon :name="type.icon" class="text-2xl" />
              </div>
            </div>
            <div class="flex flex-1 flex-col p-6">
              <h3 class="text-xl font-bold tracking-tight text-[#18222d]">{{ type.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#5f6b76]">{{ type.description }}</p>
              <div v-if="type.features && type.features.length" class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="(feature, fIndex) in type.features"
                  :key="fIndex"
                  class="rounded-full border border-[#eadfcd] bg-[#fffaf2] px-3 py-1 text-[11px] font-semibold text-[#8a5a1d]"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- INDUSTRIES -->
    <section id="industries" class="py-20 md:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-3xl">
            <p class="section-kicker">{{ t("page.principal.conveyor.industries.title") }}</p>
            <h2 class="section-title">{{ t("page.principal.conveyor.industries.title") }}</h2>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <article
            v-for="(industry, index) in industries"
            :key="index"
            class="group relative overflow-hidden rounded-2xl bg-[#1c1c1c]"
          >
            <div class="aspect-[3/4]">
              <AppImage
                :src="industry.image"
                :alt="industry.name"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                width="600"
                height="800"
                sizes="(max-width: 768px) 50vw, 16vw"
                loading="lazy"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-4">
              <h3 class="text-center text-sm font-semibold leading-snug text-white md:text-base">
                {{ industry.name }}
              </h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contactLocations" class="pb-20 md:pb-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="overflow-hidden rounded-[32px] bg-[#1a1a18] text-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
          <div class="grid gap-0 lg:grid-cols-[1fr_auto]">
            <div class="p-8 md:p-12 lg:p-14">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
                {{ t("page.principal.conveyor.contact.title") }}
              </p>
              <h2 class="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                {{ t("page.principal.conveyor.contact.needTitle") }}
              </h2>
              <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/68">
                {{ t("page.principal.conveyor.contact.needDesc") }}
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  class="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                  @click="handleContact"
                >
                  <Icon name="mdi:whatsapp" class="text-xl" />
                  {{ t("page.principal.conveyor.contact.whatsapp") }}
                </button>
                <button
                  type="button"
                  class="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  @click="handleEmail"
                >
                  <Icon name="mdi:email" class="text-xl" />
                  {{ t("page.principal.conveyor.contact.email") }}
                </button>
              </div>
            </div>

            <div class="flex items-center justify-center border-t border-white/10 bg-white/[0.03] p-8 lg:min-w-[280px] lg:border-l lg:border-t-0 lg:p-12">
              <div class="text-center">
                <div class="mx-auto inline-flex rounded-2xl bg-white px-6 py-4">
                  <AppImage
                    src="https://fe-migration.trumecs.com/logo/light.png"
                    alt="Trumecs"
                    class="h-9 w-auto object-contain"
                    width="200"
                    height="40"
                    sizes="200px"
                    loading="lazy"
                  />
                </div>
                <p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Trumecs</p>
              </div>
            </div>
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
.conveyor-page {
  font-family: "Barlow", "Inter", "Segoe UI", sans-serif;
}

.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 85%);
}

.section-kicker {
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c2410c;
}

.section-title {
  max-width: 48rem;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #18222d;
  text-wrap: balance;
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

.belt-strip::before { top: 0; }
.belt-strip::after { bottom: 0; }

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

.belt-item-1 { background: #fb923c; }
.belt-item-2 { background: #fdba74; animation-delay: -3s; }
.belt-item-3 { background: #f3f4f6; animation-delay: -6s; width: 14px; }

@keyframes belt-move { to { transform: translateX(20px); } }
@keyframes roller-spin { to { transform: rotate(360deg); } }
@keyframes item-move { from { left: -4%; } to { left: 104%; } }

@media (prefers-reduced-motion: reduce) {
  .belt-cleats,
  .belt-roller,
  .belt-item {
    animation: none;
  }
}

/* Product detail modal */
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.72);
  backdrop-filter: blur(6px);
  overflow: auto;
}
.detail-dialog {
  position: relative;
  width: 100%;
  max-width: 920px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: #fff;
  border-radius: 20px;
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
.detail-close:hover { background: #fff; }
.detail-header { display: grid; gap: 0; }
@media (min-width: 768px) {
  .detail-header { grid-template-columns: 360px 1fr; }
}
.detail-hero-image-wrap {
  width: 100%;
  height: 260px;
  background: #f3f4f6;
  overflow: hidden;
}
@media (min-width: 768px) {
  .detail-hero-image-wrap { height: 100%; min-height: 320px; }
}
.detail-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.detail-header-text { padding: 28px 28px 20px; }
.detail-title {
  margin: 0 0 10px;
  font-weight: 700;
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  line-height: 1.1;
  color: #18222d;
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
  letter-spacing: 0.06em;
  font-size: 0.8rem;
  color: #c2410c;
}
.detail-list {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  color: #4b5563;
}
.detail-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.detail-chip {
  padding: 6px 12px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.875rem;
  border-radius: 999px;
  border: 1px solid #fed7aa;
}
.detail-belt-types { display: grid; gap: 12px; }
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
.detail-belt-icon { font-size: 1.1rem; color: #fa8420; }
.detail-belt-name { font-weight: 600; color: #111827; }
.detail-belt-desc {
  margin: 0 0 10px;
  font-size: 0.95rem;
  color: #4b5563;
}
.detail-grades { display: flex; flex-wrap: wrap; gap: 8px; }
.detail-grade {
  padding: 4px 10px;
  background: #f3f4f6;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
