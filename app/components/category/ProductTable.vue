<template>
  <section class="mb-8 lg:mb-12" aria-labelledby="products-heading">
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h2
          id="products-heading"
          class="text-xl lg:text-2xl font-bold text-gray-800"
        >
          {{ $t("page.category.products", { count: totalProducts }) }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{
            $t("page.category.showing", {
              from: showingFrom,
              to: showingTo,
              total: totalProducts,
            })
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <div
          class="hidden sm:flex items-center border rounded-lg overflow-hidden"
        >
          <button
            @click="$emit('view-change', 'grid')"
            class="p-3 transition-colors min-w-[44px] min-h-[44px]"
            :class="
              viewMode === 'grid'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            "
            :aria-pressed="viewMode === 'grid'"
            type="button"
          >
            <Icon name="material-symbols:grid-view" class="text-lg" />
          </button>
          <button
            @click="$emit('view-change', 'list')"
            class="p-3 transition-colors min-w-[44px] min-h-[44px]"
            :class="
              viewMode === 'list'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            "
            :aria-pressed="viewMode === 'list'"
            type="button"
          >
            <Icon name="material-symbols:view-list" class="text-lg" />
          </button>
        </div>

        <el-select
          :model-value="sortBy"
          @update:model-value="sortBy = $event"
          size="small"
          class="w-40 sm:w-48"
          @change="$emit('sort-change', sortBy)"
          placeholder="Urutkan"
        >
          <el-option
            :label="$t('page.category.sort.default')"
            value="default"
          />
          <el-option
            :label="$t('page.category.sort.priceLow')"
            value="price_asc"
          />
          <el-option
            :label="$t('page.category.sort.priceHigh')"
            value="price_desc"
          />
          <el-option :label="$t('page.category.sort.newest')" value="newest" />
        </el-select>
      </div>
    </header>

    <div v-if="loading" :class="gridClass">
      <div
        v-for="i in 12"
        :key="i"
        class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div class="aspect-square bg-gray-200" />
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-1/3" />
          <div class="h-3 bg-gray-200 rounded w-full" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="products.length === 0"
      class="text-center py-16 bg-white rounded-xl shadow-sm"
    >
      <Icon
        name="material-symbols:inventory-2"
        class="text-6xl text-gray-300 mb-4"
      />
      <h3 class="text-lg font-medium text-gray-600 mb-2">
        {{ $t("page.category.empty") }}
      </h3>
      <p class="text-sm text-gray-400">{{ $t("label.noResults") }}</p>
      <Trubutton
        v-if="hasActiveFilters"
        :text="$t('button.clearFilters')"
        variant="outline"
        icon="mdi:filter-remove"
        class="mt-4"
        @click="$emit('clear-filters')"
      />
    </div>

    <div v-else>
      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
        >
          <Trulink
            :to="`/product/${product.id}/${formatSlug(product.tittle)}`"
            class="flex"
          >
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-50">
              <img
                :src="getProductImage(product.img)"
                :alt="product.tittle"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="flex-1 p-4">
              <p
                v-if="product.brand && product.brand.toLowerCase() !== 'other'"
                class="text-xs text-orange-500 font-semibold mb-1"
              >
                {{ product.brand }}
              </p>
              <h3 class="font-medium text-gray-800 line-clamp-1 mb-1">
                {{ product.tittle }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2 mb-2">
                {{ product.description?.substring(0, 100) }}
              </p>
              <div class="flex items-center gap-4">
                <div v-if="Number(product.price) > 0">
                  <p
                    v-if="Number(product.price_promo) > 0"
                    class="text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(Number(product.price)) }}
                  </p>
                  <p class="text-sm font-bold text-orange-600">
                    {{
                      formatPrice(
                        Number(product.price_promo) > 0
                          ? Number(product.price_promo)
                          : Number(product.price)
                      )
                    }}
                  </p>
                </div>
                <span
                  v-if="product.stock > 0"
                  class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded"
                >
                  {{ $t("page.product.text.stock") }}: {{ product.stock }}
                </span>
              </div>
            </div>
          </Trulink>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8" v-if="totalPages > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalProducts"
          :page-size="perPage"
          :current-page="currentPage"
          @update:current-page="handlePageChange"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProductCard from "~/components/product/ProductCard.vue";
import type { Product } from "~/types/product";

const props = defineProps({
  products: {
    type: Array as () => Product[],
    required: true,
  },
  totalProducts: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 20,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String as () => "grid" | "list",
    default: "grid",
  },
  sortBy: {
    type: String,
    default: "default",
  },
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  "view-change": [mode: "grid" | "list"];
  "sort-change": [sort: string];
  "page-change": [page: number];
  "clear-filters": [];
}>();

const config = useRuntimeConfig();

const gridClass = computed(() => {
  if (props.viewMode === "grid") {
    return "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4";
  }
  return "";
});

const showingFrom = computed(() => (props.currentPage - 1) * props.perPage + 1);
const showingTo = computed(() =>
  Math.min(props.currentPage * props.perPage, props.totalProducts)
);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatSlug = (text: string | null) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const getProductImage = (img: string) => {
  if (img) return `${config.public.baseImageProduct}${img}`;
  return "https://via.placeholder.com/300x300?text=No+Image";
};

const handlePageChange = (page: number) => {
  emit("page-change", page);
};
</script>
