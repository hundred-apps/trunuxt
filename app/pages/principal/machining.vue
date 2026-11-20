<template>
  <div ref="root" class="page" :class="{ 'reveal-on': revealReady }">
    <!-- ================= 1. HERO ================= -->
    <section class="hero">
      <div class="hero-bg">
        <img
          :src="HERO_IMAGE"
          alt=""
          class="hero-bg-img"
          width="1920"
          height="1080"
          sizes="100vw"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-grid"></div>

      <!-- Dekorasi roda gigi (hanya layar lebar) -->
      <Icon name="mdi:cog" class="hero-gear" aria-hidden="true" />

      <div class="wrap hero-content">
        <div class="hero-text">
          <div class="eyebrow-row fade-up">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-soft">Machining &amp; Fabrication</span>
          </div>

          <h1 class="hero-title fade-up" style="animation-delay: 100ms">
            {{ t("page.principal.machining.hero.titleLine1") }}
            <span class="accent">{{
              t("page.principal.machining.hero.titleLine2")
            }}</span>
          </h1>

          <p class="hero-desc fade-up" style="animation-delay: 200ms">
            {{ t("page.principal.machining.hero.subtitle") }}
          </p>

          <div class="hero-actions fade-up" style="animation-delay: 300ms">
            <button class="btn btn-accent" @click="scrollTo('contact')">
              {{ t("page.principal.machining.hero.ctaQuote") }}
              <Icon name="mdi:arrow-right" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('products')">
              {{ t("page.principal.machining.hero.ctaServices") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 2. STRIP KEMAMPUAN (dari data methods) ================= -->
    <section v-if="methods.length" class="wrap strip-wrap">
      <div class="strip" :style="{ '--n': methods.length }" data-reveal>
        <button
          v-for="(m, i) in methods"
          :key="i"
          type="button"
          class="strip-item"
          @click="goMethod(i)"
        >
          <Icon :name="m.icon" class="strip-icon" />
          <span>{{ m.title }}</span>
        </button>
      </div>
    </section>

    <!-- ================= 3. PRODUK ================= -->
    <section id="products" class="sec">
      <div class="wrap">
        <header class="sec-head center" data-reveal>
          <div class="eyebrow-row center">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-dark">01</span>
            <span class="eyebrow-line"></span>
          </div>
          <h2 class="sec-title">
            {{
              t("page.principal.machining.products.title") ||
              "Products We Can Make"
            }}
          </h2>
        </header>

        <div class="prod-grid">
          <article
            v-for="(product, index) in products"
            :key="index"
            class="prod-card"
            data-reveal
          >
            <div class="prod-tile">
              <span class="prod-num">{{
                String(index + 1).padStart(2, "0")
              }}</span>
              <img
                :src="product.image"
                :alt="product.name"
                class="prod-img"
                width="800"
                height="600"
                sizes="100vw md:600px"
                loading="lazy"
              />
            </div>
            <h3 class="prod-name">{{ product.name }}</h3>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 4. TENTANG MACHINING ================= -->
    <section id="aboutMachining" class="sec sec-white">
      <div class="wrap">
        <div class="about">
          <div class="about-text" data-reveal>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.machining.aboutMachining.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.machining.aboutMachining.title") }}
            </h2>
            <p class="about-desc">
              {{ t("page.principal.machining.aboutMachining.description") }}
            </p>

            <div class="hl-grid">
              <div
                v-for="(item, index) in aboutMachiningHighlights"
                :key="index"
                class="hl"
              >
                <div class="icon-box"><Icon :name="item.icon" /></div>
                <div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="about-media" data-reveal>
            <img
              :src="ABOUT_MACHINING_IMAGE"
              alt="Machining Excellence"
              class="about-img"
              width="800"
              height="600"
              sizes="100vw md:600px"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 5. TENTANG FABRIKASI ================= -->
    <section id="aboutFabrikasi" class="sec sec-dark">
      <div class="hero-grid"></div>
      <div class="wrap about-wrap">
        <div class="about reverse">
          <div class="about-media" data-reveal>
            <img
              :src="ABOUT_FABRICATION_IMAGE"
              alt="Fabrication Excellence"
              class="about-img"
              width="800"
              height="600"
              sizes="100vw md:600px"
              loading="lazy"
            />
          </div>

          <div class="about-text" data-reveal>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-soft">{{
                t("page.principal.machining.aboutFabrikasi.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title light">
              {{ t("page.principal.machining.aboutFabrikasi.title") }}
            </h2>
            <p class="about-desc light">
              {{ t("page.principal.machining.aboutFabrikasi.description") }}
            </p>

            <div class="hl-grid">
              <div
                v-for="(item, index) in aboutFabrikasiHighlights"
                :key="index"
                class="hl"
              >
                <div class="icon-box solid-soft">
                  <Icon :name="item.icon" />
                </div>
                <div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 6. INDUSTRI ================= -->
    <section id="industries" class="sec">
      <div class="wrap">
        <header class="sec-head center" data-reveal>
          <div class="eyebrow-row center">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-dark">02</span>
            <span class="eyebrow-line"></span>
          </div>
          <h2 class="sec-title">
            {{
              t("page.principal.machining.industries.title") ||
              "Industries We Serve"
            }}
          </h2>
        </header>

        <div class="ind-grid">
          <article
            v-for="(industry, index) in industries"
            :key="index"
            class="ind-card"
            data-reveal
          >
            <img
              :src="industry.image"
              :alt="industry.name"
              class="ind-img"
              width="800"
              height="600"
              sizes="100vw md:600px"
              loading="lazy"
            />
            <div class="ind-shade"></div>
            <div class="ind-label">
              <span class="ind-bar"></span>
              <h3>{{ industry.name }}</h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 7. METODE ================= -->
    <section id="methods" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.machining.methods.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.machining.methods.title") }}
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.machining.methods.subtitle") }}
          </p>
        </header>

        <div v-if="methods.length" class="m-layout">
          <div class="m-tabs" data-reveal>
            <button
              v-for="(m, i) in methods"
              :key="i"
              type="button"
              class="m-tab"
              :class="{ active: activeMethod === i }"
              @click="activeMethod = i"
            >
              <span class="m-tab-num">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <span class="m-tab-title">{{ m.title }}</span>
              <Icon name="mdi:arrow-right" class="m-tab-arrow" />
            </button>
          </div>

          <!-- panel TIDAK memakai data-reveal supaya tidak hilang saat ganti tab -->
          <div :key="activeMethod" class="m-panel">
            <div class="m-panel-head">
              <div class="icon-box solid">
                <Icon :name="currentMethod.icon" />
              </div>
              <h3>{{ currentMethod.title }}</h3>
            </div>
            <p class="m-panel-desc">{{ currentMethod.description }}</p>

            <ul v-if="currentMethod.features.length" class="m-features">
              <li v-for="(f, i) in currentMethod.features" :key="i">
                <Icon name="mdi:check-circle" />
                <span>{{ f }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 8. MATERIAL ================= -->
    <section id="materials" class="sec sec-sand">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.machining.materials.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.machining.materials.title") }}
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.machining.materials.subtitle") }}
          </p>
        </header>

        <div class="mat-list">
          <article
            v-for="(material, index) in materials"
            :key="index"
            class="mat-row"
            data-reveal
          >
            <div class="mat-name">
              <div class="icon-box"><Icon :name="material.icon" /></div>
              <h3>{{ material.name }}</h3>
            </div>
            <ul class="mat-grades">
              <li v-for="(grade, gIndex) in material.grades" :key="gIndex">
                {{ grade }}
              </li>
            </ul>
            <p class="mat-desc">{{ material.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 9. KONTAK ================= -->
    <section id="contact" class="sec">
      <div class="wrap">
        <div class="cta" data-reveal>
          <div class="hazard"></div>
          <div class="cta-body">
            <Icon name="mdi:cog" class="cta-gear" aria-hidden="true" />
            <div class="cta-content">
              <span class="eyebrow accent-soft">{{
                t("page.principal.machining.contact.title")
              }}</span>
              <h2>{{ t("page.principal.machining.contact.needTitle") }}</h2>
              <p>{{ t("page.principal.machining.contact.needDesc") }}</p>
              <div class="cta-actions">
                <button class="btn btn-accent" @click="handleContact">
                  <Icon name="mdi:whatsapp" />
                  {{ t("page.principal.machining.contact.whatsapp") }}
                </button>
                <button class="btn btn-ghost" @click="handleEmail">
                  <Icon name="mdi:email-outline" />
                  {{ t("page.principal.machining.contact.email") }}
                </button>
              </div>
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

// ============ GAMBAR ============
const HERO_IMAGE =
  "https://fe-migration.trumecs.com/principal/machining/hero-2.jpg";
const ABOUT_MACHINING_IMAGE =
  "https://fe-migration.trumecs.com/principal/machining/hero-machining.jpg";
const ABOUT_FABRICATION_IMAGE =
  "https://fe-migration.trumecs.com/principal/machining/fabrication.jpg";

// Helper: ambil array dari pesan i18n
const i18nArr = (key: string) => {
  const items = tm(key);
  if (!Array.isArray(items)) {
    // Membantu menemukan key i18n yang hilang (section tampak kosong)
    if (import.meta.dev)
      console.warn(`[i18n] key bukan array / belum ada: ${key}`);
    return [];
  }
  return items;
};

// ============ DATA (dari i18n) ============
const industries = computed(() =>
  i18nArr("page.principal.machining.industries.items").map((item: any) => ({
    name: rt(item.name),
    image: rt(item.image),
  }))
);

const products = computed(() =>
  i18nArr("page.principal.machining.products.items").map((item: any) => ({
    name: rt(item.name),
    image: rt(item.image),
  }))
);

const aboutMachiningHighlights = computed(() =>
  i18nArr("page.principal.machining.aboutMachining.highlights").map(
    (item: any) => ({
      title: rt(item.title),
      icon: rt(item.icon),
      description: rt(item.description),
    })
  )
);

const aboutFabrikasiHighlights = computed(() =>
  i18nArr("page.principal.machining.aboutFabrikasi.highlights").map(
    (item: any) => ({
      title: rt(item.title),
      icon: rt(item.icon),
      description: rt(item.description),
    })
  )
);

const methods = computed(() =>
  i18nArr("page.principal.machining.methods.items").map((item: any) => ({
    title: rt(item.title),
    icon: rt(item.icon),
    description: rt(item.description),
    features: Array.isArray(item.features)
      ? item.features.map((f: any) => rt(f))
      : [],
  }))
);

const materials = computed(() =>
  i18nArr("page.principal.machining.materials.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    description: rt(item.description),
    grades: Array.isArray(item.grades)
      ? item.grades.map((g: any) => rt(g))
      : [],
  }))
);

// ============ TAB METODE ============
const activeMethod = ref(0);
const currentMethod = computed(
  () =>
    methods.value[activeMethod.value] || {
      title: "",
      icon: "",
      description: "",
      features: [] as string[],
    }
);

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const goMethod = (i: number) => {
  activeMethod.value = i;
  scrollTo("methods");
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

// ============ SCROLL REVEAL (tahan i18n / render belakangan) ============
// Elemen baru yang dirender setelah mount (konten i18n, v-for) tetap diamati,
// dan konten hanya disembunyikan setelah JS siap, jadi tidak pernah hilang permanen.
const root = ref<HTMLElement | null>(null);
const revealReady = ref(false);
let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;

const observeNew = () => {
  if (!root.value || !io) return;
  root.value
    .querySelectorAll<HTMLElement>("[data-reveal]:not([data-observed])")
    .forEach((el) => {
      el.setAttribute("data-observed", "");
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io?.observe(el);
      }
    });
};

onMounted(() => {
  const reduce =
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  observeNew();
  revealReady.value = true;

  if (root.value) {
    mo = new MutationObserver(observeNew);
    mo.observe(root.value, { childList: true, subtree: true });
  }
});

onBeforeUnmount(() => {
  io?.disconnect();
  mo?.disconnect();
});

// ============ SEO ============
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/machining";

const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.machining.seo.title"),
  titleTemplate: "%s | Trumecs.com",
  htmlAttrs: computed(() => localeHead.value.htmlAttrs ?? {}),
  meta: computed(() => [
    ...(localeHead.value.meta ?? []),
    {
      name: "description",
      content: t("page.principal.machining.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.machining.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.machining.seo.description"),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ]),
  link: computed(() => [
    ...(localeHead.value.link ?? []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
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
        name: t("page.principal.machining.seo.title"),
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Machining & Fabrication Services",
    name: t("page.principal.machining.seo.title"),
    description: t("page.principal.machining.seo.description"),
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
/* =========================================================
   DESIGN TOKENS
========================================================= */
.page {
  --ink: #14171c;
  --ink-2: #1c2128;
  --accent: #fa8420;
  --accent-soft: #ffc08a;
  --accent-dark: #b4560a;
  --paper: #f5f3ef;
  --sand: #ebe6dd;
  --line: #e2ddd2;
  --muted: #5d6570;

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
.sec {
  position: relative;
  padding: 80px 0;
}
.sec-dark {
  background: var(--ink);
  color: #fff;
  overflow: hidden;
}
.sec-white {
  background: #fff;
}
.sec-sand {
  background: var(--sand);
}
@media (min-width: 1024px) {
  .sec {
    padding: 112px 0;
  }
}

.sec-head {
  display: grid;
  gap: 20px;
  margin-bottom: 48px;
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
  font-size: clamp(2.2rem, 4.6vw, 3.6rem);
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

/* Pita peringatan khas area kerja */
.hazard {
  height: 10px;
  background: repeating-linear-gradient(
    -45deg,
    var(--accent) 0 14px,
    var(--ink) 14px 28px
  );
}

.icon-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #fff3e6;
  border: 1px solid #f6d9b8;
  font-size: 26px;
  color: var(--accent-dark);
  transition: all 0.3s ease;
}
.icon-box.solid {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}
.icon-box.solid-soft {
  background: rgba(250, 132, 32, 0.14);
  border-color: rgba(250, 132, 32, 0.4);
  color: var(--accent);
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
  background: #ff9a45;
  box-shadow: 0 12px 28px -10px rgba(250, 132, 32, 0.65);
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
  min-height: 86vh;
  background: var(--ink);
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  animation: slowZoom 24s ease-in-out infinite alternate;
}
.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(20, 23, 28, 0.94) 0%,
      rgba(20, 23, 28, 0.76) 55%,
      rgba(20, 23, 28, 0.5) 100%
    ),
    linear-gradient(0deg, rgba(20, 23, 28, 0.9) 0%, transparent 40%);
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
.hero-gear {
  display: none;
  position: absolute;
  right: -150px;
  top: 50%;
  width: 540px;
  height: 540px;
  margin-top: -270px;
  color: rgba(250, 132, 32, 0.13);
  animation: spin 60s linear infinite;
}
@media (min-width: 1100px) {
  .hero-gear {
    display: block;
  }
}
.hero-content {
  position: relative;
  z-index: 2;
  padding-top: 120px;
  padding-bottom: 150px;
}
.hero-text {
  max-width: 700px;
}
.hero-title {
  font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.8rem, 7vw, 5.4rem);
  line-height: 1;
  color: #fff;
  margin: 0 0 28px;
}
.hero-title .accent {
  display: block;
}
.hero-desc {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.74);
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
   STRIP KEMAMPUAN
========================================================= */
.strip-wrap {
  position: relative;
  z-index: 5;
  margin-top: -56px;
}
.strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
@media (min-width: 768px) {
  .strip {
    grid-template-columns: repeat(var(--n, 5), 1fr);
  }
}
.strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 12px;
  background: var(--ink-2);
  color: #fff;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
}
.strip-item:hover {
  background: #252c35;
}
.strip-item:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}
@media (min-width: 768px) {
  .strip-item:last-child:nth-child(odd) {
    grid-column: auto;
  }
}
.strip-icon {
  font-size: 30px;
  color: var(--accent);
  transition: transform 0.3s ease;
}
.strip-item:hover .strip-icon {
  transform: translateY(-3px);
}

/* =========================================================
   PRODUK
========================================================= */
.prod-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 768px) {
  .prod-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
  }
}
.prod-card {
  text-align: center;
}
.prod-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 26px;
  margin-bottom: 14px;
  background-color: #fff;
  background-image: radial-gradient(rgba(20, 23, 28, 0.1) 1px, transparent 1px);
  background-size: 18px 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}
.prod-card:hover .prod-tile {
  transform: translateY(-4px);
  border-color: var(--accent);
  background-color: #fff6ec;
  box-shadow: 0 28px 48px -28px rgba(20, 23, 28, 0.35);
}
.prod-num {
  position: absolute;
  top: 12px;
  left: 14px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: rgba(20, 23, 28, 0.35);
}
.prod-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}
.prod-card:hover .prod-img {
  transform: scale(1.08);
}
.prod-name {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--ink);
}

/* =========================================================
   ABOUT (MACHINING & FABRIKASI)
========================================================= */
.about {
  display: grid;
  gap: 56px;
  align-items: center;
}
@media (min-width: 1024px) {
  .about {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
  }
}
.about-wrap {
  position: relative;
  z-index: 1;
}
.about-desc {
  margin: 22px 0 32px;
  color: var(--muted);
  font-size: 1.02rem;
}
.about-desc.light {
  color: rgba(255, 255, 255, 0.66);
}

.about-media {
  position: relative;
  padding: 0 14px 14px 0;
}
.about.reverse .about-media {
  padding: 0 0 14px 14px;
}
.about-media::before {
  content: "";
  position: absolute;
  top: 18px;
  left: 18px;
  right: 0;
  bottom: 0;
  border: 2px solid var(--accent);
  border-radius: 16px;
}
.about.reverse .about-media::before {
  left: 0;
  right: 18px;
}
.about-img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 30px 60px -30px rgba(20, 23, 28, 0.6);
}

.hl-grid {
  display: grid;
  gap: 24px 28px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .hl-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.hl {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.hl h4 {
  margin: 0 0 4px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--ink);
}
.hl p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--muted);
}
.sec-dark .hl h4 {
  color: #fff;
}
.sec-dark .hl p {
  color: rgba(255, 255, 255, 0.6);
}

/* =========================================================
   INDUSTRI
========================================================= */
.ind-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 768px) {
  .ind-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1100px) {
  .ind-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
.ind-card {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  background: var(--ink);
  cursor: pointer;
}
.ind-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}
.ind-card:hover .ind-img {
  transform: scale(1.08);
}
.ind-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(20, 23, 28, 0.92) 0%,
    rgba(20, 23, 28, 0.35) 50%,
    transparent 100%
  );
}
.ind-label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 18px;
}
.ind-bar {
  display: block;
  width: 28px;
  height: 3px;
  margin-bottom: 10px;
  background: var(--accent);
  transition: width 0.4s ease;
}
.ind-card:hover .ind-bar {
  width: 64px;
}
.ind-label h3 {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.35rem;
  line-height: 1.1;
  text-transform: uppercase;
  color: #fff;
}

/* =========================================================
   METODE
========================================================= */
.m-layout {
  display: grid;
  gap: 24px;
}
@media (min-width: 1024px) {
  .m-layout {
    grid-template-columns: 320px 1fr;
    gap: 32px;
    align-items: start;
  }
}
.m-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}
@media (min-width: 1024px) {
  .m-tabs {
    flex-direction: column;
    overflow: visible;
    padding-bottom: 0;
  }
}
.m-tab {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding: 16px 20px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--muted);
  text-align: left;
  cursor: pointer;
  transition: all 0.25s ease;
}
.m-tab:hover {
  border-color: var(--accent);
  color: var(--ink);
}
.m-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}
.m-tab-num {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  opacity: 0.6;
}
.m-tab-title {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  white-space: nowrap;
}
.m-tab-arrow {
  display: none;
  margin-left: auto;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s ease;
}
@media (min-width: 1024px) {
  .m-tab {
    width: 100%;
  }
  .m-tab-arrow {
    display: block;
  }
}
.m-tab.active .m-tab-arrow {
  opacity: 1;
  transform: translateX(0);
}

.m-panel {
  padding: 28px;
  color: #fff;
  background-color: var(--ink);
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(250, 132, 32, 0.07) 0 2px,
      transparent 2px 14px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(250, 132, 32, 0.07) 0 2px,
      transparent 2px 14px
    );
  border-radius: 16px;
  animation: panelIn 0.45s ease both;
}
@media (min-width: 768px) {
  .m-panel {
    padding: 44px;
  }
}
.m-panel-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.m-panel-head h3 {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 2.2rem;
  line-height: 1;
  text-transform: uppercase;
}
.m-panel-desc {
  margin: 0 0 30px;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.7);
}
.m-features {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  list-style: none;
  margin: 0;
  padding: 24px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
@media (min-width: 640px) {
  .m-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px 28px;
  }
}
.m-features li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.94rem;
  color: rgba(255, 255, 255, 0.9);
}
.m-features li > :first-child {
  flex-shrink: 0;
  margin-top: 3px;
  font-size: 18px;
  color: var(--accent);
}

/* =========================================================
   MATERIAL
========================================================= */
.mat-list {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
}
.mat-row {
  display: grid;
  gap: 14px;
  padding: 26px 28px;
  border-bottom: 1px solid var(--line);
  transition: background 0.25s ease;
}
.mat-row:last-child {
  border-bottom: 0;
}
.mat-row:hover {
  background: #fff8f0;
}
@media (min-width: 1024px) {
  .mat-row {
    grid-template-columns: 1.1fr 1fr 1.6fr;
    gap: 32px;
    align-items: center;
    padding: 26px 36px;
  }
}
.mat-name {
  display: flex;
  align-items: center;
  gap: 16px;
}
.mat-name h3 {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--ink);
}
.mat-row:hover .icon-box {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}
.mat-grades {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.mat-grades li {
  padding: 5px 12px;
  background: var(--ink);
  color: var(--accent);
  border-radius: 4px;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.mat-desc {
  margin: 0;
  font-size: 0.92rem;
  color: var(--muted);
}

/* =========================================================
   CTA
========================================================= */
.cta {
  background: var(--ink);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
}
.cta-body {
  position: relative;
  padding: 48px 28px;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 56px 56px;
}
@media (min-width: 768px) {
  .cta-body {
    padding: 72px 64px;
  }
}
.cta-gear {
  position: absolute;
  right: -90px;
  top: 50%;
  width: 380px;
  height: 380px;
  margin-top: -190px;
  color: rgba(250, 132, 32, 0.12);
  animation: spin 70s linear infinite;
}
.cta-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
}
.cta-content .eyebrow {
  display: block;
  margin-bottom: 18px;
}
.cta-content h2 {
  margin: 0 0 18px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.2rem, 4.8vw, 3.5rem);
  line-height: 1.02;
  color: #fff;
}
.cta-content p {
  margin: 0 0 32px;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.66);
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
   ANIMASI
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

/* Default: semua konten terlihat. Disembunyikan HANYA setelah JS siap (.reveal-on)
   dan elemen belum terpantau terlihat, sehingga tidak ada section yang hilang. */
[data-reveal] {
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-on [data-reveal]:not(.is-visible) {
  opacity: 0;
  transform: translateY(24px);
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg,
  .hero-gear,
  .cta-gear,
  .fade-up,
  .m-panel {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  [data-reveal],
  .reveal-on [data-reveal]:not(.is-visible) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
