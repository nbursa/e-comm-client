<template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    :overlay="true"
    behavior="desktop"
    class="!tw-bg-transparent"
    :style="{
      background: !isDark
        ? 'linear-gradient(135deg, #FFFFFF 50%, #BFB48F 80%)'
        : 'linear-gradient(135deg,  #77312B 50%, #1A202C 70%)',
    }"
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
              :key="item.label"
              outline
              :to="item.path"
              :label="item.label"
              :flat="false"
              :color="color"
              :text-color="text"
              class-name="!tw-w-full"
            />
          </q-item>
        </q-list>

        <q-separator :color="isDark ? 'white' : 'black'" class="tw-w-10/12 !tw-mt-4 !tw-mb-6" />

        <h2 class="text-h6 tw-mb-4">{{ $t('settings.title') }}</h2>

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
          v-model="theme"
          :theme-options="themeOptions"
          :use-system-preference="useSystemPreference"
          class="tw-w-full !tw-px-4 tw-mb-4"
          @update:use-system-preference="onSystemPreferenceChange"
        />
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<!-- <template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    :overlay="true"
    behavior="desktop"
    @update:model-value="$emit('update:drawerOpen', $event)"
  >
    <q-scroll-area class="tw-h-full">
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8">
        <q-list class="tw-w-full tw-text-center">
          <q-item
            v-for="item in menuItems"
            :key="item.label"
            clickable
            class="!tw-p-3 tw-justify-center"
            @click="$emit('navigate', item)"
          >
            <q-item-section avatar>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
  </q-drawer>
</template> -->

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';
import { useUserStore } from '@/stores/user';
import { setLanguage } from '@/boot/i18n';
import LanguageSelector from '@/components/base/LanguageSelector.vue';
import CurrencySelector from '@/components/base/CurrencySelector.vue';
import ThemeSelector from '@/components/base/ThemeSelector.vue';
import { useI18n } from 'vue-i18n';
import { CurrencyOption, LanguageOption, MenuItem, ThemeOption } from '@/types';
import AppButton from './base/AppButton.vue';

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

defineEmits<{
  'update:drawerOpen': [value: boolean];
  navigate: [MenuItem];
}>();

const isDark = computed(() => $q.dark.isActive);

const color = computed(() => (isDark.value ? 'q-light' : 'q-dark'));
const text = computed(() => (isDark.value ? 'q-light' : 'q-dark'));

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

const currentLanguage = computed<LanguageOption>({
  get: () => {
    const currentLang = userStore.settings.language;
    return (languageOptions.value.find((opt) => opt.value === currentLang) ||
      languageOptions.value[0])!;
  },
  set: (option: LanguageOption) => {
    userStore.settings.language = option.value;
    setLanguage(option.value);
  },
});

const currentCurrency = computed<CurrencyOption>({
  get: () => {
    const currentCur = userStore.settings.currency;
    return (currencyOptions.value.find((opt) => opt.value === currentCur) ||
      currencyOptions.value[0])!;
  },
  set: (option: CurrencyOption) => {
    userStore.settings.currency = option.value;
  },
});

const theme = computed<ThemeOption>({
  get: () => {
    const currentTheme = userStore.settings.theme;
    return (themeOptions.value.find((opt) => opt.value === currentTheme) || themeOptions.value[0])!;
  },
  set: (option: ThemeOption) => {
    userStore.settings.theme = option.value;
    $q.dark.set(option.value === 'dark');
  },
});

const useSystemPreference = computed({
  get: () => userStore.settings.useSystemPreference,
  set: (value: boolean) => {
    userStore.settings.useSystemPreference = value;
    userStore.updateTheme();
  },
});

const onSystemPreferenceChange = (value: boolean) => {
  useSystemPreference.value = value;
};

const drawerWidth = computed(() => ($q.screen.lt.sm ? $q.screen.width : 380));
</script>

<style lang="scss" scoped>
// aside.q-drawer.sidebar.q-drawer--standard.q-drawer--on-top {
//   position: relative !important;
//   overflow: hidden !important;

//   -webkit-mask-image: radial-gradient(
//     circle at top left,
//     rgba(0, 0, 0, 1) 0%,
//     rgba(0, 0, 0, 0.7) 40%,
//     rgba(0, 0, 0, 0.2) 70%,
//     rgba(0, 0, 0, 0) 100%
//   );
//   mask-image: radial-gradient(
//     circle at top left,
//     rgba(0, 0, 0, 1) 0%,
//     rgba(0, 0, 0, 0.7) 40%,
//     rgba(0, 0, 0, 0.2) 70%,
//     rgba(0, 0, 0, 0) 100%
//   );

//   -webkit-mask-repeat: no-repeat;
//   mask-repeat: no-repeat;
//   -webkit-mask-size: cover;
//   mask-size: cover;

//   background-color: inherit;
//   z-index: 1000;
// }
</style>
