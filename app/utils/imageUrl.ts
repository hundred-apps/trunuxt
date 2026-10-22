// utils/imageUrl.ts
// Resolver URL gambar untuk konten yang berasal dari API.
//
// LATAR BELAKANG:
// - Gambar produk/artikel/promo TIDAK bisa diambil dari URL lama
//   (https://www.trumecs.com/public/image/...) karena path itu milik web root
//   website lama (CI3) dan sudah dipindah.
// - Sekarang gambar dilayani langsung oleh server API:
//     https://migrationbe.trumecs.com/image/product/<file>
//     https://migrationbe.trumecs.com/image/artikel/<file>
//     https://migrationbe.trumecs.com/image/galery/<file>
//     https://migrationbe.trumecs.com/upload/categori/<file>
// - Supaya cepat & tidak bergantung ke server API, file ALSO di-mirror ke
//   trunuxt/public/ (scripts/mirror-api-images.cjs) -> "/image/product/<nama>.webp"
// - Urutan sumber: lokal (mirror) -> server API -> /image/noimage.png

export type ImageKind =
  | "product"
  | "galery"
  | "artikel"
  | "promo"
  | "category";

export type ImageSource = "local" | "remote";

export const NO_IMAGE = "/image/noimage.png";
export const NO_IMAGE_SMALL = "/image/noimage-small.jpg";

/** Server yang sekarang melayani file gambar. */
const REMOTE_SITE = "https://migrationbe.trumecs.com";

/** Folder di server API (path relatif dari root host). */
const REMOTE_DIR: Record<ImageKind, string> = {
  product: "image/product",
  galery: "image/galery",
  artikel: "image/artikel",
  promo: "image/promo",
  category: "upload/categori",
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
 * URL remote (server API).
 * Format ipx: /_ipx/<modifiers>/<url-asli>
 */
export function remoteImageUrl(kind: ImageKind, file: string): string {
  return `${REMOTE_SITE}/${REMOTE_DIR[kind]}/${encodeURIComponent(file)}`;
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
