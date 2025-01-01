<template>
  <q-page padding>
    <h5>Shopping Cart</h5>
    <q-list class="q-mb-md">
      <q-item v-for="item in cartStore.items" :key="item.id">
        <q-item-section>
          <div>{{ item.name }}</div>
          <div>{{ formatPrice(item.price * item.quantity) }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="negative" icon="delete" @click="removeItem(item.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-md">
      <div>Total Items: {{ cartStore.totalItems }}</div>
      <div>Total Price: {{ formatPrice(cartStore.totalPrice) }}</div>
    </div>

    <q-btn :color="color" :text-color="text" label="Checkout" class="q-mt-lg" @click="checkout" />
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useCartStore } from 'src/stores/cart';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const removeItem = (id: number) => {
  cartStore.removeItem(id);
};

const checkout = () => {
  router.push('/checkout');
};
</script>
