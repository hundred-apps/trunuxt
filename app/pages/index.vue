<template>
  <div class="homepage">
    <section class="hero-section relative overflow-hidden">
      <div class="relative">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="w-full flex-shrink-0"
            >
              <component
                :is="slideTag(index)"
                v-bind="slideAttrs(index)"
                class="block w-full"
                @click="slide.scrap ? openScrapModal() : undefined"
              >
                <NuxtImg
                  :src="slide.image"
                  :alt="slide.alt"
                  class="w-full block h-auto object-contain lg:h-[680px] lg:object-cover"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  :fetchpriority="index === 0 ? 'high' : 'auto'"
                  :preload="index === 0"
                  decoding="async"
                  sizes="100vw sm:100vw md:100vw lg:1280px"
                  width="1280"
                  height="680"
                  format="webp"
                  quality="70"
                />
              </component>
            </div>
          </div>
        </div>

        <button
          @click="prevSlide"
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
        >
          <Icon
            name="material-symbols:chevron-left"
            class="text-gray-700 text-xl"
          />
        </button>
        <button
          @click="nextSlide"
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
        >
          <Icon
            name="material-symbols:chevron-right"
            class="text-gray-700 text-xl"
          />
        </button>

        <div
          class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        >
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="currentSlide = index"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentSlide === index ? 'bg-white w-6' : 'bg-white/50'"
          />
        </div>
      </div>
    </section>

    <!-- Industri / Tag Section -->
    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("label.industry") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.industri.subtitle") }}
            </p>
          </div>
          <!-- <Trulink
            :to="`/tag`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink> -->
        </div>

        <!-- Fallback skeleton hanya kalau data belum sama sekali tersedia -->
        <div
          v-if="industriesList.length === 0 && loadingTags"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4"
        >
          <div v-for="i in 7" :key="i" class="animate-pulse">
            <div class="aspect-[2/3] bg-gray-200 rounded-xl" />
            <div class="h-3 bg-gray-200 rounded mt-2 w-3/4 mx-auto" />
          </div>
        </div>

        <div
          v-else-if="industriesList.length === 0"
          class="text-center py-16 bg-white rounded-xl shadow-sm"
        >
          <Icon
            name="material-symbols:label"
            class="text-6xl text-gray-300 mb-4"
          />
          <h3 class="text-lg font-medium text-gray-600 mb-2">
            {{ $t("page.tag.empty") }}
          </h3>
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4"
        >
          <Trulink
            v-for="(tag, tagIdx) in industriesList.slice(0, 10)"
            :key="tag.id"
            :to="`/search?tag=${tag.id}`"
            class="group"
          >
            <div
              class="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 border border-orange-100"
            >
              <!-- Kartu industri: file WebP dari mirror lokal public/ (tanpa /_ipx/) -->
              <img
                v-if="!tagImgFailed(tag.id)"
                :src="staticImg(`/public/tag/industries/${tag.id}.png`)"
                :srcset="
                  staticImgSrcset(`/public/tag/industries/${tag.id}.png`)
                "
                :sizes="TAG_IMG_SIZES"
                :alt="tagLabelByLocale(tag)"
                class="w-full h-full object-cover"
                width="1024"
                height="1536"
                loading="eager"
                :fetchpriority="tagIdx < 3 ? 'high' : 'auto'"
                decoding="async"
                @error="markTagImgError(tag.id)"
              />
              <Icon
                v-else
                :name="tagIcon(tag)"
                class="text-3xl lg:text-4xl text-gray-400"
              />
              <div
                class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/85"
              />
              <p
                class="absolute left-0 right-0 bottom-0 p-2 lg:p-3 text-center text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2"
              >
                {{ tagLabelByLocale(tag) }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="text-center mb-6 lg:mb-8">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
            {{ $t("page.home.categories.title") }}
          </h2>
          <p class="text-gray-500 text-sm lg:text-base mt-1">
            {{ $t("page.home.categories.subtitle") }}
          </p>
        </div>

        <div
          v-if="loadingCategories"
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="aspect-[2/3] bg-gray-200 rounded-xl" />
            <div class="h-3 bg-gray-200 rounded mt-2 w-3/4 mx-auto" />
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          <Trulink
            v-for="category in categories"
            :key="category.id"
            :to="`/search?cat=${category.id}`"
            class="group"
          >
            <div
              class="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 border border-orange-100"
            >
              <AppImage
                v-if="category.img"
                :src="`${config.public.baseImageCat}${category.img}`"
                :alt="category.name"
                class="w-full h-full object-cover"
                sizes="33vw sm:25vw lg:16vw"
                width="400"
                height="600"
                loading="lazy"
                @error="handleImageError"
              />
              <Icon
                v-else
                name="material-symbols:category"
                class="text-3xl lg:text-4xl text-gray-400"
              />
              <div
                class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/85"
              />
              <p
                class="absolute left-0 right-0 bottom-0 p-2 lg:p-3 text-center text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2"
              >
                {{ category.name }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section
      v-if="promos.length > 0"
      class="py-8 lg:py-12 bg-gradient-to-br from-orange-50 to-white"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.promo.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.promo.subtitle") }}
            </p>
          </div>
          <Trulink
            :href="`${urlTrumecs}/promo`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <Trulink
            v-for="promo in promos.slice(0, 3)"
            :key="promo.id"
            :href="`${urlTrumecs}/promo/${promo.url}`"
            data-track-card="promo"
            :data-track-id="String(promo.id)"
            :data-track-title="promo.name"
            class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div class="relative h-40 sm:h-48 overflow-hidden">
              <AppImage
                v-if="promo.img"
                :src="`${config.public.baseImagePromo}${promo.img}`"
                :alt="promo.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="100vw sm:50vw lg:33vw"
                width="600"
                height="360"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:local-offer"
                  class="text-5xl text-white/80"
                />
              </div>
              <div
                class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("label.promo") }}
              </div>
              <div
                v-if="isPromoEnded(promo.end_date)"
                class="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded"
              >
                {{ $t("page.promo.ended") }}
              </div>
            </div>
            <div class="p-4">
              <h3
                class="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1"
              >
                {{ promo.name }}
              </h3>
              <p
                class="text-sm text-gray-500 mt-1 line-clamp-2"
                v-html="stripHtml(promo.description)"
              />
              <div class="flex items-center justify-between mt-3">
                <span class="text-xs text-gray-400">
                  {{ $t("page.promo.activeUntil") }}
                  {{ formatDate(promo.end_date) }}
                </span>
                <span
                  v-if="promo.product && promo.product.length > 0"
                  class="text-xs text-orange-500 font-medium"
                >
                  {{ promo.product.length }} {{ $t("page.promo.items") }}
                </span>
              </div>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.featured.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.featured.subtitle") }}
            </p>
          </div>
          <Trulink
            :to="`/search`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div v-if="loadingFeatured" class="space-y-10">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-40 mb-4" />
            <div
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
            >
              <div
                v-for="j in 4"
                :key="j"
                class="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div class="aspect-square bg-gray-200" />
                <div class="p-3 space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-1/3" />
                  <div class="h-3 bg-gray-200 rounded w-full" />
                  <div class="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="featuredGroups.length === 0"
          class="text-center py-16 bg-white rounded-xl shadow-sm"
        >
          <Icon
            name="material-symbols:inventory-2"
            class="text-6xl text-gray-300 mb-4"
          />
          <h3 class="text-lg font-medium text-gray-600">
            {{ $t("page.category.empty") }}
          </h3>
        </div>

        <!-- Grouped by kategori -->
        <div v-else class="space-y-12">
          <div v-for="group in featuredGroups" :key="group.id">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span
                  class="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:inventory-2"
                    class="text-orange-500 text-lg"
                  />
                </span>
                <h3 class="text-lg lg:text-xl font-bold text-gray-800">
                  {{ group.name }}
                </h3>
              </div>
              <Trulink
                :to="`/search?cat=${group.id}`"
                class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
              >
                {{ $t("button.seeAll") }}
                <Icon name="material-symbols:arrow-forward" class="text-sm" />
              </Trulink>
            </div>

            <div
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
            >
              <ProductCard
                v-for="product in group.products"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-for="(section, sIndex) in categoryShowcases"
      :key="sIndex"
      class="py-8 lg:py-12"
      :class="sIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
            {{ section.title }}
          </h2>
          <Trulink
            :href="`/search?cat=${section.id}`"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div class="p-[2px] bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
          <div
            class="relative overflow-hidden rounded-[14px]"
            :style="{
              backgroundImage: `url('${section.bg}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-0">
              <Trulink
                v-for="(sub, subIdx) in section.subcategories"
                :key="sub.id"
                :to="`/search?cat=${sub.id}`"
                class="group relative overflow-hidden flex border border-white"
                :class="[
                  subIdx === 0
                    ? 'col-span-2 lg:col-span-2 lg:row-span-2'
                    : 'col-span-1',
                  subIdx === 0
                    ? 'min-h-[18rem] lg:min-h-[24rem]'
                    : 'min-h-[9rem] lg:min-h-[12rem]',
                ]"
              >
                <div
                  class="relative z-10 flex w-full items-start justify-between gap-3 p-4 lg:p-6"
                >
                  <h3
                    class="flex-1 font-bold text-white text-base lg:text-xl leading-snug drop-shadow"
                  >
                    {{ sub.name }}
                  </h3>
                  <Icon
                    name="material-symbols:arrow-forward"
                    class="mt-0.5 shrink-0 text-lg text-orange-400 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/10 transition-opacity duration-300"
                />
                <div
                  class="absolute inset-0 group-hover:bg-black/10 transition-colors duration-300"
                />
              </Trulink>

              <Trulink
                v-if="section.subcategories.length < 5"
:to="`/search?cat=${section.id}`"
                :class="
                  section.subcategories.length === 3
                    ? 'col-span-2 lg:col-span-2'
                    : 'col-span-1'
                "
                class="relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors border border-white"
              >
                <span class="text-white font-semibold text-sm lg:text-base">{{
                  $t("button.seeAll")
                }}</span>
                <Icon
                  name="material-symbols:arrow-forward"
                  class="text-white text-lg"
                />
              </Trulink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
        <div class="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">
              {{ $t("page.home.articles.title") }}
            </h2>
            <p class="text-gray-500 text-sm lg:text-base mt-1">
              {{ $t("page.home.articles.subtitle") }}
            </p>
          </div>
          <Trulink
            to="/article"
            class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            {{ $t("button.seeAll") }}
            <Icon name="material-symbols:arrow-forward" class="text-sm" />
          </Trulink>
        </div>

        <div
          v-if="loadingArticles"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div class="aspect-video bg-gray-200" />
            <div class="p-4 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-1/4" />
              <div class="h-4 bg-gray-200 rounded w-full" />
              <div class="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <Trulink
            v-for="article in latestArticles"
            :key="article.id"
            :to="`/article/${article.url}`"
            data-track-card="article"
            :data-track-id="String(article.id)"
            :data-track-title="article.title"
            class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div class="aspect-video overflow-hidden">
              <AppImage
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="100vw sm:50vw lg:33vw"
                width="600"
                height="338"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span
                  v-if="article.category"
                  class="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded"
                >
                  {{ article.category }}
                </span>
                <span class="text-xs text-gray-400">{{
                  formatDate(article.date)
                }}</span>
              </div>
              <h3
                class="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2"
              >
                {{ article.title }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2">
                {{ article.excerpt }}
              </p>
            </div>
          </Trulink>
        </div>
      </div>
    </section>

    <!-- <section
      class="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-orange-600"
    >
      <div class="container mx-auto px-4 lg:px-8 max-w-[1280px] text-center">
        <h2 class="text-2xl lg:text-3xl font-bold text-white mb-3">
          {{ $t("page.home.cta.title") }}
        </h2>
        <p class="text-white/90 text-sm lg:text-base mb-6 max-w-xl mx-auto">
          {{ $t("page.home.cta.subtitle") }}
        </p>
        <Trubutton
          :text="$t('page.home.cta.button')"
          type="success"
          size="large"
          variant="solid"
          icon="mdi:email"
          class="text-orange-500 hover:bg-gray-100 border-white"
          @click="navigateTo(`${urlTrumecs}/bulk`)"
        />
      </div>
    </section> -->
    <ScrapModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Promo } from "~/types/promo";
import type { CardArticle } from "~/types/article";
import { useProductTags } from "~/composables/useProductTags";

const config = useRuntimeConfig();
const urlTrumecs = config.public.info.linkTrumecsPhp;
const siteUrl = (config.public.siteUrl as string) || "https://www.trumecs.com";
const { t: $t } = useI18n();

// Aset statis (industries + banner) dilayani dari mirror lokal public/
// sebagai WebP; aset dinamis (produk/artikel/promo) tetap dari trumecs.com.
const { resolve: staticImg, srcset: staticImgSrcset } = useStaticImage();

const {
  loading: loadingTags,
  tags: industriTags,
  tagLabel,
  tagCount,
  load: loadTags,
} = useProductTags();

// Label tag mengikuti locale (id/en/zh)
const { locale } = useI18n();
const tagLabelByLocale = (tag: any): string => {
  if (!tag) return "";
  const lang = String(locale.value || "id").toLowerCase();
  if (lang === "en") return tag.tag_en || tag.tag || "";
  if (lang === "zh") return tag.tag_ch || tag.tag || "";
  return tag.tag || tag.tag_en || "";
};

// Prioritaskan data SSR, fallback ke data composable (client)
const industriesList = computed<any[]>(() => {
  const ssr = tagsData.value?.data?.payload;
  if (Array.isArray(ssr) && ssr.length > 0) return ssr;
  return industriTags.value || [];
});

// Gambar industri: file WebP hasil mirror (scripts/mirror-static-images.cjs)
// ada di public/tag/industries/, jadi dilayani lokal tanpa /_ipx/.
// Kalau file lokal hilang, markTagImgError() menampilkan icon sebagai ganti.
const TAG_IMG_SIZES = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 16vw";

usePageSeo({
  title: "Trumecs.com",
  description: $t("page.home.metaDescription"),
  url: "/",
});

useSchemaOrg([
  defineOrganization({
    name: "Trumecs",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/trumecs",
      "https://www.instagram.com/trumecs",
      "https://www.facebook.com/trumecsid",
      "https://www.youtube.com/@trumecs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-851-7691-2338",
      contactType: "sales",
      availableLanguage: ["Indonesian", "English"],
    },
  }),
  defineWebSite({
    name: "Trumecs.com",
    url: siteUrl,
  }),
]);

const currentSlide = ref(0);
const slides = computed(() => [
  {
    alt: "Power Supply Struman",
    link: `${siteUrl}/principal/struman`,
    image: staticImg("/public/banner/promo-home/banner-struman.png"),
    external: false,
  },
  {
    alt: "banner trumecs.com",
    link: `${siteUrl}/promo`,
    image: staticImg("/public/banner/home-mobile/6.png"),
    external: false,
  },
  {
    alt: "banner langkah",
    link: "",
    image: staticImg("/public/banner/home-mobile/7.png"),
    external: false,
  },
  {
    alt: "Scrap alat berat di trumecs.com",
    image: staticImg("/public/banner/promo-home/banner-scrap-utama.png"),
    external: false,
    scrap: true,
  },
  {
    alt: "Trumecs sudah bisa menggunakan kartu kredit",
    link: `${siteUrl}/article/pembayaran-transaksi-atau-invoice-dengan-kartu-kredit`,
    image: staticImg("/public/banner/promo-home/banner-cc.png"),
    external: false,
  },
]);

// Preload banner pertama agar tampil lebih cepat
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: slides.value[0]?.image,
      fetchpriority: "high",
    },
  ],
});

// SSR data fetching
const { data: categoriesData, pending: loadingCategories } = await useAsyncData(
  "home-categories",
  () => useFetchApi<any>("category-read", "home-categories", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

// Tag industri diambil di server supaya kartu (dan gambar-nya) sudah ada di
// HTML awal. Kalau ini hanya client-side, gambar baru mulai diunduh setelah
// JS selesai -> paling lama di mobile.
const { data: tagsData } = await useAsyncData(
  "home-tags",
  () => useFetchApi<any>("tags/read", "home-tags", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const { data: promosData, pending: loadingPromos } = await useAsyncData(
  "home-promos",
  () => useFetchApi<any>("promo-read", "home-promos", "get", null),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const { data: featuredGroupsData, pending: loadingFeatured } =
  await useAsyncData(
    "home-featured-groups",
    async () => {
      const apiFetch = async (endpoint: string, method: string, body: any) => {
        try {
          const res = await $fetch(`${config.public.baseURL}${endpoint}`, {
            method: method.toUpperCase() as any,
            body: body ?? undefined,
          });
          return { status: "success" as const, data: res, code: undefined };
        } catch (err: any) {
          return {
            status: "error" as const,
            data: null,
            code: err?.statusCode || err?.status,
          };
        }
      };

      const catRes = await apiFetch("category-read", "get", null);
      if (
        catRes.status !== "success" ||
        !catRes.data?.payload?.category?.products
      ) {
        return [];
      }

      const roots: any[] = catRes.data.payload.category.products;
      const lower = (s: any) => String(s || "").toLowerCase();
      // Pelumas & Ban dipaksa ke paling bawah, sisanya diacak
      const pinned = roots.filter((r) =>
        ["pelumas", "ban"].includes(lower(r.name))
      );
      const shuffled = [
        ...roots.filter((r) => !["pelumas", "ban"].includes(lower(r.name))),
      ];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const ordered = [...shuffled, ...pinned];

      const results = await Promise.all(
        ordered.map(async (root) => {
          const res = await apiFetch("product-search", "post", {
            page: 1,
            limit: 30,
            jenisproduct: root.name,
          });
          if (
            res.status === "success" &&
            Array.isArray(res.data?.payload) &&
            res.data.payload.length
          ) {
            return {
              id: root.id,
              name: root.name,
              url: root.url || root.name,
              products: pickRandom(res.data.payload, 5),
            };
          }
          return null;
        })
      );

      return results.filter(Boolean);
    },
    { default: () => [] }
  );

const { data: articlesData, pending: loadingArticles } = await useAsyncData(
  "home-articles",
  () =>
    useFetchApi<any>(
      "article-read?page=1&limit=6",
      "home-articles",
      "get",
      null
    ),
  { default: () => ({ status: "idle" as const, data: null, code: undefined }) }
);

const categories = computed(() => {
  const d = categoriesData.value;
  if (!d || d.status !== "success") return [];
  return d.data?.payload?.category?.products?.slice(0, 12) || [];
});

const promos = computed(() => {
  const d = promosData.value;
  if (!d || d.status !== "success") return [];
  return d.data?.payload || [];
});

const featuredGroups = computed(() => {
  const g = featuredGroupsData.value;
  return Array.isArray(g) ? (g as any[]) : [];
});

const latestArticles = computed(() => {
  const d = articlesData.value;
  if (!d || d.status !== "success") return [];
  const articles = d.data?.payload?.list_article || [];
  return articles.map((item: any) => ({
    id: item.id,
    url: item.url || `article-${item.id}`,
    title: item.title || "Untitled",
    image: item.img
      ? `${config.public.baseImageArticle}${item.img}`
      : "https://via.placeholder.com/400x250?text=No+Image",
    category: Array.isArray(item.tag) ? item.tag[0] : item.tag || "General",
    date: item.date,
    excerpt: item.discription_seo
      ? item.discription_seo.substring(0, 120)
      : item.value
        ? item.value.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
        : "",
  }));
});

// Kategori showcase diambil dari child kategori di API (diacak tiap load),
// pelumas & ban tetap di akhir
const showcaseBgNames = ["Pelumas", "Ban", "Sparepart", "Unit", "Tools"];
const showcaseTitleKeys: Record<string, string> = {
  Pelumas: "page.home.showcase.lubricants.title",
  Ban: "page.home.showcase.tires.title",
  Sparepart: "page.home.showcase.sparepart.title",
  Unit: "page.home.showcase.unit.title",
  Tools: "page.home.showcase.tools.title",
};

function pickRandom<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

const { data: showcaseData } = await useAsyncData(
  "home-showcase-groups",
  async () => {
    const apiFetch = async (endpoint: string, method: string, body: any) => {
      try {
        const res = await $fetch(`${config.public.baseURL}${endpoint}`, {
          method: method.toUpperCase() as any,
          body: body ?? undefined,
        });
        return { status: "success" as const, data: res, code: undefined };
      } catch (err: any) {
        return {
          status: "error" as const,
          data: null,
          code: err?.statusCode || err?.status,
        };
      }
    };

    const res = await apiFetch("category-read", "get", null);
    if (res.status !== "success" || !res.data?.payload?.category?.products) {
      return [];
    }

    const roots: any[] = res.data.payload.category.products;
    const lower = (s: any) => String(s || "").toLowerCase();
    const available = roots.filter((r) =>
      showcaseBgNames.some((name) => lower(name) === lower(r.name))
    );
    const pinned = available.filter((r) =>
      ["pelumas", "ban"].includes(lower(r.name))
    );
    const shuffled = available.filter(
      (r) => !["pelumas", "ban"].includes(lower(r.name))
    );
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const ordered = [...shuffled, ...pinned];

    return ordered.map((root) => {
      const children: any[] = Array.isArray(root.children) ? root.children : [];
      const name = String(root.name);
      const bg = showcaseBgNames.find((b) => lower(b) === lower(name))!;
      return {
        id: root.id,
        titleKey: showcaseTitleKeys[bg],
        url: root.url || name,
        bg: `${siteUrl}/public/landing/category/background/${bg}.png`,
        subcategories: pickRandom(children, 5).map((child) => ({
          id: child.id,
          name: child.name,
          url: child.url || child.name,
        })),
      };
    });
  },
  { default: () => [] }
);

const categoryShowcases = computed(() =>
  (showcaseData.value || []).map((sec: any) => ({
    ...sec,
    title: $t(sec.titleKey || ""),
    id: sec.id,
  }))
);

let slideInterval: ReturnType<typeof setInterval>;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const openScrapModal = () => {
  if (import.meta.client) {
    (window as any).openScrapModal?.();
  }
};

// Tag pembungkus tiap slide banner
const slideTag = (index: number) => {
  const slide = slides.value[index];
  if (!slide) return "div";
  if (slide.scrap) return "button";
  if (slide.link) return "a";
  return "div";
};

// Atribut pembungkus tiap slide banner
const slideAttrs = (index: number) => {
  const slide = slides.value[index];
  if (!slide) return {};
  if (slide.scrap) {
    return { type: "button" };
  }
  if (slide.link) {
    return {
      href: slide.link,
      target: "_blank",
      rel: "noopener",
    };
  }
  return {};
};

const isPromoEnded = (endDate: string) => {
  return new Date(endDate) < new Date();
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const stripHtml = (html: string | null) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").substring(0, 150);
};

const tagIconMap: Record<string, string> = {
  "2": "material-symbols:mining",
  "3": "material-symbols:agriculture",
  "4": "material-symbols:local_shipping",
  "5": "material-symbols:directions_boat",
  "6": "material-symbols:precision_manufacturing",
  "7": "material-symbols:lunch_dining",
  "8": "material-symbols:electrical_services",
};

const tagIcon = (tag: any): string => {
  if (!tag) return "material-symbols:label";
  const id = String(tag.id);
  if (tagIconMap[id]) return tagIconMap[id];
  const name = `${tag.tag || ""} ${tag.tag_en || ""}`.toLowerCase();
  if (name.includes("mining") || name.includes("pertambangan")) {
    return "material-symbols:mining";
  }
  if (name.includes("agriculture") || name.includes("agrikultur")) {
    return "material-symbols:agriculture";
  }
  if (name.includes("transportation") || name.includes("transportasi")) {
    return "material-symbols:local_shipping";
  }
  if (
    name.includes("shipping") ||
    name.includes("perkapalan") ||
    name.includes("boat")
  ) {
    return "material-symbols:directions_boat";
  }
  if (name.includes("manufacture") || name.includes("manufaktur")) {
    return "material-symbols:precision_manufacturing";
  }
  if (
    name.includes("beverage") ||
    name.includes("food") ||
    name.includes("makanan")
  ) {
    return "material-symbols:lunch_dining";
  }
  if (name.includes("power") || name.includes("listrik")) {
    return "material-symbols:electrical_services";
  }
  return "material-symbols:label";
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
};

// Kalau gambar industri gagal dimuat -> tampilkan Icon sebagai gantinya.
const failedTagImages = ref(new Set<string>());

const tagImgFailed = (tagId: string | number): boolean =>
  failedTagImages.value.has(String(tagId));

const markTagImgError = (tagId: string | number) => {
  const next = new Set(failedTagImages.value);
  next.add(String(tagId));
  failedTagImages.value = next;
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
  loadTags();
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
