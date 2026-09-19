import { ElMessage } from "element-plus";

const MEMBER_PUBLIC_PATHS = [
  "/member/login",
  "/member/register",
  "/member/forgot-password",
  "/member/verify-email",
];

const redirectToLogin = (to: any, loginPath: string, t?: (key: string) => string) => {
  if (import.meta.client) {
    const msg = t ? t("auth.notLoggedIn") : "Belum login";
    ElMessage.warning(msg);
  }
  return navigateTo(`${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`);
};

export default defineNuxtRouteMiddleware(async (to) => {
  const path = to.path;

  if (!path.startsWith("/admin") && !path.startsWith("/member")) {
    return;
  }

  if (path === "/admin/login" || path === "/admin/forgot-password") {
    return;
  }
  if (MEMBER_PUBLIC_PATHS.includes(path)) {
    return;
  }

  const nuxtApp = useNuxtApp();
  const t = (key: string) => nuxtApp.$i18n?.t?.(key) ?? key;

  try {
    if (path.startsWith("/admin")) {
      const adminStore = useAdminStore();
      adminStore.initializeAuth();

      if (adminStore.token && !adminStore.admin) {
        try {
          await adminStore.fetchAdmin();
        } catch {
          // Token invalid, will redirect below
        }
      }

      if (adminStore.isLoggedIn) return;
      return redirectToLogin(to, "/admin/login", t);
    }

    if (path.startsWith("/member")) {
      const authStore = useAuthStore();
      authStore.initializeAuth();

      if (authStore.token && !authStore.user) {
        try {
          await authStore.fetchUser();
        } catch {
          // Token invalid, will redirect below
        }
      }

      if (authStore.isLoggedIn) return;
      return redirectToLogin(to, "/member/login", t);
    }
  } catch (e) {
    if (import.meta.client) {
      console.error("Auth middleware error:", e);
    }
    return redirectToLogin(to, path.startsWith("/admin") ? "/admin/login" : "/member/login", t);
  }
});