<template>
  <q-page
    padding
    class="tw-max-w-md tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4"
  >
    <PageInfoText :description="$t('thankYou.subtitle')" />
    <h5 class="tw-text-center tw-mb-8">{{ $t('thankYou.title') }}</h5>

    <div class="tw-text-left tw-w-full tw-px-4 tw-text-base tw-font-serif">
      {{ $t('thankYou.orderNumber') }}: <strong>#123456</strong>
    </div>

    <div class="tw-text-xs tw-mb-4 tw-pl-4">
      <p>
        {{ $t('thankYou.orderInfo') }}
      </p>
      <p>
        <span>
          {{ $t('thankYou.orderNumberMessage', { orderNumber: '#123456' }) }}
        </span>
      </p>
      <p>
        {{ $t('thankYou.orderStatus') }}
      </p>
    </div>

    <q-btn
      :color="color"
      :text-color="text"
      :label="$t('thankYou.button')"
      @click="() => $router.push('/products')"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';
import { computed } from 'vue';
import PageInfoText from '@/components/base/PageInfoText.vue';

const $q = useQuasar() as QVueGlobals;
const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
</script>
