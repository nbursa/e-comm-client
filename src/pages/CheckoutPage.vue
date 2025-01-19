<template>
  <q-page padding class="!tw-pb-16">
    <div class="tw-container tw-max-w-screen-xl tw-mx-auto">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <OrderForm
            v-model:step="step"
            :text="text"
            :color="color"
            :order-form="orderForm"
            @shipping-valid="shippingValid"
            @payment-valid="paymentValid"
          />
        </div>

        <!-- Order Summary -->
        <div class="col-12 col-md-4">
          <q-item
            class="tw-flex tw-justify-between tw-flex-col tw-gap-4 sm:!tw-pt-4 sm:!tw-pb-3 tw-rounded-md"
            :class="isDark ? 'tw-bg-transparent tw-text-light' : 'bg-light tw-text-dark'"
          >
            <q-item-section class="tw-w-full">
              <div class="tw-text-xl tw-mb-4">{{ $t('checkout.orderSummary') }}</div>
              <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                <q-item v-for="item in cartStore.items" :key="item.id" class="tw-justify-between">
                  <q-item-section>
                    <q-item-label>{{ item.name || item.title }}</q-item-label>
                    <q-item-label caption
                      >{{ $t('checkout.qty') }}: {{ item.quantity }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side :class="isDark ? 'text-light' : 'text-dark'">
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
                    >{{ formatPrice(totalPrice) }}</q-item-section
                  >
                </q-item>
              </q-list>
            </q-item-section>

            <q-card-actions align="center">
              <q-btn
                :color="color"
                :text-color="text"
                :label="step === 2 ? $t('checkout.orderOverview') : $t('checkout.continue')"
                :disable="(step === 1 && !isShippingValid) || (step === 2 && !isPaymentValid)"
                type="submit"
                class="full-width tw-mb-2 !tw-py-4"
                @click="nextStep()"
              />

              <div class="tw-w-full tw-flex tw-flex-row tw-gap-2">
                <q-btn
                  :color="text"
                  :text-color="color"
                  :label="step === 2 ? $t('checkout.toShipping') : $t('checkout.toCart')"
                  class="full-width !tw-py-4"
                  @click="step === 2 ? prevStep() : viewCart()"
                />

                <q-btn
                  v-if="step === 2"
                  :color="text"
                  :text-color="color"
                  :label="$t('checkout.toCart')"
                  class="full-width !tw-py-4"
                  @click="viewCart()"
                />
              </div>
            </q-card-actions>
          </q-item>
        </div>
      </div>
    </div>
    <OrderConfirmationDialog
      v-model="showDialog"
      :form="orderForm"
      :details="orderDetails"
      :color="color"
      :text="text"
      @confirm="orderOverview"
      @cancel="handleOrderCancellation"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, reactive, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import type { QVueGlobals } from 'quasar';
import { useRouter } from 'vue-router';
import { IOrderForm, OrderDetails } from '@/types';
import { formatPrice } from '@/utils/currency';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog.vue';
import { CART_PATH, ORDER_PATH } from '@/router';
import OrderForm from '@/components/OrderForm.vue';

const scrollToTop = inject('scrollToTop') as () => void;

const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const step = ref(1);
const showDialog = ref(false);
const isShippingValid = ref(false);
const isPaymentValid = ref(false);

const orderDetails = reactive<OrderDetails>({
  id: Math.floor(Math.random() * 1000),
  items: cartStore.items,
  total: cartStore.totalPrice,
});
const orderForm = reactive<IOrderForm>({
  shipping: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  },
  payment: {
    method: 'card',
    cardDetails: {
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  },
});

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const isDark = $q.dark.isActive;
const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0),
);

const orderOverview = () => {
  console.log('orderOverview:', orderForm);
};

const handleOrderCancellation = () => {
  showDialog.value = false;
};

const prevStep = () => {
  step.value--;
  scrollToTop();
};

const nextStep = () => {
  if (step.value === 1 && isShippingValid.value) {
    orderStore.setShippingForm(orderForm.shipping);
    step.value++;
    scrollToTop();
  } else if (step.value === 2 && isPaymentValid.value) {
    orderStore.setPaymentForm(orderForm.payment);
    router.push(ORDER_PATH);
  } else {
    scrollToTop();
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'Please fix errors in the form.',
      timeout: 1000,
    });
  }
};

const viewCart = () => {
  router.push(CART_PATH);
};

const shippingValid = (valid: boolean) => {
  console.log('Shipping valid:', valid);
  isShippingValid.value = valid;
};
const paymentValid = (valid: boolean) => {
  console.log('payment valid:', valid);
  isPaymentValid.value = valid;
};

const validateForm = () => {
  isShippingValid.value =
    !!orderForm.shipping.firstName &&
    !!orderForm.shipping.lastName &&
    !!orderForm.shipping.email &&
    !!orderForm.shipping.address;
  isPaymentValid.value =
    !!orderForm.payment?.method &&
    !!orderForm.payment.cardDetails?.cardNumber &&
    !!orderForm.payment.cardDetails.expiry &&
    !!orderForm.payment.cardDetails.cvv;
};

watch(
  () => orderStore.orderForm,
  (newOrderForm) => {
    orderForm.shipping = newOrderForm.shipping;
    orderForm.payment = newOrderForm.payment ?? {
      method: 'card',
      cardDetails: {
        cardNumber: '',
        expiry: '',
        cvv: '',
      },
    };
    validateForm();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  orderStore.loadOrder();
  validateForm();
  scrollToTop();
});
</script>

<style lang="scss" scoped>
.checkout-stepper {
  box-shadow: none;
  :deep(.q-stepper__tab--active),
  :deep(.q-stepper__tab--done) {
    color: v-bind(color);

    .q-stepper__title {
      color: v-bind(color);
    }

    .q-stepper__icon {
      color: v-bind(text);
      background: v-bind(color);
    }
  }
}

.order-summary {
  position: sticky;
  top: 20px;
  width: 100%;

  :deep(.q-card__section) {
    padding: 20px;
  }

  :deep(.q-list) {
    width: 100%;
  }

  :deep(.q-item) {
    padding: 12px 0;
  }

  :deep(.q-separator) {
    margin: 12px 0;
  }
}
:deep(.q-stepper__step) {
  .q-stepper__step-inner {
    padding: 1rem 1.15rem;
    .q-form {
      padding-top: 1rem;
    }
    @media screen and (min-width: 600px) {
      padding: 0 24px 32px 60px;
    }
  }
}
</style>
