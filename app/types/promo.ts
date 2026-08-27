export type Promo = {
  id: string;
  name: string;
  description: string;
  img: string | null;
  type: string;
  price: string | null;
  start_date: string;
  end_date: string;
  url: string;
  view: number;
  products: PromoProduct[];
  name_en: string;
  description_en: string;
  url_en: string;
  name_ch: string;
  description_ch: string;
  url_ch: string;
};

export type PromoProduct = {
  id: number;
  tittle: string;
  img: string;
  price: string;
  price_promo: string;
  brand: string;
  unit: string;
};
