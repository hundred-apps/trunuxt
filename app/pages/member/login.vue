<template>
  <div class="member-auth-page min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <NuxtLink to="/" class="block text-center">
          <img
            src="https://migration.trumecs.com/logo/dark.png"
            alt="Trumecs"
            class="mx-auto h-16 w-auto"
          />
        </NuxtLink>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.login.subtitle') }}
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

            <div class="text-sm">
              <NuxtLink
                to="/member/forgot-password"
                class="font-medium text-orange-600 hover:text-orange-500"
              >
                {{ $t('auth.forgotPassword') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <div>
          <Trubutton
            :text="$t('auth.login')"
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
          {{ $t('auth.noAccount') }}
          <NuxtLink
            to="/member/register"
            class="font-medium text-orange-600 hover:text-orange-500 ml-1"
          >
            {{ $t('auth.register') }}
          </NuxtLink>
        </p>
      </div>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">{{ $t('auth.or') }}</span>
        </div>
      </div>

      <div>
        <Trubutton
          :text="$t('auth.loginWithWhatsapp')"
          type="success"
          size="large"
          variant="solid"
          full-width
          icon="logos:whatsapp-icon"
          @click="loginWithWhatsApp"
          :disabled="loading"
        />
      </div>

      <div class="text-center text-sm text-gray-500">
        <p>{{ $t('auth.termsAgreement') }}</p>
        <p class="mt-1">
          <NuxtLink to="/page/syarat-ketentuan" class="text-orange-600 hover:underline">{{ $t('auth.terms') }}</NuxtLink>
          {{ $t('auth.and') }}
          <NuxtLink to="/page/kebijakan-privasi" class="text-orange-600 hover:underline">{{ $t('auth.privacy') }}</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const redirect = (route.query.redirect as string) || '/member/dashboard';

const handleLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    await authStore.login(form.value);
    ElMessage.success('Login berhasil');
    await router.push(redirect);
  } catch (e: any) {
    error.value = e.message || 'Login gagal. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};

const loginWithWhatsApp = () => {
  window.open(
    `https://wa.me/${useRuntimeConfig().public.info.phone}?text=${encodeURIComponent(
      'Halo Trumecs, saya ingin login via WhatsApp'
    )}`,
    '_blank'
  );
};
</script>