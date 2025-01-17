import type { App } from 'vue';
import { boot } from 'quasar/wrappers';
import messages from '../i18n';
import { createI18n } from 'vue-i18n';
import { i18nConfig } from '@/utils/i18n';
import { storage } from '@/utils/storage';

let i18nInstance: ReturnType<typeof createI18n>;

export function getI18n() {
  if (!i18nInstance) {
    const userSettings = storage.get('user_settings');
    const locale = userSettings?.language || 'en-US';

    i18nInstance = createI18n({
      locale,
      fallbackLocale: 'en-US',
      legacy: false,
      messages,
      datetimeFormats: i18nConfig.datetimeFormats,
      numberFormats: i18nConfig.numberFormats,
    });
  }
  return i18nInstance;
}

export default boot(({ app }: { app: App }) => {
  const i18n = getI18n();
  app.use(i18n);
});
