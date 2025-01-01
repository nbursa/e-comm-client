<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-sm">Welcome to E-Commerce Platform</h1>
    <p class="text-h6">Start shopping with us!</p>
    <q-btn :color="color" :text-color="text" to="/products" label="View Products" />
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { computed } from 'vue';

const $q = useQuasar() as QVueGlobals;

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
</script>
