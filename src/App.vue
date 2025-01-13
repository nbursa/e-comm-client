<template>
  <router-view />
</template>

<script setup lang="ts">
import 'quasar/src/css/index.sass';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

userStore.setUserStore();
</script>
