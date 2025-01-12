<template>
  <!-- <q-card>
    <q-card-section> -->
  <q-select
    v-model="localCurrency"
    :options="currencyOptions"
    :label="$t('settings.currencyLabel')"
    outlined
    class="full-width"
  />
  <!-- </q-card-section>
  </q-card> -->
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue';
import type { CurrencyOption } from '@/types';

const props = defineProps<{
  modelValue: CurrencyOption;
  currencyOptions: CurrencyOption[];
}>();

const emit = defineEmits(['update:modelValue']);

const localCurrency = computed({
  get: () => props.modelValue,
  set: (value: CurrencyOption) => {
    emit('update:modelValue', value);
  },
});
</script>
