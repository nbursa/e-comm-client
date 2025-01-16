import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { setLanguage } from '@/boot/i18n';
import { Currency, ThemeOption, UserSettings } from '@/types';
import { storage } from '@/utils/storage';
import { languages, currencies } from '@/utils/i18n';
import { themeOptions } from '@/utils/theme';

export const useUserStore = defineStore('user', () => {
  const USER_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  const settings = ref<UserSettings>({
    language: 'en-US',
    theme: 'light',
    useSystemPreference: false,
    currency: 'EUR',
  });

  const languageOptions = computed(() => languages);
  const currencyOptions = computed(() => currencies);

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
