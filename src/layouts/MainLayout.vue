<template>
  <q-layout view="hHh lpR fFf" class="tw-w-screen tw-h-screen text-body1 scroll">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      :scroll-offset="scrollPosition"
      @update:drawer-open="toggleDrawer"
    />

    <MobileDrawer
      v-model:drawer-open="drawerOpen"
      :menu-items="mobileMenuItems"
      @navigate="navigate"
    />

    <q-scroll-area ref="scrollContainer" class="tw-w-full tw-h-full">
      <q-page-container class="tw-mx-auto tw-max-w-screen-xl">
        <router-view :scroll-position="position" :scroll-offset="scrollPosition" />
      </q-page-container>

      <q-scroll-observer @scroll="scrollHandler" />
    </q-scroll-area>

    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import MobileDrawer from '@/components/MobileDrawer.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { provide } from 'vue';

interface ScrollAreaRef {
  setScrollPosition: (axis: 'vertical' | 'horizontal', offset: number, duration?: number) => void;
}

const router = useRouter();
const { t } = useI18n();

const drawerOpen = ref(false);
const scrollPosition = ref(0);
const scrollContainer = ref<ScrollAreaRef | null>(null);
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
};

provide('scrollToTop', scrollToTop);
</script>
