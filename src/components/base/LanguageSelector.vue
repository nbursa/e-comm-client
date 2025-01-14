<template>
  <q-select
    v-model="localSelectedLanguage"
    :options="languageOptions"
    :label="$t('settings.languageLabel')"
    outlined
    class="full-width"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { LanguageOption } from '@/types';

const props = defineProps<{
  modelValue: LanguageOption;
  languageOptions: LanguageOption[];
}>();

const emit = defineEmits(['update:modelValue']);

const localSelectedLanguage = computed({
  get: () => props.modelValue,
  set: (value: LanguageOption) => {
    emit('update:modelValue', value);
  },
});
</script>
