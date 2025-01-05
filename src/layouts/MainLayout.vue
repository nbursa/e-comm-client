<template>
  <q-layout view="hHh lpR fFf" class="shadow-2 text-body1">
    <AppHeader
      :menu-items="menuItems"
      :drawer-open="drawerOpen"
      @update:drawer-open="toggleDrawer"
    />

    <MobileDrawer :menu-items="menuItems" :drawer-open="drawerOpen" @navigate="navigate" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MobileDrawer from '@/components/MobileDrawer.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();
const { t } = useI18n();
const drawerOpen = ref(false);

const menuItems = computed(() => [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
  { label: t('main.settings'), path: '/settings' },
]);

function navigate(item: { label: string; path: string }) {
  drawerOpen.value = false;
  router.push(item.path);
}

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>
