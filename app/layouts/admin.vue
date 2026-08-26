<template>
  <div class="admin-layout min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Admin sidebar"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <NuxtLink to="/admin" class="flex items-center gap-2">
            <img
              src="https://migration.trumecs.com/logo/dark.png"
              alt="Trumecs Admin"
              class="h-8 w-auto"
            />
            <span class="font-bold text-xl text-gray-900 hidden sm:block">Admin</span>
          </NuxtLink>
          <button
            v-show="!isDesktop"
            @click="sidebarOpen = false"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Close sidebar"
          >
            <Icon name="material-symbols:close" class="h-5 w-5" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2" aria-label="Main navigation">
          <template v-for="group in navGroups" :key="group.label">
            <div class="px-3 py-2">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {{ $t(`admin.nav.${group.label}`) }}
              </h3>
            </div>
            <div class="space-y-1">
              <NuxtLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span>{{ $t(`admin.nav.${item.label}`) }}</span>
                <span
                  v-if="item.badge"
                  class="ml-auto px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </div>
          </template>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Icon name="material-symbols:admin-panel-settings" class="h-5 w-5 text-orange-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ adminStore.currentAdmin?.name || 'Admin' }}</p>
              <p class="text-xs text-gray-500 truncate">{{ adminStore.currentAdmin?.email || 'admin@trumecs.com' }}</p>
            </div>
            <button
              @click="showProfileMenu = !showProfileMenu"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              aria-label="Profile menu"
            >
              <Icon name="material-symbols:more-vert" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen && !isDesktop"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
      aria-hidden="true"
    ></div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <button
            v-show="!isDesktop"
            @click="sidebarOpen = true"
            class="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Open sidebar"
          >
            <Icon name="material-symbols:menu" class="h-6 w-6" />
          </button>

          <div class="flex-1 lg:flex-none">
            <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>

          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="notificationsOpen = !notificationsOpen"
                class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                aria-label="Notifications"
              >
                <Icon name="material-symbols:notifications" class="h-5 w-5" />
                <span
                  v-if="unreadNotifications > 0"
                  class="absolute top-0 right-0 h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center"
                >
                  {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                </span>
              </button>

              <div
                v-if="notificationsOpen"
                class="fixed right-4 top-20 z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
              >
                <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900">{{ $t('admin.notifications') }}</h3>
                  <button @click="markAllRead" class="text-sm text-orange-600 hover:underline">
                    {{ $t('admin.markAllRead') }}
                  </button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    :class="[
                      'px-4 py-3 border-b border-gray-100 hover:bg-gray-50',
                      !notif.read ? 'bg-blue-50' : ''
                    ]"
                  >
                    <p class="text-sm text-gray-900">{{ notif.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatRelativeTime(notif.createdAt) }}</p>
                  </div>
                  <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
                    {{ $t('admin.noNotifications') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile menu -->
            <div class="relative">
              <button
                @click="profileMenuOpen = !profileMenuOpen"
                class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Profile menu"
              >
                <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-orange-600">
                    {{ adminStore.currentAdmin?.name?.charAt(0).toUpperCase() || 'A' }}
                  </span>
                </div>
                <span class="hidden md:block text-sm font-medium text-gray-700">
                  {{ adminStore.currentAdmin?.name || 'Admin' }}
                </span>
                <Icon name="material-symbols:keyboard-arrow-down" class="h-5 w-5 text-gray-500" />
              </button>

              <div
                v-if="profileMenuOpen"
                class="fixed right-4 top-20 z-50 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
              >
                <NuxtLink
                  to="/admin/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {{ $t('admin.profile') }}
                </NuxtLink>
                <NuxtLink
                  to="/admin/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {{ $t('admin.settings') }}
                </NuxtLink>
                <hr class="my-2 border-gray-100" />
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  {{ $t('admin.logout') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <NuxtPage />
      </main>
    </div>

    <!-- Profile menu (mobile) -->
    <div
      v-if="showProfileMenu"
      class="fixed inset-0 z-50 lg:hidden"
      @click.self="showProfileMenu = false"
    >
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 sm:p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span class="text-lg font-medium text-orange-600">
              {{ adminStore.currentAdmin?.name?.charAt(0).toUpperCase() || 'A' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ adminStore.currentAdmin?.name || 'Admin' }}</p>
            <p class="text-sm text-gray-500">{{ adminStore.currentAdmin?.email || 'admin@trumecs.com' }}</p>
          </div>
        </div>
        <div class="space-y-2">
          <NuxtLink
            to="/admin/profile"
            class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {{ $t('admin.profile') }}
          </NuxtLink>
          <NuxtLink
            to="/admin/settings"
            class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {{ $t('admin.settings') }}
          </NuxtLink>
          <button
            @click="handleLogout"
            class="w-full px-4 py-3 text-red-600 hover:bg-gray-50 rounded-lg text-left"
          >
            {{ $t('admin.logout') }}
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminStore } from '~/stores/admin';

const route = useRoute();
const adminStore = useAdminStore();

const sidebarOpen = ref(false);
const notificationsOpen = ref(false);
const profileMenuOpen = ref(false);
const showProfileMenu = ref(false);
const isDesktop = ref(false);

const unreadNotifications = ref(3);

const notifications = ref([
  { id: 1, message: 'New member registered', createdAt: new Date(Date.now() - 1000 * 60 * 5), read: false },
  { id: 2, message: 'Order #TRM-2024-001 completed', createdAt: new Date(Date.now() - 1000 * 60 * 60), read: false },
  { id: 3, message: 'Product sync completed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), read: true },
]);

const formatRelativeTime = (date: Date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true);
  unreadNotifications.value = 0;
};

const handleLogout = async () => {
  await adminStore.logout();
  await navigateTo('/admin/login');
};

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/members': 'Member Management',
    '/admin/products': 'Product Management',
    '/admin/orders': 'Order Management',
    '/admin/promos': 'Promo Management',
    '/admin/articles': 'Article Management',
    '/admin/categories': 'Categories',
    '/admin/brands': 'Brands',
    '/admin/grades': 'Grades',
    '/admin/principals': 'Principals',
    '/admin/roles': 'Roles & Permissions',
    '/admin/settings': 'Settings',
  };
  return titles[route.path] || 'Admin';
});

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const navGroups = [
  {
    label: 'overview',
    items: [
      { path: '/admin', icon: 'material-symbols:dashboard', label: 'dashboard' },
    ],
  },
  {
    label: 'management',
    items: [
      { path: '/admin/members', icon: 'material-symbols:people', label: 'members' },
      { path: '/admin/products', icon: 'material-symbols:inventory-2', label: 'products' },
      { path: '/admin/orders', icon: 'material-symbols:shopping-cart', label: 'orders' },
      { path: '/admin/promos', icon: 'material-symbols:local-offer', label: 'promos' },
      { path: '/admin/articles', icon: 'material-symbols:article', label: 'articles' },
      { path: '/admin/principals', icon: 'material-symbols:business', label: 'principals' },
    ],
  },
  {
    label: 'catalog',
    items: [
      { path: '/admin/categories', icon: 'material-symbols:category', label: 'categories' },
      { path: '/admin/brands', icon: 'material-symbols:label', label: 'brands' },
      { path: '/admin/grades', icon: 'material-symbols:grade', label: 'grades' },
    ],
  },
  {
    label: 'system',
    items: [
      { path: '/admin/roles', icon: 'material-symbols:admin-panel-settings', label: 'roles' },
      { path: '/admin/settings', icon: 'material-symbols:settings', label: 'settings' },
    ],
  },
];

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener('resize', () => {
    isDesktop.value = window.innerWidth >= 1024;
    if (isDesktop.value) sidebarOpen.value = true;
  });
});
</script>
</template>