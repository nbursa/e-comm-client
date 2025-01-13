<template>
  <q-page padding class="tw-relative">
    <h5 class="q-my-md tw-font-serif">{{ $t('products.title') }}</h5>
    <q-tabs
      v-model="selectedCategory"
      class="q-mb-md gt-sm"
      :active-color="text"
      :active-bg-color="color"
      :text-color="color"
      :inactive-color="color"
      align="justify"
    >
      <q-tab name="all" :label="$t('products.categories.allProducts')" />
      <q-tab
        v-for="category in categories"
        :key="category"
        :name="category"
        :label="formatCategoryLabel(category)"
      />
    </q-tabs>

    <CategorySelect
      v-model:selected-category="selectedCategory"
      :categories="categories"
      :color="color"
      :text="text"
      class="q-my-md lt-md"
    />

    <q-separator class="q-my-md" />

    <div class="tw-container tw-mx-auto tw-mb-8 grid justify-center">
      <div
        class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-4"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          :color="color"
          :text="text"
          @add-to-cart="addToCart"
          @view-product="viewProduct"
        />
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

    <q-btn
      v-if="isScrolledBtn"
      class="!tw-fixed !tw-bottom-12 !tw-right-4 !tw-p-3 tw-z-40"
      round
      color="white"
      text-color="primary"
      icon="arrow_upward"
      @click="scrollToTop"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, PropType } from 'vue';
import { useCartStore } from '../stores/cart';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useProductCacheStore } from '@/stores/products';
import { useI18n } from 'vue-i18n';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard.vue';
import CategorySelect from '@/components/CategorySelect.vue';

const props = defineProps({
  scrollOffset: {
    type: Number as PropType<number>,
    required: true,
  },
});

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const productCache = useProductCacheStore();
const { t } = useI18n();

const apiUrl = import.meta.env.VITE_API_URL || '';

const products = ref<Product[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
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
const isScrolledBtn = computed(() => props.scrollOffset > 300);

const formatCategoryLabel = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const scrollToTop = () => {
  const target = document.querySelector('.q-scrollarea__container') as HTMLElement;
  console.log('target', target);
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
    message: t('products.itemAdded'),
    icon: 'check_circle',
  });
};

const viewProduct = (product: Product) => {
  router.push(`/products/${product.id}`);
};

watch(selectedCategory, async (newCategory) => {
  currentPage.value = 1;
  await fetchProducts(newCategory);
});

const fetchCategories = async () => {
  try {
    isLoadingCategories.value = true;

    if (productCache.isCategoryCacheValid()) {
      const cached = productCache.getCategoryCache();
      if (cached) {
        categories.value = cached.categories;
        return;
      }
    }

    const response = await fetch(`${apiUrl}/products/categories`);
    const data = await response.json();
    categories.value = data;
    productCache.setCategoryCache(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    categories.value = [];
  } finally {
    isLoadingCategories.value = false;
  }
};

const fetchProducts = async (category?: string) => {
  $q.loading.show();
  try {
    const cacheCategory = category || 'all';

    if (productCache.isCacheValid(cacheCategory)) {
      const cached = productCache.getCache(cacheCategory);
      if (cached) {
        products.value = cached.products;
        $q.loading.hide();
        return;
      }
    }

    const url =
      category && category !== 'all'
        ? `${apiUrl}/products/category/${category}`
        : `${apiUrl}/products`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    products.value = data;
    productCache.setCache(data, cacheCategory);
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
});
</script>
