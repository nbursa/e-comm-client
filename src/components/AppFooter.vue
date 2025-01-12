<template>
  <q-footer
    class="tw-text-center tw-py-0 tw-overflow-hidden"
    :class="footerClasses"
    :style="footerStyle"
  >
    <div
      class="lights tw-absolute tw-w-full tw-h-full tw-opacity-25"
      :style="{ '--lightsOffset': scrollPosition + 'px' }"
    ></div>
    <div class="tw-flex tw-justify-center tw-items-center tw-gap-4">
      <span>&copy; 2025</span>
      <span
        ><PageInfoText class="!tw-m-0 !tw-text-sm" :description="$t('home.description')"
      /></span>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import PageInfoText from '@/components/base/PageInfoText.vue';

defineProps({
  footerClasses: {
    type: Array,
    required: true,
  },
  footerStyle: {
    type: Object,
    default: () => {},
  },
  scrollPosition: {
    type: Number,
    required: true,
  },
});
</script>
