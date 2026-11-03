<template>
  <div class="mechanic-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <!-- Hero -->
      <div
        class="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 lg:p-12 text-center text-white"
      >
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white mb-6"
        >
          <Icon name="material-symbols:engineering" class="text-lg" />
          {{ $t("page.mechanic.badge") }}
        </span>
        <h1 class="text-2xl lg:text-4xl font-bold mb-4">{{ $t("page.mechanic.heroTitle") }}</h1>
        <p class="text-white/90 mb-8 max-w-2xl mx-auto">{{ $t("page.mechanic.heroSubtitle") }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Trubutton
            :text="$t('page.mechanic.ctaBrowseProducts')"
            type="primary"
            variant="solid"
            size="large"
            class="bg-white text-orange-500 hover:bg-gray-100"
            @click="navigateToProduct"
          />
          <Trubutton
            :text="$t('page.mechanic.ctaBecomeExpert')"
            type="primary"
            variant="outline"
            size="large"
            class="border-white text-white hover:bg-white/10"
            @click="navigateToRegister"
          />
        </div>
      </div>

      <!-- Services -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t("page.mechanic.servicesTitle") }}</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center"
          >
            <div
              class="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-3"
            >
              <Icon :name="service.icon" class="h-5 w-5 text-orange-500" />
            </div>
            <h3 class="font-semibold text-gray-800 mb-1">{{ service.title }}</h3>
            <p class="text-sm text-gray-500">{{ service.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white">
        <h2 class="text-2xl lg:text-3xl font-bold mb-3">{{ $t("page.mechanic.heroTitle") }}</h2>
        <p class="text-white/90 mb-6 max-w-2xl mx-auto">{{ $t("page.mechanic.heroSubtitle") }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Trubutton
            :text="$t('page.mechanic.ctaBrowseProducts')"
            type="primary"
            variant="solid"
            size="large"
            class="bg-white text-orange-500 hover:bg-gray-100"
            @click="navigateToProduct"
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
  { text: $t("page.mechanic.title") || "Tru Expert", to: "/mechanic" },
]);

usePageSeo({
  title: computed(() => $t("page.mechanic.seo.title") || "Tru Expert"),
  description: computed(() => $t("page.mechanic.seo.description") || undefined),
  url: "/mechanic",
  type: "website",
  breadcrumbs: [
    { name: $t("breadcrumb.home") || "Home", url: "/" },
    { name: $t("page.mechanic.title") || "Tru Expert", url: "/mechanic" },
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

const services = computed(() => [
  {
    title: $t("page.mechanic.serviceMaintenance"),
    desc: $t("page.mechanic.serviceMaintenanceDesc") || undefined,
    icon: "material-symbols:build-circle",
  },
  {
    title: $t("page.mechanic.serviceRepair"),
    desc: $t("page.mechanic.serviceRepairDesc") || undefined,
    icon: "material-symbols:construction",
  },
  {
    title: $t("page.mechanic.serviceInspection"),
    desc: $t("page.mechanic.serviceInspectionDesc") || undefined,
    icon: "material-symbols:fact-check",
  },
  {
    title: $t("page.mechanic.serviceTesting"),
    desc: $t("page.mechanic.serviceTestingDesc") || undefined,
    icon: "material-symbols:science",
  },
]);

const navigateToProduct = () => {
  router.push("/product");
};

const navigateToRegister = () => {
  router.push("/member/register?role=mechanic");
};
</script>
