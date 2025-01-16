import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import messages from '../i18n';
import { createI18n } from 'vue-i18n';
import { i18nConfig } from '@/utils/i18n';

const i18nInstance = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
  datetimeFormats: i18nConfig.datetimeFormats,
  numberFormats: i18nConfig.numberFormats,
});

export const i18n = i18nInstance;

export default boot(({ app }: { app: App }) => {
  app.use(i18n);
});
