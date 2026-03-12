export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.afterEach((to) => {
    window.dataLayer.push({
      event: "page_view",
      page_path: to.fullPath,
      page_title: document.title,
    });
  });
});
