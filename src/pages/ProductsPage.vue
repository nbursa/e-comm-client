<template>
  <q-page padding>
    <h2>Products</h2>
    <q-list>
      <q-item v-for="product in products" :key="product.id">
        <q-item-section>
          <div>{{ product.name }}</div>
          <div>{{ formatPrice(product.price) }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="primary" label="Add to Cart" @click="addToCart(product)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Product } from '../stores/cart';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Product A',
    price: 50,
    quantity: 0,
  },
  {
    id: 2,
    name: 'Product B',
    price: 100,
    quantity: 0,
  },
  {
    id: 3,
    name: 'Product C',
    price: 150,
    quantity: 0,
  },
]);

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const addToCart = (product: { id: number; name: string; price: number }) => {
  cartStore.addItem({ ...product, quantity: 1 });
};
</script>
