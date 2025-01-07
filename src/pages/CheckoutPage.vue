<template>
  <q-page padding>
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
                      :rules="[required, email]"
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
        <q-card class="order-summary">
          <q-card-section>
            <div class="text-h6">{{ $t('checkout.orderSummary') }}</div>
            <q-list>
              <q-item v-for="item in cartStore.items" :key="item.id">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ $t('checkout.qty') }}: {{ item.quantity }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  {{ formatPrice(item.price * item.quantity) }}
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>{{ $t('checkout.total') }}</q-item-section>
                <q-item-section side>{{ formatPrice(totalPrice) }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              :color="color"
              :text-color="text"
              :label="step === 2 ? $t('checkout.placeOrder') : $t('checkout.continue')"
              class="full-width"
              @click="step === 2 ? placeOrder() : nextStep()"
            />
          </q-card-actions>
        </q-card>
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

const required = (val: string) => !!val || 'Field is required';
const email = (val: string) =>
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

const placeOrder = async () => {
  $q.loading.show();
  try {
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
