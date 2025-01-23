import { boot } from 'quasar/wrappers';
import { useUserStore } from '@/stores/user';
import { useRatesStore } from '@/stores/rates';
import { useAuthStore } from '@/stores/auth';

export default boot(() => {
  const ratesStore = useRatesStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();

  if (authStore.token) {
    authStore.fetchUser().catch(() => {
      authStore.logout();
    });
  }

  ratesStore.loadExchangeRates();
  userStore.loadSettings();
});
