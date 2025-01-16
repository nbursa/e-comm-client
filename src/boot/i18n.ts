import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import messages from '../i18n';
import { createI18n } from 'vue-i18n';
import { i18nConfig } from '@/utils/i18n';
import { MessageLanguages } from '@/types';
import { storage } from '@/utils/storage';

const i18n = createI18n({
  locale: (storage.get('user_settings')?.language as MessageLanguages) || 'en-US',
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
  datetimeFormats: i18nConfig.datetimeFormats,
  numberFormats: i18nConfig.numberFormats,
});

export default boot(({ app }: { app: App }) => {
  app.use(i18n);
});

export { i18n };
