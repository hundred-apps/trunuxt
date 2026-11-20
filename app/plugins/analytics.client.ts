export default defineNuxtPlugin(() => {
  window.dataLayer = window.dataLayer || [];

  const {
    trackEvent,
    trackClickLink,
    trackClickLinkMobile,
    trackClickButton,
    trackClickButtonMobile,
    trackWhatsAppClick,
  } = useAnalytics();

  const router = useRouter();

  router.afterEach((to) => {
    const pageNumber = Number(to.query.page);
    const searchTerm =
      (to.query.q as string) ||
      (to.query.nama as string) ||
      (to.query.keyword as string) ||
      "";

    trackEvent("page_view", {
      page: to.fullPath,
      page_path: to.fullPath,
      page_title: document.title,
      ...(searchTerm ? { search_term: searchTerm } : {}),
      ...(Number.isFinite(pageNumber) && pageNumber > 0
        ? { page_number: pageNumber }
        : {}),
    });
  });

  const isMobile = () => window.innerWidth < 1024;

  const labelOf = (el: Element): string => {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 120);
  };

  const isWhatsAppHref = (href: string) =>
    /wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp:\/\//i.test(href);

  const phoneFromWaHref = (href: string): string => {
    const match = href.match(/(?:wa\.me\/|phone=)([+\d]+)/i);
    return match ? match[1].replace(/\D/g, "") : "";
  };

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null;
    if (!target || typeof target.closest !== "function") return;

    const manual = target.closest("[data-no-analytics]");
    if (manual) return;

    // ---- Deteksi klik WhatsApp (link wa.me maupun tombol ber-atribut) ----
    const waMarked = target.closest<HTMLElement>("[data-wa-source]");
    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    const href = anchor?.getAttribute("href") || "";
    const waByHref = !!href && isWhatsAppHref(href);

    if (waMarked || waByHref) {
      const el = waMarked || anchor;
      trackWhatsAppClick(el?.getAttribute("data-wa-source") || "link", {
        phone:
          phoneFromWaHref(href) ||
          el?.getAttribute("data-wa-phone") ||
          "",
        link_url: href || el?.getAttribute("data-wa-url") || "",
        product_id: el?.getAttribute("data-wa-product-id") || "",
        product_title: el?.getAttribute("data-wa-product-title") || "",
        page_path: window.location.pathname,
      });
      return;
    }

    const card = target.closest<HTMLElement>("[data-track-card]");
    if (card) {
      const title =
        card.getAttribute("data-track-title") || labelOf(card) || "";
      trackEvent("card_click", {
        card_type: card.getAttribute("data-track-card") || "",
        card_id: card.getAttribute("data-track-id") || "",
        card_title: title,
        value: title,
      });
    }

    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (link) {
      const value = labelOf(link) || link.getAttribute("href") || "";
      if (isMobile()) {
        trackClickLinkMobile(value);
      } else {
        trackClickLink(value);
      }
      return;
    }

    const button = target.closest<HTMLElement>(
      "button, [role=button], [role=menuitem], .el-dropdown-menu__item, .el-button, input[type=submit]"
    );
    if (button) {
      const value = labelOf(button) || "button";
      if (isMobile()) {
        trackClickButtonMobile(value);
      } else {
        trackClickButton(value);
      }
    }
  });
});
