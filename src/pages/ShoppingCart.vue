<template>
  <q-page padding class="!tw-pb-16 !tw-pt-4">
    <div
      v-if="cartStore.items.length === 0"
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen -tw-mt-32"
    >
      <q-icon name="shopping_cart" size="4rem" :color="color" />
      <h5 class="q-mb-md" :color="color">{{ $t('cart.emptyCart') }}</h5>
      <q-btn to="/products" :color="color" :text-color="text" :label="$t('cart.continue')" />
    </div>

    <div v-else class="tw-container tw-max-w-screen-xl tw-mx-auto">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8 tw-space-y-4">
          <q-card
            v-for="item in cartStore.items"
            :key="item.id"
            flat
            bordered
            class="tw-flex tw-flex-col md:tw-flex-row md:!tw-justify-between !tw-gap-3 tw-p-3 tw-rounded-md"
            :class="isDark ? 'tw-bg-transparent text-light' : 'bg-light text-dark'"
          >
            <!-- Image section -->
            <q-item-section class="tw-w-full md:!tw-max-w-44 !tw-flex-shrink-1 md:tw-min-w-[50px]">
              <q-img
                :src="`${imageUrl(item.image)}`"
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
                <div class="tw-flex tw-items-center tw-h-full">
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
        <div class="col-12 col-md-4">
          <q-item
            class="tw-flex tw-justify-between tw-flex-col tw-gap-4 !tw-pt-4 !tw-pb-3 tw-rounded-md"
            :class="isDark ? 'tw-bg-transparent text-light' : 'bg-light text-dark'"
          >
            <q-item-section class="tw-w-full">
              <div class="tw-text-xl tw-mb-4">{{ $t('cart.orderSummary') }}</div>
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
              <q-btn
                :label="$t('cart.checkout')"
                class="full-width !tw-p-4"
                :class="isDark ? 'bg-white text-dark' : 'bg-dark text-white'"
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
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useCartStore } from 'src/stores/cart';
import { computed, inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { formatPrice } from '@/utils/currency';

const scrollToTop = inject('scrollToTop') as () => void;

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const { t } = useI18n();

const isDark = computed(() => $q.dark.isActive);
const color = computed(() => (isDark.value ? 'white' : 'dark'));
const text = computed(() => (isDark.value ? 'dark' : 'white'));

const imageUrl = (imagePath: string) => {
  return process.env.NODE_ENV === 'development'
    ? `${import.meta.env.VITE_API_URL}${imagePath}`
    : imagePath;
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
