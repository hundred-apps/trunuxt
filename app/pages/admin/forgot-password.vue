<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <NuxtLink to="/admin" class="inline-block">
          <img
            src="https://migration.trumecs.com/logo/light.png"
            alt="Trumecs Admin"
            class="mx-auto h-16 w-auto"
          />
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          {{ $t("admin.forgotPassword.title") }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t("admin.forgotPassword.subtitle") }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div
          v-if="error"
          class="bg-red-50 text-red-600 text-sm p-3 rounded-lg"
          role="alert"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="bg-green-50 text-green-600 text-sm p-3 rounded-lg"
          role="alert"
        >
          {{ $t("admin.forgotPassword.success") }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">{{ $t("auth.email") }}</label>
            <el-input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('auth.email')"
              :disabled="loading || success"
              class="w-full"
              autocomplete="email"
            />
          </div>
        </div>

        <div v-if="!success">
          <Trubutton
            :text="$t('admin.forgotPassword.sendLink')"
            type="primary"
            size="large"
            variant="solid"
            full-width
            :loading="loading"
            native-type="submit"
          />
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ $t("admin.forgotPassword.rememberPassword") }}
          <NuxtLink
            to="/admin/login"
            class="font-medium text-orange-600 hover:text-orange-500 ml-1"
          >
            {{ $t("admin.login.submit") }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAdminStore } from "~/stores/admin";

const adminStore = useAdminStore();

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const form = ref({
  email: "",
});

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;

  try {
    await adminStore.forgotPassword(form.value.email);
    success.value = true;
  } catch (e: any) {
    error.value =
      e.message || "Gagal mengirim tautan reset. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>