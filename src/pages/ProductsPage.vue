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
          <q-btn color="primary" label="Add to Cart" @click="addToCart(product.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Product {
  id: number;
  name: string;
  price: number;
}

const products = ref<Product[]>([
  { id: 1, name: 'Product A', price: 50 },
  { id: 2, name: 'Product B', price: 100 },
  { id: 3, name: 'Product C', price: 150 },
]);

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const addToCart = (id: number): void => {
  console.log(`Product ${id} added to cart`);
};
</script>
