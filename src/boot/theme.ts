import { boot } from 'quasar/wrappers';
import type { App } from 'vue';
import type { QVueGlobals } from 'quasar/dist/types';
import { useUserStore } from '@/stores/user';

class ThemeManager {
  private static instance: ThemeManager;
  private $q: QVueGlobals | null = null;
  private mediaQuery: MediaQueryList;

  private constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.handleSystemChange = this.handleSystemChange.bind(this);
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  init($q: QVueGlobals): void {
    this.$q = $q;
    this.applyTheme();
    this.mediaQuery.addEventListener('change', this.handleSystemChange);
  }

  applyTheme(): void {
    const userStore = useUserStore();
    const isDark = userStore.settings.useSystemPreference
      ? this.mediaQuery.matches
      : userStore.settings.theme === 'dark';

    if (this.$q) {
      this.$q.dark.set(isDark);
    }
  }

  private handleSystemChange(): void {
    const userStore = useUserStore();
    if (userStore.settings.useSystemPreference) {
      this.applyTheme();
    }
  }
}

export default boot(({ app }: { app: App }) => {
  const $q = app.config.globalProperties.$q as QVueGlobals;
  ThemeManager.getInstance().init($q);
});

export const themeManager = ThemeManager.getInstance();
