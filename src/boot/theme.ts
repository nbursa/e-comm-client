import { boot } from 'quasar/wrappers';
import { type App as VueApp } from 'vue';
import type { QVueGlobals } from 'quasar';
import { setQuasarInstance, initThemeManager } from '@/utils/theme';

export default boot(({ app }: { app: VueApp }) => {
  const quasar = app.config.globalProperties.$q as unknown as QVueGlobals;
  setQuasarInstance(quasar);
  initThemeManager();
});

export { initThemeManager };
