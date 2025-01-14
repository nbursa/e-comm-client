import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { setLanguage } from '@/boot/i18n';
import { Currency, CurrencyOption, LanguageOption, ThemeOption, UserSettings } from '@/types';
import { storage } from '@/utils/storage';

export const useUserStore = defineStore('user', () => {
  const USER_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

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
    const stored = storage.get('user_settings');
    if (stored && !storage.isExpired('user_settings')) {
      settings.value = stored as UserSettings;
    } else {
      saveSettings();
    }
  };

  const saveSettings = () => {
    storage.set('user_settings', settings.value, {
      expiration: USER_CACHE_DURATION,
      version: '1.0',
    });
  };

  const setTheme = (theme: ThemeOption['value']) => {
    settings.value.useSystemPreference = false;
    settings.value.theme = theme;
    saveSettings();
  };

  const setSystemPreference = (value: boolean) => {
    settings.value.useSystemPreference = value;
    saveSettings();
  };

  const setCurrency = (currency: Currency) => {
    settings.value.currency = currency;
    saveSettings();
  };

  const updateI18n = () => {
    try {
      setLanguage(settings.value.language);
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  };

  watch(() => settings.value.language, updateI18n);

  return {
    settings,
    languageOptions,
    themeOptions,
    setTheme,
    setLanguage,
    setSystemPreference,
    setCurrency,
    currencyOptions,
    loadSettings,
  };
});
