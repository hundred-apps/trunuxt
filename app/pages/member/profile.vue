<template>
  <div class="member-profile">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('member.profile.title') }}</h1>
      <p class="mt-1 text-gray-600">{{ $t('member.profile.subtitle') }}</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <!-- Profile Header -->
        <div class="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div class="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-600">
            {{ authStore.userInitials }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ authStore.userName }}</h2>
            <p class="text-gray-500">{{ authStore.user?.email }}</p>
            <span v-if="!authStore.user?.emailVerified" class="inline-flex items-center gap-1 text-sm text-yellow-600 mt-1">
              <Icon name="material-symbols:warning" class="h-4 w-4" />
              {{ $t('member.profile.emailNotVerified') }}
            </span>
          </div>
        </div>

        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.firstName') }}</label>
            <el-input
              id="firstName"
              v-model="form.firstName"
              class="w-full"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.lastName') }}</label>
            <el-input
              id="lastName"
              v-model="form.lastName"
              class="w-full"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.email') }}</label>
            <el-input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full"
              disabled
            />
            <p class="mt-1 text-xs text-gray-500">{{ $t('member.profile.emailCannotChange') }}</p>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.phone') }}</label>
            <el-input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full"
            />
          </div>
          <div class="md:col-span-2">
            <label for="company" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.company') }}</label>
            <el-input
              id="company"
              v-model="form.company"
              class="w-full"
            />
          </div>
          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('member.profile.address') }}</label>
            <el-input
              id="address"
              v-model="form.address"
              type="textarea"
              :rows="3"
              class="w-full"
            />
          </div>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <Trubutton
            :text="$t('button.save')"
            type="primary"
            variant="solid"
            native-type="submit"
            :loading="saving"
          />
        </div>
      </form>
    </div>

    <!-- Change Password Section -->
    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('member.profile.changePassword') }}</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('member.profile.currentPassword') }}</label>
            <el-input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              show-password
              class="w-full"
            />
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('member.profile.newPassword') }}</label>
            <el-input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              class="w-full"
            />
          </div>
          <div>
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('member.profile.confirmNewPassword') }}</label>
            <el-input
              id="confirmNewPassword"
              v-model="passwordForm.confirmNewPassword"
              type="password"
              show-password
              class="w-full"
            />
          </div>
        </div>

        <div v-if="passwordForm.newPassword !== passwordForm.confirmNewPassword && passwordForm.confirmNewPassword" class="text-red-600 text-sm">
          {{ $t('auth.passwordMismatch') }}
        </div>

        <Trubutton
          :text="$t('button.save')"
          type="primary"
          variant="outline"
          native-type="submit"
          :loading="changingPassword"
          :disabled="passwordForm.newPassword !== passwordForm.confirmNewPassword"
        />
      </form>
    </div>

    <!-- Danger Zone -->
    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 bg-red-50">
      <h2 class="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
        <Icon name="material-symbols:warning" class="h-5 w-5" />
        {{ $t('member.profile.dangerZone') }}
      </h2>
      <p class="text-sm text-red-600 mb-4">{{ $t('member.profile.dangerZoneDesc') }}</p>
      <el-button
        type="danger"
        @click="confirmDeleteAccount"
        class="w-full sm:w-auto"
      >
        {{ $t('member.profile.deleteAccount') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { ElMessage, ElMessageBox } from 'element-plus';

const authStore = useAuthStore();

const saving = ref(false);
const changingPassword = ref(false);

const form = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  company: authStore.user?.company || '',
  address: authStore.user?.address || '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const handleUpdateProfile = async () => {
  saving.value = true;
  try {
    await authStore.updateProfile(form.value);
    ElMessage.success('Profil berhasil diperbarui');
  } catch (e: any) {
    ElMessage.error(e.message || 'Gagal memperbarui profil');
  } finally {
    saving.value = false;
  }
};

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    return;
  }
  changingPassword.value = true;
  try {
    await authStore.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword);
    ElMessage.success('Password berhasil diubah');
    passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
  } catch (e: any) {
    ElMessage.error(e.message || 'Gagal mengubah password');
  } finally {
    changingPassword.value = false;
  }
};

const confirmDeleteAccount = () => {
  ElMessageBox.confirm(
    'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.',
    'Hapus Akun',
    {
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(async () => {
    try {
      await authStore.deleteAccount();
      ElMessage.success('Akun berhasil dihapus');
      await navigateTo('/');
    } catch (e: any) {
      ElMessage.error(e.message || 'Gagal menghapus akun');
    }
  }).catch(() => {});
};
</script>