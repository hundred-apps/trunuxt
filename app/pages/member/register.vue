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
          {{ $t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.register.subtitle') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="error" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg" role="alert">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="sr-only">{{ $t('auth.firstName') }}</label>
              <el-input
                id="firstName"
                v-model="form.firstName"
                type="text"
                :placeholder="$t('auth.firstName')"
                :disabled="loading"
                class="w-full"
                autocomplete="given-name"
              />
            </div>
            <div>
              <label for="lastName" class="sr-only">{{ $t('auth.lastName') }}</label>
              <el-input
                id="lastName"
                v-model="form.lastName"
                type="text"
                :placeholder="$t('auth.lastName')"
                :disabled="loading"
                class="w-full"
                autocomplete="family-name"
              />
            </div>
          </div>

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
            <label for="phone" class="sr-only">{{ $t('auth.phone') }}</label>
            <el-input
              id="phone"
              v-model="form.phone"
              type="tel"
              :placeholder="$t('auth.phone')"
              :disabled="loading"
              class="w-full"
              autocomplete="tel"
            />
          </div>

          <div>
            <label for="company" class="sr-only">{{ $t('auth.company') }}</label>
            <el-input
              id="company"
              v-model="form.company"
              type="text"
              :placeholder="$t('auth.company')"
              :disabled="loading"
              class="w-full"
              autocomplete="organization"
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
              autocomplete="new-password"
              show-password
            />
          </div>

          <div>
            <label for="confirmPassword" class="sr-only">{{ $t('auth.confirmPassword') }}</label>
            <el-input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('auth.confirmPassword')"
              :disabled="loading"
              class="w-full"
              autocomplete="new-password"
              show-password
            />
          </div>

          <div v-if="form.password !== form.confirmPassword && form.confirmPassword" class="text-red-600 text-sm">
            {{ $t('auth.passwordMismatch') }}
          </div>

          <div class="flex items-start">
            <el-checkbox v-model="form.agreeTerms" size="small" class="mt-1">
              <span class="text-sm text-gray-600">
                {{ $t('auth.agreeTermsPart1') }}
                <NuxtLink to="/page/syarat-ketentuan" class="text-orange-600 hover:underline">{{ $t('auth.terms') }}</NuxtLink>
                {{ $t('auth.and') }}
                <NuxtLink to="/page/kebijakan-privasi" class="text-orange-600 hover:underline">{{ $t('auth.privacy') }}</NuxtLink>
              </span>
            </el-checkbox>
          </div>

          <div v-if="!form.agreeTerms" class="text-red-600 text-sm hidden">
            {{ $t('auth.mustAgreeTerms') }}
          </div>
        </div>

        <div>
          <Trubutton
            :text="$t('auth.register')"
            type="primary"
            size="large"
            variant="solid"
            full-width
            :loading="loading"
            native-type="submit"
            :disabled="!form.agreeTerms || form.password !== form.confirmPassword"
          />
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ $t('auth.hasAccount') }}
          <NuxtLink
            to="/member/login"
            class="font-medium text-orange-600 hover:text-orange-500 ml-1"
          >
            {{ $t('auth.login') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
});

const handleRegister = async () => {
  if (!form.value.agreeTerms) {
    error.value = 'Anda harus menyetujui syarat dan ketentuan';
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Konfirmasi password tidak cocok';
    return;
  }

  error.value = null;
  loading.value = true;

  try {
    await authStore.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      company: form.value.company,
      password: form.value.password,
    });
    ElMessage.success('Registrasi berhasil. Silakan cek email untuk verifikasi.');
    await router.push('/member/verify-email');
  } catch (e: any) {
    error.value = e.message || 'Registrasi gagal. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>