import { boot } from 'quasar/wrappers';
import type { App } from 'vue';
import type { QVueGlobals } from 'quasar/dist/types';

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

    const useSystemPreference = localStorage.getItem('useSystemPreference');
    const savedTheme = localStorage.getItem('theme');

    if (useSystemPreference === null) {
      localStorage.setItem('useSystemPreference', 'true');
    }
    if (savedTheme === null) {
      localStorage.setItem('theme', 'light');
    }

    if (useSystemPreference === 'true' || useSystemPreference === null) {
      this.enableSystemTheme();
    } else {
      this.setTheme(savedTheme === 'dark');
    }
  }

  private handleSystemChange(e: MediaQueryListEvent): void {
    if (this.$q && localStorage.getItem('useSystemPreference') === 'true') {
      this.setTheme(e.matches);
    }
  }

  enableSystemTheme(): void {
    this.mediaQuery.addEventListener('change', this.handleSystemChange);
    this.setTheme(this.mediaQuery.matches);
    localStorage.setItem('useSystemPreference', 'true');
  }

  disableSystemTheme(): void {
    this.mediaQuery.removeEventListener('change', this.handleSystemChange);
    localStorage.setItem('useSystemPreference', 'false');
  }

  setTheme(isDark: boolean): void {
    if (this.$q) {
      this.$q.dark.set(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }
}

export default boot(({ app }: { app: App }) => {
  const $q = app.config.globalProperties.$q as QVueGlobals;
  ThemeManager.getInstance().init($q);
});

export const themeManager = ThemeManager.getInstance();
