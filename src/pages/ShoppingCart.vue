<template>
  <q-page padding>
    <div v-if="cartStore.items.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="100px" color="grey-4" />
      <h5 class="text-grey-6 q-mb-md">{{ $t('cart.emptyCart') }}</h5>
      <q-btn to="/products" color="white" text-color="black" :label="$t('cart.continue')" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-item v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <q-item-section thumbnail class="q-pr-md product-image-container">
            <q-img :src="item.image" :ratio="1" class="product-image" fit="contain" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-medium">
              {{ item.name }}
            </q-item-label>
            <q-item-label caption>
              {{ formatPrice(item.price) }} {{ $t('cart.each') }}
            </q-item-label>

            <div class="mobile-controls q-mt-sm">
              <q-btn-group flat>
                <q-btn
                  flat
                  dense
                  icon="remove"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                />
                <q-btn flat dense class="text-weight-bold">{{ item.quantity }}</q-btn>
                <q-btn flat dense icon="add" @click="updateQuantity(item.id, item.quantity + 1)" />
              </q-btn-group>
              <div class="text-subtitle1 text-weight-bold mobile-price">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn flat round color="negative" icon="delete" @click="removeItem(item.id)" />
          </q-item-section>
        </q-item>
      </div>

      <!-- Order Summary -->
      <div class="col-12 col-md-4">
        <q-card class="order-summary">
          <q-card-section>
            <div class="text-h6">{{ $t('cart.orderSummary') }}</div>
            <q-list dense>
              <q-item>
                <q-item-section>{{ $t('cart.items') }} ({{ cartStore.totalItems }})</q-item-section>
                <q-item-section side>
                  {{ formatPrice(cartStore.totalPrice) }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ $t('cart.shipping') }}</q-item-section>
                <q-item-section side>{{ $t('cart.free') }}</q-item-section>
              </q-item>
              <q-separator class="q-my-md" />
              <q-item>
                <q-item-section>
                  <span class="text-subtitle1 text-weight-bold">{{ $t('cart.total') }}</span>
                </q-item-section>
                <q-item-section side>
                  <span class="text-subtitle1 text-weight-bold">
                    {{ formatPrice(cartStore.totalPrice) }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              :color="color"
              :text-color="text"
              :label="$t('cart.checkout')"
              class="full-width"
              @click="checkout"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useCartStore } from 'src/stores/cart';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();
const { t } = useI18n();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

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
    title: t('cart.confirmDelete'),
    message: t('cart.deleteMessage'),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    cartStore.removeItem(id);
    $q.notify({
      color: 'positive',
      message: t('cart.itemRemoved'),
      icon: 'delete',
    });
  });
};
</script>

<style lang="scss" scoped>
:deep(.q-slide-item) {
  .q-slide-item__left {
    background: var(--q-negative);
    color: white;
    padding: 0 16px;
    display: flex;
    align-items: center;
  }
}

:deep(.q-slide-item__content) {
  @media (max-width: 599px) {
    flex-direction: column;

    .q-item {
      flex-direction: column;
      align-items: center;
      padding: 16px;

      .product-image-container {
        width: 100%;
        max-width: 200px;
        margin-bottom: 16px;
      }

      .q-item__section--main {
        text-align: center;
      }

      .q-item__section--side {
        padding-left: 0;
        margin-top: 16px;
        width: 100%;
        text-align: center;
      }

      .product-price {
        width: 100%;
        font-size: 1.25rem;
        margin: 0;
        margin-top: 16px;
        text-align: center;
      }
    }
  }
}

.product-image-container {
  width: 100px;
  height: 100px;

  .product-image {
    width: 100%;
    height: 100%;
  }
}

.product-image {
  width: 100%;
  max-height: 150px;

  :deep(.q-img__content) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.q-img__image) {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
}

.order-summary {
  width: 100%;

  :deep(.q-card__section) {
    padding: 20px;

    .q-list {
      width: 100%;

      .q-item {
        padding: 12px 0;
        width: 100%;
      }
    }
  }
}
.cart-item {
  @media (max-width: 599px) {
    flex-direction: column;
    align-items: center;
    padding: 16px;

    .product-image-container {
      width: 200px;
      height: 200px;
      margin-bottom: 16px;
    }

    .q-item__section--main {
      width: 100%;
      text-align: center;
    }

    .mobile-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;

      .q-btn-group {
        width: 100%;
        justify-content: center;
      }

      .mobile-price {
        margin-top: 8px;
      }
    }
  }
}
</style>
