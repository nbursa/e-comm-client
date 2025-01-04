<template>
  <q-page padding>
    <div v-if="cartStore.items.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="100px" color="grey-4" />
      <h5 class="text-grey-6 q-mb-md">{{ $t('cart.emptyCart') }}</h5>
      <q-btn to="/products" color="white" text-color="black" :label="$t('cart.continue')" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-list separator>
          <q-slide-item
            v-for="item in cartStore.items"
            :key="item.id"
            left-color="negative"
            @left="() => removeItem(item.id)"
          >
            <template #left>
              <q-icon name="delete" />
            </template>

            <q-item>
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

                <div class="row items-center q-mt-sm">
                  <q-btn-group flat>
                    <q-btn
                      flat
                      dense
                      icon="remove"
                      :disable="item.quantity <= 1"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                    />
                    <q-btn flat dense class="text-weight-bold">
                      {{ item.quantity }}
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      icon="add"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                    />
                  </q-btn-group>
                  <div class="text-subtitle1 text-weight-bold q-ml-xl">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
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
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const $q = useQuasar() as QVueGlobals;
const router = useRouter();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const removeItem = (id: number) => {
  cartStore.removeItem(id);
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
</script>

<style lang="scss" scoped>
.product-image-container {
  min-width: 120px;
  max-width: 150px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
