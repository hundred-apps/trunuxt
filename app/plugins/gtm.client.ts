export default defineNuxtPlugin(() => {
  window.dataLayer = window.dataLayer || [];

  function gtmPush(event: any) {
    window.dataLayer.push(event);
  }

  return {
    provide: {
      gtmPush,
    },
  };
});
