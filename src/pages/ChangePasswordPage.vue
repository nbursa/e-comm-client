<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">
          Change Password
        </h4>
        <q-form class="!tw-w-full" @submit.prevent="changePassword">
          <q-card-section>
            <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
              Successfully changed password!
            </div>
          </q-card-section>

          <q-card-section
            v-if="!success"
            class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"
          >
            <q-input
              v-model="oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              label="Current Password"
              dense
              lazy-rules
              :rules="[required, passwordRules]"
              class="tw-w-full"
            >
              <template #append>
                <q-icon
                  :name="showOldPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleCurrentPassword"
                />
              </template>
            </q-input>
            <q-input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              label="New Password"
              dense
              lazy-rules
              :rules="[required, passwordRules]"
              class="tw-w-full"
            >
              <template #append>
                <q-icon
                  :name="showNewPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleNewPassword"
                />
              </template>
            </q-input>
            <q-input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm New Password"
              dense
              lazy-rules
              :rules="[required, confirmPasswordRules]"
              class="tw-w-full"
            >
              <template #append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleConfirmPassword"
                />
              </template>
            </q-input>
          </q-card-section>

          <div v-if="errorMessage" class="tw-text-red-500 tw-mb-4">{{ errorMessage }}</div>

          <div class="tw-flex tw-flex-col tw-gap-2">
            <QButton
              v-if="!success"
              type="submit"
              label="Change Password"
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
import { useAuthStore } from '@/stores/auth';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';

const authStore = useAuthStore();
const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref<string | null>(null);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const success = ref(false);

const toggleCurrentPassword = () => {
  showOldPassword.value = !showOldPassword.value;
};

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const goBack = () => {
  router.back();
};

const changePassword = async () => {
  errorMessage.value = null;
  if (newPassword.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'New password and confirm password do not match.',
      position: 'top',
      timeout: 5000,
      icon: 'error',
    });
    errorMessage.value = 'New password and confirm password do not match.';
    return;
  }

  try {
    const message = await authStore.changePassword(oldPassword.value, newPassword.value);
    if (message) {
      $q.notify({
        type: 'positive',
        message: message,
        position: 'top',
        timeout: 5000,
        icon: 'check',
      });
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      success.value = true;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    errorMessage.value =
      axiosError.response?.data?.error || 'Failed to change password. Please try again.';
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
const passwordRules = (val: string) => {
  const minLength = 6;
  // const minLength = 8;
  // const hasUpperCase = /[A-Z]/.test(val);
  // const hasLowerCase = /[a-z]/.test(val);
  // const hasDigit = /\d/.test(val);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);

  // if (val.length < minLength) {
  //   return t('errors.validation.passwordMinLength', { minLength });
  // }
  // if (!hasUpperCase) {
  //   return t('errors.validation.passwordUpperCase');
  // }
  // if (!hasLowerCase) {
  //   return t('errors.validation.passwordLowerCase');
  // }
  // if (!hasDigit) {
  //   return t('errors.validation.passwordDigit');
  // }
  // if (!hasSpecialChar) {
  //   return t('errors.validation.passwordSpecialChar');
  // }
  if (val.length < minLength) {
    return t('errors.validation.passwordMinLength', { minLength });
  }
  return true;
};
const confirmPasswordRules = (val: string) => {
  return val === newPassword.value || t('errors.validation.passwordMismatch');
};
</script>
