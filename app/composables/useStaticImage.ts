/**
 * Resolver URL gambar statis.
 *
 * Aset statis (tag/industries + banner/*) sudah di-mirror ke
 * trunuxt/public/ dalam format WebP oleh scripts/mirror-static-images.cjs.
 * Kalau path-nya termasuk folder yang sudah di-mirror, pakai file lokal
 * (dilayani langsung oleh dev server / .output, cepat, tidak bergantung
 * pada kecepatan trumecs.com dan tidak perlu encode ulang lewat /_ipx/).
 *
 * Folder lain (produk, artikel, promo, galeri) tetap dari trumecs.com
 * karena berasal dari API dan tidak bisa dimirror semuanya.
 */

const CONFIG = {
  base: "",
  dirs: [
    "/public/tag/industries",
    "/public/banner/home-mobile",
    "/public/banner/promo-home",
    "/public/banner/category",
  ],
};

export interface StaticImageApi {
  /** URL absolut untuk path gambar (webp bila tersedia, else sumber asli). */
  resolve: (rawPath: string | null | undefined) => string;
  /** true bila path-nya dilayani dari mirror lokal. */
  isLocal: (rawPath: string | null | undefined) => boolean;
  /** srcset untuk dua varian: -mobile.webp (800w) + webp penuh. */
  srcset: (rawPath: string | null | undefined) => string | undefined;
  /** Error untuk assets/produk yang tidak pernah dimirror. */
  onError: (e: Event) => void;
}

export function useStaticImage(): StaticImageApi {
  const config = useRuntimeConfig();

  const base = () =>
    (config.public.staticImgBase as string | undefined) ?? CONFIG.base;
  const dirs = () =>
    (config.public.staticImgDirs as string[] | undefined) ?? CONFIG.dirs;

  const stripHost = (raw: string): string => {
    let p = raw.trim();
    // buang query/hash
    p = p.split("?")[0].split("#")[0];
    // buang host trumecs.com / base siteUrl
    p = p.replace(/^https?:\/\/[^/]+/i, "");
    // normalisasi: pastikan diawali /
    if (!p.startsWith("/")) p = `/${p}`;
    // Di CI3 folder "public" adalah web root (URL /public/tag/...),
    // sedangkan di Nuxt folder public/ dilayani dari "/".
    // Jadi prefix /public harus dibuang supaya filenya ketemu.
    p = p.replace(/^\/public(?=\/)/, "");
    return p;
  };

  /** ganti ekstensi .jpg/.jpeg -> .webp (biarkan .png/.webp apa adanya). */
  const toWebp = (p: string) =>
    p.replace(/\.(jpe?g|png)$/i, (ext) =>
      ext.toLowerCase().startsWith(".jpe") ? ".webp" : ".webp"
    );

  const isLocal = (raw: string | null | undefined): boolean => {
    if (!raw) return false;
    // cek sebelum /public/ dilepas supaya Cocos folder tetap cocok
    const rawPath = raw.replace(/^https?:\/\/[^/]+/i, "");
    return dirs().some((d) => rawPath.startsWith(d));
  };

  const resolve = (raw: string | null | undefined): string => {
    if (!raw) return "";
    if (!isLocal(raw)) {
      // bukan aset statis -> tetap remote
      const p = raw.trim();
      return p.startsWith("http") ? p : `https://www.trumecs.com${p.startsWith("/") ? p : `/${p}`}`;
    }
    return `${base()}${toWebp(stripHost(raw))}`;
  };

  const srcset = (raw: string | null | undefined): string | undefined => {
    if (!raw || !isLocal(raw)) return undefined;
    const webp = toWebp(stripHost(raw));
    const b = base();
    const mobile = webp.replace(/\.webp$/, "-mobile.webp");
    return `${b}${mobile} 800w, ${b}${webp} 1024w`;
  };

  const onError = (e: Event) => {
    const el = e.target as HTMLImageElement;
    if (!el) return;
    el.style.display = "none";
  };

  return { resolve, isLocal, srcset, onError };
}
