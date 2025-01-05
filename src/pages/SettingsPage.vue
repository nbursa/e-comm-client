<template>
  <q-page padding>
    <h5 class="q-m-sm">{{ $t('settings.title') }}</h5>

    <q-separator class="q-my-md" />

    <div class="row justify-center q-gutter-md">
      <div class="col-12 col-sm-8 col-md-4">
        <q-card>
          <q-card-section>
            <q-select
              v-model="currentLanguage"
              :options="languageOptions"
              :label="$t('settings.languageLabel')"
              outlined
              class="full-width"
              @update:model-value="onLanguageChange"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-8 col-md-4">
        <q-card>
          <q-card-section>
            <q-select
              v-model="theme"
              :options="themeOptions"
              :label="$t('settings.themeLabel')"
              outlined
              :disable="useSystemPreference"
              class="full-width"
              @update:model-value="updateTheme"
            />
            <q-toggle
              v-model="useSystemPreference"
              :label="$t('settings.followSystemTheme')"
              color="primary"
              class="q-mt-md"
              @update:model-value="onSystemPreferenceChange"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuasar } from 'quasar';
import { MessageLanguages, setLanguage } from '@/boot/i18n';

const userStore = useUserStore();
const $q = useQuasar();

const languageOptions = userStore.languageOptions;

interface LanguageOption {
  value: MessageLanguages;
  label: string;
}

const currentLanguage = computed({
  get: () => {
    const currentLang = userStore.settings.language;
    const option = userStore.languageOptions.find((opt) => opt.value === currentLang);
    return option || userStore.languageOptions[0];
  },
  set: (option: LanguageOption) => {
    userStore.settings.language = option.value;
  },
});

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const theme = computed({
  get: () =>
    themeOptions.find((option) => option.value === userStore.settings.theme) ?? themeOptions[0],
  set: (value: 'light' | 'dark') => {
    userStore.settings.theme = value;
    $q.dark.set(value === 'dark');
  },
});

const useSystemPreference = computed({
  get: () => userStore.settings.useSystemPreference,
  set: (value: boolean) => {
    userStore.settings.useSystemPreference = value;
    userStore.updateTheme();
  },
});

const onLanguageChange = (option: LanguageOption) => {
  userStore.settings.language = option.value;
  setLanguage(option.value);
};

const updateTheme = (selectedTheme: { value: 'light' | 'dark'; label: string }) => {
  theme.value = selectedTheme.value;
};

const onSystemPreferenceChange = (value: boolean) => {
  useSystemPreference.value = value;
};
</script>
