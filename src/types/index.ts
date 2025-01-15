import { MessageLanguages } from '@/boot/i18n';

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

export interface OrderDetails {
  id: number;
  items: Product[];
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  total: number;
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

export type { MessageLanguages } from '@/boot/i18n';

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
