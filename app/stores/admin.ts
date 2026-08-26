import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRuntimeConfig } from '#app';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  privileges: string[];
  avatar?: string;
}

export const useAdminStore = defineStore('admin', () => {
  const config = useRuntimeConfig();
  const admin = ref<Admin | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value && !!admin.value);
  const currentAdmin = computed(() => admin.value);
  const hasPrivilege = (privilege: string) => admin.value?.privileges.includes(privilege) || false;

  function setToken(newToken: string) {
    token.value = newToken;
    if (import.meta.client) {
      localStorage.setItem('admin_token', newToken);
    }
  }

  function clearToken() {
    token.value = null;
    admin.value = null;
    if (import.meta.client) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
    }
  }

  async function login(credentials: { email: string; password: string; remember: boolean }) {
    loading.value = true;
    try {
      const response = await $fetch<{ admin: Admin; token: string }>(
        `${config.public.baseURL}/admin/auth/login`,
        {
          method: 'POST',
          body: credentials,
        }
      );
      setToken(response.token);
      admin.value = response.admin;
      if (import.meta.client) {
        localStorage.setItem('admin_data', JSON.stringify(response.admin));
      }
      return response.admin;
    } catch (e: any) {
      throw new Error(e.data?.message || 'Login failed');
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdmin() {
    if (!token.value) return;
    try {
      const response = await $fetch<Admin>(`${config.public.baseURL}/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      admin.value = response;
      if (import.meta.client) {
        localStorage.setItem('admin_data', JSON.stringify(response));
      }
    } catch {
      clearToken();
    }
  }

  async function logout() {
    try {
      await $fetch(`${config.public.baseURL}/admin/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch {
      // Ignore logout API errors
    } finally {
      clearToken();
    }
  }

  async function updateProfile(data: Partial<Admin>) {
    const response = await $fetch<Admin>(`${config.public.baseURL}/admin/auth/profile`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: data,
    });
    admin.value = response;
    if (import.meta.client) {
      localStorage.setItem('admin_data', JSON.stringify(response));
    }
    return response;
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await $fetch(`${config.public.baseURL}/admin/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { currentPassword, newPassword },
    });
  }

  function initializeAuth() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('admin_token');
      const storedAdmin = localStorage.getItem('admin_data');
      if (storedToken && storedAdmin) {
        token.value = storedToken;
        admin.value = JSON.parse(storedAdmin);
      }
    }
  }

  return {
    admin,
    token,
    loading,
    isLoggedIn,
    currentAdmin,
    hasPrivilege,
    setToken,
    clearToken,
    login,
    fetchAdmin,
    logout,
    updateProfile,
    changePassword,
    initializeAuth,
  };
});