<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-btn flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>My App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item v-for="item in menuItems" :key="item.label" clickable @click="navigate(item)">
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);
const router = useRouter();

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'Profile', path: '/profile' },
];

function navigate(item: { label: string; path: string }) {
  leftDrawerOpen.value = false;
  router.push(item.path);
}
</script>
