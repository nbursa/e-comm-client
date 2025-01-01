<template>
  <q-layout view="hHh lpR fFf" class="shadow-2">
    <q-header elevated :class="themeStyle">
      <q-toolbar>
        <q-toolbar-title>E-comm</q-toolbar-title>

        <div class="gt-xs">
          <q-btn flat to="/" label="Home" />
          <q-btn flat to="/products" label="Products" />
          <q-btn flat to="/cart" label="Cart" />
          <q-btn flat to="/checkout" label="Checkout" />
          <q-btn flat to="/settings" label="Settings" />
        </div>

        <q-btn flat round dense icon="menu" class="lt-sm" @click="drawerOpen = !drawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      side="right"
      bordered
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
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const drawerOpen = ref(false);
const router = useRouter();
const $q = useQuasar() as QVueGlobals;

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Cart', path: '/cart' },
  { label: 'Checkout', path: '/checkout' },
  { label: 'Settings', path: '/settings' },
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
