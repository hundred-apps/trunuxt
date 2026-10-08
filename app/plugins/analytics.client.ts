export default defineNuxtPlugin(() => {
  window.dataLayer = window.dataLayer || [];

  const {
    trackEvent,
    trackClickLink,
    trackClickLinkMobile,
    trackClickButton,
    trackClickButtonMobile,
  } = useAnalytics();

  const router = useRouter();

  router.afterEach((to) => {
    trackEvent("page_view", {
      page: to.fullPath,
      page_path: to.fullPath,
      page_title: document.title,
    });
  });

  const isMobile = () => window.innerWidth < 1024;

  const labelOf = (el: Element): string => {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 120);
  };

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null;
    if (!target || typeof target.closest !== "function") return;

    const manual = target.closest("[data-no-analytics]");
    if (manual) return;

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
