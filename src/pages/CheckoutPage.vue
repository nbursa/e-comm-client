<template>
  <q-page padding>
    <h2>Checkout</h2>
    <q-list>
      <q-item v-for="item in cartItems" :key="item.id">
        <q-item-section>
          <div>{{ getProduct(item.id).name }}</div>
          <div>{{ formatPrice(getProduct(item.id).price * item.quantity) }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="negative" icon="delete" @click="removeItem(item.id)" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn color="positive" label="Place Order" @click="placeOrder" />
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface CartItem {
  id: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const cartItems = ref<CartItem[]>([
  { id: 1, quantity: 2 },
  { id: 2, quantity: 1 },
]);

const products = ref<Product[]>([
  { id: 1, name: 'Product A', price: 50 },
  { id: 2, name: 'Product B', price: 100 },
]);

const getProduct = (id: number): Product => {
  const product = products.value.find((p) => p.id === id);
  if (!product) throw new Error(`Product with id ${id} not found`);
  return product;
};

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const removeItem = (id: number): void => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const placeOrder = (): void => {
  console.log('Order placed:', cartItems.value);
};
</script>
