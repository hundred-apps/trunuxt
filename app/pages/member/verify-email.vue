<template>
  <div class="member-auth-page min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <NuxtLink to="/" class="block">
          <img
            src="https://migration.trumecs.com/logo/dark.png"
            alt="Trumecs"
            class="mx-auto h-16 w-auto"
          />
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          {{ $t('auth.verifyEmail.title') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('auth.verifyEmail.subtitle') }}
        </p>
      </div>

      <div class="space-y-6">
        <div v-if="status === 'pending'" class="bg-blue-50 text-blue-700 p-4 rounded-lg">
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
            <span class="font-medium">{{ $t('auth.verifyEmail.checking') }}</span>
          </div>
          <p class="text-sm">{{ $t('auth.verifyEmail.checkingDesc') }}</p>
        </div>

        <div v-else-if="status === 'verified'" class="bg-green-50 text-green-700 p-4 rounded-lg">
          <Icon name="material-symbols:check-circle" class="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h3 class="text-lg font-semibold mb-2">{{ $t('auth.verifyEmail.verified') }}</h3>
          <p class="text-sm mb-4">{{ $t('auth.verifyEmail.verifiedDesc') }}</p>
          <NuxtLink to="/member/login" class="text-orange-600 hover:underline font-medium">
            {{ $t('auth.login') }}
          </NuxtLink>
        </div>

        <div v-else-if="status === 'expired'" class="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          <Icon name="material-symbols:warning" class="mx-auto h-12 w-12 text-yellow-500 mb-3" />
          <h3 class="text-lg font-semibold mb-2">{{ $t('auth.verifyEmail.expired') }}</h3>
          <p class="text-sm mb-4">{{ $t('auth.verifyEmail.expiredDesc') }}</p>
          <Trubutton
            :text="$t('auth.verifyEmail.resend')"
            type="primary"
            variant="outline"
            @click="resendVerification"
            :loading="resending"
          />
        </div>

        <div v-else-if="status === 'error'" class="bg-red-50 text-red-700 p-4 rounded-lg">
          <Icon name="material-symbols:error" class="mx-auto h-12 w-12 text-red-500 mb-3" />
          <h3 class="text-lg font-semibold mb-2">{{ $t('auth.verifyEmail.error') }}</h3>
          <p class="text-sm mb-4">{{ errorMessage }}</p>
          <div class="flex gap-3 justify-center">
            <Trubutton
              :text="$t('auth.verifyEmail.resend')"
              type="primary"
              variant="outline"
              @click="resendVerification"
              :loading="resending"
            />
            <NuxtLink to="/member/login" class="flex items-center">
              <Trubutton
                :text="$t('auth.login')"
                type="primary"
                variant="solid"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="status !== 'verified'" class="text-center">
        <p class="text-sm text-gray-600">
          {{ $t('auth.verifyEmail.didNotReceive') }}
          <button
            @click="resendVerification"
            :disabled="resending"
            class="font-medium text-orange-600 hover:text-orange-500 ml-1 underline"
          >
            {{ $t('auth.verifyEmail.resendLink') }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const status = ref<'pending' | 'verified' | 'expired' | 'error'>('pending');
const errorMessage = ref('');
const resending = ref(false);

const verifyToken = ref(route.query.token as string);

onMounted(async () => {
  if (!verifyToken.value) {
    status.value = 'error';
    errorMessage.value = 'Token verifikasi tidak ditemukan';
    return;
  }
  await verifyEmail();
});

const verifyEmail = async () => {
  status.value = 'pending';
  try {
    await authStore.verifyEmail(verifyToken.value);
    status.value = 'verified';
  } catch (e: any) {
    if (e.message?.includes('expired') || e.message?.includes('kadaluarsa')) {
      status.value = 'expired';
    } else {
      status.value = 'error';
      errorMessage.value = e.message || 'Verifikasi gagal. Token tidak valid.';
    }
  }
};

const resendVerification = async () => {
  resending.value = true;
  try {
    const email = authStore.getPendingVerificationEmail();
    if (email) {
      await authStore.resendVerification(email);
      ElMessage.success('Link verifikasi baru telah dikirim');
      status.value = 'pending';
      // Re-verify with new token would need new token from email
    } else {
      await router.push('/member/register');
    }
  } catch (e: any) {
    ElMessage.error(e.message || 'Gagal mengirim ulang');
  } finally {
    resending.value = false;
  }
};
</script>