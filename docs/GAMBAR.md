# Gambar Produk & Artikel

## Di mana gambarnya?

Gambar konten (produk, artikel, promo, kategori) **dipakai langsung dari server API**:

```
https://migrationbe.trumecs.com/image/product/<file>.jpg
https://migrationbe.trumecs.com/image/galery/<file>.jpg
https://migrationbe.trumecs.com/image/artikel/<file>
https://migrationbe.trumecs.com/upload/categori/<file>
```

Database API hanya menyimpan **nama file** (contoh: `img` = `c9137ad81aa302af00a9e82568dcc77b.jpg`).

URL lama `https://www.trumecs.com/public/image/...` sudah tidak dipakai — path itu
web root website lama (CI3) dan sekarang **404**.

## Kenapa ada mirror lokal?

Supaya halaman cepat dan tidak bergantung ke server API, file yang dipakai API
di-*mirror* ke `trunuxt/public/` dalam format WebP (1400px + varian mobile 800px):

```bash
npm run mirror:images          # lewati file yang sudah ada
npm run mirror:images:force    # mirror ulang
```

Sumber mirror (berurutan):
1. `https://migrationbe.trumecs.com/<folder>/<file>` (server API, lengkap)
2. `D:/Program/laragon/www/trumecs-live/public` (website lama, cadangan) — bisa
   diubah lewat env `TRUMECS_LIVE_DIR`

Status saat ini:

| Jenis | Ter-mirror | Keterangan |
|---|---|---|
| produk | 2013 / 2024 | 11 file tidak ada di server mana pun |
| galeri | 119 / 133 | 14 file tidak ada di server mana pun |
| artikel | 16 / 16 | ✅ |
| kategori + brand | 20 / 47 | 27 icon brand tidak ada di server mana pun |

Sisa file yang tidak ada akan otomatis menampilkan `/image/noimage.png`.

## Rantai fallback

`app/utils/imageUrl.ts` + `app/plugins/image-fallback.client.ts`:

```
1. file lokal  /image/product/<nama>.webp      (mirror, cepat)
2. server API  https://migrationbe.trumecs.com/image/product/<nama>.jpg
3. /image/noimage.png
```

Dipakai lewat composable:

```vue
<img :src="imgSrc('product', product.img)" v-bind="imgAttrs('product', product.img)" />
```

`imgAttrs` menandai elemen dengan `data-img-kind` / `data-img-file`, lalu plugin
global menukar `src` ke sumber berikutnya saat gambar gagal dimuat.

Thumbnail memakai ipx lokal (`/_ipx/f_webp&q_70&s_160x160/...`); endpoint
`timthumb` lama sudah 404.

## Kalau produk / gambar baru ditambah

Jalankan ulang `npm run mirror:images` — file baru otomatis diunduh dari server API.

## Catatan

- `promo-read` di API mengembalikan HTML (bukan JSON) → section promo di beranda
  tidak termuat. Perlu dicek ke tim backend. Folder gambar promo juga tidak ada
  di server API.
- Gambar artikel kadang berisi **URL lengkap** (`https://files.togu.co.id/...`).
  Resolver mengenali itu dan tidak menggabungkannya dengan base path.
