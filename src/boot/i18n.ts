import messages from '../i18n';
import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import { type Composer, createI18n } from 'vue-i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}

export const STORAGE_LANGUAGE_KEY = 'language';

const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
  locale: getStoredLanguage(),
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
  datetimeFormats: {
    'en-US': { short: { year: 'numeric', month: 'short', day: 'numeric' } },
    'fr-FR': { short: { year: 'numeric', month: 'short', day: 'numeric' } },
    'sr-RS': { short: { year: 'numeric', month: 'short', day: 'numeric' } },
  },
  numberFormats: {
    'en-US': { currency: { style: 'currency', currency: 'USD' } },
    'fr-FR': { currency: { style: 'currency', currency: 'EUR' } },
    'sr-RS': { currency: { style: 'currency', currency: 'RSD' } },
  },
});

function getStoredLanguage(): MessageLanguages {
  const storedLang = localStorage.getItem(STORAGE_LANGUAGE_KEY);
  return (storedLang as MessageLanguages) || 'en-US';
}

export function setLanguage(lang: MessageLanguages) {
  const i18nGlobal = i18n.global as unknown as Composer;
  i18nGlobal.locale.value = lang;
}

export default boot(({ app }: { app: App }) => {
  app.use(i18n);
});

export { i18n };
