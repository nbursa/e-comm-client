import { boot } from 'quasar/wrappers';
import type { App } from 'vue';
import type { QVueGlobals } from 'quasar/dist/types';
import { useUserStore } from '@/stores/user';

let $q: QVueGlobals | null = null;

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function applyTheme() {
  const userStore = useUserStore();
  const isDark = userStore.settings.useSystemPreference
    ? mediaQuery.matches
    : userStore.settings.theme === 'dark';

  if ($q) {
    $q.dark.set(isDark);
  }
}

function handleSystemChange() {
  const userStore = useUserStore();
  if (userStore.settings.useSystemPreference) {
    applyTheme();
  }
}

export function initThemeManager(quasar: QVueGlobals) {
  $q = quasar;
  applyTheme();
  mediaQuery.addEventListener('change', handleSystemChange);
}

export default boot(({ app }: { app: App }) => {
  const quasar = app.config.globalProperties.$q as QVueGlobals;
  initThemeManager(quasar);
});
