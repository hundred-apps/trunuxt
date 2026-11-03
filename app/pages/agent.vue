<template>
  <div class="agent-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <!-- Hero -->
      <div
        class="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 lg:p-12 text-center text-white"
      >
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white mb-6"
        >
          <Icon name="material-symbols:handshake" class="text-lg" />
          {{ $t("page.agent.badge") }}
        </span>
        <h1 class="text-2xl lg:text-4xl font-bold mb-4">{{ $t("page.agent.heroTitle") }}</h1>
        <p class="text-white/90 mb-8 max-w-2xl mx-auto">{{ $t("page.agent.heroSubtitle") }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Trubutton
            :text="$t('page.agent.becomeAgent')"
            type="primary"
            variant="solid"
            size="large"
            class="bg-white text-orange-500 hover:bg-gray-100"
            @click="navigateToRegister"
          />
          <Trubutton
            :text="$t('page.agent.browseProducts')"
            type="primary"
            variant="outline"
            size="large"
            class="border-white text-white hover:bg-white/10"
            @click="navigateToProduct"
          />
        </div>
      </div>

      <!-- Benefits -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t("page.agent.benefitsTitle") }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="rounded-xl border border-gray-100 bg-gray-50 p-5"
          >
            <div
              class="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3"
            >
              <Icon
                :name="benefitIcon(index)"
                class="h-5 w-5 text-orange-500"
              />
            </div>
            <h3 class="font-semibold text-gray-800 mb-1">{{ benefit.title }}</h3>
            <p class="text-sm text-gray-500">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white">
        <h2 class="text-2xl lg:text-3xl font-bold mb-3">{{ $t("page.agent.becomeAgent") }}</h2>
        <p class="text-white/90 mb-6 max-w-2xl mx-auto">{{ $t("page.agent.heroSubtitle") }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Trubutton
            :text="$t('page.agent.becomeAgent')"
            type="primary"
            variant="solid"
            size="large"
            class="bg-white text-orange-500 hover:bg-gray-100"
            @click="navigateToRegister"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { defineBreadcrumb, useSchemaOrg } from "@unhead/schema-org/vue";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import Trubutton from "~/components/Trubutton.vue";
import { usePageSeo } from "~/composables/usePageSeo";

const { t: $t } = useI18n();
const router = useRouter();

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home") || "Home", to: "/" },
  { text: $t("page.agent.title") || "Agen", to: "/agent" },
]);

usePageSeo({
  title: computed(() => $t("page.agent.seo.title") || "Agen Trumecs"),
  description: computed(() => $t("page.agent.seo.description") || undefined),
  url: "/agent",
  type: "website",
  breadcrumbs: [
    { name: $t("breadcrumb.home") || "Home", url: "/" },
    { name: $t("page.agent.title") || "Agen", url: "/agent" },
  ],
});

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((item, index) => ({
      position: index + 1,
      name: item.text,
      item: `https://www.trumecs.com${item.to}`,
    })),
  }),
]);

const benefits = computed(() => [
  {
    title: $t("page.agent.benefits.market"),
    desc: $t("page.agent.benefits.marketDesc"),
  },
  {
    title: $t("page.agent.benefits.support"),
    desc: $t("page.agent.benefits.supportDesc"),
  },
  {
    title: $t("page.agent.benefits.growth"),
    desc: $t("page.agent.benefits.growthDesc"),
  },
]);

const benefitIcons = ["material-symbols:public", "material-symbols:support-agent", "material-symbols:trending-up"];

const navigateToRegister = () => {
  router.push("/member/register?role=agent");
};

const navigateToProduct = () => {
  router.push("/product");
};
</script>
