<template>
  <q-layout view="hHh lpR fFf" class="tw-relative">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      :user-name="userName"
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
      <AppFooter :scroll-offset="scrollPosition" />
    </q-page-container>

    <MobileDrawer
      v-model:drawer-open="drawerOpen"
      :menu-items="mobileMenuItems"
      @navigate="navigate"
    />

    <ImagePreview v-model="imageStore.isOpen" :imgs="imageStore.images" />
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
import ImagePreview from '@/components/ImagePreview.vue';
import { useImageStore } from '@/stores/images';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const { t } = useI18n();
const imageStore = useImageStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const drawerOpen = ref(false);
const scrollPosition = ref(0);
const scrollContainer = ref<ScrollAreaRef | null>(null);
const scrolling = ref(false);
const position = ref(0);

const userName = computed(() => authStore.user?.name || '');
const isLoggedIn = computed(() => !!authStore.token);
const totalItems = computed(() => cartStore.totalItems);

const menuItems = computed(() => {
  const items = [
    { label: t('main.home'), path: '/' },
    { label: t('main.products'), path: '/products' },
  ];
  if (totalItems.value > 0) {
    items.push({ label: t('main.cart'), path: '/cart' });
  }
  // items.push({ label: userName.value.split(' ')[0] || t('main.userProfile'), path: '/profile' });
  return items;
});
// const menuItems = computed(() => [
//   { label: t('main.home'), path: '/' },
//   { label: t('main.products'), path: '/products' },
//   { label: t('main.cart'), path: '/cart' },
//   { label: userName.value.split(' ')[0] || t('main.userProfile'), path: '/profile' },
// ]);
const mobileMenuItems = computed(() => {
  const items = [
    { label: t('main.home'), path: '/' },
    { label: t('main.products'), path: '/products' },
  ];
  if (totalItems.value > 0) {
    items.push({ label: t('main.cart'), path: '/cart' });
  }
  if (isLoggedIn.value) {
    items.push({ label: userName.value.split(' ')[0] || t('main.userProfile'), path: '/profile' });
  } else {
    items.push({ label: t('main.userProfile'), path: '/profile' });
  }
  return items;
});
// const mobileMenuItems = computed(() => {
//   const items = [
//     { label: t('main.home'), path: '/' },
//     { label: t('main.products'), path: '/products' },
//     { label: t('main.cart'), path: '/cart' },
//   ];
//   if (isLoggedIn.value) {
//     items.push({ label: userName.value.split(' ')[0] || t('main.userProfile'), path: '/profile' });
//   } else {
//     items.push({ label: t('main.userProfile'), path: '/profile' });
//   }
//   return items;
// });

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
  const visualViewport = window.visualViewport;
  if (visualViewport) {
    const vh = visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  } else {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
};

onMounted(() => {
  setViewportHeight();

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight);
    window.visualViewport.addEventListener('scroll', setViewportHeight);
  } else {
    window.addEventListener('resize', setViewportHeight);
  }

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
<style lang="scss"></style>
