import messages from '../i18n';
import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import type { DateTimeFormat, NumberFormat } from '@intlify/core-base';
import { createI18n as _createI18n } from 'vue-i18n';
import { STORAGE_LANGUAGE_KEY, i18nConfig } from '@/utils/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

type I18nOptions = {
  locale: string;
  fallbackLocale: string;
  legacy: boolean;
  messages: Record<string, unknown>;
  datetimeFormats: Record<string, DateTimeFormat>;
  numberFormats: Record<string, NumberFormat>;
};

function getStoredLanguage(): MessageLanguages {
  return (localStorage.getItem(STORAGE_LANGUAGE_KEY) as MessageLanguages) || 'en-US';
}

const options: I18nOptions = {
  locale: getStoredLanguage(),
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
  datetimeFormats: i18nConfig.datetimeFormats,
  numberFormats: i18nConfig.numberFormats,
};

const i18n = _createI18n(options);

export function setLanguage(lang: MessageLanguages) {
  if (i18n.global.locale) {
    i18n.global.locale.value = lang;
  }
}

export default boot(({ app }: { app: App }) => {
  app.use(i18n);
});

export { i18n };
