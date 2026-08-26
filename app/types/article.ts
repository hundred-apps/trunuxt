export type Article = {
  id: string;
  title: string | null;
  date: string;
  img: string | null;
  value: string | null;
  url: string | null;
  seo_key: string | null;
  discription_seo: string | null;
  tag: [];
  view: number;
  created_by: string | null;
  title_en: string | null;
  value_en: string | null;
  url_en: string | null;
  seo_key_en: string | null;
  discription_seo_en: string | null;
  tag_en: string | null;
  title_ch: string | null;
  value_ch: string | null;
  url_ch: string | null;
  seo_key_ch: string | null;
  discription_seo_ch: string | null;
  tag_ch: string | null;
  memberId: string | null;
};

export interface CardArticle {
  id: string | number;
  url: string;
  title: string;
  image: string;
  category?: string;
  date?: string;
  excerpt?: string;
  author?: {
    name: string;
    avatar: string;
    role?: string;
  };
}
