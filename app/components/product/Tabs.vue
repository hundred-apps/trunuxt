<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <!-- Tab Headers (Sticky) -->
    <div class="border-b border-gray-200 sticky top-0 bg-white z-10">
      <div class="flex overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="scrollToSection(tab.key)"
          class="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all relative"
          :class="
            activeTab === tab.key
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          "
        >
          {{ tab.label }}
          <span
            v-if="
              tab.key === 'promo' && product.promo && product.promo.length > 0
            "
            class="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ product.promo.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Tab Content (Full height, no scroll) -->
    <div class="p-4 sm:p-6">
      <!-- Description -->
      <div id="section-description" ref="descriptionRef" class="scroll-mt-24">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">
          {{ $t("page.product.text.description") }}
        </h3>
        <div
          class="prose prose-sm sm:prose-base max-w-none"
          v-html="product.description || $t('page.product.text.noDescription')"
        ></div>
      </div>

      <!-- Specifications -->
      <div
        id="section-specifications"
        ref="specificationsRef"
        class="scroll-mt-24 mt-8"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-3">
          {{ $t("page.product.text.specification") }}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Part Number
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.partnumber || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Part Number Trumecs
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.partnumber_trumecs || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.brand") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.brand || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">Unit</td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.unit || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.packagin") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.packagin || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.weight") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.weight || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.dimension") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.dimention || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.warranty") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.warranty || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.location") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.area || product.availability_at }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ $t("page.product.text.estimated") }}
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.estimated_delivery || "-" }} hari
                </td>
              </tr>
              <tr
                v-for="(spec, index) in product.specs"
                :key="index"
                class="border-b border-gray-100"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  {{ spec.name }}
                </td>
                <td class="px-2 py-1 text-gray-600">{{ spec.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Promo -->
      <div id="section-promo" ref="promoRef" class="scroll-mt-24 mt-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Promo</h3>
        <div v-if="product.promo && product.promo.length > 0">
          <div
            v-for="(promo, index) in product.promo"
            :key="index"
            class="mb-6 last:mb-0 border-b border-gray-200 last:border-0 pb-6 last:pb-0"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"
            >
              <div class="flex items-start gap-2">
                <div>
                  <span
                    class="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                  >
                    {{ promo.type || "Promo" }}
                  </span>
                  <h3
                    class="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                  >
                    <a
                      :href="`https://www.trumecs.com/promo/${promo.url}`"
                      class="hover:underline"
                    >
                      {{ promo.name }}
                    </a>
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ $t("page.product.text.end") }}:
                    {{ formatDate(promo.end_date) }}
                  </p>
                  <a
                    :href="`https://www.trumecs.com/promo/${promo.url}`"
                    class="text-orange-500 hover:text-orange-600 text-sm font-medium whitespace-nowrap flex items-center gap-1"
                  >
                    {{ $t("page.product.text.seeDetail") }}
                    <Icon name="mdi:chevron-right" class="text-lg" />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <img
                :src="`https://www.trumecs.com/public/image/promo/${promo.img}`"
                alt=""
                class="w-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          <div class="flex flex-col items-center gap-2">
            <Icon name="mdi:gift-outline" class="text-4xl text-gray-300" />
            <p>{{ $t("page.product.text.noPromo") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{
  product: Product;
}>();

const activeTab = ref("description");
const descriptionRef = ref<HTMLElement | null>(null);
const specificationsRef = ref<HTMLElement | null>(null);
const promoRef = ref<HTMLElement | null>(null);

const tabs = [
  { key: "description", label: $t("page.product.text.description") },
  { key: "specifications", label: $t("page.product.text.specification") },
  { key: "promo", label: "Promo" },
];

// ============ SCROLL TO SECTION (Full Page) ============
const scrollToSection = (tabKey: string) => {
  // Update active tab
  activeTab.value = tabKey;

  // Get element ref based on tab key
  const elementMap: Record<string, HTMLElement | null> = {
    description: descriptionRef.value,
    specifications: specificationsRef.value,
    promo: promoRef.value,
  };

  const targetElement = elementMap[tabKey];

  if (targetElement) {
    const navbarHeight = 80; // Sesuaikan dengan tinggi navbar sticky Anda
    const offset = navbarHeight + 20; // Tambahan padding

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

// ============ OBSERVER UNTUK AUTO UPDATE ACTIVE TAB ============
const observer = ref<IntersectionObserver | null>(null);

const setupIntersectionObserver = () => {
  // Hapus observer lama
  if (observer.value) {
    observer.value.disconnect();
  }

  const sections = [
    { key: "description", element: descriptionRef.value },
    { key: "specifications", element: specificationsRef.value },
    { key: "promo", element: promoRef.value },
  ];

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionKey = entry.target.getAttribute("data-section-key");
          if (sectionKey) {
            activeTab.value = sectionKey;
          }
        }
      });
    },
    {
      root: null, // Gunakan viewport sebagai root
      rootMargin: "-100px 0px -100px 0px", // Offset untuk header
      threshold: 0.3,
    }
  );

  sections.forEach((section) => {
    if (section.element) {
      section.element.setAttribute("data-section-key", section.key);
      observer.value?.observe(section.element);
    }
  });
};

// ============ METHODS ============
const formatDate = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ============ LIFECYCLE ============
onMounted(() => {
  nextTick(() => {
    setupIntersectionObserver();
  });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped>
/* Scroll margin untuk offset header di full page */
.scroll-mt-24 {
  scroll-margin-top: 100px;
}

/* Smooth transition untuk active tab */
button {
  transition: all 0.2s ease;
}

/* Table row hover */
tr:hover {
  background-color: #f9fafb;
}

/* Promo image */
img {
  max-height: 400px;
  object-fit: cover;
}
</style>
