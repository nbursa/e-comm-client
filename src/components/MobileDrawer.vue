<template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    :overlay="true"
    behavior="desktop"
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
              :to="item.path"
              :label="item.label"
              :flat="false"
              :outline="false"
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

const drawerWidth = computed(() => ($q.screen.lt.sm ? $q.screen.width : 300));
</script>

<!-- <script setup lang="ts">
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';
import { computed, PropType } from 'vue';

interface MenuItem {
  label: string;
  path: string;
}

defineProps({
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  menuItems: {
    type: Array as PropType<{ label: string; path: string }[]>,
    required: true,
  },
});

defineEmits<{
  'update:drawerOpen': [value: boolean];
  navigate: [item: MenuItem];
}>();

const $q = useQuasar() as QVueGlobals;

const drawerWidth = computed<number>(() => {
  return $q.screen.lt.sm ? $q.screen.width : 300;
});
</script> -->
