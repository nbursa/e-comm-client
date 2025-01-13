<template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    :overlay="true"
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
          v-model="themeSetting"
          :theme-options="themeOptions"
          :use-system-preference="useSystemPreference"
          class="tw-w-full !tw-px-4 tw-mb-4"
          @update:use-system-preference="onSystemPreferenceChange"
        />
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

const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;

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

const theme = computed(() => ({
  drawerBackground: $q.dark.isActive
    ? 'linear-gradient(135deg,  #77312B 0%, #1A202C 50%)'
    : 'linear-gradient(135deg, #FFFFFF 50%, #BFB48F 80%)',
  buttonBackgroundColor: $q.dark.isActive ? 'white' : 'black',
  buttonTextColor: $q.dark.isActive ? 'black' : 'white',
  separatorColor: $q.dark.isActive ? 'white' : 'black',
}));

const languageOptions = computed(() => userStore.languageOptions);

const currencyOptions = computed(() => userStore.currencyOptions);

const themeOptions = computed(() => userStore.themeOptions);

const currentLanguage = computed<LanguageOption>({
  get: () => {
    const currentLang = userStore.settings.language;
    return (
      languageOptions.value.find((option) => option.value === currentLang) ||
      languageOptions.value[0] || { label: 'English', value: 'en-US' }
    );
  },
  set: (value: LanguageOption) => {
    if (value) {
      userStore.settings.language = value.value;
    }
  },
});

const currentCurrency = computed<CurrencyOption>({
  get: () => {
    const currentCur = userStore.settings.currency;
    return (
      currencyOptions.value.find((option) => option.value === currentCur) ||
      currencyOptions.value[0] || { label: 'USD', value: 'USD' }
    );
  },
  set: (value: CurrencyOption) => {
    if (value) {
      userStore.setCurrency(value.value);
    }
  },
});

const themeSetting = computed<ThemeOption>({
  get: () => {
    const currentTheme = userStore.settings.theme;
    return (
      themeOptions.value.find((option) => option.value === currentTheme) ||
      themeOptions.value[0] || { label: 'Dark', value: 'dark' }
    );
  },
  set: (value: ThemeOption) => {
    if (value) {
      userStore.settings.theme = value.value;
    }
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
