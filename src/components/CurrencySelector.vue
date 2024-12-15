<template>
  <q-select
    v-model="selectedCurrency"
    :options="currencyOptions"
    label="Select Currency"
    outlined
    @update:model-value="onCurrencyChange"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency';

const currencyStore = useCurrencyStore();

const selectedCurrency = ref<string>(currencyStore.selectedCurrency);
const currencyOptions = ref<string[]>([]);

onMounted(async (): Promise<void> => {
  if (!Object.keys(currencyStore.exchangeRates).length) {
    await currencyStore.loadExchangeRates();
  }
  currencyOptions.value = Object.keys(currencyStore.exchangeRates);
});

const onCurrencyChange = (currency: string): void => {
  currencyStore.setCurrency(currency);
};
</script>
