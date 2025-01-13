<template>
  <q-page padding>
    <h5 class="q-m-sm tw-font-serif">{{ $t('settings.title') }}</h5>

    <q-separator class="q-my-md" />

    <div class="row justify-center q-gutter-md">
      <div class="col-12 col-sm-8 col-md-4 tw-flex tw-flex-col tw-gap-4">
        <LanguageSelector v-model="currentLanguage" :language-options="languageOptions" />
        <CurrencySelector
          v-model="currentCurrency"
          :use-system-preference="useSystemPreference"
          :currency-options="currencyOptions"
        />
      </div>
      <div class="col-12 col-sm-8 col-md-4">
        <ThemeSelector
          v-model="theme"
          :theme-options="themeOptions"
          :use-system-preference="useSystemPreference"
          @update:use-system-preference="onSystemPreferenceChange"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import LanguageSelector from '@/components/base/LanguageSelector.vue';
import { CurrencyOption, LanguageOption, ThemeOption } from '@/types';
import CurrencySelector from '@/components/base/CurrencySelector.vue';
import ThemeSelector from '@/components/base/ThemeSelector.vue';
import { useI18n } from 'vue-i18n';

const userStore = useUserStore();
const { t } = useI18n();

// const languageOptions = computed<LanguageOption[]>(() => userStore.languageOptions);
// const currencyOptions = computed<CurrencyOption[]>(() => userStore.currencyOptions);
// const themeOptions = computed<ThemeOption[]>(() => userStore.themeOptions);
const languageOptions = computed(() =>
  userStore.languageOptions.map((option) => ({
    ...option,
    label: t(`language.${option.value}`),
  })),
);

const themeOptions = computed(() =>
  userStore.themeOptions.map((option) => ({
    ...option,
    label: t(`theme.${option.value}`),
  })),
);

const currencyOptions = computed(() =>
  userStore.currencyOptions.map((option) => ({
    ...option,
    label: t(`currencyLabel.${option.value}`),
  })),
);

const currentLanguage = computed({
  get: () =>
    (languageOptions.value.find((opt) => opt.value === userStore.settings.language) ||
      languageOptions.value[0])!,
  set: (option: LanguageOption) => userStore.setLanguage(option.value),
});

const currentCurrency = computed({
  get: () =>
    (currencyOptions.value.find((opt) => opt.value === userStore.settings.currency) ||
      currencyOptions.value[0])!,
  set: (option: CurrencyOption) => userStore.setCurrency(option.value),
});

const theme = computed({
  get: () =>
    (themeOptions.value.find((opt) => opt.value === userStore.settings.theme) ||
      themeOptions.value[0])!,
  set: (option: ThemeOption) => userStore.setTheme(option.value),
});

const useSystemPreference = computed({
  get: () => userStore.settings.useSystemPreference,
  set: (value: boolean) => userStore.setSystemPreference(value),
});

const onSystemPreferenceChange = (value: boolean) => {
  useSystemPreference.value = value;
};
</script>
