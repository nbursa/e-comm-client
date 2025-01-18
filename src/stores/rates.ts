import { api } from '@/boot/axios';
import { storage } from '@/utils/storage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const ratesUrl = import.meta.env.VITE_RATES_API_URL as string;
const RATES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

export const useRatesStore = defineStore('rates', () => {
  const exchangeRates = ref<Record<string, number>>({});

  const loadExchangeRates = async (baseCurrency: string = 'EUR') => {
    const stored = storage.get('exchange_rates');
    if (stored && !storage.isExpired('exchange_rates')) {
      exchangeRates.value = stored;
      return;
    }

    try {
      const response = await api.get(`${ratesUrl}${baseCurrency}`);
      const data = response.data;
      exchangeRates.value = data.rates;
      storage.set('exchange_rates', exchangeRates.value, {
        expiration: RATES_CACHE_DURATION,
        version: '1.0',
      });
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    }
  };

  const getRate = (currency: string) => exchangeRates.value[currency] || 1;

  return {
    exchangeRates,
    loadExchangeRates,
    getRate,
  };
});
