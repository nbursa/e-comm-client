<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">
          Reset Password
        </h4>
        <q-form class="!tw-w-full" @submit.prevent="resetPassword">
          <q-card-section v-if="success">
            <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
              A password reset email has been sent to your email address.
            </div>
          </q-card-section>

          <q-card-section
            v-if="!success"
            class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"
          >
            <q-input
              v-model="email"
              label="Email"
              type="email"
              dense
              lazy-rules
              :rules="[required, emailRules]"
              class="tw-w-full"
            />
          </q-card-section>

          <div v-if="errorMessage" class="tw-text-red-500 tw-mb-4">{{ errorMessage }}</div>

          <div class="tw-flex tw-flex-col tw-gap-2">
            <QButton
              v-if="!success"
              type="submit"
              label="Reset Password"
              class="!tw-w-full !tw-py-2.5"
            />
            <QButton
              v-if="!success"
              secondary
              label="Cancel"
              class="!tw-w-full !tw-py-2.5"
              @click="goBack"
            />
            <QButton
              v-if="success"
              secondary
              label="Go Back"
              class="!tw-w-full !tw-py-2.5"
              @click="goBack"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { api } from '@/boot/axios';

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const email = ref('');
const errorMessage = ref<string | null>(null);
const success = ref(true);

const goBack = () => {
  router.back();
};

const resetPassword = async () => {
  errorMessage.value = null;
  try {
    const response = await api.post('/auth/reset-password', { email: email.value });
    $q.notify({
      type: 'positive',
      message: response.data.message,
      position: 'top',
      timeout: 5000,
      icon: 'check',
    });
    email.value = '';
    success.value = true;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    errorMessage.value =
      axiosError.response?.data?.error || 'Failed to reset password. Please try again.';
    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top',
      timeout: 5000,
      icon: 'error',
    });
  }
};

const required = (val: string) => !!val || t('errors.validation.required');
const emailRules = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val) ? true : t('errors.validation.invalidEmail');
};
</script>
