<template>
  <q-page padding class="tw-max-w-screen-md tw-mx-auto tw-pb-16 tw-pt-4 tw-px-3">
    <h5 class="tw-text-3xl tw-mt-4 tw-font-semibold tw-font-serif tw-my-4 tw-text-center tw-mb-8">
      {{ $t('settings.title') }}
    </h5>
    <q-separator class="q-my-md" />

    <!-- Language & Currency Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <h6 class="text-subtitle1 text-weight-regular">{{ $t('settings.preferences') }}</h6>
      </div>
      <div class="col-12 col-sm-6">
        <LanguageSelector v-model="currentLanguage" :language-options="languageOptions" />
      </div>
      <div class="col-12 col-sm-6">
        <CurrencySelector
          v-model="currentCurrency"
          :use-system-preference="useSystemPreference"
          :currency-options="currencyOptions"
        />
      </div>
    </div>

    <!-- Theme Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <h6 class="text-subtitle1 text-weight-regular">{{ $t('settings.appearance') }}</h6>
      </div>
      <div class="col-12">
        <ThemeSelector
          v-model="theme"
          :theme-options="themeOptions"
          :use-system-preference="useSystemPreference"
          @update:use-system-preference="onSystemPreferenceChange"
        />
      </div>
    </div>

    <!-- Data Management Section -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h6 class="text-subtitle1 text-weight-regular">{{ $t('settings.dataManagement') }}</h6>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat class="!tw-bg-transparent">
          <q-card-section>
            <div class="text-subtitle2">{{ $t('settings.clearCache') }}</div>
            <div class="text-caption">{{ $t('settings.clearCacheDescription') }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              :class="isDark ? 'bg-white text-black' : 'bg-dark text-white'"
              @click="clearCache"
            >
              {{ $t('settings.clearCacheButton') }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat class="!tw-bg-transparent">
          <q-card-section>
            <div class="text-subtitle2">{{ $t('settings.clearSettingsTitle') }}</div>
            <div class="text-caption">{{ $t('settings.resetDescription') }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              :class="isDark ? 'bg-white text-black' : 'bg-dark text-white'"
              @click="resetStorage"
            >
              {{ $t('settings.resetButton') }}
            </q-btn>
          </q-card-actions>
        </q-card>
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
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';
import { storage } from '@/utils/storage';

const userStore = useUserStore();
const { t } = useI18n();
const $q = useQuasar() as QVueGlobals;

const isDark = computed(() => userStore.settings.theme === 'dark');
const languageOptions = computed(() =>
  userStore.languageOptions.map((option) => ({
    ...option,
    label: t(`common.language.${option.value}`),
  })),
);

const themeOptions = computed(() =>
  userStore.themeOptions.map((option) => ({
    ...option,
    label: t(`common.theme.${option.value}`),
  })),
);

const currencyOptions = computed(() =>
  userStore.currencyOptions.map((option) => ({
    ...option,
    label: t(`common.currencyLabel.${option.value}`),
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

const clearCache = () => {
  $q.dialog({
    title: t('settings.clearCacheTitle'),
    message: t('settings.clearCacheConfirm'),
    ok: {
      label: t('common.yes'),
      flat: true,
      color: $q.dark.isActive ? 'bg-white' : 'bg-dark',
      textColor: $q.dark.isActive ? 'text-black' : 'text-white',
    },
    cancel: {
      label: t('common.no'),
      flat: true,
      color: 'transparent',
      textColor: $q.dark.isActive ? 'white' : 'black',
    },
  }).onOk(() => {
    storage.clearProductsCache();
    $q.notify({
      type: 'positive',
      message: t('settings.clearCacheSuccess'),
      position: 'top',
      timeout: 1000,
    });
  });
};

const resetStorage = () => {
  $q.dialog({
    title: t('settings.resetTitle'),
    message: t('settings.resetConfirm'),
    ok: {
      label: t('common.yes'),
      flat: true,
      color: $q.dark.isActive ? 'bg-white' : 'bg-dark',
      textColor: $q.dark.isActive ? 'text-black' : 'text-white',
    },
    cancel: {
      label: t('common.no'),
      flat: true,
      color: 'transparent',
      textColor: $q.dark.isActive ? 'white' : 'black',
    },
  }).onOk(() => {
    storage.clearUserSettings();
    $q.notify({
      type: 'positive',
      message: t('settings.resetSuccess'),
      position: 'top',
      timeout: 1000,
    });
    window.location.reload();
  });
};
</script>
