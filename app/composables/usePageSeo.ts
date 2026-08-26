interface PageSeoOptions {
  title: string | Ref<string>;
  description: string | Ref<string>;
  image?: string | Ref<string>;
  url?: string | Ref<string>;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, any> | Ref<Record<string, any> | null>;
  breadcrumbs?: { name: string; url: string }[];
  robots?: string;
}

export function usePageSeo(options: PageSeoOptions) {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://www.trumecs.com";

  const resolvedTitle = computed(() => {
    const t = unref(options.title);
    return t ? `${t} | Trumecs.com` : "Trumecs.com | Solusi Pengadaan Mekanikal Terpercaya";
  });

  const resolvedDescription = computed(() => unref(options.description) || "");
  const resolvedImage = computed(() => {
    const img = unref(options.image);
    if (!img) return undefined;
    return img.startsWith("http") ? img : `${siteUrl}${img}`;
  });
  const resolvedUrl = computed(() => {
    const u = unref(options.url);
    return u ? (u.startsWith("http") ? u : `${siteUrl}${u}`) : undefined;
  });
  const resolvedJsonLd = computed(() => {
    if (!options.jsonLd) return null;
    return unref(options.jsonLd);
  });

  useHead({
    title: resolvedTitle,
    meta: computed(() => {
      const metas: Record<string, string>[] = [
        { name: "description", content: resolvedDescription.value },
        { property: "og:title", content: resolvedTitle.value },
        { property: "og:description", content: resolvedDescription.value },
        { property: "og:type", content: options.type || "website" },
        { property: "og:site_name", content: "Trumecs.com" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: resolvedTitle.value },
        { name: "twitter:description", content: resolvedDescription.value },
      ];
      if (resolvedImage.value) {
        metas.push({ property: "og:image", content: resolvedImage.value });
        metas.push({ name: "twitter:image", content: resolvedImage.value });
      }
      if (resolvedUrl.value) {
        metas.push({ property: "og:url", content: resolvedUrl.value });
      }
      if (options.robots) {
        metas.push({ name: "robots", content: options.robots });
      }
      return metas;
    }),
    link: computed(() => {
      const links: Record<string, string>[] = [];
      if (resolvedUrl.value) {
        links.push({ rel: "canonical", href: resolvedUrl.value });
      }
      return links;
    }),
  });

  if (resolvedJsonLd.value) {
    useSchemaOrg([
      defineWebPage({
        name: resolvedTitle.value,
        description: resolvedDescription.value,
      }),
    ]);
  }

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    useSchemaOrg([
      defineBreadcrumb({
        itemListElement: options.breadcrumbs.map((item, index) => ({
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
        })),
      }),
    ]);
  }
}

export function useProductSeo(product: Ref<any | null>) {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://www.trumecs.com";

  const seoTitle = computed(() => product.value?.tittle || "Produk");
  const seoDescription = computed(
    () => product.value?.description || "Produk berkualitas dari Trumecs"
  );
  const seoImage = computed(() =>
    product.value?.img ? `${siteUrl}/public/image/product/${product.value.img}` : undefined
  );
  const seoUrl = computed(() =>
    product.value ? `${siteUrl}/product/${product.value.id}/${product.value.tittle}` : undefined
  );

  useHead({
    title: seoTitle,
    meta: computed(() => {
      const metas: Record<string, string>[] = [
        { name: "description", content: seoDescription.value },
        { property: "og:title", content: seoTitle.value },
        { property: "og:description", content: seoDescription.value },
        { property: "og:type", content: "product" },
        { property: "og:site_name", content: "Trumecs.com" },
        { name: "robots", content: "index, follow" },
        {
          name: "keywords",
          content: `${product.value?.tittle || ""}, ${product.value?.brand || ""}, Trumecs, sparepart, alat berat`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seoTitle.value },
        { name: "twitter:description", content: seoDescription.value },
      ];
      if (seoImage.value) {
        metas.push({ property: "og:image", content: seoImage.value });
        metas.push({ name: "twitter:image", content: seoImage.value });
      }
      if (seoUrl.value) {
        metas.push({ property: "og:url", content: seoUrl.value });
      }
      return metas;
    }),
    link: computed(() =>
      seoUrl.value ? [{ rel: "canonical", href: seoUrl.value }] : []
    ),
  });

  const productSchema = computed(() => {
    const p = product.value;
    if (!p) return null;

    const price = Number(p.price_promo) > 0 ? Number(p.price_promo) : Number(p.price);
    const images = [];
    if (p.img) images.push(`${siteUrl}/public/image/product/${p.img}`);
    if (p.gallery_img && Array.isArray(p.gallery_img)) {
      p.gallery_img.forEach((item: any) => {
        if (item.img) images.push(`${siteUrl}/public/image/galery/${item.img}`);
      });
    }

    return {
      "@type": "Product",
      name: p.tittle,
      description: p.description || `${p.tittle} - Produk berkualitas dari Trumecs`,
      sku: p.partnumber || p.partnumber_trumecs || undefined,
      mpn: p.partnumber || undefined,
      brand: {
        "@type": "Brand",
        name: p.brand && p.brand.toLowerCase() !== "other" ? p.brand : "Trumecs",
      },
      category: p.categori?.name || "Produk",
      image: images.length > 0 ? images : undefined,
      offers: {
        "@type": "Offer",
        price: price.toString(),
        priceCurrency: "IDR",
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: seoUrl.value,
        itemCondition:
          p.physicnumber && (p.physicnumber.includes("S/N") || p.physicnumber.includes("ET-"))
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "Trumecs" },
      },
    };
  });

  const breadcrumbSchema = computed(() => {
    const p = product.value;
    if (!p) return null;

    const items = [{ name: "Home", url: siteUrl }];
    if (p.categori) {
      let current = p.categori;
      const parents: any[] = [];
      while (current) {
        parents.unshift(current);
        current = current.parent_categori;
      }
      parents.forEach((parent: any) => {
        items.push({ name: parent.name, url: `${siteUrl}/c/${parent.url}` });
      });
    }
    if (p.brand && p.brand.toLowerCase() !== "other") {
      const lastUrl = items[items.length - 1]?.url || siteUrl;
      items.push({ name: p.brand, url: `${lastUrl}/${p.brand}` });
    }
    return items;
  });

  return { productSchema, breadcrumbSchema, seoTitle, seoImage };
}

export function useArticleSeo(article: Ref<any | null>) {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://www.trumecs.com";

  const seoTitle = computed(() => article.value?.title || "Artikel");
  const seoDescription = computed(() => {
    if (!article.value) return "";
    return article.value.excerpt || article.value.content?.replace(/<[^>]*>/g, "").substring(0, 160) || "";
  });
  const seoImage = computed(() => article.value?.image || undefined);
  const seoUrl = computed(() =>
    article.value ? `${siteUrl}/article/${article.value.url}` : undefined
  );

  useHead({
    title: seoTitle,
    meta: computed(() => {
      const metas: Record<string, string>[] = [
        { name: "description", content: seoDescription.value },
        { property: "og:title", content: seoTitle.value },
        { property: "og:description", content: seoDescription.value },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Trumecs.com" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seoTitle.value },
        { name: "twitter:description", content: seoDescription.value },
      ];
      if (article.value?.date) {
        metas.push({ property: "article:published_time", content: article.value.date });
      }
      if (article.value?.author?.name) {
        metas.push({ property: "article:author", content: article.value.author.name });
      }
      if (seoImage.value) {
        metas.push({ property: "og:image", content: seoImage.value });
        metas.push({ name: "twitter:image", content: seoImage.value });
      }
      if (seoUrl.value) {
        metas.push({ property: "og:url", content: seoUrl.value });
      }
      return metas;
    }),
    link: computed(() =>
      seoUrl.value ? [{ rel: "canonical", href: seoUrl.value }] : []
    ),
  });

  const articleSchema = computed(() => {
    const a = article.value;
    if (!a) return null;
    return {
      "@type": "Article",
      headline: a.title,
      image: a.image,
      datePublished: a.date,
      author: { "@type": "Person", name: a.author?.name || "Anonymous" },
      publisher: {
        "@type": "Organization",
        name: "Trumecs",
        logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
      },
      description: seoDescription.value,
    };
  });

  return { articleSchema, seoTitle, seoImage };
}
