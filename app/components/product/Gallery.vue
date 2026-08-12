<template>
  <div class="bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-100">
    <!-- Main Image with Zoom -->
    <div
      ref="imageContainer"
      class="relative bg-gray-50 lg:rounded-lg overflow-hidden aspect-square mb-0 group touch-manipulation"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <img
        :src="mainImage.url"
        :alt="product.tittle"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
        @click="openLightbox(selectedImage)"
        loading="eager"
        draggable="false"
      />

      <!-- Swipe Indicator (Optional) -->
      <div
        v-if="isMobile && allImages.length > 1 && showSwipeHint"
        class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-swipe-hint"
      >
        <div
          class="bg-black/40 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm"
        >
          <Icon name="mdi:gesture-swipe" class="text-lg" />
          {{ $t("page.product.text.swipe") }}
        </div>
      </div>

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
          {{ $t("page.product.text.sold") }}
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
          🔥 {{ $t("page.product.text.promo") }}
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
          {{ $t("page.product.text.used") }}
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

      <!-- Mobile: Dot Indicators -->
      <div v-else class="flex justify-center gap-2 mt-1">
        <span
          v-for="(img, index) in allImages"
          :key="index"
          class="transition-all duration-300 rounded-full block cursor-pointer"
          :class="
            selectedImage === index
              ? 'w-3 h-3 bg-orange-500 scale-110 shadow-sm'
              : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
          "
          @click="selectImage(index)"
          :aria-label="`Go to image ${index + 1}`"
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
const imageContainer = ref<HTMLElement | null>(null);

// ============ SWIPE STATE ============
const touchStartX = ref(0);
const touchEndX = ref(0);
const touchStartY = ref(0);
const touchEndY = ref(0);
const isSwiping = ref(false);
const showSwipeHint = ref(true);

// ============ SCREEN DETECTION ============
const { higherThan } = useScreen();

const isMobile = computed(() => {
  return !higherThan("md");
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

  if (props.product.img) {
    images.push({
      filename: props.product.img,
      url: getImageUrl(props.product.img, false),
      thumbnail: getThumbnailUrl(props.product.img, false),
      isMain: true,
      isGallery: false,
    });
  }

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

// ============ SWIPE HANDLERS ============
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  isSwiping.value = true;

  // Sembunyikan hint saat user mulai swipe
  if (showSwipeHint.value) {
    showSwipeHint.value = false;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value || allImages.value.length <= 1) return;

  touchEndX.value = e.touches[0].clientX;
  touchEndY.value = e.touches[0].clientY;

  // Hitung perbedaan
  const diffX = touchStartX.value - touchEndX.value;
  const diffY = touchStartY.value - touchEndY.value;

  // Cegah scroll vertical saat swipe horizontal
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    e.preventDefault();
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || allImages.value.length <= 1) {
    isSwiping.value = false;
    return;
  }

  const diffX = touchStartX.value - touchEndX.value;
  const diffY = touchStartY.value - touchEndY.value;

  // Minimal swipe distance 50px
  const minSwipeDistance = 50;

  // Cek apakah swipe horizontal (lebih dominan dari vertical)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
    if (diffX > 0) {
      // Swipe kiri → next image
      nextImageMobile();
    } else {
      // Swipe kanan → prev image
      prevImageMobile();
    }
  }

  isSwiping.value = false;
  touchStartX.value = 0;
  touchEndX.value = 0;
  touchStartY.value = 0;
  touchEndY.value = 0;
};

// ============ METHODS ============
const selectImage = (index: number) => {
  selectedImage.value = index;

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

const prevImageMobile = () => {
  if (allImages.value.length === 0) return;
  selectedImage.value =
    (selectedImage.value - 1 + allImages.value.length) % allImages.value.length;
};

const nextImageMobile = () => {
  if (allImages.value.length === 0) return;
  selectedImage.value = (selectedImage.value + 1) % allImages.value.length;
};

const scrollThumbnails = (direction: "left" | "right") => {
  if (isMobile.value || !thumbnailContainer.value) return;

  const container = thumbnailContainer.value;
  const scrollAmount = 120;
  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
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

// ============ LIFECYCLE ============
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);

  // Sembunyikan swipe hint setelah 3 detik
  setTimeout(() => {
    showSwipeHint.value = false;
  }, 3000);
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
  touch-action: pan-y; /* Izinkan vertical scroll tapi tangani horizontal */
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

/* Mobile arrow buttons */
@media (max-width: 768px) {
  button {
    touch-action: manipulation;
  }
}

/* Swipe Hint Animation */
@keyframes swipeHint {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  20% {
    opacity: 1;
    transform: translateX(0);
  }
  40% {
    transform: translateX(0);
  }
  60% {
    transform: translateX(0);
  }
  80% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(20px);
  }
}

.animate-swipe-hint {
  animation: swipeHint 2.5s ease-in-out forwards;
}

/* Swipe indicator style */
.animate-swipe-hint .bg-black\/40 {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
