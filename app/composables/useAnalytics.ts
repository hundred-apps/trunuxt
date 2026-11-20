export const useAnalytics = () => {
  const { gtag } = useGtag();

  const trackEvent = (event: string, params: Record<string, any> = {}) => {
    if (!import.meta.client) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...params,
    });

    // Kirim juga langsung ke GA4 lewat gtag (nuxt-gtag).
    // Push dataLayer di atas tetap dipertahankan untuk kompatibilitas GTM.
    try {
      gtag("event", event, params);
    } catch {
      // gtag belum siap / diblokir — abaikan, jangan sampai mengganggu UI.
    }
  };

  const trackLogin = (method: string) => {
    trackEvent("login", { method });
  };

  const trackRegister = (method: string) => {
    trackEvent("sign_up", { method });
  };

  /**
   * Klik link. `params` opsional untuk konteks tambahan, mis.
   * link_source, link_url, link_type, item_id, item_name, page_path.
   */
  const trackClickLink = (value: string, params: Record<string, any> = {}) => {
    trackEvent("click_link", { link_label: value, ...params });
  };

  const trackClickLinkMobile = (
    value: string,
    params: Record<string, any> = {}
  ) => {
    trackEvent("click_link_mobile", { link_label: value, ...params });
  };

  const trackClickButton = (
    value: string,
    params: Record<string, any> = {}
  ) => {
    trackEvent("button_click", { button_label: value, ...params });
  };

  const trackClickButtonMobile = (
    value: string,
    params: Record<string, any> = {}
  ) => {
    trackEvent("button_click_mobile", { button_label: value, ...params });
  };

  const trackClickCategory = (
    category: string,
    subcategory?: string,
    subsubcategory?: string
  ) => {
    trackEvent("category_click", { category, subcategory, subsubcategory });
  };

  /**
   * Event khusus klik WhatsApp.
   * source: lokasi tombol/link, mis. "product_detail", "navbar", "footer".
   * params: phone, product_id, product_title, link_url, page_path, dst.
   */
  const trackWhatsAppClick = (
    source: string,
    params: Record<string, any> = {}
  ) => {
    trackEvent("whatsapp_click", {
      link_source: source,
      ...params,
    });
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
    trackWhatsAppClick,
  };
};
