<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/member/dashboard" class="flex-shrink-0">
              <img
                src="https://migration.trumecs.com/logo/dark.png"
                alt="Trumecs"
                class="h-10 w-auto"
              />
            </NuxtLink>
            <div class="hidden md:ml-8 md:flex md:space-x-4">
              <NuxtLink
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                class="text-sm font-medium text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md transition-colors"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="notificationsOpen = !notificationsOpen"
                class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="material-symbols:notifications" class="h-5 w-5" />
                <span v-if="unreadCount > 0" class="absolute top-0 right-0 h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <Teleport to="body">
                <div
                  v-if="notificationsOpen"
                  class="fixed inset-0 z-50"
                  @click.self="notificationsOpen = false"
                >
                  <div class="absolute right-4 top-20 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 class="font-semibold text-gray-900">{{ $t('member.notifications') }}</h3>
                      <button
                        @click="markAllRead"
                        class="text-sm text-orange-600 hover:underline"
                      >
                        {{ $t('member.markAllRead') }}
                      </button>
                    </div>
                    <div class="max-h-96 overflow-y-auto">
                      <div
                        v-for="notif in notifications"
                        :key="notif.id"
                        :class="[
                          'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors',
                          !notif.read ? 'bg-blue-50' : ''
                        ]"
                      >
                        <p class="text-sm text-gray-900">{{ notif.message }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatRelativeTime(notif.createdAt) }}</p>
                      </div>
                      <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
                        {{ $t('member.noNotifications') }}
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
            </div>

            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
                  {{ authStore.userInitials }}
                </div>
                <span class="hidden md:block text-sm font-medium text-gray-700">
                  {{ authStore.userName }}
                </span>
                <Icon name="material-symbols:keyboard-arrow-down" class="h-5 w-5 text-gray-500" />
              </button>

              <Teleport to="body">
                <div
                  v-if="userMenuOpen"
                  class="fixed inset-0 z-50"
                  @click.self="userMenuOpen = false"
                >
                  <div class="absolute right-4 top-20 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div class="px-4 py-3 border-b border-gray-200">
                      <p class="font-medium text-gray-900">{{ authStore.userName }}</p>
                      <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                    </div>
                    <NuxtLink
                      to="/member/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {{ $t('member.profile') }}
                    </NuxtLink>
                    <NuxtLink
                      to="/member/dashboard"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {{ $t('member.dashboard') }}
                    </NuxtLink>
                    <hr class="my-2 border-gray-100" />
                    <button
                      @click="handleLogout"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      {{ $t('member.logout') }}
                    </button>
                  </div>
                </div>
              </Teleport>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-64 flex-shrink-0">
          <nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <ul class="space-y-1">
              <li v-for="item in sideNavItems" :key="item.path">
                <NuxtLink
                  :to="item.path"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="[
                    $route.path.startsWith(item.path)
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <Icon :name="item.icon" class="h-5 w-5" />
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="flex-1 min-w-0">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const notificationsOpen = ref(false);
const userMenuOpen = ref(false);
const unreadCount = ref(3);

const notifications = ref([
  { id: 1, message: 'RFQ Anda telah mendapat penawaran baru', createdAt: new Date(Date.now() - 1000 * 60 * 30), read: false },
  { id: 2, message: 'Pesanan #TRM-2024-001 telah dikirim', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false },
  { id: 3, message: 'Verifikasi email berhasil', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true },
]);

const formatRelativeTime = (date: Date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${days} hari yang lalu`;
};

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true);
  unreadCount.value = 0;
};

const navItems = computed(() => [
  { path: '/member/dashboard', label: 'Dashboard' },
  { path: '/member/rfq', label: 'RFQ' },
  { path: '/member/orders', label: 'Pesanan' },
]);

const sideNavItems = computed(() => [
  { path: '/member/dashboard', label: 'Ringkasan', icon: 'material-symbols:dashboard' },
  { path: '/member/profile', label: 'Profil', icon: 'material-symbols:person' },
  { path: '/member/rfq', label: 'RFQ Saya', icon: 'material-symbols:assignment' },
  { path: '/member/orders', label: 'Pesanan', icon: 'material-symbols:shopping-bag' },
  { path: '/member/notifications', label: 'Notifikasi', icon: 'material-symbols:notifications' },
  { path: '/member/chat', label: 'Chat', icon: 'material-symbols:chat' },
  { path: '/member/store', label: 'Toko Saya', icon: 'material-symbols:store' },
]);

const handleLogout = async () => {
  await authStore.logout();
  await navigateTo('/member/login');
};
</script>