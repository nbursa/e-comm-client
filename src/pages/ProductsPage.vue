<template>
  <q-page padding class="tw-relative">
    <h5 class="q-my-md tw-font-serif">{{ $t('products.title') }}</h5>
    <q-tabs
      v-model="selectedCategory"
      indicator-color="transparent"
      class="q-mb-md gt-sm"
      :active-color="theme.textColor"
      :active-bg-color="theme.backgroundColor"
      :text-color="theme.backgroundColor"
      :inactive-color="theme.textColor"
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
      :color="theme.backgroundColor"
      :text="theme.textColor"
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
      class="!tw-fixed !tw-bottom-12 !tw-right-4 !tw-p-3 tw-z-40"
      round
      :color="theme.buttonBackgroundColor"
      :text-color="theme.buttonTextColor"
      icon="arrow_upward"
      @click="scrollToTop"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
// import { useUserStore } from '@/stores/user';
import { useProductCacheStore } from '@/stores/products';
import { useI18n } from 'vue-i18n';
import ProductCard from '@/components/ProductCard.vue';
import CategorySelect from '@/components/CategorySelect.vue';
import { useCartStore } from '@/stores/cart';
import { Product } from '@/types';
import { QVueGlobals } from 'quasar/dist/types/globals';

const cartStore = useCartStore();
// const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const productCache = useProductCacheStore();
const { t } = useI18n();

const apiUrl = import.meta.env.VITE_API_URL || '';

const products = ref<Product[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedCategory = ref('all');
const categories = ref<string[]>([]);
const isLoadingCategories = ref(true);

const theme = computed(() => ({
  backgroundColor: $q.dark.isActive ? 'white' : 'dark',
  textColor: $q.dark.isActive ? 'black' : 'white',
  buttonBackgroundColor: $q.dark.isActive ? 'dark' : 'light',
  buttonTextColor: $q.dark.isActive ? 'black' : 'white',
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
const isScrolledBtn = computed(() => window.scrollY > 300);

const formatCategoryLabel = (category: string) => {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (productCache.isCacheValid(category)) {
      const cached = productCache.getCache(category);
      if (cached) {
        products.value = cached.products;
        return;
      }
    }

    const response = await fetch(
      `${apiUrl}/products${category !== 'all' ? `/category/${category}` : ''}`,
    );
    products.value = await response.json();
    productCache.setCache(products.value, category);
  } catch (error) {
    console.error('Error fetching products:', error);
    products.value = [];
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>
