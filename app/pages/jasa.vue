<template>
  <div class="jasa-page py-4">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <Breadcrumbs :items="breadcrumbs" class="mb-4" />

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('jasa.title') }}</h1>
        <p class="mt-1 text-gray-600">{{ $t('jasa.subtitle') }}</p>
      </div>

      <!-- Service Categories -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NuxtLink
          v-for="cat in serviceCategories"
          :key="cat.id"
          :to="`/jasa/${cat.slug}`"
          class="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all text-center"
        >
          <div class="h-16 w-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <Icon :name="cat.icon" class="h-8 w-8 text-orange-500" />
          </div>
          <h3 class="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors mb-1">
            {{ cat.name }}
          </h3>
          <p class="text-sm text-gray-500">{{ cat.count }} {{ $t('jasa.providers') }}</p>
        </NuxtLink>
      </div>

      <!-- Featured Providers -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('jasa.featuredProviders') }}</h2>
          <NuxtLink to="/jasa/providers" class="text-sm text-orange-600 hover:underline">{{ $t('button.seeAll') }}</NuxtLink>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="provider in featuredProviders" :key="provider.id" class="px-6 py-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Icon :name="provider.icon" class="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ provider.name }}</h3>
                <p class="text-sm text-gray-500">{{ provider.category }} · {{ provider.location }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <Icon name="material-symbols:star" class="h-4 w-4 text-yellow-500" />
                  <span class="text-sm font-medium text-gray-700">{{ provider.rating }}</span>
                  <span class="text-xs text-gray-400">({{ provider.reviews }} ulasan)</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 sm:ml-4">
              <span class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {{ provider.status }}
              </span>
              <Trulink :to="`/jasa/provider/${provider.id}`" class="text-sm text-orange-600 hover:underline font-medium">
                {{ $t('jasa.viewProfile') }}
              </Trulink>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white">
        <h2 class="text-2xl lg:text-3xl font-bold mb-3">{{ $t('jasa.ctaTitle') }}</h2>
        <p class="text-white/90 mb-6 max-w-2xl mx-auto">{{ $t('jasa.ctaDesc') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Trubutton
            :text="$t('jasa.becomeProvider')"
            type="primary"
            variant="solid"
            size="large"
            class="bg-white text-orange-500 hover:bg-gray-100"
            @click="navigateToRegister"
          />
          <Trubutton
            :text="$t('jasa.requestService')"
            type="primary"
            variant="outline"
            size="large"
            class="border-white text-white hover:bg-white/10"
            @click="openRequestModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue';
import { useI18n } from 'vue-i18n';
import Breadcrumbs from '~/components/Breadcrumbs.vue';

const { t: $t } = useI18n();
const router = useRouter();

const breadcrumbs = computed(() => [
  { text: $t('breadcrumb.home'), to: '/' },
  { text: $t('jasa.title'), to: '/jasa' },
]);

const serviceCategories = [
  { id: 1, name: 'Perawatan Rutin', icon: 'material-symbols:build-circle', count: 45, slug: 'perawatan' },
  { id: 2, name: 'Perbaikan/Reparasi', icon: 'material-symbols:construction', count: 62, slug: 'perbaikan' },
  { id: 3, name: 'Inspeksi & Audit', icon: 'material-symbols:fact-check', count: 28, slug: 'inspeksi' },
  { id: 4, name: 'Pengujian/Testing', icon: 'material-symbols:science', count: 15, slug: 'pengujian' },
];

const featuredProviders = [
  { id: 1, name: 'Bengkel Mandiri Jaya', category: 'Perawatan & Reparasi', location: 'Jakarta', rating: 4.8, reviews: 124, status: 'Tersedia', icon: 'material-symbols:build' },
  { id: 2, name: 'Hydraulic Service Indonesia', category: 'Sistem Hidrolik', location: 'Bekasi', rating: 4.9, reviews: 89, status: 'Tersedia', icon: 'material-symbols:water-pump' },
  { id: 3, name: 'Engine Rebuild Center', category: 'Overhaul Mesin', location: 'Cikarang', rating: 4.7, reviews: 67, status: 'Sibuk', icon: 'material-symbols:engine' },
  { id: 4, name: 'Mobile Service Unit', category: 'Service Keliling', location: 'Jabodetabek', rating: 4.6, reviews: 203, status: 'Tersedia', icon: 'material-symbols:local-shipping' },
];

const navigateToRegister = () => {
  // Navigate to provider registration
  router.push('/member/register?role=provider');
};

const openRequestModal = () => {
  // Emit event to open request modal
  if (import.meta.client) {
    window.dispatchEvent(new CustomEvent('open-request-modal', { detail: { type: 'service' } }));
  }
};
</script>