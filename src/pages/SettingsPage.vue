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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { themeManager } from '@/boot/theme';
import { type MessageLanguages, setLanguage } from '@/boot/i18n';

const { locale } = useI18n();

const languageOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'sr-RS', label: 'Serbian' },
  { value: 'fr-FR', label: 'French' },
];
const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const useSystemPreference = ref(localStorage.getItem('useSystemPreference') === 'true');
const theme = ref(
  themeOptions.find((t) => t.value === localStorage.getItem('theme')) || themeOptions[0],
);

const currentLanguage = ref<{ value: string; label: string }>(
  languageOptions.find((option) => option.value === locale.value) || {
    value: 'en-US',
    label: 'English',
  },
);

const updateTheme = (selectedTheme: { value: string; label: string }) => {
  themeManager.setTheme(selectedTheme.value === 'dark');
};

const onSystemPreferenceChange = (value: boolean) => {
  if (value) {
    themeManager.enableSystemTheme();
  } else {
    themeManager.disableSystemTheme();
  }
};

const onLanguageChange = (selectedLanguage: { value: string; label: string }) => {
  const lang = selectedLanguage.value as MessageLanguages;
  locale.value = lang;
  setLanguage(lang);
};
</script>
