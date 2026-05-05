<template>
  <div class="article-detail-page">
    <!-- Breadcrumb -->

    <!-- Article Not Found -->
    <div v-if="!promo" class="container py-12 text-center">
      <Icon
        name="svg-spinners:90-ring-with-bg"
        class="text-6xl text-orange-500 mb-4 animate-spin"
      />
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Memuat Promo...</h2>
      <p class="text-gray-500 mb-6">Mohon tunggu, Promo sedang dimuat.</p>
    </div>

    <!-- Main Content - Only show if article exists -->
    <template v-if="product">
      <section class="article-detail py-4 lg:py-0" id="article-detail">
        <div class="container p-4 lg:p-6">
          <Breadcrumbs :items="detailProductBreadcrumb" />
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <!-- Left Column - Article Content (lg:col-span-8) -->
            <div class="lg:col-span-8"></div>

            <!-- Right Column - Sidebar (lg:col-span-4) -->
            <div class="lg:col-span-4"></div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Promo } from "~/types/promo";

const loading = ref(true);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const goBack = () => router.back();
const id = route.params.id as string; // rename untuk kejelasan

// Breadcrumb - buat menjadi computed agar bisa update otomatis
const detailProductBreadcrumb = computed(() => [
  { text: "Home", to: "/" },
  { text: "Promo", to: "/" },
]);

// Fetch detail artikel

// const fetchDetailProduct = async () => {
//   loading.value = true;
//   try {
//     const response = await useFetchApi<BaseResponse<Product>>(
//       `product/${id}`,
//       `product-${id}`,
//       "get",
//       null
//     );

//     if (response.status.value === "success") {
//       const apiData = response.data.value!.payload;
//       product.value = apiData.value;
//     }
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     ElMessage.error("Gagal memuat data artikel");
//     product.value = null;
//   } finally {
//     loading.value = false;
//   }
// };

const promo = ref<Promo | null>(null);
console.log("data Product :", promo);
useHead({
  title: promo.value?.tittle,
  titleTemplate: "Promo | Trumecs.com",
  meta: [{ name: promo.value?.tittle, content: promo.value?.description }],
});

useSeoMeta({
  title: promo.value?.tittle,
  ogTitle: promo.value?.tittle,
  description: promo.value?.description,
  ogDescription: promo.value?.description,
  ogImage: promo.value?.img,
  twitterCard: "summary_large_image",
});

const shareButtons = [
  {
    name: "facebook",
    icon: "logos:facebook",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  {
    name: "twitter",
    icon: "skill-icons:twitter",
    url: "https://twitter.com/intent/tweet?text=",
  },
  {
    name: "linkedin",
    icon: "logos:linkedin-icon",
    url: "https://www.linkedin.com/shareProduct?mini=true&url=",
  },
  {
    name: "pinterest",
    icon: "logos:pinterest",
    url: "https://pinterest.com/pin/create/button/?url=",
  },
  {
    name: "whatsapp",
    icon: "logos:whatsapp-icon",
    url: "https://wa.me/?text=",
  },
];
// Share article function
const shareArticle = (share: any) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(promo.value?.tittle || "");

  let shareUrl = "";

  switch (share.name) {
    case "facebook":
      shareUrl = `${share.url}${url}`;
      break;
    case "twitter":
      shareUrl = `${share.url}${title}%20${url}`;
      break;
    case "linkedin":
      shareUrl = `${share.url}${url}&title=${title}`;
      break;
    case "pinterest":
      shareUrl = `${share.url}${url}&description=${title}`;
      break;
    case "whatsapp":
      shareUrl = `${share.url}${title}%20-%20${url}`;
      break;
    default:
      shareUrl = `${share.url}${url}`;
  }

  window.open(shareUrl, "_blank", "width=600,height=400");
};

// Handle 404 - redirect or show message
onMounted(async () => {
  //   await fetchDetailProduct();
});
</script>
