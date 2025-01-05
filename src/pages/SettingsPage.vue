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

const userStore = useUserStore();

const languageOptions = userStore.languageOptions;

const currentLanguage = computed({
  get: () =>
    languageOptions.find((option) => option.value === userStore.language) ?? languageOptions[0],
  set: (newLang: { value: string; label: string }) => {
    userStore.language = newLang.value as 'en-US' | 'sr-RS' | 'fr-FR';
  },
});

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const theme = computed({
  get: () => userStore.theme,
  set: (newTheme: string) => {
    userStore.theme = newTheme;
  },
});

const useSystemPreference = computed({
  get: () => userStore.useSystemPreference,
  set: (value: boolean) => {
    userStore.useSystemPreference = value;
  },
});

const onLanguageChange = (selectedLanguage: { value: string; label: string }) => {
  currentLanguage.value = selectedLanguage;
};

const updateTheme = (selectedTheme: { value: string; label: string }) => {
  theme.value = selectedTheme.value;
};

const onSystemPreferenceChange = (value: boolean) => {
  useSystemPreference.value = value;
};
</script>
