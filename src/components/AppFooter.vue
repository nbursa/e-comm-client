<template>
  <q-footer
    :class="[
      'tw-text-center tw-py-0 tw-overflow-hidden tw-relative tw-px-2 md:tw-px-4',
      themeClasses,
    ]"
    :style="footerStyle"
  >
    <AnimatedLights :scroll-position="scrollPosition" direction="toRight" />
    <div class="!tw-flex tw-flex-row tw-justify-center tw-items-center tw-gap-4">
      <span
        >{{ themeClasses }}
        <PageInfoText class="!tw-m-0 !tw-text-sm" :description="$t('home.description')"
      /></span>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import PageInfoText from '@/components/base/PageInfoText.vue';
import AnimatedLights from './base/AnimatedLights.vue';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

defineProps({
  footerStyle: {
    type: Object,
    default: () => {},
  },
  scrollPosition: {
    type: Number,
    required: true,
  },
});

const userStore = useUserStore();

const isDark = computed(() => userStore.settings.theme === 'dark');

const themeClasses = computed(() => {
  return isDark.value ? 'bg-dark text-dark' : 'bg-dark text-light';
});
</script>
