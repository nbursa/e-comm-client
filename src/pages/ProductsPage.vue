<template>
  <q-page padding class="tw-relative">
    <h5 class="q-my-md tw-font-serif">{{ $t('products.title') }}</h5>
    <ProductTabs
      :selected-category="selectedCategory"
      :categories="categories"
      :scroll-offset="scrollOffset"
      @update:selected-category="onCategoryChange"
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
          :color="theme.backgroundColor"
          :text="theme.textColor"
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
      class="tw-py-8 tw-flex tw-justify-center tw-items-center !tw-gap-8"
      :color="theme.paginationColor"
      :text-color="theme.paginationTextColor"
      :active-color="theme.paginationActiveColor"
      :active-text-color="theme.paginationActiveTextColor"
      @update:model-value="scrollToTop"
    />

    <q-btn
      v-if="isScrolledBtn"
      class="!tw-fixed !tw-bottom-12 !tw-right-4 !tw-p-2 tw-z-40"
      round
      color="white"
      text-color="black"
      icon="arrow_upward"
      @click="scrollToTop"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useI18n } from 'vue-i18n';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { Product } from '@/types';
import { QVueGlobals } from 'quasar/dist/types/globals';
import ProductTabs from '@/components/ProductTabs.vue';

const props = defineProps({
  scrollOffset: {
    type: Number,
    required: true,
  },
});

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const productCache = useProductStore();
const { t } = useI18n();

const apiUrl = import.meta.env.VITE_API_URL || '';

const products = ref<Product[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedCategory = ref('all');
const categories = ref<string[]>([]);
const isLoadingCategories = ref(true);

const theme = computed(() => ({
  activeTextColor: $q.dark.isActive ? 'dark' : 'black',
  backgroundColor: $q.dark.isActive ? 'white' : 'black',
  textColor: $q.dark.isActive ? 'black' : 'white',
  paginationColor: $q.dark.isActive ? 'light' : 'dark',
  paginationTextColor: $q.dark.isActive ? 'white' : 'black',
  paginationActiveColor: $q.dark.isActive ? 'white' : 'dark',
  paginationActiveTextColor: $q.dark.isActive ? 'black' : 'white',
}));

const filteredProducts = computed(() => {
  if (!products.value.length) return [];
  if (selectedCategory.value === 'all') return products.value;
  return products.value.filter((product) => product.category === selectedCategory.value);
});

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage,
  );
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const isScrolledBtn = computed(() => props.scrollOffset > 300);

const scrollToTop = () => {
  const scrollArea = document.querySelector('.q-page-container') as HTMLElement;
  if (scrollArea) {
    scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
  $q.notify({
    color: 'positive',
    position: 'top',
    timeout: 1000,
    message: t('products.itemAdded'),
    icon: 'check_circle',
  });
};

const viewProduct = (product: Product) => {
  router.push(`/products/${product.id}`);
};

const onCategoryChange = async (newCategory: string) => {
  selectedCategory.value = newCategory;
  currentPage.value = 1;
  await fetchProducts(newCategory);
};

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

    if (!response.ok) {
      console.warn(`API returned ${response.status} for categories`);
      if (categories.value.length) {
        return;
      }
      categories.value = ['all'];
      return;
    }

    categories.value = await response.json();
    productCache.setCategoryCache(categories.value);
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const fetchProducts = async (category = 'all') => {
  $q.loading.show();
  try {
    const cacheKey = category !== 'all' ? `product_${category}` : category;

    if (productCache.isCacheValid(cacheKey)) {
      const cached = productCache.getCache(cacheKey);
      if (cached) {
        products.value = cached.products;
        return;
      }
    }

    const response = await fetch(
      `${apiUrl}/products${category !== 'all' ? `/category/${category}` : ''}`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    products.value = data;
    productCache.setCache(data, cacheKey);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>
