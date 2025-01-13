<template>
  <q-footer
    class="tw-text-center tw-py-0 tw-overflow-hidden tw-relative"
    :class="footerClasses"
    :style="footerStyle"
  >
    <AnimatedLights :scroll-position="position" direction="toRight" />
    <div class="tw-flex tw-justify-center tw-items-center tw-gap-4">
      <span
        ><PageInfoText class="!tw-m-0 !tw-text-sm" :description="$t('home.description')"
      /></span>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import PageInfoText from '@/components/base/PageInfoText.vue';
import AnimatedLights from './base/AnimatedLights.vue';
import { computed } from 'vue';

const props = defineProps({
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

const position = computed(() => props.scrollPosition);
</script>
