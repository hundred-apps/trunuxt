<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <NuxtLink to="/admin" class="inline-block">
          <img
            src="https://migration.trumecs.com/logo/dark.png"
            alt="Trumecs Admin"
            class="mx-auto h-16 w-auto"
          />
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          {{ $t('admin.login.title') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('admin.login.subtitle') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg" role="alert">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <el-input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('auth.email')"
              :disabled="loading"
              class="w-full"
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <el-input
              id="password"
              v-model="form.password"
              type="password"
              :placeholder="$t('auth.password')"
              :disabled="loading"
              class="w-full"
              autocomplete="current-password"
              show-password
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <el-checkbox v-model="form.remember" size="small">
                {{ $t('auth.rememberMe') }}
              </el-checkbox>
            </div>
          </div>
        </div>

        <div>
          <Trubutton
            :text="$t('admin.login')"
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
          {{ $t('admin.login.forgotPassword') }}
          <NuxtLink
            to="/admin/forgot-password"
            class="font-medium text-orange-600 hover:text-orange-500 ml-1"
          >
            {{ $t('auth.forgotPassword') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminStore } from '~/stores/admin';

const router = useRouter();
const route = useRoute();
const adminStore = useAdminStore();

const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const redirect = (route.query.redirect as string) || '/admin';

const handleLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    await adminStore.login(form.value);
    await router.push(redirect);
  } catch (e: any) {
    error.value = e.message || 'Login gagal. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>