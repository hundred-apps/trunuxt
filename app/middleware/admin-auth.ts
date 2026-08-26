export default defineNuxtRouteMiddleware(async (to, from) => {
  const adminStore = useAdminStore();
  
  adminStore.initializeAuth();
  
  // If already have token but no admin data, try to fetch
  if (adminStore.token && !adminStore.admin) {
    try {
      await adminStore.fetchAdmin();
    } catch {
      // Token invalid, will redirect to login below
    }
  }
  
  // Check if authenticated
  if (!adminStore.isLoggedIn) {
    // Allow login page
    if (to.path === '/admin/login' || to.path === '/admin/forgot-password') {
      return;
    }
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  
  // Check RBAC if needed
  // const requiredPrivilege = to.meta.privilege as string;
  // if (requiredPrivilege && !adminStore.hasPrivilege(requiredPrivilege)) {
  //   return navigateTo('/admin?error=unauthorized');
  // }
});