<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <!-- Main Image with Zoom -->
    <div
      class="relative bg-gray-50 rounded-lg overflow-hidden aspect-square mb-4 group"
    >
      <img
        :src="mainImage.url"
        :alt="product.tittle"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
        @click="openLightbox(selectedImage)"
        loading="eager"
      />

      <!-- Zoom Icon -->
      <button
        @click.stop="openLightbox(selectedImage)"
        class="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all hover:shadow-lg z-20"
        aria-label="Zoom image"
      >
        <Icon name="mdi:magnify-plus" class="text-xl" />
      </button>

      <!-- Stock Badge -->
      <div v-if="product.stock < 0" class="absolute top-4 left-4 z-10">
        <span
          class="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Habis
        </span>
      </div>

      <!-- Promo Badge -->
      <div
        v-if="Number(product.price_promo) > 0"
        class="absolute top-4 right-4 z-10"
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
        class="absolute bottom-20 left-4 z-10"
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
        class="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10"
      >
        {{ selectedImage + 1 }} / {{ allImages.length }}
      </div>

      <!-- ===== MOBILE NAVIGATION ARROWS ===== -->
      <button
        v-if="isMobile && allImages.length > 1"
        @click.stop="prevImageMobile"
        class="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Previous image"
      >
        <Icon name="mdi:chevron-left" class="text-2xl" />
      </button>

      <button
        v-if="isMobile && allImages.length > 1"
        @click.stop="nextImageMobile"
        class="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Next image"
      >
        <Icon name="mdi:chevron-right" class="text-2xl" />
      </button>
    </div>

    <!-- ===== THUMBNAIL / INDICATOR SECTION ===== -->
    <div class="relative">
      <!-- Desktop: Thumbnail dengan scroll -->
      <div v-if="!isMobile" class="relative">
        <button
          v-if="allImages.length > 4"
          @click="scrollThumbnails('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all hover:scale-110 active:scale-95"
          aria-label="Scroll thumbnails left"
        >
          <Icon name="mdi:chevron-left" class="text-lg" />
        </button>

        <button
          v-if="allImages.length > 4"
          @click="scrollThumbnails('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all hover:scale-110 active:scale-95"
          aria-label="Scroll thumbnails right"
        >
          <Icon name="mdi:chevron-right" class="text-lg" />
        </button>

        <div
          ref="thumbnailContainer"
          class="flex gap-2 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
          style="scrollbar-width: none; -ms-overflow-style: none"
        >
          <div
            v-for="(img, index) in allImages"
            :key="index"
            class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:shadow-md hover:scale-105"
            :class="
              selectedImage === index
                ? 'border-orange-500 shadow-md scale-105'
                : 'border-gray-200 hover:border-gray-400'
            "
            @click="selectImage(index)"
          >
            <img
              :src="img.thumbnail"
              :alt="`${product.tittle} - Gambar ${index + 1}`"
              class="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <!-- Mobile: Dot Indicators (hanya indikator, tidak bisa diklik) -->
      <div v-else class="flex justify-center gap-2 mt-4">
        <span
          v-for="(img, index) in allImages"
          :key="index"
          class="transition-all duration-300 rounded-full block"
          :class="
            selectedImage === index
              ? 'w-3 h-3 bg-orange-500 scale-110 shadow-sm'
              : 'w-2.5 h-2.5 bg-gray-300'
          "
          :aria-label="`Image ${index + 1} of ${allImages.length}`"
          :aria-current="selectedImage === index ? 'true' : 'false'"
        />
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        @click="closeLightbox"
        @keydown.escape="closeLightbox"
      >
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl transition-colors z-10"
          aria-label="Close lightbox"
        >
          ×
        </button>

        <button
          @click="prevImage"
          class="absolute left-4 text-white hover:text-gray-300 text-4xl transition-colors z-10"
          aria-label="Previous image"
        >
          ‹
        </button>

        <button
          @click="nextImage"
          class="absolute right-4 text-white hover:text-gray-300 text-4xl transition-colors z-10"
          aria-label="Next image"
        >
          ›
        </button>

        <img
          :src="lightboxImage.url"
          :alt="product.tittle"
          class="max-w-full max-h-[90vh] object-contain select-none"
          @click.stop
          draggable="false"
        />

        <div
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm"
        >
          {{ lightboxIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import type { Product } from "~/types/product";

// ============ PROPS & EMITS ============
const props = defineProps<{
  product: Product;
}>();

// ============ STATE ============
const selectedImage = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const thumbnailContainer = ref<HTMLDivElement | null>(null);

// ============ SCREEN DETECTION ============
const { higherThan } = useScreen();

// Computed untuk deteksi mobile (lebih efisien)
const isMobile = computed(() => {
  return !higherThan("md");
});

// Debug: Log untuk memastikan isMobile berfungsi
watch(isMobile, (newVal) => {
  console.log("isMobile changed:", newVal);
});

// ============ IMAGE HELPERS ============
interface ImageObject {
  filename: string;
  url: string;
  thumbnail: string;
  isMain: boolean;
  isGallery: boolean;
}

const getImageUrl = (filename: string, isGallery: boolean = false) => {
  if (!filename) return "/public/image/product/noimage.png";

  const basePath = isGallery
    ? "https://www.trumecs.com/public/image/galery"
    : "https://www.trumecs.com/public/image/product";

  if (filename.startsWith("http") || filename.startsWith("/")) {
    return filename;
  }

  return `${basePath}/${filename}`;
};

const getThumbnailUrl = (filename: string, isGallery: boolean = false) => {
  if (!filename)
    return "https://www.trumecs.com/public/image/product/noimage.png";

  const fullUrl = getImageUrl(filename, isGallery);
  return `https://www.trumecs.com/timthumb?w=80&h=80&src=${fullUrl}`;
};

// ============ COMPUTED ============
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

// ============ METHODS ============
const selectImage = (index: number) => {
  selectedImage.value = index;

  // Scroll thumbnail into view (hanya di desktop)
  if (!isMobile.value && thumbnailContainer.value) {
    nextTick(() => {
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
    });
  }
};

// ===== MOBILE NAVIGATION =====
const prevImageMobile = () => {
  console.log("prevImageMobile clicked", allImages.value.length);
  if (allImages.value.length === 0) return;
  selectedImage.value =
    (selectedImage.value - 1 + allImages.value.length) % allImages.value.length;
  console.log("selectedImage:", selectedImage.value);
};

const nextImageMobile = () => {
  console.log("nextImageMobile clicked", allImages.value.length);
  if (allImages.value.length === 0) return;
  selectedImage.value = (selectedImage.value + 1) % allImages.value.length;
  console.log("selectedImage:", selectedImage.value);
};

// ===== DESKTOP SCROLL =====
const scrollThumbnails = (direction: "left" | "right") => {
  if (isMobile.value || !thumbnailContainer.value) return;

  const container = thumbnailContainer.value;
  const scrollAmount = 120;
  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};

// ===== LIGHTBOX =====
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

// ============ WATCHERS ============
watch(
  () => props.product,
  () => {
    selectedImage.value = 0;
  },
  { deep: true }
);

// ============ KEYBOARD EVENTS ============
const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return;

  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      e.preventDefault();
      prevImage();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextImage();
      break;
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  if (lightboxOpen.value) {
    document.body.style.overflow = "";
  }
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

/* Touch feedback untuk mobile */
.touch-manipulation {
  touch-action: manipulation;
}

/* Animasi smooth untuk dot indicators */
span {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent image selection */
img {
  -webkit-user-drag: none;
  user-select: none;
}

/* Mobile arrow buttons - tambahkan shadow lebih besar */
@media (max-width: 768px) {
  button {
    touch-action: manipulation;
  }
}

/* Debug: Tampilkan border untuk melihat posisi arrow */
/* .absolute.left-2 {
  border: 2px solid red;
}
.absolute.right-2 {
  border: 2px solid blue;
} */
</style>
