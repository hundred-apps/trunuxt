import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRuntimeConfig } from '#app';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const pendingVerificationEmail = ref<string | null>(null);

  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '');
  const userInitials = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase();
  });

  function setToken(newToken: string) {
    token.value = newToken;
    if (import.meta.client) {
      localStorage.setItem('auth_token', newToken);
    }
  }

  function clearToken() {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await $fetch<User>(`${config.public.baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      user.value = response;
      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response));
      }
    } catch {
      clearToken();
    }
  }

  async function login(credentials: { email: string; password: string; remember: boolean }) {
    const response = await $fetch<{ user: User; token: string }>(
      `${config.public.baseURL}/auth/login`,
      {
        method: 'POST',
        body: credentials,
      }
    );
    setToken(response.token);
    user.value = response.user;
    if (import.meta.client) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  }

  async function register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    password: string;
  }) {
    const response = await $fetch<{ user: User; token: string }>(
      `${config.public.baseURL}/auth/register`,
      {
        method: 'POST',
        body: data,
      }
    );
    setToken(response.token);
    user.value = response.user;
    pendingVerificationEmail.value = data.email;
    if (import.meta.client) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  }

  async function logout() {
    try {
      await $fetch(`${config.public.baseURL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch {
      // Ignore logout API errors
    } finally {
      clearToken();
    }
  }

  async function forgotPassword(email: string) {
    await $fetch(`${config.public.baseURL}/auth/forgot-password`, {
      method: 'POST',
      body: { email },
    });
  }

  async function resetPassword(token: string, password: string, confirmPassword: string) {
    await $fetch(`${config.public.baseURL}/auth/reset-password`, {
      method: 'POST',
      body: { token, password, confirmPassword },
    });
  }

  async function verifyEmail(verificationToken: string) {
    await $fetch(`${config.public.baseURL}/auth/verify-email`, {
      method: 'POST',
      body: { token: verificationToken },
    });
  }

  async function resendVerification(email: string) {
    await $fetch(`${config.public.baseURL}/auth/resend-verification`, {
      method: 'POST',
      body: { email },
    });
  }

  function getPendingVerificationEmail() {
    return pendingVerificationEmail.value;
  }

  function updateProfile(data: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...data };
      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(user.value));
      }
    }
  }

  function initializeAuth() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      }
    }
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    userName,
    userInitials,
    setToken,
    clearToken,
    fetchUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getPendingVerificationEmail,
    updateProfile,
    initializeAuth,
  };
});