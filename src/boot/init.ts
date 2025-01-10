import { boot } from 'quasar/wrappers';
import { useUserStore } from '@/stores/user';
import { useRatesStore } from '@/stores/rates';

const ratesStore = useRatesStore();

export default boot(({ app }) => {
  const userStore = useUserStore();
  const $q = app.config.globalProperties.$q;
  ratesStore.loadExchangeRates();
  userStore.initApp($q);
});
