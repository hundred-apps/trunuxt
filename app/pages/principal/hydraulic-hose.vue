<template>
  <div ref="root" class="page" :class="{ 'reveal-on': revealReady }">
    <!-- ================= 1. HERO ================= -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-grid"></div>

      <!-- Ilustrasi penampang selang hidrolik (dekoratif) -->
      <div class="hose" aria-hidden="true">
        <div class="h-cover"></div>
        <div class="h-braid h-braid-a"></div>
        <div class="h-braid h-braid-b"></div>
        <div class="h-tube"></div>
        <div class="h-core"></div>
      </div>

      <div class="wrap hero-content">
        <div class="hero-text">
          <div class="eyebrow-row fade-up">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-soft">{{ t("page.principal.hydraulicHose.hero.eyebrow") }}</span>
          </div>

          <h1 class="hero-title fade-up" style="animation-delay: 100ms">
            {{ t("page.principal.hydraulicHose.hero.titleLine1") }}
            <span class="accent">{{ t("page.principal.hydraulicHose.hero.titleLine2") }}</span>
          </h1>

          <p class="hero-desc fade-up" style="animation-delay: 200ms">
            {{ t("page.principal.hydraulicHose.hero.subtitle") }}
          </p>

          <div class="hero-actions fade-up" style="animation-delay: 300ms">
            <button class="btn btn-accent" @click="scrollTo('produk')">
              {{ t("page.principal.hydraulicHose.hero.ctaProducts") }}
              <Icon name="mdi:arrow-right" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('kontak')">
              {{ t("page.principal.hydraulicHose.hero.ctaQuote") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 2. USP ================= -->
    <section class="wrap usp-wrap">
      <div class="usp" data-reveal>
        <div v-for="item in usps" :key="item.title" class="usp-item">
          <Icon :name="item.icon" class="usp-icon" />
          <div class="usp-title">{{ item.title }}</div>
          <p class="usp-desc">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- ================= 3. KATEGORI PRODUK ================= -->
    <section id="produk" class="sec">
      <div class="wrap narrow seo-inline" data-reveal>
        <h2 class="seo-inline-title">
          {{ t("page.principal.hydraulicHose.products.seoTitle") }}
        </h2>
        <p class="seo-inline-desc">
          {{ t("page.principal.hydraulicHose.products.seoDesc") }}
        </p>
      </div>

      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{ t("page.principal.hydraulicHose.products.sectionLabel") }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.hydraulicHose.products.titleLine1") }}
              <span class="accent-dark">{{ t("page.principal.hydraulicHose.products.titleLine2") }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.hydraulicHose.products.subtitle") }}
          </p>
        </header>

        <div class="toolbar" data-reveal>
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
              :placeholder="t('page.principal.hydraulicHose.products.searchPlaceholder')"
              :aria-label="t('page.principal.hydraulicHose.products.searchAria')"
            />
          </div>
        </div>

        <div class="cat-grid">
          <button
            v-for="cat in filteredCategories"
            :key="cat.name"
            type="button"
            class="cat-card"
            @click="openDetail(cat)"
          >
            <div class="cat-visual">
              <img
                v-if="cat.image"
                :src="cat.image"
                :alt="cat.name"
                class="cat-img"
                loading="lazy"
              />
              <div v-else class="cat-placeholder">
                <Icon :name="cat.icon" />
              </div>
              <span class="cat-group">{{ groups[cat.groupIdx] }}</span>
            </div>
            <div class="cat-body">
              <h3 class="cat-name">{{ cat.name }}</h3>
              <p class="cat-meta">{{ cat.range }}</p>
              <p class="cat-desc">{{ cat.description }}</p>
              <span class="cat-link">
                {{ (cat.products?.length || 0) }} {{ t("page.principal.hydraulicHose.products.examplesLabel") }}
                <Icon name="mdi:arrow-right" />
              </span>
            </div>
          </button>
        </div>

        <p v-if="filteredCategories.length === 0" class="no-results">
          {{ t("page.principal.hydraulicHose.products.noResults") }}
        </p>
      </div>
    </section>

    <!-- ================= 4. PERBANDINGAN SELANG ================= -->
    <section id="bandingkan" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{ t("page.principal.hydraulicHose.compare.sectionLabel") }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.hydraulicHose.compare.titleLine1") }}
              <span class="accent-dark">{{ t("page.principal.hydraulicHose.compare.titleLine2") }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.hydraulicHose.compare.subtitle") }}
          </p>
        </header>

        <div class="table-card" data-reveal>
          <div class="table-scroll">
            <table class="matrix">
              <thead>
                <tr>
                  <th>{{ t("page.principal.hydraulicHose.compare.thHose") }}</th>
                  <th v-for="rk in ratingKeys" :key="rk.key">{{ rk.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in hoseCategories" :key="cat.name">
                  <td class="strong">{{ cat.name }}</td>
                  <td v-for="rk in ratingKeys" :key="rk.key">
                    <span class="dots" :aria-label="`${cat.ratings[rk.key]} / 4`">
                      <i v-for="d in 4" :key="d" :class="{ on: d <= cat.ratings[rk.key] }"></i>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="note">{{ t("page.principal.hydraulicHose.compare.note") }}</p>
        </div>
      </div>
    </section>

    <!-- ================= 5. RAKITAN SELANG ================= -->
    <section id="rakit" class="sec sec-dark">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-soft">{{ t("page.principal.hydraulicHose.assembly.sectionLabel") }}</span>
            </div>
            <h2 class="sec-title light">
              {{ t("page.principal.hydraulicHose.assembly.titleLine1") }}
              <span class="accent">{{ t("page.principal.hydraulicHose.assembly.titleLine2") }}</span>
            </h2>
          </div>
          <p class="sec-desc light">{{ t("page.principal.hydraulicHose.assembly.subtitle") }}</p>
        </header>

        <ol class="steps">
          <li v-for="(s, i) in assemblySteps" :key="s.title" class="step" data-reveal>
            <div class="step-badge">
              <Icon :name="s.icon" />
              <span>{{ i + 1 }}</span>
            </div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ================= 6. REFERENSI TEKNIS ================= -->
    <section id="referensi" class="sec">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{ t("page.principal.hydraulicHose.reference.sectionLabel") }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.hydraulicHose.reference.titleLine1") }}
              <span class="accent-dark">{{ t("page.principal.hydraulicHose.reference.titleLine2") }}</span>
            </h2>
          </div>
          <p class="sec-desc">{{ t("page.principal.hydraulicHose.reference.subtitle") }}</p>
        </header>

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

        <div class="table-grid">
          <div class="table-card" data-reveal>
            <h3 class="card-title">{{ t("page.principal.hydraulicHose.reference.sizeTitle") }}</h3>
            <p class="card-sub">{{ t("page.principal.hydraulicHose.reference.sizeSub") }}</p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{{ t("page.principal.hydraulicHose.reference.thDn") }}</th>
                    <th>{{ t("page.principal.hydraulicHose.reference.thDash") }}</th>
                    <th>{{ t("page.principal.hydraulicHose.reference.thInch") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in sizeRows" :key="row.dash">
                    <td><span class="badge">DN{{ row.dn }}</span></td>
                    <td class="strong">{{ row.dash }}</td>
                    <td>{{ row.inch }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="table-card" data-reveal>
            <h3 class="card-title">{{ t("page.principal.hydraulicHose.reference.threadTitle") }}</h3>
            <p class="card-sub">{{ t("page.principal.hydraulicHose.reference.threadSub") }}</p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{{ t("page.principal.hydraulicHose.reference.thType") }}</th>
                    <th>{{ t("page.principal.hydraulicHose.reference.thSeal") }}</th>
                    <th>{{ t("page.principal.hydraulicHose.reference.thNote") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in threadRows" :key="row.code">
                    <td><span class="badge">{{ row.code }}</span></td>
                    <td class="strong">{{ row.seal }}</td>
                    <td>{{ row.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="note">{{ t("page.principal.hydraulicHose.reference.threadNote") }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 7. PEMILIHAN & PERAWATAN ================= -->
    <section id="pemilihan" class="sec sec-sand">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{ t("page.principal.hydraulicHose.selection.sectionLabel") }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.hydraulicHose.selection.titleLine1") }}
              <span class="accent-dark">{{ t("page.principal.hydraulicHose.selection.titleLine2") }}</span>
            </h2>
          </div>
          <p class="sec-desc">{{ t("page.principal.hydraulicHose.selection.subtitle") }}</p>
        </header>

        <div class="two-col">
          <div data-reveal>
            <h3 class="subsec-title">{{ t("page.principal.hydraulicHose.selection.factorsTitle") }}</h3>
            <div class="mini-grid">
              <div v-for="f in selectionFactors" :key="f.title" class="mini-card">
                <div class="icon-box"><Icon :name="f.icon" /></div>
                <h3 class="card-title">{{ f.title }}</h3>
                <p class="card-text">{{ f.description }}</p>
              </div>
            </div>
          </div>

          <div data-reveal>
            <h3 class="subsec-title">{{ t("page.principal.hydraulicHose.selection.failureTitle") }}</h3>
            <div class="mini-grid">
              <div v-for="f in failureItems" :key="f.title" class="mini-card">
                <div class="icon-box"><Icon :name="f.icon" /></div>
                <h3 class="card-title">{{ f.title }}</h3>
                <p class="card-text">{{ f.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="notice" data-reveal>
          <Icon name="mdi:alert-outline" />
          <div>
            <b>{{ t("page.principal.hydraulicHose.selection.warningTitle") }}</b>
            <p>{{ t("page.principal.hydraulicHose.selection.warningDesc") }}</p>
          </div>
        </div>

        <div class="standards" data-reveal>
          <div class="standards-text">
            <h3>{{ t("page.principal.hydraulicHose.selection.standardsTitle") }}</h3>
            <p>{{ t("page.principal.hydraulicHose.selection.standardsDesc") }}</p>
          </div>
          <div class="standards-badges">
            <span v-for="s in standardsList" :key="s">{{ s }}</span>
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
              <span class="eyebrow accent-dark">{{ t("page.principal.hydraulicHose.faq.sectionLabel") }}</span>
              <span class="eyebrow-line"></span>
            </div>
            <h2 class="sec-title">{{ t("page.principal.hydraulicHose.faq.title") }}</h2>
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

    <!-- ================= 9. KONTAK ================= -->
    <section id="kontak" class="sec">
      <div class="wrap">
        <div class="cta" data-reveal>
          <div class="cta-grid">
            <div class="cta-main">
              <span class="eyebrow accent-soft">{{ t("page.principal.hydraulicHose.contact.sectionLabel") }}</span>
              <h2>
                {{ t("page.principal.hydraulicHose.contact.titleLine1") }}
                <span class="accent">{{ t("page.principal.hydraulicHose.contact.titleLine2") }}</span>
              </h2>
              <p>{{ t("page.principal.hydraulicHose.contact.subtitle") }}</p>
              <div class="cta-actions">
                <button class="btn btn-accent" @click="handleContact">
                  <Icon name="mdi:whatsapp" />
                  {{ t("page.principal.hydraulicHose.contact.whatsapp") }}
                </button>
                <button class="btn btn-ghost" @click="handleEmail">
                  <Icon name="mdi:email-outline" />
                  {{ t("page.principal.hydraulicHose.contact.email") }}
                </button>
              </div>
            </div>

            <form class="cta-form" @submit.prevent="submitRequest">
              <h3>{{ t("page.principal.hydraulicHose.contact.formTitle") }}</h3>

              <label class="field">
                <span>{{ t("page.principal.hydraulicHose.contact.fieldProduct") }} <em>{{ t("page.principal.hydraulicHose.contact.required") }}</em></span>
                <input
                  v-model.trim="form.product"
                  type="text"
                  list="product-options"
                  :placeholder="t('page.principal.hydraulicHose.contact.phProduct')"
                />
                <datalist id="product-options">
                  <option v-for="p in productOptions" :key="p" :value="p"></option>
                </datalist>
              </label>

              <div class="field-row">
                <label class="field">
                  <span>{{ t("page.principal.hydraulicHose.contact.fieldSpec") }}</span>
                  <input
                    v-model.trim="form.spec"
                    type="text"
                    :placeholder="t('page.principal.hydraulicHose.contact.phSpec')"
                  />
                </label>
                <label class="field field-qty">
                  <span>{{ t("page.principal.hydraulicHose.contact.fieldQty") }} <em>{{ t("page.principal.hydraulicHose.contact.required") }}</em></span>
                  <input
                    v-model.number="form.qty"
                    type="number"
                    min="1"
                    :placeholder="t('page.principal.hydraulicHose.contact.phQty')"
                  />
                </label>
              </div>

              <label class="field">
                <span>{{ t("page.principal.hydraulicHose.contact.fieldNote") }}</span>
                <textarea
                  v-model.trim="form.note"
                  rows="3"
                  :placeholder="t('page.principal.hydraulicHose.contact.phNote')"
                ></textarea>
              </label>

              <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

              <button type="submit" class="btn btn-accent btn-block">
                <Icon name="mdi:whatsapp" />
                {{ t("page.principal.hydraulicHose.contact.submit") }}
              </button>
              <p class="form-hint">{{ t("page.principal.hydraulicHose.contact.formHint") }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= DETAIL MODAL (bearing style) ================= -->
    <div
      v-if="selected"
      class="detail-modal"
      role="dialog"
      aria-modal="true"
      @click.self="closeDetail"
    >
      <div class="detail-dialog">
        <button
          type="button"
          class="detail-close"
          :aria-label="t('page.principal.hydraulicHose.detail.close')"
          @click="closeDetail"
        >
          <Icon name="mdi:close" />
        </button>

        <div class="detail-header">
          <div class="detail-hero-image-wrap">
            <img
              v-if="selected.image"
              :src="selected.image"
              :alt="selected.name"
              class="detail-hero-image"
            />
            <div v-else class="detail-hero-placeholder">
              <Icon :name="selected.icon" />
            </div>
          </div>
          <div class="detail-header-text">
            <span class="detail-tag">{{ groups[selected.groupIdx] }}</span>
            <h3 class="detail-title">{{ selected.name }}</h3>
            <p class="detail-desc">{{ selected.description }}</p>
          </div>
        </div>

        <div class="detail-body">
          <section v-if="selected.specs && selected.specs.length" class="detail-section">
            <h4 class="detail-section-title">{{ t("page.principal.hydraulicHose.detail.specsTitle") }}</h4>
            <div class="spec-grid">
              <div v-for="s in selected.specs" :key="s.label" class="spec">
                <span class="spec-label">{{ s.label }}</span>
                <span class="spec-value">{{ s.value }}</span>
              </div>
            </div>
          </section>

          <section v-if="selected.ratings" class="detail-section">
            <h4 class="detail-section-title">{{ t("page.principal.hydraulicHose.detail.ratingsTitle") }}</h4>
            <div class="perf-list">
              <div v-for="rk in ratingKeys" :key="rk.key" class="perf-row">
                <span class="perf-label">{{ rk.label }}</span>
                <span class="dots" :aria-label="`${selected.ratings[rk.key]} / 4`">
                  <i v-for="d in 4" :key="d" :class="{ on: d <= selected.ratings[rk.key] }"></i>
                </span>
              </div>
            </div>
          </section>

          <section v-if="selected.products && selected.products.length" class="detail-section">
            <h4 class="detail-section-title">
              {{ t("page.principal.hydraulicHose.detail.productsTitle", { count: selected.products.length }) }}
            </h4>
            <div class="prod-grid">
              <article v-for="p in selected.products" :key="p.name" class="prod">
                <h5>{{ p.name }}</h5>
                <span class="prod-spec">{{ p.spec }}</span>
                <p>{{ p.description }}</p>
              </article>
            </div>
          </section>

          <section v-if="selected.applications && selected.applications.length" class="detail-section">
            <h4 class="detail-section-title">{{ t("page.principal.hydraulicHose.detail.applicationsTitle") }}</h4>
            <ul class="chips">
              <li v-for="a in selected.applications" :key="a">{{ a }}</li>
            </ul>
            <p v-if="selected.tip" class="d-tip">
              <Icon name="mdi:lightbulb-on-outline" />
              <span>{{ selected.tip }}</span>
            </p>
          </section>

          <div class="d-cta">
            <p>{{ t("page.principal.hydraulicHose.detail.ctaText") }}</p>
            <button class="btn btn-accent" @click="requestCategory(selected)">
              <Icon name="mdi:whatsapp" />
              {{ t("page.principal.hydraulicHose.detail.ctaButton") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

const { t, tm, rt } = useI18n();
const localeHead = useLocaleHead();
const { trackWhatsAppClick } = useAnalytics();

// ============ KONFIGURASI ============
const BRAND = "Trumecs";
const WA_NUMBER = "6285176912338";
const EMAIL = "info@trumecs.com";
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/hydraulic-hose";

const i18nArr = (key: string) => {
  const items = tm(key);
  return Array.isArray(items) ? items : [];
};

const usps = computed(() =>
  i18nArr("page.principal.hydraulicHose.usps").map((u: any) => ({
    icon: rt(u.icon),
    title: rt(u.title),
    description: rt(u.description),
  })),
);

const groups = computed(() =>
  i18nArr("page.principal.hydraulicHose.groups").map((g: any) => rt(g)),
);

const ratingKeys = computed(() => [
  { key: "pressure", label: t("page.principal.hydraulicHose.ratingLabels.pressure") },
  { key: "flex", label: t("page.principal.hydraulicHose.ratingLabels.flex") },
  { key: "temp", label: t("page.principal.hydraulicHose.ratingLabels.temp") },
  { key: "chem", label: t("page.principal.hydraulicHose.ratingLabels.chem") },
]);

const categories = computed(() =>
  i18nArr("page.principal.hydraulicHose.categories").map((c: any) => ({
    name: rt(c.name),
    icon: rt(c.icon),
    image: rt(c.image),
    groupIdx: Number(c.groupIdx ?? 0),
    range: rt(c.range),
    description: rt(c.description),
    specs: Array.isArray(c.specs)
      ? c.specs.map((s: any) => ({ label: rt(s.label), value: rt(s.value) }))
      : [],
    ratings: c.ratings
      ? {
          pressure: Number(c.ratings.pressure ?? 0),
          flex: Number(c.ratings.flex ?? 0),
          temp: Number(c.ratings.temp ?? 0),
          chem: Number(c.ratings.chem ?? 0),
        }
      : undefined,
    products: Array.isArray(c.products)
      ? c.products.map((p: any) => ({
          name: rt(p.name),
          spec: rt(p.spec),
          description: rt(p.description),
        }))
      : [],
    applications: Array.isArray(c.applications)
      ? c.applications.map((a: any) => rt(a))
      : [],
    tip: rt(c.tip),
  })),
);

const hoseCategories = computed(() => categories.value.filter((c: any) => c.ratings));

const assemblySteps = computed(() =>
  i18nArr("page.principal.hydraulicHose.assembly.steps").map((s: any) => ({
    icon: rt(s.icon),
    title: rt(s.title),
    description: rt(s.description),
  })),
);

const decoder = computed(() =>
  i18nArr("page.principal.hydraulicHose.reference.decoder").map((d: any) => ({
    code: rt(d.code),
    label: rt(d.label),
    meaning: rt(d.meaning),
  })),
);

const sizeRows = computed(() =>
  i18nArr("page.principal.hydraulicHose.reference.sizeRows").map((r: any) => ({
    dn: rt(r.dn),
    dash: rt(r.dash),
    inch: rt(r.inch),
  })),
);

const threadRows = computed(() =>
  i18nArr("page.principal.hydraulicHose.reference.threadRows").map((r: any) => ({
    code: rt(r.code),
    seal: rt(r.seal),
    note: rt(r.note),
  })),
);

const selectionFactors = computed(() =>
  i18nArr("page.principal.hydraulicHose.selection.factors").map((f: any) => ({
    icon: rt(f.icon),
    title: rt(f.title),
    description: rt(f.description),
  })),
);

const failureItems = computed(() =>
  i18nArr("page.principal.hydraulicHose.selection.failures").map((f: any) => ({
    icon: rt(f.icon),
    title: rt(f.title),
    description: rt(f.description),
  })),
);

const standardsList = computed(() =>
  i18nArr("page.principal.hydraulicHose.selection.standards").map((s: any) => rt(s)),
);

const faqs = computed(() =>
  i18nArr("page.principal.hydraulicHose.faq.items").map((f: any) => ({
    q: rt(f.q),
    a: rt(f.a),
  })),
);

// ============ FILTER & PENCARIAN ============
const activeGroup = ref(0);
const searchQuery = ref("");
const q = computed(() => searchQuery.value.trim().toLowerCase());

const filteredCategories = computed(() =>
  categories.value.filter((c: any) => {
    if (activeGroup.value !== 0 && c.groupIdx !== activeGroup.value) return false;
    if (!q.value) return true;
    const hay = [
      c.name,
      c.range,
      c.description,
      ...c.specs.map((s: any) => s.value),
      ...c.applications,
      ...c.products.flatMap((p: any) => [p.name, p.spec, p.description]),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.value);
  }),
);

const productOptions = computed(() =>
  Array.from(
    new Set([
      ...categories.value.map((c: any) => c.name),
      ...categories.value.flatMap((c: any) => c.products.map((p: any) => p.name)),
    ]),
  ).sort((a, b) => a.localeCompare(b)),
);

// ============ MODAL ============
const selected = ref<any | null>(null);
const openDetail = (cat: any) => {
  selected.value = cat;
};
const closeDetail = () => {
  selected.value = null;
};
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeDetail();
};
watch(selected, (val) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = val ? "hidden" : "";
});

// ============ KONTAK & FORM ============
const form = reactive({
  product: "",
  spec: "",
  qty: null as number | null,
  note: "",
});
const formError = ref("");

const openWhatsApp = (text: string, source = "hydraulic_hose") => {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  trackWhatsAppClick(source, {
    link_url: url,
    page_path: PAGE_PATH,
    link_label: source,
  });
  window.open(url, "_blank");
};

const submitRequest = () => {
  if (!form.product || !form.qty || form.qty < 1) {
    formError.value = t("page.principal.hydraulicHose.contact.formError");
    return;
  }
  formError.value = "";
  const lines = [
    t("page.principal.hydraulicHose.contact.waIntro"),
    "",
    `${t("page.principal.hydraulicHose.contact.waProduct")}: ${form.product}`,
    form.spec ? `${t("page.principal.hydraulicHose.contact.waSpec")}: ${form.spec}` : "",
    `${t("page.principal.hydraulicHose.contact.waQty")}: ${form.qty}`,
    form.note ? `${t("page.principal.hydraulicHose.contact.waNote")}: ${form.note}` : "",
  ].filter((l, i) => l !== "" || i === 1);
  openWhatsApp(lines.join("\n"), "hydraulic_hose_form");
};

const requestCategory = (cat: any) => {
  openWhatsApp(
    t("page.principal.hydraulicHose.contact.waCategory", { name: cat.name }),
    "hydraulic_hose_category",
  );
};

const handleContact = () => {
  openWhatsApp(t("page.principal.hydraulicHose.contact.waGeneral"), "hydraulic_hose_contact");
};

const handleEmail = () => {
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
    t("page.principal.hydraulicHose.contact.emailSubject"),
  )}`;
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ============ SCROLL REVEAL ============
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
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io?.observe(el);
      }
    });
};

const openFaq = ref<number | null>(0);

onMounted(() => {
  window.addEventListener("keydown", onKeydown);

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
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  observeNew();
  revealReady.value = true;

  if (root.value) {
    mo = new MutationObserver(observeNew);
    mo.observe(root.value, { childList: true, subtree: true });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (typeof document !== "undefined") document.body.style.overflow = "";
  io?.disconnect();
  mo?.disconnect();
});

// ============ SEO ============
const seoTitle = computed(() => t("page.principal.hydraulicHose.seo.title"));
const seoDesc = computed(() => t("page.principal.hydraulicHose.seo.description"));

useHead(() => ({
  title: seoTitle.value,
  titleTemplate: "%s",
  htmlAttrs: localeHead.value.htmlAttrs ?? { lang: "id" },
  link: [
    ...(localeHead.value.link ?? []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ],
  meta: [
    ...(localeHead.value.meta ?? []),
    { name: "description", content: seoDesc.value },
    { property: "og:title", content: seoTitle.value },
    { property: "og:description", content: seoDesc.value },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Trumecs.com" },
    { name: "robots", content: "index, follow" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t("breadcrumb.home") || "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: t("page.principal.title") || "Principal", item: `${SITE_URL}/principal` },
            { "@type": "ListItem", position: 3, name: seoTitle.value, item: `${SITE_URL}${PAGE_PATH}` },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: seoTitle.value,
          url: `${SITE_URL}${PAGE_PATH}`,
          itemListElement: categories.value.map((c: any) => ({
            "@type": "OfferCatalog",
            name: c.name,
            description: c.description,
          })),
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
        {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Hydraulic Hose & Fittings",
          name: seoTitle.value,
          description: seoDesc.value,
          url: `${SITE_URL}${PAGE_PATH}`,
          provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
          areaServed: { "@type": "Country", name: "Indonesia" },
        },
      ]),
    },
  ],
}));
</script>

<style scoped>
/* =========================================================
   THEME & BASE
   ========================================================= */
.page {
  --ink: #0b1a1f;
  --ink-soft: #123039;
  --accent: #19c3b0;
  --accent-soft: #8ee8dc;
  --accent-dark: #0e8f82;
  --paper: #f4f7f6;
  --line: #d7e2e0;
  --muted: #5e7376;
  --sand: #eef3f1;
  font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  overflow-x: hidden;
}
.wrap {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
.wrap.narrow { max-width: 980px; }
.sec { padding: 96px 0; }
.sec-white { background: #fff; }
.sec-dark { background: var(--ink); color: #fff; }
.sec-sand { background: var(--sand); }
@media (max-width: 768px) { .sec { padding: 64px 0; } }

/* =========================================================
   TYPOGRAPHY & LABELS
   ========================================================= */
.eyebrow-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.eyebrow-row.center { justify-content: center; }
.eyebrow-line { width: 34px; height: 1px; background: var(--accent); display: inline-block; }
.eyebrow { font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; color: var(--muted); }
.accent, .accent-soft { color: var(--accent); }
.accent-dark { color: var(--accent-dark); }
.sec-head { display: grid; gap: 18px; margin-bottom: 36px; }
@media (min-width: 900px) { .sec-head { grid-template-columns: 1.2fr 1fr; align-items: end; } }
.sec-head.center { grid-template-columns: 1fr; text-align: center; justify-items: center; }
.sec-title {
  margin: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
  color: var(--ink);
}
.sec-title.light { color: #fff; }
.sec-desc { margin: 0; color: var(--muted); font-size: 1.05rem; line-height: 1.7; max-width: 640px; }
.sec-desc.light { color: rgba(255,255,255,0.7); }
.seo-inline { margin-bottom: 24px; }
.seo-inline-title { margin: 0 0 8px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.5rem; text-transform: uppercase; color: var(--ink); }
.seo-inline-desc { margin: 0; color: var(--muted); line-height: 1.7; }

/* =========================================================
   BUTTONS
   ========================================================= */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 24px; border-radius: 999px; font-weight: 600; font-size: 0.95rem;
  border: 1px solid transparent; cursor: pointer; transition: all 0.25s ease; text-decoration: none;
}
.btn-accent { background: var(--accent); color: #062422; border-color: var(--accent); }
.btn-accent:hover { background: #3fd6c6; transform: translateY(-1px); }
.btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.35); }
.btn-ghost:hover { background: rgba(255,255,255,0.08); }
.btn-block { width: 100%; }

/* =========================================================
   HERO
   ========================================================= */
.hero {
  position: relative; min-height: 86vh; display: flex; align-items: center;
  background: radial-gradient(ellipse at 20% 30%, #123039 0%, #0b1a1f 60%, #081216 100%);
  color: #fff; overflow: hidden; padding: 120px 0 80px;
}
.hero-glow { position: absolute; inset: -20% -10% auto auto; width: 60%; height: 80%; background: radial-gradient(circle, rgba(25,195,176,0.18), transparent 70%); pointer-events: none; }
.hero-grid {
  position: absolute; inset: 0; opacity: 0.12; pointer-events: none;
  background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 48px 48px;
}
.hero-content { position: relative; z-index: 2; }
.hero-text { max-width: 720px; }
.hero-title {
  margin: 0 0 18px; font-family: "Barlow Semi Condensed", sans-serif; font-weight: 600; text-transform: uppercase;
  font-size: clamp(2.6rem, 6vw, 4.8rem); line-height: 1.02;
}
.hero-desc { margin: 0 0 28px; font-size: 1.1rem; line-height: 1.7; color: rgba(255,255,255,0.75); max-width: 620px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Hose illustration */
.hose { position: absolute; right: -40px; top: 50%; transform: translateY(-50%); width: 420px; height: 420px; opacity: 0.25; pointer-events: none; }
@media (max-width: 900px) { .hose { display: none; } }
.h-cover, .h-braid, .h-tube, .h-core { position: absolute; border-radius: 999px; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.h-cover { width: 360px; height: 360px; border: 26px solid #1a3a42; }
.h-braid { width: 300px; height: 300px; border: 16px dashed rgba(25,195,176,0.6); }
.h-braid-a { animation: spin 18s linear infinite; }
.h-braid-b { width: 250px; height: 250px; border-style: dotted; animation: spin-rev 14s linear infinite; }
.h-tube { width: 200px; height: 200px; border: 18px solid #204a52; }
.h-core { width: 120px; height: 120px; background: radial-gradient(circle, #19c3b0, #0b6b63); }
@keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes spin-rev { to { transform: translate(-50%, -50%) rotate(-360deg); } }

/* =========================================================
   USP
   ========================================================= */
.usp-wrap { margin-top: -48px; position: relative; z-index: 3; }
.usp { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .usp { grid-template-columns: repeat(3, 1fr); } }
.usp-item { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 22px; box-shadow: 0 20px 40px -30px rgba(11,26,31,0.35); }
.usp-icon { font-size: 28px; color: var(--accent-dark); margin-bottom: 10px; }
.usp-title { font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.25rem; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
.usp-desc { margin: 0; color: var(--muted); font-size: 0.95rem; line-height: 1.6; }

/* =========================================================
   FILTERS & SEARCH
   ========================================================= */
.toolbar { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.filter { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); font-weight: 600; font-size: 0.85rem; cursor: pointer; }
.filter.active, .filter:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
.search-box { position: relative; flex: 1 1 260px; max-width: 420px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #849497; font-size: 20px; }
.search-input { width: 100%; padding: 12px 14px 12px 42px; border: 1px solid var(--line); border-radius: 999px; font: inherit; background: #fff; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.search-input::placeholder { color: #849497; }
.search-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(25,195,176,0.2); }
.no-results { margin: 24px 0 0; color: var(--muted); }

/* =========================================================
   CATEGORY CARDS
   ========================================================= */
.cat-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
.cat-card { display: flex; flex-direction: column; align-items: stretch; text-align: left; padding: 0; background: #fff; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; cursor: pointer; font: inherit; color: inherit; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
.cat-card:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 28px 48px -28px rgba(11,26,31,0.4); }
.cat-card:focus-visible { outline: 3px solid rgba(25,195,176,0.5); outline-offset: 2px; }
.cat-visual { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: linear-gradient(135deg, #123039, #0b1a1f); }
.cat-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.cat-card:hover .cat-img { transform: scale(1.05); }
.cat-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 68px; color: var(--accent); background-image: repeating-linear-gradient(45deg, rgba(25,195,176,0.13) 0 2px, transparent 2px 13px), repeating-linear-gradient(-45deg, rgba(25,195,176,0.13) 0 2px, transparent 2px 13px); }
.cat-placeholder > * { padding: 22px; border-radius: 50%; background: rgba(11,26,31,0.75); border: 1px solid rgba(25,195,176,0.45); }
.cat-group { position: absolute; top: 12px; left: 12px; padding: 5px 10px; border-radius: 999px; background: rgba(11,26,31,0.75); color: #fff; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; backdrop-filter: blur(4px); }
.cat-body { padding: 18px 18px 20px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.cat-name { margin: 0; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.35rem; font-weight: 600; text-transform: uppercase; line-height: 1.1; color: var(--ink); }
.cat-meta { margin: 0; font-size: 0.8rem; font-weight: 600; color: var(--accent-dark); }
.cat-desc { margin: 4px 0 0; font-size: 0.92rem; color: var(--muted); line-height: 1.55; flex: 1; }
.cat-link { margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--accent-dark); }

/* =========================================================
   TABLES & COMPARISON
   ========================================================= */
.table-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 22px; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--line); }
th { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: #6b8083; font-weight: 600; }
.strong { font-weight: 600; color: var(--ink); }
.note { margin: 14px 0 0; font-size: 0.85rem; color: var(--muted); }
.dots { display: inline-flex; gap: 5px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: #dfe7e6; display: inline-block; }
.dots i.on { background: var(--accent-dark); }
.table-grid { display: grid; gap: 20px; margin-top: 24px; }
@media (min-width: 900px) { .table-grid { grid-template-columns: 1fr 1.2fr; } }
.card-title { margin: 0 0 4px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.4rem; text-transform: uppercase; }
.card-sub { margin: 0 0 14px; color: var(--muted); font-size: 0.9rem; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #e8f7f4; color: var(--accent-dark); font-weight: 700; font-size: 0.8rem; }

/* =========================================================
   STEPS
   ========================================================= */
.steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .steps { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .steps { grid-template-columns: repeat(4, 1fr); } }
.step { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 22px; }
.step-badge { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; color: var(--accent-soft); font-weight: 700; }
.step-badge > :first-child { font-size: 22px; }
.step h3 { margin: 0 0 8px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.3rem; text-transform: uppercase; color: #fff; }
.step p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.6; }

/* =========================================================
   REFERENCE / DECODER
   ========================================================= */
.decoder { display: grid; gap: 18px; margin-bottom: 24px; }
.decoder-code { display: flex; flex-wrap: wrap; gap: 12px; }
.seg { display: inline-flex; flex-direction: column; align-items: center; padding: 12px 16px; border: 1px solid var(--line); border-radius: 10px; background: #fff; min-width: 90px; }
.seg b { font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.4rem; color: var(--accent-dark); }
.seg small { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6b8083; }
.decoder-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.decoder-list li { display: flex; align-items: center; gap: 12px; color: var(--muted); }

/* =========================================================
   SELECTION / CARE
   ========================================================= */
.two-col { display: grid; gap: 28px; }
@media (min-width: 900px) { .two-col { grid-template-columns: 1fr 1fr; } }
.subsec-title { margin: 0 0 14px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.5rem; text-transform: uppercase; }
.mini-grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .mini-grid { grid-template-columns: repeat(2, 1fr); } }
.mini-card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 18px; }
.icon-box { width: 46px; height: 46px; border-radius: 10px; background: #e8f7f4; color: var(--accent-dark); display: inline-flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 10px; }
.icon-box.solid { background: rgba(25,195,176,0.15); color: var(--accent-soft); border: 1px solid rgba(25,195,176,0.35); }
.card-text { margin: 6px 0 0; color: var(--muted); font-size: 0.92rem; line-height: 1.6; }
.notice { display: flex; gap: 14px; align-items: flex-start; margin-top: 28px; padding: 18px 20px; border: 1px solid #f0d6a8; background: #fff8ea; border-radius: 12px; color: #6b4e16; }
.notice > :first-child { font-size: 26px; flex-shrink: 0; }
.notice b { display: block; margin-bottom: 4px; }
.notice p { margin: 0; line-height: 1.6; }
.standards { margin-top: 28px; display: grid; gap: 14px; align-items: center; }
@media (min-width: 900px) { .standards { grid-template-columns: 1fr 1.4fr; } }
.standards-text h3 { margin: 0 0 6px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.4rem; text-transform: uppercase; }
.standards-text p { margin: 0; color: var(--muted); }
.standards-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.standards-badges span { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: #fff; font-size: 0.8rem; font-weight: 600; color: var(--ink-soft); }

/* =========================================================
   FAQ
   ========================================================= */
.faq-list { display: grid; gap: 10px; }
.faq { border: 1px solid var(--line); border-radius: 12px; background: #fff; overflow: hidden; }
.faq-q { width: 100%; text-align: left; padding: 16px 18px; background: none; border: none; font: inherit; font-weight: 600; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; color: var(--ink); }
.faq-icon { transition: transform 0.25s ease; color: var(--accent-dark); font-size: 20px; }
.faq.open .faq-icon { transform: rotate(45deg); }
.faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.25s ease; }
.faq.open .faq-a { grid-template-rows: 1fr; }
.faq-a > div { overflow: hidden; }
.faq-a p { margin: 0; padding: 0 18px 16px; color: var(--muted); line-height: 1.7; }

/* =========================================================
   CTA / CONTACT
   ========================================================= */
.cta { background: var(--ink); color: #fff; border-radius: 20px; overflow: hidden; }
.cta-grid { display: grid; gap: 0; }
@media (min-width: 900px) { .cta-grid { grid-template-columns: 1.1fr 1fr; } }
.cta-main { padding: 40px 36px; }
.cta-main h2 { margin: 8px 0 12px; font-family: "Barlow Semi Condensed", sans-serif; font-size: clamp(2rem,4vw,3rem); text-transform: uppercase; line-height: 1.05; }
.cta-main p { margin: 0 0 22px; color: rgba(255,255,255,0.7); line-height: 1.7; }
.cta-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.cta-form { background: #0f252b; padding: 32px 28px; border-left: 1px solid rgba(255,255,255,0.08); }
.cta-form h3 { margin: 0 0 18px; font-family: "Barlow Semi Condensed", sans-serif; font-size: 1.5rem; text-transform: uppercase; }
.field { display: block; margin-bottom: 14px; }
.field > span { display: block; margin-bottom: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
.field em { color: var(--accent-soft); font-style: normal; }
.field input, .field textarea { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: #fff; font: inherit; }
.field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.4); }
.field input:focus, .field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(25,195,176,0.2); }
.field-row { display: grid; gap: 12px; }
@media (min-width: 640px) { .field-row { grid-template-columns: 1fr 120px; } }
.form-error { margin: 0 0 14px; padding: 10px 14px; border-radius: 8px; background: rgba(255,90,70,0.14); border: 1px solid rgba(255,90,70,0.4); color: #ffb3a8; font-size: 0.88rem; }
.form-hint { margin: 14px 0 0; font-size: 0.78rem; color: rgba(255,255,255,0.45); }

/* =========================================================
   DETAIL MODAL (bearing-style)
   ========================================================= */
.detail-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(11,26,31,0.8); backdrop-filter: blur(4px); overflow: auto; }
.detail-dialog { position: relative; width: 100%; max-width: 920px; max-height: calc(100vh - 48px); overflow: auto; background: #fff; border-radius: 18px; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.6); }
.detail-close { position: absolute; top: 14px; right: 14px; z-index: 2; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid #d3dae5; border-radius: 999px; background: rgba(255,255,255,0.95); color: var(--ink); cursor: pointer; font-size: 20px; }
.detail-close:hover { background: #fff; }
.detail-header { display: grid; gap: 0; }
@media (min-width: 768px) { .detail-header { grid-template-columns: 360px 1fr; } }
.detail-hero-image-wrap { width: 100%; height: 260px; background: #f3f6f5; overflow: hidden; display: flex; align-items: center; justify-content: center; }
@media (min-width: 768px) { .detail-hero-image-wrap { height: 100%; min-height: 320px; } }
.detail-hero-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.detail-hero-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 80px; color: var(--accent-dark); background: linear-gradient(135deg, #e8f7f4, #f4f7f6); }
.detail-header-text { padding: 28px 28px 20px; }
.detail-tag { display: inline-block; margin-bottom: 8px; padding: 4px 10px; border-radius: 999px; background: #e8f7f4; color: var(--accent-dark); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
.detail-title { margin: 0 0 10px; font-family: "Barlow Semi Condensed", sans-serif; font-weight: 600; font-size: 2rem; line-height: 1.1; text-transform: uppercase; color: var(--ink); }
.detail-desc { margin: 0; color: var(--muted); font-size: 1rem; line-height: 1.7; }
.detail-body { padding: 0 28px 28px; display: grid; gap: 28px; }
.detail-section { padding-top: 24px; border-top: 1px solid var(--line); }
.detail-section-title { margin: 0 0 16px; font-family: "Barlow Semi Condensed", sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; font-size: 1.1rem; color: var(--accent-dark); }
.spec-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .spec-grid { grid-template-columns: repeat(3, 1fr); } }
.spec { padding: 14px 16px; background: var(--paper); border: 1px solid var(--line); border-radius: 10px; }
.spec-label { display: block; margin-bottom: 4px; font-size: 0.64rem; letter-spacing: 0.16em; text-transform: uppercase; color: #849497; }
.spec-value { display: block; font-size: 0.88rem; font-weight: 600; line-height: 1.35; color: var(--ink); }
.perf-list { display: grid; gap: 12px; max-width: 480px; }
.perf-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.perf-label { font-size: 0.92rem; font-weight: 500; }
.prod-grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
@media (min-width: 700px) { .prod-grid { grid-template-columns: repeat(2, 1fr); } }
.prod { padding: 18px 18px 16px; background: var(--paper); border: 1px solid var(--line); border-left: 4px solid var(--accent); border-radius: 10px; }
.prod h5 { margin: 0 0 4px; font-family: "Barlow Semi Condensed", sans-serif; font-weight: 600; text-transform: uppercase; font-size: 1.15rem; line-height: 1.15; color: var(--ink); }
.prod-spec { display: inline-block; margin-bottom: 8px; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.03em; color: var(--accent-dark); }
.prod p { margin: 0; font-size: 0.88rem; color: var(--muted); }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li { padding: 6px 12px; border-radius: 999px; background: #e8f7f4; color: #0e5c54; font-size: 0.85rem; font-weight: 500; }
.d-tip { display: flex; align-items: flex-start; gap: 10px; margin: 18px 0 0; font-size: 0.9rem; color: var(--muted); }
.d-tip > :first-child { flex-shrink: 0; margin-top: 2px; font-size: 20px; color: var(--accent-dark); }
.d-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 4px; padding: 20px 24px; background: var(--paper); border: 1px solid var(--line); border-radius: 12px; }
.d-cta p { margin: 0; font-weight: 600; }

/* =========================================================
   ANIMATIONS & REVEAL
   ========================================================= */
.fade-up { opacity: 0; transform: translateY(22px); animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
[data-reveal] { transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-on [data-reveal]:not(.is-visible) { opacity: 0; transform: translateY(24px); }
@media (prefers-reduced-motion: reduce) {
  .h-braid, .h-core, .fade-up { animation: none !important; opacity: 1 !important; transform: none !important; }
  [data-reveal], .reveal-on [data-reveal]:not(.is-visible) { opacity: 1; transform: none; transition: none; }
}
</style>

