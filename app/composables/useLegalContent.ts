import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { LocaleCode } from "~/content/legal/types";
import { terms } from "~/content/legal/terms";
import { privacy } from "~/content/legal/privacy";
import { faq } from "~/content/legal/faq";

/**
 * Mengambil konten halaman legal sesuai locale aktif.
 * Kodul lokal yang tidak dikenali akan jatuh ke "id".
 */
export function useLegalContent() {
  const { locale } = useI18n();

  const current = computed<LocaleCode>(() => {
    const code = String(locale.value || "id").toLowerCase() as LocaleCode;
    return code === "en" || code === "zh" ? code : "id";
  });

  const termsContent = computed(() => terms[current.value]);
  const privacyContent = computed(() => privacy[current.value]);
  const faqContent = computed(() => faq[current.value]);

  return {
    current,
    termsContent,
    privacyContent,
    faqContent,
  };
}
