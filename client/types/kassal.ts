export interface PriceHistory {
  price: number;
  date: string; // ISO datetime string
}

export interface Allergen {
  code: string;
  display_name: string;
  contains: string;
}

export interface Nutrition {
  code: string;
  display_name: string;
  amount: number;
  unit: string;
}

export interface Store {
  name: string;
  code: string;
  url: string;
  logo: string;
}

export interface Product {
  id: number;
  name: string;
  brand?: string;
  vendor?: string;
  ean?: string;
  url: string;
  image: string;
  description?: string;
  ingredients?: string;
  current_price: number;
  current_unit_price?: number;
  weight?: number;
  weight_unit?: string;
  store: Store;
  price_history: PriceHistory[];
  allergens: Allergen[];
  nutrition: Nutrition[];
  created_at: string;
  updated_at: string;
}

export interface ProductsLinks {
  first: string;
  last?: string;
  prev?: string;
  next?: string;
}

export interface ProductsMeta {
  current_page: number;
  from: number;
  path: string;
  per_page: number;
  to: number;
}

export interface ProductsResponse {
  data: Product[];
  links: ProductsLinks;
  meta: ProductsMeta;
}

export interface SingleProductResponse {
  data: Product;
}

export interface CurrentPriceDetail {
  price: number;
  unit_price?: number;
  date: string;
}

export interface Kassalapp {
  url: string;
  opengraph?: string | { [key: string]: any };
}

export interface EanProduct {
  id: number;
  name: string;
  vendor?: string;
  brand?: string;
  description?: string;
  ingredients?: string;
  url: string;
  image: string;
  store: Store;
  current_price: CurrentPriceDetail;
  weight?: number;
  weight_unit?: string;
  price_history: PriceHistory[];
  kassalapp: Kassalapp;
  created_at: string;
  updated_at: string;
}

export interface ProductsByEanData {
  ean: string;
  products: EanProduct[];
  allergens: Allergen[];
  nutrition: Nutrition[];
}

export interface ProductsByEanResponse {
  data: ProductsByEanData;
}

export interface ProductCompare {
  id: number;
  name: string;
  vendor?: string;
  brand?: string;
  description?: string;
  ingredients?: string;
  url: string;
  image: string;
  store?: Store;
  current_price?: CurrentPriceDetail;
  weight?: number;
  weight_unit?: string;
  price_history: PriceHistory[];
  kassalapp: Kassalapp;
  created_at: string;
  updated_at: string;
}

export interface ProductsCompareData {
  ean: string;
  products: ProductCompare[];
  allergens: Allergen[];
  nutrition: Nutrition[];
}

export interface ProductsCompareResponse {
  data: ProductsCompareData;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface PhysicalStore {
  id: number;
  group: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  logo: string;
  website: string;
  detailUrl: string;
  position: Position;
  openingHours: OpeningHours;
}

export interface Links {
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

export interface MetaLink {
  url?: string;
  label: string;
  active: boolean;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PhysicalStoresResponse {
  data: PhysicalStore[];
  links: Links;
  meta: Meta;
}

export interface SinglePhysicalStoreResponse {
  data: PhysicalStore;
}

export interface FindByUrlResponse {
  data: Product;
}
