<template>
  <q-page class="tw-p-4">
    <div class="text-h6 q-mb-md">{{ $t('orderOverview.title') }}</div>

    <q-separator class="q-my-md" />

    <q-list bordered>
      <q-item v-for="item in cartItems" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption>{{ formatPrice(item.price) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ item.quantity }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator class="q-my-md" />

    <!-- Total Price -->
    <div class="q-gutter-md">
      <div class="text-subtitle1 text-weight-bold">{{ $t('orderOverview.total') }}</div>
      <div class="text-subtitle1 text-weight-bold">{{ formatPrice(totalPrice) }}</div>
    </div>

    <q-separator class="q-my-md" />

    <!-- Payment Processing -->
    <q-item class="!tw-p-0">
      <q-item-section class="tw-text-sm">
        <q-radio v-model="selectedPaymentMethod" val="card" :label="$t('checkout.cardPayment')" />
        <q-radio v-model="selectedPaymentMethod" val="ips" :disable="!isIpsEnabled">
          <template #default>
            <span>
              {{ $t('checkout.ipsScanQrCode') }}
              <span v-if="!isIpsEnabled" class="text-positive text-xs">
                - {{ $t('checkout.ipsInfo') }}</span
              >
            </span>
          </template>
        </q-radio>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" />

    <div class="tw-flex tw-flex-col tw-gap-4">
      <q-btn
        :color="color"
        :text-color="text"
        :label="$t('orderOverview.confirmOrder')"
        class="full-width !tw-py-4"
        @click="confirmOrder"
      />
      <q-btn
        :color="text"
        :text-color="color"
        :label="$t('orderOverview.payNow')"
        class="full-width !tw-py-4"
        @click="goBackToCheckout"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useCartStore } from 'src/stores/cart';
import { formatPrice } from 'src/utils/currency';
import { CHECKOUT_PATH, THANK_YOU_PATH } from '@/constants/routes';

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const cartStore = useCartStore();

const cartItems = ref(cartStore.items);
const totalPrice = ref(cartStore.totalPrice);
// const shippingDetails = ref(cartStore.orderDetails);
const selectedPaymentMethod = ref('card');
const isIpsEnabled = ref(false);

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const goBackToCheckout = () => {
  router.push(CHECKOUT_PATH);
};

const confirmOrder = () => {
  $q.notify({
    type: 'positive',
    position: 'top',
    message: t('orderOverview.orderConfirmed'),
    timeout: 1000,
  });
  cartStore.clearCart();
  router.push(THANK_YOU_PATH);
};
</script>
