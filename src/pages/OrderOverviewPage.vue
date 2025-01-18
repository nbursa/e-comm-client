<template>
  <q-page padding class="!tw-pb-16 !tw-p-4">
    <div class="tw-container tw-max-w-screen-xl tw-mx-auto">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-card flat bordered class="!tw-bg-transparent tw-max-w-screen-md tw-mx-auto">
            <q-card-section>
              <div class="tw-text-2xl tw-mb-4 tw-font-serif">
                {{ $t('checkout.orderOverview') }}
              </div>

              <q-separator class="q-my-md" />

              <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                <q-item v-for="item in cartStore.items" :key="item.id" class="tw-justify-between">
                  <q-item-section>
                    <q-item-label class="tw-font-semibold tw-text-base">{{
                      item.name || item.title
                    }}</q-item-label>
                    <q-item-label caption
                      >{{ $t('checkout.qty') }}: {{ item.quantity }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side :class="isDark ? 'text-white' : 'text-dark'">
                    {{ formatPrice(item.price * item.quantity) }}
                  </q-item-section>
                </q-item>

                <q-separator class="q-my-md" />

                <q-item>
                  <q-item-section class="text-subtitle1 text-weight-bold">{{
                    $t('checkout.total')
                  }}</q-item-section>
                  <q-item-section
                    side
                    class="text-subtitle1 text-weight-bold"
                    :class="isDark ? 'text-light' : 'text-dark'"
                  >
                    {{ formatPrice(totalPrice) }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-separator class="q-my-md" />

            <div class="tw-flex tw-flex-col sm:tw-flex-row">
              <q-card-section>
                <div class="tw-text-xl tw-mb-4 tw-font-serif">
                  {{ $t('checkout.shippingDetails') }}
                </div>
                <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.firstName') }}:
                        <span class="tw-text-xs">{{
                          orderStore.orderForm.shipping.firstName
                        }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.lastName') }}:
                        <span class="tw-text-xs">{{ orderStore.orderForm.shipping.lastName }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.email') }}:
                        <span class="tw-text-xs">{{ orderStore.orderForm.shipping.email }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.address') }}:
                        <span class="tw-text-xs">{{ orderStore.orderForm.shipping.address }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-section>
                <div class="tw-text-xl tw-mb-4 tw-font-serif">
                  {{ $t('checkout.paymentDetails') }}
                </div>
                <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.paymentMethod') }}:
                        <span class="tw-text-xs">{{
                          orderStore.orderForm.payment?.method.toUpperCase()
                        }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="orderStore.orderForm.payment?.method === 'card'">
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.cardNumber') }}:
                        <span class="tw-text-xs">{{
                          orderStore.orderForm.payment?.cardDetails?.cardNumber
                        }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="orderStore.orderForm.payment?.method === 'card'">
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.expiry') }}:
                        <span class="tw-text-xs">{{
                          orderStore.orderForm.payment?.cardDetails?.expiry
                        }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="orderStore.orderForm.payment?.method === 'card'">
                    <q-item-section>
                      <q-item-label>
                        {{ $t('checkout.cvv') }}:
                        <span class="tw-text-xs">{{
                          orderStore.orderForm.payment?.cardDetails?.cvv
                        }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </div>

            <q-separator class="q-my-md" />

            <q-card-section class="!tw-py-0">
              <q-checkbox v-model="agreeTerms" label="I agree with the terms and conditions" />
            </q-card-section>

            <q-card-section v-if="isSubmitting">
              <div class="tw-text-center tw-mt-4">
                <q-spinner-dots size="50px" color="primary" />
                <p>{{ $t('checkout.processingPayment') }}</p>
              </div>
            </q-card-section>

            <q-card-section align="center" class="tw-flex sm:!tw-flex-row tw-gap-3">
              <q-btn
                :color="color"
                :text-color="text"
                :label="$t('checkout.submitOrder')"
                class="!tw-w-full tw-mb-2 !tw-py-4 xs:!tw-w-2/3"
                :loading="isSubmitting"
                :disable="isSubmitting || !agreeTerms"
                @click="submitOrder"
              />

              <q-btn
                :outline="isDark"
                to="/checkout"
                :color="text"
                :text-color="color"
                :label="$t('checkout.backToCheckout')"
                class="!tw-w-full tw-mb-2 !tw-py-4 xs:!tw-w-1/3"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useOrderStore } from '../stores/order';
import { formatPrice } from '@/utils/currency';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { THANK_YOU_PATH } from '@/router';

const $q = useQuasar();
const orderStore = useOrderStore();
const cartStore = useCartStore();
const router = useRouter();

const isSubmitting = ref(false);
const agreeTerms = ref(false);

const isDark = computed(() => $q.dark.isActive);
const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0),
);

const submitOrder = () => {
  isSubmitting.value = true;
  // Simulate order submission
  setTimeout(() => {
    console.log('Order submitted:', orderStore.orderForm);
    cartStore.clearCart();
    orderStore.clearOrderForm();
    isSubmitting.value = false;
    router.push(THANK_YOU_PATH);
  }, 5000);
};

onMounted(() => {
  orderStore.loadOrder();
});
</script>

<style lang="scss" scoped>
.order-overview {
  .q-card__section {
    padding: 20px;
  }

  .q-list {
    width: 100%;
  }

  .q-item {
    padding: 12px 0;
  }

  .q-separator {
    margin: 12px 0;
  }
}
</style>
