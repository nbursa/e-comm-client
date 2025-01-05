<template>
  <q-header elevated bordered :class="themeStyle">
    <q-toolbar>
      <q-toolbar-title class="header-title">{{ $t('main.ecomm') }}</q-toolbar-title>

      <div class="gt-md">
        <q-btn
          v-for="item in menuItems"
          :key="item.label"
          flat
          :to="item.path"
          :label="item.label"
        />
      </div>

      <q-btn flat round dense to="/cart" icon="shopping_cart" class="q-mr-sm cart-btn">
        <q-badge color="white" floating class="cart-badge">
          {{ totalItems }}
        </q-badge>
      </q-btn>

      <q-btn flat round dense icon="menu" class="lt-lg" @click="$emit('update:drawerOpen')" />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;

defineProps({
  menuItems: {
    type: Array as PropType<{ label: string; path: string }[]>,
    required: true,
  },
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});

defineEmits<{
  'update:drawerOpen': [];
}>();

const totalItems = computed(() => cartStore.totalItems);
const themeStyle = computed(() =>
  $q.dark.isActive ? 'bg-dark text-light shadow-dark' : 'bg-light text-dark shadow-light',
);
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
