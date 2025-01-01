<template>
  <q-page padding class="flex flex-center items-center">
    <div class="text-center">
      <h1 class="text-h4 q-mb-lg">Welcome to E-Commerce Platform</h1>
      <p class="text-h6 q-mb-lg">Start shopping with us!</p>
      <q-btn :color="color" :text-color="text" to="/products" label="Products" />
    </div>
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
