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
import { useRatesStore } from '@/stores/rates';
import { Currencies } from '@/pages/SettingsPage.vue';
import { useUserStore } from '@/stores/user';

const ratesStore = useRatesStore();
const userStore = useUserStore();

const selectedCurrency = ref<string>(userStore.settings.currency);
const currencyOptions = ref<string[]>([]);

onMounted(async (): Promise<void> => {
  if (!Object.keys(ratesStore.exchangeRates).length) {
    await ratesStore.loadExchangeRates();
  }
  currencyOptions.value = Object.keys(ratesStore.exchangeRates);
});

const onCurrencyChange = (currency: Currencies): void => {
  userStore.setCurrency(currency);
};
</script>
