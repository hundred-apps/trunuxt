<template>
  <div class="page">
    <!-- ================= 1. HERO ================= -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-grid"></div>

      <!-- Ilustrasi bearing CSS (hanya layar lebar) -->
      <div class="bearing" aria-hidden="true">
        <div class="b-outer"></div>
        <div class="b-balls">
          <span
            v-for="n in 16"
            :key="n"
            class="b-ball"
            :style="{ '--a': `${(n - 1) * 22.5}deg` }"
          ></span>
        </div>
        <div class="b-inner"></div>
        <div class="b-core"></div>
      </div>

      <div class="wrap hero-content">
        <div class="hero-text">
          <div class="eyebrow-row fade-up">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-soft">{{
              t("page.principal.industrialBearing.hero.eyebrow")
            }}</span>
          </div>

          <h1 class="hero-title fade-up" style="animation-delay: 100ms">
            {{ t("page.principal.industrialBearing.hero.titleLine1") }}
            <span class="accent">{{
              t("page.principal.industrialBearing.hero.titleLine2")
            }}</span>
          </h1>

          <p class="hero-desc fade-up" style="animation-delay: 200ms">
            {{ t("page.principal.industrialBearing.hero.subtitle") }}
          </p>

          <div class="hero-actions fade-up" style="animation-delay: 300ms">
            <button class="btn btn-accent" @click="scrollTo('products')">
              {{ t("page.principal.industrialBearing.hero.ctaBrowse") }}
              <Icon name="mdi:arrow-right" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('contact')">
              {{ t("page.principal.industrialBearing.hero.ctaQuote") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 2. USP ================= -->
    <section class="wrap stats-wrap">
      <div class="stats" data-reveal>
        <div v-for="(item, index) in stats" :key="index" class="stat">
          <Icon :name="item.icon" class="stat-icon" />
          <div class="stat-title">{{ item.title }}</div>
          <p class="stat-desc">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- ================= 3. BEARING TYPES ================= -->
    <section id="products" class="sec">
      <div class="seo-inline-block mb-2" data-reveal>
        <div class="wrap narrow">
          <h2 class="seo-inline-title">
            {{ t("page.principal.industrialBearing.seoGeo.title") }}
          </h2>
          <p class="seo-inline-desc">
            {{ t("page.principal.industrialBearing.seoGeo.description") }}
          </p>
        </div>
      </div>
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.industrialBearing.types.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialBearing.types.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.industrialBearing.types.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialBearing.types.subtitle") }}
          </p>
        </header>

        <div class="types-toolbar" data-reveal>
          <div class="filters">
            <button
              v-for="(g, gi) in groups"
              :key="g"
              class="filter"
              :class="{ active: activeGroup === gi }"
              @click="activeGroup = gi"
            >
              {{ g }}
            </button>
          </div>
          <div class="search-box">
            <Icon name="mdi:magnify" class="search-icon" />
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              :placeholder="
                t('page.principal.industrialBearing.types.searchPlaceholder')
              "
              :aria-label="
                t('page.principal.industrialBearing.types.searchPlaceholder')
              "
            />
          </div>
        </div>

        <div class="type-grid type-grid-images">
          <button
            v-for="item in filteredTypes"
            :key="item.name"
            type="button"
            class="type-image-card"
            @click="openDetail(item)"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="type-image"
              loading="lazy"
            />
            <div class="type-image-overlay">
              <span>{{ item.name }}</span>
            </div>
          </button>
        </div>
        <p v-if="filteredTypes.length === 0" class="no-results">
          {{ t("page.principal.industrialBearing.types.noResults") }}
        </p>

        <div
          v-if="selectedType"
          class="detail-modal"
          role="dialog"
          aria-modal="true"
          @click.self="closeDetail"
        >
          <div class="detail-dialog">
            <button
              type="button"
              class="detail-close"
              :aria-label="
                t('page.principal.industrialBearing.types.detail.close')
              "
              @click="closeDetail"
            >
              <Icon name="mdi:close" />
            </button>

            <div class="detail-header">
              <img
                :src="selectedType.image"
                :alt="selectedType.name"
                class="detail-hero-image"
              />
              <div class="detail-header-text">
                <h3 class="detail-title">{{ selectedType.name }}</h3>
                <p class="detail-desc">{{ selectedType.description }}</p>
              </div>
            </div>

            <div class="detail-body">
              <section class="detail-section">
                <h4 class="detail-section-title">
                  {{ t("page.principal.industrialBearing.types.detail.specs") }}
                </h4>
                <div class="specs detail-specs">
                  <div>
                    <span class="spec-label">{{
                      t("page.principal.industrialBearing.types.loadLabel")
                    }}</span>
                    <span class="spec-value">{{ selectedType.load }}</span>
                  </div>
                  <div>
                    <span class="spec-label">{{
                      t("page.principal.industrialBearing.types.exampleLabel")
                    }}</span>
                    <span class="spec-value">{{ selectedType.example }}</span>
                  </div>
                </div>
                <h5 class="detail-subtitle">
                  {{ t("page.principal.industrialBearing.types.detail.uses") }}
                </h5>
                <ul class="chips">
                  <li v-for="u in selectedType.uses" :key="u">{{ u }}</li>
                </ul>
              </section>

              <section v-if="selectedType.performance" class="detail-section">
                <h4 class="detail-section-title">
                  {{
                    t("page.principal.industrialBearing.types.performanceTitle")
                  }}
                </h4>
                <div class="perf-list">
                  <div
                    v-for="key in ['radial', 'axial', 'speed', 'misalign']"
                    :key="key"
                    class="perf-row"
                  >
                    <span class="perf-label">{{
                      t(
                        `page.principal.industrialBearing.types.performanceLabels.${key}`
                      )
                    }}</span>
                    <span
                      class="dots"
                      :aria-label="`${selectedType.performance[key]} of 4`"
                    >
                      <i
                        v-for="d in 4"
                        :key="d"
                        :class="{ on: d <= selectedType.performance[key] }"
                      ></i>
                    </span>
                  </div>
                </div>
              </section>

              <section
                v-if="selectedType.industries && selectedType.industries.length"
                class="detail-section"
              >
                <h4 class="detail-section-title">
                  {{
                    t("page.principal.industrialBearing.types.industryTitle")
                  }}
                </h4>
                <div class="detail-industries">
                  <article
                    v-for="ind in selectedType.industries"
                    :key="ind.name"
                    class="detail-industry"
                  >
                    <h5>{{ ind.name }}</h5>
                    <p v-if="ind.summary">{{ ind.summary }}</p>
                    <ul v-if="ind.equipment && ind.equipment.length">
                      <li v-for="e in ind.equipment" :key="e">{{ e }}</li>
                    </ul>
                    <p v-if="ind.tip" class="detail-tip">
                      <Icon name="mdi:lightbulb-on-outline" />
                      <span>{{ ind.tip }}</span>
                    </p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 4. ACCESSORIES ================= -->
    <section id="accessories" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.industrialBearing.accessories.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialBearing.accessories.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.industrialBearing.accessories.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialBearing.accessories.subtitle") }}
          </p>
        </header>

        <div class="accessory-categories">
          <section
            v-for="cat in accessoryCategories"
            :key="cat.name"
            class="accessory-category"
            data-reveal
          >
            <div class="accessory-category-head">
              <div class="icon-box accessory-icon">
                <Icon :name="cat.icon" />
              </div>
              <div>
                <h3 class="accessory-category-title">{{ cat.name }}</h3>
                <p class="card-text">{{ cat.description }}</p>
              </div>
            </div>
            <div class="accessory-products">
              <article
                v-for="prod in cat.products"
                :key="prod.name"
                class="accessory-product"
              >
                <div class="accessory-image-wrap">
                  <img
                    :src="prod.image"
                    :alt="prod.name"
                    class="accessory-image"
                    loading="lazy"
                  />
                </div>
                <div class="accessory-body">
                  <h4 class="accessory-product-name">{{ prod.name }}</h4>
                  <p class="card-text">{{ prod.description }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>

    <!-- ================= 6. TECHNICAL REFERENCE ================= -->
    <section id="reference" class="sec">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.industrialBearing.reference.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialBearing.reference.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.industrialBearing.reference.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialBearing.reference.subtitle") }}
          </p>
        </header>

        <!-- Decoder -->
        <div class="decoder" data-reveal>
          <div class="decoder-code">
            <span v-for="seg in decoder" :key="seg.code" class="seg">
              <b>{{ seg.code }}</b>
              <small>{{ seg.label }}</small>
            </span>
          </div>
          <ul class="decoder-list">
            <li v-for="seg in decoder" :key="seg.code">
              <span class="badge">{{ seg.code }}</span>
              <span>{{ seg.meaning }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ================= 7. SELECTION & FAILURE ================= -->
    <section id="selection-care" class="sec sec-sand">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.industrialBearing.selectionCare.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{
                t("page.principal.industrialBearing.selectionCare.titleLine1")
              }}
              <span class="accent-dark">{{
                t("page.principal.industrialBearing.selectionCare.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialBearing.selectionCare.subtitle") }}
          </p>
        </header>

        <div class="selection-care-grid">
          <div class="selection-col" data-reveal>
            <h3 class="subsec-title">
              {{
                t(
                  "page.principal.industrialBearing.selectionCare.selectionTitle"
                )
              }}
            </h3>
            <div class="care-grid selection-steps">
              <div
                v-for="(step, i) in selectionSteps"
                :key="step.title"
                class="care-card"
              >
                <div class="icon-box">
                  <Icon :name="step.icon" />
                </div>
                <h3 class="card-title">{{ step.title }}</h3>
                <p class="card-text">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <div class="care-col" data-reveal>
            <h3 class="subsec-title">
              {{
                t("page.principal.industrialBearing.selectionCare.careTitle")
              }}
            </h3>
            <div class="care-grid selection-care-failures">
              <div
                v-for="item in failureItems"
                :key="item.title"
                class="care-card"
              >
                <div class="icon-box">
                  <Icon :name="item.icon" />
                </div>
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-text">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 9. FAQ ================= -->
    <section id="faq" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head center" data-reveal>
          <div>
            <div class="eyebrow-row center">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.industrialBearing.faq.sectionLabel")
              }}</span>
              <span class="eyebrow-line"></span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialBearing.faq.title") }}
            </h2>
          </div>
        </header>

        <div class="faq-list" data-reveal>
          <div
            v-for="(f, i) in faqs"
            :key="f.q"
            class="faq"
            :class="{ open: openFaq === i }"
          >
            <button class="faq-q" @click="openFaq = openFaq === i ? null : i">
              <span>{{ f.q }}</span>
              <Icon name="mdi:plus" class="faq-icon" />
            </button>
            <div class="faq-a">
              <div>
                <p>{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 10. CONTACT ================= -->
    <section id="contact" class="sec">
      <div class="wrap">
        <div class="cta" data-reveal>
          <div class="hero-grid"></div>
          <div class="cta-main">
            <span class="eyebrow accent-soft">{{
              t("page.principal.industrialBearing.contact.eyebrow")
            }}</span>
            <h2>
              {{ t("page.principal.industrialBearing.contact.titleLine1") }}
              <span class="accent">{{
                t("page.principal.industrialBearing.contact.titleLine2")
              }}</span>
            </h2>
            <p>
              {{ t("page.principal.industrialBearing.contact.desc") }}
            </p>
            <div class="cta-actions">
              <button class="btn btn-accent" @click="handleContact">
                <Icon name="mdi:whatsapp" />
                {{ t("page.principal.industrialBearing.contact.whatsapp") }}
              </button>
              <button class="btn btn-ghost" @click="handleEmail">
                <Icon name="mdi:email-outline" />
                {{ t("page.principal.industrialBearing.contact.email") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const { t, tm, rt } = useI18n();

// Helper: ambil array dari pesan i18n
const i18nArr = (key: string) => {
  const items = tm(key);
  return Array.isArray(items) ? items : [];
};

// ============ DATA (dari i18n) ============
const stats = computed(() =>
  i18nArr("page.principal.industrialBearing.stats.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const groups = computed(() =>
  i18nArr("page.principal.industrialBearing.groups.items").map((g: any) =>
    rt(g)
  )
);
const activeGroup = ref(0);
const searchQuery = ref("");

const types = computed(() =>
  i18nArr("page.principal.industrialBearing.types.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    image: rt(item.image),
    groupIdx: Number(rt(item.groupIdx)) || 0,
    description: rt(item.description),
    load: rt(item.load),
    example: rt(item.example),
    uses: Array.isArray(item.uses) ? item.uses.map((u: any) => rt(u)) : [],
    performance: item.performance
      ? {
          radial: Number(item.performance.radial) || 0,
          axial: Number(item.performance.axial) || 0,
          speed: Number(item.performance.speed) || 0,
          misalign: Number(item.performance.misalign) || 0,
        }
      : null,
    industries: Array.isArray(item.industries)
      ? item.industries.map((ind: any) => ({
          name: rt(ind.name),
          summary: rt(ind.summary),
          equipment: Array.isArray(ind.equipment)
            ? ind.equipment.map((e: any) => rt(e))
            : [],
          tip: rt(ind.tip),
        }))
      : [],
  }))
);

const filteredTypes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return types.value.filter((item) => {
    const matchGroup =
      activeGroup.value === 0 || item.groupIdx === activeGroup.value;
    if (!matchGroup) return false;
    if (!q) return true;
    const hay = [
      item.name,
      item.description,
      item.load,
      item.example,
      ...(item.uses || []),
      groups.value[item.groupIdx] || "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
});

const accessoryCategories = computed(() =>
  i18nArr("page.principal.industrialBearing.accessories.categories").map(
    (cat: any) => ({
      name: rt(cat.name),
      icon: rt(cat.icon),
      description: rt(cat.description),
      products: Array.isArray(cat.products)
        ? cat.products.map((p: any) => ({
            name: rt(p.name),
            image: rt(p.image),
            description: rt(p.description),
          }))
        : [],
    })
  )
);

const selectedType = ref<any | null>(null);
const openDetail = (item: any) => {
  selectedType.value = item;
};
const closeDetail = () => {
  selectedType.value = null;
};

const decoder = computed(() =>
  i18nArr("page.principal.industrialBearing.reference.decoder").map(
    (seg: any) => ({
      code: rt(seg.code),
      label: rt(seg.label),
      meaning: rt(seg.meaning),
    })
  )
);

const selectionSteps = computed(() =>
  i18nArr("page.principal.industrialBearing.selection.items").map(
    (item: any) => ({
      icon: rt(item.icon),
      title: rt(item.title),
      description: rt(item.description),
    })
  )
);

const failureItems = computed(() =>
  i18nArr("page.principal.industrialBearing.care.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

// Kode standar bersifat bahasa netral
const standards = [
  "ISO 15",
  "ISO 281",
  "ISO 76",
  "ISO 492",
  "ISO 5753",
  "DIN 625",
  "ABMA",
  "JIS B 1512",
];

const faqs = computed(() =>
  i18nArr("page.principal.industrialBearing.faq.items").map((f: any) => ({
    q: rt(f.q),
    a: rt(f.a),
  }))
);
const openFaq = ref<number | null>(0);

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleContact = () => {
  const text = encodeURIComponent(
    t("page.principal.industrialBearing.contact.waText")
  );
  window.open(`https://wa.me/6285176912338?text=${text}`, "_blank");
};

const handleEmail = () => {
  const subject = encodeURIComponent(
    t("page.principal.industrialBearing.contact.emailSubject")
  );
  window.location.href = `mailto:info@trumecs.com?subject=${subject}`;
};

// ============ SCROLL REVEAL ============
let observer: IntersectionObserver | null = null;
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeDetail();
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]")
  );
  if (!els.length) return;

  const show = (el: HTMLElement) => el.classList.add("is-visible");

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    els.forEach(show);
    return;
  }

  const inView = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  };

  const toObserve: HTMLElement[] = [];
  els.forEach((el) => {
    if (inView(el)) {
      show(el);
    } else {
      el.classList.add("reveal-pending");
      toObserve.push(el);
    }
  });

  if (toObserve.length) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    toObserve.forEach((el) => observer?.observe(el));
  }

  // Fallback: pastikan tidak ada section yang tertahan tersembunyi
  window.setTimeout(() => {
    els.forEach(show);
  }, 1500);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("keydown", onKeydown);
});

// ============ SEO ============
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/industrial-bearing";

const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.industrialBearing.seo.title"),
  titleTemplate: "%s",
  htmlAttrs: computed(() => localeHead.value.htmlAttrs ?? {}),
  link: computed(() => [
    ...(localeHead.value.link ?? []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ]),
  meta: computed(() => [
    ...(localeHead.value.meta ?? []),
    {
      name: "description",
      content: t("page.principal.industrialBearing.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.industrialBearing.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.industrialBearing.seo.description"),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ]),
});

// ============ GEO: structured data (JSON-LD) ============
const geoJsonLd = computed(() => {
  const faqEntities = faqs.value.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));

  return [
    // Breadcrumb
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
          name: t("page.principal.industrialBearing.seo.title"),
          item: `${SITE_URL}${PAGE_PATH}`,
        },
      ],
    },
    // Layanan utama
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: t("page.principal.industrialBearing.seo.serviceType"),
      name: t("page.principal.industrialBearing.seo.title"),
      description: t("page.principal.industrialBearing.seo.description"),
      url: `${SITE_URL}${PAGE_PATH}`,
      provider: {
        "@type": "Organization",
        name: "Trumecs",
        url: SITE_URL,
      },
      areaServed: { "@type": "Country", name: "Indonesia" },
    },
    // FAQ — membantu AI & featured snippet memahami Q&A
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities,
    },
  ];
});

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
/* =========================================================
   DESIGN TOKENS
========================================================= */
.page {
  --ink: #0b1220;
  --ink-2: #121b2c;
  --accent: #4aa3ff;
  --accent-soft: #9ccbff;
  --accent-dark: #1a5fb4;
  --paper: #f2f4f7;
  --sand: #e6eaf0;
  --line: #dde2ea;
  --muted: #55606e;

  font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--paper);
  overflow-x: hidden;
}
.page * {
  box-sizing: border-box;
}

/* =========================================================
   LAYOUT
========================================================= */
.wrap {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.wrap.narrow {
  max-width: 860px;
}
.sec {
  padding: 56px 0;
}
.sec-dark {
  background: var(--ink);
  color: #fff;
}
.sec-white {
  background: #fff;
}
.sec-white .wrap {
  padding-left: 0;
  padding-right: 0;
}
.sec-sand {
  background: var(--sand);
}
@media (min-width: 1024px) {
  .sec {
    padding: 128px 0;
  }
}

.sec-head {
  display: grid;
  gap: 20px;
  margin-bottom: 56px;
}
.sec-head.center {
  text-align: center;
  justify-items: center;
}
@media (min-width: 1024px) {
  .sec-head:not(.center) {
    grid-template-columns: 1.4fr 1fr;
    gap: 64px;
    align-items: end;
  }
}
.sec-title {
  font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.3rem, 4.8vw, 3.7rem);
  line-height: 1.04;
  letter-spacing: 0.005em;
  margin: 0;
}
.sec-title.light {
  color: #fff;
}
.sec-desc {
  color: var(--muted);
  font-size: 1.05rem;
  margin: 0;
  max-width: 520px;
}
.sec-desc.light {
  color: rgba(255, 255, 255, 0.62);
}

.eyebrow-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.eyebrow-row.center {
  justify-content: center;
}
.eyebrow-line {
  display: block;
  width: 36px;
  height: 2px;
  background: var(--accent);
}
.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 600;
}
.accent {
  color: var(--accent);
}
.accent-soft {
  color: var(--accent-soft);
}
.accent-dark {
  color: var(--accent-dark);
}

/* =========================================================
   BUTTONS
========================================================= */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
.btn-accent {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: var(--ink);
}
.btn-accent:hover {
  background: #74b8ff;
  box-shadow: 0 12px 28px -10px rgba(74, 163, 255, 0.6);
}
.btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* =========================================================
   HERO
========================================================= */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 88vh;
  background: var(--ink);
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 60% 70% at 85% 45%,
      rgba(74, 163, 255, 0.22),
      transparent 70%
    ),
    linear-gradient(180deg, #0b1220 0%, #0e1a2e 100%);
}
.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 56px 56px;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding-top: 120px;
  padding-bottom: 150px;
}
.hero-text {
  max-width: 680px;
}
.hero-title {
  font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(3rem, 7.5vw, 5.6rem);
  line-height: 1;
  color: #fff;
  margin: 0 0 28px;
}
.hero-title .accent {
  display: block;
}
.hero-desc {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.72);
  max-width: 540px;
  margin: 0 0 40px;
}
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 640px) {
  .hero-actions {
    flex-direction: row;
  }
}

/* Ilustrasi bearing */
.bearing {
  display: none;
  position: absolute;
  right: 7%;
  top: 50%;
  width: 420px;
  height: 420px;
  margin-top: -230px;
  z-index: 1;
}
@media (min-width: 1100px) {
  .bearing {
    display: block;
  }
}
.b-outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 30px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 0 0 2px rgba(74, 163, 255, 0.35),
    inset 0 0 0 2px rgba(74, 163, 255, 0.25),
    0 0 80px rgba(74, 163, 255, 0.15);
}
.b-inner {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  border: 24px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.2),
    inset 0 0 0 2px rgba(255, 255, 255, 0.15);
}
.b-core {
  position: absolute;
  inset: 40%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(74, 163, 255, 0.35),
    rgba(11, 18, 32, 0.9) 70%
  );
  border: 2px solid rgba(74, 163, 255, 0.5);
}
.b-balls {
  position: absolute;
  inset: 0;
  animation: spin 40s linear infinite;
}
.b-ball {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff, #a9bdd8 45%, #3a4a63);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
  transform: rotate(var(--a)) translateY(-149px);
}

/* =========================================================
   USP (replaces stats)
========================================================= */
.stats-wrap {
  position: relative;
  z-index: 5;
  margin-top: -64px;
}
.stats {
  display: grid;
  grid-template-columns: 1fr;
  background: var(--ink-2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
@media (min-width: 768px) {
  .stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
.stat {
  text-align: center;
  padding: 36px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.stats .stat:last-child {
  border-bottom: 0;
}
@media (min-width: 768px) {
  .stats .stat {
    border-bottom: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
  .stats .stat:last-child {
    border-right: 0;
  }
}
.stat-icon {
  font-size: 28px;
  color: var(--accent);
  margin-bottom: 12px;
}
.stat-title {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.stat-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}

/* =========================================================
   SHARED CARD PIECES
========================================================= */
.card-title {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.65rem;
  line-height: 1.1;
  margin: 0 0 10px;
  color: var(--ink);
}
.card-text {
  font-size: 0.92rem;
  color: var(--muted);
  margin: 0;
}
.card-sub {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0 0 24px;
}
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: var(--paper);
  border: 1px solid #d3dae5;
  font-size: 26px;
  color: var(--ink);
  transition: all 0.3s ease;
}
.icon-box.solid {
  background: var(--accent);
  border-color: var(--accent);
}

/* =========================================================
   PRODUCTS
========================================================= */
.types-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1 1 320px;
}
.search-box {
  position: relative;
  flex: 0 1 320px;
  width: 100%;
  max-width: 360px;
  margin-left: auto;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #8892a0;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #c5cdd9;
  border-radius: 10px;
  background: #fff;
  color: var(--ink);
  font-size: 0.95rem;
  font-family: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.search-input::placeholder {
  color: #8892a0;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(74, 163, 255, 0.18);
}
.no-results {
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 0.95rem;
}
.filter {
  padding: 10px 20px;
  border: 1px solid #c5cdd9;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
}
.filter:hover {
  border-color: var(--ink);
  color: var(--ink);
}
.filter.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--accent);
}

.type-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 700px) {
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .type-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.type-grid-images .type-image-card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.type-grid-images .type-image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px -28px rgba(11, 18, 32, 0.35);
  border-color: var(--accent);
}
.type-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.type-image-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.72);
}
.type-image-overlay span {
  color: #fff;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: center;
  line-height: 1.2;
}
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(11, 18, 32, 0.75);
  backdrop-filter: blur(4px);
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
  color: var(--ink);
  cursor: pointer;
}
.detail-header {
  display: grid;
  gap: 0;
}
@media (min-width: 768px) {
  .detail-header {
    grid-template-columns: 320px 1fr;
  }
}
.detail-hero-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}
@media (min-width: 768px) {
  .detail-hero-image {
    height: 100%;
    min-height: 260px;
  }
}
.detail-header-text {
  padding: 28px 28px 20px;
}
.detail-title {
  margin: 0 0 10px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 2rem;
  line-height: 1.05;
  color: var(--ink);
}
.detail-desc {
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
}
.detail-body {
  padding: 0 28px 28px;
  display: grid;
  gap: 28px;
}
.detail-section {
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.detail-section-title {
  margin: 0 0 16px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.35rem;
  color: var(--ink);
}
.detail-subtitle {
  margin: 16px 0 10px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.detail-specs {
  margin: 0;
  padding: 0;
  border: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.perf-list {
  display: grid;
  gap: 12px;
  max-width: 520px;
}
.perf-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.perf-label {
  font-size: 0.92rem;
  color: var(--ink);
  font-weight: 500;
}
.detail-industries {
  display: grid;
  gap: 16px;
}
@media (min-width: 768px) {
  .detail-industries {
    grid-template-columns: repeat(2, 1fr);
  }
}
.detail-industry {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 18px;
}
.detail-industry h5 {
  margin: 0 0 8px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-size: 1.2rem;
  text-transform: uppercase;
  color: var(--ink);
}
.detail-industry p {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: var(--muted);
}
.detail-industry ul {
  margin: 0 0 10px;
  padding-left: 18px;
  color: var(--muted);
  font-size: 0.88rem;
}
.detail-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--accent-dark);
  font-weight: 500;
}
.accessory-categories {
  display: grid;
  gap: 36px;
}
.accessory-category {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
}
.accessory-category-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}
.accessory-category-title {
  margin: 0 0 6px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.6rem;
  line-height: 1.1;
  color: var(--ink);
}
.accessory-products {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .accessory-products {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .accessory-products {
    grid-template-columns: repeat(4, 1fr);
  }
}
.accessory-product {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.accessory-image-wrap {
  aspect-ratio: 4 / 3;
  background: #fff;
  padding: 12px;
}
.accessory-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.accessory-body {
  padding: 16px;
}
.accessory-product-name {
  margin: 0 0 6px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.2;
  color: var(--ink);
  text-transform: uppercase;
}
.accessory-icon {
  margin-bottom: 0;
  flex-shrink: 0;
}
.type-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 28px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.type-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 3px;
  width: 0;
  background: var(--accent);
  transition: width 0.4s ease;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px -28px rgba(11, 18, 32, 0.35);
}
.type-card:hover::before {
  width: 100%;
}
.type-card:hover .icon-box {
  background: var(--accent);
  border-color: var(--accent);
}
.type-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.tag {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: #8892a0;
}
.specs {
  display: grid;
  gap: 14px;
  margin: 22px 0 20px;
  padding: 16px 0;
  border-top: 1px solid #e6eaf0;
  border-bottom: 1px solid #e6eaf0;
}
.spec-label {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8892a0;
  margin-bottom: 2px;
}
.spec-value {
  display: block;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--ink);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: auto 0 0;
}
.chips li {
  font-size: 0.72rem;
  font-weight: 500;
  padding: 5px 10px;
  background: var(--paper);
  border-radius: 4px;
  color: var(--muted);
}

/* =========================================================
   APPLICATIONS
========================================================= */
.app-layout {
  display: grid;
  gap: 24px;
}
@media (min-width: 1024px) {
  .app-layout {
    grid-template-columns: 300px 1fr;
    gap: 32px;
    align-items: start;
  }
}
.app-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}
@media (min-width: 1024px) {
  .app-tabs {
    flex-direction: column;
    overflow: visible;
    padding-bottom: 0;
  }
}
.app-tab {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.68);
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s ease;
}
.app-tab:hover {
  border-color: rgba(74, 163, 255, 0.6);
  color: #fff;
}
.app-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}
.app-tab-icon {
  font-size: 24px;
}

.panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px;
  animation: panelIn 0.45s ease both;
}
@media (min-width: 768px) {
  .panel {
    padding: 40px;
  }
}
.panel-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.panel-head h3 {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 2.1rem;
  line-height: 1;
}
.panel-summary {
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 32px;
  max-width: 620px;
}
.panel-cols {
  display: grid;
  gap: 28px;
}
@media (min-width: 768px) {
  .panel-cols {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}
.panel-label {
  margin: 0 0 16px;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--accent-soft);
}
.panel-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.panel-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.88);
}
.panel-list li > :first-child {
  flex-shrink: 0;
  margin-top: 3px;
  font-size: 18px;
  color: var(--accent);
}
.panel-tip {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.6);
}
.panel-tip > :first-child {
  flex-shrink: 0;
  font-size: 22px;
  color: var(--accent);
}
.panel-tip p {
  margin: 0;
}

/* =========================================================
   TABLES + DECODER
========================================================= */
.table-grid {
  display: grid;
  gap: 24px;
}
@media (min-width: 1024px) {
  .table-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.table-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 28px;
}
.sec-white .table-card {
  background: var(--paper);
}
@media (min-width: 768px) {
  .table-card {
    padding: 36px;
  }
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
th {
  text-align: left;
  padding: 0 12px 12px 0;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: #8892a0;
  border-bottom: 2px solid var(--ink);
  white-space: nowrap;
}
td {
  padding: 13px 12px 13px 0;
  vertical-align: middle;
  color: var(--muted);
  border-bottom: 1px solid #dfe4ec;
}
td.strong {
  font-weight: 600;
  color: var(--ink);
}
.matrix td.strong {
  white-space: nowrap;
}
.badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--ink);
  color: var(--accent);
  border-radius: 4px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}
.note {
  margin: 20px 0 0;
  font-size: 0.78rem;
  color: #7b8591;
}
.dots {
  display: inline-flex;
  gap: 5px;
}
.dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cfd6e1;
}
.dots i.on {
  background: var(--accent-dark);
}

.decoder {
  display: grid;
  gap: 28px;
  margin-bottom: 24px;
  padding: 32px 28px;
  background: var(--ink);
  border-radius: 16px;
  color: #fff;
}
@media (min-width: 900px) {
  .decoder {
    grid-template-columns: auto 1fr;
    gap: 56px;
    align-items: center;
    padding: 44px 48px;
  }
}
.decoder-code {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.seg {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 64px;
  padding: 14px 12px 10px;
  border: 1px solid rgba(74, 163, 255, 0.4);
  border-radius: 10px;
  background: rgba(74, 163, 255, 0.07);
}
.seg b {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 2.1rem;
  line-height: 1;
  color: var(--accent);
}
.seg small {
  margin-top: 8px;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.decoder-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.decoder-list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.82);
}
.decoder-list .badge {
  flex-shrink: 0;
  min-width: 52px;
  text-align: center;
  background: var(--accent);
  color: var(--ink);
}

/* =========================================================
   SELECTION STEPS
========================================================= */
.step-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .step-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .step-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.selection-care-grid {
  display: grid;
  gap: 32px;
  margin-bottom: 40px;
}
@media (min-width: 1024px) {
  .selection-care-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }
}
.subsec-title {
  margin: 0 0 18px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.6rem;
  color: var(--ink);
}
.selection-care-grid .step-grid,
.selection-care-grid .care-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  grid-auto-rows: 1fr;
  align-items: stretch;
}
.step {
  position: relative;
  padding: 32px 20px 22px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  height: 100%;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.step:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 24px 40px -28px rgba(11, 18, 32, 0.3);
}
.step-num {
  position: absolute;
  right: 18px;
  top: 8px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 700;
  font-size: 4.2rem;
  line-height: 1;
  color: rgba(11, 18, 32, 0.07);
}
.step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  font-size: 28px;
  color: var(--accent-dark);
  background: rgba(15, 94, 168, 0.08);
  border: 1px solid rgba(15, 94, 168, 0.18);
  border-radius: 12px;
  margin-bottom: 20px;
}

/* =========================================================
   CARE + STANDARDS
========================================================= */
.care-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  margin-bottom: 40px;
}
@media (min-width: 640px) {
  .care-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .care-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.selection-care-grid .care-grid {
  margin-bottom: 0;
}
.care-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 32px 20px 22px;
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.care-card .icon-box {
  margin-bottom: 20px;
}
.care-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 24px 40px -28px rgba(11, 18, 32, 0.3);
}
.care-card:hover .icon-box {
  background: var(--accent);
  border-color: var(--accent);
}

.standards {
  display: grid;
  gap: 24px;
  padding: 36px;
  background: var(--ink);
  border-radius: 16px;
  align-items: center;
}
@media (min-width: 900px) {
  .standards {
    grid-template-columns: 1fr 2fr;
    gap: 48px;
    padding: 44px 48px;
  }
}
.standards-text h3 {
  margin: 0 0 6px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 2rem;
  line-height: 1.05;
  color: #fff;
}
.standards-text p {
  margin: 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
}
.standards-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.standards-badges span {
  padding: 8px 14px;
  border: 1px solid rgba(74, 163, 255, 0.45);
  border-radius: 6px;
  color: var(--accent-soft);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* =========================================================
   SEO & GEO (inline / slipped between sections)
========================================================= */
.seo-inline-block {
  padding: 28px 0;
}
.seo-inline-title {
  margin: 0 0 10px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1.1;
  color: var(--ink);
  text-align: center;
}
.seo-inline-desc {
  margin: 0 auto;
  max-width: 820px;
  text-align: center;
  font-size: 1.02rem;
  color: var(--muted);
}
.seo-inline-keywords .seo-geo-group {
  background: #fff;
}
.seo-geo-keywords {
  display: grid;
  gap: 22px;
}
.seo-geo-group {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px;
}
.seo-geo-label {
  margin: 0 0 14px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--ink);
}
.seo-geo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.seo-geo-tag {
  display: inline-block;
  padding: 7px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  font-size: 0.9rem;
  line-height: 1.3;
}

/* =========================================================
   FAQ
========================================================= */
.faq-list {
  display: grid;
  gap: 12px;
}
.faq {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}
.faq.open {
  border-color: var(--accent);
}
.faq-q {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: transparent;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
  color: var(--ink);
  cursor: pointer;
}
.faq-icon {
  flex-shrink: 0;
  font-size: 22px;
  color: var(--accent-dark);
  transition: transform 0.35s ease;
}
.faq.open .faq-icon {
  transform: rotate(45deg);
}
.faq-a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}
.faq.open .faq-a {
  grid-template-rows: 1fr;
}
.faq-a > div {
  overflow: hidden;
}
.faq-a p {
  margin: 0;
  padding: 0 24px 22px;
  color: var(--muted);
  font-size: 0.95rem;
}

/* =========================================================
   CTA
========================================================= */
.cta {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--ink);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
}
.cta-main {
  position: relative;
  z-index: 1;
}
.cta-main {
  padding: 44px 28px;
}
@media (min-width: 768px) {
  .cta-main {
    padding: 64px;
  }
}
.cta-main .eyebrow {
  display: block;
  margin-bottom: 18px;
}
.cta-main h2 {
  margin: 0 0 18px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.3rem, 5vw, 3.5rem);
  line-height: 1.02;
  color: #fff;
}
.cta-main p {
  margin: 0 0 32px;
  max-width: 460px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 1.05rem;
}
.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 640px) {
  .cta-actions {
    flex-direction: row;
  }
}
.cta-side {
  padding: 36px 28px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
@media (min-width: 768px) {
  .cta-side {
    padding: 48px;
  }
}
@media (min-width: 1024px) {
  .cta-side {
    border-top: 0;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
  }
}
.cta-side h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.6rem;
  color: #fff;
}
.cta-side h3 > :first-child {
  font-size: 26px;
  color: var(--accent);
}
.cta-side ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.cta-side li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}
.cta-side li::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.cta-side p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* =========================================================
   ANIMATION
========================================================= */
.fade-up {
  opacity: 0;
  transform: translateY(22px);
  animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
[data-reveal] {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal].reveal-pending {
  opacity: 0;
  transform: translateY(24px);
}
[data-reveal].reveal-pending.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .b-balls,
  .fade-up,
  .panel {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  [data-reveal],
  [data-reveal].reveal-pending {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
