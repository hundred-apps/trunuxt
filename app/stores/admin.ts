import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig } from "#app";

function readCookie(name: string): string | null {
  if (!import.meta.client) return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  if (!import.meta.client) return;
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; path=/; max-age=2592000; SameSite=Lax";
}

function clearCookie(name: string) {
  if (!import.meta.client) return;
  document.cookie = name + "=; path=/; max-age=0; SameSite=Lax";
}

interface Admin {
  id: number;
  name: string;
  email: string;
  privileges: string;
  billy?: string;
  phone?: string;
  trumecs_email?: string;
  whatsapp?: string;
  point?: string;
  created_at?: string;
  updated_at?: string | null;
}

export const useAdminStore = defineStore("admin", () => {
  const config = useRuntimeConfig();
  const admin = ref<Admin | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value && !!admin.value);
  const currentAdmin = computed(() => admin.value);
  const hasPrivilege = (privilege: string) =>
    admin.value?.privileges.includes(privilege) || false;

  function setToken(newToken: string) {
    token.value = newToken;
    if (import.meta.client) {
      localStorage.setItem("admin_token", newToken);
      setCookie("admin_token", newToken);
    }
  }

  function clearToken() {
    token.value = null;
    admin.value = null;
    if (import.meta.client) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      clearCookie("admin_token");
    }
  }

  function unwrapData<T>(res: any): T {
    return res?.data && typeof res.data === "object" ? res.data : res;
  }

  async function login(credentials: { email: string; password: string }) {
    loading.value = true;
    try {
      const response = await $fetch<{ data: Admin; token: string }>(
        `${config.public.baseURL}admin/login`,
        {
          method: "POST",
          body: credentials,
        }
      );
      const adminData = unwrapData<Admin>(response);
      setToken(response.token);
      admin.value = adminData;
      if (import.meta.client) {
        localStorage.setItem("admin_data", JSON.stringify(adminData));
      }
      return adminData;
    } catch (e: any) {
      throw new Error(e.data?.message || "Login failed");
    } finally {
      loading.value = false;
    }
  }

  function decodeToken(token: string): { id?: number; email?: string } | null {
    try {
      const part = token.split(".")[1];
      if (!part) return null;
      const padded = part.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(escape(atob(padded)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  async function fetchAdmin() {
    if (!token.value) return;
    try {
      const response = await $fetch<{
        status: boolean;
        message: string;
        payload: Admin[];
      }>(`${config.public.baseURL}/admin/read`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      const claims = decodeToken(token.value);
      const current = (response.payload || []).find(
        (item) => item.id === claims?.id
      );
      if (current) {
        admin.value = current;
        if (import.meta.client) {
          localStorage.setItem("admin_data", JSON.stringify(current));
        }
      } else {
        clearToken();
      }
    } catch {
      clearToken();
    }
  }

  async function logout() {
    try {
      await $fetch(`${config.public.baseURL}admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch {
      // Ignore logout API errors
    } finally {
      clearToken();
    }
  }

  async function updateProfile(data: Partial<Admin>) {
    const response = await $fetch<Admin>(
      `${config.public.baseURL}admin/profile`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token.value}` },
        body: data,
      }
    );
    admin.value = unwrapData<Admin>(response);
    if (import.meta.client) {
      localStorage.setItem("admin_data", JSON.stringify(admin.value));
    }
    return admin.value;
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await $fetch(`${config.public.baseURL}admin/change-password`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { currentPassword, newPassword },
    });
  }

  async function forgotPassword(email: string) {
    await $fetch(`${config.public.baseURL}admin/forgot-password`, {
      method: "POST",
      body: { email },
      headers: { "Content-Type": "application/json" },
    });
  }

  function initializeAuth() {
    if (!import.meta.client) return;
    try {
      const storedToken = localStorage.getItem("admin_token");
      const storedAdmin = localStorage.getItem("admin_data");
      if (storedToken && storedAdmin) {
        const parsed = JSON.parse(storedAdmin);
        if (parsed && typeof parsed === "object") {
          token.value = storedToken;
          admin.value = parsed;
          return;
        }
      }
    } catch {
      // corrupted stored admin data, fall through to cookie fallback
      localStorage.removeItem("admin_data");
    }
    const cookieToken = readCookie("admin_token") || readCookie("access_token");
    if (cookieToken) {
      token.value = cookieToken;
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
    forgotPassword,
    initializeAuth,
  };
});
