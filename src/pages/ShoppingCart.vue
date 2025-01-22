<template>
  <q-page padding class="!tw-pb-16 !tw-pt-4 !tw-px-4 tw-max-w-screen-xl tw-mx-auto">
    <h5
      class="tw-text-3xl tw-mt-4 tw-font-semibold tw-font-serif tw-my-4 tw-text-left md:tw-text-center tw-mb-8"
    >
      {{ $t('cart.shoppingCart') }}
    </h5>
    <div
      v-if="cartStore.items.length === 0"
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen -tw-mt-32"
    >
      <q-icon name="shopping_cart" size="4rem" :color="color" />
      <h5 class="q-mb-md" :color="color">{{ $t('cart.emptyCart') }}</h5>
      <q-btn to="/products" :color="color" :text-color="text" :label="$t('cart.continue')" />
    </div>

    <div v-else class="tw-max-w-screen-xl tw-mx-auto tw-flex tw-justify-between !tw-py-4">
      <div
        class="tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-center !tw-mx-auto sm:tw-flex-row sm:tw-gap-4"
      >
        <div
          class="tw-flex !tw-flex-col tw-w-full sm:tw-flex-row sm:tw-w-1/2 md:tw-w-2/3 tw-space-y-4 tw-mx-auto sm:tw-mx-0 sm:tw-max-w-md"
        >
          <q-card
            v-for="item in cartStore.items"
            :key="item.id"
            flat
            bordered
            class="tw-flex tw-flex-col md:tw-flex-row md:!tw-justify-between !tw-gap-3 tw-p-3 tw-rounded-md tw-cursor-pointer"
            :class="isDark ? 'tw-bg-transparent text-light' : 'bg-light text-dark'"
            @click="viewProduct(item.id)"
          >
            <!-- Image section -->
            <q-item-section class="tw-w-full md:!tw-max-w-44 !tw-flex-shrink-1 md:tw-min-w-[50px]">
              <div
                v-if="!item.image"
                class="tw-h-full tw-w-full tw-max-h-44 tw-flex tw-items-center tw-justify-center tw-rounded 0 tw-border tw-bg-transparent tw-border-gray-400"
                :class="isDark ? 'tw-text-gray-200' : '!tw-bg-gray-200'"
              >
                {{ t('errors.noImage') }}
              </div>
              <q-img
                :src="`${getImageUrl(item.image)}`"
                :ratio="1"
                class="tw-w-full sm:tw-h-44"
                fit="contain"
              />
            </q-item-section>

            <!-- Content section -->
            <q-item-section
              class="tw-flex-1 tw-min-w-0 md:tw-flex md:!tw-flex-col md:!tw-justify-between"
            >
              <q-item-label class="text-subtitle2 text-weight-medium tw-truncate">
                {{ item.name || item.title }}
              </q-item-label>
              <q-item-label caption class="!tw-text-xs" :class="isDark && '!tw-text-white'">
                {{ formatPrice(item.price) }} {{ $t('cart.each') }}
              </q-item-label>

              <div
                class="tw-flex tw-flex-col tw-flex-grow tw-items-center tw-gap-2 md:tw-text-left"
              >
                <div class="tw-flex tw-items-center tw-py-6 tw-h-full">
                  <q-btn-group flat class="">
                    <q-btn
                      flat
                      dense
                      icon="remove"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                    />
                    <q-btn flat dense class="text-weight-bold">{{ item.quantity }}</q-btn>
                    <q-btn
                      flat
                      dense
                      icon="add"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                    />
                  </q-btn-group>
                </div>
                <div class="text-subtitle1 text-weight-bold mobile-price">
                  {{ $t('cart.total') }}: {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </q-item-section>

            <!-- Delete button section -->
            <q-item-section
              class="!tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center md:!tw-max-w-[60px] md:tw-ml-4"
            >
              <q-btn
                flat
                round
                rectangle
                color="negative"
                icon="delete"
                @click="removeItem(item.id)"
              />
            </q-item-section>
          </q-card>
        </div>

        <!-- Order Summary -->
        <div
          class="tw-flex-col tw-w-full tw-mx-auto sm:tw-w-1/2 md:!tw-w-1/3 sm:tw-ml-4 sm:tw-mx-0 sm:tw-max-w-sm sm:tw-sticky sm:tw-top-8"
        >
          <q-item
            class="tw-flex tw-justify-between tw-flex-col tw-gap-4 !tw-pt-4 !tw-pb-3 !tw-px-0 tw-rounded-md sm:!tw-pt-0 tw-w-full"
            :class="isDark ? 'tw-bg-transparent text-light' : 'bg-light text-dark'"
          >
            <q-item-section class="tw-w-full">
              <div class="tw-text-xl tw-font-semibold tw-font-serif md:tw-text-2xl tw-mb-4">
                {{ $t('cart.orderSummary') }}
              </div>
              <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                <q-item class="tw-justify-between">
                  <q-item-section
                    >{{ $t('cart.items') }} ({{ cartStore.totalItems }})</q-item-section
                  >
                  <q-item-section side :class="isDark ? 'text-light' : 'text-dark'">
                    {{ formatPrice(cartStore.totalPrice) }}
                  </q-item-section>
                </q-item>
                <q-item class="tw-justify-between">
                  <q-item-section>{{ $t('cart.shipping') }}</q-item-section>
                  <q-item-section side :class="isDark ? 'text-light' : 'text-dark'">{{
                    $t('cart.free')
                  }}</q-item-section>
                </q-item>
                <q-separator class="q-my-md" />
                <q-item class="tw-justify-between">
                  <q-item-section>
                    <span class="text-subtitle1 text-weight-bold">{{ $t('cart.total') }}</span>
                  </q-item-section>
                  <q-item-section side :class="isDark ? 'text-light' : 'text-dark'">
                    <span class="text-subtitle1 text-weight-bold">
                      {{ formatPrice(cartStore.totalPrice) }}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
            <q-card-actions align="center">
              <QButton
                :color="color"
                :text-color="text"
                :label="$t('cart.checkout')"
                class-name="tw-flex-1 tw-basis-2/3 !tw-m-0"
                @click="checkout"
              />
            </q-card-actions>
          </q-item>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { useCartStore } from 'src/stores/cart';
import { computed, inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { formatPrice } from '@/utils/currency';
import QButton from '@/components/base/QButton.vue';
import { PRODUCTS_PATH } from '@/router';
import { useImageStore } from '@/stores/images';

const scrollToTop = inject('scrollToTop') as () => void;

const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const cartStore = useCartStore();
const imageStore = useImageStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const { t } = useI18n();

const isDark = computed(() => $q.dark.isActive);
const color = computed(() => (isDark.value ? 'white' : 'dark'));
const text = computed(() => (isDark.value ? 'dark' : 'white'));

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';

  const fullUrl = `${baseUrl}${imagePath}`;

  const cached = imageStore.getCachedImageUrl(fullUrl);
  if (cached) return cached;

  imageStore.cacheImageUrl(fullUrl);
  return fullUrl;
};

const updateQuantity = (id: number, quantity: number) => {
  if (quantity < 1) return;
  cartStore.updateQuantity(id, quantity);
};

const checkout = () => {
  if (cartStore.items.length) {
    router.push('/checkout');
  }
};

const viewProduct = (slug: number) => {
  router.push(`${PRODUCTS_PATH}/${slug}`);
};

const removeItem = (id: number) => {
  $q.dialog({
    class: 'custom-dialog',
    title: t('cart.confirmDelete'),
    message: t('cart.deleteMessage'),
    cancel: {
      color: 'grey',
      outline: true,
      label: t('cart.cancel'),
    },
    ok: {
      color: color.value,
      flat: true,
      label: t('cart.delete'),
    },
    persistent: true,
  }).onOk(() => {
    cartStore.removeItem(id);
    $q.notify({
      color: 'positive',
      timeout: 1000,
      message: t('cart.itemRemoved'),
      icon: 'delete',
      position: 'top',
    });
  });
};

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
.custom-dialog {
  border-radius: 8px;
  box-shadow: none !important;

  &.q-card,
  &.q-card--dark {
    box-shadow: none !important;
  }

  .q-dialog__title {
    font-size: 1rem;
    font-weight: 500;
    padding: 20px 20px 0;
    margin-bottom: 20px;
  }

  .q-dialog__message {
    padding: 20px;
    color: #666;
    font-size: 0.8rem;
  }

  .q-dialog__inner {
    min-width: 300px;
  }

  .q-card__actions {
    padding: 12px 20px;
    justify-content: space-between;
    gap: 8px;
  }

  .custom-dialog-btn {
    min-width: 85px;
    font-weight: 500;
  }
}
</style>
