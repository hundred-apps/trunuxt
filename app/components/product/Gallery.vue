<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <!-- Main Image with Zoom -->
    <div
      class="relative bg-gray-50 rounded-lg overflow-hidden aspect-square mb-4 group"
    >
      <img
        :src="mainImage.url"
        :alt="product.tittle"
        class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
        @click="openLightbox(selectedImage)"
      />

      <!-- Zoom Icon -->
      <button
        @click="openLightbox(selectedImage)"
        class="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all hover:shadow-lg"
      >
        <Icon name="mdi:magnify-plus" class="text-xl" />
      </button>

      <!-- Stock Badge -->
      <div v-if="product.stock > 0" class="absolute top-4 left-4">
        <span
          class="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
        >
          <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Tersedia
        </span>
      </div>
      <div v-else class="absolute top-4 left-4">
        <span
          class="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Habis
        </span>
      </div>

      <!-- Promo Badge -->
      <div
        v-if="Number(product.price_promo) > 0"
        class="absolute top-4 right-4"
      >
        <span
          class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse"
        >
          🔥 PROMO
        </span>
      </div>

      <!-- Product Condition Badge -->
      <div
        v-if="product.physicnumber && product.physicnumber.includes('S/N')"
        class="absolute bottom-20 left-4"
      >
        <span
          class="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Bekas
        </span>
      </div>

      <!-- Image Counter -->
      <div
        v-if="allImages.length > 1"
        class="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded"
      >
        {{ selectedImage + 1 }} / {{ allImages.length }}
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    <div class="relative">
      <!-- Scroll Buttons -->
      <button
        v-if="allImages.length > 4"
        @click="scrollThumbnails('left')"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all"
      >
        <Icon name="mdi:chevron-left" class="text-lg" />
      </button>

      <button
        v-if="allImages.length > 4"
        @click="scrollThumbnails('right')"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all"
      >
        <Icon name="mdi:chevron-right" class="text-lg" />
      </button>

      <!-- Thumbnails -->
      <div
        ref="thumbnailContainer"
        class="flex gap-2 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <div
          v-for="(img, index) in allImages"
          :key="index"
          class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:shadow-md"
          :class="
            selectedImage === index
              ? 'border-orange-500 shadow-md'
              : 'border-gray-200 hover:border-gray-400'
          "
          @click="selectImage(index)"
        >
          <img
            :src="img.thumbnail"
            :alt="`${product.tittle} - Gambar ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl transition-colors"
      >
        ×
      </button>

      <button
        @click="prevImage"
        class="absolute left-4 text-white hover:text-gray-300 text-4xl transition-colors"
      >
        ‹
      </button>

      <button
        @click="nextImage"
        class="absolute right-4 text-white hover:text-gray-300 text-4xl transition-colors"
      >
        ›
      </button>

      <img
        :src="lightboxImage.url"
        :alt="product.tittle"
        class="max-w-full max-h-[90vh] object-contain"
        @click.stop
      />

      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm"
      >
        {{ lightboxIndex + 1 }} / {{ allImages.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{
  product: Product;
}>();

const selectedImage = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const thumbnailContainer = ref<HTMLDivElement | null>(null);

// Interface untuk image object
interface ImageObject {
  filename: string;
  url: string;
  thumbnail: string;
  isMain: boolean;
  isGallery: boolean;
}

// Fungsi untuk mendapatkan URL gambar
const getImageUrl = (filename: string, isGallery: boolean = false) => {
  if (!filename) return "/public/image/product/noimage.png";

  // Base path untuk gambar
  const basePath = isGallery
    ? "https://www.trumecs.com/public/image/galery"
    : "https://www.trumecs.com/public/image/product";

  // Cek apakah filename sudah memiliki path lengkap
  if (filename.startsWith("http") || filename.startsWith("/")) {
    return filename;
  }

  return `${basePath}/${filename}`;
};

// Fungsi untuk mendapatkan thumbnail URL
const getThumbnailUrl = (filename: string, isGallery: boolean = false) => {
  if (!filename)
    return "https://www.trumecs.com/public/image/product/noimage.png";

  // Gunakan timthumb untuk thumbnail
  const fullUrl = getImageUrl(filename, isGallery);
  return `https://www.trumecs.com/timthumb?w=80&h=80&src=${fullUrl}`;
};

// Get all images from product and gallery
const allImages = computed<ImageObject[]>(() => {
  const images: ImageObject[] = [];

  // Add main image
  if (props.product.img) {
    images.push({
      filename: props.product.img,
      url: getImageUrl(props.product.img, false),
      thumbnail: getThumbnailUrl(props.product.img, false),
      isMain: true,
      isGallery: false,
    });
  }

  // Add gallery images
  if (props.product.gallery_img && Array.isArray(props.product.gallery_img)) {
    props.product.gallery_img.forEach((item) => {
      if (item.img) {
        images.push({
          filename: item.img,
          url: getImageUrl(item.img, true),
          thumbnail: getThumbnailUrl(item.img, true),
          isMain: false,
          isGallery: true,
        });
      }
    });
  }

  // If no images, add placeholder
  if (images.length === 0) {
    images.push({
      filename: "noimage.png",
      url: "https://www.trumecs.com/public/image/product/noimage.png",
      thumbnail: "https://www.trumecs.com/public/image/product/noimage.png",
      isMain: true,
      isGallery: false,
    });
  }

  return images;
});

const mainImage = computed(() => {
  return allImages.value[selectedImage.value] || allImages.value[0];
});

const lightboxImage = computed(() => {
  return allImages.value[lightboxIndex.value] || allImages.value[0];
});

const selectImage = (index: number) => {
  selectedImage.value = index;
  // Scroll thumbnail into view
  const container = thumbnailContainer.value;
  if (container) {
    const thumbnails = container.children;
    if (thumbnails[index]) {
      (thumbnails[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
};

const scrollThumbnails = (direction: "left" | "right") => {
  const container = thumbnailContainer.value;
  if (container) {
    const scrollAmount = 120;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
};

const prevImage = () => {
  lightboxIndex.value =
    (lightboxIndex.value - 1 + allImages.value.length) % allImages.value.length;
};

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % allImages.value.length;
};

// Keyboard navigation
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (!lightboxOpen.value) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
