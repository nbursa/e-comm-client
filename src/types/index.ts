import type { DateTimeFormat, NumberFormat } from '@intlify/core-base';
import messages from '../i18n';

export type ProductRating = {
  rate: number;
  count: number;
};

export interface Product {
  id: number;
  title?: string;
  name?: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  description: string;
  category: string;
  image: string;
  additionalImages?: string[];
  rating?: ProductRating;
  discount?: boolean;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
}

export interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface PaymentDetails {
  method: 'card' | 'ips';
  cardDetails?: CardDetails;
}

export interface OrderDetails {
  id: number;
  items: Product[];
  total: number;
}

export interface IOrderForm {
  shipping: ShippingDetails;
  payment?: PaymentDetails;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}

export interface LanguageOption {
  value: MessageLanguages;
  label: string;
}

export type Currency = 'USD' | 'EUR' | 'RSD';

export type Theme = 'light' | 'dark';

export interface ThemeOption {
  value: Theme;
  label: string;
}

export interface UserSettings {
  language: MessageLanguages;
  theme: Theme;
  useSystemPreference: boolean;
  currency: Currency;
}

export interface CurrencyOption {
  value: Currency;
  label: string;
}

export interface MenuItem {
  label: string;
  path: string;
}

export interface ScrollAreaRef {
  setScrollPosition: (axis: 'vertical' | 'horizontal', offset: number, duration?: number) => void;
}

export interface PreviewImage {
  src: string;
  name: string;
}

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

export type I18nOptions = {
  locale: string;
  fallbackLocale: string;
  legacy: boolean;
  messages: Record<string, unknown>;
  datetimeFormats: Record<string, DateTimeFormat>;
  numberFormats: Record<string, NumberFormat>;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface ProductResponse {
  status: string;
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductCacheEntry {
  data: Product[];
  meta?: PaginationMeta;
  timestamp: number;
  category: string;
}

export interface ViewedCache {
  products: Product[];
  timestamp: number;
}

export interface CacheEntry {
  products: Product[];
  timestamp: number;
  category: string;
}

export interface CategoryCache {
  categories: string[];
  timestamp: number;
}

export interface ProductsValue {
  all: Product[];
  viewed: Product[];
  categories: string[];
  timestamp: number;
}

export interface ProductStore {
  cache: Record<string, ProductCacheEntry>;
  viewed: ViewedCache;
  categories: string[];
  timestamp: number;
  version: string;
}
