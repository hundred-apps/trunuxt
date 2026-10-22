// utils/imageUrl.ts
// Resolver URL gambar untuk konten yang berasal dari API.
//
// LATAR BELAKANG:
// - Gambar produk/artikel/promo TIDAK bisa diambil langsung dari
//   https://www.trumecs.com/public/image/... karena path itu milik web root
//   website lama (CI3). Request publik ke sana dibalas 404.
// - File yang utuh ada di website lama, sudah di-mirror ke trunuxt/public/
//   (lihat scripts/mirror-api-images.cjs) -> "/image/product/<nama>.webp".
// - Sisanya (mis. file yang tidak ada di sumber, atau artikel yang hanya ada
//   di server produksi) diambil lewat gateway ipx milik server produksi:
//   https://www.trumecs.com/_ipx/<modifier>/<url-asli>
// - Kalau semuanya gagal -> /image/noimage.png (fallback lokal).

export type ImageKind =
  | "product"
  | "galery"
  | "artikel"
  | "promo"
  | "category";

export type ImageSource = "local" | "remote";

export const NO_IMAGE = "/image/noimage.png";
export const NO_IMAGE_SMALL = "/image/noimage-small.jpg";

const REMOTE_SITE = "https://www.trumecs.com";

/** Folder di website lama (path relatif dari web root). */
const REMOTE_DIR: Record<ImageKind, string> = {
  product: "public/image/product",
  galery: "public/image/galery",
  artikel: "public/image/artikel",
  promo: "public/image/promo",
  category: "public/upload/categori",
};

/** Folder hasil mirror di trunuxt/public. */
const LOCAL_DIR: Record<ImageKind, string> = {
  product: "image/product",
  galery: "image/galery",
  artikel: "image/artikel",
  promo: "image/promo",
  category: "upload/categori",
};

/**
 * Urutan sumber gambar.
 * 1. file lokal hasil mirror (di-optimasi ipx lokal kalau lewat <NuxtImg>)
 * 2. gateway ipx server produksi (untuk file yang tidak ada di mirror lokal)
 * 3. /image/noimage.png
 */
const ORDER: Record<ImageKind, ImageSource[]> = {
  product: ["local", "remote"],
  galery: ["local", "remote"],
  promo: ["local", "remote"],
  artikel: ["local", "remote"],
  category: ["local", "remote"],
};

const DESKTOP_WIDTH = 1400;
const MOBILE_WIDTH = 800;

/** Buang ekstensi -> nama dasar file. */
export function imageBaseName(file: string): string {
  return String(file).replace(/\.[a-z0-9]+$/i, "");
}

/** Apakah nilainya sudah berupa URL lengkap? */
export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(String(value).trim());
}

/** URL lokal hasil mirror: /image/product/<nama>.webp */
export function localImageUrl(kind: ImageKind, file: string): string {
  return `/${LOCAL_DIR[kind]}/${imageBaseName(file)}.webp`;
}

/**
 * URL remote lewat gateway ipx milik server produksi.
 * Format ipx: /_ipx/<modifiers>/<url-asli>
 */
export function remoteImageUrl(kind: ImageKind, file: string): string {
  const src = `${REMOTE_SITE}/${REMOTE_DIR[kind]}/${encodeURIComponent(file)}`;
  return `${REMOTE_SITE}/_ipx/f_webp&q_78&s_${DESKTOP_WIDTH}x${DESKTOP_WIDTH}/${src}`;
}

/** Rantai sumber untuk satu gambar (sesuai urutan jenis). */
export function imageSources(kind: ImageKind, file: string): string[] {
  const raw = String(file || "").trim();
  if (!raw) return [NO_IMAGE];
  // sudah URL lengkap (mis. artikel yang disimpan sebagai URL) -> pakai apa adanya
  if (isAbsoluteUrl(raw)) return [raw];
  return ORDER[kind].map((source) =>
    source === "local"
      ? localImageUrl(kind, raw)
      : remoteImageUrl(kind, raw)
  );
}

/** Src pertama (yang dipakai <img src>). */
export function imageSrc(kind: ImageKind, file: string | null | undefined): string {
  const raw = String(file || "").trim();
  if (!raw) return NO_IMAGE;
  return imageSources(kind, raw)[0];
}

/**
 * Srcset untuk varian lokal (desktop + mobile).
 * Sumber remote sudah dioptimasi oleh ipx produksi, jadi tidak perlu srcset.
 */
export function imageSrcset(
  kind: ImageKind,
  file: string | null | undefined
): string | undefined {
  const raw = String(file || "").trim();
  if (!raw || isAbsoluteUrl(raw)) return undefined;
  if (ORDER[kind][0] !== "local") return undefined;
  const local = localImageUrl(kind, raw);
  const mobile = local.replace(/\.webp$/, "-mobile.webp");
  return `${mobile} ${MOBILE_WIDTH}w, ${local} ${DESKTOP_WIDTH}w`;
}

/**
 * URL thumbnail kecil.
 * - sumber lokal  -> ipx lokal resize on-demand (/_ipx/... + path lokal)
 * - sumber remote -> ipx produksi dengan ukuran kecil
 */
export function imageThumbUrl(
  kind: ImageKind,
  file: string | null | undefined,
  size = 160
): string {
  const raw = String(file || "").trim();
  if (!raw) return NO_IMAGE_SMALL;
  if (isAbsoluteUrl(raw)) return raw;
  // ipx lokal: resize file hasil mirror jadi kecil
  return `/_ipx/f_webp&q_70&s_${size}x${size}${localImageUrl(kind, raw)}`;
}

/** Atribut data untuk dipakai handler error global. */
export function imageDataAttrs(
  kind: ImageKind,
  file: string | null | undefined
): Record<string, string> {
  const raw = String(file || "").trim();
  if (!raw) return {};
  return { "data-img-kind": kind, "data-img-file": raw };
}

/**
 * Lanjut ke sumber berikutnya saat gambar gagal dimuat.
 * Dipakai plugin global (app/plugins/image-fallback.client.ts).
 */
export function nextImageSource(el: HTMLImageElement): string | null {
  const kind = el.dataset.imgKind as ImageKind | undefined;
  const file = el.dataset.imgFile;
  if (!kind || !file) return null;
  const sources = imageSources(kind, file);
  const step = Number(el.dataset.imgStep || "0");
  const next = step + 1;
  if (next < sources.length) {
    el.dataset.imgStep = String(next);
    return sources[next];
  }
  el.dataset.imgStep = "done";
  return NO_IMAGE;
}
