import type { QVueGlobals } from 'quasar/dist/types/globals';
import { boot } from 'quasar/wrappers';
import type { App } from 'vue';

let $q: QVueGlobals | null = null;

export default boot(({ app }: { app: App }) => {
  $q = app.config.globalProperties.$q as QVueGlobals;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  $q.dark.set(prefersDark);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if ($q) {
      $q.dark.set(e.matches);
    }
  });
});

export function toggleTheme() {
  if (!$q) return;

  const isDark = !$q.dark.isActive;
  $q.dark.set(isDark);
}
