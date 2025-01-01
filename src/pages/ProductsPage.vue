<template>
  <q-page padding>
    <h4 class="q-m-sm">Products</h4>
    <q-list>
      <q-item v-for="product in products" :key="product.id" class="q-pa-none">
        <q-item-section>
          <div>{{ product.name }}</div>
          <div>{{ formatPrice(product.price) }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            :color="color"
            :text-color="text"
            label="Add to Cart"
            @click="addToCart(product)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator class="q-my-md" />

    <q-card class="q-mb-md">
      <q-card-section>
        <h6 class="q-mb-sm">Cart Summary</h6>
        <div>Total Items: {{ totalItems }}</div>
        <div>Total Price: {{ formatPrice(totalPrice) }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Product } from '../stores/cart';
import { useCartStore } from '../stores/cart';
import { useQuasar } from 'quasar';

const cartStore = useCartStore();
const $q = useQuasar();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const products = ref<Product[]>([
  { id: 1, name: 'Product A', price: 50, quantity: 0 },
  { id: 2, name: 'Product B', price: 100, quantity: 0 },
  { id: 3, name: 'Product C', price: 150, quantity: 0 },
]);

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
};

const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);
</script>
