<template>
  <q-page padding>
    <CartPreview
      v-if="false"
      :total-items="totalItems"
      :total-price="totalPrice"
      :is-collapsed="isCollapsed"
      class="q-ml-auto q-mb-md"
    />

    <h5 class="q-my-md">Products</h5>

    <q-tabs
      v-model="selectedCategory"
      class="q-mb-md gt-sm"
      :active-color="text"
      :active-bg-color="color"
      :text-color="color"
      :inactive-color="color"
      align="justify"
    >
      <q-tab name="all" label="All Products" />
      <q-tab
        v-for="category in categories"
        :key="category"
        :name="category"
        :label="formatCategoryLabel(category)"
      />
    </q-tabs>

    <q-select
      v-model="selectedCategory"
      :options="['all', ...categories]"
      class="q-my-md lt-md"
      :color="color"
      :text-color="text"
      label="Select Category"
      outlined
      :option-label="(opt) => (opt === 'all' ? 'All Products' : formatCategoryLabel(opt))"
    />

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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
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
const products = ref<Product[]>([]);
const currentPage = ref(1);
const itemsPerPage = 5;
const isCollapsed = ref(false);
const selectedCategory = ref('all');
const isLoadingCategories = ref(true);
const categories = ref<string[]>([]);

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (selectedCategory.value === 'all') {
    return products.value;
  }
  return products.value.filter((p) => p.category === selectedCategory.value);
});
const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage,
  );
});
const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

const fetchCategories = async () => {
  try {
    isLoadingCategories.value = true;
    const response = await fetch(`${apiUrl}/products/categories`);
    categories.value = await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    categories.value = [];
  } finally {
    isLoadingCategories.value = false;
  }
};

const formatCategoryLabel = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getFirstSentence = (text: string): string => {
  const match = text.match(/[^.!?]*[.!?]/);
  return match ? match[0] : text;
};

const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

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

const viewProduct = (product: Product) => {
  router.push(`/products/${product.id}`);
};

const handleScroll = () => {
  const scrollTop = getVerticalScrollPosition(window);
  isCollapsed.value = scrollTop > 0;
};

watch(selectedCategory, async (newCategory) => {
  currentPage.value = 1;
  await fetchProducts(newCategory);
});

const fetchProducts = async (category?: string) => {
  $q.loading.show();
  try {
    const url =
      category && category !== 'all'
        ? `${apiUrl}/products/category/${category}`
        : `${apiUrl}/products`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    products.value = await response.json();
  } catch {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Failed to fetch products. Please try again later.',
      icon: 'error',
    });
    products.value = [];
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()]);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
