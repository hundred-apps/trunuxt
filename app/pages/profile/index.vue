<template>
  <div class="profile-page py-8 lg:py-12">
    <div class="container mx-auto px-4 lg:px-8 max-w-[1280px]">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
            <div
              class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <Icon name="material-symbols:person" class="text-5xl text-orange-500" />
            </div>
            <h1 class="text-2xl font-bold text-white">{{ $t("page.profile.title") }}</h1>
          </div>

          <div v-if="isLoggedIn" class="p-6 lg:p-8">
            <div class="space-y-4">
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Icon name="material-symbols:person" class="text-xl text-gray-400" />
                <div>
                  <p class="text-xs text-gray-500">{{ $t("page.profile.name") }}</p>
                  <p class="font-medium text-gray-800">{{ user.name }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Icon name="material-symbols:mail" class="text-xl text-gray-400" />
                <div>
                  <p class="text-xs text-gray-500">{{ $t("page.profile.email") }}</p>
                  <p class="font-medium text-gray-800">{{ user.email }}</p>
                </div>
              </div>

              <div v-if="user.phone" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Icon name="material-symbols:phone" class="text-xl text-gray-400" />
                <div>
                  <p class="text-xs text-gray-500">{{ $t("page.profile.phone") }}</p>
                  <p class="font-medium text-gray-800">{{ user.phone }}</p>
                </div>
              </div>

              <div v-if="user.company" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Icon name="material-symbols:business" class="text-xl text-gray-400" />
                <div>
                  <p class="text-xs text-gray-500">{{ $t("page.profile.company") }}</p>
                  <p class="font-medium text-gray-800">{{ user.company }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Icon name="material-symbols:calendar-today" class="text-xl text-gray-400" />
                <div>
                  <p class="text-xs text-gray-500">{{ $t("page.profile.memberSince") }}</p>
                  <p class="font-medium text-gray-800">{{ user.memberSince }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <Trubutton
                :text="$t('page.profile.editProfile')"
                type="primary"
                size="medium"
                variant="solid"
                icon="material-symbols:edit"
                full-width
                @click="handleEditProfile"
              />
              <Trubutton
                :text="$t('page.profile.logout')"
                type="danger"
                size="medium"
                variant="outline"
                icon="material-symbols:logout"
                full-width
                @click="handleLogout"
              />
            </div>
          </div>

          <div v-else class="p-8 text-center">
            <Icon name="material-symbols:lock" class="text-5xl text-gray-300 mb-4" />
            <h2 class="text-xl font-bold text-gray-700 mb-2">
              {{ $t("page.profile.notLoggedIn") }}
            </h2>
            <p class="text-gray-500 mb-6">
              {{ $t("page.profile.loginPrompt") }}
            </p>
            <Trulink
              :to="`${urlTrumecs}/member/login`"
              class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {{ $t("page.profile.loginButton") }}
              <Icon name="material-symbols:arrow-forward" />
            </Trulink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessageBox } from "element-plus";

useHead({
  title: "Profil",
  titleTemplate: "%s | Trumecs.com",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const config = useRuntimeConfig();
const urlTrumecs = config.public.info.linkTrumecsPhp;

const isLoggedIn = ref(false);

const user = ref({
  name: "John Doe",
  email: "john@example.com",
  phone: "+62 812-3456-7890",
  company: "PT Example Indonesia",
  memberSince: "Januari 2024",
});

const handleEditProfile = () => {
  navigateTo(`${urlTrumecs}/member`);
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
    isLoggedIn.value = false;
    navigateTo("/");
  } catch {}
};
</script>
