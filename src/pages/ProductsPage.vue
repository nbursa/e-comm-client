<template>
  <q-page padding class="scroll">
    <!-- Cart Summary -->
    <q-card
      bordered
      class="q-mb-md cursor-pointer cart-summary"
      :class="[
        $q.dark.isActive ? 'bg-dark text-light' : 'bg-light text-dark',
        isCollapsed ? 'collapsed' : 'expanded',
      ]"
      @click="openCart"
    >
      <div
        :class="
          isCollapsed ? 'w-100 q-px-md row items-center justify-between' : 'q-px-none col q-pa-md'
        "
        style="width: 100%"
      >
        <h5
          :class="isCollapsed ? 'q-mb-none text-center' : 'q-mb-sm'"
          :style="isCollapsed && 'width: 100%'"
        >
          Cart Summary
        </h5>
        <div class="row items-center justify-between" style="width: 100%">
          <div class="q-mr-md">
            Total Items:
            <span :class="isCollapsed ? 'text-h6' : 'text-h4'">{{ totalItems }}</span>
          </div>
          <div>
            Total Price:
            <span :class="isCollapsed ? 'text-h6' : 'text-h4'">{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <h5 class="q-m-sm">Products</h5>

    <q-separator class="q-my-md" />

    <!-- Product List -->
    <q-list v-if="paginatedProducts.length">
      <q-card
        v-for="product in paginatedProducts"
        :key="product.id"
        class="q-mb-md"
        bordered
        style="max-width: 400px"
        @click="viewProduct(product)"
      >
        <q-img :src="product.image" :alt="product.name" class="q-card-img-top" />
        <q-card-section>
          <div class="text-bold product-name">{{ product.name }}</div>
          <div class="text-caption">{{ getFirstSentence(product.description) }}</div>
        </q-card-section>

        <q-card-actions align="right" class="row justify-between items-center">
          <div class="q-mt-sm text-bold price-text">
            <template v-if="product.discount">
              <s class="text-grey">{{ formatPrice(product.price) }}</s>
              <span class="text-positive q-ml-sm">
                {{ formatPrice(product.discountedPrice || product.price) }}</span
              >
            </template>
            <template v-else>
              {{ formatPrice(product.price) }}
            </template>
          </div>
          <q-btn
            :color="color"
            :text-color="text"
            label="Add to Cart"
            @click="addToCart(product)"
          />
        </q-card-actions>
      </q-card>
    </q-list>

    <!-- Pagination -->
    <q-pagination
      v-if="products.length > itemsPerPage"
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      class="q-my-md text-center"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { Product } from '../stores/cart';
import { useCartStore } from '../stores/cart';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { scroll } from 'quasar';

const { getVerticalScrollPosition } = scroll;
const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const products = ref<Product[]>([]);

const currentPage = ref(1);
const itemsPerPage = 5;
const isCollapsed = ref(false);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const getFirstSentence = (text: string): string => {
  const match = text.match(/[^.!?]*[.!?]/);
  return match ? match[0] : text;
};

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
};

const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

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

const viewProduct = (product: Product) => {
  router.push(`/products/${product.id}`);
};

const fetchProducts = async () => {
  $q.loading.show();
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    products.value = data.map((product: Product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      discount: Math.random() > 0.5,
      discountedPrice: product.price * (Math.random() > 0.5 ? 0.9 : 1),
      quantity: 0,
    }));
  } catch {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Failed to fetch products. Please try again later.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const handleScroll = () => {
  const scrollTop = getVerticalScrollPosition(window);
  isCollapsed.value = scrollTop > 0;
};

onMounted(() => {
  fetchProducts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
