import { defineStore } from 'pinia';

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: 'USD',
    exchangeRates: {} as Record<string, number>,
  }),
  actions: {
    async loadExchangeRates() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        this.exchangeRates = data.rates;
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      }
    },
    setCurrency(currency: string) {
      this.selectedCurrency = currency;
    },
  },
  getters: {
    getRate: (state) => (currency: string) => state.exchangeRates[currency] || 1,
  },
});
