<template>
  <q-page class="tw-p-4 tw-min-h-screen tw-flex tw-justify-center tw-items-center">
    <div class="tw-text-center tw-max-w-lg tw-mx-auto">
      <PageTitle :title="`${errorCode} ${$t('errors.errorTitle')}`" class="tw-mb-0" />
      <PageSubtitle :subtitle="$t('errors.notExist')" />
      <PageInfoText :description="$t('errors.suggestion')" />

      <div
        class="tw-text-xs tw-text-red-600 tw-leading-none tw-text-start sm:tw-w-1/2 tw-mx-auto tw-my-8"
      >
        <p class="tw-mb-1">
          {{ $t('errors.errorCode') }}: <span class="">{{ errorCode }}</span>
        </p>
        <p v-if="errorInfo">
          {{ $t('errors.additionalInfo') }}: <span class="">{{ errorInfo }}</span>
        </p>
      </div>

      <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4 sm:tw-gap-4">
        <div
          class="tw-w-full tw-flex tw-flex-col sm:tw-flex-row tw-justify-center tw-items-center tw-gap-4 sm:tw-gap-4"
        >
          <AppButton :label="$t('errors.goBack')" :class-name="'!tw-w-full'" @click="goBack" />

          <AppButton to="/" :label="$t('errors.goHome')" :class-name="'!tw-w-full'" />
        </div>
        <AppButton to="/contact" :label="$t('errors.contactSupport')" :class-name="'!tw-w-full'" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageTitle from '@/components/base/PageTitle.vue';
import PageSubtitle from '@/components/base/PageSubtitle.vue';
import AppButton from '@/components/base/AppButton.vue';
import PageInfoText from '@/components/base/PageInfoText.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const errorCode = computed(() => '404');
const errorInfo = computed(() => 'Page not found or moved');

const goBack = () => {
  router.back();
};
</script>
