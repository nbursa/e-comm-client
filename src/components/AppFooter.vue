<template>
  <q-footer
    :class="['tw-overflow-hidden tw-relative tw-px-2 !tw-py-1 md:tw-px-4', themeClasses]"
    :style="footerStyle"
  >
    <div class="tw-min-h-8 !tw-flex tw-flex-row tw-justify-center tw-items-center tw-gap-4">
      <PageInfoText
        class="!tw-m-0 tw-p-0 !tw-text-xs"
        :color="isDark ? 'white' : 'black'"
        :description="$t('home.description')"
      />
      <q-btn
        v-if="isScrolledBtn"
        class="!tw-relative tw-bottom-0 tw-right-0 tw-p-4 tw-z-40"
        color="white"
        text-color="black"
        icon="arrow_upward"
        @click="scrollToTop"
      />
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import PageInfoText from '@/components/base/PageInfoText.vue';
import { useUserStore } from '@/stores/user';
import { computed, PropType, inject } from 'vue';

const props = defineProps({
  scrollOffset: {
    type: Number as PropType<number>,
    default: 0,
  },
});

const scrollToTop = inject('scrollToTop') as () => void;

const userStore = useUserStore();

const isDark = computed(() => userStore.settings.theme === 'dark');
const isScrolledBtn = computed(() => props.scrollOffset > 300);

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
