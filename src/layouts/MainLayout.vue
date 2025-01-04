<template>
  <q-layout view="hHh lpR fFf" class="shadow-2 text-body1">
    <q-header elevated bordered :class="themeStyle">
      <q-toolbar>
        <q-toolbar-title class="header-title">{{ $t('main.ecomm') }}</q-toolbar-title>

        <div class="gt-md">
          <q-btn flat to="/" :label="$t('main.home')" />
          <q-btn flat to="/products" :label="$t('main.products')" />
          <q-btn flat to="/settings" :label="$t('main.settings')" />
        </div>

        <q-btn flat round dense to="/cart" icon="shopping_cart" class="q-mr-sm cart-btn">
          <q-badge color="white" floating class="cart-badge">
            {{ totalItems }}
          </q-badge>
        </q-btn>

        <q-btn flat round dense icon="menu" class="lt-lg" @click="drawerOpen = !drawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      side="right"
      :width="drawerWidth"
      :overlay="true"
      behavior="desktop"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <q-list class="padding">
            <q-item v-for="item in menuItems" :key="item.label" clickable @click="navigate(item)">
              <q-item-section avatar>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const drawerOpen = ref(false);
const router = useRouter();
const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const { t } = useI18n();

const totalItems = computed(() => cartStore.totalItems);

const menuItems = [
  { label: t('main.home'), path: '/' },
  { label: t('main.products'), path: '/products' },
  { label: t('main.settings'), path: '/settings' },
];

const drawerWidth = computed<number>(() => {
  return $q.screen.lt.md ? $q.screen.width : 300;
});

const themeStyle = computed(() =>
  $q.dark.isActive ? 'bg-dark text-light shadow-dark' : 'bg-light text-dark shadow-light',
);

function navigate(item: { label: string; path: string }) {
  drawerOpen.value = false;
  router.push(item.path);
}
</script>

<style lang="scss" scoped>
.cart-btn {
  position: relative;

  :deep(.cart-badge) {
    position: absolute;
    top: 7px;
    right: 7px;
    min-width: 20px;
    min-height: 20px;
    width: fit-content;
    aspect-ratio: 1;
    padding: 4px;
    border: 2px solid black;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }
}
</style>
