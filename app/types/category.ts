// types/category.ts

// Category child dengan parent reference
export interface CategoryChild {
  id: number;
  name: string;
  url: string;
  parent?: {
    id: number;
    name: string;
    url: string;
  } | null;
  children: CategoryChild[];
  is_brand?: boolean; // Opsional, untuk menandai brand
}

// Product Category - sesuai struktur API
export interface ProductCategory {
  id: number;
  name: string;
  url: string;
  parent: {
    id: number;
    name: string;
    url: string;
  } | null;
  children: CategoryChild[];
  brands?: Brand[];
}

// Brand - sesuai struktur API (dalam category.brands)
export interface Brand {
  id: number;
  name: string;
  url: string;
  parent: null;
  children: [];
}

// Man Power Service - dari services.man_power
export interface ManPowerService {
  id: number;
  name: string;
  url: string;
  parent: null;
  children: CategoryChild[];
}

// Rental Service - dari services.rental
export interface RentalService {
  id: number;
  name: string;
  url: string;
  parent: null;
  children: CategoryChild[];
}

// Services container
export interface Services {
  man_power: ManPowerService[];
  rental: RentalService[];
}

// Main Category Payload - sesuai struktur API
export interface CategoryPayload {
  category: {
    products: ProductCategory[]; // Root categories (Pelumas, Ban, dll)
    brands: Brand[]; // All brands
  };
  services: Services;
}

// API Response
export interface CategoryResponse {
  status: boolean;
  message: string;
  payload: CategoryPayload;
}

// Product - untuk produk dalam kategori
export interface Product {
  id: number;
  tittle: string;
  price: string;
  price_promo: string | null;
  img: string | null;
  brand: string;
  component: number; // ID subcategory
  stock: number;
  unit: string;
  partnumber: string;
  partnumber_trumecs: string;
  url: string;
  description: string;
  weight: string;
  dimention: string;
  warranty: string;
  area: string;
  availability_at: string;
  estimated_delivery: string;
  packagin: string;
  moq: number;
  physicnumber: string;
  categori: {
    id: number;
    name: string;
    url: string;
    parent_categori: {
      id: number;
      name: string;
      url: string;
    } | null;
  };
  jenisproduct: string;
  price_old: number;
  made: string;
  warrantyvendor: string;
  livetime: string;
  view: number;
  sx: number;
  sy: number;
  sz: number;
  px: number;
  py: number;
  pz: number;
  type: number;
  status: string;
  estimated_deliveryindent: number;
  ppn: string;
  link_tokped: string;
  link_bukalapak: string;
  link_shopee: string;
  link_blibli: string;
  youtube: string;
  brand_unit: number;
  created_by: number;
  tittle_en: string;
  warranty_en: string;
  unit_en: string;
  warrantyvendor_en: string;
  livetime_en: string;
  packagin_en: string;
  description_en: string;
  tittle_ch: string;
  warranty_ch: string;
  unit_ch: string;
  warrantyvendor_ch: string;
  livetime_ch: string;
  packagin_ch: string;
  description_ch: string;
  promo_cbd_price: string;
  promo_volume: number;
  promo_volume_price: string;
  promo_referral_price: string;
  store_id: string;
  is_sell: number;
  is_rent: number;
  rent_description: any;
  operator_option: any;
  fuel_option: any;
  rent_description_en: any;
  rent_description_ch: any;
  rent_time_unit: any;
  hour_meter: any;
  minimum_rent: any;
  operator_price: any;
  rent_price: any;
  is_service: number;
  file: string;
  sku_number: any;
  price_description: any;
  last_medical: any;
  last_education: any;
  specs: Array<{ name: string; value: string }>;
  store: any;
  related_product: Array<{
    id: number;
    tittle: string;
    brand: string;
    price: string;
    img?: string;
  }>;
  artikel: Array<{
    id: number;
    title: string;
    url: string;
    img: string;
    view: number;
    description?: string;
  }>;
  gallery_img: Array<{
    img: string;
  }>;
}

export interface FlattenedCategory {
  id: number;
  name: string;
  url: string;
  path: string;
  level: number;
  parentId?: number;
  type: "product" | "brand" | "man_power" | "rental";
}
