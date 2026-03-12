<template>
  <div class="article-page">
    <!-- Hero Section dengan Featured Articles -->
    <div class="container">
      <!-- Desktop Featured Layout (lg:grid) -->
      <div class="hidden lg:grid lg:grid-cols-12 gap-6 my-8">
        <!-- Main Featured Article (col-span-6) -->
        <div class="lg:col-span-6">
          <CardsArticleListFeaturedmain :article="mainFeaturedArticle" />
        </div>

        <!-- Small Featured Articles Grid (col-span-6) -->
        <div class="lg:col-span-6">
          <CardsArticleListFeaturedsub
            :articles="subFeaturedArticles"
            :start-index="1"
            :end-index="subFeaturedArticles.length"
          />
        </div>
      </div>

      <!-- Mobile Featured Layout (lg:hidden) -->
      <div class="lg:hidden my-4">
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="(article, index) in featuredArticles.slice(0, 5)"
            :key="index"
            class="featured-article"
          >
            <Trulink
              :to="`/article/${article.url}`"
              class="block bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div class="flex gap-3 p-2">
                <div class="w-1/3 aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    :src="article.image"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="w-2/3 flex flex-col justify-center">
                  <span class="text-xs font-semibold text-orange-500">{{
                    article.category
                  }}</span>
                  <h3 class="font-semibold text-base line-clamp-3">
                    {{ article.title }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">
                    <Icon
                      name="material-symbols:calendar-today"
                      class="inline mr-1 text-xs"
                    />
                    {{ formatDate(article.date) }}
                  </p>
                </div>
              </div>
            </Trulink>
          </div>
        </div>
      </div>
    </div>
    <section id="article-list" class="pt-8"></section>

    <!-- Tabs Search Section -->
    <!-- <section class="tabsearch py-8 lg:py-12 bg-gray-50">
      <div class="container">
        <div class="text-center mb-6 lg:mb-8">
          <h4 class="text-xl lg:text-2xl font-bold mb-2">
            Kirim Permintaan Barang Lebih Mudah dan Cepat
          </h4>
          <p class="text-gray-600 text-sm lg:text-base">
            Dengan
            <Trulink to="/" class="text-orange-500 hover:underline"
              >Trumecs</Trulink
            >, proses pengadaan barang menjadi lebih efisien
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <el-tabs v-model="activeTab" class="request-tabs">
            <el-tab-pane label="Produk" name="product">
              <RequestForm type="product" />
            </el-tab-pane>
            <el-tab-pane label="Jasa" name="service">
              <RequestForm type="service" />
            </el-tab-pane>
            <el-tab-pane label="Rental" name="rental">
              <RequestForm type="rental" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section> -->

    <!-- Main Content Area -->
    <section class="article-content py-8 lg:py-12">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <!-- Articles List - Left Column (lg:col-span-8) -->
          <div class="lg:col-span-8">
            <!-- Trending for Mobile (lg:hidden) -->
            <div class="lg:hidden mb-6">
              <div class="bg-orange-100 rounded-lg shadow-sm p-4">
                <h5 class="font-bold mb-3 flex items-center">
                  <Icon
                    name="material-symbols:local-fire"
                    class="text-orange-500 mr-2"
                  />
                  {{ $t("label.trendingArticle") }}
                </h5>
                <div class="grid grid-cols-1 gap-3">
                  <CardsArticleRowsmall
                    :articles="trendingArticle"
                    :show-ranking="false"
                    image-size="sm"
                    max-title-lines="2"
                  />
                </div>
              </div>
            </div>

            <!-- Articles List -->
            <div class="grid grid-cols-1 gap-4">
              <p class="text-xl fw-bold">{{ $t("label.article") }}</p>
              <div v-if="loading" class="text-center py-8">
                <el-skeleton :rows="3" animated />
              </div>

              <!-- Empty State -->
              <div
                v-else-if="transformedArticles.length === 0"
                class="text-center py-8"
              >
                <el-empty description="Tidak ada artikel" />
              </div>

              <!-- Article List -->
              <CardsArticleListArticle
                v-else
                :articles="transformedArticles"
                @article-click="handleArticleClick"
              />
            </div>

            <!-- Pagination -->
            <div class="flex justify-center mt-8">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="totalArticles"
                :page-size="perPage"
                v-model:current-page="currentPage"
                @update:current-page="handlePageChange"
              />
            </div>
          </div>

          <!-- Sidebar - Right Column (lg:col-span-4) -->
          <div class="hidden lg:block lg:col-span-4">
            <div class="sticky top-[150px]">
              <!-- Trending Section -->
              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                  class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4"
                >
                  <h5 class="font-bold flex items-center">
                    <Icon name="material-symbols:local-fire" class="mr-2" />
                    {{ $t("label.trendingArticle") }}
                  </h5>
                </div>
                <div class="divide-y divide-gray-100">
                  <CardsArticleRowsmall
                    :articles="trendingArticle"
                    :show-ranking="false"
                    image-size="sm"
                    max-title-lines="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Article, CardArticle } from "~/types/article";
import { defineArticle, useSchemaOrg } from "@unhead/schema-org/vue";

const RequestForm = {
  props: ["type"],
  template: `
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-input 
          v-model="form.nama" 
          placeholder="Nama Lengkap"
          size="large"
        />
        <el-input 
          v-model="form.email" 
          placeholder="Email"
          size="large"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-input 
          v-model="form.perusahaan" 
          placeholder="Nama Perusahaan"
          size="large"
        />
        <el-input 
          v-model="form.telepon" 
          placeholder="Nomor Telepon"
          size="large"
        />
      </div>
      <el-input
        v-model="form.permintaan"
        :rows="4"
        type="textarea"
        placeholder="Deskripsikan kebutuhan Anda..."
      />
      <div class="text-center">
        <el-button 
          type="primary" 
          native-type="submit"
          size="large"
          :loading="loading"
        >
          Kirim Permintaan
        </el-button>
      </div>
    </form>
  `,
  setup() {
    const form = ref({
      nama: "",
      email: "",
      perusahaan: "",
      telepon: "",
      permintaan: "",
    });
    const loading = ref(false);

    const handleSubmit = () => {
      loading.value = true;
      // Simulate API call
      setTimeout(() => {
        loading.value = false;
        ElMessage.success("Permintaan berhasil dikirim!");
        form.value = {
          nama: "",
          email: "",
          perusahaan: "",
          telepon: "",
          permintaan: "",
        };
      }, 1500);
    };

    return { form, loading, handleSubmit };
  },
};

const loading = ref(true);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const goBack = () => router.back();

// Update tipe data
const dataArticle = ref<CardArticle[]>([]);
const trendingArticle = ref<CardArticle[]>([]);

const mainFeaturedArticle = computed(() => {
  return featuredArticles.value[0] || null;
});

const subFeaturedArticles = computed(() => {
  return featuredArticles.value.slice(0, 5) || [];
});

// useSchemaOrg([
//   defineArticle({
//     headline: mainFeaturedArticle.value?.title,
//     image: mainFeaturedArticle.value?.image,
//     datePublished: mainFeaturedArticle.value?.date,
//     author: {
//       name: mainFeaturedArticle.value?.author?.name,
//     },
//   }),
// ]);

// State
const activeTab = ref("product");
const currentPage = ref(1);
const perPage = ref(10);
const totalArticles = ref(50);

const featuredArticles = ref<CardArticle[]>([]);
const loadingFeatured = ref(false);

const transformedArticles = computed(() => {
  if (!dataArticle.value || dataArticle.value.length === 0) {
    return []; // Return empty array if no data
  }
  return dataArticle.value;
});

const handleArticleClick = (article: Article) => {
  // Bisa untuk analytics
};

const fetchTrendingArticles = async () => {
  loadingFeatured.value = true;

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
      console.log("data trend: ", apiData);
      const config = useRuntimeConfig();

      // Transform data featured
      trendingArticle.value = apiData.map((item: Article) => {
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
    loadingFeatured.value = false;
  }
};

const fetchFeaturedArticles = async () => {
  loadingFeatured.value = true;

  try {
    // Ambil 5 artikel untuk featured (misalnya page=1 dengan limit=5)
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read?page=1&limit=5`, // Gunakan endpoint yang sama dengan limit
      `featured-articles`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload.main_article;
      const config = useRuntimeConfig();

      // Transform data featured
      featuredArticles.value = apiData.map((item: Article) => {
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
          excerpt:
            item.discription_seo ||
            (item.value
              ? item.value.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
              : "No description"),
          author: item.created_by
            ? {
                name: `${item.created_by}`,
                avatar: "https://via.placeholder.com/40x40?text=User",
                role: "Contributor",
              }
            : {
                name: "Anonymous",
                avatar: "https://via.placeholder.com/40x40?text=User",
                role: "Guest",
              },
        };
      });
    }
  } catch (error) {
  } finally {
    loadingFeatured.value = false;
  }
};

const fetchArticle = async () => {
  loading.value = true;
  try {
    const response = await useFetchApi<BaseResponse<Article>>(
      `article-read?page=${currentPage.value}`,
      `article-read-${currentPage.value}`,
      "get",
      null
    );

    if (response.status.value === "success") {
      const apiData = response.data.value!.payload.list_article;
      const config = useRuntimeConfig();

      // Helper function to extract category from tags
      const extractCategoryFromTags = (tags: any): string => {
        if (!tags) return "General";
        if (Array.isArray(tags)) {
          return tags[0] || "General";
        }
        if (typeof tags === "string") {
          return tags.split(",")[0].trim() || "General";
        }
        return "General";
      };

      // Helper function to create excerpt from description_seo or value
      const createExcerpt = (
        description: string | null,
        content: string | null
      ): string => {
        if (description) return description;
        if (content) {
          const stripped = content.replace(/<[^>]*>/g, "");
          return stripped.length > 150
            ? stripped.substring(0, 150) + "..."
            : stripped;
        }
        return "No description available";
      };

      // Transform the data dan assign ke dataArticle.value
      dataArticle.value = apiData.map((item: Article) => {
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
          category: extractCategoryFromTags(item.tag),
          date: item.date,
          excerpt: createExcerpt(item.discription_seo, item.value),
          author: item.created_by
            ? {
                name: `${item.created_by}`,
                avatar: "https://via.placeholder.com/40x40?text=User",
                role: "Contributor",
              }
            : {
                name: "Anonymous",
                avatar: "https://via.placeholder.com/40x40?text=User",
                role: "Guest",
              },
        };
      });

      // Update total articles jika ada dari response
      if (response.data.value!.pagination.total_data) {
        totalArticles.value = response.data.value!.pagination.total_data;
      }
    }
  } catch (error) {
    ElMessage.error("Gagal memuat data artikel");
    goBack();
  } finally {
    loading.value = false;
  }
};

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start", // 'start', 'center', 'end', atau 'nearest'
    });
  }
};

const handlePageChange = async (page: number) => {
  await router.push({ query: { ...route.query, page } });
  scrollToSection("article-list");
};

// Initialize from URL query
onMounted(async () => {
  await fetchTrendingArticles();
  await fetchFeaturedArticles();
  const pageFromUrl = route.query.page ? Number(route.query.page) : 1;
  currentPage.value = pageFromUrl;
  await fetchArticle();
});

// Watch route query changes
watch(
  () => route.query.page,
  async (newPage, oldPage) => {
    // Set currentPage
    if (newPage) {
      currentPage.value = Number(newPage);
    } else {
      currentPage.value = 1;
    }

    // Panggil fetchArticle untuk mengambil data baru
    await fetchArticle();
  },
  { immediate: true }
);
</script>

<style scoped>
/* Container */
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:text-orange-500 {
  color: #fa8420;
}

/* Custom colors */
.text-orange-500 {
  color: #fa8420;
}

.bg-orange-500 {
  background-color: #fa8420;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.hover\:bg-orange-50:hover {
  background-color: #fff7ed;
}

.from-orange-500 {
  --tw-gradient-from: #fa8420;
}

.to-orange-600 {
  --tw-gradient-to: #ea6f0e;
}

/* Pagination overrides */
:deep(.el-pagination) {
  --el-pagination-button-bg-color: transparent;
  --el-pagination-hover-color: #fa8420;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #fa8420;
}

/* Tabs overrides */
:deep(.el-tabs__item.is-active) {
  color: #fa8420;
}

:deep(.el-tabs__active-bar) {
  background-color: #fa8420;
}

:deep(.el-tabs__item:hover) {
  color: #fa8420;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card {
  animation: fadeIn 0.5s ease-out;
}

/* Featured article hover */
.featured-article .group:hover .shadow-lg {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
