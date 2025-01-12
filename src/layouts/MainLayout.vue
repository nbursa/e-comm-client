<template>
  <q-layout view="hHh lpR fFf" class="tw-w-screen tw-h-screen text-body1 scroll">
    <q-scroll-area class="tw-w-full tw-h-full">
      <q-scroll-observer @scroll="scrollHandler" />
      <AppHeader
        :menu-items="menuItems"
        :drawer-open="drawerOpen"
        :scroll-position="scrollPosition"
        :header-classes="headerClasses"
        @update:drawer-open="toggleDrawer"
      />

      <MobileDrawer :menu-items="mobileMenuItems" :drawer-open="drawerOpen" @navigate="navigate" />

      <q-page-container>
        <router-view :scroll-position="scrollPosition" />
      </q-page-container>

      <AppFooter :footer-classes="footerClasses" :scroll-position="scrollPosition" />
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
const headerClasses = computed(() => [
  'tw-px-2 md:tw-px-4',
  isDark.value
    ? isScrolledHeader.value
      ? 'bg-dark !tw-text-light  !tw-backdrop-filter !tw-backdrop-grayscale !tw-backdrop-blur-md !tw-backdrop-contrast-200'
      : 'bg-transparent !tw-text-light'
    : isScrolledHeader.value
      ? '!tw-bg-white !tw-backdrop-filter !tw-backdrop-blur-lg tw-text-dark'
      : 'bg-transparent tw-text-light',
]);
const footerClasses = computed(() => {
  return ['tw-px-2 md:tw-px-4', isDark.value ? 'tw-bg-white  text-dark' : 'bg-dark text-light'];
});
// const headerStyle = computed(() => {
//   const spread = Math.min(scrollPosition.value / 9, 100);
//   const firstColorStop = spread.toFixed();
//   const secondColorStop = (100 - spread / 2).toFixed();
//   console.log('headerStyle colors', firstColorStop, secondColorStop);

//   return {
//     background: `linear-gradient(
//       to right,
//       rgba(26, 32, 44, 0.9) ${firstColorStop}%,
//       rgba(119, 49, 43, 0.9) ${secondColorStop}%
//     )`,
//     color: isDark.value ? 'var(--tw-dark)' : 'inherit',
//   };
// });

// const footerStyle = computed(() => {
//   const spread = Math.min(scrollPosition.value / 9, 100);
//   const firstColorStop = spread.toFixed();
//   const secondColorStop = (100 - spread).toFixed();
//   console.log('headerStyle colors', firstColorStop, secondColorStop);

//   return {
//     background: `linear-gradient(
//       to left,
//       rgba(26, 32, 44, 0.9) ${firstColorStop}%,
//       rgba(119, 49, 43, 0.9) ${secondColorStop}%
//     )`,
//     color: isDark.value ? 'var(--tw-dark)' : 'inherit',
//   };
// });

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

const scrollHandler = (details: { position: { top: number } }) => {
  scrollPosition.value = details.position.top;
};
</script>

<style lang="scss" scoped>
.bg-rays::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0) 75%,
    rgba(255, 255, 255, 0)
  );
  background-size: 50px 50px;
  opacity: 0.5;
  pointer-events: none;
}
</style>
