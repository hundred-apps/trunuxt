<template>
  <nav
    :class="[
      'navbar fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-white border-gray-200',
      'border-b shadow-sm',
    ]"
  >
    <!-- Mobile Top Bar -->
    <div class="lg:hidden flex items-center justify-between px-4 py-3">
      <div class="flex gap-2 items-center">
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="w-[24px] h-[24px]"
        >
          <Icon name="material-symbols:menu" class="text-2xl text-gray-700" />
        </button>

        <Trulink to="/">
          <img
            src="https://migration.trumecs.com/logo/light.png"
            alt="logo trumecs"
            class="h-8"
          />
        </Trulink>
      </div>

      <div class="flex items-center gap-1">
        <button @click="showMobileSearch = true" class="p-2">
          <Icon name="material-symbols:search" class="text-xl text-gray-700" />
        </button>

        <Trulink to="/" class="relative p-2">
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
          <Icon
            name="material-symbols:notifications-outline"
            class="text-xl text-gray-700"
          />
        </Trulink>
      </div>
    </div>

    <!-- Desktop Navbar -->
    <div class="hidden lg:block">
      <div class="container mx-auto px-4 py-3">
        <!-- Top Row -->
        <div class="flex items-center justify-between mb-3">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <Trulink to="/">
              <img
                src="https://migration.trumecs.com/logo/light.png"
                alt="logo trumecs"
                class="h-10"
              />
            </Trulink>
          </div>

          <!-- Search Section -->
          <div class="flex-grow mx-6 max-w-2xl">
            <div class="flex items-center justify-center gap-4 w-full">
              <div class="flex-grow">
                <form @submit.prevent="handleSearch" class="flex">
                  <el-input
                    v-model="searchQuery"
                    class="flex-grow"
                    :placeholder="searchPlaceholder"
                    @keyup.enter="handleSearch"
                  >
                    <template #append>
                      <el-button
                        type="primary"
                        native-type="submit"
                        class="bg-orange-500"
                      >
                        <Icon name="material-symbols:search" class="text-lg" />
                      </el-button>
                    </template>
                  </el-input>
                </form>
              </div>

              <div class="flex-shrink-0 hidden xl:block">
                <p class="mb-0 text-sm text-gray-500">
                  <small><strong>atau</strong></small>
                </p>
              </div>

              <div class="flex-shrink-0 min-w-[160px] hidden xl:block">
                <Trulink
                  to="/bulk"
                  class="el-button el-button--primary w-full py-2 flex items-center justify-center"
                >
                  Infokan Kebutuhanmu
                </Trulink>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex-shrink-0">
            <div class="flex items-center gap-4">
              <!-- Desktop User Actions -->
              <div class="flex items-center gap-4">
                <!-- <SwitcherTheme />
                <SwitcherLang /> -->

                <!-- Cart -->
                <Trulink to="/" class="relative">
                  <span
                    v-if="cartCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {{ cartCount }}
                  </span>
                  <Icon
                    name="material-symbols:shopping-cart"
                    class="text-xl text-gray-700 hover:text-gray-900"
                  />
                </Trulink>

                <!-- User Menu -->
                <template v-if="isLoggedIn">
                  <!-- Notification -->
                  <Trulink to="/" class="relative">
                    <span
                      v-if="unreadNotifications > 0"
                      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {{ unreadNotifications }}
                    </span>
                    <Icon
                      name="material-symbols:notifications"
                      class="text-xl text-gray-700 hover:text-gray-900"
                    />
                  </Trulink>

                  <!-- Chat -->
                  <Trulink to="/" class="relative">
                    <span
                      v-if="unreadChats > 0"
                      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {{ unreadChats }}
                    </span>
                    <Icon
                      name="material-symbols:chat"
                      class="text-xl text-gray-700 hover:text-gray-900"
                    />
                  </Trulink>

                  <!-- User Dropdown -->
                  <el-dropdown
                    trigger="click"
                    placement="bottom-end"
                    @command="handleDropdownCommand"
                  >
                    <span
                      class="el-dropdown-link cursor-pointer flex items-center gap-2"
                    >
                      <el-avatar
                        :size="36"
                        :src="userAvatar"
                        class="border-2 border-gray-200"
                      />
                      <Icon
                        name="material-symbols:keyboard-arrow-down"
                        class="transition-transform duration-200 text-gray-600"
                        :class="[
                          'text-lg',
                          dropdownVisible ? 'rotate-180' : '',
                        ]"
                      />
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu class="min-w-[280px]">
                        <el-dropdown-item command="profile">
                          <div class="flex items-center gap-3 py-2">
                            <el-avatar :size="45" :src="userAvatar" />
                            <div>
                              <p class="font-bold">{{ userName }}</p>
                              <p class="text-sm text-gray-500">Akun Saya</p>
                            </div>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item divided />
                        <el-dropdown-item command="store">
                          <div class="flex items-center gap-2">
                            <Icon name="material-symbols:storefront" />
                            <span>Toko</span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="rfq">
                          <div class="flex items-center gap-2">
                            <Icon name="material-symbols:description" />
                            <span>RFQ Saya</span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item divided />
                        <el-dropdown-item command="logout" class="text-red-500">
                          <div class="flex items-center gap-2">
                            <Icon name="material-symbols:logout" />
                            <span>Keluar</span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
                <template v-else>
                  <Trulink
                    to="/"
                    class="el-button el-button--outline-primary el-button--small px-4"
                  >
                    Daftar / Masuk
                  </Trulink>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row - Categories & Menu -->
        <div class="flex items-center pt-2 border-t border-gray-100">
          <!-- Categories -->
          <div class="flex items-center justify-between w-full">
            <div v-if="loading" class="text-center py-4">
              <el-skeleton :rows="1" animated />
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="text-center py-4 text-red-500">
              {{ error }}
            </div>

            <!-- Menu -->
            <CategoryMenu
              v-else
              :products="products"
              @select="handleCategorySelect"
            />
            <!-- <button
              class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <Icon name="material-symbols:menu" />
              <span>Kategori</span>
            </button> -->
            <div class="flex gap-2">
              <Trulink to="/article" class="transition-colors text-gray-700">
                Artikel
              </Trulink>

              <Trulink to="/" class="transition-colors text-gray-700">
                Promo
              </Trulink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Search Modal -->
    <el-dialog
      v-model="showMobileSearch"
      width="95%"
      top="20px"
      :show-close="false"
      class="lg:hidden"
    >
      <div class="p-4 bg-white">
        <form @submit.prevent="handleMobileSearch" class="flex gap-2">
          <el-input
            v-model="mobileSearchQuery"
            placeholder="Cari produk..."
            size="large"
            ref="mobileSearchInput"
          />
          <el-button type="primary" native-type="submit" size="large">
            <Icon name="material-symbols:search" />
          </el-button>
        </form>
      </div>
    </el-dialog>

    <!-- Mobile Menu Drawer -->
    <el-drawer
      v-model="showMobileMenu"
      direction="ltr"
      size="80%"
      :with-header="false"
    >
      <div class="h-full flex flex-col bg-white text-gray-900">
        <!-- User Info -->
        <div class="flex justify-between items-center">
          <div class="flex-shrink-0">
            <Trulink to="/">
              <img
                src="https://migration.trumecs.com/logo/light.png"
                alt="logo trumecs"
                class="h-10"
              />
            </Trulink>
          </div>
          <!-- <div class="flex gap-4">
            <SwitcherTheme />
            <SwitcherLang />
          </div> -->
        </div>
        <div class="p-4 border-b border-gray-200" v-if="isLoggedIn">
          <div class="flex items-center gap-3">
            <el-avatar :size="50" :src="userAvatar" />
            <div>
              <p class="font-bold">{{ userName }}</p>
              <p class="text-sm text-gray-500">Akun Saya</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="flex-grow overflow-y-auto">
          <el-collapse>
            <el-collapse-item title="Category" name="1" class="text-xl">
              <el-collapse>
                <el-collapse-item title="Unit" name="1" class="text-xl">
                  <Trulink
                    v-for="item in mobileMenuItems"
                    :key="item.to"
                    :to="item.to"
                    class="flex items-center gap-3 border-b py-3 hover:bg-opacity-10 border-gray-200 hover:bg-gray-100 bg-gray-50"
                    @click="showMobileMenu = false"
                  >
                    <span>{{ item.text }}</span>
                    <span
                      v-if="item.badge"
                      class="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      {{ item.badge }}
                    </span>
                  </Trulink>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
          <Trulink
            v-for="item in mobileMenuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 border-b py-3 hover:bg-opacity-10 bg-gray-50 border-gray-200 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            <span>{{ item.text }}</span>
            <span
              v-if="item.badge"
              class="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
            >
              {{ item.badge }}
            </span>
          </Trulink>
        </div>

        <!-- Bottom Actions -->
        <div class="border-t border-gray-200">
          <Trulink
            to="/"
            class="el-button el-button--primary w-full mb-3"
            @click="showMobileMenu = false"
          >
            Infokan Kebutuhanmu
          </Trulink>
          <div
            class="flex flex-col gap-1 justify-center items-center border-b pb-2"
          >
            <p class="text-sm text-gray-500">Hubungi kami :</p>
            <Trulink
              href="https://wa.me/+6285176912338"
              target="_blank"
              class="text-sm flex gap-1 items-center text-gray-500"
            >
              <Icon name="logos:whatsapp-icon" />
              <p>+6285176912338</p>
            </Trulink>
            <Trulink
              href="https://mail.to/info@trumecs.com"
              target="_blank"
              class="text-sm flex gap-1 items-center text-gray-500"
            >
              <Icon name="material-symbols:mail-outline" />
              <p>info@trumecs.com</p>
            </Trulink>
          </div>
          <div class="text-center pt-2 text-gray-500">
            <p class="text-sm">Trumecs © 2022</p>
          </div>
        </div>
      </div>
    </el-drawer>
  </nav>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import type { CollapseModelValue } from "element-plus";
import type { ProductCategory } from "~/types/category";

const products = ref<ProductCategory[]>([]);
const activeIndex = ref("2");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const activeNames = ref(["1"]);
const handleChange = (val: CollapseModelValue) => {
  console.log(val);
};

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const goBack = () => router.back();

const loading = ref(true);
const error = ref<string | null>(null);

// Refs
const searchQuery = ref(route.query.nama || "");
const mobileSearchQuery = ref("");
const searchPlaceholder = ref("Kebutuhan mekanikal apa yang anda cari?");
const showMobileMenu = ref(false);
const showMobileSearch = ref(false);
const mobileSearchInput = ref();
const dropdownVisible = ref(false);

const cartCount = computed(() => 0); // Ganti dengan store
const isLoggedIn = computed(() => false); // Ganti dengan auth store
const userName = computed(() => "John Doe");
const userAvatar = computed(() => "");
const unreadNotifications = computed(() => 3);
const unreadChats = computed(() => 2);

// Mobile menu items
const mobileMenuItems = computed(() => [
  { to: "/jasa", text: "Jasa" },
  { to: "/rental", text: "Rental" },
  { to: "/article", text: "Artikel" },
  { to: "/promo", text: "Promo" },
  { to: "/bulk", text: "RFQ" },
  { to: "/syarat", text: "Syarat & Ketentuan" },
  { to: "/retur", text: "Kebijakan Retur" },
  { to: "/faq", text: "FAQ" },
  ...(isLoggedIn.value
    ? [
        {
          to: "/notification",
          text: "Notifikasi",
          icon: "material-symbols:notifications",
          badge: unreadNotifications.value,
        },
        {
          to: "/chat",
          text: "Chat",
          icon: "material-symbols:chat",
          badge: unreadChats.value,
        },
        {
          to: "/member/store",
          text: "Toko Saya",
          icon: "material-symbols:storefront",
        },
        {
          to: "/member/bulk",
          text: "RFQ Saya",
          icon: "material-symbols:description",
        },
        { to: "/member", text: "Akun Saya", icon: "material-symbols:person" },
      ]
    : [
        {
          to: "/member/login",
          text: "Login / Register",
          icon: "material-symbols:login",
        },
      ]),
]);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    window.location.href = `/c/all/query?q=on&nama=${encodeURIComponent(
      searchQuery.value
    )}`;
  }
};

const handleMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    showMobileSearch.value = false;

    window.location.href = `/c/all/query?q=on&nama=${encodeURIComponent(
      mobileSearchQuery.value
    )}`;
  }
};

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await useFetchApi<any>(
      "category-read", // Ganti dengan endpoint yang sesuai
      "category-read",
      "get",
      null
    );

    if (response.status.value === "success") {
      // Ambil hanya products dari payload
      products.value = response.data.value!.payload.category.products;
      console.log("Products loaded:", products.value);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Gagal memuat kategori";
  } finally {
    loading.value = false;
  }
};

const handleCategorySelect = (index: string) => {
  console.log("Selected category:", index);
  // Handle navigation atau action lainnya
};

const handleDropdownCommand = (command: string) => {
  switch (command) {
    case "profile":
      router.push("/member");
      break;
    case "store":
      router.push("/member/store");
      break;
    case "rfq":
      router.push("/member/bulk");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      "Apakah Anda yakin ingin keluar?",
      "Konfirmasi Keluar",
      {
        confirmButtonText: "Ya, Keluar",
        cancelButtonText: "Batal",
        type: "warning",
      }
    );
    // Handle logout
    console.log("Logout berhasil");
  } catch (error) {
    // User membatalkan logout
  }
};

// PERBAIKAN: Ganti fetchCategori menjadi fetchCategories
onMounted(async () => {
  await fetchCategories();
});

// Auto focus on mobile search input
watch(showMobileSearch, (val) => {
  if (val) {
    nextTick(() => {
      mobileSearchInput.value?.focus();
    });
  }
});
</script>

<style scoped>
.navbar {
  height: auto;
  min-height: 64px;
}

.el-button--primary {
  --el-button-bg-color: #fa8420;
  --el-button-border-color: #fa8420;
  --el-button-hover-bg-color: #e6761a;
  --el-button-hover-border-color: #e6761a;
}

.el-drawer__body {
  padding: 0;
}

.el-menu--horizontal.el-menu {
  border-bottom: none !important;
}
</style>
