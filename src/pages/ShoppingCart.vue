<template>
  <q-page padding>
    <h2>Shopping Cart</h2>
    <q-list>
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

    <q-btn color="black" label="Checkout" class="q-mt-lg" @click="checkout" />
  </q-page>
</template>

<script lang="ts" setup>
import { useCartStore } from 'src/stores/cart';

const cartStore = useCartStore();

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const removeItem = (id: number) => {
  cartStore.removeItem(id);
};

const checkout = () => {
  console.log('Order placed:', cartStore.items);
  cartStore.clearCart();
};
</script>
