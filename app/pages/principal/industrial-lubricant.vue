<template>
  <div class="page">
    <!-- ================= 1. HERO ================= -->
    <section class="hero">
      <div
        class="hero-bg"
        :style="{ backgroundImage: `url('${heroImage}')` }"
      ></div>
      <div class="hero-overlay"></div>
      <div class="hero-grid"></div>

      <!-- dekorasi gear + tetesan oli (hanya layar lebar) -->
      <div class="hero-gear-wrap" aria-hidden="true">
        <Icon name="mdi:cog" class="hero-gear" />
        <div class="oil-drips">
          <span class="oil-drop d1"></span>
          <span class="oil-drop d2"></span>
          <span class="oil-drop d3"></span>
        </div>
      </div>

      <div class="wrap hero-content">
        <div class="hero-text">
          <div class="eyebrow-row fade-up">
            <span class="eyebrow-line"></span>
            <span class="eyebrow amber-soft">{{
              t("page.principal.industrialLubricant.hero.eyebrow")
            }}</span>
          </div>

          <h1 class="hero-title fade-up" style="animation-delay: 100ms">
            {{ t("page.principal.industrialLubricant.hero.titleLine1") }}
            <span class="amber">{{
              t("page.principal.industrialLubricant.hero.titleLine2")
            }}</span>
          </h1>

          <p class="hero-desc fade-up" style="animation-delay: 200ms">
            {{ t("page.principal.industrialLubricant.hero.subtitle") }}
          </p>

          <div class="hero-actions fade-up" style="animation-delay: 300ms">
            <button class="btn btn-amber" @click="scrollTo('products')">
              {{ t("page.principal.industrialLubricant.hero.ctaBrowse") }}
              <Icon name="mdi:arrow-right" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('contact')">
              {{ t("page.principal.industrialLubricant.hero.ctaQuote") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 2. STATS ================= -->
    <section class="wrap stats-wrap">
      <div class="stats" data-reveal>
        <div v-for="(stat, index) in stats" :key="index" class="stat">
          <Icon :name="stat.icon" class="stat-icon" />
          <div class="stat-value">{{ stat.value }}</div>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ================= 3. PRODUCT TYPES ================= -->
    <section id="products" class="sec">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-dark">{{
                t("page.principal.industrialLubricant.types.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialLubricant.types.titleLine1") }}
              <span class="amber-dark">{{
                t("page.principal.industrialLubricant.types.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialLubricant.types.subtitle") }}
          </p>
        </header>

        <div class="filters" data-reveal>
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

        <div class="type-grid">
          <article
            v-for="item in filteredTypes"
            :key="item.name"
            class="type-card"
          >
            <div class="type-top">
              <div class="icon-box">
                <Icon :name="item.icon" />
              </div>
              <span class="tag">{{ groups[item.groupIdx] }}</span>
            </div>

            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-text">{{ item.description }}</p>

            <div class="specs">
              <div>
                <span class="spec-label">{{
                  t("page.principal.industrialLubricant.types.gradesLabel")
                }}</span>
                <span class="spec-value">{{ item.grades }}</span>
              </div>
              <div>
                <span class="spec-label">{{
                  t("page.principal.industrialLubricant.types.standardLabel")
                }}</span>
                <span class="spec-value">{{ item.standard }}</span>
              </div>
            </div>

            <ul class="chips">
              <li v-for="u in item.uses" :key="u">{{ u }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 4. APPLICATIONS ================= -->
    <section id="applications" class="sec sec-dark">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-soft">{{
                t(
                  "page.principal.industrialLubricant.applications.sectionLabel"
                )
              }}</span>
            </div>
            <h2 class="sec-title light">
              {{
                t("page.principal.industrialLubricant.applications.titleLine1")
              }}
              <span class="amber">{{
                t("page.principal.industrialLubricant.applications.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc light">
            {{ t("page.principal.industrialLubricant.applications.subtitle") }}
          </p>
        </header>

        <div class="app-layout">
          <div class="app-tabs" data-reveal>
            <button
              v-for="(ind, i) in industries"
              :key="ind.name"
              class="app-tab"
              :class="{ active: activeIndustry === i }"
              @click="activeIndustry = i"
            >
              <Icon :name="ind.icon" class="app-tab-icon" />
              <span>{{ ind.name }}</span>
            </button>
          </div>

          <!-- panel TIDAK memakai data-reveal supaya tidak hilang saat ganti tab -->
          <div :key="activeIndustry" class="panel">
            <div class="panel-head">
              <div class="icon-box solid">
                <Icon :name="currentIndustry.icon" />
              </div>
              <h3>{{ currentIndustry.name }}</h3>
            </div>
            <p class="panel-summary">{{ currentIndustry.summary }}</p>

            <div class="panel-cols">
              <div>
                <h4 class="panel-label">
                  {{
                    t(
                      "page.principal.industrialLubricant.applications.labelEquipment"
                    )
                  }}
                </h4>
                <ul class="panel-list">
                  <li v-for="e in currentIndustry.equipment" :key="e">
                    <Icon name="mdi:cog-outline" />
                    <span>{{ e }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="panel-label">
                  {{
                    t(
                      "page.principal.industrialLubricant.applications.labelLubricants"
                    )
                  }}
                </h4>
                <ul class="panel-list">
                  <li v-for="l in currentIndustry.lubricants" :key="l">
                    <Icon name="mdi:check-circle-outline" />
                    <span>{{ l }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="panel-tip">
              <Icon name="mdi:lightbulb-on-outline" />
              <p>{{ currentIndustry.tip }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 5. TECHNICAL REFERENCE ================= -->
    <section id="reference" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-dark">{{
                t("page.principal.industrialLubricant.reference.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialLubricant.reference.titleLine1") }}
              <span class="amber-dark">{{
                t("page.principal.industrialLubricant.reference.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialLubricant.reference.subtitle") }}
          </p>
        </header>

        <div class="table-grid">
          <div class="table-card" data-reveal>
            <h3 class="card-title">
              {{
                t("page.principal.industrialLubricant.reference.viscosityTitle")
              }}
            </h3>
            <p class="card-sub">
              {{
                t("page.principal.industrialLubricant.reference.viscositySub")
              }}
            </p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{
                        t(
                          "page.principal.industrialLubricant.reference.colGrade"
                        )
                      }}
                    </th>
                    <th>
                      {{
                        t("page.principal.industrialLubricant.reference.colCst")
                      }}
                    </th>
                    <th>
                      {{
                        t("page.principal.industrialLubricant.reference.colUse")
                      }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in viscosityRows" :key="row.grade">
                    <td>
                      <span class="badge">{{ row.grade }}</span>
                    </td>
                    <td class="strong">{{ row.cst }}</td>
                    <td>{{ row.use }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="table-card" data-reveal>
            <h3 class="card-title">
              {{ t("page.principal.industrialLubricant.reference.nlgiTitle") }}
            </h3>
            <p class="card-sub">
              {{ t("page.principal.industrialLubricant.reference.nlgiSub") }}
            </p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{
                        t(
                          "page.principal.industrialLubricant.reference.colNlgi"
                        )
                      }}
                    </th>
                    <th>
                      {{
                        t(
                          "page.principal.industrialLubricant.reference.colFeel"
                        )
                      }}
                    </th>
                    <th>
                      {{
                        t("page.principal.industrialLubricant.reference.colUse")
                      }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in nlgiRows" :key="row.grade">
                    <td>
                      <span class="badge">{{ row.grade }}</span>
                    </td>
                    <td class="strong">{{ row.feel }}</td>
                    <td>{{ row.use }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="note">
              {{ t("page.principal.industrialLubricant.reference.nlgiNote") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 6. SELECTION GUIDE ================= -->
    <section id="selection" class="sec sec-sand">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-dark">{{
                t("page.principal.industrialLubricant.selection.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialLubricant.selection.titleLine1") }}
              <span class="amber-dark">{{
                t("page.principal.industrialLubricant.selection.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialLubricant.selection.subtitle") }}
          </p>
        </header>

        <div class="step-grid">
          <div
            v-for="(step, i) in selectionSteps"
            :key="step.title"
            class="step"
            data-reveal
          >
            <span class="step-num">0{{ i + 1 }}</span>
            <Icon :name="step.icon" class="step-icon" />
            <h3 class="card-title">{{ step.title }}</h3>
            <p class="card-text">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 7. MAINTENANCE & STANDARDS ================= -->
    <section id="care" class="sec">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-dark">{{
                t("page.principal.industrialLubricant.care.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialLubricant.care.titleLine1") }}
              <span class="amber-dark">{{
                t("page.principal.industrialLubricant.care.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.industrialLubricant.care.subtitle") }}
          </p>
        </header>

        <div class="care-grid">
          <div
            v-for="item in careItems"
            :key="item.title"
            class="care-card"
            data-reveal
          >
            <div class="icon-box">
              <Icon :name="item.icon" />
            </div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.description }}</p>
          </div>
        </div>

        <div class="standards" data-reveal>
          <div class="standards-text">
            <h3>
              {{ t("page.principal.industrialLubricant.care.standardsTitle") }}
            </h3>
            <p>
              {{ t("page.principal.industrialLubricant.care.standardsDesc") }}
            </p>
          </div>
          <div class="standards-badges">
            <span v-for="s in standards" :key="s">{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 8. FAQ ================= -->
    <section id="faq" class="sec sec-white">
      <div class="wrap narrow">
        <header class="sec-head center" data-reveal>
          <div>
            <div class="eyebrow-row center">
              <span class="eyebrow-line"></span>
              <span class="eyebrow amber-dark">{{
                t("page.principal.industrialLubricant.faq.sectionLabel")
              }}</span>
              <span class="eyebrow-line"></span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.industrialLubricant.faq.title") }}
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

    <!-- ================= 9. CONTACT ================= -->
    <section id="contact" class="sec">
      <div class="wrap">
        <div class="cta" data-reveal>
          <div class="hero-grid"></div>
          <div class="cta-main">
            <span class="eyebrow amber-soft">{{
              t("page.principal.industrialLubricant.contact.eyebrow")
            }}</span>
            <h2>
              {{ t("page.principal.industrialLubricant.contact.titleLine1") }}
              <span class="amber">{{
                t("page.principal.industrialLubricant.contact.titleLine2")
              }}</span>
            </h2>
            <p>
              {{ t("page.principal.industrialLubricant.contact.desc") }}
            </p>
            <div class="cta-actions">
              <button class="btn btn-amber" @click="handleContact">
                <Icon name="mdi:whatsapp" />
                {{ t("page.principal.industrialLubricant.contact.whatsapp") }}
              </button>
              <button class="btn btn-ghost" @click="handleEmail">
                <Icon name="mdi:email-outline" />
                {{ t("page.principal.industrialLubricant.contact.email") }}
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

const heroImage = "/principal/lubricant/hero-lubricant.jpg";

// Helper: ambil array dari pesan i18n
const i18nArr = (key: string) => {
  const items = tm(key);
  return Array.isArray(items) ? items : [];
};

// ============ DATA (dari i18n) ============
const stats = computed(() =>
  i18nArr("page.principal.industrialLubricant.stats.items").map(
    (item: any) => ({
      icon: rt(item.icon),
      value: rt(item.value),
      label: rt(item.label),
    })
  )
);

const groups = computed(() =>
  i18nArr("page.principal.industrialLubricant.groups.items").map((g: any) =>
    rt(g)
  )
);
const activeGroup = ref(0);

const types = computed(() =>
  i18nArr("page.principal.industrialLubricant.types.items").map(
    (item: any) => ({
      name: rt(item.name),
      icon: rt(item.icon),
      groupIdx: Number(rt(item.groupIdx)) || 0,
      description: rt(item.description),
      grades: rt(item.grades),
      standard: rt(item.standard),
      uses: Array.isArray(item.uses) ? item.uses.map((u: any) => rt(u)) : [],
    })
  )
);

const filteredTypes = computed(() =>
  activeGroup.value === 0
    ? types.value
    : types.value.filter((item) => item.groupIdx === activeGroup.value)
);

const activeIndustry = ref(0);
const industries = computed(() =>
  i18nArr("page.principal.industrialLubricant.applications.items").map(
    (item: any) => ({
      name: rt(item.name),
      icon: rt(item.icon),
      summary: rt(item.summary),
      equipment: Array.isArray(item.equipment)
        ? item.equipment.map((e: any) => rt(e))
        : [],
      lubricants: Array.isArray(item.lubricants)
        ? item.lubricants.map((l: any) => rt(l))
        : [],
      tip: rt(item.tip),
    })
  )
);
const currentIndustry = computed(
  () =>
    industries.value[activeIndustry.value] || {
      name: "",
      icon: "",
      summary: "",
      equipment: [],
      lubricants: [],
      tip: "",
    }
);

const viscosityRows = computed(() =>
  i18nArr("page.principal.industrialLubricant.reference.viscosityRows").map(
    (row: any) => ({
      grade: rt(row.grade),
      cst: rt(row.cst),
      use: rt(row.use),
    })
  )
);

const nlgiRows = computed(() =>
  i18nArr("page.principal.industrialLubricant.reference.nlgiRows").map(
    (row: any) => ({
      grade: rt(row.grade),
      feel: rt(row.feel),
      use: rt(row.use),
    })
  )
);

const selectionSteps = computed(() =>
  i18nArr("page.principal.industrialLubricant.selection.items").map(
    (item: any) => ({
      icon: rt(item.icon),
      title: rt(item.title),
      description: rt(item.description),
    })
  )
);

const careItems = computed(() =>
  i18nArr("page.principal.industrialLubricant.care.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

// Spesifikasi standar bersifat bahasa netral
const standards = [
  "ISO 6743",
  "ISO 11158",
  "DIN 51524",
  "DIN 51517",
  "DIN 51515",
  "AGMA 9005",
  "NSF H1",
  "ISO 21469",
  "NLGI",
  "ISO 4406",
];

const faqs = computed(() =>
  i18nArr("page.principal.industrialLubricant.faq.items").map((f: any) => ({
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
    t("page.principal.industrialLubricant.contact.waText")
  );
  window.open(`https://wa.me/6285176912338?text=${text}`, "_blank");
};

const handleEmail = () => {
  const subject = encodeURIComponent(
    t("page.principal.industrialLubricant.contact.emailSubject")
  );
  window.location.href = `mailto:info@trumecs.com?subject=${subject}`;
};

// ============ SCROLL REVEAL ============
let observer: IntersectionObserver | null = null;

onMounted(() => {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => observer?.observe(el));
});

onBeforeUnmount(() => observer?.disconnect());

// ============ SEO ============
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/industrial-lubricant";

const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.industrialLubricant.seo.title"),
  titleTemplate: "%s",
  htmlAttrs: computed(() => localeHead.value.htmlAttrs ?? {}),
  link: computed(() => [
    ...(localeHead.value.link ?? []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ]),
  meta: computed(() => [
    ...(localeHead.value.meta ?? []),
    {
      name: "description",
      content: t("page.principal.industrialLubricant.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.industrialLubricant.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.industrialLubricant.seo.description"),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ]),
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
        name: t("page.principal.industrialLubricant.seo.title"),
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Industrial Lubricant Supply",
    name: t("page.principal.industrialLubricant.seo.title"),
    description: t("page.principal.industrialLubricant.seo.description"),
    url: `${SITE_URL}${PAGE_PATH}`,
    provider: {
      "@type": "Organization",
      name: "Trumecs",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Indonesia" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.value.map((f: any) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
/* =========================================================
   DESIGN TOKENS
========================================================= */
.page {
  --ink: #14171a;
  --ink-2: #1b1f23;
  --amber: #f5a524;
  --amber-soft: #f5c366;
  --amber-dark: #b8720a;
  --paper: #f4f2ee;
  --sand: #ebe7dd;
  --line: #e2ddd0;
  --muted: #566069;

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
  padding: 96px 0;
}
.sec-dark {
  background: var(--ink);
  color: #fff;
}
.sec-white {
  background: #fff;
}
.sec-sand {
  background: var(--sand);
}
@media (min-width: 1024px) {
  .sec {
    padding: 128px 0;
  }
}

/* Header section: judul kiri, deskripsi kanan, sejajar bawah */
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
  font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.4rem, 5vw, 3.9rem);
  line-height: 1.02;
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
  background: var(--amber);
}
.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 600;
}
.amber {
  color: var(--amber);
}
.amber-soft {
  color: var(--amber-soft);
}
.amber-dark {
  color: var(--amber-dark);
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
.btn-amber {
  background: var(--amber);
  border: 1px solid var(--amber);
  color: var(--ink);
}
.btn-amber:hover {
  background: #ffbc4d;
  box-shadow: 0 12px 28px -10px rgba(245, 165, 36, 0.6);
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
.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  animation: slowZoom 24s ease-in-out infinite alternate;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(14, 16, 18, 0.96) 0%,
      rgba(14, 16, 18, 0.78) 55%,
      rgba(14, 16, 18, 0.5) 100%
    ),
    linear-gradient(0deg, rgba(14, 16, 18, 0.9) 0%, transparent 35%);
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
.hero-gear-wrap {
  display: none;
  position: absolute;
  right: -140px;
  top: 50%;
  width: 520px;
  height: 520px;
  margin-top: -260px;
  pointer-events: none;
}
@media (min-width: 1100px) {
  .hero-gear-wrap {
    display: block;
  }
}
.hero-gear {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: rgba(245, 165, 36, 0.13);
  animation: spin 60s linear infinite;
}
.oil-drips {
  position: absolute;
  left: 118px;
  bottom: 118px;
  width: 72px;
  height: 170px;
}
.oil-drop {
  position: absolute;
  top: 0;
  width: 10px;
  height: 14px;
  background: linear-gradient(180deg, #ffd27a 0%, #f5a524 55%, #b8720a 100%);
  border-top-left-radius: 50% 35%;
  border-top-right-radius: 50% 35%;
  border-bottom-right-radius: 55% 65%;
  border-bottom-left-radius: 55% 65%;
  opacity: 0;
  filter: drop-shadow(0 2px 4px rgba(245, 165, 36, 0.25));
  animation: oilDrip 2.8s ease-in infinite;
}
.oil-drop::after {
  content: "";
  position: absolute;
  top: -7px;
  left: 50%;
  width: 5px;
  height: 8px;
  margin-left: -2.5px;
  background: rgba(245, 165, 36, 0.85);
  border-top-left-radius: 50% 60%;
  border-top-right-radius: 50% 60%;
  border-bottom-right-radius: 40% 40%;
  border-bottom-left-radius: 40% 40%;
}
.oil-drop.d1 {
  left: 8px;
  animation-delay: 0s;
}
.oil-drop.d2 {
  left: 30px;
  width: 8px;
  height: 11px;
  animation-delay: 0.95s;
}
.oil-drop.d3 {
  left: 50px;
  width: 9px;
  height: 13px;
  animation-delay: 1.8s;
}
@keyframes oilDrip {
  0% {
    transform: translateY(0) scaleY(0.7);
    opacity: 0;
  }
  12% {
    opacity: 0.95;
  }
  55% {
    transform: translateY(70px) scaleY(1);
    opacity: 0.9;
  }
  80% {
    transform: translateY(120px) scaleY(1.08);
    opacity: 0.35;
  }
  100% {
    transform: translateY(150px) scaleY(1.15);
    opacity: 0;
  }
}
.hero-content {
  position: relative;
  z-index: 2;
  padding-top: 120px;
  padding-bottom: 150px;
}
.hero-text {
  max-width: 720px;
}
.hero-title {
  font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(3.1rem, 8vw, 6rem);
  line-height: 0.98;
  color: #fff;
  margin: 0 0 28px;
}
.hero-title .amber {
  display: block;
}
.hero-desc {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.72);
  max-width: 560px;
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

/* =========================================================
   STATS
========================================================= */
.stats-wrap {
  position: relative;
  z-index: 5;
  margin-top: -64px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: var(--ink-2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
@media (min-width: 768px) {
  .stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
.stat {
  text-align: center;
  padding: 36px 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.stats .stat:nth-child(2n) {
  border-right: 0;
}
.stats .stat:nth-last-child(-n + 2) {
  border-bottom: 0;
}
@media (min-width: 768px) {
  .stats .stat {
    border-bottom: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
  .stats .stat:nth-child(2n) {
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
  .stats .stat:last-child {
    border-right: 0;
  }
}
.stat-icon {
  font-size: 26px;
  color: var(--amber);
  margin-bottom: 10px;
}
.stat-value {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  font-size: 3rem;
  line-height: 1;
  color: #fff;
  margin-bottom: 8px;
}
.stat-label {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

/* =========================================================
   SHARED CARD PIECES
========================================================= */
.card-title {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.7rem;
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
  border: 1px solid #ddd6c4;
  font-size: 26px;
  color: var(--ink);
  transition: all 0.3s ease;
}
.icon-box.solid {
  background: var(--amber);
  border-color: var(--amber);
}

/* =========================================================
   PRODUCTS
========================================================= */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 36px;
}
.filter {
  padding: 10px 20px;
  border: 1px solid #cfc9bb;
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
  color: var(--amber);
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
  background: var(--amber);
  transition: width 0.4s ease;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px -28px rgba(20, 23, 26, 0.35);
}
.type-card:hover::before {
  width: 100%;
}
.type-card:hover .icon-box {
  background: var(--amber);
  border-color: var(--amber);
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
  color: #8a8f94;
}
.specs {
  display: grid;
  gap: 14px;
  margin: 22px 0 20px;
  padding: 16px 0;
  border-top: 1px solid #ece7da;
  border-bottom: 1px solid #ece7da;
}
.spec-label {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8a8f94;
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
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s ease;
}
.app-tab:hover {
  border-color: rgba(245, 165, 36, 0.55);
  color: #fff;
}
.app-tab.active {
  background: var(--amber);
  border-color: var(--amber);
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
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 2.2rem;
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
  color: var(--amber-soft);
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
  color: var(--amber);
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
  color: var(--amber);
}
.panel-tip p {
  margin: 0;
}

/* =========================================================
   TABLES
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
  color: #8a8f94;
  border-bottom: 2px solid var(--ink);
}
td {
  padding: 13px 12px 13px 0;
  vertical-align: top;
  color: var(--muted);
  border-bottom: 1px solid #e4dfd2;
}
td.strong {
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
}
.badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--ink);
  color: var(--amber);
  border-radius: 4px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}
.note {
  margin: 20px 0 0;
  font-size: 0.78rem;
  color: #7a838b;
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
.step {
  position: relative;
  padding: 32px 26px;
  background: var(--paper);
  border: 1px solid #d9d3c3;
  border-radius: 14px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}
.step:hover {
  transform: translateY(-4px);
  border-color: var(--amber);
}
.step-num {
  position: absolute;
  right: 18px;
  top: 8px;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 700;
  font-size: 4.2rem;
  line-height: 1;
  color: rgba(20, 23, 26, 0.07);
}
.step-icon {
  display: block;
  font-size: 34px;
  color: var(--amber-dark);
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
.care-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 28px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.care-card .icon-box {
  margin-bottom: 20px;
}
.care-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px -28px rgba(20, 23, 26, 0.35);
}
.care-card:hover .icon-box {
  background: var(--amber);
  border-color: var(--amber);
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
  font-family: "Barlow Condensed", sans-serif;
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
  border: 1px solid rgba(245, 165, 36, 0.4);
  border-radius: 6px;
  color: var(--amber-soft);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
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
  border-color: var(--amber);
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
  color: var(--amber-dark);
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
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1;
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
@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
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
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg,
  .hero-gear,
  .oil-drop,
  .fade-up,
  .panel {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .oil-drips {
    display: none;
  }
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
