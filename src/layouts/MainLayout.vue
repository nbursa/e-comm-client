<template>
  <q-layout view="hHh lpR fFf" class="tw-w-screen tw-h-screen text-body1 scroll">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      :scroll-position="position"
      @update:drawer-open="toggleDrawer"
    />

    <MobileDrawer :menu-items="mobileMenuItems" :drawer-open="drawerOpen" @navigate="navigate" />

    <q-scroll-area ref="scrollContainer" class="tw-w-full tw-h-full">
      <q-page-container style="max-width: 1200px !important; margin: 0 auto !important">
        <router-view :scroll-position="position" :scroll-offset="scrollPosition" />
      </q-page-container>

      <q-scroll-observer @scroll="scrollHandler" />
    </q-scroll-area>

    <AppFooter :scroll-position="position" />
  </q-layout>
</template>

<script setup lang="ts">
import MobileDrawer from '@/components/MobileDrawer.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();
const { t } = useI18n();

const drawerOpen = ref(false);
const scrollPosition = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);
const position = ref(0);

const menuItems = computed(() => [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
  { label: t('main.settings'), path: '/settings' },
]);
const mobileMenuItems = computed(() => [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
]);

const navigate = (item: { label: string; path: string }) => {
  drawerOpen.value = false;
  router.push(item.path);
};

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const scrollHandler = (details: { position: { top: number; left: number } }) => {
  const scrollTop = details.position.top;
  scrollPosition.value = scrollTop;
  const scrollArea = document.querySelector('.q-scrollarea__container') as HTMLElement;
  if (scrollArea) {
    const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
    position.value = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  } else {
    console.error('Scroll area container not found.');
  }
};
</script>
