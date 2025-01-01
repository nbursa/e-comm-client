<template>
  <q-page padding>
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

    <h5 class="q-m-sm">{{ product.title }}</h5>

    <q-separator class="q-my-md" />

    <q-card bordered class="q-mb-md">
      <q-img :src="product.image" :alt="product.name" class="q-card-img-top" />
      <q-card-section>
        <div class="text-h6 product-name">{{ product.name }}</div>
        <div class="text-caption q-mt-sm">{{ product.description }}</div>
      </q-card-section>
      <q-card-actions align="right" class="row justify-between items-center">
        <div class="q-mt-sm text-bold price-text">
          <template v-if="product.discount">
            <s class="text-grey">{{ formatPrice(product.price) }}</s>
            <span class="text-positive q-ml-sm">
              {{ formatPrice(product.discountedPrice || product.price) }}
            </span>
          </template>
          <template v-else>
            {{ formatPrice(product.price) }}
          </template>
        </div>
        <q-btn
          :color="color"
          :text-color="text"
          label="Add to Cart"
          @click.stop="addToCart(product)"
        />
      </q-card-actions>
    </q-card>

    <q-btn
      :color="color"
      :text-color="text"
      label="Back to Products"
      class="q-mt-md"
      @click="goBack"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore, type Product } from '@/stores/cart';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { scroll } from 'quasar';

const { getVerticalScrollPosition } = scroll;

const route = useRoute();
const router = useRouter();
const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();

const product = ref<Product>({
  id: 0,
  title: '',
  name: '',
  price: 0,
  quantity: 0,
  description: '',
  category: '',
  image: '',
  rating: {
    rate: 0,
    count: 0,
  },
});

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

const isCollapsed = ref(false);

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
  scrollToTop();
  $q.notify({
    color: 'positive',
    message: 'Product added to cart!',
    icon: 'check_circle',
  });
};

const openCart = () => {
  if (cartStore.items.length) {
    router.push('/cart');
  }
};

const goBack = () => {
  router.push('/products');
};

const fetchProductDetails = async () => {
  const { slug } = route.params;
  $q.loading.show();
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${slug}`);
    const data = await response.json();
    product.value = {
      id: data.id,
      name: data.title,
      title: data.title,
      price: data.price,
      description: data.description,
      image: data.image,
      category: data.category,
      discount: Math.random() > 0.5,
      discountedPrice: data.price * (Math.random() > 0.5 ? 0.9 : 1),
      quantity: 0,
      rating: {
        rate: 0,
        count: 0,
      },
    };
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch product details.',
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
  fetchProductDetails();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
