<template>
  <div class="product-detail-page bg-gray-50 min-h-screen">
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

    <!-- Main Content -->
    <template v-else>
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-100 shadow-sm">
        <div class="container mx-auto px-4 py-3">
          <Breadcrumbs :items="detailProductBreadcrumb" />
        </div>
      </div>

      <!-- Product Section -->
      <section class="py-4 lg:py-8">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <!-- Left Column - Product Images & Gallery -->
            <div class="lg:col-span-5">
              <ProductGallery :product="product" />
            </div>

            <!-- Right Column - Product Info -->
            <div class="lg:col-span-7">
              <ProductInfo
                :product="product"
                :breadcrumb-items="breadcrumbItems"
              />
            </div>
          </div>

          <!-- Product Details Tabs -->
          <div class="mt-8 lg:mt-12">
            <ProductTabs :product="product" />
          </div>

          <!-- Related Products -->
          <div
            v-if="product.related_product && product.related_product.length > 0"
            class="mt-8 lg:mt-12"
          >
            <ProductRelatedProducts
              :products="product.related_product"
              :current-product-id="product.id"
            />
          </div>

          <!-- Related Articles -->
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

// SEO
useHead({
  title: product.value?.tittle,
  titleTemplate: "%s | Trumecs.com",
  meta: [
    {
      name: "description",
      content: product.value?.description || "Produk berkualitas dari Trumecs",
    },
    {
      name: "keywords",
      content: `${product.value?.tittle}, ${product.value?.brand}, Trumecs`,
    },
  ],
});

useSeoMeta({
  title: product.value?.tittle,
  ogTitle: product.value?.tittle,
  description: product.value?.description,
  ogDescription: product.value?.description,
  ogImage: product.value?.img
    ? `/public/image/product/${product.value.img}`
    : undefined,
  ogUrl: typeof window !== "undefined" ? window.location.href : undefined,
  ogType: "product",
  twitterCard: "summary_large_image",
  twitterTitle: product.value?.tittle,
  twitterDescription: product.value?.description,
  twitterImage: product.value?.img
    ? `/public/image/product/${product.value.img}`
    : undefined,
});

const generateProductSchema = () => {
  if (!product.value) return null;

  const p = product.value;
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://trumecs.com";
  const productUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${baseUrl}/product/${p.id}`;

  // Harga
  const price =
    Number(p.price_promo) > 0 ? Number(p.price_promo) : Number(p.price);
  const originalPrice = Number(p.price);
  const isOnSale =
    Number(p.price_promo) > 0 && Number(p.price_promo) < Number(p.price);

  // Gambar
  const images = [];
  if (p.img) {
    images.push(`${baseUrl}/public/image/product/${p.img}`);
  }
  if (p.gallery_img && Array.isArray(p.gallery_img)) {
    p.gallery_img.forEach((item) => {
      if (item.img) {
        images.push(`${baseUrl}/public/image/product/${item.img}`);
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

  // Condition
  const condition =
    p.physicnumber && p.physicnumber.includes("S/N")
      ? "https://schema.org/UsedCondition"
      : "https://schema.org/NewCondition";

  // Build Product Schema
  const schema = {
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
      {
        "@type": "PropertyValue",
        name: "MOQ",
        value: p.moq ? `${p.moq} ${p.unit || "Unit"}` : undefined,
      },
      {
        "@type": "PropertyValue",
        name: "Warranty",
        value: p.warranty || undefined,
      },
      {
        "@type": "PropertyValue",
        name: "Availability At",
        value: p.availability_at || "Indonesia",
      },
    ].filter((prop) => prop.value !== undefined),
  };

  // Add dimensions
  if (p.sx && p.sy && p.sz) {
    schema.additionalProperty.push({
      "@type": "PropertyValue",
      name: "Dimensions",
      value: `${p.sx} × ${p.sy} × ${p.sz} m`,
    });
  }

  // Add serial number for heavy equipment
  if (p.physicnumber) {
    schema.additionalProperty.push({
      "@type": "PropertyValue",
      name: "Serial Number",
      value: p.physicnumber,
    });
  }

  // Add specs
  if (p.specs && p.specs.length > 0) {
    p.specs.forEach((spec) => {
      if (spec.name && spec.value) {
        schema.additionalProperty.push({
          "@type": "PropertyValue",
          name: spec.name,
          value: spec.value,
        });
      }
    });
  }

  // If on sale
  if (isOnSale) {
    schema.offers.price = price.toString();
    schema.offers.priceCurrency = "IDR";
    schema.offers.priceValidUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
  }

  return schema;
};

// ============ Inject JSON-LD Schema ============

// Inject Product Schema
const productSchema = computed(() => generateProductSchema());

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(productSchema.value, null, 2),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: typeof window !== "undefined" ? window.location.href : undefined,
    },
  ],
});

// ============ Breadcrumb Schema ============

const breadcrumbSchema = computed(() => {
  const items = detailProductBreadcrumb.value;
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.text,
      item:
        typeof window !== "undefined"
          ? `${window.location.origin}${item.to}`
          : item.to,
    })),
  };
});

// Inject Breadcrumb Schema
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbSchema.value, null, 2),
    },
  ],
});

// ============ Organization Schema (Optional) ============

const organizationSchema = {
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
  sameAs: [
    "https://www.facebook.com/trumecs",
    "https://www.instagram.com/trumecs",
    "https://www.youtube.com/trumecs",
  ],
};

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(organizationSchema, null, 2),
    },
  ],
});

// ============ Website Schema (Search Box) ============

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Trumecs",
  url: "https://trumecs.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://trumecs.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(websiteSchema, null, 2),
    },
  ],
});

onMounted(async () => {
  await fetchDetailProduct();
});
</script>
