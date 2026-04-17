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

  const trackClickLink = (value: string) => {
    trackEvent("click_link", { value });
  };

  const trackClickLinkMobile = (value: string) => {
    trackEvent("click_link_mobile", { value });
  };

  const trackClickButton = (value: string) => {
    trackEvent("button_click", { value });
  };

  const trackClickButtonMobile = (value: string) => {
    trackEvent("button_click_mobile", { value });
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
    trackClickLinkMobile,
    trackClickLink,
    trackClickButton,
    trackClickButtonMobile,
    trackClickCategory,
  };
};
