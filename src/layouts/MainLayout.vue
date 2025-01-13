<template>
  <q-layout view="hHh lpR fFf" class="tw-w-screen tw-h-screen text-body1 scroll">
    <q-scroll-area ref="scrollContainer" class="tw-w-full tw-h-full">
      <q-scroll-observer @scroll="scrollHandler" />
      <AppHeader
        :menu-items="menuItems"
        :drawer-open="drawerOpen"
        :scroll-position="position"
        :header-classes="headerClasses"
        @update:drawer-open="toggleDrawer"
      />
      <MobileDrawer :menu-items="mobileMenuItems" :drawer-open="drawerOpen" @navigate="navigate" />

      <q-page-container style="max-width: 1200px !important; margin: 0 auto !important">
        <router-view :scroll-position="position" :scroll-offset="scrollPosition" />
      </q-page-container>

      <AppFooter :footer-classes="footerClasses" :scroll-position="position" />
    </q-scroll-area>
  </q-layout>
</template>

<script setup lang="ts">
import MobileDrawer from '@/components/MobileDrawer.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useUserStore } from '@/stores/user';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();

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
const isDark = computed(() => userStore.settings.theme === 'dark');
const isScrolledHeader = computed(() => scrollPosition.value > 40);
const themeClasses = computed(() => {
  if (isDark.value) {
    return isScrolledHeader.value ? 'bg-dark text-light' : 'bg-transparent text-light';
  } else {
    return isScrolledHeader.value ? 'bg-light text-dark' : 'bg-transparent text-dark';
  }
});
const headerClasses = computed(() => ['tw-px-2 md:tw-px-4', themeClasses.value]);
const footerClasses = computed(() => {
  return ['tw-px-2 md:tw-px-4', isDark.value ? 'bg-dark  text-dark' : 'bg-dark text-light'];
});

watch(
  () => userStore.settings.theme === 'dark',
  (isDark) => {
    document.body.classList.toggle('dark--page', isDark);
    document.body.classList.toggle('--q-light--page', !isDark);
  },
  { immediate: true },
);

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
