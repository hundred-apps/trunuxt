<template>
  <div class="page min-h-screen bg-[#faf8f3] text-[#1d2b26] overflow-x-hidden">
    <!-- 1. HERO -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div
          class="bg-cover bg-center w-full h-full animate-slow-zoom"
          :style="{
            backgroundImage: `url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop')`,
          }"
        ></div>
        <div class="absolute inset-0 bg-[#0b241c]/70"></div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#0b241c] via-[#0b241c]/60 to-transparent"
        ></div>
        <div
          class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b241c]/80 to-transparent"
        ></div>
      </div>

      <!-- Matahari (halus, kanan atas) -->
      <div class="sun" aria-hidden="true">
        <div class="sun-rays"></div>
        <div class="sun-core"></div>
      </div>

      <!-- Turbin (kanan bawah, siluet elegan) -->
      <div class="turbines hidden md:flex" aria-hidden="true">
        <div
          class="turbine"
          style="--size: 46px; --pole: 64px; --spin: 9s; opacity: 0.35"
        >
          <div class="tw-blades"><span></span><span></span><span></span></div>
          <div class="tw-hub"></div>
          <div class="tw-pole"></div>
        </div>
        <div
          class="turbine"
          style="--size: 78px; --pole: 112px; --spin: 6s; opacity: 0.6"
        >
          <div class="tw-blades"><span></span><span></span><span></span></div>
          <div class="tw-hub"></div>
          <div class="tw-pole"></div>
        </div>
        <div
          class="turbine"
          style="--size: 58px; --pole: 84px; --spin: 7.5s; opacity: 0.45"
        >
          <div class="tw-blades"><span></span><span></span><span></span></div>
          <div class="tw-hub"></div>
          <div class="tw-pole"></div>
        </div>
      </div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-28">
        <div class="max-w-3xl">
          <div class="flex items-center gap-4 mb-8 animate-fade-in-up">
            <span class="h-px w-12 bg-[#c9a66b]"></span>
            <span class="eyebrow text-[#e6d3ad]">{{
              t("page.principal.renewable.hero.badge")
            }}</span>
          </div>

          <h1
            class="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.02] mb-8 animate-fade-in-up"
            style="animation-delay: 100ms"
          >
            {{ t("page.principal.renewable.hero.titleLine1") }}
            <em class="block text-[#9fd8b8] font-normal">{{
              t("page.principal.renewable.hero.titleLine2")
            }}</em>
          </h1>

          <p
            class="text-lg md:text-xl text-white/75 mb-12 max-w-xl leading-relaxed font-light animate-fade-in-up"
            style="animation-delay: 200ms"
          >
            {{ t("page.principal.renewable.hero.subtitle") }}
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style="animation-delay: 300ms"
          >
            <button class="btn btn-brass" @click="scrollTo('contact')">
              {{ t("page.principal.renewable.hero.ctaQuote") }}
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
            <button class="btn btn-ghost" @click="scrollTo('solutions')">
              {{ t("page.principal.renewable.hero.ctaServices") }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/50"
        aria-hidden="true"
      >
        <span class="text-[10px] tracking-[0.3em] uppercase">{{
          t("page.principal.renewable.hero.scroll")
        }}</span>
        <span class="scroll-line"></span>
      </div>
    </section>

    <!-- 2. STATS -->
    <section class="relative -mt-14 z-20 max-w-6xl mx-auto px-6 md:px-10">
      <div
        class="bg-white rounded-2xl shadow-[0_30px_60px_-30px_rgba(11,36,28,0.35)] border border-[#e7e2d6] grid grid-cols-2 md:grid-cols-4"
        data-reveal
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-cell text-center px-6 py-9 group"
        >
          <Icon
            :name="stat.icon"
            class="text-2xl text-[#b8935a] mb-3 transition-transform duration-500 group-hover:-translate-y-1"
          />
          <div class="font-display text-4xl md:text-5xl text-[#0f3a2c] mb-1">
            {{ stat.value }}
          </div>
          <p class="text-xs tracking-[0.15em] uppercase text-[#6b7a72]">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </section>

    <!-- 3. SOLUTIONS -->
    <section class="sec-block sec-cream py-28 md:py-36 relative" id="solutions">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-16 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.solutions.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-6xl text-[#0f3a2c] leading-[1.05]"
            >
              {{ t("page.principal.renewable.solutions.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.solutions.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-[#56655d] leading-relaxed">
            {{ t("page.principal.renewable.solutions.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Flagship -->
          <article
            v-if="flagship"
            class="lg:col-span-7 relative overflow-hidden rounded-[28px] bg-[#0b241c] group min-h-[480px] lg:row-span-2"
            data-reveal
          >
            <img
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop"
              :alt="flagship.name"
              class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0b241c] via-[#0b241c]/50 to-transparent"
            ></div>
            <div
              class="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end"
            >
              <span class="eyebrow text-[#e6d3ad] mb-4">{{
                t("page.principal.renewable.solutions.flagshipTag")
              }}</span>
              <h3 class="font-display text-4xl md:text-5xl text-white mb-4">
                {{ flagship.name }}
              </h3>
              <p class="text-white/75 max-w-lg mb-8 leading-relaxed">
                {{ flagship.description }}
              </p>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="chip in flagship.chips"
                  :key="chip"
                  class="px-4 py-1.5 text-xs tracking-wide text-white/90 rounded-full border border-white/25 backdrop-blur-md bg-white/5"
                >
                  {{ chip }}
                </li>
              </ul>
            </div>
          </article>

          <!-- Others -->
          <article
            v-for="(item, index) in otherSolutions"
            :key="index"
            class="solution-card lg:col-span-5 group"
            data-reveal
          >
            <div class="flex items-start justify-between gap-4">
              <div
                class="icon-ring group-hover:bg-[#0f3a2c] group-hover:border-[#0f3a2c]"
              >
                <Icon
                  :name="item.icon"
                  class="text-2xl text-[#2f7a5a] group-hover:text-[#e6d3ad] transition-colors"
                />
              </div>
              <span class="font-display text-3xl text-[#d9d2c0]">
                0{{ index + 2 }}
              </span>
            </div>
            <div>
              <h3 class="font-display text-2xl text-[#0f3a2c] mb-2">
                {{ item.name }}
              </h3>
              <p class="text-[#56655d] text-sm leading-relaxed mb-4">
                {{ item.description }}
              </p>
              <a
                href="#contact"
                class="inline-flex items-center gap-1 text-sm font-medium text-[#8a6c3b] hover:text-[#0f3a2c] transition-colors"
              >
                {{ t("page.principal.renewable.solutions.learnMore") }}
                <Icon
                  name="mdi:arrow-right"
                  class="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 3b. SOLAR SYSTEM TYPES (ON-GRID / OFF-GRID / HYBRID) -->
    <section class="sec-block sec-white py-20 md:py-28 bg-white relative" id="solar-systems">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-14 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.solarSystems.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-5xl text-[#0f3a2c] leading-[1.05]"
            >
              {{ t("page.principal.renewable.solarSystems.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.solarSystems.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-[#56655d] leading-relaxed">
            {{ t("page.principal.renewable.solarSystems.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="item in solarSystemItems"
            :key="item.name"
            class="rounded-[24px] border border-[#e7e2d6] bg-[#faf8f3] p-8 flex flex-col"
            data-reveal
          >
            <div class="flex items-start justify-between gap-4 mb-5">
              <div class="icon-ring">
                <Icon :name="item.icon" class="text-2xl text-[#2f7a5a]" />
              </div>
              <span
                class="text-[11px] tracking-[0.12em] uppercase font-semibold text-[#8a6c3b] bg-[#f1ede1] px-3 py-1 rounded-full"
                >{{ item.badge }}</span
              >
            </div>
            <h3 class="font-display text-2xl text-[#0f3a2c] mb-3">
              {{ item.name }}
            </h3>
            <p class="text-[#56655d] text-sm leading-relaxed mb-5">
              {{ item.description }}
            </p>
            <ul class="space-y-3 mt-auto">
              <li
                v-for="point in item.points"
                :key="point"
                class="flex items-start gap-3 text-sm text-[#42524b] leading-relaxed"
              >
                <Icon
                  name="mdi:check-circle-outline"
                  class="text-[#2f7a5a] text-lg mt-0.5 shrink-0"
                />
                <span>{{ point }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- 3c. BENEFITS (PROPOSAL) -->
    <section class="sec-block sec-sage py-20 md:py-28 bg-[#eef5f0] relative" id="benefits">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-14 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.benefits.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-5xl text-[#0f3a2c] leading-[1.05]"
            >
              {{ t("page.principal.renewable.benefits.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.benefits.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-[#56655d] leading-relaxed">
            {{ t("page.principal.renewable.benefits.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article
            v-for="(item, index) in benefits"
            :key="index"
            class="solution-card group"
            data-reveal
          >
            <div class="icon-ring group-hover:bg-[#0f3a2c] group-hover:border-[#0f3a2c] mb-5">
              <Icon
                :name="item.icon"
                class="text-2xl text-[#2f7a5a] group-hover:text-[#e6d3ad] transition-colors"
              />
            </div>
            <h3 class="font-display text-xl text-[#0f3a2c] mb-2">
              {{ item.title }}
            </h3>
            <p class="text-[#56655d] text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. WHY CHOOSE US -->
    <section class="sec-block sec-sand py-28 md:py-36 bg-[#f1ede1] relative">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          <div class="relative" data-reveal>
            <div
              class="absolute -top-6 -left-6 w-2/3 h-2/3 rounded-[28px] border border-[#c9a66b]/60"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2070&auto=format&fit=crop"
              :alt="t('page.principal.renewable.why.imageAlt')"
              class="relative rounded-[28px] shadow-2xl w-full object-cover aspect-[4/5] md:aspect-[4/3]"
            />
            <div
              class="absolute -bottom-8 right-4 md:-right-8 bg-white px-7 py-6 rounded-2xl shadow-xl border border-[#e7e2d6]"
            >
              <div class="flex items-center gap-4">
                <div class="icon-ring !w-12 !h-12">
                  <Icon
                    name="mdi:check-decagram"
                    class="text-2xl text-[#b8935a]"
                  />
                </div>
                <div>
                  <p
                    class="text-[10px] tracking-[0.2em] uppercase text-[#6b7a72]"
                  >
                    {{
                      t("page.principal.renewable.why.certifiedLabel")
                    }}
                  </p>
                  <p class="font-display text-2xl text-[#0f3a2c]">
                    {{ t("page.principal.renewable.why.certifiedName") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal>
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.why.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-5xl text-[#0f3a2c] leading-[1.08] mb-6"
            >
              {{ t("page.principal.renewable.why.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.why.titleLine2")
              }}</em>
            </h2>
            <p class="text-lg text-[#56655d] mb-10 leading-relaxed">
              {{ t("page.principal.renewable.why.description") }}
            </p>

            <div class="divide-y divide-[#ddd6c3]">
              <div
                v-for="(item, index) in whyItems"
                :key="index"
                class="flex gap-5 py-6 group first:pt-0"
              >
                <div
                  class="icon-ring shrink-0 group-hover:bg-[#0f3a2c] group-hover:border-[#0f3a2c]"
                >
                  <Icon
                    :name="item.icon"
                    class="text-2xl text-[#2f7a5a] group-hover:text-[#e6d3ad] transition-colors"
                  />
                </div>
                <div>
                  <h4 class="font-display text-xl text-[#0f3a2c] mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-[#56655d] text-sm leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4b. FACTS (PROPOSAL) -->
    <section class="sec-block sec-dark py-28 md:py-36 bg-[#0b241c] text-white relative overflow-hidden" id="facts">
      <div class="glow" aria-hidden="true"></div>
      <div class="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-14 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#c9a66b]"></span>
              <span class="eyebrow text-[#e6d3ad]">{{
                t("page.principal.renewable.facts.sectionLabel")
              }}</span>
            </div>
            <h2 class="font-display text-4xl md:text-5xl text-white leading-[1.05]">
              {{ t("page.principal.renewable.facts.titleLine1") }}
              <em class="text-[#9fd8b8] font-normal">{{
                t("page.principal.renewable.facts.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-white/70 leading-relaxed">
            {{ t("page.principal.renewable.facts.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-5 space-y-6" data-reveal>
            <div class="rounded-[24px] border border-white/10 bg-white/5 p-8">
              <h3 class="font-display text-2xl text-white mb-3">
                {{ facts.adoptionTitle }}
              </h3>
              <p class="text-white/75 leading-relaxed">
                {{ facts.adoptionDesc }}
              </p>
            </div>
            <div class="rounded-[24px] border border-[#c9a66b]/30 bg-[#0f3a2c]/60 p-8">
              <h3 class="font-display text-2xl text-white mb-5">
                {{ facts.supportTitle }}
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="(item, index) in facts.supports"
                  :key="index"
                  class="flex items-start gap-3 text-sm text-white/80 leading-relaxed"
                >
                  <Icon
                    name="mdi:check-decagram-outline"
                    class="text-[#c9a66b] text-lg mt-0.5 shrink-0"
                  />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-7" data-reveal>
            <div class="rounded-[24px] border border-white/10 bg-white/5 p-8 h-full">
              <h3 class="font-display text-2xl text-white mb-6">
                {{ facts.growthTitle }}
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(row, index) in facts.growth"
                  :key="index"
                  class="grid grid-cols-[64px_1fr_auto] items-center gap-4"
                >
                  <span class="text-sm font-medium text-[#e6d3ad]">{{
                    row.year
                  }}</span>
                  <div class="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-[#2f7a5a] to-[#9fd8b8]"
                      :style="{ width: `${20 + index * 20}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-white/85 whitespace-nowrap">{{
                    row.value
                  }}</span>
                </div>
              </div>
              <p class="mt-6 text-xs text-white/50 leading-relaxed border-t border-white/10 pt-4">
                {{ facts.note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. HOW IT WORKS -->
    <section
      class="sec-block sec-dark-alt py-28 md:py-36 bg-[#12382b] text-white relative overflow-hidden"
      id="process"
    >
      <div class="glow" aria-hidden="true"></div>
      <div class="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div class="text-center mb-20 max-w-2xl mx-auto" data-reveal>
          <div class="flex items-center justify-center gap-4 mb-5">
            <span class="h-px w-10 bg-[#c9a66b]"></span>
            <span class="eyebrow text-[#e6d3ad]">{{
              t("page.principal.renewable.process.sectionLabel")
            }}</span>
            <span class="h-px w-10 bg-[#c9a66b]"></span>
          </div>
          <h2 class="font-display text-4xl md:text-6xl mb-5">
            {{ t("page.principal.renewable.process.title") }}
          </h2>
          <p class="text-lg text-white/60 font-light">
            {{ t("page.principal.renewable.process.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
          <div
            class="hidden md:block absolute top-[44px] left-[12.5%] right-[12.5%] h-px energy-line-dark"
          ></div>

          <div
            v-for="(step, index) in processSteps"
            :key="index"
            class="relative text-center"
            data-reveal
          >
            <div
              class="w-[88px] h-[88px] mx-auto rounded-full bg-[#0f3a2c] border border-[#c9a66b]/50 flex items-center justify-center relative z-10 mb-7 hover:border-[#c9a66b] hover:shadow-[0_0_40px_-8px_rgba(201,166,107,0.5)] transition-all duration-500"
            >
              <Icon :name="step.icon" class="text-3xl text-[#e6d3ad]" />
              <span
                class="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#c9a66b] text-[#0b241c] text-xs font-bold flex items-center justify-center"
              >
                {{ index + 1 }}
              </span>
            </div>
            <h3 class="font-display text-2xl mb-3">{{ step.title }}</h3>
            <p
              class="text-white/55 text-sm leading-relaxed max-w-[220px] mx-auto"
            >
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5b. PROCUREMENT SCHEMES (PROPOSAL) -->
    <section class="sec-block sec-sand py-28 md:py-36 bg-[#f1ede1] relative" id="schemes">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-14 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.schemes.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-5xl text-[#0f3a2c] leading-[1.05]"
            >
              {{ t("page.principal.renewable.schemes.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.schemes.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-[#56655d] leading-relaxed">
            {{ t("page.principal.renewable.schemes.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="(item, index) in schemes"
            :key="index"
            class="bg-white rounded-[24px] border border-[#e7e2d6] p-8 flex flex-col hover:shadow-[0_20px_50px_-30px_rgba(11,36,28,0.35)] transition-shadow duration-300"
            data-reveal
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="icon-ring">
                <Icon :name="item.icon" class="text-2xl text-[#2f7a5a]" />
              </div>
              <span class="font-display text-3xl text-[#d9d2c0]">
                0{{ index + 1 }}
              </span>
            </div>
            <h3 class="font-display text-2xl text-[#0f3a2c] mb-1">
              {{ item.title }}
            </h3>
            <p class="text-sm font-medium text-[#8a6c3b] mb-3">
              {{ item.tagline }}
            </p>
            <p class="text-[#56655d] text-sm leading-relaxed mb-5">
              {{ item.description }}
            </p>
            <ul class="space-y-2 mt-auto">
              <li
                v-for="(benefit, bIndex) in item.benefits"
                :key="bIndex"
                class="flex items-start gap-2.5 text-sm text-[#42524b]"
              >
                <Icon
                  name="mdi:check-circle-outline"
                  class="text-[#2f7a5a] text-lg mt-0.5 shrink-0"
                />
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- 6. APPLICATIONS -->
    <section class="sec-block sec-white py-28 md:py-36 bg-white relative">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="text-center mb-16" data-reveal>
          <div class="flex items-center justify-center gap-4 mb-5">
            <span class="h-px w-10 bg-[#b8935a]"></span>
            <span class="eyebrow text-[#8a6c3b]">{{
              t("page.principal.renewable.applications.sectionLabel")
            }}</span>
            <span class="h-px w-10 bg-[#b8935a]"></span>
          </div>
          <h2 class="font-display text-4xl md:text-6xl text-[#0f3a2c] mb-4">
            {{ t("page.principal.renewable.applications.titleLine1") }}
            <em class="text-[#2f7a5a] font-normal">{{
              t("page.principal.renewable.applications.titleLine2")
            }}</em>
          </h2>
          <p class="text-lg text-[#56655d]">
            {{ t("page.principal.renewable.applications.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div
            v-for="(app, index) in applications"
            :key="index"
            class="app-card group"
            data-reveal
          >
            <div
              class="icon-ring !w-16 !h-16 mx-auto mb-5 group-hover:bg-[#0f3a2c] group-hover:border-[#0f3a2c]"
            >
              <Icon
                :name="app.icon"
                class="text-3xl text-[#2f7a5a] group-hover:text-[#e6d3ad] transition-colors"
              />
            </div>
            <h4 class="font-display text-xl text-[#0f3a2c]">{{ app.name }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- 6b. ASSESSMENT / PRELIMINARY (PROPOSAL) -->
    <section class="sec-block sec-sand py-20 md:py-28 bg-[#f1ede1] relative" id="assessment">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-12 items-end" data-reveal>
          <div class="lg:col-span-7">
            <div class="flex items-center gap-4 mb-5">
              <span class="h-px w-12 bg-[#b8935a]"></span>
              <span class="eyebrow text-[#8a6c3b]">{{
                t("page.principal.renewable.assessment.sectionLabel")
              }}</span>
            </div>
            <h2
              class="font-display text-4xl md:text-5xl text-[#0f3a2c] leading-[1.05]"
            >
              {{ t("page.principal.renewable.assessment.titleLine1") }}
              <em class="text-[#2f7a5a] font-normal">{{
                t("page.principal.renewable.assessment.titleLine2")
              }}</em>
            </h2>
          </div>
          <p class="lg:col-span-5 text-lg text-[#56655d] leading-relaxed">
            {{ t("page.principal.renewable.assessment.subtitle") }}
          </p>
        </div>

        <div
          class="bg-white rounded-[28px] border border-[#e7e2d6] p-6 md:p-8"
          data-reveal
        >
          <ul class="grid grid-cols-1 gap-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
            <li
              v-for="(item, index) in assessmentItems"
              :key="index"
              class="flex items-start gap-4 rounded-2xl border border-[#ece7da] bg-[#faf8f3] px-5 py-4"
            >
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f3a2c] text-[11px] font-semibold tracking-wide text-[#e6d3ad]"
              >
                0{{ index + 1 }}
              </span>
              <span class="text-[15px] leading-relaxed text-[#42524b] pt-0.5">
                {{ item }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 7. CONTACT -->
    <section class="sec-block sec-cream py-28 md:py-36 bg-[#faf8f3] relative" id="contact">
      <div class="max-w-6xl mx-auto px-6 md:px-10" data-reveal>
        <div
          class="rounded-[32px] overflow-hidden bg-[#0f3a2c] shadow-[0_40px_80px_-40px_rgba(11,36,28,0.7)] relative"
        >
          <div class="glow glow-sm" aria-hidden="true"></div>

          <div class="p-10 md:p-16 relative z-10">
            <span class="eyebrow text-[#e6d3ad] mb-5 block">{{
              t("page.principal.renewable.contact.eyebrow")
            }}</span>
            <h2
              class="font-display text-4xl md:text-5xl text-white leading-[1.08] mb-5"
            >
              {{ t("page.principal.renewable.contact.titleLine1") }}
              <em class="text-[#9fd8b8] font-normal">{{
                t("page.principal.renewable.contact.titleLine2")
              }}</em>
            </h2>
            <p class="text-white/65 mb-10 text-lg font-light max-w-2xl">
              {{ t("page.principal.renewable.contact.needDesc") }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <button class="btn btn-brass" @click="handleContact">
                <Icon name="mdi:whatsapp" class="text-xl" />
                {{ t("page.principal.renewable.contact.whatsapp") }}
              </button>
              <button class="btn btn-ghost" @click="handleEmail">
                <Icon name="mdi:email-outline" class="text-xl" />
                {{ t("page.principal.renewable.contact.email") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";

const { t, tm, rt } = useI18n();
const { trackWhatsAppClick } = useAnalytics();

// Helper: ambil array dari pesan i18n
const i18nArr = (key: string) => {
  const items = tm(key);
  return Array.isArray(items) ? items : [];
};

const stats = computed(() =>
  i18nArr("page.principal.renewable.stats.items").map((item: any) => ({
    icon: rt(item.icon),
    value: rt(item.value),
    label: rt(item.label),
  }))
);

const solutions = computed(() =>
  i18nArr("page.principal.renewable.solutions.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    description: rt(item.description),
    chips: Array.isArray(item.chips) ? item.chips.map((c: any) => rt(c)) : [],
  }))
);

const flagship = computed(
  () => solutions.value[0] || { name: "", description: "", chips: [] }
);
const otherSolutions = computed(() => solutions.value.slice(1));

const whyItems = computed(() =>
  i18nArr("page.principal.renewable.why.items").map((item: any) => ({
    title: rt(item.title),
    icon: rt(item.icon),
    description: rt(item.description),
  }))
);

const processSteps = computed(() =>
  i18nArr("page.principal.renewable.process.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const solarSystemItems = computed(() =>
  i18nArr("page.principal.renewable.solarSystems.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    badge: rt(item.badge),
    description: rt(item.description),
    points: Array.isArray(item.points)
      ? item.points.map((p: any) => rt(p))
      : [],
  }))
);

const benefits = computed(() =>
  i18nArr("page.principal.renewable.benefits.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    description: rt(item.description),
  }))
);

const facts = computed(() => ({
  adoptionTitle: t("page.principal.renewable.facts.adoptionTitle"),
  adoptionDesc: t("page.principal.renewable.facts.adoptionDesc"),
  growthTitle: t("page.principal.renewable.facts.growthTitle"),
  growth: i18nArr("page.principal.renewable.facts.growth").map((g: any) => ({
    year: rt(g.year),
    value: rt(g.value),
  })),
  supportTitle: t("page.principal.renewable.facts.supportTitle"),
  supports: i18nArr("page.principal.renewable.facts.supports").map((s: any) =>
    rt(s)
  ),
  note: t("page.principal.renewable.facts.note"),
}));

const schemes = computed(() =>
  i18nArr("page.principal.renewable.schemes.items").map((item: any) => ({
    icon: rt(item.icon),
    title: rt(item.title),
    tagline: rt(item.tagline),
    description: rt(item.description),
    benefits: Array.isArray(item.benefits)
      ? item.benefits.map((b: any) => rt(b))
      : [],
  }))
);

const assessmentItems = computed(() =>
  i18nArr("page.principal.renewable.assessment.items").map((item: any) =>
    rt(item)
  )
);

const applications = computed(() =>
  i18nArr("page.principal.renewable.applications.items").map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
  }))
);

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleContact = () => {
  const text = encodeURIComponent(
    t("page.principal.renewable.contact.waText")
  );
  const url = `https://wa.me/6285176912338?text=${text}`;
  trackWhatsAppClick("principal_renewable_contact", {
    link_url: url,
    page_path: "/principal/renewable-energy",
    link_label: "Renewable Energy WhatsApp Contact",
  });
  window.open(url, "_blank");
};

const handleEmail = () => {
  const subject = encodeURIComponent(
    t("page.principal.renewable.contact.emailSubject")
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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer?.observe(el);
  });
});

onBeforeUnmount(() => observer?.disconnect());

// ============ SEO ============
const SITE_URL = "https://www.trumecs.com";
const PAGE_PATH = "/principal/renewable-energy";

const localeHead = useLocaleHead();
useHead({
  title: () => t("page.principal.renewable.seo.title"),
  titleTemplate: "%s",
  htmlAttrs: computed(() => localeHead.value.htmlAttrs ?? {}),
  link: computed(() => [
    ...(localeHead.value.link ?? []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@300;400;500;600&display=swap",
    },
  ]),
  meta: computed(() => [
    ...(localeHead.value.meta ?? []),
    {
      name: "description",
      content: t("page.principal.renewable.seo.description"),
    },
    {
      property: "og:title",
      content: t("page.principal.renewable.seo.title"),
    },
    {
      property: "og:description",
      content: t("page.principal.renewable.seo.description"),
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
        name: t("page.principal.renewable.seo.title"),
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Renewable Energy Solutions",
    name: t("page.principal.renewable.seo.title"),
    description: t("page.principal.renewable.seo.description"),
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
.page {
  font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
}
.font-display {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.font-display em {
  font-style: italic;
}
.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 600;
}

/* ============ BUTTONS ============ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.35s ease;
  cursor: pointer;
}
.btn-brass {
  background: #c9a66b;
  color: #0b241c;
  border: 1px solid #c9a66b;
}
.btn-brass:hover {
  background: #e0c38d;
  box-shadow: 0 10px 30px -8px rgba(201, 166, 107, 0.6);
  transform: translateY(-2px);
}
.btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-2px);
}

/* ============ COMPONENT PIECES ============ */
.stat-cell + .stat-cell {
  border-left: 1px solid #eee8d9;
}
@media (max-width: 767px) {
  .stat-cell:nth-child(3) {
    border-left: 0;
  }
  .stat-cell:nth-child(n + 3) {
    border-top: 1px solid #eee8d9;
  }
}

.icon-ring {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  border: 1px solid #cfe0d5;
  background: #eef5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}

.solution-card {
  background: #fff;
  border: 1px solid #e7e2d6;
  border-radius: 28px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  min-height: 230px;
  transition: all 0.4s ease;
}
.solution-card:hover {
  border-color: #c9a66b;
  transform: translateY(-4px);
  box-shadow: 0 30px 50px -30px rgba(15, 58, 44, 0.35);
}

.app-card {
  background: #fff;
  border: 1px solid #e7e2d6;
  border-radius: 24px;
  padding: 2.5rem 1rem;
  text-align: center;
  transition: all 0.4s ease;
}
.app-card:hover {
  transform: translateY(-5px);
  border-color: #c9a66b;
  box-shadow: 0 30px 50px -30px rgba(15, 58, 44, 0.35);
}

.glow {
  position: absolute;
  top: -20%;
  left: 50%;
  width: 70%;
  height: 60%;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse,
    rgba(47, 122, 90, 0.35) 0%,
    transparent 70%
  );
  pointer-events: none;
}
.glow-sm {
  top: -40%;
  left: 20%;
}

.scroll-line {
  width: 1px;
  height: 44px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), transparent);
  animation: scroll-hint 2s ease-in-out infinite;
  transform-origin: top;
}
@keyframes scroll-hint {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

/* ============ SUN ============ */
.sun {
  position: absolute;
  right: 6%;
  top: 14%;
  z-index: 5;
  width: 110px;
  height: 110px;
  opacity: 0.85;
}
@media (min-width: 768px) {
  .sun {
    right: 10%;
    width: 150px;
    height: 150px;
  }
}
.sun-rays {
  position: absolute;
  inset: -36px;
  border-radius: 9999px;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(230, 200, 140, 0.35) 0deg 2deg,
    transparent 2deg 15deg
  );
  -webkit-mask-image: radial-gradient(
    circle,
    transparent 38%,
    #000 40%,
    transparent 72%
  );
  mask-image: radial-gradient(
    circle,
    transparent 38%,
    #000 40%,
    transparent 72%
  );
  animation: sun-spin 60s linear infinite;
}
.sun-core {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(
    circle at 35% 35%,
    #fff3d1 0%,
    #f1d08a 50%,
    #d9a94f 100%
  );
  animation: sun-pulse 5s ease-in-out infinite;
}
@keyframes sun-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes sun-pulse {
  0%,
  100% {
    box-shadow:
      0 0 50px rgba(230, 190, 110, 0.45),
      0 0 110px rgba(230, 190, 110, 0.25);
  }
  50% {
    box-shadow:
      0 0 70px rgba(230, 190, 110, 0.7),
      0 0 150px rgba(230, 190, 110, 0.35);
  }
}

/* ============ TURBINES ============ */
.turbines {
  position: absolute;
  right: 4%;
  bottom: 8%;
  z-index: 5;
  align-items: flex-end;
  gap: 2.5rem;
}
.turbine {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--size);
  filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.3));
}
.tw-blades {
  position: relative;
  width: var(--size);
  height: var(--size);
  animation: turbine-spin var(--spin, 5s) linear infinite;
  transform-origin: center;
}
.tw-blades span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9%;
  height: 56%;
  margin-left: -4.5%;
  transform-origin: 50% 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.45)
  );
  border-radius: 999px 999px 40% 40%;
}
.tw-blades span:nth-child(1) {
  transform: rotate(0deg);
}
.tw-blades span:nth-child(2) {
  transform: rotate(120deg);
}
.tw-blades span:nth-child(3) {
  transform: rotate(240deg);
}
.tw-hub {
  position: absolute;
  left: 50%;
  top: calc(var(--size) / 2 - 5px);
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 9999px;
  background: #c9a66b;
  z-index: 2;
}
.tw-pole {
  width: 4px;
  height: var(--pole);
  margin-top: -5px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.85),
    rgba(255, 255, 255, 0.2)
  );
  border-radius: 6px;
}
@keyframes turbine-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============ ENERGY LINE ============ */
.energy-line-dark {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(201, 166, 107, 0.7) 0 8px,
    transparent 8px 18px
  );
  animation: energy-flow-x 1.2s linear infinite;
}
@keyframes energy-flow-x {
  to {
    background-position-x: 18px;
  }
}

/* ============ ENTRANCE ============ */
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(24px);
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slow-zoom {
  animation: slowZoom 24s ease-in-out infinite alternate;
}
@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

[data-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============ SECTION SEPARATION ============ */
.sec-block {
  position: relative;
}
.sec-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(184, 147, 90, 0.12) 18%,
    rgba(184, 147, 90, 0.55) 50%,
    rgba(184, 147, 90, 0.12) 82%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}
.sec-block::after {
  content: "";
  position: absolute;
  top: 8px;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  transform: rotate(45deg);
  background: #c9a66b;
  border-radius: 2px;
  box-shadow: 0 0 0 4px rgba(201, 166, 107, 0.12);
  pointer-events: none;
  z-index: 2;
}
.sec-block.sec-dark::before,
.sec-block.sec-dark-alt::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(159, 216, 184, 0.08) 18%,
    rgba(201, 166, 107, 0.65) 50%,
    rgba(159, 216, 184, 0.08) 82%,
    transparent 100%
  );
}
.sec-block.sec-dark::after,
.sec-block.sec-dark-alt::after {
  background: #9fd8b8;
  box-shadow: 0 0 0 4px rgba(159, 216, 184, 0.12);
}
/* clear band between consecutive dark sections (Facts -> Process) */
.sec-dark-alt {
  box-shadow: inset 0 3px 0 #c9a66b;
}
/* keep contrast when cards sit on white section backgrounds */
.sec-white .app-card {
  background: #faf8f3;
}

/* ============ REDUCED MOTION ============ */
@media (prefers-reduced-motion: reduce) {
  .sun-rays,
  .sun-core,
  .tw-blades,
  .energy-line-dark,
  .scroll-line,
  .animate-fade-in-up,
  .animate-slow-zoom {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
