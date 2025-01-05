import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { setLanguage, type MessageLanguages } from '@/boot/i18n';
import type { QVueGlobals } from 'quasar/dist/types';

interface UserSettings {
  language: MessageLanguages;
  theme: 'light' | 'dark';
  useSystemPreference: boolean;
}

export const useUserStore = defineStore('user', () => {
  const $q = ref<QVueGlobals | null>(null);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'sr-RS', label: 'Serbian' },
    { value: 'fr-FR', label: 'French' },
  ];

  const settings = ref<UserSettings>({
    language: 'en-US',
    theme: 'light',
    useSystemPreference: false,
  });

  const loadSettings = () => {
    const stored = localStorage.getItem('user_settings');
    if (stored) {
      settings.value = JSON.parse(stored);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings.value));
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

  watch(
    () => settings.value,
    () => {
      saveSettings();
      updateTheme();
      updateI18n();
    },
    { deep: true },
  );

  mediaQuery.addEventListener('change', handleSystemChange);

  return {
    languageOptions,
    settings,
    initTheme,
    updateTheme,
  };
});
