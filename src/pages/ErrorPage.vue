<template>
  <q-page padding class="tw-min-h-screen tw-flex tw-justify-center tw-items-center">
    <div class="tw-text-center tw-max-w-lg tw-mx-auto">
      <PageTitle :title="`${errorCode} ${$t('404.errorTitle')}`" />
      <PageSubtitle :subtitle="$t('404.notExist')" />
      <PageInfoText :description="$t('404.suggestion')" />

      <div
        class="tw-text-xs tw-font-light tw-italic tw-text-sans tw-leading-none tw-text-start sm:tw-w-1/2 tw-mx-auto tw-my-8"
      >
        <p>
          {{ $t('404.errorCode') }}: <span class="tw-text-base">{{ errorCode }}</span>
        </p>
        <p v-if="errorInfo">
          {{ $t('404.additionalInfo') }}: <span class="tw-text-sm">{{ errorInfo }}</span>
        </p>
      </div>
      <div
        class="tw-flex tw-flex-col sm:tw-flex-row tw-justify-center tw-items-center tw-gap-4 sm:tw-gap-4"
      >
        <AppButton to="/" :label="$t('404.goHome')" :class-name="'!tw-w-full'" />
        <AppButton to="/contact" :label="$t('404.contactSupport')" :class-name="'!tw-w-full'" />
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

const errorCode = computed(() => '404');
const errorInfo = computed(() => 'Page not found or moved');
</script>
