import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Currency, MessageLanguages, ThemeOption, UserSettings } from '@/types';
import { storage } from '@/utils/storage';
import { languages, currencies, STORAGE_LANGUAGE_KEY } from '@/utils/i18n';
import { themeOptions } from '@/utils/theme';
import { getI18n } from '@/boot/i18n';

export const useUserStore = defineStore('user', () => {
  const USER_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  const settings = ref<UserSettings>({
    language: storage.get('user_settings')?.language || 'en-US',
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

  const setLanguage = async (lang: MessageLanguages) => {
    settings.value.language = lang;
    const i18n = getI18n();
    i18n.global.locale.value = lang;
    saveSettings();
  };

  const getStoredLanguage = (): MessageLanguages => {
    const lang = storage.get(STORAGE_LANGUAGE_KEY);
    return (lang?.data as MessageLanguages) || 'en-US';
  };

  const clearSettings = () => {
    settings.value = {
      language: 'en-US',
      theme: 'light',
      useSystemPreference: false,
      currency: 'EUR',
    };
    saveSettings();
    storage.set('user_settings', settings.value);
  };

  loadSettings();

  watch(() => settings.value.language, setLanguage);

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
    getStoredLanguage,
    clearSettings,
  };
});
