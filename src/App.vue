<template>
  <router-view />
</template>

<script setup lang="ts">
import 'quasar/src/css/index.sass';
import { useUserStore } from '@/stores/user';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';

const $q = useQuasar() as QVueGlobals;
const userStore = useUserStore();

userStore.setUserStore($q);
</script>
