import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import messages from '../i18n';
import { createI18n } from 'vue-i18n';
import type { I18n } from 'vue-i18n/dist/vue-i18n.d.ts';
import { i18nConfig } from '@/utils/i18n';
import { MessageLanguages } from '@/types';
import { storage } from '@/utils/storage';

const i18nInstance = createI18n({
  locale: (storage.get('user_settings')?.language as MessageLanguages) || 'en-US',
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
  datetimeFormats: i18nConfig.datetimeFormats,
  numberFormats: i18nConfig.numberFormats,
});

export const i18n = i18nInstance as I18n;

export default boot(({ app }: { app: App }) => {
  app.use(i18n);
});
