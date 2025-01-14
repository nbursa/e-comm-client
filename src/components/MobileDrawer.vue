<template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    overlay
    behavior="desktop"
    class="drawer"
    :style="{ background: theme.drawerBackground }"
    @update:model-value="$emit('update:drawerOpen', $event)"
  >
    <q-scroll-area class="tw-h-full">
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-pt-8">
        <q-list class="tw-w-full tw-text-center tw-px-4">
          <q-item
            v-for="item in menuItems"
            :key="item.label"
            clickable
            class="!tw-p-0 tw-justify-center tw-mb-4"
            @click="$emit('navigate', item)"
          >
            <AppButton
              :to="item.path"
              :label="item.label"
              :color="theme.buttonBackgroundColor"
              :text-color="theme.buttonTextColor"
              class-name="!tw-w-full"
            />
          </q-item>
        </q-list>

        <q-separator :color="theme.separatorColor" class="tw-w-10/12 !tw-mt-4 !tw-mb-6" />

        <h2 class="text-h6 tw-mb-2">{{ $t('settings.title') }}</h2>

        <h6 class="text-subtitle2 text-weight-regular tw-mb-4 tw-mr-auto tw-px-4">
          {{ $t('settings.themeSettings') }}
        </h6>

        <LanguageSelector
          v-model="currentLanguage"
          :language-options="languageOptions"
          class="tw-w-full !tw-px-4 tw-mb-4"
        />
        <CurrencySelector
          v-model="currentCurrency"
          :currency-options="currencyOptions"
          class="tw-w-full !tw-px-4 tw-mb-4"
        />
        <ThemeSelector
          v-model="themeSetting"
          :theme-options="themeOptions"
          :use-system-preference="useSystemPreference"
          class="tw-w-full !tw-px-4 tw-mb-4"
          @update:use-system-preference="onSystemPreferenceChange"
        />

        <h6 class="text-subtitle2 text-weight-regular tw-mb-4 tw-mr-auto tw-px-4">
          {{ $t('settings.dataManagement') }}
        </h6>

        <div class="tw-flex tw-flex-col tw-gap-4 tw-px-4">
          <q-card flat class="!tw-bg-transparent">
            <q-card-section>
              <div class="text-body2">{{ $t('settings.clearCache') }}</div>
              <div class="text-caption">{{ $t('settings.clearCacheDescription') }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                :class="$q.dark.isActive ? 'bg-light text-black' : 'bg-dark text-white'"
                @click="clearProducts"
              >
                {{ $t('settings.clearCacheButton') }}
              </q-btn>
            </q-card-actions>
          </q-card>

          <q-card flat class="!tw-bg-transparent">
            <q-card-section>
              <div class="text-body2">{{ $t('settings.clearSettingsTitle') }}</div>
              <div class="text-caption">{{ $t('settings.resetDescription') }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                :class="$q.dark.isActive ? 'bg-light text-black' : 'bg-dark text-white'"
                @click="clearSettings"
              >
                {{ $t('settings.resetButton') }}
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/user';
import LanguageSelector from '@/components/base/LanguageSelector.vue';
import CurrencySelector from '@/components/base/CurrencySelector.vue';
import ThemeSelector from '@/components/base/ThemeSelector.vue';
import AppButton from './base/AppButton.vue';
import { CurrencyOption, LanguageOption, MenuItem, ThemeOption } from '@/types';
import { QVueGlobals } from 'quasar/dist/types/globals';
import { useI18n } from 'vue-i18n';
import { storage } from '@/utils/storage';

const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;
const { t } = useI18n();

defineProps({
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
});

const emit = defineEmits<{
  'update:drawerOpen': [value: boolean];
  navigate: [MenuItem];
}>();

const theme = computed(() => ({
  drawerBackground: $q.dark.isActive
    ? 'linear-gradient(135deg,  #77312B 0%, #1A202C 50%)'
    : 'linear-gradient(135deg, #FFFFFF 10%, #BFB48F 70%)',
  buttonBackgroundColor: $q.dark.isActive ? 'white' : 'black',
  buttonTextColor: $q.dark.isActive ? 'black' : 'white',
  separatorColor: $q.dark.isActive ? 'white' : 'black',
}));

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

const themeSetting = computed({
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

const drawerWidth = computed(() => ($q.screen.lt.sm ? $q.screen.width : 380));

const clearProducts = () => {
  $q.dialog({
    title: t('settings.resetTitle'),
    message: t('settings.resetConfirm'),
    class: $q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black',
    ok: {
      label: t('common.yes'),
      textColor: $q.dark.isActive ? 'black' : 'white',
      color: $q.dark.isActive ? 'white' : 'black',
    },
    cancel: {
      label: t('common.no'),
      textColor: $q.dark.isActive ? 'white' : 'black',
      color: 'transparent',
    },
    persistent: true,
  }).onOk(() => {
    storage.clearProductsCache();
    $q.notify({
      type: 'positive',
      message: t('settings.resetSuccess'),
      position: 'top',
      timeout: 1000,
      classes: 'notification-center',
    });
    setTimeout(() => {
      emit('update:drawerOpen', false);
      window.location.reload();
    }, 1200);
  });
};

const clearSettings = () => {
  $q.dialog({
    title: t('settings.clearCacheTitle'),
    message: t('settings.clearCacheConfirm'),
    ok: {
      label: t('common.yes'),
      flat: true,
      color: $q.dark.isActive ? 'grey-4' : 'grey-8',
    },
    cancel: {
      label: t('common.no'),
      flat: true,
    },
  }).onOk(() => {
    storage.clearUserSettings();
    $q.notify({
      type: 'positive',
      message: t('settings.clearCacheSuccess'),
      position: 'top',
      timeout: 1000,
    });
  });
};

// const resetStorage = () => {
//   $q.dialog({
//     title: t('settings.resetTitle'),
//     message: t('settings.resetConfirm'),
//     ok: {
//       label: t('common.yes'),
//       flat: true,
//       color: 'negative',
//     },
//     cancel: {
//       label: t('common.no'),
//       flat: true,
//     },
//   }).onOk(() => {
//     storage.clear();
//     $q.notify({
//       type: 'positive',
//       message: t('settings.resetSuccess'),
//       position: 'top',
//       timeout: 1000,
//     });
//     window.location.reload();
//   });
// };
</script>
