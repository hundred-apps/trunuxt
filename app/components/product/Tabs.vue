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

    <!-- Tab Content (Scrollable) -->
    <div
      class="p-4 sm:p-6 max-h-[600px] overflow-y-auto"
      ref="contentContainer"
    >
      <!-- Description -->
      <div id="section-description" ref="descriptionRef" class="scroll-mt-20">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Deskripsi</h3>
        <div
          class="prose prose-sm sm:prose-base max-w-none"
          v-html="product.description || 'Tidak ada deskripsi'"
        ></div>
      </div>

      <!-- Specifications -->
      <div
        id="section-specifications"
        ref="specificationsRef"
        class="scroll-mt-20 mt-4"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Spesifikasi</h3>
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
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">Brand</td>
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
                  Kemasan
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.packagin || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">Berat</td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.weight || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Dimensi
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.dimention || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Garansi
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.warranty || "-" }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Lokasi
                </td>
                <td class="px-2 py-1 text-gray-600">
                  {{ product.area || product.availability_at }}
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="px-2 py-1 font-medium text-gray-700 w-1/3">
                  Estimasi Pengiriman
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
      <div id="section-promo" ref="promoRef" class="scroll-mt-20 mt-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Promo</h3>
        <div v-if="product.promo && product.promo.length > 0">
          <div
            v-for="(promo, index) in product.promo"
            :key="index"
            class="mb-6 last:mb-0 border-b border-gray-200 last:border-0 pb-6 last:pb-0"
          >
            <!-- Promo Header -->
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"
            >
              <div class="flex items-start gap-2">
                <div class="flex-shrink-0">
                  <span
                    class="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                  >
                    PROMO
                  </span>
                </div>
                <div>
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
                    {{ promo.type || "Promo" }} • Berakhir:
                    {{ formatDate(promo.end_date) }}
                  </p>
                </div>
              </div>
              <a
                :href="`https://www.trumecs.com/promo/${promo.url}`"
                class="text-orange-500 hover:text-orange-600 text-sm font-medium whitespace-nowrap flex items-center gap-1"
              >
                Lihat selengkapnya
                <Icon name="mdi:chevron-right" class="text-lg" />
              </a>
            </div>

            <!-- Promo Products -->
            <div v-if="promo.product_promo && promo.product_promo.length > 0">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <a
                  v-for="productPromo in getPromoProducts(promo)"
                  :key="productPromo.id"
                  :href="`/product/${productPromo.id}`"
                  class="group bg-gray-50 hover:bg-white rounded-lg transition-all hover:shadow-md border border-transparent hover:border-gray-200"
                >
                  <div
                    class="aspect-square bg-white rounded-lg overflow-hidden"
                  >
                    <img
                      :src="getProductImage(productPromo.img)"
                      :alt="productPromo.tittle"
                      class="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <h4
                    class="text-md font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 p-2"
                  >
                    {{ productPromo.tittle }}
                  </h4>
                  <div v-if="promo.type == 'promo'">
                    <!-- Price -->
                    <div class="p-2">
                      <div class="text-sm font-bold text-red-500">
                        Rp
                        {{
                          formatPrice(
                            productPromo.price_promo || productPromo.price
                          )
                        }}
                      </div>
                      <div
                        v-if="
                          productPromo.price_promo &&
                          Number(productPromo.price_promo) <
                            Number(productPromo.price)
                        "
                        class="text-xs text-gray-400 line-through"
                      >
                        Rp {{ formatPrice(productPromo.price) }}
                      </div>
                    </div>

                    <!-- Promo Badge on Product -->
                    <div
                      v-if="
                        productPromo.price_promo &&
                        Number(productPromo.price_promo) <
                          Number(productPromo.price)
                      "
                      class="mt-1 p-2"
                    >
                      <span
                        class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        Hemat
                        {{
                          calculateDiscount(
                            productPromo.price,
                            productPromo.price_promo
                          )
                        }}%
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- No Products Message -->
            <div v-else class="text-gray-400 text-sm text-center py-4">
              Tidak ada produk dalam promo ini
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          <div class="flex flex-col items-center gap-2">
            <Icon name="mdi:gift-outline" class="text-4xl text-gray-300" />
            <p>Belum ada promo untuk produk ini</p>
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
const contentContainer = ref<HTMLElement | null>(null);
const descriptionRef = ref<HTMLElement | null>(null);
const specificationsRef = ref<HTMLElement | null>(null);
const promoRef = ref<HTMLElement | null>(null);

const tabs = [
  { key: "description", label: "Deskripsi" },
  { key: "specifications", label: "Spesifikasi" },
  { key: "promo", label: "Promo" },
];

// ============ SCROLL TO SECTION ============
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

  if (targetElement && contentContainer.value) {
    // Scroll within the content container
    const containerRect = contentContainer.value.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const scrollTop = contentContainer.value.scrollTop;
    const targetOffset = targetRect.top - containerRect.top + scrollTop;
    const headerOffset = 80; // Offset untuk sticky header

    contentContainer.value.scrollTo({
      top: targetOffset - headerOffset,
      behavior: "smooth",
    });
  }
};

// ============ OBSERVER UNTUK AUTO UPDATE ACTIVE TAB ============
const observer = ref<IntersectionObserver | null>(null);

const setupIntersectionObserver = () => {
  if (!contentContainer.value) return;

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
      root: contentContainer.value,
      rootMargin: "-80px 0px 0px 0px", // Offset untuk header
      threshold: 0.2,
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
const formatPrice = (price: string | number) => {
  if (!price) return "0";
  const numPrice = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("id-ID").format(numPrice);
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getProductImage = (img?: string) => {
  if (img) {
    return `https://www.trumecs.com/public/image/product/${img}`;
  }
  return "https://www.trumecs.com/public/image/product/noimage.png";
};

const calculateDiscount = (
  originalPrice: string | number,
  promoPrice: string | number
) => {
  const original =
    typeof originalPrice === "string" ? Number(originalPrice) : originalPrice;
  const promo =
    typeof promoPrice === "string" ? Number(promoPrice) : promoPrice;
  if (original > 0 && promo > 0 && original > promo) {
    return Math.round(((original - promo) / original) * 100);
  }
  return 0;
};

const getPromoProducts = (promo: any) => {
  if (!promo.product_promo || promo.product_promo.length === 0) {
    return [];
  }

  const products = promo.product_promo.filter(
    (p: any) => p.id !== props.product.id
  );

  return products.slice(0, 4);
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
/* Scroll style */
.max-h-\[600px\] {
  max-height: 600px;
}

.max-h-\[600px\]::-webkit-scrollbar {
  width: 4px;
}

.max-h-\[600px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9999px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Scroll margin untuk offset header */
.scroll-mt-20 {
  scroll-margin-top: 80px;
}

/* Smooth transition untuk active tab */
button {
  transition: all 0.2s ease;
}

/* Table row hover */
tr:hover {
  background-color: #f9fafb;
}

/* Promo card hover */
.group:hover {
  transform: translateY(-2px);
}
</style>
