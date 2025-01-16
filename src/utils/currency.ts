import { useRatesStore } from '@/stores/rates';
import { useUserStore } from '@/stores/user';

export const formatPrice = (price: number, currency?: string) => {
  const ratesStore = useRatesStore();
  const userStore = useUserStore();
  const selectedCurrency = currency || userStore.settings.currency || 'EUR';
  const exchangeRate = ratesStore.getRate(selectedCurrency);

  const convertedPrice = price * exchangeRate;

  return new Intl.NumberFormat(userStore.settings.language || 'en-US', {
    style: 'currency',
    currency: selectedCurrency,
    currencyDisplay: 'symbol',
    useGrouping: true,
  }).format(convertedPrice);
};
