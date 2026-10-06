<template>
  <div class="legal-page">
    <div class="container mx-auto max-w-[1280px] px-4 lg:px-0">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Konten -->
        <main class="lg:col-span-8">
          <header class="mb-6">
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
              {{ doc.title }}
            </h1>
            <p class="text-sm text-gray-400 mt-2">
              {{ $t("legal.lastUpdated") }}: {{ lastUpdated }}
            </p>
          </header>

          <LegalDocument :doc="doc" />

          <!-- CTA -->
          <div
            class="mt-10 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 text-center"
          >
            <h2 class="text-lg font-bold text-gray-800 mb-2">
              {{ $t("legal.contactTitle") }}
            </h2>
            <p class="text-sm text-gray-600 mb-5">
              {{ $t("legal.contactDesc") }}
            </p>
            <div class="flex flex-wrap gap-3 justify-center">
              <a
                :href="`https://wa.me/${contactPhone}`"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <Icon name="logos:whatsapp-icon" class="text-lg" />
                WhatsApp
              </a>
              <a
                :href="`mailto:${contactEmail}`"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Icon name="material-symbols:mail-outline" class="text-lg" />
                {{ contactEmail }}
              </a>
            </div>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="lg:col-span-4">
          <div class="space-y-4 lg:sticky lg:top-[130px]">
            <div
              class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <h2
                class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
              >
                <Icon name="material-symbols:gavel" class="text-orange-500" />
                {{ $t("legal.relatedTitle") }}
              </h2>
              <nav class="space-y-1">
                <Trulink
                  to="/faq"
                  class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                  :class="route.path === '/faq' ? 'bg-orange-50 text-orange-600 font-medium' : ''"
                >
                  <Icon name="material-symbols:help-outline" class="text-base text-gray-400" />
                  {{ $t("legal.faq") }}
                </Trulink>
                <Trulink
                  to="/privacy-policy"
                  class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                  :class="
                    route.path === '/privacy-policy'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : ''
                  "
                >
                  <Icon name="material-symbols:lock" class="text-base text-gray-400" />
                  {{ $t("legal.privacy") }}
                </Trulink>
                <Trulink
                  to="/terms-of-use"
                  class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                  :class="
                    route.path === '/terms-of-use'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : ''
                  "
                >
                  <Icon name="material-symbols:description" class="text-base text-gray-400" />
                  {{ $t("legal.terms") }}
                </Trulink>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import LegalDocument from "~/components/legal/LegalDocument.vue";
import { useLegalContent } from "~/composables/useLegalContent";
import { useHeaderHeight } from "~/composables/useHeaderHeight";

const { t: $t, locale } = useI18n();
const route = useRoute();
const config = useRuntimeConfig();
const { updateHeaderHeight } = useHeaderHeight();

const { termsContent } = useLegalContent();
const doc = computed(() => termsContent.value);

const lastUpdated = computed(() =>
  new Date().toLocaleDateString(locale.value === "zh" ? "zh-CN" : locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

const contactPhone = config.public.info.phone;
const contactEmail = config.public.info.email;

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("breadcrumb.legal"), to: "/terms-of-use" },
  { text: doc.value.title, to: "/terms-of-use" },
]);

usePageSeo({
  title: doc.value.title,
  description: doc.value.metaDesc,
  url: "/terms-of-use",
});

onMounted(() => updateHeaderHeight());
</script>

<style scoped>
.legal-page {
  min-height: calc(100vh - 200px);
}
</style>
