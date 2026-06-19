<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
    <!-- Title -->
    <div class="mb-4">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">
        {{ product.tittle }}
        <span
          v-if="product.partnumber_trumecs"
          class="text-base lg:text-lg text-gray-500 font-normal block lg:inline"
        >
          ({{ product.partnumber_trumecs }})
        </span>
      </h1>
      <div v-if="product.partnumber" class="text-sm text-gray-500 mt-1">
        Part Number:
        <span class="font-medium text-gray-700">{{ product.partnumber }}</span>
      </div>
    </div>

    <!-- Price Section -->
    <div
      class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 lg:p-6 mb-6"
    >
      <div class="flex flex-wrap items-end gap-2">
        <div
          v-if="displayPrice"
          class="text-3xl lg:text-4xl font-bold text-orange-500"
        >
          Rp {{ formatPrice(displayPrice) }}
        </div>
        <div
          v-if="product.price_promo > 0"
          class="text-lg text-gray-400 line-through"
        >
          Rp {{ formatPrice(Number(product.price)) }}
        </div>
        <div
          v-if="product.price_promo > 0"
          class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          Hemat {{ discountPercent }}%
        </div>
      </div>
      <div class="text-sm text-gray-600 mt-2">
        <span class="font-medium">Unit:</span> {{ product.unit }}
      </div>
      <div v-if="product.moq > 0" class="text-sm text-gray-600">
        <span class="font-medium">Minimal Pembelian:</span> {{ product.moq }}
        {{ product.unit }}
      </div>
    </div>

    <!-- Stock & Status -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <div class="text-sm text-gray-500">Stok</div>
        <div
          class="text-lg font-bold"
          :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ product.stock > 0 ? product.stock : "Habis" }}
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg p-3 text-center">
        <div class="text-sm text-gray-500">Berat</div>
        <div class="text-lg font-bold text-gray-700">
          {{ product.weight || "-" }} kg
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          :href="whatsappLink"
          target="_blank"
          class="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:shadow-lg"
        >
          <Icon name="logos:whatsapp-icon" class="text-xl" />
          Beli via WhatsApp
        </a>
        <a
          :href="emailLink"
          class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:shadow-lg"
        >
          <Icon name="mdi:email" class="text-xl" />
          Email Inquiry
        </a>
      </div>
      <button
        @click="showContactInfo = !showContactInfo"
        class="w-full flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 px-4 rounded-lg transition-all"
      >
        <Icon name="mdi:phone" class="text-xl" />
        Hubungi Kami
      </button>
    </div>

    <!-- Contact Info Expand -->
    <div
      v-if="showContactInfo"
      class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn"
    >
      <div class="space-y-2">
        <a :href="platformContact('phoneLink')" target="_blank">
          <div class="flex items-center gap-2">
            <Icon name="mdi:phone" class="text-orange-500" />
            <span>{{ platformContact("phone") }}</span>
          </div>
        </a>
        <a :href="platformContact('emailLink')" target="_blank">
          <div class="flex items-center gap-2">
            <Icon name="mdi:email" class="text-orange-500" />
            <span>{{ platformContact("email") }}</span>
          </div>
        </a>
        <a :href="platformContact('linkWhatsapp')" target="_blank">
          <div class="flex items-center gap-2">
            <Icon name="logos:whatsapp-icon" class="text-xl" />
            <span>{{ platformContact("whatsapp") }}</span>
          </div>
        </a>
      </div>
    </div>

    <!-- Quick Info -->
    <div class="mt-6 pt-6 border-t border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div class="flex items-center gap-2 text-gray-600">
          <Icon name="mdi:package-variant" class="text-orange-500" />
          <span>Kemasan: {{ product.packagin || "-" }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <Icon name="mdi:map-marker" class="text-orange-500" />
          <span>Lokasi: {{ product.area || product.availability_at }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <Icon name="mdi:clock" class="text-orange-500" />
          <span
            >Estimasi Pengiriman:
            {{ product.estimated_delivery || "-" }} hari</span
          >
        </div>
      </div>
    </div>

    <!-- Share Buttons -->
    <div class="mt-6 pt-6 border-t border-gray-100">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-sm text-gray-500">Bagikan:</span>
        <button
          v-for="share in shareButtons"
          :key="share.name"
          @click="shareProduct(share)"
          class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Icon :name="share.icon" class="text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/types/product";

const props = defineProps<{
  product: Product;
  breadcrumbItems?: Array<{ name: string; url: string | null }>;
}>();

const showContactInfo = ref(false);

const displayPrice = computed(() => {
  const promo = Number(props.product.price_promo || 0);
  return promo > 0 ? promo : Number(props.product.price || 0);
});

const discountPercent = computed(() => {
  if (props.product.price_promo > 0 && Number(props.product.price) > 0) {
    return Math.round(
      ((Number(props.product.price) - Number(props.product.price_promo)) /
        Number(props.product.price)) *
        100
    );
  }
  return 0;
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const whatsappLink = computed(() => {
  const message = `Hi Trumecs, saya tertarik dengan ${props.product.tittle}. Apakah barang ini tersedia?`;
  const phone = "6285176912338";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});

const emailLink = computed(() => {
  const subject = props.product.tittle;
  const body = `Hi Trumecs, saya tertarik dengan ${props.product.tittle}. \n\nApakah barang ini tersedia?`;
  return `mailto:info@trumecs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const platformContact = (type: string) => {
  const message = `Hi Trumecs, saya tertarik dengan ${props.product.tittle}. Apakah barang ini tersedia?`;
  const phone = "6285176912338";
  const subject = props.product.tittle;
  const body = `Hi Trumecs, saya tertarik dengan ${props.product.tittle}. \n\nApakah barang ini tersedia?`;
  const mail = "info@trumecs.com";
  const contacts = {
    phone: "+62 851-7691-2338",
    phoneLink: `tel:${phone}`,
    email: `${mail}`,
    emailLink: `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    whatsapp: "+62 851-7691-2338",
    linkWhatsapp: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  };
  return contacts[type as keyof typeof contacts] || "";
};

const shareButtons = [
  { name: "facebook", icon: "logos:facebook" },
  { name: "twitter", icon: "skill-icons:twitter" },
  { name: "linkedin", icon: "logos:linkedin-icon" },
  { name: "whatsapp", icon: "logos:whatsapp-icon" },
];

const shareProduct = (share: any) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(props.product.tittle || "");
  const shareUrls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}%20${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${title}%20-%20${url}`,
  };
  window.open(shareUrls[share.name], "_blank", "width=600,height=400");
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
