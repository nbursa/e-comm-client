import { defineStore } from 'pinia';

const ratesUrl = import.meta.env.VITE_RATES_API_URL as string;

export const useRatesStore = defineStore('rates', {
  state: () => ({
    exchangeRates: {} as Record<string, number>,
  }),
  actions: {
    async loadExchangeRates(baseCurrency: string = 'EUR') {
      try {
        const response = await fetch(`${ratesUrl}${baseCurrency}`);
        const data = await response.json();
        this.exchangeRates = data.rates;
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      }
    },
  },
  getters: {
    getRate: (state) => (currency: string) => state.exchangeRates[currency] || 1,
  },
});
