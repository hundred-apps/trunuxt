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

        <Trulink :to="urlTrumecs">
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
      </div>
    </div>

    <!-- Desktop Navbar -->
    <div class="hidden lg:block">
      <div class="container mx-auto px-4 py-3 max-w-[1280px]">
        <!-- Top Row -->
        <div class="flex items-center justify-between mb-3">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <Trulink href="https://trumecs.com">
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
                    :placeholder="$t('navbar.placeholder.search')"
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
                  <small
                    ><strong>{{ $t("navbar.or") }}</strong></small
                  >
                </p>
              </div>

              <div class="flex-shrink-0 min-w-[160px] hidden xl:block">
                <Trubutton
                  :text="$t('navbar.button.inquiry')"
                  type="primary"
                  size="small"
                  variant="solid"
                  icon="mdi:email"
                  full-width
                  @click="handleBulk"
                />
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex-shrink-0">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-4">
                <SwitcherLang />

                <template v-if="isLoggedIn">
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
                    :to="urlTrumecs + '/member/login'"
                    class="el-button el-button--outline-primary el-button--small px-4"
                    @click="handleLogin"
                  >
                    {{ $t("navbar.button.signUp") }}
                  </Trulink>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row - Categories & Menu -->
        <div class="flex items-center">
          <div class="flex items-center justify-between w-full">
            <!-- 👇 SKELETON LOADING untuk Categories -->
            <div v-if="loading" class="flex items-center gap-2 w-full">
              <!-- Skeleton untuk menu items -->
              <div class="flex items-center gap-4 w-full">
                <div v-for="i in 6" :key="i" class="flex items-center gap-2">
                  <el-skeleton-item
                    variant="text"
                    style="width: 80px; height: 20px"
                  />
                  <el-skeleton-item
                    v-if="i < 6"
                    variant="text"
                    style="width: 12px; height: 16px"
                  />
                </div>
              </div>
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

            <div class="flex gap-2">
              <Trulink
                to="/article"
                class="transition-colors text-gray-700"
                @click="handleClickLinkArticle"
              >
                {{ $t("navbar.menu.article") }}
              </Trulink>

              <Trulink
                to="/promo"
                class="transition-colors text-gray-700"
                @click="handleClickLinkPromo"
              >
                {{ $t("navbar.menu.promo") }}
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
        <div
          class="flex justify-between items-center p-4 border-b border-gray-100"
        >
          <div class="flex-shrink-0">
            <Trulink :to="urlTrumecs">
              <img
                src="https://migration.trumecs.com/logo/light.png"
                alt="logo trumecs"
                class="h-10"
              />
            </Trulink>
          </div>
          <div class="flex gap-4">
            <SwitcherLang />
          </div>
        </div>

        <!-- Skeleton Loading di Mobile Menu -->
        <div v-if="loading" class="p-4">
          <div class="flex items-center gap-3 mb-4">
            <el-skeleton-item
              variant="circle"
              style="width: 50px; height: 50px"
            />
            <div class="flex-1">
              <el-skeleton-item
                variant="text"
                style="width: 60%; height: 20px"
              />
              <el-skeleton-item
                variant="text"
                style="width: 40%; height: 16px"
              />
            </div>
          </div>

          <div v-for="i in 8" :key="i" class="border-b border-gray-100 py-3">
            <el-skeleton-item variant="text" style="width: 70%; height: 18px" />
          </div>
        </div>

        <!-- Menu Items -->
        <div v-else class="flex-grow overflow-y-auto">
          <div class="p-4 border-b border-gray-200" v-if="isLoggedIn">
            <div class="flex items-center gap-3">
              <el-avatar :size="50" :src="userAvatar" />
              <div>
                <p class="font-bold">{{ userName }}</p>
                <p class="text-sm text-gray-500">Akun Saya</p>
              </div>
            </div>
          </div>

          <div class="flex-grow overflow-y-auto">
            <el-collapse>
              <el-collapse-item
                :title="$t('navbar.menu.category')"
                name="1"
                class="text-xl p-b-0"
              >
                <template
                  v-for="(category, categoryIdx) in products"
                  :key="category.id"
                >
                  <CategoryMobileCategoryMenuItem
                    :item="category"
                    :level="0"
                    @close-mobile-menu="showMobileMenu = false"
                  />
                </template>
              </el-collapse-item>
            </el-collapse>
            <Trulink
              v-for="item in mobileMenuItems"
              :key="item.to"
              :to="item.to"
              @click="handleClickMenuMobile(item.text)"
              color="black"
              class="flex items-center gap-3 border-b py-3 hover:bg-opacity-10 border-gray-200 hover:bg-gray-100 px-4"
            >
              <span>{{ item.text }}</span>
            </Trulink>
          </div>

          <!-- Bottom Actions -->
          <div class="border-t border-gray-200 p-4">
            <Trulink
              :to="urlTrumecs + '/bulk'"
              class="el-button el-button--primary w-full mb-3"
              @click="handleBulkMobile"
            >
              {{ $t("navbar.button.inquiry") }}
            </Trulink>
            <div
              class="flex flex-col gap-1 justify-center items-center border-b pb-2"
            >
              <p class="text-sm text-gray-500">
                {{ $t("page.product.text.contactUs") }} :
              </p>
              <Trulink
                href="https://wa.me/+6285176912338"
                target="_blank"
                class="text-sm flex gap-1 items-center text-gray-500"
              >
                <Icon name="logos:whatsapp-icon" />
                <p>+6285176912338</p>
              </Trulink>
              <Trulink
                href="mailto:info@trumecs.com"
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

const {
  trackClickLink,
  trackClickLinkMobile,
  trackClickButton,
  trackClickButtonMobile,
} = useAnalytics();

const config = useRuntimeConfig();
const urlTrumecs = config.public.info.linkTrumecsPhp;

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
const showMobileMenu = ref(false);
const showMobileSearch = ref(false);
const mobileSearchInput = ref();
const dropdownVisible = ref(false);

const cartCount = computed(() => 0);
const isLoggedIn = computed(() => false);
const userName = computed(() => "John Doe");
const userAvatar = computed(() => "");
const unreadNotifications = computed(() => 3);
const unreadChats = computed(() => 2);

// Mobile menu items
const mobileMenuItems = computed(() => [
  { to: urlTrumecs + "/jasa", text: t("navbar.menu.service") },
  { to: urlTrumecs + "/rental", text: t("navbar.menu.rental") },
  { to: "/article", text: t("navbar.menu.article") },
  { to: "/promo", text: t("navbar.menu.promo") },
  { to: "/principal", text: "Principal" },
  { to: urlTrumecs + "/bulk", text: t("navbar.menu.rfq") },
  { to: urlTrumecs + "/syarat", text: t("navbar.menu.term") },
  { to: urlTrumecs + "/retur", text: t("navbar.menu.policy") },
  { to: urlTrumecs + "/faq", text: t("navbar.menu.faq") },
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
          to: urlTrumecs + "/member/bulk",
          text: "RFQ Saya",
          icon: "material-symbols:description",
        },
        {
          to: urlTrumecs + "/member",
          text: "Akun Saya",
          icon: "material-symbols:person",
        },
      ]
    : [
        {
          to: urlTrumecs + "/member/login",
          text: t("navbar.button.signUp"),
          icon: "material-symbols:login",
        },
      ]),
]);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    trackClickButton("Cari : " + searchQuery.value.trim());
    navigateTo({
      path: "/c/all/query",
      query: { q: "on", nama: searchQuery.value.trim() },
    });
  }
};

const handleMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    showMobileSearch.value = false;
    trackClickButtonMobile("Cari : " + mobileSearchQuery.value.trim());
    navigateTo({
      path: "/c/all/query",
      query: { q: "on", nama: mobileSearchQuery.value.trim() },
    });
  }
};

const handleBulk = () => {
  trackClickButton("Button 'Info Kebutuhan'");
  navigateTo(urlTrumecs + "/bulk");
};

const handleBulkMobile = () => {
  trackClickButtonMobile("Button 'Info Kebutuhan'");
  showMobileMenu.value = false;
};

const handleClickLinkArticle = () => {
  trackClickLink("Link 'Article'");
};
const handleClickLinkPromo = () => {
  trackClickLink("Link 'Promo'");
};

const handleClickMenuMobile = (name: String) => {
  trackClickLinkMobile("Link Mobile Menu " + name);
  showMobileMenu.value = false;
};

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await useFetchApi<any>(
      "category-read",
      "category-read",
      "get",
      null
    );

    if (response.status === "success") {
      products.value = response.data!.payload.category.products;
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
    console.log("Logout berhasil");
  } catch (error) {
    // User membatalkan logout
  }
};

const handleLogin = () => {
  trackClickButton("Button 'Login'");
};

onMounted(async () => {
  await fetchCategories();
});

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

.el-collapse-item__content {
  padding-bottom: 0px !important;
}

.el-drawer__body {
  padding: 0;
}

.el-menu--horizontal.el-menu {
  border-bottom: none !important;
}

.el-sub-menu__title {
  padding-left: 0 !important;
  padding-right: 35 !important;
}

/* Skeleton animation */
:deep(.el-skeleton) {
  --el-skeleton-color: #f2f2f2;
  --el-skeleton-to-color: #e6e6e6;
}

:deep(.el-skeleton-item) {
  background: linear-gradient(
    90deg,
    var(--el-skeleton-color) 25%,
    var(--el-skeleton-to-color) 37%,
    var(--el-skeleton-color) 63%
  );
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
}

@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
