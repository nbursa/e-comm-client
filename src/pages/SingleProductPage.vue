<template>
  <q-page padding class="!tw-pb-16 md:!tw-pb-24 !tw-pt-4">
    <div v-if="loading" class="q-pa-md">
      <q-spinner color="primary" size="50px" />
    </div>
    <div v-else-if="error" class="q-pa-md">
      <q-banner type="negative" class="q-mb-md">
        <div>{{ error }}</div>
      </q-banner>
    </div>
    <div
      v-else
      class="q-mb-md q-mx-auto !tw-w-full row items-stretch justify-center"
      style="max-width: 1200px"
    >
      <div
        class="row items-stretch full-height !tw-w-full justify-center"
        :class="{ 'col-reverse-md': $q.screen.sm }"
      >
        <div
          class="col-12 col-sm-6 col-md-4 tw-px-2 sm:tw-px-0 tw-transition tw-duration-500 tw-ease-in-out hover:tw-scale-105"
        >
          <div
            v-if="!product.image"
            class="tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-rounded 0 tw-border tw-border-gray-400 tw-pb-2"
            :class="
              isDark ? 'tw-text-gray-200  !tw-bg-gray-700' : 'tw-text-gray-70 !tw-bg-gray-200'
            "
          >
            {{ t('errors.noImage') }}
          </div>
          <div v-else class="tw-h-full tw-w-full">
            <q-img
              :src="imageLocalUrl"
              :alt="product.name"
              fit="contain"
              class="cursor-pointer full-width full-height !tw-rounded-md"
              @click="openImageOverlay(product.image)"
            />
          </div>
        </div>

        <div
          class="col-12 col-sm-6 col-md-8 sm:tw-px-3 sm:!tw-py-0 !tw-align-top"
          style="
            display: flex;
            flex-direction: column;
            flex-grow: 0;
            height: auto;
            min-height: 100%;
          "
        >
          <q-card-section
            class="!tw-p-0 !tw-px-3"
            style="flex: 1; display: flex; flex-direction: column; height: 100%"
          >
            <h5 class="tw-flex tw-justify-between tw-gap-2">
              <span class="tw-text-base md:tw-text-xl">{{ product.name || product.title }}</span>
              <span class="tw-text-sm tw-mb-2"
                >({{ product.quantity }}
                <span class="tw-text-xs">{{ $t('singleProduct.quantity') }}</span
                >)</span
              >
            </h5>
            <div class="text-caption q-mt-sm">{{ product.description }}</div>
          </q-card-section>

          <q-card-actions align="right" class="row justify-between items-end !tw-px-3">
            <div class="text-bold price-text tw-pb-3">
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
            <div class="tw-w-full tw-flex tw-justify-between tw-gap-4">
              <q-btn
                :color="text"
                :text-color="color"
                :outline="isDark"
                :label="$t('singleProduct.goBack')"
                class="!tw-p-4 tw-flex-1 tw-basis-1/3"
                @click.stop="goBack()"
              />
              <q-btn
                :color="color"
                :text-color="text"
                :label="$t('singleProduct.addToCart')"
                class="!tw-p-4 tw-flex-1 tw-basis-2/3"
                @click.stop="addToCart(product)"
              />
            </div>
          </q-card-actions>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useQuasar, useMeta } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { useI18n } from 'vue-i18n';
import { PreviewImage, Product } from '@/types';
import { formatPrice } from '@/utils/currency';
import { useProductStore } from '@/stores/products';
import { useImageStore } from '@/stores/images';
import { PAGE_TITLE, PRODUCTS_PATH } from '@/router';
import { api } from '@/boot/axios';

const scrollToTop = inject('scrollToTop') as () => void;

const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const route = useRoute();
const router = useRouter();
const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const { t } = useI18n();
const productCache = useProductStore();
const imageStore = useImageStore();

const { slug } = route.params as { slug: string };

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

const loading = ref(true);
const error = ref<string | null>(null);
const imageUrlCache = ref(new Map<string, HTMLImageElement>());

const isDark = computed(() => $q.dark.isActive);
const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
const metaTitle = computed(() => `${product.value.name || product.value.title} - ${PAGE_TITLE}`);

const cacheImageUrl = (url: string) => {
  if (!imageUrlCache.value.has(url)) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageUrlCache.value.set(url, img);
    };
  }
};

const getCachedImageUrl = (url: string) => {
  const cachedImage = imageUrlCache.value.get(url);
  return cachedImage ? cachedImage.src : url;
};

const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';

  const fullUrl = `${baseUrl}${imagePath}`;

  const cached = getCachedImageUrl(fullUrl);
  if (cached) return cached;

  cacheImageUrl(fullUrl);
  return fullUrl;
};

const imageLocalUrl = computed(() => {
  if (product.value?.image) {
    return getImageUrl(product.value.image);
  }
  return '';
});

const openImageOverlay = (mainImage: string) => {
  const previewImages: PreviewImage[] = [
    {
      src: getImageUrl(mainImage),
      name: product.value.name || product.value.title || '',
    },
  ];

  if (product.value.additionalImages?.length) {
    const additionalPreviewImages = product.value.additionalImages.map((image) => ({
      src: getImageUrl(image),
      name: product.value.name || product.value.title || '',
    }));
    previewImages.push(...additionalPreviewImages);
  }

  imageStore.openPreview(previewImages);
};

const addToCart = (product: Product) => {
  cartStore.addItem({ ...product, quantity: 1 });
  scrollToTop();
  $q.notify({
    color: 'positive',
    position: 'top',
    timeout: 1000,
    message: t('singleProduct.itemAdded'),
    icon: 'check_circle',
  });
};

const goBack = () => {
  router.back();
};

const fetchProduct = async () => {
  loading.value = true;
  $q.loading.show();

  try {
    productCache.initViewedCache();
    const viewedCache = productCache.getViewedCache();

    if (viewedCache) {
      const found = viewedCache.products.find((p: { id: number }) => p.id === Number(slug));
      if (found) {
        product.value = found;
        loading.value = false;
        return;
      }
    }

    const response = await api.get(`${baseUrl}${PRODUCTS_PATH}/${slug}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch product');
    }

    const { data } = response.data;

    product.value = {
      id: data.id,
      name: data.name,
      title: data.title || data.name,
      price: Number(data.price),
      description: data.description,
      image: data.image,
      additionalImages: data.additionalImages || [],
      category: data.category,
      discount: data.discount || 0,
      discountedPrice: data.price - (data.price * (data.discount || 10)) / 100,
      quantity: data.quantity || 0,
      rating: data.rating || { rate: 0, count: 0 },
    };

    productCache.setViewedCache(product.value);
  } catch (err) {
    console.warn('Error fetching product:', err);
    error.value = t('errors.fetchProduct');
    $q.notify({
      color: 'negative',
      position: 'top',
      timeout: 1000,
      message: t('errors.fetchProduct'),
      icon: 'error',
    });
    if (!product.value.id) {
      router.push(PRODUCTS_PATH);
    }
  } finally {
    $q.loading.hide();
    loading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
  useMeta({ title: metaTitle.value });
});
</script>
