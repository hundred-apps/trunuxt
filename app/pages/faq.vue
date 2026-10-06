<template>
  <div class="faq-page">
    <div class="container mx-auto max-w-[1280px] px-4 lg:px-0">
      <Breadcrumbs :items="breadcrumbs" class="my-2" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main class="lg:col-span-8">
          <header class="mb-6">
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
              {{ doc.title }}
            </h1>
            <p class="text-gray-600 mt-2">{{ doc.intro }}</p>
          </header>

          <!-- Pencarian -->
          <div class="mb-6">
            <el-input
              v-model="keyword"
              size="large"
              clearable
              :placeholder="$t('legal.searchPlaceholder')"
            >
              <template #prefix>
                <Icon name="material-symbols:search" class="text-gray-400" />
              </template>
            </el-input>
          </div>

          <!-- Daftar FAQ (accordion) -->
          <div
            v-if="filteredItems.length > 0"
            class="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-100 overflow-hidden"
          >
            <div v-for="(item, index) in filteredItems" :key="index">
              <button
                type="button"
                class="w-full flex items-start justify-between gap-4 text-left px-5 py-4 transition-colors hover:bg-gray-50"
                :aria-expanded="isOpen(index)"
                @click="toggle(index)"
              >
                <span class="font-medium text-gray-800 text-sm sm:text-base leading-snug">
                  {{ item.q }}
                </span>
                <Icon
                  name="material-symbols:expand-more"
                  class="shrink-0 mt-0.5 text-xl text-gray-400 transition-transform duration-200"
                  :class="isOpen(index) ? 'rotate-180' : ''"
                />
              </button>
              <div
                v-show="isOpen(index)"
                class="px-5 pb-5 -mt-1 text-sm sm:text-base text-gray-600 leading-relaxed"
              >
                {{ item.a }}
              </div>
            </div>
          </div>

          <!-- Tidak ada hasil -->
          <div
            v-else
            class="text-center py-16 rounded-2xl border border-gray-100 bg-white"
          >
            <Icon name="material-symbols:search-off" class="text-6xl text-gray-300 mb-4" />
            <p class="text-sm text-gray-500">{{ $t("legal.noMatch") }}</p>
          </div>
        </main>

        <aside class="lg:col-span-4">
          <div class="space-y-4 lg:sticky lg:top-[130px]">
            <!-- Bantuan -->
            <div
              class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <h2
                class="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"
              >
                <Icon name="material-symbols:support-agent" class="text-orange-500" />
                {{ $t("legal.faqStillHelp") }}
              </h2>
              <p class="text-sm text-gray-600 mb-4">{{ $t("legal.contactDesc") }}</p>
              <div class="flex flex-col gap-2">
                <a
                  :href="`https://wa.me/${contactPhone}`"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                >
                  <Icon name="logos:whatsapp-icon" class="text-lg" />
                  WhatsApp
                </a>
                <a
                  :href="`mailto:${contactEmail}`"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Icon name="material-symbols:mail-outline" class="text-lg" />
                  {{ $t("legal.contactCta") }}
                </a>
              </div>
            </div>

            <!-- Halaman terkait -->
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
                  to="/terms-of-use"
                  class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <Icon name="material-symbols:description" class="text-base text-gray-400" />
                  {{ $t("legal.terms") }}
                </Trulink>
                <Trulink
                  to="/privacy-policy"
                  class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <Icon name="material-symbols:lock" class="text-base text-gray-400" />
                  {{ $t("legal.privacy") }}
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
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import { useLegalContent } from "~/composables/useLegalContent";
import { useHeaderHeight } from "~/composables/useHeaderHeight";

const { t: $t } = useI18n();
const config = useRuntimeConfig();
const { updateHeaderHeight } = useHeaderHeight();

const { faqContent } = useLegalContent();
const doc = computed(() => faqContent.value);

const contactPhone = config.public.info.phone;
const contactEmail = config.public.info.email;

const keyword = ref("");
const openIndexes = ref<number[]>([0]);

const filteredItems = computed(() => {
  const term = keyword.value.trim().toLowerCase();
  if (!term) return doc.value.items;
  return doc.value.items.filter(
    (item) =>
      item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
  );
});

const isOpen = (index: number) => openIndexes.value.includes(index);

// Accordion: satu pertanyaan terbuka pada satu waktu
const toggle = (index: number) => {
  openIndexes.value = openIndexes.value.includes(index) ? [] : [index];
};

// Reset saat locale berubah agar index tetap valid
watch(
  () => doc.value,
  () => {
    keyword.value = "";
    openIndexes.value = [0];
  }
);

const breadcrumbs = computed(() => [
  { text: $t("breadcrumb.home"), to: "/" },
  { text: $t("breadcrumb.legal"), to: "/faq" },
  { text: doc.value.title, to: "/faq" },
]);

usePageSeo({
  title: doc.value.title,
  description: doc.value.metaDesc,
  url: "/faq",
});

onMounted(() => updateHeaderHeight());
</script>

<style scoped>
.faq-page {
  min-height: calc(100vh - 200px);
}
</style>
