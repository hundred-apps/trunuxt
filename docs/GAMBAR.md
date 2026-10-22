# Gambar Produk & Artikel

## Kenapa gambar sering tidak muncul?

Semua gambar konten (produk, artikel, promo, kategori) berasal dari **website lama**
(CI3) dan hanya disimpan sebagai **nama file** di database API. File-nya ada di
server `www.trumecs.com` dengan struktur web root CI3:

```
/public/image/product/<md5>.jpg
/public/image/galery/<md5>.jpg
/public/image/artikel/<file>
/public/image/promo/<file>
/public/upload/categori/<file>
```

Request langsung ke `https://www.trumecs.com/public/image/...` **balas 404**,
karena `www.trumecs.com` sekarang aplikasi Nuxt yang tidak memetakan prefix
`/public`. File-nya sendiri masih ada dan bisa diambil lewat gateway optimasi
`/_ipx/<modifier>/<url-asli>`.

## Solusi di trunuxt

1. **Mirror lokal** — file yang dipakai API disalin dari website lama ke
   `trunuxt/public/` dalam format WebP (1400px + varian mobile 800px):

   ```bash
   npm run mirror:images          # lewati file yang sudah ada
   npm run mirror:images:force    # mirror ulang
   ```

   Sumber: `D:/Program/laragon/www/trumecs-live/public` (bisa diubah lewat env
   `TRUMECS_LIVE_DIR`). File yang tidak ada di sana dicoba dari server produksi
   lewat gateway ipx.

   Hasil saat ini: 1954/2024 gambar produk, 16/16 artikel, 19/47 kategori+brand.
   Sisanya memang tidak ada di server mana pun -> tampil `noimage.png`.

2. **Rantai fallback** (`app/utils/imageUrl.ts` + `app/plugins/image-fallback.client.ts`):

   ```
   file lokal (public/image/...)  ->  ipx server produksi  ->  /image/noimage.png
   ```

   Dipakai lewat composable:

   ```vue
   <img :src="imgSrc('product', product.img)" v-bind="imgAttrs('product', product.img)" />
   ```

   `imgAttrs` menandai elemen dengan `data-img-kind` / `data-img-file`, lalu
   plugin global menukar `src` ke sumber berikutnya saat gambar gagal dimuat.

3. **Thumbnail** memakai ipx lokal (`/_ipx/f_webp&q_70&s_160x160/...`) —
   endpoint `timthumb` lama sudah 404.

## Kalau gambar produk baru ditambah

Jalankan ulang `npm run mirror:images` — file baru yang belum ada di `public/`
akan diunduh otomatis (dari website lama, atau dari server produksi).
