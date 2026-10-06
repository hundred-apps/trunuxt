<template>
  <section class="mb-8 lg:mb-12" aria-labelledby="products-heading">
    <!-- Toolbar -->
    <div
      class="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2
          id="products-heading"
          class="flex items-center gap-2 text-lg font-bold text-gray-800"
        >
          {{ $t("page.category.products") }}
          <span
            class="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600"
          >
            {{ totalProducts }}
          </span>
        </h2>
        <p class="mt-0.5 text-sm text-gray-500">
          {{
            $t("page.category.showing", {
              from: showingFrom,
              to: showingTo,
              total: totalProducts,
            })
          }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- View Toggle -->
        <div class="flex items-center rounded-xl border border-gray-200 p-1">
          <button
            @click="$emit('view-change', 'grid')"
            class="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
            :class="
              viewMode === 'grid'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100'
            "
            :aria-pressed="viewMode === 'grid'"
            :title="$t('label.gridView')"
            type="button"
          >
            <Icon name="material-symbols:grid-view" class="text-lg" />
          </button>
          <button
            @click="$emit('view-change', 'list')"
            class="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
            :class="
              viewMode === 'list'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100'
            "
            :aria-pressed="viewMode === 'list'"
            :title="$t('label.listView')"
            type="button"
          >
            <Icon name="material-symbols:view-list" class="text-lg" />
          </button>
        </div>

        <!-- Sort Select -->
        <div class="relative">
          <Icon
            name="material-symbols:swap-vert"
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400"
          />
          <el-select
            :model-value="sortBy"
            size="default"
            class="!w-44"
            @change="handleSortChange"
            :placeholder="'Urutkan'"
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
            <el-option
              :label="$t('page.category.sort.newest')"
              value="newest"
            />
            <el-option
              :label="$t('page.category.sort.popular')"
              value="popular"
            />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="products.length === 0"
      class="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm"
    >
      <Icon
        name="material-symbols:inventory-2"
        class="mx-auto text-6xl text-gray-200"
      />
      <h3 class="mb-1 mt-4 text-lg font-semibold text-gray-600">
        {{ $t("page.category.empty") }}
      </h3>
      <p class="mb-5 text-sm text-gray-400">{{ $t("label.noResults") }}</p>
      <Trubutton
        v-if="hasActiveFilters"
        :text="$t('button.clearFilters')"
        variant="outline"
        icon="mdi:filter-remove"
        @click="$emit('clear-filters')"
      />
    </div>

    <!-- Products -->
    <div v-else>
      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid mx-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4"
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
          class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md"
        >
          <Trulink
            :to="`/product/${product.id}/${formatSlug(product.tittle)}`"
            class="flex"
          >
            <div
              class="h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-50 sm:h-36 sm:w-36"
            >
              <AppImage
                :src="getProductImage(product.img)"
                :alt="product.tittle"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="128px sm:144px"
                width="144"
                height="144"
                loading="lazy"
              />
            </div>
            <div class="flex flex-1 flex-col justify-center p-4">
              <p
                v-if="
                  product.brand &&
                  typeof product.brand === 'string' &&
                  product.brand.toLowerCase() !== 'other'
                "
                class="mb-1 text-xs font-semibold text-orange-500"
              >
                {{ product.brand }}
              </p>
              <h3
                class="mb-1 line-clamp-2 font-semibold text-gray-800 transition-colors group-hover:text-orange-500"
              >
                {{ product.tittle }}
              </h3>
              <p
                v-if="product.description"
                class="mb-2 line-clamp-2 text-sm text-gray-500"
              >
                {{ product.description }}
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <div v-if="Number(product.price) > 0">
                  <p
                    v-if="Number(product.price_promo) > 0"
                    class="text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(Number(product.price)) }}
                  </p>
                  <p class="text-base font-bold text-orange-600">
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
                  class="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600"
                >
                  {{ $t("page.product.text.stock") }}: {{ product.stock }}
                </span>
              </div>
            </div>
          </Trulink>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
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

const gridClass = computed(() =>
  props.viewMode === "grid"
    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4"
    : ""
);

const showingFrom = computed(() =>
  props.totalProducts === 0 ? 0 : (props.currentPage - 1) * props.perPage + 1
);
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

const getProductImage = (img: string | null) => {
  if (img) return `${config.public.baseImageProduct}${img}`;
  return "https://via.placeholder.com/300x300?text=No+Image";
};

const handleSortChange = (value: string) => {
  emit("sort-change", value);
};

const handlePageChange = (page: number) => {
  emit("page-change", page);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
