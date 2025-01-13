import { boot } from 'quasar/wrappers';
import { useUserStore } from '@/stores/user';
import { useRatesStore } from '@/stores/rates';

export default boot(() => {
  const ratesStore = useRatesStore();
  const userStore = useUserStore();

  ratesStore.loadExchangeRates();
  userStore.loadSettings();
});
