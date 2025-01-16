import type { QVueGlobals } from 'quasar';
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';

let $q: QVueGlobals | null = null;

const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

export const setQuasarInstance = (quasar: QVueGlobals) => {
  $q = quasar;
};

export const applyTheme = () => {
  const userStore = useUserStore();
  const isDark = userStore.settings.useSystemPreference
    ? systemPreference.matches
    : userStore.settings.theme === 'dark';

  if ($q) {
    $q.dark.set(isDark);
  }

  userStore.settings.theme = isDark ? 'dark' : 'light';
};

const handleSystemChange = () => {
  const userStore = useUserStore();
  if (userStore.settings.useSystemPreference) {
    applyTheme();
  }
};

const watchStore = () => {
  const userStore = useUserStore();
  watch(
    () => userStore.settings,
    () => {
      applyTheme();
    },
    { deep: true },
  );
};

export const initThemeManager = () => {
  applyTheme();
  watchStore();
  systemPreference.addEventListener('change', handleSystemChange);
};
