import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { themeManager } from '@/boot/theme';
import { type MessageLanguages, setLanguage } from '@/boot/i18n';

export const useUserStore = defineStore('user', () => {
  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'sr-RS', label: 'Serbian' },
    { value: 'fr-FR', label: 'French' },
  ];

  const language = ref<MessageLanguages>(
    (localStorage.getItem('language') as MessageLanguages) || 'en-US',
  );

  const theme = ref(localStorage.getItem('theme') || 'light');
  const useSystemPreference = ref(localStorage.getItem('useSystemPreference') === 'true');

  const currentLanguage = computed(() => {
    return languageOptions.find((option) => option.value === language.value) || languageOptions[0];
  });

  watch(language, (newLang) => {
    localStorage.setItem('language', newLang);
    setLanguage(newLang);
  });

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme);
    themeManager.setTheme(newTheme === 'dark');
  });

  watch(useSystemPreference, (newValue) => {
    localStorage.setItem('useSystemPreference', newValue.toString());
    if (newValue) {
      themeManager.enableSystemTheme();
    } else {
      themeManager.disableSystemTheme();
    }
  });

  setLanguage(language.value);
  themeManager.setTheme(theme.value === 'dark');
  if (useSystemPreference.value) {
    themeManager.enableSystemTheme();
  }

  return {
    language,
    currentLanguage,
    languageOptions,
    theme,
    useSystemPreference,
  };
});
