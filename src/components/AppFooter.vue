<template>
  <q-footer
    :class="[
      'tw-text-center tw-py-0 tw-overflow-hidden tw-relative tw-px-2 md:tw-px-4',
      themeClasses,
    ]"
    :style="footerStyle"
  >
    <AnimatedLights :scroll-position="scrollOffset" direction="toRight" />

    <div class="!tw-flex tw-flex-row tw-justify-center tw-items-center tw-gap-4">
      <PageInfoText
        class="!tw-m-0 tw-p-1 !tw-text-xs"
        :color="isDark ? 'white' : 'black'"
        :description="$t('home.description')"
      />
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import PageInfoText from '@/components/base/PageInfoText.vue';
import AnimatedLights from './base/AnimatedLights.vue';
import { useUserStore } from '@/stores/user';
import { computed, PropType } from 'vue';

defineProps({
  scrollOffset: {
    type: Number as PropType<number>,
    default: 0,
  },
});

const userStore = useUserStore();

const isDark = computed(() => userStore.settings.theme === 'dark');

const footerStyle = computed(() => {
  return {
    background: isDark.value
      ? '#0D1117'
      : 'linear-gradient(135deg, rgb(255, 255, 255) 10%, rgb(191, 180, 143) 70%)',
  };
});

const themeClasses = computed(() => {
  return isDark.value ? 'bg-dark text-light' : 'bg-light text-dark';
});
</script>
