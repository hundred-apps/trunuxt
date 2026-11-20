<template>
  <div ref="root" class="page" :class="{ 'reveal-on': revealReady }">
    <!-- ================= 1. HERO ================= -->
    <section class="hero">
      <div
        class="hero-bg"
        :style="{ backgroundImage: `url('${HERO_IMAGE}')` }"
      ></div>
      <div class="hero-overlay"></div>
      <div class="hero-glow"></div>
      <div class="hero-grid"></div>

      <!-- Ilustrasi kartu tenaga kerja (dekoratif, hanya layar lebar) -->
      <div class="crew" aria-hidden="true">
        <div v-if="heroCrew[0]" class="w-card w1">
          <div class="w-avatar"><Icon name="mdi:account-hard-hat" /></div>
          <div class="w-info">
            <b>{{ heroCrew[0].role }}</b>
            <small>{{ heroCrew[0].meta }}</small>
            <span class="w-status"><i></i>{{ heroCrew[0].status }}</span>
          </div>
        </div>
        <div v-if="heroCrew[1]" class="w-card w2">
          <div class="w-avatar"><Icon name="mdi:wrench" /></div>
          <div class="w-info">
            <b>{{ heroCrew[1].role }}</b>
            <small>{{ heroCrew[1].meta }}</small>
            <span class="w-status"><i></i>{{ heroCrew[1].status }}</span>
          </div>
        </div>
        <div v-if="heroCrew[2]" class="w-card w3">
          <div class="w-avatar"><Icon name="mdi:forklift" /></div>
          <div class="w-info">
            <b>{{ heroCrew[2].role }}</b>
            <small>{{ heroCrew[2].meta }}</small>
            <span class="w-status"><i></i>{{ heroCrew[2].status }}</span>
          </div>
        </div>
      </div>

      <div class="wrap hero-content">
        <div class="hero-text">
          <div class="eyebrow-row fade-up">
            <span class="eyebrow-line"></span>
            <span class="eyebrow accent-soft">{{
              t("page.principal.blueCollar.hero.eyebrow")
            }}</span>
          </div>

          <h1 class="hero-title fade-up" style="animation-delay: 100ms">
            {{ t("page.principal.blueCollar.hero.titleLine1") }}
            <span class="accent">{{
              t("page.principal.blueCollar.hero.titleLine2")
            }}</span>
          </h1>

          <p class="hero-desc fade-up" style="animation-delay: 200ms">
            {{ t("page.principal.blueCollar.hero.subtitle") }}
          </p>

          <div class="hero-actions fade-up" style="animation-delay: 300ms">
            <button class="btn btn-accent" @click="scrollTo('profesi')">
              {{ t("page.principal.blueCollar.hero.ctaBrowse") }}
              <Icon name="mdi:arrow-right" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('kontak')">
              {{ t("page.principal.blueCollar.hero.ctaConsult") }}
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

    <!-- ================= 2b. CORE VALUES ================= -->
    <section id="nilai" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.coreValues.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.coreValues.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.blueCollar.coreValues.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.blueCollar.coreValues.subtitle") }}
          </p>
        </header>

        <div class="value-grid">
          <article
            v-for="item in coreValues"
            :key="item.code"
            class="value-card"
            data-reveal
          >
            <div class="icon-box"><Icon :name="item.icon" /></div>
            <span class="tag">{{ item.code }}</span>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 3. PROFESI ================= -->
    <section id="profesi" class="sec">
      <div class="wrap narrow seo-inline" data-reveal>
        <h2 class="seo-inline-title">
          {{ t("page.principal.blueCollar.professions.seoInlineTitle") }}
        </h2>
        <p class="seo-inline-desc">
          {{ t("page.principal.blueCollar.professions.seoInlineDesc") }}
        </p>
      </div>

      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.professions.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.professions.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.blueCollar.professions.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.blueCollar.professions.subtitle") }}
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
              :placeholder="
                t('page.principal.blueCollar.professions.searchPlaceholder')
              "
              :aria-label="
                t('page.principal.blueCollar.professions.searchAria')
              "
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
            <span class="cat-stripe"></span>
            <div class="cat-top">
              <div class="icon-box"><Icon :name="cat.icon" /></div>
              <span class="tag">{{ groups[cat.groupIdx] }}</span>
            </div>
            <h3 class="card-title">{{ cat.name }}</h3>
            <p class="card-text">{{ cat.description }}</p>

            <ul class="chips">
              <li
                v-for="r in previewRoles(cat)"
                :key="r"
                :class="{ hit: isHit(r) }"
              >
                {{ r }}
              </li>
              <li v-if="cat.roles.length > 5" class="more">
                +{{ cat.roles.length - 5 }}
                {{ t("page.principal.blueCollar.professions.more") }}
              </li>
            </ul>

            <span class="cat-link">
              {{
                t("page.principal.blueCollar.professions.viewDetail", {
                  count: cat.roles.length,
                })
              }}
              <Icon name="mdi:arrow-right" />
            </span>
          </button>
        </div>

        <p v-if="filteredCategories.length === 0" class="no-results">
          {{ t("page.principal.blueCollar.professions.noResults") }}
        </p>
      </div>
    </section>

    <!-- ================= 4. SKEMA KERJA SAMA ================= -->
    <section id="skema" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.models.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.models.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.blueCollar.models.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.blueCollar.models.subtitle") }}
          </p>
        </header>

        <div class="model-grid">
          <article
            v-for="m in models"
            :key="m.title"
            class="model-card"
            data-reveal
          >
            <div class="icon-box"><Icon :name="m.icon" /></div>
            <h3 class="card-title">{{ m.title }}</h3>
            <p class="card-text">{{ m.description }}</p>
            <ul class="chips">
              <li v-for="c in m.chips" :key="c">{{ c }}</li>
            </ul>
          </article>
        </div>
        <p class="note" data-reveal>
          {{ t("page.principal.blueCollar.models.note") }}
        </p>
      </div>
    </section>

    <!-- ================= 5. PROSES ================= -->
    <section id="proses" class="sec sec-dark">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-soft">{{
                t("page.principal.blueCollar.process.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title light">
              {{ t("page.principal.blueCollar.process.titleLine1") }}
              <span class="accent">{{
                t("page.principal.blueCollar.process.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc light">
            {{ t("page.principal.blueCollar.process.subtitle") }}
          </p>
        </header>

        <ol class="steps">
          <li
            v-for="(s, i) in processSteps"
            :key="s.title"
            class="step"
            data-reveal
          >
            <div class="step-badge">
              <Icon :name="s.icon" class="step-icon" />
              <span class="step-num">{{ i + 1 }}</span>
            </div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ================= 6. STANDAR ================= -->
    <section id="standar" class="sec sec-sand">
      <div class="wrap">
        <header class="sec-head" data-reveal>
          <div>
            <div class="eyebrow-row">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.quality.sectionLabel")
              }}</span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.quality.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.blueCollar.quality.titleLine2")
              }}</span>
            </h2>
          </div>
          <p class="sec-desc">
            {{ t("page.principal.blueCollar.quality.subtitle") }}
          </p>
        </header>

        <div class="quality-grid">
          <div
            v-for="q in qualities"
            :key="q.title"
            class="quality-card"
            data-reveal
          >
            <div class="icon-box"><Icon :name="q.icon" /></div>
            <h3 class="card-title">{{ q.title }}</h3>
            <p class="card-text">{{ q.description }}</p>
          </div>
        </div>

        <div class="standards" data-reveal>
          <div class="standards-text">
            <h3>{{ t("page.principal.blueCollar.quality.standardsTitle") }}</h3>
            <p>{{ t("page.principal.blueCollar.quality.standardsDesc") }}</p>
          </div>
          <div class="standards-badges">
            <span v-for="s in standards" :key="s">{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 7. INDUSTRI ================= -->
    <section id="industri" class="sec sec-white">
      <div class="wrap">
        <header class="sec-head center" data-reveal>
          <div>
            <div class="eyebrow-row center">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.industries.sectionLabel")
              }}</span>
              <span class="eyebrow-line"></span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.industries.titleLine1") }}
              <span class="accent-dark">{{
                t("page.principal.blueCollar.industries.titleLine2")
              }}</span>
            </h2>
          </div>
        </header>

        <div class="ind-grid">
          <div
            v-for="ind in industries"
            :key="ind.name"
            class="ind-tile"
            data-reveal
          >
            <Icon :name="ind.icon" />
            <span>{{ ind.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 8. FAQ ================= -->
    <section id="faq" class="sec">
      <div class="wrap narrow">
        <header class="sec-head center" data-reveal>
          <div>
            <div class="eyebrow-row center">
              <span class="eyebrow-line"></span>
              <span class="eyebrow accent-dark">{{
                t("page.principal.blueCollar.faq.sectionLabel")
              }}</span>
              <span class="eyebrow-line"></span>
            </div>
            <h2 class="sec-title">
              {{ t("page.principal.blueCollar.faq.title") }}
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

    <!-- ================= 9. KONTAK ================= -->
    <section id="kontak" class="sec sec-sand">
      <div class="wrap">
        <div class="cta" data-reveal>
          <div class="hazard"></div>
          <div class="cta-grid">
            <div class="cta-main">
              <span class="eyebrow accent-soft">{{
                t("page.principal.blueCollar.contact.sectionLabel")
              }}</span>
              <h2>
                {{ t("page.principal.blueCollar.contact.titleLine1") }}
                <span class="accent">{{
                  t("page.principal.blueCollar.contact.titleLine2")
                }}</span>
              </h2>
              <p>{{ t("page.principal.blueCollar.contact.subtitle") }}</p>
              <div class="cta-actions">
                <button class="btn btn-accent" @click="handleContact">
                  <Icon name="mdi:whatsapp" />
                  {{ t("page.principal.blueCollar.contact.whatsapp") }}
                </button>
                <button class="btn btn-ghost" @click="handleEmail">
                  <Icon name="mdi:email-outline" />
                  {{ t("page.principal.blueCollar.contact.email") }}
                </button>
              </div>
              <p class="cta-area">
                <Icon name="mdi:map-marker-radius" />
                {{ t("page.principal.blueCollar.contact.serviceArea") }}
              </p>
            </div>

            <form class="cta-form" @submit.prevent="submitRequest">
              <h3>{{ t("page.principal.blueCollar.contact.formTitle") }}</h3>

              <label class="field">
                <span>{{
                  t("page.principal.blueCollar.contact.companyLabel")
                }}</span>
                <input
                  v-model.trim="form.company"
                  type="text"
                  :placeholder="
                    t('page.principal.blueCollar.contact.companyPlaceholder')
                  "
                />
              </label>

              <div class="field-row">
                <label class="field">
                  <span
                    >{{ t("page.principal.blueCollar.contact.positionLabel") }}
                    <em>{{
                      t("page.principal.blueCollar.contact.requiredMark")
                    }}</em></span
                  >
                  <input
                    v-model.trim="form.position"
                    type="text"
                    list="role-options"
                    :placeholder="
                      t('page.principal.blueCollar.contact.positionPlaceholder')
                    "
                  />
                  <datalist id="role-options">
                    <option v-for="r in allRoles" :key="r" :value="r"></option>
                  </datalist>
                </label>
                <label class="field field-qty">
                  <span
                    >{{ t("page.principal.blueCollar.contact.qtyLabel") }}
                    <em>{{
                      t("page.principal.blueCollar.contact.requiredMark")
                    }}</em></span
                  >
                  <input
                    v-model.number="form.qty"
                    type="number"
                    min="1"
                    :placeholder="
                      t('page.principal.blueCollar.contact.qtyPlaceholder')
                    "
                  />
                </label>
              </div>

              <label class="field">
                <span>{{
                  t("page.principal.blueCollar.contact.locationLabel")
                }}</span>
                <input
                  v-model.trim="form.location"
                  type="text"
                  :placeholder="
                    t('page.principal.blueCollar.contact.locationPlaceholder')
                  "
                />
              </label>

              <label class="field">
                <span>{{
                  t("page.principal.blueCollar.contact.noteLabel")
                }}</span>
                <textarea
                  v-model.trim="form.note"
                  rows="3"
                  :placeholder="
                    t('page.principal.blueCollar.contact.notePlaceholder')
                  "
                ></textarea>
              </label>

              <p v-if="formError" class="form-error" role="alert">
                {{ formError }}
              </p>

              <button type="submit" class="btn btn-accent btn-block">
                <Icon name="mdi:whatsapp" />
                {{ t("page.principal.blueCollar.contact.submit") }}
              </button>
              <p class="form-hint">
                {{ t("page.principal.blueCollar.contact.formHint") }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= MODAL DETAIL KATEGORI ================= -->
    <div
      v-if="selected"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      @click.self="closeDetail"
    >
      <div class="dialog">
        <button
          type="button"
          class="dialog-close"
          :aria-label="t('page.principal.blueCollar.professions.modal.close')"
          @click="closeDetail"
        >
          <Icon name="mdi:close" />
        </button>

        <div class="dialog-head">
          <div class="hazard"></div>
          <div class="dialog-head-inner">
            <div class="icon-box solid"><Icon :name="selected.icon" /></div>
            <div>
              <span class="tag light">{{ groups[selected.groupIdx] }}</span>
              <h3 id="detail-title" class="dialog-title">
                {{ selected.name }}
              </h3>
              <p class="dialog-desc">{{ selected.description }}</p>
            </div>
          </div>
        </div>

        <div class="dialog-body">
          <section class="d-section">
            <h4 class="d-title">
              {{
                t("page.principal.blueCollar.professions.modal.rolesTitle", {
                  count: selected.roles.length,
                })
              }}
            </h4>
            <ul class="role-grid">
              <li v-for="r in selected.roles" :key="r">
                <Icon name="mdi:check-circle-outline" />
                <span>{{ r }}</span>
              </li>
            </ul>
          </section>

          <section class="d-section">
            <h4 class="d-title">
              {{ t("page.principal.blueCollar.professions.modal.tasksTitle") }}
            </h4>
            <ul class="d-list">
              <li v-for="task in selected.tasks" :key="task">{{ task }}</li>
            </ul>
          </section>

          <section class="d-section">
            <h4 class="d-title">
              {{ t("page.principal.blueCollar.professions.modal.certsTitle") }}
            </h4>
            <ul class="chips">
              <li v-for="c in selected.certs" :key="c">{{ c }}</li>
            </ul>
            <p class="d-env">
              <Icon name="mdi:lightbulb-on-outline" />
              <span
                ><b>{{
                  t("page.principal.blueCollar.professions.modal.envLabel")
                }}</b>
                {{ selected.env }}</span
              >
            </p>
          </section>

          <div class="d-cta">
            <p>
              {{ t("page.principal.blueCollar.professions.modal.ctaText") }}
            </p>
            <button class="btn btn-accent" @click="requestCategory(selected)">
              <Icon name="mdi:whatsapp" />
              {{ t("page.principal.blueCollar.professions.modal.ctaButton") }}
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

// ============ KONFIGURASI ============
const BRAND = "Trumecs";
const WA_NUMBER = "6285176912338";
const EMAIL = "info@trumecs.com";
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/blue-collar-hr";
const HERO_IMAGE = "/principal/blue-collar/blue-collar-hr.jpg";

const i18nArr = (key: string) => {
  const items = tm(key);
  return Array.isArray(items) ? items : [];
};

const msg = (key: string, vars: Record<string, string | number> = {}) => {
  let out = t(key);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
};

// ============ DATA (i18n) ============
const heroCrew = computed(() =>
  i18nArr("page.principal.blueCollar.hero.crew").map((item: any) => ({
    role: rt(item.role),
    meta: rt(item.meta),
    status: rt(item.status),
  }))
);

const usps = computed(() =>
  i18nArr("page.principal.blueCollar.usps.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const coreValues = computed(() =>
  i18nArr("page.principal.blueCollar.coreValues.items").map((item: any) => ({
    code: rt(item.code),
    title: rt(item.title),
    icon: rt(item.icon),
    description: rt(item.description),
  }))
);

const groups = computed(() =>
  i18nArr("page.principal.blueCollar.professions.groups").map((g: any) => rt(g))
);
const activeGroup = ref(0);
const searchQuery = ref("");

const categories = computed(() =>
  i18nArr("page.principal.blueCollar.categories").map((c: any) => ({
    name: rt(c.name),
    icon: rt(c.icon),
    groupIdx: Number(c.groupIdx ?? rt(c.groupIdx) ?? 0),
    description: rt(c.description),
    roles: Array.isArray(c.roles) ? c.roles.map((r: any) => rt(r)) : [],
    tasks: Array.isArray(c.tasks) ? c.tasks.map((r: any) => rt(r)) : [],
    requirements: Array.isArray(c.requirements)
      ? c.requirements.map((r: any) => rt(r))
      : [],
    certs: Array.isArray(c.certs) ? c.certs.map((r: any) => rt(r)) : [],
    env: rt(c.env),
  }))
);

const models = computed(() =>
  i18nArr("page.principal.blueCollar.models.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
    chips: Array.isArray(item.chips) ? item.chips.map((c: any) => rt(c)) : [],
  }))
);

const processSteps = computed(() =>
  i18nArr("page.principal.blueCollar.process.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const qualities = computed(() =>
  i18nArr("page.principal.blueCollar.quality.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const standards = [
  "Sertifikasi BNSP",
  "SIO Kemnaker",
  "K3 Umum",
  "SKK Konstruksi",
  "SIM B1 / B2",
  "Gada Pratama",
  "BPJS Ketenagakerjaan",
  "BPJS Kesehatan",
];

const industries = computed(() =>
  i18nArr("page.principal.blueCollar.industries.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
  }))
);

const faqs = computed(() =>
  i18nArr("page.principal.blueCollar.faq.items").map((f: any) => ({
    q: rt(f.q),
    a: rt(f.a),
  }))
);
const openFaq = ref<number | null>(0);

// ============ FILTER & PENCARIAN ============
const q = computed(() => searchQuery.value.trim().toLowerCase());
const isHit = (role: string) =>
  !!q.value && role.toLowerCase().includes(q.value);

const filteredCategories = computed(() =>
  categories.value.filter((c: any) => {
    if (activeGroup.value !== 0 && c.groupIdx !== activeGroup.value)
      return false;
    if (!q.value) return true;
    const hay = [c.name, c.description, ...c.roles, ...c.certs]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.value);
  })
);

const previewRoles = (cat: any) => {
  const hits = cat.roles.filter(isHit);
  const rest = cat.roles.filter((r: string) => !isHit(r));
  return [...hits, ...rest].slice(0, 5);
};

const allRoles = computed(() =>
  Array.from(new Set(categories.value.flatMap((c: any) => c.roles))).sort(
    (a: string, b: string) => a.localeCompare(b)
  )
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
  company: "",
  position: "",
  qty: null as number | null,
  location: "",
  note: "",
});
const formError = ref("");

const openWhatsApp = (text: string) => {
  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
};

const submitRequest = () => {
  if (!form.position || !form.qty || form.qty < 1) {
    formError.value = t("page.principal.blueCollar.contact.formError");
    return;
  }
  formError.value = "";
  const lines = [
    msg("page.principal.blueCollar.contact.waIntro", { brand: BRAND }),
    "",
    form.company
      ? msg("page.principal.blueCollar.contact.waCompany", {
          value: form.company,
        })
      : "",
    msg("page.principal.blueCollar.contact.waPosition", {
      value: form.position,
    }),
    msg("page.principal.blueCollar.contact.waQty", { value: form.qty }),
    form.location
      ? msg("page.principal.blueCollar.contact.waLocation", {
          value: form.location,
        })
      : "",
    form.note
      ? msg("page.principal.blueCollar.contact.waNote", { value: form.note })
      : "",
  ].filter((l, i) => l !== "" || i === 1);
  openWhatsApp(lines.join("\n"));
};

const requestCategory = (cat: any) => {
  openWhatsApp(
    msg("page.principal.blueCollar.contact.waCategory", {
      brand: BRAND,
      category: cat.name,
    })
  );
};

const handleContact = () => {
  openWhatsApp(
    msg("page.principal.blueCollar.contact.waGeneral", { brand: BRAND })
  );
};

const handleEmail = () => {
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
    t("page.principal.blueCollar.contact.emailSubject")
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
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
  io?.disconnect();
  mo?.disconnect();
});

// ============ SEO ============
const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.blueCollar.seo.title"),
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
      content: t("page.principal.blueCollar.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.blueCollar.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.blueCollar.seo.description"),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: `${BRAND}.com` },
    { name: "robots", content: "index, follow" },
  ]),
  script: computed(() => [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: t("page.principal.blueCollar.seo.breadcrumbHome"),
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: t("page.principal.blueCollar.seo.breadcrumbPage"),
              item: `${SITE_URL}${PAGE_PATH}`,
            },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: t("page.principal.blueCollar.seo.serviceType"),
          name: t("page.principal.blueCollar.seo.title"),
          description: t("page.principal.blueCollar.seo.description"),
          url: `${SITE_URL}${PAGE_PATH}`,
          provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
          areaServed: { "@type": "Country", name: "Indonesia" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: t("page.principal.blueCollar.seo.catalogName"),
            itemListElement: categories.value.map((c: any) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: c.name,
                description: c.description,
              },
            })),
          },
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
      ]),
    },
  ]),
});
</script>

<style scoped>
/* =========================================================
   DESIGN TOKENS
========================================================= */
.page {
  --ink: #101826;
  --ink-2: #172234;
  --accent: #ff8a1f;
  --accent-soft: #ffc28a;
  --accent-dark: #b84f08;
  --paper: #f6f3ee;
  --sand: #ece7dd;
  --line: #e2dcd0;
  --muted: #5c6470;

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
  padding: 80px 0;
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
.sec-desc.light {
  color: rgba(255, 255, 255, 0.64);
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
.note {
  margin: 24px 0 0;
  font-size: 0.8rem;
  color: #7b8591;
}

/* Pita peringatan (hazard stripe) khas area kerja lapangan */
.hazard {
  height: 10px;
  background: repeating-linear-gradient(
    -45deg,
    var(--accent) 0 14px,
    var(--ink) 14px 28px
  );
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
.btn-block {
  width: 100%;
}
.btn-accent {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: var(--ink);
}
.btn-accent:hover {
  background: #ffa04a;
  box-shadow: 0 12px 28px -10px rgba(255, 138, 31, 0.6);
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
  transform: scale(1.02);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(16, 24, 38, 0.88) 0%,
      rgba(16, 24, 38, 0.6) 45%,
      rgba(16, 24, 38, 0.2) 100%
    ),
    linear-gradient(0deg, rgba(16, 24, 38, 0.75) 0%, transparent 35%);
}
@media (max-width: 900px) {
  .hero-overlay {
    background: linear-gradient(rgba(16, 24, 38, 0.72), rgba(16, 24, 38, 0.72));
  }
}
.hero-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 55% 65% at 82% 48%,
    rgba(255, 138, 31, 0.14),
    transparent 70%
  );
}
.hero-text {
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
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
  font-size: clamp(2.8rem, 7vw, 5.2rem);
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

/* Ilustrasi kartu tenaga kerja */
.crew {
  display: none;
  position: absolute;
  right: 6%;
  top: 50%;
  width: 380px;
  height: 460px;
  margin-top: -250px;
  z-index: 1;
}
@media (min-width: 1100px) {
  .crew {
    display: block;
  }
}
.w-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 310px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.6);
  animation: float 7s ease-in-out infinite;
}
.w1 {
  top: 8px;
  left: 56px;
}
.w2 {
  top: 168px;
  left: 0;
  animation-delay: -2.2s;
}
.w3 {
  top: 328px;
  left: 70px;
  animation-delay: -4.4s;
}
.w-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--ink);
  font-size: 28px;
}
.w-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.w-info b {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.1;
  color: #fff;
  text-transform: uppercase;
}
.w-info small {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}
.w-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #7be0a4;
}
.w-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d37a;
  box-shadow: 0 0 0 4px rgba(52, 211, 122, 0.2);
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* =========================================================
   USP
========================================================= */
.usp-wrap {
  position: relative;
  z-index: 5;
  margin-top: -64px;
}
.usp {
  display: grid;
  grid-template-columns: 1fr;
  background: var(--ink-2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
@media (min-width: 768px) {
  .usp {
    grid-template-columns: repeat(3, 1fr);
  }
}
.usp-item {
  text-align: center;
  padding: 36px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.usp-item:last-child {
  border-bottom: 0;
}
@media (min-width: 768px) {
  .usp-item {
    border-bottom: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
  .usp-item:last-child {
    border-right: 0;
  }
}
.usp-icon {
  font-size: 30px;
  color: var(--accent);
  margin-bottom: 12px;
}
.usp-title {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.1;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 10px;
}
.usp-desc {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.66);
}

/* =========================================================
   SHARED CARD PIECES
========================================================= */
.card-title {
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.6rem;
  line-height: 1.1;
  margin: 0 0 10px;
  color: var(--ink);
}
.card-text {
  font-size: 0.92rem;
  color: var(--muted);
  margin: 0;
}
.icon-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: var(--paper);
  border: 1px solid #ddd5c6;
  font-size: 26px;
  color: var(--ink);
  transition: all 0.3s ease;
}
.icon-box.solid {
  background: var(--accent);
  border-color: var(--accent);
}
.tag {
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 600;
  color: #8a8f98;
  text-align: right;
}
.tag.light {
  display: block;
  text-align: left;
  color: var(--accent-soft);
  margin-bottom: 6px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.chips li {
  font-size: 0.74rem;
  font-weight: 500;
  padding: 5px 10px;
  background: var(--paper);
  border-radius: 4px;
  color: var(--muted);
}
.chips li.hit {
  background: var(--accent);
  color: var(--ink);
  font-weight: 600;
}
.chips li.more {
  background: transparent;
  color: var(--accent-dark);
  font-weight: 600;
  padding-left: 2px;
}

/* =========================================================
   PROFESI
========================================================= */
.seo-inline {
  margin-bottom: 56px;
  text-align: center;
}
.seo-inline-title {
  margin: 0 0 12px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  line-height: 1.12;
}
.seo-inline-desc {
  margin: 0 auto;
  max-width: 780px;
  color: var(--muted);
  font-size: 1.02rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1 1 360px;
}
.filter {
  padding: 10px 18px;
  border: 1px solid #cfc7b8;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.06em;
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
.search-box {
  position: relative;
  flex: 0 1 340px;
  width: 100%;
  max-width: 380px;
  margin-left: auto;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #8a8f98;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #cfc7b8;
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
  color: #8a8f98;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(255, 138, 31, 0.2);
}
.no-results {
  margin: 24px 0 0;
  color: var(--muted);
}

.cat-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 700px) {
  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .cat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.cat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  padding: 28px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.cat-stripe {
  position: absolute;
  left: 0;
  top: 0;
  height: 4px;
  width: 0;
  background: repeating-linear-gradient(
    -45deg,
    var(--accent) 0 8px,
    var(--ink) 8px 16px
  );
  transition: width 0.45s ease;
}
.cat-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 28px 48px -28px rgba(16, 24, 38, 0.35);
}
.cat-card:hover .cat-stripe {
  width: 100%;
}
.cat-card:hover .icon-box {
  background: var(--accent);
  border-color: var(--accent);
}
.cat-card:focus-visible {
  outline: 3px solid rgba(255, 138, 31, 0.5);
  outline-offset: 2px;
}
.cat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}
.cat-card .chips {
  margin: 20px 0 22px;
}
.cat-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent-dark);
}

/* =========================================================
   CORE VALUES
========================================================= */
.value-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 700px) {
  .value-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.value-card {
  display: flex;
  flex-direction: column;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 28px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.value-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 138, 31, 0.45);
  box-shadow: 0 18px 40px -24px rgba(16, 24, 38, 0.35);
}
.value-card .icon-box {
  margin-bottom: 18px;
}
.value-card .tag {
  margin-bottom: 10px;
  align-self: flex-start;
}

/* =========================================================
   SKEMA
========================================================= */
.model-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 700px) {
  .model-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1100px) {
  .model-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.model-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 28px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 14px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}
.model-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
.model-card .icon-box {
  margin-bottom: 18px;
  background: #fff;
}
.model-card .chips {
  margin-top: 18px;
}
.model-card .chips li {
  background: #fff;
}

/* =========================================================
   PROSES
========================================================= */
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 36px;
  grid-template-columns: 1fr;
  position: relative;
}
@media (min-width: 700px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1100px) {
  .steps {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
  .steps::before {
    content: "";
    position: absolute;
    top: 44px;
    left: 10%;
    right: 10%;
    height: 2px;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(255, 138, 31, 0.7) 0 8px,
      transparent 8px 18px
    );
  }
}
.step {
  position: relative;
  text-align: center;
}
.step-badge {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin: 0 auto 22px;
  border-radius: 50%;
  background: var(--ink-2);
  border: 1px solid rgba(255, 138, 31, 0.5);
  color: var(--accent);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;
}
.step-badge .step-icon {
  display: block;
  width: 36px;
  height: 36px;
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
}
.step-num {
  /* sebelumnya: .step-badge span */
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 700;
}
.step:hover .step-badge {
  border-color: var(--accent);
  color: var(--accent-soft);
  box-shadow: 0 0 40px -8px rgba(255, 138, 31, 0.55);
}
.step h3 {
  margin: 0 0 8px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.35rem;
  line-height: 1.1;
}
.step p {
  margin: 0 auto;
  max-width: 220px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* =========================================================
   STANDAR
========================================================= */
.quality-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  margin-bottom: 36px;
}
@media (min-width: 640px) {
  .quality-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .quality-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.quality-card {
  padding: 28px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}
.quality-card .icon-box {
  margin-bottom: 20px;
}
.quality-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
.quality-card:hover .icon-box {
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
  color: rgba(255, 255, 255, 0.58);
}
.standards-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.standards-badges span {
  padding: 8px 14px;
  border: 1px solid rgba(255, 138, 31, 0.5);
  border-radius: 6px;
  color: var(--accent-soft);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* =========================================================
   INDUSTRI
========================================================= */
.ind-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 700px) {
  .ind-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1024px) {
  .ind-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
.ind-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 12px;
  text-align: center;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 14px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  line-height: 1.15;
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
}
.ind-tile > :first-child {
  font-size: 34px;
  color: var(--accent-dark);
  transition: color 0.3s ease;
}
.ind-tile:hover {
  transform: translateY(-4px);
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}
.ind-tile:hover > :first-child {
  color: var(--accent);
}

/* =========================================================
   FAQ
========================================================= */
.faq-list {
  display: grid;
  gap: 12px;
}
.faq {
  background: #fff;
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
   CTA + FORM
========================================================= */
.cta {
  background: var(--ink);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
}
.cta-grid {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .cta-grid {
    grid-template-columns: 1.1fr 1fr;
  }
}
.cta-main {
  padding: 44px 28px;
}
@media (min-width: 768px) {
  .cta-main {
    padding: 60px;
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
  font-size: clamp(2.2rem, 4.6vw, 3.3rem);
  line-height: 1.02;
  color: #fff;
}
.cta-main > p {
  margin: 0 0 32px;
  max-width: 460px;
  color: rgba(255, 255, 255, 0.64);
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
.cta-main .cta-area {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 28px 0 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
}
.cta-area > :first-child {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 20px;
  color: var(--accent);
}

.cta-form {
  padding: 36px 28px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
@media (min-width: 768px) {
  .cta-form {
    padding: 48px;
  }
}
@media (min-width: 1024px) {
  .cta-form {
    border-top: 0;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
  }
}
.cta-form h3 {
  margin: 0 0 22px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.6rem;
  color: #fff;
}
.field {
  display: block;
  margin-bottom: 16px;
}
.field > span {
  display: block;
  margin-bottom: 6px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
}
.field em {
  color: var(--accent);
  font-style: normal;
}
.field input,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font: inherit;
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.field textarea {
  resize: vertical;
}
.field input::placeholder,
.field textarea::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(255, 138, 31, 0.22);
}
.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 14px;
}
@media (min-width: 520px) {
  .field-row {
    grid-template-columns: 1fr 120px;
  }
}
.form-error {
  margin: 0 0 14px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(255, 90, 70, 0.14);
  border: 1px solid rgba(255, 90, 70, 0.4);
  color: #ffb3a8;
  font-size: 0.88rem;
}
.form-hint {
  margin: 14px 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
}

/* =========================================================
   MODAL
========================================================= */
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(16, 24, 38, 0.78);
  backdrop-filter: blur(4px);
}
.dialog {
  position: relative;
  width: 100%;
  max-width: 880px;
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.6);
}
.dialog-close {
  position: absolute;
  top: 20px;
  right: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.dialog-close:hover {
  background: rgba(255, 255, 255, 0.22);
}
.dialog-head {
  background: var(--ink);
  color: #fff;
}
.dialog-head-inner {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 28px 72px 28px 28px;
}
.dialog-title {
  margin: 0 0 8px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  line-height: 1.05;
}
.dialog-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.98rem;
}
.dialog-body {
  padding: 8px 28px 28px;
}
.d-section {
  padding-top: 24px;
}
.d-section + .d-section,
.d-cols {
  border-top: 1px solid var(--line);
  margin-top: 24px;
}
.d-cols {
  display: grid;
  gap: 0 32px;
}
@media (min-width: 768px) {
  .d-cols {
    grid-template-columns: 1fr 1fr;
  }
}
.d-cols .d-section {
  border-top: 0;
  margin-top: 0;
}
.d-title {
  margin: 0 0 14px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.3rem;
  color: var(--ink);
}
.role-grid {
  display: grid;
  gap: 10px 20px;
  grid-template-columns: 1fr;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (min-width: 640px) {
  .role-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.role-grid li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.93rem;
  color: var(--ink);
}
.role-grid li > :first-child {
  flex-shrink: 0;
  margin-top: 3px;
  font-size: 18px;
  color: var(--accent-dark);
}
.d-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 0.93rem;
}
.d-env {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 18px 0 0;
  font-size: 0.9rem;
  color: var(--muted);
}
.d-env > :first-child {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 20px;
  color: var(--accent-dark);
}
.d-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
  padding: 20px 24px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
}
.d-cta p {
  margin: 0;
  font-weight: 600;
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
  .w-card,
  .fade-up {
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
