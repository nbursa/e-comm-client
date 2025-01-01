<template>
  <q-page padding>
    <h5 class="q-mb-md">Checkout</h5>

    <!-- Cart Items List -->
    <q-list v-if="!ordered" class="q-mb-md">
      <q-item v-for="item in cartStore.items" :key="item.id">
        <q-item-section>
          <div class="text-bold">{{ getProduct(item.id).name }}</div>
          <div>
            {{ item.quantity }} x {{ formatPrice(getProduct(item.id).price) }} =
            <span class="text-positive">{{
              formatPrice(getProduct(item.id).price * item.quantity)
            }}</span>
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="negative" icon="delete" @click="removeItem(item.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Order Report -->
    <div v-else class="q-mb-md">
      <h6>Order Summary</h6>
      <q-list class="q-mb-md">
        <q-item v-for="item in cartStore.items" :key="item.id">
          <q-item-section>
            <div class="text-bold">{{ getProduct(item.id).name }}</div>
            <div>
              {{ item.quantity }} x {{ formatPrice(getProduct(item.id).price) }} =
              <span class="text-positive">{{
                formatPrice(getProduct(item.id).price * item.quantity)
              }}</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-pa-md bg-grey-3 text-dark rounded-borders">
        <h6>Total Items: {{ totalItems }}</h6>
        <h6>
          Total Price: <span class="text-positive">{{ formatPrice(totalPrice) }}</span>
        </h6>
      </div>
    </div>

    <!-- Controls -->
    <div>
      <q-btn
        :color="ordered ? 'positive' : color"
        :text-color="text"
        :label="ordered ? 'Order Placed!' : 'Place Order'"
        :disable="ordered"
        class="q-mt-md"
        @click="placeOrder"
      />

      <q-btn
        v-if="ordered"
        :color="color"
        :text-color="text"
        label="Shop again"
        class="q-mt-md q-ml-md"
        @click="viewProducts"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useCartStore, type Product } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const $q = useQuasar();
const ordered = ref(false);
const router = useRouter();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const totalItems = computed(() =>
  cartStore.items.reduce((total, item) => total + item.quantity, 0),
);

const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + getProduct(item.id).price * item.quantity, 0),
);

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
  ordered.value = !ordered.value;
};

const viewProducts = () => {
  cartStore.clearCart();
  router.push('/products');
};
</script>
