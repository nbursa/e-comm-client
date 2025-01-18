<template>
  <div>
    <q-select
      v-model="localSelectedTheme"
      :options="themeOptions"
      :label="$t('settings.themeLabel')"
      outlined
      :disable="useSystemPreference"
      class="full-width"
    />
    <q-toggle
      v-model="localUseSystemPreference"
      :label="$t('settings.followSystemTheme')"
      color="white"
      class="q-mt-md tw-text-xs"
    />
  </div>
</template>

<script lang="ts" setup>
import { ThemeOption } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: ThemeOption;
  themeOptions: ThemeOption[];
  useSystemPreference: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'update:useSystemPreference']);

const localSelectedTheme = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const localUseSystemPreference = computed({
  get: () => props.useSystemPreference,
  set: (value) => {
    emit('update:useSystemPreference', value);
  },
});
</script>
