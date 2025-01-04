<template>
  <q-page padding>
    <CartPreview
      :total-items="totalItems"
      :total-price="totalPrice"
      :is-collapsed="isCollapsed"
      class="q-ml-auto q-mb-md"
    />

    <h5 class="q-m-sm">Products</h5>

    <q-separator class="q-my-md" />

    <div class="row justify-center q-mb-xl q-gutter-md" style="max-width: 2400px">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="col-xs-12 col-sm-10 col-md-5 col-lg-3 cursor-pointer"
      >
        <q-card class="q-mb-m full-width" bordered @click="viewProduct(product)">
          <q-img :src="product.image" :alt="product.name" class="q-card-img-top" />
          <q-card-section>
            <div class="text-bold product-name">{{ product.name }}</div>
            <div class="text-caption">{{ getFirstSentence(product.description) }}</div>
          </q-card-section>

          <q-card-actions class="row justify-between items-center">
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
              class="full-width q-mt-md"
              @click.stop="addToCart(product)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-pagination
      v-if="products.length > itemsPerPage"
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      class="q-my-md text-center justify-center"
      :color="$q.dark.isActive ? 'white' : 'dark'"
      :text-color="$q.dark.isActive ? 'white' : 'dark'"
      :active-color="$q.dark.isActive ? 'white' : 'dark'"
      :active-text-color="$q.dark.isActive ? 'dark' : 'white'"
      @update:model-value="scrollToTop"
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
import CartPreview from '@/components/CartPreview.vue';

const { getVerticalScrollPosition } = scroll;
const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_URL || '';

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

const scrollToTop = () => {
  const target = document.querySelector('body') as HTMLElement;
  if (target) {
    target.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    console.warn('Element body not found');
  }
};

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
  $q.notify({
    color: 'positive',
    message: 'Product added to cart!',
    icon: 'check_circle',
  });
  scrollToTop();
};

const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

const viewProduct = (product: Product) => {
  router.push(`/products/${product.id}`);
};

const fetchProducts = async () => {
  $q.loading.show();
  try {
    const response = await fetch(apiUrl);
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
