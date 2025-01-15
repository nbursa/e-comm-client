<template>
  <q-layout view="hHh lpR fff" class="safe-bottom tw-h-screen tw-w-screen">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      :scroll-offset="scrollPosition"
      @update:drawer-open="toggleDrawer"
    />

    <q-scroll-area
      ref="scrollContainer"
      class="tw-w-full tw-h-full"
      :thumb-style="{
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: '0.75',
      }"
      :bar-style="{
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: '0.2',
      }"
      :vertical-thumb-style="{ opacity: scrolling ? '0.75' : '0' }"
      :delay="300"
      :distance="3"
      :thumb-style-delay="100"
      :content-style="{ overscrollBehavior: 'contain' }"
      :content-active-style="{ overscrollBehavior: 'contain' }"
      behavior="smooth"
    >
      <q-page-container class="tw-mx-auto tw-max-w-screen-xl">
        <router-view :scroll-position="position" :scroll-offset="scrollPosition" />
      </q-page-container>

      <q-scroll-observer @scroll="scrollHandler" />
    </q-scroll-area>

    <AppFooter />

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

onMounted(() => {
  const setVH = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);
});
</script>
