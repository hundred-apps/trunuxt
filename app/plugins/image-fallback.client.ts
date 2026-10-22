// plugins/image-fallback.client.ts
// Fallback global untuk gambar yang gagal dimuat.
//
// Rantai sumber gambar (lihat utils/imageUrl.ts):
//   1. file lokal hasil mirror (public/image/...)
//   2. gateway ipx server produksi
//   3. /image/noimage.png (fallback lokal)
//
// Elemen <img> yang gagal dimuat akan otomatis dicoba ke sumber berikutnya
// lewat atribut data-img-kind / data-img-file.

import { nextImageSource } from "~/utils/imageUrl";

export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  window.addEventListener(
    "error",
    (event) => {
      const el = event.target as HTMLImageElement | null;
      if (!el || el.tagName !== "IMG") return;
      if (!el.dataset.imgKind) return;
      // jangan loop endlessly
      if (el.dataset.imgStep === "done") return;
      const next = nextImageSource(el);
      if (!next) return;
      el.src = next;
    },
    true
  );
});
