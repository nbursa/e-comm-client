<template>
  <q-page padding>
    <div class="tw-container tw-max-w-screen-xl tw-mx-auto">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-stepper
            v-model="step"
            vertical
            class="checkout-stepper"
            :color="color"
            :text-color="text"
            header-nav
          >
            <!-- Shipping Step -->
            <q-step
              :name="1"
              :title="$t('checkout.shipping')"
              icon="local_shipping"
              :done="step > 1"
              class="checkout-step"
              :header-nav="true"
            >
              <q-card flat bordered>
                <q-card-section>
                  <q-form class="row q-col-gutter-md" @submit.prevent="validateShipping">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.firstName"
                        :label="$t('checkout.firstName')"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.lastName"
                        :label="$t('checkout.lastName')"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="form.email"
                        :label="$t('checkout.email')"
                        type="email"
                        :rules="[required, emailRules]"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="form.address"
                        :label="$t('checkout.address')"
                        :rules="[required]"
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-step>

            <!-- Payment Step -->
            <q-step
              :name="2"
              :title="$t('checkout.payment')"
              icon="payment"
              :done="step > 2"
              :header-nav="true"
            >
              <q-card flat bordered>
                <q-card-section>
                  <q-form class="row q-col-gutter-md" @submit.prevent="validatePayment">
                    <div class="col-12">
                      <q-input
                        v-model="payment.cardNumber"
                        :label="$t('checkout.cardNumber')"
                        mask="#### #### #### ####"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        v-model="payment.expiry"
                        label="MM/YY"
                        mask="##/##"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input v-model="payment.cvv" label="CVV" mask="###" :rules="[required]" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-step>
          </q-stepper>
        </div>

        <!-- Order Summary -->
        <div class="col-12 col-md-4">
          <q-card class="tw-flex tw-justify-between">
            <q-card-section class="tw-w-full">
              <div class="tw-text-xl tw-mb-4">{{ $t('checkout.orderSummary') }}</div>
              <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                <q-item v-for="item in cartStore.items" :key="item.id" class="tw-justify-between">
                  <q-item-section>
                    <q-item-label>{{ item.name || item.title }}</q-item-label>
                    <q-item-label caption
                      >{{ $t('checkout.qty') }}: {{ item.quantity }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side>
                    {{ formatPrice(item.price * item.quantity) }}
                  </q-item-section>
                </q-item>
                <q-separator class="q-my-md" />
                <q-item>
                  <q-item-section class="text-subtitle1 text-weight-bold">{{
                    $t('checkout.total')
                  }}</q-item-section>
                  <q-item-section side class="text-subtitle1 text-weight-bold tw-text-">{{
                    formatPrice(totalPrice)
                  }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                :color="color"
                :text-color="text"
                :label="step === 2 ? $t('checkout.placeOrder') : $t('checkout.continue')"
                class="full-width tw-mb-2"
                @click="step === 2 ? showOrderConfirmation() : nextStep()"
              />
              <q-btn
                :color="text"
                :text-color="color"
                :label="$t('checkout.cart')"
                class="full-width"
                @click="goBack()"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import type { QVueGlobals } from 'quasar/dist/types/globals';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { OrderDetails } from '@/types';

const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();

const step = ref(1);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
});

const payment = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
});

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0),
);

const email = import.meta.env.VITE_EMAIL_ADMIN || '';
const orderDetails: OrderDetails = {
  id: Math.floor(Math.random() * 1000),
  items: cartStore.items,
  total: totalPrice.value,
  firstName: form.value.firstName,
  lastName: form.value.lastName,
  email: form.value.email,
  address: form.value.address,
  cardNumber: payment.value.cardNumber,
  cvv: payment.value.cvv,
  expiry: payment.value.expiry,
};

const required = (val: string) => !!val || 'Field is required';
const emailRules = (val: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Invalid email';

const validateShipping = () => {
  step.value++;
};

const validatePayment = () => {
  step.value++;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const goBack = () => {
  router.push('/cart');
};

const showOrderConfirmation = () => {
  $q.dialog({
    title: t('checkout.title'),
    message: `
      <div class="tw-flex tw-flex-col tw-items-start full-width">
        <h6 class="q-my-none">${t('checkout.summary')}</h6>
        <p class="text-h6 q-mb-md">${t('checkout.total')}: ${formatPrice(orderDetails.total)}</p>

        <div class="q-mb-md">
          <strong>${t('checkout.shippingDetails')}:</strong>
          <p class="q-mb-none">${orderDetails.firstName} ${orderDetails.lastName}</p>
          <p class="q-mb-none">${orderDetails.email}</p>
          <p class="q-mb-none">${orderDetails.address}</p>
        </div>

        <div class="q-mb-md">
          <strong>${t('checkout.paymentInfo')}:</strong>
          <p class="q-mb-none">${t('checkout.card')}: **** **** **** ${orderDetails.cardNumber.slice(-4)}</p>
          <p class="q-mb-none">${t('checkout.expiry')}: ${orderDetails.expiry}</p>
        </div>

        <div class="q-mt-sm full-width">
          <strong>${t('checkout.items')}:</strong>
          ${orderDetails.items
            .map(
              (item) => `
            <div class="q-py-sm full-width tw-flex tw-justify-between tw-items-center">
              <div class="tw-flex-shrink-0 tw-mr-32">${item.name || item.title}</div>
              <div class="tw-flex-grow tw-flex tw-justify-between tw-items-center tw-gap-2">
                <div>${item.quantity}</div> <div>${formatPrice(item.price)}</div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `,
    html: true,
    persistent: true,
    class: 'confirm-dialog',
    ok: {
      label: t('checkout.confirmButton'),
      flat: true,
      style: `opacity: 1 !important; box-shadow: inset 0 0 0 2px ${color.value}; color: ${text.value} !important;`,
      class: `bg-${color.value} lt-sm:full-width`,
    },
    cancel: {
      label: t('checkout.cancelButton'),
      flat: true,
      style: `opacity: 1 !important; box-shadow: inset 0 0 0 2px ${color.value}; color: ${color.value} !important;`,
      class: `lt-sm:full-width lt-sm:q-mt-sm tw-border-${color.value}`,
    },
    style: {
      maxWidth: '600px',
      width: '95vw',
      margin: '0 auto',
    },
  }).onOk(() => {
    if (process.env.NODE_ENV === 'production') {
      cartStore.clearCart();
      router.push('/thankyou');
    } else {
      emailOrder();
    }
  });
};

const emailOrder = async () => {
  $q.loading.show();
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        orderDetails,
      }),
    });

    if (!response.ok) throw new Error('Failed to send email');

    cartStore.clearCart();
    router.push('/thankyou');
  } catch {
    $q.notify({
      color: 'negative',
      message: t('checkout.orderFailed'),
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const nextStep = () => {
  step.value++;
};
</script>

<style lang="scss" scoped>
.checkout-stepper {
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
</style>
