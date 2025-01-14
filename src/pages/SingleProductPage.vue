<template>
  <q-page padding>
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

    <!-- Image Overlay -->
    <q-dialog v-model="showImageOverlay" maximized>
      <q-card class="q-pa-md overlay" style="width: 100vw; height: 100vh; overflow: hidden">
        <div class="row justify-between items-center q-mb-md">
          <div class="text-caption tw-font-black">{{ product.name }}</div>
          <q-btn flat dense round icon="close" @click="showImageOverlay = false" />
        </div>
        <q-img
          :src="imageLocalUrl(product.image)"
          :alt="imageUrl"
          class="zoomable-image tw-cursor-pointer"
          :class="{ 'zoom-in': isZoomed, 'zoom-out': !isZoomed }"
          style="max-width: 100%; max-height: 100%"
          :style="imageStyle"
          fit="contain"
          @click="toggleZoom"
          @mouseenter="startHoverPanning"
          @mousemove="panImage"
          @mouseleave="stopPanning"
          @touchstart="startTouchPanning"
          @touchmove="panTouchImage"
          @touchend="stopTouchPanning"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { scroll } from 'quasar';
import { useI18n } from 'vue-i18n';
import { Product } from '@/types';
import { formatPrice } from '@/utils';
import { useProductStore } from '@/stores/products';

const { getVerticalScrollPosition } = scroll;

const apiUrl = import.meta.env.VITE_API_URL || '';

const route = useRoute();
const router = useRouter();
const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const { t } = useI18n();
const productCache = useProductStore();

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

const isCollapsed = ref(false);
const showImageOverlay = ref(false);
const imageUrl = ref('');
const isZoomed = ref(false);
const isPanning = ref(false);
const startX = ref(0);
const startY = ref(0);
const translateX = ref(0);
const translateY = ref(0);

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const imageLocalUrl = (imagePath: string) => {
  return process.env.NODE_ENV === 'development' ? `${apiUrl}${imagePath}` : imagePath;
};

const imageStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${isZoomed.value ? 2 : 1})`,
}));

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
    position: 'top',
    message: t('singleProduct.itemAdded'),
    icon: 'check_circle',
  });
};

const openImageOverlay = (image: string) => {
  imageUrl.value = image;
  showImageOverlay.value = true;
  isZoomed.value = false;
};

const toggleZoom = () => {
  if (isZoomed.value) {
    resetZoom();
  } else {
    isZoomed.value = true;
  }
};

const resetZoom = () => {
  isZoomed.value = false;
  translateX.value = 0;
  translateY.value = 0;
};

const startHoverPanning = (event: MouseEvent) => {
  if (!isZoomed.value) {
    toggleZoom();
    return;
  }
  isPanning.value = true;
  startX.value = event.clientX - translateX.value;
  startY.value = event.clientY - translateY.value;
};

const startTouchPanning = (event: TouchEvent) => {
  isPanning.value = true;
  const touch = event.touches[0];
  if (touch) {
    startX.value = touch.clientX - translateX.value;
    startY.value = touch.clientY - translateY.value;
    document.addEventListener('touchmove', panTouchImage);
    document.addEventListener('touchend', stopTouchPanning);
  }
};

const panTouchImage = (event: TouchEvent) => {
  if (!isZoomed.value || !isPanning.value) return;
  const touch = event.touches[0];
  if (touch) {
    translateX.value = (touch.clientX - startX.value) * -1;
    translateY.value = (touch.clientY - startY.value) * -1;
  }
};

const panImage = (event: MouseEvent) => {
  if (!isZoomed.value || !isPanning.value) return;
  translateX.value = (event.clientX - startX.value) * -1;
  translateY.value = (event.clientY - startY.value) * -1;
};

const stopPanning = () => {
  if (!isZoomed.value) return;
  isPanning.value = false;
};

const stopTouchPanning = () => {
  if (!isZoomed.value) {
    isZoomed.value = true;
    return;
  }
  isPanning.value = false;
  document.removeEventListener('touchmove', panTouchImage);
  document.removeEventListener('touchend', stopTouchPanning);
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

    const response = await fetch(`${apiUrl}/products/${slug}`);

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

<style lang="scss">
.zoomable-image {
  transition: transform 0.3s ease;
  &.zoom-in {
    cursor: grab;
    transform: scale(2) translate(var(--translate-x, 0), var(--translate-y, 0));
    transition: transform 0.3s ease;
    will-change: transform;
  }
  &.zoom-out {
    cursor: pointer;
    transform: scale(1);
    transition: transform 0.3s ease;
  }
}
</style>
