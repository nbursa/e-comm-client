<template>
  <q-layout view="hHh lpR fFf" class="tw-relative">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      :scroll-offset="scrollPosition"
      @update:drawer-open="toggleDrawer"
    />
    <q-page-container class="tw-mx-auto">
      <q-scroll-area
        ref="scrollContainer"
        class="!tw-w-full !min-h-full"
        :style="{
          height: `calc(var(--content-height) - env(safe-area-inset-bottom, 20px))`,
        }"
        :content-style="{ overscrollBehavior: 'contain' }"
        :content-active-style="{ overscrollBehavior: 'contain' }"
        behavior="smooth"
      >
        <router-view
          :scroll-position="position"
          :scroll-offset="scrollPosition"
          class="tw-pb-safe"
        />

        <q-scroll-observer @scroll="scrollHandler" />
        <div class="tw-h-[env(safe-area-inset-bottom,20px)]"></div>
      </q-scroll-area>
      <AppFooter />
    </q-page-container>

    <MobileDrawer
      v-model:drawer-open="drawerOpen"
      :menu-items="mobileMenuItems"
      @navigate="navigate"
    />
  </q-layout>
</template>

<script setup lang="ts">
import MobileDrawer from '@/components/MobileDrawer.vue';
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { provide } from 'vue';
import { ScrollAreaRef } from '@/types';

const router = useRouter();
const { t } = useI18n();

const drawerOpen = ref(false);
const scrollPosition = ref(0);
const scrollContainer = ref<ScrollAreaRef | null>(null);
const scrolling = ref(false);
const position = ref(0);

const menuItems = computed(() => [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
  { label: t('main.settings'), path: '/settings' },
]);
const mobileMenuItems = computed(() => [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
  { label: t('main.cart'), path: '/cart' },
]);

const navigate = (item: { label: string; path: string }) => {
  drawerOpen.value = false;
  router.push(item.path);
};

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.setScrollPosition('vertical', 0, 300);
  } else {
    console.warn('ScrollArea ref is null');
  }
};

const scrollHandler = (details: {
  position: { top: number; left: number };
  direction: 'up' | 'down' | 'left' | 'right';
  directionChanged: boolean;
  delta: { top: number; left: number };
  inflectionPoint: { top: number; left: number };
}) => {
  scrollPosition.value = details.position.top;
  scrolling.value = true;
};

provide('scrollToTop', scrollToTop);

const setViewportHeight = () => {
  // Use visual viewport for more accurate mobile height
  const visualViewport = window.visualViewport;
  if (visualViewport) {
    console.log('Visual viewport height:', visualViewport.height);
    const vh = visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  } else {
    // Fallback for browsers without visualViewport support
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
};

onMounted(() => {
  setViewportHeight();

  // Listen to visual viewport changes
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight);
    window.visualViewport.addEventListener('scroll', setViewportHeight);
  } else {
    window.addEventListener('resize', setViewportHeight);
  }

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });

  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', setViewportHeight);
      window.visualViewport.removeEventListener('scroll', setViewportHeight);
    } else {
      window.removeEventListener('resize', setViewportHeight);
    }
    window.removeEventListener('orientationchange', setViewportHeight);
  };
});
</script>

<style lang="scss">
:root {
  --header-height: 54px;
  --footer-height: 35px;
  --mobile-bottom-offset: 80px;
  --content-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.q-layout {
  min-height: 100dvh;
  height: 100dvh;
}
</style>
