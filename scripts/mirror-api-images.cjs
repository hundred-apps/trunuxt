/**
 * Mirror gambar produk/artikel/promo dari website lama (CI3) ke trunuxt/public/.
 *
 * KENAPA PERLU:
 * - Gambar produk TIDAK bisa diambil langsung dari www.trumecs.com karena
 *   path "/public/image/..." hanya ada di web root CI3 lama. Request publik
 *   ke path itu dibalas 404 ( aplikasi Nuxt sekarang tidak memetakan /public ).
 * - Sumber file yang utuh ada di repo website lama:
 *   D:/Program/laragon/www/trumecs-live/public
 * - File yang benar-benar hilang di sumber (bukan masalah URL) tidak akan
 *   muncul; frontend memakai fallback /image/noimage.png.
 *
 * YANG DI-MIRROR (hanya file yang dipakai API):
 *   image/product   -> gambar utama produk      (dari product-search)
 *   image/galery    -> galeri produk            (dari product/{id})
 *   image/artikel   -> gambar artikel           (dari article-read)
 *   image/promo     -> gambar promo             (dari promo-read)
 *   upload/categori -> gambar kategori & brand  (dari category-read)
 *
 * Output: WebP (desktop 1400px + varian mobile 800px) supaya ringan.
 *
 * Jalankan: node scripts/mirror-api-images.cjs
 * Opsi    : node scripts/mirror-api-images.cjs --force   (mirror ulang)
 */

const fs = require("fs");
const path = require("path");
const sharp = require("D:/Program/laragon/www/trunuxt/node_modules/sharp");

const ROOT = "D:/Program/laragon/www/trunuxt";
const OUT = path.join(ROOT, "public");
const LIVE = process.env.TRUMECS_LIVE_DIR || "D:/Program/laragon/www/trumecs-live/public";
const API = process.env.NUXT_API_URL || "https://migrationbe.trumecs.com/api/";
const FORCE = process.argv.includes("--force");

const QUALITY = 78;
const DESKTOP_WIDTH = 1400;
const MOBILE_WIDTH = 800;
const CONCURRENCY = 3;
const TIMEOUT = 300000;

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const human = (n) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : kb(n);

/** Ambil daftar file dari API (nama file saja). */
async function apiGet(pathname, body) {
  try {
    const res = await fetch(API + pathname, {
      method: body ? "POST" : "GET",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    return json;
  } catch (e) {
    console.error(`  API ${pathname} gagal: ${e.message}`);
    return null;
  }
}

function listLocal(dir) {
  try {
    return fs.readdirSync(path.join(LIVE, dir));
  } catch {
    return [];
  }
}

/** Cari file sumber berdasarkan nama (case-insensitive, mau berfolder atau tidak). */
function findSource(dirs, file) {
  const key = String(file).toLowerCase();
  for (const dir of dirs) {
    const list = listLocal(dir);
    const hit = list.find((f) => f.toLowerCase() === key);
    if (hit) return path.join(LIVE, dir, hit);
  }
  return null;
}

const baseName = (file) => file.replace(/\.[a-z0-9]+$/i, "");

/** Simpan versi webp (desktop + mobile). */
/**
 * Sumber gambar:
 * 1. website lama di disk (D:/Program/laragon/www/trumecs-live/public) - paling lengkap
 * 2. gateway ipx server produksi - untuk file yang hanya ada di server (mis. produk
 *    terbaru yang belum masuk ke salinan website lama)
 */
const PROD_SITE = "https://www.trumecs.com";

/** Folder di website lama per jenis gambar (path relatif web root). */
const REMOTE_DIR = {
  product: "public/image/product",
  galery: "public/image/galery",
  artikel: "public/image/artikel",
  promo: "public/image/promo",
  category: "public/upload/categori",
};

async function download(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    headers: { "user-agent": "Mozilla/5.0 trunuxt-mirror" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Ambil file dari server produksi lewat gateway ipx (webp). */
async function downloadFromProd(kind, file) {
  const src = `${PROD_SITE}/${REMOTE_DIR[kind]}/${encodeURIComponent(file)}`;
  const url = `${PROD_SITE}/_ipx/f_webp&q_90&s_1600x1600/${src}`;
  return download(url);
}

async function saveVariants(relDir, file, raw) {
  const outDir = path.join(OUT, relDir);
  fs.mkdirSync(outDir, { recursive: true });
  const name = baseName(file);

  const full = await sharp(raw)
    .rotate()
    .resize({ width: DESKTOP_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
  fs.writeFileSync(path.join(outDir, `${name}.webp`), full);

  const meta = await sharp(raw).metadata();
  let mob = 0;
  if ((meta.width || 0) > MOBILE_WIDTH) {
    const m = await sharp(raw)
      .rotate()
      .resize({ width: MOBILE_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    fs.writeFileSync(path.join(outDir, `${name}-mobile.webp`), m);
    mob = m.length;
  }
  return { src: raw.length, out: full.length + mob, w: meta.width, h: meta.height };
}

async function mirrorOne(relDir, dirs, file, kind) {
  const outFile = path.join(OUT, relDir, `${baseName(file)}.webp`);
  if (!FORCE && fs.existsSync(outFile))
    return { skipped: true, size: 0, file };

  const src = findSource(dirs, file);
  if (src) {
    const raw = fs.readFileSync(src);
    const r = await saveVariants(relDir, file, raw);
    return { ...r, file, from: "lokal" };
  }
  // fallback: ambil dari server produksi lewat ipx
  try {
    const raw = await downloadFromProd(kind, file);
    const r = await saveVariants(relDir, file, raw);
    return { ...r, file, from: "produksi" };
  } catch (e) {
    if (missingSamples.length < 3) missingSamples.push(`${file}: ${e.message}`);
    return null;
  }
}

// contoh error untuk file yang tidak ditemukan (3 pertama)
const missingSamples = [];

async function pool(items, worker, size = CONCURRENCY) {
  const out = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return out;
}

(async () => {
  if (!fs.existsSync(LIVE)) {
    console.error(
      `Folder website lama tidak ditemukan: ${LIVE}\n` +
        `Set env TRUMECS_LIVE_DIR ke folder public/ website lama.`
    );
    process.exit(1);
  }

  // ---------- kumpulkan nama file dari API ----------
  const jobs = { product: [], galery: [], artikel: [], promo: [], category: [] };

  // produk (halaman 1..N, 100 per halaman)
  let page = 1;
  let total = 0;
  const productDirs = ["image/product", "image/product----", "image/cache"];
  for (;;) {
    const res = await apiGet("product-search", {
      page,
      limit: 100,
      keyword: "",
      status: "show",
    });
    const list = res?.payload || [];
    if (!list.length) break;
    for (const p of list) {
      if (p.img && typeof p.img === "string") jobs.product.push(p.img);
    }
    total = res?.meta?.total || total;
    page += 1;
    if (page > 30) break;
  }
  console.log(`API: ${jobs.product.length} gambar produk`);

  // galeri: ambil dari detail produk (hanya produk yang punya galeri)
  const detailIds = [];
  const search = await apiGet("product-search", { page: 1, limit: 100, keyword: "" });
  for (const p of search?.payload || []) {
    if ((p.gallery_img || []).length) detailIds.push(p.id);
  }
  for (const id of detailIds) {
    const d = await apiGet(`product/${id}`);
    for (const g of d?.payload?.gallery_img || []) {
      if (g.img) jobs.galery.push(g.img);
    }
  }
  console.log(`API: ${jobs.galery.length} gambar galeri`);

  // artikel
  const art = await apiGet("article-read");
  const arts = [].concat(
    art?.payload?.list_article || [],
    art?.payload?.main_article || [],
    art?.payload?.trend_article || []
  );
  for (const a of arts) {
    if (a.img && !String(a.img).startsWith("http")) jobs.artikel.push(a.img);
  }
  console.log(`API: ${jobs.artikel.length} gambar artikel`);

  // promo
  const promo = await apiGet("promo-read");
  const promos = Array.isArray(promo?.payload)
    ? promo.payload
    : promo?.payload?.promo || promo?.payload?.data || [];
  for (const p of promos) {
    if (p.img && !String(p.img).startsWith("http")) jobs.promo.push(p.img);
  }
  console.log(`API: ${jobs.promo.length} gambar promo`);

  // kategori + brand
  const cat = await apiGet("category-read");
  const flat = [];
  const walk = (nodes) => {
    for (const n of nodes || []) {
      flat.push(n);
      if (n.children) walk(n.children);
    }
  };
  walk(cat?.payload?.category?.products || []);
  for (const c of flat) if (c.img) jobs.category.push(c.img);
  for (const b of cat?.payload?.category?.brands || []) {
    if (b.img) jobs.category.push(b.img);
  }
  console.log(`API: ${jobs.category.length} gambar kategori/brand`);

  // ---------- mirror ----------
  const plan = [
    { kind: "product", rel: "image/product", dirs: productDirs },
    { kind: "galery", rel: "image/galery", dirs: ["image/galery", "image/cache"] },
    { kind: "artikel", rel: "image/artikel", dirs: ["image/artikel"] },
    { kind: "promo", rel: "image/promo", dirs: ["image/promo"] },
    { kind: "category", rel: "upload/categori", dirs: ["upload/categori", "image/upload"] },
  ];

  let totalFiles = 0;
  let totalOut = 0;
  const manifest = {};

  for (const { kind, rel, dirs } of plan) {
    const unique = Array.from(new Set(jobs[kind]));
    if (!unique.length) continue;
    console.log(`\n[${rel}] ${unique.length} file_unique`);
    const results = await pool(unique, (file) => mirrorOne(rel, dirs, file, kind));
    let ok = 0;
    let miss = 0;
    let bytes = 0;
    const names = [];
    for (const r of results) {
      if (r) {
        ok += 1;
        bytes += r.out || 0;
        names.push(`${baseName(r.file)}.webp`);
      } else {
        miss += 1;
      }
    }
    manifest[kind] = names;
    totalFiles += ok;
    totalOut += bytes;
    const fromProd = results.filter((r) => r && r.from === "produksi").length;
    console.log(
      `  -> ${ok} di-mirror (${human(bytes)}; ${fromProd} dari server produksi), ${miss} tidak ada di mana pun`
    );
    for (const m of missingSamples.splice(0)) console.log("     contoh error:", m);
  }

  // manifest: daftar file yang tersedia lokal (dipakai frontend)
  fs.writeFileSync(
    path.join(OUT, "image", "manifest.json"),
    JSON.stringify(manifest, null, 0)
  );
  console.log("\nmanifest -> public/image/manifest.json");

  console.log("\n" + "=".repeat(56));
  console.log(`${totalFiles} file di-mirror, total ${human(totalOut)}`);
  console.log("=".repeat(56));
})();
