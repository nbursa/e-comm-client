<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">
          {{ t('login.title') }}
        </h4>
        <q-form class="!tw-w-full" @submit.prevent="handleLogin">
          <q-card-section v-if="success">
            <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
              {{ t('login.successMessage') }}
            </div>
          </q-card-section>

          <q-card-section
            v-if="!success"
            class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"
          >
            <q-input
              v-model="email"
              :label="t('login.email')"
              type="email"
              dense
              lazy-rules
              :rules="[required, emailRules]"
              class="tw-w-full"
            />
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :label="t('login.password')"
              dense
              lazy-rules
              :rules="[required, passwordRules]"
              class="tw-w-full"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  @click="togglePassword"
                />
              </template>
            </q-input>
          </q-card-section>

          <div v-if="errorMessage" class="tw-text-red-500 tw-mb-4">{{ errorMessage }}</div>

          <div class="tw-flex tw-flex-col tw-gap-2">
            <QButton
              v-if="!success"
              type="submit"
              :disabled="!isValid"
              :label="t('login.login')"
              class="!tw-w-full !tw-py-2.5"
            />
            <div class="tw-flex tw-items-center tw-justify-center">{{ t('login.or') }}</div>
            <QButton
              v-if="!success"
              secondary
              :label="t('login.createAccount')"
              class="!tw-w-full !tw-py-2.5"
              @click="goToRegister"
            />
            <QButton
              v-if="success"
              secondary
              :label="t('login.goHome')"
              class="!tw-w-full !tw-py-2.5"
              @click="goHome"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import QButton from '@/components/base/QButton.vue';
import { HOME_PATH, PROFILE_PATH, REGISTER_PATH } from '@/constants/routes';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();

const email = ref('');
const password = ref('');
const success = ref(false);
const successMessage = ref('');
const showPassword = ref(false);
const errorMessage = ref<string | null>(null);

const isValid = computed(() => {
  return (
    email.value &&
    emailRules(email.value) === true &&
    password.value &&
    required(password.value) === true
  );
});

const goHome = () => {
  router.push(HOME_PATH);
};

const goToRegister = () => {
  router.push(REGISTER_PATH);
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = null;
  if (!email.value || !password.value) {
    $q.notify({
      type: 'negative',
      message: t('errors.loginRequired'),
      position: 'top',
      timeout: 5000,
      icon: 'error',
    });
    errorMessage.value = t('errors.loginRequired');
    return;
  }

  try {
    const message = await authStore.login(email.value, password.value);
    if (message) {
      $q.notify({
        type: 'positive',
        message: message,
        position: 'top',
        timeout: 5000,
        icon: 'check',
      });
      email.value = '';
      password.value = '';
      successMessage.value = message;
      success.value = true;
      await router.push(PROFILE_PATH);
    }
  } catch (error) {
    let errorMsg = t('login.loginFailed');
    if (error instanceof AxiosError) {
      errorMsg = error.response?.data?.error || error.message || errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message || errorMsg;
    }
    errorMessage.value = errorMsg;
    $q.notify({
      type: 'negative',
      message: errorMsg,
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
</script>
