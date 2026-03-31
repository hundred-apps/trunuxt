<template>
  <div class="article-detail-page">
    <!-- Breadcrumb -->

    <!-- Article Not Found -->
    <div v-if="!article" class="container py-12 text-center">
      <Icon
        name="svg-spinners:90-ring-with-bg"
        class="text-6xl text-orange-500 mb-4 animate-spin"
      />
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Memuat Artikel...</h2>
      <p class="text-gray-500 mb-6">Mohon tunggu, artikel sedang dimuat.</p>
    </div>

    <!-- Main Content - Only show if article exists -->
    <template v-if="article">
      <section class="article-detail py-4 lg:py-0" id="article-detail">
        <div class="container p-4 lg:p-6">
          <Breadcrumbs :items="articleBreadcrumb" />
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <!-- Left Column - Article Content (lg:col-span-8) -->
            <div class="lg:col-span-8">
              <article class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="">
                  <!-- Title -->
                  <h1
                    class="text-2xl lg:text-3xl font-bold mb-3"
                    itemprop="headline"
                  >
                    {{ article.title }}
                  </h1>

                  <!-- Meta Info -->
                  <div
                    class="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4"
                  >
                    <div class="flex items-center">
                      <Icon
                        name="material-symbols:calendar-today"
                        class="mr-2"
                      />
                      <span>{{ formatDate(article.date) }}</span>
                    </div>
                    <div class="flex items-center">
                      <Icon name="material-symbols:person" class="mr-2" />
                      <span>{{ article.author.name }}</span>
                    </div>
                  </div>

                  <!-- Categories -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span
                      v-for="cat in article.categories"
                      :key="cat"
                      class="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full"
                    >
                      {{ cat }}
                    </span>
                  </div>

                  <!-- Featured Image -->
                  <div class="article-image mb-6">
                    <img
                      :src="article.image"
                      :alt="article.title"
                      class="w-full rounded-xl"
                      :style="{ maxHeight: '500px', objectFit: 'cover' }"
                    />
                  </div>

                  <!-- Article Content with Dynamic Insertions -->
                  <div
                    class="article-content prose prose-sm lg:prose-base max-w-none"
                  >
                    <div v-html="processedContent"></div>
                  </div>

                  <!-- Tags -->
                  <div
                    v-if="article.tags?.length"
                    class="mt-6 pt-4 border-t border-gray-200"
                  >
                    <div class="flex flex-wrap gap-2">
                      <span class="text-sm font-semibold text-gray-600"
                        >Tags:</span
                      >
                      <Trulink
                        v-for="tag in article.tags"
                        :key="tag"
                        :to="`/article/tag/${tag.toLowerCase()}`"
                        class="text-sm text-orange-500 hover:underline"
                      >
                        #{{ tag }}
                      </Trulink>
                    </div>
                  </div>

                  <!-- Share Buttons - Mobile Only -->
                  <div class="share-buttons mt-6 pt-4 border-t border-gray-200">
                    <span class="font-semibold mr-3">Bagikan :</span>
                    <div class="flex gap-2">
                      <button
                        v-for="share in shareButtons"
                        :key="share.name"
                        @click="shareArticle(share)"
                        class="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors"
                      >
                        <Icon :name="share.icon" class="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Right Column - Sidebar (lg:col-span-4) -->
            <div class="lg:col-span-4">
              <div class="sticky top-20 flex flex-col gap-4">
                <!-- Trending Section -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div class="border-b border-gray-200 px-4 py-3">
                    <h5 class="font-bold flex items-center">
                      <Icon
                        name="material-symbols:local-fire"
                        class="text-orange-500 mr-2"
                      />
                      {{ $t("label.trendingArticle") }}
                    </h5>
                  </div>
                  <div class="p-3">
                    <div class="space-y-3">
                      <CardsArticleRowsmall
                        :articles="trendingArticles"
                        :show-ranking="false"
                        image-size="sm"
                        max-title-lines="2"
                      />
                    </div>
                  </div>
                </div>

                <!-- Maintenance Banner - Desktop Only -->
                <CardsArticleAds v-if="randomAdsTop" v-bind="randomAdsTop" />

                <!-- Related Articles -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div class="border-b border-gray-200 px-4 py-3">
                    <h5 class="font-bold">{{ $t("label.relatedArticle") }}</h5>
                  </div>
                  <div class="p-3">
                    <div class="space-y-3">
                      <CardsArticleRowsmall
                        :articles="relatedArticles"
                        :show-ranking="false"
                        image-size="sm"
                        max-title-lines="2"
                      />
                    </div>
                  </div>
                </div>

                <!-- Construction Banner - Desktop Only -->
                <CardsArticleAds
                  v-if="randomAdsBottom"
                  v-bind="randomAdsBottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Request Form Section -->
      <!-- <section class="request-form py-8 lg:py-12 bg-gray-50" id="request-form">
        <div class="container">
          <div class="space-y-4">
            <h3 class="text-xl lg:text-2xl font-bold">
              Tidak menemukan barang? kirim permintaan sekarang!
            </h3>
            <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <RequestForm />
            </div>
          </div>
        </div>
      </section> -->

      <!-- Related Products Section -->
      <!-- <section class="product-related py-8 lg:py-12" id="product-related">
        <div class="container">
          <h3 class="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
            Produk Terkait
          </h3> -->

      <!-- Desktop Grid (lg:grid) -->
      <!-- <div class="hidden lg:grid lg:grid-cols-4 gap-4">
            <ProductCard
              v-for="product in relatedProducts"
              :key="product.id"
              :product="product"
            />
          </div> -->

      <!-- Mobile Slider (lg:hidden) -->
      <!-- <div class="lg:hidden">
            <div class="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
              <div
                v-for="product in relatedProducts"
                :key="product.id"
                class="flex-shrink-0 w-[160px] snap-start"
              >
                <ProductCardMobile :product="product" />
              </div>
            </div>
          </div> -->
      <!-- </div>
      </section> -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Article, CardArticle } from "~/types/article";
import type { ProductCategory } from "~/types/category";

const loading = ref(true);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const goBack = () => router.back();
const slug = route.params.slug as string; // rename untuk kejelasan

// State untuk artikel detail - ini yang akan digunakan di template
const article = ref<CardArticle | null>(null);

const trendingArticles = ref<CardArticle[]>([]);
const relatedArticles = ref<CardArticle[]>([]);
const categories = ref<ProductCategory[]>([]);

const randomAdsTop = ref(null);
const randomAdsBottom = ref(null);

const setRandomAds = () => {
  if (categories.value.length < 2) return;

  const shuffled = [...categories.value].sort(() => 0.5 - Math.random());

  randomAdsTop.value = shuffled[0];
  randomAdsBottom.value = shuffled[1];
};

// Breadcrumb - buat menjadi computed agar bisa update otomatis
const articleBreadcrumb = computed(() => [
  { text: "Home", to: "/" },
  { text: "Artikel", to: "/article" },
  { text: article.value?.title || "Loading..." }, // judul artikel sebagai breadcrumb terakhir
]);

// Fetch detail artikel

const fetchTrendingArticles = async () => {
  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read`, // Gunakan endpoint yang sama dengan limit
      `trending-articles`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload.trend_article;
      const config = useRuntimeConfig();

      // Transform data featured
      trendingArticles.value = apiData.map((item: Article) => {
        return {
          id: item.id,
          url: item.url || `article-${item.id}`,
          title: item.title || "Untitled",
          image: item.img
            ? `${
                config.public.baseURLIMGARTICLE ||
                "https://www.trumecs.com/public/image/artikel/"
              }${item.img}`
            : "https://via.placeholder.com/300x200?text=No+Image",
          category: item.tag,
          date: item.date,
          views: item.view,
        };
      });
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const fetchRelatedArticles = async () => {
  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read/${slug}`,
      `article-trending-${slug}`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload.related;
      const config = useRuntimeConfig();

      relatedArticles.value = apiData.map((item: Article) => {
        return {
          id: item.id,
          url: item.url || `article-${item.id}`,
          title: item.title || "Untitled",
          image: item.img
            ? `${
                config.public.baseURLIMGARTICLE ||
                "https://www.trumecs.com/public/image/artikel/"
              }${item.img}`
            : "https://via.placeholder.com/300x200?text=No+Image",
          category: item.tag,
          date: item.date,
          views: item.view,
        };
      });
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const fetchDetailArticle = async () => {
  loading.value = true;
  try {
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read/${slug}`,
      `article-read-${slug}`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload;

      // Transform data ke format CardArticle
      const config = useRuntimeConfig();

      // Helper function untuk extract categories dari tags
      const extractCategories = (tags: any): string[] => {
        if (!tags) return ["General"];
        if (Array.isArray(tags)) {
          return tags.length ? tags : ["General"];
        }
        if (typeof tags === "string") {
          return tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
        return ["General"];
      };

      // Helper function untuk extract tags
      const extractTags = (tags: any): string[] => {
        if (!tags) return [];
        if (Array.isArray(tags)) {
          return tags;
        }
        if (typeof tags === "string") {
          return tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
        return [];
      };

      // Assign ke article.value
      article.value = {
        id: apiData.id,
        url: apiData.url || `article-${apiData.id}`,
        title: apiData.title || "Untitled",
        image: apiData.img
          ? apiData.img.startsWith("http")
            ? apiData.img
            : `${
                config.public.baseURLIMGARTICLE ||
                "https://www.trumecs.com/public/image/artikel/"
              }${apiData.img}`
          : "https://via.placeholder.com/300x200?text=No+Image",
        category: extractCategories(apiData.tag)[0] || "General",
        tags: extractTags(apiData.tag),
        date: apiData.date,
        excerpt: apiData.discription_seo || "",
        content: apiData.value || "", // untuk v-html
        author: apiData.created_by
          ? {
              name: apiData.created_by,
              avatar: "https://via.placeholder.com/40x40?text=User",
              role: "Contributor",
            }
          : {
              name: "Anonymous",
              avatar: "https://via.placeholder.com/40x40?text=User",
              role: "Guest",
            },
      };
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    ElMessage.error("Gagal memuat data artikel");
    article.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<ProductCategory>>(
      `category-read/`,
      `category-for-ads`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload.category.products;
      console.log("data categories :", apiData);
      const config = useRuntimeConfig();

      categories.value = apiData.map((item: ProductCategory) => {
        return {
          title: item.name,
          description: item.name,
          imageUrl: item.name
            ? `${
                config.public.baseURLIMGARTICLE ||
                "https://www.trumecs.com/public/image/artikel/"
              }${item.name}`
            : "https://via.placeholder.com/300x200?text=No+Image",
          imageAlt: item.name,
          buttonLink: item.name,
          buttonText: item.name,
        };
      });
      if (categories.value.length > 0) {
        randomCategory.value = getRandomCategories(categories.value, 2);
      }
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

// Processed content untuk v-html
const processedContent = computed(() => {
  return article.value?.content || "";
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
    url: "https://www.linkedin.com/shareArticle?mini=true&url=",
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
  const title = encodeURIComponent(article.value?.title || "");

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

// Dummy Data - Related Products

// Format date
const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

useHead({
  title: article.value?.title,
  titleTemplate: "Artikel - %s | Trumecs.com",
  meta: [{ name: article.value?.title, content: article.value?.content }],
});

useSeoMeta({
  title: article.value?.title,
  ogTitle: article.value?.title,
  description: article.value?.content,
  ogDescription: article.value?.content,
  ogImage: article.value?.image,
  twitterCard: "summary_large_image",
});

// Handle 404 - redirect or show message
onMounted(async () => {
  await fetchDetailArticle();
  await fetchTrendingArticles();
  await fetchRelatedArticles();
  await fetchCategories();
  setRandomAds();
});

// Watch for route changes (jika slug berubah)
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
      slug = newSlug as string;
      fetchDetailArticle();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
);
</script>
