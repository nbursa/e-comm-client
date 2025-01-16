import type { CurrencyOption, LanguageOption } from '@/types';

export const STORAGE_LANGUAGE_KEY = 'language';

export const languages: LanguageOption[] = [
  { value: 'en-US', label: 'English' },
  { value: 'sr-RS', label: 'Serbian' },
  { value: 'fr-FR', label: 'French' },
];

export const currencies: CurrencyOption[] = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'RSD', label: 'Serbian Dinar' },
];

export const i18nConfig = {
  datetimeFormats: {
    'en-US': {
      short: {
        year: 'numeric' as const,
        month: 'short' as const,
        day: 'numeric' as const,
      },
    },
    'fr-FR': {
      short: {
        year: 'numeric' as const,
        month: 'short' as const,
        day: 'numeric' as const,
      },
    },
    'sr-RS': {
      short: {
        year: 'numeric' as const,
        month: 'short' as const,
        day: 'numeric' as const,
      },
    },
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency' as const,
        currency: 'USD',
      },
    },
    'fr-FR': {
      currency: {
        style: 'currency' as const,
        currency: 'EUR',
      },
    },
    'sr-RS': {
      currency: {
        style: 'currency' as const,
        currency: 'RSD',
      },
    },
  },
};
