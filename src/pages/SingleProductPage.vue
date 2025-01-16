<template>
  <q-page padding class="!tw-pb-16 md:tw-pb-24 !tw-pt-4">
    <div class="q-mb-md q-mx-auto overflow-hidden" style="max-width: 1200px">
      <div class="row items-stretch full-height" :class="{ 'col-reverse-md': $q.screen.md }">
        <div
          class="col-12 col-md-4 q-py-lg tw-transition tw-duration-200 tw-ease-in-out hover:tw-scale-105"
        >
          <q-img
            :src="imageLocalUrl(product.image)"
            :alt="product.name"
            fit="contain"
            class="cursor-pointer full-width full-height"
            @click="openImageOverlay(product.image)"
          />
        </div>

        <div
          class="col-12 col-md-8 sm:tw-p-3 !tw-align-top"
          style="
            display: flex;
            flex-direction: column;
            flex-grow: 0;
            height: auto;
            min-height: 100%;
          "
        >
          <q-card-section
            class="q-pa-sm !tw-pb-0"
            style="flex: 1; display: flex; flex-direction: column; height: 100%"
          >
            <h5 class="tw-flex tw-justify-start tw-gap-2">
              <span>{{ product.name || product.title }}</span>
              <span class="tw-text-sm tw-mb-2"
                >({{ product.quantity }}
                <span class="tw-text-xs">{{ $t('singleProduct.quantity') }}</span
                >)</span
              >
            </h5>
            <div class="text-caption q-mt-sm">{{ product.description }}</div>
          </q-card-section>

          <q-card-actions align="right" class="row justify-between items-end !tw-pt-0">
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
              :label="$t('singleProduct.addToCart')"
              class="!tw-p-4 full-width"
              @click.stop="addToCart(product)"
            />
          </q-card-actions>
        </div>
      </div>
    </div>

    <div class="row justify-center q-mt-xl">
      <q-btn
        :color="color"
        :text-color="text"
        :label="$t('singleProduct.backToProducts')"
        @click="goBack"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useI18n } from 'vue-i18n';
import { PreviewImage, Product } from '@/types';
import { formatPrice } from '@/utils';
import { useProductStore } from '@/stores/products';
import { useImageStore } from '@/stores/images';

const scrollToTop = inject('scrollToTop') as () => void;

const route = useRoute();
const router = useRouter();
const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const { t } = useI18n();
const productCache = useProductStore();
const imageStore = useImageStore();

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

const imageLocalUrl = (imagePath: string) => {
  return process.env.NODE_ENV === 'development'
    ? `${import.meta.env.VITE_API_URL}${imagePath}`
    : imagePath;
};

const openImageOverlay = (mainImage: string) => {
  const previewImages: PreviewImage[] = [
    {
      src: imageLocalUrl(mainImage),
      name: product.value.name || product.value.title || '',
    },
  ];

  if (product.value.additionalImages?.length) {
    const additionalPreviewImages = product.value.additionalImages.map((image) => ({
      src: imageLocalUrl(image),
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
  router.push('/products');
};

const fetchProductDetails = async () => {
  const { slug } = route.params;
  $q.loading.show();

  try {
    const viewedCache = productCache.getCache('viewed');
    if (viewedCache) {
      const found = viewedCache.products.find((p) => p.id === Number(slug));
      if (found) {
        product.value = found;
        return;
      }
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${slug}`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    product.value = {
      id: data.id,
      name: data.name,
      title: data.title,
      price: data.price,
      description: data.description,
      image: data.image,
      additionalImages: data.additionalImages,
      category: data.category,
      discount: data.discount || 0,
      discountedPrice: data.price - (data.price * (data.discount || 10)) / 100,
      quantity: data.quantity,
      rating: data.rating,
    };

    productCache.setCache([product.value], 'viewed');
  } catch (error) {
    console.warn('Error fetching product:', error);
    $q.notify({
      color: 'negative',
      position: 'top',
      timeout: 1000,
      message: 'Failed to fetch product details.',
      icon: 'error',
    });
    if (!product.value.id) {
      router.push('/products');
    }
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchProductDetails();
});
</script>
