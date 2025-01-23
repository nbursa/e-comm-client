<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">Register</h4>
        <q-form class="!tw-w-full" @submit.prevent="handleRegister">
          <q-card-section class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4">
            <q-input
              v-model="name"
              label="Name"
              type="text"
              dense
              lazy-rules
              :rules="[required]"
              class="tw-w-full"
            />
            <q-input
              v-model="email"
              label="Email"
              type="email"
              dense
              lazy-rules
              :rules="[required, emailRules]"
              class="tw-w-full"
            />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              dense
              lazy-rules
              :rules="[required]"
              class="tw-w-full"
            />
            <q-input
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              dense
              lazy-rules
              :rules="[required, confirmPasswordRules]"
              class="tw-w-full"
            />
          </q-card-section>
          <div class="tw-flex tw-flex-col tw-gap-2">
            <QButton type="submit" label="Register" class="!tw-w-full !tw-py-2.5" />
            <QButton secondary :to="HOME_PATH" label="Cancel" class="!tw-w-full !tw-py-2.5" />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import QButton from '@/components/base/QButton.vue';
import { PROFILE_PATH, HOME_PATH } from '@/constants/routes';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const name = ref('');
const confirmPassword = ref('');
const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();

const handleRegister = async () => {
  console.log('Registering user...');
  if (password.value !== confirmPassword.value) {
    console.error('Passwords do not match');
    return;
  }
  try {
    await authStore.register(name.value, email.value, password.value);
    console.log('Registration successful');
    router.push(PROFILE_PATH);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

const required = (val: string) => !!val || t('errors.validation.required');
const emailRules = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val) ? true : t('errors.validation.invalidEmail');
};
const confirmPasswordRules = (val: string) => {
  return val === password.value || t('errors.validation.passwordMismatch');
};
</script>
