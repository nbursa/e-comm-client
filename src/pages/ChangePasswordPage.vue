<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">
          {{ isResetPassword ? t('changePassword.titleReset') : t('changePassword.titleChange') }}
        </h4>
        <q-form class="!tw-w-full" @submit.prevent="handleSubmit">
          <q-card-section v-if="success">
            <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
              {{
                isResetPassword
                  ? t('changePassword.successReset')
                  : t('changePassword.successChange')
              }}
            </div>
          </q-card-section>

          <q-card-section
            v-if="!success"
            class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"
          >
            <q-input
              v-if="!isResetPassword"
              v-model="oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              :label="t('changePassword.currentPassword')"
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
              :label="t('changePassword.newPassword')"
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
              :label="t('changePassword.confirmPassword')"
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
              :label="isResetPassword ? t('changePassword.reset') : t('changePassword.change')"
              class="!tw-w-full !tw-py-2.5"
            />
            <QButton
              secondary
              :label="success ? t('common.continue') : t('changePassword.cancel')"
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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { AxiosError } from 'axios';

const authStore = useAuthStore();
const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref<string | null>(null);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const success = ref(false);
const token = ref<string | null>(null);
const email = ref<string | null>(null);
const isResetPassword = ref(false);

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

const handleSubmit = async () => {
  errorMessage.value = null;
  if (newPassword.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: t('changePassword.noMatch'),
      position: 'top',
      timeout: 5000,
      icon: 'error',
    });
    errorMessage.value = t('changePassword.noMatch');
    return;
  }

  try {
    let message;
    if (isResetPassword.value) {
      message = await authStore.resetPassword(email.value, token.value, newPassword.value);
    } else {
      message = await authStore.changePassword(oldPassword.value, newPassword.value);
    }
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
    errorMessage.value = axiosError.response?.data?.error || t('changePassword.errorMessage') as string;
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
  if (val.length < minLength) {
    return t('errors.validation.passwordMinLength', { minLength });
  }
  return true;
};
const confirmPasswordRules = (val: string) => {
  return val === newPassword.value || t('errors.validation.passwordMismatch');
};

onMounted(() => {
  email.value = route.query.email as string;
  token.value = route.query.token as string;

  if (token.value) {
    isResetPassword.value = true;
  }
});
</script>
