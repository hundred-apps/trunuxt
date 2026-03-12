export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  router.afterEach((to) => {
    window.dataLayer.push({
      event: "page_view",
      page: to.fullPath,
    });
  });
});
