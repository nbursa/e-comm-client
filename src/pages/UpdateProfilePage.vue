<template>
  <q-page padding class="!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center">
    <div class="tw-w-full sm:tw-max-w-72 tw-mx-auto">
      <q-card flat bordered class="!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent">
        <h4 class="tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif">
          Update Information
        </h4>
        <q-form class="!tw-w-full" @submit.prevent="updateProfile">
          <q-card-section v-if="success">
            <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
              Successfully updated user information!
            </div>
          </q-card-section>

          <q-card-section
            v-if="!success"
            class="tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"
          >
            <q-input
              v-model="updatedName"
              label="Name"
              type="text"
              dense
              lazy-rules
              :rules="[required]"
              class="tw-w-full"
            />
            <q-input
              v-model="updatedEmail"
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
            <QButton v-if="!success" type="submit" label="Update" class="!tw-w-full !tw-py-2.5" />
            <QButton
              v-if="!success"
              secondary
              label="Go Back"
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
import QButton from '@/components/base/QButton.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AxiosError } from 'axios';

const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const { t } = useI18n();

const updatedName = ref(authStore.user?.name || '');
const updatedEmail = ref(authStore.user?.email || '');
const errorMessage = ref<string | null>(null);
const success = ref(false);

const goBack = () => {
  router.back();
};

const updateProfile = async () => {
  try {
    const message = await authStore.updateProfile({
      name: updatedName.value,
      email: updatedEmail.value,
    });
    $q.notify({
      type: 'positive',
      message: message,
      position: 'top',
      timeout: 5000,
      icon: 'check',
    });
    success.value = true;
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
const emailRules = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val) ? true : t('errors.validation.invalidEmail');
};
</script>
