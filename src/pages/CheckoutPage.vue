<template>
  <q-page padding>
    <h2>Checkout</h2>
    <q-list>
      <q-item v-for="item in cartStore.items" :key="item.id">
        <q-item-section>
          <div>{{ getProduct(item.id).name }}</div>
          <div>{{ formatPrice(getProduct(item.id).price * item.quantity) }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="negative" icon="delete" @click="removeItem(item.id)" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn :color="color" :text-color="text" label="Place Order" @click="placeOrder" />
  </q-page>
</template>

<script lang="ts" setup>
import { useCartStore, type Product } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const cartStore = useCartStore();
const $q = useQuasar();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const getProduct = (id: number): Product => {
  const product = cartStore.items.find((p) => p.id === id);
  if (!product) throw new Error(`Product with id ${id} not found`);
  return product;
};

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const removeItem = (id: number) => {
  cartStore.removeItem(id);
};

const placeOrder = (): void => {
  console.log('Order placed:', cartStore.items);
};
</script>
