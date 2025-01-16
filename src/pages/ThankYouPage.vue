<template>
  <q-page padding class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
    <h5 class="tw-text-center">{{ $t('thankYou.title') }}</h5>
    <p class="tw-text-center">{{ $t('thankYou.subtitle') }}</p>
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

const $q = useQuasar() as QVueGlobals;

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
</script>
