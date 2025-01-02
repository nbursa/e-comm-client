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
            />
            <q-toggle
              v-model="useSystemPreference"
              :label="$t('settings.followSystemTheme')"
              color="primary"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { locale } = useI18n();

const theme = ref<{ value: 'light' | 'dark'; label: string }>(
  $q.dark.isActive ? { value: 'dark', label: 'Dark' } : { value: 'light', label: 'Light' },
);

const useSystemPreference = ref(false);

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

watch(useSystemPreference, (value) => {
  if (value) {
    applySystemPreference();
  } else {
    updateTheme(theme.value.value);
  }
});

watch(theme, (selectedTheme) => {
  if (!useSystemPreference.value) {
    updateTheme(selectedTheme.value);
  }
});

const updateTheme = (selectedTheme: 'light' | 'dark') => {
  $q.dark.set(selectedTheme === 'dark');
};

const applySystemPreference = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  $q.dark.set(prefersDark);
  theme.value = prefersDark ? { value: 'dark', label: 'Dark' } : { value: 'light', label: 'Light' };
};

if (useSystemPreference.value) {
  applySystemPreference();
} else {
  updateTheme(theme.value.value);
}

const languageOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'sr-RS', label: 'Serbian' },
  { value: 'fr-FR', label: 'French' },
];

const currentLanguage = ref<{ value: string; label: string }>(
  languageOptions.find((option) => option.value === locale.value) || {
    value: 'en-US',
    label: 'English',
  },
);

const onLanguageChange = (selectedLanguage: { value: string; label: string }) => {
  locale.value = selectedLanguage.value;
};
</script>
