<template>
  <div class="product-detail-page min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div
          class="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-600">Memuat produk...</p>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="container mx-auto px-4 py-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🔍</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">
          Produk Tidak Ditemukan
        </h2>
        <p class="text-gray-500 mb-6">
          Maaf, produk yang Anda cari tidak tersedia.
        </p>
        <button
          @click="goBack"
          class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>

    <template v-else>
      <Breadcrumbs :items="detailProductBreadcrumb" class="mt-2" />

      <section class="py-0 lg:py-2">
        <div class="container mx-auto px-0">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
            <div
              class="lg:col-span-5 lg:sticky lg:top-[150px] self-start"
              style="max-height: calc(100vh - 6rem)"
            >
              <ProductGallery :product="product" />
            </div>

            <div class="lg:col-span-7 lg:sticky lg:top-[150px]">
              <ProductInfo
                :product="product"
                :breadcrumb-items="breadcrumbItems"
              />

              <ProductTabs :product="product" class="mt-2" />
            </div>
          </div>
          <div
            v-if="product.related_product && product.related_product.length > 0"
            class="mt-8 lg:mt-12"
          >
            <ProductRelatedProducts
              :products="product.related_product"
              :current-product-id="product.id"
            />
          </div>

          <div
            v-if="product.artikel && product.artikel.length > 0"
            class="mt-8 lg:mt-12"
          >
            <ProductRelatedArticles
              :articles="product.artikel"
              :product-title="product.tittle"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Product } from "~/types/product";

const loading = ref(true);
const error = ref<string | null>(null);
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const goBack = () => router.back();
const id = route.params.id as string;

// Breadcrumb dengan data dinamis
const detailProductBreadcrumb = computed(() => {
  const items: { text: string; to: string }[] = [{ text: "Home", to: "/" }];

  if (!product.value?.categori) return items;

  // Build category chain
  const buildCategoryChain = (category: any) => {
    const chain: { text: string; to: string }[] = [];
    let current = category;
    const parents: any[] = [];

    // Collect all parents
    while (current) {
      parents.unshift(current);
      current = current.parent_categori;
    }

    // Build breadcrumb items
    parents.forEach((parent, index) => {
      const url = parents
        .slice(0, index + 1)
        .map((p: any) => p.url)
        .join("/");
      chain.push({
        text: parent.name,
        to: `/c/${url}`,
      });
    });

    return chain;
  };

  // Add category chain
  const categoryChain = buildCategoryChain(product.value.categori);
  items.push(...categoryChain);

  // Add brand if not "other"
  if (product.value.brand && product.value.brand.toLowerCase() !== "other") {
    const lastCategory = items[items.length - 1];
    if (lastCategory) {
      items.push({
        text: product.value.brand,
        to: `${lastCategory.to}/${product.value.brand}`,
      });
    }
  }

  // ===== TAMBAHKAN NAMA PRODUCT DI AKHIR =====
  // Product name (tidak bisa diklik - current page)
  items.push({
    text: product.value.tittle || "Product",
    to: "", // Kosongkan karena ini halaman saat ini
  });

  return items;
});

const breadcrumbItems = computed(() => {
  const items: { name: string; url: string | null }[] = [];

  if (!product.value?.categori) return items;

  let current = product.value.categori;
  const parents: any[] = [];

  while (current) {
    parents.unshift(current);
    current = current.parent_categori;
  }

  parents.forEach((parent, index) => {
    const url = parents
      .slice(0, index + 1)
      .map((p: any) => p.url)
      .join("/");
    items.push({
      name: parent.name,
      url: `/c/${url}`,
    });
  });

  return items;
});

// Fetch product data
const fetchDetailProduct = async () => {
  loading.value = true;
  try {
    const response = await useFetchApi<BaseResponse<Product>>(
      `product/${id}`,
      `product-${id}`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload;
      console.log("product: ", apiData);
      product.value = apiData;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    ElMessage.error("Gagal memuat data produk");
    product.value = null;
  } finally {
    loading.value = false;
  }
};

const product = ref<Product | null>(null);

const generateProductSchema = (productData: Product | null) => {
  if (!productData) return null;

  const p = productData;
  const baseUrl = "https://migration.trumecs.com";
  const productUrl = `${baseUrl}/product/${p.id}`;

  // Price - PASTIKAN MENGGUNAKAN NILAI YANG BENAR
  const price =
    Number(p.price_promo) > 0 ? Number(p.price_promo) : Number(p.price);
  const originalPrice = Number(p.price);

  // Images - PASTIKAN URL LENGKAP
  const images = [];
  if (p.img) {
    images.push(`${baseUrl}/public/image/product/${p.img}`);
  }
  if (p.gallery_img && Array.isArray(p.gallery_img)) {
    p.gallery_img.forEach((item) => {
      if (item.img) {
        images.push(`${baseUrl}/public/image/galery/${item.img}`);
      }
    });
  }

  // Brand
  const brand =
    p.brand && p.brand.toLowerCase() !== "other" ? p.brand : "Trumecs";

  // Availability
  const availability =
    p.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  // Condition - CEK PHYSICNUMBER
  const condition =
    p.physicnumber &&
    (p.physicnumber.includes("S/N") || p.physicnumber.includes("ET-"))
      ? "https://schema.org/UsedCondition"
      : "https://schema.org/NewCondition";

  // SCHEMA PRODUCT YANG LENGKAP
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.tittle,
    description:
      p.description || `${p.tittle} - Produk berkualitas dari Trumecs`,
    sku: p.partnumber || p.partnumber_trumecs || undefined,
    mpn: p.partnumber || undefined,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category: p.categori?.name || "Produk",
    image: images.length > 0 ? images : undefined,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "IDR",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: availability,
      url: productUrl,
      itemCondition: condition,
      seller: {
        "@type": "Organization",
        name: "Trumecs",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Stock",
        value: p.stock.toString(),
      },
      {
        "@type": "PropertyValue",
        name: "Unit",
        value: p.unit || "Unit",
      },
      {
        "@type": "PropertyValue",
        name: "Weight",
        value: p.weight ? `${p.weight} kg` : undefined,
      },
    ].filter((prop) => prop.value !== undefined),
  };
};

// ============ BREADCRUMB SCHEMA ============
const generateBreadcrumbSchema = (productData: Product | null) => {
  if (!productData) return null;

  const baseUrl = "https://migration.trumecs.com";
  const items = [{ name: "Home", url: "/" }];

  // Add category chain
  if (productData.categori) {
    const parents = [];
    let current = productData.categori;

    while (current) {
      parents.unshift(current);
      current = current.parent_categori;
    }

    parents.forEach((parent) => {
      items.push({
        name: parent.name,
        url: `/c/${parent.url}`,
      });
    });
  }

  // Add brand
  if (productData.brand && productData.brand.toLowerCase() !== "other") {
    items.push({
      name: productData.brand,
      url: `/brand/${productData.brand}`,
    });
  }

  // Add product - PASTIKAN PRODUCT ADA DI AKHIR
  items.push({
    name: productData.tittle,
    url: `/product/${productData.id}`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
};

// ============ INJECT SCHEMAS ============

const productSchema = computed(() => {
  const schema = generateProductSchema(product.value);
  console.log("Generated Product Schema:", schema); // Debug
  return schema;
});

const breadcrumbSchema = computed(() =>
  generateBreadcrumbSchema(product.value)
);

// ============ USEHEAD DENGAN CARA YANG BENAR ============

// IMPORTANT: Jangan gunakan computed di dalam useHead untuk script
// Gunakan langsung dengan ref atau watch

// Buat ref untuk schema
const productSchemaRef = ref<any>(null);
const breadcrumbSchemaRef = ref<any>(null);

// Watch product changes
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      productSchemaRef.value = generateProductSchema(newProduct);
      breadcrumbSchemaRef.value = generateBreadcrumbSchema(newProduct);
    }
  },
  { immediate: true }
);

// Gunakan useHead dengan ref
useHead({
  title: computed(() => product.value?.tittle || "Product"),
  titleTemplate: "%s | Trumecs.com",

  meta: computed(() => [
    {
      name: "description",
      content: product.value?.description || "Produk berkualitas dari Trumecs",
    },
    {
      name: "keywords",
      content: `${product.value?.tittle}, ${product.value?.brand}, Trumecs`,
    },
    { name: "robots", content: "index, follow" },
  ]),

  script: computed(() => {
    const scripts = [];

    // Product Schema - PASTIKAN TIDAK NULL
    if (productSchemaRef.value) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(productSchemaRef.value),
        key: "product-schema",
        "data-hid": "product-schema",
        "data-test": "product-schema", // Untuk debugging
      });
    }

    // Breadcrumb Schema
    if (breadcrumbSchemaRef.value) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchemaRef.value),
        key: "breadcrumb-schema",
        "data-hid": "breadcrumb-schema",
      });
    }

    // Organization Schema
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Trumecs",
        url: "https://trumecs.com",
        logo: "https://trumecs.com/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+62-851-7691-2338",
          contactType: "sales",
          availableLanguage: ["Indonesian", "English"],
        },
      }),
      key: "organization-schema",
      "data-hid": "organization-schema",
    });

    return scripts;
  }),

  link: computed(() => [
    {
      rel: "canonical",
      href: product.value
        ? `https://migration.trumecs.com/product/${product.value.id}`
        : undefined,
    },
  ]),
});

// Open Graph
useSeoMeta({
  title: computed(() => product.value?.tittle),
  ogTitle: computed(() => product.value?.tittle),
  description: computed(() => product.value?.description),
  ogDescription: computed(() => product.value?.description),
  ogImage: computed(() =>
    product.value?.img
      ? `https://migration.trumecs.com/public/image/product/${product.value.img}`
      : undefined
  ),
  ogUrl: computed(() =>
    product.value
      ? `https://migration.trumecs.com/product/${product.value.id}`
      : undefined
  ),
  ogType: "product",
  ogSiteName: "Trumecs.com",
  twitterCard: "summary_large_image",
});

// ============ LIFE CYCLE ============

onMounted(async () => {
  await fetchDetailProduct();

  // Debug di console
  if (process.client) {
    console.log("Product Data:", product.value);
    console.log("Product Schema:", productSchemaRef.value);
    console.log("Breadcrumb Schema:", breadcrumbSchemaRef.value);
  }
});
</script>
