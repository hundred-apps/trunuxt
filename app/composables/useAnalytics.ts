import type { st } from "vue-router/dist/router-CWoNjPRp.mjs";

export const useAnalytics = () => {
  const trackEvent = (event: string, params: any = {}) => {
    window.dataLayer.push({
      event,
      ...params,
    });
  };

  const trackLogin = (method: string) => {
    trackEvent("login", { method });
  };

  const trackRegister = (method: string) => {
    trackEvent("sign_up", { method });
  };

  const trackClick = (label: string) => {
    trackEvent("click", { label });
  };

  const trackClickButton = (label: string) => {
    trackEvent("button_click", { label });
  };

  const trackClickCategory = (
    category: string,
    subcategory?: string,
    subsubcategory?: string
  ) => {
    trackEvent("category_click", { category, subcategory, subsubcategory });
  };

  return {
    trackEvent,
    trackLogin,
    trackRegister,
    trackClick,
    trackClickButton,
    trackClickCategory,
  };
};
