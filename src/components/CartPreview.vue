<template>
  <q-card
    class="cursor-pointer cart-summary"
    :class="[
      $q.dark.isActive ? 'bg-dark text-light' : 'bg-light text-dark',
      isCollapsed ? 'collapsed' : 'expanded',
    ]"
    style="max-width: 400px"
    @click="openCart"
  >
    <div
      :class="
        isCollapsed ? 'w-100 q-px-sm row items-center justify-between' : 'q-px-none col q-pa-sm'
      "
      style="width: 100%"
    >
      <div
        :class="isCollapsed ? 'q-mb-none text-center' : 'q-mb-sm'"
        :style="isCollapsed && 'width: 100%'"
      >
        Cart Summary
      </div>
      <div class="row items-center justify-between q-gutter-sm" style="width: 100%">
        <div class="q-mr-md row items-center justify-between">
          Total Items:
          <span :class="isCollapsed ? 'text-h6' : 'text-h5'">{{ totalItems }}</span>
        </div>
        <div class="row items-center justify-between">
          Total Price:
          <span :class="isCollapsed ? 'text-h6' : 'text-h5'">{{ totalPrice }}</span>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  isCollapsed: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  totalItems: {
    type: Number as PropType<number>,
    default: 0,
  },
  totalPrice: {
    type: Number as PropType<number>,
    default: 0,
  },
});

const cartStore = useCartStore();
const router = useRouter();
const $q = useQuasar() as QVueGlobals;

const openCart = () => {
  if (cartStore.items.length) {
    router.push('/cart');
  } else {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Cart is empty, add some products to cart first.',
      icon: 'error',
    });
  }
};
</script>
