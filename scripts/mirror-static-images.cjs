/**
 * Mirror gambar statis dari trumecs.com -> trunuxt/public/ dalam versi WebP.
 *
 * TUJUAN: saat development, gambar tidak bergantung pada kecepatan server
 * produksi (terukur 1-7 detik per file, dan ipx harus re-encode tiap request).
 * Setelah di-mirror, file-nya dilayani langsung oleh Nuxt dari public/.
 *
 * Yang di-mirror hanya aset STATIS (path-nya diketahui):
 *   tag/industries, banner/home-mobile, banner/promo-home, banner/category,
 *   image/product/noimage.png
 *
 * GambarDinamis (produk/artikel/promo dari API) tetap dari trumecs.com karena
 * tidak bisa dimirror semua.
 *
 * Jalankan: node scripts/mirror-static-images.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("D:/Program/laragon/www/trunuxt/node_modules/sharp");

const SRC = "https://www.trumecs.com";
const ROOT = "D:/Program/laragon/www/trunuxt";
const OUT = path.join(ROOT, "public");

const DIRS = [
  "tag/industries",
  "banner/home-mobile",
  "banner/promo-home",
  "banner/category",
];

const FILES = ["image/product/noimage.png"];

const QUALITY = 80;
const MOBILE_WIDTH = 800;
const TIMEOUT = 120000;

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const human = (n) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : kb(n);

async function download(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    headers: { "user-agent": "Mozilla/5.0 trunuxt-mirror" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveVariants(relDir, file, raw) {
  const outDir = path.join(OUT, relDir);
  fs.mkdirSync(outDir, { recursive: true });

  const name = path.basename(file, path.extname(file));
  let total = 0;

  // desktop
  const full = await sharp(raw).rotate().webp({ quality: QUALITY }).toBuffer();
  fs.writeFileSync(path.join(outDir, `${name}.webp`), full);
  total += full.length;

  // varian mobile
  const meta = await sharp(raw).metadata();
  if ((meta.width || 0) > MOBILE_WIDTH) {
    const mob = await sharp(raw)
      .rotate()
      .resize({ width: MOBILE_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    fs.writeFileSync(path.join(outDir, `${name}-mobile.webp`), mob);
    total += mob.length;
  }

  return { src: raw.length, out: total, w: meta.width, h: meta.height };
}

async function handle(relDir, file) {
  const url = `${SRC}/public/${relDir}/${file}`;
  try {
    const raw = await download(url);
    const r = await saveVariants(relDir, file, raw);
    console.log(
      `  ${file.padEnd(26)} ${human(r.src).padStart(8)} -> ${kb(r.out).padStart(8)}  ${r.w}x${r.h}`
    );
    return r;
  } catch (e) {
    console.log(`  GAGAL ${url} -> ${e.message}`);
    return null;
  }
}

// Ambil daftar file dari halaman direktori? Tidak ada listing publik,
// jadi kita ambil nama file dari API CI3 (tags/read & banner) atau dari
// sumber lokal trumecs-live sebagai daftar nama.
function listFromTrumecsLive(relDir) {
  const local = path.join("D:/Program/laragon/www/trumecs-live/public", relDir);
  if (!fs.existsSync(local)) return null;
  return fs
    .readdirSync(local)
    .filter((f) => /\.(png|jpe?g)$/i.test(f));
}

(async () => {
  let srcTotal = 0;
  let outTotal = 0;
  let count = 0;

  for (const dir of DIRS) {
    const list = listFromTrumecsLive(dir);
    if (!list || list.length === 0) {
      console.log(`SKIP ${dir} (tidak ada daftar file lokal)`);
      continue;
    }
    console.log(`\n[${dir}] ${list.length} file`);
    for (const file of list) {
      const r = await handle(dir, file);
      if (r) {
        srcTotal += r.src;
        outTotal += r.out;
        count += 1;
      }
    }
  }

  for (const f of FILES) {
    const dir = path.dirname(f);
    console.log(`\n[${f}]`);
    const r = await handle(dir, path.basename(f));
    if (r) {
      srcTotal += r.src;
      outTotal += r.out;
      count += 1;
    }
  }

  console.log("\n" + "=".repeat(56));
  console.log(`${count} file di-mirror ke trunuxt/public/`);
  console.log(`${human(srcTotal)} -> ${human(outTotal)}`);
  console.log("=".repeat(56));
})();
