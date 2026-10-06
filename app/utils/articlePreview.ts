/**
 * Ambil "be beberapa kata awal" dari data artikel.
 *
 * Data artikel dari API tidak konsisten: sebagian endpoint hanya mengirim
 * `discription_seo` (bukan `description`), sebagian hanya mengirim `value`
 * berisi HTML. Karena itu kandidat teks dicek berurutan dan HTML-nya dibersihkan
 * dulu, supaya card artikel di semua halaman menampilkan teks yang sama.
 */

/** Buang tag HTML + decode entity dasar, lalu rapikan spasi. */
export const stripHtml = (html?: string | null): string =>
  String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

/** Potong teks jadi beberapa kata pertama + ellipsis kalau terlalu panjang. */
export const firstWords = (text: string, words = 18): string => {
  const parts = text.split(" ").filter(Boolean);
  if (parts.length <= words) return text;
  return `${parts.slice(0, words).join(" ")}...`;
};

/**
 * Teks pratinjau untuk card artikel.
 * Mengembalikan string kosong kalau datanya benar-benar tidak punya teks —
 * pemanggil sebaiknya menyembunyikan baris pratinjau, bukan menampilkan
 * kalimat placeholder seperti "lihat selengkapnya".
 */
export const articlePreview = (
  article:
    | {
        description?: string | null;
        excerpt?: string | null;
        discription_seo?: string | null;
        seo_key?: string | null;
        value?: string | null;
      }
    | null
    | undefined,
  words = 18
): string => {
  if (!article) return "";

  const candidates = [
    article.description,
    article.excerpt,
    article.discription_seo,
    article.value,
    article.seo_key,
  ];

  for (const candidate of candidates) {
    const text = stripHtml(candidate);
    if (text) return firstWords(text, words);
  }

  return "";
};