import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { setLanguage } from '@/boot/i18n';
import type { QVueGlobals } from 'quasar/dist/types';
import { Currency, CurrencyOption, LanguageOption, ThemeOption, UserSettings } from '@/types';

export const useUserStore = defineStore('user', () => {
  const $q = ref<QVueGlobals | null>(null);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const settings = ref<UserSettings>({
    language: 'en-US',
    theme: 'light',
    useSystemPreference: false,
    currency: 'EUR',
  });

  const languageOptions = computed<LanguageOption[]>(() => [
    { value: 'en-US', label: 'English' },
    { value: 'sr-RS', label: 'Serbian' },
    { value: 'fr-FR', label: 'French' },
  ]);

  const themeOptions = computed<ThemeOption[]>(() => [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]);

  const currencyOptions = computed<CurrencyOption[]>(() => [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'RSD', label: 'Serbian Dinar' },
  ]);

  const loadSettings = () => {
    const stored = localStorage.getItem('user_settings');
    if (stored) {
      settings.value = JSON.parse(stored);
    } else {
      saveSettings();
    }
  };

  const saveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings.value));
  };

  const setCurrency = (currency: Currency) => {
    settings.value.currency = currency;
    saveSettings();
  };

  const initTheme = (quasar: QVueGlobals) => {
    $q.value = quasar;
    loadSettings();
    updateTheme();
  };

  const updateTheme = () => {
    if (!$q.value) return;

    const isDark = settings.value.useSystemPreference
      ? mediaQuery.matches
      : settings.value.theme === 'dark';

    $q.value.dark.set(isDark);
  };

  const updateI18n = () => {
    try {
      setLanguage(settings.value.language);
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  };

  const handleSystemChange = () => {
    if (settings.value.useSystemPreference) {
      updateTheme();
    }
  };

  const setUserStore = (quasar: QVueGlobals) => {
    $q.value = quasar;
    loadSettings();
    updateTheme();
    updateI18n();
  };

  watch(
    () => settings.value.language,
    () => {
      updateI18n();
    },
  );

  watch(
    () => settings.value,
    () => {
      saveSettings();
      updateTheme();
    },
    { deep: true },
  );

  mediaQuery.addEventListener('change', handleSystemChange);

  return {
    languageOptions,
    themeOptions,
    settings,
    initTheme,
    updateTheme,
    setUserStore,
    setCurrency,
    currencyOptions,
  };
});
