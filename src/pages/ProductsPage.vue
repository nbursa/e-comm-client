<template>
  <q-page padding class="!tw-pb-16 !tw-pt-4 !tw-px-3">
    <h5 class="tw-font-serif tw-my-4">{{ $t('products.title') }}</h5>
    <ProductTabs
      :selected-category="selectedCategory"
      :categories="categories"
      :scroll-offset="scrollOffset"
      @update:selected-category="onCategoryChange"
    />

    <q-separator class="q-my-md" />

    <ProductFilters
      :initial-filters="filters"
      :sort-options="sortOptions"
      :sort-order-options="sortOrderOptions"
      @update:filters="updateFilters"
    />

    <div class="tw-container tw-mx-auto tw-mb-8 grid justify-center">
      <div
        class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-4"
      >
        <ProductCard
          v-for="product in displayedProducts"
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
      v-if="meta.total > 0"
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      class="tw-py-8 tw-flex tw-justify-center tw-items-center !tw-gap-8"
      :color="theme.paginationColor"
      :text-color="theme.paginationTextColor"
      :active-color="theme.paginationActiveColor"
      :active-text-color="theme.paginationActiveTextColor"
      @update:model-value="handlePageChange"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, inject, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useI18n } from 'vue-i18n';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { Product, ProductResponse } from '@/types';
import { QVueGlobals } from 'quasar';
import ProductTabs from '@/components/ProductTabs.vue';
import { CATEGORIES_PATH, CATEGORY_PATH, PRODUCTS_PATH } from '@/router';
import { api } from '@/boot/axios';
import { AxiosResponse } from 'axios';
import ProductFilters from '@/components/ProductFilters.vue';

const scrollToTop = inject('scrollToTop') as () => void;

const CATEGORY_CACHE_KEY = 'products_categories';

defineProps({
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

const products = ref<Product[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedCategory = ref('all');
const categories = ref<string[]>([]);
const isLoadingCategories = ref(true);
const filters = ref({
  search: '',
  minPrice: 0,
  maxPrice: 999999,
  sortBy: 'id',
  sortOrder: 'asc',
});
const meta = ref({
  total: 0,
  page: 1,
  limit: 10,
  lastPage: 1,
});

const sortOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'price' },
];

const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

const totalPages = computed(() => Math.ceil(meta.value.total / meta.value.limit));
const displayedProducts = computed(() => products.value);
const theme = computed(() => ({
  activeTextColor: $q.dark.isActive ? 'dark' : 'black',
  backgroundColor: $q.dark.isActive ? 'white' : 'black',
  textColor: $q.dark.isActive ? 'black' : 'white',
  paginationColor: $q.dark.isActive ? 'light' : 'dark',
  paginationTextColor: $q.dark.isActive ? 'white' : 'black',
  paginationActiveColor: $q.dark.isActive ? 'white' : 'dark',
  paginationActiveTextColor: $q.dark.isActive ? 'black' : 'white',
}));

watch(
  filters,
  () => {
    currentPage.value = 1;
    fetchProducts(selectedCategory.value);
  },
  { deep: true },
);

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
  router.push(`${PRODUCTS_PATH}/${product.id}`);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  scrollToTop();
  fetchProducts(selectedCategory.value);
};

const onCategoryChange = async (newCategory: string) => {
  selectedCategory.value = newCategory;
  currentPage.value = 1;
  await fetchProducts(newCategory);
};

const updateFilters = (newFilters: typeof filters.value) => {
  filters.value = newFilters;
};

const fetchCategories = async () => {
  try {
    isLoadingCategories.value = true;

    if (productCache.isCacheValid(CATEGORY_CACHE_KEY)) {
      const cached = productCache.getCategoryCache();
      if (cached) {
        categories.value = cached.categories;
        return;
      }
    }

    const response: AxiosResponse<string[]> = await api.get(
      `${import.meta.env.VITE_API_URL}${CATEGORIES_PATH}`,
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch categories');
    }

    categories.value = response.data;
    productCache.setCategoryCache(categories.value);
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const buildCacheKey = (params: {
  category: string;
  page: number;
  limit: number;
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  sortOrder: string;
}): string => {
  return `products_${params.category}_${params.page}_${params.limit}_${params.search}_${params.minPrice}_${params.maxPrice}_${params.sortBy}_${params.sortOrder}`;
};

const fetchProducts = async (category = 'all') => {
  $q.loading.show();
  try {
    const params = {
      category,
      page: currentPage.value,
      limit: itemsPerPage,
      search: filters.value.search,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder,
    };

    const cacheKey = buildCacheKey(params);

    const cached = productCache.getCache(cacheKey);

    if (cached?.meta && cached?.data) {
      products.value = cached.data;
      meta.value = cached.meta;
      $q.loading.hide();
      return;
    }

    const queryParams = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString(),
      search: filters.value.search,
      minPrice: filters.value.minPrice.toString(),
      maxPrice: filters.value.maxPrice.toString(),
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder,
    });

    const url = `${import.meta.env.VITE_API_URL}${PRODUCTS_PATH}${
      category !== 'all' ? `${CATEGORY_PATH}/${category}` : ''
    }?${queryParams}`;

    const response: AxiosResponse<ProductResponse> = await api.get(url, { params });

    if (response.status !== 200) {
      throw new Error('Failed to fetch products');
    }

    if (response && response.data) {
      const result = response.data as ProductResponse;
      products.value = result.data;
      meta.value = result.meta;

      productCache.setCache(result, cacheKey);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    $q.notify({
      color: 'negative',
      message: t('errors.fetchProducts'),
      timeout: 1000,
      icon: 'error',
      position: 'top',
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()]);
});
</script>
